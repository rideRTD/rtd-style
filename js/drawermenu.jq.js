import $ from 'jquery';

(function(window) {
  function DrawerMenu() {
    this._init();
  }

  DrawerMenu.prototype = {
    options: {
      slideDur: 400,
      accordion: true,
      menuID: 'navMain',
      toolsID: 'tools',
      menuTriggerID: 'triggerMenu',
      toolsTriggerID: 'triggerTools',
      navBtnClass: 'js-menu-btn',
      navLevelsClass: 'js-menu-level',
      triggersActiveClass: 'header__trigger--is-active',
      navBtnActiveClass: 'header__nav-btn--is-active'
    },

    _init: function() {
      var _this = this;

      // Create jQuery objects for all moving parts, based on options
      _this.$menu = $('#' + _this.options.menuID);
      _this.$tools = $('#' + _this.options.toolsID);
      _this.$menuTrigger = $('#' + _this.options.menuTriggerID);
      _this.$toolsTrigger = $('#' + _this.options.toolsTriggerID);
      _this.$triggers = $(
        '#' + _this.options.menuTriggerID + ', #' + _this.options.toolsTriggerID
      );
      _this.$navBtn = $('.' + _this.options.navBtnClass);
      _this.$navLevels = $('.' + _this.options.navLevelsClass);

      // Creates click event that disables touch scroll on target for fast click
      _this.triggerevents = 'click.drawermenu touchstart.drawermenu';

      // Click events that still allow touch scroll on target
      _this.navevents = 'click.drawermenu';

      _this._initEvents();
      _this._initAria();
    },

    _initEvents: function() {
      var _this = this;
      _this.$triggers.on(_this.triggerevents, function(event) {
        event.preventDefault();
        var touchFlag = false;
        if (!touchFlag) {
          touchFlag = true;
          setTimeout(function() {
            touchFlag = false;
          }, 100);

          var clicked = $(this);
          if (clicked.is(_this.$menuTrigger)) {
            _this._toggleMenu();
          } else if (clicked.is(_this.$toolsTrigger)) {
            _this._toggleTools();
          }
        }
      });

      _this.$navBtn.on(_this.navevents, function(event) {
        event.preventDefault();

        // Store the nav item that was clicked
        var theNavTrigger = $(this);

        // Store the menu that is paired with the clicked nav item
        var theNavLevel = theNavTrigger.next(_this.$navLevels);
        if (theNavLevel.is(':visible')) {
          _this._close(theNavTrigger, theNavLevel);
        } else {
          if (_this.options.accordion === true) {
            if (_this.$navLevels.is(':visible')) {
              // if a menu is open close everything except the new menu and its parents
              var otherLevels = _this.$navLevels
                .not(theNavLevel)
                .not(theNavLevel.parents('.' + _this.options.navLevelsClass));
              var otherTriggers = otherLevels.siblings();
              _this._close(otherTriggers, otherLevels);
            }
          }

          _this._open(theNavTrigger, theNavLevel);
        }
      });
    },

    _removeEvents: function() {
      var _this = this;
      _this.$toolsTrigger.add(_this.$menuTrigger).off(_this.triggerevents);
      _this.$navBtn.off(_this.navevents);
    },

    _initAria: function() {
      var _this = this;
      _this.$triggers.attr('aria-expanded', 'false');
      _this.$menuTrigger.attr('aria-controls', _this.options.menuID);
      _this.$toolsTrigger.attr('aria-controls', _this.options.toolsID);
      _this.$navBtn
        .attr('aria-expanded', 'false')
        .attr('aria-controls', function() {
          return $(this)
            .next('.' + _this.options.navLevelsClass)
            .attr('id');
        });

      _this.$navLevels
        .add(_this.$menu)
        .add(_this.$tools)
        .attr('aria-hidden', 'true');
    },

    _removeAria: function() {
      var _this = this;
      _this.$navBtn
        .add(_this.$triggers)
        .removeAttr('aria-expanded')
        .removeAttr('aria-controls');
      _this.$navLevels
        .add(_this.$menu)
        .add(_this.$tools)
        .removeAttr('aria-hidden');
    },

    _open: function(button, level) {
      var _this = this;
      button
        .addClass(_this.options.navBtnActiveClass)
        .attr('aria-expanded', 'true');
      level
        .stop(true, true)
        .slideDown(_this.options.slideDur)
        .attr('aria-hidden', 'false');
    },

    _close: function(button, level) {
      var _this = this;
      setTimeout(function() {
        button
          .removeClass(_this.options.navBtnActiveClass)
          .attr('aria-expanded', 'false');
      }, _this.options.slideDur);
      level
        .stop(true, true)
        .slideUp(_this.options.slideDur)
        .attr('aria-hidden', 'true');
    },

    _toggleTools: function() {
      var _this = this;

      if (
        _this.$toolsTrigger.attr('aria-expanded') === 'false' &&
        typeof ga !== 'undefined'
      ) {
        ga('send', 'event', 'Toolbar', 'Open', 'mobile');
      }

      _this.$toolsTrigger
        .toggleClass(_this.options.triggersActiveClass)
        .attr('aria-expanded', function(i, val) {
          return val === 'true' ? 'false' : 'true';
        });

      if (_this.$menu.is(':visible')) {
        _this.$menu.slideToggle(400).attr('aria-hidden', function(i, val) {
          return val === 'true' ? 'false' : 'true';
        });

        _this.$menuTrigger
          .removeClass(_this.options.triggersActiveClass)
          .attr('aria-expanded', 'false');
      }

      _this.$tools.slideToggle(400).attr('aria-hidden', function(i, val) {
        return val === 'true' ? 'false' : 'true';
      });
    },

    _toggleMenu: function() {
      var _this = this;
      _this.$menuTrigger
        .toggleClass(_this.options.triggersActiveClass)
        .attr('aria-expanded', function(i, val) {
          return val === 'true' ? 'false' : 'true';
        });

      if (_this.$tools.is(':visible')) {
        _this.$tools.slideToggle(400).attr('aria-hidden', function(i, val) {
          return val === 'true' ? 'false' : 'true';
        });

        _this.$toolsTrigger
          .removeClass(_this.options.triggersActiveClass)
          .attr('aria-expanded', 'false');
      }

      _this.$menu.slideToggle(400).attr('aria-hidden', function(i, val) {
        return val === 'true' ? 'false' : 'true';
      });
    },

    _destroy: function() {
      var _this = this;

      //turn off the click events and remove aria tags
      _this._removeEvents();
      _this._removeAria();

      // Remove any inline style attributes created by menu script
      _this.$tools
        .add(_this.$menu)
        .add(_this.$navLevels)
        .removeAttr('style');

      // Remove the active classes from all triggers
      _this.$triggers.removeClass(_this.options.triggersActiveClass);
      _this.$navBtn.removeClass(_this.options.navBtnActiveClass);
    }
  };

  // create the 'rtd' global if it doesn't exist yet
  window.rtd = window.rtd || {};
  window.rtd.DrawerMenu = DrawerMenu;
})(window);
