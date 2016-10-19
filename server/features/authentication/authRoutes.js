const authCtrl = require( "./authCtrl.js" );

module.exports = app => {
  app.route( "/api/auth" )
    .get( authCtrl.getFacebookUserData );
};
