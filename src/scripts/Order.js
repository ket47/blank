
import jQuery from "jquery";
import store from '../store';

const Order = {
    getUserOrders: function(mode){
        var group_ids = '';
        if(mode == 'cart'){
            group_ids = '24,32';
        }
        var self = this;
        jQuery.post( store.state.hostname + "Order/listGet", {order_group_id: group_ids} )
            .done(function(order_list) {
                for(var i in order_list){
                    self.getOrderDetails(order_list[i].order_id);
                }
            })
            .fail();
    },
    getOrderDetails: function(order_id){
        jQuery.post( store.state.hostname + "Order/itemGet", {order_id: order_id})
            .done(function(order) {
                var order_index = Object.keys(store.state.cart.orders).find(key => store.state.cart.orders[key].order_store_id === order.order_store_id);
                if(order_index && order_index !== false){
                    store.state.cart.orders[order_index] = order;
                    store.commit('setCart', store.state.cart);
                } else {
                    console.log(store.state.cart);
                    store.state.cart.orders.push(order);
                    store.commit('setCart', store.state.cart);
                }
                
            })
            .fail();
    },
    orderCreate(store_id, callback){
        jQuery.post( store.state.hostname + "Order/itemCreate", {order_store_id: store_id})
          .done(function(order_id) {
              return callback(order_id);
          })
          .fail(function() {
              return callback(false);
        });
      },
      orderGet(order_id, callback){
        jQuery.post( store.state.hostname + "Order/itemGet", {order_id: order_id})
          .done(function(order) {
              return callback(order);
          })
          .fail(function() {
              return callback({});
        });
      },
      orderProductCreate(order_id, product, callback){
        jQuery.post( store.state.hostname + "Entry/itemCreate", {order_id: order_id, product_id: product.product_id, product_quantity: product.product_quantity})
          .done(function(entry_id) {
              return callback(entry_id);
          })
          .fail(function() {
              return callback(false);
        });
      },
      orderProductUpdate(product, callback){
        jQuery.post( store.state.hostname + "Entry/itemUpdate", JSON.stringify(product))
          .done(function(ok) {
              return callback(ok);
          })
          .fail(function() {
              return callback(false);
        });
      },
      orderProductDelete(entry_id, callback){
        jQuery.post( store.state.hostname + "Entry/itemDelete", {entry_id: entry_id})
          .done(function(ok) {
              return callback(ok);
          })
          .fail(function() {
              return callback(false);
        });
      },
    
}

export default Order;