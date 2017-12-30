<template>
<div class="content">
    <h1>Home</h1>
    <Button type="success" @click="onClick">点击</Button>
</div>  
</template>
<script>
export default {
  methods: {
      onClick(){
        // debugger
        var v=  this.$utils.jsonSearch.test6(121);
         console.dir(v);
      }
  }
}
</script>



