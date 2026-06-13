<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding premium-light">
      
      <!-- 01. АСИММЕТРИЧНЫЙ SPLIT HERO (НА СИСТЕМНОЙ СЕТКЕ) -->
      <ion-grid class="hero-grid ion-no-padding">
        <ion-row class="ion-align-items-center ion-justify-content-between">
          
          <!-- Левая текстовая часть -->
          <ion-col size="12" size-lg="5" class="ion-padding-vertical">
            <h1 class="main-title">
              Полноценный онлайн бизнес
              <br>
              <span class="gradient-text">Ваш уникальный сайт</span>
            </h1>
            <p class="hero-desc">
              Получите развернутый, технологичный интернет-магазин, спроектированный для максимальных продаж на больших экранах. Фирменный стиль, независимость от маркетплейсов и автоматическая синхронизация с вашей торговой точкой.
            </p>
            <div class="hero-action-zone">
              <ion-button href="mailto:admin@tezkel.com" class="hero-cta">
                <ion-icon slot="start" :icon="mailOutline"></ion-icon>
                Запустить разработку
              </ion-button>
            </div>
          </ion-col>
          
          <!-- Правая часть: Десктопный браузерный мокап -->
          <ion-col size="12" size-lg="6" class="ion-padding-vertical">
            <div class="desktop-frame-container">
              <div class="frame-header">
                <div class="frame-dots"><span></span><span></span><span></span></div>
                <div class="frame-address">ваш-сайт.ru</div>
              </div>
              <div class="frame-body">
                <ion-badge class="live-desktop-badge">
                  <span class="pulse-dot"></span>Компьютерный вид
                </ion-badge>
                <img src="/img/it_guide/main_page.jpg" alt="Tezkel Desktop Site" />
              </div>
            </div>
          </ion-col>

        </ion-row>
      </ion-grid>

      <!-- 02. СЕКЦИЯ: ШАХМАТНЫЙ ФУНКЦИОНАЛ НА ИОНИК-СЕТКЕ -->
      <section class="section-container">        
        <div class="section-lead-premium">
          <div class="section-number-glowing">01</div>
          <div class="section-title-stack">
            <ion-text color="primary" class="text-uppercase tracking-widest font-bold sub-split">Возможности</ion-text>
            <h2 class="section-title-rewritten">Технологии, которые работают на вас</h2>
          </div>
        </div>
        
        <ion-grid class="ion-no-padding ion-margin-top">
          <ion-row>
            
            <!-- Карточка на всю ширину -->
            <ion-col size="12" class="ion-padding-small">
              <div class="premium-card chess-card wide-card">
                <div class="chess-icon-box color-1">
                  <ion-icon :icon="syncOutline"></ion-icon>
                </div>
                <div class="chess-body">
                  <h3 class="font-bold text-dark ion-no-margin">Полная автосинхронизация с iiko и 1С</h3>
                  <p class="text-muted ion-margin-top">Забудьте про ручной ввод. Остатки товаров, актуальные цены и сложные модификаторы выгружаются на сайт автоматически.</p>
                </div>
              </div>
            </ion-col>

            <!-- Половина ширины -->
            <ion-col size="12" size-md="6" class="ion-padding-small">
              <div class="premium-card chess-card">
                <div class="chess-icon-box color-2">
                  <ion-icon :icon="globeOutline"></ion-icon>
                </div>
                <div class="chess-body ion-margin-top">
                  <h3 class="font-bold text-dark ion-no-margin">Собственный домен и SEO</h3>
                  <p class="text-muted ion-margin-top">Формируйте базу преданных клиентов. Сайт оптимизирован для поисковых роботов Яндекс и Google, выводя ваш бренд в топ выдачи.</p>
                </div>
              </div>
            </ion-col>

            <!-- Половина ширины -->
            <ion-col size="12" size-md="6" class="ion-padding-small">
              <div class="premium-card chess-card">
                <div class="chess-icon-box color-3">
                  <ion-icon :icon="optionsOutline"></ion-icon>
                </div>
                <div class="chess-body ion-margin-top">
                  <h3 class="font-bold text-dark ion-no-margin">Мгновенный контроль</h3>
                  <p class="text-muted ion-margin-top">Никаких ожиданий и модераций. Изменяйте стоп-листы и редактируйте позиции каталога прямо из знакомой панели управления Tezkel.</p>
                </div>
              </div>
            </ion-col>

            <!-- Карточка-бонус на всю ширину -->
            <ion-col size="12" class="ion-padding-small">
              <div class="premium-card chess-card wide-card code-ready-bg">
                <div class="chess-body">
                  <ion-chip class="promo-chip font-bold">Безупречно на любых устройствах</ion-chip>
                  <h3 class="font-bold white-text ion-margin-top">Мобильная оптимизация по умолчанию</h3>
                  <p class="white-muted ion-margin-top">Несмотря на мощный десктопный каркас, ваш сайт получит идеальную мобильную адаптивность. Весь интерфейс автоматически перестраивается под экраны смартфонов и планшетов, обеспечивая быструю загрузку и легкое оформление заказа на ходу.</p>
                </div>
                <div class="chess-icon-box giant-icon">
                  <ion-icon :icon="logoAppleAppstore"></ion-icon>
                </div>
              </div>
            </ion-col>

          </ion-row>
        </ion-grid>
      </section>

      <!-- 03. ЕДИНЫЙ БЛОК ТАРИФОВ -->
      <section class="section-container">
        <div class="section-lead-premium">
          <div class="section-number-glowing">02</div>
          <div class="section-title-stack">
            <ion-text color="primary" class="text-uppercase tracking-widest font-bold sub-split">Стоимость</ion-text>
            <h2 class="section-title-rewritten">Инвестиции в независимость</h2>
          </div>
        </div>

        <div class="unified-tariff-wrapper ion-margin-top">
          <ion-grid class="ion-no-padding">
            <ion-row>
              
              <ion-col size="12" size-md="6" class="tariff-split-side">
                <span class="tariff-badge-minimal">Пакет "Старт"</span>
                <h3 class="font-bold text-dark text-package">Базовый сайт</h3>
                <p class="text-muted">Идеальный и быстрый запуск под ключ. Собственный независимый домен, готовый эквайринг платформы (7% за транзакции с онлайн-чеками), интеграция с защищенным Tezkel ID для авторизации пользователей.</p>
                <div class="price-wrapper">
                  <span class="old-price-inline">50 000 руб.</span>
                  <div class="price-value">25 000 руб.</div>
                </div>
              </ion-col>
              
              <ion-col size="12" size-md="6" class="tariff-split-side premium-side">
                <div class="glass-glow"></div>
                <span class="tariff-badge-minimal light">Пакет "Бизнес"</span>
                <h3 class="font-bold white-text text-package">Интеграция PRO</h3>
                <p class="white-muted">Для проектов, которым нужен максимум персонализации. Индивидуальный дизайн-код вашего бренда, подключение вашей личной онлайн-кассы и эквайринга для контроля 100% финансовых потоков.</p>
                <div class="price-value white-text price-wrapper">По запросу</div>
              </ion-col>

            </ion-row>
          </ion-grid>
        </div>
      </section>

      <!-- 04. СЕКЦИЯ: ТАЙМЛАЙН -->
      <section class="section-container">
        <div class="section-lead-premium">
          <div class="section-number-glowing">03</div>
          <div class="section-title-stack">
            <ion-text color="primary" class="text-uppercase tracking-widest font-bold sub-split">Запуск</ion-text>
            <h2 class="section-title-rewritten">Этапы запуска проекта</h2>
          </div>
        </div>

        <div class="timeline-list-container ion-margin-top">
          <div class="timeline-line-layer"></div>
          
          <div class="timeline-custom-item">
            <div class="timeline-number-node">01</div>
            <div class="timeline-label-card">
              <h4 class="font-bold text-dark ion-no-margin">Проектирование и договор</h4>
              <p class="text-muted ion-margin-top">Подбираем и регистрируем доменное имя. Утверждаем тариф, особенности интеграции учета и ключевые маркеры вашего визуального стиля.</p>
            </div>
          </div>

          <div class="timeline-custom-item">
            <div class="timeline-number-node">02</div>
            <div class="timeline-label-card">
              <h4 class="font-bold text-dark ion-no-margin">Техническая сборка</h4>
              <p class="text-muted ion-margin-top">Наши ИТ-специалисты разворачивают сайт на отказоустойчивом сервере, подключают платежные шлюзы, фискализацию чеков, настраивают первичное SEO и сквозную авторизацию.</p>
            </div>
          </div>

          <div class="timeline-custom-item">
            <div class="timeline-number-node">03</div>
            <div class="timeline-label-card">
              <h4 class="font-bold text-dark ion-no-margin">Передача прав и старт</h4>
              <p class="text-muted ion-margin-top">Передаем вам полные доступы к административной панели управления и запускаем работоспособный сайт.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 05. ДОПОЛНИТЕЛЬНЫЙ ДЕСКТОП БРАУЗЕР ШОУКЕЙС
      <section class="section-container">
        <div class="browser-showcase-container">
          <div class="browser-header">
            <div class="browser-actions"><span></span><span></span><span></span></div>
            <div class="browser-address-bar">yourbrand-shop.ru/catalog</div>
          </div>
          <div class="browser-body-placeholder">
            <ion-icon :icon="imageOutline" class="placeholder-icon"></ion-icon>
            <span class="font-bold text-dark display-block ion-margin-bottom">Модуль каталога и маркетинговые инструменты</span>
            <p class="text-muted ion-no-margin">Удобная сетка товаров, крупные карточки блюд/продуктов, умный конфигуратор и стимулирующие продажи стикеры («Хит», «Новинка», «Скидка»)</p>
          </div>
        </div>
      </section>
 -->
      <!-- ФУТЕР -->
      <footer class="ion-text-center footer-box">
        <h2 class="font-bold text-dark footer-heading">Давайте развивать ваш бренд вместе!</h2>
        <p class="text-muted ion-margin-bottom">Свяжитесь с менеджером Tezkel для обсуждения деталей.</p>
        
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
  IonPage, IonContent, IonGrid, IonRow, IonCol, 
  IonChip, IonBadge, IonText, IonButton, IonIcon 
} from '@ionic/vue';
import { 
  globeOutline, optionsOutline, imageOutline, syncOutline, 
  logoAppleAppstore, mailOutline, timeOutline
} from 'ionicons/icons';
</script>

