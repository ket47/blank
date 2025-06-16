<template>
    <base-layout page-title="Вызов курьера">
        <shipment-draft-comp :orderData="order" @stageCreate="onStageCreate" @orderUpdate="itemUpdate" @locationUpdate="locationUpdate"/>
    </base-layout>
</template>
<script>

import jQuery           from "jquery";
import ShipmentDraftComp          from '@/components/ShipmentDraftComp.vue';

export default {
    components:{
        ShipmentDraftComp,
    },
    data(){
        return{
            order:null,
            errorCode:null
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
        async itemLoad(){
            try{
                const storedOrder=JSON.parse(localStorage.shipmentDraft)
                if( storedOrder && this.$heap.getters.userIsLogged ){
                    storedOrder.deliveryCalculation=await this.itemTotalEstimate(storedOrder.order_start_location_id,storedOrder.order_finish_location_id)
                    this.order=storedOrder
                    return
                }
            }catch{/** */}
            this.itemCreate()
        },
        itemSave( order ){
            this.order=order
            localStorage.shipmentDraft=JSON.stringify(Object.assign({},order,{order_id:0}))
        },
        async itemUpdate( orderUpdate ){
            console.log(orderUpdate.mode,orderUpdate.order_start_location_id,orderUpdate.order_finish_location_id)
            if( orderUpdate.mode=='refreshTotalEstimates' ){
                orderUpdate.deliveryCalculation=await this.itemTotalEstimate( orderUpdate.order_start_location_id, orderUpdate.order_finish_location_id )
            }
            this.itemSave(Object.assign({},this.order,orderUpdate))
        },
        async locationUpdate(locationUpdate){
            try{
                await jQuery.post(`${this.$heap.state.hostname}Location/itemUpdate`,JSON.stringify(locationUpdate))
                this.$flash("сохранено")
            }catch{/** */}
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
        async onStageCreate(order_id, order_stage_code){
            if(order_stage_code=='customer_purged' || order_stage_code=='customer_deleted' ){
                localStorage.removeItem('shipmentDraft');
                this.$router.replace(`/order/order-list`)
                try{
                    const request={
                        order_id:this.order.order_id,
                        new_stage:order_stage_code
                    }
                    await jQuery.post(`${this.$heap.state.hostname}Shipment/itemStageCreate`,request);
                }catch{/** */}
                return
            }
            if(order_stage_code=='customer_action_confirm'){
                order_stage_code='customer_confirmed'
            }
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
                        this.$heap.state.next_route='/order/order-'+order_id;
                        break;
                }
                return false
            }
        },
    },
    mounted(){
        this.itemLoad()
    }
}
</script>