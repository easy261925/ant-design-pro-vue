<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="searchForm" :model="searcher">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="账户名称" prop="username">
                <a-input v-model="searcher.username" placeholder="请输入账户名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-button type="primary" @click="onSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>

      <div>
        <a-row justify="end" type="flex">
          <a-button type="primary" style="margin-right: 8px" @click="onCreate">新建</a-button>
          <a-button type="danger">批量删除</a-button>
        </a-row>
      </div>

      <div class="table-wrap">
        <a-table
          :columns="columns"
          :data-source="accountState.list"
          :pagination="{
            total:accountState.total, 
            current:accountState.pagination.current,
            pageSize:accountState.pagination.pageSize,
            }"
          rowKey="id"
          @change="handleTableChange"
        >
          <a slot="username" slot-scope="text,record" @click="() =>onView(record)">{{ text }}</a>
          <div slot="userType" slot-scope="text">{{ text }}</div>
          <div slot="ban" slot-scope="text,record">
            <a-switch :default-checked="text === 1" @change="(value) =>banOnChange(value, record)" />
          </div>
          <span slot="action" slot-scope="text, record">
            <a @click="() =>onEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="() =>onDelete(record)"
              @cancel="() => console.log('cancel')"
            >
              <a>删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
          </span>
        </a-table>
      </div>
    </a-card>

    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="true"
      :visible="visible"
      @close="hideDrawer"
      :width="650"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :rules="rules"
      >
        <a-form-model-item ref="username" label="账户名称" prop="username">
          <a-input :disabled="formMode === 'view'" v-model="form.username" placeholder="请输入账户名称" />
        </a-form-model-item>
        <a-form-model-item label="账户类型" prop="userType">
          <a-select :disabled="formMode === 'view'" v-model="form.userType" placeholder="请选择账户类型">
            <a-select-option key="0" value="0">类型一</a-select-option>
            <a-select-option key="1" value="1">类型二</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="选择时间" prop="date">
          <a-date-picker
            :disabled="formMode === 'view'"
            v-model="form.date"
            type="date"
            show-time
            placeholder="请选择时间"
            style="width: 100%"
          />
        </a-form-model-item>
        <a-form-model-item label="是否启用" prop="ban">
          <a-switch :disabled="formMode === 'view'" v-model="form.ban" />
        </a-form-model-item>
      </a-form-model>
      <div class="drawer-btn-warp">
        <a-button class="closed-btn" @click="hideDrawer">关闭</a-button>
        <a-button type="primary" @click="onSubmit">确定</a-button>
      </div>
    </a-drawer>
  </page-header-wrapper>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
const columns = [
  {
    title: '账户名称',
    dataIndex: 'username',
    key: 'username',
    scopedSlots: { customRender: 'username' },
  },
  {
    title: '账户类型',
    dataIndex: 'userType',
    key: 'userType',
    scopedSlots: { customRender: 'userType' },
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '是否启用',
    key: 'ban',
    dataIndex: 'ban',
    scopedSlots: { customRender: 'ban' },
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  data() {
    return {
      columns,
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      form: {
        username: '',
        userType: undefined,
        date: undefined,
        ban: false,
      },
      formMode: 'view',
      rules: {
        username: {
          required: true,
          message: '请填写账户名称',
          // trigger: 'blur',
        },
        date: {
          required: true,
          message: '请选择时间',
          trigger: 'change',
        },
      },
      searcher: {
        username: '',
      },
    }
  },
  computed: {
    ...mapState({
      accountState: (state) => {
        return state.account
      },
    }),
  },
  created() {
    this.getList()
  },
  methods: {
    ...mapActions('account', {
      GetAll: 'GetAll',
      Create: 'Create',
      Update: 'Update',
      Delete: 'Delete',
    }),
    getList(current = 1, searcher = {}) {
      this.GetAll({ current, ...searcher })
    },
    showDrawer() {
      this.visible = true
    },
    hideDrawer() {
      this.visible = false
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.formMode === 'create') {
            this.Create({
              ...this.form,
              ban: this.form.ban ? 1 : 0,
            }).then((res) => {
              if (res.success) {
                this.$message.info('创建成功')
                this.hideDrawer()
                this.getList(1)
              }
            })
          } else if (this.formMode === 'update') {
            this.Update({
              ...this.form,
              ban: this.form.ban ? 1 : 0,
            }).then((res) => {
              if (res.success) {
                this.$message.info('更新成功')
                this.hideDrawer()
                this.getList(1)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    onEdit(record) {
      this.showDrawer()
      this.formMode = 'update'
      this.form = {
        ...record,
        date: moment(record.createTime),
        ban: record.ban === 1 ? true : false,
      }
    },
    onView(record) {
      this.showDrawer()
      this.formMode = 'view'
      this.form = {
        ...record,
        date: moment(record.createTime),
        ban: record.ban === 1 ? true : false,
      }
    },
    onCreate() {
      this.showDrawer()
      this.form = {}
      this.formMode = 'create'
    },
    onDelete(record) {
      this.Delete({ id: record.id }).then((res) => {
        if (res.success) {
          this.$message.info('删除成功')
          this.getList()
        }
      })
    },
    resetForm() {
      setTimeout(() => {
        this.$refs.ruleForm.resetFields()
      }, 10)
    },
    handleTableChange(pagination) {
      this.getList(pagination.current)
    },
    banOnChange(value, record) {
      this.Update({
        ...this.form,
        ban: value ? 1 : 0,
      }).then((res) => {
        if (res.success) {
          this.$message.info('更新成功')
          this.getList(1)
        }
      })
    },
    onSearch() {
      this.$refs.searchForm.validate((valid) => {
        this.getList(1, this.searcher)
      })
    },
    onReset() {
      this.$refs.searchForm.resetFields()
      this.getList()
    },
  },
}
</script>

<style scope="less">
.table-wrap {
  margin-top: 20px;
}
.drawer-btn-warp {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 4px;
  padding-top: 4px;
  padding-right: 40px;
  border-top: 1px solid #e8e8e8;
}
.closed-btn {
  margin-right: 14px;
}
</style>