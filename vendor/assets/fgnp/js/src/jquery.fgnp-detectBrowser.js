/*
 * jquery.fgnp-detectBrowser.js v2.0.1
 * Copyright 2016 FUJITSU LIMITED
 *=============================================================================================================*/

(function ($) {
  var ASPECT_RATIO = (4 / 3);
  var utilMethods = {
    /**
     * Returns true or false depending on if the device is has Windows installed on it
     *
     * @method isWindows
     * @return boolean
     */
    'isWindows': function () {
      return /Windows/i.test(navigator.userAgent);
    },

    /**
     * Returns true or false depending on if the device has Android installed on it
     *
     * @method isAndroid
     * @return boolean
     */
    'isAndroid': function () {
      return !utilMethods.isWindows() && /Android/i.test(navigator.userAgent);
    },

    /**
     * Returns true or false depending on if the device is an iPad
     *
     * @method isIpad
     * @return boolean
     */
    'isIpad': function () {
      return /iPad/.test(navigator.userAgent);
    },

    /**
     * Returns true or false depending on if the device is a RIM Tablet (Blackberry Playbook)
     *
     * @method isPlayBook
     * @reutrn boolean
     */
    'isBlackBerryTablet': function () {
      return /RIM Tablet/.test(navigator.userAgent);
    }
  };

  (function ($) {
    /**
     * If you call $.fgnpDetectBrowser(), it'll add classes to that body automatically.
     * And you can also call it's methods as such $.fgnpDetectBrowser('isMobile');
     * Methods you can call:
     *      isDesktop
     *      isMobile
     *      isTablet
     *
     * @method fgnpDetectBrowser
     * @return this or boolean
     */
    $.fgnpDetectBrowser = function (method) {

      if (publicMethods[method] != null) {
        return publicMethods[method].apply(this);
      } else {
        return privateMethods.execute.apply(this);
      }
    };

    var classes = {
      mobileClass: 'fgnp-device-mobile',
      tabletClass: 'fgnp-device-tablet',
      desktopClass: 'fgnp-device-desktop'
    };

    var publicMethods = {
      /**
       * Returns true or false depending on if the device is a desktop or not
       *
       * @method isDesktop
       * @return boolean
       */
      'isDesktop': function () {
        return !publicMethods.isMobile() && !publicMethods.isTablet();
      },

      /**
       * Returns true or false depending on if the device is a mobile or not
       *
       * @method isMobile
       * @return boolean
       */
      'isMobile': function () {
        //For some reason the iPad has "Mobile" in it's userAgent, while all Android tablet's do not
        return /Mobile/.test(navigator.userAgent) && !utilMethods.isIpad();
      },

      /**
       * Returns true or false depending on if the device is a tablet
       * This returns true for all androids that aren't phones, for RIM Tablet, for iPad,
       *
       * @method isTablet
       * @return boolean
       */
      'isTablet': function () {
        return (utilMethods.isAndroid() && !publicMethods.isMobile()) ||
          utilMethods.isIpad() ||
          utilMethods.isBlackBerryTablet();
      }
    };

    var privateMethods = {
      'execute': function () {
        if ($('body').data('device-support') !== undefined) {
          privateMethods.detect(parseInt($('body').data('device-support')));
        } else {
          privateMethods.detect();
        }

        return this;
      },

      'detect': function (patternNumber) {
        var detectObject;

        if (patternNumber == null) {
          patternNumber = 1;
        }

        switch (patternNumber) {
        case 1: // Desktop, tablet and mobile devices are supported - and selected/detected automatically
        default: // Other case
          detectObject = {
            'Desktop': classes.desktopClass,
            'Tablet': classes.tabletClass,
            'Mobile': classes.mobileClass
          };
          break;

        case 2: // Desktop and tablet devices are supported, mobile devices use tablet layout
          detectObject = {
            'Desktop': classes.desktopClass,
            'Tablet': classes.tabletClass,
            'Mobile': classes.tabletClass
          };
          break;

        case 3: // Desktop and mobile devices are supported, tablet devices use desktop layout
          detectObject = {
            'Desktop': classes.desktopClass,
            'Tablet': classes.desktopClass,
            'Mobile': classes.mobileClass
          };
          break;

        case 4: // Desktop and mobile devices are supported, tablet devices use mobile layout
          detectObject = {
            'Desktop': classes.desktopClass,
            'Tablet': classes.mobileClass,
            'Mobile': classes.mobileClass
          };
          break;

        case 5: // Tablet and mobile devices are supported, desktop devices use tablet layout
          detectObject = {
            'Desktop': classes.tabletClass,
            'Tablet': classes.tabletClass,
            'Mobile': classes.mobileClass
          };
          break;

        case 6: // Desktop only mode
          detectObject = {
            'Desktop': classes.desktopClass,
            'Tablet': classes.desktopClass,
            'Mobile': classes.desktopClass
          };
          break;

        case 7: // Tablet only mode
          detectObject = {
            'Desktop': classes.tabletClass,
            'Tablet': classes.tabletClass,
            'Mobile': classes.tabletClass
          };
          break;

        case 8: // Mobile only mode
          detectObject = {
            'Desktop': classes.mobileClass,
            'Tablet': classes.mobileClass,
            'Mobile': classes.mobileClass
          };
          break;
        }

        $('body').removeClass(classes.desktopClass + ' ' + classes.tabletClass + ' ' + classes.mobileClass)
          .addClass(publicMethods.isMobile() && detectObject.Mobile || publicMethods.isTablet() && detectObject.Tablet || publicMethods.isDesktop() && detectObject.Desktop);
      }
    };

    // Compatibility of detectBrowser ( $.fn.detectBrowser() is Deprecated )
    if (typeof $.fn.detectBrowser === 'undefined') {
      $.fn.detectBrowser = $.fgnpDetectBrowser;
    }

  })($);

  (function ($) {
    $.fgnpDetectOrientation = function (method) {
      if (publicMethods[method] != null) {
        return publicMethods[method].apply(this);
      } else {
        return privateMethods.execute.apply(this);
      }
    };

    var classes = {
      landscapeClass: 'fgnp-device-landscape',
      portraitClass: 'fgnp-device-portrait',
      desktopClass: 'fgnp-device-desktop'
    };

    var publicMethods = {
      'isLandscape': function () {
        if (!utilMethods.isAndroid() && window.orientation !== undefined &&
          (window.orientation === 90 || window.orientation === -90)) {
          return true;
        }

        if (window.innerWidth >= window.innerHeight * ASPECT_RATIO) {
          return true;
        }

        return false;
      },
      'isPortrait': function () {
        return !publicMethods.isLandscape();
      }
    };

    var privateMethods = {
      'execute': function () {
        $(window).off('orientationchange.fgnpDetectOrientation resize.fgnpDetectOrientation').on('orientationchange.fgnpDetectOrientation resize.fgnpDetectOrientation', function () {
          $.fgnpDetectOrientation();
        });

        var $body = $('body');
        if (!$body.hasClass(classes.desktopClass)) {

          $body.removeClass(classes.landscapeClass)
            .removeClass(classes.portraitClass);

          if (publicMethods.isLandscape()) {
            $body.addClass(classes.landscapeClass);
          } else {
            $body.addClass(classes.portraitClass);
          }
        }
        return this;
      }
    };

    // Compatibility of detectBrowser ( $.fn.fgnpDetectOrientation() is Deprecated )
    if (typeof $.fn.fgnpDetectOrientation === 'undefined') {
      $.fn.fgnpDetectOrientation = $.fgnpDetectOrientation;
    }

  })($);
})(jQuery);

/* DetectBrowser Plugin ends here */
