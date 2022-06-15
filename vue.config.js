const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "../pwa/www"),
  chainWebpack: (config) => {
      config
          .plugin('html')
          .tap(args => {
              args[0].title = 'MyApp title';
              args[0].meta = {viewport: 'width=device-width,minimum-scale=1.0, maximum-scale=1.0,initial-scale=1,user-scalable=no'};

          return args;
      })
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
      gcm_sender_id:"359468869452"
    },
    workboxOptions: {
      exclude: [/OneSignal.*\.js$/],
    },
  }
}
