const webpack = require( "webpack" );

module.exports = {
  entry: "./public/src/app.js"
  , module: {
    loaders: [
      {
        test: /\.js$/
        , loader: "babel"
      }
      , {
        test: /\.(sass|scss)$/
        , exclude: /node_modules/
        , loader: "style!css!sass"
      }
      , {
        test: /\.css$/
        , loader: "style!css"
      }
      , {
        test: /\.less$/
        , loader: "style!less"
      }
      , { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      , { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
      , {
        test: /\.html$/
        , loader: "html"
      }
      , {
       test: /\.(jpe?g|png|gif|svg)$/i,
       loaders: [
           'file?hash=sha512&digest=hex&name=[hash].[ext]',
           'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
       ]
   }
    ]
  }
  , resolve: {
    extensions: [ "", ".js", ".sass" ]
  }
  , plugins: [
    new webpack.ProvidePlugin( {
      $: "jquery",
      jQuery: "jquery"
    } )
  ]
  , output: {
    path: "./public"
    , filename: "bundle.js"
  }
  , devServer: {
    contentBase: "./public" //tells webpack where index.html lives
  }
};
