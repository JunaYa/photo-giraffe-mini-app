<template>
  <div class="container">
    <div class="btn_select_picture"
         @click="selectPicture">
      选取图片
    </div>
    <Picture
      v-if="picture"
      :picture="picture"/>
  </div>
</template>

<script>
  import Picture from '@/components/Picture';

  export default {
    data() {
      return {
        picture: null,
      };
    },

    components: {
      Picture,
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

    },
  };
</script>

<style scoped>
  .container {

  }
</style>
