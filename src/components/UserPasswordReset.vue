<template>
  <ion-header>
      <ion-toolbar>
        <ion-title>Восстановление пароля</ion-title>
        <ion-icon slot="end" @click="closeModal();" :icon="closeOutline" size="large"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
      <form novalidate>
        <ion-list>
          <ion-item>
            <ion-input label="Ваш номер телефона" label-placement="stacked" v-model="userphone" placeholder="Ваш телефон"/>
          </ion-item>
          <ion-item>
            <ion-input label="Ваш ник" label-placement="stacked" v-model="username" placeholder="Имя, указанное вами при регистрации"/>
          </ion-item>
        </ion-list>
        <ion-button @click="passwordReset()" expand="full">Создать новый пароль</ion-button>
      </form>
      <div style="padding: 15px;font-size:0.8em;color:#999">
        Рекомендуем сначала проверить СМС сообщение с паролем, которое было выслано вам при регистрации в сервисе.
      </div>

      <div style="padding: 15px;font-size:0.8em" @click="$router.push('page/contacts')">
        Если у вас возникли сложности с восстановлением пароля, обращайтесь в <a href="#">службу поддержки</a>
      </div>
      
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
    closeOutline
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
    return {closeOutline}
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
        user_phone: '+'+this.userphone.replace(/\D/g,""),
        user_name:  this.username
      }
      try{
        await jQuery.post(`${this.$heap.state.hostname}User/passwordReset`, requestData)
        this.$flash(`Ваш новый пароль выслан на номер '${this.userphone}'`)
      } catch(err){
        const message=err?.responseJSON?.messages?.error
        if(message=='user_notfound'){
          this.$flash(`Пользователь с телефоном '${this.userphone}' и именем '${this.username}' не найден`)
        }else{
          this.$flash(`Не удалось восстановить пароль`)
        }
      }
      this.closeModal()
    },
  }
};
</script>