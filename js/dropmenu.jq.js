(function(window) {
  function DropMenu() {
    // Initialize a new DropMenu
    this._init();
  }

  DropMenu.prototype = {
    options: {
      slideDur: 500,
      fadeDur: 300,
      navID: 'navMain',
      toolsID: 'tools',
      toolsToggleClass: 'tools__toggle',
      toolsToggleBtnClass: 'tools__toggle-btn',
      navBtnClass: 'js-menu-btn', // the nav buttons, filtered in _init to exclude nested
      navMenuClass: 'js-menu-level', // the nav menus, filtered in _init to exclude nested
      pageID: 'menu-dropper' // page content below the header
    },
    _init: function() {
      var _this = this;
      _this.$doc = $(document);
      _this.$nav = $('#' + _this.options.navID);
      _this.$page = $('#' + _this.options.pageID);

      _this.$navBtn = $('.' + _this.options.navBtnClass).not(
        $('.' + _this.options.navMenuClass).find(
          '.' + _this.options.navBtnClass
        )
      );
      _this.$navMenu = $('.' + _this.options.navMenuClass).not(
        $('.' + _this.options.navMenuClass).find(
          '.' + _this.options.navMenuClass
        )
      );

      _this.$tools = $('#' + _this.options.toolsID);
      _this.$toolsToggle = $('.' + _this.options.toolsToggleClass);
      _this.$toolsToggleBtn = $('.' + _this.options.toolsToggleBtnClass);

      _this.events = 'click.dropmenu touchstart.dropmenu';
      _this.offevents =
        'click.dropmenuoff touchstart.dropmenuoff focusin.dropmenuoff';

      // Set up the event watchers for the drop menu
      _this._initEvents();

      //Establish aria attributes for the drop menu
      _this._initAria();
    },

    _initEvents: function() {
      var _this = this;

      // The main event. Here we watch the top-level menu items for click,
      // on click we either (1) follow the link, (2) switch to a new menu, or (3) Open the menu
      _this.$navBtn.on(_this.events, function(event) {
        event.preventDefault();
        var touchFlag = false;
        if (!touchFlag) {
          touchFlag = true;
          setTimeout(function() {
            touchFlag = false;
          }, 100);

          var theNavItem = $(this); // Store the nav item that was clicked
          var theMenu = $(this).next('.' + _this.options.navMenuClass); // Store the menu that is paired with the clicked nav item

          if (theMenu.is(':visible')) {
            // 1. The clicked menu is already open, so follow the link
            location.href = $(this).attr('href');

            // Or alternatively we could close the open menu
            //_this._close(theNavItem,theMenu);
          } else {
            if (_this.$navMenu.is(':visible')) {
              // 2. Another menu is already open, so fade to the new menu
              _this._switch(theNavItem, theMenu);
            } else {
              // 3. No menus are open, so open this menu and watch for off clicks
              _this._open(theNavItem, theMenu);

              //Watch the document for 'off' clicks to close the menu
              _this.$doc.on(_this.offevents, function(event) {
                //event.preventDefault();
                var touchFlag = false;

                // This conditional checks to see if the menu is open,
                // and checks that the event isnt targeting the nav bar
                if (
                  !touchFlag &&
                  _this.$navMenu.is(':visible') &&
                  !_this.$nav.is(event.target) &&
                  _this.$nav.has(event.target).length === 0
                ) {
                  touchFlag = true;
                  setTimeout(function() {
                    touchFlag = false;
                  }, 100);

                  _this._close(_this.$navBtn, _this.$navMenu);
                  _this.$doc.off(_this.offevents);
                }
              });
            }
          }
        }
      });

      //Here we watch the tools button for clicks and either open or close the tool bar
      _this.$toolsToggleBtn.on(_this.events, function() {
        var touchFlag = false;
        if (!touchFlag) {
          touchFlag = true;
          setTimeout(function() {
            touchFlag = false;
          }, 100);

          _this.$tools.slideToggle(300);

          if (_this.$toolsToggleBtn.attr('aria-expanded') === 'true') {
            _this.$toolsToggleBtn.attr('aria-expanded', 'false');
            _this.$tools.attr('aria-hidden', 'true');
            _this.$toolsToggle.addClass(
              _this.options.toolsToggleClass + '--is-closed'
            );
          } else {
            _this.$toolsToggleBtn.attr('aria-expanded', 'true');
            _this.$tools.attr('aria-hidden', 'false');
            _this.$toolsToggle.removeClass(
              _this.options.toolsToggleClass + '--is-closed'
            );
            if (typeof ga !== 'undefined') {
              ga('send', 'event', 'Toolbar', 'Open', 'desktop');
            }
          }
        }
      });
    },

    _initAria: function() {
      var _this = this;
      _this.$navBtn
        .attr('aria-expanded', 'false')
        .attr('aria-controls', function() {
          return $(this)
            .next('.' + _this.options.navMenuClass)
            .attr('id');
        });

      _this.$navMenu.attr('aria-hidden', 'true');
      _this.$toolsToggleBtn
        .attr('aria-expanded', 'false')
        .attr('aria-controls', _this.options.toolsId);
      _this.$tools.attr('aria-hidden', 'true');
    },

    _removeAria: function() {
      var _this = this;
      _this.$navBtn.removeAttr('aria-expanded').removeAttr('aria-controls');
      _this.$navMenu.removeAttr('aria-hidden');
      _this.$toolsToggleBtn
        .removeAttr('aria-expanded')
        .removeAttr('aria-controls');
      _this.$tools.removeAttr('aria-hidden');
    },

    _open: function(nav, menu) {
      var _this = this;
      nav.addClass('active').attr('aria-expanded', 'true');
      menu
        .stop()
        .slideDown({
          duration: _this.options.slideDur,
          step: function(now, tween) {
            _this.$page.height($(tween.elem).outerHeight());
          }
        })
        .attr('aria-hidden', 'false');
    },

    _switch: function(nav, menu) {
      var _this = this;
      _this.$navMenu
        .filter(':visible')
        .stop()
        .fadeOut(_this.options.fadeDur)
        .attr('aria-hidden', 'true');
      _this.$navBtn.removeClass('active').attr('aria-expanded', 'false');
      nav.addClass('active').attr('aria-expanded', 'true');
      menu
        .stop()
        .fadeIn({
          duration: _this.options.fadeDur,
          start: function() {
            console.log(menu.outerHeight());
            _this.$page.stop().animate({
              height: menu.outerHeight(),
              duration: _this.options.fadeDur
            });
          }
        })
        .attr('aria-hidden', 'false');
    },

    _close: function(nav, menu) {
      var _this = this;
      setTimeout(function() {
        nav.removeClass('active').attr('aria-expanded', 'false');
      }, _this.options.slideDur);
      menu
        .stop()
        .slideUp({
          duration: _this.options.slideDur,
          step: function(now, tween) {
            _this.$page.height($(tween.elem).outerHeight());
          }
        })
        .attr('aria-hidden', 'true');
    },

    _destroy: function() {
      var _this = this;
      _this._removeAria();
      _this.$navBtn
        .removeClass('active')
        .attr('aria-expanded', 'false')
        .off(_this.events);
      _this.$tools.stop(true, true).removeAttr('style');
      _this.$toolsToggleBtn.off(_this.events);
      _this.$navMenu
        .stop(true, true)
        .removeAttr('style')
        .attr('aria-hidden', 'true');
      _this.$page.stop(true, true).height(0);
      _this.$doc.off(_this.offevents);
    }
  };

  // create the 'rtd' global if it doesn't exist yet
  window.rtd = window.rtd || {};
  window.rtd.DropMenu = DropMenu;
})(window);
