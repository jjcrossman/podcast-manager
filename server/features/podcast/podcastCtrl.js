const Podcast = require( "./Podcast.js" );
const User = require( "../user/User.js" );
const request = require( "superagent" );
const please = require( "axios" );

let itunesSearchUrl = "https://itunes.apple.com/search?term=";
let itunesSearchQuery = "";
let itunesSearchParameters = "&country=us&media=podcast&entity=podcast&limit=1";

module.exports = {
  getUserPodcasts( req, res ) {
    console.log( `This is /api/podcast GET` );
    console.log( req.session.currentUser.fbId );
    User.findOne( { fbId: req.session.currentUser.fbId } )
      .populate( "subscriptions" )
      .exec( ( err, userWithPodcasts ) => {
        if ( err ) {
          return res.status( 500 ).json( err );
        }
        console.log( "Returning user populated with Podcasts" );
        return res.status( 200 ).json( userWithPodcasts );
      } );
  }
  , attachPodcastToUser( req, res ) {
    console.log( `This is /api/podcast POST` );
    new Podcast( req.body ).save( ( err, podcast ) => {
      if ( err ) {
        return res.status( 500 ).json( err );
      }
      console.log( podcast._id );
      User.findByIdAndUpdate( req.session.currentUser._id, { $push: { subscriptions: podcast._id } }, ( err, response ) => {
        if ( err ) {
          return res.status( 500 ).json( err );
        }
        console.log( "Podcast added to User" );
        return res.status( 201 ).json( response );
      } );
    } );
  }
  , removePodcastFromUser( req, res ) {
    console.log( `This is /api/podcast/:id DELETE` );
    console.log( req.params.id );
    User.findByIdAndUpdate( req.session.currentUser._id, { $pull: { subscriptions: req.params.id } }, ( err, removed ) => {
      if ( err ) {
        return res.status( 500 ).json( err );
      }
      Podcast.findByIdAndRemove( req.params.id, ( err, deleted ) => {
        if ( err ) {
          return res.status( 500 ).json( err );
        }
        return res.status( 200 ).json( deleted );
      } )
    } );
  }
  , queryItunes( req, res ) {
    console.log( `This is /api/itunes POST` );
    itunesSearchQuery = req.body.searchTerm;
    request.get( `${ itunesSearchUrl }${ itunesSearchQuery }${ itunesSearchParameters }` ).then( iTunesRes => {
      let itunes = JSON.parse( iTunesRes.text );
    if ( itunes.resultCount && itunes.resultCount !== 0 ) {
      console.log( `Results retrieved from iTunes: ${ itunes.resultCount }` );
      let titles = [], feeds = [], artworks = [];
      for ( let i = 0; i < itunes.results.length; i++ ) {
        titles.push( itunes.results[i].trackName );
      }
      for ( let i = 0; i < itunes.results.length; i++ ) {
        feeds.push( itunes.results[i].feedUrl );
      }
      for ( let i = 0; i < itunes.results.length; i++ ) {
        artworks.push( itunes.results[i].artworkUrl600 );
      }
      let returnObj = {
        podcastTitles: titles
        , podcastFeeds: feeds
        , podcastArtworks: artworks
        , podcastDescriptions: []
        , podcastEpisodeTitles: []
        , podcastEpisodeDescriptions: []
        , podcastEpisodeUrls: []
      }

      console.log( "Returning iTunes", returnObj );
      return res.status( 200 ).json( returnObj );
    } } )
      .catch( error => {
        console.log( "Error in server/podcastCtrl", error );
        return error;
      } );
  }

  , queryRss( req, res ) {
    console.log( `This is /api/rss POST` );
    console.log( "Scan RSS:", req.body.feed );
    please.get( req.body.feed ).then( rssRes => {
      return res.status( 200 ).json( rssRes.data );
    } )
    .catch( err => {
      console.log( err );
    } );
  }
};

