import React, { Component } from 'react'
// 引入处理连接多个state和action的高阶函数
import {connect} from 'react-redux'
// 引入UI组件
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Button} from 'antd-mobile'
// 引入路由重定向标签
import {Redirect} from 'react-router-dom'

// 引入封装好的Logo图标组件
import Logo from '../../components/logo/logo'
// 引入action
import {login} from '../../redux/actions'

class Login extends Component {
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
        this.props.login(this.state)
    }
    render() {
        const {user} = this.props
        if (user.redirectTo) {
            /* 不能直接这样写，虽然可以跳转，但是会报错，大概是说不能在存在的状态改变时更新，比如在render中不能修改props和state？反正是要干净——垃圾英文，不要介意
            Cannot update during an existing state transition (such as within `render`). 
            Render methods should be a pure function of props and state. 
            */
            // this.props.history.replace(user.redirectTo)
            /* 所以就要用路由重定向标签 */
            return <Redirect to={user.redirectTo}/>
        }
        return (
            <div>
                {user.msg && (<div className="errorMsg">{user.msg}</div>)}
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
export default connect(
    state => ({user:state.user}),
    {login}
)(Login)
