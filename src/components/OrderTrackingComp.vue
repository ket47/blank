<style>
    .center_chip{
        text-align:center;
        width: 100%;
    }
    .placemarkBaloon{
        border-radius: 5px;
        background-color: #fffd;
        padding:3px;
        color:var(--ion-color-primary);
        font-family: Comfortaa;
        font-weight: bold;
        text-align: left;
    }
    .disabled{
        filter:grayscale(1)
    }
</style>
<template>

<ion-accordion-group v-if="has_delivery_found && !has_system_finish" value="tracking" color="primary">
    <ion-accordion value="tracking">
        <ion-item slot="header">
            <ion-thumbnail slot="start" v-if="orderData?.info?.courier_image_hash">
                <ion-img :src="`${$heap.state.hostname}image/get.php/${orderData?.info?.courier_image_hash}.200.200.webp`" style="border-radius:10px;background-color:var(--ion-color-primary-tint)"/>
            </ion-thumbnail>
            <ion-label>Курьер <b>{{orderData?.info?.courier_name}}</b></ion-label>
        </ion-item>
        <ion-item v-if="orderData.stage_current=='delivery_finish'" slot="content" lines="none">
            <p>Заказ доставлен за <ion-chip color="medium"><b style="color:var(--ion-color-primary)">⏱️ {{delivery_time}}</b></ion-chip>.<br/>
            <a :href="`tel:${orderData?.info?.courier_phone}`">{{orderData?.info?.courier_phone}}</a>
            </p>
        </ion-item>

        <ion-list v-if="!has_delivery_finish" slot="content">
            <ion-chip color="primary" v-if="orderData?.info?.courier_phone" slot="end">
                <ion-icon :src="callOutline"/>
                <a :href="`tel:${orderData?.info?.courier_phone}`">{{orderData?.info?.courier_phone}}</a>
            </ion-chip>

            <yandex-map 
            v-if="coords" 
                :coords="coords" 
                :zoom="16" 
                :settings="mapsettings"
                :controls="['fullscreenControl']"
                :detailed-controls='{"fullscreenControl":{"position":{"top":"80px","right":"10px"}}}' 
                :behaviors="[]"
                style="height:200px" 
                :class="mapclass"
            >
                <ymap-marker v-if="finishCoords" :coords="finishCoords" marker-id="3" :properties="finishProperties"/>
                <ymap-marker v-if="startCoords" :coords="startCoords" marker-id="2" :properties="startProperties"/>
                <ymap-marker :coords="coords" :icon="placemarkIcon" marker-id="1" :properties="placemarkProperties"/>
            </yandex-map>
        </ion-list>
    </ion-accordion>
</ion-accordion-group>

</template>
<script>
import { 
    IonList,
    IonChip,
    IonItem,
    IonLabel,
    IonAccordionGroup,
    IonAccordion,
    IonThumbnail,
    IonImg,
    IonIcon,
}                   from '@ionic/vue';
import {
    storefrontOutline,
    locationOutline,
    flagOutline,
    callOutline,
    }               from 'ionicons/icons';
import Utils        from '@/scripts/Utils.js';
import User         from '@/scripts/User.js';

import { yandexMap,ymapMarker,loadYmap }         from "vue-yandex-maps";


