function moreCtrl( $scope, $timeout, moreFcty ) {

  function init() {
    moreFcty.getUserAvatar()
      .then( userAvatar => {
        console.log( "moreCtrl received:", userAvatar );
        $scope.userAvatar = userAvatar;
        if ( !userAvatar ) {
          $(".pm-noavatar-icon").css("display", "inline-block");
        }
      } )
      .catch( err => {
        console.log( "Error getting user's data:", err );
      } );
    $scope.searchTerm = "";
    $scope.whichView = "pm-mine-bar";
    $timeout( function(){$scope.whichView = "pm-more-bar";}, 1);
    $scope.podcasts = [];
    $scope.details = [];
    $scope.alreadySubscribed = [];
    moreFcty.getUserPodcastsFromDb()
      .then( podcasts => {
        console.log( "mineCtrl caught:", podcasts );
        for (var i = 0; i < podcasts.length; i++) {
          $scope.alreadySubscribed.push( podcasts[i] );
        }
      } )
      .catch( error => {
        console.log( "mineCtrl error:", error );
      } );
  }

  $scope.searchItunes = ( searchTerm ) => {
    $scope.podcasts = [];
    $scope.details = [];
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
    console.log( "populateDetails fired", podcast );
    // check database for existing podcast
    // if it's there, rotate +
    for ( let j = 0; j < $scope.alreadySubscribed.length; j++ ) {
      if ( $scope.alreadySubscribed[j].feed === podcast.feed ) {
        console.log( `Already subscribed to: ${ podcast.title }` );
        $("#pm-subscribe-button").attr("class", "fa fa-plus mm pm-rotate");
        break;
      }
      if ( j === $scope.alreadySubscribed.length - 1 ) {
        $("#pm-subscribe-button").attr("class", "fa fa-plus mm");
        console.log( `Not already subscribed to: ${ podcast.title }` );
      }
    }
    $scope.detailsPodcastTitle = podcast.title;
    $scope.detailsPodcastArtwork = podcast.artwork;
    $scope.detailsPodcastDescription = podcast.description;
    for ( let i = 0; i < podcast.episodeTitles.length; i++ ) {
      $scope.details.push( {
        title: podcast.episodeTitles[i]
        , description: podcast.episodeDescriptions[i]
        , url: podcast.episodeUrls[i]
        , sourceFeed: podcast.feed
      } );
    }
  };

  $scope.flushDetails = () => {
    $timeout( function() {
        $scope.details = [];
        console.log( "details flushed", $scope.details );
      }, 500);
  };

  $scope.subscribeToPodcast = () => {

    if ( $("#pm-subscribe-button").attr("class") === "fa fa-plus mm pm-rotate" ) {
      $("#pm-subscribe-button").attr("class", "fa fa-plus mm");
      $("p.pm-unsubscribed-alert").attr("id", "pm-subscribed");
      $timeout( function() {
        $("p.pm-unsubscribed-alert").attr("id", "");
      }, 1500);
      moreFcty.getUserPodcastsFromDb()
      .then( podcasts => {
        console.log( "moreCtrl line 115",podcasts );
        for ( let i = 0; i < podcasts.length; i++ ) {
          if ( podcasts[i].title === $scope.detailsPodcastTitle && podcasts[i].description === $scope.detailsPodcastDescription && podcasts[i].artwork === $scope.detailsPodcastArtwork ) {
            $scope.saveForPossibleResubscribe = podcasts[i];
            moreFcty.removePodcastFromUser( podcasts[i] )
            .then( res => {
              console.log( "moreCtrl line 132", res );
            } )
            .catch( err => {
              console.log( err );
            } );
          }
        }
      } )
      .catch( err => {
        console.log( err );
      } );
    } else {
      console.log( "subscribeToPodcast fired" );
      $("p.pm-subscribed-alert").attr("id", "pm-subscribed");
      $("#pm-subscribe-button").attr("class", "fa fa-plus mm pm-rotate");
      $timeout( function() {
        $("p.pm-subscribed-alert").attr("id", "");
      }, 1500);
      for ( let i = 0; i < $scope.podcasts.length; i++ ) {
        if ( $scope.podcasts[i].title === $scope.detailsPodcastTitle && $scope.podcasts[i].artwork === $scope.detailsPodcastArtwork && $scope.podcasts[i].description === $scope.detailsPodcastDescription ) {
          $scope.alreadySubscribed.push( $scope.podcasts[i] );
          moreFcty.attachPodcastToUser( $scope.podcasts[i] );
        }
      }
    }
  };

  $scope.toggleEpisodeCard = ( detail ) => {
    console.log( "toggleEpisodeCard was fired", detail );
    if ( $(".mm.pm-episode-card").attr( "id" ) === "pm-show-episode-card" ) {
      $(".row.mm.pm-details-episodes-list").css( "overflow", "scroll" );
      $(".mm.pm-episode-card").css( "opacity", "0" );
      $timeout( function() {
        $(".mm.pm-episode-card").attr( "id", "" );
      }, 300 );
      return;
    } else {
    $(".row.mm.pm-details-episodes-list").css( "overflow", "hidden" );
    $(".mm.pm-episode-card").attr( "id", "pm-show-episode-card" );
    $timeout( function() {
      $(".mm.pm-episode-card").css( "opacity", "1" );
    }, 50 );
    }
    $scope.cardTitle = detail.title;
    $scope.cardDescription = detail.description;
    if ( $scope.cardDescription === "" ) {
      $scope.cardDescription = "This episode's description could not be retrieved."
    }
    //
    console.log( "cardTitle and cardDescription", $scope.cardTitle, $scope.cardDescription );

  };

  $scope.toggleDropDown = () => {

    if ( $(".pm-user-avatar-dropdown").attr("id") === "pm-dropdown-show" ) {
        $(".pm-user-avatar-dropdown").attr("id", "");
      $timeout( function() {
        $(".pm-user-avatar-dropdown").css("display", "none");
      }, 300);
    } else {
      $(".pm-user-avatar-dropdown").css("display", "block");
      $timeout( function() {
        $(".pm-user-avatar-dropdown").attr("id", "pm-dropdown-show");
      }, 50);
    }
  };

  init();

}


export default moreCtrl;
