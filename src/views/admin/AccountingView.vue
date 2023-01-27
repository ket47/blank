<style scoped>
.deleted{
    border: 3px red solid;
}
</style>
<template>
    <base-layout pageDefaultBackLink="/user" page-title="Бухгалтерия">
        <ion-segment swipe-gesture="true" v-model="activeTab" @ionChange="listTypeChanged($event)">
            <ion-segment-button value="ledger">
                Проводки
            </ion-segment-button>
        </ion-segment>
        <div v-if="activeTab=='ledger'">
            <ion-card>
                <ion-card-header>
                    <ion-card-title>Выписка по счету</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-list>
                        <ion-item>
                            <ion-label>Счет</ion-label>
                            <ion-select v-model="ledgerAccount">
                                <ion-select-option value="profit">Прибыль</ion-select-option>
                                <ion-select-option value="supplier">Продавцы</ion-select-option>
                                <ion-select-option value="courier">Курьеры</ion-select-option>
                            </ion-select>
                        </ion-item>
                        <ion-item button detail>
                            <ion-icon slot="start" :src="addOutline"/>
                            <ion-label>Добавить проводку</ion-label>
                        </ion-item>
                        
                    </ion-list>
                </ion-card-content>
            </ion-card>


            <ledger-comp :account="ledgerAccount" :holder="ledgerHolder" :holderId="ledgerHolderId"/>
        </div>
    </base-layout>
</template>
<script>
import {
  IonSegmentButton,
  IonSegment,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
 }                          from '@ionic/vue';
 import {
    addOutline
 }                          from "ionicons/icons";
import jquery               from 'jquery'
import LedgerComp           from '@/components/LedgerComp.vue';


export default {
    components: {
        LedgerComp,
  IonSegmentButton,
  IonSegment,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
    },
    setup(){
        return {
            addOutline
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
    },
}
</script>