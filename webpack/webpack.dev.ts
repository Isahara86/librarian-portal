/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import { merge } from 'webpack-merge';
// plugins
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import common from './webpack.common';

const config: webpack.Configuration = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  // @ts-ignore
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    static: false,
    headers: { 'Access-Control-Allow-Origin': '*' },
    client: { overlay: false },
  },
  output: { pathinfo: false },
  // cache: {
  //   type: 'filesystem'
  // }, // bug in eslint webpack plugin - check to fix later
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  plugins: [
    new ESLintPlugin({
      emitError: true, // show errors after compile
      emitWarning: true,
      threads: true,
      extensions: ['js', 'jsx', 'ts', 'tsx', '.graphql'],
    }),
    new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
};

export default merge(common, config);
