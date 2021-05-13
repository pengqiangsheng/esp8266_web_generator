<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        :class="['progress-bar', {'loading-wrapper': this.offset }]"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    radius: {
      type: Number,
      default: 50
    },
    percent: {
      type: Number,
      default: 0
    },
    offset: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset () {
      return this.offset ? this.offset : (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style scoped lang="less">
.progress-circle {
  position: relative;
  circle {
    stroke-width: 10px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: #0086ee;
    }
    &.progress-bar {
      transform: scale(0.9);
      stroke: #66b6f5;
    }
    &.loading-wrapper {
      animation: loading 0.8s linear infinite;
    }
  }
  @keyframes loading {
    from {
      transform: scale(0.9) rotate(0);
    }
    to {
      transform: scale(0.9) rotate(360deg);
    }
  }
}
</style>
