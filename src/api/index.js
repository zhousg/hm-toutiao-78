// 对axios进行配置  然后将配置好的axios导出
import axios from 'axios'
import store from '@/store'

// 进行配置
// 基准路径
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 请求头字段
axios.defaults.headers = {
  Authorization: `Bearer ${store.getUser().token}`
}

export default axios
