/* 
  头像选择组件（之所以抽成组件，一来有两个容器组件要用，节省代码；二来，这是个不用redux的组件，抽出方便管理）
*/

import React, {Component} from 'react'
// 引入UI组件标签（这里用网格布局）
import {List,Grid} from 'antd-mobile'
// 引入props管理
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {
  state = {
    icon:null
  }
  // 父组件传递的参数，先在这里声明类型和是否必需
  static propTypes = {
    setHeader:PropTypes.func.isRequired   //这里传来的是必须的函数，子组件调用传参给父组件——以完成子->父的通信
  }

  /* 这个在一般类中，叫构造器，是类的主体；
  而在react中又多了另一重意思：生命周期回调函数，这是在挂载时执行，render之前，算是最早的了 */
  constructor(props) {
    // 这句话比加
    super(props)
    this.headerList = []
    // 通过循环，将头像的数组处理好，头像图片及头像下的文字
    for (var i = 0; i < 20; i++) {
      this.headerList.push({
        icon:require(`../../assets/headers/头像${i+1}.png`),
        text:`头像${i+1}`
      })
    }
  }

  // 网格点击时触发的回调，参数(el: Object, index: number)，我们仅需要前一个，是个对象，代表当前点击对象
  hanleClick = ({text,icon}) => {   //通过解构的方式，仅获取其中的参数text和icon
    // 更新icon状态，以作List的头部显示
    this.setState({icon})
    // 调用父组件传来的函数，以传text头像文字给父组件（父组件向后台传输数据需要）
    this.props.setHeader(text)
  }

  render (){
    const {icon} = this.state
    // 处理List的头部，如果选择了，那么状态有头像，显示已选择头像文字及相应的头像，若没选择，为null，则显示请选择头像文字
    const header = !icon?"请选择头像":(<div>已选择头像 <img src={icon} alt=""/> </div>)
    return(
      <div>
        {/* List的头部用renderHeader设置 */}
        <List renderHeader={header} >
          {/* Grid作每个头像的布局，data为菜单数组，columnNum为列数 当某个网格被选中时触发回调并将该网格作为实参传递*/}
          <Grid data={this.headerList} columnNum={5} onClick={this.hanleClick} />
        </List>
      </div>
    )
  }
}