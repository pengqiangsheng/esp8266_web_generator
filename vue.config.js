'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'mobile' // page title
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 886,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_API]: {
        // target: `http://116.62.175.233:80`,
        target: `http://172.23.0.27:9123`,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  },
  configureWebpack: process.env.VUE_APP_ENV === 'prod' ? {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          },
        }),
      ]
    }
  } : {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .plugin('CompressionWebpackPlugin')
            .use('compression-webpack-plugin', [{
              test: /\.(js|css|svg|woff|ttf|json|html)$/,
              threshold: 10240
            }])
          // config
          //   .optimization.splitChunks({
          //     chunks: 'all',
          //     cacheGroups: {
          //       libs: {
          //         name: 'chunk-libs',
          //         test: /[\\/]node_modules[\\/]/,
          //         priority: 10,
          //         chunks: 'initial' // only package third parties that are initially dependent
          //       },
          //       vant: {
          //         name: 'chunk-vant', // split elementUI into a single package
          //         priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          //         test: /[\\/]node_modules[\\/]_?vant(.*)/ // in order to adapt to cnpm
          //       }
          //     }
          //   })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
  