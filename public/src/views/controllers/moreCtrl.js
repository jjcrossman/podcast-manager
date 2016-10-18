function moreCtrl( $scope, $timeout, moreFcty ) {

  function init() {
    $scope.activeLi = "";
    $scope.searchTerm = "";
    $scope.whichView = "pm-mine-bar";
    $timeout( function(){$scope.whichView = "pm-more-bar";}, 1);
    $scope.podcasts = [];
    $scope.details = [];
  }

  $scope.searchItunes = ( searchTerm ) => {
    moreFcty.searchItunes( searchTerm )
      .then( data => {
        console.log( data );
        if ( data ) {
          for ( let i = 0; i < data.podcastTitles.length; i++ ) {
            $scope.podcasts.push( {
              title: data.podcastTitles[i]
              , feed: data.podcastFeeds[i]
              , artwork: data.podcastArtworks[i]
              , episodes: []
            } );
            if ( $scope.podcasts[i].title.length > 50 ) {
              $scope.podcasts[i].title = $scope.podcasts[i].title.slice(0, 50) + "...";
            }
          }
          for ( let i = 0; i < data.podcastFeeds.length; i++ ) {
            $scope.retrieveRSSFeedInformation( data.podcastFeeds[i] );
          }
          return;
        } else {
          console.log( "No data returned to moreCtrl" );
        }
      } )
      .catch( error => {
        console.log( `Error in moreCtrl: ${ error }` );
      } );
  }

  $scope.retrieveRSSFeedInformation = ( feed ) => {
    moreFcty.retrieveRSSFeedInformation( feed )
    .then( data => {
      for ( let i = 0; i < $scope.podcasts.length; i++ ) {
        if ( $scope.podcasts[i].feed === data.feed ) {
          $scope.podcasts[i].description = data.podcastDescription;
          $scope.podcasts[i].episodeTitles = data.episodeTitles;
          $scope.podcasts[i].episodeDescriptions = data.episodeDescriptions;
          $scope.podcasts[i].episodeUrls = data.episodeUrls;
        }
      }
    } )
    .catch( error => {
      console.log( "Error in moreCtrl", error );
    } );
  };

  $scope.populateDetails = ( podcast ) => {
    console.log( "populateDetails fired" );
    console.log( podcast );
    $scope.detailsPodcastTitle = podcast.title;
    $scope.detailsPodcastArtwork = podcast.artwork;
    $scope.detailsPodcastDescription = podcast.description;
    for ( let i = 0; i < podcast.episodeTitles.length; i++ ) {
      $scope.details.push( {
        title: podcast.episodeTitles[i]
        , description: podcast.episodeDescriptions[i]
        , url: podcast.episodeUrls[i]
      } );
    }
  };

  $scope.subscribeToPodcast = () => {
    console.log( "subscribeToPodcast fired" );
    $("p.pm-subscribed-alert").attr("id", "pm-subscribed");
    $timeout( function() {
      $("p.pm-subscribed-alert").attr("id", "");
    }, 1500);
    for ( let i = 0; i < $scope.podcasts.length; i++ ) {
      if ( $scope.podcasts[i].title === $scope.detailsPodcastTitle && $scope.podcasts[i].artwork === $scope.detailsPodcastArtwork && $scope.podcasts[i].description === $scope.detailsPodcastDescription ) {
        moreFcty.sendPodcastToMongoDb( $scope.podcasts[i] );
      }
    }
  };

  init();

}


export default moreCtrl;
