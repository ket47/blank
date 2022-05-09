<template>
    <base-layout pageTitle="Заказ" pageDefaultBackLink="order-list">
        <ion-content>
            <div v-if="order=='notfound'" style="display:flex;align-items:center;justify-content:center;height:100%">
                <div style="width:max-content;text-align:center">
                    <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
                    <ion-label>Заказ не найден</ion-label><br>
                    <a href="/order-list">список заказов</a>
                </div>
            </div>
            <order-comp :orderData="order" @stageCreate="onStageCreate"></order-comp>
            <image-tile-comp v-if="order?.images.length" :images="order?.images" :image_holder_id="order?.order_id" controller="Order" ref="orderImgs"></image-tile-comp>
        </ion-content>
    </base-layout>
</template>

<script>
import {sparklesOutline} from   'ionicons/icons';
import Order from               '@/scripts/Order.js';
import OrderComp from           '@/components/OrderComp.vue';
import ImageTileComp from       '@/components/ImageTileComp.vue'
import router from              '@/router';

export default({
    components: { OrderComp,ImageTileComp },
    setup(){
        return {sparklesOutline};
    },
    data(){
        return {
            order_id:0,
            order:null
        }
    },
    methods:{
        async orderGet(){
            try{
                this.order=await Order.api.itemGet(this.order_id);
            } catch(err) {
                switch(err.status){
                    case 404:
                        this.$flash("Заказ не найден");
                        this.order='notfound';
                        router.push('order-list');
                        break;
                }
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
                        router.push('order-list');
                        return;
                    }
                    this.orderGet();
                }
            }catch{/** */}
        },
        async action_checkout(order_id){
            await this.onStageCreate(order_id, 'customer_confirmed');
            this.$heap.state.currentOrder=this.order;
            router.push('order-checkout-'+order_id);
        },
        action_take_photo(){
            this.$refs.orderImgs.take_photo();
        },
        ionViewDidEnter() {
            this.order_id=this.$route.params.id;
            this.orderGet();
        },

    }
})
</script>
