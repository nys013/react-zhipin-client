import React from 'react'
import logo from './logo.png'
import './logo.less'

export default function Logo (){
  return(
    <div className="logo_container">
      <div className="logo">
        <img src={logo} alt="logo"/>
      </div>
    </div>
  )
}