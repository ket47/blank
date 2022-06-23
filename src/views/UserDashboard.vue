<style scoped>
ion-icon{
  font-size:24px;
}
</style>
<template>
  <base-layout
    page-title="Личный кабинет"
    pageDefaultBackLink="/home"
  >
    <div class="user-dashboard-header">
      <ion-list>
        <ion-item v-if="isSignedIn()" lines="full" class="avatar-row">
          <ion-avatar slot="start">
            <ion-img v-if="user.user_avatar_name" :src="$heap.state.hostname +'img/avatar/' +user.user_avatar_name +'.png'"/>
          </ion-avatar>
          <ion-label>{{ user.user_name }}</ion-label>
          <ion-label slot="end">
            <router-link class="section-button" to="/user-edit" slot="end">
              <ion-icon :icon="settingsOutline"></ion-icon>
            </router-link>
          </ion-label>
        </ion-item>
        <!--<ion-item v-if="user.user_phone" lines="full">
          <ion-icon slot="start" :icon="callOutline" color="primary" />
          <ion-label>{{ user.user_phone }}</ion-label>
        </ion-item>
        <ion-item v-if="user.user_emailOutline && user.user_emailOutline !== ''">
          <ion-thumbnail>
            <ion-icon :icon="mailOutline"></ion-icon>
          </ion-thumbnail>
          <ion-label>{{ user.user_emailOutline }}</ion-label>
        </ion-item>-->
        <ion-item v-if="isSignedIn()" @click="signOut" lines="full" button detail>
            <ion-icon :icon="exitOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Выйти</ion-label>
        </ion-item>
        <ion-item v-else lines="full" button detail @click="$router.push('sign-in')">
            <ion-icon :icon="logInOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Войти</ion-label>
        </ion-item>
      </ion-list>
    </div>

    <ion-list>
      <ion-item-group v-if="isSignedIn()">
        <ion-item-divider>
          <ion-label>Пользователь</ion-label>
        </ion-item-divider>
        <div>
          <ion-item lines="full" button detail @click="$router.push('user-addresses')">
              <ion-icon :icon="locationOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Мои адреса</ion-label>
          </ion-item>
          <ion-item lines="full" button detail @click="$router.push('order-list')">
              <ion-icon :icon="cartOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Мои заказы</ion-label>
          </ion-item>
          <ion-item lines="full" button detail @click="$router.push('user-promo')">
              <ion-icon :icon="giftOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Мои скидки</ion-label>
          </ion-item>
          <ion-item lines="full" button detail @click="$router.push('msg-dashboard')">
              <ion-icon :icon="notificationsOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Настройка уведомлений</ion-label>
          </ion-item>
        </div>

        <ion-item-group v-if="isAdmin">
          <ion-item-divider>
            <ion-label>Администратор</ion-label>
          </ion-item-divider>
          <ion-item @click="$router.push('text-list')" lines="full" button detail>
              <ion-icon :icon="documentTextOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Редактирование страниц</ion-label>
          </ion-item>
        </ion-item-group>
        <!--
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/user-favourites">
            <ion-icon :icon="heartOutline"></ion-icon>
            <ion-label>Избранные товары</ion-label>
          </router-link>
        </ion-item>
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/user-payment-methods">
            <ion-icon :icon="cardOutline"></ion-icon>
            <ion-label>Методы оплаты</ion-label>
          </router-link>
        </ion-item>
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/user-notifications">
            <ion-icon :icon="notifications"></ion-icon>
            <ion-label>Настройка уведомлений</ion-label>
          </router-link>
        </ion-item>
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/help">
            <ion-icon :icon="helpCircle"></ion-icon>
            <ion-label>Помощь</ion-label>
          </router-link>
        </ion-item>
        -->
      </ion-item-group>

      <ion-item-group v-if="isSignedIn()">
        <ion-item-divider>
          <ion-label>Курьер</ion-label>

        </ion-item-divider>

        <div v-if="courierStatus=='ready'">
          <ion-item style="--background:var(--ion-color-success-tint)" lines="none">
            <ion-text>
              <ion-label>Смена активна</ion-label>
              <ion-note>Вы можете брать задания на доставку</ion-note>
            </ion-text>
          </ion-item>
          <ion-item style="--background:var(--ion-color-success-tint)" button lines="full" @click="courierStatusSet('idle')">
            <ion-icon src="./assets/icon/delivery-man.svg" slot="start"></ion-icon>
            <ion-button slot="end">Завершить смену</ion-button>
          </ion-item>
        </div>

        <div v-else-if="courierStatus=='idle'">
          <ion-item style="--background:var(--ion-color-warning-tint)" lines="none">
            <ion-text>
              <ion-label>Смена закрыта</ion-label>
              <ion-note>Начните смену для начала работы</ion-note>
            </ion-text>
          </ion-item>
          <ion-item style="--background:var(--ion-color-warning-tint)" button lines="full" @click="courierStatusSet('ready')">
            <ion-icon src="./assets/icon/delivery-man.svg" slot="start"></ion-icon>
            <ion-button slot="end">Начать смену</ion-button>
          </ion-item>
        </div>

        <div v-else-if="courierStatus=='busy'">
          <ion-item style="--background:var(--ion-color-warning-tint)" lines="none">
            <ion-text>
              <ion-label>Выполняется задание</ion-label>
              <ion-note>В процессе доставки заказа</ion-note>
            </ion-text>
          </ion-item>
          <ion-item style="--background:var(--ion-color-warning-tint)" button lines="full">
            <ion-icon src="./assets/icon/delivery-man.svg" slot="start"></ion-icon>
          </ion-item>
        </div>

        <div v-if="courierStatus=='notcourier'">
          <ion-item lines="none">
            <ion-text>
              <ion-label>Пока вы не курьер</ion-label>
              <ion-note>Подайте заявку, чтобы стать курьером</ion-note>
            </ion-text>
          </ion-item>
          <ion-item button lines="full" @click="$router.push('courier-dashboard')">
            <ion-icon src="./assets/icon/delivery-man.svg" slot="start"></ion-icon>
            <ion-button slot="end" color="light">Заполнить анкету</ion-button>
          </ion-item>
        </div>
        <ion-item v-else lines="full" button detail @click="$router.push('courier-dashboard')">
            <ion-icon :icon="documentTextOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Анкета курьера</ion-label>
        </ion-item>

      </ion-item-group>

      <ion-item-group v-if="isSignedIn()">
        <ion-item-divider>
          <ion-label>Поставщик</ion-label>
        </ion-item-divider>
        <div v-if="!user.storeList">
          <ion-item>
            <ion-icon :icon="storefrontOutline" slot="start"></ion-icon>
            <ion-skeleton-text animated></ion-skeleton-text>
          </ion-item>   
        </div>
        <div v-else-if="user.storeList.length>0">
          <ion-item v-for="store in user.storeList" :key="store.store_id" detail button @click="$router.push(`store-edit-${store.store_id}`)">
            <ion-icon :icon="storefrontOutline" slot="start"></ion-icon>
            {{store.store_name||'- - -'}}
          </ion-item>        
        </div>
        <div v-else>
          <ion-item lines="none">
            <ion-text>
              <ion-label>Пока вы не поставщик</ion-label>
              <ion-note>Зарегистрируйте свой магазин или ресторан</ion-note>
            </ion-text>
          </ion-item>
          <ion-item @click="$router.push(`supplier-dashboard`)" lines="full">
            <ion-icon :icon="storefrontOutline" slot="start"></ion-icon>
            <ion-button slot="end" color="light">Стать поставщиком</ion-button>
          </ion-item>
        </div>
      </ion-item-group>

      <ion-item-group>
        <ion-item-divider>
          <ion-label>Информация</ion-label>
        </ion-item-divider>
        <ion-item lines="full" button detail @click="$router.push('page-about')">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-label>О нас</ion-label>
        </ion-item>
        <ion-item lines="full" button detail @click="$router.push('page-rules')">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Правила пользования</ion-label>
        </ion-item>
        <ion-item lines="full" button detail @click="$router.push('page-privacy_policy')">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Политика конфиденциальности</ion-label>
        </ion-item>
      </ion-item-group>

    </ion-list>
  </base-layout>
