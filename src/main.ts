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
import Order                from '@/scripts/Order.js'
import Metrics              from '@/scripts/Metrics.js'
import Push                 from '@/scripts/Push.js'
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
    return globalAlertPrompt.present();
}

const go = async (route:any)=>{
  Topic.publish('dismissModal')
  router.push(route)
}

jQuery( document ).ajaxError(( event, jqxhr, settings, thrownError )=>{
  const status_code=jqxhr.status;
  if(status_code==403){
    if( heap.getters.userIsLogged ){
      flash('К сожалению, нет прав для этого действия');
    } else {
      Topic.publish('dismissModal')
      flash('Вы не выполнили вход, пожалуйста авторизируйтесь');
      router.push({path: `/user/sign-in`});
    }
  } else
  if(status_code==401){
    flash('Вы не выполнили вход, пожалуйста авторизируйтесь');
    Topic.publish('dismissModal')
    router.push({path: `/user/sign-in`});
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
jQuery( document ).ajaxComplete(()=>{
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
  .use(IonicVue)
  .use(router)
  .use(heap)
app.provide("$Order",Order);
app.config.globalProperties.$heap = heap;
app.config.globalProperties.$flash = flash;
app.config.globalProperties.$alert = alert;
app.config.globalProperties.$topic = Topic;
app.config.globalProperties.$go = go;

const isMobile= /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
if(isMobile){
  app.component('base-layout', BaseLayout);
} else {
  app.component('base-layout', BaseLayoutDesktop);
}

async function startApp(){
  /**
   * Signing in first is slower but is more solid because all requests will go with session header
   */
  app.mount('#app');
  await User.autoSignIn();


  Metrics.init()
  Push.setFlashHandler(flash)
  Push.setAlertHandler(alert)
  Push.setGoHandler(go)



  /**
   * opens deeplinking urls in this app
   */
  App.addListener('appUrlOpen', function (event: URLOpenListenerEvent) {
    const slug = event.url.split('.com').pop();
    if (slug) {
      go(slug)
    }
  });
}
startApp();
