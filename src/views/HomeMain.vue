<template>
  <base-layout :pageLogo="mainLogo" hideBackLink="true">
      <home-slider/>
      <user-address-widget :deliveryTime="primaryDeliveryTime"/>
      <!-- <home-primary-category-widget @deliveryTimeGet="deliveryTime=>{primaryDeliveryTime=deliveryTime}"/> -->
      <!-- STORES ARE LOADING -->
      <div v-if="!storeList" class="store-list" >
        <ion-item lines="none" style="--padding-start: 10px;">
          <h5 slot="start" style="background:#eee;border-radius:5px;padding: 5px;width:120px;color:#999">#</h5>
          <ion-skeleton-text slot="end" style="width:130px;border-radius:3px;"></ion-skeleton-text>
        </ion-item>
        <div style="display:grid;grid-template-columns:330px 330px;">
          <div button v-for="store_item in [1,1,1,1]" :key="store_item">
              <ion-skeleton-text style="width:310px;height:180px;border-radius:5px;margin-left:10px" animated></ion-skeleton-text>
            <ion-item lines="none">
              <ion-skeleton-text slot="start" style="width:130px;border-radius:3px;"></ion-skeleton-text>
              <ion-skeleton-text slot="end" style="width:60px;border-radius:3px;"></ion-skeleton-text>
            </ion-item>
          </div>
        </div>
      </div>
      <!-- STORES ARE NOT FOUND -->
      <div v-else-if="storeList.length==0">
        <ion-grid>
          <ion-row>
            <ion-col size-xs="12" size-sm="6">
              <img src="/img/404_store.png"/>
            </ion-col>
            <ion-col size-xs="12" size-sm="6">
              <h2>Вне зоны обслуживания</h2>
              <p style="color:#333">Поблизости к адресу <b style="color:var(--ion-color-primary)">{{ showndelivery_address??'доставки заказа' }}</b>, который вы выбрали, пока нет подходящих ресторанов и магазинов.</p>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-card v-if="!outofrangeFormHidden">
          <ion-card-header>
            <ion-card-subtitle> Заполните форму и мы уведомим вас, когда появится ресторан или магазин поблизости.</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>

            <ion-input v-if="!$heap.state.user?.user_phone" v-model="out.phone" label="Номер телефона" label-placement="floating" :value="$heap.state.user?.user_phone"/>
            <ion-input v-if="!showndelivery_address" v-model="out.address" label="Желаемый адрес"  label-placement="floating"  :value="showndelivery_address"/>
            <ion-input v-model="out.comment" label="Ваш комментарий"  label-placement="floating"/>

            <ion-button expand="block" @click="outFormSend()">отправить заявку</ion-button>
          </ion-card-content>
        </ion-card>

        <ion-item button detail @click="$go('/page/supplier-guide')">
          Хотите стать продавцом здесь? Узнайте о преимуществах.
        </ion-item>
      </div>
      <!-- STORES ARE FOUND -->
      <div v-else-if="storeList && storeList.length>0">
        <home-promo-product-slider :store-list="storeList" :limit="30" titleColor="#f77f00" />  
        <home-primary-category-widget category-limit="5" titleColor="#0097d2" />  

        <ion-list ref="storeSlidersContainer">
          <home-store-slider v-if="storeSliderLoadQueue >= 0" :store-list="storeList" :filter="{member_of_groups: {value: 'fastfood', type: 'includes'}}" sliderTitle="Фастфуд" sliderTitleColor="#ff0000" backgroundImage="/img/fastfood_background.jpg"/>  
          <home-store-slider v-if="storeSliderLoadQueue >= 1" :store-list="storeList" :filter="{member_of_groups: {value: 'restaraunt', type: 'includes'}}" sliderTitle="Рестораны" sliderTitleColor="#326cd9" backgroundImage="/img/restaurant_background.jpg"/>  
          <home-store-slider v-if="storeSliderLoadQueue >= 2" :store-list="storeList" :filter="{member_of_groups: {value: 'halal', type: 'includes'}}" sliderTitle="Халяль" sliderTitleColor="#41a663" backgroundImage="/img/halal_background.jpg"/>    
          <home-store-slider v-if="storeSliderLoadQueue >= 3" :store-list="storeList" :filter="{member_of_groups: {value: 'foodstore', type: 'includes'}}" sliderTitle="Магазины" sliderTitleColor="#893abf" backgroundImage="/img/market_background.jpg"/>    
        </ion-list>
        <ion-card v-if="!suggestFormHidden">
          <ion-card-header>
            <ion-card-subtitle>Не нашли то, что искали?</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-input v-model="storeSuggestion" label="" helperText="маркет, магазин, кафе, ресторан, аптека" placeholder="ваше предложение"/>
            <ion-button expand="block" @click="suggestFormSend()" color="light">отправить</ion-button>
          </ion-card-content>
        </ion-card>  
        <ion-item lines="none" v-if="hiddenCount>0" style="margin-top: 30px; color:#ddd">
          <ion-note>
            Количество продавцов, находящихся за пределами радиуса доставки, скрытых из результатов <b>{{hiddenCount}}</b>
          </ion-note>
        </ion-item>
      </div>
  </base-layout>
</template>

<script>
import HomeSlider                 from "@/components/HomeSlider";
import HomePrimaryCategoryWidget  from "@/components/HomePrimaryCategoryWidget";
import HomePromoProductSlider     from "@/components/HomePromoProductSlider";
import HomeStoreSlider            from "@/components/HomeStoreSlider";
import UserAddressWidget          from "@/components/UserAddressWidget";
import mainLogo                   from "@/assets/icons/tezkel_logo.svg";

import Utils        from '@/scripts/Utils.js'

import {
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonItem,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonSkeletonText,
  IonInput,
  IonButton,
  IonNote,
}                   from "@ionic/vue";

export default {
  setup() {
    return {
      mainLogo
    }
  },
  components: {
    IonList,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonItem,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonSkeletonText,
    IonInput,
    IonButton,
    IonNote,
    HomeSlider,
    HomePrimaryCategoryWidget,
    HomePromoProductSlider,
    HomeStoreSlider,
    UserAddressWidget,
  },
  data(){
    return {
      out:{},
      storeList: null,
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
    async listNearReload(){
      this.listNearGet(this.$heap.state.user.location_current??this.$heap.state.user.location_main);
    },
    async listNearGet(loc) {
      try{
        const location={
          location_id:loc.location_id,
          location_latitude:loc.location_latitude,
          location_longitude:loc.location_longitude,
        }
        let response
        response=await Utils.prePost(`${this.$heap.state.hostname}Store/listNearGet`, location)
        if(response){
          this.hiddenCount=response.hidden_count
          this.storeList=this.storeListCalculate(response.store_list)
        }
        response=await Utils.post(`${this.$heap.state.hostname}Store/listNearGet`, location)
        this.hiddenCount=response.hidden_count
        this.storeList=this.storeListCalculate(response.store_list)
      }catch{/** */}
    },
    storeListCalculate(found){
      for(let i in found){
        found[i].deliveryTime=Utils.deliveryTimeCalculate(found[i].distance,found[i].store_time_preparation)
      }
      return found
    },
    async outFormSend(){
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
    }
  },
  mounted(){
    this.$topic.on('userMainLocationSet',loc=>this.listNearGet(loc))
    this.$topic.on('userCurrentLocationSet',loc=>this.listNearGet(loc))
    this.listNearReload();
  },
  ionViewDidEnter(){
    this.listNearReload();
  },
  watch:{
    '$route'(to,from){
      if(to=='/catalog/'){
        this.listNearReload();
      }
    }
  }
};
</script>