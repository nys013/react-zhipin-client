import React, {Component} from 'react'
import {TabBar} from 'antd-mobile'
import PropTypes from 'prop-types'
// 用于将非路由组件包装，将路由组件的三个属性location、match、history给包装的组件
import {withRouter} from 'react-router-dom'

class NavFooter extends Component {
  static propTypes ={
    navList:PropTypes.array.isRequired,
    unReadCount:PropTypes.number.isRequired
  }

  render (){
    let {navList} = this.props
    let path = this.props.location.pathname
    // 过滤数组，符合条件的会返回，nav中hide为false返回（false&&undefined）
    navList = navList.filter(nav => !nav.hide)
    return(
        <TabBar
        >
          {
            navList.map((nav)=>(
              <TabBar.Item
                // 数量徽标
                badge={nav.path ==='/message' && this.props.unReadCount}
                key = {nav.path}  //唯一标识
                title = {nav.text}
                // 文档就是icon有两种用法，一种传节点，然后给节点设置样式(背景图)，另一种就是传对象，uri:图片地址，这里用到了commonJS的语法引入图片
                icon = {{uri:require(`./img/${nav.icon}.png`)}}
                selectedIcon = {{uri:require(`./img/${nav.icon}-selected.png`)}}
                selected = {nav.path===path}
                onPress = { //点击时触发
                  () => {
                     this.props.history.replace(nav.path)
                  }
                }
                />
            ))
          }
        </TabBar>
    )
  }
}

export default withRouter(NavFooter) //因为NavFooter不是路由组件（没有注册路由），所以要进行路由操作，就要用withRouter