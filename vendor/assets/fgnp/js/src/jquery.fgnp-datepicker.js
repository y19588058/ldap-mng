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
