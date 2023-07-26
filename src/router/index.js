import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Quiz from "../views/Quiz.vue";
import Summary from "../views/Summary.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/quiz", component: Quiz },
  { path: "/summary", component: Summary },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
