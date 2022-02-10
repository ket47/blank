import { createStore } from 'vuex'


var user = {user_id: false};
var sessionId = false;
if(localStorage.sessionId){
    sessionId = localStorage.sessionId;
}
var cart = {
    orders: [],
    totals: {
        sum: 0,
        total: 0
    }
}
if(localStorage.tezkelCart){//?????
    cart = JSON.parse(localStorage.tezkelCart);
}
// if(localStorage.cartList){//?????
//     cartList = JSON.parse(localStorage.cartList);
// }

const store = createStore({
    state() {
        return {
            hostname: "https://tezkel.local/",
            app_title: "Тезкель",
            sessionId: sessionId,
            errorMessage: false,
            user: user,
            cart: cart,//???
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
        cartGet(state){//?????
            return state.cart;
        },
        cartListRestore(){
            const cartLastDays=3;
            let date=new Date();
            date.setDate(date.getDate()-cartLastDays)
            let older=date.toISOString();
            let cartList=[];
            if(localStorage.cartList){
                cartList = JSON.parse(localStorage.cartList);
            }
            if(cartList && cartList.length){
                for(let order_id in cartList){
                    if(cartList[order_id] && cartList[order_id].created_at<older ){
                        delete cartList[order_id];
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
        setCart (state, cart) {//????
            state.cart = cart;
            localStorage.tezkelCart = JSON.stringify(cart);
        },
        cartListStore(state, cartList){
            state.cartList=cartList;
            localStorage.cartList = JSON.stringify(cartList);
        }
    }
});
store.state.cartList=store.getters.cartListRestore;
export default store;