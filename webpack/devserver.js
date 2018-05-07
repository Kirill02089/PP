module.exports = function () {
    'use strict';

    return {
        devtool: 'source-map',
        devServer: {
            stats: 'minimal',
            port: 8080,
        }
    };
};

