const User = require( "../user/User.js" );

module.exports = {
  getUserData( req, res ) {
    // req.user.data.id
    console.log( req.user );
    console.log( "******WHAT*******" );
    req.session.facebook = req.user;
    // Does this user already exist? Look for a match in users by Facebook ID
    User.findOne( { fbId: req.user.id }, ( err, matchedUser ) => {
      if ( err ) {
        console.log( "LINE 12 err" );
        return res.status( 500 ).json( err );
      }
      // Is matchedUser null (make new user) or has data (existing user)
      console.log( matchedUser );
      if ( !matchedUser ) {
        //make new user
        let fullName = req.session.facebook.name.givenName + " " + req.session.facebook.name.familyName;
        let newUser = {
          name: fullName
          , avatar: req.session.facebook.photos[0].value
          , fbId: req.session.facebook.id
          , newUser: true
        };
        req.session.facebook = newUser;
        console.log( "Using newly created user" );
        return res.status( 200 ).json( newUser );
      }
      //use existing user
      console.log( 'Using Existing Found User' );
      return res.status( 200 ).json( matchedUser );
    } );

  }
};
