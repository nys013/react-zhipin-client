/* 
    redux最核心的store对象模块
*/

// 引入redux的创建store，及使用中间件的方法
import {createStore , applyMiddleware} from 'redux'
// 异步中间件，发送异步代码
import thunk from 'redux-thunk'
// 开发者工具
import {composeWithDevTools} from 'redux-devtools-extension'
// 引入reducers
import reducers from './reducers'

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))