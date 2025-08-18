<template>
    <base-layout pageTitle="Статистика курьера" pageDefaultBackLink="/user">
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
            <ion-list>
                <div v-for="(tag,i) in statistics.rating" :key="i">
                    <ion-item v-if="tag.tag_option=='speed'">
                        <ion-icon :icon="rocket" slot="start"/>
                        <ion-label>Скорость доставки ( {{ tag.total_reactions }} )</ion-label>
                        <ion-label slot="end">{{ Number(tag.rating/0.2).toFixed(1) }}</ion-label>
                    </ion-item>
                    <ion-item v-if="tag.tag_option=='look'">
                        <ion-icon :icon="sparkles" slot="start"/>
                        <ion-label>Униформа ( {{ tag.total_reactions }} )</ion-label>
                        <ion-label slot="end">{{ Number(tag.rating/0.2).toFixed(1) }}</ion-label>
                    </ion-item>
                </div>
            </ion-list>

            <div v-if="statistics.comments?.length">
                <h3>Последние отзывы</h3>
                <ion-card  v-for="(tag,i) in statistics.comments" :key="i">
                    <ion-card-header>{{ tag.user_name }}</ion-card-header>
                    <ion-card-content>{{ tag.reaction_comment }}</ion-card-content>
                </ion-card>
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

        }
    },
    data(){
        return {
            activeTab:'statistics',
            courier:null,
            statistics:null,
        }
    },
    methods:{
        async itemGet(){
            this.courier=await User.courier.get()
        },
        async itemStatisticsGet(){
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