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
