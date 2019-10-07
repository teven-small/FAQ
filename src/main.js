// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import md5 from 'js-md5'
import axios from 'axios'
import qs from 'qs'
import store from './store/index'
import "babel-polyfill"       //兼容ie
import '../src/assets/css/public.css'
export const bus = new Vue()

Vue.use(Vuex)

// axios.defaults.withCredentials = true

//引入 api
import api from './api/index'

Vue.prototype.$qs = qs
Vue.prototype.$api = api
Vue.prototype.$axios = axios
Vue.prototype.$md5 = md5


import{ Button, Pagination, Message, Autocomplete, MessageBox, Dialog, Upload, Loading, Tabs, TabPane, Table, TableColumn, Switch,
  Collapse, CollapseItem, Select, option, Tooltip, Scrollbar } from 'element-ui'
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Autocomplete)
Vue.use(Dialog)
Vue.use(Upload)
Vue.use(Loading)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Select)
Vue.use(option)
Vue.use(Tooltip)
Vue.use(Scrollbar)

Vue.prototype.$message = Message
Vue.prototype.$confirm  = MessageBox.confirm

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  
  if(to.matched.some( m => m.meta.requirePath))
    if(store.state.token)
      next()
    else{
      next({
        path: '/login'
      })
    }
  else
    next()
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
