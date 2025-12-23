import jQuery                   from "jquery";
import heap                     from '@/heap';
import Topic                    from '@/scripts/Topic';
import Utils                    from '@/scripts/Utils';
import { Geolocation }          from '@capacitor/geolocation';
import { Device }               from '@capacitor/device'
import { loadYmap }             from "vue-yandex-maps";

import { initializeApp }        from "firebase/app";
// import { 
//     alertController
//   }                           from '@ionic/vue';
// import router                 from '@/router';
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
        const sessionId = await Utils.pref.get('sessionId')
        jQuery.ajaxSetup({ 
            beforeSend: function(xhr) {
                xhr.setRequestHeader('x-sid',  sessionId);
                xhr.setRequestHeader('x-ver',  heap.state.applicationVersion);
            }
        });
        const settings=await jQuery.get( heap.state.hostname + "User/itemSettingsGet")
        heap.commit('setSettings', settings);
        Topic.publish('settingsGet',settings);
        localStorage.settings=JSON.stringify(settings)
    },
    async get( mode='all' ){
        if( !heap.state.settings ){
            if( localStorage.settings ){
                /**
                 * Loading data after app bootstarp
                 */
                try{
                    let settings_stored=JSON.parse(localStorage.settings)
                    heap.commit('setSettings', settings_stored);
                    Topic.publish('settingsGet',settings_stored);
                } catch{/** */}
                setTimeout(()=>{this.settingsGet()},3000)
            } else {
                await this.settingsGet()
            }
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

            let main_location_is_changed=1
            if(heap.state.user?.location_main?.location_id==response?.location_main?.location_id){
                main_location_is_changed=0
                //to avoid unnecessary reloads
            }
            heap.commit('setUser', response)
            Topic.publish('userGet',response);
            if(main_location_is_changed==1){
                User.geo.switch()
            }
        });
        if( user?.user_id>0 ){
            //Order.api.listCount()
        }
        if( User.isCourier() ){
            /**
             * Loading data after app bootstarp
             */
            setTimeout(()=>{User.courier.get()},3000)
        }
        localStorage.user_is_courier=User.isCourier()
        localStorage.user_is_admin=User.isAdmin()
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
    /**
     * should be rewriten
     */
    async sessionIdUse(sid){
        heap.state.sessionId=sid//for $post
        jQuery.ajaxSetup({ 
            beforeSend: function(xhr) {
                xhr.setRequestHeader('x-sid',  sid);
                xhr.setRequestHeader('x-ver',  heap.state.applicationVersion);
            }
        });
        await Utils.pref.set('sessionId',sid)
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
        // .fail(async function(){
        //     //await Utils.pref.set('signInData',null)//user signin is failed should we reset localStorage.signInData????
        // });
    },
    async signOut(){
        try{
            await jQuery.post( heap.state.hostname + "User/signOut")
            await Utils.pref.remove('signInData')
            heap.commit('setUser', {user_id: -1})
            //User.sessionIdUse(null)
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
          return 1
        }
        return 0
    },
    isCourier(){
        const user_types=heap.state?.user?.member_of_groups?.group_types
        if( user_types?.indexOf('courier')>-1 ){
          return 1
        }
        return 0
    },
    isSupplier(){
        const user_types=heap.state?.user?.member_of_groups?.group_types
        if( user_types?.indexOf('supplier')>-1 ){
          return 1
        }
        return 0
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
                    heap.state.courier=User.courier.data
                }catch{/** */}
            }
        },
        isCourier(){
            return User.courier.data?.courier_id || 0
        },
        async get(){
            try{
                const debounce=10*60*1000//10 minute
                User.courier.data=await Utils.post(`${heap.state.hostname}Courier/itemGet`,null,debounce)

                User.courier.parseStatus()
                heap.state.courier=User.courier.data
                //User.courier.batteryCheck()
            }catch(err){
                User.courier.data=null;
                return null
            }
            return User.courier.data
        },
        // ratingCalculate(data){
        //     if(data.rating?.length>0){
        //         data.ratingScore=Math.round((data.rating[0].rating*1+data.rating[1].rating*1)/2*100)/100
        //     }
        //     return data
        // },
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
        parseStatus(){
            User.courier.status=User.courier.data?.member_of_groups?.group_types||"notcourier";
            localStorage.courierData=JSON.stringify(User.courier.data)
            Topic.publish('courierStatusChange',User.courier.status);
        },
    },
    geo:{
        trackingActive:false,
        trackedPositionExpires:0,
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
            if( lastStoredPosition ){//load last saved location from gps
                heap.commit('setUserCurrentLocation', lastStoredPosition)
                Topic.publish('userCurrentLocationSet',lastStoredPosition)
                this.trackingStart()
            } else
            if( location_main?.group_name=='Current' ){//load app's default location
                heap.commit('setUserCurrentLocation', location_main)
                Topic.publish('userCurrentLocationSet',location_main)
                this.trackingStart()
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
            if(User.geo.trackedPositionExpires>Date.now()){
                return
            }
            User.geo.trackedPositionExpires=(Date.now()*1+0.5*60*60*1000)//0.5 hours
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
                        location_address: (current_address??'текущего местоположения'),
                        timestamp:position.timestamp
                    }
                    
                    if(current_address && User.geo.trackingActive){
                        User.geo.trackingStop()
                        Topic.publish('userCurrentLocationFound',current_location)
                        /**
                         * If geolocation was permitted then try to figure out current address
                         * and present it to user
                         */
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
        /**
         * If user accepts presented location use it as main
         */
        async currentLocationSet(current_location){
            // const confirmed=await User.geo.currentLocationConfirm(current_address)
            // if( !confirmed ){
            //     const want_register=await User.geo.addLocationAdvise()
            //     if( want_register ){
            //         router.push('/user/sign-up')
            //     }
            //     return 
            // }
            User.geo.lastStoredSave(current_location)
            heap.commit('setUserCurrentLocation',current_location)
            Topic.publish('userCurrentLocationSet',current_location)
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
                return JSON.parse(sessionStorage.lastStoredPosition)??null
            } catch{/** */}
            return null
        },
        lastStoredSave(current_location){
            try{
                sessionStorage.lastStoredPosition=JSON.stringify(current_location)
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