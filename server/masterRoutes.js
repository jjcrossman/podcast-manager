const userRoutes = require( "./features/user/userRoutes.js" );
const podcastRoutes = require( "./features/podcast/podcastRoutes.js" );
const episodeRoutes = require( "./features/episode/episodeRoutes.js" );
const authRoutes = require( "./features/authentication/authRoutes.js" );

module.exports = app => {
  userRoutes( app );
  podcastRoutes( app );
  episodeRoutes( app );
  authRoutes( app );
};
