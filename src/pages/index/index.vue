<template>
  <div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      userInfo: {},
    };
  },

  components: {
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
  },

  created() {
    this.getUserInfo();
  },
};
</script>

<style scoped>

</style>
