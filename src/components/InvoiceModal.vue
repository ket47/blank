
<template>
  <ion-header>
        <ion-header>
          <ion-toolbar>
            <ion-item lines="none">
              <ion-icon :icon="receiptOutline" slot="start"/>
              <ion-title>Фискальный чек</ion-title>
              <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>              
            </ion-item>
          </ion-toolbar>
      </ion-header>
  </ion-header>
  <ion-content>
    <iframe :src="billLink" style="width: 100%; height:85%;border:none" @load="onLoad()" />
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
import loading              from '@/assets/icons/loading.svg';
import {closeOutline,receiptOutline,}       from 'ionicons/icons';

export default{
  components: {
  IonTitle,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonContent,
  },
  props:['billLink'],
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return { closeModal, closeOutline,receiptOutline, loading };
  },
  data(){
    return {
      loadAnimation:1
    };
  },
  methods:{
    onLoad(){
       this.loadAnimation=0;
    },

  }
};
</script>