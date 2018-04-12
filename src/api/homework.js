import fetch from '@/utils/fetch'

export function AddHomework(homework) {
  return fetch({
    url: '/addHomework',
    method: 'post',
    data: homework
  });
}

export function GetHomeworkList(courseId) {
  return fetch({
    url: '/homeworkList?courseId=' + courseId,
    method: 'get'
  });
}

export function GetHomeworkNameList(courseId) {
  return fetch({
    url: '/homeworkNameList?courseId=' + courseId,
    method: 'get'
  });
}
