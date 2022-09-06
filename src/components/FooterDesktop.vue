<template>
  <ion-footer class="desktop-footer" collapse="fade">
    <div class="desktop-footer-container">
      <!--
      <div class="social-media-block">
        <ion-img src="https://www.institute-of-photography.com/wp-content/uploads/best-hd-social-media-icons-viva-logo-drawing.jpg.png"></ion-img>
      </div>
      -->
      <div class="desktop-footer-top">
        <router-link to="/home">
        <div>
          <ion-img src="./img/logo_full_transparent.png" style="width:150px;height:auto"/>
          <ion-title>Быстро и удобно</ion-title>
        </div>
        </router-link>
        <div>
          <div>
          <router-link to="/about-us">
            <ion-label>О нас</ion-label>
          </router-link>
          </div>
          <div>
          <router-link to="/page-contacts">
            <ion-label>Контакты</ion-label>
          </router-link>
          </div>
          <div>
          <router-link to="/page-rules-customer">
            <ion-label>Правила пользования</ion-label>
          </router-link>
          </div>
          <div>
          <router-link to="/page-privacy_policy">
            <ion-label>Политика конфиденциальности</ion-label>
          </router-link>
          </div>
        </div>
      </div>
      <div class="desktop-footer-bottom">
          <div style="padding-top:15px">
            <ion-label>Все права защищены. 2022 iSellSoft © </ion-label>
          </div>
          <div>
            <a href="https://uniteller.ru" target="_new">
              <ion-img src="./img/uniteller.png" style="width:200px;height:auto"/>
            </a>
          </div>
      </div>
    </div>
  </ion-footer>
</template>
<script>
import Order          from '@/scripts/Order.js'
import {
  IonFooter,
  IonLabel,
  IonImg,
  IonTitle
  }      from '@ionic/vue'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  components:{
    IonFooter,
    IonLabel,
    IonImg,
    IonTitle
  },
  computed:{
    cartListTotal(){
      return Order.cart.listTotalGet()
    }
  },
})
</script>
