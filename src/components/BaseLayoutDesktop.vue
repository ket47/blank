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
            <ion-img class="toolbar_logo" src="./assets/icon/tezkel_logo_dark.png"></ion-img>
            <ion-tab-bar>
              <ion-tab-button tab="tab1" href="/home" routerDirection="backward">
                <ion-row>
                  <ion-icon :icon="homeIcon"/>
                  <ion-label>Главная</ion-label>
                </ion-row>
              </ion-tab-button>
              <ion-tab-button tab="tab2" href="/search" routerDirection="backward">
                <ion-row>
                  <ion-icon :icon="searchIcon"/>
                  <ion-label>Поиск</ion-label>
                </ion-row>
              </ion-tab-button>
              <ion-tab-button tab="tab3" href="/order-list" routerDirection="backward">
                <ion-row>
                  <ion-icon :icon="ordersIcon"/>
                  <ion-label>Заказы</ion-label>
                </ion-row>
              </ion-tab-button>
              <ion-tab-button tab="tab4" href="/user-dashboard" routerDirection="backward">
                <ion-row>
                  <ion-icon :icon="personIcon"/>
                  <ion-label>Аккаунт</ion-label>
                </ion-row>
              </ion-tab-button>
            </ion-tab-bar>
          </ion-col>
          <ion-col class="ion-middle-column" :size="cartListTotal>0?6:9">
            <div class="page-content">
                <h1 style="margin:30px" v-if="pageTitle">{{ pageTitle }}</h1>
                <slot/>
            </div>
          </ion-col>
          <ion-col class="ion-right-column" size="3" v-if="cartListTotal">
            <cart-body-modal/>
          </ion-col>
        </ion-row>
      </ion-grid>
      <footer-desktop/>
    </ion-content>
  </ion-page>
</template>

<script>


import {
  IonPage,
  IonContent,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonImg,
  IonLabel,
  IonRow,
  IonCol,
  IonGrid,
} from "@ionic/vue";
import FooterDesktop  from "@/components/FooterDesktop";
import CartBodyModal  from '@/components/CartBodyModal.vue';
import Order          from '@/scripts/Order.js'

import personIcon     from "@/assets/icons/account.svg";
import ordersIcon     from "@/assets/icons/orders.svg";
import searchIcon     from "@/assets/icons/search.svg";
import homeIcon       from "@/assets/icons/home.svg";

import {
  cartOutline,
} from "ionicons/icons";

export default {
  setup() {
    return {
      personIcon,ordersIcon,searchIcon,homeIcon,cartOutline
    }
  },
  computed:{
    cartListTotal(){
      return Order.cart.listTotalGet()
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
    IonTabButton,
    IonImg,
    IonLabel,
    IonRow,
    IonCol,
    IonGrid,
    CartBodyModal,
    FooterDesktop
  },
};
</script>
