const Podcast = require( "./Podcast.js" );
const User = require( "../user/User.js" );

let itunesSearchUrl = "https://itunes.apple.com/search?term=";
let itunesSearchQuery = "";
let itunesSearchParameters = "&country=us&media=podcast&entity=podcast&limit=20";

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
        console.log( "Returning user populated with Podcasts" );
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
        console.log( "Podcast added to User" );
        return res.status( 201 ).json( response );
      } );
    } );
  }
  , removePodcastFromUser( req, res ) {
    console.log( `This is /api/podcast/:id DELETE` );
    console.log( req.params.id );
    User.findByIdAndUpdate( req.session.currentUser._id, { $pull: { subscriptions: req.params.id } }, ( err, removed ) => {
      if ( err ) {
        return res.status( 500 ).json( err );
      }
      Podcast.findByIdAndRemove( req.params.id, ( err, deleted ) => {
        if ( err ) {
          return res.status( 500 ).json( err );
        }
        return res.status( 200 ).json( deleted );
      } )
    } );
  }
  , queryItunes( req, res ) {
    console.log( "8*8***888*888888*88*******888*888**8" );
    console.log( req.body );
    itunesSearchQuery = req.body;
  }
};
