# 本项目就是仿照boss直聘，用react脚手架做的SPA应用 
主要用于学习react的，所以写了很多注释帮助理解

## 以下是我个人的一些小总结，仅个人不熟悉的知识点总结，供参考
## 目录
    [1.各个目录的含义](#1.各个目录的含义)
    [2.ajax对axios的封装](#2.ajax对axios的封装)
    [3.后台项目操作mongoDB](#3.后台项目操作mongoDB)
    [4.redux](#4.redux)
    [5.render](#5.render)
    [6.css](#6.css)
    [7.socket.io](#7.socket.io)
    [8.解决前后端分离时的跨域问题](#8.解决前后端分离时的跨域问题)
    [9.HashRouter和BrowserRouter](#9.HashRouter和BrowserRouter)



### 1.各个目录的含义 
    build    生产打包产生的文件
    node_modules    node模块包
    public    公共资源，一般放入口html文件
    src   源码文件夹
        index.js    入口js    一般就是ReactDOM渲染，配置路由，引入store，引入公共文件的地方 
        api    ajax请求相关（二次封装ajax， 各个后台请求）
        assets    公共资源文件夹（公共样式，公共图片）
        components    UI组件模块文件夹（不与redux交互）
        containers    容器组件模块文件夹（涉及redux交互）
        redux    redux相关模块（store、reducer、actions、action-types）
        utils    工具模块文件夹（工具函数：获取正确地址，时间格式的处理）
    .gitignore    git管理忽略文件
    config-overrides.js    antd自定义引入组件的配置文件
    package.json    项目说明，下载引用的模块包名
    README.md    随便写的，一般是对项目的说明，方便在GitHub上的访问者迅速了解项目
    yarn.lock    下载包的管理

### 2.ajax对axios的封装
    参考:[两种封装ajax的函数](#两种封装ajax的函数)
    axios是对原生XHR的各种请求头、请求体...进行了封装，只需要调用它的方法，传url和data即可，其返回的是promise对象
    我们再次封装是
        一、方便get请求传参，query参数需要拼串，而且省代码（get请求就只用传url）
        二、方便取数据，在调用时我们不通过传统.then，而是用es7语法async和await，此时获得的是response，包括请求返回状态，data...，而我们实际需要的只有data，如果不封装，需要两步来取，累赘。我们自己new Promise 返回，对axios返回的promise进行.then处理，将成功的数据resolve，失败的就弹出显示（反正是要catch，错误最好都捕获）

### 3.后台项目操作mongoDB
    参考:[MongoDB](#mongoDB)
创建 包含 n 个能操作 mongodb 数据库集合的 model 的模块 
1. 连接数据库 
    1.1. 引入 mongoose 
    1.2. 连接指定数据库(URL 只有数据库是变化的) 
    1.3. 获取连接对象 
    1.4. 绑定连接完成的监听(用来提示连接成功) 
2. 定义出对应特定集合的 Model 并向外暴露 
    2.1. 字义 Schema(描述文档结构) 
    2.2. 定义 Model(与集合对应, 可以操作集合) 
    2.3. 向外暴露 Model 
在router中引入Model，在相应的请求中进行增删改查
    增    Model.create(doc,callback(err,doc))    或者new Model(doc).save(callback(err,doc))
    删    基本不用（毕竟数据很重要的，不想要的数据一般会通过属性过滤掉）
    改    Model.update(condition,doc,callback(err,{ ok: x, nModified: x, n: x }))
        Model.updateMany(condition,doc,callback(err,{ ok: x, nModified: x, n: x }))
        Model.findByIdAndUpdate({id} , doc ,callback(err,oldDoc))
        Model.prototype.update(newDoc , callback)
    查    Model.find(condition,filter,callback(err,docs))
 

### 4.redux
    参考：（ https://cn.redux.js.org/）
Redux是JavaScript状态容器，不只服务于react，但经常配合react使用
基本流程：组件通过调用dispatch(action)分发action，store对象内部将state和action对象传给reducer，根据action.type与reducer中的某个处理匹配，进行该处理执行（处理是根据state返回一个新的state，而不是直接修改state），返回的state在store中管理，可通过state的getState()获取到。

核心概念
    store      将state、reducer、action联系起来的对象
    action     标示执行行为的对象
    reducer    通过老的state和action，返回新的state的纯函数（不修改老的state，而是返回一个新的state）
核心api：
    createStore()    创建包含指定reducer的store对象（参数为reducer）
    store对象    最核心的管理模块    方法:getState()、dispatch(action)、subscribe(listener)
    applyMiddleware(中间件）      应用上基于redux的中间件（像thunk为redux异步中间件，引入后，需要在createStore的第二个参数应用才行——createStore(reducer , applyMiddleware(thunk) ) ）
    combineReducers({reducer1 , reducer2 ...})    合并多个reducer函数    
    （在实际开发中，我们需要不仅一个reducer，但是store只创建一个，所以就将其合并后在createStore的第一个参数传入即可
        之前我们取是state就是单个reducer，但是现在state是包含多个reducer的对象，需要state.xxx取出）    
但如果仅仅只用上面这些，会导致react和redux耦合度太高，编码不够简洁
所以我们通常借用【react-redux】的插件库
  一般将组件分为两类 UI组件，只负责UI呈现，不带业务逻辑，通过props接受数据，不使用redux相关的api，一般在components文件夹下
                   容器组件，负责管理数据和业务逻辑，使用redux的api，一般在containers文件夹下
  相关api
    Provider    Provider标签包裹主组件App，管理的store写在Provider上传入，使所有组件都能得到state数据，同时监听state变化实现页面展现（省去了subscribe）
    connect()    用于包装UI组件变成容器组件，在该组件获取state时，不通过store.getState了，而是props.state
        内部：connect(mapStateToProps,mapDispatchToProps)(UI组件)  
            mapStateToProps为 state => ({state:state.xxx})     mapDispatchToProps为{yyy,zzz}  ————这两个是指调用下面两个方法（内部封装好了，如果想了解就去看视频）
    mapStateToProps()    将外部的数据（即state对象）转换为UI组件的标签属性（就可以通过props获取到了）
    mapDispatchToProps()    将分发的action的函数(dispatch(action)）转化为UI组件的标签属性


### 5.render
    5.1 render() 函数应该为纯函数，这意味着在不修改组件 state 的情况下，每次调用时都返回相同的结果，并且它不会直接与浏览器交互。
     即render中页面跳转不能用this.props.history.replace('/login')，而是要用<Redirect to='/login' />
    5.2当 render 被调用时，它会检查 this.props 和 this.state 的变化
            即 render会在以下几种情况执行：
            1. 首次加载 2. setState改变组件内部state。 注意： 此处是说通过setState方法改变。 3. 接受到新的props
        （所以在redux发生改变时，就会render()）

### 6.css
    在react中写样式，（1）定义className，然后在less、scss之类的文件中写样式，然后主文件引入
                    （2）像内联样式，虽然不是内联样式的写法，但是就是用原生js操作内联样式（类似于node.style.xxx = ''）
                            写法style={{backgroundColor:'red'}}  注意：要用双大括号（代表js代码，对象），驼峰命名，属性值为字符串
    height 的100% 和 inherit
    inherit为从父元素继承 height 属性的值。从字面上理解和100%并无不同，但是因为这两个是计算值，在某些属性变化后就有所不同了 */
    // 网上的一篇博客有说道——( https://www.zhangxinxu.com/wordpress/2015/02/different-height-100-height-inherit/)
        //当子元素为绝对定位元素，同时，父容器的position值为static的时候
        // 100%：高度就是父元素的高度100%   inherit：高度为自适应

### 7.socket.io
(官方：https://socket.io/) (中文部分解释：http://www.shuaihuajun.com/article/1504749640971/)
socket.io基于WebSocket协议封装，兼容不支持ws的浏览器采用ajax轮询，socket.io为开发者提供服务端和客户端两套库...

### 8.解决前后端分离时的跨域问题
    （参考博客：http://www.imooc.com/article/291931）
    （1）JSONP    src是最基本的允许跨源的（script、img中）
                 原生：一方面在script标签中定义callback，有个形参，另一方面通过js动态创建script标签，然后设置src，src传下载数据连接。在动态指定src后，callback调用，形参的值就为下载数据
                        若是接口允许jsonp操作，那么url为在一般的query参数后，再加&callback=自定义的函数名，即可，然后动态生成的script标签的src=url
                 项目也可用jsonp的库
                  但是因为callback是通过query参数传入，所以其只支持get请求。同时也需要接口是能够提供jsonP的
    （2）前后端放在同一个服务器下运行——将打包好的项目（build）放到后台项目里一起运行，像用express搭建的话放到public下。这就是直接解决了跨域，请求的就是后台用的服务器地址
    （3）开发中一般用：在有脚手架的基础上，前端package.json中配置    "proxy": "http://localhost:4000"   启动代理服务器，可以在控制台的Network中看到，请求仍是前端的3000端口号，但是通过该代理可请求到后端的4000  
    （4）生产环境打包时，一般是由后台工程师配置代理服务器的。不过我们也需要了解的。
        首先打包好后，通过serve build访问（存在跨域问题）；
        在无中文界面运行nginx，通过任务管理器查看进程；
        通过修改nginx.confi文件，/api开头访问后台路径，/任意访问前台路径，同时在前台写发送ajax请求url时，都加上个基础路径/api，这样通过访问nginx的地址，其通过判断请求地址，向相应的服务器请求，返回数据
    （5）CORS    修改ajax的同源协议Access-Control-Allow-Origin（不建议，本身禁止跨域就是为了安全，修改协议就不安全了）


### 9.HashRouter和BrowserRouter
    前台路由的两种形式，前者带#，后者不带
    在开发环境无区别，在生产环境且是前后台在同一个服务器启动时，后者在刷新某个路由时会产生404问题
    原因：项目根路径后的path因为没有#，会被当做后台路由路径，去请求对应的后台路径，但我们需要访问的是前台路径
    解决：通过中间件app.use，在没有后台路径与请求路径匹配时，就会请求这个中间件，通过让中间件读取public下的index.html（相当于给后台配置404界面，而该页面是前台首页）
         但是注意前台路径和后台路径不能重复，否则在请求时就会访问后台路径产生错误处理

#### 参考：

#### 两种封装ajax的函数
有略微的不同，主要在发送get请求，需要携带params参数和query参数的不同，和通过promise的特性取出结果返回一个新的promise

这个get请求是用query携带参数，参数会在URL中，所以要预先进行处理
import axios from "axios"
export default function ajax(url,data={},type="GET") {
  if(type === "GET"){
    let dataStr = ''
    Object.keys(data).forEach(key =>{
      dataStr += key + "=" + data[key] +"&"
    })
    if(dataStr){
      dataStr = dataStr.slice(0,-1)
      url = url + "?" + dataStr
    }
    return axios.get(url)
  }else{
    return axios.post(url,data)
  }
}

这个get请求是params携带参数，在用axios的get方法时，作为第二个对象传过去（这个还多封装的一层promise，一层取出data）
import axios from 'axios'
import {message} from 'antd'
export default function ajax (url,data={},type="GET"){
  return new Promise((resolve,reject) => {
    let promise
    if(type==="GET"){
      promise =  axios.get(url,{
        params:data
      })
    }else{
      promise = axios.post(url,data)
    }
    promise.then(response =>{
      resolve(response.data)
    }).catch(error => {
      message.error('请求发生错误'+error)
    })
  })
}

#### MongoDB
基于node的mongoose来操作MongoDB

mongoose这是node的第三方模块
所以首先npm init    ，然后下载    npm i -s mongoose    ,
然后就是代码部分
    1.引入模块
        const mongoose = require("mongoose")
    2.连接数据库
        调用mongoose的connect方法，传参为    固定协议mongodb://数据库的IP地址:端口号（默认为27017,可不写）/数据库名
        mongoose.connect('mongodb://localhost:27017/test')    
        //在连接时需要加上 这个配置才不会报错，虽然不加报错也不影响数据库的正常使用
        mongoose.connect("mongodb://localhost/test" ,  {useNewUrlParser: true , useUnifiedTopology: true } )
    3.可监听数据库的连接状态，mongoose有一个属性connection，可以监听它知道数据库的连接与断开
        mongoose.connection.once("open" , function() {} )   当数据库连接时触发回调
        或者 mongoose.connection.once("connected" , function() {} )   当数据库连接时触发回调
        mongoose.conenction.once("close" , function() {} )    当数据库断开时触发回调 
    4.断开数据库连接(一般不调，因为MongoDB是非关系型数据库，只需要连接一次)
        mongoose.disconnect()
    **这里只有前两步是必须的**

三个核心对象
    Schema    约束对象（模式对象）
    Model    集合
    Docuement    文档

const {Schema , model } = mongoose
1.创建约束
    const schema = new Schema({
        name:String,
        gender:{
            type:String,
            default:"male"
        }
    })
2.创建Model
    const Model = new model (modelname , schema)
3.创建文档
    Model.create([] , callback)

增删改查（Model的方法）
    增C   Model.create(docs , callback)
    查R   Model.find(conditions,[projection],[options],[callback])    总会返回一个数组
        Model.findOne(conditions,[projection],[options],[callback])    返回第一个查询到的文档
        Model.findById(id,...同上)  
        // conditions查询条件，可选：projection投影、options查询选择（skip、limit）、callback实则必传，查询结果通过回调函数返回
    改U  Model.update(conditions , doc , [options] , [callback])   只改匹配到的第一个，同updateOne
        Model.updateMany(conditions , doc , [options] , [callback])
        Model.updateOne(conditions , doc , [options] , [callback])
    删D  Model.remove(conditions,[callback])
    查数量    Model.count(condtions , callback(err,length))

Document是Model的实例，所以可以通过new Model产生    
    const doc = new Model({})
Document的方法
    增   Model.prototype.save([options,] [function(err)])   将文档插入集合
    改   Model.prototype.update(newDoc,[options],[callback])
    删   Model.prototype.remove([callback])
    toObject() 将document对象转化为普通对象，这样doc就不能使用document的属性和方法了，注意：没有将原对象改变，而是返回了一个新的js对象
    toJSON()    将document对象转化为普通JSON对象

条件操作符（用于查询、更新...操作时需要的条件）
    使用    例：{type:{$ne:type}}
    常用    $gt 大于    $gte 大于等于    $lt 小于    $ne 不等于   
     *还有很多很多啦，网上查查就好了*

