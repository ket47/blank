<template>
  <base-layout page-title="Заказы" hideBackLink="true">
        <ion-segment swipe-gesture="true" v-model="orderType" @ionChange="listTypeChanged($event)">
            <ion-segment-button value="jobs" v-if="courierJobsInclude">
                Задания
            </ion-segment-button>
            <ion-segment-button value="active">
                Активные
            </ion-segment-button>
            <ion-segment-button value="done">
                Завершенные
            </ion-segment-button>
        </ion-segment>
        <ion-list v-if="orderList?.length>0">
            <div v-for="order in orderListComputed" :key="order.order_id" @click="itemClick(order)">
                <ion-item lines="none">
                    <ion-text slot="start">#{{order.order_id}}</ion-text>
                    <ion-label v-if="order.is_shipment==1">Вызов курьера 🛵 {{order.store_name}}</ion-label>
                    <ion-label v-else>{{order.store_name}}</ion-label>
                    <ion-text slot="end">{{order.date}}</ion-text>
                </ion-item>
                <ion-item lines="full">
                    <ion-icon slot="start" :icon="order.icon" color="primary"/>
                    <ion-text>
                        <ion-label>
                            <ion-chip color="medium">{{order.order_sum_total}}{{$heap.state.currencySign}}</ion-chip>
                            <ion-chip :color="order.stage_color" v-if="order.stage_current_name">
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
                <ion-label v-if="order.is_shipment==1">Вызов курьера 🛵 {{order.store_name}}</ion-label>
                <ion-label v-else>{{order.store_name}}</ion-label>
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
        <ion-list v-if="['active','done'].includes(orderType) && orderList==null">
            <div v-for="i in [1,2,3]" :key="i">
            <ion-item lines="none">
                <ion-skeleton-text style="width:50px" slot="start"/>
                <ion-skeleton-text style="width:100%"/>
                <ion-skeleton-text style="width:50px" slot="end"/>
            </ion-item>
            <ion-item lines="full">
                <ion-skeleton-text animated style="width:30px;height:30px;border-radius:50px" slot="start"/>
                <ion-chip color="medium"><ion-label color="dark"><ion-skeleton-text animated style="width:80px;"/></ion-label></ion-chip>
                <ion-chip color="primary">
                    <ion-icon :icon="checkmarkOutline"></ion-icon>
                    <ion-label color="dark"><ion-skeleton-text animated style="width:80px;"/></ion-label>
                </ion-chip>
                <ion-skeleton-text animated style="width:40px;height:40px;border-radius:10px" slot="end"/>
            </ion-item>
            </div>
        </ion-list>
        <div v-else-if="(!orderList || orderList?.length==0) && (!jobList || jobList?.length==0)" style="display:flex;align-items:center;justify-content:center;height:70vh">
            <div v-if="$heap.getters.userIsLogged" style="width:max-content;text-align:center">
                <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
                <ion-label>Заказов нет</ion-label><br>
                <ion-note @click="$router.replace('/')" style="cursor:pointer" color="primary">но вы можете создать новый</ion-note>
            </div>
            <div v-else style="width:max-content;text-align:center">
                <ion-icon :icon="informationOutline" size="large"></ion-icon>
                <ion-label>Необходимо войти в систему</ion-label><br>
                <ion-note @click="$router.replace('/user/sign-in')" style="cursor:pointer" color="primary">вход в систему</ion-note>
            </div>
        </div>
        <ion-infinite-scroll @ionInfinite="listLoadMore($event)" id="moderation-infinite-scroll">
            <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Загрузка..."></ion-infinite-scroll-content>
        </ion-infinite-scroll>
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText,
}                   from '@ionic/vue';
import {
    storefrontOutline,
    sparklesOutline,
    informationOutline,
    timeOutline,
    rocketOutline,
    ribbonOutline,
    checkmarkOutline,
}                   from 'ionicons/icons';
import ordersIcon   from "@/assets/icons/orders.svg";
import Order        from '@/scripts/Order.js';
import User         from '@/scripts/User.js';
import Topic        from '@/scripts/Topic.js';
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText,
    },
    setup() {
      return { sparklesOutline,storefrontOutline,timeOutline,ordersIcon,rocketOutline,ribbonOutline,checkmarkOutline,informationOutline };
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
                order.date=this.toLocDate(order.created_at)
                order.stage_color=order.stage_current=='customer_cart'?'light':'primary'
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
        this.$topic.on('courierStatusChange',()=>{
            this.courierReadinessCheck();
        });
        this.$topic.on('userGet',()=>{
            this.listLoad(this.orderType,'reload');
        });
        this.courierReadinessCheck();
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
        async listLoad(listType,mode='reload'){
            if( listType=='jobs' ){
                this.autoReload(listType);
                this.listJobLoad();
                return;
            }
            let order_group_type='system_finish';
            if( listType=='active' ){
                this.autoReload(listType);
                order_group_type='active_only';
            }
            const request={
                order_group_type,
                offset:0,
                limit:(this.orderList?.length||10),
            }
            if(mode=='append'){
                request.offset=this.orderList?.length??0
                request.limit=10
            }
            let orderList=await Order.api.listLoad(request);
            if( mode=='append' ){
                this.orderList??=[]
                orderList=this.orderList.concat(orderList)
            }
            this.orderList=orderList
            this.jobList=null;
        },
        async listLoadMore(ev){
            await this.listLoad(this.orderType,'append')
            ev.target.complete();
        },
        listTypeChanged(e){
            const listType=e.target.value;
            this.orderList=null
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
            const timeout=1000*60*2;
            if(listType=='jobs' || listType=='active'){
                this.clock=setTimeout(()=>{
                    this.listLoad(this.orderType);
                },timeout);
            }
        },
        ionViewDidEnter() {
            this.courierReadinessCheck();
            this.listLoad(this.orderType);
            // if(this.orderType=='active'){
            //     this.listLoad('active');
            // } else {
            //     this.orderType='active'
            // }
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
            this.itemOpen(order.order_id,order.is_shipment);
        },
        itemOpen(order_id,is_shipment){
            if(is_shipment==1){
                this.$go(`/order/shipment-${order_id}`);
            } else {
                this.$go(`/order/order-${order_id}`);
            }
        }
    }
}
</script>