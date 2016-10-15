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

  init();

}

export default mineCtrl;
