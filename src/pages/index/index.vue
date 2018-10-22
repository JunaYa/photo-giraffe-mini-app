<template>
  <div class="container">
    <HeaderLayout :title="否TA"/>
    <Picture
      v-if="false"
      :picture="picture"/>
    <span
      v-if="!picture"
      class="btn-select-picture"
      ref="span"
      @click="selectPicture">
      选择图片
    </span>
    <input
      v-if="isTextWriting"
      placeholder="内容"
      @input="onInputText"
      auto-focus/>
    <canvas
      v-if="picture"
      :style="canvasStyle"
      canvas-id="canvas"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchMove"
    >
      <cover-view
        class="options-layout"
      >
        <cover-view
          :class="{'options-item-isShow': picture}"
          class="options-item"
          @touchstart="selectPicture">
          重置
        </cover-view>
        <cover-view
          :class="{'options-item-isShow': picture}"
          class="options-item"
          @touchstart="addText">
          文字
        </cover-view>
        <cover-view
          :class="{'options-item-isShow': picture}"
          class="options-item"
          @touchstart="addPicture">
          图片
        </cover-view>
        <cover-view
          :class="{'options-item-isShow': picture}"
          class="options-item"
          @touchstart="savePicture">
          保存
        </cover-view>
      </cover-view>
    </canvas>
  </div>
</template>

<script>
  import Picture from '@/components/Picture';
  import HeaderLayout from '@/components/Header';
  import { calPictureSize } from '@/utils/index';

  export default {
    data() {
      return {
        picture: null,
        context: null,
        dom: null,
        canvasConfig: {},
        isTextWriting: false,
      };
    },

    components: {
      Picture,
      HeaderLayout,
    },

    created() {
      const systemInfo = wx.getSystemInfoSync();
      this.canvasConfig.width = systemInfo.windowWidth - 8;
      this.canvasConfig.height = systemInfo.windowHeight - 80;
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
      picture() {
        this.drawCanvas();
        this.context.draw();
      },
    },
    methods: {
      getUserInfo() {
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: (res) => {
                this.userInfo = res.userInfo;
              },
            });
          },
        });
      },

      selectPicture() {
        wx.chooseImage({
          count: 1,
          sourceType: ['album', 'camera'],
          sizeType: ['original', 'compressed'],
          success: (res) => {
            if (res.tempFiles.length > 0) {
              this.getPictureInfo(res.tempFiles[0].path).then((info) => {
                this.picture = info;
                const {
                  width,
                  height,
                } = calPictureSize(this.canvasConfig, this.picture);
                this.picture.width = width;
                this.picture.height = height;
              });
            }
          },
        });
      },

      addPicture() {},

      addText() {
        this.isTextWriting = true;
      },

      savePicture() {
        const margin = 4;
        const xValue = margin;
        const yValue = margin;
        const canvasWidth = this.canvasConfig.width;
        const canvasHeight = this.canvasConfig.height;
        const widthValue = this.picture.width - (margin * 2);
        const heightValue = this.picture.height - (margin * 2);
        wx.canvasToTempFilePath({
          x: xValue,
          y: yValue,
          width: canvasWidth,
          height: canvasHeight,
          destWidth: widthValue * 2,
          destHeight: heightValue * 2,
          canvasId: 'canvas',
          success(res) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.showToast({
                  title: '保存成功!',
                  icon: 'success',
                });
              },
            });
          },
        });
      },

      getPictureInfo(url) {
        return new Promise((resolve) => {
          wx.getImageInfo({
            src: url,
            success: data => resolve(data),
          });
        });
      },

      drawCanvas() {
        if (!this.picture) return;
        const margin = 4;
        const x = margin;
        const y = margin;
        const width = this.picture.width - (margin * 2);
        const height = this.picture.height - (margin * 2);
        this.context.drawImage(this.picture.path, x, y, width, height);
      },

      onInputText(res) {
        console.log(res);
      },

      handleTouchStart(event) {
        console.log('handleTouchStart', event);
      },

      handleTouchMove(event) {
        console.log('handleTouchMove', event);
      },

      handleTouchEnd(event) {
        console.log('handleTouchEnd', event);
      },

    },
  };
</script>

<style scoped>
  .container {

  }

  .btn-select-picture {
    font-size: .32rem;
    color: #333333;
    margin: 0 auto;
    padding: .16rem .48rem;
    border: .01rem solid #999999;
    border-radius: .06rem;
    box-shadow: 0 .2rem .4rem rgba(0, 0, 0, .15);
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .options-layout {
    position: absolute;
    z-index: 999;
    right: .48rem;
    bottom: .68rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    justify-items: center;
  }

  .options-item {
    width: .80rem;
    height: .80rem;
    background: aliceblue;
    font-size: .32rem;
    color: #333;
    text-align: center;
    line-height: .80rem;
    border-radius: 50%;
    box-shadow: 0 .2rem .4rem rgba(0, 0, 0, .15);
    margin-left: .16rem;
    transform: translate(1.48rem, 0);
    transition: .8s cubic-bezier(.2, .8, .2, 1);
  }

  .options-item-isShow {
    transform: translate(0, 0);
    transition: .8s cubic-bezier(.2, .8, .2, 1);
  }

  canvas {
    margin: 0 auto;
    border-radius: .05rem;
    box-shadow: 0 .8rem .4rem rgba(0, 0, 0, .15);
  }

  input {
    position: absolute;
    top: 50%;
    margin: 0 auto;
    border-bottom: .01rem solid #999999;
    font-size: .32rem;
  }

</style>
