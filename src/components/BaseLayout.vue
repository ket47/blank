<template>
    <ion-page>
        <ion-header :class="[pageClass]">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button :default-href="pageDefaultBackLink"></ion-back-button>
                </ion-buttons>
                <ion-title >
                  <ion-img class="logo" src="./assets/icon/tezkel_logo.png"></ion-img>
                </ion-title>
                <component v-bind:is="cartComponent"  slot="end"></component>
            </ion-toolbar>
        </ion-header>
        <ion-content  :class="[pageClass]" :scrollEvents="(contentOnScroll) ? 'true' : 'false'" @ionScroll="contentOnScroll($event)">
            <slot />
            <ion-card></ion-card>
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
  IonButtons
} from '@ionic/vue';

export default  {
  props: ['pageTitle', 'pageDefaultBackLink', 'errorMessage', 'pageClass', 'cartComponent', 'contentOnScroll'],
  components: { 
    IonPage,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonBackButton,
    IonButtons
  }
}
</script>

<style>
ion-header ion-toolbar{
  --background: var(--ion-background-primary);
  text-align: center;
}
.toolbar-container{
  overflow: visible;
  contain: initial;
}
ion-title .logo{
  visibility: visible;
  width: 130px;
  margin: 0 auto;
}
</style>