
<template>
  <ion-header>
      <ion-toolbar>
        <ion-item lines="none">
          <ion-icon :icon="cardOutline" slot="start"></ion-icon>
          <ion-title v-if="this.order_data=='card_registering'">Привязка новой карты</ion-title>
          <ion-title v-else>Оплата картой</ion-title>
          <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
        </ion-item>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <iframe :src="paymentLink" id="paymentFrame1" style="width: 100%; height: calc( 100% - 5px );border:none" @load="onLoad()"></iframe>
    <div v-if="loadAnimation" style="position:fixed;top:200px;left:calc( 50% - 50px )">
      <img :src="loading"/>
    </div>
  </ion-content>
</template>

<script>
import {
  modalController,
  IonTitle,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonContent,
  IonItem,
}                           from "@ionic/vue";
import {closeOutline,cardOutline}       from 'ionicons/icons';
import loading              from '@/assets/icons/loading.svg';
import jQuery               from 'jquery';

export default{
  components: {
  IonTitle,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonContent,
  IonItem,
  },
  props:['order_data'],
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return { closeModal, closeOutline,cardOutline,loading };
  },
  data(){
    return {
      paymentLink:null,
      loadAnimation:1
    };
  },
  mounted(){
    this.listenFrame();
    this.postToIframe();
  },
  methods: {
    async postToIframe(){
        try{
          if(this.order_data=='card_registering'){
            this.paymentLink=await jQuery.post(this.$heap.state.hostname+'CardAcquirer/cardRegisterLinkGet');
            return;
          }
          this.paymentLink=await jQuery.post(this.$heap.state.hostname+'CardAcquirer/paymentLinkGet',this.order_data);
        } catch(err){
            const exception_code = err?.responseJSON?.messages?.error;
            if(exception_code =='nocardid'){
              this.$flash("Не удалось добавить карту");
            } else {
              this.$flash("Нет возможности принять оплату картой");
            }
            this.closeModal();
        }
    },
    onLoad(){
       this.loadAnimation=0;
    },
    listenFrame(){
      let self=this;
      window.addEventListener('message',event=>{
        if( event.data=='paymentOk' || event.data=='paymentNo' ){
          self.closeModal();
        }
      })
    }
  }
};
</script>