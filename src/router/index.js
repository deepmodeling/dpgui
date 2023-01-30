import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/input',
    name: 'User Input Config',
    component: () => import(/* webpackChunkName: "input" */ '../views/InputConfig.vue')
  },
  {
    path: '/input/:id',
    name: 'User Input',
    component: () => import(/* webpackChunkName: "input" */ '../views/InputView.vue')
  },
  {
    path: '/new',
    name: 'New',
    component: () => import(/* webpackChunkName: "input" */ '../views/NewConfig.vue')
  },
  { path: '/:pathMatch(.*)*', name: "404", component: HomeView },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL ? process.env.BASE_URL : '/dpgui/'),
  routes
})

export default router
