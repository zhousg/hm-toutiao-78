<template>
  <div class="my-image">
    <!-- 图片按钮 -->
    <div class="img-btn" @click="openDialog()">
      <img :src="value||defaultImage" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <!-- 单选框 -->
          <el-radio-group v-model="reqParams.collect" @change="changeCollect" size="mini">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 列表 -->
          <div class="img-list">
            <div
              class="img-item"
              :class="{selected:selectedImageUrl===item.url}"
              @click="selectedImageUrl=item.url"
              v-for="item in images"
              :key="item.id"
            >
              <img :src="item.url" alt />
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            v-if="total > reqParams.per_page"
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="changePager"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleSuccess"
            name="image"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import defaultImage from '../assets/images/default.png'
export default {
  name: 'my-image',
  // 默认图片地址
  props: ['value'],
  data () {
    return {
      // 控制对话框显示隐藏
      dialogVisible: false,
      // 控制tab选项卡到底激活谁
      activeName: 'image',
      // 获取素材列表请求参数
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      // 列表数据
      images: [],
      // 总条数
      total: 0,
      // 记录你选中的图片地址
      selectedImageUrl: null,
      // 上传头部
      headers: {
        Authorization: `Bearer ${store.getUser().token}`
      },
      // 记录上传成功的图片地址
      uploadImageUrl: null,
      // 封面地址
      // value: defaultImage
      // 默认图片
      defaultImage
    }
  },
  methods: {
    // 确认图片
    confirmImage () {
      if (this.activeName === 'image') {
        // this.value = this.selectedImageUrl
        this.$emit('input', this.selectedImageUrl)
      } else {
        // this.value = this.uploadImageUrl
        this.$emit('input', this.uploadImageUrl)
      }
      this.dialogVisible = false
    },
    // 上传成功
    handleSuccess (res) {
      // 预览即可
      this.uploadImageUrl = res.data.url
    },
    // 分页函数
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换 全部与收藏
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    },
    openDialog () {
      this.dialogVisible = true
      // 清空你选中或者上传的图片地址
      this.activeName = 'image'
      this.selectedImageUrl = null
      this.uploadImageUrl = null
      // 获取素材列表数据
      this.getImages()
    },
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    }
  }
}
</script>

<style scoped lang='less'>
.my-image{
  display: inline-block;
  margin-right: 20px;
}
.img-btn {
  width: 160px;
  height: 160px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  text-align: center;
  width: 100%;
  display: block;
}
.img-list {
  margin-top: 10px;
  .img-item {
    width: 160px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 15px;
    margin-bottom: 10px;
    position: relative;
    &.selected {
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2) url(../assets/images/selected.png)
          no-repeat center / 50px 50px;
      }
    }
    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
    }
  }
}
</style>
