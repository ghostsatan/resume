import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import router from './router'
import store from './store'
import request from './utils/request'
import './utils/filters'
Vue.prototype.$axios = request;
Vue.prototype.$url = "http://2782lk0215.wicp.vip";
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
