<style scoped>
ion-icon{
  font-size:24px;
}
</style>
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goback()"><ion-icon :src="chevronBackOutline"/></ion-button>
        </ion-buttons>
        <ion-title><b>Аккаунт</b></ion-title>
      </ion-toolbar>  
    </ion-header>
    <ion-content class="main-container">
      <div class="user-dashboard-header">
        <ion-list>
          <ion-item v-if="isSignedIn" lines="full" class="avatar-row">
            <ion-avatar slot="start">
              <ion-img v-if="user.user_avatar_name" :src="$heap.state.hostname +'img/avatar/' +user.user_avatar_name +'.png'"/>
              <ion-icon v-else :icon="personCircleOutline" color="primary" size="large"></ion-icon>
            </ion-avatar>
            <ion-label>{{ user.user_name }}</ion-label>
          </ion-item>
          <ion-item v-if="isSignedIn" @click="signOut" lines="full" button detail>
              <ion-icon :icon="exitOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Выйти</ion-label>
          </ion-item>
          <ion-item v-else lines="full" button detail @click="$go('/modal/user-authorize')">
              <ion-icon :icon="logInOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Вход в аккаунт</ion-label>
          </ion-item>
          <ion-item  v-if="isSignedIn" lines="full" button @click="deletePromptShow = true" >
              <ion-icon :icon="trashOutline" slot="start" color="danger"></ion-icon>
              <ion-label>Удалить аккаунт</ion-label>
          </ion-item>
        </ion-list>
      </div>
      <ion-list>
        <ion-item-group>
          <ion-item-divider @click="capgoInstallerReset()">
            <ion-label>Информация</ion-label>
          </ion-item-divider>
          <ion-item lines="full" button detail target="_blank" href="https://docs.google.com/document/u/1/d/10P8czpmj6X_hmVvXASP1dap012HgoPmyxGg_T1DYcTM/mobilebasic#id.h.rx49wla2kcej">
              <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
              <ion-text>Правила пользования</ion-text>
          </ion-item>
          <ion-item lines="full" button detail target="_blank" href="https://docs.google.com/document/u/1/d/10P8czpmj6X_hmVvXASP1dap012HgoPmyxGg_T1DYcTM/mobilebasic#kix.jon2keqmkkvr">
              <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
              <ion-text>Политика конфиденциальности</ion-text>
          </ion-item>
        </ion-item-group>
      </ion-list>
      <ion-modal
        :isOpen="deletePromptShow"
        :initial-breakpoint="0.8"
        :breakpoints="[0, 0.4, 0.8]"
      >
        <ion-header>
          <ion-toolbar color="danger">
            <ion-title>Удаление учетной записи</ion-title>
            <ion-icon
              :icon="closeOutline"
              @click="deletePromptShow = false"
              slot="end"
              size="large"
            ></ion-icon>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item lines="none" style="margin-bottom: 15px">
            <div>
              <p>Ваши персональные данные будут безвозвратно удалены.</p>
              <p>
                Повторная регистрация по этому номеру телефона будет невозможна!
              </p>
            </div>
          </ion-item>
          <ion-button @click="deleteAccount()" expand="block" color="danger"
            >Удалить аккаунт</ion-button
          >
          <ion-button
            @click="deletePromptShow = false"
            expand="block"
            color="light"
            >Закрыть</ion-button
          >
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>


<script>
import { 
  IonPage,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonAvatar,
  IonImg,
  IonModal,
  IonLabel,
  IonItem,
  IonList,
  IonItemDivider,
  IonItemGroup,
  IonNote,
  IonText,
  IonButton,
  IonSkeletonText
} from "@ionic/vue";
import {
  logInOutline,
  personCircleOutline,
  exitOutline,
  chevronForwardOutline,
  informationCircleOutline,
  chevronBackOutline,
  trashOutline,
  closeOutline
} from "ionicons/icons";

import User     from "@/scripts/User.js";
import Topic    from '@/scripts/Topic.js';
import heap     from "@/heap";
import jQuery                   from 'jquery'

export default {
  components: {
  IonPage,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonModal,
  IonIcon,
  IonAvatar,
  IonImg,
  IonLabel,
  IonItem,
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
        logInOutline,
        personCircleOutline,
        exitOutline,
        chevronForwardOutline,
        informationCircleOutline,
        chevronBackOutline,
        trashOutline,
        closeOutline
    };
  },
  data() {
    return {
      user: heap.state.user,
      deletePromptShow: false
    };
  },
  ionViewDidEnter(){
    User.get('full');
  },
  mounted(){
    const self=this;
    Topic.on('userGet',(data)=>{
      self.user=data;
    });
  },
  computed: {
    isSignedIn() {
      return this.user?.user_id>0;
    },
  },
  methods: {
    async signOut() {
      await User.signOut();
      location.reload()
    },
    capgoInstallerReset(){
      localStorage.appUpdateSkipUntil=0
    },
    async deleteAccount() {
      try {
        const requestData = {
          user_id: this.$heap.state.user.user_id,
          //user_pass:this.fields.user_pass_current,
        };
        await jQuery.post(
          `${this.$heap.state.hostname}User/itemDelete`,
          requestData
        );
        this.deletePromptShow = false;
        await User.signOut();
        await this.$go("/user");
      } catch {
        this.$flash("Не удалось удалить аккаунт. Проверьте пароль");
      }
    },
    goback(){
      history.back()
    },
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        this.user = heap.state.user;
      }
    },
  },
};
</script>