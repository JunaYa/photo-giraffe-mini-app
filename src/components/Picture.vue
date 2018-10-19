<template>
  <image
    :src="picture.path"
    class="picture"
    mode="aspectFit"
  >
  </image>
</template>

<script>
    export default {
      name: 'Picture',
      props: {
        picture: {
          type: Object,
          required: true,
        },
      },
    };
</script>

<style scoped>
  image {
    width: 8rem;
    height: 12rem;
  }
</style>
