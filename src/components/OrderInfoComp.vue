<template>
    <ion-accordion-group>
        <ion-accordion v-if="orderData?.info?.customer_name">
            <ion-item slot="header">
                <ion-label>Клиент <b>{{orderData.info.customer_name}}</b></ion-label>
            </ion-item>
            <ion-item slot="content">
                <ion-label class="ion-text-wrap">
                    <ion-chip color="primary" v-if="orderData.info.customer_phone">
                        <ion-icon :src="callOutline"/>
                        <a :href="`tel:${orderData.info.customer_phone}`">{{orderData.info.customer_phone}}</a>
                    </ion-chip>
                    <ion-chip color="primary" v-if="orderData.info.customer_email">
                        <ion-icon :src="mailOutline"/>
                        <a :href="`mailto:${orderData.info.customer_email}`">{{orderData.info.customer_email}}</a>
                    </ion-chip>
                    <ion-chip color="primary" @click="orderPushSend('customer','Курьер прибыл')">
                        <ion-icon :src="chatboxEllipsesOutline"/>
                        <ion-label>Написать сообщение</ion-label>
                    </ion-chip>
                    <div v-if="orderData.info.customer_location_address">
                        <ion-icon :src="locationOutline" color="primary"/>
                        <a :href="`https://yandex.ru/maps/?pt=${orderData.info.customer_location_longitude},${orderData.info.customer_location_latitude}&z=19&l=map,trf`" target="_new">
                            {{orderData.info.customer_location_address}} 
                        </a>
                    </div>
                    <div v-if="orderData.info.customer_location_comment" style="padding:10px;background-color:var(--ion-color-light);color:#333;border-radius:10px;display:inline-block">
                        {{orderData.info.customer_location_comment}}
                    </div>
                    <ion-text v-if="orderData.info.customer_pickup">
                        Покупатель выбрал самовывоз, как способ получения заказа.
                    </ion-text>
                </ion-label>
                    
            </ion-item>
        </ion-accordion>
        <ion-accordion v-if="orderData?.info?.supplier_name">
            <ion-item slot="header">
                <ion-label>Продавец <b>{{orderData.info.supplier_name}}</b></ion-label>
            </ion-item>
            <ion-item slot="content">
                <ion-label class="ion-text-wrap">
                    <ion-chip color="primary" v-if="orderData.info.supplier_phone">
                        <ion-icon :src="callOutline"/>
                        <a :href="`tel:${orderData.info.supplier_phone}`">{{orderData.info.supplier_phone}}</a>
                    </ion-chip>
                    <ion-chip color="primary" v-if="orderData.info.supplier_email">
                        <ion-icon :src="mailOutline"/>
                        <a :href="`mailto:${orderData.info.supplier_email}`">{{orderData.info.supplier_email}}</a>
                    </ion-chip>
                    <ion-chip color="primary" @click="orderPushSend('store','Начните готовить заказ')">
                        <ion-icon :src="chatboxEllipsesOutline"/>
                        <ion-label>Написать сообщение</ion-label>
                    </ion-chip>
                    <div v-if="orderData.info.supplier_location_address">
                        <ion-icon :src="locationOutline" color="primary"/>
                        <a :href="`https://yandex.ru/maps/?pt=${orderData.info.supplier_location_longitude},${orderData.info.supplier_location_latitude}&z=19&l=map,trf`" target="_new">
                            {{orderData.info.supplier_location_address}}
                        </a>
                    </div>
                    <div v-if="orderData.info.supplier_location_comment" style="padding:10px;background-color:var(--ion-color-light);color:#333;border-radius:10px;display:inline-block">
                        {{orderData.info.supplier_location_comment}}
                    </div>
                </ion-label>
            </ion-item>
        </ion-accordion>
    </ion-accordion-group>
</template>

<script>
import {
    IonIcon,
    IonChip,
    IonLabel,
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonText,
    alertController,
}                       from '@ionic/vue';
import { 
    locationOutline,
    callOutline,
    mailOutline,
    chatboxEllipsesOutline,
}                       from 'ionicons/icons';
import jQuery           from 'jquery'

export default({
    props:['orderData'],
    components: {
    IonIcon,
    IonChip,
    IonLabel,
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonText,
    },
    setup() {
        return { 
            locationOutline,
            callOutline,
            mailOutline,
            chatboxEllipsesOutline,
        };
    },
    data(){
        return {
        };
    },
    methods:{
        async orderPushSend( reciever='customer', message=''){
            const alert = await alertController.create({
                header: 'Послать сообщение',
                buttons: [
                    {
                        text: 'Отмена',
                        role: 'cancel'
                    },
                    {
                        text: 'Послать',
                        role: 'confirm'
                    },
                ],
                inputs: [
                    {
                        type:'textarea',
                        name:'comment',
                        placeholder: 'напишите сообщение',
                        value:message
                    },
                ],
            });
            await alert.present();
            const {data,role}=await alert.onDidDismiss()
            if(role=='cancel'){
                return
            }
            message=data.values.comment
            const request={
                order_id:this.orderData?.order_id,
                reciever:reciever,
                body:message
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Talk/orderChatSend`,request)
                this.$flash("Сообщение отправлено")
            }catch(err){
                const exception_code=err?.responseJSON?.messages?.error
                switch(exception_code){
                    case 'notsent':
                        this.$flash("Не удалось отправить сообщение")
                        break;
                    case 'unknown_reciever_type':
                        this.$flash("Не известный вид получателя")
                        break;
                    case 'order_is_finished':
                        this.$flash("Заказ уже завершен")
                        break;
                }
            }
        }
    },
})
</script>
