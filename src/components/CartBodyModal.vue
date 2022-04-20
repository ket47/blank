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
import 
{
  closeCircle,
  sparklesOutline
}                         from 'ionicons/icons';
import heap               from '@/heap';
import {modalController}  from "@ionic/vue";
import OrderComp          from '@/components/OrderComp.vue';
import Order              from '@/scripts/Order.js';

export default{
  inject:['$Order'],
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
    clearCart(order_id){
      this.closeModal();
      this.clearHighlightedProducts();
      return Order.cart.itemDelete(order_id);
    },
    clearHighlightedProducts(){
      document.querySelectorAll('.incart').forEach(item=>item.classList.remove("incart"));
    },
    async onStageCreate(order_id, order_stage_code){
        if(order_stage_code=='customer_purged'){
          return this.clearCart(order_id);
        }
        try{
            const syncedOrder=await Order.cart.itemSync(order_id);
            const stateChangeResult=await Order.api.itemStageCreate(syncedOrder.order_id,order_stage_code);
            
            if(stateChangeResult=='ok' && order_stage_code!='customer_cart'){
                this.clearCart(syncedOrder.order_id);
            }
            this.$router.push('order-'+syncedOrder.order_id);
        } catch( err ){
            console.error(err);
        }
    },
  }
};
</script>