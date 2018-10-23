<template>
  <image
    :src="picture.path"
    class="picture"
    mode="aspectFit"
    :style="imageStyle"
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
      computed: {
        imageStyle() {
          const margin = 4;
          const x = margin;
          const y = margin;
          const width = this.picture.width - (margin * 2);
          const height = this.picture.height - (margin * 2);
          return `left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px;`;
        },
      },
    };
</script>

<style scoped>
  image {
  }
</style>
