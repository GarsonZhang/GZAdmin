<template>
    <div class="content fillheight">
         <gz-panel ref="gzPanelForm" :childFull100=true >

              <div slot="top" class="tools" >      
                <gz-button icon="refresh" text="刷新" loadingText="刷新中" @click="event_click_refresh" />
                <ButtonGroup>
                  <gz-button  type="primary" icon="plus" v-permission="1" @click="event_click_create" text="新增" loadingText="请稍后"></gz-button >
                  <gz-button  type="success" icon="plus" v-permission="2" @click="event_click_edit" text="修改" loadingText="请稍后"></gz-button >
                  <gz-button  type="error" icon="plus" v-permission="4" @click="event_click_delete" text="删除" loadingText="请稍后"></gz-button >
                </ButtonGroup>
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
                <FormItem label="部门编码" prop="deptCode">
                    <Input v-model="editData.deptCode" placeholder="请输入部门编码"></Input>
                </FormItem>
                <FormItem label="部门名称" prop="deptName">
                    <Input v-model="editData.deptName" placeholder="请输入部门名称"></Input>
                </FormItem>
                <FormItem label="上级部门" prop="parentID">
                  <SelectDept :ref="refName_deptTree" :companyID="companyID" @onSelected="onSelected" v-model="editData.parentID"></SelectDept>
                </FormItem>
                <FormItem label="责任人" prop="principalName">
                    <Input v-model="editData.principalName" placeholder="请输入责任人"></Input>
                </FormItem>
                <FormItem label="联系电话" prop="principalPhone">
                    <Input v-model="editData.principalPhone" placeholder="请输入联系电话"></Input>
                </FormItem>
                <FormItem label="邮箱地址" prop="principalEmail">
                    <Input v-model="editData.principalEmail" placeholder="请输入邮箱地址"></Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="editData.remark" placeholder="请输入备注信息"></Input>
                </FormItem>
                </Form>
            </Modal>
    </div>
</template>
<style lang="less">
.tools {
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 5px;
}
.content{
  height: 100%;
}
.main{
  height: 100%;
}
</style>
<script>
import { requestCommonDataDept } from "../../libs/request";
import SelectDept from "./selectDept";
import Msg from "../../mixins/msg";
import Authorize from "../../mixins/authorize";
export default {
  name: "dept",
  data() {
    return {
      request: null,
      columns: [
        {
          title: "部门编码",
          key: "deptCode"
        },
        {
          title: "部门名称",
          key: "deptName"
        },
        {
          title: "部门简称",
          key: "deptShortName"
        },
        {
          title: "责任人",
          key: "principalName"
        },
        {
          title: "联系电话",
          key: "principalPhone"
        },
        {
          title: "邮箱",
          key: "principalEmail"
        }
      ],
      data: [],
      dataKey: "rowID",
      dataChildrenKey: "children",
      editData: {},
      editStatus: 0,
      dataRule: {
        deptCode: [{ required: true, message: "部门编码不能为空", trigger: "blur" }],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            type: "string",
            min: 3,
            max: 20,
            message: "部门名称长度必须大于3且小于20",
            trigger: "blur"
          }
        ]
      },
      refName_form: "modalForm",
      refName_dataList: "dataList",
      refName_modal: "editModal",
      refName_deptTree: "deptTree"
    };
  },
  props: {
    companyID: String
  },
  mixins: [Msg,Authorize],
  components: {
    SelectDept
  },
  created() {
    this.request = requestCommonDataDept;
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
    //刷新事件
    event_click_refresh(component) {
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
    event_click_create(component) {
      // debugger
      if(this.$utils.isNULL(this.companyID)){
        this.showWarning('机构为空，不能添加部门');
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
      // debugger;
      if (!row) {
        component.loading = false;
        this.showWarning("请先选择要修改的部门");
        return;
      }
      this.request
        .get(this,row.rowID)
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
        this.showWarning("请先选择要删除的部门");
        return;
      }

      if (row.children && row.children.length > 0) {
        this.showWarning("不允许删除，请先删除子部门");
        component.loading = false;
        return;
      }
      var me = this;
      var title = "提醒";
      var content = "确定要删除部门【" + row.deptName + "】吗？删除以后无法恢复";
      this.showAsk(
        title,
        content,
        () => {
          this.request
            .delete(me,row.rowID)
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
      // debugger
      if (this.editStatus == 1) {
        this.editData.companyID = this.companyID;
        req = this.request.create(this,this.editData);
      } else req = this.request.update(this,this.editData);
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
        // debugger;
        if (me.$utils.isNULL(me.companyID)) {
          me.data = [];
          resolve(null);
        } else {
          me.request
            .list(me,me.companyID)
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
      // debugger
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
      // debugger
      this.editData.parentFullID = e.parentID + "/" + e.value;
      this.editData.parentFullName = e.parentName + "/" + e.label;
    }
  },
  watch: {
    editStatus(val) {
      if (val > 0) this.$refs[this.refName_deptTree].refreshData();
    },
    companyID(val) {
        // debugger;
      this.doLoadList();
    }
  }
};
</script>

