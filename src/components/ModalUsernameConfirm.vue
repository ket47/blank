<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
      <ion-button slot="end" @click="closeModal">Закрыть</ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content >
      <form novalidate>
        <ion-list>
          <ion-item>
            <ion-row>
              <ion-col>
                <ion-label position="stacked" color="primary">Имя пользователя</ion-label>
                <ion-input
                  v-model="username"
                  name="username"
                  type="text"
                  inputmode="text"
                  :value="username"
                  @input="username = $event.target.value"
                  placeholder="Введите имя пользователя..."
                  required
                ></ion-input>
              </ion-col>
            </ion-row>
          </ion-item>
        </ion-list>

        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="passwordReset" expand="block">Подтвердить</ion-button>
          </ion-col>
        </ion-row>
      </form>
  </ion-content>
</template>

<script>
import { modalController } from '@ionic/vue';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem } from '@ionic/vue';

import jQuery from "jquery";

export default {
  name: 'ModalUsernameConfirm',
  props: [ 'phone' ],
  data() {
    return {
      username: '',
    }
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem },
  methods: {
    closeModal(){
      return modalController.dismiss();
    },
    passwordReset(){
      let requestData = {
        user_phone: '+'+this.phone.replace(/\D/g,""),
        user_name:  this.username
      }
      jQuery.post( "https://api.tezkel.com/User/passwordReset", requestData)
      .done(function() {
        this.closeModal;
      })
      .fail(function(err) {
        this.closeModal;
        console.log(err.responseJSON.messages.error);
      });
    },
  }
};
</script>