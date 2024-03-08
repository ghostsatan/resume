<template>
  <div class="upload">
    <el-upload class="upload-demo" :on-change="handleChange" :file-list="fileList">
      <el-button size="large" type="primary" style="width: 200px">点击上传简历</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <div class="back">
      <el-button type="text" @click="goBack">
        <i class="el-icon-back"></i>
        返回上一页
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.upload {
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  position: relative;
}

.back {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
