<template>
      <ion-card v-if="permission=='default' && !wasRejected" color="light">
        <ion-card-content>
          Чтобы вовремя узнавать об изменениях статусов заказов, подпишитесь на уведомления
          <p>
            <ion-button @click="reject()" color="light">Отказаться</ion-button>
            <ion-button @click="subscribe()">Подписаться</ion-button>
          </p>
        </ion-card-content>        
      </ion-card>
</template>
<script>
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

import {
  IonButton,
  IonCard,
  IonCardContent,
}             from "@ionic/vue"
import jQuery from 'jquery'

export default {
  components:{
  IonButton,
  IonCard,
  IonCardContent,
  },
  data(){
    return {
      permission:Notification.permission,
      wasRejected:localStorage.pushNotificationsWasRejected
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
    reject(){
      localStorage.pushNotificationsWasRejected=this.wasRejected=1
    },
    mounted(){
      if(!this.$heap.state?.settings?.firebase){
        return
      }
      initializeApp(this.$heap.state.settings.firebase);
    }
  },
}
</script>