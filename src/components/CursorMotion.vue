<template>
  <svg
    class="fullscreen"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <radialGradient id="gradient">
        <stop offset="10%" stop-color="gold" />
        <stop offset="100%" stop-color="transparent" />
      </radialGradient>
    </defs>

    <symbol viewBox="0 0 120 120" id="cursor">
      <circle fill="url(#gradient)" cx="60" cy="60" r="50" />
    </symbol>

    <path :id="id" :d="`M ${x1} ${y1} L ${x2} ${y2}`" fill="red" />

    <use xlink:href="#cursor" width="20" height="20">
      <animateMotion dur="1s" calcMode="spline" keyTimes="0;1" keySplines="0.42 0 1.0 1.0">
        <mpath :xlink:href="`#${id}`" />
      </animateMotion>
    </use>
  </svg>
</template>

<script>
import { v4 as uuid } from 'uuid'

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      id: uuid(),
      ...this.value
    }
  },
  mounted() {
    setTimeout(() => {
      this.$emit('input', null)
      this.$emit('ended')
    }, 1000)
  }
}
</script>

<style scoped>
.fullscreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  pointer-events: none;
}
</style>
