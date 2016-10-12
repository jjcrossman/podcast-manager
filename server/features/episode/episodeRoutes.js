const episodeCtrl = require( "./episodeCtrl.js" );

module.exports = app => {
  app.route( "/api/episode" )
    .get( episodeCtrl.getEpisodes )
    .post( episodeCtrl.addEpisode );
};
