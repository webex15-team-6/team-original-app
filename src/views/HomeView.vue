<template>
  <div>
    <div>
      <input v-model="target" placeholder="都道府県から探す" />
      <button v-on:click="Search">Search</button>
      <br />
      <br />
      <div v-for="(user, index) in user_travel_data" v-bind:key="index">
        <div>{{ user.name }} / {{ user.travelname }}</div>
        <router-link to="/detail"
          ><img
            v-on:click="addUserInf(user.name, user.travelname)"
            v-bind:src="user.thumbnail"
            alt="a"
            width="300"
            height="200"
        /></router-link>
        <br />
        <br />
      </div>
    </div>
    <br />
    <br />
    <button v-on:click="gotoSchedulePage">スケジュールを作成する</button>
  </div>
</template>

<style></style>

<script>
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/firebase.js"
import { doc, setDoc } from "firebase/firestore"

export default {
  data() {
    return {
      datas: [],
      user_travel_data: [],
      users: [],
      target: "",
      route: "",
    }
  },
  methods: {
    /*検索関数 完成*/
    async Search() {
      this.user_travel_data = [] //初期化
      //走査
      for (let i = 0; i < this.users.length; i++) {
        let q = query(
          collection(db, "schedule01", this.users[i], "Travel"),
          where("prefectures", "array-contains", this.target)
        )
        let querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          this.user_travel_data.push(doc.data())
        })
      }
    },
    gotoSchedulePage() {
      this.$router.push("/MakeSchedule")
    },
    /*Firebaseに引き継ぎたい情報/ページ遷移先に必要な情報を入れる*/
    async addUserInf(user_name, taravel_name) {
      //同一のドキュメントにuser名とサブコレクション名を保存
      await setDoc(doc(db, "SpecificUserInformation", "temp"), {
        specificUserName: user_name,
        specificUserTravelName: taravel_name,
      })
    },
  },
  created() {
    //ホーム画面でshcedule/sampleからとってきた旅行を表示する為にデータを取ってくる
    getDocs(collection(db, "schedule01"))
      .then((snapshot) => {
        for (let i = 0; i < snapshot.docs.length; i++) {
          this.users.push(snapshot.docs[i].id)
        }
        return this.users
      })
      .then((user_name) => {
        //処理
        for (let i = 0; i < user_name.length; i++) {
          getDocs(collection(db, "schedule01", user_name[i], "Travel")).then(
            (snapshot) => {
              for (let i = 0; i < snapshot.docs.length; i++) {
                this.user_travel_data.push(snapshot.docs[i].data())
              }
            }
          )
        }
      })
  },
}
</script>
