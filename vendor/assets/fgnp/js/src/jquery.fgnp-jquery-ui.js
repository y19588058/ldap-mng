/*
 * jquery.fgnp-jquery-ui.js v2.0.1
 * Copyright 2016 FUJITSU LIMITED
 *=============================================================================================================*/

(function ($) {

  var globalMethods = {
    'fgnpResizable': function () {
      // Resizable border layout and modal box (Require jQuery UI)
      if (typeof $.fn.resizable !== 'undefined' && $('body').hasClass('fgnp-device-desktop')) {
        $('.fgnp-resizable').each(function () {
          var $this = $(this);
          var maxHeight = $this.data('resizable-max-height') || null;
          var maxWidth = $this.data('resizable-max-width') || null;
          var minHeight = $this.data('resizable-min-height') || null;
          var minWidth = $this.data('resizable-min-width') || null;
          var handles = (function () {
            if ($this.is('[class*="fgnp-pane-top"]')) return 's';
            if ($this.is('[class*="fgnp-pane-right"]')) return 'w';
            if ($this.is('[class*="fgnp-pane-bottom"]')) return 'n';
            if ($this.is('[class*="fgnp-pane-left"]')) return 'e';
            if ($this.is('.fgnp-modal-box')) return 's, w, n, e, se';
            return null;
          }());
          var containment = (function () {
            if ($this.is('.fgnp-pane-top, .fgnp-pane-right, .fgnp-pane-bottom, .fgnp-pane-left, .fgnp-modal-box')) return 'document';
            return null;
          }());
          $this.resizable({
            maxHeight: maxHeight,
            maxWidth: maxWidth,
            minHeight: minHeight,
            minWidth: minWidth,
            handles: handles,
            containment: containment
          });
        });
      }
      return this;
    },
    'fgnpSlider': function () {
      // Compatibility of fgnpSlider (Deprecated) (Require jQuery UI)
      if (typeof $.fn.slider !== 'undefined' && typeof $.fn.fgnpSlider === 'undefined') {
        $.fn.fgnpSlider = function () {
          this.addClass('fgnp-slider');
          return $.fn.slider.apply(this, arguments);
        };
      }
    }
  };

  $.fgnpJqueryUi = function (method, options) {
    if (globalMethods[method] != null) {
      return globalMethods[method].call(this, options);
    } else {
      throw new Error('Method ' + method + ' not found.');
    }
  };
})(jQuery);

/* JqueryUi Plugin ends here */
