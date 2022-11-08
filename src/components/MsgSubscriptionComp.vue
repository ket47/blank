<template>
      <ion-card v-if="permission=='default' && !wasRejected" color="light">
        <ion-card-content>
          Чтобы вовремя узнавать об изменениях статусов заказов, подпишитесь на уведомления
          <p>
            <!--
            <ion-button @click="reject()" color="light">Отказаться</ion-button>
            -->
            <ion-button @click="subscribe()" expand="block">Подписаться</ion-button>
          </p>
        </ion-card-content>        
      </ion-card>
</template>
<script>
import User from '@/scripts/User'

import {
  IonButton,
  IonCard,
  IonCardContent,
}             from "@ionic/vue"

export default {
  components:{
  IonButton,
  IonCard,
  IonCardContent,
  },
  data(){
    let perm=("Notification" in window)?Notification.permission:'notsupported';
    return {
      permission:perm,
      wasRejected:0//localStorage.pushNotificationsWasRejected
    }
  },
  methods: {
    async subscribe(){
      if( !("Notification" in window) ){
        this.$flash("Ваше устройство не поддерживает уведомления")
        return
      }
      try{
        this.permission=await Notification.requestPermission()
        if(this.permission=='granted'){
          User.firebase.saveNotificationToken()
        }
      }catch(err){
        this.$flash("Вы не разрешили уведомлять вас")
      }
    },
    reject(){
      localStorage.pushNotificationsWasRejected=this.wasRejected=1
    },
  },
}
</script>