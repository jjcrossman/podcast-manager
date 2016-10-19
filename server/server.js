const express = require( "express" );
const app = express();
const session = require( "express-session" );
const config = require( "./config/serverConfig.js" );
const passport = require( "passport" );
const FacebookStrategy = require( "passport-facebook" ).Strategy;
const { json } = require( "body-parser" );
const mongoose = require( "mongoose" );
const cors = require( "cors" );
const port = 4000;
const mongoUri = "mongodb://localhost:27017/podcastmanager";

// USE
// app.use( cors( config.cors ) );
// app.all('http://localhost:4000', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
//   next();
// });
app.use( json() );
app.use( session( config.podcastManager ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( express.static( `${ __dirname }/../public` ) );

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.secret,
    callbackURL: config.facebook.cbUrl,
    profileFields: ["name","picture.type(small)"]
  },
  function(accessToken, refreshToken, profile, done) {
      return done( null, profile );
    }));

app.get( "/auth/facebook", passport.authenticate( "facebook" ) );
app.get( "/auth/facebook/callback", passport.authenticate( "facebook", {
  successRedirect: "/#/mine"
  , failureRedirect: "/"
} ) );

passport.serializeUser( ( user, done ) => {
  done( null, user );
} );

passport.deserializeUser( ( obj, done ) => {
  done( null, obj );
} );

// Mongoose connection to MongoDB
mongoose.connect( mongoUri );

mongoose.connection.once( "open", () => console.log( `Mongoose connected to MongoDB at ${ mongoUri }` ) );

// Master Routes
require( "./masterRoutes.js" )( app );


// LISTEN
app.listen( port, () => console.log( `Podcast Manager is listening on port ${ port }` ) );
