import PlayerBarTmpl from "./playerbar-tmpl.html";
import PlayerBarCtrl from "./playerbarCtrl.js";

function PlayerBar() {

  return {
    template: PlayerBarTmpl
    , restrict: "E"
    , scope: true
    , bindToController: {
      episodeToPlay: "="
      , playerBarReady: "="
      , playerArtwork: "="
      , playerEpisodeTitle: "="
      , playerPodcastTitle: "="
    }
    , link: function( scope, elem, attr, ctrl ) {


    }
    , controller: PlayerBarCtrl
    , controllerAs: "ctrl"
  };

}

export default PlayerBar;
