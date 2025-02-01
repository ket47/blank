<style scoped>
  .vspace{
    height: 15px;
  }
  h4,p{
    -text-align:center;
  }
  ion-breadcrumb{
    font-size:0.9em
  }
</style>
<template>
  <base-layout page-title="Вход в профиль" pageDefaultBackLink="/user">
    

    <form novalidate onsubmit="return false">
    <div style="display:grid;grid-template-columns:auto minmax(330px,400px) auto;width:100%;min-height:80vh">
      <div></div>
      <!--PHONE ENTRY SCREEN-->
      <section v-if="screen=='enter_phone'" class="ion-padding">
        <h4>Введите номер телефона</h4>
        <p style="color:var(--ion-color-medium);font-size:0.9em;">
          Для входа в профиль или регистрации
        </p>

        <div class="vspace"></div>
        <ion-input 
          ref="uphone"
          fill="outline" 
          mode="md"
          placeholder="7 (___) ___ __ __"
          name="phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel-national"
          v-model="user_phone"
          @ionInput="phoneFormat($event)"
          @keyup.enter="phoneSubmit()"
          label="Номер телефона"
          label-placement="stacked"
        ></ion-input>

        <div class="vspace"></div>
        <ion-text color="danger" v-show="!phoneIsValid && phoneSubmitted == 1">
          Проверьте номер телефона
        </ion-text>
        <ion-button v-if="phoneIsValid" @click="phoneSubmit" expand="block">Продолжить</ion-button>
        <ion-button v-else @click="$refs.uphone.$el.setFocus()" expand="block" color="light">Заполнить номер</ion-button>

        <div class="vspace"></div>
        <ion-text  color="medium" style="text-align:center;color:var(--ion-color-medium);font-size:0.7em;">
          Нажатием кнопки Продолжить, вы соглашаетесь с <b @click="$go('/page/rules-customer')"><u>Правилами пользования</u></b> и <b @click="$go('/page/privacy_policy')"><u>Политикой конфиденциальности</u></b>
        </ion-text>
      </section>


      <!--PASS ENTRY SCREEN-->
      <section v-if="screen=='enter_pass'" class="ion-padding">
        <h4>Введите пароль</h4>
        <p style="color:var(--ion-color-medium);font-size:0.9em;">
          Если вы не знаете пароль, войдите с помошью смс кода.
        </p>
        <ion-input 
          ref="uphone"
          fill="outline" 
          mode="md"
          placeholder="7 (XXX) XXX XX XX"
          name="phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel-national"
          v-model="user_phone"
          @ionInput="phoneFormat($event)"
          @ionChange="phoneSubmit()"
          label="Номер телефона"
          label-placement="stacked"
        ></ion-input>

        <div class="vspace"></div>
        <ion-input
          ref="upass"
          fill="outline" 
          mode="md"
          v-model="user_pass"
          name="password" 
          type="password"
          required
          label="Пароль"
          label-placement="stacked"
          @keyup.enter="passSubmit()"
        ></ion-input>

        <div class="vspace"></div>
        <ion-button @click="passSubmit" expand="block" :disabled="!passwordIsValid">Вход</ion-button>

        <div class="vspace"></div>
        <ion-button @click="codeSend" expand="block" color="success"><ion-icon :src="chatboxEllipsesOutline" slot="start"/>Войти СМС кодом</ion-button>
      </section>


      <!--CODE ENTRY SCREEN-->
      <section v-if="screen=='enter_code'" class="ion-padding">
        <h4>Введите код из смс</h4>
        <p style="color:var(--ion-color-medium);font-size:0.9em;">
          Смс с кодом подтверждения отправлен на телефон
        </p>
        <p style="color:var(--ion-color-medium);">
           <b>{{user_phone}}</b>
        </p>

        <div class="vspace"></div>
        <ion-input
          ref="ucode"
          fill="outline" 
          mode="md"
          v-model="codeValue"
          type="numeric"
          inputmode="numeric"
          maxlength="4"
          pattern="\d{4}"
          placeholder="- - - -"
          enterkeyhint="go"
          required
          autocomplete="one-time-code"
          label="Код подтверждения из смс"
          label-placement="stacked"
          @ionInput="codeSubmit($event)"
        ></ion-input>

        <div class="vspace"></div>
        <ion-button @click="codeSubmit()" expand="block" :disabled="!codeIsValid">Продолжить</ion-button>

        <div class="vspace"></div>
        <ion-item v-if="codeResendTime>0" lines="none">
          Вы получите код в течение {{codeArriveAt}}
        </ion-item>
        <ion-item v-else lines="none">
          Смс с кодом не пришла? <ion-chip slot="end" @click="codeSend" color="primary">Послать еще раз</ion-chip>
        </ion-item>
        <div class="vspace"></div>
        <ion-button @click="screen='enter_phone'" expand="block" fill="clear" color="medium">Изменить номер телефона</ion-button>
      </section>

      <!--USER CREATE PASS-->
      <section v-if="screen=='enter_createpass'" class="ion-padding">
        <h4>Пароль</h4>
        <p style="color:var(--ion-color-medium);font-size:0.9em;">
          Вы можете установить пароль, что позволит входить в систему без получения кода подтверждения на телефон
        </p>

        <div class="vspace"></div>
        <ion-list>
          <ion-item lines="none">
            <ion-icon slot="start" :src="keyOutline"/>
            <ion-checkbox v-model="registerWithPass" value="1">Создать пароль</ion-checkbox>
          </ion-item>
          <ion-item v-if="registerWithPass" lines="none">
            <ion-input
              v-model="user_pass"
              name="password"
              type="password"
              placeholder="напишите пароль"
              required
              label="Пароль"
              label-placement="stacked"
            ></ion-input>
          </ion-item>
          <ion-item v-if="registerWithPass && user_pass">
            <ion-input
              v-model="user_pass_confirm"
              type="password"
              placeholder="напишите повтор"
              required
              label="Пароль повтор"
              label-placement="stacked"
            ></ion-input>
          </ion-item>
          <p v-if="user_pass && user_pass!=user_pass_confirm" class="ion-padding">
            Пароли должны совпадать
          </p>

        </ion-list>
        <div class="vspace"></div>
        <ion-button @click="userformOpen()" expand="block" v-if="user_pass">Продолжить</ion-button>

        <ion-button @click="userformOpen()" expand="block" v-if="!user_pass">Пропустить</ion-button>
        <p style="color:var(--ion-color-medium);font-size:0.9em;text-align:center" v-if="!user_pass">
          Вы зарегистрируетесь без пароля
        </p>
        <div class="vspace"></div>
        <ion-button @click="screen='enter_phone'" expand="block" fill="clear" color="medium">Изменить номер телефона</ion-button>
      </section>

      <!--USER DATA-->
      <section v-if="screen=='enter_data'" class="ion-padding">
        <h4>Анкета пользователя</h4>
        <div class="vspace"></div>
        <ion-list>
          <ion-item>
            <ion-input
              v-model="user_name"
              placeholder="напишите имя"
              required
              label="Как к вам обращаться *"
              label-placement="stacked"
              ref="uname"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-input
              v-model="user_birthday"
              type="date"
              placeholder=""
              required
              label="День рождения"
              label-placement="stacked"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-input
              v-model="user_email"
              type="email"
              placeholder=""
              required
              label="День рождения (желательно заполнить)"
              label-placement="stacked"
            ></ion-input>
          </ion-item>
        </ion-list>

        <h4>Ваш аватар</h4>
        <ion-segment mode="ios" v-model="user_avatar_name">
          <ion-segment-button value="man">
            <ion-avatar><img :src="$heap.state.hostname+'img/avatar/man.png'" /></ion-avatar>
          </ion-segment-button>
          <ion-segment-button value="woman">
            <ion-avatar><img :src="$heap.state.hostname+'img/avatar/woman.png'" /></ion-avatar>
          </ion-segment-button>
        </ion-segment>
