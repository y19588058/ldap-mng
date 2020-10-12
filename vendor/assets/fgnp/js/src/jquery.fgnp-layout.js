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

