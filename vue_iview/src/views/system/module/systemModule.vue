<template>
<div>
   <gz-panel ref="gzPanelModule" class="borderPanel" :childFull100=true :autoHeight=true >
            <div slot="top" class="tools"  v-if="sortStatus">    
               <Button type="text">排序已开启</Button>
                <ButtonGroup class="tooltipButtonGroup float-right">
                  <Tooltip content="应用" placement="bottom-start" >
                    <gz-button  type="primary" icon="checkmark" @click="event_moduleSortSubmitClick"></gz-button >
                  </Tooltip>
                    <Tooltip content="取消" placement="bottom-start">
                    <gz-button  icon="close" @click="event_moduleSortCancelClick"></gz-button >
                  </Tooltip>
                </ButtonGroup>
            </div>
              <div slot="top" v-else class="tools" >    
                <Tooltip content="刷新" placement="bottom-start">
                  <gz-button ref="moduleRefresh" icon="refresh" @click="event_moduleRefreshClick" :showText='false' />
                </Tooltip>
                <ButtonGroup  class="tooltipButtonGroup">
                  <Tooltip content="新增" placement="bottom-start" >
                    <gz-button  type="primary" icon="plus" @click="event_moduleAddClick"></gz-button >
                  </Tooltip>
                  <Tooltip content="修改" placement="bottom-start" >
                    <gz-button type="success" icon="edit"  @click="event_moduleEditClick"></gz-button>
                    </Tooltip>
                    <Tooltip content="删除" placement="bottom-start">
                    <gz-button  type="error" icon="close"  @click="event_moduleDeleteClick"></gz-button >
                    </Tooltip>
                </ButtonGroup>
              </div>
              <div slot="main">
                <Table ref="tableModule" size="small" class="gztag" :loading="isLoading" :columns="columns" :data="data" @on-row-click="event_moduleSelect"  highlight-row border></Table>
              </div>
          </gz-panel>
           <Modal
                ref="modalModule"
                title="模块新增"
                v-model="modalStatus"
                width=80
                :styles="{'max-width':'500px'}"
                :mask-closable="false"
                :loading="(true)"
                @on-ok="event_moduleEditDataSubmit"
                @on-cancel="event_moduleEditCancel">
                <Form ref="formModule" :model="editData" :rules="dataRule"  label-position="left" :label-width="80">
                <FormItem label="模块编码" prop="name">
                    <i-input v-model="editData.name" placeholder="请输入模块编码"></i-input>
                </FormItem>
                <FormItem label="模块名称" prop="description">
                    <i-input v-model="editData.description" placeholder="请输入模块名称"></i-input>
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
                <FormItem label="组件类型" prop="componentPath">
                    <Select v-model="editData.componentPath" placeholder="请选择组件类型">
                        <Option value="views">views</Option>
                        <Option value="components">components</Option>
                    </Select>
                </FormItem>
                <FormItem label="组件路径" prop="componentName">
                    <Input v-model="editData.componentName" placeholder="请输入组件路径"></Input>
                </FormItem>
                </Form>
        </Modal>    
    </div>
