<style>
    ion-icon{
        font-size:40px;
        color:var(--ion-color-medium);
    }
    .center_chip{
        text-align:center;
        width: 100%;
    }
    .placemarkBaloon{
        min-width:150px;
        border-radius: 5px;
        border:var(--ion-color-primary) 1px solid;
        background-color: #fffd;
        padding:3px;
        color:var(--ion-color-primary);
        font-family: Comfortaa;
        font-weight: bold;
        text-align: left;
    }
</style>
<template>

<ion-accordion-group v-if="isDelivering()" value="tracking" color="primary">
    <ion-accordion value="tracking">
        <ion-item slot="header">
            <ion-label>Отслеживание заказа</ion-label>
        </ion-item>
        <ion-list slot="content">
            <ion-item lines="none">
                <ion-thumbnail v-if="job?.image_hash" slot="start">
                    <ion-img :src="`${$heap.state.hostname}image/get.php/${job.image_hash}.70.70.webp`" style="border-radius:100px;background-color:var(--ion-color-primary-tint)"/>
                </ion-thumbnail>
                <ion-label>Курьер, {{job?.courier_name}}</ion-label>      
            </ion-item>

            <ion-item v-if="courier_finish_distance_km" lines="none">
                <ion-chip slot="start" color="success">
                {{courier_finish_distance_km}}
                </ion-chip>
                <ion-chip slot="end" color="primary">
                {{courier_finish_time_min.timeMin}}-{{courier_finish_time_min.timeMax}}мин
                </ion-chip>   
            </ion-item>
            <ion-item v-if="courier_finish_distance_km" lines="none">
                <ion-progress-bar color="secondary" :value="courier_progress"  reversed="true"></ion-progress-bar>
            </ion-item>

            <ion-item lines="none">
                <ion-label style="text-align:right">Клиент, {{orderData.customer.user_name}}</ion-label>          
                <ion-icon color="primary" slot="end" :icon="flagOutline" style="font-size:30px;"/>
            </ion-item>
        </ion-list>
    </ion-accordion>
    <ion-accordion value="tracking" v-if="is_admin">
        <ion-item slot="header">
            <ion-label>Отслеживание заказа</ion-label>
        </ion-item>
        <ion-list slot="content">
            <ion-item v-if="courier_finish_distance_km" lines="none">
                <ion-label slot="start">Курьер, {{job?.courier_name}}</ion-label> 
                <ion-chip color="success">
                {{courier_finish_distance_km}}
                </ion-chip>
                <ion-chip slot="end" color="primary">
                {{courier_finish_time_min.timeMin}}-{{courier_finish_time_min.timeMax}}мин
                </ion-chip>   
            </ion-item>
            <yandex-map 
            v-if="coords" 
                :coords="coords" 
                :zoom="16" 
                :settings="mapsettings"
                :controls="['fullscreenControl']"
                style="height:200px" 
            >
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
    IonIcon,
    IonAccordionGroup,
    IonAccordion,
    IonProgressBar,
    IonThumbnail,
    IonImg,
}                   from '@ionic/vue';
import {
    storefrontOutline,
    locationOutline,
    flagOutline
    }               from 'ionicons/icons';
import Order        from '@/scripts/Order.js';
import Utils        from '@/scripts/Utils.js';
import User        from '@/scripts/User.js';

import { yandexMap,ymapMarker,loadYmap }         from "vue-yandex-maps";


export default({
    props:['orderData'],
    components:{
    IonList,
    IonChip,
    IonItem,
    IonLabel,
    IonIcon,
    IonAccordionGroup,
    IonAccordion,
    IonProgressBar,
    IonThumbnail,
    IonImg,
    yandexMap,
    ymapMarker,
    },
    setup() {
        return { 
            storefrontOutline,
            locationOutline,
            flagOutline 
            }
    },
    data(){
        return {
            job:null,
            refreshInterval:1000*60,
            clock:null,

            mapsettings:null,
            placemarkProperties:{},
            placemarkIcon:{
                layout:'default#imageWithContent',
                content: 'some content here',
                contentLayout: '<div class="placemarkBaloon">$[properties.iconContent]</div>',
                contentOffset: [45, 10],
                imageSize:[40, 40],
                imageOffset:[-20, -20]
            },
            coords: null,
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
            return Utils.deliveryTimeCalculate(this.job?.courier_finish_distance,0)
        },
        courier_progress(){
            return this.job?.courier_finish_distance/this.job?.start_finish_distance
        },
        is_admin(){
            return User.isAdmin()
        }
    },
    methods:{
        async jobGet(){
            if( !this.isDelivering() ){
                return
            }
            try{
                this.job=await Order.api.itemJobTrack(this.orderData.order_id);
                if(this.job.group_type=='delivery_start'){
                    clearTimeout(this.clock)
                    const self=this
                    this.clock=setTimeout(()=>{self.jobGet()},this.refreshInterval)
                }
                if(this.job?.location_latitude){
                    this.coords=[this.job.location_latitude,this.job.location_longitude]
                    this.placemarkProperties.iconContent='курьер '+this.job?.courier_name
                    this.placemarkIcon.imageHref=`${this.$heap.state.hostname}image/get.php/${this.job?.image_hash}.200.200.webp`
                }
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
        isDelivering(){
            if(this.orderData?.stage_current=='delivery_start'){
                return true
            }
            return false
        },
        async ymapInit(locSettings){
            this.mapsettings={
                apiKey: locSettings.ymapApiKey,
                lang: "ru_RU",
                coordorder: "latlong",
                version: "2.1",
            }
            //this.coords=JSON.parse(locSettings.mapCenter)
            await loadYmap();
            //this.ymapPlaceMarker()
        },
    },
    async mounted(){
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
