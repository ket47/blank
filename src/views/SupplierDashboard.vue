<style scoped>
input,textarea{
  border: none;
  padding: 5px;
  margin: 5px;
  width: 100%;
  outline: none;
}
ion-text{
  color:black;
  padding:20px;
  border-radius:10px;
  font-size: 12px;;
}
.disabled{
  background-color: var(--ion-color-light-shade);
}
.deleted{
  background-color: var(--ion-color-danger-tint);
}
.image_disabled{
  border: 4px solid #999;
  filter: grayscale(0.5);
}
</style>
<template>
  <base-layout page-title="Анкета поставщика" page-default-back-link="/user-dashboard">
      <ion-card>
        <ion-item>
          <ion-label>Пока вы не поставщик</ion-label>
        </ion-item>
        <ion-item lines="full">
            <ion-label position="stacked" color="primary">Название магазина или ресторана*</ion-label>
            <ion-input v-model="store_name" placeholder="Название*"></ion-input>
          </ion-item>
        <ion-item>
          <ion-text>
          Подавая заявку вы даете согласие на условия 
          <router-link :to="page-rules-supplier">Договор поставки товаров и услуг</router-link>
          </ion-text>
          <ion-checkbox v-model="contractAccepted" slot="end"/>
        </ion-item>
        <ion-button expand="full" @click="itemCreate()" :disabled="!contractAccepted || !store_name">Стать поставщиком</ion-button>
      </ion-card>

  </base-layout>
</template>

<script>
import {
  IonInput,
  IonCard,
  IonLabel,
  IonItem,
  IonButton,
  IonCheckbox,
  IonText
}                   from "@ionic/vue";
import jQuery       from "jquery";
import heap         from '@/heap';
import User         from '@/scripts/User.js';

export default  {
  components: {
  IonInput,
  IonCard,
  IonLabel,
  IonItem,
  IonButton,
  IonCheckbox,
  IonText
  },
  data(){
    return {
      supprier:User.supplier.status,
      store_name:null,
      contractAccepted:0
    }
  },
  methods:{
    async itemCreate(){
      try{
        if(!this.store_name){
          this.$flash("Название обязательно")
          return
        }
        const store_id=await User.supplier.storeItemCreate(this.store_name)
        if(!store_id){
          this.$flash("Не удалось создать магазин или ресторан")
          return
        }
        this.$router.push(`store-edit-${store_id}`)
      }catch(err){
        const message=err.responseJSON?.messages?.error;
        if( message=='limit_exeeded' ){
          this.$flash("У вас зарегистрировано максимальное количество магазинов")
        }
        this.$flash("Не удалось создать магазин или ресторан")
      }
    }
  },
}
</script>