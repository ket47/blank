<template>
  <base-layout pageDefaultBackLink="/" page-title="Заказы">
        <ion-segment swipe-gesture="true" v-model="orderType" @ionChange="listTypeChanged($event)">
            <ion-segment-button value="jobs" v-if="courierJobsInclude">
                Задания
            </ion-segment-button>
            <ion-segment-button value="active">
                Активные
            </ion-segment-button>
            <ion-segment-button value="done">
                Исполненые
            </ion-segment-button>
        </ion-segment>
        <ion-list v-if="orderList">
            <div v-for="order in orderListComputed" :key="order.order_id" @click="itemClick(order)">
                <ion-item lines="none">
                    <ion-text slot="start">#{{order.order_id}}</ion-text>
                    <ion-label>{{order.store_name}}</ion-label>
                    <ion-text slot="end">{{order.date}}</ion-text>
                </ion-item>
                <ion-item lines="full">
                    <ion-icon slot="start" :icon="order.icon" color="primary"/>
                    <ion-text>
                        <ion-label>
                            <ion-chip color="medium">{{order.order_sum_total}}{{$heap.state.currencySign}}</ion-chip>
                            <ion-chip color="primary" v-if="order.stage_current_name">
                                <ion-icon :icon="checkmarkOutline"></ion-icon>
                                <ion-label color="dark">{{order.stage_current_name}}</ion-label>
                            </ion-chip>
                        </ion-label>
                    </ion-text>
                    <ion-avatar slot="end" v-if="order.image_hash">
                        <ion-img style="border-radius:10px;" :src="`${$heap.state.hostname}image/get.php/${order.image_hash}.150.150.webp`"/>
                    </ion-avatar>
                </ion-item>
            </div>
        </ion-list>
        <ion-list v-if="jobList">
            <div v-for="order in jobListComputed" :key="order.order_id" @click="itemClick(order)">

            <ion-item lines="none">
                <ion-label>{{order.store_name}}</ion-label>
                <ion-text slot="end">{{order.date_time}}</ion-text>
            </ion-item>
            <ion-item lines="full">
                <ion-icon slot="start" :icon="rocketOutline" color="primary"/>
                <ion-text>
                    <ion-label>
                        <ion-chip color="medium">{{order.order_sum_total}}{{$heap.state.currencySign}}</ion-chip>
                        <ion-chip color="primary" v-if="order.distance_km">{{order.distance_km}}</ion-chip>
                    </ion-label>
                    <ion-note>{{order.location_address}}</ion-note>
                </ion-text>
            </ion-item>
            </div>
        </ion-list>
        <div v-if="(!orderList || orderList.length==0) && (!jobList || jobList.length==0)" style="display:flex;align-items:center;justify-content:center;height:70%">
            <div style="width:max-content;text-align:center">
                <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
                <ion-label>Заказов нет</ion-label><br>
            </div>
        </div>
  </base-layout>
</template>
<script>
import { 
    modalController,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonAvatar,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonChip,
    IonNote,
    IonImg,
}                   from '@ionic/vue';
import {
    storefrontOutline,
    sparklesOutline,
    timeOutline,
    rocketOutline,
    ribbonOutline,
    checkmarkOutline,
}                   from 'ionicons/icons';
import ordersIcon   from "@/assets/icons/orders.svg";
import Order        from '@/scripts/Order.js';
import User         from '@/scripts/User.js';
import Topic        from '@/scripts/Topic.js';
import router       from '@/router';
import CourierJobPreview    from '@/components/CourierJobPreview.vue';

export default {
    components: {
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonAvatar,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonChip,
    IonNote,
    IonImg,
    },
    setup() {
      return { sparklesOutline,storefrontOutline,timeOutline,ordersIcon,rocketOutline,ribbonOutline,checkmarkOutline, };
    },
    data(){
        return {
            jobList:null,
            orderList:null,
            orderType:null,
            courierJobsInclude:null,
            clock:null
        };
    },
    computed:{
        orderListComputed(){
            for(let order of this.orderList){
                switch(order.user_role){
                    case 'customer':
                        order.icon=ordersIcon
                        break;
                    case 'admin':
                        order.icon=ribbonOutline
                        break;
                    case 'courier':
                        order.icon=rocketOutline
                        break;
                    case 'supplier':
                        order.icon=storefrontOutline
                        break;
                }
                order.date=this.toLocDate(order.updated_at)
            }
            return this.orderList;
        },
        jobListComputed(){
            for(let order of this.jobList){
                if( !order.location_address ){
                    order.location_address='';
                }
                //order.location_address=order.location_address.split(',').reverse().join(',');
                if( order.distance ){
                    order.distance_km=Math.round(order.distance/1000)+'км';
                } else {
                    order.distance_km='';
                }
                order.date_time=this.toLocDateTime(order.created_at)
            }
            return this.jobList;
        }
    },
    created(){
        let self=this;
        this.$topic.on('courierStatusChange',function(){
            self.courierReadinessCheck();
        });
        self.courierReadinessCheck();
    },
    methods:{
        toLocDate( iso ){
            const event = new Date(Date.parse(iso));
            const options = { month: 'short', day: 'numeric' };

            return event.toLocaleDateString(undefined, options);
        },
        toLocDateTime( iso ){
            const event = new Date(Date.parse(iso));
            const options = { month: 'short', day: 'numeric',hour:'numeric',minute:'numeric' };

            return event.toLocaleDateString(undefined, options);
        },
        courierReadinessCheck(){
            const courierJobsInclude=User.courier.status=='ready'?1:0;
            if(this.courierJobsInclude===courierJobsInclude){
                return
            }
            this.courierJobsInclude=courierJobsInclude
            if(this.courierJobsInclude==0){
                this.orderType='active';
            } else {
                this.orderType='jobs';
            }
        },
        async listLoad(listType){
            this.autoReload(listType);
            if( listType=='jobs' ){
                this.listJobLoad();
                return;
            }
            let order_group_type='customer_finish';
            if( listType=='active' ){
                order_group_type='active_only';
            }
            this.orderList=await Order.api.listLoad(order_group_type);
            this.jobList=null;
        },
        listTypeChanged(e){
            const listType=e.target.value;
            this.listLoad(listType);
        },
        async listJobLoad(){
            try{
                const courier_id=User.courier?.data?.courier_id;
                this.jobList=await Order.api.listJobGet(courier_id);
                this.orderList=null;
            } catch(err){
                const message=err.responseJSON?.messages?.error;
                if(message=='notready'){
                    User.courier.status='notready';
                    this.courierReadinessCheck();
                }
            }
        },
        autoReload(listType){
            clearTimeout(this.clock);
            const self=this;
            const timeout=1000*60*2;
            if(listType=='jobs' || listType=='active'){
                this.clock=setTimeout(()=>{
                    self.listLoad(listType);
                },timeout);
            }
        },
        ionViewDidEnter() {
            this.courierReadinessCheck();
            if(this.orderType=='active'){
                this.listLoad('active');
            } else {
                this.orderType='active'
            }
        },
        ionViewDidLeave() {
            clearTimeout(this.clock);
        },
        async itemClick(order){
            if( order.is_courier_job ){
                const modal = await modalController.create({
                    component: CourierJobPreview,
                    componentProps:{orderData:order},
                    initialBreakpoint: 0.6,
                    breakpoints: [0, 0.6, 0.75]
                    });
                const dismissFn=function(){
                    modal.dismiss();
                };
                Topic.on('dismissModal',dismissFn);
                return modal.present();
            }
            this.itemOpen(order.order_id);
        },
        itemOpen(order_id){
            router.push(`order-${order_id}`);
        }
    }
}
</script>