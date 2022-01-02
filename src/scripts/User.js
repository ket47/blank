
import jQuery from "jquery";
import store from '../store';

const User = {
    get: function(callback){
        jQuery.post( store.state.hostname + "User/itemGet")
        .done(function(response, textStatus, request){
            var sid = request.getResponseHeader('x-sid');
            store.commit('setSessionId', sid);
            store.commit('setUser', response);
            jQuery.ajaxSetup({ 
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('x-sid',  sid);
                }
            })
            return callback({success: true, message: ''});
        })
        .fail(function(err) {
            return callback({success: false, message: err});
        });
    },
    signIn: function(requestData, callback){
        jQuery.post( store.state.hostname + "User/signIn", requestData)
        .done(function() {
            localStorage.signInData = JSON.stringify(requestData);
            return callback({success: true, message: ''});
        })
        .fail(function(err) {
            return callback({success: false, message: err});
      });
    },
    signOut: function(callback){
        jQuery.post( store.state.hostname + "User/signOut", {})
        .done(function() {
            localStorage.removeItem('signInData');
            store.commit('setUser', {user_id: false});
            store.commit('setSessionId', false);
            return callback({success: true, message: ''});
        })
        .fail(function(err) {
            return callback({success: false, message: err});
      });
    },
    signUp: function(requestData, callback){
        jQuery.post( store.state.hostname + "User/signUp", requestData)
        .done(function() {
            return callback({success: true, message: ''});
        })
        .fail(function(err) {
            return callback({success: false, message: err});
      });
    }
}

export default User;