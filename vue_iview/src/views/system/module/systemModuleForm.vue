<template>
  <div>
    <gz-panel ref="gzPanelForm" class="borderPanel" :childFull100=true>
      <div slot="top" class="tools" v-if="sortStatus">
        <Button type="text">排序已开启</Button>
        <ButtonGroup class="float-right">
          <gz-button type="primary" icon="checkmark" @click="event_moduleFormSortSubmitClick" text="应用" loadingText="提交中"></gz-button>
          <gz-button icon="close" @click="event_moduleFormSortCancelClick" text="取消" loadingText="请稍后"></gz-button>
        </ButtonGroup>
      </div>
      <div slot="top" v-else class="tools">
        <gz-button icon="refresh" text="刷新" loadingText="刷新中" @click="event_moduleFormRefreshClick" />
        <ButtonGroup>
          <gz-button type="primary" icon="plus" @click="event_moduleFormAddClick" text="新增" loadingText="请稍后"></gz-button>
          <gz-button type="success" icon="plus" @click="event_moduleFormEditClick" text="修改" loadingText="请稍后"></gz-button>
          <gz-button type="error" icon="plus" @click="event_moduleFormDeleteClick" text="删除" loadingText="请稍后"></gz-button>
        </ButtonGroup>
        <Button icon="gear-b" type="success" @click="event_configClick">配置权限</Button>

      </div>

      <div slot="main">
        <Table ref="tableModuleForm" highlight-row :loading="isLoading" size="small" class="gztag" :columns="columns" :data="data"></Table>
      </div>
    </gz-panel>
    <Modal ref="modalModuleForm" title="功能新增" v-model="modalStatus" width=80 :styles="{'max-width':'500px'}" :mask-closable="false"
      :loading="(true)" @on-ok="event_moduleFormEditDataSubmit" @on-cancel="event_moduleFormEditCancel">

      <Tabs type="card" size="small">
        <TabPane label="功能信息">
          <Form ref="formModuleForm" :model="editData" :rules="dataRule" label-position="left" :label-width="80">
            <FormItem label="功能编码" prop="name">
              <i-input v-model="editData.name" placeholder="请输入功能编码"></i-input>
            </FormItem>
            <FormItem label="功能名称" prop="description">
              <i-input v-model="editData.description" placeholder="请输入功能名称"></i-input>
            </FormItem>
            <FormItem label="繁体名称" prop="description_tw">
              <i-input v-model="editData.description_tw" placeholder="请输入模块名称"></i-input>
            </FormItem>
            <FormItem label="英文名称" prop="description_en">
              <i-input v-model="editData.description_en" placeholder="请输入模块名称"></i-input>
            </FormItem>
            <FormItem label="其他语言" prop="description_other">
              <i-input v-model="editData.description_other" placeholder="请输入模块名称"></i-input>
            </FormItem>
            <FormItem label="图标" prop="icon">
              <i-input v-model="editData.icon" placeholder="请输入图标"></i-input>
            </FormItem>
            <FormItem label="路由地址" prop="routeName">
              <i-input v-model="editData.routeName" placeholder="请输入路由地址 eg:/org/dept"></i-input>
            </FormItem>
            <FormItem label="组件类型" prop="componentPath">
              <Select v-model="editData.componentPath" placeholder="请选择组件类型">
                <Option value="views">views</Option>
                <Option value="components">components</Option>
              </Select>
            </FormItem>
            <FormItem label="组件路径" prop="componentName">
              <i-input v-model="editData.componentName" placeholder="请输入组件路径 eg:org/page_dept.vue"></i-input>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="Action视图">
          <Alert>如果在此功能下请求没有配置action视图的接口，则会被拦截，报错信息为接口未注册</Alert>
          <Select v-model="editData.actions" filterable multiple transfer>
            <Option v-for="item in apiList" :value="item.rowID" :key="item.rowID">{{ item.url }}</Option>
          </Select>

        </TabPane>
      </Tabs>

    </Modal>

    <Modal ref="modalAuthorize" title="权限视图" v-model="modalStatus_authorize" width=80 :styles="{'max-width':'700px'}" :mask-closable="false"
      :loading="(true)">
      <Alert>权限设置以后，请求相应Action时将会校验权限，没有权限则拦截请求
        <br/>一个权限对应多个Action</Alert>
   
           <Button type="primary" style="margin-bottom:5px;margin-top:-5px;" @click="onAuthorizeAdd">新建</Button>
              <Button style="margin-bottom:5px;margin-top:-5px;" @click="onAuthorizeRefresh">刷新</Button>
      <can-edit-table :loading="authorize.loading" refs="table3" :callDelete="request.delete" primaryKey="rowID" v-model="authorize.data"
        @on-edit="onAuthorizeEdit" :hover-show="true" :edit-incell="true" :columns-list="authorize.columns"></can-edit-table>
      <div slot="footer">
      </div>
    </Modal>

    <Modal ref="modalAuthorizeAction" title="权限编辑" v-model="modalStatus_authorizeEdit" width=80 :styles="{'max-width':'500px'}"
      :mask-closable="false" :loading="(true)" @on-ok="event_authorizeEditDataSubmit" @on-cancel="event_authorizeEditCancel">
      <Form ref="authorizeForm" :model="authorize.editData" :rules="authorize.dataRule" label-position="left" :label-width="80">
        <FormItem label="权限名称" prop="authorizeName">
          <i-input v-model="authorize.editData.authorizeName" placeholder="请输入权限名"></i-input>
        </FormItem>
        <FormItem label="权限值" prop="authorizeValue">
          <InputNumber :max="65536" :min="1" v-model="authorize.editData.authorizeValue" placeholder="请输入权限值"></InputNumber>
        </FormItem>
        <FormItem label="Actions" prop="actions">
          <Select v-model="authorize.editData.actions" filterable multiple transfer>
            <Option v-for="item in authorize.actionList" :value="item.rowID" :key="item.rowID">{{ item.url }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>
<style lang="less" scoped>
.tools {
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 5px;
}

.ivu-tooltip,
.ivu-tooltip-rel {
  position: relative;
  float: left;
  border-radius: 0;
}

.float-right {
  float: right;
}

.tooltipButtonGroup {
  margin-left: 5px;
}

.tooltipButtonGroup > .ivu-tooltip {
  margin-left: -1px;
}

.tooltipButtonGroup > .ivu-tooltip:first-child:not(:last-child) .ivu-btn {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}

.tooltipButtonGroup > .ivu-tooltip:last-child:not(:first-child) .ivu-btn {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

.tooltipButtonGroup .ivu-tooltip:not(:first-child):not(:last-child) .ivu-btn {
  border-radius: 0;
}

.borderPanel {
  border: 1px solid #e9eaec !important;
}
</style>
<script>
import Sortable from "sortablejs";
import {
  requestForm,
  requestAPIList,
  requestFormAuthorize
} from "../../../libs/request";
import Msg from "../../../mixins/msg";
import canEditTable from "../../../components/iview/editTable/canEditTable.vue";

export default {
  name: "systemModuleForm",
  mixins: [Msg],
  components: {
    canEditTable
  },
  data() {
    return {
      request: null,
      // actions: ["74122ff9-66bc-46b5-9d9b-49d74ed626e8", "346488a1-b342-4ba9-8b6d-001997dd9cb3", "f8799864-ed10-4554-bcfe-78c6e138a115", "f9771e51-e34c-49e0-9b7a-d0a36af8a07b", "568ba94e-e0c2-462b-92ea-465f24148fa0", "7e953c79-5b41-4897-b5a6-911569468ed1", "dde9f8b2-f74d-4c39-81b7-1ad50d856f16", "476b1291-3ad6-4554-850f-0eeec2d689c9", "f5afff22-ad51-4566-81fb-3e0f0fa5cfbc", "85becbcc-06b0-4f28-b655-d83d7e449c1a"],
      authorize: {
        formID: "",
        columns: [
          {
            title: "序号",
            type: "index",
            width: 40,
            className: "table-cell-index",
            align: "center"
          },
          {
            title: "名称",
            align: "center",
            key: "authorizeName",
            width: 100
            //editable: true
          },
          {
            title: "值",
            align: "center",
            width: 60,
            key: "authorizeValue"
          },
          {
            title: "Actions",
            key: "actionsDes"
          },
          {
            title: "操作",
            align: "center",
            key: "handle",
            width: 120,
            className: "smallPadding",
            handle: ["edit", "delete"]
          }
        ],
        data: [
          {
            id: 1,
            authorizeName: "新增",
            authorizeValue: 1
          },
          {
            id: 2,
            authorizeName: "删除",
            authorizeValue: 2
          },
          {
            id: 3,
            authorizeName: "修改",
            authorizeValue: 4
          }
        ],
        loading: false,
        actionList: [],
        editData: {},
        currentIndex: -1,
        editStatus: 0,
        dataRule: {
          authorizeName: [
            {
              required: true,
              message: "权限名称不能为空",
              trigger: "blur"
            }
          ]
        }
      },
      modalStatus_authorize: false,
      apiList: [],
      columns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "描述",
          key: "description"
        },
        {
          title: "图标",
          key: "icon"
        },
        {
          title: "路由",
          key: "routeName"
        },
        {
          title: "组件路径",
          key: "componentPath"
        },
        {
          title: "组件名称",
          key: "componentName"
        }
      ],
      data: [],
      editData: {},
      dataRule: {
        name: [
          {
            required: true,
            message: "模块编码不能为空",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "模块名称不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            min: 2,
            max: 6,
            message: "组件名称长度必须大于2且小于6",
            trigger: "blur"
          }
        ],
        routeName: [
          {
            required: true,
            message: "路由不能为空",
            trigger: "blur"
          }
        ],
        componentPath: [
          {
            required: true,
            message: "请选择组件类型",
            trigger: "change"
          }
        ],
        componentName: [
          {
            required: true,
            message: "组件路径不能为空",
            trigger: "blur"
          }
        ]
      },
      editStatus: 0,
      sortStatus: false,
      sortCache: [],
      isLoading: false
    };
  },
  props: {
    moduleID: {
      //设置top样式，height设置无效
      type: String,
      default: ""
    }
  },
  created() {
    this.request = requestFormAuthorize;
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
    modalStatus_authorizeEdit: {
      get() {
        return this.authorize.editStatus > 0;
      },
      set(value) {
        if (value == false) this.authorize.editStatus = 0;
      }
    }
  },
  mounted() {
    var me = this;

    //模块排序
    var elModule = this.$refs["tableModuleForm"].$children[1].$el.children[1];
    Sortable.create(elModule, {
      //排序移动前
      onStart(el) {},
      //排序移动后
      onEnd(el) {
        var v = me.sortCache[el.oldIndex];
        me.sortCache.splice(el.oldIndex, 1);
        me.sortCache.splice(el.newIndex, 0, v);
        if (me.sortStatus === false) me.sortStatus = true;
      },
      //排序选择
      onChoose(el) {}
    });

    requestAPIList
      .list(this, 1, 1000000)
      .then(res => {
        this.apiList = res.data.data;
      })
      .catch(err => {});
  },
  methods: {
    // 权限配置
    event_configClick() {
      var v = this.$utils.searchObserver(
        this.$refs.tableModuleForm.objData,
        null,
        p => {
          return p._isHighlight == true;
        }
      );
      if (!v) {
        this.showWarning("请先选择功能");
        return;
      }

      this.modalStatus_authorize = true;
      this.authorize.loading = true;

      this.authorize.formID = v.rowID;
      // 获得API列表  authorize.actionList
      requestForm
        .actions(this, this.authorize.formID)
        .then(res => {
          this.authorize.actionList = res.data;
          this.authorize.loading = false;
        })
        .catch(err => {
          this.authorize.actionList = [];
        });
      //获得权限列表 authorize.data
      requestFormAuthorize
        .list(this, this.authorize.formID)
        .then(res => {
          res.data.forEach(item => {
            item.actionsDes = item.actionsUrl.join("; \r\n ");
          });

          this.authorize.data = res.data;
        })
        .catch(err => {
          this.authorize.data = [];
        });
    },
    onAuthorizeRefresh() {
      //获得权限列表 authorize.data
      requestFormAuthorize
        .list(this, this.authorize.formID)
        .then(res => {
          res.data.forEach(item => {
            item.actionsDes = item.actionsUrl.join("; \r\n ");
          });

          this.authorize.data = res.data;
        })
        .catch(err => {
          this.authorize.data = [];
        });
    },
    onAuthorizeAdd() {
      this.authorize.editStatus = 1;
      this.authorize.editData = {
        actions: []
      };
    },
    onAuthorizeEdit(data, index, args) {
      this.authorize.editStatus = 2;
      this.authorize.currentIndex = index;
      requestFormAuthorize
        .get(this, data.rowID)
        .then(res => {
          this.authorize.editData = res.data;
        })
        .catch(err => {
          (this.authorize.editData = {}), (this.authorize.currentIndex = -1);
          return;
        });
    },
    event_authorizeEditDataSubmit() {
      this.$refs["authorizeForm"].validate(valid => {
        if (valid) {
          var req;
          var me = this;
          // 新增 or 修改
          if (this.authorize.editStatus == 1) {
            this.authorize.editData["formID"] = this.authorize.formID;
            req = requestFormAuthorize.create(this, this.authorize.editData);
          } else
            req = requestFormAuthorize.update(this, this.authorize.editData);
          req
            .then(res => {
              if (me.authorize.editStatus == 1) {
                //新增
                me.authorize.data.push(res.data);
              } else {
                // var index = me.$utils.searchJsonIndex(me.data, p => {
                //   return p.rowID == me.editData.rowID;
                // });
                me.authorize.data.splice(
                  me.authorize.currentIndex,
                  1,
                  me.authorize.editData
                );
              }
              me.authorize.editStatus = 0;

              me.showInfo("保存成功", 3);
            })
            .catch(err => {
              me.$refs.modalModuleForm.buttonLoading = false;
            });
        } else {
          this.showError("表单验证失败!");
          this.$refs.modalModuleForm.buttonLoading = false;
        }
      });
    },
    event_authorizeEditCancel() {
      this.authorize.editData = {};
      this.authorize.currentIndex = -1;
      this.authorize.editStatus = 0;
    },
    //刷新
    event_moduleFormRefreshClick(component) {
      this.doModuleFormRefresh()
        .then(res => {
          component.loading = false;
        })
        .catch(err => {
          component.loading = false;
        });
    },

    //新增功能点击事件
    event_moduleFormAddClick(component) {
      // debugger;
      if (!this.moduleID || this.moduleID.length < 1) {
        component.loading = false;
        this.showWarning("请先选择模块");
        return;
      }
      this.editData = {};
      this.editData.actions = [];
      this.editStatus = 1;
      component.loading = false;
    },

    //修改功能点击事件
    event_moduleFormEditClick(component) {
      var v = this.$utils.searchObserver(
        this.$refs.tableModuleForm.objData,
        null,
        p => {
          return p._isHighlight == true;
        }
      );
      if (!v) {
        component.loading = false;
        this.showWarning("请先选择要编辑的功能");
        return;
      }
      // debugger
      requestForm
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
    //模块编辑数据提交事件
    event_moduleFormEditDataSubmit() {
      this.$refs["formModuleForm"].validate(valid => {
        if (valid) {
          this.doModuleFormSubmit();
        } else {
          this.showError("表单验证失败!");
          this.$refs.modalModuleForm.buttonLoading = false;
        }
      });
    },
    //取消模块编辑
    event_moduleFormEditCancel() {
      this.editData = {};
      this.editStatus = 0;
    },
    //删除功能点击事件
    event_moduleFormDeleteClick(component) {
      var v = this.$utils.searchObserver(
        this.$refs.tableModuleForm.objData,
        null,
        p => {
          return p._isHighlight == true;
        }
      );
      var me = this;
      var title = "警告";
      var content = "确定要删除功能【" + v.description + "】吗？";
      this.ask(
        title,
        content,
        () => {
          requestForm
            .delete(me, v.rowID)
            .then(res => {
              var index = me.$utils.searchJsonIndex(me.data, p => {
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

    //功能排序提交
    event_moduleFormSortSubmitClick(component) {
      var tmp_data = this.$utils.deepCopyEx(this.data);
      for (let i = 0; i < tmp_data.length; i++) {
        tmp_data[i]["sort"] = this.sortCache.indexOf(i);
      }
      requestForm
        .updateBatch(this, tmp_data)
        .then(res => {
          component.loading = false;
          this.sortStatus = false;
          this.doModuleRefresh()
            .then(res => {})
            .catch(err => {});
        })
        .catch(err => {
          component.loading = false;
        });
    },

    //功能排序取消
    event_moduleFormSortCancelClick(component) {
      this.sortStatus = false;

      this.doModuleFormRefresh()
        .then(res => {
          component.loading = false;
        })
        .catch(err => {
          component.loading = false;
        });
    },

    //加载功能功能
    doModuleFormRefresh() {
      // debugger;
      var me = this;
      this.isLoading = true;
      return new Promise(function(resolve, reject) {
        if (!me.moduleID) {
          me.data = [];
          me.isLoading = false;
          reject("this.moduleID is null");
          me.showWarning("请先选择模块");
          return;
        }
        requestForm
          .list(me, me.moduleID)
          .then(res => {
            // debugger
            me.data = res.data;
            me.sortCatch = [];
            for (let i = 0; i < res.data.length; i++) {
              me.sortCatch.push(i);
            }
            me.isLoading = false;
            resolve(res);
          })
          .catch(err => {
            me.data = [];
            me.sortCatch = [];
            me.isLoading = false;
            reject(err);
          });
      });
    },
    doModuleFormSubmit() {
      var req;
      var me = this;
      // 新增 or 修改
      if (this.editStatus == 1) {
        // debugger
        this.editData["sort"] = this.data.length;
        this.editData["mainID"] = this.moduleID;
        req = requestForm.create(this, this.editData);
      } else req = requestForm.update(this, this.editData);
      req
        .then(res => {
          if (me.editStatus == 1) {
            //新增
            me.data.push(res.data);
            me.sortCache.push(me.data.length - 1);
          } else {
            var index = me.$utils.searchJsonIndex(me.data, p => {
              return p.rowID == me.editData.rowID;
            });
            me.data.splice(index, 1, me.editData);
          }
          me.editStatus = 0;

          me.showInfo("保存成功", 3);
        })
        .catch(err => {
          me.$refs.modalModuleForm.buttonLoading = false;
        });
    }
  },
  watch: {
    moduleID(val) {
      //   debugger
      this.doModuleFormRefresh();
    }
  }
};
</script>