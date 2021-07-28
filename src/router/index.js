import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/input',
    name: 'User Input',
    component: () => import(/* webpackChunkName: "input" */ '../views/InputConfig.vue')
  },
  {
    path: '/input/:id',
    name: 'User Input',
    component: () => import(/* webpackChunkName: "input" */ '../views/Input.vue')
  },
  {
    path: '/new',
    name: 'New',
    component: () => import(/* webpackChunkName: "input" */ '../views/NewConfig.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
