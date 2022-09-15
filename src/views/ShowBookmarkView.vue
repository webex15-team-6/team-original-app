<template>
  <div>
    <h1>しおりを見る</h1>
    <div>
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
      <router-link to="/detail"> <h3>戻る</h3></router-link>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase.js"

export default {
  data() {
    return {
      bookMarks1: [],
      bookMarks2: [],
    }
  },
  created() {
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
