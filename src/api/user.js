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
  });
}

export function GetCourseUserList(courseId, option) {
  let url = '/courseUserList?courseId=' + courseId;
  if (option && option.onlyStudent) {
    url += '&onlyStudent=true'
  }
  return fetch({
    url: url,
    method: 'get'
  });
}

export function AddCourseUser(data) {
  return fetch({
    url: '/addCourseUser',
    method: 'post',
    data: data
  });
}

export function DeleteCourseUser(data) {
  return fetch({
    url: '/userCourse',
    method: 'delete',
    data: data
  });
}

export function GetUploadUserList(data) {
  return fetch({
    url: '/getUploadUserList',
    method: 'post',
    data: data
  });
}

export function ChangePassword(data) {
  return fetch({
    url: '/changePassword',
    method: 'post',
    data: data
  });
}
