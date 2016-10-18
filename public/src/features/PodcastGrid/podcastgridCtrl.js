import "../../../../node_modules/jquery/dist/jquery.js";

function podcastgridCtrl( $scope ) {
  function init() {
    $scope.activeLi = "";
  }

  $scope.toggleActiveLi = () => {
    console.log( "toggleActiveLi fired" );
    if ( $scope.activeLi ) {
      $scope.activeLi = "";
    } else {
      $scope.activeLi = "pm-li-active";
    }
  };

  $scope.closeDescriptionAndLi = () => {
    console.log( "closeDescriptionAndLi fired" );
    if ( $scope.activeLi ) {
      $scope.activeLi = "";
    }
  };

  init();
}

export default podcastgridCtrl;
