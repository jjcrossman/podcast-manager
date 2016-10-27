function mineFcty( $http ) {

  return {
      getUserPodcastsFromDb() {
        return $http.get( "/api/podcast" ).then( podcasts => {
          return podcasts.data.subscriptions;
        } )
        .catch( err => {
          console.log( "mineFcty error", err );
          return err;
        } );
      }
      , removePodcastFromUser( podcast ) {
        return $http.delete( `/api/podcast/${ podcast._id }` ).then( res => {
          console.log( "Unsubscribed: ", !!res.data );
          return res;
        } )
        .catch( err => {
          console.log( err );
          return err;
        } );
      }
      , attachPodcastToUser( podcast ) {
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
          return $http.post( "/api/podcast", preparedObj ).then( res => {
            console.log( "Subscribed: ", !!res );
            return res;
          } )
          .catch( err => {
            console.log( "Error attempting to POST to /api/podcast", err );
            return err;
          } );
        }
        , retrieveRSSFeedInformation( feed ) {

          let feedObj = {
            feed
          };

          return $http.post( "/api/rss", feedObj )
          .then( rssFeeds => {
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
          return returnObj;
        } ).catch( error => {
          console.log( "error in mineFcty", error );
        } );
        }
        , getUserData() {
          return $http.get( "/api/auth/" ).then( userObj => {
            return userObj.data;
          } )
          .catch( err => {
            console.log( "mineFcty 94", err );
          } );
        }
        , addNewUser( newUser ) {
          return $http.post( "/api/user", newUser );
        }
  };

}

export default mineFcty;
