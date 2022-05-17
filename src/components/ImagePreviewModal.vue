
<template>
  <ion-header>
      <ion-toolbar>
          <ion-title>Просмотр фотографии</ion-title>
          <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-img :src="$heap.state.hostname + 'image/get.php/'+image_hash+'.1000.1000.webp'"/>
  </ion-content>
</template>

<script>
import {closeOutline}      from 'ionicons/icons';
import {
  modalController,
  IonLabel,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonImg,
  IonContent,
  IonTitle
  }  from "@ionic/vue";

export default{
  props:['image_hash'],
  components:{
  IonLabel,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonImg,
  IonContent,
  IonTitle
  },
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return { closeModal, closeOutline };
  },
};
</script>