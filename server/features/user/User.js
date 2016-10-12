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
  , subscriptions: {
    type: mongoose.Schema.Types.ObjectId
    , ref: "Podcast"
    , default: []
  }

} );

module.exports = mongoose.model( "User", User );
