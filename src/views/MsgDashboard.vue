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

      <div v-if="permission=='granted'">

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
import User from '@/scripts/User'

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
    }
  },
  methods: {
    async subscribe(){
      try{
        this.permission=await Notification.requestPermission()
        if(this.permission=='granted'){
          User.firebase.saveNotificationToken()
        }
      }catch(err){
        this.$flash("Вы не разрешили уведомлять вас")
      }
    },
  },
}
</script>