<template>
  <div class="upload-wrapper">
    <div class="left">
      <div class="img-action needsclick" @click="handleAction">
        <img class="img needsclick" src="../../assets/img/upload1.png" />
      </div>
      <div class="img-arrow"></div>
      <div class="desc">
        <div>请点击按钮</div>
        <div>录入人脸信息</div>
      </div>
    </div>
    <div class="center">
      <img width="100%" height="100%" :src="imgUrl" />
      <div class="tip">{{ tip }}</div>
    </div>
    <div class="right">
      <div class="img"></div>
      <div class="desc">请按范例图片拍摄人脸</div>
    </div>
  </div>
</template>
<script>
import { downImg } from "@/utils/tools";
export default {
  data() {
    return {
      imgUrl: require("../../assets/img/face.png"),
      tip: "",
      loading: false
    };
  },
  methods: {
    handleAction() {
      const start = () => {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: "上传中..."
        });
      };
      const finish = data => {
        this.$toast.clear();
        console.log(data.base64);
        this.imgUrl = data.base64;
        downImg(data.base64, "test.png");
        this.tip = (data.newFile.size / 1024).toFixed(0) + "kb";
        console.log(data);
      };
      this.$useUpload(start, finish, 0.6);
    }
  }
};
</script>

<style lang="less">
@basePath: "../../assets/styles";
@import "@{basePath}/variable.less";
@import "@{basePath}/mixin.less";

.upload-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
  color: #cc2929;
  font-size: 12px;
  font-weight: 600;
  border-radius: @border-radius;
  box-sizing: border-box;
  background-color: #5fb7db;
  .left {
    flex: 1.2;
    min-width: 70px;
    .img-action {
      height: 36%;
      min-height: 50px;
      width: 90%;
      margin: 0 auto;
      border: 2px dashed #cc2929;
      .img {
        width: 74%;
        margin-top: 3px;
      }
    }
    .img-arrow {
      margin-top: 2px;
      height: 30%;
      width: 100%;
      .bg-image("@{imgPath}/icon_arrow_up.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 50% 50%;
    }
    .desc {
      position: relative;
      margin-top: 5px;
      div:last-child {
        min-width: 72px;
        margin-top: 5px;
      }
    }
  }
  .center {
    position: relative;
    flex: 2;
    margin: 0 10px;
    .tip {
      position: absolute;
      width: 100%;
      height: 20px;
      top: 10px;
      left: 50%;
      font-weight: 600;
      transform: translateX(-50%);
    }
  }
  .right {
    display: flex;
    align-items: center;
    flex: 1;
    .img {
      flex: 1;
      height: 30%;
      width: 100%;
      .bg-image("@{imgPath}/icon_arrow_left.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 50% 50%;
    }
    .desc {
      flex: 1;
    }
  }
}
</style>