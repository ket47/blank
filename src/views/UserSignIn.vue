<style scoped>
  ion-input,ion-select{
    border-bottom: 1px solid var(--ion-color-primary-tint);
  }
</style>
<template>
  <base-layout page-title="Вход в систему"  page-default-back-link="/home">
      <form novalidate>

      <ion-grid>
        <ion-row>
          <ion-col size="4">
            <ion-label position="stacked" color="primary">Код</ion-label>
            <ion-select 
              :value="fields.phonePrefix" 
              @ionChange="fields.phonePrefix = $event.target.value" 
            >
              <ion-select-option value="+7" >+7 </ion-select-option>
            </ion-select>
          </ion-col>
          <ion-col size="8">
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

        <ion-row>
          <ion-col>
            <ion-text color="danger">
              <p v-show="!phoneValid && submitted == true" padding-left>Неверный номер телефона</p>
            </ion-text>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-label position="stacked" color="primary">Пароль (Минимум 6 символов)</ion-label>
            <ion-input 
              v-model="fields.password" 
              name="password" 
              type="password" 
              autocorrect="off"
              placeholder="Пароль (Минимум 6 символов)"
              required
            ></ion-input>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
          <ion-text color="danger">
            <p v-show="!passwordValid && submitted == true" padding-left>Пароль должен содержать не менее 6 символов.</p>
          </ion-text>
          </ion-col>
        </ion-row>

        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="onSubmit" expand="block">Войти</ion-button>
          </ion-col>
        </ion-row>
        
        <ion-row responsive-sm>
          <ion-col>
            <ion-button color="light" expand="block" @click="$router.push({path: `/sign-up`})">Зарегистрироваться</ion-button>
          </ion-col>
        </ion-row>
        
        <ion-row responsive-sm>
          <ion-col>
              <ion-button @click="openModal" color="light" expand="block">Забыли пароль?</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      </form>
  </base-layout>
</template>

<script>
import { 
  IonLabel,
  IonSelectOption,
  IonSelect,
  IonCol,
  IonInput,
  IonRow,
  IonText,
  IonButton,
  IonGrid,
  modalController
}                               from '@ionic/vue';
import ModalUsernameConfirm     from '@/components/ModalUsernameConfirm.vue'
import User                     from '@/scripts/User.js'
import router                   from '@/router';
import heap                     from '@/heap';
import jQuery                   from "jquery";


export default{
  components:{
  IonLabel,
  IonSelectOption,
  IonSelect,
  IonCol,
  IonInput,
  IonRow,
  IonText,
  IonButton,
  IonGrid,
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
    async onSubmit() {
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
      try{
        await User.signIn(requestData);
        this.getUserData();
      } catch(err){
        const exception=err.responseJSON;
        const exception_code=exception.messages.error;
        switch(exception_code){
          case 'user_not_found':
            this.$flash("Пользователь не найден. Пройдите регистрацию.");
            break;
          case 'user_pass_wrong':
            this.$flash("Неверный пароль");
            break;
          case 'user_is_disabled':
            this.$flash("Пользователь отключен. Обратитесь к администратору");
            break;
          case 'user_is_deleted':
            this.$flash("Пользователь удален. Обратитесь к администратору");
            break;
          case 'user_phone_unverified':
            this.$flash("Номер телефона не подтвержден");
            this.phoneVerify();
            break;
        }
      }
    },
    async getUserData(){
      const userData=await User.get();
      heap.commit('setUser', userData);
      router.go(-1);
    },
    phoneVerify(){
      var self = this;
      jQuery.post( heap.state.hostname + "User/phoneVerificationSend", {user_phone: '7' + this.fields.phoneBody.replace(/\D/g,"")})
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
          componentProps: {
            phone: self.fields.phonePrefix + self.fields.phoneBody.replace(/\D/g,"")
          },
          initialBreakpoint: 0.3,
          breakpoints: [0.3, 0.6]
        })
      return modal.present();
    } 
  }
}
</script>