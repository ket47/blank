/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import './theme/base_layout_desktop.css';

/* Theme variables */
import './theme/variables.css';
import './theme/core.css';

/* Theme color */
//import './theme/color_green.css';

import { createApp }        from 'vue';
import { IonicVue }         from '@ionic/vue';
import VueApp               from '@/VueApp.vue';
import router               from '@/router';
import heap                 from '@/heap';

import BaseLayout           from '@/components/BaseLayout.vue';
import BaseLayoutDesktop    from '@/components/BaseLayoutDesktop.vue';


import jQuery               from "jquery";
import Topic                from '@/scripts/Topic.js';
import User                 from '@/scripts/User.js'
import Utils                from '@/scripts/Utils.js'
import Order                from '@/scripts/Order.js'
import Metrics              from '@/scripts/Metrics.js'
import Push                 from '@/scripts/Push.js'
import Capgo                from '@/scripts/Capgo.js'

import './registerServiceWorker';
import { 
  toastController,
  alertController
}                           from '@ionic/vue';
import {
   App, 
   URLOpenListenerEvent 
}                           from '@capacitor/app';


const FlashNotice={
  queue:([] as any),
  idle:true,
  push( message:string ){
    if(this.queue[this.queue.length-1]==message){
      return
    }
    this.queue.push(message);
    this.next();
  },
  next(){
    if( !this.idle ){
      return;
    }
    const message=this.queue.join("\n")
    this.queue=[] 
    if( !message ){
      return;
    }
    this.flash(message)
  },
  async flash(message){
    this.idle=false;
    const self=this;
    const toast = await toastController
      .create({
        message: message,
        duration: 2000,
        color:'dark',
        position:'bottom'
      })
    toast.present();
    toast.onDidDismiss().then(()=>{
      self.idle=true;
      self.next();
    })
  }
}
const flash= ( message:string )=>{
  FlashNotice.push(message);
}

let globalAlertPrompt;
const alert = async (message:string,title:string)=>{
  Topic.publish('dismissModal')
  if(globalAlertPrompt){
    globalAlertPrompt.dismiss()
  }
  globalAlertPrompt = await alertController
      .create({
        header: title,
        message: message,
        translucent:true,
        buttons: ['Ok'],
      });
    await globalAlertPrompt.present();
    return await globalAlertPrompt.onDidDismiss();
}

const go = async (route:any)=>{
  await router.push(route)
}

const post=async ( url:string, data:any )=>{
  const settings={
    method: "POST",
    body:data,
    headers:{
      "Content-Type": "application/json",
      "x-sid":heap.state.sessionId,
      "x-ver":heap.state.applicationVersion
    }
  }
  if( !url.includes('http') ){
    url=heap.state.hostname+url
  }
  if(  typeof data != 'string' ){
    settings.body=new URLSearchParams(data)
    settings.headers["Content-Type"]="application/x-www-form-urlencoded";
  }

  heap.commit('setInteractionStatus',1)
  let response:Response
  try{
    response = await fetch(url,settings)
  } finally {
    setTimeout(()=>{
      heap.commit('setInteractionStatus',-1)
    },100)
  }
  
  if( response.headers.get("x-sid") ){
    heap.state.sessionId=response.headers.get("x-sid")
    User.sessionIdUse(heap.state.sessionId);
  }
  if( response.headers.get("x-chameleon") ){
    heap.state.chameleonMode=response.headers.get("x-chameleon")
  }
  await postErrors(response)
  const resp=await response.text()
  try{
    return JSON.parse(resp)
  } catch{/** */}
  return resp
}
const postErrors=async function (response:Response){
  if (!response.ok) {
    if(response.status==403){
      if( heap.getters.userIsLogged ){
        flash('К сожалению, нет прав для этого действия')
      } else {
        Topic.publish('dismissModal')
        flash('Вы не выполнили вход, пожалуйста авторизируйтесь')
        router.push({path: `/modal/user-authorize`})

      }
    } else
    if(response.status==401){
      flash('Вы не выполнили вход, пожалуйста авторизируйтесь')
      Topic.publish('dismissModal')
      router.push({path: `/modal/user-authorize`});
    } else {
      const responseError={
        type: 'Error',
        responseJSON: null,
        status: response.status,
        message: `apiPost Error Response status: ${response.status}`,
      }
      try{
        const result = await response.json()
        responseError.message=result?.message
        responseError.responseJSON=result
      } catch{/** */}
      let error = new Error()
      error = { ...error, ...responseError }
      throw (error)
    }
  }
}

