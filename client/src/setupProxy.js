const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
  }));
};

// const proxy = require('http-proxy-middleware');

// module.exports = function(app) {
//   //...
//   app.use(
//     '/api',
//     proxy({
//       // 3000번 port에서 줄때 target을 5000번으로 주도록 설정. 
//       target: 'http://localshot:5000',
//       changeOrigin: true,
//     })
//   )
// }

