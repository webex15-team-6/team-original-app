<template>
  <div>
    <h1>Firestoreからデータ取得</h1>
    <div>
      <h3>表示</h3>
      <input v-model="target" placeholder="都道府県/目的地から探す" />
      <button v-on:click="Search">Search</button>
      <div v-for="(information, index) in datas" v-bind:key="index">
        <div>------------------------------------------------</div>
        <div>名前:{{ information.userName }}</div>
        <div>出発地点:{{ information.StartNode }}</div>
        <div>最終目的地:{{ information.EndNode }}</div>
        <div>日付:{{ information.yyyymmdd1.toDate() }}</div>
        <div>大人:{{ information.Adult }}人</div>
        <div>子ども:{{ information.Child }}人</div>
        <div>経路</div>
        <div v-for="(keiro, index) in information.route" v-bind:key="index">
          {{ index + 1 }}番目:{{ keiro }}
        </div>
        <div>費用:{{ information.cost }}円</div>
        <div>Tag:{{ information.tag }}</div>
        <img v-bind:src="information.photo" alt="a" />
        <br />
      </div>
      <div>################################################</div>
      <h3>栞を表示してみる</h3>
      <!--日付のところは表示しない-->
      <h4>１日目</h4>
      <div v-for="(mark, index) in bookMarks1" v-bind:key="index">
        <div>------------------------------------------------</div>
        <div>時間:{{ mark.time }}</div>
        <div>行動:{{ mark.activity }}</div>
        <div>詳細:{{ mark.detail }}</div>
      </div>
      <div>------------------------------------------------</div>
      <div>================================================</div>
      <h4>2日目</h4>
      <div v-for="(mark, index) in bookMarks2" v-bind:key="index">
        <div>------------------------------------------------</div>
        <div>時間:{{ mark.time }}</div>
        <div>行動:{{ mark.activity }}</div>
        <div>詳細:{{ mark.detail }}</div>
      </div>
      <div>------------------------------------------------</div>
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
      bookMarks1: [],
      bookMarks2: [],
      target: "",
      route: "",
    }
  },
  methods: {
    /*検索関数 上手くいかない*/
    async Search() {
      this.datas = [] //初期化
      //console.log(this.target)
      const q = query(collection(db, "test"), where("tag", "==", this.target))
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
    /*栞を表示する*/
    //栞１
    getDocs(collection(db, "Day1")).then((snapshot) => {
      for (let i = 0; i < snapshot.docs.length; i++) {
        this.bookMarks1.push(snapshot.docs[i].data())
        //console.log(this.datas)
      }
    })
    //栞2
    getDocs(collection(db, "Day2")).then((snapshot) => {
      for (let i = 0; i < snapshot.docs.length; i++) {
        this.bookMarks2.push(snapshot.docs[i].data())
        //console.log(this.datas)
      }
    })
  },
}
</script>
