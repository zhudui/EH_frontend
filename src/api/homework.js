import fetch from '@/utils/fetch'

export function AddHomework(homework) {
  return fetch({
    url: '/addHomework',
    method: 'post',
    data: homework
  });
}

export function GetHomeworkList(classId) {
  return fetch({
    url: '/homeworkList?classId=' + classId,
    method: 'get'
  });
}

export function GetHomeworkNameList(classId) {
  return fetch({
    url: '/homeworkNameList?classId=' + classId,
    method: 'get'
  });
}
