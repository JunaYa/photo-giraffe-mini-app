<template>
  <div
    v-if="!background"
    :style="{top: offsetTop}"
    class="c-lee-button"
    @click="clickEventCallback">
    {{ text }}
  </div>
</template>

<script>
  export default {
    name: 'LeeButton',
    props: {
      text: {
        type: String,
        required: true,
        default: '',
      },
      offsetTop: {
        type: String,
        required: true,
        default: '60%',
      },
    },
    methods: {
      clickEventCallback() {
        this.$emit('click');
      },
    },
  };
</script>

<style scoped>
  .c-lee-button {
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
</style>
