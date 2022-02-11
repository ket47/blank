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
        itemFilter(cart){
            return {
                order_id:cart.order_id,
                order_store_id:cart.order_store_id,
                order_description:cart.order_description,
                entries:cart.entries
            };
        },
        itemCreate( cart ){
            let order=this.itemFilter(cart);
            return jQuery.post( store.state.hostname + "Order/itemCreate", order );
        },
        itemUpdate( cart ){
            let order=this.itemFilter(cart);
            return jQuery.post( store.state.hostname + "Order/itemUpdate", JSON.stringify(order) );
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
            //Order.cart.listSync();
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
        itemSave(store_id,entries){
            let existingOrder=this.itemGetByStoreId(store_id);

            console.log('itemSave',existingOrder);


            let cartList=store.state.cartList;
            if( existingOrder ){
                cartList[existingOrder.order_index].entries=existingOrder.data.entries.concat(entries||[]);
                store.commit('cartListStore',cartList);
                return true;
            }
            return this.itemCreate(store_id,entries);
        },
        itemGetByStoreId(store_id){
            for(let i in store.state.cartList){
                if( store.state.cartList[i].order_store_id==store_id ){
                    return {
                        data:store.state.cartList[i],
                        order_index:i,
                    };
                }
            }
            return null;
        },
        entryQuantityGet(product_id){
            let entry=this.entryGet(product_id);
            if( !entry || !entry.data.entry_quantity ){
                return 0;
            }
            return parseFloat(entry.data.entry_quantity)||0;
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
        entrySave(store_id,entry){
            if( Order.cart.entryUpdate(entry) ){
                return true;
            }
            Order.cart.itemSave(store_id,[entry]);
            Order.cart.listSave();
        },
        entryUpdate(entry){
            let entryOld=Order.cart.entryGet(entry.product_id);
            if(entryOld){
                entry=Object.assign(entryOld.data,entry);
                store.state.cartList[entryOld.order_index].entries[entryOld.entry_index]=entry;
                store.commit('cartListStore',store.state.cartList);
                if( entry.entry_id ){
                    Order.api.entryUpdate(entry);
                }
                return true;
            }
            return false;
        }
    }
}
export default Order;