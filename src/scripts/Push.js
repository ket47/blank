// import {
//   ActionPerformed,
//   PushNotificationSchema,
//   PushNotifications,
//   Token,
// }                           from '@capacitor/push-notifications';


// import Topic                    from '@/scripts/Topic';

// Topic.on('userGet',(user)=>{

//   // Request permission to use push notifications
//   // iOS will prompt user and return if they granted permission or not
//   // Android will just grant without prompting
//   PushNotifications.requestPermissions().then(result => {
//     if (result.receive === 'granted') {
//       // Register with Apple / Google to receive push via APNS/FCM
//       PushNotifications.register();
//       console.warn('PushNotifications.register'+result.receive)
//     } else {
//       //
//     }
//   })

//   alert('onload')

//   PushNotifications.addListener('registration', (token: Token) => {
//     console.log('Push registration success, token: ' + token.value);
//   });

//   PushNotifications.addListener('registrationError', (error: any) => {
//     alert('Error on registration: ' + JSON.stringify(error));
//   });

//   PushNotifications.addListener(
//     'pushNotificationReceived',
//     (notification: PushNotificationSchema) => {
//       alert('Push received: ' + JSON.stringify(notification));
//     },
//   );

//   PushNotifications.addListener(
//     'pushNotificationActionPerformed',
//     (notification: ActionPerformed) => {
//       alert('Push action performed: ' + JSON.stringify(notification));
//     },
//   );
// })

import {
  isPlatform,
}                             from "@ionic/vue";
import { PushNotifications }  from '@capacitor/push-notifications';
import User                   from '@/scripts/User';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

if( isPlatform('capacitor') ){
  
  const addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      User.firebase.savePushToken(token.value)
      console.log(token.value)
    });

    await PushNotifications.addListener('registrationError', err => {
      //console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', async notification => {
      if(notification.data.sound){
        await Haptics.vibrate({duration:2000});
      }
      console.log('Push notification received: ', JSON.stringify(notification));
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', action => {
      if(action?.notification?.data?.link){
        go(action.notification.data.link)
      }
      alert('Push notification action performed'+JSON.stringify(action.notification.data));
    });
  }

  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive !== 'granted') {
      //throw new Error('User denied permissions!');
    }
    await PushNotifications.register();
  }

  const getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('dDDDDelivered notifications', notificationList);
  }
  addListeners()
  registerNotifications()


  

  PushNotifications.createChannel({
      description: 'Urgent Notifications',
      id: 'com.tezkel.app.urgent',
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
    id: 'com.tezkel.app.high',
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
    id: 'com.tezkel.app.normal',
    importance: 5,
    lights: true,
    name: 'My Normal notification channel',
    sound: 'shortsound.wav',
    vibration: true,
    visibility: 1,
    lightColor: '#FF0000'
  })
}