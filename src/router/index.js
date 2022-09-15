import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import AboutView from "../views/AboutView.vue"
import MakeScheduleView from "../views/MakeScheduleView.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "About",
    component: AboutView,
  },
  {
    path: "/MakeSchedule",
    name: "MakeSchedule",
    component: MakeScheduleView,
  },
  {
    path: "/firebase",
    name: "Firebase",
    component: () => import("../views/GetDataView.vue"),
  },
  {
    path: "/detail",
    name: "detail",
    component: () => import("../views/DetailView.vue"),
  },
  {
    path: "/showbookmark",
    name: "showbookmark",
    component: () => import("../views/ShowBookmarkView.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
