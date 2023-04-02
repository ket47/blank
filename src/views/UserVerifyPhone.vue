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
            <ion-row>
              <ion-col>
                <ion-label position="stacked" color="primary">Код подтверждения из смс</ion-label>
                <ion-input
                  v-model="verification_code"
                  type="numeric"
                  inputmode="numeric"
                  placeholder="- - - -"
                  @ionInput="verification_code=$event.target.value;onSubmit()"
                  enterkeyhint="go"
                  required
                ></ion-input>
              </ion-col>
            </ion-row>
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
      user_phone:this.$route.params.user_phone||this.$route.query.user_phone||'',
      is_sent:false,
      timeToResend:120
    }
  },
  created(){
    this.smsSend();
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
      this.user_phone=this.$route.params.user_phone||this.$route.query.user_phone||'';
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
}
</script>