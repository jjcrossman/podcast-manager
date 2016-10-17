function mineCtrl( $scope, $timeout ) {

  function init(){
    $scope.searchTerm = "";
    $scope.whichView = "pm-more-bar";
    $timeout( function(){$scope.whichView = "pm-mine-bar";}, 1);
  }

  init();



}

export default mineCtrl;
