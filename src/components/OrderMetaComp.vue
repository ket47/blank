<template>
    <ion-accordion-group>
        <ion-accordion >
            <ion-item slot="header" @click="itemMetaGet()">
                <ion-label>Дополнительно</ion-label>
            </ion-item>
            <div slot="content" class="ion-padding">
                <ion-chip v-if="meta.payment_card_fixate_sum>0">
                    <ion-icon :src="cardOutline"/>
                    <ion-text>Предоплата {{meta.payment_card_fixate_sum}}{{$heap.state.currencySign}}</ion-text>
                </ion-chip>
                <ion-chip v-if="meta.payment_card_refund_sum>0">
                    <ion-icon :src="cardOutline"/> 
                    <ion-text>Сдача {{meta.payment_card_refund_sum}}{{$heap.state.currencySign}}</ion-text>
                </ion-chip>
                <ion-chip v-if="meta.payment_card_confirm_sum>0">
                    <ion-icon :src="cardOutline"/>
                    <ion-text>Оплачено {{meta.payment_card_confirm_sum}}{{$heap.state.currencySign}}</ion-text>
                </ion-chip>
                <ion-chip v-if="meta.delivery_by_courier||meta.delivery_by_store||meta.pickup_by_customer ">
                    <ion-icon :src="rocketOutline"/>
                    <ion-text>
                    <span v-if="meta.delivery_by_courier">Курьер</span>
                    <span v-if="meta.delivery_by_store">Продавец</span>
                    <span v-if="meta.pickup_by_customer">Самовывоз</span>
                    </ion-text>
                </ion-chip>

                <ion-chip v-if="meta.bonus_gain" color="success">
                    <ion-icon :src="giftOutline"/>
                    <ion-text>Начислен бонус {{ meta.bonus_gain }}{{$heap.state.currencySign}}</ion-text>
                </ion-chip>
                <ion-chip v-if="meta.bonus_spend">
                    <ion-icon :src="giftOutline"/>
                    <ion-text>Использован бонус {{ meta.bonus_spend }}{{$heap.state.currencySign}}</ion-text>
                </ion-chip>
                <ion-button v-if="meta.invoice_link" color="light" @click="billOpen(meta.invoice_link)" expand="block">
                    <ion-icon :src="receiptOutline" slot="start"/>
                    <ion-text>Открыть чек на {{meta.invoice_sum}}{{$heap.state.currencySign}}</ion-text>
                </ion-button>
                <ion-list v-if="ledgerCalc.length>0">
                    <ion-item v-for="trans in ledgerCalc" :key="trans.trans_id">
                        <ion-text>{{trans.trans_description}}</ion-text>
                        <ion-text slot="end" :color="trans.trans_amount>0?'normal':'danger'">{{trans.trans_amount}}</ion-text>
                    </ion-item>
                </ion-list>
            </div>
        </ion-accordion>
    </ion-accordion-group>
</template>

<script>
import {
    IonIcon,
    IonText,
    IonLabel,
    IonButton,
    IonItem,
    IonList,
    IonAccordion,
    IonAccordionGroup,
    IonChip,
    modalController,
}                       from '@ionic/vue';
import { 
    cardOutline, 
    rocketOutline,
    receiptOutline,
    giftOutline
}                       from 'ionicons/icons';
import InvoiceModal from "@/components/InvoiceModal.vue"
import jQuery       from "jquery";

export default({
    props:['orderId'],
    components: {
    IonIcon,
    IonText,
    IonLabel,
    IonButton,
    IonItem,
    IonList,
    IonAccordion,
    IonAccordionGroup,
    IonChip,
    },
    setup() {
        return {
            cardOutline,
            rocketOutline,
            receiptOutline,
            giftOutline
         };
    },
    data(){
        return {
            meta:{}
        }
    },
    computed:{
        ledgerCalc(){
            if( !this.meta.transactions ){
                return [];
            }
            let lcalc=[];
            for(let trans of this.meta.transactions){
                trans.date=this.toLocDate(trans.trans_date)
                lcalc.push(trans)
            }
            return lcalc
        }
    },
    methods:{
        async itemMetaGet(){
            try{
                this.meta=await jQuery.post(`${this.$heap.state.hostname}Order/itemMetaGet`,{order_id:this.orderId})
            }
            catch(err){
                const exception_code=err?.responseJSON?.messages?.error;
                switch(exception_code){
                    case 'forbidden':
                    case 'notfound':
                    default:
                        this.meta={}
                }
                return false
            }
        },
        toLocDate( iso ){
            const event = new Date(Date.parse(iso));
            const options = { month: 'short', day: 'numeric' };

            return event.toLocaleDateString(undefined, options);
        },
        async billOpen( billLink ) {
            if(!billLink){
                this.$flash("Невозможно открыть чек")
                return;
            }
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

    }
})
</script>
