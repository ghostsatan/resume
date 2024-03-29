import axios from 'axios'
import store from '@/store'
// import { Toast } from 'vant'
import { Loading } from 'element-ui'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 8000 // request timeout
})

let loading

function startLoading() { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中，请稍后',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading() { // 使用Element loading-close 方法
  loading.close()
}
// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      // Toast.loading({
      //   forbidClick: true
      // })
      startLoading();
    }
    if (store.getters.token) {
      config.headers['X-Token'] = ''
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    // Toast.clear();
    endLoading();
    const res = response.data
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    // Toast.clear()
    endLoading();
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
