/*!
 * FUJITSU GUI Next Plus UI Library v2.0.1
 * Copyright 2016 FUJITSU LIMITED
 */
if (typeof jQuery === 'undefined') {
  alert('Next Plus UI Library requires jQuery');
}

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

/*
 * jquery.fgnp-layout.js v2.0.1
 *=============================================================================================================*/

(function ($) {
  /*!
   * @preserve jLayout Border Layout - JavaScript Layout Algorithms v0.4
   *
   * Licensed under the new BSD License.
   * Copyright 2008-2009, Bram Stein
   * All rights reserved.
   */

  function borderLayout(spec) {
    var my = {},
      that = {},
      east = spec.east,
      west = spec.west,
      north = spec.north,
      south = spec.south,
      center = spec.center;

    my.hgap = spec.hgap || 0;
    my.vgap = spec.vgap || 0;

    that.items = function () {
      var items = [];
      if (east) {
        items.push(east);
      }

      if (west) {
        items.push(west);
      }

      if (north) {
        items.push(north);
      }

      if (south) {
        items.push(south);
      }

      if (center) {
        items.push(center);
      }
      return items;
    };

    that.layout = function (container) {
      var size = container.bounds(),
        insets = container.insets(),
        top = insets.top,
        bottom = size.height - insets.bottom,
        left = insets.left,
        right = size.width - insets.right,
        tmp;

      if (north && north.isVisible()) {
        tmp = north.preferredSize();
        north.bounds({
          'x': left,
          'y': top,
          'width': right - left,
          'height': tmp.height
        });
        north.doLayout();

        top += tmp.height + my.vgap;
      }
      if (south && south.isVisible()) {
        tmp = south.preferredSize();
        south.bounds({
          'x': left,
          'y': bottom - tmp.height,
          'width': right - left,
          'height': tmp.height
        });
        south.doLayout();

        bottom -= tmp.height + my.vgap;
      }
      if (east && east.isVisible()) {
        tmp = east.preferredSize();
        east.bounds({
          'x': right - tmp.width,
          'y': top,
          'width': tmp.width,
          'height': bottom - top
        });
        east.doLayout();

        right -= tmp.width + my.hgap;
      }
      if (west && west.isVisible()) {
        tmp = west.preferredSize();
        west.bounds({
          'x': left,
          'y': top,
          'width': tmp.width,
          'height': bottom - top
        });
        west.doLayout();

        left += tmp.width + my.hgap;
      }
      if (center && center.isVisible()) {
        center.bounds({
          'x': left,
          'y': top,
          'width': right - left,
          'height': bottom - top
        });
        center.doLayout();
      }
      return container;
    };

    function typeLayout(type) {
      return function (container) {
        var insets = container.insets(),
          width = 0,
          height = 0,
          type_size;

        if (east && east.isVisible()) {
          type_size = east[type + 'Size']();
          width += type_size.width + my.hgap;
          height = type_size.height;
        }
        if (west && west.isVisible()) {
          type_size = west[type + 'Size']();
          width += type_size.width + my.hgap;
          height = Math.max(type_size.height, height);
        }
        if (center && center.isVisible()) {
          type_size = center[type + 'Size']();
          width += type_size.width;
          height = Math.max(type_size.height, height);
        }
        if (north && north.isVisible()) {
          type_size = north[type + 'Size']();
          width = Math.max(type_size.width, width);
          height += type_size.height + my.vgap;
        }
        if (south && south.isVisible()) {
          type_size = south[type + 'Size']();
          width = Math.max(type_size.width, width);
          height += type_size.height + my.vgap;
        }

        return {
          'width': width + insets.left + insets.right,
          'height': height + insets.top + insets.bottom
        };
      };
    }
    that.preferred = typeLayout('preferred');
    that.minimum = typeLayout('minimum');
    that.maximum = typeLayout('maximum');
    return that;
  }
  /*! jLayout Border Layout ends here */

  /*!
   * @preserve jLayout JQuery Plugin v0.17
   *
   * Licensed under the new BSD License.
   * Copyright 2008-2009 Bram Stein
   * All rights reserved.
   */

  /**
   * This wraps jQuery objects in another object that supplies
   * the methods required for the layout algorithms.
   */
  function wrap(item, resize) {
    var that = {};

    $.each(['min', 'max'], function (i, name) {
      that[name + 'imumSize'] = function () {
        var l = item.data('fgnplayout');
        if (l) {
          return l[name + 'imum'](that);
        } else {
          var result = {};
          $.each(['width', 'height'], function (i, propName) {
            // Check max-width, min-width, max-height or min-height.
            var cssValue = parseInt(item.css(name + '-' + propName), 10);
            if (isNaN(cssValue)) {
              if (name === 'max') {
                cssValue = Number.MAX_VALUE;
              } else {
                cssValue = 0;
              }
            }
            result[propName] = cssValue;
          });
          return result;
        }
      };
    });

    $.extend(that, {
      doLayout: function () {
        var l = item.data('fgnplayout');
        if (l) {
          l.layout(that);
        }
        item.css({
          position: 'absolute'
        });
      },
      isVisible: function () {
        return item.is(':visible');
      },
      insets: function () {
        var padding = {
          'top': parseInt(item.css('padding-top'), 10) || 0,
          'bottom': parseInt(item.css('padding-bottom'), 10) || 0,
          'left': parseInt(item.css('padding-left'), 10) || 0,
          'right': parseInt(item.css('padding-right'), 10) || 0
        };
        var border = {
          'top': parseInt(item.css('border-top-width'), 10) || 0,
          'bottom': parseInt(item.css('border-bottom-width'), 10) || 0,
          'left': parseInt(item.css('border-left-width'), 10) || 0,
          'right': parseInt(item.css('border-right-width'), 10) || 0
        };

        return {
          'top': padding.top,
          'bottom': padding.bottom + border.bottom + border.top,
          'left': padding.left,
          'right': padding.right + border.right + border.left
        };
      },
      bounds: function (value) {
        var tmp = {};

        if (value) {
          if (typeof value.x === 'number') {
            tmp.left = value.x;
          }
          if (typeof value.y === 'number') {
            tmp.top = value.y;
          }
          if (typeof value.width === 'number') {
            tmp.width = (value.width - (item.outerWidth(true) - item.width()));
            tmp.width = (tmp.width >= 0) ? tmp.width : 0;
          }
          if (typeof value.height === 'number') {
            tmp.height = value.height - (item.outerHeight(true) - item.height());
            tmp.height = (tmp.height >= 0) ? tmp.height : 0;
          }
          item.css(tmp);
          return item;
        } else {
          tmp = item.position();
          return {
            'x': tmp.left,
            'y': tmp.top,
            'width': item.outerWidth(false),
            'height': item.outerHeight(false)
          };
        }
      },
      preferredSize: function () {
        var minSize,
          maxSize,
          margin = {
            'top': parseInt(item.css('margin-top'), 10) || 0,
            'bottom': parseInt(item.css('margin-bottom'), 10) || 0,
            'left': parseInt(item.css('margin-left'), 10) || 0,
            'right': parseInt(item.css('margin-right'), 10) || 0
          },
          size = {
            width: 0,
            height: 0
          },
          l = item.data('fgnplayout');

        if (l && resize) {
          size = l.preferred(that);

          minSize = that.minimumSize();
          maxSize = that.maximumSize();

          size.width += margin.left + margin.right;
          size.height += margin.top + margin.bottom;

          if (size.width < minSize.width || size.height < minSize.height) {
            size.width = Math.max(size.width, minSize.width);
            size.height = Math.max(size.height, minSize.height);
          } else if (size.width > maxSize.width || size.height > maxSize.height) {
            size.width = Math.min(size.width, maxSize.width);
            size.height = Math.min(size.height, maxSize.height);
          }
        } else {
          size = that.bounds();
          size.width += margin.left + margin.right;
          size.height += margin.top + margin.bottom;
        }
        return size;
      }
    });
    return that;
  }

  var defaults = {
    resize: true,
    type: 'border',
    hgap: 0,
    vgap: 0,

    sectionOverrides: {},

    defaultSectionOverrides: {
      'fgnp-pane-top': 'north',
      'fgnp-pane-bottom': 'south',
      'fgnp-pane-right': 'east',
      'fgnp-pane-left': 'west',
      'fgnp-pane-center': 'center',
      'fgnp-pane-top-inner': 'north',
      'fgnp-pane-bottom-inner': 'south',
      'fgnp-pane-right-inner': 'east',
      'fgnp-pane-left-inner': 'west',
      'fgnp-pane-center-inner': 'center'
    }
  };

  function execLayout($targets, options) {
    var opts = $.extend({}, defaults, options);

    //We don't want someone adding thier overrides in sectionOverrides, and then loosing all of the default ones
    opts['sectionOverrides'] = $.extend({}, opts['sectionOverrides'], opts['defaultSectionOverrides']);

    var elementsToWatch = ['north', 'south', 'west', 'east', 'center'];
    $.each(opts['sectionOverrides'], function (k) {
      elementsToWatch.push(k);
    });

    $.each($targets, function () {
      var $element = $(this),
        o = ($element.data('layout')) ? $.extend(opts, $element.data('layout')) : opts,
        elementWrapper = wrap($element, o.resize);

      $.each(elementsToWatch, function (i, name) {
        if ($element.children().hasClass(name)) {
          if (opts['sectionOverrides'][name] !== undefined) {
            o[opts['sectionOverrides'][name]] = wrap($element.children('.' + name + ':first'));
          } else {
            o[name] = wrap($element.children('.' + name + ':first'));
          }
        }
      });

      $element.data('fgnplayout', borderLayout(o));

      if (o.resize) {
        elementWrapper.bounds(elementWrapper.preferredSize());
      }
      elementWrapper.doLayout();
      $element.css({
        position: 'relative'
      });
    });

    $.each($targets, function () {
      var $element = $(this),
        o = ($element.data('layout')) ? $.extend(opts, $element.data('layout')) : opts,
        elementWrapper = wrap($element, o.resize);

      $.each(elementsToWatch, function (i, name) {
        if ($element.children().hasClass(name)) {
          if (opts['sectionOverrides'][name] !== undefined) {
            o[opts['sectionOverrides'][name]] = wrap($element.children('.' + name + ':first'));
          } else {
            o[name] = wrap($element.children('.' + name + ':first'));
          }
        }
      });

      $element.data('fgnplayout', borderLayout(o));
      elementWrapper.doLayout();
      $element.css({
        position: 'relative'
      });
    });

    if (opts.resize) {
      if (!$('body').hasClass('fgnp-device-mobile')) {
        $(window).off('resize.fgnpLayout').on('resize.fgnpLayout', relayout);
        relayout();
      }
    }
  }

  function relayout() {
    execLayout($('.fgnp-layout'),{
      resize: false
    });
    $('.fgnp-scrollable, .fgnp-accordion.fgnp-single').fgnpScrollable();
  }

  $.fgnpLayout = function (method) {
    if (method === 'relayout') {
      relayout();
    } else {
      execLayout($('.fgnp-layout-inner'));
    }
    return this;
  };

  /*! jLayout JQuery Plugin  ends here */
}(jQuery));

(function ($) {
  /**
   * Adjust the size of scrollables in the given elements
   * For options taken, see $.fn.adjustScrollSize.defaults
   *
   * @name $.fn.adjustScrollSize
   * @param options
   */
  $.fn.fgnpScrollable = function (options) {

    if ($('body').hasClass('fgnp-device-mobile')) {
      $(this).removeClass('fgnp-scrollable')
        .addClass('fgnp-scrollable-mobile');
      return this;
    }

    options = $.extend({}, $.fn.fgnpScrollable.defaults, options);

    var selector = $(this).selector;

    $.each(options, function (key, value) {
      options[key] = value.replace('{#selector#}', selector);
    });

    var $parents = [];
    $(this).each(function () {
      if ($.inArray($(this).parent().get(0), $parents) === -1) {
        $parents.push($(this).parent().get(0));
      }
    });

    $.each($parents, function () {
      var $parent = $(this);

      if (!($parent.data('accordion') !== undefined && $parent.data('accordion').multiple === true)) {

        var remaining = $parent.height();

        var $children;
        if ($parent.hasClass('fgnp-modal-box') || $parent.hasClass('fgnp-tab-content') || $parent.hasClass('fgnp-accordion')) {
          $children = $parent.children(options.outerSelector);
        } else {
          $children = $parent.children(options.outerSelectorVisible);
        }

        $children.each(function () {
          if ($(this).hasClass('ui-resizable-handle')) {
            return;
          }

          remaining -= $(this).outerHeight(true);
        });

        var scrolls = $parent.children(options.scrollableSelector);

        scrolls.each(function () {
          $(this).outerHeight(remaining);
        });
      }
    });

    return $(this);
  };

  /**
   * The default options for this plugin
   *
   * @name $.fn.adjustScrollSize.defaults
   * @property {string} outerSelector
   * @property {string} scrollableSelector
   */
  $.fn.fgnpScrollable.defaults = {
    outerSelectorVisible: ':not({#selector#}):visible',
    outerSelector: ':not({#selector#})',
    scrollableSelector: '{#selector#}'
  };

})(jQuery);

(function ($) {
  $.fn.fgnpLayoutToggle = function (options) {

    var opts = $.extend({}, $.fn.fgnpLayoutToggle.defaults, options);
    var targetElem, elemWidth, elemHeight;

    function layout_complete() {
      $.fgnpLayout('relayout');
    }

    function layout_step_width() {
      if (parseInt($(targetElem).width()) !== elemWidth) {
        $.fgnpLayout('relayout');
      }
    }

    function layout_step_height() {
      if (parseInt($(targetElem).height()) !== elemHeight) {
        $.fgnpLayout('relayout');
      }
    }

    this.off('click.fgnpLayoutToggle').on('click.fgnpLayoutToggle', function () {
      targetElem = '.' + $(this).data('layout-toggle');

      if (targetElem.indexOf('left') > 0 || targetElem.indexOf('right') > 0) {
        if ($(targetElem).is(':visible')) elemWidth = $(targetElem).width();
        $(targetElem).animate({
          width: opts.animation
        }, {
          duration: opts.duration,
          complete: layout_complete,
          step: layout_step_width
        });
      } else {
        if ($(targetElem).is(':visible')) elemHeight = $(targetElem).height();
        $(targetElem).animate({
          height: opts.animation
        }, {
          duration: opts.duration,
          complete: layout_complete,
          step: layout_step_height
        });
      }
    });

    return this;
  };

  $.fn.fgnpLayoutToggle.defaults = {
    animation: 'toggle',
    duration: 500
  };

})(jQuery);

