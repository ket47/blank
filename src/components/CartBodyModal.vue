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
          <order-view :order="cart"></order-view>
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
import OrderView          from '@/components/OrderView.vue';

export default{
  inject:['$Order'],
  components: { OrderView },
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
    }
  }
};
</script>