export default({
    props:['orderData'],
    components:{
    IonList,
    IonChip,
    IonItem,
    IonLabel,
    IonAccordionGroup,
    IonAccordion,
    IonThumbnail,
    IonImg,
    IonIcon,
    yandexMap,
    ymapMarker,
    },
    setup() {
        return { 
            storefrontOutline,
            locationOutline,
            flagOutline,
            callOutline,
            }
    },
    data(){
        return {
            job:null,
            refreshInterval:1000*60,
            clock:null,

            coords: null,
            mapclass:'',
            mapsettings:null,
            placemarkProperties:{},
            placemarkIcon:{
                layout:'default#imageWithContent',
                content: '',
                contentLayout: '<div class="placemarkBaloon" style="min-width:$[properties.width];">$[properties.iconContent]</div>',
                contentOffset: [45, 10],
                imageHref:`/img/tezkel-placemark.png`,
                imageSize:[50, 50],
                imageOffset:[-25, -50]
            },

            finishProperties:{
                preset: 'islands#glyphCircleIcon', 
                iconGlyph: 'home',
                iconGlyphColor: 'green',
                iconCaption:`финиш`
            },
            finishCoords:null,
            startProperties:{
                preset: 'islands#glyphCircleIcon', 
                iconGlyph: 'home',
                iconGlyphColor: 'blue',
                iconCaption:`старт`
            },
            startCoords:null,
        };

    },
    computed:{
        courier_finish_distance_km(){
            if(!this.job?.courier_finish_distance){
                return '-';
            }
            return (Math.round(this.job?.courier_finish_distance/100)/10)+'км';
        },
        courier_finish_time_min(){
            const dtime= Utils.deliveryTimeCalculate(this.job?.courier_finish_distance,0)
            if(!dtime.timeMax){
                return ''
            }
            return `${dtime.timeMin}-${dtime.timeMax}мин`
        },
        courier_progress(){
            return this.job?.courier_finish_distance/this.job?.start_finish_distance
        },
        delivery_time(){
            const start_stage=this.orderData?.stages.find(stage=>stage.group_type=='delivery_start')
            const finish_stage=this.orderData?.stages.find(stage=>stage.group_type=='delivery_finish')
            const diff=Date.parse(finish_stage.created_at.replace(' ','T'))-Date.parse(start_stage.created_at.replace(' ','T'))
            const time = new Date();
            time.setTime(diff)
            if(time.getUTCHours()>0){
                return `${time.getUTCHours()}ч ${time.getUTCMinutes()}мин ${time.getUTCSeconds()}с`
            }
            return `${time.getUTCMinutes()}мин ${time.getUTCSeconds()}с`
        },
        is_admin(){
            return User.isAdmin()
        },
        is_delivering(){
            return this.has_delivery_found && !this.has_delivery_finish
        },
        has_system_finish(){
            return this.orderData?.stages?.find(stage=>stage.group_type=='system_finish')
        },
        has_delivery_finish(){
            return this.orderData?.stages?.find(stage=>stage.group_type=='delivery_finish')
        },
        has_delivery_found(){
            return this.orderData?.stages?.find(stage=>stage.group_type=='delivery_found')
        }
    },
    methods:{
        async jobGet(){
            if( !this.is_delivering ){
                return
            }
            try{
                this.job=await Utils.post(`${this.$heap.state.hostname}Courier/itemJobTrack`, {order_id:this.orderData.order_id})//to use debounce
                this.placemarkProperties.iconContent=``
                this.placemarkProperties.width=`0px`
                const max_location_age=3*60//3min
                if(this.job?.location_latitude){
                    this.coords=[this.job.location_latitude,this.job.location_longitude]
                    if( this.orderData.stage_current=='delivery_start' ){
                        let label=`${this.courier_finish_distance_km} (${this.courier_finish_time_min})`
                        if(this.job?.courier_finish_distance<200){
                            label=`на месте`
                        }
                        this.placemarkProperties.width=`140px`
                        this.placemarkProperties.iconContent=label
                    }
                    this.mapclass=''
                }
                if(this.job?.location_age>max_location_age){
                    //this.coords=null//hide map
                    this.mapclass='disabled'
                }
                if(this.job?.start_location){
                    const loc=this.job.start_location
                    this.startCoords=[loc.location_latitude,loc.location_longitude]
                    if(this.orderData?.store?.store_name){
                        this.startProperties.iconCaption=`${this.orderData?.store?.store_name}`
                    }
                }
                if(this.job?.finish_location){
                    const loc=this.job.finish_location
                    this.finishCoords=[loc.location_latitude,loc.location_longitude]
                    if(this.orderData?.customer?.user_name){
                        this.finishProperties.iconCaption=`${this.orderData?.customer?.user_name}`
                    }
                }
                clearTimeout(this.clock)
                this.clock=setTimeout(()=>{this.jobGet()},this.refreshInterval)
            } catch(err){
                const message=err.responseJSON?.messages?.error;
                if(message=='notfound'){
                    this.$flash("Задание не найдено");
                    return
                }
                if(message=='notready'){
                    this.$flash("Смена курьера не открыта");
                    return
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
            await loadYmap();
        },
    },
    async mounted(){
        if( !this.is_delivering ){
            return
        }
        let settings=this.$heap.state.settings;
        if(settings?.location){
            this.ymapInit(settings.location)
        }
        this.$topic.on('settingsGet',async settings=>{
            this.ymapInit(settings.location)
        })
    },
    watch:{
        'orderData':function(){
            this.jobGet()
        }
    }
})
</script>
