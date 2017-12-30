<template>
  <div class="content">
    <div class="borderPanel">
      <gz-panel>
        <div slot="top">
          <div class="title">用户管理</div>
          <div class="tools">
            <gz-button :ref="refNames.buttonRefresh" icon="refresh" @click="event_buttonRefreshClick" text="刷新" />
            <ButtonGroup class="tooltipButtonGroup">
              <gz-button type="primary" icon="plus" @click="event_buttonAddClick" v-permission="1" text="新增"></gz-button>
              <gz-button type="success" icon="edit" @click="event_buttonEditClick" v-permission="2" text="修改"></gz-button>
              <gz-button type="error" icon="close" @click="event_buttonDeleteClick" v-permission="4" text="删除"></gz-button>
            </ButtonGroup>
            <gz-button type="success" icon="edit" @click="event_buttonAuthorizeClick" v-permission="8" text="用户权限"></gz-button>
          </div>
        </div>
        <div slot="main" class="main">
          <gz-panel>
            <div slot="main">
              <Table :ref="refNames.table_ListData" size="small" :loading="listData.isLoading" :columns="listData.columns" :data="listData.data"
                highlight-row border></Table>
            </div>
            <div slot="bottom" style="padding: 10px;overflow: hidden">
              <div style="float: right;">
                <Page placement="top" :total="listData.totalPage" :ref="refNames.listDataPage" :pageSizeOpts="listData.pageSizeOpts" :current="listData.currentPage"
                  :pageSize="listData.pageSize" size="small" show-elevator show-sizer @on-change="event_pageChangePage" @on-page-size-change="event_pageSizeChange"></Page>
              </div>
            </div>
          </gz-panel>
        </div>
      </gz-panel>
      <Modal :ref="refNames.detailModal" title="用户详情" v-model="modalStatus" width=80 :styles="{'max-width':'500px'}" :mask-closable="false"
        :loading="(true)" @on-ok="event_editDataSubmit" @on-cancel="event_editCancel">
        <Form :ref="refNames.editForm" :model="editData" :rules="dataRule" label-position="left" :label-width="80">
          <FormItem label="用户账号" prop="account">
            <i-input v-model="editData.account" placeholder="请输入用户账号"></i-input>
          </FormItem>
          <FormItem label="姓名" prop="userName">
            <i-input v-model="editData.userName" placeholder="请输入姓名"></i-input>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <Select v-model="editData.sex" placeholder="请选择性别">
              <Option value="1">男</Option>
              <Option value="2">女</Option>
            </Select>
          </FormItem>
          <FormItem label="公司" prop="companyID">
            <SelectCompany v-model="editData.companyID" @onSelected="onCompanyChanged"></SelectCompany>
          </FormItem>
          <FormItem label="部门" prop="deptID">
            <SelectDept :companyID="editData.companyID" v-model="editData.deptID" @onSelected="onDeptChanged"></SelectDept>
          </FormItem>
          <FormItem label="联系电话" prop="phone">
            <i-input v-model="editData.phone" placeholder="请输入联系电话"></i-input>
          </FormItem>
          <FormItem label="状态" prop="status">
            <i-input v-model="editData.status" disabled></i-input>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <i-input v-model="editData.remark" placeholder="请输入备注信息"></i-input>
          </FormItem>
        </Form>
      </Modal>
      <FormTreeData ref="refAuthorize"></FormTreeData>
    </div>
  </div>
</template>
<style lang="less" scoped>
.title {
  height: 32px;
  line-height: 32px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  color: #666;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
  padding-left: 9px;
  font-size: 12px;
  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  -khtml-user-select: text;
  user-select: text;
}

