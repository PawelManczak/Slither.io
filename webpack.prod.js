const merge = require('webpack-merge').merge;
const common = require('./webpack.common.js');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [new TerserJSPlugin({})],
  },
});
