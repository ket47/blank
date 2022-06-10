<template>
  <ion-header>
      <ion-toolbar color="secondary">
          <ion-title>Ваши скидки</ion-title>
          <ion-icon :icon="closeOutline" @click="$topic.publish('dismissModal')" slot="end" size="large"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
        <ion-item v-for="promo in promoList" :key="promo.promo_id" button detail @click="promoPick(promo)">
            <ion-icon slot="start" :icon="giftOutline" color="primary"/>
            <ion-text>{{promo.promo_name}}</ion-text>
            <ion-text slot="end" color="success">{{promo.promo_value}}{{$heap.state.currencySign}}</ion-text>
        </ion-item>
        <ion-item button detail @click="promoPick({})">
            <ion-icon slot="start" :icon="banOutline"/>
            <ion-text>Без скидки</ion-text>
            <ion-text slot="end">0{{$heap.state.currencySign}}</ion-text>
        </ion-item>
    </ion-list>
  </ion-content>
</template>
<script>
import {
  IonIcon,
  IonToolbar,
  IonHeader,
  IonContent,
  IonTitle,
  IonList,
  IonItem,
  IonText,
  modalController,
}                       from '@ionic/vue'
import {
    giftOutline,
    closeOutline,
    banOutline,
}                       from 'ionicons/icons'
import jQuery           from 'jquery'
export default {
    components:{
  IonIcon,
  IonToolbar,
  IonHeader,
  IonContent,
  IonTitle,
  IonList,
  IonItem,
  IonText,
    },
    setup(){
        return {
    giftOutline,
    closeOutline,
        banOutline,
        }
    },
    data(){
        return {
            promoList:null
        }
    },
    mounted(){
        this.listGet()
    },
    methods:{
        async listGet(){
            try{
                this.promoList=await jQuery.post(`${this.$heap.state.hostname}Promo/listGet`)
            }catch{/** */}
        },
        promoPick(promo){
            modalController.dismiss(promo);
        }
    }
}
</script>