<style scoped>
    ion-list{
        box-shadow: 0px -5px 5px #eee;
    }
</style>
<template>
    <base-layout pageTitle="Оформление заказа">
        <user-address-widget :deliveryTime="deliveryTime" showComment="1"></user-address-widget>

        <ion-list>
            <ion-item-divider>Способы оплаты</ion-item-divider>
            <ion-item button @click="paymentType='payment_card'">
                <ion-icon :icon="cardOutline" slot="start" color="primary"></ion-icon>
                <label for="payment_card">Оплата картой</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="payment_card" value="card"  :checked="paymentType == 'payment_card'">
                </div>
            </ion-item>
            <ion-item button @click="paymentType='payment_cash'" v-if="0">
                <ion-icon :icon="cashOutline" slot="start" color="primary"></ion-icon>
                <label for="payment_cash">Оплата наличными</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="payment_cash" value="cash" :checked="paymentType == 'payment_cash'">
                </div>
            </ion-item>

            <ion-item-divider>Итого к оплате</ion-item-divider>
            <!--<ion-item button detail>
                <ion-icon :icon="giftOutline" slot="start" color="primary"></ion-icon>
                Выберите акцию
            </ion-item>-->
            <ion-item v-if="order?.order_sum_tax">
                <ion-icon :icon="pieChartOutline" slot="start" color="primary"></ion-icon>
                Налоги 
                <ion-text slot="end">{{order?.order_sum_tax}}</ion-text>
            </ion-item>
            <ion-item>
                <ion-icon src="./assets/icon/box-delivery.svg" slot="start" style="color:var(--ion-color-primary)"></ion-icon>
                Доставка 
                <ion-text slot="end">{{order?.order_sum_delivery??0}}</ion-text>
            </ion-item>
            <ion-item>
                <ion-icon :icon="walletOutline" slot="start" color="primary"></ion-icon>
                Итого
                <ion-text slot="end">{{order?.order_sum_total}}</ion-text>
            </ion-item>
        </ion-list>
        <ion-list v-if="order">
            <ion-item>
                <ion-textarea rows="5" placeholder="комментарий к заказу" @change="orderDescriptionChanged()" v-model="order.order_description"></ion-textarea>
            </ion-item>
        </ion-list>
        <ion-grid>
            <ion-row>
                <ion-col><ion-button expand="block" color="medium" @click="cancel()">Вернуться</ion-button></ion-col>
                <ion-col><ion-button expand="block" @click="proceed()">Продолжить</ion-button></ion-col>
            </ion-row>
        </ion-grid>
    </base-layout>
</template>

<script>
import Order    from '@/scripts/Order.js';
import Utils    from '@/scripts/Utils.js';
import Topic    from '@/scripts/Topic.js';
import router   from '@/router';
import jQuery   from 'jquery';

import { 
    cardOutline,
    cashOutline,
    giftOutline,
    cubeOutline,
    walletOutline,
    pieChartOutline
    }                           from 'ionicons/icons';
import { 
    modalController,
    IonTextarea,
    IonItemDivider,
    IonIcon,
    IonItem,
    IonList,
    IonText,
    IonItemGroup,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
}                               from "@ionic/vue";
import UserAddressWidget        from '@/components/UserAddressWidget.vue';
import OrderPaymentCardModal    from '@/components/OrderPaymentCardModal.vue';

export default({
    components: { 
        UserAddressWidget,
        IonTextarea,
        IonItemDivider,
        IonIcon,
        IonItem,
        IonList,
        IonText,
        IonItemGroup,
        IonButton,
        IonCol,
        IonRow,
        IonGrid,
    },
    setup(){
        return {cardOutline,cashOutline,giftOutline,cubeOutline,walletOutline,pieChartOutline};
    },
    data(){
        return {
            order_id:0,
            order:null,
            deliveryTime:{},
            paymentType:'payment_card'
        }
    },
    mounted(){
        this.checkoutDataGet();
    },
    methods:{
        async checkoutDataGet(){
            this.order_id=this.$route.params.id;
            this.order=this.$heap.state.currentOrder;
            if( !this.order ){
                await this.orderGet();
            }
            if( this.order.stage_current!="customer_confirmed" ){
                router.push('order-'+this.order.order_id);
                return;
            }
            const preparation=null;//use default prep time
            this.distance= await this.distanceGet();
            if(this.distance){
                this.deliveryTime=Utils.deliveryTimeCalculate(this.distance,preparation);
            }
        },
        async orderGet(){
            try{
                this.order=await Order.api.itemGet(this.order_id);
            } catch(err) {
                switch(err.status){
                    case 404:
                        this.$flash("Заказ не найден");
                        this.order='notfound';
                        router.go(-1);
                        break;
                }
            }
        },
        async distanceGet(){
            const request={
                start_holder:'store',
                start_holder_id:this.order.order_store_id,
                finish_holder:'user',
                finish_holder_id:this.order.owner_id
            };
            try{
                return await jQuery.post( this.$heap.state.hostname + "Location/distanceHolderGet", request );
            } catch (err){
                //
            }
        },
        async orderDescriptionChanged(){
            const request={
                order_id:this.order.order_id,
                order_description:this.order.order_description
            };
            Order.api.itemUpdate(request);
        },
        async proceed(){
            if(this.paymentType=='payment_cash'){
                //
            }
            if(this.paymentType=='payment_card'){
                this.paymentFormOpen({
                    order_id:this.order.order_id,
                    order_sum_total:this.order.order_sum_total,
                    user_id:this.order.owner_id
                });
            }
        },
        async cancel(){
            // try{
            //     await Order.api.itemStageCreate(this.order.order_id, 'customer_cart');
            // } catch(err){/* */}
            this.$router.push('order-'+this.order.order_id);
        },
        async paymentFormOpen( order_data ) {
            const self=this;
            const modal = await modalController.create({
                component: OrderPaymentCardModal,
                componentProps:{order_data},
                initialBreakpoint: 0.85,
                breakpoints: [0, 0.85, 0.95]
                });
            const dismissFn=function(){
                modal.dismiss();
            };
            Topic.on('dismissModal',dismissFn);

            modal.onDidDismiss().then(()=>{
                self.paymentStatusCheck();
            })
            return modal.present();
        },
        async paymentStatusCheck(){
            const request={
                order_id:this.order.order_id
            };
            try{
                const result= await jQuery.post( this.$heap.state.hostname + "UniPayments/paymentStatusRequest", request );
                if(result=='OK'){
                    router.push('order-'+this.order.order_id)
                }
            } catch(err){
                this.$flash("Данный заказ не может быть оплачен");
                const message=err.responseJSON?.messages?.error;
                if(message=='wrong_status'){
                    router.push('order-'+this.order.order_id);
                }
            }
        }
    }
})
</script>