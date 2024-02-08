<style scoped>
.is_main{
    font-weight: bold;
    color:var(--ion-color-primary);
}
.card_type{
    width:48px;
    height: auto;
}

</style>


<template>
    <base-layout pageTitle="Мои способы оплаты">
        <ion-list>
            <ion-item-divider style="margin-top:0px;box-shadow:none;">
                <ion-label>Настройки</ion-label>
            </ion-item-divider>
            <ion-item lines="none">
                <ion-label>Сохранение карты при оплате заказа</ion-label>
            </ion-item>
            <ion-item lines="none">
                <ion-icon :src="cardOutline" slot="start"/>
                <ion-toggle v-model="enable_auto_cof" @ionChange="saveAutoCof()">
                    Автоматически сохранять
                </ion-toggle>
            </ion-item>
            <ion-item-divider>
                <ion-label>Сохраненные карты</ion-label>
            </ion-item-divider>
        </ion-list>
        <ion-list v-if="cardList==null">
            <ion-item v-for="i in [1,2]" :key="i">
                <ion-icon style="background-color:var(--ion-color-light)" slot="start"></ion-icon>
                <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
                <ion-icon style="background-color:var(--ion-color-light)" slot="end"></ion-icon>
            </ion-item>
        </ion-list>
        <ion-list v-else-if="cardList?.length>0">
            <ion-item v-for="(card,i) in cardList" :key="card.order_id" button detail-icon="" @click="i!=0&&itemMainSet(card.card_id)">
                <ion-img v-if="card.card_type" class="card_type" :src="`/img/icons/card-${card.card_type}.svg`" slot="start"/>
                <ion-icon v-else :src="cardOutline" slot="start" color="primary"/>
                <div v-if="i==0">
                    <h6 class="is_main">{{card.label}}</h6>
                    <ion-label>Основной способ</ion-label>
                </div>
                <ion-label v-else color="medium">{{card.label}}</ion-label>
                <ion-icon :icon="trashOutline" slot="end" @click.stop="itemDelete(card.card_id)"></ion-icon>
            </ion-item>
        </ion-list>
        <ion-list v-else lines="none">
            <ion-item>
                <ion-label color="medium">Сохраненных карт нет</ion-label>
            </ion-item>
        </ion-list>
        <ion-item lines="none" button detail-icon="">
            <ion-chip color="primary" @click="cardRegistrationOpen()">
                <ion-icon :icon="addOutline"></ion-icon>
                <ion-label>Добавить карту</ion-label>
            </ion-chip>
            <ion-chip color="medium" @click="cardRegistrationCheck()">
                <ion-icon :icon="refreshOutline"></ion-icon>
                <ion-label>обновить</ion-label>
            </ion-chip>
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
    IonToggle,
    IonChip,
    IonItemDivider,
}                               from '@ionic/vue';
import {
      cardOutline,
      addOutline,
      trashOutline,
      refreshOutline,
      saveOutline,
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
    IonToggle,
    IonChip,
    IonItemDivider,
    },
    setup(){
        return {
            cardOutline,
            addOutline,
            trashOutline,
            refreshOutline,
            saveOutline,
        }
    },
    data(){
        return {
            cardList:null,
            isOpen:false,
            enable_auto_cof:(localStorage.disable_auto_cof==1?0:1)
        }
    },
    methods:{
        async listGet(){
            try{
                let cards=await jQuery.post(this.$heap.state.hostname+'UserCards/listGet')
                if(cards && cards.length>0){
                    for(let i in cards){
                        cards[i].label=`${cards[i].card_type.toUpperCase()} - ${cards[i].card_mask.split('*').pop()}`
                    }
                }
                this.cardList=cards
            } catch{/** */}
        },
        async itemMainSet(card_id){
            const request={
                card_id
            };
            try{
                await jQuery.post(`${this.$heap.state.hostname}UserCards/itemMainSet`,request)
                this.$topic.publish('userMainPaymentMethodSet')
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
                this.$flash("Не удалось открепить карту")
            }
        },
        saveAutoCof(){
            localStorage.disable_auto_cof=this.enable_auto_cof?0:1
        },
        async cardRegistrationOpen() {
            const presEl=document.querySelector('ion-router-outlet');
            const order_data='card_registering';
            const self=this;
            const modal = await modalController.create({
                component: OrderPaymentCardModal,
                componentProps:{order_data},
                presentingElement:presEl,
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
                const result= await jQuery.post( this.$heap.state.hostname + "CardAcquirer/cardRegisteredSync" );
                if(result=='ok'){
                    //this.$flash("Карта успешно привязана");
                    this.listGet()
                    this.$topic.publish('userMainPaymentMethodSet')
                }
            } catch(err){
                //this.$flash("Не удалось привязать карту");
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