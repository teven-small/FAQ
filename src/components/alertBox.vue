<template>
<transition name="fade">
    <div class="mask" v-show="showMask">
        <div class="news_box" :style="style1">
            <div class="title" style="text-align:center">
                <span>{{title}}</span>
                <span class="rt" @click="closeMask">X</span>
            </div>
            <div class="form_box">
                <div>
                    <label>用户名称：</label>
                    <input type="text" v-model.trim="loginName" :disabled="disabled1">
                </div>
                <div>
                    <label>登录账号：</label>
                    <input type="text" v-model.trim="account" :disabled="disabled2">
                </div>
                 <div>
                    <label>归属部门：</label>
                    <!-- <input type="text" v-model="department"> -->
                    <el-select v-model="department.deptId" style="margin:0 0 0 6px;width:350px" placeholder="请选择" class="dep">
                        <el-option v-for="item in options" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                    </el-select>
                </div>
                <div>
                    <label>审核权限：</label>
                    <el-switch v-model="checkedStatus" :active-value="0" :inactive-value="1" active-color="#409EFF" inactive-color="#F56C6C" 
                    @change="checkedStausFn(checkedStatus)"></el-switch>
                </div>
                <div class="role_box check_info">
                    <label>审核</label>
                    <span class="lt">：</span>
                    <el-select v-model="checkedArr.deptId" multiple collapse-tags autocomplete="true" style="margin:0 0 0 6px;width:350px" placeholder="请选择" :disabled="disabled">
                        <el-option v-for="item in options" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                    </el-select>
                </div>
                <div class="role_box check_info">
                    <label class="lt">角色</label>
                    <span class="lt">：</span>
                    <div class="role_item" v-for="(item, index) in roleArr" :key="index" @click="checkedClickFn(item)">
                        <p><img :src="item.img" v-if="item.show"></p>
                        <span>{{item.name}}</span>
                    </div>
                </div>
            </div>
            <div class="form_btn_box">
                <el-button type="primary" size="small" @click="closeMask">取消</el-button>
                <el-button type="danger"  size="small" @click="confirmFn">确认</el-button>
            </div>
        </div>
    </div>
</transition>
</template>

<script>

import $Fn from '../assets/js/public'

