import fetch from '@/utils/fetch'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  };
  return fetch({
    url: '/user/login',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return fetch({
    url: '/user/userInfo',
    method: 'post',
    data: { token }
  });
}

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'post'
  });
}
