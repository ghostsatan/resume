<template>
  <div class="home">
    <div class="search">
      <el-input v-model="keyWord" placeholder="请输入检索关键字" prefix-icon="el-icon-search"></el-input>
      <el-button type="primary" style="margin-left: 10px" @click="search(1, 10, keyWord)">搜索简历</el-button>
      <el-button type="success" @click="goUpload">简历上传</el-button>
    </div>
    <div v-if="list.length" class="resume_list">
      <!-- 列表 -->
      <template v-for="(item, index) in list">
        <div class="list_item">
          <div class="title">
            {{ item.name }}
          </div>
          <div class="time">
            <span style="display: inline-block; margin-right: 10px">上传时间：{{ item.time | timeFormat }}</span>
            <el-button type="text" @click="detail(item)">
              <i class="el-icon-view"></i>
              查看
            </el-button>
            <el-button type="text" @click="delNote(item)" style="color: #f56c6c">
              <i class="el-icon-delete"></i>
              删除
            </el-button>
          </div>
        </div>
      </template>
      <!-- 分页 -->
      <div style="margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="size"
          layout="total, sizes,jumper,->,prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <upload ref="upload"></upload>
  </div>
</template>

<script>
import upload from "@/components/upload.vue"
export default {
  components: { upload },
  data() {
    return {
      keyWord: "",
      total: 0,
      size: 0,
      currentPage: 1,
      list: [],
    }
  },
  methods: {
    goUpload() {
      this.$refs.upload.show()
    },
    //信息检索
    search(currentPage, size, search) {
      if (!search) {
        this.$message.warning("请先输入检索内容")
      } else {
        //todoList
        this.$axios
          .post(`/api/resumeView/getDataList.json`, { currentPage: currentPage, size: size, query: { search } })
          .then((res) => {
            if (res.success) {
              this.list = res.result.rows
              this.total = res.result.total
              this.size = res.result.size
            } else {
              this.$message.error(res.message)
            }
          })
      }
    },
    handleSizeChange(size) {
      this.size = size
      this.search(this.currentPage, this.size, this.search)
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.search(this.currentPage, this.size, this.search)
    },
    delNote(item) {
      let ids = []
      ids.push(item.id)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.post(`/api/resumeView/deleteData.json`, { ids: ids }).then((res) => {
            if (res.success) {
              this.$message.success("简历删除成功")
              this.search(this.currentPage, this.size, this.search)
            } else {
              this.$message.error(res.message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          })
        })
    },
    detail(item) {
      console.log(item)
      this.$router.push({
        path: "/pdf",
        query: {
          id: item.id,
        },
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .search {
    margin-top: 100px;
    width: 50%;
    display: flex;
  }
  .resume_list {
    margin: 20px 0;
    padding: 10px;
    width: 50%;
    .list_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
