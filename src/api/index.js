// 对axios进行配置  然后将配置好的axios导出
import axios from 'axios'
import store from '@/store'

import JSONBIG from 'json-bigint'

// 进行配置
// 基准路径
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.transformResponse = [(data) => {
  // data原始json字符  对data进行转化  return的值转化后的结果
  // data 在删除接口返回的是 null 使用JSONBIG转换null会报错
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]
// 请求头字段
// axios.defaults.headers = {
//   Authorization: `Bearer ${store.getUser().token}`
// }

axios.interceptors.request.use((config) => {
  // 修改  在每次请求前 获取一次token 设置头部
  // 好处：不会覆盖之前的头部信息
  config.headers.Authorization = `Bearer ${store.getUser().token}`
  return config
}, (err) => {
  return Promise.reject(err)
})

axios.interceptors.response.use((res) => {
  // 成功的返回值 默认包装成promise对象
  return res
}, (err) => {
  // 获取响应状态码
  // err 错误对象
  // err.response 响应对象
  // err.response.status 响应状态码
  if (err.response.status === 401) {
    // token失效  跳转登录页面
    // this.$router.push('/login')  本质  把hash改成了 #/login
    location.hash = '#/login'
  }
  return Promise.reject(err)
})

export default axios