// fgnpPages
(function ($) {
  var classNames = {
    'allPaneSelector': '.fgnp-pane-left, .fgnp-pane-center, .fgnp-pane-right, .fgnp-pane-bottom',
    'pageClass': 'fgnp-mobile-page',
    'pageSelector': '.fgnp-mobile-page',
    'currentPageSelector': '.fgnp-current',
    'currentPage': 'fgnp-current',
    'toPaneNameToPaneNameSelector': {
      'fgnp-pane-to-left': '.fgnp-pane-left',
      'fgnp-pane-to-center': '.fgnp-pane-center',
      'fgnp-pane-to-right': '.fgnp-pane-right'
    },
    'paneToClasses': ['fgnp-pane-to-left', 'fgnp-pane-to-center', 'fgnp-pane-to-right']
  };

  var privateMethods = {
    'execute': function () {
      if ($('body').hasClass('fgnp-device-mobile')) {
        var isAlreadySetCurrentPage = false;
        $(classNames.allPaneSelector).addClass(classNames.pageClass)
          .each(function () {
            if ($(this).hasClass(classNames.currentPage)) {
              isAlreadySetCurrentPage = true;
              return false;
            }
          });
        if (!isAlreadySetCurrentPage) {
          $('.fgnp-pane-center').addClass(classNames.currentPage);
        }

        for (var i = 0; i < classNames.paneToClasses.length; i++) {
          var paneToClass = classNames.paneToClasses[i];
          $(document).off('click.fgnpPages_' + paneToClass, '.' + paneToClass)
            .on('click.fgnpPages_' + paneToClass, '.' + paneToClass, $.proxy($.fgnpPages, $, 'selectPage', {
              page: paneToClass
            }));
        }
      }

      return this;
    }
  };

  var methods = {
    'selectPage': function (options) {
      var $pages = $(classNames.pageSelector);
      var $nextPage = $pages.filter(classNames.toPaneNameToPaneNameSelector[options.page]);

      if ($nextPage.length) {
        $pages.filter(classNames.currentPageSelector).removeClass(classNames.currentPage);
        $nextPage.addClass(classNames.currentPage);
      }

      return this;
    },

    'destroy': function () {
      if ($('body').hasClass('fgnp-device-mobile')) {
        for (var i = 0; i < classNames.paneToClasses.length; i++) {
          var paneToClass = classNames.paneToClasses[i];
          $(document).off('click.fgnpPages_' + paneToClass, '.' + paneToClass);
        }
      }

      return this;
    }
  };

  $.fgnpPages = function (method, options) {
    if (method == null) {
      return privateMethods.execute(options);
    }

    if (methods[method] != null) {
      return methods[method](options);
    }
  };
})(jQuery);


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

/*
 * jquery.fgnp-accordion.js v2.0.1
 * Copyright 2016 FUJITSU LIMITED
 *=============================================================================================================*/

(function ($) {
  /**
   * $(element).accordion();
   * @param options
   * @param options.multiple - Boolean, whether or not multiple tabs can be opened at once
   * @returns {*}
   */
  $.fn.fgnpAccordion = function (options) {
    /*
     * selectors.linkSelector - The jQuery selector to find the links that open/close divs
     * selectors.partnerSelector - Find the partner div to the link clicked
     * selectors.currentSelector - Find the current div
     * selectors.currentClass - The class name for panels and tabs that are selected
     * selectors.singleClass - The class to add if the accordion is single only
     */
    var selectors = {
      linkSelector: ' > .fgnp-accordion-header',
      partnerSelector: ' + ',
      currentSelector: ' > .fgnp-current',
      currentClass: 'fgnp-current',
      singleClass: 'fgnp-single'
    };
    var defaults = {
      multiple: true
    };

    function linearStep(now, animation) {
      var animationStart = animation.start;
      if (animationStart === 1) {
        animationStart = 0;
      }
      animation.now = (animation.end - animationStart) * animation.pos + animationStart;
    }

    var isMobileOrTablet = !$('body').hasClass('fgnp-device-desktop');
    var isMobile = $('body').hasClass('fgnp-device-mobile');

    $(this).each(function () {
      if (isMobile) {
        $(this).parent().css('height', 'auto');
      }

      var opts = $.extend({}, defaults, options);
      opts.collapsible = false;
      var data = $(this).data('accordion');

      var instOptions = $.extend(true, opts, data);

      if (instOptions.multiple) {
        instOptions.collapsible = true;
      } else {
        $(this).addClass(selectors.singleClass);
      }

      $(this).data('accordion', $.extend(true, {}, instOptions));

      //Go through all links, if they're not marked as current, hide their partner
      var $links = $(this).find(selectors.linkSelector);
      $links.each(function () {
        var $partner = $(this).find(selectors.partnerSelector);

        if (!$(this).hasClass(selectors.currentClass)) {
          $partner.hide();
        }
      });

      //Store the container in a local variable
      var $container = $(this);
      //When a link is clicked
      $links.off('click.fgnpAccordion').on('click.fgnpAccordion', function () {
        var instOptions = $container.data('accordion');
        //Get the div that the link is meant to open/close
        var $partner = $(this).find(selectors.partnerSelector);

        //Check if it's already open, so that we can determine whether or not to collapse it
        if ($(this).hasClass(selectors.currentClass)) {
          if (instOptions.collapsible) {
            $(this).removeClass(selectors.currentClass);
            if (!isMobileOrTablet) {
              $partner.slideUp().removeClass(selectors.currentClass);
            } else {
              $partner.hide();
            }
          }
          return false;
        }

        if (!instOptions.multiple) {
          //Deactivate currently activated divs, then activate the correct one
          var $active = $container.find(selectors.currentSelector);
          var $activePartner = $active.find(selectors.partnerSelector);

          $active.removeClass(selectors.currentClass);
          if (!isMobileOrTablet) {
            $activePartner.slideUp({
              easing: 'linear',
              step: linearStep
            });
          } else {
            $activePartner.hide();
            if ($active.offset()) {
              if ($('body').scrollTop() > $active.offset().top) {
                $('body').animate({
                  scrollTop: $(this).offset().top - 100
                });
              }
            }
          }
        }
        if (!isMobileOrTablet) {
          $partner.slideDown({
            easing: 'linear',
            step: linearStep
          });
        } else {
          $partner.show();
        }
        $(this).addClass(selectors.currentClass);

        return true;
      });
    });

    if (!isMobile) {
      $('.fgnp-scrollable, .fgnp-accordion.fgnp-single').fgnpScrollable();
    } else {
      $('.fgnp-scrollable').fgnpScrollable();
    }

    return this;
  };

})(jQuery);

/* Accordion Plugin ends here */

