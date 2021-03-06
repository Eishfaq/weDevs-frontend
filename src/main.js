import Vue from 'vue'
import App from './App'
import router from './router/index'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import Vuex from 'vuex'
import store from './store/index'

Vue.use(Vuex)
Vue.use(Antd)

Vue.config.productionTip = false
export const bus = new Vue()

//datatable components
Vue.component('data-table', ()=>import('./components/datatable/List'));
//action
Vue.component('product-action', ()=>import('./components/action/ProductAction'));

import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, { timeout: 5000 })
new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app')
