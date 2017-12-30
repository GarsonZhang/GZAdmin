<template>
  <div class="content">
    <div class="borderPanel">
      <gz-panel>
        <div slot="top">
          <!-- <div class="title">API注册</div> -->
          <div class="tools">
            <Tooltip content="刷新" placement="bottom-start">
              <gz-button :ref="refNames.buttonRefresh" icon="refresh" @click="event_buttonRefreshClick" :showText='false' />
            </Tooltip>
            <ButtonGroup class="tooltipButtonGroup">
              <gz-button type="primary" icon="android-archive" :permission=1 @click="event_buttonImportClick" :text="$t('import')"></gz-button>
              <gz-button type="success" icon="edit" :permission=2 @click="event_buttonEditClick" :text="$t('modify')"></gz-button>
              <gz-button type="error" icon="close" :permission=4 @click="event_buttonDeleteClick" :confirmTitle="confirmTitleDelete" :validateShowConfirm="validateDelete" :text="$t('delete')"></gz-button>
            </ButtonGroup>
            <!-- <DatePicker type="date" :placeholder="placeholderDate"></DatePicker> -->
             <i-input class="queryInput" v-model="queryStr" icon="ios-search">
                <Button slot="append" icon="ios-search" @click="getList"></Button>
             </i-input>
          </div>

        </div>
        <div slot="main">
          <gz-panel @onMainResize="onResizeHeight">
            <div slot="main" class="main">
              <Table :height="tableHeight" :ref="refNames.table_ListData" size="small" :loading="listData.isLoading" :columns="listData_columns"
                :data="listData.data" highlight-row border></Table>
            </div>
            <div slot="bottom" style="padding: 10px;overflow: hidden">
              <div style="float: right;">
                <Page :total="listData.totalPage" :pageSizeOpts="listData.pageSizeOpts" :current="listData.currentPage" :pageSize="listData.pageSize"
                  size="small" placement="top" :ref="refNames.listDataPage" show-elevator show-sizer @on-change="event_pageChangePage"
                  @on-page-size-change="event_pageSizeChange"></Page>
              </div>
            </div>
          </gz-panel>


        </div>
      </gz-panel>
      <Modal :ref="refNames.detailModal" title="API详情" v-model="modalStatus" width=80 :styles="{'max-width':'500px'}" :mask-closable="false"
        :loading="(true)" @on-ok="event_editDataSubmit" @on-cancel="event_editCancel">
        <Form :ref="refNames.editForm" :model="editData" :rules="dataRule" label-position="left" :label-width="80">
          <FormItem label="接口名称" prop="APIName">
            <Input v-model="editData.APIName" placeholder="请输入API名称" />
          </FormItem>
          <FormItem label="URL" prop="url">
            <i-input v-model="editData.url" readonly></i-input>
          </FormItem>
          <FormItem label="验证类型" prop="checkType">
            <Select v-model="editData.checkType" placeholder="API安全" label-in-value @on-change="event_checkTypeChanged">
              <Option v-for="item in [{value:0,label:'匿名访问'},{value:1,label:'登陆用户'},{value:2,label:'权限用户'}]" :key="item.value" :value="item.value">{{item.label}}</Option>
              <!-- <Option value=0>公开</Option>
                        <Option value=2>验证</Option> -->
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
  </div>
</template>
<style lang="less" scoped>
.queryInput{
      width: 250px;
    display: inline-table;
}
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

