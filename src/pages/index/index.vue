<template>
  <div class="container">
    <HeaderLayout
      :title="'@TA'"
      :show-button="isCanvas"
      @clickCancel="cancelSavePicture"
      @clickConfirm="savePicture"
    />
    <p class="description">
      选取一张图片作为背景，将信息合成为一张新图
    </p>
    <button
      v-if="!isCanvas"
      class="btn-postcard"
      plain="true"
      open-type="getUserInfo"
      @getuserinfo="getUserInfo"
    >
      创建明信片
    </button>
    <canvas
      v-if="isCanvas"
      :style="canvasStyle"
      canvas-id="canvas"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchMove"
    >
    </canvas>
  </div>
</template>

<script>
  import HeaderLayout from '@/components/Header';
  import {
    calPictureSize,
    selectPicture,
    setPostcards,
  } from '@/utils/index';

  export default {
    data() {
      return {
        postcard: null,
        context: null,
        canvasConfig: {},
        isCanvas: false,
      };
    },

    components: {
      HeaderLayout,
    },

    created() {
      const systemInfo = wx.getSystemInfoSync();
      this.canvasConfig.width = systemInfo.windowWidth - 8;
      this.canvasConfig.height = systemInfo.windowHeight - 64;
    },

    mounted() {
      this.context = wx.createCanvasContext('canvas');
    },

    computed: {
      canvasStyle() {
        return `width: ${this.canvasConfig.width}px; height: ${this.canvasConfig.height}px;`;
      },
    },

    watch: {
      postcard() {
        this.drawPostCard();
        this.drawPostCard();
      },
    },

    methods: {
      getUserInfo(info) {
        wx.vibrateShort();
        const user = info.mp.detail.userInfo;
        this.getPicture(user.avatarUrl).then((picturePath) => {
          user.picturePath = picturePath;
          this.userInfo = user;
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
        selectPicture().then((info) => {
          const {
            width,
            height,
          } = calPictureSize(this.canvasConfig, info);
          this.postcard = info;
          this.postcard.width = width;
          this.postcard.height = height;
        });
      },

      cancelSavePicture() {
        wx.vibrateShort();
        this.isCanvas = false;
      },

      savePicture() {
        wx.vibrateShort();
        const margin = 0;
        const xValue = margin;
        const yValue = margin;
        const canvasWidth = this.canvasConfig.width;
        const canvasHeight = this.canvasConfig.height;
        const self = this;

        wx.canvasToTempFilePath({
          x: xValue,
          y: yValue,
          width: canvasWidth,
          height: canvasHeight,
          destWidth: canvasWidth * 2,
          destHeight: canvasHeight * 2,
          canvasId: 'canvas',
          success(res) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.showToast({
                  title: '保存成功!',
                  icon: 'success',
                });
                setTimeout(() => {
                  self.isCanvas = false;
                }, 300);
                setPostcards(res.tempFilePath);
              },
            });
          },
        });
      },

      drawPostCard() {
        if (!this.postcard) return;

        const blur = 8;
        this.context.fillStyle = '#fefefe';
        this.context.shadowOffsetX = 2;
        this.context.shadowOffsetY = 2;
        this.context.shadowColor = '#999999';
        this.context.shadowBlur = blur;

        const rectW = this.canvasConfig.width - (blur * 2);
        const rectH = this.canvasConfig.height - (blur * 2);
        this.context.fillRect(8, 8, rectW, rectH);

        const margin = 28;
        const x = margin;
        const y = margin;
        const width = this.postcard.width - (margin * 2);
        const height = this.postcard.height - (margin * 2);
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowBlur = 0;
        this.context.drawImage(this.postcard.path, x, y, width, height);

        this.context.fillStyle = '#333333';

        this.context.shadowOffsetX = 2;
        this.context.shadowOffsetY = 2;
        this.context.shadowBlur = 2;
        this.context.setFontSize(18);

        const tX = width - (margin + 24);
        const tY = height + 80;
        this.context.fillText(`── ${this.userInfo.nickName}`, tX, tY, 100);
        const quotes = [
          '早放学，早回家!',
          '吃饭、睡觉、撸猫',
          'Beauty is found within.',
        ];

        const index = parseInt(Math.random() * quotes.length, 0);
        const quote = quotes[index];
        const qX = margin;
        const qY = height + (margin + 96);
        this.context.fillText(quote, qX, qY, width);

        this.context.save();

        const iX = margin + 16;
        const iY = height + (margin + 16);
        const iW = 48;
        const iH = iW;
        this.context.beginPath();
        this.context.arc(iX + (iW / 2), iY + (iH / 2), iW / 2, 0, 2 * Math.PI);
        this.context.clip();
        this.context.drawImage(this.userInfo.picturePath, iX, iY, iW, iH);

        this.context.restore();

        this.context.draw();
        this.isCanvas = true;
      },
    },
  };
</script>

<style scoped>
  .container {
    position: relative;
    height: 100%;
  }

  .description {
    position: absolute;
    width: 100%;
    top: 30%;
    text-align: center;
    font-size: .28rem;
    color: #b4b4b4;
  }

  .btn-postcard {
    position: absolute;
    left: 50%;
    top: 70%;
    transform: translate(-50%, 0);
    width: 38%;
    line-height: .86rem;
    border: .01rem solid #999999;
    border-radius: .06rem;
    box-shadow: 0 .2rem .4rem rgba(0, 0, 0, .15);
  }

  canvas {
    margin: 0 auto;
    border-radius: .05rem;
    box-shadow: 0 .8rem .4rem rgba(0, 0, 0, .15);
  }

</style>
