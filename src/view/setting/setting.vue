<template>
    <div id="docSetting">
        <!-- 左边导航栏 -->
        <div class="lt_aside lt" style="width:220px">
            <div class="lt_blank"></div>
            <div class="aside_content" :style="hStyle">
                <div class="logo_div">
                    <img src="../../assets/imgs/logo.png" alt="" @click="jumpHome">
                </div>

                <!-- 管理导航栏 -->
                <div class="setting_nav">
                    <p class="accout_manage" :class="{active:curIndex==0}" @click="jumpSettingFn(0)">账号管理</p>
                    <p class="category_manage" :class="{active:curIndex==1}" @click="jumpSettingFn(1)">分类管理</p>
                </div>
            </div>
            <div class="lt_blank"></div>
        </div>

        <!-- 右侧内容 -->
        <div class="rt_box" :style="wStyle">

            <!-- 子路由嵌套 -->
            <router-view />

        </div>
        <!-- 消息模块 -->
        <news></news>
    </div>
</template>

<script>

import news from '../../components/news';
import $Fn from '../../assets/js/public'

export default {
    components:{
        news
    },
    data(){
        return{
            curIndex: 0
        }
    },
    methods:{
        //返回首页
        jumpHome(){
            this.$router.replace({ path: '/home' })
        },

        //加载页面
        loadingPageFn(){

            this.curIndex = this.$route.meta.index
        },

        // 点击左侧导航跳转
        jumpSettingFn(arg){
            this.curIndex = arg
            if(arg==0)
                this.$router.push({ path: '/setting/account' })
            else
                this.$router.push({ path: '/setting/category' })
        }

    },
    mounted(){
        this.loadingPageFn()
    },
    computed:{
        hStyle(){
            var style
            return style={
                height: this.$store.state.style.height - 60 + 'px'
            }
        },
        wStyle(){
            var style
			return style ={
                width: this.$store.state.style.width - 220 + 'px',
            }
        }
    }

}
</script>

