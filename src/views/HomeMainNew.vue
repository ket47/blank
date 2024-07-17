<template>
  <base-layout :pageLogo="mainLogo" hideBackLink="true" >
      <user-address-widget :deliveryTime="primaryDeliveryTime" />
      <home-slider/>
      <!-- <home-primary-category-widget @deliveryTimeGet="deliveryTime=>{primaryDeliveryTime=deliveryTime}"/> -->
        
      <home-promo-counter />
      <ion-searchbar class="ion-no-margin ion-margin-bottom search-container"  @click="$router.push('/search')" placeholder="Поиск по названию..."></ion-searchbar>
      <!-- STORES ARE LOADING -->
      <store-list-new/>
      <div class="ion-padding ion-align-items-center" style="display: flex; color: white; background: linear-gradient(to top, rgb(0, 156, 205), rgb(42, 175, 217))">
        <div class="ion-padding">
          <img src="/img/delivery_box.png" width="80"/>
        </div>
        <div class="ion-padding-start">
          <b>ВЫЗВАТЬ КУРЬЕРА</b>
          <p style="font-size: 13px; margin-top: 5px;">Доставим всё, что Вам нужно</p>
          <router-link to="/order/shipment-draft">
            <ion-button  color="light">Вызвать</ion-button>
          </router-link>
        </div>
      </div>
        <ion-card v-if="!suggestFormHidden">
          <ion-card-header>
            <ion-card-subtitle>Не нашли то, что искали?</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-input v-model="storeSuggestion" label="" helperText="маркет, магазин, кафе, ресторан, аптека" placeholder="ваше предложение"/>
            <ion-button expand="block" @click="suggestFormSend()" color="light">отправить</ion-button>
          </ion-card-content>
        </ion-card>  

  </base-layout>
</template>

<script>
import HomeSlider                 from "@/components/HomeSlider";
import StoreListNew               from "@/components/StoreListNew";
import HomePromoCounter           from "@/components/HomePromoCounter";

import UserAddressWidget          from "@/components/UserAddressWidget";
import standartLogo               from "@/assets/icons/tezkel_logo.svg";
import simpleLogo                 from "@/assets/icons/tezkel_simple_logo.svg";

import Utils        from '@/scripts/Utils.js'

import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonSearchbar,
  isPlatform
}                   from "@ionic/vue";

export default {
  setup() {
    const alter_logo=isPlatform('ios')//isPlatform('capacitor')
    const mainLogo=isPlatform('ios')?simpleLogo:standartLogo
    return {
      mainLogo
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
    UserAddressWidget,
    HomePromoCounter
  },
  data(){
    return {
      out:{},
      primaryDeliveryTime: null,
      outofrangeFormHidden:0,
      storeSuggestion:null,
      suggestFormHidden:0,
      hiddenCount:null,
      storeSliderLoadQueue: 100
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
      this.suggestFormHidden=1
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