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
    <ion-list v-if="orderData">
        <ion-item lines="none">
            <ion-avatar slot="start">
                <ion-icon :icon="locationOutline" style="font-size:30px"/>
            </ion-avatar>
            <ion-label>
                <ion-text color="primary">Курьер, {{job?.courier_name}}</ion-text>
            </ion-label>            
        </ion-item>

        <ion-item v-if="courier_finish_distance_km" lines="none">
            <div class="center_chip">
                <ion-chip color="success">
                    <ion-text>{{courier_finish_distance_km}}</ion-text>
                </ion-chip>
                <ion-chip color="primary">
                    <ion-text>{{courier_finish_time_min.timeMin}}-{{courier_finish_time_min.timeMax}}мин</ion-text>
                </ion-chip>
            </div>      
        </ion-item>
        <ion-item v-if="job">
            <ion-avatar slot="start">
                <ion-icon :icon="flagOutline" style="font-size:30px;"/>
            </ion-avatar>
            <ion-text>
                <ion-label color="primary">Вы, {{$heap.state.user.user_name}}</ion-label>
            </ion-text>           
        </ion-item>
    </ion-list>
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
}                   from '@ionic/vue';
import {
    storefrontOutline,
    locationOutline,
    flagOutline
    }               from 'ionicons/icons';
import User         from '@/scripts/User.js';
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
            job:null
        };
    },
    mounted(){
        this.jobGet()
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
        }

    },
    methods:{
        async jobGet(){
            try{
                this.job=await Order.api.itemJobTrack(this.orderData.order_id);
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
        }
    }
})
</script>
