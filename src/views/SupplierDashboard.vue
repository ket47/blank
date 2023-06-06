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

.header-image-container{
  padding: 2em 4em;
  display: grid;
  min-height: 350px;
  align-items: center;
  text-align: center;
  background-image: url("/public/img/about_us/tezkel_header.jpg");
  background-position: center center;
}
.header-image-container h2,
.header-image-container h4{
  font-size: 20px;
  color: white;
}
@media screen and (max-width: 740px) {
  .header-image-container h2{
    font-size: 28px !important;
  }
  .header-image-container h4{
    font-size: 15px !important;
  }
}
.header-image-container .main-block-content{
  animation: scale 2s ease-out infinite;
}
@keyframes scale {
  0%   {scale: 1}
  50%  {scale: 1.04}
  100% {scale: 1}
}










</style>
<template>
  <base-layout page-title="Панель управления продавца">



      <div class="header-image-container main-block">
        <div class="main-block-content" style="transform: rotate(-7deg);">
          <div class="text" style="color: white">
            <h2 style="color: rgb(235, 192, 0); font-size: 42px; margin: 0; filter: drop-shadow(-2px 2px 2px #042c4f);">Узнайте преимущества</h2>
            <h4 style="font-size: 24px; margin-top: 5px;">работы с нашей платформой</h4>
              <ion-button color="light" @click="$go('/page/supplier-guide')"><b>Презентация</b></ion-button>
          </div>
        </div>
      </div>




    <div v-if="$heap.state.user.user_id>1">
      <ion-item lines="none">
        <h4 style="color:var(--ion-color-primary)">Регистрация нового продавца</h4>
      </ion-item>
      <ion-item>
        <ion-input v-model="store_name" label="Название магазина или ресторана*" labelPlacement="stacked" placeholder="Название*"></ion-input>
      </ion-item>
      <ion-item lines="none">
        <ion-text style="font-size:0.9em">
          Я согласен(на) на условия <router-link to="/page/rules-supplier">Договора оказания услуг</router-link>
        </ion-text>
        <ion-checkbox slot="end" v-model="contractAccepted" aria-label=""></ion-checkbox>
      </ion-item>
      <ion-button expand="block" @click="itemCreate()" :disabled="!contractAccepted || !store_name">Стать продавцом</ion-button>
    </div>
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