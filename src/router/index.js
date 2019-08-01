// 职责：初始化路由对象 提供main.js使用
import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: []
})

export default router
