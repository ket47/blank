<template>
  <ion-page>
    <ion-content :class="'about-us-page'">
      <div class="header-image-container main-block">
        <ion-icon class="toolbar_svg_logo" style="color: white"  :icon="mainLogo"/>
        <div class="main-block-content" style="display:none;transform: rotate(-7deg);">
          <div class="text" style="color: white">
            <h2 style="color: rgb(235, 192, 0); font-size: 42px; margin: 0; filter: drop-shadow(-2px 2px 2px #042c4f);">Зарегистрируйся</h2>
            <h4 style="font-size: 24px; margin-top: 5px;">и получай скидку до <b style="font-size: 20px;">1000</b> рублей</h4>
              <ion-button expand="block" color="light" @click="$go('/user/sign-up')"><b>ХОЧУ СКИДКУ СЕЙЧАС!</b></ion-button>
              <ion-button expand="block" fill="clear" color="light" @click="$go('/catalog')"><b>Нет, скидку получу позже</b></ion-button>
          </div>
        </div>
      </div>

      <div class="intro-container main-block">
        <div class="main-block-content">
          <div class="landing-desc-col landing-desc-feature-col">
            <h2 style="text-align: left;">Сервис курьерской доставки</h2>
            <p>Супер быстрая доставка товаров на дом теперь не роскошь, а вполне доступная для каждого услуга. 
                Экономия времени, разнообразный ассортимент и возможность получить любой товар не выходя за пределы любимого домашнего очага, - все это возможно с Tezkel.
            </p>
          </div>
          <div class="landing-desc-col landing-desc-feature-col image-col" style="text-align: center;">
              <img src="/img/about_us/tezkel_anasayfa1.png"/>
          </div>
        </div>
      </div>


      <div style="padding:10px;margin-top:25px;display:none">
        <h2 style="text-align: left;">Сайт как приложение</h2>
        <p>
          С помощью сайта tezkel.com вы можете делать абсолютно все, потому что сайт сделан как <b>Веб приложение</b>. Вы можете создать ярлык сайта в телефоне и пользоваться полным функционалом сервиса. 
        </p>
        <p>
          Всё же для телефонов на ОС Андроид есть возможность использовать классическое приложение.
        </p>
        <a href="https://play.google.com/store/apps/details?id=com.tezkel.twa" target="_new" stlye="text-decoration: none">
          <ion-button color="primary">
            <ion-icon :src="logoGooglePlaystore" slot="start" />
            
            скачать из google play</ion-button>
        </a>
      </div>

      <div class="order-stages-container main-block">
        <div class="main-block-content">
          <h2>Как всё работает?</h2>
          <div class="order-stages-grid">
            <div class="order-stage-item">
              <img src="/img/about_us/tezkel_anasayfa_icon1.png"/>
              <h4>1. Создайте заказ</h4>
              <p>Выберите нужные товары и создайте заказ</p>
            </div>
            <div class="order-stage-item">
              <img src="/img/about_us/tezkel_anasayfa_icon2.png"/>
              <h4>2. Подтвердите заказ</h4>
              <p>Выберите карту и выполните оплату</p>
            </div>
            <div class="order-stage-item">
              <img src="/img/about_us/tezkel_anasayfa_icon3.png"/>
              <h4>3. Получите уведомление</h4>
              <p>Вам придут уведомления о доставке</p>
            </div>
            <div class="order-stage-item">
              <img src="/img/about_us/tezkel_anasayfa_icon4.png"/>
              <h4>4. Получите заказ</h4>
              <p>Получите заказанные товары</p>
            </div>
          </div>
        </div>
      </div>

      <div class="sign-up-suggest main-block">
        <div class="main-block-content">
          <h2>Хотите продавать на Tezkel?</h2>
          <h4>Зарегистрируйтесь и создайте собственный магазин!</h4>
          <div class="actions">
            <router-link to="/user/sign-up">
              <ion-button color="secondary">Зарегистрироваться</ion-button>
            </router-link>
          </div>
        </div>
      </div>


      <div class="main-block">
        <div class="benefits-container main-block-content">
          <h2>Tezkel – ультрасовременный сервис экпресс-доставки</h2>
          <div class="benefits-list">
            <div class="benefit-item">
              <img src="/img/about_us/tezkel_anasayfa_icon_speed.png"/>
              <h4>Оперативность</h4>
              <p>После подтверждения Ваш заказ отправляется в централизованную сеть зарегистрированных курьеров, и ближайший свободный курьер берет его в работу.</p>
            </div>
            <div class="benefit-item">
              <img src="/img/about_us/tezkel_anasayfa_icon_trust.png"/>
              <h4>Ответственность</h4>
              <p>В процессе обработки заказа каждый актёр несёт полную ответственность за добросовестное и своевременное собственных функций по выполнению заказа.</p>
            </div>
            <div class="benefit-item">
              <img src="/img/about_us/tezkel_anasayfa_icon_accuracy.png"/>
              <h4>Точность</h4>
              <p>Курьер приезжает в обусловленный интервал времени. Вы можете убедиться в этом, отследив перемещение курьера вплоть до указанного Вами адреса.</p>
            </div>
            <div class="benefit-item">
              <img src="/img/about_us/tezkel_anasayfa_icon_prestige.png"/>
              <h4>Квалифицированность</h4>
              <p>У нас работают только профессиональные курьеры. Перед тем как получить допуск к системе, каждый из них проходит проверку в несколько ступеней.</p>
            </div>
            <div class="benefit-item">
              <img src="/img/about_us/tezkel_anasayfa_icon_tarif.png"/>
              <h4>Разумные тарифы</h4>
              <p>Мы предлагаем крайне выгодные цены на экпресс-доставку всего 90 руб. К тому же, мы регулярно предлагаем различные купоны и акции, которые делают стоимость услуг еще приятнее.</p>
            </div>
            <div class="benefit-item">
              <img src="/img/about_us/tezkel_anasayfa_icon_flex.png"/>
              <h4>Гибкость</h4>
              <p>Мы осуществляем доставку высокой сложности, а также предоставляем услугу размещения и реализации товаров на нашей площадке.</p>
            </div>
          </div>
        </div>
      </div>

    <footer-desktop/>
    </ion-content>
  </ion-page>
