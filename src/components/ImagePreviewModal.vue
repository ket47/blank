
<template>
  <ion-header>
      <ion-toolbar color="secondary">
          <ion-title>Просмотр фотографии</ion-title>
          <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>

    <ion-grid v-if="actions">
      <ion-row>
          <ion-col  v-for="(action, action_code) in actions" :key="action_code" >
              <ion-button 
              v-if="action[0]" 
              @click="actionCreate(action_code, action[1])" 
              expand="block" 
              :color="action[1]??'primary'"
              >
                  {{ action[0] }}
              </ion-button>
          </ion-col>
      </ion-row>
    </ion-grid>
    
    <ion-img :src="$heap.state.hostname + 'image/get.php/'+image_hash+'.1000.1000.webp'"/>
  </ion-content>
</template>

<script>
import {closeOutline}      from 'ionicons/icons';
import {
  modalController,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonImg,
  IonContent,
  IonTitle,
  IonButton,
  IonCol,
  IonRow,
  IonGrid,
  }  from "@ionic/vue";

export default{
  props:['image_hash','actions'],
  components:{
  IonIcon,
  IonToolbar,
  IonHeader,
  IonImg,
  IonContent,
  IonTitle,
  IonButton,
  IonCol,
  IonRow,
  IonGrid,

  },
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return { closeModal, closeOutline };
  },
  methods:{
    actionCreate(action_role, severity){
      if( severity=='danger' ){
          if(!confirm("Вы уверены?")){
              return
          }
      }
      modalController.dismiss(null,action_role);
    }
  }
};
</script>