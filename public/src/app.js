// AngularJS, UI-Router
import angular from "angular";
import uiRouter from "angular-ui-router";


// Styles
import "../styles/bootstrap/css/bootstrap.css";
import "../styles/sass/directory.sass";

// Templates
import loginTmpl from "./views/templates/login-tmpl.html";

// Controllers
import loginCtrl from "./views/controllers/loginCtrl.js";

// Factories

// Directives
import Player from "./features/Player/Player.js";

/*******************************************************/

// App
angular.module( 'PodcastManager', [ uiRouter ] )

// Controllers
.controller( "loginCtrl", loginCtrl )
// Factories

// Directives
.directive( "player", Player )

.config( function ( $stateProvider, $urlRouterProvider ) {

  $urlRouterProvider.otherwise( "/" );

  $stateProvider
    .state( "login", {
      url: "/"
      , template: loginTmpl
      , controller: "loginCtrl"
    } );

} );
