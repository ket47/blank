<template>
  <ion-header>
      <ion-toolbar>
        <ion-title>Проблема с заказом</ion-title>
      </ion-toolbar>
  </ion-header>
  <ion-content>
      <ion-list>
          <ion-item>
              <ion-textarea rows="6" v-model="objection_text" placeholder="опишите суть проблемы (минимум 10 букв)" label=""></ion-textarea>
          </ion-item>
      </ion-list>
    <ion-button @click="save()" color="primary" :disabled="!objection_text || objection_text.length<10" expand="full">Сохранить</ion-button>
    <ion-button @click="close()" color="light" expand="full">Закрыть</ion-button>
  </ion-content>
</template>
<script>
import { 
    modalController,
    IonTextarea,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
}                   from '@ionic/vue';
export default {
    components:{
    IonTextarea,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    },
    data(){
        return {
            objection_text:null
        }
    },
    methods:{
        close(){
            modalController.dismiss()
        },
        save(){
            modalController.dismiss(this.objection_text)
        }
    }
}
</script>