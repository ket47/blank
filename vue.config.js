const path = require("path");
const webpack = require('webpack');
module.exports = {
  outputDir: path.resolve(__dirname, "../pwa/www"),
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // Vue CLI is in maintenance mode, and probably won't merge my PR to fix this in their tooling
        // https://github.com/vuejs/vue-cli/pull/7443
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ],
  },
  pwa: {
    name: "Tezkel",
    themeColor: "#ffffff",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: true,
    appleMobileWebAppStatusBarStyle: 'white',
    workboxOptions: {
      //skipWaiting: true,
      //clientsClaim: true
    },
    manifestOptions: {
      name: "Tezkel",
      short_name: "Tezkel",
      background_color: "#fff",
      categories: ["shopping", "business", "food"],
      orientation: "portrait-primary",
      prefer_related_applications: false,
      lang:'ru',
      dir:'ltr',
      description: "Tezkel – это служба экспресс-доставки товаров. Мы сотрудничаем со многими заведениями общественного питания и магазинами, поэтому всего через полчаса после оформления заказа вы получите его в руки. Экономия времени, разнообразный ассортимент и возможность получить любой товар не выходя за пределы любимого домашнего очага, - все это возможно с Tezkel.",
      shortcuts: [
        {
          "name": "Главная",
          "url": "/catalog",
          "description": "Магазины и рестораны поблизости"
        },
        {
          "name": "Поиск",
          "url": "/search",
          "description": "Поиск товаров"
        },
        {
          "name": "Заказы",
          "url": "/order/",
          "description": "Все заказы и задания"
        },
        {
          "name": "Личный кабинет",
          "url": "/user",
          "description": "Управление настройками пользователя"
        }
      ],
      icons: [
        {
          "src": "./img/icons/monochrome.png",
          "type": "image/png",
          "purpose": "monochrome"
        },
        {
          "src": "./img/icons/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "./img/icons/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose":"any"
        },
        {
          "src": "./img/icons/android-chrome-maskable-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./img/icons/android-chrome-maskable-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
      screenshots : [
        {
          "src": "./img/screenshots/narrow-ios-aboutus.jpg",
          "sizes": "1284x2781",
          "type": "image/jpeg",
          "platform": "narrow",
          "label": "О нас"
        },
        {
          "src": "./img/screenshots/narrow-ios-cart.jpg",
          "sizes": "1284x2781",
          "type": "image/jpeg",
          "platform": "narrow",
          "label": "Корзина"
        },
        {
          "src": "./img/screenshots/narrow-ios-storeview.jpg",
          "sizes": "1284x2781",
          "type": "image/jpeg",
          "platform": "narrow",
          "label": "Страница продавца"
        },
        {
          "src": "./img/screenshots/narrow-ios-storeview2.jpg",
          "sizes": "1284x2781",
          "type": "image/jpeg",
          "platform": "narrow",
          "label": "Товары"
        },
        {
          "src": "./img/screenshots/narrow-ios-user.jpg",
          "sizes": "1284x2781",
          "type": "image/jpeg",
          "platform": "narrow",
          "label": "Личный кабинет"
        },


        {
          "src": "./img/screenshots/wide-aboutus.jpg",
          "sizes": "1500x900",
          "type": "image/jpeg",
          "platform": "wide",
          "label": "О нас"
        },
        {
          "src": "./img/screenshots/wide-cart.jpg",
          "sizes": "1500x900",
          "type": "image/jpeg",
          "platform": "wide",
          "label": "Корзина"
        },
        {
          "src": "./img/screenshots/wide-catalog.jpg",
          "sizes": "1500x900",
          "type": "image/jpeg",
          "platform": "wide",
          "label": "Каталог"
        },
        {
          "src": "./img/screenshots/wide-storeview.jpg",
          "sizes": "1500x900",
          "type": "image/jpeg",
          "platform": "wide",
          "label": "Страница продавца"
        },
        {
          "src": "./img/screenshots/wide-user.jpg",
          "sizes": "1500x900",
          "type": "image/jpeg",
          "platform": "wide",
          "label": "Личный кабинет"
        },
      ]
    },
  },
}
