// 组件分为两种，一个是components，一个是containers（容器组件，是用到redux的）
// 大神信息补充界面(和bossInfo差不多，只是表单项有些出入，要填写的信息略有不同，但是操作类似，详细注释看boss的就好)

import React, {Component} from 'react'
import {connect} from "react-redux"
import {NavBar,InputItem,TextareaItem,Button} from "antd-mobile"
import {Redirect} from "react-router-dom"

import HeaderSelector from '../../components/header-selector/header_selector.jsx'
import {updateUser} from '../../redux/actions.js'

class DashenInfo extends Component {
  state = {
    header:"",
    post:"",
    info:""
  }
  setHeader = (header)=>{
    this.setState({header})
  }
  handleChange = (name,val)=>{
    this.setState({
      [name]:val
    })
  }
  save = ()=>{
    this.props.updateUser(this.state)
  }
  render (){
    const {type,header} =this.props.user
    if(header){
      let path = type==="dashen"?"/dashen":"/boss"
      return <Redirect to={path}/>
    }

    return(
      <div>
        <NavBar>大神完善信息</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <InputItem placeholder='请输入招聘职位' onChange={val => this.handleChange("post",val)}>求职岗位</InputItem>
        <TextareaItem title='个人介绍' rows={3} onChange={val => this.handleChange("info",val)} />
        <Button type='primary' onClick={this.save} >保存&nbsp;&nbsp;&nbsp;</Button>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {updateUser}
)(DashenInfo)
