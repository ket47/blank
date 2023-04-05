<style scoped>
.deleted{
    border: 3px red solid;
}
</style>
<template>
    <base-layout pageDefaultBackLink="/user" page-title="Бухгалтерия">
        <ion-segment swipe-gesture="true" v-model="activeTab" @ionInput="listTypeChanged($event)">
            <ion-segment-button value="ledger">
                Проводки
            </ion-segment-button>
        </ion-segment>
        <div v-if="activeTab=='ledger'">
            <ion-list>
                <ion-item button @click="this.$refs.ledger.listGet()">
                    <ion-icon slot="start" :src="refreshOutline"/>
                    <ion-label>Обновить</ion-label>
                </ion-item>
                <ion-item button @click="itemCreate()">
                    <ion-icon slot="start" :src="addOutline"/>
                    <ion-label>Добавить проводку</ion-label>
                </ion-item>
            </ion-list>
            <ledger-comp :account="ledgerAccount" ref="ledger"/>
        </div>
    </base-layout>
</template>
<script>
import {
  IonSegmentButton,
  IonSegment,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
 }                          from '@ionic/vue';
 import {
    addOutline,
    refreshOutline,
 }                          from "ionicons/icons";
import jquery               from 'jquery'
import LedgerComp           from '@/components/LedgerComp.vue';


export default {
    components: {
        LedgerComp,
        IonSegmentButton,
        IonSegment,
        IonList,
        IonItem,
        IonLabel,
        IonIcon,
    },
    setup(){
        return {
            addOutline,
            refreshOutline,
        }
    },
    data(){
        return{
            activeTab:'ledger',
            ledgerAccount:'supplier',
            ledgerHolder:null,
            ledgerHolderId:null,
        }
    },
    computed:{
    },
    methods:{
        itemCreate(){
            this.$go('/admin/transaction-edit-0')
        }
    },
    ionViewDidEnter(){
        this.$refs.ledger.listGet()
    }
}
</script>