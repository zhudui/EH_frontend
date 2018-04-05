import fetch from '@/utils/fetch'

export function AddClass(classData) {
  return fetch({
    url: '/addClass',
    method: 'post',
    data: classData
  });
}

export function GetClassList() {
  return fetch({
    url: '/classList',
    method: 'get'
  });
}
