import React, { Component } from 'react'
// 引入UI组件
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Button} from 'antd-mobile'

// 引入封装好的Logo图标组件
import Logo from '../../components/logo/logo'
export default class Login extends Component {
    state = {
        username:"",
        password:""
    }
    handleChange(key,value){
        this.setState({
            [key]:value
        })
    }
    login = ()=>{
        console.log(this.state)
    }
    render() {
        return (
            <div>
                <NavBar>硅谷直聘</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        <WhiteSpace />
                        <InputItem placeholder='请输入用户名'  onChange={val => this.handleChange("username",val)}>用户名</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder='请输入密码' type="password" onChange={val => this.handleChange("password",val)}>密&nbsp;&nbsp;&nbsp;码</InputItem>
                        <WhiteSpace />
                        <Button type='primary' onClick={this.login}>登录</Button>
                        <Button onClick={()=>this.props.history.replace('/sign')}>未有账号，去注册</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

