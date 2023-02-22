<template>
    <base-layout pageTitle="Статистика курьера" pageDefaultBackLink="/user">
        <ion-segment swipe-gesture="true" v-model="activeTab" @ionChange="activeTabChanged($event)">
            <ion-segment-button value="ledger" >
                Баланс
            </ion-segment-button>
        </ion-segment>
        <ledger-comp permanentTag="acc::courier" v-if="courier && activeTab=='ledger'"/>
    </base-layout>
</template>

<script>
import {
    IonSegment,
    IonSegmentButton,
}                       from '@ionic/vue';

import {
      receiptOutline
}                       from "ionicons/icons";

import ledgerComp       from "@/components/LedgerComp.vue";
import User             from "@/scripts/User"
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
            activeTab:'ledger',
            courier:null
        }
    },
    methods:{
        async itemGet(){
            this.courier=await User.courier.get()
        },
        async activeTabChanged(){
            //
        },
    },
    mounted(){
        this.itemGet()
    }
}
</script>