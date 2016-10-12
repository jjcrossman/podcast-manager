const User = require( "./User.js" );

module.exports = {
  getUsers( req, res ) {
    console.log( `This is /api/user GET` );
    User.find( {} )
      .populate( "subscriptions" )
      .exec( ( err, users ) => {
        if ( err ) {
          return res.status( 500 ).json( err );
        }
        return res.status( 200 ).json( users );
      } );
  }
  , addUser( req, res ) {
    console.log( `This is /api/user POST` );
    new User( req.body ).save( ( err, user ) => {
      if ( err ) {
        return res.status( 500 ).json( err );
      }
      return res.status( 201 ).json( user );
    } );
  }
};
