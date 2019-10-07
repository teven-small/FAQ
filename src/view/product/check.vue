<template>
  <el-scrollbar style="height:100%">
    <div class="article_box checked _loading_">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="item.label"
          :name="item.name"
          v-for="(item, index) in tabs"
          :key="index"
        >
          <div v-if="type==1">
            <div class="article_item" v-for="(item, index) in checkData" :key="index">
              <p @click="readArticle(item)">{{item.title}}</p>
              <div class="describe" @click="readArticle(item)">{{item.describe}}</div>
              <div class="clear">
                <div class="lt">
                  <span class="author lt">{{item.author }}</span>
                  <span class="time lt">{{item.time}}</span>
                  <span class="lt" style="margin-left:14px">发布于：</span>
                  <span class="lt">{{item.platform}}</span>
                </div>
                <button class="default_btn look_btn rt" v-if="showLook" @click="readArticle(item)">
                  <i></i>查看
                </button>
              </div>
              <img src="../../assets/imgs/pass.png" class="pass_tip" v-if="item.pass==1" />
              <img src="../../assets/imgs/no_ppass.png" class="pass_tip" v-else-if="item.pass==2" />
            </div>
          </div>

          <div class="no_checked" v-else-if="type==2">
            <img src="../../assets/imgs/no_check.png" />
          </div>

          <Loading v-else></Loading>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog title="温馨提示" :visible.sync="showBox" width="30%" class="showReson">
      <p class="clear">
        <span class="lt">审核人：</span>
        <span class="lt">{{checkPerson}}</span>
      </p>
      <p class="clear">
        <span class="lt">审核时间：</span>
        <span class="lt">{{checkTime}}</span>
      </p>
      <p class="clear">
        <span class="lt">未通过原因：</span>
        <span class="lt" style="width: 84%;">{{reson}}</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeBox">关 闭</el-button>
      </span>
    </el-dialog>
  </el-scrollbar>
</template>

<script>
import Loading from "@/components/loading";
import $Fn from "@/assets/js/public";
export default {
  components: {
    Loading
  },
  data() {
    return {
      tabs: [
        { name: "first", label: "待审核" },
        { name: "second", label: "审核已通过" },
        { name: "third", label: "审核未通过" }
      ],
      type: null,
      checkData: [],
      noData: false,
      activeName: "first",
      checkTpye: 0, //文章审核状态
      showLook: true, //显示查看按钮
      showBox: false, //显示弹出框
      reson: null,
      checkPerson: null,
      checkTime: null
    };
  },

  methods: {
    //获取审核文章列表
    readArticle(arg) {
      let params1 = {
        nid: arg.nid
      };
      if (this.checkTpye == 0 || this.checkTpye == 1) {
        //待审核跳转  待审通过核跳转
        this.$api.readArticleFn(params1).then(res => {
          if (res.data.code == 0) {
            //console.log(res.data)
            this.$store.commit("getTypeFn", "check");
            var data = res.data.data;
            data.backType = "check";
            if (this.checkTpye == 0) data.checkBtn = true;
            else {
              data.checkBtn = false;
              data.checkState = 1;
            }
            this.$router.push({
              name: "index",
              params: data
            });
          }
        });
      } else {
        //待审不通过核跳转
        this.$api.readNoCheckArticleFn(params1).then(res => {
          if (res.data.code == 0) {
            //console.log(res.data.data)
            var data = res.data.data;
            this.showBox = true;
            this.reson = data.remark;
            this.checkPerson = data.auditor;
            this.checkTime = $Fn.changeTimeFn(data.auditTime);
          }
        });
      }
    },

    //审核类型切换
    handleClick(arg) {
      this.type = null;
      this.checkData = [];
      var index = parseInt(arg.index);
      this.checkTpye = index;
      if (index == 0 || index == 1) this.showLook = true;
      else this.showLook = false;
      //获取待审核数据
      this.getPending(index);
    },

    //获取待审核数据
    getPending(arg) {
      let params = {
        uid: this.$store.state.uid,
        status: arg
      };
      this.$api
        .getArticleFn(params)
        .then(res => {
          // console.log(res.data)
          if (res.data.code == 0) {
            var data = res.data.data;
            if (data) {
              this.type = 1;
              this.checkData = data;
            } else this.type = 2;
          } else {
            this.type = 2;
            this.$message({
              type: "warning",
              showClose: true,
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.type = 2;
        });
    },

    //关闭弹出框
    closeBox() {
      this.showBox = false;
    },

    //页面加载
    loadingFn() {
      const routeObj = this.$route.params,
        on = $Fn.parameterFn(this.$route.params);

      //传参数
      if (on) {
        if (routeObj.checkState == 1) {
          this.activeName = "second";
          this.checkTpye = 1;
          this.getPending(1); //审核通过状态
        } else {
          this.checkTpye = 0;
          this.getPending(0); //待审核状态
        }
      }
      //获取待审核数据
      else this.getPending(0);
    }
  },
  created() {
    //页面加载
    this.loadingFn();
  }
};
</script>
