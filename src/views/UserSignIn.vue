<style scoped>
  ion-input,ion-select{
    border-bottom: 1px solid var(--ion-color-primary-tint);
  }
</style>
<template>
  <base-layout page-title="Вход в систему"  page-default-back-link="/home">
    <ion-card v-if="$heap.state.user.user_id>0" style="background-color:var(--ion-color-success-tint)">
      <ion-card-header>
        <ion-card-title color="primary">
          {{$heap.state.user.user_name}} {{$heap.state.user.user_surname}} {{$heap.state.user.user_middlename}}
        </ion-card-title>
      </ion-card-header>
      <ion-card-content>
        Вы уже вошли в систему с номером телефона <b>{{$heap.state.user.user_phone}}</b>
      </ion-card-content>
    </ion-card>

    <form novalidate>
        <ion-list>
          <ion-item>
            <ion-grid style="width:100%">
              <ion-row>
                <ion-col size="5">
                  <ion-label position="stacked" color="primary">Код</ion-label>
                  <ion-select :value="user_phone_prefix">
                    <ion-select-option value="7" selected>+7 </ion-select-option>
                  </ion-select>
                </ion-col>
                <ion-col size="7">
                  <ion-label position="stacked" color="primary">Мобильный телефон*</ion-label>
                  <ion-input
                    v-model="user_phone"
                    @ionChange="phoneFormat()"
                    name="phone"
                    type="tel"
                    inputmode="tel"
                    placeholder="(xxx)xxxxxxxxx"
                    required
                  ></ion-input>
                </ion-col>
              </ion-row>
            </ion-grid>
            <ion-text color="danger" slot="helper">
              <p v-show="!phoneValid && submitted == true" padding-left>Неверный номер телефона</p>
            </ion-text>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Пароль (Минимум 4 символа)*</ion-label>
            <ion-input 
              v-model="user_pass" 
              name="password" 
              type="password" 
              autocorrect="off"
              placeholder="Пароль (Минимум 4 символа)"
              required
            ></ion-input>
            <ion-text color="danger" slot="helper">
              <p v-show="!passwordValid && submitted == true" padding-left>Пароль должен содержать не менее 4 символов.</p>
            </ion-text>
          </ion-item>
        </ion-list>
      <ion-grid>
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonList,
  modalController
}                               from '@ionic/vue';
import ModalUsernameConfirm     from '@/components/ModalUsernameConfirm.vue'
import User                     from '@/scripts/User.js'
import router                   from '@/router';
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  },
  data(){
    return {
      submitted: false,
      user_pass:null,
      user_phone:null,
      user_phone_prefix:'7',
      modalOpen: false
    }
  },
  computed: {
    phoneValid() {
      return this.user_phone?.replace(/\D/g,"").length == 10;
    },
    passwordValid() {
      return this.user_pass?.length >= 4;
    }
  },
  created(){
    const signInCredentials=JSON.parse(localStorage.signInData??'{}');
    if( signInCredentials && signInCredentials.user_phone ){
        this.user_phone=signInCredentials.user_phone
        this.phoneFormat()
    }
    if( signInCredentials && signInCredentials.user_pass ){
        this.user_pass=signInCredentials.user_pass
    }
  },
  methods:{
    async onSubmit() {
      this.submitted = true;
      if(!this.phoneValid || !this.passwordValid){
        return false;
      }
      let requestData = {
        user_phone: this.user_phone_prefix+this.user_phone,
        user_pass: this.user_pass,
        user_pass_confirm: this.user_pass
      }
      try{
        await User.signIn(requestData);
        await User.get();
        router.go(-1);
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
          default:
            this.$flash("Не удалось войти в систему");
        }
      }
    },
    phoneFormat(){
      if( !this.user_phone ){
        this.user_phone='';
      }
      try{
        let user_phone=this.user_phone.replace(/\D/g,"")
        if(user_phone.length>10){
          user_phone=user_phone.substring(user_phone.length-10)
        }
        this.user_phone=user_phone
      } catch{/** */}
    },
    async openModal() {
      this.modalOpen = true;
      var self = this;
      const modal = await modalController
        .create({
          component: ModalUsernameConfirm,
          componentProps: {
            phone: self.user_phone
          },
          initialBreakpoint: 0.3,
          breakpoints: [0.3, 0.6]
        })
      return modal.present();
    },
    phoneVerify(){
      let requestData = {
        user_phone: this.user_phone_prefix+this.user_phone
      }
      try{
        this.$router.push({name:'UserVerifyPhone',query:requestData})
      } catch{
        this.$flash("Не удалось выслать смс с подтверждением")
      }
    },
  }
}
</script>