// {
//   request:
//    ClientRequest {
//      domain: null,
//      _events:
//       { error: [Function: handleRequestError],
//         prefinish: [Function: requestOnPrefinish] },
//      _eventsCount: 2,
//      _maxListeners: undefined,
//      output: [],
//      outputEncodings: [],
//      outputCallbacks: [],
//      outputSize: 0,
//      writable: true,
//      _last: true,
//      chunkedEncoding: false,
//      shouldKeepAlive: false,
//      useChunkedEncodingByDefault: false,
//      sendDate: false,
//      _removedHeader: {},
//      _contentLength: 0,
//      _hasBody: true,
//      _trailer: '',
//      finished: true,
//      _headerSent: true,
//      socket:
//       Socket {
//         connecting: false,
//         _hadError: false,
//         _handle: null,
//         _parent: null,
//         _host: 'www.sciencefriday.com',
//         _readableState: [Object],
//         readable: false,
//         domain: null,
//         _events: [Object],
//         _eventsCount: 8,
//         _maxListeners: undefined,
//         _writableState: [Object],
//         writable: false,
//         allowHalfOpen: false,
//         destroyed: true,
//         _bytesDispatched: 163,
//         _sockname: null,
//         _pendingData: null,
//         _pendingEncoding: '',
//         server: null,
//         _server: null,
//         parser: null,
//         _httpMessage: [Circular],
//         read: [Function],
//         _consuming: true,
//         _idleNext: null,
//         _idlePrev: null,
//         _idleTimeout: -1 },
//      connection:
//       Socket {
//         connecting: false,
//         _hadError: false,
//         _handle: null,
//         _parent: null,
//         _host: 'www.sciencefriday.com',
//         _readableState: [Object],
//         readable: false,
//         domain: null,
//         _events: [Object],
//         _eventsCount: 8,
//         _maxListeners: undefined,
//         _writableState: [Object],
//         writable: false,
//         allowHalfOpen: false,
//         destroyed: true,
//         _bytesDispatched: 163,
//         _sockname: null,
//         _pendingData: null,
//         _pendingEncoding: '',
//         server: null,
//         _server: null,
//         parser: null,
//         _httpMessage: [Circular],
//         read: [Function],
//         _consuming: true,
//         _idleNext: null,
//         _idlePrev: null,
//         _idleTimeout: -1 },
//      _header: 'GET /feed/podcast/podcast-episode HTTP/1.1\r\nAccept: application/json, text/plain, */*\r\nUser-Agent: axios/0.15.2\r\nHost: www.sciencefriday.com\r\nConnection: close\r\n\r\n',
//      _headers:
//       { accept: 'application/json, text/plain, */*',
//         'user-agent': 'axios/0.15.2',
//         host: 'www.sciencefriday.com' },
//      _headerNames: { accept: 'Accept', 'user-agent': 'User-Agent', host: 'Host' },
//      _onPendingData: null,
//      agent:
//       Agent {
//         domain: null,
//         _events: [Object],
//         _eventsCount: 1,
//         _maxListeners: undefined,
//         defaultPort: 80,
//         protocol: 'http:',
//         options: [Object],
//         requests: {},
//         sockets: [Object],
//         freeSockets: {},
//         keepAliveMsecs: 1000,
//         keepAlive: false,
//         maxSockets: Infinity,
//         maxFreeSockets: 256 },
//      socketPath: undefined,
//      method: 'GET',
//      path: '/feed/podcast/podcast-episode',
//      _ended: true,
//      parser: null,
//      res:
//       IncomingMessage {
//         _readableState: [Object],
//         readable: false,
//         domain: null,
//         _events: [Object],
//         _eventsCount: 3,
//         _maxListeners: undefined,
//         socket: [Object],
//         connection: [Object],
//         httpVersionMajor: 1,
//         httpVersionMinor: 1,
//         httpVersion: '1.1',
//         complete: true,
//         headers: [Object],
//         rawHeaders: [Object],
//         trailers: {},
//         rawTrailers: [],
//         upgrade: false,
//         url: '',
//         method: null,
//         statusCode: 200,
//         statusMessage: 'OK',
//         client: [Object],
//         _consuming: true,
//         _dumped: false,
//         req: [Circular],
//         fetchedUrls: [Object],
//         read: [Function] } },
//   data: '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"\n\txmlns:content="http://purl.org/rss/1.0/modules/content/"\n\txmlns:wfw="http://wellformedweb.org/CommentAPI/"\n\txmlns:dc="http://purl.org/dc/elements/1.1/"\n\txmlns:atom="http://www.w3.org/2005/Atom"\n\txmlns:sy="http://purl.org/rss/1.0/modules/syndication/"\n\txmlns:slash="http://purl.org/rss/1.0/modules/slash/"\n\txmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"\n\t>\n\n<channel>\n\t<title>Science Friday</title>\n\t<atom:link href="http://www.sciencefriday.com/feed/podcast/podcast-episode" rel="self" type="application/rss+xml" />\n\t<link>http://www.sciencefriday.com/</link>\n\t<description>Covering everything about science and technology -- from the outer reaches of space to the tiniest microbes in our bodies -- Science Friday is your source for entertaining and educational stories and activities. Each week, host Ira Flatow interviews scientists and inventors like Sylvia Earle, Elon Musk, Neil deGrasse Tyson, and more.</description>\n\t<lastBuildDate>Wed, 26 Oct 2016 19:29:27 +0000</lastBuildDate>\n\t<language>en-US</language>\n\t<copyright>© 2015 Science Friday</copyright>\n\t<itunes:subtitle>It&#039;s brain fun, for curious people</itunes:subtitle>\n\t<itunes:author>Science Friday</itunes:author>\n\t<itunes:summary>Covering everything about science and technology -- from the outer reaches of space to the tiniest microbes in our bodies -- Science Friday is your source for entertaining and educational stories and activities. Each week, host Ira Flatow interviews scientists and inventors like Sylvia Earle, Elon Musk, Neil deGrasse Tyson, and more.</itunes:summary>\n\t<itunes:owner>\n\t\t<itunes:name>Science Friday</itunes:name>\n\t\t<itunes:email>scifri@sciencefriday.com</itunes:email>\n\t</itunes:owner>\n\t<itunes:explicit>clean</itunes:explicit>\n\t\t\t<itunes:image href="http://live-sciencefriday.pantheon.io/wp-content/uploads/2015/10/SciFri_avatar_1400x.png"></itunes:image>\n\t\t\t<itunes:category text="Science &amp; Medicine">\n\t\t\t</itunes:category>\n\t\t\t\t<generator>https://wordpress.org/?v=4.6</generator>\n\t<item>\n\t\t<title>Hr2: Return of the Screwworm, Hidden Figures, Political Polls</title>\n\t\t<link>http://www.sciencefriday.com/podcast/hr2-return-of-the-screwworm-hidden-figures-political-polls/</link>\n\t\t<pubDate>Fri, 21 Oct 2016 19:00:00 GMT</pubDate>\n\t\t<dc:creator>Science Friday</dc:creator>\n\t\t<guid isPermaLink="false">http://www.sciencefriday.com/?post_type=podcast&#038;p=35625</guid>\n\t\t<description><![CDATA[A flesh-eating parasite, previously eradicated on U.S. soil, has decimated endangered Key deer. Can the screwworm be re-eradicated in time to save them? Plus, we remember the African American women mathematicians and engineers whose calculations got us into space.]]></description>\n\t\t<itunes:subtitle><![CDATA[A flesh-eating parasite, previously eradicated on U.S. soil, has decimated endangered Key deer. Can the screwworm be re-eradicated in time to save them? Plus, we remember the African American women mathematicians and engineers whose calculations got us i]]></itunes:subtitle>\n\t\t<content:encoded><![CDATA[<p>A flesh-eating parasite, previously eradicated on U.S. soil, has decimated endangered Key deer. Can the screwworm be re-eradicated in time to save them? Plus, we remember the African American women mathematicians and engineers whose calculations got us into space.</p>\n]]></content:encoded>\n\t\t<itunes:summary><![CDATA[<p>A flesh-eating parasite, previously eradicated on U.S. soil, has decimated endangered Key deer. Can the screwworm be re-eradicated in time to save them? Plus, we remember the African American women mathematicians and engineers whose calculations got us into space.</p>\n]]></itunes:summary>\t\t<enclosure url="http://www.sciencefriday.com/podcast-download/35625/hr2-return-of-the-screwworm-hidden-figures-political-polls.mp3" length="1" type="audio/mpeg"></enclosure>\n\t\t<itunes:explicit>No</itunes:explicit>\n\t\t<itunes:block>No</itunes:block>\n\t\t<itunes:duration>00:47:04</itunes:duration>\n\t\t<itunes:author>Science Friday</itunes:author>\n\t</item>\t<item>\n\t\t<title>Hr1: News Roundup, Cyber War, Science Education</title>\n\t\t<link>http://www.sciencefriday.com/podcast/hr1-news-roundup-cyber-war-science-education/</link>\n\t\t<pubDate>Fri, 21 Oct 2016 19:00:00 GMT</pubDate>\n\t\t<dc:creator>Science Friday</dc:creator>\n\t\t<guid isPermaLink="false">http://www.sciencefriday.com/?post_type=podcast&#038;p=35624</guid>\n\t\t<description><![CDATA[With rumblings about possible U.S. retaliation for alleged Russian-backed hacks, we ask about the rules and norms that govern international cyber conflicts. Plus, meet the educators who have turned Science Friday media into innovative classroom resources.]]></description>\n\t\t<itunes:subtitle><![CDATA[With rumblings about possible U.S. retaliation for alleged Russian-backed hacks, we ask about the rules and norms that govern international cyber conflicts. Plus, meet the educators who have turned Science Friday media into innovative classroom resources]]></itunes:subtitle>\n\t\t<content:encoded><![CDATA[<p>With rumblings about possible U.S. retaliation for alleged Russian-backed hacks, we ask about the rules and norms that govern international cyber conflicts. Plus, meet the educators who have turned Science Friday media into innovative classroom resources.</p>\n]]></content:encoded>\n\t\t<itunes:summary><![CDATA[<p>With rumblings about possible U.S. retaliation for alleged Russian-backed hacks, we ask about the rules and norms that govern international cyber conflicts. Plus, meet the educators who have turned Science Friday media into innovative classroom resources.</p>\n]]></itunes:summary>\t\t<enclosure url="http://www.sciencefriday.com/podcast-download/35624/hr1-news-roundup-cyber-war-science-education.mp3" length="1" type="audio/mpeg"></enclosure>\n\t\t<itunes:explicit>No</itunes:explicit>\n\t\t<itunes:block>No</itunes:block>\n\t\t<itunes:duration>00:47:16</itunes:duration>\n\t\t<itunes:author>Science Friday</itunes:author>\n\t</item>\t<item>\n\t\t<title>Hr2: DTC Blood Tests, Hornless Cow, Digital Assistants</title>\n\t\t<link>http://www.sciencefriday.com/podcast/hr2-dtc-blood-tests-hornless-cow-digital-assistants/</link>\n\t\t<pubDate>Fri, 14 Oct 2016 19:00:00 GMT</pubDate>\n\t\t<dc:creator>Science Friday</dc:creator>\n\t\t<guid isPermaLink="false">http://www.sciencefriday.com/?post_type=podcast&#038;p=35425</guid>\n\t\t<description><![CDATA[As tech companies battle to develop the best digital assistant, we ask how they measure up, and why we so often fail to connect. Plus, researchers used gene editing to develop a dairy cow that has no horns. And what happens when direct-to-consumer lab tests take physicians out of the equation?]]></description>\n\t\t<itunes:subtitle><![CDATA[As tech companies battle to develop the best digital assistant, we ask how they measure up, and why we so often fail to connect. Plus, researchers used gene editing to develop a dairy cow that has no horns. And what happens when direct-to-consumer lab te]]></itunes:subtitle>\n\t\t<content:encoded><![CDATA[<p>As tech companies battle to develop the best digital assistant, we ask how they measure up, and why we so often fail to connect. Plus, researchers used gene editing to develop a dairy cow that has no horns. And what happens when direct-to-consumer lab tests take physicians out of the equation?</p>\n]]></content:encoded>\n\t\t<itunes:summary><![CDATA[<p>As tech companies battle to develop the best digital assistant, we ask how they measure up, and why we so often fail to connect. Plus, researchers used gene editing to develop a dairy cow that has no horns. And what happens when direct-to-consumer lab tests take physicians out of the equation?</p>\n]]></itunes:summary>\t\t<enclosure url="http://www.sciencefriday.com/podcast-download/35425/hr2-dtc-blood-tests-hornless-cow-digital-assistants.mp3" length="1" type="audio/mpeg"></enclosure>\n\t\t<itunes:explicit>No</itunes:explicit>\n\t\t<itunes:block>No</itunes:block>\n\t\t<itunes:duration>00:47:13</itunes:duration>\n\t\t<itunes:author>Science Friday</itunes:author>\n\t</item>\t<item>\n\t\t<title>Hr1: News Roundup, Carbon and Reservoirs, Science Subpoenas</title>\n\t\t<link>http://www.sciencefriday.com/podcast/hr1-news-roundup-carbon-and-reservoirs-science-subpoenas/</link>\n\t\t<pubDate>Fri, 14 Oct 2016 19:00:00 GMT</pubDate>\n\t\t<dc:creator>Science Friday</dc:creator>\n\t\t<guid isPermaLink="false">http://www.sciencefriday.com/?post_type=podcast&#038;p=35423</guid>\n\t\t<description><![CDATA[How Congress, lawsuits, and other challenges are shaping scientific debate over climate science, fetal tissue research, and more. Plus, reservoirs are both sources of renewable energy and one of the worlds biggest producers of greenhouse gases.]]></description>\n\t\t<itunes:subtitle><![CDATA[How Congress, lawsuits, and other challenges are shaping scientific debate over climate science, fetal tissue research, and more. Plus, reservoirs are both sources of renewable energy and one of the worlds biggest producers of greenhouse gases.]]></itunes:subtitle>\n\t\t<content:encoded><![CDATA[<p>How Congress, lawsuits, and other challenges are shaping scientific debate over climate science, fetal tissue research, and more. Plus, reservoirs are both sources of renewable energy and one of the worlds biggest producers of greenhouse gases.</p>\n]]></content:encoded>\n\t\t<itunes:summary><![CDATA[<p>How Congress, lawsuits, and other challenges are shaping scientific debate over climate science, fetal tissue research, and more. Plus, reservoirs are both sources of renewable energy and one of the worlds biggest producers of greenhouse gases.</p>\n]]></itunes:summary>\t\t<enclosure url="http://www.sciencefriday.com/podcast-download/35423/hr1-news-roundup-carbon-and-reservoirs-science-subpoenas.mp3" length="1" type="audio/mpeg"></enclosure>\n\t\t<itunes:explicit>No</itunes:explicit>\n\t\t<itunes:block>No</itunes:block>\n\t\t<itunes:duration>00:47:22</itunes:duration>\n\t\t<itunes:author>Science Friday</itunes:author>\n\t</item>\t<item>\n\t\t<title>Hr2: Future Commuting, Astronaut Mike Massimino, Humans To Mars</title>\n\t\t<link>http://www.sciencefriday.com/podcast/hr2-future-commuting-astronaut-mike-massimino-humans-to-mars/</link>\n\t\t<pubDate>Fri, 07 Oct 2016 19:00:00 GMT</pubDate>\n\t\t<dc:creator>Science Friday</dc:creator>\n\t\t<guid isPermaLink="false">http://www.sciencefriday.com/?post_type=podcast&#038;p=35348</guid>\n\t\t<description><![CDATA[As rideshare companies like Uber strike deals with cities to supplement or replace traditional transit options and parking lots, we ask: What is the future of commuting? Plus astronaut Mike Massimino talks about his journey from the suburbs of Long Island to the crew of two shuttle missions to repair the Hubble Space Telescope. And are we ready to go to Mars?]]></description>\n\t\t<itunes:subtitle><![CDATA[As rideshare companies like Uber strike deals with cities to supplement or replace traditional transit options and parking lots, we ask: What is the future of commuting? Plus astronaut Mike Massimino talks about his journey from the suburbs of Long Islan]]></itunes:subtitle>\n\t\t<content:encoded><![CDATA[<p>As rideshare companies like Uber strike deals with cities to supplement or replace traditional transit options and parking lots, we ask: What is the future of commuting? Plus astronaut Mike Massimino talks about his journey from the suburbs of Long Island to the crew of two shuttle missions to repair the Hubble Space Telescope. And are we ready to go to Mars?</p>\n]]></content:encoded>\n\t\t<itunes:summary><![CDATA[<p>As rideshare companies like Uber strike deals with cities to supplement or replace traditional transit options and parking lots, we ask: What is the future of commuting? Plus astronaut Mike Massimino talks about his journey from the suburbs of Long Island to the crew of two shuttle missions to repair the Hubble Space Telescope. And are we ready to go to Mars?</p>\n]]></itunes:summary>\t\t<enclosure url="http://www.sciencefriday.com/podcast-download/35348/hr2-future-commuting-astronaut-mike-massimino-humans-to-mars.mp3" length="1" type="audio/mpeg"></enclosure>\n\t\t<itunes:explicit>No</itunes:explicit>\n\t\t<itunes:block>No</itunes:block>\n\t\t<itunes:duration>00:47:02</itunes:duration>\n\t\t<itunes:author>Science Friday</itunes:author>\n\t</item>\t<item>\n\t\t<title>Hr1: News Roundup, Nobel Prize, Golden Record 2.0, Pop Up Books</title>\n\t\t<link>http://www.sciencefriday.com/podcast/hr1-news-roundup-nobel-prize-golden-record-2-0-pop-up-books/</link>\n\t\t<pubDate>Fri, 07 Oct 2016 19:00:00 GMT</pubDate>\n\t\t<dc:creator>Science Friday</dc:creator>\n\t\t<guid isPermaLink="false">http://www.sciencefriday.com/?post_type=podcast&#038;p=35347</guid>\n\t\t<description><![CDATA[We review the sounds, images, and videos our listeners chose to represent our world. Plus, pop-up designer Matthew Reinhart engineers paper cut-outs that move and extend, sometimes reaching nearly two feet tall.\r\n]]></description>\n\t\t<itunes:subtitle><![CDATA[We review the sounds, images, and videos our listeners chose to represent our world. Plus, pop-up designer Matthew Reinhart engineers paper cut-outs that move and extend, sometimes reaching nearly two feet tall.\r\n]]></itunes:subtitle>\n\t\t<content:encoded><![CDATA[<p>We review the sounds, images, and videos our listeners chose to represent our world. Plus, pop-up designer Matthew Reinhart engineers paper cut-outs that move and extend, sometimes reaching nearly two feet tall.</p>\n]]></content:encoded>\n\t\t<itunes:summary><![CDATA[<p>We review the sounds, images, and videos our listeners chose to represent our world. Plus, pop-up designer Matthew Reinhart engineers paper cut-outs that move and extend, sometimes reaching nearly two feet tall.</p>\n]]></itunes:summary>\t\t<enclosure url="http://www.sciencefriday.com/podcast-download/35347/hr1-news-roundup-nobel-prize-golden-record-2-0-pop-up-books.mp3" length="1" type="audio/mpeg"></enclosure>\n\t\t<itunes:explicit>No</itunes:explicit>\n\t\t<itunes:block>No</itunes:block>\n\t\t<itunes:duration>00:46:46</itunes:duration>\n\t\t<itunes:author>Science Friday</itunes:author>\n\t</item>\t<item>\n\t\t<title>Hr2: Oysters and Oceans, Trees and Drought, Tardigrades</title>\n\t\t<link>http://www.sciencefriday.com/podcast/hr2-oysters-and-oceans-trees-and-drought-tardigrades/</link>\n\t\t<pubDate>Fri, 30 Sep 2016 19:00:00 GMT</pubDate>\n\t\t<dc:creator>Science Friday</dc:creator>\n\t\t<guid isPermaLink="false">http://www.sciencefriday.com/?post_type=podcast&#038;p=35236</guid>\n\t\t<description><![CDATA[Oyster farmers have been hit hard by acidifying seas. Can they adapt? And how curiosity about tardigrades in the 1970s led to a major breakthrough in medical science.\r\n]]></description>\n\t\t<itunes:subtitle><![CDATA[Oyster farmers have been hit hard by acidifying seas. Can they adapt? And how curiosity about tardigrades in the 1970s led to a major breakthrough in medical science.\r\n]]></itunes:subtitle>\n\t\t<content:encoded><![CDATA[<p>Oyster farmers have been hit hard by acidifying seas. Can they adapt? And how curiosity about tardigrades in the 1970s led to a major breakthrough in medical science.</p>\n]]></content:encoded>\n\t\t<itunes:summary><![CDATA[<p>Oyster farmers have been hit hard by acidifying seas. Can they adapt? And how curiosity about tardigrades in the 1970s led to a major breakthrough in medical science.</p>\n]]></itunes:summary>\t\t<enclosure url="http://www.sciencefriday.com/podcast-download/35236/hr2-oysters-and-oceans-trees-and-drought-tardigrades.mp3" length="1" type="audio/mpeg"></enclosure>\n\t\t<itunes:explicit>No</itunes:explicit>\n\t\t<itunes:block>No</itunes:block>\n\t\t<itunes:duration>00:47:52</itunes:duration>\n\t\t<itunes:author>Science Friday</itunes:author>\n\t</item>\t<item>\n\t\t<title>Hr1: News Roundup, Snap Spectacles, Connected Cars, Way Things Work</title>\n\t\t<link>http://www.sciencefriday.com/podcast/hr1-news-roundup-snap-spectacles-connected-cars-way-things-work/</link>\n\t\t<pubDate>Fri, 30 Sep 2016 19:00:00 GMT</pubDate>\n\t\t<dc:creator>Science Friday</dc:creator>\n\t\t<guid isPermaLink="false">http://www.sciencefriday.com/?post_type=podcast&#038;p=35235</guid>\n\t\t<description><![CDATA[Connected cars tap into vehicle sensors to read road signs, determine traffic patterns, and find open parking spaces. Plus, artist David Macaulay on the art of explaining science in pictures.\r\n]]></description>\n\t\t<itunes:subtitle><![CDATA[Connected cars tap into vehicle sensors to read road signs, determine traffic patterns, and find open parking spaces. Plus, artist David Macaulay on the art of explaining science in pictures.\r\n]]></itunes:subtitle>\n\t\t<content:encoded><![CDATA[<p>Connected cars tap into vehicle sensors to read road signs, determine traffic patterns, and find open parking spaces. Plus, artist David Macaulay on the art of explaining science in pictures.</p>\n]]></content:encoded>\n\t\t<itunes:summary><![CDATA[<p>Connected cars tap into vehicle sensors to read road signs, determine traffic patterns, and find open parking spaces. Plus, artist David Macaulay on the art of explaining science in pictures.</p>\n]]></itunes:summary>\t\t<enclosure url="http://www.sciencefriday.com/podcast-download/35235/hr1-news-roundup-snap-spectacles-connected-cars-way-things-work.mp3" length="1" type="audio/mpeg"></enclosure>\n\t\t<itunes:explicit>No</itunes:explicit>\n\t\t<itunes:block>No</itunes:block>\n\t\t<itunes:duration>00:47:12</itunes:duration>\n\t\t<itunes:author>Science Friday</itunes:author>\n\t</item>\t<item>\n\t\t<title>Hr2: Fog and Redwoods, Amphibian vs Fungus, AI</title>\n\t\t<link>http://www.sciencefriday.com/podcast/hr2-fog-and-redwoods-amphibian-vs-fungus-ai/</link>\n\t\t<pubDate>Fri, 23 Sep 2016 19:00:00 GMT</pubDate>\n\t\t<dc:creator>Science Friday</dc:creator>\n\t\t<guid isPermaLink="false">http://www.sciencefriday.com/?post_type=podcast&#038;p=35089</guid>\n\t\t<description><![CDATA[As artificial intelligence advances, it could transform our world. How do we ensure it does so in the best possible way? Plus,  what the fight of one frog against the deadly chytrid fungus could mean for the survival of imperiled amphibians around the globe.]]></description>\n\t\t<itunes:subtitle><![CDATA[As artificial intelligence advances, it could transform our world. How do we ensure it does so in the best possible way? Plus,  what the fight of one frog against the deadly chytrid fungus could mean for the survival of imperiled amphibians around the gl]]></itunes:subtitle>\n\t\t<content:encoded><![CDATA[<p>As artificial intelligence advances, it could transform our world. How do we ensure it does so in the best possible way? Plus,  what the fight of one frog against the deadly chytrid fungus could mean for the survival of imperiled amphibians around the globe.</p>\n]]></content:encoded>\n\t\t<itunes:summary><![CDATA[<p>As artificial intelligence advances, it could transform our world. How do we ensure it does so in the best possible way? Plus,  what the fight of one frog against the deadly chytrid fungus could mean for the survival of imperiled amphibians around the globe.</p>\n]]></itunes:summary>\t\t<enclosure url="http://www.sciencefriday.com/podcast-download/35089/hr2-fog-and-redwoods-amphibian-vs-fungus-ai.mp3" length="1" type="audio/mpeg"></enclosure>\n\t\t<itunes:explicit>No</itunes:explicit>\n\t\t<itunes:block>No</itunes:block>\n\t\t<itunes:duration>00:47:08</itunes:duration>\n\t\t<itunes:author>Science Friday</itunes:author>\n\t</item>\t<item>\n\t\t<title>Hr1: News Roundup, Endangered Tourism, Fitness Goals, Fashion In Physics</title>\n\t\t<link>http://www.sciencefriday.com/podcast/hr1-news-roundup-endangered-tourism-fitness-goals-fashion-in-physics/</link>\n\t\t<pubDate>Fri, 23 Sep 2016 19:00:00 GMT</pubDate>\n\t\t<dc:creator>Science Friday</dc:creator>\n\t\t<guid isPermaLink="false">http://www.sciencefriday.com/?post_type=podcast&#038;p=35086</guid>\n\t\t<description><![CDATA[Health experts tout the benefits of standing desks, and walking five miles a day. Science says otherwise. Plus theoretical physicist Roger Penrose argues against some prominent theories about the universe, calling them fashion, faith, and fantasy.]]></description>\n\t\t<itunes:subtitle><![CDATA[Health experts tout the benefits of standing desks, and walking five miles a day. Science says otherwise. Plus theoretical physicist Roger Penrose argues against some prominent theories about the universe, calling them fashion, faith, and fantasy.]]></itunes:subtitle>\n\t\t<content:encoded><![CDATA[<p>Health experts tout the benefits of standing desks, and walking five miles a day. Science says otherwise. Plus theoretical physicist Roger Penrose argues against some prominent theories about the universe, calling them fashion, faith, and fantasy.</p>\n]]></content:encoded>\n\t\t<itunes:summary><![CDATA[<p>Health experts tout the benefits of standing desks, and walking five miles a day. Science says otherwise. Plus theoretical physicist Roger Penrose argues against some prominent theories about the universe, calling them fashion, faith, and fantasy.</p>\n]]></itunes:summary>\t\t<enclosure url="http://www.sciencefriday.com/podcast-download/35086/hr1-news-roundup-endangered-tourism-fitness-goals-fashion-in-physics.mp3" length="1" type="audio/mpeg"></enclosure>\n\t\t<itunes:explicit>No</itunes:explicit>\n\t\t<itunes:block>No</itunes:block>\n\t\t<itunes:duration>00:47:09</itunes:duration>\n\t\t<itunes:author>Science Friday</itunes:author>\n\t</item></channel>\n</rss>' }
