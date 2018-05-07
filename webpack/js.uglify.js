const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function() {
    'use strict';

    return {
        plugins: [
          new UglifyJsPlugin({
              sourceMap: true
          })
        ]
    };
};