function moreFcty( $http, $q ) {

  return {

    searchItunes( searchTerm ) {
      let itunesQuery = {
        searchTerm
      };
      return $http.post( "/api/itunes", itunesQuery ).then( podcasts => {
        console.log( "searchItunes in moreFcty got back:", podcasts );
        return podcasts.data;
      } )
      .catch( err => {
        console.log( "Error in moreFcty", err );
      } );
    }

    , retrieveRSSFeedInformation( feed ) {

      let feedObj = {
        feed
      };

      console.log( feedObj );

      return $http.post( "/api/rss", feedObj )
      .then( rssFeeds => {
        console.log( "moreFcty line 28: ", rssFeeds );
      let rss = rssFeeds.data;
      let channel = $(rss).find("channel");
      let item = $(rss).find("item");
      let entry = $(rss).find("entry");
      let returnObj = {
        podcastDescription: ""
        , episodeTitles: []
        , episodeDescriptions: []
        , episodeUrls: []
        , feed: feed
      };

      let description = channel.find("description:first").text();
      if ( !description ) {
        description = channel.find("description:first").html();
        let end = description.lastIndexOf(">") - 4;
        description = description.slice( 11, end );
      }
      returnObj.podcastDescription = description;

      if ( item ) {
        item.each( function() {
          let el = $(this);

          let episodeTitle = el.find("title").text();
          if ( !episodeTitle ) {
            episodeTitle = el.find("description").html();
            let end = episodeTitle.lastIndexOf(">") - 4;
            episodeTitle = episodeTitle.slice( 11, end );
          }
          let episodeDescription = el.find("description").text();
          if ( !episodeDescription ) {
            episodeDescription = el.find("description").html();
            let end = episodeDescription.lastIndexOf(">") - 4;
            episodeDescription = episodeDescription.slice( 11, end );
            console.log( episodeDescription );
          }
          let episodeUrl = el.find("enclosure").attr("url");

          returnObj.episodeTitles.push( episodeTitle );
          returnObj.episodeDescriptions.push( episodeDescription) ;
          returnObj.episodeUrls.push( episodeUrl );

        } );
      } else {
        entry.each( function() {
          let el = $(this);

          let episodeTitle = el.find("title").text();
          if ( !episodeTitle ) {
            episodeTitle = el.find("description").html();
            let end = episodeTitle.lastIndexOf(">") - 4;
            episodeTitle = episodeTitle.slice( 11, end );
          }
          let episodeDescription = el.find("description").text();
          if ( !episodeDescription ) {
            episodeDescription = el.find("description").html();
            let end = episodeDescription.lastIndexOf(">") - 4;
            episodeDescription = episodeDescription.slice( 11, end );
          }
          let episodeUrl = el.find("enclosure").attr("url");

          returnObj.episodeTitles.push( episodeTitle );
          returnObj.episodeDescriptions.push( episodeDescription );
          returnObj.episodeUrls.push( episodeUrl );

        } );
      }
      console.log( returnObj );
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
