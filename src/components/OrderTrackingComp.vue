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

<ion-accordion-group v-if="isDelivering()" value="tracking" color="primary">
    <ion-accordion value="tracking">
        <ion-item slot="header">
            <ion-label>Отслеживание заказа</ion-label>
        </ion-item>
        <ion-list slot="content">
            <ion-item lines="none">
                <ion-icon color="primary" slot="start" :icon="locationOutline" style="font-size:30px"/>
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
                <ion-label style="text-align:right">Клиент, {{$heap.state.user.user_name}}</ion-label>          
                <ion-icon color="primary" slot="end" :icon="flagOutline" style="font-size:30px;"/>
            </ion-item>
        </ion-list>
    </ion-accordion>
</ion-accordion-group>

</template>
<script>
import { 
    IonList,
    IonItemGroup,
    IonTitle,
    IonButton,
    IonSkeletonText,
    IonNote,
    IonChip,
    IonItem,
    IonLabel,
    IonText,
    IonAvatar,
    IonIcon,
    IonAccordionGroup,
    IonAccordion,
    IonProgressBar
}                   from '@ionic/vue';
import {
    storefrontOutline,
    locationOutline,
    flagOutline
    }               from 'ionicons/icons';
import Order        from '@/scripts/Order.js';
import Utils        from '@/scripts/Utils.js';


export default({
    props:['orderData'],
    components:{
    IonList,
    IonItemGroup,
    IonTitle,
    IonButton,
    IonSkeletonText,
    IonNote,
    IonChip,
    IonItem,
    IonLabel,
    IonText,
    IonAvatar,
    IonIcon,
    IonAccordionGroup,
    IonAccordion,
    IonProgressBar
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
        }
    },
    watch:{
        'orderData':function(){
            this.jobGet()
        }
    }
})
</script>
