const express = require( "express" );
const app = express();
const { json } = require( "body-parser" );
const mongoose = require( "mongoose" );
const cors = require( "cors" );
const port = 4000;
// const mongoUri = "mongodb://localhost:27017/podcast-manager";

// USE
app.use( json() );
app.use( express.static( `${ __dirname }/../public` ) );

// Mongoose connection to MongoDB

// Master Routes
// require( "./masterRoutes.js" )( app );

// LISTEN

app.listen( port, () => console.log( `Podcast Manager is listening on port ${ port }` ) );
