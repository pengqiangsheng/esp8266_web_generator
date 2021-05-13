<template>
    <div id="input-widget" >
        <ul id="inputrow">
            <li class="cell"
              v-for="(text, index) in numberArray"
              :key="index"
              :selected="(index == selected && !text)"
              :class="['lengthof-8', {'item-selected': index === selected}]"
               @click="()=>{onCellSelected(index)}"
              >
                <!-- 解决ios样式兼容问题 -->
                <template v-if="index >= 7">
                  <button v-if="index === 7 && selected < 7" class="new-energy"></button>
                  <button v-else class="key item-input">{{ text }}</button>
                </template>
                <button v-else class="key item-input" >{{ text }}</button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'keyInput',
  props: ["numberArray", "selected"],
  methods: {
    onCellSelected(index) {
      this.$emit("onCellSelected", index)
    }
  }
}
</script>

<style lang='less' scoped>
@basePath: "../../../assets/styles";
@import "@{basePath}/variable.less";
@import "@{basePath}/mixin.less";
@green: #21D45F;
div#input-widget {
  height: 100%;
}

.item-input {
  display: flex;
  align-items: center;
  justify-content: center;
}

ul#inputrow {
  -webkit-box-flex: 0.90;
  -webkit-flex: 0 1 90%;
  flex: 0 1 90%;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
}

ul#inputrow > li{
  position: relative;
  height: 100%;
  margin-right: 5px;
  background-color: #fff;
  border-radius: 4px;
}

ul#inputrow > li.lengthof-8 {
  -webkit-box-flex: calc((100% - 5px) / 8);
  -webkit-flex: 0 1 calc((100% - 5px) / 8);
  flex: 0 1 calc((100% - 5px) / 8);
}

ul#inputrow > li.lengthof-7 {
  -webkit-box-flex: 0.1428;
  -webkit-flex: 0 1 14.28%;
  flex: 0 1 14.28%;
}

ul#inputrow > li.cell > button { font-size: 5vh; }
/*Landscape*/
@media all and (min-width:640px){
  ul#inputrow > li.cell > button { font-size: 9vh; }
}

/*Portrait*/
@media all and (max-width:480px) {
  ul#inputrow > li.cell > button { font-size: 7vw; }
}

ul#inputrow > li:not(:last-child) {
  border: 1px solid #cccccc;
}

ul#inputrow > li.cell[selected=selected]::after{
  position: absolute;
  bottom: 10px;
  left: 44%;
  width: 2px;
  height: 60%;
  border-width: 2px 2px 0 0;
  border-color: #3e74b9;
  border-style: solid;
  content: "";
  animation: blink .7s infinite;
}
@keyframes blink
{
  0% {opacity: 1;}
  100% {opacity:0;}
}

li.cell:last-child {
  border: 1px solid @color-blue;
  background-color: rgba(46,128,250, 0.2)!important;
  margin-right: 0!important;
}

// .new-energy {
//   position: absolute;
//   font-size: 10px!important;
//   color: @color-blue;
//   background-color: rgba(46,128,250, 0.2);
// }
.new-energy::before{
  position: absolute;
  top: 0;
  left: 0px;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: 1;
  height: 40px;
  width: 15px;
  line-height: normal!important;
  writing-mode: vertical-rl;
  content: "新能源";
  text-align: center;
  font-size: 0.26666667rem;
  color: #2E80FA;
}
.item-selected {
  border: 1px solid @color-blue!important;
}

</style>