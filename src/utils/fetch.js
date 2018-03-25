import axios from 'axios'

import vue from 'vue'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000
});

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
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
