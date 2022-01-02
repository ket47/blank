<template>
  <base-layout page-title="Product" :page-default-back-link="'/store-'+productItem.store_id" page-class="product-page" :cartComponent="CartHeader">
    <div class="product-block">
      <image-slider :imageList="productItem.images" :key="sliderKey"/>
      <ion-list class="product-info">
        <ion-row>
          <h4 class="product-title">{{ productItem.product_name }}</h4>
        </ion-row>
        <ion-row>
          <ion-col class="product-price">{{ productItem.product_price }}₽</ion-col>
        </ion-row>
        <product-add-buttons :product-item="productItem" expanded="true"/>
      </ion-list>
    </div>
    <div class="product-footer" >
      <ion-row responsive-sm  v-if="productItem.product_quantity > 0" >
        <ion-col size="9">
          <ion-button @click="passwordReset" expand="block">Заказать</ion-button>
        </ion-col>
        <ion-col size="3">
          <h3>{{ $store.state.cart.total }}₽</h3>
        </ion-col>
      </ion-row>
       <ion-row responsive-sm  v-if="!productItem.product_quantity" >
        <ion-col size="12">
          <h3>Нет в наличии</h3>
        </ion-col>
      </ion-row>
    </div>
  </base-layout>
</template>



<script>

import { search } from 'ionicons/icons';
import imageSlider from '../components/imageSlider'
import ProductAddButtons from '../components/ProductAddButtons'
import CartHeader from '../components/CartHeader'
import jQuery from "jquery";
import store from '../store';

var storeTypes = {
  'foodstore': 'Продуктовый магазин',
  'restaraunt': 'Ресторан'
};


export default  {
  components: { 
    imageSlider,
    ProductAddButtons
  },
  setup() {
    return {
      search,
      CartHeader
    }
  },
  data() {
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
          jQuery.post( store.state.hostname + "Product/itemGet", { product_id: self.productId })
              .done(function(response) {
                  self.productItem = self.prepareProduct(response);
                  self.productId = response.product_id;
              })
              .fail(function(err) {
                  self.error = err.responseJSON.messages.error;
              });
      },
      prepareProduct(productItem){
        if(productItem.member_of_groups.group_types){
          var group_types_array = productItem.member_of_groups.group_types.split(',');
          for(var i in group_types_array){
            group_types_array[i] = storeTypes[group_types_array[i]];
          }
          productItem.product_types = group_types_array.join(', ')
        }
        var date = new Date();
        productItem.willBeClosedAt = productItem['product_time_closes_'+date.getDay()];
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

<style>
.product-page .product-actions{
  position: relative;
  flex-direction: row-reverse;
  width: 80%;
  margin: 1em auto;
}
.product-page .product-info {
  text-align: center;
}
.product-page .product-info .product-title{
  display: block;
  width: 100%;
}
.product-page .product-price{
  visibility: visible;
  font-weight: bold;
  font-size: 35px;
  color: var(--ion-primary);
}

.product-page .swiper-wrapper{
    max-height: auto;
}

.product-footer{
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>