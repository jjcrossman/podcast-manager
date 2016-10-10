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
        test: /\.css$/
        , exclude: /node_modules/
        , loader: "style!css"
      }
      , {
        test: /\.html$/
        , loader: "html"
      }
    ]
  }
  , resolve: {
    extensions: [ "", ".js", ".css" ]
  }
  , output: {
    path: "./public"
    , filename: "bundle.js"
  }
  , devServer: {
    contentBase: "./public" //tells webpack where index.html lives
  }
};
