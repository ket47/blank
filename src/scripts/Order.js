import jQuery from "jquery";
import heap from '../heap';
import Topic from "@/scripts/Topic";

const Order = {
    isInited:false,
    init(){
        if(Order.isInited){
            return false;
        }
        // if( heap.getters.userIsLogged ){
        //     //Order.cart.listSync();
        // }
        this.isInited=true;
    },
    // apiInteractionDelay:null,
    // apiDelayedExecute( job ){
    //     clearTimeout(Order.apiInteractionDelay);
    //     Order.apiInteractionDelay=setTimeout(job,500);
    // },
    api:{
        async itemGet(order_id){
            return jQuery.post( heap.state.hostname + "Order/itemGet",{order_id} );
        },
        async itemSync( cart ){
            let order={
                order_id:cart.order_id,
                order_store_id:cart.order_store_id,
                order_description:cart.order_description,
                entries:cart.entries
            };
            return jQuery.post( heap.state.hostname + "Order/itemSync", JSON.stringify(order) );
        },
        async itemStageCreate(order_id,new_stage){
            return jQuery.post( heap.state.hostname + "Order/itemStageCreate",{order_id,new_stage} );
        },
        async listCartGet(){
            return jQuery.post( heap.state.hostname + "Order/listCartGet" );
        },
        async listLoad(order_group_type){
            return jQuery.post( heap.state.hostname + "Order/listGet",{order_group_type} );
        },
        async listJobGet( courier_id ){
            return jQuery.post( heap.state.hostname + "Courier/listJobGet", {courier_id} );
        },
        async itemJobGet( order_id ){
            return jQuery.post( heap.state.hostname + "Courier/itemJobGet", {order_id} );
        },
        async itemJobStart( order_id,courier_id ){
            return jQuery.post( heap.state.hostname + "Courier/itemJobStart", {order_id,courier_id} );
        },


        async entrySave(entry,order_id){
            if( entry.entry_id ){
                if( entry.entry_quantity==0 ){
                    return this.entryDelete(entry.entry_id);
                }
                return this.entryUpdate(entry);
            }
            return this.entryCreate(entry,order_id);
        },
        async entryCreate(entry,order_id){
            let request={
                order_id,
                product_id:entry.product_id,
                product_quantity:entry.entry_quantity
            };
            return jQuery.post( heap.state.hostname + "Entry/itemCreate", request );
        },
        async entryUpdate(entry){
            return jQuery.post( heap.state.hostname + "Entry/itemUpdate", JSON.stringify(entry) );
        },
        async entryDelete(entry_id){
            return jQuery.post( heap.state.hostname + "Entry/itemDelete", {entry_id} );
        }
    },
    doc:{
        entrySave( order_store_id, entry, order ){
            //const cart_entry=Order.cart.entryGet(entry.product_id);
            if(order?.order_id>0 && entry?.entry_id){
                return Order.api.entrySave(entry,order.order_id);
            }
            return Order.cart.entrySave(order_store_id,entry);
        },
    },



    cart:{
        listSave(){
           heap.commit('cartListStore',heap.state.cartList);
        },

        async itemSync(order_id){
            const order=Order.cart.itemGetById(order_id);
            try{
                const syncedOrder = await Order.api.itemSync(order.data);
                heap.state.cartList[order.order_index]=syncedOrder;
                Order.cart.listSave();
                return syncedOrder;
            }
            catch( e ){
                console.error('itemSync errrrror',e);
            }
        },

        itemGetByStoreId(store_id){
            for(let i in heap.state.cartList){
                if( heap.state.cartList[i].order_store_id==store_id && heap.state.cartList[i].stage_current!='customer_purged' ){
                    return {
                        data:heap.state.cartList[i],
                        order_index:i,
                    };
                }
            }
            return null;
        },
        itemGetById(order_id){
            for(let i in heap.state.cartList){
                if( heap.state.cartList[i].order_id==order_id && heap.state.cartList[i].stage_current!='customer_purged' ){
                    return {
                        data:heap.state.cartList[i],
                        order_index:i,
                    };
                }
            }
            return null;
        },
        itemSave(store_id,entries){
            if(Order.cart.itemUpdate(store_id,entries)){
                return true;
            }
            return Order.cart.itemCreate(store_id,entries);
        },
        itemCreate(store_id,entries){
            let store_name='';
            if( heap.state.currentStore && heap.state.currentStore.store_id== store_id ){
                store_name=heap.state.currentStore.store_name;
            }
            let date=new Date();
            let cart={
                order_store_id:store_id,
                order_id:-store_id,
                store:{store_name:store_name},
                entries:entries||[],
                created_at:date.toISOString().replace(/[T]/g,' ').replace(/.\d\d\dZ/,''),
                stage_next:{
                    "customer_confirmed": ["Подтвердить заказ"],
                    "customer_purged": ["Удалить","negative"]
                },
            };
            heap.state.cartList.push(cart);
            Order.cart.listSave();
            return store_id;
        },
        itemUpdate(store_id,entries){
            let existingOrder=this.itemGetByStoreId(store_id);
            if( existingOrder ){
                heap.state.cartList[existingOrder.order_index].entries=existingOrder.data.entries.concat(entries||[]);
                Order.cart.listSave();
                return true;
            }
            return false;
        },
        itemDelete(order_id){
            let existingOrder=this.itemGetById(order_id);
            if( existingOrder ){
                heap.state.cartList.splice(existingOrder.order_index,1);
                Order.cart.listSave();
                return true;
            }
            return false;
        },


        entryQuantityGet(product_id){
            let entry=Order.cart.entryGet(product_id);
            if( !entry || !entry.data.entry_quantity ){
                return 0;
            }
            return parseFloat(entry.data.entry_quantity)||0;
        },
        entryGet(product_id){
            for(let i in heap.state.cartList){
                if( !heap.state.cartList[i].entries || heap.state.cartList[i].stage_current=='customer_deleted' ){
                    return null;
                }
                for(let k in heap.state.cartList[i].entries){
                    if(heap.state.cartList[i].entries[k].product_id==product_id){
                        return {
                            data:heap.state.cartList[i].entries[k],
                            order_index:i,
                            entry_index:k
                        };
                    }
                }
            }
            return null;
        },
        entrySave(store_id,entry){
            let existingOrder=Order.cart.itemGetByStoreId(store_id);
            if( !existingOrder ){
                Order.cart.itemCreate(store_id,[entry]);
                return true;
            }
            if( entry.entry_quantity==0 ){
                Order.cart.entryDelete(entry.product_id);
                return true;
            }
            if( Order.cart.entryUpdate(entry) ){
                return true;
            }
            return Order.cart.entryCreate(entry,existingOrder);
        },
        entryCreate(entry,existingOrder){
            heap.state.cartList[existingOrder.order_index].entries.push(entry);
            Order.cart.listSave();
            return true;
        },
        async entryUpdate(entry){
            let entryOld=Order.cart.entryGet(entry.product_id);
            if( !entryOld ){
                return false;
            }
            let entryNew=Object.assign(entryOld.data,entry);
            heap.state.cartList[entryOld.order_index].entries[entryOld.entry_index]=entryNew;
            Order.cart.listSave();
            if(entryNew.entry_id){
                try{
                    await Order.api.entryUpdate(entry);
                } catch(err){
                    console.log('entryUpdate error',err);
                }
            }
            return entryNew;
        },
        entryDelete(product_id){
            let entryOld=Order.cart.entryGet(product_id);
            heap.state.cartList[entryOld.order_index].entries.splice(entryOld.entry_index,1);
            if(heap.state.cartList[entryOld.order_index].entries.length==0){
                heap.state.cartList.splice(entryOld.order_index,1);
            }
            Order.cart.listSave();
        }
    },
    async itemStageCreate(order_id,new_stage){
        if(new_stage=='customer_purged'){
            return Order.cart.itemDelete(order_id);
        }
        try{
            const syncedOrder=await Order.cart.itemSync(order_id);
            const stateChangeResult=await Order.api.itemStageCreate(syncedOrder.order_id,new_stage);
            
            if(stateChangeResult=='ok' && new_stage!='customer_cart'){
                console.log(stateChangeResult,new_stage);
                Order.cart.itemDelete(syncedOrder.order_id);
            }
            //go to order view
        } catch( err ){
            console.error(err);
        }

    }
}



Topic.on('userGet',(userData)=>{
    //Order.cart.listSync();
    //console.log(userData);
});
  
  
export default Order;