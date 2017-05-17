$(document).ready(function() {

    var breakM = 'screen and (min-width:48em)';
    var smallMenu;
    var bigMenu;

    /* global enquire, DrawerMenu, DropMenu  */

    // Enquire decides which menu script to load, based on breakM media query

    enquire.register(breakM, {
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
    }, true); // true flag for noquery fallbacks to match state

});
