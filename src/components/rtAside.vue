<template>
    <!-- 右导航栏 -->
    <div class="rt_aside rt" :style="style">
        <div class="ranking">
            <dl>
                <dt class="new">最新发布</dt>
                <dd v-for="(item, index) in recentArr" :key="index" :title="item.title" @click="handleClickFn(item)">{{item.id + '、' + item.title}}</dd>
            </dl>
        </div>

        <div class="ranking">
            <dl>
                <dt class="hot">热门点击</dt>
                <dd v-for="(item, index) in hotArr" :key="index" :title="item.title" @click="handleClickFn(item)">{{item.id + '、' + item.title}}</dd>
            </dl>
        </div>
    </div>
</template>

<script>
import {bus} from '@/main'
export default {
    data(){
        return{ 
            hotArr: [],
            recentArr: []
        }
    },
    methods:{
         //获取最近发布的文章
        getRecentArticle(arg){
            //请求参数
            let params = {
                field: arg,
                size: 8
            }
            this.$api.articleTitleFn(params).then((res) => {
                if(res.data.code == 0){
                    var data = res.data.data
                    if(data.length>0){
                        for(var i=0,len=data.length;i<len;i++){
                            if(arg == 'releaseTime'){
                                this.recentArr.push({
                                    id: i + 1,
                                    uid: data[i].uid,
                                    title: data[i].title,
                                    nid: data[i].nid,
                                    click: ''
                                })
                            }
                            else if(arg == 'hot'){
                                this.hotArr.push({
                                    id: i + 1,
                                    uid: data[i].uid,
                                    title: data[i].title,
                                    nid: data[i].nid
                                })
                            }
                        }
                    }
                }
            })
        },

        //点击右侧导航栏阅读文章
        handleClickFn(arg){
            arg.click = 'click'
            arg.backType = 'rt'
            if(this.$route.name != 'index'){
                this.$router.push({
                    name: 'index',
                    params: arg
                })
            }
            else{
                bus.$emit("rtReadContentFn", arg)
            }
        }
    },
    created(){

        //获取最近发布文章
        this.getRecentArticle('releaseTime')
       
        //获取热门点击文章
        this.getRecentArticle('hot')
    },
    computed:{
		style(val){
            var style
			return style ={
                height: this.$store.state.style.height - 178 + 'px'
            }
		}
	},
}
</script>

<style>

</style>
