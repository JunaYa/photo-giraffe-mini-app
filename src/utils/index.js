function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join('/');
  const t2 = [hour, minute, second].map(formatNumber).join(':');

  return `${t1} ${t2}`;
}

export function calPictureSize(canvas, picture) {
  let width = 0;
  let height = 0;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const pictureWidth = picture.width;
  const pictureHeight = picture.height;

  const canvasRatio = canvasWidth / canvasHeight;
  const pictureRatio = pictureWidth / pictureHeight;

  if (canvasRatio > pictureRatio) {
    width = (pictureWidth / pictureHeight) * canvasHeight;
    height = canvasHeight;
  } else {
    width = canvasWidth;
    height = (pictureHeight / pictureWidth) * canvasWidth;
  }
  return {
    width,
    height,
  };
}

export default {
  formatNumber,
  formatTime,
  calPictureSize,
};
