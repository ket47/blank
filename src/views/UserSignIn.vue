<template>
  <base-layout page-title="Войти"  page-default-back-link="/home" :errorMessage="error">
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
                  placeholder="(900)-000-00-00"
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
              v-model="password" 
              name="password" 
              type="password" 
              :value="fields.password"
              autocorrect="off"
              @ionInput="fields.password = $event.target.value" 
              placeholder="Пароль (Минимум 6 символов)"
              required
            ></ion-input>
          </ion-item>

          <ion-text color="danger">
            <p v-show="!passwordValid && submitted == true" padding-left>Пароль должен содержать не менее 6 символов.</p>
          </ion-text>
        </ion-list>

        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="onSubmit" expand="block">Войти</ion-button>
          </ion-col>
        </ion-row>
        
        <ion-row responsive-sm>
          <ion-col>
          <router-link to="/sign-up">
            <ion-button color="light" expand="block">Зарегистрироваться</ion-button>
          </router-link>
          </ion-col>
        </ion-row>
        
        <ion-row responsive-sm>
          <ion-col>
              <ion-button @click="openModal" color="light" expand="block">Забыли пароль?</ion-button>
          </ion-col>
        </ion-row>

      </form>
  </base-layout>
</template>

<script>
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import ModalUsernameConfirm from '../components/ModalUsernameConfirm.vue'

import User from '../scripts/User.js'

import router from '../router';
import jQuery from "jquery";
import store from '../store';

import '../theme/form.css';

export default  {
  
  setup() {
    onIonViewDidEnter(() => {
      if(store.state.user.user_id && store.state.user.user_id > -1){
        return router.go(-1);
      } 
    });
  },
  name: 'SignIn',
  data(){
    return {
      error: '',
      submitted: false,
      config: {
        phoneMask: '(000)-000-00-00'
      },
      fields: {
        phonePrefix: '+7',
        phone: '9785141948',
        phoneBody: '9785141948',
        password: '123456'
      },
      modalOpen: false
    }
  },
  computed: {
    phoneValid() {
      return this.fields.phoneBody.replace(/\D/g,"").length == 10;
    },
    passwordValid() {
      return this.fields.password.length >= 6;
    }
  },
  methods:{
    onSubmit() {
      var self = this;
      this.submitted = true;
      if(!this.phoneValid || !this.passwordValid){
        return false;
      }
      let requestData = {
        user_phone: this.fields.phonePrefix + this.fields.phoneBody.replace(/\D/g,""),
        user_pass: this.fields.password,
        user_pass_confirm: this.fields.password
      }
      User.signIn(requestData, function(result){
        if(result.success){
            self.getUserData();
        } else {
            self.error = result.message;
            if(result.message == 'user_phone_unverified'){
              self.phoneVerify();
            }
        }
      });
    },
    getUserData(){
      var self = this;
      jQuery.post( store.state.hostname + "User/itemGet")
        .done(function(response, textStatus, request) {
          var sid=request.getResponseHeader('x-sid');
          store.commit('setSessionId', sid);
          store.commit('setUser', response);
          jQuery.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('x-sid',  sid);
            }
          })
          router.go(-1);
        })
        .fail(function(err) {
            self.error = err.responseJSON.messages.error;
        });
    },
    phoneVerify(){
      var self = this;
      jQuery.post( store.state.hostname + "User/phoneVerificationSend", {user_phone: '7' + this.fields.phoneBody.replace(/\D/g,"")})
        .done(function() {
            router.push({name: 'UserVerifyPhone', params: {phone: self.fields.phonePrefix + self.fields.phoneBody.replace(/\D/g,""), password: self.fields.password}});
        })
        .fail(function(err) {
            self.error = err.responseJSON.messages.error;
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
    },
    async openModal() {
      this.modalOpen = true;
      var self = this;
      const modal = await modalController
        .create({
          component: ModalUsernameConfirm,
          cssClass: 'my-custom-class',
          componentProps: {
            phone: self.fields.phonePrefix + self.fields.phoneBody.replace(/\D/g,"")
          }
        })
      return modal.present();
    } 
  }
}
</script>