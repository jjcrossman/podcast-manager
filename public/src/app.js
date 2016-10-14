// AngularJS, UI-Router, Angular-Material
import angular from "angular";
import uiRouter from "angular-ui-router";
// import ngAria from "angular-aria";
// import ngAnimate from "angular-animate";
// import ngMaterial from "angular-material";


// Styles
// import "../styles/ngMaterial/angular-material.css";
import "font-awesome-webpack";
import "../styles/bootstrap/css/bootstrap.css";
import "../styles/bootstrap/css/bootstrap-theme.css";
import "../styles/bootstrap/js/bootstrap.js";
import "../styles/sass/directory.sass";

// Templates
import loginTmpl from "./views/templates/login-tmpl.html";
import minemoreTmpl from "./views/templates/minemore-tmpl.html"

// Controllers
import loginCtrl from "./views/controllers/loginCtrl.js";
import mineCtrl from "./views/controllers/mineCtrl.js";

// Factories

// Directives
import Header from "./features/Header/Header.js";
import Player from "./features/Player/Player.js";

/*******************************************************/

// App
angular.module( 'PodcastManager', [ uiRouter ] )

// Controllers
.controller( "loginCtrl", loginCtrl )
.controller( "mineCtrl", mineCtrl )
// Factories

// Directives
.directive( "header", Header )
.directive( "player", Player )

.config( function ( $stateProvider, $urlRouterProvider ) {

  $urlRouterProvider.otherwise( "/" );

  $stateProvider
    .state( "login", {
      url: "/"
      , template: loginTmpl
      , controller: "loginCtrl"
    } )
    .state( "mine", {
      url: "/mine"
      , template: minemoreTmpl
      , controller: "mineCtrl"
    } );

} );
