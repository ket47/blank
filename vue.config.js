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
  devServer: {
    client: {
      overlay: {
        runtimeErrors: (error) => {
          if(error?.message === "ResizeObserver loop completed with undelivered notifications.")
          {
             console.warn(error)
             return false;
          }
          return true;
        },
      },
    },
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
      prefer_related_applications: true,
      related_applications: [
        {
          "platform": "play",
          "id": "com.tezkel.twa"
        },
      ],
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
          "src": "./img/icons/main.svg",
          "sizes": "any",
          "type": "image/svg+xml",
        },
        {
          "src": "./img/icons/main-1024x1024.png",
          "sizes": "1024x1024",
          "type": "image/png",
        },
        {
          "src": "./img/icons/monochrome.png",
          "type": "image/png",
          "purpose": "monochrome"
        },
      ],
      screenshots : [
      ]
    },
  },
}
