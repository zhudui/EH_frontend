import fetch from '@/utils/fetch'

export function AddCourse(courseData) {
  return fetch({
    url: '/addCourse',
    method: 'post',
    data: courseData
  });
}

export function GetCourseList() {
  return fetch({
    url: '/courseList',
    method: 'get'
  });
}

export function GetCourseName(courseId) {
  return fetch({
    url: '/courseName?courseId=' + courseId,
    method: 'get'
  });
}
