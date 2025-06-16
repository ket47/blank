<template>
    <base-layout :pageTitle="`Вызов курьера ${order?.deleted_at?'(Удален)':''}` " pageDefaultBackLink="/order/order-list">

            <div v-if="order=='notfound'" style="display:flex;align-items:center;justify-content:center;height:100%">
                <div style="width:max-content;text-align:center">
                    <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
                    <ion-label>Заказ не найден</ion-label><br>
                    <a href="/order/order-list">список заказов</a>
                </div>
            </div>

            <div v-if="is_draft==1">
                <shipment-draft-comp :orderData="order" @stageCreate="onStageCreate" @orderUpdate="itemUpdate" @locationUpdate="locationUpdate"/>
            </div>
            <div  v-if="is_draft==0">
                <shipment-comp :orderData="order" @stageCreate="onStageCreate" @orderRefresh="itemGet"/>
                <order-tracking-comp :orderData="order"/>
                <order-info-comp :orderData="order"/>
                <image-tile-comp v-if="order?.images" :images="order?.images" :image_holder_id="order?.order_id" controller="Order" ref="orderImgs"/>
                <order-history-comp :orderData="order"/>
                <order-meta-comp :orderId="order_id" v-if="order?.stage_current=='system_finish'"/>

                <ion-popover :is-open="isOpenDeliveryRejectionPopover" @didDismiss="isOpenDeliveryRejectionPopover=false">
                    <ion-content>
                    <ion-list>
                        <ion-item :button="true" :detail="false" @click="action_rejected_reason('Посылка не готова к отправке, к приезду курьера')">
                            <ion-label>Посылка не готова</ion-label>
                        </ion-item>
                        <ion-item :button="true" :detail="false" @click="action_rejected_reason('Посылка больше или тяжелее чем предусмотрено условиями')">
                            <ion-label>Посылка большая или тяжелая</ion-label>
                        </ion-item>

                        <ion-item :button="true" :detail="false" @click="action_rejected_reason('ДОСТАВКА НЕ УДАЛАСЬ: Получатель не принял посылку')">
                            <ion-label>Отказ получателя</ion-label>
                        </ion-item>
                        <ion-item :button="true" :detail="false" @click="action_rejected_reason('ДОСТАВКА НЕ УДАЛАСЬ: Поломка в пути')">
                            <ion-label>Поломка в пути</ion-label>
                        </ion-item>
                        <ion-item :button="true" :detail="false" @click="action_rejected_reason('ДОСТАВКА НЕ УДАЛАСЬ: Заказ испорчен')">
                            <ion-label>Заказ испорчен</ion-label>
                        </ion-item>
                        <ion-item :button="true" :detail="false" @click="action_objection()">
                            <ion-label>Другая причина</ion-label>
                        </ion-item>
                    </ion-list>
                    </ion-content>
                </ion-popover>
            </div>
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
    IonPopover,
}                           from '@ionic/vue';
import ShipmentDraftComp    from '@/components/ShipmentDraftComp.vue';
import ShipmentComp         from '@/components/ShipmentComp.vue';
import OrderHistoryComp     from '@/components/OrderHistoryComp.vue';
import OrderInfoComp        from '@/components/OrderInfoComp.vue';
import OrderMetaComp        from '@/components/OrderMetaComp.vue';
import OrderTrackingComp    from '@/components/OrderTrackingComp.vue'
import OrderObjectionModal  from '@/components/OrderObjectionModal.vue'
import ImageTileComp        from '@/components/ImageTileComp.vue'
import ItemPicker           from '@/components/ItemPicker.vue'

import Utils               from '@/scripts/Utils'
import jQuery               from 'jquery'

