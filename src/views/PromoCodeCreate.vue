<template>
  <base-layout page-title="Создать промокод">
    <ion-list>
      <ion-item>
        <ion-icon :icon="textOutline" slot="start" color="primary" />
        <ion-input
          v-model="promo_code"
          type="text"
          placeholder="буквы и цифры"
          label="Промокод"
          label-placement="stacked"
          required
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-icon :icon="giftOutline" slot="start" color="primary" />
        <ion-input
          v-model="promo_sum"
          placeholder="сумма скидки"
          label="Сумма"
          label-placement="stacked"
          ref="promo_sum"
          type="numeric"
          inputmode="numeric"
          maxlength="4"
          pattern="\d{4}"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-icon :icon="bookOutline" slot="start" color="primary" />
        <ion-textarea
          v-model="promo_description"
          placeholder="описание промокода"
          label="Описание (не обязательно)"
          label-placement="stacked"
          name="promo_description"
          @change="save('promo_description', $event.target.value)">
        </ion-textarea>
      </ion-item>
    </ion-list>

    <div class="ion-padding">
      <ion-button v-if="promo_sum>0" expand="block" @click="itemCreate()">Создать промокод</ion-button>
      <ion-button v-else-if="!(promo_code?.length>3)" expand="block" color="light" @click="$refs.promo_sum.$el.setFocus()">Заполнить код</ion-button>
      <ion-button v-else expand="block" color="light" @click="$refs.promo_sum.$el.setFocus()">Заполнить сумму</ion-button>
    </div>
    
  </base-layout>
</template>

<script>
import {
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
}                 from "@ionic/vue";
import {
  trashOutline,
  giftOutline,
  textOutline,
  bookOutline,
  walletOutline,
}                 from "ionicons/icons";
import  jQuery    from "jquery";
import  User      from "@/scripts/User";

export default {
  components: {
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
  },
  setup() {
    return {
      trashOutline,
      giftOutline,
      textOutline,
      bookOutline,
      walletOutline,
    }
  },
  data() {
    return {
      promo_code: null,
      promo_description:null,
      promo_sum:null,
    };
  },
  methods: {
    async itemCreate() {
      try {
        const request={
          promo_code:this.promo_code,
          promo_sum:this.promo_sum,
          promo_description:this.promo_description,
        }
        const promo_code_id = await jQuery.post(`${this.$heap.state.hostname}PromoCode/itemCreate`,request);
        if( promo_code_id ){
          this.$router.replace(`/admin/promo-code-edit-${promo_code_id}`)
        }
      } catch (err) {
        const validationErrors=err?.responseJSON?.messages?.error
        if(validationErrors?.includes('post_content')){
          this.$flash("Описание слишком короткое")
        } else
        if(validationErrors?.includes('post_title')){
          this.$flash("Заголовок слишком короткий")
        } else 
        this.$flash("Изменение не сохранено")
        return false;
      }
      User.get();
    },
    makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
  },
  created() {
    this.promo_code=this.makeid(5)
  },
};
</script>