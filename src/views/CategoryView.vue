<template>
  <base-layout page-title="Категория" page-default-back-link="/home" >
      
  </base-layout>
</template>


<script>
export default  {
  data() {
    return { categoryId: null };
  },
  computed: {

  },
  watch: {
      '$route'(currentRoute) {
          this.categoryId = currentRoute.params.id;
      }
  }
}
</script>