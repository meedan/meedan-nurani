/*jslint nomen: true, plusplus: true, todo: true, white: true, browser: true, indent: 2 */
(function ($) {
  "use strict";

  /**
   * Drupal integration. Applies a tooltip effect.
   */
  Drupal.behaviors.nuraniProfileTooltip = {
    attach: function (context) {
      var that = this;

      $('a.username,.user-picture a,.views-field-picture a', context)
        .filter(':not(.tooltip-processed)')
        .addClass('tooltip-processed')
        .each(function () {
          $(this).data('nuraniTooltip', new NuraniTooltip(this));
        });
    }
  };


  function NuraniTooltip(element) {
    this.$element = $(element);
    this.$tooltip = null;
    this.spinner  = null;

    this.data     = this.$element.attr('href');
    this.yOffset  = 10;

    this.init();

    return this;
  }

  NuraniTooltip.prototype.init = function () {
    var that = this;

    this.$element.click(function (e) { return false; });
    this.$element.hover(function (e) { that.hoverOver(e); },
                        function (e) { that.hoverOut(e); });
  };

  NuraniTooltip.prototype.hoverOver = function (e) {
    var that = this;

    this.$tooltip = $('<div id="tooltip" class="loading"></div>').appendTo('body');
    this.underRugTitles();

    $.ajax({
      url: Drupal.settings.basePath + Drupal.settings.pathPrefix + 'ajax/nurani_profile?data=' + this.data,
      cache: true,
      success: function (data) {
        if (that.spinner) {
          that.spinner.stop();
        }
        that.spinner = null;

        if (data && that.$tooltip) {
          that.$tooltip
            .html(data)
            .removeClass('loading');

          that.positionTooltip();
        }
      }
    });

    this.positionTooltip().fadeIn('fast');

    // Use spin.js for loading effect
    this.spinner = new Spinner(Drupal.settings.spin || {}).spin(this.$tooltip[0]);
  };

  NuraniTooltip.prototype.hoverOut = function (e) {
    this.reinstateTitles();
    this.$tooltip.remove();
    this.$tooltip = null;
  };

  NuraniTooltip.prototype.positionTooltip = function () {
    var offset = this.$element.offset(),
        width = this.$tooltip.outerWidth(true),
        height = this.$tooltip.outerHeight(true);

    return this.$tooltip
             .css('top', offset.top - height - this.yOffset)
             .css('left', offset.left);
  };

  /**
   * Recursively sweeps all titles under the rug.
   */
  NuraniTooltip.prototype.underRugTitles = function () {
    this.$element
      .find('*[title]')
      .andSelf()
      .each(function () {
        var $this = $(this);
        $this.data('title', $this.attr('title'));
        $this.attr('title', '');
      });
  };

  /**
   * Recursively puts the titles back.
   */
  NuraniTooltip.prototype.reinstateTitles = function () {
    this.$element
      .find('*[title]')
      .andSelf()
      .each(function () {
        var $this = $(this);
        $this.attr('title', $this.data('title'));
        $this.data('title', null);
      });
  };


  /**
   * Helper plugin to enable ajax_command_invoke() to do more complex tasks.
   */
  $.fn.delayedEffect = function(delay, effect, removeAfter) {
    var $this = $(this);

    removeAfter = typeof removeAfter !== 'undefined' ? removeAfter : false;

    setTimeout(function () {
      $this[effect]
        .call($this, function () {
          if (removeAfter) {
            $(this).remove();
          }
        });
    }, delay);
  };

}(jQuery));
