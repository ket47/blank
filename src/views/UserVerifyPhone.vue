<template>
  <base-layout page-title="Подтверждение телефона" page-default-back-link="/home" :errorMessage="error">
      <form novalidate>
        <ion-list>
          <ion-item>
            <ion-row>
              <ion-col>
                <ion-label position="stacked" color="primary">Код</ion-label>
                <ion-input
                  v-model="fields.code"
                  name="code"
                  type="numeric"
                  inputmode="tel"
                  :value="fields.code"
                  @input="fields.code = $event.target.value"
                  placeholder="- - - -"
                  required
                ></ion-input>
              </ion-col>
            </ion-row>
          </ion-item>
        </ion-list>

        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="onSubmit" expand="block">Подтвердить</ion-button>
          </ion-col>
        </ion-row>
      </form>
  </base-layout>
</template>

<script>
import jQuery from "jquery";
import router from '../router';
import heap from '../heap';

export default  {
  name: 'UserVerifyPhone',
  props: ['phone', 'password'],
  data(){
    return {
      error: '',
      submitted: false,
      fields: {
        code: ''
      }
    }
  },
  computed: {},
  methods:{
    onSubmit() {
      var self = this;
      this.submitted = true;
      jQuery.post( "https://api.tezkel.com/User/phoneVerificationCheck", {user_phone: this.phone, verification_code: this.fields.code})
      .done(function() {
          self.signIn();
      })
      .fail(function(err) {
        self.error = err.responseJSON.messages.error;
      });
    },
    signIn() {
      var self = this;
      let requestData = {
        user_phone: this.phone,
        user_pass: this.password,
        user_pass_confirm: this.password
      }
      jQuery.post( heap.state.hostname + "User/signIn", requestData)
        .done(function() {
            self.getUserData();
        })
    },
    getUserData(){
      var self = this;
      jQuery.post( heap.state.hostname + "User/itemGet")
        .done(function(response, textStatus, request) {
          var sid=request.getResponseHeader('x-sid');
          heap.commit('setSessionId', sid);
          heap.commit('setUser', response);
          jQuery.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('x-sid',  sid);
            }
          })
          router.push({path: '/user-dashboard'});
        })
        .fail(function(err) {
            self.error = err.responseJSON.messages.error;
        });
    },
  },
  created(){
    if(heap.state.user.user_phone_verified && heap.state.user.user_phone_verified !== '0'){
      return router.push('/user-dashboard');
    } 
  }
}
</script>