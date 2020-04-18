const miniCssExtractPlugin = require('mini-css-extract-plugin');

const miniCssInitialized = new miniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[id].css',
});

const stylusProdModuleRule = {
  test: /\.styl$/,
  loader: [miniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
};

const stylusDevModuleRule = {
  test: /\.styl$/,
  loader: ['style-loader','css-loader','stylus-loader'],
};

module.exports = {
  miniCssInitialized,
  stylusProdModuleRule,
  stylusDevModuleRule,
};
