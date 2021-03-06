function moreCtrl( $scope, $timeout, moreFcty ) {

  function init() {
    $scope.showSearchBar = true;
    moreFcty.getUserAvatar()
      .then( userAvatar => {
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
    $timeout( function(){ $scope.whichView = "pm-more-bar"; }, 1 );
    $scope.podcasts = [];
    $scope.details = [];
    $scope.alreadySubscribed = [];
    moreFcty.getUserPodcastsFromDb()
      .then( podcasts => {
        for (var i = 0; i < podcasts.length; i++) {
          $scope.alreadySubscribed.push( podcasts[i] );
        }
      } )
      .catch( error => {
        console.log( "mineCtrl error:", error );
      } );
    $scope.episodeToPlay = "";
    $scope.playerArtwork = "./src/features/images/noArtwork.png";
    $scope.playerEpisodeTitle = "";
    $scope.playerPodcastTitle = "";
    $scope.expansionNeedsDetail = "";
  }

  $scope.$watch( "details", () => {
    if ( parseInt( $(".mm.videogular-container-wrapper").css("height") ) >= 1 ) {
      $timeout( () => {
        $(".mm.pm-episodes-li").css("transition-duration", ".2s");
      }, 1 );
      $timeout( () => {
        $(".mm.pm-episodes-li").css("height", "19%");
      }, 2 );
    }
  }, true );

  $scope.searchItunes = ( searchTerm ) => {
    console.log( "Searching ITUNES" );
    $scope.podcasts = [];
    $scope.details = [];
    moreFcty.searchItunes( searchTerm )
      .then( data => {
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

  $scope.retrieveRSSFeedInformation = feed  => {
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
    // check database for existing podcast
    // if it's there, rotate +
    for ( let j = 0; j < $scope.alreadySubscribed.length; j++ ) {
      if ( $scope.alreadySubscribed[j].feed === podcast.feed ) {
        console.log( "Already subscribed: ", !!podcast );
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
        , artwork: podcast.artwork
        , podcastTitle: podcast.title
        , sourceFeed: podcast.feed
      } );
    }
  };

  $scope.flushDetails = () => {
    $timeout( function() {
        $scope.details = [];
      }, 500);
    if ( $(".mm.pm-episode-card").attr( "id" ) === "pm-show-episode-card" ) {
      $(".row.mm.pm-details-episodes-list").css( "overflow", "scroll" );
      $(".mm.pm-episode-card").css( "opacity", "0" );
      $timeout( function() {
        $(".mm.pm-episode-card").attr( "id", "" );
      }, 300 );
    }
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
        for ( let i = 0; i < podcasts.length; i++ ) {
          if ( podcasts[i].title === $scope.detailsPodcastTitle && podcasts[i].description === $scope.detailsPodcastDescription && podcasts[i].artwork === $scope.detailsPodcastArtwork ) {
            $scope.saveForPossibleResubscribe = podcasts[i];
            moreFcty.removePodcastFromUser( podcasts[i] )
            .then( res => {
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
    $scope.expansionNeedsDetail = detail;
    if ( $scope.cardDescription === "" ) {
      $scope.cardDescription = "This episode's description could not be retrieved."
    }

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

  $scope.togglePlayerBar = () => {
    if ( $(".mm.videogular-container-wrapper").css("height") === "0px" ) {
      $(".mm.videogular-container-wrapper").css("height", "21vh");
      $(".mm.pm-vg-controls").css("height", "50px");
      $(".mm#pm-podcast-grid").css("height", "68vh");
      $(".mm.pm-podcast-grid-square").css("height", "38%");
      $(".mm.pm-details-episodes-list").css("height", "57%");
      $(".mm.pm-episodes-li").css("height", "19%");
      $(".mm.pm-episode-card").css("height", "42.1vh");
    }
  };

  $scope.playEpisode = detail => {

    if ( !detail ) {
      detail = $scope.expansionNeedsDetail;
    }

    $scope.togglePlayerBar();

    $scope.episodeToPlay = {
      title: detail.title
      , podcastTitle: detail.podcastTitle
      , podcastArtwork: detail.artwork
      , url: detail.url
      , type: "audio/mp3"
    };


    $scope.playerArtwork = detail.artwork;
    $scope.playerEpisodeTitle = detail.title;
    $scope.playerPodcastTitle = detail.podcastTitle;
    if ( $scope.playerEpisodeTitle.length > 60 ) {
      $scope.playerEpisodeTitle = $scope.playerEpisodeTitle.slice( 0, 60 ) + "...";
    }
    if ( $scope.playerPodcastTitle.length > 24 ) {
      $scope.playerPodcastTitle = $scope.playerPodcastTitle.slice( 0, 24 ) + "...";
    }

  $scope.playerBarReady();

  };

  init();

}


export default moreCtrl;
