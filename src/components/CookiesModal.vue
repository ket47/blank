<template>
  <div v-show="isOpen" class="cookies-modal">
    <ion-card>
      <ion-card-header>
        <ion-card-title>Мы используем файлы cookies</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        Мы используем файлы cookies на этом веб-сайте, чтобы отличать вас от других пользователей, а также чтобы у вас оставались приятные впечатления от пользования нашим сайтом.
      </ion-card-content>
      <ion-button fill="clear" @click="markShown()">Хорошо</ion-button>
    </ion-card>
  </div>
</template>

<script>
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
}                     from "@ionic/vue";
export default{
  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  },
  data(){
    return {
      isOpen: false,
      localShown: false
    };
  },
  created(){
    if(!localStorage.cookiesShown) this.isOpen = true
  },
  methods: {
    markShown(){
      this.isOpen = false
      localStorage.setItem('cookiesShown', true);
    }
  }
};
</script>
<style scoped>
.desktop-main-container .cookies-modal{
  max-width: 40%;
}
.cookies-modal{
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
}

</style>