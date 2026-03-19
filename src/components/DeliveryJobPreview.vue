<style scoped>

    .center_chip{
        text-align:center;
        width: 100%;
    }
</style>
<template>
  <ion-content>
    <ion-list lines="none">
        <ion-item>
            <ion-icon v-if="job.finish_plan_scheduled_date" :icon="alarmOutline" slot="start" style="font-size:24px;" color="danger"></ion-icon>
            <h5 style="color:#999">{{job.job_name}}</h5>
            <ion-select v-if="isAdmin" slot="end" name="job_courier_type" :value="jobComp.job_courier_type" interface="popover" @ion-change="itemTypeUpdate($event.target.value)">
                <ion-select-option value="auto">🔄 авто</ion-select-option>
                <ion-select-option value="shift">🚦 смена</ion-select-option>
                <ion-select-option value="taxi">🚕 такси</ion-select-option>
            </ion-select>
        </ion-item>
        <ion-item>
            <ion-text>
                <h6 style="color:#666">Забрать</h6><!-- <span style="color:#ccc">{{job.start_plan_date}}</span>-->
                <a :href="`https://yandex.ru/maps/?pt=${job.start_longitude},${job.start_latitude}&z=19&l=map,trf`" target="_new">
                    {{job.start_address}}
                </a>
            </ion-text>
            <ion-icon slot="end" :icon="square" size="large"  :style="`color:${job.start_color}`"/>
        </ion-item>
        <ion-item>
            <ion-text>
                <h6 v-if="finish_plan_scheduled_date_full">Привезти к {{finish_plan_scheduled_date_full}} (⏰ Запланирован)</h6>
                <h6 v-else style="color:#666">Привезти</h6><!-- <span style="color:#ccc">{{job.finish_plan_date}}</span>-->

                <span v-if="job.customer_heart_count>0"><ion-icon :icon="heartSharp" color="danger"></ion-icon>({{job.customer_heart_count}})</span>&nbsp;
                <a :href="`https://yandex.ru/maps/?pt=${job.finish_longitude},${job.finish_latitude}&z=19&l=map,trf`" target="_new">
                    {{job.finish_address}}
                </a>
            </ion-text>
            <ion-icon slot="end" :icon="square" size="large"  :style="`color:${job.finish_color}`"/>
        </ion-item>
    </ion-list>
    <div v-if="jobComp.courier_gain_total>0 && job.stage=='awaited'">
        <ion-item lines="none">
            <h3 slot="start" style="color:#333;padding-top:7px;">Итого</h3>
            <h1 slot="end" style="color:var(--ion-color-primary);padding:3px;border-radius:7px">{{jobComp.courier_gain_total}}{{ $heap.state.currencySign }}</h1>
        </ion-item>
        <ion-item id="deljobprev_info" lines="none">
            <ion-chip v-if="$heap.state.courier.rating_score>0" color="medium"><ion-icon :icon="add" color="success"/><ion-label>рейтинг</ion-label></ion-chip>
            <ion-chip v-if="job?.delivery_promised_tip>0" color="medium"><ion-icon :icon="add" color="success"/><ion-label>чаевые</ion-label></ion-chip>
            <ion-chip color="medium"><ion-icon :icon="information"/><ion-label>подробнее</ion-label></ion-chip>
        </ion-item>
        <ion-popover trigger="deljobprev_info" trigger-action="click">
            <ion-content>
                <ion-list lines="none">
                    <ion-item>
                        <ion-label>Доставка</ion-label>
                        {{ jobComp.delivery_gain_base }}{{ $heap.state.currencySign }}
                    </ion-item>
                    <ion-item>
                        <ion-label>Рейтинг&nbsp;{{ Number($heap.state.courier.rating_score*5).toFixed(2) }}⭐</ion-label>
                        +{{ jobComp.courier_rating_bonus }}{{ $heap.state.currencySign }} <span style="color:#ccc">/{{ jobComp.delivery_rating_pool }}{{ $heap.state.currencySign }}</span>
                    </ion-item>
                    <ion-item v-if="job?.delivery_promised_tip>0">
                        <ion-label>Обещанные чаевые</ion-label>
                        +{{ jobComp.delivery_promised_tip }}{{ $heap.state.currencySign }}
                    </ion-item>
                </ion-list>
            </ion-content>
        </ion-popover>
    </div>
    <ion-card v-if="job.stage=='awaited' && job.payment_by_cash==1" color="light">
        <ion-card-header>
            <ion-card-subtitle>Заказ не оплачен</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content v-if="customerDetails">
            <p>Созвонитесь с клиентом <b>{{customerDetails.user_name}}</b> <ion-chip color="primary"><a :href="`tel:+${customerDetails.user_phone}`">+{{customerDetails.user_phone}}</a></ion-chip></p>
            <p>
                <ion-checkbox @click="confirmed=$event.target.checked?0:1">Клиент на связи и готов ждать</ion-checkbox>
            </p>
        </ion-card-content>
    </ion-card>
    <div class="ion-padding">
        <ion-button v-if="job.stage=='awaited'" @click="jobTake()" expand="block" :disabled="!confirmed">Взять задание</ion-button>
        <ion-button v-else-if="job.stage!='scheduled'" @click="itemOpen()" expand="block">Открыть заказ</ion-button>
    </div>

    <ion-button @click="close()" expand="block" color="dark" fill="clear">Закрыть</ion-button>

 </ion-content>
