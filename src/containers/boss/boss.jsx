import React, {Component} from 'react'
import {connect} from "react-redux"

// 引入获取userlist的异步actions
import {getUserList} from '../../redux/actions'
// 引入列表组件
import UserList from '../../components/user-list/user-list'

// 其实boss和dashen也可以在同一个组件中，只不过需要获取当前cookie的user的type，然后在底部的显示也有不同。而在这里设计的dahsen和boss的地址不一样，用不同路由组件最好了
class Boss extends Component {
  // 发送异步请求常在该生命周期回调中
  componentDidMount(){
    this.props.getUserList('dashen')
  }
  render (){
    return(
      <UserList userlist={this.props.userlist} />
    )
  }
}
export default connect(
  state => ({userlist:state.userlist}),
  {getUserList}
)(Boss)