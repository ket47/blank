import jQuery from "jquery";
import store from '../store';

const Order = {
    isInited:false,
    init(){
        if(Order.isInited){
            return false;
        }
        Order.cart.listSync();
    },
    api:{
        itemCreate( request ){
            return jQuery.post( store.state.hostname + "Order/itemCreate", request );
        },
        listCartGet(){
            return jQuery.post( store.state.hostname + "Order/listCartGet" );
        },
        entryUpdate(entry){
            return jQuery.post( store.state.hostname + "Entry/itemUpdate", JSON.stringify(entry) );
        }
    },
    cart:{
        listSyncUp(){
            let promises=[];
            if( store.state.cartList && store.state.cartList.length ){
                for(let i in store.state.cartList){
                    let delay=null;
                    let cart=store.state.cartList[i];
                    if( cart.order_id<=0 ){
                        delay=Order.api.itemCreate(cart);
                    } else {
                        delay=Order.api.itemUpdate(cart);
                    }
                    promises.push(delay);
                }
            }
            return promises;
        },
        listSyncDown(){
            Order.api.listCartGet().done((cartList)=>{
                store.commit('cartListStore',cartList);
            });
        },
        listSync(){//shoul be called at user login
            if( store.getters.userIsLogged ){
                let upPromises=Order.cart.listSyncUp();
                Promise.all(upPromises).then(()=>{
                    Order.cart.listSyncDown();
                });
            }
        },
        listSave(){
            store.commit('cartListStore',store.state.cartList);
            Order.cart.listSync();
        },




        itemCreate(store_id,entries){
            let cart={
                order_store_id:store_id,
                order_id:-store_id,
                entries:entries||[]
            };
            store.state.cartList.push(cart);
            store.commit('cartListStore',store.state.cartList);
            return store_id;
        },
        entryQuantityGet(product_id){
            let entry=this.entryGet(product_id);
            if( !entry || !entry.data.product_quantity ){
                return 0;
            }
            return parseFloat(entry.data.product_quantity)||0;
        },
        entryGet(product_id){
            for(let i in store.state.cartList){
                if( !store.state.cartList[i].entries ){
                    return null;
                }
                for(let k in store.state.cartList[i].entries){
                    if(store.state.cartList[i].entries[k].product_id==product_id){
                        return {
                            data:store.state.cartList[i].entries[k],
                            order_index:i,
                            entry_index:k
                        };
                    }
                }
            }
            return null;
        },
        entrySave(store_id,product_id,product_quantity,productItem){
            if( Order.cart.entryUpdate(product_id,product_quantity) ){
                return true;
            }
            let entry={
                product_id,
                product_quantity,
                product_price:productItem.product_price,
                product_name:productItem.product_name
            };
            Order.cart.itemCreate(store_id,[entry]);
            Order.cart.listSave();
        },
        entryUpdate(product_id,product_quantity){
            let entry=Order.cart.entryGet(product_id);
            if(entry){
                store.state.cartList[entry.order_index].entries[entry.entry_index].product_quantity=product_quantity;
                store.commit('cartListStore',store.state.cartList);
                if( entry.entry_id ){
                    Order.api.entryUpdate(entry);
                }
                return true;
            }
            return false;
        }
    },




    


























/*
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
      },*/
    
}
export default Order;