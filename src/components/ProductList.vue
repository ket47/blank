<style scoped>
    .product_list_widget_grid {
    display: grid;
    gap: 2%;
    grid-template-columns: repeat(auto-fit,130px);
    font-size: 0.8em;
    }
</style>
<template>
  <div class="product_list_widget_grid">
    <div v-for="productItem in productList" :key="productItem.product_id">
      <product-item :productItem="productItem"/>
    </div>
  </div>
</template>

<script>
import ProductItem from "@/components/ProductItem";

export default {
  props: ["productList"],
  components: {
    ProductItem,
  },
};
</script>