<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';

export default {
  name: 'TezkelExpress',
  components: {
    IonApp,
    IonRouterOutlet
  }
};
</script>