function moreFcty( $http, $q ) {

  let itunesSearchUrl = "https://itunes.apple.com/search?term=";
  let itunesSearchQuery = "";
  let itunesSearchParameters = "&country=us&media=podcast&entity=podcast&limit=10";

  return {

    searchItunes( searchTerm ) {
      itunesSearchQuery = searchTerm;
      return $http.get( `${ itunesSearchUrl }${ itunesSearchQuery }${ itunesSearchParameters }` ).then( res => {
          console.log( res );
        if ( res.data.resultCount && res.data.resultCount !== 0 ) {
          console.log( `Results retrieved from iTunes: ${ res.data.resultCount }` );
          let titles = [], feeds = [], artworks = [];
          for ( let i = 0; i < res.data.results.length; i++ ) {
            titles.push( res.data.results[i].trackName );
          }
          for ( let i = 0; i < res.data.results.length; i++ ) {
            feeds.push( res.data.results[i].feedUrl );
          }
          for ( let i = 0; i < res.data.results.length; i++ ) {
            artworks.push( res.data.results[i].artworkUrl600 );
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

          console.log( "Returning iTunes", returnObj );

          return returnObj;
        } } )
          .catch( error => {
            console.log( "Error in moreFcty", error );
            return error;
          } );
    }

    , retrieveRSSFeedInformation( feed ) {

    return $.get( feed ).then( function( data ) {
      let channel = $(data).find("channel");
      let item = $(data).find("item");
      let entry = $(data).find("entry");
      let returnObj = {
        podcastDescription: ""
        , episodeTitles: []
        , episodeDescriptions: []
        , episodeUrls: []
        , feed: feed
      };

      let description = channel.find("description:first").text();
      returnObj.podcastDescription = description;

      if ( item ) {
        item.each( function() {
          var el = $(this);

          let episodeTitle = el.find("title").text();
          let episodeDescription = el.find("description").text();
          let episodeUrl = el.find("enclosure").attr("url");

          returnObj.episodeTitles.push( episodeTitle );
          returnObj.episodeDescriptions.push( episodeDescription) ;
          returnObj.episodeUrls.push( episodeUrl );

        } );
      } else {
        entry.each( function() {
          var el = $(this);

          let episodeTitle = el.find("title").text();
          let episodeDescription = el.find("description").text();
          let episodeUrl = el.find("enclosure").attr("url");

          returnObj.episodeTitles.push( episodeTitle );
          returnObj.episodeDescriptions.push( episodeDescription );
          returnObj.episodeUrls.push( episodeUrl );

        } );
      }
      return returnObj;
    } ).catch( error => {
      console.log( "error in moreFcty", error );
    } );
  }

  , getUserPodcastsFromDb() {
    console.log( "MoreFcty fired getUserPodcastsFromDb" );
    return $http.get( "/api/podcast" ).then( userWithPodcasts => {
      return userWithPodcasts.data.subscriptions;
    } )
    .catch( err => {
      console.log( "moreFcty error", err );
      return err;
    } );
  }

  , attachPodcastToUser( podcast ) {
    console.log( "send to mongoDB ran in moreFcty" );
    //POST every episode to Episode collection
    //GET each episode's ObjectId
    //.push each ObjectId to preparedObj.episodes array

    //OR preparedObj.episodes is an array of objects, the objects are episodes with title, description and url.
      let preparedObj = {
        title: podcast.title
        , description: podcast.description
        , artwork: podcast.artwork
        , feed: podcast.feed
      }
      $http.post( "/api/podcast", preparedObj ).then( res => {
        console.log( "/api/podcast POST says: ", res );
        return res;
      } )
      .catch( err => {
        console.log( "Error attempting to POST to /api/podcast", err );
        return err;
      } );
  }
  , removePodcastFromUser( podcast ) {
    console.log( `removePodcast sent ${ podcast._id }` );
    return $http.delete( `/api/podcast/${ podcast._id }` ).then( res => {
      console.log( res );
      return res;
    } )
    .catch( err => {
      console.log( err );
      return err;
    } );
  }
  , getUserAvatar() {
      return $http.get( "/api/user/avatar" ).then( userAvatar => {
        console.log( "User's avatar", userAvatar );
        return userAvatar.data;
      } )
      .catch( err => {
        console.log( "moreFcty 142", err );
      } );
  }

  }

}

export default moreFcty;
