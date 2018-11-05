/**
 * LOAD GOOGLE TRANSLATE
 * Load the google translate widget
 * When a user clicks on el#load-translate
 */

$(document).ready(function() {
  function loadTranslate() {
    // Google Website Translator requires the legacy ga.js to allow event tracking in google analytics
    $.getScript('https://ssl.google-analytics.com/ga.js', null);
    $.getScript(
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit',
      null
    );

    // Hide the load button so that the translate UI can replace it
    $('#load-translate').css('display', 'none');
  }

  if ($.cookie('rtd-translate')) {
    loadTranslate();
  }

  $('#load-translate').on('click', function() {
    loadTranslate();
    $.cookie('rtd-translate', 'true', { path: '/' });
  });
});

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'de,es,fr,it,ja,ko,ru,vi,zh-TW,ar,pl,tl',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      gaTrack: true,
      gaId: 'UA-11199061-1'
    },
    'google_translate_element'
  );
}
