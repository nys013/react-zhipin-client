import React,{Component} from 'react'
// 引入cookie管理,原生的也能做，只不过用库还是方便些的
import Cookies from 'js-cookie'
// 引入connect将组件与redux相连
import {connect} from 'react-redux'
// 引入路由相关标签
import {Switch,Route,Redirect} from 'react-router-dom'
// UI组件
import {NavBar} from 'antd-mobile'

// 引入路由组件
import BossInfo from '../boss-info/boss-info'
import DashenInfo from '../dashen-info/dashen-info'
import Boss from "../boss/boss.jsx"
import Dashen from "../dashen/dashen.jsx"
import Message from "../message/message.jsx"
import Personal from "../personal/personal.jsx"
import Chat from "../chat/chat.jsx"
// 不用redux的组件
import NotFound from "../../components/not-found/not-found.jsx"
import NavFooter from '../../components/nav-footer/nav-footer'
// 引入获取path的工具函数
import {getRedirectPath} from '../../utils'
// 引入获取User的actions
import {getUser} from '../../redux/actions'

class Main extends Component {

    // 组件实例对象上添加，若是类对象则在前面加上static
    // 因为以下四个组件拥有同样的头部和底部，所以将变化的数据封装成数组，以遍历可减少代码
    navList = [
        {
          component:Boss,
          path:"/boss",
          title:"大神列表",
          icon:"dashen",
          text:"大神"
        },
        {
          path: '/dashen',
          component: Dashen,
          title: 'Boss列表',
          icon: 'boss',
          text: 'Boss' 
        },
        {
          path: '/message',
          component: Message,
          title: '消息列表',
          icon: 'message',
          text: '消息'
        },
        { path: '/personal',
          component: Personal,
          title: '用户中心',
          icon: 'personal',
          text: '个人'
        }
      ]

    // 一般再次发送异步请求
    componentDidMount(){
        // 1.2.2
        const userid = Cookies.get('userid')
        const {_id} = this.props.user
        if (userid && !_id) {
            // 1.2.2.2
            this.props.getUser()
        }
    }

    render(){
        // 判断是否有user（cookie中，不能是redux中，因为想要实现自动登录——关闭浏览器再打开仍有）
        const userid = Cookies.get('userid')
        if(!userid){
            // 1.1
            return (<Redirect to='/login' />)
            /* // 试一下这种写法，login中明明不行的，找出原因
            this.props.history.replace('/login')
            // 难道是这句话是关键？不是的，这样写还是会报错的——render() 函数应该为纯函数，这意味着在不修改组件 state 的情况下，每次调用时都返回相同的结果，并且它不会直接与浏览器交互。
            return null */
        }else{
            // 1.2
            const {user} = this.props
            if (user._id) {
                // 1.2.1
                let path = this.props.location.pathname
                if (path === '/') {
                    // 1.2.1.1
                    path = getRedirectPath(user.type,user.header)
                    return (<Redirect to={path} />)
                }
            } else {
                // 1.2.2.1
                return null
            }
        }
        // 取出navList中的path与当前pathname对比，若是相等则去到对应的路由，且显示相应的头部和底部
        const {pathname} = this.props.location
        const currentItem = this.navList.find(item => item.path === pathname)
        // 处理navList，判断当前登录用户类型，动态添加hide属性以便后续过滤
        if (this.props.user.type === 'boss') {
            this.navList[1].hide = true
        } else {
            this.navList[0].hide = true
        }
        // 1.2.1.2
        return (
            <div>
                {/* 当前path与navList中匹配，那么就显示对应的头部 */}
                {currentItem && (<NavBar className='top-fixed-bar' >{currentItem.text} </NavBar>)}
                <Switch>
                    {/* 循环遍历产生对应的路由 */}
                    {
                        this.navList.map((item,index) => {
                            return (<Route path={item.path} component={item.component} key={index} />)
                        })
                    }
                    <Route path='/bossinfo' component={BossInfo} />
                    <Route path='/dasheninfo' component={DashenInfo} />
                    {/* 指定params参数名为userid，:为占位符，指可指定任意数据类型的userid，有种变量的感觉（限制类型要加一些东西，感兴趣自查） */}
                    <Route path='/chat/:userid' component={Chat} />
                    {/* 放在最后一个，没有任何匹配的路径则not-found */}
                    <Route  component={NotFound} />
                </Switch>
                {/* 当前path与navList中匹配，那么就显示对应的底部 */}
                {currentItem && (<NavFooter navList={this.navList} unReadCount={this.props.chat.unReadCount} />)}
            </div>
        )
    }
}

export default connect(
    state => ({user:state.user,chat:state.chat}),
    {getUser}
)(Main)


/* 实现自动登录
1.cookie中有无userid
    1.1无，跳转登录页面登录
    1.2有，判断redux有无user._id
        1.2.1有，
            1.2.1.1 首先，若是请求主页面'/'，那么根据user的type和header的工具函数到对应的界面
            1.2.1.2 其次，不是请求'/'，那么肯定是要到请求的相应界面，即不做处理，自然会向下执行时，在Switch中找到对应的路由跳转
        1.2.2无，
            1.2.2.1 在render中，返回null
            1.2.2.2 发送请求（在componentDidmount中），根据cookie获取当前user存到redux管理（redux有user._id后走1.2.1流程）

*/
