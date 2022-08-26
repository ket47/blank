<template>
    <base-layout pageTitle="Мои чеки">
        <ion-list v-if="invoiceList">
            <ion-item v-for="invoice in invoiceList" :key="invoice.trans_id" button>
                <ion-icon :icon="receiptOutline" slot="start" color="primary"></ion-icon>
                <a :href="invoice?.trans_data?.Registration?.Link" target="_system">
                    <ion-grid>
                        <ion-col>
                            <ion-row>Фискальный чек {{invoice?.trans_amount}}{{$heap.state.currencySign}}</ion-row>
                            <ion-row>
                                №{{invoice?.trans_data?.Registration?.FiscalData?.Document}} от {{invoice?.trans_data?.Registration?.FiscalData?.Date}}
                            </ion-row>
                        </ion-col>
                    </ion-grid>
                </a>
            </ion-item>
        </ion-list>
        <ion-list v-else>
            <ion-item v-for="i in [1,2,3]" :key="i">
                <ion-icon style="background-color:var(--ion-color-light)"></ion-icon>
                <ion-grid>
                    <ion-col>
                        <ion-row><ion-skeleton-text animated style="width: 100%"></ion-skeleton-text></ion-row>
                        <ion-row><ion-label color="primary"><ion-skeleton-text animated style="width: 100px"></ion-skeleton-text></ion-label></ion-row>
                    </ion-col>
                </ion-grid>
            </ion-item>
        </ion-list>
    </base-layout>
</template>

<script>
import {
    IonList,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonSkeletonText,
    IonLabel,
    IonIcon,
}                   from '@ionic/vue';

import {
      receiptOutline,
}                   from "ionicons/icons";

import jQuery from 'jquery'
export default {
    components:{
    IonList,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonSkeletonText,
    IonLabel,
    IonIcon,
    },
    setup(){
        return {
            receiptOutline,
        }
    },
    data(){
        return {
            invoiceList:null
        }
    },
    methods:{
        async listGet(){
            try{
                const request={
                    trans_tags:'#orderInvoice',
                }
                this.invoiceList=await jQuery.post(this.$heap.state.hostname+'Transaction/itemFind',request)
            } catch{/** */}
        }
    },
    mounted(){
        this.listGet()
    }
}
</script>

<style>

</style>