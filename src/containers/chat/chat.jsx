/* eslint-disable jsx-a11y/accessible-emoji */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {NavBar,Icon,List,InputItem,Grid} from 'antd-mobile'
// 聊天页面的动画效果(这里会有影响故不用了)
// import QueueAnim from 'rc-queue-anim'

import {sendMsg,updateCount} from '../../redux/actions'

const Item = List.Item
class Chat extends Component {

  state = {
    content:'',
    isShow:false
  }
  // 在render之前执行
  constructor(props){
    super(props)
    const emojis = ['😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆',
      '😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆',
      '😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆', '😃', '😄', '😁', '😆',]
      // data值Array<{icon, text}>不能是以单个文本，要以对象的形式传过去，所以用数组的map方法处理一些
    this.emojis = emojis.map(emoji => ({text:emoji}))
  }
  componentDidMount(){
    // 在初始化页面时，第一次render后，将聊天页面自动定位到底部
    window.scrollTo(0 , document.body.scrollHeight)
    // 进入页面则表示已读，更新阅读数量
    this.props.updateCount(this.props.match.params.userid,this.props.user._id)
  }
  componentDidUpdate(){
    // 在数据更新时，即发送消息之后，将聊天页面Y轴滑动整个页面的滑动高度
    window.scrollTo(0 , document.body.scrollHeight)
    // 或者在数据更新时（无论是我发的还是对方发的，都做一次请求）——好处：不会有一闪而过的效果；缺点：多次发请求效率低
    this.props.updateCount(this.props.match.params.userid,this.props.user._id)
  }
  // 在页面消失之前，更新一次数量(在当前页面，收到消息，则已读，所以消失之前再更新一次)——但是会看到一闪而过的效果
  /* componentWillUnmount(){
    this.props.updateCount(this.props.match.params.userid,this.props.user._id)
  } */

  // 点击小表情，显示隐藏表情网格
  handleEmoji = () => {
    const isShow = !this.state.isShow
    this.setState({isShow})
    //异步手动派发resize事件,解决表情列表显示的bug
    if(isShow){
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      },0)
    }
  }

  // 发消息
  handleSend = () => {
    const from = this.props.user._id
    // 从路由的match属性中去到params参数，而userid是main中映射路由时设置的名字
    const to = this.props.match.params.userid
    // 获取输入框内容（通过onChange监听后修改状态，这里读取数据，trim两端去空格）
    const content = this.state.content.trim()
    if (content) {
      // 输入框内容有值，发送异步请求
      this.props.sendMsg({from,to,content})
      // 将输入框内容清除
      this.setState({content:''})
      // 将表情开关置为false
      if(this.state.isShow){
        this.setState({isShow:false})
      }
    }
  }
  render() {
    const {users , chatMsgs} = this.props.chat
    const {user} = this.props
    const targetId = this.props.match.params.userid
    const chat_id = [targetId,user._id].sort().join('_')
    // 在异步加载过程中chat可能还没有获取到，就加载该页面，那么就会报错，所以先return null 不加载页面
    if (!users[user._id]) {
      return null
    }
    // 过滤chatMsgs，滤出只和当前用户相关的
    const chatMsg = chatMsgs.filter(item => item.chat_id === chat_id)
    // const header = `../../assets/headers/${users[targetId].header || '头像20' }.png`
    const header = (<img src={require(`../../assets/headers/${users[targetId].header || '头像20' }.png`)} alt={'头像'} />)
    return (
      <div id='chat-page'>
        <NavBar
          className='top-fixed-bar'
          icon={<Icon type='left' />}
          onLeftClick={() => this.props.history.goBack()}
        >
          {users[targetId].username}
        </NavBar>
        <List style={{marginTop:50,marginBottom:50}} >
          {/* 用于聊天页面的动画效果,但在这里不适合，会影响到对页面高度的计算 */}
          {/* <QueueAnim  type='left' delay={100} > */}
            {
              /* 这里的样式有些起鼓，已经加了multipleLine wrap，乱的英文和标点就显示不全*/
              chatMsg.map(msg => {
                if (targetId === msg.from) {//别人发给我
                  return <Item className='chat-to-me' multipleLine wrap thumb={header} key={msg._id}> {msg.content} </Item>
                } else {
                  return <Item className='chat-from-me' multipleLine wrap extra='我' key={msg._id}>{msg.content}</Item>
                }
              })
            }
          {/* </QueueAnim> */}

        </List>

        <div className='am-tab-bar'>
          {/* 多行文本TextareaItem没有extra，这里要求有发送和表情按钮，所以不合适
           */}
          <InputItem
            placeholder="请输入"
            value={this.state.content}
            onChange={val => this.setState({ content: val })}
            onFocus={() => this.setState({ isShow: false })}
            extra={
              <span>
                <span onClick={this.handleEmoji} style={{ marginRight: 5 }} >😀</span>
                <span onClick={this.handleSend} >发送</span>
              </span>
            }
          />
          { /* 表情网格 */
            this.state.isShow && 
            (<Grid 
              data={this.emojis}
              columnNum={8}
              carouselMaxRow={4}
              isCarousel={true}
              onClick={(item) => { this.setState({ content: this.state.content + item.text }) }} />)
          }
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user,chat:state.chat}),
  {sendMsg,updateCount}
)(Chat)