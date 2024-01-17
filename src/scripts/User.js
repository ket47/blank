import jQuery                   from "jquery";
import heap                     from '@/heap';
import Topic                    from '@/scripts/Topic';
import Utils                    from '@/scripts/Utils';
import { Geolocation }          from '@capacitor/geolocation';
import { Device }               from '@capacitor/device'
import { loadYmap }             from "vue-yandex-maps";

import { initializeApp }        from "firebase/app";
import { 
    getMessaging, 
    getToken }                  from "firebase/messaging";

const User = {
    init(){
        //this.geo.switch();
        this.firebase.init()
        this.courier.init()
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
            User.geo.switch()
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
        const sessionId = await Utils.pref.get('sessionId')
        if(sessionId){
            User.sessionIdUse(sessionId);
        }        
        let userData
        try{
            userData=await User.get();
        }catch{/** */}
        if( userData?.user_id>1 ){
            return userData;
        }
        const signInData=await Utils.pref.get('signInData')
        const signInCredentials=JSON.parse(signInData||'{}');
        if( signInCredentials && signInCredentials.user_phone && signInCredentials.user_pass ){
            try{
                await User.signIn(signInCredentials);
            }catch{/** */}
            return await User.get();
        }
        return userData;
    },
    async sessionIdUse(sid){
        await Utils.pref.set('sessionId',sid)
        jQuery.ajaxSetup({ 
            beforeSend: function(xhr) {
                xhr.setRequestHeader('x-sid',  sid);
            }
        });
    },
    async signIn(requestData){
        const metric_id=await Utils.pref.get('metric_id')
        requestData.metric_id=metric_id??0
        return await jQuery.post( heap.state.hostname + "User/signIn", requestData)
        .done(async function(response, textStatus, request){
            await Utils.pref.set('signInData',JSON.stringify(requestData))
            const sid = request.getResponseHeader('x-sid');
            User.sessionIdUse(sid);
            if(requestData.metric_id){
                await Utils.pref.set('metric_user_id',response)
            }
        })
        .fail(async function(){
            //await Utils.pref.set('signInData',null)//user signin is failed should we reset localStorage.signInData????
        });
    },
    async signOut(){
        try{
            await User.courier.signOut()
            await jQuery.post( heap.state.hostname + "User/signOut")
            await Utils.pref.remove('signInData')
            heap.commit('setUser', {user_id: -1})
            User.sessionIdUse(null)
            User.geo.trackingStop()
            return {user_id: -1}
        } catch{/** */}
    },
    async signUp(requestData){
        const metric_id=await Utils.pref.get('metric_id')
        requestData.metric_id=metric_id??0
        const user_id=await jQuery.post( heap.state.hostname + "User/signUp", requestData)
        if(user_id>0){//successfull signup
            const user_phone=requestData.user_phone
            const user_pass=requestData.user_pass
            await Utils.pref.set('signInData',JSON.stringify({user_phone,user_pass}));
        }
        return user_id
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
            if( user_types.indexOf('courier')>-1 ){
                return true;
            }
        }catch{/** */}
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
        init(){
            if(localStorage.courierData){
                try{
                    User.courier.data=JSON.parse(localStorage.courierData)
                }catch{/** */}
            }
        },
        isCourier(){
            return User.courier.data?.courier_id || 0
        },
        async get(){
            try{
                const data=await jQuery.post( heap.state.hostname + "Courier/itemGet")
                User.courier.data=data
                User.courier.parseStatus()
                User.courier.batteryCheck()
                return data;
            }catch(err){
                User.courier.data=null;
            }
        },
        async batteryCheck(){
            try{
                const info = await Device.getBatteryInfo()
                const request={
                    courier_id:User.courier.data?.courier_id,
                    courier_comment:JSON.stringify(info)
                }
                await jQuery.post( heap.state.hostname + "Courier/itemUpdate",JSON.stringify(request))
            } catch{/** */}
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
            localStorage.courierData=JSON.stringify(User.courier.data)
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
        trackingActive:false,
        clock:null,
        async switch(){
            /**
             * unfortunately current location is unreliable so for now disable auto detection
             */
            const location_main=heap.state.user.location_main
            const lastStoredPosition=User.geo.lastStoredGet()
            if( location_main?.group_name && location_main.group_name!='Current' ){//user's real saved main location 
                heap.commit('setUserMainLocation', location_main)
                Topic.publish('userMainLocationSet',location_main)
                this.trackingStop()
            } else
            // if( lastStoredPosition ){//load last saved location
            //     heap.commit('setUserCurrentLocation', lastStoredPosition)
            //     Topic.publish('userCurrentLocationSet',lastStoredPosition)
            //     this.trackingStart()
            // } else
            if( location_main?.group_name=='Current' ){//load app's default location
                heap.commit('setUserCurrentLocation', location_main)
                Topic.publish('userCurrentLocationSet',location_main)
                //this.trackingStart()
            }
        },
        async get(){
            try{
                return await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
            }catch(err){
                //console.log('User.geo.get',err)
            }
            return null
        },
        async trackingStart(){
            try{
                User.geo.trackingStop();
                User.geo.trackingActive=true
                User.geo.clock=await Geolocation.watchPosition({ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },async (position)=>{
                    const curr_lat=parseFloat(position?.coords?.latitude??0)
                    const curr_lon=parseFloat(position?.coords?.longitude??0)
                    if(!curr_lat || !curr_lon){
                        return
                    }
                    const lastStoredPosition=User.geo.lastStoredGet()
                    const last_lat=parseFloat(lastStoredPosition?.location_latitude??0)
                    const last_lon=parseFloat(lastStoredPosition?.location_longitude??0)
                    const lat_shift_m=Math.abs(last_lat-curr_lat)/0.000009
                    const lon_shift_m=Math.abs(last_lon-curr_lon)/0.000009
                    const tolerance_m=500
                    if( lat_shift_m<tolerance_m && lon_shift_m<tolerance_m ){
                        return;
                    }

                    const current_address= await User.geo.geocode([curr_lat,curr_lon])
                    const current_location={
                        group_name:'Current',
                        location_latitude:curr_lat,
                        location_longitude:curr_lon,
                        location_address: 'около ' + (current_address??'текущего местоположения'),
                        timestamp:position.timestamp
                    }
                    
                    if(User.geo.trackingActive){
                        User.geo.lastStoredSet(current_location)
                        heap.commit('setUserCurrentLocation',current_location);
                        Topic.publish('userCurrentLocationSet',current_location)
                    }
                });
            } catch (err){
                //console.log('trackingStart',err)
            }
        },
        trackingStop(){
            try{
                if(User.geo.clock){
                    Geolocation.clearWatch({id:User.geo.clock});
                }
                User.geo.trackingActive=false
            }catch(err){
                //console.log('trackingStop',err)
            }
        },
        async geocode(coords){
            try{
                await loadYmap({
                    apiKey:heap.state.settings.location.ymapApiKey
                });
                const result=await window.ymaps.geocode(coords)
                return result.geoObjects.get(0)?.getAddressLine();
            } catch(err){
                //console.log(err)
            }
            return null
        },
        lastStoredGet(){
            try{
                return JSON.parse(localStorage.lastStoredPosition)??null
            } catch{/** */}
            return null
        },
        lastStoredSet(current_location){
            try{
                localStorage.lastStoredPosition=JSON.stringify(current_location)
            } catch{/** */}
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
            /**
             * for web notifications
             */
            if(!window.Notification || Notification.permission!='granted'){
                return
            }
            try{
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
                //console.log(err)
            }
        },
        async savePushToken(token){
            if(User.firebase.tokenSaved){
                return 'idle'
            }
            /**
             * for ios notifications
             */
            try{
                const request={
                    type:'push',
                    registration_id:token,
                    user_agent:navigator.userAgent
                }
                const result=await jQuery.post(`${heap.state.hostname}MessageSub/itemCreate`,request)
                User.firebase.tokenSaved=true;
                return result
            }catch(err){
                //console.log(err)
            }
        },
    }
}
User.init();
export default User;