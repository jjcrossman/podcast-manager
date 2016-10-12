const Podcast = require( "./Podcast.js" );

module.exports = {
  getPodcasts( req, res ) {
    console.log( `This is /api/podcast GET` );
    Podcast.find( {} )
      .populate( "episodes" )
      .exec( ( err, podcasts ) => {
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
};
