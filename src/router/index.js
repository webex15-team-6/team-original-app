import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import AboutView from "../views/AboutView.vue"
import MakeItineraryView from "../views/MakeItineraryView.vue"
import PostItineraryView from "../views/PostItineraryView.vue"

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
    path: "/makeSchedule",
    name: "makeSchedule",
    component: MakeItineraryView,
  },
  {
    path: "/postItinerary",
    name: "postSchedule",
    component: PostItineraryView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
