const podcastCtrl = require( "./podcastCtrl.js" );

module.exports = app => {
  app.route( "/api/podcast" )
    .get( podcastCtrl.getPodcasts )
    .post( podcastCtrl.addPodcast );
  app.route( "/api/podcast/:id")
    .delete( podcastCtrl.removePodcast );
};
