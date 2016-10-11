module.exports = {
  entry: "./public/src/app.js"
  , module: {
    loaders: [
      {
        test: /\.js$/
        , exclude: /node_modules/
        , loader: "babel"
      }
      , {
        test: /\.(sass|scss)$/
        , exclude: /node_modules/
        , loader: "style!css!sass"
      }
      , {
        test: /\.css$/
        , exclude: /node_modules/
        , loader: "style!css"
      }
      , {
        test: /\.(woff|woff2|eot|ttf|svg)$/
        , loader: "url"
      }
      , {
        test: /\.html$/
        , loader: "html"
      }
    ]
  }
  , resolve: {
    extensions: [ "", ".js", ".sass" ]
  }
  , output: {
    path: "./public"
    , filename: "bundle.js"
  }
  , devServer: {
    contentBase: "./public" //tells webpack where index.html lives
  }
};
