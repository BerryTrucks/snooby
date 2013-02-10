describe('Login', function() {
  var server;

  beforeEach(function() {
    server = sinon.fakeServer.create();
  });

  afterEach(function() {
    server.restore();
  });

  it('uses https', function() {
    snooby.login('mrlamb', 'mrlamb', function() {});
    expect(server.requests.length).toEqual(1);
    expect(server.requests[0].url).toEqual('https://ssl.reddit.com/api/login');
  });

  it('passes the correct parameters', function() {
    snooby.login('mrlamb', 'mrlamb', function() {});
    expect(server.requests[0].requestBody).toEqual('user=mrlamb&passwd=mrlamb&rem=true&api_type=json');
  });

  it('calls onsuccess callback upon successful login', function() {
    var response = '{"json": {"errors": [], "data": {"modhash": "mr0z3ffd6503006095d3019bbe048c332cf67845a47e36890f", "cookie": "6249076,2013-02-08T20:22:57,005400297108ae62f886191a126b8bd992a293de"}}}';
    server.respondWith('POST',
                       'https://ssl.reddit.com/api/login',
                       [200, { "Content-Type": "application/json" }, response]);
    var onsuccess = sinon.spy();
    snooby.login('mrlamb', 'mrlamb', onsuccess);
    server.respond();
    expect(onsuccess.withArgs(JSON.parse(response)).calledOnce).toBeTruthy();
  });
});

describe('Logout', function() {
  var server;

  beforeEach(function() {
    server = sinon.fakeServer.create();
  });

  afterEach(function() {
    server.restore();
  });

  it('passes the correct parameters', function() {
    snooby.logout('42324acbed', function() {});
    expect(server.requests[0].requestBody).toEqual('uh=42324acbed&top=off');
  });

  it('calls onsuccess callback upon successful logout', function() {
    var response = '{"errors":[]}';
    server.respondWith('POST',
                       'https://ssl.reddit.com/logout',
                       [200, { "Content-Type": "application/json" }, response]);
    var onsuccess = sinon.spy();
    snooby.logout('modhash', onsuccess);
    server.respond();
    expect(onsuccess.calledOnce).toBeTruthy();
  });
});

describe('Frontpage listings', function() {
  var server;
  var setItem;

  beforeEach(function() {
    server = sinon.fakeServer.create();
    sinon.spy(_cache, "setItem");
  });

  afterEach(function() {
    server.restore();
    _cache.setItem.restore();
  });

  it('gets front page listings if subreddits = \'frontpage\'', function() {
    server.respondWith('GET',
                       'http://reddit.com/.json',
                       [200, { "Content-Type": "application/json" }, frontPageListing]);
    var listing = JSON.parse(frontPageListing);
    var callback = sinon.spy();
    snooby.listing('frontpage', callback);
    server.respond();
    expect(callback.called).toBe(true);
  });

  it('calls callback for every link returned from listing', function() {
    server.respondWith('GET',
                       'http://reddit.com/.json',
                       [200, { "Content-Type": "application/json" }, frontPageListing]);
    var listing = JSON.parse(frontPageListing);
    var callback = sinon.spy();
    snooby.listing('frontpage', callback);
    server.respond();
    expect(callback.callCount).toBe(listing.data.children.length);
  });

  it('caches the listing returned from Reddit', function() {
    server.respondWith('GET',
                       'http://reddit.com/.json',
                       [200, { "Content-Type": "application/json" }, frontPageListing]);
    var listing = JSON.parse(frontPageListing);
    var callback = sinon.spy();
    snooby.listing('frontpage', callback);
    server.respond();
    expect(_cache.setItem.calledWith('subreddit.listing', listing)).toBe(true);
    expect(_cache.setItem.calledWith('subreddit.selected', 'frontpage')).toBe(true);
  });
});

