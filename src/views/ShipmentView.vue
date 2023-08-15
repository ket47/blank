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


        <ion-grid>
            <ion-row>
                <ion-col>
                </ion-col>
            </ion-row>
        </ion-grid>

    </base-layout>
</template>
<script>
import {
    IonButton,
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
    IonButton,
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