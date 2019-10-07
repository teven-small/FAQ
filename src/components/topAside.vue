<template>
  <!-- 顶部导航栏 -->
  <div class="top_aside">
    <div class="nav_box clear">
      <div class="top_blank lt"></div>
      <div class="b_border lt">
        <div class="top_nav rt">
          <div
            class="nav_item lt"
            v-for="(item, index) in nav"
            :key="index"
            @click="handleClick(index,item)"
          >
            <div
              :class="['icon_box', {setting:index==0}, {news:index==1}, {check:index==2}, {publish:index==3}, {collect:index==4}, {my:index==5}]"
              v-if="limitShow"
            >
              <i :class="[{active: newIndex == item.name}]"></i>
              <strong v-if="item.show&&totle>0">{{totle}}</strong>
            </div>
            <div
              :class="['icon_box', {check:index==0}, {publish:index==1}, {collect:index==2}, {my:index==3}]"
              v-else
            >
              <i :class="[{active: newIndex ==  item.name}]"></i>
              <strong v-if="item.show&&totle>0">{{totle}}</strong>
            </div>
            {{item.name}}
          </div>
        </div>
      </div>
    </div>

    <div class="search" v-if="hideSearch==1">
      <div class="manage_search clear">
        <div class="lt name_box">
          <label>登录名称</label>
          <input type="text" v-model="loginName" />
        </div>
        <div class="lt user_box">
          <label>用户状态</label>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="lt">
          <button class="default_btn saerch_btn" @click="selectClickFn">
            <i></i>搜索
          </button>
          <button class="default_btn reset_btn" @click="resetFn">
            <i></i>重置
          </button>
        </div>
      </div>
    </div>

    <div class="search" v-else-if="hideSearch==2"></div>
    <!-- 搜索框 -->
    <div class="search" v-else>
      <div class="clear lt" :style="wStyle">
        <div class="clear" style="width: 730px;margin: 0 auto;">
          <img src="../assets/imgs/FAQ.png" />

          <div
            class="downMenu lt"
            @mouseenter="downMenuMouseenter"
            @mouseleave="downMenuMouseleave"
          >
            <i></i>
            <span>{{menuText==''?'所有平台':menuText}}</span>
            <transition name="slide-fade">
              <div class="down_menu_list" v-show="showMenu">
                <p
                  v-for="(item, index) in menuList"
                  :key="index"
                  @click="downMenuClick(index)"
                >{{item}}</p>
              </div>
            </transition>
          </div>

          <div class="search_box">
            <input
              type="text"
              class="inputFn"
              placeholder="搜索相关文章"
              v-model="keyWord"
              @focus="focueFn"
              v-outSide="clickOutSide"
            />
            <i class="search_icon" @click="clickSearchFn"></i>

            <div class="over_hide" v-show="showList">
              <div class="search_list">
                <p
                  class="item"
                  v-for="(item, index) in searchList"
                  :key="index"
                  @click="getArticleFn(item)"
                >{{item.title}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rt logout" v-if="showLogout">
        <span class="_btn_" @click="logoutFn">安全退出</span>
      </div>
    </div>
    <i class="move_star" v-if="showStar" :style="style"></i>
  </div>
</template>

<script>
import { bus } from "@/main";
import $Fn from "@/assets/js/public";

export default {
  props: ["hideSearch"],
  data() {
    return {
      limit: 0, //权限

      //导航栏
      nav: [],

      showNews: false, //显示消息
      changInput: null, //搜索输入框
      showMenu: false, //显示搜索类别
      showStar: false, //显示星星
      time: null, //收藏星星定时器

      //收藏星星的样式
      style: {
        top: "",
        right: "",
        opacity: ""
      },
      value: "", //用户状态
      options: [{ value: "0", label: "正常" }, { value: "1", label: "停用" }],
      newIndex: null, //导航栏选中下标
      menuText: "",
      menuList: [
        "所有平台",
        "779彩票",
        "955娱乐",
        "933彩票",
        "125娱乐",
        "066娱乐",
        "招财棋牌"
      ],
      showList: false,
      timeout: null, //定时器
      keyWord: "", //搜索框的值
      searchList: [], //搜索列表
      limitShow: null,
      loginName: null, //登录名称
      totle: 0,
      timeoutNews: null,
      showLogout: false
    };
  },
  methods: {
    //导航栏点击跳转
    handleClick(index) {
      this.newIndex = index;
      this.showLogout = false;
      if (parseInt(this.$store.state.limit) == 0) {
        switch (index) {
          case 0:
            bus.$emit("sendNews", true); //消息弹出框
            break;
          case 1:
            this.$router.push({ name: "release" }); //发表页面
            break;
          case 2:
            this.$router.push({ name: "collect" }); //收藏页面
            break;
          case 3:
            this.showLogout = true;
            this.$router.push({ name: "myInfo" }); //我的页面
            break;
          default:
            break;
        }
      } else {
        switch (index) {
          case 0:
            this.$router.replace({ path: "/setting/account" }); //管理页面
            break;
          case 1:
            bus.$emit("sendNews", true); //消息弹出框
            break;
          case 2:
            this.$router.push({ name: "check" }); //审核页面
            break;
          case 3:
            this.$router.push({ name: "release" }); //发表页面
            break;
          case 4:
            this.$router.push({ name: "collect" }); //收藏页面
            break;
          case 5:
            this.showLogout = true;
            this.$router.push({ name: "myInfo" }); //我的页面
            break;
          default:
            break;
        }
      }
    },

    //下拉菜单移入
    downMenuMouseenter() {
      this.showMenu = true;
    },

    //下拉菜单移出
    downMenuMouseleave() {
      this.showMenu = false;
    },

    //输入框获取焦点
    focueFn() {
      if (this.searchList.length > 0) this.showList = true;
    },

    //收藏星星移动           right: 260px;  top: 40px;
    starMove(arg) {
      if (arg != undefined) {
        var r = 650,
          t = 320,
          s = 0;
        clearInterval(this.time); //清除定时器

        this.showStar = true;
        this.time = setInterval(() => {
          s++;
          r -= 50;
          t -= 30;
          if (s >= 10) {
            r = 650;
            t = 320;
            s = 0;

            this.style.top = t + "px";
            this.style.right = r + "px";
            this.showStar = false; //隐藏星星
            clearInterval(this.time); //清除定时器
            //收藏文章
            this.collectFn(arg);
          } else {
            this.style.top = t + "px";
            this.style.right = r + "px";
          }
        }, 100);
      }
    },

    //收藏文章
    collectFn(arg) {
      if (arg) {
        let collectObj = {
          uid: this.$store.state.uid,
          nid: arg.nid
        };
        this.$api
          .collectArticleFn(collectObj)
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                showClose: true,
                message: "收藏成功！"
              });

              //收藏成功刷新页面
              bus.$emit("refresh", arg);
            }
          })
          .catch(err => {
            console.log(err);
            this.$message({
              type: "error",
              showClose: true,
              message: "网络超时！"
            });
          });
      }
    },

    //退出登录
    logoutFn() {
      var logoutData = {
        uid: this.$store.state.uid
      };

      this.$api
        .logoutFn(logoutData)
        .then(res => {
          if (res.data.code == 0) {
            let info = {
              token: "",
              user: "",
              uid: ""
            };
            //提交 token 给store
            this.$store.commit("getToken", info);

            this.$message({
              type: "success",
              showClose: true,
              duration: 1000,
              message: res.data.msg
            });
            this.timeout = setTimeout(() => {
              this.$router.replace({ name: "login" });
            }, 1000);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "error",
            showClose: true,
            message: "网络超时！"
          });
        });
    },

    downMenuClick(index) {
      this.menuText = this.menuList[index];
      this.showMenu = false;

      if (this.keyWord != "") this.keySearchFn(this.keyWord);
    },

    //搜索框搜查
    keySearchFn(arg, arg1) {
      let params = {
        searchValue: arg,
        platform: this.menuText == "所有平台" ? "" : this.menuText,
        pageIndex: 1,
        pageSize: 100
      };
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.$api
          .searchFn(params)
          .then(res => {
            if (res.data.code == 0) {
              this.searchList = res.data.data.esFaqArticleList;
              if (res.data.data.esFaqArticleList.length > 0)
                this.showList = true;
              else this.showList = false;
            }
          })
          .catch(err => {
            console.log(err);
            this.$message({
              type: "error",
              showClose: true,
              message: "网络超时！"
            });
          });
      }, 100);
    },

    //获取文章类容
    getArticleFn(arg) {
      this.keyWord = "";
      this.showList = false;
      arg.backType = "search";
      arg.click = "click";

      if (this.$route.name != "index")
        this.$router.push({
          name: "index",
          params: arg
        });
      //发送给index组件
      else bus.$emit("searchContent", arg);
    },

    //点击搜索
    clickSearchFn() {
      if (this.keyWord == "") {
        this.$message({
          type: "warning",
          message: "输入搜索词"
        });
        return;
      }
      bus.$emit("changType");
      this.$store.commit("getScrollTopFn", 0);
      if (this.searchList.length > 0) {
        this.showList = false;
        if (this.$route.name != "categoryList")
          this.$router.push({
            name: "categoryList",
            params: {
              list: this.searchList,
              backType: "top"
            }
          });
        else bus.$emit("keyWordSearch", this.searchList);
      } else {
        this.$message({
          type: "warning",
          message: "没有搜索到数据"
        });
        bus.$emit("keyWordSearch", []);
      }

      // this.keySearchFn(this.keyWord, true)
    },

    // 点击空白处使topBar隐藏
    clickOutSide() {
      this.showList = false;
    },

    //管理账号搜索
    selectClickFn() {
      var obj = {
        status: this.value,
        loginName: this.loginName
      };
      this.$emit("accountSearch", obj);
    },

    //清除搜索内容
    resetFn() {
      this.value = "";
      this.loginName = "";
    },

    //获取消息总条数
    getNewsTotleFn() {
      var params = {
        uid: this.$store.state.uid
      };
      this.$api
        .newsTotle(params)
        .then(res => {
          if (res.data.code == 0) this.totle = res.data.data.messageTotal;
          else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //刷新消息
    loadingFn() {
      //获取消息总条数
      this.getNewsTotleFn();

      this.limit = parseInt(this.$store.state.limit);
      if (this.limit == 0) {
        this.limitShow = false;
        this.nav = [
          { name: "消息", show: true },
          { name: "发表" },
          { name: "收藏" },
          { name: "我的" }
        ];
      } else {
        this.limitShow = true;
        this.nav = [
          { name: "管理" },
          { name: "消息", show: true },
          { name: "审核" },
          { name: "发表" },
          { name: "收藏" },
          { name: "我的" }
        ];
      }
    }
  },
  created() {
    this.loadingFn();
    //点击消息
    var that = this;

    bus.$on("close", function(arg) {
      that.newIndex = 10;
    });

    bus.$on("refresh", function() {
      //获取消息总条数
      that.loadingFn();
    });

    bus.$on("checkRefresh", function() {
      //获取消息总条数
      that.loadingFn();
    });
    bus.$on("sengCollect", function(arg) {
      that.starMove(arg);
    });
    this.newIndex = this.$route.meta.name;
  },
  updated() {
    this.newIndex = this.$route.meta.name;
  },
  destroyed() {
    clearInterval(this.time); //清除定时器
    clearTimeout(this.timeout);
    clearTimeout(this.timeoutNews);
  },

  directives: {
    outSide: {
      bind: function(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          // here I check that click was outside the el and his childrens
          if (!(el == event.target || el.contains(event.target))) {
            // and if it did, call method provided in attribute value
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind: function(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      }
    }
  },
  watch: {
    keyWord(arg) {
      if (arg != "") this.keySearchFn(arg);
      else {
        this.searchList = [];
        this.showList = false;
      }
    },
    $route: {
      handler: function(val, oldVal) {
        this.newIndex = val.meta.name;
      }
    }
  },
  computed: {
    wStyle(val) {
      var style;
      return (style = {
        width: this.$store.state.style.width - 520 + "px"
      });
    }
  }
};
</script>