<template>
    <base-layout :pageTitle="`Заказ #${order_id} ${order?.deleted_at?'(Удален)':''}` " pageDefaultBackLink="/order/order-list">

            <div v-if="order=='notfound'" style="display:flex;align-items:center;justify-content:center;height:100%">
                <div style="width:max-content;text-align:center">
                    <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
                    <ion-label>Заказ не найден</ion-label><br>
                    <a href="/order/order-list">список заказов</a>
                </div>
            </div>

            <order-comp :orderData="order" @stageCreate="onStageCreate" @orderRefresh="itemGet"/>
            <order-tracking-comp :orderData="order"/>
            <order-info-comp :orderData="order"/>
            <image-tile-comp v-if="order?.images" :images="order?.images" :image_holder_id="order?.order_id" controller="Order" ref="orderImgs" source="CAMERA"/>
            <order-history-comp :orderData="order"/>
            <msg-subscription-comp/>
            <order-meta-comp :orderId="order_id" v-if="order?.stage_current=='system_finish'"/>
            <ion-item detail button lines="none" @click="$router.push('/user/reactions')" v-if="order?.stage_current=='system_finish'">
                <ion-icon :src="chatboxOutline" slot="start" color="primary"/>
                Нам важно ваше мнение. Оставьте отзыв о покупке
            </ion-item>

            <ion-popover :is-open="isOpenDeliveryRejectionPopover" @didDismiss="isOpenDeliveryRejectionPopover=false">
                <ion-content>
                <ion-list>
                    <ion-item :button="true" :detail="false" @click="action_rejected_reason('ДОСТАВКА НЕ УДАЛАСЬ: Отказ клиента')">
                        <ion-label>Отказ клиента</ion-label>
                    </ion-item>
                    <ion-item :button="true" :detail="false" @click="action_rejected_reason('ДОСТАВКА НЕ УДАЛАСЬ: Поломка в пути')">
                        <ion-label>Поломка в пути</ion-label>
                    </ion-item>
                    <ion-item :button="true" :detail="false" @click="action_rejected_reason('ДОСТАВКА НЕ УДАЛАСЬ: Заказ испорчен')">
                        <ion-label>Заказ испорчен</ion-label>
                    </ion-item>
                </ion-list>
                </ion-content>
            </ion-popover>
    </base-layout>
</template>

