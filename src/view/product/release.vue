<template>
<div class="scroll_contrain" ref="wrapper">
    <div class="release_box">
        <span class="back lt" style="margin-top:40px;margin-left:154px;" v-if="showBack" @click="backFn">返回</span>
        <div class="publish_box">
            <div class="article_title">文章发表
                <i class="published" @click="jumpReleased" v-if="showBtn">已发表</i>
            </div>
            <div class="myForm">
                <div class="h43_div clear">
                    <label class="type">类别</label>   
                    <div class="downMenu" @mouseenter="menuEnter(0)" @mouseleave="mouseLeave">
                        <i></i>
                        <span>{{menuText}}</span>
                        <transition name="slide-fade">
                            <div class="hide_menu" v-show="showMenu">
                                <div class="down_menu_list">
                                    <p v-for="(item, index) in menuList" :key="index" @click="downMenuClick(item)">{{item.type}}</p>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
                <div class="h43_div clear">
                    <label class="type">标题</label>
                    <input type="text" v-model.trim="articleTitle">
                </div>
                <div class="clear">
                    <label class="type">内容</label>
                    <div class="editor">
                        <!-- <textarea v-model.trim="articleContent"></textarea> -->
                        <!-- 富文本编辑器 -->
                        <Editor :content="content" :path="path" @imageFn="imageFn"
                        @sendEditormsg="sendEditormsg"></Editor>
                    </div>
                </div>
            </div>
            <div class="clear">
                <button class="default_btn send_btn" @click="sendArticle"><i></i>马上发</button>
            </div>
        </div>

        <div class="mask" :style="styleWH" v-show="showPlatform">
            <div class="platform">
                <div class="title">请选择开发平台</div>
                <div class="platform_div">
                    <div class="clear" style="padding-bottom: 10px;">
                        <div class="item lt">
                            <span>所有平台</span>
                            <div @click="allCheckedFn">
                                <img src="../../assets/imgs/dui.png" style="margin-top: 6px;" v-show="allChecked">
                            </div>
                        </div>
                        <div class="item lt" v-for="(item, index) in platform" :key="index">
                            <span>{{item.name}}</span>
                            <div @click="checkedFn(item)">
                                <img src="../../assets/imgs/dui.png" style="margin-top: 6px;" v-show="item.show">
                            </div>
                        </div>
                    </div>
                    <div class="clear" style="border-top: 2px solid #1E1F3D;padding-top: 14px;">
                        <div class="all_delete" @click="submiteFn">确定</div>
                        <div class="all_delete" @click="canaleFn" style="background:#ecf5ff;color:#333" >取消</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 </div>
</template>

<script>

import Editor from '@/components/editor';
import $Fn from '@/assets/js/public';