</template>
<script>

import FooterDesktop  from "@/components/FooterDesktop";
import mainLogo       from "@/assets/icons/tezkel_logo.svg";
import {
  logoGooglePlaystore,
  arrowBackOutline
}                     from "ionicons/icons";

import {
  IonPage, 
  IonContent, 
  IonButton,
  IonIcon,
} from "@ionic/vue"

export default {
  props: [
    "pageDefaultBackLink"
  ],
  setup() {
    return {
      mainLogo,
      logoGooglePlaystore,
      arrowBackOutline
    }
  },
  components:{
  IonPage, 
  IonContent, 
  IonButton,
  IonIcon,
  FooterDesktop
  }
}
</script>

<style>

.about-us-page h2,
.about-us-page h3,
.about-us-page h4{
  font-weight: bold;
  color: var(--ion-color-primary);
}
.about-us-page p{
  font-size: 14px;
  line-height: 25px;
}


.about-us-page .main-block{
  padding: 2em 0;
}
.about-us-page .main-block .main-block-content{
  max-width: 1200px;
  margin: 0 auto;
}

.about-us-page ion-toolbar{
  position: absolute;
  --ion-toolbar-background: transparent;
}
.about-us-page ion-back-button{
  display: initial;
}

.header-image-container{
  padding: 2em 4em;
  display: grid;
  min-height: 350px;
  align-items: center;
  text-align: center;
  background-image: url("/public/img/about_us/tezkel_header.jpg");
  background-size: cover;
  background-position: center center;
}
.header-image-container h2,
.header-image-container h4{
  font-size: 20px;
  color: white;
}
@media screen and (max-width: 740px) {
  .header-image-container h2{
    font-size: 28px !important;
  }
  .header-image-container h4{
    font-size: 15px !important;
  }
}
.header-image-container .main-block-content{
  animation: scale 2s ease-out infinite;
}
@keyframes scale {
  0%   {scale: 1}
  50%  {scale: 1.04}
  100% {scale: 1}
}

.intro-container{
  /*background-image: url("/public/img/about_us/tezkel_anasayfa1.jpg");
  background-position-y: bottom;
  background-position-x: right;
  min-height: 600px;*/
  display: grid;
  background-color: #f2f2f2;
}
.intro-container .main-block-content{
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 1em;
}
.intro-container .main-block-content .image-col{

}
.intro-container .main-block-content img{
  margin-bottom: -5em;
}

.order-stages-container{
  padding-top: 4em !important;
  text-align: center;
}
.order-stages-grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: baseline;
  padding: 1em;
  text-align: center;
  justify-content: center;
}
.order-stages-grid .order-stage-item{
  padding: 2em;
}
.order-stages-grid .order-stage-item p{
  color: gray;
}
.order-stages-grid .order-stage-item img{
  width: 120px;
}

.sign-up-suggest{
  background-color: #009dcd;
  text-align: center;
  min-height: 250px;
  display: grid;
  align-items: center;
}
.sign-up-suggest h2{
  color: rgb(235, 192, 0); 
  font-size: 28px;
  filter: drop-shadow(0px 2px 2px #042c4f);
}
.sign-up-suggest h4{
  color: white;
}
.sign-up-suggest .main-block-content{
  
}
.benefits-container{
  text-align: center;
}
.benefits-list{
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: baseline;
  padding: 1em;
}
.benefits-list .benefit-item{
  padding: 2em;
}
.benefits-list .benefit-item p{
  color: gray;
  line-height: 20px;
  text-align: left;
}
.benefits-list .benefit-item img{
  width: 120px;
}


  /*=========================*/
  /*==========FOOTER=========*/
  /*=========================*/
  ion-footer.desktop-footer{
    color: white;
    background: var(--footer-background, #3880ff);
    padding: 1em 2em;
    min-height: 15vh;
  }
  ion-footer.desktop-footer .desktop-footer-container{
    max-width: calc(var(--breakpoints-width)/1);
    margin: 0 auto;
  }
  ion-footer  a{
    color: white;
    text-decoration: none;
    margin-left: 20px;
  }
  ion-footer ion-title{
    padding: 0px;
    font-size: 15px;
  }
  ion-footer.desktop-footer .social-media-block{
    justify-content: center;
    display: flex;
  }
  ion-footer.desktop-footer .social-media-block ion-img{
    width: 200px;
  }
  ion-footer.desktop-footer .desktop-footer-top{
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 1em 0;
  }
  ion-footer.desktop-footer .desktop-footer-top ion-img{
    width: inherit;
    display: inline-block;
  }
  ion-footer.desktop-footer .desktop-footer-bottom{
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 1em 0;
    border-top: 1px solid gray;
    font-size: 12px;
  }


  /*=========================*/
  /*==========FOOTER=========*/
  /*=========================*/


@media screen and (max-width: 740px) {
  .about-us-page .main-block{
    padding: 1em;
  }
  .about-us-page .main-block .toolbar_svg_logo{
    left: 0;
    width: 100%;
  }
  .intro-container .main-block-content,
  .order-stages-grid,
  .benefits-list
  {
    grid-template-columns: 1fr;
  }
  
  ion-footer.desktop-footer{
    display: none;
  }
}

</style>