<script>
import {
    sparklesOutline,
    chatboxOutline,
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
import OrderInfoComp        from '@/components/OrderInfoComp.vue';
import OrderMetaComp        from '@/components/OrderMetaComp.vue';
import OrderTrackingComp    from '@/components/OrderTrackingComp.vue'
import OrderObjectionModal  from '@/components/OrderObjectionModal.vue'
import OrderEntryAdd        from '@/components/OrderEntryAdd.vue'
import ImageTileComp        from '@/components/ImageTileComp.vue'
import MsgSubscriptionComp  from '@/components/MsgSubscriptionComp.vue'
import ItemPicker           from '@/components/ItemPicker.vue'

import jQuery               from 'jquery'

export default({
    components: { 
    OrderComp,
    OrderHistoryComp,
    OrderMetaComp,
    OrderInfoComp,
    OrderTrackingComp,
    MsgSubscriptionComp,
    ImageTileComp,
    IonLabel,
    IonIcon,
    IonContent,
    IonItem,
    IonList,
    IonPopover
    },
    setup(){
        return {sparklesOutline,  chatboxOutline,};
    },
    data(){
        return {
            order_id:this.$route.params.id,
            order:null,
            orderAutoloadClock:null,
            isOpenDeliveryRejectionPopover:false
        }
    },
    methods:{
        async itemGet( mode ){
            try{
                if(mode!=='skipCaching'){//dont use caching on edit mode
                    const orderCache=await Order.api.itemPreGet(this.order_id);
                    if(orderCache){
                        this.order=orderCache
                    }
                }
                this.order=await Order.api.itemGet(this.order_id);
                this.itemAutoReload()
            } catch(err) {
                switch(err.status){
                    case 404:
                        this.$flash("Заказ не найден");
                        this.order='notfound';
                        this.$go('/order/order-list');
                        break;
                }
            }
        },
        itemAutoReload(){
            clearTimeout(this.orderAutoloadClock)
            this.orderAutoloadClock=setTimeout(()=>{
                this.itemGet()
                console.log('order autoreload')
            },60*1000)
        },
        async onStageCreate(order_id, order_stage_code){
            if( order_stage_code.includes('action') ){
                order_stage_code=order_stage_code.split('_').splice(1).join('_');
                try{
                    this[order_stage_code](order_id);
                }catch{
                    console.log('stage handler not found'+order_stage_code)
                }
                return;
            }

            if( order_stage_code=='supplier_rejected' ){
                const result=await this.objection_input('ПРИЧИНА ОТМЕНЫ ЗАКАЗА: ')
                if( result!=='ok' ){
                    return
                }
            }

            try{
                const stateChangeResult=await Order.api.itemStageCreate(order_id, order_stage_code);
                if(stateChangeResult=='ok'){
                    if( order_stage_code=='customer_purged' || order_stage_code=='customer_deleted' ){
                        this.$flash("Заказ удален");
                        this.order=null;
                        this.$go('/order/order-list');
                        Order.cart.itemDelete(order_id)//if there is a copy of order in the cart
                        return;
                    }
                    await this.itemGet();
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
                        this.$go('/modal/user-addresses');
                        break;
                    case 'order_sum_exceeded':
                        this.$flash("Сумма заказа должна быть меньше предоплаты")
                        break;
                    case 'order_sum_zero':
                        this.$flash("Неверная стоимость заказа!")
                        break;
                    case 'forbidden_bycustomer':
                        this.$flash("Запрещено покупателем")
                        break;
                    case 'already_payed':
                        this.$flash("Заказ уже оплачен")
                        break;
                        
                    case 'deposit_inapplicable':
                        this.$flash("Внесение оплаты не предусмотрено")
                        break;
                    case 'deposit_error_nocof':
                        this.$flash("Нет привязанного способа оплаты")
                        break;
                    case 'deposit_error_fund':
                        this.$alert("На счету недостаточно средств","Оплата не прошла")
                        break;
                    case 'deposit_error_card':
                        this.$alert("Возможно, карта заблокирована или просрочена","Не действительная карта")
                        break;
                    case 'deposit_error_fraud':
                        this.$alert("Отказано в оплате! Обратитесь в ваш банк.","Оплата отклонена")
                        break;
                    case 'deposit_error':
                        this.$flash("Оплата привязанной картой не удалась")
                        break;
                    default:
                        this.$flash("Не удалось изменить статус заказа")
                        break;
                }
                await this.itemGet();
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
            console.log('setCurrentOrder',this.order)
            await this.$heap.commit('setCurrentOrder',this.order);
            this.$go(`/modal/order-checkout-${this.order_id}`);
        },
        async action_add(){
            const modal = await modalController.create({
                component: OrderEntryAdd,
                componentProps:{store_id:this.order.order_store_id,order_id:this.order_id},
                initialBreakpoint: 0.75,
                breakpoints: [0.75, 1],
                canDissmiss:true,
                });
            modal.present()     
            const product=await modal.onDidDismiss();     
            this.itemGet()  
        },
        async objection_input( prefix='' ){
            const modal = await modalController.create({
                component: OrderObjectionModal,
                initialBreakpoint: 0.50,
                breakpoints: [0.50, 1],
                canDissmiss:true,
                });
            modal.present()
            const objection=await modal.onDidDismiss();
            if(!objection.data){
                return null;
            }
            const message=`${prefix} ${objection.data}`;
            return await Order.api.itemUpdate({order_id:this.order_id,order_objection:message})
        },
        async action_objection(){
            const result=await this.objection_input('ВОЗРАЖЕНИЕ ПОКУПАТЕЛЯ: ')
            if( result=='ok' ){
                const is_disputed=await this.onStageCreate(this.order_id, 'customer_disputed');
                if( is_disputed ){
                    this.$flash("Ваше возражение будет рассмотрено продавцом.")
                    this.$alert("Необходимо сфотографировать заказ")
                    this.action_take_photo()
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
        async action_courier_assign(){
            const itemType='courier'
            const filter={
                status:'ready||busy'
            }
            const modal = await modalController.create({
                component: ItemPicker,
                componentProps:{itemType,filter},
                initialBreakpoint: 0.75,
                breakpoints: [0.75, 1],
                canDissmiss:true,
            });
            modal.present()
            this.$topic.on('dismissModal',()=>{
                modal.dismiss()
            });
            const item=await modal.onDidDismiss();
            if(!item.data){
                return
            }
            try{
                const request={
                    order_id:this.order_id,
                    courier_id:item.data.courier_id
                }
                await jQuery.post(`${this.$heap.state.hostname}DeliveryJob/itemAssign`,request)
                await this.itemGet()
                this.$flash("Курьер назначен")
            } catch{
                this.$flash("Не удалось назначить курьера")
            }
        },
    },
    ionViewDidEnter() {
        this.itemGet();
    },
    ionViewDidLeave(){
        //this.order=null;
        clearTimeout(this.orderAutoloadClock)
    },
    created(){
        this.itemGet();
        this.$topic.on('orderSumChanged',()=>this.itemGet('skipCaching'))
        
        this.$topic.on('pushStageChanged',data=>{
            if( this.order?.order_id==data?.order_id && this.order.stage_current!=data.stage ){
                this.itemGet();
            }
        })
    }
})
</script>
