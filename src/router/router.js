import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入Login组件
import Login from '../components/Login.vue'
// 导入Home
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 路由重定向到login
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login', component: Login
  },
  // 添加/home路由
  {
    path: '/home', component: Home
  }

]
const router = new VueRouter({
  routes
})
//添加路由守卫
router.beforeEach((to, from, next) => {
  // to: 将要访问地址
  // from：从哪个地址跳转
  // next：是一个函数，表示放行
  //   next() 放行    next('/login') 强制跳转


  // 1.若访问地址为/login则直接放行
  if (to.path === '/login') return next()
  // 获取token
  if (!window.sessionStorage.getItem('token')) return next('/login')

  next()

})
export default router
