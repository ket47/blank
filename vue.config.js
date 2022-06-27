const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  outputDir: path.resolve(__dirname, "../pwa/www"),
  chainWebpack: (config) => {
      config
          .plugin('html')
          .tap(args => {
            //args[0].title = 'Tezkel экспресс доставка'
            args[0].meta = {
              viewport: 'width=device-width,minimum-scale=1.0, maximum-scale=1.0,initial-scale=1,user-scalable=no',
              description: 'Служба экспресс доставки из ресторанов, магазинов и маркетов. Бонусы при регистрации.'
            };
            return args;
          })
  },
  configureWebpack: {
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Output Management',
        title: 'Progressive Web Application',
       }),
      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true,
      }),
    ]
  },
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
      //gcm_sender_id:"359468869452"
    }
  }
}
