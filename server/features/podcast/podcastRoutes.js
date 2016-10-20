const podcastCtrl = require( "./podcastCtrl.js" );

module.exports = app => {
  app.route( "/api/podcast" )
    .get( podcastCtrl.getUserPodcasts )
    .post( podcastCtrl.addPodcast );
  app.route( "/api/podcast/:id")
    .delete( podcastCtrl.removePodcast );
};
