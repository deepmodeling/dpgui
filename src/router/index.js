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
    name: 'User Input Config',
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
  { path: '*', component: Home },
]

const router = new VueRouter({
  mode: 'history',
  base: '/dpgui/',
  routes
})

export default router
