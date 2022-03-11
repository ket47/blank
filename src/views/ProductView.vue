<style scoped>
  .product-title{
    font-size: 2em;
  }
  .product-footer{
    position: fixed;
    bottom: 0;
    z-index: 2;
    width: 100%;
  }
  .product-footer-palceholder{
    height: 10px;
  }
  .product-footer-section{
    background-color:var(--ion-color-primary-tint);
    border-top:1px solid var(--ion-color-primary-shade);
    margin-top: 15px;
    padding: 20px;
  }
  .product-footer-section ion-textarea{
    border: 1px solid var(--ion-color-primary-shade);
  }
</style>

<template>
  <base-layout :page-default-back-link="'/store-'+productItem.store_id" page-class="product-page" :cartComponent="CartHeader">

      <image-slider :imageList="productItem.images" :imgWidth="700" :imgHeight="500" :maxHeight="300" :key="sliderKey"/>
      <ion-card v-if="productItem.product_id">
        <ion-card-header>
          <ion-card-title>
          {{ productItem.product_name }}
          <span v-if="!productItem.product_quantity">(Нет в наличии)</span>
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <div style="display:grid;grid-template-columns:1fr auto;height:50px">
            <div style="align-items:center">
              <span v-if="productItem.product_price!=productItem.product_final_price" style="color:var(--ion-color-danger)">
                  <s>{{productItem.product_price}}{{$heap.state.currencySign}}</s>&nbsp;&nbsp;
              </span>
              <span style="color:var(--ion-color-primary)">
                  {{productItem.product_final_price}}{{$heap.state.currencySign}}
              </span> / 
              <span style="color:var(--ion-color-medium)">
                  {{productItem.product_unit}}
              </span>
            </div>
            <div style="position:relative;width:110px;">
              <cart-add-buttons buttonLayout="horizontal" :productItem="productItem" style="right:0px"></cart-add-buttons>
            </div>
          </div>
          <ion-note>{{productItem.product_description}}</ion-note>
        </ion-card-content>
      </ion-card>

      <section class="product-footer-section" v-if="productItem.product_quantity > 0">
        <cart-item-comment :productId="productId"></cart-item-comment>
        <div class="product-footer-palceholder"></div>
      </section>
      <section class="product-footer" v-if="productItem.product_quantity > 0">
        <cart-item-subtotal :productId="productId" :productItem="productItem"></cart-item-subtotal>
      </section>

  </base-layout>
</template>

<script>
import imageSlider      from '@/components/imageSlider'
import CartAddButtons   from '@/components/CartAddButtons'
import CartItemComment  from '@/components/CartItemComment'
import CartItemSubtotal from '@/components/CartItemSubtotal'
import CartHeader       from '@/components/CartHeader'
import jQuery           from "jquery";
import heap            from '@/heap';

export default  {
  inject:['$Order'],
  components: { 
    imageSlider,
    CartAddButtons,
    CartItemComment,
    CartItemSubtotal,
    CartHeader
  },
  data() {
    this.$Order.init();
    return { 
      productId: this.$route.params.id,
      error: "",
      productItem: [],
      sliderKey: 0,
    };
  },
  methods: {
      getProduct(){
          var self = this;
          jQuery.post( heap.state.hostname + "Product/itemGet", { product_id: self.productId })
              .done(function(response) {
                  self.productItem = self.prepareProduct(response);
                  self.productId = response.product_id;
              })
              .fail(function(err) {
                  self.error = err.responseJSON.messages.error;
              });
      },
      prepareProduct(productItem){
        // if(productItem.member_of_groups.group_types){
        //   var group_types_array = productItem.member_of_groups.group_types.split(',');
        //   for(var i in group_types_array){
        //     group_types_array[i] = storeTypes[group_types_array[i]];
        //   }
        //   productItem.product_types = group_types_array.join(', ')
        // }
        // var date = new Date();
        // productItem.willBeClosedAt = productItem['product_time_closes_'+date.getDay()];
        return productItem;
      }
  },
  created(){
      this.getProduct();
  },
  watch: {
      '$route'(currentRoute) {
          this.productId = currentRoute.params.id;
      }
  }
}
</script>