import { clientRender, serverRender } from '../render';
import { InjectConfig, Request } from '@/types/layout.d';
const route = require('../../config/router.news');

export default __isBrowser__
  ? (() => {
      clientRender(route);
      if (process.env.NODE_ENV === 'development' && module.hot) {
        module.hot.accept();
      }
    })()
  : async (req: Request, config: InjectConfig) => {
      return serverRender(req, { ...config, route });
    };
