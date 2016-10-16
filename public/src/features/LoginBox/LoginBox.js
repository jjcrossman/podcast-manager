import LoginBoxTmpl from "./loginbox-tmpl.html";
import LoginBoxCtrl from "./loginboxCtrl.js";

function LoginBox() {
  return {
    template: LoginBoxTmpl
    , restrict: "E"
    , scope: {

    }
    , link: function( scope, elem, attr, ctrl ) {


    }
    , controller: LoginBoxCtrl
  }
}

export default LoginBox;
