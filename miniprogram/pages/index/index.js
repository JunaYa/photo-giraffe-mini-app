"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../utils/util");
const app = getApp();
let _context = null;
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
            this.setData({
                userInfo: Object.assign({}, app.globalData.userInfo, { picturePath: '' }),
                hasUserInfo: true,
            });
        }
        else if (this.data.canIUse) {
            app.userInfoReadyCallback = (res) => {
                this.setData({
                    userInfo: res,
                    hasUserInfo: true
                });
            };
        }
        else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: Object.assign({}, res.userInfo, { picturePath: '' }),
                        hasUserInfo: true
                    });
                }
            });
        }
    },
    onShow() {
        _context = wx.createCanvasContext('canvas');
    },
    getUserInfo(info) {
        wx.vibrateShort();
        const user = info.mp.detail.userInfo;
        this.getPicture(user.avatarUrl).then((picturePath) => {
            user.picturePath = picturePath;
            this.data.userInfo = user;
            this.addPostCard();
        });
    },
    getPicture(avatarUrl) {
        wx.showLoading({
            title: '努力加载ing…',
        });
        return new Promise((resolve) => {
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
        util_1.selectPicture().then((info) => {
            const { width, height, } = util_1.calPictureSize(this.data.canvasConfig, info);
            this.setData({
                postcard: Object.assign({}, info, { width: width, height: height })
            });
        });
    },
    cancelSavePicture() {
        wx.vibrateShort();
        this.setData({
            isCanvas: false
        });
    },
    savePicture() {
        wx.vibrateShort();
    },
    drawPostCard() {
        if (!this.data.postcard)
            return;
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
        this.setData({
            isCanvas: true,
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDJDQUkwQjtBQUUxQixNQUFNLEdBQUcsR0FBRyxNQUFNLEVBQWMsQ0FBQTtBQUVoQyxJQUFJLFFBQVEsR0FBTyxJQUFJLENBQUE7QUFFdkIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLEVBQUU7WUFDWixXQUFXLEVBQUUsRUFBRTtTQUNoQjtRQUNELFdBQVcsRUFBRSxLQUFLO1FBQ2xCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELFlBQVksRUFBRTtZQUNaLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7U0FDVjtRQUNELE1BQU0sRUFBRSxNQUFNO1FBQ2QsVUFBVSxFQUFFLEtBQUs7UUFDakIsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLEVBQUU7WUFDUixLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1NBQ1Y7S0FDRjtJQUVELE1BQU07UUFDSixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRTdELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixRQUFRLG9CQUNILEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxJQUMxQixXQUFXLEVBQUUsRUFBRSxHQUNoQjtnQkFDRCxXQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUE7U0FDSDthQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUM7WUFHM0IsR0FBRyxDQUFDLHFCQUFxQixHQUFHLENBQUMsR0FBUSxFQUFFLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osUUFBUSxFQUFFLEdBQUc7b0JBQ2IsV0FBVyxFQUFFLElBQUk7aUJBQ2xCLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQTtTQUNGO2FBQU07WUFFTCxFQUFFLENBQUMsV0FBVyxDQUFDO2dCQUNiLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRTtvQkFDYixHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFBO29CQUN0QyxJQUFJLENBQUMsT0FBUSxDQUFDO3dCQUNaLFFBQVEsb0JBQ0gsR0FBRyxDQUFDLFFBQVEsSUFDZixXQUFXLEVBQUUsRUFBRSxHQUNoQjt3QkFDRCxXQUFXLEVBQUUsSUFBSTtxQkFDbEIsQ0FBQyxDQUFBO2dCQUNKLENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osUUFBUSxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsV0FBVyxDQUFDLElBQVM7UUFDbkIsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFtQixFQUFFLEVBQUU7WUFDM0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVLENBQUMsU0FBaUI7UUFDMUIsRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUNiLEtBQUssRUFBRSxVQUFVO1NBQ2xCLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFZLEVBQUUsRUFBRTtZQUNsQyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUNkLEdBQUcsRUFBRSxTQUFTO2dCQUNkLE9BQU8sQ0FBQyxHQUFHO29CQUNULEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDNUIsQ0FBQztnQkFDRCxJQUFJO29CQUNGLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDakIsRUFBRSxDQUFDLFNBQVMsQ0FBQzt3QkFDWCxLQUFLLEVBQUUsWUFBWTt3QkFDbkIsT0FBTyxFQUFFLG9CQUFvQjtxQkFDOUIsQ0FBQyxDQUFDO2dCQUNMLENBQUM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2xCLG9CQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTtZQUNqQyxNQUFNLEVBQ0osS0FBSyxFQUNMLE1BQU0sR0FDUCxHQUFHLHFCQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixRQUFRLG9CQUNILElBQUksSUFDUCxLQUFLLEVBQUUsS0FBSyxFQUNaLE1BQU0sRUFBRSxNQUFNLEdBQ2Y7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxpQkFBaUI7UUFDZixFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNaLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxXQUFXO1FBQ1QsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBbUNwQixDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPO1FBRWhDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNmLFFBQVEsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQy9CLFFBQVEsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLFFBQVEsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLFFBQVEsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1FBQ2pDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRTNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0QyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDbEIsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3hELFFBQVEsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLFFBQVEsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWpFLFFBQVEsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBRS9CLFFBQVEsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLFFBQVEsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFekIsTUFBTSxFQUFFLEdBQUcsS0FBSyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sRUFBRSxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDdkIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEUsTUFBTSxNQUFNLEdBQUc7WUFDYixVQUFVO1lBQ1YsVUFBVTtZQUNWLHlCQUF5QjtTQUMxQixDQUFDO1FBRUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDNUMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQztRQUNsQixNQUFNLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFaEIsTUFBTSxFQUFFLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUN2QixNQUFNLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2QsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2QsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVuRSxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFbkIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL2luZGV4LmpzXG4vL+iOt+WPluW6lOeUqOWunuS+i1xuXG5pbXBvcnQge1xuICBjYWxQaWN0dXJlU2l6ZSxcbiAgc2VsZWN0UGljdHVyZSxcbiAgLy8gc2V0UG9zdGNhcmRzLFxufSBmcm9tICcuLi8uLi91dGlscy91dGlsJztcblxuY29uc3QgYXBwID0gZ2V0QXBwPElBcHBPcHRpb24+KClcblxubGV0IF9jb250ZXh0OmFueSA9IG51bGxcblxuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICB1c2VySW5mbzoge1xuICAgICAgbmlja05hbWU6ICcnLFxuICAgICAgcGljdHVyZVBhdGg6ICcnLFxuICAgIH0sXG4gICAgaGFzVXNlckluZm86IGZhbHNlLFxuICAgIGNhbklVc2U6IHd4LmNhbklVc2UoJ2J1dHRvbi5vcGVuLXR5cGUuZ2V0VXNlckluZm8nKSxcbiAgICBjYW52YXNDb25maWc6IHtcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgIH0sXG4gICAgc3RhdHVzOiAnaWRsZScsXG4gICAgaXNFZGl0dGluZzogZmFsc2UsXG4gICAgcG9zdGNhcmQ6IHtcbiAgICAgIHBhdGg6ICcnLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgfSxcbiAgfSxcblxuICBvbkxvYWQoKSB7XG4gICAgY29uc3Qgc3lzdGVtSW5mbyA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCk7XG4gICAgdGhpcy5kYXRhLmNhbnZhc0NvbmZpZy53aWR0aCA9IHN5c3RlbUluZm8ud2luZG93V2lkdGggLSA4O1xuICAgIHRoaXMuZGF0YS5jYW52YXNDb25maWcuaGVpZ2h0ID0gc3lzdGVtSW5mby53aW5kb3dIZWlnaHQgLSA2NDtcblxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS51c2VySW5mbykge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIHVzZXJJbmZvOiB7XG4gICAgICAgICAgLi4uYXBwLmdsb2JhbERhdGEudXNlckluZm8sXG4gICAgICAgICAgcGljdHVyZVBhdGg6ICcnLFxuICAgICAgICB9LFxuICAgICAgICBoYXNVc2VySW5mbzogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmICh0aGlzLmRhdGEuY2FuSVVzZSl7XG4gICAgICAvLyDnlLHkuo4gZ2V0VXNlckluZm8g5piv572R57uc6K+35rGC77yM5Y+v6IO95Lya5ZyoIFBhZ2Uub25Mb2FkIOS5i+WQjuaJjei/lOWbnlxuICAgICAgLy8g5omA5Lul5q2k5aSE5Yqg5YWlIGNhbGxiYWNrIOS7pemYsuatoui/meenjeaDheWGtVxuICAgICAgYXBwLnVzZXJJbmZvUmVhZHlDYWxsYmFjayA9IChyZXM6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICB1c2VySW5mbzogcmVzLFxuICAgICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOWcqOayoeaciSBvcGVuLXR5cGU9Z2V0VXNlckluZm8g54mI5pys55qE5YW85a655aSE55CGXG4gICAgICB3eC5nZXRVc2VySW5mbyh7XG4gICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgYXBwLmdsb2JhbERhdGEudXNlckluZm8gPSByZXMudXNlckluZm9cbiAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHVzZXJJbmZvOiB7XG4gICAgICAgICAgICAgIC4uLnJlcy51c2VySW5mbyxcbiAgICAgICAgICAgICAgcGljdHVyZVBhdGg6ICcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgb25TaG93KCkge1xuICAgIF9jb250ZXh0ID0gd3guY3JlYXRlQ2FudmFzQ29udGV4dCgnY2FudmFzJyk7XG4gIH0sXG5cbiAgZ2V0VXNlckluZm8oaW5mbzogYW55KTp2b2lkIHtcbiAgICB3eC52aWJyYXRlU2hvcnQoKTtcbiAgICBjb25zdCB1c2VyID0gaW5mby5tcC5kZXRhaWwudXNlckluZm87XG4gICAgdGhpcy5nZXRQaWN0dXJlKHVzZXIuYXZhdGFyVXJsKS50aGVuKChwaWN0dXJlUGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICB1c2VyLnBpY3R1cmVQYXRoID0gcGljdHVyZVBhdGg7XG4gICAgICB0aGlzLmRhdGEudXNlckluZm8gPSB1c2VyO1xuICAgICAgdGhpcy5hZGRQb3N0Q2FyZCgpO1xuICAgIH0pO1xuICB9LFxuXG4gIGdldFBpY3R1cmUoYXZhdGFyVXJsOiBzdHJpbmcpOmFueSB7XG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICfliqrlipvliqDovb1pbmfigKYnLFxuICAgIH0pO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55KSA9PiB7XG4gICAgICB3eC5kb3dubG9hZEZpbGUoe1xuICAgICAgICB1cmw6IGF2YXRhclVybCxcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xuICAgICAgICAgIHJlc29sdmUocmVzLnRlbXBGaWxlUGF0aCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWwoKSB7XG4gICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICflh7rkuobkuIAgLi4g5bCP6Zeu6aKYJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICflj6/og73mmK/nvZHnu5znmoTlsI/pl67popjvvIzlho3mrKHlsJ3or5XkuIDkuIvlkKchJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIGFkZFBvc3RDYXJkKCkge1xuICAgIHd4LnZpYnJhdGVTaG9ydCgpO1xuICAgIHNlbGVjdFBpY3R1cmUoKS50aGVuKChpbmZvOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgIH0gPSBjYWxQaWN0dXJlU2l6ZSh0aGlzLmRhdGEuY2FudmFzQ29uZmlnLCBpbmZvKTtcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICBwb3N0Y2FyZDoge1xuICAgICAgICAgIC4uLmluZm8sXG4gICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pO1xuICB9LFxuXG4gIGNhbmNlbFNhdmVQaWN0dXJlKCkge1xuICAgIHd4LnZpYnJhdGVTaG9ydCgpO1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgaXNDYW52YXM6IGZhbHNlXG4gICAgfSlcbiAgfSxcblxuICBzYXZlUGljdHVyZSgpIHtcbiAgICB3eC52aWJyYXRlU2hvcnQoKTtcbiAgICAvLyBjb25zdCBtYXJnaW4gPSAwO1xuICAgIC8vIGNvbnN0IHhWYWx1ZSA9IG1hcmdpbjtcbiAgICAvLyBjb25zdCB5VmFsdWUgPSBtYXJnaW47XG4gICAgLy8gY29uc3QgY2FudmFzV2lkdGggPSB0aGlzLmRhdGEuY2FudmFzQ29uZmlnLndpZHRoO1xuICAgIC8vIGNvbnN0IGNhbnZhc0hlaWdodCA9IHRoaXMuZGF0YS5jYW52YXNDb25maWcuaGVpZ2h0O1xuXG4gICAgLy8gY29uc3Qgb3B0aW9uOiBDYW52YXNUb1RlbXBGaWxlUGF0aE9wdGlvbiA9IHtcbiAgICAvLyAgIGNhbnZhc0lkOiAnY2FudmFzJyxcbiAgICAvLyAgIHF1YWxpdHk6IDEwLFxuICAgIC8vICAgeDogeFZhbHVlLFxuICAgIC8vICAgeTogeVZhbHVlLFxuICAgIC8vICAgd2lkdGg6IGNhbnZhc1dpZHRoLFxuICAgIC8vICAgaGVpZ2h0OiBjYW52YXNIZWlnaHQsXG4gICAgLy8gICBkZXN0V2lkdGg6IGNhbnZhc1dpZHRoICogMixcbiAgICAvLyAgIGRlc3RIZWlnaHQ6IGNhbnZhc0hlaWdodCAqIDIsXG4gICAgLy8gICBzdWNjZXNzOiAocmVzOiBhbnkpID0+IHtcbiAgICAvLyAgICAgd3guc2F2ZUltYWdlVG9QaG90b3NBbGJ1bSh7XG4gICAgLy8gICAgICAgZmlsZVBhdGg6IHJlcy50ZW1wRmlsZVBhdGgsXG4gICAgLy8gICAgICAgc3VjY2VzczogKCkgPT4ge1xuICAgIC8vICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAvLyAgICAgICAgICAgdGl0bGU6ICfkv53lrZjmiJDlip8hJyxcbiAgICAvLyAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAvLyAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgLy8gICAgICAgICAgICAgaXNDYW52YXM6IGZhbHNlLFxuICAgIC8vICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgfSwgMzAwKTtcbiAgICAvLyAgICAgICAgIHNldFBvc3RjYXJkcyhyZXMudGVtcEZpbGVQYXRoKTtcbiAgICAvLyAgICAgICB9LFxuICAgIC8vICAgICB9KTtcbiAgICAvLyAgIH0sXG4gICAgLy8gfVxuICAgIFxuICB9LFxuXG4gIGRyYXdQb3N0Q2FyZCgpIHtcbiAgICBpZiAoIXRoaXMuZGF0YS5wb3N0Y2FyZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgYmx1ciA9IDg7XG4gICAgX2NvbnRleHQuZmlsbFN0eWxlID0gJyNmZWZlZmUnO1xuICAgIF9jb250ZXh0LnNoYWRvd09mZnNldFggPSAyO1xuICAgIF9jb250ZXh0LnNoYWRvd09mZnNldFkgPSAyO1xuICAgIF9jb250ZXh0LnNoYWRvd0NvbG9yID0gJyM5OTk5OTknO1xuICAgIF9jb250ZXh0LnNoYWRvd0JsdXIgPSBibHVyO1xuXG4gICAgY29uc3QgcmVjdFcgPSB0aGlzLmRhdGEuY2FudmFzQ29uZmlnLndpZHRoIC0gKGJsdXIgKiAyKTtcbiAgICBjb25zdCByZWN0SCA9IHRoaXMuZGF0YS5jYW52YXNDb25maWcuaGVpZ2h0IC0gKGJsdXIgKiAyKTtcbiAgICBfY29udGV4dC5maWxsUmVjdCg4LCA4LCByZWN0VywgcmVjdEgpO1xuXG4gICAgY29uc3QgbWFyZ2luID0gMjg7XG4gICAgY29uc3QgeCA9IG1hcmdpbjtcbiAgICBjb25zdCB5ID0gbWFyZ2luO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5kYXRhLnBvc3RjYXJkLndpZHRoIC0gKG1hcmdpbiAqIDIpO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZGF0YS5wb3N0Y2FyZC5oZWlnaHQgLSAobWFyZ2luICogMik7XG4gICAgX2NvbnRleHQuc2hhZG93T2Zmc2V0WCA9IDA7XG4gICAgX2NvbnRleHQuc2hhZG93T2Zmc2V0WSA9IDA7XG4gICAgX2NvbnRleHQuc2hhZG93Qmx1ciA9IDA7XG4gICAgX2NvbnRleHQuZHJhd0ltYWdlKHRoaXMuZGF0YS5wb3N0Y2FyZC5wYXRoLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIF9jb250ZXh0LmZpbGxTdHlsZSA9ICcjMzMzMzMzJztcblxuICAgIF9jb250ZXh0LnNoYWRvd09mZnNldFggPSAyO1xuICAgIF9jb250ZXh0LnNoYWRvd09mZnNldFkgPSAyO1xuICAgIF9jb250ZXh0LnNoYWRvd0JsdXIgPSAyO1xuICAgIF9jb250ZXh0LnNldEZvbnRTaXplKDE4KTtcblxuICAgIGNvbnN0IHRYID0gd2lkdGggLSAobWFyZ2luICsgMjQpO1xuICAgIGNvbnN0IHRZID0gaGVpZ2h0ICsgODA7XG4gICAgX2NvbnRleHQuZmlsbFRleHQoYOKUgOKUgCAke3RoaXMuZGF0YS51c2VySW5mby5uaWNrTmFtZX1gLCB0WCwgdFksIDEwMCk7XG4gICAgY29uc3QgcXVvdGVzID0gW1xuICAgICAgJ+aXqeaUvuWtpu+8jOaXqeWbnuWutiEnLFxuICAgICAgJ+WQg+mlreOAgeedoeinieOAgeaSuOeMqycsXG4gICAgICAnQmVhdXR5IGlzIGZvdW5kIHdpdGhpbi4nLFxuICAgIF07XG5cbiAgICBjb25zdCBpbmRleCA9IE1hdGgucmFuZG9tKCkgKiBxdW90ZXMubGVuZ3RoO1xuICAgIGNvbnN0IHF1b3RlID0gcXVvdGVzW2luZGV4XTtcbiAgICBjb25zdCBxWCA9IG1hcmdpbjtcbiAgICBjb25zdCBxWSA9IGhlaWdodCArIChtYXJnaW4gKyA5Nik7XG4gICAgX2NvbnRleHQuZmlsbFRleHQocXVvdGUsIHFYLCBxWSwgd2lkdGgpO1xuXG4gICAgX2NvbnRleHQuc2F2ZSgpO1xuXG4gICAgY29uc3QgaVggPSBtYXJnaW4gKyAxNjtcbiAgICBjb25zdCBpWSA9IGhlaWdodCArIChtYXJnaW4gKyAxNik7XG4gICAgY29uc3QgaVcgPSA0ODtcbiAgICBjb25zdCBpSCA9IGlXO1xuICAgIF9jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIF9jb250ZXh0LmFyYyhpWCArIChpVyAvIDIpLCBpWSArIChpSCAvIDIpLCBpVyAvIDIsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICBfY29udGV4dC5jbGlwKCk7XG4gICAgX2NvbnRleHQuZHJhd0ltYWdlKHRoaXMuZGF0YS51c2VySW5mby5waWN0dXJlUGF0aCwgaVgsIGlZLCBpVywgaUgpO1xuXG4gICAgX2NvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgX2NvbnRleHQuZHJhdygpO1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgaXNDYW52YXM6IHRydWUsXG4gICAgfSlcbiAgfSxcbn0pXG4iXX0=