<template>
  <base-layout
    page-title="Личный кабинет"
    page-default-back-link="/home"
    :errorMessage="error"
  >
    <div v-if="isSignedIn" class="user-dashboard-header">
      <ion-list>
        <ion-item lines="full" class="avatar-row">
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
        <ion-item v-if="user.user_phone" lines="full">
          <ion-icon
            slot="start"
            style="color: var(--ion-color-primary)"
            :icon="callOutline"
          />
          <ion-label>{{ user.user_phone }}</ion-label>
        </ion-item>
        <ion-item v-if="user.user_emailOutline && user.user_emailOutline !== ''">
          <ion-thumbnail>
            <ion-icon :icon="mailOutline"></ion-icon>
          </ion-thumbnail>
          <ion-label>{{ user.user_emailOutline }}</ion-label>
        </ion-item>
      </ion-list>
    </div>

    <ion-list>
      <ion-item-group>
        <ion-item-divider>
          <ion-label>Пользователь</ion-label>
        </ion-item-divider>
        <ion-item v-if="!isSignedIn" lines="full" button detail>
          <router-link class="section-button" to="/sign-in">
            <ion-icon :icon="logIn" slot="start"></ion-icon>
            <ion-label>Войти</ion-label>
          </router-link>
        </ion-item>
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/user-addresses">
            <ion-icon :icon="locationOutline"></ion-icon>
            <ion-label>Мои адреса</ion-label>
          </router-link>
        </ion-item>
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/user-favourites">
            <ion-icon :icon="heartOutline"></ion-icon>
            <ion-label>Избранные товары</ion-label>
          </router-link>
        </ion-item>
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/user-orders">
            <ion-icon :icon="cartOutline"></ion-icon>
            <ion-label>Мои заказы</ion-label>
          </router-link>
        </ion-item>
        <!--
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
        <ion-item v-if="isSignedIn" @click="signOut" lines="full" button detail>
          <router-link class="section-button" to="/user-dashboard">
            <ion-icon :icon="exitOutline"></ion-icon>
            <ion-label>Выйти</ion-label>
          </router-link>
        </ion-item>
      </ion-item-group>

      <ion-item-group v-if="isSignedIn">
        <ion-item-divider>
          <ion-label>Курьер</ion-label>
        </ion-item-divider>
        <ion-item v-if="courierStatus=='ready'" lines="full" style="--background:var(--ion-color-success-tint)">
          <ion-icon src="./assets/icon/delivery-man.svg" slot="start"></ion-icon>
          <ion-text>
            <ion-label>Смена активна</ion-label>
            <ion-note>Вы можете брать задания на доставку</ion-note>
          </ion-text>
          <ion-button slot="end" color="primary" @click="courierStatusSet('idle')">Завершить</ion-button>
        </ion-item>

        <ion-item v-else-if="courierStatus=='idle'" lines="full" style="--background:var(--ion-color-warning-tint)">
          <ion-icon src="./assets/icon/delivery-man.svg" slot="start"></ion-icon>
          <ion-text>
            <ion-label>Смена закрыта</ion-label>
            <ion-note>Начните смену для начала работы</ion-note>
          </ion-text>
          <ion-button slot="end" @click="courierStatusSet('ready')" color="primary">Начать</ion-button>
        </ion-item>

        <ion-item v-else-if="courierStatus=='busy'" lines="full" style="--background:var(--ion-color-primary-tint)">
          <ion-icon src="./assets/icon/delivery-man.svg" slot="start"></ion-icon>
          <ion-text>
            <ion-label>Выполняется задание</ion-label>
            <ion-note>В процессе доставки заказа</ion-note>
          </ion-text>
        </ion-item>

        <ion-item v-if="courierStatus=='notcourier'" lines="full" detail button>
          <router-link class="section-button" to="/courier-dashboard">
            <ion-icon src="./assets/icon/delivery-man.svg" slot="start"></ion-icon>
            <ion-text>
              <ion-label>Пока вы не курьер</ion-label>
              <ion-note>Подайте заявку, чтобы стать курьером</ion-note>
            </ion-text>
          </router-link>
        </ion-item>

        <ion-item v-else lines="full" button detail>
          <router-link class="section-button" to="/courier-dashboard">
            <ion-icon :icon="documentTextOutline" slot="start" color="primary"></ion-icon>
            <ion-label>
              <h2>Анкета курьера</h2>
            </ion-label>
          </router-link>
        </ion-item>

      </ion-item-group>
    </ion-list>
  </base-layout>
</template>


<script>
import { IonIcon, IonAvatar } from "@ionic/vue";
import {
  settingsOutline,
  logIn,
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
  documentTextOutline
} from "ionicons/icons";

import User from "@/scripts/User.js";
import Topic from '@/scripts/Topic.js';
import heap from "@/heap";

export default {
  name: "UserDashboard",
  components: {
    IonIcon,
    IonAvatar,
  },
  setup() {
    return {
      settingsOutline,
      logIn,
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
      documentTextOutline
    };
  },
  data() {
    return {
      user: heap.state.user,
      courierStatus:'notcourier'
    };
  },
  created(){
    const self=this;
    Topic.on('courierStatusChange',(status)=>{
      self.courierStatus=status;
      console.log(status);
    });
  },
  computed: {
    isSignedIn() {
      return heap.state?.user?.user_id > -1;
    },
  },
  methods: {
    async signOut() {
      await User.signOut();
      User.get();
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
    // async courierStatusGet(){
    //   const user_types=heap.state.user?.member_of_groups?.group_types||"";
    //   if( user_types.indexOf('courier')==-1 ){
    //     this.courierStatus='notcourier';
    //     return;
    //   }
    //   await User.courier.get();
    //   this.courierStatus=User.courier.status;
    // }
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