import Axios from 'axios'
import Qs from 'qs'
import store from '../store';
import router from '../router/index'
import { message } from 'element-ui'


let port = Axios.create({

    //baseURL: 'http://192.168.103.79:8088/',       //后台

    baseURL: 'http://192.168.103.179:8088/',       //测试服务器

    //baseURL: 'http://faq.3000mk.com',             //线上服务器

    timeout: 10000,

    //headers: { "Accept": "application/json" },

    //withCredentials: true
})

port.interceptors.request.use(function(config){
    let token = store.state.token
    if(token)
        config.url =  config.url + '&token=' + token
    return config
})
  //定义一个响应拦截器
port.interceptors.response.use(function(config){
    if(config.data.code != 0){
        message({
            showClose: true,
            type: 'warning',
            message: config.data.msg
        })
    }
    if(config.data.code == 301){
        router.push({path:'/login'})
        return
    }
    return config
})

/* 
***************
    用户模块
***************
*/
//登录接口
export const loginFn = params => { return port.post('api/user/login?' + Qs.stringify(params))}

//退出登录
export const logoutFn = params => { return port.post('api/user/loginOut?' + Qs.stringify(params))}

//修改密码
export const updatePwdFn = params => { return port.post('api/user/updatePassword?' + Qs.stringify(params))}

/* 
***************
    内容模块
***************
*/
//获取别类
export const categoryFn = params => { return port.post('api/type/info?' + Qs.stringify(params))}

//获取子类别
export const categoryChildFn = params => { return port.post('api/type/linkage?' + Qs.stringify(params))}

//获取最近发布、热门点击
export const articleTitleFn = params => { return port.post('api/es/article/sort?' + Qs.stringify(params))}

//获取文章内容
export const articleContentFn = params => { return port.post('api/es/article/info?' + Qs.stringify(params))}

//发表文章
export const addArticleFn = data => { return port.post('api/es/article/add?' + Qs.stringify(data) )}

//获取用户已发表的文章
export const releasedArticleFn = params => { return port.post('api/es/article/author?' + Qs.stringify(params) )}

//点赞文章
export const giveLoveFn = params => { return port.post('api/hit/giveLike?' + Qs.stringify(params) )}

//获得所有子类型
export const allChildCategoryFn = params => { return port.post('api/type/childType?' + Qs.stringify(params) )}

//修改文章
export const updateArticleFn = params => { return port.post('api/es/article/update?' + Qs.stringify(params) )}

//删除文章
export const deleteArticleFn = params => { return port.post('api/es/article/delete?' + Qs.stringify(params) )}

/* 
***************
    审核模块
***************
*/
//获取审核列表数据
export const getArticleFn = params => { return port.post('api/audit/list?' + Qs.stringify(params) )}

//获取审核不通的文章信息
export const readNoCheckArticleFn = params => { return port.post('api/audit/articleInfo?' + Qs.stringify(params) )}

//文章审核
export const checkArticleFn = params => { return port.post('api/audit/dispose?' + Qs.stringify(params) )}


//搜索框
export const searchFn = params => { return port.post('api/elasticsearch/article?' + Qs.stringify(params) )}

//分类搜索
export const categorySearchFn = params => { return port.post('api/elasticsearch/classified?' + Qs.stringify(params) )}

//获取单篇文章信息
export const readArticleFn = params => { return port.post('api/es/article/audit?' + Qs.stringify(params) )}

/* 
***************
    收藏模块
***************
*/
//收藏文章
export const collectArticleFn = params => { return port.post('api/collect/article?' + Qs.stringify(params))}

//收藏文章列表
export const collectLiatFn = params => { return port.post('api/collect/list?' + Qs.stringify(params) )}

//取消收藏文章
export const canaleCollectFn = params => { return port.post('api/collect/cancel?' + Qs.stringify(params) )}

/* 
***************
    消息模块
***************
*/
//获取消息列表
export const newsListFn = params => { return port.post('api/message/acquire?' + Qs.stringify(params)) }

//改变消息状态
export const newsStaatusFn = params => { return port.post('api/message/status?' + Qs.stringify(params)) }

//获取消息总条数
export  const newsTotle = params => { return port.post('api/message/unreadTotal?' + Qs.stringify(params)) }

/* 
***************
    管理模块
***************
*/
//获取账号列表数据
export const manageAccountFn = params => { return port.post('api/manage/userList?' + Qs.stringify(params)) }

//修改子分类
export const updateChildrenCategory = params => { return port.post('api/manage/updateSubtype?' + Qs.stringify(params)) }

//修改账号状态
export const updateAccountStatus = params => { return port.post('api/manage/blockedAccount?' + Qs.stringify(params)) }

//获取所有可用的部门信息
export const departmentInfoFn = params => { return port.post('api/manage/deptInfo?' + Qs.stringify(params)) }

//新增用户信息
export const addAccountFn = params => { return port.post('api/manage/insertUser?' + Qs.stringify(params)) }

//修改用户信息
export const updateAccountFn = params => { return port.post('api/manage/user?' + Qs.stringify(params)) }

//新增标题分类
export const addCategoryFn = params => { return port.post('api/type/add?' + Qs.stringify(params)) }