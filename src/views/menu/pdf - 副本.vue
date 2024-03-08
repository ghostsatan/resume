<template>
  <div class="pdf">
    <div>打分卡京东方</div>
    <iframe src="http://2782lk0215.wicp.vip/202403/1154827425536802816.pdf"></iframe>
    <pdf v-for="item in pageTotal" :src="pdfUrl" :key="item" :page="item" class="pdf" ref="pdfWrapper"></pdf>
  </div>
</template>

<script>
import pdf from "vue-pdf"

export default {
  components: {
    pdf,
  },
  data() {
    return {
      pdfUrl: "",
      pageTotal: 0,
      pageNum: 1,
    }
  },

  async mounted() {
    let id = this.$route.query.id
    let res = await this.getDetail(id)
    console.log(2222, res)
    this.pdfUrl = res.path
    console.log(33333, this.pdfUrl)
    this.getTotal(this.pdfUrl)
  },
  methods: {
    // 获取pdf总页数
    async getTotal(url) {
      // 多页pdf的src中不能直接使用后端获取的pdf地址 否则会按页数请求多次数据
      // 需要使用下述方法的返回值作为url
      this.pdfUrl = pdf.createLoadingTask(url)
      // 获取页码
      this.pageTotal = await this.pdfUrl.promise
        .then((pdf) => (this.pageTotal = pdf.numPages))
        .catch((error) => {
          console.log(error)
        })
      console.log(4, this.pageTotal)
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
  },
}
</script>
<style lang="scss" scoped>
.pdf {
  height: 80vh;
  background-color: #fff;
}
</style>