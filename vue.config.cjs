module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Proxy API requests to the backend
        changeOrigin: true,
      },
    },
  },
};