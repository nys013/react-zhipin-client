import React, {Component} from 'react'
import {connect} from "react-redux"
import {List,Badge} from 'antd-mobile'

const {Item} = List
// Brief是List.Item.Brief，是辅助说明，看文档
const {Brief} = Item

class Message extends Component {
  // 将chat中的chatMsgs进行处理，只显示最新的消息，且对unReadCount进行计算
  getLastMsgs(meId,chatMsgs){
    // 创建最新消息的空对象(因为对象可以以chat_id为唯一属性名，将消息进行分类处理)
    const lastMsgObj = {}
    // 将chat中的chatMsgs循环遍历，处理后装入lastMsgObj
    chatMsgs.forEach(msg => {
      // 消息是发给我的，且是未读的，那就标记该条消息unReadCount为1，否则为0
      // debugger
      if (msg.to === meId && !msg.read) {
        msg.unReadCount = 1
      } else {
        msg.unReadCount = 0
      }
      const lastMsg = lastMsgObj[msg.chat_id]
      // 判断之前该msg的chat_id是否已经存入lastMsgObj(对msg进行分类)
      if (!lastMsg) {
        // 没有，那就存入
        lastMsgObj[msg.chat_id] = msg
      } else {
        // 有，判断该msg的时间是否为最新，若是最新存入lastMsgObj
        lastMsgObj[msg.chat_id] = msg.create_time > lastMsg.create_time ? msg : lastMsg
        // 然后其基础上，增加unReadCount
        lastMsgObj[msg.chat_id].unReadCount = msg.unReadCount + lastMsg.unReadCount
        
      }
    })
    // 将lastMsgObj的值取出成数组，数组遍历排序，时间最近的在前面，将数组返回
    return Object.values(lastMsgObj).sort((m1,m2)=>{
      return m2.create_time - m1.create_time
    })

  }
  render(){
    const {user,chat} = this.props
    const meId = user._id
    const {users,chatMsgs} = chat
    if (!chatMsgs) {
      return null
    }
    const lastMsgs = this.getLastMsgs(meId,chatMsgs)
    return (
      <div style={{marginTop:50,marginBottom:50}}>
        <List>
          { /* 遍历最新消息数组显示 */
            lastMsgs.map(msg => {
              // 判断对方，该条消息to是我，那么对方就是from，否则就是to
              const targetId = msg.to===meId?msg.from:msg.to
              const targetUser = users[targetId]
              return (
                <Item
                  key = {msg.chat_id}
                  extra={<Badge text={msg.unReadCount}/>}
                  thumb={require(`../../assets/headers/${targetUser.header || '头像20' }.png`)}
                  arrow='horizontal'
                  onClick={()=>this.props.history.push(`/chat/${targetId}`)}
                  >
                  {targetUser.username}
                  <Brief>{msg.content}</Brief>
                  {/* {msg.content} */}
                </Item>
              )
            })
          }

        </List>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user,chat:state.chat}),
  {}
)(Message)