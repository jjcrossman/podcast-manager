const podcastCtrl = require( "./podcastCtrl.js" );

module.exports = app => {
  app.route( "/api/podcast" )
    .get( podcastCtrl.getUserPodcasts )
    .post( podcastCtrl.attachPodcastToUser );
  app.route( "/api/podcast/:id")
    .delete( podcastCtrl.removePodcastFromUser );
  app.route( "/api/itunes" )
    .post( podcastCtrl.queryItunes );
  app.route( "/api/rss" )
    .post( podcastCtrl.queryRss );
};
