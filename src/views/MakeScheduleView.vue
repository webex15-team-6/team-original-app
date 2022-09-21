<template>
  <div v-if="inputMode === 0">
    <div class="username-form">
      <section class="label-username">ユーザー名</section>
      <input type="text" v-model="userName" class="input-username" />
    </div>
    <div class="traveltitle-form">
      <section class="label-traveltitle">旅のタイトル</section>
      <input type="text" v-model="tripTitle" class="input-label-traveltitle" />
    </div>
    <div class="date-form">
      <section class="label-date">日程</section>
      <input type="date" v-model="tripDate" class="input-date" />
    </div>
    <div class="howmanydays-form">
      <section>何日間</section>
      <input type="number" v-model="howManyDays" />
    </div>
    <section class="member-form">
      <span>男性 </span>
      <input type="number" v-model="numberMan" class="input-man-number" />
      <span class="woman-form">女性 </span>
      <input type="number" v-model="numberWoman" class="input-woman-number" />
    </section>
    <div>
      <div class="thumbnail-form">
        <section>サムネイル画像</section>
        <input
          type="text"
          @click="changeThumbnail"
          v-model="inputThumbnail"
          class="input-thumbnail"
        />
        <button
          v-on:click="confirmThumbnail()"
          class="thumbnail-confirm-button"
        >
          確認
        </button>
      </div>
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
    <div>
      <h1>概要（{{ dayCounter }}日目）</h1>
      <div class="prefecture-form">
        <section>都道府県</section>
        <input type="text" v-model="inputPrefecture" />
      </div>
      <span class="cost-form">
        <section>費用</section>
        <input type="text" v-model="inputCost" class="input-cost" /> 円
      </span>
      <div class="contents">
        <div class="display-route">
          <div
            v-for="(route, index) in routes.filter(
              (route) => route.day === dayCounter
            )"
            v-bind:key="index"
          >
            {{ index + 1 }}番目： {{ route.place }}
          </div>
        </div>
      </div>
      <div>
        <section>経路</section>
        <input type="text" v-model="inputRoute" />
        <div>
          <button
            @click="addRoutes"
            v-bind:disabled="!isCompleteRouteForm"
            class="add-route-button"
          >
            追加
          </button>
        </div>
      </div>
      <div>
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
              <div class="schedule__main">
                <h2 class="schedule">
                  {{ schedule.time }} {{ schedule.activity }}
                </h2>
              </div>

              <div class="detail">{{ schedule.detail }}</div>
              <div
                v-if="schedule.mouseOverFlag && !isMakingAnySchedule"
                class="operation-button"
              >
                <button
                  v-on:click="makeNewSchedule(index), mouseLeaveAction(index)"
                >
                  追加
                </button>
                <button
                  v-on:click="deleteSchedule(index)"
                  class="delete-button"
                >
                  削除
                </button>
              </div>
            </div>

            <div v-if="schedule.isMakingAfterSKD" class="new-schedule-form">
              <input type="time" step="300" v-model="time" />
              <div>やったこと</div>
              <input type="text" v-model="activity" required />
              <div>詳細</div>
              <input type="text" v-model="detail" />

              <section>参考画像</section>

              <input
                type="text"
                v-model="inputRefImage"
                @click="changeRefImage"
                class="first-schedule-input-image"
              />
              <button @click="confirmRefImage">確認</button>

              <div>
                <img
                  v-if="showRefImage"
                  v-bind:src="inputRefImage"
                  alt="refImage"
                  width="300"
                  height="200"
                />
              </div>

              <div class="new-schedule-operation-button">
                <button
                  v-on:click="addNewSKD(index)"
                  v-bind:disabled="!isCompleteForm"
                  class="add-new-SKD-button"
                >
                  完了
                </button>
                <button v-on:click="cancelMaking(index)" class="cancel-button">
                  取り消し
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="isTodayScheduleEmpty">
          <input type="time" step="300" v-model="time" />
          <section>やったこと</section>
          <input type="text" v-model="activity" />
          <section>詳細</section>
          <input type="text" v-model="detail" />

          <section>参考画像</section>

          <input
            type="text"
            v-model="inputRefImage"
            @click="changeRefImage"
            class="first-schedule-input-image"
          />
          <button @click="confirmRefImage">確認</button>
          <div>
            <img
              v-if="showRefImage"
              v-bind:src="inputRefImage"
              alt="refImage"
              width="300"
              height="200"
            />
          </div>

          <div>
            <button
              v-on:click="addFirstSKD"
              v-bind:disabled="!isCompleteForm"
              class="add-first-SKD-button"
            >
              追加
            </button>
          </div>
        </div>

        <button
          v-if="dayCounter !== 1"
          v-on:click="goToPrevDay"
          v-bind:class="{
            'before-day-button': isExitTwoButton === true,
            hoge: isExitTwoButton === flase,
          }"
        >
          前の日へ
        </button>
        <button
          v-bind:disabled="
            isTodayScheduleEmpty ||
            isMakingAnySchedule ||
            !isCompleteOverviewForm
          "
          v-on:click="goToNextDay"
          v-if="!isMaxDay"
        >
          次の日へ
        </button>

        <div>
          <button
            v-if="this.dayCounter === this.howManyDays"
            v-bind:disabled="
              isTodayScheduleEmpty ||
              isMakingAnySchedule ||
              !isCompleteOverviewForm
            "
            v-on:click="goToConfirm"
            class="OK"
          >
            完成
          </button>
        </div>
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

      inputPhoto: "",
      inputCost: "",
      inputPrefecture: "",
      prefectures: [],
      costs: [],
      isConfirmPhoto: false,
      overviewFlag: true,
      inputRefImage: "",
      showRefImage: false,
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
        photo: this.inputRefImage,
      })

      this.activity = ""
      this.detail = ""
      this.inputRefImage = ""
      this.showRefImage = false
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
        photo: this.inputRefImage,
      })

      this.schedules[idx].isMakingAfterSKD = false

      this.activity = ""
      this.detail = ""
      this.inputRefImage = ""
      this.showRefImage = false
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
    confirmRefImage() {
      this.showRefImage = true
    },
    goToNextDay() {
      this.costs.push({
        cost: this.inputCost,
        day: this.dayCounter,
      })

      this.prefectures.push({
        prefecture: this.inputPrefecture,
        day: this.dayCounter,
      })

      this.dayCounter = this.dayCounter + 1
      this.overviewFlag = true

      this.inputPrefecture = ""
      this.inputCost = ""
    },
    goToPrevDay() {
      this.dayCounter = this.dayCounter - 1
      this.inputCost = this.costs[this.dayCounter - 1].cost
      this.inputPrefecture = this.prefectures[this.dayCounter - 1].prefecture
    },
    goToConfirm() {
      this.inputMode = 2

      if (this.costs.filter((p) => p.day === this.dayCounter).length === 0) {
        this.costs.push({
          cost: this.inputCost,
          day: this.dayCounter,
        })
      }

      if (
        this.prefectures.filter((p) => p.day === this.dayCounter).length === 0
      ) {
        this.prefectures.push({
          prefecture: this.inputPrefecture,
          day: this.dayCounter,
        })
      }
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
          photo: this.schedules[i].photo,
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
    changeRefImage() {
      this.showRefImage = false
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

      this.isConfirmPhoto = false
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

      if (this.inputRoute !== "") {
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
    isExitTwoButton() {
      if (this.dayCounter !== 1 && !this.isMaxDay) {
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

.gotoSchedulePage-button {
  margin-top: 10px;
}
.thumbnail-confirm-button {
  margin-left: 5px;
}
.cost-form {
  margin-top: 10px;
  text-align: center;
}
.add-route-button {
  margin-top: 10px;
  text-align: center;
}
.before-day-button {
  margin-right: 20px;
}
section {
  margin-top: 10px;
}
.contents {
  text-align: center;
  margin: 0;
}
.contents__ul {
  padding-left: 0;
  padding-top: 0;
  padding-bottom: 0;
  list-style: none;
  display: inline-block;
}
.contents__li {
  text-align: left;
  padding: 0;
}
.input-ref-image {
  display: block;
  text-align: center;
}
.schedule__main {
  text-align: center;
}
.schedule {
  margin-right: 40px;
}
.operation-button {
  text-align: center;
}
.delete-button {
  margin-left: 10px;
  margin-right: 40px;
}
.input-cost {
  margin-left: 20px;
}
.new-schedule-form {
  margin-right: 40px;
  margin-top: 30px;
}
.first-schedule-input-image {
  margin-left: 40px;
}
.detail {
  margin-right: 40px;
}
.input-thumbnail {
  margin-left: 40px;
}
.woman-form {
  margin-left: 20px;
}
.input-man-number {
  width: 40px;
}
.input-woman-number {
  width: 40px;
}
.display-route {
  margin: 10px;
}
.new-schedule-operation-button {
  margin-top: 10px;
}
.add-first-SKD-button {
  margin: 5px;
}
.cancel-button {
  margin-left: 5px;
}
.add-new-SKD-button {
  margin-left: 20px;
}
.OK {
  margin-top: 20px;
}
</style>