.table-cell-index {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
<script>
import { requestUser } from "../../libs/request";
import SelectCompany from "./selectCompany";
import SelectDept from "./selectDept";
import Msg from "../../mixins/msg";
import Authorize from "../../mixins/authorize";
import FormTreeData from "./treeForm.vue";
export default {
  mixins: [Msg,Authorize],
  data() {
    return {
      listData: {
        isLoading: false,
        columns: [
          {
            title: "序号",
            type: "index",
            width: 50,
            className: "table-cell-index",
            align: "center"
          },
          {
            title: "账号",
            key: "account"
          },
          {
            title: "姓名",
            key: "userName"
          },
          {
            title: "公司名称",
            key: "companyName"
          },
          {
            title: "部门名称",
            key: "deptName"
          },
          {
            title: "联系电话",
            key: "phone"
          },
          {
            title: "状态",
            key: "status"
          },
          {
            title: "备注",
            key: "remark"
          }
        ],
        data: [],
        totalPage: 0,
        currentPage: 1,
        pageSize: 20,
        pageSizeOpts: [10, 20, 50, 100]
      },
      refNames: {
        isLoading: false,
        buttonRefresh: "buttonRefresh",
        table_ListData: "table_ListData",
        detailModal: "detailModal",
        editForm: "editForm",
        listDataPage: "listDataPage"
      },
      editData: {},
      editStatus: 0,
      dataRule: {
        account: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        userName: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            min: 3,
            max: 20,
            message: "姓名长度必须大于3且小于20",
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: true,
            message: "性别不能为空",
            trigger: "blur"
          }
        ],
        companyID: [
          {
            required: true,
            message: "公司不能为空",
            trigger: "blur"
          }
        ],
        deptID: [
          {
            required: true,
            message: "部门不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    SelectCompany,
    SelectDept,
    FormTreeData
  },
  computed: {
    modalStatus: {
      get() {
        return this.editStatus > 0;
      },
      set(value) {
        if (value == false) this.editStatus = 0;
      }
    }
  },
  created() {},
  mounted() {
    this.$refs[this.refNames.buttonRefresh].handleClick();
  },
  methods: {
    // 设置权限
    event_buttonAuthorizeClick( component) {
      var v = this.doGetSelect();
      if (!v) {
        component.loading = false;
        return;
      }
      this.$refs["refAuthorize"].updateData(1, v.rowID);
      this.$refs["refAuthorize"].show();
      component.loading = false;
    },
    // 刷新
    event_buttonRefreshClick( component) {
      this.listData.isLoading = true;
      this.doRefresh()
        .then(res => {
          component.loading = false;
          this.listData.isLoading = false;
        })
        .catch(err => {
          component.loading = false;
          this.listData.isLoading = false;
        });
    },
    event_pageChangePage(page) {
      this.$refs[this.refNames.buttonRefresh].handleClick();
    },
    event_pageSizeChange(pageSize) {
      this.$refs[this.refNames.buttonRefresh].handleClick();
    },
    // 新增
    event_buttonAddClick( component) {
      this.editData = {};
      this.editStatus = 1;
      component.loading = false;
    },
    // 修改
    event_buttonEditClick( component) {
      var v = this.doGetSelect();
      if (!v) {
        component.loading = false;
        return;
      }
      requestUser
        .get(this, v.rowID)
        .then(res => {
          this.editData = res.data;
          this.editStatus = 2;
          component.loading = false;
        })
        .catch(err => {
          component.loading = false;
        });
    },
    // 删除
    event_buttonDeleteClick( component) {
      var v = this.doGetSelect();
      if (!v) {
        component.loading = false;
        return;
      }
      var me = this;
      var title = "警告";
      var content = "确定要删除用户【" + v.userName + "】吗?";
      this.ask(
        title,
        content,
        () => {
          requestUser
            .delete(me, v.rowID)
            .then(res => {
              var index = me.$utils.searchJsonIndex(me.listData.data, p => {
                return p.rowID == v.rowID;
              });
              me.data.splice(index, 1);
              me.showInfo("删除成功");
              component.loading = false;
            })
            .catch(err => {
              component.loading = false;
            });
        },
        () => {
          component.loading = false;
        }
      );
    },

    //编辑数据提交事件
    event_editDataSubmit() {
      var me = this;
      this.$refs[this.refNames.editForm].validate(valid => {
        if (valid) {
          var req;
          // 新增 or 修改
          if (this.editStatus == 1) {
            req = requestUser.create(this, this.editData);
          } else req = requestUser.update(this, this.editData);
          req
            .then(res => {
              if (me.editStatus == 1) {
                //新增
                me.listData.data.push(res.data);
              } else {
                var index = me.$utils.searchJsonIndex(me.listData.data, p => {
                  return p.rowID == me.editData.rowID;
                });
                me.listData.data.splice(index, 1, me.editData);
              }
              me.editStatus = 0;
              me.showInfo("保存成功", 3);
            })
            .catch(err => {
              me.$refs[this.refNames.detailModal].buttonLoading = false;
            });
        } else {
          this.showError("表单验证失败!");
          this.$refs[this.refNames.detailModal].buttonLoading = false;
        }
      });
    },
    //编辑取消
    event_editCancel() {
      this.editData = {};
      this.editStatus = 0;
    },
    onCompanyChanged(value, obj) {
      this.editData.companyName = obj.label;
      this.editData.deptID = "";
      this.editData.deptName = "";
    },
    onDeptChanged(value, obj) {
      this.editData.deptName = obj.label;
    },
    doGetSelect() {
      var v = this.$utils.searchObserver(
        this.$refs[this.refNames.table_ListData].objData,
        null,
        p => {
          return p._isHighlight == true;
        }
      );
      if (!v) {
        this.showWarning("没有选择用户");
        return null;
      }
      return v;
    },
    //刷新
    doRefresh() {
      var me = this;
      return new Promise(function(resolve, reject) {
        requestUser
          .list(me, me.listData.currentPage, me.listData.pageSize)
          .then(res => {
            me.listData.totalPage = res.data.totalPage;
            me.listData.data = res.data.data;
            resolve(res);
          })
          .catch(err => {
            me.listData.data = [];
            reject(err);
          });
      });
    }
  }
};
</script>