jQuery( document ).ajaxError(( event, jqxhr, settings, thrownError )=>{
  const status_code=jqxhr.status;
  if(status_code==403){
    if( heap.getters.userIsLogged ){
      flash('К сожалению, нет прав для этого действия');
    } else {
      Topic.publish('dismissModal')
      flash('Вы не выполнили вход, пожалуйста авторизируйтесь');
      router.push({path: `/modal/user-authorize`});
    }
  } else
  if(status_code==401){
    flash('Вы не выполнили вход, пожалуйста авторизируйтесь');
    Topic.publish('dismissModal')
    router.push({path: `/modal/user-authorize`});
  }

  if(status_code==0){
    //flash('Похоже нет связи с интерентом.');
    Topic.publish('dismissModal')
    //router.push({path: `/error-offline`});
  } else
  if(thrownError === 'abort'){
    //flash('Похоже нет связи с интерентом.');
    //router.push({path: `/error-offline`});
  } else
  if(thrownError === 'timeout'){
    //flash('Похоже нет связи с интерентом.');
    //router.push({path: `/error-offline`});
  }
})
jQuery( document ).ajaxSend(()=>{
  heap.commit('setInteractionStatus',1)
})
jQuery( document ).ajaxComplete((e,xhr)=>{
  const sid = xhr.getResponseHeader('x-sid');
  if(sid){
    User.sessionIdUse(sid);
  }
  if( xhr.getResponseHeader("x-chameleon") ){
    heap.state.chameleonMode=xhr.getResponseHeader("x-chameleon")
  }
  setTimeout(()=>{
    heap.commit('setInteractionStatus',-1)
  },100)
})


if( 'serviceWorker' in navigator ){
  navigator.serviceWorker.onmessage = (event) => {
    const {data}=event.data??{}
    const {title,body,topic,type}=data??{}
    if(topic){
      Topic.publish(topic,data)
    } else
    if(type === 'flash'){
      flash(body)
    } else
    if(body){
      alert(body,title)
    } else {
      console.log('UNHANDLED WEBPUSH',data)
    }
  };
}

const app = createApp(VueApp)
  .use(IonicVue,{swipeBackEnabled: false})
  .use(router)
  .use(heap)
app.provide("$Order",Order);
app.config.globalProperties.$topic = Topic;
app.config.globalProperties.$heap = heap;
app.config.globalProperties.$go = go;
app.config.globalProperties.$flash = flash;
app.config.globalProperties.$alert = alert;
app.config.globalProperties.$post = post;

const isMobile= /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
if(isMobile){
  app.component('base-layout', BaseLayout);
} else {
  app.component('base-layout', BaseLayoutDesktop);
}



import { SafeArea } from 'capacitor-plugin-safe-area';
SafeArea.getSafeAreaInsets().then((data) => {
  const { insets } = data;
  document.body.style.setProperty("--ion-safe-area-top", `${insets.top}px`);
  document.body.style.setProperty("--ion-safe-area-right",`${insets.right}px`);
  document.body.style.setProperty("--ion-safe-area-bottom",`${insets.bottom}px`);
  document.body.style.setProperty("--ion-safe-area-left",`${insets.left}px`);
});




async function startApp(){
  /**
   * Signing in first is slower but is more solid because all requests will go with session header
   */
  heap.state.applicationVersion=await Capgo.installedVersionGet()
  heap.state.sessionId = await Utils.pref.get('sessionId')
  if( heap.state.sessionId ){
    await User.sessionIdUse(heap.state.sessionId);
  }


  /**
   * opens deeplinking urls in this app
   */
  App.addListener('appUrlOpen', function (event: URLOpenListenerEvent) {
    const slug = event.url.split('.com').pop();
    if (slug) {
      go(slug)
    }
  })
  await User.autoSignIn();

  app.mount('#app');

  Push.setFlashHandler(flash)
  Push.setAlertHandler(alert)
  Push.setGoHandler(go)

  Capgo.init(App,flash)
  Metrics.init()
  initSSE()
}


const initSSE = () => {

  const evtSource = new EventSource('http://tezkel.local/SSE', { withCredentials: true });

  evtSource.addEventListener('achievement', (event) => {
    if(event.data){
      console.log(event.data)
    } else {
      console.log('no events')
    }
  });
} 
startApp();
