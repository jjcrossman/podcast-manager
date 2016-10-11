// AngularJS, UI-Router
import angular from "angular";
import uiRouter from "angular-ui-router";


// Styles
import "../styles/directory.sass";
import "../styles/bootstrap/css/bootstrap.css";

// Templates
import loginTmpl from "./routes/templates/login-tmpl.html";

// Controllers
import loginCtrl from "./routes/controllers/loginCtrl.js";

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
