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
                userInfo: app.globalData.userInfo,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDJDQUkwQjtBQUUxQixNQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUU1QixJQUFJLFFBQVEsR0FBTyxJQUFJLENBQUE7QUFFdkIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLEVBQUU7WUFDWixXQUFXLEVBQUUsRUFBRTtTQUNoQjtRQUNELFdBQVcsRUFBRSxLQUFLO1FBQ2xCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELFlBQVksRUFBRTtZQUNaLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7U0FDVjtRQUNELE1BQU0sRUFBRSxNQUFNO1FBQ2QsVUFBVSxFQUFFLEtBQUs7UUFDakIsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLEVBQUU7WUFDUixLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1NBQ1Y7S0FDRjtJQUVELE1BQU07UUFDSixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRTdELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixRQUFRLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRO2dCQUNqQyxXQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUE7U0FDSDthQUFNLElBQUksSUFBSSxDQUFD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SSxFQUFFLENBQUM7UUFFaEIsTUFBTSxFQUFFLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUN2QixNQUFNLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2QsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2QsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVuRSxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFbkIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL2luZGV4LmpzXG4vL+iOt+WPluW6lOeUqOWunuS+i1xuaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xuaW1wb3J0IHtcbiAgY2FsUGljdHVyZVNpemUsXG4gIHNlbGVjdFBpY3R1cmUsXG4gIC8vIHNldFBvc3RjYXJkcyxcbn0gZnJvbSAnLi4vLi4vdXRpbHMvdXRpbCc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcblxubGV0IF9jb250ZXh0OmFueSA9IG51bGxcblxuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICB1c2VySW5mbzoge1xuICAgICAgbmlja05hbWU6ICcnLFxuICAgICAgcGljdHVyZVBhdGg6ICcnLFxuICAgIH0sXG4gICAgaGFzVXNlckluZm86IGZhbHNlLFxuICAgIGNhbklVc2U6IHd4LmNhbklVc2UoJ2J1dHRvbi5vcGVuLXR5cGUuZ2V0VXNlckluZm8nKSxcbiAgICBjYW52YXNDb25maWc6IHtcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgIH0sXG4gICAgc3RhdHVzOiAnaWRsZScsXG4gICAgaXNFZGl0dGluZzogZmFsc2UsXG4gICAgcG9zdGNhcmQ6IHtcbiAgICAgIHBhdGg6ICcnLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgfSxcbiAgfSxcblxuICBvbkxvYWQoKSB7XG4gICAgY29uc3Qgc3lzdGVtSW5mbyA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCk7XG4gICAgdGhpcy5kYXRhLmNhbnZhc0NvbmZpZy53aWR0aCA9IHN5c3RlbUluZm8ud2luZG93V2lkdGggLSA4O1xuICAgIHRoaXMuZGF0YS5jYW52YXNDb25maWcuaGVpZ2h0ID0gc3lzdGVtSW5mby53aW5kb3dIZWlnaHQgLSA2NDtcblxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS51c2VySW5mbykge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIHVzZXJJbmZvOiBhcHAuZ2xvYmFsRGF0YS51c2VySW5mbyxcbiAgICAgICAgaGFzVXNlckluZm86IHRydWUsXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhLmNhbklVc2Upe1xuICAgICAgLy8g55Sx5LqOIGdldFVzZXJJbmZvIOaYr+e9kee7nOivt+axgu+8jOWPr+iDveS8muWcqCBQYWdlLm9uTG9hZCDkuYvlkI7miY3ov5Tlm55cbiAgICAgIC8vIOaJgOS7peatpOWkhOWKoOWFpSBjYWxsYmFjayDku6XpmLLmraLov5nnp43mg4XlhrVcbiAgICAgIGFwcC51c2VySW5mb1JlYWR5Q2FsbGJhY2sgPSAocmVzKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgIHVzZXJJbmZvOiByZXMsXG4gICAgICAgICAgaGFzVXNlckluZm86IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5Zyo5rKh5pyJIG9wZW4tdHlwZT1nZXRVc2VySW5mbyDniYjmnKznmoTlhbzlrrnlpITnkIZcbiAgICAgIHd4LmdldFVzZXJJbmZvKHtcbiAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mb1xuICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgdXNlckluZm86IHtcbiAgICAgICAgICAgICAgLi4ucmVzLnVzZXJJbmZvLFxuICAgICAgICAgICAgICBwaWN0dXJlUGF0aDogJycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFzVXNlckluZm86IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBvblNob3coKSB7XG4gICAgX2NvbnRleHQgPSB3eC5jcmVhdGVDYW52YXNDb250ZXh0KCdjYW52YXMnKTtcbiAgfSxcblxuICBnZXRVc2VySW5mbyhpbmZvOiBhbnkpOnZvaWQge1xuICAgIHd4LnZpYnJhdGVTaG9ydCgpO1xuICAgIGNvbnN0IHVzZXIgPSBpbmZvLm1wLmRldGFpbC51c2VySW5mbztcbiAgICB0aGlzLmdldFBpY3R1cmUodXNlci5hdmF0YXJVcmwpLnRoZW4oKHBpY3R1cmVQYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgIHVzZXIucGljdHVyZVBhdGggPSBwaWN0dXJlUGF0aDtcbiAgICAgIHRoaXMuZGF0YS51c2VySW5mbyA9IHVzZXI7XG4gICAgICB0aGlzLmFkZFBvc3RDYXJkKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0UGljdHVyZShhdmF0YXJVcmw6IHN0cmluZyk6YW55IHtcbiAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICB0aXRsZTogJ+WKquWKm+WKoOi9vWluZ+KApicsXG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnkpID0+IHtcbiAgICAgIHd4LmRvd25sb2FkRmlsZSh7XG4gICAgICAgIHVybDogYXZhdGFyVXJsLFxuICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgcmVzb2x2ZShyZXMudGVtcEZpbGVQYXRoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbCgpIHtcbiAgICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+WHuuS6huS4gCAuLiDlsI/pl67popgnLFxuICAgICAgICAgICAgY29udGVudDogJ+WPr+iDveaYr+e9kee7nOeahOWwj+mXrumimO+8jOWGjeasoeWwneivleS4gOS4i+WQpyEnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgYWRkUG9zdENhcmQoKSB7XG4gICAgd3gudmlicmF0ZVNob3J0KCk7XG4gICAgc2VsZWN0UGljdHVyZSgpLnRoZW4oKGluZm86IGFueSkgPT4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgfSA9IGNhbFBpY3R1cmVTaXplKHRoaXMuZGF0YS5jYW52YXNDb25maWcsIGluZm8pO1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIHBvc3RjYXJkOiB7XG4gICAgICAgICAgLi4uaW5mbyxcbiAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSk7XG4gIH0sXG5cbiAgY2FuY2VsU2F2ZVBpY3R1cmUoKSB7XG4gICAgd3gudmlicmF0ZVNob3J0KCk7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBpc0NhbnZhczogZmFsc2VcbiAgICB9KVxuICB9LFxuXG4gIHNhdmVQaWN0dXJlKCkge1xuICAgIHd4LnZpYnJhdGVTaG9ydCgpO1xuICAgIC8vIGNvbnN0IG1hcmdpbiA9IDA7XG4gICAgLy8gY29uc3QgeFZhbHVlID0gbWFyZ2luO1xuICAgIC8vIGNvbnN0IHlWYWx1ZSA9IG1hcmdpbjtcbiAgICAvLyBjb25zdCBjYW52YXNXaWR0aCA9IHRoaXMuZGF0YS5jYW52YXNDb25maWcud2lkdGg7XG4gICAgLy8gY29uc3QgY2FudmFzSGVpZ2h0ID0gdGhpcy5kYXRhLmNhbnZhc0NvbmZpZy5oZWlnaHQ7XG5cbiAgICAvLyBjb25zdCBvcHRpb246IENhbnZhc1RvVGVtcEZpbGVQYXRoT3B0aW9uID0ge1xuICAgIC8vICAgY2FudmFzSWQ6ICdjYW52YXMnLFxuICAgIC8vICAgcXVhbGl0eTogMTAsXG4gICAgLy8gICB4OiB4VmFsdWUsXG4gICAgLy8gICB5OiB5VmFsdWUsXG4gICAgLy8gICB3aWR0aDogY2FudmFzV2lkdGgsXG4gICAgLy8gICBoZWlnaHQ6IGNhbnZhc0hlaWdodCxcbiAgICAvLyAgIGRlc3RXaWR0aDogY2FudmFzV2lkdGggKiAyLFxuICAgIC8vICAgZGVzdEhlaWdodDogY2FudmFzSGVpZ2h0ICogMixcbiAgICAvLyAgIHN1Y2Nlc3M6IChyZXM6IGFueSkgPT4ge1xuICAgIC8vICAgICB3eC5zYXZlSW1hZ2VUb1Bob3Rvc0FsYnVtKHtcbiAgICAvLyAgICAgICBmaWxlUGF0aDogcmVzLnRlbXBGaWxlUGF0aCxcbiAgICAvLyAgICAgICBzdWNjZXNzOiAoKSA9PiB7XG4gICAgLy8gICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgIC8vICAgICAgICAgICB0aXRsZTogJ+S/neWtmOaIkOWKnyEnLFxuICAgIC8vICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIC8vICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAvLyAgICAgICAgICAgICBpc0NhbnZhczogZmFsc2UsXG4gICAgLy8gICAgICAgICAgIH0pXG4gICAgLy8gICAgICAgICB9LCAzMDApO1xuICAgIC8vICAgICAgICAgc2V0UG9zdGNhcmRzKHJlcy50ZW1wRmlsZVBhdGgpO1xuICAgIC8vICAgICAgIH0sXG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgfSxcbiAgICAvLyB9XG4gICAgXG4gIH0sXG5cbiAgZHJhd1Bvc3RDYXJkKCkge1xuICAgIGlmICghdGhpcy5kYXRhLnBvc3RjYXJkKSByZXR1cm47XG5cbiAgICBjb25zdCBibHVyID0gODtcbiAgICBfY29udGV4dC5maWxsU3R5bGUgPSAnI2ZlZmVmZSc7XG4gICAgX2NvbnRleHQuc2hhZG93T2Zmc2V0WCA9IDI7XG4gICAgX2NvbnRleHQuc2hhZG93T2Zmc2V0WSA9IDI7XG4gICAgX2NvbnRleHQuc2hhZG93Q29sb3IgPSAnIzk5OTk5OSc7XG4gICAgX2NvbnRleHQuc2hhZG93Qmx1ciA9IGJsdXI7XG5cbiAgICBjb25zdCByZWN0VyA9IHRoaXMuZGF0YS5jYW52YXNDb25maWcud2lkdGggLSAoYmx1ciAqIDIpO1xuICAgIGNvbnN0IHJlY3RIID0gdGhpcy5kYXRhLmNhbnZhc0NvbmZpZy5oZWlnaHQgLSAoYmx1ciAqIDIpO1xuICAgIF9jb250ZXh0LmZpbGxSZWN0KDgsIDgsIHJlY3RXLCByZWN0SCk7XG5cbiAgICBjb25zdCBtYXJnaW4gPSAyODtcbiAgICBjb25zdCB4ID0gbWFyZ2luO1xuICAgIGNvbnN0IHkgPSBtYXJnaW47XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmRhdGEucG9zdGNhcmQud2lkdGggLSAobWFyZ2luICogMik7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5kYXRhLnBvc3RjYXJkLmhlaWdodCAtIChtYXJnaW4gKiAyKTtcbiAgICBfY29udGV4dC5zaGFkb3dPZmZzZXRYID0gMDtcbiAgICBfY29udGV4dC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICBfY29udGV4dC5zaGFkb3dCbHVyID0gMDtcbiAgICBfY29udGV4dC5kcmF3SW1hZ2UodGhpcy5kYXRhLnBvc3RjYXJkLnBhdGgsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgX2NvbnRleHQuZmlsbFN0eWxlID0gJyMzMzMzMzMnO1xuXG4gICAgX2NvbnRleHQuc2hhZG93T2Zmc2V0WCA9IDI7XG4gICAgX2NvbnRleHQuc2hhZG93T2Zmc2V0WSA9IDI7XG4gICAgX2NvbnRleHQuc2hhZG93Qmx1ciA9IDI7XG4gICAgX2NvbnRleHQuc2V0Rm9udFNpemUoMTgpO1xuXG4gICAgY29uc3QgdFggPSB3aWR0aCAtIChtYXJnaW4gKyAyNCk7XG4gICAgY29uc3QgdFkgPSBoZWlnaHQgKyA4MDtcbiAgICBfY29udGV4dC5maWxsVGV4dChg4pSA4pSAICR7dGhpcy5kYXRhLnVzZXJJbmZvLm5pY2tOYW1lfWAsIHRYLCB0WSwgMTAwKTtcbiAgICBjb25zdCBxdW90ZXMgPSBbXG4gICAgICAn5pep5pS+5a2m77yM5pep5Zue5a62IScsXG4gICAgICAn5ZCD6aWt44CB552h6KeJ44CB5pK454yrJyxcbiAgICAgICdCZWF1dHkgaXMgZm91bmQgd2l0aGluLicsXG4gICAgXTtcblxuICAgIGNvbnN0IGluZGV4ID0gTWF0aC5yYW5kb20oKSAqIHF1b3Rlcy5sZW5ndGg7XG4gICAgY29uc3QgcXVvdGUgPSBxdW90ZXNbaW5kZXhdO1xuICAgIGNvbnN0IHFYID0gbWFyZ2luO1xuICAgIGNvbnN0IHFZID0gaGVpZ2h0ICsgKG1hcmdpbiArIDk2KTtcbiAgICBfY29udGV4dC5maWxsVGV4dChxdW90ZSwgcVgsIHFZLCB3aWR0aCk7XG5cbiAgICBfY29udGV4dC5zYXZlKCk7XG5cbiAgICBjb25zdCBpWCA9IG1hcmdpbiArIDE2O1xuICAgIGNvbnN0IGlZID0gaGVpZ2h0ICsgKG1hcmdpbiArIDE2KTtcbiAgICBjb25zdCBpVyA9IDQ4O1xuICAgIGNvbnN0IGlIID0gaVc7XG4gICAgX2NvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgX2NvbnRleHQuYXJjKGlYICsgKGlXIC8gMiksIGlZICsgKGlIIC8gMiksIGlXIC8gMiwgMCwgMiAqIE1hdGguUEkpO1xuICAgIF9jb250ZXh0LmNsaXAoKTtcbiAgICBfY29udGV4dC5kcmF3SW1hZ2UodGhpcy5kYXRhLnVzZXJJbmZvLnBpY3R1cmVQYXRoLCBpWCwgaVksIGlXLCBpSCk7XG5cbiAgICBfY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgICBfY29udGV4dC5kcmF3KCk7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBpc0NhbnZhczogdHJ1ZSxcbiAgICB9KVxuICB9LFxufSlcbiJdfQ==