var frontPageListing = "{\"kind\": \"Listing\", \"data\": {\"modhash\": \"0q9ri7e1hy6397db36e49b261e23ace02ef6ae2c1b18a7a635\", \"children\": [{\"kind\": \"t3\", \"data\": {\"domain\": \"i.imgur.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"pics\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186xsm\", \"clicked\": false, \"title\": \"Tropical Pigeon (why cant we have these in the city?!)\", \"num_comments\": 793, \"score\": 4127, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"http:\/\/e.thumbs.redditmedia.com\/xp-V5JEmRPyULdPj.jpg\", \"subreddit_id\": \"t5_2qh0u\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 10567, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/pics\/comments\/186xsm\/tropical_pigeon_why_cant_we_have_these_in_the_city\/\", \"name\": \"t3_186xsm\", \"created\": 1360448792.0, \"url\": \"http:\/\/i.imgur.com\/fEdYXvJ.jpg\", \"author_flair_text\": null, \"author\": \"rRedditor\", \"created_utc\": 1360419992.0, \"media\": null, \"num_reports\": null, \"ups\": 14694}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"torrentfreak.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"technology\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186w8a\", \"clicked\": false, \"title\": \"FBI Employees Download Pirated Movies and TV-Shows \\\"New data reveals that employees at the FBI\\u2019s Criminal Justice Information Services Division are sharing movies and TV-shows with the rest of the world.\\\"\", \"num_comments\": 177, \"score\": 1715, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qh16\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 1065, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/technology\/comments\/186w8a\/fbi_employees_download_pirated_movies_and_tvshows\/\", \"name\": \"t3_186w8a\", \"created\": 1360445906.0, \"url\": \"http:\/\/torrentfreak.com\/fbi-employees-download-pirated-movies-and-tv-shows-130209\/?utm_source=feedburner&amp;utm_medium=feed&amp;utm_campaign=Feed%3A+Torrentfreak+%28Torrentfreak%29\", \"author_flair_text\": null, \"author\": \"Libertatea\", \"created_utc\": 1360417106.0, \"media\": null, \"num_reports\": null, \"ups\": 2780}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"youtube.com\", \"banned_by\": null, \"media_embed\": {\"content\": \"&lt;iframe width=\\\"600\\\" height=\\\"338\\\" src=\\\"http:\/\/www.youtube.com\/embed\/7muB4tVp8d0?feature=oembed\\\" frameborder=\\\"0\\\" allowfullscreen&gt;&lt;\/iframe&gt;\", \"width\": 600, \"scrolling\": false, \"height\": 338}, \"subreddit\": \"videos\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186xzc\", \"clicked\": false, \"title\": \"Snow is too deep for my dog\", \"num_comments\": 131, \"score\": 1435, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"http:\/\/b.thumbs.redditmedia.com\/SJ5Ox4c_mXU7NxfO.jpg\", \"subreddit_id\": \"t5_2qh1e\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 426, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/videos\/comments\/186xzc\/snow_is_too_deep_for_my_dog\/\", \"name\": \"t3_186xzc\", \"created\": 1360449087.0, \"url\": \"http:\/\/www.youtube.com\/watch?v=7muB4tVp8d0\", \"author_flair_text\": null, \"author\": \"MawcDrums\", \"created_utc\": 1360420287.0, \"media\": {\"oembed\": {\"provider_url\": \"http:\/\/www.youtube.com\/\", \"description\": \"Uploaded by MawcDrums on 2013-02-09.\", \"title\": \"Too much snow for scooter LOL\", \"url\": \"http:\/\/www.youtube.com\/watch?v=7muB4tVp8d0\", \"author_name\": \"MawcDrums\", \"height\": 338, \"width\": 600, \"html\": \"&lt;iframe width=\\\"600\\\" height=\\\"338\\\" src=\\\"http:\/\/www.youtube.com\/embed\/7muB4tVp8d0?feature=oembed\\\" frameborder=\\\"0\\\" allowfullscreen&gt;&lt;\/iframe&gt;\", \"thumbnail_width\": 480, \"version\": \"1.0\", \"provider_name\": \"YouTube\", \"thumbnail_url\": \"http:\/\/i4.ytimg.com\/vi\/7muB4tVp8d0\/hqdefault.jpg\", \"type\": \"video\", \"thumbnail_height\": 360, \"author_url\": \"http:\/\/www.youtube.com\/user\/MawcDrums\"}, \"type\": \"youtube.com\"}, \"num_reports\": null, \"ups\": 1861}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"i.imgur.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"AdviceAnimals\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186shd\", \"clicked\": false, \"title\": \"True story\", \"num_comments\": 235, \"score\": 2129, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"http:\/\/b.thumbs.redditmedia.com\/g1aB1T4HouzTb8b1.jpg\", \"subreddit_id\": \"t5_2s7tt\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 11475, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/AdviceAnimals\/comments\/186shd\/true_story\/\", \"name\": \"t3_186shd\", \"created\": 1360437258.0, \"url\": \"http:\/\/i.imgur.com\/EfAuAit.jpg\", \"author_flair_text\": null, \"author\": \"SuicidalDuckTF2\", \"created_utc\": 1360408458.0, \"media\": null, \"num_reports\": null, \"ups\": 13604}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"allfunandgames.ca\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"todayilearned\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186svk\", \"clicked\": false, \"title\": \"TIL In the entire state of Ohio in 1895, there were only two cars on the road, and the drivers of these two cars crashed into each other.\", \"num_comments\": 150, \"score\": 1691, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"http:\/\/a.thumbs.redditmedia.com\/UtNMGv9ESJyHyaOT.jpg\", \"subreddit_id\": \"t5_2qqjc\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 1042, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/todayilearned\/comments\/186svk\/til_in_the_entire_state_of_ohio_in_1895_there\/\", \"name\": \"t3_186svk\", \"created\": 1360438190.0, \"url\": \"http:\/\/www.allfunandgames.ca\/facts\/transportation.shtml\", \"author_flair_text\": null, \"author\": \"tmos1985\", \"created_utc\": 1360409390.0, \"media\": null, \"num_reports\": null, \"ups\": 2733}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"self.AskReddit\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"AskReddit\", \"selftext_html\": \"&lt;!-- SC_OFF --&gt;&lt;div class=\\\"md\\\"&gt;&lt;p&gt;Besides flying the plane, but autopilot I&amp;#39;m sure takes over for the most part. I have to imagine you guys get bored up there, especially on the 14 hour flights from SFO to Hong Kong.&lt;\/p&gt;\\n&lt;\/div&gt;&lt;!-- SC_ON --&gt;\", \"selftext\": \"Besides flying the plane, but autopilot I\'m sure takes over for the most part. I have to imagine you guys get bored up there, especially on the 14 hour flights from SFO to Hong Kong.\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186rn2\", \"clicked\": false, \"title\": \"Pilots of reddit, just what do you do in the cockpit over those long flights?\", \"num_comments\": 710, \"score\": 1019, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qh1i\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 516, \"saved\": false, \"is_self\": true, \"permalink\": \"\/r\/AskReddit\/comments\/186rn2\/pilots_of_reddit_just_what_do_you_do_in_the\/\", \"name\": \"t3_186rn2\", \"created\": 1360435030.0, \"url\": \"http:\/\/www.reddit.com\/r\/AskReddit\/comments\/186rn2\/pilots_of_reddit_just_what_do_you_do_in_the\/\", \"author_flair_text\": null, \"author\": \"DEFCUNTSLAM\", \"created_utc\": 1360406230.0, \"media\": null, \"num_reports\": null, \"ups\": 1535}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"youtube.com\", \"banned_by\": null, \"media_embed\": {\"content\": \"&lt;iframe width=\\\"600\\\" height=\\\"338\\\" src=\\\"http:\/\/www.youtube.com\/embed\/ovHTbtIsyFw?feature=oembed\\\" frameborder=\\\"0\\\" allowfullscreen&gt;&lt;\/iframe&gt;\", \"width\": 600, \"scrolling\": false, \"height\": 338}, \"subreddit\": \"politics\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186i5a\", \"clicked\": false, \"title\": \"Julian Assange to Bill Maher: \'You Can Be Killed By Someone in White House For Completely Arbitrary Reasons\' and that\'s why we need Wikileaks\", \"num_comments\": 448, \"score\": 1850, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2cneq\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 1381, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/politics\/comments\/186i5a\/julian_assange_to_bill_maher_you_can_be_killed_by\/\", \"name\": \"t3_186i5a\", \"created\": 1360417989.0, \"url\": \"http:\/\/www.youtube.com\/watch?v=ovHTbtIsyFw&amp;feature=player_embedded\", \"author_flair_text\": null, \"author\": \"DawnChorus9\", \"created_utc\": 1360389189.0, \"media\": {\"oembed\": {\"provider_url\": \"http:\/\/www.youtube.com\/\", \"description\": \"Uploaded by OnlyWaxing on 2013-02-09.\", \"title\": \"WikiLeaks Assange: \'You Can Be Killed By Someone in White House For Completely Arbitrary Reasons\'\", \"url\": \"http:\/\/www.youtube.com\/watch?v=ovHTbtIsyFw\", \"author_name\": \"OnlyWaxing\", \"height\": 338, \"width\": 600, \"html\": \"&lt;iframe width=\\\"600\\\" height=\\\"338\\\" src=\\\"http:\/\/www.youtube.com\/embed\/ovHTbtIsyFw?feature=oembed\\\" frameborder=\\\"0\\\" allowfullscreen&gt;&lt;\/iframe&gt;\", \"thumbnail_width\": 480, \"version\": \"1.0\", \"provider_name\": \"YouTube\", \"thumbnail_url\": \"http:\/\/i4.ytimg.com\/vi\/ovHTbtIsyFw\/hqdefault.jpg\", \"type\": \"video\", \"thumbnail_height\": 360, \"author_url\": \"http:\/\/www.youtube.com\/user\/OnlyWaxing\"}, \"type\": \"youtube.com\"}, \"num_reports\": null, \"ups\": 3231}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"self.IAmA\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"IAmA\", \"selftext_html\": \"&lt;!-- SC_OFF --&gt;&lt;div class=\\\"md\\\"&gt;&lt;p&gt;Hey Reddit, I&amp;#39;m Dave Grohl, I&amp;#39;m musician and umm... holy shit I made a &lt;a href=\\\"http:\/\/buy.soundcitymovie.com\\\"&gt;movie&lt;\/a&gt;. AMA in 45 minutes.&lt;\/p&gt;\\n\\n&lt;hr\/&gt;\\n\\n&lt;p&gt;&lt;strong&gt;Update 1:&lt;\/strong&gt; &lt;a href=\\\"https:\/\/twitter.com\/soundcitymovie\/status\/300025654378909696\\\"&gt;Twitter Proof&lt;\/a&gt;&lt;\/p&gt;\\n\\n&lt;p&gt;&lt;strong&gt;Update 2:&lt;\/strong&gt; Guess what? You can use the code &lt;strong&gt;REDDIT&lt;\/strong&gt; to &lt;a href=\\\"http:\/\/buy.soundcitymovie.com\\\"&gt;get&lt;\/a&gt; Sound City for only $10. Okay, back to the questions!&lt;\/p&gt;\\n\\n&lt;p&gt;&lt;strong&gt;Update 3:&lt;\/strong&gt; Oh, and.. It&amp;#39;s also available on &lt;a href=\\\"https:\/\/itunes.apple.com\/us\/movie\/sound-city\/id587612681\\\"&gt;iTunes&lt;\/a&gt; to Rent \/ Buy.&lt;\/p&gt;\\n\\n&lt;p&gt;&lt;strong&gt;Update 4:&lt;\/strong&gt; Pee break! Here&amp;#39;s some Mexican &lt;a href=\\\"http:\/\/open.spotify.com\/track\/4aMT5LHe8A2uIc11H8Cx2m\\\"&gt;music&lt;\/a&gt; while waiting.&lt;\/p&gt;\\n\\n&lt;hr\/&gt;\\n\\n&lt;p&gt;&lt;a href=\\\"http:\/\/i.imgur.com\/1vEtnEH.jpg\\\"&gt;Thank You Reddit!&lt;\/a&gt;&lt;\/p&gt;\\n&lt;\/div&gt;&lt;!-- SC_ON --&gt;\", \"selftext\": \"Hey Reddit, I\'m Dave Grohl, I\'m musician and umm... holy shit I made a [movie](http:\/\/buy.soundcitymovie.com). AMA in 45 minutes.\\n\\n---\\n\\n**Update 1:** [Twitter Proof](https:\/\/twitter.com\/soundcitymovie\/status\/300025654378909696)\\n\\n**Update 2:** Guess what? You can use the code **REDDIT** to [get](http:\/\/buy.soundcitymovie.com) Sound City for only $10. Okay, back to the questions!\\n\\n**Update 3:** Oh, and.. It\'s also available on [iTunes](https:\/\/itunes.apple.com\/us\/movie\/sound-city\/id587612681) to Rent \/ Buy.\\n\\n**Update 4:** Pee break! Here\'s some Mexican [music](http:\/\/open.spotify.com\/track\/4aMT5LHe8A2uIc11H8Cx2m) while waiting.\\n\\n---\\n\\n[Thank You Reddit!](http:\/\/i.imgur.com\/1vEtnEH.jpg)\", \"likes\": null, \"link_flair_text\": null, \"id\": \"185xdl\", \"clicked\": false, \"title\": \"I Am Dave Grohl AMA\", \"num_comments\": 14439, \"score\": 2479, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"self\", \"subreddit_id\": \"t5_2qzb6\", \"edited\": 1360379275.0, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 32500, \"saved\": false, \"is_self\": true, \"permalink\": \"\/r\/IAmA\/comments\/185xdl\/i_am_dave_grohl_ama\/\", \"name\": \"t3_185xdl\", \"created\": 1360397688.0, \"url\": \"http:\/\/www.reddit.com\/r\/IAmA\/comments\/185xdl\/i_am_dave_grohl_ama\/\", \"author_flair_text\": null, \"author\": \"totallynotdavegrohl\", \"created_utc\": 1360368888.0, \"media\": null, \"num_reports\": null, \"ups\": 34979}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"self.DoesAnybodyElse\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"DoesAnybodyElse\", \"selftext_html\": \"&lt;!-- SC_OFF --&gt;&lt;div class=\\\"md\\\"&gt;&lt;p&gt;Anytime it&amp;#39;s really sunny and bright and everyone&amp;#39;s like &amp;quot;Look how pretty! It&amp;#39;s such a gorgeous day! I think &amp;quot;Meh. Not that great.&amp;quot; But when it&amp;#39;s dark, cloudy, and windy, I love it. I want to just lay in the grass and look at the (grey) clouds. Mmm. &lt;\/p&gt;\\n&lt;\/div&gt;&lt;!-- SC_ON --&gt;\", \"selftext\": \"Anytime it\'s really sunny and bright and everyone\'s like \\\"Look how pretty! It\'s such a gorgeous day! I think \\\"Meh. Not that great.\\\" But when it\'s dark, cloudy, and windy, I love it. I want to just lay in the grass and look at the (grey) clouds. Mmm. \", \"likes\": null, \"link_flair_text\": null, \"id\": \"186h58\", \"clicked\": false, \"title\": \"DAE absolutely love cloudy, dark days?\", \"num_comments\": 84, \"score\": 663, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2r5vt\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 255, \"saved\": false, \"is_self\": true, \"permalink\": \"\/r\/DoesAnybodyElse\/comments\/186h58\/dae_absolutely_love_cloudy_dark_days\/\", \"name\": \"t3_186h58\", \"created\": 1360416804.0, \"url\": \"http:\/\/www.reddit.com\/r\/DoesAnybodyElse\/comments\/186h58\/dae_absolutely_love_cloudy_dark_days\/\", \"author_flair_text\": null, \"author\": \"theADHDkid101\", \"created_utc\": 1360388004.0, \"media\": null, \"num_reports\": null, \"ups\": 918}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"self.Music\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"Music\", \"selftext_html\": \"&lt;!-- SC_OFF --&gt;&lt;div class=\\\"md\\\"&gt;&lt;p&gt;I&amp;#39;m thinking of appropriate songs to play and I&amp;#39;d love to hear all your answers.&lt;\/p&gt;\\n&lt;\/div&gt;&lt;!-- SC_ON --&gt;\", \"selftext\": \"I\'m thinking of appropriate songs to play and I\'d love to hear all your answers.\", \"likes\": null, \"link_flair_text\": null, \"id\": \"185my8\", \"clicked\": false, \"title\": \"Hi Reddit, from the International Space Station. Tonight I was playing the guitar here and thought of a question for you. If you could have me play one song here in space, what would it be?\", \"num_comments\": 4843, \"score\": 2759, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qh1u\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 10108, \"saved\": false, \"is_self\": true, \"permalink\": \"\/r\/Music\/comments\/185my8\/hi_reddit_from_the_international_space_station\/\", \"name\": \"t3_185my8\", \"created\": 1360388999.0, \"url\": \"http:\/\/www.reddit.com\/r\/Music\/comments\/185my8\/hi_reddit_from_the_international_space_station\/\", \"author_flair_text\": null, \"author\": \"ColChrisHadfield\", \"created_utc\": 1360360199.0, \"media\": null, \"num_reports\": null, \"ups\": 12867}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"businessinsider.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"offbeat\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186ywd\", \"clicked\": false, \"title\": \"Silly Banking Error Costs Woman $36,000\", \"num_comments\": 23, \"score\": 88, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qh11\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 29, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/offbeat\/comments\/186ywd\/silly_banking_error_costs_woman_36000\/\", \"name\": \"t3_186ywd\", \"created\": 1360450487.0, \"url\": \"http:\/\/www.businessinsider.com\/silly-banking-error-costs-woman-36000-2013-2\", \"author_flair_text\": null, \"author\": \"TheLordB\", \"created_utc\": 1360421687.0, \"media\": null, \"num_reports\": null, \"ups\": 117}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"i.imgur.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"apple\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186eal\", \"clicked\": false, \"title\": \"My favorite Apple laptop. The size and keyboard were amazing. \", \"num_comments\": 156, \"score\": 524, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qh1f\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 210, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/apple\/comments\/186eal\/my_favorite_apple_laptop_the_size_and_keyboard\/\", \"name\": \"t3_186eal\", \"created\": 1360413597.0, \"url\": \"http:\/\/i.imgur.com\/Xy0e6ci.jpg\", \"author_flair_text\": null, \"author\": \"donutdude246\", \"created_utc\": 1360384797.0, \"media\": null, \"num_reports\": null, \"ups\": 734}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"i.imgur.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"canada\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"185obt\", \"clicked\": false, \"title\": \"A photo of people shoveling on the 401... No need for plows.\", \"num_comments\": 155, \"score\": 1098, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qh68\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 293, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/canada\/comments\/185obt\/a_photo_of_people_shoveling_on_the_401_no_need\/\", \"name\": \"t3_185obt\", \"created\": 1360389991.0, \"url\": \"http:\/\/i.imgur.com\/rO2jHx4.jpg\", \"author_flair_text\": null, \"author\": \"Tm0\", \"created_utc\": 1360361191.0, \"media\": null, \"num_reports\": null, \"ups\": 1391}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"fosdem.org\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"linux\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186rys\", \"clicked\": false, \"title\": \"Free, open, secure and convenient communications. Can we finally replace Skype, Viber, Twitter and Facebook?\", \"num_comments\": 53, \"score\": 101, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qh1a\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 44, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/linux\/comments\/186rys\/free_open_secure_and_convenient_communications\/\", \"name\": \"t3_186rys\", \"created\": 1360435874.0, \"url\": \"https:\/\/fosdem.org\/2013\/schedule\/event\/free_open_secure_communications\/\", \"author_flair_text\": null, \"author\": \"whitefangs\", \"created_utc\": 1360407074.0, \"media\": null, \"num_reports\": null, \"ups\": 145}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"imgur.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"battlestations\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186hqc\", \"clicked\": false, \"title\": \"So I heard you like RGB LED\'s... \", \"num_comments\": 21, \"score\": 233, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"http:\/\/c.thumbs.redditmedia.com\/VFO6PBjwtaH7cxDz.jpg\", \"subreddit_id\": \"t5_2rdbn\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 47, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/battlestations\/comments\/186hqc\/so_i_heard_you_like_rgb_leds\/\", \"name\": \"t3_186hqc\", \"created\": 1360417452.0, \"url\": \"http:\/\/imgur.com\/a\/6Cm82\", \"author_flair_text\": null, \"author\": \"CalcProgrammer1\", \"created_utc\": 1360388652.0, \"media\": null, \"num_reports\": null, \"ups\": 280}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"jalopnik.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"google\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186s21\", \"clicked\": false, \"title\": \"Google Wants Self-Driving Car Tech Available Within Five Years\", \"num_comments\": 5, \"score\": 63, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qh45\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 11, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/google\/comments\/186s21\/google_wants_selfdriving_car_tech_available\/\", \"name\": \"t3_186s21\", \"created\": 1360436131.0, \"url\": \"http:\/\/jalopnik.com\/5982472\/google-wants-self+driving-car-tech-available-within-five-years\", \"author_flair_text\": null, \"author\": \"astroblueastro\", \"created_utc\": 1360407331.0, \"media\": null, \"num_reports\": null, \"ups\": 74}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"np.reddit.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"SubredditDrama\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186svf\", \"clicked\": false, \"title\": \"\\\"reddit if you woke up tomorrow as the opposite sex what would you miss the most\\\" has the obvious groups fighting back and forth in comments\", \"num_comments\": 33, \"score\": 43, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"default\", \"subreddit_id\": \"t5_2ss5b\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 11, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/SubredditDrama\/comments\/186svf\/reddit_if_you_woke_up_tomorrow_as_the_opposite\/\", \"name\": \"t3_186svf\", \"created\": 1360438182.0, \"url\": \"http:\/\/np.reddit.com\/r\/AskReddit\/comments\/185i99\/reddit_if_you_woke_up_tomorrow_and_were_the\/c8bscvh\", \"author_flair_text\": null, \"author\": \"kronikwasted\", \"created_utc\": 1360409382.0, \"media\": null, \"num_reports\": null, \"ups\": 54}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"espn.go.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"sports\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186y6s\", \"clicked\": false, \"title\": \"The Book of Coach: The most influential football coach of the past 30 years hated his legacy. The grind swallowed him. In the whooping and wet locker room after winning the Super Bowl, he wept alone, head in his hands, relieved it was over. But the minute he retired, he began to regret.\", \"num_comments\": 1, \"score\": 22, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qgzy\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 5, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/sports\/comments\/186y6s\/the_book_of_coach_the_most_influential_football\/\", \"name\": \"t3_186y6s\", \"created\": 1360449419.0, \"url\": \"http:\/\/espn.go.com\/espn\/print?id=8865286&amp;type=story\", \"author_flair_text\": null, \"author\": \"mjk1093\", \"created_utc\": 1360420619.0, \"media\": null, \"num_reports\": null, \"ups\": 27}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"jsdo.it\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"webdev\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186t5h\", \"clicked\": false, \"title\": \"Pure CSS Minesweeper (no JavaScript)\", \"num_comments\": 6, \"score\": 36, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"http:\/\/d.thumbs.redditmedia.com\/jAThtaeXxHQeMWgK.jpg\", \"subreddit_id\": \"t5_2qs0q\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 8, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/webdev\/comments\/186t5h\/pure_css_minesweeper_no_javascript\/\", \"name\": \"t3_186t5h\", \"created\": 1360438822.0, \"url\": \"http:\/\/jsdo.it\/No_1026\/urFs\", \"author_flair_text\": null, \"author\": \"Daniel15\", \"created_utc\": 1360410022.0, \"media\": null, \"num_reports\": null, \"ups\": 44}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"imgur.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"vinyl\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"185ezm\", \"clicked\": false, \"title\": \"Not much for autographed records but I thought some of you might appreciate this one...\", \"num_comments\": 54, \"score\": 545, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"http:\/\/f.thumbs.redditmedia.com\/JjS92H4ikhNVUe9Y.jpg\", \"subreddit_id\": \"t5_2qh7i\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 55, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/vinyl\/comments\/185ezm\/not_much_for_autographed_records_but_i_thought\/\", \"name\": \"t3_185ezm\", \"created\": 1360382842.0, \"url\": \"http:\/\/imgur.com\/a\/ezDhH\", \"author_flair_text\": null, \"author\": \"WeirdSailboat\", \"created_utc\": 1360354042.0, \"media\": null, \"num_reports\": null, \"ups\": 600}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"theonion.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"humor\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"18573n\", \"clicked\": false, \"title\": \"Sweating Obama Admits Drone Strikes Have Been Happening On Their Own\", \"num_comments\": 54, \"score\": 678, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qh34\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 476, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/humor\/comments\/18573n\/sweating_obama_admits_drone_strikes_have_been\/\", \"name\": \"t3_18573n\", \"created\": 1360376581.0, \"url\": \"http:\/\/www.theonion.com\/articles\/sweating-obama-admits-drone-strikes-have-been-happ,31219\/\", \"author_flair_text\": null, \"author\": \"But_Wait_Theres_More\", \"created_utc\": 1360347781.0, \"media\": null, \"num_reports\": null, \"ups\": 1154}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"youtube.com\", \"banned_by\": null, \"media_embed\": {\"content\": \"&lt;iframe width=\\\"600\\\" height=\\\"338\\\" src=\\\"http:\/\/www.youtube.com\/embed\/Z04GIhfID6s?feature=oembed\\\" frameborder=\\\"0\\\" allowfullscreen&gt;&lt;\/iframe&gt;\", \"width\": 600, \"scrolling\": false, \"height\": 338}, \"subreddit\": \"raspberry_pi\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186qxn\", \"clicked\": false, \"title\": \"Made some progress on my RPi-powered oscilloscope clock tonight..now I can zoom in and out! :)\", \"num_comments\": 4, \"score\": 36, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"http:\/\/a.thumbs.redditmedia.com\/EevRcglqU4b9Ia_H.jpg\", \"subreddit_id\": \"t5_2syto\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 7, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/raspberry_pi\/comments\/186qxn\/made_some_progress_on_my_rpipowered_oscilloscope\/\", \"name\": \"t3_186qxn\", \"created\": 1360433206.0, \"url\": \"http:\/\/www.youtube.com\/watch?v=Z04GIhfID6s\", \"author_flair_text\": null, \"author\": \"bpoag\", \"created_utc\": 1360404406.0, \"media\": {\"oembed\": {\"provider_url\": \"http:\/\/www.youtube.com\/\", \"description\": \"A complete code overhaul has yielded an engine capable of rendering a frame in less than one second. The discovery of the \\\"tremolo\\\" effect in sox will prove to be an elegant solution to any phosphor burn-in problems.\", \"title\": \"United Retrotronics R&amp;D Lab, 2\/8\/13\", \"url\": \"http:\/\/www.youtube.com\/watch?v=Z04GIhfID6s\", \"author_name\": \"bpoag\", \"height\": 338, \"width\": 600, \"html\": \"&lt;iframe width=\\\"600\\\" height=\\\"338\\\" src=\\\"http:\/\/www.youtube.com\/embed\/Z04GIhfID6s?feature=oembed\\\" frameborder=\\\"0\\\" allowfullscreen&gt;&lt;\/iframe&gt;\", \"thumbnail_width\": 480, \"version\": \"1.0\", \"provider_name\": \"YouTube\", \"thumbnail_url\": \"http:\/\/i3.ytimg.com\/vi\/Z04GIhfID6s\/hqdefault.jpg\", \"type\": \"video\", \"thumbnail_height\": 360, \"author_url\": \"http:\/\/www.youtube.com\/user\/bpoag\"}, \"type\": \"youtube.com\"}, \"num_reports\": null, \"ups\": 43}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"self.vim\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"vim\", \"selftext_html\": \"&lt;!-- SC_OFF --&gt;&lt;div class=\\\"md\\\"&gt;&lt;p&gt;I&amp;#39;m aware that this isn&amp;#39;t the first time something like this has been written\/posted but I figure I would share my configuration for those who want to squeeze a little more out of Vim as their Python editor of choice. Hopefully some people here will get something out of it.&lt;\/p&gt;\\n\\n&lt;p&gt;&lt;a href=\\\"http:\/\/unlogic.co.uk\/posts\/vim-python-ide.html\\\"&gt;http:\/\/unlogic.co.uk\/posts\/vim-python-ide.html&lt;\/a&gt;&lt;\/p&gt;\\n&lt;\/div&gt;&lt;!-- SC_ON --&gt;\", \"selftext\": \"I\'m aware that this isn\'t the first time something like this has been written\/posted but I figure I would share my configuration for those who want to squeeze a little more out of Vim as their Python editor of choice. Hopefully some people here will get something out of it.\\n\\nhttp:\/\/unlogic.co.uk\/posts\/vim-python-ide.html\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186oix\", \"clicked\": false, \"title\": \"Vim as a Python IDE\", \"num_comments\": 15, \"score\": 40, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qhqx\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 8, \"saved\": false, \"is_self\": true, \"permalink\": \"\/r\/vim\/comments\/186oix\/vim_as_a_python_ide\/\", \"name\": \"t3_186oix\", \"created\": 1360427604.0, \"url\": \"http:\/\/www.reddit.com\/r\/vim\/comments\/186oix\/vim_as_a_python_ide\/\", \"author_flair_text\": null, \"author\": \"squeedlyspooch\", \"created_utc\": 1360398804.0, \"media\": null, \"num_reports\": null, \"ups\": 48}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"imgur.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"macsetups\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"18729y\", \"clicked\": false, \"title\": \"iMac 27\\\" Setup w\/ Guitar\", \"num_comments\": 4, \"score\": 8, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"http:\/\/e.thumbs.redditmedia.com\/k4KtuXpNvrHttcbv.jpg\", \"subreddit_id\": \"t5_2tvx3\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 1, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/macsetups\/comments\/18729y\/imac_27_setup_w_guitar\/\", \"name\": \"t3_18729y\", \"created\": 1360454833.0, \"url\": \"http:\/\/imgur.com\/a\/wSAiH\", \"author_flair_text\": null, \"author\": \"ricohsuave\", \"created_utc\": 1360426033.0, \"media\": null, \"num_reports\": null, \"ups\": 9}}, {\"kind\": \"t3\", \"data\": {\"domain\": \"imgur.com\", \"banned_by\": null, \"media_embed\": {}, \"subreddit\": \"audiophile\", \"selftext_html\": null, \"selftext\": \"\", \"likes\": null, \"link_flair_text\": null, \"id\": \"186ius\", \"clicked\": false, \"title\": \"I\'m the guy with the cat on the RF-7 IIs. I finally got them out of the box and hooked up. \", \"num_comments\": 25, \"score\": 38, \"approved_by\": null, \"over_18\": false, \"hidden\": false, \"thumbnail\": \"\", \"subreddit_id\": \"t5_2qmiy\", \"edited\": false, \"link_flair_css_class\": null, \"author_flair_css_class\": null, \"downs\": 9, \"saved\": false, \"is_self\": false, \"permalink\": \"\/r\/audiophile\/comments\/186ius\/im_the_guy_with_the_cat_on_the_rf7_iis_i_finally\/\", \"name\": \"t3_186ius\", \"created\": 1360418893.0, \"url\": \"http:\/\/imgur.com\/Ij6tc7m\", \"author_flair_text\": null, \"author\": \"firitheryn\", \"created_utc\": 1360390093.0, \"media\": null, \"num_reports\": null, \"ups\": 47}}], \"after\": \"t3_186ius\", \"before\": null}}";
