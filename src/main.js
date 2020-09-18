import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/css/global.css"
import TreeTable from 'vue-table-with-tree-grid'

import http from './network/index';

Vue.prototype.$http=http

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
