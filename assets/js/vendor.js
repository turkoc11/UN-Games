/**
 * Accordion v3.3.2
 * Lightweight and accessible accordion module created in pure Javascript
 * https://github.com/michu2k/Accordion
 *
 * Copyright (c) Michał Strumpf
 * Published under MIT License
 */

(function (window) {
  'use strict';

  var uniqueId = 0;

  /**
   * Core
   * @param {string|HTMLElement} selectorOrElement = container in which the script will be initialized
   * @param {object} userOptions = options defined by user
   */
  var Accordion = function Accordion(selectorOrElement, userOptions) {
    var _this5 = this;
    var _this = this;
    var eventsAttached = false;

    // Break the array with the selectors
    if (Array.isArray(selectorOrElement)) {
      if (selectorOrElement.length) {
        return selectorOrElement.map(function (single) {
          return new Accordion(single, userOptions);
        });
      }

      return false;
    }

    var core = {
      /**
       * Init accordion
       */
      init: function init() {
        var defaults = {
          duration: 600, // animation duration in ms {number}
          ariaEnabled: true, // add ARIA elements to the HTML structure {boolean}
          collapse: true, // allow collapse expanded panel {boolean}
          showMultiple: false, // show multiple elements at the same time {boolean}
          onlyChildNodes: true, // disabling this option will find all items in the container {boolean}
          openOnInit: [], // show accordion elements during initialization {array}
          elementClass: 'ac', // element class {string}
          triggerClass: 'ac-trigger', // trigger class {string}
          panelClass: 'ac-panel', // panel class {string}
          activeClass: 'is-active', // active element class {string}
          beforeOpen: function beforeOpen() {}, // calls before the item is opened {function}
          onOpen: function onOpen() {}, // calls when the item is opened {function}
          beforeClose: function beforeClose() {}, // calls before the item is closed {function}
          onClose: function onClose() {}, // calls when the item is closed {function}
        };

        // Extend default options
        this.options = Object.assign(defaults, userOptions);

        var isString = typeof selectorOrElement === 'string';

        this.container = isString
          ? document.querySelector(selectorOrElement)
          : selectorOrElement;
        this.createDefinitions();

        _this.attachEvents();
      },

      /**
       * Create element definitions
       */
      createDefinitions: function createDefinitions() {
        var _this2 = this;
        var _this$options = this.options,
          elementClass = _this$options.elementClass,
          openOnInit = _this$options.openOnInit,
          onlyChildNodes = _this$options.onlyChildNodes;

        var allElements = onlyChildNodes
          ? this.container.childNodes
          : this.container.querySelectorAll('.'.concat(elementClass));

        this.elements = Array.from(allElements).filter(function (el) {
          return el.classList && el.classList.contains(elementClass);
        });

        this.firstElement = this.elements[0];
        this.lastElement = this.elements[this.elements.length - 1];

        this.elements
          .filter(function (element) {
            return !element.classList.contains('js-enabled');
          })
          .forEach(function (element) {
            // When JS is enabled, add the class to the element
            element.classList.add('js-enabled');

            _this2.generateIDs(element);
            _this2.setARIA(element);
            _this2.setTransition(element);

            var index = _this2.elements.indexOf(element);

            uniqueId++;
            openOnInit.includes(index)
              ? _this2.showElement(element, false)
              : _this2.closeElement(element, false);
          });
      },

      /**
       * Set transition
       * @param {HTMLElement} element = accordion item
       * @param {boolean} clear = clear transition duration
       */
      setTransition: function setTransition(element) {
        var clear =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : false;
        var _this$options2 = this.options,
          duration = _this$options2.duration,
          panelClass = _this$options2.panelClass;
        var panel = element.querySelector('.'.concat(panelClass));
        var transition = isWebkit('transitionDuration');

        panel.style[transition] = clear ? null : ''.concat(duration, 'ms');
      },

      /**
       * Generate unique IDs for each element
       * @param {HTMLElement} element = accordion item
       */
      generateIDs: function generateIDs(element) {
        var _this$options3 = this.options,
          triggerClass = _this$options3.triggerClass,
          panelClass = _this$options3.panelClass;
        var trigger = element.querySelector('.'.concat(triggerClass));
        var panel = element.querySelector('.'.concat(panelClass));

        element.setAttribute('id', 'ac-'.concat(uniqueId));
        trigger.setAttribute('id', 'ac-trigger-'.concat(uniqueId));
        panel.setAttribute('id', 'ac-panel-'.concat(uniqueId));
      },

      /**
       * Remove IDs
       * @param {HTMLElement} element = accordion item
       */
      removeIDs: function removeIDs(element) {
        var _this$options4 = this.options,
          triggerClass = _this$options4.triggerClass,
          panelClass = _this$options4.panelClass;
        var trigger = element.querySelector('.'.concat(triggerClass));
        var panel = element.querySelector('.'.concat(panelClass));

        element.removeAttribute('id');
        trigger.removeAttribute('id');
        panel.removeAttribute('id');
      },

      /**
       * Create ARIA
       * @param {HTMLElement} element = accordion item
       */
      setARIA: function setARIA(element) {
        var _this$options5 = this.options,
          ariaEnabled = _this$options5.ariaEnabled,
          triggerClass = _this$options5.triggerClass,
          panelClass = _this$options5.panelClass;
        if (!ariaEnabled) return;

        var trigger = element.querySelector('.'.concat(triggerClass));
        var panel = element.querySelector('.'.concat(panelClass));

        trigger.setAttribute('role', 'button');
        trigger.setAttribute('aria-controls', 'ac-panel-'.concat(uniqueId));
        trigger.setAttribute('aria-disabled', false);
        trigger.setAttribute('aria-expanded', false);

        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', 'ac-trigger-'.concat(uniqueId));
      },

      /**
       * Update ARIA
       * @param {HTMLElement} element = accordion item
       * @param {object} options
       * @param {boolean} options.ariaExpanded = value of the attribute
       * @param {boolean} options.ariaDisabled = value of the attribute
       */
      updateARIA: function updateARIA(element, _ref) {
        var ariaExpanded = _ref.ariaExpanded,
          ariaDisabled = _ref.ariaDisabled;
        var _this$options6 = this.options,
          ariaEnabled = _this$options6.ariaEnabled,
          triggerClass = _this$options6.triggerClass;
        if (!ariaEnabled) return;

        var trigger = element.querySelector('.'.concat(triggerClass));
        trigger.setAttribute('aria-expanded', ariaExpanded);
        trigger.setAttribute('aria-disabled', ariaDisabled);
      },

      /**
       * Remove ARIA
       * @param {HTMLElement} element = accordion item
       */
      removeARIA: function removeARIA(element) {
        var _this$options7 = this.options,
          ariaEnabled = _this$options7.ariaEnabled,
          triggerClass = _this$options7.triggerClass,
          panelClass = _this$options7.panelClass;
        if (!ariaEnabled) return;

        var trigger = element.querySelector('.'.concat(triggerClass));
        var panel = element.querySelector('.'.concat(panelClass));

        trigger.removeAttribute('role');
        trigger.removeAttribute('aria-controls');
        trigger.removeAttribute('aria-disabled');
        trigger.removeAttribute('aria-expanded');

        panel.removeAttribute('role');
        panel.removeAttribute('aria-labelledby');
      },

      /**
       * Focus element
       * @param {Event} e = event
       * @param {HTMLElement} element = accordion item
       */
      focus: function focus(e, element) {
        e.preventDefault();

        var triggerClass = this.options.triggerClass;
        var trigger = element.querySelector('.'.concat(triggerClass));
        trigger.focus();
      },

      /**
       * Focus first element
       * @param {Event} e = event
       */
      focusFirstElement: function focusFirstElement(e) {
        this.focus(e, this.firstElement);
        this.currFocusedIdx = 0;
      },

      /**
       * Focus last element
       * @param {Event} e = event
       */
      focusLastElement: function focusLastElement(e) {
        this.focus(e, this.lastElement);
        this.currFocusedIdx = this.elements.length - 1;
      },

      /**
       * Focus next element
       * @param {Event} e = event
       */
      focusNextElement: function focusNextElement(e) {
        var nextElIdx = this.currFocusedIdx + 1;
        if (nextElIdx > this.elements.length - 1)
          return this.focusFirstElement(e);

        this.focus(e, this.elements[nextElIdx]);
        this.currFocusedIdx = nextElIdx;
      },

      /**
       * Focus previous element
       * @param {Event} e = event
       */
      focusPrevElement: function focusPrevElement(e) {
        var prevElIdx = this.currFocusedIdx - 1;
        if (prevElIdx < 0) return this.focusLastElement(e);

        this.focus(e, this.elements[prevElIdx]);
        this.currFocusedIdx = prevElIdx;
      },

      /**
       * Show element
       * @param {HTMLElement} element = accordion item
       * @param {boolean} calcHeight = calculate the height of the panel
       */
      showElement: function showElement(element) {
        var calcHeight =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : true;
        var _this$options8 = this.options,
          panelClass = _this$options8.panelClass,
          activeClass = _this$options8.activeClass,
          collapse = _this$options8.collapse,
          beforeOpen = _this$options8.beforeOpen;
        if (calcHeight) beforeOpen(element);

        var panel = element.querySelector('.'.concat(panelClass));
        var height = panel.scrollHeight;

        element.classList.add(activeClass);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            panel.style.height = calcHeight ? ''.concat(height, 'px') : 'auto';
          });
        });

        this.updateARIA(element, {
          ariaExpanded: true,
          ariaDisabled: collapse ? false : true,
        });
      },

      /**
       * Close element
       * @param {HTMLElement} element = accordion item
       * @param {boolean} calcHeight = calculate the height of the panel
       */
      closeElement: function closeElement(element) {
        var calcHeight =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : true;
        var _this$options9 = this.options,
          panelClass = _this$options9.panelClass,
          activeClass = _this$options9.activeClass,
          beforeClose = _this$options9.beforeClose;
        var panel = element.querySelector('.'.concat(panelClass));
        var height = panel.scrollHeight;

        element.classList.remove(activeClass);

        if (calcHeight) {
          beforeClose(element);

          // Animation [X]px => 0
          requestAnimationFrame(function () {
            panel.style.height = ''.concat(height, 'px');

            requestAnimationFrame(function () {
              panel.style.height = 0;
            });
          });
        } else {
          // Hide element without animation 'auto' => 0
          panel.style.height = 0;
        }

        this.updateARIA(element, { ariaExpanded: false, ariaDisabled: false });
      },

      /**
       * Toggle element
       * @param {HTMLElement} element = accordion item
       */
      toggleElement: function toggleElement(element) {
        var _this$options10 = this.options,
          activeClass = _this$options10.activeClass,
          collapse = _this$options10.collapse;
        var isActive = element.classList.contains(activeClass);

        if (isActive && !collapse) return;
        return isActive
          ? this.closeElement(element)
          : this.showElement(element);
      },

      /**
       * Close all elements without the current element
       */
      closeElements: function closeElements() {
        var _this3 = this;
        var _this$options11 = this.options,
          activeClass = _this$options11.activeClass,
          showMultiple = _this$options11.showMultiple;
        if (showMultiple) return;

        this.elements.forEach(function (element, idx) {
          var isActive = element.classList.contains(activeClass);

          if (isActive && idx !== _this3.currFocusedIdx) {
            _this3.closeElement(element);
          }
        });
      },

      /**
       * Handle click
       * @param {PointerEvent} e = event
       */
      handleClick: function handleClick(e) {
        var _this4 = this;
        var target = e.currentTarget;

        this.elements.forEach(function (element, idx) {
          if (element.contains(target) && e.target.nodeName !== 'A') {
            _this4.currFocusedIdx = idx;

            _this4.closeElements();
            _this4.focus(e, element);
            _this4.toggleElement(element);
          }
        });
      },

      /**
       * Handle keydown
       * @param {KeyboardEvent} e = event
       */
      handleKeydown: function handleKeydown(e) {
        var KEYS = {
          ARROW_UP: 38,
          ARROW_DOWN: 40,
          HOME: 36,
          END: 35,
        };

        switch (e.keyCode) {
          case KEYS.ARROW_UP:
            return this.focusPrevElement(e);

          case KEYS.ARROW_DOWN:
            return this.focusNextElement(e);

          case KEYS.HOME:
            return this.focusFirstElement(e);

          case KEYS.END:
            return this.focusLastElement(e);

          default:
            return null;
        }
      },

      /**
       * Handle transitionend
       * @param {TransitionEvent} e = event
       */
      handleTransitionEnd: function handleTransitionEnd(e) {
        if (e.propertyName !== 'height') return;

        var _this$options12 = this.options,
          onOpen = _this$options12.onOpen,
          onClose = _this$options12.onClose;
        var panel = e.currentTarget;
        var height = parseInt(panel.style.height);
        var element = this.elements.find(function (element) {
          return element.contains(panel);
        });

        if (height > 0) {
          panel.style.height = 'auto';
          onOpen(element);
        } else {
          onClose(element);
        }
      },
    };

    /**
     * Attach events
     */
    this.attachEvents = function () {
      if (eventsAttached) return;
      var _core$options = core.options,
        triggerClass = _core$options.triggerClass,
        panelClass = _core$options.panelClass;

      core.handleClick = core.handleClick.bind(core);
      core.handleKeydown = core.handleKeydown.bind(core);
      core.handleTransitionEnd = core.handleTransitionEnd.bind(core);

      core.elements.forEach(function (element) {
        var trigger = element.querySelector('.'.concat(triggerClass));
        var panel = element.querySelector('.'.concat(panelClass));

        trigger.addEventListener('click', core.handleClick);
        trigger.addEventListener('keydown', core.handleKeydown);
        panel.addEventListener('webkitTransitionEnd', core.handleTransitionEnd);
        panel.addEventListener('transitionend', core.handleTransitionEnd);
      });

      eventsAttached = true;
    };

    /**
     * Detach events
     */
    this.detachEvents = function () {
      if (!eventsAttached) return;
      var _core$options2 = core.options,
        triggerClass = _core$options2.triggerClass,
        panelClass = _core$options2.panelClass;

      core.elements.forEach(function (element) {
        var trigger = element.querySelector('.'.concat(triggerClass));
        var panel = element.querySelector('.'.concat(panelClass));

        trigger.removeEventListener('click', core.handleClick);
        trigger.removeEventListener('keydown', core.handleKeydown);
        panel.removeEventListener(
          'webkitTransitionEnd',
          core.handleTransitionEnd
        );
        panel.removeEventListener('transitionend', core.handleTransitionEnd);
      });

      eventsAttached = false;
    };

    /**
     * Toggle accordion element
     * @param {number} elIdx = element index
     */
    this.toggle = function (elIdx) {
      var el = core.elements[elIdx];
      if (el) core.toggleElement(el);
    };

    /**
     * Open accordion element
     * @param {number} elIdx = element index
     */
    this.open = function (elIdx) {
      var el = core.elements[elIdx];
      if (el) core.showElement(el);
    };

    /**
     * Open all hidden accordion elements
     */
    this.openAll = function () {
      var _core$options3 = core.options,
        activeClass = _core$options3.activeClass,
        onOpen = _core$options3.onOpen;

      core.elements.forEach(function (element) {
        var isActive = element.classList.contains(activeClass);

        if (!isActive) {
          core.showElement(element, false);
          onOpen(element);
        }
      });
    };

    /**
     * Close accordion element
     * @param {number} elIdx = element index
     */
    this.close = function (elIdx) {
      var el = core.elements[elIdx];
      if (el) core.closeElement(el);
    };

    /**
     * Close all active accordion elements
     */
    this.closeAll = function () {
      var _core$options4 = core.options,
        activeClass = _core$options4.activeClass,
        onClose = _core$options4.onClose;

      core.elements.forEach(function (element) {
        var isActive = element.classList.contains(activeClass);

        if (isActive) {
          core.closeElement(element, false);
          onClose(element);
        }
      });
    };

    /**
     * Destroy accordion instance
     */
    this.destroy = function () {
      _this5.detachEvents();
      _this5.openAll();

      core.elements.forEach(function (element) {
        core.removeIDs(element);
        core.removeARIA(element);
        core.setTransition(element, true);
      });

      eventsAttached = true;
    };

    /**
     * Update accordion elements
     */
    this.update = function () {
      core.createDefinitions();

      _this5.detachEvents();
      _this5.attachEvents();
    };

    /**
     * Get supported property and add webkit prefix if needed
     * @param {string} property = property name
     * @return {string} property = property with optional webkit prefix
     */
    var isWebkit = function isWebkit(property) {
      if (typeof document.documentElement.style[property] === 'string') {
        return property;
      }

      property = capitalizeFirstLetter(property);
      property = 'webkit'.concat(property);

      return property;
    };

    /**
     * Capitalize the first letter in the string
     * @param {string} string = string
     * @return {string} string = changed string
     */
    var capitalizeFirstLetter = function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    core.init();
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Accordion;
  } else {
    window.Accordion = Accordion;
  }
})(window);

/*!
 * GSAP 3.11.2
 * https://greensock.com
 * 
 * @license Copyright 2022, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).window=t.window||{})}(this,function(e){"use strict";function _inheritsLoose(t,e){t.prototype=Object.create(e.prototype),(t.prototype.constructor=t).__proto__=e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function r(t){return"string"==typeof t}function s(t){return"function"==typeof t}function t(t){return"number"==typeof t}function u(t){return void 0===t}function v(t){return"object"==typeof t}function w(t){return!1!==t}function x(){return"undefined"!=typeof window}function y(t){return s(t)||r(t)}function P(t){return(i=yt(t,ot))&&Ce}function Q(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")}function R(t,e){return!e&&console.warn(t)}function S(t,e){return t&&(ot[t]=e)&&i&&(i[t]=e)||ot}function T(){return 0}function ea(t){var e,r,i=t[0];if(v(i)||s(i)||(t=[t]),!(e=(i._gsap||{}).harness)){for(r=gt.length;r--&&!gt[r].targetTest(i););e=gt[r]}for(r=t.length;r--;)t[r]&&(t[r]._gsap||(t[r]._gsap=new jt(t[r],e)))||t.splice(r,1);return t}function fa(t){return t._gsap||ea(Ot(t))[0]._gsap}function ga(t,e,r){return(r=t[e])&&s(r)?t[e]():u(r)&&t.getAttribute&&t.getAttribute(e)||r}function ha(t,e){return(t=t.split(",")).forEach(e)||t}function ia(t){return Math.round(1e5*t)/1e5||0}function ja(t){return Math.round(1e7*t)/1e7||0}function ka(t,e){var r=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),"+"===r?t+i:"-"===r?t-i:"*"===r?t*i:t/i}function la(t,e){for(var r=e.length,i=0;t.indexOf(e[i])<0&&++i<r;);return i<r}function ma(){var t,e,r=ct.length,i=ct.slice(0);for(dt={},t=ct.length=0;t<r;t++)(e=i[t])&&e._lazy&&(e.render(e._lazy[0],e._lazy[1],!0)._lazy=0)}function na(t,e,r,i){ct.length&&ma(),t.render(e,r,i||B&&e<0&&(t._initted||t._startAt)),ct.length&&ma()}function oa(t){var e=parseFloat(t);return(e||0===e)&&(t+"").match(at).length<2?e:r(t)?t.trim():t}function pa(t){return t}function qa(t,e){for(var r in e)r in t||(t[r]=e[r]);return t}function ta(t,e){for(var r in e)"__proto__"!==r&&"constructor"!==r&&"prototype"!==r&&(t[r]=v(e[r])?ta(t[r]||(t[r]={}),e[r]):e[r]);return t}function ua(t,e){var r,i={};for(r in t)r in e||(i[r]=t[r]);return i}function va(t){var e=t.parent||L,r=t.keyframes?function _setKeyframeDefaults(i){return function(t,e){for(var r in e)r in t||"duration"===r&&i||"ease"===r||(t[r]=e[r])}}($(t.keyframes)):qa;if(w(t.inherit))for(;e;)r(t,e.vars.defaults),e=e.parent||e._dp;return t}function xa(t,e,r,i,n){void 0===r&&(r="_first"),void 0===i&&(i="_last");var a,s=t[i];if(n)for(a=e[n];s&&s[n]>a;)s=s._prev;return s?(e._next=s._next,s._next=e):(e._next=t[r],t[r]=e),e._next?e._next._prev=e:t[i]=e,e._prev=s,e.parent=e._dp=t,e}function ya(t,e,r,i){void 0===r&&(r="_first"),void 0===i&&(i="_last");var n=e._prev,a=e._next;n?n._next=a:t[r]===e&&(t[r]=a),a?a._prev=n:t[i]===e&&(t[i]=n),e._next=e._prev=e.parent=null}function za(t,e){!t.parent||e&&!t.parent.autoRemoveChildren||t.parent.remove(t),t._act=0}function Aa(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var r=t;r;)r._dirty=1,r=r.parent;return t}function Ca(t,e,r,i){return t._startAt&&(B?t._startAt.revert(ht):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))}function Ea(t){return t._repeat?Tt(t._tTime,t=t.duration()+t._rDelay)*t:0}function Ga(t,e){return(t-e._start)*e._ts+(0<=e._ts?0:e._dirty?e.totalDuration():e._tDur)}function Ha(t){return t._end=ja(t._start+(t._tDur/Math.abs(t._ts||t._rts||V)||0))}function Ia(t,e){var r=t._dp;return r&&r.smoothChildTiming&&t._ts&&(t._start=ja(r._time-(0<t._ts?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Ha(t),r._dirty||Aa(r,t)),t}function Ja(t,e){var r;if((e._time||e._initted&&!e._dur)&&(r=Ga(t.rawTime(),e),(!e._dur||kt(0,e.totalDuration(),r)-e._tTime>V)&&e.render(r,!0)),Aa(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(r=t;r._dp;)0<=r.rawTime()&&r.totalTime(r._tTime),r=r._dp;t._zTime=-V}}function Ka(e,r,i,n){return r.parent&&za(r),r._start=ja((t(i)?i:i||e!==L?xt(e,i,r):e._time)+r._delay),r._end=ja(r._start+(r.totalDuration()/Math.abs(r.timeScale())||0)),xa(e,r,"_first","_last",e._sort?"_start":0),bt(r)||(e._recent=r),n||Ja(e,r),e._ts<0&&Ia(e,e._tTime),e}function La(t,e){return(ot.ScrollTrigger||Q("scrollTrigger",e))&&ot.ScrollTrigger.create(e,t)}function Ma(t,e,r,i,n){return Ht(t,e,n),t._initted?!r&&t._pt&&!B&&(t._dur&&!1!==t.vars.lazy||!t._dur&&t.vars.lazy)&&f!==Et.frame?(ct.push(t),t._lazy=[n,i],1):void 0:1}function Ra(t,e,r,i){var n=t._repeat,a=ja(e)||0,s=t._tTime/t._tDur;return s&&!i&&(t._time*=a/t._dur),t._dur=a,t._tDur=n?n<0?1e10:ja(a*(n+1)+t._rDelay*n):a,0<s&&!i&&Ia(t,t._tTime=t._tDur*s),t.parent&&Ha(t),r||Aa(t.parent,t),t}function Sa(t){return t instanceof Ut?Aa(t):Ra(t,t._dur)}function Va(e,r,i){var n,a,s=t(r[1]),o=(s?2:1)+(e<2?0:1),u=r[o];if(s&&(u.duration=r[1]),u.parent=i,e){for(n=u,a=i;a&&!("immediateRender"in n);)n=a.vars.defaults||{},a=w(a.vars.inherit)&&a.parent;u.immediateRender=w(n.immediateRender),e<2?u.runBackwards=1:u.startAt=r[o-1]}return new Gt(r[0],u,r[1+o])}function Wa(t,e){return t||0===t?e(t):e}function Ya(t,e){return r(t)&&(e=st.exec(t))?e[1]:""}function _a(t,e){return t&&v(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&v(t[0]))&&!t.nodeType&&t!==h}function cb(r){return r=Ot(r)[0]||R("Invalid scope")||{},function(t){var e=r.current||r.nativeElement||r;return Ot(t,e.querySelectorAll?e:e===r?R("Invalid scope")||a.createElement("div"):r)}}function db(t){return t.sort(function(){return.5-Math.random()})}function eb(t){if(s(t))return t;var p=v(t)?t:{each:t},_=Yt(p.ease),m=p.from||0,g=parseFloat(p.base)||0,y={},e=0<m&&m<1,T=isNaN(m)||e,b=p.axis,w=m,x=m;return r(m)?w=x={center:.5,edges:.5,end:1}[m]||0:!e&&T&&(w=m[0],x=m[1]),function(t,e,r){var i,n,a,s,o,u,h,l,f,c=(r||p).length,d=y[c];if(!d){if(!(f="auto"===p.grid?0:(p.grid||[1,U])[1])){for(h=-U;h<(h=r[f++].getBoundingClientRect().left)&&f<c;);f--}for(d=y[c]=[],i=T?Math.min(f,c)*w-.5:m%f,n=f===U?0:T?c*x/f-.5:m/f|0,l=U,u=h=0;u<c;u++)a=u%f-i,s=n-(u/f|0),d[u]=o=b?Math.abs("y"===b?s:a):K(a*a+s*s),h<o&&(h=o),o<l&&(l=o);"random"===m&&db(d),d.max=h-l,d.min=l,d.v=c=(parseFloat(p.amount)||parseFloat(p.each)*(c<f?c-1:b?"y"===b?c/f:f:Math.max(f,c/f))||0)*("edges"===m?-1:1),d.b=c<0?g-c:g,d.u=Ya(p.amount||p.each)||0,_=_&&c<0?Lt(_):_}return c=(d[t]-d.min)/d.max||0,ja(d.b+(_?_(c):c)*d.v)+d.u}}function fb(i){var n=Math.pow(10,((i+"").split(".")[1]||"").length);return function(e){var r=ja(Math.round(parseFloat(e)/i)*i*n);return(r-r%1)/n+(t(e)?0:Ya(e))}}function gb(h,e){var l,f,r=$(h);return!r&&v(h)&&(l=r=h.radius||U,h.values?(h=Ot(h.values),(f=!t(h[0]))&&(l*=l)):h=fb(h.increment)),Wa(e,r?s(h)?function(t){return f=h(t),Math.abs(f-t)<=l?f:t}:function(e){for(var r,i,n=parseFloat(f?e.x:e),a=parseFloat(f?e.y:0),s=U,o=0,u=h.length;u--;)(r=f?(r=h[u].x-n)*r+(i=h[u].y-a)*i:Math.abs(h[u]-n))<s&&(s=r,o=u);return o=!l||s<=l?h[o]:e,f||o===e||t(e)?o:o+Ya(e)}:fb(h))}function hb(t,e,r,i){return Wa($(t)?!e:!0===r?!!(r=0):!i,function(){return $(t)?t[~~(Math.random()*t.length)]:(r=r||1e-5)&&(i=r<1?Math.pow(10,(r+"").length-2):1)&&Math.floor(Math.round((t-r/2+Math.random()*(e-t+.99*r))/r)*r*i)/i})}function lb(e,r,t){return Wa(t,function(t){return e[~~r(t)]})}function ob(t){for(var e,r,i,n,a=0,s="";~(e=t.indexOf("random(",a));)i=t.indexOf(")",e),n="["===t.charAt(e+7),r=t.substr(e+7,i-e-7).match(n?at:tt),s+=t.substr(a,e-a)+hb(n?r:+r[0],n?0:+r[1],+r[2]||1e-5),a=i+1;return s+t.substr(a,t.length-a)}function rb(t,e,r){var i,n,a,s=t.labels,o=U;for(i in s)(n=s[i]-e)<0==!!r&&n&&o>(n=Math.abs(n))&&(a=i,o=n);return a}function tb(t){return za(t),t.scrollTrigger&&t.scrollTrigger.kill(!!B),t.progress()<1&&Ct(t,"onInterrupt"),t}function yb(t,e,r){return(6*(t+=t<0?1:1<t?-1:0)<1?e+(r-e)*t*6:t<.5?r:3*t<2?e+(r-e)*(2/3-t)*6:e)*At+.5|0}function zb(e,r,i){var n,a,s,o,u,h,l,f,c,d,p=e?t(e)?[e>>16,e>>8&At,e&At]:0:St.black;if(!p){if(","===e.substr(-1)&&(e=e.substr(0,e.length-1)),St[e])p=St[e];else if("#"===e.charAt(0)){if(e.length<6&&(e="#"+(n=e.charAt(1))+n+(a=e.charAt(2))+a+(s=e.charAt(3))+s+(5===e.length?e.charAt(4)+e.charAt(4):"")),9===e.length)return[(p=parseInt(e.substr(1,6),16))>>16,p>>8&At,p&At,parseInt(e.substr(7),16)/255];p=[(e=parseInt(e.substr(1),16))>>16,e>>8&At,e&At]}else if("hsl"===e.substr(0,3))if(p=d=e.match(tt),r){if(~e.indexOf("="))return p=e.match(et),i&&p.length<4&&(p[3]=1),p}else o=+p[0]%360/360,u=p[1]/100,n=2*(h=p[2]/100)-(a=h<=.5?h*(u+1):h+u-h*u),3<p.length&&(p[3]*=1),p[0]=yb(o+1/3,n,a),p[1]=yb(o,n,a),p[2]=yb(o-1/3,n,a);else p=e.match(tt)||St.transparent;p=p.map(Number)}return r&&!d&&(n=p[0]/At,a=p[1]/At,s=p[2]/At,h=((l=Math.max(n,a,s))+(f=Math.min(n,a,s)))/2,l===f?o=u=0:(c=l-f,u=.5<h?c/(2-l-f):c/(l+f),o=l===n?(a-s)/c+(a<s?6:0):l===a?(s-n)/c+2:(n-a)/c+4,o*=60),p[0]=~~(o+.5),p[1]=~~(100*u+.5),p[2]=~~(100*h+.5)),i&&p.length<4&&(p[3]=1),p}function Ab(t){var r=[],i=[],n=-1;return t.split(Rt).forEach(function(t){var e=t.match(rt)||[];r.push.apply(r,e),i.push(n+=e.length+1)}),r.c=i,r}function Bb(t,e,r){var i,n,a,s,o="",u=(t+o).match(Rt),h=e?"hsla(":"rgba(",l=0;if(!u)return t;if(u=u.map(function(t){return(t=zb(t,e,1))&&h+(e?t[0]+","+t[1]+"%,"+t[2]+"%,"+t[3]:t.join(","))+")"}),r&&(a=Ab(t),(i=r.c).join(o)!==a.c.join(o)))for(s=(n=t.replace(Rt,"1").split(rt)).length-1;l<s;l++)o+=n[l]+(~i.indexOf(l)?u.shift()||h+"0,0,0,0)":(a.length?a:u.length?u:r).shift());if(!n)for(s=(n=t.split(Rt)).length-1;l<s;l++)o+=n[l]+u[l];return o+n[s]}function Eb(t){var e,r=t.join(" ");if(Rt.lastIndex=0,Rt.test(r))return e=Dt.test(r),t[1]=Bb(t[1],e),t[0]=Bb(t[0],e,Ab(t[1])),!0}function Nb(t){var e=(t+"").split("("),r=Ft[e[0]];return r&&1<e.length&&r.config?r.config.apply(null,~t.indexOf("{")?[function _parseObjectInString(t){for(var e,r,i,n={},a=t.substr(1,t.length-3).split(":"),s=a[0],o=1,u=a.length;o<u;o++)r=a[o],e=o!==u-1?r.lastIndexOf(","):r.length,i=r.substr(0,e),n[s]=isNaN(i)?i.replace(Bt,"").trim():+i,s=r.substr(e+1).trim();return n}(e[1])]:function _valueInParentheses(t){var e=t.indexOf("(")+1,r=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<r?t.indexOf(")",r+1):r)}(t).split(",").map(oa)):Ft._CE&&It.test(t)?Ft._CE("",t):r}function Pb(t,e){for(var r,i=t._first;i;)i instanceof Ut?Pb(i,e):!i.vars.yoyoEase||i._yoyo&&i._repeat||i._yoyo===e||(i.timeline?Pb(i.timeline,e):(r=i._ease,i._ease=i._yEase,i._yEase=r,i._yoyo=e)),i=i._next}function Rb(t,e,r,i){void 0===r&&(r=function easeOut(t){return 1-e(1-t)}),void 0===i&&(i=function easeInOut(t){return t<.5?e(2*t)/2:1-e(2*(1-t))/2});var n,a={easeIn:e,easeOut:r,easeInOut:i};return ha(t,function(t){for(var e in Ft[t]=ot[t]=a,Ft[n=t.toLowerCase()]=r,a)Ft[n+("easeIn"===e?".in":"easeOut"===e?".out":".inOut")]=Ft[t+"."+e]=a[e]}),a}function Sb(e){return function(t){return t<.5?(1-e(1-2*t))/2:.5+e(2*(t-.5))/2}}function Tb(r,t,e){function Hm(t){return 1===t?1:i*Math.pow(2,-10*t)*G((t-a)*n)+1}var i=1<=t?t:1,n=(e||(r?.3:.45))/(t<1?t:1),a=n/W*(Math.asin(1/i)||0),s="out"===r?Hm:"in"===r?function(t){return 1-Hm(1-t)}:Sb(Hm);return n=W/n,s.config=function(t,e){return Tb(r,t,e)},s}function Ub(e,r){function Pm(t){return t?--t*t*((r+1)*t+r)+1:0}void 0===r&&(r=1.70158);var t="out"===e?Pm:"in"===e?function(t){return 1-Pm(1-t)}:Sb(Pm);return t.config=function(t){return Ub(e,t)},t}var I,B,l,L,h,n,a,i,o,f,c,d,p,_,m,g,b,k,M,O,C,A,D,E,z,F,Y,N,j={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},q={duration:.5,overwrite:!1,delay:0},U=1e8,V=1/U,W=2*Math.PI,X=W/4,H=0,K=Math.sqrt,Z=Math.cos,G=Math.sin,J="function"==typeof ArrayBuffer&&ArrayBuffer.isView||function(){},$=Array.isArray,tt=/(?:-?\.?\d|\.)+/gi,et=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,rt=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,it=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,nt=/[+-]=-?[.\d]+/,at=/[^,'"\[\]\s]+/gi,st=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,ot={},ut={suppressEvents:!0,isStart:!0,kill:!1},ht={suppressEvents:!0,kill:!1},lt={suppressEvents:!0},ft={},ct=[],dt={},pt={},_t={},mt=30,gt=[],vt="",yt=function _merge(t,e){for(var r in e)t[r]=e[r];return t},Tt=function _animationCycle(t,e){var r=Math.floor(t/=e);return t&&r===t?r-1:r},bt=function _isFromOrFromStart(t){var e=t.data;return"isFromStart"===e||"isStart"===e},wt={_start:0,endTime:T,totalDuration:T},xt=function _parsePosition(t,e,i){var n,a,s,o=t.labels,u=t._recent||wt,h=t.duration()>=U?u.endTime(!1):t._dur;return r(e)&&(isNaN(e)||e in o)?(a=e.charAt(0),s="%"===e.substr(-1),n=e.indexOf("="),"<"===a||">"===a?(0<=n&&(e=e.replace(/=/,"")),("<"===a?u._start:u.endTime(0<=u._repeat))+(parseFloat(e.substr(1))||0)*(s?(n<0?u:i).totalDuration()/100:1)):n<0?(e in o||(o[e]=h),o[e]):(a=parseFloat(e.charAt(n-1)+e.substr(n+1)),s&&i&&(a=a/100*($(i)?i[0]:i).totalDuration()),1<n?_parsePosition(t,e.substr(0,n-1),i)+a:h+a)):null==e?h:+e},kt=function _clamp(t,e,r){return r<t?t:e<r?e:r},Mt=[].slice,Ot=function toArray(t,e,i){return l&&!e&&l.selector?l.selector(t):!r(t)||i||!n&&zt()?$(t)?function _flatten(t,e,i){return void 0===i&&(i=[]),t.forEach(function(t){return r(t)&&!e||_a(t,1)?i.push.apply(i,Ot(t)):i.push(t)})||i}(t,i):_a(t)?Mt.call(t,0):t?[t]:[]:Mt.call((e||a).querySelectorAll(t),0)},Pt=function mapRange(e,t,r,i,n){var a=t-e,s=i-r;return Wa(n,function(t){return r+((t-e)/a*s||0)})},Ct=function _callback(t,e,r){var i,n,a,s=t.vars,o=s[e],u=l,h=t._ctx;if(o)return i=s[e+"Params"],n=s.callbackScope||t,r&&ct.length&&ma(),h&&(l=h),a=i?o.apply(n,i):o.call(n),l=u,a},At=255,St={aqua:[0,At,At],lime:[0,At,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,At],navy:[0,0,128],white:[At,At,At],olive:[128,128,0],yellow:[At,At,0],orange:[At,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[At,0,0],pink:[At,192,203],cyan:[0,At,At],transparent:[At,At,At,0]},Rt=function(){var t,e="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b";for(t in St)e+="|"+t+"\\b";return new RegExp(e+")","gi")}(),Dt=/hsl[a]?\(/,Et=(M=Date.now,O=500,C=33,A=M(),D=A,z=E=1e3/240,g={time:0,frame:0,tick:function tick(){wl(!0)},deltaRatio:function deltaRatio(t){return b/(1e3/(t||60))},wake:function wake(){o&&(!n&&x()&&(h=n=window,a=h.document||{},ot.gsap=Ce,(h.gsapVersions||(h.gsapVersions=[])).push(Ce.version),P(i||h.GreenSockGlobals||!h.gsap&&h||{}),m=h.requestAnimationFrame),p&&g.sleep(),_=m||function(t){return setTimeout(t,z-1e3*g.time+1|0)},d=1,wl(2))},sleep:function sleep(){(m?h.cancelAnimationFrame:clearTimeout)(p),d=0,_=T},lagSmoothing:function lagSmoothing(t,e){O=t||1e8,C=Math.min(e,O,0)},fps:function fps(t){E=1e3/(t||240),z=1e3*g.time+E},add:function add(n,t,e){var a=t?function(t,e,r,i){n(t,e,r,i),g.remove(a)}:n;return g.remove(n),F[e?"unshift":"push"](a),zt(),a},remove:function remove(t,e){~(e=F.indexOf(t))&&F.splice(e,1)&&e<=k&&k--},_listeners:F=[]}),zt=function _wake(){return!d&&Et.wake()},Ft={},It=/^[\d.\-M][\d.\-,\s]/,Bt=/["']/g,Lt=function _invertEase(e){return function(t){return 1-e(1-t)}},Yt=function _parseEase(t,e){return t&&(s(t)?t:Ft[t]||Nb(t))||e};function wl(t){var e,r,i,n,a=M()-D,s=!0===t;if(O<a&&(A+=a-C),(0<(e=(i=(D+=a)-A)-z)||s)&&(n=++g.frame,b=i-1e3*g.time,g.time=i/=1e3,z+=e+(E<=e?4:E-e),r=1),s||(p=_(wl)),r)for(k=0;k<F.length;k++)F[k](i,b,n,t)}function en(t){return t<N?Y*t*t:t<.7272727272727273?Y*Math.pow(t-1.5/2.75,2)+.75:t<.9090909090909092?Y*(t-=2.25/2.75)*t+.9375:Y*Math.pow(t-2.625/2.75,2)+.984375}ha("Linear,Quad,Cubic,Quart,Quint,Strong",function(t,e){var r=e<5?e+1:e;Rb(t+",Power"+(r-1),e?function(t){return Math.pow(t,r)}:function(t){return t},function(t){return 1-Math.pow(1-t,r)},function(t){return t<.5?Math.pow(2*t,r)/2:1-Math.pow(2*(1-t),r)/2})}),Ft.Linear.easeNone=Ft.none=Ft.Linear.easeIn,Rb("Elastic",Tb("in"),Tb("out"),Tb()),Y=7.5625,N=1/2.75,Rb("Bounce",function(t){return 1-en(1-t)},en),Rb("Expo",function(t){return t?Math.pow(2,10*(t-1)):0}),Rb("Circ",function(t){return-(K(1-t*t)-1)}),Rb("Sine",function(t){return 1===t?1:1-Z(t*X)}),Rb("Back",Ub("in"),Ub("out"),Ub()),Ft.SteppedEase=Ft.steps=ot.SteppedEase={config:function config(t,e){void 0===t&&(t=1);var r=1/t,i=t+(e?0:1),n=e?1:0;return function(t){return((i*kt(0,.99999999,t)|0)+n)*r}}},q.ease=Ft["quad.out"],ha("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(t){return vt+=t+","+t+"Params,"});var Nt,jt=function GSCache(t,e){this.id=H++,(t._gsap=this).target=t,this.harness=e,this.get=e?e.get:ga,this.set=e?e.getSetter:re},qt=((Nt=Animation.prototype).delay=function delay(t){return t||0===t?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+t-this._delay),this._delay=t,this):this._delay},Nt.duration=function duration(t){return arguments.length?this.totalDuration(0<this._repeat?t+(t+this._rDelay)*this._repeat:t):this.totalDuration()&&this._dur},Nt.totalDuration=function totalDuration(t){return arguments.length?(this._dirty=0,Ra(this,this._repeat<0?t:(t-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},Nt.totalTime=function totalTime(t,e){if(zt(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(Ia(this,t),!r._dp||r.parent||Ja(r,this);r&&r.parent;)r.parent._time!==r._start+(0<=r._ts?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(0<this._ts&&t<this._tDur||this._ts<0&&0<t||!this._tDur&&!t)&&Ka(this._dp,this,this._start-this._delay)}return(this._tTime!==t||!this._dur&&!e||this._initted&&Math.abs(this._zTime)===V||!t&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=t),na(this,t,e)),this},Nt.time=function time(t,e){return arguments.length?this.totalTime(Math.min(this.totalDuration(),t+Ea(this))%(this._dur+this._rDelay)||(t?this._dur:0),e):this._time},Nt.totalProgress=function totalProgress(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.ratio},Nt.progress=function progress(t,e){return arguments.length?this.totalTime(this.duration()*(!this._yoyo||1&this.iteration()?t:1-t)+Ea(this),e):this.duration()?Math.min(1,this._time/this._dur):this.ratio},Nt.iteration=function iteration(t,e){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(t-1)*r,e):this._repeat?Tt(this._tTime,r)+1:1},Nt.timeScale=function timeScale(t){if(!arguments.length)return this._rts===-V?0:this._rts;if(this._rts===t)return this;var e=this.parent&&this._ts?Ga(this.parent._time,this):this._tTime;return this._rts=+t||0,this._ts=this._ps||t===-V?0:this._rts,this.totalTime(kt(-this._delay,this._tDur,e),!0),Ha(this),function _recacheAncestors(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t}(this)},Nt.paused=function paused(t){return arguments.length?(this._ps!==t&&((this._ps=t)?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(zt(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,1===this.progress()&&Math.abs(this._zTime)!==V&&(this._tTime-=V)))),this):this._ps},Nt.startTime=function startTime(t){if(arguments.length){this._start=t;var e=this.parent||this._dp;return!e||!e._sort&&this.parent||Ka(e,this,t-this._delay),this}return this._start},Nt.endTime=function endTime(t){return this._start+(w(t)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},Nt.rawTime=function rawTime(t){var e=this.parent||this._dp;return e?t&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Ga(e.rawTime(t),this):this._tTime:this._tTime},Nt.revert=function revert(t){void 0===t&&(t=lt);var e=B;return B=t,(this._initted||this._startAt)&&(this.timeline&&this.timeline.revert(t),this.totalTime(-.01,t.suppressEvents)),"nested"!==this.data&&!1!==t.kill&&this.kill(),B=e,this},Nt.globalTime=function globalTime(t){for(var e=this,r=arguments.length?t:e.rawTime();e;)r=e._start+r/(e._ts||1),e=e._dp;return!this.parent&&this.vars.immediateRender?-1:r},Nt.repeat=function repeat(t){return arguments.length?(this._repeat=t===1/0?-2:t,Sa(this)):-2===this._repeat?1/0:this._repeat},Nt.repeatDelay=function repeatDelay(t){if(arguments.length){var e=this._time;return this._rDelay=t,Sa(this),e?this.time(e):this}return this._rDelay},Nt.yoyo=function yoyo(t){return arguments.length?(this._yoyo=t,this):this._yoyo},Nt.seek=function seek(t,e){return this.totalTime(xt(this,t),w(e))},Nt.restart=function restart(t,e){return this.play().totalTime(t?-this._delay:0,w(e))},Nt.play=function play(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},Nt.reverse=function reverse(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},Nt.pause=function pause(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},Nt.resume=function resume(){return this.paused(!1)},Nt.reversed=function reversed(t){return arguments.length?(!!t!==this.reversed()&&this.timeScale(-this._rts||(t?-V:0)),this):this._rts<0},Nt.invalidate=function invalidate(){return this._initted=this._act=0,this._zTime=-V,this},Nt.isActive=function isActive(){var t,e=this.parent||this._dp,r=this._start;return!(e&&!(this._ts&&this._initted&&e.isActive()&&(t=e.rawTime(!0))>=r&&t<this.endTime(!0)-V))},Nt.eventCallback=function eventCallback(t,e,r){var i=this.vars;return 1<arguments.length?(e?(i[t]=e,r&&(i[t+"Params"]=r),"onUpdate"===t&&(this._onUpdate=e)):delete i[t],this):i[t]},Nt.then=function then(t){var i=this;return new Promise(function(e){function zo(){var t=i.then;i.then=null,s(r)&&(r=r(i))&&(r.then||r===i)&&(i.then=t),e(r),i.then=t}var r=s(t)?t:pa;i._initted&&1===i.totalProgress()&&0<=i._ts||!i._tTime&&i._ts<0?zo():i._prom=zo})},Nt.kill=function kill(){tb(this)},Animation);function Animation(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,Ra(this,+t.duration,1,1),this.data=t.data,l&&(this._ctx=l).data.push(this),d||Et.wake()}qa(qt.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-V,_prom:0,_ps:!1,_rts:1});var Ut=function(i){function Timeline(t,e){var r;return void 0===t&&(t={}),(r=i.call(this,t)||this).labels={},r.smoothChildTiming=!!t.smoothChildTiming,r.autoRemoveChildren=!!t.autoRemoveChildren,r._sort=w(t.sortChildren),L&&Ka(t.parent||L,_assertThisInitialized(r),e),t.reversed&&r.reverse(),t.paused&&r.paused(!0),t.scrollTrigger&&La(_assertThisInitialized(r),t.scrollTrigger),r}_inheritsLoose(Timeline,i);var e=Timeline.prototype;return e.to=function to(t,e,r){return Va(0,arguments,this),this},e.from=function from(t,e,r){return Va(1,arguments,this),this},e.fromTo=function fromTo(t,e,r,i){return Va(2,arguments,this),this},e.set=function set(t,e,r){return e.duration=0,e.parent=this,va(e).repeatDelay||(e.repeat=0),e.immediateRender=!!e.immediateRender,new Gt(t,e,xt(this,r),1),this},e.call=function call(t,e,r){return Ka(this,Gt.delayedCall(0,t,e),r)},e.staggerTo=function staggerTo(t,e,r,i,n,a,s){return r.duration=e,r.stagger=r.stagger||i,r.onComplete=a,r.onCompleteParams=s,r.parent=this,new Gt(t,r,xt(this,n)),this},e.staggerFrom=function staggerFrom(t,e,r,i,n,a,s){return r.runBackwards=1,va(r).immediateRender=w(r.immediateRender),this.staggerTo(t,e,r,i,n,a,s)},e.staggerFromTo=function staggerFromTo(t,e,r,i,n,a,s,o){return i.startAt=r,va(i).immediateRender=w(i.immediateRender),this.staggerTo(t,e,i,n,a,s,o)},e.render=function render(t,e,r){var i,n,a,s,o,u,h,l,f,c,d,p,_=this._time,m=this._dirty?this.totalDuration():this._tDur,g=this._dur,v=t<=0?0:ja(t),y=this._zTime<0!=t<0&&(this._initted||!g);if(this!==L&&m<v&&0<=t&&(v=m),v!==this._tTime||r||y){if(_!==this._time&&g&&(v+=this._time-_,t+=this._time-_),i=v,f=this._start,u=!(l=this._ts),y&&(g||(_=this._zTime),!t&&e||(this._zTime=t)),this._repeat){if(d=this._yoyo,o=g+this._rDelay,this._repeat<-1&&t<0)return this.totalTime(100*o+t,e,r);if(i=ja(v%o),v===m?(s=this._repeat,i=g):((s=~~(v/o))&&s===v/o&&(i=g,s--),g<i&&(i=g)),c=Tt(this._tTime,o),!_&&this._tTime&&c!==s&&(c=s),d&&1&s&&(i=g-i,p=1),s!==c&&!this._lock){var T=d&&1&c,b=T===(d&&1&s);if(s<c&&(T=!T),_=T?0:g,this._lock=1,this.render(_||(p?0:ja(s*o)),e,!g)._lock=0,this._tTime=v,!e&&this.parent&&Ct(this,"onRepeat"),this.vars.repeatRefresh&&!p&&(this.invalidate()._lock=1),_&&_!==this._time||u!=!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(g=this._dur,m=this._tDur,b&&(this._lock=2,_=T?g:-1e-4,this.render(_,!0),this.vars.repeatRefresh&&!p&&this.invalidate()),this._lock=0,!this._ts&&!u)return this;Pb(this,p)}}if(this._hasPause&&!this._forcing&&this._lock<2&&(h=function _findNextPauseTween(t,e,r){var i;if(e<r)for(i=t._first;i&&i._start<=r;){if("isPause"===i.data&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=r;){if("isPause"===i.data&&i._start<e)return i;i=i._prev}}(this,ja(_),ja(i)))&&(v-=i-(i=h._start)),this._tTime=v,this._time=i,this._act=!l,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=t,_=0),!_&&i&&!e&&(Ct(this,"onStart"),this._tTime!==v))return this;if(_<=i&&0<=t)for(n=this._first;n;){if(a=n._next,(n._act||i>=n._start)&&n._ts&&h!==n){if(n.parent!==this)return this.render(t,e,r);if(n.render(0<n._ts?(i-n._start)*n._ts:(n._dirty?n.totalDuration():n._tDur)+(i-n._start)*n._ts,e,r),i!==this._time||!this._ts&&!u){h=0,a&&(v+=this._zTime=-V);break}}n=a}else{n=this._last;for(var w=t<0?t:i;n;){if(a=n._prev,(n._act||w<=n._end)&&n._ts&&h!==n){if(n.parent!==this)return this.render(t,e,r);if(n.render(0<n._ts?(w-n._start)*n._ts:(n._dirty?n.totalDuration():n._tDur)+(w-n._start)*n._ts,e,r||B&&(n._initted||n._startAt)),i!==this._time||!this._ts&&!u){h=0,a&&(v+=this._zTime=w?-V:V);break}}n=a}}if(h&&!e&&(this.pause(),h.render(_<=i?0:-V)._zTime=_<=i?1:-1,this._ts))return this._start=f,Ha(this),this.render(t,e,r);this._onUpdate&&!e&&Ct(this,"onUpdate",!0),(v===m&&this._tTime>=this.totalDuration()||!v&&_)&&(f!==this._start&&Math.abs(l)===Math.abs(this._ts)||this._lock||(!t&&g||!(v===m&&0<this._ts||!v&&this._ts<0)||za(this,1),e||t<0&&!_||!v&&!_&&m||(Ct(this,v===m&&0<=t?"onComplete":"onReverseComplete",!0),!this._prom||v<m&&0<this.timeScale()||this._prom())))}return this},e.add=function add(e,i){var n=this;if(t(i)||(i=xt(this,i,e)),!(e instanceof qt)){if($(e))return e.forEach(function(t){return n.add(t,i)}),this;if(r(e))return this.addLabel(e,i);if(!s(e))return this;e=Gt.delayedCall(0,e)}return this!==e?Ka(this,e,i):this},e.getChildren=function getChildren(t,e,r,i){void 0===t&&(t=!0),void 0===e&&(e=!0),void 0===r&&(r=!0),void 0===i&&(i=-U);for(var n=[],a=this._first;a;)a._start>=i&&(a instanceof Gt?e&&n.push(a):(r&&n.push(a),t&&n.push.apply(n,a.getChildren(!0,e,r)))),a=a._next;return n},e.getById=function getById(t){for(var e=this.getChildren(1,1,1),r=e.length;r--;)if(e[r].vars.id===t)return e[r]},e.remove=function remove(t){return r(t)?this.removeLabel(t):s(t)?this.killTweensOf(t):(ya(this,t),t===this._recent&&(this._recent=this._last),Aa(this))},e.totalTime=function totalTime(t,e){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=ja(Et.time-(0<this._ts?t/this._ts:(this.totalDuration()-t)/-this._ts))),i.prototype.totalTime.call(this,t,e),this._forcing=0,this):this._tTime},e.addLabel=function addLabel(t,e){return this.labels[t]=xt(this,e),this},e.removeLabel=function removeLabel(t){return delete this.labels[t],this},e.addPause=function addPause(t,e,r){var i=Gt.delayedCall(0,e||T,r);return i.data="isPause",this._hasPause=1,Ka(this,i,xt(this,t))},e.removePause=function removePause(t){var e=this._first;for(t=xt(this,t);e;)e._start===t&&"isPause"===e.data&&za(e),e=e._next},e.killTweensOf=function killTweensOf(t,e,r){for(var i=this.getTweensOf(t,r),n=i.length;n--;)Vt!==i[n]&&i[n].kill(t,e);return this},e.getTweensOf=function getTweensOf(e,r){for(var i,n=[],a=Ot(e),s=this._first,o=t(r);s;)s instanceof Gt?la(s._targets,a)&&(o?(!Vt||s._initted&&s._ts)&&s.globalTime(0)<=r&&s.globalTime(s.totalDuration())>r:!r||s.isActive())&&n.push(s):(i=s.getTweensOf(a,r)).length&&n.push.apply(n,i),s=s._next;return n},e.tweenTo=function tweenTo(t,e){e=e||{};var r,i=this,n=xt(i,t),a=e.startAt,s=e.onStart,o=e.onStartParams,u=e.immediateRender,h=Gt.to(i,qa({ease:e.ease||"none",lazy:!1,immediateRender:!1,time:n,overwrite:"auto",duration:e.duration||Math.abs((n-(a&&"time"in a?a.time:i._time))/i.timeScale())||V,onStart:function onStart(){if(i.pause(),!r){var t=e.duration||Math.abs((n-(a&&"time"in a?a.time:i._time))/i.timeScale());h._dur!==t&&Ra(h,t,0,1).render(h._time,!0,!0),r=1}s&&s.apply(h,o||[])}},e));return u?h.render(0):h},e.tweenFromTo=function tweenFromTo(t,e,r){return this.tweenTo(e,qa({startAt:{time:xt(this,t)}},r))},e.recent=function recent(){return this._recent},e.nextLabel=function nextLabel(t){return void 0===t&&(t=this._time),rb(this,xt(this,t))},e.previousLabel=function previousLabel(t){return void 0===t&&(t=this._time),rb(this,xt(this,t),1)},e.currentLabel=function currentLabel(t){return arguments.length?this.seek(t,!0):this.previousLabel(this._time+V)},e.shiftChildren=function shiftChildren(t,e,r){void 0===r&&(r=0);for(var i,n=this._first,a=this.labels;n;)n._start>=r&&(n._start+=t,n._end+=t),n=n._next;if(e)for(i in a)a[i]>=r&&(a[i]+=t);return Aa(this)},e.invalidate=function invalidate(t){var e=this._first;for(this._lock=0;e;)e.invalidate(t),e=e._next;return i.prototype.invalidate.call(this,t)},e.clear=function clear(t){void 0===t&&(t=!0);for(var e,r=this._first;r;)e=r._next,this.remove(r),r=e;return this._dp&&(this._time=this._tTime=this._pTime=0),t&&(this.labels={}),Aa(this)},e.totalDuration=function totalDuration(t){var e,r,i,n=0,a=this,s=a._last,o=U;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-t:t));if(a._dirty){for(i=a.parent;s;)e=s._prev,s._dirty&&s.totalDuration(),o<(r=s._start)&&a._sort&&s._ts&&!a._lock?(a._lock=1,Ka(a,s,r-s._delay,1)._lock=0):o=r,r<0&&s._ts&&(n-=r,(!i&&!a._dp||i&&i.smoothChildTiming)&&(a._start+=r/a._ts,a._time-=r,a._tTime-=r),a.shiftChildren(-r,!1,-Infinity),o=0),s._end>n&&s._ts&&(n=s._end),s=e;Ra(a,a===L&&a._time>n?a._time:n,1,1),a._dirty=0}return a._tDur},Timeline.updateRoot=function updateRoot(t){if(L._ts&&(na(L,Ga(t,L)),f=Et.frame),Et.frame>=mt){mt+=j.autoSleep||120;var e=L._first;if((!e||!e._ts)&&j.autoSleep&&Et._listeners.length<2){for(;e&&!e._ts;)e=e._next;e||Et.sleep()}}},Timeline}(qt);qa(Ut.prototype,{_lock:0,_hasPause:0,_forcing:0});function _b(t,e,i,n,a,o){var u,h,l,f;if(pt[t]&&!1!==(u=new pt[t]).init(a,u.rawVars?e[t]:function _processVars(t,e,i,n,a){if(s(t)&&(t=Qt(t,a,e,i,n)),!v(t)||t.style&&t.nodeType||$(t)||J(t))return r(t)?Qt(t,a,e,i,n):t;var o,u={};for(o in t)u[o]=Qt(t[o],a,e,i,n);return u}(e[t],n,a,o,i),i,n,o)&&(i._pt=h=new pe(i._pt,a,t,0,1,u.render,u,0,u.priority),i!==c))for(l=i._ptLookup[i._targets.indexOf(a)],f=u._props.length;f--;)l[u._props[f]]=h;return u}function fc(t,r,e,i){var n,a,s=r.ease||i||"power1.inOut";if($(r))a=e[t]||(e[t]=[]),r.forEach(function(t,e){return a.push({t:e/(r.length-1)*100,v:t,e:s})});else for(n in r)a=e[n]||(e[n]=[]),"ease"===n||a.push({t:parseFloat(t),v:r[n],e:s})}var Vt,Wt,Xt=function _addPropTween(t,e,i,n,a,o,u,h,l,f){s(n)&&(n=n(a||0,t,o));var c,d=t[e],p="get"!==i?i:s(d)?l?t[e.indexOf("set")||!s(t["get"+e.substr(3)])?e:"get"+e.substr(3)](l):t[e]():d,_=s(d)?l?ee:$t:Jt;if(r(n)&&(~n.indexOf("random(")&&(n=ob(n)),"="===n.charAt(1)&&(!(c=ka(p,n)+(Ya(p)||0))&&0!==c||(n=c))),!f||p!==n||Wt)return isNaN(p*n)||""===n?(d||e in t||Q(e,n),function _addComplexStringPropTween(t,e,r,i,n,a,s){var o,u,h,l,f,c,d,p,_=new pe(this._pt,t,e,0,1,se,null,n),m=0,g=0;for(_.b=r,_.e=i,r+="",(d=~(i+="").indexOf("random("))&&(i=ob(i)),a&&(a(p=[r,i],t,e),r=p[0],i=p[1]),u=r.match(it)||[];o=it.exec(i);)l=o[0],f=i.substring(m,o.index),h?h=(h+1)%5:"rgba("===f.substr(-5)&&(h=1),l!==u[g++]&&(c=parseFloat(u[g-1])||0,_._pt={_next:_._pt,p:f||1===g?f:",",s:c,c:"="===l.charAt(1)?ka(c,l)-c:parseFloat(l)-c,m:h&&h<4?Math.round:0},m=it.lastIndex);return _.c=m<i.length?i.substring(m,i.length):"",_.fp=s,(nt.test(i)||d)&&(_.e=0),this._pt=_}.call(this,t,e,p,n,_,h||j.stringFilter,l)):(c=new pe(this._pt,t,e,+p||0,n-(p||0),"boolean"==typeof d?ae:ne,0,_),l&&(c.fp=l),u&&c.modifier(u,this,t),this._pt=c)},Ht=function _initTween(t,e,r){var i,n,a,s,o,u,h,l,f,c,d,p,_,m=t.vars,g=m.ease,v=m.startAt,y=m.immediateRender,T=m.lazy,b=m.onUpdate,x=m.onUpdateParams,k=m.callbackScope,M=m.runBackwards,O=m.yoyoEase,P=m.keyframes,C=m.autoRevert,A=t._dur,S=t._startAt,R=t._targets,D=t.parent,E=D&&"nested"===D.data?D.vars.targets:R,z="auto"===t._overwrite&&!I,F=t.timeline;if(!F||P&&g||(g="none"),t._ease=Yt(g,q.ease),t._yEase=O?Lt(Yt(!0===O?g:O,q.ease)):0,O&&t._yoyo&&!t._repeat&&(O=t._yEase,t._yEase=t._ease,t._ease=O),t._from=!F&&!!m.runBackwards,!F||P&&!m.stagger){if(p=(l=R[0]?fa(R[0]).harness:0)&&m[l.prop],i=ua(m,ft),S&&(S._zTime<0&&S.progress(1),e<0&&M&&y&&!C?S.render(-1,!0):S.revert(M&&A?ht:ut),S._lazy=0),v){if(za(t._startAt=Gt.set(R,qa({data:"isStart",overwrite:!1,parent:D,immediateRender:!0,lazy:w(T),startAt:null,delay:0,onUpdate:b,onUpdateParams:x,callbackScope:k,stagger:0},v))),e<0&&(B||!y&&!C)&&t._startAt.revert(ht),y&&A&&e<=0&&r<=0)return void(e&&(t._zTime=e))}else if(M&&A&&!S)if(e&&(y=!1),a=qa({overwrite:!1,data:"isFromStart",lazy:y&&w(T),immediateRender:y,stagger:0,parent:D},i),p&&(a[l.prop]=p),za(t._startAt=Gt.set(R,a)),e<0&&(B?t._startAt.revert(ht):t._startAt.render(-1,!0)),t._zTime=e,y){if(!e)return}else _initTween(t._startAt,V,V);for(t._pt=t._ptCache=0,T=A&&w(T)||T&&!A,n=0;n<R.length;n++){if(h=(o=R[n])._gsap||ea(R)[n]._gsap,t._ptLookup[n]=c={},dt[h.id]&&ct.length&&ma(),d=E===R?n:E.indexOf(o),l&&!1!==(f=new l).init(o,p||i,t,d,E)&&(t._pt=s=new pe(t._pt,o,f.name,0,1,f.render,f,0,f.priority),f._props.forEach(function(t){c[t]=s}),f.priority&&(u=1)),!l||p)for(a in i)pt[a]&&(f=_b(a,i,t,d,o,E))?f.priority&&(u=1):c[a]=s=Xt.call(t,o,a,"get",i[a],d,E,0,m.stringFilter);t._op&&t._op[n]&&t.kill(o,t._op[n]),z&&t._pt&&(Vt=t,L.killTweensOf(o,c,t.globalTime(e)),_=!t.parent,Vt=0),t._pt&&T&&(dt[h.id]=1)}u&&de(t),t._onInit&&t._onInit(t)}t._onUpdate=b,t._initted=(!t._op||t._pt)&&!_,P&&e<=0&&F.render(U,!0,!0)},Qt=function _parseFuncOrString(t,e,i,n,a){return s(t)?t.call(e,i,n,a):r(t)&&~t.indexOf("random(")?ob(t):t},Kt=vt+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",Zt={};ha(Kt+",id,stagger,delay,duration,paused,scrollTrigger",function(t){return Zt[t]=1});var Gt=function(z){function Tween(e,r,i,n){var a;"number"==typeof r&&(i.duration=r,r=i,i=null);var s,o,u,h,l,f,c,d,p=(a=z.call(this,n?r:va(r))||this).vars,_=p.duration,m=p.delay,g=p.immediateRender,T=p.stagger,b=p.overwrite,x=p.keyframes,k=p.defaults,M=p.scrollTrigger,O=p.yoyoEase,P=r.parent||L,C=($(e)||J(e)?t(e[0]):"length"in r)?[e]:Ot(e);if(a._targets=C.length?ea(C):R("GSAP target "+e+" not found. https://greensock.com",!j.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=b,x||T||y(_)||y(m)){if(r=a.vars,(s=a.timeline=new Ut({data:"nested",defaults:k||{},targets:P&&"nested"===P.data?P.vars.targets:C})).kill(),s.parent=s._dp=_assertThisInitialized(a),s._start=0,T||y(_)||y(m)){if(h=C.length,c=T&&eb(T),v(T))for(l in T)~Kt.indexOf(l)&&((d=d||{})[l]=T[l]);for(o=0;o<h;o++)(u=ua(r,Zt)).stagger=0,O&&(u.yoyoEase=O),d&&yt(u,d),f=C[o],u.duration=+Qt(_,_assertThisInitialized(a),o,f,C),u.delay=(+Qt(m,_assertThisInitialized(a),o,f,C)||0)-a._delay,!T&&1===h&&u.delay&&(a._delay=m=u.delay,a._start+=m,u.delay=0),s.to(f,u,c?c(o,f,C):0),s._ease=Ft.none;s.duration()?_=m=0:a.timeline=0}else if(x){va(qa(s.vars.defaults,{ease:"none"})),s._ease=Yt(x.ease||r.ease||"none");var A,S,D,E=0;if($(x))x.forEach(function(t){return s.to(C,t,">")}),s.duration();else{for(l in u={},x)"ease"===l||"easeEach"===l||fc(l,x[l],u,x.easeEach);for(l in u)for(A=u[l].sort(function(t,e){return t.t-e.t}),o=E=0;o<A.length;o++)(D={ease:(S=A[o]).e,duration:(S.t-(o?A[o-1].t:0))/100*_})[l]=S.v,s.to(C,D,E),E+=D.duration;s.duration()<_&&s.to({},{duration:_-s.duration()})}}_||a.duration(_=s.duration())}else a.timeline=0;return!0!==b||I||(Vt=_assertThisInitialized(a),L.killTweensOf(C),Vt=0),Ka(P,_assertThisInitialized(a),i),r.reversed&&a.reverse(),r.paused&&a.paused(!0),(g||!_&&!x&&a._start===ja(P._time)&&w(g)&&function _hasNoPausedAncestors(t){return!t||t._ts&&_hasNoPausedAncestors(t.parent)}(_assertThisInitialized(a))&&"nested"!==P.data)&&(a._tTime=-V,a.render(Math.max(0,-m)||0)),M&&La(_assertThisInitialized(a),M),a}_inheritsLoose(Tween,z);var e=Tween.prototype;return e.render=function render(t,e,r){var i,n,a,s,o,u,h,l,f,c=this._time,d=this._tDur,p=this._dur,_=t<0,m=d-V<t&&!_?d:t<V?0:t;if(p){if(m!==this._tTime||!t||r||!this._initted&&this._tTime||this._startAt&&this._zTime<0!=_){if(i=m,l=this.timeline,this._repeat){if(s=p+this._rDelay,this._repeat<-1&&_)return this.totalTime(100*s+t,e,r);if(i=ja(m%s),m===d?(a=this._repeat,i=p):((a=~~(m/s))&&a===m/s&&(i=p,a--),p<i&&(i=p)),(u=this._yoyo&&1&a)&&(f=this._yEase,i=p-i),o=Tt(this._tTime,s),i===c&&!r&&this._initted)return this._tTime=m,this;a!==o&&(l&&this._yEase&&Pb(l,u),!this.vars.repeatRefresh||u||this._lock||(this._lock=r=1,this.render(ja(s*a),!0).invalidate()._lock=0))}if(!this._initted){if(Ma(this,_?t:i,r,e,m))return this._tTime=0,this;if(c!==this._time)return this;if(p!==this._dur)return this.render(t,e,r)}if(this._tTime=m,this._time=i,!this._act&&this._ts&&(this._act=1,this._lazy=0),this.ratio=h=(f||this._ease)(i/p),this._from&&(this.ratio=h=1-h),i&&!c&&!e&&(Ct(this,"onStart"),this._tTime!==m))return this;for(n=this._pt;n;)n.r(h,n.d),n=n._next;l&&l.render(t<0?t:!i&&u?-V:l._dur*l._ease(i/this._dur),e,r)||this._startAt&&(this._zTime=t),this._onUpdate&&!e&&(_&&Ca(this,t,0,r),Ct(this,"onUpdate")),this._repeat&&a!==o&&this.vars.onRepeat&&!e&&this.parent&&Ct(this,"onRepeat"),m!==this._tDur&&m||this._tTime!==m||(_&&!this._onUpdate&&Ca(this,t,0,!0),!t&&p||!(m===this._tDur&&0<this._ts||!m&&this._ts<0)||za(this,1),e||_&&!c||!(m||c||u)||(Ct(this,m===d?"onComplete":"onReverseComplete",!0),!this._prom||m<d&&0<this.timeScale()||this._prom()))}}else!function _renderZeroDurationTween(t,e,r,i){var n,a,s,o=t.ratio,u=e<0||!e&&(!t._start&&function _parentPlayheadIsBeforeStart(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||_parentPlayheadIsBeforeStart(e))}(t)&&(t._initted||!bt(t))||(t._ts<0||t._dp._ts<0)&&!bt(t))?0:1,h=t._rDelay,l=0;if(h&&t._repeat&&(l=kt(0,t._tDur,e),a=Tt(l,h),t._yoyo&&1&a&&(u=1-u),a!==Tt(t._tTime,h)&&(o=1-u,t.vars.repeatRefresh&&t._initted&&t.invalidate())),u!==o||B||i||t._zTime===V||!e&&t._zTime){if(!t._initted&&Ma(t,e,i,r,l))return;for(s=t._zTime,t._zTime=e||(r?V:0),r=r||e&&!s,t.ratio=u,t._from&&(u=1-u),t._time=0,t._tTime=l,n=t._pt;n;)n.r(u,n.d),n=n._next;e<0&&Ca(t,e,0,!0),t._onUpdate&&!r&&Ct(t,"onUpdate"),l&&t._repeat&&!r&&t.parent&&Ct(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===u&&(u&&za(t,1),r||B||(Ct(t,u?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)}(this,t,e,r);return this},e.targets=function targets(){return this._targets},e.invalidate=function invalidate(t){return t&&this.vars.runBackwards||(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(t),z.prototype.invalidate.call(this,t)},e.resetTo=function resetTo(t,e,r,i){d||Et.wake(),this._ts||this.play();var n,a=Math.min(this._dur,(this._dp._time-this._start)*this._ts);return this._initted||Ht(this,a),n=this._ease(a/this._dur),function _updatePropTweens(t,e,r,i,n,a,s){var o,u,h,l,f=(t._pt&&t._ptCache||(t._ptCache={}))[e];if(!f)for(f=t._ptCache[e]=[],h=t._ptLookup,l=t._targets.length;l--;){if((o=h[l][e])&&o.d&&o.d._pt)for(o=o.d._pt;o&&o.p!==e&&o.fp!==e;)o=o._next;if(!o)return Wt=1,t.vars[e]="+=0",Ht(t,s),Wt=0,1;f.push(o)}for(l=f.length;l--;)(o=(u=f[l])._pt||u).s=!i&&0!==i||n?o.s+(i||0)+a*o.c:i,o.c=r-o.s,u.e&&(u.e=ia(r)+Ya(u.e)),u.b&&(u.b=o.s+Ya(u.b))}(this,t,e,r,i,n,a)?this.resetTo(t,e,r,i):(Ia(this,0),this.parent||xa(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function kill(t,e){if(void 0===e&&(e="all"),!(t||e&&"all"!==e))return this._lazy=this._pt=0,this.parent?tb(this):this;if(this.timeline){var i=this.timeline.totalDuration();return this.timeline.killTweensOf(t,e,Vt&&!0!==Vt.vars.overwrite)._first||tb(this),this.parent&&i!==this.timeline.totalDuration()&&Ra(this,this._dur*this.timeline._tDur/i,0,1),this}var n,a,s,o,u,h,l,f=this._targets,c=t?Ot(t):f,d=this._ptLookup,p=this._pt;if((!e||"all"===e)&&function _arraysMatch(t,e){for(var r=t.length,i=r===e.length;i&&r--&&t[r]===e[r];);return r<0}(f,c))return"all"===e&&(this._pt=0),tb(this);for(n=this._op=this._op||[],"all"!==e&&(r(e)&&(u={},ha(e,function(t){return u[t]=1}),e=u),e=function _addAliasesToVars(t,e){var r,i,n,a,s=t[0]?fa(t[0]).harness:0,o=s&&s.aliases;if(!o)return e;for(i in r=yt({},e),o)if(i in r)for(n=(a=o[i].split(",")).length;n--;)r[a[n]]=r[i];return r}(f,e)),l=f.length;l--;)if(~c.indexOf(f[l]))for(u in a=d[l],"all"===e?(n[l]=e,o=a,s={}):(s=n[l]=n[l]||{},o=e),o)(h=a&&a[u])&&("kill"in h.d&&!0!==h.d.kill(u)||ya(this,h,"_pt"),delete a[u]),"all"!==s&&(s[u]=1);return this._initted&&!this._pt&&p&&tb(this),this},Tween.to=function to(t,e,r){return new Tween(t,e,r)},Tween.from=function from(t,e){return Va(1,arguments)},Tween.delayedCall=function delayedCall(t,e,r,i){return new Tween(e,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:t,onComplete:e,onReverseComplete:e,onCompleteParams:r,onReverseCompleteParams:r,callbackScope:i})},Tween.fromTo=function fromTo(t,e,r){return Va(2,arguments)},Tween.set=function set(t,e){return e.duration=0,e.repeatDelay||(e.repeat=0),new Tween(t,e)},Tween.killTweensOf=function killTweensOf(t,e,r){return L.killTweensOf(t,e,r)},Tween}(qt);qa(Gt.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0}),ha("staggerTo,staggerFrom,staggerFromTo",function(r){Gt[r]=function(){var t=new Ut,e=Mt.call(arguments,0);return e.splice("staggerFromTo"===r?5:4,0,0),t[r].apply(t,e)}});function nc(t,e,r){return t.setAttribute(e,r)}function vc(t,e,r,i){i.mSet(t,e,i.m.call(i.tween,r,i.mt),i)}var Jt=function _setterPlain(t,e,r){return t[e]=r},$t=function _setterFunc(t,e,r){return t[e](r)},ee=function _setterFuncWithParam(t,e,r,i){return t[e](i.fp,r)},re=function _getSetter(t,e){return s(t[e])?$t:u(t[e])&&t.setAttribute?nc:Jt},ne=function _renderPlain(t,e){return e.set(e.t,e.p,Math.round(1e6*(e.s+e.c*t))/1e6,e)},ae=function _renderBoolean(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},se=function _renderComplexString(t,e){var r=e._pt,i="";if(!t&&e.b)i=e.b;else if(1===t&&e.e)i=e.e;else{for(;r;)i=r.p+(r.m?r.m(r.s+r.c*t):Math.round(1e4*(r.s+r.c*t))/1e4)+i,r=r._next;i+=e.c}e.set(e.t,e.p,i,e)},oe=function _renderPropTweens(t,e){for(var r=e._pt;r;)r.r(t,r.d),r=r._next},le=function _addPluginModifier(t,e,r,i){for(var n,a=this._pt;a;)n=a._next,a.p===i&&a.modifier(t,e,r),a=n},fe=function _killPropTweensOf(t){for(var e,r,i=this._pt;i;)r=i._next,i.p===t&&!i.op||i.op===t?ya(this,i,"_pt"):i.dep||(e=1),i=r;return!e},de=function _sortPropTweensByPriority(t){for(var e,r,i,n,a=t._pt;a;){for(e=a._next,r=i;r&&r.pr>a.pr;)r=r._next;(a._prev=r?r._prev:n)?a._prev._next=a:i=a,(a._next=r)?r._prev=a:n=a,a=e}t._pt=i},pe=(PropTween.prototype.modifier=function modifier(t,e,r){this.mSet=this.mSet||this.set,this.set=vc,this.m=t,this.mt=r,this.tween=e},PropTween);function PropTween(t,e,r,i,n,a,s,o,u){this.t=e,this.s=i,this.c=n,this.p=r,this.r=a||ne,this.d=s||this,this.set=o||Jt,this.pr=u||0,(this._next=t)&&(t._prev=this)}ha(vt+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger",function(t){return ft[t]=1}),ot.TweenMax=ot.TweenLite=Gt,ot.TimelineLite=ot.TimelineMax=Ut,L=new Ut({sortChildren:!1,defaults:q,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0}),j.stringFilter=Eb;function Cc(t){return(Te[t]||we).map(function(t){return t()})}function Dc(){var t=Date.now(),o=[];2<t-xe&&(Cc("matchMediaInit"),ye.forEach(function(t){var e,r,i,n,a=t.queries,s=t.conditions;for(r in a)(e=h.matchMedia(a[r]).matches)&&(i=1),e!==s[r]&&(s[r]=e,n=1);n&&(t.revert(),i&&o.push(t))}),Cc("matchMediaRevert"),o.forEach(function(t){return t.onMatch(t)}),xe=t,Cc("matchMedia"))}var _e,ye=[],Te={},we=[],xe=0,ke=((_e=Context.prototype).add=function add(t,i,n){function Cw(){var t,e=l,r=a.selector;return e&&e!==a&&e.data.push(a),n&&(a.selector=cb(n)),l=a,t=i.apply(a,arguments),s(t)&&a._r.push(t),l=e,a.selector=r,a.isReverted=!1,t}s(t)&&(n=i,i=t,t=s);var a=this;return a.last=Cw,t===s?Cw(a):t?a[t]=Cw:Cw},_e.ignore=function ignore(t){var e=l;l=null,t(this),l=e},_e.getTweens=function getTweens(){var e=[];return this.data.forEach(function(t){return t instanceof Context?e.push.apply(e,t.getTweens()):t instanceof Gt&&!(t.parent&&"nested"===t.parent.data)&&e.push(t)}),e},_e.clear=function clear(){this._r.length=this.data.length=0},_e.kill=function kill(e,t){var r=this;if(e){var i=this.getTweens();this.data.forEach(function(t){"isFlip"===t.data&&(t.revert(),t.getChildren(!0,!0,!1).forEach(function(t){return i.splice(i.indexOf(t),1)}))}),i.map(function(t){return{g:t.globalTime(0),t:t}}).sort(function(t,e){return e.g-t.g||-1}).forEach(function(t){return t.t.revert(e)}),this.data.forEach(function(t){return!(t instanceof qt)&&t.revert&&t.revert(e)}),this._r.forEach(function(t){return t(e,r)}),this.isReverted=!0}else this.data.forEach(function(t){return t.kill&&t.kill()});if(this.clear(),t){var n=ye.indexOf(this);~n&&ye.splice(n,1)}},_e.revert=function revert(t){this.kill(t||{})},Context);function Context(t,e){this.selector=e&&cb(e),this.data=[],this._r=[],this.isReverted=!1,t&&this.add(t)}var Me,Oe=((Me=MatchMedia.prototype).add=function add(t,e,r){v(t)||(t={matches:t});var i,n,a,s=new ke(0,r||this.scope),o=s.conditions={};for(n in this.contexts.push(s),e=s.add("onMatch",e),s.queries=t)"all"===n?a=1:(i=h.matchMedia(t[n]))&&(ye.indexOf(s)<0&&ye.push(s),(o[n]=i.matches)&&(a=1),i.addListener?i.addListener(Dc):i.addEventListener("change",Dc));return a&&e(s),this},Me.revert=function revert(t){this.kill(t||{})},Me.kill=function kill(e){this.contexts.forEach(function(t){return t.kill(e,!0)})},MatchMedia);function MatchMedia(t){this.contexts=[],this.scope=t}var Pe={registerPlugin:function registerPlugin(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];e.forEach(function(t){return function _createPlugin(t){var e=(t=!t.name&&t.default||t).name,r=s(t),i=e&&!r&&t.init?function(){this._props=[]}:t,n={init:T,render:oe,add:Xt,kill:fe,modifier:le,rawVars:0},a={targetTest:0,get:0,getSetter:re,aliases:{},register:0};if(zt(),t!==i){if(pt[e])return;qa(i,qa(ua(t,n),a)),yt(i.prototype,yt(n,ua(t,a))),pt[i.prop=e]=i,t.targetTest&&(gt.push(i),ft[e]=1),e=("css"===e?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}S(e,i),t.register&&t.register(Ce,i,pe)}(t)})},timeline:function timeline(t){return new Ut(t)},getTweensOf:function getTweensOf(t,e){return L.getTweensOf(t,e)},getProperty:function getProperty(i,t,e,n){r(i)&&(i=Ot(i)[0]);var a=fa(i||{}).get,s=e?pa:oa;return"native"===e&&(e=""),i?t?s((pt[t]&&pt[t].get||a)(i,t,e,n)):function(t,e,r){return s((pt[t]&&pt[t].get||a)(i,t,e,r))}:i},quickSetter:function quickSetter(r,e,i){if(1<(r=Ot(r)).length){var n=r.map(function(t){return Ce.quickSetter(t,e,i)}),a=n.length;return function(t){for(var e=a;e--;)n[e](t)}}r=r[0]||{};var s=pt[e],o=fa(r),u=o.harness&&(o.harness.aliases||{})[e]||e,h=s?function(t){var e=new s;c._pt=0,e.init(r,i?t+i:t,c,0,[r]),e.render(1,e),c._pt&&oe(1,c)}:o.set(r,u);return s?h:function(t){return h(r,u,i?t+i:t,o,1)}},quickTo:function quickTo(t,i,e){function Ux(t,e,r){return n.resetTo(i,t,e,r)}var r,n=Ce.to(t,yt(((r={})[i]="+=0.1",r.paused=!0,r),e||{}));return Ux.tween=n,Ux},isTweening:function isTweening(t){return 0<L.getTweensOf(t,!0).length},defaults:function defaults(t){return t&&t.ease&&(t.ease=Yt(t.ease,q.ease)),ta(q,t||{})},config:function config(t){return ta(j,t||{})},registerEffect:function registerEffect(t){var i=t.name,n=t.effect,e=t.plugins,a=t.defaults,r=t.extendTimeline;(e||"").split(",").forEach(function(t){return t&&!pt[t]&&!ot[t]&&R(i+" effect requires "+t+" plugin.")}),_t[i]=function(t,e,r){return n(Ot(t),qa(e||{},a),r)},r&&(Ut.prototype[i]=function(t,e,r){return this.add(_t[i](t,v(e)?e:(r=e)&&{},this),r)})},registerEase:function registerEase(t,e){Ft[t]=Yt(e)},parseEase:function parseEase(t,e){return arguments.length?Yt(t,e):Ft},getById:function getById(t){return L.getById(t)},exportRoot:function exportRoot(t,e){void 0===t&&(t={});var r,i,n=new Ut(t);for(n.smoothChildTiming=w(t.smoothChildTiming),L.remove(n),n._dp=0,n._time=n._tTime=L._time,r=L._first;r;)i=r._next,!e&&!r._dur&&r instanceof Gt&&r.vars.onComplete===r._targets[0]||Ka(n,r,r._start-r._delay),r=i;return Ka(L,n,0),n},context:function context(t,e){return t?new ke(t,e):l},matchMedia:function matchMedia(t){return new Oe(t)},matchMediaRefresh:function matchMediaRefresh(){return ye.forEach(function(t){var e,r,i=t.conditions;for(r in i)i[r]&&(i[r]=!1,e=1);e&&t.revert()})||Dc()},addEventListener:function addEventListener(t,e){var r=Te[t]||(Te[t]=[]);~r.indexOf(e)||r.push(e)},removeEventListener:function removeEventListener(t,e){var r=Te[t],i=r&&r.indexOf(e);0<=i&&r.splice(i,1)},utils:{wrap:function wrap(e,t,r){var i=t-e;return $(e)?lb(e,wrap(0,e.length),t):Wa(r,function(t){return(i+(t-e)%i)%i+e})},wrapYoyo:function wrapYoyo(e,t,r){var i=t-e,n=2*i;return $(e)?lb(e,wrapYoyo(0,e.length-1),t):Wa(r,function(t){return e+(i<(t=(n+(t-e)%n)%n||0)?n-t:t)})},distribute:eb,random:hb,snap:gb,normalize:function normalize(t,e,r){return Pt(t,e,0,1,r)},getUnit:Ya,clamp:function clamp(e,r,t){return Wa(t,function(t){return kt(e,r,t)})},splitColor:zb,toArray:Ot,selector:cb,mapRange:Pt,pipe:function pipe(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return function(t){return e.reduce(function(t,e){return e(t)},t)}},unitize:function unitize(e,r){return function(t){return e(parseFloat(t))+(r||Ya(t))}},interpolate:function interpolate(e,i,t,n){var a=isNaN(e+i)?0:function(t){return(1-t)*e+t*i};if(!a){var s,o,u,h,l,f=r(e),c={};if(!0===t&&(n=1)&&(t=null),f)e={p:e},i={p:i};else if($(e)&&!$(i)){for(u=[],h=e.length,l=h-2,o=1;o<h;o++)u.push(interpolate(e[o-1],e[o]));h--,a=function func(t){t*=h;var e=Math.min(l,~~t);return u[e](t-e)},t=i}else n||(e=yt($(e)?[]:{},e));if(!u){for(s in i)Xt.call(c,e,s,"get",i[s]);a=function func(t){return oe(t,c)||(f?e.p:e)}}}return Wa(t,a)},shuffle:db},install:P,effects:_t,ticker:Et,updateRoot:Ut.updateRoot,plugins:pt,globalTimeline:L,core:{PropTween:pe,globals:S,Tween:Gt,Timeline:Ut,Animation:qt,getCache:fa,_removeLinkedListItem:ya,reverting:function reverting(){return B},context:function context(t){return t&&l&&(l.data.push(t),t._ctx=l),l},suppressOverwrites:function suppressOverwrites(t){return I=t}}};ha("to,from,fromTo,delayedCall,set,killTweensOf",function(t){return Pe[t]=Gt[t]}),Et.add(Ut.updateRoot),c=Pe.to({},{duration:0});function Hc(t,e){for(var r=t._pt;r&&r.p!==e&&r.op!==e&&r.fp!==e;)r=r._next;return r}function Jc(t,a){return{name:t,rawVars:1,init:function init(t,n,e){e._onInit=function(t){var e,i;if(r(n)&&(e={},ha(n,function(t){return e[t]=1}),n=e),a){for(i in e={},n)e[i]=a(n[i]);n=e}!function _addModifiers(t,e){var r,i,n,a=t._targets;for(r in e)for(i=a.length;i--;)(n=(n=t._ptLookup[i][r])&&n.d)&&(n._pt&&(n=Hc(n,r)),n&&n.modifier&&n.modifier(e[r],t,a[i],r))}(t,n)}}}}var Ce=Pe.registerPlugin({name:"attr",init:function init(t,e,r,i,n){var a,s,o;for(a in this.tween=r,e)o=t.getAttribute(a)||"",(s=this.add(t,"setAttribute",(o||0)+"",e[a],i,n,0,0,a)).op=a,s.b=o,this._props.push(a)},render:function render(t,e){for(var r=e._pt;r;)B?r.set(r.t,r.p,r.b,r):r.r(t,r.d),r=r._next}},{name:"endArray",init:function init(t,e){for(var r=e.length;r--;)this.add(t,r,t[r]||0,e[r],0,0,0,0,0,1)}},Jc("roundProps",fb),Jc("modifiers"),Jc("snap",gb))||Pe;Gt.version=Ut.version=Ce.version="3.11.2",o=1,x()&&zt();function td(t,e){return e.set(e.t,e.p,Math.round(1e4*(e.s+e.c*t))/1e4+e.u,e)}function ud(t,e){return e.set(e.t,e.p,1===t?e.e:Math.round(1e4*(e.s+e.c*t))/1e4+e.u,e)}function vd(t,e){return e.set(e.t,e.p,t?Math.round(1e4*(e.s+e.c*t))/1e4+e.u:e.b,e)}function wd(t,e){var r=e.s+e.c*t;e.set(e.t,e.p,~~(r+(r<0?-.5:.5))+e.u,e)}function xd(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)}function yd(t,e){return e.set(e.t,e.p,1!==t?e.b:e.e,e)}function zd(t,e,r){return t.style[e]=r}function Ad(t,e,r){return t.style.setProperty(e,r)}function Bd(t,e,r){return t._gsap[e]=r}function Cd(t,e,r){return t._gsap.scaleX=t._gsap.scaleY=r}function Dd(t,e,r,i,n){var a=t._gsap;a.scaleX=a.scaleY=r,a.renderTransform(n,a)}function Ed(t,e,r,i,n){var a=t._gsap;a[e]=r,a.renderTransform(n,a)}function Hd(t,e){var r=this,i=this.target,n=i.style;if(t in rr){if(this.tfm=this.tfm||{},"transform"!==t&&(~(t=hr[t]||t).indexOf(",")?t.split(",").forEach(function(t){return r.tfm[t]=mr(i,t)}):this.tfm[t]=i._gsap.x?i._gsap[t]:mr(i,t)),0<=this.props.indexOf(lr))return;i._gsap.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(fr,e,"")),t=lr}(n||e)&&this.props.push(t,e,n[t])}function Id(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))}function Jd(){var t,e,r=this.props,i=this.target,n=i.style,a=i._gsap;for(t=0;t<r.length;t+=3)r[t+1]?i[r[t]]=r[t+2]:r[t+2]?n[r[t]]=r[t+2]:n.removeProperty(r[t].replace(sr,"-$1").toLowerCase());if(this.tfm){for(e in this.tfm)a[e]=this.tfm[e];a.svg&&(a.renderTransform(),i.setAttribute("data-svg-origin",this.svgo||"")),!(t=Fe())||t.isStart||n[lr]||(Id(n),a.uncache=1)}}function Kd(t,e){var r={target:t,props:[],revert:Jd,save:Hd};return e&&e.split(",").forEach(function(t){return r.save(t)}),r}function Md(t,e){var r=Se.createElementNS?Se.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):Se.createElement(t);return r.style?r:Se.createElement(t)}function Nd(t,e,r){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(sr,"-$1").toLowerCase())||i.getPropertyValue(e)||!r&&Nd(t,dr(e)||e,1)||""}function Qd(){(function _windowExists(){return"undefined"!=typeof window})()&&window.document&&(Ae=window,Se=Ae.document,Re=Se.documentElement,Ee=Md("div")||{style:{}},Md("div"),lr=dr(lr),fr=lr+"Origin",Ee.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Ie=!!dr("perspective"),Fe=Ce.core.reverting,De=1)}function Rd(t){var e,r=Md("svg",this.ownerSVGElement&&this.ownerSVGElement.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=this.parentNode,n=this.nextSibling,a=this.style.cssText;if(Re.appendChild(r),r.appendChild(this),this.style.display="block",t)try{e=this.getBBox(),this._gsapBBox=this.getBBox,this.getBBox=Rd}catch(t){}else this._gsapBBox&&(e=this._gsapBBox());return i&&(n?i.insertBefore(this,n):i.appendChild(this)),Re.removeChild(r),this.style.cssText=a,e}function Sd(t,e){for(var r=e.length;r--;)if(t.hasAttribute(e[r]))return t.getAttribute(e[r])}function Td(e){var r;try{r=e.getBBox()}catch(t){r=Rd.call(e,!0)}return r&&(r.width||r.height)||e.getBBox===Rd||(r=Rd.call(e,!0)),!r||r.width||r.x||r.y?r:{x:+Sd(e,["x","cx","x1"])||0,y:+Sd(e,["y","cy","y1"])||0,width:0,height:0}}function Ud(t){return!(!t.getCTM||t.parentNode&&!t.ownerSVGElement||!Td(t))}function Vd(t,e){if(e){var r=t.style;e in rr&&e!==fr&&(e=lr),r.removeProperty?("ms"!==e.substr(0,2)&&"webkit"!==e.substr(0,6)||(e="-"+e),r.removeProperty(e.replace(sr,"-$1").toLowerCase())):r.removeAttribute(e)}}function Wd(t,e,r,i,n,a){var s=new pe(t._pt,e,r,0,1,a?yd:xd);return(t._pt=s).b=i,s.e=n,t._props.push(r),s}function Zd(t,e,r,i){var n,a,s,o,u=parseFloat(r)||0,h=(r+"").trim().substr((u+"").length)||"px",l=Ee.style,f=or.test(e),c="svg"===t.tagName.toLowerCase(),d=(c?"client":"offset")+(f?"Width":"Height"),p="px"===i,_="%"===i;return i===h||!u||pr[i]||pr[h]?u:("px"===h||p||(u=Zd(t,e,r,"px")),o=t.getCTM&&Ud(t),!_&&"%"!==h||!rr[e]&&!~e.indexOf("adius")?(l[f?"width":"height"]=100+(p?h:i),a=~e.indexOf("adius")||"em"===i&&t.appendChild&&!c?t:t.parentNode,o&&(a=(t.ownerSVGElement||{}).parentNode),a&&a!==Se&&a.appendChild||(a=Se.body),(s=a._gsap)&&_&&s.width&&f&&s.time===Et.time&&!s.uncache?ia(u/s.width*100):(!_&&"%"!==h||_r[Nd(a,"display")]||(l.position=Nd(t,"position")),a===t&&(l.position="static"),a.appendChild(Ee),n=Ee[d],a.removeChild(Ee),l.position="absolute",f&&_&&((s=fa(a)).time=Et.time,s.width=a[d]),ia(p?n*u/100:n&&u?100/n*u:0))):(n=o?t.getBBox()[f?"width":"height"]:t[d],ia(_?u/n*100:u/100*n)))}function _d(t,e,r,i){if(!r||"none"===r){var n=dr(e,t,1),a=n&&Nd(t,n,1);a&&a!==r?(e=n,r=a):"borderColor"===e&&(r=Nd(t,"borderTopColor"))}var s,o,u,h,l,f,c,d,p,_,m,g=new pe(this._pt,t.style,e,0,1,se),v=0,y=0;if(g.b=r,g.e=i,r+="","auto"===(i+="")&&(t.style[e]=i,i=Nd(t,e)||i,t.style[e]=r),Eb(s=[r,i]),i=s[1],u=(r=s[0]).match(rt)||[],(i.match(rt)||[]).length){for(;o=rt.exec(i);)c=o[0],p=i.substring(v,o.index),l?l=(l+1)%5:"rgba("!==p.substr(-5)&&"hsla("!==p.substr(-5)||(l=1),c!==(f=u[y++]||"")&&(h=parseFloat(f)||0,m=f.substr((h+"").length),"="===c.charAt(1)&&(c=ka(h,c)+m),d=parseFloat(c),_=c.substr((d+"").length),v=rt.lastIndex-_.length,_||(_=_||j.units[e]||m,v===i.length&&(i+=_,g.e+=_)),m!==_&&(h=Zd(t,e,f,_)||0),g._pt={_next:g._pt,p:p||1===y?p:",",s:h,c:d-h,m:l&&l<4||"zIndex"===e?Math.round:0});g.c=v<i.length?i.substring(v,i.length):""}else g.r="display"===e&&"none"===i?yd:xd;return nt.test(i)&&(g.e=0),this._pt=g}function be(t){var e=t.split(" "),r=e[0],i=e[1]||"50%";return"top"!==r&&"bottom"!==r&&"left"!==i&&"right"!==i||(t=r,r=i,i=t),e[0]=gr[r]||r,e[1]=gr[i]||i,e.join(" ")}function ce(t,e){if(e.tween&&e.tween._time===e.tween._dur){var r,i,n,a=e.t,s=a.style,o=e.u,u=a._gsap;if("all"===o||!0===o)s.cssText="",i=1;else for(n=(o=o.split(",")).length;-1<--n;)r=o[n],rr[r]&&(i=1,r="transformOrigin"===r?fr:lr),Vd(a,r);i&&(Vd(a,lr),u&&(u.svg&&a.removeAttribute("transform"),br(a,1),u.uncache=1,Id(s)))}}function ge(t){return"matrix(1, 0, 0, 1, 0, 0)"===t||"none"===t||!t}function he(t){var e=Nd(t,lr);return ge(e)?yr:e.substr(7).match(et).map(ia)}function ie(t,e){var r,i,n,a,s=t._gsap||fa(t),o=t.style,u=he(t);return s.svg&&t.getAttribute("transform")?"1,0,0,1,0,0"===(u=[(n=t.transform.baseVal.consolidate().matrix).a,n.b,n.c,n.d,n.e,n.f]).join(",")?yr:u:(u!==yr||t.offsetParent||t===Re||s.svg||(n=o.display,o.display="block",(r=t.parentNode)&&t.offsetParent||(a=1,i=t.nextElementSibling,Re.appendChild(t)),u=he(t),n?o.display=n:Vd(t,"display"),a&&(i?r.insertBefore(t,i):r?r.appendChild(t):Re.removeChild(t))),e&&6<u.length?[u[0],u[1],u[4],u[5],u[12],u[13]]:u)}function je(t,e,r,i,n,a){var s,o,u,h=t._gsap,l=n||ie(t,!0),f=h.xOrigin||0,c=h.yOrigin||0,d=h.xOffset||0,p=h.yOffset||0,_=l[0],m=l[1],g=l[2],v=l[3],y=l[4],T=l[5],b=e.split(" "),w=parseFloat(b[0])||0,x=parseFloat(b[1])||0;r?l!==yr&&(o=_*v-m*g)&&(u=w*(-m/o)+x*(_/o)-(_*T-m*y)/o,w=w*(v/o)+x*(-g/o)+(g*T-v*y)/o,x=u):(w=(s=Td(t)).x+(~b[0].indexOf("%")?w/100*s.width:w),x=s.y+(~(b[1]||b[0]).indexOf("%")?x/100*s.height:x)),i||!1!==i&&h.smooth?(y=w-f,T=x-c,h.xOffset=d+(y*_+T*g)-y,h.yOffset=p+(y*m+T*v)-T):h.xOffset=h.yOffset=0,h.xOrigin=w,h.yOrigin=x,h.smooth=!!i,h.origin=e,h.originIsAbsolute=!!r,t.style[fr]="0px 0px",a&&(Wd(a,h,"xOrigin",f,w),Wd(a,h,"yOrigin",c,x),Wd(a,h,"xOffset",d,h.xOffset),Wd(a,h,"yOffset",p,h.yOffset)),t.setAttribute("data-svg-origin",w+" "+x)}function me(t,e,r){var i=Ya(e);return ia(parseFloat(e)+parseFloat(Zd(t,"x",r+"px",i)))+i}function te(t,e,i,n,a){var s,o,u=360,h=r(a),l=parseFloat(a)*(h&&~a.indexOf("rad")?ir:1)-n,f=n+l+"deg";return h&&("short"===(s=a.split("_")[1])&&(l%=u)!==l%180&&(l+=l<0?u:-u),"cw"===s&&l<0?l=(l+36e9)%u-~~(l/u)*u:"ccw"===s&&0<l&&(l=(l-36e9)%u-~~(l/u)*u)),t._pt=o=new pe(t._pt,e,i,n,l,ud),o.e=f,o.u="deg",t._props.push(i),o}function ue(t,e){for(var r in e)t[r]=e[r];return t}function ve(t,e,r){var i,n,a,s,o,u,h,l=ue({},r._gsap),f=r.style;for(n in l.svg?(a=r.getAttribute("transform"),r.setAttribute("transform",""),f[lr]=e,i=br(r,1),Vd(r,lr),r.setAttribute("transform",a)):(a=getComputedStyle(r)[lr],f[lr]=e,i=br(r,1),f[lr]=a),rr)(a=l[n])!==(s=i[n])&&"perspective,force3D,transformOrigin,svgOrigin".indexOf(n)<0&&(o=Ya(a)!==(h=Ya(s))?Zd(r,n,a,h):parseFloat(a),u=parseFloat(s),t._pt=new pe(t._pt,i,n,o,u-o,td),t._pt.u=h||0,t._props.push(n));ue(i,l)}var Ae,Se,Re,De,Ee,ze,Fe,Ie,Be=Ft.Power0,Le=Ft.Power1,Ye=Ft.Power2,Ne=Ft.Power3,qe=Ft.Power4,Ue=Ft.Linear,Ve=Ft.Quad,We=Ft.Cubic,Xe=Ft.Quart,He=Ft.Quint,Qe=Ft.Strong,Ke=Ft.Elastic,Ze=Ft.Back,Ge=Ft.SteppedEase,Je=Ft.Bounce,$e=Ft.Sine,tr=Ft.Expo,er=Ft.Circ,rr={},ir=180/Math.PI,nr=Math.PI/180,ar=Math.atan2,sr=/([A-Z])/g,or=/(left|right|width|margin|padding|x)/i,ur=/[\s,\(]\S/,hr={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},lr="transform",fr=lr+"Origin",cr="O,Moz,ms,Ms,Webkit".split(","),dr=function _checkPropPrefix(t,e,r){var i=(e||Ee).style,n=5;if(t in i&&!r)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);n--&&!(cr[n]+t in i););return n<0?null:(3===n?"ms":0<=n?cr[n]:"")+t},pr={deg:1,rad:1,turn:1},_r={grid:1,flex:1},mr=function _get(t,e,r,i){var n;return De||Qd(),e in hr&&"transform"!==e&&~(e=hr[e]).indexOf(",")&&(e=e.split(",")[0]),rr[e]&&"transform"!==e?(n=br(t,i),n="transformOrigin"!==e?n[e]:n.svg?n.origin:wr(Nd(t,fr))+" "+n.zOrigin+"px"):(n=t.style[e])&&"auto"!==n&&!i&&!~(n+"").indexOf("calc(")||(n=vr[e]&&vr[e](t,e,r)||Nd(t,e)||ga(t,e)||("opacity"===e?1:0)),r&&!~(n+"").trim().indexOf(" ")?Zd(t,e,n,r)+r:n},gr={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},vr={clearProps:function clearProps(t,e,r,i,n){if("isFromStart"!==n.data){var a=t._pt=new pe(t._pt,e,r,0,0,ce);return a.u=i,a.pr=-10,a.tween=n,t._props.push(r),1}}},yr=[1,0,0,1,0,0],Tr={},br=function _parseTransform(t,e){var r=t._gsap||new jt(t);if("x"in r&&!e&&!r.uncache)return r;var i,n,a,s,o,u,h,l,f,c,d,p,_,m,g,v,y,T,b,w,x,k,M,O,P,C,A,S,R,D,E,z,F=t.style,I=r.scaleX<0,B="deg",L=getComputedStyle(t),Y=Nd(t,fr)||"0";return i=n=a=u=h=l=f=c=d=0,s=o=1,r.svg=!(!t.getCTM||!Ud(t)),L.translate&&("none"===L.translate&&"none"===L.scale&&"none"===L.rotate||(F[lr]=("none"!==L.translate?"translate3d("+(L.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+("none"!==L.rotate?"rotate("+L.rotate+") ":"")+("none"!==L.scale?"scale("+L.scale.split(" ").join(",")+") ":"")+("none"!==L[lr]?L[lr]:"")),F.scale=F.rotate=F.translate="none"),m=ie(t,r.svg),r.svg&&(O=r.uncache?(P=t.getBBox(),Y=r.xOrigin-P.x+"px "+(r.yOrigin-P.y)+"px",""):!e&&t.getAttribute("data-svg-origin"),je(t,O||Y,!!O||r.originIsAbsolute,!1!==r.smooth,m)),p=r.xOrigin||0,_=r.yOrigin||0,m!==yr&&(T=m[0],b=m[1],w=m[2],x=m[3],i=k=m[4],n=M=m[5],6===m.length?(s=Math.sqrt(T*T+b*b),o=Math.sqrt(x*x+w*w),u=T||b?ar(b,T)*ir:0,(f=w||x?ar(w,x)*ir+u:0)&&(o*=Math.abs(Math.cos(f*nr))),r.svg&&(i-=p-(p*T+_*w),n-=_-(p*b+_*x))):(z=m[6],D=m[7],A=m[8],S=m[9],R=m[10],E=m[11],i=m[12],n=m[13],a=m[14],h=(g=ar(z,R))*ir,g&&(O=k*(v=Math.cos(-g))+A*(y=Math.sin(-g)),P=M*v+S*y,C=z*v+R*y,A=k*-y+A*v,S=M*-y+S*v,R=z*-y+R*v,E=D*-y+E*v,k=O,M=P,z=C),l=(g=ar(-w,R))*ir,g&&(v=Math.cos(-g),E=x*(y=Math.sin(-g))+E*v,T=O=T*v-A*y,b=P=b*v-S*y,w=C=w*v-R*y),u=(g=ar(b,T))*ir,g&&(O=T*(v=Math.cos(g))+b*(y=Math.sin(g)),P=k*v+M*y,b=b*v-T*y,M=M*v-k*y,T=O,k=P),h&&359.9<Math.abs(h)+Math.abs(u)&&(h=u=0,l=180-l),s=ia(Math.sqrt(T*T+b*b+w*w)),o=ia(Math.sqrt(M*M+z*z)),g=ar(k,M),f=2e-4<Math.abs(g)?g*ir:0,d=E?1/(E<0?-E:E):0),r.svg&&(O=t.getAttribute("transform"),r.forceCSS=t.setAttribute("transform","")||!ge(Nd(t,lr)),O&&t.setAttribute("transform",O))),90<Math.abs(f)&&Math.abs(f)<270&&(I?(s*=-1,f+=u<=0?180:-180,u+=u<=0?180:-180):(o*=-1,f+=f<=0?180:-180)),e=e||r.uncache,r.x=i-((r.xPercent=i&&(!e&&r.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-i)?-50:0)))?t.offsetWidth*r.xPercent/100:0)+"px",r.y=n-((r.yPercent=n&&(!e&&r.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-n)?-50:0)))?t.offsetHeight*r.yPercent/100:0)+"px",r.z=a+"px",r.scaleX=ia(s),r.scaleY=ia(o),r.rotation=ia(u)+B,r.rotationX=ia(h)+B,r.rotationY=ia(l)+B,r.skewX=f+B,r.skewY=c+B,r.transformPerspective=d+"px",(r.zOrigin=parseFloat(Y.split(" ")[2])||0)&&(F[fr]=wr(Y)),r.xOffset=r.yOffset=0,r.force3D=j.force3D,r.renderTransform=r.svg?Cr:Ie?Pr:xr,r.uncache=0,r},wr=function _firstTwoOnly(t){return(t=t.split(" "))[0]+" "+t[1]},xr=function _renderNon3DTransforms(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,Pr(t,e)},kr="0deg",Mr="0px",Or=") ",Pr=function _renderCSSTransforms(t,e){var r=e||this,i=r.xPercent,n=r.yPercent,a=r.x,s=r.y,o=r.z,u=r.rotation,h=r.rotationY,l=r.rotationX,f=r.skewX,c=r.skewY,d=r.scaleX,p=r.scaleY,_=r.transformPerspective,m=r.force3D,g=r.target,v=r.zOrigin,y="",T="auto"===m&&t&&1!==t||!0===m;if(v&&(l!==kr||h!==kr)){var b,w=parseFloat(h)*nr,x=Math.sin(w),k=Math.cos(w);w=parseFloat(l)*nr,b=Math.cos(w),a=me(g,a,x*b*-v),s=me(g,s,-Math.sin(w)*-v),o=me(g,o,k*b*-v+v)}_!==Mr&&(y+="perspective("+_+Or),(i||n)&&(y+="translate("+i+"%, "+n+"%) "),!T&&a===Mr&&s===Mr&&o===Mr||(y+=o!==Mr||T?"translate3d("+a+", "+s+", "+o+") ":"translate("+a+", "+s+Or),u!==kr&&(y+="rotate("+u+Or),h!==kr&&(y+="rotateY("+h+Or),l!==kr&&(y+="rotateX("+l+Or),f===kr&&c===kr||(y+="skew("+f+", "+c+Or),1===d&&1===p||(y+="scale("+d+", "+p+Or),g.style[lr]=y||"translate(0, 0)"},Cr=function _renderSVGTransforms(t,e){var r,i,n,a,s,o=e||this,u=o.xPercent,h=o.yPercent,l=o.x,f=o.y,c=o.rotation,d=o.skewX,p=o.skewY,_=o.scaleX,m=o.scaleY,g=o.target,v=o.xOrigin,y=o.yOrigin,T=o.xOffset,b=o.yOffset,w=o.forceCSS,x=parseFloat(l),k=parseFloat(f);c=parseFloat(c),d=parseFloat(d),(p=parseFloat(p))&&(d+=p=parseFloat(p),c+=p),c||d?(c*=nr,d*=nr,r=Math.cos(c)*_,i=Math.sin(c)*_,n=Math.sin(c-d)*-m,a=Math.cos(c-d)*m,d&&(p*=nr,s=Math.tan(d-p),n*=s=Math.sqrt(1+s*s),a*=s,p&&(s=Math.tan(p),r*=s=Math.sqrt(1+s*s),i*=s)),r=ia(r),i=ia(i),n=ia(n),a=ia(a)):(r=_,a=m,i=n=0),(x&&!~(l+"").indexOf("px")||k&&!~(f+"").indexOf("px"))&&(x=Zd(g,"x",l,"px"),k=Zd(g,"y",f,"px")),(v||y||T||b)&&(x=ia(x+v-(v*r+y*n)+T),k=ia(k+y-(v*i+y*a)+b)),(u||h)&&(s=g.getBBox(),x=ia(x+u/100*s.width),k=ia(k+h/100*s.height)),s="matrix("+r+","+i+","+n+","+a+","+x+","+k+")",g.setAttribute("transform",s),w&&(g.style[lr]=s)};ha("padding,margin,Width,Radius",function(e,r){var t="Right",i="Bottom",n="Left",o=(r<3?["Top",t,i,n]:["Top"+n,"Top"+t,i+t,i+n]).map(function(t){return r<2?e+t:"border"+t+e});vr[1<r?"border"+e:e]=function(e,t,r,i,n){var a,s;if(arguments.length<4)return a=o.map(function(t){return mr(e,t,r)}),5===(s=a.join(" ")).split(a[0]).length?a[0]:s;a=(i+"").split(" "),s={},o.forEach(function(t,e){return s[t]=a[e]=a[e]||a[(e-1)/2|0]}),e.init(t,s,n)}});var Ar,Sr,Rr,Dr={name:"css",register:Qd,targetTest:function targetTest(t){return t.style&&t.nodeType},init:function init(t,e,i,n,a){var s,o,u,h,l,f,c,d,p,_,m,g,v,y,T,b,w=this._props,x=t.style,k=i.vars.startAt;for(c in De||Qd(),this.styles=this.styles||Kd(t),b=this.styles.props,this.tween=i,e)if("autoRound"!==c&&(o=e[c],!pt[c]||!_b(c,e,i,n,t,a)))if(l=typeof o,f=vr[c],"function"===l&&(l=typeof(o=o.call(i,n,t,a))),"string"===l&&~o.indexOf("random(")&&(o=ob(o)),f)f(this,t,c,o,i)&&(T=1);else if("--"===c.substr(0,2))s=(getComputedStyle(t).getPropertyValue(c)+"").trim(),o+="",Rt.lastIndex=0,Rt.test(s)||(d=Ya(s),p=Ya(o)),p?d!==p&&(s=Zd(t,c,s,p)+p):d&&(o+=d),this.add(x,"setProperty",s,o,n,a,0,0,c),w.push(c),b.push(c,0,x[c]);else if("undefined"!==l){if(k&&c in k?(s="function"==typeof k[c]?k[c].call(i,n,t,a):k[c],r(s)&&~s.indexOf("random(")&&(s=ob(s)),Ya(s+"")||(s+=j.units[c]||Ya(mr(t,c))||""),"="===(s+"").charAt(1)&&(s=mr(t,c))):s=mr(t,c),h=parseFloat(s),(_="string"===l&&"="===o.charAt(1)&&o.substr(0,2))&&(o=o.substr(2)),u=parseFloat(o),c in hr&&("autoAlpha"===c&&(1===h&&"hidden"===mr(t,"visibility")&&u&&(h=0),b.push("visibility",0,x.visibility),Wd(this,x,"visibility",h?"inherit":"hidden",u?"inherit":"hidden",!u)),"scale"!==c&&"transform"!==c&&~(c=hr[c]).indexOf(",")&&(c=c.split(",")[0])),m=c in rr)if(this.styles.save(c),g||((v=t._gsap).renderTransform&&!e.parseTransform||br(t,e.parseTransform),y=!1!==e.smoothOrigin&&v.smooth,(g=this._pt=new pe(this._pt,x,lr,0,1,v.renderTransform,v,0,-1)).dep=1),"scale"===c)this._pt=new pe(this._pt,v,"scaleY",h,(_?ka(h,_+u):u)-h||0,td),this._pt.u=0,w.push("scaleY",c),c+="X";else{if("transformOrigin"===c){b.push(fr,0,x[fr]),o=be(o),v.svg?je(t,o,0,y,0,this):((p=parseFloat(o.split(" ")[2])||0)!==v.zOrigin&&Wd(this,v,"zOrigin",v.zOrigin,p),Wd(this,x,c,wr(s),wr(o)));continue}if("svgOrigin"===c){je(t,o,1,y,0,this);continue}if(c in Tr){te(this,v,c,h,_?ka(h,_+o):o);continue}if("smoothOrigin"===c){Wd(this,v,"smooth",v.smooth,o);continue}if("force3D"===c){v[c]=o;continue}if("transform"===c){ve(this,o,t);continue}}else c in x||(c=dr(c)||c);if(m||(u||0===u)&&(h||0===h)&&!ur.test(o)&&c in x)u=u||0,(d=(s+"").substr((h+"").length))!==(p=Ya(o)||(c in j.units?j.units[c]:d))&&(h=Zd(t,c,s,p)),this._pt=new pe(this._pt,m?v:x,c,h,(_?ka(h,_+u):u)-h,m||"px"!==p&&"zIndex"!==c||!1===e.autoRound?td:wd),this._pt.u=p||0,d!==p&&"%"!==p&&(this._pt.b=s,this._pt.r=vd);else if(c in x)_d.call(this,t,c,s,_?_+o:o);else{if(!(c in t)){Q(c,o);continue}this.add(t,c,s||t[c],_?_+o:o,n,a)}m||(c in x?b.push(c,0,x[c]):b.push(c,1,s||t[c])),w.push(c)}T&&de(this)},render:function render(t,e){if(e.tween._time||!Fe())for(var r=e._pt;r;)r.r(t,r.d),r=r._next;else e.styles.revert()},get:mr,aliases:hr,getSetter:function getSetter(t,e,r){var i=hr[e];return i&&i.indexOf(",")<0&&(e=i),e in rr&&e!==fr&&(t._gsap.x||mr(t,"x"))?r&&ze===r?"scale"===e?Cd:Bd:(ze=r||{})&&("scale"===e?Dd:Ed):t.style&&!u(t.style[e])?zd:~e.indexOf("-")?Ad:re(t,e)},core:{_removeProperty:Vd,_getMatrix:ie}};Ce.utils.checkPrefix=dr,Ce.core.getStyleSaver=Kd,Rr=ha((Ar="x,y,z,scale,scaleX,scaleY,xPercent,yPercent")+","+(Sr="rotation,rotationX,rotationY,skewX,skewY")+",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective",function(t){rr[t]=1}),ha(Sr,function(t){j.units[t]="deg",Tr[t]=1}),hr[Rr[13]]=Ar+","+Sr,ha("0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY",function(t){var e=t.split(":");hr[e[1]]=Rr[e[0]]}),ha("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(t){j.units[t]="px"}),Ce.registerPlugin(Dr);var Er=Ce.registerPlugin(Dr)||Ce,zr=Er.core.Tween;e.Back=Ze,e.Bounce=Je,e.CSSPlugin=Dr,e.Circ=er,e.Cubic=We,e.Elastic=Ke,e.Expo=tr,e.Linear=Ue,e.Power0=Be,e.Power1=Le,e.Power2=Ye,e.Power3=Ne,e.Power4=qe,e.Quad=Ve,e.Quart=Xe,e.Quint=He,e.Sine=$e,e.SteppedEase=Ge,e.Strong=Qe,e.TimelineLite=Ut,e.TimelineMax=Ut,e.TweenLite=Gt,e.TweenMax=zr,e.default=Er,e.gsap=Er;if (typeof(window)==="undefined"||window!==e){Object.defineProperty(e,"__esModule",{value:!0})} else {delete e.default}});


/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(C,e){"use strict";var t=[],r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply([],e)},u=t.push,i=t.indexOf,n={},o=n.toString,v=n.hasOwnProperty,a=v.toString,l=a.call(Object),y={},m=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType&&"function"!=typeof e.item},x=function(e){return null!=e&&e===e.window},E=C.document,c={type:!0,src:!0,nonce:!0,noModule:!0};function b(e,t,n){var r,i,o=(n=n||E).createElement("script");if(o.text=e,t)for(r in c)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o)}function w(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[o.call(e)]||"object":typeof e}var f="3.6.0",S=function(e,t){return new S.fn.init(e,t)};function p(e){var t=!!e&&"length"in e&&e.length,n=w(e);return!m(e)&&!x(e)&&("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e)}S.fn=S.prototype={jquery:f,constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)},map:function(n){return this.pushStack(S.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return this.pushStack(s.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(S.grep(this,function(e,t){return(t+1)%2}))},odd:function(){return this.pushStack(S.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(0<=n&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:u,sort:t.sort,splice:t.splice},S.extend=S.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||m(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(S.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||S.isPlainObject(n)?n:{},i=!1,a[t]=S.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},S.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==o.call(e))&&(!(t=r(e))||"function"==typeof(n=v.call(t,"constructor")&&t.constructor)&&a.call(n)===l)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t,n){b(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,r=0;if(p(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},makeArray:function(e,t){var n=t||[];return null!=e&&(p(Object(e))?S.merge(n,"string"==typeof e?[e]:e):u.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:i.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,i,o=0,a=[];if(p(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&a.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&a.push(i);return g(a)},guid:1,support:y}),"function"==typeof Symbol&&(S.fn[Symbol.iterator]=t[Symbol.iterator]),S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){n["[object "+t+"]"]=t.toLowerCase()});var d=function(n){var e,d,b,o,i,h,f,g,w,u,l,T,C,a,E,v,s,c,y,S="sizzle"+1*new Date,p=n.document,k=0,r=0,m=ue(),x=ue(),A=ue(),N=ue(),j=function(e,t){return e===t&&(l=!0),0},D={}.hasOwnProperty,t=[],q=t.pop,L=t.push,H=t.push,O=t.slice,P=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",I="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",W="\\["+M+"*("+I+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+I+"))|)"+M+"*\\]",F=":("+I+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+W+")*)|.*)\\)|)",B=new RegExp(M+"+","g"),$=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=new RegExp("^"+M+"*,"+M+"*"),z=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp(M+"|>"),X=new RegExp(F),V=new RegExp("^"+I+"$"),G={ID:new RegExp("^#("+I+")"),CLASS:new RegExp("^\\.("+I+")"),TAG:new RegExp("^("+I+"|[*])"),ATTR:new RegExp("^"+W),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+R+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/HTML$/i,Q=/^(?:input|select|textarea|button)$/i,J=/^h\d$/i,K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){T()},ae=be(function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{H.apply(t=O.call(p.childNodes),p.childNodes),t[p.childNodes.length].nodeType}catch(e){H={apply:t.length?function(e,t){L.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function se(t,e,n,r){var i,o,a,s,u,l,c,f=e&&e.ownerDocument,p=e?e.nodeType:9;if(n=n||[],"string"!=typeof t||!t||1!==p&&9!==p&&11!==p)return n;if(!r&&(T(e),e=e||C,E)){if(11!==p&&(u=Z.exec(t)))if(i=u[1]){if(9===p){if(!(a=e.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(f&&(a=f.getElementById(i))&&y(e,a)&&a.id===i)return n.push(a),n}else{if(u[2])return H.apply(n,e.getElementsByTagName(t)),n;if((i=u[3])&&d.getElementsByClassName&&e.getElementsByClassName)return H.apply(n,e.getElementsByClassName(i)),n}if(d.qsa&&!N[t+" "]&&(!v||!v.test(t))&&(1!==p||"object"!==e.nodeName.toLowerCase())){if(c=t,f=e,1===p&&(U.test(t)||z.test(t))){(f=ee.test(t)&&ye(e.parentNode)||e)===e&&d.scope||((s=e.getAttribute("id"))?s=s.replace(re,ie):e.setAttribute("id",s=S)),o=(l=h(t)).length;while(o--)l[o]=(s?"#"+s:":scope")+" "+xe(l[o]);c=l.join(",")}try{return H.apply(n,f.querySelectorAll(c)),n}catch(e){N(t,!0)}finally{s===S&&e.removeAttribute("id")}}}return g(t.replace($,"$1"),e,n,r)}function ue(){var r=[];return function e(t,n){return r.push(t+" ")>b.cacheLength&&delete e[r.shift()],e[t+" "]=n}}function le(e){return e[S]=!0,e}function ce(e){var t=C.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function fe(e,t){var n=e.split("|"),r=n.length;while(r--)b.attrHandle[n[r]]=t}function pe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function de(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}function he(n){return function(e){var t=e.nodeName.toLowerCase();return("input"===t||"button"===t)&&e.type===n}}function ge(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&ae(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function ve(a){return le(function(o){return o=+o,le(function(e,t){var n,r=a([],e.length,o),i=r.length;while(i--)e[n=r[i]]&&(e[n]=!(t[n]=e[n]))})})}function ye(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}for(e in d=se.support={},i=se.isXML=function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return!Y.test(t||n&&n.nodeName||"HTML")},T=se.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:p;return r!=C&&9===r.nodeType&&r.documentElement&&(a=(C=r).documentElement,E=!i(C),p!=C&&(n=C.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",oe,!1):n.attachEvent&&n.attachEvent("onunload",oe)),d.scope=ce(function(e){return a.appendChild(e).appendChild(C.createElement("div")),"undefined"!=typeof e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),d.attributes=ce(function(e){return e.className="i",!e.getAttribute("className")}),d.getElementsByTagName=ce(function(e){return e.appendChild(C.createComment("")),!e.getElementsByTagName("*").length}),d.getElementsByClassName=K.test(C.getElementsByClassName),d.getById=ce(function(e){return a.appendChild(e).id=S,!C.getElementsByName||!C.getElementsByName(S).length}),d.getById?(b.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n=t.getElementById(e);return n?[n]:[]}}):(b.filter.ID=function(e){var n=e.replace(te,ne);return function(e){var t="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return t&&t.value===n}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),b.find.TAG=d.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):d.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},b.find.CLASS=d.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&E)return t.getElementsByClassName(e)},s=[],v=[],(d.qsa=K.test(C.querySelectorAll))&&(ce(function(e){var t;a.appendChild(e).innerHTML="<a id='"+S+"'></a><select id='"+S+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&v.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||v.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll("[id~="+S+"-]").length||v.push("~="),(t=C.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||v.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||v.push(":checked"),e.querySelectorAll("a#"+S+"+*").length||v.push(".#.+[+~]"),e.querySelectorAll("\\\f"),v.push("[\\r\\n\\f]")}),ce(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=C.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&v.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&v.push(":enabled",":disabled"),a.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&v.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),v.push(",.*:")})),(d.matchesSelector=K.test(c=a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.msMatchesSelector))&&ce(function(e){d.disconnectedMatch=c.call(e,"*"),c.call(e,"[s!='']:x"),s.push("!=",F)}),v=v.length&&new RegExp(v.join("|")),s=s.length&&new RegExp(s.join("|")),t=K.test(a.compareDocumentPosition),y=t||K.test(a.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},j=t?function(e,t){if(e===t)return l=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!d.sortDetached&&t.compareDocumentPosition(e)===n?e==C||e.ownerDocument==p&&y(p,e)?-1:t==C||t.ownerDocument==p&&y(p,t)?1:u?P(u,e)-P(u,t):0:4&n?-1:1)}:function(e,t){if(e===t)return l=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e==C?-1:t==C?1:i?-1:o?1:u?P(u,e)-P(u,t):0;if(i===o)return pe(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?pe(a[r],s[r]):a[r]==p?-1:s[r]==p?1:0}),C},se.matches=function(e,t){return se(e,null,null,t)},se.matchesSelector=function(e,t){if(T(e),d.matchesSelector&&E&&!N[t+" "]&&(!s||!s.test(t))&&(!v||!v.test(t)))try{var n=c.call(e,t);if(n||d.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){N(t,!0)}return 0<se(t,C,null,[e]).length},se.contains=function(e,t){return(e.ownerDocument||e)!=C&&T(e),y(e,t)},se.attr=function(e,t){(e.ownerDocument||e)!=C&&T(e);var n=b.attrHandle[t.toLowerCase()],r=n&&D.call(b.attrHandle,t.toLowerCase())?n(e,t,!E):void 0;return void 0!==r?r:d.attributes||!E?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},se.escape=function(e){return(e+"").replace(re,ie)},se.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},se.uniqueSort=function(e){var t,n=[],r=0,i=0;if(l=!d.detectDuplicates,u=!d.sortStable&&e.slice(0),e.sort(j),l){while(t=e[i++])t===e[i]&&(r=n.push(i));while(r--)e.splice(n[r],1)}return u=null,e},o=se.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else while(t=e[r++])n+=o(t);return n},(b=se.selectors={cacheLength:50,createPseudo:le,match:G,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||se.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&se.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return G.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=h(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=m[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&m(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(n,r,i){return function(e){var t=se.attr(e,n);return null==t?"!="===r:!r||(t+="","="===r?t===i:"!="===r?t!==i:"^="===r?i&&0===t.indexOf(i):"*="===r?i&&-1<t.indexOf(i):"$="===r?i&&t.slice(-i.length)===i:"~="===r?-1<(" "+t.replace(B," ")+" ").indexOf(i):"|="===r&&(t===i||t.slice(0,i.length+1)===i+"-"))}},CHILD:function(h,e,t,g,v){var y="nth"!==h.slice(0,3),m="last"!==h.slice(-4),x="of-type"===e;return 1===g&&0===v?function(e){return!!e.parentNode}:function(e,t,n){var r,i,o,a,s,u,l=y!==m?"nextSibling":"previousSibling",c=e.parentNode,f=x&&e.nodeName.toLowerCase(),p=!n&&!x,d=!1;if(c){if(y){while(l){a=e;while(a=a[l])if(x?a.nodeName.toLowerCase()===f:1===a.nodeType)return!1;u=l="only"===h&&!u&&"nextSibling"}return!0}if(u=[m?c.firstChild:c.lastChild],m&&p){d=(s=(r=(i=(o=(a=c)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1])&&r[2],a=s&&c.childNodes[s];while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if(1===a.nodeType&&++d&&a===e){i[h]=[k,s,d];break}}else if(p&&(d=s=(r=(i=(o=(a=e)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1]),!1===d)while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if((x?a.nodeName.toLowerCase()===f:1===a.nodeType)&&++d&&(p&&((i=(o=a[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]=[k,d]),a===e))break;return(d-=v)===g||d%g==0&&0<=d/g}}},PSEUDO:function(e,o){var t,a=b.pseudos[e]||b.setFilters[e.toLowerCase()]||se.error("unsupported pseudo: "+e);return a[S]?a(o):1<a.length?(t=[e,e,"",o],b.setFilters.hasOwnProperty(e.toLowerCase())?le(function(e,t){var n,r=a(e,o),i=r.length;while(i--)e[n=P(e,r[i])]=!(t[n]=r[i])}):function(e){return a(e,0,t)}):a}},pseudos:{not:le(function(e){var r=[],i=[],s=f(e.replace($,"$1"));return s[S]?le(function(e,t,n,r){var i,o=s(e,null,r,[]),a=e.length;while(a--)(i=o[a])&&(e[a]=!(t[a]=i))}):function(e,t,n){return r[0]=e,s(r,null,n,i),r[0]=null,!i.pop()}}),has:le(function(t){return function(e){return 0<se(t,e).length}}),contains:le(function(t){return t=t.replace(te,ne),function(e){return-1<(e.textContent||o(e)).indexOf(t)}}),lang:le(function(n){return V.test(n||"")||se.error("unsupported lang: "+n),n=n.replace(te,ne).toLowerCase(),function(e){var t;do{if(t=E?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(t=t.toLowerCase())===n||0===t.indexOf(n+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var t=n.location&&n.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===a},focus:function(e){return e===C.activeElement&&(!C.hasFocus||C.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:ge(!1),disabled:ge(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!b.pseudos.empty(e)},header:function(e){return J.test(e.nodeName)},input:function(e){return Q.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:ve(function(){return[0]}),last:ve(function(e,t){return[t-1]}),eq:ve(function(e,t,n){return[n<0?n+t:n]}),even:ve(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:ve(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:ve(function(e,t,n){for(var r=n<0?n+t:t<n?t:n;0<=--r;)e.push(r);return e}),gt:ve(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=b.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[e]=de(e);for(e in{submit:!0,reset:!0})b.pseudos[e]=he(e);function me(){}function xe(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function be(s,e,t){var u=e.dir,l=e.next,c=l||u,f=t&&"parentNode"===c,p=r++;return e.first?function(e,t,n){while(e=e[u])if(1===e.nodeType||f)return s(e,t,n);return!1}:function(e,t,n){var r,i,o,a=[k,p];if(n){while(e=e[u])if((1===e.nodeType||f)&&s(e,t,n))return!0}else while(e=e[u])if(1===e.nodeType||f)if(i=(o=e[S]||(e[S]={}))[e.uniqueID]||(o[e.uniqueID]={}),l&&l===e.nodeName.toLowerCase())e=e[u]||e;else{if((r=i[c])&&r[0]===k&&r[1]===p)return a[2]=r[2];if((i[c]=a)[2]=s(e,t,n))return!0}return!1}}function we(i){return 1<i.length?function(e,t,n){var r=i.length;while(r--)if(!i[r](e,t,n))return!1;return!0}:i[0]}function Te(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Ce(d,h,g,v,y,e){return v&&!v[S]&&(v=Ce(v)),y&&!y[S]&&(y=Ce(y,e)),le(function(e,t,n,r){var i,o,a,s=[],u=[],l=t.length,c=e||function(e,t,n){for(var r=0,i=t.length;r<i;r++)se(e,t[r],n);return n}(h||"*",n.nodeType?[n]:n,[]),f=!d||!e&&h?c:Te(c,s,d,n,r),p=g?y||(e?d:l||v)?[]:t:f;if(g&&g(f,p,n,r),v){i=Te(p,u),v(i,[],n,r),o=i.length;while(o--)(a=i[o])&&(p[u[o]]=!(f[u[o]]=a))}if(e){if(y||d){if(y){i=[],o=p.length;while(o--)(a=p[o])&&i.push(f[o]=a);y(null,p=[],i,r)}o=p.length;while(o--)(a=p[o])&&-1<(i=y?P(e,a):s[o])&&(e[i]=!(t[i]=a))}}else p=Te(p===t?p.splice(l,p.length):p),y?y(null,t,p,r):H.apply(t,p)})}function Ee(e){for(var i,t,n,r=e.length,o=b.relative[e[0].type],a=o||b.relative[" "],s=o?1:0,u=be(function(e){return e===i},a,!0),l=be(function(e){return-1<P(i,e)},a,!0),c=[function(e,t,n){var r=!o&&(n||t!==w)||((i=t).nodeType?u(e,t,n):l(e,t,n));return i=null,r}];s<r;s++)if(t=b.relative[e[s].type])c=[be(we(c),t)];else{if((t=b.filter[e[s].type].apply(null,e[s].matches))[S]){for(n=++s;n<r;n++)if(b.relative[e[n].type])break;return Ce(1<s&&we(c),1<s&&xe(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace($,"$1"),t,s<n&&Ee(e.slice(s,n)),n<r&&Ee(e=e.slice(n)),n<r&&xe(e))}c.push(t)}return we(c)}return me.prototype=b.filters=b.pseudos,b.setFilters=new me,h=se.tokenize=function(e,t){var n,r,i,o,a,s,u,l=x[e+" "];if(l)return t?0:l.slice(0);a=e,s=[],u=b.preFilter;while(a){for(o in n&&!(r=_.exec(a))||(r&&(a=a.slice(r[0].length)||a),s.push(i=[])),n=!1,(r=z.exec(a))&&(n=r.shift(),i.push({value:n,type:r[0].replace($," ")}),a=a.slice(n.length)),b.filter)!(r=G[o].exec(a))||u[o]&&!(r=u[o](r))||(n=r.shift(),i.push({value:n,type:o,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?se.error(e):x(e,s).slice(0)},f=se.compile=function(e,t){var n,v,y,m,x,r,i=[],o=[],a=A[e+" "];if(!a){t||(t=h(e)),n=t.length;while(n--)(a=Ee(t[n]))[S]?i.push(a):o.push(a);(a=A(e,(v=o,m=0<(y=i).length,x=0<v.length,r=function(e,t,n,r,i){var o,a,s,u=0,l="0",c=e&&[],f=[],p=w,d=e||x&&b.find.TAG("*",i),h=k+=null==p?1:Math.random()||.1,g=d.length;for(i&&(w=t==C||t||i);l!==g&&null!=(o=d[l]);l++){if(x&&o){a=0,t||o.ownerDocument==C||(T(o),n=!E);while(s=v[a++])if(s(o,t||C,n)){r.push(o);break}i&&(k=h)}m&&((o=!s&&o)&&u--,e&&c.push(o))}if(u+=l,m&&l!==u){a=0;while(s=y[a++])s(c,f,t,n);if(e){if(0<u)while(l--)c[l]||f[l]||(f[l]=q.call(r));f=Te(f)}H.apply(r,f),i&&!e&&0<f.length&&1<u+y.length&&se.uniqueSort(r)}return i&&(k=h,w=p),c},m?le(r):r))).selector=e}return a},g=se.select=function(e,t,n,r){var i,o,a,s,u,l="function"==typeof e&&e,c=!r&&h(e=l.selector||e);if(n=n||[],1===c.length){if(2<(o=c[0]=c[0].slice(0)).length&&"ID"===(a=o[0]).type&&9===t.nodeType&&E&&b.relative[o[1].type]){if(!(t=(b.find.ID(a.matches[0].replace(te,ne),t)||[])[0]))return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}i=G.needsContext.test(e)?0:o.length;while(i--){if(a=o[i],b.relative[s=a.type])break;if((u=b.find[s])&&(r=u(a.matches[0].replace(te,ne),ee.test(o[0].type)&&ye(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&xe(o)))return H.apply(n,r),n;break}}}return(l||f(e,c))(r,t,!E,n,!t||ee.test(e)&&ye(t.parentNode)||t),n},d.sortStable=S.split("").sort(j).join("")===S,d.detectDuplicates=!!l,T(),d.sortDetached=ce(function(e){return 1&e.compareDocumentPosition(C.createElement("fieldset"))}),ce(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),d.attributes&&ce(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ce(function(e){return null==e.getAttribute("disabled")})||fe(R,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),se}(C);S.find=d,S.expr=d.selectors,S.expr[":"]=S.expr.pseudos,S.uniqueSort=S.unique=d.uniqueSort,S.text=d.getText,S.isXMLDoc=d.isXML,S.contains=d.contains,S.escapeSelector=d.escape;var h=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&S(e).is(n))break;r.push(e)}return r},T=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},k=S.expr.match.needsContext;function A(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var N=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,n,r){return m(n)?S.grep(e,function(e,t){return!!n.call(e,t,e)!==r}):n.nodeType?S.grep(e,function(e){return e===n!==r}):"string"!=typeof n?S.grep(e,function(e){return-1<i.call(n,e)!==r}):S.filter(n,e,r)}S.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?S.find.matchesSelector(r,e)?[r]:[]:S.find.matches(e,S.grep(t,function(e){return 1===e.nodeType}))},S.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(S(e).filter(function(){for(t=0;t<r;t++)if(S.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)S.find(e,i[t],n);return 1<r?S.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&k.test(e)?S(e):e||[],!1).length}});var D,q=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(S.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||D,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&3<=e.length?[null,e,null]:q.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof S?t[0]:t,S.merge(this,S.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:E,!0)),N.test(r[1])&&S.isPlainObject(t))for(r in t)m(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(i=E.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):m(e)?void 0!==n.ready?n.ready(e):e(S):S.makeArray(e,this)}).prototype=S.fn,D=S(E);var L=/^(?:parents|prev(?:Until|All))/,H={children:!0,contents:!0,next:!0,prev:!0};function O(e,t){while((e=e[t])&&1!==e.nodeType);return e}S.fn.extend({has:function(e){var t=S(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(S.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&S(e);if(!k.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?-1<a.index(n):1===n.nodeType&&S.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(1<o.length?S.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?i.call(S(e),this[0]):i.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(S.uniqueSort(S.merge(this.get(),S(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),S.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return h(e,"parentNode")},parentsUntil:function(e,t,n){return h(e,"parentNode",n)},next:function(e){return O(e,"nextSibling")},prev:function(e){return O(e,"previousSibling")},nextAll:function(e){return h(e,"nextSibling")},prevAll:function(e){return h(e,"previousSibling")},nextUntil:function(e,t,n){return h(e,"nextSibling",n)},prevUntil:function(e,t,n){return h(e,"previousSibling",n)},siblings:function(e){return T((e.parentNode||{}).firstChild,e)},children:function(e){return T(e.firstChild)},contents:function(e){return null!=e.contentDocument&&r(e.contentDocument)?e.contentDocument:(A(e,"template")&&(e=e.content||e),S.merge([],e.childNodes))}},function(r,i){S.fn[r]=function(e,t){var n=S.map(this,i,e);return"Until"!==r.slice(-5)&&(t=e),t&&"string"==typeof t&&(n=S.filter(t,n)),1<this.length&&(H[r]||S.uniqueSort(n),L.test(r)&&n.reverse()),this.pushStack(n)}});var P=/[^\x20\t\r\n\f]+/g;function R(e){return e}function M(e){throw e}function I(e,t,n,r){var i;try{e&&m(i=e.promise)?i.call(e).done(t).fail(n):e&&m(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}S.Callbacks=function(r){var e,n;r="string"==typeof r?(e=r,n={},S.each(e.match(P)||[],function(e,t){n[t]=!0}),n):S.extend({},r);var i,t,o,a,s=[],u=[],l=-1,c=function(){for(a=a||r.once,o=i=!0;u.length;l=-1){t=u.shift();while(++l<s.length)!1===s[l].apply(t[0],t[1])&&r.stopOnFalse&&(l=s.length,t=!1)}r.memory||(t=!1),i=!1,a&&(s=t?[]:"")},f={add:function(){return s&&(t&&!i&&(l=s.length-1,u.push(t)),function n(e){S.each(e,function(e,t){m(t)?r.unique&&f.has(t)||s.push(t):t&&t.length&&"string"!==w(t)&&n(t)})}(arguments),t&&!i&&c()),this},remove:function(){return S.each(arguments,function(e,t){var n;while(-1<(n=S.inArray(t,s,n)))s.splice(n,1),n<=l&&l--}),this},has:function(e){return e?-1<S.inArray(e,s):0<s.length},empty:function(){return s&&(s=[]),this},disable:function(){return a=u=[],s=t="",this},disabled:function(){return!s},lock:function(){return a=u=[],t||i||(s=t=""),this},locked:function(){return!!a},fireWith:function(e,t){return a||(t=[e,(t=t||[]).slice?t.slice():t],u.push(t),i||c()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!o}};return f},S.extend({Deferred:function(e){var o=[["notify","progress",S.Callbacks("memory"),S.Callbacks("memory"),2],["resolve","done",S.Callbacks("once memory"),S.Callbacks("once memory"),0,"resolved"],["reject","fail",S.Callbacks("once memory"),S.Callbacks("once memory"),1,"rejected"]],i="pending",a={state:function(){return i},always:function(){return s.done(arguments).fail(arguments),this},"catch":function(e){return a.then(null,e)},pipe:function(){var i=arguments;return S.Deferred(function(r){S.each(o,function(e,t){var n=m(i[t[4]])&&i[t[4]];s[t[1]](function(){var e=n&&n.apply(this,arguments);e&&m(e.promise)?e.promise().progress(r.notify).done(r.resolve).fail(r.reject):r[t[0]+"With"](this,n?[e]:arguments)})}),i=null}).promise()},then:function(t,n,r){var u=0;function l(i,o,a,s){return function(){var n=this,r=arguments,e=function(){var e,t;if(!(i<u)){if((e=a.apply(n,r))===o.promise())throw new TypeError("Thenable self-resolution");t=e&&("object"==typeof e||"function"==typeof e)&&e.then,m(t)?s?t.call(e,l(u,o,R,s),l(u,o,M,s)):(u++,t.call(e,l(u,o,R,s),l(u,o,M,s),l(u,o,R,o.notifyWith))):(a!==R&&(n=void 0,r=[e]),(s||o.resolveWith)(n,r))}},t=s?e:function(){try{e()}catch(e){S.Deferred.exceptionHook&&S.Deferred.exceptionHook(e,t.stackTrace),u<=i+1&&(a!==M&&(n=void 0,r=[e]),o.rejectWith(n,r))}};i?t():(S.Deferred.getStackHook&&(t.stackTrace=S.Deferred.getStackHook()),C.setTimeout(t))}}return S.Deferred(function(e){o[0][3].add(l(0,e,m(r)?r:R,e.notifyWith)),o[1][3].add(l(0,e,m(t)?t:R)),o[2][3].add(l(0,e,m(n)?n:M))}).promise()},promise:function(e){return null!=e?S.extend(e,a):a}},s={};return S.each(o,function(e,t){var n=t[2],r=t[5];a[t[1]]=n.add,r&&n.add(function(){i=r},o[3-e][2].disable,o[3-e][3].disable,o[0][2].lock,o[0][3].lock),n.add(t[3].fire),s[t[0]]=function(){return s[t[0]+"With"](this===s?void 0:this,arguments),this},s[t[0]+"With"]=n.fireWith}),a.promise(s),e&&e.call(s,s),s},when:function(e){var n=arguments.length,t=n,r=Array(t),i=s.call(arguments),o=S.Deferred(),a=function(t){return function(e){r[t]=this,i[t]=1<arguments.length?s.call(arguments):e,--n||o.resolveWith(r,i)}};if(n<=1&&(I(e,o.done(a(t)).resolve,o.reject,!n),"pending"===o.state()||m(i[t]&&i[t].then)))return o.then();while(t--)I(i[t],a(t),o.reject);return o.promise()}});var W=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;S.Deferred.exceptionHook=function(e,t){C.console&&C.console.warn&&e&&W.test(e.name)&&C.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},S.readyException=function(e){C.setTimeout(function(){throw e})};var F=S.Deferred();function B(){E.removeEventListener("DOMContentLoaded",B),C.removeEventListener("load",B),S.ready()}S.fn.ready=function(e){return F.then(e)["catch"](function(e){S.readyException(e)}),this},S.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--S.readyWait:S.isReady)||(S.isReady=!0)!==e&&0<--S.readyWait||F.resolveWith(E,[S])}}),S.ready.then=F.then,"complete"===E.readyState||"loading"!==E.readyState&&!E.documentElement.doScroll?C.setTimeout(S.ready):(E.addEventListener("DOMContentLoaded",B),C.addEventListener("load",B));var $=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===w(n))for(s in i=!0,n)$(e,t,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,m(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(S(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},_=/^-ms-/,z=/-([a-z])/g;function U(e,t){return t.toUpperCase()}function X(e){return e.replace(_,"ms-").replace(z,U)}var V=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function G(){this.expando=S.expando+G.uid++}G.uid=1,G.prototype={cache:function(e){var t=e[this.expando];return t||(t={},V(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[X(t)]=n;else for(r in t)i[X(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][X(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(X):(t=X(t))in r?[t]:t.match(P)||[]).length;while(n--)delete r[t[n]]}(void 0===t||S.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!S.isEmptyObject(t)}};var Y=new G,Q=new G,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,K=/[A-Z]/g;function Z(e,t,n){var r,i;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(K,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===(i=n)||"false"!==i&&("null"===i?null:i===+i+""?+i:J.test(i)?JSON.parse(i):i)}catch(e){}Q.set(e,t,n)}else n=void 0;return n}S.extend({hasData:function(e){return Q.hasData(e)||Y.hasData(e)},data:function(e,t,n){return Q.access(e,t,n)},removeData:function(e,t){Q.remove(e,t)},_data:function(e,t,n){return Y.access(e,t,n)},_removeData:function(e,t){Y.remove(e,t)}}),S.fn.extend({data:function(n,e){var t,r,i,o=this[0],a=o&&o.attributes;if(void 0===n){if(this.length&&(i=Q.get(o),1===o.nodeType&&!Y.get(o,"hasDataAttrs"))){t=a.length;while(t--)a[t]&&0===(r=a[t].name).indexOf("data-")&&(r=X(r.slice(5)),Z(o,r,i[r]));Y.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof n?this.each(function(){Q.set(this,n)}):$(this,function(e){var t;if(o&&void 0===e)return void 0!==(t=Q.get(o,n))?t:void 0!==(t=Z(o,n))?t:void 0;this.each(function(){Q.set(this,n,e)})},null,e,1<arguments.length,null,!0)},removeData:function(e){return this.each(function(){Q.remove(this,e)})}}),S.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Y.get(e,t),n&&(!r||Array.isArray(n)?r=Y.access(e,t,S.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=S.queue(e,t),r=n.length,i=n.shift(),o=S._queueHooks(e,t);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,function(){S.dequeue(e,t)},o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return Y.get(e,n)||Y.access(e,n,{empty:S.Callbacks("once memory").add(function(){Y.remove(e,[t+"queue",n])})})}}),S.fn.extend({queue:function(t,n){var e=2;return"string"!=typeof t&&(n=t,t="fx",e--),arguments.length<e?S.queue(this[0],t):void 0===n?this:this.each(function(){var e=S.queue(this,t,n);S._queueHooks(this,t),"fx"===t&&"inprogress"!==e[0]&&S.dequeue(this,t)})},dequeue:function(e){return this.each(function(){S.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=S.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=Y.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var ee=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,te=new RegExp("^(?:([+-])=|)("+ee+")([a-z%]*)$","i"),ne=["Top","Right","Bottom","Left"],re=E.documentElement,ie=function(e){return S.contains(e.ownerDocument,e)},oe={composed:!0};re.getRootNode&&(ie=function(e){return S.contains(e.ownerDocument,e)||e.getRootNode(oe)===e.ownerDocument});var ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&ie(e)&&"none"===S.css(e,"display")};function se(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return S.css(e,t,"")},u=s(),l=n&&n[3]||(S.cssNumber[t]?"":"px"),c=e.nodeType&&(S.cssNumber[t]||"px"!==l&&+u)&&te.exec(S.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)S.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,S.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var ue={};function le(e,t){for(var n,r,i,o,a,s,u,l=[],c=0,f=e.length;c<f;c++)(r=e[c]).style&&(n=r.style.display,t?("none"===n&&(l[c]=Y.get(r,"display")||null,l[c]||(r.style.display="")),""===r.style.display&&ae(r)&&(l[c]=(u=a=o=void 0,a=(i=r).ownerDocument,s=i.nodeName,(u=ue[s])||(o=a.body.appendChild(a.createElement(s)),u=S.css(o,"display"),o.parentNode.removeChild(o),"none"===u&&(u="block"),ue[s]=u)))):"none"!==n&&(l[c]="none",Y.set(r,"display",n)));for(c=0;c<f;c++)null!=l[c]&&(e[c].style.display=l[c]);return e}S.fn.extend({show:function(){return le(this,!0)},hide:function(){return le(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?S(this).show():S(this).hide()})}});var ce,fe,pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,he=/^$|^module$|\/(?:java|ecma)script/i;ce=E.createDocumentFragment().appendChild(E.createElement("div")),(fe=E.createElement("input")).setAttribute("type","radio"),fe.setAttribute("checked","checked"),fe.setAttribute("name","t"),ce.appendChild(fe),y.checkClone=ce.cloneNode(!0).cloneNode(!0).lastChild.checked,ce.innerHTML="<textarea>x</textarea>",y.noCloneChecked=!!ce.cloneNode(!0).lastChild.defaultValue,ce.innerHTML="<option></option>",y.option=!!ce.lastChild;var ge={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function ve(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&A(e,t)?S.merge([e],n):n}function ye(e,t){for(var n=0,r=e.length;n<r;n++)Y.set(e[n],"globalEval",!t||Y.get(t[n],"globalEval"))}ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td,y.option||(ge.optgroup=ge.option=[1,"<select multiple='multiple'>","</select>"]);var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===w(o))S.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+S.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;S.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&-1<S.inArray(o,r))i&&i.push(o);else if(l=ie(o),a=ve(f.appendChild(o),"script"),l&&ye(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}var be=/^([^.]*)(?:\.(.+)|)/;function we(){return!0}function Te(){return!1}function Ce(e,t){return e===function(){try{return E.activeElement}catch(e){}}()==("focus"===t)}function Ee(e,t,n,r,i,o){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(r=r||n,n=void 0),t)Ee(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=Te;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return S().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=S.guid++)),e.each(function(){S.event.add(this,t,i,r,n)})}function Se(e,i,o){o?(Y.set(e,i,!1),S.event.add(e,i,{namespace:!1,handler:function(e){var t,n,r=Y.get(this,i);if(1&e.isTrigger&&this[i]){if(r.length)(S.event.special[i]||{}).delegateType&&e.stopPropagation();else if(r=s.call(arguments),Y.set(this,i,r),t=o(this,i),this[i](),r!==(n=Y.get(this,i))||t?Y.set(this,i,!1):n={},r!==n)return e.stopImmediatePropagation(),e.preventDefault(),n&&n.value}else r.length&&(Y.set(this,i,{value:S.event.trigger(S.extend(r[0],S.Event.prototype),r.slice(1),this)}),e.stopImmediatePropagation())}})):void 0===Y.get(e,i)&&S.event.add(e,i,we)}S.event={global:{},add:function(t,e,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.get(t);if(V(t)){n.handler&&(n=(o=n).handler,i=o.selector),i&&S.find.matchesSelector(re,i),n.guid||(n.guid=S.guid++),(u=v.events)||(u=v.events=Object.create(null)),(a=v.handle)||(a=v.handle=function(e){return"undefined"!=typeof S&&S.event.triggered!==e.type?S.event.dispatch.apply(t,arguments):void 0}),l=(e=(e||"").match(P)||[""]).length;while(l--)d=g=(s=be.exec(e[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=S.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=S.event.special[d]||{},c=S.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&S.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(t,r,h,a)||t.addEventListener&&t.addEventListener(d,a)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),S.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.hasData(e)&&Y.get(e);if(v&&(u=v.events)){l=(t=(t||"").match(P)||[""]).length;while(l--)if(d=g=(s=be.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d){f=S.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||S.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)S.event.remove(e,d+t[l],n,r,!0);S.isEmptyObject(u)&&Y.remove(e,"handle events")}},dispatch:function(e){var t,n,r,i,o,a,s=new Array(arguments.length),u=S.event.fix(e),l=(Y.get(this,"events")||Object.create(null))[u.type]||[],c=S.event.special[u.type]||{};for(s[0]=u,t=1;t<arguments.length;t++)s[t]=arguments[t];if(u.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,u)){a=S.event.handlers.call(this,u,l),t=0;while((i=a[t++])&&!u.isPropagationStopped()){u.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!u.isImmediatePropagationStopped())u.rnamespace&&!1!==o.namespace&&!u.rnamespace.test(o.namespace)||(u.handleObj=o,u.data=o.data,void 0!==(r=((S.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(u.result=r)&&(u.preventDefault(),u.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,u),u.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&1<=e.button))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?-1<S(i,this).index(l):S.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(t,e){Object.defineProperty(S.Event.prototype,t,{enumerable:!0,configurable:!0,get:m(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(e){return e[S.expando]?e:new S.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Se(t,"click",we),!1},trigger:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Se(t,"click"),!0},_default:function(e){var t=e.target;return pe.test(t.type)&&t.click&&A(t,"input")&&Y.get(t,"click")||A(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},S.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},S.Event=function(e,t){if(!(this instanceof S.Event))return new S.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?we:Te,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&S.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[S.expando]=!0},S.Event.prototype={constructor:S.Event,isDefaultPrevented:Te,isPropagationStopped:Te,isImmediatePropagationStopped:Te,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=we,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=we,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=we,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},S.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:!0},S.event.addProp),S.each({focus:"focusin",blur:"focusout"},function(e,t){S.event.special[e]={setup:function(){return Se(this,e,Ce),!1},trigger:function(){return Se(this,e),!0},_default:function(){return!0},delegateType:t}}),S.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,i){S.event.special[e]={delegateType:i,bindType:i,handle:function(e){var t,n=e.relatedTarget,r=e.handleObj;return n&&(n===this||S.contains(this,n))||(e.type=r.origType,t=r.handler.apply(this,arguments),e.type=i),t}}}),S.fn.extend({on:function(e,t,n,r){return Ee(this,e,t,n,r)},one:function(e,t,n,r){return Ee(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,S(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Te),this.each(function(){S.event.remove(this,e,n,t)})}});var ke=/<script|<style|<link/i,Ae=/checked\s*(?:[^=]|=\s*.checked.)/i,Ne=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function je(e,t){return A(e,"table")&&A(11!==t.nodeType?t:t.firstChild,"tr")&&S(e).children("tbody")[0]||e}function De(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function qe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Le(e,t){var n,r,i,o,a,s;if(1===t.nodeType){if(Y.hasData(e)&&(s=Y.get(e).events))for(i in Y.remove(t,"handle events"),s)for(n=0,r=s[i].length;n<r;n++)S.event.add(t,i,s[i][n]);Q.hasData(e)&&(o=Q.access(e),a=S.extend({},o),Q.set(t,a))}}function He(n,r,i,o){r=g(r);var e,t,a,s,u,l,c=0,f=n.length,p=f-1,d=r[0],h=m(d);if(h||1<f&&"string"==typeof d&&!y.checkClone&&Ae.test(d))return n.each(function(e){var t=n.eq(e);h&&(r[0]=d.call(this,e,t.html())),He(t,r,i,o)});if(f&&(t=(e=xe(r,n[0].ownerDocument,!1,n,o)).firstChild,1===e.childNodes.length&&(e=t),t||o)){for(s=(a=S.map(ve(e,"script"),De)).length;c<f;c++)u=e,c!==p&&(u=S.clone(u,!0,!0),s&&S.merge(a,ve(u,"script"))),i.call(n[c],u,c);if(s)for(l=a[a.length-1].ownerDocument,S.map(a,qe),c=0;c<s;c++)u=a[c],he.test(u.type||"")&&!Y.access(u,"globalEval")&&S.contains(l,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?S._evalUrl&&!u.noModule&&S._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")},l):b(u.textContent.replace(Ne,""),u,l))}return n}function Oe(e,t,n){for(var r,i=t?S.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||S.cleanData(ve(r)),r.parentNode&&(n&&ie(r)&&ye(ve(r,"script")),r.parentNode.removeChild(r));return e}S.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,i,o,a,s,u,l,c=e.cloneNode(!0),f=ie(e);if(!(y.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||S.isXMLDoc(e)))for(a=ve(c),r=0,i=(o=ve(e)).length;r<i;r++)s=o[r],u=a[r],void 0,"input"===(l=u.nodeName.toLowerCase())&&pe.test(s.type)?u.checked=s.checked:"input"!==l&&"textarea"!==l||(u.defaultValue=s.defaultValue);if(t)if(n)for(o=o||ve(e),a=a||ve(c),r=0,i=o.length;r<i;r++)Le(o[r],a[r]);else Le(e,c);return 0<(a=ve(c,"script")).length&&ye(a,!f&&ve(e,"script")),c},cleanData:function(e){for(var t,n,r,i=S.event.special,o=0;void 0!==(n=e[o]);o++)if(V(n)){if(t=n[Y.expando]){if(t.events)for(r in t.events)i[r]?S.event.remove(n,r):S.removeEvent(n,r,t.handle);n[Y.expando]=void 0}n[Q.expando]&&(n[Q.expando]=void 0)}}}),S.fn.extend({detach:function(e){return Oe(this,e,!0)},remove:function(e){return Oe(this,e)},text:function(e){return $(this,function(e){return void 0===e?S.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return He(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||je(this,e).appendChild(e)})},prepend:function(){return He(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=je(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return He(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return He(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(S.cleanData(ve(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return S.clone(this,e,t)})},html:function(e){return $(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!ke.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=S.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(S.cleanData(ve(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var n=[];return He(this,arguments,function(e){var t=this.parentNode;S.inArray(this,n)<0&&(S.cleanData(ve(this)),t&&t.replaceChild(e,this))},n)}}),S.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,a){S.fn[e]=function(e){for(var t,n=[],r=S(e),i=r.length-1,o=0;o<=i;o++)t=o===i?this:this.clone(!0),S(r[o])[a](t),u.apply(n,t.get());return this.pushStack(n)}});var Pe=new RegExp("^("+ee+")(?!px)[a-z%]+$","i"),Re=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=C),t.getComputedStyle(e)},Me=function(e,t,n){var r,i,o={};for(i in t)o[i]=e.style[i],e.style[i]=t[i];for(i in r=n.call(e),t)e.style[i]=o[i];return r},Ie=new RegExp(ne.join("|"),"i");function We(e,t,n){var r,i,o,a,s=e.style;return(n=n||Re(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||ie(e)||(a=S.style(e,t)),!y.pixelBoxStyles()&&Pe.test(a)&&Ie.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function Fe(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(l){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",l.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",re.appendChild(u).appendChild(l);var e=C.getComputedStyle(l);n="1%"!==e.top,s=12===t(e.marginLeft),l.style.right="60%",o=36===t(e.right),r=36===t(e.width),l.style.position="absolute",i=12===t(l.offsetWidth/3),re.removeChild(u),l=null}}function t(e){return Math.round(parseFloat(e))}var n,r,i,o,a,s,u=E.createElement("div"),l=E.createElement("div");l.style&&(l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",y.clearCloneStyle="content-box"===l.style.backgroundClip,S.extend(y,{boxSizingReliable:function(){return e(),r},pixelBoxStyles:function(){return e(),o},pixelPosition:function(){return e(),n},reliableMarginLeft:function(){return e(),s},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,n,r;return null==a&&(e=E.createElement("table"),t=E.createElement("tr"),n=E.createElement("div"),e.style.cssText="position:absolute;left:-11111px;border-collapse:separate",t.style.cssText="border:1px solid",t.style.height="1px",n.style.height="9px",n.style.display="block",re.appendChild(e).appendChild(t).appendChild(n),r=C.getComputedStyle(t),a=parseInt(r.height,10)+parseInt(r.borderTopWidth,10)+parseInt(r.borderBottomWidth,10)===t.offsetHeight,re.removeChild(e)),a}}))}();var Be=["Webkit","Moz","ms"],$e=E.createElement("div").style,_e={};function ze(e){var t=S.cssProps[e]||_e[e];return t||(e in $e?e:_e[e]=function(e){var t=e[0].toUpperCase()+e.slice(1),n=Be.length;while(n--)if((e=Be[n]+t)in $e)return e}(e)||e)}var Ue=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ve={position:"absolute",visibility:"hidden",display:"block"},Ge={letterSpacing:"0",fontWeight:"400"};function Ye(e,t,n){var r=te.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Qe(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=S.css(e,n+ne[a],!0,i)),r?("content"===n&&(u-=S.css(e,"padding"+ne[a],!0,i)),"margin"!==n&&(u-=S.css(e,"border"+ne[a]+"Width",!0,i))):(u+=S.css(e,"padding"+ne[a],!0,i),"padding"!==n?u+=S.css(e,"border"+ne[a]+"Width",!0,i):s+=S.css(e,"border"+ne[a]+"Width",!0,i));return!r&&0<=o&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))||0),u}function Je(e,t,n){var r=Re(e),i=(!y.boxSizingReliable()||n)&&"border-box"===S.css(e,"boxSizing",!1,r),o=i,a=We(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(Pe.test(a)){if(!n)return a;a="auto"}return(!y.boxSizingReliable()&&i||!y.reliableTrDimensions()&&A(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===S.css(e,"display",!1,r))&&e.getClientRects().length&&(i="border-box"===S.css(e,"boxSizing",!1,r),(o=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+Qe(e,t,n||(i?"border":"content"),o,r,a)+"px"}function Ke(e,t,n,r,i){return new Ke.prototype.init(e,t,n,r,i)}S.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=We(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=X(t),u=Xe.test(t),l=e.style;if(u||(t=ze(s)),a=S.cssHooks[t]||S.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"===(o=typeof n)&&(i=te.exec(n))&&i[1]&&(n=se(e,t,i),o="number"),null!=n&&n==n&&("number"!==o||u||(n+=i&&i[3]||(S.cssNumber[s]?"":"px")),y.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=X(t);return Xe.test(t)||(t=ze(s)),(a=S.cssHooks[t]||S.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=We(e,t,r)),"normal"===i&&t in Ge&&(i=Ge[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),S.each(["height","width"],function(e,u){S.cssHooks[u]={get:function(e,t,n){if(t)return!Ue.test(S.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?Je(e,u,n):Me(e,Ve,function(){return Je(e,u,n)})},set:function(e,t,n){var r,i=Re(e),o=!y.scrollboxSize()&&"absolute"===i.position,a=(o||n)&&"border-box"===S.css(e,"boxSizing",!1,i),s=n?Qe(e,u,n,a,i):0;return a&&o&&(s-=Math.ceil(e["offset"+u[0].toUpperCase()+u.slice(1)]-parseFloat(i[u])-Qe(e,u,"border",!1,i)-.5)),s&&(r=te.exec(t))&&"px"!==(r[3]||"px")&&(e.style[u]=t,t=S.css(e,u)),Ye(0,t,s)}}}),S.cssHooks.marginLeft=Fe(y.reliableMarginLeft,function(e,t){if(t)return(parseFloat(We(e,"marginLeft"))||e.getBoundingClientRect().left-Me(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),S.each({margin:"",padding:"",border:"Width"},function(i,o){S.cssHooks[i+o]={expand:function(e){for(var t=0,n={},r="string"==typeof e?e.split(" "):[e];t<4;t++)n[i+ne[t]+o]=r[t]||r[t-2]||r[0];return n}},"margin"!==i&&(S.cssHooks[i+o].set=Ye)}),S.fn.extend({css:function(e,t){return $(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=Re(e),i=t.length;a<i;a++)o[t[a]]=S.css(e,t[a],!1,r);return o}return void 0!==n?S.style(e,t,n):S.css(e,t)},e,t,1<arguments.length)}}),((S.Tween=Ke).prototype={constructor:Ke,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||S.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(S.cssNumber[n]?"":"px")},cur:function(){var e=Ke.propHooks[this.prop];return e&&e.get?e.get(this):Ke.propHooks._default.get(this)},run:function(e){var t,n=Ke.propHooks[this.prop];return this.options.duration?this.pos=t=S.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Ke.propHooks._default.set(this),this}}).init.prototype=Ke.prototype,(Ke.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=S.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){S.fx.step[e.prop]?S.fx.step[e.prop](e):1!==e.elem.nodeType||!S.cssHooks[e.prop]&&null==e.elem.style[ze(e.prop)]?e.elem[e.prop]=e.now:S.style(e.elem,e.prop,e.now+e.unit)}}}).scrollTop=Ke.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},S.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},S.fx=Ke.prototype.init,S.fx.step={};var Ze,et,tt,nt,rt=/^(?:toggle|show|hide)$/,it=/queueHooks$/;function ot(){et&&(!1===E.hidden&&C.requestAnimationFrame?C.requestAnimationFrame(ot):C.setTimeout(ot,S.fx.interval),S.fx.tick())}function at(){return C.setTimeout(function(){Ze=void 0}),Ze=Date.now()}function st(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=ne[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function ut(e,t,n){for(var r,i=(lt.tweeners[t]||[]).concat(lt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function lt(o,e,t){var n,a,r=0,i=lt.prefilters.length,s=S.Deferred().always(function(){delete u.elem}),u=function(){if(a)return!1;for(var e=Ze||at(),t=Math.max(0,l.startTime+l.duration-e),n=1-(t/l.duration||0),r=0,i=l.tweens.length;r<i;r++)l.tweens[r].run(n);return s.notifyWith(o,[l,n,t]),n<1&&i?t:(i||s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l]),!1)},l=s.promise({elem:o,props:S.extend({},e),opts:S.extend(!0,{specialEasing:{},easing:S.easing._default},t),originalProperties:e,originalOptions:t,startTime:Ze||at(),duration:t.duration,tweens:[],createTween:function(e,t){var n=S.Tween(o,l.opts,e,t,l.opts.specialEasing[e]||l.opts.easing);return l.tweens.push(n),n},stop:function(e){var t=0,n=e?l.tweens.length:0;if(a)return this;for(a=!0;t<n;t++)l.tweens[t].run(1);return e?(s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l,e])):s.rejectWith(o,[l,e]),this}}),c=l.props;for(!function(e,t){var n,r,i,o,a;for(n in e)if(i=t[r=X(n)],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=S.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete e[r],o)n in e||(e[n]=o[n],t[n]=i);else t[r]=i}(c,l.opts.specialEasing);r<i;r++)if(n=lt.prefilters[r].call(l,o,c,l.opts))return m(n.stop)&&(S._queueHooks(l.elem,l.opts.queue).stop=n.stop.bind(n)),n;return S.map(c,ut,l),m(l.opts.start)&&l.opts.start.call(o,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),S.fx.timer(S.extend(u,{elem:o,anim:l,queue:l.opts.queue})),l}S.Animation=S.extend(lt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return se(n.elem,e,te.exec(t),n),n}]},tweener:function(e,t){m(e)?(t=e,e=["*"]):e=e.match(P);for(var n,r=0,i=e.length;r<i;r++)n=e[r],lt.tweeners[n]=lt.tweeners[n]||[],lt.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),v=Y.get(e,"fxshow");for(r in n.queue||(null==(a=S._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,S.queue(e,"fx").length||a.empty.fire()})})),t)if(i=t[r],rt.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0}d[r]=v&&v[r]||S.style(e,r)}if((u=!S.isEmptyObject(t))||!S.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=v&&v.display)&&(l=Y.get(e,"display")),"none"===(c=S.css(e,"display"))&&(l?c=l:(le([e],!0),l=e.style.display||l,c=S.css(e,"display"),le([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===S.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1,d)u||(v?"hidden"in v&&(g=v.hidden):v=Y.access(e,"fxshow",{display:l}),o&&(v.hidden=!g),g&&le([e],!0),p.done(function(){for(r in g||le([e]),Y.remove(e,"fxshow"),d)S.style(e,r,d[r])})),u=ut(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0))}],prefilter:function(e,t){t?lt.prefilters.unshift(e):lt.prefilters.push(e)}}),S.speed=function(e,t,n){var r=e&&"object"==typeof e?S.extend({},e):{complete:n||!n&&t||m(e)&&e,duration:e,easing:n&&t||t&&!m(t)&&t};return S.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in S.fx.speeds?r.duration=S.fx.speeds[r.duration]:r.duration=S.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){m(r.old)&&r.old.call(this),r.queue&&S.dequeue(this,r.queue)},r},S.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(t,e,n,r){var i=S.isEmptyObject(t),o=S.speed(e,n,r),a=function(){var e=lt(this,S.extend({},t),o);(i||Y.get(this,"finish"))&&e.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(i,e,o){var a=function(e){var t=e.stop;delete e.stop,t(o)};return"string"!=typeof i&&(o=e,e=i,i=void 0),e&&this.queue(i||"fx",[]),this.each(function(){var e=!0,t=null!=i&&i+"queueHooks",n=S.timers,r=Y.get(this);if(t)r[t]&&r[t].stop&&a(r[t]);else for(t in r)r[t]&&r[t].stop&&it.test(t)&&a(r[t]);for(t=n.length;t--;)n[t].elem!==this||null!=i&&n[t].queue!==i||(n[t].anim.stop(o),e=!1,n.splice(t,1));!e&&o||S.dequeue(this,i)})},finish:function(a){return!1!==a&&(a=a||"fx"),this.each(function(){var e,t=Y.get(this),n=t[a+"queue"],r=t[a+"queueHooks"],i=S.timers,o=n?n.length:0;for(t.finish=!0,S.queue(this,a,[]),r&&r.stop&&r.stop.call(this,!0),e=i.length;e--;)i[e].elem===this&&i[e].queue===a&&(i[e].anim.stop(!0),i.splice(e,1));for(e=0;e<o;e++)n[e]&&n[e].finish&&n[e].finish.call(this);delete t.finish})}}),S.each(["toggle","show","hide"],function(e,r){var i=S.fn[r];S.fn[r]=function(e,t,n){return null==e||"boolean"==typeof e?i.apply(this,arguments):this.animate(st(r,!0),e,t,n)}}),S.each({slideDown:st("show"),slideUp:st("hide"),slideToggle:st("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,r){S.fn[e]=function(e,t,n){return this.animate(r,e,t,n)}}),S.timers=[],S.fx.tick=function(){var e,t=0,n=S.timers;for(Ze=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||S.fx.stop(),Ze=void 0},S.fx.timer=function(e){S.timers.push(e),S.fx.start()},S.fx.interval=13,S.fx.start=function(){et||(et=!0,ot())},S.fx.stop=function(){et=null},S.fx.speeds={slow:600,fast:200,_default:400},S.fn.delay=function(r,e){return r=S.fx&&S.fx.speeds[r]||r,e=e||"fx",this.queue(e,function(e,t){var n=C.setTimeout(e,r);t.stop=function(){C.clearTimeout(n)}})},tt=E.createElement("input"),nt=E.createElement("select").appendChild(E.createElement("option")),tt.type="checkbox",y.checkOn=""!==tt.value,y.optSelected=nt.selected,(tt=E.createElement("input")).value="t",tt.type="radio",y.radioValue="t"===tt.value;var ct,ft=S.expr.attrHandle;S.fn.extend({attr:function(e,t){return $(this,S.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){S.removeAttr(this,e)})}}),S.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?S.prop(e,t,n):(1===o&&S.isXMLDoc(e)||(i=S.attrHooks[t.toLowerCase()]||(S.expr.match.bool.test(t)?ct:void 0)),void 0!==n?null===n?void S.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=S.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!y.radioValue&&"radio"===t&&A(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(P);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),ct={set:function(e,t,n){return!1===t?S.removeAttr(e,n):e.setAttribute(n,n),n}},S.each(S.expr.match.bool.source.match(/\w+/g),function(e,t){var a=ft[t]||S.find.attr;ft[t]=function(e,t,n){var r,i,o=t.toLowerCase();return n||(i=ft[o],ft[o]=r,r=null!=a(e,t,n)?o:null,ft[o]=i),r}});var pt=/^(?:input|select|textarea|button)$/i,dt=/^(?:a|area)$/i;function ht(e){return(e.match(P)||[]).join(" ")}function gt(e){return e.getAttribute&&e.getAttribute("class")||""}function vt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(P)||[]}S.fn.extend({prop:function(e,t){return $(this,S.prop,e,t,1<arguments.length)},removeProp:function(e){return this.each(function(){delete this[S.propFix[e]||e]})}}),S.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&S.isXMLDoc(e)||(t=S.propFix[t]||t,i=S.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=S.find.attr(e,"tabindex");return t?parseInt(t,10):pt.test(e.nodeName)||dt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),y.optSelected||(S.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),S.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){S.propFix[this.toLowerCase()]=this}),S.fn.extend({addClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).addClass(t.call(this,e,gt(this)))});if((e=vt(t)).length)while(n=this[u++])if(i=gt(n),r=1===n.nodeType&&" "+ht(i)+" "){a=0;while(o=e[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=ht(r))&&n.setAttribute("class",s)}return this},removeClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).removeClass(t.call(this,e,gt(this)))});if(!arguments.length)return this.attr("class","");if((e=vt(t)).length)while(n=this[u++])if(i=gt(n),r=1===n.nodeType&&" "+ht(i)+" "){a=0;while(o=e[a++])while(-1<r.indexOf(" "+o+" "))r=r.replace(" "+o+" "," ");i!==(s=ht(r))&&n.setAttribute("class",s)}return this},toggleClass:function(i,t){var o=typeof i,a="string"===o||Array.isArray(i);return"boolean"==typeof t&&a?t?this.addClass(i):this.removeClass(i):m(i)?this.each(function(e){S(this).toggleClass(i.call(this,e,gt(this),t),t)}):this.each(function(){var e,t,n,r;if(a){t=0,n=S(this),r=vt(i);while(e=r[t++])n.hasClass(e)?n.removeClass(e):n.addClass(e)}else void 0!==i&&"boolean"!==o||((e=gt(this))&&Y.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===i?"":Y.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&-1<(" "+ht(gt(n))+" ").indexOf(t))return!0;return!1}});var yt=/\r/g;S.fn.extend({val:function(n){var r,e,i,t=this[0];return arguments.length?(i=m(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,S(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=S.map(t,function(e){return null==e?"":e+""})),(r=S.valHooks[this.type]||S.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t))})):t?(r=S.valHooks[t.type]||S.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(yt,""):null==e?"":e:void 0}}),S.extend({valHooks:{option:{get:function(e){var t=S.find.attr(e,"value");return null!=t?t:ht(S.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!A(n.parentNode,"optgroup"))){if(t=S(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=S.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=-1<S.inArray(S.valHooks.option.get(r),o))&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),S.each(["radio","checkbox"],function(){S.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=-1<S.inArray(S(e).val(),t)}},y.checkOn||(S.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),y.focusin="onfocusin"in C;var mt=/^(?:focusinfocus|focusoutblur)$/,xt=function(e){e.stopPropagation()};S.extend(S.event,{trigger:function(e,t,n,r){var i,o,a,s,u,l,c,f,p=[n||E],d=v.call(e,"type")?e.type:e,h=v.call(e,"namespace")?e.namespace.split("."):[];if(o=f=a=n=n||E,3!==n.nodeType&&8!==n.nodeType&&!mt.test(d+S.event.triggered)&&(-1<d.indexOf(".")&&(d=(h=d.split(".")).shift(),h.sort()),u=d.indexOf(":")<0&&"on"+d,(e=e[S.expando]?e:new S.Event(d,"object"==typeof e&&e)).isTrigger=r?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:S.makeArray(t,[e]),c=S.event.special[d]||{},r||!c.trigger||!1!==c.trigger.apply(n,t))){if(!r&&!c.noBubble&&!x(n)){for(s=c.delegateType||d,mt.test(s+d)||(o=o.parentNode);o;o=o.parentNode)p.push(o),a=o;a===(n.ownerDocument||E)&&p.push(a.defaultView||a.parentWindow||C)}i=0;while((o=p[i++])&&!e.isPropagationStopped())f=o,e.type=1<i?s:c.bindType||d,(l=(Y.get(o,"events")||Object.create(null))[e.type]&&Y.get(o,"handle"))&&l.apply(o,t),(l=u&&o[u])&&l.apply&&V(o)&&(e.result=l.apply(o,t),!1===e.result&&e.preventDefault());return e.type=d,r||e.isDefaultPrevented()||c._default&&!1!==c._default.apply(p.pop(),t)||!V(n)||u&&m(n[d])&&!x(n)&&((a=n[u])&&(n[u]=null),S.event.triggered=d,e.isPropagationStopped()&&f.addEventListener(d,xt),n[d](),e.isPropagationStopped()&&f.removeEventListener(d,xt),S.event.triggered=void 0,a&&(n[u]=a)),e.result}},simulate:function(e,t,n){var r=S.extend(new S.Event,n,{type:e,isSimulated:!0});S.event.trigger(r,null,t)}}),S.fn.extend({trigger:function(e,t){return this.each(function(){S.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return S.event.trigger(e,t,n,!0)}}),y.focusin||S.each({focus:"focusin",blur:"focusout"},function(n,r){var i=function(e){S.event.simulate(r,e.target,S.event.fix(e))};S.event.special[r]={setup:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r);t||e.addEventListener(n,i,!0),Y.access(e,r,(t||0)+1)},teardown:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r)-1;t?Y.access(e,r,t):(e.removeEventListener(n,i,!0),Y.remove(e,r))}}});var bt=C.location,wt={guid:Date.now()},Tt=/\?/;S.parseXML=function(e){var t,n;if(!e||"string"!=typeof e)return null;try{t=(new C.DOMParser).parseFromString(e,"text/xml")}catch(e){}return n=t&&t.getElementsByTagName("parsererror")[0],t&&!n||S.error("Invalid XML: "+(n?S.map(n.childNodes,function(e){return e.textContent}).join("\n"):e)),t};var Ct=/\[\]$/,Et=/\r?\n/g,St=/^(?:submit|button|image|reset|file)$/i,kt=/^(?:input|select|textarea|keygen)/i;function At(n,e,r,i){var t;if(Array.isArray(e))S.each(e,function(e,t){r||Ct.test(n)?i(n,t):At(n+"["+("object"==typeof t&&null!=t?e:"")+"]",t,r,i)});else if(r||"object"!==w(e))i(n,e);else for(t in e)At(n+"["+t+"]",e[t],r,i)}S.param=function(e,t){var n,r=[],i=function(e,t){var n=m(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!S.isPlainObject(e))S.each(e,function(){i(this.name,this.value)});else for(n in e)At(n,e[n],t,i);return r.join("&")},S.fn.extend({serialize:function(){return S.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=S.prop(this,"elements");return e?S.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!S(this).is(":disabled")&&kt.test(this.nodeName)&&!St.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=S(this).val();return null==n?null:Array.isArray(n)?S.map(n,function(e){return{name:t.name,value:e.replace(Et,"\r\n")}}):{name:t.name,value:n.replace(Et,"\r\n")}}).get()}});var Nt=/%20/g,jt=/#.*$/,Dt=/([?&])_=[^&]*/,qt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Lt=/^(?:GET|HEAD)$/,Ht=/^\/\//,Ot={},Pt={},Rt="*/".concat("*"),Mt=E.createElement("a");function It(o){return function(e,t){"string"!=typeof e&&(t=e,e="*");var n,r=0,i=e.toLowerCase().match(P)||[];if(m(t))while(n=i[r++])"+"===n[0]?(n=n.slice(1)||"*",(o[n]=o[n]||[]).unshift(t)):(o[n]=o[n]||[]).push(t)}}function Wt(t,i,o,a){var s={},u=t===Pt;function l(e){var r;return s[e]=!0,S.each(t[e]||[],function(e,t){var n=t(i,o,a);return"string"!=typeof n||u||s[n]?u?!(r=n):void 0:(i.dataTypes.unshift(n),l(n),!1)}),r}return l(i.dataTypes[0])||!s["*"]&&l("*")}function Ft(e,t){var n,r,i=S.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&S.extend(!0,e,r),e}Mt.href=bt.href,S.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:bt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(bt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Rt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":S.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Ft(Ft(e,S.ajaxSettings),t):Ft(S.ajaxSettings,e)},ajaxPrefilter:It(Ot),ajaxTransport:It(Pt),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var c,f,p,n,d,r,h,g,i,o,v=S.ajaxSetup({},t),y=v.context||v,m=v.context&&(y.nodeType||y.jquery)?S(y):S.event,x=S.Deferred(),b=S.Callbacks("once memory"),w=v.statusCode||{},a={},s={},u="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(h){if(!n){n={};while(t=qt.exec(p))n[t[1].toLowerCase()+" "]=(n[t[1].toLowerCase()+" "]||[]).concat(t[2])}t=n[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return h?p:null},setRequestHeader:function(e,t){return null==h&&(e=s[e.toLowerCase()]=s[e.toLowerCase()]||e,a[e]=t),this},overrideMimeType:function(e){return null==h&&(v.mimeType=e),this},statusCode:function(e){var t;if(e)if(h)T.always(e[T.status]);else for(t in e)w[t]=[w[t],e[t]];return this},abort:function(e){var t=e||u;return c&&c.abort(t),l(0,t),this}};if(x.promise(T),v.url=((e||v.url||bt.href)+"").replace(Ht,bt.protocol+"//"),v.type=t.method||t.type||v.method||v.type,v.dataTypes=(v.dataType||"*").toLowerCase().match(P)||[""],null==v.crossDomain){r=E.createElement("a");try{r.href=v.url,r.href=r.href,v.crossDomain=Mt.protocol+"//"+Mt.host!=r.protocol+"//"+r.host}catch(e){v.crossDomain=!0}}if(v.data&&v.processData&&"string"!=typeof v.data&&(v.data=S.param(v.data,v.traditional)),Wt(Ot,v,t,T),h)return T;for(i in(g=S.event&&v.global)&&0==S.active++&&S.event.trigger("ajaxStart"),v.type=v.type.toUpperCase(),v.hasContent=!Lt.test(v.type),f=v.url.replace(jt,""),v.hasContent?v.data&&v.processData&&0===(v.contentType||"").indexOf("application/x-www-form-urlencoded")&&(v.data=v.data.replace(Nt,"+")):(o=v.url.slice(f.length),v.data&&(v.processData||"string"==typeof v.data)&&(f+=(Tt.test(f)?"&":"?")+v.data,delete v.data),!1===v.cache&&(f=f.replace(Dt,"$1"),o=(Tt.test(f)?"&":"?")+"_="+wt.guid+++o),v.url=f+o),v.ifModified&&(S.lastModified[f]&&T.setRequestHeader("If-Modified-Since",S.lastModified[f]),S.etag[f]&&T.setRequestHeader("If-None-Match",S.etag[f])),(v.data&&v.hasContent&&!1!==v.contentType||t.contentType)&&T.setRequestHeader("Content-Type",v.contentType),T.setRequestHeader("Accept",v.dataTypes[0]&&v.accepts[v.dataTypes[0]]?v.accepts[v.dataTypes[0]]+("*"!==v.dataTypes[0]?", "+Rt+"; q=0.01":""):v.accepts["*"]),v.headers)T.setRequestHeader(i,v.headers[i]);if(v.beforeSend&&(!1===v.beforeSend.call(y,T,v)||h))return T.abort();if(u="abort",b.add(v.complete),T.done(v.success),T.fail(v.error),c=Wt(Pt,v,t,T)){if(T.readyState=1,g&&m.trigger("ajaxSend",[T,v]),h)return T;v.async&&0<v.timeout&&(d=C.setTimeout(function(){T.abort("timeout")},v.timeout));try{h=!1,c.send(a,l)}catch(e){if(h)throw e;l(-1,e)}}else l(-1,"No Transport");function l(e,t,n,r){var i,o,a,s,u,l=t;h||(h=!0,d&&C.clearTimeout(d),c=void 0,p=r||"",T.readyState=0<e?4:0,i=200<=e&&e<300||304===e,n&&(s=function(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}(v,T,n)),!i&&-1<S.inArray("script",v.dataTypes)&&S.inArray("json",v.dataTypes)<0&&(v.converters["text script"]=function(){}),s=function(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}(v,s,T,i),i?(v.ifModified&&((u=T.getResponseHeader("Last-Modified"))&&(S.lastModified[f]=u),(u=T.getResponseHeader("etag"))&&(S.etag[f]=u)),204===e||"HEAD"===v.type?l="nocontent":304===e?l="notmodified":(l=s.state,o=s.data,i=!(a=s.error))):(a=l,!e&&l||(l="error",e<0&&(e=0))),T.status=e,T.statusText=(t||l)+"",i?x.resolveWith(y,[o,l,T]):x.rejectWith(y,[T,l,a]),T.statusCode(w),w=void 0,g&&m.trigger(i?"ajaxSuccess":"ajaxError",[T,v,i?o:a]),b.fireWith(y,[T,l]),g&&(m.trigger("ajaxComplete",[T,v]),--S.active||S.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return S.get(e,t,n,"json")},getScript:function(e,t){return S.get(e,void 0,t,"script")}}),S.each(["get","post"],function(e,i){S[i]=function(e,t,n,r){return m(t)&&(r=r||n,n=t,t=void 0),S.ajax(S.extend({url:e,type:i,dataType:r,data:t,success:n},S.isPlainObject(e)&&e))}}),S.ajaxPrefilter(function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"")}),S._evalUrl=function(e,t,n){return S.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){S.globalEval(e,t,n)}})},S.fn.extend({wrapAll:function(e){var t;return this[0]&&(m(e)&&(e=e.call(this[0])),t=S(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(n){return m(n)?this.each(function(e){S(this).wrapInner(n.call(this,e))}):this.each(function(){var e=S(this),t=e.contents();t.length?t.wrapAll(n):e.append(n)})},wrap:function(t){var n=m(t);return this.each(function(e){S(this).wrapAll(n?t.call(this,e):t)})},unwrap:function(e){return this.parent(e).not("body").each(function(){S(this).replaceWith(this.childNodes)}),this}}),S.expr.pseudos.hidden=function(e){return!S.expr.pseudos.visible(e)},S.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},S.ajaxSettings.xhr=function(){try{return new C.XMLHttpRequest}catch(e){}};var Bt={0:200,1223:204},$t=S.ajaxSettings.xhr();y.cors=!!$t&&"withCredentials"in $t,y.ajax=$t=!!$t,S.ajaxTransport(function(i){var o,a;if(y.cors||$t&&!i.crossDomain)return{send:function(e,t){var n,r=i.xhr();if(r.open(i.type,i.url,i.async,i.username,i.password),i.xhrFields)for(n in i.xhrFields)r[n]=i.xhrFields[n];for(n in i.mimeType&&r.overrideMimeType&&r.overrideMimeType(i.mimeType),i.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest"),e)r.setRequestHeader(n,e[n]);o=function(e){return function(){o&&(o=a=r.onload=r.onerror=r.onabort=r.ontimeout=r.onreadystatechange=null,"abort"===e?r.abort():"error"===e?"number"!=typeof r.status?t(0,"error"):t(r.status,r.statusText):t(Bt[r.status]||r.status,r.statusText,"text"!==(r.responseType||"text")||"string"!=typeof r.responseText?{binary:r.response}:{text:r.responseText},r.getAllResponseHeaders()))}},r.onload=o(),a=r.onerror=r.ontimeout=o("error"),void 0!==r.onabort?r.onabort=a:r.onreadystatechange=function(){4===r.readyState&&C.setTimeout(function(){o&&a()})},o=o("abort");try{r.send(i.hasContent&&i.data||null)}catch(e){if(o)throw e}},abort:function(){o&&o()}}}),S.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),S.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return S.globalEval(e),e}}}),S.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),S.ajaxTransport("script",function(n){var r,i;if(n.crossDomain||n.scriptAttrs)return{send:function(e,t){r=S("<script>").attr(n.scriptAttrs||{}).prop({charset:n.scriptCharset,src:n.url}).on("load error",i=function(e){r.remove(),i=null,e&&t("error"===e.type?404:200,e.type)}),E.head.appendChild(r[0])},abort:function(){i&&i()}}});var _t,zt=[],Ut=/(=)\?(?=&|$)|\?\?/;S.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=zt.pop()||S.expando+"_"+wt.guid++;return this[e]=!0,e}}),S.ajaxPrefilter("json jsonp",function(e,t,n){var r,i,o,a=!1!==e.jsonp&&(Ut.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ut.test(e.data)&&"data");if(a||"jsonp"===e.dataTypes[0])return r=e.jsonpCallback=m(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Ut,"$1"+r):!1!==e.jsonp&&(e.url+=(Tt.test(e.url)?"&":"?")+e.jsonp+"="+r),e.converters["script json"]=function(){return o||S.error(r+" was not called"),o[0]},e.dataTypes[0]="json",i=C[r],C[r]=function(){o=arguments},n.always(function(){void 0===i?S(C).removeProp(r):C[r]=i,e[r]&&(e.jsonpCallback=t.jsonpCallback,zt.push(r)),o&&m(i)&&i(o[0]),o=i=void 0}),"script"}),y.createHTMLDocument=((_t=E.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===_t.childNodes.length),S.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(y.createHTMLDocument?((r=(t=E.implementation.createHTMLDocument("")).createElement("base")).href=E.location.href,t.head.appendChild(r)):t=E),o=!n&&[],(i=N.exec(e))?[t.createElement(i[1])]:(i=xe([e],t,o),o&&o.length&&S(o).remove(),S.merge([],i.childNodes)));var r,i,o},S.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return-1<s&&(r=ht(e.slice(s)),e=e.slice(0,s)),m(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),0<a.length&&S.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?S("<div>").append(S.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},S.expr.pseudos.animated=function(t){return S.grep(S.timers,function(e){return t===e.elem}).length},S.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l=S.css(e,"position"),c=S(e),f={};"static"===l&&(e.style.position="relative"),s=c.offset(),o=S.css(e,"top"),u=S.css(e,"left"),("absolute"===l||"fixed"===l)&&-1<(o+u).indexOf("auto")?(a=(r=c.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),m(t)&&(t=t.call(e,n,S.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+i),"using"in t?t.using.call(e,f):c.css(f)}},S.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){S.offset.setOffset(this,t,e)});var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===S.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===S.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=S(e).offset()).top+=S.css(e,"borderTopWidth",!0),i.left+=S.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-S.css(r,"marginTop",!0),left:t.left-i.left-S.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===S.css(e,"position"))e=e.offsetParent;return e||re})}}),S.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,i){var o="pageYOffset"===i;S.fn[t]=function(e){return $(this,function(e,t,n){var r;if(x(e)?r=e:9===e.nodeType&&(r=e.defaultView),void 0===n)return r?r[i]:e[t];r?r.scrollTo(o?r.pageXOffset:n,o?n:r.pageYOffset):e[t]=n},t,e,arguments.length)}}),S.each(["top","left"],function(e,n){S.cssHooks[n]=Fe(y.pixelPosition,function(e,t){if(t)return t=We(e,n),Pe.test(t)?S(e).position()[n]+"px":t})}),S.each({Height:"height",Width:"width"},function(a,s){S.each({padding:"inner"+a,content:s,"":"outer"+a},function(r,o){S.fn[o]=function(e,t){var n=arguments.length&&(r||"boolean"!=typeof e),i=r||(!0===e||!0===t?"margin":"border");return $(this,function(e,t,n){var r;return x(e)?0===o.indexOf("outer")?e["inner"+a]:e.document.documentElement["client"+a]:9===e.nodeType?(r=e.documentElement,Math.max(e.body["scroll"+a],r["scroll"+a],e.body["offset"+a],r["offset"+a],r["client"+a])):void 0===n?S.css(e,t,i):S.style(e,t,n,i)},s,n?e:void 0,n)}})}),S.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){S.fn[t]=function(e){return this.on(t,e)}}),S.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,n){S.fn[n]=function(e,t){return 0<arguments.length?this.on(n,null,e,t):this.trigger(n)}});var Xt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;S.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),m(e))return r=s.call(arguments,2),(i=function(){return e.apply(t||this,r.concat(s.call(arguments)))}).guid=e.guid=e.guid||S.guid++,i},S.holdReady=function(e){e?S.readyWait++:S.ready(!0)},S.isArray=Array.isArray,S.parseJSON=JSON.parse,S.nodeName=A,S.isFunction=m,S.isWindow=x,S.camelCase=X,S.type=w,S.now=Date.now,S.isNumeric=function(e){var t=S.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},S.trim=function(e){return null==e?"":(e+"").replace(Xt,"")},"function"==typeof define&&define.amd&&define("jquery",[],function(){return S});var Vt=C.jQuery,Gt=C.$;return S.noConflict=function(e){return C.$===S&&(C.$=Gt),e&&C.jQuery===S&&(C.jQuery=Vt),S},"undefined"==typeof e&&(C.jQuery=C.$=S),S});

!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? e(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], e)
    : e(
        ((t = 'undefined' != typeof globalThis ? globalThis : t || self)[
          'lottie-player'
        ] = {})
      );
})(this, function (exports) {
  'use strict';
  function _asyncIterator(t) {
    var e,
      r,
      i,
      s = 2;
    for (
      'undefined' != typeof Symbol &&
      ((r = Symbol.asyncIterator), (i = Symbol.iterator));
      s--;

    ) {
      if (r && null != (e = t[r])) return e.call(t);
      if (i && null != (e = t[i])) return new AsyncFromSyncIterator(e.call(t));
      (r = '@@asyncIterator'), (i = '@@iterator');
    }
    throw new TypeError('Object is not async iterable');
  }
  function AsyncFromSyncIterator(t) {
    function e(t) {
      if (Object(t) !== t)
        return Promise.reject(new TypeError(t + ' is not an object.'));
      var e = t.done;
      return Promise.resolve(t.value).then(function (t) {
        return { value: t, done: e };
      });
    }
    return (
      (AsyncFromSyncIterator = function (t) {
        (this.s = t), (this.n = t.next);
      }),
      (AsyncFromSyncIterator.prototype = {
        s: null,
        n: null,
        next: function () {
          return e(this.n.apply(this.s, arguments));
        },
        return: function (t) {
          var r = this.s.return;
          return void 0 === r
            ? Promise.resolve({ value: t, done: !0 })
            : e(r.apply(this.s, arguments));
        },
        throw: function (t) {
          var r = this.s.return;
          return void 0 === r
            ? Promise.reject(t)
            : e(r.apply(this.s, arguments));
        },
      }),
      new AsyncFromSyncIterator(t)
    );
  }
  var REACT_ELEMENT_TYPE;
  function _jsx(t, e, r, i) {
    REACT_ELEMENT_TYPE ||
      (REACT_ELEMENT_TYPE =
        ('function' == typeof Symbol &&
          Symbol.for &&
          Symbol.for('react.element')) ||
        60103);
    var s = t && t.defaultProps,
      a = arguments.length - 3;
    if ((e || 0 === a || (e = { children: void 0 }), 1 === a)) e.children = i;
    else if (a > 1) {
      for (var n = new Array(a), o = 0; o < a; o++) n[o] = arguments[o + 3];
      e.children = n;
    }
    if (e && s) for (var h in s) void 0 === e[h] && (e[h] = s[h]);
    else e || (e = s || {});
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: t,
      key: void 0 === r ? null : '' + r,
      ref: null,
      props: e,
      _owner: null,
    };
  }
  function ownKeys(t, e) {
    var r = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(t);
      e &&
        (i = i.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
        r.push.apply(r, i);
    }
    return r;
  }
  function _objectSpread2(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? ownKeys(Object(r), !0).forEach(function (e) {
            _defineProperty(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
        : ownKeys(Object(r)).forEach(function (e) {
            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
          });
    }
    return t;
  }
  function _typeof(t) {
    return (
      (_typeof =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                'function' == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? 'symbol'
                : typeof t;
            }),
      _typeof(t)
    );
  }
  function _wrapRegExp() {
    _wrapRegExp = function (t, e) {
      return new r(t, void 0, e);
    };
    var t = RegExp.prototype,
      e = new WeakMap();
    function r(t, i, s) {
      var a = new RegExp(t, i);
      return e.set(a, s || e.get(t)), _setPrototypeOf(a, r.prototype);
    }
    function i(t, r) {
      var i = e.get(r);
      return Object.keys(i).reduce(function (e, r) {
        return (e[r] = t[i[r]]), e;
      }, Object.create(null));
    }
    return (
      _inherits(r, RegExp),
      (r.prototype.exec = function (e) {
        var r = t.exec.call(this, e);
        return r && (r.groups = i(r, this)), r;
      }),
      (r.prototype[Symbol.replace] = function (r, s) {
        if ('string' == typeof s) {
          var a = e.get(this);
          return t[Symbol.replace].call(
            this,
            r,
            s.replace(/\$<([^>]+)>/g, function (t, e) {
              return '$' + a[e];
            })
          );
        }
        if ('function' == typeof s) {
          var n = this;
          return t[Symbol.replace].call(this, r, function () {
            var t = arguments;
            return (
              'object' != typeof t[t.length - 1] &&
                (t = [].slice.call(t)).push(i(t, n)),
              s.apply(this, t)
            );
          });
        }
        return t[Symbol.replace].call(this, r, s);
      }),
      _wrapRegExp.apply(this, arguments)
    );
  }
  function _AwaitValue(t) {
    this.wrapped = t;
  }
  function _AsyncGenerator(t) {
    var e, r;
    function i(e, r) {
      try {
        var a = t[e](r),
          n = a.value,
          o = n instanceof _AwaitValue;
        Promise.resolve(o ? n.wrapped : n).then(
          function (t) {
            o
              ? i('return' === e ? 'return' : 'next', t)
              : s(a.done ? 'return' : 'normal', t);
          },
          function (t) {
            i('throw', t);
          }
        );
      } catch (t) {
        s('throw', t);
      }
    }
    function s(t, s) {
      switch (t) {
        case 'return':
          e.resolve({ value: s, done: !0 });
          break;
        case 'throw':
          e.reject(s);
          break;
        default:
          e.resolve({ value: s, done: !1 });
      }
      (e = e.next) ? i(e.key, e.arg) : (r = null);
    }
    (this._invoke = function (t, s) {
      return new Promise(function (a, n) {
        var o = { key: t, arg: s, resolve: a, reject: n, next: null };
        r ? (r = r.next = o) : ((e = r = o), i(t, s));
      });
    }),
      'function' != typeof t.return && (this.return = void 0);
  }
  function _wrapAsyncGenerator(t) {
    return function () {
      return new _AsyncGenerator(t.apply(this, arguments));
    };
  }
  function _awaitAsyncGenerator(t) {
    return new _AwaitValue(t);
  }
  function _asyncGeneratorDelegate(t, e) {
    var r = {},
      i = !1;
    function s(r, s) {
      return (
        (i = !0),
        (s = new Promise(function (e) {
          e(t[r](s));
        })),
        { done: !1, value: e(s) }
      );
    }
    return (
      (r[('undefined' != typeof Symbol && Symbol.iterator) || '@@iterator'] =
        function () {
          return this;
        }),
      (r.next = function (t) {
        return i ? ((i = !1), t) : s('next', t);
      }),
      'function' == typeof t.throw &&
        (r.throw = function (t) {
          if (i) throw ((i = !1), t);
          return s('throw', t);
        }),
      'function' == typeof t.return &&
        (r.return = function (t) {
          return i ? ((i = !1), t) : s('return', t);
        }),
      r
    );
  }
  function asyncGeneratorStep(t, e, r, i, s, a, n) {
    try {
      var o = t[a](n),
        h = o.value;
    } catch (t) {
      return void r(t);
    }
    o.done ? e(h) : Promise.resolve(h).then(i, s);
  }
  function _asyncToGenerator(t) {
    return function () {
      var e = this,
        r = arguments;
      return new Promise(function (i, s) {
        var a = t.apply(e, r);
        function n(t) {
          asyncGeneratorStep(a, i, s, n, o, 'next', t);
        }
        function o(t) {
          asyncGeneratorStep(a, i, s, n, o, 'throw', t);
        }
        n(void 0);
      });
    };
  }
  function _classCallCheck(t, e) {
    if (!(t instanceof e))
      throw new TypeError('Cannot call a class as a function');
  }
  function _defineProperties(t, e) {
    for (var r = 0; r < e.length; r++) {
      var i = e[r];
      (i.enumerable = i.enumerable || !1),
        (i.configurable = !0),
        'value' in i && (i.writable = !0),
        Object.defineProperty(t, i.key, i);
    }
  }
  function _createClass(t, e, r) {
    return (
      e && _defineProperties(t.prototype, e),
      r && _defineProperties(t, r),
      Object.defineProperty(t, 'prototype', { writable: !1 }),
      t
    );
  }
  function _defineEnumerableProperties(t, e) {
    for (var r in e) {
      ((a = e[r]).configurable = a.enumerable = !0),
        'value' in a && (a.writable = !0),
        Object.defineProperty(t, r, a);
    }
    if (Object.getOwnPropertySymbols)
      for (var i = Object.getOwnPropertySymbols(e), s = 0; s < i.length; s++) {
        var a,
          n = i[s];
        ((a = e[n]).configurable = a.enumerable = !0),
          'value' in a && (a.writable = !0),
          Object.defineProperty(t, n, a);
      }
    return t;
  }
  function _defaults(t, e) {
    for (var r = Object.getOwnPropertyNames(e), i = 0; i < r.length; i++) {
      var s = r[i],
        a = Object.getOwnPropertyDescriptor(e, s);
      a && a.configurable && void 0 === t[s] && Object.defineProperty(t, s, a);
    }
    return t;
  }
  function _defineProperty(t, e, r) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = r),
      t
    );
  }
  function _extends() {
    return (
      (_extends =
        Object.assign ||
        function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var r = arguments[e];
            for (var i in r)
              Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
          }
          return t;
        }),
      _extends.apply(this, arguments)
    );
  }
  function _objectSpread(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? Object(arguments[e]) : {},
        i = Object.keys(r);
      'function' == typeof Object.getOwnPropertySymbols &&
        i.push.apply(
          i,
          Object.getOwnPropertySymbols(r).filter(function (t) {
            return Object.getOwnPropertyDescriptor(r, t).enumerable;
          })
        ),
        i.forEach(function (e) {
          _defineProperty(t, e, r[e]);
        });
    }
    return t;
  }
  function _inherits(t, e) {
    if ('function' != typeof e && null !== e)
      throw new TypeError('Super expression must either be null or a function');
    (t.prototype = Object.create(e && e.prototype, {
      constructor: { value: t, writable: !0, configurable: !0 },
    })),
      Object.defineProperty(t, 'prototype', { writable: !1 }),
      e && _setPrototypeOf(t, e);
  }
  function _inheritsLoose(t, e) {
    (t.prototype = Object.create(e.prototype)),
      (t.prototype.constructor = t),
      _setPrototypeOf(t, e);
  }
  function _getPrototypeOf(t) {
    return (
      (_getPrototypeOf = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function (t) {
            return t.__proto__ || Object.getPrototypeOf(t);
          }),
      _getPrototypeOf(t)
    );
  }
  function _setPrototypeOf(t, e) {
    return (
      (_setPrototypeOf =
        Object.setPrototypeOf ||
        function (t, e) {
          return (t.__proto__ = e), t;
        }),
      _setPrototypeOf(t, e)
    );
  }
  function _isNativeReflectConstruct() {
    if ('undefined' == typeof Reflect || !Reflect.construct) return !1;
    if (Reflect.construct.sham) return !1;
    if ('function' == typeof Proxy) return !0;
    try {
      return (
        Boolean.prototype.valueOf.call(
          Reflect.construct(Boolean, [], function () {})
        ),
        !0
      );
    } catch (t) {
      return !1;
    }
  }
  function _construct(t, e, r) {
    return (
      (_construct = _isNativeReflectConstruct()
        ? Reflect.construct
        : function (t, e, r) {
            var i = [null];
            i.push.apply(i, e);
            var s = new (Function.bind.apply(t, i))();
            return r && _setPrototypeOf(s, r.prototype), s;
          }),
      _construct.apply(null, arguments)
    );
  }
  function _isNativeFunction(t) {
    return -1 !== Function.toString.call(t).indexOf('[native code]');
  }
  function _wrapNativeSuper(t) {
    var e = 'function' == typeof Map ? new Map() : void 0;
    return (
      (_wrapNativeSuper = function (t) {
        if (null === t || !_isNativeFunction(t)) return t;
        if ('function' != typeof t)
          throw new TypeError(
            'Super expression must either be null or a function'
          );
        if (void 0 !== e) {
          if (e.has(t)) return e.get(t);
          e.set(t, r);
        }
        function r() {
          return _construct(t, arguments, _getPrototypeOf(this).constructor);
        }
        return (
          (r.prototype = Object.create(t.prototype, {
            constructor: {
              value: r,
              enumerable: !1,
              writable: !0,
              configurable: !0,
            },
          })),
          _setPrototypeOf(r, t)
        );
      }),
      _wrapNativeSuper(t)
    );
  }
  function _instanceof(t, e) {
    return null != e && 'undefined' != typeof Symbol && e[Symbol.hasInstance]
      ? !!e[Symbol.hasInstance](t)
      : t instanceof e;
  }
  function _interopRequireDefault(t) {
    return t && t.__esModule ? t : { default: t };
  }
  function _getRequireWildcardCache(t) {
    if ('function' != typeof WeakMap) return null;
    var e = new WeakMap(),
      r = new WeakMap();
    return (_getRequireWildcardCache = function (t) {
      return t ? r : e;
    })(t);
  }
  function _interopRequireWildcard(t, e) {
    if (!e && t && t.__esModule) return t;
    if (null === t || ('object' != typeof t && 'function' != typeof t))
      return { default: t };
    var r = _getRequireWildcardCache(e);
    if (r && r.has(t)) return r.get(t);
    var i = {},
      s = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var a in t)
      if ('default' !== a && Object.prototype.hasOwnProperty.call(t, a)) {
        var n = s ? Object.getOwnPropertyDescriptor(t, a) : null;
        n && (n.get || n.set) ? Object.defineProperty(i, a, n) : (i[a] = t[a]);
      }
    return (i.default = t), r && r.set(t, i), i;
  }
  function _newArrowCheck(t, e) {
    if (t !== e) throw new TypeError('Cannot instantiate an arrow function');
  }
  function _objectDestructuringEmpty(t) {
    if (null == t) throw new TypeError('Cannot destructure undefined');
  }
  function _objectWithoutPropertiesLoose(t, e) {
    if (null == t) return {};
    var r,
      i,
      s = {},
      a = Object.keys(t);
    for (i = 0; i < a.length; i++)
      (r = a[i]), e.indexOf(r) >= 0 || (s[r] = t[r]);
    return s;
  }
  function _objectWithoutProperties(t, e) {
    if (null == t) return {};
    var r,
      i,
      s = _objectWithoutPropertiesLoose(t, e);
    if (Object.getOwnPropertySymbols) {
      var a = Object.getOwnPropertySymbols(t);
      for (i = 0; i < a.length; i++)
        (r = a[i]),
          e.indexOf(r) >= 0 ||
            (Object.prototype.propertyIsEnumerable.call(t, r) && (s[r] = t[r]));
    }
    return s;
  }
  function _assertThisInitialized(t) {
    if (void 0 === t)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    return t;
  }
  function _possibleConstructorReturn(t, e) {
    if (e && ('object' == typeof e || 'function' == typeof e)) return e;
    if (void 0 !== e)
      throw new TypeError(
        'Derived constructors may only return object or undefined'
      );
    return _assertThisInitialized(t);
  }
  function _createSuper(t) {
    var e = _isNativeReflectConstruct();
    return function () {
      var r,
        i = _getPrototypeOf(t);
      if (e) {
        var s = _getPrototypeOf(this).constructor;
        r = Reflect.construct(i, arguments, s);
      } else r = i.apply(this, arguments);
      return _possibleConstructorReturn(this, r);
    };
  }
  function _superPropBase(t, e) {
    for (
      ;
      !Object.prototype.hasOwnProperty.call(t, e) &&
      null !== (t = _getPrototypeOf(t));

    );
    return t;
  }
  function _get() {
    return (
      (_get =
        'undefined' != typeof Reflect && Reflect.get
          ? Reflect.get
          : function (t, e, r) {
              var i = _superPropBase(t, e);
              if (i) {
                var s = Object.getOwnPropertyDescriptor(i, e);
                return s.get
                  ? s.get.call(arguments.length < 3 ? t : r)
                  : s.value;
              }
            }),
      _get.apply(this, arguments)
    );
  }
  function set(t, e, r, i) {
    return (
      (set =
        'undefined' != typeof Reflect && Reflect.set
          ? Reflect.set
          : function (t, e, r, i) {
              var s,
                a = _superPropBase(t, e);
              if (a) {
                if ((s = Object.getOwnPropertyDescriptor(a, e)).set)
                  return s.set.call(i, r), !0;
                if (!s.writable) return !1;
              }
              if ((s = Object.getOwnPropertyDescriptor(i, e))) {
                if (!s.writable) return !1;
                (s.value = r), Object.defineProperty(i, e, s);
              } else _defineProperty(i, e, r);
              return !0;
            }),
      set(t, e, r, i)
    );
  }
  function _set(t, e, r, i, s) {
    if (!set(t, e, r, i || t) && s) throw new Error('failed to set property');
    return r;
  }
  function _taggedTemplateLiteral(t, e) {
    return (
      e || (e = t.slice(0)),
      Object.freeze(
        Object.defineProperties(t, { raw: { value: Object.freeze(e) } })
      )
    );
  }
  function _taggedTemplateLiteralLoose(t, e) {
    return e || (e = t.slice(0)), (t.raw = e), t;
  }
  function _readOnlyError(t) {
    throw new TypeError('"' + t + '" is read-only');
  }
  function _writeOnlyError(t) {
    throw new TypeError('"' + t + '" is write-only');
  }
  function _classNameTDZError(t) {
    throw new Error(
      'Class "' + t + '" cannot be referenced in computed property keys.'
    );
  }
  function _temporalUndefined() {}
  function _tdz(t) {
    throw new ReferenceError(t + ' is not defined - temporal dead zone');
  }
  function _temporalRef(t, e) {
    return t === _temporalUndefined ? _tdz(e) : t;
  }
  function _slicedToArray(t, e) {
    return (
      _arrayWithHoles(t) ||
      _iterableToArrayLimit(t, e) ||
      _unsupportedIterableToArray(t, e) ||
      _nonIterableRest()
    );
  }
  function _slicedToArrayLoose(t, e) {
    return (
      _arrayWithHoles(t) ||
      _iterableToArrayLimitLoose(t, e) ||
      _unsupportedIterableToArray(t, e) ||
      _nonIterableRest()
    );
  }
  function _toArray(t) {
    return (
      _arrayWithHoles(t) ||
      _iterableToArray(t) ||
      _unsupportedIterableToArray(t) ||
      _nonIterableRest()
    );
  }
  function _toConsumableArray(t) {
    return (
      _arrayWithoutHoles(t) ||
      _iterableToArray(t) ||
      _unsupportedIterableToArray(t) ||
      _nonIterableSpread()
    );
  }
  function _arrayWithoutHoles(t) {
    if (Array.isArray(t)) return _arrayLikeToArray(t);
  }
  function _arrayWithHoles(t) {
    if (Array.isArray(t)) return t;
  }
  function _maybeArrayLike(t, e, r) {
    if (e && !Array.isArray(e) && 'number' == typeof e.length) {
      var i = e.length;
      return _arrayLikeToArray(e, void 0 !== r && r < i ? r : i);
    }
    return t(e, r);
  }
  function _iterableToArray(t) {
    if (
      ('undefined' != typeof Symbol && null != t[Symbol.iterator]) ||
      null != t['@@iterator']
    )
      return Array.from(t);
  }
  function _iterableToArrayLimit(t, e) {
    var r =
      null == t
        ? null
        : ('undefined' != typeof Symbol && t[Symbol.iterator]) ||
          t['@@iterator'];
    if (null != r) {
      var i,
        s,
        a = [],
        n = !0,
        o = !1;
      try {
        for (
          r = r.call(t);
          !(n = (i = r.next()).done) && (a.push(i.value), !e || a.length !== e);
          n = !0
        );
      } catch (t) {
        (o = !0), (s = t);
      } finally {
        try {
          n || null == r.return || r.return();
        } finally {
          if (o) throw s;
        }
      }
      return a;
    }
  }
  function _iterableToArrayLimitLoose(t, e) {
    var r =
      t &&
      (('undefined' != typeof Symbol && t[Symbol.iterator]) || t['@@iterator']);
    if (null != r) {
      var i = [];
      for (
        r = r.call(t), _step;
        !(_step = r.next()).done && (i.push(_step.value), !e || i.length !== e);

      );
      return i;
    }
  }
  function _unsupportedIterableToArray(t, e) {
    if (t) {
      if ('string' == typeof t) return _arrayLikeToArray(t, e);
      var r = Object.prototype.toString.call(t).slice(8, -1);
      return (
        'Object' === r && t.constructor && (r = t.constructor.name),
        'Map' === r || 'Set' === r
          ? Array.from(t)
          : 'Arguments' === r ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
          ? _arrayLikeToArray(t, e)
          : void 0
      );
    }
  }
  function _arrayLikeToArray(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, i = new Array(e); r < e; r++) i[r] = t[r];
    return i;
  }
  function _nonIterableSpread() {
    throw new TypeError(
      'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }
  function _nonIterableRest() {
    throw new TypeError(
      'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }
  function _createForOfIteratorHelper(t, e) {
    var r =
      ('undefined' != typeof Symbol && t[Symbol.iterator]) || t['@@iterator'];
    if (!r) {
      if (
        Array.isArray(t) ||
        (r = _unsupportedIterableToArray(t)) ||
        (e && t && 'number' == typeof t.length)
      ) {
        r && (t = r);
        var i = 0,
          s = function () {};
        return {
          s: s,
          n: function () {
            return i >= t.length ? { done: !0 } : { done: !1, value: t[i++] };
          },
          e: function (t) {
            throw t;
          },
          f: s,
        };
      }
      throw new TypeError(
        'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
      );
    }
    var a,
      n = !0,
      o = !1;
    return {
      s: function () {
        r = r.call(t);
      },
      n: function () {
        var t = r.next();
        return (n = t.done), t;
      },
      e: function (t) {
        (o = !0), (a = t);
      },
      f: function () {
        try {
          n || null == r.return || r.return();
        } finally {
          if (o) throw a;
        }
      },
    };
  }
  function _createForOfIteratorHelperLoose(t, e) {
    var r =
      ('undefined' != typeof Symbol && t[Symbol.iterator]) || t['@@iterator'];
    if (r) return (r = r.call(t)).next.bind(r);
    if (
      Array.isArray(t) ||
      (r = _unsupportedIterableToArray(t)) ||
      (e && t && 'number' == typeof t.length)
    ) {
      r && (t = r);
      var i = 0;
      return function () {
        return i >= t.length ? { done: !0 } : { done: !1, value: t[i++] };
      };
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }
  function _skipFirstGeneratorNext(t) {
    return function () {
      var e = t.apply(this, arguments);
      return e.next(), e;
    };
  }
  function _toPrimitive(t, e) {
    if ('object' != typeof t || null === t) return t;
    var r = t[Symbol.toPrimitive];
    if (void 0 !== r) {
      var i = r.call(t, e || 'default');
      if ('object' != typeof i) return i;
      throw new TypeError('@@toPrimitive must return a primitive value.');
    }
    return ('string' === e ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var e = _toPrimitive(t, 'string');
    return 'symbol' == typeof e ? e : String(e);
  }
  function _initializerWarningHelper(t, e) {
    throw new Error(
      'Decorating class property failed. Please ensure that proposal-class-properties is enabled and runs after the decorators transform.'
    );
  }
  function _initializerDefineProperty(t, e, r, i) {
    r &&
      Object.defineProperty(t, e, {
        enumerable: r.enumerable,
        configurable: r.configurable,
        writable: r.writable,
        value: r.initializer ? r.initializer.call(i) : void 0,
      });
  }
  function _applyDecoratedDescriptor(t, e, r, i, s) {
    var a = {};
    return (
      Object.keys(i).forEach(function (t) {
        a[t] = i[t];
      }),
      (a.enumerable = !!a.enumerable),
      (a.configurable = !!a.configurable),
      ('value' in a || a.initializer) && (a.writable = !0),
      (a = r
        .slice()
        .reverse()
        .reduce(function (r, i) {
          return i(t, e, r) || r;
        }, a)),
      s &&
        void 0 !== a.initializer &&
        ((a.value = a.initializer ? a.initializer.call(s) : void 0),
        (a.initializer = void 0)),
      void 0 === a.initializer && (Object.defineProperty(t, e, a), (a = null)),
      a
    );
  }
  (_AsyncGenerator.prototype[
    ('function' == typeof Symbol && Symbol.asyncIterator) || '@@asyncIterator'
  ] = function () {
    return this;
  }),
    (_AsyncGenerator.prototype.next = function (t) {
      return this._invoke('next', t);
    }),
    (_AsyncGenerator.prototype.throw = function (t) {
      return this._invoke('throw', t);
    }),
    (_AsyncGenerator.prototype.return = function (t) {
      return this._invoke('return', t);
    });
  var id = 0;
  function _classPrivateFieldLooseKey(t) {
    return '__private_' + id++ + '_' + t;
  }
  function _classPrivateFieldLooseBase(t, e) {
    if (!Object.prototype.hasOwnProperty.call(t, e))
      throw new TypeError('attempted to use private field on non-instance');
    return t;
  }
  function _classPrivateFieldGet(t, e) {
    return _classApplyDescriptorGet(
      t,
      _classExtractFieldDescriptor(t, e, 'get')
    );
  }
  function _classPrivateFieldSet(t, e, r) {
    return (
      _classApplyDescriptorSet(t, _classExtractFieldDescriptor(t, e, 'set'), r),
      r
    );
  }
  function _classPrivateFieldDestructureSet(t, e) {
    return _classApplyDescriptorDestructureSet(
      t,
      _classExtractFieldDescriptor(t, e, 'set')
    );
  }
  function _classExtractFieldDescriptor(t, e, r) {
    if (!e.has(t))
      throw new TypeError(
        'attempted to ' + r + ' private field on non-instance'
      );
    return e.get(t);
  }
  function _classStaticPrivateFieldSpecGet(t, e, r) {
    return (
      _classCheckPrivateStaticAccess(t, e),
      _classCheckPrivateStaticFieldDescriptor(r, 'get'),
      _classApplyDescriptorGet(t, r)
    );
  }
  function _classStaticPrivateFieldSpecSet(t, e, r, i) {
    return (
      _classCheckPrivateStaticAccess(t, e),
      _classCheckPrivateStaticFieldDescriptor(r, 'set'),
      _classApplyDescriptorSet(t, r, i),
      i
    );
  }
  function _classStaticPrivateMethodGet(t, e, r) {
    return _classCheckPrivateStaticAccess(t, e), r;
  }
  function _classStaticPrivateMethodSet() {
    throw new TypeError('attempted to set read only static private field');
  }
  function _classApplyDescriptorGet(t, e) {
    return e.get ? e.get.call(t) : e.value;
  }
  function _classApplyDescriptorSet(t, e, r) {
    if (e.set) e.set.call(t, r);
    else {
      if (!e.writable)
        throw new TypeError('attempted to set read only private field');
      e.value = r;
    }
  }
  function _classApplyDescriptorDestructureSet(t, e) {
    if (e.set)
      return (
        '__destrObj' in e ||
          (e.__destrObj = {
            set value(r) {
              e.set.call(t, r);
            },
          }),
        e.__destrObj
      );
    if (!e.writable)
      throw new TypeError('attempted to set read only private field');
    return e;
  }
  function _classStaticPrivateFieldDestructureSet(t, e, r) {
    return (
      _classCheckPrivateStaticAccess(t, e),
      _classCheckPrivateStaticFieldDescriptor(r, 'set'),
      _classApplyDescriptorDestructureSet(t, r)
    );
  }
  function _classCheckPrivateStaticAccess(t, e) {
    if (t !== e)
      throw new TypeError('Private static access of wrong provenance');
  }
  function _classCheckPrivateStaticFieldDescriptor(t, e) {
    if (void 0 === t)
      throw new TypeError(
        'attempted to ' + e + ' private static field before its declaration'
      );
  }
  function _decorate(t, e, r, i) {
    var s = _getDecoratorsApi();
    if (i) for (var a = 0; a < i.length; a++) s = i[a](s);
    var n = e(function (t) {
        s.initializeInstanceElements(t, o.elements);
      }, r),
      o = s.decorateClass(
        _coalesceClassElements(n.d.map(_createElementDescriptor)),
        t
      );
    return (
      s.initializeClassElements(n.F, o.elements),
      s.runClassFinishers(n.F, o.finishers)
    );
  }
  function _getDecoratorsApi() {
    _getDecoratorsApi = function () {
      return t;
    };
    var t = {
      elementsDefinitionOrder: [['method'], ['field']],
      initializeInstanceElements: function (t, e) {
        ['method', 'field'].forEach(function (r) {
          e.forEach(function (e) {
            e.kind === r &&
              'own' === e.placement &&
              this.defineClassElement(t, e);
          }, this);
        }, this);
      },
      initializeClassElements: function (t, e) {
        var r = t.prototype;
        ['method', 'field'].forEach(function (i) {
          e.forEach(function (e) {
            var s = e.placement;
            if (e.kind === i && ('static' === s || 'prototype' === s)) {
              var a = 'static' === s ? t : r;
              this.defineClassElement(a, e);
            }
          }, this);
        }, this);
      },
      defineClassElement: function (t, e) {
        var r = e.descriptor;
        if ('field' === e.kind) {
          var i = e.initializer;
          r = {
            enumerable: r.enumerable,
            writable: r.writable,
            configurable: r.configurable,
            value: void 0 === i ? void 0 : i.call(t),
          };
        }
        Object.defineProperty(t, e.key, r);
      },
      decorateClass: function (t, e) {
        var r = [],
          i = [],
          s = { static: [], prototype: [], own: [] };
        if (
          (t.forEach(function (t) {
            this.addElementPlacement(t, s);
          }, this),
          t.forEach(function (t) {
            if (!_hasDecorators(t)) return r.push(t);
            var e = this.decorateElement(t, s);
            r.push(e.element),
              r.push.apply(r, e.extras),
              i.push.apply(i, e.finishers);
          }, this),
          !e)
        )
          return { elements: r, finishers: i };
        var a = this.decorateConstructor(r, e);
        return i.push.apply(i, a.finishers), (a.finishers = i), a;
      },
      addElementPlacement: function (t, e, r) {
        var i = e[t.placement];
        if (!r && -1 !== i.indexOf(t.key))
          throw new TypeError('Duplicated element (' + t.key + ')');
        i.push(t.key);
      },
      decorateElement: function (t, e) {
        for (
          var r = [], i = [], s = t.decorators, a = s.length - 1;
          a >= 0;
          a--
        ) {
          var n = e[t.placement];
          n.splice(n.indexOf(t.key), 1);
          var o = this.fromElementDescriptor(t),
            h = this.toElementFinisherExtras((0, s[a])(o) || o);
          (t = h.element),
            this.addElementPlacement(t, e),
            h.finisher && i.push(h.finisher);
          var l = h.extras;
          if (l) {
            for (var p = 0; p < l.length; p++)
              this.addElementPlacement(l[p], e);
            r.push.apply(r, l);
          }
        }
        return { element: t, finishers: i, extras: r };
      },
      decorateConstructor: function (t, e) {
        for (var r = [], i = e.length - 1; i >= 0; i--) {
          var s = this.fromClassDescriptor(t),
            a = this.toClassDescriptor((0, e[i])(s) || s);
          if (
            (void 0 !== a.finisher && r.push(a.finisher), void 0 !== a.elements)
          ) {
            t = a.elements;
            for (var n = 0; n < t.length - 1; n++)
              for (var o = n + 1; o < t.length; o++)
                if (t[n].key === t[o].key && t[n].placement === t[o].placement)
                  throw new TypeError('Duplicated element (' + t[n].key + ')');
          }
        }
        return { elements: t, finishers: r };
      },
      fromElementDescriptor: function (t) {
        var e = {
          kind: t.kind,
          key: t.key,
          placement: t.placement,
          descriptor: t.descriptor,
        };
        return (
          Object.defineProperty(e, Symbol.toStringTag, {
            value: 'Descriptor',
            configurable: !0,
          }),
          'field' === t.kind && (e.initializer = t.initializer),
          e
        );
      },
      toElementDescriptors: function (t) {
        if (void 0 !== t)
          return _toArray(t).map(function (t) {
            var e = this.toElementDescriptor(t);
            return (
              this.disallowProperty(t, 'finisher', 'An element descriptor'),
              this.disallowProperty(t, 'extras', 'An element descriptor'),
              e
            );
          }, this);
      },
      toElementDescriptor: function (t) {
        var e = String(t.kind);
        if ('method' !== e && 'field' !== e)
          throw new TypeError(
            'An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "' +
              e +
              '"'
          );
        var r = _toPropertyKey(t.key),
          i = String(t.placement);
        if ('static' !== i && 'prototype' !== i && 'own' !== i)
          throw new TypeError(
            'An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "' +
              i +
              '"'
          );
        var s = t.descriptor;
        this.disallowProperty(t, 'elements', 'An element descriptor');
        var a = {
          kind: e,
          key: r,
          placement: i,
          descriptor: Object.assign({}, s),
        };
        return (
          'field' !== e
            ? this.disallowProperty(t, 'initializer', 'A method descriptor')
            : (this.disallowProperty(
                s,
                'get',
                'The property descriptor of a field descriptor'
              ),
              this.disallowProperty(
                s,
                'set',
                'The property descriptor of a field descriptor'
              ),
              this.disallowProperty(
                s,
                'value',
                'The property descriptor of a field descriptor'
              ),
              (a.initializer = t.initializer)),
          a
        );
      },
      toElementFinisherExtras: function (t) {
        return {
          element: this.toElementDescriptor(t),
          finisher: _optionalCallableProperty(t, 'finisher'),
          extras: this.toElementDescriptors(t.extras),
        };
      },
      fromClassDescriptor: function (t) {
        var e = {
          kind: 'class',
          elements: t.map(this.fromElementDescriptor, this),
        };
        return (
          Object.defineProperty(e, Symbol.toStringTag, {
            value: 'Descriptor',
            configurable: !0,
          }),
          e
        );
      },
      toClassDescriptor: function (t) {
        var e = String(t.kind);
        if ('class' !== e)
          throw new TypeError(
            'A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "' +
              e +
              '"'
          );
        this.disallowProperty(t, 'key', 'A class descriptor'),
          this.disallowProperty(t, 'placement', 'A class descriptor'),
          this.disallowProperty(t, 'descriptor', 'A class descriptor'),
          this.disallowProperty(t, 'initializer', 'A class descriptor'),
          this.disallowProperty(t, 'extras', 'A class descriptor');
        var r = _optionalCallableProperty(t, 'finisher');
        return { elements: this.toElementDescriptors(t.elements), finisher: r };
      },
      runClassFinishers: function (t, e) {
        for (var r = 0; r < e.length; r++) {
          var i = (0, e[r])(t);
          if (void 0 !== i) {
            if ('function' != typeof i)
              throw new TypeError('Finishers must return a constructor.');
            t = i;
          }
        }
        return t;
      },
      disallowProperty: function (t, e, r) {
        if (void 0 !== t[e])
          throw new TypeError(r + " can't have a ." + e + ' property.');
      },
    };
    return t;
  }
  function _createElementDescriptor(t) {
    var e,
      r = _toPropertyKey(t.key);
    'method' === t.kind
      ? (e = { value: t.value, writable: !0, configurable: !0, enumerable: !1 })
      : 'get' === t.kind
      ? (e = { get: t.value, configurable: !0, enumerable: !1 })
      : 'set' === t.kind
      ? (e = { set: t.value, configurable: !0, enumerable: !1 })
      : 'field' === t.kind &&
        (e = { configurable: !0, writable: !0, enumerable: !0 });
    var i = {
      kind: 'field' === t.kind ? 'field' : 'method',
      key: r,
      placement: t.static ? 'static' : 'field' === t.kind ? 'own' : 'prototype',
      descriptor: e,
    };
    return (
      t.decorators && (i.decorators = t.decorators),
      'field' === t.kind && (i.initializer = t.value),
      i
    );
  }
  function _coalesceGetterSetter(t, e) {
    void 0 !== t.descriptor.get
      ? (e.descriptor.get = t.descriptor.get)
      : (e.descriptor.set = t.descriptor.set);
  }
  function _coalesceClassElements(t) {
    for (
      var e = [],
        r = function (t) {
          return (
            'method' === t.kind &&
            t.key === a.key &&
            t.placement === a.placement
          );
        },
        i = 0;
      i < t.length;
      i++
    ) {
      var s,
        a = t[i];
      if ('method' === a.kind && (s = e.find(r)))
        if (
          _isDataDescriptor(a.descriptor) ||
          _isDataDescriptor(s.descriptor)
        ) {
          if (_hasDecorators(a) || _hasDecorators(s))
            throw new ReferenceError(
              'Duplicated methods (' + a.key + ") can't be decorated."
            );
          s.descriptor = a.descriptor;
        } else {
          if (_hasDecorators(a)) {
            if (_hasDecorators(s))
              throw new ReferenceError(
                "Decorators can't be placed on different accessors with for the same property (" +
                  a.key +
                  ').'
              );
            s.decorators = a.decorators;
          }
          _coalesceGetterSetter(a, s);
        }
      else e.push(a);
    }
    return e;
  }
  function _hasDecorators(t) {
    return t.decorators && t.decorators.length;
  }
  function _isDataDescriptor(t) {
    return void 0 !== t && !(void 0 === t.value && void 0 === t.writable);
  }
  function _optionalCallableProperty(t, e) {
    var r = t[e];
    if (void 0 !== r && 'function' != typeof r)
      throw new TypeError("Expected '" + e + "' to be a function");
    return r;
  }
  function _classPrivateMethodGet(t, e, r) {
    if (!e.has(t))
      throw new TypeError('attempted to get private field on non-instance');
    return r;
  }
  function _checkPrivateRedeclaration(t, e) {
    if (e.has(t))
      throw new TypeError(
        'Cannot initialize the same private elements twice on an object'
      );
  }
  function _classPrivateFieldInitSpec(t, e, r) {
    _checkPrivateRedeclaration(t, e), e.set(t, r);
  }
  function _classPrivateMethodInitSpec(t, e) {
    _checkPrivateRedeclaration(t, e), e.add(t);
  }
  function _classPrivateMethodSet() {
    throw new TypeError('attempted to reassign private method');
  }
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */ var _extendStatics =
    function (t, e) {
      return (
        (_extendStatics =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, e) {
              t.__proto__ = e;
            }) ||
          function (t, e) {
            for (var r in e)
              Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
          }),
        _extendStatics(t, e)
      );
    };
  function __extends(t, e) {
    if ('function' != typeof e && null !== e)
      throw new TypeError(
        'Class extends value ' + String(e) + ' is not a constructor or null'
      );
    function r() {
      this.constructor = t;
    }
    _extendStatics(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((r.prototype = e.prototype), new r()));
  }
  var _assign = function () {
    return (
      (_assign =
        Object.assign ||
        function (t) {
          for (var e, r = 1, i = arguments.length; r < i; r++)
            for (var s in (e = arguments[r]))
              Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
          return t;
        }),
      _assign.apply(this, arguments)
    );
  };
  function __rest(t, e) {
    var r = {};
    for (var i in t)
      Object.prototype.hasOwnProperty.call(t, i) &&
        e.indexOf(i) < 0 &&
        (r[i] = t[i]);
    if (null != t && 'function' == typeof Object.getOwnPropertySymbols) {
      var s = 0;
      for (i = Object.getOwnPropertySymbols(t); s < i.length; s++)
        e.indexOf(i[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(t, i[s]) &&
          (r[i[s]] = t[i[s]]);
    }
    return r;
  }
  function __decorate(t, e, r, i) {
    var s,
      a = arguments.length,
      n =
        a < 3
          ? e
          : null === i
          ? (i = Object.getOwnPropertyDescriptor(e, r))
          : i;
    if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
      n = Reflect.decorate(t, e, r, i);
    else
      for (var o = t.length - 1; o >= 0; o--)
        (s = t[o]) && (n = (a < 3 ? s(n) : a > 3 ? s(e, r, n) : s(e, r)) || n);
    return a > 3 && n && Object.defineProperty(e, r, n), n;
  }
  function __param(t, e) {
    return function (r, i) {
      e(r, i, t);
    };
  }
  function __metadata(t, e) {
    if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
      return Reflect.metadata(t, e);
  }
  function __awaiter(t, e, r, i) {
    return new (r || (r = Promise))(function (s, a) {
      function n(t) {
        try {
          h(i.next(t));
        } catch (t) {
          a(t);
        }
      }
      function o(t) {
        try {
          h(i.throw(t));
        } catch (t) {
          a(t);
        }
      }
      function h(t) {
        var e;
        t.done
          ? s(t.value)
          : ((e = t.value),
            e instanceof r
              ? e
              : new r(function (t) {
                  t(e);
                })).then(n, o);
      }
      h((i = i.apply(t, e || [])).next());
    });
  }
  function __generator(t, e) {
    var r,
      i,
      s,
      a,
      n = {
        label: 0,
        sent: function () {
          if (1 & s[0]) throw s[1];
          return s[1];
        },
        trys: [],
        ops: [],
      };
    return (
      (a = { next: o(0), throw: o(1), return: o(2) }),
      'function' == typeof Symbol &&
        (a[Symbol.iterator] = function () {
          return this;
        }),
      a
    );
    function o(a) {
      return function (o) {
        return (function (a) {
          if (r) throw new TypeError('Generator is already executing.');
          for (; n; )
            try {
              if (
                ((r = 1),
                i &&
                  (s =
                    2 & a[0]
                      ? i.return
                      : a[0]
                      ? i.throw || ((s = i.return) && s.call(i), 0)
                      : i.next) &&
                  !(s = s.call(i, a[1])).done)
              )
                return s;
              switch (((i = 0), s && (a = [2 & a[0], s.value]), a[0])) {
                case 0:
                case 1:
                  s = a;
                  break;
                case 4:
                  return n.label++, { value: a[1], done: !1 };
                case 5:
                  n.label++, (i = a[1]), (a = [0]);
                  continue;
                case 7:
                  (a = n.ops.pop()), n.trys.pop();
                  continue;
                default:
                  if (
                    !((s = n.trys),
                    (s = s.length > 0 && s[s.length - 1]) ||
                      (6 !== a[0] && 2 !== a[0]))
                  ) {
                    n = 0;
                    continue;
                  }
                  if (3 === a[0] && (!s || (a[1] > s[0] && a[1] < s[3]))) {
                    n.label = a[1];
                    break;
                  }
                  if (6 === a[0] && n.label < s[1]) {
                    (n.label = s[1]), (s = a);
                    break;
                  }
                  if (s && n.label < s[2]) {
                    (n.label = s[2]), n.ops.push(a);
                    break;
                  }
                  s[2] && n.ops.pop(), n.trys.pop();
                  continue;
              }
              a = e.call(t, n);
            } catch (t) {
              (a = [6, t]), (i = 0);
            } finally {
              r = s = 0;
            }
          if (5 & a[0]) throw a[1];
          return { value: a[0] ? a[1] : void 0, done: !0 };
        })([a, o]);
      };
    }
  }
  var __createBinding = Object.create
    ? function (t, e, r, i) {
        void 0 === i && (i = r),
          Object.defineProperty(t, i, {
            enumerable: !0,
            get: function () {
              return e[r];
            },
          });
      }
    : function (t, e, r, i) {
        void 0 === i && (i = r), (t[i] = e[r]);
      };
  function __exportStar(t, e) {
    for (var r in t)
      'default' === r ||
        Object.prototype.hasOwnProperty.call(e, r) ||
        __createBinding(e, t, r);
  }
  function __values(t) {
    var e = 'function' == typeof Symbol && Symbol.iterator,
      r = e && t[e],
      i = 0;
    if (r) return r.call(t);
    if (t && 'number' == typeof t.length)
      return {
        next: function () {
          return (
            t && i >= t.length && (t = void 0), { value: t && t[i++], done: !t }
          );
        },
      };
    throw new TypeError(
      e ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
    );
  }
  function __read(t, e) {
    var r = 'function' == typeof Symbol && t[Symbol.iterator];
    if (!r) return t;
    var i,
      s,
      a = r.call(t),
      n = [];
    try {
      for (; (void 0 === e || e-- > 0) && !(i = a.next()).done; )
        n.push(i.value);
    } catch (t) {
      s = { error: t };
    } finally {
      try {
        i && !i.done && (r = a.return) && r.call(a);
      } finally {
        if (s) throw s.error;
      }
    }
    return n;
  }
  function __spread() {
    for (var t = [], e = 0; e < arguments.length; e++)
      t = t.concat(__read(arguments[e]));
    return t;
  }
  function __spreadArrays() {
    for (var t = 0, e = 0, r = arguments.length; e < r; e++)
      t += arguments[e].length;
    var i = Array(t),
      s = 0;
    for (e = 0; e < r; e++)
      for (var a = arguments[e], n = 0, o = a.length; n < o; n++, s++)
        i[s] = a[n];
    return i;
  }
  function __spreadArray(t, e, r) {
    if (r || 2 === arguments.length)
      for (var i, s = 0, a = e.length; s < a; s++)
        (!i && s in e) ||
          (i || (i = Array.prototype.slice.call(e, 0, s)), (i[s] = e[s]));
    return t.concat(i || Array.prototype.slice.call(e));
  }
  function __await(t) {
    return this instanceof __await ? ((this.v = t), this) : new __await(t);
  }
  function __asyncGenerator(t, e, r) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.');
    var i,
      s = r.apply(t, e || []),
      a = [];
    return (
      (i = {}),
      n('next'),
      n('throw'),
      n('return'),
      (i[Symbol.asyncIterator] = function () {
        return this;
      }),
      i
    );
    function n(t) {
      s[t] &&
        (i[t] = function (e) {
          return new Promise(function (r, i) {
            a.push([t, e, r, i]) > 1 || o(t, e);
          });
        });
    }
    function o(t, e) {
      try {
        !(function (t) {
          t.value instanceof __await
            ? Promise.resolve(t.value.v).then(h, l)
            : p(a[0][2], t);
        })(s[t](e));
      } catch (t) {
        p(a[0][3], t);
      }
    }
    function h(t) {
      o('next', t);
    }
    function l(t) {
      o('throw', t);
    }
    function p(t, e) {
      t(e), a.shift(), a.length && o(a[0][0], a[0][1]);
    }
  }
  function __asyncDelegator(t) {
    var e, r;
    return (
      (e = {}),
      i('next'),
      i('throw', function (t) {
        throw t;
      }),
      i('return'),
      (e[Symbol.iterator] = function () {
        return this;
      }),
      e
    );
    function i(i, s) {
      e[i] = t[i]
        ? function (e) {
            return (r = !r)
              ? { value: __await(t[i](e)), done: 'return' === i }
              : s
              ? s(e)
              : e;
          }
        : s;
    }
  }
  function __asyncValues(t) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.');
    var e,
      r = t[Symbol.asyncIterator];
    return r
      ? r.call(t)
      : ((t =
          'function' == typeof __values ? __values(t) : t[Symbol.iterator]()),
        (e = {}),
        i('next'),
        i('throw'),
        i('return'),
        (e[Symbol.asyncIterator] = function () {
          return this;
        }),
        e);
    function i(r) {
      e[r] =
        t[r] &&
        function (e) {
          return new Promise(function (i, s) {
            (function (t, e, r, i) {
              Promise.resolve(i).then(function (e) {
                t({ value: e, done: r });
              }, e);
            })(i, s, (e = t[r](e)).done, e.value);
          });
        };
    }
  }
  function __makeTemplateObject(t, e) {
    return (
      Object.defineProperty
        ? Object.defineProperty(t, 'raw', { value: e })
        : (t.raw = e),
      t
    );
  }
  var __setModuleDefault = Object.create
    ? function (t, e) {
        Object.defineProperty(t, 'default', { enumerable: !0, value: e });
      }
    : function (t, e) {
        t.default = e;
      };
  function __importStar(t) {
    if (t && t.__esModule) return t;
    var e = {};
    if (null != t)
      for (var r in t)
        'default' !== r &&
          Object.prototype.hasOwnProperty.call(t, r) &&
          __createBinding(e, t, r);
    return __setModuleDefault(e, t), e;
  }
  function __importDefault(t) {
    return t && t.__esModule ? t : { default: t };
  }
  function __classPrivateFieldGet(t, e, r, i) {
    if ('a' === r && !i)
      throw new TypeError('Private accessor was defined without a getter');
    if ('function' == typeof e ? t !== e || !i : !e.has(t))
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      );
    return 'm' === r ? i : 'a' === r ? i.call(t) : i ? i.value : e.get(t);
  }
  function __classPrivateFieldSet(t, e, r, i, s) {
    if ('m' === i) throw new TypeError('Private method is not writable');
    if ('a' === i && !s)
      throw new TypeError('Private accessor was defined without a setter');
    if ('function' == typeof e ? t !== e || !s : !e.has(t))
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it'
      );
    return 'a' === i ? s.call(t, r) : s ? (s.value = r) : e.set(t, r), r;
    /**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
  }
  var t$3 =
      window.ShadowRoot &&
      (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
      'adoptedStyleSheets' in Document.prototype &&
      'replace' in CSSStyleSheet.prototype,
    e$8 = Symbol(),
    n$5 = new Map();
  class s$3 {
    constructor(t, e) {
      if (((this._$cssResult$ = !0), e !== e$8))
        throw Error(
          'CSSResult is not constructable. Use `unsafeCSS` or `css` instead.'
        );
      this.cssText = t;
    }
    get styleSheet() {
      var t = n$5.get(this.cssText);
      return (
        t$3 &&
          void 0 === t &&
          (n$5.set(this.cssText, (t = new CSSStyleSheet())),
          t.replaceSync(this.cssText)),
        t
      );
    }
    toString() {
      return this.cssText;
    }
  }
  var o$5 = (t) => new s$3('string' == typeof t ? t : t + '', e$8),
    r$3 = function (t) {
      for (
        var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), i = 1;
        i < e;
        i++
      )
        r[i - 1] = arguments[i];
      var s =
        1 === t.length
          ? t[0]
          : r.reduce(
              (e, r, i) =>
                e +
                ((t) => {
                  if (!0 === t._$cssResult$) return t.cssText;
                  if ('number' == typeof t) return t;
                  throw Error(
                    "Value passed to 'css' function must be a 'css' function result: " +
                      t +
                      ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                  );
                })(r) +
                t[i + 1],
              t[0]
            );
      return new s$3(s, e$8);
    },
    i$3 = (t, e) => {
      t$3
        ? (t.adoptedStyleSheets = e.map((t) =>
            t instanceof CSSStyleSheet ? t : t.styleSheet
          ))
        : e.forEach((e) => {
            var r = document.createElement('style'),
              i = window.litNonce;
            void 0 !== i && r.setAttribute('nonce', i),
              (r.textContent = e.cssText),
              t.appendChild(r);
          });
    },
    S$1 = t$3
      ? (t) => t
      : (t) =>
          t instanceof CSSStyleSheet
            ? ((t) => {
                var e = '';
                for (var r of t.cssRules) e += r.cssText;
                return o$5(e);
              })(t)
            : t,
    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */ s$2,
    e$7 = window.trustedTypes,
    r$2 = e$7 ? e$7.emptyScript : '',
    h$2 = window.reactiveElementPolyfillSupport,
    o$4 = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? r$2 : null;
            break;
          case Object:
          case Array:
            t = null == t ? t : JSON.stringify(t);
        }
        return t;
      },
      fromAttribute(t, e) {
        var r = t;
        switch (e) {
          case Boolean:
            r = null !== t;
            break;
          case Number:
            r = null === t ? null : Number(t);
            break;
          case Object:
          case Array:
            try {
              r = JSON.parse(t);
            } catch (t) {
              r = null;
            }
        }
        return r;
      },
    },
    n$4 = (t, e) => e !== t && (e == e || t == t),
    l$3 = {
      attribute: !0,
      type: String,
      converter: o$4,
      reflect: !1,
      hasChanged: n$4,
    },
    t$2;
  class a$1 extends HTMLElement {
    constructor() {
      super(),
        (this._$Et = new Map()),
        (this.isUpdatePending = !1),
        (this.hasUpdated = !1),
        (this._$Ei = null),
        this.o();
    }
    static addInitializer(t) {
      var e;
      (null !== (e = this.l) && void 0 !== e) || (this.l = []), this.l.push(t);
    }
    static get observedAttributes() {
      this.finalize();
      var t = [];
      return (
        this.elementProperties.forEach((e, r) => {
          var i = this._$Eh(r, e);
          void 0 !== i && (this._$Eu.set(i, r), t.push(i));
        }),
        t
      );
    }
    static createProperty(t) {
      var e =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : l$3;
      if (
        (e.state && (e.attribute = !1),
        this.finalize(),
        this.elementProperties.set(t, e),
        !e.noAccessor && !this.prototype.hasOwnProperty(t))
      ) {
        var r = 'symbol' == typeof t ? Symbol() : '__' + t,
          i = this.getPropertyDescriptor(t, r, e);
        void 0 !== i && Object.defineProperty(this.prototype, t, i);
      }
    }
    static getPropertyDescriptor(t, e, r) {
      return {
        get() {
          return this[e];
        },
        set(i) {
          var s = this[t];
          (this[e] = i), this.requestUpdate(t, s, r);
        },
        configurable: !0,
        enumerable: !0,
      };
    }
    static getPropertyOptions(t) {
      return this.elementProperties.get(t) || l$3;
    }
    static finalize() {
      if (this.hasOwnProperty('finalized')) return !1;
      this.finalized = !0;
      var t = Object.getPrototypeOf(this);
      if (
        (t.finalize(),
        (this.elementProperties = new Map(t.elementProperties)),
        (this._$Eu = new Map()),
        this.hasOwnProperty('properties'))
      ) {
        var e = this.properties,
          r = [
            ...Object.getOwnPropertyNames(e),
            ...Object.getOwnPropertySymbols(e),
          ];
        for (var i of r) this.createProperty(i, e[i]);
      }
      return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
    }
    static finalizeStyles(t) {
      var e = [];
      if (Array.isArray(t)) {
        var r = new Set(t.flat(1 / 0).reverse());
        for (var i of r) e.unshift(S$1(i));
      } else void 0 !== t && e.push(S$1(t));
      return e;
    }
    static _$Eh(t, e) {
      var r = e.attribute;
      return !1 === r
        ? void 0
        : 'string' == typeof r
        ? r
        : 'string' == typeof t
        ? t.toLowerCase()
        : void 0;
    }
    o() {
      var t;
      (this._$Ep = new Promise((t) => (this.enableUpdating = t))),
        (this._$AL = new Map()),
        this._$Em(),
        this.requestUpdate(),
        null === (t = this.constructor.l) ||
          void 0 === t ||
          t.forEach((t) => t(this));
    }
    addController(t) {
      var e, r;
      (null !== (e = this._$Eg) && void 0 !== e ? e : (this._$Eg = [])).push(t),
        void 0 !== this.renderRoot &&
          this.isConnected &&
          (null === (r = t.hostConnected) || void 0 === r || r.call(t));
    }
    removeController(t) {
      var e;
      null === (e = this._$Eg) ||
        void 0 === e ||
        e.splice(this._$Eg.indexOf(t) >>> 0, 1);
    }
    _$Em() {
      this.constructor.elementProperties.forEach((t, e) => {
        this.hasOwnProperty(e) && (this._$Et.set(e, this[e]), delete this[e]);
      });
    }
    createRenderRoot() {
      var t,
        e =
          null !== (t = this.shadowRoot) && void 0 !== t
            ? t
            : this.attachShadow(this.constructor.shadowRootOptions);
      return i$3(e, this.constructor.elementStyles), e;
    }
    connectedCallback() {
      var t;
      void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()),
        this.enableUpdating(!0),
        null === (t = this._$Eg) ||
          void 0 === t ||
          t.forEach((t) => {
            var e;
            return null === (e = t.hostConnected) || void 0 === e
              ? void 0
              : e.call(t);
          });
    }
    enableUpdating(t) {}
    disconnectedCallback() {
      var t;
      null === (t = this._$Eg) ||
        void 0 === t ||
        t.forEach((t) => {
          var e;
          return null === (e = t.hostDisconnected) || void 0 === e
            ? void 0
            : e.call(t);
        });
    }
    attributeChangedCallback(t, e, r) {
      this._$AK(t, r);
    }
    _$ES(t, e) {
      var r,
        i,
        s =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : l$3,
        a = this.constructor._$Eh(t, s);
      if (void 0 !== a && !0 === s.reflect) {
        var n = (
          null !==
            (i =
              null === (r = s.converter) || void 0 === r
                ? void 0
                : r.toAttribute) && void 0 !== i
            ? i
            : o$4.toAttribute
        )(e, s.type);
        (this._$Ei = t),
          null == n ? this.removeAttribute(a) : this.setAttribute(a, n),
          (this._$Ei = null);
      }
    }
    _$AK(t, e) {
      var r,
        i,
        s,
        a = this.constructor,
        n = a._$Eu.get(t);
      if (void 0 !== n && this._$Ei !== n) {
        var o = a.getPropertyOptions(n),
          h = o.converter,
          l =
            null !==
              (s =
                null !==
                  (i =
                    null === (r = h) || void 0 === r
                      ? void 0
                      : r.fromAttribute) && void 0 !== i
                  ? i
                  : 'function' == typeof h
                  ? h
                  : null) && void 0 !== s
              ? s
              : o$4.fromAttribute;
        (this._$Ei = n), (this[n] = l(e, o.type)), (this._$Ei = null);
      }
    }
    requestUpdate(t, e, r) {
      var i = !0;
      void 0 !== t &&
        (((r = r || this.constructor.getPropertyOptions(t)).hasChanged || n$4)(
          this[t],
          e
        )
          ? (this._$AL.has(t) || this._$AL.set(t, e),
            !0 === r.reflect &&
              this._$Ei !== t &&
              (void 0 === this._$E_ && (this._$E_ = new Map()),
              this._$E_.set(t, r)))
          : (i = !1)),
        !this.isUpdatePending && i && (this._$Ep = this._$EC());
    }
    _$EC() {
      var t = this;
      return _asyncToGenerator(function* () {
        t.isUpdatePending = !0;
        try {
          yield t._$Ep;
        } catch (e) {
          Promise.reject(e);
        }
        var e = t.scheduleUpdate();
        return null != e && (yield e), !t.isUpdatePending;
      })();
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var t;
      if (this.isUpdatePending) {
        this.hasUpdated,
          this._$Et &&
            (this._$Et.forEach((t, e) => (this[e] = t)), (this._$Et = void 0));
        var e = !1,
          r = this._$AL;
        try {
          (e = this.shouldUpdate(r))
            ? (this.willUpdate(r),
              null === (t = this._$Eg) ||
                void 0 === t ||
                t.forEach((t) => {
                  var e;
                  return null === (e = t.hostUpdate) || void 0 === e
                    ? void 0
                    : e.call(t);
                }),
              this.update(r))
            : this._$EU();
        } catch (t) {
          throw ((e = !1), this._$EU(), t);
        }
        e && this._$AE(r);
      }
    }
    willUpdate(t) {}
    _$AE(t) {
      var e;
      null === (e = this._$Eg) ||
        void 0 === e ||
        e.forEach((t) => {
          var e;
          return null === (e = t.hostUpdated) || void 0 === e
            ? void 0
            : e.call(t);
        }),
        this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
        this.updated(t);
    }
    _$EU() {
      (this._$AL = new Map()), (this.isUpdatePending = !1);
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$Ep;
    }
    shouldUpdate(t) {
      return !0;
    }
    update(t) {
      void 0 !== this._$E_ &&
        (this._$E_.forEach((t, e) => this._$ES(e, this[e], t)),
        (this._$E_ = void 0)),
        this._$EU();
    }
    updated(t) {}
    firstUpdated(t) {}
  }
  (a$1.finalized = !0),
    (a$1.elementProperties = new Map()),
    (a$1.elementStyles = []),
    (a$1.shadowRootOptions = { mode: 'open' }),
    null == h$2 || h$2({ ReactiveElement: a$1 }),
    (null !== (s$2 = globalThis.reactiveElementVersions) && void 0 !== s$2
      ? s$2
      : (globalThis.reactiveElementVersions = [])
    ).push('1.2.1');
  var i$2 = globalThis.trustedTypes,
    s$1 = i$2 ? i$2.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
    e$6 = 'lit$'.concat((Math.random() + '').slice(9), '$'),
    o$3 = '?' + e$6,
    n$3 = '<'.concat(o$3, '>'),
    l$2 = document,
    h$1 = function () {
      var t =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '';
      return l$2.createComment(t);
    },
    r$1 = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
    d = Array.isArray,
    u = (t) => {
      var e;
      return (
        d(t) ||
        'function' ==
          typeof (null === (e = t) || void 0 === e
            ? void 0
            : e[Symbol.iterator])
      );
    },
    c = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    v = /-->/g,
    a = />/g,
    f =
      />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,
    _ = /'/g,
    m = /"/g,
    g = /^(?:script|style|textarea)$/i,
    p = (t) =>
      function (e) {
        for (
          var r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), s = 1;
          s < r;
          s++
        )
          i[s - 1] = arguments[s];
        return { _$litType$: t, strings: e, values: i };
      },
    $ = p(1),
    y = p(2),
    b = Symbol.for('lit-noChange'),
    w = Symbol.for('lit-nothing'),
    T = new WeakMap(),
    x = (t, e, r) => {
      var i,
        s,
        a =
          null !== (i = null == r ? void 0 : r.renderBefore) && void 0 !== i
            ? i
            : e,
        n = a._$litPart$;
      if (void 0 === n) {
        var o =
          null !== (s = null == r ? void 0 : r.renderBefore) && void 0 !== s
            ? s
            : null;
        a._$litPart$ = n = new N(
          e.insertBefore(h$1(), o),
          o,
          void 0,
          null != r ? r : {}
        );
      }
      return n._$AI(t), n;
    },
    A = l$2.createTreeWalker(l$2, 129, null, !1),
    C = (t, e) => {
      for (
        var r,
          i = t.length - 1,
          s = [],
          n = 2 === e ? '<svg>' : '',
          o = c,
          h = 0;
        h < i;
        h++
      ) {
        for (
          var l = t[h], p = void 0, d = void 0, u = -1, y = 0;
          y < l.length && ((o.lastIndex = y), null !== (d = o.exec(l)));

        )
          (y = o.lastIndex),
            o === c
              ? '!--' === d[1]
                ? (o = v)
                : void 0 !== d[1]
                ? (o = a)
                : void 0 !== d[2]
                ? (g.test(d[2]) && (r = RegExp('</' + d[2], 'g')), (o = f))
                : void 0 !== d[3] && (o = f)
              : o === f
              ? '>' === d[0]
                ? ((o = null != r ? r : c), (u = -1))
                : void 0 === d[1]
                ? (u = -2)
                : ((u = o.lastIndex - d[2].length),
                  (p = d[1]),
                  (o = void 0 === d[3] ? f : '"' === d[3] ? m : _))
              : o === m || o === _
              ? (o = f)
              : o === v || o === a
              ? (o = c)
              : ((o = f), (r = void 0));
        var b = o === f && t[h + 1].startsWith('/>') ? ' ' : '';
        n +=
          o === c
            ? l + n$3
            : u >= 0
            ? (s.push(p), l.slice(0, u) + '$lit$' + l.slice(u) + e$6 + b)
            : l + e$6 + (-2 === u ? (s.push(void 0), h) : b);
      }
      var P = n + (t[i] || '<?>') + (2 === e ? '</svg>' : '');
      if (!Array.isArray(t) || !t.hasOwnProperty('raw'))
        throw Error('invalid template strings array');
      return [void 0 !== s$1 ? s$1.createHTML(P) : P, s];
    };
  class E {
    constructor(t, e) {
      var r,
        { strings: i, _$litType$: s } = t;
      this.parts = [];
      var a = 0,
        n = 0,
        o = i.length - 1,
        h = this.parts,
        [l, p] = C(i, s);
      if (
        ((this.el = E.createElement(l, e)),
        (A.currentNode = this.el.content),
        2 === s)
      ) {
        var c = this.el.content,
          f = c.firstChild;
        f.remove(), c.append(...f.childNodes);
      }
      for (; null !== (r = A.nextNode()) && h.length < o; ) {
        if (1 === r.nodeType) {
          if (r.hasAttributes()) {
            var d = [];
            for (var m of r.getAttributeNames())
              if (m.endsWith('$lit$') || m.startsWith(e$6)) {
                var u = p[n++];
                if ((d.push(m), void 0 !== u)) {
                  var y = r.getAttribute(u.toLowerCase() + '$lit$').split(e$6),
                    v = /([.?@])?(.*)/.exec(u);
                  h.push({
                    type: 1,
                    index: a,
                    name: v[2],
                    strings: y,
                    ctor:
                      '.' === v[1]
                        ? M
                        : '?' === v[1]
                        ? H
                        : '@' === v[1]
                        ? I
                        : S,
                  });
                } else h.push({ type: 6, index: a });
              }
            for (var b of d) r.removeAttribute(b);
          }
          if (g.test(r.tagName)) {
            var _ = r.textContent.split(e$6),
              P = _.length - 1;
            if (P > 0) {
              r.textContent = i$2 ? i$2.emptyScript : '';
              for (var x = 0; x < P; x++)
                r.append(_[x], h$1()),
                  A.nextNode(),
                  h.push({ type: 2, index: ++a });
              r.append(_[P], h$1());
            }
          }
        } else if (8 === r.nodeType)
          if (r.data === o$3) h.push({ type: 2, index: a });
          else
            for (var w = -1; -1 !== (w = r.data.indexOf(e$6, w + 1)); )
              h.push({ type: 7, index: a }), (w += e$6.length - 1);
        a++;
      }
    }
    static createElement(t, e) {
      var r = l$2.createElement('template');
      return (r.innerHTML = t), r;
    }
  }
  function P(t, e) {
    var r,
      i,
      s,
      a,
      n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : t,
      o = arguments.length > 3 ? arguments[3] : void 0;
    if (e === b) return e;
    var h =
        void 0 !== o
          ? null === (r = n._$Cl) || void 0 === r
            ? void 0
            : r[o]
          : n._$Cu,
      l = r$1(e) ? void 0 : e._$litDirective$;
    return (
      (null == h ? void 0 : h.constructor) !== l &&
        (null === (i = null == h ? void 0 : h._$AO) ||
          void 0 === i ||
          i.call(h, !1),
        void 0 === l ? (h = void 0) : (h = new l(t))._$AT(t, n, o),
        void 0 !== o
          ? ((null !== (s = (a = n)._$Cl) && void 0 !== s ? s : (a._$Cl = []))[
              o
            ] = h)
          : (n._$Cu = h)),
      void 0 !== h && (e = P(t, h._$AS(t, e.values), h, o)),
      e
    );
  }
  class V {
    constructor(t, e) {
      (this.v = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = e);
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    p(t) {
      var e,
        {
          el: { content: r },
          parts: i,
        } = this._$AD,
        s = (
          null !== (e = null == t ? void 0 : t.creationScope) && void 0 !== e
            ? e
            : l$2
        ).importNode(r, !0);
      A.currentNode = s;
      for (var a = A.nextNode(), n = 0, o = 0, h = i[0]; void 0 !== h; ) {
        if (n === h.index) {
          var l = void 0;
          2 === h.type
            ? (l = new N(a, a.nextSibling, this, t))
            : 1 === h.type
            ? (l = new h.ctor(a, h.name, h.strings, this, t))
            : 6 === h.type && (l = new L(a, this, t)),
            this.v.push(l),
            (h = i[++o]);
        }
        n !== (null == h ? void 0 : h.index) && ((a = A.nextNode()), n++);
      }
      return s;
    }
    m(t) {
      var e = 0;
      for (var r of this.v)
        void 0 !== r &&
          (void 0 !== r.strings
            ? (r._$AI(t, r, e), (e += r.strings.length - 2))
            : r._$AI(t[e])),
          e++;
    }
  }
  class N {
    constructor(t, e, r, i) {
      var s;
      (this.type = 2),
        (this._$AH = w),
        (this._$AN = void 0),
        (this._$AA = t),
        (this._$AB = e),
        (this._$AM = r),
        (this.options = i),
        (this._$Cg =
          null === (s = null == i ? void 0 : i.isConnected) ||
          void 0 === s ||
          s);
    }
    get _$AU() {
      var t, e;
      return null !==
        (e = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) &&
        void 0 !== e
        ? e
        : this._$Cg;
    }
    get parentNode() {
      var t = this._$AA.parentNode,
        e = this._$AM;
      return void 0 !== e && 11 === t.nodeType && (t = e.parentNode), t;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t) {
      (t = P(
        this,
        t,
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this
      )),
        r$1(t)
          ? t === w || null == t || '' === t
            ? (this._$AH !== w && this._$AR(), (this._$AH = w))
            : t !== this._$AH && t !== b && this.$(t)
          : void 0 !== t._$litType$
          ? this.T(t)
          : void 0 !== t.nodeType
          ? this.S(t)
          : u(t)
          ? this.A(t)
          : this.$(t);
    }
    M(t) {
      var e =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : this._$AB;
      return this._$AA.parentNode.insertBefore(t, e);
    }
    S(t) {
      this._$AH !== t && (this._$AR(), (this._$AH = this.M(t)));
    }
    $(t) {
      this._$AH !== w && r$1(this._$AH)
        ? (this._$AA.nextSibling.data = t)
        : this.S(l$2.createTextNode(t)),
        (this._$AH = t);
    }
    T(t) {
      var e,
        { values: r, _$litType$: i } = t,
        s =
          'number' == typeof i
            ? this._$AC(t)
            : (void 0 === i.el && (i.el = E.createElement(i.h, this.options)),
              i);
      if ((null === (e = this._$AH) || void 0 === e ? void 0 : e._$AD) === s)
        this._$AH.m(r);
      else {
        var a = new V(s, this),
          n = a.p(this.options);
        a.m(r), this.S(n), (this._$AH = a);
      }
    }
    _$AC(t) {
      var e = T.get(t.strings);
      return void 0 === e && T.set(t.strings, (e = new E(t))), e;
    }
    A(t) {
      d(this._$AH) || ((this._$AH = []), this._$AR());
      var e,
        r = this._$AH,
        i = 0;
      for (var s of t)
        i === r.length
          ? r.push(
              (e = new N(this.M(h$1()), this.M(h$1()), this, this.options))
            )
          : (e = r[i]),
          e._$AI(s),
          i++;
      i < r.length && (this._$AR(e && e._$AB.nextSibling, i), (r.length = i));
    }
    _$AR() {
      var t,
        e =
          arguments.length > 0 && void 0 !== arguments[0]
            ? arguments[0]
            : this._$AA.nextSibling,
        r = arguments.length > 1 ? arguments[1] : void 0;
      for (
        null === (t = this._$AP) || void 0 === t || t.call(this, !1, !0, r);
        e && e !== this._$AB;

      ) {
        var i = e.nextSibling;
        e.remove(), (e = i);
      }
    }
    setConnected(t) {
      var e;
      void 0 === this._$AM &&
        ((this._$Cg = t),
        null === (e = this._$AP) || void 0 === e || e.call(this, t));
    }
  }
  class S {
    constructor(t, e, r, i, s) {
      (this.type = 1),
        (this._$AH = w),
        (this._$AN = void 0),
        (this.element = t),
        (this.name = e),
        (this._$AM = i),
        (this.options = s),
        r.length > 2 || '' !== r[0] || '' !== r[1]
          ? ((this._$AH = Array(r.length - 1).fill(new String())),
            (this.strings = r))
          : (this._$AH = w);
    }
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      var e =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this,
        r = arguments.length > 2 ? arguments[2] : void 0,
        i = arguments.length > 3 ? arguments[3] : void 0,
        s = this.strings,
        a = !1;
      if (void 0 === s)
        (t = P(this, t, e, 0)),
          (a = !r$1(t) || (t !== this._$AH && t !== b)) && (this._$AH = t);
      else {
        var n,
          o,
          h = t;
        for (t = s[0], n = 0; n < s.length - 1; n++)
          (o = P(this, h[r + n], e, n)) === b && (o = this._$AH[n]),
            a || (a = !r$1(o) || o !== this._$AH[n]),
            o === w
              ? (t = w)
              : t !== w && (t += (null != o ? o : '') + s[n + 1]),
            (this._$AH[n] = o);
      }
      a && !i && this.k(t);
    }
    k(t) {
      t === w
        ? this.element.removeAttribute(this.name)
        : this.element.setAttribute(this.name, null != t ? t : '');
    }
  }
  class M extends S {
    constructor() {
      super(...arguments), (this.type = 3);
    }
    k(t) {
      this.element[this.name] = t === w ? void 0 : t;
    }
  }
  var k = i$2 ? i$2.emptyScript : '';
  class H extends S {
    constructor() {
      super(...arguments), (this.type = 4);
    }
    k(t) {
      t && t !== w
        ? this.element.setAttribute(this.name, k)
        : this.element.removeAttribute(this.name);
    }
  }
  class I extends S {
    constructor(t, e, r, i, s) {
      super(t, e, r, i, s), (this.type = 5);
    }
    _$AI(t) {
      var e;
      if (
        (t =
          null !==
            (e = P(
              this,
              t,
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : this,
              0
            )) && void 0 !== e
            ? e
            : w) !== b
      ) {
        var r = this._$AH,
          i =
            (t === w && r !== w) ||
            t.capture !== r.capture ||
            t.once !== r.once ||
            t.passive !== r.passive,
          s = t !== w && (r === w || i);
        i && this.element.removeEventListener(this.name, this, r),
          s && this.element.addEventListener(this.name, this, t),
          (this._$AH = t);
      }
    }
    handleEvent(t) {
      var e, r;
      'function' == typeof this._$AH
        ? this._$AH.call(
            null !==
              (r =
                null === (e = this.options) || void 0 === e
                  ? void 0
                  : e.host) && void 0 !== r
              ? r
              : this.element,
            t
          )
        : this._$AH.handleEvent(t);
    }
  }
  class L {
    constructor(t, e, r) {
      (this.element = t),
        (this.type = 6),
        (this._$AN = void 0),
        (this._$AM = e),
        (this.options = r);
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      P(this, t);
    }
  }
  var R = {
      P: '$lit$',
      V: e$6,
      L: o$3,
      I: 1,
      N: C,
      R: V,
      D: u,
      j: P,
      H: N,
      O: S,
      F: H,
      B: I,
      W: M,
      Z: L,
    },
    z = window.litHtmlPolyfillSupport,
    l$1,
    o$2;
  null == z || z(E, N),
    (null !== (t$2 = globalThis.litHtmlVersions) && void 0 !== t$2
      ? t$2
      : (globalThis.litHtmlVersions = [])
    ).push('2.1.2');
  var r = a$1;
  class s extends a$1 {
    constructor() {
      super(...arguments),
        (this.renderOptions = { host: this }),
        (this._$Dt = void 0);
    }
    createRenderRoot() {
      var t,
        e,
        r = super.createRenderRoot();
      return (
        (null !== (t = (e = this.renderOptions).renderBefore) &&
          void 0 !== t) ||
          (e.renderBefore = r.firstChild),
        r
      );
    }
    update(t) {
      var e = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
        super.update(t),
        (this._$Dt = x(e, this.renderRoot, this.renderOptions));
    }
    connectedCallback() {
      var t;
      super.connectedCallback(),
        null === (t = this._$Dt) || void 0 === t || t.setConnected(!0);
    }
    disconnectedCallback() {
      var t;
      super.disconnectedCallback(),
        null === (t = this._$Dt) || void 0 === t || t.setConnected(!1);
    }
    render() {
      return b;
    }
  }
  (s.finalized = !0),
    (s._$litElement$ = !0),
    null === (l$1 = globalThis.litElementHydrateSupport) ||
      void 0 === l$1 ||
      l$1.call(globalThis, { LitElement: s });
  var n$2 = globalThis.litElementPolyfillSupport;
  null == n$2 || n$2({ LitElement: s });
  var h = {
    _$AK: (t, e, r) => {
      t._$AK(e, r);
    },
    _$AL: (t) => t._$AL,
  };
  (null !== (o$2 = globalThis.litElementVersions) && void 0 !== o$2
    ? o$2
    : (globalThis.litElementVersions = [])
  ).push('3.1.2');
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var n$1 = (t) => (e) =>
      'function' == typeof e
        ? ((t, e) => (window.customElements.define(t, e), e))(t, e)
        : ((t, e) => {
            var { kind: r, elements: i } = e;
            return {
              kind: r,
              elements: i,
              finisher(e) {
                window.customElements.define(t, e);
              },
            };
          })(t, e),
    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */ i$1 = (t, e) =>
      'method' === e.kind && e.descriptor && !('value' in e.descriptor)
        ? _objectSpread2(
            _objectSpread2({}, e),
            {},
            {
              finisher(r) {
                r.createProperty(e.key, t);
              },
            }
          )
        : {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            originalKey: e.key,
            initializer() {
              'function' == typeof e.initializer &&
                (this[e.key] = e.initializer.call(this));
            },
            finisher(r) {
              r.createProperty(e.key, t);
            },
          };
  function e$5(t) {
    return (e, r) =>
      void 0 !== r
        ? ((t, e, r) => {
            e.constructor.createProperty(r, t);
          })(t, e, r)
        : i$1(t, e);
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ function t$1(t) {
    return e$5(_objectSpread2(_objectSpread2({}, t), {}, { state: !0 }));
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ var e$4 = (t, e, r) => {
      Object.defineProperty(e, r, t);
    },
    t = (t, e) => ({
      kind: 'method',
      placement: 'prototype',
      key: e.key,
      descriptor: t,
    }),
    o$1 = (t) => {
      var { finisher: e, descriptor: r } = t;
      return (t, i) => {
        var s;
        if (void 0 === i) {
          var a = null !== (s = t.originalKey) && void 0 !== s ? s : t.key,
            n =
              null != r
                ? {
                    kind: 'method',
                    placement: 'prototype',
                    key: a,
                    descriptor: r(t.key),
                  }
                : _objectSpread2(_objectSpread2({}, t), {}, { key: a });
          return (
            null != e &&
              (n.finisher = function (t) {
                e(t, a);
              }),
            n
          );
        }
        var o = t.constructor;
        void 0 !== r && Object.defineProperty(t, i, r(i)), null == e || e(o, i);
      };
    },
    n;
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ function e$3(t) {
    return o$1({
      finisher: (e, r) => {
        Object.assign(e.prototype[r], t);
      },
    });
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ function i(t, e) {
    return o$1({
      descriptor: (r) => {
        var i = {
          get() {
            var e, r;
            return null !==
              (r =
                null === (e = this.renderRoot) || void 0 === e
                  ? void 0
                  : e.querySelector(t)) && void 0 !== r
              ? r
              : null;
          },
          enumerable: !0,
          configurable: !0,
        };
        if (e) {
          var s = 'symbol' == typeof r ? Symbol() : '__' + r;
          i.get = function () {
            var e, r;
            return (
              void 0 === this[s] &&
                (this[s] =
                  null !==
                    (r =
                      null === (e = this.renderRoot) || void 0 === e
                        ? void 0
                        : e.querySelector(t)) && void 0 !== r
                    ? r
                    : null),
              this[s]
            );
          };
        }
        return i;
      },
    });
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ function e$2(t) {
    return o$1({
      descriptor: (e) => ({
        get() {
          var e, r;
          return null !==
            (r =
              null === (e = this.renderRoot) || void 0 === e
                ? void 0
                : e.querySelectorAll(t)) && void 0 !== r
            ? r
            : [];
        },
        enumerable: !0,
        configurable: !0,
      }),
    });
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ function e$1(t) {
    return o$1({
      descriptor: (e) => ({
        get() {
          var e = this;
          return _asyncToGenerator(function* () {
            var r;
            return (
              yield e.updateComplete,
              null === (r = e.renderRoot) || void 0 === r
                ? void 0
                : r.querySelector(t)
            );
          })();
        },
        enumerable: !0,
        configurable: !0,
      }),
    });
  }
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ var e =
    null !=
    (null === (n = window.HTMLSlotElement) || void 0 === n
      ? void 0
      : n.prototype.assignedElements)
      ? (t, e) => t.assignedElements(e)
      : (t, e) =>
          t.assignedNodes(e).filter((t) => t.nodeType === Node.ELEMENT_NODE);
  function l(t) {
    var { slot: r, selector: i } = null != t ? t : {};
    return o$1({
      descriptor: (s) => ({
        get() {
          var s,
            a = 'slot' + (r ? '[name='.concat(r, ']') : ':not([name])'),
            n =
              null === (s = this.renderRoot) || void 0 === s
                ? void 0
                : s.querySelector(a),
            o = null != n ? e(n, t) : [];
          return i ? o.filter((t) => t.matches(i)) : o;
        },
        enumerable: !0,
        configurable: !0,
      }),
    });
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ function o(t, e, r) {
    var i,
      s = t;
    return (
      'object' == typeof t ? ((s = t.slot), (i = t)) : (i = { flatten: e }),
      r
        ? l({ slot: s, flatten: e, selector: r })
        : o$1({
            descriptor: (t) => ({
              get() {
                var t,
                  e,
                  r = 'slot' + (s ? '[name='.concat(s, ']') : ':not([name])'),
                  a =
                    null === (t = this.renderRoot) || void 0 === t
                      ? void 0
                      : t.querySelector(r);
                return null !== (e = null == a ? void 0 : a.assignedNodes(i)) &&
                  void 0 !== e
                  ? e
                  : [];
              },
              enumerable: !0,
              configurable: !0,
            }),
          })
    );
  }
  var commonjsGlobal =
    'undefined' != typeof globalThis
      ? globalThis
      : 'undefined' != typeof window
      ? window
      : 'undefined' != typeof global
      ? global
      : 'undefined' != typeof self
      ? self
      : {};
  function getDefaultExportFromCjs(t) {
    return t &&
      t.__esModule &&
      Object.prototype.hasOwnProperty.call(t, 'default')
      ? t.default
      : t;
  }
  function getDefaultExportFromNamespaceIfPresent(t) {
    return t && Object.prototype.hasOwnProperty.call(t, 'default')
      ? t.default
      : t;
  }
  function getDefaultExportFromNamespaceIfNotNamed(t) {
    return t &&
      Object.prototype.hasOwnProperty.call(t, 'default') &&
      1 === Object.keys(t).length
      ? t.default
      : t;
  }
  function getAugmentedNamespace(t) {
    if (t.__esModule) return t;
    var e = Object.defineProperty({}, '__esModule', { value: !0 });
    return (
      Object.keys(t).forEach(function (r) {
        var i = Object.getOwnPropertyDescriptor(t, r);
        Object.defineProperty(
          e,
          r,
          i.get
            ? i
            : {
                enumerable: !0,
                get: function () {
                  return t[r];
                },
              }
        );
      }),
      e
    );
  }
  function commonjsRequire(t) {
    throw new Error(
      'Could not dynamically require "' +
        t +
        '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.'
    );
  }
  var lottie$1 = { exports: {} };
  (function (module, exports) {
    var factory;
    'undefined' != typeof navigator &&
      ((factory = function () {
        var svgNS = 'http://www.w3.org/2000/svg',
          locationHref = '',
          _useWebWorker = !1,
          initialDefaultFrame = -999999,
          setWebWorker = function (t) {
            _useWebWorker = !!t;
          },
          getWebWorker = function () {
            return _useWebWorker;
          },
          setLocationHref = function (t) {
            locationHref = t;
          },
          getLocationHref = function () {
            return locationHref;
          };
        function createTag(t) {
          return document.createElement(t);
        }
        function extendPrototype(t, e) {
          var r,
            i,
            s = t.length;
          for (r = 0; r < s; r += 1)
            for (var a in (i = t[r].prototype))
              Object.prototype.hasOwnProperty.call(i, a) &&
                (e.prototype[a] = i[a]);
        }
        function getDescriptor(t, e) {
          return Object.getOwnPropertyDescriptor(t, e);
        }
        function createProxyFunction(t) {
          function e() {}
          return (e.prototype = t), e;
        }
        var audioControllerFactory = (function () {
            function t(t) {
              (this.audios = []),
                (this.audioFactory = t),
                (this._volume = 1),
                (this._isMuted = !1);
            }
            return (
              (t.prototype = {
                addAudio: function (t) {
                  this.audios.push(t);
                },
                pause: function () {
                  var t,
                    e = this.audios.length;
                  for (t = 0; t < e; t += 1) this.audios[t].pause();
                },
                resume: function () {
                  var t,
                    e = this.audios.length;
                  for (t = 0; t < e; t += 1) this.audios[t].resume();
                },
                setRate: function (t) {
                  var e,
                    r = this.audios.length;
                  for (e = 0; e < r; e += 1) this.audios[e].setRate(t);
                },
                createAudio: function (t) {
                  return this.audioFactory
                    ? this.audioFactory(t)
                    : window.Howl
                    ? new window.Howl({ src: [t] })
                    : {
                        isPlaying: !1,
                        play: function () {
                          this.isPlaying = !0;
                        },
                        seek: function () {
                          this.isPlaying = !1;
                        },
                        playing: function () {},
                        rate: function () {},
                        setVolume: function () {},
                      };
                },
                setAudioFactory: function (t) {
                  this.audioFactory = t;
                },
                setVolume: function (t) {
                  (this._volume = t), this._updateVolume();
                },
                mute: function () {
                  (this._isMuted = !0), this._updateVolume();
                },
                unmute: function () {
                  (this._isMuted = !1), this._updateVolume();
                },
                getVolume: function () {
                  return this._volume;
                },
                _updateVolume: function () {
                  var t,
                    e = this.audios.length;
                  for (t = 0; t < e; t += 1)
                    this.audios[t].volume(
                      this._volume * (this._isMuted ? 0 : 1)
                    );
                },
              }),
              function () {
                return new t();
              }
            );
          })(),
          createTypedArray = (function () {
            function t(t, e) {
              var r,
                i = 0,
                s = [];
              switch (t) {
                case 'int16':
                case 'uint8c':
                  r = 1;
                  break;
                default:
                  r = 1.1;
              }
              for (i = 0; i < e; i += 1) s.push(r);
              return s;
            }
            return 'function' == typeof Uint8ClampedArray &&
              'function' == typeof Float32Array
              ? function (e, r) {
                  return 'float32' === e
                    ? new Float32Array(r)
                    : 'int16' === e
                    ? new Int16Array(r)
                    : 'uint8c' === e
                    ? new Uint8ClampedArray(r)
                    : t(e, r);
                }
              : t;
          })();
        function createSizedArray(t) {
          return Array.apply(null, { length: t });
        }
        function _typeof$6(t) {
          return (
            (_typeof$6 =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      'function' == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
                  }),
            _typeof$6(t)
          );
        }
        var subframeEnabled = !0,
          expressionsPlugin = null,
          idPrefix$1 = '',
          isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
          _shouldRoundValues = !1,
          bmPow = Math.pow,
          bmSqrt = Math.sqrt,
          bmFloor = Math.floor,
          bmMax = Math.max,
          bmMin = Math.min,
          BMMath = {};
        function ProjectInterface$1() {
          return {};
        }
        !(function () {
          var t,
            e = [
              'abs',
              'acos',
              'acosh',
              'asin',
              'asinh',
              'atan',
              'atanh',
              'atan2',
              'ceil',
              'cbrt',
              'expm1',
              'clz32',
              'cos',
              'cosh',
              'exp',
              'floor',
              'fround',
              'hypot',
              'imul',
              'log',
              'log1p',
              'log2',
              'log10',
              'max',
              'min',
              'pow',
              'random',
              'round',
              'sign',
              'sin',
              'sinh',
              'sqrt',
              'tan',
              'tanh',
              'trunc',
              'E',
              'LN10',
              'LN2',
              'LOG10E',
              'LOG2E',
              'PI',
              'SQRT1_2',
              'SQRT2',
            ],
            r = e.length;
          for (t = 0; t < r; t += 1) BMMath[e[t]] = Math[e[t]];
        })(),
          (BMMath.random = Math.random),
          (BMMath.abs = function (t) {
            if ('object' === _typeof$6(t) && t.length) {
              var e,
                r = createSizedArray(t.length),
                i = t.length;
              for (e = 0; e < i; e += 1) r[e] = Math.abs(t[e]);
              return r;
            }
            return Math.abs(t);
          });
        var defaultCurveSegments = 150,
          degToRads = Math.PI / 180,
          roundCorner = 0.5519;
        function roundValues(t) {
          _shouldRoundValues = !!t;
        }
        function bmRnd(t) {
          return _shouldRoundValues ? Math.round(t) : t;
        }
        function styleDiv(t) {
          (t.style.position = 'absolute'),
            (t.style.top = 0),
            (t.style.left = 0),
            (t.style.display = 'block'),
            (t.style.transformOrigin = '0 0'),
            (t.style.webkitTransformOrigin = '0 0'),
            (t.style.backfaceVisibility = 'visible'),
            (t.style.webkitBackfaceVisibility = 'visible'),
            (t.style.transformStyle = 'preserve-3d'),
            (t.style.webkitTransformStyle = 'preserve-3d'),
            (t.style.mozTransformStyle = 'preserve-3d');
        }
        function BMEnterFrameEvent(t, e, r, i) {
          (this.type = t),
            (this.currentTime = e),
            (this.totalTime = r),
            (this.direction = i < 0 ? -1 : 1);
        }
        function BMCompleteEvent(t, e) {
          (this.type = t), (this.direction = e < 0 ? -1 : 1);
        }
        function BMCompleteLoopEvent(t, e, r, i) {
          (this.type = t),
            (this.currentLoop = r),
            (this.totalLoops = e),
            (this.direction = i < 0 ? -1 : 1);
        }
        function BMSegmentStartEvent(t, e, r) {
          (this.type = t), (this.firstFrame = e), (this.totalFrames = r);
        }
        function BMDestroyEvent(t, e) {
          (this.type = t), (this.target = e);
        }
        function BMRenderFrameErrorEvent(t, e) {
          (this.type = 'renderFrameError'),
            (this.nativeError = t),
            (this.currentTime = e);
        }
        function BMConfigErrorEvent(t) {
          (this.type = 'configError'), (this.nativeError = t);
        }
        function BMAnimationConfigErrorEvent(t, e) {
          (this.type = t), (this.nativeError = e);
        }
        var createElementID =
            ((_count = 0),
            function () {
              return idPrefix$1 + '__lottie_element_' + (_count += 1);
            }),
          _count;
        function HSVtoRGB(t, e, r) {
          var i, s, a, n, o, h, l, p;
          switch (
            ((h = r * (1 - e)),
            (l = r * (1 - (o = 6 * t - (n = Math.floor(6 * t))) * e)),
            (p = r * (1 - (1 - o) * e)),
            n % 6)
          ) {
            case 0:
              (i = r), (s = p), (a = h);
              break;
            case 1:
              (i = l), (s = r), (a = h);
              break;
            case 2:
              (i = h), (s = r), (a = p);
              break;
            case 3:
              (i = h), (s = l), (a = r);
              break;
            case 4:
              (i = p), (s = h), (a = r);
              break;
            case 5:
              (i = r), (s = h), (a = l);
          }
          return [i, s, a];
        }
        function RGBtoHSV(t, e, r) {
          var i,
            s = Math.max(t, e, r),
            a = Math.min(t, e, r),
            n = s - a,
            o = 0 === s ? 0 : n / s,
            h = s / 255;
          switch (s) {
            case a:
              i = 0;
              break;
            case t:
              (i = e - r + n * (e < r ? 6 : 0)), (i /= 6 * n);
              break;
            case e:
              (i = r - t + 2 * n), (i /= 6 * n);
              break;
            case r:
              (i = t - e + 4 * n), (i /= 6 * n);
          }
          return [i, o, h];
        }
        function addSaturationToRGB(t, e) {
          var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
          return (
            (r[1] += e),
            r[1] > 1 ? (r[1] = 1) : r[1] <= 0 && (r[1] = 0),
            HSVtoRGB(r[0], r[1], r[2])
          );
        }
        function addBrightnessToRGB(t, e) {
          var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
          return (
            (r[2] += e),
            r[2] > 1 ? (r[2] = 1) : r[2] < 0 && (r[2] = 0),
            HSVtoRGB(r[0], r[1], r[2])
          );
        }
        function addHueToRGB(t, e) {
          var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
          return (
            (r[0] += e / 360),
            r[0] > 1 ? (r[0] -= 1) : r[0] < 0 && (r[0] += 1),
            HSVtoRGB(r[0], r[1], r[2])
          );
        }
        var rgbToHex = (function () {
            var t,
              e,
              r = [];
            for (t = 0; t < 256; t += 1)
              (e = t.toString(16)), (r[t] = 1 === e.length ? '0' + e : e);
            return function (t, e, i) {
              return (
                t < 0 && (t = 0),
                e < 0 && (e = 0),
                i < 0 && (i = 0),
                '#' + r[t] + r[e] + r[i]
              );
            };
          })(),
          setSubframeEnabled = function (t) {
            subframeEnabled = !!t;
          },
          getSubframeEnabled = function () {
            return subframeEnabled;
          },
          setExpressionsPlugin = function (t) {
            expressionsPlugin = t;
          },
          getExpressionsPlugin = function () {
            return expressionsPlugin;
          },
          setDefaultCurveSegments = function (t) {
            defaultCurveSegments = t;
          },
          getDefaultCurveSegments = function () {
            return defaultCurveSegments;
          },
          setIdPrefix = function (t) {
            idPrefix$1 = t;
          },
          getIdPrefix = function () {
            return idPrefix$1;
          };
        function createNS(t) {
          return document.createElementNS(svgNS, t);
        }
        function _typeof$5(t) {
          return (
            (_typeof$5 =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      'function' == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
                  }),
            _typeof$5(t)
          );
        }
        var dataManager = (function () {
            var t,
              e,
              r = 1,
              i = [],
              s = {
                onmessage: function () {},
                postMessage: function (e) {
                  t({ data: e });
                },
              },
              _workerSelf = {
                postMessage: function (t) {
                  s.onmessage({ data: t });
                },
              };
            function a() {
              e ||
                ((e = (function (e) {
                  if (window.Worker && window.Blob && getWebWorker()) {
                    var r = new Blob(
                        [
                          'var _workerSelf = self; self.onmessage = ',
                          e.toString(),
                        ],
                        { type: 'text/javascript' }
                      ),
                      i = URL.createObjectURL(r);
                    return new Worker(i);
                  }
                  return (t = e), s;
                })(function (t) {
                  if (
                    (_workerSelf.dataManager ||
                      (_workerSelf.dataManager = (function () {
                        function t(s, a) {
                          var n,
                            o,
                            h,
                            l,
                            p,
                            f,
                            d = s.length;
                          for (o = 0; o < d; o += 1)
                            if ('ks' in (n = s[o]) && !n.completed) {
                              if (
                                ((n.completed = !0),
                                n.tt && (s[o - 1].td = n.tt),
                                n.hasMask)
                              ) {
                                var m = n.masksProperties;
                                for (l = m.length, h = 0; h < l; h += 1)
                                  if (m[h].pt.k.i) i(m[h].pt.k);
                                  else
                                    for (
                                      f = m[h].pt.k.length, p = 0;
                                      p < f;
                                      p += 1
                                    )
                                      m[h].pt.k[p].s && i(m[h].pt.k[p].s[0]),
                                        m[h].pt.k[p].e && i(m[h].pt.k[p].e[0]);
                              }
                              0 === n.ty
                                ? ((n.layers = e(n.refId, a)), t(n.layers, a))
                                : 4 === n.ty
                                ? r(n.shapes)
                                : 5 === n.ty && c(n);
                            }
                        }
                        function e(t, e) {
                          var r = (function (t, e) {
                            for (var r = 0, i = e.length; r < i; ) {
                              if (e[r].id === t) return e[r];
                              r += 1;
                            }
                            return null;
                          })(t, e);
                          return r
                            ? r.layers.__used
                              ? JSON.parse(JSON.stringify(r.layers))
                              : ((r.layers.__used = !0), r.layers)
                            : null;
                        }
                        function r(t) {
                          var e, s, a;
                          for (e = t.length - 1; e >= 0; e -= 1)
                            if ('sh' === t[e].ty)
                              if (t[e].ks.k.i) i(t[e].ks.k);
                              else
                                for (a = t[e].ks.k.length, s = 0; s < a; s += 1)
                                  t[e].ks.k[s].s && i(t[e].ks.k[s].s[0]),
                                    t[e].ks.k[s].e && i(t[e].ks.k[s].e[0]);
                            else 'gr' === t[e].ty && r(t[e].it);
                        }
                        function i(t) {
                          var e,
                            r = t.i.length;
                          for (e = 0; e < r; e += 1)
                            (t.i[e][0] += t.v[e][0]),
                              (t.i[e][1] += t.v[e][1]),
                              (t.o[e][0] += t.v[e][0]),
                              (t.o[e][1] += t.v[e][1]);
                        }
                        function s(t, e) {
                          var r = e ? e.split('.') : [100, 100, 100];
                          return (
                            t[0] > r[0] ||
                            (!(r[0] > t[0]) &&
                              (t[1] > r[1] ||
                                (!(r[1] > t[1]) &&
                                  (t[2] > r[2] || (!(r[2] > t[2]) && null)))))
                          );
                        }
                        var a,
                          n = (function () {
                            var t = [4, 4, 14];
                            function e(t) {
                              var e,
                                r,
                                i,
                                s = t.length;
                              for (e = 0; e < s; e += 1)
                                5 === t[e].ty &&
                                  ((i = void 0),
                                  (i = (r = t[e]).t.d),
                                  (r.t.d = { k: [{ s: i, t: 0 }] }));
                            }
                            return function (r) {
                              if (s(t, r.v) && (e(r.layers), r.assets)) {
                                var i,
                                  a = r.assets.length;
                                for (i = 0; i < a; i += 1)
                                  r.assets[i].layers && e(r.assets[i].layers);
                              }
                            };
                          })(),
                          o =
                            ((a = [4, 7, 99]),
                            function (t) {
                              if (t.chars && !s(a, t.v)) {
                                var e,
                                  i = t.chars.length;
                                for (e = 0; e < i; e += 1) {
                                  var n = t.chars[e];
                                  n.data &&
                                    n.data.shapes &&
                                    (r(n.data.shapes),
                                    (n.data.ip = 0),
                                    (n.data.op = 99999),
                                    (n.data.st = 0),
                                    (n.data.sr = 1),
                                    (n.data.ks = {
                                      p: { k: [0, 0], a: 0 },
                                      s: { k: [100, 100], a: 0 },
                                      a: { k: [0, 0], a: 0 },
                                      r: { k: 0, a: 0 },
                                      o: { k: 100, a: 0 },
                                    }),
                                    t.chars[e].t ||
                                      (n.data.shapes.push({ ty: 'no' }),
                                      n.data.shapes[0].it.push({
                                        p: { k: [0, 0], a: 0 },
                                        s: { k: [100, 100], a: 0 },
                                        a: { k: [0, 0], a: 0 },
                                        r: { k: 0, a: 0 },
                                        o: { k: 100, a: 0 },
                                        sk: { k: 0, a: 0 },
                                        sa: { k: 0, a: 0 },
                                        ty: 'tr',
                                      })));
                                }
                              }
                            }),
                          h = (function () {
                            var t = [5, 7, 15];
                            function e(t) {
                              var e,
                                r,
                                i = t.length;
                              for (e = 0; e < i; e += 1)
                                5 === t[e].ty &&
                                  ((r = void 0),
                                  'number' == typeof (r = t[e].t.p).a &&
                                    (r.a = { a: 0, k: r.a }),
                                  'number' == typeof r.p &&
                                    (r.p = { a: 0, k: r.p }),
                                  'number' == typeof r.r &&
                                    (r.r = { a: 0, k: r.r }));
                            }
                            return function (r) {
                              if (s(t, r.v) && (e(r.layers), r.assets)) {
                                var i,
                                  a = r.assets.length;
                                for (i = 0; i < a; i += 1)
                                  r.assets[i].layers && e(r.assets[i].layers);
                              }
                            };
                          })(),
                          l = (function () {
                            var t = [4, 1, 9];
                            function e(t) {
                              var r,
                                i,
                                s,
                                a = t.length;
                              for (r = 0; r < a; r += 1)
                                if ('gr' === t[r].ty) e(t[r].it);
                                else if ('fl' === t[r].ty || 'st' === t[r].ty)
                                  if (t[r].c.k && t[r].c.k[0].i)
                                    for (
                                      s = t[r].c.k.length, i = 0;
                                      i < s;
                                      i += 1
                                    )
                                      t[r].c.k[i].s &&
                                        ((t[r].c.k[i].s[0] /= 255),
                                        (t[r].c.k[i].s[1] /= 255),
                                        (t[r].c.k[i].s[2] /= 255),
                                        (t[r].c.k[i].s[3] /= 255)),
                                        t[r].c.k[i].e &&
                                          ((t[r].c.k[i].e[0] /= 255),
                                          (t[r].c.k[i].e[1] /= 255),
                                          (t[r].c.k[i].e[2] /= 255),
                                          (t[r].c.k[i].e[3] /= 255));
                                  else
                                    (t[r].c.k[0] /= 255),
                                      (t[r].c.k[1] /= 255),
                                      (t[r].c.k[2] /= 255),
                                      (t[r].c.k[3] /= 255);
                            }
                            function r(t) {
                              var r,
                                i = t.length;
                              for (r = 0; r < i; r += 1)
                                4 === t[r].ty && e(t[r].shapes);
                            }
                            return function (e) {
                              if (s(t, e.v) && (r(e.layers), e.assets)) {
                                var i,
                                  a = e.assets.length;
                                for (i = 0; i < a; i += 1)
                                  e.assets[i].layers && r(e.assets[i].layers);
                              }
                            };
                          })(),
                          p = (function () {
                            var t = [4, 4, 18];
                            function e(t) {
                              var r, i, s;
                              for (r = t.length - 1; r >= 0; r -= 1)
                                if ('sh' === t[r].ty)
                                  if (t[r].ks.k.i) t[r].ks.k.c = t[r].closed;
                                  else
                                    for (
                                      s = t[r].ks.k.length, i = 0;
                                      i < s;
                                      i += 1
                                    )
                                      t[r].ks.k[i].s &&
                                        (t[r].ks.k[i].s[0].c = t[r].closed),
                                        t[r].ks.k[i].e &&
                                          (t[r].ks.k[i].e[0].c = t[r].closed);
                                else 'gr' === t[r].ty && e(t[r].it);
                            }
                            function r(t) {
                              var r,
                                i,
                                s,
                                a,
                                n,
                                o,
                                h = t.length;
                              for (i = 0; i < h; i += 1) {
                                if ((r = t[i]).hasMask) {
                                  var l = r.masksProperties;
                                  for (a = l.length, s = 0; s < a; s += 1)
                                    if (l[s].pt.k.i) l[s].pt.k.c = l[s].cl;
                                    else
                                      for (
                                        o = l[s].pt.k.length, n = 0;
                                        n < o;
                                        n += 1
                                      )
                                        l[s].pt.k[n].s &&
                                          (l[s].pt.k[n].s[0].c = l[s].cl),
                                          l[s].pt.k[n].e &&
                                            (l[s].pt.k[n].e[0].c = l[s].cl);
                                }
                                4 === r.ty && e(r.shapes);
                              }
                            }
                            return function (e) {
                              if (s(t, e.v) && (r(e.layers), e.assets)) {
                                var i,
                                  a = e.assets.length;
                                for (i = 0; i < a; i += 1)
                                  e.assets[i].layers && r(e.assets[i].layers);
                              }
                            };
                          })();
                        function c(t) {
                          0 === t.t.a.length && t.t.p;
                        }
                        var f = {
                          completeData: function (r) {
                            r.__complete ||
                              (l(r),
                              n(r),
                              o(r),
                              h(r),
                              p(r),
                              t(r.layers, r.assets),
                              (function (r, i) {
                                if (r) {
                                  var s = 0,
                                    a = r.length;
                                  for (s = 0; s < a; s += 1)
                                    1 === r[s].t &&
                                      ((r[s].data.layers = e(
                                        r[s].data.refId,
                                        i
                                      )),
                                      t(r[s].data.layers, i));
                                }
                              })(r.chars, r.assets),
                              (r.__complete = !0));
                          },
                        };
                        return (
                          (f.checkColors = l),
                          (f.checkChars = o),
                          (f.checkPathProperties = h),
                          (f.checkShapes = p),
                          (f.completeLayers = t),
                          f
                        );
                      })()),
                    _workerSelf.assetLoader ||
                      (_workerSelf.assetLoader = (function () {
                        function t(t) {
                          var e = t.getResponseHeader('content-type');
                          return (e &&
                            'json' === t.responseType &&
                            -1 !== e.indexOf('json')) ||
                            (t.response && 'object' === _typeof$5(t.response))
                            ? t.response
                            : t.response && 'string' == typeof t.response
                            ? JSON.parse(t.response)
                            : t.responseText
                            ? JSON.parse(t.responseText)
                            : null;
                        }
                        return {
                          load: function (e, r, i, s) {
                            var a,
                              n = new XMLHttpRequest();
                            try {
                              n.responseType = 'json';
                            } catch (t) {}
                            n.onreadystatechange = function () {
                              if (4 === n.readyState)
                                if (200 === n.status) (a = t(n)), i(a);
                                else
                                  try {
                                    (a = t(n)), i(a);
                                  } catch (t) {
                                    s && s(t);
                                  }
                            };
                            try {
                              n.open('GET', e, !0);
                            } catch (t) {
                              n.open('GET', r + '/' + e, !0);
                            }
                            n.send();
                          },
                        };
                      })()),
                    'loadAnimation' === t.data.type)
                  )
                    _workerSelf.assetLoader.load(
                      t.data.path,
                      t.data.fullPath,
                      function (e) {
                        _workerSelf.dataManager.completeData(e),
                          _workerSelf.postMessage({
                            id: t.data.id,
                            payload: e,
                            status: 'success',
                          });
                      },
                      function () {
                        _workerSelf.postMessage({
                          id: t.data.id,
                          status: 'error',
                        });
                      }
                    );
                  else if ('complete' === t.data.type) {
                    var e = t.data.animation;
                    _workerSelf.dataManager.completeData(e),
                      _workerSelf.postMessage({
                        id: t.data.id,
                        payload: e,
                        status: 'success',
                      });
                  } else
                    'loadData' === t.data.type &&
                      _workerSelf.assetLoader.load(
                        t.data.path,
                        t.data.fullPath,
                        function (e) {
                          _workerSelf.postMessage({
                            id: t.data.id,
                            payload: e,
                            status: 'success',
                          });
                        },
                        function () {
                          _workerSelf.postMessage({
                            id: t.data.id,
                            status: 'error',
                          });
                        }
                      );
                })),
                (e.onmessage = function (t) {
                  var e = t.data,
                    r = e.id,
                    s = i[r];
                  (i[r] = null),
                    'success' === e.status
                      ? s.onComplete(e.payload)
                      : s.onError && s.onError();
                }));
            }
            function n(t, e) {
              var s = 'processId_' + (r += 1);
              return (i[s] = { onComplete: t, onError: e }), s;
            }
            return {
              loadAnimation: function (t, r, i) {
                a();
                var s = n(r, i);
                e.postMessage({
                  type: 'loadAnimation',
                  path: t,
                  fullPath: window.location.origin + window.location.pathname,
                  id: s,
                });
              },
              loadData: function (t, r, i) {
                a();
                var s = n(r, i);
                e.postMessage({
                  type: 'loadData',
                  path: t,
                  fullPath: window.location.origin + window.location.pathname,
                  id: s,
                });
              },
              completeAnimation: function (t, r, i) {
                a();
                var s = n(r, i);
                e.postMessage({ type: 'complete', animation: t, id: s });
              },
            };
          })(),
          ImagePreloader = (function () {
            var t = (function () {
              var t = createTag('canvas');
              (t.width = 1), (t.height = 1);
              var e = t.getContext('2d');
              return (e.fillStyle = 'rgba(0,0,0,0)'), e.fillRect(0, 0, 1, 1), t;
            })();
            function e() {
              (this.loadedAssets += 1),
                this.loadedAssets === this.totalImages &&
                  this.loadedFootagesCount === this.totalFootages &&
                  this.imagesLoadedCb &&
                  this.imagesLoadedCb(null);
            }
            function r() {
              (this.loadedFootagesCount += 1),
                this.loadedAssets === this.totalImages &&
                  this.loadedFootagesCount === this.totalFootages &&
                  this.imagesLoadedCb &&
                  this.imagesLoadedCb(null);
            }
            function i(t, e, r) {
              var i = '';
              if (t.e) i = t.p;
              else if (e) {
                var s = t.p;
                -1 !== s.indexOf('images/') && (s = s.split('/')[1]),
                  (i = e + s);
              } else (i = r), (i += t.u ? t.u : ''), (i += t.p);
              return i;
            }
            function s(t) {
              var e = 0,
                r = setInterval(
                  function () {
                    (t.getBBox().width || e > 500) &&
                      (this._imageLoaded(), clearInterval(r)),
                      (e += 1);
                  }.bind(this),
                  50
                );
            }
            function a(t) {
              var e = { assetData: t },
                r = i(t, this.assetsPath, this.path);
              return (
                dataManager.loadData(
                  r,
                  function (t) {
                    (e.img = t), this._footageLoaded();
                  }.bind(this),
                  function () {
                    (e.img = {}), this._footageLoaded();
                  }.bind(this)
                ),
                e
              );
            }
            function n() {
              (this._imageLoaded = e.bind(this)),
                (this._footageLoaded = r.bind(this)),
                (this.testImageLoaded = s.bind(this)),
                (this.createFootageData = a.bind(this)),
                (this.assetsPath = ''),
                (this.path = ''),
                (this.totalImages = 0),
                (this.totalFootages = 0),
                (this.loadedAssets = 0),
                (this.loadedFootagesCount = 0),
                (this.imagesLoadedCb = null),
                (this.images = []);
            }
            return (
              (n.prototype = {
                loadAssets: function (t, e) {
                  var r;
                  this.imagesLoadedCb = e;
                  var i = t.length;
                  for (r = 0; r < i; r += 1)
                    t[r].layers ||
                      (t[r].t && 'seq' !== t[r].t
                        ? 3 === t[r].t &&
                          ((this.totalFootages += 1),
                          this.images.push(this.createFootageData(t[r])))
                        : ((this.totalImages += 1),
                          this.images.push(this._createImageData(t[r]))));
                },
                setAssetsPath: function (t) {
                  this.assetsPath = t || '';
                },
                setPath: function (t) {
                  this.path = t || '';
                },
                loadedImages: function () {
                  return this.totalImages === this.loadedAssets;
                },
                loadedFootages: function () {
                  return this.totalFootages === this.loadedFootagesCount;
                },
                destroy: function () {
                  (this.imagesLoadedCb = null), (this.images.length = 0);
                },
                getAsset: function (t) {
                  for (var e = 0, r = this.images.length; e < r; ) {
                    if (this.images[e].assetData === t)
                      return this.images[e].img;
                    e += 1;
                  }
                  return null;
                },
                createImgData: function (e) {
                  var r = i(e, this.assetsPath, this.path),
                    s = createTag('img');
                  (s.crossOrigin = 'anonymous'),
                    s.addEventListener('load', this._imageLoaded, !1),
                    s.addEventListener(
                      'error',
                      function () {
                        (a.img = t), this._imageLoaded();
                      }.bind(this),
                      !1
                    ),
                    (s.src = r);
                  var a = { img: s, assetData: e };
                  return a;
                },
                createImageData: function (e) {
                  var r = i(e, this.assetsPath, this.path),
                    s = createNS('image');
                  isSafari
                    ? this.testImageLoaded(s)
                    : s.addEventListener('load', this._imageLoaded, !1),
                    s.addEventListener(
                      'error',
                      function () {
                        (a.img = t), this._imageLoaded();
                      }.bind(this),
                      !1
                    ),
                    s.setAttributeNS('http://www.w3.org/1999/xlink', 'href', r),
                    this._elementHelper.append
                      ? this._elementHelper.append(s)
                      : this._elementHelper.appendChild(s);
                  var a = { img: s, assetData: e };
                  return a;
                },
                imageLoaded: e,
                footageLoaded: r,
                setCacheType: function (t, e) {
                  'svg' === t
                    ? ((this._elementHelper = e),
                      (this._createImageData = this.createImageData.bind(this)))
                    : (this._createImageData = this.createImgData.bind(this));
                },
              }),
              n
            );
          })();
        function BaseEvent() {}
        BaseEvent.prototype = {
          triggerEvent: function (t, e) {
            if (this._cbs[t])
              for (var r = this._cbs[t], i = 0; i < r.length; i += 1) r[i](e);
          },
          addEventListener: function (t, e) {
            return (
              this._cbs[t] || (this._cbs[t] = []),
              this._cbs[t].push(e),
              function () {
                this.removeEventListener(t, e);
              }.bind(this)
            );
          },
          removeEventListener: function (t, e) {
            if (e) {
              if (this._cbs[t]) {
                for (var r = 0, i = this._cbs[t].length; r < i; )
                  this._cbs[t][r] === e &&
                    (this._cbs[t].splice(r, 1), (r -= 1), (i -= 1)),
                    (r += 1);
                this._cbs[t].length || (this._cbs[t] = null);
              }
            } else this._cbs[t] = null;
          },
        };
        var markerParser = (function () {
            function t(t) {
              for (
                var e, r = t.split('\r\n'), i = {}, s = 0, a = 0;
                a < r.length;
                a += 1
              )
                2 === (e = r[a].split(':')).length &&
                  ((i[e[0]] = e[1].trim()), (s += 1));
              if (0 === s) throw new Error();
              return i;
            }
            return function (e) {
              for (var r = [], i = 0; i < e.length; i += 1) {
                var s = e[i],
                  a = { time: s.tm, duration: s.dr };
                try {
                  a.payload = JSON.parse(e[i].cm);
                } catch (r) {
                  try {
                    a.payload = t(e[i].cm);
                  } catch (t) {
                    a.payload = { name: e[i].cm };
                  }
                }
                r.push(a);
              }
              return r;
            };
          })(),
          ProjectInterface = (function () {
            function t(t) {
              this.compositions.push(t);
            }
            return function () {
              function e(t) {
                for (var e = 0, r = this.compositions.length; e < r; ) {
                  if (
                    this.compositions[e].data &&
                    this.compositions[e].data.nm === t
                  )
                    return (
                      this.compositions[e].prepareFrame &&
                        this.compositions[e].data.xt &&
                        this.compositions[e].prepareFrame(this.currentFrame),
                      this.compositions[e].compInterface
                    );
                  e += 1;
                }
                return null;
              }
              return (
                (e.compositions = []),
                (e.currentFrame = 0),
                (e.registerComposition = t),
                e
              );
            };
          })(),
          renderers = {},
          registerRenderer = function (t, e) {
            renderers[t] = e;
          };
        function getRenderer(t) {
          return renderers[t];
        }
        function _typeof$4(t) {
          return (
            (_typeof$4 =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      'function' == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
                  }),
            _typeof$4(t)
          );
        }
        var AnimationItem = function () {
          (this._cbs = []),
            (this.name = ''),
            (this.path = ''),
            (this.isLoaded = !1),
            (this.currentFrame = 0),
            (this.currentRawFrame = 0),
            (this.firstFrame = 0),
            (this.totalFrames = 0),
            (this.frameRate = 0),
            (this.frameMult = 0),
            (this.playSpeed = 1),
            (this.playDirection = 1),
            (this.playCount = 0),
            (this.animationData = {}),
            (this.assets = []),
            (this.isPaused = !0),
            (this.autoplay = !1),
            (this.loop = !0),
            (this.renderer = null),
            (this.animationID = createElementID()),
            (this.assetsPath = ''),
            (this.timeCompleted = 0),
            (this.segmentPos = 0),
            (this.isSubframeEnabled = getSubframeEnabled()),
            (this.segments = []),
            (this._idle = !0),
            (this._completedLoop = !1),
            (this.projectInterface = ProjectInterface()),
            (this.imagePreloader = new ImagePreloader()),
            (this.audioController = audioControllerFactory()),
            (this.markers = []),
            (this.configAnimation = this.configAnimation.bind(this)),
            (this.onSetupError = this.onSetupError.bind(this)),
            (this.onSegmentComplete = this.onSegmentComplete.bind(this)),
            (this.drawnFrameEvent = new BMEnterFrameEvent(
              'drawnFrame',
              0,
              0,
              0
            ));
        };
        extendPrototype([BaseEvent], AnimationItem),
          (AnimationItem.prototype.setParams = function (t) {
            (t.wrapper || t.container) &&
              (this.wrapper = t.wrapper || t.container);
            var e = 'svg';
            t.animType ? (e = t.animType) : t.renderer && (e = t.renderer);
            var r = getRenderer(e);
            (this.renderer = new r(this, t.rendererSettings)),
              this.imagePreloader.setCacheType(
                e,
                this.renderer.globalData.defs
              ),
              this.renderer.setProjectInterface(this.projectInterface),
              (this.animType = e),
              '' === t.loop ||
              null === t.loop ||
              void 0 === t.loop ||
              !0 === t.loop
                ? (this.loop = !0)
                : !1 === t.loop
                ? (this.loop = !1)
                : (this.loop = parseInt(t.loop, 10)),
              (this.autoplay = !('autoplay' in t) || t.autoplay),
              (this.name = t.name ? t.name : ''),
              (this.autoloadSegments =
                !Object.prototype.hasOwnProperty.call(t, 'autoloadSegments') ||
                t.autoloadSegments),
              (this.assetsPath = t.assetsPath),
              (this.initialSegment = t.initialSegment),
              t.audioFactory &&
                this.audioController.setAudioFactory(t.audioFactory),
              t.animationData
                ? this.setupAnimation(t.animationData)
                : t.path &&
                  (-1 !== t.path.lastIndexOf('\\')
                    ? (this.path = t.path.substr(
                        0,
                        t.path.lastIndexOf('\\') + 1
                      ))
                    : (this.path = t.path.substr(
                        0,
                        t.path.lastIndexOf('/') + 1
                      )),
                  (this.fileName = t.path.substr(t.path.lastIndexOf('/') + 1)),
                  (this.fileName = this.fileName.substr(
                    0,
                    this.fileName.lastIndexOf('.json')
                  )),
                  dataManager.loadAnimation(
                    t.path,
                    this.configAnimation,
                    this.onSetupError
                  ));
          }),
          (AnimationItem.prototype.onSetupError = function () {
            this.trigger('data_failed');
          }),
          (AnimationItem.prototype.setupAnimation = function (t) {
            dataManager.completeAnimation(t, this.configAnimation);
          }),
          (AnimationItem.prototype.setData = function (t, e) {
            e && 'object' !== _typeof$4(e) && (e = JSON.parse(e));
            var r = { wrapper: t, animationData: e },
              i = t.attributes;
            (r.path = i.getNamedItem('data-animation-path')
              ? i.getNamedItem('data-animation-path').value
              : i.getNamedItem('data-bm-path')
              ? i.getNamedItem('data-bm-path').value
              : i.getNamedItem('bm-path')
              ? i.getNamedItem('bm-path').value
              : ''),
              (r.animType = i.getNamedItem('data-anim-type')
                ? i.getNamedItem('data-anim-type').value
                : i.getNamedItem('data-bm-type')
                ? i.getNamedItem('data-bm-type').value
                : i.getNamedItem('bm-type')
                ? i.getNamedItem('bm-type').value
                : i.getNamedItem('data-bm-renderer')
                ? i.getNamedItem('data-bm-renderer').value
                : i.getNamedItem('bm-renderer')
                ? i.getNamedItem('bm-renderer').value
                : 'canvas');
            var s = i.getNamedItem('data-anim-loop')
              ? i.getNamedItem('data-anim-loop').value
              : i.getNamedItem('data-bm-loop')
              ? i.getNamedItem('data-bm-loop').value
              : i.getNamedItem('bm-loop')
              ? i.getNamedItem('bm-loop').value
              : '';
            'false' === s
              ? (r.loop = !1)
              : 'true' === s
              ? (r.loop = !0)
              : '' !== s && (r.loop = parseInt(s, 10));
            var a = i.getNamedItem('data-anim-autoplay')
              ? i.getNamedItem('data-anim-autoplay').value
              : i.getNamedItem('data-bm-autoplay')
              ? i.getNamedItem('data-bm-autoplay').value
              : !i.getNamedItem('bm-autoplay') ||
                i.getNamedItem('bm-autoplay').value;
            (r.autoplay = 'false' !== a),
              (r.name = i.getNamedItem('data-name')
                ? i.getNamedItem('data-name').value
                : i.getNamedItem('data-bm-name')
                ? i.getNamedItem('data-bm-name').value
                : i.getNamedItem('bm-name')
                ? i.getNamedItem('bm-name').value
                : ''),
              'false' ===
                (i.getNamedItem('data-anim-prerender')
                  ? i.getNamedItem('data-anim-prerender').value
                  : i.getNamedItem('data-bm-prerender')
                  ? i.getNamedItem('data-bm-prerender').value
                  : i.getNamedItem('bm-prerender')
                  ? i.getNamedItem('bm-prerender').value
                  : '') && (r.prerender = !1),
              this.setParams(r);
          }),
          (AnimationItem.prototype.includeLayers = function (t) {
            t.op > this.animationData.op &&
              ((this.animationData.op = t.op),
              (this.totalFrames = Math.floor(t.op - this.animationData.ip)));
            var e,
              r,
              i = this.animationData.layers,
              s = i.length,
              a = t.layers,
              n = a.length;
            for (r = 0; r < n; r += 1)
              for (e = 0; e < s; ) {
                if (i[e].id === a[r].id) {
                  i[e] = a[r];
                  break;
                }
                e += 1;
              }
            if (
              ((t.chars || t.fonts) &&
                (this.renderer.globalData.fontManager.addChars(t.chars),
                this.renderer.globalData.fontManager.addFonts(
                  t.fonts,
                  this.renderer.globalData.defs
                )),
              t.assets)
            )
              for (s = t.assets.length, e = 0; e < s; e += 1)
                this.animationData.assets.push(t.assets[e]);
            (this.animationData.__complete = !1),
              dataManager.completeAnimation(
                this.animationData,
                this.onSegmentComplete
              );
          }),
          (AnimationItem.prototype.onSegmentComplete = function (t) {
            this.animationData = t;
            var e = getExpressionsPlugin();
            e && e.initExpressions(this), this.loadNextSegment();
          }),
          (AnimationItem.prototype.loadNextSegment = function () {
            var t = this.animationData.segments;
            if (!t || 0 === t.length || !this.autoloadSegments)
              return (
                this.trigger('data_ready'),
                void (this.timeCompleted = this.totalFrames)
              );
            var e = t.shift();
            this.timeCompleted = e.time * this.frameRate;
            var r = this.path + this.fileName + '_' + this.segmentPos + '.json';
            (this.segmentPos += 1),
              dataManager.loadData(
                r,
                this.includeLayers.bind(this),
                function () {
                  this.trigger('data_failed');
                }.bind(this)
              );
          }),
          (AnimationItem.prototype.loadSegments = function () {
            this.animationData.segments ||
              (this.timeCompleted = this.totalFrames),
              this.loadNextSegment();
          }),
          (AnimationItem.prototype.imagesLoaded = function () {
            this.trigger('loaded_images'), this.checkLoaded();
          }),
          (AnimationItem.prototype.preloadImages = function () {
            this.imagePreloader.setAssetsPath(this.assetsPath),
              this.imagePreloader.setPath(this.path),
              this.imagePreloader.loadAssets(
                this.animationData.assets,
                this.imagesLoaded.bind(this)
              );
          }),
          (AnimationItem.prototype.configAnimation = function (t) {
            if (this.renderer)
              try {
                (this.animationData = t),
                  this.initialSegment
                    ? ((this.totalFrames = Math.floor(
                        this.initialSegment[1] - this.initialSegment[0]
                      )),
                      (this.firstFrame = Math.round(this.initialSegment[0])))
                    : ((this.totalFrames = Math.floor(
                        this.animationData.op - this.animationData.ip
                      )),
                      (this.firstFrame = Math.round(this.animationData.ip))),
                  this.renderer.configAnimation(t),
                  t.assets || (t.assets = []),
                  (this.assets = this.animationData.assets),
                  (this.frameRate = this.animationData.fr),
                  (this.frameMult = this.animationData.fr / 1e3),
                  this.renderer.searchExtraCompositions(t.assets),
                  (this.markers = markerParser(t.markers || [])),
                  this.trigger('config_ready'),
                  this.preloadImages(),
                  this.loadSegments(),
                  this.updaFrameModifier(),
                  this.waitForFontsLoaded(),
                  this.isPaused && this.audioController.pause();
              } catch (t) {
                this.triggerConfigError(t);
              }
          }),
          (AnimationItem.prototype.waitForFontsLoaded = function () {
            this.renderer &&
              (this.renderer.globalData.fontManager.isLoaded
                ? this.checkLoaded()
                : setTimeout(this.waitForFontsLoaded.bind(this), 20));
          }),
          (AnimationItem.prototype.checkLoaded = function () {
            if (
              !this.isLoaded &&
              this.renderer.globalData.fontManager.isLoaded &&
              (this.imagePreloader.loadedImages() ||
                'canvas' !== this.renderer.rendererType) &&
              this.imagePreloader.loadedFootages()
            ) {
              this.isLoaded = !0;
              var t = getExpressionsPlugin();
              t && t.initExpressions(this),
                this.renderer.initItems(),
                setTimeout(
                  function () {
                    this.trigger('DOMLoaded');
                  }.bind(this),
                  0
                ),
                this.gotoFrame(),
                this.autoplay && this.play();
            }
          }),
          (AnimationItem.prototype.resize = function () {
            this.renderer.updateContainerSize();
          }),
          (AnimationItem.prototype.setSubframe = function (t) {
            this.isSubframeEnabled = !!t;
          }),
          (AnimationItem.prototype.gotoFrame = function () {
            (this.currentFrame = this.isSubframeEnabled
              ? this.currentRawFrame
              : ~~this.currentRawFrame),
              this.timeCompleted !== this.totalFrames &&
                this.currentFrame > this.timeCompleted &&
                (this.currentFrame = this.timeCompleted),
              this.trigger('enterFrame'),
              this.renderFrame(),
              this.trigger('drawnFrame');
          }),
          (AnimationItem.prototype.renderFrame = function () {
            if (!1 !== this.isLoaded && this.renderer)
              try {
                this.renderer.renderFrame(this.currentFrame + this.firstFrame);
              } catch (t) {
                this.triggerRenderFrameError(t);
              }
          }),
          (AnimationItem.prototype.play = function (t) {
            (t && this.name !== t) ||
              (!0 === this.isPaused &&
                ((this.isPaused = !1),
                this.trigger('_pause'),
                this.audioController.resume(),
                this._idle && ((this._idle = !1), this.trigger('_active'))));
          }),
          (AnimationItem.prototype.pause = function (t) {
            (t && this.name !== t) ||
              (!1 === this.isPaused &&
                ((this.isPaused = !0),
                this.trigger('_play'),
                (this._idle = !0),
                this.trigger('_idle'),
                this.audioController.pause()));
          }),
          (AnimationItem.prototype.togglePause = function (t) {
            (t && this.name !== t) ||
              (!0 === this.isPaused ? this.play() : this.pause());
          }),
          (AnimationItem.prototype.stop = function (t) {
            (t && this.name !== t) ||
              (this.pause(),
              (this.playCount = 0),
              (this._completedLoop = !1),
              this.setCurrentRawFrameValue(0));
          }),
          (AnimationItem.prototype.getMarkerData = function (t) {
            for (var e, r = 0; r < this.markers.length; r += 1)
              if ((e = this.markers[r]).payload && e.payload.name === t)
                return e;
            return null;
          }),
          (AnimationItem.prototype.goToAndStop = function (t, e, r) {
            if (!r || this.name === r) {
              var i = Number(t);
              if (isNaN(i)) {
                var s = this.getMarkerData(t);
                s && this.goToAndStop(s.time, !0);
              } else
                e
                  ? this.setCurrentRawFrameValue(t)
                  : this.setCurrentRawFrameValue(t * this.frameModifier);
              this.pause();
            }
          }),
          (AnimationItem.prototype.goToAndPlay = function (t, e, r) {
            if (!r || this.name === r) {
              var i = Number(t);
              if (isNaN(i)) {
                var s = this.getMarkerData(t);
                s &&
                  (s.duration
                    ? this.playSegments([s.time, s.time + s.duration], !0)
                    : this.goToAndStop(s.time, !0));
              } else this.goToAndStop(i, e, r);
              this.play();
            }
          }),
          (AnimationItem.prototype.advanceTime = function (t) {
            if (!0 !== this.isPaused && !1 !== this.isLoaded) {
              var e = this.currentRawFrame + t * this.frameModifier,
                r = !1;
              e >= this.totalFrames - 1 && this.frameModifier > 0
                ? this.loop && this.playCount !== this.loop
                  ? e >= this.totalFrames
                    ? ((this.playCount += 1),
                      this.checkSegments(e % this.totalFrames) ||
                        (this.setCurrentRawFrameValue(e % this.totalFrames),
                        (this._completedLoop = !0),
                        this.trigger('loopComplete')))
                    : this.setCurrentRawFrameValue(e)
                  : this.checkSegments(
                      e > this.totalFrames ? e % this.totalFrames : 0
                    ) || ((r = !0), (e = this.totalFrames - 1))
                : e < 0
                ? this.checkSegments(e % this.totalFrames) ||
                  (!this.loop || (this.playCount-- <= 0 && !0 !== this.loop)
                    ? ((r = !0), (e = 0))
                    : (this.setCurrentRawFrameValue(
                        this.totalFrames + (e % this.totalFrames)
                      ),
                      this._completedLoop
                        ? this.trigger('loopComplete')
                        : (this._completedLoop = !0)))
                : this.setCurrentRawFrameValue(e),
                r &&
                  (this.setCurrentRawFrameValue(e),
                  this.pause(),
                  this.trigger('complete'));
            }
          }),
          (AnimationItem.prototype.adjustSegment = function (t, e) {
            (this.playCount = 0),
              t[1] < t[0]
                ? (this.frameModifier > 0 &&
                    (this.playSpeed < 0
                      ? this.setSpeed(-this.playSpeed)
                      : this.setDirection(-1)),
                  (this.totalFrames = t[0] - t[1]),
                  (this.timeCompleted = this.totalFrames),
                  (this.firstFrame = t[1]),
                  this.setCurrentRawFrameValue(this.totalFrames - 0.001 - e))
                : t[1] > t[0] &&
                  (this.frameModifier < 0 &&
                    (this.playSpeed < 0
                      ? this.setSpeed(-this.playSpeed)
                      : this.setDirection(1)),
                  (this.totalFrames = t[1] - t[0]),
                  (this.timeCompleted = this.totalFrames),
                  (this.firstFrame = t[0]),
                  this.setCurrentRawFrameValue(0.001 + e)),
              this.trigger('segmentStart');
          }),
          (AnimationItem.prototype.setSegment = function (t, e) {
            var r = -1;
            this.isPaused &&
              (this.currentRawFrame + this.firstFrame < t
                ? (r = t)
                : this.currentRawFrame + this.firstFrame > e && (r = e - t)),
              (this.firstFrame = t),
              (this.totalFrames = e - t),
              (this.timeCompleted = this.totalFrames),
              -1 !== r && this.goToAndStop(r, !0);
          }),
          (AnimationItem.prototype.playSegments = function (t, e) {
            if (
              (e && (this.segments.length = 0), 'object' === _typeof$4(t[0]))
            ) {
              var r,
                i = t.length;
              for (r = 0; r < i; r += 1) this.segments.push(t[r]);
            } else this.segments.push(t);
            this.segments.length &&
              e &&
              this.adjustSegment(this.segments.shift(), 0),
              this.isPaused && this.play();
          }),
          (AnimationItem.prototype.resetSegments = function (t) {
            (this.segments.length = 0),
              this.segments.push([
                this.animationData.ip,
                this.animationData.op,
              ]),
              t && this.checkSegments(0);
          }),
          (AnimationItem.prototype.checkSegments = function (t) {
            return (
              !!this.segments.length &&
              (this.adjustSegment(this.segments.shift(), t), !0)
            );
          }),
          (AnimationItem.prototype.destroy = function (t) {
            (t && this.name !== t) ||
              !this.renderer ||
              (this.renderer.destroy(),
              this.imagePreloader.destroy(),
              this.trigger('destroy'),
              (this._cbs = null),
              (this.onEnterFrame = null),
              (this.onLoopComplete = null),
              (this.onComplete = null),
              (this.onSegmentStart = null),
              (this.onDestroy = null),
              (this.renderer = null),
              (this.renderer = null),
              (this.imagePreloader = null),
              (this.projectInterface = null));
          }),
          (AnimationItem.prototype.setCurrentRawFrameValue = function (t) {
            (this.currentRawFrame = t), this.gotoFrame();
          }),
          (AnimationItem.prototype.setSpeed = function (t) {
            (this.playSpeed = t), this.updaFrameModifier();
          }),
          (AnimationItem.prototype.setDirection = function (t) {
            (this.playDirection = t < 0 ? -1 : 1), this.updaFrameModifier();
          }),
          (AnimationItem.prototype.setVolume = function (t, e) {
            (e && this.name !== e) || this.audioController.setVolume(t);
          }),
          (AnimationItem.prototype.getVolume = function () {
            return this.audioController.getVolume();
          }),
          (AnimationItem.prototype.mute = function (t) {
            (t && this.name !== t) || this.audioController.mute();
          }),
          (AnimationItem.prototype.unmute = function (t) {
            (t && this.name !== t) || this.audioController.unmute();
          }),
          (AnimationItem.prototype.updaFrameModifier = function () {
            (this.frameModifier =
              this.frameMult * this.playSpeed * this.playDirection),
              this.audioController.setRate(this.playSpeed * this.playDirection);
          }),
          (AnimationItem.prototype.getPath = function () {
            return this.path;
          }),
          (AnimationItem.prototype.getAssetsPath = function (t) {
            var e = '';
            if (t.e) e = t.p;
            else if (this.assetsPath) {
              var r = t.p;
              -1 !== r.indexOf('images/') && (r = r.split('/')[1]),
                (e = this.assetsPath + r);
            } else (e = this.path), (e += t.u ? t.u : ''), (e += t.p);
            return e;
          }),
          (AnimationItem.prototype.getAssetData = function (t) {
            for (var e = 0, r = this.assets.length; e < r; ) {
              if (t === this.assets[e].id) return this.assets[e];
              e += 1;
            }
            return null;
          }),
          (AnimationItem.prototype.hide = function () {
            this.renderer.hide();
          }),
          (AnimationItem.prototype.show = function () {
            this.renderer.show();
          }),
          (AnimationItem.prototype.getDuration = function (t) {
            return t ? this.totalFrames : this.totalFrames / this.frameRate;
          }),
          (AnimationItem.prototype.updateDocumentData = function (t, e, r) {
            try {
              this.renderer.getElementByPath(t).updateDocumentData(e, r);
            } catch (t) {}
          }),
          (AnimationItem.prototype.trigger = function (t) {
            if (this._cbs && this._cbs[t])
              switch (t) {
                case 'enterFrame':
                  this.triggerEvent(
                    t,
                    new BMEnterFrameEvent(
                      t,
                      this.currentFrame,
                      this.totalFrames,
                      this.frameModifier
                    )
                  );
                  break;
                case 'drawnFrame':
                  (this.drawnFrameEvent.currentTime = this.currentFrame),
                    (this.drawnFrameEvent.totalTime = this.totalFrames),
                    (this.drawnFrameEvent.direction = this.frameModifier),
                    this.triggerEvent(t, this.drawnFrameEvent);
                  break;
                case 'loopComplete':
                  this.triggerEvent(
                    t,
                    new BMCompleteLoopEvent(
                      t,
                      this.loop,
                      this.playCount,
                      this.frameMult
                    )
                  );
                  break;
                case 'complete':
                  this.triggerEvent(t, new BMCompleteEvent(t, this.frameMult));
                  break;
                case 'segmentStart':
                  this.triggerEvent(
                    t,
                    new BMSegmentStartEvent(
                      t,
                      this.firstFrame,
                      this.totalFrames
                    )
                  );
                  break;
                case 'destroy':
                  this.triggerEvent(t, new BMDestroyEvent(t, this));
                  break;
                default:
                  this.triggerEvent(t);
              }
            'enterFrame' === t &&
              this.onEnterFrame &&
              this.onEnterFrame.call(
                this,
                new BMEnterFrameEvent(
                  t,
                  this.currentFrame,
                  this.totalFrames,
                  this.frameMult
                )
              ),
              'loopComplete' === t &&
                this.onLoopComplete &&
                this.onLoopComplete.call(
                  this,
                  new BMCompleteLoopEvent(
                    t,
                    this.loop,
                    this.playCount,
                    this.frameMult
                  )
                ),
              'complete' === t &&
                this.onComplete &&
                this.onComplete.call(
                  this,
                  new BMCompleteEvent(t, this.frameMult)
                ),
              'segmentStart' === t &&
                this.onSegmentStart &&
                this.onSegmentStart.call(
                  this,
                  new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames)
                ),
              'destroy' === t &&
                this.onDestroy &&
                this.onDestroy.call(this, new BMDestroyEvent(t, this));
          }),
          (AnimationItem.prototype.triggerRenderFrameError = function (t) {
            var e = new BMRenderFrameErrorEvent(t, this.currentFrame);
            this.triggerEvent('error', e),
              this.onError && this.onError.call(this, e);
          }),
          (AnimationItem.prototype.triggerConfigError = function (t) {
            var e = new BMConfigErrorEvent(t, this.currentFrame);
            this.triggerEvent('error', e),
              this.onError && this.onError.call(this, e);
          });
        var animationManager = (function () {
            var t = {},
              e = [],
              r = 0,
              i = 0,
              s = 0,
              a = !0,
              n = !1;
            function o(t) {
              for (var r = 0, s = t.target; r < i; )
                e[r].animation === s &&
                  (e.splice(r, 1), (r -= 1), (i -= 1), s.isPaused || p()),
                  (r += 1);
            }
            function h(t, r) {
              if (!t) return null;
              for (var s = 0; s < i; ) {
                if (e[s].elem === t && null !== e[s].elem)
                  return e[s].animation;
                s += 1;
              }
              var a = new AnimationItem();
              return c(a, t), a.setData(t, r), a;
            }
            function l() {
              (s += 1), m();
            }
            function p() {
              s -= 1;
            }
            function c(t, r) {
              t.addEventListener('destroy', o),
                t.addEventListener('_active', l),
                t.addEventListener('_idle', p),
                e.push({ elem: r, animation: t }),
                (i += 1);
            }
            function f(t) {
              var o,
                h = t - r;
              for (o = 0; o < i; o += 1) e[o].animation.advanceTime(h);
              (r = t), s && !n ? window.requestAnimationFrame(f) : (a = !0);
            }
            function d(t) {
              (r = t), window.requestAnimationFrame(f);
            }
            function m() {
              !n && s && a && (window.requestAnimationFrame(d), (a = !1));
            }
            return (
              (t.registerAnimation = h),
              (t.loadAnimation = function (t) {
                var e = new AnimationItem();
                return c(e, null), e.setParams(t), e;
              }),
              (t.setSpeed = function (t, r) {
                var s;
                for (s = 0; s < i; s += 1) e[s].animation.setSpeed(t, r);
              }),
              (t.setDirection = function (t, r) {
                var s;
                for (s = 0; s < i; s += 1) e[s].animation.setDirection(t, r);
              }),
              (t.play = function (t) {
                var r;
                for (r = 0; r < i; r += 1) e[r].animation.play(t);
              }),
              (t.pause = function (t) {
                var r;
                for (r = 0; r < i; r += 1) e[r].animation.pause(t);
              }),
              (t.stop = function (t) {
                var r;
                for (r = 0; r < i; r += 1) e[r].animation.stop(t);
              }),
              (t.togglePause = function (t) {
                var r;
                for (r = 0; r < i; r += 1) e[r].animation.togglePause(t);
              }),
              (t.searchAnimations = function (t, e, r) {
                var i,
                  s = [].concat(
                    [].slice.call(document.getElementsByClassName('lottie')),
                    [].slice.call(document.getElementsByClassName('bodymovin'))
                  ),
                  a = s.length;
                for (i = 0; i < a; i += 1)
                  r && s[i].setAttribute('data-bm-type', r), h(s[i], t);
                if (e && 0 === a) {
                  r || (r = 'svg');
                  var n = document.getElementsByTagName('body')[0];
                  n.innerText = '';
                  var o = createTag('div');
                  (o.style.width = '100%'),
                    (o.style.height = '100%'),
                    o.setAttribute('data-bm-type', r),
                    n.appendChild(o),
                    h(o, t);
                }
              }),
              (t.resize = function () {
                var t;
                for (t = 0; t < i; t += 1) e[t].animation.resize();
              }),
              (t.goToAndStop = function (t, r, s) {
                var a;
                for (a = 0; a < i; a += 1) e[a].animation.goToAndStop(t, r, s);
              }),
              (t.destroy = function (t) {
                var r;
                for (r = i - 1; r >= 0; r -= 1) e[r].animation.destroy(t);
              }),
              (t.freeze = function () {
                n = !0;
              }),
              (t.unfreeze = function () {
                (n = !1), m();
              }),
              (t.setVolume = function (t, r) {
                var s;
                for (s = 0; s < i; s += 1) e[s].animation.setVolume(t, r);
              }),
              (t.mute = function (t) {
                var r;
                for (r = 0; r < i; r += 1) e[r].animation.mute(t);
              }),
              (t.unmute = function (t) {
                var r;
                for (r = 0; r < i; r += 1) e[r].animation.unmute(t);
              }),
              (t.getRegisteredAnimations = function () {
                var t,
                  r = e.length,
                  i = [];
                for (t = 0; t < r; t += 1) i.push(e[t].animation);
                return i;
              }),
              t
            );
          })(),
          BezierFactory = (function () {
            var t = {
                getBezierEasing: function (t, r, i, s, a) {
                  var n =
                    a ||
                    ('bez_' + t + '_' + r + '_' + i + '_' + s).replace(
                      /\./g,
                      'p'
                    );
                  if (e[n]) return e[n];
                  var o = new l([t, r, i, s]);
                  return (e[n] = o), o;
                },
              },
              e = {},
              r = 0.1,
              i = 'function' == typeof Float32Array;
            function s(t, e) {
              return 1 - 3 * e + 3 * t;
            }
            function a(t, e) {
              return 3 * e - 6 * t;
            }
            function n(t) {
              return 3 * t;
            }
            function o(t, e, r) {
              return ((s(e, r) * t + a(e, r)) * t + n(e)) * t;
            }
            function h(t, e, r) {
              return 3 * s(e, r) * t * t + 2 * a(e, r) * t + n(e);
            }
            function l(t) {
              (this._p = t),
                (this._mSampleValues = i
                  ? new Float32Array(11)
                  : new Array(11)),
                (this._precomputed = !1),
                (this.get = this.get.bind(this));
            }
            return (
              (l.prototype = {
                get: function (t) {
                  var e = this._p[0],
                    r = this._p[1],
                    i = this._p[2],
                    s = this._p[3];
                  return (
                    this._precomputed || this._precompute(),
                    e === r && i === s
                      ? t
                      : 0 === t
                      ? 0
                      : 1 === t
                      ? 1
                      : o(this._getTForX(t), r, s)
                  );
                },
                _precompute: function () {
                  var t = this._p[0],
                    e = this._p[1],
                    r = this._p[2],
                    i = this._p[3];
                  (this._precomputed = !0),
                    (t === e && r === i) || this._calcSampleValues();
                },
                _calcSampleValues: function () {
                  for (var t = this._p[0], e = this._p[2], i = 0; i < 11; ++i)
                    this._mSampleValues[i] = o(i * r, t, e);
                },
                _getTForX: function (t) {
                  for (
                    var e = this._p[0],
                      i = this._p[2],
                      s = this._mSampleValues,
                      a = 0,
                      n = 1;
                    10 !== n && s[n] <= t;
                    ++n
                  )
                    a += r;
                  var l = a + ((t - s[--n]) / (s[n + 1] - s[n])) * r,
                    p = h(l, e, i);
                  return p >= 0.001
                    ? (function (t, e, r, i) {
                        for (var s = 0; s < 4; ++s) {
                          var a = h(e, r, i);
                          if (0 === a) return e;
                          e -= (o(e, r, i) - t) / a;
                        }
                        return e;
                      })(t, l, e, i)
                    : 0 === p
                    ? l
                    : (function (t, e, r, i, s) {
                        var a,
                          n,
                          h = 0;
                        do {
                          (a = o((n = e + (r - e) / 2), i, s) - t) > 0
                            ? (r = n)
                            : (e = n);
                        } while (Math.abs(a) > 1e-7 && ++h < 10);
                        return n;
                      })(t, a, a + r, e, i);
                },
              }),
              t
            );
          })(),
          pooling = {
            double: function (t) {
              return t.concat(createSizedArray(t.length));
            },
          },
          poolFactory = function (t, e, r) {
            var i = 0,
              s = t,
              a = createSizedArray(s);
            return {
              newElement: function () {
                return i ? a[(i -= 1)] : e();
              },
              release: function (t) {
                i === s && ((a = pooling.double(a)), (s *= 2)),
                  r && r(t),
                  (a[i] = t),
                  (i += 1);
              },
            };
          },
          bezierLengthPool = poolFactory(8, function () {
            return {
              addedLength: 0,
              percents: createTypedArray('float32', getDefaultCurveSegments()),
              lengths: createTypedArray('float32', getDefaultCurveSegments()),
            };
          }),
          segmentsLengthPool = poolFactory(
            8,
            function () {
              return { lengths: [], totalLength: 0 };
            },
            function (t) {
              var e,
                r = t.lengths.length;
              for (e = 0; e < r; e += 1) bezierLengthPool.release(t.lengths[e]);
              t.lengths.length = 0;
            }
          );
        function bezFunction() {
          var t = Math;
          function e(t, e, r, i, s, a) {
            var n = t * i + e * s + r * a - s * i - a * t - r * e;
            return n > -0.001 && n < 0.001;
          }
          var r = function (t, e, r, i) {
            var s,
              a,
              n,
              o,
              h,
              l,
              p = getDefaultCurveSegments(),
              c = 0,
              f = [],
              d = [],
              m = bezierLengthPool.newElement();
            for (n = r.length, s = 0; s < p; s += 1) {
              for (h = s / (p - 1), l = 0, a = 0; a < n; a += 1)
                (o =
                  bmPow(1 - h, 3) * t[a] +
                  3 * bmPow(1 - h, 2) * h * r[a] +
                  3 * (1 - h) * bmPow(h, 2) * i[a] +
                  bmPow(h, 3) * e[a]),
                  (f[a] = o),
                  null !== d[a] && (l += bmPow(f[a] - d[a], 2)),
                  (d[a] = f[a]);
              l && (c += l = bmSqrt(l)),
                (m.percents[s] = h),
                (m.lengths[s] = c);
            }
            return (m.addedLength = c), m;
          };
          function i(t) {
            (this.segmentLength = 0), (this.points = new Array(t));
          }
          function s(t, e) {
            (this.partialLength = t), (this.point = e);
          }
          var a,
            n =
              ((a = {}),
              function (t, r, n, o) {
                var h = (
                  t[0] +
                  '_' +
                  t[1] +
                  '_' +
                  r[0] +
                  '_' +
                  r[1] +
                  '_' +
                  n[0] +
                  '_' +
                  n[1] +
                  '_' +
                  o[0] +
                  '_' +
                  o[1]
                ).replace(/\./g, 'p');
                if (!a[h]) {
                  var l,
                    p,
                    c,
                    f,
                    d,
                    m,
                    u,
                    y = getDefaultCurveSegments(),
                    g = 0,
                    v = null;
                  2 === t.length &&
                    (t[0] !== r[0] || t[1] !== r[1]) &&
                    e(t[0], t[1], r[0], r[1], t[0] + n[0], t[1] + n[1]) &&
                    e(t[0], t[1], r[0], r[1], r[0] + o[0], r[1] + o[1]) &&
                    (y = 2);
                  var b = new i(y);
                  for (c = n.length, l = 0; l < y; l += 1) {
                    for (
                      u = createSizedArray(c), d = l / (y - 1), m = 0, p = 0;
                      p < c;
                      p += 1
                    )
                      (f =
                        bmPow(1 - d, 3) * t[p] +
                        3 * bmPow(1 - d, 2) * d * (t[p] + n[p]) +
                        3 * (1 - d) * bmPow(d, 2) * (r[p] + o[p]) +
                        bmPow(d, 3) * r[p]),
                        (u[p] = f),
                        null !== v && (m += bmPow(u[p] - v[p], 2));
                    (g += m = bmSqrt(m)), (b.points[l] = new s(m, u)), (v = u);
                  }
                  (b.segmentLength = g), (a[h] = b);
                }
                return a[h];
              });
          function o(t, e) {
            var r = e.percents,
              i = e.lengths,
              s = r.length,
              a = bmFloor((s - 1) * t),
              n = t * e.addedLength,
              o = 0;
            if (a === s - 1 || 0 === a || n === i[a]) return r[a];
            for (var h = i[a] > n ? -1 : 1, l = !0; l; )
              if (
                (i[a] <= n && i[a + 1] > n
                  ? ((o = (n - i[a]) / (i[a + 1] - i[a])), (l = !1))
                  : (a += h),
                a < 0 || a >= s - 1)
              ) {
                if (a === s - 1) return r[a];
                l = !1;
              }
            return r[a] + (r[a + 1] - r[a]) * o;
          }
          var h = createTypedArray('float32', 8);
          return {
            getSegmentsLength: function (t) {
              var e,
                i = segmentsLengthPool.newElement(),
                s = t.c,
                a = t.v,
                n = t.o,
                o = t.i,
                h = t._length,
                l = i.lengths,
                p = 0;
              for (e = 0; e < h - 1; e += 1)
                (l[e] = r(a[e], a[e + 1], n[e], o[e + 1])),
                  (p += l[e].addedLength);
              return (
                s &&
                  h &&
                  ((l[e] = r(a[e], a[0], n[e], o[0])), (p += l[e].addedLength)),
                (i.totalLength = p),
                i
              );
            },
            getNewSegment: function (e, r, i, s, a, n, l) {
              a < 0 ? (a = 0) : a > 1 && (a = 1);
              var p,
                c = o(a, l),
                f = o((n = n > 1 ? 1 : n), l),
                d = e.length,
                m = 1 - c,
                u = 1 - f,
                y = m * m * m,
                g = c * m * m * 3,
                v = c * c * m * 3,
                b = c * c * c,
                _ = m * m * u,
                P = c * m * u + m * c * u + m * m * f,
                E = c * c * u + m * c * f + c * m * f,
                S = c * c * f,
                x = m * u * u,
                A = c * u * u + m * f * u + m * u * f,
                w = c * f * u + m * f * f + c * u * f,
                C = c * f * f,
                k = u * u * u,
                T = f * u * u + u * f * u + u * u * f,
                D = f * f * u + u * f * f + f * u * f,
                M = f * f * f;
              for (p = 0; p < d; p += 1)
                (h[4 * p] =
                  t.round(1e3 * (y * e[p] + g * i[p] + v * s[p] + b * r[p])) /
                  1e3),
                  (h[4 * p + 1] =
                    t.round(1e3 * (_ * e[p] + P * i[p] + E * s[p] + S * r[p])) /
                    1e3),
                  (h[4 * p + 2] =
                    t.round(1e3 * (x * e[p] + A * i[p] + w * s[p] + C * r[p])) /
                    1e3),
                  (h[4 * p + 3] =
                    t.round(1e3 * (k * e[p] + T * i[p] + D * s[p] + M * r[p])) /
                    1e3);
              return h;
            },
            getPointInSegment: function (e, r, i, s, a, n) {
              var h = o(a, n),
                l = 1 - h;
              return [
                t.round(
                  1e3 *
                    (l * l * l * e[0] +
                      (h * l * l + l * h * l + l * l * h) * i[0] +
                      (h * h * l + l * h * h + h * l * h) * s[0] +
                      h * h * h * r[0])
                ) / 1e3,
                t.round(
                  1e3 *
                    (l * l * l * e[1] +
                      (h * l * l + l * h * l + l * l * h) * i[1] +
                      (h * h * l + l * h * h + h * l * h) * s[1] +
                      h * h * h * r[1])
                ) / 1e3,
              ];
            },
            buildBezierData: n,
            pointOnLine2D: e,
            pointOnLine3D: function (r, i, s, a, n, o, h, l, p) {
              if (0 === s && 0 === o && 0 === p) return e(r, i, a, n, h, l);
              var c,
                f = t.sqrt(t.pow(a - r, 2) + t.pow(n - i, 2) + t.pow(o - s, 2)),
                d = t.sqrt(t.pow(h - r, 2) + t.pow(l - i, 2) + t.pow(p - s, 2)),
                m = t.sqrt(t.pow(h - a, 2) + t.pow(l - n, 2) + t.pow(p - o, 2));
              return (
                (c =
                  f > d
                    ? f > m
                      ? f - d - m
                      : m - d - f
                    : m > d
                    ? m - d - f
                    : d - f - m) > -1e-4 && c < 1e-4
              );
            },
          };
        }
        var bez = bezFunction(),
          PropertyFactory = (function () {
            var t = initialDefaultFrame,
              e = Math.abs;
            function r(t, e) {
              var r,
                s = this.offsetTime;
              'multidimensional' === this.propType &&
                (r = createTypedArray('float32', this.pv.length));
              for (
                var a,
                  n,
                  o,
                  h,
                  l,
                  p,
                  c,
                  f,
                  d,
                  m = e.lastIndex,
                  u = m,
                  y = this.keyframes.length - 1,
                  g = !0;
                g;

              ) {
                if (
                  ((a = this.keyframes[u]),
                  (n = this.keyframes[u + 1]),
                  u === y - 1 && t >= n.t - s)
                ) {
                  a.h && (a = n), (m = 0);
                  break;
                }
                if (n.t - s > t) {
                  m = u;
                  break;
                }
                u < y - 1 ? (u += 1) : ((m = 0), (g = !1));
              }
              o = this.keyframesMetadata[u] || {};
              var v,
                b,
                _,
                P,
                E,
                S,
                x,
                A,
                w,
                C,
                k = n.t - s,
                T = a.t - s;
              if (a.to) {
                o.bezierData ||
                  (o.bezierData = bez.buildBezierData(
                    a.s,
                    n.s || a.e,
                    a.to,
                    a.ti
                  ));
                var D = o.bezierData;
                if (t >= k || t < T) {
                  var M = t >= k ? D.points.length - 1 : 0;
                  for (l = D.points[M].point.length, h = 0; h < l; h += 1)
                    r[h] = D.points[M].point[h];
                } else {
                  o.__fnct
                    ? (d = o.__fnct)
                    : ((d = BezierFactory.getBezierEasing(
                        a.o.x,
                        a.o.y,
                        a.i.x,
                        a.i.y,
                        a.n
                      ).get),
                      (o.__fnct = d)),
                    (p = d((t - T) / (k - T)));
                  var F,
                    I = D.segmentLength * p,
                    R =
                      e.lastFrame < t && e._lastKeyframeIndex === u
                        ? e._lastAddedLength
                        : 0;
                  for (
                    f =
                      e.lastFrame < t && e._lastKeyframeIndex === u
                        ? e._lastPoint
                        : 0,
                      g = !0,
                      c = D.points.length;
                    g;

                  ) {
                    if (
                      ((R += D.points[f].partialLength),
                      0 === I || 0 === p || f === D.points.length - 1)
                    ) {
                      for (l = D.points[f].point.length, h = 0; h < l; h += 1)
                        r[h] = D.points[f].point[h];
                      break;
                    }
                    if (I >= R && I < R + D.points[f + 1].partialLength) {
                      for (
                        F = (I - R) / D.points[f + 1].partialLength,
                          l = D.points[f].point.length,
                          h = 0;
                        h < l;
                        h += 1
                      )
                        r[h] =
                          D.points[f].point[h] +
                          (D.points[f + 1].point[h] - D.points[f].point[h]) * F;
                      break;
                    }
                    f < c - 1 ? (f += 1) : (g = !1);
                  }
                  (e._lastPoint = f),
                    (e._lastAddedLength = R - D.points[f].partialLength),
                    (e._lastKeyframeIndex = u);
                }
              } else {
                var B, V, L, O, $;
                if (((y = a.s.length), (v = n.s || a.e), this.sh && 1 !== a.h))
                  if (t >= k) (r[0] = v[0]), (r[1] = v[1]), (r[2] = v[2]);
                  else if (t <= T)
                    (r[0] = a.s[0]), (r[1] = a.s[1]), (r[2] = a.s[2]);
                  else {
                    var z = i(a.s),
                      G = i(v);
                    (b = r),
                      (_ = (function (t, e, r) {
                        var i,
                          s,
                          a,
                          n,
                          o,
                          h = [],
                          l = t[0],
                          p = t[1],
                          c = t[2],
                          f = t[3],
                          d = e[0],
                          m = e[1],
                          u = e[2],
                          y = e[3];
                        return (
                          (s = l * d + p * m + c * u + f * y) < 0 &&
                            ((s = -s), (d = -d), (m = -m), (u = -u), (y = -y)),
                          1 - s > 1e-6
                            ? ((i = Math.acos(s)),
                              (a = Math.sin(i)),
                              (n = Math.sin((1 - r) * i) / a),
                              (o = Math.sin(r * i) / a))
                            : ((n = 1 - r), (o = r)),
                          (h[0] = n * l + o * d),
                          (h[1] = n * p + o * m),
                          (h[2] = n * c + o * u),
                          (h[3] = n * f + o * y),
                          h
                        );
                      })(z, G, (t - T) / (k - T))),
                      (P = _[0]),
                      (E = _[1]),
                      (S = _[2]),
                      (x = _[3]),
                      (A = Math.atan2(
                        2 * E * x - 2 * P * S,
                        1 - 2 * E * E - 2 * S * S
                      )),
                      (w = Math.asin(2 * P * E + 2 * S * x)),
                      (C = Math.atan2(
                        2 * P * x - 2 * E * S,
                        1 - 2 * P * P - 2 * S * S
                      )),
                      (b[0] = A / degToRads),
                      (b[1] = w / degToRads),
                      (b[2] = C / degToRads);
                  }
                else
                  for (u = 0; u < y; u += 1)
                    1 !== a.h &&
                      (t >= k
                        ? (p = 1)
                        : t < T
                        ? (p = 0)
                        : (a.o.x.constructor === Array
                            ? (o.__fnct || (o.__fnct = []),
                              o.__fnct[u]
                                ? (d = o.__fnct[u])
                                : ((B =
                                    void 0 === a.o.x[u] ? a.o.x[0] : a.o.x[u]),
                                  (V =
                                    void 0 === a.o.y[u] ? a.o.y[0] : a.o.y[u]),
                                  (L =
                                    void 0 === a.i.x[u] ? a.i.x[0] : a.i.x[u]),
                                  (O =
                                    void 0 === a.i.y[u] ? a.i.y[0] : a.i.y[u]),
                                  (d = BezierFactory.getBezierEasing(
                                    B,
                                    V,
                                    L,
                                    O
                                  ).get),
                                  (o.__fnct[u] = d)))
                            : o.__fnct
                            ? (d = o.__fnct)
                            : ((B = a.o.x),
                              (V = a.o.y),
                              (L = a.i.x),
                              (O = a.i.y),
                              (d = BezierFactory.getBezierEasing(
                                B,
                                V,
                                L,
                                O
                              ).get),
                              (a.keyframeMetadata = d)),
                          (p = d((t - T) / (k - T))))),
                      (v = n.s || a.e),
                      ($ = 1 === a.h ? a.s[u] : a.s[u] + (v[u] - a.s[u]) * p),
                      'multidimensional' === this.propType
                        ? (r[u] = $)
                        : (r = $);
              }
              return (e.lastIndex = m), r;
            }
            function i(t) {
              var e = t[0] * degToRads,
                r = t[1] * degToRads,
                i = t[2] * degToRads,
                s = Math.cos(e / 2),
                a = Math.cos(r / 2),
                n = Math.cos(i / 2),
                o = Math.sin(e / 2),
                h = Math.sin(r / 2),
                l = Math.sin(i / 2);
              return [
                o * h * n + s * a * l,
                o * a * n + s * h * l,
                s * h * n - o * a * l,
                s * a * n - o * h * l,
              ];
            }
            function s() {
              var e = this.comp.renderedFrame - this.offsetTime,
                r = this.keyframes[0].t - this.offsetTime,
                i =
                  this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
              if (
                !(
                  e === this._caching.lastFrame ||
                  (this._caching.lastFrame !== t &&
                    ((this._caching.lastFrame >= i && e >= i) ||
                      (this._caching.lastFrame < r && e < r)))
                )
              ) {
                this._caching.lastFrame >= e &&
                  ((this._caching._lastKeyframeIndex = -1),
                  (this._caching.lastIndex = 0));
                var s = this.interpolateValue(e, this._caching);
                this.pv = s;
              }
              return (this._caching.lastFrame = e), this.pv;
            }
            function a(t) {
              var r;
              if ('unidimensional' === this.propType)
                (r = t * this.mult),
                  e(this.v - r) > 1e-5 && ((this.v = r), (this._mdf = !0));
              else
                for (var i = 0, s = this.v.length; i < s; )
                  (r = t[i] * this.mult),
                    e(this.v[i] - r) > 1e-5 &&
                      ((this.v[i] = r), (this._mdf = !0)),
                    (i += 1);
            }
            function n() {
              if (
                this.elem.globalData.frameId !== this.frameId &&
                this.effectsSequence.length
              )
                if (this.lock) this.setVValue(this.pv);
                else {
                  var t;
                  (this.lock = !0), (this._mdf = this._isFirstFrame);
                  var e = this.effectsSequence.length,
                    r = this.kf ? this.pv : this.data.k;
                  for (t = 0; t < e; t += 1) r = this.effectsSequence[t](r);
                  this.setVValue(r),
                    (this._isFirstFrame = !1),
                    (this.lock = !1),
                    (this.frameId = this.elem.globalData.frameId);
                }
            }
            function o(t) {
              this.effectsSequence.push(t),
                this.container.addDynamicProperty(this);
            }
            function h(t, e, r, i) {
              (this.propType = 'unidimensional'),
                (this.mult = r || 1),
                (this.data = e),
                (this.v = r ? e.k * r : e.k),
                (this.pv = e.k),
                (this._mdf = !1),
                (this.elem = t),
                (this.container = i),
                (this.comp = t.comp),
                (this.k = !1),
                (this.kf = !1),
                (this.vel = 0),
                (this.effectsSequence = []),
                (this._isFirstFrame = !0),
                (this.getValue = n),
                (this.setVValue = a),
                (this.addEffect = o);
            }
            function l(t, e, r, i) {
              var s;
              (this.propType = 'multidimensional'),
                (this.mult = r || 1),
                (this.data = e),
                (this._mdf = !1),
                (this.elem = t),
                (this.container = i),
                (this.comp = t.comp),
                (this.k = !1),
                (this.kf = !1),
                (this.frameId = -1);
              var h = e.k.length;
              for (
                this.v = createTypedArray('float32', h),
                  this.pv = createTypedArray('float32', h),
                  this.vel = createTypedArray('float32', h),
                  s = 0;
                s < h;
                s += 1
              )
                (this.v[s] = e.k[s] * this.mult), (this.pv[s] = e.k[s]);
              (this._isFirstFrame = !0),
                (this.effectsSequence = []),
                (this.getValue = n),
                (this.setVValue = a),
                (this.addEffect = o);
            }
            function p(e, i, h, l) {
              (this.propType = 'unidimensional'),
                (this.keyframes = i.k),
                (this.keyframesMetadata = []),
                (this.offsetTime = e.data.st),
                (this.frameId = -1),
                (this._caching = {
                  lastFrame: t,
                  lastIndex: 0,
                  value: 0,
                  _lastKeyframeIndex: -1,
                }),
                (this.k = !0),
                (this.kf = !0),
                (this.data = i),
                (this.mult = h || 1),
                (this.elem = e),
                (this.container = l),
                (this.comp = e.comp),
                (this.v = t),
                (this.pv = t),
                (this._isFirstFrame = !0),
                (this.getValue = n),
                (this.setVValue = a),
                (this.interpolateValue = r),
                (this.effectsSequence = [s.bind(this)]),
                (this.addEffect = o);
            }
            function c(e, i, h, l) {
              var p;
              this.propType = 'multidimensional';
              var c,
                f,
                d,
                m,
                u = i.k.length;
              for (p = 0; p < u - 1; p += 1)
                i.k[p].to &&
                  i.k[p].s &&
                  i.k[p + 1] &&
                  i.k[p + 1].s &&
                  ((c = i.k[p].s),
                  (f = i.k[p + 1].s),
                  (d = i.k[p].to),
                  (m = i.k[p].ti),
                  ((2 === c.length &&
                    (c[0] !== f[0] || c[1] !== f[1]) &&
                    bez.pointOnLine2D(
                      c[0],
                      c[1],
                      f[0],
                      f[1],
                      c[0] + d[0],
                      c[1] + d[1]
                    ) &&
                    bez.pointOnLine2D(
                      c[0],
                      c[1],
                      f[0],
                      f[1],
                      f[0] + m[0],
                      f[1] + m[1]
                    )) ||
                    (3 === c.length &&
                      (c[0] !== f[0] || c[1] !== f[1] || c[2] !== f[2]) &&
                      bez.pointOnLine3D(
                        c[0],
                        c[1],
                        c[2],
                        f[0],
                        f[1],
                        f[2],
                        c[0] + d[0],
                        c[1] + d[1],
                        c[2] + d[2]
                      ) &&
                      bez.pointOnLine3D(
                        c[0],
                        c[1],
                        c[2],
                        f[0],
                        f[1],
                        f[2],
                        f[0] + m[0],
                        f[1] + m[1],
                        f[2] + m[2]
                      ))) &&
                    ((i.k[p].to = null), (i.k[p].ti = null)),
                  c[0] === f[0] &&
                    c[1] === f[1] &&
                    0 === d[0] &&
                    0 === d[1] &&
                    0 === m[0] &&
                    0 === m[1] &&
                    (2 === c.length ||
                      (c[2] === f[2] && 0 === d[2] && 0 === m[2])) &&
                    ((i.k[p].to = null), (i.k[p].ti = null)));
              (this.effectsSequence = [s.bind(this)]),
                (this.data = i),
                (this.keyframes = i.k),
                (this.keyframesMetadata = []),
                (this.offsetTime = e.data.st),
                (this.k = !0),
                (this.kf = !0),
                (this._isFirstFrame = !0),
                (this.mult = h || 1),
                (this.elem = e),
                (this.container = l),
                (this.comp = e.comp),
                (this.getValue = n),
                (this.setVValue = a),
                (this.interpolateValue = r),
                (this.frameId = -1);
              var y = i.k[0].s.length;
              for (
                this.v = createTypedArray('float32', y),
                  this.pv = createTypedArray('float32', y),
                  p = 0;
                p < y;
                p += 1
              )
                (this.v[p] = t), (this.pv[p] = t);
              (this._caching = {
                lastFrame: t,
                lastIndex: 0,
                value: createTypedArray('float32', y),
              }),
                (this.addEffect = o);
            }
            var f = {
              getProp: function (t, e, r, i, s) {
                var a;
                if (e.k.length)
                  if ('number' == typeof e.k[0]) a = new l(t, e, i, s);
                  else
                    switch (r) {
                      case 0:
                        a = new p(t, e, i, s);
                        break;
                      case 1:
                        a = new c(t, e, i, s);
                    }
                else a = new h(t, e, i, s);
                return a.effectsSequence.length && s.addDynamicProperty(a), a;
              },
            };
            return f;
          })();
        function DynamicPropertyContainer() {}
        DynamicPropertyContainer.prototype = {
          addDynamicProperty: function (t) {
            -1 === this.dynamicProperties.indexOf(t) &&
              (this.dynamicProperties.push(t),
              this.container.addDynamicProperty(this),
              (this._isAnimated = !0));
          },
          iterateDynamicProperties: function () {
            var t;
            this._mdf = !1;
            var e = this.dynamicProperties.length;
            for (t = 0; t < e; t += 1)
              this.dynamicProperties[t].getValue(),
                this.dynamicProperties[t]._mdf && (this._mdf = !0);
          },
          initDynamicPropertyContainer: function (t) {
            (this.container = t),
              (this.dynamicProperties = []),
              (this._mdf = !1),
              (this._isAnimated = !1);
          },
        };
        var pointPool = poolFactory(8, function () {
          return createTypedArray('float32', 2);
        });
        function ShapePath() {
          (this.c = !1),
            (this._length = 0),
            (this._maxLength = 8),
            (this.v = createSizedArray(this._maxLength)),
            (this.o = createSizedArray(this._maxLength)),
            (this.i = createSizedArray(this._maxLength));
        }
        (ShapePath.prototype.setPathData = function (t, e) {
          (this.c = t), this.setLength(e);
          for (var r = 0; r < e; )
            (this.v[r] = pointPool.newElement()),
              (this.o[r] = pointPool.newElement()),
              (this.i[r] = pointPool.newElement()),
              (r += 1);
        }),
          (ShapePath.prototype.setLength = function (t) {
            for (; this._maxLength < t; ) this.doubleArrayLength();
            this._length = t;
          }),
          (ShapePath.prototype.doubleArrayLength = function () {
            (this.v = this.v.concat(createSizedArray(this._maxLength))),
              (this.i = this.i.concat(createSizedArray(this._maxLength))),
              (this.o = this.o.concat(createSizedArray(this._maxLength))),
              (this._maxLength *= 2);
          }),
          (ShapePath.prototype.setXYAt = function (t, e, r, i, s) {
            var a;
            switch (
              ((this._length = Math.max(this._length, i + 1)),
              this._length >= this._maxLength && this.doubleArrayLength(),
              r)
            ) {
              case 'v':
                a = this.v;
                break;
              case 'i':
                a = this.i;
                break;
              case 'o':
                a = this.o;
                break;
              default:
                a = [];
            }
            (!a[i] || (a[i] && !s)) && (a[i] = pointPool.newElement()),
              (a[i][0] = t),
              (a[i][1] = e);
          }),
          (ShapePath.prototype.setTripleAt = function (t, e, r, i, s, a, n, o) {
            this.setXYAt(t, e, 'v', n, o),
              this.setXYAt(r, i, 'o', n, o),
              this.setXYAt(s, a, 'i', n, o);
          }),
          (ShapePath.prototype.reverse = function () {
            var t = new ShapePath();
            t.setPathData(this.c, this._length);
            var e = this.v,
              r = this.o,
              i = this.i,
              s = 0;
            this.c &&
              (t.setTripleAt(
                e[0][0],
                e[0][1],
                i[0][0],
                i[0][1],
                r[0][0],
                r[0][1],
                0,
                !1
              ),
              (s = 1));
            var a,
              n = this._length - 1,
              o = this._length;
            for (a = s; a < o; a += 1)
              t.setTripleAt(
                e[n][0],
                e[n][1],
                i[n][0],
                i[n][1],
                r[n][0],
                r[n][1],
                a,
                !1
              ),
                (n -= 1);
            return t;
          });
        var shapePool =
            ((factory = poolFactory(
              4,
              function () {
                return new ShapePath();
              },
              function (t) {
                var e,
                  r = t._length;
                for (e = 0; e < r; e += 1)
                  pointPool.release(t.v[e]),
                    pointPool.release(t.i[e]),
                    pointPool.release(t.o[e]),
                    (t.v[e] = null),
                    (t.i[e] = null),
                    (t.o[e] = null);
                (t._length = 0), (t.c = !1);
              }
            )),
            (factory.clone = function (t) {
              var e,
                r = factory.newElement(),
                i = void 0 === t._length ? t.v.length : t._length;
              for (r.setLength(i), r.c = t.c, e = 0; e < i; e += 1)
                r.setTripleAt(
                  t.v[e][0],
                  t.v[e][1],
                  t.o[e][0],
                  t.o[e][1],
                  t.i[e][0],
                  t.i[e][1],
                  e
                );
              return r;
            }),
            factory),
          factory;
        function ShapeCollection() {
          (this._length = 0),
            (this._maxLength = 4),
            (this.shapes = createSizedArray(this._maxLength));
        }
        (ShapeCollection.prototype.addShape = function (t) {
          this._length === this._maxLength &&
            ((this.shapes = this.shapes.concat(
              createSizedArray(this._maxLength)
            )),
            (this._maxLength *= 2)),
            (this.shapes[this._length] = t),
            (this._length += 1);
        }),
          (ShapeCollection.prototype.releaseShapes = function () {
            var t;
            for (t = 0; t < this._length; t += 1)
              shapePool.release(this.shapes[t]);
            this._length = 0;
          });
        var shapeCollectionPool =
            ((ob = {
              newShapeCollection: function () {
                return _length ? pool[(_length -= 1)] : new ShapeCollection();
              },
              release: function (t) {
                var e,
                  r = t._length;
                for (e = 0; e < r; e += 1) shapePool.release(t.shapes[e]);
                (t._length = 0),
                  _length === _maxLength &&
                    ((pool = pooling.double(pool)), (_maxLength *= 2)),
                  (pool[_length] = t),
                  (_length += 1);
              },
            }),
            (_length = 0),
            (_maxLength = 4),
            (pool = createSizedArray(_maxLength)),
            ob),
          ob,
          _length,
          _maxLength,
          pool,
          ShapePropertyFactory = (function () {
            var t = -999999;
            function e(t, e, r) {
              var i,
                s,
                a,
                n,
                o,
                h,
                l,
                p,
                c,
                f = r.lastIndex,
                d = this.keyframes;
              if (t < d[0].t - this.offsetTime)
                (i = d[0].s[0]), (a = !0), (f = 0);
              else if (t >= d[d.length - 1].t - this.offsetTime)
                (i = d[d.length - 1].s
                  ? d[d.length - 1].s[0]
                  : d[d.length - 2].e[0]),
                  (a = !0);
              else {
                for (
                  var m, u, y, g = f, v = d.length - 1, b = !0;
                  b && ((m = d[g]), !((u = d[g + 1]).t - this.offsetTime > t));

                )
                  g < v - 1 ? (g += 1) : (b = !1);
                if (
                  ((y = this.keyframesMetadata[g] || {}),
                  (f = g),
                  !(a = 1 === m.h))
                ) {
                  if (t >= u.t - this.offsetTime) p = 1;
                  else if (t < m.t - this.offsetTime) p = 0;
                  else {
                    var _;
                    y.__fnct
                      ? (_ = y.__fnct)
                      : ((_ = BezierFactory.getBezierEasing(
                          m.o.x,
                          m.o.y,
                          m.i.x,
                          m.i.y
                        ).get),
                        (y.__fnct = _)),
                      (p = _(
                        (t - (m.t - this.offsetTime)) /
                          (u.t - this.offsetTime - (m.t - this.offsetTime))
                      ));
                  }
                  s = u.s ? u.s[0] : m.e[0];
                }
                i = m.s[0];
              }
              for (
                h = e._length, l = i.i[0].length, r.lastIndex = f, n = 0;
                n < h;
                n += 1
              )
                for (o = 0; o < l; o += 1)
                  (c = a ? i.i[n][o] : i.i[n][o] + (s.i[n][o] - i.i[n][o]) * p),
                    (e.i[n][o] = c),
                    (c = a
                      ? i.o[n][o]
                      : i.o[n][o] + (s.o[n][o] - i.o[n][o]) * p),
                    (e.o[n][o] = c),
                    (c = a
                      ? i.v[n][o]
                      : i.v[n][o] + (s.v[n][o] - i.v[n][o]) * p),
                    (e.v[n][o] = c);
            }
            function r() {
              var e = this.comp.renderedFrame - this.offsetTime,
                r = this.keyframes[0].t - this.offsetTime,
                i =
                  this.keyframes[this.keyframes.length - 1].t - this.offsetTime,
                s = this._caching.lastFrame;
              return (
                (s !== t && ((s < r && e < r) || (s > i && e > i))) ||
                  ((this._caching.lastIndex =
                    s < e ? this._caching.lastIndex : 0),
                  this.interpolateShape(e, this.pv, this._caching)),
                (this._caching.lastFrame = e),
                this.pv
              );
            }
            function i() {
              this.paths = this.localShapeCollection;
            }
            function s(t) {
              (function (t, e) {
                if (t._length !== e._length || t.c !== e.c) return !1;
                var r,
                  i = t._length;
                for (r = 0; r < i; r += 1)
                  if (
                    t.v[r][0] !== e.v[r][0] ||
                    t.v[r][1] !== e.v[r][1] ||
                    t.o[r][0] !== e.o[r][0] ||
                    t.o[r][1] !== e.o[r][1] ||
                    t.i[r][0] !== e.i[r][0] ||
                    t.i[r][1] !== e.i[r][1]
                  )
                    return !1;
                return !0;
              })(this.v, t) ||
                ((this.v = shapePool.clone(t)),
                this.localShapeCollection.releaseShapes(),
                this.localShapeCollection.addShape(this.v),
                (this._mdf = !0),
                (this.paths = this.localShapeCollection));
            }
            function a() {
              if (this.elem.globalData.frameId !== this.frameId)
                if (this.effectsSequence.length)
                  if (this.lock) this.setVValue(this.pv);
                  else {
                    var t, e;
                    (this.lock = !0),
                      (this._mdf = !1),
                      (t = this.kf
                        ? this.pv
                        : this.data.ks
                        ? this.data.ks.k
                        : this.data.pt.k);
                    var r = this.effectsSequence.length;
                    for (e = 0; e < r; e += 1) t = this.effectsSequence[e](t);
                    this.setVValue(t),
                      (this.lock = !1),
                      (this.frameId = this.elem.globalData.frameId);
                  }
                else this._mdf = !1;
            }
            function n(t, e, r) {
              (this.propType = 'shape'),
                (this.comp = t.comp),
                (this.container = t),
                (this.elem = t),
                (this.data = e),
                (this.k = !1),
                (this.kf = !1),
                (this._mdf = !1);
              var s = 3 === r ? e.pt.k : e.ks.k;
              (this.v = shapePool.clone(s)),
                (this.pv = shapePool.clone(this.v)),
                (this.localShapeCollection =
                  shapeCollectionPool.newShapeCollection()),
                (this.paths = this.localShapeCollection),
                this.paths.addShape(this.v),
                (this.reset = i),
                (this.effectsSequence = []);
            }
            function o(t) {
              this.effectsSequence.push(t),
                this.container.addDynamicProperty(this);
            }
            function h(e, s, a) {
              (this.propType = 'shape'),
                (this.comp = e.comp),
                (this.elem = e),
                (this.container = e),
                (this.offsetTime = e.data.st),
                (this.keyframes = 3 === a ? s.pt.k : s.ks.k),
                (this.keyframesMetadata = []),
                (this.k = !0),
                (this.kf = !0);
              var n = this.keyframes[0].s[0].i.length;
              (this.v = shapePool.newElement()),
                this.v.setPathData(this.keyframes[0].s[0].c, n),
                (this.pv = shapePool.clone(this.v)),
                (this.localShapeCollection =
                  shapeCollectionPool.newShapeCollection()),
                (this.paths = this.localShapeCollection),
                this.paths.addShape(this.v),
                (this.lastFrame = t),
                (this.reset = i),
                (this._caching = { lastFrame: t, lastIndex: 0 }),
                (this.effectsSequence = [r.bind(this)]);
            }
            (n.prototype.interpolateShape = e),
              (n.prototype.getValue = a),
              (n.prototype.setVValue = s),
              (n.prototype.addEffect = o),
              (h.prototype.getValue = a),
              (h.prototype.interpolateShape = e),
              (h.prototype.setVValue = s),
              (h.prototype.addEffect = o);
            var l = (function () {
                var t = roundCorner;
                function e(t, e) {
                  (this.v = shapePool.newElement()),
                    this.v.setPathData(!0, 4),
                    (this.localShapeCollection =
                      shapeCollectionPool.newShapeCollection()),
                    (this.paths = this.localShapeCollection),
                    this.localShapeCollection.addShape(this.v),
                    (this.d = e.d),
                    (this.elem = t),
                    (this.comp = t.comp),
                    (this.frameId = -1),
                    this.initDynamicPropertyContainer(t),
                    (this.p = PropertyFactory.getProp(t, e.p, 1, 0, this)),
                    (this.s = PropertyFactory.getProp(t, e.s, 1, 0, this)),
                    this.dynamicProperties.length
                      ? (this.k = !0)
                      : ((this.k = !1), this.convertEllToPath());
                }
                return (
                  (e.prototype = {
                    reset: i,
                    getValue: function () {
                      this.elem.globalData.frameId !== this.frameId &&
                        ((this.frameId = this.elem.globalData.frameId),
                        this.iterateDynamicProperties(),
                        this._mdf && this.convertEllToPath());
                    },
                    convertEllToPath: function () {
                      var e = this.p.v[0],
                        r = this.p.v[1],
                        i = this.s.v[0] / 2,
                        s = this.s.v[1] / 2,
                        a = 3 !== this.d,
                        n = this.v;
                      (n.v[0][0] = e),
                        (n.v[0][1] = r - s),
                        (n.v[1][0] = a ? e + i : e - i),
                        (n.v[1][1] = r),
                        (n.v[2][0] = e),
                        (n.v[2][1] = r + s),
                        (n.v[3][0] = a ? e - i : e + i),
                        (n.v[3][1] = r),
                        (n.i[0][0] = a ? e - i * t : e + i * t),
                        (n.i[0][1] = r - s),
                        (n.i[1][0] = a ? e + i : e - i),
                        (n.i[1][1] = r - s * t),
                        (n.i[2][0] = a ? e + i * t : e - i * t),
                        (n.i[2][1] = r + s),
                        (n.i[3][0] = a ? e - i : e + i),
                        (n.i[3][1] = r + s * t),
                        (n.o[0][0] = a ? e + i * t : e - i * t),
                        (n.o[0][1] = r - s),
                        (n.o[1][0] = a ? e + i : e - i),
                        (n.o[1][1] = r + s * t),
                        (n.o[2][0] = a ? e - i * t : e + i * t),
                        (n.o[2][1] = r + s),
                        (n.o[3][0] = a ? e - i : e + i),
                        (n.o[3][1] = r - s * t);
                    },
                  }),
                  extendPrototype([DynamicPropertyContainer], e),
                  e
                );
              })(),
              p = (function () {
                function t(t, e) {
                  (this.v = shapePool.newElement()),
                    this.v.setPathData(!0, 0),
                    (this.elem = t),
                    (this.comp = t.comp),
                    (this.data = e),
                    (this.frameId = -1),
                    (this.d = e.d),
                    this.initDynamicPropertyContainer(t),
                    1 === e.sy
                      ? ((this.ir = PropertyFactory.getProp(
                          t,
                          e.ir,
                          0,
                          0,
                          this
                        )),
                        (this.is = PropertyFactory.getProp(
                          t,
                          e.is,
                          0,
                          0.01,
                          this
                        )),
                        (this.convertToPath = this.convertStarToPath))
                      : (this.convertToPath = this.convertPolygonToPath),
                    (this.pt = PropertyFactory.getProp(t, e.pt, 0, 0, this)),
                    (this.p = PropertyFactory.getProp(t, e.p, 1, 0, this)),
                    (this.r = PropertyFactory.getProp(
                      t,
                      e.r,
                      0,
                      degToRads,
                      this
                    )),
                    (this.or = PropertyFactory.getProp(t, e.or, 0, 0, this)),
                    (this.os = PropertyFactory.getProp(t, e.os, 0, 0.01, this)),
                    (this.localShapeCollection =
                      shapeCollectionPool.newShapeCollection()),
                    this.localShapeCollection.addShape(this.v),
                    (this.paths = this.localShapeCollection),
                    this.dynamicProperties.length
                      ? (this.k = !0)
                      : ((this.k = !1), this.convertToPath());
                }
                return (
                  (t.prototype = {
                    reset: i,
                    getValue: function () {
                      this.elem.globalData.frameId !== this.frameId &&
                        ((this.frameId = this.elem.globalData.frameId),
                        this.iterateDynamicProperties(),
                        this._mdf && this.convertToPath());
                    },
                    convertStarToPath: function () {
                      var t,
                        e,
                        r,
                        i,
                        s = 2 * Math.floor(this.pt.v),
                        a = (2 * Math.PI) / s,
                        n = !0,
                        o = this.or.v,
                        h = this.ir.v,
                        l = this.os.v,
                        p = this.is.v,
                        c = (2 * Math.PI * o) / (2 * s),
                        f = (2 * Math.PI * h) / (2 * s),
                        d = -Math.PI / 2;
                      d += this.r.v;
                      var m = 3 === this.data.d ? -1 : 1;
                      for (this.v._length = 0, t = 0; t < s; t += 1) {
                        (r = n ? l : p), (i = n ? c : f);
                        var u = (e = n ? o : h) * Math.cos(d),
                          y = e * Math.sin(d),
                          g =
                            0 === u && 0 === y
                              ? 0
                              : y / Math.sqrt(u * u + y * y),
                          v =
                            0 === u && 0 === y
                              ? 0
                              : -u / Math.sqrt(u * u + y * y);
                        (u += +this.p.v[0]),
                          (y += +this.p.v[1]),
                          this.v.setTripleAt(
                            u,
                            y,
                            u - g * i * r * m,
                            y - v * i * r * m,
                            u + g * i * r * m,
                            y + v * i * r * m,
                            t,
                            !0
                          ),
                          (n = !n),
                          (d += a * m);
                      }
                    },
                    convertPolygonToPath: function () {
                      var t,
                        e = Math.floor(this.pt.v),
                        r = (2 * Math.PI) / e,
                        i = this.or.v,
                        s = this.os.v,
                        a = (2 * Math.PI * i) / (4 * e),
                        n = 0.5 * -Math.PI,
                        o = 3 === this.data.d ? -1 : 1;
                      for (
                        n += this.r.v, this.v._length = 0, t = 0;
                        t < e;
                        t += 1
                      ) {
                        var h = i * Math.cos(n),
                          l = i * Math.sin(n),
                          p =
                            0 === h && 0 === l
                              ? 0
                              : l / Math.sqrt(h * h + l * l),
                          c =
                            0 === h && 0 === l
                              ? 0
                              : -h / Math.sqrt(h * h + l * l);
                        (h += +this.p.v[0]),
                          (l += +this.p.v[1]),
                          this.v.setTripleAt(
                            h,
                            l,
                            h - p * a * s * o,
                            l - c * a * s * o,
                            h + p * a * s * o,
                            l + c * a * s * o,
                            t,
                            !0
                          ),
                          (n += r * o);
                      }
                      (this.paths.length = 0), (this.paths[0] = this.v);
                    },
                  }),
                  extendPrototype([DynamicPropertyContainer], t),
                  t
                );
              })(),
              c = (function () {
                function t(t, e) {
                  (this.v = shapePool.newElement()),
                    (this.v.c = !0),
                    (this.localShapeCollection =
                      shapeCollectionPool.newShapeCollection()),
                    this.localShapeCollection.addShape(this.v),
                    (this.paths = this.localShapeCollection),
                    (this.elem = t),
                    (this.comp = t.comp),
                    (this.frameId = -1),
                    (this.d = e.d),
                    this.initDynamicPropertyContainer(t),
                    (this.p = PropertyFactory.getProp(t, e.p, 1, 0, this)),
                    (this.s = PropertyFactory.getProp(t, e.s, 1, 0, this)),
                    (this.r = PropertyFactory.getProp(t, e.r, 0, 0, this)),
                    this.dynamicProperties.length
                      ? (this.k = !0)
                      : ((this.k = !1), this.convertRectToPath());
                }
                return (
                  (t.prototype = {
                    convertRectToPath: function () {
                      var t = this.p.v[0],
                        e = this.p.v[1],
                        r = this.s.v[0] / 2,
                        i = this.s.v[1] / 2,
                        s = bmMin(r, i, this.r.v),
                        a = s * (1 - roundCorner);
                      (this.v._length = 0),
                        2 === this.d || 1 === this.d
                          ? (this.v.setTripleAt(
                              t + r,
                              e - i + s,
                              t + r,
                              e - i + s,
                              t + r,
                              e - i + a,
                              0,
                              !0
                            ),
                            this.v.setTripleAt(
                              t + r,
                              e + i - s,
                              t + r,
                              e + i - a,
                              t + r,
                              e + i - s,
                              1,
                              !0
                            ),
                            0 !== s
                              ? (this.v.setTripleAt(
                                  t + r - s,
                                  e + i,
                                  t + r - s,
                                  e + i,
                                  t + r - a,
                                  e + i,
                                  2,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r + s,
                                  e + i,
                                  t - r + a,
                                  e + i,
                                  t - r + s,
                                  e + i,
                                  3,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e + i - s,
                                  t - r,
                                  e + i - s,
                                  t - r,
                                  e + i - a,
                                  4,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e - i + s,
                                  t - r,
                                  e - i + a,
                                  t - r,
                                  e - i + s,
                                  5,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r + s,
                                  e - i,
                                  t - r + s,
                                  e - i,
                                  t - r + a,
                                  e - i,
                                  6,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t + r - s,
                                  e - i,
                                  t + r - a,
                                  e - i,
                                  t + r - s,
                                  e - i,
                                  7,
                                  !0
                                ))
                              : (this.v.setTripleAt(
                                  t - r,
                                  e + i,
                                  t - r + a,
                                  e + i,
                                  t - r,
                                  e + i,
                                  2
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e - i,
                                  t - r,
                                  e - i + a,
                                  t - r,
                                  e - i,
                                  3
                                )))
                          : (this.v.setTripleAt(
                              t + r,
                              e - i + s,
                              t + r,
                              e - i + a,
                              t + r,
                              e - i + s,
                              0,
                              !0
                            ),
                            0 !== s
                              ? (this.v.setTripleAt(
                                  t + r - s,
                                  e - i,
                                  t + r - s,
                                  e - i,
                                  t + r - a,
                                  e - i,
                                  1,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r + s,
                                  e - i,
                                  t - r + a,
                                  e - i,
                                  t - r + s,
                                  e - i,
                                  2,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e - i + s,
                                  t - r,
                                  e - i + s,
                                  t - r,
                                  e - i + a,
                                  3,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e + i - s,
                                  t - r,
                                  e + i - a,
                                  t - r,
                                  e + i - s,
                                  4,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r + s,
                                  e + i,
                                  t - r + s,
                                  e + i,
                                  t - r + a,
                                  e + i,
                                  5,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t + r - s,
                                  e + i,
                                  t + r - a,
                                  e + i,
                                  t + r - s,
                                  e + i,
                                  6,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t + r,
                                  e + i - s,
                                  t + r,
                                  e + i - s,
                                  t + r,
                                  e + i - a,
                                  7,
                                  !0
                                ))
                              : (this.v.setTripleAt(
                                  t - r,
                                  e - i,
                                  t - r + a,
                                  e - i,
                                  t - r,
                                  e - i,
                                  1,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e + i,
                                  t - r,
                                  e + i - a,
                                  t - r,
                                  e + i,
                                  2,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t + r,
                                  e + i,
                                  t + r - a,
                                  e + i,
                                  t + r,
                                  e + i,
                                  3,
                                  !0
                                )));
                    },
                    getValue: function () {
                      this.elem.globalData.frameId !== this.frameId &&
                        ((this.frameId = this.elem.globalData.frameId),
                        this.iterateDynamicProperties(),
                        this._mdf && this.convertRectToPath());
                    },
                    reset: i,
                  }),
                  extendPrototype([DynamicPropertyContainer], t),
                  t
                );
              })(),
              f = {
                getShapeProp: function (t, e, r) {
                  var i;
                  return (
                    3 === r || 4 === r
                      ? (i = (3 === r ? e.pt : e.ks).k.length
                          ? new h(t, e, r)
                          : new n(t, e, r))
                      : 5 === r
                      ? (i = new c(t, e))
                      : 6 === r
                      ? (i = new l(t, e))
                      : 7 === r && (i = new p(t, e)),
                    i.k && t.addDynamicProperty(i),
                    i
                  );
                },
                getConstructorFunction: function () {
                  return n;
                },
                getKeyframedConstructorFunction: function () {
                  return h;
                },
              };
            return f;
          })(),
          Matrix = (function () {
            var t = Math.cos,
              e = Math.sin,
              r = Math.tan,
              i = Math.round;
            function s() {
              return (
                (this.props[0] = 1),
                (this.props[1] = 0),
                (this.props[2] = 0),
                (this.props[3] = 0),
                (this.props[4] = 0),
                (this.props[5] = 1),
                (this.props[6] = 0),
                (this.props[7] = 0),
                (this.props[8] = 0),
                (this.props[9] = 0),
                (this.props[10] = 1),
                (this.props[11] = 0),
                (this.props[12] = 0),
                (this.props[13] = 0),
                (this.props[14] = 0),
                (this.props[15] = 1),
                this
              );
            }
            function a(r) {
              if (0 === r) return this;
              var i = t(r),
                s = e(r);
              return this._t(i, -s, 0, 0, s, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            }
            function n(r) {
              if (0 === r) return this;
              var i = t(r),
                s = e(r);
              return this._t(1, 0, 0, 0, 0, i, -s, 0, 0, s, i, 0, 0, 0, 0, 1);
            }
            function o(r) {
              if (0 === r) return this;
              var i = t(r),
                s = e(r);
              return this._t(i, 0, s, 0, 0, 1, 0, 0, -s, 0, i, 0, 0, 0, 0, 1);
            }
            function h(r) {
              if (0 === r) return this;
              var i = t(r),
                s = e(r);
              return this._t(i, -s, 0, 0, s, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            }
            function l(t, e) {
              return this._t(1, e, t, 1, 0, 0);
            }
            function p(t, e) {
              return this.shear(r(t), r(e));
            }
            function c(i, s) {
              var a = t(s),
                n = e(s);
              return this._t(a, n, 0, 0, -n, a, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                ._t(1, 0, 0, 0, r(i), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                ._t(a, -n, 0, 0, n, a, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            }
            function f(t, e, r) {
              return (
                r || 0 === r || (r = 1),
                1 === t && 1 === e && 1 === r
                  ? this
                  : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, r, 0, 0, 0, 0, 1)
              );
            }
            function d(t, e, r, i, s, a, n, o, h, l, p, c, f, d, m, u) {
              return (
                (this.props[0] = t),
                (this.props[1] = e),
                (this.props[2] = r),
                (this.props[3] = i),
                (this.props[4] = s),
                (this.props[5] = a),
                (this.props[6] = n),
                (this.props[7] = o),
                (this.props[8] = h),
                (this.props[9] = l),
                (this.props[10] = p),
                (this.props[11] = c),
                (this.props[12] = f),
                (this.props[13] = d),
                (this.props[14] = m),
                (this.props[15] = u),
                this
              );
            }
            function m(t, e, r) {
              return (
                (r = r || 0),
                0 !== t || 0 !== e || 0 !== r
                  ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, r, 1)
                  : this
              );
            }
            function u(t, e, r, i, s, a, n, o, h, l, p, c, f, d, m, u) {
              var y = this.props;
              if (
                1 === t &&
                0 === e &&
                0 === r &&
                0 === i &&
                0 === s &&
                1 === a &&
                0 === n &&
                0 === o &&
                0 === h &&
                0 === l &&
                1 === p &&
                0 === c
              )
                return (
                  (y[12] = y[12] * t + y[15] * f),
                  (y[13] = y[13] * a + y[15] * d),
                  (y[14] = y[14] * p + y[15] * m),
                  (y[15] *= u),
                  (this._identityCalculated = !1),
                  this
                );
              var g = y[0],
                v = y[1],
                b = y[2],
                _ = y[3],
                P = y[4],
                E = y[5],
                S = y[6],
                x = y[7],
                A = y[8],
                w = y[9],
                C = y[10],
                k = y[11],
                T = y[12],
                D = y[13],
                M = y[14],
                F = y[15];
              return (
                (y[0] = g * t + v * s + b * h + _ * f),
                (y[1] = g * e + v * a + b * l + _ * d),
                (y[2] = g * r + v * n + b * p + _ * m),
                (y[3] = g * i + v * o + b * c + _ * u),
                (y[4] = P * t + E * s + S * h + x * f),
                (y[5] = P * e + E * a + S * l + x * d),
                (y[6] = P * r + E * n + S * p + x * m),
                (y[7] = P * i + E * o + S * c + x * u),
                (y[8] = A * t + w * s + C * h + k * f),
                (y[9] = A * e + w * a + C * l + k * d),
                (y[10] = A * r + w * n + C * p + k * m),
                (y[11] = A * i + w * o + C * c + k * u),
                (y[12] = T * t + D * s + M * h + F * f),
                (y[13] = T * e + D * a + M * l + F * d),
                (y[14] = T * r + D * n + M * p + F * m),
                (y[15] = T * i + D * o + M * c + F * u),
                (this._identityCalculated = !1),
                this
              );
            }
            function y() {
              return (
                this._identityCalculated ||
                  ((this._identity = !(
                    1 !== this.props[0] ||
                    0 !== this.props[1] ||
                    0 !== this.props[2] ||
                    0 !== this.props[3] ||
                    0 !== this.props[4] ||
                    1 !== this.props[5] ||
                    0 !== this.props[6] ||
                    0 !== this.props[7] ||
                    0 !== this.props[8] ||
                    0 !== this.props[9] ||
                    1 !== this.props[10] ||
                    0 !== this.props[11] ||
                    0 !== this.props[12] ||
                    0 !== this.props[13] ||
                    0 !== this.props[14] ||
                    1 !== this.props[15]
                  )),
                  (this._identityCalculated = !0)),
                this._identity
              );
            }
            function g(t) {
              for (var e = 0; e < 16; ) {
                if (t.props[e] !== this.props[e]) return !1;
                e += 1;
              }
              return !0;
            }
            function v(t) {
              var e;
              for (e = 0; e < 16; e += 1) t.props[e] = this.props[e];
              return t;
            }
            function b(t) {
              var e;
              for (e = 0; e < 16; e += 1) this.props[e] = t[e];
            }
            function _(t, e, r) {
              return {
                x:
                  t * this.props[0] +
                  e * this.props[4] +
                  r * this.props[8] +
                  this.props[12],
                y:
                  t * this.props[1] +
                  e * this.props[5] +
                  r * this.props[9] +
                  this.props[13],
                z:
                  t * this.props[2] +
                  e * this.props[6] +
                  r * this.props[10] +
                  this.props[14],
              };
            }
            function P(t, e, r) {
              return (
                t * this.props[0] +
                e * this.props[4] +
                r * this.props[8] +
                this.props[12]
              );
            }
            function E(t, e, r) {
              return (
                t * this.props[1] +
                e * this.props[5] +
                r * this.props[9] +
                this.props[13]
              );
            }
            function S(t, e, r) {
              return (
                t * this.props[2] +
                e * this.props[6] +
                r * this.props[10] +
                this.props[14]
              );
            }
            function x() {
              var t =
                  this.props[0] * this.props[5] - this.props[1] * this.props[4],
                e = this.props[5] / t,
                r = -this.props[1] / t,
                i = -this.props[4] / t,
                s = this.props[0] / t,
                a =
                  (this.props[4] * this.props[13] -
                    this.props[5] * this.props[12]) /
                  t,
                n =
                  -(
                    this.props[0] * this.props[13] -
                    this.props[1] * this.props[12]
                  ) / t,
                o = new Matrix();
              return (
                (o.props[0] = e),
                (o.props[1] = r),
                (o.props[4] = i),
                (o.props[5] = s),
                (o.props[12] = a),
                (o.props[13] = n),
                o
              );
            }
            function A(t) {
              return this.getInverseMatrix().applyToPointArray(
                t[0],
                t[1],
                t[2] || 0
              );
            }
            function w(t) {
              var e,
                r = t.length,
                i = [];
              for (e = 0; e < r; e += 1) i[e] = A(t[e]);
              return i;
            }
            function C(t, e, r) {
              var i = createTypedArray('float32', 6);
              if (this.isIdentity())
                (i[0] = t[0]),
                  (i[1] = t[1]),
                  (i[2] = e[0]),
                  (i[3] = e[1]),
                  (i[4] = r[0]),
                  (i[5] = r[1]);
              else {
                var s = this.props[0],
                  a = this.props[1],
                  n = this.props[4],
                  o = this.props[5],
                  h = this.props[12],
                  l = this.props[13];
                (i[0] = t[0] * s + t[1] * n + h),
                  (i[1] = t[0] * a + t[1] * o + l),
                  (i[2] = e[0] * s + e[1] * n + h),
                  (i[3] = e[0] * a + e[1] * o + l),
                  (i[4] = r[0] * s + r[1] * n + h),
                  (i[5] = r[0] * a + r[1] * o + l);
              }
              return i;
            }
            function k(t, e, r) {
              return this.isIdentity()
                ? [t, e, r]
                : [
                    t * this.props[0] +
                      e * this.props[4] +
                      r * this.props[8] +
                      this.props[12],
                    t * this.props[1] +
                      e * this.props[5] +
                      r * this.props[9] +
                      this.props[13],
                    t * this.props[2] +
                      e * this.props[6] +
                      r * this.props[10] +
                      this.props[14],
                  ];
            }
            function T(t, e) {
              if (this.isIdentity()) return t + ',' + e;
              var r = this.props;
              return (
                Math.round(100 * (t * r[0] + e * r[4] + r[12])) / 100 +
                ',' +
                Math.round(100 * (t * r[1] + e * r[5] + r[13])) / 100
              );
            }
            function D() {
              for (var t = 0, e = this.props, r = 'matrix3d('; t < 16; )
                (r += i(1e4 * e[t]) / 1e4),
                  (r += 15 === t ? ')' : ','),
                  (t += 1);
              return r;
            }
            function M(t) {
              return (t < 1e-6 && t > 0) || (t > -1e-6 && t < 0)
                ? i(1e4 * t) / 1e4
                : t;
            }
            function F() {
              var t = this.props;
              return (
                'matrix(' +
                M(t[0]) +
                ',' +
                M(t[1]) +
                ',' +
                M(t[4]) +
                ',' +
                M(t[5]) +
                ',' +
                M(t[12]) +
                ',' +
                M(t[13]) +
                ')'
              );
            }
            return function () {
              (this.reset = s),
                (this.rotate = a),
                (this.rotateX = n),
                (this.rotateY = o),
                (this.rotateZ = h),
                (this.skew = p),
                (this.skewFromAxis = c),
                (this.shear = l),
                (this.scale = f),
                (this.setTransform = d),
                (this.translate = m),
                (this.transform = u),
                (this.applyToPoint = _),
                (this.applyToX = P),
                (this.applyToY = E),
                (this.applyToZ = S),
                (this.applyToPointArray = k),
                (this.applyToTriplePoints = C),
                (this.applyToPointStringified = T),
                (this.toCSS = D),
                (this.to2dCSS = F),
                (this.clone = v),
                (this.cloneFromProps = b),
                (this.equals = g),
                (this.inversePoints = w),
                (this.inversePoint = A),
                (this.getInverseMatrix = x),
                (this._t = this.transform),
                (this.isIdentity = y),
                (this._identity = !0),
                (this._identityCalculated = !1),
                (this.props = createTypedArray('float32', 16)),
                this.reset();
            };
          })();
        function _typeof$3(t) {
          return (
            (_typeof$3 =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      'function' == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
                  }),
            _typeof$3(t)
          );
        }
        var lottie = {},
          standalone = '__[STANDALONE]__',
          animationData = '__[ANIMATIONDATA]__',
          renderer = '';
        function setLocation(t) {
          setLocationHref(t);
        }
        function searchAnimations() {
          !0 === standalone
            ? animationManager.searchAnimations(
                animationData,
                standalone,
                renderer
              )
            : animationManager.searchAnimations();
        }
        function setSubframeRendering(t) {
          setSubframeEnabled(t);
        }
        function setPrefix(t) {
          setIdPrefix(t);
        }
        function loadAnimation(t) {
          return (
            !0 === standalone && (t.animationData = JSON.parse(animationData)),
            animationManager.loadAnimation(t)
          );
        }
        function setQuality(t) {
          if ('string' == typeof t)
            switch (t) {
              case 'high':
                setDefaultCurveSegments(200);
                break;
              default:
              case 'medium':
                setDefaultCurveSegments(50);
                break;
              case 'low':
                setDefaultCurveSegments(10);
            }
          else !isNaN(t) && t > 1 && setDefaultCurveSegments(t);
          getDefaultCurveSegments() >= 50 ? roundValues(!1) : roundValues(!0);
        }
        function inBrowser() {
          return 'undefined' != typeof navigator;
        }
        function installPlugin(t, e) {
          'expressions' === t && setExpressionsPlugin(e);
        }
        function getFactory(t) {
          switch (t) {
            case 'propertyFactory':
              return PropertyFactory;
            case 'shapePropertyFactory':
              return ShapePropertyFactory;
            case 'matrix':
              return Matrix;
            default:
              return null;
          }
        }
        function checkReady() {
          'complete' === document.readyState &&
            (clearInterval(readyStateCheckInterval), searchAnimations());
        }
        function getQueryVariable(t) {
          for (var e = queryString.split('&'), r = 0; r < e.length; r += 1) {
            var i = e[r].split('=');
            if (decodeURIComponent(i[0]) == t) return decodeURIComponent(i[1]);
          }
          return null;
        }
        (lottie.play = animationManager.play),
          (lottie.pause = animationManager.pause),
          (lottie.setLocationHref = setLocation),
          (lottie.togglePause = animationManager.togglePause),
          (lottie.setSpeed = animationManager.setSpeed),
          (lottie.setDirection = animationManager.setDirection),
          (lottie.stop = animationManager.stop),
          (lottie.searchAnimations = searchAnimations),
          (lottie.registerAnimation = animationManager.registerAnimation),
          (lottie.loadAnimation = loadAnimation),
          (lottie.setSubframeRendering = setSubframeRendering),
          (lottie.resize = animationManager.resize),
          (lottie.goToAndStop = animationManager.goToAndStop),
          (lottie.destroy = animationManager.destroy),
          (lottie.setQuality = setQuality),
          (lottie.inBrowser = inBrowser),
          (lottie.installPlugin = installPlugin),
          (lottie.freeze = animationManager.freeze),
          (lottie.unfreeze = animationManager.unfreeze),
          (lottie.setVolume = animationManager.setVolume),
          (lottie.mute = animationManager.mute),
          (lottie.unmute = animationManager.unmute),
          (lottie.getRegisteredAnimations =
            animationManager.getRegisteredAnimations),
          (lottie.useWebWorker = setWebWorker),
          (lottie.setIDPrefix = setPrefix),
          (lottie.__getFactory = getFactory),
          (lottie.version = '5.9.6');
        var queryString = '';
        if (standalone) {
          var scripts = document.getElementsByTagName('script'),
            index = scripts.length - 1,
            myScript = scripts[index] || { src: '' };
          (queryString = myScript.src
            ? myScript.src.replace(/^[^\?]+\??/, '')
            : ''),
            (renderer = getQueryVariable('renderer'));
        }
        var readyStateCheckInterval = setInterval(checkReady, 100);
        try {
          'object' !== _typeof$3(exports) && (window.bodymovin = lottie);
        } catch (t) {}
        var ShapeModifiers = (function () {
          var t = {},
            e = {};
          return (
            (t.registerModifier = function (t, r) {
              e[t] || (e[t] = r);
            }),
            (t.getModifier = function (t, r, i) {
              return new e[t](r, i);
            }),
            t
          );
        })();
        function ShapeModifier() {}
        function TrimModifier() {}
        function PuckerAndBloatModifier() {}
        (ShapeModifier.prototype.initModifierProperties = function () {}),
          (ShapeModifier.prototype.addShapeToModifier = function () {}),
          (ShapeModifier.prototype.addShape = function (t) {
            if (!this.closed) {
              t.sh.container.addDynamicProperty(t.sh);
              var e = {
                shape: t.sh,
                data: t,
                localShapeCollection: shapeCollectionPool.newShapeCollection(),
              };
              this.shapes.push(e),
                this.addShapeToModifier(e),
                this._isAnimated && t.setAsAnimated();
            }
          }),
          (ShapeModifier.prototype.init = function (t, e) {
            (this.shapes = []),
              (this.elem = t),
              this.initDynamicPropertyContainer(t),
              this.initModifierProperties(t, e),
              (this.frameId = initialDefaultFrame),
              (this.closed = !1),
              (this.k = !1),
              this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0);
          }),
          (ShapeModifier.prototype.processKeys = function () {
            this.elem.globalData.frameId !== this.frameId &&
              ((this.frameId = this.elem.globalData.frameId),
              this.iterateDynamicProperties());
          }),
          extendPrototype([DynamicPropertyContainer], ShapeModifier),
          extendPrototype([ShapeModifier], TrimModifier),
          (TrimModifier.prototype.initModifierProperties = function (t, e) {
            (this.s = PropertyFactory.getProp(t, e.s, 0, 0.01, this)),
              (this.e = PropertyFactory.getProp(t, e.e, 0, 0.01, this)),
              (this.o = PropertyFactory.getProp(t, e.o, 0, 0, this)),
              (this.sValue = 0),
              (this.eValue = 0),
              (this.getValue = this.processKeys),
              (this.m = e.m),
              (this._isAnimated =
                !!this.s.effectsSequence.length ||
                !!this.e.effectsSequence.length ||
                !!this.o.effectsSequence.length);
          }),
          (TrimModifier.prototype.addShapeToModifier = function (t) {
            t.pathsData = [];
          }),
          (TrimModifier.prototype.calculateShapeEdges = function (
            t,
            e,
            r,
            i,
            s
          ) {
            var a = [];
            e <= 1
              ? a.push({ s: t, e: e })
              : t >= 1
              ? a.push({ s: t - 1, e: e - 1 })
              : (a.push({ s: t, e: 1 }), a.push({ s: 0, e: e - 1 }));
            var n,
              o,
              h = [],
              l = a.length;
            for (n = 0; n < l; n += 1) {
              var p, c;
              (o = a[n]).e * s < i ||
                o.s * s > i + r ||
                ((p = o.s * s <= i ? 0 : (o.s * s - i) / r),
                (c = o.e * s >= i + r ? 1 : (o.e * s - i) / r),
                h.push([p, c]));
            }
            return h.length || h.push([0, 0]), h;
          }),
          (TrimModifier.prototype.releasePathsData = function (t) {
            var e,
              r = t.length;
            for (e = 0; e < r; e += 1) segmentsLengthPool.release(t[e]);
            return (t.length = 0), t;
          }),
          (TrimModifier.prototype.processShapes = function (t) {
            var e, r, i, s;
            if (this._mdf || t) {
              var a = (this.o.v % 360) / 360;
              if (
                (a < 0 && (a += 1),
                (e =
                  this.s.v > 1 ? 1 + a : this.s.v < 0 ? 0 + a : this.s.v + a) >
                  (r =
                    this.e.v > 1 ? 1 + a : this.e.v < 0 ? 0 + a : this.e.v + a))
              ) {
                var n = e;
                (e = r), (r = n);
              }
              (e = 1e-4 * Math.round(1e4 * e)),
                (r = 1e-4 * Math.round(1e4 * r)),
                (this.sValue = e),
                (this.eValue = r);
            } else (e = this.sValue), (r = this.eValue);
            var o,
              h,
              l,
              p,
              c,
              f = this.shapes.length,
              d = 0;
            if (r === e)
              for (s = 0; s < f; s += 1)
                this.shapes[s].localShapeCollection.releaseShapes(),
                  (this.shapes[s].shape._mdf = !0),
                  (this.shapes[s].shape.paths =
                    this.shapes[s].localShapeCollection),
                  this._mdf && (this.shapes[s].pathsData.length = 0);
            else if ((1 === r && 0 === e) || (0 === r && 1 === e)) {
              if (this._mdf)
                for (s = 0; s < f; s += 1)
                  (this.shapes[s].pathsData.length = 0),
                    (this.shapes[s].shape._mdf = !0);
            } else {
              var m,
                u,
                y = [];
              for (s = 0; s < f; s += 1)
                if (
                  (m = this.shapes[s]).shape._mdf ||
                  this._mdf ||
                  t ||
                  2 === this.m
                ) {
                  if (
                    ((h = (i = m.shape.paths)._length),
                    (c = 0),
                    !m.shape._mdf && m.pathsData.length)
                  )
                    c = m.totalShapeLength;
                  else {
                    for (
                      l = this.releasePathsData(m.pathsData), o = 0;
                      o < h;
                      o += 1
                    )
                      (p = bez.getSegmentsLength(i.shapes[o])),
                        l.push(p),
                        (c += p.totalLength);
                    (m.totalShapeLength = c), (m.pathsData = l);
                  }
                  (d += c), (m.shape._mdf = !0);
                } else m.shape.paths = m.localShapeCollection;
              var g,
                v = e,
                b = r,
                _ = 0;
              for (s = f - 1; s >= 0; s -= 1)
                if ((m = this.shapes[s]).shape._mdf) {
                  for (
                    (u = m.localShapeCollection).releaseShapes(),
                      2 === this.m && f > 1
                        ? ((g = this.calculateShapeEdges(
                            e,
                            r,
                            m.totalShapeLength,
                            _,
                            d
                          )),
                          (_ += m.totalShapeLength))
                        : (g = [[v, b]]),
                      h = g.length,
                      o = 0;
                    o < h;
                    o += 1
                  ) {
                    (v = g[o][0]),
                      (b = g[o][1]),
                      (y.length = 0),
                      b <= 1
                        ? y.push({
                            s: m.totalShapeLength * v,
                            e: m.totalShapeLength * b,
                          })
                        : v >= 1
                        ? y.push({
                            s: m.totalShapeLength * (v - 1),
                            e: m.totalShapeLength * (b - 1),
                          })
                        : (y.push({
                            s: m.totalShapeLength * v,
                            e: m.totalShapeLength,
                          }),
                          y.push({ s: 0, e: m.totalShapeLength * (b - 1) }));
                    var P = this.addShapes(m, y[0]);
                    if (y[0].s !== y[0].e) {
                      if (y.length > 1)
                        if (m.shape.paths.shapes[m.shape.paths._length - 1].c) {
                          var E = P.pop();
                          this.addPaths(P, u), (P = this.addShapes(m, y[1], E));
                        } else
                          this.addPaths(P, u), (P = this.addShapes(m, y[1]));
                      this.addPaths(P, u);
                    }
                  }
                  m.shape.paths = u;
                }
            }
          }),
          (TrimModifier.prototype.addPaths = function (t, e) {
            var r,
              i = t.length;
            for (r = 0; r < i; r += 1) e.addShape(t[r]);
          }),
          (TrimModifier.prototype.addSegment = function (t, e, r, i, s, a, n) {
            s.setXYAt(e[0], e[1], 'o', a),
              s.setXYAt(r[0], r[1], 'i', a + 1),
              n && s.setXYAt(t[0], t[1], 'v', a),
              s.setXYAt(i[0], i[1], 'v', a + 1);
          }),
          (TrimModifier.prototype.addSegmentFromArray = function (t, e, r, i) {
            e.setXYAt(t[1], t[5], 'o', r),
              e.setXYAt(t[2], t[6], 'i', r + 1),
              i && e.setXYAt(t[0], t[4], 'v', r),
              e.setXYAt(t[3], t[7], 'v', r + 1);
          }),
          (TrimModifier.prototype.addShapes = function (t, e, r) {
            var i,
              s,
              a,
              n,
              o,
              h,
              l,
              p,
              c = t.pathsData,
              f = t.shape.paths.shapes,
              d = t.shape.paths._length,
              m = 0,
              u = [],
              y = !0;
            for (
              r
                ? ((o = r._length), (p = r._length))
                : ((r = shapePool.newElement()), (o = 0), (p = 0)),
                u.push(r),
                i = 0;
              i < d;
              i += 1
            ) {
              for (
                h = c[i].lengths,
                  r.c = f[i].c,
                  a = f[i].c ? h.length : h.length + 1,
                  s = 1;
                s < a;
                s += 1
              )
                if (m + (n = h[s - 1]).addedLength < e.s)
                  (m += n.addedLength), (r.c = !1);
                else {
                  if (m > e.e) {
                    r.c = !1;
                    break;
                  }
                  e.s <= m && e.e >= m + n.addedLength
                    ? (this.addSegment(
                        f[i].v[s - 1],
                        f[i].o[s - 1],
                        f[i].i[s],
                        f[i].v[s],
                        r,
                        o,
                        y
                      ),
                      (y = !1))
                    : ((l = bez.getNewSegment(
                        f[i].v[s - 1],
                        f[i].v[s],
                        f[i].o[s - 1],
                        f[i].i[s],
                        (e.s - m) / n.addedLength,
                        (e.e - m) / n.addedLength,
                        h[s - 1]
                      )),
                      this.addSegmentFromArray(l, r, o, y),
                      (y = !1),
                      (r.c = !1)),
                    (m += n.addedLength),
                    (o += 1);
                }
              if (f[i].c && h.length) {
                if (((n = h[s - 1]), m <= e.e)) {
                  var g = h[s - 1].addedLength;
                  e.s <= m && e.e >= m + g
                    ? (this.addSegment(
                        f[i].v[s - 1],
                        f[i].o[s - 1],
                        f[i].i[0],
                        f[i].v[0],
                        r,
                        o,
                        y
                      ),
                      (y = !1))
                    : ((l = bez.getNewSegment(
                        f[i].v[s - 1],
                        f[i].v[0],
                        f[i].o[s - 1],
                        f[i].i[0],
                        (e.s - m) / g,
                        (e.e - m) / g,
                        h[s - 1]
                      )),
                      this.addSegmentFromArray(l, r, o, y),
                      (y = !1),
                      (r.c = !1));
                } else r.c = !1;
                (m += n.addedLength), (o += 1);
              }
              if (
                (r._length &&
                  (r.setXYAt(r.v[p][0], r.v[p][1], 'i', p),
                  r.setXYAt(
                    r.v[r._length - 1][0],
                    r.v[r._length - 1][1],
                    'o',
                    r._length - 1
                  )),
                m > e.e)
              )
                break;
              i < d - 1 &&
                ((r = shapePool.newElement()), (y = !0), u.push(r), (o = 0));
            }
            return u;
          }),
          extendPrototype([ShapeModifier], PuckerAndBloatModifier),
          (PuckerAndBloatModifier.prototype.initModifierProperties = function (
            t,
            e
          ) {
            (this.getValue = this.processKeys),
              (this.amount = PropertyFactory.getProp(t, e.a, 0, null, this)),
              (this._isAnimated = !!this.amount.effectsSequence.length);
          }),
          (PuckerAndBloatModifier.prototype.processPath = function (t, e) {
            var r = e / 100,
              i = [0, 0],
              s = t._length,
              a = 0;
            for (a = 0; a < s; a += 1) (i[0] += t.v[a][0]), (i[1] += t.v[a][1]);
            (i[0] /= s), (i[1] /= s);
            var n,
              o,
              h,
              l,
              p,
              c,
              f = shapePool.newElement();
            for (f.c = t.c, a = 0; a < s; a += 1)
              (n = t.v[a][0] + (i[0] - t.v[a][0]) * r),
                (o = t.v[a][1] + (i[1] - t.v[a][1]) * r),
                (h = t.o[a][0] + (i[0] - t.o[a][0]) * -r),
                (l = t.o[a][1] + (i[1] - t.o[a][1]) * -r),
                (p = t.i[a][0] + (i[0] - t.i[a][0]) * -r),
                (c = t.i[a][1] + (i[1] - t.i[a][1]) * -r),
                f.setTripleAt(n, o, h, l, p, c, a);
            return f;
          }),
          (PuckerAndBloatModifier.prototype.processShapes = function (t) {
            var e,
              r,
              i,
              s,
              a,
              n,
              o = this.shapes.length,
              h = this.amount.v;
            if (0 !== h)
              for (r = 0; r < o; r += 1) {
                if (
                  ((n = (a = this.shapes[r]).localShapeCollection),
                  a.shape._mdf || this._mdf || t)
                )
                  for (
                    n.releaseShapes(),
                      a.shape._mdf = !0,
                      e = a.shape.paths.shapes,
                      s = a.shape.paths._length,
                      i = 0;
                    i < s;
                    i += 1
                  )
                    n.addShape(this.processPath(e[i], h));
                a.shape.paths = a.localShapeCollection;
              }
            this.dynamicProperties.length || (this._mdf = !1);
          });
        var TransformPropertyFactory = (function () {
          var t = [0, 0];
          function e(t, e, r) {
            if (
              ((this.elem = t),
              (this.frameId = -1),
              (this.propType = 'transform'),
              (this.data = e),
              (this.v = new Matrix()),
              (this.pre = new Matrix()),
              (this.appliedTransformations = 0),
              this.initDynamicPropertyContainer(r || t),
              e.p && e.p.s
                ? ((this.px = PropertyFactory.getProp(t, e.p.x, 0, 0, this)),
                  (this.py = PropertyFactory.getProp(t, e.p.y, 0, 0, this)),
                  e.p.z &&
                    (this.pz = PropertyFactory.getProp(t, e.p.z, 0, 0, this)))
                : (this.p = PropertyFactory.getProp(
                    t,
                    e.p || { k: [0, 0, 0] },
                    1,
                    0,
                    this
                  )),
              e.rx)
            ) {
              if (
                ((this.rx = PropertyFactory.getProp(
                  t,
                  e.rx,
                  0,
                  degToRads,
                  this
                )),
                (this.ry = PropertyFactory.getProp(
                  t,
                  e.ry,
                  0,
                  degToRads,
                  this
                )),
                (this.rz = PropertyFactory.getProp(
                  t,
                  e.rz,
                  0,
                  degToRads,
                  this
                )),
                e.or.k[0].ti)
              ) {
                var i,
                  s = e.or.k.length;
                for (i = 0; i < s; i += 1)
                  (e.or.k[i].to = null), (e.or.k[i].ti = null);
              }
              (this.or = PropertyFactory.getProp(t, e.or, 1, degToRads, this)),
                (this.or.sh = !0);
            } else
              this.r = PropertyFactory.getProp(
                t,
                e.r || { k: 0 },
                0,
                degToRads,
                this
              );
            e.sk &&
              ((this.sk = PropertyFactory.getProp(t, e.sk, 0, degToRads, this)),
              (this.sa = PropertyFactory.getProp(t, e.sa, 0, degToRads, this))),
              (this.a = PropertyFactory.getProp(
                t,
                e.a || { k: [0, 0, 0] },
                1,
                0,
                this
              )),
              (this.s = PropertyFactory.getProp(
                t,
                e.s || { k: [100, 100, 100] },
                1,
                0.01,
                this
              )),
              e.o
                ? (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, t))
                : (this.o = { _mdf: !1, v: 1 }),
              (this._isDirty = !0),
              this.dynamicProperties.length || this.getValue(!0);
          }
          return (
            (e.prototype = {
              applyToMatrix: function (t) {
                var e = this._mdf;
                this.iterateDynamicProperties(),
                  (this._mdf = this._mdf || e),
                  this.a &&
                    t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                  this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                  this.sk && t.skewFromAxis(-this.sk.v, this.sa.v),
                  this.r
                    ? t.rotate(-this.r.v)
                    : t
                        .rotateZ(-this.rz.v)
                        .rotateY(this.ry.v)
                        .rotateX(this.rx.v)
                        .rotateZ(-this.or.v[2])
                        .rotateY(this.or.v[1])
                        .rotateX(this.or.v[0]),
                  this.data.p.s
                    ? this.data.p.z
                      ? t.translate(this.px.v, this.py.v, -this.pz.v)
                      : t.translate(this.px.v, this.py.v, 0)
                    : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
              },
              getValue: function (e) {
                if (this.elem.globalData.frameId !== this.frameId) {
                  if (
                    (this._isDirty &&
                      (this.precalculateMatrix(), (this._isDirty = !1)),
                    this.iterateDynamicProperties(),
                    this._mdf || e)
                  ) {
                    var r;
                    if (
                      (this.v.cloneFromProps(this.pre.props),
                      this.appliedTransformations < 1 &&
                        this.v.translate(
                          -this.a.v[0],
                          -this.a.v[1],
                          this.a.v[2]
                        ),
                      this.appliedTransformations < 2 &&
                        this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                      this.sk &&
                        this.appliedTransformations < 3 &&
                        this.v.skewFromAxis(-this.sk.v, this.sa.v),
                      this.r && this.appliedTransformations < 4
                        ? this.v.rotate(-this.r.v)
                        : !this.r &&
                          this.appliedTransformations < 4 &&
                          this.v
                            .rotateZ(-this.rz.v)
                            .rotateY(this.ry.v)
                            .rotateX(this.rx.v)
                            .rotateZ(-this.or.v[2])
                            .rotateY(this.or.v[1])
                            .rotateX(this.or.v[0]),
                      this.autoOriented)
                    ) {
                      var i, s;
                      if (
                        ((r = this.elem.globalData.frameRate),
                        this.p && this.p.keyframes && this.p.getValueAtTime)
                      )
                        this.p._caching.lastFrame + this.p.offsetTime <=
                        this.p.keyframes[0].t
                          ? ((i = this.p.getValueAtTime(
                              (this.p.keyframes[0].t + 0.01) / r,
                              0
                            )),
                            (s = this.p.getValueAtTime(
                              this.p.keyframes[0].t / r,
                              0
                            )))
                          : this.p._caching.lastFrame + this.p.offsetTime >=
                            this.p.keyframes[this.p.keyframes.length - 1].t
                          ? ((i = this.p.getValueAtTime(
                              this.p.keyframes[this.p.keyframes.length - 1].t /
                                r,
                              0
                            )),
                            (s = this.p.getValueAtTime(
                              (this.p.keyframes[this.p.keyframes.length - 1].t -
                                0.05) /
                                r,
                              0
                            )))
                          : ((i = this.p.pv),
                            (s = this.p.getValueAtTime(
                              (this.p._caching.lastFrame +
                                this.p.offsetTime -
                                0.01) /
                                r,
                              this.p.offsetTime
                            )));
                      else if (
                        this.px &&
                        this.px.keyframes &&
                        this.py.keyframes &&
                        this.px.getValueAtTime &&
                        this.py.getValueAtTime
                      ) {
                        (i = []), (s = []);
                        var a = this.px,
                          n = this.py;
                        a._caching.lastFrame + a.offsetTime <= a.keyframes[0].t
                          ? ((i[0] = a.getValueAtTime(
                              (a.keyframes[0].t + 0.01) / r,
                              0
                            )),
                            (i[1] = n.getValueAtTime(
                              (n.keyframes[0].t + 0.01) / r,
                              0
                            )),
                            (s[0] = a.getValueAtTime(a.keyframes[0].t / r, 0)),
                            (s[1] = n.getValueAtTime(n.keyframes[0].t / r, 0)))
                          : a._caching.lastFrame + a.offsetTime >=
                            a.keyframes[a.keyframes.length - 1].t
                          ? ((i[0] = a.getValueAtTime(
                              a.keyframes[a.keyframes.length - 1].t / r,
                              0
                            )),
                            (i[1] = n.getValueAtTime(
                              n.keyframes[n.keyframes.length - 1].t / r,
                              0
                            )),
                            (s[0] = a.getValueAtTime(
                              (a.keyframes[a.keyframes.length - 1].t - 0.01) /
                                r,
                              0
                            )),
                            (s[1] = n.getValueAtTime(
                              (n.keyframes[n.keyframes.length - 1].t - 0.01) /
                                r,
                              0
                            )))
                          : ((i = [a.pv, n.pv]),
                            (s[0] = a.getValueAtTime(
                              (a._caching.lastFrame + a.offsetTime - 0.01) / r,
                              a.offsetTime
                            )),
                            (s[1] = n.getValueAtTime(
                              (n._caching.lastFrame + n.offsetTime - 0.01) / r,
                              n.offsetTime
                            )));
                      } else i = s = t;
                      this.v.rotate(-Math.atan2(i[1] - s[1], i[0] - s[0]));
                    }
                    this.data.p && this.data.p.s
                      ? this.data.p.z
                        ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                        : this.v.translate(this.px.v, this.py.v, 0)
                      : this.v.translate(
                          this.p.v[0],
                          this.p.v[1],
                          -this.p.v[2]
                        );
                  }
                  this.frameId = this.elem.globalData.frameId;
                }
              },
              precalculateMatrix: function () {
                if (
                  !this.a.k &&
                  (this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                  (this.appliedTransformations = 1),
                  !this.s.effectsSequence.length)
                ) {
                  if (
                    (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                    (this.appliedTransformations = 2),
                    this.sk)
                  ) {
                    if (
                      this.sk.effectsSequence.length ||
                      this.sa.effectsSequence.length
                    )
                      return;
                    this.pre.skewFromAxis(-this.sk.v, this.sa.v),
                      (this.appliedTransformations = 3);
                  }
                  this.r
                    ? this.r.effectsSequence.length ||
                      (this.pre.rotate(-this.r.v),
                      (this.appliedTransformations = 4))
                    : this.rz.effectsSequence.length ||
                      this.ry.effectsSequence.length ||
                      this.rx.effectsSequence.length ||
                      this.or.effectsSequence.length ||
                      (this.pre
                        .rotateZ(-this.rz.v)
                        .rotateY(this.ry.v)
                        .rotateX(this.rx.v)
                        .rotateZ(-this.or.v[2])
                        .rotateY(this.or.v[1])
                        .rotateX(this.or.v[0]),
                      (this.appliedTransformations = 4));
                }
              },
              autoOrient: function () {},
            }),
            extendPrototype([DynamicPropertyContainer], e),
            (e.prototype.addDynamicProperty = function (t) {
              this._addDynamicProperty(t),
                this.elem.addDynamicProperty(t),
                (this._isDirty = !0);
            }),
            (e.prototype._addDynamicProperty =
              DynamicPropertyContainer.prototype.addDynamicProperty),
            {
              getTransformProperty: function (t, r, i) {
                return new e(t, r, i);
              },
            }
          );
        })();
        function RepeaterModifier() {}
        function RoundCornersModifier() {}
        function getFontProperties(t) {
          for (
            var e = t.fStyle ? t.fStyle.split(' ') : [],
              r = 'normal',
              i = 'normal',
              s = e.length,
              a = 0;
            a < s;
            a += 1
          )
            switch (e[a].toLowerCase()) {
              case 'italic':
                i = 'italic';
                break;
              case 'bold':
                r = '700';
                break;
              case 'black':
                r = '900';
                break;
              case 'medium':
                r = '500';
                break;
              case 'regular':
              case 'normal':
                r = '400';
                break;
              case 'light':
              case 'thin':
                r = '200';
            }
          return { style: i, weight: t.fWeight || r };
        }
        extendPrototype([ShapeModifier], RepeaterModifier),
          (RepeaterModifier.prototype.initModifierProperties = function (t, e) {
            (this.getValue = this.processKeys),
              (this.c = PropertyFactory.getProp(t, e.c, 0, null, this)),
              (this.o = PropertyFactory.getProp(t, e.o, 0, null, this)),
              (this.tr = TransformPropertyFactory.getTransformProperty(
                t,
                e.tr,
                this
              )),
              (this.so = PropertyFactory.getProp(t, e.tr.so, 0, 0.01, this)),
              (this.eo = PropertyFactory.getProp(t, e.tr.eo, 0, 0.01, this)),
              (this.data = e),
              this.dynamicProperties.length || this.getValue(!0),
              (this._isAnimated = !!this.dynamicProperties.length),
              (this.pMatrix = new Matrix()),
              (this.rMatrix = new Matrix()),
              (this.sMatrix = new Matrix()),
              (this.tMatrix = new Matrix()),
              (this.matrix = new Matrix());
          }),
          (RepeaterModifier.prototype.applyTransforms = function (
            t,
            e,
            r,
            i,
            s,
            a
          ) {
            var n = a ? -1 : 1,
              o = i.s.v[0] + (1 - i.s.v[0]) * (1 - s),
              h = i.s.v[1] + (1 - i.s.v[1]) * (1 - s);
            t.translate(i.p.v[0] * n * s, i.p.v[1] * n * s, i.p.v[2]),
              e.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
              e.rotate(-i.r.v * n * s),
              e.translate(i.a.v[0], i.a.v[1], i.a.v[2]),
              r.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
              r.scale(a ? 1 / o : o, a ? 1 / h : h),
              r.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
          }),
          (RepeaterModifier.prototype.init = function (t, e, r, i) {
            for (
              this.elem = t,
                this.arr = e,
                this.pos = r,
                this.elemsData = i,
                this._currentCopies = 0,
                this._elements = [],
                this._groups = [],
                this.frameId = -1,
                this.initDynamicPropertyContainer(t),
                this.initModifierProperties(t, e[r]);
              r > 0;

            )
              (r -= 1), this._elements.unshift(e[r]);
            this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0);
          }),
          (RepeaterModifier.prototype.resetElements = function (t) {
            var e,
              r = t.length;
            for (e = 0; e < r; e += 1)
              (t[e]._processed = !1),
                'gr' === t[e].ty && this.resetElements(t[e].it);
          }),
          (RepeaterModifier.prototype.cloneElements = function (t) {
            var e = JSON.parse(JSON.stringify(t));
            return this.resetElements(e), e;
          }),
          (RepeaterModifier.prototype.changeGroupRender = function (t, e) {
            var r,
              i = t.length;
            for (r = 0; r < i; r += 1)
              (t[r]._render = e),
                'gr' === t[r].ty && this.changeGroupRender(t[r].it, e);
          }),
          (RepeaterModifier.prototype.processShapes = function (t) {
            var e,
              r,
              i,
              s,
              a,
              n = !1;
            if (this._mdf || t) {
              var o,
                h = Math.ceil(this.c.v);
              if (this._groups.length < h) {
                for (; this._groups.length < h; ) {
                  var l = { it: this.cloneElements(this._elements), ty: 'gr' };
                  l.it.push({
                    a: { a: 0, ix: 1, k: [0, 0] },
                    nm: 'Transform',
                    o: { a: 0, ix: 7, k: 100 },
                    p: { a: 0, ix: 2, k: [0, 0] },
                    r: {
                      a: 1,
                      ix: 6,
                      k: [
                        { s: 0, e: 0, t: 0 },
                        { s: 0, e: 0, t: 1 },
                      ],
                    },
                    s: { a: 0, ix: 3, k: [100, 100] },
                    sa: { a: 0, ix: 5, k: 0 },
                    sk: { a: 0, ix: 4, k: 0 },
                    ty: 'tr',
                  }),
                    this.arr.splice(0, 0, l),
                    this._groups.splice(0, 0, l),
                    (this._currentCopies += 1);
                }
                this.elem.reloadShapes(), (n = !0);
              }
              for (a = 0, i = 0; i <= this._groups.length - 1; i += 1) {
                if (
                  ((o = a < h),
                  (this._groups[i]._render = o),
                  this.changeGroupRender(this._groups[i].it, o),
                  !o)
                ) {
                  var p = this.elemsData[i].it,
                    c = p[p.length - 1];
                  0 !== c.transform.op.v
                    ? ((c.transform.op._mdf = !0), (c.transform.op.v = 0))
                    : (c.transform.op._mdf = !1);
                }
                a += 1;
              }
              this._currentCopies = h;
              var f = this.o.v,
                d = f % 1,
                m = f > 0 ? Math.floor(f) : Math.ceil(f),
                u = this.pMatrix.props,
                y = this.rMatrix.props,
                g = this.sMatrix.props;
              this.pMatrix.reset(),
                this.rMatrix.reset(),
                this.sMatrix.reset(),
                this.tMatrix.reset(),
                this.matrix.reset();
              var v,
                b,
                _ = 0;
              if (f > 0) {
                for (; _ < m; )
                  this.applyTransforms(
                    this.pMatrix,
                    this.rMatrix,
                    this.sMatrix,
                    this.tr,
                    1,
                    !1
                  ),
                    (_ += 1);
                d &&
                  (this.applyTransforms(
                    this.pMatrix,
                    this.rMatrix,
                    this.sMatrix,
                    this.tr,
                    d,
                    !1
                  ),
                  (_ += d));
              } else if (f < 0) {
                for (; _ > m; )
                  this.applyTransforms(
                    this.pMatrix,
                    this.rMatrix,
                    this.sMatrix,
                    this.tr,
                    1,
                    !0
                  ),
                    (_ -= 1);
                d &&
                  (this.applyTransforms(
                    this.pMatrix,
                    this.rMatrix,
                    this.sMatrix,
                    this.tr,
                    -d,
                    !0
                  ),
                  (_ -= d));
              }
              for (
                i = 1 === this.data.m ? 0 : this._currentCopies - 1,
                  s = 1 === this.data.m ? 1 : -1,
                  a = this._currentCopies;
                a;

              ) {
                if (
                  ((b = (r = (e = this.elemsData[i].it)[e.length - 1].transform
                    .mProps.v.props).length),
                  (e[e.length - 1].transform.mProps._mdf = !0),
                  (e[e.length - 1].transform.op._mdf = !0),
                  (e[e.length - 1].transform.op.v =
                    1 === this._currentCopies
                      ? this.so.v
                      : this.so.v +
                        (this.eo.v - this.so.v) *
                          (i / (this._currentCopies - 1))),
                  0 !== _)
                ) {
                  for (
                    ((0 !== i && 1 === s) ||
                      (i !== this._currentCopies - 1 && -1 === s)) &&
                      this.applyTransforms(
                        this.pMatrix,
                        this.rMatrix,
                        this.sMatrix,
                        this.tr,
                        1,
                        !1
                      ),
                      this.matrix.transform(
                        y[0],
                        y[1],
                        y[2],
                        y[3],
                        y[4],
                        y[5],
                        y[6],
                        y[7],
                        y[8],
                        y[9],
                        y[10],
                        y[11],
                        y[12],
                        y[13],
                        y[14],
                        y[15]
                      ),
                      this.matrix.transform(
                        g[0],
                        g[1],
                        g[2],
                        g[3],
                        g[4],
                        g[5],
                        g[6],
                        g[7],
                        g[8],
                        g[9],
                        g[10],
                        g[11],
                        g[12],
                        g[13],
                        g[14],
                        g[15]
                      ),
                      this.matrix.transform(
                        u[0],
                        u[1],
                        u[2],
                        u[3],
                        u[4],
                        u[5],
                        u[6],
                        u[7],
                        u[8],
                        u[9],
                        u[10],
                        u[11],
                        u[12],
                        u[13],
                        u[14],
                        u[15]
                      ),
                      v = 0;
                    v < b;
                    v += 1
                  )
                    r[v] = this.matrix.props[v];
                  this.matrix.reset();
                } else
                  for (this.matrix.reset(), v = 0; v < b; v += 1)
                    r[v] = this.matrix.props[v];
                (_ += 1), (a -= 1), (i += s);
              }
            } else
              for (a = this._currentCopies, i = 0, s = 1; a; )
                (r = (e = this.elemsData[i].it)[e.length - 1].transform.mProps.v
                  .props),
                  (e[e.length - 1].transform.mProps._mdf = !1),
                  (e[e.length - 1].transform.op._mdf = !1),
                  (a -= 1),
                  (i += s);
            return n;
          }),
          (RepeaterModifier.prototype.addShape = function () {}),
          extendPrototype([ShapeModifier], RoundCornersModifier),
          (RoundCornersModifier.prototype.initModifierProperties = function (
            t,
            e
          ) {
            (this.getValue = this.processKeys),
              (this.rd = PropertyFactory.getProp(t, e.r, 0, null, this)),
              (this._isAnimated = !!this.rd.effectsSequence.length);
          }),
          (RoundCornersModifier.prototype.processPath = function (t, e) {
            var r,
              i = shapePool.newElement();
            i.c = t.c;
            var s,
              a,
              n,
              o,
              h,
              l,
              p,
              c,
              f,
              d,
              m,
              u,
              y = t._length,
              g = 0;
            for (r = 0; r < y; r += 1)
              (s = t.v[r]),
                (n = t.o[r]),
                (a = t.i[r]),
                s[0] === n[0] && s[1] === n[1] && s[0] === a[0] && s[1] === a[1]
                  ? (0 !== r && r !== y - 1) || t.c
                    ? ((o = 0 === r ? t.v[y - 1] : t.v[r - 1]),
                      (l = (h = Math.sqrt(
                        Math.pow(s[0] - o[0], 2) + Math.pow(s[1] - o[1], 2)
                      ))
                        ? Math.min(h / 2, e) / h
                        : 0),
                      (p = m = s[0] + (o[0] - s[0]) * l),
                      (c = u = s[1] - (s[1] - o[1]) * l),
                      (f = p - (p - s[0]) * roundCorner),
                      (d = c - (c - s[1]) * roundCorner),
                      i.setTripleAt(p, c, f, d, m, u, g),
                      (g += 1),
                      (o = r === y - 1 ? t.v[0] : t.v[r + 1]),
                      (l = (h = Math.sqrt(
                        Math.pow(s[0] - o[0], 2) + Math.pow(s[1] - o[1], 2)
                      ))
                        ? Math.min(h / 2, e) / h
                        : 0),
                      (p = f = s[0] + (o[0] - s[0]) * l),
                      (c = d = s[1] + (o[1] - s[1]) * l),
                      (m = p - (p - s[0]) * roundCorner),
                      (u = c - (c - s[1]) * roundCorner),
                      i.setTripleAt(p, c, f, d, m, u, g),
                      (g += 1))
                    : (i.setTripleAt(s[0], s[1], n[0], n[1], a[0], a[1], g),
                      (g += 1))
                  : (i.setTripleAt(
                      t.v[r][0],
                      t.v[r][1],
                      t.o[r][0],
                      t.o[r][1],
                      t.i[r][0],
                      t.i[r][1],
                      g
                    ),
                    (g += 1));
            return i;
          }),
          (RoundCornersModifier.prototype.processShapes = function (t) {
            var e,
              r,
              i,
              s,
              a,
              n,
              o = this.shapes.length,
              h = this.rd.v;
            if (0 !== h)
              for (r = 0; r < o; r += 1) {
                if (
                  ((n = (a = this.shapes[r]).localShapeCollection),
                  a.shape._mdf || this._mdf || t)
                )
                  for (
                    n.releaseShapes(),
                      a.shape._mdf = !0,
                      e = a.shape.paths.shapes,
                      s = a.shape.paths._length,
                      i = 0;
                    i < s;
                    i += 1
                  )
                    n.addShape(this.processPath(e[i], h));
                a.shape.paths = a.localShapeCollection;
              }
            this.dynamicProperties.length || (this._mdf = !1);
          });
        var FontManager = (function () {
          var t = { w: 0, size: 0, shapes: [], data: { shapes: [] } },
            e = [];
          e = e.concat([
            2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368,
            2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379,
            2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403,
          ]);
          var r = ['d83cdffb', 'd83cdffc', 'd83cdffd', 'd83cdffe', 'd83cdfff'],
            i = [65039, 8205];
          function s(t, e) {
            var r = createTag('span');
            r.setAttribute('aria-hidden', !0), (r.style.fontFamily = e);
            var i = createTag('span');
            (i.innerText = 'giItT1WQy@!-/#'),
              (r.style.position = 'absolute'),
              (r.style.left = '-10000px'),
              (r.style.top = '-10000px'),
              (r.style.fontSize = '300px'),
              (r.style.fontVariant = 'normal'),
              (r.style.fontStyle = 'normal'),
              (r.style.fontWeight = 'normal'),
              (r.style.letterSpacing = '0'),
              r.appendChild(i),
              document.body.appendChild(r);
            var s = i.offsetWidth;
            return (
              (i.style.fontFamily =
                (function (t) {
                  var e,
                    r = t.split(','),
                    i = r.length,
                    s = [];
                  for (e = 0; e < i; e += 1)
                    'sans-serif' !== r[e] &&
                      'monospace' !== r[e] &&
                      s.push(r[e]);
                  return s.join(',');
                })(t) +
                ', ' +
                e),
              { node: i, w: s, parent: r }
            );
          }
          function a(t, e) {
            var r,
              i = document.body && e ? 'svg' : 'canvas',
              s = getFontProperties(t);
            if ('svg' === i) {
              var a = createNS('text');
              (a.style.fontSize = '100px'),
                a.setAttribute('font-family', t.fFamily),
                a.setAttribute('font-style', s.style),
                a.setAttribute('font-weight', s.weight),
                (a.textContent = '1'),
                t.fClass
                  ? ((a.style.fontFamily = 'inherit'),
                    a.setAttribute('class', t.fClass))
                  : (a.style.fontFamily = t.fFamily),
                e.appendChild(a),
                (r = a);
            } else {
              var n = new OffscreenCanvas(500, 500).getContext('2d');
              (n.font = s.style + ' ' + s.weight + ' 100px ' + t.fFamily),
                (r = n);
            }
            return {
              measureText: function (t) {
                return 'svg' === i
                  ? ((r.textContent = t), r.getComputedTextLength())
                  : r.measureText(t).width;
              },
            };
          }
          var n = function () {
            (this.fonts = []),
              (this.chars = null),
              (this.typekitLoaded = 0),
              (this.isLoaded = !1),
              (this._warned = !1),
              (this.initTime = Date.now()),
              (this.setIsLoadedBinded = this.setIsLoaded.bind(this)),
              (this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this));
          };
          (n.isModifier = function (t, e) {
            var i = t.toString(16) + e.toString(16);
            return -1 !== r.indexOf(i);
          }),
            (n.isZeroWidthJoiner = function (t, e) {
              return e ? t === i[0] && e === i[1] : t === i[1];
            }),
            (n.isCombinedCharacter = function (t) {
              return -1 !== e.indexOf(t);
            });
          var o = {
            addChars: function (t) {
              if (t) {
                var e;
                this.chars || (this.chars = []);
                var r,
                  i,
                  s = t.length,
                  a = this.chars.length;
                for (e = 0; e < s; e += 1) {
                  for (r = 0, i = !1; r < a; )
                    this.chars[r].style === t[e].style &&
                      this.chars[r].fFamily === t[e].fFamily &&
                      this.chars[r].ch === t[e].ch &&
                      (i = !0),
                      (r += 1);
                  i || (this.chars.push(t[e]), (a += 1));
                }
              }
            },
            addFonts: function (t, e) {
              if (t) {
                if (this.chars)
                  return (this.isLoaded = !0), void (this.fonts = t.list);
                if (!document.body)
                  return (
                    (this.isLoaded = !0),
                    t.list.forEach(function (t) {
                      (t.helper = a(t)), (t.cache = {});
                    }),
                    void (this.fonts = t.list)
                  );
                var r,
                  i = t.list,
                  n = i.length,
                  o = n;
                for (r = 0; r < n; r += 1) {
                  var h,
                    l,
                    p = !0;
                  if (
                    ((i[r].loaded = !1),
                    (i[r].monoCase = s(i[r].fFamily, 'monospace')),
                    (i[r].sansCase = s(i[r].fFamily, 'sans-serif')),
                    i[r].fPath)
                  ) {
                    if ('p' === i[r].fOrigin || 3 === i[r].origin) {
                      if (
                        ((h = document.querySelectorAll(
                          'style[f-forigin="p"][f-family="' +
                            i[r].fFamily +
                            '"], style[f-origin="3"][f-family="' +
                            i[r].fFamily +
                            '"]'
                        )).length > 0 && (p = !1),
                        p)
                      ) {
                        var c = createTag('style');
                        c.setAttribute('f-forigin', i[r].fOrigin),
                          c.setAttribute('f-origin', i[r].origin),
                          c.setAttribute('f-family', i[r].fFamily),
                          (c.type = 'text/css'),
                          (c.innerText =
                            '@font-face {font-family: ' +
                            i[r].fFamily +
                            "; font-style: normal; src: url('" +
                            i[r].fPath +
                            "');}"),
                          e.appendChild(c);
                      }
                    } else if ('g' === i[r].fOrigin || 1 === i[r].origin) {
                      for (
                        h = document.querySelectorAll(
                          'link[f-forigin="g"], link[f-origin="1"]'
                        ),
                          l = 0;
                        l < h.length;
                        l += 1
                      )
                        -1 !== h[l].href.indexOf(i[r].fPath) && (p = !1);
                      if (p) {
                        var f = createTag('link');
                        f.setAttribute('f-forigin', i[r].fOrigin),
                          f.setAttribute('f-origin', i[r].origin),
                          (f.type = 'text/css'),
                          (f.rel = 'stylesheet'),
                          (f.href = i[r].fPath),
                          document.body.appendChild(f);
                      }
                    } else if ('t' === i[r].fOrigin || 2 === i[r].origin) {
                      for (
                        h = document.querySelectorAll(
                          'script[f-forigin="t"], script[f-origin="2"]'
                        ),
                          l = 0;
                        l < h.length;
                        l += 1
                      )
                        i[r].fPath === h[l].src && (p = !1);
                      if (p) {
                        var d = createTag('link');
                        d.setAttribute('f-forigin', i[r].fOrigin),
                          d.setAttribute('f-origin', i[r].origin),
                          d.setAttribute('rel', 'stylesheet'),
                          d.setAttribute('href', i[r].fPath),
                          e.appendChild(d);
                      }
                    }
                  } else (i[r].loaded = !0), (o -= 1);
                  (i[r].helper = a(i[r], e)),
                    (i[r].cache = {}),
                    this.fonts.push(i[r]);
                }
                0 === o
                  ? (this.isLoaded = !0)
                  : setTimeout(this.checkLoadedFonts.bind(this), 100);
              } else this.isLoaded = !0;
            },
            getCharData: function (e, r, i) {
              for (var s = 0, a = this.chars.length; s < a; ) {
                if (
                  this.chars[s].ch === e &&
                  this.chars[s].style === r &&
                  this.chars[s].fFamily === i
                )
                  return this.chars[s];
                s += 1;
              }
              return (
                (('string' == typeof e && 13 !== e.charCodeAt(0)) || !e) &&
                  console &&
                  console.warn &&
                  !this._warned &&
                  ((this._warned = !0),
                  console.warn(
                    'Missing character from exported characters list: ',
                    e,
                    r,
                    i
                  )),
                t
              );
            },
            getFontByName: function (t) {
              for (var e = 0, r = this.fonts.length; e < r; ) {
                if (this.fonts[e].fName === t) return this.fonts[e];
                e += 1;
              }
              return this.fonts[0];
            },
            measureText: function (t, e, r) {
              var i = this.getFontByName(e),
                s = t.charCodeAt(0);
              if (!i.cache[s + 1]) {
                var a = i.helper;
                if (' ' === t) {
                  var n = a.measureText('|' + t + '|'),
                    o = a.measureText('||');
                  i.cache[s + 1] = (n - o) / 100;
                } else i.cache[s + 1] = a.measureText(t) / 100;
              }
              return i.cache[s + 1] * r;
            },
            checkLoadedFonts: function () {
              var t,
                e,
                r,
                i = this.fonts.length,
                s = i;
              for (t = 0; t < i; t += 1)
                this.fonts[t].loaded
                  ? (s -= 1)
                  : 'n' === this.fonts[t].fOrigin || 0 === this.fonts[t].origin
                  ? (this.fonts[t].loaded = !0)
                  : ((e = this.fonts[t].monoCase.node),
                    (r = this.fonts[t].monoCase.w),
                    e.offsetWidth !== r
                      ? ((s -= 1), (this.fonts[t].loaded = !0))
                      : ((e = this.fonts[t].sansCase.node),
                        (r = this.fonts[t].sansCase.w),
                        e.offsetWidth !== r &&
                          ((s -= 1), (this.fonts[t].loaded = !0))),
                    this.fonts[t].loaded &&
                      (this.fonts[t].sansCase.parent.parentNode.removeChild(
                        this.fonts[t].sansCase.parent
                      ),
                      this.fonts[t].monoCase.parent.parentNode.removeChild(
                        this.fonts[t].monoCase.parent
                      )));
              0 !== s && Date.now() - this.initTime < 5e3
                ? setTimeout(this.checkLoadedFontsBinded, 20)
                : setTimeout(this.setIsLoadedBinded, 10);
            },
            setIsLoaded: function () {
              this.isLoaded = !0;
            },
          };
          return (n.prototype = o), n;
        })();
        function RenderableElement() {}
        RenderableElement.prototype = {
          initRenderable: function () {
            (this.isInRange = !1),
              (this.hidden = !1),
              (this.isTransparent = !1),
              (this.renderableComponents = []);
          },
          addRenderableComponent: function (t) {
            -1 === this.renderableComponents.indexOf(t) &&
              this.renderableComponents.push(t);
          },
          removeRenderableComponent: function (t) {
            -1 !== this.renderableComponents.indexOf(t) &&
              this.renderableComponents.splice(
                this.renderableComponents.indexOf(t),
                1
              );
          },
          prepareRenderableFrame: function (t) {
            this.checkLayerLimits(t);
          },
          checkTransparency: function () {
            this.finalTransform.mProp.o.v <= 0
              ? !this.isTransparent &&
                this.globalData.renderConfig.hideOnTransparent &&
                ((this.isTransparent = !0), this.hide())
              : this.isTransparent && ((this.isTransparent = !1), this.show());
          },
          checkLayerLimits: function (t) {
            this.data.ip - this.data.st <= t && this.data.op - this.data.st > t
              ? !0 !== this.isInRange &&
                ((this.globalData._mdf = !0),
                (this._mdf = !0),
                (this.isInRange = !0),
                this.show())
              : !1 !== this.isInRange &&
                ((this.globalData._mdf = !0),
                (this.isInRange = !1),
                this.hide());
          },
          renderRenderable: function () {
            var t,
              e = this.renderableComponents.length;
            for (t = 0; t < e; t += 1)
              this.renderableComponents[t].renderFrame(this._isFirstFrame);
          },
          sourceRectAtTime: function () {
            return { top: 0, left: 0, width: 100, height: 100 };
          },
          getLayerSize: function () {
            return 5 === this.data.ty
              ? { w: this.data.textData.width, h: this.data.textData.height }
              : { w: this.data.width, h: this.data.height };
          },
        };
        var MaskManagerInterface = (function () {
            function t(t, e) {
              (this._mask = t), (this._data = e);
            }
            return (
              Object.defineProperty(t.prototype, 'maskPath', {
                get: function () {
                  return (
                    this._mask.prop.k && this._mask.prop.getValue(),
                    this._mask.prop
                  );
                },
              }),
              Object.defineProperty(t.prototype, 'maskOpacity', {
                get: function () {
                  return (
                    this._mask.op.k && this._mask.op.getValue(),
                    100 * this._mask.op.v
                  );
                },
              }),
              function (e) {
                var r,
                  i = createSizedArray(e.viewData.length),
                  s = e.viewData.length;
                for (r = 0; r < s; r += 1)
                  i[r] = new t(e.viewData[r], e.masksProperties[r]);
                return function (t) {
                  for (r = 0; r < s; ) {
                    if (e.masksProperties[r].nm === t) return i[r];
                    r += 1;
                  }
                  return null;
                };
              }
            );
          })(),
          ExpressionPropertyInterface = (function () {
            var t = { pv: 0, v: 0, mult: 1 },
              e = { pv: [0, 0, 0], v: [0, 0, 0], mult: 1 };
            function r(t, e, r) {
              Object.defineProperty(t, 'velocity', {
                get: function () {
                  return e.getVelocityAtTime(e.comp.currentFrame);
                },
              }),
                (t.numKeys = e.keyframes ? e.keyframes.length : 0),
                (t.key = function (i) {
                  if (!t.numKeys) return 0;
                  var s = '';
                  s =
                    's' in e.keyframes[i - 1]
                      ? e.keyframes[i - 1].s
                      : 'e' in e.keyframes[i - 2]
                      ? e.keyframes[i - 2].e
                      : e.keyframes[i - 2].s;
                  var a =
                    'unidimensional' === r
                      ? new Number(s)
                      : Object.assign({}, s);
                  return (
                    (a.time =
                      e.keyframes[i - 1].t / e.elem.comp.globalData.frameRate),
                    (a.value = 'unidimensional' === r ? s[0] : s),
                    a
                  );
                }),
                (t.valueAtTime = e.getValueAtTime),
                (t.speedAtTime = e.getSpeedAtTime),
                (t.velocityAtTime = e.getVelocityAtTime),
                (t.propertyGroup = e.propertyGroup);
            }
            function i() {
              return t;
            }
            return function (s) {
              return s
                ? 'unidimensional' === s.propType
                  ? (function (e) {
                      (e && 'pv' in e) || (e = t);
                      var i = 1 / e.mult,
                        s = e.pv * i,
                        a = new Number(s);
                      return (
                        (a.value = s),
                        r(a, e, 'unidimensional'),
                        function () {
                          return (
                            e.k && e.getValue(),
                            (s = e.v * i),
                            a.value !== s &&
                              (((a = new Number(s)).value = s),
                              r(a, e, 'unidimensional')),
                            a
                          );
                        }
                      );
                    })(s)
                  : (function (t) {
                      (t && 'pv' in t) || (t = e);
                      var i = 1 / t.mult,
                        s = (t.data && t.data.l) || t.pv.length,
                        a = createTypedArray('float32', s),
                        n = createTypedArray('float32', s);
                      return (
                        (a.value = n),
                        r(a, t, 'multidimensional'),
                        function () {
                          t.k && t.getValue();
                          for (var e = 0; e < s; e += 1)
                            (n[e] = t.v[e] * i), (a[e] = n[e]);
                          return a;
                        }
                      );
                    })(s)
                : i;
            };
          })(),
          TransformExpressionInterface = function (t) {
            function e(t) {
              switch (t) {
                case 'scale':
                case 'Scale':
                case 'ADBE Scale':
                case 6:
                  return e.scale;
                case 'rotation':
                case 'Rotation':
                case 'ADBE Rotation':
                case 'ADBE Rotate Z':
                case 10:
                  return e.rotation;
                case 'ADBE Rotate X':
                  return e.xRotation;
                case 'ADBE Rotate Y':
                  return e.yRotation;
                case 'position':
                case 'Position':
                case 'ADBE Position':
                case 2:
                  return e.position;
                case 'ADBE Position_0':
                  return e.xPosition;
                case 'ADBE Position_1':
                  return e.yPosition;
                case 'ADBE Position_2':
                  return e.zPosition;
                case 'anchorPoint':
                case 'AnchorPoint':
                case 'Anchor Point':
                case 'ADBE AnchorPoint':
                case 1:
                  return e.anchorPoint;
                case 'opacity':
                case 'Opacity':
                case 11:
                  return e.opacity;
                default:
                  return null;
              }
            }
            var r, i, s, a;
            return (
              Object.defineProperty(e, 'rotation', {
                get: ExpressionPropertyInterface(t.r || t.rz),
              }),
              Object.defineProperty(e, 'zRotation', {
                get: ExpressionPropertyInterface(t.rz || t.r),
              }),
              Object.defineProperty(e, 'xRotation', {
                get: ExpressionPropertyInterface(t.rx),
              }),
              Object.defineProperty(e, 'yRotation', {
                get: ExpressionPropertyInterface(t.ry),
              }),
              Object.defineProperty(e, 'scale', {
                get: ExpressionPropertyInterface(t.s),
              }),
              t.p
                ? (a = ExpressionPropertyInterface(t.p))
                : ((r = ExpressionPropertyInterface(t.px)),
                  (i = ExpressionPropertyInterface(t.py)),
                  t.pz && (s = ExpressionPropertyInterface(t.pz))),
              Object.defineProperty(e, 'position', {
                get: function () {
                  return t.p ? a() : [r(), i(), s ? s() : 0];
                },
              }),
              Object.defineProperty(e, 'xPosition', {
                get: ExpressionPropertyInterface(t.px),
              }),
              Object.defineProperty(e, 'yPosition', {
                get: ExpressionPropertyInterface(t.py),
              }),
              Object.defineProperty(e, 'zPosition', {
                get: ExpressionPropertyInterface(t.pz),
              }),
              Object.defineProperty(e, 'anchorPoint', {
                get: ExpressionPropertyInterface(t.a),
              }),
              Object.defineProperty(e, 'opacity', {
                get: ExpressionPropertyInterface(t.o),
              }),
              Object.defineProperty(e, 'skew', {
                get: ExpressionPropertyInterface(t.sk),
              }),
              Object.defineProperty(e, 'skewAxis', {
                get: ExpressionPropertyInterface(t.sa),
              }),
              Object.defineProperty(e, 'orientation', {
                get: ExpressionPropertyInterface(t.or),
              }),
              e
            );
          },
          LayerExpressionInterface = (function () {
            function t(t) {
              var e = new Matrix();
              return (
                void 0 !== t
                  ? this._elem.finalTransform.mProp.getValueAtTime(t).clone(e)
                  : this._elem.finalTransform.mProp.applyToMatrix(e),
                e
              );
            }
            function e(t, e) {
              var r = this.getMatrix(e);
              return (
                (r.props[12] = 0),
                (r.props[13] = 0),
                (r.props[14] = 0),
                this.applyPoint(r, t)
              );
            }
            function r(t, e) {
              var r = this.getMatrix(e);
              return this.applyPoint(r, t);
            }
            function i(t, e) {
              var r = this.getMatrix(e);
              return (
                (r.props[12] = 0),
                (r.props[13] = 0),
                (r.props[14] = 0),
                this.invertPoint(r, t)
              );
            }
            function s(t, e) {
              var r = this.getMatrix(e);
              return this.invertPoint(r, t);
            }
            function a(t, e) {
              if (this._elem.hierarchy && this._elem.hierarchy.length) {
                var r,
                  i = this._elem.hierarchy.length;
                for (r = 0; r < i; r += 1)
                  this._elem.hierarchy[r].finalTransform.mProp.applyToMatrix(t);
              }
              return t.applyToPointArray(e[0], e[1], e[2] || 0);
            }
            function n(t, e) {
              if (this._elem.hierarchy && this._elem.hierarchy.length) {
                var r,
                  i = this._elem.hierarchy.length;
                for (r = 0; r < i; r += 1)
                  this._elem.hierarchy[r].finalTransform.mProp.applyToMatrix(t);
              }
              return t.inversePoint(e);
            }
            function o(t) {
              var e = new Matrix();
              if (
                (e.reset(),
                this._elem.finalTransform.mProp.applyToMatrix(e),
                this._elem.hierarchy && this._elem.hierarchy.length)
              ) {
                var r,
                  i = this._elem.hierarchy.length;
                for (r = 0; r < i; r += 1)
                  this._elem.hierarchy[r].finalTransform.mProp.applyToMatrix(e);
                return e.inversePoint(t);
              }
              return e.inversePoint(t);
            }
            function h() {
              return [1, 1, 1, 1];
            }
            return function (l) {
              var p;
              function c(t) {
                switch (t) {
                  case 'ADBE Root Vectors Group':
                  case 'Contents':
                  case 2:
                    return c.shapeInterface;
                  case 1:
                  case 6:
                  case 'Transform':
                  case 'transform':
                  case 'ADBE Transform Group':
                    return p;
                  case 4:
                  case 'ADBE Effect Parade':
                  case 'effects':
                  case 'Effects':
                    return c.effect;
                  case 'ADBE Text Properties':
                    return c.textInterface;
                  default:
                    return null;
                }
              }
              (c.getMatrix = t),
                (c.invertPoint = n),
                (c.applyPoint = a),
                (c.toWorld = r),
                (c.toWorldVec = e),
                (c.fromWorld = s),
                (c.fromWorldVec = i),
                (c.toComp = r),
                (c.fromComp = o),
                (c.sampleImage = h),
                (c.sourceRectAtTime = l.sourceRectAtTime.bind(l)),
                (c._elem = l);
              var f = getDescriptor(
                (p = TransformExpressionInterface(l.finalTransform.mProp)),
                'anchorPoint'
              );
              return (
                Object.defineProperties(c, {
                  hasParent: {
                    get: function () {
                      return l.hierarchy.length;
                    },
                  },
                  parent: {
                    get: function () {
                      return l.hierarchy[0].layerInterface;
                    },
                  },
                  rotation: getDescriptor(p, 'rotation'),
                  scale: getDescriptor(p, 'scale'),
                  position: getDescriptor(p, 'position'),
                  opacity: getDescriptor(p, 'opacity'),
                  anchorPoint: f,
                  anchor_point: f,
                  transform: {
                    get: function () {
                      return p;
                    },
                  },
                  active: {
                    get: function () {
                      return l.isInRange;
                    },
                  },
                }),
                (c.startTime = l.data.st),
                (c.index = l.data.ind),
                (c.source = l.data.refId),
                (c.height = 0 === l.data.ty ? l.data.h : 100),
                (c.width = 0 === l.data.ty ? l.data.w : 100),
                (c.inPoint = l.data.ip / l.comp.globalData.frameRate),
                (c.outPoint = l.data.op / l.comp.globalData.frameRate),
                (c._name = l.data.nm),
                (c.registerMaskInterface = function (t) {
                  c.mask = new MaskManagerInterface(t, l);
                }),
                (c.registerEffectsInterface = function (t) {
                  c.effect = t;
                }),
                c
              );
            };
          })(),
          propertyGroupFactory = function (t, e) {
            return function (r) {
              return (r = void 0 === r ? 1 : r) <= 0 ? t : e(r - 1);
            };
          },
          PropertyInterface = function (t, e) {
            var r = { _name: t };
            return function (t) {
              return (t = void 0 === t ? 1 : t) <= 0 ? r : e(t - 1);
            };
          },
          EffectsExpressionInterface = (function () {
            var t = {
              createEffectsInterface: function (t, r) {
                if (t.effectsManager) {
                  var i,
                    s = [],
                    a = t.data.ef,
                    n = t.effectsManager.effectElements.length;
                  for (i = 0; i < n; i += 1)
                    s.push(e(a[i], t.effectsManager.effectElements[i], r, t));
                  var o = t.data.ef || [],
                    h = function (t) {
                      for (i = 0, n = o.length; i < n; ) {
                        if (t === o[i].nm || t === o[i].mn || t === o[i].ix)
                          return s[i];
                        i += 1;
                      }
                      return null;
                    };
                  return (
                    Object.defineProperty(h, 'numProperties', {
                      get: function () {
                        return o.length;
                      },
                    }),
                    h
                  );
                }
                return null;
              },
            };
            function e(t, i, s, a) {
              function n(e) {
                for (var r = t.ef, i = 0, s = r.length; i < s; ) {
                  if (e === r[i].nm || e === r[i].mn || e === r[i].ix)
                    return 5 === r[i].ty ? l[i] : l[i]();
                  i += 1;
                }
                throw new Error();
              }
              var o,
                h = propertyGroupFactory(n, s),
                l = [],
                p = t.ef.length;
              for (o = 0; o < p; o += 1)
                5 === t.ef[o].ty
                  ? l.push(
                      e(
                        t.ef[o],
                        i.effectElements[o],
                        i.effectElements[o].propertyGroup,
                        a
                      )
                    )
                  : l.push(r(i.effectElements[o], t.ef[o].ty, a, h));
              return (
                'ADBE Color Control' === t.mn &&
                  Object.defineProperty(n, 'color', {
                    get: function () {
                      return l[0]();
                    },
                  }),
                Object.defineProperties(n, {
                  numProperties: {
                    get: function () {
                      return t.np;
                    },
                  },
                  _name: { value: t.nm },
                  propertyGroup: { value: h },
                }),
                (n.enabled = 0 !== t.en),
                (n.active = n.enabled),
                n
              );
            }
            function r(t, e, r, i) {
              var s = ExpressionPropertyInterface(t.p);
              return (
                t.p.setGroupProperty &&
                  t.p.setGroupProperty(PropertyInterface('', i)),
                function () {
                  return 10 === e ? r.comp.compInterface(t.p.v) : s();
                }
              );
            }
            return t;
          })(),
          CompExpressionInterface = function (t) {
            function e(e) {
              for (var r = 0, i = t.layers.length; r < i; ) {
                if (t.layers[r].nm === e || t.layers[r].ind === e)
                  return t.elements[r].layerInterface;
                r += 1;
              }
              return null;
            }
            return (
              Object.defineProperty(e, '_name', { value: t.data.nm }),
              (e.layer = e),
              (e.pixelAspect = 1),
              (e.height = t.data.h || t.globalData.compSize.h),
              (e.width = t.data.w || t.globalData.compSize.w),
              (e.pixelAspect = 1),
              (e.frameDuration = 1 / t.globalData.frameRate),
              (e.displayStartTime = 0),
              (e.numLayers = t.layers.length),
              e
            );
          },
          ShapePathInterface = function (t, e, r) {
            var i = e.sh;
            function s(t) {
              return 'Shape' === t ||
                'shape' === t ||
                'Path' === t ||
                'path' === t ||
                'ADBE Vector Shape' === t ||
                2 === t
                ? s.path
                : null;
            }
            var a = propertyGroupFactory(s, r);
            return (
              i.setGroupProperty(PropertyInterface('Path', a)),
              Object.defineProperties(s, {
                path: {
                  get: function () {
                    return i.k && i.getValue(), i;
                  },
                },
                shape: {
                  get: function () {
                    return i.k && i.getValue(), i;
                  },
                },
                _name: { value: t.nm },
                ix: { value: t.ix },
                propertyIndex: { value: t.ix },
                mn: { value: t.mn },
                propertyGroup: { value: r },
              }),
              s
            );
          },
          ShapeExpressionInterface = (function () {
            function t(t, n, f) {
              var d,
                m = [],
                u = t ? t.length : 0;
              for (d = 0; d < u; d += 1)
                'gr' === t[d].ty
                  ? m.push(e(t[d], n[d], f))
                  : 'fl' === t[d].ty
                  ? m.push(r(t[d], n[d], f))
                  : 'st' === t[d].ty
                  ? m.push(s(t[d], n[d], f))
                  : 'tm' === t[d].ty
                  ? m.push(a(t[d], n[d], f))
                  : 'tr' === t[d].ty ||
                    ('el' === t[d].ty
                      ? m.push(o(t[d], n[d], f))
                      : 'sr' === t[d].ty
                      ? m.push(h(t[d], n[d], f))
                      : 'sh' === t[d].ty
                      ? m.push(ShapePathInterface(t[d], n[d], f))
                      : 'rc' === t[d].ty
                      ? m.push(l(t[d], n[d], f))
                      : 'rd' === t[d].ty
                      ? m.push(p(t[d], n[d], f))
                      : 'rp' === t[d].ty
                      ? m.push(c(t[d], n[d], f))
                      : 'gf' === t[d].ty
                      ? m.push(i(t[d], n[d], f))
                      : m.push(
                          (t[d],
                          n[d],
                          function () {
                            return null;
                          })
                        ));
              return m;
            }
            function e(e, r, i) {
              var s = function (t) {
                switch (t) {
                  case 'ADBE Vectors Group':
                  case 'Contents':
                  case 2:
                    return s.content;
                  default:
                    return s.transform;
                }
              };
              s.propertyGroup = propertyGroupFactory(s, i);
              var a = (function (e, r, i) {
                  var s,
                    a = function (t) {
                      for (var e = 0, r = s.length; e < r; ) {
                        if (
                          s[e]._name === t ||
                          s[e].mn === t ||
                          s[e].propertyIndex === t ||
                          s[e].ix === t ||
                          s[e].ind === t
                        )
                          return s[e];
                        e += 1;
                      }
                      return 'number' == typeof t ? s[t - 1] : null;
                    };
                  (a.propertyGroup = propertyGroupFactory(a, i)),
                    (s = t(e.it, r.it, a.propertyGroup)),
                    (a.numProperties = s.length);
                  var o = n(
                    e.it[e.it.length - 1],
                    r.it[r.it.length - 1],
                    a.propertyGroup
                  );
                  return (
                    (a.transform = o),
                    (a.propertyIndex = e.cix),
                    (a._name = e.nm),
                    a
                  );
                })(e, r, s.propertyGroup),
                o = n(
                  e.it[e.it.length - 1],
                  r.it[r.it.length - 1],
                  s.propertyGroup
                );
              return (
                (s.content = a),
                (s.transform = o),
                Object.defineProperty(s, '_name', {
                  get: function () {
                    return e.nm;
                  },
                }),
                (s.numProperties = e.np),
                (s.propertyIndex = e.ix),
                (s.nm = e.nm),
                (s.mn = e.mn),
                s
              );
            }
            function r(t, e, r) {
              function i(t) {
                return 'Color' === t || 'color' === t
                  ? i.color
                  : 'Opacity' === t || 'opacity' === t
                  ? i.opacity
                  : null;
              }
              return (
                Object.defineProperties(i, {
                  color: { get: ExpressionPropertyInterface(e.c) },
                  opacity: { get: ExpressionPropertyInterface(e.o) },
                  _name: { value: t.nm },
                  mn: { value: t.mn },
                }),
                e.c.setGroupProperty(PropertyInterface('Color', r)),
                e.o.setGroupProperty(PropertyInterface('Opacity', r)),
                i
              );
            }
            function i(t, e, r) {
              function i(t) {
                return 'Start Point' === t || 'start point' === t
                  ? i.startPoint
                  : 'End Point' === t || 'end point' === t
                  ? i.endPoint
                  : 'Opacity' === t || 'opacity' === t
                  ? i.opacity
                  : null;
              }
              return (
                Object.defineProperties(i, {
                  startPoint: { get: ExpressionPropertyInterface(e.s) },
                  endPoint: { get: ExpressionPropertyInterface(e.e) },
                  opacity: { get: ExpressionPropertyInterface(e.o) },
                  type: {
                    get: function () {
                      return 'a';
                    },
                  },
                  _name: { value: t.nm },
                  mn: { value: t.mn },
                }),
                e.s.setGroupProperty(PropertyInterface('Start Point', r)),
                e.e.setGroupProperty(PropertyInterface('End Point', r)),
                e.o.setGroupProperty(PropertyInterface('Opacity', r)),
                i
              );
            }
            function s(t, e, r) {
              var i,
                s = propertyGroupFactory(l, r),
                a = propertyGroupFactory(h, s);
              function n(r) {
                Object.defineProperty(h, t.d[r].nm, {
                  get: ExpressionPropertyInterface(e.d.dataProps[r].p),
                });
              }
              var o = t.d ? t.d.length : 0,
                h = {};
              for (i = 0; i < o; i += 1)
                n(i), e.d.dataProps[i].p.setGroupProperty(a);
              function l(t) {
                return 'Color' === t || 'color' === t
                  ? l.color
                  : 'Opacity' === t || 'opacity' === t
                  ? l.opacity
                  : 'Stroke Width' === t || 'stroke width' === t
                  ? l.strokeWidth
                  : null;
              }
              return (
                Object.defineProperties(l, {
                  color: { get: ExpressionPropertyInterface(e.c) },
                  opacity: { get: ExpressionPropertyInterface(e.o) },
                  strokeWidth: { get: ExpressionPropertyInterface(e.w) },
                  dash: {
                    get: function () {
                      return h;
                    },
                  },
                  _name: { value: t.nm },
                  mn: { value: t.mn },
                }),
                e.c.setGroupProperty(PropertyInterface('Color', s)),
                e.o.setGroupProperty(PropertyInterface('Opacity', s)),
                e.w.setGroupProperty(PropertyInterface('Stroke Width', s)),
                l
              );
            }
            function a(t, e, r) {
              function i(e) {
                return e === t.e.ix || 'End' === e || 'end' === e
                  ? i.end
                  : e === t.s.ix
                  ? i.start
                  : e === t.o.ix
                  ? i.offset
                  : null;
              }
              var s = propertyGroupFactory(i, r);
              return (
                (i.propertyIndex = t.ix),
                e.s.setGroupProperty(PropertyInterface('Start', s)),
                e.e.setGroupProperty(PropertyInterface('End', s)),
                e.o.setGroupProperty(PropertyInterface('Offset', s)),
                (i.propertyIndex = t.ix),
                (i.propertyGroup = r),
                Object.defineProperties(i, {
                  start: { get: ExpressionPropertyInterface(e.s) },
                  end: { get: ExpressionPropertyInterface(e.e) },
                  offset: { get: ExpressionPropertyInterface(e.o) },
                  _name: { value: t.nm },
                }),
                (i.mn = t.mn),
                i
              );
            }
            function n(t, e, r) {
              function i(e) {
                return t.a.ix === e || 'Anchor Point' === e
                  ? i.anchorPoint
                  : t.o.ix === e || 'Opacity' === e
                  ? i.opacity
                  : t.p.ix === e || 'Position' === e
                  ? i.position
                  : t.r.ix === e ||
                    'Rotation' === e ||
                    'ADBE Vector Rotation' === e
                  ? i.rotation
                  : t.s.ix === e || 'Scale' === e
                  ? i.scale
                  : (t.sk && t.sk.ix === e) || 'Skew' === e
                  ? i.skew
                  : (t.sa && t.sa.ix === e) || 'Skew Axis' === e
                  ? i.skewAxis
                  : null;
              }
              var s = propertyGroupFactory(i, r);
              return (
                e.transform.mProps.o.setGroupProperty(
                  PropertyInterface('Opacity', s)
                ),
                e.transform.mProps.p.setGroupProperty(
                  PropertyInterface('Position', s)
                ),
                e.transform.mProps.a.setGroupProperty(
                  PropertyInterface('Anchor Point', s)
                ),
                e.transform.mProps.s.setGroupProperty(
                  PropertyInterface('Scale', s)
                ),
                e.transform.mProps.r.setGroupProperty(
                  PropertyInterface('Rotation', s)
                ),
                e.transform.mProps.sk &&
                  (e.transform.mProps.sk.setGroupProperty(
                    PropertyInterface('Skew', s)
                  ),
                  e.transform.mProps.sa.setGroupProperty(
                    PropertyInterface('Skew Angle', s)
                  )),
                e.transform.op.setGroupProperty(
                  PropertyInterface('Opacity', s)
                ),
                Object.defineProperties(i, {
                  opacity: {
                    get: ExpressionPropertyInterface(e.transform.mProps.o),
                  },
                  position: {
                    get: ExpressionPropertyInterface(e.transform.mProps.p),
                  },
                  anchorPoint: {
                    get: ExpressionPropertyInterface(e.transform.mProps.a),
                  },
                  scale: {
                    get: ExpressionPropertyInterface(e.transform.mProps.s),
                  },
                  rotation: {
                    get: ExpressionPropertyInterface(e.transform.mProps.r),
                  },
                  skew: {
                    get: ExpressionPropertyInterface(e.transform.mProps.sk),
                  },
                  skewAxis: {
                    get: ExpressionPropertyInterface(e.transform.mProps.sa),
                  },
                  _name: { value: t.nm },
                }),
                (i.ty = 'tr'),
                (i.mn = t.mn),
                (i.propertyGroup = r),
                i
              );
            }
            function o(t, e, r) {
              function i(e) {
                return t.p.ix === e ? i.position : t.s.ix === e ? i.size : null;
              }
              var s = propertyGroupFactory(i, r);
              i.propertyIndex = t.ix;
              var a = 'tm' === e.sh.ty ? e.sh.prop : e.sh;
              return (
                a.s.setGroupProperty(PropertyInterface('Size', s)),
                a.p.setGroupProperty(PropertyInterface('Position', s)),
                Object.defineProperties(i, {
                  size: { get: ExpressionPropertyInterface(a.s) },
                  position: { get: ExpressionPropertyInterface(a.p) },
                  _name: { value: t.nm },
                }),
                (i.mn = t.mn),
                i
              );
            }
            function h(t, e, r) {
              function i(e) {
                return t.p.ix === e
                  ? i.position
                  : t.r.ix === e
                  ? i.rotation
                  : t.pt.ix === e
                  ? i.points
                  : t.or.ix === e || 'ADBE Vector Star Outer Radius' === e
                  ? i.outerRadius
                  : t.os.ix === e
                  ? i.outerRoundness
                  : !t.ir ||
                    (t.ir.ix !== e && 'ADBE Vector Star Inner Radius' !== e)
                  ? t.is && t.is.ix === e
                    ? i.innerRoundness
                    : null
                  : i.innerRadius;
              }
              var s = propertyGroupFactory(i, r),
                a = 'tm' === e.sh.ty ? e.sh.prop : e.sh;
              return (
                (i.propertyIndex = t.ix),
                a.or.setGroupProperty(PropertyInterface('Outer Radius', s)),
                a.os.setGroupProperty(PropertyInterface('Outer Roundness', s)),
                a.pt.setGroupProperty(PropertyInterface('Points', s)),
                a.p.setGroupProperty(PropertyInterface('Position', s)),
                a.r.setGroupProperty(PropertyInterface('Rotation', s)),
                t.ir &&
                  (a.ir.setGroupProperty(PropertyInterface('Inner Radius', s)),
                  a.is.setGroupProperty(
                    PropertyInterface('Inner Roundness', s)
                  )),
                Object.defineProperties(i, {
                  position: { get: ExpressionPropertyInterface(a.p) },
                  rotation: { get: ExpressionPropertyInterface(a.r) },
                  points: { get: ExpressionPropertyInterface(a.pt) },
                  outerRadius: { get: ExpressionPropertyInterface(a.or) },
                  outerRoundness: { get: ExpressionPropertyInterface(a.os) },
                  innerRadius: { get: ExpressionPropertyInterface(a.ir) },
                  innerRoundness: { get: ExpressionPropertyInterface(a.is) },
                  _name: { value: t.nm },
                }),
                (i.mn = t.mn),
                i
              );
            }
            function l(t, e, r) {
              function i(e) {
                return t.p.ix === e
                  ? i.position
                  : t.r.ix === e
                  ? i.roundness
                  : t.s.ix === e ||
                    'Size' === e ||
                    'ADBE Vector Rect Size' === e
                  ? i.size
                  : null;
              }
              var s = propertyGroupFactory(i, r),
                a = 'tm' === e.sh.ty ? e.sh.prop : e.sh;
              return (
                (i.propertyIndex = t.ix),
                a.p.setGroupProperty(PropertyInterface('Position', s)),
                a.s.setGroupProperty(PropertyInterface('Size', s)),
                a.r.setGroupProperty(PropertyInterface('Rotation', s)),
                Object.defineProperties(i, {
                  position: { get: ExpressionPropertyInterface(a.p) },
                  roundness: { get: ExpressionPropertyInterface(a.r) },
                  size: { get: ExpressionPropertyInterface(a.s) },
                  _name: { value: t.nm },
                }),
                (i.mn = t.mn),
                i
              );
            }
            function p(t, e, r) {
              function i(e) {
                return t.r.ix === e || 'Round Corners 1' === e
                  ? i.radius
                  : null;
              }
              var s = propertyGroupFactory(i, r),
                a = e;
              return (
                (i.propertyIndex = t.ix),
                a.rd.setGroupProperty(PropertyInterface('Radius', s)),
                Object.defineProperties(i, {
                  radius: { get: ExpressionPropertyInterface(a.rd) },
                  _name: { value: t.nm },
                }),
                (i.mn = t.mn),
                i
              );
            }
            function c(t, e, r) {
              function i(e) {
                return t.c.ix === e || 'Copies' === e
                  ? i.copies
                  : t.o.ix === e || 'Offset' === e
                  ? i.offset
                  : null;
              }
              var s = propertyGroupFactory(i, r),
                a = e;
              return (
                (i.propertyIndex = t.ix),
                a.c.setGroupProperty(PropertyInterface('Copies', s)),
                a.o.setGroupProperty(PropertyInterface('Offset', s)),
                Object.defineProperties(i, {
                  copies: { get: ExpressionPropertyInterface(a.c) },
                  offset: { get: ExpressionPropertyInterface(a.o) },
                  _name: { value: t.nm },
                }),
                (i.mn = t.mn),
                i
              );
            }
            return function (e, r, i) {
              var s;
              function a(t) {
                if ('number' == typeof t)
                  return 0 === (t = void 0 === t ? 1 : t) ? i : s[t - 1];
                for (var e = 0, r = s.length; e < r; ) {
                  if (s[e]._name === t) return s[e];
                  e += 1;
                }
                return null;
              }
              return (
                (a.propertyGroup = propertyGroupFactory(a, function () {
                  return i;
                })),
                (s = t(e, r, a.propertyGroup)),
                (a.numProperties = s.length),
                (a._name = 'Contents'),
                a
              );
            };
          })(),
          TextExpressionInterface = function (t) {
            var e, r;
            function i(t) {
              return 'ADBE Text Document' === t ? i.sourceText : null;
            }
            return (
              Object.defineProperty(i, 'sourceText', {
                get: function () {
                  t.textProperty.getValue();
                  var i = t.textProperty.currentData.t;
                  return (
                    i !== e &&
                      ((t.textProperty.currentData.t = e),
                      ((r = new String(i)).value = i || new String(i))),
                    r
                  );
                },
              }),
              i
            );
          },
          getBlendMode =
            ((blendModeEnums = {
              0: 'source-over',
              1: 'multiply',
              2: 'screen',
              3: 'overlay',
              4: 'darken',
              5: 'lighten',
              6: 'color-dodge',
              7: 'color-burn',
              8: 'hard-light',
              9: 'soft-light',
              10: 'difference',
              11: 'exclusion',
              12: 'hue',
              13: 'saturation',
              14: 'color',
              15: 'luminosity',
            }),
            function (t) {
              return blendModeEnums[t] || '';
            }),
          blendModeEnums;
        function SliderEffect(t, e, r) {
          this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
        }
        function AngleEffect(t, e, r) {
          this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
        }
        function ColorEffect(t, e, r) {
          this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
        }
        function PointEffect(t, e, r) {
          this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
        }
        function LayerIndexEffect(t, e, r) {
          this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
        }
        function MaskIndexEffect(t, e, r) {
          this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
        }
        function CheckboxEffect(t, e, r) {
          this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
        }
        function NoValueEffect() {
          this.p = {};
        }
        function EffectsManager(t, e) {
          var r,
            i = t.ef || [];
          this.effectElements = [];
          var s,
            a = i.length;
          for (r = 0; r < a; r += 1)
            (s = new GroupEffect(i[r], e)), this.effectElements.push(s);
        }
        function GroupEffect(t, e) {
          this.init(t, e);
        }
        function BaseElement() {}
        function FrameElement() {}
        function _typeof$2(t) {
          return (
            (_typeof$2 =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      'function' == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
                  }),
            _typeof$2(t)
          );
        }
        extendPrototype([DynamicPropertyContainer], GroupEffect),
          (GroupEffect.prototype.getValue =
            GroupEffect.prototype.iterateDynamicProperties),
          (GroupEffect.prototype.init = function (t, e) {
            var r;
            (this.data = t),
              (this.effectElements = []),
              this.initDynamicPropertyContainer(e);
            var i,
              s = this.data.ef.length,
              a = this.data.ef;
            for (r = 0; r < s; r += 1) {
              switch (((i = null), a[r].ty)) {
                case 0:
                  i = new SliderEffect(a[r], e, this);
                  break;
                case 1:
                  i = new AngleEffect(a[r], e, this);
                  break;
                case 2:
                  i = new ColorEffect(a[r], e, this);
                  break;
                case 3:
                  i = new PointEffect(a[r], e, this);
                  break;
                case 4:
                case 7:
                  i = new CheckboxEffect(a[r], e, this);
                  break;
                case 10:
                  i = new LayerIndexEffect(a[r], e, this);
                  break;
                case 11:
                  i = new MaskIndexEffect(a[r], e, this);
                  break;
                case 5:
                  i = new EffectsManager(a[r], e, this);
                  break;
                default:
                  i = new NoValueEffect(a[r], e, this);
              }
              i && this.effectElements.push(i);
            }
          }),
          (BaseElement.prototype = {
            checkMasks: function () {
              if (!this.data.hasMask) return !1;
              for (var t = 0, e = this.data.masksProperties.length; t < e; ) {
                if (
                  'n' !== this.data.masksProperties[t].mode &&
                  !1 !== this.data.masksProperties[t].cl
                )
                  return !0;
                t += 1;
              }
              return !1;
            },
            initExpressions: function () {
              (this.layerInterface = LayerExpressionInterface(this)),
                this.data.hasMask &&
                  this.maskManager &&
                  this.layerInterface.registerMaskInterface(this.maskManager);
              var t = EffectsExpressionInterface.createEffectsInterface(
                this,
                this.layerInterface
              );
              this.layerInterface.registerEffectsInterface(t),
                0 === this.data.ty || this.data.xt
                  ? (this.compInterface = CompExpressionInterface(this))
                  : 4 === this.data.ty
                  ? ((this.layerInterface.shapeInterface =
                      ShapeExpressionInterface(
                        this.shapesData,
                        this.itemsData,
                        this.layerInterface
                      )),
                    (this.layerInterface.content =
                      this.layerInterface.shapeInterface))
                  : 5 === this.data.ty &&
                    ((this.layerInterface.textInterface =
                      TextExpressionInterface(this)),
                    (this.layerInterface.text =
                      this.layerInterface.textInterface));
            },
            setBlendMode: function () {
              var t = getBlendMode(this.data.bm);
              (this.baseElement || this.layerElement).style['mix-blend-mode'] =
                t;
            },
            initBaseData: function (t, e, r) {
              (this.globalData = e),
                (this.comp = r),
                (this.data = t),
                (this.layerId = createElementID()),
                this.data.sr || (this.data.sr = 1),
                (this.effectsManager = new EffectsManager(
                  this.data,
                  this,
                  this.dynamicProperties
                ));
            },
            getType: function () {
              return this.type;
            },
            sourceRectAtTime: function () {},
          }),
          (FrameElement.prototype = {
            initFrame: function () {
              (this._isFirstFrame = !1),
                (this.dynamicProperties = []),
                (this._mdf = !1);
            },
            prepareProperties: function (t, e) {
              var r,
                i = this.dynamicProperties.length;
              for (r = 0; r < i; r += 1)
                (e ||
                  (this._isParent &&
                    'transform' === this.dynamicProperties[r].propType)) &&
                  (this.dynamicProperties[r].getValue(),
                  this.dynamicProperties[r]._mdf &&
                    ((this.globalData._mdf = !0), (this._mdf = !0)));
            },
            addDynamicProperty: function (t) {
              -1 === this.dynamicProperties.indexOf(t) &&
                this.dynamicProperties.push(t);
            },
          });
        var FootageInterface =
            ((dataInterfaceFactory = function (t) {
              function e(t) {
                return 'Outline' === t ? e.outlineInterface() : null;
              }
              return (
                (e._name = 'Outline'),
                (e.outlineInterface = (function (t) {
                  var e = '',
                    r = t.getFootageData();
                  function i(t) {
                    if (r[t])
                      return (
                        (e = t), 'object' === _typeof$2((r = r[t])) ? i : r
                      );
                    var s = t.indexOf(e);
                    if (-1 !== s) {
                      var a = parseInt(t.substr(s + e.length), 10);
                      return 'object' === _typeof$2((r = r[a])) ? i : r;
                    }
                    return '';
                  }
                  return function () {
                    return (e = ''), (r = t.getFootageData()), i;
                  };
                })(t)),
                e
              );
            }),
            function (t) {
              function e(t) {
                return 'Data' === t ? e.dataInterface : null;
              }
              return (
                (e._name = 'Data'),
                (e.dataInterface = dataInterfaceFactory(t)),
                e
              );
            }),
          dataInterfaceFactory;
        function FootageElement(t, e, r) {
          this.initFrame(),
            this.initRenderable(),
            (this.assetData = e.getAssetData(t.refId)),
            (this.footageData = e.imageLoader.getAsset(this.assetData)),
            this.initBaseData(t, e, r);
        }
        function AudioElement(t, e, r) {
          this.initFrame(),
            this.initRenderable(),
            (this.assetData = e.getAssetData(t.refId)),
            this.initBaseData(t, e, r),
            (this._isPlaying = !1),
            (this._canPlay = !1);
          var i = this.globalData.getAssetsPath(this.assetData);
          (this.audio = this.globalData.audioController.createAudio(i)),
            (this._currentTime = 0),
            this.globalData.audioController.addAudio(this),
            (this._volumeMultiplier = 1),
            (this._volume = 1),
            (this._previousVolume = null),
            (this.tm = t.tm
              ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this)
              : { _placeholder: !0 }),
            (this.lv = PropertyFactory.getProp(
              this,
              t.au && t.au.lv ? t.au.lv : { k: [100] },
              1,
              0.01,
              this
            ));
        }
        function BaseRenderer() {}
        function TransformElement() {}
        function MaskElement(t, e, r) {
          (this.data = t),
            (this.element = e),
            (this.globalData = r),
            (this.storedData = []),
            (this.masksProperties = this.data.masksProperties || []),
            (this.maskElement = null);
          var i,
            s,
            a = this.globalData.defs,
            n = this.masksProperties ? this.masksProperties.length : 0;
          (this.viewData = createSizedArray(n)), (this.solidPath = '');
          var o,
            h,
            l,
            p,
            c,
            f,
            d = this.masksProperties,
            m = 0,
            u = [],
            y = createElementID(),
            g = 'clipPath',
            v = 'clip-path';
          for (i = 0; i < n; i += 1)
            if (
              ((('a' !== d[i].mode && 'n' !== d[i].mode) ||
                d[i].inv ||
                100 !== d[i].o.k ||
                d[i].o.x) &&
                ((g = 'mask'), (v = 'mask')),
              ('s' !== d[i].mode && 'i' !== d[i].mode) || 0 !== m
                ? (l = null)
                : ((l = createNS('rect')).setAttribute('fill', '#ffffff'),
                  l.setAttribute('width', this.element.comp.data.w || 0),
                  l.setAttribute('height', this.element.comp.data.h || 0),
                  u.push(l)),
              (s = createNS('path')),
              'n' === d[i].mode)
            )
              (this.viewData[i] = {
                op: PropertyFactory.getProp(
                  this.element,
                  d[i].o,
                  0,
                  0.01,
                  this.element
                ),
                prop: ShapePropertyFactory.getShapeProp(this.element, d[i], 3),
                elem: s,
                lastPath: '',
              }),
                a.appendChild(s);
            else {
              var b;
              if (
                ((m += 1),
                s.setAttribute(
                  'fill',
                  's' === d[i].mode ? '#000000' : '#ffffff'
                ),
                s.setAttribute('clip-rule', 'nonzero'),
                0 !== d[i].x.k
                  ? ((g = 'mask'),
                    (v = 'mask'),
                    (f = PropertyFactory.getProp(
                      this.element,
                      d[i].x,
                      0,
                      null,
                      this.element
                    )),
                    (b = createElementID()),
                    (p = createNS('filter')).setAttribute('id', b),
                    (c = createNS('feMorphology')).setAttribute(
                      'operator',
                      'erode'
                    ),
                    c.setAttribute('in', 'SourceGraphic'),
                    c.setAttribute('radius', '0'),
                    p.appendChild(c),
                    a.appendChild(p),
                    s.setAttribute(
                      'stroke',
                      's' === d[i].mode ? '#000000' : '#ffffff'
                    ))
                  : ((c = null), (f = null)),
                (this.storedData[i] = {
                  elem: s,
                  x: f,
                  expan: c,
                  lastPath: '',
                  lastOperator: '',
                  filterId: b,
                  lastRadius: 0,
                }),
                'i' === d[i].mode)
              ) {
                h = u.length;
                var _ = createNS('g');
                for (o = 0; o < h; o += 1) _.appendChild(u[o]);
                var P = createNS('mask');
                P.setAttribute('mask-type', 'alpha'),
                  P.setAttribute('id', y + '_' + m),
                  P.appendChild(s),
                  a.appendChild(P),
                  _.setAttribute(
                    'mask',
                    'url(' + getLocationHref() + '#' + y + '_' + m + ')'
                  ),
                  (u.length = 0),
                  u.push(_);
              } else u.push(s);
              d[i].inv &&
                !this.solidPath &&
                (this.solidPath = this.createLayerSolidPath()),
                (this.viewData[i] = {
                  elem: s,
                  lastPath: '',
                  op: PropertyFactory.getProp(
                    this.element,
                    d[i].o,
                    0,
                    0.01,
                    this.element
                  ),
                  prop: ShapePropertyFactory.getShapeProp(
                    this.element,
                    d[i],
                    3
                  ),
                  invRect: l,
                }),
                this.viewData[i].prop.k ||
                  this.drawPath(
                    d[i],
                    this.viewData[i].prop.v,
                    this.viewData[i]
                  );
            }
          for (
            this.maskElement = createNS(g), n = u.length, i = 0;
            i < n;
            i += 1
          )
            this.maskElement.appendChild(u[i]);
          m > 0 &&
            (this.maskElement.setAttribute('id', y),
            this.element.maskedElement.setAttribute(
              v,
              'url(' + getLocationHref() + '#' + y + ')'
            ),
            a.appendChild(this.maskElement)),
            this.viewData.length && this.element.addRenderableComponent(this);
        }
        (FootageElement.prototype.prepareFrame = function () {}),
          extendPrototype(
            [RenderableElement, BaseElement, FrameElement],
            FootageElement
          ),
          (FootageElement.prototype.getBaseElement = function () {
            return null;
          }),
          (FootageElement.prototype.renderFrame = function () {}),
          (FootageElement.prototype.destroy = function () {}),
          (FootageElement.prototype.initExpressions = function () {
            this.layerInterface = FootageInterface(this);
          }),
          (FootageElement.prototype.getFootageData = function () {
            return this.footageData;
          }),
          (AudioElement.prototype.prepareFrame = function (t) {
            if (
              (this.prepareRenderableFrame(t, !0),
              this.prepareProperties(t, !0),
              this.tm._placeholder)
            )
              this._currentTime = t / this.data.sr;
            else {
              var e = this.tm.v;
              this._currentTime = e;
            }
            this._volume = this.lv.v[0];
            var r = this._volume * this._volumeMultiplier;
            this._previousVolume !== r &&
              ((this._previousVolume = r), this.audio.volume(r));
          }),
          extendPrototype(
            [RenderableElement, BaseElement, FrameElement],
            AudioElement
          ),
          (AudioElement.prototype.renderFrame = function () {
            this.isInRange &&
              this._canPlay &&
              (this._isPlaying
                ? (!this.audio.playing() ||
                    Math.abs(
                      this._currentTime / this.globalData.frameRate -
                        this.audio.seek()
                    ) > 0.1) &&
                  this.audio.seek(this._currentTime / this.globalData.frameRate)
                : (this.audio.play(),
                  this.audio.seek(
                    this._currentTime / this.globalData.frameRate
                  ),
                  (this._isPlaying = !0)));
          }),
          (AudioElement.prototype.show = function () {}),
          (AudioElement.prototype.hide = function () {
            this.audio.pause(), (this._isPlaying = !1);
          }),
          (AudioElement.prototype.pause = function () {
            this.audio.pause(), (this._isPlaying = !1), (this._canPlay = !1);
          }),
          (AudioElement.prototype.resume = function () {
            this._canPlay = !0;
          }),
          (AudioElement.prototype.setRate = function (t) {
            this.audio.rate(t);
          }),
          (AudioElement.prototype.volume = function (t) {
            (this._volumeMultiplier = t),
              (this._previousVolume = t * this._volume),
              this.audio.volume(this._previousVolume);
          }),
          (AudioElement.prototype.getBaseElement = function () {
            return null;
          }),
          (AudioElement.prototype.destroy = function () {}),
          (AudioElement.prototype.sourceRectAtTime = function () {}),
          (AudioElement.prototype.initExpressions = function () {}),
          (BaseRenderer.prototype.checkLayers = function (t) {
            var e,
              r,
              i = this.layers.length;
            for (this.completeLayers = !0, e = i - 1; e >= 0; e -= 1)
              this.elements[e] ||
                ((r = this.layers[e]).ip - r.st <= t - this.layers[e].st &&
                  r.op - r.st > t - this.layers[e].st &&
                  this.buildItem(e)),
                (this.completeLayers =
                  !!this.elements[e] && this.completeLayers);
            this.checkPendingElements();
          }),
          (BaseRenderer.prototype.createItem = function (t) {
            switch (t.ty) {
              case 2:
                return this.createImage(t);
              case 0:
                return this.createComp(t);
              case 1:
                return this.createSolid(t);
              case 3:
              default:
                return this.createNull(t);
              case 4:
                return this.createShape(t);
              case 5:
                return this.createText(t);
              case 6:
                return this.createAudio(t);
              case 13:
                return this.createCamera(t);
              case 15:
                return this.createFootage(t);
            }
          }),
          (BaseRenderer.prototype.createCamera = function () {
            throw new Error("You're using a 3d camera. Try the html renderer.");
          }),
          (BaseRenderer.prototype.createAudio = function (t) {
            return new AudioElement(t, this.globalData, this);
          }),
          (BaseRenderer.prototype.createFootage = function (t) {
            return new FootageElement(t, this.globalData, this);
          }),
          (BaseRenderer.prototype.buildAllItems = function () {
            var t,
              e = this.layers.length;
            for (t = 0; t < e; t += 1) this.buildItem(t);
            this.checkPendingElements();
          }),
          (BaseRenderer.prototype.includeLayers = function (t) {
            var e;
            this.completeLayers = !1;
            var r,
              i = t.length,
              s = this.layers.length;
            for (e = 0; e < i; e += 1)
              for (r = 0; r < s; ) {
                if (this.layers[r].id === t[e].id) {
                  this.layers[r] = t[e];
                  break;
                }
                r += 1;
              }
          }),
          (BaseRenderer.prototype.setProjectInterface = function (t) {
            this.globalData.projectInterface = t;
          }),
          (BaseRenderer.prototype.initItems = function () {
            this.globalData.progressiveLoad || this.buildAllItems();
          }),
          (BaseRenderer.prototype.buildElementParenting = function (t, e, r) {
            for (
              var i = this.elements, s = this.layers, a = 0, n = s.length;
              a < n;

            )
              s[a].ind == e &&
                (i[a] && !0 !== i[a]
                  ? (r.push(i[a]),
                    i[a].setAsParent(),
                    void 0 !== s[a].parent
                      ? this.buildElementParenting(t, s[a].parent, r)
                      : t.setHierarchy(r))
                  : (this.buildItem(a), this.addPendingElement(t))),
                (a += 1);
          }),
          (BaseRenderer.prototype.addPendingElement = function (t) {
            this.pendingElements.push(t);
          }),
          (BaseRenderer.prototype.searchExtraCompositions = function (t) {
            var e,
              r = t.length;
            for (e = 0; e < r; e += 1)
              if (t[e].xt) {
                var i = this.createComp(t[e]);
                i.initExpressions(),
                  this.globalData.projectInterface.registerComposition(i);
              }
          }),
          (BaseRenderer.prototype.getElementByPath = function (t) {
            var e,
              r = t.shift();
            if ('number' == typeof r) e = this.elements[r];
            else {
              var i,
                s = this.elements.length;
              for (i = 0; i < s; i += 1)
                if (this.elements[i].data.nm === r) {
                  e = this.elements[i];
                  break;
                }
            }
            return 0 === t.length ? e : e.getElementByPath(t);
          }),
          (BaseRenderer.prototype.setupGlobalData = function (t, e) {
            (this.globalData.fontManager = new FontManager()),
              this.globalData.fontManager.addChars(t.chars),
              this.globalData.fontManager.addFonts(t.fonts, e),
              (this.globalData.getAssetData =
                this.animationItem.getAssetData.bind(this.animationItem)),
              (this.globalData.getAssetsPath =
                this.animationItem.getAssetsPath.bind(this.animationItem)),
              (this.globalData.imageLoader = this.animationItem.imagePreloader),
              (this.globalData.audioController =
                this.animationItem.audioController),
              (this.globalData.frameId = 0),
              (this.globalData.frameRate = t.fr),
              (this.globalData.nm = t.nm),
              (this.globalData.compSize = { w: t.w, h: t.h });
          }),
          (TransformElement.prototype = {
            initTransform: function () {
              (this.finalTransform = {
                mProp: this.data.ks
                  ? TransformPropertyFactory.getTransformProperty(
                      this,
                      this.data.ks,
                      this
                    )
                  : { o: 0 },
                _matMdf: !1,
                _opMdf: !1,
                mat: new Matrix(),
              }),
                this.data.ao && (this.finalTransform.mProp.autoOriented = !0),
                this.data.ty;
            },
            renderTransform: function () {
              if (
                ((this.finalTransform._opMdf =
                  this.finalTransform.mProp.o._mdf || this._isFirstFrame),
                (this.finalTransform._matMdf =
                  this.finalTransform.mProp._mdf || this._isFirstFrame),
                this.hierarchy)
              ) {
                var t,
                  e = this.finalTransform.mat,
                  r = 0,
                  i = this.hierarchy.length;
                if (!this.finalTransform._matMdf)
                  for (; r < i; ) {
                    if (this.hierarchy[r].finalTransform.mProp._mdf) {
                      this.finalTransform._matMdf = !0;
                      break;
                    }
                    r += 1;
                  }
                if (this.finalTransform._matMdf)
                  for (
                    t = this.finalTransform.mProp.v.props,
                      e.cloneFromProps(t),
                      r = 0;
                    r < i;
                    r += 1
                  )
                    (t = this.hierarchy[r].finalTransform.mProp.v.props),
                      e.transform(
                        t[0],
                        t[1],
                        t[2],
                        t[3],
                        t[4],
                        t[5],
                        t[6],
                        t[7],
                        t[8],
                        t[9],
                        t[10],
                        t[11],
                        t[12],
                        t[13],
                        t[14],
                        t[15]
                      );
              }
            },
            globalToLocal: function (t) {
              var e = [];
              e.push(this.finalTransform);
              for (var r, i = !0, s = this.comp; i; )
                s.finalTransform
                  ? (s.data.hasMask && e.splice(0, 0, s.finalTransform),
                    (s = s.comp))
                  : (i = !1);
              var a,
                n = e.length;
              for (r = 0; r < n; r += 1)
                (a = e[r].mat.applyToPointArray(0, 0, 0)),
                  (t = [t[0] - a[0], t[1] - a[1], 0]);
              return t;
            },
            mHelper: new Matrix(),
          }),
          (MaskElement.prototype.getMaskProperty = function (t) {
            return this.viewData[t].prop;
          }),
          (MaskElement.prototype.renderFrame = function (t) {
            var e,
              r = this.element.finalTransform.mat,
              i = this.masksProperties.length;
            for (e = 0; e < i; e += 1)
              if (
                ((this.viewData[e].prop._mdf || t) &&
                  this.drawPath(
                    this.masksProperties[e],
                    this.viewData[e].prop.v,
                    this.viewData[e]
                  ),
                (this.viewData[e].op._mdf || t) &&
                  this.viewData[e].elem.setAttribute(
                    'fill-opacity',
                    this.viewData[e].op.v
                  ),
                'n' !== this.masksProperties[e].mode &&
                  (this.viewData[e].invRect &&
                    (this.element.finalTransform.mProp._mdf || t) &&
                    this.viewData[e].invRect.setAttribute(
                      'transform',
                      r.getInverseMatrix().to2dCSS()
                    ),
                  this.storedData[e].x && (this.storedData[e].x._mdf || t)))
              ) {
                var s = this.storedData[e].expan;
                this.storedData[e].x.v < 0
                  ? ('erode' !== this.storedData[e].lastOperator &&
                      ((this.storedData[e].lastOperator = 'erode'),
                      this.storedData[e].elem.setAttribute(
                        'filter',
                        'url(' +
                          getLocationHref() +
                          '#' +
                          this.storedData[e].filterId +
                          ')'
                      )),
                    s.setAttribute('radius', -this.storedData[e].x.v))
                  : ('dilate' !== this.storedData[e].lastOperator &&
                      ((this.storedData[e].lastOperator = 'dilate'),
                      this.storedData[e].elem.setAttribute('filter', null)),
                    this.storedData[e].elem.setAttribute(
                      'stroke-width',
                      2 * this.storedData[e].x.v
                    ));
              }
          }),
          (MaskElement.prototype.getMaskelement = function () {
            return this.maskElement;
          }),
          (MaskElement.prototype.createLayerSolidPath = function () {
            var t = 'M0,0 ';
            return (
              (t += ' h' + this.globalData.compSize.w),
              (t += ' v' + this.globalData.compSize.h),
              (t += ' h-' + this.globalData.compSize.w),
              (t += ' v-' + this.globalData.compSize.h + ' ')
            );
          }),
          (MaskElement.prototype.drawPath = function (t, e, r) {
            var i,
              s,
              a = ' M' + e.v[0][0] + ',' + e.v[0][1];
            for (s = e._length, i = 1; i < s; i += 1)
              a +=
                ' C' +
                e.o[i - 1][0] +
                ',' +
                e.o[i - 1][1] +
                ' ' +
                e.i[i][0] +
                ',' +
                e.i[i][1] +
                ' ' +
                e.v[i][0] +
                ',' +
                e.v[i][1];
            if (
              (e.c &&
                s > 1 &&
                (a +=
                  ' C' +
                  e.o[i - 1][0] +
                  ',' +
                  e.o[i - 1][1] +
                  ' ' +
                  e.i[0][0] +
                  ',' +
                  e.i[0][1] +
                  ' ' +
                  e.v[0][0] +
                  ',' +
                  e.v[0][1]),
              r.lastPath !== a)
            ) {
              var n = '';
              r.elem &&
                (e.c && (n = t.inv ? this.solidPath + a : a),
                r.elem.setAttribute('d', n)),
                (r.lastPath = a);
            }
          }),
          (MaskElement.prototype.destroy = function () {
            (this.element = null),
              (this.globalData = null),
              (this.maskElement = null),
              (this.data = null),
              (this.masksProperties = null);
          });
        var filtersFactory = (function () {
            var t = {
              createFilter: function (t, e) {
                var r = createNS('filter');
                return (
                  r.setAttribute('id', t),
                  !0 !== e &&
                    (r.setAttribute('filterUnits', 'objectBoundingBox'),
                    r.setAttribute('x', '0%'),
                    r.setAttribute('y', '0%'),
                    r.setAttribute('width', '100%'),
                    r.setAttribute('height', '100%')),
                  r
                );
              },
              createAlphaToLuminanceFilter: function () {
                var t = createNS('feColorMatrix');
                return (
                  t.setAttribute('type', 'matrix'),
                  t.setAttribute('color-interpolation-filters', 'sRGB'),
                  t.setAttribute(
                    'values',
                    '0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1'
                  ),
                  t
                );
              },
            };
            return t;
          })(),
          featureSupport = (function () {
            var t = { maskType: !0 };
            return (
              (/MSIE 10/i.test(navigator.userAgent) ||
                /MSIE 9/i.test(navigator.userAgent) ||
                /rv:11.0/i.test(navigator.userAgent) ||
                /Edge\/\d./i.test(navigator.userAgent)) &&
                (t.maskType = !1),
              t
            );
          })(),
          registeredEffects = {},
          idPrefix = 'filter_result_';
        function SVGEffects(t) {
          var e,
            r,
            i = 'SourceGraphic',
            s = t.data.ef ? t.data.ef.length : 0,
            a = createElementID(),
            n = filtersFactory.createFilter(a, !0),
            o = 0;
          for (this.filters = [], e = 0; e < s; e += 1) {
            r = null;
            var h = t.data.ef[e].ty;
            registeredEffects[h] &&
              ((r = new (0, registeredEffects[h].effect)(
                n,
                t.effectsManager.effectElements[e],
                t,
                idPrefix + o,
                i
              )),
              (i = idPrefix + o),
              registeredEffects[h].countsAsEffect && (o += 1)),
              r && this.filters.push(r);
          }
          o &&
            (t.globalData.defs.appendChild(n),
            t.layerElement.setAttribute(
              'filter',
              'url(' + getLocationHref() + '#' + a + ')'
            )),
            this.filters.length && t.addRenderableComponent(this);
        }
        function registerEffect(t, e, r) {
          registeredEffects[t] = { effect: e, countsAsEffect: r };
        }
        function SVGBaseElement() {}
        function HierarchyElement() {}
        function RenderableDOMElement() {}
        function IImageElement(t, e, r) {
          (this.assetData = e.getAssetData(t.refId)),
            this.initElement(t, e, r),
            (this.sourceRect = {
              top: 0,
              left: 0,
              width: this.assetData.w,
              height: this.assetData.h,
            });
        }
        function ProcessedElement(t, e) {
          (this.elem = t), (this.pos = e);
        }
        function IShapeElement() {}
        (SVGEffects.prototype.renderFrame = function (t) {
          var e,
            r = this.filters.length;
          for (e = 0; e < r; e += 1) this.filters[e].renderFrame(t);
        }),
          (SVGBaseElement.prototype = {
            initRendererElement: function () {
              this.layerElement = createNS('g');
            },
            createContainerElements: function () {
              (this.matteElement = createNS('g')),
                (this.transformedElement = this.layerElement),
                (this.maskedElement = this.layerElement),
                (this._sizeChanged = !1);
              var t,
                e,
                r,
                i = null;
              if (this.data.td) {
                if (3 == this.data.td || 1 == this.data.td) {
                  var s = createNS('mask');
                  s.setAttribute('id', this.layerId),
                    s.setAttribute(
                      'mask-type',
                      3 == this.data.td ? 'luminance' : 'alpha'
                    ),
                    s.appendChild(this.layerElement),
                    (i = s),
                    this.globalData.defs.appendChild(s),
                    featureSupport.maskType ||
                      1 != this.data.td ||
                      (s.setAttribute('mask-type', 'luminance'),
                      (t = createElementID()),
                      (e = filtersFactory.createFilter(t)),
                      this.globalData.defs.appendChild(e),
                      e.appendChild(
                        filtersFactory.createAlphaToLuminanceFilter()
                      ),
                      (r = createNS('g')).appendChild(this.layerElement),
                      (i = r),
                      s.appendChild(r),
                      r.setAttribute(
                        'filter',
                        'url(' + getLocationHref() + '#' + t + ')'
                      ));
                } else if (2 == this.data.td) {
                  var a = createNS('mask');
                  a.setAttribute('id', this.layerId),
                    a.setAttribute('mask-type', 'alpha');
                  var n = createNS('g');
                  a.appendChild(n),
                    (t = createElementID()),
                    (e = filtersFactory.createFilter(t));
                  var o = createNS('feComponentTransfer');
                  o.setAttribute('in', 'SourceGraphic'), e.appendChild(o);
                  var h = createNS('feFuncA');
                  h.setAttribute('type', 'table'),
                    h.setAttribute('tableValues', '1.0 0.0'),
                    o.appendChild(h),
                    this.globalData.defs.appendChild(e);
                  var l = createNS('rect');
                  l.setAttribute('width', this.comp.data.w),
                    l.setAttribute('height', this.comp.data.h),
                    l.setAttribute('x', '0'),
                    l.setAttribute('y', '0'),
                    l.setAttribute('fill', '#ffffff'),
                    l.setAttribute('opacity', '0'),
                    n.setAttribute(
                      'filter',
                      'url(' + getLocationHref() + '#' + t + ')'
                    ),
                    n.appendChild(l),
                    n.appendChild(this.layerElement),
                    (i = n),
                    featureSupport.maskType ||
                      (a.setAttribute('mask-type', 'luminance'),
                      e.appendChild(
                        filtersFactory.createAlphaToLuminanceFilter()
                      ),
                      (r = createNS('g')),
                      n.appendChild(l),
                      r.appendChild(this.layerElement),
                      (i = r),
                      n.appendChild(r)),
                    this.globalData.defs.appendChild(a);
                }
              } else
                this.data.tt
                  ? (this.matteElement.appendChild(this.layerElement),
                    (i = this.matteElement),
                    (this.baseElement = this.matteElement))
                  : (this.baseElement = this.layerElement);
              if (
                (this.data.ln &&
                  this.layerElement.setAttribute('id', this.data.ln),
                this.data.cl &&
                  this.layerElement.setAttribute('class', this.data.cl),
                0 === this.data.ty && !this.data.hd)
              ) {
                var p = createNS('clipPath'),
                  c = createNS('path');
                c.setAttribute(
                  'd',
                  'M0,0 L' +
                    this.data.w +
                    ',0 L' +
                    this.data.w +
                    ',' +
                    this.data.h +
                    ' L0,' +
                    this.data.h +
                    'z'
                );
                var f = createElementID();
                if (
                  (p.setAttribute('id', f),
                  p.appendChild(c),
                  this.globalData.defs.appendChild(p),
                  this.checkMasks())
                ) {
                  var d = createNS('g');
                  d.setAttribute(
                    'clip-path',
                    'url(' + getLocationHref() + '#' + f + ')'
                  ),
                    d.appendChild(this.layerElement),
                    (this.transformedElement = d),
                    i
                      ? i.appendChild(this.transformedElement)
                      : (this.baseElement = this.transformedElement);
                } else
                  this.layerElement.setAttribute(
                    'clip-path',
                    'url(' + getLocationHref() + '#' + f + ')'
                  );
              }
              0 !== this.data.bm && this.setBlendMode();
            },
            renderElement: function () {
              this.finalTransform._matMdf &&
                this.transformedElement.setAttribute(
                  'transform',
                  this.finalTransform.mat.to2dCSS()
                ),
                this.finalTransform._opMdf &&
                  this.transformedElement.setAttribute(
                    'opacity',
                    this.finalTransform.mProp.o.v
                  );
            },
            destroyBaseElement: function () {
              (this.layerElement = null),
                (this.matteElement = null),
                this.maskManager.destroy();
            },
            getBaseElement: function () {
              return this.data.hd ? null : this.baseElement;
            },
            createRenderableComponents: function () {
              (this.maskManager = new MaskElement(
                this.data,
                this,
                this.globalData
              )),
                (this.renderableEffectsManager = new SVGEffects(this));
            },
            setMatte: function (t) {
              this.matteElement &&
                this.matteElement.setAttribute(
                  'mask',
                  'url(' + getLocationHref() + '#' + t + ')'
                );
            },
          }),
          (HierarchyElement.prototype = {
            initHierarchy: function () {
              (this.hierarchy = []),
                (this._isParent = !1),
                this.checkParenting();
            },
            setHierarchy: function (t) {
              this.hierarchy = t;
            },
            setAsParent: function () {
              this._isParent = !0;
            },
            checkParenting: function () {
              void 0 !== this.data.parent &&
                this.comp.buildElementParenting(this, this.data.parent, []);
            },
          }),
          extendPrototype(
            [
              RenderableElement,
              createProxyFunction({
                initElement: function (t, e, r) {
                  this.initFrame(),
                    this.initBaseData(t, e, r),
                    this.initTransform(t, e, r),
                    this.initHierarchy(),
                    this.initRenderable(),
                    this.initRendererElement(),
                    this.createContainerElements(),
                    this.createRenderableComponents(),
                    this.createContent(),
                    this.hide();
                },
                hide: function () {
                  this.hidden ||
                    (this.isInRange && !this.isTransparent) ||
                    (((this.baseElement || this.layerElement).style.display =
                      'none'),
                    (this.hidden = !0));
                },
                show: function () {
                  this.isInRange &&
                    !this.isTransparent &&
                    (this.data.hd ||
                      ((this.baseElement || this.layerElement).style.display =
                        'block'),
                    (this.hidden = !1),
                    (this._isFirstFrame = !0));
                },
                renderFrame: function () {
                  this.data.hd ||
                    this.hidden ||
                    (this.renderTransform(),
                    this.renderRenderable(),
                    this.renderElement(),
                    this.renderInnerContent(),
                    this._isFirstFrame && (this._isFirstFrame = !1));
                },
                renderInnerContent: function () {},
                prepareFrame: function (t) {
                  (this._mdf = !1),
                    this.prepareRenderableFrame(t),
                    this.prepareProperties(t, this.isInRange),
                    this.checkTransparency();
                },
                destroy: function () {
                  (this.innerElem = null), this.destroyBaseElement();
                },
              }),
            ],
            RenderableDOMElement
          ),
          extendPrototype(
            [
              BaseElement,
              TransformElement,
              SVGBaseElement,
              HierarchyElement,
              FrameElement,
              RenderableDOMElement,
            ],
            IImageElement
          ),
          (IImageElement.prototype.createContent = function () {
            var t = this.globalData.getAssetsPath(this.assetData);
            (this.innerElem = createNS('image')),
              this.innerElem.setAttribute('width', this.assetData.w + 'px'),
              this.innerElem.setAttribute('height', this.assetData.h + 'px'),
              this.innerElem.setAttribute(
                'preserveAspectRatio',
                this.assetData.pr ||
                  this.globalData.renderConfig.imagePreserveAspectRatio
              ),
              this.innerElem.setAttributeNS(
                'http://www.w3.org/1999/xlink',
                'href',
                t
              ),
              this.layerElement.appendChild(this.innerElem);
          }),
          (IImageElement.prototype.sourceRectAtTime = function () {
            return this.sourceRect;
          }),
          (IShapeElement.prototype = {
            addShapeToModifiers: function (t) {
              var e,
                r = this.shapeModifiers.length;
              for (e = 0; e < r; e += 1) this.shapeModifiers[e].addShape(t);
            },
            isShapeInAnimatedModifiers: function (t) {
              for (var e = this.shapeModifiers.length; 0 < e; )
                if (this.shapeModifiers[0].isAnimatedWithShape(t)) return !0;
              return !1;
            },
            renderModifiers: function () {
              if (this.shapeModifiers.length) {
                var t,
                  e = this.shapes.length;
                for (t = 0; t < e; t += 1) this.shapes[t].sh.reset();
                for (
                  t = (e = this.shapeModifiers.length) - 1;
                  t >= 0 &&
                  !this.shapeModifiers[t].processShapes(this._isFirstFrame);
                  t -= 1
                );
              }
            },
            searchProcessedElement: function (t) {
              for (
                var e = this.processedElements, r = 0, i = e.length;
                r < i;

              ) {
                if (e[r].elem === t) return e[r].pos;
                r += 1;
              }
              return 0;
            },
            addProcessedElement: function (t, e) {
              for (var r = this.processedElements, i = r.length; i; )
                if (r[(i -= 1)].elem === t) return void (r[i].pos = e);
              r.push(new ProcessedElement(t, e));
            },
            prepareFrame: function (t) {
              this.prepareRenderableFrame(t),
                this.prepareProperties(t, this.isInRange);
            },
          });
        var lineCapEnum = { 1: 'butt', 2: 'round', 3: 'square' },
          lineJoinEnum = { 1: 'miter', 2: 'round', 3: 'bevel' };
        function SVGShapeData(t, e, r) {
          (this.caches = []),
            (this.styles = []),
            (this.transformers = t),
            (this.lStr = ''),
            (this.sh = r),
            (this.lvl = e),
            (this._isAnimated = !!r.k);
          for (var i = 0, s = t.length; i < s; ) {
            if (t[i].mProps.dynamicProperties.length) {
              this._isAnimated = !0;
              break;
            }
            i += 1;
          }
        }
        function SVGStyleData(t, e) {
          (this.data = t),
            (this.type = t.ty),
            (this.d = ''),
            (this.lvl = e),
            (this._mdf = !1),
            (this.closed = !0 === t.hd),
            (this.pElem = createNS('path')),
            (this.msElem = null);
        }
        function DashProperty(t, e, r, i) {
          var s;
          (this.elem = t),
            (this.frameId = -1),
            (this.dataProps = createSizedArray(e.length)),
            (this.renderer = r),
            (this.k = !1),
            (this.dashStr = ''),
            (this.dashArray = createTypedArray(
              'float32',
              e.length ? e.length - 1 : 0
            )),
            (this.dashoffset = createTypedArray('float32', 1)),
            this.initDynamicPropertyContainer(i);
          var a,
            n = e.length || 0;
          for (s = 0; s < n; s += 1)
            (a = PropertyFactory.getProp(t, e[s].v, 0, 0, this)),
              (this.k = a.k || this.k),
              (this.dataProps[s] = { n: e[s].n, p: a });
          this.k || this.getValue(!0), (this._isAnimated = this.k);
        }
        function SVGStrokeStyleData(t, e, r) {
          this.initDynamicPropertyContainer(t),
            (this.getValue = this.iterateDynamicProperties),
            (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, this)),
            (this.w = PropertyFactory.getProp(t, e.w, 0, null, this)),
            (this.d = new DashProperty(t, e.d || {}, 'svg', this)),
            (this.c = PropertyFactory.getProp(t, e.c, 1, 255, this)),
            (this.style = r),
            (this._isAnimated = !!this._isAnimated);
        }
        function SVGFillStyleData(t, e, r) {
          this.initDynamicPropertyContainer(t),
            (this.getValue = this.iterateDynamicProperties),
            (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, this)),
            (this.c = PropertyFactory.getProp(t, e.c, 1, 255, this)),
            (this.style = r);
        }
        function SVGNoStyleData(t, e, r) {
          this.initDynamicPropertyContainer(t),
            (this.getValue = this.iterateDynamicProperties),
            (this.style = r);
        }
        function GradientProperty(t, e, r) {
          (this.data = e), (this.c = createTypedArray('uint8c', 4 * e.p));
          var i = e.k.k[0].s
            ? e.k.k[0].s.length - 4 * e.p
            : e.k.k.length - 4 * e.p;
          (this.o = createTypedArray('float32', i)),
            (this._cmdf = !1),
            (this._omdf = !1),
            (this._collapsable = this.checkCollapsable()),
            (this._hasOpacity = i),
            this.initDynamicPropertyContainer(r),
            (this.prop = PropertyFactory.getProp(t, e.k, 1, null, this)),
            (this.k = this.prop.k),
            this.getValue(!0);
        }
        function SVGGradientFillStyleData(t, e, r) {
          this.initDynamicPropertyContainer(t),
            (this.getValue = this.iterateDynamicProperties),
            this.initGradientData(t, e, r);
        }
        function SVGGradientStrokeStyleData(t, e, r) {
          this.initDynamicPropertyContainer(t),
            (this.getValue = this.iterateDynamicProperties),
            (this.w = PropertyFactory.getProp(t, e.w, 0, null, this)),
            (this.d = new DashProperty(t, e.d || {}, 'svg', this)),
            this.initGradientData(t, e, r),
            (this._isAnimated = !!this._isAnimated);
        }
        function ShapeGroupData() {
          (this.it = []), (this.prevViewData = []), (this.gr = createNS('g'));
        }
        function SVGTransformData(t, e, r) {
          (this.transform = { mProps: t, op: e, container: r }),
            (this.elements = []),
            (this._isAnimated =
              this.transform.mProps.dynamicProperties.length ||
              this.transform.op.effectsSequence.length);
        }
        (SVGShapeData.prototype.setAsAnimated = function () {
          this._isAnimated = !0;
        }),
          (SVGStyleData.prototype.reset = function () {
            (this.d = ''), (this._mdf = !1);
          }),
          (DashProperty.prototype.getValue = function (t) {
            if (
              (this.elem.globalData.frameId !== this.frameId || t) &&
              ((this.frameId = this.elem.globalData.frameId),
              this.iterateDynamicProperties(),
              (this._mdf = this._mdf || t),
              this._mdf)
            ) {
              var e = 0,
                r = this.dataProps.length;
              for (
                'svg' === this.renderer && (this.dashStr = ''), e = 0;
                e < r;
                e += 1
              )
                'o' !== this.dataProps[e].n
                  ? 'svg' === this.renderer
                    ? (this.dashStr += ' ' + this.dataProps[e].p.v)
                    : (this.dashArray[e] = this.dataProps[e].p.v)
                  : (this.dashoffset[0] = this.dataProps[e].p.v);
            }
          }),
          extendPrototype([DynamicPropertyContainer], DashProperty),
          extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData),
          extendPrototype([DynamicPropertyContainer], SVGFillStyleData),
          extendPrototype([DynamicPropertyContainer], SVGNoStyleData),
          (GradientProperty.prototype.comparePoints = function (t, e) {
            for (var r = 0, i = this.o.length / 2; r < i; ) {
              if (Math.abs(t[4 * r] - t[4 * e + 2 * r]) > 0.01) return !1;
              r += 1;
            }
            return !0;
          }),
          (GradientProperty.prototype.checkCollapsable = function () {
            if (this.o.length / 2 != this.c.length / 4) return !1;
            if (this.data.k.k[0].s)
              for (var t = 0, e = this.data.k.k.length; t < e; ) {
                if (!this.comparePoints(this.data.k.k[t].s, this.data.p))
                  return !1;
                t += 1;
              }
            else if (!this.comparePoints(this.data.k.k, this.data.p)) return !1;
            return !0;
          }),
          (GradientProperty.prototype.getValue = function (t) {
            if (
              (this.prop.getValue(),
              (this._mdf = !1),
              (this._cmdf = !1),
              (this._omdf = !1),
              this.prop._mdf || t)
            ) {
              var e,
                r,
                i,
                s = 4 * this.data.p;
              for (e = 0; e < s; e += 1)
                (r = e % 4 == 0 ? 100 : 255),
                  (i = Math.round(this.prop.v[e] * r)),
                  this.c[e] !== i && ((this.c[e] = i), (this._cmdf = !t));
              if (this.o.length)
                for (s = this.prop.v.length, e = 4 * this.data.p; e < s; e += 1)
                  (r = e % 2 == 0 ? 100 : 1),
                    (i =
                      e % 2 == 0
                        ? Math.round(100 * this.prop.v[e])
                        : this.prop.v[e]),
                    this.o[e - 4 * this.data.p] !== i &&
                      ((this.o[e - 4 * this.data.p] = i), (this._omdf = !t));
              this._mdf = !t;
            }
          }),
          extendPrototype([DynamicPropertyContainer], GradientProperty),
          (SVGGradientFillStyleData.prototype.initGradientData = function (
            t,
            e,
            r
          ) {
            (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, this)),
              (this.s = PropertyFactory.getProp(t, e.s, 1, null, this)),
              (this.e = PropertyFactory.getProp(t, e.e, 1, null, this)),
              (this.h = PropertyFactory.getProp(
                t,
                e.h || { k: 0 },
                0,
                0.01,
                this
              )),
              (this.a = PropertyFactory.getProp(
                t,
                e.a || { k: 0 },
                0,
                degToRads,
                this
              )),
              (this.g = new GradientProperty(t, e.g, this)),
              (this.style = r),
              (this.stops = []),
              this.setGradientData(r.pElem, e),
              this.setGradientOpacity(e, r),
              (this._isAnimated = !!this._isAnimated);
          }),
          (SVGGradientFillStyleData.prototype.setGradientData = function (
            t,
            e
          ) {
            var r = createElementID(),
              i = createNS(1 === e.t ? 'linearGradient' : 'radialGradient');
            i.setAttribute('id', r),
              i.setAttribute('spreadMethod', 'pad'),
              i.setAttribute('gradientUnits', 'userSpaceOnUse');
            var s,
              a,
              n,
              o = [];
            for (n = 4 * e.g.p, a = 0; a < n; a += 4)
              (s = createNS('stop')), i.appendChild(s), o.push(s);
            t.setAttribute(
              'gf' === e.ty ? 'fill' : 'stroke',
              'url(' + getLocationHref() + '#' + r + ')'
            ),
              (this.gf = i),
              (this.cst = o);
          }),
          (SVGGradientFillStyleData.prototype.setGradientOpacity = function (
            t,
            e
          ) {
            if (this.g._hasOpacity && !this.g._collapsable) {
              var r,
                i,
                s,
                a = createNS('mask'),
                n = createNS('path');
              a.appendChild(n);
              var o = createElementID(),
                h = createElementID();
              a.setAttribute('id', h);
              var l = createNS(1 === t.t ? 'linearGradient' : 'radialGradient');
              l.setAttribute('id', o),
                l.setAttribute('spreadMethod', 'pad'),
                l.setAttribute('gradientUnits', 'userSpaceOnUse'),
                (s = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length);
              var p = this.stops;
              for (i = 4 * t.g.p; i < s; i += 2)
                (r = createNS('stop')).setAttribute(
                  'stop-color',
                  'rgb(255,255,255)'
                ),
                  l.appendChild(r),
                  p.push(r);
              n.setAttribute(
                'gf' === t.ty ? 'fill' : 'stroke',
                'url(' + getLocationHref() + '#' + o + ')'
              ),
                'gs' === t.ty &&
                  (n.setAttribute('stroke-linecap', lineCapEnum[t.lc || 2]),
                  n.setAttribute('stroke-linejoin', lineJoinEnum[t.lj || 2]),
                  1 === t.lj && n.setAttribute('stroke-miterlimit', t.ml)),
                (this.of = l),
                (this.ms = a),
                (this.ost = p),
                (this.maskId = h),
                (e.msElem = n);
            }
          }),
          extendPrototype([DynamicPropertyContainer], SVGGradientFillStyleData),
          extendPrototype(
            [SVGGradientFillStyleData, DynamicPropertyContainer],
            SVGGradientStrokeStyleData
          );
        var buildShapeString = function (t, e, r, i) {
            if (0 === e) return '';
            var s,
              a = t.o,
              n = t.i,
              o = t.v,
              h = ' M' + i.applyToPointStringified(o[0][0], o[0][1]);
            for (s = 1; s < e; s += 1)
              h +=
                ' C' +
                i.applyToPointStringified(a[s - 1][0], a[s - 1][1]) +
                ' ' +
                i.applyToPointStringified(n[s][0], n[s][1]) +
                ' ' +
                i.applyToPointStringified(o[s][0], o[s][1]);
            return (
              r &&
                e &&
                ((h +=
                  ' C' +
                  i.applyToPointStringified(a[s - 1][0], a[s - 1][1]) +
                  ' ' +
                  i.applyToPointStringified(n[0][0], n[0][1]) +
                  ' ' +
                  i.applyToPointStringified(o[0][0], o[0][1])),
                (h += 'z')),
              h
            );
          },
          SVGElementsRenderer = (function () {
            var t = new Matrix(),
              e = new Matrix();
            function r(t, e, r) {
              (r || e.transform.op._mdf) &&
                e.transform.container.setAttribute('opacity', e.transform.op.v),
                (r || e.transform.mProps._mdf) &&
                  e.transform.container.setAttribute(
                    'transform',
                    e.transform.mProps.v.to2dCSS()
                  );
            }
            function i() {}
            function s(r, i, s) {
              var a,
                n,
                o,
                h,
                l,
                p,
                c,
                f,
                d,
                m,
                u,
                y = i.styles.length,
                g = i.lvl;
              for (p = 0; p < y; p += 1) {
                if (((h = i.sh._mdf || s), i.styles[p].lvl < g)) {
                  for (
                    f = e.reset(),
                      m = g - i.styles[p].lvl,
                      u = i.transformers.length - 1;
                    !h && m > 0;

                  )
                    (h = i.transformers[u].mProps._mdf || h),
                      (m -= 1),
                      (u -= 1);
                  if (h)
                    for (
                      m = g - i.styles[p].lvl, u = i.transformers.length - 1;
                      m > 0;

                    )
                      (d = i.transformers[u].mProps.v.props),
                        f.transform(
                          d[0],
                          d[1],
                          d[2],
                          d[3],
                          d[4],
                          d[5],
                          d[6],
                          d[7],
                          d[8],
                          d[9],
                          d[10],
                          d[11],
                          d[12],
                          d[13],
                          d[14],
                          d[15]
                        ),
                        (m -= 1),
                        (u -= 1);
                } else f = t;
                if (((n = (c = i.sh.paths)._length), h)) {
                  for (o = '', a = 0; a < n; a += 1)
                    (l = c.shapes[a]) &&
                      l._length &&
                      (o += buildShapeString(l, l._length, l.c, f));
                  i.caches[p] = o;
                } else o = i.caches[p];
                (i.styles[p].d += !0 === r.hd ? '' : o),
                  (i.styles[p]._mdf = h || i.styles[p]._mdf);
              }
            }
            function a(t, e, r) {
              var i = e.style;
              (e.c._mdf || r) &&
                i.pElem.setAttribute(
                  'fill',
                  'rgb(' +
                    bmFloor(e.c.v[0]) +
                    ',' +
                    bmFloor(e.c.v[1]) +
                    ',' +
                    bmFloor(e.c.v[2]) +
                    ')'
                ),
                (e.o._mdf || r) && i.pElem.setAttribute('fill-opacity', e.o.v);
            }
            function n(t, e, r) {
              o(t, e, r), h(0, e, r);
            }
            function o(t, e, r) {
              var i,
                s,
                a,
                n,
                o,
                h = e.gf,
                l = e.g._hasOpacity,
                p = e.s.v,
                c = e.e.v;
              if (e.o._mdf || r) {
                var f = 'gf' === t.ty ? 'fill-opacity' : 'stroke-opacity';
                e.style.pElem.setAttribute(f, e.o.v);
              }
              if (e.s._mdf || r) {
                var d = 1 === t.t ? 'x1' : 'cx',
                  m = 'x1' === d ? 'y1' : 'cy';
                h.setAttribute(d, p[0]),
                  h.setAttribute(m, p[1]),
                  l &&
                    !e.g._collapsable &&
                    (e.of.setAttribute(d, p[0]), e.of.setAttribute(m, p[1]));
              }
              if (e.g._cmdf || r) {
                i = e.cst;
                var u = e.g.c;
                for (a = i.length, s = 0; s < a; s += 1)
                  (n = i[s]).setAttribute('offset', u[4 * s] + '%'),
                    n.setAttribute(
                      'stop-color',
                      'rgb(' +
                        u[4 * s + 1] +
                        ',' +
                        u[4 * s + 2] +
                        ',' +
                        u[4 * s + 3] +
                        ')'
                    );
              }
              if (l && (e.g._omdf || r)) {
                var y = e.g.o;
                for (
                  a = (i = e.g._collapsable ? e.cst : e.ost).length, s = 0;
                  s < a;
                  s += 1
                )
                  (n = i[s]),
                    e.g._collapsable ||
                      n.setAttribute('offset', y[2 * s] + '%'),
                    n.setAttribute('stop-opacity', y[2 * s + 1]);
              }
              if (1 === t.t)
                (e.e._mdf || r) &&
                  (h.setAttribute('x2', c[0]),
                  h.setAttribute('y2', c[1]),
                  l &&
                    !e.g._collapsable &&
                    (e.of.setAttribute('x2', c[0]),
                    e.of.setAttribute('y2', c[1])));
              else if (
                ((e.s._mdf || e.e._mdf || r) &&
                  ((o = Math.sqrt(
                    Math.pow(p[0] - c[0], 2) + Math.pow(p[1] - c[1], 2)
                  )),
                  h.setAttribute('r', o),
                  l && !e.g._collapsable && e.of.setAttribute('r', o)),
                e.e._mdf || e.h._mdf || e.a._mdf || r)
              ) {
                o ||
                  (o = Math.sqrt(
                    Math.pow(p[0] - c[0], 2) + Math.pow(p[1] - c[1], 2)
                  ));
                var g = Math.atan2(c[1] - p[1], c[0] - p[0]),
                  v = e.h.v;
                v >= 1 ? (v = 0.99) : v <= -1 && (v = -0.99);
                var b = o * v,
                  _ = Math.cos(g + e.a.v) * b + p[0],
                  P = Math.sin(g + e.a.v) * b + p[1];
                h.setAttribute('fx', _),
                  h.setAttribute('fy', P),
                  l &&
                    !e.g._collapsable &&
                    (e.of.setAttribute('fx', _), e.of.setAttribute('fy', P));
              }
            }
            function h(t, e, r) {
              var i = e.style,
                s = e.d;
              s &&
                (s._mdf || r) &&
                s.dashStr &&
                (i.pElem.setAttribute('stroke-dasharray', s.dashStr),
                i.pElem.setAttribute('stroke-dashoffset', s.dashoffset[0])),
                e.c &&
                  (e.c._mdf || r) &&
                  i.pElem.setAttribute(
                    'stroke',
                    'rgb(' +
                      bmFloor(e.c.v[0]) +
                      ',' +
                      bmFloor(e.c.v[1]) +
                      ',' +
                      bmFloor(e.c.v[2]) +
                      ')'
                  ),
                (e.o._mdf || r) &&
                  i.pElem.setAttribute('stroke-opacity', e.o.v),
                (e.w._mdf || r) &&
                  (i.pElem.setAttribute('stroke-width', e.w.v),
                  i.msElem && i.msElem.setAttribute('stroke-width', e.w.v));
            }
            return {
              createRenderFunction: function (t) {
                switch (t.ty) {
                  case 'fl':
                    return a;
                  case 'gf':
                    return o;
                  case 'gs':
                    return n;
                  case 'st':
                    return h;
                  case 'sh':
                  case 'el':
                  case 'rc':
                  case 'sr':
                    return s;
                  case 'tr':
                    return r;
                  case 'no':
                    return i;
                  default:
                    return null;
                }
              },
            };
          })();
        function SVGShapeElement(t, e, r) {
          (this.shapes = []),
            (this.shapesData = t.shapes),
            (this.stylesList = []),
            (this.shapeModifiers = []),
            (this.itemsData = []),
            (this.processedElements = []),
            (this.animatedContents = []),
            this.initElement(t, e, r),
            (this.prevViewData = []);
        }
        function LetterProps(t, e, r, i, s, a) {
          (this.o = t),
            (this.sw = e),
            (this.sc = r),
            (this.fc = i),
            (this.m = s),
            (this.p = a),
            (this._mdf = { o: !0, sw: !!e, sc: !!r, fc: !!i, m: !0, p: !0 });
        }
        function TextProperty(t, e) {
          (this._frameId = initialDefaultFrame),
            (this.pv = ''),
            (this.v = ''),
            (this.kf = !1),
            (this._isFirstFrame = !0),
            (this._mdf = !1),
            (this.data = e),
            (this.elem = t),
            (this.comp = this.elem.comp),
            (this.keysIndex = 0),
            (this.canResize = !1),
            (this.minimumFontSize = 1),
            (this.effectsSequence = []),
            (this.currentData = {
              ascent: 0,
              boxWidth: this.defaultBoxWidth,
              f: '',
              fStyle: '',
              fWeight: '',
              fc: '',
              j: '',
              justifyOffset: '',
              l: [],
              lh: 0,
              lineWidths: [],
              ls: '',
              of: '',
              s: '',
              sc: '',
              sw: 0,
              t: 0,
              tr: 0,
              sz: 0,
              ps: null,
              fillColorAnim: !1,
              strokeColorAnim: !1,
              strokeWidthAnim: !1,
              yOffset: 0,
              finalSize: 0,
              finalText: [],
              finalLineHeight: 0,
              __complete: !1,
            }),
            this.copyData(this.currentData, this.data.d.k[0].s),
            this.searchProperty() || this.completeTextData(this.currentData);
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            SVGBaseElement,
            IShapeElement,
            HierarchyElement,
            FrameElement,
            RenderableDOMElement,
          ],
          SVGShapeElement
        ),
          (SVGShapeElement.prototype.initSecondaryElement = function () {}),
          (SVGShapeElement.prototype.identityMatrix = new Matrix()),
          (SVGShapeElement.prototype.buildExpressionInterface = function () {}),
          (SVGShapeElement.prototype.createContent = function () {
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              this.layerElement,
              0,
              [],
              !0
            ),
              this.filterUniqueShapes();
          }),
          (SVGShapeElement.prototype.filterUniqueShapes = function () {
            var t,
              e,
              r,
              i,
              s = this.shapes.length,
              a = this.stylesList.length,
              n = [],
              o = !1;
            for (r = 0; r < a; r += 1) {
              for (
                i = this.stylesList[r], o = !1, n.length = 0, t = 0;
                t < s;
                t += 1
              )
                -1 !== (e = this.shapes[t]).styles.indexOf(i) &&
                  (n.push(e), (o = e._isAnimated || o));
              n.length > 1 && o && this.setShapesAsAnimated(n);
            }
          }),
          (SVGShapeElement.prototype.setShapesAsAnimated = function (t) {
            var e,
              r = t.length;
            for (e = 0; e < r; e += 1) t[e].setAsAnimated();
          }),
          (SVGShapeElement.prototype.createStyleElement = function (t, e) {
            var r,
              i = new SVGStyleData(t, e),
              s = i.pElem;
            return (
              'st' === t.ty
                ? (r = new SVGStrokeStyleData(this, t, i))
                : 'fl' === t.ty
                ? (r = new SVGFillStyleData(this, t, i))
                : 'gf' === t.ty || 'gs' === t.ty
                ? ((r = new (
                    'gf' === t.ty
                      ? SVGGradientFillStyleData
                      : SVGGradientStrokeStyleData
                  )(this, t, i)),
                  this.globalData.defs.appendChild(r.gf),
                  r.maskId &&
                    (this.globalData.defs.appendChild(r.ms),
                    this.globalData.defs.appendChild(r.of),
                    s.setAttribute(
                      'mask',
                      'url(' + getLocationHref() + '#' + r.maskId + ')'
                    )))
                : 'no' === t.ty && (r = new SVGNoStyleData(this, t, i)),
              ('st' !== t.ty && 'gs' !== t.ty) ||
                (s.setAttribute('stroke-linecap', lineCapEnum[t.lc || 2]),
                s.setAttribute('stroke-linejoin', lineJoinEnum[t.lj || 2]),
                s.setAttribute('fill-opacity', '0'),
                1 === t.lj && s.setAttribute('stroke-miterlimit', t.ml)),
              2 === t.r && s.setAttribute('fill-rule', 'evenodd'),
              t.ln && s.setAttribute('id', t.ln),
              t.cl && s.setAttribute('class', t.cl),
              t.bm && (s.style['mix-blend-mode'] = getBlendMode(t.bm)),
              this.stylesList.push(i),
              this.addToAnimatedContents(t, r),
              r
            );
          }),
          (SVGShapeElement.prototype.createGroupElement = function (t) {
            var e = new ShapeGroupData();
            return (
              t.ln && e.gr.setAttribute('id', t.ln),
              t.cl && e.gr.setAttribute('class', t.cl),
              t.bm && (e.gr.style['mix-blend-mode'] = getBlendMode(t.bm)),
              e
            );
          }),
          (SVGShapeElement.prototype.createTransformElement = function (t, e) {
            var r = TransformPropertyFactory.getTransformProperty(
                this,
                t,
                this
              ),
              i = new SVGTransformData(r, r.o, e);
            return this.addToAnimatedContents(t, i), i;
          }),
          (SVGShapeElement.prototype.createShapeElement = function (t, e, r) {
            var i = 4;
            'rc' === t.ty
              ? (i = 5)
              : 'el' === t.ty
              ? (i = 6)
              : 'sr' === t.ty && (i = 7);
            var s = new SVGShapeData(
              e,
              r,
              ShapePropertyFactory.getShapeProp(this, t, i, this)
            );
            return (
              this.shapes.push(s),
              this.addShapeToModifiers(s),
              this.addToAnimatedContents(t, s),
              s
            );
          }),
          (SVGShapeElement.prototype.addToAnimatedContents = function (t, e) {
            for (var r = 0, i = this.animatedContents.length; r < i; ) {
              if (this.animatedContents[r].element === e) return;
              r += 1;
            }
            this.animatedContents.push({
              fn: SVGElementsRenderer.createRenderFunction(t),
              element: e,
              data: t,
            });
          }),
          (SVGShapeElement.prototype.setElementStyles = function (t) {
            var e,
              r = t.styles,
              i = this.stylesList.length;
            for (e = 0; e < i; e += 1)
              this.stylesList[e].closed || r.push(this.stylesList[e]);
          }),
          (SVGShapeElement.prototype.reloadShapes = function () {
            var t;
            this._isFirstFrame = !0;
            var e = this.itemsData.length;
            for (t = 0; t < e; t += 1) this.prevViewData[t] = this.itemsData[t];
            for (
              this.searchShapes(
                this.shapesData,
                this.itemsData,
                this.prevViewData,
                this.layerElement,
                0,
                [],
                !0
              ),
                this.filterUniqueShapes(),
                e = this.dynamicProperties.length,
                t = 0;
              t < e;
              t += 1
            )
              this.dynamicProperties[t].getValue();
            this.renderModifiers();
          }),
          (SVGShapeElement.prototype.searchShapes = function (
            t,
            e,
            r,
            i,
            s,
            a,
            n
          ) {
            var o,
              h,
              l,
              p,
              c,
              f,
              d = [].concat(a),
              m = t.length - 1,
              u = [],
              y = [];
            for (o = m; o >= 0; o -= 1) {
              if (
                ((f = this.searchProcessedElement(t[o]))
                  ? (e[o] = r[f - 1])
                  : (t[o]._render = n),
                'fl' === t[o].ty ||
                  'st' === t[o].ty ||
                  'gf' === t[o].ty ||
                  'gs' === t[o].ty ||
                  'no' === t[o].ty)
              )
                f
                  ? (e[o].style.closed = !1)
                  : (e[o] = this.createStyleElement(t[o], s)),
                  t[o]._render &&
                    e[o].style.pElem.parentNode !== i &&
                    i.appendChild(e[o].style.pElem),
                  u.push(e[o].style);
              else if ('gr' === t[o].ty) {
                if (f)
                  for (l = e[o].it.length, h = 0; h < l; h += 1)
                    e[o].prevViewData[h] = e[o].it[h];
                else e[o] = this.createGroupElement(t[o]);
                this.searchShapes(
                  t[o].it,
                  e[o].it,
                  e[o].prevViewData,
                  e[o].gr,
                  s + 1,
                  d,
                  n
                ),
                  t[o]._render &&
                    e[o].gr.parentNode !== i &&
                    i.appendChild(e[o].gr);
              } else
                'tr' === t[o].ty
                  ? (f || (e[o] = this.createTransformElement(t[o], i)),
                    (p = e[o].transform),
                    d.push(p))
                  : 'sh' === t[o].ty ||
                    'rc' === t[o].ty ||
                    'el' === t[o].ty ||
                    'sr' === t[o].ty
                  ? (f || (e[o] = this.createShapeElement(t[o], d, s)),
                    this.setElementStyles(e[o]))
                  : 'tm' === t[o].ty ||
                    'rd' === t[o].ty ||
                    'ms' === t[o].ty ||
                    'pb' === t[o].ty
                  ? (f
                      ? ((c = e[o]).closed = !1)
                      : ((c = ShapeModifiers.getModifier(t[o].ty)).init(
                          this,
                          t[o]
                        ),
                        (e[o] = c),
                        this.shapeModifiers.push(c)),
                    y.push(c))
                  : 'rp' === t[o].ty &&
                    (f
                      ? ((c = e[o]).closed = !0)
                      : ((c = ShapeModifiers.getModifier(t[o].ty)),
                        (e[o] = c),
                        c.init(this, t, o, e),
                        this.shapeModifiers.push(c),
                        (n = !1)),
                    y.push(c));
              this.addProcessedElement(t[o], o + 1);
            }
            for (m = u.length, o = 0; o < m; o += 1) u[o].closed = !0;
            for (m = y.length, o = 0; o < m; o += 1) y[o].closed = !0;
          }),
          (SVGShapeElement.prototype.renderInnerContent = function () {
            var t;
            this.renderModifiers();
            var e = this.stylesList.length;
            for (t = 0; t < e; t += 1) this.stylesList[t].reset();
            for (this.renderShape(), t = 0; t < e; t += 1)
              (this.stylesList[t]._mdf || this._isFirstFrame) &&
                (this.stylesList[t].msElem &&
                  (this.stylesList[t].msElem.setAttribute(
                    'd',
                    this.stylesList[t].d
                  ),
                  (this.stylesList[t].d = 'M0 0' + this.stylesList[t].d)),
                this.stylesList[t].pElem.setAttribute(
                  'd',
                  this.stylesList[t].d || 'M0 0'
                ));
          }),
          (SVGShapeElement.prototype.renderShape = function () {
            var t,
              e,
              r = this.animatedContents.length;
            for (t = 0; t < r; t += 1)
              (e = this.animatedContents[t]),
                (this._isFirstFrame || e.element._isAnimated) &&
                  !0 !== e.data &&
                  e.fn(e.data, e.element, this._isFirstFrame);
          }),
          (SVGShapeElement.prototype.destroy = function () {
            this.destroyBaseElement(),
              (this.shapesData = null),
              (this.itemsData = null);
          }),
          (LetterProps.prototype.update = function (t, e, r, i, s, a) {
            (this._mdf.o = !1),
              (this._mdf.sw = !1),
              (this._mdf.sc = !1),
              (this._mdf.fc = !1),
              (this._mdf.m = !1),
              (this._mdf.p = !1);
            var n = !1;
            return (
              this.o !== t && ((this.o = t), (this._mdf.o = !0), (n = !0)),
              this.sw !== e && ((this.sw = e), (this._mdf.sw = !0), (n = !0)),
              this.sc !== r && ((this.sc = r), (this._mdf.sc = !0), (n = !0)),
              this.fc !== i && ((this.fc = i), (this._mdf.fc = !0), (n = !0)),
              this.m !== s && ((this.m = s), (this._mdf.m = !0), (n = !0)),
              !a.length ||
                (this.p[0] === a[0] &&
                  this.p[1] === a[1] &&
                  this.p[4] === a[4] &&
                  this.p[5] === a[5] &&
                  this.p[12] === a[12] &&
                  this.p[13] === a[13]) ||
                ((this.p = a), (this._mdf.p = !0), (n = !0)),
              n
            );
          }),
          (TextProperty.prototype.defaultBoxWidth = [0, 0]),
          (TextProperty.prototype.copyData = function (t, e) {
            for (var r in e)
              Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t;
          }),
          (TextProperty.prototype.setCurrentData = function (t) {
            t.__complete || this.completeTextData(t),
              (this.currentData = t),
              (this.currentData.boxWidth =
                this.currentData.boxWidth || this.defaultBoxWidth),
              (this._mdf = !0);
          }),
          (TextProperty.prototype.searchProperty = function () {
            return this.searchKeyframes();
          }),
          (TextProperty.prototype.searchKeyframes = function () {
            return (
              (this.kf = this.data.d.k.length > 1),
              this.kf && this.addEffect(this.getKeyframeValue.bind(this)),
              this.kf
            );
          }),
          (TextProperty.prototype.addEffect = function (t) {
            this.effectsSequence.push(t), this.elem.addDynamicProperty(this);
          }),
          (TextProperty.prototype.getValue = function (t) {
            if (
              (this.elem.globalData.frameId !== this.frameId &&
                this.effectsSequence.length) ||
              t
            ) {
              this.currentData.t = this.data.d.k[this.keysIndex].s.t;
              var e = this.currentData,
                r = this.keysIndex;
              if (this.lock) this.setCurrentData(this.currentData);
              else {
                var i;
                (this.lock = !0), (this._mdf = !1);
                var s = this.effectsSequence.length,
                  a = t || this.data.d.k[this.keysIndex].s;
                for (i = 0; i < s; i += 1)
                  a =
                    r !== this.keysIndex
                      ? this.effectsSequence[i](a, a.t)
                      : this.effectsSequence[i](this.currentData, a.t);
                e !== a && this.setCurrentData(a),
                  (this.v = this.currentData),
                  (this.pv = this.v),
                  (this.lock = !1),
                  (this.frameId = this.elem.globalData.frameId);
              }
            }
          }),
          (TextProperty.prototype.getKeyframeValue = function () {
            for (
              var t = this.data.d.k,
                e = this.elem.comp.renderedFrame,
                r = 0,
                i = t.length;
              r <= i - 1 && !(r === i - 1 || t[r + 1].t > e);

            )
              r += 1;
            return (
              this.keysIndex !== r && (this.keysIndex = r),
              this.data.d.k[this.keysIndex].s
            );
          }),
          (TextProperty.prototype.buildFinalText = function (t) {
            for (var e, r, i = [], s = 0, a = t.length, n = !1; s < a; )
              (e = t.charCodeAt(s)),
                FontManager.isCombinedCharacter(e)
                  ? (i[i.length - 1] += t.charAt(s))
                  : e >= 55296 && e <= 56319
                  ? (r = t.charCodeAt(s + 1)) >= 56320 && r <= 57343
                    ? (n || FontManager.isModifier(e, r)
                        ? ((i[i.length - 1] += t.substr(s, 2)), (n = !1))
                        : i.push(t.substr(s, 2)),
                      (s += 1))
                    : i.push(t.charAt(s))
                  : e > 56319
                  ? ((r = t.charCodeAt(s + 1)),
                    FontManager.isZeroWidthJoiner(e, r)
                      ? ((n = !0),
                        (i[i.length - 1] += t.substr(s, 2)),
                        (s += 1))
                      : i.push(t.charAt(s)))
                  : FontManager.isZeroWidthJoiner(e)
                  ? ((i[i.length - 1] += t.charAt(s)), (n = !0))
                  : i.push(t.charAt(s)),
                (s += 1);
            return i;
          }),
          (TextProperty.prototype.completeTextData = function (t) {
            t.__complete = !0;
            var e,
              r,
              i,
              s,
              a,
              n,
              o,
              h = this.elem.globalData.fontManager,
              l = this.data,
              p = [],
              c = 0,
              f = l.m.g,
              d = 0,
              m = 0,
              u = 0,
              y = [],
              g = 0,
              v = 0,
              b = h.getFontByName(t.f),
              _ = 0,
              P = getFontProperties(b);
            (t.fWeight = P.weight),
              (t.fStyle = P.style),
              (t.finalSize = t.s),
              (t.finalText = this.buildFinalText(t.t)),
              (r = t.finalText.length),
              (t.finalLineHeight = t.lh);
            var E,
              S = (t.tr / 1e3) * t.finalSize;
            if (t.sz)
              for (var x, A, w = !0, C = t.sz[0], k = t.sz[1]; w; ) {
                (x = 0),
                  (g = 0),
                  (r = (A = this.buildFinalText(t.t)).length),
                  (S = (t.tr / 1e3) * t.finalSize);
                var T = -1;
                for (e = 0; e < r; e += 1)
                  (E = A[e].charCodeAt(0)),
                    (i = !1),
                    ' ' === A[e]
                      ? (T = e)
                      : (13 !== E && 3 !== E) ||
                        ((g = 0),
                        (i = !0),
                        (x += t.finalLineHeight || 1.2 * t.finalSize)),
                    h.chars
                      ? ((o = h.getCharData(A[e], b.fStyle, b.fFamily)),
                        (_ = i ? 0 : (o.w * t.finalSize) / 100))
                      : (_ = h.measureText(A[e], t.f, t.finalSize)),
                    g + _ > C && ' ' !== A[e]
                      ? (-1 === T ? (r += 1) : (e = T),
                        (x += t.finalLineHeight || 1.2 * t.finalSize),
                        A.splice(e, T === e ? 1 : 0, '\r'),
                        (T = -1),
                        (g = 0))
                      : ((g += _), (g += S));
                (x += (b.ascent * t.finalSize) / 100),
                  this.canResize && t.finalSize > this.minimumFontSize && k < x
                    ? ((t.finalSize -= 1),
                      (t.finalLineHeight = (t.finalSize * t.lh) / t.s))
                    : ((t.finalText = A), (r = t.finalText.length), (w = !1));
              }
            (g = -S), (_ = 0);
            var D,
              M = 0;
            for (e = 0; e < r; e += 1)
              if (
                ((i = !1),
                13 === (E = (D = t.finalText[e]).charCodeAt(0)) || 3 === E
                  ? ((M = 0),
                    y.push(g),
                    (v = g > v ? g : v),
                    (g = -2 * S),
                    (s = ''),
                    (i = !0),
                    (u += 1))
                  : (s = D),
                h.chars
                  ? ((o = h.getCharData(
                      D,
                      b.fStyle,
                      h.getFontByName(t.f).fFamily
                    )),
                    (_ = i ? 0 : (o.w * t.finalSize) / 100))
                  : (_ = h.measureText(s, t.f, t.finalSize)),
                ' ' === D ? (M += _ + S) : ((g += _ + S + M), (M = 0)),
                p.push({
                  l: _,
                  an: _,
                  add: d,
                  n: i,
                  anIndexes: [],
                  val: s,
                  line: u,
                  animatorJustifyOffset: 0,
                }),
                2 == f)
              ) {
                if (((d += _), '' === s || ' ' === s || e === r - 1)) {
                  for (('' !== s && ' ' !== s) || (d -= _); m <= e; )
                    (p[m].an = d), (p[m].ind = c), (p[m].extra = _), (m += 1);
                  (c += 1), (d = 0);
                }
              } else if (3 == f) {
                if (((d += _), '' === s || e === r - 1)) {
                  for ('' === s && (d -= _); m <= e; )
                    (p[m].an = d), (p[m].ind = c), (p[m].extra = _), (m += 1);
                  (d = 0), (c += 1);
                }
              } else (p[c].ind = c), (p[c].extra = 0), (c += 1);
            if (((t.l = p), (v = g > v ? g : v), y.push(g), t.sz))
              (t.boxWidth = t.sz[0]), (t.justifyOffset = 0);
            else
              switch (((t.boxWidth = v), t.j)) {
                case 1:
                  t.justifyOffset = -t.boxWidth;
                  break;
                case 2:
                  t.justifyOffset = -t.boxWidth / 2;
                  break;
                default:
                  t.justifyOffset = 0;
              }
            t.lineWidths = y;
            var F,
              I,
              R,
              B,
              V = l.a;
            n = V.length;
            var L = [];
            for (a = 0; a < n; a += 1) {
              for (
                (F = V[a]).a.sc && (t.strokeColorAnim = !0),
                  F.a.sw && (t.strokeWidthAnim = !0),
                  (F.a.fc || F.a.fh || F.a.fs || F.a.fb) &&
                    (t.fillColorAnim = !0),
                  B = 0,
                  R = F.s.b,
                  e = 0;
                e < r;
                e += 1
              )
                ((I = p[e]).anIndexes[a] = B),
                  ((1 == R && '' !== I.val) ||
                    (2 == R && '' !== I.val && ' ' !== I.val) ||
                    (3 == R && (I.n || ' ' == I.val || e == r - 1)) ||
                    (4 == R && (I.n || e == r - 1))) &&
                    (1 === F.s.rn && L.push(B), (B += 1));
              l.a[a].s.totalChars = B;
              var O,
                $ = -1;
              if (1 === F.s.rn)
                for (e = 0; e < r; e += 1)
                  $ != (I = p[e]).anIndexes[a] &&
                    (($ = I.anIndexes[a]),
                    (O = L.splice(Math.floor(Math.random() * L.length), 1)[0])),
                    (I.anIndexes[a] = O);
            }
            (t.yOffset = t.finalLineHeight || 1.2 * t.finalSize),
              (t.ls = t.ls || 0),
              (t.ascent = (b.ascent * t.finalSize) / 100);
          }),
          (TextProperty.prototype.updateDocumentData = function (t, e) {
            e = void 0 === e ? this.keysIndex : e;
            var r = this.copyData({}, this.data.d.k[e].s);
            (r = this.copyData(r, t)),
              (this.data.d.k[e].s = r),
              this.recalculate(e),
              this.elem.addDynamicProperty(this);
          }),
          (TextProperty.prototype.recalculate = function (t) {
            var e = this.data.d.k[t].s;
            (e.__complete = !1),
              (this.keysIndex = 0),
              (this._isFirstFrame = !0),
              this.getValue(e);
          }),
          (TextProperty.prototype.canResizeFont = function (t) {
            (this.canResize = t),
              this.recalculate(this.keysIndex),
              this.elem.addDynamicProperty(this);
          }),
          (TextProperty.prototype.setMinimumFontSize = function (t) {
            (this.minimumFontSize = Math.floor(t) || 1),
              this.recalculate(this.keysIndex),
              this.elem.addDynamicProperty(this);
          });
        var TextSelectorProp = (function () {
          var t = Math.max,
            e = Math.min,
            r = Math.floor;
          function i(t, e) {
            (this._currentTextLength = -1),
              (this.k = !1),
              (this.data = e),
              (this.elem = t),
              (this.comp = t.comp),
              (this.finalS = 0),
              (this.finalE = 0),
              this.initDynamicPropertyContainer(t),
              (this.s = PropertyFactory.getProp(
                t,
                e.s || { k: 0 },
                0,
                0,
                this
              )),
              (this.e =
                'e' in e
                  ? PropertyFactory.getProp(t, e.e, 0, 0, this)
                  : { v: 100 }),
              (this.o = PropertyFactory.getProp(
                t,
                e.o || { k: 0 },
                0,
                0,
                this
              )),
              (this.xe = PropertyFactory.getProp(
                t,
                e.xe || { k: 0 },
                0,
                0,
                this
              )),
              (this.ne = PropertyFactory.getProp(
                t,
                e.ne || { k: 0 },
                0,
                0,
                this
              )),
              (this.sm = PropertyFactory.getProp(
                t,
                e.sm || { k: 100 },
                0,
                0,
                this
              )),
              (this.a = PropertyFactory.getProp(t, e.a, 0, 0.01, this)),
              this.dynamicProperties.length || this.getValue();
          }
          return (
            (i.prototype = {
              getMult: function (i) {
                this._currentTextLength !==
                  this.elem.textProperty.currentData.l.length &&
                  this.getValue();
                var s = 0,
                  a = 0,
                  n = 1,
                  o = 1;
                this.ne.v > 0 ? (s = this.ne.v / 100) : (a = -this.ne.v / 100),
                  this.xe.v > 0
                    ? (n = 1 - this.xe.v / 100)
                    : (o = 1 + this.xe.v / 100);
                var h = BezierFactory.getBezierEasing(s, a, n, o).get,
                  l = 0,
                  p = this.finalS,
                  c = this.finalE,
                  f = this.data.sh;
                if (2 === f)
                  l = h(
                    (l =
                      c === p
                        ? i >= c
                          ? 1
                          : 0
                        : t(0, e(0.5 / (c - p) + (i - p) / (c - p), 1)))
                  );
                else if (3 === f)
                  l = h(
                    (l =
                      c === p
                        ? i >= c
                          ? 0
                          : 1
                        : 1 - t(0, e(0.5 / (c - p) + (i - p) / (c - p), 1)))
                  );
                else if (4 === f)
                  c === p
                    ? (l = 0)
                    : (l = t(0, e(0.5 / (c - p) + (i - p) / (c - p), 1))) < 0.5
                    ? (l *= 2)
                    : (l = 1 - 2 * (l - 0.5)),
                    (l = h(l));
                else if (5 === f) {
                  if (c === p) l = 0;
                  else {
                    var d = c - p,
                      m = -d / 2 + (i = e(t(0, i + 0.5 - p), c - p)),
                      u = d / 2;
                    l = Math.sqrt(1 - (m * m) / (u * u));
                  }
                  l = h(l);
                } else
                  6 === f
                    ? (c === p
                        ? (l = 0)
                        : ((i = e(t(0, i + 0.5 - p), c - p)),
                          (l =
                            (1 +
                              Math.cos(Math.PI + (2 * Math.PI * i) / (c - p))) /
                            2)),
                      (l = h(l)))
                    : (i >= r(p) &&
                        (l = t(0, e(i - p < 0 ? e(c, 1) - (p - i) : c - i, 1))),
                      (l = h(l)));
                if (100 !== this.sm.v) {
                  var y = 0.01 * this.sm.v;
                  0 === y && (y = 1e-8);
                  var g = 0.5 - 0.5 * y;
                  l < g ? (l = 0) : (l = (l - g) / y) > 1 && (l = 1);
                }
                return l * this.a.v;
              },
              getValue: function (t) {
                this.iterateDynamicProperties(),
                  (this._mdf = t || this._mdf),
                  (this._currentTextLength =
                    this.elem.textProperty.currentData.l.length || 0),
                  t &&
                    2 === this.data.r &&
                    (this.e.v = this._currentTextLength);
                var e = 2 === this.data.r ? 1 : 100 / this.data.totalChars,
                  r = this.o.v / e,
                  i = this.s.v / e + r,
                  s = this.e.v / e + r;
                if (i > s) {
                  var a = i;
                  (i = s), (s = a);
                }
                (this.finalS = i), (this.finalE = s);
              },
            }),
            extendPrototype([DynamicPropertyContainer], i),
            {
              getTextSelectorProp: function (t, e, r) {
                return new i(t, e, r);
              },
            }
          );
        })();
        function TextAnimatorDataProperty(t, e, r) {
          var i = { propType: !1 },
            s = PropertyFactory.getProp,
            a = e.a;
          (this.a = {
            r: a.r ? s(t, a.r, 0, degToRads, r) : i,
            rx: a.rx ? s(t, a.rx, 0, degToRads, r) : i,
            ry: a.ry ? s(t, a.ry, 0, degToRads, r) : i,
            sk: a.sk ? s(t, a.sk, 0, degToRads, r) : i,
            sa: a.sa ? s(t, a.sa, 0, degToRads, r) : i,
            s: a.s ? s(t, a.s, 1, 0.01, r) : i,
            a: a.a ? s(t, a.a, 1, 0, r) : i,
            o: a.o ? s(t, a.o, 0, 0.01, r) : i,
            p: a.p ? s(t, a.p, 1, 0, r) : i,
            sw: a.sw ? s(t, a.sw, 0, 0, r) : i,
            sc: a.sc ? s(t, a.sc, 1, 0, r) : i,
            fc: a.fc ? s(t, a.fc, 1, 0, r) : i,
            fh: a.fh ? s(t, a.fh, 0, 0, r) : i,
            fs: a.fs ? s(t, a.fs, 0, 0.01, r) : i,
            fb: a.fb ? s(t, a.fb, 0, 0.01, r) : i,
            t: a.t ? s(t, a.t, 0, 0, r) : i,
          }),
            (this.s = TextSelectorProp.getTextSelectorProp(t, e.s, r)),
            (this.s.t = e.s.t);
        }
        function TextAnimatorProperty(t, e, r) {
          (this._isFirstFrame = !0),
            (this._hasMaskedPath = !1),
            (this._frameId = -1),
            (this._textData = t),
            (this._renderType = e),
            (this._elem = r),
            (this._animatorsData = createSizedArray(this._textData.a.length)),
            (this._pathData = {}),
            (this._moreOptions = { alignment: {} }),
            (this.renderedLetters = []),
            (this.lettersChangedFlag = !1),
            this.initDynamicPropertyContainer(r);
        }
        function ITextElement() {}
        (TextAnimatorProperty.prototype.searchProperties = function () {
          var t,
            e,
            r = this._textData.a.length,
            i = PropertyFactory.getProp;
          for (t = 0; t < r; t += 1)
            (e = this._textData.a[t]),
              (this._animatorsData[t] = new TextAnimatorDataProperty(
                this._elem,
                e,
                this
              ));
          this._textData.p && 'm' in this._textData.p
            ? ((this._pathData = {
                a: i(this._elem, this._textData.p.a, 0, 0, this),
                f: i(this._elem, this._textData.p.f, 0, 0, this),
                l: i(this._elem, this._textData.p.l, 0, 0, this),
                r: i(this._elem, this._textData.p.r, 0, 0, this),
                p: i(this._elem, this._textData.p.p, 0, 0, this),
                m: this._elem.maskManager.getMaskProperty(this._textData.p.m),
              }),
              (this._hasMaskedPath = !0))
            : (this._hasMaskedPath = !1),
            (this._moreOptions.alignment = i(
              this._elem,
              this._textData.m.a,
              1,
              0,
              this
            ));
        }),
          (TextAnimatorProperty.prototype.getMeasures = function (t, e) {
            if (
              ((this.lettersChangedFlag = e),
              this._mdf ||
                this._isFirstFrame ||
                e ||
                (this._hasMaskedPath && this._pathData.m._mdf))
            ) {
              this._isFirstFrame = !1;
              var r,
                i,
                s,
                a,
                n,
                o,
                h,
                l,
                p,
                c,
                f,
                d,
                m,
                u,
                y,
                g,
                v,
                b,
                _,
                P = this._moreOptions.alignment.v,
                E = this._animatorsData,
                S = this._textData,
                x = this.mHelper,
                A = this._renderType,
                w = this.renderedLetters.length,
                C = t.l;
              if (this._hasMaskedPath) {
                if (
                  ((_ = this._pathData.m),
                  !this._pathData.n || this._pathData._mdf)
                ) {
                  var k,
                    T = _.v;
                  for (
                    this._pathData.r.v && (T = T.reverse()),
                      n = { tLength: 0, segments: [] },
                      a = T._length - 1,
                      g = 0,
                      s = 0;
                    s < a;
                    s += 1
                  )
                    (k = bez.buildBezierData(
                      T.v[s],
                      T.v[s + 1],
                      [T.o[s][0] - T.v[s][0], T.o[s][1] - T.v[s][1]],
                      [
                        T.i[s + 1][0] - T.v[s + 1][0],
                        T.i[s + 1][1] - T.v[s + 1][1],
                      ]
                    )),
                      (n.tLength += k.segmentLength),
                      n.segments.push(k),
                      (g += k.segmentLength);
                  (s = a),
                    _.v.c &&
                      ((k = bez.buildBezierData(
                        T.v[s],
                        T.v[0],
                        [T.o[s][0] - T.v[s][0], T.o[s][1] - T.v[s][1]],
                        [T.i[0][0] - T.v[0][0], T.i[0][1] - T.v[0][1]]
                      )),
                      (n.tLength += k.segmentLength),
                      n.segments.push(k),
                      (g += k.segmentLength)),
                    (this._pathData.pi = n);
                }
                if (
                  ((n = this._pathData.pi),
                  (o = this._pathData.f.v),
                  (f = 0),
                  (c = 1),
                  (l = 0),
                  (p = !0),
                  (u = n.segments),
                  o < 0 && _.v.c)
                )
                  for (
                    n.tLength < Math.abs(o) && (o = -Math.abs(o) % n.tLength),
                      c = (m = u[(f = u.length - 1)].points).length - 1;
                    o < 0;

                  )
                    (o += m[c].partialLength),
                      (c -= 1) < 0 && (c = (m = u[(f -= 1)].points).length - 1);
                (d = (m = u[f].points)[c - 1]), (y = (h = m[c]).partialLength);
              }
              (a = C.length), (r = 0), (i = 0);
              var D,
                M,
                F,
                I,
                R,
                B = 1.2 * t.finalSize * 0.714,
                V = !0;
              F = E.length;
              var L,
                O,
                $,
                z,
                G,
                N,
                j,
                H,
                q,
                W,
                U,
                Y,
                X = -1,
                K = o,
                J = f,
                Z = c,
                Q = -1,
                tt = '',
                et = this.defaultPropsArray;
              if (2 === t.j || 1 === t.j) {
                var rt = 0,
                  it = 0,
                  st = 2 === t.j ? -0.5 : -1,
                  at = 0,
                  nt = !0;
                for (s = 0; s < a; s += 1)
                  if (C[s].n) {
                    for (rt && (rt += it); at < s; )
                      (C[at].animatorJustifyOffset = rt), (at += 1);
                    (rt = 0), (nt = !0);
                  } else {
                    for (M = 0; M < F; M += 1)
                      (D = E[M].a).t.propType &&
                        (nt && 2 === t.j && (it += D.t.v * st),
                        (R = E[M].s.getMult(
                          C[s].anIndexes[M],
                          S.a[M].s.totalChars
                        )).length
                          ? (rt += D.t.v * R[0] * st)
                          : (rt += D.t.v * R * st));
                    nt = !1;
                  }
                for (rt && (rt += it); at < s; )
                  (C[at].animatorJustifyOffset = rt), (at += 1);
              }
              for (s = 0; s < a; s += 1) {
                if ((x.reset(), (z = 1), C[s].n))
                  (r = 0),
                    (i += t.yOffset),
                    (i += V ? 1 : 0),
                    (o = K),
                    (V = !1),
                    this._hasMaskedPath &&
                      ((c = Z),
                      (d = (m = u[(f = J)].points)[c - 1]),
                      (y = (h = m[c]).partialLength),
                      (l = 0)),
                    (tt = ''),
                    (U = ''),
                    (q = ''),
                    (Y = ''),
                    (et = this.defaultPropsArray);
                else {
                  if (this._hasMaskedPath) {
                    if (Q !== C[s].line) {
                      switch (t.j) {
                        case 1:
                          o += g - t.lineWidths[C[s].line];
                          break;
                        case 2:
                          o += (g - t.lineWidths[C[s].line]) / 2;
                      }
                      Q = C[s].line;
                    }
                    X !== C[s].ind &&
                      (C[X] && (o += C[X].extra),
                      (o += C[s].an / 2),
                      (X = C[s].ind)),
                      (o += P[0] * C[s].an * 0.005);
                    var ot = 0;
                    for (M = 0; M < F; M += 1)
                      (D = E[M].a).p.propType &&
                        ((R = E[M].s.getMult(
                          C[s].anIndexes[M],
                          S.a[M].s.totalChars
                        )).length
                          ? (ot += D.p.v[0] * R[0])
                          : (ot += D.p.v[0] * R)),
                        D.a.propType &&
                          ((R = E[M].s.getMult(
                            C[s].anIndexes[M],
                            S.a[M].s.totalChars
                          )).length
                            ? (ot += D.a.v[0] * R[0])
                            : (ot += D.a.v[0] * R));
                    for (
                      p = !0,
                        this._pathData.a.v &&
                          ((o =
                            0.5 * C[0].an +
                            ((g -
                              this._pathData.f.v -
                              0.5 * C[0].an -
                              0.5 * C[C.length - 1].an) *
                              X) /
                              (a - 1)),
                          (o += this._pathData.f.v));
                      p;

                    )
                      l + y >= o + ot || !m
                        ? ((v = (o + ot - l) / h.partialLength),
                          (O = d.point[0] + (h.point[0] - d.point[0]) * v),
                          ($ = d.point[1] + (h.point[1] - d.point[1]) * v),
                          x.translate(
                            -P[0] * C[s].an * 0.005,
                            -P[1] * B * 0.01
                          ),
                          (p = !1))
                        : m &&
                          ((l += h.partialLength),
                          (c += 1) >= m.length &&
                            ((c = 0),
                            u[(f += 1)]
                              ? (m = u[f].points)
                              : _.v.c
                              ? ((c = 0), (m = u[(f = 0)].points))
                              : ((l -= h.partialLength), (m = null))),
                          m && ((d = h), (y = (h = m[c]).partialLength)));
                    (L = C[s].an / 2 - C[s].add), x.translate(-L, 0, 0);
                  } else
                    (L = C[s].an / 2 - C[s].add),
                      x.translate(-L, 0, 0),
                      x.translate(-P[0] * C[s].an * 0.005, -P[1] * B * 0.01, 0);
                  for (M = 0; M < F; M += 1)
                    (D = E[M].a).t.propType &&
                      ((R = E[M].s.getMult(
                        C[s].anIndexes[M],
                        S.a[M].s.totalChars
                      )),
                      (0 === r && 0 === t.j) ||
                        (this._hasMaskedPath
                          ? R.length
                            ? (o += D.t.v * R[0])
                            : (o += D.t.v * R)
                          : R.length
                          ? (r += D.t.v * R[0])
                          : (r += D.t.v * R)));
                  for (
                    t.strokeWidthAnim && (N = t.sw || 0),
                      t.strokeColorAnim &&
                        (G = t.sc ? [t.sc[0], t.sc[1], t.sc[2]] : [0, 0, 0]),
                      t.fillColorAnim &&
                        t.fc &&
                        (j = [t.fc[0], t.fc[1], t.fc[2]]),
                      M = 0;
                    M < F;
                    M += 1
                  )
                    (D = E[M].a).a.propType &&
                      ((R = E[M].s.getMult(
                        C[s].anIndexes[M],
                        S.a[M].s.totalChars
                      )).length
                        ? x.translate(
                            -D.a.v[0] * R[0],
                            -D.a.v[1] * R[1],
                            D.a.v[2] * R[2]
                          )
                        : x.translate(
                            -D.a.v[0] * R,
                            -D.a.v[1] * R,
                            D.a.v[2] * R
                          ));
                  for (M = 0; M < F; M += 1)
                    (D = E[M].a).s.propType &&
                      ((R = E[M].s.getMult(
                        C[s].anIndexes[M],
                        S.a[M].s.totalChars
                      )).length
                        ? x.scale(
                            1 + (D.s.v[0] - 1) * R[0],
                            1 + (D.s.v[1] - 1) * R[1],
                            1
                          )
                        : x.scale(
                            1 + (D.s.v[0] - 1) * R,
                            1 + (D.s.v[1] - 1) * R,
                            1
                          ));
                  for (M = 0; M < F; M += 1) {
                    if (
                      ((D = E[M].a),
                      (R = E[M].s.getMult(
                        C[s].anIndexes[M],
                        S.a[M].s.totalChars
                      )),
                      D.sk.propType &&
                        (R.length
                          ? x.skewFromAxis(-D.sk.v * R[0], D.sa.v * R[1])
                          : x.skewFromAxis(-D.sk.v * R, D.sa.v * R)),
                      D.r.propType &&
                        (R.length
                          ? x.rotateZ(-D.r.v * R[2])
                          : x.rotateZ(-D.r.v * R)),
                      D.ry.propType &&
                        (R.length
                          ? x.rotateY(D.ry.v * R[1])
                          : x.rotateY(D.ry.v * R)),
                      D.rx.propType &&
                        (R.length
                          ? x.rotateX(D.rx.v * R[0])
                          : x.rotateX(D.rx.v * R)),
                      D.o.propType &&
                        (R.length
                          ? (z += (D.o.v * R[0] - z) * R[0])
                          : (z += (D.o.v * R - z) * R)),
                      t.strokeWidthAnim &&
                        D.sw.propType &&
                        (R.length ? (N += D.sw.v * R[0]) : (N += D.sw.v * R)),
                      t.strokeColorAnim && D.sc.propType)
                    )
                      for (H = 0; H < 3; H += 1)
                        R.length
                          ? (G[H] += (D.sc.v[H] - G[H]) * R[0])
                          : (G[H] += (D.sc.v[H] - G[H]) * R);
                    if (t.fillColorAnim && t.fc) {
                      if (D.fc.propType)
                        for (H = 0; H < 3; H += 1)
                          R.length
                            ? (j[H] += (D.fc.v[H] - j[H]) * R[0])
                            : (j[H] += (D.fc.v[H] - j[H]) * R);
                      D.fh.propType &&
                        (j = R.length
                          ? addHueToRGB(j, D.fh.v * R[0])
                          : addHueToRGB(j, D.fh.v * R)),
                        D.fs.propType &&
                          (j = R.length
                            ? addSaturationToRGB(j, D.fs.v * R[0])
                            : addSaturationToRGB(j, D.fs.v * R)),
                        D.fb.propType &&
                          (j = R.length
                            ? addBrightnessToRGB(j, D.fb.v * R[0])
                            : addBrightnessToRGB(j, D.fb.v * R));
                    }
                  }
                  for (M = 0; M < F; M += 1)
                    (D = E[M].a).p.propType &&
                      ((R = E[M].s.getMult(
                        C[s].anIndexes[M],
                        S.a[M].s.totalChars
                      )),
                      this._hasMaskedPath
                        ? R.length
                          ? x.translate(0, D.p.v[1] * R[0], -D.p.v[2] * R[1])
                          : x.translate(0, D.p.v[1] * R, -D.p.v[2] * R)
                        : R.length
                        ? x.translate(
                            D.p.v[0] * R[0],
                            D.p.v[1] * R[1],
                            -D.p.v[2] * R[2]
                          )
                        : x.translate(
                            D.p.v[0] * R,
                            D.p.v[1] * R,
                            -D.p.v[2] * R
                          ));
                  if (
                    (t.strokeWidthAnim && (q = N < 0 ? 0 : N),
                    t.strokeColorAnim &&
                      (W =
                        'rgb(' +
                        Math.round(255 * G[0]) +
                        ',' +
                        Math.round(255 * G[1]) +
                        ',' +
                        Math.round(255 * G[2]) +
                        ')'),
                    t.fillColorAnim &&
                      t.fc &&
                      (U =
                        'rgb(' +
                        Math.round(255 * j[0]) +
                        ',' +
                        Math.round(255 * j[1]) +
                        ',' +
                        Math.round(255 * j[2]) +
                        ')'),
                    this._hasMaskedPath)
                  ) {
                    if (
                      (x.translate(0, -t.ls),
                      x.translate(0, P[1] * B * 0.01 + i, 0),
                      this._pathData.p.v)
                    ) {
                      b = (h.point[1] - d.point[1]) / (h.point[0] - d.point[0]);
                      var ht = (180 * Math.atan(b)) / Math.PI;
                      h.point[0] < d.point[0] && (ht += 180),
                        x.rotate((-ht * Math.PI) / 180);
                    }
                    x.translate(O, $, 0),
                      (o -= P[0] * C[s].an * 0.005),
                      C[s + 1] &&
                        X !== C[s + 1].ind &&
                        ((o += C[s].an / 2), (o += 0.001 * t.tr * t.finalSize));
                  } else {
                    switch (
                      (x.translate(r, i, 0),
                      t.ps && x.translate(t.ps[0], t.ps[1] + t.ascent, 0),
                      t.j)
                    ) {
                      case 1:
                        x.translate(
                          C[s].animatorJustifyOffset +
                            t.justifyOffset +
                            (t.boxWidth - t.lineWidths[C[s].line]),
                          0,
                          0
                        );
                        break;
                      case 2:
                        x.translate(
                          C[s].animatorJustifyOffset +
                            t.justifyOffset +
                            (t.boxWidth - t.lineWidths[C[s].line]) / 2,
                          0,
                          0
                        );
                    }
                    x.translate(0, -t.ls),
                      x.translate(L, 0, 0),
                      x.translate(P[0] * C[s].an * 0.005, P[1] * B * 0.01, 0),
                      (r += C[s].l + 0.001 * t.tr * t.finalSize);
                  }
                  'html' === A
                    ? (tt = x.toCSS())
                    : 'svg' === A
                    ? (tt = x.to2dCSS())
                    : (et = [
                        x.props[0],
                        x.props[1],
                        x.props[2],
                        x.props[3],
                        x.props[4],
                        x.props[5],
                        x.props[6],
                        x.props[7],
                        x.props[8],
                        x.props[9],
                        x.props[10],
                        x.props[11],
                        x.props[12],
                        x.props[13],
                        x.props[14],
                        x.props[15],
                      ]),
                    (Y = z);
                }
                w <= s
                  ? ((I = new LetterProps(Y, q, W, U, tt, et)),
                    this.renderedLetters.push(I),
                    (w += 1),
                    (this.lettersChangedFlag = !0))
                  : ((I = this.renderedLetters[s]),
                    (this.lettersChangedFlag =
                      I.update(Y, q, W, U, tt, et) || this.lettersChangedFlag));
              }
            }
          }),
          (TextAnimatorProperty.prototype.getValue = function () {
            this._elem.globalData.frameId !== this._frameId &&
              ((this._frameId = this._elem.globalData.frameId),
              this.iterateDynamicProperties());
          }),
          (TextAnimatorProperty.prototype.mHelper = new Matrix()),
          (TextAnimatorProperty.prototype.defaultPropsArray = []),
          extendPrototype([DynamicPropertyContainer], TextAnimatorProperty),
          (ITextElement.prototype.initElement = function (t, e, r) {
            (this.lettersChangedFlag = !0),
              this.initFrame(),
              this.initBaseData(t, e, r),
              (this.textProperty = new TextProperty(
                this,
                t.t,
                this.dynamicProperties
              )),
              (this.textAnimator = new TextAnimatorProperty(
                t.t,
                this.renderType,
                this
              )),
              this.initTransform(t, e, r),
              this.initHierarchy(),
              this.initRenderable(),
              this.initRendererElement(),
              this.createContainerElements(),
              this.createRenderableComponents(),
              this.createContent(),
              this.hide(),
              this.textAnimator.searchProperties(this.dynamicProperties);
          }),
          (ITextElement.prototype.prepareFrame = function (t) {
            (this._mdf = !1),
              this.prepareRenderableFrame(t),
              this.prepareProperties(t, this.isInRange),
              (this.textProperty._mdf || this.textProperty._isFirstFrame) &&
                (this.buildNewText(),
                (this.textProperty._isFirstFrame = !1),
                (this.textProperty._mdf = !1));
          }),
          (ITextElement.prototype.createPathShape = function (t, e) {
            var r,
              i,
              s = e.length,
              a = '';
            for (r = 0; r < s; r += 1)
              'sh' === e[r].ty &&
                ((i = e[r].ks.k),
                (a += buildShapeString(i, i.i.length, !0, t)));
            return a;
          }),
          (ITextElement.prototype.updateDocumentData = function (t, e) {
            this.textProperty.updateDocumentData(t, e);
          }),
          (ITextElement.prototype.canResizeFont = function (t) {
            this.textProperty.canResizeFont(t);
          }),
          (ITextElement.prototype.setMinimumFontSize = function (t) {
            this.textProperty.setMinimumFontSize(t);
          }),
          (ITextElement.prototype.applyTextPropertiesToMatrix = function (
            t,
            e,
            r,
            i,
            s
          ) {
            switch (
              (t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0),
              e.translate(0, -t.ls, 0),
              t.j)
            ) {
              case 1:
                e.translate(
                  t.justifyOffset + (t.boxWidth - t.lineWidths[r]),
                  0,
                  0
                );
                break;
              case 2:
                e.translate(
                  t.justifyOffset + (t.boxWidth - t.lineWidths[r]) / 2,
                  0,
                  0
                );
            }
            e.translate(i, s, 0);
          }),
          (ITextElement.prototype.buildColor = function (t) {
            return (
              'rgb(' +
              Math.round(255 * t[0]) +
              ',' +
              Math.round(255 * t[1]) +
              ',' +
              Math.round(255 * t[2]) +
              ')'
            );
          }),
          (ITextElement.prototype.emptyProp = new LetterProps()),
          (ITextElement.prototype.destroy = function () {});
        var emptyShapeData = { shapes: [] };
        function SVGTextLottieElement(t, e, r) {
          (this.textSpans = []),
            (this.renderType = 'svg'),
            this.initElement(t, e, r);
        }
        function ISolidElement(t, e, r) {
          this.initElement(t, e, r);
        }
        function NullElement(t, e, r) {
          this.initFrame(),
            this.initBaseData(t, e, r),
            this.initFrame(),
            this.initTransform(t, e, r),
            this.initHierarchy();
        }
        function SVGRendererBase() {}
        function ICompElement() {}
        function SVGCompElement(t, e, r) {
          (this.layers = t.layers),
            (this.supports3d = !0),
            (this.completeLayers = !1),
            (this.pendingElements = []),
            (this.elements = this.layers
              ? createSizedArray(this.layers.length)
              : []),
            this.initElement(t, e, r),
            (this.tm = t.tm
              ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this)
              : { _placeholder: !0 });
        }
        function SVGRenderer(t, e) {
          (this.animationItem = t),
            (this.layers = null),
            (this.renderedFrame = -1),
            (this.svgElement = createNS('svg'));
          var r = '';
          if (e && e.title) {
            var i = createNS('title'),
              s = createElementID();
            i.setAttribute('id', s),
              (i.textContent = e.title),
              this.svgElement.appendChild(i),
              (r += s);
          }
          if (e && e.description) {
            var a = createNS('desc'),
              n = createElementID();
            a.setAttribute('id', n),
              (a.textContent = e.description),
              this.svgElement.appendChild(a),
              (r += ' ' + n);
          }
          r && this.svgElement.setAttribute('aria-labelledby', r);
          var o = createNS('defs');
          this.svgElement.appendChild(o);
          var h = createNS('g');
          this.svgElement.appendChild(h),
            (this.layerElement = h),
            (this.renderConfig = {
              preserveAspectRatio:
                (e && e.preserveAspectRatio) || 'xMidYMid meet',
              imagePreserveAspectRatio:
                (e && e.imagePreserveAspectRatio) || 'xMidYMid slice',
              contentVisibility: (e && e.contentVisibility) || 'visible',
              progressiveLoad: (e && e.progressiveLoad) || !1,
              hideOnTransparent: !(e && !1 === e.hideOnTransparent),
              viewBoxOnly: (e && e.viewBoxOnly) || !1,
              viewBoxSize: (e && e.viewBoxSize) || !1,
              className: (e && e.className) || '',
              id: (e && e.id) || '',
              focusable: e && e.focusable,
              filterSize: {
                width: (e && e.filterSize && e.filterSize.width) || '100%',
                height: (e && e.filterSize && e.filterSize.height) || '100%',
                x: (e && e.filterSize && e.filterSize.x) || '0%',
                y: (e && e.filterSize && e.filterSize.y) || '0%',
              },
              width: e && e.width,
              height: e && e.height,
            }),
            (this.globalData = {
              _mdf: !1,
              frameNum: -1,
              defs: o,
              renderConfig: this.renderConfig,
            }),
            (this.elements = []),
            (this.pendingElements = []),
            (this.destroyed = !1),
            (this.rendererType = 'svg');
        }
        function CVContextData() {
          var t;
          for (
            this.saved = [],
              this.cArrPos = 0,
              this.cTr = new Matrix(),
              this.cO = 1,
              this.savedOp = createTypedArray('float32', 15),
              t = 0;
            t < 15;
            t += 1
          )
            this.saved[t] = createTypedArray('float32', 16);
          this._length = 15;
        }
        function ShapeTransformManager() {
          (this.sequences = {}),
            (this.sequenceList = []),
            (this.transform_key_count = 0);
        }
        function CVEffects() {}
        function CVMaskElement(t, e) {
          var r;
          (this.data = t),
            (this.element = e),
            (this.masksProperties = this.data.masksProperties || []),
            (this.viewData = createSizedArray(this.masksProperties.length));
          var i = this.masksProperties.length,
            s = !1;
          for (r = 0; r < i; r += 1)
            'n' !== this.masksProperties[r].mode && (s = !0),
              (this.viewData[r] = ShapePropertyFactory.getShapeProp(
                this.element,
                this.masksProperties[r],
                3
              ));
          (this.hasMasks = s), s && this.element.addRenderableComponent(this);
        }
        function CVBaseElement() {}
        function CVShapeData(t, e, r, i) {
          (this.styledShapes = []), (this.tr = [0, 0, 0, 0, 0, 0]);
          var s,
            a = 4;
          'rc' === e.ty
            ? (a = 5)
            : 'el' === e.ty
            ? (a = 6)
            : 'sr' === e.ty && (a = 7),
            (this.sh = ShapePropertyFactory.getShapeProp(t, e, a, t));
          var n,
            o = r.length;
          for (s = 0; s < o; s += 1)
            r[s].closed ||
              ((n = {
                transforms: i.addTransformSequence(r[s].transforms),
                trNodes: [],
              }),
              this.styledShapes.push(n),
              r[s].elements.push(n));
        }
        function CVShapeElement(t, e, r) {
          (this.shapes = []),
            (this.shapesData = t.shapes),
            (this.stylesList = []),
            (this.itemsData = []),
            (this.prevViewData = []),
            (this.shapeModifiers = []),
            (this.processedElements = []),
            (this.transformsManager = new ShapeTransformManager()),
            this.initElement(t, e, r);
        }
        function CVTextElement(t, e, r) {
          (this.textSpans = []),
            (this.yOffset = 0),
            (this.fillColorAnim = !1),
            (this.strokeColorAnim = !1),
            (this.strokeWidthAnim = !1),
            (this.stroke = !1),
            (this.fill = !1),
            (this.justifyOffset = 0),
            (this.currentRender = null),
            (this.renderType = 'canvas'),
            (this.values = {
              fill: 'rgba(0,0,0,0)',
              stroke: 'rgba(0,0,0,0)',
              sWidth: 0,
              fValue: '',
            }),
            this.initElement(t, e, r);
        }
        function CVImageElement(t, e, r) {
          (this.assetData = e.getAssetData(t.refId)),
            (this.img = e.imageLoader.getAsset(this.assetData)),
            this.initElement(t, e, r);
        }
        function CVSolidElement(t, e, r) {
          this.initElement(t, e, r);
        }
        function CanvasRendererBase(t, e) {
          (this.animationItem = t),
            (this.renderConfig = {
              clearCanvas: !e || void 0 === e.clearCanvas || e.clearCanvas,
              context: (e && e.context) || null,
              progressiveLoad: (e && e.progressiveLoad) || !1,
              preserveAspectRatio:
                (e && e.preserveAspectRatio) || 'xMidYMid meet',
              imagePreserveAspectRatio:
                (e && e.imagePreserveAspectRatio) || 'xMidYMid slice',
              contentVisibility: (e && e.contentVisibility) || 'visible',
              className: (e && e.className) || '',
              id: (e && e.id) || '',
            }),
            (this.renderConfig.dpr = (e && e.dpr) || 1),
            this.animationItem.wrapper &&
              (this.renderConfig.dpr =
                (e && e.dpr) || window.devicePixelRatio || 1),
            (this.renderedFrame = -1),
            (this.globalData = {
              frameNum: -1,
              _mdf: !1,
              renderConfig: this.renderConfig,
              currentGlobalAlpha: -1,
            }),
            (this.contextData = new CVContextData()),
            (this.elements = []),
            (this.pendingElements = []),
            (this.transformMat = new Matrix()),
            (this.completeLayers = !1),
            (this.rendererType = 'canvas');
        }
        function CVCompElement(t, e, r) {
          (this.completeLayers = !1),
            (this.layers = t.layers),
            (this.pendingElements = []),
            (this.elements = createSizedArray(this.layers.length)),
            this.initElement(t, e, r),
            (this.tm = t.tm
              ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this)
              : { _placeholder: !0 });
        }
        function CanvasRenderer(t, e) {
          (this.animationItem = t),
            (this.renderConfig = {
              clearCanvas: !e || void 0 === e.clearCanvas || e.clearCanvas,
              context: (e && e.context) || null,
              progressiveLoad: (e && e.progressiveLoad) || !1,
              preserveAspectRatio:
                (e && e.preserveAspectRatio) || 'xMidYMid meet',
              imagePreserveAspectRatio:
                (e && e.imagePreserveAspectRatio) || 'xMidYMid slice',
              contentVisibility: (e && e.contentVisibility) || 'visible',
              className: (e && e.className) || '',
              id: (e && e.id) || '',
            }),
            (this.renderConfig.dpr = (e && e.dpr) || 1),
            this.animationItem.wrapper &&
              (this.renderConfig.dpr =
                (e && e.dpr) || window.devicePixelRatio || 1),
            (this.renderedFrame = -1),
            (this.globalData = {
              frameNum: -1,
              _mdf: !1,
              renderConfig: this.renderConfig,
              currentGlobalAlpha: -1,
            }),
            (this.contextData = new CVContextData()),
            (this.elements = []),
            (this.pendingElements = []),
            (this.transformMat = new Matrix()),
            (this.completeLayers = !1),
            (this.rendererType = 'canvas');
        }
        function HBaseElement() {}
        function HSolidElement(t, e, r) {
          this.initElement(t, e, r);
        }
        function HShapeElement(t, e, r) {
          (this.shapes = []),
            (this.shapesData = t.shapes),
            (this.stylesList = []),
            (this.shapeModifiers = []),
            (this.itemsData = []),
            (this.processedElements = []),
            (this.animatedContents = []),
            (this.shapesContainer = createNS('g')),
            this.initElement(t, e, r),
            (this.prevViewData = []),
            (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 });
        }
        function HTextElement(t, e, r) {
          (this.textSpans = []),
            (this.textPaths = []),
            (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 }),
            (this.renderType = 'svg'),
            (this.isMasked = !1),
            this.initElement(t, e, r);
        }
        function HCameraElement(t, e, r) {
          this.initFrame(), this.initBaseData(t, e, r), this.initHierarchy();
          var i = PropertyFactory.getProp;
          if (
            ((this.pe = i(this, t.pe, 0, 0, this)),
            t.ks.p.s
              ? ((this.px = i(this, t.ks.p.x, 1, 0, this)),
                (this.py = i(this, t.ks.p.y, 1, 0, this)),
                (this.pz = i(this, t.ks.p.z, 1, 0, this)))
              : (this.p = i(this, t.ks.p, 1, 0, this)),
            t.ks.a && (this.a = i(this, t.ks.a, 1, 0, this)),
            t.ks.or.k.length && t.ks.or.k[0].to)
          ) {
            var s,
              a = t.ks.or.k.length;
            for (s = 0; s < a; s += 1)
              (t.ks.or.k[s].to = null), (t.ks.or.k[s].ti = null);
          }
          (this.or = i(this, t.ks.or, 1, degToRads, this)),
            (this.or.sh = !0),
            (this.rx = i(this, t.ks.rx, 0, degToRads, this)),
            (this.ry = i(this, t.ks.ry, 0, degToRads, this)),
            (this.rz = i(this, t.ks.rz, 0, degToRads, this)),
            (this.mat = new Matrix()),
            (this._prevMat = new Matrix()),
            (this._isFirstFrame = !0),
            (this.finalTransform = { mProp: this });
        }
        function HImageElement(t, e, r) {
          (this.assetData = e.getAssetData(t.refId)), this.initElement(t, e, r);
        }
        function HybridRendererBase(t, e) {
          (this.animationItem = t),
            (this.layers = null),
            (this.renderedFrame = -1),
            (this.renderConfig = {
              className: (e && e.className) || '',
              imagePreserveAspectRatio:
                (e && e.imagePreserveAspectRatio) || 'xMidYMid slice',
              hideOnTransparent: !(e && !1 === e.hideOnTransparent),
              filterSize: {
                width: (e && e.filterSize && e.filterSize.width) || '400%',
                height: (e && e.filterSize && e.filterSize.height) || '400%',
                x: (e && e.filterSize && e.filterSize.x) || '-100%',
                y: (e && e.filterSize && e.filterSize.y) || '-100%',
              },
            }),
            (this.globalData = {
              _mdf: !1,
              frameNum: -1,
              renderConfig: this.renderConfig,
            }),
            (this.pendingElements = []),
            (this.elements = []),
            (this.threeDElements = []),
            (this.destroyed = !1),
            (this.camera = null),
            (this.supports3d = !0),
            (this.rendererType = 'html');
        }
        function HCompElement(t, e, r) {
          (this.layers = t.layers),
            (this.supports3d = !t.hasMask),
            (this.completeLayers = !1),
            (this.pendingElements = []),
            (this.elements = this.layers
              ? createSizedArray(this.layers.length)
              : []),
            this.initElement(t, e, r),
            (this.tm = t.tm
              ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this)
              : { _placeholder: !0 });
        }
        function HybridRenderer(t, e) {
          (this.animationItem = t),
            (this.layers = null),
            (this.renderedFrame = -1),
            (this.renderConfig = {
              className: (e && e.className) || '',
              imagePreserveAspectRatio:
                (e && e.imagePreserveAspectRatio) || 'xMidYMid slice',
              hideOnTransparent: !(e && !1 === e.hideOnTransparent),
              filterSize: {
                width: (e && e.filterSize && e.filterSize.width) || '400%',
                height: (e && e.filterSize && e.filterSize.height) || '400%',
                x: (e && e.filterSize && e.filterSize.x) || '-100%',
                y: (e && e.filterSize && e.filterSize.y) || '-100%',
              },
            }),
            (this.globalData = {
              _mdf: !1,
              frameNum: -1,
              renderConfig: this.renderConfig,
            }),
            (this.pendingElements = []),
            (this.elements = []),
            (this.threeDElements = []),
            (this.destroyed = !1),
            (this.camera = null),
            (this.supports3d = !0),
            (this.rendererType = 'html');
        }
        extendPrototype(
          [
            BaseElement,
            TransformElement,
            SVGBaseElement,
            HierarchyElement,
            FrameElement,
            RenderableDOMElement,
            ITextElement,
          ],
          SVGTextLottieElement
        ),
          (SVGTextLottieElement.prototype.createContent = function () {
            this.data.singleShape &&
              !this.globalData.fontManager.chars &&
              (this.textContainer = createNS('text'));
          }),
          (SVGTextLottieElement.prototype.buildTextContents = function (t) {
            for (var e = 0, r = t.length, i = [], s = ''; e < r; )
              t[e] === String.fromCharCode(13) ||
              t[e] === String.fromCharCode(3)
                ? (i.push(s), (s = ''))
                : (s += t[e]),
                (e += 1);
            return i.push(s), i;
          }),
          (SVGTextLottieElement.prototype.buildShapeData = function (t, e) {
            if (t.shapes && t.shapes.length) {
              var r = t.shapes[0];
              if (r.it) {
                var i = r.it[r.it.length - 1];
                i.s && ((i.s.k[0] = e), (i.s.k[1] = e));
              }
            }
            return t;
          }),
          (SVGTextLottieElement.prototype.buildNewText = function () {
            var t, e;
            this.addDynamicProperty(this);
            var r = this.textProperty.currentData;
            (this.renderedLetters = createSizedArray(r ? r.l.length : 0)),
              r.fc
                ? this.layerElement.setAttribute('fill', this.buildColor(r.fc))
                : this.layerElement.setAttribute('fill', 'rgba(0,0,0,0)'),
              r.sc &&
                (this.layerElement.setAttribute(
                  'stroke',
                  this.buildColor(r.sc)
                ),
                this.layerElement.setAttribute('stroke-width', r.sw)),
              this.layerElement.setAttribute('font-size', r.finalSize);
            var i = this.globalData.fontManager.getFontByName(r.f);
            if (i.fClass) this.layerElement.setAttribute('class', i.fClass);
            else {
              this.layerElement.setAttribute('font-family', i.fFamily);
              var s = r.fWeight,
                a = r.fStyle;
              this.layerElement.setAttribute('font-style', a),
                this.layerElement.setAttribute('font-weight', s);
            }
            this.layerElement.setAttribute('aria-label', r.t);
            var n,
              o = r.l || [],
              h = !!this.globalData.fontManager.chars;
            e = o.length;
            var l = this.mHelper,
              p = this.data.singleShape,
              c = 0,
              f = 0,
              d = !0,
              m = 0.001 * r.tr * r.finalSize;
            if (!p || h || r.sz) {
              var u,
                y = this.textSpans.length;
              for (t = 0; t < e; t += 1) {
                if (
                  (this.textSpans[t] ||
                    (this.textSpans[t] = {
                      span: null,
                      childSpan: null,
                      glyph: null,
                    }),
                  !h || !p || 0 === t)
                ) {
                  if (
                    ((n =
                      y > t
                        ? this.textSpans[t].span
                        : createNS(h ? 'g' : 'text')),
                    y <= t)
                  ) {
                    if (
                      (n.setAttribute('stroke-linecap', 'butt'),
                      n.setAttribute('stroke-linejoin', 'round'),
                      n.setAttribute('stroke-miterlimit', '4'),
                      (this.textSpans[t].span = n),
                      h)
                    ) {
                      var g = createNS('g');
                      n.appendChild(g), (this.textSpans[t].childSpan = g);
                    }
                    (this.textSpans[t].span = n),
                      this.layerElement.appendChild(n);
                  }
                  n.style.display = 'inherit';
                }
                if (
                  (l.reset(),
                  p &&
                    (o[t].n &&
                      ((c = -m), (f += r.yOffset), (f += d ? 1 : 0), (d = !1)),
                    this.applyTextPropertiesToMatrix(r, l, o[t].line, c, f),
                    (c += o[t].l || 0),
                    (c += m)),
                  h)
                ) {
                  var v;
                  if (
                    1 ===
                    (u = this.globalData.fontManager.getCharData(
                      r.finalText[t],
                      i.fStyle,
                      this.globalData.fontManager.getFontByName(r.f).fFamily
                    )).t
                  )
                    v = new SVGCompElement(u.data, this.globalData, this);
                  else {
                    var b = emptyShapeData;
                    u.data &&
                      u.data.shapes &&
                      (b = this.buildShapeData(u.data, r.finalSize)),
                      (v = new SVGShapeElement(b, this.globalData, this));
                  }
                  if (this.textSpans[t].glyph) {
                    var _ = this.textSpans[t].glyph;
                    this.textSpans[t].childSpan.removeChild(_.layerElement),
                      _.destroy();
                  }
                  (this.textSpans[t].glyph = v),
                    (v._debug = !0),
                    v.prepareFrame(0),
                    v.renderFrame(),
                    this.textSpans[t].childSpan.appendChild(v.layerElement),
                    1 === u.t &&
                      this.textSpans[t].childSpan.setAttribute(
                        'transform',
                        'scale(' +
                          r.finalSize / 100 +
                          ',' +
                          r.finalSize / 100 +
                          ')'
                      );
                } else
                  p &&
                    n.setAttribute(
                      'transform',
                      'translate(' + l.props[12] + ',' + l.props[13] + ')'
                    ),
                    (n.textContent = o[t].val),
                    n.setAttributeNS(
                      'http://www.w3.org/XML/1998/namespace',
                      'xml:space',
                      'preserve'
                    );
              }
              p && n && n.setAttribute('d', '');
            } else {
              var P = this.textContainer,
                E = 'start';
              switch (r.j) {
                case 1:
                  E = 'end';
                  break;
                case 2:
                  E = 'middle';
                  break;
                default:
                  E = 'start';
              }
              P.setAttribute('text-anchor', E),
                P.setAttribute('letter-spacing', m);
              var S = this.buildTextContents(r.finalText);
              for (
                e = S.length, f = r.ps ? r.ps[1] + r.ascent : 0, t = 0;
                t < e;
                t += 1
              )
                ((n = this.textSpans[t].span || createNS('tspan')).textContent =
                  S[t]),
                  n.setAttribute('x', 0),
                  n.setAttribute('y', f),
                  (n.style.display = 'inherit'),
                  P.appendChild(n),
                  this.textSpans[t] ||
                    (this.textSpans[t] = { span: null, glyph: null }),
                  (this.textSpans[t].span = n),
                  (f += r.finalLineHeight);
              this.layerElement.appendChild(P);
            }
            for (; t < this.textSpans.length; )
              (this.textSpans[t].span.style.display = 'none'), (t += 1);
            this._sizeChanged = !0;
          }),
          (SVGTextLottieElement.prototype.sourceRectAtTime = function () {
            if (
              (this.prepareFrame(this.comp.renderedFrame - this.data.st),
              this.renderInnerContent(),
              this._sizeChanged)
            ) {
              this._sizeChanged = !1;
              var t = this.layerElement.getBBox();
              this.bbox = {
                top: t.y,
                left: t.x,
                width: t.width,
                height: t.height,
              };
            }
            return this.bbox;
          }),
          (SVGTextLottieElement.prototype.getValue = function () {
            var t,
              e,
              r = this.textSpans.length;
            for (
              this.renderedFrame = this.comp.renderedFrame, t = 0;
              t < r;
              t += 1
            )
              (e = this.textSpans[t].glyph) &&
                (e.prepareFrame(this.comp.renderedFrame - this.data.st),
                e._mdf && (this._mdf = !0));
          }),
          (SVGTextLottieElement.prototype.renderInnerContent = function () {
            if (
              (!this.data.singleShape || this._mdf) &&
              (this.textAnimator.getMeasures(
                this.textProperty.currentData,
                this.lettersChangedFlag
              ),
              this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)
            ) {
              var t, e;
              this._sizeChanged = !0;
              var r,
                i,
                s,
                a = this.textAnimator.renderedLetters,
                n = this.textProperty.currentData.l;
              for (e = n.length, t = 0; t < e; t += 1)
                n[t].n ||
                  ((r = a[t]),
                  (i = this.textSpans[t].span),
                  (s = this.textSpans[t].glyph) && s.renderFrame(),
                  r._mdf.m && i.setAttribute('transform', r.m),
                  r._mdf.o && i.setAttribute('opacity', r.o),
                  r._mdf.sw && i.setAttribute('stroke-width', r.sw),
                  r._mdf.sc && i.setAttribute('stroke', r.sc),
                  r._mdf.fc && i.setAttribute('fill', r.fc));
            }
          }),
          extendPrototype([IImageElement], ISolidElement),
          (ISolidElement.prototype.createContent = function () {
            var t = createNS('rect');
            t.setAttribute('width', this.data.sw),
              t.setAttribute('height', this.data.sh),
              t.setAttribute('fill', this.data.sc),
              this.layerElement.appendChild(t);
          }),
          (NullElement.prototype.prepareFrame = function (t) {
            this.prepareProperties(t, !0);
          }),
          (NullElement.prototype.renderFrame = function () {}),
          (NullElement.prototype.getBaseElement = function () {
            return null;
          }),
          (NullElement.prototype.destroy = function () {}),
          (NullElement.prototype.sourceRectAtTime = function () {}),
          (NullElement.prototype.hide = function () {}),
          extendPrototype(
            [BaseElement, TransformElement, HierarchyElement, FrameElement],
            NullElement
          ),
          extendPrototype([BaseRenderer], SVGRendererBase),
          (SVGRendererBase.prototype.createNull = function (t) {
            return new NullElement(t, this.globalData, this);
          }),
          (SVGRendererBase.prototype.createShape = function (t) {
            return new SVGShapeElement(t, this.globalData, this);
          }),
          (SVGRendererBase.prototype.createText = function (t) {
            return new SVGTextLottieElement(t, this.globalData, this);
          }),
          (SVGRendererBase.prototype.createImage = function (t) {
            return new IImageElement(t, this.globalData, this);
          }),
          (SVGRendererBase.prototype.createSolid = function (t) {
            return new ISolidElement(t, this.globalData, this);
          }),
          (SVGRendererBase.prototype.configAnimation = function (t) {
            this.svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg'),
              this.renderConfig.viewBoxSize
                ? this.svgElement.setAttribute(
                    'viewBox',
                    this.renderConfig.viewBoxSize
                  )
                : this.svgElement.setAttribute(
                    'viewBox',
                    '0 0 ' + t.w + ' ' + t.h
                  ),
              this.renderConfig.viewBoxOnly ||
                (this.svgElement.setAttribute('width', t.w),
                this.svgElement.setAttribute('height', t.h),
                (this.svgElement.style.width = '100%'),
                (this.svgElement.style.height = '100%'),
                (this.svgElement.style.transform = 'translate3d(0,0,0)'),
                (this.svgElement.style.contentVisibility =
                  this.renderConfig.contentVisibility)),
              this.renderConfig.width &&
                this.svgElement.setAttribute('width', this.renderConfig.width),
              this.renderConfig.height &&
                this.svgElement.setAttribute(
                  'height',
                  this.renderConfig.height
                ),
              this.renderConfig.className &&
                this.svgElement.setAttribute(
                  'class',
                  this.renderConfig.className
                ),
              this.renderConfig.id &&
                this.svgElement.setAttribute('id', this.renderConfig.id),
              void 0 !== this.renderConfig.focusable &&
                this.svgElement.setAttribute(
                  'focusable',
                  this.renderConfig.focusable
                ),
              this.svgElement.setAttribute(
                'preserveAspectRatio',
                this.renderConfig.preserveAspectRatio
              ),
              this.animationItem.wrapper.appendChild(this.svgElement);
            var e = this.globalData.defs;
            this.setupGlobalData(t, e),
              (this.globalData.progressiveLoad =
                this.renderConfig.progressiveLoad),
              (this.data = t);
            var r = createNS('clipPath'),
              i = createNS('rect');
            i.setAttribute('width', t.w),
              i.setAttribute('height', t.h),
              i.setAttribute('x', 0),
              i.setAttribute('y', 0);
            var s = createElementID();
            r.setAttribute('id', s),
              r.appendChild(i),
              this.layerElement.setAttribute(
                'clip-path',
                'url(' + getLocationHref() + '#' + s + ')'
              ),
              e.appendChild(r),
              (this.layers = t.layers),
              (this.elements = createSizedArray(t.layers.length));
          }),
          (SVGRendererBase.prototype.destroy = function () {
            var t;
            this.animationItem.wrapper &&
              (this.animationItem.wrapper.innerText = ''),
              (this.layerElement = null),
              (this.globalData.defs = null);
            var e = this.layers ? this.layers.length : 0;
            for (t = 0; t < e; t += 1)
              this.elements[t] && this.elements[t].destroy();
            (this.elements.length = 0),
              (this.destroyed = !0),
              (this.animationItem = null);
          }),
          (SVGRendererBase.prototype.updateContainerSize = function () {}),
          (SVGRendererBase.prototype.buildItem = function (t) {
            var e = this.elements;
            if (!e[t] && 99 !== this.layers[t].ty) {
              e[t] = !0;
              var r = this.createItem(this.layers[t]);
              (e[t] = r),
                getExpressionsPlugin() &&
                  (0 === this.layers[t].ty &&
                    this.globalData.projectInterface.registerComposition(r),
                  r.initExpressions()),
                this.appendElementInPos(r, t),
                this.layers[t].tt &&
                  (this.elements[t - 1] && !0 !== this.elements[t - 1]
                    ? r.setMatte(e[t - 1].layerId)
                    : (this.buildItem(t - 1), this.addPendingElement(r)));
            }
          }),
          (SVGRendererBase.prototype.checkPendingElements = function () {
            for (; this.pendingElements.length; ) {
              var t = this.pendingElements.pop();
              if ((t.checkParenting(), t.data.tt))
                for (var e = 0, r = this.elements.length; e < r; ) {
                  if (this.elements[e] === t) {
                    t.setMatte(this.elements[e - 1].layerId);
                    break;
                  }
                  e += 1;
                }
            }
          }),
          (SVGRendererBase.prototype.renderFrame = function (t) {
            if (this.renderedFrame !== t && !this.destroyed) {
              var e;
              null === t ? (t = this.renderedFrame) : (this.renderedFrame = t),
                (this.globalData.frameNum = t),
                (this.globalData.frameId += 1),
                (this.globalData.projectInterface.currentFrame = t),
                (this.globalData._mdf = !1);
              var r = this.layers.length;
              for (
                this.completeLayers || this.checkLayers(t), e = r - 1;
                e >= 0;
                e -= 1
              )
                (this.completeLayers || this.elements[e]) &&
                  this.elements[e].prepareFrame(t - this.layers[e].st);
              if (this.globalData._mdf)
                for (e = 0; e < r; e += 1)
                  (this.completeLayers || this.elements[e]) &&
                    this.elements[e].renderFrame();
            }
          }),
          (SVGRendererBase.prototype.appendElementInPos = function (t, e) {
            var r = t.getBaseElement();
            if (r) {
              for (var i, s = 0; s < e; )
                this.elements[s] &&
                  !0 !== this.elements[s] &&
                  this.elements[s].getBaseElement() &&
                  (i = this.elements[s].getBaseElement()),
                  (s += 1);
              i
                ? this.layerElement.insertBefore(r, i)
                : this.layerElement.appendChild(r);
            }
          }),
          (SVGRendererBase.prototype.hide = function () {
            this.layerElement.style.display = 'none';
          }),
          (SVGRendererBase.prototype.show = function () {
            this.layerElement.style.display = 'block';
          }),
          extendPrototype(
            [
              BaseElement,
              TransformElement,
              HierarchyElement,
              FrameElement,
              RenderableDOMElement,
            ],
            ICompElement
          ),
          (ICompElement.prototype.initElement = function (t, e, r) {
            this.initFrame(),
              this.initBaseData(t, e, r),
              this.initTransform(t, e, r),
              this.initRenderable(),
              this.initHierarchy(),
              this.initRendererElement(),
              this.createContainerElements(),
              this.createRenderableComponents(),
              (!this.data.xt && e.progressiveLoad) || this.buildAllItems(),
              this.hide();
          }),
          (ICompElement.prototype.prepareFrame = function (t) {
            if (
              ((this._mdf = !1),
              this.prepareRenderableFrame(t),
              this.prepareProperties(t, this.isInRange),
              this.isInRange || this.data.xt)
            ) {
              if (this.tm._placeholder) this.renderedFrame = t / this.data.sr;
              else {
                var e = this.tm.v;
                e === this.data.op && (e = this.data.op - 1),
                  (this.renderedFrame = e);
              }
              var r,
                i = this.elements.length;
              for (
                this.completeLayers || this.checkLayers(this.renderedFrame),
                  r = i - 1;
                r >= 0;
                r -= 1
              )
                (this.completeLayers || this.elements[r]) &&
                  (this.elements[r].prepareFrame(
                    this.renderedFrame - this.layers[r].st
                  ),
                  this.elements[r]._mdf && (this._mdf = !0));
            }
          }),
          (ICompElement.prototype.renderInnerContent = function () {
            var t,
              e = this.layers.length;
            for (t = 0; t < e; t += 1)
              (this.completeLayers || this.elements[t]) &&
                this.elements[t].renderFrame();
          }),
          (ICompElement.prototype.setElements = function (t) {
            this.elements = t;
          }),
          (ICompElement.prototype.getElements = function () {
            return this.elements;
          }),
          (ICompElement.prototype.destroyElements = function () {
            var t,
              e = this.layers.length;
            for (t = 0; t < e; t += 1)
              this.elements[t] && this.elements[t].destroy();
          }),
          (ICompElement.prototype.destroy = function () {
            this.destroyElements(), this.destroyBaseElement();
          }),
          extendPrototype(
            [SVGRendererBase, ICompElement, SVGBaseElement],
            SVGCompElement
          ),
          (SVGCompElement.prototype.createComp = function (t) {
            return new SVGCompElement(t, this.globalData, this);
          }),
          extendPrototype([SVGRendererBase], SVGRenderer),
          (SVGRenderer.prototype.createComp = function (t) {
            return new SVGCompElement(t, this.globalData, this);
          }),
          (CVContextData.prototype.duplicate = function () {
            var t = 2 * this._length,
              e = this.savedOp;
            (this.savedOp = createTypedArray('float32', t)),
              this.savedOp.set(e);
            var r = 0;
            for (r = this._length; r < t; r += 1)
              this.saved[r] = createTypedArray('float32', 16);
            this._length = t;
          }),
          (CVContextData.prototype.reset = function () {
            (this.cArrPos = 0), this.cTr.reset(), (this.cO = 1);
          }),
          (ShapeTransformManager.prototype = {
            addTransformSequence: function (t) {
              var e,
                r = t.length,
                i = '_';
              for (e = 0; e < r; e += 1) i += t[e].transform.key + '_';
              var s = this.sequences[i];
              return (
                s ||
                  ((s = {
                    transforms: [].concat(t),
                    finalTransform: new Matrix(),
                    _mdf: !1,
                  }),
                  (this.sequences[i] = s),
                  this.sequenceList.push(s)),
                s
              );
            },
            processSequence: function (t, e) {
              for (
                var r, i = 0, s = t.transforms.length, a = e;
                i < s && !e;

              ) {
                if (t.transforms[i].transform.mProps._mdf) {
                  a = !0;
                  break;
                }
                i += 1;
              }
              if (a)
                for (t.finalTransform.reset(), i = s - 1; i >= 0; i -= 1)
                  (r = t.transforms[i].transform.mProps.v.props),
                    t.finalTransform.transform(
                      r[0],
                      r[1],
                      r[2],
                      r[3],
                      r[4],
                      r[5],
                      r[6],
                      r[7],
                      r[8],
                      r[9],
                      r[10],
                      r[11],
                      r[12],
                      r[13],
                      r[14],
                      r[15]
                    );
              t._mdf = a;
            },
            processSequences: function (t) {
              var e,
                r = this.sequenceList.length;
              for (e = 0; e < r; e += 1)
                this.processSequence(this.sequenceList[e], t);
            },
            getNewKey: function () {
              return (
                (this.transform_key_count += 1), '_' + this.transform_key_count
              );
            },
          }),
          (CVEffects.prototype.renderFrame = function () {}),
          (CVMaskElement.prototype.renderFrame = function () {
            if (this.hasMasks) {
              var t,
                e,
                r,
                i,
                s = this.element.finalTransform.mat,
                a = this.element.canvasContext,
                n = this.masksProperties.length;
              for (a.beginPath(), t = 0; t < n; t += 1)
                if ('n' !== this.masksProperties[t].mode) {
                  var o;
                  this.masksProperties[t].inv &&
                    (a.moveTo(0, 0),
                    a.lineTo(this.element.globalData.compSize.w, 0),
                    a.lineTo(
                      this.element.globalData.compSize.w,
                      this.element.globalData.compSize.h
                    ),
                    a.lineTo(0, this.element.globalData.compSize.h),
                    a.lineTo(0, 0)),
                    (i = this.viewData[t].v),
                    (e = s.applyToPointArray(i.v[0][0], i.v[0][1], 0)),
                    a.moveTo(e[0], e[1]);
                  var h = i._length;
                  for (o = 1; o < h; o += 1)
                    (r = s.applyToTriplePoints(i.o[o - 1], i.i[o], i.v[o])),
                      a.bezierCurveTo(r[0], r[1], r[2], r[3], r[4], r[5]);
                  (r = s.applyToTriplePoints(i.o[o - 1], i.i[0], i.v[0])),
                    a.bezierCurveTo(r[0], r[1], r[2], r[3], r[4], r[5]);
                }
              this.element.globalData.renderer.save(!0), a.clip();
            }
          }),
          (CVMaskElement.prototype.getMaskProperty =
            MaskElement.prototype.getMaskProperty),
          (CVMaskElement.prototype.destroy = function () {
            this.element = null;
          }),
          (CVBaseElement.prototype = {
            createElements: function () {},
            initRendererElement: function () {},
            createContainerElements: function () {
              (this.canvasContext = this.globalData.canvasContext),
                (this.renderableEffectsManager = new CVEffects(this));
            },
            createContent: function () {},
            setBlendMode: function () {
              var t = this.globalData;
              if (t.blendMode !== this.data.bm) {
                t.blendMode = this.data.bm;
                var e = getBlendMode(this.data.bm);
                t.canvasContext.globalCompositeOperation = e;
              }
            },
            createRenderableComponents: function () {
              this.maskManager = new CVMaskElement(this.data, this);
            },
            hideElement: function () {
              this.hidden ||
                (this.isInRange && !this.isTransparent) ||
                (this.hidden = !0);
            },
            showElement: function () {
              this.isInRange &&
                !this.isTransparent &&
                ((this.hidden = !1),
                (this._isFirstFrame = !0),
                (this.maskManager._isFirstFrame = !0));
            },
            renderFrame: function () {
              if (!this.hidden && !this.data.hd) {
                this.renderTransform(),
                  this.renderRenderable(),
                  this.setBlendMode();
                var t = 0 === this.data.ty;
                this.globalData.renderer.save(t),
                  this.globalData.renderer.ctxTransform(
                    this.finalTransform.mat.props
                  ),
                  this.globalData.renderer.ctxOpacity(
                    this.finalTransform.mProp.o.v
                  ),
                  this.renderInnerContent(),
                  this.globalData.renderer.restore(t),
                  this.maskManager.hasMasks &&
                    this.globalData.renderer.restore(!0),
                  this._isFirstFrame && (this._isFirstFrame = !1);
              }
            },
            destroy: function () {
              (this.canvasContext = null),
                (this.data = null),
                (this.globalData = null),
                this.maskManager.destroy();
            },
            mHelper: new Matrix(),
          }),
          (CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement),
          (CVBaseElement.prototype.show = CVBaseElement.prototype.showElement),
          (CVShapeData.prototype.setAsAnimated =
            SVGShapeData.prototype.setAsAnimated),
          extendPrototype(
            [
              BaseElement,
              TransformElement,
              CVBaseElement,
              IShapeElement,
              HierarchyElement,
              FrameElement,
              RenderableElement,
            ],
            CVShapeElement
          ),
          (CVShapeElement.prototype.initElement =
            RenderableDOMElement.prototype.initElement),
          (CVShapeElement.prototype.transformHelper = {
            opacity: 1,
            _opMdf: !1,
          }),
          (CVShapeElement.prototype.dashResetter = []),
          (CVShapeElement.prototype.createContent = function () {
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              !0,
              []
            );
          }),
          (CVShapeElement.prototype.createStyleElement = function (t, e) {
            var r = {
                data: t,
                type: t.ty,
                preTransforms: this.transformsManager.addTransformSequence(e),
                transforms: [],
                elements: [],
                closed: !0 === t.hd,
              },
              i = {};
            if (
              ('fl' === t.ty || 'st' === t.ty
                ? ((i.c = PropertyFactory.getProp(this, t.c, 1, 255, this)),
                  i.c.k ||
                    (r.co =
                      'rgb(' +
                      bmFloor(i.c.v[0]) +
                      ',' +
                      bmFloor(i.c.v[1]) +
                      ',' +
                      bmFloor(i.c.v[2]) +
                      ')'))
                : ('gf' !== t.ty && 'gs' !== t.ty) ||
                  ((i.s = PropertyFactory.getProp(this, t.s, 1, null, this)),
                  (i.e = PropertyFactory.getProp(this, t.e, 1, null, this)),
                  (i.h = PropertyFactory.getProp(
                    this,
                    t.h || { k: 0 },
                    0,
                    0.01,
                    this
                  )),
                  (i.a = PropertyFactory.getProp(
                    this,
                    t.a || { k: 0 },
                    0,
                    degToRads,
                    this
                  )),
                  (i.g = new GradientProperty(this, t.g, this))),
              (i.o = PropertyFactory.getProp(this, t.o, 0, 0.01, this)),
              'st' === t.ty || 'gs' === t.ty)
            ) {
              if (
                ((r.lc = lineCapEnum[t.lc || 2]),
                (r.lj = lineJoinEnum[t.lj || 2]),
                1 == t.lj && (r.ml = t.ml),
                (i.w = PropertyFactory.getProp(this, t.w, 0, null, this)),
                i.w.k || (r.wi = i.w.v),
                t.d)
              ) {
                var s = new DashProperty(this, t.d, 'canvas', this);
                (i.d = s),
                  i.d.k || ((r.da = i.d.dashArray), (r.do = i.d.dashoffset[0]));
              }
            } else r.r = 2 === t.r ? 'evenodd' : 'nonzero';
            return this.stylesList.push(r), (i.style = r), i;
          }),
          (CVShapeElement.prototype.createGroupElement = function () {
            return { it: [], prevViewData: [] };
          }),
          (CVShapeElement.prototype.createTransformElement = function (t) {
            return {
              transform: {
                opacity: 1,
                _opMdf: !1,
                key: this.transformsManager.getNewKey(),
                op: PropertyFactory.getProp(this, t.o, 0, 0.01, this),
                mProps: TransformPropertyFactory.getTransformProperty(
                  this,
                  t,
                  this
                ),
              },
            };
          }),
          (CVShapeElement.prototype.createShapeElement = function (t) {
            var e = new CVShapeData(
              this,
              t,
              this.stylesList,
              this.transformsManager
            );
            return this.shapes.push(e), this.addShapeToModifiers(e), e;
          }),
          (CVShapeElement.prototype.reloadShapes = function () {
            var t;
            this._isFirstFrame = !0;
            var e = this.itemsData.length;
            for (t = 0; t < e; t += 1) this.prevViewData[t] = this.itemsData[t];
            for (
              this.searchShapes(
                this.shapesData,
                this.itemsData,
                this.prevViewData,
                !0,
                []
              ),
                e = this.dynamicProperties.length,
                t = 0;
              t < e;
              t += 1
            )
              this.dynamicProperties[t].getValue();
            this.renderModifiers(),
              this.transformsManager.processSequences(this._isFirstFrame);
          }),
          (CVShapeElement.prototype.addTransformToStyleList = function (t) {
            var e,
              r = this.stylesList.length;
            for (e = 0; e < r; e += 1)
              this.stylesList[e].closed ||
                this.stylesList[e].transforms.push(t);
          }),
          (CVShapeElement.prototype.removeTransformFromStyleList = function () {
            var t,
              e = this.stylesList.length;
            for (t = 0; t < e; t += 1)
              this.stylesList[t].closed || this.stylesList[t].transforms.pop();
          }),
          (CVShapeElement.prototype.closeStyles = function (t) {
            var e,
              r = t.length;
            for (e = 0; e < r; e += 1) t[e].closed = !0;
          }),
          (CVShapeElement.prototype.searchShapes = function (t, e, r, i, s) {
            var a,
              n,
              o,
              h,
              l,
              p,
              c = t.length - 1,
              f = [],
              d = [],
              m = [].concat(s);
            for (a = c; a >= 0; a -= 1) {
              if (
                ((h = this.searchProcessedElement(t[a]))
                  ? (e[a] = r[h - 1])
                  : (t[a]._shouldRender = i),
                'fl' === t[a].ty ||
                  'st' === t[a].ty ||
                  'gf' === t[a].ty ||
                  'gs' === t[a].ty)
              )
                h
                  ? (e[a].style.closed = !1)
                  : (e[a] = this.createStyleElement(t[a], m)),
                  f.push(e[a].style);
              else if ('gr' === t[a].ty) {
                if (h)
                  for (o = e[a].it.length, n = 0; n < o; n += 1)
                    e[a].prevViewData[n] = e[a].it[n];
                else e[a] = this.createGroupElement(t[a]);
                this.searchShapes(t[a].it, e[a].it, e[a].prevViewData, i, m);
              } else
                'tr' === t[a].ty
                  ? (h || ((p = this.createTransformElement(t[a])), (e[a] = p)),
                    m.push(e[a]),
                    this.addTransformToStyleList(e[a]))
                  : 'sh' === t[a].ty ||
                    'rc' === t[a].ty ||
                    'el' === t[a].ty ||
                    'sr' === t[a].ty
                  ? h || (e[a] = this.createShapeElement(t[a]))
                  : 'tm' === t[a].ty || 'rd' === t[a].ty || 'pb' === t[a].ty
                  ? (h
                      ? ((l = e[a]).closed = !1)
                      : ((l = ShapeModifiers.getModifier(t[a].ty)).init(
                          this,
                          t[a]
                        ),
                        (e[a] = l),
                        this.shapeModifiers.push(l)),
                    d.push(l))
                  : 'rp' === t[a].ty &&
                    (h
                      ? ((l = e[a]).closed = !0)
                      : ((l = ShapeModifiers.getModifier(t[a].ty)),
                        (e[a] = l),
                        l.init(this, t, a, e),
                        this.shapeModifiers.push(l),
                        (i = !1)),
                    d.push(l));
              this.addProcessedElement(t[a], a + 1);
            }
            for (
              this.removeTransformFromStyleList(),
                this.closeStyles(f),
                c = d.length,
                a = 0;
              a < c;
              a += 1
            )
              d[a].closed = !0;
          }),
          (CVShapeElement.prototype.renderInnerContent = function () {
            (this.transformHelper.opacity = 1),
              (this.transformHelper._opMdf = !1),
              this.renderModifiers(),
              this.transformsManager.processSequences(this._isFirstFrame),
              this.renderShape(
                this.transformHelper,
                this.shapesData,
                this.itemsData,
                !0
              );
          }),
          (CVShapeElement.prototype.renderShapeTransform = function (t, e) {
            (t._opMdf || e.op._mdf || this._isFirstFrame) &&
              ((e.opacity = t.opacity), (e.opacity *= e.op.v), (e._opMdf = !0));
          }),
          (CVShapeElement.prototype.drawLayer = function () {
            var t,
              e,
              r,
              i,
              s,
              a,
              n,
              o,
              h,
              l = this.stylesList.length,
              p = this.globalData.renderer,
              c = this.globalData.canvasContext;
            for (t = 0; t < l; t += 1)
              if (
                (('st' !== (o = (h = this.stylesList[t]).type) && 'gs' !== o) ||
                  0 !== h.wi) &&
                h.data._shouldRender &&
                0 !== h.coOp &&
                0 !== this.globalData.currentGlobalAlpha
              ) {
                for (
                  p.save(),
                    a = h.elements,
                    'st' === o || 'gs' === o
                      ? ((c.strokeStyle = 'st' === o ? h.co : h.grd),
                        (c.lineWidth = h.wi),
                        (c.lineCap = h.lc),
                        (c.lineJoin = h.lj),
                        (c.miterLimit = h.ml || 0))
                      : (c.fillStyle = 'fl' === o ? h.co : h.grd),
                    p.ctxOpacity(h.coOp),
                    'st' !== o && 'gs' !== o && c.beginPath(),
                    p.ctxTransform(h.preTransforms.finalTransform.props),
                    r = a.length,
                    e = 0;
                  e < r;
                  e += 1
                ) {
                  for (
                    ('st' !== o && 'gs' !== o) ||
                      (c.beginPath(),
                      h.da && (c.setLineDash(h.da), (c.lineDashOffset = h.do))),
                      s = (n = a[e].trNodes).length,
                      i = 0;
                    i < s;
                    i += 1
                  )
                    'm' === n[i].t
                      ? c.moveTo(n[i].p[0], n[i].p[1])
                      : 'c' === n[i].t
                      ? c.bezierCurveTo(
                          n[i].pts[0],
                          n[i].pts[1],
                          n[i].pts[2],
                          n[i].pts[3],
                          n[i].pts[4],
                          n[i].pts[5]
                        )
                      : c.closePath();
                  ('st' !== o && 'gs' !== o) ||
                    (c.stroke(), h.da && c.setLineDash(this.dashResetter));
                }
                'st' !== o && 'gs' !== o && c.fill(h.r), p.restore();
              }
          }),
          (CVShapeElement.prototype.renderShape = function (t, e, r, i) {
            var s, a;
            for (a = t, s = e.length - 1; s >= 0; s -= 1)
              'tr' === e[s].ty
                ? ((a = r[s].transform), this.renderShapeTransform(t, a))
                : 'sh' === e[s].ty ||
                  'el' === e[s].ty ||
                  'rc' === e[s].ty ||
                  'sr' === e[s].ty
                ? this.renderPath(e[s], r[s])
                : 'fl' === e[s].ty
                ? this.renderFill(e[s], r[s], a)
                : 'st' === e[s].ty
                ? this.renderStroke(e[s], r[s], a)
                : 'gf' === e[s].ty || 'gs' === e[s].ty
                ? this.renderGradientFill(e[s], r[s], a)
                : 'gr' === e[s].ty
                ? this.renderShape(a, e[s].it, r[s].it)
                : e[s].ty;
            i && this.drawLayer();
          }),
          (CVShapeElement.prototype.renderStyledShape = function (t, e) {
            if (this._isFirstFrame || e._mdf || t.transforms._mdf) {
              var r,
                i,
                s,
                a = t.trNodes,
                n = e.paths,
                o = n._length;
              a.length = 0;
              var h = t.transforms.finalTransform;
              for (s = 0; s < o; s += 1) {
                var l = n.shapes[s];
                if (l && l.v) {
                  for (i = l._length, r = 1; r < i; r += 1)
                    1 === r &&
                      a.push({
                        t: 'm',
                        p: h.applyToPointArray(l.v[0][0], l.v[0][1], 0),
                      }),
                      a.push({
                        t: 'c',
                        pts: h.applyToTriplePoints(l.o[r - 1], l.i[r], l.v[r]),
                      });
                  1 === i &&
                    a.push({
                      t: 'm',
                      p: h.applyToPointArray(l.v[0][0], l.v[0][1], 0),
                    }),
                    l.c &&
                      i &&
                      (a.push({
                        t: 'c',
                        pts: h.applyToTriplePoints(l.o[r - 1], l.i[0], l.v[0]),
                      }),
                      a.push({ t: 'z' }));
                }
              }
              t.trNodes = a;
            }
          }),
          (CVShapeElement.prototype.renderPath = function (t, e) {
            if (!0 !== t.hd && t._shouldRender) {
              var r,
                i = e.styledShapes.length;
              for (r = 0; r < i; r += 1)
                this.renderStyledShape(e.styledShapes[r], e.sh);
            }
          }),
          (CVShapeElement.prototype.renderFill = function (t, e, r) {
            var i = e.style;
            (e.c._mdf || this._isFirstFrame) &&
              (i.co =
                'rgb(' +
                bmFloor(e.c.v[0]) +
                ',' +
                bmFloor(e.c.v[1]) +
                ',' +
                bmFloor(e.c.v[2]) +
                ')'),
              (e.o._mdf || r._opMdf || this._isFirstFrame) &&
                (i.coOp = e.o.v * r.opacity);
          }),
          (CVShapeElement.prototype.renderGradientFill = function (t, e, r) {
            var i,
              s = e.style;
            if (
              !s.grd ||
              e.g._mdf ||
              e.s._mdf ||
              e.e._mdf ||
              (1 !== t.t && (e.h._mdf || e.a._mdf))
            ) {
              var a,
                n = this.globalData.canvasContext,
                o = e.s.v,
                h = e.e.v;
              if (1 === t.t) i = n.createLinearGradient(o[0], o[1], h[0], h[1]);
              else {
                var l = Math.sqrt(
                    Math.pow(o[0] - h[0], 2) + Math.pow(o[1] - h[1], 2)
                  ),
                  p = Math.atan2(h[1] - o[1], h[0] - o[0]),
                  c = e.h.v;
                c >= 1 ? (c = 0.99) : c <= -1 && (c = -0.99);
                var f = l * c,
                  d = Math.cos(p + e.a.v) * f + o[0],
                  m = Math.sin(p + e.a.v) * f + o[1];
                i = n.createRadialGradient(d, m, 0, o[0], o[1], l);
              }
              var u = t.g.p,
                y = e.g.c,
                g = 1;
              for (a = 0; a < u; a += 1)
                e.g._hasOpacity && e.g._collapsable && (g = e.g.o[2 * a + 1]),
                  i.addColorStop(
                    y[4 * a] / 100,
                    'rgba(' +
                      y[4 * a + 1] +
                      ',' +
                      y[4 * a + 2] +
                      ',' +
                      y[4 * a + 3] +
                      ',' +
                      g +
                      ')'
                  );
              s.grd = i;
            }
            s.coOp = e.o.v * r.opacity;
          }),
          (CVShapeElement.prototype.renderStroke = function (t, e, r) {
            var i = e.style,
              s = e.d;
            s &&
              (s._mdf || this._isFirstFrame) &&
              ((i.da = s.dashArray), (i.do = s.dashoffset[0])),
              (e.c._mdf || this._isFirstFrame) &&
                (i.co =
                  'rgb(' +
                  bmFloor(e.c.v[0]) +
                  ',' +
                  bmFloor(e.c.v[1]) +
                  ',' +
                  bmFloor(e.c.v[2]) +
                  ')'),
              (e.o._mdf || r._opMdf || this._isFirstFrame) &&
                (i.coOp = e.o.v * r.opacity),
              (e.w._mdf || this._isFirstFrame) && (i.wi = e.w.v);
          }),
          (CVShapeElement.prototype.destroy = function () {
            (this.shapesData = null),
              (this.globalData = null),
              (this.canvasContext = null),
              (this.stylesList.length = 0),
              (this.itemsData.length = 0);
          }),
          extendPrototype(
            [
              BaseElement,
              TransformElement,
              CVBaseElement,
              HierarchyElement,
              FrameElement,
              RenderableElement,
              ITextElement,
            ],
            CVTextElement
          ),
          (CVTextElement.prototype.tHelper =
            createTag('canvas').getContext('2d')),
          (CVTextElement.prototype.buildNewText = function () {
            var t = this.textProperty.currentData;
            this.renderedLetters = createSizedArray(t.l ? t.l.length : 0);
            var e = !1;
            t.fc
              ? ((e = !0), (this.values.fill = this.buildColor(t.fc)))
              : (this.values.fill = 'rgba(0,0,0,0)'),
              (this.fill = e);
            var r = !1;
            t.sc &&
              ((r = !0),
              (this.values.stroke = this.buildColor(t.sc)),
              (this.values.sWidth = t.sw));
            var i,
              s,
              a,
              n,
              o,
              h,
              l,
              p,
              c,
              f,
              d,
              m,
              u = this.globalData.fontManager.getFontByName(t.f),
              y = t.l,
              g = this.mHelper;
            (this.stroke = r),
              (this.values.fValue =
                t.finalSize +
                'px ' +
                this.globalData.fontManager.getFontByName(t.f).fFamily),
              (s = t.finalText.length);
            var v = this.data.singleShape,
              b = 0.001 * t.tr * t.finalSize,
              _ = 0,
              P = 0,
              E = !0,
              S = 0;
            for (i = 0; i < s; i += 1) {
              (n =
                ((a = this.globalData.fontManager.getCharData(
                  t.finalText[i],
                  u.fStyle,
                  this.globalData.fontManager.getFontByName(t.f).fFamily
                )) &&
                  a.data) ||
                {}),
                g.reset(),
                v &&
                  y[i].n &&
                  ((_ = -b), (P += t.yOffset), (P += E ? 1 : 0), (E = !1)),
                (c = (l = n.shapes ? n.shapes[0].it : []).length),
                g.scale(t.finalSize / 100, t.finalSize / 100),
                v && this.applyTextPropertiesToMatrix(t, g, y[i].line, _, P),
                (d = createSizedArray(c - 1));
              var x = 0;
              for (p = 0; p < c; p += 1)
                if ('sh' === l[p].ty) {
                  for (
                    h = l[p].ks.k.i.length, f = l[p].ks.k, m = [], o = 1;
                    o < h;
                    o += 1
                  )
                    1 === o &&
                      m.push(
                        g.applyToX(f.v[0][0], f.v[0][1], 0),
                        g.applyToY(f.v[0][0], f.v[0][1], 0)
                      ),
                      m.push(
                        g.applyToX(f.o[o - 1][0], f.o[o - 1][1], 0),
                        g.applyToY(f.o[o - 1][0], f.o[o - 1][1], 0),
                        g.applyToX(f.i[o][0], f.i[o][1], 0),
                        g.applyToY(f.i[o][0], f.i[o][1], 0),
                        g.applyToX(f.v[o][0], f.v[o][1], 0),
                        g.applyToY(f.v[o][0], f.v[o][1], 0)
                      );
                  m.push(
                    g.applyToX(f.o[o - 1][0], f.o[o - 1][1], 0),
                    g.applyToY(f.o[o - 1][0], f.o[o - 1][1], 0),
                    g.applyToX(f.i[0][0], f.i[0][1], 0),
                    g.applyToY(f.i[0][0], f.i[0][1], 0),
                    g.applyToX(f.v[0][0], f.v[0][1], 0),
                    g.applyToY(f.v[0][0], f.v[0][1], 0)
                  ),
                    (d[x] = m),
                    (x += 1);
                }
              v && ((_ += y[i].l), (_ += b)),
                this.textSpans[S]
                  ? (this.textSpans[S].elem = d)
                  : (this.textSpans[S] = { elem: d }),
                (S += 1);
            }
          }),
          (CVTextElement.prototype.renderInnerContent = function () {
            var t,
              e,
              r,
              i,
              s,
              a,
              n = this.canvasContext;
            (n.font = this.values.fValue),
              (n.lineCap = 'butt'),
              (n.lineJoin = 'miter'),
              (n.miterLimit = 4),
              this.data.singleShape ||
                this.textAnimator.getMeasures(
                  this.textProperty.currentData,
                  this.lettersChangedFlag
                );
            var o,
              h = this.textAnimator.renderedLetters,
              l = this.textProperty.currentData.l;
            e = l.length;
            var p,
              c,
              f = null,
              d = null,
              m = null;
            for (t = 0; t < e; t += 1)
              if (!l[t].n) {
                if (
                  ((o = h[t]) &&
                    (this.globalData.renderer.save(),
                    this.globalData.renderer.ctxTransform(o.p),
                    this.globalData.renderer.ctxOpacity(o.o)),
                  this.fill)
                ) {
                  for (
                    o && o.fc
                      ? f !== o.fc && ((f = o.fc), (n.fillStyle = o.fc))
                      : f !== this.values.fill &&
                        ((f = this.values.fill),
                        (n.fillStyle = this.values.fill)),
                      i = (p = this.textSpans[t].elem).length,
                      this.globalData.canvasContext.beginPath(),
                      r = 0;
                    r < i;
                    r += 1
                  )
                    for (
                      a = (c = p[r]).length,
                        this.globalData.canvasContext.moveTo(c[0], c[1]),
                        s = 2;
                      s < a;
                      s += 6
                    )
                      this.globalData.canvasContext.bezierCurveTo(
                        c[s],
                        c[s + 1],
                        c[s + 2],
                        c[s + 3],
                        c[s + 4],
                        c[s + 5]
                      );
                  this.globalData.canvasContext.closePath(),
                    this.globalData.canvasContext.fill();
                }
                if (this.stroke) {
                  for (
                    o && o.sw
                      ? m !== o.sw && ((m = o.sw), (n.lineWidth = o.sw))
                      : m !== this.values.sWidth &&
                        ((m = this.values.sWidth),
                        (n.lineWidth = this.values.sWidth)),
                      o && o.sc
                        ? d !== o.sc && ((d = o.sc), (n.strokeStyle = o.sc))
                        : d !== this.values.stroke &&
                          ((d = this.values.stroke),
                          (n.strokeStyle = this.values.stroke)),
                      i = (p = this.textSpans[t].elem).length,
                      this.globalData.canvasContext.beginPath(),
                      r = 0;
                    r < i;
                    r += 1
                  )
                    for (
                      a = (c = p[r]).length,
                        this.globalData.canvasContext.moveTo(c[0], c[1]),
                        s = 2;
                      s < a;
                      s += 6
                    )
                      this.globalData.canvasContext.bezierCurveTo(
                        c[s],
                        c[s + 1],
                        c[s + 2],
                        c[s + 3],
                        c[s + 4],
                        c[s + 5]
                      );
                  this.globalData.canvasContext.closePath(),
                    this.globalData.canvasContext.stroke();
                }
                o && this.globalData.renderer.restore();
              }
          }),
          extendPrototype(
            [
              BaseElement,
              TransformElement,
              CVBaseElement,
              HierarchyElement,
              FrameElement,
              RenderableElement,
            ],
            CVImageElement
          ),
          (CVImageElement.prototype.initElement =
            SVGShapeElement.prototype.initElement),
          (CVImageElement.prototype.prepareFrame =
            IImageElement.prototype.prepareFrame),
          (CVImageElement.prototype.createContent = function () {
            if (
              this.img.width &&
              (this.assetData.w !== this.img.width ||
                this.assetData.h !== this.img.height)
            ) {
              var t = createTag('canvas');
              (t.width = this.assetData.w), (t.height = this.assetData.h);
              var e,
                r,
                i = t.getContext('2d'),
                s = this.img.width,
                a = this.img.height,
                n = s / a,
                o = this.assetData.w / this.assetData.h,
                h =
                  this.assetData.pr ||
                  this.globalData.renderConfig.imagePreserveAspectRatio;
              (n > o && 'xMidYMid slice' === h) ||
              (n < o && 'xMidYMid slice' !== h)
                ? (e = (r = a) * o)
                : (r = (e = s) / o),
                i.drawImage(
                  this.img,
                  (s - e) / 2,
                  (a - r) / 2,
                  e,
                  r,
                  0,
                  0,
                  this.assetData.w,
                  this.assetData.h
                ),
                (this.img = t);
            }
          }),
          (CVImageElement.prototype.renderInnerContent = function () {
            this.canvasContext.drawImage(this.img, 0, 0);
          }),
          (CVImageElement.prototype.destroy = function () {
            this.img = null;
          }),
          extendPrototype(
            [
              BaseElement,
              TransformElement,
              CVBaseElement,
              HierarchyElement,
              FrameElement,
              RenderableElement,
            ],
            CVSolidElement
          ),
          (CVSolidElement.prototype.initElement =
            SVGShapeElement.prototype.initElement),
          (CVSolidElement.prototype.prepareFrame =
            IImageElement.prototype.prepareFrame),
          (CVSolidElement.prototype.renderInnerContent = function () {
            var t = this.canvasContext;
            (t.fillStyle = this.data.sc),
              t.fillRect(0, 0, this.data.sw, this.data.sh);
          }),
          extendPrototype([BaseRenderer], CanvasRendererBase),
          (CanvasRendererBase.prototype.createShape = function (t) {
            return new CVShapeElement(t, this.globalData, this);
          }),
          (CanvasRendererBase.prototype.createText = function (t) {
            return new CVTextElement(t, this.globalData, this);
          }),
          (CanvasRendererBase.prototype.createImage = function (t) {
            return new CVImageElement(t, this.globalData, this);
          }),
          (CanvasRendererBase.prototype.createSolid = function (t) {
            return new CVSolidElement(t, this.globalData, this);
          }),
          (CanvasRendererBase.prototype.createNull =
            SVGRenderer.prototype.createNull),
          (CanvasRendererBase.prototype.ctxTransform = function (t) {
            if (
              1 !== t[0] ||
              0 !== t[1] ||
              0 !== t[4] ||
              1 !== t[5] ||
              0 !== t[12] ||
              0 !== t[13]
            )
              if (this.renderConfig.clearCanvas) {
                this.transformMat.cloneFromProps(t);
                var e = this.contextData.cTr.props;
                this.transformMat.transform(
                  e[0],
                  e[1],
                  e[2],
                  e[3],
                  e[4],
                  e[5],
                  e[6],
                  e[7],
                  e[8],
                  e[9],
                  e[10],
                  e[11],
                  e[12],
                  e[13],
                  e[14],
                  e[15]
                ),
                  this.contextData.cTr.cloneFromProps(this.transformMat.props);
                var r = this.contextData.cTr.props;
                this.canvasContext.setTransform(
                  r[0],
                  r[1],
                  r[4],
                  r[5],
                  r[12],
                  r[13]
                );
              } else
                this.canvasContext.transform(
                  t[0],
                  t[1],
                  t[4],
                  t[5],
                  t[12],
                  t[13]
                );
          }),
          (CanvasRendererBase.prototype.ctxOpacity = function (t) {
            if (!this.renderConfig.clearCanvas)
              return (
                (this.canvasContext.globalAlpha *= t < 0 ? 0 : t),
                void (this.globalData.currentGlobalAlpha = this.contextData.cO)
              );
            (this.contextData.cO *= t < 0 ? 0 : t),
              this.globalData.currentGlobalAlpha !== this.contextData.cO &&
                ((this.canvasContext.globalAlpha = this.contextData.cO),
                (this.globalData.currentGlobalAlpha = this.contextData.cO));
          }),
          (CanvasRendererBase.prototype.reset = function () {
            this.renderConfig.clearCanvas
              ? this.contextData.reset()
              : this.canvasContext.restore();
          }),
          (CanvasRendererBase.prototype.save = function (t) {
            if (this.renderConfig.clearCanvas) {
              t && this.canvasContext.save();
              var e,
                r = this.contextData.cTr.props;
              this.contextData._length <= this.contextData.cArrPos &&
                this.contextData.duplicate();
              var i = this.contextData.saved[this.contextData.cArrPos];
              for (e = 0; e < 16; e += 1) i[e] = r[e];
              (this.contextData.savedOp[this.contextData.cArrPos] =
                this.contextData.cO),
                (this.contextData.cArrPos += 1);
            } else this.canvasContext.save();
          }),
          (CanvasRendererBase.prototype.restore = function (t) {
            if (this.renderConfig.clearCanvas) {
              t &&
                (this.canvasContext.restore(),
                (this.globalData.blendMode = 'source-over')),
                (this.contextData.cArrPos -= 1);
              var e,
                r = this.contextData.saved[this.contextData.cArrPos],
                i = this.contextData.cTr.props;
              for (e = 0; e < 16; e += 1) i[e] = r[e];
              this.canvasContext.setTransform(
                r[0],
                r[1],
                r[4],
                r[5],
                r[12],
                r[13]
              ),
                (r = this.contextData.savedOp[this.contextData.cArrPos]),
                (this.contextData.cO = r),
                this.globalData.currentGlobalAlpha !== r &&
                  ((this.canvasContext.globalAlpha = r),
                  (this.globalData.currentGlobalAlpha = r));
            } else this.canvasContext.restore();
          }),
          (CanvasRendererBase.prototype.configAnimation = function (t) {
            if (this.animationItem.wrapper) {
              this.animationItem.container = createTag('canvas');
              var e = this.animationItem.container.style;
              (e.width = '100%'), (e.height = '100%');
              var r = '0px 0px 0px';
              (e.transformOrigin = r),
                (e.mozTransformOrigin = r),
                (e.webkitTransformOrigin = r),
                (e['-webkit-transform'] = r),
                (e.contentVisibility = this.renderConfig.contentVisibility),
                this.animationItem.wrapper.appendChild(
                  this.animationItem.container
                ),
                (this.canvasContext =
                  this.animationItem.container.getContext('2d')),
                this.renderConfig.className &&
                  this.animationItem.container.setAttribute(
                    'class',
                    this.renderConfig.className
                  ),
                this.renderConfig.id &&
                  this.animationItem.container.setAttribute(
                    'id',
                    this.renderConfig.id
                  );
            } else this.canvasContext = this.renderConfig.context;
            (this.data = t),
              (this.layers = t.layers),
              (this.transformCanvas = {
                w: t.w,
                h: t.h,
                sx: 0,
                sy: 0,
                tx: 0,
                ty: 0,
              }),
              this.setupGlobalData(t, document.body),
              (this.globalData.canvasContext = this.canvasContext),
              (this.globalData.renderer = this),
              (this.globalData.isDashed = !1),
              (this.globalData.progressiveLoad =
                this.renderConfig.progressiveLoad),
              (this.globalData.transformCanvas = this.transformCanvas),
              (this.elements = createSizedArray(t.layers.length)),
              this.updateContainerSize();
          }),
          (CanvasRendererBase.prototype.updateContainerSize = function () {
            var t, e, r, i;
            if (
              (this.reset(),
              this.animationItem.wrapper && this.animationItem.container
                ? ((t = this.animationItem.wrapper.offsetWidth),
                  (e = this.animationItem.wrapper.offsetHeight),
                  this.animationItem.container.setAttribute(
                    'width',
                    t * this.renderConfig.dpr
                  ),
                  this.animationItem.container.setAttribute(
                    'height',
                    e * this.renderConfig.dpr
                  ))
                : ((t =
                    this.canvasContext.canvas.width * this.renderConfig.dpr),
                  (e =
                    this.canvasContext.canvas.height * this.renderConfig.dpr)),
              -1 !== this.renderConfig.preserveAspectRatio.indexOf('meet') ||
                -1 !== this.renderConfig.preserveAspectRatio.indexOf('slice'))
            ) {
              var s = this.renderConfig.preserveAspectRatio.split(' '),
                a = s[1] || 'meet',
                n = s[0] || 'xMidYMid',
                o = n.substr(0, 4),
                h = n.substr(4);
              (r = t / e),
                ((i = this.transformCanvas.w / this.transformCanvas.h) > r &&
                  'meet' === a) ||
                (i < r && 'slice' === a)
                  ? ((this.transformCanvas.sx =
                      t / (this.transformCanvas.w / this.renderConfig.dpr)),
                    (this.transformCanvas.sy =
                      t / (this.transformCanvas.w / this.renderConfig.dpr)))
                  : ((this.transformCanvas.sx =
                      e / (this.transformCanvas.h / this.renderConfig.dpr)),
                    (this.transformCanvas.sy =
                      e / (this.transformCanvas.h / this.renderConfig.dpr))),
                (this.transformCanvas.tx =
                  'xMid' === o &&
                  ((i < r && 'meet' === a) || (i > r && 'slice' === a))
                    ? ((t -
                        this.transformCanvas.w * (e / this.transformCanvas.h)) /
                        2) *
                      this.renderConfig.dpr
                    : 'xMax' === o &&
                      ((i < r && 'meet' === a) || (i > r && 'slice' === a))
                    ? (t -
                        this.transformCanvas.w * (e / this.transformCanvas.h)) *
                      this.renderConfig.dpr
                    : 0),
                (this.transformCanvas.ty =
                  'YMid' === h &&
                  ((i > r && 'meet' === a) || (i < r && 'slice' === a))
                    ? ((e -
                        this.transformCanvas.h * (t / this.transformCanvas.w)) /
                        2) *
                      this.renderConfig.dpr
                    : 'YMax' === h &&
                      ((i > r && 'meet' === a) || (i < r && 'slice' === a))
                    ? (e -
                        this.transformCanvas.h * (t / this.transformCanvas.w)) *
                      this.renderConfig.dpr
                    : 0);
            } else
              'none' === this.renderConfig.preserveAspectRatio
                ? ((this.transformCanvas.sx =
                    t / (this.transformCanvas.w / this.renderConfig.dpr)),
                  (this.transformCanvas.sy =
                    e / (this.transformCanvas.h / this.renderConfig.dpr)),
                  (this.transformCanvas.tx = 0),
                  (this.transformCanvas.ty = 0))
                : ((this.transformCanvas.sx = this.renderConfig.dpr),
                  (this.transformCanvas.sy = this.renderConfig.dpr),
                  (this.transformCanvas.tx = 0),
                  (this.transformCanvas.ty = 0));
            (this.transformCanvas.props = [
              this.transformCanvas.sx,
              0,
              0,
              0,
              0,
              this.transformCanvas.sy,
              0,
              0,
              0,
              0,
              1,
              0,
              this.transformCanvas.tx,
              this.transformCanvas.ty,
              0,
              1,
            ]),
              this.ctxTransform(this.transformCanvas.props),
              this.canvasContext.beginPath(),
              this.canvasContext.rect(
                0,
                0,
                this.transformCanvas.w,
                this.transformCanvas.h
              ),
              this.canvasContext.closePath(),
              this.canvasContext.clip(),
              this.renderFrame(this.renderedFrame, !0);
          }),
          (CanvasRendererBase.prototype.destroy = function () {
            var t;
            for (
              this.renderConfig.clearCanvas &&
                this.animationItem.wrapper &&
                (this.animationItem.wrapper.innerText = ''),
                t = (this.layers ? this.layers.length : 0) - 1;
              t >= 0;
              t -= 1
            )
              this.elements[t] && this.elements[t].destroy();
            (this.elements.length = 0),
              (this.globalData.canvasContext = null),
              (this.animationItem.container = null),
              (this.destroyed = !0);
          }),
          (CanvasRendererBase.prototype.renderFrame = function (t, e) {
            if (
              (this.renderedFrame !== t ||
                !0 !== this.renderConfig.clearCanvas ||
                e) &&
              !this.destroyed &&
              -1 !== t
            ) {
              var r;
              (this.renderedFrame = t),
                (this.globalData.frameNum =
                  t - this.animationItem._isFirstFrame),
                (this.globalData.frameId += 1),
                (this.globalData._mdf = !this.renderConfig.clearCanvas || e),
                (this.globalData.projectInterface.currentFrame = t);
              var i = this.layers.length;
              for (
                this.completeLayers || this.checkLayers(t), r = 0;
                r < i;
                r += 1
              )
                (this.completeLayers || this.elements[r]) &&
                  this.elements[r].prepareFrame(t - this.layers[r].st);
              if (this.globalData._mdf) {
                for (
                  !0 === this.renderConfig.clearCanvas
                    ? this.canvasContext.clearRect(
                        0,
                        0,
                        this.transformCanvas.w,
                        this.transformCanvas.h
                      )
                    : this.save(),
                    r = i - 1;
                  r >= 0;
                  r -= 1
                )
                  (this.completeLayers || this.elements[r]) &&
                    this.elements[r].renderFrame();
                !0 !== this.renderConfig.clearCanvas && this.restore();
              }
            }
          }),
          (CanvasRendererBase.prototype.buildItem = function (t) {
            var e = this.elements;
            if (!e[t] && 99 !== this.layers[t].ty) {
              var r = this.createItem(this.layers[t], this, this.globalData);
              (e[t] = r), r.initExpressions();
            }
          }),
          (CanvasRendererBase.prototype.checkPendingElements = function () {
            for (; this.pendingElements.length; )
              this.pendingElements.pop().checkParenting();
          }),
          (CanvasRendererBase.prototype.hide = function () {
            this.animationItem.container.style.display = 'none';
          }),
          (CanvasRendererBase.prototype.show = function () {
            this.animationItem.container.style.display = 'block';
          }),
          extendPrototype(
            [CanvasRendererBase, ICompElement, CVBaseElement],
            CVCompElement
          ),
          (CVCompElement.prototype.renderInnerContent = function () {
            var t,
              e = this.canvasContext;
            for (
              e.beginPath(),
                e.moveTo(0, 0),
                e.lineTo(this.data.w, 0),
                e.lineTo(this.data.w, this.data.h),
                e.lineTo(0, this.data.h),
                e.lineTo(0, 0),
                e.clip(),
                t = this.layers.length - 1;
              t >= 0;
              t -= 1
            )
              (this.completeLayers || this.elements[t]) &&
                this.elements[t].renderFrame();
          }),
          (CVCompElement.prototype.destroy = function () {
            var t;
            for (t = this.layers.length - 1; t >= 0; t -= 1)
              this.elements[t] && this.elements[t].destroy();
            (this.layers = null), (this.elements = null);
          }),
          (CVCompElement.prototype.createComp = function (t) {
            return new CVCompElement(t, this.globalData, this);
          }),
          extendPrototype([CanvasRendererBase], CanvasRenderer),
          (CanvasRenderer.prototype.createComp = function (t) {
            return new CVCompElement(t, this.globalData, this);
          }),
          (HBaseElement.prototype = {
            checkBlendMode: function () {},
            initRendererElement: function () {
              (this.baseElement = createTag(this.data.tg || 'div')),
                this.data.hasMask
                  ? ((this.svgElement = createNS('svg')),
                    (this.layerElement = createNS('g')),
                    (this.maskedElement = this.layerElement),
                    this.svgElement.appendChild(this.layerElement),
                    this.baseElement.appendChild(this.svgElement))
                  : (this.layerElement = this.baseElement),
                styleDiv(this.baseElement);
            },
            createContainerElements: function () {
              (this.renderableEffectsManager = new CVEffects(this)),
                (this.transformedElement = this.baseElement),
                (this.maskedElement = this.layerElement),
                this.data.ln &&
                  this.layerElement.setAttribute('id', this.data.ln),
                this.data.cl &&
                  this.layerElement.setAttribute('class', this.data.cl),
                0 !== this.data.bm && this.setBlendMode();
            },
            renderElement: function () {
              var t = this.transformedElement
                ? this.transformedElement.style
                : {};
              if (this.finalTransform._matMdf) {
                var e = this.finalTransform.mat.toCSS();
                (t.transform = e), (t.webkitTransform = e);
              }
              this.finalTransform._opMdf &&
                (t.opacity = this.finalTransform.mProp.o.v);
            },
            renderFrame: function () {
              this.data.hd ||
                this.hidden ||
                (this.renderTransform(),
                this.renderRenderable(),
                this.renderElement(),
                this.renderInnerContent(),
                this._isFirstFrame && (this._isFirstFrame = !1));
            },
            destroy: function () {
              (this.layerElement = null),
                (this.transformedElement = null),
                this.matteElement && (this.matteElement = null),
                this.maskManager &&
                  (this.maskManager.destroy(), (this.maskManager = null));
            },
            createRenderableComponents: function () {
              this.maskManager = new MaskElement(
                this.data,
                this,
                this.globalData
              );
            },
            addEffects: function () {},
            setMatte: function () {},
          }),
          (HBaseElement.prototype.getBaseElement =
            SVGBaseElement.prototype.getBaseElement),
          (HBaseElement.prototype.destroyBaseElement =
            HBaseElement.prototype.destroy),
          (HBaseElement.prototype.buildElementParenting =
            BaseRenderer.prototype.buildElementParenting),
          extendPrototype(
            [
              BaseElement,
              TransformElement,
              HBaseElement,
              HierarchyElement,
              FrameElement,
              RenderableDOMElement,
            ],
            HSolidElement
          ),
          (HSolidElement.prototype.createContent = function () {
            var t;
            this.data.hasMask
              ? ((t = createNS('rect')).setAttribute('width', this.data.sw),
                t.setAttribute('height', this.data.sh),
                t.setAttribute('fill', this.data.sc),
                this.svgElement.setAttribute('width', this.data.sw),
                this.svgElement.setAttribute('height', this.data.sh))
              : (((t = createTag('div')).style.width = this.data.sw + 'px'),
                (t.style.height = this.data.sh + 'px'),
                (t.style.backgroundColor = this.data.sc)),
              this.layerElement.appendChild(t);
          }),
          extendPrototype(
            [
              BaseElement,
              TransformElement,
              HSolidElement,
              SVGShapeElement,
              HBaseElement,
              HierarchyElement,
              FrameElement,
              RenderableElement,
            ],
            HShapeElement
          ),
          (HShapeElement.prototype._renderShapeFrame =
            HShapeElement.prototype.renderInnerContent),
          (HShapeElement.prototype.createContent = function () {
            var t;
            if (((this.baseElement.style.fontSize = 0), this.data.hasMask))
              this.layerElement.appendChild(this.shapesContainer),
                (t = this.svgElement);
            else {
              t = createNS('svg');
              var e = this.comp.data
                ? this.comp.data
                : this.globalData.compSize;
              t.setAttribute('width', e.w),
                t.setAttribute('height', e.h),
                t.appendChild(this.shapesContainer),
                this.layerElement.appendChild(t);
            }
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              this.shapesContainer,
              0,
              [],
              !0
            ),
              this.filterUniqueShapes(),
              (this.shapeCont = t);
          }),
          (HShapeElement.prototype.getTransformedPoint = function (t, e) {
            var r,
              i = t.length;
            for (r = 0; r < i; r += 1)
              e = t[r].mProps.v.applyToPointArray(e[0], e[1], 0);
            return e;
          }),
          (HShapeElement.prototype.calculateShapeBoundingBox = function (t, e) {
            var r,
              i,
              s,
              a,
              n,
              o = t.sh.v,
              h = t.transformers,
              l = o._length;
            if (!(l <= 1)) {
              for (r = 0; r < l - 1; r += 1)
                (i = this.getTransformedPoint(h, o.v[r])),
                  (s = this.getTransformedPoint(h, o.o[r])),
                  (a = this.getTransformedPoint(h, o.i[r + 1])),
                  (n = this.getTransformedPoint(h, o.v[r + 1])),
                  this.checkBounds(i, s, a, n, e);
              o.c &&
                ((i = this.getTransformedPoint(h, o.v[r])),
                (s = this.getTransformedPoint(h, o.o[r])),
                (a = this.getTransformedPoint(h, o.i[0])),
                (n = this.getTransformedPoint(h, o.v[0])),
                this.checkBounds(i, s, a, n, e));
            }
          }),
          (HShapeElement.prototype.checkBounds = function (t, e, r, i, s) {
            this.getBoundsOfCurve(t, e, r, i);
            var a = this.shapeBoundingBox;
            (s.x = bmMin(a.left, s.x)),
              (s.xMax = bmMax(a.right, s.xMax)),
              (s.y = bmMin(a.top, s.y)),
              (s.yMax = bmMax(a.bottom, s.yMax));
          }),
          (HShapeElement.prototype.shapeBoundingBox = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }),
          (HShapeElement.prototype.tempBoundingBox = {
            x: 0,
            xMax: 0,
            y: 0,
            yMax: 0,
            width: 0,
            height: 0,
          }),
          (HShapeElement.prototype.getBoundsOfCurve = function (t, e, r, i) {
            for (
              var s,
                a,
                n,
                o,
                h,
                l,
                p,
                c = [
                  [t[0], i[0]],
                  [t[1], i[1]],
                ],
                f = 0;
              f < 2;
              ++f
            )
              (a = 6 * t[f] - 12 * e[f] + 6 * r[f]),
                (s = -3 * t[f] + 9 * e[f] - 9 * r[f] + 3 * i[f]),
                (n = 3 * e[f] - 3 * t[f]),
                (a |= 0),
                (n |= 0),
                (0 == (s |= 0) && 0 === a) ||
                  (0 === s
                    ? (o = -n / a) > 0 &&
                      o < 1 &&
                      c[f].push(this.calculateF(o, t, e, r, i, f))
                    : (h = a * a - 4 * n * s) >= 0 &&
                      ((l = (-a + bmSqrt(h)) / (2 * s)) > 0 &&
                        l < 1 &&
                        c[f].push(this.calculateF(l, t, e, r, i, f)),
                      (p = (-a - bmSqrt(h)) / (2 * s)) > 0 &&
                        p < 1 &&
                        c[f].push(this.calculateF(p, t, e, r, i, f))));
            (this.shapeBoundingBox.left = bmMin.apply(null, c[0])),
              (this.shapeBoundingBox.top = bmMin.apply(null, c[1])),
              (this.shapeBoundingBox.right = bmMax.apply(null, c[0])),
              (this.shapeBoundingBox.bottom = bmMax.apply(null, c[1]));
          }),
          (HShapeElement.prototype.calculateF = function (t, e, r, i, s, a) {
            return (
              bmPow(1 - t, 3) * e[a] +
              3 * bmPow(1 - t, 2) * t * r[a] +
              3 * (1 - t) * bmPow(t, 2) * i[a] +
              bmPow(t, 3) * s[a]
            );
          }),
          (HShapeElement.prototype.calculateBoundingBox = function (t, e) {
            var r,
              i = t.length;
            for (r = 0; r < i; r += 1)
              t[r] && t[r].sh
                ? this.calculateShapeBoundingBox(t[r], e)
                : t[r] && t[r].it
                ? this.calculateBoundingBox(t[r].it, e)
                : t[r] &&
                  t[r].style &&
                  t[r].w &&
                  this.expandStrokeBoundingBox(t[r].w, e);
          }),
          (HShapeElement.prototype.expandStrokeBoundingBox = function (t, e) {
            var r = 0;
            if (t.keyframes) {
              for (var i = 0; i < t.keyframes.length; i += 1) {
                var s = t.keyframes[i].s;
                s > r && (r = s);
              }
              r *= t.mult;
            } else r = t.v * t.mult;
            (e.x -= r), (e.xMax += r), (e.y -= r), (e.yMax += r);
          }),
          (HShapeElement.prototype.currentBoxContains = function (t) {
            return (
              this.currentBBox.x <= t.x &&
              this.currentBBox.y <= t.y &&
              this.currentBBox.width + this.currentBBox.x >= t.x + t.width &&
              this.currentBBox.height + this.currentBBox.y >= t.y + t.height
            );
          }),
          (HShapeElement.prototype.renderInnerContent = function () {
            if (
              (this._renderShapeFrame(),
              !this.hidden && (this._isFirstFrame || this._mdf))
            ) {
              var t = this.tempBoundingBox,
                e = 999999;
              if (
                ((t.x = e),
                (t.xMax = -e),
                (t.y = e),
                (t.yMax = -e),
                this.calculateBoundingBox(this.itemsData, t),
                (t.width = t.xMax < t.x ? 0 : t.xMax - t.x),
                (t.height = t.yMax < t.y ? 0 : t.yMax - t.y),
                this.currentBoxContains(t))
              )
                return;
              var r = !1;
              if (
                (this.currentBBox.w !== t.width &&
                  ((this.currentBBox.w = t.width),
                  this.shapeCont.setAttribute('width', t.width),
                  (r = !0)),
                this.currentBBox.h !== t.height &&
                  ((this.currentBBox.h = t.height),
                  this.shapeCont.setAttribute('height', t.height),
                  (r = !0)),
                r || this.currentBBox.x !== t.x || this.currentBBox.y !== t.y)
              ) {
                (this.currentBBox.w = t.width),
                  (this.currentBBox.h = t.height),
                  (this.currentBBox.x = t.x),
                  (this.currentBBox.y = t.y),
                  this.shapeCont.setAttribute(
                    'viewBox',
                    this.currentBBox.x +
                      ' ' +
                      this.currentBBox.y +
                      ' ' +
                      this.currentBBox.w +
                      ' ' +
                      this.currentBBox.h
                  );
                var i = this.shapeCont.style,
                  s =
                    'translate(' +
                    this.currentBBox.x +
                    'px,' +
                    this.currentBBox.y +
                    'px)';
                (i.transform = s), (i.webkitTransform = s);
              }
            }
          }),
          extendPrototype(
            [
              BaseElement,
              TransformElement,
              HBaseElement,
              HierarchyElement,
              FrameElement,
              RenderableDOMElement,
              ITextElement,
            ],
            HTextElement
          ),
          (HTextElement.prototype.createContent = function () {
            if (((this.isMasked = this.checkMasks()), this.isMasked)) {
              (this.renderType = 'svg'),
                (this.compW = this.comp.data.w),
                (this.compH = this.comp.data.h),
                this.svgElement.setAttribute('width', this.compW),
                this.svgElement.setAttribute('height', this.compH);
              var t = createNS('g');
              this.maskedElement.appendChild(t), (this.innerElem = t);
            } else
              (this.renderType = 'html'), (this.innerElem = this.layerElement);
            this.checkParenting();
          }),
          (HTextElement.prototype.buildNewText = function () {
            var t = this.textProperty.currentData;
            this.renderedLetters = createSizedArray(t.l ? t.l.length : 0);
            var e = this.innerElem.style,
              r = t.fc ? this.buildColor(t.fc) : 'rgba(0,0,0,0)';
            (e.fill = r),
              (e.color = r),
              t.sc &&
                ((e.stroke = this.buildColor(t.sc)),
                (e.strokeWidth = t.sw + 'px'));
            var i,
              s,
              a = this.globalData.fontManager.getFontByName(t.f);
            if (!this.globalData.fontManager.chars)
              if (
                ((e.fontSize = t.finalSize + 'px'),
                (e.lineHeight = t.finalSize + 'px'),
                a.fClass)
              )
                this.innerElem.className = a.fClass;
              else {
                e.fontFamily = a.fFamily;
                var n = t.fWeight,
                  o = t.fStyle;
                (e.fontStyle = o), (e.fontWeight = n);
              }
            var h,
              l,
              p,
              c = t.l;
            s = c.length;
            var f,
              d = this.mHelper,
              m = '',
              u = 0;
            for (i = 0; i < s; i += 1) {
              if (
                (this.globalData.fontManager.chars
                  ? (this.textPaths[u]
                      ? (h = this.textPaths[u])
                      : ((h = createNS('path')).setAttribute(
                          'stroke-linecap',
                          lineCapEnum[1]
                        ),
                        h.setAttribute('stroke-linejoin', lineJoinEnum[2]),
                        h.setAttribute('stroke-miterlimit', '4')),
                    this.isMasked ||
                      (this.textSpans[u]
                        ? (p = (l = this.textSpans[u]).children[0])
                        : (((l = createTag('div')).style.lineHeight = 0),
                          (p = createNS('svg')).appendChild(h),
                          styleDiv(l))))
                  : this.isMasked
                  ? (h = this.textPaths[u]
                      ? this.textPaths[u]
                      : createNS('text'))
                  : this.textSpans[u]
                  ? ((l = this.textSpans[u]), (h = this.textPaths[u]))
                  : (styleDiv((l = createTag('span'))),
                    styleDiv((h = createTag('span'))),
                    l.appendChild(h)),
                this.globalData.fontManager.chars)
              ) {
                var y,
                  g = this.globalData.fontManager.getCharData(
                    t.finalText[i],
                    a.fStyle,
                    this.globalData.fontManager.getFontByName(t.f).fFamily
                  );
                if (
                  ((y = g ? g.data : null),
                  d.reset(),
                  y &&
                    y.shapes &&
                    y.shapes.length &&
                    ((f = y.shapes[0].it),
                    d.scale(t.finalSize / 100, t.finalSize / 100),
                    (m = this.createPathShape(d, f)),
                    h.setAttribute('d', m)),
                  this.isMasked)
                )
                  this.innerElem.appendChild(h);
                else {
                  if ((this.innerElem.appendChild(l), y && y.shapes)) {
                    document.body.appendChild(p);
                    var v = p.getBBox();
                    p.setAttribute('width', v.width + 2),
                      p.setAttribute('height', v.height + 2),
                      p.setAttribute(
                        'viewBox',
                        v.x -
                          1 +
                          ' ' +
                          (v.y - 1) +
                          ' ' +
                          (v.width + 2) +
                          ' ' +
                          (v.height + 2)
                      );
                    var b = p.style,
                      _ = 'translate(' + (v.x - 1) + 'px,' + (v.y - 1) + 'px)';
                    (b.transform = _),
                      (b.webkitTransform = _),
                      (c[i].yOffset = v.y - 1);
                  } else
                    p.setAttribute('width', 1), p.setAttribute('height', 1);
                  l.appendChild(p);
                }
              } else if (
                ((h.textContent = c[i].val),
                h.setAttributeNS(
                  'http://www.w3.org/XML/1998/namespace',
                  'xml:space',
                  'preserve'
                ),
                this.isMasked)
              )
                this.innerElem.appendChild(h);
              else {
                this.innerElem.appendChild(l);
                var P = h.style,
                  E = 'translate3d(0,' + -t.finalSize / 1.2 + 'px,0)';
                (P.transform = E), (P.webkitTransform = E);
              }
              this.isMasked ? (this.textSpans[u] = h) : (this.textSpans[u] = l),
                (this.textSpans[u].style.display = 'block'),
                (this.textPaths[u] = h),
                (u += 1);
            }
            for (; u < this.textSpans.length; )
              (this.textSpans[u].style.display = 'none'), (u += 1);
          }),
          (HTextElement.prototype.renderInnerContent = function () {
            var t;
            if (this.data.singleShape) {
              if (!this._isFirstFrame && !this.lettersChangedFlag) return;
              if (this.isMasked && this.finalTransform._matMdf) {
                this.svgElement.setAttribute(
                  'viewBox',
                  -this.finalTransform.mProp.p.v[0] +
                    ' ' +
                    -this.finalTransform.mProp.p.v[1] +
                    ' ' +
                    this.compW +
                    ' ' +
                    this.compH
                ),
                  (t = this.svgElement.style);
                var e =
                  'translate(' +
                  -this.finalTransform.mProp.p.v[0] +
                  'px,' +
                  -this.finalTransform.mProp.p.v[1] +
                  'px)';
                (t.transform = e), (t.webkitTransform = e);
              }
            }
            if (
              (this.textAnimator.getMeasures(
                this.textProperty.currentData,
                this.lettersChangedFlag
              ),
              this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)
            ) {
              var r,
                i,
                s,
                a,
                n,
                o = 0,
                h = this.textAnimator.renderedLetters,
                l = this.textProperty.currentData.l;
              for (i = l.length, r = 0; r < i; r += 1)
                l[r].n
                  ? (o += 1)
                  : ((a = this.textSpans[r]),
                    (n = this.textPaths[r]),
                    (s = h[o]),
                    (o += 1),
                    s._mdf.m &&
                      (this.isMasked
                        ? a.setAttribute('transform', s.m)
                        : ((a.style.webkitTransform = s.m),
                          (a.style.transform = s.m))),
                    (a.style.opacity = s.o),
                    s.sw && s._mdf.sw && n.setAttribute('stroke-width', s.sw),
                    s.sc && s._mdf.sc && n.setAttribute('stroke', s.sc),
                    s.fc &&
                      s._mdf.fc &&
                      (n.setAttribute('fill', s.fc), (n.style.color = s.fc)));
              if (
                this.innerElem.getBBox &&
                !this.hidden &&
                (this._isFirstFrame || this._mdf)
              ) {
                var p = this.innerElem.getBBox();
                if (
                  (this.currentBBox.w !== p.width &&
                    ((this.currentBBox.w = p.width),
                    this.svgElement.setAttribute('width', p.width)),
                  this.currentBBox.h !== p.height &&
                    ((this.currentBBox.h = p.height),
                    this.svgElement.setAttribute('height', p.height)),
                  this.currentBBox.w !== p.width + 2 ||
                    this.currentBBox.h !== p.height + 2 ||
                    this.currentBBox.x !== p.x - 1 ||
                    this.currentBBox.y !== p.y - 1)
                ) {
                  (this.currentBBox.w = p.width + 2),
                    (this.currentBBox.h = p.height + 2),
                    (this.currentBBox.x = p.x - 1),
                    (this.currentBBox.y = p.y - 1),
                    this.svgElement.setAttribute(
                      'viewBox',
                      this.currentBBox.x +
                        ' ' +
                        this.currentBBox.y +
                        ' ' +
                        this.currentBBox.w +
                        ' ' +
                        this.currentBBox.h
                    ),
                    (t = this.svgElement.style);
                  var c =
                    'translate(' +
                    this.currentBBox.x +
                    'px,' +
                    this.currentBBox.y +
                    'px)';
                  (t.transform = c), (t.webkitTransform = c);
                }
              }
            }
          }),
          extendPrototype(
            [BaseElement, FrameElement, HierarchyElement],
            HCameraElement
          ),
          (HCameraElement.prototype.setup = function () {
            var t,
              e,
              r,
              i,
              s = this.comp.threeDElements.length;
            for (t = 0; t < s; t += 1)
              if ('3d' === (e = this.comp.threeDElements[t]).type) {
                (r = e.perspectiveElem.style), (i = e.container.style);
                var a = this.pe.v + 'px',
                  n = '0px 0px 0px',
                  o = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
                (r.perspective = a),
                  (r.webkitPerspective = a),
                  (i.transformOrigin = n),
                  (i.mozTransformOrigin = n),
                  (i.webkitTransformOrigin = n),
                  (r.transform = o),
                  (r.webkitTransform = o);
              }
          }),
          (HCameraElement.prototype.createElements = function () {}),
          (HCameraElement.prototype.hide = function () {}),
          (HCameraElement.prototype.renderFrame = function () {
            var t,
              e,
              r = this._isFirstFrame;
            if (this.hierarchy)
              for (e = this.hierarchy.length, t = 0; t < e; t += 1)
                r = this.hierarchy[t].finalTransform.mProp._mdf || r;
            if (
              r ||
              this.pe._mdf ||
              (this.p && this.p._mdf) ||
              (this.px && (this.px._mdf || this.py._mdf || this.pz._mdf)) ||
              this.rx._mdf ||
              this.ry._mdf ||
              this.rz._mdf ||
              this.or._mdf ||
              (this.a && this.a._mdf)
            ) {
              if ((this.mat.reset(), this.hierarchy))
                for (t = e = this.hierarchy.length - 1; t >= 0; t -= 1) {
                  var i = this.hierarchy[t].finalTransform.mProp;
                  this.mat.translate(-i.p.v[0], -i.p.v[1], i.p.v[2]),
                    this.mat
                      .rotateX(-i.or.v[0])
                      .rotateY(-i.or.v[1])
                      .rotateZ(i.or.v[2]),
                    this.mat.rotateX(-i.rx.v).rotateY(-i.ry.v).rotateZ(i.rz.v),
                    this.mat.scale(1 / i.s.v[0], 1 / i.s.v[1], 1 / i.s.v[2]),
                    this.mat.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
                }
              if (
                (this.p
                  ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2])
                  : this.mat.translate(-this.px.v, -this.py.v, this.pz.v),
                this.a)
              ) {
                var s;
                s = this.p
                  ? [
                      this.p.v[0] - this.a.v[0],
                      this.p.v[1] - this.a.v[1],
                      this.p.v[2] - this.a.v[2],
                    ]
                  : [
                      this.px.v - this.a.v[0],
                      this.py.v - this.a.v[1],
                      this.pz.v - this.a.v[2],
                    ];
                var a = Math.sqrt(
                    Math.pow(s[0], 2) + Math.pow(s[1], 2) + Math.pow(s[2], 2)
                  ),
                  n = [s[0] / a, s[1] / a, s[2] / a],
                  o = Math.sqrt(n[2] * n[2] + n[0] * n[0]),
                  h = Math.atan2(n[1], o),
                  l = Math.atan2(n[0], -n[2]);
                this.mat.rotateY(l).rotateX(-h);
              }
              this.mat
                .rotateX(-this.rx.v)
                .rotateY(-this.ry.v)
                .rotateZ(this.rz.v),
                this.mat
                  .rotateX(-this.or.v[0])
                  .rotateY(-this.or.v[1])
                  .rotateZ(this.or.v[2]),
                this.mat.translate(
                  this.globalData.compSize.w / 2,
                  this.globalData.compSize.h / 2,
                  0
                ),
                this.mat.translate(0, 0, this.pe.v);
              var p = !this._prevMat.equals(this.mat);
              if ((p || this.pe._mdf) && this.comp.threeDElements) {
                var c, f, d;
                for (e = this.comp.threeDElements.length, t = 0; t < e; t += 1)
                  if ('3d' === (c = this.comp.threeDElements[t]).type) {
                    if (p) {
                      var m = this.mat.toCSS();
                      ((d = c.container.style).transform = m),
                        (d.webkitTransform = m);
                    }
                    this.pe._mdf &&
                      (((f = c.perspectiveElem.style).perspective =
                        this.pe.v + 'px'),
                      (f.webkitPerspective = this.pe.v + 'px'));
                  }
                this.mat.clone(this._prevMat);
              }
            }
            this._isFirstFrame = !1;
          }),
          (HCameraElement.prototype.prepareFrame = function (t) {
            this.prepareProperties(t, !0);
          }),
          (HCameraElement.prototype.destroy = function () {}),
          (HCameraElement.prototype.getBaseElement = function () {
            return null;
          }),
          extendPrototype(
            [
              BaseElement,
              TransformElement,
              HBaseElement,
              HSolidElement,
              HierarchyElement,
              FrameElement,
              RenderableElement,
            ],
            HImageElement
          ),
          (HImageElement.prototype.createContent = function () {
            var t = this.globalData.getAssetsPath(this.assetData),
              e = new Image();
            this.data.hasMask
              ? ((this.imageElem = createNS('image')),
                this.imageElem.setAttribute('width', this.assetData.w + 'px'),
                this.imageElem.setAttribute('height', this.assetData.h + 'px'),
                this.imageElem.setAttributeNS(
                  'http://www.w3.org/1999/xlink',
                  'href',
                  t
                ),
                this.layerElement.appendChild(this.imageElem),
                this.baseElement.setAttribute('width', this.assetData.w),
                this.baseElement.setAttribute('height', this.assetData.h))
              : this.layerElement.appendChild(e),
              (e.crossOrigin = 'anonymous'),
              (e.src = t),
              this.data.ln && this.baseElement.setAttribute('id', this.data.ln);
          }),
          extendPrototype([BaseRenderer], HybridRendererBase),
          (HybridRendererBase.prototype.buildItem =
            SVGRenderer.prototype.buildItem),
          (HybridRendererBase.prototype.checkPendingElements = function () {
            for (; this.pendingElements.length; )
              this.pendingElements.pop().checkParenting();
          }),
          (HybridRendererBase.prototype.appendElementInPos = function (t, e) {
            var r = t.getBaseElement();
            if (r) {
              var i = this.layers[e];
              if (i.ddd && this.supports3d) this.addTo3dContainer(r, e);
              else if (this.threeDElements) this.addTo3dContainer(r, e);
              else {
                for (var s, a, n = 0; n < e; )
                  this.elements[n] &&
                    !0 !== this.elements[n] &&
                    this.elements[n].getBaseElement &&
                    ((a = this.elements[n]),
                    (s =
                      (this.layers[n].ddd
                        ? this.getThreeDContainerByPos(n)
                        : a.getBaseElement()) || s)),
                    (n += 1);
                s
                  ? (i.ddd && this.supports3d) ||
                    this.layerElement.insertBefore(r, s)
                  : (i.ddd && this.supports3d) ||
                    this.layerElement.appendChild(r);
              }
            }
          }),
          (HybridRendererBase.prototype.createShape = function (t) {
            return this.supports3d
              ? new HShapeElement(t, this.globalData, this)
              : new SVGShapeElement(t, this.globalData, this);
          }),
          (HybridRendererBase.prototype.createText = function (t) {
            return this.supports3d
              ? new HTextElement(t, this.globalData, this)
              : new SVGTextLottieElement(t, this.globalData, this);
          }),
          (HybridRendererBase.prototype.createCamera = function (t) {
            return (
              (this.camera = new HCameraElement(t, this.globalData, this)),
              this.camera
            );
          }),
          (HybridRendererBase.prototype.createImage = function (t) {
            return this.supports3d
              ? new HImageElement(t, this.globalData, this)
              : new IImageElement(t, this.globalData, this);
          }),
          (HybridRendererBase.prototype.createSolid = function (t) {
            return this.supports3d
              ? new HSolidElement(t, this.globalData, this)
              : new ISolidElement(t, this.globalData, this);
          }),
          (HybridRendererBase.prototype.createNull =
            SVGRenderer.prototype.createNull),
          (HybridRendererBase.prototype.getThreeDContainerByPos = function (t) {
            for (var e = 0, r = this.threeDElements.length; e < r; ) {
              if (
                this.threeDElements[e].startPos <= t &&
                this.threeDElements[e].endPos >= t
              )
                return this.threeDElements[e].perspectiveElem;
              e += 1;
            }
            return null;
          }),
          (HybridRendererBase.prototype.createThreeDContainer = function (
            t,
            e
          ) {
            var r,
              i,
              s = createTag('div');
            styleDiv(s);
            var a = createTag('div');
            if ((styleDiv(a), '3d' === e)) {
              ((r = s.style).width = this.globalData.compSize.w + 'px'),
                (r.height = this.globalData.compSize.h + 'px');
              var n = '50% 50%';
              (r.webkitTransformOrigin = n),
                (r.mozTransformOrigin = n),
                (r.transformOrigin = n);
              var o = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
              ((i = a.style).transform = o), (i.webkitTransform = o);
            }
            s.appendChild(a);
            var h = {
              container: a,
              perspectiveElem: s,
              startPos: t,
              endPos: t,
              type: e,
            };
            return this.threeDElements.push(h), h;
          }),
          (HybridRendererBase.prototype.build3dContainers = function () {
            var t,
              e,
              r = this.layers.length,
              i = '';
            for (t = 0; t < r; t += 1)
              this.layers[t].ddd && 3 !== this.layers[t].ty
                ? ('3d' !== i &&
                    ((i = '3d'), (e = this.createThreeDContainer(t, '3d'))),
                  (e.endPos = Math.max(e.endPos, t)))
                : ('2d' !== i &&
                    ((i = '2d'), (e = this.createThreeDContainer(t, '2d'))),
                  (e.endPos = Math.max(e.endPos, t)));
            for (t = (r = this.threeDElements.length) - 1; t >= 0; t -= 1)
              this.resizerElem.appendChild(
                this.threeDElements[t].perspectiveElem
              );
          }),
          (HybridRendererBase.prototype.addTo3dContainer = function (t, e) {
            for (var r = 0, i = this.threeDElements.length; r < i; ) {
              if (e <= this.threeDElements[r].endPos) {
                for (var s, a = this.threeDElements[r].startPos; a < e; )
                  this.elements[a] &&
                    this.elements[a].getBaseElement &&
                    (s = this.elements[a].getBaseElement()),
                    (a += 1);
                s
                  ? this.threeDElements[r].container.insertBefore(t, s)
                  : this.threeDElements[r].container.appendChild(t);
                break;
              }
              r += 1;
            }
          }),
          (HybridRendererBase.prototype.configAnimation = function (t) {
            var e = createTag('div'),
              r = this.animationItem.wrapper,
              i = e.style;
            (i.width = t.w + 'px'),
              (i.height = t.h + 'px'),
              (this.resizerElem = e),
              styleDiv(e),
              (i.transformStyle = 'flat'),
              (i.mozTransformStyle = 'flat'),
              (i.webkitTransformStyle = 'flat'),
              this.renderConfig.className &&
                e.setAttribute('class', this.renderConfig.className),
              r.appendChild(e),
              (i.overflow = 'hidden');
            var s = createNS('svg');
            s.setAttribute('width', '1'),
              s.setAttribute('height', '1'),
              styleDiv(s),
              this.resizerElem.appendChild(s);
            var a = createNS('defs');
            s.appendChild(a),
              (this.data = t),
              this.setupGlobalData(t, s),
              (this.globalData.defs = a),
              (this.layers = t.layers),
              (this.layerElement = this.resizerElem),
              this.build3dContainers(),
              this.updateContainerSize();
          }),
          (HybridRendererBase.prototype.destroy = function () {
            var t;
            this.animationItem.wrapper &&
              (this.animationItem.wrapper.innerText = ''),
              (this.animationItem.container = null),
              (this.globalData.defs = null);
            var e = this.layers ? this.layers.length : 0;
            for (t = 0; t < e; t += 1) this.elements[t].destroy();
            (this.elements.length = 0),
              (this.destroyed = !0),
              (this.animationItem = null);
          }),
          (HybridRendererBase.prototype.updateContainerSize = function () {
            var t,
              e,
              r,
              i,
              s = this.animationItem.wrapper.offsetWidth,
              a = this.animationItem.wrapper.offsetHeight,
              n = s / a;
            this.globalData.compSize.w / this.globalData.compSize.h > n
              ? ((t = s / this.globalData.compSize.w),
                (e = s / this.globalData.compSize.w),
                (r = 0),
                (i =
                  (a -
                    this.globalData.compSize.h *
                      (s / this.globalData.compSize.w)) /
                  2))
              : ((t = a / this.globalData.compSize.h),
                (e = a / this.globalData.compSize.h),
                (r =
                  (s -
                    this.globalData.compSize.w *
                      (a / this.globalData.compSize.h)) /
                  2),
                (i = 0));
            var o = this.resizerElem.style;
            (o.webkitTransform =
              'matrix3d(' +
              t +
              ',0,0,0,0,' +
              e +
              ',0,0,0,0,1,0,' +
              r +
              ',' +
              i +
              ',0,1)'),
              (o.transform = o.webkitTransform);
          }),
          (HybridRendererBase.prototype.renderFrame =
            SVGRenderer.prototype.renderFrame),
          (HybridRendererBase.prototype.hide = function () {
            this.resizerElem.style.display = 'none';
          }),
          (HybridRendererBase.prototype.show = function () {
            this.resizerElem.style.display = 'block';
          }),
          (HybridRendererBase.prototype.initItems = function () {
            if ((this.buildAllItems(), this.camera)) this.camera.setup();
            else {
              var t,
                e = this.globalData.compSize.w,
                r = this.globalData.compSize.h,
                i = this.threeDElements.length;
              for (t = 0; t < i; t += 1) {
                var s = this.threeDElements[t].perspectiveElem.style;
                (s.webkitPerspective =
                  Math.sqrt(Math.pow(e, 2) + Math.pow(r, 2)) + 'px'),
                  (s.perspective = s.webkitPerspective);
              }
            }
          }),
          (HybridRendererBase.prototype.searchExtraCompositions = function (t) {
            var e,
              r = t.length,
              i = createTag('div');
            for (e = 0; e < r; e += 1)
              if (t[e].xt) {
                var s = this.createComp(t[e], i, this.globalData.comp, null);
                s.initExpressions(),
                  this.globalData.projectInterface.registerComposition(s);
              }
          }),
          extendPrototype(
            [HybridRendererBase, ICompElement, HBaseElement],
            HCompElement
          ),
          (HCompElement.prototype._createBaseContainerElements =
            HCompElement.prototype.createContainerElements),
          (HCompElement.prototype.createContainerElements = function () {
            this._createBaseContainerElements(),
              this.data.hasMask
                ? (this.svgElement.setAttribute('width', this.data.w),
                  this.svgElement.setAttribute('height', this.data.h),
                  (this.transformedElement = this.baseElement))
                : (this.transformedElement = this.layerElement);
          }),
          (HCompElement.prototype.addTo3dContainer = function (t, e) {
            for (var r, i = 0; i < e; )
              this.elements[i] &&
                this.elements[i].getBaseElement &&
                (r = this.elements[i].getBaseElement()),
                (i += 1);
            r
              ? this.layerElement.insertBefore(t, r)
              : this.layerElement.appendChild(t);
          }),
          (HCompElement.prototype.createComp = function (t) {
            return this.supports3d
              ? new HCompElement(t, this.globalData, this)
              : new SVGCompElement(t, this.globalData, this);
          }),
          extendPrototype([HybridRendererBase], HybridRenderer),
          (HybridRenderer.prototype.createComp = function (t) {
            return this.supports3d
              ? new HCompElement(t, this.globalData, this)
              : new SVGCompElement(t, this.globalData, this);
          });
        var Expressions = (function () {
          var t = {
            initExpressions: function (t) {
              var e = 0,
                r = [];
              (t.renderer.compInterface = CompExpressionInterface(t.renderer)),
                t.renderer.globalData.projectInterface.registerComposition(
                  t.renderer
                ),
                (t.renderer.globalData.pushExpression = function () {
                  e += 1;
                }),
                (t.renderer.globalData.popExpression = function () {
                  0 == (e -= 1) &&
                    (function () {
                      var t,
                        e = r.length;
                      for (t = 0; t < e; t += 1) r[t].release();
                      r.length = 0;
                    })();
                }),
                (t.renderer.globalData.registerExpressionProperty = function (
                  t
                ) {
                  -1 === r.indexOf(t) && r.push(t);
                });
            },
          };
          return t;
        })();
        function _typeof$1(t) {
          return (
            (_typeof$1 =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      'function' == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
                  }),
            _typeof$1(t)
          );
        }
        function seedRandom(t, e) {
          var r = this,
            i = 256,
            s = e.pow(i, 6),
            a = e.pow(2, 52),
            n = 2 * a,
            o = 255;
          function h(t) {
            var e,
              r = t.length,
              s = this,
              a = 0,
              n = (s.i = s.j = 0),
              h = (s.S = []);
            for (r || (t = [r++]); a < i; ) h[a] = a++;
            for (a = 0; a < i; a++)
              (h[a] = h[(n = o & (n + t[a % r] + (e = h[a])))]), (h[n] = e);
            s.g = function (t) {
              for (var e, r = 0, a = s.i, n = s.j, h = s.S; t--; )
                (e = h[(a = o & (a + 1))]),
                  (r =
                    r * i +
                    h[o & ((h[a] = h[(n = o & (n + e))]) + (h[n] = e))]);
              return (s.i = a), (s.j = n), r;
            };
          }
          function l(t, e) {
            return (e.i = t.i), (e.j = t.j), (e.S = t.S.slice()), e;
          }
          function p(t, e) {
            var r,
              i = [],
              s = _typeof$1(t);
            if (e && 'object' == s)
              for (r in t)
                try {
                  i.push(p(t[r], e - 1));
                } catch (t) {}
            return i.length ? i : 'string' == s ? t : t + '\0';
          }
          function c(t, e) {
            for (var r, i = t + '', s = 0; s < i.length; )
              e[o & s] = o & ((r ^= 19 * e[o & s]) + i.charCodeAt(s++));
            return f(e);
          }
          function f(t) {
            return String.fromCharCode.apply(0, t);
          }
          (e.seedrandom = function (o, d, m) {
            var u = [],
              y = c(
                p(
                  (d = !0 === d ? { entropy: !0 } : d || {}).entropy
                    ? [o, f(t)]
                    : null === o
                    ? (function () {
                        try {
                          var e = new Uint8Array(i);
                          return (
                            (r.crypto || r.msCrypto).getRandomValues(e), f(e)
                          );
                        } catch (e) {
                          var s = r.navigator,
                            a = s && s.plugins;
                          return [+new Date(), r, a, r.screen, f(t)];
                        }
                      })()
                    : o,
                  3
                ),
                u
              ),
              g = new h(u),
              v = function () {
                for (var t = g.g(6), e = s, r = 0; t < a; )
                  (t = (t + r) * i), (e *= i), (r = g.g(1));
                for (; t >= n; ) (t /= 2), (e /= 2), (r >>>= 1);
                return (t + r) / e;
              };
            return (
              (v.int32 = function () {
                return 0 | g.g(4);
              }),
              (v.quick = function () {
                return g.g(4) / 4294967296;
              }),
              (v.double = v),
              c(f(g.S), t),
              (
                d.pass ||
                m ||
                function (t, r, i, s) {
                  return (
                    s &&
                      (s.S && l(s, g),
                      (t.state = function () {
                        return l(g, {});
                      })),
                    i ? ((e.random = t), r) : t
                  );
                }
              )(v, y, 'global' in d ? d.global : this == e, d.state)
            );
          }),
            c(e.random(), t);
        }
        function initialize$2(t) {
          seedRandom([], t);
        }
        var propTypes = { SHAPE: 'shape' };
        function _typeof(t) {
          return (
            (_typeof =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      'function' == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
                  }),
            _typeof(t)
          );
        }
        var ExpressionManager = (function () {
            var ob = {},
              Math = BMMath,
              window = null,
              document = null,
              XMLHttpRequest = null,
              fetch = null,
              frames = null;
            function $bm_isInstanceOfArray(t) {
              return t.constructor === Array || t.constructor === Float32Array;
            }
            function isNumerable(t, e) {
              return (
                'number' === t ||
                'boolean' === t ||
                'string' === t ||
                e instanceof Number
              );
            }
            function $bm_neg(t) {
              var e = _typeof(t);
              if ('number' === e || 'boolean' === e || t instanceof Number)
                return -t;
              if ($bm_isInstanceOfArray(t)) {
                var r,
                  i = t.length,
                  s = [];
                for (r = 0; r < i; r += 1) s[r] = -t[r];
                return s;
              }
              return t.propType ? t.v : -t;
            }
            initialize$2(BMMath);
            var easeInBez = BezierFactory.getBezierEasing(
                0.333,
                0,
                0.833,
                0.833,
                'easeIn'
              ).get,
              easeOutBez = BezierFactory.getBezierEasing(
                0.167,
                0.167,
                0.667,
                1,
                'easeOut'
              ).get,
              easeInOutBez = BezierFactory.getBezierEasing(
                0.33,
                0,
                0.667,
                1,
                'easeInOut'
              ).get;
            function sum(t, e) {
              var r = _typeof(t),
                i = _typeof(e);
              if ('string' === r || 'string' === i) return t + e;
              if (isNumerable(r, t) && isNumerable(i, e)) return t + e;
              if ($bm_isInstanceOfArray(t) && isNumerable(i, e))
                return ((t = t.slice(0))[0] += e), t;
              if (isNumerable(r, t) && $bm_isInstanceOfArray(e))
                return ((e = e.slice(0))[0] = t + e[0]), e;
              if ($bm_isInstanceOfArray(t) && $bm_isInstanceOfArray(e)) {
                for (
                  var s = 0, a = t.length, n = e.length, o = [];
                  s < a || s < n;

                )
                  ('number' == typeof t[s] || t[s] instanceof Number) &&
                  ('number' == typeof e[s] || e[s] instanceof Number)
                    ? (o[s] = t[s] + e[s])
                    : (o[s] = void 0 === e[s] ? t[s] : t[s] || e[s]),
                    (s += 1);
                return o;
              }
              return 0;
            }
            var add = sum;
            function sub(t, e) {
              var r = _typeof(t),
                i = _typeof(e);
              if (isNumerable(r, t) && isNumerable(i, e))
                return (
                  'string' === r && (t = parseInt(t, 10)),
                  'string' === i && (e = parseInt(e, 10)),
                  t - e
                );
              if ($bm_isInstanceOfArray(t) && isNumerable(i, e))
                return ((t = t.slice(0))[0] -= e), t;
              if (isNumerable(r, t) && $bm_isInstanceOfArray(e))
                return ((e = e.slice(0))[0] = t - e[0]), e;
              if ($bm_isInstanceOfArray(t) && $bm_isInstanceOfArray(e)) {
                for (
                  var s = 0, a = t.length, n = e.length, o = [];
                  s < a || s < n;

                )
                  ('number' == typeof t[s] || t[s] instanceof Number) &&
                  ('number' == typeof e[s] || e[s] instanceof Number)
                    ? (o[s] = t[s] - e[s])
                    : (o[s] = void 0 === e[s] ? t[s] : t[s] || e[s]),
                    (s += 1);
                return o;
              }
              return 0;
            }
            function mul(t, e) {
              var r,
                i,
                s,
                a = _typeof(t),
                n = _typeof(e);
              if (isNumerable(a, t) && isNumerable(n, e)) return t * e;
              if ($bm_isInstanceOfArray(t) && isNumerable(n, e)) {
                for (
                  s = t.length, r = createTypedArray('float32', s), i = 0;
                  i < s;
                  i += 1
                )
                  r[i] = t[i] * e;
                return r;
              }
              if (isNumerable(a, t) && $bm_isInstanceOfArray(e)) {
                for (
                  s = e.length, r = createTypedArray('float32', s), i = 0;
                  i < s;
                  i += 1
                )
                  r[i] = t * e[i];
                return r;
              }
              return 0;
            }
            function div(t, e) {
              var r,
                i,
                s,
                a = _typeof(t),
                n = _typeof(e);
              if (isNumerable(a, t) && isNumerable(n, e)) return t / e;
              if ($bm_isInstanceOfArray(t) && isNumerable(n, e)) {
                for (
                  s = t.length, r = createTypedArray('float32', s), i = 0;
                  i < s;
                  i += 1
                )
                  r[i] = t[i] / e;
                return r;
              }
              if (isNumerable(a, t) && $bm_isInstanceOfArray(e)) {
                for (
                  s = e.length, r = createTypedArray('float32', s), i = 0;
                  i < s;
                  i += 1
                )
                  r[i] = t / e[i];
                return r;
              }
              return 0;
            }
            function mod(t, e) {
              return (
                'string' == typeof t && (t = parseInt(t, 10)),
                'string' == typeof e && (e = parseInt(e, 10)),
                t % e
              );
            }
            var $bm_sum = sum,
              $bm_sub = sub,
              $bm_mul = mul,
              $bm_div = div,
              $bm_mod = mod;
            function clamp(t, e, r) {
              if (e > r) {
                var i = r;
                (r = e), (e = i);
              }
              return Math.min(Math.max(t, e), r);
            }
            function radiansToDegrees(t) {
              return t / degToRads;
            }
            var radians_to_degrees = radiansToDegrees;
            function degreesToRadians(t) {
              return t * degToRads;
            }
            var degrees_to_radians = radiansToDegrees,
              helperLengthArray = [0, 0, 0, 0, 0, 0];
            function length(t, e) {
              if ('number' == typeof t || t instanceof Number)
                return (e = e || 0), Math.abs(t - e);
              var r;
              e || (e = helperLengthArray);
              var i = Math.min(t.length, e.length),
                s = 0;
              for (r = 0; r < i; r += 1) s += Math.pow(e[r] - t[r], 2);
              return Math.sqrt(s);
            }
            function normalize(t) {
              return div(t, length(t));
            }
            function rgbToHsl(t) {
              var e,
                r,
                i = t[0],
                s = t[1],
                a = t[2],
                n = Math.max(i, s, a),
                o = Math.min(i, s, a),
                h = (n + o) / 2;
              if (n === o) (e = 0), (r = 0);
              else {
                var l = n - o;
                switch (((r = h > 0.5 ? l / (2 - n - o) : l / (n + o)), n)) {
                  case i:
                    e = (s - a) / l + (s < a ? 6 : 0);
                    break;
                  case s:
                    e = (a - i) / l + 2;
                    break;
                  case a:
                    e = (i - s) / l + 4;
                }
                e /= 6;
              }
              return [e, r, h, t[3]];
            }
            function hue2rgb(t, e, r) {
              return (
                r < 0 && (r += 1),
                r > 1 && (r -= 1),
                r < 1 / 6
                  ? t + 6 * (e - t) * r
                  : r < 0.5
                  ? e
                  : r < 2 / 3
                  ? t + (e - t) * (2 / 3 - r) * 6
                  : t
              );
            }
            function hslToRgb(t) {
              var e,
                r,
                i,
                s = t[0],
                a = t[1],
                n = t[2];
              if (0 === a) (e = n), (i = n), (r = n);
              else {
                var o = n < 0.5 ? n * (1 + a) : n + a - n * a,
                  h = 2 * n - o;
                (e = hue2rgb(h, o, s + 1 / 3)),
                  (r = hue2rgb(h, o, s)),
                  (i = hue2rgb(h, o, s - 1 / 3));
              }
              return [e, r, i, t[3]];
            }
            function linear(t, e, r, i, s) {
              if (
                ((void 0 !== i && void 0 !== s) ||
                  ((i = e), (s = r), (e = 0), (r = 1)),
                r < e)
              ) {
                var a = r;
                (r = e), (e = a);
              }
              if (t <= e) return i;
              if (t >= r) return s;
              var n,
                o = r === e ? 0 : (t - e) / (r - e);
              if (!i.length) return i + (s - i) * o;
              var h = i.length,
                l = createTypedArray('float32', h);
              for (n = 0; n < h; n += 1) l[n] = i[n] + (s[n] - i[n]) * o;
              return l;
            }
            function random(t, e) {
              if (
                (void 0 === e &&
                  (void 0 === t ? ((t = 0), (e = 1)) : ((e = t), (t = void 0))),
                e.length)
              ) {
                var r,
                  i = e.length;
                t || (t = createTypedArray('float32', i));
                var s = createTypedArray('float32', i),
                  a = BMMath.random();
                for (r = 0; r < i; r += 1) s[r] = t[r] + a * (e[r] - t[r]);
                return s;
              }
              return void 0 === t && (t = 0), t + BMMath.random() * (e - t);
            }
            function createPath(t, e, r, i) {
              var s,
                a = t.length,
                n = shapePool.newElement();
              n.setPathData(!!i, a);
              var o,
                h,
                l = [0, 0];
              for (s = 0; s < a; s += 1)
                (o = e && e[s] ? e[s] : l),
                  (h = r && r[s] ? r[s] : l),
                  n.setTripleAt(
                    t[s][0],
                    t[s][1],
                    h[0] + t[s][0],
                    h[1] + t[s][1],
                    o[0] + t[s][0],
                    o[1] + t[s][1],
                    s,
                    !0
                  );
              return n;
            }
            function initiateExpression(elem, data, property) {
              var val = data.x,
                needsVelocity = /velocity(?![\w\d])/.test(val),
                _needsRandom = -1 !== val.indexOf('random'),
                elemType = elem.data.ty,
                transform,
                $bm_transform,
                content,
                effect,
                thisProperty = property;
              (thisProperty.valueAtTime = thisProperty.getValueAtTime),
                Object.defineProperty(thisProperty, 'value', {
                  get: function () {
                    return thisProperty.v;
                  },
                }),
                (elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate),
                (elem.comp.displayStartTime = 0);
              var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
                outPoint = elem.data.op / elem.comp.globalData.frameRate,
                width = elem.data.sw ? elem.data.sw : 0,
                height = elem.data.sh ? elem.data.sh : 0,
                name = elem.data.nm,
                loopIn,
                loop_in,
                loopOut,
                loop_out,
                smooth,
                toWorld,
                fromWorld,
                fromComp,
                toComp,
                fromCompToSurface,
                position,
                rotation,
                anchorPoint,
                scale,
                thisLayer,
                thisComp,
                mask,
                valueAtTime,
                velocityAtTime,
                scoped_bm_rt,
                expression_function = eval(
                  '[function _expression_function(){' +
                    val +
                    ';scoped_bm_rt=$bm_rt}]'
                )[0],
                numKeys = property.kf ? data.k.length : 0,
                active = !this.data || !0 !== this.data.hd,
                wiggle = function (t, e) {
                  var r,
                    i,
                    s = this.pv.length ? this.pv.length : 1,
                    a = createTypedArray('float32', s),
                    n = Math.floor(5 * time);
                  for (r = 0, i = 0; r < n; ) {
                    for (i = 0; i < s; i += 1)
                      a[i] += -e + 2 * e * BMMath.random();
                    r += 1;
                  }
                  var o = 5 * time,
                    h = o - Math.floor(o),
                    l = createTypedArray('float32', s);
                  if (s > 1) {
                    for (i = 0; i < s; i += 1)
                      l[i] =
                        this.pv[i] + a[i] + (-e + 2 * e * BMMath.random()) * h;
                    return l;
                  }
                  return this.pv + a[0] + (-e + 2 * e * BMMath.random()) * h;
                }.bind(this);
              function loopInDuration(t, e) {
                return loopIn(t, e, !0);
              }
              function loopOutDuration(t, e) {
                return loopOut(t, e, !0);
              }
              thisProperty.loopIn &&
                ((loopIn = thisProperty.loopIn.bind(thisProperty)),
                (loop_in = loopIn)),
                thisProperty.loopOut &&
                  ((loopOut = thisProperty.loopOut.bind(thisProperty)),
                  (loop_out = loopOut)),
                thisProperty.smooth &&
                  (smooth = thisProperty.smooth.bind(thisProperty)),
                this.getValueAtTime &&
                  (valueAtTime = this.getValueAtTime.bind(this)),
                this.getVelocityAtTime &&
                  (velocityAtTime = this.getVelocityAtTime.bind(this));
              var comp = elem.comp.globalData.projectInterface.bind(
                  elem.comp.globalData.projectInterface
                ),
                time,
                velocity,
                value,
                text,
                textIndex,
                textTotal,
                selectorValue;
              function lookAt(t, e) {
                var r = [e[0] - t[0], e[1] - t[1], e[2] - t[2]],
                  i =
                    Math.atan2(r[0], Math.sqrt(r[1] * r[1] + r[2] * r[2])) /
                    degToRads;
                return [-Math.atan2(r[1], r[2]) / degToRads, i, 0];
              }
              function easeOut(t, e, r, i, s) {
                return applyEase(easeOutBez, t, e, r, i, s);
              }
              function easeIn(t, e, r, i, s) {
                return applyEase(easeInBez, t, e, r, i, s);
              }
              function ease(t, e, r, i, s) {
                return applyEase(easeInOutBez, t, e, r, i, s);
              }
              function applyEase(t, e, r, i, s, a) {
                void 0 === s ? ((s = r), (a = i)) : (e = (e - r) / (i - r)),
                  e > 1 ? (e = 1) : e < 0 && (e = 0);
                var n = t(e);
                if ($bm_isInstanceOfArray(s)) {
                  var o,
                    h = s.length,
                    l = createTypedArray('float32', h);
                  for (o = 0; o < h; o += 1) l[o] = (a[o] - s[o]) * n + s[o];
                  return l;
                }
                return (a - s) * n + s;
              }
              function nearestKey(t) {
                var e,
                  r,
                  i,
                  s = data.k.length;
                if (data.k.length && 'number' != typeof data.k[0])
                  if (
                    ((r = -1),
                    (t *= elem.comp.globalData.frameRate) < data.k[0].t)
                  )
                    (r = 1), (i = data.k[0].t);
                  else {
                    for (e = 0; e < s - 1; e += 1) {
                      if (t === data.k[e].t) {
                        (r = e + 1), (i = data.k[e].t);
                        break;
                      }
                      if (t > data.k[e].t && t < data.k[e + 1].t) {
                        t - data.k[e].t > data.k[e + 1].t - t
                          ? ((r = e + 2), (i = data.k[e + 1].t))
                          : ((r = e + 1), (i = data.k[e].t));
                        break;
                      }
                    }
                    -1 === r && ((r = e + 1), (i = data.k[e].t));
                  }
                else (r = 0), (i = 0);
                var a = {};
                return (
                  (a.index = r),
                  (a.time = i / elem.comp.globalData.frameRate),
                  a
                );
              }
              function key(t) {
                var e, r, i;
                if (!data.k.length || 'number' == typeof data.k[0])
                  throw new Error('The property has no keyframe at index ' + t);
                (t -= 1),
                  (e = {
                    time: data.k[t].t / elem.comp.globalData.frameRate,
                    value: [],
                  });
                var s = Object.prototype.hasOwnProperty.call(data.k[t], 's')
                  ? data.k[t].s
                  : data.k[t - 1].e;
                for (i = s.length, r = 0; r < i; r += 1)
                  (e[r] = s[r]), (e.value[r] = s[r]);
                return e;
              }
              function framesToTime(t, e) {
                return e || (e = elem.comp.globalData.frameRate), t / e;
              }
              function timeToFrames(t, e) {
                return (
                  t || 0 === t || (t = time),
                  e || (e = elem.comp.globalData.frameRate),
                  t * e
                );
              }
              function seedRandom(t) {
                BMMath.seedrandom(randSeed + t);
              }
              function sourceRectAtTime() {
                return elem.sourceRectAtTime();
              }
              function substring(t, e) {
                return 'string' == typeof value
                  ? void 0 === e
                    ? value.substring(t)
                    : value.substring(t, e)
                  : '';
              }
              function substr(t, e) {
                return 'string' == typeof value
                  ? void 0 === e
                    ? value.substr(t)
                    : value.substr(t, e)
                  : '';
              }
              function posterizeTime(t) {
                (time = 0 === t ? 0 : Math.floor(time * t) / t),
                  (value = valueAtTime(time));
              }
              var index = elem.data.ind,
                hasParent = !(!elem.hierarchy || !elem.hierarchy.length),
                parent,
                randSeed = Math.floor(1e6 * Math.random()),
                globalData = elem.globalData;
              function executeExpression(t) {
                return (
                  (value = t),
                  this.frameExpressionId === elem.globalData.frameId &&
                  'textSelector' !== this.propType
                    ? value
                    : ('textSelector' === this.propType &&
                        ((textIndex = this.textIndex),
                        (textTotal = this.textTotal),
                        (selectorValue = this.selectorValue)),
                      thisLayer ||
                        ((text = elem.layerInterface.text),
                        (thisLayer = elem.layerInterface),
                        (thisComp = elem.comp.compInterface),
                        (toWorld = thisLayer.toWorld.bind(thisLayer)),
                        (fromWorld = thisLayer.fromWorld.bind(thisLayer)),
                        (fromComp = thisLayer.fromComp.bind(thisLayer)),
                        (toComp = thisLayer.toComp.bind(thisLayer)),
                        (mask = thisLayer.mask
                          ? thisLayer.mask.bind(thisLayer)
                          : null),
                        (fromCompToSurface = fromComp)),
                      transform ||
                        ((transform = elem.layerInterface(
                          'ADBE Transform Group'
                        )),
                        ($bm_transform = transform),
                        transform && (anchorPoint = transform.anchorPoint)),
                      4 !== elemType ||
                        content ||
                        (content = thisLayer('ADBE Root Vectors Group')),
                      effect || (effect = thisLayer(4)),
                      (hasParent = !(
                        !elem.hierarchy || !elem.hierarchy.length
                      )) &&
                        !parent &&
                        (parent = elem.hierarchy[0].layerInterface),
                      (time =
                        this.comp.renderedFrame /
                        this.comp.globalData.frameRate),
                      _needsRandom && seedRandom(randSeed + time),
                      needsVelocity && (velocity = velocityAtTime(time)),
                      expression_function(),
                      (this.frameExpressionId = elem.globalData.frameId),
                      (scoped_bm_rt =
                        scoped_bm_rt.propType === propTypes.SHAPE
                          ? scoped_bm_rt.v
                          : scoped_bm_rt))
                );
              }
              return (
                (executeExpression.__preventDeadCodeRemoval = [
                  $bm_transform,
                  anchorPoint,
                  time,
                  velocity,
                  inPoint,
                  outPoint,
                  width,
                  height,
                  name,
                  loop_in,
                  loop_out,
                  smooth,
                  toComp,
                  fromCompToSurface,
                  toWorld,
                  fromWorld,
                  mask,
                  position,
                  rotation,
                  scale,
                  thisComp,
                  numKeys,
                  active,
                  wiggle,
                  loopInDuration,
                  loopOutDuration,
                  comp,
                  lookAt,
                  easeOut,
                  easeIn,
                  ease,
                  nearestKey,
                  key,
                  text,
                  textIndex,
                  textTotal,
                  selectorValue,
                  framesToTime,
                  timeToFrames,
                  sourceRectAtTime,
                  substring,
                  substr,
                  posterizeTime,
                  index,
                  globalData,
                ]),
                executeExpression
              );
            }
            return (
              (ob.initiateExpression = initiateExpression),
              (ob.__preventDeadCodeRemoval = [
                window,
                document,
                XMLHttpRequest,
                fetch,
                frames,
                $bm_neg,
                add,
                $bm_sum,
                $bm_sub,
                $bm_mul,
                $bm_div,
                $bm_mod,
                clamp,
                radians_to_degrees,
                degreesToRadians,
                degrees_to_radians,
                normalize,
                rgbToHsl,
                hslToRgb,
                linear,
                random,
                createPath,
              ]),
              ob
            );
          })(),
          expressionHelpers = {
            searchExpressions: function (t, e, r) {
              e.x &&
                ((r.k = !0),
                (r.x = !0),
                (r.initiateExpression = ExpressionManager.initiateExpression),
                r.effectsSequence.push(r.initiateExpression(t, e, r).bind(r)));
            },
            getSpeedAtTime: function (t) {
              var e = this.getValueAtTime(t),
                r = this.getValueAtTime(t + -0.01),
                i = 0;
              if (e.length) {
                var s;
                for (s = 0; s < e.length; s += 1) i += Math.pow(r[s] - e[s], 2);
                i = 100 * Math.sqrt(i);
              } else i = 0;
              return i;
            },
            getVelocityAtTime: function (t) {
              if (void 0 !== this.vel) return this.vel;
              var e,
                r,
                i = -0.001,
                s = this.getValueAtTime(t),
                a = this.getValueAtTime(t + i);
              if (s.length)
                for (
                  e = createTypedArray('float32', s.length), r = 0;
                  r < s.length;
                  r += 1
                )
                  e[r] = (a[r] - s[r]) / i;
              else e = (a - s) / i;
              return e;
            },
            getValueAtTime: function (t) {
              return (
                (t *= this.elem.globalData.frameRate),
                (t -= this.offsetTime) !== this._cachingAtTime.lastFrame &&
                  ((this._cachingAtTime.lastIndex =
                    this._cachingAtTime.lastFrame < t
                      ? this._cachingAtTime.lastIndex
                      : 0),
                  (this._cachingAtTime.value = this.interpolateValue(
                    t,
                    this._cachingAtTime
                  )),
                  (this._cachingAtTime.lastFrame = t)),
                this._cachingAtTime.value
              );
            },
            getStaticValueAtTime: function () {
              return this.pv;
            },
            setGroupProperty: function (t) {
              this.propertyGroup = t;
            },
          };
        function addPropertyDecorator() {
          function t(t, e, r) {
            if (!this.k || !this.keyframes) return this.pv;
            t = t ? t.toLowerCase() : '';
            var i,
              s,
              a,
              n,
              o,
              h = this.comp.renderedFrame,
              l = this.keyframes,
              p = l[l.length - 1].t;
            if (h <= p) return this.pv;
            if (
              (r
                ? (s =
                    p -
                    (i = e
                      ? Math.abs(p - this.elem.comp.globalData.frameRate * e)
                      : Math.max(0, p - this.elem.data.ip)))
                : ((!e || e > l.length - 1) && (e = l.length - 1),
                  (i = p - (s = l[l.length - 1 - e].t))),
              'pingpong' === t)
            ) {
              if (Math.floor((h - s) / i) % 2 != 0)
                return this.getValueAtTime(
                  (i - ((h - s) % i) + s) / this.comp.globalData.frameRate,
                  0
                );
            } else {
              if ('offset' === t) {
                var c = this.getValueAtTime(
                    s / this.comp.globalData.frameRate,
                    0
                  ),
                  f = this.getValueAtTime(
                    p / this.comp.globalData.frameRate,
                    0
                  ),
                  d = this.getValueAtTime(
                    (((h - s) % i) + s) / this.comp.globalData.frameRate,
                    0
                  ),
                  m = Math.floor((h - s) / i);
                if (this.pv.length) {
                  for (
                    n = (o = new Array(c.length)).length, a = 0;
                    a < n;
                    a += 1
                  )
                    o[a] = (f[a] - c[a]) * m + d[a];
                  return o;
                }
                return (f - c) * m + d;
              }
              if ('continue' === t) {
                var u = this.getValueAtTime(
                    p / this.comp.globalData.frameRate,
                    0
                  ),
                  y = this.getValueAtTime(
                    (p - 0.001) / this.comp.globalData.frameRate,
                    0
                  );
                if (this.pv.length) {
                  for (
                    n = (o = new Array(u.length)).length, a = 0;
                    a < n;
                    a += 1
                  )
                    o[a] =
                      u[a] +
                      ((u[a] - y[a]) *
                        ((h - p) / this.comp.globalData.frameRate)) /
                        5e-4;
                  return o;
                }
                return u + ((h - p) / 0.001) * (u - y);
              }
            }
            return this.getValueAtTime(
              (((h - s) % i) + s) / this.comp.globalData.frameRate,
              0
            );
          }
          function e(t, e, r) {
            if (!this.k) return this.pv;
            t = t ? t.toLowerCase() : '';
            var i,
              s,
              a,
              n,
              o,
              h = this.comp.renderedFrame,
              l = this.keyframes,
              p = l[0].t;
            if (h >= p) return this.pv;
            if (
              (r
                ? (s =
                    p +
                    (i = e
                      ? Math.abs(this.elem.comp.globalData.frameRate * e)
                      : Math.max(0, this.elem.data.op - p)))
                : ((!e || e > l.length - 1) && (e = l.length - 1),
                  (i = (s = l[e].t) - p)),
              'pingpong' === t)
            ) {
              if (Math.floor((p - h) / i) % 2 == 0)
                return this.getValueAtTime(
                  (((p - h) % i) + p) / this.comp.globalData.frameRate,
                  0
                );
            } else {
              if ('offset' === t) {
                var c = this.getValueAtTime(
                    p / this.comp.globalData.frameRate,
                    0
                  ),
                  f = this.getValueAtTime(
                    s / this.comp.globalData.frameRate,
                    0
                  ),
                  d = this.getValueAtTime(
                    (i - ((p - h) % i) + p) / this.comp.globalData.frameRate,
                    0
                  ),
                  m = Math.floor((p - h) / i) + 1;
                if (this.pv.length) {
                  for (
                    n = (o = new Array(c.length)).length, a = 0;
                    a < n;
                    a += 1
                  )
                    o[a] = d[a] - (f[a] - c[a]) * m;
                  return o;
                }
                return d - (f - c) * m;
              }
              if ('continue' === t) {
                var u = this.getValueAtTime(
                    p / this.comp.globalData.frameRate,
                    0
                  ),
                  y = this.getValueAtTime(
                    (p + 0.001) / this.comp.globalData.frameRate,
                    0
                  );
                if (this.pv.length) {
                  for (
                    n = (o = new Array(u.length)).length, a = 0;
                    a < n;
                    a += 1
                  )
                    o[a] = u[a] + ((u[a] - y[a]) * (p - h)) / 0.001;
                  return o;
                }
                return u + ((u - y) * (p - h)) / 0.001;
              }
            }
            return this.getValueAtTime(
              (i - (((p - h) % i) + p)) / this.comp.globalData.frameRate,
              0
            );
          }
          function r(t, e) {
            if (!this.k) return this.pv;
            if (((t = 0.5 * (t || 0.4)), (e = Math.floor(e || 5)) <= 1))
              return this.pv;
            var r,
              i,
              s = this.comp.renderedFrame / this.comp.globalData.frameRate,
              a = s - t,
              n = e > 1 ? (s + t - a) / (e - 1) : 1,
              o = 0,
              h = 0;
            for (
              r = this.pv.length
                ? createTypedArray('float32', this.pv.length)
                : 0;
              o < e;

            ) {
              if (((i = this.getValueAtTime(a + o * n)), this.pv.length))
                for (h = 0; h < this.pv.length; h += 1) r[h] += i[h];
              else r += i;
              o += 1;
            }
            if (this.pv.length)
              for (h = 0; h < this.pv.length; h += 1) r[h] /= e;
            else r /= e;
            return r;
          }
          function i(t) {
            this._transformCachingAtTime ||
              (this._transformCachingAtTime = { v: new Matrix() });
            var e = this._transformCachingAtTime.v;
            if (
              (e.cloneFromProps(this.pre.props),
              this.appliedTransformations < 1)
            ) {
              var r = this.a.getValueAtTime(t);
              e.translate(
                -r[0] * this.a.mult,
                -r[1] * this.a.mult,
                r[2] * this.a.mult
              );
            }
            if (this.appliedTransformations < 2) {
              var i = this.s.getValueAtTime(t);
              e.scale(
                i[0] * this.s.mult,
                i[1] * this.s.mult,
                i[2] * this.s.mult
              );
            }
            if (this.sk && this.appliedTransformations < 3) {
              var s = this.sk.getValueAtTime(t),
                a = this.sa.getValueAtTime(t);
              e.skewFromAxis(-s * this.sk.mult, a * this.sa.mult);
            }
            if (this.r && this.appliedTransformations < 4) {
              var n = this.r.getValueAtTime(t);
              e.rotate(-n * this.r.mult);
            } else if (!this.r && this.appliedTransformations < 4) {
              var o = this.rz.getValueAtTime(t),
                h = this.ry.getValueAtTime(t),
                l = this.rx.getValueAtTime(t),
                p = this.or.getValueAtTime(t);
              e.rotateZ(-o * this.rz.mult)
                .rotateY(h * this.ry.mult)
                .rotateX(l * this.rx.mult)
                .rotateZ(-p[2] * this.or.mult)
                .rotateY(p[1] * this.or.mult)
                .rotateX(p[0] * this.or.mult);
            }
            if (this.data.p && this.data.p.s) {
              var c = this.px.getValueAtTime(t),
                f = this.py.getValueAtTime(t);
              if (this.data.p.z) {
                var d = this.pz.getValueAtTime(t);
                e.translate(
                  c * this.px.mult,
                  f * this.py.mult,
                  -d * this.pz.mult
                );
              } else e.translate(c * this.px.mult, f * this.py.mult, 0);
            } else {
              var m = this.p.getValueAtTime(t);
              e.translate(
                m[0] * this.p.mult,
                m[1] * this.p.mult,
                -m[2] * this.p.mult
              );
            }
            return e;
          }
          function s() {
            return this.v.clone(new Matrix());
          }
          var a = TransformPropertyFactory.getTransformProperty;
          TransformPropertyFactory.getTransformProperty = function (t, e, r) {
            var n = a(t, e, r);
            return (
              n.dynamicProperties.length
                ? (n.getValueAtTime = i.bind(n))
                : (n.getValueAtTime = s.bind(n)),
              (n.setGroupProperty = expressionHelpers.setGroupProperty),
              n
            );
          };
          var n = PropertyFactory.getProp;
          PropertyFactory.getProp = function (i, s, a, o, h) {
            var l = n(i, s, a, o, h);
            l.kf
              ? (l.getValueAtTime = expressionHelpers.getValueAtTime.bind(l))
              : (l.getValueAtTime =
                  expressionHelpers.getStaticValueAtTime.bind(l)),
              (l.setGroupProperty = expressionHelpers.setGroupProperty),
              (l.loopOut = t),
              (l.loopIn = e),
              (l.smooth = r),
              (l.getVelocityAtTime =
                expressionHelpers.getVelocityAtTime.bind(l)),
              (l.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(l)),
              (l.numKeys = 1 === s.a ? s.k.length : 0),
              (l.propertyIndex = s.ix);
            var p = 0;
            return (
              0 !== a &&
                (p = createTypedArray(
                  'float32',
                  1 === s.a ? s.k[0].s.length : s.k.length
                )),
              (l._cachingAtTime = {
                lastFrame: initialDefaultFrame,
                lastIndex: 0,
                value: p,
              }),
              expressionHelpers.searchExpressions(i, s, l),
              l.k && h.addDynamicProperty(l),
              l
            );
          };
          var o = ShapePropertyFactory.getConstructorFunction(),
            h = ShapePropertyFactory.getKeyframedConstructorFunction();
          function l() {}
          (l.prototype = {
            vertices: function (t, e) {
              this.k && this.getValue();
              var r,
                i = this.v;
              void 0 !== e && (i = this.getValueAtTime(e, 0));
              var s = i._length,
                a = i[t],
                n = i.v,
                o = createSizedArray(s);
              for (r = 0; r < s; r += 1)
                o[r] =
                  'i' === t || 'o' === t
                    ? [a[r][0] - n[r][0], a[r][1] - n[r][1]]
                    : [a[r][0], a[r][1]];
              return o;
            },
            points: function (t) {
              return this.vertices('v', t);
            },
            inTangents: function (t) {
              return this.vertices('i', t);
            },
            outTangents: function (t) {
              return this.vertices('o', t);
            },
            isClosed: function () {
              return this.v.c;
            },
            pointOnPath: function (t, e) {
              var r = this.v;
              void 0 !== e && (r = this.getValueAtTime(e, 0)),
                this._segmentsLength ||
                  (this._segmentsLength = bez.getSegmentsLength(r));
              for (
                var i,
                  s = this._segmentsLength,
                  a = s.lengths,
                  n = s.totalLength * t,
                  o = 0,
                  h = a.length,
                  l = 0;
                o < h;

              ) {
                if (l + a[o].addedLength > n) {
                  var p = o,
                    c = r.c && o === h - 1 ? 0 : o + 1,
                    f = (n - l) / a[o].addedLength;
                  i = bez.getPointInSegment(
                    r.v[p],
                    r.v[c],
                    r.o[p],
                    r.i[c],
                    f,
                    a[o]
                  );
                  break;
                }
                (l += a[o].addedLength), (o += 1);
              }
              return (
                i ||
                  (i = r.c
                    ? [r.v[0][0], r.v[0][1]]
                    : [r.v[r._length - 1][0], r.v[r._length - 1][1]]),
                i
              );
            },
            vectorOnPath: function (t, e, r) {
              1 == t ? (t = this.v.c) : 0 == t && (t = 0.999);
              var i = this.pointOnPath(t, e),
                s = this.pointOnPath(t + 0.001, e),
                a = s[0] - i[0],
                n = s[1] - i[1],
                o = Math.sqrt(Math.pow(a, 2) + Math.pow(n, 2));
              return 0 === o
                ? [0, 0]
                : 'tangent' === r
                ? [a / o, n / o]
                : [-n / o, a / o];
            },
            tangentOnPath: function (t, e) {
              return this.vectorOnPath(t, e, 'tangent');
            },
            normalOnPath: function (t, e) {
              return this.vectorOnPath(t, e, 'normal');
            },
            setGroupProperty: expressionHelpers.setGroupProperty,
            getValueAtTime: expressionHelpers.getStaticValueAtTime,
          }),
            extendPrototype([l], o),
            extendPrototype([l], h),
            (h.prototype.getValueAtTime = function (t) {
              return (
                this._cachingAtTime ||
                  (this._cachingAtTime = {
                    shapeValue: shapePool.clone(this.pv),
                    lastIndex: 0,
                    lastTime: initialDefaultFrame,
                  }),
                (t *= this.elem.globalData.frameRate),
                (t -= this.offsetTime) !== this._cachingAtTime.lastTime &&
                  ((this._cachingAtTime.lastIndex =
                    this._cachingAtTime.lastTime < t
                      ? this._caching.lastIndex
                      : 0),
                  (this._cachingAtTime.lastTime = t),
                  this.interpolateShape(
                    t,
                    this._cachingAtTime.shapeValue,
                    this._cachingAtTime
                  )),
                this._cachingAtTime.shapeValue
              );
            }),
            (h.prototype.initiateExpression =
              ExpressionManager.initiateExpression);
          var p = ShapePropertyFactory.getShapeProp;
          ShapePropertyFactory.getShapeProp = function (t, e, r, i, s) {
            var a = p(t, e, r, i, s);
            return (
              (a.propertyIndex = e.ix),
              (a.lock = !1),
              3 === r
                ? expressionHelpers.searchExpressions(t, e.pt, a)
                : 4 === r && expressionHelpers.searchExpressions(t, e.ks, a),
              a.k && t.addDynamicProperty(a),
              a
            );
          };
        }
        function initialize$1() {
          addPropertyDecorator();
        }
        function addDecorator() {
          (TextProperty.prototype.getExpressionValue = function (t, e) {
            var r = this.calculateExpression(e);
            if (t.t !== r) {
              var i = {};
              return (
                this.copyData(i, t),
                (i.t = r.toString()),
                (i.__complete = !1),
                i
              );
            }
            return t;
          }),
            (TextProperty.prototype.searchProperty = function () {
              var t = this.searchKeyframes(),
                e = this.searchExpressions();
              return (this.kf = t || e), this.kf;
            }),
            (TextProperty.prototype.searchExpressions = function () {
              return this.data.d.x
                ? ((this.calculateExpression =
                    ExpressionManager.initiateExpression.bind(this)(
                      this.elem,
                      this.data.d,
                      this
                    )),
                  this.addEffect(this.getExpressionValue.bind(this)),
                  !0)
                : null;
            });
        }
        function initialize() {
          addDecorator();
        }
        function SVGComposableEffect() {}
        function SVGTintFilter(t, e, r, i, s) {
          this.filterManager = e;
          var a = createNS('feColorMatrix');
          a.setAttribute('type', 'matrix'),
            a.setAttribute('color-interpolation-filters', 'linearRGB'),
            a.setAttribute(
              'values',
              '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
            ),
            a.setAttribute('result', i + '_tint_1'),
            t.appendChild(a),
            (a = createNS('feColorMatrix')).setAttribute('type', 'matrix'),
            a.setAttribute('color-interpolation-filters', 'sRGB'),
            a.setAttribute('values', '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'),
            a.setAttribute('result', i + '_tint_2'),
            t.appendChild(a),
            (this.matrixFilter = a);
          var n = this.createMergeNode(i, [s, i + '_tint_1', i + '_tint_2']);
          t.appendChild(n);
        }
        function SVGFillFilter(t, e, r, i) {
          this.filterManager = e;
          var s = createNS('feColorMatrix');
          s.setAttribute('type', 'matrix'),
            s.setAttribute('color-interpolation-filters', 'sRGB'),
            s.setAttribute('values', '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'),
            s.setAttribute('result', i),
            t.appendChild(s),
            (this.matrixFilter = s);
        }
        function SVGStrokeEffect(t, e, r) {
          (this.initialized = !1),
            (this.filterManager = e),
            (this.elem = r),
            (this.paths = []);
        }
        function SVGTritoneFilter(t, e, r, i) {
          this.filterManager = e;
          var s = createNS('feColorMatrix');
          s.setAttribute('type', 'matrix'),
            s.setAttribute('color-interpolation-filters', 'linearRGB'),
            s.setAttribute(
              'values',
              '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
            ),
            t.appendChild(s);
          var a = createNS('feComponentTransfer');
          a.setAttribute('color-interpolation-filters', 'sRGB'),
            a.setAttribute('result', i),
            (this.matrixFilter = a);
          var n = createNS('feFuncR');
          n.setAttribute('type', 'table'), a.appendChild(n), (this.feFuncR = n);
          var o = createNS('feFuncG');
          o.setAttribute('type', 'table'), a.appendChild(o), (this.feFuncG = o);
          var h = createNS('feFuncB');
          h.setAttribute('type', 'table'),
            a.appendChild(h),
            (this.feFuncB = h),
            t.appendChild(a);
        }
        function SVGProLevelsFilter(t, e, r, i) {
          this.filterManager = e;
          var s = this.filterManager.effectElements,
            a = createNS('feComponentTransfer');
          (s[10].p.k ||
            0 !== s[10].p.v ||
            s[11].p.k ||
            1 !== s[11].p.v ||
            s[12].p.k ||
            1 !== s[12].p.v ||
            s[13].p.k ||
            0 !== s[13].p.v ||
            s[14].p.k ||
            1 !== s[14].p.v) &&
            (this.feFuncR = this.createFeFunc('feFuncR', a)),
            (s[17].p.k ||
              0 !== s[17].p.v ||
              s[18].p.k ||
              1 !== s[18].p.v ||
              s[19].p.k ||
              1 !== s[19].p.v ||
              s[20].p.k ||
              0 !== s[20].p.v ||
              s[21].p.k ||
              1 !== s[21].p.v) &&
              (this.feFuncG = this.createFeFunc('feFuncG', a)),
            (s[24].p.k ||
              0 !== s[24].p.v ||
              s[25].p.k ||
              1 !== s[25].p.v ||
              s[26].p.k ||
              1 !== s[26].p.v ||
              s[27].p.k ||
              0 !== s[27].p.v ||
              s[28].p.k ||
              1 !== s[28].p.v) &&
              (this.feFuncB = this.createFeFunc('feFuncB', a)),
            (s[31].p.k ||
              0 !== s[31].p.v ||
              s[32].p.k ||
              1 !== s[32].p.v ||
              s[33].p.k ||
              1 !== s[33].p.v ||
              s[34].p.k ||
              0 !== s[34].p.v ||
              s[35].p.k ||
              1 !== s[35].p.v) &&
              (this.feFuncA = this.createFeFunc('feFuncA', a)),
            (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) &&
              (a.setAttribute('color-interpolation-filters', 'sRGB'),
              t.appendChild(a)),
            (s[3].p.k ||
              0 !== s[3].p.v ||
              s[4].p.k ||
              1 !== s[4].p.v ||
              s[5].p.k ||
              1 !== s[5].p.v ||
              s[6].p.k ||
              0 !== s[6].p.v ||
              s[7].p.k ||
              1 !== s[7].p.v) &&
              ((a = createNS('feComponentTransfer')).setAttribute(
                'color-interpolation-filters',
                'sRGB'
              ),
              a.setAttribute('result', i),
              t.appendChild(a),
              (this.feFuncRComposed = this.createFeFunc('feFuncR', a)),
              (this.feFuncGComposed = this.createFeFunc('feFuncG', a)),
              (this.feFuncBComposed = this.createFeFunc('feFuncB', a)));
        }
        function SVGDropShadowEffect(t, e, r, i, s) {
          var a = e.container.globalData.renderConfig.filterSize,
            n = e.data.fs || a;
          t.setAttribute('x', n.x || a.x),
            t.setAttribute('y', n.y || a.y),
            t.setAttribute('width', n.width || a.width),
            t.setAttribute('height', n.height || a.height),
            (this.filterManager = e);
          var o = createNS('feGaussianBlur');
          o.setAttribute('in', 'SourceAlpha'),
            o.setAttribute('result', i + '_drop_shadow_1'),
            o.setAttribute('stdDeviation', '0'),
            (this.feGaussianBlur = o),
            t.appendChild(o);
          var h = createNS('feOffset');
          h.setAttribute('dx', '25'),
            h.setAttribute('dy', '0'),
            h.setAttribute('in', i + '_drop_shadow_1'),
            h.setAttribute('result', i + '_drop_shadow_2'),
            (this.feOffset = h),
            t.appendChild(h);
          var l = createNS('feFlood');
          l.setAttribute('flood-color', '#00ff00'),
            l.setAttribute('flood-opacity', '1'),
            l.setAttribute('result', i + '_drop_shadow_3'),
            (this.feFlood = l),
            t.appendChild(l);
          var p = createNS('feComposite');
          p.setAttribute('in', i + '_drop_shadow_3'),
            p.setAttribute('in2', i + '_drop_shadow_2'),
            p.setAttribute('operator', 'in'),
            p.setAttribute('result', i + '_drop_shadow_4'),
            t.appendChild(p);
          var c = this.createMergeNode(i, [i + '_drop_shadow_4', s]);
          t.appendChild(c);
        }
        (SVGComposableEffect.prototype = {
          createMergeNode: function (t, e) {
            var r,
              i,
              s = createNS('feMerge');
            for (s.setAttribute('result', t), i = 0; i < e.length; i += 1)
              (r = createNS('feMergeNode')).setAttribute('in', e[i]),
                s.appendChild(r),
                s.appendChild(r);
            return s;
          },
        }),
          extendPrototype([SVGComposableEffect], SVGTintFilter),
          (SVGTintFilter.prototype.renderFrame = function (t) {
            if (t || this.filterManager._mdf) {
              var e = this.filterManager.effectElements[0].p.v,
                r = this.filterManager.effectElements[1].p.v,
                i = this.filterManager.effectElements[2].p.v / 100;
              this.matrixFilter.setAttribute(
                'values',
                r[0] -
                  e[0] +
                  ' 0 0 0 ' +
                  e[0] +
                  ' ' +
                  (r[1] - e[1]) +
                  ' 0 0 0 ' +
                  e[1] +
                  ' ' +
                  (r[2] - e[2]) +
                  ' 0 0 0 ' +
                  e[2] +
                  ' 0 0 0 ' +
                  i +
                  ' 0'
              );
            }
          }),
          (SVGFillFilter.prototype.renderFrame = function (t) {
            if (t || this.filterManager._mdf) {
              var e = this.filterManager.effectElements[2].p.v,
                r = this.filterManager.effectElements[6].p.v;
              this.matrixFilter.setAttribute(
                'values',
                '0 0 0 0 ' +
                  e[0] +
                  ' 0 0 0 0 ' +
                  e[1] +
                  ' 0 0 0 0 ' +
                  e[2] +
                  ' 0 0 0 ' +
                  r +
                  ' 0'
              );
            }
          }),
          (SVGStrokeEffect.prototype.initialize = function () {
            var t,
              e,
              r,
              i,
              s =
                this.elem.layerElement.children ||
                this.elem.layerElement.childNodes;
            for (
              1 === this.filterManager.effectElements[1].p.v
                ? ((i = this.elem.maskManager.masksProperties.length), (r = 0))
                : (i = 1 + (r = this.filterManager.effectElements[0].p.v - 1)),
                (e = createNS('g')).setAttribute('fill', 'none'),
                e.setAttribute('stroke-linecap', 'round'),
                e.setAttribute('stroke-dashoffset', 1);
              r < i;
              r += 1
            )
              (t = createNS('path')),
                e.appendChild(t),
                this.paths.push({ p: t, m: r });
            if (3 === this.filterManager.effectElements[10].p.v) {
              var a = createNS('mask'),
                n = createElementID();
              a.setAttribute('id', n),
                a.setAttribute('mask-type', 'alpha'),
                a.appendChild(e),
                this.elem.globalData.defs.appendChild(a);
              var o = createNS('g');
              for (
                o.setAttribute(
                  'mask',
                  'url(' + getLocationHref() + '#' + n + ')'
                );
                s[0];

              )
                o.appendChild(s[0]);
              this.elem.layerElement.appendChild(o),
                (this.masker = a),
                e.setAttribute('stroke', '#fff');
            } else if (
              1 === this.filterManager.effectElements[10].p.v ||
              2 === this.filterManager.effectElements[10].p.v
            ) {
              if (2 === this.filterManager.effectElements[10].p.v)
                for (
                  s =
                    this.elem.layerElement.children ||
                    this.elem.layerElement.childNodes;
                  s.length;

                )
                  this.elem.layerElement.removeChild(s[0]);
              this.elem.layerElement.appendChild(e),
                this.elem.layerElement.removeAttribute('mask'),
                e.setAttribute('stroke', '#fff');
            }
            (this.initialized = !0), (this.pathMasker = e);
          }),
          (SVGStrokeEffect.prototype.renderFrame = function (t) {
            var e;
            this.initialized || this.initialize();
            var r,
              i,
              s = this.paths.length;
            for (e = 0; e < s; e += 1)
              if (
                -1 !== this.paths[e].m &&
                ((r = this.elem.maskManager.viewData[this.paths[e].m]),
                (i = this.paths[e].p),
                (t || this.filterManager._mdf || r.prop._mdf) &&
                  i.setAttribute('d', r.lastPath),
                t ||
                  this.filterManager.effectElements[9].p._mdf ||
                  this.filterManager.effectElements[4].p._mdf ||
                  this.filterManager.effectElements[7].p._mdf ||
                  this.filterManager.effectElements[8].p._mdf ||
                  r.prop._mdf)
              ) {
                var a;
                if (
                  0 !== this.filterManager.effectElements[7].p.v ||
                  100 !== this.filterManager.effectElements[8].p.v
                ) {
                  var n =
                      0.01 *
                      Math.min(
                        this.filterManager.effectElements[7].p.v,
                        this.filterManager.effectElements[8].p.v
                      ),
                    o =
                      0.01 *
                      Math.max(
                        this.filterManager.effectElements[7].p.v,
                        this.filterManager.effectElements[8].p.v
                      ),
                    h = i.getTotalLength();
                  a = '0 0 0 ' + h * n + ' ';
                  var l,
                    p = h * (o - n),
                    c =
                      1 +
                      2 *
                        this.filterManager.effectElements[4].p.v *
                        this.filterManager.effectElements[9].p.v *
                        0.01,
                    f = Math.floor(p / c);
                  for (l = 0; l < f; l += 1)
                    a +=
                      '1 ' +
                      2 *
                        this.filterManager.effectElements[4].p.v *
                        this.filterManager.effectElements[9].p.v *
                        0.01 +
                      ' ';
                  a += '0 ' + 10 * h + ' 0 0';
                } else
                  a =
                    '1 ' +
                    2 *
                      this.filterManager.effectElements[4].p.v *
                      this.filterManager.effectElements[9].p.v *
                      0.01;
                i.setAttribute('stroke-dasharray', a);
              }
            if (
              ((t || this.filterManager.effectElements[4].p._mdf) &&
                this.pathMasker.setAttribute(
                  'stroke-width',
                  2 * this.filterManager.effectElements[4].p.v
                ),
              (t || this.filterManager.effectElements[6].p._mdf) &&
                this.pathMasker.setAttribute(
                  'opacity',
                  this.filterManager.effectElements[6].p.v
                ),
              (1 === this.filterManager.effectElements[10].p.v ||
                2 === this.filterManager.effectElements[10].p.v) &&
                (t || this.filterManager.effectElements[3].p._mdf))
            ) {
              var d = this.filterManager.effectElements[3].p.v;
              this.pathMasker.setAttribute(
                'stroke',
                'rgb(' +
                  bmFloor(255 * d[0]) +
                  ',' +
                  bmFloor(255 * d[1]) +
                  ',' +
                  bmFloor(255 * d[2]) +
                  ')'
              );
            }
          }),
          (SVGTritoneFilter.prototype.renderFrame = function (t) {
            if (t || this.filterManager._mdf) {
              var e = this.filterManager.effectElements[0].p.v,
                r = this.filterManager.effectElements[1].p.v,
                i = this.filterManager.effectElements[2].p.v,
                s = i[0] + ' ' + r[0] + ' ' + e[0],
                a = i[1] + ' ' + r[1] + ' ' + e[1],
                n = i[2] + ' ' + r[2] + ' ' + e[2];
              this.feFuncR.setAttribute('tableValues', s),
                this.feFuncG.setAttribute('tableValues', a),
                this.feFuncB.setAttribute('tableValues', n);
            }
          }),
          (SVGProLevelsFilter.prototype.createFeFunc = function (t, e) {
            var r = createNS(t);
            return r.setAttribute('type', 'table'), e.appendChild(r), r;
          }),
          (SVGProLevelsFilter.prototype.getTableValue = function (
            t,
            e,
            r,
            i,
            s
          ) {
            for (
              var a,
                n,
                o = 0,
                h = Math.min(t, e),
                l = Math.max(t, e),
                p = Array.call(null, { length: 256 }),
                c = 0,
                f = s - i,
                d = e - t;
              o <= 256;

            )
              (n =
                (a = o / 256) <= h
                  ? d < 0
                    ? s
                    : i
                  : a >= l
                  ? d < 0
                    ? i
                    : s
                  : i + f * Math.pow((a - t) / d, 1 / r)),
                (p[c] = n),
                (c += 1),
                (o += 256 / 255);
            return p.join(' ');
          }),
          (SVGProLevelsFilter.prototype.renderFrame = function (t) {
            if (t || this.filterManager._mdf) {
              var e,
                r = this.filterManager.effectElements;
              this.feFuncRComposed &&
                (t ||
                  r[3].p._mdf ||
                  r[4].p._mdf ||
                  r[5].p._mdf ||
                  r[6].p._mdf ||
                  r[7].p._mdf) &&
                ((e = this.getTableValue(
                  r[3].p.v,
                  r[4].p.v,
                  r[5].p.v,
                  r[6].p.v,
                  r[7].p.v
                )),
                this.feFuncRComposed.setAttribute('tableValues', e),
                this.feFuncGComposed.setAttribute('tableValues', e),
                this.feFuncBComposed.setAttribute('tableValues', e)),
                this.feFuncR &&
                  (t ||
                    r[10].p._mdf ||
                    r[11].p._mdf ||
                    r[12].p._mdf ||
                    r[13].p._mdf ||
                    r[14].p._mdf) &&
                  ((e = this.getTableValue(
                    r[10].p.v,
                    r[11].p.v,
                    r[12].p.v,
                    r[13].p.v,
                    r[14].p.v
                  )),
                  this.feFuncR.setAttribute('tableValues', e)),
                this.feFuncG &&
                  (t ||
                    r[17].p._mdf ||
                    r[18].p._mdf ||
                    r[19].p._mdf ||
                    r[20].p._mdf ||
                    r[21].p._mdf) &&
                  ((e = this.getTableValue(
                    r[17].p.v,
                    r[18].p.v,
                    r[19].p.v,
                    r[20].p.v,
                    r[21].p.v
                  )),
                  this.feFuncG.setAttribute('tableValues', e)),
                this.feFuncB &&
                  (t ||
                    r[24].p._mdf ||
                    r[25].p._mdf ||
                    r[26].p._mdf ||
                    r[27].p._mdf ||
                    r[28].p._mdf) &&
                  ((e = this.getTableValue(
                    r[24].p.v,
                    r[25].p.v,
                    r[26].p.v,
                    r[27].p.v,
                    r[28].p.v
                  )),
                  this.feFuncB.setAttribute('tableValues', e)),
                this.feFuncA &&
                  (t ||
                    r[31].p._mdf ||
                    r[32].p._mdf ||
                    r[33].p._mdf ||
                    r[34].p._mdf ||
                    r[35].p._mdf) &&
                  ((e = this.getTableValue(
                    r[31].p.v,
                    r[32].p.v,
                    r[33].p.v,
                    r[34].p.v,
                    r[35].p.v
                  )),
                  this.feFuncA.setAttribute('tableValues', e));
            }
          }),
          extendPrototype([SVGComposableEffect], SVGDropShadowEffect),
          (SVGDropShadowEffect.prototype.renderFrame = function (t) {
            if (t || this.filterManager._mdf) {
              if (
                ((t || this.filterManager.effectElements[4].p._mdf) &&
                  this.feGaussianBlur.setAttribute(
                    'stdDeviation',
                    this.filterManager.effectElements[4].p.v / 4
                  ),
                t || this.filterManager.effectElements[0].p._mdf)
              ) {
                var e = this.filterManager.effectElements[0].p.v;
                this.feFlood.setAttribute(
                  'flood-color',
                  rgbToHex(
                    Math.round(255 * e[0]),
                    Math.round(255 * e[1]),
                    Math.round(255 * e[2])
                  )
                );
              }
              if (
                ((t || this.filterManager.effectElements[1].p._mdf) &&
                  this.feFlood.setAttribute(
                    'flood-opacity',
                    this.filterManager.effectElements[1].p.v / 255
                  ),
                t ||
                  this.filterManager.effectElements[2].p._mdf ||
                  this.filterManager.effectElements[3].p._mdf)
              ) {
                var r = this.filterManager.effectElements[3].p.v,
                  i =
                    (this.filterManager.effectElements[2].p.v - 90) * degToRads,
                  s = r * Math.cos(i),
                  a = r * Math.sin(i);
                this.feOffset.setAttribute('dx', s),
                  this.feOffset.setAttribute('dy', a);
              }
            }
          });
        var _svgMatteSymbols = [];
        function SVGMatte3Effect(t, e, r) {
          (this.initialized = !1),
            (this.filterManager = e),
            (this.filterElem = t),
            (this.elem = r),
            (r.matteElement = createNS('g')),
            r.matteElement.appendChild(r.layerElement),
            r.matteElement.appendChild(r.transformedElement),
            (r.baseElement = r.matteElement);
        }
        function SVGGaussianBlurEffect(t, e, r, i) {
          t.setAttribute('x', '-100%'),
            t.setAttribute('y', '-100%'),
            t.setAttribute('width', '300%'),
            t.setAttribute('height', '300%'),
            (this.filterManager = e);
          var s = createNS('feGaussianBlur');
          s.setAttribute('result', i),
            t.appendChild(s),
            (this.feGaussianBlur = s);
        }
        return (
          (SVGMatte3Effect.prototype.findSymbol = function (t) {
            for (var e = 0, r = _svgMatteSymbols.length; e < r; ) {
              if (_svgMatteSymbols[e] === t) return _svgMatteSymbols[e];
              e += 1;
            }
            return null;
          }),
          (SVGMatte3Effect.prototype.replaceInParent = function (t, e) {
            var r = t.layerElement.parentNode;
            if (r) {
              for (
                var i, s = r.children, a = 0, n = s.length;
                a < n && s[a] !== t.layerElement;

              )
                a += 1;
              a <= n - 2 && (i = s[a + 1]);
              var o = createNS('use');
              o.setAttribute('href', '#' + e),
                i ? r.insertBefore(o, i) : r.appendChild(o);
            }
          }),
          (SVGMatte3Effect.prototype.setElementAsMask = function (t, e) {
            if (!this.findSymbol(e)) {
              var r = createElementID(),
                i = createNS('mask');
              i.setAttribute('id', e.layerId),
                i.setAttribute('mask-type', 'alpha'),
                _svgMatteSymbols.push(e);
              var s = t.globalData.defs;
              s.appendChild(i);
              var a = createNS('symbol');
              a.setAttribute('id', r),
                this.replaceInParent(e, r),
                a.appendChild(e.layerElement),
                s.appendChild(a);
              var n = createNS('use');
              n.setAttribute('href', '#' + r),
                i.appendChild(n),
                (e.data.hd = !1),
                e.show();
            }
            t.setMatte(e.layerId);
          }),
          (SVGMatte3Effect.prototype.initialize = function () {
            for (
              var t = this.filterManager.effectElements[0].p.v,
                e = this.elem.comp.elements,
                r = 0,
                i = e.length;
              r < i;

            )
              e[r] &&
                e[r].data.ind === t &&
                this.setElementAsMask(this.elem, e[r]),
                (r += 1);
            this.initialized = !0;
          }),
          (SVGMatte3Effect.prototype.renderFrame = function () {
            this.initialized || this.initialize();
          }),
          (SVGGaussianBlurEffect.prototype.renderFrame = function (t) {
            if (t || this.filterManager._mdf) {
              var e = 0.3 * this.filterManager.effectElements[0].p.v,
                r = this.filterManager.effectElements[1].p.v,
                i = 3 == r ? 0 : e,
                s = 2 == r ? 0 : e;
              this.feGaussianBlur.setAttribute('stdDeviation', i + ' ' + s);
              var a =
                1 == this.filterManager.effectElements[2].p.v
                  ? 'wrap'
                  : 'duplicate';
              this.feGaussianBlur.setAttribute('edgeMode', a);
            }
          }),
          registerRenderer('canvas', CanvasRenderer),
          registerRenderer('html', HybridRenderer),
          registerRenderer('svg', SVGRenderer),
          ShapeModifiers.registerModifier('tm', TrimModifier),
          ShapeModifiers.registerModifier('pb', PuckerAndBloatModifier),
          ShapeModifiers.registerModifier('rp', RepeaterModifier),
          ShapeModifiers.registerModifier('rd', RoundCornersModifier),
          setExpressionsPlugin(Expressions),
          initialize$1(),
          initialize(),
          registerEffect(20, SVGTintFilter, !0),
          registerEffect(21, SVGFillFilter, !0),
          registerEffect(22, SVGStrokeEffect, !1),
          registerEffect(23, SVGTritoneFilter, !0),
          registerEffect(24, SVGProLevelsFilter, !0),
          registerEffect(25, SVGDropShadowEffect, !0),
          registerEffect(28, SVGMatte3Effect, !1),
          registerEffect(29, SVGGaussianBlurEffect, !0),
          lottie
        );
      }),
      (module.exports = factory()));
  })(lottie$1, lottie$1.exports);
  var lottie = lottie$1.exports,
    _templateObject$1,
    styles = r$3(
      _templateObject$1 ||
        (_templateObject$1 = _taggedTemplateLiteral([
          '\n  * {\n    box-sizing: border-box;\n  }\n\n  :host {\n    --lottie-player-toolbar-height: 35px;\n    --lottie-player-toolbar-background-color: transparent;\n    --lottie-player-toolbar-icon-color: #999;\n    --lottie-player-toolbar-icon-hover-color: #222;\n    --lottie-player-toolbar-icon-active-color: #555;\n    --lottie-player-seeker-track-color: #ccc;\n    --lottie-player-seeker-thumb-color: rgba(0, 107, 120, 0.8);\n    --lottie-player-seeker-display: block;\n\n    display: block;\n    width: 100%;\n    height: 100%;\n  }\n\n  .main {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    width: 100%;\n  }\n\n  .animation {\n    width: 100%;\n    height: 100%;\n    display: flex;\n  }\n  .animation.controls {\n    height: calc(100% - 35px);\n  }\n\n  .toolbar {\n    display: flex;\n    align-items: center;\n    justify-items: center;\n    background-color: var(--lottie-player-toolbar-background-color);\n    margin: 0 5px;\n    height: 35px;\n  }\n\n  .toolbar button {\n    cursor: pointer;\n    fill: var(--lottie-player-toolbar-icon-color);\n    display: flex;\n    background: none;\n    border: 0;\n    padding: 0;\n    outline: none;\n    height: 100%;\n  }\n\n  .toolbar button:hover {\n    fill: var(--lottie-player-toolbar-icon-hover-color);\n  }\n\n  .toolbar button.active {\n    fill: var(--lottie-player-toolbar-icon-active-color);\n  }\n\n  .toolbar button.active:hover {\n    fill: var(--lottie-player-toolbar-icon-hover-color);\n  }\n\n  .toolbar button:focus {\n    outline: 1px dotted var(--lottie-player-toolbar-icon-active-color);\n  }\n\n  .toolbar button svg {\n  }\n\n  .toolbar button.disabled svg {\n    display: none;\n  }\n\n  .seeker {\n    -webkit-appearance: none;\n    width: 95%;\n    outline: none;\n    background-color: var(--lottie-player-toolbar-background-color);\n    display: var(--lottie-player-seeker-display);\n  }\n\n  .seeker::-webkit-slider-runnable-track {\n    width: 100%;\n    height: 5px;\n    cursor: pointer;\n    background: var(--lottie-player-seeker-track-color);\n    border-radius: 3px;\n  }\n  .seeker::-webkit-slider-thumb {\n    height: 15px;\n    width: 15px;\n    border-radius: 50%;\n    background: var(--lottie-player-seeker-thumb-color);\n    cursor: pointer;\n    -webkit-appearance: none;\n    margin-top: -5px;\n  }\n  .seeker:focus::-webkit-slider-runnable-track {\n    background: #999;\n  }\n  .seeker::-moz-range-track {\n    width: 100%;\n    height: 5px;\n    cursor: pointer;\n    background: var(--lottie-player-seeker-track-color);\n    border-radius: 3px;\n  }\n  .seeker::-moz-range-thumb {\n    height: 15px;\n    width: 15px;\n    border-radius: 50%;\n    background: var(--lottie-player-seeker-thumb-color);\n    cursor: pointer;\n  }\n  .seeker::-ms-track {\n    width: 100%;\n    height: 5px;\n    cursor: pointer;\n    background: transparent;\n    border-color: transparent;\n    color: transparent;\n  }\n  .seeker::-ms-fill-lower {\n    background: var(--lottie-player-seeker-track-color);\n    border-radius: 3px;\n  }\n  .seeker::-ms-fill-upper {\n    background: var(--lottie-player-seeker-track-color);\n    border-radius: 3px;\n  }\n  .seeker::-ms-thumb {\n    border: 0;\n    height: 15px;\n    width: 15px;\n    border-radius: 50%;\n    background: var(--lottie-player-seeker-thumb-color);\n    cursor: pointer;\n  }\n  .seeker:focus::-ms-fill-lower {\n    background: var(--lottie-player-seeker-track-color);\n  }\n  .seeker:focus::-ms-fill-upper {\n    background: var(--lottie-player-seeker-track-color);\n  }\n\n  .error {\n    display: flex;\n    justify-content: center;\n    height: 100%;\n    align-items: center;\n  }\n',
        ]))
    ),
    _templateObject,
    _templateObject2,
    _templateObject3,
    _templateObject4,
    _templateObject5,
    PlayerState,
    PlayMode,
    PlayerEvents;
  function parseSrc(t) {
    if ('object' == typeof t) return t;
    try {
      return JSON.parse(t);
    } catch (e) {
      return new URL(t, window.location.href).toString();
    }
  }
  function isLottie(t) {
    return ['v', 'ip', 'op', 'layers', 'fr', 'w', 'h'].every((e) =>
      Object.prototype.hasOwnProperty.call(t, e)
    );
  }
  function fromURL(t) {
    return _fromURL.apply(this, arguments);
  }
  function _fromURL() {
    return (_fromURL = _asyncToGenerator(function* (t) {
      if ('string' != typeof t)
        throw new Error('The url value must be a string');
      var e;
      try {
        var r = new URL(t),
          i = yield fetch(r.toString());
        e = yield i.json();
      } catch (t) {
        throw new Error(
          'An error occurred while trying to load the Lottie file from URL'
        );
      }
      return e;
    })).apply(this, arguments);
  }
  (exports.PlayerState = void 0),
    (PlayerState = exports.PlayerState || (exports.PlayerState = {})),
    (PlayerState.Destroyed = 'destroyed'),
    (PlayerState.Error = 'error'),
    (PlayerState.Frozen = 'frozen'),
    (PlayerState.Loading = 'loading'),
    (PlayerState.Paused = 'paused'),
    (PlayerState.Playing = 'playing'),
    (PlayerState.Stopped = 'stopped'),
    (exports.PlayMode = void 0),
    (PlayMode = exports.PlayMode || (exports.PlayMode = {})),
    (PlayMode.Bounce = 'bounce'),
    (PlayMode.Normal = 'normal'),
    (exports.PlayerEvents = void 0),
    (PlayerEvents = exports.PlayerEvents || (exports.PlayerEvents = {})),
    (PlayerEvents.Complete = 'complete'),
    (PlayerEvents.Destroyed = 'destroyed'),
    (PlayerEvents.Error = 'error'),
    (PlayerEvents.Frame = 'frame'),
    (PlayerEvents.Freeze = 'freeze'),
    (PlayerEvents.Load = 'load'),
    (PlayerEvents.Loop = 'loop'),
    (PlayerEvents.Pause = 'pause'),
    (PlayerEvents.Play = 'play'),
    (PlayerEvents.Ready = 'ready'),
    (PlayerEvents.Rendered = 'rendered'),
    (PlayerEvents.Stop = 'stop'),
    (exports.LottiePlayer = class extends s {
      constructor() {
        super(...arguments),
          (this.autoplay = !1),
          (this.background = 'transparent'),
          (this.controls = !1),
          (this.currentState = exports.PlayerState.Loading),
          (this.description = 'Lottie animation'),
          (this.direction = 1),
          (this.hover = !1),
          (this.intermission = 1),
          (this.loop = !1),
          (this.mode = exports.PlayMode.Normal),
          (this.preserveAspectRatio = 'xMidYMid meet'),
          (this.renderer = 'svg'),
          (this.speed = 1),
          (this._io = void 0),
          (this._counter = 1);
      }
      load(t) {
        var e = this;
        return _asyncToGenerator(function* () {
          if (e.shadowRoot) {
            var r = {
              container: e.container,
              loop: !1,
              autoplay: !1,
              renderer: e.renderer,
              rendererSettings: {
                preserveAspectRatio: e.preserveAspectRatio,
                clearCanvas: !1,
                progressiveLoad: !0,
                hideOnTransparent: !0,
              },
            };
            try {
              var i = parseSrc(t),
                s = {},
                a = 'string' == typeof i ? 'path' : 'animationData';
              e._lottie && e._lottie.destroy(),
                e.webworkers && lottie$1.exports.useWebWorker(!0),
                (e._lottie = lottie$1.exports.loadAnimation(
                  Object.assign(Object.assign({}, r), { [a]: i })
                )),
                e._attachEventListeners(),
                'path' === a
                  ? ((s = yield fromURL(i)), (a = 'animationData'))
                  : (s = i),
                isLottie(s) ||
                  ((e.currentState = exports.PlayerState.Error),
                  e.dispatchEvent(new CustomEvent(exports.PlayerEvents.Error)));
            } catch (t) {
              (e.currentState = exports.PlayerState.Error),
                e.dispatchEvent(new CustomEvent(exports.PlayerEvents.Error));
            }
          }
        })();
      }
      getLottie() {
        return this._lottie;
      }
      play() {
        this._lottie &&
          (this._lottie.play(),
          (this.currentState = exports.PlayerState.Playing),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Play)));
      }
      pause() {
        this._lottie &&
          (this._lottie.pause(),
          (this.currentState = exports.PlayerState.Paused),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Pause)));
      }
      stop() {
        this._lottie &&
          ((this._counter = 1),
          this._lottie.stop(),
          (this.currentState = exports.PlayerState.Stopped),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Stop)));
      }
      destroy() {
        this._lottie &&
          (this._lottie.destroy(),
          (this._lottie = null),
          (this.currentState = exports.PlayerState.Destroyed),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Destroyed)),
          this.remove());
      }
      seek(t) {
        if (this._lottie) {
          var e = /^(\d+)(%?)$/.exec(t.toString());
          if (e) {
            var r =
              '%' === e[2]
                ? (this._lottie.totalFrames * Number(e[1])) / 100
                : Number(e[1]);
            (this.seeker = r),
              this.currentState === exports.PlayerState.Playing
                ? this._lottie.goToAndPlay(r, !0)
                : (this._lottie.goToAndStop(r, !0), this._lottie.pause());
          }
        }
      }
      snapshot() {
        var t =
          !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        if (this.shadowRoot) {
          var e = this.shadowRoot.querySelector('.animation svg'),
            r = new XMLSerializer().serializeToString(e);
          if (t) {
            var i = document.createElement('a');
            (i.href = 'data:image/svg+xml;charset=utf-8,'.concat(
              encodeURIComponent(r)
            )),
              (i.download = 'download_'.concat(this.seeker, '.svg')),
              document.body.appendChild(i),
              i.click(),
              document.body.removeChild(i);
          }
          return r;
        }
      }
      setSpeed() {
        var t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        this._lottie && this._lottie.setSpeed(t);
      }
      setDirection(t) {
        this._lottie && this._lottie.setDirection(t);
      }
      setLooping(t) {
        this._lottie && ((this.loop = t), (this._lottie.loop = t));
      }
      togglePlay() {
        return this.currentState === exports.PlayerState.Playing
          ? this.pause()
          : this.play();
      }
      toggleLooping() {
        this.setLooping(!this.loop);
      }
      resize() {
        this._lottie && this._lottie.resize();
      }
      static get styles() {
        return styles;
      }
      disconnectedCallback() {
        this.isConnected ||
          (this._io && (this._io.disconnect(), (this._io = void 0)),
          document.removeEventListener('visibilitychange', () =>
            this._onVisibilityChange()
          ),
          this.destroy());
      }
      render() {
        var t = this.controls ? 'main controls' : 'main',
          e = this.controls ? 'animation controls' : 'animation';
        return $(
          _templateObject ||
            (_templateObject = _taggedTemplateLiteral([
              ' <div\n      id="animation-container"\n      class=',
              '\n      lang="en"\n      aria-label=',
              '\n      role="img"\n    >\n      <div\n        id="animation"\n        class=',
              '\n        style="background:',
              ';"\n      >\n        ',
              '\n      </div>\n      ',
              '\n    </div>',
            ])),
          t,
          this.description,
          e,
          this.background,
          this.currentState === exports.PlayerState.Error
            ? $(
                _templateObject2 ||
                  (_templateObject2 = _taggedTemplateLiteral([
                    '<div class="error">⚠️</div>',
                  ]))
              )
            : void 0,
          this.controls ? this.renderControls() : void 0
        );
      }
      firstUpdated() {
        'IntersectionObserver' in window &&
          ((this._io = new IntersectionObserver((t) => {
            t[0].isIntersecting
              ? this.currentState === exports.PlayerState.Frozen && this.play()
              : this.currentState === exports.PlayerState.Playing &&
                this.freeze();
          })),
          this._io.observe(this.container)),
          void 0 !== document.hidden &&
            document.addEventListener('visibilitychange', () =>
              this._onVisibilityChange()
            ),
          this.src && this.load(this.src),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Rendered));
      }
      renderControls() {
        var t = this.currentState === exports.PlayerState.Playing,
          e = this.currentState === exports.PlayerState.Paused,
          r = this.currentState === exports.PlayerState.Stopped;
        return $(
          _templateObject3 ||
            (_templateObject3 = _taggedTemplateLiteral([
              '\n      <div\n        id="lottie-controls"\n        aria-label="lottie-animation-controls"\n        class="toolbar"\n      >\n        <button\n          id="lottie-play-button"\n          @click=',
              '\n          class=',
              '\n          style="align-items:center;"\n          tabindex="0"\n          aria-label="play-pause"\n        >\n          ',
              '\n        </button>\n        <button\n          id="lottie-stop-button"\n          @click=',
              '\n          class=',
              '\n          style="align-items:center;"\n          tabindex="0"\n          aria-label="stop"\n        >\n          <svg width="24" height="24" aria-hidden="true" focusable="false">\n            <path d="M6 6h12v12H6V6z" />\n          </svg>\n        </button>\n        <input\n          id="lottie-seeker-input"\n          class="seeker"\n          type="range"\n          min="0"\n          step="1"\n          max="100"\n          .value=',
              '\n          @input=',
              '\n          @mousedown=',
              '\n          @mouseup=',
              '\n          aria-valuemin="1"\n          aria-valuemax="100"\n          role="slider"\n          aria-valuenow=',
              '\n          tabindex="0"\n          aria-label="lottie-seek-input"\n        />\n        <button\n          id="lottie-loop-toggle"\n          @click=',
              '\n          class=',
              '\n          style="align-items:center;"\n          tabindex="0"\n          aria-label="loop-toggle"\n        >\n          <svg width="24" height="24" aria-hidden="true" focusable="false">\n            <path\n              d="M17.016 17.016v-4.031h1.969v6h-12v3l-3.984-3.984 3.984-3.984v3h10.031zM6.984 6.984v4.031H5.015v-6h12v-3l3.984 3.984-3.984 3.984v-3H6.984z"\n            />\n          </svg>\n        </button>\n      </div>\n    ',
            ])),
          this.togglePlay,
          t || e ? 'active' : '',
          $(
            t
              ? _templateObject4 ||
                  (_templateObject4 = _taggedTemplateLiteral([
                    '<svg\n                width="24"\n                height="24"\n                aria-hidden="true"\n                focusable="false"\n              >\n                <path\n                  d="M14.016 5.016H18v13.969h-3.984V5.016zM6 18.984V5.015h3.984v13.969H6z"\n                />\n              </svg>',
                  ]))
              : _templateObject5 ||
                  (_templateObject5 = _taggedTemplateLiteral([
                    '<svg\n                width="24"\n                height="24"\n                aria-hidden="true"\n                focusable="false"\n              >\n                <path d="M8.016 5.016L18.985 12 8.016 18.984V5.015z" />\n              </svg>',
                  ]))
          ),
          this.stop,
          r ? 'active' : '',
          this.seeker,
          this._handleSeekChange,
          () => {
            (this._prevState = this.currentState), this.freeze();
          },
          () => {
            this._prevState === exports.PlayerState.Playing && this.play();
          },
          this.seeker,
          this.toggleLooping,
          this.loop ? 'active' : ''
        );
      }
      _onVisibilityChange() {
        !0 === document.hidden &&
        this.currentState === exports.PlayerState.Playing
          ? this.freeze()
          : this.currentState === exports.PlayerState.Frozen && this.play();
      }
      _handleSeekChange(t) {
        if (this._lottie && !isNaN(t.target.value)) {
          var e = (t.target.value / 100) * this._lottie.totalFrames;
          this.seek(e);
        }
      }
      _attachEventListeners() {
        this._lottie.addEventListener('enterFrame', () => {
          (this.seeker =
            (this._lottie.currentFrame / this._lottie.totalFrames) * 100),
            this.dispatchEvent(
              new CustomEvent(exports.PlayerEvents.Frame, {
                detail: {
                  frame: this._lottie.currentFrame,
                  seeker: this.seeker,
                },
              })
            );
        }),
          this._lottie.addEventListener('complete', () => {
            if (this.currentState === exports.PlayerState.Playing) {
              if (!this.loop || (this.count && this._counter >= this.count)) {
                if (
                  (this.dispatchEvent(
                    new CustomEvent(exports.PlayerEvents.Complete)
                  ),
                  this.mode !== exports.PlayMode.Bounce)
                )
                  return;
                if (0 === this._lottie.currentFrame) return;
              }
              this.mode === exports.PlayMode.Bounce
                ? (this.count && (this._counter += 0.5),
                  setTimeout(() => {
                    this.dispatchEvent(
                      new CustomEvent(exports.PlayerEvents.Loop)
                    ),
                      this.currentState === exports.PlayerState.Playing &&
                        (this._lottie.setDirection(
                          -1 * this._lottie.playDirection
                        ),
                        this._lottie.play());
                  }, this.intermission))
                : (this.count && (this._counter += 1),
                  window.setTimeout(() => {
                    this.dispatchEvent(
                      new CustomEvent(exports.PlayerEvents.Loop)
                    ),
                      this.currentState === exports.PlayerState.Playing &&
                        (-1 === this.direction
                          ? (this.seek('99%'), this.play())
                          : (this._lottie.stop(), this._lottie.play()));
                  }, this.intermission));
            } else
              this.dispatchEvent(
                new CustomEvent(exports.PlayerEvents.Complete)
              );
          }),
          this._lottie.addEventListener('DOMLoaded', () => {
            this.setSpeed(this.speed),
              this.setDirection(this.direction),
              this.autoplay &&
                (-1 === this.direction && this.seek('100%'), this.play()),
              this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Ready));
          }),
          this._lottie.addEventListener('data_ready', () => {
            this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Load));
          }),
          this._lottie.addEventListener('data_failed', () => {
            (this.currentState = exports.PlayerState.Error),
              this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Error));
          }),
          this.container.addEventListener('mouseenter', () => {
            this.hover &&
              this.currentState !== exports.PlayerState.Playing &&
              this.play();
          }),
          this.container.addEventListener('mouseleave', () => {
            this.hover &&
              this.currentState === exports.PlayerState.Playing &&
              this.stop();
          });
      }
      freeze() {
        this._lottie &&
          (this._lottie.pause(),
          (this.currentState = exports.PlayerState.Frozen),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Freeze)));
      }
    }),
    __decorate(
      [e$5({ type: Boolean })],
      exports.LottiePlayer.prototype,
      'autoplay',
      void 0
    ),
    __decorate(
      [e$5({ type: String, reflect: !0 })],
      exports.LottiePlayer.prototype,
      'background',
      void 0
    ),
    __decorate(
      [e$5({ type: Boolean })],
      exports.LottiePlayer.prototype,
      'controls',
      void 0
    ),
    __decorate(
      [e$5({ type: Number })],
      exports.LottiePlayer.prototype,
      'count',
      void 0
    ),
    __decorate(
      [e$5({ type: String })],
      exports.LottiePlayer.prototype,
      'currentState',
      void 0
    ),
    __decorate(
      [e$5({ type: String })],
      exports.LottiePlayer.prototype,
      'description',
      void 0
    ),
    __decorate(
      [e$5({ type: Number })],
      exports.LottiePlayer.prototype,
      'direction',
      void 0
    ),
    __decorate(
      [e$5({ type: Boolean })],
      exports.LottiePlayer.prototype,
      'hover',
      void 0
    ),
    __decorate([e$5()], exports.LottiePlayer.prototype, 'intermission', void 0),
    __decorate(
      [e$5({ type: Boolean, reflect: !0 })],
      exports.LottiePlayer.prototype,
      'loop',
      void 0
    ),
    __decorate([e$5()], exports.LottiePlayer.prototype, 'mode', void 0),
    __decorate(
      [e$5({ type: String })],
      exports.LottiePlayer.prototype,
      'preserveAspectRatio',
      void 0
    ),
    __decorate(
      [e$5({ type: String })],
      exports.LottiePlayer.prototype,
      'renderer',
      void 0
    ),
    __decorate([e$5()], exports.LottiePlayer.prototype, 'seeker', void 0),
    __decorate(
      [e$5({ type: Number })],
      exports.LottiePlayer.prototype,
      'speed',
      void 0
    ),
    __decorate(
      [e$5({ type: String })],
      exports.LottiePlayer.prototype,
      'src',
      void 0
    ),
    __decorate(
      [e$5({ type: Boolean })],
      exports.LottiePlayer.prototype,
      'webworkers',
      void 0
    ),
    __decorate(
      [i('.animation')],
      exports.LottiePlayer.prototype,
      'container',
      void 0
    ),
    (exports.LottiePlayer = __decorate(
      [n$1('lottie-player')],
      exports.LottiePlayer
    )),
    (exports.parseSrc = parseSrc),
    Object.defineProperty(exports, '__esModule', { value: !0 });
});
//# sourceMappingURL=lottie-player.js.map

/*!
 * ScrollToPlugin 3.11.2
 * https://greensock.com
 * 
 * @license Copyright 2022, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).window=e.window||{})}(this,function(e){"use strict";function k(){return"undefined"!=typeof window}function l(){return u||k()&&(u=window.gsap)&&u.registerPlugin&&u}function m(e){return"string"==typeof e}function n(e){return"function"==typeof e}function o(e,t){var o="x"===t?"Width":"Height",n="scroll"+o,r="client"+o;return e===T||e===i||e===c?Math.max(i[n],c[n])-(T["inner"+o]||i[r]||c[r]):e[n]-e["offset"+o]}function p(e,t){var o="scroll"+("x"===t?"Left":"Top");return e===T&&(null!=e.pageXOffset?o="page"+t.toUpperCase()+"Offset":e=null!=i[o]?i:c),function(){return e[o]}}function r(e,t){if(!(e=f(e)[0])||!e.getBoundingClientRect)return console.warn("scrollTo target doesn't exist. Using 0")||{x:0,y:0};var o=e.getBoundingClientRect(),n=!t||t===T||t===c,r=n?{top:i.clientTop-(T.pageYOffset||i.scrollTop||c.scrollTop||0),left:i.clientLeft-(T.pageXOffset||i.scrollLeft||c.scrollLeft||0)}:t.getBoundingClientRect(),l={x:o.left-r.left,y:o.top-r.top};return!n&&t&&(l.x+=p(t,"x")(),l.y+=p(t,"y")()),l}function s(e,t,n,l,s){return isNaN(e)||"object"==typeof e?m(e)&&"="===e.charAt(1)?parseFloat(e.substr(2))*("-"===e.charAt(0)?-1:1)+l-s:"max"===e?o(t,n)-s:Math.min(o(t,n),r(e,t)[n]-s):parseFloat(e)-s}function t(){u=l(),k()&&u&&document.body&&(T=window,c=document.body,i=document.documentElement,f=u.utils.toArray,u.config({autoKillThreshold:7}),v=u.config(),a=1)}var u,a,T,i,c,f,v,y={version:"3.11.2",name:"scrollTo",rawVars:1,register:function register(e){u=e,t()},init:function init(e,o,r,l,i){a||t();var c=this,f=u.getProperty(e,"scrollSnapType");c.isWin=e===T,c.target=e,c.tween=r,o=function _clean(e,t,o,r){if(n(e)&&(e=e(t,o,r)),"object"!=typeof e)return m(e)&&"max"!==e&&"="!==e.charAt(1)?{x:e,y:e}:{y:e};if(e.nodeType)return{y:e,x:e};var l,s={};for(l in e)s[l]="onAutoKill"!==l&&n(e[l])?e[l](t,o,r):e[l];return s}(o,l,e,i),c.vars=o,c.autoKill=!!o.autoKill,c.getX=p(e,"x"),c.getY=p(e,"y"),c.x=c.xPrev=c.getX(),c.y=c.yPrev=c.getY(),"smooth"===u.getProperty(e,"scrollBehavior")&&u.set(e,{scrollBehavior:"auto"}),f&&"none"!==f&&(c.snap=1,c.snapInline=e.style.scrollSnapType,e.style.scrollSnapType="none"),null!=o.x?(c.add(c,"x",c.x,s(o.x,e,"x",c.x,o.offsetX||0),l,i),c._props.push("scrollTo_x")):c.skipX=1,null!=o.y?(c.add(c,"y",c.y,s(o.y,e,"y",c.y,o.offsetY||0),l,i),c._props.push("scrollTo_y")):c.skipY=1},render:function render(e,t){for(var n,r,l,s,i,p=t._pt,c=t.target,f=t.tween,u=t.autoKill,a=t.xPrev,y=t.yPrev,d=t.isWin,x=t.snap,g=t.snapInline;p;)p.r(e,p.d),p=p._next;n=d||!t.skipX?t.getX():a,l=(r=d||!t.skipY?t.getY():y)-y,s=n-a,i=v.autoKillThreshold,t.x<0&&(t.x=0),t.y<0&&(t.y=0),u&&(!t.skipX&&(i<s||s<-i)&&n<o(c,"x")&&(t.skipX=1),!t.skipY&&(i<l||l<-i)&&r<o(c,"y")&&(t.skipY=1),t.skipX&&t.skipY&&(f.kill(),t.vars.onAutoKill&&t.vars.onAutoKill.apply(f,t.vars.onAutoKillParams||[]))),d?T.scrollTo(t.skipX?n:t.x,t.skipY?r:t.y):(t.skipY||(c.scrollTop=t.y),t.skipX||(c.scrollLeft=t.x)),!x||1!==e&&0!==e||(r=c.scrollTop,n=c.scrollLeft,g?c.style.scrollSnapType=g:c.style.removeProperty("scroll-snap-type"),c.scrollTop=r+1,c.scrollLeft=n+1,c.scrollTop=r,c.scrollLeft=n),t.xPrev=t.x,t.yPrev=t.y},kill:function kill(e){var t="scrollTo"===e;!t&&"scrollTo_x"!==e||(this.skipX=1),!t&&"scrollTo_y"!==e||(this.skipY=1)}};y.max=o,y.getOffset=r,y.buildGetter=p,l()&&u.registerPlugin(y),e.ScrollToPlugin=y,e.default=y;if (typeof(window)==="undefined"||window!==e){Object.defineProperty(e,"__esModule",{value:!0})} else {delete e.default}});


/*!
 * ScrollTrigger 3.11.2
 * https://greensock.com
 * 
 * @license Copyright 2022, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).window=e.window||{})}(this,function(e){"use strict";function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function q(){return we||"undefined"!=typeof window&&(we=window.gsap)&&we.registerPlugin&&we}function y(e,t){return~Fe.indexOf(e)&&Fe[Fe.indexOf(e)+1][t]}function z(e){return!!~t.indexOf(e)}function A(e,t,r,n,o){return e.addEventListener(t,r,{passive:!n,capture:!!o})}function B(e,t,r,n){return e.removeEventListener(t,r,!!n)}function E(){return Be&&Be.isPressed||k.cache++}function F(r,n){function Qc(e){if(e||0===e){o&&(Ae.history.scrollRestoration="manual");var t=Be&&Be.isPressed;e=Qc.v=Math.round(e)||(Be&&Be.iOS?1:0),r(e),Qc.cacheID=k.cache,t&&i("ss",e)}else(n||k.cache!==Qc.cacheID||i("ref"))&&(Qc.cacheID=k.cache,Qc.v=r());return Qc.v+Qc.offset}return Qc.offset=0,r&&Qc}function I(e){return we.utils.toArray(e)[0]||("string"==typeof e&&!1!==we.config().nullTargetWarn?console.warn("Element not found:",e):null)}function J(t,e){var r=e.s,n=e.sc;z(t)&&(t=Ee.scrollingElement||Me);var o=k.indexOf(t),i=n===Je.sc?1:2;~o||(o=k.push(t)-1),k[o+i]||t.addEventListener("scroll",E);var a=k[o+i],s=a||(k[o+i]=F(y(t,r),!0)||(z(t)?n:F(function(e){return arguments.length?t[r]=e:t[r]})));return s.target=t,a||(s.smooth="smooth"===we.getProperty(t,"scrollBehavior")),s}function K(e,t,o){function md(e,t){var r=Ke();t||n<r-s?(a=i,i=e,l=s,s=r):o?i+=e:i=a+(e-a)/(r-l)*(s-l)}var i=e,a=e,s=Ke(),l=s,n=t||50,c=Math.max(500,3*n);return{update:md,reset:function reset(){a=i=o?0:i,l=s=0},getVelocity:function getVelocity(e){var t=l,r=a,n=Ke();return!e&&0!==e||e===i||md(e),s===l||c<n-l?0:(i+(o?r:-r))/((o?n:s)-t)*1e3}}}function L(e,t){return t&&!e._gsapAllow&&e.preventDefault(),e.changedTouches?e.changedTouches[0]:e}function M(e){var t=Math.max.apply(Math,e),r=Math.min.apply(Math,e);return Math.abs(t)>=Math.abs(r)?t:r}function N(){(De=we.core.globals().ScrollTrigger)&&De.core&&function _integrate(){var e=De.core,r=e.bridge||{},t=e._scrollers,n=e._proxies;t.push.apply(t,k),n.push.apply(n,Fe),k=t,Fe=n,i=function _bridge(e,t){return r[e](t)}}()}function O(e){return(we=e||q())&&"undefined"!=typeof document&&document.body&&(Ae=window,Me=(Ee=document).documentElement,Ce=Ee.body,t=[Ae,Ee,Me,Ce],we.utils.clamp,Ie="onpointerenter"in Ce?"pointer":"mouse",Pe=C.isTouch=Ae.matchMedia&&Ae.matchMedia("(hover: none), (pointer: coarse)").matches?1:"ontouchstart"in Ae||0<navigator.maxTouchPoints||0<navigator.msMaxTouchPoints?2:0,ze=C.eventTypes=("ontouchstart"in Me?"touchstart,touchmove,touchcancel,touchend":"onpointerdown"in Me?"pointerdown,pointermove,pointercancel,pointerup":"mousedown,mousemove,mouseup,mouseup").split(","),setTimeout(function(){return o=0},500),N(),ke=1),ke}var we,ke,Ae,Ee,Me,Ce,Pe,Ie,De,t,Be,ze,o=1,Le=[],k=[],Fe=[],Ke=Date.now,i=function _bridge(e,t){return t},r="scrollLeft",n="scrollTop",He={s:r,p:"left",p2:"Left",os:"right",os2:"Right",d:"width",d2:"Width",a:"x",sc:F(function(e){return arguments.length?Ae.scrollTo(e,Je.sc()):Ae.pageXOffset||Ee[r]||Me[r]||Ce[r]||0})},Je={s:n,p:"top",p2:"Top",os:"bottom",os2:"Bottom",d:"height",d2:"Height",a:"y",op:He,sc:F(function(e){return arguments.length?Ae.scrollTo(He.sc(),e):Ae.pageYOffset||Ee[n]||Me[n]||Ce[n]||0})};He.op=Je,k.cache=0;var C=(Observer.prototype.init=function init(e){ke||O(we)||console.warn("Please gsap.registerPlugin(Observer)"),De||N();var o=e.tolerance,a=e.dragMinimum,t=e.type,n=e.target,r=e.lineHeight,i=e.debounce,s=e.preventDefault,l=e.onStop,c=e.onStopDelay,u=e.ignore,f=e.wheelSpeed,d=e.event,p=e.onDragStart,g=e.onDragEnd,h=e.onDrag,v=e.onPress,b=e.onRelease,m=e.onRight,y=e.onLeft,x=e.onUp,w=e.onDown,_=e.onChangeX,S=e.onChangeY,T=e.onChange,k=e.onToggleX,C=e.onToggleY,P=e.onHover,D=e.onHoverEnd,R=e.onMove,Y=e.ignoreCheck,F=e.isNormalizer,X=e.onGestureStart,H=e.onGestureEnd,V=e.onWheel,W=e.onEnable,q=e.onDisable,j=e.onClick,Q=e.scrollSpeed,G=e.capture,U=e.allowClicks,Z=e.lockAxis,$=e.onLockAxis;function Ne(){return ye=Ke()}function Oe(e,t){return(se.event=e)&&u&&~u.indexOf(e.target)||t&&ge&&"touch"!==e.pointerType||Y&&Y(e,t)}function Qe(){var e=se.deltaX=M(be),t=se.deltaY=M(me),r=Math.abs(e)>=o,n=Math.abs(t)>=o;T&&(r||n)&&T(se,e,t,be,me),r&&(m&&0<se.deltaX&&m(se),y&&se.deltaX<0&&y(se),_&&_(se),k&&se.deltaX<0!=le<0&&k(se),le=se.deltaX,be[0]=be[1]=be[2]=0),n&&(w&&0<se.deltaY&&w(se),x&&se.deltaY<0&&x(se),S&&S(se),C&&se.deltaY<0!=ce<0&&C(se),ce=se.deltaY,me[0]=me[1]=me[2]=0),(ne||re)&&(R&&R(se),re&&(h(se),re=!1),ne=!1),ie&&!(ie=!1)&&$&&$(se),oe&&(V(se),oe=!1),ee=0}function Re(e,t,r){be[r]+=e,me[r]+=t,se._vx.update(e),se._vy.update(t),i?ee=ee||requestAnimationFrame(Qe):Qe()}function Se(e,t){Z&&!ae&&(se.axis=ae=Math.abs(e)>Math.abs(t)?"x":"y",ie=!0),"y"!==ae&&(be[2]+=e,se._vx.update(e,!0)),"x"!==ae&&(me[2]+=t,se._vy.update(t,!0)),i?ee=ee||requestAnimationFrame(Qe):Qe()}function Te(e){if(!Oe(e,1)){var t=(e=L(e,s)).clientX,r=e.clientY,n=t-se.x,o=r-se.y,i=se.isDragging;se.x=t,se.y=r,(i||Math.abs(se.startX-t)>=a||Math.abs(se.startY-r)>=a)&&(h&&(re=!0),i||(se.isDragging=!0),Se(n,o),i||p&&p(se))}}function Ve(t){if(!Oe(t,1)){B(F?n:ve,ze[1],Te,!0);var e=se.isDragging&&(3<Math.abs(se.x-se.startX)||3<Math.abs(se.y-se.startY)),r=L(t);e||(se._vx.reset(),se._vy.reset(),s&&U&&we.delayedCall(.08,function(){if(300<Ke()-ye&&!t.defaultPrevented)if(t.target.click)t.target.click();else if(ve.createEvent){var e=ve.createEvent("MouseEvents");e.initMouseEvent("click",!0,!0,Ae,1,r.screenX,r.screenY,r.clientX,r.clientY,!1,!1,!1,!1,0,null),t.target.dispatchEvent(e)}})),se.isDragging=se.isGesturing=se.isPressed=!1,l&&!F&&te.restart(!0),g&&e&&g(se),b&&b(se,e)}}function We(e){return e.touches&&1<e.touches.length&&(se.isGesturing=!0)&&X(e,se.isDragging)}function Xe(){return(se.isGesturing=!1)||H(se)}function Ye(e){if(!Oe(e)){var t=ue(),r=fe();Re((t-de)*Q,(r-pe)*Q,1),de=t,pe=r,l&&te.restart(!0)}}function Ze(e){if(!Oe(e)){e=L(e,s),V&&(oe=!0);var t=(1===e.deltaMode?r:2===e.deltaMode?Ae.innerHeight:1)*f;Re(e.deltaX*t,e.deltaY*t,0),l&&!F&&te.restart(!0)}}function $e(e){if(!Oe(e)){var t=e.clientX,r=e.clientY,n=t-se.x,o=r-se.y;se.x=t,se.y=r,ne=!0,(n||o)&&Se(n,o)}}function _e(e){se.event=e,P(se)}function af(e){se.event=e,D(se)}function bf(e){return Oe(e)||L(e,s)&&j(se)}this.target=n=I(n)||Me,this.vars=e,u=u&&we.utils.toArray(u),o=o||1e-9,a=a||0,f=f||1,Q=Q||1,t=t||"wheel,touch,pointer",i=!1!==i,r=r||parseFloat(Ae.getComputedStyle(Ce).lineHeight)||22;var ee,te,re,ne,oe,ie,ae,se=this,le=0,ce=0,ue=J(n,He),fe=J(n,Je),de=ue(),pe=fe(),ge=~t.indexOf("touch")&&!~t.indexOf("pointer")&&"pointerdown"===ze[0],he=z(n),ve=n.ownerDocument||Ee,be=[0,0,0],me=[0,0,0],ye=0,xe=se.onPress=function(e){Oe(e,1)||(se.axis=ae=null,te.pause(),se.isPressed=!0,e=L(e),le=ce=0,se.startX=se.x=e.clientX,se.startY=se.y=e.clientY,se._vx.reset(),se._vy.reset(),A(F?n:ve,ze[1],Te,s,!0),se.deltaX=se.deltaY=0,v&&v(se))};te=se._dc=we.delayedCall(c||.25,function onStopFunc(){se._vx.reset(),se._vy.reset(),te.pause(),l&&l(se)}).pause(),se.deltaX=se.deltaY=0,se._vx=K(0,50,!0),se._vy=K(0,50,!0),se.scrollX=ue,se.scrollY=fe,se.isDragging=se.isGesturing=se.isPressed=!1,se.enable=function(e){return se.isEnabled||(A(he?ve:n,"scroll",E),0<=t.indexOf("scroll")&&A(he?ve:n,"scroll",Ye,s,G),0<=t.indexOf("wheel")&&A(n,"wheel",Ze,s,G),(0<=t.indexOf("touch")&&Pe||0<=t.indexOf("pointer"))&&(A(n,ze[0],xe,s,G),A(ve,ze[2],Ve),A(ve,ze[3],Ve),U&&A(n,"click",Ne,!1,!0),j&&A(n,"click",bf),X&&A(ve,"gesturestart",We),H&&A(ve,"gestureend",Xe),P&&A(n,Ie+"enter",_e),D&&A(n,Ie+"leave",af),R&&A(n,Ie+"move",$e)),se.isEnabled=!0,e&&e.type&&xe(e),W&&W(se)),se},se.disable=function(){se.isEnabled&&(Le.filter(function(e){return e!==se&&z(e.target)}).length||B(he?ve:n,"scroll",E),se.isPressed&&(se._vx.reset(),se._vy.reset(),B(F?n:ve,ze[1],Te,!0)),B(he?ve:n,"scroll",Ye,G),B(n,"wheel",Ze,G),B(n,ze[0],xe,G),B(ve,ze[2],Ve),B(ve,ze[3],Ve),B(n,"click",Ne,!0),B(n,"click",bf),B(ve,"gesturestart",We),B(ve,"gestureend",Xe),B(n,Ie+"enter",_e),B(n,Ie+"leave",af),B(n,Ie+"move",$e),se.isEnabled=se.isPressed=se.isDragging=!1,q&&q(se))},se.kill=function(){se.disable();var e=Le.indexOf(se);0<=e&&Le.splice(e,1),Be===se&&(Be=0)},Le.push(se),F&&z(n)&&(Be=se),se.enable(d)},function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}(Observer,[{key:"velocityX",get:function get(){return this._vx.getVelocity()}},{key:"velocityY",get:function get(){return this._vy.getVelocity()}}]),Observer);function Observer(e){this.init(e)}C.version="3.11.2",C.create=function(e){return new C(e)},C.register=O,C.getAll=function(){return Le.slice()},C.getById=function(t){return Le.filter(function(e){return e.vars.id===t})[0]},q()&&we.registerPlugin(C);function xa(){return it=1}function ya(){return it=0}function za(e){return e}function Aa(e){return Math.round(1e5*e)/1e5||0}function Ba(){return"undefined"!=typeof window}function Ca(){return qe||Ba()&&(qe=window.gsap)&&qe.registerPlugin&&qe}function Da(e){return!!~s.indexOf(e)}function Ea(e){return y(e,"getBoundingClientRect")||(Da(e)?function(){return zt.width=je.innerWidth,zt.height=je.innerHeight,zt}:function(){return Mt(e)})}function Ha(e,t){var r=t.s,n=t.d2,o=t.d,i=t.a;return(r="scroll"+n)&&(i=y(e,r))?i()-Ea(e)()[o]:Da(e)?(Ue[r]||et[r])-(je["inner"+n]||Ue["client"+n]||et["client"+n]):e[r]-e["offset"+n]}function Ia(e,t){for(var r=0;r<p.length;r+=3)t&&!~t.indexOf(p[r+1])||e(p[r],p[r+1],p[r+2])}function Ja(e){return"string"==typeof e}function Ka(e){return"function"==typeof e}function La(e){return"number"==typeof e}function Ma(e){return"object"==typeof e}function Na(e,t,r){return e&&e.progress(t?0:1)&&r&&e.pause()}function Oa(e,t){if(e.enabled){var r=t(e);r&&r.totalTime&&(e.callbackAnimation=r)}}function db(e){return je.getComputedStyle(e)}function fb(e,t){for(var r in t)r in e||(e[r]=t[r]);return e}function hb(e,t){var r=t.d2;return e["offset"+r]||e["client"+r]||0}function ib(e){var t,r=[],n=e.labels,o=e.duration();for(t in n)r.push(n[t]/o);return r}function kb(o){var i=qe.utils.snap(o),a=Array.isArray(o)&&o.slice(0).sort(function(e,t){return e-t});return a?function(e,t,r){var n;if(void 0===r&&(r=.001),!t)return i(e);if(0<t){for(e-=r,n=0;n<a.length;n++)if(a[n]>=e)return a[n];return a[n-1]}for(n=a.length,e+=r;n--;)if(a[n]<=e)return a[n];return a[0]}:function(e,t,r){void 0===r&&(r=.001);var n=i(e);return!t||Math.abs(n-e)<r||n-e<0==t<0?n:i(t<0?e-o:e+o)}}function mb(t,r,e,n){return e.split(",").forEach(function(e){return t(r,e,n)})}function nb(e,t,r,n,o){return e.addEventListener(t,r,{passive:!n,capture:!!o})}function ob(e,t,r,n){return e.removeEventListener(t,r,!!n)}function pb(e,t,r){return r&&r.wheelHandler&&e(t,"wheel",r)}function tb(e,t){if(Ja(e)){var r=e.indexOf("="),n=~r?(e.charAt(r-1)+1)*parseFloat(e.substr(r+1)):0;~r&&(e.indexOf("%")>r&&(n*=t/100),e=e.substr(0,r-1)),e=n+(e in R?R[e]*t:~e.indexOf("%")?parseFloat(e)*t/100:parseFloat(e)||0)}return e}function ub(e,t,r,n,o,i,a,s){var l=o.startColor,c=o.endColor,u=o.fontSize,f=o.indent,d=o.fontWeight,p=Ge.createElement("div"),g=Da(r)||"fixed"===y(r,"pinType"),h=-1!==e.indexOf("scroller"),v=g?et:r,b=-1!==e.indexOf("start"),m=b?l:c,x="border-color:"+m+";font-size:"+u+";color:"+m+";font-weight:"+d+";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";return x+="position:"+((h||s)&&g?"fixed;":"absolute;"),!h&&!s&&g||(x+=(n===Je?S:T)+":"+(i+parseFloat(f))+"px;"),a&&(x+="box-sizing:border-box;text-align:left;width:"+a.offsetWidth+"px;"),p._isStart=b,p.setAttribute("class","gsap-marker-"+e+(t?" marker-"+t:"")),p.style.cssText=x,p.innerText=t||0===t?e+"-"+t:e,v.children[0]?v.insertBefore(p,v.children[0]):v.appendChild(p),p._offset=p["offset"+n.op.d2],Y(p,0,n,b),p}function zb(){return 34<gt()-ht&&U()}function Ab(){h&&h.isPressed&&!(h.startX>et.clientWidth)||(k.cache++,w=w||requestAnimationFrame(U),ht||V("scrollStart"),ht=gt())}function Bb(){m=je.innerWidth,b=je.innerHeight}function Cb(){k.cache++,ot||g||Ge.fullscreenElement||Ge.webkitFullscreenElement||v&&m===je.innerWidth&&!(Math.abs(je.innerHeight-b)>.25*je.innerHeight)||l.restart(!0)}function Fb(){return ob(re,"scrollEnd",Fb)||Q(!0)}function Ib(e){for(var t=0;t<W.length;t+=5)(!e||W[t+4]&&W[t+4].query===e)&&(W[t].style.cssText=W[t+1],W[t].getBBox&&W[t].setAttribute("transform",W[t+2]||""),W[t+3].uncache=1)}function Jb(e,t){var r;for(at=0;at<Pt.length;at++)!(r=Pt[at])||t&&r._ctx!==t||(e?r.kill(1):r.revert(!0,!0));t&&Ib(t),t||V("revert")}function Kb(e,t){k.cache++,!t&&ft||k.forEach(function(e){return Ka(e)&&e.cacheID++&&(e.rec=0)}),Ja(e)&&(je.history.scrollRestoration=x=e)}function Vb(e,t,r,n){if(!e._gsap.swappedIn){for(var o,i=Z.length,a=t.style,s=e.style;i--;)a[o=Z[i]]=r[o];a.position="absolute"===r.position?"absolute":"relative","inline"===r.display&&(a.display="inline-block"),s[T]=s[S]="auto",a.flexBasis=r.flexBasis||"auto",a.overflow="visible",a.boxSizing="border-box",a[mt]=hb(e,He)+Et,a[yt]=hb(e,Je)+Et,a[Tt]=s[kt]=s.top=s.left="0",Bt(n),s[mt]=s.maxWidth=r[mt],s[yt]=s.maxHeight=r[yt],s[Tt]=r[Tt],e.parentNode!==t&&(e.parentNode.insertBefore(t,e),t.appendChild(e)),e._gsap.swappedIn=!0}}function Yb(e){for(var t=$.length,r=e.style,n=[],o=0;o<t;o++)n.push($[o],r[$[o]]);return n.t=e,n}function _b(e,t,r,n,o,i,a,s,l,c,u,f,d){Ka(e)&&(e=e(s)),Ja(e)&&"max"===e.substr(0,3)&&(e=f+("="===e.charAt(4)?tb("0"+e.substr(3),r):0));var p,g,h,v=d?d.time():0;if(d&&d.seek(0),La(e))a&&Y(a,r,n,!0);else{Ka(t)&&(t=t(s));var b,m,y,x,w=(e||"0").split(" ");h=I(t)||et,(b=Mt(h)||{})&&(b.left||b.top)||"none"!==db(h).display||(x=h.style.display,h.style.display="block",b=Mt(h),x?h.style.display=x:h.style.removeProperty("display")),m=tb(w[0],b[n.d]),y=tb(w[1]||"0",r),e=b[n.p]-l[n.p]-c+m+o-y,a&&Y(a,y,n,r-y<20||a._isStart&&20<y),r-=r-y}if(i){var _=e+r,S=i._isStart;p="scroll"+n.d2,Y(i,_,n,S&&20<_||!S&&(u?Math.max(et[p],Ue[p]):i.parentNode[p])<=_+1),u&&(l=Mt(a),u&&(i.style[n.op.p]=l[n.op.p]-n.op.m-i._offset+Et))}return d&&h&&(p=Mt(h),d.seek(f),g=Mt(h),d._caScrollDist=p[n.p]-g[n.p],e=e/d._caScrollDist*f),d&&d.seek(v),d?e:Math.round(e)}function bc(e,t,r,n){if(e.parentNode!==t){var o,i,a=e.style;if(t===et){for(o in e._stOrig=a.cssText,i=db(e))+o||te.test(o)||!i[o]||"string"!=typeof a[o]||"0"===o||(a[o]=i[o]);a.top=r,a.left=n}else a.cssText=e._stOrig;qe.core.getCache(e).uncache=1,t.appendChild(e)}}function cc(l,e){function Kj(e,t,r,n,o){var i=Kj.tween,a=t.onComplete,s={};return r=r||f(),o=n&&o||0,n=n||e-r,i&&i.kill(),c=Math.round(r),t[d]=e,(t.modifiers=s)[d]=function(e){return(e=Math.round(f()))!==c&&e!==u&&3<Math.abs(e-c)&&3<Math.abs(e-u)?(i.kill(),Kj.tween=0):e=r+n*i.ratio+o*i.ratio*i.ratio,u=c,c=Math.round(e)},t.onComplete=function(){Kj.tween=0,a&&a.call(i)},i=Kj.tween=qe.to(l,t)}var c,u,f=J(l,e),d="_scroll"+e.p2;return(l[d]=f).wheelHandler=function(){return Kj.tween&&Kj.tween.kill()&&(Kj.tween=0)},nb(l,"wheel",f.wheelHandler),Kj}var qe,a,je,Ge,Ue,et,s,l,tt,rt,nt,c,ot,it,u,at,f,d,p,st,lt,g,h,v,b,m,P,ct,x,ut,w,ft,dt,pt=1,gt=Date.now,_=gt(),ht=0,vt=0,bt=Math.abs,S="right",T="bottom",mt="width",yt="height",xt="Right",wt="Left",_t="Top",St="Bottom",Tt="padding",kt="margin",At="Width",D="Height",Et="px",Mt=function _getBounds(e,t){var r=t&&"matrix(1, 0, 0, 1, 0, 0)"!==db(e)[u]&&qe.to(e,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),n=e.getBoundingClientRect();return r&&r.progress(0).kill(),n},Ot={startColor:"green",endColor:"red",indent:0,fontSize:"16px",fontWeight:"normal"},Ct={toggleActions:"play",anticipatePin:0},R={top:0,left:0,center:.5,bottom:1,right:1},Y=function _positionMarker(e,t,r,n){var o={display:"block"},i=r[n?"os2":"p2"],a=r[n?"p2":"os2"];e._isFlipped=n,o[r.a+"Percent"]=n?-100:0,o[r.a]=n?"1px":0,o["border"+i+At]=1,o["border"+a+At]=0,o[r.p]=t+"px",qe.set(e,o)},Pt=[],It={},X={},H=[],V=function _dispatch(e){return X[e]&&X[e].map(function(e){return e()})||H},W=[],j=0,Q=function _refreshAll(e,t){if(!ht||e){ft=re.isRefreshing=!0,k.forEach(function(e){return Ka(e)&&e.cacheID++&&(e.rec=e())});var r=V("refreshInit");st&&re.sort(),t||Jb(),k.forEach(function(e){Ka(e)&&(e.smooth&&(e.target.style.scrollBehavior="auto"),e(0))}),Pt.slice(0).forEach(function(e){return e.refresh()}),Pt.forEach(function(e){return"max"===e.vars.end&&e.setPositions(e.start,Math.max(e.start+1,Ha(e.scroller,e._dir)))}),r.forEach(function(e){return e&&e.render&&e.render(-1)}),k.forEach(function(e){Ka(e)&&(e.smooth&&requestAnimationFrame(function(){return e.target.style.scrollBehavior="smooth"}),e.rec&&e(e.rec))}),Kb(x,1),l.pause(),j++,U(2),ft=re.isRefreshing=!1,V("refresh")}else nb(re,"scrollEnd",Fb)},G=0,Dt=1,U=function _updateAll(e){if(!ft||2===e){re.isUpdating=!0,dt&&dt.update(0);var t=Pt.length,r=gt(),n=50<=r-_,o=t&&Pt[0].scroll();if(Dt=o<G?-1:1,G=o,n&&(ht&&!it&&200<r-ht&&(ht=0,V("scrollEnd")),nt=_,_=r),Dt<0){for(at=t;0<at--;)Pt[at]&&Pt[at].update(0,n);Dt=1}else for(at=0;at<t;at++)Pt[at]&&Pt[at].update(0,n);re.isUpdating=!1}w=0},Z=["left","top",T,S,kt+St,kt+xt,kt+_t,kt+wt,"display","flexShrink","float","zIndex","gridColumnStart","gridColumnEnd","gridRowStart","gridRowEnd","gridArea","justifySelf","alignSelf","placeSelf","order"],$=Z.concat([mt,yt,"boxSizing","max"+At,"max"+D,"position",kt,Tt,Tt+_t,Tt+xt,Tt+St,Tt+wt]),ee=/([A-Z])/g,Bt=function _setState(e){if(e){var t,r,n=e.t.style,o=e.length,i=0;for((e.t._gsap||qe.core.getCache(e.t)).uncache=1;i<o;i+=2)r=e[i+1],t=e[i],r?n[t]=r:n[t]&&n.removeProperty(t.replace(ee,"-$1").toLowerCase())}},zt={left:0,top:0},te=/(webkit|moz|length|cssText|inset)/i,re=(ScrollTrigger.prototype.init=function init(S,T){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),vt){var k,n,p,A,E,M,O,C,P,D,B,e,z,R,Y,L,F,t,X,b,K,N,m,H,x,w,r,_,V,W,o,g,q,j,Q,G,U,i,Z=(S=fb(Ja(S)||La(S)||S.nodeType?{trigger:S}:S,Ct)).onUpdate,$=S.toggleClass,a=S.id,ee=S.onToggle,te=S.onRefresh,re=S.scrub,ne=S.trigger,oe=S.pin,ie=S.pinSpacing,ae=S.invalidateOnRefresh,se=S.anticipatePin,s=S.onScrubComplete,h=S.onSnapComplete,le=S.once,ce=S.snap,ue=S.pinReparent,l=S.pinSpacer,fe=S.containerAnimation,de=S.fastScrollEnd,pe=S.preventOverlaps,ge=S.horizontal||S.containerAnimation&&!1!==S.horizontal?He:Je,he=!re&&0!==re,ve=I(S.scroller||je),c=qe.core.getCache(ve),be=Da(ve),me="fixed"===("pinType"in S?S.pinType:y(ve,"pinType")||be&&"fixed"),ye=[S.onEnter,S.onLeave,S.onEnterBack,S.onLeaveBack],xe=he&&S.toggleActions.split(" "),u="markers"in S?S.markers:Ct.markers,we=be?0:parseFloat(db(ve)["border"+ge.p2+At])||0,_e=this,Se=S.onRefreshInit&&function(){return S.onRefreshInit(_e)},Te=function _getSizeFunc(e,t,r){var n=r.d,o=r.d2,i=r.a;return(i=y(e,"getBoundingClientRect"))?function(){return i()[n]}:function(){return(t?je["inner"+o]:e["client"+o])||0}}(ve,be,ge),ke=function _getOffsetsFunc(e,t){return!t||~Fe.indexOf(e)?Ea(e):function(){return zt}}(ve,be),Ae=0,Ee=0,Me=J(ve,ge);if(ct(_e),_e._dir=ge,se*=45,_e.scroller=ve,_e.scroll=fe?fe.time.bind(fe):Me,A=Me(),_e.vars=S,T=T||S.animation,"refreshPriority"in S&&(st=1,-9999===S.refreshPriority&&(dt=_e)),c.tweenScroll=c.tweenScroll||{top:cc(ve,Je),left:cc(ve,He)},_e.tweenTo=k=c.tweenScroll[ge.p],_e.scrubDuration=function(e){(o=La(e)&&e)?W?W.duration(e):W=qe.to(T,{ease:"expo",totalProgress:"+=0.001",duration:o,paused:!0,onComplete:function onComplete(){return s&&s(_e)}}):(W&&W.progress(1).kill(),W=0)},T&&(T.vars.lazy=!1,T._initted||!1!==T.vars.immediateRender&&!1!==S.immediateRender&&T.duration()&&T.render(0,!0,!0),_e.animation=T.pause(),(T.scrollTrigger=_e).scrubDuration(re),_=0,a=a||T.vars.id),Pt.push(_e),ce&&(Ma(ce)&&!ce.push||(ce={snapTo:ce}),"scrollBehavior"in et.style&&qe.set(be?[et,Ue]:ve,{scrollBehavior:"auto"}),p=Ka(ce.snapTo)?ce.snapTo:"labels"===ce.snapTo?function _getClosestLabel(t){return function(e){return qe.utils.snap(ib(t),e)}}(T):"labelsDirectional"===ce.snapTo?function _getLabelAtDirection(r){return function(e,t){return kb(ib(r))(e,t.direction)}}(T):!1!==ce.directional?function(e,t){return kb(ce.snapTo)(e,gt()-Ee<500?0:t.direction)}:qe.utils.snap(ce.snapTo),g=ce.duration||{min:.1,max:2},g=Ma(g)?rt(g.min,g.max):rt(g,g),q=qe.delayedCall(ce.delay||o/2||.1,function(){var e=Me(),t=gt()-Ee<500,r=k.tween;if(!(t||Math.abs(_e.getVelocity())<10)||r||it||Ae===e)_e.isActive&&Ae!==e&&q.restart(!0);else{var n=(e-M)/z,o=T&&!he?T.totalProgress():n,i=t?0:(o-V)/(gt()-nt)*1e3||0,a=qe.utils.clamp(-n,1-n,bt(i/2)*i/.185),s=n+(!1===ce.inertia?0:a),l=rt(0,1,p(s,_e)),c=Math.round(M+l*z),u=ce.onStart,f=ce.onInterrupt,d=ce.onComplete;if(e<=O&&M<=e&&c!==e){if(r&&!r._initted&&r.data<=bt(c-e))return;!1===ce.inertia&&(a=l-n),k(c,{duration:g(bt(.185*Math.max(bt(s-o),bt(l-o))/i/.05||0)),ease:ce.ease||"power3",data:bt(c-e),onInterrupt:function onInterrupt(){return q.restart(!0)&&f&&f(_e)},onComplete:function onComplete(){_e.update(),Ae=Me(),_=V=T&&!he?T.totalProgress():_e.progress,h&&h(_e),d&&d(_e)}},e,a*z,c-e-a*z),u&&u(_e,k.tween)}}}).pause()),a&&(It[a]=_e),i=(i=(ne=_e.trigger=I(ne||oe))&&ne._gsap&&ne._gsap.stRevert)&&i(_e),oe=!0===oe?ne:I(oe),Ja($)&&($={targets:ne,className:$}),oe&&(!1===ie||ie===kt||(ie=!(!ie&&"flex"===db(oe.parentNode).display)&&Tt),_e.pin=oe,(n=qe.core.getCache(oe)).spacer?R=n.pinState:(l&&((l=I(l))&&!l.nodeType&&(l=l.current||l.nativeElement),n.spacerIsNative=!!l,l&&(n.spacerState=Yb(l))),n.spacer=F=l||Ge.createElement("div"),F.classList.add("pin-spacer"),a&&F.classList.add("pin-spacer-"+a),n.pinState=R=Yb(oe)),!1!==S.force3D&&qe.set(oe,{force3D:!0}),_e.spacer=F=n.spacer,r=db(oe),m=r[ie+ge.os2],X=qe.getProperty(oe),b=qe.quickSetter(oe,ge.a,Et),Vb(oe,F,r),L=Yb(oe)),u){e=Ma(u)?fb(u,Ot):Ot,D=ub("scroller-start",a,ve,ge,e,0),B=ub("scroller-end",a,ve,ge,e,0,D),t=D["offset"+ge.op.d2];var f=I(y(ve,"content")||ve);C=this.markerStart=ub("start",a,f,ge,e,t,0,fe),P=this.markerEnd=ub("end",a,f,ge,e,t,0,fe),fe&&(U=qe.quickSetter([C,P],ge.a,Et)),me||Fe.length&&!0===y(ve,"fixedMarkers")||(function _makePositionable(e){var t=db(e).position;e.style.position="absolute"===t||"fixed"===t?t:"relative"}(be?et:ve),qe.set([D,B],{force3D:!0}),x=qe.quickSetter(D,ge.a,Et),w=qe.quickSetter(B,ge.a,Et))}if(fe){var d=fe.vars.onUpdate,v=fe.vars.onUpdateParams;fe.eventCallback("onUpdate",function(){_e.update(0,0,1),d&&d.apply(v||[])})}_e.previous=function(){return Pt[Pt.indexOf(_e)-1]},_e.next=function(){return Pt[Pt.indexOf(_e)+1]},_e.revert=function(e,t){if(!t)return _e.kill(!0);var r=!1!==e||!_e.enabled,n=ot;r!==_e.isReverted&&(r&&(Q=Math.max(Me(),_e.scroll.rec||0),j=_e.progress,G=T&&T.progress()),C&&[C,P,D,B].forEach(function(e){return e.style.display=r?"none":"block"}),r&&(ot=1),_e.update(r),ot=n,oe&&(r?function _swapPinOut(e,t,r){Bt(r);var n=e._gsap;if(n.spacerIsNative)Bt(n.spacerState);else if(e._gsap.swappedIn){var o=t.parentNode;o&&(o.insertBefore(e,t),o.removeChild(t))}e._gsap.swappedIn=!1}(oe,F,R):ue&&_e.isActive||Vb(oe,F,db(oe),H)),_e.isReverted=r)},_e.refresh=function(e,t){if(!ot&&_e.enabled||t)if(oe&&e&&ht)nb(ScrollTrigger,"scrollEnd",Fb);else{!ft&&Se&&Se(_e),ot=1,Ee=gt(),k.tween&&(k.tween.kill(),k.tween=0),W&&W.pause(),ae&&T&&T.revert({kill:!1}).invalidate(),_e.isReverted||_e.revert(!0,!0);for(var r,n,o,i,a,s,l,c,u,f,d=Te(),p=ke(),g=fe?fe.duration():Ha(ve,ge),h=0,v=0,b=S.end,m=S.endTrigger||ne,y=S.start||(0!==S.start&&ne?oe?"0 0":"0 100%":0),x=_e.pinnedContainer=S.pinnedContainer&&I(S.pinnedContainer),w=ne&&Math.max(0,Pt.indexOf(_e))||0,_=w;_--;)(s=Pt[_]).end||s.refresh(0,1)||(ot=1),!(l=s.pin)||l!==ne&&l!==oe||s.isReverted||((f=f||[]).unshift(s),s.revert(!0,!0)),s!==Pt[_]&&(w--,_--);for(Ka(y)&&(y=y(_e)),M=_b(y,ne,d,ge,Me(),C,D,_e,p,we,me,g,fe)||(oe?-.001:0),Ka(b)&&(b=b(_e)),Ja(b)&&!b.indexOf("+=")&&(~b.indexOf(" ")?b=(Ja(y)?y.split(" ")[0]:"")+b:(h=tb(b.substr(2),d),b=Ja(y)?y:M+h,m=ne)),O=Math.max(M,_b(b||(m?"100% 0":g),m,d,ge,Me()+h,P,B,_e,p,we,me,g,fe))||-.001,z=O-M||(M-=.01)&&.001,h=0,_=w;_--;)(l=(s=Pt[_]).pin)&&s.start-s._pinPush<M&&!fe&&0<s.end&&(r=s.end-s.start,l!==ne&&l!==x||La(y)||(h+=r*(1-s.progress)),l===oe&&(v+=r));if(M+=h,O+=h,_e._pinPush=v,C&&h&&((r={})[ge.a]="+="+h,x&&(r[ge.p]="-="+Me()),qe.set([C,P],r)),oe)r=db(oe),i=ge===Je,o=Me(),K=parseFloat(X(ge.a))+v,!g&&1<O&&((be?et:ve).style["overflow-"+ge.a]="scroll"),Vb(oe,F,r),L=Yb(oe),n=Mt(oe,!0),c=me&&J(ve,i?He:Je)(),ie&&((H=[ie+ge.os2,z+v+Et]).t=F,(_=ie===Tt?hb(oe,ge)+z+v:0)&&H.push(ge.d,_+Et),Bt(H),me&&Me(Q)),me&&((a={top:n.top+(i?o-M:c)+Et,left:n.left+(i?c:o-M)+Et,boxSizing:"border-box",position:"fixed"})[mt]=a.maxWidth=Math.ceil(n.width)+Et,a[yt]=a.maxHeight=Math.ceil(n.height)+Et,a[kt]=a[kt+_t]=a[kt+xt]=a[kt+St]=a[kt+wt]="0",a[Tt]=r[Tt],a[Tt+_t]=r[Tt+_t],a[Tt+xt]=r[Tt+xt],a[Tt+St]=r[Tt+St],a[Tt+wt]=r[Tt+wt],Y=function _copyState(e,t,r){for(var n,o=[],i=e.length,a=r?8:0;a<i;a+=2)n=e[a],o.push(n,n in t?t[n]:e[a+1]);return o.t=e.t,o}(R,a,ue),ft&&Me(0)),T?(u=T._initted,lt(1),T.render(T.duration(),!0,!0),N=X(ge.a)-K+z+v,z!==N&&me&&Y.splice(Y.length-2,2),T.render(0,!0,!0),u||T.invalidate(!0),T.parent||T.totalTime(T.totalTime()),lt(0)):N=z;else if(ne&&Me()&&!fe)for(n=ne.parentNode;n&&n!==et;)n._pinOffset&&(M-=n._pinOffset,O-=n._pinOffset),n=n.parentNode;f&&f.forEach(function(e){return e.revert(!1,!0)}),_e.start=M,_e.end=O,A=E=ft?Q:Me(),fe||ft||(A<Q&&Me(Q),_e.scroll.rec=0),_e.revert(!1,!0),q&&(Ae=-1,_e.isActive&&Me(M+z*j),q.restart(!0)),ot=0,T&&he&&(T._initted||G)&&T.progress()!==G&&T.progress(G,!0).render(T.time(),!0,!0),j===_e.progress&&!fe||(T&&!he&&T.totalProgress(j,!0),_e.progress=(A-M)/z===j?0:j),oe&&ie&&(F._pinOffset=Math.round(_e.progress*N)),te&&te(_e)}},_e.getVelocity=function(){return(Me()-E)/(gt()-nt)*1e3||0},_e.endAnimation=function(){Na(_e.callbackAnimation),T&&(W?W.progress(1):T.paused()?he||Na(T,_e.direction<0,1):Na(T,T.reversed()))},_e.labelToScroll=function(e){return T&&T.labels&&(M||_e.refresh()||M)+T.labels[e]/T.duration()*z||0},_e.getTrailing=function(t){var e=Pt.indexOf(_e),r=0<_e.direction?Pt.slice(0,e).reverse():Pt.slice(e+1);return(Ja(t)?r.filter(function(e){return e.vars.preventOverlaps===t}):r).filter(function(e){return 0<_e.direction?e.end<=M:e.start>=O})},_e.update=function(e,t,r){if(!fe||r||e){var n,o,i,a,s,l,c,u=ft?Q:_e.scroll(),f=e?0:(u-M)/z,d=f<0?0:1<f?1:f||0,p=_e.progress;if(t&&(E=A,A=fe?Me():u,ce&&(V=_,_=T&&!he?T.totalProgress():d)),se&&!d&&oe&&!ot&&!pt&&ht&&M<u+(u-E)/(gt()-nt)*se&&(d=1e-4),d!==p&&_e.enabled){if(a=(s=(n=_e.isActive=!!d&&d<1)!=(!!p&&p<1))||!!d!=!!p,_e.direction=p<d?1:-1,_e.progress=d,a&&!ot&&(o=d&&!p?0:1===d?1:1===p?2:3,he&&(i=!s&&"none"!==xe[o+1]&&xe[o+1]||xe[o],c=T&&("complete"===i||"reset"===i||i in T))),pe&&(s||c)&&(c||re||!T)&&(Ka(pe)?pe(_e):_e.getTrailing(pe).forEach(function(e){return e.endAnimation()})),he||(!W||ot||pt?T&&T.totalProgress(d,!!ot):((fe||dt&&dt!==_e)&&W.render(W._dp._time-W._start),W.resetTo?W.resetTo("totalProgress",d,T._tTime/T._tDur):(W.vars.totalProgress=d,W.invalidate().restart()))),oe)if(e&&ie&&(F.style[ie+ge.os2]=m),me){if(a){if(l=!e&&p<d&&u<O+1&&u+1>=Ha(ve,ge),ue)if(e||!n&&!l)bc(oe,F);else{var g=Mt(oe,!0),h=u-M;bc(oe,et,g.top+(ge===Je?h:0)+Et,g.left+(ge===Je?0:h)+Et)}Bt(n||l?Y:L),N!==z&&d<1&&n||b(K+(1!==d||l?0:N))}}else b(Aa(K+N*d));!ce||k.tween||ot||pt||q.restart(!0),$&&(s||le&&d&&(d<1||!ut))&&tt($.targets).forEach(function(e){return e.classList[n||le?"add":"remove"]($.className)}),!Z||he||e||Z(_e),a&&!ot?(he&&(c&&("complete"===i?T.pause().totalProgress(1):"reset"===i?T.restart(!0).pause():"restart"===i?T.restart(!0):T[i]()),Z&&Z(_e)),!s&&ut||(ee&&s&&Oa(_e,ee),ye[o]&&Oa(_e,ye[o]),le&&(1===d?_e.kill(!1,1):ye[o]=0),s||ye[o=1===d?1:3]&&Oa(_e,ye[o])),de&&!n&&Math.abs(_e.getVelocity())>(La(de)?de:2500)&&(Na(_e.callbackAnimation),W?W.progress(1):Na(T,"reverse"===i?1:!d,1))):he&&Z&&!ot&&Z(_e)}if(w){var v=fe?u/fe.duration()*(fe._caScrollDist||0):u;x(v+(D._isFlipped?1:0)),w(v)}U&&U(-u/fe.duration()*(fe._caScrollDist||0))}},_e.enable=function(e,t){_e.enabled||(_e.enabled=!0,nb(ve,"resize",Cb),nb(be?Ge:ve,"scroll",Ab),Se&&nb(ScrollTrigger,"refreshInit",Se),!1!==e&&(_e.progress=j=0,A=E=Ae=Me()),!1!==t&&_e.refresh())},_e.getTween=function(e){return e&&k?k.tween:W},_e.setPositions=function(e,t){oe&&(K+=e-M,N+=t-e-z),_e.start=M=e,_e.end=O=t,z=t-e,_e.update()},_e.disable=function(e,t){if(_e.enabled&&(!1!==e&&_e.revert(!0,!0),_e.enabled=_e.isActive=!1,t||W&&W.pause(),Q=0,n&&(n.uncache=1),Se&&ob(ScrollTrigger,"refreshInit",Se),q&&(q.pause(),k.tween&&k.tween.kill()&&(k.tween=0)),!be)){for(var r=Pt.length;r--;)if(Pt[r].scroller===ve&&Pt[r]!==_e)return;ob(ve,"resize",Cb),ob(ve,"scroll",Ab)}},_e.kill=function(e,t){_e.disable(e,t),W&&!t&&W.kill(),a&&delete It[a];var r=Pt.indexOf(_e);0<=r&&Pt.splice(r,1),r===at&&0<Dt&&at--,r=0,Pt.forEach(function(e){return e.scroller===_e.scroller&&(r=1)}),r||ft||(_e.scroll.rec=0),T&&(T.scrollTrigger=null,e&&T.revert({kill:!1}),t||T.kill()),C&&[C,P,D,B].forEach(function(e){return e.parentNode&&e.parentNode.removeChild(e)}),dt===_e&&(dt=0),oe&&(n&&(n.uncache=1),r=0,Pt.forEach(function(e){return e.pin===oe&&r++}),r||(n.spacer=0)),S.onKill&&S.onKill(_e)},_e.enable(!1,!1),i&&i(_e),T&&T.add&&!z?qe.delayedCall(.01,function(){return M||O||_e.refresh()})&&(z=.01)&&(M=O=0):_e.refresh()}else this.update=this.refresh=this.kill=za},ScrollTrigger.register=function register(e){return a||(qe=e||Ca(),Ba()&&window.document&&ScrollTrigger.enable(),a=vt),a},ScrollTrigger.defaults=function defaults(e){if(e)for(var t in e)Ct[t]=e[t];return Ct},ScrollTrigger.disable=function disable(t,r){vt=0,Pt.forEach(function(e){return e[r?"kill":"disable"](t)}),ob(je,"wheel",Ab),ob(Ge,"scroll",Ab),clearInterval(c),ob(Ge,"touchcancel",za),ob(et,"touchstart",za),mb(ob,Ge,"pointerdown,touchstart,mousedown",xa),mb(ob,Ge,"pointerup,touchend,mouseup",ya),l.kill(),Ia(ob);for(var e=0;e<k.length;e+=3)pb(ob,k[e],k[e+1]),pb(ob,k[e],k[e+2])},ScrollTrigger.enable=function enable(){if(je=window,Ge=document,Ue=Ge.documentElement,et=Ge.body,qe&&(tt=qe.utils.toArray,rt=qe.utils.clamp,ct=qe.core.context||za,lt=qe.core.suppressOverwrites||za,x=je.history.scrollRestoration||"auto",qe.core.globals("ScrollTrigger",ScrollTrigger),et)){vt=1,C.register(qe),ScrollTrigger.isTouch=C.isTouch,P=C.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),nb(je,"wheel",Ab),s=[je,Ge,Ue,et],qe.matchMedia?(ScrollTrigger.matchMedia=function(e){var t,r=qe.matchMedia();for(t in e)r.add(t,e[t]);return r},qe.addEventListener("matchMediaInit",function(){return Jb()}),qe.addEventListener("matchMediaRevert",function(){return Ib()}),qe.addEventListener("matchMedia",function(){Q(0,1),V("matchMedia")}),qe.matchMedia("(orientation: portrait)",function(){return Bb(),Bb})):console.warn("Requires GSAP 3.11.0 or later"),Bb(),nb(Ge,"scroll",Ab);var e,t,r=et.style,n=r.borderTopStyle,o=qe.core.Animation.prototype;for(o.revert||Object.defineProperty(o,"revert",{value:function value(){return this.time(-.01,!0)}}),r.borderTopStyle="solid",e=Mt(et),Je.m=Math.round(e.top+Je.sc())||0,He.m=Math.round(e.left+He.sc())||0,n?r.borderTopStyle=n:r.removeProperty("border-top-style"),c=setInterval(zb,250),qe.delayedCall(.5,function(){return pt=0}),nb(Ge,"touchcancel",za),nb(et,"touchstart",za),mb(nb,Ge,"pointerdown,touchstart,mousedown",xa),mb(nb,Ge,"pointerup,touchend,mouseup",ya),u=qe.utils.checkPrefix("transform"),$.push(u),a=gt(),l=qe.delayedCall(.2,Q).pause(),p=[Ge,"visibilitychange",function(){var e=je.innerWidth,t=je.innerHeight;Ge.hidden?(f=e,d=t):f===e&&d===t||Cb()},Ge,"DOMContentLoaded",Q,je,"load",Q,je,"resize",Cb],Ia(nb),Pt.forEach(function(e){return e.enable(0,1)}),t=0;t<k.length;t+=3)pb(ob,k[t],k[t+1]),pb(ob,k[t],k[t+2])}},ScrollTrigger.config=function config(e){"limitCallbacks"in e&&(ut=!!e.limitCallbacks);var t=e.syncInterval;t&&clearInterval(c)||(c=t)&&setInterval(zb,t),"ignoreMobileResize"in e&&(v=1===ScrollTrigger.isTouch&&e.ignoreMobileResize),"autoRefreshEvents"in e&&(Ia(ob)||Ia(nb,e.autoRefreshEvents||"none"),g=-1===(e.autoRefreshEvents+"").indexOf("resize"))},ScrollTrigger.scrollerProxy=function scrollerProxy(e,t){var r=I(e),n=k.indexOf(r),o=Da(r);~n&&k.splice(n,o?6:2),t&&(o?Fe.unshift(je,t,et,t,Ue,t):Fe.unshift(r,t))},ScrollTrigger.clearMatchMedia=function clearMatchMedia(t){Pt.forEach(function(e){return e._ctx&&e._ctx.query===t&&e._ctx.kill(!0,!0)})},ScrollTrigger.isInViewport=function isInViewport(e,t,r){var n=(Ja(e)?I(e):e).getBoundingClientRect(),o=n[r?mt:yt]*t||0;return r?0<n.right-o&&n.left+o<je.innerWidth:0<n.bottom-o&&n.top+o<je.innerHeight},ScrollTrigger.positionInViewport=function positionInViewport(e,t,r){Ja(e)&&(e=I(e));var n=e.getBoundingClientRect(),o=n[r?mt:yt],i=null==t?o/2:t in R?R[t]*o:~t.indexOf("%")?parseFloat(t)*o/100:parseFloat(t)||0;return r?(n.left+i)/je.innerWidth:(n.top+i)/je.innerHeight},ScrollTrigger.killAll=function killAll(e){if(Pt.forEach(function(e){return"ScrollSmoother"!==e.vars.id&&e.kill()}),!0!==e){var t=X.killAll||[];X={},t.forEach(function(e){return e()})}},ScrollTrigger);function ScrollTrigger(e,t){a||ScrollTrigger.register(qe)||console.warn("Please gsap.registerPlugin(ScrollTrigger)"),this.init(e,t)}re.version="3.11.2",re.saveStyles=function(e){return e?tt(e).forEach(function(e){if(e&&e.style){var t=W.indexOf(e);0<=t&&W.splice(t,5),W.push(e,e.style.cssText,e.getBBox&&e.getAttribute("transform"),qe.core.getCache(e),ct())}}):W},re.revert=function(e,t){return Jb(!e,t)},re.create=function(e,t){return new re(e,t)},re.refresh=function(e){return e?Cb():(a||re.register())&&Q(!0)},re.update=U,re.clearScrollMemory=Kb,re.maxScroll=function(e,t){return Ha(e,t?He:Je)},re.getScrollFunc=function(e,t){return J(I(e),t?He:Je)},re.getById=function(e){return It[e]},re.getAll=function(){return Pt.filter(function(e){return"ScrollSmoother"!==e.vars.id})},re.isScrolling=function(){return!!ht},re.snapDirectional=kb,re.addEventListener=function(e,t){var r=X[e]||(X[e]=[]);~r.indexOf(t)||r.push(t)},re.removeEventListener=function(e,t){var r=X[e],n=r&&r.indexOf(t);0<=n&&r.splice(n,1)},re.batch=function(e,t){function ro(e,t){var r=[],n=[],o=qe.delayedCall(i,function(){t(r,n),r=[],n=[]}).pause();return function(e){r.length||o.restart(!0),r.push(e.trigger),n.push(e),a<=r.length&&o.progress(1)}}var r,n=[],o={},i=t.interval||.016,a=t.batchMax||1e9;for(r in t)o[r]="on"===r.substr(0,2)&&Ka(t[r])&&"onRefreshInit"!==r?ro(0,t[r]):t[r];return Ka(a)&&(a=a(),nb(re,"refresh",function(){return a=t.batchMax()})),tt(e).forEach(function(e){var t={};for(r in o)t[r]=o[r];t.trigger=e,n.push(re.create(t))}),n};function ec(e,t,r,n){return n<t?e(n):t<0&&e(0),n<r?(n-t)/(r-t):r<0?t/(t-r):1}function fc(e,t){!0===t?e.style.removeProperty("touch-action"):e.style.touchAction=!0===t?"auto":t?"pan-"+t+(C.isTouch?" pinch-zoom":""):"none",e===Ue&&fc(et,t)}function hc(e){var t,r=e.event,n=e.target,o=e.axis,i=(r.changedTouches?r.changedTouches[0]:r).target,a=i._gsap||qe.core.getCache(i),s=gt();if(!a._isScrollT||2e3<s-a._isScrollT){for(;i&&i.scrollHeight<=i.clientHeight;)i=i.parentNode;a._isScroll=i&&!Da(i)&&i!==n&&(oe[(t=db(i)).overflowY]||oe[t.overflowX]),a._isScrollT=s}!a._isScroll&&"x"!==o||(r.stopPropagation(),r._gsapAllow=!0)}function ic(e,t,r,n){return C.create({target:e,capture:!0,debounce:!1,lockAxis:!0,type:t,onWheel:n=n&&hc,onPress:n,onDrag:n,onScroll:n,onEnable:function onEnable(){return r&&nb(Ge,C.eventTypes[0],ae,!1,!0)},onDisable:function onDisable(){return ob(Ge,C.eventTypes[0],ae,!0)}})}function mc(e){function np(){return o=!1}function qp(){i=Ha(d,Je),T=rt(P?1:0,i),f&&(S=rt(0,Ha(d,He))),l=j}function rp(){h._gsap.y=Aa(parseFloat(h._gsap.y)+v.offset)+"px",h.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+parseFloat(h._gsap.y)+", 0, 1)",v.offset=v.cacheID=0}function xp(){qp(),a.isActive()&&a.vars.scrollY>i&&(v()>i?a.progress(1)&&v(i):a.resetTo("scrollY",i))}Ma(e)||(e={}),e.preventDefault=e.isNormalizer=e.allowClicks=!0,e.type||(e.type="wheel,touch"),e.debounce=!!e.debounce,e.id=e.id||"normalizer";var n,i,l,o,a,c,u,s,f=e.normalizeScrollX,t=e.momentum,r=e.allowNestedScroll,d=I(e.target)||Ue,p=qe.core.globals().ScrollSmoother,g=p&&p.get(),h=P&&(e.content&&I(e.content)||g&&!1!==e.content&&!g.smooth()&&g.content()),v=J(d,Je),b=J(d,He),m=1,y=(C.isTouch&&je.visualViewport?je.visualViewport.scale*je.visualViewport.width:je.outerWidth)/je.innerWidth,x=0,w=Ka(t)?function(){return t(n)}:function(){return t||2.8},_=ic(d,e.type,!0,r),S=za,T=za;return h&&qe.set(h,{y:"+=0"}),e.ignoreCheck=function(e){return P&&"touchmove"===e.type&&function ignoreDrag(){if(o){requestAnimationFrame(np);var e=Aa(n.deltaY/2),t=T(v.v-e);if(h&&t!==v.v+v.offset){v.offset=t-v.v;var r=Aa((parseFloat(h&&h._gsap.y)||0)-v.offset);h.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+r+", 0, 1)",h._gsap.y=r+"px",v.cacheID=k.cache,U()}return!0}v.offset&&rp(),o=!0}()||1.05<m&&"touchstart"!==e.type||n.isGesturing||e.touches&&1<e.touches.length},e.onPress=function(){var e=m;m=Aa((je.visualViewport&&je.visualViewport.scale||1)/y),a.pause(),e!==m&&fc(d,1.01<m||!f&&"x"),c=b(),u=v(),qp(),l=j},e.onRelease=e.onGestureStart=function(e,t){if(v.offset&&rp(),t){k.cache++;var r,n,o=w();f&&(n=(r=b())+.05*o*-e.velocityX/.227,o*=ec(b,r,n,Ha(d,He)),a.vars.scrollX=S(n)),n=(r=v())+.05*o*-e.velocityY/.227,o*=ec(v,r,n,Ha(d,Je)),a.vars.scrollY=T(n),a.invalidate().duration(o).play(.01),(P&&a.vars.scrollY>=i||i-1<=r)&&qe.to({},{onUpdate:xp,duration:o})}else s.restart(!0)},e.onWheel=function(){a._ts&&a.pause(),1e3<gt()-x&&(l=0,x=gt())},e.onChange=function(e,t,r,n,o){if(j!==l&&qp(),t&&f&&b(S(n[2]===t?c+(e.startX-e.x):b()+t-n[1])),r){v.offset&&rp();var i=o[2]===r,a=i?u+e.startY-e.y:v()+r-o[1],s=T(a);i&&a!==s&&(u+=s-a),v(s)}(r||t)&&U()},e.onEnable=function(){fc(d,!f&&"x"),re.addEventListener("refresh",xp),nb(je,"resize",xp),v.smooth&&(v.target.style.scrollBehavior="auto",v.smooth=b.smooth=!1),_.enable()},e.onDisable=function(){fc(d,!0),ob(je,"resize",xp),re.removeEventListener("refresh",xp),_.kill()},e.lockAxis=!1!==e.lockAxis,((n=new C(e)).iOS=P)&&!v()&&v(1),P&&qe.ticker.add(za),s=n._dc,a=qe.to(n,{ease:"power4",paused:!0,scrollX:f?"+=0.1":"+=0",scrollY:"+=0.1",onComplete:s.vars.onComplete}),n}var ne,oe={auto:1,scroll:1},ie=/(input|label|select|textarea)/i,ae=function _captureInputs(e){var t=ie.test(e.target.tagName);(t||ne)&&(e._gsapAllow=!0,ne=t)};re.sort=function(e){return Pt.sort(e||function(e,t){return-1e6*(e.vars.refreshPriority||0)+e.start-(t.start+-1e6*(t.vars.refreshPriority||0))})},re.observe=function(e){return new C(e)},re.normalizeScroll=function(e){if(void 0===e)return h;if(!0===e&&h)return h.enable();if(!1===e)return h&&h.kill();var t=e instanceof C?e:mc(e);return h&&h.target===t.target&&h.kill(),Da(t.target)&&(h=t),t},re.core={_getVelocityProp:K,_inputObserver:ic,_scrollers:k,_proxies:Fe,bridge:{ss:function ss(){ht||V("scrollStart"),ht=gt()},ref:function ref(){return ot}}},Ca()&&qe.registerPlugin(re),e.ScrollTrigger=re,e.default=re;if (typeof(window)==="undefined"||window!==e){Object.defineProperty(e,"__esModule",{value:!0})} else {delete e.default}});

