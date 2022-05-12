<template>
  <base-layout page-title="Зарегистрироваться"  page-default-back-link="/home">
      <form novalidate>
        <ion-list>
          <ion-item>
            <ion-row>
              <ion-col>
                <ion-label position="stacked" color="primary">Код</ion-label>
                <ion-select 
                  :value="fields.phonePrefix" 
                  @ionChange="fields.phonePrefix = $event.target.value" 
                >
                  <ion-select-option value="+7" >+7</ion-select-option>
                </ion-select>
              </ion-col>
              <ion-col>
                <ion-label position="stacked" color="primary">Телефон</ion-label>
                <ion-input
                  v-model="fields.phoneBody"
                  name="phone"
                  type="numeric"
                  inputmode="tel"
                  :value="fields.phoneBody"
                  @input="$event.target.value = phoneValidate($event);"
                  placeholder="(978)-000-00-00"
                  spellcheck="false"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-col>
            </ion-row>
          </ion-item>

          <ion-text color="danger">
            <p v-show="!phoneValid && submitted == true" padding-left>Неверный номер телефона</p>
          </ion-text>

          <ion-item>
            <ion-label position="stacked" color="primary">Пароль (Минимум 6 символов)</ion-label>
            <ion-input 
              v-model="fields.password" 
              name="password" 
              type="password"
              placeholder="Пароль (Минимум 6 символов)"
              required
            ></ion-input>
          </ion-item>

          <ion-text color="danger">
            <p v-show="!passwordValid && submitted == true" padding-left>Пароль должен содержать не менее 6 символов.</p>
          </ion-text>

          <ion-item>
            <ion-label position="stacked" color="primary">Имя пользователя</ion-label>
            <ion-input 
              v-model="fields.username" 
              name="username" 
              type="text" 
              placeholder="Имя пользователя"
              required
            ></ion-input>
          </ion-item>

          <ion-text color="danger">
            <p v-show="!usernameValid && submitted == true" padding-left>Неверное имя пользователя</p>
          </ion-text>

        </ion-list>

        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="onSubmit" expand="block">Зарегистрироваться</ion-button>
          </ion-col>
        </ion-row>
        
        <ion-row responsive-sm>
          <ion-col>
          <router-link to="/sign-in">
            <ion-button color="light" expand="block">Уже есть учетная запись?</ion-button>
          </router-link>
          </ion-col>
        </ion-row>
      </form>
  </base-layout>
</template>

<script>
import { 
  IonRow,
  IonCol, 
  IonSelect, 
  IonSelectOption,
  IonLabel,
  IonInput,
  IonItem,
  IonText,
  IonList,
  IonButton,

} from '@ionic/vue';

import User from '../scripts/User.js'

import router from '../router';

export default  {
  name: 'UserSignup',
  components: {
  IonRow,
  IonCol, 
  IonSelect, 
  IonSelectOption,
  IonLabel,
  IonInput,
  IonItem,
  IonText,
  IonList,
  IonButton,    
  },
  data(){
    return {
      error: '',
      submitted: false,
      config: {
        phoneMask: '(000)-000-00-00'
      },
      fields: {
        phonePrefix: '+7',
        phoneBody: '9785141948',
        password: '123456',
        username: 'Adam Hi'
      }
    }
  },
  computed: {
    phoneValid() {
      return this.fields.phoneBody.replace(/\D/g,"").length == 10;
    },
    passwordValid() {
      return this.fields.password.length >= 6;
    },
    usernameValid() {
      return this.fields.username.length > 0;
    }
  },
  methods:{
    onSubmit() {
      var self = this;
      this.submitted = true;
      if(!this.phoneValid || !this.passwordValid || !this.usernameValid){
        return false;
      }
      let requestData = {
        user_phone: this.fields.phonePrefix + this.fields.phoneBody.replace(/\D/g,""),
        user_pass: this.fields.password,
        user_pass_confirm: this.fields.password,
        user_name: this.fields.username
      }
      User.signUp(requestData, function(result){
        if(result.success){
          router.push('/sign-in');
        } else {
            self.error = result.message;
        }
      });
    },
    phoneValidate(ev) {
      this.fields.phoneBody = ev.target.value;
      this.fields.phoneBody = this.fields.phoneBody.replace(/\D/g,"");
      if(this.fields.phoneBody.length > 10){
        this.fields.phoneBody = this.fields.phoneBody.substring(0, 10);
      }
      let result = '';
      let numberIndex = 0; 
      for(let index in this.config.phoneMask){
        if(!this.fields.phoneBody[numberIndex]){
          break;
        }
        let character = this.config.phoneMask[index];
        if(character == '0'){
          result += this.fields.phoneBody[numberIndex];
          numberIndex++;
        } else {
          result += character
        }
      }
      this.fields.phoneBody = result;
      return this.fields.phoneBody;
    }
  }
}
</script>