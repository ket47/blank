<template>
  <ion-page>
    <ion-header :class="[pageClass]">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="pageDefaultBackLink" color="light" :text="''" style="padding:0px 10px"></ion-back-button>
        </ion-buttons>
        <ion-title v-if="pageTitle" size="small">{{ pageTitle }}</ion-title>
        <ion-img v-if="pageLogo" style="height:30px;width:auto" :src="pageLogo"/>
        <div slot="end">
          <cart-header slot="end"></cart-header>
        </div>
      </ion-toolbar>  
    </ion-header>
    <ion-content
      :class="['main-container', pageClass]"
      :scrollEvents="contentOnScroll ? 'true' : 'false'"
      @ionScroll="contentOnScroll($event)"
    >
      <slot />
    </ion-content>
    <ion-footer collapse="fade">
      <ion-text color="danger">
        {{ errorMessage }}
      </ion-text>
    </ion-footer>
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
} from "@ionic/vue";
import CartHeader from "@/components/CartHeader";

export default {
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
    CartHeader
  },
};
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