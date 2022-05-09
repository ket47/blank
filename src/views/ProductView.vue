<template>
  <base-layout :page-title="productItem?.product_name " :page-default-back-link="'/store-'+productItem?.store_id" :cartComponent="CartHeader">
      <image-slider v-if="productItem" :imageList="productItem.images" imgHeight="200"/>
      <ion-list v-if="productItem">
        <ion-list-header>
          <h2>
            {{ productItem.product_name }} <span v-if="!(productItem.product_quantity>0)">(Нет в наличии)</span>
          </h2>
        </ion-list-header>
        <ion-item lines="none">
          <ion-text color="medium">{{productItem.product_description}}</ion-text>
          <ion-icon v-if="productItem?.is_writable" slot="end" :src="settingsOutline" color="primary" @click="$router.push('product-edit-'+productId)"/>
        </ion-item>
        <ion-item lines="none"></ion-item>
        <ion-item>
          <ion-icon slot="start" color="primary" :src="compassOutline"/>
          <ion-chip v-for="group in categories" :key="group.group_id">{{group.group_name}}</ion-chip>
        </ion-item>

        <ion-item v-if="productItem.product_price!=productItem.product_final_price">
          <ion-icon slot="start" color="primary" :src="giftOutline"/>
          <ion-label>Акция до {{promoFinish}}</ion-label>
          <ion-label slot="end" color="success" style="font-size:1.2em">-{{promoPercent}}%</ion-label>
        </ion-item>

        <ion-item>
          <ion-icon slot="start" color="primary" :src="pricetagOutline"/>
          <ion-label>Цена за {{productItem.product_unit}}</ion-label>
          <ion-label slot="end" color="primary" style="font-size:1.2em">
            <span v-if="productItem.product_price!=productItem.product_final_price" style="color:var(--ion-color-danger);font-size:0.75em">
                <s>{{productItem.product_price}}{{$heap.state.currencySign}}</s>&nbsp;&nbsp;
            </span>
            {{productItem.product_final_price}}{{$heap.state.currencySign}}
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" color="primary" :src="cartOutline"/>
          <ion-label v-if="inCart">В корзине {{productItem.product_unit}}</ion-label>
          <ion-label v-else>Не заказан</ion-label>
          <cart-add-buttons slot="end" buttonLayout="horizontal" display="inline" :productItem="productItem"></cart-add-buttons>
        </ion-item>

        <ion-item v-if="inCart">
          <ion-icon slot="start" color="primary" :src="walletOutline"/>
          <ion-label>Итог</ion-label>
          <ion-label slot="end" color="primary" style="font-size:1.2em">{{inCart}}{{$heap.state.currencySign}}</ion-label>
        </ion-item>

        <ion-item v-if="inCartComment!=null">
          <ion-icon slot="start" color="primary" :src="chatboxEllipsesOutline"/>
          <ion-textarea v-model="inCartComment" @ionChange="cartCommentUpdate($event.target.value)" placeholder="заметка для продавца"></ion-textarea>
        </ion-item>
      </ion-list>
  </base-layout>
</template>

<script>
import jQuery           from "jquery";
import heap             from '@/heap';

import {
  compassOutline,
  cartOutline,
  pricetagOutline,
  giftOutline,
  walletOutline,
  chatboxEllipsesOutline,
  settingsOutline
}                       from 'ionicons/icons'
import {
  IonTextarea
}                       from '@ionic/vue'
import ImageSlider      from '@/components/ImageSlider'
import CartAddButtons   from '@/components/CartAddButtons'
import CartHeader       from '@/components/CartHeader'

import Order            from '@/scripts/Order.js'

export default  {
  components: { 
    ImageSlider,
    CartAddButtons,
    CartHeader,
    IonTextarea
  },
  setup(){
    return {compassOutline,cartOutline,pricetagOutline,giftOutline,walletOutline,chatboxEllipsesOutline,settingsOutline}
  },
  data() {
    return { 
      productId: this.$route.params.id,
      productItem: null
    };
  },
  created(){
      //
  },
  computed:{
    categories(){
      if(!this.productItem?.member_of_groups?.group_ids){
        return [];
      }
      const ids=this.productItem?.member_of_groups?.group_ids.split(',')
      const names=this.productItem?.member_of_groups?.group_names.split(',')
      let categories=[]
      for(let i in ids){
        categories.push({group_id:ids[i],group_name:names[i]})
      }
      return categories
    },
    promoFinish(){
      try{
        return this.productItem.product_promo_finish.split(' ')[0].split('-').reverse().join('.')
      }catch{
        return null;
      }
    },
    promoPercent(){
      return Math.round(100-this.productItem.product_final_price/this.productItem.product_price*100)
    },
    inCart(){
      const entry=Order.cart.entryGet(this.productId)
      if( !entry ){
        return 0;
      }
      return entry.data.entry_quantity*entry.data.entry_price
    },
    inCartComment(){
      const entry=Order.cart.entryGet(this.productId)
      if( !entry ){
        return null;
      }
      return entry.data.entry_comment??''
    }
  },
  ionViewDidEnter(){
    this.getProduct();
  },
  methods: {
      async getProduct(){
        try{
          this.productItem=await jQuery.post( heap.state.hostname + "Product/itemGet", { product_id: this.productId })
        }catch{/** */}
      },
      cartCommentUpdate(comment){
        const entry={
          product_id:this.productId,
          entry_comment:comment
        };
        Order.cart.entryUpdate(entry)
      }
  },
}
</script>