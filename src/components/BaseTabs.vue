<style scoped>

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
  border-radius: 50%;
  width: 60px;
  height: 60px;
}
ion-tab-bar.bottom-bar .tab-indicator .tab-indicator-content{
  position: relative;
  z-index: 20;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background: linear-gradient(to bottom, #fff0 30%, #fff0 45%, #dbdada 45%, #dbdada 100%);
}

ion-tab-bar.bottom-bar .tab-indicator .tab-indicator-content-inner{
  background-color: var(--ion-color-primary);
  border-radius: 50%;
  position: absolute;
  top:5px;
  left:5px;
  width:calc( 100% - 10px );
  height:calc( 100% - 10px );
}

ion-tab-bar.bottom-bar.accent-outer .tab-indicator .tab-indicator-content {
  border: 4px solid #fff;
}

ion-tab-bar.bottom-bar .tab-indicator:before{
  content: "";
  position: absolute;
  z-index: 10;
  right: calc(100% + -2px);
  width: 20px;
  height: 16px;
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
  left: calc(100% - 2px);
  width: 20px;
  height: 16px;
  top: 27px;
  border-top-left-radius: 15px;
  box-shadow: -5px -3px 5px -0px #dbdada;
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
ion-icon{
  font-size:2.5em !important;
}
</style>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar class="bottom-bar" slot="bottom">
        <ion-tab-button tab="tab1" id="tab1" href="/home" routerDirection="backward" selected>
          <ion-icon :icon="homeIcon"/>
          <ion-label>Главная</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" id="tab2" href="/search" routerDirection="backward">
          <ion-icon :icon="searchIcon"/>
          <ion-label>Поиск</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" id="tab3" href="/order-list" routerDirection="backward">
            <ion-icon :icon="ordersIcon"/>
            <ion-badge color="warning" style="font-size:1.5em" v-if="activeOrderCount>0">{{activeOrderCount}}</ion-badge>
          <ion-label>Заказы</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" id="tab4" href="/user-dashboard" routerDirection="backward">
          <ion-icon :icon="personIcon"/>
          <ion-label>Аккаунт</ion-label>
        </ion-tab-button>
        <div class="tab-indicator-container">
          <div class="tab-indicator">
            <div class="tab-indicator-content">
              <div class="tab-indicator-content-inner"></div>
            </div>
          </div>
        </div>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="js">
import {
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonBadge,
}                   from "@ionic/vue";
import personIcon   from "@/assets/icons/account.svg";
import ordersIcon   from "@/assets/icons/orders.svg";
import searchIcon   from "@/assets/icons/search.svg";
import homeIcon     from "@/assets/icons/home.svg";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonBadge,
  },
  setup() {
    return {
      personIcon,ordersIcon,searchIcon,homeIcon
    };
  },
  data(){
    return {
      activeOrderCount:0
    }
  },
  created(){
    const self=this
    this.$topic.on('activeOrderCountChanged',count=>{
      self.activeOrderCount=count
    })
  }
})
</script>
