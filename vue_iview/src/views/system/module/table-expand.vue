

<template>
  <div>
      <Table size="small" highlight-row class="gzchild" :show-header='false' :columns="ItemColumns" :data="ItemData"></Table>
       <!-- <Row class="expand-row" v-for="item in row.base_moduleForm" :key="item.name" >
            <Col span="8">
                <span class="expand-key">名称：</span>
                <span class="expand-value">{{ item.name }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">描述：</span>
                <span class="expand-value">{{ item.description }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">路由：</span>
                <span class="expand-value">{{ item.routeName }}</span>
            </Col>
        </Row> -->
  </div>
</template>
<script>
export default {
  props: {
      row:Object
  },
  computed: {
      ItemColumns(){
          return [{
            title: "序号",
            type: "index",
            width: 60,
            align: "center"
          },{
            title: "名称",
            key: "name",
            editable: true
          },{
            title: "描述",
            key: "description",
            editable: true
          },{
            title: "路由",
            key: "routeName",
            editable: true
          },{
            title: "组件路径",
            key: "componentPath",
            editable: true
          },{
            title: "组件名称",
            key: "componentName",
            editable: true
          }]
      },
      ItemData(){
          return this.row.base_moduleForm;
      }

  },
  methods: {
      rowClassName(row,index){
          return 'bk';
      }
  }
}
</script>
<style >
.gzchild tr td {
    /* background-color: #f5f7f9; */
    color: #969191;
}

.gztag .ivu-table-row-highlight td{
    background-color: #ebf7ff;
}
</style>

