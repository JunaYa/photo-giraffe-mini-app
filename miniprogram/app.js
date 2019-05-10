"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
App({
    onLaunch: function() {
        var _this = this;
        wx.login({
            success: function(_res) {}
        });
        wx.getSetting({
            success: function(res) {
                if (res.authSetting["scope.userInfo"]) {
                    wx.getUserInfo({
                        success: function(res) {
                            _this.globalData.userInfo = res.userInfo;
                            if (_this.userInfoReadyCallback) {
                                _this.userInfoReadyCallback(res.userInfo);
                            }
                        }
                    });
                }
            }
        });
    },
    globalData: {}
});
