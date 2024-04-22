<template>
  <ion-page>
    <ion-content :class="'supplier-guide-page'">
      <div class="header-image-container main-block">
        <div class="main-block-content">
          <div class="text" style="color: white">
            <h2>Настройте витрину и расширяйте свой бизнес</h2>
            <h4>Воспользуйтесь специальным предложением по доставке от нас и набирайте обороты!</h4>
            <router-link to="/user/supplier-dashboard">
              <ion-button color="secondary"><span class="button-text">Присоединиться</span></ion-button>
            </router-link>
          </div>
        </div>
      </div>


      <div class="main-block-content" style="padding:10px;box-shadow:0px 5px 5px #eee">
        <h2 style="text-align:center">Видео презентация</h2>
        <div style="position:relative;">
          <a href="https://www.youtube.com/watch?v=lC9llgvyefM" target="_new">
          <h4 style="position:absolute;color:white;left:10px">Короткое видео о нашем сервисе</h4>
          <img src="/img/supplier_guide/videoThumbnail.jpg" style="border-radius:10px;width:100%;"/>
          </a>
        </div>
      </div>
      <div class="winnings-container main-block">
        <div class="main-block-content">
          <h2>Что Вы получите, работая именно с Tezkel?</h2>
          <div class="winnings-grid">
            <div class="winning-item">
              <div class="winning-item-img">
                <img src="/img/supplier_guide/supp_benef1.png" width="400"/>
              </div>
              <div class="winning-item-descr">
                <h2>Увеличение торговых оборотов</h2>
                <h4>Вы получаете не просто ряд дополнительных возможностей, но также эффективный канал для реализации Вашей продукции.</h4>
              </div>
            </div>
            <div class="winning-item">
              <div class="winning-item-img">
                <img src="/img/supplier_guide/supp_benef2.png" width="400"/>
              </div>
              <div class="winning-item-descr">
                <h2>Перманентная реклама</h2>
                <h4>Ваш магазин постоянно виден тысячам покупателей, значительная часть которых может стать Вашими клиентами. Кроме того, мы постоянно проводим маркетинговые кампании для поддержки наших клиентов и привлечения новых покупателей.</h4>
              </div>
            </div>
            <div class="winning-item">
              <div class="winning-item-img">
                <img src="/img/supplier_guide/supp_benef3.png" width="400"/>
              </div>
              <div class="winning-item-descr">
                <h2>Упрощение рабочих процессов</h2>
                <h4>Наша компания избавляет Вас от необходимости организации эффективной доставки. Весь нужный функционал по доставке мы вложили в наше приложение.</h4>
              </div>
            </div>
            <div class="winning-item">
              <div class="winning-item-img">
                <img src="/img/supplier_guide/supp_benef4.png" width="400"/>
              </div>
              <div class="winning-item-descr">
                <h2>Поддержка высокого уровня репутации</h2>
                <h4>Мы предоставляем высокий уровень обслуживания так, что репутация Вашего предприятия выйдет на новый уровень.</h4>
              </div>
            </div>
            <div class="winning-item">
              <div class="winning-item-img">
                <img src="/img/supplier_guide/supp_benef5.png" width="400"/>
              </div>
              <div class="winning-item-descr">
                <h2>Онлайн-доступность с любого устройства</h2>
                <h4>Наша площадка даёт возможность Вашему бизнесу быть простым и доступным для пользователей любых устройств. Будь-то наше мобильное приложение для iPhone, iPad, Android, или же формат веб-сайта для пользователей ПК.</h4>
              </div>
            </div>
          </div>
        </div>
      </div>



      


      <div class="benefits-container main-block">
        <div class="main-block-content">
          <h2>Сделайте всего 3 шага и присоединяйтесь к Tezkel!</h2>
          <div class="benefits-list">
            <div class="benefit-item">
              <div class="benefit-img">
                <img src="/img/supplier_guide/tezkel_supplier_progress1.png"/>
              </div>
              <div class="heading">
                <h2>1</h2>
                <h4>Создайте магазин и примите оферту</h4>
              </div>
              <p>Мы соблюдаем все необходимые законные требования сотрудничества.</p>
            </div>
            <div class="benefit-item">
              <div class="benefit-img">
                <img src="/img/supplier_guide/tezkel_supplier_progress2.png"/>
              </div>
              <div class="heading">
                <h2>2</h2>
                <h4>Заполните каталог Вашими товарами</h4>
              </div>
              <p>Добавьте и оформите товары, которые Вы собираетесь продавать.</p>
            </div>
            <div class="benefit-item">
              <div class="benefit-img">
                <img src="/img/supplier_guide/tezkel_supplier_progress3.png"/>
              </div>
              <div class="heading">
                <h2>3</h2>
                <h4>Дождитесь проверки и подтверждения</h4>
              </div>
              <p>Администраторы в самые короткие сроки проверят и подтвердят Ваши данные.</p>
            </div>
          </div>
        </div>
      </div>


      <div class="tarif-container main-block">
        <div class="main-block-content">
          <h2>Есть несколько способов работы с нами.</h2>
          <h4>Выбирайте самый удобный!</h4>
          <div class="tarif-list">
            <div class="tarif-item">
              <div class="tarif-left">
                <h4>Тариф "Старт"</h4>
                <p>Вы можете воспользоваться бесплатной версией нашего сервиса.</p>
                <ul class="tarif-conditions">
                  <li><b class="icon green-icon">✔</b>Размещение на <a href="#qst_1">платформе</a>.</li>
                  <li><b class="icon green-icon">✔</b><a href="#qst_5">Система</a> управления заказами (до 30 заказов в месяц).</li>
                  <li><b class="icon green-icon">✔</b>Функция "Электронное меню" (доступно для кафе и ресторанов).</li>
                  <li><b class="icon red-icon">✖</b>Синхронизация с <a href="#qst_10">системами торгового учёта</a>.</li>
                  <li><b class="icon red-icon">✖</b>Маркетинговая поддержка для проведения рекламных акций.</li>
                  <li><b class="icon red-icon">✖</b>Приём <a href="#qst_6">онлайн-оплат</a>.</li>
                  <li><b class="icon red-icon">✖</b>Ускоренные <a href="#qst_9">взаиморасчёты</a>.</li>
                  <li><b class="icon red-icon">✖</b>Услуги <a href="#qst_11">доставки</a> с помощью наших курьеров.</li>
                </ul>
              </div>
              <div class="tarif-right">
                <h3>Бесплатно</h3>
              </div>
            </div>
            <div class="tarif-item">
              <div class="tarif-left">
                <h4>Тариф "Маркетплейс"</h4>
                <p>В случае, когда Вам не нужны ни услуги доставки, ни приём электронных платежей, Вы всё ещё имеете возможность увеличить охват воспользовавшись нашим сервисом.</p>
                <ul class="tarif-conditions">
                  <li><b class="icon green-icon">✔</b>Размещение на <a href="#qst_1">платформе</a>.</li>
                  <li><b class="icon green-icon">✔</b><a href="#qst_5">Система</a> управления заказами.</li>
                  <li><b class="icon green-icon">✔</b>Функция "Электронное меню" (доступно для кафе и ресторанов).</li>
                  <li><b class="icon green-icon">✔</b>Синхронизация с <a href="#qst_10">системами торгового учёта</a>.</li>
                  <li><b class="icon green-icon">✔</b>Маркетинговая поддержка для проведения рекламных акций.</li>
                  <li><b class="icon red-icon">✖</b>Приём <a href="#qst_6">онлайн-оплат</a>.</li>
                  <li><b class="icon red-icon">✖</b>Ускоренные <a href="#qst_9">взаиморасчёты</a>.</li>
                  <li><b class="icon red-icon">✖</b>Услуги <a href="#qst_11">доставки</a> с помощью наших курьеров.</li>
                </ul>
              </div>
              <div class="tarif-right">
                <h1>7%</h1>
                <h6>Ставка</h6>
              </div>
            </div>
            <div class="tarif-item">
              <div class="tarif-left">
                <h4>Тариф "Маркетплейс + Оплата"</h4>
                <p>Если Вам не нужны услуги доставки, но Вы по-прежнему хотите расширить свою аудиторию, то у нас есть для Вас решение.</p>
                <ul class="tarif-conditions">
                  <li><b class="icon green-icon">✔</b>Размещение на <a href="#qst_1">платформе</a>.</li>
                  <li><b class="icon green-icon">✔</b><a href="#qst_5">Система</a> управления заказами.</li>
                  <li><b class="icon green-icon">✔</b>Функция "Электронное меню" (доступно для кафе и ресторанов).</li>
                  <li><b class="icon green-icon">✔</b>Синхронизация с <a href="#qst_10">системами торгового учёта</a>.</li>
                  <li><b class="icon green-icon">✔</b>Маркетинговая поддержка для проведения рекламных акций.</li>
                  <li><b class="icon green-icon">✔</b>Приём <a href="#qst_6">онлайн-оплат</a>.</li>
                  <li><b class="icon green-icon">✔</b>Ускоренные <a href="#qst_9">взаиморасчёты</a>.</li>
                  <li><b class="icon red-icon">✖</b>Услуги <a href="#qst_11">доставки</a> с помощью наших курьеров.</li>
                </ul>
              </div>
              <div class="tarif-right">
                <h1>10%</h1>
                <h6>Ставка</h6>
              </div>
            </div>
            <div class="tarif-item">
              <div class="tarif-left">
                <h4>Тариф "Свобода"</h4>
                <p>Почувствуйте вкус свободы с нашим максимальным тарифом</p>
                <ul class="tarif-conditions">
                  <li><b class="icon green-icon">✔</b>Размещение на <a href="#qst_1">платформе</a>.</li>
                  <li><b class="icon green-icon">✔</b><a href="#qst_5">Система</a> управления заказами.</li>
                  <li><b class="icon green-icon">✔</b>Функция "Электронное меню" (доступно для кафе и ресторанов).</li>
                  <li><b class="icon green-icon">✔</b>Синхронизация с <a href="#qst_10">системами торгового учёта</a>.</li>
                  <li><b class="icon green-icon">✔</b>Маркетинговая поддержка для проведения рекламных акций.</li>
                  <li><b class="icon green-icon">✔</b>Приём <a href="#qst_6">онлайн-оплат</a>.</li>
                  <li><b class="icon green-icon">✔</b>Ускоренные <a href="#qst_9">взаиморасчёты</a>.</li>
                  <li><b class="icon green-icon">✔</b>Услуги <a href="#qst_11">доставки</a> с помощью наших курьеров.</li>
                </ul>
              </div>
              <div class="tarif-right">
                <h1>25%</h1>
                <h6>Ставка</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="questions-block main-block">
        <div class="main-block-content">
          <h2>Частые вопросы</h2>
          <h4>Мы собрали самые часто задаваемые вопросы в одном месте и дали лаконичные ответы на них</h4>
          <ion-accordion-group  expand="inset">
            <ion-accordion value="qst_1">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_1">Что такое "платформа"?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Платформа - это онлайн-ресурс, одним из главных преимуществ которого является постоянное сканирование и индексирование популярными поисковыми системами, такими как Google, Yandex, Bing и прочее.</div>
            </ion-accordion>
            <ion-accordion value="qst_2">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_2">Платформа - это сайт?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Да и не только. Наша платформа примечательна тем, что она представляет собой и сайт, и приложение одновременно. Это означает, что одну и ту же версию площадки Вы можете одинаково удобно использовать на любом устройстве.</div>
            </ion-accordion>
            <ion-accordion value="qst_3">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_3">Зачем мне платформа для работы?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Главная задача нашей платформы заключается в максимальной автоматизации Вашего рабочего процесса.</div>
            </ion-accordion>
            <ion-accordion value="qst_4">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_4">В чём заключается автоматизация, предоставляемая платформой?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Автоматизация представляет собой автоматически настроенную работу с получением заказов от клиентов, работу с эквайрингом, исключительный контроль над заказом.</div>
            </ion-accordion>
            <ion-accordion value="qst_5">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_5">Как я могу контролировать свои заказы?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Наша платформа предоставляет возможность отслеживания каждого этапа заказа: с момента пользовательской корзины и до момента приёма заказа покупателем. Этапы, требующие Вашего участия, такие как поступление, сборка и т.п. сопровождаются уведомлениями в приложении и Telegram-боте, оповещениями по электронной почте и даже смс-сообщениями. Кроме того, Вы можете прикреплять фотографии, которые помогут покупателю убедиться в качестве Вашего заказа, что, в свою очередь, вызывает доверие у Ваших клиентов.</div>
            </ion-accordion>
            <ion-accordion value="qst_6">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_6">В чём суть онлайн-оплаты?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Функция онлайн-оплаты заключается в подключении услуг эквайринга. Это обусловливает безопасность денежных переводов, так как весь процесс состоит из трёх этапов: предварительная блокировка средств на счёте покупателя, возврат части средств (в случае необходимости) и непосредственно подтверждающий перевод средств.</div>
            </ion-accordion>
            <ion-accordion value="qst_7">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_7">Что такое эквайринг и как с ним работать?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Эквайринг — это технология безналичного приема платежей с использованием банковских карт. Она позволяет принимать и контролировать безналичные платежи. Работа с ним  заранее автоматизирована и настроена на нашей платформе, что означает, что такие аспекты, как собственно прием средств, корректировка сдачи и предоставление чека покупателю не требует Вашего вмешательства.</div>
            </ion-accordion>
            <ion-accordion value="qst_8">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_8">Как работать с чеками?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Для осуществления работы с чеками мы, будучи посредником в передаче оплаты от покупателя продавцу, со своей стороны выписываем агентский чек (чек посредника) покупателю. То есть Вам больше не нужно формировать чек, что, в свою очередь, избавляет Вас от необходимости сталкиваться со всеми затратами на создание чеков. Вместо этого достаточно только выписать расходный документ в Вашей учётной системе, а чек мы выпишем сами.</div>
            </ion-accordion>
            <ion-accordion value="qst_9">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_9">Каков порядок взаиморасчётов?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Мы выполняем регулярные взаиморасчёты с Вами ориентировочно около двух раз в неделю. Такая частота позволяет избегать ошибок и нестыковок в отчётах и актах.</div>
            </ion-accordion>
            <ion-accordion value="qst_10">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_10">Что такое синхронизация?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Мы предоставляем возможность синхронизации Вашей витрины на нашей платформе с системами торгового учёта, что позволяет Вам автоматизировать обновления цен и остатков товаров.</div>
            </ion-accordion>
            <ion-accordion value="qst_11" >
              <ion-item slot="header"  color="light">
                <ion-label><a name="qst_11">Могу ли я подключить доставку?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">В случае, если Вас заинтересовала опция, включающая доставку силами наших курьеров, то мы рекомендуем Вам уточнить возможность подключения данной опции конкретно для Вас в зависимости от Вашего города.</div>
            </ion-accordion>
            <ion-accordion value="qst_12">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_12">Какова Ваша роль в рабочем процессе?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">Помимо того, что мы предоставляем инструмент, позволяющий Вам получить новых покупаетелей, мы также принимаем участие в рабочем процессе и упрощаем его для Вас. После того, как наш курьер начинает доставку, котроль и рабочая нагрузка по активному заказу полностью переходит к нам. Таким образом Вам необходимо только подготовить заказ к доставке.</div>
            </ion-accordion>
            <ion-accordion value="qst_13">
              <ion-item slot="header" color="light">
                <ion-label><a name="qst_13">Есть ли возможность отследить заказ?</a></ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">На нашей платформе есть функция активного отслеживания местоположения курьеров, что означает, что текущий географический статус заказа может быть отслежен в реальном времени с точностью до 10 метров.</div>
            </ion-accordion>
          </ion-accordion-group>
        </div>
      </div>

      <div class="sign-up-suggest main-block">
        <div class="main-block-content">
          <h2>Решили ускорить рост Вашего бизнеса?</h2>
          <h4>Подайте заявку, а мы займёмся оформлением</h4>
          <div class="actions">
            <router-link to="/user/supplier-dashboard">
              <ion-button button-secondary color="secondary"><span class="button-text">Подать заявку</span></ion-button>
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
  IonAccordion, 
  IonAccordionGroup, 
  IonItem, 
  IonLabel
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
  FooterDesktop,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  }
}
</script>

