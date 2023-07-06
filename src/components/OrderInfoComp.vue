<template>
    <ion-list v-if="orderData?.info?.tariff_info">
        <ion-item lines="none" color="light">
            <h4>Условия оплаты и доставки</h4>
        </ion-item>
        <ion-item lines="none" color="light">
            <ion-text v-html="orderData.info.tariff_info">
            </ion-text>
        </ion-item>
    </ion-list>

    <ion-accordion-group>
        <ion-accordion v-if="orderData?.info?.customer_name">
            <ion-item slot="header">
                <ion-label>Покупатель <b>{{orderData.info.customer_name}}</b></ion-label>
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
                    <div v-if="orderData.info.customer_location_address">
                        <ion-icon :src="locationOutline" color="primary"/>
                        <a :href="`https://yandex.ru/maps/?pt=${orderData.info.customer_location_longitude},${orderData.info.customer_location_latitude}&z=19&l=map,trf`" target="_new">
                            {{orderData.info.customer_location_address}} 
                        </a>
                    </div>
                    <ion-note v-if="orderData.info.customer_location_comment">
                        Комментарий к адресу: {{orderData.info.customer_location_comment}} 
                    </ion-note>
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
                    <div v-if="orderData.info.supplier_location_address">
                        <ion-icon :src="locationOutline" color="primary"/>
                        <a :href="`https://yandex.ru/maps/?pt=${orderData.info.supplier_location_longitude},${orderData.info.supplier_location_latitude}&z=19&l=map,trf`" target="_new">
                            {{orderData.info.supplier_location_address}}
                        </a>
                    </div>
                    <ion-note v-if="orderData.info.supplier_location_comment">
                        Комментарий к адресу: {{orderData.info.supplier_location_comment}} 
                    </ion-note>
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
    IonNote,
    IonList,
    IonText,
}                       from '@ionic/vue';
import { 
    locationOutline,
    callOutline,
    mailOutline,
}                       from 'ionicons/icons';
//import jQuery           from 'jquery'

export default({
    props:['orderData'],
    components: {
    IonIcon,
    IonChip,
    IonLabel,
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonNote,
    IonList,
    IonText,
    },
    setup() {
        return { 
            locationOutline,
            callOutline,
            mailOutline,
        };
    },
    data(){
        return {
        };
    },
    computed:{
        // contactInfo(){
        //     let info=null;
        //     if(this.orderData.customer_public_data){
        //         info=JSON.parse(JSON.parse(this.orderData.customer_public_data));
        //     }
        //     return info;
        // },
    },
    methods:{
        // async infoGet(){
        //     const request={
        //         order_id:this.orderData?.order_id
        //     }
        //     try{
        //         if(this.gotInfo || !request.order_id){
        //             return
        //         }
        //         this.gotInfo=true
        //         this.info=await jQuery.post(`${this.$heap.state.hostname}Order/itemInfoGet`,request)
        //         console.log(this.info)
        //     }catch{
        //         this.gotInfo=false
        //     }
        // }
    },
})
</script>
