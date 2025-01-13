<style scoped>
.deleted{
    border: 3px red solid;
}
</style>
<template>
    <base-layout pageDefaultBackLink="/user" page-title="Бухгалтерия">
        <ion-segment swipe-gesture="true" v-model="activeTab" @ionInput="listTypeChanged($event)">
            <ion-segment-button value="reports">
                Баланс
            </ion-segment-button>
            <ion-segment-button value="ledger">
                Проводки
            </ion-segment-button>
            <ion-segment-button value="sellerReport" >
                Отчет
            </ion-segment-button>
        </ion-segment>
        <div v-if="activeTab=='reports'">
            <ion-list>
                <ion-item button @click="reportSupplierBalanceExport()">
                    <ion-icon slot="start" :src="downloadOutline"/>
                    <ion-label>Скачать баланс продавцов</ion-label>
                </ion-item>
            </ion-list>
        </div>
        <div v-if="activeTab=='ledger'">
            <ion-list>
                <ion-item button @click="itemCreate()">
                    <ion-icon slot="start" :src="addOutline"/>
                    <ion-label>Добавить проводку</ion-label>
                </ion-item>
            </ion-list>
            <ledger-comp :account="ledgerAccount" ref="ledger"/>
        </div>
        <div v-if="activeTab=='sellerReport'">
            <ion-list>
                <ion-item v-if="pickedStore" button @click="storePick()" color="primary">
                    <ion-icon slot="start" :src="storefrontOutline"/>
                    <ion-label>{{pickedStore.store_name}}</ion-label>
                </ion-item>
                <ion-item v-else button @click="storePick()" color="warning">
                    <ion-icon slot="start" :src="storefrontOutline"/>
                    <ion-label>Выбрать продавца</ion-label>
                </ion-item>
            </ion-list>
            <statistics-seller-report :store="pickedStore" v-if="activeTab=='sellerReport'"/>
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
    modalController,
 }                          from '@ionic/vue';
 import {
    addOutline,
    refreshOutline,
    storefrontOutline,
    downloadOutline
 }                          from "ionicons/icons";
import LedgerComp           from '@/components/LedgerComp.vue';
import StatisticsSellerReport from "@/components/StatisticsSellerReport.vue";
import ItemPicker             from '@/components/ItemPicker.vue'
import jquery                 from "jquery";

export default {
    components: {
        LedgerComp,
        IonSegmentButton,
        IonSegment,
        IonList,
        IonItem,
        IonLabel,
        IonIcon,
    StatisticsSellerReport
    },
    setup(){
        return {
            addOutline,
            refreshOutline,
            storefrontOutline,
            downloadOutline
        }
    },
    data(){
        return{
            activeTab:'ledger',
            ledgerAccount:'supplier',
            pickedStore:null
        }
    },
    computed:{
    },
    methods:{
        itemCreate(){
            this.$go('/admin/transaction-edit-0')
        },
        async storePick(){
            const modal = await modalController.create({
                component: ItemPicker,
                componentProps:{itemType:'store'},
                initialBreakpoint: 0.75,
                breakpoints: [0.75, 1],
                canDissmiss:true,
            });
            modal.present()
            this.$topic.on('dismissModal',()=>{
                modal.dismiss()
            });
            const item=await modal.onDidDismiss();
            if(!item.data){
                return
            }
            this.pickedStore=item.data
        },
        async reportSupplierBalanceExport(){
            try {
                const request={
                    output:'xlsx'
                }
                const response= await jquery.post(`${this.$heap.state.hostname}Statistics/statSupplierBalanceReport`,request)
                const reportUrl=`${this.$heap.state.hostname}Statistics/download/${response}/supplierBalance.xlsx`
                const anchor = document.createElement('a')
                anchor.href =reportUrl
                anchor.download='download'
                anchor.click()
            } catch (err) {
                return false;
            }
        }
    },
    ionViewDidEnter(){
        this.$refs.ledger.listGet()
    }
}
</script>