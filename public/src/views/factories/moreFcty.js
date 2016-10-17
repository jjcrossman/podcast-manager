function moreFcty ( $http ) {

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
          console.log( res.data.results );
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
          }
          return returnObj;
        } else {
          console.log( "iTunes search returned nothing" );
          return;
        }
      } );

  //     $.get("http://files.libertyfund.org/econtalk/EconTalk.xml", function (data) {
  //     $(data).find("item").each(function () { // or "item" or whatever suits your feed
  //         var el = $(this);
  //
  //         console.log("------------------------");
  //         console.log("title      : " + el.find("title").text());
  //         console.log("author     : " + el.find("author").text());
  //         console.log("description: " + el.find("description").text());
  //     });
  // });
    }

  }
}

export default moreFcty;
