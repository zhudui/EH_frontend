import fetch from '@/utils/fetch'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  };
  return fetch({
    url: '/api/login',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return fetch({
    url: '/api/userInfo',
    method: 'post',
    data: { token }
  });
}

export function logout() {
  return fetch({
    url: '/api/logout',
    method: 'post'
  });
}
