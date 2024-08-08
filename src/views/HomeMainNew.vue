<style scoped>
.special-grid{
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 0 5px;
}
.fake-searchbar{
  background: var(--ion-color-light);
  display: flex;
  align-items: center;
  border-radius: 10px;
  cursor: text;
  margin: 5px 10px 10px;
}
.fake-searchbar span{
  font-size: 14px;
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
      <div class="ion-padding-vertical" style="background: var(--ion-color-light); margin: 5px; border-radius: 10px; align-content: center;">
        <ion-item  color="transparent" lines="none" button detail="true" :detailIcon="chevronForwardOutline"  href="/order/shipment-draft" >
          <img slot="start" src="/img/delivery_box.png" width="60"/>
          <ion-label class="">
            <strong>ВЫЗВАТЬ КУРЬЕРА</strong>
            <p style="font-size: 12px">Доставим всё, что Вам нужно: </p>
          </ion-label>
        </ion-item>
      </div>
      <home-promo-counter />
    </div>  
      <div class="fake-searchbar ion-padding" @click="$router.push('/search')">
        <ion-icon slot="start" :icon="searchOutline" size="small"></ion-icon>
        <span class="ion-margin-horizontal">Поиск...</span>
      </div>
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
  IonIcon,
  IonItem,
  IonLabel,
  isPlatform,
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
}                   from "@ionic/vue";

import {  
  chevronBackOutline,
  searchOutline,
  chevronForwardOutline
 }                  from 'ionicons/icons'


export default {
  setup() {
    const alter_logo=isPlatform('ios')//isPlatform('capacitor')
    const mainLogo=isPlatform('ios')?simpleLogo:standartLogo
    return {
      mainLogo,
      chevronBackOutline,
      searchOutline,
      chevronForwardOutline
    }
  },
  components: {
    IonIcon,
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
    loadStoreSlider(InfiniteScrollEvent){
      this.storeSliderLoadQueue++;
      InfiniteScrollEvent.target.complete();
    },
  }
};
</script>