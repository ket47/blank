const path = require("path");
module.exports = {
  outputDir: path.resolve(__dirname, "../pwa/www"),
  pwa: {
    name: "Tezkel",
    themeColor: "#009dcd",
    msTileColor: "#009dcd",
    appleMobileWebAppCapable: true,
    appleMobileWebAppStatusBarStyle:'white',
    manifestOptions: {
      name:"Tezkel доставка",
      short_name:"Tezkel",
      background_color: "#009dcd",
      categories: ["ecommerce", "delivery", "маркетплэйс", "доставка"],
      orientation:"portrait-primary",
      // screenshots : [
      //   {
      //     "src": "screenshot1.webp",
      //     "sizes": "1280x720",
      //     "type": "image/webp",
      //     "platform": "wide",
      //     "label": "Homescreen of Awesome App"
      //   },
      //   {
      //     "src": "screenshot2.webp",
      //     "sizes": "1280x720",
      //     "type": "image/webp",
      //     "platform": "narrow",
      //     "label": "List of Awesome Resources available in Awesome App"
      //   }
      // ],
      shortcuts : [
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
      ]
    },
    workboxOptions: {
      skipWaiting: true
    }
  },
}
