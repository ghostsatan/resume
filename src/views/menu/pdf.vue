<template>
  <div class="pdf">
    <div class="tags">
      <el-tag :key="index" v-for="(tag, index) in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
      ></el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加批注</el-button>
    </div>
    <iframe :src="pdfUrl" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pdfUrl: "",
      dynamicTags: [],
      noteList: [],
      inputVisible: false,
      inputValue: "",
      input: "",
      resumeId: "",
    }
  },

  async mounted() {
    this.resumeId = this.$route.query.id
    let res = await this.getDetail(this.resumeId)
    this.pdfUrl = this.$url + res.path
    this.getNote(this.resumeId)
  },
  methods: {
    //删除批注
    handleClose(tag) {
      let obj = this.noteList.find((item) => item.note === tag)
      let ids = []
      ids.push(obj.id)
      this.delNote(ids)
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //新增批注
    async handleInputConfirm() {
      this.saveNote(this.resumeId, this.inputValue)
    },
    //获取批注
    getNote(id) {
      this.$axios.post(`/api/resumeNote/getAllData.json`, { resumeId: id }, { hideloading: true }).then((res) => {
        if (res.success) {
          if (res.result.length) {
            this.noteList = res.result
            this.dynamicTags = []
            res.result.map((item) => {
              this.dynamicTags.push(item.note)
            })
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //获取地址
    getDetail(id) {
      return new Promise((resolve, reject) => {
        this.$axios
          .post(`/api/resumeView/getDataInfo.json?id=${id}`)
          .then((res) => {
            // 成功
            return resolve(res.result)
          })
          .catch((err) => {
            // 失败
            return reject(err)
          })
      })
    },
    saveNote(id, note) {
      this.$axios.post(`/api/resumeNote/saveData.json`, { resumeId: id, note: note }, { hideloading: true }).then((res) => {
        if (res.success) {
          this.$message.success("批注保存成功")
          this.getNote(this.resumeId)
          this.inputVisible = false
          this.inputValue = ""
        } else {
          this.$message.error(res.message)
        }
      })
    },
    delNote(ids) {
      this.$axios.post(`/api/resumeNote/deleteData.json`, { ids: ids }, { hideloading: true }).then((res) => {
        if (res.success) {
          this.$message.success("批注删除成功")
          this.getNote(this.resumeId)
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.pdf {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
}
.tags {
  margin: 10px;
}
</style>