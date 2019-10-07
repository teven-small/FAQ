<template>
<el-scrollbar style="height:100%" :noresize="false" :native="false">
    <div class="article_content_box">
        <div v-if="isShow==1" class="padding_110">
            <div class="title">{{article.title}}</div>
            <div class="publish_info clear">
                <div class="lt">
                    <span class="author">{{article.author}}</span>
                    <span>{{article.updateTime|time}}</span>
                </div>
            
                <div class="rt released" style="position: relative">
                    <button class="default_btn update_btn" @click="updateArticle" v-if="manageUpdate==1" style="margin-right:30px"><i></i>重新修改</button>
                    <button class="default_btn collect_btn" @click="collectFn(article)" :class="{collect_act:article.isCollect==1}">
                        <i style="padding-right: 14px;"></i>收藏
                    </button>
                    <button class="default_btn love_btn" @click="loveClick(article)" :class="{love_act:article.isGiveLike==1}">
                        <i></i>
                        <em v-show="showLove" :style="style2">
                            <img src="../../assets/imgs/give_love.png" :style="style3">
                            +1
                        </em>
                        {{ loveNum == 0 ? '点赞': loveNum }}
                    </button>
                   
                </div>
            </div>
           
            <div class="article_content" v-html="article.content"></div>

        </div>
        <div class="no_data" v-else-if="isShow==2">
            <img src="../../assets/imgs/nodata.png">
        </div>
        <Loading v-else></Loading>
    </div>
</el-scrollbar>
</template>

<script>

import {bus} from '@/main'
import $Fn from '@/assets/js/public'
import Loading from '@/components/loading'
export default {
    components:{
        Loading
    },
    data(){
        return{
            manageUpdate: null,
            //点赞样式
            style2:{
                top: '',
                width: ''
            },
            style3:{
                width: '',
                height: ''
            },
            isShow: null,
            article:{
                title: null,
                author: null,
                updateTime: null,
                content: null,
                nid: null,
                uid: null,
                isCollect: null,
            },
            showLove: false,            //显示点赞
            loveNum: 0,                 //点赞数
            timer1: null,
        }
    },
    methods:{

        //页面加载
        loadingPageFn(){
            var that = this

            this.manageUpdate = parseInt(this.$store.state.limit)

            //获取最近发布的文章
            this.getRecentArticle()

            bus.$on("refresh", function(arg){
                arg.click = ''
                that.getArticleContentFn(arg)
            })
               
        },
        
        //获取最近发布的文章
        getRecentArticle(){
            //请求参数
            let params = {
                field: 'releaseTime',
                size: 8
            }
            var article = ''
            this.$api.articleTitleFn(params).then((res) => {
                if(res.data.code==0){
                    var data = res.data.data
                    if(data.length>0){
                        for(var i=0, len=data.length;i<len;i++){
                            //随机数 0-8 
                            var rn = Math.ceil(Math.random() * 7) - 1
                            article = data[rn]
                        }
                        this.getArticleContentFn(article)
                    }
                }
            })
        },

        //获取文章内容
        getArticleContentFn(arg){
            var params = {
                nid: arg.nid,
                uid: this.$store.state.uid,
                click: arg.click
            }
            this.$api.articleContentFn(params).then((res) => {
                if(res.data.code == 0){
                    var data = res.data.data
                    if(data){ 
                        this.article = data
                        this.isShow = 1
                    }else
                        this.isShow = 2
                }
            })
            .catch((err)=>{
                this.isShow = 2
                this.$message({
                    type: 'info',
                    message: '获取数据出现问题！'
                });
            })
        },

        //收藏点击事件
        collectFn(arg){
            
            if(arg.isCollect == 1){
                this.$message({
                    type: 'info',
                    duration: 1500,
                    showClose: true,
                    message: '已收藏'
                })
                return
            }else
                //this.$refs.sendChild.starMove({bool:true, info: arg})
                bus.$emit("sengCollect", arg)

        },

        //点赞点击事件
        loveClick(arg){
            if(arg.isGiveLike==1){
                this.$message({
                    type: 'info',
                    duration: 1000,
                    message: '您已经点过赞了！'
                });
                return
            }
            // t => top o => opcity w => width h => height s => 时间
            var t = 0, w = 24, h = 24, s = 0
            this.showLove = true            //显示动画点赞手势
            clearInterval(this.timer1)      //防止快速点击定时器没及时清除
            this.timer1 = setInterval(()=>{
                s ++
                t -= 5
                w ++
                h ++
                if(s > 10){         //判断在10以内
                    //大于10 初始化
                    s = 0
                    t = 0
                    w = 24
                    h = 24

                    this.style2.top = t + 'px'
                    this.style3.width = w + 'px'
                    this.style3.height = h + 'px'
                    this.showLove = false   
                    clearInterval(this.timer1)       //清除定时器
                    //点赞提交数据
                    this.loveFn(arg)
                }else{
                    this.style2.top = t + 'px'
                    this.style2.width = w + 53 + 'px'
                    this.style3.width = w + 'px'
                    this.style3.height = h + 'px'
                }
            },50)
        },

        //点赞提交数据
        loveFn(arg){

            arg.click = ''
           
            let params2={
                nid: arg.nid,
                uid: this.$store.state.uid
            }
            this.$api.giveLoveFn(params2).then((res)=>{
                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        duration: 1000,
                        message: res.data.msg
                    });

                    this.getArticleContentFn(arg)
                }
            })
        },

         //文章重新修改
        updateArticle(){
            this.article.backType = 'index'
            this.$router.push({
                name: 'release',
                params: this.article
            })
        },
    },
    created(){
       
        this.loadingPageFn()
    },
    destroyed(){

        //清除定时器   
        clearInterval(this.timer1)       
    },
    filters:{
        time(val){
            return $Fn.changeTimeFn(val)
        }
    }
}
</script>

<style>

</style>
