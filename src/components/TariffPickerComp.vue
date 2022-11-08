<template>
  <ion-header>
      <ion-toolbar color="secondary">
          <ion-title>Ваши доступные тарифы</ion-title>
          <ion-icon :icon="closeOutline" @click="$topic.publish('dismissModal')" slot="end" size="large"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list v-if="tariffList==null">
        <ion-item lines="none" v-for="skeleton in [1,2,3]" :key="skeleton">
            <ion-icon slot="start" :icon="giftOutline" color="primary"/>
            <ion-skeleton-text style="width:70%"></ion-skeleton-text>
            <ion-skeleton-text slot="end" style="width:50px"></ion-skeleton-text>
        </ion-item>
    </ion-list>

    <ion-list>
        <ion-item v-if="!tariffList?.length" button>
            <ion-icon slot="start" :icon="briefcaseOutline" color="medium"/>
            <ion-text color="medium">К сожалению, тарифов нет.</ion-text>
        </ion-item>

        <ion-item v-for="tariff in tariffList" :key="tariff.tariff_id" button @click="tariffPick(tariff)">
            <ion-icon slot="start" :icon="briefcaseOutline" color="primary"/>
            <ion-text>{{tariff.tariff_name}}</ion-text>
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
    briefcaseOutline,
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
        briefcaseOutline,
        closeOutline,
        banOutline,
        }
    },
    data(){
        return {
            tariffList:null
        }
    },
    mounted(){
        this.listGet()
    },
    methods:{
        async listGet(){
            try{
                const request={
                    store_id:this.$heap.state.currentStore.store_id
                }
                this.tariffList=await jQuery.post(`${this.$heap.state.hostname}Tariff/listGet`,request)
            }catch{/** */}
        },
        tariffPick(tariff){
            modalController.dismiss(tariff);
        }
    }
}
</script>