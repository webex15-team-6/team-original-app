<template>
  <button v-on:click="gotoSchedulePage">スケジュールを作成する</button>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue"

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
  methods: {
    gotoSchedulePage() {
      this.$router.push("/MakeSchedule")
    },
  },
}
</script>
