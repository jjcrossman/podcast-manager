import HeaderTmpl from "./header-tmpl.html";
import HeaderCtrl from "./headerCtrl.js";

function Player() {
  return {
    template: HeaderTmpl
    , restrict: "E"
    , scope: {

    }
    , link: function( scope, elem, attr, ctrl ) {


    }
    , controller: HeaderCtrl
  }
}

export default Player;
