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


messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

/*

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyDHDeSPsSoJHE_HYKQ_vgOvSfJIN_8Y2Uc",
  authDomain: "tezkel-8e371.firebaseapp.com",
  projectId: "tezkel-8e371",
  storageBucket: "tezkel-8e371.appspot.com",
  messagingSenderId: "359468869452",
  appId: "1:359468869452:web:8db6fe690d192b427891e9"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);


// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
import { getMessaging, onMessage } from "firebase/messaging";

//const messaging = getMessaging();
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // ...
});

*/