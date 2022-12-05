/* eslint-disable import/no-extraneous-dependencies */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

const ROOT_PATH = path.resolve(process.cwd());

const config: webpack.Configuration = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      containers: path.resolve(ROOT_PATH, './src/containers'),
      components: path.resolve(ROOT_PATH, './src/components'),
      hooks: path.resolve(ROOT_PATH, './src/hooks'),
      codegen: path.resolve(ROOT_PATH, './src/codegen'),
      operations: path.resolve(ROOT_PATH, './src/operations'),
      utils: path.resolve(ROOT_PATH, './src/utils'),
      routes: path.resolve(ROOT_PATH, './src/routes'),
      config: path.resolve(ROOT_PATH, './src/config'),
      styles: path.resolve(ROOT_PATH, './src/styles'),
      types: path.resolve(ROOT_PATH, './src/types'),
      menus: path.resolve(ROOT_PATH, './src/menus'),
      vars: path.resolve(ROOT_PATH, './src/vars'),
      images: path.resolve(ROOT_PATH, './src/images'),
    },
  },
  plugins: [
    // new webpack.ProvidePlugin({ process: 'process/browser' }),
    new HtmlWebpackPlugin({ template: path.resolve(ROOT_PATH, './public/index.html') }),
    new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      API_URL: 'https://api.gummersbach-library.net/graphql',
    }),
  ],
  entry: {
    bundle: [
      './src/index',
    ],
  },
  output: {
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      exclude: path.resolve(ROOT_PATH, 'node_modules'),
      options: { transpileOnly: true },
    }, {
      test: /(\.css|\.scss)$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    }, {
      test: /\.(png|jpg|svg|gif)$/,
      loader: 'url-loader',
    }, {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader', // translates CSS into CommonJS
        {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            lessOptions: {
              modifyVars: { 'primary-color': '#43ff9e' },
              javascriptEnabled: true,
            },
          },
        },
      ],
    }],
  },
  // performance: {
  //   hints: 'warning'
  // }
};

export default config;
