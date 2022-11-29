<template>
    <base-layout pageTitle="Статистика продавца" pageDefaultBackLink="/user">
        <ion-segment swipe-gesture="true" v-model="activeTab" @ionChange="activeTabChanged($event)">
            <ion-segment-button value="ledger" >
                Баланс
            </ion-segment-button>
        </ion-segment>
        <ledger-comp account="supplier" v-if="activeTab=='ledger'"/>
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
export default {
    components:{
    IonSegment,
    IonSegmentButton,
    ledgerComp,
    },
    setup(){
        return {
            receiptOutline,
        }
    },
    data(){
        return {
            activeTab:'ledger'
        }
    },
    methods:{
        async activeTabChanged(){
            //
        },
    },
}
</script>