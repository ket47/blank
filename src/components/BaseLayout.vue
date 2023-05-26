<template>
  <ion-page>
    <ion-header :class="[pageClass]">
      <ion-toolbar>
        <ion-buttons v-if="canGoBack" slot="start">
          <ion-button v-if="isIos" @click="goback()">&nbsp;<ion-icon :src="chevronBackOutline"/>&nbsp;&nbsp;&nbsp;</ion-button>
          <ion-button v-else @click="goback()">&nbsp;<ion-icon :src="arrowBackOutline"/>&nbsp;&nbsp;&nbsp;</ion-button>
        </ion-buttons>
        <ion-title v-if="pageTitle" size="small"><div style="line-height: 1.5;max-height:3em;text-overflow: ellipsis;overflow: hidden;font-weight: bold;">{{ pageTitle }}</div></ion-title>
        <ion-icon  v-if="pageLogo" class="toolbar_svg_logo" style="color: var(--ion-color-primary)"  :icon="pageLogo"/>
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



      <div v-if="iosInstallPromptShow" class="installPrompt">
        <div>
          Установите это приложение на iPhone: <br/> 
          - нажмите <ion-icon :src="shareOutline" color="primary" size="large" /> и потом <br/> 
          - На экран «Домой» <ion-icon :src="addCircleOutline" size="large" color="light" />
        </div>
        <div>
          <ion-icon :src="closeOutline" style="float:right" size="large" color="medium" @click="iosInstallPromptDissmiss()" />
        </div>
      </div>


      <div style="height:30px"><!--spacer for bottom main tabs--></div>
      <ion-fab v-if="isInteractingWithServer" vertical="bottom" slot="fixed">
        <tezkel-loader/>
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
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonIcon,
  IonButton,
  isPlatform,
}                           from "@ionic/vue";
import CartHeader           from "@/components/CartHeader";
import { defineComponent }  from "@vue/runtime-core";
import TezkelLoader         from "@/components/TezkelLoader.vue"

import {
  arrowBackOutline,
  chevronBackOutline,
  closeOutline,
  shareOutline,
  addCircleOutline,
}                           from "ionicons/icons";

export default defineComponent({
  props: [
    "pageTitle",
    "pageLogo",
    "pageDefaultBackLink",
    "hideBackLink",
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
    IonButtons,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonIcon,
    IonButton,
    CartHeader,
    TezkelLoader
  },
  setup(){
    return {
      arrowBackOutline,
      chevronBackOutline,
      closeOutline,
      shareOutline,
      addCircleOutline,
    }
  },
  data(){
    return {
      isIosPromptDisssmissed:localStorage.iosInstallPromptDissmissed?1:0
    }
  },
  computed:{
    isInteractingWithServer(){
      return this.$heap.state.isInteractingWithServer
    },
    canGoBack(){
      if(this.hideBackLink){
        return 0
      }
      return history.state.back?1:0
    },
    isIos(){
      return isPlatform('ios')
    },
    iosInstallPromptShow(){
      return isPlatform('ios') && !isPlatform('capacitor') && !this.isIosPromptDisssmissed
    }
  },
  methods:{
    reload(){
      location.reload();
    },
    goback(){
      history.back()
    },
    iosInstallPromptDissmiss(){
      this.isIosPromptDisssmissed=localStorage.iosInstallPromptDissmissed=1
    }
  },
})
</script>

<style>
ion-buttons ion-icon{
  font-size: 1.7em;
}
.ion-page ion-header ion-toolbar:last-of-type {
  --min-height: 56px;
  --background: var(--ion-background);
  --border-width: 0;
}
ion-header ion-toolbar ion-title{
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
.installPrompt{
  position:fixed;
  bottom:25px;
  background-color: #000;
  background-color: rgba(0,0,0,0.8);
  color:white;
  border-radius: 10px;
  width: 100%;
  padding: 10px;
  display: grid;
  grid-template-columns: auto 30px;
  font-size: 1.2em;
  line-height: 25px;
}
.installPrompt ion-icon{
  margin-bottom: -10px;
}
</style>