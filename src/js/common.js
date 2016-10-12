(function ($, Modernizr) {

  // Mode of the modern standard
  'use strict';

  // Function to execute when the DOM is fully loaded.
  $(function () {

    // Variables

    // If JavaScript enabled
    jsEnable('html');

    // Scroll To Top
    scrollToTop('.scroll-top');

    // Smooth scrolling to anchor links
    scrollToAnchorLinks('body');

    // Universal JavaScript for blocks with tabs
    tabs('.fk-tabs', '.fk-tabs-list', '.fk-tab-item');

    // JS for working with accordion
    fk_accordion('.fk-accordion', '.fk-accordion-switch', 'js-opened');

    // Modernizr support
    if (Modernizr) {

      console.info('Library Modernizr connected');

    } else {

      console.info('Library Modernizr is not connected');

    }

  });

  /**
   * fk javascript enable
   *
   * @example
   * jsEnable('html');
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   * @param {string} [element] - selected element (the default html tag)
   */
  function jsEnable(element) {

    var el = element || 'html';

    $(el).removeClass('no-js').addClass('js');

  }

  /**
   * fk Scroll To Top
   *
   * @example
   * scrollToTop('.scroll-top');
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   * @param {string} scroll_id - selected item to perform the a clicked
   * @param {(number|string)} [scroll_duration] - determining how long the animation will run
   */
  function scrollToTop(scroll_id, scroll_duration) {

    var el = $(scroll_id), duration = scroll_duration || 'slow';

    el.on('click', function () {

      $('html, body').animate({scrollTop: 0}, duration);

      return false;

    });

  }

  /**
   * fk smooth scrolling to anchor links
   *
   * @example
   * scrollToAnchorLinks('body');
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   * @param {string} id - selected item to perform the a clicked
   * @param {(number|string)} [scroll_duration] - determining how long the animation will run
   */
  function scrollToAnchorLinks(id, scroll_duration) {

    var el = $(id), duration = scroll_duration || 1000;

    el.on('click', 'a[href*="#"]:not([href="#"])', function () {

      var el = $(this).attr('href');

      $('html, body').animate({scrollTop: $(el).offset().top}, duration);

      return false;

    });

  }

  /**
   * fk Preloader
   *
   * @example
   * var preloader = new fk_preloader('.preloader');
   * preloader.show();
   * preloader.hide();
   * @constructor
   * @this {Preloader}
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   * @param {string} element - selected element
   * @param {number} [el_delay] - delay before function fadeOut is start
   * @param {(number|string)} [el_duration] - determining how long the fadeOut will run
   */
  function Preloader(element, el_delay, el_duration) {

    if (!$(element).length) {

      $('body').append('<span class="preloader"></span>');

    }

    var el = $(element), delay = el_delay || 350, duration = el_duration || 'slow';

    this.hide = function () {

      el.delay(delay).fadeOut(duration);

    };

    this.show = function () {

      el.delay(delay).fadeIn(duration);

    };

  }

  /**
   * fk Tabs
   *
   * @example
   * tabs('.fk-tabs', '.fk-tabs-list', '.fk-tab-item');
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   * @param {string} tabs_container - main container for tabs
   * @param {string} tabs_list - ul list for each tab item
   * @param {string} tabs_item - tab block for each li item
   */
  function tabs(tabs_container, tabs_list, tabs_item) {

    var parent = $(tabs_container), ul = $(tabs_list), child = $(tabs_item);

    ul.on('click', 'li:not(.active)', function () {

      $(this)
        .addClass('active').siblings().removeClass('active')
        .closest(parent).find(child).removeClass('active').eq($(this).index()).addClass('active');
    });

  }

  /**
   * fk accordion
   *
   * @example
   * fk_accordion('.fk-accordion', '.fk-accordion-switch', 'js-opened');
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   * @param {string} accordion_container - container for each accordion item
   * @param {string} accordion_switch - element for open and close accordion
   * @param {string} [accordion_class_open] - class when accordion is opened
   */
  function fk_accordion(accordion_container, accordion_switch, accordion_class_open) {

    var fk_accordion = $(accordion_container),
      fk_switch = $(accordion_switch),
      fk_opened = accordion_class_open || 'js-opened';

    fk_switch.on('click', function () {

      var el_parent = $(this).closest(fk_accordion);

      if (el_parent.hasClass(fk_opened)) {

        el_parent.removeClass(fk_opened);

      } else {

        el_parent.addClass(fk_opened).siblings().removeClass(fk_opened);

      }

    });
  }

}(jQuery, window.Modernizr));
