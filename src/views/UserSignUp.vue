<template>
  <base-layout page-title="Регистрация нового пользователя"  page-default-back-link="/home">
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
      <ion-card v-else>
        <ion-card-header>
          <ion-card-title color="primary">
            Простая регистрация
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Для регистрации необходим только ваш номер мобильного телефона
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

          <ion-item>
            <ion-label position="stacked" color="primary">Повтор пароля*</ion-label>
            <ion-input 
              v-model="user_pass_confirm"
              type="password" 
              autocorrect="off"
              placeholder="Повтор пароля"
              required
            ></ion-input>
            <ion-text color="danger" slot="helper">
              <p v-show="user_pass!=user_pass_confirm && submitted == true" padding-left>Пароль не совпадает с подтверждением</p>
            </ion-text>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Ваш псевдоним*</ion-label>
            <ion-input 
              v-model="user_name"
              name="username"
              type="text" 
              placeholder="как к вам обращаться?"
              required
            ></ion-input>
            <ion-text color="danger" slot="helper">
              <p v-show="!usernameValid && submitted == true" padding-left>Проверьте ваш псевдоним</p>
            </ion-text>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Ваш е-маил (не обязательно)</ion-label>
            <ion-input 
              v-model="user_email"
              name="email"
              type="email" 
              placeholder="е-маил"
              required
            ></ion-input>
          </ion-item>
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
  IonGrid,
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
}                               from '@ionic/vue';
import User                     from '@/scripts/User.js'
import jQuery                   from "jquery";

export default  {
  components: {
  IonGrid,
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  },
  data(){
    return {
      submitted: false,
      user_pass:null,
      user_pass_confirm:null,
      user_phone:null,
      user_phone_prefix:'7',
      user_name:null,
      user_email:null
    }
  },
  computed: {
    phoneValid() {
      return this.user_phone?.replace(/\D/g,"").length == 10;
    },
    passwordValid() {
      return this.user_pass?.length >= 4;
    },
    usernameValid() {
      return this.user_name?.length > 0;
    }
  },
  methods:{
    async onSubmit() {
      this.submitted = true;
      if( this.user_pass!=this.user_pass_confirm || !this.phoneValid || !this.passwordValid || !this.usernameValid){
        return
      }
      let requestData = {
        user_phone: this.user_phone_prefix+this.user_phone,
        user_pass: this.user_pass,
        user_pass_confirm: this.user_pass_confirm,
        user_name: this.user_name,
        user_email:this.user_email
      }
      
      try{
        await User.signUp(requestData);
        localStorage.signInData = JSON.stringify({user_phone: this.user_phone_prefix+this.user_phone,user_pass: this.user_pass});
        this.phoneVerify()
      } catch(err){
        let exception_code='unknown';
        try{
          const invalid_field=Object.keys(JSON.parse(err.responseJSON.messages.error))[0]
          const invalid_reason=Object.values(JSON.parse(err.responseJSON.messages.error))[0]
          exception_code=invalid_field+'_'+invalid_reason
        }catch{/** */}
        
        switch(exception_code){
          case 'user_phone_notunique':
            this.$flash("Пользователь с таким телефоном уже зарегистрирован");
            break;
          case 'user_phone_required':
          case 'user_phone_invalid':
          case 'user_phone_short':
            this.$flash("Проверьте номер телефона");
            break;
          case 'user_name_required':
          case 'user_name_short':
            this.$flash("Проверьте ваш псевдоним");
            break;
          case 'user_email_invalid':
            this.$flash("Проверьте ваш е-маил");
            break;
          case 'user_email_notunique':
            this.$flash("Такой е-маил уже используется");
            break;
          case 'user_pass_required':
            this.$flash("Пароль обязателен для заполнения");
            break;
          case 'user_pass_short':
            this.$flash("Пароль слишком короткий");
            break;
          case 'user_pass_notmatches':
            this.$flash("Пароль не совпадает с подтверждением");
            break;
          default:
            this.$flash("Не удалось войти зарегистрироваться");
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
    async phoneVerify(){
      let requestData = {
        user_phone: this.user_phone_prefix+this.user_phone
      }
      try{
        this.$router.push({name:'UserVerifyPhone',params:requestData})
      } catch{
        this.$flash("Не удалось выслать смс с подтверждением")
      }
    },
  }
}
</script>