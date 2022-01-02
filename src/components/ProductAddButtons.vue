<template>
    <div class="product-actions" v-if="productItem.product_quantity > 0">
      <ion-button @click="addToCart(productItem, 1)" size="small" color="light">
        <ion-icon :icon="add"></ion-icon>
      </ion-button>
      <ion-label  v-show="getCartProductQuantity(productItem) || expanded"  class="product-quantity">{{ getCartProductQuantity(productItem) }}</ion-label>
      <ion-button v-show="getCartProductQuantity(productItem) || expanded"  @click="addToCart(productItem, -1)"  size="small" color="light">
        <ion-icon :icon="remove"></ion-icon>
      </ion-button>
    </div>
</template>

<script>

import { add, remove } from 'ionicons/icons';
import store from '../store';
import OrderScript from '../scripts/Order.js';

export default  {
  setup() {
    return {
      add,
      remove
    }
  },
  props:['productItem', 'expanded', 'storeData', 'callback'],
  data() {
    return { 
      currentOrderId: 0,
      error: "",
    };
  },
  methods: {
      addToCart(product, quantity){
        var self = this;
        this.checkOrders(product, function(){
            self.productAdd(product, quantity, function(){
              OrderScript.getUserOrders();
              if(self.callback){
                return self.callback();
              }
            });
        });
      },
      checkOrders(product, callback){
        var store_id = product.store_id;
        var order_object = {
          order_id: 0,
          order_sum_total: 0,
          order_store_id: store_id,
          stage_next: {
            customer_deleted: ['Удалить', 'negative'],
            customer_confirmed: ['Подтвердить']
          },
          store_name: (this.storeData) ? this.storeData.store_name : '',
          entries: []
        };
        var self = this;
        var order_index = Object.keys(store.state.cart.orders).find(key => store.state.cart.orders[key].order_store_id === store_id);

        //var order_group_id = store.state.cart.orders[order_index].order_group_id;
        if(product.order_id){
          this.currentOrderId = product.order_id;
          return callback(true);
        }
        if(!order_index){
          OrderScript.orderCreate(store_id, function(order_id){
            if(order_id){
              self.currentOrderId = order_id;
              order_object.order_id = order_id;
            } 
            store.state.cart.orders.push(order_object);
            store.commit('setCart', store.state.cart);
            return callback(true);
          });
        } else {
          this.currentOrderId = store.state.cart.orders[order_index].order_id;
          return callback(false);
        }
      },
      
      productAdd(product, quantity, callback){
        var entry = {
          entry_id: 0,
          order_id: 0,
          product_id: product.product_id,
          entry_text: product.product_name,
          entry_price: product.product_final_price,
          entry_quantity: quantity,
          entry_sum: product.product_final_price * quantity
        };
        var store_index = Object.keys(store.state.cart.orders).find(key => store.state.cart.orders[key].order_store_id === product.store_id);
        if(!store_index){
          store_index = Object.keys(store.state.cart.orders).find(key => store.state.cart.orders[key].order_id === product.order_id);
        }
        var order = store.state.cart.orders[store_index];
        var product_index = Object.keys(order.entries).find(key => order.entries[key].product_id === product.product_id);
        if(order.entries[product_index]){
          entry = order.entries[product_index];
          entry.entry_quantity = entry.entry_quantity*1 + quantity;
          if(entry.entry_quantity <= 0){
            OrderScript.orderProductDelete(entry.entry_id, function(result){
              if(result){
                delete store.state.cart.orders[store_index].entries[product_index];
                store.commit('setCart', store.state.cart);
                return callback(true);
              }
            });
          } else {
            OrderScript.orderProductUpdate(entry, function(result){
              if(result){
                store.state.cart.orders[store_index].entries[product_index] = entry;
                store.commit('setCart', store.state.cart);
                return callback(true);
              } else {
                entry.entry_quantity = entry.entry_quantity*1 - quantity;
                store.state.cart.orders[store_index].entries[product_index] = entry;
                store.commit('setCart', store.state.cart);
                return callback(false);
              }
            });
          }
        } else {
          entry.order_id = store.state.cart.orders[store_index].order_id;
          OrderScript.orderProductCreate(store.state.cart.orders[store_index].order_id, entry, function(entry_id){
            if(entry_id){
              entry.entry_id = entry_id;
              store.state.cart.orders[store_index].entries.push(entry);
              store.commit('setCart', store.state.cart);
              return callback(true);
            } else {
              entry.entry_id = 0;
            }
          });
        }
      },
      getCartProductQuantity(product){
        if(!store.state.cart.orders || store.state.cart.orders.length == 0){
          return 0;
        }
        var store_index = Object.keys(store.state.cart.orders).find(key => store.state.cart.orders[key].order_store_id === product.store_id);
        if(!store_index){
          store_index = Object.keys(store.state.cart.orders).find(key => store.state.cart.orders[key].order_id === product.order_id);
        }
        var order = store.state.cart.orders[store_index];
        if(!order){
          return 0;
        }
        var product_index = Object.keys(order.entries).find(key => order.entries[key].product_id === product.product_id);
        if(store.state.cart.orders[store_index] && store.state.cart.orders[store_index].entries[product_index]){
          return store.state.cart.orders[store_index].entries[product_index].entry_quantity;
        }
        return 0;
      }
  }
}
</script>

<style>
.product-actions{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f4f5f8;
  border-radius: 10px;
  position: absolute;
  box-shadow: 1px 1px 5px #00000036;
  flex-flow: column;
  width: auto;
  left: 0;
  top: 0;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.product-actions .product-quantity{
  visibility: visible;
  padding: 5px;
}
.product-actions ion-button{
  --padding-bottom: 0;
  --padding-left: 0;
  margin: 0;
}
.product-actions ion-label{
  
}

</style>