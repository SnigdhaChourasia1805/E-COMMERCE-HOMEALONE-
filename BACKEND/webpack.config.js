const path = require('path');

module.exports = {
  entry: './src/main.jsx',  // The entry point for your React app
  output: {
    path: path.resolve(__dirname, 'dist'),  // Output directory for the bundled files
    filename: 'bundle.js',  // The name of the bundled file
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,  // This will match all .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Use Babel to transpile JSX
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],  // Use Babel presets for modern JavaScript and React
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],  // Automatically resolve these extensions
  },
  devtool: 'source-map',  // Enable source maps for easier debugging
};
