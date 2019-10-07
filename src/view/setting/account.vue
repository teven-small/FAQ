<template>
    <div class="account_box">
        <!-- 头部 -->
        <topAside :hideSearch="1" @accountSearch="accountSearchFn"></topAside>

        <div class="manage_box">
            <div><button class="default_btn add_btn" @click="addAccountFn"><i>+</i>新增</button></div>
            
            <el-table :data="tableData" style="width:100%;height:537px;background:transparent;">
                <el-table-column prop="id" label="编号ID" width="120"></el-table-column>
                <el-table-column prop="name"  label="用户名称"></el-table-column>
                <el-table-column prop="account"  label="登录名称"></el-table-column>
                <el-table-column prop="deptName"  label="部门"></el-table-column>
                <el-table-column prop="status" label="用户状态">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.status==0?'正常':'停用'" placement="right" popper-class="tooltip_bk">
                            <el-switch :value="scope.row.status" :active-value="0" :inactive-value="1" active-color="#409EFF" inactive-color="#F56C6C"
                            @click.native="changeAccountStatusFn(scope.row.status, scope.row)"></el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime"  label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime|time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateAccountFn(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination style="margin-top:44px;text-align: center"  background layout="prev, pager, next, jumper" :total="total" :page-size="15"
            :current-page="1" @current-change="changCuurengFn"></el-pagination>
        </div>

        <!-- 用户编辑 -->
        <alertBox ref="sendChild" @refresh="refreshFn"></alertBox>
    </div>
</template>

<script>

import topAside from '../../components/topAside';
import alertBox from '../../components/alertBox';
import $Fn from '../../assets/js/public'
export default {
    components:{
        topAside,
        alertBox
    },
    data(){
        return{
            tableData: [],
            pageIndex: 1,           //分页当前页
            pageSize: 10,           //分页每页大小
            total: 0,               //总页数
            status: '',             //用户状态   
            account: '',            //用户名称               
        }
    },
    methods:{

        //页面加载
        loadingFn(){
            this.account = this.$store.state.account

            //获取账号列表数据
            this.tableList()

        },

        //获取账号列表数据
        tableList(){
            var params={
                pageNum: this.pageIndex,
                pageSize: this.pageSize,
                account: this.account,
                status: this.status
            }
            this.$api.manageAccountFn(params).then((res)=>{
                console.log(res.data)
                if(res.data.code==0){
                    var data = res.data.data, i = 0
                    this.total = data.total
                    this.tableData = []
                    data.rows.forEach(item => {
                        i++
                        this.tableData.push({
                            id: i,
                            account: item.account,
                            agid: item.agid,
                            auditorStatus: item.auditorStatus,
                            createTime: item.createTime,
                            deptId: item.deptId,
                            deptIdStr: item.deptIdStr,
                            deptName: item.deptName,
                            name: item.name,
                            status: item.status,
                            uid: item.uid,
                            roleId: item.roleId
                        })
                    });
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        },

        //分页点击页码
        changCuurengFn(arg){
            this.pageIndex = arg
            this.tableList()
        },

        //账号搜索
        accountSearchFn(arg){
            console.log(arg)
            this.status = arg.status
            this.account = arg.loginName
            this.tableList()
        },

        //账号修改
        updateAccountFn(arg){
            this.$refs.sendChild.showMaskFn(true, arg)
        },

        //新增账号
        addAccountFn(){
            this.$refs.sendChild.showMaskFn(true)
        },

        //账号状态修改  
        changeAccountStatusFn(arg,arg1){
            var statusStr = '', str = ''
            if(arg==1){
                str = '您是否启用该账户？'
                statusStr = 0
            }else{
                str = '您是否停用该账户？'
                statusStr = 1
            }
    
            this.$confirm(str,'温馨提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    
                    var obj={
                        uid: arg1.uid,
                        status: statusStr
                    }
                     console.log(obj)
                    //用户状态改变
                    this.$api.updateAccountStatus(obj).then((res)=>{
                        if(res.data.code == 0){
                            this.$message({
                                type: 'success',
                                message: res.data.msg
                            });
                            this.loadingFn()
                        }
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    duration: 1000,
                    message: '已取消操作！'
                });          
            });
        },

        //刷新页面
        refreshFn(arg){
            this.loadingFn()
        }
    },

    mounted(){
        this.loadingFn()
    },
    filters:{
        time(arg){
            return $Fn.changeTimeFn(arg, true)
        }
    }
}
</script>

<style>

</style>
