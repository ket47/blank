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
const messaging = firebase.messaging();

self.addEventListener('push', async event => {
  let payload
  try{
    payload = event.data?.json() ?? {};
  } catch (err){
    payload = {data:{body:event.data.text()}};
  }
  const data=payload.data


  const cl=await clients.matchAll({includeUncontrolled: false, type: 'window'});
  if( cl.length ){
    cl.forEach(client => client.postMessage(payload));
  }
  
  const title = data.title;
  const options = data;
  options.vibrate=[200, 100, 200, 100]
  return await self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.waitUntil(
    self.clients.matchAll().then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
    })
  );
});


// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
// const messaging = firebase.messaging();
// messaging.onBackgroundMessage(async (payload) => {
//   const cl=await clients.matchAll({includeUncontrolled: false, type: 'window'});
//   if( cl.length ){
//     cl.forEach(client => client.postMessage(payload));
//   }

//   const notificationTitle = 'intercepted';//payload.notification.title??'Tezkel'
//   const notificationOptions = {
//     body: payload.notification.body,
//     image: payload.notification.image,



//     icon: payload.data.icon,
//     link: payload.data.link??'',
//     tag: payload.data.tag??'',
//     vibrate: [200, 100, 200]
//   }
//   return self.registration.showNotification(notificationTitle,notificationOptions);



//   // try{
//   //   if(payload.data.body){//if body is set then this is foreground notification!
//   //     const notificationTitle = payload.notification.title??'Tezkel'
//   //     const notificationOptions = {
//   //       body: payload.notification.body,
//   //       image: payload.notification.image,



//   //       icon: payload.data.icon,
//   //       link: payload.data.link??'',
//   //       tag: payload.data.tag??'',
//   //       vibrate: [200, 100, 200]
//   //     }
//   //     return self.registration.showNotification(notificationTitle,notificationOptions);
//   //   }
//   // } catch (err){
//   //   console.log('messaging.onBackgroundMessage',err)
//   // }
// });





// messaging.onMessage(async (payload) => {
//   const cl=await clients.matchAll({includeUncontrolled: false, type: 'window'});
//   if( cl.length ){
//     cl.forEach(client => client.postMessage(payload));
//   }




// })


