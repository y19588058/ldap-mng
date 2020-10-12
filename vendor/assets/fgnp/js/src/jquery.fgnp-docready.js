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
