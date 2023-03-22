importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDHDeSPsSoJHE_HYKQ_vgOvSfJIN_8Y2Uc",
  authDomain: "tezkel-8e371.firebaseapp.com",
  projectId: "tezkel-8e371",
  storageBucket: "tezkel-8e371.appspot.com",
  messagingSenderId: "359468869452",
  appId: "1:359468869452:web:8db6fe690d192b427891e9"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage(async (payload) => {

  const cl=await clients.matchAll({includeUncontrolled: false, type: 'window'});
  if( cl.length ){
    cl.forEach(client => client.postMessage(payload));
  }
  try{
    if(payload.data.body){//if body is set then this is foreground notification!
      const notificationTitle = payload.data.title??'Tezkel'
      const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        link: payload.data.link??'',
        tag: payload.data.tag??'',
        vibrate: [200, 100, 200]
      }
      return self.registration.showNotification(notificationTitle,notificationOptions);
    }
    return self.registration.showNotification(payload.title,payload);
  } catch (err){
    console.log('messaging.onBackgroundMessage',err)
  }
});
