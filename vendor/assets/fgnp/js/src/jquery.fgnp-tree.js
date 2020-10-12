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
