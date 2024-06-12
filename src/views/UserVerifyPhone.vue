<template>
  <base-layout page-title="Подтверждение телефона" pageDefaultBackLink="/user">
      <ion-card color="light">
        <ion-card-header>
          <ion-card-title color="primary">
            Подтверждение номера телефона
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>Мы выслали вам смс с кодом подтверждения на номер <b>{{user_phone}}</b>. Введите 4 цифры из смс ниже</p>
          <hr/>
          <p>Поступление СМС на ваш телефон может занять до 2 минут.</p>
        </ion-card-content>
      </ion-card>

      <form novalidate>
        <ion-list>
          <ion-item>
                <ion-input
                  v-model="verification_code"
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
                ></ion-input>
          </ion-item>
        </ion-list>

        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="onSubmit()" expand="block">Подтвердить</ion-button>
          </ion-col>
        </ion-row>

        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="is_sent=false;smsSend()" expand="block" color="light" :disabled="timeToResend>0">Послать снова {{timeLeft}}</ion-button>
          </ion-col>
        </ion-row>
      </form>
  </base-layout>
</template>

<script>
import { 
  IonLabel,
  IonCol,
  IonInput,
  IonRow,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonList,
}                     from '@ionic/vue';
import jQuery         from "jquery";
import User           from '@/scripts/User.js';

export default  {
  name:'UserVerifyPhone',
  components:{
  IonLabel,
  IonCol,
  IonInput,
  IonRow,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonList,
  },
  data(){
    return {
      verification_code:null,
      user_phone:this.$heap.state.user.tmp_userphone||this.$route.params.user_phone||this.$route.query.user_phone||'',//this.$heap.state.user.tmp_userphone seems is more reliable
      is_sent:false,
      timeToResend:120
    }
  },
  async created(){
    this.smsSend();
    if( navigator.credentials ){
      try{
        const otp=await navigator.credentials.get({
          otp: {transport:["sms"]}
        })
        this.verification_code = otp.code
      } catch (err){
        console.log(err)
      }
    }
  },
  ionViewDidEnter(){
    this.smsSend();
  },
  computed:{
    timeLeft(){
      const min=Math.floor(this.timeToResend/60);
      const sec=this.timeToResend-60*min;
      return `${min}:${sec}`
    }
  },
  methods:{
    clockStart(){
      if(this.timeToResend<=0){
        return
      }
      this.timeToResend--
      setTimeout(()=>this.clockStart(),1000)
    },
    async smsSend(){
      if(this.is_sent){
        return
      }
      //this.user_phone=this.$route.params.user_phone||this.$route.query.user_phone||'';
      if(!this.user_phone){
        this.$router.replace('/user')
        return;
      }
      let requestData = {
        user_phone: this.user_phone
      }
      try{
        this.is_sent=true
        await jQuery.post( `${this.$heap.state.hostname}User/phoneVerificationSend`, requestData)
        this.timeToResend=120
        this.clockStart()
      }catch{/** */}
    },
    async onSubmit() {
      if( !this.verification_code || String(this.verification_code).length!=4 ){
        return
      }
      try{
        await jQuery.post( `${this.$heap.state.hostname}/User/phoneVerificationCheck`, {user_phone: this.user_phone, verification_code: this.verification_code})
        this.$flash("Номер телефона верифицирован")
        this.$router.replace('/user')
        await User.autoSignIn()
        this.$go('/catalog')
      } catch(err){
        const message=err.responseJSON.messages.error
        switch(message){
          case 'verification_not_found':
            this.$flash("Код верификации устарел")
            this.$router.replace('/user/sign-in')
            break;
        }
        this.$flash("Не удалось верифицировать телефон")
      }
    },
  },
  watch:{
    "verification_code":function(newval,oldval){
      this.onSubmit()
    }
  }
}
</script>