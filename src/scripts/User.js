
import jQuery from "jquery";
import heap from '../heap';
import Order from '@/scripts/Order';

const User = {
    get: function(callback){
        jQuery.post( heap.state.hostname + "User/itemGet")
        .done(function(response, textStatus, request){
            var sid = request.getResponseHeader('x-sid');
            heap.commit('setSessionId', sid);
            heap.commit('setUser', response);
            jQuery.ajaxSetup({ 
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('x-sid',  sid);
                }
            })
            Order.cart.listSync();
            return callback({success: true, message: ''});
        })
        .fail(function(err) {
            return callback({success: false, message: err});
        });
    },
    signIn: function(requestData, callback){
        jQuery.post( heap.state.hostname + "User/signIn", requestData)
        .done(function() {
            localStorage.signInData = JSON.stringify(requestData);
            return callback({success: true, message: ''});
        })
        .fail(function(err) {
            return callback({success: false, message: err});
      });
    },
    signOut: function(callback){
        jQuery.post( heap.state.hostname + "User/signOut", {})
        .done(function() {
            localStorage.removeItem('signInData');
            heap.commit('setUser', {user_id: false});
            heap.commit('setSessionId', false);
            return callback({success: true, message: ''});
        })
        .fail(function(err) {
            return callback({success: false, message: err});
      });
    },
    signUp: function(requestData, callback){
        jQuery.post( heap.state.hostname + "User/signUp", requestData)
        .done(function() {
            return callback({success: true, message: ''});
        })
        .fail(function(err) {
            return callback({success: false, message: err});
      });
    },
    isOnline:function(){
        return 1;//should check connection and login status
    }
}

export default User;