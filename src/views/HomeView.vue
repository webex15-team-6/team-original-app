<template>
  <div>
    <h1>旅のしおり</h1>
    <div>
      <h3>scheduleから取ってきたデータを一覧表示</h3>
      <input v-model="target" placeholder="都道府県/目的地から探す" />
      <button v-on:click="Search">Search</button>
      <div v-for="(user, index) in user_travel_data" v-bind:key="index">
        <div>{{ user.name }}/{{ user.travelname }}</div>
        <router-link to="/detail"
          ><img
            v-on:click="addUserInf(user.name, user.travelname)"
            v-bind:src="user.thumbnail"
            alt="a"
            width="300"
            height="200"
        /></router-link>
      </div>
    </div>
    <br />
    <br />
    <button v-on:click="gotoSchedulePage">スケジュールを作成する</button>
  </div>
</template>

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
    /*検索関数 後回し*/
    async Search() {
      this.user_travel_data = [] //初期化
      //console.log(this.target)
      const q = query(
        //表示用配列の長さに依存する
        collection(db, "schedule"),
        where("test", "==", this.target)
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, "=>", doc.data())
        this.user_travel_data.push(doc.data())
        //console.log("確認", this.datas)
      })
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
    //console.log("user名", this.users)
    //console.log("user data :", this.user_travel_data)
  },
}
</script>
