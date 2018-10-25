<template>
  <div class="c-header">
    <div class="info-bar"></div>
    <div class="c-toolbar-header">
      <div
        v-if="showButton"
        class="btn btn-cancel"
        @click="$emit('clickCancel')"
      >
        取消
      </div>
      <div
        v-if="showButton"
        class="btn btn-confirm"
        @click="$emit('clickConfirm')"
      >
        确定
      </div>
      <title
        v-if="!showButton"
      >{{ title }}</title>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'Header',
      props: {
        title: {
          type: String,
          required: true,
          default: '@ TA',
        },
        showButton: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    };
</script>

<style scoped>
  .info-bar {
    width: 100%;
    height: .38rem;
    background: #6bb6b0;
  }

  .c-toolbar-header {
    height: .48rem;
    padding: .16rem;
    background: #71BCB6;
    box-shadow: 0 .04rem .1rem rgba(0, 0, 0, .15);
    display: flex;
  }

  .btn {
    color: #ffffff;
    font-size: .26rem;
    background: #509993;
    padding: 0 .28rem;
    line-height: .56rem;
    align-self: center;
    border-radius: .06rem;
    box-shadow: 0 .08rem .1rem rgba(0, 0, 0, .15);
  }

  .btn-cancel {
  }

  .btn-confirm {
    margin-left: .24rem;
  }

  title {
    font-size: .32rem;
    color: #345a54;
    text-align: center;
    align-self: center;
    margin-left: .24rem;
    text-shadow: .04rem .04rem .08rem rgba(0, 0, 0, .25);
  }
</style>
