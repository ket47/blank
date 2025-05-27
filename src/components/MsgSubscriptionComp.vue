<template>
      <ion-card v-if="permission=='default'" color="light">
        <ion-card-content>
          Чтобы вовремя узнавать об изменениях статусов заказов, подпишитесь на уведомления
          <p>
            <ion-button @click="subscribe()" expand="block">Подписаться</ion-button>
          </p>
        </ion-card-content>        
      </ion-card>
      <ion-card v-if="permission=='denied'">
        <ion-card-content>
          <ion-item lines="none">
            <ion-icon :src="notificationsOffOutline" color="primary" slot="start"/>
            Уведомления от нашего сайта были заблокированы вами. Для полноценной работы приложения, рекомендуем влючить уведомления от сайта {{$heap.state?.settings?.app?.frontendUrl??''}} в настройках вашего браузера.
          </ion-item>
        </ion-card-content>        
      </ion-card>

      <ion-item v-if="permission=='notsupported' && 0" lines="none">
        <ion-icon :src="notificationsOffOutline" color="primary" slot="start"/>
        Уведомления не поддерживаются этим устройством.
      </ion-item>

      <ion-item v-if="0&&permission=='granted'" lines="none">
        <ion-icon :src="notificationsOutline" color="primary" slot="start"/>
        Уведомления включены
      </ion-item>
</template>
<script>
import User from '@/scripts/User'
import { notificationsOutline,notificationsOffOutline }             from 'ionicons/icons';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
}             from "@ionic/vue"

export default {
  components:{
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  },
  setup(){
    return {notificationsOutline,notificationsOffOutline}
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