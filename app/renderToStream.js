const path = require('path');
const dist = path.resolve(process.cwd(), 'dist');
const config = require('../config/config.ssr');

const global = {};

const renderToStream = async (req, entry) => {
  const { baseDir, useReactToString } = config;
  const BASE_DIR = baseDir || process.cwd();
  const isLocal = process.env.NODE_ENV === 'development' || config.env === 'local'; // 标志非正式环境

  const csr = req.query && req.query.csr ? req.query.csr : false // 兼容express和koa的query获取

  if (!global.renderToNodeStream) {
    // for this issue https://github.com/ykfe/egg-react-ssr/issues/4
    if (useReactToString) {
      global.renderToNodeStream = require(BASE_DIR + '/node_modules/react-dom/server').renderToString;
    } else {
      global.renderToNodeStream = require(BASE_DIR + '/node_modules/react-dom/server').renderToNodeStream;
    }
  }
  const injectScript = [
    `<script src="/static/js/runtime~${entry}.js"></script>`,
    `<script src="/static/js/vendor.chunk.js"></script>`,
    `<script src="/static/js/${entry}.chunk.js"></script>`
  ];
  const injectCss = [
    `/static/css/vendor.chunk.css`,
    `/static/css/${entry}.chunk.css`
  ];
  const serverJs = `${dist}/${entry}.server.js`;
  const layout = `${dist}/Layout.server.js`;
  let SEVER_JS = serverJs;

  const props = {
    serverJs,
    injectScript,
    injectCss,
    entry
  };

  if (config.type !== 'ssr' || csr) {
    let LAYOUT_PATH = layout;
    if (isLocal && typeof LAYOUT_PATH === 'string') {
      delete require.cache[LAYOUT_PATH];
    };
    const Layout = typeof LAYOUT_PATH === 'string' ? require(LAYOUT_PATH).default : LAYOUT_PATH;
    return global.renderToNodeStream(require(BASE_DIR + '/node_modules/react').createElement(Layout, props))
  }

  if (isLocal && typeof SEVER_JS === 'string') {
    // 本地开发环境下每次刷新的时候清空require服务端文件的缓存，保证服务端与客户端渲染结果一致
    delete require.cache[SEVER_JS];
  }
  
  const serverComponent = typeof SEVER_JS === 'string' ? await require(SEVER_JS).default(req, props) : await SEVER_JS(req, props);
  const stream = global.renderToNodeStream(serverComponent);

  return stream;

};

module.exports = renderToStream;
