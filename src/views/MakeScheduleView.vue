<template>
  <div v-if="inputMode === 0">
    <div class="username-form">
      <label class="label-username"> ユーザー名 </label>
      <input type="text" v-model="userName" class="input-username" />
    </div>
    <div class="traveltitle-form">
      <label class="label-traveltitle">旅のタイトル</label>
      <input type="text" v-model="tripTitle" class="input-label-traveltitle" />
    </div>
    <div class="date-form">
      <label class="label-date">日程</label>
      <input type="date" v-model="tripDate" class="input-date" />
    </div>
    <div class="howmanydays-form">
      <label>何日間</label><input type="number" v-model="howManyDays" />
    </div>
    <div>
      <label>男性</label>
      <input type="number" v-model="numberMan" class="input-man" />
      <span>女性</span
      ><input type="number" v-model="numberWoman" class="input-woman" />
    </div>
    <div>
      <label>サムネイル画像</label>
      <input type="text" @click="changeThumbnail" v-model="inputThumbnail" />
      <button v-on:click="confirmThumbnail()" class="thumbnail-confirm-button">
        確認
      </button>
    </div>
    <img
      v-if="isConfirmThumbnail"
      v-bind:src="inputThumbnail"
      alt="thumbnail"
      width="300"
      height="200"
    />
    <div>
      <button
        v-bind:disabled="!isCompleteFirstForm"
        v-on:click="gotoSchedulePage"
        class="gotoSchedulePage-button"
      >
        完了
      </button>
    </div>
  </div>

  <div v-if="inputMode === 1">
    <div v-if="overviewFlag">
      <h1>概要（{{ dayCounter }}日目）</h1>
      <div>都道府県<input type="text" v-model="inputPrefecture" /></div>
      <div>費用<input type="text" v-model="inputCost" />円</div>
      <ul>
        <li
          v-for="(route, index) in routes.filter(
            (route) => route.day === dayCounter
          )"
          v-bind:key="index"
        >
          <div v-if="route.day === this.dayCounter">
            {{ index + 1 }}番目： {{ route.place }}
          </div>
        </li>
      </ul>
      <div>
        経路<input type="text" v-model="inputRoute" /> 参考画像<input
          type="text"
          @click="changePhoto"
          v-model="inputPhoto"
        />
        <button v-on:click="confirmPhoto()">確認</button>
      </div>
      <img
        v-if="isConfirmPhoto"
        v-bind:src="inputPhoto"
        alt="photo"
        width="300"
        height="200"
      />
      <div>
        <button @click="addRoutes" v-bind:disabled="!isCompleteRouteForm">
          追加
        </button>
      </div>
      <div><button @click="addOverview">完了</button></div>
    </div>
    <div v-if="!overviewFlag">
      <h1>スケジュールの作成（{{ dayCounter }}日目）</h1>
      <ul class="schedule-list__container">
        <li
          class="schedule-list"
          v-for="(schedule, index) in schedules"
          v-bind:key="index"
        >
          <div
            v-on:mouseover="mouseOverAction(index)"
            v-on:mouseleave="mouseLeaveAction(index)"
            v-if="schedule.day === this.dayCounter"
          >
            <h2 class="schedule__main">
              {{ schedule.time }} {{ schedule.activity }}
            </h2>
            <div>{{ schedule.detail }}</div>
            <button
              v-if="schedule.mouseOverFlag && !isMakingAnySchedule"
              v-on:click="makeNewSchedule(index), mouseLeaveAction(index)"
            >
              下に追加
            </button>
            <button
              v-if="schedule.mouseOverFlag && !isMakingAnySchedule"
              v-on:click="deleteSchedule(index)"
            >
              削除
            </button>
          </div>

          <div v-if="schedule.isMakingAfterSKD">
            <input type="time" step="300" v-model="time" />
            <div>やったこと</div>
            <input type="text" v-model="activity" required />
            <div>詳細</div>
            <input type="text" v-model="detail" />
            <div>
              <button
                v-on:click="addNewSKD(index)"
                v-bind:disabled="!isCompleteForm"
              >
                完了
              </button>
              <button v-on:click="cancelMaking(index)">取り消し</button>
            </div>
          </div>
        </li>
      </ul>

      <div v-if="isTodayScheduleEmpty">
        <input type="time" step="300" v-model="time" />
        <div>やったこと</div>
        <input type="text" v-model="activity" />
        <div>詳細</div>
        <input type="text" v-model="detail" />
        <div>
          <button v-on:click="addFirstSKD" v-bind:disabled="!isCompleteForm">
            追加
          </button>
        </div>
      </div>

      <button v-if="dayCounter !== 1" v-on:click="goToPrevDay">前の日へ</button>
      <button
        v-bind:disabled="isTodayScheduleEmpty || isMakingAnySchedule"
        v-on:click="goToNextDay"
        v-if="!isMaxDay"
      >
        次の日へ
      </button>
      <div>
        <button
          v-if="this.dayCounter === this.howManyDays"
          v-bind:disabled="isTodayScheduleEmpty || isMakingAnySchedule"
          v-on:click="goToConfirm"
        >
          完成
        </button>
      </div>
    </div>
  </div>
  <ConfirmSchedule v-bind:schedules="this.schedules" v-if="inputMode === 2" />

  <button v-if="inputMode === 2" v-on:click="postSchedule">投稿</button>
  <button v-if="inputMode === 2" v-on:click="goBackMakePage">戻る</button>
