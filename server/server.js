const express = require( "express" );
const app = express();
const session = require( "express-session" );
// const config = require( "./config/serverConfig.js" );
const passport = require( "passport" );
const FacebookStrategy = require( "passport-facebook" ).Strategy;
const { json } = require( "body-parser" );
const mongoose = require( "mongoose" );
const cors = require( "cors" );
const port = process.env.PORT ? process.env.PORT : 4000;
const mongoUri = process.env.MONGOURI ? process.env.MONGOURI : "mongodb://localhost:27017/podcastmanager";

// USE
app.use( cors( { origin: "https://podcast-manager.herokuapp.com/" } ) );
// app.all( '*', function (req, res, next) {
//   res.header( "Content-Type", "application/json" );
//   res.header( "Access-Control-Allow-Origin", "*" );
//    res.header( 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS' );
//   res.header( "Access-Control-Allow-Headers", "X-Requested-With, Content-Type" );
//   next();
// } );

app.use( json() );
app.use( session( { secret: process.env.SESSION_SECRET || "keyboard cat", resave: false, saveUninitialized: false } ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( express.static( `${ __dirname }/../public` ) );

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID ? process.env.FACEBOOK_CLIENT_ID : config.facebook.clientId,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ? process.env.FACEBOOK_CLIENT_SECRET : config.facebook.secret,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL ? process.env.FACEBOOK_CALLBACK_URL : config.facebook.cbUrl,
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

// app.options( 'https://itunes.apple.com/search', function(req, res) {
//   res.status(200).set({
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
//     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
//     'X-XSS-Protection': '1; mode=block',
//     'X-Frame-Options': 'SAMEORIGIN',
//     'Content-Security-Policy': "default-src 'self'"
//   }).send();
// });

// LISTEN
app.listen( port, () => console.log( `Podcast Manager is listening on port ${ port }` ) );
