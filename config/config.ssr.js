const resolvePath = path => require('path').resolve(__dirname, path);
const indexRoute = require('./router.index');
const newsRoute = require('./router.news');

module.exports = {
  serverPort: 7001,
  type: 'ssr', // 指定运行类型可设置为csr切换为客户端渲染
  routes: [indexRoute, newsRoute],
  baseDir: resolvePath('../'),
  useReactToString: false,
  useCDN: false,
};
