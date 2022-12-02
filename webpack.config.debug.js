const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  devtool: 'source-map',
  entry: slsw.lib.entries,
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              configFile: 'tsconfig.debug.json',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    // We no not want to minimize our code.
    minimize: false,
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    sourceMapFilename: '[file].map',
  },
  // Fix: Replace below when lambda aws-sdk runtime is updated to support ApiGatewayManagementApi
  // externals: [{'aws-sdk': 'commonjs aws-sdk'}, nodeExternals()],
  performance: {
    // Turn off size warnings for entry points
    hints: false,
  },
  plugins: [],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
  target: 'node',
};
