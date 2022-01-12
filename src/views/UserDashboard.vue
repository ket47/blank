<template>
  <base-layout
    page-title="Личный кабинет"
    page-default-back-link="/home"
    :errorMessage="error"
  >
    <div v-if="isSignedIn" class="user-dashboard-header">
      <ion-fab v-if="isSignedIn" vertical="top" horizontal="end" slot="fixed">
        <router-link class="section-button" to="/user-edit">
          <ion-icon :icon="create" slot="start"></ion-icon>
        </router-link>
      </ion-fab>
      <ion-list>
        <ion-item lines="full" class="avatar-row">
          <ion-avatar>
            <img
              :src="
                $store.state.hostname +
                'img/avatar/' +
                user.user_avatar_name +
                '.png'
              "
            />
          </ion-avatar>
          <ion-label>{{ user.user_name }}</ion-label>
        </ion-item>
        <ion-item v-if="user.user_phone" lines="full">
          <ion-icon
            slot="start"
            style="color: var(--ion-color-primary)"
            :icon="call"
          />
          <ion-label>{{ user.user_phone }}</ion-label>
        </ion-item>
        <ion-item v-if="user.user_email && user.user_email !== ''">
          <ion-thumbnail>
            <ion-icon :icon="mail"></ion-icon>
          </ion-thumbnail>
          <ion-label>{{ user.user_email }}</ion-label>
        </ion-item>
      </ion-list>
    </div>

    <ion-list>
      <ion-item-group>
        <ion-item-divider> </ion-item-divider>
        <ion-item v-if="!isSignedIn" lines="full" button detail>
          <router-link class="section-button" to="/sign-in">
            <ion-icon :icon="logIn" slot="start"></ion-icon>
            <ion-label>Войти</ion-label>
          </router-link>
        </ion-item>
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/user-addresses">
            <ion-icon :icon="location"></ion-icon>
            <ion-label>Мои адреса</ion-label>
          </router-link>
        </ion-item>
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/user-favourites">
            <ion-icon :icon="heart"></ion-icon>
            <ion-label>Избранные товары</ion-label>
          </router-link>
        </ion-item>
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/user-orders">
            <ion-icon :icon="cart"></ion-icon>
            <ion-label>Мои заказы</ion-label>
          </router-link>
        </ion-item>
        <ion-item lines="full" button detail>
          <router-link class="section-button" to="/user-payments">
            <ion-icon :icon="card"></ion-icon>
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
        <ion-item v-if="isSignedIn" @click="signOut" lines="full" button detail>
          <router-link class="section-button" to="/user-dashboard">
            <ion-icon :icon="exit"></ion-icon>
            <ion-label>Выйти</ion-label>
          </router-link>
        </ion-item>
      </ion-item-group>
    </ion-list>
  </base-layout>
</template>


<script>
import { IonIcon, IonAvatar } from "@ionic/vue";
import {
  create,
  logIn,
  exit,
  location,
  heart,
  helpCircle,
  call,
  mail,
  card,
  cart,
  notifications,
  chevronForwardOutline,
} from "ionicons/icons";

import User from "../scripts/User.js";

import store from "../store";

export default {
  name: "UserDashboard",
  components: {
    IonIcon,
    IonAvatar,
  },
  setup() {
    return {
      create,
      logIn,
      exit,
      location,
      heart,
      helpCircle,
      call,
      mail,
      card,
      cart,
      notifications,
      chevronForwardOutline,
    };
  },
  data() {
    return {
      error: "",
      user: store.state.user,
    };
  },
  computed: {
    isSignedIn() {
      return store.state.user.user_id && store.state.user.user_id > -1;
    },
  },
  methods: {
    signOut() {
      var self = this;
      User.signOut(function (result) {
        if (!result.success) {
          self.error = result.message;
        }
      });
    },
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        this.user = store.state.user;
      }
    },
  },
};
</script>