module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.puffmedia.co',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // chainWebpack: (config) => {
  //   config.module
  //     .rule('xlsx')
  //     .test(/\.(xlsx|xls)$/)
  //     .use('xlsx-loader')
  //     .loader('xlsx-loader');
  // },

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(xlsx|xls)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/files/', // Optional: customize output path
              },
            },
          ],
        },
      ],
    },
  },
};