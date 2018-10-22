<template>
  <div class="c-header">
    <title>{{ title }}</title>
  </div>
</template>

<script>
    export default {
      name: 'Header',
      props: {
        title: {
          type: String,
          required: true,
          default: '否 TA',
        },
      },
    };
</script>

<style scoped>
  .c-header {
    height: .48rem;
    padding: .16rem;
    margin-top: .38rem;
    background: aliceblue;
    display: flex;
  }

  title {
    margin: 0 auto;
    font-size: .32rem;
    color: #333333;
    text-align: center;
    align-self: center;
  }
</style>
