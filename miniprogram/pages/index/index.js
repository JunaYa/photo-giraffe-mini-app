"use strict";

import { calPictureSize } from "../../utils/util";

Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
Page({
    data: {
        status: 'idle',
        postcard: {
            width: 0,
            height: 0,
        },
        canvasConfig: {
            width: 0,
            height: 0,
        },
        context: null,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
                        const { width, height } = calPictureSize(
                            self.data.canvasConfig,
                            data
                        );
                        data.width = width;
                        data.height = height;
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
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
        context.drawImage(this.data.postcard.path, x, y, width, height);
        context.fillStyle = "#333333";
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowBlur = 2;
        context.setFontSize(18);
        const tX = width - (margin + 24);
        const tY = height + 80;
        context.fillText(`── ${this.data.userInfo.nickName}`, tX, tY, 100);
        const quotes = [
            "早放学，早回家!",
            "吃饭、睡觉、撸猫",
            "Beauty is found within."
        ];
        const index = parseInt(Math.random() * quotes.length, 0);
        const quote = quotes[index];
        const qX = margin;
        const qY = height + (margin + 96);
        context.fillText(quote, qX, qY, width);
        context.save();
        const iX = margin + 16;
        const iY = height + (margin + 16);
        const iW = 48;
        const iH = iW;
        context.beginPath();
        context.arc(iX + iW / 2, iY + iH / 2, iW / 2, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(avatarUrl, iX, iY, iW, iH);
        context.restore();
        context.draw();
    },
    cancelSavePicture() {
        wx.vibrateShort();
        this.setData({ status: 'idle' });
    },
    setPostcards(path) {
        const postcards = getPostcards();
        postcards.push(path);
        try {
          wx.setStorageSync('postcards', postcards);
          this.setData({ status: 'completed' });
        } catch (e) {
          //
        }
    },
    savePicture() {
        wx.vibrateShort();
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
                            this.setData({ status: 'idle' })
                        }, 300);
                        setPostcards(res.tempFilePath);
                    }
                });
            }
        });
    },
    onLoad: function() {
        const systemInfo = wx.getSystemInfoSync();
        const canvas = {
            width: 0,
            height: 0
        };
        canvas.width = systemInfo.windowWidth - 8;
        canvas.height = systemInfo.windowHeight - 78;
        const context = wx.createCanvasContext("canvas");
        this.setData({
            context: context,
            canvasConfig: canvas
        });
        var _this = this;
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
