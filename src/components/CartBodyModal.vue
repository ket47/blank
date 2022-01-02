<template>
  <ion-header>
    <ion-toolbar>
      <ion-button slot="start" @click="closeModal">Закрыть</ion-button>
      <ion-title >Корзина покупок</ion-title>
      <ion-button slot="end" @click="clearCart"><ion-icon :icon="trash"></ion-icon></ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list v-for="(order, index) in $store.state.cart.orders" :key="index" >
      <ion-item>
          <ion-label>{{ order.store_name }}</ion-label>
      </ion-item>
      <div  v-for="entry in order.entries"  :key="entry.entry_id" >
        <ion-item v-if="!entry.deleted_at" >
            <ion-col size="8">
              <router-link class="link" :to="'product-'+entry.product_id">
                <ion-label>{{ entry.entry_text }}</ion-label>
              </router-link>
              <ion-label class="product-price">{{ entry.entry_price }}₽</ion-label>
            </ion-col>
            <ion-col size="4">
              <product-add-buttons :product-item="entry"/>
            </ion-col>
        </ion-item>
      </div>
      <div class="deleted-item" v-for="entry in order.entries"  :key="entry.entry_id" >
      <ion-item v-if="entry.deleted_at">
          <ion-col size="8">
            <router-link class="link" :to="'product-'+entry.product_id">
              <ion-label>{{ entry.entry_text }}</ion-label>
            </router-link>
            <ion-label class="product-price">{{ entry.entry_price }}₽</ion-label>
          </ion-col>
          <ion-col size="4">
            <ion-button @click="entryRestore(entry.entry_id)">Восстановить</ion-button>
          </ion-col>
      </ion-item>
      </div>
      <ion-item>
          <ion-col  v-for="(stage_title, order_stage_code) in order.stage_next" :key="order_stage_code" >
            <ion-button @click="stageCreate(order, order_stage_code)" expand="block" :color="(stage_title[1]) ? 'danger' : 'primary'">{{ stage_title[0] }}</ion-button>
          </ion-col>
          <ion-col size="3">
            <h3>{{ order.order_sum_total }}₽</h3>
          </ion-col>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>

import { add, remove, trash } from 'ionicons/icons';
import { modalController } from '@ionic/vue';
import ProductAddButtons from '../components/ProductAddButtons'
import router from '../router';
import store from '../store';
import jQuery from "jquery";
import OrderScript from '../scripts/Order.js';

export default {
  name: 'CartBodyModal',
  components: { ProductAddButtons },
  setup() {
    return {
      add,
      remove,
      trash
    }
  },
  data() {
    return {
      error: ""
    }
  },
  methods: {
    stageCreate(order, new_stage){
      var self = this;
      jQuery.post( store.state.hostname + "Order/itemStageCreate", {order_id: order.order_id, new_stage: new_stage})
        .done(function(response) {
          if(response){
            OrderScript.getUserOrders('cart');
          }
          
        })
        .fail(function(err) {
          self.error = err.responseJSON.messages.error;
          console.log(self.error == 'forbidden');
          if(self.error == 'forbidden'){
            router.push({path: '/sign-in'});
            self.closeModal();
          }
      });
    },
    entryRestore(entry_id){
      jQuery.post( store.state.hostname + "Entry/itemUnDelete", {entry_id: entry_id})
        .done(function(success) {
          if(success){
            OrderScript.getUserOrders('cart');
          }
          self.error = '';
        })
        .fail(function(err) {
          self.error = err.responseJSON.messages.error;
      });
    },
    closeModal(){
      return modalController.dismiss();
    },
    clearCart(){
      store.state.cart = {
        orders: [],
        totals: {
            sum: 0,
            total: 0
        }
      };
      store.commit('setCart', store.state.cart);
      this.closeModal();
    }
  }
};
</script>


<style>
/*
.cart-body .modal-wrapper{
  width: 90%;
  height: 90%;
  border-radius: 15px;
}
*/

ion-list{
  box-shadow: 0px 0px 15px -5px #0000005e;
  padding: 0 !important;
}

.cart-body .product-actions{
  position: relative;
  flex-flow: row;
  flex-direction: row-reverse;
}
.deleted-item ion-item{
  --background: rgb(230, 230, 230)
}
.deleted-item ion-item a.link, .deleted-item ion-item ion-label{
  color: gray;
}
</style>