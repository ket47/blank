<template>
  <ion-page>
    <ion-header :class="[pageClass]">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="pageDefaultBackLink" color="light" style="padding:0px 10px"></ion-back-button>
        </ion-buttons>
        <ion-title v-if="pageTitle" size="small"><div style="line-height: 1.5;max-height:3em;text-overflow: ellipsis;">{{ pageTitle }}</div></ion-title>
        
        <ion-icon class="toolbar_svg_logo" style="color: white"  :icon="mainLogo"/>
        <div slot="end">
          <cart-header slot="end"></cart-header>
        </div>
      </ion-toolbar>  
    </ion-header>
    <ion-content :class="['main-container', pageClass]" :scrollEvents="contentOnScroll ? 'true' : 'false'" @ionScroll="contentOnScroll($event)">
      
      <ion-refresher slot="fixed" id="refresher" @ionRefresh="reload()">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <slot />
      <div style="height:30px"><!--spacer for bottom main tabs--></div>
      <ion-fab v-if="isInteractingWithServer" vertical="bottom" horizontal="end" slot="fixed">
        <ion-spinner></ion-spinner>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonImg,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonFab
}                           from "@ionic/vue";
import CartHeader           from "@/components/CartHeader";
import { defineComponent }  from "@vue/runtime-core";
import mainLogo             from "@/assets/icons/tezkel_logo.svg";

export default defineComponent({
  setup() {
    return {
      mainLogo
    }
  },
  props: [
    "pageTitle",
    "pageLogo",
    "pageDefaultBackLink",
    "errorMessage",
    "pageClass",
    "cartComponent",
    "contentOnScroll",
  ],
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonImg,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonFab,
    CartHeader
  },
  computed:{
    isInteractingWithServer(){
      return this.$heap.state.isInteractingWithServer
    }
  },
  methods:{
    reload(){
      location.reload();
    }
  }
})
</script>

<style>

ion-header ion-toolbar {
  --min-height: 56px;
  --background: var(--ion-background-primary);
}
ion-header ion-toolbar ion-title{
  color: white;
  text-align: left;
  padding: 0 1em;
  font-size: 16px;
}
.toolbar_svg_logo {
    height: 42px;
    width: 161px;
    margin: 0 auto;
    display: block;
}
</style>