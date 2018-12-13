/*
 * @Author: hzq
 * @Date: 2018-08-28 16:05:27
 * @Last Modified by: hzq
 * @Last Modified time: 2018-12-13 11:30:34
 * @文件说明: 请求配置
 */
import axios from 'axios'
let baseURL = 'https://open-api.beone.app'
let t = process.env.PATH_TYPE === 'prod' ? '正式' : '测试'
console.log('当前环境：' + t)

if (process.env.PATH_TYPE === 'prod') {
    baseURL = 'https://api.dzqqsc.com'
}

// 创建实例时设置配置的默认值
const Service = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-APPID': 'toBPJhUqos'
    }
})
// 添加请求拦截器
Service.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
Service.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response.data
    },
    error => {
        // 对响应错误做点什么
        if (error) {
            return Promise.reject(error)
        }
    }
)
export default Service
