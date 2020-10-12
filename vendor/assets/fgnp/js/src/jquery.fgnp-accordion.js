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
