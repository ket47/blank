
import jQuery from "jquery";
import heap  from '@/heap';
import Topic from '@/scripts/Topic';
import { Geolocation } from '@capacitor/geolocation';
import { toastController }  from '@ionic/vue';

const User = {
    init(){
        this.geo.trackingStart();
    },
    async get(){
        const user=await jQuery.post( heap.state.hostname + "User/itemGet")
        .done(function(response, textStatus, request){
            const sid = request.getResponseHeader('x-sid');
            User.sessionIdUse(sid);
            heap.commit('setUser', response);
            Topic.publish('userGet',response);
        });
        if( User.isCourier() ){
            await User.courier.get();
        }
        return user;
    },
    async autoSignIn(){
        if(localStorage.sessionId){
            User.sessionIdUse(localStorage.sessionId);
        }
        const userData=await User.get();
        if( userData?.user_id>1 ){
            return userData;
        }
        const signInCredentials=JSON.parse(localStorage.signInData??'');
        if( signInCredentials && signInCredentials.user_phone && signInCredentials.user_pass ){
            await User.signIn(signInCredentials);
            return await User.get();
        }
        return userData;
    },
    sessionIdUse(sid){
        localStorage.sessionId=sid;
        jQuery.ajaxSetup({ 
            beforeSend: function(xhr) {
                xhr.setRequestHeader('x-sid',  sid);
            }
        });
    },
    async signIn(requestData){
        return await jQuery.post( heap.state.hostname + "User/signIn", requestData)
        .done(function(response, textStatus, request){
            localStorage.signInData = JSON.stringify(requestData);
            const sid = request.getResponseHeader('x-sid');
            User.sessionIdUse(sid);
        })
        .fail(function(){
            localStorage.signInData = null;//user signin is failed should we reset localStorage.signInData????
        });
    },
    async signOut(){
        try{
            await User.courier.signOut();
            await jQuery.post( heap.state.hostname + "User/signOut")
            localStorage.removeItem('signInData');
            heap.commit('setUser', {user_id: -1});
            User.sessionIdUse(null);
            User.geo.trackingStop();
            return {user_id: -1};
        } catch{/** */}
    },
    signUp(requestData, callback){
        return jQuery.post( heap.state.hostname + "User/signUp", requestData)
        .then(function() {
            callback({success: true, message: ''});
        });
    },
    isOnline(){
        return 1;//should check connection and login status
    },
    isAdmin(){
        let user_types="";
        try{
            user_types=heap.state.user.member_of_groups.group_types;
        }catch{/** */}
        if( user_types.indexOf('admin')>-1 ){
          return true;
        }
        return false;
    },
    isCourier(){
        let user_types="";
        try{
            user_types=heap.state.user.member_of_groups.group_types;
        }catch{/** */}
        if( user_types.indexOf('courier')>-1 ){
          return true;
        }
        return false;
    },
    courier:{
        data:null,
        status:'notcourier',
        async get(){
            try{
                const data=await jQuery.post( heap.state.hostname + "Courier/itemGet")
                User.courier.data=data;
                User.courier.parseStatus();
                return data;
            }catch(err){
                User.courier.data=null;
            }
        },
        async updateStatus(new_status){
            if( !User.courier.data?.courier_id ){
                return 'ok';
            }
            const request={
                courier_id:User.courier.data.courier_id,
                group_type:new_status
            };
            const result=await jQuery.post( heap.state.hostname + "Courier/itemUpdateStatus",request);
            if(result=='ok'){
                User.courier.status=new_status;
                Topic.publish('courierStatusChange',User.courier.status);
            }
            return result;
        },
        parseStatus(){
            User.courier.status=User.courier.data?.member_of_groups?.group_types||"notcourier";
            Topic.publish('courierStatusChange',User.courier.status);
        },
        async signOut(){
            const result=await User.courier.updateStatus('idle');
            if( result=='ok' ){
                User.courier.data=null;
                Topic.publish('courierStatusChange','notcourier');
            }
            return result;
        }
    },
    geo:{
        clock:null,
        timeout:1000*60,
        lastPosition:{},
        async get(){
            await User.geo.permissionCheck();
            return Geolocation.getCurrentPosition();
        },
        async flash( message ){
            const toast = await toastController
              .create({
                message: message,
                duration: 2000,
                color:'dark'
              })
            return toast.present();
        },
        async permissionCheck(){
            const result=await Geolocation.checkPermissions();
            if(result.location=='granted' || result.coarseLocation=='granted'){
                return true;
            }
            User.geo.flash("Для правильной работы нужен доступ к местоположению устройства");
            return false;
        },
        async trackingStart(){
            if(!User.courier.data?.courier_id){
                return false;
            }
            await User.geo.permissionCheck();
            User.geo.trackingStop();
            User.geo.clock=await Geolocation.watchPosition({timeout:User.geo.timeout},(position)=>{
                if( !position || (
                    User.geo.lastPosition?.coords?.longitude==position?.coords?.longitude
                    &&
                    User.geo.lastPosition?.coords?.latitude==position?.coords?.latitude
                )){
                    return;
                }
                User.geo.lastPosition=position;
                const request={
                    location_longitude:position.coords.longitude,
                    location_latitude:position.coords.latitude,
                    location_holder_id:User.courier.data.courier_id,
                };
                if( request.location_holder_id && request.location_latitude && request.location_longitude ){
                    return jQuery.post( heap.state.hostname + "Courier/locationAdd",request);
                } else {
                    console.log('geolocation format error',request);
                }
            });
            console.log('trackingStart',User.geo.clock);
        },
        trackingStop(){
            if( !User.geo.clock ){
                return;
            }
            console.log('trackingStop',User.geo.clock);
            Geolocation.clearWatch({id:User.geo.clock});
        }
    }
}
User.init();
export default User;