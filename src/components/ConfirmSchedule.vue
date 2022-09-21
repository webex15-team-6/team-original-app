<template>
  <h1>確認ページ</h1>
  <ul class="schedule-list__container">
    <li
      class="schedule-list"
      v-for="(schedule, index) in this.schedules"
      v-bind:key="index"
    >
      <h2 v-if="isNewDay(index)" class="date">{{ schedule.day }}日目</h2>
      <h3 class="schedule">{{ schedule.time }} {{ schedule.activity }}</h3>
      <div>{{ schedule.detail }}</div>
      <img
        v-if="schedule.photo !== ''"
        v-bind:src="schedule.photo"
        alt="refPhoto"
        width="300"
        height="200"
      />
    </li>
  </ul>
</template>

<script>
export default {
  props: ["schedules", "confirmFlag"],
  data() {
    return {}
  },
  methods: {
    isNewDay(idx) {
      if (idx === 0) return true
      if (this.schedules[idx].day !== this.schedules[idx - 1].day) {
        return true
      }

      return false
    },
  },
}
</script>

<style>
.date {
  margin-right: 40px;
}
.schedule {
  margin-right: 40px;
}
</style>
