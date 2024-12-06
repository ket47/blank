<template>
  <ion-page>
    <ion-header v-if="!hideTitle" :class="[pageClass]">
      <ion-toolbar>
        <ion-buttons v-if="canGoBack" slot="start">
          <ion-button v-if="isIos" @click="goback()"><ion-icon :src="chevronBackOutline"/>Назад</ion-button>
          <ion-button v-else @click="goback()"><ion-icon :src="arrowBackOutline" size="large"/></ion-button>
        </ion-buttons>
        <ion-title v-if="pageTitle" size="small"><div style="line-height: 1.5;max-height:3em;text-overflow: ellipsis;overflow: hidden;font-weight: bold;">{{ pageTitle }}</div></ion-title>
        <ion-icon  v-if="pageLogo" class="toolbar_svg_logo" style="color: var(--ion-color-primary)" :icon="pageLogo"/>
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
      <ion-modal :is-open="is_install_popup_open" :initialBreakpoint="0.4" @didDismiss="installPromptDissmiss()">
        <ion-content class="ion-padding">
          <h3>Установите приложение</h3>
          <div v-if="isIos">
            <ion-list lines="none">
              <ion-item>
                <img slot="start" src="/img/icons/Safari_browser_logo.svg" style="width:27px"/>
                откройте сайт tezkel.com в Safari 
              </ion-item>
              <ion-item>
                 нажмите поделиться 
                 <ion-icon slot="start" :src="shareOutline" color="primary" size="large"/>
              </ion-item>
              <ion-item>
                 На экран «Домой»
                 <ion-icon slot="start" :src="addCircleOutline" color="primary" size="large"/>
              </ion-item>
            </ion-list>
          </div>
          <div v-if="isAndroid">
            <p style="color:#999;padding:10px 0px 10px 0px">
              Установите наше приложение, чтобы оно всегда было под рукой
            </p> 
            <a href="https://play.google.com/store/apps/details?id=com.tezkel.twa" target="_new">
              <ion-button expand="block">
                <ion-icon slot="start" :src="logoGooglePlaystore"></ion-icon>
                Установить
              </ion-button>
            </a>
          </div>
          <ion-button expand="block" color="light" @click="installPromptDissmiss()">Закрыть</ion-button>
        </ion-content>
      </ion-modal>
      <div style="height:30px"><!--spacer for bottom main tabs--></div>
      <ion-fab v-if="isInteractingWithServer" vertical="bottom" slot="fixed">
        <tezkel-loader/>
      </ion-fab>
      <stories-startup-modal-trigger/>
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
  IonModal,
  IonList,
  IonItem,
}                           from "@ionic/vue";
import CartHeader           from "@/components/CartHeader";
import { defineComponent }  from "@vue/runtime-core";
import TezkelLoader         from "@/components/TezkelLoader.vue"
import StoriesStartupModalTrigger         from "@/components/StoriesStartupModalTrigger.vue"

import {
  arrowBackOutline,
  chevronBackOutline,
  closeOutline,
  shareOutline,
  addCircleOutline, 
  logoAppleAppstore,
  logoGooglePlaystore
}                           from "ionicons/icons";

export default defineComponent({
  props: [
    "pageTitle",
    "pageLogo",
    "pageDefaultBackLink",
    "hideBackLink",
    "hideTitle",
    "errorMessage",
    "pageClass",
    "cartComponent",
    "contentOnScroll",
    "headerColor"
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
    TezkelLoader,
    IonModal,
    IonList,
    IonItem,
    StoriesStartupModalTrigger
  },
  setup(){
    return {
      arrowBackOutline,
      chevronBackOutline,
      closeOutline,
      shareOutline,
      addCircleOutline,
      logoAppleAppstore,
      logoGooglePlaystore,
    }
  },
  data(){
    return {
      is_install_popup_open:0
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
      if(this.pageDefaultBackLink){
        return 1
      }
      return history.state.back?1:0
    },
    isIos(){
      return isPlatform('ios')
    },
    isAndroid(){
      return isPlatform('android')
    },
  },
  mounted(){
    setTimeout(()=>{
      this.installPromptInit()
    },10000)
  },
  methods:{
    reload(){
      location.reload();
    },
    goback(){
      if(this.pageDefaultBackLink){
        return this.$go(this.pageDefaultBackLink)
      }
      history.back()
    },
    installPromptInit(){
        const alreadyDissmissed=localStorage.installPrompDissmissed*1 || localStorage.iosInstallAppPromptDismissed*1 || localStorage.androidInstallAppPromptDismissed*1
        if( alreadyDissmissed || isPlatform('capacitor') ){
          return
        }
        this.is_install_popup_open=1
    },
    installPromptDissmiss(){
      localStorage.installPrompDissmissed=1
      this.is_install_popup_open=0
    },    
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
    width: 120px;
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
</style>