export default {
    components:{
        Editor
    },
    data(){
        return{
            curIndex: null,
            showBack: false,
            showMenu:false,                 //显示文章
            menuText: '请选择类别',          //文章类别值
            menuList: [],                   //文章类别
            menuListChild: [],
            articleTitle: '',               //文章标题
            backType: null,
            articleContent: '',             //文章内容
            file: null,
            fileName:null,
            platform: [
                { name: '779彩票', show: true},
                { name: '066彩票', show: true},
                { name: '933彩票', show: true},
                { name: '125娱乐', show: true},
                { name: '955娱乐', show: true},
                { name: '招财棋牌', show: true}
            ],
            showBtn: true,
            showPlatform: false,                //显示平台
            allChecked: true,                   //全选
            updateObj: null,                    //修改数据
            isUpdate: false,                    //判断熟不熟修改
            tid: null,
            list:[],                            //图片列表
            timeout: null,
            imgArr: [],
            content: '',                        //富文本编辑器
            // output content from editor
            result: '',
            // set image upload api url
            
            //path: 'http://192.168.103.79:8088/api/image/upload/temp?token=' + this.$store.state.token        //后台
            path: 'http://192.168.103.179:8088/api/image/upload/temp?token=' + this.$store.state.token       //测试服务器
            //path: 'http://faq.3000mk.com/api/image/upload/temp?token=' + this.$store.state.token               //线上服务器
        }
    },
     methods:{
        //获取文本编辑器的内容
        sendEditormsg(arg){
            this.articleContent = arg
        },
        //跳转已发表页面
        jumpReleased(){
            if(this.articleContent.replace(/(<[^<>]+>)|(&nbsp;)/g,"") != ''||this.articleTitle != ''){
                this.$confirm('当前操作将会清空已编辑的内容，是否继续？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.replace({ name: 'released' })
                }).catch(() => {
                          
                });
            }else
                this.$router.replace({ name: 'released' })
        },

        //鼠标进入
        menuEnter(arg){
            
            this.showMenu = true
        },

        //鼠标离开
        mouseLeave(arg){
            this.showMenu = false
        },

        //下拉菜单点击
        downMenuClick(arg){
           // console.log(arg)
            this.menuText = arg.type
            this.showMenu = false
            this.tid = arg.tid
        },

         //获取所有分类
        getAllCategory(){
            
            this.$api.allChildCategoryFn().then((res)=>{
                if(res.data.code == 0){
                   // console.log(res.data)
                    this.menuList = res.data.data

                    //判断地址栏中 params 是否传值
                    var routerObj = this.$route.params
                    var arr = Object.keys(routerObj);
                    if(arr.length > 0)                             
                        this.updateArticle(routerObj)
                }
            })
        },

        //提交发表文章
        sendArticle(){
            console.log(this.articleContent.replace(/(<[^<>]+>)|(&nbsp;)/g,""), ':'+ this.content)
            if(this.menuText == '请选择类别'){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '必须选择一个类别！'
                })
                return
            }
            if(this.articleTitle == ''){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '文章标题不能为空！'
                })
                return
            }
            if(this.articleContent.replace(/(<[^<>]+>)|(&nbsp;)/g,"") == ''&&this.content ==''){
                this.$message({
                    type: 'warning',
                    message: '文章内容不能为空！',
                    showClose: true
                })
                return
            }

            this.showPlatform = true
        },
        
        //所有平台全选
        allCheckedFn(){
            if(!this.allChecked){
                this.allChecked = true
                this.platform.forEach(function(arg){
                    arg.show = true
                })
            }
            else{
                this.allChecked = false
                this.platform.forEach(function(arg){
                    arg.show = false
                })
            }
        },

        //单选
        checkedFn(arg){
            if(!arg.show)
                arg.show = true
            else
                arg.show = false
            
            var on = this.platform.every(function(arg){
                return arg.show == true
            })
            if(on)
                this.allChecked = true
            else
                this.allChecked = false
        },
        
        //取消
        canaleFn(){
            this.allChecked = true
            this.showPlatform = false
            this.platform.forEach(function(arg){
                arg.show = true
            })
        },

        //获取发表平台并提交数据
        submiteFn(){
            var str = ''
            var list = this.platform.filter(function(arg){
                return arg.show == true
            })

            list.forEach(function(arg){
                str += arg.name + "，"
            })
           
            if(str == ''){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    duration: 1000,
                    message: '必须选择一个平台发布！'
                })
                return;
            }

            var  res = str.replace(/(.*)，/,'$1。');
           
            var data ={
                imageArray: this.imgArr,
                tid: this.tid,	
                uid: this.$store.state.uid,
                title: this.articleTitle,	
                content: this.articleContent,	
                titleImg: '',	
                files: '',
                platform: res,
                imageArray: this.imgArr,
            }
            if(this.isUpdate){
                var data1={
                    nid: this.updateObj.nid,
                    uid: this.updateObj.uid,
                    tid: this.tid,
                    title: this.articleTitle,	
                    content: this.articleContent,
                    platform: res,	
                    imageArray: this.imgArr,
                }
            }
            //console.log(data)
            this.isUpdate ? this.update(data1) : this.add(data)
        },

        //发布文章
        add(arg){
            this.$api.addArticleFn(arg).then((res)=>{
               // console.log(res)
                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        showClose: true,
                        message: "发表成功"
                    })
                    //跳转
                    this.timeout = setTimeout(()=>{
                        this.$router.replace({
                            name: 'released'
                        })
                    }, 500)
                }
                this.menuText = '请选择类别'
                this.articleTitle = ''
                this.articleContent = ''
                this.showPlatform = false
            })
        },

        //修改文章
        update(arg){
            this.$api.updateArticleFn(arg).then((res)=>{
               // console.log(res)
                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        showClose: true,
                        message: "修改成功"
                    })
                }
                this.menuText = '请选择类别'
                this.articleTitle = ''
                this.articleContent = ''
                this.showPlatform = false
                clearTimeout(this.timeout)
                this.timeout = setTimeout(()=>{
                    this.$router.push({
                        name: 'check',
                        params: {
                            checkState: 0
                        }
                    })
                }, 500)
            })
        },

        //修改文章重新发布
        updateArticle(arg){
           // console.log(arg)
            var that = this
            this.updateObj = arg
            if(arg.backType=='index'){
                this.showBtn = false
                this.backType = arg.backType
            }else{
                this.showBtn = true
                this.backType = arg.backType
            }
            this.isUpdate = true
            this.articleTitle = arg.title
            this.content = arg.content
            this.articleContent = arg.content
            this.menuList.forEach(function(item){
                if(item.tid == arg.tid){
                    that.menuText = item.type
                    that.tid = item.tid
                }
            })
        },

        //图片上传获取
        imageFn(arg){
            this.imgArr.push(arg)
        },

        //返回
        backFn(){
            this.$router.push({ 
                name: this.backType,
                params: this.updateObj,
            })
        },

         //页面加载
        loadingFn(){

            if(parseInt(this.$store.state.limit) == 0)
                this.curIndex = 1
            else
                this.curIndex = 3

            const routeObj = this.$route.params,
                on = $Fn.parameterFn(this.$route.params)
            
            //传参数
            if(on)
                this.showBack = true
               

            //获取所有分类
            this.getAllCategory()
            
        }
    },
    created(){

        //页面加载
        this.loadingFn()
    },
    destroyed(){
        clearTimeout(this.timeout)
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

<style>

</style>
