import moment from 'moment'

export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
}

export function addHomeworkState(homeworkData) {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  if (homeworkData instanceof Array) {
    homeworkData.forEach(homework => {
      if (now < homework.startTime) {
        homework.state = 'future';
      } else if (now >= homework.startTime && now <= homework.endTime) {
        homework.state = 'open';
      } else {
        homework.state = 'closed';
      }
    })
  } else {
    if (now < homeworkData.startTime) {
      homeworkData.state = 'future';
    } else if (now >= homeworkData.startTime && now <= homeworkData.endTime) {
      homeworkData.state = 'open';
    } else {
      homeworkData.state = 'closed';
    }
  }
}

export function fileDownload(filePath, filename) {
  const path = filePath.split('/');
  const fileFullname = path.pop();
  const extname = fileFullname.split('.')[1];
  let link = document.createElement('a');
  if (filename) {
    link.download = filename + '.' + extname;
  } else {
    link.download = fileFullname;
  }
  link.style.display = 'none';
  link.href = filePath;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link = null;
}
