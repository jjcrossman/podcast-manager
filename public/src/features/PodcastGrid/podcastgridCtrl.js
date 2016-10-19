import "../../../../node_modules/jquery/dist/jquery.js";

function podcastgridCtrl( $scope ) {
  function init() {
    $scope.showCard = "";
  }

  $scope.toggleEpisodeCard = () => {
    console.log( "toggleEpisodeCard fired" );
    if ( $scope.showCard ) {
      $scope.showCard = "";
    } else {
      $scope.showCard = "pm-li-active";
    }
  };

  $scope.hideEpisodeCard = () => {
    console.log( "hideEpisodeCard fired" );
    if ( $scope.showCard ) {
      $scope.showCard = "";
    }
  };

  init();
}

export default podcastgridCtrl;
