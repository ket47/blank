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
if(localStorage.tezkelCart){
    cart = JSON.parse(localStorage.tezkelCart);
}

const store = createStore({
    state() {
        return {
            hostname: "https://api.tezkel.com/",
            sessionId: sessionId,
            errorMessage: false,
            user: user,
            cart: cart
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
        cartGet(state){
            return state.cart;
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
        setcurrentStore (state, storeData) {
            state.currentStore = storeData;
        },
        setCart (state, cart) {
            state.cart = cart;
            localStorage.tezkelCart = JSON.stringify(cart);
        }
    }
});

export default store;