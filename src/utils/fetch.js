import axios from 'axios'
// import store from '@/store'

import vue from 'vue'

// 创建axios实例
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : process.env.BASE_API,
  // baseURL: 'http://127.0.0.1:3000/api',
  timeout: 5000
});

console.log('service', service);

// request拦截器
service.interceptors.request.use(config => {
  // const token = store.getters.token;
  // 判断是否存在token，如果存在的话，则每个http header都加上token
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
});

// response拦截器
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error);// for debug
    vue.$Message.error({
      message: error.message,
      duration: 5 * 1000,
      closable: true
    });
    return Promise.reject(error);
  }
);

export default service
