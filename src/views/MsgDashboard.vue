<template>
  <base-layout pageTitle="Уведомления">
      <ion-card v-if="permission=='denied'" color="danger">
        <ion-card-header>
          <ion-card-title>Уведомления заблокированы вами</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          К сожалению, мы не сможем уведомлять вас о статусах заказов 
          <p>
            <ion-button @click="subscribe()" expand="full">Подписаться на уведомления</ion-button>
          </p>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="permission=='default'" color="warning">
        <ion-card-header>
          <ion-card-title>Уведомления не разрешены</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Чтобы вовремя узнавать об изменениях статусов заказов, подпишитесь на уведомления
          <p>
            <ion-button @click="subscribe()" expand="full">Подписаться на уведомления</ion-button>
          </p>
        </ion-card-content>        
      </ion-card>

      <div v-if="registered">

        <ion-card color="success">
          <ion-card-header>
            <ion-card-title>Вы подписаны на уведомления</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Вам будут приходить некоторые уведомления</p>
          </ion-card-content>
        </ion-card>
        <ion-list>
          <ion-item-divider>Темы уведомлений</ion-item-divider>
          <ion-item>Статусы заказов</ion-item>
          <ion-item>Начисленные бонусы</ion-item>
        </ion-list>
      </div>

  </base-layout>
</template>
<script>
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonItemDivider,
}             from "@ionic/vue"
import jQuery from 'jquery'

export default {
  components:{
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonItemDivider,
  },
  data(){
    return {
      permission:Notification.permission,
      registered:false
    }
  },
  methods: {
    async saveNotificationToken(){
      if(this.permission!='granted'){
        return
      }
      if( !(this.$heap.state.user.user_id>0) || !this.$heap.state.settings?.firebase || this.registered ){
        return
      }
      try{
        const vapidKey=this.$heap.state.settings.firebase.vapidKey
        const messaging = getMessaging();
        const token=await getToken(messaging, {vapidKey});
        const request={
          type:'webpush',
          registration_id:token,
          user_agent:navigator.userAgent
        }
        await jQuery.post(`${this.$heap.state.hostname}MessageSub/itemCreate`,request)
        this.registered=true;
      }catch(err){
        console.log(err)
      }
    },
    async subscribe(){
      try{
        this.permission=await Notification.requestPermission()
        if(this.permission=='granted'){
          this.saveNotificationToken()
        }
      }catch(err){
        this.$flash("Вы не разрешили уведомлять вас")
      }
    },
    init(){
      if(!this.$heap.state?.settings?.firebase){
        return
      }
      initializeApp(this.$heap.state.settings.firebase);
    }
  },
  mounted() {
    const self=this
    this.$topic.on('settingsGet',function(){
      self.init()
      self.saveNotificationToken()
    })
    this.$topic.on('userGet',function(){
      self.saveNotificationToken()
    })
    self.init()
    self.saveNotificationToken()
  },
}
</script>