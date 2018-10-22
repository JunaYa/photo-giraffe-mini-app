<template>
  <div class="container">
    <HeaderLayout :title="否"/>
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
    <canvas
      v-if="picture"
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
        this.context.draw();
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

  canvas {
    margin: 0 auto;
    border-radius: .05rem;
    box-shadow: 0 .2rem .4rem rgba(0, 0, 0, .15);
  }

</style>
