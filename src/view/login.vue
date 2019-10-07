<template>
    <div class="login">
        <div class="login_form">
            <div :class="['item', {item_user:showUser}]">
                <i class="login_user"></i>
                <input type="text" v-model.trim="userName" placeholder="请输入用户名" @keyup.enter="login">
            </div>
            <div :class="['item', {item_pwd:showPwd}]">
                <i class="login_pwd"></i>
                <input type="password" v-model.trim="userPwd" placeholder="请输入密码"  @keyup.enter="login">
            </div>
            <div class="login_btn item" @click="login">登录</div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            userName: '',            //用户名
            userPwd: '',             //用户密码
            timeout: null,           //定时器
            showUser: false,
			showPwd: false,
        }
    },

    methods:{
        login(){
            if(this.userName == ''){
                this.$message({
                    showClose: true,
                    type: 'warning',
                    message: '用户名不能为空！',
                    duration: 1500,
                })
                return;
            }
            if(this.userPwd == ''){
                this.$message({
                    showClose: true,
                    type: 'warning',
                    message: '密码不能为空！',
                    duration: 1500,
                })
                return;
            }
            let userInfo = {
                account: this.userName,
                password: this.$md5(this.userPwd)
            }
            this.$api.loginFn(userInfo).then((res) => {
				//console.log(res)
                if(res.data.code == 0){
                    var data = res.data.data
                    let info = {
                        token: data.token, 
                        user: userInfo.account,
                        uid: data.uid,
                        limit: data.isAuditor,
                        name: data.name,
                        deptName: data.deptName
                    }
                    //提交 token 给store
                    this.$store.commit('getToken', info)

                    this.$message({
                        showClose: true,
                        type: 'success',
                        duration: 1000,
                        message: res.data.msg
                    })
                    //跳转
                    this.timeout = setTimeout(()=>{
                        //清除输入框的值
                        this.userName = ''
                        this.userPwd = ''
                        this.$router.replace({
                            name: 'home'
                        })
                    }, 500)
                }
            })
            .catch((error) => {         //登录失败
                this.$message({
                    showClose: true,
                    type: 'warning',
                    message: '网络超时！',
                    duration: 1500,
                })
            })
		},
    },
    created(){
	},
   
    watch:{
        userName(val){
            if(val!='')
                this.showUser = true
            else
                this.showUser = false
        },
        userPwd(val){
            if(val!='')
                this.showPwd = true
            else
                this.showPwd = false
        }
	},
	
    destroyed(){
        //清除定时器
        clearTimeout(this.timeout)
    }
}
</script>