</template>


<script>
import { 
  IonIcon,
  IonAvatar,
  IonImg,
  IonLabel,
  IonItem,
  IonThumbnail,
  IonList,
  IonItemDivider,
  IonItemGroup,
  IonNote,
  IonText,
  IonButton,
  IonSkeletonText
} from "@ionic/vue";
import {
  settingsOutline,
  logInOutline,
  personCircleOutline,
  exitOutline,

  locationOutline,
  heartOutline,
  helpCircle,
  callOutline,
  mailOutline,
  
  cardOutline,
  cartOutline,
  notifications,
  chevronForwardOutline,
  documentTextOutline,
  informationCircleOutline,
  storefrontOutline,
  notificationsOutline,
  giftOutline,
} from "ionicons/icons";

import User     from "@/scripts/User.js";
import Topic    from '@/scripts/Topic.js';
import heap     from "@/heap";

export default {
  components: {
  IonIcon,
  IonAvatar,
  IonImg,
  IonLabel,
  IonItem,
  IonThumbnail,
  IonList,
  IonItemDivider,
  IonItemGroup,
  IonNote,
  IonText,
  IonButton,
  IonSkeletonText
  },
  setup() {
    return {
      settingsOutline,
      logInOutline,
      personCircleOutline,
      exitOutline,
      locationOutline,
      heartOutline,
      helpCircle,
      callOutline,
      mailOutline,
      cardOutline,
      cartOutline,
      notifications,
      chevronForwardOutline,
      documentTextOutline,
      informationCircleOutline,
      storefrontOutline,
      notificationsOutline,
      giftOutline,
    };
  },
  data() {
    return {
      user: heap.state.user,
      courierStatus:User.courier.status,
      storeList:null
    };
  },
  ionViewDidEnter(){
    User.get('full');
  },
  mounted(){
    const self=this;
    Topic.on('courierStatusChange',(status)=>{
      self.courierStatus=status;
    });
    Topic.on('userGet',(data)=>{
      self.user=data;
    });
  },
  computed: {
    isAdmin(){
      return User.isAdmin();
    }
  },
  methods: {
    isSignedIn() {
      return heap.getters.userIsLogged;
    },
    async signOut() {
      await User.signOut();
      this.user=await User.get();
    },
    async courierStatusSet( new_status ){
      try{
        await User.courier.updateStatus(new_status);
      }catch(err){
        if( err.status==409 ){
          this.$flash("Анкета удалена или не активна")
        }
      }
    },
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        this.user = heap.state.user;
      }
    },
    courierStatus(new_status){
      if(new_status=='ready' || new_status=='busy'){
        User.geo.trackingStart();
      } else {
        User.geo.trackingStop();
      }
    }
  },
};
</script>