import React, {Component} from 'react'
import {connect} from "react-redux"

// 引入获取userlist的异步action
import {getUserList} from '../../redux/actions'
// 引入列表组件
import UserList from '../../components/user-list/user-list'

class Dashen extends Component {
  // 发送异步请求常在该生命周期回调中
  componentDidMount(){
    this.props.getUserList('boss')
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
)(Dashen)