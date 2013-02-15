var bbr = {
  formatPost: function(link, callback) {
    var linkTemplate = $('#linkTemplate').html();
    var domain = link.data.domain;
    var selfPost = domain === 'self.' + link.data.subreddit;
    if (!selfPost) {
      var len = domain.length;
      if (len > 20) {
        domain = domain.substring(0, domain.lastIndexOf('.'));
        var lastIndex = domain.lastIndexOf('.');
        if (lastIndex != -1)
          domain = domain.substring(lastIndex + 1);
      } else if (len > 10) {
        domain = domain.substring(0, domain.lastIndexOf('.'));
      }
    }

    var hasThumbnail = link.data.thumbnail !== '' && 
                       link.data.thumbnail !== 'nsfw' && 
                       link.data.thumbnail !== 'self' &&
                       link.data.thumbnail !== 'default';

    var linkTitle = selfPost ? link.data.title : '<a href="' + link.data.url + '">' + link.data.title + '</a>';
    if (link.data.over_18) 
      linkTitle += ' <span class="label label-important nsfw">nsfw</span>';

    var linkDescription = Mustache.to_html(hasThumbnail ? $('#titleWithThumbnail').html() : $('#titleWithoutThumbnail').html(),
                                           { title: linkTitle,
                                             numComments: link.data.num_comments,
                                             thumbnail: link.data.thumbnail });

    var html = Mustache.to_html(linkTemplate, 
                                { linkDescription: linkDescription,
                                  subreddit: link.data.subreddit,
                                  score: link.data.score,
                                  domain: domain,
                                  time: moment.unix(link.data.created_utc).fromNow(),
                                  author: link.data.author });
    var div = $('<div/>');
    div.html(html);
    $('.comments', div).click(function() {
      bb.pushScreen('comments.html', 'comments', { link: link });
    });

    $('.link-title', div).click(function() {
      // self-post goes straight to comments
      if (selfPost) {
        bb.pushScreen('comments.html', 'comments', { link: link });
      } else {
      }
    });

    callback(div);
  },

  formatComment: function(comment, op, callback) {
    if (typeof comment.data.body === 'undefined')
      return;

    var div = this._createCommentDiv(comment, op, 'comment');

    callback(div);

    this._appendReplies(comment, op);
  },

  _createCommentDiv: function(comment, op, className) {
    var div = $('<div/>');
    div.attr('id', comment.data.name);
    div.addClass(className);

    var author = comment.data.author;
    if (comment.data.author == op)
      author = '<span class="op">' + author + '</span>';

    var commentTemplate = $('#commentTemplate').html();
    var score = comment.data.ups - comment.data.downs;

    var html = Mustache.to_html(commentTemplate,
                                { body: SnuOwnd.getParser().render(comment.data.body),
                                  author: author,
                                  score: (score > 0 ? "+" : "") + score,
                                  time: moment.unix(comment.data.created_utc).fromNow() });

    div.html(html);
    if (score < -4)
      this._toggleComment(div.children()[0]);

    return div;
  },

  toggleComment: function(div) {
    var icon = $(div).children().children('i')[0];
    if (icon.className === 'icon-angle-right') {
      icon.className = 'icon-angle-down';
      $(div).next().show();
    } else {
      icon.className = 'icon-angle-right';
      $(div).next().hide();
    }
  },

  _appendReplies: function(comment, op) {
    var hasReplies = typeof comment.data.replies.data !== 'undefined';
    var thiz = this;

    if (hasReplies) {
      $.each(comment.data.replies.data.children, function(key, value) {
        if (typeof value.data.body === 'undefined')
          return;

        var div = thiz._createCommentDiv(value, op, 'reply');

        if (value.data.parent_id !== '') {
          div.appendTo('#' + value.data.parent_id);
        }

        thiz._appendReplies(value, op);
      });
    }
  },

  createSubredditTabOption: function(subreddit, callback) {
    var tab = document.createElement('div');
    tab.setAttribute('data-bb-type', 'action');
    tab.setAttribute('data-bb-style', 'tab');
    tab.setAttribute('data-bb-overflow', true);
    tab.setAttribute('data-bb-img', 'img/icons/ic_view_list.png');
    tab.setAttribute('id', 'tab-' + subreddit.data.display_name);
    tab.innerHTML = subreddit.data.display_name;
    tab.setAttribute('onclick', 'bbr.switchSubreddit(\'' + subreddit.data.display_name +  '\');');

    callback(tab);
  },

  switchSubreddit: function(subreddit) {
    $('#loading').show();
    $('#listing').empty();
    var thiz = this;
    app.listing(subreddit, function(post) {
      $('#loading').hide();
      $('#listing').show();
      thiz.formatPost(post, function(bbPost) {
        $(bbPost).appendTo('#listing');
      });
    });
  }
};
