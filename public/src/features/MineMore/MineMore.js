import MineMoreTmpl from "./minemore-tmpl.html";
import minemoreCtrl from "./minemoreCtrl.js";

function Player() {
  return {
    template: MineMoreTmpl
    , restrict: "E"
    , scope: {

    }
    , link: function( scope, elem, attr, ctrl ) {


    }
    , controller: minemoreCtrl
  }
}

export default Player;
