const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/tasks',
    createProxyMiddleware({
      target: 'http://demo2.z-bit.ee',
      changeOrigin: true,
      pathRewrite: {
        '^/tasks': '/tasks', // You can rewrite the path if needed
      },
    })
  );
};
