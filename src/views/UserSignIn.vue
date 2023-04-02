<style scoped>
  ion-input,ion-select{
    border-bottom: 1px solid var(--ion-color-primary-tint);
  }
</style>
<template>
  <base-layout page-title="Вход в систему" pageDefaultBackLink="/user">
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
          <ion-item lines="full">
            <div style="display:grid;grid-template-columns:100px auto">
              <div>
                  <ion-label position="stacked">Код</ion-label>
                  <ion-input readonly>+7</ion-input>
              </div>
              <div>
                  <ion-label position="stacked">Мобильный телефон*</ion-label>
                  <ion-input
                    v-model="user_phone"
                    @ionChange="phoneFormat()"
                    name="phone"
                    type="tel"
                    inputmode="tel"
                    placeholder="(xxx)xxxxxxxxx"
                    required
                  ></ion-input>            
                  <ion-text color="danger" slot="helper"><p v-show="!phoneValid && submitted == true" padding-left>Неверный номер телефона</p></ion-text>
              </div>
            </div>
            <ion-text color="danger" slot="helper">
              <p v-show="!phoneValid && submitted == true" padding-left>Неверный номер телефона</p>
            </ion-text>
          </ion-item>

          <ion-item lines="full">
            <ion-label position="stacked">Пароль (Минимум 4 символа)*</ion-label>
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
            <ion-button color="light" expand="block" @click="$go({path: `/user/sign-up`})">Зарегистрироваться</ion-button>
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
import UserPasswordReset     from '@/components/UserPasswordReset.vue'
import User                     from '@/scripts/User.js'
import router                   from '@/router';

export default{
  components:{
  IonLabel,
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
            localStorage.signInData = JSON.stringify({user_phone: this.user_phone_prefix+this.user_phone,user_pass: this.user_pass});
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
      this.modalOpen = true
      const phone=this.user_phone_prefix??''+this.user_phone??''
      const modal = await modalController
        .create({
          component: UserPasswordReset,
          componentProps: {phone},
          initialBreakpoint: 0.5,
          breakpoints: [0.5, 0.75]
        })
      return modal.present();
    },
    phoneVerify(){
      let requestData = {
        user_phone: this.user_phone_prefix+this.user_phone
      }
      try{
        this.$go({name:'UserVerifyPhone',query:requestData})
      } catch{
        this.$flash("Не удалось выслать смс с подтверждением")
      }
    },
  }
}
</script>