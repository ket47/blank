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
</style>

<template>
  <base-layout :page-title="productItem?.product_name "  pageDefaultBackLink="/catalog" :cartComponent="CartHeader">
      <div class="product-images" v-if="productItem">
        <image-slider-comp :imageList="productItem.images" :imgHeight="400" :mode="'save-aspect-ratio'" />
      </div>
      <ion-list v-if="productItem">
        <ion-list-header>
          <ion-label>
            {{ productItem.product_name }}<b v-if="productItem.product_option"> [{{productItem.product_option}}]</b> <span v-if="!isAvailable">(Нет в наличии)</span>
          </ion-label>
          <ion-button v-if="productItem.is_writable" @click="$router.push('/catalog/product-edit-'+productId)">
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






        <ion-item lines="none" @click="$router.push('/store/store-view-'+productItem.store_id)" button>
          <ion-avatar slot="start" v-if="productItem?.store?.avatar">
            <ion-img :src="`${$heap.state.hostname}image/get.php/${avatar.image_hash}.200.200.webp`" v-for="avatar in productItem?.store?.avatar" :key="avatar.image_id"/>
          </ion-avatar>
          <ion-label>{{productItem.store.store_name}}</ion-label>
          <ion-text v-if="categories" slot="end" color="medium">#{{categories[0].group_name}}</ion-text>
        </ion-item>

        <ion-item lines="none">
          <!--
          <ion-chip color="medium">
            <ion-icon :src="thumbsUpSharp" @click="itemReactionLike()" color="medium"/>
            <ion-label>2353</ion-label>
            <ion-label color="medium">&nbsp;|&nbsp;</ion-label> 
            <ion-icon :src="thumbsDownSharp" @click="itemReactionDislike()" color="dark"/>
          </ion-chip>
          -->

          <ion-chip @click="itemShare()" color="medium">
            <ion-icon :src="shareSocialOutline"/>
            <ion-label>Поделиться</ion-label>
          </ion-chip>
        </ion-item>


        <ion-item lines="none"></ion-item>
        <div v-if="productItem?.options">
          <ion-item lines="none">
            <ion-icon color="medium" :src="layersOutline" slot="start"/>
            <ion-label color="medium">Варианты</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-chip :outline="true" @click="$router.replace(`/catalog/product-${option.product_id}`)" color="primary" v-for="option in productItem.options" :key="option.product_id">
              <ion-label>{{option.product_option}}</ion-label>&nbsp;<ion-label v-if="option.product_final_price>0">{{option.product_final_price}}{{$heap.state.currencySign}}</ion-label>
            </ion-chip>
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
  layersOutline,
  shareSocialOutline,
  thumbsUpSharp,
  thumbsDownSharp,
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
      shareSocialOutline,
      thumbsUpSharp,
      thumbsDownSharp,
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
    },
    itemDescription(){
      return this.productItem?.product_description?.replace(/<\/?[^>]+(>|$)/g, "").replace(/[\n\r]/g,'<br>')
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
          this.productItem.reaction={
            reaction_id:33
          }
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
        this.is_loading=0
      },
      cartCommentUpdate(comment){
        const entry={
          product_id:this.productId,
          entry_comment:comment
        };
        Order.cart.entryUpdate(entry)
      },
      async itemShare(){
        try{
            const link=location.href;
            if(navigator.share){
                const shareData = {
                    title: `${this.$heap.state.settings.app_title} ${this.productItem.product_name}`,
                    text: this.productItem.product_description,
                    url:link
                }
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(link);
                this.$alert("Теперь вы можете поделиться ей с друзьями в социальных сетях или мессенджерах.","Ссылка на страницу скопирована");
            }
        }catch(err){
            //console.log(err)
        }
      },


      async itemReactionLike(){
        const request={
          tagQuery:`product:${this.productId}`,
          is_like:1
        }
        await jQuery.post(`${heap.state.hostname}Reaction/itemCreate`,request)
      },
      async itemReactionDislike(){
        //
      }
  },
}
</script>