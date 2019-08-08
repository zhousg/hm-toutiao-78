<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div class="btn-box">
        <el-radio-group v-model="reqParams.collect" @change="changeCollect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button @click="openDialog()" type="success" size="small" style="float:right">添加素材</el-button>
      </div>
      <div class="img-list">
        <div class="img-item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="footer" v-show="!reqParams.collect">
            <span
              @click="toggleCollect(item)"
              class="el-icon-star-off"
              :class="{selected:item.is_collected}"
            ></span>
            <span @click="deleteImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <el-pagination
        v-if="total > reqParams.per_page"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="changePager"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        :show-file-list="false"
        :on-success="handleSuccess"
        name="image"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
export default {
  data () {
    return {
      // 请求参数
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      // 总条数
      total: 0,
      // 控制对话框显示隐藏
      dialogVisible: false,
      // 上传成功后图片的地址
      imageUrl: null,
      headers: {
        Authorization: `Bearer ${store.getUser().token}`
      }
    }
  },
  created () {
    // 获取素材列表
    this.getImages()
  },
  methods: {
    // 删除
    deleteImage (id) {
      // 加个确认框
      this.$confirm('老铁，此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete('user/images/' + id)
        this.$message.success('删除成功')
        this.getImages()
      }).catch(() => {})
    },
    // 切换收藏
    async toggleCollect (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
      // 更新当前图片的状态即可
      item.is_collected = data.collect
    },
    // 上传成功
    handleSuccess (res) {
      // 获取上传成功的图片地址  res.data.url
      // 1. 预览
      this.imageUrl = res.data.url
      // 2. 提示
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // 3. 2s 关闭对话框
        // 4. 2s 更新列表
        this.dialogVisible = false
        this.reqParams.page = 1
        this.getImages()
      }, 2000)
    },
    // 打开对话框
    openDialog () {
      // 清空预览图的地址
      this.imageUrl = null
      this.dialogVisible = true
    },
    // 改变全部与收藏
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 分页函数
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      // 赋值给素材列表
      this.images = data.results
      // 总条数赋值
      this.total = data.total_count
    }
  }
}
</script>

<style scoped lang='less'>
.img-list {
  margin-top: 20px;
}
.img-item {
  width: 160px;
  height: 160px;
  border: 1px dashed #ddd;
  position: relative;
  display: inline-block;
  margin-right: 50px;
  margin-bottom: 20px;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 30px;
    line-height: 30px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: center;
    width: 100%;
    span {
      margin: 0 20px;
      &.selected {
        color: red;
      }
    }
  }
}
</style>
