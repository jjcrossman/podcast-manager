// AngularJS, UI-Router, jQuery
import angular from "angular";
import uiRouter from "angular-ui-router";
import "../../node_modules/jquery/dist/jquery.js"


// Styles
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
import moreCtrl from "./views/controllers/moreCtrl.js";

// Factories
import moreFcty from "./views/factories/moreFcty.js";
import mineFcty from "./views/factories/mineFcty.js";
import loginFcty from "./views/factories/loginFcty.js";

// Directives
import HeaderBar from "./features/HeaderBar/HeaderBar.js";
import PlayerBar from "./features/PlayerBar/PlayerBar.js";
import MineMoreBar from "./features/MineMoreBar/MineMoreBar.js";
import PodcastGrid from "./features/PodcastGrid/PodcastGrid.js";
import LoginBox from "./features/LoginBox/LoginBox.js";

/*******************************************************/

// App
angular.module( 'PodcastManager', [ uiRouter ] )

// Controllers
.controller( "loginCtrl", loginCtrl )
.controller( "mineCtrl", mineCtrl )
.controller( "moreCtrl", moreCtrl )
// Factories
.factory( "moreFcty", moreFcty )
.factory( "mineFcty", mineFcty )
.factory( "loginFcty", loginFcty )

// Directives
.directive( "headerBar", HeaderBar )
.directive( "playerBar", PlayerBar )
.directive( "mineMoreBar", MineMoreBar )
.directive( "podcastGrid", PodcastGrid )
.directive( "loginBox", LoginBox )

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
    } )
    .state( "more", {
      url: "/more"
      , template: minemoreTmpl
      , controller: "moreCtrl"
    } );

} );
