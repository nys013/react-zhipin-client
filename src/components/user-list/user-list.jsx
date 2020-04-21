/* userList 抽出的组件，因为boss和大神显示界面相同，数据不同，所以抽出组件方便，不与redux交互 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {WingBlank,Card,WhiteSpace} from 'antd-mobile'
// 非路由组件，想拥有路由组件属性，用该函数包装
import {withRouter} from 'react-router-dom'
// 这是什么？？？--蚂蚁金服的动画库，网址https://motion.ant.design/index-cn
import QueueAnim from 'rc-queue-anim'

class UserList extends Component {
  static propTypes = {
    userlist : PropTypes.array.isRequired
  }
  render (){
    return(
      // 像底部导航的高度一般是确定的，不会跟随设备不同而不同，所以这里设置头部底部可以不同加单位，那么默认就是px了
      <WingBlank style={{marginTop:50,marginBottom:50}} >
        <QueueAnim type='scale'>
        {
          // 循环遍历userlist，取出单个user展示
          this.props.userlist.map(user => (
            <div key={user._id} >
              <WhiteSpace/>
                    {/* 绑定点击事件，当点击时去chat组件，且携带params参数去到对应的用户的聊天界面 */}
                <Card onClick={() => this.props.history.push(`/chat/${user._id}`)} >
                  <Card.Header
                    thumb={require(`../../assets/headers/${user.header || '头像20'}.png`)}  //这里设置默认头像为20
                    extra={user.username}
                    />
                  <WhiteSpace/>
                  <Card.Body>
                    <div>职位：{user.post} </div>
                    {user.company && (<div>公司：{user.company} </div>)}
                    {user.salary && (<div>月薪：{user.salary} </div>)}
                    <div>描述：{user.info}</div>
                  </Card.Body>
                </Card>
              <WhiteSpace/>
            </div>
          ))
        }
        </QueueAnim>
      </WingBlank>
    )
  }
}

export default withRouter(UserList)