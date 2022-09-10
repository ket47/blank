<template>
  <base-layout page-title="Confirm Password" pageDefaultBackLink="/user">
      <form novalidate>
        <ion-list>
          <ion-item>
            <ion-row>
              <ion-col>
                <ion-label position="stacked" color="primary">New Password</ion-label>
                <ion-input
                  v-model="fields.password"
                  name="password"
                  type="password"
                  inputmode="tel"
                  :value="fields.password"
                  @input="fields.password = $event.target.value"
                  placeholder="New Password"
                  required
                ></ion-input>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-label position="stacked" color="primary">Confirm New Password</ion-label>
                <ion-input
                  v-model="fields.code"
                  name="passwordConfirm"
                  type="password"
                  inputmode="tel"
                  :value="fields.passwordConfirm"
                  @input="fields.passwordConfirm = $event.target.value"
                  placeholder="Confirm New Password"
                  required
                ></ion-input>
              </ion-col>
            </ion-row>
          </ion-item>
        </ion-list>

        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="onSubmit" expand="block">Check</ion-button>
          </ion-col>
        </ion-row>
      </form>
  </base-layout>
</template>

<script>
import jQuery from "jquery";

export default  {
  name: 'UserResetPassword',
  data(){
    return {
      submitted: false,
      fields: {
        password: '',
        passwordConfirm: ''
      }
    }
  },
  computed: {},
  methods:{
    async onSubmit() {
      this.submitted = true;
      await jQuery.post( this.$heap.state.hostname+"User/phoneVerificationCheck", {verification_code: this.fields.code})
    }
  }
}
</script>