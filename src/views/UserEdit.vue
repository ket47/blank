<template>
  <base-layout page-title="Мой профиль"  page-default-back-link="/user-dashboard" :errorMessage="error">
        <ion-list>
          <ion-item>
            <ion-label position="stacked" color="primary">Аватар</ion-label>
            <ion-radio-group :value="fields.user_avatar_name">
              <ion-list style="margin-top:5px">
                <ion-item>
                  <ion-thumbnail>
                    <img :src="$heap.state.hostname+'img/avatar/man.png'" />
                  </ion-thumbnail>
                  <ion-label>Муж.</ion-label>
                  <ion-radio value="man" @ionFocus="save('user_avatar_name', $event.target.value)"></ion-radio>
                </ion-item>
                <ion-item>
                  <ion-thumbnail>
                    <img :src="$heap.state.hostname+'img/avatar/woman.png'" />
                  </ion-thumbnail>
                  <ion-label>Жен.</ion-label>
                  <ion-radio value="woman" @ionFocus="save('user_avatar_name', $event.target.value)"></ion-radio>
                </ion-item>
              </ion-list>
            </ion-radio-group>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Имя</ion-label>
            <ion-input 
              v-model="fields.user_name" 
              name="user_name" 
              type="text" 
              :value="fields.user_name"
              @change="save('user_name', $event.target.value)" 
              placeholder="Имя"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Фамилия</ion-label>
            <ion-input 
              v-model="fields.user_surname" 
              name="user_surname" 
              type="text" 
              :value="fields.user_surname"
              @change="save('user_surname', $event.target.value)" 
              placeholder="Фамилия"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Отчество</ion-label>
            <ion-input 
              v-model="fields.user_middlename" 
              name="user_middlename" 
              type="text" 
              :value="fields.user_middlename"
              @change="save('user_middlename', $event.target.value)" 
              placeholder="Отчество"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked" color="primary">Телефон</ion-label>
            <ion-input
              v-model="fields.user_phone"
              name="user_phone"
              type="numeric"
              inputmode="tel"
              :value="fields.user_phone"
              @input="$event.target.value = phoneValidate($event);"
              @change="save('user_phone', $event.target.value)"
              placeholder="7(978)-000-00-00"
              spellcheck="false"
              autocapitalize="off"
              required
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
              :value="fields.user_email"
              @change ="save('user_email', $event.target.value)" 
              placeholder="Электронная почта"
            ></ion-input>
          </ion-item>

        </ion-list>

        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="passwordReset" expand="block">Сбросить пароль</ion-button>
          </ion-col>
        </ion-row>
  </base-layout>
</template>

<script>
import router from '../router';
import jQuery from "jquery";
import heap from '../heap';



export default  {
  name: 'SignIn',
  data(){
    return {
      error: '',
      submitted: false,
      config: {
        phoneMask: '+0(000)-000-00-00'
      },
      fields: heap.state.user,
      modalOpen: false
    }
  },
  computed: {
    phoneValid() {
      return this.fields.user_phone.replace(/\D/g,"").length == 11;
    }
  },
  methods:{
    save(field_name, field_value) {
      var self = this;
      this.submitted = true;
      if(field_name == 'user_phone'){
        if(!this.phoneValid){
          return false;
        }
        field_value = field_value.replace(/\D/g,"");
      }
      var requestData = {};
      requestData.user_id = heap.state.user.user_id;
      requestData[field_name] = field_value;
      jQuery.post( heap.state.hostname + "User/itemUpdate", JSON.stringify(requestData))
        .done(function(response) {
            console.log(response);
            self.getUserData();
        })
        .fail(function(err) {
            self.error = err.responseJSON.messages.error;
      });
    },
    getUserData(){
      var self = this;
      jQuery.post( heap.state.hostname + "User/itemGet")
        .done(function(response) {
            heap.commit('setUser', response);
            self.fields = response;
        })
        .fail(function(err) {
            self.error = err.responseJSON.messages.error;
        });
    },
    phoneVerify(){
      var self = this;
      jQuery.post( heap.state.hostname + "User/phoneVerificationSend", {user_phone: this.fields.user_phone.replace(/\D/g,"")})
        .done(function() {
            router.push({name: 'UserVerifyPhone', params: {phone: self.fields.user_phone.replace(/\D/g,"")}});
        })
        .fail(function(err) {
            self.error = err.responseJSON.messages.error;
        });
    },
    phoneValidate(ev) {
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
  watch: {
    '$route' (to, from) {
      if(to.path != from.path) { 
        this.fields = heap.state.user
      }
    }
  }
}
</script>