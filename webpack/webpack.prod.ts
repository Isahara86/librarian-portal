/* eslint-disable import/no-extraneous-dependencies */
import { merge } from 'webpack-merge';
import webpack from 'webpack';
// plugins
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import common from './webpack.common';

const config: webpack.Configuration = {
  mode: 'production',
  plugins: [
    // new BundleAnalyzerPlugin(),
    new CompressionPlugin({
      test: /\.js$/,
      threshold: 10240,
      filename: '[path][base]',
      deleteOriginalAssets: true,
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    clean: true,
  },
  optimization: {
    concatenateModules: true,
    minimizer: [
      new TerserPlugin({ parallel: true }),
    ],
  },
};

export default merge(common, config);
