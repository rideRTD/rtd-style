/* global enquire, rtd */
(function(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
})(function() {
  var smallMenu,
    bigMenu,
    breakM = 'screen and (min-width:48em)';

  // Enquire decides which menu script to load, based on breakM media query
  enquire.register(
    breakM,
    {
      setup: function() {
        smallMenu = new rtd.DrawerMenu();
      },
      match: function() {
        smallMenu._destroy();
        bigMenu = new rtd.DropMenu();
      },
      unmatch: function() {
        bigMenu._destroy();
        smallMenu = new rtd.DrawerMenu();
      }
    },
    true
  ); // true flag for noquery fallbacks to match state
});
