<template>
    <ion-row class="cart-container" @click="openModal()">
      <ion-col class="cart-thumbnail">
          <ion-icon  color="primary" :icon="cart"></ion-icon>
          <ion-badge color="secondary" v-if="cartData.orders">{{ cartData.orders.length }}</ion-badge>
      </ion-col>
    </ion-row>
</template>
 
<script>

import { cart } from 'ionicons/icons';
import { modalController } from '@ionic/vue';
import CartBodyModal from '../components/CartBodyModal.vue'
import store from '../store';
import OrderScript from '../scripts/Order.js';


export default{
  setup() {
    return {
      cart
    }
  },
  data() {
    return { 
      cartData: store.getters.cartGet,
      error: ""
    };
  },
  methods:{
    async openModal() {
      var self = this;
      const modal = await modalController
        .create({
          component: CartBodyModal,
          cssClass: 'cart-body',
          componentProps: {
            cartData: self.cartData
          }
        })
      return modal.present();
    }
  },
  mounted(){
    if(store.state.user.user_id !== 0){
      OrderScript.getUserOrders('cart');
    }
  }
};
</script>


<style>
.cart-container{
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 1px 1px 5px #0000001a;
  border: 2px solid white;
}
.cart-container ion-thumbnail{
  margin-right: 15px;
}
.cart-container .cart-thumbnail{
  background: white;
  visibility: visible;
  padding: 5px 2px 5px 7px;
  display: flex;
  border-radius: 0;
}
.cart-container .cart-total{
  visibility: visible;
  background: #dbe6fb;
  color: var(--ion-color-primary);
  border-radius: 0;
  align-content: center;
  display: flex;
  line-height: 1.4;
  padding: 5px 10px;
  height: max-content;
}
.cart-container .cart-total ion-label{
  font-weight: bold;
}
.cart-container ion-icon{
  font-size: 22px
}
.cart-container ion-badge{
  visibility: visible;
  border-radius: 11px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  padding: 0;
}
</style>