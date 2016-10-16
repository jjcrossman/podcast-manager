function mineCtrl( $scope ) {

  function init() {
    $scope.activeLi = "";
  }

  $scope.toggleActiveLi = () => {
    console.log( "toggleActiveLi fired" );
    if ( $scope.activeLi ) {
      $scope.activeLi = "";
      console.log( "pass" );
    } else {
      $scope.activeLi = "pm-li-active";
    }
  };

  $scope.closeDescriptionAndLi = () => {
    console.log( "closeDescriptionAndLi fired" );
    if ( $scope.activeLi ) {
      console.log( "passed" );
      $scope.activeLi = "";
    }
  };

  init();

}

export default mineCtrl;
