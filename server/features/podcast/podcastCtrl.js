const Podcast = require( "./Podcast.js" );
const User = require( "../user/User.js" );

module.exports = {
  getUserPodcasts( req, res ) {
    console.log( `This is /api/podcast GET` );
    User.findOne( {})
    Podcast.find( {}, ( err, podcasts ) => {
        if ( err ) {
          return res.status( 500 ).json( err );
        }
        return res.status( 200 ).json( podcasts );
      } );
  }
  , addPodcast( req, res ) {
    console.log( `This is /api/podcast POST` );
    new Podcast( req.body ).save( ( err, podcast ) => {
      if ( err ) {
        return res.status( 500 ).json( err );
      }
      return res.status( 201 ).json( podcast );
    } );
  }
  , removePodcast( req, res ) {
    console.log( `This is /api/podcast DELETE` );
    console.log( req.params.id );
    Podcast.findByIdAndRemove( req.params.id, ( err, response ) => {
      if ( err ) {
        return res.status( 500 ).json( err );
      }
      return res.status( 200 ).json( response );
    } );
  }
};
