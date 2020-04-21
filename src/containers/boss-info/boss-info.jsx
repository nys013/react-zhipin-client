// 组件分为两种，一个是components，一个是containers（容器组件，是用到redux的）
// Boss信息补充界面

import React, {Component} from 'react'
import {connect} from "react-redux"
import {NavBar,InputItem,TextareaItem,Button} from "antd-mobile"
import {Redirect} from "react-router-dom"

// 头像选择组件
import HeaderSelector from '../../components/header-selector/header_selector.jsx'
// 引入action
import {updateUser} from '../../redux/actions.js'

class BossInfo extends Component {
  // 表单输入内容用state管理
  state = {
    header:"",
    post:"",
    company:"",
    salary:"",
    info:""
  }
  // 子组件调用时，设置头像状态
  setHeader = (header)=>{
    this.setState({header})
  }
  // 表单进行修改时触发，更新相应的状态
  handleChange = (name,val)=>{
    this.setState({
      // 记住要用[]，因为属性名不是name，而是name变量的值
      [name]:val
    })
  }
  // 点击保存，调用action发送请求
  save = ()=>{
    this.props.updateUser(this.state)
  }
  render (){
    // 获取redux管理的user
    const {type,header} =this.props.user
    // 若头像存在，就重定向到对于type的路由
    console.log(type,header)
    if(header){
      let path = type==="dashen" ? "/dashen" : "/boss"
      console.log(path)
      return <Redirect to={path}/>
    }
    return(
      <div>
        <NavBar>boss完善信息</NavBar>
        {/* 将函数传给子组件调用，以获取子组件的数据 */}
        <HeaderSelector setHeader={this.setHeader} />
        <InputItem placeholder='请输入招聘职位' onChange={val => this.handleChange("post",val)} >招聘职位</InputItem>
        <InputItem placeholder='请输入公司名称' onChange={val => this.handleChange("company",val)}>公司名称</InputItem>
        <InputItem placeholder='请输入职位薪资' onChange={val => this.handleChange("salary",val)}>职位薪资</InputItem>
        <TextareaItem title='职位要求' rows={3}  onChange={val => this.handleChange("info",val)} />
        <Button type='primary' onClick={this.save} >保存&nbsp;&nbsp;&nbsp;</Button>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {updateUser}
)(BossInfo)
