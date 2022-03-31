<style scoped>
    ion-icon{
        font-size:40px;
        color:var(--ion-color-medium);
    }
    .center_chip{
        text-align:center;
        width: 100%;
    }
</style>
<template>
    <ion-list>
        <ion-item lines="none">
            <ion-avatar slot="start">
                <ion-icon :icon="locationOutline" style="font-size:30px"/>
            </ion-avatar>
            <ion-label>
                <ion-text color="primary">Текущее место</ion-text>
            </ion-label>            
        </ion-item>

        <ion-item lines="none">
            <div class="center_chip">
                <ion-chip color="success">
                    <ion-text>{{order.distance_km}}</ion-text>
                </ion-chip>
            </div>      
        </ion-item>

        <ion-item lines="none">
            <ion-avatar slot="start">
                <ion-icon :icon="storefrontOutline" style="font-size:30px;"/>
            </ion-avatar>
            <ion-text color="primary">
                <ion-text>{{order.store_name}}</ion-text>
                <ion-note>{{order.location_address}}</ion-note>
            </ion-text>
        </ion-item>

        <ion-item v-if="start_finish_distance_km" lines="none">
            <div class="center_chip">
                <ion-chip color="success">
                    <ion-text>{{start_finish_distance_km}}</ion-text>
                </ion-chip>
            </div>      
        </ion-item>
        <ion-item v-else lines="none">
            <div class="center_chip">
                <ion-chip color="success">
                    <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
                </ion-chip>
            </div>      
        </ion-item>


        <ion-item v-if="job">
            <ion-avatar slot="start">
                <ion-icon :icon="flagOutline" style="font-size:30px;"/>
            </ion-avatar>
            <ion-label>
                <ion-text color="primary">Покупатель</ion-text>
                <p>{{job.finish_location_address}}</p>
            </ion-label>           
        </ion-item>
        <ion-item v-else>
            <ion-avatar slot="start">
                <ion-icon :icon="flagOutline" style="font-size:30px;"/>
            </ion-avatar>
            <ion-label>
                <ion-text color="primary">Покупатель</ion-text>
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
            </ion-label>           
        </ion-item>

        <ion-item v-if="job">
            <ion-button @click="deliveryStart()">Начать доставку</ion-button>       
        </ion-item>
    </ion-list>
</template>
<script>

import {storefrontOutline,locationOutline,flagOutline}      from 'ionicons/icons';
import User from '@/scripts/User.js';
import Order from '@/scripts/Order.js';
import router from '@/router';

export default({
    setup() {
        return { storefrontOutline,locationOutline,flagOutline }
    },
    props:{
        order:{}
    },
    data(){
        return {
            job:null
        };
    },
    mounted(){
        this.jobGet()
    },
    computed:{
        start_finish_distance_km(){
            return Math.round(this.job?.start_finish_distance/1000)+'км';
        }
    },
    methods:{
        async jobGet(){
            let job=await Order.api.itemJobGet(this.order.order_id);
            job.finish_location_address=job.finish_location_address.split(',').reverse().join(',');
            this.job=job;
        },
        async deliveryStart(){
            const courier_id=User.courier?.data?.courier_id;
            let result=await Order.api.itemJobStart(this.order.order_id,courier_id);
            if( result=='ok' ){
                router.push('order-'+this.order.order_id);
            }
        }
    }
})
</script>
