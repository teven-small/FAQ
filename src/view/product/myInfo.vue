<template>
    <el-scrollbar style="height:100%">
        <div class="my_info">
            <div class="info_item">
                <div class="sub_title"><span class="user">个人资料</span></div>
                <div class="clear">
                    <label>名称</label>
                    <div>
                        <input type="text" placeholder="最帅开发师" disabled v-model.trim="name">
                    </div>
                </div>
                <div class="clear">
                    <label>部门</label>
                    <div>
                        <input type="text" placeholder="部门" disabled v-model.trim="department">
                    </div>
                </div>
            </div>
            <div class="info_item">
                <div class="sub_title"><span class="pwd">密码修改</span></div>
                <div class="clear">
                    <label>*当前密码</label>
                    <div>
                        <input type="password" placeholder="当前密码" v-model.trim="oldPwd" @keyup.enter="submiteForm">
                    </div>
                </div>
                <div class="clear">
                    <label>*新密码</label>
                    <div>
                        <input type="password" placeholder="新密码" v-model.trim="newPwd" @keyup="compareFn" @keyup.enter="submiteForm">
                    </div>
                </div>
                <div class="clear">
                    <label>*确认密码</label>
                    <div>
                        <input type="password" placeholder="确认密码" v-model.trim="confirmPwd" @keyup="compareFn" @keyup.enter="submiteForm">
                    </div>
                    <p v-show="show">
                        <span class="error_tip" v-if="same"><i></i>两次密码不一致</span>
                        <span class="success_tip" v-else><i></i>通过</span>
                    </p>
                </div>
            </div>
            <div class="submite">
                <span class="_btn_" @click="submiteForm">确认</span>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
import $Fn from '@/assets/js/public'
export default {
    data(){
        return{ 
            curIndex: null,
            same: null,
            show: false,
            name: '',
            department: '',
            oldPwd: '',
            newPwd: '',
            confirmPwd: ''
        }
    },
    methods:{
        submiteForm(){
            if(this.oldPwd == ''){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '当前密码不能为空！'
                })
                return
            }
            if(this.newPwd == ''){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '新密码不能为空！'
                })
                return
            }

            if(this.newPwd != this.confirmPwd){
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '两次输入的密码不一致！'
                })
                return
            }
            
            let params = {
                account: this.$store.state.user,
                newPassword: this.$md5(this.confirmPwd),
                oldPassword: this.$md5(this.oldPwd)
            }

            this.$api.updatePwdFn(params).then((res)=>{
                console.log(res.data)

                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        showClose: true,
                        message: res.data.msg
                    })

                    //清除输入框
                    this.name = ''
                    this.department = ''
                    this.oldPwd = ''
                    this.newPwd = ''
                    this.confirmPwd = ''
                    this.show = false
                    return
                }
            })
            .catch((error)=>{
               this.$message({
                    showClose: true,
                    type: 'warning',
                    message: '网络超时！',
                    duration: 1500,
                })
            })
           
        },

        //键盘按下
        compareFn(){

            //新密码和确认密码为空时隐藏
            if(this.newPwd == '' && this.confirmPwd == '')
                this.show = false
            else{

                this.show = true

                //判断新密码和确认密码是否相等
                if(this.newPwd != this.confirmPwd)
                    this.same = true
                else
                    this.same = false   
            }
        },
    },
    mounted(){
       

        if(parseInt(this.$store.state.limit) == 0)
            this.curIndex = 3
        else
            this.curIndex = 5

        this.name = this.$store.state.name
        this.department = this.$store.state.deptName
    }
}
</script>
