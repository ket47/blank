<template>
  <base-layout page-title="Мой профиль">
        <ion-list>
          <ion-radio-group v-model="fields.user_avatar_name">
          <ion-item>
            <ion-thumbnail slot="start"><img :src="$heap.state.hostname+'img/avatar/man.png'" /></ion-thumbnail>
            <ion-label>аватар 1</ion-label>
            <ion-radio slot="end" value="man" @ionFocus="save('user_avatar_name', $event.target.value)"></ion-radio>
          </ion-item>
          <ion-item>
            <ion-thumbnail slot="start"><img :src="$heap.state.hostname+'img/avatar/woman.png'" /></ion-thumbnail>
            <ion-label>аватар 2</ion-label>
            <ion-radio slot="end" value="woman" @ionFocus="save('user_avatar_name', $event.target.value)"></ion-radio>
          </ion-item>
          </ion-radio-group>
          <ion-item-divider>
            <ion-label>Данные пользователя</ion-label>
          </ion-item-divider>
          <ion-item>
            <ion-label position="stacked" color="primary">Ваш псевдоним</ion-label>
            <ion-input 
              v-model="fields.user_name" 
              name="user_name" 
              type="text" 
              @change="save('user_name', $event.target.value)" 
              placeholder="как к вам обращаться?"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Фамилия (не обязательно)</ion-label>
            <ion-input 
              v-model="fields.user_surname" 
              name="user_surname" 
              type="text" 
              @change="save('user_surname', $event.target.value)" 
              placeholder="Фамилия (не обязательно)"
            ></ion-input>
          </ion-item>
          <!--
          <ion-item>
            <ion-label position="stacked" color="primary">Отчество</ion-label>
            <ion-input 
              v-model="fields.user_middlename" 
              name="user_middlename" 
              type="text" 
              @change="save('user_middlename', $event.target.value)" 
              placeholder="Отчество"
            ></ion-input>
          </ion-item>
          -->
          <ion-item>
            <ion-label position="stacked" color="primary">Телефон</ion-label>
            <ion-input readonly
              v-model="fields.user_phone"
            ></ion-input>
            <ion-button slot="end" v-if="fields.user_phone && (!fields.user_phone_verified || fields.user_phone_verified === '0')" @click="phoneVerify" expand="block">Подтвердить</ion-button>
            <ion-button slot="end" v-if="fields.user_phone && fields.user_phone_verified && fields.user_phone_verified !== '0'" expand="block" disabled="true">Подтверждено</ion-button>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Электронная почта</ion-label>
            <ion-input 
              v-model="fields.user_email" 
              name="user_email" 
              type="email" 
              @change ="save('user_email', $event.target.value)" 
              placeholder="Электронная почта"
            ></ion-input>
          </ion-item>

        </ion-list>


          <ion-item-divider>
            <ion-label>Пароль пользователя</ion-label>
          </ion-item-divider>
        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="passwordReset()" expand="block"><ion-icon :icon="keyOutline" slot="start"/>Сбросить</ion-button>
          </ion-col>
          <ion-col>
            <ion-button id="passwordPromptButton" expand="block"><ion-icon :icon="keyOutline" slot="start"/>Изменить</ion-button>
          </ion-col>
        </ion-row>


    <ion-modal ref="passwordPrompt" trigger="passwordPromptButton" :initial-breakpoint="0.40" :breakpoints="[0, 0.40, 0.8]">
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-title>Новый пароль</ion-title>
          <ion-icon :icon="closeOutline" @click="()=>{this.$refs.passwordPrompt.$el.dismiss();}" slot="end" size="large"></ion-icon>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-label position="stacked">Новый пароль</ion-label>
          <ion-input v-model="fields.user_pass" type="text" placeholder="пароль"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Новый пароль (повтор)</ion-label>
          <ion-input v-model="fields.user_pass_confirm" type="text" placeholder="пароль (повтор)"></ion-input>
        </ion-item>
        <ion-button @click="passwordSave()" expand="full">Изменить</ion-button>
      </ion-content>
    </ion-modal>

  </base-layout>
