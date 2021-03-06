const webpack = require('webpack');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.config.base');
const { getEntry } = require('./util');
const getClientEnvironment = require('./env');
const paths = require('./paths');

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

const isEnvDevelopment = process.env.NODE_ENV === 'development';

const plugins = [
  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
  // It is absolutely essential that NODE_ENV is set to production
  // during a production build.
  // Otherwise React will be compiled in the very slow development mode.
  new webpack.DefinePlugin({
    ...env.stringified,
    __isBrowser__: false, // eslint-disable-line
  }),
];

module.exports = merge(baseConfig, {
  devtool: isEnvDevelopment ? 'eval-source-map' : '',
  entry: getEntry('server'),
  output: {
    path: paths.appBuild,
    publicPath: paths.publicUrlOrPath,
    filename: '[name].server.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: nodeExternals({
    whitelist: /\.(css|less|sass|scss)$/
  }),
  plugins: plugins,
});
