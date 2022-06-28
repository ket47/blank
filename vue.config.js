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
    },
    workboxOptions: {
      skipWaiting: true
    }
  },
}
