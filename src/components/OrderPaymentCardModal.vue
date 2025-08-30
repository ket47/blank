
<template>
  <!-- <ion-header>
      <ion-toolbar>
        <ion-item lines="none">
          <ion-icon :icon="cardOutline" slot="start"></ion-icon>
          <ion-title v-if="this.order_data=='card_registering'">Добавление карты</ion-title>
          <ion-title v-else>Оплата картой</ion-title>
          <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
        </ion-item>
      </ion-toolbar>
  </ion-header> -->
  <ion-content>
    <!-- <iframe :src="paymentLink" id="paymentFrame1" style="width: 100%; height: calc( 100% - 20px );border:none;scrollbar-width: none;" @load="onLoad()"></iframe> -->
    <div v-if="loadAnimation" class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-img src="/img/uniteller.png" style="width:100%;height:auto"/>
          Оплатите заказ, в открывшейся странице оплаты...
        </ion-card-header>
        <ion-card-content>
          <div style="margin:auto;width:70px">
            <img :src="loading"/>
          </div>
        </ion-card-content>
      </ion-card>
    </div>
    <div v-else class="ion-padding" style="margin:auto;">
      <ion-card>
        <ion-card-header>
          <ion-img src="/img/uniteller.png" style="width:100%;height:auto"/>
          На странице оплаты используйте банковскую карту или приложение вашего банка.
        </ion-card-header>
        <ion-card-content>
          <ion-button expand="block" @click="open()">
            <span v-if="this.order_data=='card_registering'">
              Добавить карту
            </span>
            <span v-else>
              Оплатить картой
            </span>
          </ion-button>
        </ion-card-content>
      </ion-card>
    </div>
  </ion-content>
</template>

<script>
import {
  modalController,
  isPlatform,
  // IonTitle,
  // IonIcon,
  // IonToolbar,
  // IonHeader,
  // IonItem,

  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonImg,
  IonButton,
}                           from "@ionic/vue";
import {
  closeOutline,
  cardOutline
  }                         from 'ionicons/icons';
import loading              from '@/assets/icons/loading.svg';
import { InAppBrowser }     from '@capgo/inappbrowser'

export default{
  components: {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonImg,
  IonButton,
  },
  props:['order_data'],
  setup() {
      const closeModal = function(){
        try{
          if (modalController) {
            modalController.dismiss();
          }
        } catch{
          //
        }
      };
      return { closeModal, closeOutline,cardOutline,loading };
  },
  data(){
    return {
      paymentLink:null,
      loadAnimation:0
    };
  },
  async mounted(){
    await this.linkGet()
    if( isPlatform('capacitor') ){
      this.openBrowser()
    }
  },
  methods: {
    async linkGet(){
        const request={
          order_id:this.order_data.order_id,
          payment_type:this.order_data.payment_type,
          enable_auto_cof:(localStorage.disable_auto_cof==1?0:1)
        }
        this.paymentLink=await this.$post(this.$heap.state.hostname+'CardAcquirer/paymentLinkGet',request)      
    },
    async open(){
      if( isPlatform('capacitor') ){
        this.openBrowser()
      } else {
        this.openPopup()
      }
    },
    async openPopup(){
        this.loadAnimation=1
        let popupWindow = window.open(this.paymentLink,"paymentPage")
        let checkPopupClosed=() =>{
            if (popupWindow && popupWindow.closed) {
                clearInterval(checkInterval); // Stop checking once closed
                this.closeModal();
            }
        }
        const checkInterval = setInterval(checkPopupClosed, 300);
    },
    async openBrowser(){
      this.loadAnimation=1
      InAppBrowser.openWebView({
        title:"Страница оплаты",
        url: this.paymentLink,
        enabledSafeBottomMargin: true
      });
      InAppBrowser.addListener('closeEvent', () => {
        this.closeModal()
      });
    }
  }
}
</script>