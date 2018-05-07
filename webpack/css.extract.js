const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (paths) {
    'use strict';

    return {
        module: {
            rules: [
                {
                    test: /\.sass$/,
                    include: paths,
                    use: ExtractTextPlugin.extract({
                        publicPath: '../',
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
                },
                {
                    test: /\.css$/,
                    include: paths,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: './css/[name].css'
            })
        ]
    }
};
