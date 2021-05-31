import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.use(ElementUI);

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.prototype.$message = Message

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
