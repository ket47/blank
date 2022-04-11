<template>
  <ion-footer class="desktop-footer" collapse="fade">
    <div class="desktop-footer-container">
      <!--
      <div class="social-media-block">
        <ion-img src="https://www.institute-of-photography.com/wp-content/uploads/best-hd-social-media-icons-viva-logo-drawing.jpg.png"></ion-img>
      </div>
      -->
      <div class="desktop-footer-top">
        <div>
          <ion-img src="./assets/icon/tezkel_logo.png"></ion-img>
          <ion-title>Быстро и удобно</ion-title>
        </div>
        <div>
          <router-link to="/user-edit">
            <ion-label>О нас</ion-label>
          </router-link>
          <router-link to="/user-edit">
            <ion-label>Как заказать?</ion-label>
          </router-link>
        </div>
      </div>
      <div class="desktop-footer-bottom">
          <div>
            <ion-label>Все права защищены. 2022 iSellSoft © </ion-label>
          </div>
          <div>
            <router-link to="/user-edit">
              <ion-label>Правила пользования</ion-label>
            </router-link>
            <router-link to="/user-edit">
              <ion-label>Политика конфиденциальности</ion-label>
            </router-link>
          </div>
      </div>
    </div>
    <ion-text color="danger">
      {{ errorMessage }}
    </ion-text>
  </ion-footer>
</template>
