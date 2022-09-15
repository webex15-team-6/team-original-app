<template>
  <div>
    <h1>しおりの詳細</h1>
    <div>未完成</div>
    <div>
      <h3>表示</h3>
      <div v-for="(information, index) in datas" v-bind:key="index">
        <div>------------------------------------------------</div>
        <div>名前:{{ information.userName }}</div>
        <div>出発地点:{{ information.StartNode }}</div>
        <div>最終目的地:{{ information.EndNode }}</div>
        <div>日付:{{ information.yyyymmdd1.toDate() }}</div>
        <div>大人:{{ information.Adult }}人</div>
        <div>子ども:{{ information.Child }}人</div>
        <div>----経路-------------</div>
        <div v-for="(keiro, index) in information.route" v-bind:key="index">
          {{ index + 1 }}番目:{{ keiro }}
        </div>
        <div>--------------------------</div>
        <div>費用:{{ information.cost }}円</div>
        <img v-bind:src="information.photo" alt="a" />
        <br />
      </div>
      <br />
      <br />
      <router-link to="/showbookmark"> <h3>しおりを見る</h3> </router-link>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase.js"

export default {
  data() {
    return {
      datas: [],
    }
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
