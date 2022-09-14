<template>
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
          追加
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
  <button v-bind:disabled="isTodayScheduleEmpty" v-on:click="goToNextDay">
    次の日へ
  </button>
  <div>
    <button v-on:click="postSchedule">投稿</button>
  </div>
</template>

<script>
import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase.js"

export default {
  data() {
    return {
      totalSchedules: [],
      schedules: [],
      time: "07:00",
      detail: "",
      activity: "",
      dayCounter: 1,
      isMakingFirstSKD: false,
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
        return this.schedules[idx + 1].time
      }

      return "23:59"
    },
    goToNextDay() {
      this.dayCounter = this.dayCounter + 1
    },
    goToPrevDay() {
      this.dayCounter = this.dayCounter - 1
    },
    async postSchedule() {
      // 各Dayごとにアップしていく
      for (let i = 0; i < this.schedules.length; i++) {
        const tmp = {
          day: this.schedules[i].day,
          time: this.schedules[i].time,
          activity: this.schedules[i].activity,
          detail: this.schedules[i].detail,
        }

        await addDoc(collection(db, "Day" + tmp.day), tmp)
      }

      alert("スケジュールを投稿しました")
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
  },
}
</script>

<style>
ul {
  list-style: none;
}
</style>
