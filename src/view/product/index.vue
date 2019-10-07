<template>
    <div class="scroll_contrain">
        <div class="article_content_box" v-if="type==1">
            <div class="padding_110">
                <div class="title">
                    <span class="back lt" v-if="showBack" @click="backFn">返回</span>
                    <span>{{article.title}}</span>
                </div>
                <div class="publish_info clear">
                    <div class="lt">
                        <span class="author">{{article.author}}</span>
                        <span>{{article.time}}</span>
                    </div>
                    <div class="rt" v-if="noshow"></div>
                    <div class="rt" v-else>
                        <div class="rt" v-if="checked">
                            <button class="default_btn update_btn" @click="updateArticle"><i></i>重新修改</button>
                            <button class="default_btn delete_btn" @click="deleteArticle"><i></i>删除</button>
                        </div>
                        <div class="rt released" style="position: relative" v-else>
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
                </div>
            </div>
            <div class="article_content" v-html="article.content"></div>

            <div v-show="checkedBtn" class="checked_box">
                <span class="no_check" @click="submite(article, true)">审核不通过</span>
                <span class="check" @click="submite(article, false)">审核通过</span>
            </div>
        </div>

        <div class="no_data" v-else-if="type==2">
            <img src="../../assets/imgs/nodata.png" alt="">
        </div>

        <Loading v-else></Loading>

        <el-dialog title="未通过原因" :visible.sync="showCheckBox" width="30%">
            <textarea placeholder="请输入原因" v-model="reason"></textarea>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hideCheckBox">取 消</el-button>
                <el-button type="primary" @click="confirm(article)">确 定</el-button>
            </span>
        </el-dialog>

        <div class="back_top" v-if="showTop">
            <img src="../../assets/imgs/back_top.png" @click="backTop">
        </div>
    </div>
</template>

