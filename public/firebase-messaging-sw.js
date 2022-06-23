importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

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
  console.log('payload',payload)
  const cl=await clients.matchAll({includeUncontrolled: true, type: 'window'});
  if( cl.length ){
    cl.forEach(client => client.postMessage(payload));
    return false;
  } else if(payload.data.title){//if title is set then this is foreground notification!
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon: payload.data.icon,
      link: payload.data.link,
      vibrate: [200, 100, 200]
    };
    self.registration.showNotification(notificationTitle,notificationOptions);
  }
});
