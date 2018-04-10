import fetch from '@/utils/fetch'

export function GetReviewList(data) {
  return fetch({
    url: '/getReviewList',
    method: 'post',
    data: data
  });
}

export function SubmitReview(review) {
  return fetch({
    url: '/addReview',
    method: 'post',
    data: review
  })
}

export function GetReview(data) {
  return fetch({
    url: '/getReview',
    method: 'post',
    data: data
  });
}

export function GetClassReviewData(classId) {
  return fetch({
    url: '/classReviewData?classId=' + classId,
    method: 'get'
  });
}
