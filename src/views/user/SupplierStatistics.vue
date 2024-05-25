<template>
    <base-layout pageTitle="Статистика продавца" pageDefaultBackLink="/user">
        <ion-segment swipe-gesture="true" v-model="activeTab">
            <ion-segment-button value="sellerAnalytics" >
                Аналитика
            </ion-segment-button>
            <ion-segment-button value="sellerReport" >
                Отчет
            </ion-segment-button>
            <ion-segment-button value="ledger" >
                Баланс
            </ion-segment-button>
        </ion-segment>
        <ledger-comp v-if="activeTab=='ledger'" permanentTag="acc::supplier"/>
        <statistics-seller-report v-if="activeTab=='sellerReport'" :store="store"/>
        <statistics-seller-analytics v-if="activeTab=='sellerAnalytics' && store" :store="store"/>
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
import 
    ledgerComp 
                    from "@/components/LedgerComp.vue";
import 
    StatisticsSellerReport 
                    from "@/components/StatisticsSellerReport.vue";
import 
    StatisticsSellerAnalytics
                    from "@/components/StatisticsSellerAnalytics.vue";

import jQuery       from "jquery";

export default {
    components:{
        IonSegment,
        IonSegmentButton,
        ledgerComp,
        StatisticsSellerReport,
        StatisticsSellerAnalytics
    },
    setup(){
        return {
            receiptOutline,
        }
    },
    data(){
        return {
            activeTab:'sellerAnalytics',
            storeId:this.$route.params.id,
            store:null,
        }
    },
    mounted(){
        this.storeGet(this.storeId)
    },
    methods:{
        async storeGet( store_id ){
            const request={
                store_id
            }
            this.store=await jQuery.post(`${this.$heap.state.hostname}Store/itemGet`,request)
        },
    },
}
</script>