</template>
<style lang="less">
.table-cell-index .ivu-table-cell {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
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
import { requestModule } from "../../../libs/request";
import Msg from "../../../mixins/msg";

export default {
  name: "systemModule",
  mixins: [Msg],
  data() {
    return {
      columns: [
        {
          title: "序号",
          type: "index",
          width: 50,
          align: "center",
          className: "table-cell-index"
        },
        {
          title: "描述",
          key: "description"
        }
      ],
      data: [],
      editData: {},
      dataRule: {
        name: [{ required: true, message: "模块编码不能为空", trigger: "blur" }],
        description: [
          { required: true, message: "模块名称不能为空", trigger: "blur" },
          {
            type: "string",
            min: 2,
            max: 6,
            message: "组件名称长度必须大于2且小于6",
            trigger: "blur"
          }
        ],
        componentPath: [
          { required: true, message: "请选择组件类型", trigger: "change" }
        ],
        componentName: [
          { required: true, message: "组件路径不能为空", trigger: "blur" }
        ]
      },
      editStatus: 0,
      sortStatus: false,
      sortCache: [],
      isLoading: false
    };
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
    this.load();
  },
  methods: {
    load() {
      this.$refs["moduleRefresh"].handleClick();

      var me = this;
      //模块排序
      var elModule = this.$refs["tableModule"].$children[1].$el.children[1];
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
    },
    //选择一个模块，加载模块功能
    event_moduleSelect(row, index) {
      //this.selectModule = row;
      this.$emit("selectChanged", row);
      // this.doModuleFormRefresh()
      //   .then()
      //   .catch();
    },
    //模块排序提交
    event_moduleSortSubmitClick(component) {
      var tmp_data = this.$utils.deepCopyEx(this.data);
      for (let i = 0; i < tmp_data.length; i++) {
        tmp_data[i]["sort"] = this.sortCache.indexOf(i);
      }
      requestModule
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
    //模块排序取消
    event_moduleSortCancelClick(component) {
      this.sortStatus = false;
      this.doModuleRefresh()
        .then(res => {
          component.loading = false;
        })
        .catch(err => {
          component.loading = false;
        });
    },

    //刷新模块点击事件
    event_moduleRefreshClick(component) {
      this.isLoading = true;
      this.doModuleRefresh()
        .then(res => {
          component.loading = false;
          this.isLoading = false;
        })
        .catch(err => {
          component.loading = false;
          this.isLoading = false;
        });
    },
    //新增模块点击事件
    event_moduleAddClick(component) {
      this.editData = {};
      this.editStatus = 1;
      component.loading = false;
    },

    //修改模块点击事件
    event_moduleEditClick(component) {
      var v = this.$utils.searchObserver(
        this.$refs.tableModule.objData,
        null,
        p => {
          return p._isHighlight == true;
        }
      );
      if (!v) {
        component.loading = false;
        this.showWarning("请先选择要编辑的模块");
        return;
      }
      requestModule
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
    //删除模块点击事件
    event_moduleDeleteClick(component) {
      var v = this.$utils.searchObserver(
        this.$refs.tableModule.objData,
        null,
        p => {
          return p._isHighlight == true;
        }
      );
      if (!v) {
        component.loading = false;
        this.showWarning("请先选择要编辑的模块");
        return;
      }
      var me = this;
      var title = "警告";
      var content = "确定要删除【" + v.description + "】模块吗？删除以后模块功能也会清空";
      this.ask(
        title,
        content,
        () => {
          requestModule
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

    //模块编辑数据提交事件
    event_moduleEditDataSubmit() {
      debugger;
      this.$refs["formModule"].validate(valid => {
        if (valid) {
          this.doModuleSubmit();
        } else {
          this.showError("表单验证失败!");
          this.$refs.modalModule.buttonLoading = false;
        }
      });
    },
    //取消模块编辑
    event_moduleEditCancel() {
      this.editData = {};
      this.editStatus = 0;
    },

    //刷新模块
    doModuleRefresh() {
      var me = this;
      return new Promise(function(resolve, reject) {
        requestModule
          .list(me)
          .then(res => {
            me.data = res.data;
            me.sortCache = [];
            for (let i = 0; i < res.data.length; i++) {
              me.sortCache.push(i);
            }
            resolve(res);
          })
          .catch(err => {
            me.data = {};
            me.sortCache = [];
            reject(err);
          });
      });
    },

    doModuleSubmit() {
      var req;
      var me = this;
      // 新增 or 修改
      if (this.editStatus == 1) {
        this.editData["sort"] = this.data.length;
        req = requestModule.create(this, this.editData);
      } else req = requestModule.update(this, this.editData);
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
          me.$refs.modalModule.buttonLoading = false;
        });
    }
  }
};
</script>



