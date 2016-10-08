// Angular, ui-router
import angular from "angular";
import uiRouter from "angular-ui-router";

// Styles
import "./pmStyles.css";

// Templates
import loginTmpl from "./routes/templates/inbox-tmpl.html"

// Controllers
import loginCtrl from "./routes/controllers/inboxCtrl.js";

//Factories

// App
angular.module( 'PodcastManager', [ uiRouter ] )

.controller( "loginCtrl", loginCtrl )

.config( function ( $stateProvider, $urlRouterProvider ) {

  $urlRouterProvider.otherwise( "/" );

  $stateProvider
    .state( "login", {
      url: "/"
      , template: loginTmpl
      , controller: "loginCtrl"
    } );

} );
