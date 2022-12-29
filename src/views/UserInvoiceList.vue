<template>
    <base-layout pageTitle="Мои чеки" pageDefaultBackLink="/user">
        <ion-list v-if="invoiceList?.length>0">
            <ion-item v-for="invoice in invoiceList" :key="invoice.order_id" button @click="billOpen(invoice?.invoice_link)">
                <ion-icon :icon="receiptOutline" slot="start" color="primary"></ion-icon>
                <ion-grid>
                    <ion-col>
                        <ion-row>Фискальный чек от {{invoice?.invoice_date}}</ion-row>
                        <ion-row>
                            заказ №{{invoice?.order_id}} 
                        </ion-row>
                    </ion-col>
                </ion-grid>
                <ion-label slot="end">{{invoice?.order_sum_total}}{{$heap.state.currencySign}}</ion-label>
            </ion-item>
        </ion-list>

        <ion-list v-if="invoiceList?.length==0">
            <ion-item>
                <ion-label>Чеков нет</ion-label>
            </ion-item>
        </ion-list>

        <ion-list v-if="invoiceList==null">
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
    modalController,

}                   from '@ionic/vue';

import {
      receiptOutline
}                   from "ionicons/icons";
import InvoiceModal from "@/components/InvoiceModal.vue"

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
            invoiceList:null,
            isOpen:false,
            billLink:''
        }
    },
    methods:{
        async listGet(){
            try{
                const request={
                    has_invoice:'1',
                }
                this.invoiceList=await jQuery.post(this.$heap.state.hostname+'Order/listGet',request)
                //console.log(this.invoiceList)
            } catch{/** */}
        },
        async billOpen( billLink ) {
            if(!billLink){
                this.$flash("Невозможно открыть чек")
                return;
            }
            billLink=billLink.replace(/"/g,'');
            const modal = await modalController.create({
                component: InvoiceModal,
                componentProps:{billLink},
                initialBreakpoint: 0.85,
                breakpoints: [0, 0.85, 1]
                });
            const dismissFn=function(){
                modal.dismiss();
            };
            this.$topic.on('dismissModal',dismissFn);
            return modal.present();
        },

    },
    mounted(){
        this.listGet()
    }
}
</script>

<style>

</style>