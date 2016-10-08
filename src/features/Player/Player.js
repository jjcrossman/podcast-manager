import PlayerTmpl from "./player-tmpl.html";
import PlayerCtrl from "./playerCtrl.js";

function Player() {
  return {
    template: PlayerTmpl
    , restrict: "E"
    , scope: {

    }
    , link: function( scope, elem, attr, ctrl ) {


    }
    , controller: PlayerCtrl
  }
}

export default Player;
