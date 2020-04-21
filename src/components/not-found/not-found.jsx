/* 404 not found 组件 */

import React, {Component} from 'react'
import {Button} from "antd-mobile"

export default class NotFound extends Component {
  render (){
    return(
      <div>
        {/* 写在这里的样式，需要{{}}，第一层代码要写js代码，第二层代表对象，要用驼峰命名，应该是相当于原生js的node.style.xxx = '' */}
        <h2 style={{textAlign:"center"}} >404 NOT FOUND</h2>
        <Button type='primary' onClick={()=>this.props.history.replace("/")} >
          点击返回首页
        </Button>
      </div>
    )
  }
}