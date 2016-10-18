const mongoose = require( "mongoose" );

const Podcast = new mongoose.Schema( {
  title: {
    type: String
    , trim: true
    , default: "Podcast Title"
  }
  , author: {
    type: String
    , trim: true
    , default: "Podcast Author"
  }
  , description: {
    type: String
    , trim: true
    , default: "Podcast Description"
  }
  , artwork: {
    type: String
    , trim: true
    , default: "../images/noArtwork.png"
  }
  , feed: {
    type: String
    , required: true
  }
  , episodes: {
    type: mongoose.Schema.Types.ObjectId
    , ref: "Episode"
    , default: []
  }
  , onlocal: {
    type: Boolean
    , default: false
  }
} );

module.exports = mongoose.model( "Podcast", Podcast );
