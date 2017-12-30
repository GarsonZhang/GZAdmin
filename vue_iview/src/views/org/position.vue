<template>
    <div class="content fillheight">
         <gz-panel ref="gzPanelForm" :childFull100=true >

              <div slot="top" class="tools" >      
                <gz-button icon="refresh" text="刷新" loadingText="刷新中" @click="event_click_refresh" />
                <ButtonGroup>
                  <gz-button  type="primary" icon="plus" :permission=1 @click="event_click_create" text="新增" loadingText="请稍后"></gz-button >
                  <gz-button  type="success" icon="plus" :permission=2 @click="event_click_edit" text="修改" loadingText="请稍后"></gz-button >
                  <gz-button  type="error" icon="plus" :permission=4 @click="event_click_delete" text="删除" loadingText="请稍后"></gz-button >
                </ButtonGroup>
                <gz-button type="success" icon="edit" @click="event_buttonAuthorizeClick" :permission=8 text="用户权限"></gz-button>
                <gz-button type="success" icon="edit" @click="event_buttonChooseUserClick" :permission=16 text="添加成员"></gz-button>
              </div>

              <div slot="main" class="main">
                <gz-tree-grid :ref="refName_dataList" :columns="columns" :data="data" :nodeKey='dataKey' :childrenKey="dataChildrenKey" :showRowNum="true"></gz-tree-grid>
              </div>
          </gz-panel>

           <Modal
                :ref="refName_modal"
                title="数据编辑"
                v-model="modalStatus"
                width=80
                :styles="{'max-width':'500px'}"
                :mask-closable="false"
                :loading="(true)"
                @on-ok="event_formSubmit"
                @on-cancel="event_formCancel">
                <Form :ref="refName_form" :model="editData" :rules="dataRule"  label-position="left" :label-width="80">
                <FormItem label="岗位编码" prop="posCode">
                    <i-input v-model="editData.posCode" placeholder="请输入岗位编码"></i-input>
                </FormItem>
                <FormItem label="岗位名称" prop="posName">
                    <i-input v-model="editData.posName" placeholder="请输入岗位名称"></i-input>
                </FormItem>
                <FormItem label="上级岗位" prop="parentID">
                  <SelectPosition :ref="refName_formTree" :companyID="companyID" @onSelected="onSelected" v-model="editData.parentID"></SelectPosition>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <i-input v-model="editData.remark" placeholder="请输入备注信息"></i-input>
                </FormItem>
                </Form>
            </Modal>
            <FormTreeData ref="refAuthorize"></FormTreeData>
            <ChooseUser ref="refChooseUser"></ChooseUser>
            
    </div>
