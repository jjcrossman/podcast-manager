import MineMoreBarTmpl from "./minemorebar-tmpl.html";
import MineMoreBarCtrl from "./minemorebarCtrl.js";

function MineMoreBar() {
  return {
    template: MineMoreBarTmpl
    , restrict: "E"
    , scope: {
        whichView: "="
    }
    , link: function( scope, elem, attr, ctrl ) {


    }
    , controller: MineMoreBarCtrl
  }
}

export default MineMoreBar;
