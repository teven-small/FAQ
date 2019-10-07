<template>
    
    <!-- 左边导航栏 -->
    <div class="lt_aside lt" :style="style">
        <div class="lt_blank"></div>
        <div class="aside_content">
            <div class="logo_div">
                <img src="../assets/imgs/logo.png" alt="" @click="jumpHome">
            </div>

            <div class="category" :style="heightObj">
                <div class="category_item" v-for="(item1, index1) in category" :key="index1">
                    <p>{{item1.title}}</p>
                    <ul>
                        <li v-for="(item2, index2) in item1.children" :key="index2" :title="item2.type" @click="categorySearch(item2)">{{item2.type}}</li>
                    </ul>

                    <div :class="['more_btn',{active:item1.active == true}]" v-show="item1.show">
                        <span @click="handleClick(index1)"><i></i>{{item1.text}}</span></div>
                </div>
                <div class="back_top" v-show="showTop">
                    <img src="../assets/imgs/back_top.png" @click="backTop">
                </div>
            </div>
        </div>
        <div class="lt_blank"></div>
    </div>
   
</template>

<script>
import {bus} from '@/main'
export default {
    props:['move'],
    data(){
        return{
            //页面高度
            style:{
                width: 0
            },
            //左侧aside
            // test:[
            //     { title: '页面信息', show: false,text:'展开', children:['分类索引','特色内容', '新闻动态', '最近更改', '随机条日'] },
            //     { title: '客服共享资源', show: false,text:'展开', children:[
            //         'MediaWiKi','元维基', '维基百科', '维基数据', '维基曼尼亚','MediaWiKi','元维基', '维基百科', '维基数据', '维基曼尼亚'
            //         ] 
            //     },
            //     { title: '特色内容源', show: false,text:'展开', children:['每日图片','典范条目', '优良条目', '最近更改', '随机条日','最近更改', '随机条日'] },
            //     { title: '学习资料库', show: false,text:'展开', children:['每日图片','典范条目', '优良条目', '最近更改', '随机条日','最近更改', '随机条日'] }
            // ], 
            test:[],

            timer:null,         //定时器
            category:[],        //类别数组
            time1: null,
            showTop: false
        }
    },
    methods:{
        //返回首页
        jumpHome(){
            this.$router.replace({ name: 'home' })
        },

        //回到顶部
        backTop(){

            const el = document.querySelector('.category');
            
            this.timer = setInterval(()=>{
                el.scrollTop -= 30
                if(el.scrollTop <= 0)
                    clearInterval(this.timer)
            }, 1)
        },

        //点击展开和收起
        handleClick(index){
            
            if(this.category[index].text == '展开'){
                this.category[index].children = this.test[index].childTypeList
                this.category[index].text = '收起'
                this.category[index].active = true
            }
            else{
                this.category[index].children = this.test[index].childTypeList.slice(0,6)
                this.category[index].text = '展开'
                this.category[index].active = false
            }
        },

        //移动
        moveFn(){
            if(this.move){
                this.timer1 = setInterval(()=>{
                    this.style.width += 220
                    if(this.style.width >= 220){
                        this.style.width = 220+'px'
                        clearInterval(this.timer1)
                    }
                }, 100)
            }else{
                this.style.width = 220+'px'
            }
        },

        //获取类别数据
        getCategory(){
            //设置开关
            var on = false
            this.$api.categoryFn().then((res) => {
                if(res.data.code == 0){
                    var data = res.data.data
                    this.test = data
                    //遍历数组category
                    for(var i=0,len=data.length;i<len;i++){
                        
                        if(data[i].childTypeList.length > 6){
                            on = true
                        }else{
                            on = false
                        }
                        //压缩到视图数组中
                        if(on){
                            this.category.push({   
                                tid: data[i].tid, 
                                title: data[i].type, 
                                show: true,
                                text:'展开', 
                                active: false,
                                children: data[i].childTypeList.slice(0,6)
                            }) 
                        }else{
                            this.category.push({
                                tid: data[i].tid, 
                                title: data[i].type, 
                                show: false,
                                text:'', 
                                active: true,
                                children: data[i].childTypeList
                            }) 
                        }
                    }
                    
                }
            })
        },

        categorySearch(arg){
           var obj={
                backType: 'lt',
                list: arg
           }
           if(this.$router.currentRoute.name != 'categoryList'){
                this.$router.push({ 
                    name: 'categoryList',
                    params: obj,
                })
            }else
                bus.$emit("sendList", arg)
        }
        
    },
    created(){

        this.getCategory()

        //移动
        this.moveFn()
    },
    mounted(){
        var that = this
        this.$nextTick(() => {
        const el = document.querySelector('.category');
        const offsetHeight = el.offsetHeight;
            el.onscroll = () => {
            const scrollTop = el.scrollTop;
            const scrollHeight = el.scrollHeight;
            
                if (scrollTop > 100) {
                    this.showTop = true
                // 需要执行的代码
                }
            };
        });
    },
    destroyed(){
        //清除定时器
        clearInterval(this.timer)
    },
    computed:{
        heightObj(){
            var hStyle
            return hStyle = {
                height: this.$store.state.style.height - 200 + 'px'
            }
        }
    }
}
</script>

