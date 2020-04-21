// 引入socket.io的客户端包
import io from 'socket.io-client'

// io调用，连接对应的服务器，传服务器地址,ws是协议名(当连接成功，服务器通过on的'connection'可以监听到)
const socket = io('ws://localhost:4000')

// 监听io 客户端向服务器发送数据（名字与服务器监听接收名字对应）
socket.emit('clientToServer',{name:'test',time:new Date()})
console.log('clientToServer',{name:'test',time:new Date()})

// 监听io 服务器向客户端发送对应请求名时触发
socket.on('serverToClient',function(data){
    console.log('serverToClient',data)
})