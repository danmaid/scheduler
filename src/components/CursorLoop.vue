<template>
  <svg class="cursor-loop" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="gradient">
        <stop offset="10%" stop-color="gold" />
        <stop offset="100%" stop-color="transparent" />
      </radialGradient>
    </defs>

    <circle fill="url(#gradient)" cx="60" cy="60" r="50" />
  </svg>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$emit('input', null)
    }, 1000)
  }
}
</script>

<style scoped>
.cursor-loop {
  color: cornflowerblue;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  margin: -10px;
  z-index: 1000;
  animation: loop 1s ease-out 1;
}
@keyframes loop {
  0% {
    top: 0%;
    left: 100%;
    right: 0%;
    bottom: 100%;
  }

  25% {
    top: 100%;
    left: 100%;
    right: 0%;
    bottom: 0%;
  }

  50% {
    top: 100%;
    left: 0%;
    right: 100%;
    bottom: 0%;
  }

  75% {
    top: 0%;
    left: 0%;
    right: 100%;
    bottom: 100%;
  }

  100% {
    top: 0%;
    left: 100%;
    right: 0%;
    bottom: 100%;
  }
}
</style>