.main {
  overflow-y: auto;
}
</style>
<script>
import { requestAPIList } from "../../libs/request";
import Msg from "../../mixins/msg";
import tableHead from "../../components/iview/table/table-head.vue";
export default {
  mixins: [Msg],
  data() {
    return {
      queryStr: "",
      confirmTitleDelete: "删除提醒",
      tableHeight: 100,
      listData: {
        isLoading: false,
        data: [],
        totalPage: 0,
        currentPage: 1,
        pageSize: 20,
        pageSizeOpts: [10, 20, 50, 100],
        currentData: {}
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
        APIName: [
          {
            required: true,
            message: "接口名称不能为空",
            trigger: "blur"
          }
        ],
        checkType: [
          {
            // type:number,
            // required: true,
            // message: "权限类型不能为空",
            // trigger: "blur"
            type: "enum",
            enum: [0, 1,2]
          }
        ]
      }
    };
  },
  components: {
    tableHead
  },
  computed: {
    modalStatus: {
      get() {
        return this.editStatus > 0;
      },
      set(value) {
        if (value == false) this.editStatus = 0;
      }
    },
    listData_columns() {
      return [
        {
          title: this.$t("apiReg.columns.index"),
          type: "index",
          width: 50,
          className: "table-cell-index",
          align: "center"
        },
        {
          title: this.$t("apiReg.columns.APIName"),
          key: "APIName"
        },
        {
          title: this.$t("apiReg.columns.url"),
          key: "url"
        },
        {
          title: this.$t("apiReg.columns.checkTypeName"),
          key: "checkTypeName"
        }
      ];
    },
    // lang(){
    //   return this.$lang;
    // }
  },
  watch: {
    $lang(val) {
      // debuggerdebugger
      this.listData.pageSizeOpts.push(0);
      this.listData.pageSizeOpts.splice(this.listData.pageSizeOpts.length, 1);
    }
  },
  created() {},
  mounted() {
    this.$refs[this.refNames.buttonRefresh].handleClick();
  },
  methods: {
    event_checkTypeChanged(a, b) {
      this.editData.checkTypeName = a.label;
    },
    onResizeHeight(width, height) {
      // debugger
      this.tableHeight = height;
    },
    // 刷新
    event_buttonRefreshClick(component) {
      this.listData.isLoading = true;
      this.doRefresh(()=>{
           component.loading = false;
          this.listData.isLoading = false;
      })
    },
    getList(){
 this.doRefresh();
    },
    event_pageChangePage(page) {
      this.listData.currentPage = page;
      this.$refs[this.refNames.buttonRefresh].handleClick();
    },
    event_pageSizeChange(pageSize) {
      if (this.$utils.isNULL(pageSize)) return;
      this.listData.pageSize = pageSize;
      this.$refs[this.refNames.buttonRefresh].handleClick();
    },
    // 导入
    event_buttonImportClick(component) {
      var _this = this;
      requestAPIList
        .import(this)
        .then(res => {
          _this.listData.currentPage = 1;
          _this.$refs[this.refNames.buttonRefresh].handleClick();
          _this.showInfo(this.$t("apiReg.importMsg", [res.data]));
          component.loading = false;
        })
        .catch(err => {
          component.loading = false;
        });
    },
    // 修改
    event_buttonEditClick(component) {
      var v = this.doGetSelect();
      if (!v) {
        component.loading = false;
        return;
      }
      requestAPIList
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

    validateDelete() {
      this.listData.currentData = this.doGetSelect();
      if (!this.listData.currentData) {
        return false;
      }
      debugger;
      this.confirmTitleDelete = this.$t("apiReg.deleteConfirm", [
        this.listData.currentData.APIName
      ]);
      return true;
    },
    // 删除
    event_buttonDeleteClick(component) {
      debugger;
      requestAPIList
        .delete(this, this.listData.currentData.rowID)
        .then(res => {
          debugger;
          var index = this.$utils.searchJsonIndex(this.listData.data, p => {
            return p.rowID == this.listData.currentData.rowID;
          });
          this.listData.data.splice(index, 1);
          this.showInfo("删除成功");
          component.loading = false;
        })
        .catch(err => {
          component.loading = false;
        });

      // var v = this.doGetSelect();
      // if (!v) {
      //   component.loading = false;
      //   return;
      // }
      // var me = this;
      // var title = "警告";
      // var content = "确定要删除接口【" + v.APIName + "】吗?";
      // this.ask(
      //   title,
      //   content,
      //   () => {
      //     requestAPIList
      //       .delete(me, v.rowID)
      //       .then(res => {
      //         // debugger
      //         var index = me.$utils.searchJsonIndex(me.listData.data, p => {
      //           return p.rowID == v.rowID;
      //         });
      //         me.listData.data.splice(index, 1);
      //         me.showInfo("删除成功");
      //         component.loading = false;
      //       })
      //       .catch(err => {
      //         component.loading = false;
      //       });
      //   },
      //   () => {
      //     component.loading = false;
      //   }
      // );
    },

    //编辑数据提交事件
    event_editDataSubmit() {
      var me = this;
      this.$refs[this.refNames.editForm].validate(valid => {
        if (valid) {
          requestAPIList
            .update(this, this.editData)
            .then(res => {
              var index = me.$utils.searchJsonIndex(me.listData.data, p => {
                return p.rowID == me.editData.rowID;
              });
              me.listData.data.splice(index, 1, me.editData);
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
    doGetSelect() {
      var v = this.$utils.searchObserver(
        this.$refs[this.refNames.table_ListData].objData,
        null,
        p => {
          return p._isHighlight == true;
        }
      );
      if (!v) {
        this.showWarning("没有选择数据");
        return null;
      }
      return v;
    },
    //刷新
    doRefresh(callBack) {
       requestAPIList
          .list(this, this.listData.currentPage, this.listData.pageSize,this.queryStr)
          .then(res => {
            this.listData.totalPage = res.data.totalPage;
            this.listData.data = res.data.data;
            if(callBack) callBack();
          })
          .catch(err => {
            this.listData.totalPage=0;
            this.listData.data = [];
             if(callBack) callBack();
          });
    }
  }
};
</script>
