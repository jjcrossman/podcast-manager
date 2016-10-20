import videogularTheme from "videogular-themes-default";

export default function playerbarCtrl( $scope, $sce ) {
    this.currentTime = 0;
    this.totalTime = 0;
    this.state = null;
    this.volume = 1;
    this.isCompleted = false;
    this.API = null;
    this.onPlayerReady = function ( API ) {
      console.log( "PLAYER API IS READY" );
            this.API = API;
    };

    this.onError = function (event) {
            console.log("VIDEOGULAR ERROR EVENT");
            console.log(event);
    };

    this.onCompleteVideo = function () {
        this.isCompleted = true;
    };

    this.onUpdateState = function (state) {
        this.state = state;
    };

    this.onUpdateTime = function (currentTime, totalTime) {
        this.currentTime = currentTime;
        this.totalTime = totalTime;
    };

    this.onUpdateVolume = function (newVol) {
        this.volume = newVol;
    };

    this.config = {
        crossorigin: "anonymous"
        , playsInline: false
        , sources: ""
        , theme: videogularTheme
        , autoHide: true
        , autoHideTime: 5000
        , autoPlay: true
        , loop: false
        , preload: "auto"
        , controls: false
        , plugins: {
        }
    };

    this.playerBarReady = () => {
      this.config.sources = [ {
        src: $sce.trustAsResourceUrl( $scope.episodeToPlay.url )
        , type: "audio/mp3"
      } ];
      console.log( "playerBarReady fired", this.config );
    };


};
