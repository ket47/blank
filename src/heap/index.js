import { createStore } from 'vuex'
const heap = createStore({
    state() {
        return {
            hostname: "https://tezkel.local/",
            //hostname: "https://api.tezkel.com/",
            app_title: "Тезкель",
            user: {user_id: -1},
            deliverySettings:{
                courierVelocity:30000,// (30km/h),
                deliveryTimeDelta:5,//5minutes
                fee:120,
                defaultPreparationTime:15,//15 minutes
            },
            location:{
                mapBoundaries:[[ 45.068047847988005, 33.8779092284851 ],[ 44.907247740163136, 34.16767363278196 ]],
                mapCenter:[ 44.943863592382236, 34.094551210249215 ],//merkezi pazar amethansultan meydani
                ymapApiKey:"12d851cb-5290-4946-bf15-817cce1f96df",
                addressErase:"Россия, Республика Крым, "
            },
            currencySign:"₽"
        }
    }, 
    getters: {
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
        setUser (state, userData) {
            state.user = userData;
        },
        setUserMainLocation(state,mainLocation){
            state.user.location_main=mainLocation
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
        },

    }
});
heap.state.cartList=heap.getters.cartListRestore;
//heap.state.cartProductWatchList={};

heap.commit('cartWathcerPrepare',heap.state.cartList);
export default heap;