</template>
<style lang="less">
.tools {
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 5px;
}
.content {
  height: 100%;
}
.main {
  height: 100%;
}
</style>
<script>
import { requestCommonDataPosition } from "../../libs/request";
import SelectPosition from "./selectPosition";
import Msg from "../../mixins/msg";
import FormTreeData from "./treeForm.vue";
import ChooseUser from "./chooseUser.vue";
export default {
  name: "position",
  data() {
    return {
      request: null,
      columns: [
        {
          title: "岗位编码",
          key: "posCode"
        },
        {
          title: "岗位名称",
          key: "posName"
        },
        {
          title: "备注",
          key: "remark"
        }
      ],
      data: [],
      dataKey: "rowID",
      dataChildrenKey: "children",
      editData: {},
      editStatus: 0,
      dataRule: {
        posCode: [{ required: true, message: "岗位编码不能为空", trigger: "blur" }],
        posName: [
          { required: true, message: "岗位名称不能为空", trigger: "blur" },
          {
            type: "string",
            min: 2,
            max: 20,
            message: "岗位名称长度必须大于1且小于20",
            trigger: "blur"
          }
        ]
      },
      refName_form: "modalForm",
      refName_dataList: "dataList",
      refName_modal: "editModal",
      refName_formTree: "formTree"
    };
  },
  props: {
    companyID: String
  },
  mixins: [Msg],
  components: {
    SelectPosition,
    FormTreeData,
    ChooseUser
  },
  created() {
    this.request = requestCommonDataPosition;
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
  methods: {
    // 设置权限
    event_buttonAuthorizeClick( component) {
      var row = this.$refs[this.refName_dataList].getSelectObj();
      if (!row) {
        component.loading = false;
        this.showWarning("请先选择岗位");
        return;
      }

      this.$refs["refAuthorize"].updateData(2, row.rowID);
      this.$refs["refAuthorize"].show();
      component.loading = false;
    },
    event_buttonChooseUserClick( component) {
      var row = this.$refs[this.refName_dataList].getSelectObj();
      if (!row) {
        component.loading = false;
        this.showWarning("请先选择岗位");
        return;
      }
      // this.$refs["refAuthorize"].updateData(2, row.rowID);
      this.$refs["refChooseUser"].show(row.rowID,1);
      component.loading = false;
    },
    //刷新事件
    event_click_refresh( component) {
      this.doLoadList().then(
        res => {
          component.loading = false;
        },
        err => {
          component.loading = false;
        }
      );
    },
    //新增事件
    event_click_create( component) {
      if (this.$utils.isNULL(this.companyID)) {
        this.showWarning("机构为空，不能添加岗位");
        component.loading = false;
        return;
      }
      this.editData = {};
      this.editStatus = 1;
      component.loading = false;
    },
    //修改事件
    event_click_edit( component) {
      var row = this.$refs[this.refName_dataList].getSelectObj();
      if (!row) {
        component.loading = false;
        this.showWarning("请先选择岗位");
        return;
      }
      this.request
        .get(this, row.rowID)
        .then(res => {
          this.editData = res.data;
          this.editStatus = 2;
          component.loading = false;
        })
        .catch(err => {
          component.loading = false;
        });
    },
    //删除事件
    event_click_delete( component) {
      var row = this.$refs[this.refName_dataList].getSelectObj();
      if (!row) {
        component.loading = false;
        this.showWarning("请先选择岗位");
        return;
      }

      if (row.children && row.children.length > 0) {
        this.showWarning("不允许删除，请先删除子数据");
        component.loading = false;
        return;
      }
      var me = this;
      var title = "提醒";
      var content = "确定要删除岗位【" + row.posName + "】吗？删除以后无法恢复";
      this.showAsk(
        title,
        content,
        () => {
          this.request
            .delete(me, row.rowID)
            .then(res => {
              var obj = this.$utils.jsonSearch.search(
                me.data,
                "children",
                p => {
                  return p.rowID == row.rowID;
                }
              );
              var index = obj.parentNode.children.indexOf(obj);

              obj.parentNode.children.splice(index, 1);
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
    //modal form提交
    event_formSubmit( component) {
      this.$refs[this.refName_form].validate(valid => {
        if (valid) {
          this.doSubmit();
        } else {
          this.showError("表单验证失败!");
          this.$refs[this.refName_modal].buttonLoading = false;
        }
      });
    },
    //modal from取消
    event_formCancel() {
      this.editData = {};
      this.editStatus = 0;
    },
    doSubmit() {
      var req;
      var me = this;
      // 新增 or 修改
      if (this.editStatus == 1) {
        this.editData.companyID = this.companyID;
        req = this.request.create(this, this.editData);
      } else req = this.request.update(this, this.editData);
      req
        .then(res => {
          this.doLoadList();
          me.editStatus = 0;
          me.showInfo("保存成功", 3);
        })
        .catch(err => {
          me.$refs.modalModule.buttonLoading = false;
        });
    },
    //加载列表
    doLoadList() {
      var me = this;
      return new Promise(function(resolve, reject) {
        if (me.$utils.isNULL(me.companyID)) {
          me.data = [];
          resolve(null);
        } else {
          me.request
            .list(me, me.companyID)
            .then(res => {
              // debugger
              me.data = res.data;
              resolve(res);
            })
            .catch(err => {
              me.data = [];
              reject(err);
            });
        }
      });
    },
    onSelected(value, e) {
      var me = this;
      if (this.$utils.isNULL(value)) {
        this.editData.levelID = 0;
        this.editData.parentID = "";
        this.editData.parentFullID = "";
        this.editData.parentFullName = "";
        return;
      }
      if (this.editData.rowID === value) {
        //这里要用异步
        setTimeout(function() {
          me.editData.parentID = "";
        }, 50);
        me.editData.levelID = 0;
        me.editData.parentFullID = "";
        me.editData.parentFullName = "";
        this.showWarning("上级部门不能是自己,请重新选择");
        return;
      }
      if (e.parentID && e.parentID.indexOf("/" + this.editData.rowID) >= 0) {
        //这里要用异步
        setTimeout(function() {
          me.editData.parentID = "";
        }, 50);
        this.editData.levelID = 0;
        me.editData.parentFullID = "";
        me.editData.parentFullName = "";
        this.showWarning("上级部门不能是自己的子部门");
        return;
      }
      this.editData.levelID = (e.levelID ? e.levelID : 0) + 1;
      this.editData.parentFullID = e.parentID + "/" + e.value;
      this.editData.parentFullName = e.parentName + "/" + e.label;
    }
  },
  watch: {
    editStatus(val) {
      if (val > 0) this.$refs[this.refName_formTree].refreshData();
    },
    companyID(val) {
      this.doLoadList();
    }
  }
};
</script>

