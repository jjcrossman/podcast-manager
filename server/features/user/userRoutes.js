const userCtrl = require( "./userCtrl.js" );

module.exports = app => {

  app.route( "/api/user" )
    .get( userCtrl.getUsers )
    .post( userCtrl.addNewUser );
  app.route( "/api/user/avatar" )
    .get( userCtrl.getUserAvatar );

};
