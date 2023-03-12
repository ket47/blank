<template>
  <ion-page>
    <ion-header :class="[pageClass]">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button style="padding:0px 10px"></ion-back-button>
        </ion-buttons>
        <ion-title v-if="pageTitle" size="small"><div style="line-height: 1.5;max-height:3em;text-overflow: ellipsis;overflow: hidden;font-weight: bold;">{{ pageTitle }}</div></ion-title>
        
        <router-link to="/">
          <ion-icon  v-if="pageLogo" class="toolbar_svg_logo" style="color: var(--ion-color-primary)"  :icon="pageLogo"/>
        </router-link>
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
  IonBackButton,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonIcon
}                           from "@ionic/vue";
import CartHeader           from "@/components/CartHeader";
import { defineComponent }  from "@vue/runtime-core";
import TezkelLoader   from "@/components/TezkelLoader.vue"

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
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonIcon,
    CartHeader,
    TezkelLoader
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
  },
  // updated(){
  //   //console.log(this.pageTitle)
  //   document.title=this.pageTitle
  // },
  // watch:{
  //   pageTitle:function(val){
  //     document.title=val
  //   }
  // }
})
</script>

<style>

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
</style>