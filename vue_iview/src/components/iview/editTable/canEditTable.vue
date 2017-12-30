<style lang="less">
.show-edit-btn {
  display: none;
  margin-left: -10px;
}
.ivu-table-cell:hover .show-edit-btn {
  display: inline-block;
}
</style>

<template>
    <div>
        <Table size="small" :ref="refs" :columns="columnsList" :loading="loading" :data="thisTableData" border disabled-hover></Table>
    </div>
</template>

<script>
const editButton = (vm, h, currentRow, index) => {
  return h(
    "Button",
    {
      props: {
        type: currentRow.editting ? "success" : "primary",
        loading: currentRow.saving
      },
      style: {
        margin: "0 5px"
      },
      on: {
        click: () => {
          if (!currentRow.editting) {
            if (currentRow.edittingCell) {
              for (let name in currentRow.edittingCell) {
                currentRow.edittingCell[name] = false;
                vm.edittingStore[index].edittingCell[name] = false;
              }
            }
            vm.edittingStore[index].editting = true;
            vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
          } else {
            vm.edittingStore[index].saving = true;
            vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
            let edittingRow = vm.edittingStore[index];
            edittingRow.editting = false;
            edittingRow.saving = false;
            vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
            vm.$emit("input", vm.handleBackdata(vm.thisTableData));
            vm.$emit("on-change", vm.handleBackdata(vm.thisTableData), index);
          }
        }
      }
    },
    currentRow.editting ? "保存" : "编辑"
  );
};
const deleteButton = (vm, h, currentRow, index) => {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title: "您确定要删除这条数据吗?",
        transfer: true
      },
      on: {
        "on-ok": () => {
          var obj = vm.handleBackObj(vm.thisTableData[index]);
          if (vm.callDelete != null) {
            // 从后台删除，异步请求
            var id = obj[vm.primaryKey]; //获得主键
            // debugger
              vm.callDelete(vm,id)
              .then(err => {
                vm.thisTableData.splice(index, 1);
                vm.$emit("input", vm.handleBackdata(vm.thisTableData));
                vm.$emit("after-delete", obj, index);
              })
              .catch(err=>{
                
              });
          } else {
            vm.thisTableData.splice(index, 1);
            vm.$emit("input", vm.handleBackdata(vm.thisTableData));
            vm.$emit("after-delete", obj, index);
          }
        }
      }
    },
    [
      h(
        "Button",
        {
          style: {
            margin: "0 5px"
          },
          props: {
            type: "error",
            size:"small",
            placement: "top"
          }
        },
        "删除"
      )
    ]
  );
};

const gzEditButton = (vm, h, currentRow, index) => {
  return h(
    "Button",
    {
      props: {
        type: "success",
        size:"small"
      },
      style: {
        margin: "0 5px"
      },
      on: {
        click: () => {
          var obj = vm.handleBackObj(vm.thisTableData[index]);
          // debugger;
          var tmp = vm.$emit("on-edit", obj, index);
        }
      }
    },
    "编辑"
  );
};