<!--
        <h4>Код из смс</h4>
        <div class="vspace"></div>
        <ion-item>
          <ion-input
            ref="ucode"
            v-model="codeValue"
            type="numeric"
            inputmode="numeric"
            maxlength="4"
            pattern="\d{4}"
            placeholder="- - - -"
            enterkeyhint="go"
            required
            autocomplete="one-time-code"
            label="Код подтверждения из смс*"
            label-placement="stacked"
          ></ion-input>
        </ion-item>
        <div class="vspace"></div>
        <ion-item v-if="codeResendTime>0" lines="none">
          Вы получите код в течение {{codeArriveAt}}
        </ion-item>
        <ion-item v-else lines="none">
          Смс с кодом не пришла? <ion-chip slot="end" @click="phoneSubmit" color="primary">Послать еще раз</ion-chip>
        </ion-item>
-->


        <div class="vspace"></div>
        <ion-button @click="registrationSubmit" expand="block" v-if="user_name">Готово</ion-button>
        <ion-button  @click="$refs.uname.$el.setFocus()" expand="block" v-else color="light">Заполнить имя</ion-button>
        <div class="vspace"></div>
      </section>



      
      <div></div>
    </div>
    </form>
  </base-layout>
</template>

<script>
import { 
  IonText,
  IonButton,
  IonItem,
  IonList,
  IonInput,
  IonCheckbox,
  IonSegment,
  IonSegmentButton,
  IonAvatar,
  IonIcon,
  IonChip,
}                               from '@ionic/vue';
import jQuery                   from 'jquery'
import User                     from '@/scripts/User.js'



