<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding premium-light">
      
      <div class="ion-text-center hero-box">
        <h1 class="main-title">Переход к технологической <br><span class="gradient-text">экосистеме</span></h1>
        <p class="hero-desc">
          Уважаемые партнеры! Наша платформа полностью переходит на модель предоставления технологических и IT-услуг. 
          Мы приостанавливаем работу курьерской службы и кардинально снижаем комиссии на онлайн-размещение.
        </p>
      </div>

      <section class="section-container">
        <div class="section-lead-premium">
          <div class="section-number-glowing">01</div>
          <div class="section-title-stack">
            <ion-text color="primary" class="text-uppercase tracking-widest font-bold sub-split">Тарифные планы</ion-text>
            <h2 class="section-title-rewritten">Обновленные условия платформы</h2>
          </div>
        </div>

        <ion-grid class="ion-no-padding ion-margin-top">
          <ion-row>
            <ion-col size="12" size-md="6">
              <ion-card class="tariff-card">
                <ion-card-header>
                  <ion-card-subtitle class="text-uppercase tracking-wider">Вариант 1</ion-card-subtitle>
                  <ion-card-title class="font-bold text-dark">Маркетплейс</ion-card-title>
                </ion-card-header>
                <ion-card-content class="tariff-content">
                  <p class="text-muted">Абсолютно бесплатное размещение вашей организации и меню/каталога на платформе Tezkel. Вы получаете заказы и обрабатываете их самостоятельно.</p>
                  <div class="price-value">0%</div>
                </ion-card-content>
              </ion-card>
            </ion-col>

            <ion-col size="12" size-md="6">
              <ion-card class="tariff-card featured">
                <ion-card-header>
                  <ion-card-subtitle class="gradient-text text-uppercase tracking-wider font-bold">Выгодный выбор</ion-card-subtitle>
                  <ion-card-title class="font-bold text-dark">Маркетплейс + Оплата</ion-card-title>
                </ion-card-header>
                <ion-card-content class="tariff-content">
                  <p class="text-muted">Размещение на платформе с подключенным приемом клиентских онлайн-платежей. Комиссия covers только эквайринг и проведение чеков через кассу.</p>
                  <div class="price-value gradient-text">7%</div>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </section>

      <section class="section-container">
        <ion-card class="promo-card">
          <div class="glass-glow"></div>
          <ion-card-header>
            <ion-chip class="promo-chip font-bold">Главная премьера</ion-chip>
            <h2 class="white-text font-bold promo-title ion-no-margin ion-margin-top">Ваш собственный сайт (базовый)</h2>
          </ion-card-header>
          <ion-card-content class="white-text">
            <p class="promo-desc">Больше никакой конкуренции на общей витрине! Полноценный персональный сайт на отдельном независимом домене, спроектированный под ваши нужды и полностью принадлежащий вашему бренду.</p>
            
            <div class="price-row ion-margin-top">
              <div class="price-block">
                <span class="old-price">50 000 руб.</span>
                <span class="new-price">25 000 руб.</span>
              </div>
              <div class="ion-text-center">
                <ion-badge color="danger" class="sale-badge">Скидка 50% для партнеров</ion-badge>
                <div class="sale-text"><b>Действует до 01.08.2026</b></div>
              </div>
              
            </div>
          </ion-card-content>
        </ion-card>

        <ion-grid class="ion-no-padding ion-margin-top">
          <ion-row>
            <ion-col size="12" size-md="3" v-for="(feat, i) in features" :key="i">
              <ion-card class="feature-card">
                <ion-card-content>
                  <div class="icon-circle" :class="'color-' + (i + 1)">
                    <ion-icon :icon="feat.icon"></ion-icon>
                  </div>
                  <h3 class="font-bold text-dark ion-margin-top ion-margin-bottom-sm">{{ feat.title }}</h3>
                  <p class="text-muted ion-no-margin">{{ feat.desc }}</p>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </section>

      <section class="section-container">        
        <div class="section-lead-premium">
          <div class="section-number-glowing">02</div>
          <div class="section-title-stack">
            <ion-text color="primary" class="text-uppercase tracking-widest font-bold sub-split">Функционал</ion-text>
            <h2 class="section-title-rewritten">Возможности и масштабирование</h2>
          </div>
        </div>
        
        <ion-list lines="none" class="addon-list ion-no-padding ion-margin-top">
          <ion-item v-for="(addon, i) in addons" :key="i" class="addon-item">
            <div slot="start" class="addon-icon-box">
              <ion-icon :icon="addon.icon" color="primary"></ion-icon>
            </div>
            <ion-label class="ion-text-wrap">
              <h3 class="font-bold text-dark ion-no-margin">{{ addon.title }}</h3>
              <p class="text-muted ion-no-margin ion-margin-top-xs">{{ addon.desc }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </section>

      <section class="section-container">
        <div class="section-lead-premium">
          <div class="section-number-glowing">03</div>
          <div class="section-title-stack">
            <ion-text color="primary" class="text-uppercase tracking-widest font-bold sub-split">Реализация</ion-text>
            <h2 class="section-title-rewritten">Порядок запуска решения</h2>
          </div>
        </div>
        
        <div class="steps-grid ion-margin-top">
          <div class="step-card" v-for="(step, i) in steps" :key="i">
            <div class="step-index">{{ i + 1 }}</div>
            <div class="step-body">
              <h3 class="font-bold text-dark ion-no-margin">{{ step.title }}</h3>
              <p class="text-muted ion-no-margin ion-margin-top-xs">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <footer class="ion-text-center footer-box">
        <h2 class="font-bold text-dark footer-heading">Давайте строить технологичное будущее вместе!</h2>
        <p class="text-muted ion-margin-bottom">Чтобы запустить процесс разработки, свяжитесь со своим персональным менеджером.</p>
        
        <ion-button expand="block" href="mailto:admin@tezkel.com" class="cta-button ion-margin-top">
          <ion-icon slot="start" :icon="mailOutline"></ion-icon>
          admin@tezkel.com
        </ion-button>
        <p class="text-muted regards-text">С уважением, <span class="font-bold text-dark">команда Tezkel</span></p>
      </footer>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { 
  IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard, 
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
  IonChip, IonBadge, IonList, IonItem, IonLabel, IonIcon, IonButton, IonText 
} from '@ionic/vue';
import { 
  globeOutline, optionsOutline, cardOutline, rocketOutline, cartOutline, imageOutline,
  colorPaletteOutline, syncOutline, logoAppleAppstore, mailOutline, timeOutline, shieldOutline
} from 'ionicons/icons';

const features = [
  { icon: globeOutline, title: 'Собственный домен и SEO', desc: 'Полная независимость. Сайт отлично оптимизирован под Яндекс и Google, чтобы клиенты находили вас напрямую.' },
  { icon: optionsOutline, title: 'Полный контроль', desc: 'Никаких задержек и модераций. Мгновенно редактируйте меню, меняйте цены и включайте стоп-листы в привычной админ-панели Tezkel.' },
  { icon: cardOutline, title: 'Готовый эквайринг и касса', desc: 'Безопасный прием онлайн-платежей на вашем сайте от Tezkel со встроенной отправкой чеков покупателям.' },
  { icon: shieldOutline, title: 'Авторизация и безопасность', desc: 'Встроенная система авторизации по номеру телефона, использующая защищенный TEZKEL ID.' }
];

const addons = [
  { icon: rocketOutline, title: 'Инструменты для роста продаж', desc: 'Настраивайте персональные промокоды, запускайте гибкие бонусные программы для постоянных клиентов и собирайте честные отзывы для улучшения сервиса.' },
  { icon: colorPaletteOutline, title: 'Дизайн и визуальные акценты', desc: 'По согласованию мы адаптируем визуальный стиль под ваш бренд, создадим продающие баннеры для акций и добавим яркие стикеры на ключевые товары (например, «Хит», «Новинка», «Скидка»).' },
  { icon: syncOutline, title: 'Полная синхронизация с iiko и 1С', desc: 'Сайт без проблем может синхронизироваться с вашими системами учета. Остатки, цены и модификаторы обновляются автоматически, а заказы с сайта мгновенно прилетают прямо на вашу кухонную или торговую кассу.' },
  { icon: logoAppleAppstore, title: 'Готовность к выходу в Сторы', desc: 'Архитектура сайта полностью адаптирована для быстрой сборки в полноценные мобильные приложения. При желании вы сможете легко запуститься в Google Play, App Store и RuStore.' },
  { icon: cartOutline, title: 'Онлайн кассы и эквайринг', desc: 'Подключаем ваш персональный эквайринг и онлайн кассу, где вы сможете контроллировать работу с финансами вашего сайта от А до Я.' },
  { icon: imageOutline, title: 'Работа с контентом', desc: 'Мы предлагаем услуги по наполнению вашего сайта: создание и редактирование товарных карточек, размещение баннеров и прочих рекламных материалов, а также многое другое.' }
];

const steps = [
  { title: 'Согласование', desc: 'Утверждаем с вами доменное имя, визуальный стиль и объем необходимых услуг.' },
  { title: 'Настройка', desc: 'Наши специалисты регистрируют домен, настраивают SEO и готовят проект к релизу.' },
  { title: 'Запуск', desc: 'Вы получаете полностью готовый, рабочий инструмент и доступы к панели управления.' }
];
</script>

<style scoped>
/* ПРЕМИАЛЬНЫЙ СВЕТЛЫЙ UI (Используем нативные стили Ionic как базу) */
.premium-light {
  --background: #f8fafc;
}

/* Общие хелперы */
.font-bold { font-weight: 700; }
.text-dark { color: #0f172a; }
.text-muted { color: #64748b; font-size: 0.95rem; line-height: 1.5; }
.white-text { color: #ffffff !important; }
.tracking-wider { letter-spacing: 1px; }
.ion-margin-bottom-sm { margin-bottom: 8px; }
.ion-margin-top-xs { margin-top: 4px; }

/* Градиентный текст */
.gradient-text {
  background: linear-gradient(135deg, #009dcd 0%, #066b8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* HERO ИНТРО */
.hero-box {
  max-width: 760px;
  margin: 40px auto 20px;
  padding: 0 16px;
}
.hero-chip {
  --background: #eff6ff;
  --color: #009dcd;
  font-weight: 600;
  padding: 8px 16px;
  margin-bottom: 16px;
}
.main-title {
  font-size: 2.6rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.8px;
  line-height: 1.15;
  margin-bottom: 16px;
}
.hero-desc {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.6;
}

/* СЕКЦИИ */
.section-container {
  max-width: 1000px;
  margin: 60px auto;
  padding: 0 16px;
}

.section-lead-premium {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
  position: relative;
}

.section-number-glowing {
  font-size: 2.4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #009dcd 0%, #066b8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 10px 14px;
  border-radius: 16px;
  line-height: 1;
}

.section-title-stack {
  display: flex;
  flex-direction: column;
}

.sub-split {
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  margin-bottom: 2px;
}

.section-title-rewritten {
  font-size: 1.8rem;
  font-weight: 850;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.5px;
}


/* ТАРИФЫ (IonCard + кастомные тени и ховеры) */
.tariff-card {
  --background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.015);
  border-radius: 20px;
  margin: 12px;
  height: calc(100% - 24px);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease;
}
.tariff-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(148, 163, 184, 0.12);
}
.tariff-card.featured {
  border: 1px solid #cbd5e1;
  position: relative;
}
.tariff-card.featured::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, #009dcd, #066b8a);
}
.tariff-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}
.price-value {
  font-size: 3.2rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1;
  margin-top: 20px;
}

/* ПРОМО-КАРТА САЙТА */
.promo-card {
  --background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  padding: 30px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
}
.glass-glow {
  position: absolute;
  bottom: -60px; right: -60px; width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(56, 128, 255, 0.2) 0%, transparent 75%);
  pointer-events: none;
}
.promo-chip {
  --background: rgba(255, 255, 255, 0.08);
  --color: #93c5fd;
  margin: 0;
  width: max-content;
}
.promo-title { font-size: 2rem; letter-spacing: -0.5px; }
.promo-desc { color: #cbd5e1; font-size: 1.05rem; line-height: 1.6; max-width: 800px; margin: 0 0 30px; }

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  border-top: 1px solid #334155;
  padding-top: 24px;
}
.price-block { display: flex; flex-direction: column; }
.old-price { text-decoration: line-through; color: #64748b; font-size: 1.1rem; }
.new-price { font-size: 2.4rem; font-weight: 900; color: white; line-height: 1; }
.sale-badge {
  padding: 8px 16px;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}
.sale-text{
  color: #eb445a;
}

/* ФИЧИ САЙТА */
.feature-card {
  --background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  border-radius: 20px;
  margin: 12px;
  height: calc(100% - 24px);
}
.icon-circle {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  margin-bottom: 10px;
}
.icon-circle.color-1 { background: #eff6ff; color: #009dcd; }
.icon-circle.color-2 { background: #f5f3ff; color: #8b5cf6; }
.icon-circle.color-3 { background: #ecfdf5; color: #10b981; }
.icon-circle.color-4 { background: #fdecf5; color: #b910b0; }

/* ДОПОЛНЕНИЯ (IonList) */
.addon-list { background: transparent; }
.addon-item {
  --background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  margin-bottom: 12px;
  --padding-start: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
}
.addon-icon-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  width: 42px; height: 42px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}

/* ШАГИ ЗАПУСКА */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
.step-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.step-index {
  background: linear-gradient(135deg, #009dcd 0%, #066b8a 100%);
  color: white;
  min-width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800;
  box-shadow: 0 4px 10px rgba(56, 128, 255, 0.2);
}

/* ФУТЕР */
.footer-box {
  max-width: 650px;
  margin: 50px auto 40px;
  padding: 16px;
  background: linear-gradient(to top, #f8fafc, #fff);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -10px 5px rgba(15, 23, 42, 0.01);
  border-top: 1px solid #e2e8f0;
  box-sizing: content-box;
}
.footer-heading { font-size: 2rem; letter-spacing: -0.5px; margin-bottom: 12px; }
.cta-button {
  max-width: 280px;
  margin: 24px auto 0;
  --border-radius: 12px;
  --box-shadow: 0 8px 24px rgba(56, 128, 255, 0.2);
  font-weight: 700;
  font-size: 1rem;
}
.regards-text { margin-top: 40px; }
/* Выразительный варнинг (Уведомление о дате) */
.warning-notification-box {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fffbeb; /* Мягкий, благородный янтарно-песочный оттенок */
  border: 1px solid #fef3c7;
  padding: 16px 20px;
  border-radius: 16px;
  margin: 0 16px 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.02);
}

.warning-glow-layer {
  position: absolute;
  top: 0; left: 0; width: 4px; height: 100%;
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
}

.warning-icon {
  font-size: 22px;
  color: #d97706;
  flex-shrink: 0;
}

.warning-text-content {
  font-size: 0.98rem;
  color: #78350f;
  font-weight: 500;
  line-height: 1.4;
}

.date-accent-badge {
  background: #fef3c7;
  color: #b45309;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 700;
  border: 1px solid #fde68a;
  display: inline-block;
  margin-left: 2px;
}

/* Адаптивность под мобилки */
@media (max-width: 768px) {
  .main-title { font-size: 1.9rem; }
  .price-value { font-size: 2.6rem; }
  .promo-card { padding: 20px; }
  .promo-title { font-size: 1.6rem; }
  .new-price { font-size: 2rem; }
  .footer-heading { font-size: 1.6rem; }
  .section-title-rewritten{ font-size: 1.4rem; }
  .section-number-glowing { font-size: 1.8rem; }
  .section-container { margin: 40px auto; padding: 0; }
}
</style>