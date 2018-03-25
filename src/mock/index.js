import Mock from 'mockjs'
import auth from './auth'

// 登录相关
Mock.mock('/api/login', 'post', auth.loginByUsername);
Mock.mock('/api/userInfo', 'post', auth.getInfo);
Mock.mock('/api/logout', 'post', auth.logout);

export default Mock
