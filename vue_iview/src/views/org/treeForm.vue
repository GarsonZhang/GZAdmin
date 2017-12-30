<template>
   <Modal class-name="vertical-center-modal dialog-modal" :ref="refNames_modal" title="系统功能" width=100 v-model="modalStatus" 
      :mask-closable="false" :loading="(true)" @on-ok="event_submit" @on-cancel="event_cancel">
      <Tree ref="refTree" :data="data" show-checkbox></Tree>
    </Modal>
</template>
<script>
import { system } from "../../libs/request";
import Msg from "../../mixins/msg";
export default {
  name: "FormTreeData",
  mixins: [Msg],
  data() {
    return {
      refNames_modal: "refNames_modal",
      data: [],
      modalStatus: false,
      objectID: "",
      category: 0
    };
  },
  props: {},
  mounted() {},
  methods: {
    show() {
      this.modalStatus = true;
    },
    updateData(_category, _objectID) {
       this.data = [];
      this.category = _category;
      this.objectID = _objectID;
      if (this.$utils.isNULL(_objectID)) {
        this.data = [];
        return;
      }
      system
        .getMenuTree(this, _objectID)
        .then(res => {
          this.data = res.data;
        })
        .catch(err => {
          this.data = [];
          return;
        });
    },
    event_submit() {
      var _nodes= this.$refs['refTree'].getCheckedNodes();
      var _d=_nodes.filter(p=>p.type===3);
      system
        .updateAuthorize(this, this.category, this.objectID, _d)
        .then(res => {
          this.showInfo("保存成功");
          this.modalStatus = false;
        })
        .catch(res => {
          this.$refs[this.refNames_modal].buttonLoading = false;
        });
    },
    event_cancel() {}
  },

  components: {},
  watch: {}
};
</script>

