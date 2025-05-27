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
        <div style="background:white;max-width:1200px">
          <div class="page-content" style="">
            <ion-toolbar>
              <ion-title><h1 style="margin:30px" v-if="pageTitle">{{ pageTitle }}</h1></ion-title>
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
}                     from "ionicons/icons";
import {
  IonPage,
  IonContent,
  IonTitle,
  IonToolbar,
}                     from "@ionic/vue";
import FooterDesktop  from "@/components/FooterDesktop";
import CartHeader     from "@/components/CartHeader";
import Order          from '@/scripts/Order.js'
import StoriesStartupModalTrigger   from "@/components/PostStoriesStartupModalTrigger.vue"
import CookiesModal   from "@/components/CookiesModal.vue"

export default {
  setup() {
    return {
      cartOutline,

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
    IonTitle,
    IonToolbar,
    StoriesStartupModalTrigger,
    CookiesModal
  },
};
</script>