<style scoped>
/* СИСТЕМНЫЕ НАСТРОЙКИ ПРЕМИУМ UI */
.premium-light {
  --background: #f8fafc;
}
.ion-padding-small {
  padding: 10px;
}
.display-block { display: block; }
.font-bold { font-weight: 700; }
.text-dark { color: #0f172a; }
.text-muted { color: #64748b; font-size: 0.95rem; line-height: 1.5; }
.white-text { color: #ffffff !important; }
.white-muted { color: #cbd5e1; font-size: 0.95rem; line-height: 1.5; }
.tracking-widest { letter-spacing: 1.5px; }

.gradient-text {
  background: linear-gradient(135deg, #009dcd 0%, #066b8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ОГРАНИЧИТЕЛИ КОНТЕНТА ДЛЯ ДЕСКТОПА */
.hero-grid, .section-container {
  max-width: 1040px;
  margin: 0 auto;
}
.hero-grid { margin-top: 40px; margin-bottom: 40px; padding: 0 16px; }
.section-container { margin-top: 70px; margin-bottom: 70px; padding: 0 16px; }

/* ЗАГОЛОВКИ */
.section-lead-premium {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.section-number-glowing {
  font-size: 2.2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #009dcd 0%, #066b8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}
.section-title-stack { display: flex; flex-direction: column; }
.sub-split { font-size: 0.75rem; margin-bottom: 2px; }
.section-title-rewritten { font-size: 1.8rem; font-weight: 850; color: #0f172a; margin: 0; letter-spacing: -0.5px; }

/* 01. HERO ДЕСКТОПНЫЙ МОКАП */
.main-title {
  font-size: 2.6rem;
  font-weight: 850;
  color: #0f172a;
  letter-spacing: -1px;
  line-height: 1.15;
  margin: 0 0 20px 0;
}
.hero-desc { font-size: 1.1rem; color: #475569; line-height: 1.6; margin: 0 0 30px 0; }
.hero-chip { --background: #eff6ff; --color: #009dcd; margin-bottom: 20px; }
.hero-cta { --border-radius: 12px; --box-shadow: 0 8px 24px rgba(0, 157, 205, 0.25); font-weight: 700; font-size: 1rem; }

.desktop-frame-container {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.frame-header {
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.frame-dots { display: flex; gap: 6px; }
.frame-dots span { width: 8px; height: 8px; border-radius: 50%; background: #94a3b8; }
.frame-address {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 3px 20px;
  font-size: 0.75rem;
  color: #64748b;
  width: 100%;
  max-width: 240px;
}
.frame-body {
  background: white;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.live-desktop-badge {
  position: absolute;
  top: 20px; left: 20px;
  --background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.pulse-dot {
  width: 8px; height: 8px;
  background: #009dcd;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
.frame-screen-text { color: #475569; font-size: 0.9rem; font-weight: 600; text-align: center; padding: 24px; max-width: 320px; }

/* 02. БАЗОВАЯ СТИЛИЗАЦИЯ КАРТОЧЕК ПРЕМИУМ */
.premium-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.01);
}

/* ШАХМАТНАЯ СЕТКА */
.chess-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.wide-card { flex-direction: row; align-items: center; gap: 24px; }
.wide-card .chess-body { flex: 1; }
.chess-icon-box {
  width: 54px; height: 54px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}
.chess-icon-box.color-1 { background: #eff6ff; color: #009dcd; }
.chess-icon-box.color-2 { background: #f5f3ff; color: #8b5cf6; }
.chess-icon-box.color-3 { background: #ecfdf5; color: #10b981; }
.code-ready-bg {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: none;
  position: relative;
  overflow: hidden;
}
.promo-chip { --background: rgba(255, 255, 255, 0.08); --color: #93c5fd; margin: 0; width: max-content; }
.giant-icon { font-size: 80px; color: rgba(255, 255, 255, 0.03); width: auto; height: auto; position: absolute; right: 20px; bottom: -10px; }

/* 03. ТАРИФНЫЙ КОНТЕЙНЕР */
.unified-tariff-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
}
.tariff-split-side {
  padding: 40px !important;
  display: flex;
  flex-direction: column;
}
.premium-side {
  background: linear-gradient(135deg, #111524 0%, #171d31 100%);
  position: relative;
}
.glass-glow {
  position: absolute;
  top: -50px; right: -50px; width: 180px; height: 180px;
  background: radial-gradient(circle, rgba(0, 157, 205, 0.15) 0%, transparent 75%);
}
.tariff-badge-minimal { font-size: 0.75rem; font-weight: 700; text-uppercase: uppercase; letter-spacing: 1px; color: #009dcd; margin-bottom: 12px; }
.tariff-badge-minimal.light { color: #38bdf8; }
.text-package { font-size: 1.8rem; margin: 0 ; letter-spacing: -0.5px; }
.price-wrapper { margin-top: auto; padding-top: 30px; }
.old-price-inline { text-decoration: line-through; color: #94a3b8; font-size: 1.1rem; }
.price-value { font-size: 3rem; font-weight: 900; color: #0f172a; line-height: 1; margin-top: 4px; }

/* 04. СТАБИЛЬНЫЙ ТАЙМЛАЙН БЕЗ ЖЕСТКИХ СЛОТОВ ИОНИКА */
.timeline-list-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.timeline-line-layer {
  position: absolute;
  left: 17px; top: 15px; bottom: 15px; width: 2px;
  background: #e2e8f0;
  z-index: 1;
}
.timeline-custom-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}
.timeline-number-node {
  width: 36px; height: 36px;
  background: #ffffff;
  border: 2px solid #009dcd;
  color: #0f172a;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.85rem;
  flex-shrink: 0;
  margin-right: 20px;
  box-shadow: 0 0 0 4px #f8fafc;
}
.timeline-label-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.01);
  flex: 1;
}

/* 05. БРАУЗЕР КАРТОЧКА */
.browser-showcase-container {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.03);
  overflow: hidden;
}
.browser-body-placeholder {
  height: 260px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 24px; text-align: center;
  background: #fafafa;
}
.placeholder-icon { font-size: 40px; color: #cbd5e1; margin-bottom: 12px; }

/* АКЦИЯ (ЧИСТЫЙ ВАРНИНГ КЛАСС) */
.warning-notification-box {
  max-width: 1040px;
  margin: 20px auto;
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 18px 24px;
}
.warning-glow-layer { position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%); }
.warning-icon { color: #d97706; font-size: 24px; margin-right: 16px; flex-shrink: 0; }
.warning-text-content { color: #78350f; font-weight: 500; font-size: 0.98rem; line-height: 1.4; }
.date-accent-badge { background: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 6px; font-weight: 700; border: 1px solid #fde68a; }

/* ФУТЕР */
.footer-box { max-width: 650px; margin: 80px auto 40px; padding: 0 16px; }
.footer-heading { font-size: 2rem; letter-spacing: -0.5px; margin-bottom: 12px; }
.cta-button { max-width: 280px; margin: 24px auto 0; --border-radius: 12px; font-weight: 700; }
.regards-text { margin-top: 40px; }

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 157, 205, 0.5); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(0, 157, 205, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 157, 205, 0); }
}

/* АДАПТИВНОСТЬ НА ПЛАНШЕТАХ И СМАРТФОНАХ */
@media (max-width: 992px) {
  .main-title { font-size: 2.2rem; }
  .wide-card { flex-direction: column; align-items: flex-start; gap: 16px; }
  .tariff-split-side { padding: 30px !important; }
  .price-value { font-size: 2.5rem; }
}
</style>