/*!
 * jquery.fgnp-datepicker.js v2.0.1
 * Optimised by FUJITSU LIMITED.
 * The original is Datepicker for Bootstrap:
 * =========================================================
 * bootstrap-datepicker.js
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

(function ($) {
  var MODE_EXPAND = 1;
  var MODE_SHRINK = -1;
  var DIRECTION_NEXT = 1;
  var DIRECTION_PREV = -1;
  var VIEWMODE_YEARS = 2;
  var VIEWMODE_MONTHS = 1;
  var VIEWMODE_DAYS = 0;

  var LocaleStrings = {
    en: {
      dates: {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      defFormat: 'mm/dd/yyyy'
    },
    ja: {
      dates: {
        days: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'],
        daysShort: ['日', '月', '火', '水', '木', '金', '土', '日'],
        daysMin: ['日', '月', '火', '水', '木', '金', '土', '日'],
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        yearSuffix: '年'
      },
      defFormat: 'yyyy/mm/dd'
    }
  };

  var Datepicker = function (element, options) {

    this.element = $(element);

    if (this.element.data('locale') !== undefined) {
      this.locale = this.element.data('locale');
    } else {
      this.locale = DPGlobal.locale;
    }
    this.dates = LocaleStrings[this.locale].dates;
    if (this.dates.yearSuffix === undefined) this.dates.yearSuffix = '';

    this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || LocaleStrings[this.locale].defFormat || 'mm/dd/yyyy');
    this.picker = $(DPGlobal.template)
      .appendTo('body')
      .on({
        click: $.proxy(this.click, this)
      });

    if (!$('body').hasClass('fgnp-device-mobile')) {
      this.picker.on({
        'mousewheel DOMMouseScroll touchmove': $.proxy(this.scroll, this)
      });
    }

    this.isInput = this.element.is('input');

    if (this.isInput) {
      if (!$('body').hasClass('fgnp-device-mobile') && !$('body').hasClass('fgnp-device-tablet')) {
        this.element.on({
          focus: $.proxy(this.show, this),
          keyup: $.proxy(this.update, this)
        });
      } else {
        this.element.on({
          click: $.proxy(this.show, this)
        });
        this.element.attr('readonly', true);
      }

    } else {
      if (this.element.find('a, button').length > 0) {
        this.triggerElement = this.element.find('a, button');
        this.triggerElement.on('click', $.proxy(this.show, this));
      }
    }

    this.minViewMode = options.minViewMode || this.element.data('date-minviewmode') || VIEWMODE_DAYS;
    if (typeof this.minViewMode === 'string') {
      switch (this.minViewMode) {
      case 'months':
        this.minViewMode = VIEWMODE_MONTHS;
        break;
      case 'years':
        this.minViewMode = VIEWMODE_YEARS;
        break;
      default:
        this.minViewMode = VIEWMODE_DAYS;
        break;
      }
    }
    this.viewMode = options.viewMode || this.element.data('date-viewmode') || VIEWMODE_DAYS;
    if (typeof this.viewMode === 'string') {
      switch (this.viewMode) {
      case 'months':
        this.viewMode = VIEWMODE_MONTHS;
        break;
      case 'years':
        this.viewMode = VIEWMODE_YEARS;
        break;
      default:
        this.viewMode = VIEWMODE_DAYS;
        break;
      }
    }
    this.startViewMode = this.viewMode;
    this.weekStart = options.weekStart || this.element.data('date-weekstart') || 0;
    this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
    this.onRender = options.onRender;
    this.fillDow();
    this.fillMonths();
    this.update();
    this.showTodayClear();
    this.showMode();

  };

  Datepicker.prototype = {
    constructor: Datepicker,

    show: function (e) {
      var that = this;
      if ($('body').hasClass('fgnp-device-mobile')) {
        this.picker.fgnpModal();
      } else {
        this.picker.show();
        this.height = this.element.outerHeight();
        this.place();
        $(window).on('resize.fgnp-datepicker', function () {
          that.hide();
        });
        $(document).on('mousewheel.fgnp-datepicker DOMMouseScroll.fgnp-datepicker', function () {
          that.hide();
        });
        $(document).on('mousedown.fgnp-datepicker touchstart.fgnp-dropdown', function (ev) {
          if ($(ev.target).closest('.fgnp-datepicker').length === 0) {
            that.hide();
          }
        });
      }

      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      this.element.trigger({
        type: 'show',
        date: this.date
      });
    },

    hide: function () {
      if ($('body').hasClass('fgnp-device-mobile')) {
        // close fgnpModal;
        this.picker.close();
      } else {
        this.picker.hide();
      }
      $(window).off('.fgnp-datepicker');
      $(document).off('.fgnp-datepicker');
      this.viewMode = this.startViewMode;
      this.showMode();
      if (!this.isInput) {
        $(document).off('mousedown.fgnp-datepicker', this.hide);
      }
      this.element.trigger({
        type: 'hide',
        date: this.date
      });
    },

    set: function () {
      var formated = DPGlobal.formatDate(this.date, this.format);
      if (!this.isInput) {
        this.element.find('input').prop('value', formated);

        if (this.element.find('.day').length > 0) {
          this.element.find('.day').prop('value', this.date.getDate());
        }
        if (this.element.find('.month').length > 0) {
          this.element.find('.month').prop('value', this.date.getMonth() + 1);
        }
        if (this.element.find('.year').length > 0) {
          this.element.find('.year').prop('value', this.date.getFullYear());
        }

      } else {
        this.element.prop('value', formated);
      }
    },

    setValue: function (newDate) {
      if (typeof newDate === 'string') {
        this.date = DPGlobal.parseDate(newDate, this.format);
      } else {
        this.date = new Date(newDate);
      }
      this.set();
      this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
      this.fill();
    },

    place: function () {
      var offset = this.element.offset();
      var pickerwidth = this.picker.outerWidth();
      var elementwidth = this.element.outerWidth();
      var pickerfinaltop, pickerfinalleft;

      if (this.isInput) {
        pickerfinalleft = offset.left;
      } else {
        pickerfinalleft = this.triggerElement.offset().left;
      }

      if ($(window).scrollLeft() > pickerfinalleft) {
        pickerfinalleft = $(window).scrollLeft();
      }
      if (pickerfinalleft + pickerwidth > ($(window).width() + $(window).scrollLeft())) {
        pickerfinalleft = $(window).width() + $(window).scrollLeft() - pickerwidth;
      }
      if (pickerfinalleft >= offset.left + elementwidth) {
        pickerfinalleft = offset.left + elementwidth;
      }
      if (pickerfinalleft + pickerwidth <= offset.left) {
        pickerfinalleft = offset.left - pickerwidth;
      }

      var pickerbottom = offset.top + this.height + this.picker.outerHeight();
      var windowbottom = $(window).height() - $(window).scrollTop();

      if (pickerbottom > windowbottom && (offset.top > (windowbottom - offset.top - this.height))) {
        pickerfinaltop = offset.top - this.picker.outerHeight();
      } else {
        pickerfinaltop = offset.top + this.height;
      }

      this.picker.css({
        top: pickerfinaltop,
        left: pickerfinalleft
      });
    },

    update: function (newDate) {
      var datadate = this.element.data('date');
      if (datadate === undefined) {
        datadate = DPGlobal.formatDate(new Date(), this.format);
      }
      this.date = DPGlobal.parseDate(
        typeof newDate === 'string' ? newDate : (this.isInput ? this.element.prop('value') : datadate),
        this.format
      );
      this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
      this.fill();
    },

    showTodayClear: function () {
      if (this.element.data('show-clear') !== true) {
        this.picker.find('span.fgnp-datepicker-clear').remove();
      }
      if (this.element.data('show-today') !== true) {
        this.picker.find('span.fgnp-datepicker-today').remove();
      }
    },

    fillDow: function () {
      var dowCnt = this.weekStart;
      var html = '<tr>';
      while (dowCnt < this.weekStart + 7) {
        html += '<th class="fgnp-datepicker-dow">' + this.dates.daysMin[(dowCnt++) % 7] + '</th>';
      }
      html += '</tr>';
      this.picker.find('.fgnp-datepicker-days thead').append(html);
    },

    fillMonths: function () {
      var html = '';
      var i = 0;
      while (i < 12) {
        html += '<span class="fgnp-datepicker-month">' + this.dates.monthsShort[i++] + '</span>';
      }
      this.picker.find('.fgnp-datepicker-months td').append(html);
    },

    fill: function () {
      var today = new Date(),
        todayd = today.getDate(),
        todaym = today.getMonth(),
        todayy = today.getFullYear();
      var d = new Date(this.viewDate),
        year = d.getFullYear(),
        month = d.getMonth(),
        currentDate = this.date.valueOf();
      this.picker.find('.fgnp-datepicker-days th:eq(1)')
        .text(this.formatYearMonth(year, this.dates.months[month]));
      var prevMonth = new Date(year, month - 1, 28, 0, 0, 0, 0),
        day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
      prevMonth.setDate(day);
      prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7) % 7);
      var nextMonth = new Date(prevMonth);
      nextMonth.setDate(nextMonth.getDate() + 42);
      nextMonth = nextMonth.valueOf();
      var html = [];
      var clsName,
        prevY,
        prevM;
      while (prevMonth.valueOf() < nextMonth) {
        if (prevMonth.getDay() === this.weekStart) {
          html.push('<tr>');
        }
        clsName = this.onRender(prevMonth);
        prevY = prevMonth.getFullYear();
        prevM = prevMonth.getMonth();
        if ((prevM < month && prevY === year) || prevY < year) {
          clsName += ' fgnp-datepicker-old';
        } else if ((prevM > month && prevY === year) || prevY > year) {
          clsName += ' fgnp-datepicker-new';
        }
        if (prevMonth.valueOf() === currentDate) {
          clsName += ' fgnp-datepicker-active';
        }
        if (todaym === month && todayy === year && prevMonth.getDate() === todayd && clsName !== ' fgnp-datepicker-old') { //highlighting ther actual day by GorgeD
          clsName += ' fgnp-datepicker-today';
        }
        html.push('<td class="fgnp-datepicker-day ' + clsName + '">' + prevMonth.getDate() + '</td>');
        if (prevMonth.getDay() === this.weekEnd) {
          html.push('</tr>');
        }
        prevMonth.setDate(prevMonth.getDate() + 1);
      }
      this.picker.find('.fgnp-datepicker-days tbody').empty().append(html.join(''));
      var currentYear = this.date.getFullYear();

      var months = this.picker.find('.fgnp-datepicker-months')
        .find('th:eq(1)')
        .text(year + this.dates.yearSuffix)
        .end()
        .find('span.fgnp-datepicker-month').removeClass('fgnp-datepicker-active');
      if (currentYear === year) {
        months.eq(this.date.getMonth()).addClass('fgnp-datepicker-active');
      }

      html = '';
      year = parseInt(year / 10, 10) * 10;
      var yearCont = this.picker.find('.fgnp-datepicker-years')
        .find('th:eq(1)')
        .text(year + this.dates.yearSuffix + '-' + (year + 9) + this.dates.yearSuffix)
        .end()
        .find('td');
      year -= 1;
      for (var i = -1; i < 11; i++) {
        html += '<span class="fgnp-datepicker-year' + (i === -1 || i === 10 ? ' fgnp-datepicker-old' : '') + (currentYear === year ? ' fgnp-datepicker-active' : '') + '">' + year + '</span>';
        year += 1;
      }
      yearCont.html(html);

      if (this.element.data('weekend-style') === true) {
        this.picker.find('.fgnp-datepicker-days tbody tr').each(function () {
          $(this).find('td').eq(0).addClass('fgnp-datepicker-weekend');
          $(this).find('td').eq(6).addClass('fgnp-datepicker-weekend');
        });
      }
    },

    click: function (e) {
      e.stopPropagation();
      e.preventDefault();
      var target = $(e.target).closest('span, td, th');
      if (target.length === 1) {
        var nodeName = target[0].nodeName.toLowerCase();
        if (nodeName === 'th') {
          if (target.hasClass('fgnp-datepicker-switch')) {
            // Click Expand Button
            this.showMode(MODE_EXPAND);
          }
        } else if (nodeName === 'span') {
          if (target.hasClass('fgnp-datepicker-month')) {
            this.onClickMonth(target);
          } else if (target.hasClass('fgnp-datepicker-clear')) {
            this.onClickClear();
          } else if (target.hasClass('fgnp-datepicker-today')) {
            this.onClickToday();
          } else if (target.parent().hasClass('fgnp-datepicker-next')) {
            this.onClickDirectionButton(DIRECTION_NEXT);
          } else if (target.parent().hasClass('fgnp-datepicker-prev')) {
            this.onClickDirectionButton(DIRECTION_PREV);
          } else {
            this.onClickYear(target);
          }
        } else if (nodeName === 'td') {
          if (target.hasClass('fgnp-datepicker-day') && !target.hasClass('fgnp-datepicker-disabled')) {
            this.onClickDay(target);
          }
        }
      }
    },

    onClickDirectionButton: function (direction) {
      this.viewDate['set' + DPGlobal.modes[this.viewMode].navFnc].call(
        this.viewDate,
        this.viewDate['get' + DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate) +
        DPGlobal.modes[this.viewMode].navStep * direction
      );
      this.fill();
    },

    onClickToday: function () {
      var today = new Date();
      var day = today.getDate();
      var month = today.getMonth();
      var year = today.getFullYear();
      this.date = new Date(year, month, day, 0, 0, 0, 0);
      this.viewDate = new Date(year, month, Math.min(28, day), 0, 0, 0, 0);
      this.fill();
      this.set();
      this.element.trigger({
        type: 'changeDate',
        date: this.date,
        viewMode: DPGlobal.modes[this.viewMode].clsName
      });
    },

    onClickClear: function () {
      if (this.element.find('input').length > 0) {
        this.element.find('input').val('');
      } else {
        this.element.val('');
      }
      this.hide();
    },

    onClickYear: function (target) {
      var year = parseInt(target.text(), 10) || 0;
      this.viewDate.setFullYear(year);
      if (this.viewMode !== VIEWMODE_DAYS) {
        this.date = new Date(this.viewDate);
        this.element.trigger({
          type: 'changeDate',
          date: this.date,
          viewMode: DPGlobal.modes[this.viewMode].clsName
        });
      }
      this.showMode(MODE_SHRINK);
      this.fill();
      this.set();
    },

    onClickMonth: function (target) {
      var month = target.parent().find('span').index(target);
      this.viewDate.setMonth(month);
      if (this.viewMode !== VIEWMODE_DAYS) {
        this.date = new Date(this.viewDate);
        this.element.trigger({
          type: 'changeDate',
          date: this.date,
          viewMode: DPGlobal.modes[this.viewMode].clsName
        });
      }
      this.showMode(MODE_SHRINK);
      this.fill();
      this.set();
    },

    onClickDay: function (target) {
      var day = parseInt(target.text(), 10) || 1;
      var month = this.viewDate.getMonth();
      if (target.is('.fgnp-datepicker-old')) {
        month -= 1;
      } else if (target.is('.fgnp-datepicker-new')) {
        month += 1;
      }
      var year = this.viewDate.getFullYear();
      this.date = new Date(year, month, day, 0, 0, 0, 0);
      this.viewDate = new Date(year, month, Math.min(28, day), 0, 0, 0, 0);
      this.fill();
      this.set();
      this.element.trigger({
        type: 'changeDate',
        date: this.date,
        viewMode: DPGlobal.modes[this.viewMode].clsName
      });
      this.hide();
    },

    scroll: function (e) {
      e.stopPropagation();
      e.preventDefault();
    },

    mousedown: function (e) {
      e.stopPropagation();
      e.preventDefault();
    },

    showMode: function (dir) {
      if (dir) {
        this.viewMode = Math.max(this.minViewMode, Math.min(VIEWMODE_YEARS, this.viewMode + dir));
      }
      this.picker.find('>div').hide().filter('.fgnp-datepicker-' + DPGlobal.modes[this.viewMode].clsName).show();
      $('.fgnp-datepicker-footer').show();
    },

    formatYearMonth: function (year, month) {
      var ym = month + ' ' + year;

      if (this.locale === 'ja') {
        ym = year + this.dates.yearSuffix + month;
      }

      return ym;
    }

  };

  $.fn.fgnpDatepicker = function (option, val) {
    initDP(option);
    return this.each(function () {
      var $this = $(this),
        data = $this.data('datepicker'),
        options = typeof option === 'object' && option;
      if (!data) {
        $this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.fgnpDatepicker.defaults, options))));
      }
      if (typeof option === 'string') data[option](val);
    });
  };

  $.fn.fgnpDatepicker.defaults = {
    onRender: function () {
      return '';
    }
  };
  $.fn.fgnpDatepicker.Constructor = Datepicker;

  var initDP = function (options) {
    if (options === undefined) return;
    if (options.locale !== undefined) DPGlobal.locale = options.locale;
    if (LocaleStrings[DPGlobal.locale] !== undefined) DPGlobal.dates = LocaleStrings[DPGlobal.locale].dates;

    if (options.days !== undefined) DPGlobal.dates.days = options.days;
    if (options.daysShort !== undefined) DPGlobal.dates.daysShort = options.daysShort;
    if (options.daysMin !== undefined) DPGlobal.dates.daysMin = options.daysMin;
    if (options.months !== undefined) DPGlobal.dates.months = options.months;
    if (options.monthsShort !== undefined) DPGlobal.dates.monthsShort = options.monthsShort;
  };
  /*
  	var	formatYearMonth = function(locale, year, month) {
  		var ym = month + ' ' + year;
  		if (locale === 'ja') {
  			ym = this.yearSuffix(year) + month;
  		}
  		return ym;
  	};
  */
  var DPGlobal = {
    modes: [{
      clsName: 'days',
      navFnc: 'Month',
      navStep: 1
    }, {
      clsName: 'months',
      navFnc: 'FullYear',
      navStep: 1
    }, {
      clsName: 'years',
      navFnc: 'FullYear',
      navStep: 10
    }],
    dates: LocaleStrings.en.dates,
    locale: 'en',
    isLeapYear: function (year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    },
    getDaysInMonth: function (year, month) {
      return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
    parseFormat: function (format) {
      var separator = format.match(/[.\/\-\s].*?/),
        parts = format.split(/\W+/);
      if (!separator || !parts || parts.length === 0) {
        throw new Error('Invalid date format.');
      }
      return {
        separator: separator,
        parts: parts
      };
    },
    parseDate: function (date, format) {
      var parts = date.split(format.separator),
        val;
      date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      if (parts.length === format.parts.length) {
        var year = date.getFullYear(),
          day = date.getDate(),
          month = date.getMonth();
        for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
          val = parseInt(parts[i], 10) || 1;
          switch (format.parts[i]) {
          case 'dd':
          case 'd':
            day = val;
            date.setDate(val);
            break;
          case 'mm':
          case 'm':
            month = val - 1;
            date.setMonth(val - 1);
            break;
          case 'yy':
            year = 2000 + val;
            date.setFullYear(2000 + val);
            break;
          case 'yyyy':
            year = val;
            date.setFullYear(val);
            break;
          }
        }
        date = new Date(year, month, day, 0, 0, 0);
      }
      return date;
    },
    formatDate: function (date, format) {
      var val = {
        d: date.getDate(),
        m: date.getMonth() + 1,
        yy: date.getFullYear().toString().substring(2),
        yyyy: date.getFullYear()
      };
      val.dd = (val.d < 10 ? '0' : '') + val.d;
      val.mm = (val.m < 10 ? '0' : '') + val.m;
      date = [];
      for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
        date.push(val[format.parts[i]]);
      }
      return date.join(format.separator);
    },
    headTemplate: '<thead>' +
      '<tr>' +
      '<th class="fgnp-datepicker-prev"><span></span></th>' +
      '<th colspan="5" class="fgnp-datepicker-switch"></th>' +
      '<th class="fgnp-datepicker-next"><span></span></th>' +
      '</tr>' +
      '</thead>',
    contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
    clearTemplate: '<span class="fgnp-datepicker-clear">Clear</span>',
    todayTemplate: '<span class="fgnp-datepicker-today">Today</span>'
  };

  DPGlobal.template = '<div class="fgnp-datepicker">' +
    '<div class="fgnp-datepicker-days">' +
    '<table>' +
    DPGlobal.headTemplate +
    '<tbody></tbody>' +
    '</table>' +
    '</div>' +
    '<div class="fgnp-datepicker-months">' +
    '<table>' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    '</table>' +
    '</div>' +
    '<div class="fgnp-datepicker-years">' +
    '<table>' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    '</table>' +
    '</div>' +
    '<div class="fgnp-datepicker-footer">' +
    DPGlobal.clearTemplate +
    DPGlobal.todayTemplate +
    '</div>' +
    '</div>';

})(window.jQuery);

/*! Datepicker Plugin ends here */

/*
 * jquery.fgnp-dropdown.js v2.0.1
 *=============================================================================================================*/

