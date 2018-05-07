module.exports = function (paths) {
    'use strict';

    return {
        module: {
            rules: [
                {
                    test: /\.sass$/,
                    include: paths,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ]
        }
    };
};




