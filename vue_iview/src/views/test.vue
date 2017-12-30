<template>
  <div>
    <h1>测试</h1>
    <div>
      <Button type="primary" @click="doGet">获取选择数据</Button>
      <span>{{JSON.stringify(selectObj)}}</span>
    </div>
    <gz-tree-grid ref="gzTree" :columns="columns" :data="tdata" nodeKey='name' :showRowNum="true" childrenKey="items"></gz-tree-grid>
  </div>
</template>
<script>
  import GzTreeGrid from "../components/iview/treeGrid/tree";

  const _columns = [{
      title: "Name",
      key: "name"
    },
    {
      title: "text",
      key: "text"
    },
    {
      title: "componentPath",
      key: "componentPath"
    },
    {
      title: "componentName",
      key: "componentName"
    }
  ];
  const _data = [{
      name: "system",
      text: "系统",
      icon: "",
      componentPath: "views",
      componentName: "index.vue",
      items: [{
          name: "system-module",
          text: "模块管理",
          routeName: "/module",
          componentPath: "views",
          componentName: "system/module/index.vue"
        },
        {
          name: "system-about",
          text: "关于",
          routeName: "/about",
          componentPath: "components",
          componentName: "page/about.vue"
        },
        {
          name: "system-t3",
          text: "选项一",
          routeName: "/t3-1",
          componentPath: "components",
          componentName: "page/t3-2.vue"
        }
      ]
    },
    {
      name: "module1",
      text: "导航一",
      icon: "",
      componentPath: "views",
      componentName: "index.vue",
      items: [{
          name: "module1-t1",
          text: "选项一",
          routeName: "/t1-1",
          componentPath: "components",
          componentName: "page/t1-1.vue"
        },
        {
          name: "module1-t2",
          text: "选项二",
          routeName: "/t1-2",
          componentPath: "components",
          componentName: "page/t1-2.vue"
        },
        {
          name: "module1-t3",
          text: "选项三",
          routeName: "/t1-3",
          componentPath: "components",
          componentName: "page/t1-3.vue"
        }
      ]
    },
    {
      name: "module2",
      text: "导航二",
      icon: "",
      componentPath: "views",
      componentName: "index.vue",
      items: [{
          name: "module2-t1",
          text: "选项1",
          routeName: "/t2-1",
          componentPath: "components",
          componentName: "page/t2-1.vue"
        },
        {
          name: "module2-t2",
          text: "选项2",
          routeName: "/t2-2",
          componentPath: "components",
          componentName: "page/t2-2.vue"
        },
        {
          name: "module2-t3",
          text: "选项3",
          routeName: "/t2-3",
          componentPath: "components",
          componentName: "page/t2-3.vue"
        },
        {
          name: "module2-m4",
          text: "模块管理",
          routeName: "/myModule",
          componentPath: "views",
          componentName: "system/module/index.vue"
        }
      ]
    }
  ];

  export default {
    data() {
      return {
        columns: _columns,
        tdata: _data,
        nodeKey: "items",
        selectObj: {}
      };
    },
    components: {
      GzTreeGrid
    },
    methods: {
      doGet() {
        this.selectObj = this.$refs["gzTree"].getSelectObj();
      }
    }
  };
</script>