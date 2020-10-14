//index.js
//获取应用实例
import { IMyApp } from '../../app'
import {
  calPictureSize,
  selectPicture,
  // setPostcards,
} from '../../utils/util';

const app = getApp<IMyApp>()

let _context:any = null

Page({
  data: {
    userInfo: {
      nickName: '',
      picturePath: '',
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canvasConfig: {
      width: 0,
      height: 0,
    },
    status: 'idle',
    isEditting: false,
    postcard: {
      path: '',
      width: 0,
      height: 0,
    },
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    this.data.canvasConfig.width = systemInfo.windowWidth - 8;
    this.data.canvasConfig.height = systemInfo.windowHeight - 64;

    if (app.globalData.userInfo) {
      this.setData!({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData!({
          userInfo: res,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData!({
            userInfo: {
              ...res.userInfo,
              picturePath: '',
            },
            hasUserInfo: true
          })
        }
      })
    }
  },

  onShow() {
    _context = wx.createCanvasContext('canvas');
  },

  getUserInfo(info: any):void {
    wx.vibrateShort();
    const user = info.mp.detail.userInfo;
    this.getPicture(user.avatarUrl).then((picturePath: string) => {
      user.picturePath = picturePath;
      this.data.userInfo = user;
      this.addPostCard();
    });
  },

  getPicture(avatarUrl: string):any {
    wx.showLoading({
      title: '努力加载ing…',
    });
    return new Promise((resolve: any) => {
      wx.downloadFile({
        url: avatarUrl,
        success(res) {
          wx.hideLoading();
          resolve(res.tempFilePath);
        },
        fail() {
          wx.hideLoading();
          wx.showModal({
            title: '出了一 .. 小问题',
            content: '可能是网络的小问题，再次尝试一下吧!',
          });
        },
      });
    });
  },

  addPostCard() {
    wx.vibrateShort();
    selectPicture().then((info: any) => {
      const {
        width,
        height,
      } = calPictureSize(this.data.canvasConfig, info);
      this.setData!({
        postcard: {
          ...info,
          width: width,
          height: height,
        }
      })
    });
  },

  cancelSavePicture() {
    wx.vibrateShort();
    this.setData!({
      isCanvas: false
    })
  },

  savePicture() {
    wx.vibrateShort();
    // const margin = 0;
    // const xValue = margin;
    // const yValue = margin;
    // const canvasWidth = this.data.canvasConfig.width;
    // const canvasHeight = this.data.canvasConfig.height;

    // const option: CanvasToTempFilePathOption = {
    //   canvasId: 'canvas',
    //   quality: 10,
    //   x: xValue,
    //   y: yValue,
    //   width: canvasWidth,
    //   height: canvasHeight,
    //   destWidth: canvasWidth * 2,
    //   destHeight: canvasHeight * 2,
    //   success: (res: any) => {
    //     wx.saveImageToPhotosAlbum({
    //       filePath: res.tempFilePath,
    //       success: () => {
    //         wx.showToast({
    //           title: '保存成功!',
    //           icon: 'success',
    //         });
    //         setTimeout(() => {
    //           this.setData!({
    //             isCanvas: false,
    //           })
    //         }, 300);
    //         setPostcards(res.tempFilePath);
    //       },
    //     });
    //   },
    // }
    
  },

  drawPostCard() {
    if (!this.data.postcard) return;

    const blur = 8;
    _context.fillStyle = '#fefefe';
    _context.shadowOffsetX = 2;
    _context.shadowOffsetY = 2;
    _context.shadowColor = '#999999';
    _context.shadowBlur = blur;

    const rectW = this.data.canvasConfig.width - (blur * 2);
    const rectH = this.data.canvasConfig.height - (blur * 2);
    _context.fillRect(8, 8, rectW, rectH);

    const margin = 28;
    const x = margin;
    const y = margin;
    const width = this.data.postcard.width - (margin * 2);
    const height = this.data.postcard.height - (margin * 2);
    _context.shadowOffsetX = 0;
    _context.shadowOffsetY = 0;
    _context.shadowBlur = 0;
    _context.drawImage(this.data.postcard.path, x, y, width, height);

    _context.fillStyle = '#333333';

    _context.shadowOffsetX = 2;
    _context.shadowOffsetY = 2;
    _context.shadowBlur = 2;
    _context.setFontSize(18);

    const tX = width - (margin + 24);
    const tY = height + 80;
    _context.fillText(`── ${this.data.userInfo.nickName}`, tX, tY, 100);
    const quotes = [
      '早放学，早回家!',
      '吃饭、睡觉、撸猫',
      'Beauty is found within.',
    ];

    const index = Math.random() * quotes.length;
    const quote = quotes[index];
    const qX = margin;
    const qY = height + (margin + 96);
    _context.fillText(quote, qX, qY, width);

    _context.save();

    const iX = margin + 16;
    const iY = height + (margin + 16);
    const iW = 48;
    const iH = iW;
    _context.beginPath();
    _context.arc(iX + (iW / 2), iY + (iH / 2), iW / 2, 0, 2 * Math.PI);
    _context.clip();
    _context.drawImage(this.data.userInfo.picturePath, iX, iY, iW, iH);

    _context.restore();

    _context.draw();
    this.setData!({
      isCanvas: true,
    })
  },
})