/*!
 * Copyright (c) 2009 - 2013 Erik van den Berg (http://www.tweego.nl/jeegoocontext)
 * Licensed under MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * Consider linking back to author's homepage: http://www.tweego.nl
 *
 * Contributors:
 * Denis Evteev
 * Roman Imankulov (www.netangels.ru)
 * Julian Verdurmen
 *
 * Version: 2.0
 * Requires jQuery 1.4.2+
 */

(function ($) {
  var _global;
  var _menus;
  var VIEWSIZE_SMALL_CASE_MARGIN = 20;
  var WHEEL_DELTA = 120;
  var nua = navigator.userAgent;
  var _isAndroidStockBrowser = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
  var _isIOS = /iPad|iPhone|iPod/.test(nua);

  var _getViewportSize = function () {
    var $viewPortSizeElement = $('<div style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;"></div>');
    $('body').append($viewPortSizeElement);
    var viewPortSize = {
      width: $viewPortSizeElement.width(),
      height: $viewPortSizeElement.height()
    };
    $viewPortSizeElement.remove();
    return viewPortSize;
  };

  var _getViewSize = function () {
    var windowSize;
    if (_isIOS) {
      // http://bugs.jquery.com/ticket/6724
      var viewSize = _getViewportSize();
      var zoom = viewSize.width / window.innerWidth;
      var calcHeight = window.innerHeight * zoom;
      var jQueryHeight = $(window).height();
      windowSize = {
        width: $(window).width(),
        height: Math.abs(calcHeight - jQueryHeight) < Math.abs(calcHeight - viewSize.height) ? jQueryHeight : viewSize.height
      };
    } else {
      windowSize = {
        width: $(window).width(),
        height: $(window).height()
      };
    }

    return {
      top: $(window).scrollTop(),
      left: $(window).scrollLeft(),
      width: windowSize.width,
      height: windowSize.height
    };
  };

  var _getRightBottomPosition = function (left, top, width, height) {
    return {
      x: left + width - 1,
      y: top + height - 1
    };
  };
  var _overflow = function (left, top, width, height) {
    var targetRightBottomPosition = _getRightBottomPosition(left, top, width, height);
    var viewSize = _getViewSize();
    var viewSizeRightBottomPosition = _getRightBottomPosition(viewSize.left, viewSize.top, viewSize.width, viewSize.height);
    return {
      width: targetRightBottomPosition.x - viewSizeRightBottomPosition.x,
      height: targetRightBottomPosition.y - viewSizeRightBottomPosition.y
    };
  };

  var _getOffset = function ($element) {
    // The element.offset() return wrong values in Chrome when page is pinch-in/pinch-out.
    var elementOffset = $element.offset();
    var $body = $('body');
    var bodyOffset = $body.offset();
    var bodyMarginTop = parseInt($body.css('margin-top'), 10) || 0;
    var bodyMarginLeft = parseInt($body.css('margin-left'), 10) || 0;
    elementOffset.top -= (bodyOffset.top - bodyMarginTop);
    elementOffset.left -= (bodyOffset.left - bodyMarginLeft);
    return elementOffset;
  };

  var _clearActive = function () {
    for (var cm in _menus) {
      $(_menus[cm].allContext).removeClass(_global.activeClass);

    }
  };

  var _resetMenu = function () {
    if (_global.activeId) $(_global.activeId).add(_global.activeId + ' ul').fadeOut(_global.activeId.delay / 2);
    if (_menus[_global.activeId]) _menus[_global.activeId].currentHover = null;
    _global.activeId = null;
    $(document).off('.fgnp-dropdown');
    $(window).off('resize.fgnp-dropdown');
    $(document).off('mousewheel.fgnp-dropdown DOMMouseScroll.fgnp-dropdown scroll.fgnp-dropdown touchstart.fgnp-dropdown keydown.fgnp-dropdown');
    $('iframe').contents().off('mousewheel.fgnp-dropdown DOMMouseScroll.fgnp-dropdown mousedown.fgnp-dropdown touchmove.fgnp-dropdown touchstart.fgnp-dropdown keydown.fgnp-dropdown', _globalHide);
    $('ul.fgnp-dropdown').off('mousewheel.fgnp-dropdown DOMMouseScroll.fgnp-dropdown mousedown.fgnp-dropdown touchstart.fgnp-dropdown keydown.fgnp-dropdown');
  };

  var _globalHide = function (e) {
    if (_global.activeId && _menus[_global.activeId].onHide) {
      if (_menus[_global.activeId].onHide.apply($(_global.activeId), [e, _menus[_global.activeId].context]) === false) {
        return false;
      }
    }
    _clearActive();
    _resetMenu();
  };

  var _execute = function (id, options) {

    options = options || {};

    if (!_global) _global = {};
    if (!_menus) _menus = {};

    if (options.menuClass) _global.menuClass = options.menuClass;
    if (!_global.menuClass) _global.menuClass = 'fgnp-dropdown';
    if (options.activeClass) _global.activeClass = options.activeClass;
    if (!_global.activeClass) _global.activeClass = 'fgnp-active';

    if (_menus[id]) {
      return this;
    }

    if (_isAndroidStockBrowser) {
      this.addClass('fgnp-dropdown-android');
    }

    if (options.autoFitWidth == null) {
      options.autoFitWidth = this.data('autoFitWidth');
    }

    if (options.autoFitWidth == null && this.closest('.fgnp-nav').length !== 0) {
      options.autoFitWidth = true;
    }

    _menus[id] = $.extend({
      submenuClass: 'submenu',
      wrapper: 'body',
      fadeIn: 200,
      delay: 150,
      autoAddSubmenuArrows: true,
      autoFitWidth: false
    }, options);

    _menus[id].allContext = this.selector;

    $(id).on('mouseover.fgnp-dropdown', 'li', function (e) {
      var $this = _menus[id].currentHover = $(this);
      clearTimeout(_menus[id].show);
      clearTimeout(_menus[id].hide);
      var $parents = $this.parents('li');
      $this.add($this.find('> *')).add($parents).add($parents.find('> *'));
      var continueDefault = true;
      if (_menus[id].onHover) {
        if (_menus[id].onHover.apply(this, [e, _menus[id].context]) === false) continueDefault = false;
      }

      if ($('body').hasClass('fgnp-device-mobile')) { // just for testing mobile functionality on desktop
        if (e.isTrigger === undefined) {
          return;
        }
      }
      var $currentMenu = $this.parent();
      var $otherMenus = $currentMenu.find('ul').not($this.find('> ul'));
      $otherMenus.parent().removeClass('fgnp-current');
      $currentMenu.parentsUntil('.fgnp-dropdown', 'li').addClass('fgnp-current');

      if (!_menus[id].proceed) {
        _menus[id].show = setTimeout(function () {
          _menus[id].proceed = true;
          $this.mouseover();
        }, _menus[id].delay);

        return false;
      }

      _menus[id].proceed = false;
      $otherMenus.hide();

      if (!continueDefault) {
        e.preventDefault();
        return false;
      }

      var $submenu = $this.find('> ul');
      $submenu.css({
        'min-width': '',
        'width': ''
      });
      var submenuWidth = $submenu.outerWidth();
      if ($submenu.length !== 0) {
        var offSet = _getOffset($this);
        var paddingTop = parseInt($submenu.css('padding-top'), 10);
        var borderTopWidth = parseInt($this.css('borderTopWidth'), 10) || 0;
        var parentWidth = $currentMenu.outerWidth();
        var overflow = _overflow(offSet.left + parentWidth, offSet.top + borderTopWidth - paddingTop, submenuWidth, $submenu.outerHeight());
        var y = -paddingTop;
        var left;
        var viewSize = _getViewSize();
        if (overflow.width > 0) {
          if (submenuWidth >= offSet.left - viewSize.left) {
            if (offSet.left - viewSize.left <= (viewSize.left + viewSize.width) - (offSet.left + parentWidth)) {
              // Display to the right.
              left = parentWidth - overflow.width;
            } else {
              // Display to the left.
              left = viewSize.left - offSet.left;
            }
          } else {
            left = -submenuWidth;
          }
        } else {
          left = parentWidth;
        }
        if (viewSize.width - VIEWSIZE_SMALL_CASE_MARGIN < submenuWidth) {
          var newSubMenuWidth;
          newSubMenuWidth = viewSize.width - VIEWSIZE_SMALL_CASE_MARGIN - VIEWSIZE_SMALL_CASE_MARGIN;
          if (newSubMenuWidth < 0) {
            newSubMenuWidth = 0;
          }
          left = VIEWSIZE_SMALL_CASE_MARGIN + viewSize.left - offSet.left;
          $submenu.css({
            'min-width': newSubMenuWidth,
            'width': newSubMenuWidth
          });
        }

        $submenu.css({
          'left': left + 'px',
          'top': (overflow.height > 0 && !_menus[id].ignoreHeightOverflow) ? (y - overflow.height) + 'px' : y + 'px'
        });
        $this.addClass('fgnp-current');
        $submenu.fadeIn(_menus[id].fadeIn);
      }

      e.stopPropagation();

    }).on('click.fgnp-dropdown', 'li', function (e) {
      var currentNode = e.currentTarget;
      var clickedNode = $(e.target).closest('li').get(0);
      if (currentNode !== clickedNode) {
        return;
      }

      if (_menus[id].onSelect) {
        if (_menus[id].onSelect.apply(this, [e, _menus[id].context]) === false) {
          return false;
        }
      }

      if ($(this).hasClass('fgnp-dropdown-link')) {
        e.preventDefault();
        $(this).mouseover();
      } else {
        _resetMenu();
        $(_menus[id].context).removeClass(_global.activeClass);
      }
    });

    var div = document.createElement('div');
    div.setAttribute('oncontextmenu', '');

    $(_menus[id].wrapper).on('click.fgnp-dropdown', _menus[id].allContext, function (e) {
      if (typeof _menus[id].modifier === 'string' && !e[_menus[id].modifier]) return;
      _menus[id].context = this;
      var $menu = $(id);
      $menu.css({
        'min-width': '',
        'width': ''
      });
      if (_menus[id].autoFitWidth === true) {
        $menu.css('min-width', $(this).outerWidth());
      }
      var startLeft, startTop;
      var contextOffset = _getOffset($(this));
      startLeft = contextOffset.left;
      startTop = contextOffset.top + $(this).outerHeight();
      $menu.appendTo('body');
      var menuWidth = $menu.outerWidth();
      var menuHeight = $menu.outerHeight();

      var overflow = _overflow(startLeft, startTop, menuWidth, menuHeight);
      var viewSize = _getViewSize();
      if (!_menus[id].ignoreWidthOverflow) {
        if (overflow.width > 0)  {
          startLeft -= overflow.width;
        } else if (viewSize.left > startLeft) {
          startLeft = viewSize.left;
        }
      }

      if (contextOffset.top + menuHeight + $(this).outerHeight() > viewSize.top + viewSize.height) {
        startTop = contextOffset.top - menuHeight;
        if (startTop < viewSize.top) {
          startTop = viewSize.top + viewSize.height - menuHeight;
        }
      }

      if (viewSize.width - VIEWSIZE_SMALL_CASE_MARGIN < menuWidth) {
        var newMenuSize = viewSize.width - VIEWSIZE_SMALL_CASE_MARGIN - VIEWSIZE_SMALL_CASE_MARGIN;
        if (newMenuSize < 0) {
          newMenuSize = 0;
        }
        $menu.css({
          'min-width': newMenuSize,
          'width': newMenuSize
        });
        startLeft = VIEWSIZE_SMALL_CASE_MARGIN + viewSize.left;
      }

      if (_menus[id].onShow) {
        if (_menus[id].onShow.apply($menu, [e, _menus[id].context, startLeft, startTop]) === false) {
          return false;
        }
      }

      _resetMenu();
      _global.activeId = id;
      $(_global.activeId).add(_global.activeId + ' ul').hide();
      _clearActive();
      $(_menus[id].context).addClass(_global.activeClass);
      $menu.find('li').removeClass('fgnp-current');
      if (_menus[id].autoAddSubmenuArrows) {
        $menu.find('li:has(ul)').not(':has(span.' + _menus[id].submenuClass + ')').prepend('<span class="' + _menus[id].submenuClass + '"></span>');
        $menu.find('li').not(':has(ul)').find('> span.' + _menus[id].submenuClass).remove();
      }

      $menu.css({
        'left': startLeft + 'px',
        'top': startTop + 'px'
      }).fadeIn(_menus[id].fadeIn);

      $(window).on('resize.fgnp-dropdown', function () {
        _globalHide();
      });

      $('ul.fgnp-dropdown').on('mousewheel.fgnp-dropdown DOMMouseScroll.fgnp-dropdown mousedown.fgnp-dropdown touchmove.fgnp-dropdown touchstart.fgnp-dropdown keydown.fgnp-dropdown', function (e) {
        if ($(this).scrollTop() === 0) {
          if (e.originalEvent.wheelDelta / WHEEL_DELTA > 0) {
            e.preventDefault();
          }
        }
        if ($(this).scrollTop() === $(this)[0].scrollHeight - $(this).height()) {
          if (e.originalEvent.wheelDelta / WHEEL_DELTA < 0) {
            e.preventDefault();
          }
        }
        if (e.type === 'touchmove' & !$(this).hasClass('fgnp-fixed')) {
          e.preventDefault();
        }
        e.stopPropagation();
      });
      $(document).on('mousewheel.fgnp-dropdown DOMMouseScroll.fgnp-dropdown mousedown.fgnp-dropdown touchstart.fgnp-dropdown keydown.fgnp-dropdown', _globalHide);
      $('iframe').contents().on('mousewheel.fgnp-dropdown DOMMouseScroll.fgnp-dropdown mousedown.fgnp-dropdown touchstart.fgnp-dropdown keydown.fgnp-dropdown', _globalHide);

      $(document).on('mouseover.fgnp-dropdown', function (e) {
        if ($(e.relatedTarget).parents(id).length > 0) {
          clearTimeout(_menus[id].show);
          var $li = $(e.relatedTarget).parent().find('li');
          _menus[_global.activeId].currentHover = null;
          _menus[id].hide = setTimeout(function () {
            $li.find('ul').hide();
            if (_menus[id].autoHide) _globalHide(e);
          }, _menus[id].delay);
        }
      });
      return false;
    });

    return this;
  };

  $.fn.fgnpDropdown = function (targetid, options) {
    if (typeof targetid !== 'string') {
      options = targetid;
      targetid = null;
    }

    if (targetid != null) {
      _execute.call(this, targetid, options);
    } else {
      //giving ID-s to all elements that has dropdown but doesn't have ID
      var $body = $('body');
      this.each(function () {
        var callerid, newid, newincid;
        var $this = $(this);

        callerid = $this.attr('id');
        if (callerid == null) {
          newid = $this.data('dropdown') + 'Trigger';
          newincid = 0;

          while ($body.find(newid).length > 0) {
            newid = newid + String(newincid);
            newincid++;
          }
          newid = newid.replace('#', '');
          $this.attr('id', newid);
          callerid = $(this).attr('id');
        }
        callerid = '#' + String(callerid);
        targetid = '#' + $this.data('dropdown').replace('#', '');
        _execute.call($(callerid), targetid, options);
      });
    }

    return this;
  };

})(jQuery);

