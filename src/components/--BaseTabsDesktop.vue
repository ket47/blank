<style scoped>
  ion-icon{
    font-size:2.5em !important;
  }
 /** @import url('../theme/base_layout_desktop.css');*/
</style>

<template>
  <ion-page>
    <ion-content class="desktop-main-container">
      <ion-grid>
        <ion-row>
          <ion-col class="ion-left-column" size="3">
            <router-link to="/">
              <ion-icon class="toolbar_svg_logo ion-color ion-color-primary"  :icon="mainLogo"/>
            </router-link>
            <ion-tab-bar>
              <ion-tab-button tab="catalog" href="/catalog" routerDirection="back">
                <ion-row>
                  <ion-icon :icon="storefrontOutline"/>
                  <ion-label>Каталог</ion-label>
                </ion-row>
              </ion-tab-button>
              <ion-tab-button tab="search" href="/search" routerDirection="back">
                <ion-row>
                  <ion-icon :icon="searchOutline"/>
                  <ion-label>Поиск</ion-label>
                </ion-row>
              </ion-tab-button>
              <ion-tab-button tab="order" href="/order/" routerDirection="back">
                <ion-row>
                  <ion-icon :icon="readerOutline"/>
                  <ion-label>Заказы
                  <sup><ion-badge color="warning" style="font-size:0.7em" v-if="activeOrderCount>0">{{activeOrderCount}}</ion-badge></sup>
                  </ion-label>
                </ion-row>
              </ion-tab-button>
              <ion-tab-button tab="user" href="/user" routerDirection="back">
                <ion-row>
                  <ion-icon :icon="personOutline"/>
                  <ion-label>Профиль</ion-label>
                </ion-row>
              </ion-tab-button>
            </ion-tab-bar>
          </ion-col>
          <ion-col>

              <ion-toolbar>
                <ion-title><h1 style="margin:30px" v-if="pageTitle">{{ pageTitle }}</h1></ion-title>
                <cart-header slot="end"></cart-header>
              </ion-toolbar>
              
              <ion-router-outlet></ion-router-outlet>
              
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <footer-desktop/>
            <ion-fab v-if="isInteractingWithServer" vertical="center" horizontal="center" slot="fixed">
              <tezkel-loader/>
            </ion-fab>           
          </ion-col>
        </ion-row>
      </ion-grid>
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
  IonRouterOutlet,
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
}                     from 'ionicons/icons';
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
    IonRouterOutlet,
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
