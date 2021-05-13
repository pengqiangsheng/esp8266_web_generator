<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
let VConsole = function() {}
if(process.env.VUE_APP_ENV === 'stage') {
  VConsole = require('vconsole')
}

export default {
  name: 'App',
  mounted() {
    const pre = document.getElementById('pre-loading')
    pre.style.display = 'none'
    new VConsole()
  }
}

const change = () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
}

document.addEventListener('DOMContentLoaded', change)

window.onresize = change
</script>
<style>
#__vconsole .vc-switch{
  bottom: 0.76923077em!important;
  right: 10px!important;
}
</style>
<style lang="less">
#app {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
