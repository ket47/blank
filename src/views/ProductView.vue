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
.product-images .swiper img, .blur-image{
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.nugget{
  display: inline-block;
  background-color: var(--ion-color-primary-tint);
  color: var(--ion-color-primary);
  padding: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
}
</style>

<template>
  <base-layout :page-title="productItem?.product_name "  :pageDefaultBackLink="`/catalog/store-${productItem?.store_id}`" :cartComponent="CartHeader">
      <div class="product-images" v-if="productItem">
        <image-slider-comp :imageList="productItem.images" :imgHeight="400" :mode="'save-aspect-ratio'" />
      </div>
      <ion-list v-if="productItem">
        <ion-list-header>
          <ion-label>
            {{ productItem.product_name }}<b v-if="productItem.product_option"> [{{productItem.product_option}}]</b> <span v-if="!isAvailable">(Нет в наличии)</span>
          </ion-label>
          <ion-button v-if="productItem.is_writable" @click="$go('/catalog/product-edit-'+productId)">
            <ion-icon color="primary" :src="settingsOutline"/>
          </ion-button>
        </ion-list-header>
        <ion-accordion-group v-if="productItem.product_description" style="width:100%">
          <ion-accordion>
            <ion-item slot="header" lines="none">
              <ion-text  class="product-description" color="medium" v-html="itemDescription"></ion-text>
            </ion-item>
            <ion-list slot="content">
              <ion-item lines="none"></ion-item>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>






        <ion-item lines="none" @click="$go('/catalog/store-'+productItem.store_id)" button>
          <ion-avatar slot="start" v-if="productItem?.store?.avatar">
            <ion-img :src="`${$heap.state.hostname}image/get.php/${avatar.image_hash}.200.200.webp`" v-for="avatar in productItem?.store?.avatar" :key="avatar.image_id"/>
          </ion-avatar>
          <ion-text>{{productItem.store.store_name}}</ion-text>
          <ion-text v-if="categories && categories[0]" slot="end" color="medium">#{{categories[0].group_name}}</ion-text>
        </ion-item>

        <div class="horizontalScroller" style="padding:6px">
          <reaction-thumbs @react="getProduct()" :reactionSummary="productItem?.reactionSummary" :targetType="'product'" :targetId="productId"/>
          <reaction-share :targetUrl="`catalog/product-${productId}`" :targetTitle="productItem.product_name" :targetText="productItem.product_description"/>
        </div>




        <reaction-comment  @react="getProduct()" :reactionSummary="productItem?.reactionSummary" :targetType="'product'" :targetId="productId"/>


        <ion-item lines="none"></ion-item>
        <div v-if="productItem?.options">
          <ion-item lines="none">
            <ion-icon color="medium" :src="layersOutline" slot="start"/>
            <ion-label color="medium">Варианты</ion-label>
          </ion-item>
          <ion-item lines="none">
            <div>
              <ion-chip color="primary" outline v-for="option in productItem.options" :key="option.product_id" @click="$router.replace(`/catalog/product-${option.product_id}`)">
                <!--<ion-avatar v-if="option.image_hash">
                  <ion-img :src="`${$heap.state.hostname}image/get.php/${option.image_hash}.200.200.webp`"/>
                </ion-avatar>-->
                <ion-label>{{option.product_option}}</ion-label>&nbsp;<ion-label v-if="option.product_final_price>0">{{option.product_final_price}}{{$heap.state.currencySign}}</ion-label>
              </ion-chip>
            </div>
          </ion-item>
        </div>

        <ion-item lines="none" v-if="productItem.product_price!=productItem.product_final_price">
          <ion-icon slot="start" :src="giftOutline" color="medium"/>
          <ion-label color="medium">Акция до {{promoFinish}}</ion-label>
          <ion-label slot="end" color="success" style="font-size:1.2em">-{{promoPercent}}%</ion-label>
        </ion-item>

        <ion-item lines="none">
          <ion-icon slot="start" :src="pricetagOutline" color="medium"/>

          <ion-label v-if="productItem.product_unit=='порция'" color="medium">Цена за {{weight_in_gramms}}г</ion-label>
          <ion-label v-else-if="productItem.product_unit=='порция мл'" color="medium">Цена за {{weight_in_gramms}}мл</ion-label>
          <ion-label v-else color="medium">Цена за {{productItem.product_unit}}</ion-label>

          <ion-label slot="end" color="primary" style="font-size:1.2em">
            <span v-if="productItem.product_price!=productItem.product_final_price" style="color:var(--ion-color-danger);font-size:0.75em">
                <s>{{productItem.product_price}}{{$heap.state.currencySign}}</s>&nbsp;&nbsp;
            </span>
            {{productItem.product_final_price}}{{$heap.state.currencySign}}
          </ion-label>
        </ion-item>
        <ion-item lines="none">
          <ion-icon slot="start" :src="cartOutline" color="medium"/>
          <ion-label v-if="inCart" color="medium">В корзине ({{productItem.product_unit}})</ion-label>
          <ion-label v-else color="medium">Не заказан</ion-label>
          <cart-add-buttons slot="end" buttonLayout="horizontal" display="inline" :productItem="productItem"></cart-add-buttons>
        </ion-item>

        <ion-item lines="none" v-if="inCart">
          <ion-icon slot="start" :src="walletOutline" color="medium"/>
          <ion-label color="medium">Итог</ion-label>
          <ion-label slot="end" color="medium" style="font-size:1.2em">{{inCart}}{{$heap.state.currencySign}}</ion-label>
        </ion-item>

        <ion-item lines="none" v-if="inCartComment!=null">
          <ion-icon slot="start" :src="chatboxEllipsesOutline" color="medium"/>
          <ion-textarea label="" label-placement="" :value="inCartComment" @change="cartCommentUpdate($event.target.value)" placeholder="заметка для продавца"></ion-textarea>
        </ion-item>
      </ion-list>
  </base-layout>
</template>

<script>
import heap             from '@/heap';

import {
  compassOutline,
  cartOutline,
  pricetagOutline,
  giftOutline,
  walletOutline,
  chatboxEllipsesOutline,
  settingsOutline,
  layersOutline,
  arrowRedoOutline,
  thumbsUpSharp,
  thumbsDownSharp,
  chevronDownOutline,
  addOutline,
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
  IonButton,
  IonAvatar,
  IonImg,
}                       from '@ionic/vue'

import ImageSliderComp  from '@/components/ImageSliderComp'
import CartAddButtons   from '@/components/CartAddButtons'
import CartHeader       from '@/components/CartHeader'

import Order            from '@/scripts/Order.js'
import Utils            from '@/scripts/Utils.js'

import ReactionThumbs   from '@/components/ReactionThumbs.vue'
import ReactionComment  from '@/components/ReactionComment.vue'
import ReactionShare    from '@/components/ReactionShare.vue'

export default  {
  components: { 
    ImageSliderComp,
    CartAddButtons,
    ReactionThumbs,
    ReactionComment,
    ReactionShare,
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
    IonButton,
    IonAvatar,
    IonImg,
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
      layersOutline,
      arrowRedoOutline,
      thumbsUpSharp,
      thumbsDownSharp,
      chevronDownOutline,
      addOutline,
      }
  },
  data() {
    return { 
      productId: this.$route.params.id,
      productItem: null,
    };
  },
  mounted(){
    this.getProduct();
  },
  ionViewDidEnter(){
    this.productId=this.$route.params.id
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
    },
    itemDescription(){
      return this.productItem?.product_description?.replace(/<\/?[^>]+(>|$)/g, "").replace(/[\n\r]/g,'<br>')
    },
  },
  methods: {
      async getProduct(){
        try{
          this.productItem=await Utils.prePost( heap.state.hostname + "Product/itemGet", { product_id: this.productId })
          this.productItem=await Utils.post( heap.state.hostname + "Product/itemGet", { product_id: this.productId })
        }catch(err){
          const exception_code=err?.responseJSON?.messages?.error;
          switch(exception_code){
              case 'notfound':
                  this.$flash("Товар не найден")
                  this.$router.replace("/catalog")
                  break;
          }
          return false
        }
      },
      cartCommentUpdate(comment){
        const entry={
          product_id:this.productId,
          entry_comment:comment
        };
        Order.cart.entryUpdate(entry)
      },
  },
}
</script>