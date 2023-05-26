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

if( isPlatform('capacitor') ){
  const addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      User.firebase.savePushToken(token.value)
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
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
    console.log('delivered notifications', notificationList);
  }
  addListeners()
  registerNotifications()
}