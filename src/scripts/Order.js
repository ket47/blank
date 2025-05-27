import jQuery from "jquery";
import heap from '@/heap';
import Topic from '@/scripts/Topic.js'
import Utils from '@/scripts/Utils.js'

const Order = {
    api:{
        async itemPreGet(order_id){
            const debounce=500
            return await Utils.prePost( heap.state.hostname + "Order/itemGet",{order_id},debounce );
        },
        async itemGet(order_id){
            const debounce=500
            const order= await Utils.post( heap.state.hostname + "Order/itemGet",{order_id},debounce )
            if( order.stage_current=='customer_cart' && order.owner_id==heap.state.user.user_id ){
                const cart={
                    order_store_id:order.order_store_id,
                    order_id:order.order_id,
                    entries:order.entries,
                    user_role:order.user_role,
                    stage_current:'customer_cart',
                    stage_current_name:order.stage_current_name,
                    stage_next:order.stage_next,
                    store:{store_name:order.store.store_name},
                    created_at:order.created_at
                }
                Order.cart.itemSet(cart)//fill local cart with reduced remote version
            } else if(order?.order_store_id){
                Order.cart.itemDelete(order.order_id)//delete cart from device if order is at another stage
            }
            return order
        },
        async itemUpdate(order){
            return jQuery.post( heap.state.hostname + "Order/itemUpdate", JSON.stringify(order) );
        },
        async itemSync( cart ){
            const order={
                order_id:cart.order_id,
                order_store_id:cart.order_store_id,
                order_description:cart.order_description,
                entries:cart.entries
            };
            return jQuery.post( heap.state.hostname + "Order/itemSync", JSON.stringify(order) );
        },
        async itemStageCreate(order_id,new_stage){
            try{
                return jQuery.post( heap.state.hostname + "Order/itemStageCreate",{order_id,new_stage} );
            }
            catch(err){/** */}
        },
        async listCartGet(){
            return jQuery.post( heap.state.hostname + "Order/listCartGet" );
        },
        async listLoad(request){
            const list = await jQuery.post( heap.state.hostname + "Order/listGet",request );
            if(request.order_group_type=='active_only'){
                let activeOrderCount=0;
                for(let i in list){
                    if(list[i].stage_current!='customer_cart'){
                        activeOrderCount++
                    }
                }
                Topic.publish('activeOrderCountChanged',activeOrderCount)
            }
            return list
        },
        async listCount(){
            return await jQuery.post( heap.state.hostname + "Order/listCountGet" );
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
        async itemJobTrack( order_id ){
            return jQuery.post( heap.state.hostname + "Courier/itemJobTrack", {order_id} );
        },

        async entrySave(entry,order_id){
            if( entry.entry_id ){
                if( entry.entry_quantity==0 ){
                    return this.entryDelete(entry.entry_id);
                }
                entry.order_id=order_id
                return this.entryUpdate(entry);
            }
            return this.entryCreate(entry,order_id);
        },
        async entryCreate(entry,order_id){
            const request={
                order_id,
                product_id:entry.product_id,
                product_quantity:entry.entry_quantity
            };
            const response=await jQuery.post( heap.state.hostname + "Entry/itemCreate", request );
            Topic.publish('orderSumChanged',order_id)
            return response
        },
        async entryUpdate(entry){
            const request={
                order_id:entry.order_id,
                entry_id:entry.entry_id,
                entry_quantity:entry.entry_quantity
            }
            const response=await jQuery.post( heap.state.hostname + "Entry/itemUpdate", JSON.stringify(request) );
            Topic.publish('orderSumChanged',null)
            return response
        },
        async entryDelete(entry_id){
            const response=await jQuery.post( heap.state.hostname + "Entry/itemDelete", {entry_id} );
            Topic.publish('orderSumChanged',null)
            return response
        }
    },
    doc:{
        async entrySave( order_store_id, entry, order ){
            if(order?.order_id>0 && entry?.entry_id){
                return await Order.api.entrySave(entry,order.order_id);
            }
            return await Order.cart.entrySave(order_store_id,entry);
        },
    },
    cart:{
        listSave(){
           heap.commit('cartListStore',heap.state.cartList);
        },
        listTotalGet(){
            let total=0;
            for(let i in heap.state.cartList){
                for(let k in heap.state.cartList[i].entries){
                const entry=heap.state.cartList[i].entries[k];
                if( !entry || !entry.entry_quantity || !entry.entry_price ){
                    continue;
                }
                total+= (entry.entry_quantity) * (entry.entry_price);
                }
            }
            return Math.round(total);
        },

        async itemSync(order_id){
            const order=Order.cart.itemGetById(order_id);
            try{
                const syncedOrder = await Order.api.itemSync(order?.data);
                heap.state.cartList[order?.order_index]=syncedOrder;
                Order.cart.listSave();
                return syncedOrder;
            }
            catch{/** */}
        },

        itemGetByStoreId(store_id){
            for(let i in heap.state.cartList){
                if( heap.state.cartList[i].order_store_id==store_id && heap.state.cartList[i].stage_current!='customer_deleted' ){
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
                if( heap.state.cartList[i].order_id==order_id && heap.state.cartList[i].stage_current!='customer_deleted' ){
                    return {
                        data:heap.state.cartList[i],
                        order_index:i,
                    };
                }
            }
            return null;
        },
        itemSet(order){
            const existingOrder=this.itemGetByStoreId(order.order_store_id);
            if( existingOrder ){
                heap.state.cartList[existingOrder.order_index]=order
            } else{
                heap.state.cartList.push(order)
            }
            Order.cart.listSave();
        },
        itemSave(store_id,entries){
            if(Order.cart.itemUpdate(store_id,entries)){
                return true;
            }
            return Order.cart.itemCreate(store_id,entries);
        },
        async itemCreate(store_id,entries){
            let store=null
            if( heap.state.currentStore && heap.state.currentStore.store_id== store_id ){
                store=heap.state.currentStore;
            } else {
                try{
                    store=await jQuery.get(heap.state.hostname+'Store/itemGet',{store_id,mode:'basic'})
                }catch{/** */}
            }
            this.itemCreateTomorrowAlert(store)
            const date=new Date();
            const cart={
                order_store_id:store_id,
                order_id:-store_id,
                store:{store_name:store.store_name},
                entries:entries||[],
                created_at:date.toISOString().replace(/[T]/g,' ').replace(/.\d\d\dZ/,''),
                stage_next:{
                    "customer_confirmed": ["Перейти к оформлению"],
                    "customer_deleted": ["Удалить","medium","clear"],
                },
                stage_current:'customer_cart',
                user_role:'customer',
            };
            heap.state.cartList.push(cart);
            Order.cart.listSave();
            return store_id;
        },
        itemCreateTomorrowAlert(store){
            const date=new Date()
            const dayMinutes=date.getMinutes()
            if( store.is_working!=1 || store.is_disabled==1 || store[`store_time_closes`]==null ){
                //not working
                alert(`"${store.store_name}" сегодня не работает.\n\nВы можете оформить заказ в другом заведении`)
                return
            }
            const marginMinutes=40

            const openHour=store[`store_time_opens`]*1
            const closeHour=store[`store_time_closes`]*1
            const nowHour=date.getHours()
            const leftHour=closeHour-1-nowHour
            if( closeHour<openHour || leftHour>0 || leftHour==0 && (60-marginMinutes > dayMinutes)){
                // no need to alert
                return
            }
            if( closeHour )
                //alert in margin
                alert(`"${store.store_name}" закрывается в ${closeHour}, сможем доставить на следующий день.\n\nВы можете оформить заказ в другом заведении`)
        },
        itemUpdate(store_id,entries=null,properties=null){
            const existingOrder=this.itemGetByStoreId(store_id);
            if( existingOrder ){
                if(entries){
                    heap.state.cartList[existingOrder.order_index].entries=existingOrder.data.entries.concat(entries||[]);
                }
                if(properties){//here we copying properties to order
                    for(let i in properties){
                        heap.state.cartList[existingOrder.order_index][i]=properties[i]
                    }
                }
                Order.cart.listSave();
                return true;
            }
            return false;
        },
        itemDelete(order_id,mode){
            const existingOrder=this.itemGetById(order_id);
            if( existingOrder ){
                if(existingOrder.data.order_id>0 && mode=='purge_on_server'){
                    Order.api.itemStageCreate(existingOrder.data.order_id,'customer_deleted')
                }
                heap.state.cartList.splice(existingOrder.order_index,1);
                Order.cart.listSave();
                return true;
            }
            return false;
        },


        entryQuantityGet(product_id){
            const entry=Order.cart.entryGet(product_id);
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
        async entrySave(store_id,entry){
            const existingOrder=Order.cart.itemGetByStoreId(store_id);
            if( !existingOrder ){
                Order.cart.itemCreate(store_id,[entry]);
                return true;
            }
            if( entry.entry_quantity==0 ){
                Order.cart.entryDelete(entry.product_id);
                return true;
            }
            if( await Order.cart.entryUpdate(entry) ){
                return true;
            }
            return Order.cart.entryCreate(entry,existingOrder);
        },
        entryCreate(entry,existingOrder){
            if( entry.is_disabled==1 || entry.deleted_at ){
                return false
            }
            heap.state.cartList[existingOrder.order_index].entries.push(entry);
            Order.cart.listSave();
            return true;
        },
        async entryUpdate(entry){
            const entryOld=Order.cart.entryGet(entry.product_id);
            if( !entryOld ){
                return false;
            }
            const entryNew=Object.assign(entryOld.data,entry);
            heap.state.cartList[entryOld.order_index].entries[entryOld.entry_index]=entryNew;
            Order.cart.listSave();
            if(entryNew.entry_id){
                try{
                    await Order.api.entryUpdate(entry);
                } catch{/** */}
            }
            return entryNew;
        },
        entryDelete(product_id){
            const entryOld=Order.cart.entryGet(product_id);
            heap.state.cartList[entryOld?.order_index].entries.splice(entryOld?.entry_index,1);
            if(heap.state.cartList[entryOld?.order_index].entries.length==0){
                heap.state.cartList.splice(entryOld?.order_index,1);
            }
            Order.cart.listSave();
        }
    }
}
export default Order;