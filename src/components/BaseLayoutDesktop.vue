<style scoped>
  ion-icon{
    font-size:2.5em !important;
  }
</style>

<template>
  <ion-page>
    <ion-content :class="['desktop-main-container', pageClass]" :scrollEvents="contentOnScroll ? 'true' : 'false'" @ionScroll="contentOnScroll($event)">
      <ion-grid class="desktop-template" :class="[pageClass]">
        <ion-row>
          <ion-col class="ion-left-column" size="3">
            <ion-icon class="toolbar_svg_logo ion-color ion-color-primary"  :icon="mainLogo"/>
            <ion-tab-bar>
              <ion-tab-button tab="tab1" href="/catalog/" routerDirection="root">
                <ion-row>
                  <ion-icon :icon="storefrontOutline"/>
                  <ion-label>Каталог</ion-label>
                </ion-row>
              </ion-tab-button>
              <ion-tab-button tab="tab2" href="/search/" routerDirection="root">
                <ion-row>
                  <ion-icon :icon="searchOutline"/>
                  <ion-label>Поиск</ion-label>
                </ion-row>
              </ion-tab-button>
              <ion-tab-button tab="tab3" href="/order/" routerDirection="root">
                <ion-row>
                  <ion-icon :icon="readerOutline"/>
                  <ion-label>Заказы
                  <sup><ion-badge color="warning" style="font-size:0.7em" v-if="activeOrderCount>0">{{activeOrderCount}}</ion-badge></sup>
                  </ion-label>
                </ion-row>
              </ion-tab-button>
              <ion-tab-button tab="tab4" href="/user/" routerDirection="root">
                <ion-row>
                  <ion-icon :icon="personOutline"/>
                  <ion-label>Профиль</ion-label>
                </ion-row>
              </ion-tab-button>
            </ion-tab-bar>
          </ion-col>
          <ion-col class="ion-middle-column" :size="9">
            <div class="page-content">
              <ion-toolbar>
                <ion-title><h1 style="margin:30px" v-if="pageTitle">{{ pageTitle }}</h1></ion-title>
                <cart-header slot="end"></cart-header>
              </ion-toolbar>
              <slot/>
                
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
      <footer-desktop/>
      <ion-fab v-if="isInteractingWithServer" vertical="center" horizontal="center" slot="fixed">
        <tezkel-loader/>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>


import {
  IonPage,
  IonContent,
  IonIcon,
  IonTabBar,
  IonToolbar,
  IonTitle,
  IonTabButton,
  IonLabel,
  IonRow,
  IonCol,
  IonGrid,
  IonFab,
  IonBadge,
} from "@ionic/vue";
import TezkelLoader   from "@/components/TezkelLoader.vue"
import FooterDesktop  from "@/components/FooterDesktop";
//import CartBodyModal  from '@/components/CartBodyModal.vue';
import CartHeader     from "@/components/CartHeader";
import Order          from '@/scripts/Order.js'

import {
  storefrontOutline,
  searchOutline,
  personOutline,
  readerOutline,
}                   from 'ionicons/icons';
import mainLogo       from "@/assets/icons/tezkel_logo.svg";

import {
  cartOutline,
} from "ionicons/icons";

export default {
  setup() {
    return {
      storefrontOutline,
      searchOutline,
      personOutline,
      readerOutline,
      cartOutline,
      mainLogo
    }
  },
  computed:{
    cartListTotal(){
      return Order.cart.listTotalGet()
    },
    isInteractingWithServer(){
      return this.$heap.state.isInteractingWithServer
    }
  },
  props: [
    "pageTitle",
    "pageDefaultBackLink",
    "errorMessage",
    "pageClass",
    "cartComponent",
    "contentOnScroll",
  ],
  components: {
    IonPage,
    IonContent,
    IonIcon,
    IonTabBar,
    IonToolbar,
    IonTitle,
    IonTabButton,
    IonLabel,
    IonRow,
    IonCol,
    IonGrid,
    //CartBodyModal,
    CartHeader,
    IonFab,
    FooterDesktop,
    TezkelLoader,
    IonBadge,
  },
  data(){
    return {
      activeOrderCount:0
    }
  },
  async created(){
    const self=this
    this.$topic.on('pushStageChanged',data=>{
      self.activeOrderCount=data?.orderActiveCount
    })
    this.activeOrderCount=await Order.api.listCount()
  }
};
</script>
