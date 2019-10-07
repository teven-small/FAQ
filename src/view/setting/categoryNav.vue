<template>
    <div class="manage_nav">
                
        <topAside :hideSearch="2"></topAside>

        <div class="category_add">
            <button class="default_btn add_btn" @click="showAddBoxFn"><i>+</i>新增</button>
        </div>
        <el-scrollbar style="height:640px;min-height:640px;">
            <div class="manage_box" style="padding-top:0">
                <el-collapse accordion>
                    <el-collapse-item v-for="(item, index) in categoryArr" :key="index">
                        <template slot="title">
                        <!-- <span style="width: 10%;text-align: center;">一</span> -->
                            <span style="width:20%;padding-left:20px;letter-spacing: 3px;">{{item.type}}</span>
                        </template>

                        <el-table :data="item.childTypeList" style="width:100%;background:transparent;">
                            <el-table-column label="序号">
                                <template slot-scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column :prop="item.type"  label="一级标题">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.parentId" placeholder="请选择" @change="((val)=>{selectChangeFn(val, scope.row)})">
                                        <el-option v-for="item1 in categoryArr" :key="item1.tid" :label="item1.type" :value="item1.tid"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="二级标题">
                                <template slot-scope="scope">
                                    <input type="text" v-model.trim="scope.row.type" @keyup.enter="enterFn" @change="inputChangeFn(scope.row.type, scope.row)">
                                </template>
                            </el-table-column>
                            <el-table-column prop="typeCode" label="二级标题code"></el-table-column>
                            <el-table-column prop="status"  label="标题状态">
                                <template slot-scope="scope">
                                    <el-switch :value="scope.row.status" :active-value="0" :inactive-value="1" active-color="#409EFF" inactive-color="#F56C6C"
                                    @click.native="statusChangeFn(scope.row.status, scope.row)"></el-switch>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-scrollbar>
        <el-dialog title="新增标题" :visible.sync="showDialog" @closed="closeFn">
           <div class="add_form">
                <div class="tmp">
                    <label>新增标题类型</label>
                    <el-select v-model="valObj.value" placeholder="请选择"  @change="((value)=>{addSelectFn(value)})" style="width:190px">
                        <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="tmp" v-if="show_one">
                    <label>一级标题名称</label>
                    <input claas="tmp_input" type="text" v-model.trim="oneTitle">
                </div>
                <div class="tmp" v-if="show_two">
                    <label>一级标题名称</label>
                    <el-select v-model="selectValue" autocomplete="true" style="width:190px" placeholder="请选择">
                        <el-option v-for="(item,index) in categoryArr" :key="index" :label="item.type" :value="item.tid"></el-option>
                    </el-select>
                </div>
                <div class="tmp" v-if="show_two">
                    <label>二级标题名称</label>
                    <input claas="tmp_input" type="text" v-model.trim="twoTitle">
                </div>
                <div class="tmp">
                    <el-button type="primary" @click="addSubmiteFn">新增提交</el-button>
                </div>
           </div>
        </el-dialog>
    </div>
</template>

<script>
import topAside from '../../components/topAside';
export default {
    components:{
        topAside
    },
    data(){
        return{
            categoryArr: [],
            value: null,
            options: [
                {label: "一级标题", value: 1},
                {label: "二级标题", value: 2}
            ],
            options1: [],                   
            showDialog: false,              //显示弹出框
            valObj: {                       //新增类型值
                value: 1
            },                         
            selectValue: null,              //二级标题下拉框值
            show_one: true,                 //显示一级标题输入框
            show_two: false,                //显示二级标题输入框
            oneTitle: '',
            twoTitle: ''
        }
    },
    methods:{

        loadingPageFn(){

            //获取所有类别
            this.getAllCategoryFn()
        },

        //获取所有类别
        getAllCategoryFn(){
            var params = {
                status: -1
            }
            this.$api.categoryFn(params).then((res) => {
                if(res.data.code==0){
                    var data = res.data.data
                    //console.log(data)
                    this.categoryArr = []
                    this.categoryArr = data
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        },

        //修改所属一级分类
        selectChangeFn(arg,arg1){
            console.log(arg,arg1)
            var obj={
                tid: arg1.tid,
                parentId: arg
            }
            this.$confirm('是否确认修改', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //子类修改
                this.updateChildrenCategoryFn(obj)
            }).catch(() => {
                //获取所有类别
                this.getAllCategoryFn()  
            });
        },

        //子类修改
        updateChildrenCategoryFn(arg){
           
            this.$api.updateChildrenCategory(arg).then((res)=>{
                if(res.data.code==0){
                    console.log(res.data)
                    this.$message({
                        type: 'success',
                        duration: 1000,
                        message: res.data.msg
                    });

                    //获取所有类别
                    this.loadingPageFn()
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        },

        //修改二级名字
        inputChangeFn(val, arg){
            if(val){
                var obj ={
                    tid: arg.tid,
                    type: val
                }
                //子类修改
                this.updateChildrenCategoryFn(obj)
            }
        },

        //二级标题回车失去焦点
        enterFn(val){
            val.target.blur()
        },

        //二级标题状态
        statusChangeFn(val, arg){
            var obj={
                tid: arg.tid,
                status: ''
            }, str = ''
            if(val==0){
                str = '您是否停用该账户？'
                obj.status = 1
            }else{
                str = '您是否启用该账户？'
                obj.status = 0
            }
            this.$confirm(str,'温馨提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                //子类修改
                this.updateChildrenCategoryFn(obj)
                   
            }).catch(() => {
                this.$message({
                    type: 'info',
                    duration: 1000,
                    message: '已取消操作！'
                });          
            });
        },

        //显示新增弹出框
        showAddBoxFn(){
            this.showDialog = true
        },

        //关闭新增弹出框
        closeFn(){
            this.showDialog = false
            this.oneTitle = ''
            this.twoTitle = ''
            this.selectValue = null
        },

        //新增标题下拉框
        addSelectFn(arg){
                this.oneTitle = ''
                this.twoTitle = ''
                this.selectValue = null
            if(arg ==1){
                this.show_one = true
                this.show_two = false
            }else{
                this.show_one = false
                this.show_two = true
            }
        },

        //新增提交数据
        addSubmiteFn(){
            var obj={}
            if(this.valObj.value==1){
                if(this.oneTitle==''){
                    this.$message({
                        type: 'warning',
                        message: '一级标题名称不能为空！'
                    });   
                    return
                }
                if(this.oneTitle.length>10){
                    this.$message({
                        type: 'warning',
                        message: '一级标题名称不能超过10个！'
                    });   
                    return
                }
                obj.type = this.oneTitle
                obj.parentId = 0
            }
            else{
                if(this.selectValue==null){
                    this.$message({
                        type: 'warning',
                        message: '请选择一级标题名称！'
                    }); 
                    return  
                }
                if(this.twoTitle==''){
                    this.$message({
                        type: 'warning',
                        message: '二级标题名称不能为空！'
                    });   
                    return
                }
                if(this.twoTitle.length>10){
                    this.$message({
                        type: 'warning',
                        message: '二级标题名称不能超过10个！'
                    });   
                    return
                }
                obj.type = this.twoTitle
                obj.parentId = this.selectValue
            }
            this.addCategoryTitleFn(obj)
        },

        //新增标题
        addCategoryTitleFn(arg){
            this.$api.addCategoryFn(arg).then((res)=>{
                if(res.data.code == 0){
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    this.closeFn()
                    //刷新页面
                    this.loadingPageFn()
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }

    },
    created(){
        this.loadingPageFn()
    }
    
}
</script>
