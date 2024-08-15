module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://creator-tools.us-east-1.elasticbeanstalk.com', // Proxy API requests to the backend
        changeOrigin: true,
      },
    },
  },
  
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