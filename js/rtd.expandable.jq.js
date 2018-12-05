import $ from 'jquery';

// This plugin requires jQuery
// The plugin provides an accessible expand collapse functionality
// The script depends on a button.js-expander located next to el.js-expandable (immediate siblings)
// When the button.js-expander is clicked, all sibling el.js-expandable either expand or collapse

$(function() {
  $.fn.rtdExpandable = function() {
    //store the this.$expanders and this.$expandables in the element

    var $element = $(this);
    var $expanders = $element.find('.js-expander');
    var $expandables = $element.find('.js-expandable');
    var uid = Math.floor(Math.random() * 10000);

    //only run the selectable functionality if its used in the element
    if ($expandables.length && $expanders.length) {
      // When js loads hide this.$expandables and set proper aria states
      $expanders.attr('aria-expanded', 'false');
      $expandables.attr('aria-hidden', 'true').hide();

      $expanders.each(function(i) {
        var $expander = $(this);
        var $expandable;
        if ($expander.attr('data-expandable')) {
          $expandable = $($expander.attr('data-expandable'));
        } else if (
          $expander
            .parent()
            .next()
            .hasClass('js-expandable')
        ) {
          $expandable = $expander.parent().next('.js-expandable');
        } else if ($expander.next().hasClass('js-expandable')) {
          $expandable = $expander.next('.js-expandable');
        } else if ($expander.prev().hasClass('js-expandable')) {
          $expandable = $expander.prev('.js-expandable');
        }

        var id = $expandable.is('[id]')
          ? $expandable.attr('id')
          : 'expandable-' + uid + '-' + i;
        $expander.attr('aria-controls', id);
        $expandable.attr('id', id);
      });

      // When one of the this.$expanders is clicked...
      $expanders.click(function() {
        // Store the clicked expander and its sibling expandable
        var $expander = $(this);
        var $expandable = $('#' + $expander.attr('aria-controls'));

        // If the clicked $expander is not expanded, then expand the $expandable and set proper aria states
        if ($expander.attr('aria-expanded') === 'false') {
          $expander.attr('aria-expanded', 'true');
          $expandable.attr('aria-hidden', 'false').slideDown(400);

          // If the clicked $expander is already expanded, then close the expandable and set proper aria states
        } else if ($expander.attr('aria-expanded') === 'true') {
          $expander.attr('aria-expanded', 'false');
          $expandable.attr('aria-hidden', 'true').slideUp(400);
        }
      });

      if (document.location.hash) {
        if ($expandables.filter(window.location.hash).length) {
          $expanders
            .filter(
              '[aria-controls="' + window.location.hash.replace('#', '') + '"]'
            )
            .click();
        }
      }
    }

    return this;
  };

  $(document).ready(function() {
    $('main').rtdExpandable();
  });
});
