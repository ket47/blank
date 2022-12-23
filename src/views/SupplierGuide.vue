<template>
  <ion-page>
    <ion-content :class="'supplier-guide-page'">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" color="light" style="padding:0px 10px"></ion-back-button>
        </ion-buttons>
        <ion-icon  v-if="mainLogo" class="toolbar_svg_logo" style="color: white"  :icon="mainLogo"/>
      </ion-toolbar>  
      <div class="header-image-container main-block">
        <div class="main-block-content">
          <div class="text" style="color: white">
            <h2>Супер быстрая доставка</h2>
            <h4>Роскошь, ставшая для продавцов реальностью</h4>
            <router-link to="/user/supplier-dashboard">
              <ion-button color="secondary"><span class="button-text">Присоединиться</span></ion-button>
            </router-link>
          </div>
        </div>
      </div>


      <div class="winnings-container main-block">
        <div class="main-block-content">
          <h2>Почему мы?</h2>
          <div class="winnings-grid">
            <div class="winning-item">
              <h4>Увеличение продаж</h4>
              <p>Вы получаете не просто целый ряд дополнительных возможностей, но также эффективный канал продаж.</p>
            </div>
            <div class="winning-item">
              <h4>Реклама</h4>
              <p>Ваш магазин постоянно светится перед тысячами покупателей, значительная часть которых станут Вашими клиентами.</p>
            </div>
            <div class="winning-item">
              <h4>Упрощение работы</h4>
              <p>Больше нет нужды заморачиваться по поводу организации эффективной доставки. Весь нужный функционал мы уже вложили в наше приложение.</p>
            </div>
            <div class="winning-item">
              <h4>Гарантии</h4>
              <p>Мы гарантируем полную оплату, если на стороне пользователя или курьера случаются неприятности.</p>
            </div>
            <div class="winning-item">
              <h4>Маркетинг</h4>
              <p>Вы имеете полную свободу проводить необходимые Вам маркетинговые акции, добавлять скидки, чтобы увеличить свои продажи.</p>
            </div>
            <div class="winning-item">
              <h4>Точность и скорость</h4>
              <p>Философия нашей системы всячески подразумевает, что мы мгновенно и наверняка решаем вопросы, которые возникают в процессе доставки. </p>
            </div>
          </div>
        </div>
      </div>
      

      <div class="benefits-container main-block">
        <div class="main-block-content">
          <div class="benefits-list">
            <div class="benefit-item">
              <h4>Они придут</h4>
              <p>Больше половины будущих постоянных клиентов пробуют доставку прежде, чем лично прийти к Вам.</p>
            </div>
            <div class="benefit-item">
              <h4>Они вернутся</h4>
              <p>Если Ваши постоянные клиенты не смогли прийти, они всегда могут заказать доставку именно у Вас.</p>
            </div>
            <div class="benefit-item">
              <h4>Они найдутся</h4>
              <p>Те клиенты, которые не могли к Вам прийти из-за большого расстояния, теперь смогут всегда быть с Вами.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="intro-container main-block">
        <div class="main-block-content">
          <div class="landing-desc-col landing-desc-feature-col image-col" style="text-align: center;">
              <img src="/img/supplier_guide/tezkel_supplier_flyer_phone.png" width="300"/>
          </div>
          <div class="landing-desc-col landing-desc-feature-col">
            <h2>Проще не бывает</h2>
            <div class="intro-list">
              <div class="intro-item">
                <img src="/img/supplier_guide/tezkel_supplier_flyer_img1.png" width="100"/>
                <p>Клиент создаёт заказ в приложении</p>
                <div></div>
              </div>
              <div class="intro-item">
                <div></div>
                <p>Заказ поступает к Вам на сборку</p>
                <img src="/img/supplier_guide/tezkel_supplier_flyer_img2.png" width="100"/>
              </div>
              <div class="intro-item">
                <img src="/img/supplier_guide/tezkel_supplier_flyer_img3.png" width="100"/>
                <p>Курьер привозит заказ Клиенту</p>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="guide-container main-block">
        <div class="main-block-content">
          <div class="guide-list">
            <div class="guide-item">
              <div class="heading">
                <h2>1</h2>
                <h4>Создайте магазин и примите оферту</h4>
              </div>
              <p>Мы соблюдаем все необходимые законные требования сотрудничества.</p>
            </div>
            <div class="guide-item">
              <div class="heading">
                <h2>2</h2>
                <h4>Заполните каталог Вашими товарами</h4>
              </div>
              <p>Добавьте и оформите товары, которые Вы собираетесь продавать.</p>
            </div>
            <div class="guide-item">
              <div class="heading">
                <h2>3</h2>
                <h4>Дождитесь проверки и подтверждения</h4>
              </div>
              <p>Администраторы в самые короткие сроки проверят и подтвердят Ваши данные.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="sign-up-suggest main-block">
        <div class="main-block-content">
          <h2>Нужна экспресс-доставка?</h2>
          <div class="actions">
            <router-link to="/user/sign-up">
              <ion-button button-secondary color="secondary"><span class="button-text">Дайте две!</span></ion-button>
            </router-link>
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
  IonPage, 
  IonContent, 
  IonButton,
  IonButtons,
  IonToolbar,
  IonBackButton,
  IonIcon,
} from "@ionic/vue"

