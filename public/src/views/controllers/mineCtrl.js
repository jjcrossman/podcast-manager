function mineCtrl( $scope, $timeout, mineFcty ) {

  function init() {
    $scope.userAvatar = "";
    mineFcty.getUserData()
      .then( userObj => {
        console.log( "mineCtrl received:", userObj );
        $scope.userAvatar = userObj.avatar;
        console.log( userObj.newUser );
        if ( !userObj.avatar ) {
          $(".pm-noavatar-icon").css("display", "inline-block");
        }
        if ( !userObj.newUser ) {
          console.log( "getUserPodcastsFromDb fired in init" );
          $scope.getUserPodcastsFromDb();
        }
        if ( userObj.newUser ) {
          $scope.addNewUser( userObj );
        }
      } )
      .catch( err => {
        console.log( "Error getting user's data:", err );
      } );
    $scope.searchTerm = "";
    $scope.whichView = "pm-more-bar";
    $timeout( function(){$scope.whichView = "pm-mine-bar";}, 1);
    $scope.podcasts = [];
    $scope.details = [];
    $scope.detailsPodcastTitle = "";
    $scope.detailsPodcastArtwork = "";
    $scope.detailsPodcastDescription = "";
    $scope.saveForPossibleResubscribe = {};
    $scope.cardTitle = "";
    $scope.cardDescription = "";
    $scope.episodeToPlay = "";
    $scope.playerArtwork = "./images/noArtwork.png";
    $scope.playerEpisodeTitle = "";
    $scope.playerPodcastTitle = "";
  }

  $scope.getUserPodcastsFromDb = () => {
    mineFcty.getUserPodcastsFromDb()
      .then( podcasts => {
        console.log( "mine line 40", podcasts );
          $scope.podcasts = [];
        for (var i = 0; i < podcasts.length; i++) {
          $scope.podcasts.push( podcasts[i] );
        }
        console.log( "mine line 45", $scope.podcasts );
      } )
      .catch( error => {
        console.log( "mineCtrl error:", error );
      } );
  }

  $scope.addNewUser = ( newUser ) => {

    mineFcty.addNewUser( newUser )
      .then( madeNewUser => {
        console.log( "mineCtrl 52", madeNewUser );
      } )
      .catch( err => {
        console.log( "mineCtrl 55", err );
      } );

  };

  $scope.populateDetails = ( podcast ) => {
    $scope.setSubscribeStatus();
    $scope.detailsPodcastTitle = podcast.title;
    $scope.detailsPodcastArtwork = podcast.artwork;
    $scope.detailsPodcastDescription = podcast.description;
    mineFcty.retrieveRSSFeedInformation( podcast.feed )
    .then( data => {
      console.log( "RSS feed data in mineCtrl", data );
      for ( let i = 0; i < $scope.podcasts.length; i++ ) {
        if ( $scope.podcasts[i].feed === data.feed ) {

          $scope.podcasts[i].episodeTitles = data.episodeTitles;
          $scope.podcasts[i].episodeDescriptions = data.episodeDescriptions;
          $scope.podcasts[i].episodeUrls = data.episodeUrls;
          for ( let j = 0; j < $scope.podcasts[i].episodeTitles.length; j++ ) {
            $scope.details.push( {
              title: $scope.podcasts[i].episodeTitles[j]
              , description: $scope.podcasts[i].episodeDescriptions[j]
              , url: $scope.podcasts[i].episodeUrls[j]
              , artwork: $scope.podcasts[i].artwork
              , podcastTitle: $scope.podcasts[i].title
              , sourceFeed: $scope.podcasts[i].feed
            } );
          }
        }
      }
      $scope.$apply();

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
          mineFcty.removePodcastFromUser( $scope.podcasts[i] )
          .then( res => {
            console.log( "remove from database" );
            $scope.getUserPodcastsFromDb();
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
          mineFcty.attachPodcastToUser( $scope.saveForPossibleResubscribe )
            .then( res => {
              $scope.getUserPodcastsFromDb();
            } )
            .catch( err => {
              console.log( err );
            } );
    }
  }

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


  $scope.playEpisode = detail => {

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
    if ( $scope.playerEpisodeTitle.length > 43 ) {
      $scope.playerEpisodeTitle = $scope.playerEpisodeTitle.slice( 0, 43 ) + "...";
    }
    if ( $scope.playerPodcastTitle.length > 59 ) {
      $scope.playerPodcastTitle = $scope.playerPodcastTitle.slice( 0, 59 ) + "...";
    }

  console.log( "playEpisode fired", $scope.episodeToPlay );
  $scope.playerBarReady();

  };

  init();



}

export default mineCtrl;
