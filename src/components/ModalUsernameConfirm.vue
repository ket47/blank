<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Напоминание пароля</ion-title>
      <ion-icon :icon="closeCircle" @click="closeModal();" slot="end" size="large" color="medium"></ion-icon>
    </ion-toolbar>
  </ion-header>
  <ion-content>
      <form novalidate>
        <ion-list>
          <ion-item>
            <ion-label position="stacked" color="primary">Номер телефона</ion-label>
            <ion-input v-model="userphone" placeholder="Ваш телефон"/>
          </ion-item>
          <ion-item>
            <ion-label position="stacked" color="primary">Имя пользователя</ion-label>
            <ion-input v-model="username" placeholder="Введите имя пользователя..."/>
          </ion-item>
        </ion-list>
        <ion-button @click="passwordReset()" expand="full">Выслать пароль</ion-button>
      </form>
  </ion-content>
</template>

<script>
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonLabel,

  modalController 
}                   from '@ionic/vue';
import {
    closeCircle
}                   from 'ionicons/icons';
import jQuery       from "jquery";

export default {
  components: {
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonLabel,
  },
  props: [ 'phone' ],
  setup(){
    return {closeCircle}
  },
  data() {
    return {
      username: '',
      userphone:this.phone
    }
  },
  methods: {
    closeModal(){
      return modalController.dismiss();
    },
    async passwordReset(){
      let requestData = {
        user_phone: '+'+this.phone.replace(/\D/g,""),
        user_name:  this.username
      }
      try{
        await jQuery.post(`${this.$heap.state.hostname}User/passwordReset`, requestData)
        this.$flash(`Ваш новый пароль выслан на номер '${this.userphone}'`)
      } catch(err){
        const message=err.responseJSON.messages.error
        if(message=='user_not_found'){
          this.$flash(`Пользователь с телефоном '${this.userphone}' и именем '${this.username}' ненайден`)
        }else{
          this.$flash(`Не удалось восстановить пароль`)
        }
      }
      this.closeModal()
    },
  }
};
</script>