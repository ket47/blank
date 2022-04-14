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


const flash= async ( message )=>{
  const toast = await toastController
    .create({
      message: message,
      duration: 2000,
      color:'dark'
    })
  return toast.present();
}
jQuery( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
  const status_code=jqxhr.status;
  if(status_code==403){
    if( heap.getters.userIsLogged ){
      flash('К сожалению, нет прав для этого действия');
    } else {
      flash('Нужно выполнить вход, чтобы продолжить');
      router.push({path: `/sign-in`});
    }
  }
});

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
  require('./theme/base_layout.css');
} else {
  app.component('base-layout', BaseLayoutDesktop);
  require('./theme/base_layout_desktop.css');
}


User.autoSignIn().then(function(){
  app.mount('#app');
});