</template>

<script>
import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase.js"
import ConfirmSchedule from "../components/ConfirmSchedule.vue"
import { doc, setDoc } from "firebase/firestore"

export default {
  components: { ConfirmSchedule },
  data() {
    return {
      totalSchedules: [],
      schedules: [],
      time: "07:00",
      detail: "",
      activity: "",
      dayCounter: 1,
      isMakingFirstSKD: false,
      confirmFlag: false,
      inputMode: 0,
      inputThumbnail: "",
      isConfirmThumbnail: false,
      userName: "",
      tripTitle: "",
      tripDate: "",
      numberMan: "",
      numberWoman: "",
      howManyDays: "",
      routes: [],
      inputRoute: "",
      photos: [],
      inputPhoto: "",
      inputCost: "",
      inputPrefecture: "",
      prefectures: [],
      costs: [],
      isConfirmPhoto: false,
      overviewFlag: true,
    }
  },
  methods: {
    makeFirstSKD() {
      this.isMakingFirstSKD = true
    },
    addFirstSKD() {
      this.isMakingFirstSKD = false

      this.schedules.push({
        time: this.time,
        activity: this.activity,
        detail: this.detail,
        day: this.dayCounter,
      })

      this.activity = ""
      this.detail = ""
    },
    mouseOverAction(idx) {
      this.schedules[idx].mouseOverFlag = true
    },
    mouseLeaveAction(idx) {
      this.schedules[idx].mouseOverFlag = false
    },
    makeNewSchedule(idx) {
      this.schedules[idx].isMakingAfterSKD = true
    },
    async submitSKD() {
      await addDoc(collection(db, "hoge"), this.schedules[0])
    },
    deleteSchedule(idx) {
      this.schedules.splice(idx, 1)
    },
    isValidTime(pt, nt, ct) {
      pt = pt.split(":")
      nt = nt.split(":")
      ct = ct.split(":")

      // 前の時間より後かどうかをチェック
      if (Number(pt[0]) > Number(ct[0])) {
        // 前の時間 > 現在の時間
        return false
      } else if (
        Number(pt[0]) === Number(ct[0]) &&
        Number(pt[1]) > Number(ct[1]) // 前の分 > 現在の分
      ) {
        return false
      }

      // 次の時間より前かチェック
      if (Number(ct[0]) > Number(nt[0])) {
        // 現在の時間 > 次の時間
        return false
      } else if (
        Number(ct[0]) === Number(nt[0]) &&
        Number(ct[1]) > Number(nt[1]) // 現在の分 > 次の分
      ) {
        return false
      }

      return true
    },
    addNewSKD(idx) {
      // まずは範囲内の時間であるかチェックする
      const prev = this.getPrevTime(idx)
      const next = this.getNextTime(idx)

      if (!this.isValidTime(prev, next, this.time)) {
        alert("時間は" + prev + "以上" + next + "以下で入力してください")
        return
      }

      this.schedules.splice(idx + 1, 0, {
        time: this.time,
        activity: this.activity,
        detail: this.detail,
        day: this.dayCounter,
      })

      this.schedules[idx].isMakingAfterSKD = false
      this.activity = ""
      this.detail = ""
    },

    getPrevTime(idx) {
      return this.schedules[idx].time
    },
    getNextTime(idx) {
      if (idx < this.schedules.length - 1) {
        if (this.schedules[idx + 1].day === this.dayCounter) {
          return this.schedules[idx + 1].time
        }
      }

      return "23:59"
    },
    goToNextDay() {
      this.dayCounter = this.dayCounter + 1
      this.overviewFlag = true

      this.inputPrefecture = ""
      this.inputCost = ""
    },
    goToPrevDay() {
      this.dayCounter = this.dayCounter - 1
    },
    goToConfirm() {
      this.inputMode = 2
    },
    goBackMakePage() {
      this.inputMode = 1
    },
    // async postSchedule() {
    //   // overviewの投稿
    //   const overvieRef = doc(
    //     db,
    //     "schedule",
    //     this.userName,
    //     this.tripTitle,
    //     "overview"
    //   )

    //   await setDoc(overvieRef, {
    //     thumbnail: this.inputThumbnail,
    //     man: this.numberMan,
    //     woman: this.numberWoman,
    //     date: this.tripDate,
    //     howManyDays: this.howManyDays,
    //   })

    //   const tmpSchedule = []

    //   for (let i = 0; i < this.schedules.length; i++) {
    //     tmpSchedule.push({
    //       activity: this.schedules[i].activity,
    //       detail: this.schedules[i].detail,
    //       time: this.schedules[i].time,
    //       day: this.schedules[i].day,
    //     })
    //   }

    //   // 各Dayのスケジュール投稿
    //   for (let d = 1; d <= this.howManyDays; d++) {
    //     const filterSchedule = tmpSchedule.filter(
    //       (schedule) => schedule.day === d
    //     )

    //     const filterRoute = this.routes.filter((route) => route.day === d)
    //     const filterCost = this.costs.filter((cost) => cost.day === d)
    //     const filterPrefecture = this.prefectures.filter(
    //       (prefecture) => prefecture.day === d
    //     )
    //     const filterPhoto = this.photos.filter((photo) => photo.day === d)

    //     const DayRef = doc(
    //       db,
    //       "schedule",
    //       this.userName,
    //       this.tripTitle,
    //       "Day" + d
    //     )

    //     await setDoc(DayRef, {
    //       schedule: filterSchedule,
    //       photo: filterPhoto,
    //       cost: filterCost,
    //       route: filterRoute,
    //       prefecture: filterPrefecture,
    //     })
    //   }

    //   // usernameへの投稿
    //   const tmpPrefecture = []

    //   for (let i = 0; i < this.prefectures.length; i++) {
    //     tmpPrefecture.push(this.prefectures[i].prefecture)
    //   }

    //   await setDoc(doc(db, "schedule", this.userName), {
    //     list: {
    //       prefectures: tmpPrefecture,
    //       name: this.userName,
    //       thumbnail: this.inputThumbnail,
    //       travel_name: this.tripTitle,
    //     },
    //   })

    //   alert("スケジュールを投稿しました")
    // },
    async postSchedule() {
      // overviewの投稿
      const overvieRef = doc(
        db,
        "schedule01",
        this.userName,
        "Travel",
        this.tripTitle,
        this.tripTitle,
        "overview"
      )

      await setDoc(overvieRef, {
        thumbnail: this.inputThumbnail,
        man: this.numberMan,
        woman: this.numberWoman,
        date: this.tripDate,
        howManyDays: this.howManyDays,
      })

      const tmpSchedule = []

      for (let i = 0; i < this.schedules.length; i++) {
        tmpSchedule.push({
          activity: this.schedules[i].activity,
          detail: this.schedules[i].detail,
          time: this.schedules[i].time,
          day: this.schedules[i].day,
        })
      }

      // 各Dayのスケジュール投稿
      for (let d = 1; d <= this.howManyDays; d++) {
        const filterSchedule = tmpSchedule.filter(
          (schedule) => schedule.day === d
        )

        const filterRoute = this.routes.filter((route) => route.day === d)
        const filterCost = this.costs.filter((cost) => cost.day === d)
        const filterPrefecture = this.prefectures.filter(
          (prefecture) => prefecture.day === d
        )
        const filterPhoto = this.photos.filter((photo) => photo.day === d)

        const DayRef = doc(
          db,
          "schedule01",
          this.userName,
          "Travel",
          this.tripTitle,
          this.tripTitle,
          "Day" + d
        )

        await setDoc(DayRef, {
          schedule: filterSchedule,
          photo: filterPhoto,
          cost: filterCost,
          route: filterRoute,
          prefecture: filterPrefecture,
        })
      }

      // 和さん用投稿
      await setDoc(doc(db, "schedule01", this.userName), {
        name: this.userName,
      })

      const tmpPrefecture = []

      for (let i = 0; i < this.prefectures.length; i++) {
        tmpPrefecture.push(this.prefectures[i].prefecture)
      }

      await setDoc(
        doc(db, "schedule01", this.userName, "Travel", this.tripTitle),
        {
          name: this.userName,
          thumbnail: this.inputThumbnail,
          travelname: this.tripTitle,
          prefectures: tmpPrefecture,
        }
      )

      alert("スケジュールを投稿しました")
      this.$router.push("/")
    },
    cancelMaking(idx) {
      this.schedules[idx].isMakingAfterSKD = false
      this.activity = ""
      this.detail = ""
    },
    confirmThumbnail() {
      this.isConfirmThumbnail = true
    },
    changeThumbnail() {
      this.isConfirmThumbnail = false
    },
    confirmPhoto() {
      this.isConfirmPhoto = true
    },
    changePhoto() {
      this.isConfirmPhoto = false
    },
    async gotoSchedulePage() {
      this.inputMode = 1
    },
    addRoutes() {
      this.routes.push({ place: this.inputRoute, day: this.dayCounter })
      this.inputRoute = ""

      this.photos.push({ photo: this.inputPhoto, day: this.dayCounter })
      this.inputPhoto = ""

      this.isConfirmPhoto = false
    },
    addOverview() {
      this.costs.push({ cost: this.inputCost, day: this.dayCounter })

      this.prefectures.push({
        prefecture: this.inputPrefecture,
        day: this.dayCounter,
      })
      this.overviewFlag = false
    },
  },
  computed: {
    isTodayScheduleEmpty() {
      let ret = true
      for (let i = 0; i < this.schedules.length; i++) {
        if (this.schedules[i].day === this.dayCounter) {
          ret = false
        }
      }

      return ret
    },
    isMakingAnySchedule() {
      let ret = false

      if (this.isMakingFirstSKD) {
        ret = true
      }

      for (let i = 0; i < this.schedules.length; i++) {
        if (this.schedules[i].isMakingAfterSKD) {
          ret = true
        }
      }

      return ret
    },
    isCompleteForm() {
      let ret = false

      if (this.time !== "" && this.activity !== "") {
        ret = true
      }

      return ret
    },
    isCompleteFirstForm() {
      let ret = false

      if (
        this.userName !== "" &&
        this.tripTitle !== "" &&
        this.inputThumbnail !== "" &&
        this.tripDate !== "" &&
        this.numberMan !== "" &&
        this.numberWoman !== "" &&
        this.howManyDays !== ""
      ) {
        ret = true
      }

      return ret
    },
    isCompleteRouteForm() {
      let ret = false

      if (this.inputPhoto !== "" && this.inputRoute !== "") {
        ret = true
      }

      return ret
    },
    isCompleteOverviewForm() {
      let ret = false

      if (this.inputCost !== "" && this.inputPrefecture !== "") {
        ret = true
      }

      return ret
    },
    isMaxDay() {
      if (this.dayCounter === this.howManyDays) {
        return true
      }
      return false
    },
  },
}
</script>

<style>
ul {
  list-style: none;
}

/* 
input.input-username {
  margin-left: 10px;
}
input.input-traveltitle {
  margin-left: 10px;
} */
</style>
