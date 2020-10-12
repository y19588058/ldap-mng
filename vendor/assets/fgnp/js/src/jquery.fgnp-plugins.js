/*
 * jquery.fgnp-plugins.js v2.0.1
 * Copyright 2016 FUJITSU LIMITED
 *=============================================================================================================*/

(function ($) {

  var globalMethods = {
    'fgnpAndroidSelect': function () {
      // http://getbootstrap.com/getting-started/#support-android-stock-browser
      var nua = navigator.userAgent;
      var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
      if (is_android) {
        $('select.fgnp-select').removeClass('fgnp-select').addClass('fgnp-select-android');
      }
    },
    'fgnpClearButton': function () {
      // Clear button hide or show
      $('input[type=text].fgnp-input').off('.fgnpInput').on('keyup.fgnpInput', function () {
        if (!$(this).parent().has('.fgnp-clear')) {
          return;
        }
        if ($(this).val() === '') {
          $(this).parent().children('.fgnp-clear').hide();
        } else {
          $(this).parent().children('.fgnp-clear').css('display', 'block');
        }
      });
      // Clear button functionality
      $('.fgnp-search .fgnp-clear, .fgnp-input-search .fgnp-clear').off('.fgnpClear').on('click.fgnpClear', function () {
        $(this).parent().children('.fgnp-input').val('').keyup();
      });
      return this;
    },
    'fgnpControlGroup': function () {
      $('.fgnp-control-group > li:not([data-wrapped])').wrapInner('<div></div>').attr('data-wrapped', true);
      return this;
    },
    'fgnpServiceBar': function () {
      $('.fgnp-service-bar .fgnp-system-info').hide();
      // the width of the system bar can be calculated only after all the images are loaded so the $(window).load function has to be used
      $(window).off('load.fgnpServiceBar').on('load.fgnpServiceBar', function () {
        // Resize Service Bar on PC.
        var setSystemInfoWidth = function () {
          var productImageLeft = 0;
          $('.fgnp-service-bar .fgnp-product-name').show();
          if ($('.fgnp-service-bar .fgnp-product-name').length) {
            productImageLeft = parseInt($('.fgnp-service-bar').css('padding-left').replace('px', '')) + $('.fgnp-service-bar .fgnp-product-name').outerWidth();
          }
          $('.fgnp-service-bar .fgnp-system-info').css({
            'position': 'absolute',
            'top': 0 + 'px',
            'left': productImageLeft + 'px'
          });

          $('.fgnp-service-bar .fgnp-system-info').outerWidth($('.fgnp-service-bar').width() - $('.fgnp-service-bar .fgnp-product-name').outerWidth() -
            $('.fgnp-service-bar .fgnp-system-action').outerWidth() - $('.fgnp-service-bar .fgnp-user-action').outerWidth() - $('.fgnp-service-bar .fgnp-logo').outerWidth());

          $('.fgnp-service-bar .fgnp-system-info').show();
        };
        setSystemInfoWidth();

        $(window).off('resize.fgnpServiceBar').on('resize.fgnpServiceBar', setSystemInfoWidth);
      });
    }
  };

  $.fgnpPlugins = function (method, options) {
    if (globalMethods[method] != null) {
      return globalMethods[method].call(this, options);
    } else {
      throw new Error('Method ' + method + ' not found.');
    }
  };
})(jQuery);

/* Plugins Plugin ends here */
