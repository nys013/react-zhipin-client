/* 
    包含多个用于生成新的state的reducer函数模块
*/

// 引入合并多个reducer导出的方法
import {combineReducers} from 'redux'

// 工厂函数方式创建各个reducer
function xxx (state=0 ,action){
    return state
}
function yyy (state=0 ,action){
    return state
}


// 将各个reducer合并，返回合并后的reducer函数
export default combineReducers({
    xxx,
    yyy
})