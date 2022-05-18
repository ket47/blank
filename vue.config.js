const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "../pwa/www"),
  pwa: {
    name: "Tezkel",
    appleMobileWebAppCapable: true,
    themeColor: "#009dcd",
    msTileColor: "#009dcd",
    manifestOptions: {
      background_color: "#fefefe"
    }
  }
}
