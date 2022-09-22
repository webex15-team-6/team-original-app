<template>
  <div>
    <h1>【 {{ user_name }} 】さんの旅の栞</h1>
    <div>
      <!--栞を表示してみる-->
      <div>------------------------------------------------</div>
      <div v-for="(info, index) in schedule" v-bind:key="index">
        <b>{{ index + 1 }}日目</b>
        <div v-for="(schedule_detail, index) in info" v-bind:key="index">
          <div class="block">
            <div>
              ◇ {{ schedule_detail.time }}&nbsp;{{ schedule_detail.activity }}
            </div>
          </div>
          <div class="indent" v-if="schedule_detail.detail !== ''">
            ・{{ schedule_detail.detail }}
          </div>
          <img
            v-bind:src="schedule_detail.photo"
            v-if="schedule_detail.photo !== ''"
            alt="Photo URL not found"
            width="300"
            height="200"
          />
          <br />
          <br />
        </div>
        <div>------------------------------------------------</div>
      </div>
      <router-link to="/detail"> <h3>戻る</h3></router-link>
    </div>
  </div>
</template>

<style>
.indent {
  text-indent: 6rem;
}
.container {
  position: relative;
  background-color: #ffc9d2;
  widows: 300;
  height: 300;
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
      schedule: [], //Store the schedule
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
              this.schedule.push(date[i].schedule)
            }
            //console.log("cost", this.cost)
            //console.log("route", this.route)
          })
      })
  },
}
</script>
