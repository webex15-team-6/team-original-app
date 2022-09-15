<template>
  <div>
    <h1>旅のしおり</h1>
    <div>
      <input v-model="target" placeholder="都道府県/目的地から探す" />
      <button v-on:click="Search">Search</button>
      <div v-for="(information, index) in datas" v-bind:key="index">
        <div>------------------------------------------------</div>
        <div>UserName:{{ information.userName }}</div>
        <div>{{ information.prefecture }}/{{ information.period }}</div>
        <router-link to="/detail"
          ><img v-bind:src="information.photo" alt="a" width="300" height="200"
        /></router-link>
        <br />
      </div>
      <div>################################################</div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/firebase.js"

export default {
  data() {
    return {
      datas: [],
      target: "",
      route: "",
    }
  },
  methods: {
    /*検索関数 上手くいかない*/
    async Search() {
      this.datas = [] //初期化
      //console.log(this.target)
      const q = query(
        collection(db, "test"),
        where("prefecture", "==", this.target)
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, "=>", doc.data())
        this.datas.push(doc.data())
        //console.log("確認", this.datas)
      })
    },
  },
  created() {
    /*テストデータの表示をする*/
    getDocs(collection(db, "test")).then((snapshot) => {
      for (let i = 0; i < snapshot.docs.length; i++) {
        this.datas.push(snapshot.docs[i].data())
        //console.log(this.datas)
      }
    })
  },
}
</script>
