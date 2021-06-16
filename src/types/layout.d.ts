export { Request } from 'express';

export interface ServerJs {
  (req: Request): Promise<React.ReactElement>;
}

export interface Config {
  baseDir?: string;
  baseName?: string;
  type?: string;
  env?: string;
  useCDN?: string;
  isRax?: boolean;
  useReactToString?: boolean;
  routes: { [key: string]: RouteItem };
}

export interface InjectConfig {
  route: RouteItem;
  entry: string;
  injectScript: string[];
  injectCss: string[];
  serverJs: ServerJs | string;
  layout: ServerJs | string;
}

export type LayoutProps = {
  layoutData?: any;
  ssrConfig?: InjectConfig;
  children?: JSX.Element | null;
};

interface DefaultComponent extends React.FC<any> {
  getInitialProps?: (params: any, store: any) => Promise<any>;
}
interface Preload {
  default: DefaultComponent;
}
export interface FC extends React.FC<any> {
  getInitialProps?: (params: any) => Promise<any>;
  Layout?: React.FC<LayoutProps>;
  preload?: () => Promise<Preload>;
}

export interface RouteItem {
  entrey: string;
  path: string;
  exact?: boolean;
  Component: () => FC;
}
