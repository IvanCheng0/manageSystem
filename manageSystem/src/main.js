import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

Vue.use(ZkTable)
Vue.config.productionTip = false
Vue.use(ElementUI);

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
