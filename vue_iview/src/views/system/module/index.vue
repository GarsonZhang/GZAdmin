<template>
<div class="content">
  <Row class="fill-height">
    <Col span="6" class="fill-height">
      <gz-panel class="borderPanel" >
        <div slot="top" class="title" >
            <span>模块列表</span>
        </div>
        <div slot="main">
         <systemModule @selectChanged="event_moduleSelect"></systemModule>
        </div>
        </gz-panel>
    </Col>
      <Col span="18" class="fill-height">
      <gz-panel class="borderPanel" >
        <div slot="top" class="title">
            <span>功能列表</span>
        </div>
        <div slot="main">
         <systemModuleForm :ref="refsName.Form" :moduleID="moduleID"></systemModuleForm>
        </div>
        </gz-panel>
    </Col>
  </Row>

</div>
</template>


<style lang="less" scoped>
.title {
  height: 32px;
  line-height: 32px;
  border-bottom: 1px solid #e9eaec !important;
  color: #495060 !important;
  background: #fff !important;
  padding: 0 12px;
  display: inline-block;
  margin: 2px 4px 2px 0;
  border-radius: 3px;
  font-size: 12px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
  width: 100%;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}.borderPanel {
  border: 1px solid #e9eaec !important;
}
</style>
<script>
import Sortable from "sortablejs";
import Msg from "../../../mixins/msg";
import systemModule from "./systemModule.vue";
import systemModuleForm from "./systemModuleForm.vue";

export default {
  // name: "module",
  mixins: [Msg],
  components: { systemModule, systemModuleForm },
  data() {
    return {
      selectModule: {},
      refsName: {
        Form: "Form"
      },
      moduleID:''
    };
  },
  created() {},
  methods: {
    //选择一个模块，加载模块功能
    event_moduleSelect(row, index) {
      this.selectModule = row;
      // $emit("selectChanged", row);
      this.moduleID=row['rowID'];
    }
  }
};
</script>