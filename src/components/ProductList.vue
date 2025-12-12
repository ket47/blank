<style scoped>
  .product_list_widget_grid {
    display: flex;
    font-size: 0.6em;
    gap: 1px;
    row-gap: 10px;
    flex-wrap: wrap;
    align-items: stretch;
  }
  .product_list_widget_grid > div{
    flex: 0 0 calc(50% - 0.5px);
  }
    
  @media only screen and (min-width: 768px) {
    .product_list_widget_grid > div{
      flex: 0 0 calc(25% - 1px);
    }
  }
  @media only screen and (min-width: 1200px) {
    .product_list_widget_grid > div{
      flex: 0 0 calc(20% - 1px);
    }
  }
</style>
<template>
  <div class="product_list_widget_grid">
    <div v-for="productItem in productList" :key="productItem.product_id">
        <product-item-new :productItem="productItem"/>
    </div>
  </div>
</template>

<script>
import ProductItemNew     from "@/components/ProductItemNew";
import ProductItemNoImg   from "@/components/ProductItemNoImg";

export default {
  props: ["productList"],
  components: {
    ProductItemNew,
    ProductItemNoImg,
  },
};
</script>