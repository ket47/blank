const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
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
  ],
};