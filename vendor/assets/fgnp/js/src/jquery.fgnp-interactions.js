/*
 * jquery.fgnp-interactions.js v2.0.1
 * Copyright 2016 FUJITSU LIMITED
 *=============================================================================================================*/

(function ($) {

  $.fn.fgnpKeyboardFocus = function (selector, options) {
    var $body = $('body');

    if (!$body.hasClass('fgnp-device-desktop')) {
      return this;
    }

    var $this = $(this);

    // Compatibile with V1
    if (this.length === 1 && $body[0] === $this[0]) {
      $this = $(document);
      selector = 'fgnp-button, fgnp-flat-button';
    } else if (selector === undefined) {
      return this;
    }

    var defaults = {
      keyFocusClass: 'fgnp-keyboard-focus',
      mouseFocusClass: 'fgnp-mouse-focus'
    };

    var opts = $.extend({}, defaults, options);

    var lastKey = new Date();
    var lastMouse = new Date();

    $this.off('.fgnpKeyboardFocus').on({
      'mousedown.fgnpKeyboardFocus': function () {
        lastMouse = new Date();
      },
      'keydown.fgnpKeyboardFocus': function () {
        lastKey = new Date();
      },
      'focusin.fgnpKeyboardFocus': function (e) {
        // Remove focus class
        $('.' + opts.keyFocusClass + ', .' + opts.mouseFocusClass).removeClass(opts.keyFocusClass + ' ' + opts.mouseFocusClass);
        if (lastMouse < lastKey) {
          // Add keyboard-focus class
          $(e.target).addClass(opts.keyFocusClass);
        } else {
          // Add mouse-focus class
          $(e.target).addClass(opts.mouseFocusClass);
        }
      },
      'focusout.fgnpKeyboardFocus': function () {
        // Remove focus class
        $('.' + opts.keyFocusClass + ', .' + opts.mouseFocusClass).removeClass(opts.keyFocusClass + ' ' + opts.mouseFocusClass);
      }
    }, selector);

    return this;
  };

  $.fn.fgnpTouchActive = function (selector, options) {
    if (selector === undefined) {
      return this;
    }

    var defaults = {
      class: 'fgnp-active'
    };

    var opts = $.extend({}, defaults, options);

    $(this).off('.fgnpActive').on({
      'touchstart.fgnpActive': function (e) {
        $(e.currentTarget).addClass(opts.class);
      },
      'touchend.fgnpActive': function (e) {
        $(e.currentTarget).removeClass(opts.class);
      }
    }, selector);

    return this;
  };

})(jQuery);

/* Interactions Plugin ends here */
