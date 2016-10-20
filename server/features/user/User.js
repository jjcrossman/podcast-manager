const mongoose = require( "mongoose" );

const User = new mongoose.Schema( {

  name: {
    type: String
    , required: true
    , default: "Username"
  }
  , avatar: {
    type: String
    , default: "../images/noAvatar.png"
  }
  , fbId: {
    type: Number
    , required: true
    , trim: true
  }
  , subscriptions: [ {
    type: mongoose.Schema.Types.ObjectId
    , ref: "Podcast"
    , required: true
    , default: ""
  } ]

} );

module.exports = mongoose.model( "User", User );
