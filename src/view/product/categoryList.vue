<template>
    <div class="scroll_contrain" ref="wrapper">
        <div class="list_box" v-if="type==1">
            <div class="article_item" v-for="(item, index) in categoryList" :key="index">
                <p @click="searchChildFn(item)">{{item.title}}</p>
                <div class="describe" @click="searchChildFn(item)">{{item.content|content}}</div>
                <div class="clear">
                    <span class="author lt" style="margin-right: 20px;">{{item.author}}</span>
                    <span class="time lt">{{item.releaseTime|time}}</span>
                    <span style="margin-left: 20px">{{"发布于："+item.platform}}</span>
                </div>
            </div>
        </div>

        <div class="no_data" v-else-if="type==2">
            <img src="../../assets/imgs/nodata.png" />
        </div>
        
        <Loading v-else></Loading>
        
        <div class="back_top" v-if="showTop">
            <img src="../../assets/imgs/back_top.png" @click="backTop">
        </div>
    </div>
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
            type: null,
            categoryList: [],
            isSearch: false,
            showTop: false,
            timert: null
        }
    },
    methods:{
        //加载页面
        loadingPageFn(){
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
            //  console.log(routerObj)
            if(arr.length == 0)                             //没传值
                this.type = 2
            else{
                if(routerObj.backType=='top'){
                    this.type = null
                    setTimeout(()=>{
                        this.type = 1
                        this.isSearch = true
                        this.categoryList = routerObj.list
                        this.$nextTick(() => {
                            this.$refs.wrapper.scrollTop = this.$store.state.scrollTop
                        })
                    },500)
                }
                if(routerObj.backType == 'lt'){
                    this.type = null
                    this.sendChildCategory(routerObj.list, true)
                }
            }

            //左侧传分类查询
            bus.$on("sendList", (arg)=>{
                this.sendChildCategory(arg)
            })

            //点击搜索框加载动画
            bus.$on("changType", ()=>{
                this.type = null
                setTimeout(()=>{
                    this.type = 1
                },500)
            })

            //点击搜索框
            bus.$on("keyWordSearch", (arg)=>{
                document.querySelector(".scroll_contrain").scrollTop = 0
                if(arg.length>0){
                    this.type = 1
                    this.isSearch = true
                    this.categoryList = arg                
                }
                else{
                    this.categoryList = []
                    this.type = null
                    setTimeout(()=>{
                        this.type = 2
                    },600)
                }
                
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

        //左边分类搜索
        sendChildCategory(arg, arg1){
            this.type = null
            var obj={
                tid: arg.tid,
                pageIndex: 1,
                pageSize: 100
            }
            this.$api.categorySearchFn(obj).then((res)=>{
                if(res.data.code==0){
                    var data = res.data.data
                    this.type = 1
                    this.categoryList = res.data.data.esFaqArticleList
                    if(arg1){
                        this.$nextTick(() => {
                            this.$refs.wrapper.scrollTop = this.$store.state.scrollTop
                        })
                    }
                }
                else
                    this.type = 2
            })
            .catch((err)=>{
                console.log(err)
                this.type = 2
            })
        },
        searchChildFn(arg){
            this.$nextTick(function () {
                this.$store.commit("getScrollTopFn", this.$refs.wrapper.scrollTop)
            });
            if(this.isSearch){
                this.$store.commit("getIsSearchFn", true)
                this.$store.commit("categoryList", this.categoryList)
            }
            else{
                this.$store.commit("getIsSearchFn", false)
                this.$store.commit("categoryList", arg)
            }
            this.$store.commit("getTypeFn", "categoryList")
            arg.backType = 'lt'
            arg.click = 'click'
            this.$router.push({
                name: 'index',
                params: arg
            })
        }
    },
    created(){
        this.loadingPageFn()
    },
    filters:{
        content(val){
            var main = val.replace(/(<[^<>]+>)|(&nbsp;)/g,""),
                n = Math.ceil(Math.random()*(200-100))+100
            if(main.length>n)
                return main.slice(0,n) + '......'
            else
                return main.slice(0,n)
        },
        time(val){
            return $Fn.changeTimeFn(val)
        }
    }
}
</script>

<style>

</style>
