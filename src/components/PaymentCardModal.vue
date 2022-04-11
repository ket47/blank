
<template>
  <ion-header>
      <ion-toolbar>
          <ion-title slot="start">Оплата картой</ion-title>
          <ion-icon :icon="closeOutline" @click="closeModal();" slot="end"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <iframe :src="paymentLink" style="width: 100%; height: 600px;border:none"></iframe>
  </ion-content>
</template>

<script>
import {closeOutline}      from 'ionicons/icons';
import {modalController}  from "@ionic/vue";
import jQuery from 'jquery';

export default{
  components: {},
  props:['order_data'],
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return { closeModal, closeOutline };
  },
  data(){
    return {
      paymentLink:'about:blank'
    };
  },
  mounted(){
      this.postToIframe();
  },
  methods: {
    async postToIframe(){
        const link=await jQuery.post(this.$heap.state.hostname+'UniPayments/paymentLinkGet',this.order_data);
        this.paymentLink=link;
    }
  }
};
</script>