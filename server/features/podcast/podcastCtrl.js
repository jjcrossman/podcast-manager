const Podcast = require( "./Podcast.js" );
const User = require( "../user/User.js" );

module.exports = {
  getUserPodcasts( req, res ) {
    console.log( `This is /api/podcast GET` );
    console.log( req.session.currentUser.fbId );
    User.findOne( { fbId: req.session.currentUser.fbId } )
      .populate( "subscriptions" )
      .exec( ( err, userWithPodcasts ) => {
        if ( err ) {
          return res.status( 500 ).json( err );
        }
        console.log( "!%!%!%!%!%!%!%!%!" );
        console.log( userWithPodcasts );
        return res.status( 200 ).json( userWithPodcasts );
      } );
  }
  , attachPodcastToUser( req, res ) {
    console.log( `This is /api/podcast POST` );
    new Podcast( req.body ).save( ( err, podcast ) => {
      if ( err ) {
        return res.status( 500 ).json( err );
      }
      console.log( podcast._id );
      User.findByIdAndUpdate( req.session.currentUser._id, { $push: { subscriptions: podcast._id } }, ( err, response ) => {
        if ( err ) {
          return res.status( 500 ).json( err );
        }
        console.log( "***podcast added to User" );
        return res.status( 201 ).json( response );
      } );
    } );
  }
  , removePodcastFromUser( req, res ) {
    console.log( `This is /api/podcast/:id DELETE` );
    console.log( req.params.id );
    User.findByIdAndUpdate( req.session.currentUser._id, { $pull: { subscriptions: req.params.id } }, ( err, response ) => {
      if ( err ) {
        return res.status( 500 ).json( err );
      }
      return res.status( 200 ).json( response );
    } );
  }
};
