// 引入axios
import axios from 'axios'
import { Toast } from 'antd-mobile'

// 对ajax进行二次封装
export default function ajax (url='',data={},type='GET'){
    return new Promise((resolve,reject) => {
        let promise = null
        if (type==="GET") {
            // api接口文档中get请求都是query参数，则需要进行字符串拼接
            let str =''
            for (const key in data) {
                str += key + '=' + data[key] + '&'
            }
            if(str){    //在有str才进行
                str = str.slice(0,-1)
                url = url + '?' + str
            }
            promise = axios.get(url)
        } else {
            promise = axios.post(url,data)
        }
        promise.then(
            // status为200，响应成功，返回数据（登录成功或失败数据）
            response => resolve(response.data),
            // status不为200，则响应不成功，可能是网络，地址错误等问题
            () => Toast.offline('连接服务器失败')
        )
        // promise.then(resolve,reject)
    })
}