/*! Dropdown Plugin ends here */

/*
 * jquery.fgnp-modal.js v2.0.1
 *=============================================================================================================*/

/*!
 * @name: bPopup
 * @type: jQuery
 * @author: (c) Bjoern Klinggaard - @bklinggaard
 * @demo: http://dinbror.dk/bpopup
 * @version: 0.9.4
 * @requires jQuery 1.4.3
 *==================================================================================================================*/

(function ($) {
  'use strict';
  var MOBILE_MARGIN = 40;
  var KEY_ESC = 27;
  var KEY_TAB = 9;

  $.fn.fgnpModal = function (options, callback) {

    if ($.isFunction(options)) {
      callback = options;
      options = null;
    }

    options = $.extend({}, {
      position: 'center'
    }, options);

    if (options != null && options.getXCoord == null && options.getYCoord == null && typeof options.position === 'string') {

      var getYCoord = function (windowHeight, $popup, o) {
        if (o.isMobile) {
          return Math.max(o.amsl + parseInt($(window).scrollTop()), ((windowHeight - $popup.outerHeight(true)) / 2 - o.amsl) + parseInt($(window).scrollTop()));
        } else {
          return (windowHeight - $popup.outerHeight(true)) / 2;
        }
      };

      var getXCoord = function (windowWidth, $popup) {
        return (windowWidth - $popup.outerWidth(true)) / 2;
      };

      if (options.position.indexOf('bottom') !== -1) {
        getYCoord = function (windowHeight, $popup, o) {
          if (o.isMobile) {
            return Math.max(o.amsl, ((windowHeight - $popup.outerHeight(true)) / 2 - o.amsl) + parseInt($(window).scrollTop()));
          } else {
            return Math.max(0, (windowHeight - $popup.outerHeight(true) - o.amsl));
          }
        };
      }

      if (options.position.indexOf('top') !== -1) {
        getYCoord = function (windowHeight, $popup, o) {
          if (o.isMobile) {
            return o.amsl + parseInt($(window).scrollTop());
          } else {
            return o.amsl;
          }
        };
      }

      if (options.position.indexOf('right') !== -1) {
        getXCoord = function (windowWidth, $popup, o) {
          return windowWidth - $popup.outerWidth(true) - o.amsl;
        };
      }

      if (options.position.indexOf('left') !== -1) {
        getXCoord = function (windowWidth, $popup, o) {
          return o.amsl;
        };
      }

      options.getXCoord = getXCoord;
      options.getYCoord = getYCoord;
      delete options.position;
    }

    var o = $.extend({}, $.fn.fgnpModal.defaults, options);
    o.isMobile = $('body').hasClass('fgnp-device-mobile');

    if (!o.scrollBar) {
      $('html').css('overflow', 'hidden');
    }

    var $popup = this;
    var d = $(document);
    var w = window;
    var $w = $(w);
    var wH = windowHeight();
    var wW = windowWidth();
    var prefix = '';
    var popups = 0;
    var id;
    var fixedVPos;
    var fixedHPos;
    var fixedPosStyle;
    var vPos;
    var hPos;
    var height;
    var width;
    var lastFocusedElement;
    var firsttab, lasttab;

    $popup.close = function () {
      o = this.data('bPopup');
      id = prefix + $w.data('bPopup') + '__';
      close();
    };

    return $popup.each(function () {
      if ($(this).data('bPopup')) return;
      init();
    });

    function init() {
      triggerCall(o.onInit);
      popups = ($w.data('bPopup') || 0) + 1, id = prefix + popups + '__', fixedVPos = o.position[1] !== 'auto', fixedHPos = o.position[0] !== 'auto', fixedPosStyle = o.positionStyle === 'fixed', height = $popup.outerHeight(true), width = $popup.outerWidth(true);
      $w.data('bPopup', popups);
      // Draggable modal box (Require jQuery UI)
      if (typeof $.fn.draggable !== 'undefined' && $('body').hasClass('fgnp-device-desktop')) {
        $popup.filter('.fgnp-draggable').draggable({
          handle: $('.fgnp-modal-box .fgnp-header'),
          containment: 'window'
        });
      }
      o.loadUrl ? createContent() : open();
      focusTabbable();
    }

    function createContent() {
      o.contentContainer = $(o.contentContainer || $popup);
      open();
      $('<div class="b-ajax-wrapper" style="height: 100%;"></div>').load(o.loadUrl, o.loadData, function () {
        triggerCall(o.loadCallback);
        recenter($(this));
        focusTabbable();
      }).hide().appendTo(o.contentContainer);
    }

    function focusTabbable() {
      if ($popup.hasClass('fgnp-modal-box')) {
        $popup.attr('tabIndex', -1);
        if ($popup.find(o.defaultFocus)[0]) {
          $popup.find(o.defaultFocus)[0].focus();
        } else {
          $popup.focus();
        }

        $popup.find(o.tabbableClasses).each(function () {
          $(this).addClass('fgnp-modal-tabbable');
        });

        $('.b-modal.' + id).on('mousedown', function (e) {
          e.preventDefault();
        });
      }
    }

    function open() {

      lastFocusedElement = document.activeElement;

      if (!$popup.attr('id')) {
        $popup.attr('id', 'alert_' + $('.fgnp-modal-box').length);
      }

      if (o.modal) {
        // For IE8 modal overlay
        var bottomPos = '-99999px';
        if (navigator.userAgent.indexOf('Trident/4.') !== -1) bottomPos = '0';
        if (navigator.userAgent.indexOf('MSIE 7.') !== -1 && navigator.userAgent.indexOf('Trident/4.') !== -1) {
          var backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlOzEo46UAAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=)';
          $('<div class="b-modal ' + id + '"></div>')
            .css({
              'background-image': backgroundImage,
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: bottomPos,
              left: 0,
              opacity: 0,
              zIndex: o.zIndex + popups
            })
            .appendTo(o.appendTo)
            .fadeTo(o.speed, 1);
        } else {
          $('<div class="b-modal ' + id + '"></div>')
            .css({
              backgroundColor: o.modalColor,
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: bottomPos,
              left: 0,
              opacity: 0,
              zIndex: o.zIndex + popups
            })
            .appendTo(o.appendTo)
            .fadeTo(o.speed, o.opacity);
        }
      }
      calPosition();

      if (o.isMobile) {
        width = wW - MOBILE_MARGIN;
        $popup.outerWidth(width);
        var top = o.getYCoord(wH, $popup, o);
        var left = o.getXCoord(wW, $popup, o);
        $popup
          .data('bPopup', o).data('id', id)
          .css({
            'z-index': o.zIndex + popups + 1,
            'position': o.positionStyle,
            'top': top + 'px',
            'left': left + 'px',
            'max-width': width + 'px'
          }).each(function () {
            if (o.appending) {
              $(this).appendTo(o.appendTo);
            }
          });
      } else {
        $popup
          .data('bPopup', o).data('id', id)
          .css({
            'position': o.positionStyle || 'absolute',
            'left': o.getXCoord(windowWidth(), $popup, o),
            'top': o.getYCoord(windowHeight(), $popup, o),
            'z-index': o.zIndex + popups + 1
          }).each(function () {
            if (o.appending) {
              $(this).appendTo(o.appendTo);
            }
          });
      }
      doTransition(true);
      $popup.addClass('fgnp-modal-open');

      return ($popup.attr('id'));
    }

    function close() {
      if (o.modal) {
        $('.b-modal.' + $popup.data('id'))
          .fadeTo(o.speed, 0, function () {
            $(this).remove();
          });
      }
      unbindEvents();
      doTransition();
      $popup.removeClass('fgnp-modal-open');

      if (o.modalType === 'alert' || o.modalType === 'confirm') {
        $popup.fadeTo('o.speed', 0, function () {
          $popup.remove();
        });
      }

      $(lastFocusedElement).focus();

      // Draggable modal box (Require jQuery UI)
      if (typeof $.fn.draggable !== 'undefined' && $('body').hasClass('fgnp-device-desktop')) {
        $popup.filter('.fgnp-draggable').draggable('destroy');
      }

      return false;
    }

    function recenter(content) {
      calPosition();
      o.contentContainer.css({
        height: 'auto',
        width: 'auto'
      });
      o.contentContainer.children().children().css({
        height: '100%'
      });

      calPosition();

      content.show();
      if (o.isMobile) {
        width = wW - MOBILE_MARGIN;
        $popup.outerWidth(width);
        var top = o.getYCoord(wH, $popup, o);
        var left = o.getXCoord(wW, $popup, o);
        $popup
          .css({
            'z-index': o.zIndex + popups + 1,
            'position': o.positionStyle,
            'top': top + 'px',
            'left': left + 'px',
            'max-width': width + 'px'
          });
      } else {
        $popup
          .css({
            'left': o.transition === 'slideIn' || o.transition === 'slideBack' ? (o.transition === 'slideBack' ? d.scrollLeft() + wW : (hPos + width) * -1) : getLeftPos(!(!o.follow[0] && fixedHPos || fixedPosStyle)),
            'position': o.positionStyle || 'absolute',
            'top': o.transition === 'slideDown' || o.transition === 'slideUp' ? (o.transition === 'slideUp' ? d.scrollTop() + wH : vPos + height * -1) : getTopPos(!(!o.follow[1] && fixedVPos || fixedPosStyle)),
            'z-index': o.zIndex + popups + 1
          });
      }
      doTransition(true);
      $popup.find('.fgnp-scrollable').fgnpScrollable();
    }

    function bindEvents() {
      if (o.modalType === 'confirm') {
        $popup.on('click.' + id, '.bClose, .' + 'fgnp-confirm', function () {
          triggerCall(o.confirm);
          close();
        });
        $popup.on('click.' + id, '.bClose, .' + 'fgnp-deny', function () {
          triggerCall(o.deny);
          close();
        });
      } else {
        $popup.on('click.' + id, '.bClose, .' + o.closeClass, close);
      }

      if (o.modalClose) {
        triggerCall(o.deny);
        $('.b-modal.' + id).css('cursor', 'pointer').on('click', close);
      }

      if (o.follow[0] || o.follow[1]) {
        $w.on('resize.' + id, function (e) {

          if (o.isMobile) {
            $popup.css({
              'z-index': o.zIndex + popups + 1,
              'position': o.positionStyle,
              'width': $(window).width() - MOBILE_MARGIN + 'px',
              'left': '20px',
              'max-width': $(window).width() - MOBILE_MARGIN + 'px'
            });
          } else {
            if (!$(e.target).hasClass('fgnp-modal-box')) {
              $popup.css({
                'left': o.getXCoord(windowWidth(), $popup, o),
                'top': o.getYCoord(windowHeight(), $popup, o)
              });
            }
          }
        });

      }

      if ($popup.hasClass('fgnp-modal-box')) {
        d.on('keydown.' + id, function (e) {
          if (e.which === KEY_TAB) {
            firsttab = $('body .fgnp-modal-box.fgnp-modal-open').last().find('.fgnp-modal-tabbable').filter(':visible').first();
            lasttab = $('body .fgnp-modal-box.fgnp-modal-open').last().find('.fgnp-modal-tabbable').filter(':visible').last();
            if (firsttab.length === 0) {
              e.preventDefault();
            } else if (e.target === $popup[0]) {
              if (e.shiftKey) {
                lasttab.focus();
                e.preventDefault();
              }
            } else if (e.target === lasttab[0] && !e.shiftKey) {
              firsttab.focus();
              e.preventDefault();
            } else if (e.target === firsttab[0] && e.shiftKey) {
              lasttab.focus();
              e.preventDefault();
            }
          }
        });
        $popup.on('keydown.' + id, function (e) {
          if (o.escClose) {
            if (e.which === KEY_ESC) {
              triggerCall(o.deny);
              close();
            }
          }
        });
      }
    }

    function unbindEvents() {
      id = $popup.data('id');
      if (!o.scrollBar) {
        $('html').css('overflow', 'auto');
      }
      $('.b-modal.' + id).off();
      d.off('keydown.' + id);
      $w.off('.' + id);
      $popup.off('.' + id).data('bPopup', null);
    }

    function doTransition(open) {
      $popup.stop().fadeTo(o.speed, open ? 1 : 0, function () {
        onCompleteCallback(open);
      });
    }

    function onCompleteCallback(open) {
      if (open) {
        bindEvents();
        triggerCall(callback);
        triggerCall(o.onOpen);
        if (o.autoClose) {
          setTimeout(close, o.autoClose);
        }
      } else {
        $popup.hide();
        triggerCall(o.onClose);
        if (o.loadUrl) {
          o.contentContainer.empty();
          $popup.css({
            height: 'auto',
            width: 'auto'
          });
        }
      }
    }

    function getLeftPos(includeScroll) {
      return includeScroll ? hPos + d.scrollLeft() : hPos;
    }

    function getTopPos(includeScroll) {
      return includeScroll ? vPos + d.scrollTop() : vPos;
    }

    function triggerCall(func) {
      $.isFunction(func) && func.call($popup);
    }

    function calPosition() {
      vPos = fixedVPos ? o.position[1] : o.getYCoord(wH, $popup, o), hPos = fixedHPos ? o.position[0] : o.getXCoord(wW, $popup, o);
    }

    function windowHeight() {
      return w.innerHeight || $w.height();
    }

    function windowWidth() {
      return w.innerWidth || $w.width();
    }

  };

  $.fn.fgnpModal.defaults = {
    amsl: 20,
    appending: true,
    appendTo: 'body',
    autoClose: false,
    closeClass: 'fgnp-close',
    confirm: false,
    contentContainer: false,
    deny: false,
    escClose: true,
    follow: [true, true], // x, y
    loadCallback: false,
    loadData: false,
    loadUrl: false,
    modal: true,
    modalType: 'modal',
    modalClose: true,
    modalColor: '#000',
    onClose: false,
    onInit: false,
    onOpen: false,
    opacity: 0.7,
    zIndex: 99,
    position: ['auto', 'auto'], // x, y,
    positionStyle: 'absolute', // absolute or fixed
    scrollBar: true,
    speed: 250, // open & close speed
    transition: 'fadeIn', //transitions: fadeIn, slideDown, slideIn
    tabbableClasses: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex]',
    getYCoord: function (windowHeight, $popup, o) {
      if (o.isMobile) {
        return Math.max(o.amsl, ((windowHeight - $popup.outerHeight(true)) / 2) - o.amsl) + parseInt($(window).scrollTop());
      } else {
        return Math.max(0, ((windowHeight - $popup.outerHeight(true)) / 2));
      }
    },
    getXCoord: function (windowWidth, $popup) {
      return (windowWidth - $popup.outerWidth(true)) / 2;
    }
  };

  // ---- Modal View Functions
  // Attach the modal functionality to an object with attr data-fgnp-modal="#ID"
  $(document).on('click.fgnpModal', '[data-modal-target]', function () {
    var id = $(this).data('modal-target');
    var element = $('#' + id);

    if (!$('body').hasClass('fgnp-device-mobile')) {
      if (element.data('modalWidth') !== undefined) {
        element.css('width', element.data('modalWidth'));
      }
      if (element.data('modalHeight') !== undefined) {
        element.css('height', element.data('modalHeight'));
      }
      if (!parseInt(element.css('min-height')) > 0) {
        element.css('min-height', element.outerHeight() + 'px');
      }
      if (!parseInt(element.css('min-width')) > 0) {
        element.css('min-width', element.outerWidth() + 'px');
      }
    }

    var opts = $.extend({}, {
      position: 'center'
    }, $(this).data('modal'));

    element.fgnpModal(opts);
    element.resize();

  });

})(jQuery);

