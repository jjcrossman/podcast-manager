function mineCtrl( $scope, $timeout, mineFcty ) {

  function init() {
    $scope.searchTerm = "";
    $scope.whichView = "pm-more-bar";
    $timeout( function(){$scope.whichView = "pm-mine-bar";}, 1);
    $scope.podcasts = [];
    $scope.details = [];
    mineFcty.getPodcastsFromDb()
      .then( podcasts => {
        for (var i = 0; i < podcasts.length; i++) {
          $scope.podcasts.push( podcasts[i] );
        }
      } )
      .catch( error => {
        console.log( "mineCtrl error:", error );
      } );
    $scope.detailsPodcastTitle = "";
    $scope.detailsPodcastArtwork = "";
    $scope.detailsPodcastDescription = "";
    $scope.saveForPossibleResubscribe = {};
  }

  $scope.getPodcastsFromDb = () => {
    mineFcty.getPodcastsFromDb()
      .then( podcasts => {
          $scope.podcasts = [];
        for (var i = 0; i < podcasts.length; i++) {
          $scope.podcasts.push( podcasts[i] );
        }
      } )
      .catch( error => {
        console.log( "mineCtrl error:", error );
      } );
  }


  $scope.populateDetails = ( podcast ) => {
    console.log( "populateDetails fired", podcast );
    $scope.setSubscribeStatus();
    $scope.detailsPodcastTitle = podcast.title;
    $scope.detailsPodcastArtwork = podcast.artwork;
    $scope.detailsPodcastDescription = podcast.description;
    // Reed RSS Feed and populate episode list()
    $scope.retrieveRSSFeedInformation( podcast );
  };

  $scope.retrieveRSSFeedInformation = ( podcast ) => {

      mineFcty.retrieveRSSFeedInformation( podcast.feed )
      .then( data => {
        console.log( "RSS feed data in mineCtrl", data );
        for ( let i = 0; i < $scope.podcasts.length; i++ ) {
          if ( $scope.podcasts[i].feed === data.feed ) {
            $scope.podcasts[i].episodeTitles = data.episodeTitles;
            $scope.podcasts[i].episodeDescriptions = data.episodeDescriptions;
            $scope.podcasts[i].episodeUrls = data.episodeUrls;
          }
        }
        for ( let i = 0; i < podcast.episodeTitles.length; i++ ) {
          $scope.details.push( {
            title: data.episodeTitles
            , description: data.episodeDescriptions
            , url: data.episodeUrls
            , sourceFeed: data.feed
          } );
        }
        console.log( "SCOPE DETAILS", $scope.details );
      } )
      .catch( error => {
        console.log( "Error in moreCtrl", error );
      } );
    };

  $scope.flushDetails = () => {
    $timeout( function() {
        $scope.details = [];
        console.log( "details flushed", $scope.details );
      }, 500);
  };

  $scope.setSubscribeStatus = () => {
    console.log( "setSubscribedStatus" );
    $("#pm-subscribe-button").attr("class", "fa fa-plus mm pm-rotate");
  };

  $scope.subscribeToPodcast = () => {

    if ( $("#pm-subscribe-button").attr("class") === "fa fa-plus mm pm-rotate" ) {
      // UNsubscribe
      $("#pm-subscribe-button").attr("class", "fa fa-plus mm");
      $("p.pm-unsubscribed-alert").attr("id", "pm-subscribed");
      $timeout( function() {
        $("p.pm-unsubscribed-alert").attr("id", "");
      }, 1500);
      for ( let i = 0; i < $scope.podcasts.length; i++ ) {
        if ( $scope.podcasts[i].title === $scope.detailsPodcastTitle && $scope.podcasts[i].description === $scope.detailsPodcastDescription && $scope.podcasts[i].artwork === $scope.detailsPodcastArtwork ) {
          $scope.saveForPossibleResubscribe = $scope.podcasts[i];
          mineFcty.removePodcast( $scope.podcasts[i] )
          .then( res => {
            console.log( "remove from database" );
            $scope.getPodcastsFromDb();
          } )
          .catch( err => {
            console.log( err );
          } );
        }
      }
    } else {
      // SUBscribe
      $("p.pm-subscribed-alert").attr("id", "pm-subscribed");
      $timeout( function() {
        $("p.pm-subscribed-alert").attr("id", "");
      }, 1500);
      $("#pm-subscribe-button").attr("class", "fa fa-plus mm pm-rotate");
          mineFcty.sendPodcastToMongoDb( $scope.saveForPossibleResubscribe )
            .then( res => {
              $scope.getPodcastsFromDb();
            } )
            .catch( err => {
              console.log( err );
            } );
    }
  }

  $scope.toggleEpisodeCard = detail => {
    console.log( "toggleEpisodeCard was fired" );
  };




  init();



}

export default mineCtrl;
