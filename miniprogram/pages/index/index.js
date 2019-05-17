"use strict";

import { calPictureSize, formatTime } from "../../utils/util";

Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
Page({
    data: {
        buttonStatus: 0, // 0: postcards.length === 0 1: postcards.length > 0
        status: 'idle',
        postcard: {
            width: 0,
            height: 0,
        },
        postcards: [],
        canvasConfig: {
            width: 0,
            height: 0,
        },
        context: null,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isEditting: false,
    },
    handleTouchStart() {},
    handleTouchMove() {},
    handleTouchEnd() {},
    handleTouchCancel() {},
    getPicture() {
        const self = this;
        wx.showLoading({
            title: "努力加载ing…"
        });
        wx.downloadFile({
            url: self.data.userInfo.avatarUrl,
            success(res) {
                wx.hideLoading();
                self.drawPostCard(res.tempFilePath);
            },
            fail() {
                wx.hideLoading();
                wx.showModal({
                    title: "出了一 .. 小问题",
                    content: "可能是网络的小问题，再次尝试一下吧!"
                });
            }
        });
    },
    addPostCard() {
        const self = this;
        wx.vibrateShort();
        wx.chooseImage({
            count: 1,
            sourceType: ["album", "camera"],
            sizeType: ["original", "compressed"],
            success: res => {
                if (res.tempFiles.length <= 0) return;
                const url = res.tempFiles[0].path;
                wx.getImageInfo({
                    src: url,
                    success: data => {
                        const { width, height, origin } = calPictureSize(
                            self.data.canvasConfig,
                            data
                        );
                        data.width = width;
                        data.height = height;
                        data.origin = origin;
                        self.setData({
                            status: 'start',
                            postcard: data
                        });
                        self.getPicture();
                        //self.drawPostCard();
                    }
                });
            }
        });
    },
    drawPostCard(avatarUrl) {
        if (!this.data.postcard) return;
        const blur = 8;
        let context = this.data.context;
        context.fillStyle = "#fefefe";
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = "#999999";
        context.shadowBlur = blur;
        const rectW = this.data.canvasConfig.width - blur * 2;
        const rectH = this.data.canvasConfig.height - blur * 2;
        context.fillRect(8, 8, rectW, rectH);
        const margin = 28;
        const x = margin;
        const y = margin;
        const width = this.data.postcard.width - margin * 2;
        const height = this.data.postcard.height - margin * 2;
        const isLandscape = this.data.postcard.origin === 'landscape';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
        if (isLandscape) {
            context.rotate(90 * Math.PI / 180);
            const offsetMargin = isLandscape ? rectW + 16 : 0;
            context.drawImage(this.data.postcard.path, x, y - offsetMargin, width, height);
            context.rotate(-90 * Math.PI / 180);
        } else {
            context.drawImage(this.data.postcard.path, x , y, width, height);
        }
        context.fillStyle = "#333333";
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowBlur = 2;
        context.setFontSize(18);
        const tX = isLandscape ? height - (margin + 24) : width - (margin + 24);
        const tY = isLandscape ? width + 80 : height + 80;
        context.fillText(`── ${this.data.userInfo.nickName}`, tX, tY, 100);
        const quotes = [
            "早放学，早回家!",
            "吃饭、睡觉、撸猫",
            "Beauty is found within."
        ];
        const index = parseInt(Math.random() * quotes.length, 0);
        const quote = quotes[index];
        const qX = margin;
        const qY = isLandscape ? width + (margin + 96) : height + (margin + 96);
        context.fillText(quote, qX, qY, width);
        context.save();
        const iX = margin + 16;
        const iY = isLandscape ? width + (margin + 16) : height + (margin + 16);
        const iW = 48;
        const iH = iW;
        context.beginPath();
        context.arc(iX + iW / 2, iY + iH / 2, iW / 2, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(avatarUrl, iX , iY, iW, iH);
        context.restore();
        context.draw();
    },
    cancelSavePicture() {
        wx.vibrateShort();
        wx.hideLoading();
        this.setData({ status: 'idle' });
    },
    setPostcards(path) {
        const postcardList = this.data.postcards || [];
        const currentTime = formatTime(new Date());
        const postcardItem = {
            createAt: currentTime,
            url: path,
        }
        try {
            postcardList.push(postcardItem);
            this.setData({ postcards: postcardList });
            wx.setStorageSync('postcards', postcardList);
        } catch (e) {
            wx.showModal({
                title: "出了一 .. 小问题",
                content: "再次尝试一下吧!"
            });
          //
        }
    },
    savePicture() {
        wx.vibrateShort();
        const self = this;
        const margin = 0;
        const xValue = margin;
        const yValue = margin;
        const canvasWidth = this.data.canvasConfig.width;
        const canvasHeight = this.data.canvasConfig.height;
        wx.canvasToTempFilePath({
            x: xValue,
            y: yValue,
            width: canvasWidth,
            height: canvasHeight,
            destWidth: canvasWidth * 2,
            destHeight: canvasHeight * 2,
            canvasId: "canvas",
            success(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: () => {
                        wx.showToast({
                            title: "保存成功!",
                            icon: "success"
                        });
                        setTimeout(() => {
                            self.setData({ status: 'idle' })
                        }, 300);
                        self.setPostcards(res.tempFilePath);
                    }
                });
            }
        });
    },
    deletePostCard() {
        wx.vibrateShort();
        const postcardList = this.data.postcards.filter(item => !item.checked);
        wx.setStorageSync('postcards', postcardList);
        this.setData({
            isEditting: false,
            postcards: postcardList,
        });
    },
    cancelEditting() {
        wx.vibrateShort();
        const postcardList = this.data.postcards.map(item => {
            item.checked = false;
            return item;
        });
        this.setData({
            isEditting: false,
            postcards: postcardList,
        });
    },
    onClickListener(event) {
        wx.vibrateShort();
        if (this.data.isEditting) {
            const postcard = event.currentTarget.dataset.postcard;
            const postcardList = this.data.postcards.map(item => {
                if (postcard.url === item.url) {
                    item.checked = !item.checked;
                }
             return item;
            });
            this.setData({postcards: postcardList});
        } else {
            const postcard = event.currentTarget.dataset.postcard;
            const urlList = this.data.postcards.map(item => item.url);
            wx.previewImage({
                current: postcard.url, // 当前显示图片的http链接
                urls: urlList // 需要预览的图片http链接列表
              })
        }
    },
    onLongClickListener() {
        wx.vibrateShort();
        this.setData({isEditting: true});
    },
    onLoad: function() {
        const list = wx.getStorageSync('postcards');
        const systemInfo = wx.getSystemInfoSync();
        const canvas = {
            width: 0,
            height: 0
        };
        canvas.width = systemInfo.windowWidth - 8;
        canvas.height = systemInfo.windowHeight - 78;
        const context = wx.createCanvasContext("canvas");
        this.setData({
            postcards: list,
            context: context,
            canvasConfig: canvas
        });
        const _this = this;
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else if (this.data.canIUse) {
            app.userInfoReadyCallback = function(res) {
                _this.setData({
                    userInfo: res,
                    hasUserInfo: true
                });
            };
        } else {
            wx.getUserInfo({
                success: function(res) {
                    app.globalData.userInfo = res.userInfo;
                    _this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            });
        }
    },
});
