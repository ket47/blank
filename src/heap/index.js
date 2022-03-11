import { createStore } from 'vuex'
var user = {user_id: -1};
var sessionId = null;
if(localStorage.sessionId){
    sessionId = localStorage.sessionId;
}
const heap = createStore({
    state() {
        return {
            hostname: "https://tezkel.local/",
            app_title: "Тезкель",
            sessionId: sessionId,
            errorMessage: false,
            user: user,
            deliverySettings:{
                courierVelocity:30000,// (30km/h),
                deliveryTimeDelta:5,//5minutes
                fee:120
            },
            currencySign:"₽"
        }
    }, 
    getters: {
        errorMessage(state){
            return state.errorMessage;
        },
        hostname(state){
            return state.hostname;
        },
        userIsLogged(state){
            return state.user.user_id > -1;
        },
        isOnline(state){
            const isConnected=1;
            return (state.user.user_id > -1) && isConnected;
        },
        cartListRestore(){
            const cartLastDays=30;
            let date=new Date();
            date.setDate(date.getDate()-cartLastDays)
            let older=date.toISOString().replace(/[T]/g,' ').replace(/.\d\d\dZ/,'');
            let cartList=[];
            let cartListUnfiltered=[];
            if(localStorage.cartList){
                cartListUnfiltered = JSON.parse(localStorage.cartList);
            }
            if(cartListUnfiltered && cartListUnfiltered.length){
                for(let cart of cartListUnfiltered){
                    if( cart && cart.created_at>older && cart.order_store_id ){
                        cartList.push(cart);
                    }
                }
            }
            return cartList;
        }
    },
    mutations: {
        setSessionId (state, sessionId) {
            state.sessionId = sessionId;
            if(!sessionId){
                localStorage.removeItem('sessionId');
                return;
            }
            localStorage.sessionId = sessionId;
        },
        setUser (state, userData) {
            state.user = userData;
        },
        setCurrentStore (state, storeData) {
            state.currentStore = storeData;
        },
        cartListStore(state, cartList){
            state.cartList=cartList;
            localStorage.cartList = JSON.stringify(cartList);
            this.commit('cartWathcerPrepare',cartList);
        },
        cartWathcerPrepare(state,cartList){
            let watcher={};
            for(let cart of cartList){
                for(let entry of cart.entries){
                    watcher[entry.product_id]=entry.entry_quantity;
                }
            }
            state.cartProductWatchList=watcher;
        }
    }
});
heap.state.cartList=heap.getters.cartListRestore;
//heap.state.cartProductWatchList={};

heap.commit('cartWathcerPrepare',heap.state.cartList);
export default heap;