export default {
    data(){
        return{
            style1:{
                top: '',
                opacity: 0
            },
            timer: null,
            timeout: null,
            showMask: false,            //遮罩层
            loginName: '',              //登录名称
            account: '',                //登录账号
            department: {               //归属部门
                deptId: null
            },             
            checkedStatus: 1,          //审核权限
            disabled: null,
            disabled1: false,
            disabled2: false,
            roleArr:[
                { id: 1, name: '管理员', show: false, img: require('../assets/imgs/checked1.png')},
                { id: 2, name: '普通用户', show: false, img: require('../assets/imgs/checked1.png') }
            ],
            options: [],                //所有部门
            checkedArr:{
                deptId: []  
            },             //选中的部门
            oldObj: null,
            submiteType: null,   //提交类型
            title: '',
            uid: null,           //修改用户的uid
            agid: null,          //是否为审核员  0 是  1不是
            name: null,
        }
    },
    methods:{
        //页面加载
        loadingFn(){
            var s = 0, t = 0, o = 0
            this.timer = setInterval(()=>{
                s += 3
                o += 5
                t += 25
                if(s>7){
                    s = 0
                    t = 0
                    o = 0
                    clearInterval(this.timer)
                }else{
                    this.style1.top = t + '%'
                    this.style1.opacity = o/10
                }
            }, 10)
        },
       
        //关闭遮罩层
        closeMask(){
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
                    },100)
                }else{
                    this.style1.top = t + '%'
                    this.style1.opacity = o/10
                }
            }, 10)
        },

        //显示弹出框
        showMaskFn(arg, arg1){
            console.log(arg1)
            if(arg1){
                this.oldObj = {
                    deptId: arg1.deptId,
                    auditorStatus: arg1.auditorStatus,
                    roleId: arg1.roleId,
                    deptIdStr: arg1.deptIdStr
                }
                this.uid = arg1.uid
                this.agid = arg1.agid
                this.name = arg1.name
            }
            this.roleArr.forEach((item)=>{
                item.show = false
            })
            if(arg)
                this.showMask = true
                //修改弹出框
            if(arg1){
                this.submiteType = 'update'
                this.loginName = arg1.name                  //登录名称  
                this.account = arg1.account                 //登录账号
                this.department.deptId = arg1.deptId              //归属部门
                this.checkedArr.deptId = []
                this.disabled1 = true
                this.disabled2 = true
                this.title = '修改用户'
                var arr = ''
                if(arg1.auditorStatus==1||arg1.auditorStatus==null){        //auditorStatus 0 启用  1 不启用
                    this.checkedStatus = 1
                    this.disabled = true
                }
                else{
                    this.checkedStatus = 0
                    this.disabled = false
                }
                
                if(arg1.deptIdStr){
                    if(arg1.deptIdStr.indexOf(',')!=-1){
                        arr = arg1.deptIdStr.split(",")
                        arr.forEach((item)=>{
                            this.checkedArr.deptId.push(parseInt(item))
                        })
                    }else
                        this.checkedArr.deptId.push(parseInt(arg1.deptIdStr))
                }

                if(arg1.roleId==1)
                    this.roleArr[0].show = true
                else if(arg1.roleId==2)
                    this.roleArr[1].show = true
                
                //新增弹出框
            }else{
                this.submiteType = 'add'
                this.title = '新增用户'
                this.loginName = ''                         //登录名称  
                this.account = ''                           //登录账号
                this.department.deptId = null                        //归属部门
                this.checkedArr.deptId = []
                this.checkedStatus = 1
                this.disabled = true
                this.disabled1 = false
                this.disabled2 = false
            }

            this.loadingFn()
        },

        //用户编辑提交数据
        confirmFn(){
            var  checkedStr = ''
            var item = this.roleArr.filter((item)=>{
                return item.show==true
            })
            if(this.loginName==''){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '请填写用户名称！'
                })
                return
            }
            if(this.loginName.length<2||this.loginName.length>6){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '用户名称格式不对，长度必须在2到6之间'
                })
                return
            }
            if(this.account==''){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '请填登录账号！'
                })
                return
            }
            if(this.account.length<4||this.account.length>12){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '登录账号格式不对，长度必须在4到12之间'
                })
                return
            }
            if(this.department.deptId==null){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '请填写归属部门！'
                })
                return
            }
            
            //审核权限开关
            if(this.checkedStatus==1)
                checkedStr = null
            else{
                if(this.checkedArr.deptId.length>0){
                    this.checkedArr.deptId.forEach((item)=>{
                        checkedStr += item + ','
                    })
                    checkedStr = checkedStr.slice(0,-1)
                }else{
                    this.$message({
                        type: 'warning',
                        showClose: true,
                        message: '有审核权限必须选择一个审核部门！'
                    })
                    return
                }
            }
            if(item.length==0){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '请选择角色！'
                })
                return
            }
            if(this.submiteType == 'add'){
                var obj={
                    deptId: this.department.deptId,
                    name: this.loginName,
                    account: this.account,
                    roleId: item[0].id,
                    agid: this.checkedStatus,
                    deptIdStr: checkedStr==null?checkedStr:checkedStr
                }
                console.log(obj)
                this.addAccountFn(obj)
            }
            else if(this.submiteType == 'update'){
                var newObj={
                    deptId: this.department.deptId,
                    auditorStatus: this.checkedStatus,
                    roleId: item[0].id,
                    deptIdStr: checkedStr
                }
                if(this.oldObj.auditorStatus == null)
                    this.oldObj.auditorStatus = 1
                //console.log(this.oldObj, newObj)
                //判断是否有更改
                if(this.oldObj.deptId == newObj.deptId&&this.oldObj.auditorStatus == newObj.auditorStatus&&this.oldObj.roleId == newObj.roleId&&this.oldObj.deptIdStr == newObj.deptIdStr){
                    this.$message({
                        type: 'info',
                        message: '无操作！'
                    })
                    this.closeMask()
                    return
                }else{
                    var submiteObj = {}, newArr = []
                    //获取变更的字段
                    for (var x in newObj){
                        if(newObj[x]!=this.oldObj[x]){
                            submiteObj[x] = newObj[x]
                        }
                    }
                    submiteObj.uid = this.uid
                    submiteObj.name = this.name
                    //agid: this.checkedStatus
                    if(submiteObj.auditorStatus==0&&this.agid==null)
                        submiteObj.agid = 0
                    //console.log(submiteObj)
                    //修改用户信息
                    this.updateAccountFn(submiteObj)
                }
            }
            
        },

        //用户新增
        addAccountFn(obj){
            this.$api.addAccountFn(obj).then((res)=>{
                if(res.data.code==0){

                    this.$message({
                        type: 'success',
                        duration: 2500,
                        message: res.data.msg + '    默认密码是123456'
                    })
                    this.closeMask()
                    this.$emit("refresh", true)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        },

        //用户修改
        updateAccountFn(obj){
            this.$api.updateAccountFn(obj).then((res)=>{
                if(res.data.code==0){

                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    })
                    this.closeMask()
                    this.$emit("refresh", true)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        },

        //审核选中
        checkedClickFn(arg){
            this.roleArr.forEach((item)=>{
                item.show = false
            })
            if(!arg.show)
                arg.show = true
            else
                arg.show = false
        },

        //获取所有可用部门信息
        getDepartmentInfoFn(){  
            this.$api.departmentInfoFn().then((res)=>{
                if(res.data.code == 0){
                    console.log(res.data)
                    this.options = res.data.data
                }
            })
        },
        checkedStausFn(arg){
            if(arg==0)
                this.disabled = false
            else
                this.disabled = true
        }
    },
    mounted(){

        //获取所有可用部门信息
        this.getDepartmentInfoFn()

        //页面加载
        this.loadingFn()
    },
    destroyed(){
        clearInterval(this.timer)
        clearTimeout(this.timeout)
    },
    filters:{
        time(arg){
            return  $Fn.changeTimeFn(arg, true)
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
