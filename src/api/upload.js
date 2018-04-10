import fetch from '@/utils/fetch'

export function GetFilePath(data) {
  return fetch({
    url: '/getFilePath',
    method: 'post',
    data: data
  })
}
