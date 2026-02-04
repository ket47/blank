<style scoped>
.special-grid{
  display: flex;
  overflow: auto;
  white-space: nowrap;
  padding: 0 5px;
}
.fake-searchbar{
  background: white;
  box-shadow: 0px 0px 10px -5px black;
  display: flex;
  align-items: center;
  border-radius: 10px;
  cursor: text;
  margin: 5px 10px 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  color: #8e8e8e;
}
.fake-searchbar span{
  font-size: 14px;
}
.delivery-block{
  background: var(--ion-color-light); 
  margin: 5px; 
  border-radius: 10px; 
  align-content: center;  
  min-width: 280px;
  width: 50%;
}
@media screen and (max-width: 740px) {
  .special-grid{
    grid-template-columns: 100%;
  }
}
@media screen and (min-width: 1420px) {
  .special-grid{
    grid-template-columns: 30% 70%;
  }
}
.hidden-block{
  display: none;
}
</style>
<template>
  <base-layout :pageLogo="'show'" hideBackLink="true" :contentOnScroll="onScroll" >
    <div ref="topMarker"></div>
    <user-address-widget :deliveryTime="primaryDeliveryTime" />
    <home-slider :is-editable="isAdmin" :is-promoted="true"/>
    <stories-slider :is-editable="isAdmin"/>
    <!-- <home-primary-category-widget @deliveryTimeGet="deliveryTime=>{primaryDeliveryTime=deliveryTime}"/> -->
    <div class="special-grid">
      <home-promo-counter />
      <div class="ion-padding-vertical delivery-block">
        <ion-item color="transparent" lines="none" button detail="true" :detailIcon="chevronForwardOutline" @click="$go(`/order/shipment-0`)">
          <img slot="start" src="/img/delivery_box.png" width="60"/>
          <ion-label style="white-space: initial;">
            <strong>ВЫЗВАТЬ КУРЬЕРА</strong>
            <p style="font-size: 12px; line-height: 16px; margin-top: 5px;">Доставим всё, что Вам нужно</p>
          </ion-label>
        </ion-item>
      </div>
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
    <ion-fab horizontal="end" vertical="bottom" slot="fixed" class="hidden-block" ref="scrollToTopButton" @click="scrollToTop()" style="position: fixed">
      <ion-fab-button>
        <ion-icon :icon="chevronUpOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <stories-startup-modal-trigger/>
    <user-reaction-suggest :isNeedToBeShown="reactionSuggestModal"/>
  </base-layout>
</template>

<script>
import HomeSlider                 from "@/components/HomeSlider";
import StoreListNew               from "@/components/StoreListNew";
import HomePromoCounter           from "@/components/HomePromoCounter";
import UserAddressWidget          from "@/components/UserAddressWidget";
import ProductListHomeInfinite    from "@/components/ProductListHomeInfinite";
import StoriesSlider              from "@/components/PostStoriesSlider";
import StoriesStartupModalTrigger from "@/components/PostStoriesStartupModalTrigger.vue"
import UserReactionSuggest        from "@/components/UserReactionSuggest.vue"


import Utils                      from '@/scripts/Utils.js'
import User                       from '@/scripts/User.js';

import {
  IonIcon,
  IonItem,
  IonFab,
  IonFabButton,
  IonButtons,
  IonButton,
  IonLabel,
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
}                   from "@ionic/vue";

import {  
  chevronBackOutline,
  searchOutline,
  chevronForwardOutline,
  chevronUpOutline
}                   from 'ionicons/icons'

export default {
  setup() {
    return {
      chevronBackOutline,
      searchOutline,
      chevronForwardOutline,
      chevronUpOutline
    }
  },
  components: {
    IonIcon,
    IonButtons,
    IonButton,
    HomeSlider,
    IonFab,
    IonFabButton,
    StoreListNew,
    IonItem,
    IonLabel,
    UserAddressWidget,
    HomePromoCounter,
    ProductListHomeInfinite,
    IonInfiniteScroll, 
    IonInfiniteScrollContent,
    StoriesSlider,
    StoriesStartupModalTrigger,
    UserReactionSuggest
  },
  data(){
    return {
      out:{},
      primaryDeliveryTime: null,
      outofrangeFormHidden:0,
      hiddenCount:null,
      storeSliderLoadQueue: 100,
      mounted_at:0,
      isAdmin: false,
      reactionSuggestModal: false
    }
  },
  computed: {
    showndelivery_address(){
      if( this.$heap.state.user.location_main.is_default!=1 ){
        return this.$heap.state.user.location_main.location_address
      }
      return this.$heap.state.user.location_current?.location_address
    }
  },
  mounted(){
    this.isAdmin = User.isAdmin()
  },
  created(){
    if(this.$heap.state.settings?.other?.chameleonMode == 'on'){
      this.$router.replace('/chameleon-home')
      return;
    }
    this.$topic.on('userGet',user=>{
      this.isAdmin = User.isAdmin()
    })
  },
  ionViewDidEnter() {
    if(this.$heap.state.settings?.other?.chameleonMode == 'on'){
      this.$router.replace('/chameleon-home')
      return;
    }
  },
  methods: {
    async listLoadMore(ev){
      await this.$refs.productlist_infinite.listNearGet()
      ev.target.complete();
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
    loadStoreSlider(InfiniteScrollEvent){
      this.storeSliderLoadQueue++;
      InfiniteScrollEvent.target.complete();
    },
    onScroll(event) {
      this.detectScrollElement('scrollToTopButton', event);
    },
    detectScrollElement(refName, event){
      if(!this.$refs[refName]){
        return
      }
      const element = this.$refs[refName].$el ?? this.$refs[refName]
      const offsetTop=element.offsetTop;
      if (event.detail.scrollTop > 200 ) {
        element.classList?.remove("hidden-block");
      } else {
        element.classList?.add("hidden-block");
      }
      if (event.detail.scrollTop > 400 && !this.reactionSuggestModal) this.reactionSuggestModal = true;
    },
    scrollToTop() {
      this.$refs.topMarker.scrollIntoView();
    },
  }
};
</script>