<script>
import $Fn from '@/assets/js/public'
import {bus} from '@/main'
import Loading from '@/components/loading';
export default {
    components:{
        Loading
    },
    data(){
        return{
            showBack: false,
            noshow: false,
            ltData: null,
            //点赞样式
            style2:{
                top: '',
                width: ''
            },
            style3:{
                width: '',
                height: ''
            },
            article:{
                title: null,
                author: null,
                time: null,
                main: null,
                nid: null,
                uid: null,
                isCollect: null,
                imgArr: []
            },
            manageUpdate: null,         //显示管理员修改文章按钮
            checked: false,             //显示审核按钮
            checkedBtn: false,
            showLove: false,            //显示点赞
            loveNum: 0,                 //点赞数
            showCheckBox: false,        //显示审核不通过弹出框
            reason: '',                 //没通过的原因
            timer1: null,
            timeout: null,              //定时延迟
            type: null,                 //显示类容
            backType: '',               //返回页面的类型
            checkState: null,            //返回审核页的状态
            isType: false,
            showTop: false,
            timert: null
        }
    },
    methods:{
        //获取文章内容
        getArticleContentFn(arg){
            let params1 = {
                nid: arg.nid,
                uid: this.$store.state.uid,
                click: arg.click
            }
            this.$api.articleContentFn(params1).then((res) => {
                if(res.data.code == 0){
                   // console.log(res.data.data)
                    if(res.data.data){
                        this.type = 1
                        this.article =  res.data.data
                    }else
                        this.type = 2
                }
                else
                    this.type = 2
            })
            .catch((res) => {
                console.log(res)
                this.type = 2
            })
        },

        //搜索查询文章
        searchFn(arg){
            //获取文章内容
            this.getArticleContentFn(arg)
        },

        //收藏点击事件
        collectFn(arg){
            
            if(arg.isCollect == 1){
                this.$message({
                    type: 'info',
                    message: '已收藏'
                })
                return
            }else
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

                    //点赞提交数据
                    this.loveFn(arg)
                    
                    clearInterval(this.timer1)       //清除定时器
        
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
            //console.log(arg)
            arg.click = ''
           
            let params2={
                nid: arg.nid,
                uid: this.$store.state.uid
            }
            this.$api.giveLoveFn(params2).then((res)=>{
               // console.log(arg)
                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        duration: 1000,
                        message: '点赞成功！'
                    });

                    this.getArticleContentFn(arg)
                }
            })
            .catch((err) => {
                console.log(err)        
            });
        },

        //隐藏审核弹出框
        hideCheckBox(){
            this.reason = ''
            this.showCheckBox = false
        },

        //文章重新修改
        updateArticle(){
            if(this.isType)
                this.$store.commit("getTypeFn", "index")
            //console.log(this.$store.state.type)
            this.article.backType = 'index'
            this.$router.push({
                name: 'release',
                params: this.article
            })
        },

        //审核删除
        deleteArticle(){
            this.$confirm('您将要删除此文章，是否继续？','温馨提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    
                    var obj={
                        nid: this.article.nid
                    }
                    //删除
                    this.$api.deleteArticleFn(obj).then((res)=>{
                        if(res.data.code == 0){
                            this.$message({
                                type: 'success',
                                duration: 1000,
                                message: '删除成功!'
                            });

                            this.timeout = setTimeout(()=>{
                                this.$router.push({
                                    name: 'released',
                                    params:{
                                        checkState: this.checkState
                                    }
                                })
                            }, 1000)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        duration: 1000,
                        message: '已取消删除'
                    });          
                });
        },

        //审核通过
        submite(arg, arg1){
            if(arg1)
                this.showCheckBox = true
            else
                this.checkSubmite(arg, true)
        },

        //审核不通过
        confirm(arg){
            if(this.reason == ''){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    duration: 1000,
                    message: '请输入不通过理由！'
                })
            }else{
                arg.reason =  this.reason
                //提交数据
                this.checkSubmite(arg, false)
            }
        },

        //提交审核数据
        checkSubmite(arg, arg1){
            var obj = {
                title: arg.title,
                nid: arg.nid,
                uid: arg.uid,
                auditor: arg.author,
            }

            if(arg1){                       //审核通过
                obj.remark = ''
                obj.status = 1
                
            }else{                          //审核不通过
                obj.remark = arg.reason
                obj.status = 2
            }
            //console.log(obj)
            this.$api.checkArticleFn(obj).then((res)=>{
                if(res.data.code == 0){
                    var msg = arg1 ? "审核成功通过！" : "拒绝成功！"
                    if(!arg1){
                        this.reason = ''
                        this.showCheckBox = false
                    }
                    this.$message({
                        type: 'success',
                        message: msg
                    })
                    bus.$emit("checkRefresh")
                    this.timeout = setTimeout(()=>{
                        this.$router.push({
                            name: 'check',
                            params:{
                                checkState: 0
                            }
                        })
                    },500)
                }
            })
        },
        
        //判断地址栏中 params 是否传值
        isHaveParams(arg){
        //    console.log(arg)
            if(arg.checkState)
                this.checkState = arg.checkState     //返回审核页的状态

            if(arg.backType)                //显示返回按钮
                this.backType = arg.backType

            if(arg.backType=='lt'){
                this.showBack = true
                this.ltData = this.$store.state.categoryList
                this.getArticleContentFn(arg)
            }
            else if(arg.backType == 'rt'){
                this.isType = true
                this.showBack = false
                this.getArticleContentFn(arg)
            }
            else if(arg.backType == 'search'){
                this.showBack = false
                this.getArticleContentFn(arg)
            }
            else if(arg.backType == 'collect'){
                this.showBack = true
                this.getArticleContentFn(arg)
            }
            else if(arg.backType == 'released'){
                if(arg.loveBtn==0)
                    this.noshow = true
                else if(arg.loveBtn==1){
                    this.checked = false
                    this.noshow = false
                }else{
                    this.checked = true
                    this.noshow = false
                }
                this.showBack = true
                this.article = arg
                this.type = 1
            }
            else if(arg.backType == 'check'){          //审核传参
                if(arg.checkBtn){               //显示审核按钮
                    this.checked = true
                    this.checkedBtn = true
                    this.noshow = false  
                }else{
                    this.checked = false
                    this.noshow = false           //隐藏审核按钮
                }
                this.type = 1
                this.article = arg  
                this.showBack = true
            }
           
            else if(arg.backType == "release"){
                this.getArticleContentFn(arg)
            }
            else if(arg.backType == "index"){ 
                if(this.$store.state.type == 'categoryList'){
                    this.showBack = true
                    this.backType = 'categoryList'
                    this.ltData = this.$store.state.categoryList
                }
                else if(this.$store.state.type == 'check'){
                    this.showBack = true
                    this.backType = 'check'
                }
                else if(this.$store.state.type == 'released'){
                    this.showBack = true
                    this.backType = 'released'
                }
                else if(this.$store.state.type == 'collect'){
                    this.showBack = true
                    this.backType = 'collect'
                }
                this.getArticleContentFn(arg)
            }
        },
        //返回上一页
        backFn(){
            switch(this.backType){
                case 'lt':
                    this.jumpCategory()

                    break;
                case 'categoryList':
                    this.jumpCategory()
                    
                    break;
                case 'check':
                    this.$router.push({
                        name: 'check',
                        params:{
                            checkState: this.checkState
                        }
                    })
                    break;
                case 'released':
                    this.$router.push({
                        name: 'released',
                        params:{
                            checkState: this.checkState
                        }
                    })
                    break;
                case 'collect':
                    this.$router.push({
                        name: 'collect',
                    })
                    break;
                default:
                    this.type = 0
                    break;
            }
        },

        //返回分类查询
        jumpCategory(){
            var obj={
                list: this.ltData
            }
            if(this.$store.state.isSearch){
               
                obj.backType = 'top'
                this.$router.push({
                    name: 'categoryList',
                    params: obj
                })
            }
            else{
                obj.backType = 'lt'
                this.$router.push({
                    name: 'categoryList',
                    params: obj
                })
            }
        },

        loadingPageFn(){
            this.manageUpdate = parseInt(this.$store.state.limit)

            this.$nextTick(() => {
                const el = document.querySelector('.scroll_contrain');
                const offsetHeight = el.offsetHeight;
                el.onscroll = () => {
                    const scrollTop = el.scrollTop;
                    const scrollHeight = el.scrollHeight;
                    if (scrollTop > 1000) 
                        this.showTop = true
                    else
                        this.showTop = false
                };
            });

            //判断地址栏中 params 是否传值
            var routerObj = this.$route.params
            var arr = Object.keys(routerObj);
            if(arr.length == 0)                             //没传值
                this.$router.push({ name: 'home'})
            else
                this.isHaveParams(routerObj)

            bus.$on("rtReadContentFn",(arg)=>{          //右侧title 点击   
                this.type = null
                this.noshow = false
                this.checked = false
                this.showBack = false
                this.checkedBtn = false
                this.getArticleContentFn(arg)
            })
            bus.$on("refresh", (arg)=>{                 //点击收藏刷新
                arg.click = ''
                this.getArticleContentFn(arg)
            })

            bus.$on("searchContent", (arg)=>{           //搜索框搜索
                this.type = null
                this.noshow = false
                this.checked = false
                this.showBack = false
                this.checkedBtn = false
                this.getArticleContentFn(arg)
            })
        },

        //回到顶部
        backTop(){
            const el = document.querySelector('.scroll_contrain');
            this.timert = setInterval(()=>{
                el.scrollTop -= 100
                if(el.scrollTop <= 0){
                    clearInterval(this.timert)
                    this.showTop = false
                }
            }, 1)
        },
    },
    created(){
       this.loadingPageFn()
            
    },
    mounted(){
        bus.$on("categoryListFn", (arg)=>{
            console.log(arg)
            // that.type = null
            // that.getArticleContentFn(arg)
        })
    },
    activated() {
        this.loadingPageFn();
    },
    deactivated(){
        this.type = null
    },
    destroyed(){
        //清除定时器=   
        clearInterval(this.timer1)
        clearInterval(this.timert)
        clearTimeout(this.timeout)       
    }
}
</script>