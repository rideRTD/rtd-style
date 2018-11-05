(function($, appServer) {
  // make an async call to the CMS to get the news and alerts
  appServer = appServer || '//www3.rtd-denver.com';

  $.getScript(
    appServer.replace('http:', '') +
      'elbert/HomepageAlerts/getHomePageAlerts.cfm',
    function() {
      /* global homePageAlerts */
      var response = JSON.parse(homePageAlerts);

      if (response.ROWCOUNT > 0) {
        // Sitewide insert service alerts
        insertServicealert(response);
      }
    }
  );

  function insertServicealert(content) {
    var html = '';
    var url = '';
    var target = '';
    var link = '';
    var item = '';
    var i;

    // We add a bunch of crazy markup if there is more than one alert
    // So here we check how many alerts there are
    var alertCount = 0;
    for (i = 0; content.ROWCOUNT > i; i++) {
      if (content.DATA.STORM[i] === 1) {
        alertCount++;
      }
    }

    // loop over the JSON data from the dynamic server
    for (i = 0; content.ROWCOUNT > i; i++) {
      if (content.DATA.STORM[i] === 1) {
        url = '';
        target = '';
        link = '';
        linkClass = 'callout__link';

        // Check for each link variation and set variables accordingly
        if (content.DATA.DISP_TYPE[i] === 0) {
          // alert with landing page
          url = appServer + 'elbert/news/index.cfm?id=' + content.DATA.ID[i];
        } else if (content.DATA.DISP_TYPE[i] === 1) {
          // alert with link (same tab)
          url = content.DATA.LINK[i];
        } else if (content.DATA.DISP_TYPE[i] === 3) {
          // alert with link (new tab)
          url = content.DATA.LINK[i];
          target = ' target="_blank"';
        }

        if (alertCount === 1) {
          // if there is just one alert we make the link a button style
          linkClass += ' callout__link--btn';
        }

        // Link variables are set, so build the link if we need one
        if (content.DATA.DISP_TYPE[i] !== 2) {
          link =
            '<a class="' +
            linkClass +
            '" href="' +
            url +
            '" ' +
            target +
            '>' +
            (content.DATA.ACTION_TEXT[i] !== null
              ? content.DATA.ACTION_TEXT[i]
              : 'Read more') +
            '</a>';
        }

        // Use different markup if there is more than one alert
        if (alertCount === 1) {
          html +=
            '<div class="callout__inner">' +
            '<h2 class="callout__heading">' +
            '<button role="button" class="js-expander i i--tools-rideralerts">' +
            '<i class="i i--tools-rideralerts">' +
            content.DATA.ALERT_TITLE[i] +
            '</i>' +
            '</button>' +
            '</h2>' +
            '<div class="js-expandable">' +
            '<p class="callout__text">' +
            content.DATA.ALERT_DESCRIPTION[i] +
            '</p>' +
            link +
            '</div>' +
            '</div>';
        } else if (alertCount > 1) {
          html +=
            '<div class="callout__item">' +
            '<p class="callout__text">' +
            '<strong>' +
            content.DATA.ALERT_TITLE[i] +
            '</strong><br /> ' +
            content.DATA.ALERT_DESCRIPTION[i] +
            '<br /> ' +
            link +
            '</p>' +
            '</div>';
        }
      }
    }

    // End of the for loop, we now have the alert(s)

    // decorate the alert(s) with container markup
    if (alertCount === 1) {
      html =
        '<div role="alert" class="callout callout--emergency callout--expandable">' +
        html +
        '</div>';
    } else if (alertCount > 1) {
      html =
        '<div role="alert" class="callout callout--emergency callout--expandable">' +
        '<h2 class="callout__inner callout__inner--list callout__heading">' +
        '<button role="button" class="js-expander i i--tools-rideralerts">' +
        '<i class="i i--tools-rideralerts">' +
        'Service Alerts <span>(' +
        alertCount +
        ')</span>' +
        '</i>' +
        '</button>' +
        '</h2>' +
        '<div class="callout__inner callout__inner--list js-expandable">' +
        html +
        '</div>' +
        '</div>';
    }

    // Add the alert(s) onto the page
    //$(html).hide().prependTo('body').slideDown();

    $(html)
      .hide()
      .prependTo('body')
      .rtdExpandable()
      .slideDown();
  }
})(jQuery, appServer);
