<template>
  <ion-page>
    <ion-content
      :class="['desktop-main-container', pageClass]"
      :scrollEvents="contentOnScroll ? 'true' : 'false'"
      @ionScroll="contentOnScroll($event)"
    >
    <ion-grid class="desktop-template" :class="[pageClass]">
      <ion-row>
        <ion-col class="ion-left-column" size="3">
          <ion-img class="toolbar_logo" src="./assets/icon/tezkel_logo_dark.png"></ion-img>
          <ion-tab-bar>
            <ion-tab-button tab="tab1" href="/home" routerDirection="backward">
              <ion-row>
                <ion-icon :icon="homeOutline" />
                <ion-label>Главная</ion-label>
              </ion-row>
            </ion-tab-button>
            <ion-tab-button tab="tab2" href="/search" routerDirection="backward">
              <ion-row>
                <ion-icon :icon="search" />
                <ion-label>Поиск</ion-label>
              </ion-row>
            </ion-tab-button>
            <ion-tab-button tab="tab3" href="/order-list" routerDirection="backward">
              <ion-row>
                <ion-icon src="./assets/icon/box-delivery.svg" style="font-size:30px;"/>
                <ion-label>Заказы</ion-label>
              </ion-row>
            </ion-tab-button>
            <ion-tab-button tab="tab4" href="/user-dashboard" routerDirection="backward">
              <ion-row>
                <ion-icon :icon="personOutline" />
                <ion-label>Аккаунт</ion-label>
              </ion-row>
            </ion-tab-button>
          </ion-tab-bar>
          <div slot="end" style="width:100px">
            <router-link :to="'/search'">
              <ion-icon :icon="search" />
            </router-link>
          </div>
        </ion-col>
        <ion-col class="ion-middle-column" :size="cartListTotal>0?6:9">
          <div class="page-content">
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button :default-href="pageDefaultBackLink"></ion-back-button>
              </ion-buttons>
              <ion-title class="page-title" v-if="pageTitle">{{ pageTitle }}</ion-title>
            </ion-toolbar>
            <slot />
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
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonTabBar,
  IonTabButton
} from "@ionic/vue";
import FooterDesktop from "@/components/FooterDesktop";
import CartBodyModal from '@/components/CartBodyModal.vue';
import Order from '@/scripts/Order.js'

import {
  personOutline,
  cartOutline,
  search,
  homeOutline,
} from "ionicons/icons";

export default {
  setup() {
    return {
      personOutline,
      cartOutline,
      search,
      homeOutline
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
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonIcon,
    IonTabBar,
    IonTabButton,
    CartBodyModal
  },
};
</script>