<style scoped>
ion-accordion div{
  text-align: left;
}

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
  background-position: left center;
}

.header-image-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1em;
}
.header-image-container .main-block-content{
  max-width: 500px !important;
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
  margin-top: -6em;
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
  padding-top: 1em !important;
  text-align: center;
}
.winnings-grid{
  align-items: baseline;
  padding: 1em;
  text-align: center;
  justify-content: center;
  grid-gap: 15px;
}
.winnings-grid .winning-item{
  padding: 1em 2em;
  text-align: left;
  border-radius: 15px;
  display: grid;
  grid-template-columns: 50% 50%;
  align-items: center;
  height: 100%;
  margin-top: -2em;
}
.winnings-grid .winning-item .winning-item-img{
  margin: 0 2em;
}
.winnings-grid .winning-item:nth-child(odd) .winning-item-img{
  text-align: right;
}
.winnings-grid .winning-item:nth-child(odd) .winning-item-descr{
  text-align: left;
}
.winnings-grid .winning-item:nth-child(even) .winning-item-img{
  text-align: left;
}
.winnings-grid .winning-item:nth-child(even) .winning-item-descr{
  text-align: right;
  grid-column: 1;
  grid-row: 1;
}
.winnings-grid .winning-item h2{
  color: black;
}
.winnings-grid .winning-item h4{
  color: gray;
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
.sign-up-suggest .main-block-content h2,
.sign-up-suggest .main-block-content h4{
  color: white;
}
.sign-up-suggest .main-block-content a{
  color: white;
}
.benefits-container{
  background: linear-gradient(to left, #303c88, #327ab4);
}
.benefits-container .main-block-content > h2{
  color: white;
  text-align: center;
}
.benefits-list{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 1em;
}
.benefits-list .benefit-item{
  padding: 2em;
}
.benefit-item .benefit-img{
  width: 70%;
  margin: 0 auto;
}
.benefits-list .benefit-item .heading{
  display: flex;
  align-items: center;
}
.benefits-list .benefit-item .heading h2{
  font-size: 50px;
  margin-right: 20px;
  color: #fed304;
}
.benefits-list .benefit-item .heading h4{
  color: white;
}
.benefits-list .benefit-item p{
  color: white;
  line-height: 20px;
  text-align: left;
}


.tarif-container{

}
.tarif-container .main-block-content > h2,
.tarif-container .main-block-content > h4{
  text-align: center;
}
.tarif-container .tarif-list{
  padding: 1em;
}
.tarif-container .tarif-item{
  padding: 1em 2em;
  text-align: left;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  height: 100%;
  display: grid;
  grid-template-columns: 70% 30%;
  align-items: center;
  margin: 15px 0;
}
.tarif-container .tarif-item .tarif-left ul{
  list-style: none;
  padding: 0;
}
.tarif-container .tarif-item .tarif-left ul li{
  color: #606060;
  font-size: 14px;
}
.tarif-container .tarif-item .tarif-right{
  text-align: center;
}
.tarif-container .tarif-right > h1,
.tarif-container .tarif-right > h6{
  font-weight: bold;
  color: var(--ion-color-primary);
}
.tarif-container .tarif-right > h6{
  margin-top: 0;
}
.tarif-container .icon{
  margin: 0 10px;
}
.tarif-container .icon.green-icon{
  color: var(--ion-color-success,#2dd36f);
}
.tarif-container .icon.red-icon{
  color: var(--ion-color-danger,#eb445a);
}

.questions-block .main-block-content > h2,
.questions-block .main-block-content > h4{
  text-align: center;
}
.questions-block .main-block-content > h4{
  margin-bottom: 2em;
}

.questions-block ion-accordion.accordion-collapsing ion-item[slot='header'],
.questions-block ion-accordion.accordion-collapsed ion-item[slot='header'] {
  --background: var(--ion-color-light);
  --color: var(--ion-color-light-contrast);
}

.questions-block ion-accordion.accordion-expanding ion-item[slot='header'],
.questions-block ion-accordion.accordion-expanded ion-item[slot='header'] {
  --background: var(--ion-color-primary);
  --color: var(--ion-color-primary-contrast);
}
.questions-block ion-accordion div[slot="content"]{
  font-size: 14px;
  line-height: 1.4;
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

  .tarif-container .tarif-item{
    grid-template-columns: 1fr !important;
}
  .intro-container .main-block-content .image-col img{
    margin-bottom: 0em !important;
  }
  .supplier-guide-page .main-block{
    padding: 1em;
    grid-template-columns: 1fr;
    background-position-x: right;
    min-height: 400px;
    text-align: center;
  }
  .supplier-guide-page .header-image-container h2,
  .supplier-guide-page .header-image-container h4{
    color: white;
    text-shadow: 1px 1px 5px black;
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
    padding: 0;

  }
  
  ion-footer.desktop-footer{
    display: none;
  }
  .winnings-grid .winning-item{
    display: block;
    text-align: center;
  }
  .winnings-grid .winning-item-img,
  .winnings-grid .winning-item-descr{
    text-align: center !important;
  }

}

</style>