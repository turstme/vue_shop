import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入Login组件
import Login from '../components/Login.vue'
// 导入Home
import Home from '../components/Home.vue'
//导入Welcome
import Welcome from '../components/Welcome.vue'

// 导入HomeTab
import Users from '../components/HomeTab/1-users/users.vue'
import Roles from '../components/HomeTab/2-rights/roles.vue'
import Rights from '../components/HomeTab/2-rights/rights.vue'
import Goods from '../components/HomeTab/3-goods/goods.vue'
import Params from '../components/HomeTab/3-goods/params.vue'
import Categories from '../components/HomeTab/3-goods/categories.vue'
import Orders from '../components/HomeTab/4-orders/orders.vue'
import Reports from '../components/HomeTab/5-reports/reports.vue'


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
    redirect: '/welcome',
    path: '/home', component: Home, children: [
      {
        path: '/welcome', component: Welcome,
      },
      {
        path: '/users', component: Users,

      },
      {
        path: '/roles', component: Roles,

      },
      {
        path: '/rights', component: Rights,

      },
      {
        path: '/goods', component: Goods,

      },
      {
        path: '/params', component: Params,

      },
      {
        path: '/categories', component: Categories,

      },
      {
        path: '/orders', component: Orders,

      },
      {
        path: '/reports', component: Reports,

      }]
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
