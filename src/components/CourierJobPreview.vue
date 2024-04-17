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
  <ion-header>
      <ion-toolbar>
        <ion-title>Просмотр задания</ion-title>
        <ion-icon slot="end" @click="close();" :icon="closeOutline" size="large"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list v-if="orderData">
        <ion-item lines="none">
            <ion-avatar slot="start">
                <ion-icon :icon="locationOutline" style="font-size:30px"/>
            </ion-avatar>
            <ion-label>
                <ion-text color="primary">Курьер {{$heap.state.user.user_name}}</ion-text>
            </ion-label>            
        </ion-item>

        <ion-item lines="none">
            <div class="center_chip">
                <ion-chip color="success">
                    <ion-text>{{orderData?.distance_km}}</ion-text>
                </ion-chip>
            </div>      
        </ion-item>

        <ion-item lines="none">
            <ion-avatar slot="start">
                <ion-icon :icon="storefrontOutline" style="font-size:30px;"/>
            </ion-avatar>
            <ion-text>
                <ion-label color="primary">{{orderData.store_name}}</ion-label>
                <ion-note>{{orderData.location_address}}</ion-note>
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
            <ion-text>
                <ion-label color="primary">Покупатель</ion-label>
                <ion-note>{{job.finish_location?.location_address}}{{job.finish_location?.location_comment}}</ion-note>
            </ion-text>           
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

        <ion-item-group v-if="job">
            <ion-button @click="deliveryStart()" expand="block">Взять задание</ion-button>
        </ion-item-group>
    </ion-list>
  </ion-content>
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
    IonHeader,
    IonToolbar,
    IonContent
}                   from '@ionic/vue';
import {
    storefrontOutline,
    locationOutline,
    flagOutline,
    closeOutline
    }               from 'ionicons/icons';
import User         from '@/scripts/User.js';
import Order        from '@/scripts/Order.js';
import Topic        from '@/scripts/Topic.js';


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
    IonHeader,
    IonToolbar,
    IonContent
    },
    setup() {
        return { 
            storefrontOutline,
            locationOutline,
            flagOutline ,
            closeOutline
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
        start_finish_distance_km(){
            if(!this.job?.start_finish_distance){
                return '-';
            }
            return Math.round(this.job?.start_finish_distance/1000)+'км';
        }
    },
    methods:{
        async jobGet(){
            try{
                let job=await Order.api.itemJobGet(this.orderData.order_id);
                job.finish_location_address=job.finish_location_address.split(',').reverse().join(',');
                this.job=job;
            } catch(err){
                const message=err.responseJSON?.messages?.error;
                if(message=='notfound'){
                    this.$flash("Задание не найдено");
                    return
                }
                if(message=='notready'){
                    this.$flash("Вы заняты или не открыли смену");
                    return
                }
            }
        },
        async deliveryStart(){
            const courier_id=User.courier?.data?.courier_id;
            try{
                await Order.api.itemJobStart(this.orderData.order_id,courier_id);
                if(this.job.is_shipment==1){
                    this.$go('/order/shipment-'+this.orderData.order_id);
                } else {
                    this.$go('/order/order-'+this.orderData.order_id);
                }
            } catch(err){
                const message=err.responseJSON?.messages?.error;
                if(message=='notfound'){
                    this.$flash("Задание не найдено");
                }
                if(message=='notready'){
                    this.$flash("Смена курьера не открыта");
                }
                if(message=='notsearching' || message=='idle'){
                    this.$flash("Заданию уже назначен курьер");
                }
            }
            Topic.publish('dismissModal');
        },
        close(){
            Topic.publish('dismissModal');
        }
    }
})
</script>
