import { createStore } from 'vuex'
const heap = createStore({
    state() {
        let hostname=localStorage.hostname || "https://api.tezkel.com/"
        return {
            hostname,
            user: {user_id: -1},
            settings:null,
            currencySign:"₽",
            isInteractingWithServer:0
        }
    }, 
    getters: {
        hostname(state){
            return state.hostname;
        },
        userIsLogged(state){
            return state.user.user_id > 0;
        },
        isOnline(state){
            const isConnected=1;
            return (state.user.user_id > 0) && isConnected;
        },
        cartListRestore(){
            const cartLastDays=30;
            const date=new Date();
            date.setDate(date.getDate()-cartLastDays)
            const older=date.toISOString().replace(/[T]/g,' ').replace(/.\d\d\dZ/,'');
            const cartList=[];
            let cartListUnfiltered=[];
            if(localStorage.cartList){
                cartListUnfiltered = JSON.parse(localStorage.cartList);
            }
            if(cartListUnfiltered && cartListUnfiltered.length){
                for(const cart of cartListUnfiltered){
                    if( cart && cart.created_at>older && cart.order_store_id ){
                        cartList.push(cart);
                    }
                }
            }
            return cartList;
        }
    },
    mutations: {
        setUser (state, userData) {
            state.user = userData;
        },
        setSettings (state, settingsData) {
            state.settings = settingsData;
        },
        setUserMainLocation(state,mainLocation){
            state.user.location_main=mainLocation
        },
        setCurrentStore (state, storeData) {
            state.currentStore = storeData;
        },
        setCurrentOrder(state, orderData){
            state.currentOrder = orderData;
        },
        setInteractionStatus(state,done_undone){
            state.isInteractingWithServer += done_undone;
        },
        cartListStore(state, cartList){
            state.cartList=cartList;
            localStorage.cartList = JSON.stringify(cartList);
            this.commit('cartWathcerPrepare',cartList);
        },
        cartWathcerPrepare(state,cartList){
            const watcher={};
            for(const cart of cartList){
                for(const entry of cart.entries){
                    watcher[entry.product_id]=entry.entry_quantity;
                }
            }
            state.cartProductWatchList=watcher;
        },

    }
});
heap.state.cartList=heap.getters.cartListRestore;
//heap.state.cartProductWatchList={};

heap.commit('cartWathcerPrepare',heap.state.cartList);
export default heap;