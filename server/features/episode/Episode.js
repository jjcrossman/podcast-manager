const mongoose = require( "mongoose" );

const Episode = new mongoose.Schema( {
  title: {
    type: String
    , trim: true
    , default: "Episode Title"
  }
  , description: {
    type: String
    , trim: true
    , default: "Episode Description"
  }
  , duration: { // in seconds
    type: Number
    , default: 0
  }
  , filesize: { // in megabytes
    type: Number
    , default: 0
  }
  , onlocal: {
    type: Boolean
    , default: false
  }
  , url: {
    type: String
    , required: true
  }
} );

module.exports = mongoose.model( "Episode", Episode );