/*! bPopup Plugin ends here */

// Toast plugin
(function ($) {
  $.fgnpToast = function (options) {
    if (typeof options !== 'object' || options instanceof jQuery) {
      options = {
        text: options
      };
    }

    var defaults = {
      timeout: 3,
      position: 'top',
      highlight: true,
      classes: false,
      iconsrc: false
    };

    var opts = $.extend({}, defaults, options);

    if (!opts.title) {
      opts.title = '';
    }

    var $toast = $('.fgnp-toast:visible').eq(0);
    if ($toast.length === 0) {
      $toast = $('.fgnp-toast:first').eq(0);
    }
    if ($toast.length === 0) {
      $toast = $('<div class="fgnp-toast"></div>');
    } else {
      $toast.fgnpModal({
        modal: false
      }).close();
    }

    $toast.html('').append(opts.text);

    $toast.removeClass();
    $toast.addClass('fgnp-toast');

    if (opts.classes) {
      $toast.addClass(opts.classes);
    }

    if (opts.highlight) {
      $toast.addClass('fgnp-highlight');
    }

    if (opts.iconsrc) {
      var imgsrc = opts.iconsrc;

      $toast.prepend('<img src="' + imgsrc + '" />');
      $toast.addClass('fgnp-icon');
    }

    if (!opts.timeout) {
      $toast.append('<span class="fgnp-close"></span>');
      $toast.addClass('fgnp-close');
    } else {
      opts.timeout *= 1000;
    }

    var mobileTop = 0,
      position = 'fixed';

    var getYCoord = function (windowHeight, $popup, o) {
      return Math.max(0 + o.amsl, (windowHeight - $popup.outerHeight(true) - o.amsl) + mobileTop);
    };

    var getXCoord = function (windowWidth, $popup) {
      return (windowWidth - $popup.outerWidth(true)) / 2;
    };

    if (opts.position.indexOf('top') !== -1) {
      getYCoord = function (windowHeight, $popup, o) {
        return o.amsl + mobileTop;
      };
    }

    if (opts.position.indexOf('right') !== -1) {
      getXCoord = function (windowWidth, $popup, o) {
        return windowWidth - $popup.outerWidth(true) - o.amsl;
      };
    }

    if (opts.position.indexOf('left') !== -1) {
      getXCoord = function (windowWidth, $popup, o) {
        return o.amsl;
      };
    }

    if (opts.position === 'center') {
      getXCoord = function (windowWidth, $popup) {
        return (windowWidth - $popup.outerWidth(true)) / 2;
      };

      getYCoord = function (windowHeight, $popup) {
        return (windowHeight - $popup.outerHeight(true)) / 2 + mobileTop;
      };
    }

    $toast.fgnpModal({
      modal: false,
      fadeSpeed: 'slow',
      top: '50px',
      getYCoord: getYCoord,
      getXCoord: getXCoord,
      positionStyle: position,
      onInit: function () {
        var $this = $(this);

        $this.stop(true, true).fadeOut(0);

        $('body').append($this);

        clearTimeout($this.data('timeout'));

        if (opts.timeout) {
          $this.data('timeout', setTimeout(function () {
            if ($this.hasClass('fgnp-modal-open')) {
              $this.fgnpModal().close();
            }
          }, opts.timeout));
        }
      }
    });

  };
})(jQuery);

// Alert plugin
(function ($) {
  $.fgnpAlert = function (options) {
    if (typeof options !== 'object' || options instanceof jQuery) {
      options = {
        alert: options
      };
    }
    var defaults = {
      alert: '',
      defaultFocus: 'okayButton',
      onClose: false,
      onOpen: false,
      strings: {
        okayButton: 'OK'
      },
      title: ''
    };

    var opts = $.extend({}, defaults, options);
    var element = '<div class="fgnp-modal-box fgnp-alert">';
    var $header = '<div class="fgnp-header">' + opts.title + '</div>';
    var $scrollable = $('<div class="fgnp-modal-content fgnp-scrollable">');
    var $scrollContent = $('<div class="fgnp-row"><div class="fgnp-col-12"><p></p></div></div>');
    $scrollable.append($scrollContent);
    var $container = $scrollable.find('p').eq(0);

    var $footer = $('<div class="fgnp-footer">' + '<ul class="fgnp-control-group fgnp-responsive fgnp-right">' + '<li><button class="fgnp-close fgnp-button fgnp-fixed">' + opts.strings.okayButton + '</button></li>' + '</ul></div>');

    element = $(element);
    if (opts.title) element.append($header);
    element.append($scrollable);
    element.append($footer);
    $container.append(options.alert);

    element.hide();
    $('body').append(element);

    if (opts.defaultFocus === 'okayButton') {
      opts.defaultFocus = '.fgnp-close';
    }
    element.fgnpModal({
      defaultFocus: opts.defaultFocus,
      modalClose: false,
      modalType: 'alert',
      onClose: opts.onClose,
      onOpen: opts.onOpen
    });

    element.find('.fgnp-scrollable').fgnpScrollable();
  };

})(jQuery);

// Confirm plugin
(function ($) {
  $.fgnpConfirm = function (options) {
    if (typeof options !== 'object' || options instanceof jQuery) {
      options = {
        message: options
      };
    }

    var defaults = {
      confirm: false,
      defaultFocus: 'okayButton',
      deny: false,
      message: '',
      onClose: false,
      onOpen: false,
      strings: {
        okayButton: 'OK',
        cancelButton: 'Cancel'
      },
      title: ''
    };

    var opts = $.extend({}, defaults, options);

    var element = '<div class="fgnp-modal-box fgnp-confirm">';
    if (opts.title) {
      element += '<div class="fgnp-header">' + opts.title + '</div>';
    }

    element += '<div class="fgnp-modal-content fgnp-scrollable"><div class="fgnp-row"><div class="fgnp-col-12"><p>' + opts.message + '</p></div></div></div>';

    element += '<div class="fgnp-footer">' + '<ul class="fgnp-control-group fgnp-responsive fgnp-right">' + '<li><button class="fgnp-confirm fgnp-button fgnp-highlight fgnp-fixed">' + opts.strings.okayButton + '</button></li>' + '<li><button class="fgnp-deny fgnp-button fgnp-fixed">' + opts.strings.cancelButton + '</button></li>' + '</ul></div>';

    element = $(element);
    $('body').append(element.hide());

    if (opts.defaultFocus === 'okayButton') {
      opts.defaultFocus = '.fgnp-confirm';
    } else if (opts.defaultFocus === 'cancelButton') {
      opts.defaultFocus = '.fgnp-deny';
    }

    element.fgnpModal({
      confirm: opts.confirm,
      defaultFocus: opts.defaultFocus,
      deny: opts.deny,
      modalClose: false,
      modalType: 'confirm',
      onClose: opts.onClose,
      onOpen: opts.onOpen
    });

    element.find('.fgnp-scrollable').fgnpScrollable();

  };

})(jQuery);

/* Modal Plugin ends here */

/*
 * jquery.fgnp-slidemenu.js v2.0.1
 * Copyright 2016 FUJITSU LIMITED
 *====================================*/

(function ($) {
  // const
  var PLUGIN_NAME = 'fgnpSlidemenu';

  // constructor
  function fgnpSlidemenu($element) {
    this._$element = $element;
    this._apply();
  }

  $.extend(fgnpSlidemenu.prototype, {

    // public methods
    dispose: function () {
      this._unbindEvents();
      this._$element.data(PLUGIN_NAME, null);
      this._$element = null;
    },

    show: function () {
      $('body').addClass('fgnp-slidemenu-open');
      this._$element.addClass('fgnp-open');
    },

    hide: function () {
      if (this._$element.hasClass('fgnp-open')) {
        this._$element.removeClass('fgnp-open');

        if (!$('.fgnp-slidemenu.fgnp-open').length) {
          $('body').removeClass('fgnp-slidemenu-open');
        }
      }
    },

    // private methods
    _apply: function () {
      this._bindEvents();
    },

    _bindEvents: function () {
      this._$element.find('.fgnp-slidemenu-overlay').on('click.fgnpSlidemenu', this._onClickOverlay.bind(this));
    },

    _unbindEvents: function () {
      this._$element.find('.fgnp-slidemenu-overlay').off('click.fgnpSlidemenu');
    },

    _onClickOverlay: function () {
      this.hide();
    }
  });

  // jQuery plugin function
  $.fn[PLUGIN_NAME] = function (methodName) {
    var args = Array.prototype.slice.call(arguments, 1);

    return $(this).each(function (index, element) {
      var $element = $(element);
      var data = $element.data(PLUGIN_NAME);

      if (data == null) {
        data = new fgnpSlidemenu($element);
        $element.data(PLUGIN_NAME, data);
      }

      if (methodName == null) {
        methodName = 'show';
      }

      if (methodName[0] !== '_') {
        data[methodName].apply(data, args);
      }
    });

  };
})(jQuery);

/*
 * jquery.fgnp-tableSortable.js v2.0.1
 *=============================================================================================================*/

/*!
 * Stupid jQuery Table Sort
 * Copyright (c) 2012 Joseph McCullough
 */

(function ($) {
  $.fn.fgnpTableSortable = function (sortFns) {
    return this.each(function () {
      var $table = $(this);
      sortFns = sortFns || {};
      sortFns = $.extend({}, $.fn.fgnpTableSortable.default_sort_fns, sortFns);

      $table.off('click.fgnpTableSortable').on('click.fgnpTableSortable', 'th', function () {
        var $this = $(this);
        var th_index = 0;
        var dir = $.fn.fgnpTableSortable.dir;

        $table.find('th').slice(0, $this.index()).each(function () {
          var cols = $(this).attr('colspan') || 1;
          th_index += parseInt(cols, 10);
        });

        var sort_dir = $this.data('sort-default') || dir.ASC;
        if ($this.data('sort-dir')) {
          sort_dir = $this.data('sort-dir') === dir.ASC ? dir.DESC : dir.ASC;
        }
        var type = $this.data('sort') || null;
        if (type === null) {
          return;
        }

        $table.trigger('beforetablesort', {
          column: th_index,
          direction: sort_dir
        });
        $table.css('display');

        setTimeout(function () {
          var column = [];
          var sortMethod = sortFns[type];
          var trs = $table.children('tbody').children('tr');

          trs.each(function (index, tr) {
            var $e = $(tr).children().eq(th_index);
            var sort_val = $e.data('sort-value');
            var order_by = typeof (sort_val) !== 'undefined' ? sort_val : $e.text();
            column.push([order_by, tr]);
          });

          column.sort(function (a, b) {
            return sortMethod(a[0], b[0]);
          });
          if (sort_dir !== dir.ASC) {
            column.reverse();
          }

          trs = $.map(column, function (kv) {
            return kv[1];
          });
          $table.children('tbody').append(trs);

          $table.find('th').data('sort-dir', null).removeClass('fgnp-des fgnp-asc');
          $this.data('sort-dir', sort_dir).addClass('fgnp-' + sort_dir);

          $table.trigger('aftertablesort', {
            column: th_index,
            direction: sort_dir
          });
          $table.css('display');
        }, 10);
      });
    });
  };

  $.fn.fgnpTableSortable.dir = {
    ASC: 'asc',
    DESC: 'des'
  };

  $.fn.fgnpTableSortable.default_sort_fns = {
    'int': function (a, b) {
      return parseInt(a, 10) - parseInt(b, 10);
    },
    'float': function (a, b) {
      return parseFloat(a) - parseFloat(b);
    },
    'string': function (a, b) {
      if (a < b) return -1;
      if (a > b) return +1;
      return 0;
    },
    'string-ins': function (a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a < b) return -1;
      if (a > b) return +1;
      return 0;
    }
  };

})(jQuery);

