<template>
<transition name="fade">
    <div class="mask" :style="styleWH" v-show="showMask">
        <div class="news_box" :style="style1">
            <div class="title">
                <span class="lt">消息中心</span>
                <span class="rt" @click="closeMask">X</span>
            </div>
            <div class="clear">
                <div class="lt_news_aside lt">
                    <div :class="{active:active==index}" v-for="(item, index) in nav" :key="index" @click="changeActive(index)">
                        <span>{{item}}</span>
                    </div>
                </div>
                <div class="lt rt_news_box">

                    <!-- 消息列表 -->
                    <div class="news_list" v-if="changeContent">
                        <div style="height: 414px;">
                            <div :class="['news_item']" v-for="(item, index) in newsArr" :key="index">
                                <div @click="contentFn(item, 0)">{{item.messageText}}</div>
                                <p>{{item.sendTime | time}}</p>
                            </div>
                        </div>
                        <div class="number_box clear">
                            <span class="all_delete" v-if="showBtn" @click="allDeleteFn">全部删除</span>
                            
                            <div class="rt">
                                <!-- 分页 -->
                                <el-pagination  background layout="prev, pager, next, jumper" :total="count" :page-size="pageSize"
                                :current-page="pageIndex" @current-change="changCuurengFn"></el-pagination>
                            </div>
                        </div>
                    </div>

                    <div class="news_content" v-else>
                        <div class="clear news_btn">
                            <span class="back lt" @click="backFn">返回</span>
                            <button class="default_btn delete_btn rt" @click="deleteFn"><i></i>删除</button>
                        </div>
                        <div class="art_title">温馨提示</div>
                        <div class="content_box">{{newsObj.messageText}}</div>
                        <div class="check_info clear">
                            <label>审批人</label>
                            <span class="lt">：{{newsObj.name}}</span>
                        </div>
                        <div class="check_info clear">
                            <label>审批时间</label>
                            <span class="lt">：{{newsObj.sendTime|time}}</span>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
    </div>
</transition>
</template>

<script>

import {bus} from '../main'
import $Fn from '../assets/js/public'

export default {
    props:['showNews'],
    data(){
        return{
            //消息列表
            newsArr:[],
            style1:{
                top: '',
                opacity: 0
            },
            timer: null,
            timeout: null,
            // 消息列表左侧aside
            nav:["未读","已读"],
            changeContent: true,
            active: 0,                 //左侧选中状态
            showMask: false,           //遮罩层
            showBtn: false,
            status: 0,
            newsObj: {},
            count: 0,
            pageIndex: 1,
            pageSize: 5
        }
    },
    methods:{
        //页面加载
        loadingFn(){
            var that = this
            bus.$on("sendNews", function(arg){
                that.changeContent = true
                that.active = 0
                that.showMask = true

                //获取消息列表数据
                that.getNewsList()
                
                var s = 0, t = 0, o = 0
                that.timer = setInterval(()=>{
                    s += 3
                    o += 5
                    t += 25
                    if(s>7){
                        s = 0
                        t = 0
                        o = 0
                        clearInterval(that.timer)
                    }else{
                        that.style1.top = t + '%'
                        that.style1.opacity = o/10
                    }
                }, 10)
            })
        },

        //获取消息列表数据
        getNewsList(arg){
            var params = {
                receiverId: this.$store.state.uid,
                status: this.status,
                pageNum: this.pageIndex,
                pageSize: this.pageSize,
            }
            this.$api.newsListFn(params).then((res)=>{
                //console.log(res.data)
                if(res.data.code == 0){
                    
                    this.count = res.data.data.totalNum
                    this.newsArr = []
                    var data = res.data.data.dateList

                    if(data.length>0)
                        this.newsArr = data
                    if(arg)
                        this.changeContent = true
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        },

        //分页
        changCuurengFn(arg){
            this.pageIndex = arg
            this.getNewsList()
        },

        //左侧导航栏点击
        changeActive(index){
            this.active = index;
            this.changeContent = true
            if(index==1){
                this.showBtn = true
                this.status = 1
                this.getNewsList()
            }
            else{
                this.showBtn = false
                this.status = 0
                this.getNewsList()
            }
        },        

        //关闭遮罩层
        closeMask(){
            bus.$emit("close", true)
            var s = 0, t = 0, o = 0
            this.timer = setInterval(()=>{
                s += 3
                o -= 5
                t -= 25
                if(s>7){
                    s = 0
                    t = 0
                    o = 0
                    clearInterval(this.timer)
                    this.timeout = setTimeout(()=>{
                        this.showMask = false
                    },300)
                }else{
                    this.style1.top = t + '%'
                    this.style1.opacity = o/10
                }
            }, 10)
        },

        //显示消息内容
        contentFn(arg, arg1){

            //arg1      0 改变状态   1 单个删除   2 全部删除

            var mids = '',  status = null
            if(arg1 == 0){
                mids = arg.mid
                status = 1
            }
            else if(arg1 == 1){
                mids = arg.mid
                status = 2
            }
            else if(arg1 == 2){
                arg.forEach(item => {
                    mids += item.mid + ','
                });
                status = 2
            }
            var params = {
                mids,
                status
            }
            this.$api.newsStaatusFn(params).then((res)=>{
                //console.log(res)
                if(res.data.code==0){
                    if(arg1==0){
                        this.changeContent = false
                        this.newsObj = arg
                        bus.$emit("refresh")
                    }
                    else{
                        this.$message({
                            type: 'success',
                            duration: 1000,
                            message: '删除成功！'
                        });
                        this.getNewsList()
                        this.changeContent = true
                    }
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        },

        //返回消息列表
        backFn(){
            this.getNewsList(true)
        },

        //单个消息删除
        deleteFn(){
            this.$confirm("您将要删除此消息么，是否继续？", "温馨提示！", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.contentFn(this.newsObj, 1)
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    duration: 1000,
                    message: '已取消删除！'
                });          
            });
        },

        //删除全部已读消息
        allDeleteFn(){
            if(this.newsArr.length>0){
                this.$confirm("您将要删除全部已读消息么，是否继续？", "温馨提示！", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.contentFn(this.newsArr, 2)
                })
            }
            else{
                this.$message({
                    type: 'info',
                    duration: 1000,
                    message: '没有删除的消息'
                }); 
            }   
        }
    },
    created(){
        //页面加载
        this.loadingFn()
    },
    destroyed(){
        clearInterval(this.timer)
        clearTimeout(this.timeout)
    },
    watch:{
        showNews(arg){
            console.log(arg)
            if(arg)
                this.showMask = true
        }
    },
    filters:{
        time(arg){
            return  $Fn.changeTimeFn(arg, true)
        }
    },
    computed:{
		styleWH(val){
			return this.style ={
                width: this.$store.state.style.width + 'px',
                height: this.$store.state.style.height + 'px'
            }
		}
	},
}
</script>

<style scoped>
.fade-enter,.fade-leave-to{
    opacity: 0;
}
.fade-enter-to,.fade-leave{
    opacity: 1;
}
.fade-enter-active,.fade-leave-active{
    transition: all 1s;
}
</style>
