<style scoped>
  .order-segment{
    box-shadow: 0px -5px 5px #ddd;
    margin-top: 25px;
  }
  .order-segment:first-of-type{
    margin-top: 0px !important;
  }
</style>

<template>
  <ion-header>
      <ion-toolbar color="light">
          <ion-title color="dark">Корзина</ion-title>
          <ion-icon slot="end" @click="clearCart();" :icon="closeCircle" size="large" color="medium"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <div v-if="cartList.length">
      <div v-for="cart in cartList" :key="cart.order_id" class="order-segment">
          <order-comp :orderData="cart" @stageCreate="onStageCreate"></order-comp>
      </div>
    </div>
    <div v-else style="display:flex;align-items:center;justify-content:center;height:100%">
      <div style="width:max-content;text-align:center">
        <ion-icon :icon="sparklesOutline" size="large"></ion-icon>
        <ion-label>Корзина пуста </ion-label><br>
        <a href="/home">на главную</a>
      </div>
    </div>
  </ion-content>
</template>

<script>
import heap              from '@/heap';
import {closeCircle,sparklesOutline}      from 'ionicons/icons';
import {modalController}  from "@ionic/vue";
import Order              from '@/scripts/Order.js';
import Topic              from '@/scripts/Topic.js';
import OrderComp          from '@/components/OrderComp.vue';
import router             from '@/router';

export default{
  components: { OrderComp },
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return { closeModal, closeCircle, sparklesOutline };
  },
  data(){
    return {
      cartList:heap.state.cartList
    };
  },
  methods: {
    clearCart(){
      this.closeModal();
    },
    async onStageCreate(order_id, new_stage){
        const syncedOrder=await Order.cart.itemSync(order_id);
        if(syncedOrder){
            order_id=syncedOrder.order_id;
        }
        const stateChangeResult=await Order.api.itemStageCreate(order_id,new_stage);
        if( stateChangeResult!=='ok' ){
          return;
        }
        Topic.publish('dismissModal');

        if( new_stage!='customer_cart'){
            Order.cart.itemDelete(order_id);
        }
        if( new_stage=='customer_confirmed' ){
          router.push(`order-${order_id}`);
        }
    }
  }
};
</script>