export default({
    components: { 
        ShipmentDraftComp,
        ShipmentComp,
        OrderHistoryComp,
        OrderMetaComp,
        OrderInfoComp,
        OrderTrackingComp,
        ImageTileComp,
        IonLabel,
        IonIcon,
        IonContent,
        IonItem,
        IonList,
        IonPopover,
    },
    setup(){
        return {sparklesOutline,  chatboxOutline,};
    },
    data(){
        return {
            is_draft:null,
            order_id:this.$route.params.id,
            order:null,
            orderAutoloadClock:null,
            isOpenDeliveryRejectionPopover:false,
        }
    },
    methods:{
        async itemCreate(){
            const date=new Date()
            const draft={
                order_store_id:null,
                order_id:0,
                entries:[],
                created_at:date.toISOString().replace(/[T]/g,' ').replace(/.\d\d\dZ/,''),
                stage_next:{
                    "customer_confirmed": ["Перейти к оформлению"],
                    "customer_deleted": ["Удалить","danger","clear"],
                },
                stage_current:'customer_cart',
                user_role:'customer',
            }
            this.itemSave(draft)
        },
        async itemGet(){
            if( !this.order_id || this.order_id==0 ){
                this.itemLoad()
                return
            }
            try{
                this.order = await Utils.prePost(`${this.$heap.state.hostname}Shipment/itemGet`,{order_id:this.order_id})
                this.order = await Utils.post(`${this.$heap.state.hostname}Shipment/itemGet`,{order_id:this.order_id})
                if( this.order.stage_current=='customer_cart' ){
                    this.order.deliveryCalculation=await this.itemTotalEstimate(this.order.order_start_location_id,this.order.order_finish_location_id)
                    this.is_draft=1
                } else {
                    this.is_draft=0
                }

                this.itemAutoReload()
            } catch(err) {
                switch(err.status){
                    case 404:
                        this.$flash("Заказ не найден");
                        this.order=null;
                        this.$go('/order/order-list');
                        break;
                }
            }
        },
        async itemLoad(){
            try{
                const storedOrder=JSON.parse(localStorage.shipmentDraft)
                if(storedOrder){
                    storedOrder.deliveryCalculation=await this.itemTotalEstimate(storedOrder.order_start_location_id,storedOrder.order_finish_location_id)
                    this.order=storedOrder
                    this.is_draft=1
                    return
                }
            }catch{/** */}
            this.itemCreate()
        },
        itemSave( order ){
            this.order=order
            localStorage.shipmentDraft=JSON.stringify(Object.assign({},order,{order_id:0}))
        },
        async itemSync(){
            try{
                const request={
                    is_shopping:0,
                    order_id:this.order.order_id??null,
                    order_description:this.order.order_description,
                    order_start_location_id:this.order.order_start_location_id,
                    order_finish_location_id:this.order.order_finish_location_id,
                    order_sum_delivery:this.order.deliveryCalculation.sum
                }
                const order_id = await jQuery.post(`${this.$heap.state.hostname}Shipment/itemSync`,JSON.stringify(request))
                if( order_id>0 ){
                    this.$router.push(`/modal/shipment-checkout-${order_id}`)
                }
            } catch(err){
                const exception_code=err?.responseJSON?.messages?.error;
                if(!exception_code){
                    return false;
                }
                switch(exception_code){
                    case 'address_not_set':
                        this.$flash("Необходимо добавить адрес доставки")
                        this.$topic.publish('dismissModal')
                        this.$go('/modal/user-addresses')
                        this.$heap.state.next_route='/order/shipment-'+this.order_id;
                        break;
                }
                return false
            }
        },
        itemAutoReload(){
            clearTimeout(this.orderAutoloadClock)
            this.orderAutoloadClock=setTimeout(()=>{
                this.itemGet()
            },60*1000)
        },
        async onStageCreate(order_id, order_stage_code){
            if( this.is_draft==1 ){
                if( order_stage_code=='customer_confirmed' ){
                    this.itemSync()
                    return
                }
                if(  order_stage_code=='customer_purged' || order_stage_code=='customer_deleted' ){
                    localStorage.removeItem('shipmentDraft');
                    if(order_id==0){
                        this.$router.replace(`/order/order-list`)
                        this.$flash("Заказ удален")
                        return
                    }
                }
            }
            if( order_stage_code.includes('action') ){
                order_stage_code=order_stage_code.split('_').splice(1).join('_');
                try{
                    this[order_stage_code](order_id);
                }catch(err){
                    console.log('stage handler not found '+order_stage_code+': ',err)
                }
                return;
            }
            try{
                const request={
                    order_id:this.order_id,
                    new_stage:order_stage_code
                }
                const stateChangeResult=await jQuery.post(`${this.$heap.state.hostname}Shipment/itemStageCreate`,request);
                if(stateChangeResult=='ok'){
                    if( order_stage_code=='customer_purged' || order_stage_code=='customer_deleted' ){
                        this.order=null;
                        this.$go('/order/order-list');
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
                    case 'photos_must_be_made':
                        this.$flash("Необходимо сфотографировать заказ")
                        this.action_take_photo()
                        break;
                    case 'address_not_set':
                        this.$flash("Необходимо добавить адрес доставки")
                        this.$go('/modal/user-addresses');
                        break;
                    case 'order_sum_zero':
                        this.$flash("Нельзя завершить пустой заказ, от него можно отказаться.")
                        break;
                    case 'already_payed':
                        this.$flash("Заказ уже оплачен")
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
            this.$go(`/modal/shipment-checkout-${this.order_id}`);
        },
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
                const message=`${objection.data}`;
                const request={
                    order_id:this.order_id,
                    order_objection:message
                }
                const result=await jQuery.post(`${this.$heap.state.hostname}Shipment/itemUpdate`,JSON.stringify(request))
                if( result=='ok' ){
                    const is_disputed=await this.onStageCreate(this.order_id, 'delivery_rejected');
                    if( is_disputed ){
                        this.$flash("Ваше возражение принято и будет рассмотрено администратором.")
                        //alert("Необходимо сфотографировать заказ")
                        //this.action_take_photo()
                    }
                }
            }
        },
        action_rejected(){
            this.isOpenDeliveryRejectionPopover=true;
        },
        async action_rejected_reason(reason){
            this.isOpenDeliveryRejectionPopover=false;
            const request={
                    order_id:this.order_id,
                    order_objection:reason
                }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Shipment/itemUpdate`,JSON.stringify(request))
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
        async action_customer_start(){
            this.onStageCreate(this.order_id, 'customer_start')
        },
        async itemUpdate( orderUpdate ){
            if( orderUpdate.mode=='refreshTotalEstimates' ){
                orderUpdate.deliveryCalculation=await this.itemTotalEstimate( orderUpdate.order_start_location_id, orderUpdate.order_finish_location_id )
            }
            this.itemSave(Object.assign({},this.order,orderUpdate))
        },
        async itemTotalEstimate(start_location_id,finish_location_id){
            if(!start_location_id || !finish_location_id){
                return
            }
            const request={
                start_location_id,finish_location_id
            }
            try{
                return await jQuery.post(`${this.$heap.state.hostname}Shipment/itemDeliverySumEstimate`,request)
            } catch(err){/** */}
        },
        async locationUpdate(locationUpdate){
            try{
                await jQuery.post(`${this.$heap.state.hostname}Location/itemUpdate`,JSON.stringify(locationUpdate))
                this.$flash("💾 Сохранено")
            }catch{/** */}
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
