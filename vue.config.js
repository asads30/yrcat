const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://90.156.227.182:3000/shop/public/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
})
