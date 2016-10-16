import PlayerBarTmpl from "./playerbar-tmpl.html";
import PlayerBarCtrl from "./playerbarCtrl.js";

function PlayerBar() {
  return {
    template: PlayerBarTmpl
    , restrict: "E"
    , scope: {

    }
    , link: function( scope, elem, attr, ctrl ) {


    }
    , controller: PlayerBarCtrl
  }
}

export default PlayerBar;
