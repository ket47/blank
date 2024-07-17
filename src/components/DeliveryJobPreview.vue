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
  <ion-content>
    <ion-list lines="none">
        <ion-item>
            <h4 style="color:#999">{{job.job_name}} [{{job.stage_label}}]</h4>
        </ion-item>
        <ion-item>
            <h6>Забрать до {{job.start_plan_date}}</h6>
        </ion-item>
        <ion-item>
            <ion-icon slot="end" :icon="square" size="large"  :style="`color:${job.start_color}`"/>
            <a :href="`https://yandex.ru/maps/?pt=${job.start_longitude},${job.start_latitude}&z=19&l=map,trf`" target="_new" style="color:#999">
                {{job.start_address}}
            </a>
        </ion-item>
        <ion-item>
            <h6>Привезти до {{job.finish_plan_date}}</h6>
        </ion-item>
        <ion-item>
            <ion-icon slot="end" :icon="square" size="large"  :style="`color:${job.finish_color}`"/>
            <a :href="`https://yandex.ru/maps/?pt=${job.finish_longitude},${job.finish_latitude}&z=19&l=map,trf`" target="_new" style="color:#999">
                {{job.finish_address}}
            </a>
        </ion-item>
    </ion-list>
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
    <ion-button v-if="job.stage=='awaited'" @click="jobTake()" expand="block" :disabled="!confirmed">Взять задание</ion-button>
    <ion-button v-else @click="itemOpen()" expand="block">Открыть заказ</ion-button>
    <ion-button @click="close()" expand="block" color="light">Закрыть</ion-button>
 </ion-content>
</template>
<script>
import { 
    IonList,
    IonButton,
    IonItem,
    IonIcon,
    IonContent,
    modalController
}                   from '@ionic/vue';
import {
    square
    }               from 'ionicons/icons';
import jQuery       from 'jquery';


export default({
    props:['job'],
    components:{
    IonList,
    IonButton,
    IonItem,
    IonIcon,
    IonContent
    },
    setup() {
        return { 
            square
            }
    },
    data(){
        return {
            customerDetails:null,
            confirmed:0
        };
    },
    mounted(){
        this.customerDetailsGet()
        if(this.job.stage=='awaited' && this.job.payment_by_cash==1){
            this.confirmed=0
        } else {
            this.confirmed=1
        }
    },
    methods:{
        async jobTake(){
            try{
                const request={
                    order_id:this.job.order_id
                }
                await jQuery.post(`${this.$heap.state.hostname}DeliveryJob/itemTake`,request)
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
            this.customerDetails=await jQuery.post(`${this.$heap.state.hostname}DeliveryJob/itemCustomerDetailGet`,request)
        },
        close(){
            modalController.dismiss(null, 'cancel')
        }
    }
})
</script>
