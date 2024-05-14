<template>
    <base-layout pageTitle="Статистика продавца" pageDefaultBackLink="/user">
        <ion-segment swipe-gesture="true" v-model="activeTab" @ionChange="activeTabChanged($event)">
            <ion-segment-button value="ledger" >
                Баланс
            </ion-segment-button>
            <ion-segment-button value="sellerReport" >
                Отчет
            </ion-segment-button>
        </ion-segment>
        <ledger-comp permanentTag="acc::supplier" v-if="activeTab=='ledger'"/>
        <statistics-seller-report v-if="activeTab=='sellerReport'"/>
    </base-layout>
</template>

<script>
import {
    IonSegment,
    IonSegmentButton,
}                   from '@ionic/vue';

import {
      receiptOutline
}                   from "ionicons/icons";

import ledgerComp from "@/components/LedgerComp.vue";
import StatisticsSellerReport from "@/components/StatisticsSellerReport.vue";
export default {
    components:{
    IonSegment,
    IonSegmentButton,
    ledgerComp,
    StatisticsSellerReport
    },
    setup(){
        return {
            receiptOutline,
        }
    },
    data(){
        return {
            activeTab:'sellerReport'
        }
    },
    methods:{
        async activeTabChanged(){
            //
        },
    },
}
</script>