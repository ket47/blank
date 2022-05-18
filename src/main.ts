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

import { createApp }        from 'vue';
import { isPlatform }       from '@ionic/vue';
import { IonicVue }         from '@ionic/vue';
import { toastController }  from '@ionic/vue';

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
    const message=this.queue.shift()
    if( message==undefined ){
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
        duration: 3000,
        color:'secondary'
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

jQuery( document ).ajaxError(( event, jqxhr, settings, thrownError )=>{
  const status_code=jqxhr.status;
  if(status_code==403){
    if( heap.getters.userIsLogged ){
      flash('К сожалению, нет прав для этого действия');
    } else {
      flash('Вы не выполнили вход, пожалуйста авторизируйтесь');
      router.push({path: `/sign-in`});
    }
  } else
  if(status_code==401){
    flash('Вы не выполнили вход, пожалуйста авторизируйтесь');
    router.push({path: `/sign-in`});
  }

  if(status_code==0){
    flash('Похоже нет связи с интерентом. Попробуйте позже');
    router.push({path: `/error-offline`});
  }
  if(thrownError === 'abort'){
    alert('Ajax request aborted.');
  }
  if(thrownError === 'timeout'){
    alert('Time out error.');
  }
})
jQuery( document ).ajaxSend(()=>{
  heap.commit('setInteractionStatus',1)
})
jQuery( document ).ajaxComplete(()=>{
  heap.commit('setInteractionStatus',-1)
})

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(heap);
app.provide("$Order",Order);
app.config.globalProperties.$heap = heap;
app.config.globalProperties.$flash = flash;
app.config.globalProperties.$topic = Topic;


if(isPlatform('mobile') || isPlatform('mobileweb')){
  app.component('base-layout', BaseLayout);
  //require('./theme/base_layout.css');
} else {
  app.component('base-layout', BaseLayoutDesktop);
  require('./theme/base_layout_desktop.css');
}
app.mount('#app');
User.autoSignIn();
