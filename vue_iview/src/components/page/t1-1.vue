<template>
<div class="content">
   <Table :columns="columns1" :data="data1"></Table>
   </div>
</template>
<script>
export default {
  name:'gz-1-1',
  data() {
    return {
      columns1: [
        {
          title: "姓名",
          key: "name",
          render: (h, params) => {
            return h("div", [
              h("input", {
                domProps: {
                  value: params.row.name
                },
                on: {
                  //这个change事件已经被我注销，我用另外一个事件做了
                  // change:(e)=>this.rowchanged(e,params) 我在试watch，结果不会触发 over
                  input: event => {
                    this.updateValue(event.target.value, params);
                  }
                }
              })
            ]);
          }
        },
        {
          title: "年龄",
          key: "age"
        },
        {
          title: "地址",
          key: "address"
        }
      ],
      data1: [
        {
          name: "王小明",
          age: 18,
          address: "北京市朝阳区芍药居",
          status: 0
        },
        {
          name: "张小刚",
          age: 25,
          address: "北京市海淀区西二旗",
          status: 0
        },
        {
          name: "李小红",
          age: 30,
          address: "上海市浦东新区世纪大道",
          status: 0
        },
        {
          name: "周小伟",
          age: 26,
          address: "深圳市南山区深南大道",
          status: 0
        }
      ]
    };
  },
  created() {},
  methods: {
    updateValue: function(value, params) {
      //this.test = value;
      //this.$emit('input', value);
      params.row.name = value;
      console.info(params.row);
      //this.$emit('input', value);
      //params.row.name = value;
      //this.$set(params.row, "name", value);
      //this.$set(params.row, "status", 1);
    }
  },
  watch: {
    data1(curVal,oldVar) {
      //不会触发这个
      console.log(curVal);
    }
  }
};
</script>

