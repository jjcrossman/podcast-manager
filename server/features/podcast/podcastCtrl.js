const Podcast = require( "./Podcast.js" );
const User = require( "../user/User.js" );
const axios = require( "axios" );

let itunesSearchUrl = "https://itunes.apple.com/search?term=";
let itunesSearchQuery = "";
let itunesSearchParameters = "&country=us&media=podcast&entity=podcast&limit=20";

module.exports = {
  getUserPodcasts( req, res ) {
    console.log( `This is /api/podcast GET` );
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
    console.log( `This is /api/itunes POST` );
    itunesSearchQuery = req.body.searchTerm;
    axios.get( `${ itunesSearchUrl }${ itunesSearchQuery }${ itunesSearchParameters }` ).then( iTunesRes => {
      let itunes = iTunesRes.data;
      if ( itunes.resultCount && itunes.resultCount !== 0 ) {
      console.log( `Results retrieved from iTunes: ${ itunes.resultCount }` );
      let titles = [], feeds = [], artworks = [];
      for ( let i = 0; i < itunes.results.length; i++ ) {
        titles.push( itunes.results[i].trackName );
      }
      for ( let i = 0; i < itunes.results.length; i++ ) {
        feeds.push( itunes.results[i].feedUrl );
      }
      for ( let i = 0; i < itunes.results.length; i++ ) {
        artworks.push( itunes.results[i].artworkUrl600 );
      }
      let returnObj = {
        podcastTitles: titles
        , podcastFeeds: feeds
        , podcastArtworks: artworks
        , podcastDescriptions: []
        , podcastEpisodeTitles: []
        , podcastEpisodeDescriptions: []
        , podcastEpisodeUrls: []
      }

      return res.status( 200 ).json( returnObj );
    } } )
      .catch( error => {
        console.log( "Error in server/podcastCtrl", error );
        return error;
      } );
  }

  , queryRss( req, res ) {
    console.log( `This is /api/rss POST` );
    console.log( "Scan RSS:", req.body.feed );
    axios.get( req.body.feed ).then( rssRes => {
      return res.status( 200 ).json( rssRes.data );
    } )
    .catch( err => {
      console.log( err );
    } );
  }
};
