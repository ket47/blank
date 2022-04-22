<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar class="bottom-bar accent-outer" slot="bottom">
        <ion-tab-button tab="tab1" href="/home" routerDirection="backward" selected>
          <ion-icon src="./assets/icon/home.svg" style="font-size:30px;"/>
          <ion-label>Главная</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/search" routerDirection="backward">
          <ion-icon src="./assets/icon/search.svg" style="font-size:30px;"/>
          <ion-label>Поиск</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/order-list" routerDirection="backward">
          <ion-icon src="./assets/icon/orders1.svg" style="font-size:30px;"/>
          <ion-label>Заказы</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/user-dashboard" routerDirection="backward">
          <ion-icon :icon="personIcon" style="font-size:30px;"/>
          <ion-label>Аккаунт</ion-label>
        </ion-tab-button>
        <div class="tab-indicator-container">
          <div class="tab-indicator">
            <div class="tab-indicator-content">
            </div>
          </div>
        </div>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";

import personIcon from "@/assets/icons/account.svg";

export default {
  name: "TabsPage",
  components: {
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage,
    IonRouterOutlet,
  },
  setup() {
    return {
      personIcon
    };
  },
};
</script>

<style>

ion-tab-bar{
  --border: none;
}
ion-tab-bar.bottom-bar  {
  --tab-witdh: calc(100vw / 4);
  contain: inherit;
  overflow: visible;
  position: relative;
  padding-inline-end: 0;
  box-shadow: 0px -3px 10px #ccc;
}
ion-tab-bar.bottom-bar  ion-tab-button{
  --padding-start: 0;
  --padding-end: 0;
}
ion-tab-bar.bottom-bar  ion-tab-button ion-label {
  transition: 0.4s ease;
  opacity: 0;
  line-height: 0px;
  min-height: 0px;
  transform: translateY(10px);
}
ion-tab-bar.bottom-bar  ion-tab-button ion-icon {
  transition: 0.3s ease;
  --ionicon-stroke-width: 30px;
  font-size: 25px;
}
ion-tab-bar.bottom-bar  ion-tab-button.tab-selected {
  height: var(--tab-witdh);
}
ion-tab-bar.bottom-bar  ion-tab-button.tab-selected ion-label {
  transform: translateY(-5px);
  opacity: 1;
  line-height: inherit;
  min-height: unset;
  font-size: 12px;
}
ion-tab-bar.bottom-bar  ion-tab-button.tab-selected ion-icon {
  transform: translateY(-65%);
  --ionicon-stroke-width: 50px;
  filter: grayscale(1) brightness(10);
}
ion-tab-bar.bottom-bar  .tab-indicator-container{
  position: absolute;
  width: var(--tab-witdh);
  left: 0px;
  top: 0px;
  justify-content: center;
  display: flex;
  transform: translateX(0);
  transition: 0.3s ease;
  opacity: 0;
}
ion-tab-bar.bottom-bar  .tab-indicator{
  position: relative;
  background-color: white;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  /*box-shadow: 0px -4px 5px 0px #999;
  border: 5px solid #dbdada;*/
  box-shadow: 0px -5px 10px 0px #dbdada;
}
ion-tab-bar.bottom-bar .tab-indicator .tab-indicator-content{
  background-color: var(--ion-color-primary);
  position: relative;
  z-index: 20;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  border: 5px solid #dbdada;
  background-color: dbdada;
}

ion-tab-bar.bottom-bar.accent-outer .tab-indicator .tab-indicator-content {
  border: 4px solid #fff;
}

ion-tab-bar.bottom-bar .tab-indicator:before{
  content: "";
  position: absolute;
  z-index: 10;
  right: calc(100% + -4px);
  width: 20px;
  height: 20px;
  top: 27px;
  border-top-right-radius: 15px;
  box-shadow: 5px -3px 0px -1px #dbdada;
}

ion-tab-bar.bottom-bar.accent-outer .tab-indicator:before{
  right: calc(100% + -4px);
  top: 7px;
  border-bottom-right-radius: 20px;
  border-top-right-radius: 0px;
  box-shadow: 0px 9px 0px 0 #fff;
}

ion-tab-bar.bottom-bar .tab-indicator:after{
  content: "";
  position: absolute;
  z-index: 10;
  left: calc(100% - 4px);
  width: 20px;
  height: 20px;
  top: 27px;
  border-top-left-radius: 15px;
  box-shadow: -5px -3px 0px -1px #dbdada;
}

ion-tab-bar.bottom-bar.accent-outer .tab-indicator:after{
  left: calc(100% - 4px);
  top: 7px;
  border-bottom-left-radius: 20px;
  border-top-left-radius: 0px;
  box-shadow: 0px 9px 0px 0 #fff;
}

ion-tab-bar.bottom-bar  ion-tab-button:nth-child(1).tab-selected ~ .tab-indicator-container{
  transform: translateX(calc(var(--tab-witdh) * 0));
  opacity: 1;
  top: -27px;
}
ion-tab-bar.bottom-bar  ion-tab-button:nth-child(2).tab-selected ~ .tab-indicator-container{
  transform: translateX(calc(var(--tab-witdh) * 1));
  opacity: 1;
  top: -27px;
}
ion-tab-bar.bottom-bar  ion-tab-button:nth-child(3).tab-selected ~ .tab-indicator-container{
  transform: translateX(calc(var(--tab-witdh) * 2));
  opacity: 1;
  top: -27px;
}
ion-tab-bar.bottom-bar  ion-tab-button:nth-child(4).tab-selected ~ .tab-indicator-container{
  transform: translateX(calc(var(--tab-witdh) * 3));
  opacity: 1;
  top: -27px;
}
</style>