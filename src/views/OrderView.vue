<template>
    <base-layout pageTitle="Заказ">
        <ion-content>
            <div v-if="order=='notfound'" style="display:flex;align-items:center;justify-content:center;height:100%">
                <div style="width:max-content;text-align:center">
                    <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
                    <ion-label>Заказ не найден</ion-label><br>
                    <a href="/order-list">список заказов</a>
                </div>
            </div>
            <order-comp :orderData="order" @stageCreate="onStageCreate"></order-comp>
        </ion-content>
    </base-layout>
</template>

<script>
import Order from '@/scripts/Order.js';
import OrderComp from '@/components/OrderComp.vue';
import {sparklesOutline}      from 'ionicons/icons';
import router from '@/router';

export default({
    components: { OrderComp },
    setup(){
        return {sparklesOutline};
    },
    data(){
        return {
            order_id:0,
            order:null
        }
    },
    mounted(){
        this.order_id=this.$route.params.id;
        this.orderGet();
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
                        router.go(-1);
                        break;
                }
            }
        },
        async onStageCreate(order_id, order_stage_code){
            if( order_stage_code.includes('action') ){
                this[order_stage_code](order_id);
                return;
            }
            const stateChangeResult=await Order.itemStageCreate(order_id, order_stage_code);
            if(stateChangeResult=='ok'){
                if( order_stage_code=='customer_purged' ){
                    this.$flash("Заказ удален");
                    this.order=null;
                    router.go(-1);
                    return;
                }
                this.orderGet();
            }
        },
        action_checkout(order_id){
            this.$heap.state.currentOrder=this.order;
            router.push('order-checkout-'+order_id);
        }
    }
})
</script>