const incellEditBtn = (vm, h, param) => {
  if (vm.hoverShow) {
    return h(
      "div",
      {
        class: {
          "show-edit-btn": vm.hoverShow
        }
      },
      [
        h("Button", {
          props: {
            type: "text",
            icon: "edit"
          },
          on: {
            click: event => {
              vm.edittingStore[param.index].edittingCell[
                param.column.key
              ] = true;
              vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
            }
          }
        })
      ]
    );
  } else {
    return h("Button", {
      props: {
        type: "text",
        icon: "edit"
      },
      on: {
        click: event => {
          vm.edittingStore[param.index].edittingCell[param.column.key] = true;
          vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
        }
      }
    });
  }
};
const saveIncellEditBtn = (vm, h, param) => {
  return h("Button", {
    props: {
      type: "text",
      icon: "checkmark"
    },
    on: {
      click: event => {
        vm.edittingStore[param.index].edittingCell[param.column.key] = false;
        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
        vm.$emit("input", vm.handleBackdata(vm.thisTableData));
        vm.$emit(
          "on-cell-change",
          vm.handleBackdata(vm.thisTableData),
          param.index,
          param.column.key
        );
      }
    }
  });
};
const cellInput = (vm, h, param, item) => {
  return h("Input", {
    props: {
      type: "text",
      value: vm.edittingStore[param.index][item.key]
    },
    on: {
      "on-change"(event) {
        let key = item.key;
        vm.edittingStore[param.index][key] = event.target.value;
      }
    }
  });
};
export default {
  name: "canEditTable",
  props: {
    refs: String,
    columnsList: Array,
    value: Array,
    url: String,
    editIncell: {
      type: Boolean,
      default: false
    },
    hoverShow: {
      type: Boolean,
      default: false
    },
    callDelete: { // 请求对象
      type: Function,
      default: null
    },
    primaryKey: { // 主键
      type:String,
      default:''
    },
    loading:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      columns: [],
      thisTableData: [],
      edittingStore: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let vm = this;
      let editableCell = this.columnsList.filter(item => {
        if (item.editable) {
          if (item.editable === true) {
            return item;
          }
        }
      });
      let cloneData = JSON.parse(JSON.stringify(this.value));
      let res = [];
      res = cloneData.map((item, index) => {
        let isEditting = false;
        if (this.thisTableData[index]) {
          if (this.thisTableData[index].editting) {
            isEditting = true;
          } else {
            for (const cell in this.thisTableData[index].edittingCell) {
              if (this.thisTableData[index].edittingCell[cell] === true) {
                isEditting = true;
              }
            }
          }
        }
        if (isEditting) {
          return this.thisTableData[index];
        } else {
          this.$set(item, "editting", false);
          let edittingCell = {};
          editableCell.forEach(item => {
            edittingCell[item.key] = false;
          });
          this.$set(item, "edittingCell", edittingCell);
          return item;
        }
      });
      this.thisTableData = res;
      this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
      this.columnsList.forEach(item => {
        if (item.editable) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index];
            if (!currentRow.editting) {
              if (this.editIncell) {
                return h(
                  "Row",
                  {
                    props: {
                      type: "flex",
                      align: "middle",
                      justify: "center"
                    }
                  },
                  [
                    h(
                      "Col",
                      {
                        props: {
                          span: "22"
                        }
                      },
                      [
                        !currentRow.edittingCell[param.column.key]
                          ? h("span", currentRow[item.key])
                          : cellInput(this, h, param, item)
                      ]
                    ),
                    h(
                      "Col",
                      {
                        props: {
                          span: "2"
                        }
                      },
                      [
                        currentRow.edittingCell[param.column.key]
                          ? saveIncellEditBtn(this, h, param)
                          : incellEditBtn(this, h, param)
                      ]
                    )
                  ]
                );
              } else {
                return h("span", currentRow[item.key]);
              }
            } else {
              return h("Input", {
                props: {
                  type: "text",
                  value: currentRow[item.key]
                },
                on: {
                  "on-change"(event) {
                    let key = param.column.key;
                    vm.edittingStore[param.index][key] = event.target.value;
                  }
                }
              });
            }
          };
        }
        if (item.handle) {
          item.render = (h, param) => {
            let currentRowData = this.thisTableData[param.index];

            var r = [];
            if (item.handle.indexOf("edit") > -1)
              r.push(gzEditButton(this, h, currentRowData, param.index));
            if (item.handle.indexOf("delete") > -1)
              r.push(deleteButton(this, h, currentRowData, param.index));
            if (r.length > 0) return h("div", r);

          };
        }
      });
    },
    handleBackdata(data) {
      let clonedData = JSON.parse(JSON.stringify(data));
      clonedData.forEach(item => {
        this.handleBackObj(item);
      });
      return clonedData;
    },
    handleBackObj(item) {
      delete item.editting;
      delete item.edittingCell;
      delete item.saving;
      return item;
    }
  },
  watch: {
    value(data) {
      this.init();
    }
  }
};
</script>
