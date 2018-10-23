<template>
  <div class="container">
    <HeaderLayout :title="否TA"/>
    <div
      v-if="background && !isCanvas"
      class="content-layout"
      :style="canvasStyle"
      >
      <input
        v-if="isTextWriting"
        placeholder="内容"
        @input="onInputText"
        auto-focus/>
      <Picture :picture="background"/>
      <div
        class="content-group"
        :style="canvasStyle"
      >
        <div
          class="text-group"
          :style="canvasStyle"
        >
          <p
            v-for="(textItem, textIndex) in texts"
            :key="textIndex"
            :style="{left: textItem.x + 'px;', top: textItem.y + 'px;'}"
            class="text-item"
          >
            {{ textItem.value }}
          </p>
        </div>
        <div
          class="picture-group"
          :style="canvasStyle"
        >
          <image
            v-for="(pictureItem, pictureIndex) in pictures"
            :key="pictureIndex"
            :src="pictureItem.path"
            :style="{left: pictureItem.x + 'px;', top: pictureItem.y + 'px;'}"
            class="picture-item"
          >
          </image>
        </div>
      </div>
    </div>
    <LeeButton
      v-if="!background"
      :text="'选择图片'"
      :offset-top="'60%'"
      @click="addBackground"
    />
    <div
      v-if="background && !isCanvas"
      class="options-layout"
    >
      <div
        v-if="!isTextWriting"
        :class="{'options-item-isShow': background}"
        class="options-item"
        @touchstart="addBackground">
        重置
      </div>
      <div
        v-if="!isTextWriting"
        :class="{'options-item-isShow': background}"
        class="options-item"
        @touchstart="addText">
        文字
      </div>
      <div
        v-if="!isTextWriting"
        :class="{'options-item-isShow': background}"
        class="options-item"
        @touchstart="addPicture">
        图片
      </div>
      <div
        v-if="!isTextWriting && isCanvas"
        :class="{'options-item-isShow': background}"
        class="options-item"
        @touchstart="savePicture">
        保存
      </div>
      <div
        v-if="!isTextWriting && !isCanvas"
        :class="{'options-item-isShow': background}"
        class="options-item"
        @touchstart="drawCanvas">
        作画
      </div>
      <div
        v-if="isTextWriting"
        :class="{'options-item-isShow': background}"
        class="options-item"
        @touchstart="cancelCurrentStep">
        取消
      </div>
      <div
        v-if="isTextWriting"
        :class="{'options-item-isShow': background}"
        class="options-item"
        @touchstart="saveCurrentStep">
        确定
      </div>
    </div>
    <canvas
      v-if="isCanvas"
      :style="canvasStyle"
      canvas-id="canvas"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchMove"
    >
      <cover-view
        v-if="background"
        class="options-layout"
      >
        <cover-view
          :class="{'options-item-isShow': background}"
          class="options-item"
          @touchstart="cancelSavePicture">
          取消
        </cover-view>
        <cover-view
          :class="{'options-item-isShow': background}"
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
  import LeeButton from '@/components/LeeButton';
  import {
    calPictureSize,
    selectPicture,
  } from '@/utils/index';

  export default {
    data() {
      return {
        background: null,
        pictures: [],
        texts: [],
        tree: null,
        context: null,
        canvasConfig: {},
        currentText: {},
        currentPicture: {},
        isTextWriting: false,
        isPictureEditing: false,
        isCanvas: false,
        step: -1,
      };
    },

    components: {
      LeeButton,
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
      this.getUserInfo();
    },

    computed: {
      canvasStyle() {
        return `width: ${this.canvasConfig.width}px; height: ${this.canvasConfig.height}px;`;
      },
    },

    methods: {
      getUserInfo() {
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: (res) => {
                this.userInfo = res.userInfo;
                console.log(this.userInfo);
              },
            });
          },
        });
      },

      addBackground() {
        wx.vibrateShort();
        selectPicture().then((info) => {
          const {
            width,
            height,
          } = calPictureSize(this.canvasConfig, info);
          this.background = info;
          this.background.width = width;
          this.background.height = height;
        });
      },

      addPicture() {
        wx.vibrateShort();
        selectPicture().then((info) => {
          const {
            width,
            height,
          } = calPictureSize(this.canvasConfig, info);
          this.currentPicture = info;
          this.currentPicture.width = width;
          this.currentPicture.height = height;
          this.pictures.push(this.currentPicture);
        });
      },

      addText() {
        wx.vibrateShort();
        this.isTextWriting = true;
      },

      cancelSavePicture() {
        wx.vibrateShort();
        this.isCanvas = false;
      },

      savePicture() {
        wx.vibrateShort();
        const margin = 4;
        const xValue = margin;
        const yValue = margin;
        const canvasWidth = this.canvasConfig.width;
        const canvasHeight = this.canvasConfig.height;
        const widthValue = this.background.width - (margin * 2);
        const heightValue = this.background.height - (margin * 2);

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

      saveCurrentStep() {
        wx.vibrateShort();
        if (this.isTextWriting) {
          this.texts.push(this.currentText);
          this.isTextWriting = false;
          this.currentText = {};
        } else if (this.isPictureEditing) {
          this.pictures.push(this.currentPicture);
          this.isPictureEditing = false;
          this.currentPicture = {};
        }
      },

      cancelCurrentStep() {
        wx.vibrateShort();
        if (this.isTextWriting) {
          this.isTextWriting = false;
          this.currentText = {};
        } else if (this.isPictureEditing) {
          this.isPictureEditing = false;
          this.currentPicture = {};
        }
      },

      drawCanvas() {
        if (!this.background) return;
        const margin = 4;
        const x = margin;
        const y = margin;
        const width = this.background.width - (margin * 2);
        const height = this.background.height - (margin * 2);
        this.context.drawImage(this.background.path, x, y, width, height);

        this.texts.forEach((textItem) => {
          this.context.setFontSize(16);
          this.context.fillText(textItem.value, textItem.x, textItem.y, 100);
        });

        this.pictures.forEach((pictureItem) => {
          const w = pictureItem.width - (margin * 2);
          const h = pictureItem.height - (margin * 2);
          this.context.drawImage(pictureItem.path, x, y, w / 4, h / 4);
        });
        this.context.draw();
        this.isCanvas = true;
      },

      onInputText(res) {
        this.currentText.value = res.mp.detail.value;
        this.currentText.x = res.mp.target.offsetLeft;
        this.currentText.y = res.mp.target.offsetTop;
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
    position: relative;
    height: 100%;
  }

  .options-board {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .options-layout {
    position: absolute;
    right: .48rem;
    bottom: .68rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    justify-items: center;
    z-index: 999;
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

  .content-layout {
    position: relative;
  }

  .content-group {
    position: absolute;
    z-index: 33;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .text-group,
  .picture-group {
    position: absolute;
  }

  .text-item {
    position: absolute;
    font-size: .32rem;
    color: #333333;
    border: .01rem solid #999999;
  }

  .picture-item {
    position: absolute;
    border: .01rem solid #999999;
  }

  canvas {
    margin: 0 auto;
    border-radius: .05rem;
    box-shadow: 0 .8rem .4rem rgba(0, 0, 0, .15);
  }

  input {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, 0);
    border-bottom: .01rem solid #999999;
    font-size: .32rem;
  }

</style>
