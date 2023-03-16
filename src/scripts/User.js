
import jQuery from "jquery";
import heap  from '@/heap';
import Topic from '@/scripts/Topic';
//import Order from '@/scripts/Order';
import { Geolocation } from '@capacitor/geolocation';
import { alertController }  from '@ionic/vue';

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const User = {
    init(){
        this.geo.trackingStart();
        this.firebase.init()
    },
    async settingsGet(){
        const settings=await jQuery.get( heap.state.hostname + "User/itemSettingsGet")
        heap.commit('setSettings', settings);
        Topic.publish('settingsGet',settings);
    },
    async get( mode='all' ){
        if( !heap.state.settings ){
            await this.settingsGet()
        }
        const user=await jQuery.post( heap.state.hostname + "User/itemGet",{mode})
        .done(function(response, textStatus, request){
            const sid = request.getResponseHeader('x-sid');
            User.sessionIdUse(sid);
            if(mode=='full'){
                User.courier.data=response.courier
                User.courier.parseStatus()
                User.supplier.storeList=response.storeList
            }
            heap.commit('setUser', response);
            Topic.publish('userGet',response);
            User.geo.locationSelect()
        });
        if( user?.user_id>0 ){
            //Order.api.listCount()
        }
        if( User.isCourier() ){
            await User.courier.get();
        }
        return user;
    },
    async autoSignIn(){
        if(localStorage.sessionId){
            User.sessionIdUse(localStorage.sessionId);
        }
        let userData
        try{
            userData=await User.get();
        }catch{/** */}
        if( userData?.user_id>1 ){
            return userData;
        }
        const signInCredentials=JSON.parse(localStorage.signInData??'{}');
        if( signInCredentials && signInCredentials.user_phone && signInCredentials.user_pass ){
            try{
                await User.signIn(signInCredentials);
            }catch{/** */}
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
        // if( !localStorage.metric_user_id ){
            
        // }
        requestData.metric_id=localStorage.metric_id??0
        return await jQuery.post( heap.state.hostname + "User/signIn", requestData)
        .done(function(response, textStatus, request){
            localStorage.signInData = JSON.stringify(requestData);
            const sid = request.getResponseHeader('x-sid');
            User.sessionIdUse(sid);
            if(requestData.metric_id){
                localStorage.metric_user_id=response
            }
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
    async signUp(requestData){
        return await jQuery.post( heap.state.hostname + "User/signUp", requestData)
    },
    isOnline(){
        return 1;//should check connection and login status
    },
    isAdmin(){
        const user_types=heap.state?.user?.member_of_groups?.group_types
        if( user_types?.indexOf('admin')>-1 ){
          return true
        }
        return false
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
    isSupplier(){
        return true
        // let user_types="";
        // try{
        //     user_types=heap.state.user.member_of_groups.group_types;
        // }catch{/** */}
        // if( user_types.indexOf('supplier')>-1 ){
        //   return true;
        // }
        // return false;
    },
    supplier:{
        //data:null,
        storeList:null,
        status:'notsupplier',
        async listGet(){
            this.storeList=null
            const user_id=heap.state?.user?.user_id??0
            if(user_id>0){
                const request={
                    owner_id:user_id,
                    owner_ally_ids:user_id,
                }
                try{
                    this.storeList=await jQuery.post(heap.state.hostname + "Store/listGet",request)
                    this.status='supplier'
                }catch{/** */}
            }
            Topic.publish('supplierStoreListGet',this.storeList);
            return this.storeList
        },
        async storeItemCreate(name){
            const user_id=heap.state?.user?.user_id??0
            if(user_id>0){
                return await jQuery.post(heap.state.hostname + "Store/itemCreate",{name})
            }
            return null
        }
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
        timeout:1000*60*60,
        lastPosition:{},
        async get(){
            try{
                await User.geo.permissionCheck();
                return Geolocation.getCurrentPosition();
            } catch(err){
                console.log('User.geo.get',err)
            }
        },
        async locationSelect(){
            let location_main=heap.state.user.location_main
            if( location_main.is_default==1 ){//IF we have only default location try to use devices geopositioning
                const permission=await User.geo.permissionCheck()
                if( permission=='granted' ){
                    User.geo.locationCurrentGet()
                    return;
                }
            }
            heap.commit('setUserMainLocation', location_main);
            Topic.publish('userMainLocationSet',location_main)
        },
        async locationCurrentGet(){
            const point=await User.geo.get()
            if( !point ){
                return null
            }
            const location_current={
                location_latitude:point.coords.latitude,
                location_longitude:point.coords.longitude,
                location_address:'Ваше местоположение',
                timestamp:point.timestamp
            }
            heap.commit('setUserCurrentLocation', location_current);
            Topic.publish('userCurrentLocationSet',location_current)
            User.geo.trackingStart()
        },
        async permissionPrompt(){
            const alert = await alertController.create({
                header: 'Местоположение',
                message:'Необходимо предоставить доступ к местоположению, чтобы искать около вас',
                buttons: [
                  {
                    text: 'Искать около меня',
                    role: 'confirm',
                  },
                  {
                    text: 'Отмена',
                    role: 'cancel',
                  },
                ],
            });
            await alert.present();
            const { role } = await alert.onDidDismiss();
            if( role=='confirm' ){
                User.geo.locationCurrentGet()
            }
        },
        async permissionCheck(){
            try{
                const result=await Geolocation.checkPermissions()
                return result.location
            } catch(err){
                console.log('User.geo.permissionCheck',err)
            }
            return null
            
        },
        async trackingStart(){
            const permission=await User.geo.permissionCheck();
            if( permission!='granted' ){
                return
            }
            User.geo.trackingStop();
            try{
                User.geo.clock=await Geolocation.watchPosition({timeout:User.geo.timeout},(position)=>{
                    const lat_shift_m=Math.abs(User.geo.lastPosition?.coords?.latitude-position?.coords?.latitude)/0.000009
                    const lon_shift_m=Math.abs(User.geo.lastPosition?.coords?.longitude-position?.coords?.longitude)/0.000009
                    const tolerance_m=1000
                    if( !position || (lat_shift_m<tolerance_m&&lon_shift_m<tolerance_m) ){
                        return;
                    }
                    if( User.geo.lastPosition?.coords && !position?.coords?.speed ){
                        return
                    }
                    User.geo.lastPosition=position;
                    const loc={
                        location_latitude:position.coords.latitude,
                        location_longitude:position.coords.longitude,
                        location_address:'Ваше местоположение',
                        timestamp:position.timestamp
                    }
                    heap.commit('setUserCurrentLocation', loc);
                    Topic.publish('userCurrentLocationSet',heap.state.user.location_current)
                });
            } catch(err){
                console.log('User.geo.trackingStart',err)
            }
        },
        trackingStop(){
            if( !User.geo.clock ){
                //return;
            }
            try{
                Geolocation.clearWatch({id:User.geo.clock});
            }
            catch(err){
                console.log('User.geo.trackingStop',err)
            }
        }
    },
    firebase:{
        tokenSaved:false,
        tokenSavedClock:null,
        init(){
            Topic.on('userGet',(user)=>{
                if( (!User.firebase.tokenSaved) && user.user_id>0 && heap.state.settings.firebase ){//user signed in
                    initializeApp(heap.state.settings.firebase)

                    clearTimeout(User.firebase.tokenSavedClock)
                    User.firebase.tokenSavedClock=setTimeout(function(){
                        User.firebase.saveNotificationToken()
                    },2*1000)
                }
            })
        },
        async saveNotificationToken(){
            try{
                if(Notification.permission!='granted'){
                    return
                }
                const vapidKey=heap.state.settings.firebase.vapidKey
                const messaging = getMessaging();
                const token=await getToken(messaging, {vapidKey});
                const request={
                    type:'webpush',
                    registration_id:token,
                    user_agent:navigator.userAgent
                }
                await jQuery.post(`${heap.state.hostname}MessageSub/itemCreate`,request)
                User.firebase.tokenSaved=true;
            }catch(err){
                console.log('saveNotificationToken',err)
            }
        },
    }
}
User.init();
export default User;