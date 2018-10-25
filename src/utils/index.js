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

export function getPictureInfo(url) {
  return new Promise((resolve) => {
    wx.getImageInfo({
      src: url,
      success: data => resolve(data),
    });
  });
}

export function selectPicture() {
  return new Promise((resolve) => {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      success: (res) => {
        if (res.tempFiles.length > 0) {
          getPictureInfo(res.tempFiles[0].path).then((info) => {
            resolve(info);
          });
        }
      },
    });
  });
}

export function fetchPicture(path) {
  return new Promise((resolve) => {
    wx.downloadFile({
      url: path,
      success(res) {
        if (res.statusCode === '200') {
          resolve(res.tempFilePath);
        }
      },
    });
  });
}

export function getPostcards() {
  let postcards = [];
  try {
    postcards = wx.getStorageSync('postcards');
  } catch (e) {
    //
  }
  return postcards || [];
}

export function setPostcards(path) {
  const postcards = getPostcards();
  postcards.push(path);
  try {
    wx.setStorageSync('postcards', postcards);
  } catch (e) {
    //
  }
}

export default {
  formatNumber,
  formatTime,
  calPictureSize,
  getPictureInfo,
  selectPicture,
  getPostcards,
  setPostcards,
};
