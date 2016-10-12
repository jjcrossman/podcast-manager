const Episode = require( "./Episode.js" );

module.exports = {
  getEpisodes( req, res ) {
    console.log( `This is /api/episode GET` );
    Episode.find( {}, ( err, response ) => {
      if ( err ) {
        return res.status( 500 ).json( err );
      }
      return res.status( 200 ).json( response );
    } );
  }
  , addEpisode( req, res ) {
    console.log( `This is /api/episode POST` );
    new Episode( req.body ).save( ( err, response ) => {
      if ( err ) {
        return res.status( 500 ).json( err );
      }
      return res.status( 201 ).json( response );
    } );
  }
};
