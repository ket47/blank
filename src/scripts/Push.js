import {
  isPlatform,
}                             from "@ionic/vue";
import { Haptics }            from '@capacitor/haptics';
import { PushNotifications }  from '@capacitor/push-notifications';
import router                 from '@/router';
import User                   from '@/scripts/User';
import Topic                  from '@/scripts/Topic.js';


class Push{
  constructor( ){
    if( isPlatform('capacitor') ){
      Topic.on('userGet',()=>{
        this.registerNotifications()
        this.addListeners()
        this.setChannels()
      })
    }
  }

  flash(){/** */}
  alert(){/** */}
  go(){/** */}
  setFlashHandler(flash){
    this.flash=flash
  }
  setAlertHandler(alert){
    this.alert=alert
  }
  setGoHandler(go){
    this.go=go
  }

  dispatchIncoming(notification){
    const {title,body,topic,type}=notification.data??{}
    if(topic){
      Topic.publish(topic,notification.data)
    } else
    if(type === 'flash'){
      this.flash(body)
    } else
    if(body){
      this.alert(body,title)
    }
  }

  addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      User.firebase.savePushToken(token.value)
    });

    await PushNotifications.addListener('registrationError', err => {
      //console.error('Registration error: ', err.error);
    });
    
    await PushNotifications.addListener('pushNotificationActionPerformed', action => {
      if(action?.notification?.data?.link){
        this.go(action.notification.data.link)
      }
      this.dispatchIncoming(action?.notification)
      console.log('pushNotificationActionPerformed: '+ JSON.stringify(action));
    });

    await PushNotifications.addListener('pushNotificationReceived', async notification => {
      if(notification.data.sound){
        await Haptics.vibrate({duration:2000});
      }
      this.dispatchIncoming(notification)
      console.log('Push notification received: ', JSON.stringify(notification));
    });

  }


  registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive !== 'granted') {
      //throw new Error('User denied permissions!');
    }
    await PushNotifications.register();
  }

  setChannels = async () => {
    PushNotifications.createChannel({
      description: 'Urgent Notifications',
      id: 'com.tezkel.urgent',
      importance: 5,
      lights: true,
      name: 'My Urgent notification channel',
      sound: 'longsound.wav',
      vibration: true,
      visibility: 1,
      lightColor: '#FF0000'
    })
    PushNotifications.createChannel({
      description: 'High Notifications',
      id: 'com.tezkel.high',
      importance: 5,
      lights: true,
      name: 'My High notification channel',
      sound: 'mediumsound.wav',
      vibration: true,
      visibility: 1,
      lightColor: '#FF0000'
    })
    PushNotifications.createChannel({
      description: 'Normal Notifications',
      id: 'com.tezkel.normal',
      importance: 5,
      lights: true,
      name: 'My Normal notification channel',
      sound: 'shortsound.wav',
      vibration: true,
      visibility: 1,
      lightColor: '#FF0000'
    })
  }
}

export default new Push();
