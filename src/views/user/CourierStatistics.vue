<template>
    <base-layout :pageTitle="`Статистика курьера ${courier?.courier_name}`" pageDefaultBackLink="/user">
        <ion-segment swipe-gesture="true" v-model="activeTab" @ionChange="activeTabChanged($event.target.value)">
            <ion-segment-button value="statistics" >
                Рейтинг
            </ion-segment-button>
            <ion-segment-button value="ledger" >
                Баланс
            </ion-segment-button>
        </ion-segment>
        <div v-if="statistics && activeTab=='statistics'" class="ion-padding">
            <h3>Оценки клиентов</h3>
            <ion-list v-if="statistics.rating.length>0">
                <div v-for="(tag,i) in statistics.rating" :key="i">
                    <ion-item v-if="tag.tag_option=='speed'">
                        <ion-icon :icon="rocket" slot="start"/>
                        <ion-label>Быстрота ( {{ tag.total_reactions }} )</ion-label>
                        <ion-label slot="end">{{ Number(tag.rating/0.2).toFixed(1) }}</ion-label>
                    </ion-item>
                    <ion-item v-if="tag.tag_option=='appearence'">
                        <ion-icon :icon="sparkles" slot="start"/>
                        <ion-label>Униформа ( {{ tag.total_reactions }} )</ion-label>
                        <ion-label slot="end">{{ Number(tag.rating/0.2).toFixed(1) }}</ion-label>
                    </ion-item>
                </div>
                <ion-item v-if="$heap.state.courier?.ratingScore>0">
                    <ion-label>Общий показатель</ion-label>
                    <ion-label slot="end">{{ Math.round($heap.state.courier.ratingScore*100) }}%</ion-label>
                </ion-item>
            </ion-list>
            <div v-else style="color:#999">
                Пока оценок нет
            </div>

            <div v-if="statistics.comments?.length">
                <h3>Последние отзывы</h3>
                <ion-item  v-for="(tag,i) in statistics.comments" :key="i">
                    <ion-icon slot="end" color="medium" v-if="tag.reaction_is_like==1" :icon="thumbsUpSharp"/>
                    <ion-icon slot="end" color="medium" v-else :icon="thumbsDownSharp"/>
                    {{ tag.user_name }}: {{ tag.reaction_comment }}
                </ion-item>
            </div>
        </div>
        <ledger-comp v-else-if="courier && activeTab=='ledger'" permanentTag="acc::courier"/>
    </base-layout>
</template>

<script>
import {
    IonSegment,
    IonSegmentButton,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardContent,
}                       from '@ionic/vue';

import {
    star,
    sparkles,
    rocket,
    text,
    thumbsDownSharp,
    thumbsUpSharp,
}                       from "ionicons/icons";

import ledgerComp       from "@/components/LedgerComp.vue";
import User             from "@/scripts/User"
export default {
    components:{
        ledgerComp,
        IonSegment,
        IonSegmentButton,
        IonList,
        IonItem,
        IonIcon,
        IonLabel,
        IonCard,
        IonCardHeader,
        IonCardContent,
    },
    setup(){
        return {
            star,
            sparkles,
            rocket,
            text,
            thumbsDownSharp,
            thumbsUpSharp,
        }
    },
    data(){
        return {
            other_courier_id:this.$route?.query?.courier_id,
            activeTab:'statistics',
            courier:null,
            statistics:null,
        }
    },
    methods:{
        async itemGet(){
            if(this.other_courier_id>0){
                try{
                this.courier=await this.$post( this.$heap.state.hostname + "Courier/itemGet",{courier_id:this.other_courier_id})
                } catch( err ){
                this.$flash("Не удалось загрузить анкету")
                }
            } else {
                this.courier=await User.courier.get()
            }
        },
        async itemStatisticsGet(){
            if( !this.courier ){
                await this.itemGet()
            }
            this.statistics=await this.$post('Courier/itemStatisticsGet',{courier_id:this.courier.courier_id})
        },
        async activeTabChanged( type ){
            if( type=='statistics' ){
                await this.itemStatisticsGet()
            }
        },
    },
    async mounted(){
        await this.itemGet()
        await this.itemStatisticsGet()
    }
}
</script>