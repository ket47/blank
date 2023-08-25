<template>
  <ion-app>
    <ion-router-outlet ref="mainAppOutlet" />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';

export default {
  components: {
    IonApp,
    IonRouterOutlet
  }
};
</script>