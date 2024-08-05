<style scoped>
.special-grid{
  display: grid;
  grid-template-columns: 50% 50%;
}

@media screen and (max-width: 740px) {
  .special-grid{
    grid-template-columns: 100%;
  }
}
</style>
<template>
  <base-layout :pageLogo="mainLogo" hideBackLink="true" >
      <user-address-widget :deliveryTime="primaryDeliveryTime" />
      <home-slider/>
      <!-- <home-primary-category-widget @deliveryTimeGet="deliveryTime=>{primaryDeliveryTime=deliveryTime}"/> -->
    <div class="special-grid">
      <div class="ion-padding-vertical" style="color: white; background: linear-gradient(to left, rgb(0, 156, 205), rgb(42, 175, 217)); margin: 10px; border-radius: 10px;">
        <ion-item  color="transparent" lines="none" button style="color: white" detail="true" :detailIcon="chevronForwardOutline"  href="/order/shipment-draft" >
          <img slot="start" src="/img/delivery_box.png" width="60"/>
          <ion-label class="">
            <strong>ВЫЗВАТЬ КУРЬЕРА</strong>
            <p style="font-size: 12px">Доставим всё, что Вам нужно: </p>
          </ion-label>
        </ion-item>

      </div>
      <home-promo-counter />
    </div>  
      <ion-searchbar class="ion-no-margin ion-margin-bottom search-container"  @click="$router.push('/search')" placeholder="Поиск..."></ion-searchbar>
      <!-- STORES ARE LOADING -->
      <store-list-new/>









      <product-list-home-infinite ref="productlist_infinite"></product-list-home-infinite>
      <ion-infinite-scroll @ionInfinite="listLoadMore($event)" threshold="50%">
          <ion-infinite-scroll-content loading-spinner="bubbles"></ion-infinite-scroll-content>
      </ion-infinite-scroll>
  </base-layout>
</template>

<script>
import HomeSlider                 from "@/components/HomeSlider";
import StoreListNew               from "@/components/StoreListNew";
import HomePromoCounter           from "@/components/HomePromoCounter";
import UserAddressWidget          from "@/components/UserAddressWidget";
import ProductListHomeInfinite     from "@/components/ProductListHomeInfinite";

import standartLogo               from "@/assets/icons/tezkel_logo.svg";
import simpleLogo                 from "@/assets/icons/tezkel_simple_logo.svg";

import Utils                      from '@/scripts/Utils.js'

import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonSearchbar,
  IonItem,
  IonLabel,
  isPlatform,
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
}                   from "@ionic/vue";

import {  
  chevronBackOutline,
  chevronForwardOutline
 }                  from 'ionicons/icons'


export default {
  setup() {
    const alter_logo=isPlatform('ios')//isPlatform('capacitor')
    const mainLogo=isPlatform('ios')?simpleLogo:standartLogo
    return {
      mainLogo,
      chevronBackOutline,
      chevronForwardOutline
    }
  },
  components: {
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonSearchbar,
    HomeSlider,
    StoreListNew,
    IonItem,
    IonLabel,
    UserAddressWidget,
    HomePromoCounter,
    ProductListHomeInfinite,
    IonInfiniteScroll, 
    IonInfiniteScrollContent,
  },
  data(){
    return {
      out:{},
      primaryDeliveryTime: null,
      outofrangeFormHidden:0,
      storeSuggestion:null,
      hiddenCount:null,
      storeSliderLoadQueue: 100,

      mounted_at:0,
    }
  },
  computed: {
    showndelivery_address(){
      if( this.$heap.state.user.location_main.is_default!=1 ){
        return this.$heap.state.user.location_main.location_address
      }
      return this.$heap.state.user.location_current.location_address
    }
  },
  methods: {
    async listLoadMore(ev){
      await this.$refs.productlist_infinite.listNearGet()
      ev.target.complete();
    },
    async outFormSend(){
      //this.listNearReload()
      this.out.phone??=this.$heap.state.user?.user_phone
      this.out.address??=this.showndelivery_address
      if( !this.$heap.state.user?.user_id || this.$heap.state.user?.user_id<0 ){
        this.$flash("Пожалуйста зарегистрируйтесь, чтобы мы могли с вами связаться")
        return 
      }
      try{
        const request={
          type:'outofrange',
          user_id:this.$heap.state.user?.user_id,
          from:this.out.phone,
          subject:this.out.address,
          body:this.out.comment
        }
        await Utils.post(`${this.$heap.state.hostname}Talk/inquiryCreate`, request)
        this.$flash("Заявка отправлена")
      }catch{/** */}
      this.outofrangeFormHidden=1
    },
    async suggestFormSend(){
      //this.listNearReload()
      if(!this.storeSuggestion){
        this.$flash("Напишите что нам стоило бы добавить")
        return 
      }
      try{
        const request={
          type:'suggest_new_store',
          user_id:this.$heap.state.user?.user_id,
          from:this.$heap.state.user?.user_phone,
          subject:this.showndelivery_address,
          body:this.storeSuggestion
        }
        await Utils.post(`${this.$heap.state.hostname}Talk/inquiryCreate`, request)
        this.$flash("Ваше предложение отправлено")
      }catch{/** */}
    },
    loadStoreSlider(InfiniteScrollEvent){
      this.storeSliderLoadQueue++;
      InfiniteScrollEvent.target.complete();
    },
  },
  mounted(){
    /*
    this.$topic.on('userMainLocationSet',loc=>this.listNearGet(loc))
    this.$topic.on('userCurrentLocationSet',loc=>this.listNearGet(loc))
    this.listNearReload();
    */
  },
  ionViewDidEnter(){
    //this.listNearReload();
  },
};
</script>