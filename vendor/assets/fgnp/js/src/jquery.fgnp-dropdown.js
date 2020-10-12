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
