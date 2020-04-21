/* 
    包含多个用于生成新的state的reducer函数模块
*/

// 引入合并多个reducer导出的方法
import {combineReducers} from 'redux'

// 引入action的常量
import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER,RECEIVE_USERLIST,RECEIVE_CHAT_MSG,RECEIVE_CHAT_MSG_LIST,UPDATE_UN_READ_COUNT} from './action-types'
// 引入获取重定向路径的工具函数
import {getRedirectPath} from '../utils'


// 工厂函数方式创建各个reducer
// 当前用户的数据
const initUser = {username:'',password:'',redirectTo:'',type:''}
function user (state=initUser ,action){
    // 注意在action中的写法是{user}这种传过来的，那么必然是action.user，如果传的时候是{data:user},那就不能这样赋值来写了，而是只能用action.data
    const {user,msg} = action
    switch (action.type) {
        case AUTH_SUCCESS:
            // 使用工具函数，传参类型和头像（这里头像不一定有，而找不到会返回undefined）
            const redirectTo = getRedirectPath(user.type,user.header)
            // 因为这里user不需要msg，所以就不是{...user,...state},其实加上也不要紧，因为登录成功后会跳转页面，msg也会消失
            return {...user,redirectTo}
        case ERROR_MSG:
            return {...state,msg}
        case RECEIVE_USER:
            return user
        case RESET_USER:
            return {...initUser,msg}
        default:
            return state
    }
}

// 所有用户的数据
const initUserList = []
function userlist (state=initUserList ,action){
    switch (action.type) {
        case RECEIVE_USERLIST:
            return action.userlist
        default:
            return state
    }
    
}

// 当前用户相关的聊天数据
const initChat = {
    users:{},
    chatMsgs:[],
    unReadCount:0
}
function chat (state=initChat , action){
    switch (action.type) {
        case RECEIVE_CHAT_MSG:
            const {chatMsg,userid} = action.data
            return {
                users:state.users,
                chatMsgs:[...state.chatMsgs,chatMsg],
                unReadCount:state.unReadCount + (chatMsg.to === userid && !chatMsg.read ? 1 : 0)
            }
        case RECEIVE_CHAT_MSG_LIST:
            const {users,chatMsgs} = action.data.chat
            return {
                users,
                chatMsgs,
                unReadCount:chatMsgs.reduce((preTotal,msg) => {
                    return preTotal + (msg.to === action.data.userid && !msg.read ? 1 : 0)
                },0)
            }
        case UPDATE_UN_READ_COUNT:
            const {from,to,count} = action.data
            return {
                users:state.users,
                chatMsgs:state.chatMsgs.map(msg => {
                    if (msg.from === from && msg.to === to && !msg.read) {
                        return {...msg,read:true}
                    } else {
                        return msg
                    }
                }),
                unReadCount:state.unReadCount - count
            }
        default:
            return state
    }
}

// 将各个reducer合并，返回合并后的reducer函数
export default combineReducers({
    user,
    userlist,
    chat
})