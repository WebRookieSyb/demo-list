const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const glob = require('glob')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const config = merge(base, {
    entry: {
        app: './src/client-entry.js'
    },
    resolve: {
        alias: {
            'create-api': './create-api-client.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            // 'process.env.NOOD_ENV': 
        })
    ]
})