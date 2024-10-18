<template>
  <base-layout page-title="Заказы" hideBackLink="true">
        <ion-segment swipe-gesture="true" v-model="orderType" @ionChange="listTypeChanged($event)" :scrollable="true">
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
                    <ion-label v-if="order.is_shipment==1">Вызов курьера {{order.store_name}}</ion-label>
                    <ion-label v-else>{{order.store_name}}</ion-label>
                    <ion-text slot="end">{{order.date}}</ion-text>
                </ion-item>
                <ion-item lines="full">
                    <ion-icon slot="start" :icon="order.icon" color="primary"/>
                    <ion-text>
                        <ion-label>
                            <ion-chip color="medium">{{order.order_sum_total}}{{$heap.state.currencySign}}</ion-chip>
                            <ion-chip :color="order.stage_color" v-if="order.stage_current_name">
                                <ion-icon v-if="order.is_canceled==1" :icon="banOutline"></ion-icon>
                                <ion-icon v-else :icon="checkmarkOutline"></ion-icon>
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




        <!-- <ion-accordion-group v-if="orderType=='jobs' && jobList?.length>0">
            <ion-accordion value="oldjobs">
                <ion-item slot="header" color="light">
                    <ion-label>Задания</ion-label>
                </ion-item>
                <div slot="content" v-for="order in jobListComputed" :key="order.order_id" @click="itemClick(order)">
                    <ion-item lines="none" color="light">
                        <ion-icon slot="start" :icon="rocketOutline" color="primary"/>
                        <ion-label v-if="order.is_shipment==1">Вызов курьера {{order.store_name}}</ion-label>
                        <ion-label v-else>{{order.store_name}}</ion-label>
                        <ion-text slot="end">{{order.date_time}}</ion-text>
                    </ion-item>
                    <ion-item lines="full" color="light">
                        <b slot="start"><b style="color:var(--ion-color-primary)">{{order.distance_km}}</b> </b>
                        <ion-text style="margin-bottom:3px;">
                            <div style="padding:5px">
                                {{order.location_address}}
                                <ion-note v-if="order.location_comment">
                                    {{order.location_comment}}
                                </ion-note>
                            </div>
                            <div style="padding:5px" v-if="order.finish_location_address">
                                <b>Доставить:</b> {{order.finish_location_address}}
                                <ion-note v-if="order.finish_location_comment">
                                    {{order.finish_location_comment}}
                                </ion-note>
                            </div>
                            <div style="padding:10px;background-color:#eee;color:#333;border-radius:10px" v-if="order.order_description">
                                    {{order.order_description}}
                            </div>
                        </ion-text>
                    </ion-item>
                </div>
            </ion-accordion>
        </ion-accordion-group> -->
        <ion-list v-if="orderType=='jobs' && routeListGroupped" lines="none">
            <ion-list-header><h3>Маршрут</h3></ion-list-header>
            <div v-for="route in routeListGroupped" :key="route.courier_id">
                <ion-item>
                    <ion-avatar slot="start" v-if="route.image_hash">
                        <ion-img style="border-radius:10px;" :src="`${$heap.state.hostname}image/get.php/${route.image_hash}.150.150.webp`"/>
                    </ion-avatar>
                    <ion-text>
                        <b>{{route.courier_name}}</b>
                    </ion-text>
                    <ion-icon slot="end" :icon="square" :style="`color:${route.actual_color}`"/>
                </ion-item>
                <div v-for="(job) in route.jobs" :key="job.job_id" @click="itemClickConfirm(job)">
                    <ion-item lines="none" style="--inner-padding-bottom:0px">
                        <ion-icon v-if="job.finish_plan_scheduled_date" :icon="timeOutline" slot="start"></ion-icon>
                        <ion-text>
                            {{job.job_name}}
                        </ion-text>
                        <ion-chip slot="end" :color="job.stage_color">
                            <ion-icon :icon="checkmarkOutline"></ion-icon>
                            <ion-label color="dark"><small>{{job.stage_label}}</small></ion-label>
                        </ion-chip>
                    </ion-item>
                    <ion-item lines="full">
                        <div style="display:grid;grid-template-columns:40px auto 20px;width:100%;margin-bottom:3px">
                            <div style="padding:3px;color:var(--ion-color-primary)"><b>{{job.start_plan_date}}</b></div>
                            <div style="padding:3px;color:#333"><small>{{job.start_address}}</small></div>
                            <div><ion-icon :icon="square" :style="`color:${job.start_color}`"/></div>
                            <div v-if="job.finish_plan_scheduled_date" style="padding:3px;color:#fff;background-color:var(--ion-color-primary);border-radius:3px">
                                {{job.finish_plan_scheduled_date}}
                            </div>
                            <div v-else style="padding:3px;color:#999">{{job.finish_plan_date}}</div>
                            <div style="padding:3px;color:#333"><small>{{job.finish_address}}</small></div>
                            <div><ion-icon :icon="square" :style="`color:${job.finish_color}`"/></div>
                        </div>
                    </ion-item>
                </div>
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
        <div v-else-if="(!orderList || orderList?.length==0) && (!jobList || jobList?.length==0) && (!routeList || routeList?.length==0)" style="display:flex;align-items:center;justify-content:center;height:70vh">
            <div v-if="$heap.getters.userIsLogged" style="width:max-content;text-align:center">
                <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
                <ion-label>Заказов нет</ion-label><br>
                <ion-note @click="$router.replace('/')" style="cursor:pointer" color="primary">но вы можете создать новый</ion-note>
            </div>
            <div v-else style="width:max-content;text-align:center">
                <ion-icon :icon="informationOutline" size="large"></ion-icon>
                <ion-label>Необходимо войти в профиль</ion-label><br>
                <ion-note @click="$router.replace('/modal/user-authorize')" style="cursor:pointer" color="primary">вход в профиль</ion-note>
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
    IonListHeader,
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
    banOutline,
    square,
}                   from 'ionicons/icons';
import ordersIcon   from "@/assets/icons/orders.svg";
import Order        from '@/scripts/Order.js';
import User         from '@/scripts/User.js';
import Topic        from '@/scripts/Topic.js';
import CourierJobPreview        from '@/components/CourierJobPreview.vue';
import DeliveryJobPreview        from '@/components/DeliveryJobPreview.vue';
import jQuery                   from 'jquery'

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
    IonListHeader,
    IonChip,
    IonNote,
    IonImg,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText,
    },
    setup() {
      return { sparklesOutline,storefrontOutline,timeOutline,ordersIcon,rocketOutline,ribbonOutline,checkmarkOutline,informationOutline,banOutline,square,};
    },
    data(){
        return {
            jobList:null,
            routeList:null,
            orderList:null,
            orderType:'active',
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
                order.stage_color=order.is_canceled=='1'?'danger':order.stage_color
            }
            return this.orderList;
        },
        jobListComputed(){
            for(let order of this.jobList){
                if( !order.location_address ){
                    order.location_address='';
                }
                if( order.distance ){
                    order.distance_km=Math.round(order.distance/1000)+'км';
                } else {
                    order.distance_km='';
                }
                order.date_time=this.toLocDateTime(order.created_at)
            }
            return this.jobList;
        },
        routeListGroupped(){
            if( !this.routeList ){
                return null;
            }
            let routeList={}
            for(let i in this.routeList.open_shifts){
                let shift=this.routeList.open_shifts[i]
                shift.jobs=[] 
                routeList['route_'+shift.courier_id]=shift
            }
            

            const stageDict={
                'scheduled':'Запланирован',
                'awaited':'Очередь',
                'inited':'Собирается',
                'assigned':'Назначен',
                'started':'В пути'
            }
            for(let job of this.routeList.delivery_jobs){
                const finish_plan=new Date((job.start_plan*1+job.finish_arrival_time*1)*1000)
                const start_plan = new Date(job.start_plan*1000)
                job.start_plan_date=start_plan.toLocaleTimeString(undefined, { hour:'numeric',minute:'numeric' })
                job.finish_plan_date=finish_plan.toLocaleTimeString(undefined, { hour:'numeric',minute:'numeric' })
                job.stage_label=stageDict[job.stage]||'-'
                job.stage_color=['scheduled','awaited'].includes(job.stage)?'light':'primary'
                job.is_courier_job=1
                if(job.finish_plan_scheduled>0){
                    const finish_plan_scheduled = new Date(job.finish_plan_scheduled*1000)
                    job.finish_plan_scheduled_date=finish_plan_scheduled.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric',hour:'numeric',minute:'numeric' })
                }
                if( !job.courier_id ){
                    job.courier_id=0
                    if(!routeList['route_0']){
                        routeList['route_0']={courier_name:'',actual_color:'#fff',jobs:[]}
                    }
                }
                routeList['route_'+job.courier_id]?.jobs?.push(job)
            }
            return routeList
        },
    },
    mounted(){
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
            this.courierJobsInclude=localStorage.user_is_courier==1 || localStorage.user_is_admin==1
            if(this.courierJobsInclude==0){
                this.orderType='active';
            }
            //if(this.courierJobsInclude==0){
            //     this.orderType='active';
            // } else {
            //     this.orderType='jobs';
            // }
        },
        async listLoad(listType,mode='reload'){
            if( listType=='jobs' ){
                this.autoReload(listType);
                this.listRouteLoad();
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
            this.orderType=listType//to prevent sticking on wrong tab
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
        // async listJobLoad(){
        //     try{
        //         const courier_id=User.courier?.data?.courier_id;
        //         this.jobList=await Order.api.listJobGet(courier_id);
        //         this.orderList=null;
        //         this.listRouteLoad()
        //     } catch(err){
        //         const message=err.responseJSON?.messages?.error;
        //         if(message=='notready'){
        //             User.courier.status='notready';
        //             this.courierReadinessCheck();
        //         }
        //     }
        // },
        async listRouteLoad(){
            try{
                const request={}
                this.routeList=await jQuery.post(`${this.$heap.state.hostname}DeliveryJob/routeListGet`,request)
            } catch(err){
                const message=err.responseJSON?.messages?.error
                console.log(err)
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
        async itemClickConfirm(job){
            const modal = await modalController.create({
                component: DeliveryJobPreview,
                componentProps:{job},
                initialBreakpoint: 0.75,
                breakpoints: [0.75,1]
                });
            this.$topic.on('dismissModal',()=>{
                modal.dismiss()
            })
            await modal.present();
            const {data,role}=await modal.onDidDismiss()
            if(role=='confirm'){
                this.itemOpen(job.order_id,job.is_shipment)
            }
        },
        /**
         * deprecated
         */
        async itemClick(order){
            if( order.is_courier_job ){
                const modal = await modalController.create({
                    component: CourierJobPreview,
                    componentProps:{orderData:order},
                    initialBreakpoint: 0.75,
                    breakpoints: [0.5]
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