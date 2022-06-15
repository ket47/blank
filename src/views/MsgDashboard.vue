<template>
  <base-layout pageTitle="Сообщения">
      mesajlar
      <button @click="subscribe()">SUBSCRIBE</button>
  </base-layout>
</template>
<script>
//import { initializeApp } from "firebase/app";
//import { getMessaging, getToken } from "firebase/messaging";

//import {IOneSignal} from 'onesignal-vue'

// import 'firebase/app'
// import 'firebase/messaging'
import jQuery from 'jquery'

export default {
  data(){
    return {
      messaging:{}
    }
  },
  methods: {
    async saveNotificationToken(token) {
      if( !(this.$heap.state.user.user_id>0) ){
        this.$flash("Необходимо авторизироваться")
        this.$router.push("sign-in")
        return
      }
      try{
        const request={
          type:'webpush',
          registration_id:token,
          user_agent:navigator.userAgent
        }
        const response=await jQuery.post(`${this.$heap.state.hostname}MessageSub/itemCreate`,request)
        console.log('saveNotificationToken',response)
      }catch(err){
        console.log(err)
      }
    },
    async subscribe(){
      this.$OneSignal.setExternalUserId(this.$heap.state.user.user_id);
      this.$OneSignal.showNativePrompt();
      // try{
      //   const permission=await Notification.requestPermission()
      //   console.log(permission,'Notification permission granted.')
      //   const messaging = getMessaging();
      //   const token=await getToken(messaging, {vapidKey: "BLzv4oK1EGxAxwPtlAXvMNzaYvMJK1qvx92D0f1U89wlUPxUU4gAtes7c__wcTwvmEyds6e7-p0Oy4bVYZo1Igg"});
      //   this.saveNotificationToken(token)
      // }catch(err){
      //   this.$alert("Не удалось подключить уведомления")
      //   console.log('Unable to get permission to notify.', err)
      // }
    },

    async setupPush() {




      this.$OneSignal.on('subscriptionChange', function(isSubscribed) {
        console.log("The user's subscription state is now:", isSubscribed);
      });

      //this.$OneSignal.showNativePrompt();

      // // I recommend to put these into your environment.ts
      // this.oneSignal.startInit('YOUR ONESIGNAL APP ID', 'YOUR ANDROID ID');
  
      // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
  
      // // Notifcation was received in general
      // this.oneSignal.handleNotificationReceived().subscribe(data => {
      //   let msg = data.payload.body;
      //   let title = data.payload.title;
      //   let additionalData = data.payload.additionalData;
      //   this.showAlert(title, msg, additionalData.task);
      // });
  
      // // Notification was really clicked/opened
      // this.oneSignal.handleNotificationOpened().subscribe(data => {
      //   // Just a note that the data is a different place here!
      //   let additionalData = data.notification.payload.additionalData;
  
      //   this.showAlert('Notification opened', 'You already read this before', additionalData.task);
      // });
  
      // this.oneSignal.endInit();
    },
    },
  mounted() {
    this.setupPush()
    // const firebaseConfig = {
    //   apiKey: "AIzaSyDHDeSPsSoJHE_HYKQ_vgOvSfJIN_8Y2Uc",
    //   authDomain: "tezkel-8e371.firebaseapp.com",
    //   projectId: "tezkel-8e371",
    //   storageBucket: "tezkel-8e371.appspot.com",
    //   messagingSenderId: "359468869452",
    //   appId: "1:359468869452:web:8db6fe690d192b427891e9",

    // };
    // const app = initializeApp(firebaseConfig);
    // this.messaging = getMessaging(app);


    // const self=this
    // this.messaging.onTokenRefresh(async function (newToken) {
    //   try{
    //     await self.messaging.getToken({vapidKey: "BLzv4oK1EGxAxwPtlAXvMNzaYvMJK1qvx92D0f1U89wlUPxUU4gAtes7c__wcTwvmEyds6e7-p0Oy4bVYZo1Igg"});
    //     self.saveNotificationToken(newToken)
    //   } catch(err){
    //     console.log('Unable to retrieve refreshed token ', err)
    //   }
    // });
  }
}
</script>