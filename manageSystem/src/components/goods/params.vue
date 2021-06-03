<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <span>选择商品分类</span>
      <el-cascader
        v-model="selectedCateKeys"
        :options="cateList"
        :props="cateProps"
        @change="handleChange"
      ></el-cascader>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showDialog">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showDialog">添加参数</el-button>
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的dialog -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="add">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的dialog -->
    <el-dialog
      :title=" '修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      //   级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //   级联选择框双向绑定对象
      selectedCateKeys: [],
      //tab组件
      activeName: 'many',
      //动态参数的数据
      manyTableData: [],
      //静态参数的数据
      onlyTableData: [],
      //添加参数dialog
      addDialogVisible: false,
      addForm: {
        attr_name: '',
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      //   编辑参数的dialog
      editDialogVisible: false,
      //   修改表单数据对象
      editFrom: {},
      //   修改表单验证规则
      editFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName == 'many') {
        return '动态参数'
      }
      return '静态参数'
    },
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据列表失败！')
      }
      this.cateList = res.data
    },
    handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
      }
      this.getParams()
    },
    handleTabClick() {
      this.getParams()
    },
    async getParams() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (!res.data) {
        return
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName == 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    showDialog() {
      this.addDialogVisible = true
    },
    addDialogClose() {
      this.$refs.add.resetFields()
    },
    async submit() {
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        }
      )
      if (res.meta.status !== 201) {
        return this.$message.error('添加参数失败')
      }
      console.log(res)
      this.$message.success('添加参数成功')
      this.addDialogVisible = false
      this.getParams()
    },
    // 显示编辑参数对话框
    async showEditDialog(attrId) {
      console.log(this.activeName)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        {
          params: { attr_sel: this.activeName },
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    // 重置修改表单
    editDialogClosed() {
      this.$refs.editFromRef.resetFields()
    },
    // 修改参数
    editParams() {
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        this.getParams()
        this.editDialogVisible = false
      })
    },
    // 根据Id删除对应的参数项
    async removeParams(attrId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      this.getParams()
    },
    //展开列的文本输入框
    // 文本框失去焦点,或者按下Enter触发
    handleInputConfirm(row) {
      // 输入的内容为空时，清空
      if (row.inputValue.length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      // 提交数据库，保存修改
      this.saveAttrVals(row)
    },
    // 将对attr_vals（Tag） 的操作 保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    showInput(row) {
      row.inputVisible = true
      //让文本框自动获得焦点
      //$nextTick的作用是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击删除tag
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
  },
}
</script>

<style>
.el-button {
  margin-bottom: 20px;
}
.el-tag {
  margin: 6px;
}
.input-new-tag {
  width: 100px;
}
</style>