<template>
    <div class="scroll_contrain" ref="wrapper">
        <div class="article_box" v-if="type==1">
            <div class="article_item" v-for="(item, index) in loveList" :key="index">
                <p @click="readArticle(item)">{{item.title}}</p>
                <div class="describe" @click="readArticle(item)">{{item.content|content}}</div>
                <div class="clear">
                    <span class="author lt" style="margin-right: 20px;">{{item.author}}</span>
                    <span class="time lt">{{item.releaseTime|time}}</span>
                    <button class="default_btn cancle_love_btn rt" @click="cancelCollect(item, index)"><i></i>取消收藏</button>
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

import $Fn from '@/assets/js/public'
import Loading from '@/components/loading';

export default {
    components:{
        Loading
    },
    data(){
        return{ 
            loveList:[],
            curIndex: null,
            showTop: false,
            timer: null,
            type: null
        }
    },
    methods:{
        //取消收藏
        cancelCollect(arg, arg1){
            this.$confirm('您确定取消收藏么, 是否继续?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {
                    uid: this.$store.state.uid,
                    nid: arg.nid,
                    gid: ''
                }
                this.$api.canaleCollectFn(params).then((res)=>{
                    //console.log(res)
                    if(res.data.code == 0 ){
                        this.loveList.splice(arg1, 1)
                        this.$message({
                            type: 'success',
                            duration: 1000,
                            message: res.data.msg
                        });
                    }
                })
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    duration: 1000,
                    message: '没有操作！'
                });          
            });
        },

        //获取收藏文章列表
        getCollectLish(){
            var params={
                uid: this.$store.state.uid
            }

            this.$api.collectLiatFn(params).then((res)=>{
                if(res.data.code == 0){
                    //console.log(res.data)
                    var data = res.data.data
                    if(data){
                        this.loveList = data
                        this.type = 1
                    }else{
                        this.$message({
                            type: 'warning',
                            duration: 1000,
                            message: res.data.msg
                        });  
                        this.type = 2
                    }
                }
            })
            .catch((err)=>{
                console.log(err)
                this.type = null 
            })
        },

        //获取审核文章列表
        readArticle(arg){
            //console.log(arg)
            this.$nextTick(function () {
                this.$store.commit("getScrollTopFn", this.$refs.wrapper.scrollTop)
            });
            arg.backType = 'collect'
            this.$store.commit("getTypeFn", "collect")
            this.$router.push({ 
                name: 'index',
                params: arg,
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
        this.getCollectLish()

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

        if(parseInt(this.$store.state.limit) == 0)
            this.curIndex = 2
        else
            this.curIndex = 4
         
    },
    activated() {
      this.$refs.wrapper.scrollTop = this.$store.state.scrollTop
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
