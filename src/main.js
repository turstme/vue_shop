import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './assets/css/global.css'
import './views/element.js'
import './assets/fonts/iconfont.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在Vue原型中添加axios方法，使各组件都可以使用axios
Vue.prototype.$http = axios
Vue.config.productionTip = false

//添加axios请求拦截器，使用axios发送请求时在Header中添加Authorization属性，并绑定token令牌
axios.interceptors.request.use((config) => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
