module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://creator-tools.us-east-1.elasticbeanstalk.com', // Proxy API requests to the backend
        changeOrigin: true,
      },
    },
  },
};