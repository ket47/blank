<style scoped>
ion-icon{
  font-size:24px;
}
</style>
<template>
  <base-layout page-title="Личный кабинет">
    <div class="user-dashboard-header">
      <ion-list>
        <ion-item v-if="isSignedIn" lines="full" class="avatar-row">
          <ion-avatar slot="start">
            <ion-img v-if="user.user_avatar_name" :src="$heap.state.hostname +'img/avatar/' +user.user_avatar_name +'.png'"/>
          </ion-avatar>
          <ion-label>{{ user.user_name }}</ion-label>
          <ion-label slot="end">
            <router-link class="section-button" to="/user/user-edit" slot="end">
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
        <ion-item v-if="isSignedIn" @click="signOut" lines="full" button detail>
            <ion-icon :icon="exitOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Выйти</ion-label>
        </ion-item>
        <ion-item v-else lines="full" button detail @click="$router.push('sign-in')">
            <ion-icon :icon="logInOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Войти</ion-label>
        </ion-item>
        <ion-item v-if="!isSignedIn" lines="full" button detail @click="$router.push('sign-up')">
            <ion-icon :icon="personAddOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Зарегистрироваться</ion-label>
        </ion-item>
      </ion-list>
    </div>
    <msg-subscription-comp/>
    <ion-list>
      <ion-item-group v-if="isSignedIn">
        <ion-item-divider>
          <ion-label>Пользователь</ion-label>
        </ion-item-divider>
        <div>
          <ion-item lines="full" button detail @click="$router.push('/user/user-addresses')">
              <ion-icon :icon="locationOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Мои адреса</ion-label>
          </ion-item>
          <ion-item lines="full" button detail @click="$router.push('/order/order-list')">
              <ion-icon :icon="cartOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Мои заказы</ion-label>
          </ion-item>
          <ion-item lines="full" button detail @click="$router.push('/user/user-promo')">
              <ion-icon :icon="giftOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Мои скидки</ion-label>
          </ion-item>
          <ion-item lines="full" button detail @click="$router.push('/user/user-invoice')">
              <ion-icon :icon="receiptOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Мои чеки</ion-label>
          </ion-item>
                    <ion-item @click="$router.push('/user/user-cards')" lines="full" button detail>
              <ion-icon :icon="cardOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Мои карты</ion-label>
          </ion-item>
          <!--
          <ion-item lines="full" button detail @click="$router.push('msg-dashboard')">
              <ion-icon :icon="notificationsOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Мои уведомления</ion-label>
          </ion-item>
          -->
        </div>

        <ion-item-group v-if="isAdmin">
          <ion-item-divider>
            <ion-label>Администратор</ion-label>
          </ion-item-divider>
          <ion-item @click="$router.push('text-list')" lines="full" button detail>
              <ion-icon :icon="documentTextOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Редактирование страниц</ion-label>
          </ion-item>
          <ion-item @click="$router.push('admin-moderation')" lines="full" button detail>
              <ion-icon :icon="ribbonOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Модерация элементов</ion-label>
          </ion-item>
          <ion-item @click="$router.push('/user/admin-tariff-list')" lines="full" button detail>
              <ion-icon :icon="briefcaseOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Список тарифов</ion-label>
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

      <ion-item-group v-if="isSignedIn">
        <ion-item-divider>
          <ion-label>Курьер</ion-label>
        </ion-item-divider>

        <div v-if="courierStatus=='ready'">
          <ion-item style="--background:var(--ion-color-success-tint)" lines="none">
            <ion-text>
              <ion-label>Смена активна</ion-label>
              <ion-note>Вы можете брать задания на доставку <a href="https://t.me/tezkelbot" target="_new">@tezkelbot</a></ion-note>
            </ion-text>
          </ion-item>
          <!--
          <ion-item style="--background:var(--ion-color-success-tint)" button lines="full" @click="courierStatusSet('idle')">
            <ion-icon src="./assets/icon/delivery-man.svg" slot="start"></ion-icon>
            <ion-button slot="end">Завершить смену</ion-button>
          </ion-item>-->
        </div>

        <div v-else-if="courierStatus=='idle'">
          <ion-item style="--background:var(--ion-color-warning-tint)" lines="none">
            <ion-text>
              <ion-label>Смена закрыта</ion-label>
              <ion-note>Воспользуйтесь telegram ботом <a href="https://t.me/tezkelbot" target="_new">@tezkelbot</a>, чтобы начать смену</ion-note>
            </ion-text>
          </ion-item>
          <!--
          <ion-item style="--background:var(--ion-color-warning-tint)" button lines="full" @click="courierStatusSet('ready')">
            <ion-icon :icon="rocketOutline" slot="start"></ion-icon>
            <ion-button slot="end">Начать смену</ion-button>
          </ion-item>-->
        </div>

        <div v-else-if="courierStatus=='busy'">
          <ion-item style="--background:var(--ion-color-warning-tint)" lines="none">
            <ion-text>
              <ion-label>Выполняется задание</ion-label>
              <ion-note>В процессе доставки заказа <a href="https://t.me/tezkelbot" target="_new">@tezkelbot</a></ion-note>
            </ion-text>
          </ion-item>
          <ion-item style="--background:var(--ion-color-warning-tint)" button lines="full">
            <ion-icon :icon="rocketOutline" slot="start"></ion-icon>
          </ion-item>
        </div>

        <div v-if="courierStatus=='notcourier'">
          <ion-item lines="none">
            <ion-text>
              <ion-label>Пока вы не курьер</ion-label>
              <ion-note>Подайте заявку, чтобы стать курьером</ion-note>
            </ion-text>
          </ion-item>
          <ion-item button lines="full" @click="$router.push('/user/courier-dashboard')">
            <ion-icon :icon="rocketOutline" slot="start"></ion-icon>
            <ion-button slot="end" color="light">Стать курьером</ion-button>
          </ion-item>
        </div>
        <div v-else>
          <ion-item lines="full" button detail @click="$router.push('/user/courier-dashboard')">
              <ion-icon :icon="documentTextOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Анкета курьера</ion-label>
          </ion-item>
          <ion-item lines="full" button detail @click="$router.push('/user/courier-statistics')">
              <ion-icon :icon="pieChartOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Статистика</ion-label>
          </ion-item>
        </div>

      </ion-item-group>

      <ion-item-group v-if="isSignedIn">
        <ion-item-divider>
          <ion-label>Продавец</ion-label>
        </ion-item-divider>
        <div v-if="!storeList">
          <ion-item>
            <ion-icon :icon="storefrontOutline" slot="start"></ion-icon>
            <ion-skeleton-text animated></ion-skeleton-text>
          </ion-item>   
        </div>
        <div v-else-if="storeList.length>0">
          <ion-item v-for="store in storeList" :key="store.store_id" detail button @click="$router.push(`/catalog/store-edit-${store.store_id}`)">
            <ion-icon :icon="storefrontOutline" slot="start"></ion-icon>
            {{store.store_name||store.store_name_new||'- - -'}}
          </ion-item>

          <ion-item lines="full" button detail @click="$router.push('/user/supplier-statistics')">
              <ion-icon :icon="pieChartOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Статистика</ion-label>
          </ion-item>
     
        </div>
        <div v-else>
          <ion-item lines="none">
            <ion-text>
              <ion-label>Пока вы не продавец</ion-label>
              <ion-note>Зарегистрируйте свой магазин или ресторан</ion-note>
            </ion-text>
          </ion-item>
          <ion-item @click="$router.push(`/user/supplier-dashboard`)" lines="full">
            <ion-icon :icon="storefrontOutline" slot="start"></ion-icon>
            <ion-button slot="end" color="light">Стать продавцом</ion-button>
          </ion-item>
        </div>
      </ion-item-group>

      <ion-item-group>
        <ion-item-divider>
          <ion-label>Информация</ion-label>
        </ion-item-divider>
        <ion-item lines="full" button detail @click="$router.push('/page/about-us')">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-text>О нас</ion-text>
        </ion-item>
        <ion-item lines="full" button detail @click="$router.push('/page/contacts')">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-text>Контакты</ion-text>
        </ion-item>
        <ion-item lines="full" button detail @click="$router.push('/page/rules-customer')">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-text>Правила пользования</ion-text>
        </ion-item>
        <ion-item lines="full" button detail @click="$router.push('/page/rules-supplier')">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-text>Правила пользования для продавца</ion-text>
        </ion-item>
        <ion-item lines="full" button detail @click="$router.push('/page/rules-courier')">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-text>Правила пользования для курьера</ion-text>
        </ion-item>
        <ion-item lines="full" button detail @click="$router.push('/page/privacy_policy')">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-text>Политика конфиденциальности</ion-text>
        </ion-item>
        <ion-item lines="none">
            <ion-icon :icon="informationCircleOutline" slot="start" color="primary"></ion-icon>
            <ion-text>Версия приложения {{version}}</ion-text>
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
  personAddOutline,
  ribbonOutline,
  receiptOutline,
  rocketOutline,
  briefcaseOutline,

  pieChartOutline,
} from "ionicons/icons";

import User     from "@/scripts/User.js";
import Topic    from '@/scripts/Topic.js';
import heap     from "@/heap";
import MsgSubscriptionComp  from '@/components/MsgSubscriptionComp.vue'

export default {
  components: {
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
  IonSkeletonText,
  MsgSubscriptionComp
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
      personAddOutline,
      ribbonOutline,
      receiptOutline,
      rocketOutline,
      briefcaseOutline,
      pieChartOutline,
    };
  },
  data() {
    return {
      user: heap.state.user,
      courierStatus:User.courier.status,
      storeList:User.supplier.storeList,
      version:this.toLocDateTime(document.lastModified)
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
      if(data.storeList){
        self.storeList=data.storeList
      }
    });
  },
  computed: {
    isAdmin(){
      return User.isAdmin();
    },
    isSignedIn() {
      return this.user?.user_id>0;
    },
  },
  methods: {
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
    toLocDateTime( iso ){
        const event = new Date(Date.parse(iso));
        const options = { month: 'short', day: 'numeric',hour:'numeric',minute:'numeric',year:'numeric' };

        return event.toLocaleDateString(undefined, options);
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