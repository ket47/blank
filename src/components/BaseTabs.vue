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
  justify-content: space-around;
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
  transform: translateY(1px);
  opacity: 1;
  line-height: inherit;
  min-height: unset;
  font-size: 12px;
}
ion-tab-bar.bottom-bar  ion-tab-button.tab-selected ion-icon {
  transform: translateY(-65%);
  --ionicon-stroke-width: 35px;
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
.ios ion-icon{
  margin-bottom:-5px;
}
</style>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar class="bottom-bar" slot="bottom">
        <ion-tab-button tab="catalog" id="catalog" href="/catalog" routerDirection="back" selected>
          <ion-icon :icon="storefrontOutline"/>
          <ion-label><b>Каталог</b></ion-label>
        </ion-tab-button>

        <ion-tab-button tab="search" id="search" href="/search" routerDirection="back">
          <ion-icon :icon="searchOutline"/>
          <ion-label><b>Поиск</b></ion-label>
        </ion-tab-button>

        <ion-tab-button tab="order" id="order" href="/order" routerDirection="back">
            <ion-icon :icon="readerOutline"/>
            <ion-badge color="warning" style="font-size:1.5em" v-if="activeOrderCount>0">{{activeOrderCount}}</ion-badge>
          <ion-label><b>Заказы</b></ion-label>
        </ion-tab-button>

        <ion-tab-button tab="user" id="user" href="/user" routerDirection="back">
          <ion-icon :icon="personOutline"/>
          <ion-label><b>Профиль</b></ion-label>
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
import Order        from '@/scripts/Order'

import {
  storefrontOutline,
  searchOutline,
  personOutline,
  readerOutline,
}                   from 'ionicons/icons';

export default{
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
      storefrontOutline,
      searchOutline,
      personOutline,
      readerOutline,
    };
  },
  data(){
    return {
      activeOrderCount:0
    }
  },
  async created(){
    const self=this
    this.$topic.on('pushStageChanged',data=>{
      self.activeOrderCount=data?.orderActiveCount
    })
    this.activeOrderCount=await Order.api.listCount()
  }
}
</script>
