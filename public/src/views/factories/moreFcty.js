function moreFcty ( $http, $q ) {

  let itunesSearchUrl = "https://itunes.apple.com/search?term=";
  let itunesSearchQuery = "";
  let itunesSearchParameters = "&country=us&media=podcast&entity=podcast&limit=10";

  return {

    searchItunes( searchTerm ) {
      itunesSearchQuery = searchTerm;
      return $http.get( `${ itunesSearchUrl }${ itunesSearchQuery }${ itunesSearchParameters }` ).then( res => {
          console.log( res );
        if ( res.data.resultCount && res.data.resultCount !== 0 ) {
          console.log( `Results retrieved from iTunes: ${ res.data.resultCount }` );
          let titles = [], feeds = [], artworks = [];
          for ( let i = 0; i < res.data.results.length; i++ ) {
            titles.push( res.data.results[i].trackName );
          }
          for ( let i = 0; i < res.data.results.length; i++ ) {
            feeds.push( res.data.results[i].feedUrl );
          }
          for ( let i = 0; i < res.data.results.length; i++ ) {
            artworks.push( res.data.results[i].artworkUrl600 );
          }
          let returnObj = {
            podcastTitles: titles
            , podcastFeeds: feeds
            , podcastArtworks: artworks
            , podcastDescriptions: []
            , podcastEpisodeTitles: []
            , podcastEpisodeDescriptions: []
          }

          return returnObj;
        } } )
          .catch( error => {
            console.log( "Error in moreFcty", error );
          } );
    }

    , retrieveRSSFeedInformation( feed ) {

    return $.get( feed ).then( function( data ) {
      let channel = $(data).find("channel");
      let item = $(data).find("item");
      let entry = $(data).find("entry");
      console.log( feed );
      let returnObj = {
        podcastDescription: ""
        , episodeTitles: []
        , episodeDescriptions: []
        , feed: feed
      };
      channel.each( function() {
        var el = $(this);
        console.log( "LAWL" );

        let description = el.find("description:first").text();

        returnObj.podcastDescription = description;

      } );
      if ( item ) {
        item.each( function() {
          var el = $(this);
          console.log( "LOL" );

          let episodeTitle = el.find("title").text();
          let episodeDescription = el.find("description").text();

          returnObj.episodeTitles.push( episodeTitle );
          returnObj.episodeDescriptions.push( episodeDescription) ;

        } );
      } else {
        entry.each( function() {
          var el = $(this);

          let episodeTitle = el.find("title").text();
          let episodeDescription = el.find("description").text();

          returnObj.episodeTitles.push( episodeTitle );
          returnObj.episodeDescriptions.push( episodeDescription );

        } );
      }
      console.log( returnObj );
      return returnObj;
    } ).catch( error => {
      console.log( "error in moreFcty", error );
    } );
  }
  }

}

export default moreFcty;
