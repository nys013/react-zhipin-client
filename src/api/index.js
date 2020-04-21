// 引入封装好的ajax函数
import ajax from './ajax'

// 用户登录(这种写法，默认传参传对象)
export const reqLogin = (data) => ajax("/login",data,"POST")
// 用户注册
export const reqSign = (data) => ajax("/sign",data,"POST")
// 用户信息更新
export const reqUpdate = (data) => ajax("/update",data,"POST")
// 根据cookie获取当前user(因为后台可以获取到cookie，所以不需要传参)
export const reqUser = () => ajax('/user')
// 获取用户列表(这种写法，默认传参传值)
export const reqUserList = (type) => ajax('/userlist',{type})
// 获取当前用户相关的消息列表
export const reqChatMsgList = () => ajax('/msglist')
// 更新用户阅读状态
export const reqUpdateReadCount = (from) => ajax('/readmsg',{from},'POST')