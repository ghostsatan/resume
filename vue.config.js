const { defineConfig } = require('@vue/cli-service')
const resolve = dir => path.join(__dirname, dir);
const path = require('path')
// 生产环境，测试和正式
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
module.exports = defineConfig({
  publicPath: './',
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8080, // 端口
    open: false, // 启动后打开浏览器
    client: {
      overlay: {
        //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
        warnings: false,
        errors: true
      }
    },
    proxy: {
      '/api': {
        target: 'http://2782lk0215.wicp.vip',
        // target:'http://192.168.0.24:32603',
        // ws:true,
        changOrigin: true,
        pathRewrite: {
          '^/': '/'
        }
      },
      '/': {
        target: 'http://2782lk0215.wicp.vip',
        // eslint-disable-next-line no-undef
        ws: false,
        changOrigin: true,
        pathRewrite: {
          '^/': '/'
        }
      },
    },
  },

  chainWebpack: config => {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // 别名 alias
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))

    /**
     * 添加CDN参数到htmlWebpackPlugin配置中
     */
    // config.plugin('html').tap(args => {
    //   if (IS_PROD) {
    //     args[0].cdn = cdn.build
    //   } else {
    //     args[0].cdn = cdn.dev
    //   }
    //   return args
    //  })

    /**
     * 设置保留空格
     */
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    /**
     * 打包分析
     */
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(!IS_PROD, config => config.devtool('cheap-source-map'))

    config.when(IS_PROD, config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3, //  被至少用三次以上打包分离
            priority: 5, // 优先级
            reuseExistingChunk: true // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          },
          node_vendors: {
            name: 'chunk-libs',
            chunks: 'initial', // 只打包初始时依赖的第三方
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          vantUI: {
            name: 'chunk-vantUI', // 单独将 vantUI 拆包
            priority: 20, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
            test: /[\\/]node_modules[\\/]_?vant(.*)/
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
})
