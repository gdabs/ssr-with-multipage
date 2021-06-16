import React from 'react';
import serialize from 'serialize-javascript';
import { LayoutProps } from '@/types/layout.d';
import '@/assets/common.less';

import './index.less';

// 为了同时兼容ssr/csr请保留此判断，如果你的layout没有内容请使用 props.children ?  props.children  : ''
const commonNode = (props: LayoutProps) =>
  props.children ? <div className="layoutContainer">{props.children}</div> : null;

const Layout: SFC<LayoutProps> = (props: LayoutProps): JSX.Element | null => {
  if (__isBrowser__) {
    return commonNode(props);
  } else {
    const serverData = props.layoutData;
    const { injectCss, injectScript } = props.ssrConfig;
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>React App</title>
          {injectCss && injectCss.map(item => <link rel="stylesheet" href={item} key={item} />)}
        </head>
        <body>
          {/* https://github.com/facebook/react/issues/10879 */}
          <div id="app">{commonNode(props)}</div>
          {serverData && (
            <script
              dangerouslySetInnerHTML={{
                __html: `window.__USE_SSR__=true;window.__INITIAL_DATA__ =${serialize(serverData)}`,
              }}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: injectScript && injectScript.join('') }} />
        </body>
      </html>
    );
  }
};

export default Layout;
