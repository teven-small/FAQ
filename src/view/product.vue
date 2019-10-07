<template>
    <div style="width:100%;height:100%">
        <!-- 左侧导航栏 -->
        <LtAside :move="true"></LtAside>

        <div class="rt_box" :style="wStyle">

            <!-- 头部导航栏 -->
            <TopAside @changType="changTypeFn"></TopAside>

            <div class="main" :style="style">
                
                <!-- 嵌套子路由 -->
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>

            <!-- 右侧导航栏 -->
            <RtAside></RtAside>
        </div>

        <!-- 消息模块 -->
        <News></News>
    </div>
</template>

<script>

import News from '@/components/news';
import LtAside from '@/components/ltAside';
import TopAside from '@/components/topAside';
import RtAside from '@/components/rtAside';

export default {
    components:{
        News,
        LtAside,
        RtAside,
        TopAside
    },
    data(){
        return{
            type: null
        }
    },
    methods:{
        changTypeFn(){
            this.type = null
        }
    },
    computed:{
        wStyle(){
            var style
            return style={
                width: this.$store.state.style.width - 220 + 'px'
            }
        },
        style(){
            var style
			return style ={
                width: this.$store.state.style.width - 520 + 'px',
                height: this.$store.state.style.height - 178 + 'px'
            }
        }
    }
}
</script>

<style>

</style>
