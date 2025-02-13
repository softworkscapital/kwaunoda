// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/api', // Local endpoint
//     createProxyMiddleware({
//       target: 'https://maps.googleapis.com', // Target API
//       changeOrigin: true, // Change the origin of the host header to the target URL
//       pathRewrite: {
//         '^/api': '', // Remove '/api' from the request path
//       },
//     })
//   );
// };