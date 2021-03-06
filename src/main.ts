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


/* Theme variables */
import './theme/variables.css';
import './theme/core.css';

/* Theme color */
//import './theme/color_green.css';

import { createApp }        from 'vue';
import { IonicVue }         from '@ionic/vue';
import { toastController,alertController }  from '@ionic/vue';

import App                  from '@/App.vue';
import router               from '@/router';
import heap                 from '@/heap';

import BaseLayout           from '@/components/BaseLayout.vue';
import BaseLayoutDesktop    from '@/components/BaseLayoutDesktop.vue';

import Topic                from '@/scripts/Topic.js';
import User                 from '@/scripts/User.js'
import Order                from '@/scripts/Order.js'
import jQuery               from "jquery";

import './registerServiceWorker';
// import OneSignalVuePlugin from '@onesignal/onesignal-vue3'


const FlashNotice={
  queue:([] as any),
  idle:true,
  push( message:string ){
    this.queue.push(message);
    this.next();
  },
  next(){
    if( !this.idle ){
      return;
    }
    const message=this.queue.join("<br/><br/>")
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
        color:'secondary',
        translucent:true,
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
const alert = async (message:string,title:string)=>{
  Topic.publish('dismissModal')
  const alert = await alertController
      .create({
        header: title,
        message: message,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            cssClass: 'secondary'
          },
        ],
      });
    return alert.present();
}

jQuery( document ).ajaxError(( event, jqxhr, settings, thrownError )=>{
  const status_code=jqxhr.status;
  if(status_code==403){
    if( heap.getters.userIsLogged ){
      flash('?? ??????????????????, ?????? ???????? ?????? ?????????? ????????????????');
    } else {
      Topic.publish('dismissModal')
      flash('???? ???? ?????????????????? ????????, ???????????????????? ??????????????????????????????');
      router.push({path: `/sign-in`});
    }
  } else
  if(status_code==401){
    flash('???? ???? ?????????????????? ????????, ???????????????????? ??????????????????????????????');
    Topic.publish('dismissModal')
    router.push({path: `/sign-in`});
  }

  if(status_code==0){
    flash('???????????? ?????? ?????????? ?? ????????????????????. ???????????????????? ??????????');
    Topic.publish('dismissModal')
    router.push({path: `/error-offline`});
  }
  if(thrownError === 'abort'){
    flash('???????????? ?????? ?????????? ?? ????????????????????. ???????????????????? ??????????');
    router.push({path: `/error-offline`});
  }
  if(thrownError === 'timeout'){
    flash('???????????? ?????? ?????????? ?? ????????????????????. ???????????????????? ??????????');
    router.push({path: `/error-offline`});
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


navigator.serviceWorker.onmessage = (event) => {
  if(event.data.data.topic){
    Topic.publish(event.data.data.topic,event.data.data)
  } else
  if(event.data.data.type === 'flash'){
    flash(event.data.body)
  } else
  if(event.data.data.body && event.data.data.title){
    alert(event.data.data.body,event.data.data.title)
  } else {
    console.log('UNHANDLED WEBPUSH',event.data)
  }
};


const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(heap)
app.provide("$Order",Order);
app.config.globalProperties.$heap = heap;
app.config.globalProperties.$flash = flash;
app.config.globalProperties.$alert = alert;
app.config.globalProperties.$topic = Topic;

const platformMobile= /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
if(platformMobile){
  app.component('base-layout', BaseLayout);
  //require('./theme/base_layout.css');
} else {
  app.component('base-layout', BaseLayoutDesktop);
  require('./theme/base_layout_desktop.css');
}
app.mount('#app');
User.autoSignIn();
