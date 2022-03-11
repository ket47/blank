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
import { IonicVue }         from '@ionic/vue';
import { toastController }  from '@ionic/vue';

import App                  from '@/App.vue';
import BaseLayout           from '@/components/BaseLayout.vue';
import router               from '@/router';
import heap                 from '@/heap';

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

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(heap);
app.provide("$Order",Order);
app.config.globalProperties.$heap = heap;
app.config.globalProperties.$flash = flash;
app.component('base-layout', BaseLayout);



if(localStorage.sessionId){
  jQuery.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('x-sid',  localStorage.sessionId);
    },
  });
}
jQuery( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
  const status_code=jqxhr.status;
  if(status_code==403){
    if( heap.state.userIsLogged ){
      flash('К сожалению, нет прав для этого действия');
    } else {
      flash('Нужно выполнить вход, чтобы продолжить');
      router.push({path: `/sign-in`});
    }
  }
});

User.get(function(result){
  if(result.success && heap.state.user.user_id != -1){
      app.mount('#app');
  } else {
    if(localStorage.signInData){
      User.signIn(JSON.parse(localStorage.signInData), function(){
        User.get(function(){
          app.mount('#app');
        })
      })
    } else {
      app.mount('#app');
    }
  }
});
