<template>
  <div>
    <h1>【 {{ user_name }} 】さんの栞の概要</h1>
    <div class="flex">
      <figure class="image">
        <img v-bind:src="overview.thumbnail" alt="a" />
      </figure>
      <table class="table_pos">
        <tr>
          <th>日付</th>
          <td>
            {{ overview.date }} <br />
            ({{ overview.howManyDays }}日間)
          </td>
        </tr>
        <tr>
          <th>人数</th>
          <td>男性{{ overview.man }}人 / 女性{{ overview.woman }}人</td>
        </tr>
        <tr v-for="(info, index) in route" v-bind:key="index">
          <th>
            <div>経路</div>
            <div>({{ index + 1 }}日目)</div>
          </th>
          <td>
            <div v-for="(info2, index) in info" v-bind:key="index">
              {{ index + 1 }}. {{ info2.place }}
            </div>
          </td>
        </tr>
        <tr v-for="(info, index) in cost" v-bind:key="index">
          <th>
            <div>費用</div>
            <div>({{ index + 1 }}日目)</div>
          </th>
          <td>
            <div v-for="(info2, index) in info" v-bind:key="index">
              {{ info2.cost }}円
            </div>
          </td>
        </tr>
      </table>
      <br />
      <br />
      <br />
      <br />
    </div>
    <router-link to="/showbookmark"><h3>しおりを見る</h3></router-link>
  </div>
</template>

<style>
th,
td {
  border: solid 1px; /* 枠線指定 */
}

table {
  border-collapse: collapse; /* セルの線を重ねる */
}

th {
  width: 200px; /* 幅指定 */
  height: 80px; /* 高さ指定 */
  background-color: #f2f2f2;
}

.flex {
  display: flex;
  margin-left: auto;
  margin-right: auto;
}

.flex .image {
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.flex .table_pos {
  margin: 0 0 0 20px;
  padding: 0;
}
</style>

<script>
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase.js"

export default {
  data() {
    return {
      basicData: [], //↓ data
      user_name: "", //Assumption : given data from the previous(home) page
      taravel_name: "", //Assumption : given data from the previous(home) page
      overview: [], //Store overview
      day: [], //Store Day1,2,...
      cost: [], //Store the cost
      route: [], //Store the route
    }
  },
  created() {
    /*ユーザ名と～旅かを取ってくる*/
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
        )
          .then((snapshot) => {
            //overviewだけを探してくる
            //console.log(snapshot.docs[2].id)
            for (let i = 0; i < snapshot.docs.length; i++) {
              if (snapshot.docs[i].id != "overview") {
                this.day.push(snapshot.docs[i].data())
              } else {
                this.overview = snapshot.docs[i].data()
              }
            }
            //console.log(this.day)
            return this.day
          })
          .then((date) => {
            //処理
            for (let i = 0; i < date.length; i++) {
              //処理
              this.cost.push(date[i].cost)
              this.route.push(date[i].route)
            }
            //console.log("cost", this.cost)
            //console.log("route", this.route)
          })
      })
  },
}
</script>
