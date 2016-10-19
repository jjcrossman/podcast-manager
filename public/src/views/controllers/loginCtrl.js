function loginCtrl( $scope, loginFcty ) {


  $scope.loginFacebook = () => {
    window.location.assign( "auth/facebook" );
  };

}

export default loginCtrl;
