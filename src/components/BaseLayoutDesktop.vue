<style scoped>
  ion-icon{
    font-size:2.5em !important;
  }
ion-tab-bar>div{
  width:100%;
  padding: 10px;
  padding-left: 30%;
  text-align: left;
  cursor: pointer;
}
ion-tabs ion-icon{
  font-size:1.5em;
}
.desktop-tab-selected ion-label{
  color: var(--ion-color-primary);
}
.desktop-tab-selected .active{
  display:inline-block;
}
.desktop-tab-selected .passive{
  display:none;
}
.active{
  display:none;
}
.passive{
  display:inline-block;
}
</style>

<template>
  <ion-page>
    <ion-content :class="['desktop-main-container', pageClass]" :scrollEvents="contentOnScroll ? 'true' : 'false'" @ionScroll="contentOnScroll($event)">
      <div class="main-grid">
        <div></div>
        <div style="background:white;">
          <div class="page-content" style="">
            <ion-toolbar style="padding-right: 20px;">
              <ion-buttons v-if="forceBackButton" slot="start">
                <ion-button @click="goback()"><ion-icon :src="arrowBackOutline" size="large"/></ion-button>
              </ion-buttons>
              <ion-title><h4 style="margin:20px; text-align:center;" v-if="pageTitle">{{ pageTitle }}</h4></ion-title>
              <cart-header slot="end"></cart-header>
            </ion-toolbar>
            <slot/>
          </div>
        </div>
        <div></div>
      </div>
      <footer-desktop/>
      <stories-startup-modal-trigger/>
      <cookies-modal/>
    </ion-content>
  </ion-page>
</template>

<script>

import {
  cartOutline,
  arrowBackOutline
}                     from "ionicons/icons";
import {
  IonPage,
  IonContent,
  IonTitle,
  IonIcon,
  IonToolbar,
  IonButtons,
  IonButton
}                     from "@ionic/vue";
import FooterDesktop  from "@/components/FooterDesktop";
import CartHeader     from "@/components/CartHeader";
import Order          from '@/scripts/Order.js'
import StoriesStartupModalTrigger   from "@/components/PostStoriesStartupModalTrigger.vue"
import CookiesModal   from "@/components/CookiesModal.vue"
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    return {
      route,
      cartOutline,
      arrowBackOutline
    }
  },
  data() {
    return {
      forceBackButton: this.route.meta.forceBackButton
    }
  },
  computed:{
    cartListTotal(){
      return Order.cart.listTotalGet()
    },
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
    CartHeader,
    FooterDesktop,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    StoriesStartupModalTrigger,
    CookiesModal
  },
  methods: {
    goback(){
      if(this.pageDefaultBackLink){
        return this.$go(this.pageDefaultBackLink)
      }
      history.back()
    },
  },
};
</script>
