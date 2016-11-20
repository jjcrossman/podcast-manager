import HeaderBarTmpl from "./headerbar-tmpl.html";
import HeaderBarCtrl from "./headerbarCtrl.js";

function HeaderBar() {
  return {
    template: HeaderBarTmpl
    , restrict: "E"
    , scope: {
        whichView: "="
        , userAvatar: "="
        , toggleDropDown: "="
    }
    , link: function( scope, elem, attr, ctrl ) {


    }
    , controller: HeaderBarCtrl
  }
}

export default HeaderBar;
