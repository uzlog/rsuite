/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Run all tests: `npm run tdd`
 * Run all styles tests: `M=styles npm run tdd`
 * Run a component test: `M=Button npm run tdd`
 * Run a test of a file: `src/Picker/test/PickerToggleSpec.js npm run tdd`
 */

const path = require('path');
const webpack = require('webpack');

const webpackConfig = {
  output: {
    pathinfo: true
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@test': path.resolve(__dirname, './test')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        RUN_ENV: JSON.stringify(process.env.RUN_ENV)
      }
    })
  ],
  module: {
    rules: [
      {
        test: [/\.tsx?$/, /\.jsx?$/],
        use: ['babel-loader?babelrc'],
        exclude: /node_modules/
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS,
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ]
  }
};

module.exports = config => {
  const { env } = process;
  const { M, F } = env;

  let testFile = 'test/index.js';

  if (M) {
    testFile = `src/${M}/test/*.js`;
  } else if (F) {
    testFile = F;
  }

  config.set({
    /** Timeout for capturing a browser (in ms). */
    captureTimeout: 210000,

    /** maximum number of tries a browser will attempt in the case of a disconnection (in ms) */
    browserDisconnectTolerance: 3,

    /** How long does Karma wait for a browser to reconnect (in ms). */
    browserDisconnectTimeout: 210000,

    /** How long will Karma wait for a message from a browser before disconnecting from it (in ms). */
    browserNoActivityTimeout: 210000,
    basePath: '',
    browserStack: {
      username: process.env.BS_USERNAME,
      accessKey: process.env.BS_ACCESS_KEY
    },
    files: [testFile],
    frameworks: ['mocha', 'sinon-chai'],
    colors: true,
    reporters: ['mocha', 'coverage', 'BrowserStack'],
    logLevel: config.LOG_INFO,
    preprocessors: {
      'test/*.js': ['webpack'],
      'src/**/*.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    browsers: ['bs_mac_chrome', 'bs_mac_firefox', 'bs_mac_safari', 'bs_win_edge', 'bs_win_ie11'],
    customLaunchers: {
      bs_win_ie11: {
        os: 'Windows',
        os_version: '10',
        browserName: 'IE',
        browser_version: '11.0',
        resolution: '1366x768'
      },

      bs_win_edge: {
        os: 'Windows',
        os_version: '10',
        browserName: 'Edge',
        browser_version: 'latest',
        resolution: '1366x768'
      },

      bs_mac_chrome: {
        os: 'OS X',
        os_version: 'Big Sur',
        browserName: 'Chrome',
        browser_version: 'latest'
      },
      bs_mac_firefox: {
        os: 'OS X',
        os_version: 'Big Sur',
        browserName: 'Firefox',
        browser_version: 'latest'
      },
      bs_mac_safari: {
        os: 'OS X',
        os_version: 'Big Sur',
        browserName: 'Safari',
        browser_version: '14.0'
      }
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html' },
        { type: 'lcov', subdir: 'lcov' } // lcov
      ]
    }
  });
};
