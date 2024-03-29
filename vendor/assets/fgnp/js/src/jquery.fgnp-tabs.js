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
