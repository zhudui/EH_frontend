const userMap = [
  {
    id: '1',
    username: 'qweqwe',
    fullname: '朱子豪',
    email: '120@qq.com',
    role: 'student',
    classIdArr: ['a'],
    sid: '14331398',
    token: '1'
  }
];

export default {

  loginByUsername: config => {
    console.log('config', config)
    const { username } = JSON.parse(config.body);
    return userMap.find(user => user.username === username);
  },

  getInfo: config => {
    const { token } = JSON.parse(config.body);
    const user = userMap.find(user => user.token === token);
    if (user) return user;
    else return Promise.reject(new Error('no user'));
  },

  logout: () => 'success'
}
