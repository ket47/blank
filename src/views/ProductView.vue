<style scoped>
  .product-footer{
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
  <base-layout :page-title="productItem?.product_name " :page-default-back-link="'/store-'+productItem?.store_id" :cartComponent="CartHeader">
      <image-slider v-if="productItem" :imageList="productItem.images" :imgWidth="700" :imgHeight="500" :maxHeight="300" :key="sliderKey"/>
      
      
      <ion-list v-if="productItem">
        <ion-list-header>
          <h2>
            {{ productItem.product_name }} <span v-if="!productItem.product_quantity">(Нет в наличии)</span>
          </h2>
          
        </ion-list-header>
        <ion-item>
          <ion-text color="medium">{{productItem.product_description}}</ion-text>
        </ion-item>
        <ion-item></ion-item>

      </ion-list>








      
      
      <ion-card v-if="productItem">
        <ion-card-header>
          <ion-card-title>
          {{ productItem.product_name }}
          <span v-if="!productItem.product_quantity">(Нет в наличии)</span>
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <div style="display:grid;grid-template-columns:1fr min-content;height:50px">
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
            <div style="position:relative;">
              <cart-add-buttons buttonLayout="horizontal" :productItem="productItem"></cart-add-buttons>
            </div>
          </div>
          <ion-note>{{productItem.product_description}}</ion-note>
        </ion-card-content>
      </ion-card>

      <section class="product-footer-section" v-if="productItem?.product_quantity > 0">
        <cart-item-comment :productId="productId"></cart-item-comment>
        <div class="product-footer-palceholder"></div>
      </section>
      <section class="product-footer" v-if="productItem?.product_quantity > 0">
        <cart-item-subtotal :productId="productId" :productItem="productItem"></cart-item-subtotal>
      </section>
  </base-layout>
</template>

<script>
import jQuery           from "jquery";
import heap             from '@/heap';

import {
  cameraOutline,
  trash,
  trashOutline,
  locationOutline,
  storefrontOutline,
  flagOutline,
  searchOutline
}                       from 'ionicons/icons'
import imageSlider      from '@/components/imageSlider'
import CartAddButtons   from '@/components/CartAddButtons'
import CartItemComment  from '@/components/CartItemComment'
import CartItemSubtotal from '@/components/CartItemSubtotal'
import CartHeader       from '@/components/CartHeader'

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
    return { 
      productId: this.$route.params.id,
      productItem: null
    };
  },
  created(){
      this.getProduct();
  },
  methods: {
      async getProduct(){
        try{
          this.productItem=await jQuery.post( heap.state.hostname + "Product/itemGet", { product_id: this.productId })
        }catch{/** */}
      },
  },
}
</script>