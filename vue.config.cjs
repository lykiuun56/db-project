module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.puffmedia.co',
        changeOrigin: true,
      },
    },
  },

  chainWebpack: (config) => {
    config.module
      .rule('xlsx')
      .test(/\.(xlsx|xls)$/)
      .use('xlsx-loader')
      .loader('xlsx-loader');
  },
};