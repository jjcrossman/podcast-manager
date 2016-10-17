const express = require( "express" );
const app = express();
const session = require( "express-session" );
const config = require( "./config/serverConfig.js" );
const passport = require( "passport" );
const { json } = require( "body-parser" );
const mongoose = require( "mongoose" );
const cors = require( "cors" );
const corsOptions = require( "./config/corsOptions.js" );
const port = 4000;
const mongoUri = "mongodb://localhost:27017/podcastmanager";

// USE
app.use( cors( corsOptions ) );
app.use( json() );
app.use( session( config.podcastManager ) );
app.use( express.static( `${ __dirname }/../public` ) );

// Mongoose connection to MongoDB
mongoose.connect( mongoUri );

mongoose.connection.once( "open", () => console.log( `Mongoose connected to MongoDB at ${ mongoUri }` ) );

// Master Routes
require( "./masterRoutes.js" )( app );


// LISTEN
app.listen( port, () => console.log( `Podcast Manager is listening on port ${ port }` ) );
