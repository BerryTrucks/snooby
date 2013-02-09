var _subreddits = {
  onScreenReady: function(element, params) {
    var visited = _cache.itemExists('subreddit.visited');

    if (!visited) {
      _cache.setItem('subreddit.visited', true);
      _cache.setItem('subreddit.screenReady', true);
      _cache.setItem('subreddit.domReady', false);
      _cache.setItem('subreddit.selected', params.subreddit);
      _cache.setItem('subreddit.scrollTop', 0);
    }

    snooby.subreddits(function(subreddit) {
      bbr.createSubredditTabOption(subreddit, function(subredditTab) {
        element.getElementById('actionBar').appendChild(subredditTab);
      });
    });
  },

  onDomReady: function(element, params) {
    document.getElementById('actionBar').setSelectedTab(document.getElementById('tab-' + params.subreddit));
    if (_cache.getItem('subreddit.domReady') === true) {
      $('#loading').hide();
      console.log('loading subreddit listings from memory');

      var thiz = this;
      var cachedListing = _cache.getItem('subreddit.listing');
      $.each(cachedListing.data.children, function(index, value) {
        bbr.formatPost(value, function(bbPost) {
          $(bbPost).appendTo('#listing');
        });
        setTimeout(function() { thiz.scrollback(); }, 0);
      });

    } else {
      console.log('loading subreddit listings from reddit');
      _cache.setItem('subreddit.domReady', true);
      $('#loading').show();
      $('#listing').hide();
      snooby.listing(params.subreddit, function(post) {
        $('#loading').hide();
        $('#listing').show();
        bbr.formatPost(post, function(bbPost) {
          $(bbPost).appendTo('#listing');
        });
      });
    }
  },

  onUnload: function(element) {
    _cache.setItem('subreddit.scrollTop', $('#subreddit').children('div').eq(1).scrollTop());
  },

  scrollback: function() {
    $('#subreddit').children('div').eq(1).scrollTop(_cache.getItem('subreddit.scrollTop'));
    $('#listing').show();
  }
};
