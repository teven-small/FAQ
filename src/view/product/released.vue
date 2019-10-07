<template>
    <el-scrollbar style="height:100%">
        <div class="article_box released _loading_" v-if="type==1">
            <span class="back lt" style="position:relative;top:15px;z-index:8;" @click="backFn">返回</span>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="item.label" :name="item.name"  v-for="(item, index) in tabs" :key="index">
                    <div v-if="checkData.length>0">
                        <div class="article_item" v-for="(item, index) in checkData" :key="index">
                            <p @click="readArticle(item)">{{item.title}}</p>
                            <div class="describe" @click="readArticle(item)">{{item.content|content}}</div>
                            <div class="clear">
                                <div class="lt">
                                    <span class="author lt">{{item.author}}</span>
                                    <span class="time lt">{{item.releaseTime|time}}</span>
                                </div>
                                <div class="rt" v-if="noPass==3">
                                    <button class="default_btn update_btn" @click="updateArticle(item)"><i></i>修改</button>
                                    <button class="default_btn delete_btn" @click="deleteArticle(item, index)"><i></i>删除</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="no_checked" v-else-if="type==2">
                        <img src="../../assets/imgs/no_check.png" />
                    </div>

                    <Loading v-else></Loading>

                </el-tab-pane>
            </el-tabs>
        </div>
    </el-scrollbar>
</template>

<script>

import $Fn from '@/assets/js/public';
import Loading from '@/components/loading';

export default {
    components:{
        Loading
    },
    data(){
        return{
            tabs:[
                { name: 'first', label: '待审核'},
                { name: 'second', label: '审核已通过'},
                { name: 'third', label: '审核未通过'}
            ],
            checkTpye: 0,                 //文章审核状态
            activeName: 'first',           
            checkData: [],                //审核文章列表数据
            curIndex: null,
            type: null,
            noPass: null
        }
    },
     methods:{
        
        //获取已发表文章列表
        getRealseArticleList(arg){
            let params={
                uid: this.$store.state.uid,
                state: arg
            }
            this.$api.releasedArticleFn(params).then((res)=>{
               // console.log(res.data)
                if(res.data.code == 0){
                    var data = res.data.data[0].content
                    if(data.length>0){
                        this.type = 1
                        //数据赋值
                        this.checkData = data
                        this.noPass = arg
                        
                    }else
                        this.type = 2
                }
                else
                    this.type = 2
            })
            .catch((res)=>{
                console.log(res)
                this.type = 2
            })
        },

        //审核类型切换
        handleClick(arg){
        //0: 审核已通过 1: 待审核    2: 审核未通过
            this.checkData = []
            var index = parseInt(arg.index)
            this.checkTpye = index
            if(index == 2)
                index = 3
            else if(index == 0)
                index = 1
            else
                index = 0
            //获取待审核数据
            this.getRealseArticleList(index)
        },
        
        //获取审核文章列表
        readArticle(arg){
            this.type = null
            var obj={
                nid: arg.nid
            }
            this.$api.readArticleFn(obj).then((res)=>{
                if(res.data.code == 0 ){
                   // console.log(res.data)
                    var data = res.data.data
                    data.backType = 'released'
                    data.checkState =  this.checkTpye
                    data.loveBtn = this.checkTpye
                    this.$store.commit("getTypeFn", "released")
                    this.$router.push({ 
                        name: 'index',
                        params: data,
                    })
                }
            })
        },

        //修改文章
        updateArticle(arg){
            arg.backType = 'released'
            arg.checkState = this.checkTpye
            this.$router.push({
                name: 'release',
                params: arg
            })
        },

        //删除文章
        deleteArticle(arg, arg1){
            var obj ={
                nid: arg.nid
            }
            this.$confirm('您确定删除此文章么, 是否继续?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteArticleFn(obj).then((res)=>{
                   // console.log(res)
                    if(res.data.code == 0){
                        this.$message({
                            type: 'success',
                            duration: 1000,
                            message: "删除成功！"
                        });
                        this.checkData.splice(arg1, 1)
                    }
                })
            }).catch(() => {});
        },

        //返回上一页
        backFn(){
            this.$router.push({name: 'release'})
        },

        //页面加载
        loadingFn(){
            if(parseInt(this.$store.state.limit) == 0)
                this.curIndex = 1
            else
                this.curIndex = 3

            const routeObj = this.$route.params,
                on = $Fn.parameterFn(this.$route.params)
            //判断地址栏中 params 是否传值
        
            if(on){           
                if(routeObj.checkState==1){
                    this.activeName = 'second'
                    this.checkTpye = 1
                    this.getRealseArticleList(0)     //审核通过状态
                }else if(routeObj.checkState==2){
                    this.activeName = 'third'
                    this.checkTpye = 2
                    this.getRealseArticleList(3) 
                }else{
                    this.checkTpye = 0
                    this.getRealseArticleList(1)             //待审核状态
                }                  
            }else
                //获取已发表文章列表
                this.getRealseArticleList(1)
        }
    },
    created(){
       
        //页面加载
        this.loadingFn()
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
