// 发送同步或异步请求的action分发函数

import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER,RECEIVE_USERLIST,RECEIVE_CHAT_MSG,RECEIVE_CHAT_MSG_LIST,UPDATE_UN_READ_COUNT} from './action-types'
import {reqLogin,reqSign,reqUpdate, reqUser, reqUserList ,reqChatMsgList,reqUpdateReadCount} from '../api'
import { Toast } from 'antd-mobile'
// 引入收发消息所用的socket
import io from 'socket.io-client'

// 注册or登录成功
const authSuccess = (user) => ({type:AUTH_SUCCESS,user})
// 注册or登录失败显示的错误信息
const errorMsg = (msg) => ({type:ERROR_MSG,msg})
// 更新用户成功，接受user
const receiveUser = (user) => ({type:RECEIVE_USER,user})
// 更新用户失败，因为没有登录，所以清除user
export const resetUser = (msg) => ({type:RESET_USER,msg})
// 用户列表存储
const receiveUserList = (userlist) => ({type:RECEIVE_USERLIST,userlist})
// 收到服务器的消息
const receiveChatMsg = (chatMsg,userid) => ({type:RECEIVE_CHAT_MSG,data:{chatMsg,userid}})
// 接受用户相关的聊天信息
const receiveChatMsgList = (chat,userid) => ({type:RECEIVE_CHAT_MSG_LIST,data:{chat,userid}})
// 更新用户阅读数量
const updateUnReadCount = (from,to,count) => ({type:UPDATE_UN_READ_COUNT,data:{from,to,count}})

// 登录的异步请求
export const login = (data) => {
    // 前台表单验证
    const {username,password} = data
    // 不符合条件， 进行分发失败的同步action
    if (!username) {
        // 因为设计了errorMsg在store中管理，那么就统一处理了，就不用这个Toast了，若要用，就不必要设计这个errorMsg
        // Toast.fail('用户名不能为空')
        return errorMsg('用户名不能为空',1)
    } else if(!password) {
        // Toast.fail('密码不能为空',1)
        return errorMsg('密码不能为空')
    }else {
        // 前台验证通过，则发送异步请求
        return async dispatch =>{
            const result = await reqLogin(data)
            // 返回结果处理，根据api文档，code为0成功；code为1失败
            if (result.code === 0) {
                // 进行分发成功的同步action
                dispatch(authSuccess(result.data))
                // 获取聊天信息，并启动io
                
                getMsgList(result.data._id,dispatch)
            } else {
                // 进行分发失败的同步action
                dispatch(errorMsg(result.msg))
            }
        }
    }
}

// 注册的异步请求
export const sign = (data) => {
    return async dispatch => {
        const result = await reqSign(data)
        if (result.code === 0) {
            Toast.success('注册成功',1)
            dispatch(authSuccess(result.data))
            // 获取聊天信息，并启动io
            getMsgList(result.data._id,dispatch)
        } else {
            Toast.fail(result.msg,1)
            // dispatch(ERROR_MSG(result.msg))
        }
    }
}

// 更新用户信息的异步请求
export const updateUser = (data) => {
    // 简单的表单验证,因为根据api文档，只有头像是必须的，所以仅进行头像的验证
    if (!data.header) {
         Toast.fail('请选择头像')
         return errorMsg('请选择头像')
    } else {
        return async dispatch => {
            const result = await reqUpdate(data)
            if (result.code === 0 ) {
                // 调用接受user的同步action（让reducer将user更新）
                dispatch(receiveUser(result.data))
            } else {
                // 失败，说明没有登录，那么清除redux中的user，
                    // 原本想的是在main主界面会判断有无user._id，无则会重定向到登录界面，可是因为要实现自动登录所以不合适
                    // 所以就不是很懂，清除了的意义在哪
                    // X错的 ————(意义在于，因为在最开始没有user._id没有cookie,就要去对应界面，这样设计只能到main:reducer中initUser设置的重定向默认为'/'，然后重置就会跳转main，接着main判断cookie中有无userid，而这一步失败正是后台判断无userid返回的，所以接上了
                    // 对的————意义在于是当调用resetUser后，redux发生改变，那么props发生改变时main的render就会触发，就会判断cookie，从而跳转页面
                dispatch(resetUser(result.msg))
                // 不能用errorMsg的主要原因在于,它没有清除原有的redirectTo，那么一边要求跳转login，一边就是跳转对应的info，就会冲突然后报错
                // dispatch(errorMsg(result.msg))
            }
        }
    }
}

// 获取当前user的异步请求
export const getUser = () => {
    return async dispatch => {
        const result = await reqUser()
        if (result.code === 0 ) {
          dispatch(receiveUser(result.data))  
          // 获取聊天信息，并启动io
        //   debugger
          getMsgList(result.data._id,dispatch)
        } else {
          dispatch(resetUser(result.msg))  
        }
    }
}

// 获取用户列表
export const getUserList = (type) => {
    return async dispatch => {
        const result = await reqUserList(type)
        dispatch(receiveUserList(result.data))
    }
}

// 初始化io的函数
function initIo (userid , dispatch){
    // 创建单例对象，让io仅初始化一次
    if (!io.socket) {
        // 调用io连接服务器，返回的socket赋值给io.socket为单例对象作判断
        io.socket = io('ws://localhost:4000')
        // 启动监听
        io.socket.on('serverToClient',function (chatMsg) {
            // 当该chatMsg与当前用户相关时发送同步请求更新reducer，让页面显示
            const {from,to} = chatMsg
            if (from === userid || to === userid) {
                dispatch(receiveChatMsg(chatMsg,userid))
            }
        })
    }
}
// 获取消息列表(在登录、注册、自动登录成功时获取)  
/* 
与之前的异步请求不同，这里不在组件的某个事件回调或者生命周期中调用，所以不需要向外暴露
    ——因为并不是到了login、sign界面，就获取，而是在登录、注册、自动登录成功时获取
    ——如果非要暴露在组件中写也可以的，在到了boss、dashen、personnal...界面，这就麻烦许多了，而且目前的组件算是少的了，要是后续开发了很多功能，那就不方便了，所以在这里处理最好
 */
async function getMsgList (userid,dispatch) {
    // 因为io的初始化时机也在 登录、注册、自动登录成功，所以就顺便写在这个函数里了
    initIo(userid,dispatch)
    // 异步向后台发送获取所有相关聊天列表的请求
    // return async dispatch => {
        const result = await reqChatMsgList()
        if (result.code === 0) {
            dispatch(receiveChatMsgList(result.data,userid))
        }
    // }
}
// 发送消息
export const sendMsg = ({from,to,content}) => {
    return dispatch => {
        // 向服务器发送消息
        io.socket.emit('clientToServer',{from,to,content})
        /* 不能在这里处理，因为不单单是发送消息之后需要接受消息，而是在一开始登录的时候就需要接受消息，所以和getMsgList同一时机 */
        // 接受服务器消息进行处理
        /* io.socket.on('serverToClient',function(chatMsg){
            dispatch(receiveChatMsg(chatMsg))
        }) */
    }
}

// 更新用户阅读数量
export const updateCount = (from,to) => {
    return async dispatch => {
        const result = await reqUpdateReadCount(from)
        if (result.data) {
           dispatch(updateUnReadCount(from,to,result.data)) 
        }
    }
}