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
}
.product-subactions{
  position: absolute;
  bottom: 0;
  z-index: 100;
  background: none;
}
</style>

<template>
  <base-layout :page-title="productItem?.product_name "  pageDefaultBackLink="/catalog" :cartComponent="CartHeader">
      <div class="product-images">
        <image-slider v-if="productItem" :imageList="productItem.images"  />
        <ion-list class="product-subactions">
          <ion-item v-if="productItem?.is_writable"  lines="none"> 
            <ion-chip color="dark" @click="$router.push('/catalog/product-edit-'+productId)">
              <ion-icon color="primary" :src="settingsOutline"/>
              <ion-text>Редактировать</ion-text>
            </ion-chip>
          </ion-item>
        </ion-list>  
      </div>
      <ion-list v-if="productItem">
        <ion-list-header style="font-size:1.2em;">
          <h3 style="font-size:1.2em;">
            <b>{{ productItem.product_name }}</b> <span v-if="!isAvailable">(Нет в наличии)</span>
          </h3>
        </ion-list-header>
        <ion-accordion-group style="width:100%">
          <ion-accordion>
            <ion-item slot="header" lines="none">
              <ion-text  class="product-description" color="medium">{{productItem.product_description}}</ion-text>
            </ion-item>
            <ion-list slot="content">
              <ion-item lines="none"></ion-item>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>
        
        <ion-item  lines="none">
          <ion-chip :outline="true" color="primary" v-for="group in categories" :key="group.group_id">{{group.group_name}}</ion-chip>
        </ion-item>

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

import ImageSlider      from '@/components/ImageSlider'
import CartAddButtons   from '@/components/CartAddButtons'
import CartHeader       from '@/components/CartHeader'

import Order            from '@/scripts/Order.js'

export default  {
  components: { 
    ImageSlider,
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
    return {CartHeader,compassOutline,cartOutline,pricetagOutline,giftOutline,walletOutline,chatboxEllipsesOutline,settingsOutline}
  },
  data() {
    return { 
      productId: this.$route.params.id,
      productItem: null
    };
  },
  mounted(){
    //this.getProduct();
  },
  ionViewDidEnter(){
    this.getProduct();
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
        try{
          this.productItem=await jQuery.post( heap.state.hostname + "Product/itemGet", { product_id: this.productId })
        }catch{
          //console.log('weird error is here')
        }
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