import fetch from '@/utils/fetch'

export function LoginByUsername(username, password) {
  const data = {
    username,
    password
  };
  return fetch({
    url: '/login',
    method: 'post',
    data
  });
}

export function GetInfo(token) {
  return fetch({
    url: '/userInfo',
    method: 'post',
    data: { token }
  });
}

export function Logout() {
  return fetch({
    url: '/logout',
    method: 'post'
  });
}

export function AddUser(user) {
  return fetch({
    url: '/addUser',
    method: 'post',
    data: user
  });
}

export function GetAllUser() {
  return fetch({
    url: '/getAllUser',
    method: 'get'
  });
}

export function EditUser(user) {
  return fetch({
    url: '/editUserByAdmin',
    method: 'post',
    data: user
  });
}

export function DeleteUser(user) {
  return fetch({
    url: '/user',
    method: 'delete',
    data: user
  })
}

export function GetClassUserList(classId, option) {
  let url = '/classUserList?classId=' + classId;
  if (option && option.onlyStudent) {
    url += '&onlyStudent=true'
  }
  return fetch({
    url: url,
    method: 'get'
  });
}

export function AddClassUser(data) {
  return fetch({
    url: '/addClassUser',
    method: 'post',
    data: data
  })
}

export function DeleteClassUser(data) {
  return fetch({
    url: '/userClass',
    method: 'delete',
    data: data
  })
}

export function GetUploadUserList(data) {
  return fetch({
    url: '/getUploadUserList',
    method: 'post',
    data: data
  })
}
