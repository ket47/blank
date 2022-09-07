<template>
    <base-layout :pageTitle="`Заказ #${order_id}`">

            <div v-if="order=='notfound'" style="display:flex;align-items:center;justify-content:center;height:100%">
                <div style="width:max-content;text-align:center">
                    <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
                    <ion-label>Заказ не найден</ion-label><br>
                    <a href="/order/order-list">список заказов</a>
                </div>
            </div>

            <order-comp :orderData="order" @stageCreate="onStageCreate"/>
            <order-tracking-comp :orderData="order"/>
            <order-history-comp :orderData="order"/>
            <image-tile-comp v-if="order" :images="order?.images" :image_holder_id="order?.order_id" controller="Order" ref="orderImgs"/>
            <msg-subscription-comp/>

            <ion-popover :is-open="isOpenDeliveryRejectionPopover" @didDismiss="isOpenDeliveryRejectionPopover=false">
                <ion-content>
                <ion-list>
                    <ion-item :button="true" :detail="false" @click="action_rejected_reason('ОТКАЗ КУРЬЕРА: Отказ клиента')">
                        <ion-label>Отказ клиента</ion-label>
                    </ion-item>
                    <ion-item :button="true" :detail="false" @click="action_rejected_reason('ОТКАЗ КУРЬЕРА: Заказ не готов/не соответствует')">
                        <ion-label>Заказ не готов/не соответствует</ion-label>
                    </ion-item>
                    <ion-item :button="true" :detail="false" @click="action_rejected_reason('ОТКАЗ КУРЬЕРА: Поломка в пути')">
                        <ion-label>Поломка в пути</ion-label>
                    </ion-item>
                    <ion-item :button="true" :detail="false" @click="action_rejected_reason('ОТКАЗ КУРЬЕРА: Заказ испорчен')">
                        <ion-label>Заказ испорчен</ion-label>
                    </ion-item>
                </ion-list>
                </ion-content>
            </ion-popover>
    </base-layout>
</template>

<script>
import {
    sparklesOutline
}                           from 'ionicons/icons';
import {
    modalController,
    IonLabel,
    IonIcon,
    IonContent,
    IonItem,
    IonList,
    IonPopover
}                           from '@ionic/vue';
import Order                from '@/scripts/Order.js';
import OrderComp            from '@/components/OrderComp.vue';
import OrderHistoryComp     from '@/components/OrderHistoryComp.vue';
import OrderTrackingComp    from '@/components/OrderTrackingComp.vue'
import OrderObjectionModal  from '@/components/OrderObjectionModal.vue'
//import OrderEntryAdd        from '@/components/OrderEntryAdd.vue'
import ImageTileComp        from '@/components/ImageTileComp.vue'
import MsgSubscriptionComp  from '@/components/MsgSubscriptionComp.vue'

import jQuery from 'jquery'