export default {
  props: [
    "pageDefaultBackLink"
  ],
  setup() {
    return {
      mainLogo
    }
  },
  components:{
  IonPage, 
  IonContent, 
  IonButton,
  IonBackButton,
  IonIcon,
  IonButtons,
  IonToolbar,
  FooterDesktop
  }
}
</script>

<style>


.supplier-guide-page ion-button.ion-color-secondary{
  --ion-color-contrast: white !important;
  font-weight: 900;
}
.supplier-guide-page .button-text{
  text-shadow: 0px 1px 2px #533704;
}
.supplier-guide-page h2,
.supplier-guide-page h3,
.supplier-guide-page h4{
  font-weight: bold;
  color: var(--ion-color-primary);
}
.supplier-guide-page p{
  font-size: 14px;
  line-height: 25px;
}


.supplier-guide-page .main-block{
  padding: 2em 0;
}
.supplier-guide-page .main-block .main-block-content{
  max-width: 1200px;
  margin: 0 auto;
}

.supplier-guide-page ion-toolbar{
  position: absolute;
  --ion-toolbar-background: transparent;
}
.supplier-guide-page ion-back-button{
  display: initial;
}

.header-image-container{
  padding: 2em 4em;
  display: grid;
  min-height: 550px;
  align-items: center;
  text-align: left;
  background-image: url("/public/img/supplier_guide/tezkel_supplier_flyer_header1.jpg");
  background-size: cover;
  background-position: center center;
}

.header-image-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1em;
}
.header-image-container h2,
.header-image-container h4{
  color: white;
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
.intro-container .main-block-content .image-col img{
  margin-bottom: -6em;
  margin-top: -8em;
}
.intro-container .intro-list{

}
.intro-container .intro-list .intro-item{
  display: grid;
  align-items: center;
  grid-template-columns: 30% 40% 30%;
}
.intro-container .intro-list .intro-item p{
  padding: 1em;
  font-weight: bold;
  position: relative;
}
.intro-container .intro-list .intro-item:not(:last-child) p::after{
  content: "";
  position: absolute;
  height: 3em;
  top: 90%;
  left: 50%;
  border-left: 6px dotted gray;
  
}


.winnings-container{
  padding-top: 4em !important;
  text-align: center;
}
.winnings-grid{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: baseline;
  padding: 1em;
  text-align: center;
  justify-content: center;
}
.winnings-grid .winning-item{
  padding: 2em;
  text-align: left;
}
.winnings-grid .winning-item p{
  color: gray;
}
.winnings-grid .winning-item img{
  width: 120px;
}

.sign-up-suggest{
  background: linear-gradient(to left, #303c88, #327ab4);
  text-align: center;
  min-height: 250px;
  display: grid;
  align-items: center;
}
.sign-up-suggest .main-block-content{
  color: white;
}
.sign-up-suggest .main-block-content h2{
  color: white;
}
.sign-up-suggest .main-block-content a{
  color: white;
}
.benefits-container{
  background: linear-gradient(to left, #303c88, #327ab4);
}
.benefits-list{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: baseline;
  padding: 1em;
}
.benefits-list .benefit-item{
  padding: 2em;
}
.benefits-list .benefit-item h4{
  color: white;
}
.benefits-list .benefit-item p{
  color: white;
  line-height: 20px;
  text-align: left;
}
.benefits-list .benefit-item img{
  width: 120px;
}


.guide-container{
}
.guide-list{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: baseline;
  padding: 1em;
}
.guide-list .guide-item{
  padding: 2em;
}
.guide-list .guide-item .heading{
  display: flex;
  align-items: center;
}
.guide-list .guide-item .heading h2{
  font-size: 50px;
  margin-right: 20px;
  color: #fed304;
}
.guide-list .guide-item .heading h4{
}
.guide-list .guide-item p{
  line-height: 20px;
  text-align: left;
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
  .supplier-guide-page .guide-list{
    grid-template-columns: 1fr !important;
  }
  .intro-container .main-block-content .image-col img{
    margin-bottom: 0em !important;
  }
  .supplier-guide-page .main-block{
    padding: 1em;
  }
  .supplier-guide-page .main-block .toolbar_svg_logo{
    left: 0;
    width: 100%;
  }
  .intro-container .main-block-content,
  .winnings-grid,
  .benefits-list
  {
    grid-template-columns: 1fr;
  }
  
  ion-footer.desktop-footer{
    display: none;
  }
}

</style>