const path = require("path");
module.exports = {
  outputDir: path.resolve(__dirname, "../pwa/www"),
  pwa: {
    name: "Tezkel",
    themeColor: "#009dcd",
    msTileColor: "#009dcd",
    appleMobileWebAppCapable: true,
    appleMobileWebAppStatusBarStyle: 'white',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    },
    manifestOptions: {
      name: "Tezkel экспресс доставка",
      short_name: "Tezkel",
      background_color: "#009dcd",
      categories: ["ecommerce", "delivery", "маркетплэйс", "доставка"],
      orientation: "portrait-primary",
      shortcuts: [
        {
          "name": "Главная",
          "url": "#/home",
          "description": "Магазины и рестораны поблизости"
        },
        {
          "name": "Поиск",
          "url": "#/search",
          "description": "Поиск товаров"
        },
        {
          "name": "Заказы",
          "url": "#/order-list",
          "description": "Все заказы и задания"
        },
        {
          "name": "Личный кабинет",
          "url": "#/user-dashboard",
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
          "type": "image/png"
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
      ]
    },
  },
}
