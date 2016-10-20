import videogularTheme from "videogular-themes-default";

export default function playerbarCtrl( $scope, $sce ) {
    this.config = {
        sources: [ {
            src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
            type: "video/mp4"
        }
        , {
            src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
            type: "video/webm"
        }
        , {
            src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
            type: "video/ogg"
        } ]
        , tracks: [ {
            src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt"
            , kind: "subtitles"
            , srclang: "en"
            , label: "English"
            , default: ""
        } ]
        , theme: videogularTheme
        , plugins: {
        }
    };

};
