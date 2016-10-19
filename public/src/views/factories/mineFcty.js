function mineFcty( $http ) {

  return {
      getPodcastsFromDb() {
        return $http.get( "/api/podcast" ).then( podcasts => {
          return podcasts.data;
        } )
        .catch( err => {
          console.log( "mineFcty error", err );
          return err;
        } );
      }
      , removePodcast( podcast ) {
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
      , sendPodcastToMongoDb( podcast ) {
        console.log( "sendPodcastToMongoDb ran in mineFcty" );
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
            console.log( "/api/podcast POST says: ", res );
            return res;
          } )
          .catch( err => {
            console.log( "Error attempting to POST to /api/podcast", err );
            return err;
          } );
        }
        , retrieveRSSFeedInformation( feed ) {
          console.log( "MINE FCTY RSS SCANNER was passed:", feed );
          return $.get( feed ).then( function( data ) {
            let item = $(data).find("item");
            let entry = $(data).find("entry");
            let returnObj = {
              episodeTitles: []
              , episodeDescriptions: []
              , episodeUrls: []
              , feed: feed
            };
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
            return error;
          } );
        }
  };

}

export default mineFcty;
