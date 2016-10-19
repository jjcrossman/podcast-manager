module.exports = {
  getFacebookUserData( req, res ) {

    res.status( 200 ).json( req.user );
  }
};
