<style scoped>
    .product_list_widget_grid {
      display: grid;
      gap: 2em;
      grid-template-columns: repeat(auto-fill, 140px);
      font-size: 0.8em;
    }
    .product_item_colspan2{
      grid-column: span 2;
    }
</style>
<template>
  <div class="product_list_widget_grid">
    <div v-for="productItem in productList" :key="productItem.product_id" :class="productItem.image_hash?'':'product_item_colspan2'">
        <product-item v-if="productItem.image_hash" :productItem="productItem"/>
        <product-item-no-img v-else :productItem="productItem"/>
    </div>
  </div>
</template>

<script>
import ProductItem        from "@/components/ProductItem";
import ProductItemNoImg   from "@/components/ProductItemNoImg";

export default {
  props: ["productList"],
  components: {
    ProductItem,
    ProductItemNoImg,
  },
};
</script>