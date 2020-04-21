import React, {Component} from 'react'
import {connect} from "react-redux"
import {Result,List,Button,WhiteSpace,Modal} from 'antd-mobile'
import Cookies from 'js-cookie'

import {resetUser} from '../../redux/actions'

class Personal extends Component {

  // 退出登录(这里就不需要进行后台交互了，因为前台是可以remove cookie的，而且不需要后台数据操作)
  logout = () => {
    // 使用Modal对话框让用户操作是否退出
    Modal.alert('退出','确认退出登录？',[
      {text:'取消'},
      {text:'确认',onPress:() => {
        // 清除cookie
        Cookies.remove('userid')
        // 清除redux
        this.props.resetUser('')
      }}
    ])
  }

  render (){
    const {username,header,company,post,info,salary} = this.props.user
    return(
      <div style={{marginTop:50,marginBottom:50}}>
        <Result
          // 这里应该做一个默认头像的
          // 根据文档img的值应该是个<img/>,而不是下面这种引入什么的，看看文档就懂了
          // img={{src:`../../assets/headers/${header || '头像20'}.png`}}
          // 注意使用commonJS语法，因为最后是要webpack打包的，不过实际开发，图片都不会在这里上传的，而是后台会有接口的
          img = {(<img src={require(`../../assets/headers/${header || '头像20'}.png`)} alt={header} />)}
          title={username}
          message={company || ''}
        />
        <List renderHeader="相关信息" >
          <List.Item multipleLine>
            <List.Item.Brief>职位：{post}</List.Item.Brief>
            <List.Item.Brief>简介：{info}</List.Item.Brief>
            {salary ? <List.Item.Brief>薪资：{salary}</List.Item.Brief> : null}
          </List.Item>
        </List>
        <WhiteSpace/>
        <Button type="warning" onClick={this.logout} >退出登录</Button>
      </div>
    )
  }
}
export default connect(
  state => ({user:state.user}),
  {resetUser}
)(Personal)