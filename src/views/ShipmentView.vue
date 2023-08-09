<template>
    <base-layout pageTitle="Оформление" pageDefaultBackLink="/order/order-list">
        <ion-title class="ion-padding">Ваш заказ</ion-title>
        <ion-label class="ion-padding"><b>Курьер</b></ion-label>
        <ion-item detail="" lines="none">
            <ion-icon :src="boxDelivery" slot="start" color="medium" style="font-size:2em"/>
            <ion-text color="medium">Скажите нам, что нужно перевезти?</ion-text>
        </ion-item>
        <br/>
        <ion-title class="ion-padding">Детали перевозки</ion-title>

        <ion-item detail="" lines="none" :detailIcon="chevronDown">
            <ion-icon :src="locateOutline" slot="start" color="medium"/>
            <ion-text color="medium">Откуда?</ion-text>
        </ion-item>
        <ion-item detail="" lines="none" :detailIcon="chevronDown">
            <ion-icon :src="flagOutline" slot="start" color="medium"/>
            <ion-text color="medium">Куда?</ion-text>
        </ion-item>


    </base-layout>
</template>
<script>
// import {
//     IonButton
// }               from '@ionic/vue'
import {
    cubeOutline,
    locateOutline,
    flagOutline,
    chevronDown,
    addOutline,
}               from 'ionicons/icons';
import magic_wand from '@/assets/icons/magic_wand.svg';
import boxDelivery from '@/assets/icons/boxDelivery.svg';
import Utils    from '@/scripts/Utils'

export default {
    components:{
    },
    setup(){
        return {
            magic_wand,
            boxDelivery,
            locateOutline,
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
        }
    },
    mounted(){
        this.itemGet()
    },
    ionViewDidEnter(){
        this.itemGet()
    }

}
</script>