/*! Table Sorter Plugin ends here */

/*
 * jquery.fgnp-tabs.js v2.0.1
 *=============================================================================================================*/

/*!
 * jQuery EasyTabs plugin 3.2.0
 *
 * Copyright (c) 2010-2011 Steve Schwartz (JangoSteve)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: Thu May 09 17:30:00 2013 -0500
 */
(function ($) {

  $.fgnpTabs = function (container, options) {
    var $container = $(container);
    if ($('body').hasClass('fgnp-device-mobile')) {
      $container.addClass('fgnp-justified');
    }

    // Attach to plugin anything that should be available via
    // the $container.data('fgnpTabs') object
    var plugin = this,

      defaults = {
        animate: true,
        panelActiveClass: 'fgnp-tab-panel-current',
        tabActiveClass: 'fgnp-current',
        firstChild: 'li:first-child',
        defaultTab: 'li.fgnp-current',
        animationSpeed: 'normal',
        tabs: '> li',
        updateHash: false,
        cycle: false,
        collapsible: true,
        collapsedClass: 'fgnp-tab-collapsed',
        collapsedByDefault: false,
        uiTabs: false,
        transitionIn: 'fadeIn',
        transitionOut: 'fadeOut',
        transitionInEasing: 'swing',
        transitionOutEasing: 'swing',
        transitionCollapse: 'slideUp',
        transitionUncollapse: 'slideDown',
        transitionCollapseEasing: 'swing',
        transitionUncollapseEasing: 'swing',
        containerClass: '',
        tabsClass: '',
        tabClass: '',
        panelClass: '',
        cache: true,
        event: 'click',
        panelContext: $('body'),
        disabledClass: 'fgnp-disabled'
      },

      // Internal instance variables
      // (not available via fgnpTabs object)
      $defaultTab,
      $defaultTabLink,
      transitions,
      lastHash,
      skipUpdateToHash,
      animationSpeeds = {
        fast: 200,
        normal: 400,
        slow: 600
      },

      // Shorthand variable so that we don't need to call
      // plugin.settings throughout the plugin code
      settings;

    // =============================================================
    // Functions available via fgnpTabs object
    // =============================================================

    plugin.init = function () {

      plugin.settings = settings = $.extend({}, defaults, options);
      settings.bind_str = settings.event + '.fgnpTabs';

      // Add jQuery UI's crazy class names to markup,
      // so that markup will match theme CSS
      if (settings.uiTabs) {
        settings.tabActiveClass = 'ui-tabs-selected';
        settings.containerClass = 'ui-tabs ui-widget ui-widget-content ui-corner-all';
        settings.tabsClass = 'ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all';
        settings.tabClass = 'ui-state-default ui-corner-top';
        settings.panelClass = 'ui-tabs-panel ui-widget-content ui-corner-bottom';
      }

      // If collapsible is true and defaultTab specified, assume user wants defaultTab showing (not collapsed)
      if (settings.collapsible && settings.defaultTab !== undefined && settings.collapsedByDefault === undefined) {
        settings.collapsedByDefault = false;
      }

      // Convert 'normal', 'fast', and 'slow' animation speed settings to their respective speed in milliseconds
      if (typeof (settings.animationSpeed) === 'string') {
        settings.animationSpeed = animationSpeeds[settings.animationSpeed];
      }

      $('a.anchor').remove().prependTo('body');

      // Store fgnpTabs object on container so we can easily set
      // properties throughout
      $container.data('fgnpTabs', {});

      plugin.setTransitions();

      plugin.getTabs();

      addClasses();

      setDefaultTab();

      bindToTabClicks();

      initHashChange();

      initCycle();

      // Append data-fgnpTabs HTML attribute to make easy to query for
      // fgnpTabs instances via CSS pseudo-selector
      $container.attr('data-fgnpTabs', true);
    };

    // Set transitions for switching between tabs based on options.
    // Could be used to update transitions if settings are changes.
    plugin.setTransitions = function () {
      transitions = (settings.animate) ? {
        show: settings.transitionIn,
        hide: settings.transitionOut,
        speed: settings.animationSpeed,
        collapse: settings.transitionCollapse,
        uncollapse: settings.transitionUncollapse,
        halfSpeed: settings.animationSpeed / 2
      } : {
        show: 'show',
        hide: 'hide',
        speed: 0,
        collapse: 'hide',
        uncollapse: 'show',
        halfSpeed: 0
      };
    };

    // Find and instantiate tabs and panels.
    // Could be used to reset tab and panel collection if markup is
    // modified.
    plugin.getTabs = function () {
      var $matchingPanel;

      // Find the initial set of elements matching the setting.tabs
      // CSS selector within the container
      plugin.tabs = $container.find(settings.tabs),

        // Instantiate panels as empty jquery object
        plugin.panels = $(),

        plugin.tabs.each(function () {
          var $tab = $(this),
            $a = $tab.children('a'),

            // targetId is the ID of the panel, which is either the
            // `href` attribute for non-ajax tabs, or in the
            // `data-target` attribute for ajax tabs since the `href` is
            // the ajax URL
            targetId = $tab.children('a').data('target');

          $tab.data('fgnpTabs', {});

          // If the tab has a `data-target` attribute, and is thus an ajax tab
          if (targetId !== undefined && targetId !== null) {
            $tab.data('fgnpTabs').ajax = $a.attr('href');
          } else {
            targetId = $a.attr('href');
          }
          targetId = targetId.match(/#([^\?]+)/)[1];

          $matchingPanel = settings.panelContext.find('#' + targetId);

          // If tab has a matching panel, add it to panels
          if ($matchingPanel.length) {

            // Store panel height before hiding
            $matchingPanel.data('fgnpTabs', {
              position: $matchingPanel.css('position'),
              visibility: $matchingPanel.css('visibility')
            });

            // Don't hide panel if it's active (allows `getTabs` to be called manually to re-instantiate tab collection)
            $matchingPanel.not(settings.panelActiveClass).hide();

            plugin.panels = plugin.panels.add($matchingPanel);

            $tab.data('fgnpTabs').panel = $matchingPanel;

            // Otherwise, remove tab from tabs collection
          } else {
            plugin.tabs = plugin.tabs.not($tab);
          }
        });
    };

    // Select tab and fire callback
    plugin.selectTab = function ($clicked, callback) {
      var $targetPanel = $clicked.parent().data('fgnpTabs').panel,
        ajaxUrl = $clicked.parent().data('fgnpTabs').ajax;

      //Tab is disabled, don't switch to it
      if ($clicked.parent().hasClass(settings.disabledClass)) {
        return false;
      }

      // Tab is collapsible and active => toggle collapsed state
      if (settings.collapsible && !skipUpdateToHash && ($clicked.hasClass(settings.tabActiveClass) || $clicked.hasClass(settings.collapsedClass))) {
        plugin.toggleTabCollapse($clicked, $targetPanel, ajaxUrl, callback);

        // Tab is not active and panel is not active => select tab
      } else if (!$clicked.hasClass(settings.tabActiveClass) || !$targetPanel.hasClass(settings.panelActiveClass)) {
        //Tab is active, and not collapsible, do nothing
        if (!$clicked.parent().hasClass(settings.tabActiveClass) || $('body').hasClass('fgnp-device-mobile')) {
          activateTab($clicked, $targetPanel, ajaxUrl, callback);
        }

        // Cache is disabled => reload (e.g reload an ajax tab).
      } else if (!settings.cache) {
        activateTab($clicked, $targetPanel, ajaxUrl, callback);
      }

    };

    // Toggle tab collapsed state and fire callback
    plugin.toggleTabCollapse = function ($clicked, $targetPanel, ajaxUrl, callback) {
      plugin.panels.stop(true, true);

      if (fire($container, 'fgnpTabs:before', [$clicked, $targetPanel, settings])) {
        plugin.tabs.filter('.' + settings.tabActiveClass).removeClass(settings.tabActiveClass).children().removeClass(settings.tabActiveClass);

        // If panel is collapsed, uncollapse it
        if ($clicked.hasClass(settings.collapsedClass)) {

          // If ajax panel and not already cached
          if (ajaxUrl && (!settings.cache || !$clicked.parent().data('fgnpTabs').cached)) {
            $container.trigger('fgnpTabs:ajax:beforeSend', [$clicked, $targetPanel]);

            $targetPanel.load(ajaxUrl, function (response, status, xhr) {
              $clicked.parent().data('fgnpTabs').cached = true;
              $container.trigger('fgnpTabs:ajax:complete', [$clicked, $targetPanel, response, status, xhr]);
            });
          }

          // Update CSS classes of tab and panel
          $clicked.parent()
            .removeClass(settings.collapsedClass)
            .addClass(settings.tabActiveClass)
            .children()
            .removeClass(settings.collapsedClass)
            //.addClass(settings.tabActiveClass)
          ;

          $targetPanel
            .addClass(settings.panelActiveClass)[transitions.uncollapse](transitions.speed, settings.transitionUncollapseEasing, function () {
              $container.trigger('fgnpTabs:midTransition', [$clicked, $targetPanel, settings]);
              if (typeof callback == 'function') callback();
            });

          // Otherwise, collapse it
        } else {

          // Update CSS classes of tab and panel
          $clicked.addClass(settings.collapsedClass)
            .parent()
            .addClass(settings.collapsedClass);

          $targetPanel
            .removeClass(settings.panelActiveClass)[transitions.collapse](transitions.speed, settings.transitionCollapseEasing, function () {
              $container.trigger('fgnpTabs:midTransition', [$clicked, $targetPanel, settings]);
              if (typeof callback == 'function') callback();
            });
        }
      }
    };

    // Find tab with target panel matching value
    plugin.matchTab = function (hash) {
      return plugin.tabs.find('[href="' + hash + '"],[data-target="' + hash + '"]').first();
    };

    // Find panel with `id` matching value
    plugin.matchInPanel = function (hash) {
      return (hash && plugin.validId(hash) ? plugin.panels.filter(':has(' + hash + ')').first() : []);
    };

    // Make sure hash is a valid id value (admittedly strict in that HTML5 allows almost anything without a space)
    // but jQuery has issues with such id values anyway, so we can afford to be strict here.
    plugin.validId = function (id) {
      return id.substr(1).match(/^[A-Za-z]+[A-Za-z0-9\-_:\.].$/);
    };

    // Select matching tab when URL hash changes
    plugin.selectTabFromHashChange = function () {
      var hash = window.location.hash.match(/^[^\?]*/)[0],
        $tab = plugin.matchTab(hash),
        $panel;

      if (settings.updateHash) {

        // If hash directly matches tab
        if ($tab.length) {
          skipUpdateToHash = true;
          plugin.selectTab($tab);

        } else {
          $panel = plugin.matchInPanel(hash);

          // If panel contains element matching hash
          if ($panel.length) {
            hash = '#' + $panel.attr('id');
            $tab = plugin.matchTab(hash);
            skipUpdateToHash = true;
            plugin.selectTab($tab);

            // If default tab is not active...
          } else if (!$defaultTab.hasClass(settings.tabActiveClass) && !settings.cycle) {
            // ...and hash is blank or matches a parent of the tab container or
            // if the last tab (before the hash updated) was one of the other tabs in this container.
            if (hash === '' || plugin.matchTab(lastHash).length || $container.closest(hash).length) {
              skipUpdateToHash = true;
              plugin.selectTab($defaultTabLink);
            }
          }
        }
      }
    };

    // Cycle through tabs
    plugin.cycleTabs = function (tabNumber) {
      if (settings.cycle) {
        tabNumber = tabNumber % plugin.tabs.length;
        var $tab = $(plugin.tabs[tabNumber]).children('a').first();
        skipUpdateToHash = true;
        plugin.selectTab($tab, function () {
          setTimeout(function () {
            plugin.cycleTabs(tabNumber + 1);
          }, settings.cycle);
        });
      }
    };

    // Convenient public methods
    plugin.publicMethods = {
      select: function (tabSelector) {
        var $tab;

        // Find tab container that matches selector (like 'li#tab-one' which contains tab link)
        if (($tab = plugin.tabs.filter(tabSelector)).length === 0) {

          // Find direct tab link that matches href (like 'a[href="#panel-1"]')
          if (($tab = plugin.tabs.find('a[href="' + tabSelector + '"]')).length === 0) {

            // Find direct tab link that matches selector (like 'a#tab-1')
            if (($tab = plugin.tabs.find('a' + tabSelector)).length === 0) {

              // Find direct tab link that matches data-target (lik 'a[data-target="#panel-1"]')
              if (($tab = plugin.tabs.find('[data-target="' + tabSelector + '"]')).length === 0) {

                // Find direct tab link that ends in the matching href (like 'a[href$="#panel-1"]', which would also match http://example.com/currentpage/#panel-1)
                if (($tab = plugin.tabs.find('a[href$="' + tabSelector + '"]')).length === 0) {

                  $.error('Tab \'' + tabSelector + '\' does not exist in tab set');
                }
              }
            }
          }
        } else {
          // Select the child tab link, since the first option finds the tab container (like <li>)
          $tab = $tab.children('a').first();
        }
        plugin.selectTab($tab);
      }
    };

    // =============================================================
    // Private functions
    // =============================================================

    // Triggers an event on an element and returns the event result
    var fire = function (obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    };

    // Add CSS classes to markup (if specified), called by init
    var addClasses = function () {
      $container.addClass(settings.containerClass);
      plugin.tabs.parent().addClass(settings.tabsClass);
      plugin.tabs.addClass(settings.tabClass);
      plugin.panels.addClass(settings.panelClass);
    };

    // Set the default tab, whether from hash (bookmarked) or option,
    // called by init
    var setDefaultTab = function () {
      var hash = window.location.hash.match(/^[^\?]*/)[0],
        $selectedTab = plugin.matchTab(hash).parent(),
        $panel;

      // If hash directly matches one of the tabs, active on page-load
      if ($selectedTab.length === 1) {
        $defaultTab = $selectedTab;
        settings.cycle = false;

      } else {
        $panel = plugin.matchInPanel(hash);

        // If one of the panels contains the element matching the hash,
        // make it active on page-load
        if ($panel.length) {
          hash = '#' + $panel.attr('id');
          $defaultTab = plugin.matchTab(hash).parent();

          // Otherwise, make the default tab the one that's active on page-load
        } else {
          $defaultTab = plugin.tabs.parent().find(settings.defaultTab);
          if ($defaultTab.length === 0) {
            $defaultTab = plugin.tabs.parent().find(settings.firstChild);
          }
        }
      }

      $defaultTabLink = $defaultTab.children('a').first();

      activateDefaultTab($selectedTab);
    };

    // Activate defaultTab (or collapse by default), called by setDefaultTab
    var activateDefaultTab = function ($selectedTab) {
      plugin.tabs.filter(':has(".' + settings.tabActiveClass + '")').removeClass(settings.tabActiveClass).children().removeClass(settings.tabActiveClass);
      var defaultPanel,
        defaultAjaxUrl;

      if (settings.collapsible && $selectedTab.length === 0 && settings.collapsedByDefault) {
        $defaultTab
          .addClass(settings.collapsedClass)
          .children()
          .addClass(settings.collapsedClass);

      } else {
        defaultPanel = $($defaultTab.data('fgnpTabs').panel);
        defaultAjaxUrl = $defaultTab.data('fgnpTabs').ajax;

        if (defaultAjaxUrl && (!settings.cache || !$defaultTab.data('fgnpTabs').cached)) {
          $container.trigger('fgnpTabs:ajax:beforeSend', [$defaultTabLink, defaultPanel]);
          defaultPanel.load(defaultAjaxUrl, function (response, status, xhr) {
            $defaultTab.data('fgnpTabs').cached = true;
            $container.trigger('fgnpTabs:ajax:complete', [$defaultTabLink, defaultPanel, response, status, xhr]);
          });
        }

        $defaultTab.data('fgnpTabs').panel
          .show()
          .addClass(settings.panelActiveClass);

        $defaultTab
          .addClass(settings.tabActiveClass)
          .children();
      }

      // Fire event when the plugin is initialised
      $container.trigger('fgnpTabs:initialised', [$defaultTabLink, defaultPanel]);
    };

    // Bind tab-select funtionality to namespaced click event, called by
    // init
    var bindToTabClicks = function () {
      plugin.tabs.children('a').on(settings.bind_str, function (e) {

        // Stop cycling when a tab is clicked
        settings.cycle = false;

        // Hash will be updated when tab is clicked,
        // don't cause tab to re-select when hash-change event is fired
        skipUpdateToHash = false;

        // Select the panel for the clicked tab
        plugin.selectTab($(this));

        // Don't follow the link to the anchor
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
      });
    };

    // Activate a given tab/panel, called from plugin.selectTab:
    //
    //   * fire `fgnpTabs:before` hook
    //   * get ajax if new tab is an uncached ajax tab
    //   * animate out previously-active panel
    //   * fire `fgnpTabs:midTransition` hook
    //   * update URL hash
    //   * animate in newly-active panel
    //   * update CSS classes for inactive and active tabs/panels
    //
    // TODO: This could probably be broken out into many more modular
    // functions
    var activateTab = function ($clicked, $targetPanel, ajaxUrl, callback) {
      plugin.panels.stop(true, true);

      if (fire($container, 'fgnpTabs:before', [$clicked, $targetPanel, settings])) {
        var $visiblePanel = plugin.panels.filter(':visible'),
          showPanel,
          hash = window.location.hash.match(/^[^\?]*/)[0];

        // Set lastHash to help indicate if defaultTab should be
        // activated across multiple tab instances.
        lastHash = hash;

        // TODO: Move this function elsewhere
        showPanel = function () {
          // At this point, the previous panel is hidden, and the new one will be selected
          $container.trigger('fgnpTabs:midTransition', [$clicked, $targetPanel, settings]);

          // Reset a height of scroll area
          $targetPanel.css({
            display: 'block',
            visibility: 'hidden'
          }).find('.fgnp-scrollable').fgnpScrollable();
          $targetPanel.css({
            display: 'none',
            visibility: ''
          });

          if (settings.updateHash && !skipUpdateToHash) {
            //window.location = url.toString().replace((url.pathname + hash), (url.pathname + $clicked.attr('href')));
            // Not sure why this behaves so differently, but it's more straight forward and seems to have less side-effects
            window.location.hash = '#' + $targetPanel.attr('id');
          } else {
            skipUpdateToHash = false;
          }

          $targetPanel
            [transitions.show](transitions.speed, settings.transitionInEasing, function () {
              // Bug fix here. Previously it set a min-height to this container, then unset height and min-height
              // Comments by the developer said that this was a bug fix, but it was interfering in .adjustScrollSize(), so I had to take it out
              // Not sure if this will cause a bug or not, but here goes nothing
              // - Gareth
              //$panelContainer.css({height: '', 'min-height': ''}); // After the transition, unset the height
              $container.trigger('fgnpTabs:after', [$clicked, $targetPanel, settings]);
              // callback only gets called if selectTab actually does something, since it's inside the if block
              if (typeof callback == 'function') {
                callback();
              }
            });
        };

        if (ajaxUrl && (!settings.cache || !$clicked.parent().data('fgnpTabs').cached)) {
          $container.trigger('fgnpTabs:ajax:beforeSend', [$clicked, $targetPanel]);
          $targetPanel.load(ajaxUrl, function (response, status, xhr) {
            $clicked.parent().data('fgnpTabs').cached = true;
            $container.trigger('fgnpTabs:ajax:complete', [$clicked, $targetPanel, response, status, xhr]);
          });
        }

        // Change the active tab *first* to provide immediate feedback when the user clicks
        plugin.tabs.filter('.' + settings.tabActiveClass).removeClass(settings.tabActiveClass).children().removeClass(settings.tabActiveClass);
        plugin.tabs.filter('.' + settings.collapsedClass).removeClass(settings.collapsedClass).children().removeClass(settings.collapsedClass);
        $clicked.parent().addClass(settings.tabActiveClass);

        plugin.panels.filter('.' + settings.panelActiveClass).removeClass(settings.panelActiveClass);
        $targetPanel.addClass(settings.panelActiveClass);

        if ($visiblePanel.length) {
          $visiblePanel
            [transitions.hide](transitions.speed, settings.transitionOutEasing, showPanel);
        } else {
          $targetPanel
            [transitions.uncollapse](transitions.speed, settings.transitionUncollapseEasing, showPanel);
        }
      }
    };

    // Setup hash-change callback for forward- and back-button
    // functionality, called by init
    var initHashChange = function () {

      // enabling back-button with jquery.hashchange plugin
      // http://benalman.com/projects/jquery-hashchange-plugin/
      if (typeof $(window).hashchange === 'function') {
        $(window).hashchange(function () {
          plugin.selectTabFromHashChange();
        });
      } else if ($.address && typeof $.address.change === 'function') { // back-button with jquery.address plugin http://www.asual.com/jquery/address/docs/
        $.address.change(function () {
          plugin.selectTabFromHashChange();
        });
      }
    };

    // Begin cycling if set in options, called by init
    var initCycle = function () {
      var tabNumber;
      if (settings.cycle) {
        tabNumber = plugin.tabs.index($defaultTab);
        setTimeout(function () {
          plugin.cycleTabs(tabNumber + 1);
        }, settings.cycle);
      }
    };

    plugin.init();

  };

  $.fn.fgnpTabs = function (options) {
    var args = arguments;

    return this.each(function () {
      var $this = $(this),
        plugin = $this.data('fgnpTabs');

      // Initialization was called with $(el).fgnpTabs( { options } );
      if (undefined === plugin) {
        plugin = new $.fgnpTabs(this, options);
        $this.data('fgnpTabs', plugin);
      }

      // User called public method
      if (plugin.publicMethods[options]) {
        return plugin.publicMethods[options](Array.prototype.slice.call(args, 1));
      }
    });
  };

})(jQuery);

/*! jQuery EasyTabs ends here */

/*
 * jquery.fgnp-tree.js v2.0.1
 * Copyright 2016 FUJITSU LIMITED
 *=============================================================================================================*/

(function ($) {

  var classes = {
    openClass: 'fgnp-expanded',
    closeClass: 'fgnp-collapsed',
    disabledClass: 'fgnp-disabled',
    currentClass: 'fgnp-current'
  };

  var dataName = {
    nodeType: 'node-type'
  };

  var privateMethods = {
    open: function ($treeNode, animation) {
      $treeNode.addClass(classes.openClass).removeClass(classes.closeClass).children('ul').show(animation);
    },

    close: function ($treeNode, animation) {
      $treeNode.removeClass(classes.openClass).addClass(classes.closeClass).children('ul').hide(animation);
    },

    toggle: function ($treeNode, animation) {
      ($treeNode.hasClass(classes.openClass) ? privateMethods.close : privateMethods.open)($treeNode, animation);
    },

    selectNode: function ($node) {
      var $tree = $node.closest('.fgnp-tree');
      if (($node.data(dataName.nodeType) === 'object' || !privateMethods.isTreeNode($node)) && !$node.hasClass(classes.disabledClass)) {
        $tree.find('.' + classes.currentClass).removeClass(classes.currentClass);
        $node.addClass(classes.currentClass);
      }
    },

    isTreeNode: function ($node) {
      return $node.has('> ul').length !== 0;
    },

    hasCurrentNode: function ($treeNode) {
      return $treeNode.has('.' + classes.currentClass).length !== 0;
    },

    setEvent: function () {
      // Add fgnp-hover to li elements
      if (!$('body').hasClass('fgnp-device-mobile')) {
        $(document).off('mouseover.fgnpListView').on('mouseover.fgnpListView', '.fgnp-listview.fgnp-hover li', function (event) {
          $(this).addClass('fgnp-hover-item').parents().removeClass('fgnp-hover-item');
          event.stopPropagation();
          return false;
        }).off('mouseout.fgnpListView').on('mouseout.fgnpListView', '.fgnp-listview.fgnp-hover li', function () {
          $(this).removeClass('fgnp-hover-item');
          return false;
        });
      }
      return this;
    }
  };

  $.fn.fgnpTreeOpen = function (animation) {
    privateMethods.open($(this).parent(), animation);
  };

  $.fn.fgnpTreeClose = function (animation) {
    privateMethods.close($(this).parent(), animation);
  };

  $.fn.fgnpTreeClickEvent = function () {
    privateMethods.toggle(this, this.data('options').animation);
  };

  $.fn.fgnpTree = function (options) {
    privateMethods.setEvent();

    var defaultOptions = {
      animation: 'fast'
    };

    options = $.extend({}, defaultOptions, options);

    return $(this).each(function () {
      var $tree = $(this);
      if ($tree.is('ul')) {
        var $nodes = $tree.find('li');

        $nodes.each(function () {
          var $node = $(this);
          $node.off('click.fgnpTree').data('options', options);
          $node.children('span.fgnp-tree-link').remove();
          $node.children('.fgnp-text').off('click.fgnpTree').on('click.fgnpTree', function () {
            var $node = $(this).parent();
            privateMethods.selectNode($node);
          });

          if (privateMethods.isTreeNode($node)) {
            var $treeNode = $node;
            if ($treeNode.hasClass(classes.openClass) || privateMethods.hasCurrentNode($treeNode)) {
              privateMethods.open($treeNode);
            } else {
              privateMethods.close($treeNode);
            }
            $treeNode.prepend('<span class="fgnp-tree-link"></span>');

            $treeNode.on('click.fgnpTree', function (event) {
              var treeNode = event.currentTarget;
              var $treeNode = $(treeNode);

              if ($treeNode.hasClass(classes.disabledClass)) {
                return false;
              }

              var $target = $(event.target);
              if (event.target !== treeNode && ($target.is('ul') || $target.parent().get(0) !== treeNode)) {
                return;
              }

              if ($treeNode.data(dataName.nodeType) === 'object' && $target.is('a')) {
                return;
              }

              event.stopPropagation();
              privateMethods.toggle($treeNode, options.animation);
            });
          } else {
            $node.removeClass(classes.openClass).removeClass(classes.closeClass);
          }
        });
      }
    });
  };
})(jQuery);

/* Tree Plugin ends here */

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

/*
 * jquery.fgnp-docready.js v2.0.1
 * Copyright 2016 FUJITSU LIMITED
 *=============================================================================================================*/

if (fgnpDocready === undefined) {
  var fgnpDocready = function fgnpDocready() {

    // Detect Device

    $.fgnpDetectBrowser();
    $.fgnpDetectOrientation();

    // Layout Functions

    $.fgnpLayout();
    $('.fgnp-layout-toggle').fgnpLayoutToggle();
    $.fgnpPages();

    // Interaction Functions

    $(document).fgnpKeyboardFocus('.fgnp-button, .fgnp-flat-button');
    $(document).fgnpTouchActive('.fgnp-button, .fgnp-flat-button');

    // Binding Plugins

    $.fgnpPlugins('fgnpAndroidSelect');
    $.fgnpPlugins('fgnpClearButton');
    $.fgnpPlugins('fgnpControlGroup');
    $.fgnpPlugins('fgnpServiceBar');
    $('[data-dropdown]').fgnpDropdown();
    $('.fgnp-accordion').fgnpAccordion();
    $('.fgnp-date').fgnpDatepicker();
    $('.fgnp-data-table.fgnp-sortable').fgnpTableSortable();
    $('.fgnp-tabs').fgnpTabs();
    $('.fgnp-tree').fgnpTree();

    // Binding jQuery UI plugins

    $.fgnpJqueryUi('fgnpResizable');
    $.fgnpJqueryUi('fgnpSlider');
  };
}

$(document).ready(fgnpDocready);

var docready = fgnpDocready; // eslint-disable-line no-unused-vars

/* Docready ends here */
