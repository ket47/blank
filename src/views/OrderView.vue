<template>
    <base-layout :pageTitle="`Заказ #${order_id}`" pageDefaultBackLink="/order-list">

            <div v-if="order=='notfound'" style="display:flex;align-items:center;justify-content:center;height:100%">
                <div style="width:max-content;text-align:center">
                    <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
                    <ion-label>Заказ не найден</ion-label><br>
                    <a href="/order-list">список заказов</a>
                </div>
            </div>

            <order-comp :orderData="order" @stageCreate="onStageCreate"/>
            <order-tracking-comp :orderData="order"/>
            <order-history-comp :orderData="order"/>
            <image-tile-comp v-if="order" :images="order?.images" :image_holder_id="order?.order_id" controller="Order" ref="orderImgs"/>

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
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonText,
    IonNote,
    IonList,
    
}                           from '@ionic/vue';
import Order                from '@/scripts/Order.js';
import OrderComp            from '@/components/OrderComp.vue';
import OrderHistoryComp     from '@/components/OrderHistoryComp.vue';
import OrderTrackingComp    from '@/components/OrderTrackingComp.vue'
import OrderObjectionModal  from '@/components/OrderObjectionModal.vue'
import ImageTileComp        from '@/components/ImageTileComp.vue'


export default({
    components: { 
    OrderComp,
    OrderHistoryComp,
    OrderTrackingComp,
    ImageTileComp,
    IonLabel,
    IonIcon,
    IonContent,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonText,
    IonNote,
    IonList,
    
    },
    setup(){
        return {sparklesOutline};
    },
    data(){
        return {
            order_id:this.$route.params.id,
            order:null,
            orderIsLoading:false,
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
                        return;
                    }
                    await this.itemGet();
                    return true;
                }
            }catch(err){
                const exception=err.responseJSON;
                const exception_code=exception.messages.error;
                switch(exception_code){
                    case 'order_is_empty':
                        this.$alert("К сожалению, товара не осталось в наличии &#9785;","Заказ пуст");
                        break;
                    case 'photos_must_be_made':
                        this.$flash("Необходимо сфотографировать заказ")
                        this.action_take_photo()
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
            this.$router.push('order-checkout');
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
                const result=await Order.api.itemUpdate({order_id:this.order_id,order_objection:objection.data})
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
        action_take_photo(){
            this.$refs.orderImgs.take_photo();
        },
        action_call_customer(){
            window.open(`tel:${this.order.customer.user_phone}`)
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
        this.itemGet();
    }
})
</script>