</template>
<script>
import { 
    IonList,
    IonButton,
    IonItem,
    IonIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardSubtitle,
    IonChip,
    IonCheckbox,
    IonText,
    IonLabel,
    IonPopover,
    modalController,
    IonSelect,
    IonSelectOption,
}                   from '@ionic/vue';
import {
    square,
    alarmOutline,
    add,
    information,
    heartSharp
}                   from 'ionicons/icons';

import User from '@/scripts/User.js'

export default({
    props:['job'],
    components:{
    IonList,
    IonButton,
    IonItem,
    IonIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardSubtitle,
    IonChip,
    IonCheckbox,
    IonText,
    IonLabel,
    IonPopover,
    IonSelect,
    IonSelectOption,

    },
    setup() {
        return { 
            square,
            alarmOutline,
            add,
            information,
            heartSharp
            }
    },
    data(){
        return {
            customerDetails:null,
            confirmed:0
        };
    },
    mounted(){
        if(this.job.stage=='awaited' && this.job.payment_by_cash==1){
            this.customerDetailsGet()
            this.confirmed=0
        } else {
            this.confirmed=1
        }
    },
    computed:{
        finish_plan_scheduled_date_full(){
            if( this.job.finish_plan_scheduled>0 ){
                const finish_plan_scheduled = new Date(this.job.finish_plan_scheduled*1000)
                return finish_plan_scheduled.toLocaleDateString(undefined, { month: 'short',year: 'numeric', day: 'numeric',hour:'numeric',minute:'numeric' })
            }
            return null
        },
        jobComp(){
            const job=this.job
            job.courier_rating_bonus=Math.round(job.delivery_rating_pool*this.$heap.state.courier.rating_score)
            job.courier_gain_total=job.delivery_gain_base*1+job.courier_rating_bonus+job.delivery_promised_tip*1
            return job
        },
        isAdmin(){
            return User.isAdmin()
        },
    },
    methods:{
        async jobTake(){
            try{
                const request={
                    order_id:this.job.order_id
                }
                await this.$post(`${this.$heap.state.hostname}DeliveryJob/itemTake`,request)
                this.itemOpen();
                this.$topic.publish('dismissModal');
                modalController.dismiss(null, 'confirm')

            } catch(err){
                const message=err.responseJSON?.messages?.error;
                if(message=='forbidden'){
                    this.$flash("Не хватает прав");
                }
                if(message=='notfound'){
                    this.$flash("Задание не найдено");
                }
                if(message=='notready'){
                    this.$flash("Ваш статус должен быть 'ГОТОВ'");
                }
                if(message=='notsearching' || message=='idle'){
                    this.$flash("Заданию уже назначен курьер");
                }
            }
        },
        itemOpen(){
            if(this.job.is_shipment==1){
                this.$go(`/order/shipment-${this.job.order_id}`);
            } else {
                this.$go(`/order/order-${this.job.order_id}`);
            }
        },
        async customerDetailsGet(){
            this.customerDetails=null
            const request={
                job_id:this.job.job_id
            }
            try{
                this.customerDetails=await this.$post(`${this.$heap.state.hostname}DeliveryJob/itemCustomerDetailGet`,request)
            } catch{
                this.$flash("Данные клиента не найдены")
            }
        },
        close(){
            modalController.dismiss(null, 'cancel')
        },
        async itemTypeUpdate( new_type ){
            try{
                const request ={
                    job_id:this.job.job_id,
                    job_courier_type:new_type
                }
                await this.$post(`${this.$heap.state.hostname}DeliveryJob/itemUpdate`,JSON.stringify(request))
            } catch{
                //
            }
        }
    }
})
</script>
