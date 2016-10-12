const userRoutes = require( "./features/user/userRoutes.js" );
const podcastRoutes = require( "./features/podcast/podcastRoutes.js" );
const episodeRoutes = require( "./features/episode/episodeRoutes.js" );

module.exports = app => {
  userRoutes( app );
  podcastRoutes( app );
  episodeRoutes( app );
};