import { 
  giftOutline,
  personOutline,
  keyOutline,
  atOutline,
  chatboxEllipsesOutline,
}                         from "ionicons/icons";

export default{
  components:{
  IonText,
  IonButton,
  IonItem,
  IonList,
  IonInput,
  IonCheckbox,
  IonSegment,
  IonSegmentButton,
  IonAvatar,
  IonIcon,
  IonChip,
  },
  setup(){
    return {
      giftOutline,
      personOutline,
      keyOutline,
      atOutline,
      chatboxEllipsesOutline,
    }
  },
  data(){
    return {
      user_phone:'',
      user_name:null,
      user_email:null,
      user_avatar_name:'man',
      user_birthday:null,
      user_pass:null,
      user_pass_confirm:null,

      screen:'enter_phone',
      codeValue:null,
      passValue:null,
      codeResendTime:0,
      phoneSubmitted:0,
      signinOptions:{},
      registerWithPass:0,
    }
  },
  computed: {
    phoneIsValid() {
      return this.user_phone?.replace(/\D/g,"").length == 11;
    },
    passwordIsValid() {
      return this.user_pass?.length >= 4;
    },
    codeIsValid(){
      return this.codeValue?.replace(/\D/g,"").length == 4;
    },
    codeArriveAt(){
      const min=Math.floor(this.codeResendTime/60);
      const sec=this.codeResendTime-60*min;
      return (min>0?`${min} мин `:'') + (`${sec} сек`)
    },

  },
  methods:{
    phoneFormat(ev){
      const value = ev.target?.value
      let filteredValue = value.replace(/[^0-9]+/g, '') || ''
      if(filteredValue.substring(0,1)!='7'){
        filteredValue='7'+filteredValue
      }
      if(filteredValue.length>11){
        filteredValue=filteredValue.substring(filteredValue.length-11)
      }
      setTimeout(()=>{
        this.user_phone=filteredValue
      },50)
    },
    async phoneSubmit(){
      this.phoneSubmitted=1
      if( !this.phoneIsValid ){
        return false
      }
      const request={
        user_phone:this.user_phone
      }
      try{
        this.signinOptions=await jQuery.post( `${this.$heap.state.hostname}User/signInOptionsGet`, request)
        if( this.signinOptions.is_signedin==1 ){
          this.$flash("Вы вошли в профиль");
          this.$router.go(-1);
          return
        }
        if( this.signinOptions.is_deleted==1 ){
          this.$flash("Ваш профиль удален");
          return
        }
        if( this.signinOptions.is_disabled==1 ){
          this.$flash("Ваш профиль заблокирован");
          return
        }
        if( this.signinOptions.by_pass==1 ){
          this.screen='enter_pass'
          setTimeout(()=>{
            this.$refs.upass.$el.setFocus()
          },100)
          return
        }
        if( this.signinOptions.by_code==1 ){
          this.codeSend()
          return
        }
      } catch(err){
        const exception_code=err?.responseJSON?.messages?.error;
        switch(exception_code){
            case 'notfound'://new user
              /**
               * This is a new User. So confirm its phone number, then collect data
               */
              this.signinOptions={is_newuser:1}
              this.codeSend()
              break;
            default:
              this.$flash("Не удалось отправить код")
              break;
        }
      }
    },

    async passSubmit() {
      this.submitted = true;
      if(!this.phoneIsValid || !this.passwordIsValid){
        return false;
      }
      let request = {
        user_phone: this.user_phone,
        user_pass: this.user_pass,
        user_pass_confirm: this.user_pass
      }
      try{
        await jQuery.post( `${this.$heap.state.hostname}User/signIn`, request)
        const user=await User.get();
        this.$flash(`Добро пожаловать ${user.user_name}`)
        this.$router.go(-1)
      } catch(err){
        const exception_code=err?.responseJSON?.messages?.error
        switch(exception_code){
          case 'user_not_found':
            this.$flash("Пользователь не найден. Пройдите регистрацию.");
            break;
          case 'user_pass_wrong':
            this.$flash("Неверный пароль");
            break;
          case 'user_code_wrong':
            this.$flash("Неверный код подтверждения");
            break;
          case 'user_is_disabled':
            this.$flash("Пользователь отключен. Обратитесь к администратору");
            break;
          case 'user_is_deleted':
            this.$flash("Пользователь удален. Обратитесь к администратору");
            break;
          case 'user_phone_unverified':
            this.$flash("Номер телефона не подтвержден");
            this.codeSend();
            break;
          default:
            this.$flash("Не удалось войти в профиль");
        }
      }
    },
    
    async codeSend(){
      this.phoneSubmitted=1
      if( !this.phoneIsValid ){
        return false
      }
      const request={
        user_phone:this.user_phone
      }
      try{
        this.screen='enter_code'
        await jQuery.post( `${this.$heap.state.hostname}User/phoneVerificationSend`, request)
        this.codeCapture()
        this.codeClockTick(120)
        this.$refs.ucode.$el.setFocus()
      } catch(err){
        const exception_code=err?.responseJSON?.messages?.error;
        switch(exception_code){
            case 'verification_target_invalid':
              this.$flash("Неверный формат номера телефона")
              break;
            case 'verification_already_sent':
              this.$flash("Код уже послан")
              break;
            default:
              this.$flash("Не удалось отправить код")
              break;
        }
      }
    },

    async codeCapture(){
      if( navigator.credentials ){
        try{
          const otp=await navigator.credentials.get({
            otp: {transport:["sms"]}
          })
          this.codeValue = otp.code
          this.codeSubmit()
        } catch (err){/** */}
      }
    },

    codeClockTick( timeLeft ){
      if(timeLeft<0){
        return
      }
      this.codeResendTime=timeLeft
      setTimeout(()=>this.codeClockTick(this.codeResendTime-1),1000)
    },

    async codeSubmit( ev ) {
      if( ev ){
        this.codeValue = ev.target?.value
      }
      if(!this.phoneIsValid || !this.codeIsValid){
        return false;
      }
        /**
         * User can't sign in by code
         * Perhaps he is not signed up yet
         */
      if( this.signinOptions.is_newuser==1 || this.signinOptions.by_code!=1 ){
        this.codeVerify()
        return
      }
      this.codeSignIn()
    },

    async codeVerify(){
      try{
        const request={
          verification_type:'phone',
          verification_target:this.user_phone,
          verification_value:this.codeValue,
        }
        await jQuery.post( `${this.$heap.state.hostname}User/verificationCheck`, request)
        this.screen='enter_createpass'
      } catch(err){
        const exception_code=err?.responseJSON?.messages?.error;
        switch(exception_code){
            default:
              this.$flash("Не верный код подтверждения")
              break;
        }
      }
    },

    async codeSignIn(){
      let request = {
        user_phone: this.user_phone,
        user_ota_code: this.codeValue,
      }
      try{
        await jQuery.post( `${this.$heap.state.hostname}User/signInByCode`, request)
        const user=await User.get();
        this.$flash(`Добро пожаловать ${user.user_name}`)
        this.$router.go(-1);
      } catch(err){
        const exception_code=err?.responseJSON?.messages?.error
        switch(exception_code){
          case 'user_not_found':
            this.$flash("Пользователь не найден. Пройдите регистрацию.");
            break;
          case 'user_pass_wrong':
            this.$flash("Неверный пароль");
            break;
          case 'user_code_wrong':
            this.$flash("Не верный код подтверждения");
            break;
          case 'user_is_disabled':
            this.$flash("Пользователь отключен. Обратитесь к администратору");
            break;
          case 'user_is_deleted':
            this.$flash("Пользователь удален. Обратитесь к администратору");
            break;
          case 'user_phone_unverified':
            this.$flash("Номер телефона не подтвержден");
            this.codeSend();
            break;
          default:
            this.$flash("Не удалось войти в профиль");
        }
      }

    },
    async userformOpen(){
      this.phoneSubmitted=1
      if( !this.phoneIsValid ){
        return false
      }
      this.screen='enter_data'
      setTimeout(()=>{
        this.$refs.uname && this.$refs.uname.$el.setFocus()
      },100)
    },
    async registrationSubmit(){
      if(!this.user_name){
        this.$flash("Имя не должно быть пустым")
        return 
      }
      try{
        const request={
          user_phone:this.user_phone,
          user_name:this.user_name,
          user_birthday:this.user_birthday||null,
          user_avatar_name:this.user_avatar_name,

          user_email:this.user_email,
          user_pass:this.user_pass,
          user_pass_confirm:this.user_pass_confirm,
          user_ota_code:this.codeValue,

          inviter_user_id: localStorage.inviter_user_id ?? 0,
          /**
           * @todo handle this
           */
          metric_id:0,//
        }
        const response=await jQuery.post( `${this.$heap.state.hostname}User/signUp`, request)
        const user=await User.get();
        this.$flash(`Добро пожаловать ${user.user_name}`)
        this.$router.go(-1);
      } catch(err){
        let exception_code = "unknown";
        try {
          const invalid_field = Object.keys(
            JSON.parse(err.responseJSON.messages.error)
          )[0];
          const invalid_reason = Object.values(
            JSON.parse(err.responseJSON.messages.error)
          )[0];
          exception_code = invalid_field + "_" + invalid_reason;
        } catch {
          /** */
        }

        switch (exception_code) {
          case "user_phone_notunique":
            this.$flash("Пользователь с таким телефоном уже зарегистрирован");
            break;
          case "user_phone_required":
          case "user_phone_invalid":
          case "user_phone_short":
            this.$flash("Проверьте номер телефона");
            break;
          case "user_name_required":
          case "user_name_short":
            this.$flash("Проверьте ваш псевдоним");
            break;
          case "user_email_invalid":
            this.$flash("Проверьте ваш е-маил");
            break;
          case "user_email_notunique":
            this.$flash("Такой е-маил уже используется");
            break;
          case "user_pass_required":
            this.$flash("Пароль обязателен для заполнения");
            break;
          case "user_pass_short":
            this.$flash("Пароль слишком короткий");
            break;
          case "user_pass_notmatches":
            this.$flash("Пароль не совпадает с подтверждением");
            break;
          default:
            this.$flash("Не удалось зарегистрироваться");
        }
      }

    }
  },
  mounted(){
    setTimeout(()=>{
      this.$refs.uphone && this.$refs.uphone.$el.setFocus()
    },100)
  }
}
</script>