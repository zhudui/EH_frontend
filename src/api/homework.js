import fetch from '@/utils/fetch'

export function AddHomework(homework) {
  return fetch({
    url: '/addHomework',
    method: 'post',
    data: homework
  });
}
