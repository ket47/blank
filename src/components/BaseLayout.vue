<template>
  <ion-page>
    <ion-header :class="[pageClass]">
      <ion-toolbar>
        <ion-buttons slot="start" style="width:100px">
          <ion-back-button :default-href="pageDefaultBackLink"></ion-back-button>
        </ion-buttons>
        <ion-img class="toolbar_logo" src="./assets/icon/tezkel_logo.png"></ion-img>
        <div slot="end" style="width:100px">
          <cart-header slot="end"></cart-header>
        </div>
      </ion-toolbar>
      <ion-title v-if="pageTitle" style="height: 40px; text-align: center; color: var(--ion-color-medium)">{{ pageTitle }}</ion-title>
    </ion-header>
    <ion-content
      :class="[pageClass]"
      :scrollEvents="contentOnScroll ? 'true' : 'false'"
      @ionScroll="contentOnScroll($event)"
    >
      <slot />
    </ion-content>
    <ion-footer>
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
  --background: var(--ion-background-primary);
}
.toolbar_logo {
  width: auto;
  height: 40px;
  margin: 0 auto;
}
</style>