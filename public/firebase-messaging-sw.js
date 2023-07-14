importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

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
  const data=payload.data ?? {}
  const title = data.title
  const options = data
  options.vibrate=[500, 100, 500, 100]
  event.waitUntil(self.registration.showNotification(title, options))
});

self.addEventListener('notificationclick', function(event) {
  event.waitUntil(
    self.clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
    })
  );
});

async function sendToClient(payload){
  const cl=await clients.matchAll({includeUncontrolled: true, type: 'window'});
  console.log('clients',cl)
  if( cl.length ){
    cl.forEach(client => client.postMessage(payload));
  }
}



// messaging.onBackgroundMessage( payload => {
//   const data=payload.data ?? {}
//   const title = data.title
//   const options = data
//   options.vibrate=[500, 100, 500, 100]
//   // if( data.topic ){
//   //   sendToClient(payload)
//   // }
//   return  self.registration.showNotification(title, options)
// })
//messaging.onMessage( (payload) => {})//automatically routed to application