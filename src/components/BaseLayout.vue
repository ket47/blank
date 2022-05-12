<template>
  <ion-page>
    <ion-header :class="[pageClass]">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="pageDefaultBackLink" color="light" :text="''" style="padding:0px 10px"></ion-back-button>
        </ion-buttons>
        <ion-title v-if="pageTitle" size="small"><div style="line-height: 1.5;max-height:3em;text-overflow: ellipsis;">{{ pageTitle }}</div></ion-title>
        <ion-img v-if="pageLogo" style="height:30px;width:auto" :src="pageLogo"/>
        <div slot="end">
          <cart-header slot="end"></cart-header>
        </div>
      </ion-toolbar>  
    </ion-header>
    <ion-content :class="['main-container', pageClass]" :scrollEvents="contentOnScroll ? 'true' : 'false'" @ionScroll="contentOnScroll($event)">
      <slot />
      <div style="height:30px"><!--spacer for bottom main tabs--></div>
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
  IonImg
}                           from "@ionic/vue";
import CartHeader           from "@/components/CartHeader";
import { defineComponent }  from "@vue/runtime-core";

export default defineComponent({
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
    CartHeader
  },
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
.toolbar_logo {
  width: auto;
  height: 40px;
  margin: 0 auto;
}
</style>