const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./webpack.base.config");
const glob = require("glob");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

const config = merge(base, {
  entry: {
    app: "./src/client-entry.js"
  },
  resolve: {
    alias: {
      "create-api": "./create-api-client.js"
    }
  },
  plugins: [
    //定义全局变量
    new webpack.DefinePlugin({
      "process.env.NOOD_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.VUE_ENV": "client",
      "process.env.DEBUG_API": "true"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: function(module) {
        return (
          /node_modules/.test(module.context) && !/\.css$/.test(module.require)
        );
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'mainfest'
    }),
    //将服务器的整个输出
    //构建为单个json文件的插件
    //默认文件名为 vue-ssr-server-bundle.json
    new VueSSRClientPlugin()

  ]
});

module.exports = config