</template>

<script>

import {
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonRadio,
  IonRadioGroup,
  IonInput,
  IonCol,
  IonRow,
  IonItemDivider,
  IonButton,
  IonModal,
  IonHeader,
  IonTitle,
  IonContent,
  IonIcon,
  IonToolbar,

}                   from '@ionic/vue'
import {
  closeOutline,
  keyOutline
}                   from 'ionicons/icons';
import jQuery       from "jquery";
//import User         from '@/scripts/User'

export default  {
  components:{
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonRadio,
  IonRadioGroup,
  IonInput,
  IonCol,
  IonRow,
  IonItemDivider,
  IonButton,
  IonModal,
  IonHeader,
  IonTitle,
  IonContent,
  IonIcon,
  IonToolbar,
  },
  setup(){
    return {closeOutline,keyOutline}
  },
  data(){
    return {
      config: {
        phoneMask: '+0(000)-000-00-00'
      },
      fields: this.$heap.state.user,
      passwordPromptShow:false
    }
  },
  computed: {
    isPhoneValid() {
      return this.fields.user_phone.replace(/\D/g,"").length == 11;
    }
  },
  methods:{
    async save(field_name, field_value) {
      if(field_name == 'user_phone'){
        if(!this.isPhoneValid){
          return false;
        }
        field_value = field_value.replace(/\D/g,"");
      }
      var requestData = {};
      requestData.user_id = this.$heap.state.user.user_id;
      requestData[field_name] = field_value;
      await this.itemUpdate(requestData)
      this.fields[field_name] = field_value
    },
    async itemUpdate(requestData) {
      try{
        await jQuery.post( `${this.$heap.state.hostname}User/itemUpdate`, JSON.stringify(requestData))
        //User.get()
        return true
      }catch(err){
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
            case 'user_pass_short':
              this.$flash("Пароль слишком короткий");
              break;
            case 'user_pass_notmatches':
              this.$flash("Пароль не совпадает с подтверждением");
              break;
          }
          return false
        }
    },
    phoneVerify(){
      const user_phone=this.fields.user_phone.replace(/\D/g,"")
      try{
        jQuery.post( `${this.$heap.state.hostname}User/phoneVerificationSend`, {user_phone})
        this.$router.push({name: 'UserVerifyPhone', params: {phone: user_phone}});
      }catch{/** */}
    },
    async passwordSave(){
      if(this.fields.user_pass!=this.fields.user_pass_confirm){
        this.$flash("Пароль и подтверждение не совпадают")
        return
      }
      const requestData={
        user_id:this.$heap.state.user.user_id,
        user_pass:this.fields.user_pass,
      }
      const updated=await this.itemUpdate(requestData)
      if( updated ){
        this.$refs.passwordPrompt.$el.dismiss()
        this.$flash("Пароль изменен")
      }
    },
    async passwordReset(){
      const request={
        user_phone:this.fields.user_phone,
        user_email:this.fields.user_email,
        user_name:this.fields.user_name
      }
      try{
        await jQuery.post( `${this.$heap.state.hostname}User/passwordReset`, request)
        this.$alert("Вам был выслан новый пароль","Пароль сброшен")
      }catch{/** */}
    },
    isPhoneValidate(ev) {
      this.fields.user_phone = ev.target.value;
      this.fields.user_phone = this.fields.user_phone.replace(/\D/g,"");
      if(this.fields.user_phone.length > 11){
        this.fields.user_phone = this.fields.user_phone.substring(0, 11);
      }
      let result = '';
      let numberIndex = 0; 
      for(let index in this.config.phoneMask){
        if(!this.fields.user_phone[numberIndex]){
          break;
        }
        let character = this.config.phoneMask[index];
        if(character == '0'){
          result += this.fields.user_phone[numberIndex];
          numberIndex++;
        } else {
          result += character
        }
      }
      this.fields.user_phone = result;
      return this.fields.user_phone;
    },
  },
  created(){
    const self=this
    this.$topic.on('userGet',user=>{
      self.fields=user
    })
  },
}
</script>