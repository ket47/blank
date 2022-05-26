<template>
    <base-layout pageTitle="Заказ" pageDefaultBackLink="order-list">
        <ion-content v-if="order">
            <div v-if="order=='notfound'" style="display:flex;align-items:center;justify-content:center;height:100%">
                <div style="width:max-content;text-align:center">
                    <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
                    <ion-label>Заказ не найден</ion-label><br>
                    <a href="/order-list">список заказов</a>
                </div>
            </div>
            <order-comp :orderData="order" @stageCreate="onStageCreate"></order-comp>
            <order-tracking-comp :orderData="order"/>
            <order-history-comp :orderData="order"/>
            <image-tile-comp :images="order?.images" :image_holder_id="order?.order_id" controller="Order" ref="orderImgs"/>
        </ion-content>
    </base-layout>
</template>

<script>
import {
    sparklesOutline
}                           from 'ionicons/icons';
import { 
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
            order_id:0,
            order:null,
            orderIsLoading:false,
        }
    },
    methods:{
        async orderGet(){
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
                    await this.orderGet();
                    return true;
                }
            }catch(err){
                const exception=err.responseJSON;
                const exception_code=exception.messages.error;
                switch(exception_code){
                    case 'order_is_empty':
                        this.$flash("Заказ пуст")
                        break;
                }
                return false
            }
        },
        async action_checkout(order_id){
            const result=await this.onStageCreate(order_id, 'customer_confirmed');
            if( result ){
                this.$heap.commit('setCurrentOrder',this.order);
                this.$router.push('order-checkout');
            }
        },
        action_take_photo(){
            console.log(this.$refs.orderImgs)
            this.$refs.orderImgs.take_photo();
        },
    },
    ionViewDidEnter() {
        this.order_id=this.$route.params.id;
        this.orderGet();
    },
    mounted(){
        this.order_id=this.$route.params.id;
        this.orderGet();
    }
})
</script>
