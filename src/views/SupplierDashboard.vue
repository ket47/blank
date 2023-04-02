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
  <base-layout page-title="Панель управления продавца">
      <ion-card color="light" v-if="$heap.state.user.user_id>1">
        <ion-card-header>
          <ion-card-title>Регистрация нового магазина</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="full">
            <ion-label position="stacked" color="primary">Название магазина или ресторана*</ion-label>
            <ion-input v-model="store_name" placeholder="Название*"></ion-input>
          </ion-item>
          <ion-item lines="none">
            <ion-text>
              Подавая заявку вы даете согласие на условия 
              <router-link to="/page/rules-supplier">Договор поставки товаров и услуг</router-link>
            </ion-text>
            <ion-checkbox slot="end" v-model="contractAccepted"/>
          </ion-item>
        <ion-button expand="block" @click="itemCreate()" :disabled="!contractAccepted || !store_name">Стать продавцом</ion-button>
        </ion-card-content>
      </ion-card>
      <ion-card color="light" v-else>
        <ion-card-header>
          <ion-card-title>Необходимо зарегистрироваться</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Чтобы стать продавцом, нужно быть зарегистрированным пользователем. Вы можете зарегистрироваться за 2 минуты.
        <ion-button expand="block" @click="$go('/user/sign-up')">Зарегистрироваться</ion-button>
        </ion-card-content>
      </ion-card>



      <ion-card color="light" v-if="storeList?.length>0">
        <ion-card-header>
          <ion-card-title>Зарегистрированые магазины</ion-card-title>
        </ion-card-header>
        <ion-card-content>

          <ion-item v-for="store in storeList" :key="store.store_id" detail button @click="$go(`/catalog/store-edit-${store.store_id}`)">
            <ion-icon :icon="storefrontOutline" slot="start"></ion-icon>
            {{store.store_name||store.store_name_new||'- - -'}}
          </ion-item>        
        </ion-card-content>
      </ion-card>

  </base-layout>
</template>

<script>
import {
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,

  IonLabel,
  IonItem,
  IonButton,
  IonCheckbox,
  IonText,
  IonIcon
}                   from "@ionic/vue";

import {
  storefrontOutline,
} from "ionicons/icons";
import jQuery       from "jquery";
import heap         from '@/heap';
import User         from '@/scripts/User.js';

export default  {
  components: {
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,

  IonLabel,
  IonItem,
  IonButton,
  IonCheckbox,
  IonText,
  IonIcon,
  },
  setup() {
    return {
      storefrontOutline,
    };
  },
  data(){
    return {
      supprier:User.supplier.status,
      store_name:null,
      contractAccepted:0,
      storeList:null
    }
  },
  mounted(){
    const self=this;
    this.listGet();
    this.$topic.on('userGet',function(){
      if(self.storeList){
        return;
      }
      self.listGet();
    });
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
        this.$go(`/catalog/store-edit-${store_id}`)
      }catch(err){
        const message=err.responseJSON?.messages?.error;
        if( message=='limit_exeeded' ){
          this.$flash("У вас зарегистрировано максимальное количество магазинов")
        }
        this.$flash("Не удалось создать магазин или ресторан")
      }
    },
    async listGet(){
      this.storeList=await User.supplier.listGet()
    }
  },
}
</script>