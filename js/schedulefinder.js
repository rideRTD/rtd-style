// create a new instance of Bloodhound suggestion engine using the getAjaxRouteAutoComplete endpoint

var autoComplete = new Bloodhound({
  name: 'scheduleFinder',
  limit: 20,
  prefetch: {
    url:
      appServer.replace('http:', '') +
      'schedules/ajax/getAjaxRouteAutoComplete.action?clearCache=true',
    cacheKey: 'routesList',
    filter: function(parsedResponse) {
      parsedResponse.schedules.push(
        { id: 'RockiesRide', url: staticServer + 'RockiesRide.shtml' },
        { id: 'BroncosRide', url: staticServer + 'BroncosRide.shtml' },
        { id: 'BuffRide', url: staticServer + 'BuffRide.shtml' },
        { id: 'RaceForTheCure', url: staticServer + 'RaceCure.shtml' },
        { id: 'CUvsCSU', url: staticServer + 'CUvsCSU.shtml' },
        { id: 'BolderBOULDER', url: staticServer + 'RunRide.shtml' },
        { id: 'Ski-n-Ride', url: staticServer + 'skiNRide.shtml' }
      );

      if (
        moment
          .tz('February 25th 2017 1AM', 'MMM Do YYYY hA', 'America/Denver')
          .isAfter()
      ) {
        parsedResponse.schedules.push({
          id: 'R Line (Light Rail)',
          url: staticServer + 'r-line-schedule-north-weekday.shtml'
        });
      }

      if (
        moment
          .tz('February 25th 2017 1AM', 'MMM Do YYYY hA', 'America/Denver')
          .isAfter()
      ) {
        parsedResponse.schedules.push({
          id: 'H Line Extension (Light Rail)',
          url: staticServer + 'h-line-schedule-north-weekday.shtml'
        });
      }

      for (i = 0; i < parsedResponse.schedules.length; i++) {
        parsedResponse.schedules[i].url = parsedResponse.schedules[
          i
        ].url.replace('appServer/', appServer);
      }

      // return the schedules object from the response, this is the list of routes
      return parsedResponse.schedules;
    },

    ajax: {
      type: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      jsonpCallback: 'schedulesAutoCompleteCallBack',
      contentType: 'application/json',
      jsonp: false,
      timeout: 5000
    }
  },

  datumTokenizer: function(d) {
    return Bloodhound.tokenizers.whitespace(d.id);
  },

  queryTokenizer: Bloodhound.tokenizers.whitespace
});

// Jsonp Callback is needed to satisfy the API
function schedulesAutoCompleteCallBack(data) {}

// Initialize the Bloodhound suggestion engine
autoComplete.initialize();

$(document).ready(function() {
  // Initialize typeahead on the Tools schedule finder using the bloodhound instance autoComplete
  $('#scheduleFinderTools')
    .typeahead(
      { hint: false },
      {
        displayKey: 'id',
        source: autoComplete.ttAdapter(),
        templates: {
          header: '',
          empty: '<div class="schedulefinder-empty">no routes</div>',
          suggestion: function(data) {
            var label =
              data.id.indexOf('Line') === -1 &&
              data.id.indexOf('Ride') === -1 &&
              data.id.indexOf('Flyer') === -1
                ? 'Route '
                : '';
            return (
              '<a href="' +
              data.url +
              "\" onclick=\"ga('send','event','Schedule finder','Tools','" +
              data.id +
              '\')">' +
              label +
              data.id +
              '</a>'
            );
          },

          footer: ''
        }
      }
    )
    .on('typeahead:selected', function($e, suggestion) {
      $e.preventDefault();
      window.location = suggestion.url;
    })
    .on('typeahead:updated', function($e, suggestion) {
      // This relies on some custom alternations to Typeahead.bundle.js (0.10.x)
      // added an 'updated' custom event that is triggered by the _updateHint method
      // This ensures that anytime the enter button is pressed or form is submitted
      // we are using the typeahead URLs rather than submitting to the fallback findSchedules.action
      if (suggestion) {
        var $form = $(this).closest('form');
        $form.off('submit');
        $form.on('submit', function(e) {
          e.preventDefault();
          window.location = suggestion.url;
        });
      }
    });
});
