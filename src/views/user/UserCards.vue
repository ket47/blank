<style scoped>
.is_main{
    font-weight: bold;
    color:var(--ion-color-primary)
}
.card_type{
    width:48px;
    height: auto;
}

</style>


<template>
    <base-layout pageTitle="Мои банковские карты" pageDefaultBackLink="/user">
        <ion-list v-if="cardList==null">
            <ion-item v-for="i in [1]" :key="i">
                <ion-icon style="background-color:var(--ion-color-light)" slot="start"></ion-icon>
                <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
                <ion-icon style="background-color:var(--ion-color-light)" slot="end"></ion-icon>
            </ion-item>
        </ion-list>
        <ion-list v-else-if="cardList?.length>0">
            <ion-item v-for="(card,i) in cardList" :key="card.order_id" button>
                <ion-img v-if="card.card_type=='mir'" class="card_type" :src="`/img/icons/card-${card.card_type}.svg`" slot="start"/>
                <ion-img v-else-if="card.card_type=='visa'" class="card_type" :src="`/img/icons/card-${card.card_type}.svg`" slot="start"/>
                <ion-img v-else-if="card.card_type=='mastercard'" class="card_type" :src="`/img/icons/card-${card.card_type}.svg`" slot="start"/>
                <ion-icon v-else :src="cardOutline" slot="start" color="primary"/>
                <ion-label @click="i!=0&&itemMainSet(card.card_id)" :class="i==0?'is_main':''">{{card.card_mask}}</ion-label>
                <ion-icon :icon="trashOutline" slot="end" @click="itemDelete(card.card_id)"></ion-icon>
            </ion-item>
        </ion-list>
        <ion-list v-else>
            <ion-item>
                <ion-label color="medium">Привязанных карт нет</ion-label>
            </ion-item>
        </ion-list>
        <ion-item button @click="cardRegistrationOpen()">
            <ion-icon :icon="addOutline" slot="start"></ion-icon>
            Добавить новую карту
        </ion-item>
    </base-layout>
</template>

<script>
import {
    IonList,
    IonItem,
    IonSkeletonText,
    IonLabel,
    IonIcon,
    modalController,
    IonImg,
}                               from '@ionic/vue';
import {
      cardOutline,
      addOutline,
      trashOutline,
}                               from "ionicons/icons";
import OrderPaymentCardModal    from '@/components/OrderPaymentCardModal.vue';
import Topic                    from '@/scripts/Topic.js';

import jQuery from 'jquery'
export default {
    components:{
    IonList,
    IonItem,
    IonSkeletonText,
    IonLabel,
    IonIcon,
    IonImg,

    },
    setup(){
        return {
            cardOutline,
            addOutline,
            trashOutline,
        }
    },
    data(){
        return {
            cardList:null,
            isOpen:false,
            billLink:''
        }
    },
    methods:{
        async listGet(){
            try{
                this.cardList=await jQuery.post(this.$heap.state.hostname+'UserCards/listGet')
            } catch{/** */}
        },
        async itemMainSet(card_id){
            const request={
                card_id
            };
            try{
                await jQuery.post(`${this.$heap.state.hostname}UserCards/itemMainSet`,request)
                this.listGet()
            } catch{/** */}
        },
        async itemDelete(card_id){
            if(!confirm("Вы уверенны?")){
                return
            }
            const request={
                card_id
            };
            try{
                await jQuery.post(`${this.$heap.state.hostname}UserCards/itemDelete`,request)
                this.listGet()
            } catch{
                this.flash("Не удалось открепить карту")
            }
        },
        async cardRegistrationOpen() {
            const order_data='card_registering';
            const self=this;
            const modal = await modalController.create({
                component: OrderPaymentCardModal,
                componentProps:{order_data},
                initialBreakpoint: 0.85,
                breakpoints: [0, 0.85, 0.95]
                });
            const dismissFn=function(){
                modal.dismiss();
            };
            Topic.on('dismissModal',dismissFn);

            modal.onDidDismiss().then(()=>{
                self.cardRegistrationCheck();
            })
            return modal.present();
        },
        async cardRegistrationCheck(){
            try{
                const result= await jQuery.post( this.$heap.state.hostname + "CardAcquirer/cardRegisterActivate" );
                if(result=='ok'){
                    this.$flash("Карта успешно привязана");
                    this.listGet()
                }
            } catch(err){
                this.$flash("Не удалось привязать карту");
            }
        },
    },
    mounted(){
        this.listGet()
    }
}
</script>

<style>

</style>