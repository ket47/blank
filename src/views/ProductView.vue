<style>

ion-accordion-group .accordion-collapsed .product-description,
ion-accordion-group .accordion-collapsing .product-description{
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  position: relative;
  transition: all 300ms cubic-bezier(0.25, 0.8, 0.5, 1) 0s;
  line-height: 1.4;
}
ion-accordion-group .accordion-expanded .product-description,
ion-accordion-group .accordion-expanding .product-description{
  display: inline-block;
  line-height: 1.4;
}
.product-images {
  position: relative;
  box-shadow: 0px 0px 15px -5px #0006;
  border-radius: 0 0 15px 15px;
  z-index: 2;
  min-height: 100px;
}
.product-subactions{
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 100;
}
.product-images .swiper img{
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>

<template>
  <base-layout :page-title="productItem?.product_name "  pageDefaultBackLink="/catalog/" :cartComponent="CartHeader">
      <div class="product-images">
        <image-slider-comp v-if="productItem" :imageList="productItem.images" :imgHeight="400" :mode="'save-aspect-ratio'" />
      </div>
      <ion-list v-if="productItem">
        <ion-list-header style="font-size:1.2em;">
          <h3 style="font-size:1.2em;">
            <b>{{ productItem.product_name }}</b> <b v-if="productItem.product_option">[{{productItem.product_option}}]</b> <span v-if="!isAvailable">(Нет в наличии)</span>
          </h3>
        </ion-list-header>
        <ion-accordion-group v-if="productItem.product_description" style="width:100%">
          <ion-accordion>
            <ion-item slot="header" lines="none">
              <ion-text  class="product-description" color="medium">{{productItem.product_description}}</ion-text>
            </ion-item>
            <ion-list slot="content">
              <ion-item lines="none"></ion-item>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>
        
        <ion-item v-if="productItem.is_writable" lines="none">
          <ion-icon slot="end" color="primary" :src="settingsOutline" @click="$router.push('/catalog/product-edit-'+productId)"/>
        </ion-item>
        <ion-item  lines="none">
          <ion-chip :outline="true" color="primary" v-for="group in categories" :key="group.group_id">{{group.group_name}}</ion-chip>
        </ion-item>

        <div v-if="productItem?.options">
          <ion-item lines="none">
            <ion-icon :src="layersOutline" color="primary" slot="start"/>
            <ion-label>Варианты</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-chip @click="$router.replace(`/catalog/product-${option.product_id}`)" color="primary" v-for="option in productItem.options" :key="option.product_id">
              {{option.product_option}}
            </ion-chip>

          </ion-item>
        </div>

        <ion-item lines="none" v-if="productItem.product_price!=productItem.product_final_price">
          <ion-icon slot="start" color="primary" :src="giftOutline"/>
          <ion-label>Акция до {{promoFinish}}</ion-label>
          <ion-label slot="end" color="success" style="font-size:1.2em">-{{promoPercent}}%</ion-label>
        </ion-item>

        <ion-item lines="none">
          <ion-icon slot="start" color="primary" :src="pricetagOutline"/>

          <ion-label v-if="productItem.product_unit=='порция'">Цена за {{weight_in_gramms}}г</ion-label>
          <ion-label v-else>Цена за {{productItem.product_unit}}</ion-label>

          <ion-label slot="end" color="primary" style="font-size:1.2em">
            <span v-if="productItem.product_price!=productItem.product_final_price" style="color:var(--ion-color-danger);font-size:0.75em">
                <s>{{productItem.product_price}}{{$heap.state.currencySign}}</s>&nbsp;&nbsp;
            </span>
            {{productItem.product_final_price}}{{$heap.state.currencySign}}
          </ion-label>
        </ion-item>
        <ion-item lines="none">
          <ion-icon slot="start" color="primary" :src="cartOutline"/>
          <ion-label v-if="inCart">В корзине ({{productItem.product_unit}})</ion-label>
          <ion-label v-else>Не заказан</ion-label>
          <cart-add-buttons slot="end" buttonLayout="horizontal" display="inline" :productItem="productItem"></cart-add-buttons>
        </ion-item>

        <ion-item lines="none" v-if="inCart">
          <ion-icon slot="start" color="primary" :src="walletOutline"/>
          <ion-label>Итог</ion-label>
          <ion-label slot="end" color="primary" style="font-size:1.2em">{{inCart}}{{$heap.state.currencySign}}</ion-label>
        </ion-item>

        <ion-item lines="none" v-if="inCartComment!=null">
          <ion-icon slot="start" color="primary" :src="chatboxEllipsesOutline"/>
          <ion-textarea :value="inCartComment" @change="cartCommentUpdate($event.target.value)" placeholder="заметка для продавца"></ion-textarea>
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
  settingsOutline,
  layersOutline
}                       from 'ionicons/icons'
import {
  IonTextarea,
  IonListHeader,
  IonText,
  IonIcon,
  IonItem,
  IonChip,
  IonLabel,
  IonList,
  IonAccordion,
  IonAccordionGroup,
}                       from '@ionic/vue'

import ImageSliderComp      from '@/components/ImageSliderComp'
import CartAddButtons   from '@/components/CartAddButtons'
import CartHeader       from '@/components/CartHeader'

import Order            from '@/scripts/Order.js'

export default  {
  components: { 
    ImageSliderComp,
    CartAddButtons,
    IonTextarea,
    IonListHeader,
    IonText,
    IonIcon,
    IonItem,
    IonChip,
    IonLabel,
    IonList,
    IonAccordion,
    IonAccordionGroup,
  },
  setup(){
    return {
      CartHeader,
      compassOutline,
      cartOutline,
      pricetagOutline,
      giftOutline,
      walletOutline,
      chatboxEllipsesOutline,
      settingsOutline,
      layersOutline
      }
  },
  data() {
    return { 
      productId: this.$route.params.id,
      productItem: null,
      is_loading:0
    };
  },
  mounted(){
    this.getProduct();
    console.log('mounted');
  },
  // ionViewDidEnter(){
  //   this.productId=this.$route.params.id
  //   this.getProduct();
  //   console.log('enter');
  // },
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
    },
    isAvailable(){
      return this.productItem.is_counted==1?(this.productItem.product_quantity-this.productItem.product_quantity_reserved)>0:true;
    },
    weight_in_gramms(){
        return this.productItem.product_weight*1000
    }
  },
  methods: {
      async getProduct(){
        if( this.is_loading==1 ){
          return
        }
        try{
          this.is_loading=1
          this.productItem=await jQuery.post( heap.state.hostname + "Product/itemGet", { product_id: this.productId })
        }catch{
          //console.log('weird error is here')
        }
        this.is_loading=0
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