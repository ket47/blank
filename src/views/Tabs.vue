<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/home"  routerDirection="backward">
          <ion-icon :icon="homeOutline"/>
        </ion-tab-button>
          
        <ion-tab-button tab="tab2" href="/search"  routerDirection="backward">
          <ion-icon :icon="search" />
        </ion-tab-button>
        
        <ion-tab-button tab="tab3" href="/user-dashboard"  routerDirection="backward">
          <ion-icon :icon="personOutline" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { personOutline, search, homeOutline } from 'ionicons/icons';

export default {
  name: 'TabsPage',
  components: { IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    return {
      personOutline, 
      search, 
      homeOutline,
    }
  }
}
</script>

<style>
ion-tab-bar{
  --border: none;
}
ion-tab-button ion-icon {
  --ionicon-stroke-width: 50px;
}
</style>