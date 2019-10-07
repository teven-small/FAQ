import Vue from 'vue'
import Router from 'vue-router'
import { resolve } from 'url';

Vue.use(Router)


export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/view/login'], resolve)
    },
    {
      path: '/product',
      component: resolve => require(['@/view/product'], resolve),
      children:[
        {
          path: '',
          redirect: '/home'
        },
        {
          path: 'home',
          name: 'home',
          component: resolve => require(['@/view/product/home'], resolve),
          meta:{
            requirePath:true
          }
        },
        {
          path: 'index',
          name: 'index',
          component: resolve => require(['@/view/product/index'], resolve),
          meta:{
            requirePath:true
          }
        },
        {
          path: 'release',
          name: 'release',
          component: resolve => require(['@/view/product/release'], resolve),
          meta:{
            name: '发表',
            requirePath:true
          }
        },
        {
          path: 'released',
          name: 'released',
          component: resolve => require(['@/view/product/released'], resolve),
          meta:{
            requirePath:true
          }
        },
        {
          path: 'collect',
          name: 'collect',
          component: resolve => require(['@/view/product/collect'], resolve),
          meta:{
            name: '收藏',
            keepAlive: true,
            requirePath:true
          }
        },
        {
          path: 'myInfo',
          name: 'myInfo',
          component: resolve => require(['@/view/product/myInfo'], resolve),
          meta:{
            name: '我的',
            requirePath:true
          }
        },
        {
          path: 'check',
          name: 'check',
          component: resolve => require(['@/view/product/check'], resolve),
          meta:{
            name: '审核',
            requirePath:true
          }
        },
        {
          path: 'categoryList',
          name: 'categoryList',
          component: resolve => require(['@/view/product/categoryList'], resolve),
          meta:{
            // keepAlive: true,
            requirePath:true
          }
        },
      ]
    },
    {
      path: '/setting',
      component: resolve => require(['@/view/setting/setting'], resolve),
      meta:{
        requirePath:true
      },
      children:[
        {
          path: '',
          redirect: 'account',
        },
        {
          path: 'account',
          name: 'account',
          component: resolve => require(['@/view/setting/account'], resolve),
          meta:{
            name: '管理',
            requirePath:true,
            index: 0
          },
        },
        {
          path: 'category',
          name: 'category',
          component: resolve => require(['@/view/setting/categoryNav'], resolve),
          meta:{
            name: '管理',
            requirePath:true,
            index: 1
          },
        },
      ]
    },
    {
      path: '*',
      name: 'notfound',
      component: resolve => require(['@/view/notfound'], resolve),
      meta: { 
        title: '404-页面丢了'
      }
    }
  ]
})