export default({
    components: { 
    OrderComp,
    OrderHistoryComp,
    OrderTrackingComp,
    MsgSubscriptionComp,
    //OrderEntryAdd,
    ImageTileComp,
    IonLabel,
    IonIcon,
    IonContent,
    IonItem,
    IonList,
    IonPopover
    },
    setup(){
        return {sparklesOutline};
    },
    data(){
        return {
            order_id:this.$route.params.id,
            order:null,
            orderIsLoading:false,
            isOpenDeliveryRejectionPopover:false
        }
    },
    methods:{
        async itemGet(){
            if(this.orderIsLoading){
                return
            }
            try{
                this.orderIsLoading=true
                this.order=await Order.api.itemGet(this.order_id);
                this.itemDetailsGet();
            } catch(err) {
                switch(err.status){
                    case 404:
                        this.$flash("Заказ не найден");
                        this.order='notfound';
                        this.$router.push('order-list');
                        break;
                }
            }
            this.orderIsLoading=false;
        },
        itemDetailsGet(){
            if( this.order.stage_current=='supplier_corrected' ){
                this.itemDetailsPrepaymentGet()
            }
        },
        async itemDetailsPrepaymentGet(){
            try{//cache?????
                const prepayment_trans=await jQuery.post(this.$heap.state.hostname+'Order/itemDetailsPrepaymentGet',{'order_id':this.order_id})
                //let order=this.order
                this.order.order_sum_prepayed=prepayment_trans.trans_amount
                //this.order=order
            }catch(err){
                //
            }
        },
        async onStageCreate(order_id, order_stage_code){
            if( order_stage_code.includes('action') ){
                order_stage_code=order_stage_code.split('_').splice(1).join('_');
                try{
                    this[order_stage_code](order_id);
                }catch{/** */}
                return;
            }
            try{
                const stateChangeResult=await Order.api.itemStageCreate(order_id, order_stage_code);
                if(stateChangeResult=='ok'){
                    if( order_stage_code=='customer_purged' ){
                        this.$flash("Заказ удален");
                        this.order=null;
                        this.$router.push('order-list');
                        Order.cart.itemDelete(order_id)//if copy of order there is in cart
                        return;
                    }
                    await this.itemGet();
                    if( order_stage_code=='customer_cart' ){
                        let order={
                            order_store_id:this.order.order_store_id,
                            order_id:this.order.order_id,
                            entries:this.order.entries,
                            stage_current_name:this.order.stage_current_name,
                            stage_next:this.order.stage_next,
                            store:{store_name:this.order.store.store_name}
                        }
                        Order.cart.itemSet(order)//fill local cart with reduced remote version
                    }
                    return true;
                }
            }catch(err){
                const exception=err.responseJSON;
                const exception_code=exception.messages.error;
                switch(exception_code){
                    case 'wrong_courier_status':
                        this.$flash("Смена курьера не открыта");
                        break;
                    case 'order_is_empty':
                        this.$alert("К сожалению, товара не осталось в наличии &#9785;","Заказ пуст");
                        break;
                    case 'photos_must_be_made':
                        this.$flash("Необходимо сфотографировать заказ")
                        this.action_take_photo()
                        break;
                    case 'address_not_set':
                        this.$flash("Необходимо добавить адрес доставки")
                        this.$router.push('/user/user-addresses');
                        break;
                    case 'order_sum_exceeded':
                        this.$flash("Сумма заказа должна быть меньше предоплаты")
                        break;
                    case 'order_sum_zero':
                        this.$flash("Нельзя завершить пустой заказ, от него можно отказаться.")
                        break;
                    default:
                        this.$flash("Не удалось изменить статус заказа")
                        break;
                }
                return false
            }
        },
        async action_confirm(order_id){
            const result=await this.onStageCreate(order_id, 'customer_confirmed');
            if( result ){
                this.action_checkout()
            }
        },
        async action_checkout(){
            this.$heap.commit('setCurrentOrder',this.order);
            this.$router.push('/order/order-checkout');
        },
        // async action_add(){
        //     const modal = await modalController.create({
        //         component: OrderEntryAdd,
        //         componentProps:{store_id:this.order.order_store_id,order_id:this.order_id},
        //         initialBreakpoint: 0.50,
        //         breakpoints: [0.50, 1],
        //         canDissmiss:true,
        //         });
        //     modal.present()     
        //     const product=await modal.onDidDismiss();     
        //     this.itemGet()  
        // },
        async action_objection(){
            const modal = await modalController.create({
                component: OrderObjectionModal,
                initialBreakpoint: 0.50,
                breakpoints: [0.50, 1],
                canDissmiss:true,
                });
            modal.present()
            const objection=await modal.onDidDismiss();
            if(objection.data){
                const message=`ВОЗРАЖЕНИЕ ПОКУПАТЕЛЯ: ${objection.data}`;
                const result=await Order.api.itemUpdate({order_id:this.order_id,order_objection:message})
                if( result=='ok' ){
                    const is_disputed=await this.onStageCreate(this.order_id, 'customer_disputed');
                    if( is_disputed ){
                        this.$flash("Ваше возражение принято и будет рассмотрено администратором.")
                        alert("Необходимо сфотографировать заказ")
                        this.action_take_photo()
                    }
                }
            }
        },
        action_rejected(){
            this.isOpenDeliveryRejectionPopover=true;
        },
        async action_rejected_reason(reason){
            this.isOpenDeliveryRejectionPopover=false;
            try{
                await Order.api.itemUpdate({order_id:this.order_id,order_objection:reason})
                await this.onStageCreate(this.order_id, 'delivery_rejected');
                this.$flash("Вы отказались от доставки")
            }catch{/** */}
        },
        action_take_photo(){
            this.$refs.orderImgs.take_photo();
        },
        action_call_customer(){
            location.href=`tel:+${this.order.customer.user_phone}`
        },
    },
    ionViewDidEnter() {
        if(this.order==null){
            this.itemGet();
        }
    },
    ionViewDidLeave(){
        this.order=null;
    },
    created(){
        const self=this
        self.itemGet();
        this.$topic.on('orderSumChanged',()=>{
            self.itemGet();
        })
        
        this.$topic.on('pushStageChanged',data=>{
            if( self.order?.order_id==data?.order_id && self.order.stage_current!=data.stage ){
                self.itemGet();
            }
        })
    }
})
</script>
