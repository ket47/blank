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
      name:"Tezkel fast delivery",
      short_name:"Tezkel",
      background_color: "#fefefe"
    }
  }
}
