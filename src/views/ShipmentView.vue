<style scoped>
    ion-segment ion-segment-button{
        padding: 10px;
        color: var(--ion-color-medium)
    }
    ion-segment ion-segment-button ion-label{
        font-weight: bold;
        color: var(--ion-color-dark)
    }
</style>

<template>
    <base-layout pageTitle="Оформление" pageDefaultBackLink="/order/order-list">
        <ion-title class="ion-padding">Ваш заказ</ion-title>
        <ion-label class="ion-padding"><b>Курьер</b></ion-label>
        <ion-item detail="" lines="none">
            <ion-icon :src="cubeOutline" slot="start" size="large" color="medium" style="font-size:2em"/>
            <ion-text color="medium">Скажите нам, что нужно перевезти?</ion-text>
        </ion-item>
        <br/>
        <ion-title class="ion-padding">Детали перевозки</ion-title>

        <div style="border-radius:10px;margin:10px;overflow: hidden;">
        <yandex-map 
            v-if="placemarkCoords" 
            :coords="placemarkCoords" 
            :zoom="16" 
            :settings="mapsettings"
            :controls="['fullscreenControl']"
            :behaviors="[]"
            style="height:200px;" 
        >
            <ymap-marker :coords="placemarkCoords" :icon="placemarkIcon" marker-id="1" :properties="placemarkProperties"/>
        </yandex-map>
        </div>

        <ion-item detail="" lines="none" :detailIcon="chevronDown">
            <ion-icon :src="locationOutline" slot="start" color="medium"/>
            <ion-text color="medium">Откуда?</ion-text>
        </ion-item>
        <ion-item detail="" lines="none" :detailIcon="chevronDown">
            <ion-icon :src="flagOutline" slot="start" color="medium"/>
            <ion-text color="medium">Куда?</ion-text>
        </ion-item>

        <div style="padding:10px">
            <ion-segment mode="ios" value="atonce">
                <ion-segment-button value="atonce">
                    <ion-label>Как можно скорее</ion-label>
                    отвезти сразу
                </ion-segment-button>
                <ion-segment-button value="schedule" disabled>
                    <ion-label><b>Ко времени</b></ion-label>
                    выберите день и время
                </ion-segment-button>
            </ion-segment>
        </div>

        <ion-title class="ion-padding">Способы оплаты</ion-title>



        <ion-item button detail="false" @click="paymentType='use_cash'" v-if="tariffRule.paymentByCash==1">
            <ion-icon :icon="cashOutline" slot="start" color="primary"></ion-icon>
            <label for="payment_cash">Оплата наличными</label>
            <div slot="end">
                <input type="radio" name="paymentType" id="payment_cash" value="cash" :checked="paymentType == 'use_cash'">
            </div>
        </ion-item>
        <ion-item button detail="false" @click="paymentType='use_cash_store'" v-if="tariffRule.paymentByCashStore==1">
            <ion-icon :icon="cashOutline" slot="start" color="primary"></ion-icon>
            <label for="payment_cash_store">Оплата наличными продавцу</label>
            <div slot="end">
                <input type="radio" name="paymentType" id="payment_cash_store" value="cash" :checked="paymentType == 'use_cash_store'">
            </div>
        </ion-item>



        <div v-if="tariffRule.paymentByCard==1">
            <ion-item detail="false" button @click="paymentType='use_card'">
                <ion-icon :icon="cardOutline" slot="start" color="primary"></ion-icon>
                <label for="payment_card">Оплата картой без привязки</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="payment_card" value="card"  :checked="paymentType == 'use_card'">
                </div>
            </ion-item>
            <ion-item v-if="bankCard?.card_type" button detail="false" @click="paymentType='use_card_recurrent'">
                <ion-img v-if="bankCard.card_type=='mir'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                <ion-img v-else-if="bankCard.card_type=='visa'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                <ion-img v-else-if="bankCard.card_type=='mastercard'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                <ion-icon v-else :src="cardOutline" slot="start" color="primary"/>
                
                <label for="use_card_recurrent">Оплата картой {{bankCard?.card_mask}}</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="use_card_recurrent" value="registered_card"  :checked="paymentType == 'use_card_recurrent'">
                </div>
            </ion-item>
            <ion-item v-if="recurrentPaymentAllow" button detail @click="$go('/user/user-cards')">
                <ion-label v-if="bankCard?.card_type" color="medium">Выбрать другую карту</ion-label>
                <ion-label v-else color="medium">Привязать карту</ion-label>
            </ion-item>
        </div>

    </base-layout>
</template>
<script>
import {
    IonText,
    IonItem,
    IonIcon,
    IonLabel,
    IonTitle,
}                   from '@ionic/vue'
import {
    cubeOutline,
    locateOutline,
    locationOutline,
    flagOutline,
    chevronDown,
    addOutline,
}                   from 'ionicons/icons';
import {
    yandexMap,
    ymapMarker,
    loadYmap 
}                   from "vue-yandex-maps";
import magic_wand   from '@/assets/icons/magic_wand.svg';
import boxDelivery  from '@/assets/icons/boxDelivery.svg';
import Utils        from '@/scripts/Utils'

export default {
    components:{
    yandexMap,
    ymapMarker,
    IonText,
    IonItem,
    IonIcon,
    IonLabel,
    IonTitle,
    },
    setup(){
        return {
            magic_wand,
            boxDelivery,
            cubeOutline,
            locationOutline,
            flagOutline,
            chevronDown,
        };
    },
    header(){
        return {
            title:'Hahaha'
        }
    },
    data(){
        return {
            ship_id:this.$route.params.id,
            ship:null,
            shipAutoloadClock:null,

            paymentType:'use_card',
            bankCard:null,
            recurrentPaymentAllow:this.$heap.state.settings?.other?.recurrentPaymentAllow==1?1:0,
            tariffRule:{},
            tariffRuleList:[],


            mapsettings:null,
            placemarkCoords: null,
            placemarkProperties:{},
            placemarkIcon:{
                layout:'default#imageWithContent',
                content: 'some content here',
                contentLayout: '<div class="placemarkBaloon">$[properties.iconContent]</div>',
                contentOffset: [45, 10],
                imageHref:`/img/tezkel-placemark.png`,
                imageSize:[50, 50],
                imageOffset:[-25, -50]
            },

        }
    },
    methods:{
        async itemGet(){
            const request={
                ship_id:this.ship_id
            }
            try{
                this.ship=await Utils.prePost(`${this.$heap.state.hostname}Shipment/itemGet`,request)
                this.ship=await Utils.post(`${this.$heap.state.hostname}Shipment/itemGet`,request)
            } catch(err){
                switch(err.status){
                    case 404:
                        this.$flash("Заказ не найден");
                        this.ship='notfound';
                        this.$go('/order/order-list');
                        break;
                }
            }
        },
        async itemCheckoutDataGet(){
            if( !this.ship ){
                await this.itemLoad()
            }
        },
        async ymapInit(locSettings){
            this.mapsettings={
                apiKey: locSettings.ymapApiKey,
                lang: "ru_RU",
                coordorder: "latlong",
                version: "2.1",
            }
            this.placemarkCoords=JSON.parse(locSettings.mapCenter)
            await loadYmap();
        },
    },
    mounted(){
        this.itemGet()
        let settings=this.$heap.state.settings;
        if(settings?.location){
            this.ymapInit(settings.location)
        }
        this.$topic.on('settingsGet',async settings=>{
            this.ymapInit(settings.location)
        })
    },
    ionViewDidEnter(){
        this.itemGet()
    }

}
</script>