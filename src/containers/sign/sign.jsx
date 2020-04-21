import React,{Component} from 'react'
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Button,Radio,Toast} from 'antd-mobile'
// connect连接组件和store（action和reducer）
import {connect} from 'react-redux'
// 引入路由重定向标签
import {Redirect} from 'react-router-dom'

// LOGO
import Logo from '../../components/logo/logo'
// 引入sign注册异步action
import {sign} from '../../redux/actions'

const ListItem = List.Item
class Sign extends Component {
    // state状态
    state = {
        username:"",
        password:"",
        password2:"",
        type:"dashen"
    }
    // 这里可不用箭头函数，因为在回调调用那部分用了箭头函数，已将外层函数this捕获
    handleChange(key,value){
        this.setState({
            [key]:value
        })
    }
    // 这里要用箭头函数，因为这里this指向的应该是点击对象（但好像是因为封装的关系，实际上是undefined）
    // 所以其实为了方便，可都用箭头函数的写法
    sign = () => {
        const {username,password,password2,type} = this.state
        // 表单验证（与login不同，在这里做表单验证（两种方式应当统一选择其中一种，这是仅为显示不同效果）
        if (!username) {
            Toast.info("用户名不能为空",1)
        }else if( !password || !password2){
            Toast.info("密码不能为空",1)
        }else if(!/^\w+$/.test(username)){
            Toast.info("用户名只能以数字字母下划线组成",1)
        }else if(password2 !== password){
            Toast.info("两次密码输入不一致",1)
        }else if(!/^\d{3,}$/.test(password)){
            Toast.info("密码至少3位",1)
        }else{
            // 后台交互
            this.props.sign({username,password,type})
        }
        

    }
    render(){
        const {type} = this.state
        const {user} = this.props
        return (
            <div>
                {/* 重定向的两种写法，另一种见login，原理一样，只是写法小小小小的不同而已 */}
                {user.redirectTo && (<Redirect to={user.redirectTo}/>)}
                <NavBar>硅谷直聘</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        <WhiteSpace />
                        <InputItem placeholder='请输入用户名' onChange={val => this.handleChange("username",val)} >用户名</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder='请输入密码' type="password" onChange={val => this.handleChange("password",val)} >密&nbsp;&nbsp;&nbsp;码</InputItem>
                        <InputItem placeholder='再次输入密码' type="password" onChange={val => this.handleChange("password2",val)} >确认密码</InputItem>
                        <ListItem>
                            <span>类型</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type === "dashen"} onChange={() => this.handleChange("type","dashen")}> 大神 </Radio>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type === "boss"} onChange={() => this.handleChange("type","boss")}> Boss </Radio>
                        </ListItem>
                        <WhiteSpace />
                        {/* 这里没有用箭头函数的写法，所以在定义时要用箭头函数，这样this才能是捕获的外层this */}
                        <Button type='primary' onClick={this.sign}>注册</Button>
                        <Button onClick={()=>this.props.history.replace('/login')}>已有账号，去登录</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

// connect使组件和store连接
export default connect(
    state => ({user:state.user}),
    {sign}
)(Sign)
