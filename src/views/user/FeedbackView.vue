<style scoped>
</style>
<template>
<base-layout pageTitle="Обратная связь" pageDefaultBackLink="/user">
    <ion-card v-if="!suggestFormHidden">
      <ion-card-header>
        <ion-card-title>Форма обратной связи</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-textarea v-model="storeSuggestion" label="" helperText="Что вам нравится или не нравиться в нашей работе. Какие услуги еще вы хотели бы видеть в приложении" placeholder="ваше предложение или отзыв" rows="10">

        </ion-textarea>
        <ion-button expand="block" @click="suggestFormSend()" color="primary">отправить</ion-button>
      </ion-card-content>
    </ion-card>
    <ion-card v-else>
      <ion-card-header>
        <ion-card-title>Спасибо за отзыв</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        Мы постоянно работаем над совершенствованием сервиса, ваш отзыв поможет нам стать лучше.
      </ion-card-content>
    </ion-card>

</base-layout>
</template>
<script>
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonTextarea,
  IonButton,
}                   from "@ionic/vue";
import heap         from "@/heap";
import Utils        from '@/scripts/Utils.js'
export default {
    components:{
          IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonTextarea,
  IonButton,
    },
    data(){
        return {
            suggestFormHidden:0,
            storeSuggestion:''
        }
    },
    methods:{
        async suggestFormSend(){
        if(!this.storeSuggestion){
            this.$flash("Напишите ваше предложение или отзыв")
        }
        try{
            const request={
            type:'suggest_feedback',
            user_id:this.$heap.state.user?.user_id,
            from:this.$heap.state.user?.user_phone,
            subject:this.showndelivery_address,
            body:this.storeSuggestion
            }
            await Utils.post(`${heap.state.hostname}Talk/inquiryCreate`, request)
            this.$flash("Ваше отзыв отправлен. Благодарим вас.")
        }catch{/** */}
        this.suggestFormHidden=1
        },
    }
}
</script>