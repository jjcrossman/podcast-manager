import PodcastGridTmpl from "./podcastgrid-tmpl.html";
import PodcastGridCtrl from "./podcastgridCtrl.js";

function PodcastGrid() {
  return {
    template: PodcastGridTmpl
    , restrict: "E"
    , scope: {
      podcasts: "="
      , populateDetails: "="
      , detailsPodcastTitle: "="
      , detailsPodcastArtwork: "="
      , detailsPodcastDescription: "="
      , details: "="
      , subscribeToPodcast: "="
      , flushDetails: "="
      , toggleEpisodeCard: "="
      , cardTitle: "="
      , cardDescription: "="
      , playEpisode: "="
    }
    , link: function( scope, elem, attr, ctrl ) {


    }
    , controller: PodcastGridCtrl
  }
}

export default PodcastGrid;
