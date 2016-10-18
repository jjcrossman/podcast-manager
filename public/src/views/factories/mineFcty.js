function mineFcty( $http ) {

  return {
      getPodcastsFromDb() {
        return $http.get( "/api/podcast" ).then( podcasts => {
          return podcasts;
        } )
        .catch( err => {
          console.log( "mineFcty error", err );
        } );
      }
      , removePodcast( podcast ) {
        console.log( `removePodcast sent ${ podcast._id }` );
        return $http.delete( `/api/podcast/${ podcast._id }` ).then( res => {
          console.log( res );
        } )
        .catch( err => {
          console.log( err );
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
          } )
          .catch( err => {
            console.log( "Error attempting to POST to /api/podcast", err );
          } );
      }
  };

}

export default mineFcty;
