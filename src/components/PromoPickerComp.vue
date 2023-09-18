<template>
  <ion-header>
      <ion-toolbar>
        <ion-item lines="none">
          <ion-title>Ваши доступные скидки</ion-title>
          <ion-icon :icon="closeOutline" @click="$topic.publish('dismissModal')" slot="end" size="large"></ion-icon>
        </ion-item>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list v-if="promoList==null">
        <ion-item lines="none" v-for="skeleton in [1,2,3]" :key="skeleton">
            <ion-icon slot="start" :icon="giftOutline" color="primary"/>
            <ion-skeleton-text style="width:70%"></ion-skeleton-text>
            <ion-skeleton-text slot="end" style="width:50px"></ion-skeleton-text>
        </ion-item>
    </ion-list>

    <ion-list>
        <ion-item v-if="promoList?.length" button @click="promoPick({})">
            <ion-icon slot="start" :icon="banOutline" color="danger"/>
            <ion-text>Без скидки</ion-text>
            <ion-text slot="end">0{{$heap.state.currencySign}}</ion-text>
        </ion-item>
        <ion-item v-else>
            <ion-icon slot="start" :icon="giftOutline" color="medium"/>
            <ion-text color="medium">К сожалению, доступных скидок нет.</ion-text>
        </ion-item>

        <ion-item v-for="promo in promoList" :key="promo.promo_id" button @click="promoPick(promo)">
            <ion-icon slot="start" :icon="giftOutline" color="primary"/>
            <ion-text>{{promo.promo_name}}</ion-text>
            <ion-text slot="end" color="success">{{promo.promo_value}}{{$heap.state.currencySign}}</ion-text>
        </ion-item>
        
        <ion-item button detail @click="$go('/user/user-promo');$topic.publish('dismissModal')">
            <ion-text>Показать все ваши скидки <span v-if="!promoList?.length">или получить ещё</span></ion-text>
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
  IonSkeletonText,
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
  IonSkeletonText,
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
                const request={
                    type:'active',
                    user_id:this.$heap.state.user.user_id
                }
                this.promoList=await jQuery.post(`${this.$heap.state.hostname}Promo/listGet`,request)
            }catch{/** */}
        },
        promoPick(promo){
            modalController.dismiss(promo);
        }
    }
}
</script>