
<template>
  <ion-header>
      <ion-toolbar color="secondary">
          <ion-title slot="start">Оплата картой</ion-title>
          <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <iframe :src="paymentLink" id="paymentFrame1" style="width: 100%; height: 600px;border:none" @load="onLoad()"></iframe>
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
}                           from "@ionic/vue";
import {closeOutline}       from 'ionicons/icons';
import loading              from '@/assets/icons/loading.svg';
import jQuery               from 'jquery';

export default{
  components: {
  IonTitle,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonContent,
  },
  props:['order_data'],
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return { closeModal, closeOutline,loading };
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
            this.paymentLink=await jQuery.post(this.$heap.state.hostname+'UniPayments/paymentLinkGet',this.order_data);
        } catch(err){
            this.$flash("Нет возможности принять оплату картой");
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