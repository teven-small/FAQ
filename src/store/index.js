import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        uid: sessionStorage.getItem("uid"),
        token: sessionStorage.getItem("token"),
        limit: sessionStorage.getItem("limit"),
        user: sessionStorage.getItem("account"),
        name: sessionStorage.getItem("name"),
        deptName: sessionStorage.getItem("deptName"),
        navKey: sessionStorage.getItem("navKey"),

        style: null,

        categoryList: null,
        type: null,
        isSearch: null,             

        scrollTop: null

    },

    getters:{

    },

    actions:{

    },

    mutations:{
        getToken(state, obj){
            if(obj == true)
                sessionStorage.removeItem("token")
            state.token = obj.token
            state.user = obj.user
            state.uid = obj.uid
            state.limit = obj.limit
            state.name = obj.name
            state.deptName = obj.deptName
            
            sessionStorage.setItem("uid", obj.uid)
            sessionStorage.setItem("token", obj.token)
            sessionStorage.setItem("limit", obj.limit)
            sessionStorage.setItem("account", obj.user)
            sessionStorage.setItem("name", obj.name)
            sessionStorage.setItem("deptName", obj.deptName)

        },

        getNavKey(state, num){
            state.navKey = num
            sessionStorage.setItem('navKey', num) 
        },

        //缩放获取宽高
        resizeStyle(state, obj){
            state.style = obj
        },

        categoryList(state, obj){
            state.categoryList = obj
        },
        getTypeFn(state, string){
            state.type = string
        },
        getIsSearchFn(state, string){
            state.isSearch = string
        },

        //获取滚动条
        getScrollTopFn(state, string){
            state.scrollTop = string
        }

    },

    modules:{

    }
})