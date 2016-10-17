function moreCtrl( $scope, $timeout, moreFcty ) {

  function init() {
    $scope.activeLi = "";
    $scope.searchTerm = "";
    $scope.whichView = "pm-mine-bar";
    $timeout( function(){$scope.whichView = "pm-more-bar";}, 1);
    $scope.podcasts = [];
  }

  $scope.searchItunes = ( searchTerm ) => {
    console.log( "moreCtrl fired search fn" );
    moreFcty.searchItunes( searchTerm )
      .then( data => {
        console.log( "Promise fulfilled in moreCtrl" );
        console.log( data );
        if ( data ) {
          for ( let i = 0; i < data.podcastTitles.length; i++ ) {
            $scope.podcasts.push( {
              title: data.podcastTitles[i]
              , feed: data.podcastFeeds[i]
              , artwork: data.podcastArtworks[i]
            } );
            if ( $scope.podcasts[i].title.length > 50 ) {
              $scope.podcasts[i].title = $scope.podcasts[i].title.slice(0, 50) + "...";
            }
          }
          console.log( $scope.podcasts );
          return;
        } else {
          console.log( "No data returned to moreCtrl" );
        }
      } )
      .catch( error => {
        console.log( `Error in moreCtrl: ${ error }` );
      } );
  }

  $scope.populateDetails = ( podcast ) => {
    console.log( "populateDetails fired" );
    console.log( podcast );
    $scope.detailsPodcastTitle = podcast.title;
    $scope.detailsPodcastArtwork = podcast.artwork;
    // Search the podcast's XML RSS feed for description, episode titles and descriptions, and durations.
  };

  init();

}


export default moreCtrl;
