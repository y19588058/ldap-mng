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
