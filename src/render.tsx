import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, StaticRouter, Route } from 'react-router-dom';
import getWrappedComponent from './layout/getComponent';
import defaultLayout from './layout';
import { RouteItem, Request, InjectConfig } from '@/types/layout.d';

export const clientRender = async (route: RouteItem): Promise<void> => {
  // 客户端渲染||hydrate
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <BrowserRouter>
      <Route
        exact={route.exact}
        key={route.path}
        path={route.path}
        render={() => {
          const activeComponent = route.Component();
          const Layout = activeComponent.Layout || defaultLayout;
          const WrappedComponent = getWrappedComponent(activeComponent);
          return (
            <Layout>
              <WrappedComponent />
            </Layout>
          );
        }}
      />
    </BrowserRouter>,
    document.getElementById('app')
  );
};

export const serverRender = async (req: Request, config: InjectConfig): Promise<JSX.Element> => {
  // 服务端渲染 根据req.path获取请求的具体组件，调用getInitialProps并渲染
  const { route } = config;
  const ActiveComponent = route.Component();
  const Layout = ActiveComponent.Layout || defaultLayout;
  const getInitialProps = ActiveComponent.getInitialProps;
  const initialProps = ActiveComponent.getInitialProps ? await getInitialProps(req) : {};
  return (
    <StaticRouter location={req.url} context={initialProps}>
      <Layout layoutData={initialProps} ssrConfig={config}>
        <ActiveComponent {...initialProps} />
      </Layout>
    </StaticRouter>
  );
};
