<template>
  <div class="add">
    <el-dialog :visible.sync="isVisible" title="上传简历" @close="close">
      <div class="detail">
        <el-form ref="form" label-width="180px" class="form">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="简历附件：" class="hotel-logo">
                <el-upload action="#" accept="*" :on-change="fileChange" :auto-upload="false" :file-list="fileList">
                  <el-button size="small" type="primary">请选择上传文件</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传pdf/doc后缀的文件</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="btn">
        <el-button type="primary" @click="submit">上传</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this
    return {
      isVisible: false,
      fileList: [],
      formData: new FormData(),
    }
  },
  methods: {
    //显示弹窗
    show() {
      this.isVisible = true
    },
    // 选择文件-多选
    fileChange(file, fileList) {
      this.fileList = fileList
    },
    //保存
    submit() {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      if (!this.fileList.length) {
        this.$message.warning("上传文件不能为空")
      } else {
        this.fileList.forEach((file) => {
          this.formData.append("file", file.raw) //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
        })
        this.$axios.post(`/api/resumeView/uploadResume.json`, this.formData, config).then((res) => {
          if (res.success) {
            this.$message.success("上传成功")
            this.isVisible = false
          } else {
            this.$message.error(res.message)
            this.isVisible = false
          }
        })
      }
    },

    close() {
      this.isVisible = false
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      this.formData = new FormData()
      this.fileList = []
    },
  },
}
</script>
<style lang='scss' scoped>
.el-upload__tip {
  width: 180px;
}
.add {
  .btn {
    text-align: center;
    padding: 20px;
  }
  .el-form-item__label {
    font-weight: bold;
    font-size: 15px;
  }

  .detail {
    border: 1px solid #f8f8f8;
    margin: 20px 0;
    padding: 10px;
  }
}
</style>


