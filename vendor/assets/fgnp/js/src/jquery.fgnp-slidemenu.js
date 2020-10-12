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
