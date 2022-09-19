<template>
  <div>
    <h1>しおりの詳細</h1>
    <div>
      <div>{{ user_name }}</div>
      <div>日付：{{ overview.date }}({{ overview.howManyDays }}日間)</div>
      <div>男性{{ overview.man }}人/女性{{ overview.woman }}人</div>
      <img v-bind:src="overview.thumbnail" alt="a" width="300" height="200" />
    </div>
    <router-link to="/showbookmark"><h3>しおりを見る</h3></router-link>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase.js"

export default {
  data() {
    return {
      basicData: [],
      user_name: "", //Assumption : given data from the previous(home) page
      taravel_name: "", //Assumption : given data from the previous(home) page
      overview: [],
    }
  },
  created() {
    /*テストデータの表示をする*/
    getDocs(collection(db, "SpecificUserInformation"))
      .then((snapshot) => {
        for (let i = 0; i < snapshot.docs.length; i++) {
          this.basicData.push(snapshot.docs[i].data())
        }
        //console.log(this.datas)
        return this.basicData
      })
      .then((data) => {
        //処理
        //console.log(data)
        //console.log(data[0])
        this.user_name = data[0].specificUserName
        this.taravel_name = data[0].specificUserTravelName
        //console.log("user:", this.user_name)
        //console.log("Travel:", this.taravel_name)
        getDocs(
          collection(
            db,
            "schedule01",
            this.user_name,
            "Travel",
            this.taravel_name,
            this.taravel_name
          )
        ).then((snapshot) => {
          //overviewだけを探してくる
          //console.log(snapshot.docs[2].id)
          for (let i = 0; i < snapshot.docs.length; i++) {
            if (snapshot.docs[i].id == "overview") {
              this.overview = snapshot.docs[i].data()
              break
            }
          }
        })
      })
  },
}
</script>
