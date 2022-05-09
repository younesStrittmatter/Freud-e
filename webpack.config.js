const path = require('path');

module.exports = [{
    // The entry point file described above
    entry: './public/src/index.js',
    // The location of the build folder described above
    output: {
        path: path.resolve(__dirname + '/public', 'dist'),
        filename: 'bundle.js'
    },
    // Optional and for development only. This provides the ability to
    // map the built code back to the original source format when debugging.
    devtool: 'eval-source-map',
},{
    entry: './public/games/src/js/index_stoop.js',
    // The location of the build folder described above
    output: {
        path: path.resolve(__dirname + '/public/games', 'dist'),
        filename: 'bundle_stoop.js'
    },
    // Optional and for development only. This provides the ability to
    // map the built code back to the original source format when debugging.
    devtool: 'eval-source-map',
},{
    entry: './public/games/src/js/index_symb_dir_col_stroop.js',
    // The location of the build folder described above
    output: {
        path: path.resolve(__dirname + '/public/games', 'dist'),
        filename: 'bundle_symb_dir_col_stroop.js'
    },
    // Optional and for development only. This provides the ability to
    // map the built code back to the original source format when debugging.
    devtool: 'eval-source-map',
}];
