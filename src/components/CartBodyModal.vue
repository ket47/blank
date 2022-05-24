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
      <ion-toolbar color="secondary">
        <ion-title>Корзина</ion-title>
        <ion-icon slot="end" @click="clearCart();" :icon="closeOutline" size="large"></ion-icon>
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
import {
  modalController,
  IonContent,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle
}                         from "@ionic/vue";
import 
{
  closeOutline,
  sparklesOutline,
  cartOutline,
}                         from 'ionicons/icons';
import heap               from '@/heap';
import OrderComp          from '@/components/OrderComp.vue';
import Order              from '@/scripts/Order.js';

export default{
  components: { 
  OrderComp,
  IonContent,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle
  },
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return { closeModal, closeOutline,cartOutline, sparklesOutline };
  },
  data(){
    return {
      cartList:heap.state.cartList
    };
  },
  created(){
    this.$topic.on('dismissModal',()=>{
      modalController.dismiss();
    })
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
            if(stateChangeResult=='ok' && order_stage_code=='customer_confirmed'){
                this.$router.push('order-checkout-'+syncedOrder.order_id);
                return;
            }
            this.$router.push('order-'+syncedOrder.order_id);
        } catch{
          /** */
        }
    },
  }
};
</script>