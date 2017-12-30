<template>
    <div class="content">
         <gz-panel ref="gzPanelForm" :childFull100=true >

              <div slot="top" class="tools" >      
                <gz-button icon="refresh" text="刷新" loadingText="刷新中" @click="event_click_refresh" />
                <ButtonGroup>
                  <gz-button  type="primary" icon="plus" v-permission="1"  @click="event_click_create" text="新增" loadingText="请稍后"></gz-button >
                  <gz-button  type="success" icon="plus" v-permission="2" @click="event_click_edit" text="修改" loadingText="请稍后"></gz-button >
                  <gz-button  type="error" icon="plus"  v-permission="4" @click="event_click_delete" text="删除" loadingText="请稍后"></gz-button >
                </ButtonGroup>
              </div>

              <div slot="main">
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
                <FormItem label="公司编码" prop="companyCode">
                    <i-input v-model="editData.companyCode" placeholder="请输入公司编码"></i-input>
                </FormItem>
                <FormItem label="中文名称" prop="companyName_chs">
                    <i-input v-model="editData.companyName_chs" placeholder="请输入公司中文名称"></i-input>
                </FormItem>
                <FormItem label="英文名称" prop="companyName_en">
                    <i-input v-model="editData.companyName_en" placeholder="请输入公司英文地址"></i-input>
                </FormItem>
                <FormItem label="上级公司" prop="parentID">
                  <SelectCompany :ref="refName_companyTree" @onSelected="onSelected" v-model="editData.parentID"></SelectCompany>
                </FormItem>
                <FormItem label="责任人" prop="principalName">
                    <i-input v-model="editData.principalName" placeholder="请输入责任人"></i-input>
                </FormItem>
                <FormItem label="联系电话" prop="principalPhone">
                    <i-input v-model="editData.principalPhone" placeholder="请输入联系电话"></i-input>
                </FormItem>
                <FormItem label="邮箱地址" prop="principalEmail">
                    <i-input v-model="editData.principalEmail" placeholder="请输入邮箱地址"></i-input>
                </FormItem>
                <FormItem label="公司地址" prop="address">
                    <i-input v-model="editData.address" placeholder="请输入公司地址"></i-input>
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
</style>
<script>
import { ReqCommonDataCompany } from "../../libs/request";
import SelectCompany from "./selectCompany";
import Msg from "../../mixins/msg";
import Authorize from "../../mixins/authorize";
export default {
  data() {
    return {
      request: null,
      columns: [
        {
          title: "公司编码",
          key: "companyCode"
        },
        {
          title: "中文名称",
          key: "companyName_chs"
        },
        {
          title: "英文名称",
          key: "companyName_en"
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
        companyCode: [{ required: true, message: "公司编码不能为空", trigger: "blur" }],
        companyName_chs: [
          { required: true, message: "公司中文名称不能为空", trigger: "blur" },
          {
            type: "string",
            min: 3,
            max: 20,
            message: "中文名称长度必须大于3且小于20",
            trigger: "blur"
          }
        ]
      },
      refName_form: "modalForm",
      refName_dataList: "dataList",
      refName_modal: "editModal",
      refName_companyTree: "companyTree"
    };
  },
  mixins: [Msg,Authorize],
  components: {
    SelectCompany
  },
  created() {
    this.request = ReqCommonDataCompany;
    this.doLoadList();
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
        this.showWarning("请先选择要修改的机构");
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
        this.showWarning("请先选择要删除的机构");
        return;
      }

      if (row.children && row.children.length > 0) {
        this.showWarning("不允许删除，请先删除子公司");
        component.loading = false;
        return;
      }
      var me = this;
      var title = "提醒";
      var content = "确定要删除公司【" + row.companyName_chs + "】吗？删除以后";
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
      if (this.editStatus == 1) {
        // this.editData["sort"] = this.data.length;
        req = this.request.create(this,this.editData);
      } else req = this.request.update(this,this.editData);
      req
        .then(res => {
          // if (me.editStatus == 1) {
          //   //新增
          //   me.data.push(res.data);
          //   // me.sortCache.push(me.data.length - 1);
          // } else {
          //   var index = me.$utils.searchJsonIndex(me.data, p => {
          //     return p.rowID == me.editData.rowID;
          //   });
          //   me.data.splice(index, 1, me.editData);
          // }
          this.doLoadList();
          me.editStatus = 0;
          me.showInfo("保存成功", 3);
        })
        .catch(err => {
          me.$refs[this.refName_modal].buttonLoading = false;
        });
    },
    //加载列表
    doLoadList() {
      var me = this;
      return new Promise(function(resolve, reject) {
        me.request
          .list(me)
          .then(res => {
            me.data = res.data;
            resolve(res);
          })
          .catch(err => {
            me.data = {};
            reject(err);
          });
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
        this.showWarning("上级公司不能是自己,请重新选择");
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
        this.showWarning("上级公司不能是自己的子公司");
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
      if (val > 0) this.$refs[this.refName_companyTree].refreshData();
    }
  }
};
</script>

