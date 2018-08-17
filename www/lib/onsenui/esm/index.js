/* onsenui v2.10.1 - 2018-06-08 */

import ons from './ons/index.js';
import './ons/platform';
import './ons/microevent.js';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var fastclick = createCommonjsModule(function (module) {
	(function () {
		function FastClick(layer, options) {
			var oldOnClick;

			options = options || {};

			/**
    * Whether a click is currently being tracked.
    *
    * @type boolean
    */
			this.trackingClick = false;

			/**
    * Timestamp for when click tracking started.
    *
    * @type number
    */
			this.trackingClickStart = 0;

			/**
    * The element being tracked for a click.
    *
    * @type EventTarget
    */
			this.targetElement = null;

			/**
    * X-coordinate of touch start event.
    *
    * @type number
    */
			this.touchStartX = 0;

			/**
    * Y-coordinate of touch start event.
    *
    * @type number
    */
			this.touchStartY = 0;

			/**
    * ID of the last touch, retrieved from Touch.identifier.
    *
    * @type number
    */
			this.lastTouchIdentifier = 0;

			/**
    * Touchmove boundary, beyond which a click will be cancelled.
    *
    * @type number
    */
			this.touchBoundary = options.touchBoundary || 10;

			/**
    * The FastClick layer.
    *
    * @type Element
    */
			this.layer = layer;

			/**
    * The minimum time between tap(touchstart and touchend) events
    *
    * @type number
    */
			this.tapDelay = options.tapDelay || 200;

			/**
    * The maximum time for a tap
    *
    * @type number
    */
			this.tapTimeout = options.tapTimeout || 700;

			if (FastClick.notNeeded(layer)) {
				return;
			}

			// Some old versions of Android don't have Function.prototype.bind
			function bind(method, context) {
				return function () {
					return method.apply(context, arguments);
				};
			}

			var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
			var context = this;
			for (var i = 0, l = methods.length; i < l; i++) {
				context[methods[i]] = bind(context[methods[i]], context);
			}

			// Set up event handlers as required
			if (deviceIsAndroid) {
				layer.addEventListener('mouseover', this.onMouse, true);
				layer.addEventListener('mousedown', this.onMouse, true);
				layer.addEventListener('mouseup', this.onMouse, true);
			}

			layer.addEventListener('click', this.onClick, true);
			layer.addEventListener('touchstart', this.onTouchStart, false);
			layer.addEventListener('touchmove', this.onTouchMove, false);
			layer.addEventListener('touchend', this.onTouchEnd, false);
			layer.addEventListener('touchcancel', this.onTouchCancel, false);

			// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
			// layer when they are cancelled.
			if (!Event.prototype.stopImmediatePropagation) {
				layer.removeEventListener = function (type, callback, capture) {
					var rmv = Node.prototype.removeEventListener;
					if (type === 'click') {
						rmv.call(layer, type, callback.hijacked || callback, capture);
					} else {
						rmv.call(layer, type, callback, capture);
					}
				};

				layer.addEventListener = function (type, callback, capture) {
					var adv = Node.prototype.addEventListener;
					if (type === 'click') {
						adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
							if (!event.propagationStopped) {
								callback(event);
							}
						}), capture);
					} else {
						adv.call(layer, type, callback, capture);
					}
				};
			}

			// If a handler is already declared in the element's onclick attribute, it will be fired before
			// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
			// adding it as listener.
			if (typeof layer.onclick === 'function') {

				// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
				// - the old one won't work if passed to addEventListener directly.
				oldOnClick = layer.onclick;
				layer.addEventListener('click', function (event) {
					oldOnClick(event);
				}, false);
				layer.onclick = null;
			}
		}

		/**
  * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
  *
  * @type boolean
  */
		var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

		/**
   * Android requires exceptions.
   *
   * @type boolean
   */
		var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;

		/**
   * iOS requires exceptions.
   *
   * @type boolean
   */
		var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;

		/**
   * iOS 4 requires an exception for select elements.
   *
   * @type boolean
   */
		var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);

		/**
   * iOS 6.0-7.* requires the target element to be manually derived
   *
   * @type boolean
   */
		var deviceIsIOSWithBadTarget = deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);

		/**
   * BlackBerry requires exceptions.
   *
   * @type boolean
   */
		var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

		/**
   * Valid types for text inputs
   *
   * @type array
   */
		var textFields = ['email', 'number', 'password', 'search', 'tel', 'text', 'url'];

		/**
   * Determine whether a given element requires a native click.
   *
   * @param {EventTarget|Element} target Target DOM element
   * @returns {boolean} Returns true if the element needs a native click
   */
		FastClick.prototype.needsClick = function (target) {
			switch (target.nodeName.toLowerCase()) {

				// Don't send a synthetic click to disabled inputs (issue #62)
				case 'button':
				case 'select':
				case 'textarea':
					if (target.disabled) {
						return true;
					}

					break;
				case 'input':

					// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
					if (deviceIsIOS && target.type === 'file' || target.disabled) {
						return true;
					}

					break;
				case 'label':
				case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
				case 'video':
					return true;
			}

			return (/\bneedsclick\b/.test(target.className)
			);
		};

		/**
   * Determine whether a given element requires a call to focus to simulate click into element.
   *
   * @param {EventTarget|Element} target Target DOM element
   * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
   */
		FastClick.prototype.needsFocus = function (target) {
			switch (target.nodeName.toLowerCase()) {
				case 'textarea':
					return true;
				case 'select':
					return !deviceIsAndroid;
				case 'input':
					switch (target.type) {
						case 'button':
						case 'checkbox':
						case 'file':
						case 'image':
						case 'radio':
						case 'submit':
							return false;
					}

					// No point in attempting to focus disabled inputs
					return !target.disabled && !target.readOnly;
				default:
					return (/\bneedsfocus\b/.test(target.className)
					);
			}
		};

		/**
   * Send a click event to the specified element.
   *
   * @param {EventTarget|Element} targetElement
   * @param {Event} event
   */
		FastClick.prototype.sendClick = function (targetElement, event) {
			var clickEvent, touch;

			// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
			if (document.activeElement && document.activeElement !== targetElement) {
				document.activeElement.blur();
			}

			touch = event.changedTouches[0];

			// Synthesise a click event, with an extra attribute so it can be tracked
			clickEvent = document.createEvent('MouseEvents');
			clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
			clickEvent.forwardedTouchEvent = true;
			targetElement.dispatchEvent(clickEvent);
		};

		FastClick.prototype.determineEventType = function (targetElement) {

			//Issue #159: Android Chrome Select Box does not open with a synthetic click event
			if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
				return 'mousedown';
			}

			return 'click';
		};

		/**
   * @param {EventTarget|Element} targetElement
   */
		FastClick.prototype.focus = function (targetElement) {
			var length;

			// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
			if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month' && targetElement.type !== 'email' && targetElement.type !== 'number') {
				length = targetElement.value.length;
				targetElement.setSelectionRange(length, length);
			} else {
				targetElement.focus();
			}
		};

		/**
   * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
   *
   * @param {EventTarget|Element} targetElement
   */
		FastClick.prototype.updateScrollParent = function (targetElement) {
			var scrollParent, parentElement;

			scrollParent = targetElement.fastClickScrollParent;

			// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
			// target element was moved to another parent.
			if (!scrollParent || !scrollParent.contains(targetElement)) {
				parentElement = targetElement;
				do {
					if (parentElement.scrollHeight > parentElement.offsetHeight) {
						scrollParent = parentElement;
						targetElement.fastClickScrollParent = parentElement;
						break;
					}

					parentElement = parentElement.parentElement;
				} while (parentElement);
			}

			// Always update the scroll top tracker if possible.
			if (scrollParent) {
				scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
			}
		};

		/**
   * @param {EventTarget} targetElement
   * @returns {Element|EventTarget}
   */
		FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {

			// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
			if (eventTarget.nodeType === Node.TEXT_NODE) {
				return eventTarget.parentNode;
			}

			return eventTarget;
		};

		/**
   * @param {EventTarget} targetElement
   * @returns {boolean}
   */
		FastClick.prototype.isTextField = function (targetElement) {
			return targetElement.tagName.toLowerCase() === 'textarea' || textFields.indexOf(targetElement.type) !== -1;
		};

		/**
   * On touch start, record the position and scroll offset.
   *
   * @param {Event} event
   * @returns {boolean}
   */
		FastClick.prototype.onTouchStart = function (event) {
			var targetElement, touch;

			// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
			if (event.targetTouches.length > 1) {
				return true;
			}

			targetElement = this.getTargetElementFromEventTarget(event.target);
			touch = event.targetTouches[0];

			// Ignore touches on contenteditable elements to prevent conflict with text selection.
			// (For details: https://github.com/ftlabs/fastclick/pull/211 )
			if (targetElement.isContentEditable) {
				return true;
			}

			if (deviceIsIOS) {
				// Ignore touchstart in focused text field
				// Allows normal text selection and commands (select/paste/cut) when a field has focus, while still allowing fast tap-to-focus.
				// Without this fix, user needs to tap-and-hold a text field for context menu, and double-tap to select text doesn't work at all.
				if (targetElement === document.activeElement && this.isTextField(targetElement)) {
					return true;
				}

				if (!deviceIsIOS4) {

					// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
					// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
					// with the same identifier as the touch event that previously triggered the click that triggered the alert.
					// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
					// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
					// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
					// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
					// random integers, it's safe to to continue if the identifier is 0 here.
					if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
						event.preventDefault();
						return false;
					}

					this.lastTouchIdentifier = touch.identifier;

					// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
					// 1) the user does a fling scroll on the scrollable layer
					// 2) the user stops the fling scroll with another tap
					// then the event.target of the last 'touchend' event will be the element that was under the user's finger
					// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
					// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
					this.updateScrollParent(targetElement);
				}
			}

			this.trackingClick = true;
			this.trackingClickStart = event.timeStamp;
			this.targetElement = targetElement;

			this.touchStartX = touch.pageX;
			this.touchStartY = touch.pageY;

			// Prevent phantom clicks on fast double-tap (issue #36)
			if (event.timeStamp - this.lastClickTime < this.tapDelay && event.timeStamp - this.lastClickTime > -1) {
				event.preventDefault();
			}

			return true;
		};

		/**
   * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
   *
   * @param {Event} event
   * @returns {boolean}
   */
		FastClick.prototype.touchHasMoved = function (event) {
			var touch = event.changedTouches[0],
			    boundary = this.touchBoundary;

			if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
				return true;
			}

			return false;
		};

		/**
   * Update the last position.
   *
   * @param {Event} event
   * @returns {boolean}
   */
		FastClick.prototype.onTouchMove = function (event) {
			if (!this.trackingClick) {
				return true;
			}

			// If the touch has moved, cancel the click tracking
			if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
				this.trackingClick = false;
				this.targetElement = null;
			}

			return true;
		};

		/**
   * Attempt to find the labelled control for the given label element.
   *
   * @param {EventTarget|HTMLLabelElement} labelElement
   * @returns {Element|null}
   */
		FastClick.prototype.findControl = function (labelElement) {

			// Fast path for newer browsers supporting the HTML5 control attribute
			if (labelElement.control !== undefined) {
				return labelElement.control;
			}

			// All browsers under test that support touch events also support the HTML5 htmlFor attribute
			if (labelElement.htmlFor) {
				return document.getElementById(labelElement.htmlFor);
			}

			// If no for attribute exists, attempt to retrieve the first labellable descendant element
			// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
			return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
		};

		/**
   * On touch end, determine whether to send a click event at once.
   *
   * @param {Event} event
   * @returns {boolean}
   */
		FastClick.prototype.onTouchEnd = function (event) {
			var forElement,
			    trackingClickStart,
			    targetTagName,
			    scrollParent,
			    touch,
			    targetElement = this.targetElement;

			if (!this.trackingClick) {
				return true;
			}

			// Prevent phantom clicks on fast double-tap (issue #36)
			if (event.timeStamp - this.lastClickTime < this.tapDelay && event.timeStamp - this.lastClickTime > -1) {
				this.cancelNextClick = true;
				return true;
			}

			if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
				return true;
			}

			// Reset to prevent wrong click cancel on input (issue #156).
			this.cancelNextClick = false;

			this.lastClickTime = event.timeStamp;

			trackingClickStart = this.trackingClickStart;
			this.trackingClick = false;
			this.trackingClickStart = 0;

			// On some iOS devices, the targetElement supplied with the event is invalid if the layer
			// is performing a transition or scroll, and has to be re-detected manually. Note that
			// for this to function correctly, it must be called *after* the event target is checked!
			// See issue #57; also filed as rdar://13048589 .
			if (deviceIsIOSWithBadTarget) {
				touch = event.changedTouches[0];

				// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
				targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
				targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
			}

			targetTagName = targetElement.tagName.toLowerCase();
			if (targetTagName === 'label') {
				forElement = this.findControl(targetElement);
				if (forElement) {
					this.focus(targetElement);
					if (deviceIsAndroid) {
						return false;
					}

					targetElement = forElement;
				}
			} else if (this.needsFocus(targetElement)) {

				// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
				// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
				if (event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && targetTagName === 'input') {
					this.targetElement = null;
					return false;
				}

				this.focus(targetElement);
				this.sendClick(targetElement, event);

				// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
				// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
				if (!deviceIsIOS4 || targetTagName !== 'select') {
					this.targetElement = null;
					event.preventDefault();
				}

				return false;
			}

			if (deviceIsIOS && !deviceIsIOS4) {

				// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
				// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
				scrollParent = targetElement.fastClickScrollParent;
				if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
					return true;
				}
			}

			// Prevent the actual click from going though - unless the target node is marked as requiring
			// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
			if (!this.needsClick(targetElement)) {
				event.preventDefault();
				this.sendClick(targetElement, event);
			}

			return false;
		};

		/**
   * On touch cancel, stop tracking the click.
   *
   * @returns {void}
   */
		FastClick.prototype.onTouchCancel = function () {
			this.trackingClick = false;
			this.targetElement = null;
		};

		/**
   * Determine mouse events which should be permitted.
   *
   * @param {Event} event
   * @returns {boolean}
   */
		FastClick.prototype.onMouse = function (event) {

			// If a target element was never set (because a touch event was never fired) allow the event
			if (!this.targetElement) {
				return true;
			}

			if (event.forwardedTouchEvent) {
				return true;
			}

			// Programmatically generated events targeting a specific element should be permitted
			if (!event.cancelable) {
				return true;
			}

			// Derive and check the target element to see whether the mouse event needs to be permitted;
			// unless explicitly enabled, prevent non-touch click events from triggering actions,
			// to prevent ghost/doubleclicks.
			if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

				// Prevent any user-added listeners declared on FastClick element from being fired.
				if (event.stopImmediatePropagation) {
					event.stopImmediatePropagation();
				} else {

					// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
					event.propagationStopped = true;
				}

				// Cancel the event
				event.stopPropagation();
				event.preventDefault();

				return false;
			}

			// If the mouse event is permitted, return true for the action to go through.
			return true;
		};

		/**
   * On actual clicks, determine whether this is a touch-generated click, a click action occurring
   * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
   * an actual click which should be permitted.
   *
   * @param {Event} event
   * @returns {boolean}
   */
		FastClick.prototype.onClick = function (event) {
			var permitted;

			// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
			if (this.trackingClick) {
				this.targetElement = null;
				this.trackingClick = false;
				return true;
			}

			// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
			if (event.target.type === 'submit' && event.detail === 0) {
				return true;
			}

			permitted = this.onMouse(event);

			// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
			if (!permitted) {
				this.targetElement = null;
			}

			// If clicks are permitted, return true for the action to go through.
			return permitted;
		};

		/**
   * Remove all FastClick's event listeners.
   *
   * @returns {void}
   */
		FastClick.prototype.destroy = function () {
			var layer = this.layer;

			if (deviceIsAndroid) {
				layer.removeEventListener('mouseover', this.onMouse, true);
				layer.removeEventListener('mousedown', this.onMouse, true);
				layer.removeEventListener('mouseup', this.onMouse, true);
			}

			layer.removeEventListener('click', this.onClick, true);
			layer.removeEventListener('touchstart', this.onTouchStart, false);
			layer.removeEventListener('touchmove', this.onTouchMove, false);
			layer.removeEventListener('touchend', this.onTouchEnd, false);
			layer.removeEventListener('touchcancel', this.onTouchCancel, false);
		};

		/**
   * Check whether FastClick is needed.
   *
   * @param {Element} layer The layer to listen on
   */
		FastClick.notNeeded = function (layer) {
			var metaViewport;
			var chromeVersion;
			var blackberryVersion;
			var firefoxVersion;

			// Devices that don't support touch don't need FastClick
			if (typeof window.ontouchstart === 'undefined') {
				return true;
			}

			// Chrome version - zero for other browsers
			chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

			if (chromeVersion) {

				if (deviceIsAndroid) {
					metaViewport = document.querySelector('meta[name=viewport]');

					if (metaViewport) {
						// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
							return true;
						}
						// Chrome 32 and above with width=device-width or less don't need FastClick
						if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
							return true;
						}
					}

					// Chrome desktop doesn't need FastClick (issue #15)
				} else {
					return true;
				}
			}

			if (deviceIsBlackBerry10) {
				blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

				// BlackBerry 10.3+ does not require Fastclick library.
				// https://github.com/ftlabs/fastclick/issues/251
				if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
					metaViewport = document.querySelector('meta[name=viewport]');

					if (metaViewport) {
						// user-scalable=no eliminates click delay.
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
							return true;
						}
						// width=device-width (or less than device-width) eliminates click delay.
						if (document.documentElement.scrollWidth <= window.outerWidth) {
							return true;
						}
					}
				}
			}

			// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
			if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
				return true;
			}

			// Firefox version - zero for other browsers
			firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

			if (firefoxVersion >= 27) {
				// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

				metaViewport = document.querySelector('meta[name=viewport]');
				if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
					return true;
				}
			}

			// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
			// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
			if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
				return true;
			}

			return false;
		};

		/**
   * Factory method for creating a FastClick object
   *
   * @param {Element} layer The layer to listen on
   * @param {Object} [options={}] The options to override the defaults
   */
		FastClick.attach = function (layer, options) {
			return new FastClick(layer, options);
		};

		if (typeof undefined === 'function' && _typeof(undefined.amd) === 'object' && undefined.amd) {

			// AMD. Register as an anonymous module.
			undefined(function () {
				return FastClick;
			});
		} else if ('object' !== 'undefined' && module.exports) {
			module.exports = FastClick.attach;
			module.exports.FastClick = FastClick;
		} else {
			window.FastClick = FastClick;
		}
	})();
});

var fastclick_1 = fastclick.FastClick;

// For @onsenui/custom-elements
if (window.customElements) {
    // even if native CE1 impl exists, use polyfill
    window.customElements.forcePolyfill = true;
}

var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.5.6' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1 = _core.version;

var _isObject = function _isObject(it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function _anObject(it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function _fails(exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function _domCreate(it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function _toPrimitive(it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
  f: f
};

var _propertyDesc = function _propertyDesc(bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function _has(it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var px = Math.random();
var _uid = function _uid(key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _redefine = createCommonjsModule(function (module) {
  var SRC = _uid('src');
  var TO_STRING = 'toString';
  var $toString = Function[TO_STRING];
  var TPL = ('' + $toString).split(TO_STRING);

  _core.inspectSource = function (it) {
    return $toString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === _global) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      _hide(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      _hide(O, key, val);
    }
    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || $toString.call(this);
  });
});

var _aFunction = function _aFunction(it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function _ctx(fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

var PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) _hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global.core = _core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

var toString = {}.toString;

var _cof = function _cof(it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function _defined(it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function _toIobject(it) {
  return _iobject(_defined(it));
};

var gOPD = Object.getOwnPropertyDescriptor;

var f$1 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD(O, P);
  } catch (e) {/* empty */}
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
  f: f$1
};

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */

var check = function check(O, proto) {
  _anObject(O);
  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
  function (test, buggy, set) {
    try {
      set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
      set(test, []);
      buggy = !(test instanceof Array);
    } catch (e) {
      buggy = true;
    }
    return function setPrototypeOf(O, proto) {
      check(O, proto);
      if (buggy) O.__proto__ = proto;else set(O, proto);
      return O;
    };
  }({}, false) : undefined),
  check: check
};

// 19.1.3.19 Object.setPrototypeOf(O, proto)

_export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

var setPrototypeOf = _core.Object.setPrototypeOf;

var _library = false;

var _shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = _global[SHARED] || (_global[SHARED] = {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: _core.version,
    mode: _library ? 'pure' : 'global',
    copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
  });
});

var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var _Symbol = _global.Symbol;
  var USE_SYMBOL = typeof _Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
});

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

var _classof = function _classof(it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? _cof(O)
  // ES3 arguments fallback
  : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

// 19.1.3.6 Object.prototype.toString()

var test = {};
test[_wks('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  _redefine(Object.prototype, 'toString', function toString() {
    return '[object ' + _classof(this) + ']';
  }, true);
}

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function _toInteger(it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function _stringAt(TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _iterators = {};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function _toLength(it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function _toAbsoluteIndex(index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes


var _arrayIncludes = function _arrayIncludes(IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

var shared = _shared('keys');

var _sharedKey = function _sharedKey(key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO$1 = _sharedKey('IE_PROTO');

var _objectKeysInternal = function _objectKeysInternal(object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) {
    if (key != IE_PROTO$1) _has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (_has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)


var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) {
    _objectDp.f(O, P = keys[i++], Properties[P]);
  }return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])


var IE_PROTO = _sharedKey('IE_PROTO');
var Empty = function Empty() {/* empty */};
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE$1][_enumBugKeys[i]];
  }return _createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var def = _objectDp.f;

var TAG$1 = _wks('toStringTag');

var _setToStringTag = function _setToStringTag(it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () {
  return this;
});

var _iterCreate = function _iterCreate(Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function _toObject(it) {
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

var _iterDefine = function _iterDefine(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
var _addToUnscopables = function _addToUnscopables(key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

var _iterStep = function _iterStep(done, value) {
  return { value: value, done: !!done };
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0; // next index
  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var ITERATOR$1 = _wks('iterator');
var TO_STRING_TAG = _wks('toStringTag');
var ArrayValues = _iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR$1]) _hide(proto, ITERATOR$1, ArrayValues);
    if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
    _iterators[NAME] = ArrayValues;
    if (explicit) for (key in es6_array_iterator) {
      if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
    }
  }
}

var _redefineAll = function _redefineAll(target, src, safe) {
  for (var key in src) {
    _redefine(target, key, src[key], safe);
  }return target;
};

var _anInstance = function _anInstance(it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
    throw TypeError(name + ': incorrect invocation!');
  }return it;
};

// call something on iterator step with safe closing on error

var _iterCall = function _iterCall(iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator

var ITERATOR$2 = _wks('iterator');
var ArrayProto$1 = Array.prototype;

var _isArrayIter = function _isArrayIter(it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto$1[ITERATOR$2] === it);
};

var ITERATOR$3 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$3] || it['@@iterator'] || _iterators[_classof(it)];
};

var _forOf = createCommonjsModule(function (module) {
  var BREAK = {};
  var RETURN = {};
  var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
    var iterFn = ITERATOR ? function () {
      return iterable;
    } : core_getIteratorMethod(iterable);
    var f = _ctx(fn, that, entries ? 2 : 1);
    var index = 0;
    var length, step, iterator, result;
    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
    // fast case for arrays with default iterator
    if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
      result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
      if (result === BREAK || result === RETURN) return result;
    } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
      result = _iterCall(iterator, f, step.value, entries);
      if (result === BREAK || result === RETURN) return result;
    }
  };
  exports.BREAK = BREAK;
  exports.RETURN = RETURN;
});

var SPECIES = _wks('species');

var _setSpecies = function _setSpecies(KEY) {
  var C = _global[KEY];
  if (_descriptors && C && !C[SPECIES]) _objectDp.f(C, SPECIES, {
    configurable: true,
    get: function get() {
      return this;
    }
  });
};

var _meta = createCommonjsModule(function (module) {
  var META = _uid('meta');

  var setDesc = _objectDp.f;
  var id = 0;
  var isExtensible = Object.isExtensible || function () {
    return true;
  };
  var FREEZE = !_fails(function () {
    return isExtensible(Object.preventExtensions({}));
  });
  var setMeta = function setMeta(it) {
    setDesc(it, META, { value: {
        i: 'O' + ++id, // object ID
        w: {} // weak collections IDs
      } });
  };
  var fastKey = function fastKey(it, create) {
    // return primitive with prefix
    if (!_isObject(it)) return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMeta(it);
      // return object ID
    }return it[META].i;
  };
  var getWeak = function getWeak(it, create) {
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMeta(it);
      // return hash weak collections IDs
    }return it[META].w;
  };
  // add metadata on freeze-family methods calling
  var onFreeze = function onFreeze(it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
    return it;
  };
  var meta = module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  };
});

var _meta_1 = _meta.KEY;
var _meta_2 = _meta.NEED;
var _meta_3 = _meta.fastKey;
var _meta_4 = _meta.getWeak;
var _meta_5 = _meta.onFreeze;

var _validateCollection = function _validateCollection(it, TYPE) {
  if (!_isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

var dP$1 = _objectDp.f;

var fastKey = _meta.fastKey;

var SIZE = _descriptors ? '_s' : 'size';

var getEntry = function getEntry(that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

var _collectionStrong = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      _anInstance(that, C, NAME, '_i');
      that._t = NAME; // collection type
      that._i = _objectCreate(null); // index
      that._f = undefined; // first entry
      that._l = undefined; // last entry
      that[SIZE] = 0; // size
      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function _delete(key) {
        var that = _validateCollection(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        }return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        _validateCollection(this, NAME);
        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) {
            entry = entry.p;
          }
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(_validateCollection(this, NAME), key);
      }
    });
    if (_descriptors) dP$1(C.prototype, 'size', {
      get: function get() {
        return _validateCollection(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
      // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key, // <- key
        v: value, // <- value
        p: prev = that._l, // <- previous entry
        n: undefined, // <- next entry
        r: false // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    }return that;
  },
  getEntry: getEntry,
  setStrong: function setStrong(C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    _iterDefine(C, NAME, function (iterated, kind) {
      this._t = _validateCollection(iterated, NAME); // target
      this._k = kind; // kind
      this._l = undefined; // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) {
        entry = entry.p;
      } // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return _iterStep(1);
      }
      // return step by kind
      if (kind == 'keys') return _iterStep(0, entry.k);
      if (kind == 'values') return _iterStep(0, entry.v);
      return _iterStep(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    _setSpecies(NAME);
  }
};

var ITERATOR$4 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$4]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  // eslint-disable-next-line no-throw-literal
  
} catch (e) {/* empty */}

var _iterDetect = function _iterDetect(exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$4]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR$4] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

var setPrototypeOf$2 = _setProto.set;
var _inheritIfRequired = function _inheritIfRequired(that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf$2) {
    setPrototypeOf$2(that, P);
  }return that;
};

var _collection = function _collection(NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = _global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function fixMethod(KEY) {
    var fn = proto[KEY];
    _redefine(proto, KEY, KEY == 'delete' ? function (a) {
      return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'has' ? function has(a) {
      return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'get' ? function get(a) {
      return IS_WEAK && !_isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'add' ? function add(a) {
      fn.call(this, a === 0 ? 0 : a);return this;
    } : function set(a, b) {
      fn.call(this, a === 0 ? 0 : a, b);return this;
    });
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    _redefineAll(C.prototype, methods);
    _meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = _fails(function () {
      instance.has(1);
    });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = _iterDetect(function (iter) {
      new C(iter);
    }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && _fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) {
        $instance[ADDER](index, index);
      }return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        _anInstance(target, C, NAME);
        var that = _inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  _setToStringTag(C, NAME);

  O[NAME] = C;
  _export(_export.G + _export.W + _export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

var SET = 'Set';

// 23.2 Set Objects
var es6_set = _collection(SET, function (get) {
  return function Set() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return _collectionStrong.def(_validateCollection(this, SET), value = value === 0 ? 0 : value, value);
  }
}, _collectionStrong);

var _arrayFromIterable = function _arrayFromIterable(iter, ITERATOR) {
  var result = [];
  _forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

// https://github.com/DavidBruant/Map-Set.prototype.toJSON


var _collectionToJson = function _collectionToJson(NAME) {
  return function toJSON() {
    if (_classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return _arrayFromIterable(this);
  };
};

// https://github.com/DavidBruant/Map-Set.prototype.toJSON


_export(_export.P + _export.R, 'Set', { toJSON: _collectionToJson('Set') });

// https://tc39.github.io/proposal-setmap-offrom/


var _setCollectionOf = function _setCollectionOf(COLLECTION) {
  _export(_export.S, COLLECTION, { of: function of() {
      var length = arguments.length;
      var A = new Array(length);
      while (length--) {
        A[length] = arguments[length];
      }return new this(A);
    } });
};

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
_setCollectionOf('Set');

// https://tc39.github.io/proposal-setmap-offrom/


var _setCollectionFrom = function _setCollectionFrom(COLLECTION) {
  _export(_export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
      var mapFn = arguments[1];
      var mapping, A, n, cb;
      _aFunction(this);
      mapping = mapFn !== undefined;
      if (mapping) _aFunction(mapFn);
      if (source == undefined) return new this();
      A = [];
      if (mapping) {
        n = 0;
        cb = _ctx(mapFn, arguments[2], 2);
        _forOf(source, false, function (nextItem) {
          A.push(cb(nextItem, n++));
        });
      } else {
        _forOf(source, false, A.push, A);
      }
      return new this(A);
    } });
};

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
_setCollectionFrom('Set');

var set$1 = _core.Set;

var MAP = 'Map';

// 23.1 Map Objects
var es6_map = _collection(MAP, function (get) {
  return function Map() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = _collectionStrong.getEntry(_validateCollection(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return _collectionStrong.def(_validateCollection(this, MAP), key === 0 ? 0 : key, value);
  }
}, _collectionStrong, true);

// https://github.com/DavidBruant/Map-Set.prototype.toJSON


_export(_export.P + _export.R, 'Map', { toJSON: _collectionToJson('Map') });

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
_setCollectionOf('Map');

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
_setCollectionFrom('Map');

var map = _core.Map;

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

var SPECIES$1 = _wks('species');

var _arraySpeciesConstructor = function _arraySpeciesConstructor(original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
    if (_isObject(C)) {
      C = C[SPECIES$1];
      if (C === null) C = undefined;
    }
  }return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


var _arraySpeciesCreate = function _arraySpeciesCreate(original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex


var _arrayMethods = function _arrayMethods(TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject($this);
    var self = _iobject(O);
    var f = _ctx(callbackfn, that, 3);
    var length = _toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (; length > index; index++) {
      if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res; // map
          else if (res) switch (TYPE) {
              case 3:
                return true; // some
              case 5:
                return val; // find
              case 6:
                return index; // findIndex
              case 2:
                result.push(val); // filter
            } else if (IS_EVERY) return false; // every
        }
      }
    }return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

var f$3 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$3
};

// 19.1.2.1 Object.assign(target, source, ...)


var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    }
  }return T;
} : $assign;

var getWeak = _meta.getWeak;

var arrayFind = _arrayMethods(5);
var arrayFindIndex = _arrayMethods(6);
var id$1 = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function uncaughtFrozenStore(that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function UncaughtFrozenStore() {
  this.a = [];
};
var findUncaughtFrozen = function findUncaughtFrozen(store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function get(key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function has(key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function set(key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;else this.a.push([key, value]);
  },
  'delete': function _delete(key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

var _collectionWeak = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      _anInstance(that, C, NAME, '_i');
      that._t = NAME; // collection type
      that._i = id$1++; // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function _delete(key) {
        if (!_isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(_validateCollection(this, NAME))['delete'](key);
        return data && _has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!_isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(_validateCollection(this, NAME)).has(key);
        return data && _has(data, this._i);
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var data = getWeak(_anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

var es6_weakMap = createCommonjsModule(function (module) {
  var each = _arrayMethods(0);

  var WEAK_MAP = 'WeakMap';
  var getWeak = _meta.getWeak;
  var isExtensible = Object.isExtensible;
  var uncaughtFrozenStore = _collectionWeak.ufstore;
  var tmp = {};
  var InternalMap;

  var wrapper = function wrapper(get) {
    return function WeakMap() {
      return get(this, arguments.length > 0 ? arguments[0] : undefined);
    };
  };

  var methods = {
    // 23.3.3.3 WeakMap.prototype.get(key)
    get: function get(key) {
      if (_isObject(key)) {
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(_validateCollection(this, WEAK_MAP)).get(key);
        return data ? data[this._i] : undefined;
      }
    },
    // 23.3.3.5 WeakMap.prototype.set(key, value)
    set: function set(key, value) {
      return _collectionWeak.def(_validateCollection(this, WEAK_MAP), key, value);
    }
  };

  // 23.3 WeakMap Objects
  var $WeakMap = module.exports = _collection(WEAK_MAP, wrapper, methods, _collectionWeak, true, true);

  // IE11 WeakMap frozen keys fix
  if (_fails(function () {
    return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7;
  })) {
    InternalMap = _collectionWeak.getConstructor(wrapper, WEAK_MAP);
    _objectAssign(InternalMap.prototype, methods);
    _meta.NEED = true;
    each(['delete', 'has', 'get', 'set'], function (key) {
      var proto = $WeakMap.prototype;
      var method = proto[key];
      _redefine(proto, key, function (a, b) {
        // store frozen objects on internal weakmap shim
        if (_isObject(a) && !isExtensible(a)) {
          if (!this._f) this._f = new InternalMap();
          var result = this._f[key](a, b);
          return key == 'set' ? this : result;
          // store all the rest on native weakmap
        }return method.call(this, a, b);
      });
    });
  }
});

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
_setCollectionOf('WeakMap');

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
_setCollectionFrom('WeakMap');

var weakMap = _core.WeakMap;

var _createProperty = function _createProperty(object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));else object[index] = value;
};

_export(_export.S + _export.F * !_iterDetect(function (iter) {
  
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = _toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = core_getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for (result = new C(length); length > index; index++) {
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var from$1 = _core.Array.from;

var reservedTagList = new Set(['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph']);

/**
 * @param {string} localName
 * @returns {boolean}
 */
function isValidCustomElementName(localName) {
  var reserved = reservedTagList.has(localName);
  var validForm = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(localName);
  return !reserved && validForm;
}

/**
 * @private
 * @param {!Node} node
 * @return {boolean}
 */
function isConnected(node) {
  // Use `Node#isConnected`, if defined.
  var nativeValue = node.isConnected;
  if (nativeValue !== undefined) {
    return nativeValue;
  }

  /** @type {?Node|undefined} */
  var current = node;
  while (current && !(current.__CE_isImportDocument || current instanceof Document)) {
    current = current.parentNode || (window.ShadowRoot && current instanceof ShadowRoot ? current.host : undefined);
  }
  return !!(current && (current.__CE_isImportDocument || current instanceof Document));
}

/**
 * @param {!Node} root
 * @param {!Node} start
 * @return {?Node}
 */
function nextSiblingOrAncestorSibling(root, start) {
  var node = start;
  while (node && node !== root && !node.nextSibling) {
    node = node.parentNode;
  }
  return !node || node === root ? null : node.nextSibling;
}

/**
 * @param {!Node} root
 * @param {!Node} start
 * @return {?Node}
 */
function nextNode(root, start) {
  return start.firstChild ? start.firstChild : nextSiblingOrAncestorSibling(root, start);
}

/**
 * @param {!Node} root
 * @param {!function(!Element)} callback
 * @param {!Set<Node>=} visitedImports
 */
function walkDeepDescendantElements(root, callback) {
  var visitedImports = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();

  var node = root;
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      var element = /** @type {!Element} */node;

      callback(element);

      var localName = element.localName;
      if (localName === 'link' && element.getAttribute('rel') === 'import') {
        // If this import (polyfilled or not) has it's root node available,
        // walk it.
        var importNode = /** @type {!Node} */element.import;
        if (importNode instanceof Node && !visitedImports.has(importNode)) {
          // Prevent multiple walks of the same import root.
          visitedImports.add(importNode);

          for (var child = importNode.firstChild; child; child = child.nextSibling) {
            walkDeepDescendantElements(child, callback, visitedImports);
          }
        }

        // Ignore descendants of import links to prevent attempting to walk the
        // elements created by the HTML Imports polyfill that we just walked
        // above.
        node = nextSiblingOrAncestorSibling(root, element);
        continue;
      } else if (localName === 'template') {
        // Ignore descendants of templates. There shouldn't be any descendants
        // because they will be moved into `.content` during construction in
        // browsers that support template but, in case they exist and are still
        // waiting to be moved by a polyfill, they will be ignored.
        node = nextSiblingOrAncestorSibling(root, element);
        continue;
      }

      // Walk shadow roots.
      var shadowRoot = element.__CE_shadowRoot;
      if (shadowRoot) {
        for (var _child = shadowRoot.firstChild; _child; _child = _child.nextSibling) {
          walkDeepDescendantElements(_child, callback, visitedImports);
        }
      }
    }

    node = nextNode(root, node);
  }
}

/**
 * Used to suppress Closure's "Modifying the prototype is only allowed if the
 * constructor is in the same scope" warning without using
 * `@suppress {newCheckTypes, duplicate}` because `newCheckTypes` is too broad.
 *
 * @param {!Object} destination
 * @param {string} name
 * @param {*} value
 */
function setPropertyUnchecked(destination, name, value) {
  destination[name] = value;
}

/**
 * @enum {number}
 */
var CustomElementState = {
  custom: 1,
  failed: 2
};

var CustomElementInternals = function () {
  function CustomElementInternals() {
    classCallCheck(this, CustomElementInternals);

    /** @type {!Map<string, !CustomElementDefinition>} */
    this._localNameToDefinition = new Map();

    /** @type {!Map<!Function, !CustomElementDefinition>} */
    this._constructorToDefinition = new Map();

    /** @type {!Array<!function(!Node)>} */
    this._patches = [];

    /** @type {boolean} */
    this._hasPatches = false;
  }

  /**
   * @param {string} localName
   * @param {!CustomElementDefinition} definition
   */


  createClass(CustomElementInternals, [{
    key: 'setDefinition',
    value: function setDefinition(localName, definition) {
      this._localNameToDefinition.set(localName, definition);
      this._constructorToDefinition.set(definition.constructor, definition);
    }

    /**
     * @param {string} localName
     * @return {!CustomElementDefinition|undefined}
     */

  }, {
    key: 'localNameToDefinition',
    value: function localNameToDefinition(localName) {
      return this._localNameToDefinition.get(localName);
    }

    /**
     * @param {!Function} constructor
     * @return {!CustomElementDefinition|undefined}
     */

  }, {
    key: 'constructorToDefinition',
    value: function constructorToDefinition(constructor) {
      return this._constructorToDefinition.get(constructor);
    }

    /**
     * @param {!function(!Node)} listener
     */

  }, {
    key: 'addPatch',
    value: function addPatch(listener) {
      this._hasPatches = true;
      this._patches.push(listener);
    }

    /**
     * @param {!Node} node
     */

  }, {
    key: 'patchTree',
    value: function patchTree(node) {
      var _this = this;

      if (!this._hasPatches) return;

      walkDeepDescendantElements(node, function (element) {
        return _this.patch(element);
      });
    }

    /**
     * @param {!Node} node
     */

  }, {
    key: 'patch',
    value: function patch(node) {
      if (!this._hasPatches) return;

      if (node.__CE_patched) return;
      node.__CE_patched = true;

      for (var i = 0; i < this._patches.length; i++) {
        this._patches[i](node);
      }
    }

    /**
     * @param {!Node} root
     */

  }, {
    key: 'connectTree',
    value: function connectTree(root) {
      var elements = [];

      walkDeepDescendantElements(root, function (element) {
        return elements.push(element);
      });

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.__CE_state === CustomElementState.custom) {
          if (isConnected(element)) {
            this.connectedCallback(element);
          }
        } else {
          this.upgradeElement(element);
        }
      }
    }

    /**
     * @param {!Node} root
     */

  }, {
    key: 'disconnectTree',
    value: function disconnectTree(root) {
      var elements = [];

      walkDeepDescendantElements(root, function (element) {
        return elements.push(element);
      });

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.__CE_state === CustomElementState.custom) {
          this.disconnectedCallback(element);
        }
      }
    }

    /**
     * Upgrades all uncustomized custom elements at and below a root node for
     * which there is a definition. When custom element reaction callbacks are
     * assumed to be called synchronously (which, by the current DOM / HTML spec
     * definitions, they are *not*), callbacks for both elements customized
     * synchronously by the parser and elements being upgraded occur in the same
     * relative order.
     *
     * NOTE: This function, when used to simulate the construction of a tree that
     * is already created but not customized (i.e. by the parser), does *not*
     * prevent the element from reading the 'final' (true) state of the tree. For
     * example, the element, during truly synchronous parsing / construction would
     * see that it contains no children as they have not yet been inserted.
     * However, this function does not modify the tree, the element will
     * (incorrectly) have children. Additionally, self-modification restrictions
     * for custom element constructors imposed by the DOM spec are *not* enforced.
     *
     *
     * The following nested list shows the steps extending down from the HTML
     * spec's parsing section that cause elements to be synchronously created and
     * upgraded:
     *
     * The "in body" insertion mode:
     * https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
     * - Switch on token:
     *   .. other cases ..
     *   -> Any other start tag
     *      - [Insert an HTML element](below) for the token.
     *
     * Insert an HTML element:
     * https://html.spec.whatwg.org/multipage/syntax.html#insert-an-html-element
     * - Insert a foreign element for the token in the HTML namespace:
     *   https://html.spec.whatwg.org/multipage/syntax.html#insert-a-foreign-element
     *   - Create an element for a token:
     *     https://html.spec.whatwg.org/multipage/syntax.html#create-an-element-for-the-token
     *     - Will execute script flag is true?
     *       - (Element queue pushed to the custom element reactions stack.)
     *     - Create an element:
     *       https://dom.spec.whatwg.org/#concept-create-element
     *       - Sync CE flag is true?
     *         - Constructor called.
     *         - Self-modification restrictions enforced.
     *       - Sync CE flag is false?
     *         - (Upgrade reaction enqueued.)
     *     - Attributes appended to element.
     *       (`attributeChangedCallback` reactions enqueued.)
     *     - Will execute script flag is true?
     *       - (Element queue popped from the custom element reactions stack.
     *         Reactions in the popped stack are invoked.)
     *   - (Element queue pushed to the custom element reactions stack.)
     *   - Insert the element:
     *     https://dom.spec.whatwg.org/#concept-node-insert
     *     - Shadow-including descendants are connected. During parsing
     *       construction, there are no shadow-*excluding* descendants.
     *       However, the constructor may have validly attached a shadow
     *       tree to itself and added descendants to that shadow tree.
     *       (`connectedCallback` reactions enqueued.)
     *   - (Element queue popped from the custom element reactions stack.
     *     Reactions in the popped stack are invoked.)
     *
     * @param {!Node} root
     * @param {!Set<Node>=} visitedImports
     */

  }, {
    key: 'patchAndUpgradeTree',
    value: function patchAndUpgradeTree(root) {
      var _this2 = this;

      var visitedImports = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();

      var elements = [];

      var gatherElements = function gatherElements(element) {
        if (element.localName === 'link' && element.getAttribute('rel') === 'import') {
          // The HTML Imports polyfill sets a descendant element of the link to
          // the `import` property, specifically this is *not* a Document.
          var importNode = /** @type {?Node} */element.import;

          if (importNode instanceof Node && importNode.readyState === 'complete') {
            importNode.__CE_isImportDocument = true;

            // Connected links are associated with the registry.
            importNode.__CE_hasRegistry = true;
          } else {
            // If this link's import root is not available, its contents can't be
            // walked. Wait for 'load' and walk it when it's ready.
            element.addEventListener('load', function () {
              var importNode = /** @type {!Node} */element.import;

              if (importNode.__CE_documentLoadHandled) return;
              importNode.__CE_documentLoadHandled = true;

              importNode.__CE_isImportDocument = true;

              // Connected links are associated with the registry.
              importNode.__CE_hasRegistry = true;

              // Clone the `visitedImports` set that was populated sync during
              // the `patchAndUpgradeTree` call that caused this 'load' handler to
              // be added. Then, remove *this* link's import node so that we can
              // walk that import again, even if it was partially walked later
              // during the same `patchAndUpgradeTree` call.
              visitedImports.delete(importNode);

              _this2.patchAndUpgradeTree(importNode, visitedImports);
            });
          }
        } else {
          elements.push(element);
        }
      };

      // `walkDeepDescendantElements` populates (and internally checks against)
      // `visitedImports` when traversing a loaded import.
      walkDeepDescendantElements(root, gatherElements, visitedImports);

      if (this._hasPatches) {
        for (var i = 0; i < elements.length; i++) {
          this.patch(elements[i]);
        }
      }

      for (var _i = 0; _i < elements.length; _i++) {
        this.upgradeElement(elements[_i]);
      }
    }

    /**
     * @param {!Element} element
     */

  }, {
    key: 'upgradeElement',
    value: function upgradeElement(element) {
      var currentState = element.__CE_state;
      if (currentState !== undefined) return;

      var definition = this.localNameToDefinition(element.localName);
      if (!definition) return;

      definition.constructionStack.push(element);

      var constructor = definition.constructor;
      try {
        try {
          var result = new constructor();
          if (result !== element) {
            throw new Error('The custom element constructor did not produce the element being upgraded.');
          }
        } finally {
          definition.constructionStack.pop();
        }
      } catch (e) {
        element.__CE_state = CustomElementState.failed;
        throw e;
      }

      element.__CE_state = CustomElementState.custom;
      element.__CE_definition = definition;

      if (definition.attributeChangedCallback) {
        var observedAttributes = definition.observedAttributes;
        for (var i = 0; i < observedAttributes.length; i++) {
          var name = observedAttributes[i];
          var value = element.getAttribute(name);
          if (value !== null) {
            this.attributeChangedCallback(element, name, null, value, null);
          }
        }
      }

      if (isConnected(element)) {
        this.connectedCallback(element);
      }
    }

    /**
     * @param {!Element} element
     */

  }, {
    key: 'connectedCallback',
    value: function connectedCallback(element) {
      var definition = element.__CE_definition;
      if (definition.connectedCallback) {
        definition.connectedCallback.call(element);
      }

      element.__CE_isConnectedCallbackCalled = true;
    }

    /**
     * @param {!Element} element
     */

  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback(element) {
      if (!element.__CE_isConnectedCallbackCalled) {
        this.connectedCallback(element);
      }

      var definition = element.__CE_definition;
      if (definition.disconnectedCallback) {
        definition.disconnectedCallback.call(element);
      }

      element.__CE_isConnectedCallbackCalled = undefined;
    }

    /**
     * @param {!Element} element
     * @param {string} name
     * @param {?string} oldValue
     * @param {?string} newValue
     * @param {?string} namespace
     */

  }, {
    key: 'attributeChangedCallback',
    value: function attributeChangedCallback(element, name, oldValue, newValue, namespace) {
      var definition = element.__CE_definition;
      if (definition.attributeChangedCallback && definition.observedAttributes.indexOf(name) > -1) {
        definition.attributeChangedCallback.call(element, name, oldValue, newValue, namespace);
      }
    }
  }]);
  return CustomElementInternals;
}();

var DocumentConstructionObserver = function () {
  function DocumentConstructionObserver(internals, doc) {
    classCallCheck(this, DocumentConstructionObserver);

    /**
     * @type {!CustomElementInternals}
     */
    this._internals = internals;

    /**
     * @type {!Document}
     */
    this._document = doc;

    /**
     * @type {MutationObserver|undefined}
     */
    this._observer = undefined;

    // Simulate tree construction for all currently accessible nodes in the
    // document.
    this._internals.patchAndUpgradeTree(this._document);

    if (this._document.readyState === 'loading') {
      this._observer = new MutationObserver(this._handleMutations.bind(this));

      // Nodes created by the parser are given to the observer *before* the next
      // task runs. Inline scripts are run in a new task. This means that the
      // observer will be able to handle the newly parsed nodes before the inline
      // script is run.
      this._observer.observe(this._document, {
        childList: true,
        subtree: true
      });
    }
  }

  createClass(DocumentConstructionObserver, [{
    key: 'disconnect',
    value: function disconnect() {
      if (this._observer) {
        this._observer.disconnect();
      }
    }

    /**
     * @param {!Array<!MutationRecord>} mutations
     */

  }, {
    key: '_handleMutations',
    value: function _handleMutations(mutations) {
      // Once the document's `readyState` is 'interactive' or 'complete', all new
      // nodes created within that document will be the result of script and
      // should be handled by patching.
      var readyState = this._document.readyState;
      if (readyState === 'interactive' || readyState === 'complete') {
        this.disconnect();
      }

      for (var i = 0; i < mutations.length; i++) {
        var addedNodes = mutations[i].addedNodes;
        for (var j = 0; j < addedNodes.length; j++) {
          var node = addedNodes[j];
          this._internals.patchAndUpgradeTree(node);
        }
      }
    }
  }]);
  return DocumentConstructionObserver;
}();

/**
 * @template T
 */
var Deferred = function () {
  function Deferred() {
    var _this = this;

    classCallCheck(this, Deferred);

    /**
     * @private
     * @type {T|undefined}
     */
    this._value = undefined;

    /**
     * @private
     * @type {Function|undefined}
     */
    this._resolve = undefined;

    /**
     * @private
     * @type {!Promise<T>}
     */
    this._promise = new Promise(function (resolve) {
      _this._resolve = resolve;

      if (_this._value) {
        resolve(_this._value);
      }
    });
  }

  /**
   * @param {T} value
   */


  createClass(Deferred, [{
    key: 'resolve',
    value: function resolve(value) {
      if (this._value) {
        throw new Error('Already resolved.');
      }

      this._value = value;

      if (this._resolve) {
        this._resolve(value);
      }
    }

    /**
     * @return {!Promise<T>}
     */

  }, {
    key: 'toPromise',
    value: function toPromise() {
      return this._promise;
    }
  }]);
  return Deferred;
}();

/**
 * @unrestricted
 */

var CustomElementRegistry = function () {

  /**
   * @param {!CustomElementInternals} internals
   */
  function CustomElementRegistry(internals) {
    classCallCheck(this, CustomElementRegistry);

    /**
     * @private
     * @type {boolean}
     */
    this._elementDefinitionIsRunning = false;

    /**
     * @private
     * @type {!CustomElementInternals}
     */
    this._internals = internals;

    /**
     * @private
     * @type {!Map<string, !Deferred<undefined>>}
     */
    this._whenDefinedDeferred = new Map();

    /**
     * The default flush callback triggers the document walk synchronously.
     * @private
     * @type {!Function}
     */
    this._flushCallback = function (fn) {
      return fn();
    };

    /**
     * @private
     * @type {boolean}
     */
    this._flushPending = false;

    /**
     * @private
     * @type {!Array<string>}
     */
    this._unflushedLocalNames = [];

    /**
     * @private
     * @type {!DocumentConstructionObserver}
     */
    this._documentConstructionObserver = new DocumentConstructionObserver(internals, document);
  }

  /**
   * @param {string} localName
   * @param {!Function} constructor
   */


  createClass(CustomElementRegistry, [{
    key: 'define',
    value: function define(localName, constructor) {
      var _this = this;

      if (!(constructor instanceof Function)) {
        throw new TypeError('Custom element constructors must be functions.');
      }

      if (!isValidCustomElementName(localName)) {
        throw new SyntaxError('The element name \'' + localName + '\' is not valid.');
      }

      if (this._internals.localNameToDefinition(localName)) {
        throw new Error('A custom element with name \'' + localName + '\' has already been defined.');
      }

      if (this._elementDefinitionIsRunning) {
        throw new Error('A custom element is already being defined.');
      }
      this._elementDefinitionIsRunning = true;

      var connectedCallback = void 0;
      var disconnectedCallback = void 0;
      var adoptedCallback = void 0;
      var attributeChangedCallback = void 0;
      var observedAttributes = void 0;
      try {
        var getCallback = function getCallback(name) {
          var callbackValue = prototype[name];
          if (callbackValue !== undefined && !(callbackValue instanceof Function)) {
            throw new Error('The \'' + name + '\' callback must be a function.');
          }
          return callbackValue;
        };

        /** @type {!Object} */
        var prototype = constructor.prototype;
        if (!(prototype instanceof Object)) {
          throw new TypeError('The custom element constructor\'s prototype is not an object.');
        }

        connectedCallback = getCallback('connectedCallback');
        disconnectedCallback = getCallback('disconnectedCallback');
        adoptedCallback = getCallback('adoptedCallback');
        attributeChangedCallback = getCallback('attributeChangedCallback');
        observedAttributes = constructor['observedAttributes'] || [];
      } catch (e) {
        return;
      } finally {
        this._elementDefinitionIsRunning = false;
      }

      var definition = {
        localName: localName,
        constructor: constructor,
        connectedCallback: connectedCallback,
        disconnectedCallback: disconnectedCallback,
        adoptedCallback: adoptedCallback,
        attributeChangedCallback: attributeChangedCallback,
        observedAttributes: observedAttributes,
        constructionStack: []
      };

      this._internals.setDefinition(localName, definition);

      this._unflushedLocalNames.push(localName);

      // If we've already called the flush callback and it hasn't called back yet,
      // don't call it again.
      if (!this._flushPending) {
        this._flushPending = true;
        this._flushCallback(function () {
          return _this._flush();
        });
      }
    }
  }, {
    key: '_flush',
    value: function _flush() {
      // If no new definitions were defined, don't attempt to flush. This could
      // happen if a flush callback keeps the function it is given and calls it
      // multiple times.
      if (this._flushPending === false) return;

      this._flushPending = false;
      this._internals.patchAndUpgradeTree(document);

      while (this._unflushedLocalNames.length > 0) {
        var localName = this._unflushedLocalNames.shift();
        var deferred = this._whenDefinedDeferred.get(localName);
        if (deferred) {
          deferred.resolve(undefined);
        }
      }
    }

    /**
     * @param {string} localName
     * @return {Function|undefined}
     */

  }, {
    key: 'get',
    value: function get$$1(localName) {
      var definition = this._internals.localNameToDefinition(localName);
      if (definition) {
        return definition.constructor;
      }

      return undefined;
    }

    /**
     * @param {string} localName
     * @return {!Promise<undefined>}
     */

  }, {
    key: 'whenDefined',
    value: function whenDefined(localName) {
      if (!isValidCustomElementName(localName)) {
        return Promise.reject(new SyntaxError('\'' + localName + '\' is not a valid custom element name.'));
      }

      var prior = this._whenDefinedDeferred.get(localName);
      if (prior) {
        return prior.toPromise();
      }

      var deferred = new Deferred();
      this._whenDefinedDeferred.set(localName, deferred);

      var definition = this._internals.localNameToDefinition(localName);
      // Resolve immediately only if the given local name has a definition *and*
      // the full document walk to upgrade elements with that local name has
      // already happened.
      if (definition && this._unflushedLocalNames.indexOf(localName) === -1) {
        deferred.resolve(undefined);
      }

      return deferred.toPromise();
    }
  }, {
    key: 'polyfillWrapFlushCallback',
    value: function polyfillWrapFlushCallback(outer) {
      this._documentConstructionObserver.disconnect();
      var inner = this._flushCallback;
      this._flushCallback = function (flush) {
        return outer(function () {
          return inner(flush);
        });
      };
    }
  }]);
  return CustomElementRegistry;
}();

window['CustomElementRegistry'] = CustomElementRegistry;
CustomElementRegistry.prototype['define'] = CustomElementRegistry.prototype.define;
CustomElementRegistry.prototype['get'] = CustomElementRegistry.prototype.get;
CustomElementRegistry.prototype['whenDefined'] = CustomElementRegistry.prototype.whenDefined;
CustomElementRegistry.prototype['polyfillWrapFlushCallback'] = CustomElementRegistry.prototype.polyfillWrapFlushCallback;

var Native = {
  Document_createElement: window.Document.prototype.createElement,
  Document_createElementNS: window.Document.prototype.createElementNS,
  Document_importNode: window.Document.prototype.importNode,
  Document_prepend: window.Document.prototype['prepend'],
  Document_append: window.Document.prototype['append'],
  Node_cloneNode: window.Node.prototype.cloneNode,
  Node_appendChild: window.Node.prototype.appendChild,
  Node_insertBefore: window.Node.prototype.insertBefore,
  Node_removeChild: window.Node.prototype.removeChild,
  Node_replaceChild: window.Node.prototype.replaceChild,
  Node_textContent: Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent'),
  Element_attachShadow: window.Element.prototype['attachShadow'],
  Element_innerHTML: Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML'),
  Element_getAttribute: window.Element.prototype.getAttribute,
  Element_setAttribute: window.Element.prototype.setAttribute,
  Element_removeAttribute: window.Element.prototype.removeAttribute,
  Element_getAttributeNS: window.Element.prototype.getAttributeNS,
  Element_setAttributeNS: window.Element.prototype.setAttributeNS,
  Element_removeAttributeNS: window.Element.prototype.removeAttributeNS,
  Element_insertAdjacentElement: window.Element.prototype['insertAdjacentElement'],
  Element_prepend: window.Element.prototype['prepend'],
  Element_append: window.Element.prototype['append'],
  Element_before: window.Element.prototype['before'],
  Element_after: window.Element.prototype['after'],
  Element_replaceWith: window.Element.prototype['replaceWith'],
  Element_remove: window.Element.prototype['remove'],
  HTMLElement: window.HTMLElement,
  HTMLElement_innerHTML: Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML'),
  HTMLElement_insertAdjacentElement: window.HTMLElement.prototype['insertAdjacentElement']
};

/**
 * This class exists only to work around Closure's lack of a way to describe
 * singletons. It represents the 'already constructed marker' used in custom
 * element construction stacks.
 *
 * https://html.spec.whatwg.org/#concept-already-constructed-marker
 */
var AlreadyConstructedMarker = function AlreadyConstructedMarker() {
  classCallCheck(this, AlreadyConstructedMarker);
};

var AlreadyConstructedMarker$1 = new AlreadyConstructedMarker();

/**
 * @param {!CustomElementInternals} internals
 */
var PatchHTMLElement = function (internals) {
  window['HTMLElement'] = function () {
    /**
     * @type {function(new: HTMLElement): !HTMLElement}
     */
    function HTMLElement() {
      // This should really be `new.target` but `new.target` can't be emulated
      // in ES5. Assuming the user keeps the default value of the constructor's
      // prototype's `constructor` property, this is equivalent.
      /** @type {!Function} */
      var constructor = this.constructor;

      var definition = internals.constructorToDefinition(constructor);
      if (!definition) {
        throw new Error('The custom element being constructed was not registered with `customElements`.');
      }

      var constructionStack = definition.constructionStack;

      if (constructionStack.length === 0) {
        var _element = Native.Document_createElement.call(document, definition.localName);
        Object.setPrototypeOf(_element, constructor.prototype);
        _element.__CE_state = CustomElementState.custom;
        _element.__CE_definition = definition;
        internals.patch(_element);
        return _element;
      }

      var lastIndex = constructionStack.length - 1;
      var element = constructionStack[lastIndex];
      if (element === AlreadyConstructedMarker$1) {
        throw new Error('The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.');
      }
      constructionStack[lastIndex] = AlreadyConstructedMarker$1;

      Object.setPrototypeOf(element, constructor.prototype);
      internals.patch( /** @type {!HTMLElement} */element);

      return element;
    }

    HTMLElement.prototype = Native.HTMLElement.prototype;

    return HTMLElement;
  }();
};

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ParentNodeNativeMethods} builtIn
 */
var PatchParentNode = function (internals, destination, builtIn) {
  /**
   * @param {...(!Node|string)} nodes
   */
  destination['prepend'] = function () {
    for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
      nodes[_key] = arguments[_key];
    }

    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && isConnected(node);
    });

    builtIn.prepend.apply(this, nodes);

    for (var i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (isConnected(this)) {
      for (var _i = 0; _i < nodes.length; _i++) {
        var node = nodes[_i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['append'] = function () {
    for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      nodes[_key2] = arguments[_key2];
    }

    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && isConnected(node);
    });

    builtIn.append.apply(this, nodes);

    for (var i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (isConnected(this)) {
      for (var _i2 = 0; _i2 < nodes.length; _i2++) {
        var node = nodes[_i2];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };
};

/**
 * @param {!CustomElementInternals} internals
 */
var PatchDocument = function (internals) {
  setPropertyUnchecked(Document.prototype, 'createElement',
  /**
   * @this {Document}
   * @param {string} localName
   * @return {!Element}
   */
  function (localName) {
    // Only create custom elements if this document is associated with the registry.
    if (this.__CE_hasRegistry) {
      var definition = internals.localNameToDefinition(localName);
      if (definition) {
        return new definition.constructor();
      }
    }

    var result = /** @type {!Element} */
    Native.Document_createElement.call(this, localName);
    internals.patch(result);
    return result;
  });

  setPropertyUnchecked(Document.prototype, 'importNode',
  /**
   * @this {Document}
   * @param {!Node} node
   * @param {boolean=} deep
   * @return {!Node}
   */
  function (node, deep) {
    var clone = Native.Document_importNode.call(this, node, deep);
    // Only create custom elements if this document is associated with the registry.
    if (!this.__CE_hasRegistry) {
      internals.patchTree(clone);
    } else {
      internals.patchAndUpgradeTree(clone);
    }
    return clone;
  });

  var NS_HTML = "http://www.w3.org/1999/xhtml";

  setPropertyUnchecked(Document.prototype, 'createElementNS',
  /**
   * @this {Document}
   * @param {?string} namespace
   * @param {string} localName
   * @return {!Element}
   */
  function (namespace, localName) {
    // Only create custom elements if this document is associated with the registry.
    if (this.__CE_hasRegistry && (namespace === null || namespace === NS_HTML)) {
      var definition = internals.localNameToDefinition(localName);
      if (definition) {
        return new definition.constructor();
      }
    }

    var result = /** @type {!Element} */
    Native.Document_createElementNS.call(this, namespace, localName);
    internals.patch(result);
    return result;
  });

  PatchParentNode(internals, Document.prototype, {
    prepend: Native.Document_prepend,
    append: Native.Document_append
  });
};

/**
 * @param {!CustomElementInternals} internals
 */
var PatchNode = function (internals) {
  // `Node#nodeValue` is implemented on `Attr`.
  // `Node#textContent` is implemented on `Attr`, `Element`.

  setPropertyUnchecked(Node.prototype, 'insertBefore',
  /**
   * @this {Node}
   * @param {!Node} node
   * @param {?Node} refNode
   * @return {!Node}
   */
  function (node, refNode) {
    if (node instanceof DocumentFragment) {
      var insertedNodes = Array.prototype.slice.apply(node.childNodes);
      var _nativeResult = Native.Node_insertBefore.call(this, node, refNode);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (isConnected(this)) {
        for (var i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return _nativeResult;
    }

    var nodeWasConnected = isConnected(node);
    var nativeResult = Native.Node_insertBefore.call(this, node, refNode);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    if (isConnected(this)) {
      internals.connectTree(node);
    }

    return nativeResult;
  });

  setPropertyUnchecked(Node.prototype, 'appendChild',
  /**
   * @this {Node}
   * @param {!Node} node
   * @return {!Node}
   */
  function (node) {
    if (node instanceof DocumentFragment) {
      var insertedNodes = Array.prototype.slice.apply(node.childNodes);
      var _nativeResult2 = Native.Node_appendChild.call(this, node);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (isConnected(this)) {
        for (var i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return _nativeResult2;
    }

    var nodeWasConnected = isConnected(node);
    var nativeResult = Native.Node_appendChild.call(this, node);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    if (isConnected(this)) {
      internals.connectTree(node);
    }

    return nativeResult;
  });

  setPropertyUnchecked(Node.prototype, 'cloneNode',
  /**
   * @this {Node}
   * @param {boolean=} deep
   * @return {!Node}
   */
  function (deep) {
    var clone = Native.Node_cloneNode.call(this, deep);
    // Only create custom elements if this element's owner document is
    // associated with the registry.
    if (!this.ownerDocument.__CE_hasRegistry) {
      internals.patchTree(clone);
    } else {
      internals.patchAndUpgradeTree(clone);
    }
    return clone;
  });

  setPropertyUnchecked(Node.prototype, 'removeChild',
  /**
   * @this {Node}
   * @param {!Node} node
   * @return {!Node}
   */
  function (node) {
    var nodeWasConnected = isConnected(node);
    var nativeResult = Native.Node_removeChild.call(this, node);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    return nativeResult;
  });

  setPropertyUnchecked(Node.prototype, 'replaceChild',
  /**
   * @this {Node}
   * @param {!Node} nodeToInsert
   * @param {!Node} nodeToRemove
   * @return {!Node}
   */
  function (nodeToInsert, nodeToRemove) {
    if (nodeToInsert instanceof DocumentFragment) {
      var insertedNodes = Array.prototype.slice.apply(nodeToInsert.childNodes);
      var _nativeResult3 = Native.Node_replaceChild.call(this, nodeToInsert, nodeToRemove);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (isConnected(this)) {
        internals.disconnectTree(nodeToRemove);
        for (var i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return _nativeResult3;
    }

    var nodeToInsertWasConnected = isConnected(nodeToInsert);
    var nativeResult = Native.Node_replaceChild.call(this, nodeToInsert, nodeToRemove);
    var thisIsConnected = isConnected(this);

    if (thisIsConnected) {
      internals.disconnectTree(nodeToRemove);
    }

    if (nodeToInsertWasConnected) {
      internals.disconnectTree(nodeToInsert);
    }

    if (thisIsConnected) {
      internals.connectTree(nodeToInsert);
    }

    return nativeResult;
  });

  function patch_textContent(destination, baseDescriptor) {
    Object.defineProperty(destination, 'textContent', {
      enumerable: baseDescriptor.enumerable,
      configurable: true,
      get: baseDescriptor.get,
      set: /** @this {Node} */function set(assignedValue) {
        // If this is a text node then there are no nodes to disconnect.
        if (this.nodeType === Node.TEXT_NODE) {
          baseDescriptor.set.call(this, assignedValue);
          return;
        }

        var removedNodes = undefined;
        // Checking for `firstChild` is faster than reading `childNodes.length`
        // to compare with 0.
        if (this.firstChild) {
          // Using `childNodes` is faster than `children`, even though we only
          // care about elements.
          var childNodes = this.childNodes;
          var childNodesLength = childNodes.length;
          if (childNodesLength > 0 && isConnected(this)) {
            // Copying an array by iterating is faster than using slice.
            removedNodes = new Array(childNodesLength);
            for (var i = 0; i < childNodesLength; i++) {
              removedNodes[i] = childNodes[i];
            }
          }
        }

        baseDescriptor.set.call(this, assignedValue);

        if (removedNodes) {
          for (var _i = 0; _i < removedNodes.length; _i++) {
            internals.disconnectTree(removedNodes[_i]);
          }
        }
      }
    });
  }

  if (Native.Node_textContent && Native.Node_textContent.get) {
    patch_textContent(Node.prototype, Native.Node_textContent);
  } else {
    internals.addPatch(function (element) {
      patch_textContent(element, {
        enumerable: true,
        configurable: true,
        // NOTE: This implementation of the `textContent` getter assumes that
        // text nodes' `textContent` getter will not be patched.
        get: /** @this {Node} */function get() {
          /** @type {!Array<string>} */
          var parts = [];

          for (var i = 0; i < this.childNodes.length; i++) {
            parts.push(this.childNodes[i].textContent);
          }

          return parts.join('');
        },
        set: /** @this {Node} */function set(assignedValue) {
          while (this.firstChild) {
            Native.Node_removeChild.call(this, this.firstChild);
          }
          Native.Node_appendChild.call(this, document.createTextNode(assignedValue));
        }
      });
    });
  }
};

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ChildNodeNativeMethods} builtIn
 */
var PatchChildNode = function (internals, destination, builtIn) {
  /**
   * @param {...(!Node|string)} nodes
   */
  destination['before'] = function () {
    for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
      nodes[_key] = arguments[_key];
    }

    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && isConnected(node);
    });

    builtIn.before.apply(this, nodes);

    for (var i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (isConnected(this)) {
      for (var _i = 0; _i < nodes.length; _i++) {
        var node = nodes[_i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['after'] = function () {
    for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      nodes[_key2] = arguments[_key2];
    }

    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && isConnected(node);
    });

    builtIn.after.apply(this, nodes);

    for (var i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (isConnected(this)) {
      for (var _i2 = 0; _i2 < nodes.length; _i2++) {
        var node = nodes[_i2];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['replaceWith'] = function () {
    for (var _len3 = arguments.length, nodes = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      nodes[_key3] = arguments[_key3];
    }

    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && isConnected(node);
    });

    var wasConnected = isConnected(this);

    builtIn.replaceWith.apply(this, nodes);

    for (var i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (wasConnected) {
      internals.disconnectTree(this);
      for (var _i3 = 0; _i3 < nodes.length; _i3++) {
        var node = nodes[_i3];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  destination['remove'] = function () {
    var wasConnected = isConnected(this);

    builtIn.remove.call(this);

    if (wasConnected) {
      internals.disconnectTree(this);
    }
  };
};

/**
 * @param {!CustomElementInternals} internals
 */
var PatchElement = function (internals) {
  if (Native.Element_attachShadow) {
    setPropertyUnchecked(Element.prototype, 'attachShadow',
    /**
     * @this {Element}
     * @param {!{mode: string}} init
     * @return {ShadowRoot}
     */
    function (init) {
      var shadowRoot = Native.Element_attachShadow.call(this, init);
      this.__CE_shadowRoot = shadowRoot;
      return shadowRoot;
    });
  } else {
    console.warn('Custom Elements: `Element#attachShadow` was not patched.');
  }

  function patch_innerHTML(destination, baseDescriptor) {
    Object.defineProperty(destination, 'innerHTML', {
      enumerable: baseDescriptor.enumerable,
      configurable: true,
      get: baseDescriptor.get,
      set: /** @this {Element} */function set(htmlString) {
        var _this = this;

        var isConnected$$1 = isConnected(this);

        // NOTE: In IE11, when using the native `innerHTML` setter, all nodes
        // that were previously descendants of the context element have all of
        // their children removed as part of the set - the entire subtree is
        // 'disassembled'. This work around walks the subtree *before* using the
        // native setter.
        /** @type {!Array<!Element>|undefined} */
        var removedElements = undefined;
        if (isConnected$$1) {
          removedElements = [];
          walkDeepDescendantElements(this, function (element) {
            if (element !== _this) {
              removedElements.push(element);
            }
          });
        }

        baseDescriptor.set.call(this, htmlString);

        if (removedElements) {
          for (var i = 0; i < removedElements.length; i++) {
            var element = removedElements[i];
            if (element.__CE_state === CustomElementState.custom) {
              internals.disconnectedCallback(element);
            }
          }
        }

        // Only create custom elements if this element's owner document is
        // associated with the registry.
        if (!this.ownerDocument.__CE_hasRegistry) {
          internals.patchTree(this);
        } else {
          internals.patchAndUpgradeTree(this);
        }
        return htmlString;
      }
    });
  }

  if (Native.Element_innerHTML && Native.Element_innerHTML.get) {
    patch_innerHTML(Element.prototype, Native.Element_innerHTML);
  } else if (Native.HTMLElement_innerHTML && Native.HTMLElement_innerHTML.get) {
    patch_innerHTML(HTMLElement.prototype, Native.HTMLElement_innerHTML);
  } else {

    /** @type {HTMLDivElement} */
    var rawDiv = Native.Document_createElement.call(document, 'div');

    internals.addPatch(function (element) {
      patch_innerHTML(element, {
        enumerable: true,
        configurable: true,
        // Implements getting `innerHTML` by performing an unpatched `cloneNode`
        // of the element and returning the resulting element's `innerHTML`.
        // TODO: Is this too expensive?
        get: /** @this {Element} */function get() {
          return Native.Node_cloneNode.call(this, true).innerHTML;
        },
        // Implements setting `innerHTML` by creating an unpatched element,
        // setting `innerHTML` of that element and replacing the target
        // element's children with those of the unpatched element.
        set: /** @this {Element} */function set(assignedValue) {
          // NOTE: re-route to `content` for `template` elements.
          // We need to do this because `template.appendChild` does not
          // route into `template.content`.
          /** @type {!Node} */
          var content = this.localName === 'template' ? /** @type {!HTMLTemplateElement} */this.content : this;
          rawDiv.innerHTML = assignedValue;

          while (content.childNodes.length > 0) {
            Native.Node_removeChild.call(content, content.childNodes[0]);
          }
          while (rawDiv.childNodes.length > 0) {
            Native.Node_appendChild.call(content, rawDiv.childNodes[0]);
          }
        }
      });
    });
  }

  setPropertyUnchecked(Element.prototype, 'setAttribute',
  /**
   * @this {Element}
   * @param {string} name
   * @param {string} newValue
   */
  function (name, newValue) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== CustomElementState.custom) {
      return Native.Element_setAttribute.call(this, name, newValue);
    }

    var oldValue = Native.Element_getAttribute.call(this, name);
    Native.Element_setAttribute.call(this, name, newValue);
    newValue = Native.Element_getAttribute.call(this, name);
    internals.attributeChangedCallback(this, name, oldValue, newValue, null);
  });

  setPropertyUnchecked(Element.prototype, 'setAttributeNS',
  /**
   * @this {Element}
   * @param {?string} namespace
   * @param {string} name
   * @param {string} newValue
   */
  function (namespace, name, newValue) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== CustomElementState.custom) {
      return Native.Element_setAttributeNS.call(this, namespace, name, newValue);
    }

    var oldValue = Native.Element_getAttributeNS.call(this, namespace, name);
    Native.Element_setAttributeNS.call(this, namespace, name, newValue);
    newValue = Native.Element_getAttributeNS.call(this, namespace, name);
    internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
  });

  setPropertyUnchecked(Element.prototype, 'removeAttribute',
  /**
   * @this {Element}
   * @param {string} name
   */
  function (name) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== CustomElementState.custom) {
      return Native.Element_removeAttribute.call(this, name);
    }

    var oldValue = Native.Element_getAttribute.call(this, name);
    Native.Element_removeAttribute.call(this, name);
    if (oldValue !== null) {
      internals.attributeChangedCallback(this, name, oldValue, null, null);
    }
  });

  setPropertyUnchecked(Element.prototype, 'removeAttributeNS',
  /**
   * @this {Element}
   * @param {?string} namespace
   * @param {string} name
   */
  function (namespace, name) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== CustomElementState.custom) {
      return Native.Element_removeAttributeNS.call(this, namespace, name);
    }

    var oldValue = Native.Element_getAttributeNS.call(this, namespace, name);
    Native.Element_removeAttributeNS.call(this, namespace, name);
    // In older browsers, `Element#getAttributeNS` may return the empty string
    // instead of null if the attribute does not exist. For details, see;
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS#Notes
    var newValue = Native.Element_getAttributeNS.call(this, namespace, name);
    if (oldValue !== newValue) {
      internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
    }
  });

  function patch_insertAdjacentElement(destination, baseMethod) {
    setPropertyUnchecked(destination, 'insertAdjacentElement',
    /**
     * @this {Element}
     * @param {string} where
     * @param {!Element} element
     * @return {?Element}
     */
    function (where, element) {
      var wasConnected = isConnected(element);
      var insertedElement = /** @type {!Element} */
      baseMethod.call(this, where, element);

      if (wasConnected) {
        internals.disconnectTree(element);
      }

      if (isConnected(insertedElement)) {
        internals.connectTree(element);
      }
      return insertedElement;
    });
  }

  if (Native.HTMLElement_insertAdjacentElement) {
    patch_insertAdjacentElement(HTMLElement.prototype, Native.HTMLElement_insertAdjacentElement);
  } else if (Native.Element_insertAdjacentElement) {
    patch_insertAdjacentElement(Element.prototype, Native.Element_insertAdjacentElement);
  } else {
    console.warn('Custom Elements: `Element#insertAdjacentElement` was not patched.');
  }

  PatchParentNode(internals, Element.prototype, {
    prepend: Native.Element_prepend,
    append: Native.Element_append
  });

  PatchChildNode(internals, Element.prototype, {
    before: Native.Element_before,
    after: Native.Element_after,
    replaceWith: Native.Element_replaceWith,
    remove: Native.Element_remove
  });
};

/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var priorCustomElements = window['customElements'];

if (!priorCustomElements || priorCustomElements['forcePolyfill'] || typeof priorCustomElements['define'] != 'function' || typeof priorCustomElements['get'] != 'function') {
  /** @type {!CustomElementInternals} */
  var internals = new CustomElementInternals();

  PatchHTMLElement(internals);
  PatchDocument(internals);
  PatchNode(internals);
  PatchElement(internals);

  // The main document is always associated with the registry.
  document.__CE_hasRegistry = true;

  /** @type {!CustomElementRegistry} */
  var customElements = new CustomElementRegistry(internals);

  Object.defineProperty(window, 'customElements', {
    configurable: true,
    enumerable: true,
    value: customElements
  });
}

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version 0.7.22

(function (global) {
  if (global.JsMutationObserver) {
    return;
  }
  var registrationsTable = new WeakMap();
  var setImmediate;
  if (/Trident|Edge/.test(navigator.userAgent)) {
    setImmediate = setTimeout;
  } else if (window.setImmediate) {
    setImmediate = window.setImmediate;
  } else {
    var setImmediateQueue = [];
    var sentinel = String(Math.random());
    window.addEventListener("message", function (e) {
      if (e.data === sentinel) {
        var queue = setImmediateQueue;
        setImmediateQueue = [];
        queue.forEach(function (func) {
          func();
        });
      }
    });
    setImmediate = function setImmediate(func) {
      setImmediateQueue.push(func);
      window.postMessage(sentinel, "*");
    };
  }
  var isScheduled = false;
  var scheduledObservers = [];
  function scheduleCallback(observer) {
    scheduledObservers.push(observer);
    if (!isScheduled) {
      isScheduled = true;
      setImmediate(dispatchCallbacks);
    }
  }
  function wrapIfNeeded(node) {
    return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(node) || node;
  }
  function dispatchCallbacks() {
    isScheduled = false;
    var observers = scheduledObservers;
    scheduledObservers = [];
    observers.sort(function (o1, o2) {
      return o1.uid_ - o2.uid_;
    });
    var anyNonEmpty = false;
    observers.forEach(function (observer) {
      var queue = observer.takeRecords();
      removeTransientObserversFor(observer);
      if (queue.length) {
        observer.callback_(queue, observer);
        anyNonEmpty = true;
      }
    });
    if (anyNonEmpty) dispatchCallbacks();
  }
  function removeTransientObserversFor(observer) {
    observer.nodes_.forEach(function (node) {
      var registrations = registrationsTable.get(node);
      if (!registrations) return;
      registrations.forEach(function (registration) {
        if (registration.observer === observer) registration.removeTransientObservers();
      });
    });
  }
  function forEachAncestorAndObserverEnqueueRecord(target, callback) {
    for (var node = target; node; node = node.parentNode) {
      var registrations = registrationsTable.get(node);
      if (registrations) {
        for (var j = 0; j < registrations.length; j++) {
          var registration = registrations[j];
          var options = registration.options;
          if (node !== target && !options.subtree) continue;
          var record = callback(options);
          if (record) registration.enqueue(record);
        }
      }
    }
  }
  var uidCounter = 0;
  function JsMutationObserver(callback) {
    this.callback_ = callback;
    this.nodes_ = [];
    this.records_ = [];
    this.uid_ = ++uidCounter;
  }
  JsMutationObserver.prototype = {
    observe: function observe(target, options) {
      target = wrapIfNeeded(target);
      if (!options.childList && !options.attributes && !options.characterData || options.attributeOldValue && !options.attributes || options.attributeFilter && options.attributeFilter.length && !options.attributes || options.characterDataOldValue && !options.characterData) {
        throw new SyntaxError();
      }
      var registrations = registrationsTable.get(target);
      if (!registrations) registrationsTable.set(target, registrations = []);
      var registration;
      for (var i = 0; i < registrations.length; i++) {
        if (registrations[i].observer === this) {
          registration = registrations[i];
          registration.removeListeners();
          registration.options = options;
          break;
        }
      }
      if (!registration) {
        registration = new Registration(this, target, options);
        registrations.push(registration);
        this.nodes_.push(target);
      }
      registration.addListeners();
    },
    disconnect: function disconnect() {
      this.nodes_.forEach(function (node) {
        var registrations = registrationsTable.get(node);
        for (var i = 0; i < registrations.length; i++) {
          var registration = registrations[i];
          if (registration.observer === this) {
            registration.removeListeners();
            registrations.splice(i, 1);
            break;
          }
        }
      }, this);
      this.records_ = [];
    },
    takeRecords: function takeRecords() {
      var copyOfRecords = this.records_;
      this.records_ = [];
      return copyOfRecords;
    }
  };
  function MutationRecord(type, target) {
    this.type = type;
    this.target = target;
    this.addedNodes = [];
    this.removedNodes = [];
    this.previousSibling = null;
    this.nextSibling = null;
    this.attributeName = null;
    this.attributeNamespace = null;
    this.oldValue = null;
  }
  function copyMutationRecord(original) {
    var record = new MutationRecord(original.type, original.target);
    record.addedNodes = original.addedNodes.slice();
    record.removedNodes = original.removedNodes.slice();
    record.previousSibling = original.previousSibling;
    record.nextSibling = original.nextSibling;
    record.attributeName = original.attributeName;
    record.attributeNamespace = original.attributeNamespace;
    record.oldValue = original.oldValue;
    return record;
  }
  var currentRecord, recordWithOldValue;
  function getRecord(type, target) {
    return currentRecord = new MutationRecord(type, target);
  }
  function getRecordWithOldValue(oldValue) {
    if (recordWithOldValue) return recordWithOldValue;
    recordWithOldValue = copyMutationRecord(currentRecord);
    recordWithOldValue.oldValue = oldValue;
    return recordWithOldValue;
  }
  function clearRecords() {
    currentRecord = recordWithOldValue = undefined;
  }
  function recordRepresentsCurrentMutation(record) {
    return record === recordWithOldValue || record === currentRecord;
  }
  function selectRecord(lastRecord, newRecord) {
    if (lastRecord === newRecord) return lastRecord;
    if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord)) return recordWithOldValue;
    return null;
  }
  function Registration(observer, target, options) {
    this.observer = observer;
    this.target = target;
    this.options = options;
    this.transientObservedNodes = [];
  }
  Registration.prototype = {
    enqueue: function enqueue(record) {
      var records = this.observer.records_;
      var length = records.length;
      if (records.length > 0) {
        var lastRecord = records[length - 1];
        var recordToReplaceLast = selectRecord(lastRecord, record);
        if (recordToReplaceLast) {
          records[length - 1] = recordToReplaceLast;
          return;
        }
      } else {
        scheduleCallback(this.observer);
      }
      records[length] = record;
    },
    addListeners: function addListeners() {
      this.addListeners_(this.target);
    },
    addListeners_: function addListeners_(node) {
      var options = this.options;
      if (options.attributes) node.addEventListener("DOMAttrModified", this, true);
      if (options.characterData) node.addEventListener("DOMCharacterDataModified", this, true);
      if (options.childList) node.addEventListener("DOMNodeInserted", this, true);
      if (options.childList || options.subtree) node.addEventListener("DOMNodeRemoved", this, true);
    },
    removeListeners: function removeListeners() {
      this.removeListeners_(this.target);
    },
    removeListeners_: function removeListeners_(node) {
      var options = this.options;
      if (options.attributes) node.removeEventListener("DOMAttrModified", this, true);
      if (options.characterData) node.removeEventListener("DOMCharacterDataModified", this, true);
      if (options.childList) node.removeEventListener("DOMNodeInserted", this, true);
      if (options.childList || options.subtree) node.removeEventListener("DOMNodeRemoved", this, true);
    },
    addTransientObserver: function addTransientObserver(node) {
      if (node === this.target) return;
      this.addListeners_(node);
      this.transientObservedNodes.push(node);
      var registrations = registrationsTable.get(node);
      if (!registrations) registrationsTable.set(node, registrations = []);
      registrations.push(this);
    },
    removeTransientObservers: function removeTransientObservers() {
      var transientObservedNodes = this.transientObservedNodes;
      this.transientObservedNodes = [];
      transientObservedNodes.forEach(function (node) {
        this.removeListeners_(node);
        var registrations = registrationsTable.get(node);
        for (var i = 0; i < registrations.length; i++) {
          if (registrations[i] === this) {
            registrations.splice(i, 1);
            break;
          }
        }
      }, this);
    },
    handleEvent: function handleEvent(e) {
      e.stopImmediatePropagation();
      switch (e.type) {
        case "DOMAttrModified":
          var name = e.attrName;
          var namespace = e.relatedNode.namespaceURI;
          var target = e.target;
          var record = new getRecord("attributes", target);
          record.attributeName = name;
          record.attributeNamespace = namespace;
          var oldValue = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
          forEachAncestorAndObserverEnqueueRecord(target, function (options) {
            if (!options.attributes) return;
            if (options.attributeFilter && options.attributeFilter.length && options.attributeFilter.indexOf(name) === -1 && options.attributeFilter.indexOf(namespace) === -1) {
              return;
            }
            if (options.attributeOldValue) return getRecordWithOldValue(oldValue);
            return record;
          });
          break;

        case "DOMCharacterDataModified":
          var target = e.target;
          var record = getRecord("characterData", target);
          var oldValue = e.prevValue;
          forEachAncestorAndObserverEnqueueRecord(target, function (options) {
            if (!options.characterData) return;
            if (options.characterDataOldValue) return getRecordWithOldValue(oldValue);
            return record;
          });
          break;

        case "DOMNodeRemoved":
          this.addTransientObserver(e.target);

        case "DOMNodeInserted":
          var changedNode = e.target;
          var addedNodes, removedNodes;
          if (e.type === "DOMNodeInserted") {
            addedNodes = [changedNode];
            removedNodes = [];
          } else {
            addedNodes = [];
            removedNodes = [changedNode];
          }
          var previousSibling = changedNode.previousSibling;
          var nextSibling = changedNode.nextSibling;
          var record = getRecord("childList", e.target.parentNode);
          record.addedNodes = addedNodes;
          record.removedNodes = removedNodes;
          record.previousSibling = previousSibling;
          record.nextSibling = nextSibling;
          forEachAncestorAndObserverEnqueueRecord(e.relatedNode, function (options) {
            if (!options.childList) return;
            return record;
          });
      }
      clearRecords();
    }
  };
  global.JsMutationObserver = JsMutationObserver;
  if (!global.MutationObserver) {
    global.MutationObserver = JsMutationObserver;
    JsMutationObserver._isPolyfilled = true;
  }
})(self);

/*
Copyright (c) 2012 Barnesandnoble.com, llc, Donavon West, and Domenic Denicola

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
(function (global, undefined) {
    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var setImmediate;

    function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
        return nextHandle++;
    }

    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    function partiallyApplied(handler) {
        var args = [].slice.call(arguments, 1);
        return function () {
            if (typeof handler === "function") {
                handler.apply(undefined, args);
            } else {
                new Function("" + handler)();
            }
        };
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function installNextTickImplementation() {
        setImmediate = function setImmediate() {
            var handle = addFromSetImmediateArguments(arguments);
            process.nextTick(partiallyApplied(runIfPresent, handle));
            return handle;
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function onGlobalMessage(event) {
            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        setImmediate = function setImmediate() {
            var handle = addFromSetImmediateArguments(arguments);
            global.postMessage(messagePrefix + handle, "*");
            return handle;
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        setImmediate = function setImmediate() {
            var handle = addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        setImmediate = function setImmediate() {
            var handle = addFromSetImmediateArguments(arguments);
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
    }

    function installSetTimeoutImplementation() {
        setImmediate = function setImmediate() {
            var handle = addFromSetImmediateArguments(arguments);
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
            return handle;
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();
    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
})(self);

// Caution:
// Do not replace this import statement with codes.
//
// If you replace this import statement with codes,
// the codes will be executed after the following polyfills are imported
// because import statements are hoisted during compilation.
// Polyfill ECMAScript standard features with global namespace pollution
// Polyfill Custom Elements v1 with global namespace pollution
// Polyfill MutationObserver with global namespace pollution
// Polyfill setImmediate with global namespace pollution

(function () {
  var DEFAULT_VIEWPORT = 'width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no';

  var Viewport = {
    ensureViewportElement: function ensureViewportElement() {
      var viewportElement = document.querySelector('meta[name=viewport]');

      if (!viewportElement) {
        viewportElement = document.createElement('meta');
        viewportElement.name = 'viewport';
        document.head.appendChild(viewportElement);
      }

      return viewportElement;
    },

    setup: function setup() {
      var viewportElement = Viewport.ensureViewportElement();

      if (!viewportElement) {
        return;
      }

      if (!viewportElement.hasAttribute('content')) {
        viewportElement.setAttribute('content', DEFAULT_VIEWPORT);
      }
    }
  };

  window.Viewport = Viewport;
})();

function setup(ons$$1) {
  if (window._onsLoaded) {
    ons$$1._util.warn('Onsen UI is loaded more than once.');
  }
  window._onsLoaded = true;

  // fastclick
  window.addEventListener('load', function () {
    ons$$1.fastClick = fastclick_1.attach(document.body);

    var supportTouchAction = 'touch-action' in document.body.style;

    ons$$1.platform._runOnActualPlatform(function () {
      if (ons$$1.platform.isAndroid()) {
        // In Android4.4+, correct viewport settings can remove click delay.
        // So disable FastClick on Android.
        ons$$1.fastClick.destroy();
      } else if (ons$$1.platform.isIOS()) {
        if (supportTouchAction && (ons$$1.platform.isIOSSafari() || ons$$1.platform.isWKWebView())) {
          // If 'touch-action' supported in iOS Safari or WKWebView, disable FastClick.
          ons$$1.fastClick.destroy();
        } else {
          // Do nothing. 'touch-action: manipulation' has no effect on UIWebView.
        }
      }
    });
  }, false);

  ons$$1.ready(function () {
    ons$$1.enableDeviceBackButtonHandler();
    ons$$1._defaultDeviceBackButtonHandler = ons$$1._internal.dbbDispatcher.createHandler(window.document.body, function () {
      if (Object.hasOwnProperty.call(navigator, 'app')) {
        navigator.app.exitApp();
      } else {
        console.warn('Could not close the app. Is \'cordova.js\' included?\nError: \'window.navigator.app\' is undefined.');
      }
    });
    document.body._gestureDetector = new ons$$1.GestureDetector(document.body, { passive: true });

    // Simulate Device Back Button on ESC press
    if (!ons$$1.platform.isWebView()) {
      document.body.addEventListener('keydown', function (event) {
        if (event.keyCode === 27) {
          ons$$1.fireDeviceBackButtonEvent();
        }
      });
    }

    // setup loading placeholder
    ons$$1._setupLoadingPlaceHolders();
  });

  // viewport.js
  Viewport.setup();
}

setup(ons); // Setup initial listeners

export default ons;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9Ab25zZW51aS9mYXN0Y2xpY2svbGliL2Zhc3RjbGljay5qcyIsIi4uLy4uL2NvcmUvc3JjL3BvbHlmaWxscy9wb2x5ZmlsbC1zd2l0Y2hlcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2dsb2JhbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mYWlscy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2hpZGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL191aWQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19leHBvcnQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcGQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtcHJvdG8uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NsYXNzb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWFic29sdXRlLWluZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS1hbGwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2Zvci1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC1zcGVjaWVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbWV0YS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3ZhbGlkYXRlLWNvbGxlY3Rpb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW5oZXJpdC1pZi1yZXF1aXJlZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zZXQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1mcm9tLWl0ZXJhYmxlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi10by1qc29uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc2V0LnRvLWpzb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtY29sbGVjdGlvbi1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnNldC5vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC1jb2xsZWN0aW9uLWZyb20uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zZXQuZnJvbS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL3NldC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hcC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcubWFwLm9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcubWFwLmZyb20uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9mbi9tYXAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1hcnJheS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jb2xsZWN0aW9uLXdlYWsuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi53ZWFrLW1hcC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LndlYWstbWFwLm9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcud2Vhay1tYXAuZnJvbS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL3dlYWstbWFwLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY3JlYXRlLXByb3BlcnR5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL2FycmF5L2Zyb20uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG9uc2VudWkvY3VzdG9tLWVsZW1lbnRzL3NyYy9VdGlsaXRpZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG9uc2VudWkvY3VzdG9tLWVsZW1lbnRzL3NyYy9DdXN0b21FbGVtZW50U3RhdGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG9uc2VudWkvY3VzdG9tLWVsZW1lbnRzL3NyYy9DdXN0b21FbGVtZW50SW50ZXJuYWxzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BvbnNlbnVpL2N1c3RvbS1lbGVtZW50cy9zcmMvRG9jdW1lbnRDb25zdHJ1Y3Rpb25PYnNlcnZlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ab25zZW51aS9jdXN0b20tZWxlbWVudHMvc3JjL0RlZmVycmVkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BvbnNlbnVpL2N1c3RvbS1lbGVtZW50cy9zcmMvQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BvbnNlbnVpL2N1c3RvbS1lbGVtZW50cy9zcmMvUGF0Y2gvTmF0aXZlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BvbnNlbnVpL2N1c3RvbS1lbGVtZW50cy9zcmMvQWxyZWFkeUNvbnN0cnVjdGVkTWFya2VyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BvbnNlbnVpL2N1c3RvbS1lbGVtZW50cy9zcmMvUGF0Y2gvSFRNTEVsZW1lbnQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG9uc2VudWkvY3VzdG9tLWVsZW1lbnRzL3NyYy9QYXRjaC9JbnRlcmZhY2UvUGFyZW50Tm9kZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ab25zZW51aS9jdXN0b20tZWxlbWVudHMvc3JjL1BhdGNoL0RvY3VtZW50LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BvbnNlbnVpL2N1c3RvbS1lbGVtZW50cy9zcmMvUGF0Y2gvTm9kZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ab25zZW51aS9jdXN0b20tZWxlbWVudHMvc3JjL1BhdGNoL0ludGVyZmFjZS9DaGlsZE5vZGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQG9uc2VudWkvY3VzdG9tLWVsZW1lbnRzL3NyYy9QYXRjaC9FbGVtZW50LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BvbnNlbnVpL2N1c3RvbS1lbGVtZW50cy9zcmMvY3VzdG9tLWVsZW1lbnRzLmpzIiwiLi4vLi4vY29yZS9zcmMvcG9seWZpbGxzL011dGF0aW9uT2JzZXJ2ZXJAMC43LjIyL011dGF0aW9uT2JzZXJ2ZXIuanMiLCIuLi8uLi9jb3JlL3NyYy9wb2x5ZmlsbHMvc2V0SW1tZWRpYXRlQDEuMC4yK21vZC9zZXRJbW1lZGlhdGUuanMiLCIuLi8uLi9jb3JlL3NyYy9wb2x5ZmlsbHMvaW5kZXguanMiLCIuLi8uLi9jb3JlL3NyYy92ZW5kb3Ivdmlld3BvcnQuanMiLCIuLi8uLi9jb3JlL3NyYy9zZXR1cC5qcyIsIi4uLy4uL2NvcmUvc3JjL2luZGV4LmVzbS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBAcHJlc2VydmUgRmFzdENsaWNrOiBwb2x5ZmlsbCB0byByZW1vdmUgY2xpY2sgZGVsYXlzIG9uIGJyb3dzZXJzIHdpdGggdG91Y2ggVUlzLlxuXHQgKlxuXHQgKiBAY29kaW5nc3RhbmRhcmQgZnRsYWJzLWpzdjJcblx0ICogQGNvcHlyaWdodCBUaGUgRmluYW5jaWFsIFRpbWVzIExpbWl0ZWQgW0FsbCBSaWdodHMgUmVzZXJ2ZWRdXG5cdCAqIEBsaWNlbnNlIE1JVCBMaWNlbnNlIChzZWUgTElDRU5TRS50eHQpXG5cdCAqL1xuXG5cdC8qanNsaW50IGJyb3dzZXI6dHJ1ZSwgbm9kZTp0cnVlKi9cblx0LypnbG9iYWwgZGVmaW5lLCBFdmVudCwgTm9kZSovXG5cblxuXHQvKipcblx0ICogSW5zdGFudGlhdGUgZmFzdC1jbGlja2luZyBsaXN0ZW5lcnMgb24gdGhlIHNwZWNpZmllZCBsYXllci5cblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gbGF5ZXIgVGhlIGxheWVyIHRvIGxpc3RlbiBvblxuXHQgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0c1xuXHQgKi9cblx0ZnVuY3Rpb24gRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKSB7XG5cdFx0dmFyIG9sZE9uQ2xpY2s7XG5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIFdoZXRoZXIgYSBjbGljayBpcyBjdXJyZW50bHkgYmVpbmcgdHJhY2tlZC5cblx0XHQgKlxuXHRcdCAqIEB0eXBlIGJvb2xlYW5cblx0XHQgKi9cblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblxuXG5cdFx0LyoqXG5cdFx0ICogVGltZXN0YW1wIGZvciB3aGVuIGNsaWNrIHRyYWNraW5nIHN0YXJ0ZWQuXG5cdFx0ICpcblx0XHQgKiBAdHlwZSBudW1iZXJcblx0XHQgKi9cblx0XHR0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCA9IDA7XG5cblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBlbGVtZW50IGJlaW5nIHRyYWNrZWQgZm9yIGEgY2xpY2suXG5cdFx0ICpcblx0XHQgKiBAdHlwZSBFdmVudFRhcmdldFxuXHRcdCAqL1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cblxuXHRcdC8qKlxuXHRcdCAqIFgtY29vcmRpbmF0ZSBvZiB0b3VjaCBzdGFydCBldmVudC5cblx0XHQgKlxuXHRcdCAqIEB0eXBlIG51bWJlclxuXHRcdCAqL1xuXHRcdHRoaXMudG91Y2hTdGFydFggPSAwO1xuXG5cblx0XHQvKipcblx0XHQgKiBZLWNvb3JkaW5hdGUgb2YgdG91Y2ggc3RhcnQgZXZlbnQuXG5cdFx0ICpcblx0XHQgKiBAdHlwZSBudW1iZXJcblx0XHQgKi9cblx0XHR0aGlzLnRvdWNoU3RhcnRZID0gMDtcblxuXG5cdFx0LyoqXG5cdFx0ICogSUQgb2YgdGhlIGxhc3QgdG91Y2gsIHJldHJpZXZlZCBmcm9tIFRvdWNoLmlkZW50aWZpZXIuXG5cdFx0ICpcblx0XHQgKiBAdHlwZSBudW1iZXJcblx0XHQgKi9cblx0XHR0aGlzLmxhc3RUb3VjaElkZW50aWZpZXIgPSAwO1xuXG5cblx0XHQvKipcblx0XHQgKiBUb3VjaG1vdmUgYm91bmRhcnksIGJleW9uZCB3aGljaCBhIGNsaWNrIHdpbGwgYmUgY2FuY2VsbGVkLlxuXHRcdCAqXG5cdFx0ICogQHR5cGUgbnVtYmVyXG5cdFx0ICovXG5cdFx0dGhpcy50b3VjaEJvdW5kYXJ5ID0gb3B0aW9ucy50b3VjaEJvdW5kYXJ5IHx8IDEwO1xuXG5cblx0XHQvKipcblx0XHQgKiBUaGUgRmFzdENsaWNrIGxheWVyLlxuXHRcdCAqXG5cdFx0ICogQHR5cGUgRWxlbWVudFxuXHRcdCAqL1xuXHRcdHRoaXMubGF5ZXIgPSBsYXllcjtcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiB0YXAodG91Y2hzdGFydCBhbmQgdG91Y2hlbmQpIGV2ZW50c1xuXHRcdCAqXG5cdFx0ICogQHR5cGUgbnVtYmVyXG5cdFx0ICovXG5cdFx0dGhpcy50YXBEZWxheSA9IG9wdGlvbnMudGFwRGVsYXkgfHwgMjAwO1xuXG5cdFx0LyoqXG5cdFx0ICogVGhlIG1heGltdW0gdGltZSBmb3IgYSB0YXBcblx0XHQgKlxuXHRcdCAqIEB0eXBlIG51bWJlclxuXHRcdCAqL1xuXHRcdHRoaXMudGFwVGltZW91dCA9IG9wdGlvbnMudGFwVGltZW91dCB8fCA3MDA7XG5cblx0XHRpZiAoRmFzdENsaWNrLm5vdE5lZWRlZChsYXllcikpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBTb21lIG9sZCB2ZXJzaW9ucyBvZiBBbmRyb2lkIGRvbid0IGhhdmUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcblx0XHRmdW5jdGlvbiBiaW5kKG1ldGhvZCwgY29udGV4dCkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gbWV0aG9kLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7IH07XG5cdFx0fVxuXG5cblx0XHR2YXIgbWV0aG9kcyA9IFsnb25Nb3VzZScsICdvbkNsaWNrJywgJ29uVG91Y2hTdGFydCcsICdvblRvdWNoTW92ZScsICdvblRvdWNoRW5kJywgJ29uVG91Y2hDYW5jZWwnXTtcblx0XHR2YXIgY29udGV4dCA9IHRoaXM7XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdFx0Y29udGV4dFttZXRob2RzW2ldXSA9IGJpbmQoY29udGV4dFttZXRob2RzW2ldXSwgY29udGV4dCk7XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IHVwIGV2ZW50IGhhbmRsZXJzIGFzIHJlcXVpcmVkXG5cdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHR9XG5cblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljaywgdHJ1ZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0LCBmYWxzZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSwgZmFsc2UpO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kLCBmYWxzZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLm9uVG91Y2hDYW5jZWwsIGZhbHNlKTtcblxuXHRcdC8vIEhhY2sgaXMgcmVxdWlyZWQgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBFdmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gKGUuZy4gQW5kcm9pZCAyKVxuXHRcdC8vIHdoaWNoIGlzIGhvdyBGYXN0Q2xpY2sgbm9ybWFsbHkgc3RvcHMgY2xpY2sgZXZlbnRzIGJ1YmJsaW5nIHRvIGNhbGxiYWNrcyByZWdpc3RlcmVkIG9uIHRoZSBGYXN0Q2xpY2tcblx0XHQvLyBsYXllciB3aGVuIHRoZXkgYXJlIGNhbmNlbGxlZC5cblx0XHRpZiAoIUV2ZW50LnByb3RvdHlwZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcblx0XHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSkge1xuXHRcdFx0XHR2YXIgcm12ID0gTm9kZS5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdjbGljaycpIHtcblx0XHRcdFx0XHRybXYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2suaGlqYWNrZWQgfHwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJtdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSkge1xuXHRcdFx0XHR2YXIgYWR2ID0gTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdjbGljaycpIHtcblx0XHRcdFx0XHRhZHYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2suaGlqYWNrZWQgfHwgKGNhbGxiYWNrLmhpamFja2VkID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRcdGlmICghZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKGV2ZW50KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSwgY2FwdHVyZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YWR2LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBJZiBhIGhhbmRsZXIgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiB0aGUgZWxlbWVudCdzIG9uY2xpY2sgYXR0cmlidXRlLCBpdCB3aWxsIGJlIGZpcmVkIGJlZm9yZVxuXHRcdC8vIEZhc3RDbGljaydzIG9uQ2xpY2sgaGFuZGxlci4gRml4IHRoaXMgYnkgcHVsbGluZyBvdXQgdGhlIHVzZXItZGVmaW5lZCBoYW5kbGVyIGZ1bmN0aW9uIGFuZFxuXHRcdC8vIGFkZGluZyBpdCBhcyBsaXN0ZW5lci5cblx0XHRpZiAodHlwZW9mIGxheWVyLm9uY2xpY2sgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdFx0Ly8gQW5kcm9pZCBicm93c2VyIG9uIGF0IGxlYXN0IDMuMiByZXF1aXJlcyBhIG5ldyByZWZlcmVuY2UgdG8gdGhlIGZ1bmN0aW9uIGluIGxheWVyLm9uY2xpY2tcblx0XHRcdC8vIC0gdGhlIG9sZCBvbmUgd29uJ3Qgd29yayBpZiBwYXNzZWQgdG8gYWRkRXZlbnRMaXN0ZW5lciBkaXJlY3RseS5cblx0XHRcdG9sZE9uQ2xpY2sgPSBsYXllci5vbmNsaWNrO1xuXHRcdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRvbGRPbkNsaWNrKGV2ZW50KTtcblx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdGxheWVyLm9uY2xpY2sgPSBudWxsO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQqIFdpbmRvd3MgUGhvbmUgOC4xIGZha2VzIHVzZXIgYWdlbnQgc3RyaW5nIHRvIGxvb2sgbGlrZSBBbmRyb2lkIGFuZCBpUGhvbmUuXG5cdCpcblx0KiBAdHlwZSBib29sZWFuXG5cdCovXG5cdHZhciBkZXZpY2VJc1dpbmRvd3NQaG9uZSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIldpbmRvd3MgUGhvbmVcIikgPj0gMDtcblxuXHQvKipcblx0ICogQW5kcm9pZCByZXF1aXJlcyBleGNlcHRpb25zLlxuXHQgKlxuXHQgKiBAdHlwZSBib29sZWFuXG5cdCAqL1xuXHR2YXIgZGV2aWNlSXNBbmRyb2lkID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdBbmRyb2lkJykgPiAwICYmICFkZXZpY2VJc1dpbmRvd3NQaG9uZTtcblxuXG5cdC8qKlxuXHQgKiBpT1MgcmVxdWlyZXMgZXhjZXB0aW9ucy5cblx0ICpcblx0ICogQHR5cGUgYm9vbGVhblxuXHQgKi9cblx0dmFyIGRldmljZUlzSU9TID0gL2lQKGFkfGhvbmV8b2QpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmICFkZXZpY2VJc1dpbmRvd3NQaG9uZTtcblxuXG5cdC8qKlxuXHQgKiBpT1MgNCByZXF1aXJlcyBhbiBleGNlcHRpb24gZm9yIHNlbGVjdCBlbGVtZW50cy5cblx0ICpcblx0ICogQHR5cGUgYm9vbGVhblxuXHQgKi9cblx0dmFyIGRldmljZUlzSU9TNCA9IGRldmljZUlzSU9TICYmICgvT1MgNF9cXGQoX1xcZCk/LykudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuXG5cdC8qKlxuXHQgKiBpT1MgNi4wLTcuKiByZXF1aXJlcyB0aGUgdGFyZ2V0IGVsZW1lbnQgdG8gYmUgbWFudWFsbHkgZGVyaXZlZFxuXHQgKlxuXHQgKiBAdHlwZSBib29sZWFuXG5cdCAqL1xuXHR2YXIgZGV2aWNlSXNJT1NXaXRoQmFkVGFyZ2V0ID0gZGV2aWNlSXNJT1MgJiYgKC9PUyBbNi03XV9cXGQvKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cdC8qKlxuXHQgKiBCbGFja0JlcnJ5IHJlcXVpcmVzIGV4Y2VwdGlvbnMuXG5cdCAqXG5cdCAqIEB0eXBlIGJvb2xlYW5cblx0ICovXG5cdHZhciBkZXZpY2VJc0JsYWNrQmVycnkxMCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQkIxMCcpID4gMDtcblxuXHQvKipcblx0ICogVmFsaWQgdHlwZXMgZm9yIHRleHQgaW5wdXRzXG5cdCAqXG5cdCAqIEB0eXBlIGFycmF5XG5cdCAqL1xuXHR2YXIgdGV4dEZpZWxkcyA9IFsnZW1haWwnLCAnbnVtYmVyJywgJ3Bhc3N3b3JkJywgJ3NlYXJjaCcsICd0ZWwnLCAndGV4dCcsICd1cmwnXTtcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBnaXZlbiBlbGVtZW50IHJlcXVpcmVzIGEgbmF0aXZlIGNsaWNrLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgZWxlbWVudCBuZWVkcyBhIG5hdGl2ZSBjbGlja1xuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0NsaWNrID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXG5cdFx0Ly8gRG9uJ3Qgc2VuZCBhIHN5bnRoZXRpYyBjbGljayB0byBkaXNhYmxlZCBpbnB1dHMgKGlzc3VlICM2Milcblx0XHRjYXNlICdidXR0b24nOlxuXHRcdGNhc2UgJ3NlbGVjdCc6XG5cdFx0Y2FzZSAndGV4dGFyZWEnOlxuXHRcdFx0aWYgKHRhcmdldC5kaXNhYmxlZCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnaW5wdXQnOlxuXG5cdFx0XHQvLyBGaWxlIGlucHV0cyBuZWVkIHJlYWwgY2xpY2tzIG9uIGlPUyA2IGR1ZSB0byBhIGJyb3dzZXIgYnVnIChpc3N1ZSAjNjgpXG5cdFx0XHRpZiAoKGRldmljZUlzSU9TICYmIHRhcmdldC50eXBlID09PSAnZmlsZScpIHx8IHRhcmdldC5kaXNhYmxlZCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnbGFiZWwnOlxuXHRcdGNhc2UgJ2lmcmFtZSc6IC8vIGlPUzggaG9tZXNjcmVlbiBhcHBzIGNhbiBwcmV2ZW50IGV2ZW50cyBidWJibGluZyBpbnRvIGZyYW1lc1xuXHRcdGNhc2UgJ3ZpZGVvJzpcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiAoL1xcYm5lZWRzY2xpY2tcXGIvKS50ZXN0KHRhcmdldC5jbGFzc05hbWUpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIERldGVybWluZSB3aGV0aGVyIGEgZ2l2ZW4gZWxlbWVudCByZXF1aXJlcyBhIGNhbGwgdG8gZm9jdXMgdG8gc2ltdWxhdGUgY2xpY2sgaW50byBlbGVtZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgZWxlbWVudCByZXF1aXJlcyBhIGNhbGwgdG8gZm9jdXMgdG8gc2ltdWxhdGUgbmF0aXZlIGNsaWNrLlxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0ZvY3VzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXHRcdGNhc2UgJ3RleHRhcmVhJzpcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGNhc2UgJ3NlbGVjdCc6XG5cdFx0XHRyZXR1cm4gIWRldmljZUlzQW5kcm9pZDtcblx0XHRjYXNlICdpbnB1dCc6XG5cdFx0XHRzd2l0Y2ggKHRhcmdldC50eXBlKSB7XG5cdFx0XHRjYXNlICdidXR0b24nOlxuXHRcdFx0Y2FzZSAnY2hlY2tib3gnOlxuXHRcdFx0Y2FzZSAnZmlsZSc6XG5cdFx0XHRjYXNlICdpbWFnZSc6XG5cdFx0XHRjYXNlICdyYWRpbyc6XG5cdFx0XHRjYXNlICdzdWJtaXQnOlxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgdG8gZm9jdXMgZGlzYWJsZWQgaW5wdXRzXG5cdFx0XHRyZXR1cm4gIXRhcmdldC5kaXNhYmxlZCAmJiAhdGFyZ2V0LnJlYWRPbmx5O1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gKC9cXGJuZWVkc2ZvY3VzXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcblx0XHR9XG5cdH07XG5cblxuXHQvKipcblx0ICogU2VuZCBhIGNsaWNrIGV2ZW50IHRvIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cblx0ICpcblx0ICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG5cdCAqL1xuXHRGYXN0Q2xpY2sucHJvdG90eXBlLnNlbmRDbGljayA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQsIGV2ZW50KSB7XG5cdFx0dmFyIGNsaWNrRXZlbnQsIHRvdWNoO1xuXG5cdFx0Ly8gT24gc29tZSBBbmRyb2lkIGRldmljZXMgYWN0aXZlRWxlbWVudCBuZWVkcyB0byBiZSBibHVycmVkIG90aGVyd2lzZSB0aGUgc3ludGhldGljIGNsaWNrIHdpbGwgaGF2ZSBubyBlZmZlY3QgKCMyNClcblx0XHRpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0YXJnZXRFbGVtZW50KSB7XG5cdFx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0XHR9XG5cblx0XHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdFx0Ly8gU3ludGhlc2lzZSBhIGNsaWNrIGV2ZW50LCB3aXRoIGFuIGV4dHJhIGF0dHJpYnV0ZSBzbyBpdCBjYW4gYmUgdHJhY2tlZFxuXHRcdGNsaWNrRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudHMnKTtcblx0XHRjbGlja0V2ZW50LmluaXRNb3VzZUV2ZW50KHRoaXMuZGV0ZXJtaW5lRXZlbnRUeXBlKHRhcmdldEVsZW1lbnQpLCB0cnVlLCB0cnVlLCB3aW5kb3csIDEsIHRvdWNoLnNjcmVlblgsIHRvdWNoLnNjcmVlblksIHRvdWNoLmNsaWVudFgsIHRvdWNoLmNsaWVudFksIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsKTtcblx0XHRjbGlja0V2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQgPSB0cnVlO1xuXHRcdHRhcmdldEVsZW1lbnQuZGlzcGF0Y2hFdmVudChjbGlja0V2ZW50KTtcblx0fTtcblxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLmRldGVybWluZUV2ZW50VHlwZSA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblxuXHRcdC8vSXNzdWUgIzE1OTogQW5kcm9pZCBDaHJvbWUgU2VsZWN0IEJveCBkb2VzIG5vdCBvcGVuIHdpdGggYSBzeW50aGV0aWMgY2xpY2sgZXZlbnRcblx0XHRpZiAoZGV2aWNlSXNBbmRyb2lkICYmIHRhcmdldEVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0Jykge1xuXHRcdFx0cmV0dXJuICdtb3VzZWRvd24nO1xuXHRcdH1cblxuXHRcdHJldHVybiAnY2xpY2snO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0RWxlbWVudFxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0XHR2YXIgbGVuZ3RoO1xuXG5cdFx0Ly8gSXNzdWUgIzE2MDogb24gaU9TIDcsIHNvbWUgaW5wdXQgZWxlbWVudHMgKGUuZy4gZGF0ZSBkYXRldGltZSBtb250aCkgdGhyb3cgYSB2YWd1ZSBUeXBlRXJyb3Igb24gc2V0U2VsZWN0aW9uUmFuZ2UuIFRoZXNlIGVsZW1lbnRzIGRvbid0IGhhdmUgYW4gaW50ZWdlciB2YWx1ZSBmb3IgdGhlIHNlbGVjdGlvblN0YXJ0IGFuZCBzZWxlY3Rpb25FbmQgcHJvcGVydGllcywgYnV0IHVuZm9ydHVuYXRlbHkgdGhhdCBjYW4ndCBiZSB1c2VkIGZvciBkZXRlY3Rpb24gYmVjYXVzZSBhY2Nlc3NpbmcgdGhlIHByb3BlcnRpZXMgYWxzbyB0aHJvd3MgYSBUeXBlRXJyb3IuIEp1c3QgY2hlY2sgdGhlIHR5cGUgaW5zdGVhZC4gRmlsZWQgYXMgQXBwbGUgYnVnICMxNTEyMjcyNC5cblx0XHRpZiAoZGV2aWNlSXNJT1MgJiYgdGFyZ2V0RWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZSAmJiB0YXJnZXRFbGVtZW50LnR5cGUuaW5kZXhPZignZGF0ZScpICE9PSAwICYmIHRhcmdldEVsZW1lbnQudHlwZSAhPT0gJ3RpbWUnICYmIHRhcmdldEVsZW1lbnQudHlwZSAhPT0gJ21vbnRoJyAmJiB0YXJnZXRFbGVtZW50LnR5cGUgIT09ICdlbWFpbCcgJiYgdGFyZ2V0RWxlbWVudC50eXBlICE9PSAnbnVtYmVyJykge1xuXHRcdFx0bGVuZ3RoID0gdGFyZ2V0RWxlbWVudC52YWx1ZS5sZW5ndGg7XG5cdFx0XHR0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGxlbmd0aCwgbGVuZ3RoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0RWxlbWVudC5mb2N1cygpO1xuXHRcdH1cblx0fTtcblxuXG5cdC8qKlxuXHQgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciBhbmQgaWYgc28sIHNldCBhIGZsYWcgb24gaXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0RWxlbWVudFxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS51cGRhdGVTY3JvbGxQYXJlbnQgPSBmdW5jdGlvbih0YXJnZXRFbGVtZW50KSB7XG5cdFx0dmFyIHNjcm9sbFBhcmVudCwgcGFyZW50RWxlbWVudDtcblxuXHRcdHNjcm9sbFBhcmVudCA9IHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXG5cdFx0Ly8gQXR0ZW1wdCB0byBkaXNjb3ZlciB3aGV0aGVyIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjb250YWluZWQgd2l0aGluIGEgc2Nyb2xsYWJsZSBsYXllci4gUmUtY2hlY2sgaWYgdGhlXG5cdFx0Ly8gdGFyZ2V0IGVsZW1lbnQgd2FzIG1vdmVkIHRvIGFub3RoZXIgcGFyZW50LlxuXHRcdGlmICghc2Nyb2xsUGFyZW50IHx8ICFzY3JvbGxQYXJlbnQuY29udGFpbnModGFyZ2V0RWxlbWVudCkpIHtcblx0XHRcdHBhcmVudEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50O1xuXHRcdFx0ZG8ge1xuXHRcdFx0XHRpZiAocGFyZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgPiBwYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCkge1xuXHRcdFx0XHRcdHNjcm9sbFBhcmVudCA9IHBhcmVudEVsZW1lbnQ7XG5cdFx0XHRcdFx0dGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQgPSBwYXJlbnRFbGVtZW50O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcblx0XHRcdH0gd2hpbGUgKHBhcmVudEVsZW1lbnQpO1xuXHRcdH1cblxuXHRcdC8vIEFsd2F5cyB1cGRhdGUgdGhlIHNjcm9sbCB0b3AgdHJhY2tlciBpZiBwb3NzaWJsZS5cblx0XHRpZiAoc2Nyb2xsUGFyZW50KSB7XG5cdFx0XHRzY3JvbGxQYXJlbnQuZmFzdENsaWNrTGFzdFNjcm9sbFRvcCA9IHNjcm9sbFBhcmVudC5zY3JvbGxUb3A7XG5cdFx0fVxuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldEVsZW1lbnRcblx0ICogQHJldHVybnMge0VsZW1lbnR8RXZlbnRUYXJnZXR9XG5cdCAqL1xuXHRGYXN0Q2xpY2sucHJvdG90eXBlLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQgPSBmdW5jdGlvbihldmVudFRhcmdldCkge1xuXG5cdFx0Ly8gT24gc29tZSBvbGRlciBicm93c2VycyAobm90YWJseSBTYWZhcmkgb24gaU9TIDQuMSAtIHNlZSBpc3N1ZSAjNTYpIHRoZSBldmVudCB0YXJnZXQgbWF5IGJlIGEgdGV4dCBub2RlLlxuXHRcdGlmIChldmVudFRhcmdldC5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcblx0XHRcdHJldHVybiBldmVudFRhcmdldC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdHJldHVybiBldmVudFRhcmdldDtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRFbGVtZW50XG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5pc1RleHRGaWVsZCA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0dGFyZ2V0RWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd0ZXh0YXJlYSdcblx0XHRcdHx8IHRleHRGaWVsZHMuaW5kZXhPZih0YXJnZXRFbGVtZW50LnR5cGUpICE9PSAtMVxuXHRcdCk7XG5cdH07XG5cblx0LyoqXG5cdCAqIE9uIHRvdWNoIHN0YXJ0LCByZWNvcmQgdGhlIHBvc2l0aW9uIGFuZCBzY3JvbGwgb2Zmc2V0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICovXG5cdEZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaFN0YXJ0ID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0RWxlbWVudCwgdG91Y2gsIHNlbGVjdGlvbjtcblxuXHRcdC8vIElnbm9yZSBtdWx0aXBsZSB0b3VjaGVzLCBvdGhlcndpc2UgcGluY2gtdG8tem9vbSBpcyBwcmV2ZW50ZWQgaWYgYm90aCBmaW5nZXJzIGFyZSBvbiB0aGUgRmFzdENsaWNrIGVsZW1lbnQgKGlzc3VlICMxMTEpLlxuXHRcdGlmIChldmVudC50YXJnZXRUb3VjaGVzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHRhcmdldEVsZW1lbnQgPSB0aGlzLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQoZXZlbnQudGFyZ2V0KTtcblx0XHR0b3VjaCA9IGV2ZW50LnRhcmdldFRvdWNoZXNbMF07XG5cblx0XHQvLyBJZ25vcmUgdG91Y2hlcyBvbiBjb250ZW50ZWRpdGFibGUgZWxlbWVudHMgdG8gcHJldmVudCBjb25mbGljdCB3aXRoIHRleHQgc2VsZWN0aW9uLlxuXHRcdC8vIChGb3IgZGV0YWlsczogaHR0cHM6Ly9naXRodWIuY29tL2Z0bGFicy9mYXN0Y2xpY2svcHVsbC8yMTEgKVxuXHRcdGlmICh0YXJnZXRFbGVtZW50LmlzQ29udGVudEVkaXRhYmxlKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoZGV2aWNlSXNJT1MpIHtcblx0XHRcdC8vIElnbm9yZSB0b3VjaHN0YXJ0IGluIGZvY3VzZWQgdGV4dCBmaWVsZFxuXHRcdFx0Ly8gQWxsb3dzIG5vcm1hbCB0ZXh0IHNlbGVjdGlvbiBhbmQgY29tbWFuZHMgKHNlbGVjdC9wYXN0ZS9jdXQpIHdoZW4gYSBmaWVsZCBoYXMgZm9jdXMsIHdoaWxlIHN0aWxsIGFsbG93aW5nIGZhc3QgdGFwLXRvLWZvY3VzLlxuXHRcdFx0Ly8gV2l0aG91dCB0aGlzIGZpeCwgdXNlciBuZWVkcyB0byB0YXAtYW5kLWhvbGQgYSB0ZXh0IGZpZWxkIGZvciBjb250ZXh0IG1lbnUsIGFuZCBkb3VibGUtdGFwIHRvIHNlbGVjdCB0ZXh0IGRvZXNuJ3Qgd29yayBhdCBhbGwuXG5cdFx0XHRpZiAodGFyZ2V0RWxlbWVudCA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiB0aGlzLmlzVGV4dEZpZWxkKHRhcmdldEVsZW1lbnQpKSB7XG5cdFx0XHQgIHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWRldmljZUlzSU9TNCkge1xuXG5cdFx0XHRcdC8vIFdlaXJkIHRoaW5ncyBoYXBwZW4gb24gaU9TIHdoZW4gYW4gYWxlcnQgb3IgY29uZmlybSBkaWFsb2cgaXMgb3BlbmVkIGZyb20gYSBjbGljayBldmVudCBjYWxsYmFjayAoaXNzdWUgIzIzKTpcblx0XHRcdFx0Ly8gd2hlbiB0aGUgdXNlciBuZXh0IHRhcHMgYW55d2hlcmUgZWxzZSBvbiB0aGUgcGFnZSwgbmV3IHRvdWNoc3RhcnQgYW5kIHRvdWNoZW5kIGV2ZW50cyBhcmUgZGlzcGF0Y2hlZFxuXHRcdFx0XHQvLyB3aXRoIHRoZSBzYW1lIGlkZW50aWZpZXIgYXMgdGhlIHRvdWNoIGV2ZW50IHRoYXQgcHJldmlvdXNseSB0cmlnZ2VyZWQgdGhlIGNsaWNrIHRoYXQgdHJpZ2dlcmVkIHRoZSBhbGVydC5cblx0XHRcdFx0Ly8gU2FkbHksIHRoZXJlIGlzIGFuIGlzc3VlIG9uIGlPUyA0IHRoYXQgY2F1c2VzIHNvbWUgbm9ybWFsIHRvdWNoIGV2ZW50cyB0byBoYXZlIHRoZSBzYW1lIGlkZW50aWZpZXIgYXMgYW5cblx0XHRcdFx0Ly8gaW1tZWRpYXRlbHkgcHJlY2VlZGluZyB0b3VjaCBldmVudCAoaXNzdWUgIzUyKSwgc28gdGhpcyBmaXggaXMgdW5hdmFpbGFibGUgb24gdGhhdCBwbGF0Zm9ybS5cblx0XHRcdFx0Ly8gSXNzdWUgMTIwOiB0b3VjaC5pZGVudGlmaWVyIGlzIDAgd2hlbiBDaHJvbWUgZGV2IHRvb2xzICdFbXVsYXRlIHRvdWNoIGV2ZW50cycgaXMgc2V0IHdpdGggYW4gaU9TIGRldmljZSBVQSBzdHJpbmcsXG5cdFx0XHRcdC8vIHdoaWNoIGNhdXNlcyBhbGwgdG91Y2ggZXZlbnRzIHRvIGJlIGlnbm9yZWQuIEFzIHRoaXMgYmxvY2sgb25seSBhcHBsaWVzIHRvIGlPUywgYW5kIGlPUyBpZGVudGlmaWVycyBhcmUgYWx3YXlzIGxvbmcsXG5cdFx0XHRcdC8vIHJhbmRvbSBpbnRlZ2VycywgaXQncyBzYWZlIHRvIHRvIGNvbnRpbnVlIGlmIHRoZSBpZGVudGlmaWVyIGlzIDAgaGVyZS5cblx0XHRcdFx0aWYgKHRvdWNoLmlkZW50aWZpZXIgJiYgdG91Y2guaWRlbnRpZmllciA9PT0gdGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmxhc3RUb3VjaElkZW50aWZpZXIgPSB0b3VjaC5pZGVudGlmaWVyO1xuXG5cdFx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciAodXNpbmcgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoKSBhbmQ6XG5cdFx0XHRcdC8vIDEpIHRoZSB1c2VyIGRvZXMgYSBmbGluZyBzY3JvbGwgb24gdGhlIHNjcm9sbGFibGUgbGF5ZXJcblx0XHRcdFx0Ly8gMikgdGhlIHVzZXIgc3RvcHMgdGhlIGZsaW5nIHNjcm9sbCB3aXRoIGFub3RoZXIgdGFwXG5cdFx0XHRcdC8vIHRoZW4gdGhlIGV2ZW50LnRhcmdldCBvZiB0aGUgbGFzdCAndG91Y2hlbmQnIGV2ZW50IHdpbGwgYmUgdGhlIGVsZW1lbnQgdGhhdCB3YXMgdW5kZXIgdGhlIHVzZXIncyBmaW5nZXJcblx0XHRcdFx0Ly8gd2hlbiB0aGUgZmxpbmcgc2Nyb2xsIHdhcyBzdGFydGVkLCBjYXVzaW5nIEZhc3RDbGljayB0byBzZW5kIGEgY2xpY2sgZXZlbnQgdG8gdGhhdCBsYXllciAtIHVubGVzcyBhIGNoZWNrXG5cdFx0XHRcdC8vIGlzIG1hZGUgdG8gZW5zdXJlIHRoYXQgYSBwYXJlbnQgbGF5ZXIgd2FzIG5vdCBzY3JvbGxlZCBiZWZvcmUgc2VuZGluZyBhIHN5bnRoZXRpYyBjbGljayAoaXNzdWUgIzQyKS5cblx0XHRcdFx0dGhpcy51cGRhdGVTY3JvbGxQYXJlbnQodGFyZ2V0RWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy50cmFja2luZ0NsaWNrID0gdHJ1ZTtcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCA9IGV2ZW50LnRpbWVTdGFtcDtcblx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50O1xuXG5cdFx0dGhpcy50b3VjaFN0YXJ0WCA9IHRvdWNoLnBhZ2VYO1xuXHRcdHRoaXMudG91Y2hTdGFydFkgPSB0b3VjaC5wYWdlWTtcblxuXHRcdC8vIFByZXZlbnQgcGhhbnRvbSBjbGlja3Mgb24gZmFzdCBkb3VibGUtdGFwIChpc3N1ZSAjMzYpXG5cdFx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0aGlzLmxhc3RDbGlja1RpbWUpIDwgdGhpcy50YXBEZWxheSAmJiAoZXZlbnQudGltZVN0YW1wIC0gdGhpcy5sYXN0Q2xpY2tUaW1lKSA+IC0xKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEJhc2VkIG9uIGEgdG91Y2htb3ZlIGV2ZW50IG9iamVjdCwgY2hlY2sgd2hldGhlciB0aGUgdG91Y2ggaGFzIG1vdmVkIHBhc3QgYSBib3VuZGFyeSBzaW5jZSBpdCBzdGFydGVkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICovXG5cdEZhc3RDbGljay5wcm90b3R5cGUudG91Y2hIYXNNb3ZlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sIGJvdW5kYXJ5ID0gdGhpcy50b3VjaEJvdW5kYXJ5O1xuXG5cdFx0aWYgKE1hdGguYWJzKHRvdWNoLnBhZ2VYIC0gdGhpcy50b3VjaFN0YXJ0WCkgPiBib3VuZGFyeSB8fCBNYXRoLmFicyh0b3VjaC5wYWdlWSAtIHRoaXMudG91Y2hTdGFydFkpID4gYm91bmRhcnkpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBVcGRhdGUgdGhlIGxhc3QgcG9zaXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYgKCF0aGlzLnRyYWNraW5nQ2xpY2spIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIElmIHRoZSB0b3VjaCBoYXMgbW92ZWQsIGNhbmNlbCB0aGUgY2xpY2sgdHJhY2tpbmdcblx0XHRpZiAodGhpcy50YXJnZXRFbGVtZW50ICE9PSB0aGlzLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQoZXZlbnQudGFyZ2V0KSB8fCB0aGlzLnRvdWNoSGFzTW92ZWQoZXZlbnQpKSB7XG5cdFx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG5cblxuXHQvKipcblx0ICogQXR0ZW1wdCB0byBmaW5kIHRoZSBsYWJlbGxlZCBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbGFiZWwgZWxlbWVudC5cblx0ICpcblx0ICogQHBhcmFtIHtFdmVudFRhcmdldHxIVE1MTGFiZWxFbGVtZW50fSBsYWJlbEVsZW1lbnRcblx0ICogQHJldHVybnMge0VsZW1lbnR8bnVsbH1cblx0ICovXG5cdEZhc3RDbGljay5wcm90b3R5cGUuZmluZENvbnRyb2wgPSBmdW5jdGlvbihsYWJlbEVsZW1lbnQpIHtcblxuXHRcdC8vIEZhc3QgcGF0aCBmb3IgbmV3ZXIgYnJvd3NlcnMgc3VwcG9ydGluZyB0aGUgSFRNTDUgY29udHJvbCBhdHRyaWJ1dGVcblx0XHRpZiAobGFiZWxFbGVtZW50LmNvbnRyb2wgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIGxhYmVsRWxlbWVudC5jb250cm9sO1xuXHRcdH1cblxuXHRcdC8vIEFsbCBicm93c2VycyB1bmRlciB0ZXN0IHRoYXQgc3VwcG9ydCB0b3VjaCBldmVudHMgYWxzbyBzdXBwb3J0IHRoZSBIVE1MNSBodG1sRm9yIGF0dHJpYnV0ZVxuXHRcdGlmIChsYWJlbEVsZW1lbnQuaHRtbEZvcikge1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxhYmVsRWxlbWVudC5odG1sRm9yKTtcblx0XHR9XG5cblx0XHQvLyBJZiBubyBmb3IgYXR0cmlidXRlIGV4aXN0cywgYXR0ZW1wdCB0byByZXRyaWV2ZSB0aGUgZmlyc3QgbGFiZWxsYWJsZSBkZXNjZW5kYW50IGVsZW1lbnRcblx0XHQvLyB0aGUgbGlzdCBvZiB3aGljaCBpcyBkZWZpbmVkIGhlcmU6IGh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjY2F0ZWdvcnktbGFiZWxcblx0XHRyZXR1cm4gbGFiZWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiwgaW5wdXQ6bm90KFt0eXBlPWhpZGRlbl0pLCBrZXlnZW4sIG1ldGVyLCBvdXRwdXQsIHByb2dyZXNzLCBzZWxlY3QsIHRleHRhcmVhJyk7XG5cdH07XG5cblxuXHQvKipcblx0ICogT24gdG91Y2ggZW5kLCBkZXRlcm1pbmUgd2hldGhlciB0byBzZW5kIGEgY2xpY2sgZXZlbnQgYXQgb25jZS5cblx0ICpcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqL1xuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hFbmQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciBmb3JFbGVtZW50LCB0cmFja2luZ0NsaWNrU3RhcnQsIHRhcmdldFRhZ05hbWUsIHNjcm9sbFBhcmVudCwgdG91Y2gsIHRhcmdldEVsZW1lbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQ7XG5cblx0XHRpZiAoIXRoaXMudHJhY2tpbmdDbGljaykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gUHJldmVudCBwaGFudG9tIGNsaWNrcyBvbiBmYXN0IGRvdWJsZS10YXAgKGlzc3VlICMzNilcblx0XHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5ICYmIChldmVudC50aW1lU3RhbXAgLSB0aGlzLmxhc3RDbGlja1RpbWUpID4gLTEpIHtcblx0XHRcdHRoaXMuY2FuY2VsTmV4dENsaWNrID0gdHJ1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICgoZXZlbnQudGltZVN0YW1wIC0gdGhpcy50cmFja2luZ0NsaWNrU3RhcnQpID4gdGhpcy50YXBUaW1lb3V0KSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBSZXNldCB0byBwcmV2ZW50IHdyb25nIGNsaWNrIGNhbmNlbCBvbiBpbnB1dCAoaXNzdWUgIzE1NikuXG5cdFx0dGhpcy5jYW5jZWxOZXh0Q2xpY2sgPSBmYWxzZTtcblxuXHRcdHRoaXMubGFzdENsaWNrVGltZSA9IGV2ZW50LnRpbWVTdGFtcDtcblxuXHRcdHRyYWNraW5nQ2xpY2tTdGFydCA9IHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0O1xuXHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHRcdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gMDtcblxuXHRcdC8vIE9uIHNvbWUgaU9TIGRldmljZXMsIHRoZSB0YXJnZXRFbGVtZW50IHN1cHBsaWVkIHdpdGggdGhlIGV2ZW50IGlzIGludmFsaWQgaWYgdGhlIGxheWVyXG5cdFx0Ly8gaXMgcGVyZm9ybWluZyBhIHRyYW5zaXRpb24gb3Igc2Nyb2xsLCBhbmQgaGFzIHRvIGJlIHJlLWRldGVjdGVkIG1hbnVhbGx5LiBOb3RlIHRoYXRcblx0XHQvLyBmb3IgdGhpcyB0byBmdW5jdGlvbiBjb3JyZWN0bHksIGl0IG11c3QgYmUgY2FsbGVkICphZnRlciogdGhlIGV2ZW50IHRhcmdldCBpcyBjaGVja2VkIVxuXHRcdC8vIFNlZSBpc3N1ZSAjNTc7IGFsc28gZmlsZWQgYXMgcmRhcjovLzEzMDQ4NTg5IC5cblx0XHRpZiAoZGV2aWNlSXNJT1NXaXRoQmFkVGFyZ2V0KSB7XG5cdFx0XHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdFx0XHQvLyBJbiBjZXJ0YWluIGNhc2VzIGFyZ3VtZW50cyBvZiBlbGVtZW50RnJvbVBvaW50IGNhbiBiZSBuZWdhdGl2ZSwgc28gcHJldmVudCBzZXR0aW5nIHRhcmdldEVsZW1lbnQgdG8gbnVsbFxuXHRcdFx0dGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodG91Y2gucGFnZVggLSB3aW5kb3cucGFnZVhPZmZzZXQsIHRvdWNoLnBhZ2VZIC0gd2luZG93LnBhZ2VZT2Zmc2V0KSB8fCB0YXJnZXRFbGVtZW50O1xuXHRcdFx0dGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXHRcdH1cblxuXHRcdHRhcmdldFRhZ05hbWUgPSB0YXJnZXRFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRpZiAodGFyZ2V0VGFnTmFtZSA9PT0gJ2xhYmVsJykge1xuXHRcdFx0Zm9yRWxlbWVudCA9IHRoaXMuZmluZENvbnRyb2wodGFyZ2V0RWxlbWVudCk7XG5cdFx0XHRpZiAoZm9yRWxlbWVudCkge1xuXHRcdFx0XHR0aGlzLmZvY3VzKHRhcmdldEVsZW1lbnQpO1xuXHRcdFx0XHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGFyZ2V0RWxlbWVudCA9IGZvckVsZW1lbnQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0aGlzLm5lZWRzRm9jdXModGFyZ2V0RWxlbWVudCkpIHtcblxuXHRcdFx0Ly8gQ2FzZSAxOiBJZiB0aGUgdG91Y2ggc3RhcnRlZCBhIHdoaWxlIGFnbyAoYmVzdCBndWVzcyBpcyAxMDBtcyBiYXNlZCBvbiB0ZXN0cyBmb3IgaXNzdWUgIzM2KSB0aGVuIGZvY3VzIHdpbGwgYmUgdHJpZ2dlcmVkIGFueXdheS4gUmV0dXJuIGVhcmx5IGFuZCB1bnNldCB0aGUgdGFyZ2V0IGVsZW1lbnQgcmVmZXJlbmNlIHNvIHRoYXQgdGhlIHN1YnNlcXVlbnQgY2xpY2sgd2lsbCBiZSBhbGxvd2VkIHRocm91Z2guXG5cdFx0XHQvLyBDYXNlIDI6IFdpdGhvdXQgdGhpcyBleGNlcHRpb24gZm9yIGlucHV0IGVsZW1lbnRzIHRhcHBlZCB3aGVuIHRoZSBkb2N1bWVudCBpcyBjb250YWluZWQgaW4gYW4gaWZyYW1lLCB0aGVuIGFueSBpbnB1dHRlZCB0ZXh0IHdvbid0IGJlIHZpc2libGUgZXZlbiB0aG91Z2ggdGhlIHZhbHVlIGF0dHJpYnV0ZSBpcyB1cGRhdGVkIGFzIHRoZSB1c2VyIHR5cGVzIChpc3N1ZSAjMzcpLlxuXHRcdFx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0cmFja2luZ0NsaWNrU3RhcnQpID4gMTAwIHx8IChkZXZpY2VJc0lPUyAmJiB3aW5kb3cudG9wICE9PSB3aW5kb3cgJiYgdGFyZ2V0VGFnTmFtZSA9PT0gJ2lucHV0JykpIHtcblx0XHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmZvY3VzKHRhcmdldEVsZW1lbnQpO1xuXHRcdFx0dGhpcy5zZW5kQ2xpY2sodGFyZ2V0RWxlbWVudCwgZXZlbnQpO1xuXG5cdFx0XHQvLyBTZWxlY3QgZWxlbWVudHMgbmVlZCB0aGUgZXZlbnQgdG8gZ28gdGhyb3VnaCBvbiBpT1MgNCwgb3RoZXJ3aXNlIHRoZSBzZWxlY3RvciBtZW51IHdvbid0IG9wZW4uXG5cdFx0XHQvLyBBbHNvIHRoaXMgYnJlYWtzIG9wZW5pbmcgc2VsZWN0cyB3aGVuIFZvaWNlT3ZlciBpcyBhY3RpdmUgb24gaU9TNiwgaU9TNyAoYW5kIHBvc3NpYmx5IG90aGVycylcblx0XHRcdGlmICghZGV2aWNlSXNJT1M0IHx8IHRhcmdldFRhZ05hbWUgIT09ICdzZWxlY3QnKSB7XG5cdFx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAoZGV2aWNlSXNJT1MgJiYgIWRldmljZUlzSU9TNCkge1xuXG5cdFx0XHQvLyBEb24ndCBzZW5kIGEgc3ludGhldGljIGNsaWNrIGV2ZW50IGlmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjb250YWluZWQgd2l0aGluIGEgcGFyZW50IGxheWVyIHRoYXQgd2FzIHNjcm9sbGVkXG5cdFx0XHQvLyBhbmQgdGhpcyB0YXAgaXMgYmVpbmcgdXNlZCB0byBzdG9wIHRoZSBzY3JvbGxpbmcgKHVzdWFsbHkgaW5pdGlhdGVkIGJ5IGEgZmxpbmcgLSBpc3N1ZSAjNDIpLlxuXHRcdFx0c2Nyb2xsUGFyZW50ID0gdGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XG5cdFx0XHRpZiAoc2Nyb2xsUGFyZW50ICYmIHNjcm9sbFBhcmVudC5mYXN0Q2xpY2tMYXN0U2Nyb2xsVG9wICE9PSBzY3JvbGxQYXJlbnQuc2Nyb2xsVG9wKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFByZXZlbnQgdGhlIGFjdHVhbCBjbGljayBmcm9tIGdvaW5nIHRob3VnaCAtIHVubGVzcyB0aGUgdGFyZ2V0IG5vZGUgaXMgbWFya2VkIGFzIHJlcXVpcmluZ1xuXHRcdC8vIHJlYWwgY2xpY2tzIG9yIGlmIGl0IGlzIGluIHRoZSB3aGl0ZWxpc3QgaW4gd2hpY2ggY2FzZSBvbmx5IG5vbi1wcm9ncmFtbWF0aWMgY2xpY2tzIGFyZSBwZXJtaXR0ZWQuXG5cdFx0aWYgKCF0aGlzLm5lZWRzQ2xpY2sodGFyZ2V0RWxlbWVudCkpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLnNlbmRDbGljayh0YXJnZXRFbGVtZW50LCBldmVudCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIE9uIHRvdWNoIGNhbmNlbCwgc3RvcCB0cmFja2luZyB0aGUgY2xpY2suXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoQ2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgbW91c2UgZXZlbnRzIHdoaWNoIHNob3VsZCBiZSBwZXJtaXR0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5vbk1vdXNlID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuXHRcdC8vIElmIGEgdGFyZ2V0IGVsZW1lbnQgd2FzIG5ldmVyIHNldCAoYmVjYXVzZSBhIHRvdWNoIGV2ZW50IHdhcyBuZXZlciBmaXJlZCkgYWxsb3cgdGhlIGV2ZW50XG5cdFx0aWYgKCF0aGlzLnRhcmdldEVsZW1lbnQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGlmIChldmVudC5mb3J3YXJkZWRUb3VjaEV2ZW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBQcm9ncmFtbWF0aWNhbGx5IGdlbmVyYXRlZCBldmVudHMgdGFyZ2V0aW5nIGEgc3BlY2lmaWMgZWxlbWVudCBzaG91bGQgYmUgcGVybWl0dGVkXG5cdFx0aWYgKCFldmVudC5jYW5jZWxhYmxlKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBEZXJpdmUgYW5kIGNoZWNrIHRoZSB0YXJnZXQgZWxlbWVudCB0byBzZWUgd2hldGhlciB0aGUgbW91c2UgZXZlbnQgbmVlZHMgdG8gYmUgcGVybWl0dGVkO1xuXHRcdC8vIHVubGVzcyBleHBsaWNpdGx5IGVuYWJsZWQsIHByZXZlbnQgbm9uLXRvdWNoIGNsaWNrIGV2ZW50cyBmcm9tIHRyaWdnZXJpbmcgYWN0aW9ucyxcblx0XHQvLyB0byBwcmV2ZW50IGdob3N0L2RvdWJsZWNsaWNrcy5cblx0XHRpZiAoIXRoaXMubmVlZHNDbGljayh0aGlzLnRhcmdldEVsZW1lbnQpIHx8IHRoaXMuY2FuY2VsTmV4dENsaWNrKSB7XG5cblx0XHRcdC8vIFByZXZlbnQgYW55IHVzZXItYWRkZWQgbGlzdGVuZXJzIGRlY2xhcmVkIG9uIEZhc3RDbGljayBlbGVtZW50IGZyb20gYmVpbmcgZmlyZWQuXG5cdFx0XHRpZiAoZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB7XG5cdFx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBQYXJ0IG9mIHRoZSBoYWNrIGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgRXZlbnQjc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIChlLmcuIEFuZHJvaWQgMilcblx0XHRcdFx0ZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2FuY2VsIHRoZSBldmVudFxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlIG1vdXNlIGV2ZW50IGlzIHBlcm1pdHRlZCwgcmV0dXJuIHRydWUgZm9yIHRoZSBhY3Rpb24gdG8gZ28gdGhyb3VnaC5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBPbiBhY3R1YWwgY2xpY2tzLCBkZXRlcm1pbmUgd2hldGhlciB0aGlzIGlzIGEgdG91Y2gtZ2VuZXJhdGVkIGNsaWNrLCBhIGNsaWNrIGFjdGlvbiBvY2N1cnJpbmdcblx0ICogbmF0dXJhbGx5IGFmdGVyIGEgZGVsYXkgYWZ0ZXIgYSB0b3VjaCAod2hpY2ggbmVlZHMgdG8gYmUgY2FuY2VsbGVkIHRvIGF2b2lkIGR1cGxpY2F0aW9uKSwgb3Jcblx0ICogYW4gYWN0dWFsIGNsaWNrIHdoaWNoIHNob3VsZCBiZSBwZXJtaXR0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgcGVybWl0dGVkO1xuXG5cdFx0Ly8gSXQncyBwb3NzaWJsZSBmb3IgYW5vdGhlciBGYXN0Q2xpY2stbGlrZSBsaWJyYXJ5IGRlbGl2ZXJlZCB3aXRoIHRoaXJkLXBhcnR5IGNvZGUgdG8gZmlyZSBhIGNsaWNrIGV2ZW50IGJlZm9yZSBGYXN0Q2xpY2sgZG9lcyAoaXNzdWUgIzQ0KS4gSW4gdGhhdCBjYXNlLCBzZXQgdGhlIGNsaWNrLXRyYWNraW5nIGZsYWcgYmFjayB0byBmYWxzZSBhbmQgcmV0dXJuIGVhcmx5LiBUaGlzIHdpbGwgY2F1c2Ugb25Ub3VjaEVuZCB0byByZXR1cm4gZWFybHkuXG5cdFx0aWYgKHRoaXMudHJhY2tpbmdDbGljaykge1xuXHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gVmVyeSBvZGQgYmVoYXZpb3VyIG9uIGlPUyAoaXNzdWUgIzE4KTogaWYgYSBzdWJtaXQgZWxlbWVudCBpcyBwcmVzZW50IGluc2lkZSBhIGZvcm0gYW5kIHRoZSB1c2VyIGhpdHMgZW50ZXIgaW4gdGhlIGlPUyBzaW11bGF0b3Igb3IgY2xpY2tzIHRoZSBHbyBidXR0b24gb24gdGhlIHBvcC11cCBPUyBrZXlib2FyZCB0aGUgYSBraW5kIG9mICdmYWtlJyBjbGljayBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCB3aXRoIHRoZSBzdWJtaXQtdHlwZSBpbnB1dCBlbGVtZW50IGFzIHRoZSB0YXJnZXQuXG5cdFx0aWYgKGV2ZW50LnRhcmdldC50eXBlID09PSAnc3VibWl0JyAmJiBldmVudC5kZXRhaWwgPT09IDApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHBlcm1pdHRlZCA9IHRoaXMub25Nb3VzZShldmVudCk7XG5cblx0XHQvLyBPbmx5IHVuc2V0IHRhcmdldEVsZW1lbnQgaWYgdGhlIGNsaWNrIGlzIG5vdCBwZXJtaXR0ZWQuIFRoaXMgd2lsbCBlbnN1cmUgdGhhdCB0aGUgY2hlY2sgZm9yICF0YXJnZXRFbGVtZW50IGluIG9uTW91c2UgZmFpbHMgYW5kIHRoZSBicm93c2VyJ3MgY2xpY2sgZG9lc24ndCBnbyB0aHJvdWdoLlxuXHRcdGlmICghcGVybWl0dGVkKSB7XG5cdFx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vIElmIGNsaWNrcyBhcmUgcGVybWl0dGVkLCByZXR1cm4gdHJ1ZSBmb3IgdGhlIGFjdGlvbiB0byBnbyB0aHJvdWdoLlxuXHRcdHJldHVybiBwZXJtaXR0ZWQ7XG5cdH07XG5cblxuXHQvKipcblx0ICogUmVtb3ZlIGFsbCBGYXN0Q2xpY2sncyBldmVudCBsaXN0ZW5lcnMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGxheWVyID0gdGhpcy5sYXllcjtcblxuXHRcdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0fVxuXG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRydWUpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUsIGZhbHNlKTtcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCwgZmFsc2UpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoQ2FuY2VsLCBmYWxzZSk7XG5cdH07XG5cblxuXHQvKipcblx0ICogQ2hlY2sgd2hldGhlciBGYXN0Q2xpY2sgaXMgbmVlZGVkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cblx0ICovXG5cdEZhc3RDbGljay5ub3ROZWVkZWQgPSBmdW5jdGlvbihsYXllcikge1xuXHRcdHZhciBtZXRhVmlld3BvcnQ7XG5cdFx0dmFyIGNocm9tZVZlcnNpb247XG5cdFx0dmFyIGJsYWNrYmVycnlWZXJzaW9uO1xuXHRcdHZhciBmaXJlZm94VmVyc2lvbjtcblxuXHRcdC8vIERldmljZXMgdGhhdCBkb24ndCBzdXBwb3J0IHRvdWNoIGRvbid0IG5lZWQgRmFzdENsaWNrXG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cub250b3VjaHN0YXJ0ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hyb21lIHZlcnNpb24gLSB6ZXJvIGZvciBvdGhlciBicm93c2Vyc1xuXHRcdGNocm9tZVZlcnNpb24gPSArKC9DaHJvbWVcXC8oWzAtOV0rKS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbLDBdKVsxXTtcblxuXHRcdGlmIChjaHJvbWVWZXJzaW9uKSB7XG5cblx0XHRcdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xuXG5cdFx0XHRcdGlmIChtZXRhVmlld3BvcnQpIHtcblx0XHRcdFx0XHQvLyBDaHJvbWUgb24gQW5kcm9pZCB3aXRoIHVzZXItc2NhbGFibGU9XCJub1wiIGRvZXNuJ3QgbmVlZCBGYXN0Q2xpY2sgKGlzc3VlICM4OSlcblx0XHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0LmNvbnRlbnQuaW5kZXhPZigndXNlci1zY2FsYWJsZT1ubycpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIENocm9tZSAzMiBhbmQgYWJvdmUgd2l0aCB3aWR0aD1kZXZpY2Utd2lkdGggb3IgbGVzcyBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRcdFx0XHRcdGlmIChjaHJvbWVWZXJzaW9uID4gMzEgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoIDw9IHdpbmRvdy5vdXRlcldpZHRoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0Ly8gQ2hyb21lIGRlc2t0b3AgZG9lc24ndCBuZWVkIEZhc3RDbGljayAoaXNzdWUgIzE1KVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGRldmljZUlzQmxhY2tCZXJyeTEwKSB7XG5cdFx0XHRibGFja2JlcnJ5VmVyc2lvbiA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1ZlcnNpb25cXC8oWzAtOV0qKVxcLihbMC05XSopLyk7XG5cblx0XHRcdC8vIEJsYWNrQmVycnkgMTAuMysgZG9lcyBub3QgcmVxdWlyZSBGYXN0Y2xpY2sgbGlicmFyeS5cblx0XHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mdGxhYnMvZmFzdGNsaWNrL2lzc3Vlcy8yNTFcblx0XHRcdGlmIChibGFja2JlcnJ5VmVyc2lvblsxXSA+PSAxMCAmJiBibGFja2JlcnJ5VmVyc2lvblsyXSA+PSAzKSB7XG5cdFx0XHRcdG1ldGFWaWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT12aWV3cG9ydF0nKTtcblxuXHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0KSB7XG5cdFx0XHRcdFx0Ly8gdXNlci1zY2FsYWJsZT1ubyBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxuXHRcdFx0XHRcdGlmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gd2lkdGg9ZGV2aWNlLXdpZHRoIChvciBsZXNzIHRoYW4gZGV2aWNlLXdpZHRoKSBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxuXHRcdFx0XHRcdGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGggPD0gd2luZG93Lm91dGVyV2lkdGgpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIElFMTAgd2l0aCAtbXMtdG91Y2gtYWN0aW9uOiBub25lIG9yIG1hbmlwdWxhdGlvbiwgd2hpY2ggZGlzYWJsZXMgZG91YmxlLXRhcC10by16b29tIChpc3N1ZSAjOTcpXG5cdFx0aWYgKGxheWVyLnN0eWxlLm1zVG91Y2hBY3Rpb24gPT09ICdub25lJyB8fCBsYXllci5zdHlsZS50b3VjaEFjdGlvbiA9PT0gJ21hbmlwdWxhdGlvbicpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIEZpcmVmb3ggdmVyc2lvbiAtIHplcm8gZm9yIG90aGVyIGJyb3dzZXJzXG5cdFx0ZmlyZWZveFZlcnNpb24gPSArKC9GaXJlZm94XFwvKFswLTldKykvLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgWywwXSlbMV07XG5cblx0XHRpZiAoZmlyZWZveFZlcnNpb24gPj0gMjcpIHtcblx0XHRcdC8vIEZpcmVmb3ggMjcrIGRvZXMgbm90IGhhdmUgdGFwIGRlbGF5IGlmIHRoZSBjb250ZW50IGlzIG5vdCB6b29tYWJsZSAtIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTkyMjg5NlxuXG5cdFx0XHRtZXRhVmlld3BvcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9dmlld3BvcnRdJyk7XG5cdFx0XHRpZiAobWV0YVZpZXdwb3J0ICYmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA8PSB3aW5kb3cub3V0ZXJXaWR0aCkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSUUxMTogcHJlZml4ZWQgLW1zLXRvdWNoLWFjdGlvbiBpcyBubyBsb25nZXIgc3VwcG9ydGVkIGFuZCBpdCdzIHJlY29tZW5kZWQgdG8gdXNlIG5vbi1wcmVmaXhlZCB2ZXJzaW9uXG5cdFx0Ly8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L3dpbmRvd3MvYXBwcy9IaDc2NzMxMy5hc3B4XG5cdFx0aWYgKGxheWVyLnN0eWxlLnRvdWNoQWN0aW9uID09PSAnbm9uZScgfHwgbGF5ZXIuc3R5bGUudG91Y2hBY3Rpb24gPT09ICdtYW5pcHVsYXRpb24nKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblxuXHQvKipcblx0ICogRmFjdG9yeSBtZXRob2QgZm9yIGNyZWF0aW5nIGEgRmFzdENsaWNrIG9iamVjdFxuXHQgKlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cblx0ICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcblx0ICovXG5cdEZhc3RDbGljay5hdHRhY2ggPSBmdW5jdGlvbihsYXllciwgb3B0aW9ucykge1xuXHRcdHJldHVybiBuZXcgRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKTtcblx0fTtcblxuXG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cblx0XHQvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cdFx0ZGVmaW5lKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIEZhc3RDbGljaztcblx0XHR9KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gRmFzdENsaWNrLmF0dGFjaDtcblx0XHRtb2R1bGUuZXhwb3J0cy5GYXN0Q2xpY2sgPSBGYXN0Q2xpY2s7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LkZhc3RDbGljayA9IEZhc3RDbGljaztcblx0fVxufSgpKTtcbiIsIi8vIEZvciBAb25zZW51aS9jdXN0b20tZWxlbWVudHNcbmlmICh3aW5kb3cuY3VzdG9tRWxlbWVudHMpIHsgLy8gZXZlbiBpZiBuYXRpdmUgQ0UxIGltcGwgZXhpc3RzLCB1c2UgcG9seWZpbGxcbiAgICB3aW5kb3cuY3VzdG9tRWxlbWVudHMuZm9yY2VQb2x5ZmlsbCA9IHRydWU7XG59XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi41LjYnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgU1JDID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgJHRvU3RyaW5nID0gRnVuY3Rpb25bVE9fU1RSSU5HXTtcbnZhciBUUEwgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWwsIHNhZmUpIHtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmIChPW2tleV0gPT09IHZhbCkgcmV0dXJuO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoIXNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKE9ba2V5XSkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCJ2YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIGdPUEQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZ09QRCA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0lPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBnT1BEKE8sIFApO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZURlc2MoIXBJRS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTtcbiIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgY2hlY2sgPSBmdW5jdGlvbiAoTywgcHJvdG8pIHtcbiAgYW5PYmplY3QoTyk7XG4gIGlmICghaXNPYmplY3QocHJvdG8pICYmIHByb3RvICE9PSBudWxsKSB0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbiAodGVzdCwgYnVnZ3ksIHNldCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi9fY3R4JykoRnVuY3Rpb24uY2FsbCwgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgYnVnZ3kgPSB0cnVlOyB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pIHtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZiAoYnVnZ3kpIE8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIE87XG4gICAgICB9O1xuICAgIH0oe30sIGZhbHNlKSA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTtcbiIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7IHNldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXQgfSk7XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LnNldFByb3RvdHlwZU9mO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAxOCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQVJHID0gY29mKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciB0ZXN0ID0ge307XG50ZXN0W3JlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXSA9ICd6JztcbmlmICh0ZXN0ICsgJycgIT0gJ1tvYmplY3Qgel0nKSB7XG4gIHJlcXVpcmUoJy4vX3JlZGVmaW5lJykoT2JqZWN0LnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdbb2JqZWN0ICcgKyBjbGFzc29mKHRoaXMpICsgJ10nO1xuICB9LCB0cnVlKTtcbn1cbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRPX1NUUklORykge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIHBvcykge1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xuICAgIHZhciBpID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIGwgPSBzLmxlbmd0aDtcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAoaSA8IDAgfHwgaSA+PSBsKSByZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbiAoaXRlcmF0ZWQpIHtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBpbmRleCA9IHRoaXMuX2k7XG4gIHZhciBwb2ludDtcbiAgaWYgKGluZGV4ID49IE8ubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuIiwiLy8gMjIuMS4zLjMxIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxudmFyIFVOU0NPUEFCTEVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3Vuc2NvcGFibGVzJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcbmlmIChBcnJheVByb3RvW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpIHJlcXVpcmUoJy4vX2hpZGUnKShBcnJheVByb3RvLCBVTlNDT1BBQkxFUywge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRvbmUsIHZhbHVlKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKTtcbnZhciBzdGVwID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIga2luZCA9IHRoaXMuX2s7XG4gIHZhciBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYgKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKSB7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTtcbiIsInZhciAkaXRlcmF0b3JzID0gcmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciBJVEVSQVRPUiA9IHdrcygnaXRlcmF0b3InKTtcbnZhciBUT19TVFJJTkdfVEFHID0gd2tzKCd0b1N0cmluZ1RhZycpO1xudmFyIEFycmF5VmFsdWVzID0gSXRlcmF0b3JzLkFycmF5O1xuXG52YXIgRE9NSXRlcmFibGVzID0ge1xuICBDU1NSdWxlTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIENTU1N0eWxlRGVjbGFyYXRpb246IGZhbHNlLFxuICBDU1NWYWx1ZUxpc3Q6IGZhbHNlLFxuICBDbGllbnRSZWN0TGlzdDogZmFsc2UsXG4gIERPTVJlY3RMaXN0OiBmYWxzZSxcbiAgRE9NU3RyaW5nTGlzdDogZmFsc2UsXG4gIERPTVRva2VuTGlzdDogdHJ1ZSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IGZhbHNlLFxuICBGaWxlTGlzdDogZmFsc2UsXG4gIEhUTUxBbGxDb2xsZWN0aW9uOiBmYWxzZSxcbiAgSFRNTENvbGxlY3Rpb246IGZhbHNlLFxuICBIVE1MRm9ybUVsZW1lbnQ6IGZhbHNlLFxuICBIVE1MU2VsZWN0RWxlbWVudDogZmFsc2UsXG4gIE1lZGlhTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIE1pbWVUeXBlQXJyYXk6IGZhbHNlLFxuICBOYW1lZE5vZGVNYXA6IGZhbHNlLFxuICBOb2RlTGlzdDogdHJ1ZSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogZmFsc2UsXG4gIFBsdWdpbjogZmFsc2UsXG4gIFBsdWdpbkFycmF5OiBmYWxzZSxcbiAgU1ZHTGVuZ3RoTGlzdDogZmFsc2UsXG4gIFNWR051bWJlckxpc3Q6IGZhbHNlLFxuICBTVkdQYXRoU2VnTGlzdDogZmFsc2UsXG4gIFNWR1BvaW50TGlzdDogZmFsc2UsXG4gIFNWR1N0cmluZ0xpc3Q6IGZhbHNlLFxuICBTVkdUcmFuc2Zvcm1MaXN0OiBmYWxzZSxcbiAgU291cmNlQnVmZmVyTGlzdDogZmFsc2UsXG4gIFN0eWxlU2hlZXRMaXN0OiB0cnVlLCAvLyBUT0RPOiBOb3Qgc3BlYyBjb21wbGlhbnQsIHNob3VsZCBiZSBmYWxzZS5cbiAgVGV4dFRyYWNrQ3VlTGlzdDogZmFsc2UsXG4gIFRleHRUcmFja0xpc3Q6IGZhbHNlLFxuICBUb3VjaExpc3Q6IGZhbHNlXG59O1xuXG5mb3IgKHZhciBjb2xsZWN0aW9ucyA9IGdldEtleXMoRE9NSXRlcmFibGVzKSwgaSA9IDA7IGkgPCBjb2xsZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICB2YXIgTkFNRSA9IGNvbGxlY3Rpb25zW2ldO1xuICB2YXIgZXhwbGljaXQgPSBET01JdGVyYWJsZXNbTkFNRV07XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgcHJvdG8gPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICB2YXIga2V5O1xuICBpZiAocHJvdG8pIHtcbiAgICBpZiAoIXByb3RvW0lURVJBVE9SXSkgaGlkZShwcm90bywgSVRFUkFUT1IsIEFycmF5VmFsdWVzKTtcbiAgICBpZiAoIXByb3RvW1RPX1NUUklOR19UQUddKSBoaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgICBJdGVyYXRvcnNbTkFNRV0gPSBBcnJheVZhbHVlcztcbiAgICBpZiAoZXhwbGljaXQpIGZvciAoa2V5IGluICRpdGVyYXRvcnMpIGlmICghcHJvdG9ba2V5XSkgcmVkZWZpbmUocHJvdG8sIGtleSwgJGl0ZXJhdG9yc1trZXldLCB0cnVlKTtcbiAgfVxufVxuIiwidmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBzYWZlKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBzcmNba2V5XSwgc2FmZSk7XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCkge1xuICBpZiAoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xudmFyIEJSRUFLID0ge307XG52YXIgUkVUVVJOID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1IpIHtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpO1xuICB2YXIgZiA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKTtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYgKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZiAoaXNBcnJheUl0ZXIoaXRlckZuKSkgZm9yIChsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTspIHtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIEMgPSBnbG9iYWxbS0VZXTtcbiAgaWYgKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pIGRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59O1xuIiwidmFyIE1FVEEgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgc2V0RGVzYyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaWQgPSAwO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uIChpdCkge1xuICBzZXREZXNjKGl0LCBNRVRBLCB7IHZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSB9KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmICghaGFzKGl0LCBNRVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIG9iamVjdCBJRFxuICB9IHJldHVybiBpdFtNRVRBXS5pO1xufTtcbnZhciBnZXRXZWFrID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgaWYgKCFoYXMoaXQsIE1FVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiB0cnVlO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpIHNldE1ldGEoaXQpO1xuICByZXR1cm4gaXQ7XG59O1xudmFyIG1ldGEgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgS0VZOiBNRVRBLFxuICBORUVEOiBmYWxzZSxcbiAgZmFzdEtleTogZmFzdEtleSxcbiAgZ2V0V2VhazogZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgVFlQRSkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSB8fCBpdC5fdCAhPT0gVFlQRSkgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciAkaXRlckRlZmluZSA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIHNldFNwZWNpZXMgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBmYXN0S2V5ID0gcmVxdWlyZSgnLi9fbWV0YScpLmZhc3RLZXk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0laRSA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJztcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24gKHRoYXQsIGtleSkge1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpO1xuICB2YXIgZW50cnk7XG4gIGlmIChpbmRleCAhPT0gJ0YnKSByZXR1cm4gdGhhdC5faVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IgKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubikge1xuICAgIGlmIChlbnRyeS5rID09IGtleSkgcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uICh3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKSB7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uICh0aGF0LCBpdGVyYWJsZSkge1xuICAgICAgYW5JbnN0YW5jZSh0aGF0LCBDLCBOQU1FLCAnX2knKTtcbiAgICAgIHRoYXQuX3QgPSBOQU1FOyAgICAgICAgIC8vIGNvbGxlY3Rpb24gdHlwZVxuICAgICAgdGhhdC5faSA9IGNyZWF0ZShudWxsKTsgLy8gaW5kZXhcbiAgICAgIHRoYXQuX2YgPSB1bmRlZmluZWQ7ICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAvLyBzaXplXG4gICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIGZvciAodmFyIHRoYXQgPSB2YWxpZGF0ZSh0aGlzLCBOQU1FKSwgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubikge1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmIChlbnRyeS5wKSBlbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciB0aGF0ID0gdmFsaWRhdGUodGhpcywgTkFNRSk7XG4gICAgICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkubjtcbiAgICAgICAgICB2YXIgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYgKHByZXYpIHByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYgKG5leHQpIG5leHQucCA9IHByZXY7XG4gICAgICAgICAgaWYgKHRoYXQuX2YgPT0gZW50cnkpIHRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmICh0aGF0Ll9sID09IGVudHJ5KSB0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoYXQgPSB1bmRlZmluZWQgKi8pIHtcbiAgICAgICAgdmFsaWRhdGUodGhpcywgTkFNRSk7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKTtcbiAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICB3aGlsZSAoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKSB7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZSAoZW50cnkgJiYgZW50cnkucikgZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodmFsaWRhdGUodGhpcywgTkFNRSksIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKERFU0NSSVBUT1JTKSBkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHRoaXMsIE5BTUUpW1NJWkVdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uICh0aGF0LCBrZXksIHZhbHVlKSB7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICB2YXIgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZiAoIXRoYXQuX2YpIHRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmIChwcmV2KSBwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYgKGluZGV4ICE9PSAnRicpIHRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uIChDLCBOQU1FLCBJU19NQVApIHtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24gKGl0ZXJhdGVkLCBraW5kKSB7XG4gICAgICB0aGlzLl90ID0gdmFsaWRhdGUoaXRlcmF0ZWQsIE5BTUUpOyAvLyB0YXJnZXRcbiAgICAgIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAgICAgIC8vIGtpbmRcbiAgICAgIHRoaXMuX2wgPSB1bmRlZmluZWQ7ICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIGtpbmQgPSB0aGF0Ll9rO1xuICAgICAgdmFyIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnIpIGVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZiAoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSkge1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICB0aGF0Ll90ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RlcCgxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcbiAgICAgIGlmIChraW5kID09ICdrZXlzJykgcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XG4gICAgICBpZiAoa2luZCA9PSAndmFsdWVzJykgcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRoYXQsIHRhcmdldCwgQykge1xuICB2YXIgUyA9IHRhcmdldC5jb25zdHJ1Y3RvcjtcbiAgdmFyIFA7XG4gIGlmIChTICE9PSBDICYmIHR5cGVvZiBTID09ICdmdW5jdGlvbicgJiYgKFAgPSBTLnByb3RvdHlwZSkgIT09IEMucHJvdG90eXBlICYmIGlzT2JqZWN0KFApICYmIHNldFByb3RvdHlwZU9mKSB7XG4gICAgc2V0UHJvdG90eXBlT2YodGhhdCwgUCk7XG4gIH0gcmV0dXJuIHRoYXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgJGl0ZXJEZXRlY3QgPSByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBpbmhlcml0SWZSZXF1aXJlZCA9IHJlcXVpcmUoJy4vX2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspIHtcbiAgdmFyIEJhc2UgPSBnbG9iYWxbTkFNRV07XG4gIHZhciBDID0gQmFzZTtcbiAgdmFyIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJztcbiAgdmFyIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZTtcbiAgdmFyIE8gPSB7fTtcbiAgdmFyIGZpeE1ldGhvZCA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgICB2YXIgZm4gPSBwcm90b1tLRVldO1xuICAgIHJlZGVmaW5lKHByb3RvLCBLRVksXG4gICAgICBLRVkgPT0gJ2RlbGV0ZScgPyBmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2hhcycgPyBmdW5jdGlvbiBoYXMoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2dldCcgPyBmdW5jdGlvbiBnZXQoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyB1bmRlZmluZWQgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdhZGQnID8gZnVuY3Rpb24gYWRkKGEpIHsgZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpOyByZXR1cm4gdGhpczsgfVxuICAgICAgICA6IGZ1bmN0aW9uIHNldChhLCBiKSB7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhLCBiKTsgcmV0dXJuIHRoaXM7IH1cbiAgICApO1xuICB9O1xuICBpZiAodHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKSB7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBDKCk7XG4gICAgLy8gZWFybHkgaW1wbGVtZW50YXRpb25zIG5vdCBzdXBwb3J0cyBjaGFpbmluZ1xuICAgIHZhciBIQVNOVF9DSEFJTklORyA9IGluc3RhbmNlW0FEREVSXShJU19XRUFLID8ge30gOiAtMCwgMSkgIT0gaW5zdGFuY2U7XG4gICAgLy8gVjggfiAgQ2hyb21pdW0gNDAtIHdlYWstY29sbGVjdGlvbnMgdGhyb3dzIG9uIHByaW1pdGl2ZXMsIGJ1dCBzaG91bGQgcmV0dXJuIGZhbHNlXG4gICAgdmFyIFRIUk9XU19PTl9QUklNSVRJVkVTID0gZmFpbHMoZnVuY3Rpb24gKCkgeyBpbnN0YW5jZS5oYXMoMSk7IH0pO1xuICAgIC8vIG1vc3QgZWFybHkgaW1wbGVtZW50YXRpb25zIGRvZXNuJ3Qgc3VwcG9ydHMgaXRlcmFibGVzLCBtb3N0IG1vZGVybiAtIG5vdCBjbG9zZSBpdCBjb3JyZWN0bHlcbiAgICB2YXIgQUNDRVBUX0lURVJBQkxFUyA9ICRpdGVyRGV0ZWN0KGZ1bmN0aW9uIChpdGVyKSB7IG5ldyBDKGl0ZXIpOyB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAvLyBmb3IgZWFybHkgaW1wbGVtZW50YXRpb25zIC0wIGFuZCArMCBub3QgdGhlIHNhbWVcbiAgICB2YXIgQlVHR1lfWkVSTyA9ICFJU19XRUFLICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFY4IH4gQ2hyb21pdW0gNDItIGZhaWxzIG9ubHkgd2l0aCA1KyBlbGVtZW50c1xuICAgICAgdmFyICRpbnN0YW5jZSA9IG5ldyBDKCk7XG4gICAgICB2YXIgaW5kZXggPSA1O1xuICAgICAgd2hpbGUgKGluZGV4LS0pICRpbnN0YW5jZVtBRERFUl0oaW5kZXgsIGluZGV4KTtcbiAgICAgIHJldHVybiAhJGluc3RhbmNlLmhhcygtMCk7XG4gICAgfSk7XG4gICAgaWYgKCFBQ0NFUFRfSVRFUkFCTEVTKSB7XG4gICAgICBDID0gd3JhcHBlcihmdW5jdGlvbiAodGFyZ2V0LCBpdGVyYWJsZSkge1xuICAgICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSk7XG4gICAgICAgIHZhciB0aGF0ID0gaW5oZXJpdElmUmVxdWlyZWQobmV3IEJhc2UoKSwgdGFyZ2V0LCBDKTtcbiAgICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH0pO1xuICAgICAgQy5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgIHByb3RvLmNvbnN0cnVjdG9yID0gQztcbiAgICB9XG4gICAgaWYgKFRIUk9XU19PTl9QUklNSVRJVkVTIHx8IEJVR0dZX1pFUk8pIHtcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xuICAgICAgSVNfTUFQICYmIGZpeE1ldGhvZCgnZ2V0Jyk7XG4gICAgfVxuICAgIGlmIChCVUdHWV9aRVJPIHx8IEhBU05UX0NIQUlOSU5HKSBmaXhNZXRob2QoQURERVIpO1xuICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgc2hvdWxkIG5vdCBjb250YWlucyAuY2xlYXIgbWV0aG9kXG4gICAgaWYgKElTX1dFQUsgJiYgcHJvdG8uY2xlYXIpIGRlbGV0ZSBwcm90by5jbGVhcjtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqIChDICE9IEJhc2UpLCBPKTtcblxuICBpZiAoIUlTX1dFQUspIGNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBTRVQgPSAnU2V0JztcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoU0VULCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih2YWxpZGF0ZSh0aGlzLCBTRVQpLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7XG4iLCJ2YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlciwgSVRFUkFUT1IpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3JPZihpdGVyLCBmYWxzZSwgcmVzdWx0LnB1c2gsIHJlc3VsdCwgSVRFUkFUT1IpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIGZyb20gPSByZXF1aXJlKCcuL19hcnJheS1mcm9tLWl0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChOQU1FKSB7XG4gIHJldHVybiBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgaWYgKGNsYXNzb2YodGhpcykgIT0gTkFNRSkgdGhyb3cgVHlwZUVycm9yKE5BTUUgKyBcIiN0b0pTT04gaXNuJ3QgZ2VuZXJpY1wiKTtcbiAgICByZXR1cm4gZnJvbSh0aGlzKTtcbiAgfTtcbn07XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1NldCcsIHsgdG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnU2V0JykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDT0xMRUNUSU9OKSB7XG4gICRleHBvcnQoJGV4cG9ydC5TLCBDT0xMRUNUSU9OLCB7IG9mOiBmdW5jdGlvbiBvZigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgQSA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIHdoaWxlIChsZW5ndGgtLSkgQVtsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgcmV0dXJuIG5ldyB0aGlzKEEpO1xuICB9IH0pO1xufTtcbiIsIi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS8jc2VjLXNldC5vZlxucmVxdWlyZSgnLi9fc2V0LWNvbGxlY3Rpb24tb2YnKSgnU2V0Jyk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDT0xMRUNUSU9OKSB7XG4gICRleHBvcnQoJGV4cG9ydC5TLCBDT0xMRUNUSU9OLCB7IGZyb206IGZ1bmN0aW9uIGZyb20oc291cmNlIC8qICwgbWFwRm4sIHRoaXNBcmcgKi8pIHtcbiAgICB2YXIgbWFwRm4gPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIG1hcHBpbmcsIEEsIG4sIGNiO1xuICAgIGFGdW5jdGlvbih0aGlzKTtcbiAgICBtYXBwaW5nID0gbWFwRm4gIT09IHVuZGVmaW5lZDtcbiAgICBpZiAobWFwcGluZykgYUZ1bmN0aW9uKG1hcEZuKTtcbiAgICBpZiAoc291cmNlID09IHVuZGVmaW5lZCkgcmV0dXJuIG5ldyB0aGlzKCk7XG4gICAgQSA9IFtdO1xuICAgIGlmIChtYXBwaW5nKSB7XG4gICAgICBuID0gMDtcbiAgICAgIGNiID0gY3R4KG1hcEZuLCBhcmd1bWVudHNbMl0sIDIpO1xuICAgICAgZm9yT2Yoc291cmNlLCBmYWxzZSwgZnVuY3Rpb24gKG5leHRJdGVtKSB7XG4gICAgICAgIEEucHVzaChjYihuZXh0SXRlbSwgbisrKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yT2Yoc291cmNlLCBmYWxzZSwgQS5wdXNoLCBBKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyB0aGlzKEEpO1xuICB9IH0pO1xufTtcbiIsIi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS8jc2VjLXNldC5mcm9tXG5yZXF1aXJlKCcuL19zZXQtY29sbGVjdGlvbi1mcm9tJykoJ1NldCcpO1xuIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnNldCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcuc2V0LnRvLWpzb24nKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3LnNldC5vZicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcuc2V0LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlNldDtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIE1BUCA9ICdNYXAnO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKShNQVAsIGZ1bmN0aW9uIChnZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpIHsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHZhbGlkYXRlKHRoaXMsIE1BUCksIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ01hcCcsIHsgdG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJykgfSk7XG4iLCIvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vI3NlYy1tYXAub2ZcbnJlcXVpcmUoJy4vX3NldC1jb2xsZWN0aW9uLW9mJykoJ01hcCcpO1xuIiwiLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9wcm9wb3NhbC1zZXRtYXAtb2Zmcm9tLyNzZWMtbWFwLmZyb21cbnJlcXVpcmUoJy4vX3NldC1jb2xsZWN0aW9uLWZyb20nKSgnTWFwJyk7XG4iLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYubWFwJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5tYXAudG8tanNvbicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLm9mJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5tYXAuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuTWFwO1xuIiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsKSkge1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmICh0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpIEMgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTtcbiIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsLCBsZW5ndGgpIHtcbiAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsKSkobGVuZ3RoKTtcbn07XG4iLCIvLyAwIC0+IEFycmF5I2ZvckVhY2hcbi8vIDEgLT4gQXJyYXkjbWFwXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxuLy8gMyAtPiBBcnJheSNzb21lXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XG4vLyA1IC0+IEFycmF5I2ZpbmRcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgYXNjID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRZUEUsICRjcmVhdGUpIHtcbiAgdmFyIElTX01BUCA9IFRZUEUgPT0gMTtcbiAgdmFyIElTX0ZJTFRFUiA9IFRZUEUgPT0gMjtcbiAgdmFyIElTX1NPTUUgPSBUWVBFID09IDM7XG4gIHZhciBJU19FVkVSWSA9IFRZUEUgPT0gNDtcbiAgdmFyIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDY7XG4gIHZhciBOT19IT0xFUyA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYO1xuICB2YXIgY3JlYXRlID0gJGNyZWF0ZSB8fCBhc2M7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQpIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgc2VsZiA9IElPYmplY3QoTyk7XG4gICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciByZXN1bHQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkO1xuICAgIHZhciB2YWwsIHJlcztcbiAgICBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpIHtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmIChUWVBFKSB7XG4gICAgICAgIGlmIChJU19NQVApIHJlc3VsdFtpbmRleF0gPSByZXM7ICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYgKHJlcykgc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmIChJU19FVkVSWSkgcmV0dXJuIGZhbHNlOyAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIGlmIChpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKSBUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIGdldFdlYWsgPSByZXF1aXJlKCcuL19tZXRhJykuZ2V0V2VhaztcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBjcmVhdGVBcnJheU1ldGhvZCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKTtcbnZhciAkaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgYXJyYXlGaW5kID0gY3JlYXRlQXJyYXlNZXRob2QoNSk7XG52YXIgYXJyYXlGaW5kSW5kZXggPSBjcmVhdGVBcnJheU1ldGhvZCg2KTtcbnZhciBpZCA9IDA7XG5cbi8vIGZhbGxiYWNrIGZvciB1bmNhdWdodCBmcm96ZW4ga2V5c1xudmFyIHVuY2F1Z2h0RnJvemVuU3RvcmUgPSBmdW5jdGlvbiAodGhhdCkge1xuICByZXR1cm4gdGhhdC5fbCB8fCAodGhhdC5fbCA9IG5ldyBVbmNhdWdodEZyb3plblN0b3JlKCkpO1xufTtcbnZhciBVbmNhdWdodEZyb3plblN0b3JlID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmEgPSBbXTtcbn07XG52YXIgZmluZFVuY2F1Z2h0RnJvemVuID0gZnVuY3Rpb24gKHN0b3JlLCBrZXkpIHtcbiAgcmV0dXJuIGFycmF5RmluZChzdG9yZS5hLCBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcbiAgfSk7XG59O1xuVW5jYXVnaHRGcm96ZW5TdG9yZS5wcm90b3R5cGUgPSB7XG4gIGdldDogZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBlbnRyeSA9IGZpbmRVbmNhdWdodEZyb3plbih0aGlzLCBrZXkpO1xuICAgIGlmIChlbnRyeSkgcmV0dXJuIGVudHJ5WzFdO1xuICB9LFxuICBoYXM6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gISFmaW5kVW5jYXVnaHRGcm96ZW4odGhpcywga2V5KTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHZhciBlbnRyeSA9IGZpbmRVbmNhdWdodEZyb3plbih0aGlzLCBrZXkpO1xuICAgIGlmIChlbnRyeSkgZW50cnlbMV0gPSB2YWx1ZTtcbiAgICBlbHNlIHRoaXMuYS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0sXG4gICdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGluZGV4ID0gYXJyYXlGaW5kSW5kZXgodGhpcy5hLCBmdW5jdGlvbiAoaXQpIHtcbiAgICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xuICAgIH0pO1xuICAgIGlmICh+aW5kZXgpIHRoaXMuYS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiAhIX5pbmRleDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbiAod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUikge1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll90ID0gTkFNRTsgICAgICAvLyBjb2xsZWN0aW9uIHR5cGVcbiAgICAgIHRoYXQuX2kgPSBpZCsrOyAgICAgIC8vIGNvbGxlY3Rpb24gaWRcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7IC8vIGxlYWsgc3RvcmUgZm9yIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RzXG4gICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjMuMy4yIFdlYWtNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy40LjMuMyBXZWFrU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KGtleSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrKGtleSk7XG4gICAgICAgIGlmIChkYXRhID09PSB0cnVlKSByZXR1cm4gdW5jYXVnaHRGcm96ZW5TdG9yZSh2YWxpZGF0ZSh0aGlzLCBOQU1FKSlbJ2RlbGV0ZSddKGtleSk7XG4gICAgICAgIHJldHVybiBkYXRhICYmICRoYXMoZGF0YSwgdGhpcy5faSkgJiYgZGVsZXRlIGRhdGFbdGhpcy5faV07XG4gICAgICB9LFxuICAgICAgLy8gMjMuMy4zLjQgV2Vha01hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjQuMy40IFdlYWtTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KGtleSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrKGtleSk7XG4gICAgICAgIGlmIChkYXRhID09PSB0cnVlKSByZXR1cm4gdW5jYXVnaHRGcm96ZW5TdG9yZSh2YWxpZGF0ZSh0aGlzLCBOQU1FKSkuaGFzKGtleSk7XG4gICAgICAgIHJldHVybiBkYXRhICYmICRoYXMoZGF0YSwgdGhpcy5faSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24gKHRoYXQsIGtleSwgdmFsdWUpIHtcbiAgICB2YXIgZGF0YSA9IGdldFdlYWsoYW5PYmplY3Qoa2V5KSwgdHJ1ZSk7XG4gICAgaWYgKGRhdGEgPT09IHRydWUpIHVuY2F1Z2h0RnJvemVuU3RvcmUodGhhdCkuc2V0KGtleSwgdmFsdWUpO1xuICAgIGVsc2UgZGF0YVt0aGF0Ll9pXSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGF0O1xuICB9LFxuICB1ZnN0b3JlOiB1bmNhdWdodEZyb3plblN0b3JlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGVhY2ggPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMCk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIG1ldGEgPSByZXF1aXJlKCcuL19tZXRhJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpO1xudmFyIHdlYWsgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXdlYWsnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBXRUFLX01BUCA9ICdXZWFrTWFwJztcbnZhciBnZXRXZWFrID0gbWV0YS5nZXRXZWFrO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGU7XG52YXIgdW5jYXVnaHRGcm96ZW5TdG9yZSA9IHdlYWsudWZzdG9yZTtcbnZhciB0bXAgPSB7fTtcbnZhciBJbnRlcm5hbE1hcDtcblxudmFyIHdyYXBwZXIgPSBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBXZWFrTWFwKCkge1xuICAgIHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpO1xuICB9O1xufTtcblxudmFyIG1ldGhvZHMgPSB7XG4gIC8vIDIzLjMuMy4zIFdlYWtNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIGlmIChpc09iamVjdChrZXkpKSB7XG4gICAgICB2YXIgZGF0YSA9IGdldFdlYWsoa2V5KTtcbiAgICAgIGlmIChkYXRhID09PSB0cnVlKSByZXR1cm4gdW5jYXVnaHRGcm96ZW5TdG9yZSh2YWxpZGF0ZSh0aGlzLCBXRUFLX01BUCkpLmdldChrZXkpO1xuICAgICAgcmV0dXJuIGRhdGEgPyBkYXRhW3RoaXMuX2ldIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgfSxcbiAgLy8gMjMuMy4zLjUgV2Vha01hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gd2Vhay5kZWYodmFsaWRhdGUodGhpcywgV0VBS19NQVApLCBrZXksIHZhbHVlKTtcbiAgfVxufTtcblxuLy8gMjMuMyBXZWFrTWFwIE9iamVjdHNcbnZhciAkV2Vha01hcCA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKFdFQUtfTUFQLCB3cmFwcGVyLCBtZXRob2RzLCB3ZWFrLCB0cnVlLCB0cnVlKTtcblxuLy8gSUUxMSBXZWFrTWFwIGZyb3plbiBrZXlzIGZpeFxuaWYgKGZhaWxzKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyAkV2Vha01hcCgpLnNldCgoT2JqZWN0LmZyZWV6ZSB8fCBPYmplY3QpKHRtcCksIDcpLmdldCh0bXApICE9IDc7IH0pKSB7XG4gIEludGVybmFsTWFwID0gd2Vhay5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBXRUFLX01BUCk7XG4gIGFzc2lnbihJbnRlcm5hbE1hcC5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICBtZXRhLk5FRUQgPSB0cnVlO1xuICBlYWNoKFsnZGVsZXRlJywgJ2hhcycsICdnZXQnLCAnc2V0J10sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgcHJvdG8gPSAkV2Vha01hcC5wcm90b3R5cGU7XG4gICAgdmFyIG1ldGhvZCA9IHByb3RvW2tleV07XG4gICAgcmVkZWZpbmUocHJvdG8sIGtleSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIC8vIHN0b3JlIGZyb3plbiBvYmplY3RzIG9uIGludGVybmFsIHdlYWttYXAgc2hpbVxuICAgICAgaWYgKGlzT2JqZWN0KGEpICYmICFpc0V4dGVuc2libGUoYSkpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9mKSB0aGlzLl9mID0gbmV3IEludGVybmFsTWFwKCk7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9mW2tleV0oYSwgYik7XG4gICAgICAgIHJldHVybiBrZXkgPT0gJ3NldCcgPyB0aGlzIDogcmVzdWx0O1xuICAgICAgLy8gc3RvcmUgYWxsIHRoZSByZXN0IG9uIG5hdGl2ZSB3ZWFrbWFwXG4gICAgICB9IHJldHVybiBtZXRob2QuY2FsbCh0aGlzLCBhLCBiKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iLCIvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vI3NlYy13ZWFrbWFwLm9mXG5yZXF1aXJlKCcuL19zZXQtY29sbGVjdGlvbi1vZicpKCdXZWFrTWFwJyk7XG4iLCIvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vI3NlYy13ZWFrbWFwLmZyb21cbnJlcXVpcmUoJy4vX3NldC1jb2xsZWN0aW9uLWZyb20nKSgnV2Vha01hcCcpO1xuIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi53ZWFrLW1hcCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcud2Vhay1tYXAub2YnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3LndlYWstbWFwLmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLldlYWtNYXA7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UgLyogLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCAqLykge1xuICAgIHZhciBPID0gdG9PYmplY3QoYXJyYXlMaWtlKTtcbiAgICB2YXIgQyA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXk7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBtYXBmbiA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oTyk7XG4gICAgdmFyIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZiAobWFwcGluZykgbWFwZm4gPSBjdHgobWFwZm4sIGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZiAoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpIHtcbiAgICAgIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEMoKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yIChyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5BcnJheS5mcm9tO1xuIiwiY29uc3QgcmVzZXJ2ZWRUYWdMaXN0ID0gbmV3IFNldChbXG4gICdhbm5vdGF0aW9uLXhtbCcsXG4gICdjb2xvci1wcm9maWxlJyxcbiAgJ2ZvbnQtZmFjZScsXG4gICdmb250LWZhY2Utc3JjJyxcbiAgJ2ZvbnQtZmFjZS11cmknLFxuICAnZm9udC1mYWNlLWZvcm1hdCcsXG4gICdmb250LWZhY2UtbmFtZScsXG4gICdtaXNzaW5nLWdseXBoJyxcbl0pO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbE5hbWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZEN1c3RvbUVsZW1lbnROYW1lKGxvY2FsTmFtZSkge1xuICBjb25zdCByZXNlcnZlZCA9IHJlc2VydmVkVGFnTGlzdC5oYXMobG9jYWxOYW1lKTtcbiAgY29uc3QgdmFsaWRGb3JtID0gL15bYS16XVsuMC05X2Etel0qLVtcXC0uMC05X2Etel0qJC8udGVzdChsb2NhbE5hbWUpO1xuICByZXR1cm4gIXJlc2VydmVkICYmIHZhbGlkRm9ybTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshTm9kZX0gbm9kZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ29ubmVjdGVkKG5vZGUpIHtcbiAgLy8gVXNlIGBOb2RlI2lzQ29ubmVjdGVkYCwgaWYgZGVmaW5lZC5cbiAgY29uc3QgbmF0aXZlVmFsdWUgPSBub2RlLmlzQ29ubmVjdGVkO1xuICBpZiAobmF0aXZlVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBuYXRpdmVWYWx1ZTtcbiAgfVxuXG4gIC8qKiBAdHlwZSB7P05vZGV8dW5kZWZpbmVkfSAqL1xuICBsZXQgY3VycmVudCA9IG5vZGU7XG4gIHdoaWxlIChjdXJyZW50ICYmICEoY3VycmVudC5fX0NFX2lzSW1wb3J0RG9jdW1lbnQgfHwgY3VycmVudCBpbnN0YW5jZW9mIERvY3VtZW50KSkge1xuICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudE5vZGUgfHwgKHdpbmRvdy5TaGFkb3dSb290ICYmIGN1cnJlbnQgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gY3VycmVudC5ob3N0IDogdW5kZWZpbmVkKTtcbiAgfVxuICByZXR1cm4gISEoY3VycmVudCAmJiAoY3VycmVudC5fX0NFX2lzSW1wb3J0RG9jdW1lbnQgfHwgY3VycmVudCBpbnN0YW5jZW9mIERvY3VtZW50KSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHshTm9kZX0gcm9vdFxuICogQHBhcmFtIHshTm9kZX0gc3RhcnRcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5mdW5jdGlvbiBuZXh0U2libGluZ09yQW5jZXN0b3JTaWJsaW5nKHJvb3QsIHN0YXJ0KSB7XG4gIGxldCBub2RlID0gc3RhcnQ7XG4gIHdoaWxlIChub2RlICYmIG5vZGUgIT09IHJvb3QgJiYgIW5vZGUubmV4dFNpYmxpbmcpIHtcbiAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICB9XG4gIHJldHVybiAoIW5vZGUgfHwgbm9kZSA9PT0gcm9vdCkgPyBudWxsIDogbm9kZS5uZXh0U2libGluZztcbn1cblxuLyoqXG4gKiBAcGFyYW0geyFOb2RlfSByb290XG4gKiBAcGFyYW0geyFOb2RlfSBzdGFydFxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbmZ1bmN0aW9uIG5leHROb2RlKHJvb3QsIHN0YXJ0KSB7XG4gIHJldHVybiBzdGFydC5maXJzdENoaWxkID8gc3RhcnQuZmlyc3RDaGlsZCA6IG5leHRTaWJsaW5nT3JBbmNlc3RvclNpYmxpbmcocm9vdCwgc3RhcnQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7IU5vZGV9IHJvb3RcbiAqIEBwYXJhbSB7IWZ1bmN0aW9uKCFFbGVtZW50KX0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7IVNldDxOb2RlPj19IHZpc2l0ZWRJbXBvcnRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3YWxrRGVlcERlc2NlbmRhbnRFbGVtZW50cyhyb290LCBjYWxsYmFjaywgdmlzaXRlZEltcG9ydHMgPSBuZXcgU2V0KCkpIHtcbiAgbGV0IG5vZGUgPSByb290O1xuICB3aGlsZSAobm9kZSkge1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IC8qKiBAdHlwZSB7IUVsZW1lbnR9ICovKG5vZGUpO1xuXG4gICAgICBjYWxsYmFjayhlbGVtZW50KTtcblxuICAgICAgY29uc3QgbG9jYWxOYW1lID0gZWxlbWVudC5sb2NhbE5hbWU7XG4gICAgICBpZiAobG9jYWxOYW1lID09PSAnbGluaycgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnaW1wb3J0Jykge1xuICAgICAgICAvLyBJZiB0aGlzIGltcG9ydCAocG9seWZpbGxlZCBvciBub3QpIGhhcyBpdCdzIHJvb3Qgbm9kZSBhdmFpbGFibGUsXG4gICAgICAgIC8vIHdhbGsgaXQuXG4gICAgICAgIGNvbnN0IGltcG9ydE5vZGUgPSAvKiogQHR5cGUgeyFOb2RlfSAqLyAoZWxlbWVudC5pbXBvcnQpO1xuICAgICAgICBpZiAoaW1wb3J0Tm9kZSBpbnN0YW5jZW9mIE5vZGUgJiYgIXZpc2l0ZWRJbXBvcnRzLmhhcyhpbXBvcnROb2RlKSkge1xuICAgICAgICAgIC8vIFByZXZlbnQgbXVsdGlwbGUgd2Fsa3Mgb2YgdGhlIHNhbWUgaW1wb3J0IHJvb3QuXG4gICAgICAgICAgdmlzaXRlZEltcG9ydHMuYWRkKGltcG9ydE5vZGUpO1xuXG4gICAgICAgICAgZm9yIChsZXQgY2hpbGQgPSBpbXBvcnROb2RlLmZpcnN0Q2hpbGQ7IGNoaWxkOyBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICB3YWxrRGVlcERlc2NlbmRhbnRFbGVtZW50cyhjaGlsZCwgY2FsbGJhY2ssIHZpc2l0ZWRJbXBvcnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZ25vcmUgZGVzY2VuZGFudHMgb2YgaW1wb3J0IGxpbmtzIHRvIHByZXZlbnQgYXR0ZW1wdGluZyB0byB3YWxrIHRoZVxuICAgICAgICAvLyBlbGVtZW50cyBjcmVhdGVkIGJ5IHRoZSBIVE1MIEltcG9ydHMgcG9seWZpbGwgdGhhdCB3ZSBqdXN0IHdhbGtlZFxuICAgICAgICAvLyBhYm92ZS5cbiAgICAgICAgbm9kZSA9IG5leHRTaWJsaW5nT3JBbmNlc3RvclNpYmxpbmcocm9vdCwgZWxlbWVudCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIGlmIChsb2NhbE5hbWUgPT09ICd0ZW1wbGF0ZScpIHtcbiAgICAgICAgLy8gSWdub3JlIGRlc2NlbmRhbnRzIG9mIHRlbXBsYXRlcy4gVGhlcmUgc2hvdWxkbid0IGJlIGFueSBkZXNjZW5kYW50c1xuICAgICAgICAvLyBiZWNhdXNlIHRoZXkgd2lsbCBiZSBtb3ZlZCBpbnRvIGAuY29udGVudGAgZHVyaW5nIGNvbnN0cnVjdGlvbiBpblxuICAgICAgICAvLyBicm93c2VycyB0aGF0IHN1cHBvcnQgdGVtcGxhdGUgYnV0LCBpbiBjYXNlIHRoZXkgZXhpc3QgYW5kIGFyZSBzdGlsbFxuICAgICAgICAvLyB3YWl0aW5nIHRvIGJlIG1vdmVkIGJ5IGEgcG9seWZpbGwsIHRoZXkgd2lsbCBiZSBpZ25vcmVkLlxuICAgICAgICBub2RlID0gbmV4dFNpYmxpbmdPckFuY2VzdG9yU2libGluZyhyb290LCBlbGVtZW50KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFdhbGsgc2hhZG93IHJvb3RzLlxuICAgICAgY29uc3Qgc2hhZG93Um9vdCA9IGVsZW1lbnQuX19DRV9zaGFkb3dSb290O1xuICAgICAgaWYgKHNoYWRvd1Jvb3QpIHtcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgPSBzaGFkb3dSb290LmZpcnN0Q2hpbGQ7IGNoaWxkOyBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgd2Fsa0RlZXBEZXNjZW5kYW50RWxlbWVudHMoY2hpbGQsIGNhbGxiYWNrLCB2aXNpdGVkSW1wb3J0cyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlID0gbmV4dE5vZGUocm9vdCwgbm9kZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBVc2VkIHRvIHN1cHByZXNzIENsb3N1cmUncyBcIk1vZGlmeWluZyB0aGUgcHJvdG90eXBlIGlzIG9ubHkgYWxsb3dlZCBpZiB0aGVcbiAqIGNvbnN0cnVjdG9yIGlzIGluIHRoZSBzYW1lIHNjb3BlXCIgd2FybmluZyB3aXRob3V0IHVzaW5nXG4gKiBgQHN1cHByZXNzIHtuZXdDaGVja1R5cGVzLCBkdXBsaWNhdGV9YCBiZWNhdXNlIGBuZXdDaGVja1R5cGVzYCBpcyB0b28gYnJvYWQuXG4gKlxuICogQHBhcmFtIHshT2JqZWN0fSBkZXN0aW5hdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFByb3BlcnR5VW5jaGVja2VkKGRlc3RpbmF0aW9uLCBuYW1lLCB2YWx1ZSkge1xuICBkZXN0aW5hdGlvbltuYW1lXSA9IHZhbHVlO1xufVxuIiwiLyoqXG4gKiBAZW51bSB7bnVtYmVyfVxuICovXG5jb25zdCBDdXN0b21FbGVtZW50U3RhdGUgPSB7XG4gIGN1c3RvbTogMSxcbiAgZmFpbGVkOiAyLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ3VzdG9tRWxlbWVudFN0YXRlO1xuIiwiaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gJy4vVXRpbGl0aWVzLmpzJztcbmltcG9ydCBDRVN0YXRlIGZyb20gJy4vQ3VzdG9tRWxlbWVudFN0YXRlLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VzdG9tRWxlbWVudEludGVybmFscyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKiBAdHlwZSB7IU1hcDxzdHJpbmcsICFDdXN0b21FbGVtZW50RGVmaW5pdGlvbj59ICovXG4gICAgdGhpcy5fbG9jYWxOYW1lVG9EZWZpbml0aW9uID0gbmV3IE1hcCgpO1xuXG4gICAgLyoqIEB0eXBlIHshTWFwPCFGdW5jdGlvbiwgIUN1c3RvbUVsZW1lbnREZWZpbml0aW9uPn0gKi9cbiAgICB0aGlzLl9jb25zdHJ1Y3RvclRvRGVmaW5pdGlvbiA9IG5ldyBNYXAoKTtcblxuICAgIC8qKiBAdHlwZSB7IUFycmF5PCFmdW5jdGlvbighTm9kZSk+fSAqL1xuICAgIHRoaXMuX3BhdGNoZXMgPSBbXTtcblxuICAgIC8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cbiAgICB0aGlzLl9oYXNQYXRjaGVzID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsTmFtZVxuICAgKiBAcGFyYW0geyFDdXN0b21FbGVtZW50RGVmaW5pdGlvbn0gZGVmaW5pdGlvblxuICAgKi9cbiAgc2V0RGVmaW5pdGlvbihsb2NhbE5hbWUsIGRlZmluaXRpb24pIHtcbiAgICB0aGlzLl9sb2NhbE5hbWVUb0RlZmluaXRpb24uc2V0KGxvY2FsTmFtZSwgZGVmaW5pdGlvbik7XG4gICAgdGhpcy5fY29uc3RydWN0b3JUb0RlZmluaXRpb24uc2V0KGRlZmluaXRpb24uY29uc3RydWN0b3IsIGRlZmluaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbE5hbWVcbiAgICogQHJldHVybiB7IUN1c3RvbUVsZW1lbnREZWZpbml0aW9ufHVuZGVmaW5lZH1cbiAgICovXG4gIGxvY2FsTmFtZVRvRGVmaW5pdGlvbihsb2NhbE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxOYW1lVG9EZWZpbml0aW9uLmdldChsb2NhbE5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IUZ1bmN0aW9ufSBjb25zdHJ1Y3RvclxuICAgKiBAcmV0dXJuIHshQ3VzdG9tRWxlbWVudERlZmluaXRpb258dW5kZWZpbmVkfVxuICAgKi9cbiAgY29uc3RydWN0b3JUb0RlZmluaXRpb24oY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5fY29uc3RydWN0b3JUb0RlZmluaXRpb24uZ2V0KGNvbnN0cnVjdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFmdW5jdGlvbighTm9kZSl9IGxpc3RlbmVyXG4gICAqL1xuICBhZGRQYXRjaChsaXN0ZW5lcikge1xuICAgIHRoaXMuX2hhc1BhdGNoZXMgPSB0cnVlO1xuICAgIHRoaXMuX3BhdGNoZXMucHVzaChsaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshTm9kZX0gbm9kZVxuICAgKi9cbiAgcGF0Y2hUcmVlKG5vZGUpIHtcbiAgICBpZiAoIXRoaXMuX2hhc1BhdGNoZXMpIHJldHVybjtcblxuICAgIFV0aWxpdGllcy53YWxrRGVlcERlc2NlbmRhbnRFbGVtZW50cyhub2RlLCBlbGVtZW50ID0+IHRoaXMucGF0Y2goZWxlbWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IU5vZGV9IG5vZGVcbiAgICovXG4gIHBhdGNoKG5vZGUpIHtcbiAgICBpZiAoIXRoaXMuX2hhc1BhdGNoZXMpIHJldHVybjtcblxuICAgIGlmIChub2RlLl9fQ0VfcGF0Y2hlZCkgcmV0dXJuO1xuICAgIG5vZGUuX19DRV9wYXRjaGVkID0gdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcGF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fcGF0Y2hlc1tpXShub2RlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHshTm9kZX0gcm9vdFxuICAgKi9cbiAgY29ubmVjdFRyZWUocm9vdCkge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gW107XG5cbiAgICBVdGlsaXRpZXMud2Fsa0RlZXBEZXNjZW5kYW50RWxlbWVudHMocm9vdCwgZWxlbWVudCA9PiBlbGVtZW50cy5wdXNoKGVsZW1lbnQpKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcbiAgICAgIGlmIChlbGVtZW50Ll9fQ0Vfc3RhdGUgPT09IENFU3RhdGUuY3VzdG9tKSB7XG4gICAgICAgIGlmIChVdGlsaXRpZXMuaXNDb25uZWN0ZWQoZWxlbWVudCkpIHtcbiAgICAgICAgICB0aGlzLmNvbm5lY3RlZENhbGxiYWNrKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVwZ3JhZGVFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFOb2RlfSByb290XG4gICAqL1xuICBkaXNjb25uZWN0VHJlZShyb290KSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBbXTtcblxuICAgIFV0aWxpdGllcy53YWxrRGVlcERlc2NlbmRhbnRFbGVtZW50cyhyb290LCBlbGVtZW50ID0+IGVsZW1lbnRzLnB1c2goZWxlbWVudCkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgaWYgKGVsZW1lbnQuX19DRV9zdGF0ZSA9PT0gQ0VTdGF0ZS5jdXN0b20pIHtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRDYWxsYmFjayhlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgYWxsIHVuY3VzdG9taXplZCBjdXN0b20gZWxlbWVudHMgYXQgYW5kIGJlbG93IGEgcm9vdCBub2RlIGZvclxuICAgKiB3aGljaCB0aGVyZSBpcyBhIGRlZmluaXRpb24uIFdoZW4gY3VzdG9tIGVsZW1lbnQgcmVhY3Rpb24gY2FsbGJhY2tzIGFyZVxuICAgKiBhc3N1bWVkIHRvIGJlIGNhbGxlZCBzeW5jaHJvbm91c2x5ICh3aGljaCwgYnkgdGhlIGN1cnJlbnQgRE9NIC8gSFRNTCBzcGVjXG4gICAqIGRlZmluaXRpb25zLCB0aGV5IGFyZSAqbm90KiksIGNhbGxiYWNrcyBmb3IgYm90aCBlbGVtZW50cyBjdXN0b21pemVkXG4gICAqIHN5bmNocm9ub3VzbHkgYnkgdGhlIHBhcnNlciBhbmQgZWxlbWVudHMgYmVpbmcgdXBncmFkZWQgb2NjdXIgaW4gdGhlIHNhbWVcbiAgICogcmVsYXRpdmUgb3JkZXIuXG4gICAqXG4gICAqIE5PVEU6IFRoaXMgZnVuY3Rpb24sIHdoZW4gdXNlZCB0byBzaW11bGF0ZSB0aGUgY29uc3RydWN0aW9uIG9mIGEgdHJlZSB0aGF0XG4gICAqIGlzIGFscmVhZHkgY3JlYXRlZCBidXQgbm90IGN1c3RvbWl6ZWQgKGkuZS4gYnkgdGhlIHBhcnNlciksIGRvZXMgKm5vdCpcbiAgICogcHJldmVudCB0aGUgZWxlbWVudCBmcm9tIHJlYWRpbmcgdGhlICdmaW5hbCcgKHRydWUpIHN0YXRlIG9mIHRoZSB0cmVlLiBGb3JcbiAgICogZXhhbXBsZSwgdGhlIGVsZW1lbnQsIGR1cmluZyB0cnVseSBzeW5jaHJvbm91cyBwYXJzaW5nIC8gY29uc3RydWN0aW9uIHdvdWxkXG4gICAqIHNlZSB0aGF0IGl0IGNvbnRhaW5zIG5vIGNoaWxkcmVuIGFzIHRoZXkgaGF2ZSBub3QgeWV0IGJlZW4gaW5zZXJ0ZWQuXG4gICAqIEhvd2V2ZXIsIHRoaXMgZnVuY3Rpb24gZG9lcyBub3QgbW9kaWZ5IHRoZSB0cmVlLCB0aGUgZWxlbWVudCB3aWxsXG4gICAqIChpbmNvcnJlY3RseSkgaGF2ZSBjaGlsZHJlbi4gQWRkaXRpb25hbGx5LCBzZWxmLW1vZGlmaWNhdGlvbiByZXN0cmljdGlvbnNcbiAgICogZm9yIGN1c3RvbSBlbGVtZW50IGNvbnN0cnVjdG9ycyBpbXBvc2VkIGJ5IHRoZSBET00gc3BlYyBhcmUgKm5vdCogZW5mb3JjZWQuXG4gICAqXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgbmVzdGVkIGxpc3Qgc2hvd3MgdGhlIHN0ZXBzIGV4dGVuZGluZyBkb3duIGZyb20gdGhlIEhUTUxcbiAgICogc3BlYydzIHBhcnNpbmcgc2VjdGlvbiB0aGF0IGNhdXNlIGVsZW1lbnRzIHRvIGJlIHN5bmNocm9ub3VzbHkgY3JlYXRlZCBhbmRcbiAgICogdXBncmFkZWQ6XG4gICAqXG4gICAqIFRoZSBcImluIGJvZHlcIiBpbnNlcnRpb24gbW9kZTpcbiAgICogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjcGFyc2luZy1tYWluLWluYm9keVxuICAgKiAtIFN3aXRjaCBvbiB0b2tlbjpcbiAgICogICAuLiBvdGhlciBjYXNlcyAuLlxuICAgKiAgIC0+IEFueSBvdGhlciBzdGFydCB0YWdcbiAgICogICAgICAtIFtJbnNlcnQgYW4gSFRNTCBlbGVtZW50XShiZWxvdykgZm9yIHRoZSB0b2tlbi5cbiAgICpcbiAgICogSW5zZXJ0IGFuIEhUTUwgZWxlbWVudDpcbiAgICogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjaW5zZXJ0LWFuLWh0bWwtZWxlbWVudFxuICAgKiAtIEluc2VydCBhIGZvcmVpZ24gZWxlbWVudCBmb3IgdGhlIHRva2VuIGluIHRoZSBIVE1MIG5hbWVzcGFjZTpcbiAgICogICBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNpbnNlcnQtYS1mb3JlaWduLWVsZW1lbnRcbiAgICogICAtIENyZWF0ZSBhbiBlbGVtZW50IGZvciBhIHRva2VuOlxuICAgKiAgICAgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjY3JlYXRlLWFuLWVsZW1lbnQtZm9yLXRoZS10b2tlblxuICAgKiAgICAgLSBXaWxsIGV4ZWN1dGUgc2NyaXB0IGZsYWcgaXMgdHJ1ZT9cbiAgICogICAgICAgLSAoRWxlbWVudCBxdWV1ZSBwdXNoZWQgdG8gdGhlIGN1c3RvbSBlbGVtZW50IHJlYWN0aW9ucyBzdGFjay4pXG4gICAqICAgICAtIENyZWF0ZSBhbiBlbGVtZW50OlxuICAgKiAgICAgICBodHRwczovL2RvbS5zcGVjLndoYXR3Zy5vcmcvI2NvbmNlcHQtY3JlYXRlLWVsZW1lbnRcbiAgICogICAgICAgLSBTeW5jIENFIGZsYWcgaXMgdHJ1ZT9cbiAgICogICAgICAgICAtIENvbnN0cnVjdG9yIGNhbGxlZC5cbiAgICogICAgICAgICAtIFNlbGYtbW9kaWZpY2F0aW9uIHJlc3RyaWN0aW9ucyBlbmZvcmNlZC5cbiAgICogICAgICAgLSBTeW5jIENFIGZsYWcgaXMgZmFsc2U/XG4gICAqICAgICAgICAgLSAoVXBncmFkZSByZWFjdGlvbiBlbnF1ZXVlZC4pXG4gICAqICAgICAtIEF0dHJpYnV0ZXMgYXBwZW5kZWQgdG8gZWxlbWVudC5cbiAgICogICAgICAgKGBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tgIHJlYWN0aW9ucyBlbnF1ZXVlZC4pXG4gICAqICAgICAtIFdpbGwgZXhlY3V0ZSBzY3JpcHQgZmxhZyBpcyB0cnVlP1xuICAgKiAgICAgICAtIChFbGVtZW50IHF1ZXVlIHBvcHBlZCBmcm9tIHRoZSBjdXN0b20gZWxlbWVudCByZWFjdGlvbnMgc3RhY2suXG4gICAqICAgICAgICAgUmVhY3Rpb25zIGluIHRoZSBwb3BwZWQgc3RhY2sgYXJlIGludm9rZWQuKVxuICAgKiAgIC0gKEVsZW1lbnQgcXVldWUgcHVzaGVkIHRvIHRoZSBjdXN0b20gZWxlbWVudCByZWFjdGlvbnMgc3RhY2suKVxuICAgKiAgIC0gSW5zZXJ0IHRoZSBlbGVtZW50OlxuICAgKiAgICAgaHR0cHM6Ly9kb20uc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LW5vZGUtaW5zZXJ0XG4gICAqICAgICAtIFNoYWRvdy1pbmNsdWRpbmcgZGVzY2VuZGFudHMgYXJlIGNvbm5lY3RlZC4gRHVyaW5nIHBhcnNpbmdcbiAgICogICAgICAgY29uc3RydWN0aW9uLCB0aGVyZSBhcmUgbm8gc2hhZG93LSpleGNsdWRpbmcqIGRlc2NlbmRhbnRzLlxuICAgKiAgICAgICBIb3dldmVyLCB0aGUgY29uc3RydWN0b3IgbWF5IGhhdmUgdmFsaWRseSBhdHRhY2hlZCBhIHNoYWRvd1xuICAgKiAgICAgICB0cmVlIHRvIGl0c2VsZiBhbmQgYWRkZWQgZGVzY2VuZGFudHMgdG8gdGhhdCBzaGFkb3cgdHJlZS5cbiAgICogICAgICAgKGBjb25uZWN0ZWRDYWxsYmFja2AgcmVhY3Rpb25zIGVucXVldWVkLilcbiAgICogICAtIChFbGVtZW50IHF1ZXVlIHBvcHBlZCBmcm9tIHRoZSBjdXN0b20gZWxlbWVudCByZWFjdGlvbnMgc3RhY2suXG4gICAqICAgICBSZWFjdGlvbnMgaW4gdGhlIHBvcHBlZCBzdGFjayBhcmUgaW52b2tlZC4pXG4gICAqXG4gICAqIEBwYXJhbSB7IU5vZGV9IHJvb3RcbiAgICogQHBhcmFtIHshU2V0PE5vZGU+PX0gdmlzaXRlZEltcG9ydHNcbiAgICovXG4gIHBhdGNoQW5kVXBncmFkZVRyZWUocm9vdCwgdmlzaXRlZEltcG9ydHMgPSBuZXcgU2V0KCkpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IFtdO1xuXG4gICAgY29uc3QgZ2F0aGVyRWxlbWVudHMgPSBlbGVtZW50ID0+IHtcbiAgICAgIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PT0gJ2xpbmsnICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2ltcG9ydCcpIHtcbiAgICAgICAgLy8gVGhlIEhUTUwgSW1wb3J0cyBwb2x5ZmlsbCBzZXRzIGEgZGVzY2VuZGFudCBlbGVtZW50IG9mIHRoZSBsaW5rIHRvXG4gICAgICAgIC8vIHRoZSBgaW1wb3J0YCBwcm9wZXJ0eSwgc3BlY2lmaWNhbGx5IHRoaXMgaXMgKm5vdCogYSBEb2N1bWVudC5cbiAgICAgICAgY29uc3QgaW1wb3J0Tm9kZSA9IC8qKiBAdHlwZSB7P05vZGV9ICovIChlbGVtZW50LmltcG9ydCk7XG5cbiAgICAgICAgaWYgKGltcG9ydE5vZGUgaW5zdGFuY2VvZiBOb2RlICYmIGltcG9ydE5vZGUucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgIGltcG9ydE5vZGUuX19DRV9pc0ltcG9ydERvY3VtZW50ID0gdHJ1ZTtcblxuICAgICAgICAgIC8vIENvbm5lY3RlZCBsaW5rcyBhcmUgYXNzb2NpYXRlZCB3aXRoIHRoZSByZWdpc3RyeS5cbiAgICAgICAgICBpbXBvcnROb2RlLl9fQ0VfaGFzUmVnaXN0cnkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIHRoaXMgbGluaydzIGltcG9ydCByb290IGlzIG5vdCBhdmFpbGFibGUsIGl0cyBjb250ZW50cyBjYW4ndCBiZVxuICAgICAgICAgIC8vIHdhbGtlZC4gV2FpdCBmb3IgJ2xvYWQnIGFuZCB3YWxrIGl0IHdoZW4gaXQncyByZWFkeS5cbiAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbXBvcnROb2RlID0gLyoqIEB0eXBlIHshTm9kZX0gKi8gKGVsZW1lbnQuaW1wb3J0KTtcblxuICAgICAgICAgICAgaWYgKGltcG9ydE5vZGUuX19DRV9kb2N1bWVudExvYWRIYW5kbGVkKSByZXR1cm47XG4gICAgICAgICAgICBpbXBvcnROb2RlLl9fQ0VfZG9jdW1lbnRMb2FkSGFuZGxlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGltcG9ydE5vZGUuX19DRV9pc0ltcG9ydERvY3VtZW50ID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gQ29ubmVjdGVkIGxpbmtzIGFyZSBhc3NvY2lhdGVkIHdpdGggdGhlIHJlZ2lzdHJ5LlxuICAgICAgICAgICAgaW1wb3J0Tm9kZS5fX0NFX2hhc1JlZ2lzdHJ5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gQ2xvbmUgdGhlIGB2aXNpdGVkSW1wb3J0c2Agc2V0IHRoYXQgd2FzIHBvcHVsYXRlZCBzeW5jIGR1cmluZ1xuICAgICAgICAgICAgLy8gdGhlIGBwYXRjaEFuZFVwZ3JhZGVUcmVlYCBjYWxsIHRoYXQgY2F1c2VkIHRoaXMgJ2xvYWQnIGhhbmRsZXIgdG9cbiAgICAgICAgICAgIC8vIGJlIGFkZGVkLiBUaGVuLCByZW1vdmUgKnRoaXMqIGxpbmsncyBpbXBvcnQgbm9kZSBzbyB0aGF0IHdlIGNhblxuICAgICAgICAgICAgLy8gd2FsayB0aGF0IGltcG9ydCBhZ2FpbiwgZXZlbiBpZiBpdCB3YXMgcGFydGlhbGx5IHdhbGtlZCBsYXRlclxuICAgICAgICAgICAgLy8gZHVyaW5nIHRoZSBzYW1lIGBwYXRjaEFuZFVwZ3JhZGVUcmVlYCBjYWxsLlxuICAgICAgICAgICAgY29uc3QgY2xvbmVkVmlzaXRlZEltcG9ydHMgPSBuZXcgU2V0KHZpc2l0ZWRJbXBvcnRzKTtcbiAgICAgICAgICAgIHZpc2l0ZWRJbXBvcnRzLmRlbGV0ZShpbXBvcnROb2RlKTtcblxuICAgICAgICAgICAgdGhpcy5wYXRjaEFuZFVwZ3JhZGVUcmVlKGltcG9ydE5vZGUsIHZpc2l0ZWRJbXBvcnRzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gYHdhbGtEZWVwRGVzY2VuZGFudEVsZW1lbnRzYCBwb3B1bGF0ZXMgKGFuZCBpbnRlcm5hbGx5IGNoZWNrcyBhZ2FpbnN0KVxuICAgIC8vIGB2aXNpdGVkSW1wb3J0c2Agd2hlbiB0cmF2ZXJzaW5nIGEgbG9hZGVkIGltcG9ydC5cbiAgICBVdGlsaXRpZXMud2Fsa0RlZXBEZXNjZW5kYW50RWxlbWVudHMocm9vdCwgZ2F0aGVyRWxlbWVudHMsIHZpc2l0ZWRJbXBvcnRzKTtcblxuICAgIGlmICh0aGlzLl9oYXNQYXRjaGVzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMucGF0Y2goZWxlbWVudHNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudXBncmFkZUVsZW1lbnQoZWxlbWVudHNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50XG4gICAqL1xuICB1cGdyYWRlRWxlbWVudChlbGVtZW50KSB7XG4gICAgY29uc3QgY3VycmVudFN0YXRlID0gZWxlbWVudC5fX0NFX3N0YXRlO1xuICAgIGlmIChjdXJyZW50U3RhdGUgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMubG9jYWxOYW1lVG9EZWZpbml0aW9uKGVsZW1lbnQubG9jYWxOYW1lKTtcbiAgICBpZiAoIWRlZmluaXRpb24pIHJldHVybjtcblxuICAgIGRlZmluaXRpb24uY29uc3RydWN0aW9uU3RhY2sucHVzaChlbGVtZW50KTtcblxuICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gZGVmaW5pdGlvbi5jb25zdHJ1Y3RvcjtcbiAgICB0cnkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyAoY29uc3RydWN0b3IpKCk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IGVsZW1lbnQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvciBkaWQgbm90IHByb2R1Y2UgdGhlIGVsZW1lbnQgYmVpbmcgdXBncmFkZWQuJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGRlZmluaXRpb24uY29uc3RydWN0aW9uU3RhY2sucG9wKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZWxlbWVudC5fX0NFX3N0YXRlID0gQ0VTdGF0ZS5mYWlsZWQ7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGVsZW1lbnQuX19DRV9zdGF0ZSA9IENFU3RhdGUuY3VzdG9tO1xuICAgIGVsZW1lbnQuX19DRV9kZWZpbml0aW9uID0gZGVmaW5pdGlvbjtcblxuICAgIGlmIChkZWZpbml0aW9uLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaykge1xuICAgICAgY29uc3Qgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gZGVmaW5pdGlvbi5vYnNlcnZlZEF0dHJpYnV0ZXM7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9ic2VydmVkQXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBuYW1lID0gb2JzZXJ2ZWRBdHRyaWJ1dGVzW2ldO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhlbGVtZW50LCBuYW1lLCBudWxsLCB2YWx1ZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoVXRpbGl0aWVzLmlzQ29ubmVjdGVkKGVsZW1lbnQpKSB7XG4gICAgICB0aGlzLmNvbm5lY3RlZENhbGxiYWNrKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50XG4gICAqL1xuICBjb25uZWN0ZWRDYWxsYmFjayhlbGVtZW50KSB7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IGVsZW1lbnQuX19DRV9kZWZpbml0aW9uO1xuICAgIGlmIChkZWZpbml0aW9uLmNvbm5lY3RlZENhbGxiYWNrKSB7XG4gICAgICBkZWZpbml0aW9uLmNvbm5lY3RlZENhbGxiYWNrLmNhbGwoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZWxlbWVudC5fX0NFX2lzQ29ubmVjdGVkQ2FsbGJhY2tDYWxsZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR9IGVsZW1lbnRcbiAgICovXG4gIGRpc2Nvbm5lY3RlZENhbGxiYWNrKGVsZW1lbnQpIHtcbiAgICBpZiAoIWVsZW1lbnQuX19DRV9pc0Nvbm5lY3RlZENhbGxiYWNrQ2FsbGVkKSB7XG4gICAgICB0aGlzLmNvbm5lY3RlZENhbGxiYWNrKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmluaXRpb24gPSBlbGVtZW50Ll9fQ0VfZGVmaW5pdGlvbjtcbiAgICBpZiAoZGVmaW5pdGlvbi5kaXNjb25uZWN0ZWRDYWxsYmFjaykge1xuICAgICAgZGVmaW5pdGlvbi5kaXNjb25uZWN0ZWRDYWxsYmFjay5jYWxsKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIGVsZW1lbnQuX19DRV9pc0Nvbm5lY3RlZENhbGxiYWNrQ2FsbGVkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR9IGVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHs/c3RyaW5nfSBvbGRWYWx1ZVxuICAgKiBAcGFyYW0gez9zdHJpbmd9IG5ld1ZhbHVlXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gbmFtZXNwYWNlXG4gICAqL1xuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soZWxlbWVudCwgbmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlLCBuYW1lc3BhY2UpIHtcbiAgICBjb25zdCBkZWZpbml0aW9uID0gZWxlbWVudC5fX0NFX2RlZmluaXRpb247XG4gICAgaWYgKFxuICAgICAgZGVmaW5pdGlvbi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgJiZcbiAgICAgIGRlZmluaXRpb24ub2JzZXJ2ZWRBdHRyaWJ1dGVzLmluZGV4T2YobmFtZSkgPiAtMVxuICAgICkge1xuICAgICAgZGVmaW5pdGlvbi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suY2FsbChlbGVtZW50LCBuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUsIG5hbWVzcGFjZSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQ3VzdG9tRWxlbWVudEludGVybmFscyBmcm9tICcuL0N1c3RvbUVsZW1lbnRJbnRlcm5hbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb2N1bWVudENvbnN0cnVjdGlvbk9ic2VydmVyIHtcbiAgY29uc3RydWN0b3IoaW50ZXJuYWxzLCBkb2MpIHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7IUN1c3RvbUVsZW1lbnRJbnRlcm5hbHN9XG4gICAgICovXG4gICAgdGhpcy5faW50ZXJuYWxzID0gaW50ZXJuYWxzO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUgeyFEb2N1bWVudH1cbiAgICAgKi9cbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvYztcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtNdXRhdGlvbk9ic2VydmVyfHVuZGVmaW5lZH1cbiAgICAgKi9cbiAgICB0aGlzLl9vYnNlcnZlciA9IHVuZGVmaW5lZDtcblxuXG4gICAgLy8gU2ltdWxhdGUgdHJlZSBjb25zdHJ1Y3Rpb24gZm9yIGFsbCBjdXJyZW50bHkgYWNjZXNzaWJsZSBub2RlcyBpbiB0aGVcbiAgICAvLyBkb2N1bWVudC5cbiAgICB0aGlzLl9pbnRlcm5hbHMucGF0Y2hBbmRVcGdyYWRlVHJlZSh0aGlzLl9kb2N1bWVudCk7XG5cbiAgICBpZiAodGhpcy5fZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XG4gICAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuX2hhbmRsZU11dGF0aW9ucy5iaW5kKHRoaXMpKTtcblxuICAgICAgLy8gTm9kZXMgY3JlYXRlZCBieSB0aGUgcGFyc2VyIGFyZSBnaXZlbiB0byB0aGUgb2JzZXJ2ZXIgKmJlZm9yZSogdGhlIG5leHRcbiAgICAgIC8vIHRhc2sgcnVucy4gSW5saW5lIHNjcmlwdHMgYXJlIHJ1biBpbiBhIG5ldyB0YXNrLiBUaGlzIG1lYW5zIHRoYXQgdGhlXG4gICAgICAvLyBvYnNlcnZlciB3aWxsIGJlIGFibGUgdG8gaGFuZGxlIHRoZSBuZXdseSBwYXJzZWQgbm9kZXMgYmVmb3JlIHRoZSBpbmxpbmVcbiAgICAgIC8vIHNjcmlwdCBpcyBydW4uXG4gICAgICB0aGlzLl9vYnNlcnZlci5vYnNlcnZlKHRoaXMuX2RvY3VtZW50LCB7XG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgaWYgKHRoaXMuX29ic2VydmVyKSB7XG4gICAgICB0aGlzLl9vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7IUFycmF5PCFNdXRhdGlvblJlY29yZD59IG11dGF0aW9uc1xuICAgKi9cbiAgX2hhbmRsZU11dGF0aW9ucyhtdXRhdGlvbnMpIHtcbiAgICAvLyBPbmNlIHRoZSBkb2N1bWVudCdzIGByZWFkeVN0YXRlYCBpcyAnaW50ZXJhY3RpdmUnIG9yICdjb21wbGV0ZScsIGFsbCBuZXdcbiAgICAvLyBub2RlcyBjcmVhdGVkIHdpdGhpbiB0aGF0IGRvY3VtZW50IHdpbGwgYmUgdGhlIHJlc3VsdCBvZiBzY3JpcHQgYW5kXG4gICAgLy8gc2hvdWxkIGJlIGhhbmRsZWQgYnkgcGF0Y2hpbmcuXG4gICAgY29uc3QgcmVhZHlTdGF0ZSA9IHRoaXMuX2RvY3VtZW50LnJlYWR5U3RhdGU7XG4gICAgaWYgKHJlYWR5U3RhdGUgPT09ICdpbnRlcmFjdGl2ZScgfHwgcmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtdXRhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGFkZGVkTm9kZXMgPSBtdXRhdGlvbnNbaV0uYWRkZWROb2RlcztcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYWRkZWROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBub2RlID0gYWRkZWROb2Rlc1tqXTtcbiAgICAgICAgdGhpcy5faW50ZXJuYWxzLnBhdGNoQW5kVXBncmFkZVRyZWUobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCIvKipcbiAqIEB0ZW1wbGF0ZSBUXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlZmVycmVkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7VHx1bmRlZmluZWR9XG4gICAgICovXG4gICAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gICAgICovXG4gICAgdGhpcy5fcmVzb2x2ZSA9IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUgeyFQcm9taXNlPFQ+fVxuICAgICAqL1xuICAgIHRoaXMuX3Byb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuXG4gICAgICBpZiAodGhpcy5fdmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZSh0aGlzLl92YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtUfSB2YWx1ZVxuICAgKi9cbiAgcmVzb2x2ZSh2YWx1ZSkge1xuICAgIGlmICh0aGlzLl92YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbHJlYWR5IHJlc29sdmVkLicpO1xuICAgIH1cblxuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAodGhpcy5fcmVzb2x2ZSkge1xuICAgICAgdGhpcy5fcmVzb2x2ZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4geyFQcm9taXNlPFQ+fVxuICAgKi9cbiAgdG9Qcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLl9wcm9taXNlO1xuICB9XG59XG4iLCJpbXBvcnQgQ3VzdG9tRWxlbWVudEludGVybmFscyBmcm9tICcuL0N1c3RvbUVsZW1lbnRJbnRlcm5hbHMuanMnO1xuaW1wb3J0IERvY3VtZW50Q29uc3RydWN0aW9uT2JzZXJ2ZXIgZnJvbSAnLi9Eb2N1bWVudENvbnN0cnVjdGlvbk9ic2VydmVyLmpzJztcbmltcG9ydCBEZWZlcnJlZCBmcm9tICcuL0RlZmVycmVkLmpzJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuL1V0aWxpdGllcy5qcyc7XG5cbi8qKlxuICogQHVucmVzdHJpY3RlZFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21FbGVtZW50UmVnaXN0cnkge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0geyFDdXN0b21FbGVtZW50SW50ZXJuYWxzfSBpbnRlcm5hbHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKGludGVybmFscykge1xuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5fZWxlbWVudERlZmluaXRpb25Jc1J1bm5pbmcgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUgeyFDdXN0b21FbGVtZW50SW50ZXJuYWxzfVxuICAgICAqL1xuICAgIHRoaXMuX2ludGVybmFscyA9IGludGVybmFscztcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUgeyFNYXA8c3RyaW5nLCAhRGVmZXJyZWQ8dW5kZWZpbmVkPj59XG4gICAgICovXG4gICAgdGhpcy5fd2hlbkRlZmluZWREZWZlcnJlZCA9IG5ldyBNYXAoKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZsdXNoIGNhbGxiYWNrIHRyaWdnZXJzIHRoZSBkb2N1bWVudCB3YWxrIHN5bmNocm9ub3VzbHkuXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7IUZ1bmN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMuX2ZsdXNoQ2FsbGJhY2sgPSBmbiA9PiBmbigpO1xuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl9mbHVzaFBlbmRpbmcgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUgeyFBcnJheTxzdHJpbmc+fVxuICAgICAqL1xuICAgIHRoaXMuX3VuZmx1c2hlZExvY2FsTmFtZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUgeyFEb2N1bWVudENvbnN0cnVjdGlvbk9ic2VydmVyfVxuICAgICAqL1xuICAgIHRoaXMuX2RvY3VtZW50Q29uc3RydWN0aW9uT2JzZXJ2ZXIgPSBuZXcgRG9jdW1lbnRDb25zdHJ1Y3Rpb25PYnNlcnZlcihpbnRlcm5hbHMsIGRvY3VtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxOYW1lXG4gICAqIEBwYXJhbSB7IUZ1bmN0aW9ufSBjb25zdHJ1Y3RvclxuICAgKi9cbiAgZGVmaW5lKGxvY2FsTmFtZSwgY29uc3RydWN0b3IpIHtcbiAgICBpZiAoIShjb25zdHJ1Y3RvciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ3VzdG9tIGVsZW1lbnQgY29uc3RydWN0b3JzIG11c3QgYmUgZnVuY3Rpb25zLicpO1xuICAgIH1cblxuICAgIGlmICghVXRpbGl0aWVzLmlzVmFsaWRDdXN0b21FbGVtZW50TmFtZShsb2NhbE5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFRoZSBlbGVtZW50IG5hbWUgJyR7bG9jYWxOYW1lfScgaXMgbm90IHZhbGlkLmApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pbnRlcm5hbHMubG9jYWxOYW1lVG9EZWZpbml0aW9uKGxvY2FsTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQSBjdXN0b20gZWxlbWVudCB3aXRoIG5hbWUgJyR7bG9jYWxOYW1lfScgaGFzIGFscmVhZHkgYmVlbiBkZWZpbmVkLmApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9lbGVtZW50RGVmaW5pdGlvbklzUnVubmluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIGN1c3RvbSBlbGVtZW50IGlzIGFscmVhZHkgYmVpbmcgZGVmaW5lZC4nKTtcbiAgICB9XG4gICAgdGhpcy5fZWxlbWVudERlZmluaXRpb25Jc1J1bm5pbmcgPSB0cnVlO1xuXG4gICAgbGV0IGNvbm5lY3RlZENhbGxiYWNrO1xuICAgIGxldCBkaXNjb25uZWN0ZWRDYWxsYmFjaztcbiAgICBsZXQgYWRvcHRlZENhbGxiYWNrO1xuICAgIGxldCBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s7XG4gICAgbGV0IG9ic2VydmVkQXR0cmlidXRlcztcbiAgICB0cnkge1xuICAgICAgLyoqIEB0eXBlIHshT2JqZWN0fSAqL1xuICAgICAgY29uc3QgcHJvdG90eXBlID0gY29uc3RydWN0b3IucHJvdG90eXBlO1xuICAgICAgaWYgKCEocHJvdG90eXBlIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgY3VzdG9tIGVsZW1lbnQgY29uc3RydWN0b3JcXCdzIHByb3RvdHlwZSBpcyBub3QgYW4gb2JqZWN0LicpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRDYWxsYmFjayhuYW1lKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrVmFsdWUgPSBwcm90b3R5cGVbbmFtZV07XG4gICAgICAgIGlmIChjYWxsYmFja1ZhbHVlICE9PSB1bmRlZmluZWQgJiYgIShjYWxsYmFja1ZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgJyR7bmFtZX0nIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbi5gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FsbGJhY2tWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgY29ubmVjdGVkQ2FsbGJhY2sgPSBnZXRDYWxsYmFjaygnY29ubmVjdGVkQ2FsbGJhY2snKTtcbiAgICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrID0gZ2V0Q2FsbGJhY2soJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJyk7XG4gICAgICBhZG9wdGVkQ2FsbGJhY2sgPSBnZXRDYWxsYmFjaygnYWRvcHRlZENhbGxiYWNrJyk7XG4gICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgPSBnZXRDYWxsYmFjaygnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJyk7XG4gICAgICBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBjb25zdHJ1Y3Rvclsnb2JzZXJ2ZWRBdHRyaWJ1dGVzJ10gfHwgW107XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLl9lbGVtZW50RGVmaW5pdGlvbklzUnVubmluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmluaXRpb24gPSB7XG4gICAgICBsb2NhbE5hbWUsXG4gICAgICBjb25zdHJ1Y3RvcixcbiAgICAgIGNvbm5lY3RlZENhbGxiYWNrLFxuICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2ssXG4gICAgICBhZG9wdGVkQ2FsbGJhY2ssXG4gICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2ssXG4gICAgICBvYnNlcnZlZEF0dHJpYnV0ZXMsXG4gICAgICBjb25zdHJ1Y3Rpb25TdGFjazogW10sXG4gICAgfTtcblxuICAgIHRoaXMuX2ludGVybmFscy5zZXREZWZpbml0aW9uKGxvY2FsTmFtZSwgZGVmaW5pdGlvbik7XG5cbiAgICB0aGlzLl91bmZsdXNoZWRMb2NhbE5hbWVzLnB1c2gobG9jYWxOYW1lKTtcblxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgY2FsbGVkIHRoZSBmbHVzaCBjYWxsYmFjayBhbmQgaXQgaGFzbid0IGNhbGxlZCBiYWNrIHlldCxcbiAgICAvLyBkb24ndCBjYWxsIGl0IGFnYWluLlxuICAgIGlmICghdGhpcy5fZmx1c2hQZW5kaW5nKSB7XG4gICAgICB0aGlzLl9mbHVzaFBlbmRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5fZmx1c2hDYWxsYmFjaygoKSA9PiB0aGlzLl9mbHVzaCgpKTtcbiAgICB9XG4gIH1cblxuICBfZmx1c2goKSB7XG4gICAgLy8gSWYgbm8gbmV3IGRlZmluaXRpb25zIHdlcmUgZGVmaW5lZCwgZG9uJ3QgYXR0ZW1wdCB0byBmbHVzaC4gVGhpcyBjb3VsZFxuICAgIC8vIGhhcHBlbiBpZiBhIGZsdXNoIGNhbGxiYWNrIGtlZXBzIHRoZSBmdW5jdGlvbiBpdCBpcyBnaXZlbiBhbmQgY2FsbHMgaXRcbiAgICAvLyBtdWx0aXBsZSB0aW1lcy5cbiAgICBpZiAodGhpcy5fZmx1c2hQZW5kaW5nID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgdGhpcy5fZmx1c2hQZW5kaW5nID0gZmFsc2U7XG4gICAgdGhpcy5faW50ZXJuYWxzLnBhdGNoQW5kVXBncmFkZVRyZWUoZG9jdW1lbnQpO1xuXG4gICAgd2hpbGUgKHRoaXMuX3VuZmx1c2hlZExvY2FsTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbG9jYWxOYW1lID0gdGhpcy5fdW5mbHVzaGVkTG9jYWxOYW1lcy5zaGlmdCgpO1xuICAgICAgY29uc3QgZGVmZXJyZWQgPSB0aGlzLl93aGVuRGVmaW5lZERlZmVycmVkLmdldChsb2NhbE5hbWUpO1xuICAgICAgaWYgKGRlZmVycmVkKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsTmFtZVxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gICAqL1xuICBnZXQobG9jYWxOYW1lKSB7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuX2ludGVybmFscy5sb2NhbE5hbWVUb0RlZmluaXRpb24obG9jYWxOYW1lKTtcbiAgICBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgcmV0dXJuIGRlZmluaXRpb24uY29uc3RydWN0b3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxOYW1lXG4gICAqIEByZXR1cm4geyFQcm9taXNlPHVuZGVmaW5lZD59XG4gICAqL1xuICB3aGVuRGVmaW5lZChsb2NhbE5hbWUpIHtcbiAgICBpZiAoIVV0aWxpdGllcy5pc1ZhbGlkQ3VzdG9tRWxlbWVudE5hbWUobG9jYWxOYW1lKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBTeW50YXhFcnJvcihgJyR7bG9jYWxOYW1lfScgaXMgbm90IGEgdmFsaWQgY3VzdG9tIGVsZW1lbnQgbmFtZS5gKSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJpb3IgPSB0aGlzLl93aGVuRGVmaW5lZERlZmVycmVkLmdldChsb2NhbE5hbWUpO1xuICAgIGlmIChwcmlvcikge1xuICAgICAgcmV0dXJuIHByaW9yLnRvUHJvbWlzZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XG4gICAgdGhpcy5fd2hlbkRlZmluZWREZWZlcnJlZC5zZXQobG9jYWxOYW1lLCBkZWZlcnJlZCk7XG5cbiAgICBjb25zdCBkZWZpbml0aW9uID0gdGhpcy5faW50ZXJuYWxzLmxvY2FsTmFtZVRvRGVmaW5pdGlvbihsb2NhbE5hbWUpO1xuICAgIC8vIFJlc29sdmUgaW1tZWRpYXRlbHkgb25seSBpZiB0aGUgZ2l2ZW4gbG9jYWwgbmFtZSBoYXMgYSBkZWZpbml0aW9uICphbmQqXG4gICAgLy8gdGhlIGZ1bGwgZG9jdW1lbnQgd2FsayB0byB1cGdyYWRlIGVsZW1lbnRzIHdpdGggdGhhdCBsb2NhbCBuYW1lIGhhc1xuICAgIC8vIGFscmVhZHkgaGFwcGVuZWQuXG4gICAgaWYgKGRlZmluaXRpb24gJiYgdGhpcy5fdW5mbHVzaGVkTG9jYWxOYW1lcy5pbmRleE9mKGxvY2FsTmFtZSkgPT09IC0xKSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmVycmVkLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgcG9seWZpbGxXcmFwRmx1c2hDYWxsYmFjayhvdXRlcikge1xuICAgIHRoaXMuX2RvY3VtZW50Q29uc3RydWN0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIGNvbnN0IGlubmVyID0gdGhpcy5fZmx1c2hDYWxsYmFjaztcbiAgICB0aGlzLl9mbHVzaENhbGxiYWNrID0gZmx1c2ggPT4gb3V0ZXIoKCkgPT4gaW5uZXIoZmx1c2gpKTtcbiAgfVxufVxuXG4vLyBDbG9zdXJlIGNvbXBpbGVyIGV4cG9ydHMuXG53aW5kb3dbJ0N1c3RvbUVsZW1lbnRSZWdpc3RyeSddID0gQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5O1xuQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5LnByb3RvdHlwZVsnZGVmaW5lJ10gPSBDdXN0b21FbGVtZW50UmVnaXN0cnkucHJvdG90eXBlLmRlZmluZTtcbkN1c3RvbUVsZW1lbnRSZWdpc3RyeS5wcm90b3R5cGVbJ2dldCddID0gQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5LnByb3RvdHlwZS5nZXQ7XG5DdXN0b21FbGVtZW50UmVnaXN0cnkucHJvdG90eXBlWyd3aGVuRGVmaW5lZCddID0gQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5LnByb3RvdHlwZS53aGVuRGVmaW5lZDtcbkN1c3RvbUVsZW1lbnRSZWdpc3RyeS5wcm90b3R5cGVbJ3BvbHlmaWxsV3JhcEZsdXNoQ2FsbGJhY2snXSA9IEN1c3RvbUVsZW1lbnRSZWdpc3RyeS5wcm90b3R5cGUucG9seWZpbGxXcmFwRmx1c2hDYWxsYmFjaztcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgRG9jdW1lbnRfY3JlYXRlRWxlbWVudDogd2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50LFxuICBEb2N1bWVudF9jcmVhdGVFbGVtZW50TlM6IHdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudE5TLFxuICBEb2N1bWVudF9pbXBvcnROb2RlOiB3aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmltcG9ydE5vZGUsXG4gIERvY3VtZW50X3ByZXBlbmQ6IHdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGVbJ3ByZXBlbmQnXSxcbiAgRG9jdW1lbnRfYXBwZW5kOiB3aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlWydhcHBlbmQnXSxcbiAgTm9kZV9jbG9uZU5vZGU6IHdpbmRvdy5Ob2RlLnByb3RvdHlwZS5jbG9uZU5vZGUsXG4gIE5vZGVfYXBwZW5kQ2hpbGQ6IHdpbmRvdy5Ob2RlLnByb3RvdHlwZS5hcHBlbmRDaGlsZCxcbiAgTm9kZV9pbnNlcnRCZWZvcmU6IHdpbmRvdy5Ob2RlLnByb3RvdHlwZS5pbnNlcnRCZWZvcmUsXG4gIE5vZGVfcmVtb3ZlQ2hpbGQ6IHdpbmRvdy5Ob2RlLnByb3RvdHlwZS5yZW1vdmVDaGlsZCxcbiAgTm9kZV9yZXBsYWNlQ2hpbGQ6IHdpbmRvdy5Ob2RlLnByb3RvdHlwZS5yZXBsYWNlQ2hpbGQsXG4gIE5vZGVfdGV4dENvbnRlbnQ6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod2luZG93Lk5vZGUucHJvdG90eXBlLCAndGV4dENvbnRlbnQnKSxcbiAgRWxlbWVudF9hdHRhY2hTaGFkb3c6IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZVsnYXR0YWNoU2hhZG93J10sXG4gIEVsZW1lbnRfaW5uZXJIVE1MOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSwgJ2lubmVySFRNTCcpLFxuICBFbGVtZW50X2dldEF0dHJpYnV0ZTogd2luZG93LkVsZW1lbnQucHJvdG90eXBlLmdldEF0dHJpYnV0ZSxcbiAgRWxlbWVudF9zZXRBdHRyaWJ1dGU6IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUsXG4gIEVsZW1lbnRfcmVtb3ZlQXR0cmlidXRlOiB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlLFxuICBFbGVtZW50X2dldEF0dHJpYnV0ZU5TOiB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlTlMsXG4gIEVsZW1lbnRfc2V0QXR0cmlidXRlTlM6IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGVOUyxcbiAgRWxlbWVudF9yZW1vdmVBdHRyaWJ1dGVOUzogd2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZU5TLFxuICBFbGVtZW50X2luc2VydEFkamFjZW50RWxlbWVudDogd2luZG93LkVsZW1lbnQucHJvdG90eXBlWydpbnNlcnRBZGphY2VudEVsZW1lbnQnXSxcbiAgRWxlbWVudF9wcmVwZW5kOiB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGVbJ3ByZXBlbmQnXSxcbiAgRWxlbWVudF9hcHBlbmQ6IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZVsnYXBwZW5kJ10sXG4gIEVsZW1lbnRfYmVmb3JlOiB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGVbJ2JlZm9yZSddLFxuICBFbGVtZW50X2FmdGVyOiB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGVbJ2FmdGVyJ10sXG4gIEVsZW1lbnRfcmVwbGFjZVdpdGg6IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZVsncmVwbGFjZVdpdGgnXSxcbiAgRWxlbWVudF9yZW1vdmU6IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZVsncmVtb3ZlJ10sXG4gIEhUTUxFbGVtZW50OiB3aW5kb3cuSFRNTEVsZW1lbnQsXG4gIEhUTUxFbGVtZW50X2lubmVySFRNTDogT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlLCAnaW5uZXJIVE1MJyksXG4gIEhUTUxFbGVtZW50X2luc2VydEFkamFjZW50RWxlbWVudDogd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZVsnaW5zZXJ0QWRqYWNlbnRFbGVtZW50J10sXG59O1xuIiwiLyoqXG4gKiBUaGlzIGNsYXNzIGV4aXN0cyBvbmx5IHRvIHdvcmsgYXJvdW5kIENsb3N1cmUncyBsYWNrIG9mIGEgd2F5IHRvIGRlc2NyaWJlXG4gKiBzaW5nbGV0b25zLiBJdCByZXByZXNlbnRzIHRoZSAnYWxyZWFkeSBjb25zdHJ1Y3RlZCBtYXJrZXInIHVzZWQgaW4gY3VzdG9tXG4gKiBlbGVtZW50IGNvbnN0cnVjdGlvbiBzdGFja3MuXG4gKlxuICogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy8jY29uY2VwdC1hbHJlYWR5LWNvbnN0cnVjdGVkLW1hcmtlclxuICovXG5jbGFzcyBBbHJlYWR5Q29uc3RydWN0ZWRNYXJrZXIge31cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEFscmVhZHlDb25zdHJ1Y3RlZE1hcmtlcigpO1xuIiwiaW1wb3J0IE5hdGl2ZSBmcm9tICcuL05hdGl2ZS5qcyc7XG5pbXBvcnQgQ3VzdG9tRWxlbWVudEludGVybmFscyBmcm9tICcuLi9DdXN0b21FbGVtZW50SW50ZXJuYWxzLmpzJztcbmltcG9ydCBDRVN0YXRlIGZyb20gJy4uL0N1c3RvbUVsZW1lbnRTdGF0ZS5qcyc7XG5pbXBvcnQgQWxyZWFkeUNvbnN0cnVjdGVkTWFya2VyIGZyb20gJy4uL0FscmVhZHlDb25zdHJ1Y3RlZE1hcmtlci5qcyc7XG5cbi8qKlxuICogQHBhcmFtIHshQ3VzdG9tRWxlbWVudEludGVybmFsc30gaW50ZXJuYWxzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGludGVybmFscykge1xuICB3aW5kb3dbJ0hUTUxFbGVtZW50J10gPSAoZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKG5ldzogSFRNTEVsZW1lbnQpOiAhSFRNTEVsZW1lbnR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gSFRNTEVsZW1lbnQoKSB7XG4gICAgICAvLyBUaGlzIHNob3VsZCByZWFsbHkgYmUgYG5ldy50YXJnZXRgIGJ1dCBgbmV3LnRhcmdldGAgY2FuJ3QgYmUgZW11bGF0ZWRcbiAgICAgIC8vIGluIEVTNS4gQXNzdW1pbmcgdGhlIHVzZXIga2VlcHMgdGhlIGRlZmF1bHQgdmFsdWUgb2YgdGhlIGNvbnN0cnVjdG9yJ3NcbiAgICAgIC8vIHByb3RvdHlwZSdzIGBjb25zdHJ1Y3RvcmAgcHJvcGVydHksIHRoaXMgaXMgZXF1aXZhbGVudC5cbiAgICAgIC8qKiBAdHlwZSB7IUZ1bmN0aW9ufSAqL1xuICAgICAgY29uc3QgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuXG4gICAgICBjb25zdCBkZWZpbml0aW9uID0gaW50ZXJuYWxzLmNvbnN0cnVjdG9yVG9EZWZpbml0aW9uKGNvbnN0cnVjdG9yKTtcbiAgICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjdXN0b20gZWxlbWVudCBiZWluZyBjb25zdHJ1Y3RlZCB3YXMgbm90IHJlZ2lzdGVyZWQgd2l0aCBgY3VzdG9tRWxlbWVudHNgLicpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb25zdHJ1Y3Rpb25TdGFjayA9IGRlZmluaXRpb24uY29uc3RydWN0aW9uU3RhY2s7XG5cbiAgICAgIGlmIChjb25zdHJ1Y3Rpb25TdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IE5hdGl2ZS5Eb2N1bWVudF9jcmVhdGVFbGVtZW50LmNhbGwoZG9jdW1lbnQsIGRlZmluaXRpb24ubG9jYWxOYW1lKTtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGVsZW1lbnQsIGNvbnN0cnVjdG9yLnByb3RvdHlwZSk7XG4gICAgICAgIGVsZW1lbnQuX19DRV9zdGF0ZSA9IENFU3RhdGUuY3VzdG9tO1xuICAgICAgICBlbGVtZW50Ll9fQ0VfZGVmaW5pdGlvbiA9IGRlZmluaXRpb247XG4gICAgICAgIGludGVybmFscy5wYXRjaChlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxhc3RJbmRleCA9IGNvbnN0cnVjdGlvblN0YWNrLmxlbmd0aCAtIDE7XG4gICAgICBjb25zdCBlbGVtZW50ID0gY29uc3RydWN0aW9uU3RhY2tbbGFzdEluZGV4XTtcbiAgICAgIGlmIChlbGVtZW50ID09PSBBbHJlYWR5Q29uc3RydWN0ZWRNYXJrZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgSFRNTEVsZW1lbnQgY29uc3RydWN0b3Igd2FzIGVpdGhlciBjYWxsZWQgcmVlbnRyYW50bHkgZm9yIHRoaXMgY29uc3RydWN0b3Igb3IgY2FsbGVkIG11bHRpcGxlIHRpbWVzLicpO1xuICAgICAgfVxuICAgICAgY29uc3RydWN0aW9uU3RhY2tbbGFzdEluZGV4XSA9IEFscmVhZHlDb25zdHJ1Y3RlZE1hcmtlcjtcblxuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGVsZW1lbnQsIGNvbnN0cnVjdG9yLnByb3RvdHlwZSk7XG4gICAgICBpbnRlcm5hbHMucGF0Y2goLyoqIEB0eXBlIHshSFRNTEVsZW1lbnR9ICovIChlbGVtZW50KSk7XG5cbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cblxuICAgIEhUTUxFbGVtZW50LnByb3RvdHlwZSA9IE5hdGl2ZS5IVE1MRWxlbWVudC5wcm90b3R5cGU7XG5cbiAgICByZXR1cm4gSFRNTEVsZW1lbnQ7XG4gIH0pKCk7XG59O1xuIiwiaW1wb3J0IEN1c3RvbUVsZW1lbnRJbnRlcm5hbHMgZnJvbSAnLi4vLi4vQ3VzdG9tRWxlbWVudEludGVybmFscy5qcyc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi4vLi4vVXRpbGl0aWVzLmpzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7e1xuICogICBwcmVwZW5kOiAhZnVuY3Rpb24oLi4uKCFOb2RlfHN0cmluZykpLFxuICAqICBhcHBlbmQ6ICFmdW5jdGlvbiguLi4oIU5vZGV8c3RyaW5nKSksXG4gKiB9fVxuICovXG5sZXQgUGFyZW50Tm9kZU5hdGl2ZU1ldGhvZHM7XG5cbi8qKlxuICogQHBhcmFtIHshQ3VzdG9tRWxlbWVudEludGVybmFsc30gaW50ZXJuYWxzXG4gKiBAcGFyYW0geyFPYmplY3R9IGRlc3RpbmF0aW9uXG4gKiBAcGFyYW0geyFQYXJlbnROb2RlTmF0aXZlTWV0aG9kc30gYnVpbHRJblxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnRlcm5hbHMsIGRlc3RpbmF0aW9uLCBidWlsdEluKSB7XG4gIC8qKlxuICAgKiBAcGFyYW0gey4uLighTm9kZXxzdHJpbmcpfSBub2Rlc1xuICAgKi9cbiAgZGVzdGluYXRpb25bJ3ByZXBlbmQnXSA9IGZ1bmN0aW9uKC4uLm5vZGVzKSB7XG4gICAgLy8gVE9ETzogRml4IHRoaXMgZm9yIHdoZW4gb25lIG9mIGBub2Rlc2AgaXMgYSBEb2N1bWVudEZyYWdtZW50IVxuICAgIGNvbnN0IGNvbm5lY3RlZEJlZm9yZSA9IC8qKiBAdHlwZSB7IUFycmF5PCFOb2RlPn0gKi8gKG5vZGVzLmZpbHRlcihub2RlID0+IHtcbiAgICAgIC8vIERvY3VtZW50RnJhZ21lbnRzIGFyZSBub3QgY29ubmVjdGVkIGFuZCB3aWxsIG5vdCBiZSBhZGRlZCB0byB0aGUgbGlzdC5cbiAgICAgIHJldHVybiBub2RlIGluc3RhbmNlb2YgTm9kZSAmJiBVdGlsaXRpZXMuaXNDb25uZWN0ZWQobm9kZSk7XG4gICAgfSkpO1xuXG4gICAgYnVpbHRJbi5wcmVwZW5kLmFwcGx5KHRoaXMsIG5vZGVzKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29ubmVjdGVkQmVmb3JlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpbnRlcm5hbHMuZGlzY29ubmVjdFRyZWUoY29ubmVjdGVkQmVmb3JlW2ldKTtcbiAgICB9XG5cbiAgICBpZiAoVXRpbGl0aWVzLmlzQ29ubmVjdGVkKHRoaXMpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgICAgaW50ZXJuYWxzLmNvbm5lY3RUcmVlKG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gey4uLighTm9kZXxzdHJpbmcpfSBub2Rlc1xuICAgKi9cbiAgZGVzdGluYXRpb25bJ2FwcGVuZCddID0gZnVuY3Rpb24oLi4ubm9kZXMpIHtcbiAgICAvLyBUT0RPOiBGaXggdGhpcyBmb3Igd2hlbiBvbmUgb2YgYG5vZGVzYCBpcyBhIERvY3VtZW50RnJhZ21lbnQhXG4gICAgY29uc3QgY29ubmVjdGVkQmVmb3JlID0gLyoqIEB0eXBlIHshQXJyYXk8IU5vZGU+fSAqLyAobm9kZXMuZmlsdGVyKG5vZGUgPT4ge1xuICAgICAgLy8gRG9jdW1lbnRGcmFnbWVudHMgYXJlIG5vdCBjb25uZWN0ZWQgYW5kIHdpbGwgbm90IGJlIGFkZGVkIHRvIHRoZSBsaXN0LlxuICAgICAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBOb2RlICYmIFV0aWxpdGllcy5pc0Nvbm5lY3RlZChub2RlKTtcbiAgICB9KSk7XG5cbiAgICBidWlsdEluLmFwcGVuZC5hcHBseSh0aGlzLCBub2Rlcyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbm5lY3RlZEJlZm9yZS5sZW5ndGg7IGkrKykge1xuICAgICAgaW50ZXJuYWxzLmRpc2Nvbm5lY3RUcmVlKGNvbm5lY3RlZEJlZm9yZVtpXSk7XG4gICAgfVxuXG4gICAgaWYgKFV0aWxpdGllcy5pc0Nvbm5lY3RlZCh0aGlzKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICAgIGludGVybmFscy5jb25uZWN0VHJlZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn07XG4iLCJpbXBvcnQgTmF0aXZlIGZyb20gJy4vTmF0aXZlLmpzJztcbmltcG9ydCBDdXN0b21FbGVtZW50SW50ZXJuYWxzIGZyb20gJy4uL0N1c3RvbUVsZW1lbnRJbnRlcm5hbHMuanMnO1xuaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gJy4uL1V0aWxpdGllcy5qcyc7XG5cbmltcG9ydCBQYXRjaFBhcmVudE5vZGUgZnJvbSAnLi9JbnRlcmZhY2UvUGFyZW50Tm9kZS5qcyc7XG5cbi8qKlxuICogQHBhcmFtIHshQ3VzdG9tRWxlbWVudEludGVybmFsc30gaW50ZXJuYWxzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGludGVybmFscykge1xuICBVdGlsaXRpZXMuc2V0UHJvcGVydHlVbmNoZWNrZWQoRG9jdW1lbnQucHJvdG90eXBlLCAnY3JlYXRlRWxlbWVudCcsXG4gICAgLyoqXG4gICAgICogQHRoaXMge0RvY3VtZW50fVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbE5hbWVcbiAgICAgKiBAcmV0dXJuIHshRWxlbWVudH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbihsb2NhbE5hbWUpIHtcbiAgICAgIC8vIE9ubHkgY3JlYXRlIGN1c3RvbSBlbGVtZW50cyBpZiB0aGlzIGRvY3VtZW50IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVnaXN0cnkuXG4gICAgICBpZiAodGhpcy5fX0NFX2hhc1JlZ2lzdHJ5KSB7XG4gICAgICAgIGNvbnN0IGRlZmluaXRpb24gPSBpbnRlcm5hbHMubG9jYWxOYW1lVG9EZWZpbml0aW9uKGxvY2FsTmFtZSk7XG4gICAgICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyAoZGVmaW5pdGlvbi5jb25zdHJ1Y3RvcikoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSAvKiogQHR5cGUgeyFFbGVtZW50fSAqL1xuICAgICAgICAoTmF0aXZlLkRvY3VtZW50X2NyZWF0ZUVsZW1lbnQuY2FsbCh0aGlzLCBsb2NhbE5hbWUpKTtcbiAgICAgIGludGVybmFscy5wYXRjaChyZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcblxuICBVdGlsaXRpZXMuc2V0UHJvcGVydHlVbmNoZWNrZWQoRG9jdW1lbnQucHJvdG90eXBlLCAnaW1wb3J0Tm9kZScsXG4gICAgLyoqXG4gICAgICogQHRoaXMge0RvY3VtZW50fVxuICAgICAqIEBwYXJhbSB7IU5vZGV9IG5vZGVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBkZWVwXG4gICAgICogQHJldHVybiB7IU5vZGV9XG4gICAgICovXG4gICAgZnVuY3Rpb24obm9kZSwgZGVlcCkge1xuICAgICAgY29uc3QgY2xvbmUgPSBOYXRpdmUuRG9jdW1lbnRfaW1wb3J0Tm9kZS5jYWxsKHRoaXMsIG5vZGUsIGRlZXApO1xuICAgICAgLy8gT25seSBjcmVhdGUgY3VzdG9tIGVsZW1lbnRzIGlmIHRoaXMgZG9jdW1lbnQgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSByZWdpc3RyeS5cbiAgICAgIGlmICghdGhpcy5fX0NFX2hhc1JlZ2lzdHJ5KSB7XG4gICAgICAgIGludGVybmFscy5wYXRjaFRyZWUoY2xvbmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW50ZXJuYWxzLnBhdGNoQW5kVXBncmFkZVRyZWUoY2xvbmUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNsb25lO1xuICAgIH0pO1xuXG4gIGNvbnN0IE5TX0hUTUwgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIjtcblxuICBVdGlsaXRpZXMuc2V0UHJvcGVydHlVbmNoZWNrZWQoRG9jdW1lbnQucHJvdG90eXBlLCAnY3JlYXRlRWxlbWVudE5TJyxcbiAgICAvKipcbiAgICAgKiBAdGhpcyB7RG9jdW1lbnR9XG4gICAgICogQHBhcmFtIHs/c3RyaW5nfSBuYW1lc3BhY2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxOYW1lXG4gICAgICogQHJldHVybiB7IUVsZW1lbnR9XG4gICAgICovXG4gICAgZnVuY3Rpb24obmFtZXNwYWNlLCBsb2NhbE5hbWUpIHtcbiAgICAgIC8vIE9ubHkgY3JlYXRlIGN1c3RvbSBlbGVtZW50cyBpZiB0aGlzIGRvY3VtZW50IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVnaXN0cnkuXG4gICAgICBpZiAodGhpcy5fX0NFX2hhc1JlZ2lzdHJ5ICYmIChuYW1lc3BhY2UgPT09IG51bGwgfHwgbmFtZXNwYWNlID09PSBOU19IVE1MKSkge1xuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gaW50ZXJuYWxzLmxvY2FsTmFtZVRvRGVmaW5pdGlvbihsb2NhbE5hbWUpO1xuICAgICAgICBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgICAgIHJldHVybiBuZXcgKGRlZmluaXRpb24uY29uc3RydWN0b3IpKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gLyoqIEB0eXBlIHshRWxlbWVudH0gKi9cbiAgICAgICAgKE5hdGl2ZS5Eb2N1bWVudF9jcmVhdGVFbGVtZW50TlMuY2FsbCh0aGlzLCBuYW1lc3BhY2UsIGxvY2FsTmFtZSkpO1xuICAgICAgaW50ZXJuYWxzLnBhdGNoKHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gIFBhdGNoUGFyZW50Tm9kZShpbnRlcm5hbHMsIERvY3VtZW50LnByb3RvdHlwZSwge1xuICAgIHByZXBlbmQ6IE5hdGl2ZS5Eb2N1bWVudF9wcmVwZW5kLFxuICAgIGFwcGVuZDogTmF0aXZlLkRvY3VtZW50X2FwcGVuZCxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IE5hdGl2ZSBmcm9tICcuL05hdGl2ZS5qcyc7XG5pbXBvcnQgQ3VzdG9tRWxlbWVudEludGVybmFscyBmcm9tICcuLi9DdXN0b21FbGVtZW50SW50ZXJuYWxzLmpzJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuLi9VdGlsaXRpZXMuanMnO1xuXG4vKipcbiAqIEBwYXJhbSB7IUN1c3RvbUVsZW1lbnRJbnRlcm5hbHN9IGludGVybmFsc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnRlcm5hbHMpIHtcbiAgLy8gYE5vZGUjbm9kZVZhbHVlYCBpcyBpbXBsZW1lbnRlZCBvbiBgQXR0cmAuXG4gIC8vIGBOb2RlI3RleHRDb250ZW50YCBpcyBpbXBsZW1lbnRlZCBvbiBgQXR0cmAsIGBFbGVtZW50YC5cblxuICBVdGlsaXRpZXMuc2V0UHJvcGVydHlVbmNoZWNrZWQoTm9kZS5wcm90b3R5cGUsICdpbnNlcnRCZWZvcmUnLFxuICAgIC8qKlxuICAgICAqIEB0aGlzIHtOb2RlfVxuICAgICAqIEBwYXJhbSB7IU5vZGV9IG5vZGVcbiAgICAgKiBAcGFyYW0gez9Ob2RlfSByZWZOb2RlXG4gICAgICogQHJldHVybiB7IU5vZGV9XG4gICAgICovXG4gICAgZnVuY3Rpb24obm9kZSwgcmVmTm9kZSkge1xuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgIGNvbnN0IGluc2VydGVkTm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkobm9kZS5jaGlsZE5vZGVzKTtcbiAgICAgICAgY29uc3QgbmF0aXZlUmVzdWx0ID0gTmF0aXZlLk5vZGVfaW5zZXJ0QmVmb3JlLmNhbGwodGhpcywgbm9kZSwgcmVmTm9kZSk7XG5cbiAgICAgICAgLy8gRG9jdW1lbnRGcmFnbWVudHMgY2FuJ3QgYmUgY29ubmVjdGVkLCBzbyBgZGlzY29ubmVjdFRyZWVgIHdpbGwgbmV2ZXJcbiAgICAgICAgLy8gbmVlZCB0byBiZSBjYWxsZWQgb24gYSBEb2N1bWVudEZyYWdtZW50J3MgY2hpbGRyZW4gYWZ0ZXIgaW5zZXJ0aW5nIGl0LlxuXG4gICAgICAgIGlmIChVdGlsaXRpZXMuaXNDb25uZWN0ZWQodGhpcykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluc2VydGVkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGludGVybmFscy5jb25uZWN0VHJlZShpbnNlcnRlZE5vZGVzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmF0aXZlUmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub2RlV2FzQ29ubmVjdGVkID0gVXRpbGl0aWVzLmlzQ29ubmVjdGVkKG5vZGUpO1xuICAgICAgY29uc3QgbmF0aXZlUmVzdWx0ID0gTmF0aXZlLk5vZGVfaW5zZXJ0QmVmb3JlLmNhbGwodGhpcywgbm9kZSwgcmVmTm9kZSk7XG5cbiAgICAgIGlmIChub2RlV2FzQ29ubmVjdGVkKSB7XG4gICAgICAgIGludGVybmFscy5kaXNjb25uZWN0VHJlZShub2RlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFV0aWxpdGllcy5pc0Nvbm5lY3RlZCh0aGlzKSkge1xuICAgICAgICBpbnRlcm5hbHMuY29ubmVjdFRyZWUobm9kZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuYXRpdmVSZXN1bHQ7XG4gICAgfSk7XG5cbiAgVXRpbGl0aWVzLnNldFByb3BlcnR5VW5jaGVja2VkKE5vZGUucHJvdG90eXBlLCAnYXBwZW5kQ2hpbGQnLFxuICAgIC8qKlxuICAgICAqIEB0aGlzIHtOb2RlfVxuICAgICAqIEBwYXJhbSB7IU5vZGV9IG5vZGVcbiAgICAgKiBAcmV0dXJuIHshTm9kZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbihub2RlKSB7XG4gICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgICAgY29uc3QgaW5zZXJ0ZWROb2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShub2RlLmNoaWxkTm9kZXMpO1xuICAgICAgICBjb25zdCBuYXRpdmVSZXN1bHQgPSBOYXRpdmUuTm9kZV9hcHBlbmRDaGlsZC5jYWxsKHRoaXMsIG5vZGUpO1xuXG4gICAgICAgIC8vIERvY3VtZW50RnJhZ21lbnRzIGNhbid0IGJlIGNvbm5lY3RlZCwgc28gYGRpc2Nvbm5lY3RUcmVlYCB3aWxsIG5ldmVyXG4gICAgICAgIC8vIG5lZWQgdG8gYmUgY2FsbGVkIG9uIGEgRG9jdW1lbnRGcmFnbWVudCdzIGNoaWxkcmVuIGFmdGVyIGluc2VydGluZyBpdC5cblxuICAgICAgICBpZiAoVXRpbGl0aWVzLmlzQ29ubmVjdGVkKHRoaXMpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnNlcnRlZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpbnRlcm5hbHMuY29ubmVjdFRyZWUoaW5zZXJ0ZWROb2Rlc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5hdGl2ZVJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgbm9kZVdhc0Nvbm5lY3RlZCA9IFV0aWxpdGllcy5pc0Nvbm5lY3RlZChub2RlKTtcbiAgICAgIGNvbnN0IG5hdGl2ZVJlc3VsdCA9IE5hdGl2ZS5Ob2RlX2FwcGVuZENoaWxkLmNhbGwodGhpcywgbm9kZSk7XG5cbiAgICAgIGlmIChub2RlV2FzQ29ubmVjdGVkKSB7XG4gICAgICAgIGludGVybmFscy5kaXNjb25uZWN0VHJlZShub2RlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFV0aWxpdGllcy5pc0Nvbm5lY3RlZCh0aGlzKSkge1xuICAgICAgICBpbnRlcm5hbHMuY29ubmVjdFRyZWUobm9kZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuYXRpdmVSZXN1bHQ7XG4gICAgfSk7XG5cbiAgVXRpbGl0aWVzLnNldFByb3BlcnR5VW5jaGVja2VkKE5vZGUucHJvdG90eXBlLCAnY2xvbmVOb2RlJyxcbiAgICAvKipcbiAgICAgKiBAdGhpcyB7Tm9kZX1cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBkZWVwXG4gICAgICogQHJldHVybiB7IU5vZGV9XG4gICAgICovXG4gICAgZnVuY3Rpb24oZGVlcCkge1xuICAgICAgY29uc3QgY2xvbmUgPSBOYXRpdmUuTm9kZV9jbG9uZU5vZGUuY2FsbCh0aGlzLCBkZWVwKTtcbiAgICAgIC8vIE9ubHkgY3JlYXRlIGN1c3RvbSBlbGVtZW50cyBpZiB0aGlzIGVsZW1lbnQncyBvd25lciBkb2N1bWVudCBpc1xuICAgICAgLy8gYXNzb2NpYXRlZCB3aXRoIHRoZSByZWdpc3RyeS5cbiAgICAgIGlmICghdGhpcy5vd25lckRvY3VtZW50Ll9fQ0VfaGFzUmVnaXN0cnkpIHtcbiAgICAgICAgaW50ZXJuYWxzLnBhdGNoVHJlZShjbG9uZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnRlcm5hbHMucGF0Y2hBbmRVcGdyYWRlVHJlZShjbG9uZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2xvbmU7XG4gICAgfSk7XG5cbiAgVXRpbGl0aWVzLnNldFByb3BlcnR5VW5jaGVja2VkKE5vZGUucHJvdG90eXBlLCAncmVtb3ZlQ2hpbGQnLFxuICAgIC8qKlxuICAgICAqIEB0aGlzIHtOb2RlfVxuICAgICAqIEBwYXJhbSB7IU5vZGV9IG5vZGVcbiAgICAgKiBAcmV0dXJuIHshTm9kZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbihub2RlKSB7XG4gICAgICBjb25zdCBub2RlV2FzQ29ubmVjdGVkID0gVXRpbGl0aWVzLmlzQ29ubmVjdGVkKG5vZGUpO1xuICAgICAgY29uc3QgbmF0aXZlUmVzdWx0ID0gTmF0aXZlLk5vZGVfcmVtb3ZlQ2hpbGQuY2FsbCh0aGlzLCBub2RlKTtcblxuICAgICAgaWYgKG5vZGVXYXNDb25uZWN0ZWQpIHtcbiAgICAgICAgaW50ZXJuYWxzLmRpc2Nvbm5lY3RUcmVlKG5vZGUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmF0aXZlUmVzdWx0O1xuICAgIH0pO1xuXG4gIFV0aWxpdGllcy5zZXRQcm9wZXJ0eVVuY2hlY2tlZChOb2RlLnByb3RvdHlwZSwgJ3JlcGxhY2VDaGlsZCcsXG4gICAgLyoqXG4gICAgICogQHRoaXMge05vZGV9XG4gICAgICogQHBhcmFtIHshTm9kZX0gbm9kZVRvSW5zZXJ0XG4gICAgICogQHBhcmFtIHshTm9kZX0gbm9kZVRvUmVtb3ZlXG4gICAgICogQHJldHVybiB7IU5vZGV9XG4gICAgICovXG4gICAgZnVuY3Rpb24obm9kZVRvSW5zZXJ0LCBub2RlVG9SZW1vdmUpIHtcbiAgICAgIGlmIChub2RlVG9JbnNlcnQgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgIGNvbnN0IGluc2VydGVkTm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkobm9kZVRvSW5zZXJ0LmNoaWxkTm9kZXMpO1xuICAgICAgICBjb25zdCBuYXRpdmVSZXN1bHQgPSBOYXRpdmUuTm9kZV9yZXBsYWNlQ2hpbGQuY2FsbCh0aGlzLCBub2RlVG9JbnNlcnQsIG5vZGVUb1JlbW92ZSk7XG5cbiAgICAgICAgLy8gRG9jdW1lbnRGcmFnbWVudHMgY2FuJ3QgYmUgY29ubmVjdGVkLCBzbyBgZGlzY29ubmVjdFRyZWVgIHdpbGwgbmV2ZXJcbiAgICAgICAgLy8gbmVlZCB0byBiZSBjYWxsZWQgb24gYSBEb2N1bWVudEZyYWdtZW50J3MgY2hpbGRyZW4gYWZ0ZXIgaW5zZXJ0aW5nIGl0LlxuXG4gICAgICAgIGlmIChVdGlsaXRpZXMuaXNDb25uZWN0ZWQodGhpcykpIHtcbiAgICAgICAgICBpbnRlcm5hbHMuZGlzY29ubmVjdFRyZWUobm9kZVRvUmVtb3ZlKTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluc2VydGVkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGludGVybmFscy5jb25uZWN0VHJlZShpbnNlcnRlZE5vZGVzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmF0aXZlUmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub2RlVG9JbnNlcnRXYXNDb25uZWN0ZWQgPSBVdGlsaXRpZXMuaXNDb25uZWN0ZWQobm9kZVRvSW5zZXJ0KTtcbiAgICAgIGNvbnN0IG5hdGl2ZVJlc3VsdCA9IE5hdGl2ZS5Ob2RlX3JlcGxhY2VDaGlsZC5jYWxsKHRoaXMsIG5vZGVUb0luc2VydCwgbm9kZVRvUmVtb3ZlKTtcbiAgICAgIGNvbnN0IHRoaXNJc0Nvbm5lY3RlZCA9IFV0aWxpdGllcy5pc0Nvbm5lY3RlZCh0aGlzKTtcblxuICAgICAgaWYgKHRoaXNJc0Nvbm5lY3RlZCkge1xuICAgICAgICBpbnRlcm5hbHMuZGlzY29ubmVjdFRyZWUobm9kZVRvUmVtb3ZlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGVUb0luc2VydFdhc0Nvbm5lY3RlZCkge1xuICAgICAgICBpbnRlcm5hbHMuZGlzY29ubmVjdFRyZWUobm9kZVRvSW5zZXJ0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXNJc0Nvbm5lY3RlZCkge1xuICAgICAgICBpbnRlcm5hbHMuY29ubmVjdFRyZWUobm9kZVRvSW5zZXJ0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hdGl2ZVJlc3VsdDtcbiAgICB9KTtcblxuXG4gIGZ1bmN0aW9uIHBhdGNoX3RleHRDb250ZW50KGRlc3RpbmF0aW9uLCBiYXNlRGVzY3JpcHRvcikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXN0aW5hdGlvbiwgJ3RleHRDb250ZW50Jywge1xuICAgICAgZW51bWVyYWJsZTogYmFzZURlc2NyaXB0b3IuZW51bWVyYWJsZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogYmFzZURlc2NyaXB0b3IuZ2V0LFxuICAgICAgc2V0OiAvKiogQHRoaXMge05vZGV9ICovIGZ1bmN0aW9uKGFzc2lnbmVkVmFsdWUpIHtcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHRleHQgbm9kZSB0aGVuIHRoZXJlIGFyZSBubyBub2RlcyB0byBkaXNjb25uZWN0LlxuICAgICAgICBpZiAodGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgICBiYXNlRGVzY3JpcHRvci5zZXQuY2FsbCh0aGlzLCBhc3NpZ25lZFZhbHVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVtb3ZlZE5vZGVzID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyBDaGVja2luZyBmb3IgYGZpcnN0Q2hpbGRgIGlzIGZhc3RlciB0aGFuIHJlYWRpbmcgYGNoaWxkTm9kZXMubGVuZ3RoYFxuICAgICAgICAvLyB0byBjb21wYXJlIHdpdGggMC5cbiAgICAgICAgaWYgKHRoaXMuZmlyc3RDaGlsZCkge1xuICAgICAgICAgIC8vIFVzaW5nIGBjaGlsZE5vZGVzYCBpcyBmYXN0ZXIgdGhhbiBgY2hpbGRyZW5gLCBldmVuIHRob3VnaCB3ZSBvbmx5XG4gICAgICAgICAgLy8gY2FyZSBhYm91dCBlbGVtZW50cy5cbiAgICAgICAgICBjb25zdCBjaGlsZE5vZGVzID0gdGhpcy5jaGlsZE5vZGVzO1xuICAgICAgICAgIGNvbnN0IGNoaWxkTm9kZXNMZW5ndGggPSBjaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICBpZiAoY2hpbGROb2Rlc0xlbmd0aCA+IDAgJiYgVXRpbGl0aWVzLmlzQ29ubmVjdGVkKHRoaXMpKSB7XG4gICAgICAgICAgICAvLyBDb3B5aW5nIGFuIGFycmF5IGJ5IGl0ZXJhdGluZyBpcyBmYXN0ZXIgdGhhbiB1c2luZyBzbGljZS5cbiAgICAgICAgICAgIHJlbW92ZWROb2RlcyA9IG5ldyBBcnJheShjaGlsZE5vZGVzTGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGROb2Rlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHJlbW92ZWROb2Rlc1tpXSA9IGNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYmFzZURlc2NyaXB0b3Iuc2V0LmNhbGwodGhpcywgYXNzaWduZWRWYWx1ZSk7XG5cbiAgICAgICAgaWYgKHJlbW92ZWROb2Rlcykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVtb3ZlZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpbnRlcm5hbHMuZGlzY29ubmVjdFRyZWUocmVtb3ZlZE5vZGVzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBpZiAoTmF0aXZlLk5vZGVfdGV4dENvbnRlbnQgJiYgTmF0aXZlLk5vZGVfdGV4dENvbnRlbnQuZ2V0KSB7XG4gICAgcGF0Y2hfdGV4dENvbnRlbnQoTm9kZS5wcm90b3R5cGUsIE5hdGl2ZS5Ob2RlX3RleHRDb250ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBpbnRlcm5hbHMuYWRkUGF0Y2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgcGF0Y2hfdGV4dENvbnRlbnQoZWxlbWVudCwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIC8vIE5PVEU6IFRoaXMgaW1wbGVtZW50YXRpb24gb2YgdGhlIGB0ZXh0Q29udGVudGAgZ2V0dGVyIGFzc3VtZXMgdGhhdFxuICAgICAgICAvLyB0ZXh0IG5vZGVzJyBgdGV4dENvbnRlbnRgIGdldHRlciB3aWxsIG5vdCBiZSBwYXRjaGVkLlxuICAgICAgICBnZXQ6IC8qKiBAdGhpcyB7Tm9kZX0gKi8gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLyoqIEB0eXBlIHshQXJyYXk8c3RyaW5nPn0gKi9cbiAgICAgICAgICBjb25zdCBwYXJ0cyA9IFtdO1xuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2godGhpcy5jaGlsZE5vZGVzW2ldLnRleHRDb250ZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcGFydHMuam9pbignJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogLyoqIEB0aGlzIHtOb2RlfSAqLyBmdW5jdGlvbihhc3NpZ25lZFZhbHVlKSB7XG4gICAgICAgICAgd2hpbGUgKHRoaXMuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgTmF0aXZlLk5vZGVfcmVtb3ZlQ2hpbGQuY2FsbCh0aGlzLCB0aGlzLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBOYXRpdmUuTm9kZV9hcHBlbmRDaGlsZC5jYWxsKHRoaXMsIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFzc2lnbmVkVmFsdWUpKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuIiwiaW1wb3J0IEN1c3RvbUVsZW1lbnRJbnRlcm5hbHMgZnJvbSAnLi4vLi4vQ3VzdG9tRWxlbWVudEludGVybmFscy5qcyc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi4vLi4vVXRpbGl0aWVzLmpzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7e1xuICogICBiZWZvcmU6ICFmdW5jdGlvbiguLi4oIU5vZGV8c3RyaW5nKSksXG4gKiAgIGFmdGVyOiAhZnVuY3Rpb24oLi4uKCFOb2RlfHN0cmluZykpLFxuICogICByZXBsYWNlV2l0aDogIWZ1bmN0aW9uKC4uLighTm9kZXxzdHJpbmcpKSxcbiAqICAgcmVtb3ZlOiAhZnVuY3Rpb24oKSxcbiAqIH19XG4gKi9cbmxldCBDaGlsZE5vZGVOYXRpdmVNZXRob2RzO1xuXG4vKipcbiAqIEBwYXJhbSB7IUN1c3RvbUVsZW1lbnRJbnRlcm5hbHN9IGludGVybmFsc1xuICogQHBhcmFtIHshT2JqZWN0fSBkZXN0aW5hdGlvblxuICogQHBhcmFtIHshQ2hpbGROb2RlTmF0aXZlTWV0aG9kc30gYnVpbHRJblxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnRlcm5hbHMsIGRlc3RpbmF0aW9uLCBidWlsdEluKSB7XG4gIC8qKlxuICAgKiBAcGFyYW0gey4uLighTm9kZXxzdHJpbmcpfSBub2Rlc1xuICAgKi9cbiAgZGVzdGluYXRpb25bJ2JlZm9yZSddID0gZnVuY3Rpb24oLi4ubm9kZXMpIHtcbiAgICAvLyBUT0RPOiBGaXggdGhpcyBmb3Igd2hlbiBvbmUgb2YgYG5vZGVzYCBpcyBhIERvY3VtZW50RnJhZ21lbnQhXG4gICAgY29uc3QgY29ubmVjdGVkQmVmb3JlID0gLyoqIEB0eXBlIHshQXJyYXk8IU5vZGU+fSAqLyAobm9kZXMuZmlsdGVyKG5vZGUgPT4ge1xuICAgICAgLy8gRG9jdW1lbnRGcmFnbWVudHMgYXJlIG5vdCBjb25uZWN0ZWQgYW5kIHdpbGwgbm90IGJlIGFkZGVkIHRvIHRoZSBsaXN0LlxuICAgICAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBOb2RlICYmIFV0aWxpdGllcy5pc0Nvbm5lY3RlZChub2RlKTtcbiAgICB9KSk7XG5cbiAgICBidWlsdEluLmJlZm9yZS5hcHBseSh0aGlzLCBub2Rlcyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbm5lY3RlZEJlZm9yZS5sZW5ndGg7IGkrKykge1xuICAgICAgaW50ZXJuYWxzLmRpc2Nvbm5lY3RUcmVlKGNvbm5lY3RlZEJlZm9yZVtpXSk7XG4gICAgfVxuXG4gICAgaWYgKFV0aWxpdGllcy5pc0Nvbm5lY3RlZCh0aGlzKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICAgIGludGVybmFscy5jb25uZWN0VHJlZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHsuLi4oIU5vZGV8c3RyaW5nKX0gbm9kZXNcbiAgICovXG4gIGRlc3RpbmF0aW9uWydhZnRlciddID0gZnVuY3Rpb24oLi4ubm9kZXMpIHtcbiAgICAvLyBUT0RPOiBGaXggdGhpcyBmb3Igd2hlbiBvbmUgb2YgYG5vZGVzYCBpcyBhIERvY3VtZW50RnJhZ21lbnQhXG4gICAgY29uc3QgY29ubmVjdGVkQmVmb3JlID0gLyoqIEB0eXBlIHshQXJyYXk8IU5vZGU+fSAqLyAobm9kZXMuZmlsdGVyKG5vZGUgPT4ge1xuICAgICAgLy8gRG9jdW1lbnRGcmFnbWVudHMgYXJlIG5vdCBjb25uZWN0ZWQgYW5kIHdpbGwgbm90IGJlIGFkZGVkIHRvIHRoZSBsaXN0LlxuICAgICAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBOb2RlICYmIFV0aWxpdGllcy5pc0Nvbm5lY3RlZChub2RlKTtcbiAgICB9KSk7XG5cbiAgICBidWlsdEluLmFmdGVyLmFwcGx5KHRoaXMsIG5vZGVzKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29ubmVjdGVkQmVmb3JlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpbnRlcm5hbHMuZGlzY29ubmVjdFRyZWUoY29ubmVjdGVkQmVmb3JlW2ldKTtcbiAgICB9XG5cbiAgICBpZiAoVXRpbGl0aWVzLmlzQ29ubmVjdGVkKHRoaXMpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgICAgaW50ZXJuYWxzLmNvbm5lY3RUcmVlKG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gey4uLighTm9kZXxzdHJpbmcpfSBub2Rlc1xuICAgKi9cbiAgZGVzdGluYXRpb25bJ3JlcGxhY2VXaXRoJ10gPSBmdW5jdGlvbiguLi5ub2Rlcykge1xuICAgIC8vIFRPRE86IEZpeCB0aGlzIGZvciB3aGVuIG9uZSBvZiBgbm9kZXNgIGlzIGEgRG9jdW1lbnRGcmFnbWVudCFcbiAgICBjb25zdCBjb25uZWN0ZWRCZWZvcmUgPSAvKiogQHR5cGUgeyFBcnJheTwhTm9kZT59ICovIChub2Rlcy5maWx0ZXIobm9kZSA9PiB7XG4gICAgICAvLyBEb2N1bWVudEZyYWdtZW50cyBhcmUgbm90IGNvbm5lY3RlZCBhbmQgd2lsbCBub3QgYmUgYWRkZWQgdG8gdGhlIGxpc3QuXG4gICAgICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE5vZGUgJiYgVXRpbGl0aWVzLmlzQ29ubmVjdGVkKG5vZGUpO1xuICAgIH0pKTtcblxuICAgIGNvbnN0IHdhc0Nvbm5lY3RlZCA9IFV0aWxpdGllcy5pc0Nvbm5lY3RlZCh0aGlzKTtcblxuICAgIGJ1aWx0SW4ucmVwbGFjZVdpdGguYXBwbHkodGhpcywgbm9kZXMpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb25uZWN0ZWRCZWZvcmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGludGVybmFscy5kaXNjb25uZWN0VHJlZShjb25uZWN0ZWRCZWZvcmVbaV0pO1xuICAgIH1cblxuICAgIGlmICh3YXNDb25uZWN0ZWQpIHtcbiAgICAgIGludGVybmFscy5kaXNjb25uZWN0VHJlZSh0aGlzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICBpbnRlcm5hbHMuY29ubmVjdFRyZWUobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZGVzdGluYXRpb25bJ3JlbW92ZSddID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgd2FzQ29ubmVjdGVkID0gVXRpbGl0aWVzLmlzQ29ubmVjdGVkKHRoaXMpO1xuXG4gICAgYnVpbHRJbi5yZW1vdmUuY2FsbCh0aGlzKTtcblxuICAgIGlmICh3YXNDb25uZWN0ZWQpIHtcbiAgICAgIGludGVybmFscy5kaXNjb25uZWN0VHJlZSh0aGlzKTtcbiAgICB9XG4gIH07XG59O1xuIiwiaW1wb3J0IE5hdGl2ZSBmcm9tICcuL05hdGl2ZS5qcyc7XG5pbXBvcnQgQ3VzdG9tRWxlbWVudEludGVybmFscyBmcm9tICcuLi9DdXN0b21FbGVtZW50SW50ZXJuYWxzLmpzJztcbmltcG9ydCBDRVN0YXRlIGZyb20gJy4uL0N1c3RvbUVsZW1lbnRTdGF0ZS5qcyc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi4vVXRpbGl0aWVzLmpzJztcblxuaW1wb3J0IFBhdGNoUGFyZW50Tm9kZSBmcm9tICcuL0ludGVyZmFjZS9QYXJlbnROb2RlLmpzJztcbmltcG9ydCBQYXRjaENoaWxkTm9kZSBmcm9tICcuL0ludGVyZmFjZS9DaGlsZE5vZGUuanMnO1xuXG4vKipcbiAqIEBwYXJhbSB7IUN1c3RvbUVsZW1lbnRJbnRlcm5hbHN9IGludGVybmFsc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnRlcm5hbHMpIHtcbiAgaWYgKE5hdGl2ZS5FbGVtZW50X2F0dGFjaFNoYWRvdykge1xuICAgIFV0aWxpdGllcy5zZXRQcm9wZXJ0eVVuY2hlY2tlZChFbGVtZW50LnByb3RvdHlwZSwgJ2F0dGFjaFNoYWRvdycsXG4gICAgICAvKipcbiAgICAgICAqIEB0aGlzIHtFbGVtZW50fVxuICAgICAgICogQHBhcmFtIHshe21vZGU6IHN0cmluZ319IGluaXRcbiAgICAgICAqIEByZXR1cm4ge1NoYWRvd1Jvb3R9XG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uKGluaXQpIHtcbiAgICAgICAgY29uc3Qgc2hhZG93Um9vdCA9IE5hdGl2ZS5FbGVtZW50X2F0dGFjaFNoYWRvdy5jYWxsKHRoaXMsIGluaXQpO1xuICAgICAgICB0aGlzLl9fQ0Vfc2hhZG93Um9vdCA9IHNoYWRvd1Jvb3Q7XG4gICAgICAgIHJldHVybiBzaGFkb3dSb290O1xuICAgICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKCdDdXN0b20gRWxlbWVudHM6IGBFbGVtZW50I2F0dGFjaFNoYWRvd2Agd2FzIG5vdCBwYXRjaGVkLicpO1xuICB9XG5cblxuICBmdW5jdGlvbiBwYXRjaF9pbm5lckhUTUwoZGVzdGluYXRpb24sIGJhc2VEZXNjcmlwdG9yKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlc3RpbmF0aW9uLCAnaW5uZXJIVE1MJywge1xuICAgICAgZW51bWVyYWJsZTogYmFzZURlc2NyaXB0b3IuZW51bWVyYWJsZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogYmFzZURlc2NyaXB0b3IuZ2V0LFxuICAgICAgc2V0OiAvKiogQHRoaXMge0VsZW1lbnR9ICovIGZ1bmN0aW9uKGh0bWxTdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaXNDb25uZWN0ZWQgPSBVdGlsaXRpZXMuaXNDb25uZWN0ZWQodGhpcyk7XG5cbiAgICAgICAgLy8gTk9URTogSW4gSUUxMSwgd2hlbiB1c2luZyB0aGUgbmF0aXZlIGBpbm5lckhUTUxgIHNldHRlciwgYWxsIG5vZGVzXG4gICAgICAgIC8vIHRoYXQgd2VyZSBwcmV2aW91c2x5IGRlc2NlbmRhbnRzIG9mIHRoZSBjb250ZXh0IGVsZW1lbnQgaGF2ZSBhbGwgb2ZcbiAgICAgICAgLy8gdGhlaXIgY2hpbGRyZW4gcmVtb3ZlZCBhcyBwYXJ0IG9mIHRoZSBzZXQgLSB0aGUgZW50aXJlIHN1YnRyZWUgaXNcbiAgICAgICAgLy8gJ2Rpc2Fzc2VtYmxlZCcuIFRoaXMgd29yayBhcm91bmQgd2Fsa3MgdGhlIHN1YnRyZWUgKmJlZm9yZSogdXNpbmcgdGhlXG4gICAgICAgIC8vIG5hdGl2ZSBzZXR0ZXIuXG4gICAgICAgIC8qKiBAdHlwZSB7IUFycmF5PCFFbGVtZW50Pnx1bmRlZmluZWR9ICovXG4gICAgICAgIGxldCByZW1vdmVkRWxlbWVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChpc0Nvbm5lY3RlZCkge1xuICAgICAgICAgIHJlbW92ZWRFbGVtZW50cyA9IFtdO1xuICAgICAgICAgIFV0aWxpdGllcy53YWxrRGVlcERlc2NlbmRhbnRFbGVtZW50cyh0aGlzLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50ICE9PSB0aGlzKSB7XG4gICAgICAgICAgICAgIHJlbW92ZWRFbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYmFzZURlc2NyaXB0b3Iuc2V0LmNhbGwodGhpcywgaHRtbFN0cmluZyk7XG5cbiAgICAgICAgaWYgKHJlbW92ZWRFbGVtZW50cykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVtb3ZlZEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gcmVtb3ZlZEVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuX19DRV9zdGF0ZSA9PT0gQ0VTdGF0ZS5jdXN0b20pIHtcbiAgICAgICAgICAgICAgaW50ZXJuYWxzLmRpc2Nvbm5lY3RlZENhbGxiYWNrKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9ubHkgY3JlYXRlIGN1c3RvbSBlbGVtZW50cyBpZiB0aGlzIGVsZW1lbnQncyBvd25lciBkb2N1bWVudCBpc1xuICAgICAgICAvLyBhc3NvY2lhdGVkIHdpdGggdGhlIHJlZ2lzdHJ5LlxuICAgICAgICBpZiAoIXRoaXMub3duZXJEb2N1bWVudC5fX0NFX2hhc1JlZ2lzdHJ5KSB7XG4gICAgICAgICAgaW50ZXJuYWxzLnBhdGNoVHJlZSh0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnRlcm5hbHMucGF0Y2hBbmRVcGdyYWRlVHJlZSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaHRtbFN0cmluZztcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBpZiAoTmF0aXZlLkVsZW1lbnRfaW5uZXJIVE1MICYmIE5hdGl2ZS5FbGVtZW50X2lubmVySFRNTC5nZXQpIHtcbiAgICBwYXRjaF9pbm5lckhUTUwoRWxlbWVudC5wcm90b3R5cGUsIE5hdGl2ZS5FbGVtZW50X2lubmVySFRNTCk7XG4gIH0gZWxzZSBpZiAoTmF0aXZlLkhUTUxFbGVtZW50X2lubmVySFRNTCAmJiBOYXRpdmUuSFRNTEVsZW1lbnRfaW5uZXJIVE1MLmdldCkge1xuICAgIHBhdGNoX2lubmVySFRNTChIVE1MRWxlbWVudC5wcm90b3R5cGUsIE5hdGl2ZS5IVE1MRWxlbWVudF9pbm5lckhUTUwpO1xuICB9IGVsc2Uge1xuXG4gICAgLyoqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH0gKi9cbiAgICBjb25zdCByYXdEaXYgPSBOYXRpdmUuRG9jdW1lbnRfY3JlYXRlRWxlbWVudC5jYWxsKGRvY3VtZW50LCAnZGl2Jyk7XG5cbiAgICBpbnRlcm5hbHMuYWRkUGF0Y2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgcGF0Y2hfaW5uZXJIVE1MKGVsZW1lbnQsIHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAvLyBJbXBsZW1lbnRzIGdldHRpbmcgYGlubmVySFRNTGAgYnkgcGVyZm9ybWluZyBhbiB1bnBhdGNoZWQgYGNsb25lTm9kZWBcbiAgICAgICAgLy8gb2YgdGhlIGVsZW1lbnQgYW5kIHJldHVybmluZyB0aGUgcmVzdWx0aW5nIGVsZW1lbnQncyBgaW5uZXJIVE1MYC5cbiAgICAgICAgLy8gVE9ETzogSXMgdGhpcyB0b28gZXhwZW5zaXZlP1xuICAgICAgICBnZXQ6IC8qKiBAdGhpcyB7RWxlbWVudH0gKi8gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIE5hdGl2ZS5Ob2RlX2Nsb25lTm9kZS5jYWxsKHRoaXMsIHRydWUpLmlubmVySFRNTDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gSW1wbGVtZW50cyBzZXR0aW5nIGBpbm5lckhUTUxgIGJ5IGNyZWF0aW5nIGFuIHVucGF0Y2hlZCBlbGVtZW50LFxuICAgICAgICAvLyBzZXR0aW5nIGBpbm5lckhUTUxgIG9mIHRoYXQgZWxlbWVudCBhbmQgcmVwbGFjaW5nIHRoZSB0YXJnZXRcbiAgICAgICAgLy8gZWxlbWVudCdzIGNoaWxkcmVuIHdpdGggdGhvc2Ugb2YgdGhlIHVucGF0Y2hlZCBlbGVtZW50LlxuICAgICAgICBzZXQ6IC8qKiBAdGhpcyB7RWxlbWVudH0gKi8gZnVuY3Rpb24oYXNzaWduZWRWYWx1ZSkge1xuICAgICAgICAgIC8vIE5PVEU6IHJlLXJvdXRlIHRvIGBjb250ZW50YCBmb3IgYHRlbXBsYXRlYCBlbGVtZW50cy5cbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIGRvIHRoaXMgYmVjYXVzZSBgdGVtcGxhdGUuYXBwZW5kQ2hpbGRgIGRvZXMgbm90XG4gICAgICAgICAgLy8gcm91dGUgaW50byBgdGVtcGxhdGUuY29udGVudGAuXG4gICAgICAgICAgLyoqIEB0eXBlIHshTm9kZX0gKi9cbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5sb2NhbE5hbWUgPT09ICd0ZW1wbGF0ZScgPyAoLyoqIEB0eXBlIHshSFRNTFRlbXBsYXRlRWxlbWVudH0gKi8gKHRoaXMpKS5jb250ZW50IDogdGhpcztcbiAgICAgICAgICByYXdEaXYuaW5uZXJIVE1MID0gYXNzaWduZWRWYWx1ZTtcblxuICAgICAgICAgIHdoaWxlIChjb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgTmF0aXZlLk5vZGVfcmVtb3ZlQ2hpbGQuY2FsbChjb250ZW50LCBjb250ZW50LmNoaWxkTm9kZXNbMF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aGlsZSAocmF3RGl2LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgTmF0aXZlLk5vZGVfYXBwZW5kQ2hpbGQuY2FsbChjb250ZW50LCByYXdEaXYuY2hpbGROb2Rlc1swXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuXG4gIFV0aWxpdGllcy5zZXRQcm9wZXJ0eVVuY2hlY2tlZChFbGVtZW50LnByb3RvdHlwZSwgJ3NldEF0dHJpYnV0ZScsXG4gICAgLyoqXG4gICAgICogQHRoaXMge0VsZW1lbnR9XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3VmFsdWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbihuYW1lLCBuZXdWYWx1ZSkge1xuICAgICAgLy8gRmFzdCBwYXRoIGZvciBub24tY3VzdG9tIGVsZW1lbnRzLlxuICAgICAgaWYgKHRoaXMuX19DRV9zdGF0ZSAhPT0gQ0VTdGF0ZS5jdXN0b20pIHtcbiAgICAgICAgcmV0dXJuIE5hdGl2ZS5FbGVtZW50X3NldEF0dHJpYnV0ZS5jYWxsKHRoaXMsIG5hbWUsIG5ld1ZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb2xkVmFsdWUgPSBOYXRpdmUuRWxlbWVudF9nZXRBdHRyaWJ1dGUuY2FsbCh0aGlzLCBuYW1lKTtcbiAgICAgIE5hdGl2ZS5FbGVtZW50X3NldEF0dHJpYnV0ZS5jYWxsKHRoaXMsIG5hbWUsIG5ld1ZhbHVlKTtcbiAgICAgIG5ld1ZhbHVlID0gTmF0aXZlLkVsZW1lbnRfZ2V0QXR0cmlidXRlLmNhbGwodGhpcywgbmFtZSk7XG4gICAgICBpbnRlcm5hbHMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsIG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSwgbnVsbCk7XG4gICAgfSk7XG5cbiAgVXRpbGl0aWVzLnNldFByb3BlcnR5VW5jaGVja2VkKEVsZW1lbnQucHJvdG90eXBlLCAnc2V0QXR0cmlidXRlTlMnLFxuICAgIC8qKlxuICAgICAqIEB0aGlzIHtFbGVtZW50fVxuICAgICAqIEBwYXJhbSB7P3N0cmluZ30gbmFtZXNwYWNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3VmFsdWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbihuYW1lc3BhY2UsIG5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgICAvLyBGYXN0IHBhdGggZm9yIG5vbi1jdXN0b20gZWxlbWVudHMuXG4gICAgICBpZiAodGhpcy5fX0NFX3N0YXRlICE9PSBDRVN0YXRlLmN1c3RvbSkge1xuICAgICAgICByZXR1cm4gTmF0aXZlLkVsZW1lbnRfc2V0QXR0cmlidXRlTlMuY2FsbCh0aGlzLCBuYW1lc3BhY2UsIG5hbWUsIG5ld1ZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb2xkVmFsdWUgPSBOYXRpdmUuRWxlbWVudF9nZXRBdHRyaWJ1dGVOUy5jYWxsKHRoaXMsIG5hbWVzcGFjZSwgbmFtZSk7XG4gICAgICBOYXRpdmUuRWxlbWVudF9zZXRBdHRyaWJ1dGVOUy5jYWxsKHRoaXMsIG5hbWVzcGFjZSwgbmFtZSwgbmV3VmFsdWUpO1xuICAgICAgbmV3VmFsdWUgPSBOYXRpdmUuRWxlbWVudF9nZXRBdHRyaWJ1dGVOUy5jYWxsKHRoaXMsIG5hbWVzcGFjZSwgbmFtZSk7XG4gICAgICBpbnRlcm5hbHMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsIG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSwgbmFtZXNwYWNlKTtcbiAgICB9KTtcblxuICBVdGlsaXRpZXMuc2V0UHJvcGVydHlVbmNoZWNrZWQoRWxlbWVudC5wcm90b3R5cGUsICdyZW1vdmVBdHRyaWJ1dGUnLFxuICAgIC8qKlxuICAgICAqIEB0aGlzIHtFbGVtZW50fVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICovXG4gICAgZnVuY3Rpb24obmFtZSkge1xuICAgICAgLy8gRmFzdCBwYXRoIGZvciBub24tY3VzdG9tIGVsZW1lbnRzLlxuICAgICAgaWYgKHRoaXMuX19DRV9zdGF0ZSAhPT0gQ0VTdGF0ZS5jdXN0b20pIHtcbiAgICAgICAgcmV0dXJuIE5hdGl2ZS5FbGVtZW50X3JlbW92ZUF0dHJpYnV0ZS5jYWxsKHRoaXMsIG5hbWUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IE5hdGl2ZS5FbGVtZW50X2dldEF0dHJpYnV0ZS5jYWxsKHRoaXMsIG5hbWUpO1xuICAgICAgTmF0aXZlLkVsZW1lbnRfcmVtb3ZlQXR0cmlidXRlLmNhbGwodGhpcywgbmFtZSk7XG4gICAgICBpZiAob2xkVmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgaW50ZXJuYWxzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLCBuYW1lLCBvbGRWYWx1ZSwgbnVsbCwgbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgVXRpbGl0aWVzLnNldFByb3BlcnR5VW5jaGVja2VkKEVsZW1lbnQucHJvdG90eXBlLCAncmVtb3ZlQXR0cmlidXRlTlMnLFxuICAgIC8qKlxuICAgICAqIEB0aGlzIHtFbGVtZW50fVxuICAgICAqIEBwYXJhbSB7P3N0cmluZ30gbmFtZXNwYWNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbihuYW1lc3BhY2UsIG5hbWUpIHtcbiAgICAgIC8vIEZhc3QgcGF0aCBmb3Igbm9uLWN1c3RvbSBlbGVtZW50cy5cbiAgICAgIGlmICh0aGlzLl9fQ0Vfc3RhdGUgIT09IENFU3RhdGUuY3VzdG9tKSB7XG4gICAgICAgIHJldHVybiBOYXRpdmUuRWxlbWVudF9yZW1vdmVBdHRyaWJ1dGVOUy5jYWxsKHRoaXMsIG5hbWVzcGFjZSwgbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gTmF0aXZlLkVsZW1lbnRfZ2V0QXR0cmlidXRlTlMuY2FsbCh0aGlzLCBuYW1lc3BhY2UsIG5hbWUpO1xuICAgICAgTmF0aXZlLkVsZW1lbnRfcmVtb3ZlQXR0cmlidXRlTlMuY2FsbCh0aGlzLCBuYW1lc3BhY2UsIG5hbWUpO1xuICAgICAgLy8gSW4gb2xkZXIgYnJvd3NlcnMsIGBFbGVtZW50I2dldEF0dHJpYnV0ZU5TYCBtYXkgcmV0dXJuIHRoZSBlbXB0eSBzdHJpbmdcbiAgICAgIC8vIGluc3RlYWQgb2YgbnVsbCBpZiB0aGUgYXR0cmlidXRlIGRvZXMgbm90IGV4aXN0LiBGb3IgZGV0YWlscywgc2VlO1xuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0QXR0cmlidXRlTlMjTm90ZXNcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gTmF0aXZlLkVsZW1lbnRfZ2V0QXR0cmlidXRlTlMuY2FsbCh0aGlzLCBuYW1lc3BhY2UsIG5hbWUpO1xuICAgICAgaWYgKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgICBpbnRlcm5hbHMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsIG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSwgbmFtZXNwYWNlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuXG4gIGZ1bmN0aW9uIHBhdGNoX2luc2VydEFkamFjZW50RWxlbWVudChkZXN0aW5hdGlvbiwgYmFzZU1ldGhvZCkge1xuICAgIFV0aWxpdGllcy5zZXRQcm9wZXJ0eVVuY2hlY2tlZChkZXN0aW5hdGlvbiwgJ2luc2VydEFkamFjZW50RWxlbWVudCcsXG4gICAgICAvKipcbiAgICAgICAqIEB0aGlzIHtFbGVtZW50fVxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHdoZXJlXG4gICAgICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50XG4gICAgICAgKiBAcmV0dXJuIHs/RWxlbWVudH1cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24od2hlcmUsIGVsZW1lbnQpIHtcbiAgICAgICAgY29uc3Qgd2FzQ29ubmVjdGVkID0gVXRpbGl0aWVzLmlzQ29ubmVjdGVkKGVsZW1lbnQpO1xuICAgICAgICBjb25zdCBpbnNlcnRlZEVsZW1lbnQgPSAvKiogQHR5cGUgeyFFbGVtZW50fSAqL1xuICAgICAgICAgIChiYXNlTWV0aG9kLmNhbGwodGhpcywgd2hlcmUsIGVsZW1lbnQpKTtcblxuICAgICAgICBpZiAod2FzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgaW50ZXJuYWxzLmRpc2Nvbm5lY3RUcmVlKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFV0aWxpdGllcy5pc0Nvbm5lY3RlZChpbnNlcnRlZEVsZW1lbnQpKSB7XG4gICAgICAgICAgaW50ZXJuYWxzLmNvbm5lY3RUcmVlKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnNlcnRlZEVsZW1lbnQ7XG4gICAgICB9KTtcbiAgfVxuXG4gIGlmIChOYXRpdmUuSFRNTEVsZW1lbnRfaW5zZXJ0QWRqYWNlbnRFbGVtZW50KSB7XG4gICAgcGF0Y2hfaW5zZXJ0QWRqYWNlbnRFbGVtZW50KEhUTUxFbGVtZW50LnByb3RvdHlwZSwgTmF0aXZlLkhUTUxFbGVtZW50X2luc2VydEFkamFjZW50RWxlbWVudCk7XG4gIH0gZWxzZSBpZiAoTmF0aXZlLkVsZW1lbnRfaW5zZXJ0QWRqYWNlbnRFbGVtZW50KSB7XG4gICAgcGF0Y2hfaW5zZXJ0QWRqYWNlbnRFbGVtZW50KEVsZW1lbnQucHJvdG90eXBlLCBOYXRpdmUuRWxlbWVudF9pbnNlcnRBZGphY2VudEVsZW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUud2FybignQ3VzdG9tIEVsZW1lbnRzOiBgRWxlbWVudCNpbnNlcnRBZGphY2VudEVsZW1lbnRgIHdhcyBub3QgcGF0Y2hlZC4nKTtcbiAgfVxuXG5cbiAgUGF0Y2hQYXJlbnROb2RlKGludGVybmFscywgRWxlbWVudC5wcm90b3R5cGUsIHtcbiAgICBwcmVwZW5kOiBOYXRpdmUuRWxlbWVudF9wcmVwZW5kLFxuICAgIGFwcGVuZDogTmF0aXZlLkVsZW1lbnRfYXBwZW5kLFxuICB9KTtcblxuICBQYXRjaENoaWxkTm9kZShpbnRlcm5hbHMsIEVsZW1lbnQucHJvdG90eXBlLCB7XG4gICAgYmVmb3JlOiBOYXRpdmUuRWxlbWVudF9iZWZvcmUsXG4gICAgYWZ0ZXI6IE5hdGl2ZS5FbGVtZW50X2FmdGVyLFxuICAgIHJlcGxhY2VXaXRoOiBOYXRpdmUuRWxlbWVudF9yZXBsYWNlV2l0aCxcbiAgICByZW1vdmU6IE5hdGl2ZS5FbGVtZW50X3JlbW92ZSxcbiAgfSk7XG59O1xuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDE2IFRoZSBQb2x5bWVyIFByb2plY3QgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcbiAqIFRoZSBjb21wbGV0ZSBzZXQgb2YgYXV0aG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0FVVEhPUlMudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0NPTlRSSUJVVE9SUy50eHRcbiAqIENvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvXG4gKiBzdWJqZWN0IHRvIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9QQVRFTlRTLnR4dFxuICovXG5cbmltcG9ydCBDdXN0b21FbGVtZW50SW50ZXJuYWxzIGZyb20gJy4vQ3VzdG9tRWxlbWVudEludGVybmFscy5qcyc7XG5pbXBvcnQgQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5IGZyb20gJy4vQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5LmpzJztcblxuaW1wb3J0IFBhdGNoSFRNTEVsZW1lbnQgZnJvbSAnLi9QYXRjaC9IVE1MRWxlbWVudC5qcyc7XG5pbXBvcnQgUGF0Y2hEb2N1bWVudCBmcm9tICcuL1BhdGNoL0RvY3VtZW50LmpzJztcbmltcG9ydCBQYXRjaE5vZGUgZnJvbSAnLi9QYXRjaC9Ob2RlLmpzJztcbmltcG9ydCBQYXRjaEVsZW1lbnQgZnJvbSAnLi9QYXRjaC9FbGVtZW50LmpzJztcblxuY29uc3QgcHJpb3JDdXN0b21FbGVtZW50cyA9IHdpbmRvd1snY3VzdG9tRWxlbWVudHMnXTtcblxuaWYgKCFwcmlvckN1c3RvbUVsZW1lbnRzIHx8XG4gICAgIHByaW9yQ3VzdG9tRWxlbWVudHNbJ2ZvcmNlUG9seWZpbGwnXSB8fFxuICAgICAodHlwZW9mIHByaW9yQ3VzdG9tRWxlbWVudHNbJ2RlZmluZSddICE9ICdmdW5jdGlvbicpIHx8XG4gICAgICh0eXBlb2YgcHJpb3JDdXN0b21FbGVtZW50c1snZ2V0J10gIT0gJ2Z1bmN0aW9uJykpIHtcbiAgLyoqIEB0eXBlIHshQ3VzdG9tRWxlbWVudEludGVybmFsc30gKi9cbiAgY29uc3QgaW50ZXJuYWxzID0gbmV3IEN1c3RvbUVsZW1lbnRJbnRlcm5hbHMoKTtcblxuICBQYXRjaEhUTUxFbGVtZW50KGludGVybmFscyk7XG4gIFBhdGNoRG9jdW1lbnQoaW50ZXJuYWxzKTtcbiAgUGF0Y2hOb2RlKGludGVybmFscyk7XG4gIFBhdGNoRWxlbWVudChpbnRlcm5hbHMpO1xuXG4gIC8vIFRoZSBtYWluIGRvY3VtZW50IGlzIGFsd2F5cyBhc3NvY2lhdGVkIHdpdGggdGhlIHJlZ2lzdHJ5LlxuICBkb2N1bWVudC5fX0NFX2hhc1JlZ2lzdHJ5ID0gdHJ1ZTtcblxuICAvKiogQHR5cGUgeyFDdXN0b21FbGVtZW50UmVnaXN0cnl9ICovXG4gIGNvbnN0IGN1c3RvbUVsZW1lbnRzID0gbmV3IEN1c3RvbUVsZW1lbnRSZWdpc3RyeShpbnRlcm5hbHMpO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdjdXN0b21FbGVtZW50cycsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogY3VzdG9tRWxlbWVudHMsXG4gIH0pO1xufVxuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDE0IFRoZSBQb2x5bWVyIFByb2plY3QgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcbiAqIFRoZSBjb21wbGV0ZSBzZXQgb2YgYXV0aG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0FVVEhPUlMudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0NPTlRSSUJVVE9SUy50eHRcbiAqIENvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvXG4gKiBzdWJqZWN0IHRvIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9QQVRFTlRTLnR4dFxuICovXG4vLyBAdmVyc2lvbiAwLjcuMjJcblxuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBpZiAoZ2xvYmFsLkpzTXV0YXRpb25PYnNlcnZlcikge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgcmVnaXN0cmF0aW9uc1RhYmxlID0gbmV3IFdlYWtNYXAoKTtcbiAgdmFyIHNldEltbWVkaWF0ZTtcbiAgaWYgKC9UcmlkZW50fEVkZ2UvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICBzZXRJbW1lZGlhdGUgPSBzZXRUaW1lb3V0O1xuICB9IGVsc2UgaWYgKHdpbmRvdy5zZXRJbW1lZGlhdGUpIHtcbiAgICBzZXRJbW1lZGlhdGUgPSB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICB9IGVsc2Uge1xuICAgIHZhciBzZXRJbW1lZGlhdGVRdWV1ZSA9IFtdO1xuICAgIHZhciBzZW50aW5lbCA9IFN0cmluZyhNYXRoLnJhbmRvbSgpKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGUuZGF0YSA9PT0gc2VudGluZWwpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gc2V0SW1tZWRpYXRlUXVldWU7XG4gICAgICAgIHNldEltbWVkaWF0ZVF1ZXVlID0gW107XG4gICAgICAgIHF1ZXVlLmZvckVhY2goZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgIGZ1bmMoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgc2V0SW1tZWRpYXRlID0gZnVuY3Rpb24oZnVuYykge1xuICAgICAgc2V0SW1tZWRpYXRlUXVldWUucHVzaChmdW5jKTtcbiAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZShzZW50aW5lbCwgXCIqXCIpO1xuICAgIH07XG4gIH1cbiAgdmFyIGlzU2NoZWR1bGVkID0gZmFsc2U7XG4gIHZhciBzY2hlZHVsZWRPYnNlcnZlcnMgPSBbXTtcbiAgZnVuY3Rpb24gc2NoZWR1bGVDYWxsYmFjayhvYnNlcnZlcikge1xuICAgIHNjaGVkdWxlZE9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcbiAgICBpZiAoIWlzU2NoZWR1bGVkKSB7XG4gICAgICBpc1NjaGVkdWxlZCA9IHRydWU7XG4gICAgICBzZXRJbW1lZGlhdGUoZGlzcGF0Y2hDYWxsYmFja3MpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB3cmFwSWZOZWVkZWQobm9kZSkge1xuICAgIHJldHVybiB3aW5kb3cuU2hhZG93RE9NUG9seWZpbGwgJiYgd2luZG93LlNoYWRvd0RPTVBvbHlmaWxsLndyYXBJZk5lZWRlZChub2RlKSB8fCBub2RlO1xuICB9XG4gIGZ1bmN0aW9uIGRpc3BhdGNoQ2FsbGJhY2tzKCkge1xuICAgIGlzU2NoZWR1bGVkID0gZmFsc2U7XG4gICAgdmFyIG9ic2VydmVycyA9IHNjaGVkdWxlZE9ic2VydmVycztcbiAgICBzY2hlZHVsZWRPYnNlcnZlcnMgPSBbXTtcbiAgICBvYnNlcnZlcnMuc29ydChmdW5jdGlvbihvMSwgbzIpIHtcbiAgICAgIHJldHVybiBvMS51aWRfIC0gbzIudWlkXztcbiAgICB9KTtcbiAgICB2YXIgYW55Tm9uRW1wdHkgPSBmYWxzZTtcbiAgICBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbihvYnNlcnZlcikge1xuICAgICAgdmFyIHF1ZXVlID0gb2JzZXJ2ZXIudGFrZVJlY29yZHMoKTtcbiAgICAgIHJlbW92ZVRyYW5zaWVudE9ic2VydmVyc0ZvcihvYnNlcnZlcik7XG4gICAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIG9ic2VydmVyLmNhbGxiYWNrXyhxdWV1ZSwgb2JzZXJ2ZXIpO1xuICAgICAgICBhbnlOb25FbXB0eSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGFueU5vbkVtcHR5KSBkaXNwYXRjaENhbGxiYWNrcygpO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZVRyYW5zaWVudE9ic2VydmVyc0ZvcihvYnNlcnZlcikge1xuICAgIG9ic2VydmVyLm5vZGVzXy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIHZhciByZWdpc3RyYXRpb25zID0gcmVnaXN0cmF0aW9uc1RhYmxlLmdldChub2RlKTtcbiAgICAgIGlmICghcmVnaXN0cmF0aW9ucykgcmV0dXJuO1xuICAgICAgcmVnaXN0cmF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lzdHJhdGlvbikge1xuICAgICAgICBpZiAocmVnaXN0cmF0aW9uLm9ic2VydmVyID09PSBvYnNlcnZlcikgcmVnaXN0cmF0aW9uLnJlbW92ZVRyYW5zaWVudE9ic2VydmVycygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gZm9yRWFjaEFuY2VzdG9yQW5kT2JzZXJ2ZXJFbnF1ZXVlUmVjb3JkKHRhcmdldCwgY2FsbGJhY2spIHtcbiAgICBmb3IgKHZhciBub2RlID0gdGFyZ2V0OyBub2RlOyBub2RlID0gbm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICB2YXIgcmVnaXN0cmF0aW9ucyA9IHJlZ2lzdHJhdGlvbnNUYWJsZS5nZXQobm9kZSk7XG4gICAgICBpZiAocmVnaXN0cmF0aW9ucykge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJlZ2lzdHJhdGlvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICB2YXIgcmVnaXN0cmF0aW9uID0gcmVnaXN0cmF0aW9uc1tqXTtcbiAgICAgICAgICB2YXIgb3B0aW9ucyA9IHJlZ2lzdHJhdGlvbi5vcHRpb25zO1xuICAgICAgICAgIGlmIChub2RlICE9PSB0YXJnZXQgJiYgIW9wdGlvbnMuc3VidHJlZSkgY29udGludWU7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGNhbGxiYWNrKG9wdGlvbnMpO1xuICAgICAgICAgIGlmIChyZWNvcmQpIHJlZ2lzdHJhdGlvbi5lbnF1ZXVlKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdmFyIHVpZENvdW50ZXIgPSAwO1xuICBmdW5jdGlvbiBKc011dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmNhbGxiYWNrXyA9IGNhbGxiYWNrO1xuICAgIHRoaXMubm9kZXNfID0gW107XG4gICAgdGhpcy5yZWNvcmRzXyA9IFtdO1xuICAgIHRoaXMudWlkXyA9ICsrdWlkQ291bnRlcjtcbiAgfVxuICBKc011dGF0aW9uT2JzZXJ2ZXIucHJvdG90eXBlID0ge1xuICAgIG9ic2VydmU6IGZ1bmN0aW9uKHRhcmdldCwgb3B0aW9ucykge1xuICAgICAgdGFyZ2V0ID0gd3JhcElmTmVlZGVkKHRhcmdldCk7XG4gICAgICBpZiAoIW9wdGlvbnMuY2hpbGRMaXN0ICYmICFvcHRpb25zLmF0dHJpYnV0ZXMgJiYgIW9wdGlvbnMuY2hhcmFjdGVyRGF0YSB8fCBvcHRpb25zLmF0dHJpYnV0ZU9sZFZhbHVlICYmICFvcHRpb25zLmF0dHJpYnV0ZXMgfHwgb3B0aW9ucy5hdHRyaWJ1dGVGaWx0ZXIgJiYgb3B0aW9ucy5hdHRyaWJ1dGVGaWx0ZXIubGVuZ3RoICYmICFvcHRpb25zLmF0dHJpYnV0ZXMgfHwgb3B0aW9ucy5jaGFyYWN0ZXJEYXRhT2xkVmFsdWUgJiYgIW9wdGlvbnMuY2hhcmFjdGVyRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoKTtcbiAgICAgIH1cbiAgICAgIHZhciByZWdpc3RyYXRpb25zID0gcmVnaXN0cmF0aW9uc1RhYmxlLmdldCh0YXJnZXQpO1xuICAgICAgaWYgKCFyZWdpc3RyYXRpb25zKSByZWdpc3RyYXRpb25zVGFibGUuc2V0KHRhcmdldCwgcmVnaXN0cmF0aW9ucyA9IFtdKTtcbiAgICAgIHZhciByZWdpc3RyYXRpb247XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZ2lzdHJhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHJlZ2lzdHJhdGlvbnNbaV0ub2JzZXJ2ZXIgPT09IHRoaXMpIHtcbiAgICAgICAgICByZWdpc3RyYXRpb24gPSByZWdpc3RyYXRpb25zW2ldO1xuICAgICAgICAgIHJlZ2lzdHJhdGlvbi5yZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICByZWdpc3RyYXRpb24ub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghcmVnaXN0cmF0aW9uKSB7XG4gICAgICAgIHJlZ2lzdHJhdGlvbiA9IG5ldyBSZWdpc3RyYXRpb24odGhpcywgdGFyZ2V0LCBvcHRpb25zKTtcbiAgICAgICAgcmVnaXN0cmF0aW9ucy5wdXNoKHJlZ2lzdHJhdGlvbik7XG4gICAgICAgIHRoaXMubm9kZXNfLnB1c2godGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIHJlZ2lzdHJhdGlvbi5hZGRMaXN0ZW5lcnMoKTtcbiAgICB9LFxuICAgIGRpc2Nvbm5lY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5ub2Rlc18uZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHZhciByZWdpc3RyYXRpb25zID0gcmVnaXN0cmF0aW9uc1RhYmxlLmdldChub2RlKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RyYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJlZ2lzdHJhdGlvbiA9IHJlZ2lzdHJhdGlvbnNbaV07XG4gICAgICAgICAgaWYgKHJlZ2lzdHJhdGlvbi5vYnNlcnZlciA9PT0gdGhpcykge1xuICAgICAgICAgICAgcmVnaXN0cmF0aW9uLnJlbW92ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgcmVnaXN0cmF0aW9ucy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgICAgdGhpcy5yZWNvcmRzXyA9IFtdO1xuICAgIH0sXG4gICAgdGFrZVJlY29yZHM6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvcHlPZlJlY29yZHMgPSB0aGlzLnJlY29yZHNfO1xuICAgICAgdGhpcy5yZWNvcmRzXyA9IFtdO1xuICAgICAgcmV0dXJuIGNvcHlPZlJlY29yZHM7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBNdXRhdGlvblJlY29yZCh0eXBlLCB0YXJnZXQpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuYWRkZWROb2RlcyA9IFtdO1xuICAgIHRoaXMucmVtb3ZlZE5vZGVzID0gW107XG4gICAgdGhpcy5wcmV2aW91c1NpYmxpbmcgPSBudWxsO1xuICAgIHRoaXMubmV4dFNpYmxpbmcgPSBudWxsO1xuICAgIHRoaXMuYXR0cmlidXRlTmFtZSA9IG51bGw7XG4gICAgdGhpcy5hdHRyaWJ1dGVOYW1lc3BhY2UgPSBudWxsO1xuICAgIHRoaXMub2xkVmFsdWUgPSBudWxsO1xuICB9XG4gIGZ1bmN0aW9uIGNvcHlNdXRhdGlvblJlY29yZChvcmlnaW5hbCkge1xuICAgIHZhciByZWNvcmQgPSBuZXcgTXV0YXRpb25SZWNvcmQob3JpZ2luYWwudHlwZSwgb3JpZ2luYWwudGFyZ2V0KTtcbiAgICByZWNvcmQuYWRkZWROb2RlcyA9IG9yaWdpbmFsLmFkZGVkTm9kZXMuc2xpY2UoKTtcbiAgICByZWNvcmQucmVtb3ZlZE5vZGVzID0gb3JpZ2luYWwucmVtb3ZlZE5vZGVzLnNsaWNlKCk7XG4gICAgcmVjb3JkLnByZXZpb3VzU2libGluZyA9IG9yaWdpbmFsLnByZXZpb3VzU2libGluZztcbiAgICByZWNvcmQubmV4dFNpYmxpbmcgPSBvcmlnaW5hbC5uZXh0U2libGluZztcbiAgICByZWNvcmQuYXR0cmlidXRlTmFtZSA9IG9yaWdpbmFsLmF0dHJpYnV0ZU5hbWU7XG4gICAgcmVjb3JkLmF0dHJpYnV0ZU5hbWVzcGFjZSA9IG9yaWdpbmFsLmF0dHJpYnV0ZU5hbWVzcGFjZTtcbiAgICByZWNvcmQub2xkVmFsdWUgPSBvcmlnaW5hbC5vbGRWYWx1ZTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG4gIHZhciBjdXJyZW50UmVjb3JkLCByZWNvcmRXaXRoT2xkVmFsdWU7XG4gIGZ1bmN0aW9uIGdldFJlY29yZCh0eXBlLCB0YXJnZXQpIHtcbiAgICByZXR1cm4gY3VycmVudFJlY29yZCA9IG5ldyBNdXRhdGlvblJlY29yZCh0eXBlLCB0YXJnZXQpO1xuICB9XG4gIGZ1bmN0aW9uIGdldFJlY29yZFdpdGhPbGRWYWx1ZShvbGRWYWx1ZSkge1xuICAgIGlmIChyZWNvcmRXaXRoT2xkVmFsdWUpIHJldHVybiByZWNvcmRXaXRoT2xkVmFsdWU7XG4gICAgcmVjb3JkV2l0aE9sZFZhbHVlID0gY29weU11dGF0aW9uUmVjb3JkKGN1cnJlbnRSZWNvcmQpO1xuICAgIHJlY29yZFdpdGhPbGRWYWx1ZS5vbGRWYWx1ZSA9IG9sZFZhbHVlO1xuICAgIHJldHVybiByZWNvcmRXaXRoT2xkVmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gY2xlYXJSZWNvcmRzKCkge1xuICAgIGN1cnJlbnRSZWNvcmQgPSByZWNvcmRXaXRoT2xkVmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gcmVjb3JkUmVwcmVzZW50c0N1cnJlbnRNdXRhdGlvbihyZWNvcmQpIHtcbiAgICByZXR1cm4gcmVjb3JkID09PSByZWNvcmRXaXRoT2xkVmFsdWUgfHwgcmVjb3JkID09PSBjdXJyZW50UmVjb3JkO1xuICB9XG4gIGZ1bmN0aW9uIHNlbGVjdFJlY29yZChsYXN0UmVjb3JkLCBuZXdSZWNvcmQpIHtcbiAgICBpZiAobGFzdFJlY29yZCA9PT0gbmV3UmVjb3JkKSByZXR1cm4gbGFzdFJlY29yZDtcbiAgICBpZiAocmVjb3JkV2l0aE9sZFZhbHVlICYmIHJlY29yZFJlcHJlc2VudHNDdXJyZW50TXV0YXRpb24obGFzdFJlY29yZCkpIHJldHVybiByZWNvcmRXaXRoT2xkVmFsdWU7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgZnVuY3Rpb24gUmVnaXN0cmF0aW9uKG9ic2VydmVyLCB0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9ic2VydmVyID0gb2JzZXJ2ZXI7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnRyYW5zaWVudE9ic2VydmVkTm9kZXMgPSBbXTtcbiAgfVxuICBSZWdpc3RyYXRpb24ucHJvdG90eXBlID0ge1xuICAgIGVucXVldWU6IGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgdmFyIHJlY29yZHMgPSB0aGlzLm9ic2VydmVyLnJlY29yZHNfO1xuICAgICAgdmFyIGxlbmd0aCA9IHJlY29yZHMubGVuZ3RoO1xuICAgICAgaWYgKHJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbGFzdFJlY29yZCA9IHJlY29yZHNbbGVuZ3RoIC0gMV07XG4gICAgICAgIHZhciByZWNvcmRUb1JlcGxhY2VMYXN0ID0gc2VsZWN0UmVjb3JkKGxhc3RSZWNvcmQsIHJlY29yZCk7XG4gICAgICAgIGlmIChyZWNvcmRUb1JlcGxhY2VMYXN0KSB7XG4gICAgICAgICAgcmVjb3Jkc1tsZW5ndGggLSAxXSA9IHJlY29yZFRvUmVwbGFjZUxhc3Q7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2hlZHVsZUNhbGxiYWNrKHRoaXMub2JzZXJ2ZXIpO1xuICAgICAgfVxuICAgICAgcmVjb3Jkc1tsZW5ndGhdID0gcmVjb3JkO1xuICAgIH0sXG4gICAgYWRkTGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuYWRkTGlzdGVuZXJzXyh0aGlzLnRhcmdldCk7XG4gICAgfSxcbiAgICBhZGRMaXN0ZW5lcnNfOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zLmF0dHJpYnV0ZXMpIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUF0dHJNb2RpZmllZFwiLCB0aGlzLCB0cnVlKTtcbiAgICAgIGlmIChvcHRpb25zLmNoYXJhY3RlckRhdGEpIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNoYXJhY3RlckRhdGFNb2RpZmllZFwiLCB0aGlzLCB0cnVlKTtcbiAgICAgIGlmIChvcHRpb25zLmNoaWxkTGlzdCkgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwiRE9NTm9kZUluc2VydGVkXCIsIHRoaXMsIHRydWUpO1xuICAgICAgaWYgKG9wdGlvbnMuY2hpbGRMaXN0IHx8IG9wdGlvbnMuc3VidHJlZSkgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwiRE9NTm9kZVJlbW92ZWRcIiwgdGhpcywgdHJ1ZSk7XG4gICAgfSxcbiAgICByZW1vdmVMaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcnNfKHRoaXMudGFyZ2V0KTtcbiAgICB9LFxuICAgIHJlbW92ZUxpc3RlbmVyc186IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMuYXR0cmlidXRlcykgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQXR0ck1vZGlmaWVkXCIsIHRoaXMsIHRydWUpO1xuICAgICAgaWYgKG9wdGlvbnMuY2hhcmFjdGVyRGF0YSkgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ2hhcmFjdGVyRGF0YU1vZGlmaWVkXCIsIHRoaXMsIHRydWUpO1xuICAgICAgaWYgKG9wdGlvbnMuY2hpbGRMaXN0KSBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Ob2RlSW5zZXJ0ZWRcIiwgdGhpcywgdHJ1ZSk7XG4gICAgICBpZiAob3B0aW9ucy5jaGlsZExpc3QgfHwgb3B0aW9ucy5zdWJ0cmVlKSBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Ob2RlUmVtb3ZlZFwiLCB0aGlzLCB0cnVlKTtcbiAgICB9LFxuICAgIGFkZFRyYW5zaWVudE9ic2VydmVyOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICBpZiAobm9kZSA9PT0gdGhpcy50YXJnZXQpIHJldHVybjtcbiAgICAgIHRoaXMuYWRkTGlzdGVuZXJzXyhub2RlKTtcbiAgICAgIHRoaXMudHJhbnNpZW50T2JzZXJ2ZWROb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgdmFyIHJlZ2lzdHJhdGlvbnMgPSByZWdpc3RyYXRpb25zVGFibGUuZ2V0KG5vZGUpO1xuICAgICAgaWYgKCFyZWdpc3RyYXRpb25zKSByZWdpc3RyYXRpb25zVGFibGUuc2V0KG5vZGUsIHJlZ2lzdHJhdGlvbnMgPSBbXSk7XG4gICAgICByZWdpc3RyYXRpb25zLnB1c2godGhpcyk7XG4gICAgfSxcbiAgICByZW1vdmVUcmFuc2llbnRPYnNlcnZlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRyYW5zaWVudE9ic2VydmVkTm9kZXMgPSB0aGlzLnRyYW5zaWVudE9ic2VydmVkTm9kZXM7XG4gICAgICB0aGlzLnRyYW5zaWVudE9ic2VydmVkTm9kZXMgPSBbXTtcbiAgICAgIHRyYW5zaWVudE9ic2VydmVkTm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXJzXyhub2RlKTtcbiAgICAgICAgdmFyIHJlZ2lzdHJhdGlvbnMgPSByZWdpc3RyYXRpb25zVGFibGUuZ2V0KG5vZGUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZ2lzdHJhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uc1tpXSA9PT0gdGhpcykge1xuICAgICAgICAgICAgcmVnaXN0cmF0aW9ucy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgIGNhc2UgXCJET01BdHRyTW9kaWZpZWRcIjpcbiAgICAgICAgdmFyIG5hbWUgPSBlLmF0dHJOYW1lO1xuICAgICAgICB2YXIgbmFtZXNwYWNlID0gZS5yZWxhdGVkTm9kZS5uYW1lc3BhY2VVUkk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgdmFyIHJlY29yZCA9IG5ldyBnZXRSZWNvcmQoXCJhdHRyaWJ1dGVzXCIsIHRhcmdldCk7XG4gICAgICAgIHJlY29yZC5hdHRyaWJ1dGVOYW1lID0gbmFtZTtcbiAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZU5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gZS5hdHRyQ2hhbmdlID09PSBNdXRhdGlvbkV2ZW50LkFERElUSU9OID8gbnVsbCA6IGUucHJldlZhbHVlO1xuICAgICAgICBmb3JFYWNoQW5jZXN0b3JBbmRPYnNlcnZlckVucXVldWVSZWNvcmQodGFyZ2V0LCBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgaWYgKCFvcHRpb25zLmF0dHJpYnV0ZXMpIHJldHVybjtcbiAgICAgICAgICBpZiAob3B0aW9ucy5hdHRyaWJ1dGVGaWx0ZXIgJiYgb3B0aW9ucy5hdHRyaWJ1dGVGaWx0ZXIubGVuZ3RoICYmIG9wdGlvbnMuYXR0cmlidXRlRmlsdGVyLmluZGV4T2YobmFtZSkgPT09IC0xICYmIG9wdGlvbnMuYXR0cmlidXRlRmlsdGVyLmluZGV4T2YobmFtZXNwYWNlKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG9wdGlvbnMuYXR0cmlidXRlT2xkVmFsdWUpIHJldHVybiBnZXRSZWNvcmRXaXRoT2xkVmFsdWUob2xkVmFsdWUpO1xuICAgICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgIGNhc2UgXCJET01DaGFyYWN0ZXJEYXRhTW9kaWZpZWRcIjpcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgICB2YXIgcmVjb3JkID0gZ2V0UmVjb3JkKFwiY2hhcmFjdGVyRGF0YVwiLCB0YXJnZXQpO1xuICAgICAgICB2YXIgb2xkVmFsdWUgPSBlLnByZXZWYWx1ZTtcbiAgICAgICAgZm9yRWFjaEFuY2VzdG9yQW5kT2JzZXJ2ZXJFbnF1ZXVlUmVjb3JkKHRhcmdldCwgZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgIGlmICghb3B0aW9ucy5jaGFyYWN0ZXJEYXRhKSByZXR1cm47XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY2hhcmFjdGVyRGF0YU9sZFZhbHVlKSByZXR1cm4gZ2V0UmVjb3JkV2l0aE9sZFZhbHVlKG9sZFZhbHVlKTtcbiAgICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgICBjYXNlIFwiRE9NTm9kZVJlbW92ZWRcIjpcbiAgICAgICAgdGhpcy5hZGRUcmFuc2llbnRPYnNlcnZlcihlLnRhcmdldCk7XG5cbiAgICAgICBjYXNlIFwiRE9NTm9kZUluc2VydGVkXCI6XG4gICAgICAgIHZhciBjaGFuZ2VkTm9kZSA9IGUudGFyZ2V0O1xuICAgICAgICB2YXIgYWRkZWROb2RlcywgcmVtb3ZlZE5vZGVzO1xuICAgICAgICBpZiAoZS50eXBlID09PSBcIkRPTU5vZGVJbnNlcnRlZFwiKSB7XG4gICAgICAgICAgYWRkZWROb2RlcyA9IFsgY2hhbmdlZE5vZGUgXTtcbiAgICAgICAgICByZW1vdmVkTm9kZXMgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhZGRlZE5vZGVzID0gW107XG4gICAgICAgICAgcmVtb3ZlZE5vZGVzID0gWyBjaGFuZ2VkTm9kZSBdO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcmV2aW91c1NpYmxpbmcgPSBjaGFuZ2VkTm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IGNoYW5nZWROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICB2YXIgcmVjb3JkID0gZ2V0UmVjb3JkKFwiY2hpbGRMaXN0XCIsIGUudGFyZ2V0LnBhcmVudE5vZGUpO1xuICAgICAgICByZWNvcmQuYWRkZWROb2RlcyA9IGFkZGVkTm9kZXM7XG4gICAgICAgIHJlY29yZC5yZW1vdmVkTm9kZXMgPSByZW1vdmVkTm9kZXM7XG4gICAgICAgIHJlY29yZC5wcmV2aW91c1NpYmxpbmcgPSBwcmV2aW91c1NpYmxpbmc7XG4gICAgICAgIHJlY29yZC5uZXh0U2libGluZyA9IG5leHRTaWJsaW5nO1xuICAgICAgICBmb3JFYWNoQW5jZXN0b3JBbmRPYnNlcnZlckVucXVldWVSZWNvcmQoZS5yZWxhdGVkTm9kZSwgZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgIGlmICghb3B0aW9ucy5jaGlsZExpc3QpIHJldHVybjtcbiAgICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNsZWFyUmVjb3JkcygpO1xuICAgIH1cbiAgfTtcbiAgZ2xvYmFsLkpzTXV0YXRpb25PYnNlcnZlciA9IEpzTXV0YXRpb25PYnNlcnZlcjtcbiAgaWYgKCFnbG9iYWwuTXV0YXRpb25PYnNlcnZlcikge1xuICAgIGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyID0gSnNNdXRhdGlvbk9ic2VydmVyO1xuICAgIEpzTXV0YXRpb25PYnNlcnZlci5faXNQb2x5ZmlsbGVkID0gdHJ1ZTtcbiAgfVxufSkoc2VsZik7XG4iLCIvKlxuQ29weXJpZ2h0IChjKSAyMDEyIEJhcm5lc2FuZG5vYmxlLmNvbSwgbGxjLCBEb25hdm9uIFdlc3QsIGFuZCBEb21lbmljIERlbmljb2xhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbndpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbmRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xucGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG50aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5pbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbkVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbk5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbkxJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbk9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbiovXG4oZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciBzZXRJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBhZGRGcm9tU2V0SW1tZWRpYXRlQXJndW1lbnRzKGFyZ3MpIHtcbiAgICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHBhcnRpYWxseUFwcGxpZWQuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFjY2VwdHMgdGhlIHNhbWUgYXJndW1lbnRzIGFzIHNldEltbWVkaWF0ZSwgYnV0XG4gICAgLy8gcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgcmVxdWlyZXMgbm8gYXJndW1lbnRzLlxuICAgIGZ1bmN0aW9uIHBhcnRpYWxseUFwcGxpZWQoaGFuZGxlcikge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIChuZXcgRnVuY3Rpb24oXCJcIiArIGhhbmRsZXIpKSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocGFydGlhbGx5QXBwbGllZChydW5JZlByZXNlbnQsIGhhbmRsZSksIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGFzaygpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICBzZXRJbW1lZGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBhZGRGcm9tU2V0SW1tZWRpYXRlQXJndW1lbnRzKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKHBhcnRpYWxseUFwcGxpZWQocnVuSWZQcmVzZW50LCBoYW5kbGUpKTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgICAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG4gICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcbiAgICAgICAgLy8gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LnBvc3RNZXNzYWdlXG4gICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuICAgICAgICB2YXIgb25HbG9iYWxNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleE9mKG1lc3NhZ2VQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldEltbWVkaWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGFkZEZyb21TZXRJbW1lZGlhdGVBcmd1bWVudHMoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNldEltbWVkaWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGFkZEZyb21TZXRJbW1lZGlhdGVBcmd1bWVudHMoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICBzZXRJbW1lZGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBhZGRGcm9tU2V0SW1tZWRpYXRlQXJndW1lbnRzKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgc2V0SW1tZWRpYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gYWRkRnJvbVNldEltbWVkaWF0ZUFyZ3VtZW50cyhhcmd1bWVudHMpO1xuICAgICAgICAgICAgc2V0VGltZW91dChwYXJ0aWFsbHlBcHBsaWVkKHJ1bklmUHJlc2VudCwgaGFuZGxlKSwgMCk7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcbiAgICBhdHRhY2hUbyA9IGF0dGFjaFRvICYmIGF0dGFjaFRvLnNldFRpbWVvdXQgPyBhdHRhY2hUbyA6IGdsb2JhbDtcblxuICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIC8vIEZvciBOb2RlLmpzIGJlZm9yZSAwLjlcbiAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuICAgICAgICAvLyBGb3Igbm9uLUlFMTAgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgICAvLyBGb3Igd2ViIHdvcmtlcnMsIHdoZXJlIHN1cHBvcnRlZFxuICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBGb3IgSUUgNuKAkzhcbiAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICBhdHRhY2hUby5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcbn0oc2VsZikpO1xuIiwiLy8gQ2F1dGlvbjpcbi8vIERvIG5vdCByZXBsYWNlIHRoaXMgaW1wb3J0IHN0YXRlbWVudCB3aXRoIGNvZGVzLlxuLy9cbi8vIElmIHlvdSByZXBsYWNlIHRoaXMgaW1wb3J0IHN0YXRlbWVudCB3aXRoIGNvZGVzLFxuLy8gdGhlIGNvZGVzIHdpbGwgYmUgZXhlY3V0ZWQgYWZ0ZXIgdGhlIGZvbGxvd2luZyBwb2x5ZmlsbHMgYXJlIGltcG9ydGVkXG4vLyBiZWNhdXNlIGltcG9ydCBzdGF0ZW1lbnRzIGFyZSBob2lzdGVkIGR1cmluZyBjb21waWxhdGlvbi5cbmltcG9ydCAnLi9wb2x5ZmlsbC1zd2l0Y2hlcyc7XG5cbi8vIFBvbHlmaWxsIEVDTUFTY3JpcHQgc3RhbmRhcmQgZmVhdHVyZXMgd2l0aCBnbG9iYWwgbmFtZXNwYWNlIHBvbGx1dGlvblxuaW1wb3J0ICdjb3JlLWpzL2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mJztcbmltcG9ydCAnY29yZS1qcy9mbi9zZXQnO1xuaW1wb3J0ICdjb3JlLWpzL2ZuL21hcCc7XG5pbXBvcnQgJ2NvcmUtanMvZm4vd2Vhay1tYXAnO1xuaW1wb3J0ICdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nO1xuXG4vLyBQb2x5ZmlsbCBDdXN0b20gRWxlbWVudHMgdjEgd2l0aCBnbG9iYWwgbmFtZXNwYWNlIHBvbGx1dGlvblxuaW1wb3J0ICdAb25zZW51aS9jdXN0b20tZWxlbWVudHMvc3JjL2N1c3RvbS1lbGVtZW50cyc7XG5cbi8vIFBvbHlmaWxsIE11dGF0aW9uT2JzZXJ2ZXIgd2l0aCBnbG9iYWwgbmFtZXNwYWNlIHBvbGx1dGlvblxuaW1wb3J0ICcuL011dGF0aW9uT2JzZXJ2ZXJAMC43LjIyL011dGF0aW9uT2JzZXJ2ZXIuanMnO1xuXG4vLyBQb2x5ZmlsbCBzZXRJbW1lZGlhdGUgd2l0aCBnbG9iYWwgbmFtZXNwYWNlIHBvbGx1dGlvblxuaW1wb3J0ICcuL3NldEltbWVkaWF0ZUAxLjAuMittb2Qvc2V0SW1tZWRpYXRlLmpzJztcbiIsIihmdW5jdGlvbigpIHtcbiAgdmFyIERFRkFVTFRfVklFV1BPUlQgPSAnd2lkdGg9ZGV2aWNlLXdpZHRoLGluaXRpYWwtc2NhbGU9MSxtYXhpbXVtLXNjYWxlPTEsbWluaW11bS1zY2FsZT0xLHVzZXItc2NhbGFibGU9bm8nO1xuXG4gIHZhciBWaWV3cG9ydCA9IHsgXG4gICAgZW5zdXJlVmlld3BvcnRFbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2aWV3cG9ydEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9dmlld3BvcnRdJyk7XG5cbiAgICAgIGlmICghdmlld3BvcnRFbGVtZW50KSB7XG4gICAgICAgIHZpZXdwb3J0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21ldGEnKTtcbiAgICAgICAgdmlld3BvcnRFbGVtZW50Lm5hbWUgPSAndmlld3BvcnQnO1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHZpZXdwb3J0RWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2aWV3cG9ydEVsZW1lbnQ7XG4gICAgfSxcblxuICAgIHNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2aWV3cG9ydEVsZW1lbnQgPSBWaWV3cG9ydC5lbnN1cmVWaWV3cG9ydEVsZW1lbnQoKTtcblxuICAgICAgaWYgKCF2aWV3cG9ydEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXZpZXdwb3J0RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2NvbnRlbnQnKSkge1xuICAgICAgICB2aWV3cG9ydEVsZW1lbnQuc2V0QXR0cmlidXRlKCdjb250ZW50JywgREVGQVVMVF9WSUVXUE9SVCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHdpbmRvdy5WaWV3cG9ydCA9IFZpZXdwb3J0O1xufSkoKTtcbiIsImltcG9ydCB7IEZhc3RDbGljayB9IGZyb20gJ0BvbnNlbnVpL2Zhc3RjbGljayc7XG5pbXBvcnQgJy4vb25zL3BsYXRmb3JtJzsgLy8gVGhpcyBmaWxlIG11c3QgYmUgbG9hZGVkIGJlZm9yZSBDdXN0b20gRWxlbWVudHMgcG9seWZpbGxzLlxuaW1wb3J0ICcuL3BvbHlmaWxscy9pbmRleC5qcyc7XG5pbXBvcnQgJy4vdmVuZG9yL2luZGV4LmpzJztcbmltcG9ydCAnLi9vbnMvbWljcm9ldmVudC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldHVwKG9ucykge1xuICBpZiAod2luZG93Ll9vbnNMb2FkZWQpIHtcbiAgICBvbnMuX3V0aWwud2FybignT25zZW4gVUkgaXMgbG9hZGVkIG1vcmUgdGhhbiBvbmNlLicpO1xuICB9XG4gIHdpbmRvdy5fb25zTG9hZGVkID0gdHJ1ZTtcblxuICAvLyBmYXN0Y2xpY2tcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgb25zLmZhc3RDbGljayA9IEZhc3RDbGljay5hdHRhY2goZG9jdW1lbnQuYm9keSk7XG5cbiAgICBjb25zdCBzdXBwb3J0VG91Y2hBY3Rpb24gPSAndG91Y2gtYWN0aW9uJyBpbiBkb2N1bWVudC5ib2R5LnN0eWxlO1xuXG4gICAgb25zLnBsYXRmb3JtLl9ydW5PbkFjdHVhbFBsYXRmb3JtKCgpID0+IHtcbiAgICAgIGlmIChvbnMucGxhdGZvcm0uaXNBbmRyb2lkKCkpIHtcbiAgICAgICAgLy8gSW4gQW5kcm9pZDQuNCssIGNvcnJlY3Qgdmlld3BvcnQgc2V0dGluZ3MgY2FuIHJlbW92ZSBjbGljayBkZWxheS5cbiAgICAgICAgLy8gU28gZGlzYWJsZSBGYXN0Q2xpY2sgb24gQW5kcm9pZC5cbiAgICAgICAgb25zLmZhc3RDbGljay5kZXN0cm95KCk7XG4gICAgICB9IGVsc2UgaWYgKG9ucy5wbGF0Zm9ybS5pc0lPUygpKSB7XG4gICAgICAgIGlmIChzdXBwb3J0VG91Y2hBY3Rpb24gJiYgKG9ucy5wbGF0Zm9ybS5pc0lPU1NhZmFyaSgpIHx8IG9ucy5wbGF0Zm9ybS5pc1dLV2ViVmlldygpKSkge1xuICAgICAgICAgIC8vIElmICd0b3VjaC1hY3Rpb24nIHN1cHBvcnRlZCBpbiBpT1MgU2FmYXJpIG9yIFdLV2ViVmlldywgZGlzYWJsZSBGYXN0Q2xpY2suXG4gICAgICAgICAgb25zLmZhc3RDbGljay5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRG8gbm90aGluZy4gJ3RvdWNoLWFjdGlvbjogbWFuaXB1bGF0aW9uJyBoYXMgbm8gZWZmZWN0IG9uIFVJV2ViVmlldy5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LCBmYWxzZSk7XG5cbiAgb25zLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIG9ucy5lbmFibGVEZXZpY2VCYWNrQnV0dG9uSGFuZGxlcigpO1xuICAgIG9ucy5fZGVmYXVsdERldmljZUJhY2tCdXR0b25IYW5kbGVyID0gb25zLl9pbnRlcm5hbC5kYmJEaXNwYXRjaGVyLmNyZWF0ZUhhbmRsZXIod2luZG93LmRvY3VtZW50LmJvZHksICgpID0+IHtcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChuYXZpZ2F0b3IsICdhcHAnKSkge1xuICAgICAgICBuYXZpZ2F0b3IuYXBwLmV4aXRBcHAoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ291bGQgbm90IGNsb3NlIHRoZSBhcHAuIElzIFxcJ2NvcmRvdmEuanNcXCcgaW5jbHVkZWQ/XFxuRXJyb3I6IFxcJ3dpbmRvdy5uYXZpZ2F0b3IuYXBwXFwnIGlzIHVuZGVmaW5lZC4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBkb2N1bWVudC5ib2R5Ll9nZXN0dXJlRGV0ZWN0b3IgPSBuZXcgb25zLkdlc3R1cmVEZXRlY3Rvcihkb2N1bWVudC5ib2R5LCB7IHBhc3NpdmU6IHRydWUgfSk7XG5cbiAgICAvLyBTaW11bGF0ZSBEZXZpY2UgQmFjayBCdXR0b24gb24gRVNDIHByZXNzXG4gICAgaWYgKCFvbnMucGxhdGZvcm0uaXNXZWJWaWV3KCkpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAyNykge1xuICAgICAgICAgIG9ucy5maXJlRGV2aWNlQmFja0J1dHRvbkV2ZW50KCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gc2V0dXAgbG9hZGluZyBwbGFjZWhvbGRlclxuICAgIG9ucy5fc2V0dXBMb2FkaW5nUGxhY2VIb2xkZXJzKCk7XG4gIH0pO1xuXG4gIC8vIHZpZXdwb3J0LmpzXG4gIFZpZXdwb3J0LnNldHVwKCk7XG59XG4iLCJpbXBvcnQgb25zIGZyb20gJy4vb25zJzsgLy8gRXh0ZXJuYWwgZGVwZW5kZW5jeSwgYWx3YXlzIGhvaXN0ZWRcbmltcG9ydCBzZXR1cCBmcm9tICcuL3NldHVwJzsgLy8gQWRkIHBvbHlmaWxsc1xuXG5zZXR1cChvbnMpOyAvLyBTZXR1cCBpbml0aWFsIGxpc3RlbmVyc1xuXG5leHBvcnQgZGVmYXVsdCBvbnM7XG4iXSwibmFtZXMiOlsiRmFzdENsaWNrIiwibGF5ZXIiLCJvcHRpb25zIiwib2xkT25DbGljayIsInRyYWNraW5nQ2xpY2siLCJ0cmFja2luZ0NsaWNrU3RhcnQiLCJ0YXJnZXRFbGVtZW50IiwidG91Y2hTdGFydFgiLCJ0b3VjaFN0YXJ0WSIsImxhc3RUb3VjaElkZW50aWZpZXIiLCJ0b3VjaEJvdW5kYXJ5IiwidGFwRGVsYXkiLCJ0YXBUaW1lb3V0Iiwibm90TmVlZGVkIiwiYmluZCIsIm1ldGhvZCIsImNvbnRleHQiLCJhcHBseSIsImFyZ3VtZW50cyIsIm1ldGhvZHMiLCJpIiwibCIsImxlbmd0aCIsImRldmljZUlzQW5kcm9pZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbk1vdXNlIiwib25DbGljayIsIm9uVG91Y2hTdGFydCIsIm9uVG91Y2hNb3ZlIiwib25Ub3VjaEVuZCIsIm9uVG91Y2hDYW5jZWwiLCJFdmVudCIsInByb3RvdHlwZSIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ0eXBlIiwiY2FsbGJhY2siLCJjYXB0dXJlIiwicm12IiwiTm9kZSIsImNhbGwiLCJoaWphY2tlZCIsImFkdiIsImV2ZW50IiwicHJvcGFnYXRpb25TdG9wcGVkIiwib25jbGljayIsImRldmljZUlzV2luZG93c1Bob25lIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiaW5kZXhPZiIsImRldmljZUlzSU9TIiwidGVzdCIsImRldmljZUlzSU9TNCIsImRldmljZUlzSU9TV2l0aEJhZFRhcmdldCIsImRldmljZUlzQmxhY2tCZXJyeTEwIiwidGV4dEZpZWxkcyIsIm5lZWRzQ2xpY2siLCJ0YXJnZXQiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiZGlzYWJsZWQiLCJjbGFzc05hbWUiLCJuZWVkc0ZvY3VzIiwicmVhZE9ubHkiLCJzZW5kQ2xpY2siLCJjbGlja0V2ZW50IiwidG91Y2giLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJibHVyIiwiY2hhbmdlZFRvdWNoZXMiLCJjcmVhdGVFdmVudCIsImluaXRNb3VzZUV2ZW50IiwiZGV0ZXJtaW5lRXZlbnRUeXBlIiwid2luZG93Iiwic2NyZWVuWCIsInNjcmVlblkiLCJjbGllbnRYIiwiY2xpZW50WSIsImZvcndhcmRlZFRvdWNoRXZlbnQiLCJkaXNwYXRjaEV2ZW50IiwidGFnTmFtZSIsImZvY3VzIiwic2V0U2VsZWN0aW9uUmFuZ2UiLCJ2YWx1ZSIsInVwZGF0ZVNjcm9sbFBhcmVudCIsInNjcm9sbFBhcmVudCIsInBhcmVudEVsZW1lbnQiLCJmYXN0Q2xpY2tTY3JvbGxQYXJlbnQiLCJjb250YWlucyIsInNjcm9sbEhlaWdodCIsIm9mZnNldEhlaWdodCIsImZhc3RDbGlja0xhc3RTY3JvbGxUb3AiLCJzY3JvbGxUb3AiLCJnZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0IiwiZXZlbnRUYXJnZXQiLCJub2RlVHlwZSIsIlRFWFRfTk9ERSIsInBhcmVudE5vZGUiLCJpc1RleHRGaWVsZCIsInRhcmdldFRvdWNoZXMiLCJpc0NvbnRlbnRFZGl0YWJsZSIsImlkZW50aWZpZXIiLCJwcmV2ZW50RGVmYXVsdCIsInRpbWVTdGFtcCIsInBhZ2VYIiwicGFnZVkiLCJsYXN0Q2xpY2tUaW1lIiwidG91Y2hIYXNNb3ZlZCIsImJvdW5kYXJ5IiwiTWF0aCIsImFicyIsImZpbmRDb250cm9sIiwibGFiZWxFbGVtZW50IiwiY29udHJvbCIsInVuZGVmaW5lZCIsImh0bWxGb3IiLCJnZXRFbGVtZW50QnlJZCIsInF1ZXJ5U2VsZWN0b3IiLCJmb3JFbGVtZW50IiwidGFyZ2V0VGFnTmFtZSIsImNhbmNlbE5leHRDbGljayIsImVsZW1lbnRGcm9tUG9pbnQiLCJwYWdlWE9mZnNldCIsInBhZ2VZT2Zmc2V0IiwidG9wIiwiY2FuY2VsYWJsZSIsInN0b3BQcm9wYWdhdGlvbiIsInBlcm1pdHRlZCIsImRldGFpbCIsImRlc3Ryb3kiLCJtZXRhVmlld3BvcnQiLCJjaHJvbWVWZXJzaW9uIiwiYmxhY2tiZXJyeVZlcnNpb24iLCJmaXJlZm94VmVyc2lvbiIsIm9udG91Y2hzdGFydCIsImV4ZWMiLCJjb250ZW50IiwiZG9jdW1lbnRFbGVtZW50Iiwic2Nyb2xsV2lkdGgiLCJvdXRlcldpZHRoIiwibWF0Y2giLCJzdHlsZSIsIm1zVG91Y2hBY3Rpb24iLCJ0b3VjaEFjdGlvbiIsImF0dGFjaCIsImRlZmluZSIsImJhYmVsSGVscGVycy50eXBlb2YiLCJhbWQiLCJtb2R1bGUiLCJleHBvcnRzIiwiY3VzdG9tRWxlbWVudHMiLCJmb3JjZVBvbHlmaWxsIiwiZ2xvYmFsIiwic2VsZiIsIkZ1bmN0aW9uIiwiX19nIiwiY29yZSIsInZlcnNpb24iLCJfX2UiLCJpdCIsImlzT2JqZWN0IiwiVHlwZUVycm9yIiwiZSIsInJlcXVpcmUkJDAiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsImEiLCJpcyIsImNyZWF0ZUVsZW1lbnQiLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMiIsIlMiLCJmbiIsInZhbCIsInRvU3RyaW5nIiwidmFsdWVPZiIsImRQIiwiTyIsIlAiLCJBdHRyaWJ1dGVzIiwidG9QcmltaXRpdmUiLCJJRThfRE9NX0RFRklORSIsImJpdG1hcCIsIm9iamVjdCIsImtleSIsImYiLCJjcmVhdGVEZXNjIiwiaGFzT3duUHJvcGVydHkiLCJpZCIsInB4IiwicmFuZG9tIiwiY29uY2F0IiwiU1JDIiwiVE9fU1RSSU5HIiwiJHRvU3RyaW5nIiwiVFBMIiwic3BsaXQiLCJpbnNwZWN0U291cmNlIiwic2FmZSIsImlzRnVuY3Rpb24iLCJoYXMiLCJoaWRlIiwiam9pbiIsIlN0cmluZyIsInRoYXQiLCJiIiwiYyIsIlBST1RPVFlQRSIsIiRleHBvcnQiLCJuYW1lIiwic291cmNlIiwiSVNfRk9SQ0VEIiwiRiIsIklTX0dMT0JBTCIsIkciLCJJU19TVEFUSUMiLCJJU19QUk9UTyIsIklTX0JJTkQiLCJCIiwiZXhwUHJvdG8iLCJvd24iLCJvdXQiLCJleHAiLCJjdHgiLCJyZWRlZmluZSIsIlUiLCJXIiwiUiIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwic2xpY2UiLCJjb2YiLCJJT2JqZWN0IiwiZGVmaW5lZCIsImdPUEQiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ0b0lPYmplY3QiLCJwSUUiLCJjaGVjayIsInByb3RvIiwic2V0UHJvdG90eXBlT2YiLCJidWdneSIsInNldCIsIkFycmF5IiwiX19wcm90b19fIiwiU0hBUkVEIiwic3RvcmUiLCJwdXNoIiwiU3ltYm9sIiwiVVNFX1NZTUJPTCIsIiRleHBvcnRzIiwidWlkIiwiVEFHIiwiQVJHIiwidHJ5R2V0IiwiVCIsImNhbGxlZSIsImNsYXNzb2YiLCJjZWlsIiwiZmxvb3IiLCJpc05hTiIsInBvcyIsInMiLCJ0b0ludGVnZXIiLCJjaGFyQ29kZUF0IiwiY2hhckF0IiwibWluIiwibWF4IiwiaW5kZXgiLCJJU19JTkNMVURFUyIsIiR0aGlzIiwiZWwiLCJmcm9tSW5kZXgiLCJ0b0xlbmd0aCIsInRvQWJzb2x1dGVJbmRleCIsInNoYXJlZCIsImFycmF5SW5kZXhPZiIsIklFX1BST1RPIiwibmFtZXMiLCJyZXN1bHQiLCJrZXlzIiwiJGtleXMiLCJlbnVtQnVnS2V5cyIsImRlZmluZVByb3BlcnRpZXMiLCJQcm9wZXJ0aWVzIiwiZ2V0S2V5cyIsIkVtcHR5IiwiY3JlYXRlRGljdCIsImlmcmFtZSIsImx0IiwiZ3QiLCJpZnJhbWVEb2N1bWVudCIsImRpc3BsYXkiLCJhcHBlbmRDaGlsZCIsInNyYyIsImNvbnRlbnRXaW5kb3ciLCJvcGVuIiwid3JpdGUiLCJjbG9zZSIsImNyZWF0ZSIsImFuT2JqZWN0IiwiZFBzIiwiZGVmIiwidGFnIiwic3RhdCIsImNvbmZpZ3VyYWJsZSIsIkl0ZXJhdG9yUHJvdG90eXBlIiwiQ29uc3RydWN0b3IiLCJOQU1FIiwibmV4dCIsImRlc2NyaXB0b3IiLCJPYmplY3RQcm90byIsImdldFByb3RvdHlwZU9mIiwidG9PYmplY3QiLCJjb25zdHJ1Y3RvciIsIklURVJBVE9SIiwiQlVHR1kiLCJGRl9JVEVSQVRPUiIsIktFWVMiLCJWQUxVRVMiLCJyZXR1cm5UaGlzIiwiQmFzZSIsIkRFRkFVTFQiLCJJU19TRVQiLCJGT1JDRUQiLCJnZXRNZXRob2QiLCJraW5kIiwidmFsdWVzIiwiZW50cmllcyIsIkRFRl9WQUxVRVMiLCJWQUxVRVNfQlVHIiwiJG5hdGl2ZSIsIiRkZWZhdWx0IiwiJGVudHJpZXMiLCIkYW55TmF0aXZlIiwiTElCUkFSWSIsIiRhdCIsIml0ZXJhdGVkIiwiX3QiLCJfaSIsInBvaW50IiwiZG9uZSIsIlVOU0NPUEFCTEVTIiwiQXJyYXlQcm90byIsIl9rIiwic3RlcCIsIkl0ZXJhdG9ycyIsIkFyZ3VtZW50cyIsImFkZFRvVW5zY29wYWJsZXMiLCJ3a3MiLCJUT19TVFJJTkdfVEFHIiwiQXJyYXlWYWx1ZXMiLCJET01JdGVyYWJsZXMiLCJjb2xsZWN0aW9ucyIsImV4cGxpY2l0IiwiQ29sbGVjdGlvbiIsIiRpdGVyYXRvcnMiLCJmb3JiaWRkZW5GaWVsZCIsIml0ZXJhdG9yIiwicmV0IiwiZ2V0SXRlcmF0b3JNZXRob2QiLCJCUkVBSyIsIlJFVFVSTiIsIml0ZXJhYmxlIiwiaXRlckZuIiwiZ2V0SXRlckZuIiwiaXNBcnJheUl0ZXIiLCJTUEVDSUVTIiwiS0VZIiwiQyIsIkRFU0NSSVBUT1JTIiwiTUVUQSIsInNldERlc2MiLCJpc0V4dGVuc2libGUiLCJGUkVFWkUiLCJwcmV2ZW50RXh0ZW5zaW9ucyIsInNldE1ldGEiLCJmYXN0S2V5IiwiZ2V0V2VhayIsInciLCJvbkZyZWV6ZSIsIm1ldGEiLCJORUVEIiwiVFlQRSIsIlNJWkUiLCJnZXRFbnRyeSIsImVudHJ5IiwiX2YiLCJuIiwiayIsIndyYXBwZXIiLCJJU19NQVAiLCJBRERFUiIsIl9sIiwiZm9yT2YiLCJjbGVhciIsInZhbGlkYXRlIiwiZGF0YSIsInIiLCJwIiwicHJldiIsImZvckVhY2giLCJjYWxsYmFja2ZuIiwidiIsIlNBRkVfQ0xPU0lORyIsInJpdGVyIiwic2tpcENsb3NpbmciLCJhcnIiLCJpdGVyIiwiY29tbW9uIiwiSVNfV0VBSyIsImZpeE1ldGhvZCIsImFkZCIsImZhaWxzIiwiZ2V0Q29uc3RydWN0b3IiLCJpbnN0YW5jZSIsIkhBU05UX0NIQUlOSU5HIiwiVEhST1dTX09OX1BSSU1JVElWRVMiLCJBQ0NFUFRfSVRFUkFCTEVTIiwiJGl0ZXJEZXRlY3QiLCJCVUdHWV9aRVJPIiwiJGluc3RhbmNlIiwiaW5oZXJpdElmUmVxdWlyZWQiLCJzZXRTdHJvbmciLCJTRVQiLCJTZXQiLCJzdHJvbmciLCJ0b0pTT04iLCJmcm9tIiwiQ09MTEVDVElPTiIsIm9mIiwiQSIsIm1hcEZuIiwibWFwcGluZyIsImNiIiwiYUZ1bmN0aW9uIiwibmV4dEl0ZW0iLCJyZXF1aXJlJCQ3IiwiTUFQIiwiTWFwIiwiaXNBcnJheSIsImFyZyIsIm9yaWdpbmFsIiwic3BlY2llc0NvbnN0cnVjdG9yIiwiJGNyZWF0ZSIsIklTX0ZJTFRFUiIsIklTX1NPTUUiLCJJU19FVkVSWSIsIklTX0ZJTkRfSU5ERVgiLCJOT19IT0xFUyIsImFzYyIsInJlcyIsImdldE93blByb3BlcnR5U3ltYm9scyIsIiRhc3NpZ24iLCJhc3NpZ24iLCJLIiwiYUxlbiIsImdldFN5bWJvbHMiLCJnT1BTIiwiaXNFbnVtIiwiaiIsImFycmF5RmluZCIsImNyZWF0ZUFycmF5TWV0aG9kIiwiYXJyYXlGaW5kSW5kZXgiLCJ1bmNhdWdodEZyb3plblN0b3JlIiwiVW5jYXVnaHRGcm96ZW5TdG9yZSIsImZpbmRVbmNhdWdodEZyb3plbiIsInNwbGljZSIsIiRoYXMiLCJlYWNoIiwiV0VBS19NQVAiLCJ3ZWFrIiwidWZzdG9yZSIsInRtcCIsIkludGVybmFsTWFwIiwiV2Vha01hcCIsIiRXZWFrTWFwIiwiZnJlZXplIiwicmVxdWlyZSQkNSIsIiRkZWZpbmVQcm9wZXJ0eSIsImFycmF5TGlrZSIsIm1hcGZuIiwicmVzZXJ2ZWRUYWdMaXN0IiwiaXNWYWxpZEN1c3RvbUVsZW1lbnROYW1lIiwibG9jYWxOYW1lIiwicmVzZXJ2ZWQiLCJ2YWxpZEZvcm0iLCJpc0Nvbm5lY3RlZCIsIm5vZGUiLCJuYXRpdmVWYWx1ZSIsImN1cnJlbnQiLCJfX0NFX2lzSW1wb3J0RG9jdW1lbnQiLCJEb2N1bWVudCIsIlNoYWRvd1Jvb3QiLCJob3N0IiwibmV4dFNpYmxpbmdPckFuY2VzdG9yU2libGluZyIsInJvb3QiLCJzdGFydCIsIm5leHRTaWJsaW5nIiwibmV4dE5vZGUiLCJmaXJzdENoaWxkIiwid2Fsa0RlZXBEZXNjZW5kYW50RWxlbWVudHMiLCJ2aXNpdGVkSW1wb3J0cyIsIkVMRU1FTlRfTk9ERSIsImVsZW1lbnQiLCJnZXRBdHRyaWJ1dGUiLCJpbXBvcnROb2RlIiwiaW1wb3J0IiwiY2hpbGQiLCJzaGFkb3dSb290IiwiX19DRV9zaGFkb3dSb290Iiwic2V0UHJvcGVydHlVbmNoZWNrZWQiLCJkZXN0aW5hdGlvbiIsIkN1c3RvbUVsZW1lbnRTdGF0ZSIsIkN1c3RvbUVsZW1lbnRJbnRlcm5hbHMiLCJfbG9jYWxOYW1lVG9EZWZpbml0aW9uIiwiX2NvbnN0cnVjdG9yVG9EZWZpbml0aW9uIiwiX3BhdGNoZXMiLCJfaGFzUGF0Y2hlcyIsImRlZmluaXRpb24iLCJsaXN0ZW5lciIsInBhdGNoIiwiX19DRV9wYXRjaGVkIiwiZWxlbWVudHMiLCJfX0NFX3N0YXRlIiwiQ0VTdGF0ZSIsImN1c3RvbSIsIlV0aWxpdGllcyIsImNvbm5lY3RlZENhbGxiYWNrIiwidXBncmFkZUVsZW1lbnQiLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsImdhdGhlckVsZW1lbnRzIiwicmVhZHlTdGF0ZSIsIl9fQ0VfaGFzUmVnaXN0cnkiLCJfX0NFX2RvY3VtZW50TG9hZEhhbmRsZWQiLCJkZWxldGUiLCJwYXRjaEFuZFVwZ3JhZGVUcmVlIiwiY3VycmVudFN0YXRlIiwibG9jYWxOYW1lVG9EZWZpbml0aW9uIiwiY29uc3RydWN0aW9uU3RhY2siLCJFcnJvciIsInBvcCIsImZhaWxlZCIsIl9fQ0VfZGVmaW5pdGlvbiIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsIm9ic2VydmVkQXR0cmlidXRlcyIsIl9fQ0VfaXNDb25uZWN0ZWRDYWxsYmFja0NhbGxlZCIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJuYW1lc3BhY2UiLCJEb2N1bWVudENvbnN0cnVjdGlvbk9ic2VydmVyIiwiaW50ZXJuYWxzIiwiZG9jIiwiX2ludGVybmFscyIsIl9kb2N1bWVudCIsIl9vYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJfaGFuZGxlTXV0YXRpb25zIiwib2JzZXJ2ZSIsImRpc2Nvbm5lY3QiLCJtdXRhdGlvbnMiLCJhZGRlZE5vZGVzIiwiRGVmZXJyZWQiLCJfdmFsdWUiLCJfcmVzb2x2ZSIsIl9wcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJDdXN0b21FbGVtZW50UmVnaXN0cnkiLCJfZWxlbWVudERlZmluaXRpb25Jc1J1bm5pbmciLCJfd2hlbkRlZmluZWREZWZlcnJlZCIsIl9mbHVzaENhbGxiYWNrIiwiX2ZsdXNoUGVuZGluZyIsIl91bmZsdXNoZWRMb2NhbE5hbWVzIiwiX2RvY3VtZW50Q29uc3RydWN0aW9uT2JzZXJ2ZXIiLCJTeW50YXhFcnJvciIsImFkb3B0ZWRDYWxsYmFjayIsImdldENhbGxiYWNrIiwiY2FsbGJhY2tWYWx1ZSIsInNldERlZmluaXRpb24iLCJfZmx1c2giLCJzaGlmdCIsImRlZmVycmVkIiwicmVqZWN0IiwicHJpb3IiLCJ0b1Byb21pc2UiLCJvdXRlciIsImlubmVyIiwiZmx1c2giLCJ3aGVuRGVmaW5lZCIsInBvbHlmaWxsV3JhcEZsdXNoQ2FsbGJhY2siLCJjcmVhdGVFbGVtZW50TlMiLCJjbG9uZU5vZGUiLCJpbnNlcnRCZWZvcmUiLCJyZW1vdmVDaGlsZCIsInJlcGxhY2VDaGlsZCIsIkVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJnZXRBdHRyaWJ1dGVOUyIsInNldEF0dHJpYnV0ZU5TIiwicmVtb3ZlQXR0cmlidXRlTlMiLCJIVE1MRWxlbWVudCIsIkFscmVhZHlDb25zdHJ1Y3RlZE1hcmtlciIsImNvbnN0cnVjdG9yVG9EZWZpbml0aW9uIiwiTmF0aXZlIiwiRG9jdW1lbnRfY3JlYXRlRWxlbWVudCIsImxhc3RJbmRleCIsImJ1aWx0SW4iLCJub2RlcyIsImNvbm5lY3RlZEJlZm9yZSIsImZpbHRlciIsInByZXBlbmQiLCJkaXNjb25uZWN0VHJlZSIsImNvbm5lY3RUcmVlIiwiYXBwZW5kIiwiZGVlcCIsImNsb25lIiwiRG9jdW1lbnRfaW1wb3J0Tm9kZSIsInBhdGNoVHJlZSIsIk5TX0hUTUwiLCJEb2N1bWVudF9jcmVhdGVFbGVtZW50TlMiLCJEb2N1bWVudF9wcmVwZW5kIiwiRG9jdW1lbnRfYXBwZW5kIiwicmVmTm9kZSIsIkRvY3VtZW50RnJhZ21lbnQiLCJpbnNlcnRlZE5vZGVzIiwiY2hpbGROb2RlcyIsIm5hdGl2ZVJlc3VsdCIsIk5vZGVfaW5zZXJ0QmVmb3JlIiwibm9kZVdhc0Nvbm5lY3RlZCIsIk5vZGVfYXBwZW5kQ2hpbGQiLCJOb2RlX2Nsb25lTm9kZSIsIm93bmVyRG9jdW1lbnQiLCJOb2RlX3JlbW92ZUNoaWxkIiwibm9kZVRvSW5zZXJ0Iiwibm9kZVRvUmVtb3ZlIiwiTm9kZV9yZXBsYWNlQ2hpbGQiLCJub2RlVG9JbnNlcnRXYXNDb25uZWN0ZWQiLCJ0aGlzSXNDb25uZWN0ZWQiLCJwYXRjaF90ZXh0Q29udGVudCIsImJhc2VEZXNjcmlwdG9yIiwiZW51bWVyYWJsZSIsImFzc2lnbmVkVmFsdWUiLCJyZW1vdmVkTm9kZXMiLCJjaGlsZE5vZGVzTGVuZ3RoIiwiTm9kZV90ZXh0Q29udGVudCIsImFkZFBhdGNoIiwicGFydHMiLCJ0ZXh0Q29udGVudCIsImNyZWF0ZVRleHROb2RlIiwiYmVmb3JlIiwiYWZ0ZXIiLCJ3YXNDb25uZWN0ZWQiLCJyZXBsYWNlV2l0aCIsInJlbW92ZSIsIkVsZW1lbnRfYXR0YWNoU2hhZG93IiwiaW5pdCIsIndhcm4iLCJwYXRjaF9pbm5lckhUTUwiLCJodG1sU3RyaW5nIiwicmVtb3ZlZEVsZW1lbnRzIiwiRWxlbWVudF9pbm5lckhUTUwiLCJIVE1MRWxlbWVudF9pbm5lckhUTUwiLCJyYXdEaXYiLCJpbm5lckhUTUwiLCJFbGVtZW50X3NldEF0dHJpYnV0ZSIsIkVsZW1lbnRfZ2V0QXR0cmlidXRlIiwiRWxlbWVudF9zZXRBdHRyaWJ1dGVOUyIsIkVsZW1lbnRfZ2V0QXR0cmlidXRlTlMiLCJFbGVtZW50X3JlbW92ZUF0dHJpYnV0ZSIsIkVsZW1lbnRfcmVtb3ZlQXR0cmlidXRlTlMiLCJwYXRjaF9pbnNlcnRBZGphY2VudEVsZW1lbnQiLCJiYXNlTWV0aG9kIiwid2hlcmUiLCJpbnNlcnRlZEVsZW1lbnQiLCJIVE1MRWxlbWVudF9pbnNlcnRBZGphY2VudEVsZW1lbnQiLCJFbGVtZW50X2luc2VydEFkamFjZW50RWxlbWVudCIsIkVsZW1lbnRfcHJlcGVuZCIsIkVsZW1lbnRfYXBwZW5kIiwiRWxlbWVudF9iZWZvcmUiLCJFbGVtZW50X2FmdGVyIiwiRWxlbWVudF9yZXBsYWNlV2l0aCIsIkVsZW1lbnRfcmVtb3ZlIiwicHJpb3JDdXN0b21FbGVtZW50cyIsIkpzTXV0YXRpb25PYnNlcnZlciIsInJlZ2lzdHJhdGlvbnNUYWJsZSIsInNldEltbWVkaWF0ZSIsInNldFRpbWVvdXQiLCJzZXRJbW1lZGlhdGVRdWV1ZSIsInNlbnRpbmVsIiwicXVldWUiLCJmdW5jIiwicG9zdE1lc3NhZ2UiLCJpc1NjaGVkdWxlZCIsInNjaGVkdWxlZE9ic2VydmVycyIsInNjaGVkdWxlQ2FsbGJhY2siLCJvYnNlcnZlciIsImRpc3BhdGNoQ2FsbGJhY2tzIiwid3JhcElmTmVlZGVkIiwiU2hhZG93RE9NUG9seWZpbGwiLCJvYnNlcnZlcnMiLCJzb3J0IiwibzEiLCJvMiIsInVpZF8iLCJhbnlOb25FbXB0eSIsInRha2VSZWNvcmRzIiwiY2FsbGJhY2tfIiwicmVtb3ZlVHJhbnNpZW50T2JzZXJ2ZXJzRm9yIiwibm9kZXNfIiwicmVnaXN0cmF0aW9ucyIsInJlZ2lzdHJhdGlvbiIsInJlbW92ZVRyYW5zaWVudE9ic2VydmVycyIsImZvckVhY2hBbmNlc3RvckFuZE9ic2VydmVyRW5xdWV1ZVJlY29yZCIsInN1YnRyZWUiLCJyZWNvcmQiLCJlbnF1ZXVlIiwidWlkQ291bnRlciIsInJlY29yZHNfIiwiY2hpbGRMaXN0IiwiYXR0cmlidXRlcyIsImNoYXJhY3RlckRhdGEiLCJhdHRyaWJ1dGVPbGRWYWx1ZSIsImF0dHJpYnV0ZUZpbHRlciIsImNoYXJhY3RlckRhdGFPbGRWYWx1ZSIsInJlbW92ZUxpc3RlbmVycyIsIlJlZ2lzdHJhdGlvbiIsImFkZExpc3RlbmVycyIsImNvcHlPZlJlY29yZHMiLCJNdXRhdGlvblJlY29yZCIsInByZXZpb3VzU2libGluZyIsImF0dHJpYnV0ZU5hbWUiLCJhdHRyaWJ1dGVOYW1lc3BhY2UiLCJjb3B5TXV0YXRpb25SZWNvcmQiLCJjdXJyZW50UmVjb3JkIiwicmVjb3JkV2l0aE9sZFZhbHVlIiwiZ2V0UmVjb3JkIiwiZ2V0UmVjb3JkV2l0aE9sZFZhbHVlIiwiY2xlYXJSZWNvcmRzIiwicmVjb3JkUmVwcmVzZW50c0N1cnJlbnRNdXRhdGlvbiIsInNlbGVjdFJlY29yZCIsImxhc3RSZWNvcmQiLCJuZXdSZWNvcmQiLCJ0cmFuc2llbnRPYnNlcnZlZE5vZGVzIiwicmVjb3JkcyIsInJlY29yZFRvUmVwbGFjZUxhc3QiLCJhZGRMaXN0ZW5lcnNfIiwicmVtb3ZlTGlzdGVuZXJzXyIsImF0dHJOYW1lIiwicmVsYXRlZE5vZGUiLCJuYW1lc3BhY2VVUkkiLCJhdHRyQ2hhbmdlIiwiTXV0YXRpb25FdmVudCIsIkFERElUSU9OIiwicHJldlZhbHVlIiwiYWRkVHJhbnNpZW50T2JzZXJ2ZXIiLCJjaGFuZ2VkTm9kZSIsIl9pc1BvbHlmaWxsZWQiLCJuZXh0SGFuZGxlIiwidGFza3NCeUhhbmRsZSIsImN1cnJlbnRseVJ1bm5pbmdBVGFzayIsImFkZEZyb21TZXRJbW1lZGlhdGVBcmd1bWVudHMiLCJhcmdzIiwicGFydGlhbGx5QXBwbGllZCIsImhhbmRsZXIiLCJydW5JZlByZXNlbnQiLCJoYW5kbGUiLCJ0YXNrIiwiY2xlYXJJbW1lZGlhdGUiLCJpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbiIsIm5leHRUaWNrIiwiY2FuVXNlUG9zdE1lc3NhZ2UiLCJpbXBvcnRTY3JpcHRzIiwicG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyIsIm9sZE9uTWVzc2FnZSIsIm9ubWVzc2FnZSIsImluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uIiwibWVzc2FnZVByZWZpeCIsIm9uR2xvYmFsTWVzc2FnZSIsImF0dGFjaEV2ZW50IiwiaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24iLCJjaGFubmVsIiwiTWVzc2FnZUNoYW5uZWwiLCJwb3J0MSIsInBvcnQyIiwiaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbiIsImh0bWwiLCJzY3JpcHQiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uIiwiYXR0YWNoVG8iLCJwcm9jZXNzIiwiREVGQVVMVF9WSUVXUE9SVCIsIlZpZXdwb3J0Iiwidmlld3BvcnRFbGVtZW50IiwiaGVhZCIsImVuc3VyZVZpZXdwb3J0RWxlbWVudCIsImhhc0F0dHJpYnV0ZSIsInNldHVwIiwib25zIiwiX29uc0xvYWRlZCIsIl91dGlsIiwiZmFzdENsaWNrIiwiYm9keSIsInN1cHBvcnRUb3VjaEFjdGlvbiIsInBsYXRmb3JtIiwiX3J1bk9uQWN0dWFsUGxhdGZvcm0iLCJpc0FuZHJvaWQiLCJpc0lPUyIsImlzSU9TU2FmYXJpIiwiaXNXS1dlYlZpZXciLCJyZWFkeSIsImVuYWJsZURldmljZUJhY2tCdXR0b25IYW5kbGVyIiwiX2RlZmF1bHREZXZpY2VCYWNrQnV0dG9uSGFuZGxlciIsIl9pbnRlcm5hbCIsImRiYkRpc3BhdGNoZXIiLCJjcmVhdGVIYW5kbGVyIiwiYXBwIiwiZXhpdEFwcCIsIl9nZXN0dXJlRGV0ZWN0b3IiLCJHZXN0dXJlRGV0ZWN0b3IiLCJwYXNzaXZlIiwiaXNXZWJWaWV3Iiwia2V5Q29kZSIsImZpcmVEZXZpY2VCYWNrQnV0dG9uRXZlbnQiLCJfc2V0dXBMb2FkaW5nUGxhY2VIb2xkZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FBRSxhQUFZO1dBc0JKQSxTQUFULENBQW1CQyxLQUFuQixFQUEwQkMsT0FBMUIsRUFBbUM7T0FDOUJDLFVBQUo7O2FBRVVELFdBQVcsRUFBckI7Ozs7Ozs7UUFPS0UsYUFBTCxHQUFxQixLQUFyQjs7Ozs7OztRQVFLQyxrQkFBTCxHQUEwQixDQUExQjs7Ozs7OztRQVFLQyxhQUFMLEdBQXFCLElBQXJCOzs7Ozs7O1FBUUtDLFdBQUwsR0FBbUIsQ0FBbkI7Ozs7Ozs7UUFRS0MsV0FBTCxHQUFtQixDQUFuQjs7Ozs7OztRQVFLQyxtQkFBTCxHQUEyQixDQUEzQjs7Ozs7OztRQVFLQyxhQUFMLEdBQXFCUixRQUFRUSxhQUFSLElBQXlCLEVBQTlDOzs7Ozs7O1FBUUtULEtBQUwsR0FBYUEsS0FBYjs7Ozs7OztRQU9LVSxRQUFMLEdBQWdCVCxRQUFRUyxRQUFSLElBQW9CLEdBQXBDOzs7Ozs7O1FBT0tDLFVBQUwsR0FBa0JWLFFBQVFVLFVBQVIsSUFBc0IsR0FBeEM7O09BRUlaLFVBQVVhLFNBQVYsQ0FBb0JaLEtBQXBCLENBQUosRUFBZ0M7Ozs7O1lBS3ZCYSxJQUFULENBQWNDLE1BQWQsRUFBc0JDLE9BQXRCLEVBQStCO1dBQ3ZCLFlBQVc7WUFBU0QsT0FBT0UsS0FBUCxDQUFhRCxPQUFiLEVBQXNCRSxTQUF0QixDQUFQO0tBQXBCOzs7T0FJR0MsVUFBVSxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLGNBQXZCLEVBQXVDLGFBQXZDLEVBQXNELFlBQXRELEVBQW9FLGVBQXBFLENBQWQ7T0FDSUgsVUFBVSxJQUFkO1FBQ0ssSUFBSUksSUFBSSxDQUFSLEVBQVdDLElBQUlGLFFBQVFHLE1BQTVCLEVBQW9DRixJQUFJQyxDQUF4QyxFQUEyQ0QsR0FBM0MsRUFBZ0Q7WUFDdkNELFFBQVFDLENBQVIsQ0FBUixJQUFzQk4sS0FBS0UsUUFBUUcsUUFBUUMsQ0FBUixDQUFSLENBQUwsRUFBMEJKLE9BQTFCLENBQXRCOzs7O09BSUdPLGVBQUosRUFBcUI7VUFDZEMsZ0JBQU4sQ0FBdUIsV0FBdkIsRUFBb0MsS0FBS0MsT0FBekMsRUFBa0QsSUFBbEQ7VUFDTUQsZ0JBQU4sQ0FBdUIsV0FBdkIsRUFBb0MsS0FBS0MsT0FBekMsRUFBa0QsSUFBbEQ7VUFDTUQsZ0JBQU4sQ0FBdUIsU0FBdkIsRUFBa0MsS0FBS0MsT0FBdkMsRUFBZ0QsSUFBaEQ7OztTQUdLRCxnQkFBTixDQUF1QixPQUF2QixFQUFnQyxLQUFLRSxPQUFyQyxFQUE4QyxJQUE5QztTQUNNRixnQkFBTixDQUF1QixZQUF2QixFQUFxQyxLQUFLRyxZQUExQyxFQUF3RCxLQUF4RDtTQUNNSCxnQkFBTixDQUF1QixXQUF2QixFQUFvQyxLQUFLSSxXQUF6QyxFQUFzRCxLQUF0RDtTQUNNSixnQkFBTixDQUF1QixVQUF2QixFQUFtQyxLQUFLSyxVQUF4QyxFQUFvRCxLQUFwRDtTQUNNTCxnQkFBTixDQUF1QixhQUF2QixFQUFzQyxLQUFLTSxhQUEzQyxFQUEwRCxLQUExRDs7Ozs7T0FLSSxDQUFDQyxNQUFNQyxTQUFOLENBQWdCQyx3QkFBckIsRUFBK0M7VUFDeENDLG1CQUFOLEdBQTRCLFVBQVNDLElBQVQsRUFBZUMsUUFBZixFQUF5QkMsT0FBekIsRUFBa0M7U0FDekRDLE1BQU1DLEtBQUtQLFNBQUwsQ0FBZUUsbUJBQXpCO1NBQ0lDLFNBQVMsT0FBYixFQUFzQjtVQUNqQkssSUFBSixDQUFTdkMsS0FBVCxFQUFnQmtDLElBQWhCLEVBQXNCQyxTQUFTSyxRQUFULElBQXFCTCxRQUEzQyxFQUFxREMsT0FBckQ7TUFERCxNQUVPO1VBQ0ZHLElBQUosQ0FBU3ZDLEtBQVQsRUFBZ0JrQyxJQUFoQixFQUFzQkMsUUFBdEIsRUFBZ0NDLE9BQWhDOztLQUxGOztVQVNNYixnQkFBTixHQUF5QixVQUFTVyxJQUFULEVBQWVDLFFBQWYsRUFBeUJDLE9BQXpCLEVBQWtDO1NBQ3RESyxNQUFNSCxLQUFLUCxTQUFMLENBQWVSLGdCQUF6QjtTQUNJVyxTQUFTLE9BQWIsRUFBc0I7VUFDakJLLElBQUosQ0FBU3ZDLEtBQVQsRUFBZ0JrQyxJQUFoQixFQUFzQkMsU0FBU0ssUUFBVCxLQUFzQkwsU0FBU0ssUUFBVCxHQUFvQixVQUFTRSxLQUFULEVBQWdCO1dBQzNFLENBQUNBLE1BQU1DLGtCQUFYLEVBQStCO2lCQUNyQkQsS0FBVDs7T0FGb0IsQ0FBdEIsRUFJSU4sT0FKSjtNQURELE1BTU87VUFDRkcsSUFBSixDQUFTdkMsS0FBVCxFQUFnQmtDLElBQWhCLEVBQXNCQyxRQUF0QixFQUFnQ0MsT0FBaEM7O0tBVEY7Ozs7OztPQWlCRyxPQUFPcEMsTUFBTTRDLE9BQWIsS0FBeUIsVUFBN0IsRUFBeUM7Ozs7aUJBSTNCNUMsTUFBTTRDLE9BQW5CO1VBQ01yQixnQkFBTixDQUF1QixPQUF2QixFQUFnQyxVQUFTbUIsS0FBVCxFQUFnQjtnQkFDcENBLEtBQVg7S0FERCxFQUVHLEtBRkg7VUFHTUUsT0FBTixHQUFnQixJQUFoQjs7Ozs7Ozs7O01BU0VDLHVCQUF1QkMsVUFBVUMsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNEIsZUFBNUIsS0FBZ0QsQ0FBM0U7Ozs7Ozs7TUFPSTFCLGtCQUFrQndCLFVBQVVDLFNBQVYsQ0FBb0JDLE9BQXBCLENBQTRCLFNBQTVCLElBQXlDLENBQXpDLElBQThDLENBQUNILG9CQUFyRTs7Ozs7OztNQVFJSSxjQUFjLGlCQUFpQkMsSUFBakIsQ0FBc0JKLFVBQVVDLFNBQWhDLEtBQThDLENBQUNGLG9CQUFqRTs7Ozs7OztNQVFJTSxlQUFlRixlQUFnQixlQUFELENBQWtCQyxJQUFsQixDQUF1QkosVUFBVUMsU0FBakMsQ0FBbEM7Ozs7Ozs7TUFRSUssMkJBQTJCSCxlQUFnQixhQUFELENBQWdCQyxJQUFoQixDQUFxQkosVUFBVUMsU0FBL0IsQ0FBOUM7Ozs7Ozs7TUFPSU0sdUJBQXVCUCxVQUFVQyxTQUFWLENBQW9CQyxPQUFwQixDQUE0QixNQUE1QixJQUFzQyxDQUFqRTs7Ozs7OztNQU9JTSxhQUFhLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsVUFBcEIsRUFBZ0MsUUFBaEMsRUFBMEMsS0FBMUMsRUFBaUQsTUFBakQsRUFBeUQsS0FBekQsQ0FBakI7Ozs7Ozs7O1lBUVV2QixTQUFWLENBQW9Cd0IsVUFBcEIsR0FBaUMsVUFBU0MsTUFBVCxFQUFpQjtXQUN6Q0EsT0FBT0MsUUFBUCxDQUFnQkMsV0FBaEIsRUFBUjs7O1NBR0ssUUFBTDtTQUNLLFFBQUw7U0FDSyxVQUFMO1NBQ0tGLE9BQU9HLFFBQVgsRUFBcUI7YUFDYixJQUFQOzs7O1NBSUcsT0FBTDs7O1NBR01WLGVBQWVPLE9BQU90QixJQUFQLEtBQWdCLE1BQWhDLElBQTJDc0IsT0FBT0csUUFBdEQsRUFBZ0U7YUFDeEQsSUFBUDs7OztTQUlHLE9BQUw7U0FDSyxRQUFMLENBcEJBO1NBcUJLLE9BQUw7WUFDUSxJQUFQOzs7MkJBR00sQ0FBbUJULElBQW5CLENBQXdCTSxPQUFPSSxTQUEvQjs7R0ExQlI7Ozs7Ozs7O1lBb0NVN0IsU0FBVixDQUFvQjhCLFVBQXBCLEdBQWlDLFVBQVNMLE1BQVQsRUFBaUI7V0FDekNBLE9BQU9DLFFBQVAsQ0FBZ0JDLFdBQWhCLEVBQVI7U0FDSyxVQUFMO1lBQ1EsSUFBUDtTQUNJLFFBQUw7WUFDUSxDQUFDcEMsZUFBUjtTQUNJLE9BQUw7YUFDU2tDLE9BQU90QixJQUFmO1dBQ0ssUUFBTDtXQUNLLFVBQUw7V0FDSyxNQUFMO1dBQ0ssT0FBTDtXQUNLLE9BQUw7V0FDSyxRQUFMO2NBQ1EsS0FBUDs7OztZQUlNLENBQUNzQixPQUFPRyxRQUFSLElBQW9CLENBQUNILE9BQU9NLFFBQW5DOzs2QkFFTyxDQUFtQlosSUFBbkIsQ0FBd0JNLE9BQU9JLFNBQS9COzs7R0FwQlQ7Ozs7Ozs7O1lBK0JVN0IsU0FBVixDQUFvQmdDLFNBQXBCLEdBQWdDLFVBQVMxRCxhQUFULEVBQXdCcUMsS0FBeEIsRUFBK0I7T0FDMURzQixVQUFKLEVBQWdCQyxLQUFoQjs7O09BR0lDLFNBQVNDLGFBQVQsSUFBMEJELFNBQVNDLGFBQVQsS0FBMkI5RCxhQUF6RCxFQUF3RTthQUM5RDhELGFBQVQsQ0FBdUJDLElBQXZCOzs7V0FHTzFCLE1BQU0yQixjQUFOLENBQXFCLENBQXJCLENBQVI7OztnQkFHYUgsU0FBU0ksV0FBVCxDQUFxQixhQUFyQixDQUFiO2NBQ1dDLGNBQVgsQ0FBMEIsS0FBS0Msa0JBQUwsQ0FBd0JuRSxhQUF4QixDQUExQixFQUFrRSxJQUFsRSxFQUF3RSxJQUF4RSxFQUE4RW9FLE1BQTlFLEVBQXNGLENBQXRGLEVBQXlGUixNQUFNUyxPQUEvRixFQUF3R1QsTUFBTVUsT0FBOUcsRUFBdUhWLE1BQU1XLE9BQTdILEVBQXNJWCxNQUFNWSxPQUE1SSxFQUFxSixLQUFySixFQUE0SixLQUE1SixFQUFtSyxLQUFuSyxFQUEwSyxLQUExSyxFQUFpTCxDQUFqTCxFQUFvTCxJQUFwTDtjQUNXQyxtQkFBWCxHQUFpQyxJQUFqQztpQkFDY0MsYUFBZCxDQUE0QmYsVUFBNUI7R0FkRDs7WUFpQlVqQyxTQUFWLENBQW9CeUMsa0JBQXBCLEdBQXlDLFVBQVNuRSxhQUFULEVBQXdCOzs7T0FHNURpQixtQkFBbUJqQixjQUFjMkUsT0FBZCxDQUFzQnRCLFdBQXRCLE9BQXdDLFFBQS9ELEVBQXlFO1dBQ2pFLFdBQVA7OztVQUdNLE9BQVA7R0FQRDs7Ozs7WUFjVTNCLFNBQVYsQ0FBb0JrRCxLQUFwQixHQUE0QixVQUFTNUUsYUFBVCxFQUF3QjtPQUMvQ2dCLE1BQUo7OztPQUdJNEIsZUFBZTVDLGNBQWM2RSxpQkFBN0IsSUFBa0Q3RSxjQUFjNkIsSUFBZCxDQUFtQmMsT0FBbkIsQ0FBMkIsTUFBM0IsTUFBdUMsQ0FBekYsSUFBOEYzQyxjQUFjNkIsSUFBZCxLQUF1QixNQUFySCxJQUErSDdCLGNBQWM2QixJQUFkLEtBQXVCLE9BQXRKLElBQWlLN0IsY0FBYzZCLElBQWQsS0FBdUIsT0FBeEwsSUFBbU03QixjQUFjNkIsSUFBZCxLQUF1QixRQUE5TixFQUF3TzthQUM5TjdCLGNBQWM4RSxLQUFkLENBQW9COUQsTUFBN0I7a0JBQ2M2RCxpQkFBZCxDQUFnQzdELE1BQWhDLEVBQXdDQSxNQUF4QztJQUZELE1BR087a0JBQ1E0RCxLQUFkOztHQVJGOzs7Ozs7O1lBa0JVbEQsU0FBVixDQUFvQnFELGtCQUFwQixHQUF5QyxVQUFTL0UsYUFBVCxFQUF3QjtPQUM1RGdGLFlBQUosRUFBa0JDLGFBQWxCOztrQkFFZWpGLGNBQWNrRixxQkFBN0I7Ozs7T0FJSSxDQUFDRixZQUFELElBQWlCLENBQUNBLGFBQWFHLFFBQWIsQ0FBc0JuRixhQUF0QixDQUF0QixFQUE0RDtvQkFDM0NBLGFBQWhCO09BQ0c7U0FDRWlGLGNBQWNHLFlBQWQsR0FBNkJILGNBQWNJLFlBQS9DLEVBQTZEO3FCQUM3Q0osYUFBZjtvQkFDY0MscUJBQWQsR0FBc0NELGFBQXRDOzs7O3FCQUllQSxjQUFjQSxhQUE5QjtLQVBELFFBUVNBLGFBUlQ7Ozs7T0FZR0QsWUFBSixFQUFrQjtpQkFDSk0sc0JBQWIsR0FBc0NOLGFBQWFPLFNBQW5EOztHQXRCRjs7Ozs7O1lBK0JVN0QsU0FBVixDQUFvQjhELCtCQUFwQixHQUFzRCxVQUFTQyxXQUFULEVBQXNCOzs7T0FHdkVBLFlBQVlDLFFBQVosS0FBeUJ6RCxLQUFLMEQsU0FBbEMsRUFBNkM7V0FDckNGLFlBQVlHLFVBQW5COzs7VUFHTUgsV0FBUDtHQVBEOzs7Ozs7WUFlVS9ELFNBQVYsQ0FBb0JtRSxXQUFwQixHQUFrQyxVQUFTN0YsYUFBVCxFQUF3QjtVQUV4REEsY0FBYzJFLE9BQWQsQ0FBc0J0QixXQUF0QixPQUF3QyxVQUF4QyxJQUNHSixXQUFXTixPQUFYLENBQW1CM0MsY0FBYzZCLElBQWpDLE1BQTJDLENBQUMsQ0FGaEQ7R0FERDs7Ozs7Ozs7WUFhVUgsU0FBVixDQUFvQkwsWUFBcEIsR0FBbUMsVUFBU2dCLEtBQVQsRUFBZ0I7T0FDOUNyQyxhQUFKLEVBQW1CNEQsS0FBbkI7OztPQUdJdkIsTUFBTXlELGFBQU4sQ0FBb0I5RSxNQUFwQixHQUE2QixDQUFqQyxFQUFvQztXQUM1QixJQUFQOzs7bUJBR2UsS0FBS3dFLCtCQUFMLENBQXFDbkQsTUFBTWMsTUFBM0MsQ0FBaEI7V0FDUWQsTUFBTXlELGFBQU4sQ0FBb0IsQ0FBcEIsQ0FBUjs7OztPQUlJOUYsY0FBYytGLGlCQUFsQixFQUFxQztXQUM3QixJQUFQOzs7T0FHR25ELFdBQUosRUFBaUI7Ozs7UUFJWjVDLGtCQUFrQjZELFNBQVNDLGFBQTNCLElBQTRDLEtBQUsrQixXQUFMLENBQWlCN0YsYUFBakIsQ0FBaEQsRUFBaUY7WUFDeEUsSUFBUDs7O1FBR0UsQ0FBQzhDLFlBQUwsRUFBbUI7Ozs7Ozs7Ozs7U0FVZGMsTUFBTW9DLFVBQU4sSUFBb0JwQyxNQUFNb0MsVUFBTixLQUFxQixLQUFLN0YsbUJBQWxELEVBQXVFO1lBQ2hFOEYsY0FBTjthQUNPLEtBQVA7OztVQUdJOUYsbUJBQUwsR0FBMkJ5RCxNQUFNb0MsVUFBakM7Ozs7Ozs7O1VBUUtqQixrQkFBTCxDQUF3Qi9FLGFBQXhCOzs7O1FBSUdGLGFBQUwsR0FBcUIsSUFBckI7UUFDS0Msa0JBQUwsR0FBMEJzQyxNQUFNNkQsU0FBaEM7UUFDS2xHLGFBQUwsR0FBcUJBLGFBQXJCOztRQUVLQyxXQUFMLEdBQW1CMkQsTUFBTXVDLEtBQXpCO1FBQ0tqRyxXQUFMLEdBQW1CMEQsTUFBTXdDLEtBQXpCOzs7T0FHSy9ELE1BQU02RCxTQUFOLEdBQWtCLEtBQUtHLGFBQXhCLEdBQXlDLEtBQUtoRyxRQUE5QyxJQUEyRGdDLE1BQU02RCxTQUFOLEdBQWtCLEtBQUtHLGFBQXhCLEdBQXlDLENBQUMsQ0FBeEcsRUFBMkc7VUFDcEdKLGNBQU47OztVQUdNLElBQVA7R0FoRUQ7Ozs7Ozs7O1lBMEVVdkUsU0FBVixDQUFvQjRFLGFBQXBCLEdBQW9DLFVBQVNqRSxLQUFULEVBQWdCO09BQy9DdUIsUUFBUXZCLE1BQU0yQixjQUFOLENBQXFCLENBQXJCLENBQVo7T0FBcUN1QyxXQUFXLEtBQUtuRyxhQUFyRDs7T0FFSW9HLEtBQUtDLEdBQUwsQ0FBUzdDLE1BQU11QyxLQUFOLEdBQWMsS0FBS2xHLFdBQTVCLElBQTJDc0csUUFBM0MsSUFBdURDLEtBQUtDLEdBQUwsQ0FBUzdDLE1BQU13QyxLQUFOLEdBQWMsS0FBS2xHLFdBQTVCLElBQTJDcUcsUUFBdEcsRUFBZ0g7V0FDeEcsSUFBUDs7O1VBR00sS0FBUDtHQVBEOzs7Ozs7OztZQWlCVTdFLFNBQVYsQ0FBb0JKLFdBQXBCLEdBQWtDLFVBQVNlLEtBQVQsRUFBZ0I7T0FDN0MsQ0FBQyxLQUFLdkMsYUFBVixFQUF5QjtXQUNqQixJQUFQOzs7O09BSUcsS0FBS0UsYUFBTCxLQUF1QixLQUFLd0YsK0JBQUwsQ0FBcUNuRCxNQUFNYyxNQUEzQyxDQUF2QixJQUE2RSxLQUFLbUQsYUFBTCxDQUFtQmpFLEtBQW5CLENBQWpGLEVBQTRHO1NBQ3RHdkMsYUFBTCxHQUFxQixLQUFyQjtTQUNLRSxhQUFMLEdBQXFCLElBQXJCOzs7VUFHTSxJQUFQO0dBWEQ7Ozs7Ozs7O1lBcUJVMEIsU0FBVixDQUFvQmdGLFdBQXBCLEdBQWtDLFVBQVNDLFlBQVQsRUFBdUI7OztPQUdwREEsYUFBYUMsT0FBYixLQUF5QkMsU0FBN0IsRUFBd0M7V0FDaENGLGFBQWFDLE9BQXBCOzs7O09BSUdELGFBQWFHLE9BQWpCLEVBQTBCO1dBQ2xCakQsU0FBU2tELGNBQVQsQ0FBd0JKLGFBQWFHLE9BQXJDLENBQVA7Ozs7O1VBS01ILGFBQWFLLGFBQWIsQ0FBMkIscUZBQTNCLENBQVA7R0FkRDs7Ozs7Ozs7WUF3QlV0RixTQUFWLENBQW9CSCxVQUFwQixHQUFpQyxVQUFTYyxLQUFULEVBQWdCO09BQzVDNEUsVUFBSjtPQUFnQmxILGtCQUFoQjtPQUFvQ21ILGFBQXBDO09BQW1EbEMsWUFBbkQ7T0FBaUVwQixLQUFqRTtPQUF3RTVELGdCQUFnQixLQUFLQSxhQUE3Rjs7T0FFSSxDQUFDLEtBQUtGLGFBQVYsRUFBeUI7V0FDakIsSUFBUDs7OztPQUlJdUMsTUFBTTZELFNBQU4sR0FBa0IsS0FBS0csYUFBeEIsR0FBeUMsS0FBS2hHLFFBQTlDLElBQTJEZ0MsTUFBTTZELFNBQU4sR0FBa0IsS0FBS0csYUFBeEIsR0FBeUMsQ0FBQyxDQUF4RyxFQUEyRztTQUNyR2MsZUFBTCxHQUF1QixJQUF2QjtXQUNPLElBQVA7OztPQUdJOUUsTUFBTTZELFNBQU4sR0FBa0IsS0FBS25HLGtCQUF4QixHQUE4QyxLQUFLTyxVQUF2RCxFQUFtRTtXQUMzRCxJQUFQOzs7O1FBSUk2RyxlQUFMLEdBQXVCLEtBQXZCOztRQUVLZCxhQUFMLEdBQXFCaEUsTUFBTTZELFNBQTNCOzt3QkFFcUIsS0FBS25HLGtCQUExQjtRQUNLRCxhQUFMLEdBQXFCLEtBQXJCO1FBQ0tDLGtCQUFMLEdBQTBCLENBQTFCOzs7Ozs7T0FNSWdELHdCQUFKLEVBQThCO1lBQ3JCVixNQUFNMkIsY0FBTixDQUFxQixDQUFyQixDQUFSOzs7b0JBR2dCSCxTQUFTdUQsZ0JBQVQsQ0FBMEJ4RCxNQUFNdUMsS0FBTixHQUFjL0IsT0FBT2lELFdBQS9DLEVBQTREekQsTUFBTXdDLEtBQU4sR0FBY2hDLE9BQU9rRCxXQUFqRixLQUFpR3RILGFBQWpIO2tCQUNja0YscUJBQWQsR0FBc0MsS0FBS2xGLGFBQUwsQ0FBbUJrRixxQkFBekQ7OzttQkFHZWxGLGNBQWMyRSxPQUFkLENBQXNCdEIsV0FBdEIsRUFBaEI7T0FDSTZELGtCQUFrQixPQUF0QixFQUErQjtpQkFDakIsS0FBS1IsV0FBTCxDQUFpQjFHLGFBQWpCLENBQWI7UUFDSWlILFVBQUosRUFBZ0I7VUFDVnJDLEtBQUwsQ0FBVzVFLGFBQVg7U0FDSWlCLGVBQUosRUFBcUI7YUFDYixLQUFQOzs7cUJBR2VnRyxVQUFoQjs7SUFSRixNQVVPLElBQUksS0FBS3pELFVBQUwsQ0FBZ0J4RCxhQUFoQixDQUFKLEVBQW9DOzs7O1FBSXJDcUMsTUFBTTZELFNBQU4sR0FBa0JuRyxrQkFBbkIsR0FBeUMsR0FBekMsSUFBaUQ2QyxlQUFld0IsT0FBT21ELEdBQVAsS0FBZW5ELE1BQTlCLElBQXdDOEMsa0JBQWtCLE9BQS9HLEVBQXlIO1VBQ25IbEgsYUFBTCxHQUFxQixJQUFyQjtZQUNPLEtBQVA7OztTQUdJNEUsS0FBTCxDQUFXNUUsYUFBWDtTQUNLMEQsU0FBTCxDQUFlMUQsYUFBZixFQUE4QnFDLEtBQTlCOzs7O1FBSUksQ0FBQ1MsWUFBRCxJQUFpQm9FLGtCQUFrQixRQUF2QyxFQUFpRDtVQUMzQ2xILGFBQUwsR0FBcUIsSUFBckI7V0FDTWlHLGNBQU47OztXQUdNLEtBQVA7OztPQUdHckQsZUFBZSxDQUFDRSxZQUFwQixFQUFrQzs7OzttQkFJbEI5QyxjQUFja0YscUJBQTdCO1FBQ0lGLGdCQUFnQkEsYUFBYU0sc0JBQWIsS0FBd0NOLGFBQWFPLFNBQXpFLEVBQW9GO1lBQzVFLElBQVA7Ozs7OztPQU1FLENBQUMsS0FBS3JDLFVBQUwsQ0FBZ0JsRCxhQUFoQixDQUFMLEVBQXFDO1VBQzlCaUcsY0FBTjtTQUNLdkMsU0FBTCxDQUFlMUQsYUFBZixFQUE4QnFDLEtBQTlCOzs7VUFHTSxLQUFQO0dBeEZEOzs7Ozs7O1lBaUdVWCxTQUFWLENBQW9CRixhQUFwQixHQUFvQyxZQUFXO1FBQ3pDMUIsYUFBTCxHQUFxQixLQUFyQjtRQUNLRSxhQUFMLEdBQXFCLElBQXJCO0dBRkQ7Ozs7Ozs7O1lBWVUwQixTQUFWLENBQW9CUCxPQUFwQixHQUE4QixVQUFTa0IsS0FBVCxFQUFnQjs7O09BR3pDLENBQUMsS0FBS3JDLGFBQVYsRUFBeUI7V0FDakIsSUFBUDs7O09BR0dxQyxNQUFNb0MsbUJBQVYsRUFBK0I7V0FDdkIsSUFBUDs7OztPQUlHLENBQUNwQyxNQUFNbUYsVUFBWCxFQUF1QjtXQUNmLElBQVA7Ozs7OztPQU1HLENBQUMsS0FBS3RFLFVBQUwsQ0FBZ0IsS0FBS2xELGFBQXJCLENBQUQsSUFBd0MsS0FBS21ILGVBQWpELEVBQWtFOzs7UUFHN0Q5RSxNQUFNVix3QkFBVixFQUFvQztXQUM3QkEsd0JBQU47S0FERCxNQUVPOzs7V0FHQVcsa0JBQU4sR0FBMkIsSUFBM0I7Ozs7VUFJS21GLGVBQU47VUFDTXhCLGNBQU47O1dBRU8sS0FBUDs7OztVQUlNLElBQVA7R0F0Q0Q7Ozs7Ozs7Ozs7WUFrRFV2RSxTQUFWLENBQW9CTixPQUFwQixHQUE4QixVQUFTaUIsS0FBVCxFQUFnQjtPQUN6Q3FGLFNBQUo7OztPQUdJLEtBQUs1SCxhQUFULEVBQXdCO1NBQ2xCRSxhQUFMLEdBQXFCLElBQXJCO1NBQ0tGLGFBQUwsR0FBcUIsS0FBckI7V0FDTyxJQUFQOzs7O09BSUd1QyxNQUFNYyxNQUFOLENBQWF0QixJQUFiLEtBQXNCLFFBQXRCLElBQWtDUSxNQUFNc0YsTUFBTixLQUFpQixDQUF2RCxFQUEwRDtXQUNsRCxJQUFQOzs7ZUFHVyxLQUFLeEcsT0FBTCxDQUFha0IsS0FBYixDQUFaOzs7T0FHSSxDQUFDcUYsU0FBTCxFQUFnQjtTQUNWMUgsYUFBTCxHQUFxQixJQUFyQjs7OztVQUlNMEgsU0FBUDtHQXZCRDs7Ozs7OztZQWdDVWhHLFNBQVYsQ0FBb0JrRyxPQUFwQixHQUE4QixZQUFXO09BQ3BDakksUUFBUSxLQUFLQSxLQUFqQjs7T0FFSXNCLGVBQUosRUFBcUI7VUFDZFcsbUJBQU4sQ0FBMEIsV0FBMUIsRUFBdUMsS0FBS1QsT0FBNUMsRUFBcUQsSUFBckQ7VUFDTVMsbUJBQU4sQ0FBMEIsV0FBMUIsRUFBdUMsS0FBS1QsT0FBNUMsRUFBcUQsSUFBckQ7VUFDTVMsbUJBQU4sQ0FBMEIsU0FBMUIsRUFBcUMsS0FBS1QsT0FBMUMsRUFBbUQsSUFBbkQ7OztTQUdLUyxtQkFBTixDQUEwQixPQUExQixFQUFtQyxLQUFLUixPQUF4QyxFQUFpRCxJQUFqRDtTQUNNUSxtQkFBTixDQUEwQixZQUExQixFQUF3QyxLQUFLUCxZQUE3QyxFQUEyRCxLQUEzRDtTQUNNTyxtQkFBTixDQUEwQixXQUExQixFQUF1QyxLQUFLTixXQUE1QyxFQUF5RCxLQUF6RDtTQUNNTSxtQkFBTixDQUEwQixVQUExQixFQUFzQyxLQUFLTCxVQUEzQyxFQUF1RCxLQUF2RDtTQUNNSyxtQkFBTixDQUEwQixhQUExQixFQUF5QyxLQUFLSixhQUE5QyxFQUE2RCxLQUE3RDtHQWJEOzs7Ozs7O1lBc0JVakIsU0FBVixHQUFzQixVQUFTWixLQUFULEVBQWdCO09BQ2pDa0ksWUFBSjtPQUNJQyxhQUFKO09BQ0lDLGlCQUFKO09BQ0lDLGNBQUo7OztPQUdJLE9BQU81RCxPQUFPNkQsWUFBZCxLQUErQixXQUFuQyxFQUFnRDtXQUN4QyxJQUFQOzs7O21CQUllLENBQUMsQ0FBQyxtQkFBbUJDLElBQW5CLENBQXdCekYsVUFBVUMsU0FBbEMsS0FBZ0QsR0FBRSxDQUFGLENBQWpELEVBQXVELENBQXZELENBQWpCOztPQUVJb0YsYUFBSixFQUFtQjs7UUFFZDdHLGVBQUosRUFBcUI7b0JBQ0w0QyxTQUFTbUQsYUFBVCxDQUF1QixxQkFBdkIsQ0FBZjs7U0FFSWEsWUFBSixFQUFrQjs7VUFFYkEsYUFBYU0sT0FBYixDQUFxQnhGLE9BQXJCLENBQTZCLGtCQUE3QixNQUFxRCxDQUFDLENBQTFELEVBQTZEO2NBQ3JELElBQVA7OztVQUdHbUYsZ0JBQWdCLEVBQWhCLElBQXNCakUsU0FBU3VFLGVBQVQsQ0FBeUJDLFdBQXpCLElBQXdDakUsT0FBT2tFLFVBQXpFLEVBQXFGO2NBQzdFLElBQVA7Ozs7O0tBVkgsTUFlTztZQUNDLElBQVA7Ozs7T0FJRXRGLG9CQUFKLEVBQTBCO3dCQUNMUCxVQUFVQyxTQUFWLENBQW9CNkYsS0FBcEIsQ0FBMEIsNkJBQTFCLENBQXBCOzs7O1FBSUlSLGtCQUFrQixDQUFsQixLQUF3QixFQUF4QixJQUE4QkEsa0JBQWtCLENBQWxCLEtBQXdCLENBQTFELEVBQTZEO29CQUM3Q2xFLFNBQVNtRCxhQUFULENBQXVCLHFCQUF2QixDQUFmOztTQUVJYSxZQUFKLEVBQWtCOztVQUViQSxhQUFhTSxPQUFiLENBQXFCeEYsT0FBckIsQ0FBNkIsa0JBQTdCLE1BQXFELENBQUMsQ0FBMUQsRUFBNkQ7Y0FDckQsSUFBUDs7O1VBR0drQixTQUFTdUUsZUFBVCxDQUF5QkMsV0FBekIsSUFBd0NqRSxPQUFPa0UsVUFBbkQsRUFBK0Q7Y0FDdkQsSUFBUDs7Ozs7OztPQU9BM0ksTUFBTTZJLEtBQU4sQ0FBWUMsYUFBWixLQUE4QixNQUE5QixJQUF3QzlJLE1BQU02SSxLQUFOLENBQVlFLFdBQVosS0FBNEIsY0FBeEUsRUFBd0Y7V0FDaEYsSUFBUDs7OztvQkFJZ0IsQ0FBQyxDQUFDLG9CQUFvQlIsSUFBcEIsQ0FBeUJ6RixVQUFVQyxTQUFuQyxLQUFpRCxHQUFFLENBQUYsQ0FBbEQsRUFBd0QsQ0FBeEQsQ0FBbEI7O09BRUlzRixrQkFBa0IsRUFBdEIsRUFBMEI7OzttQkFHVm5FLFNBQVNtRCxhQUFULENBQXVCLHFCQUF2QixDQUFmO1FBQ0lhLGlCQUFpQkEsYUFBYU0sT0FBYixDQUFxQnhGLE9BQXJCLENBQTZCLGtCQUE3QixNQUFxRCxDQUFDLENBQXRELElBQTJEa0IsU0FBU3VFLGVBQVQsQ0FBeUJDLFdBQXpCLElBQXdDakUsT0FBT2tFLFVBQTNILENBQUosRUFBNEk7WUFDcEksSUFBUDs7Ozs7O09BTUUzSSxNQUFNNkksS0FBTixDQUFZRSxXQUFaLEtBQTRCLE1BQTVCLElBQXNDL0ksTUFBTTZJLEtBQU4sQ0FBWUUsV0FBWixLQUE0QixjQUF0RSxFQUFzRjtXQUM5RSxJQUFQOzs7VUFHTSxLQUFQO0dBaEZEOzs7Ozs7OztZQTBGVUMsTUFBVixHQUFtQixVQUFTaEosS0FBVCxFQUFnQkMsT0FBaEIsRUFBeUI7VUFDcEMsSUFBSUYsU0FBSixDQUFjQyxLQUFkLEVBQXFCQyxPQUFyQixDQUFQO0dBREQ7O01BS0ksT0FBT2dKLFNBQVAsS0FBa0IsVUFBbEIsSUFBZ0NDLFFBQU9ELFVBQU9FLEdBQWQsTUFBc0IsUUFBdEQsSUFBa0VGLFVBQU9FLEdBQTdFLEVBQWtGOzs7YUFHMUUsWUFBVztXQUNWcEosU0FBUDtJQUREa0o7R0FIRCxNQU1PLElBQUksYUFBa0IsV0FBbEIsSUFBaUNHLE9BQU9DLE9BQTVDLEVBQXFEO2lCQUMzRCxHQUFpQnRKLFVBQVVpSixNQUEzQjtpQkFDQSxVQUFBLEdBQTJCakosU0FBM0I7R0FGTSxNQUdBO1VBQ0NBLFNBQVAsR0FBbUJBLFNBQW5COztFQTkxQkEsR0FBRDs7Ozs7QUNBRDtBQUNBLElBQUkwRSxPQUFPNkUsY0FBWCxFQUEyQjs7V0FDaEJBLGNBQVAsQ0FBc0JDLGFBQXRCLEdBQXNDLElBQXRDOzs7OztNQ0RBQyxTQUFTSixjQUFBLEdBQWlCLE9BQU8zRSxNQUFQLElBQWlCLFdBQWpCLElBQWdDQSxPQUFPb0MsSUFBUCxJQUFlQSxJQUEvQyxHQUMxQnBDLE1BRDBCLEdBQ2pCLE9BQU9nRixJQUFQLElBQWUsV0FBZixJQUE4QkEsS0FBSzVDLElBQUwsSUFBYUEsSUFBM0MsR0FBa0Q0Qzs7SUFFM0RDLFNBQVMsYUFBVCxHQUhKO01BSUksT0FBT0MsR0FBUCxJQUFjLFFBQWxCLEVBQTRCQSxNQUFNSCxNQUFOOzs7O01DTHhCSSxPQUFPUixjQUFBLEdBQWlCLEVBQUVTLFNBQVMsT0FBWCxFQUE1QjtNQUNJLE9BQU9DLEdBQVAsSUFBYyxRQUFsQixFQUE0QkEsTUFBTUYsSUFBTjs7Ozs7QUNENUIsZ0JBQWlCLGtCQUFBLENBQVVHLEVBQVYsRUFBYztTQUN0QixRQUFPQSxFQUFQLHlDQUFPQSxFQUFQLE9BQWMsUUFBZCxHQUF5QkEsT0FBTyxJQUFoQyxHQUF1QyxPQUFPQSxFQUFQLEtBQWMsVUFBNUQ7Q0FERjs7QUNDQSxnQkFBaUIsa0JBQUEsQ0FBVUEsRUFBVixFQUFjO01BQ3pCLENBQUNDLFVBQVNELEVBQVQsQ0FBTCxFQUFtQixNQUFNRSxVQUFVRixLQUFLLG9CQUFmLENBQU47U0FDWkEsRUFBUDtDQUZGOztBQ0RBLGFBQWlCLGVBQUEsQ0FBVXhCLElBQVYsRUFBZ0I7TUFDM0I7V0FDSyxDQUFDLENBQUNBLE1BQVQ7R0FERixDQUVFLE9BQU8yQixDQUFQLEVBQVU7V0FDSCxJQUFQOztDQUpKOztBQ0FBO0FBQ0EsbUJBQWlCLENBQUNDLE9BQW9CLFlBQVk7U0FDekNDLE9BQU9DLGNBQVAsQ0FBc0IsRUFBdEIsRUFBMEIsR0FBMUIsRUFBK0IsRUFBRUMsS0FBSyxlQUFZO2FBQVMsQ0FBUDtLQUFyQixFQUEvQixFQUFtRUMsQ0FBbkUsSUFBd0UsQ0FBL0U7Q0FEZ0IsQ0FBbEI7O0FDQUEsSUFBSXJHLGFBQVdpRyxRQUFxQmpHLFFBQXBDOztBQUVBLElBQUlzRyxLQUFLUixVQUFTOUYsVUFBVCxLQUFzQjhGLFVBQVM5RixXQUFTdUcsYUFBbEIsQ0FBL0I7QUFDQSxpQkFBaUIsbUJBQUEsQ0FBVVYsRUFBVixFQUFjO1NBQ3RCUyxLQUFLdEcsV0FBU3VHLGFBQVQsQ0FBdUJWLEVBQXZCLENBQUwsR0FBa0MsRUFBekM7Q0FERjs7QUNKQSxvQkFBaUIsQ0FBQ0ksWUFBRCxJQUE4QixDQUFDTyxPQUFvQixZQUFZO1NBQ3ZFTixPQUFPQyxjQUFQLENBQXNCTSxXQUF5QixLQUF6QixDQUF0QixFQUF1RCxHQUF2RCxFQUE0RCxFQUFFTCxLQUFLLGVBQVk7YUFBUyxDQUFQO0tBQXJCLEVBQTVELEVBQWdHQyxDQUFoRyxJQUFxRyxDQUE1RztDQUQ4QyxDQUFoRDs7QUNBQTs7OztBQUlBLG1CQUFpQixxQkFBQSxDQUFVUixFQUFWLEVBQWNhLENBQWQsRUFBaUI7TUFDNUIsQ0FBQ1osVUFBU0QsRUFBVCxDQUFMLEVBQW1CLE9BQU9BLEVBQVA7TUFDZmMsRUFBSixFQUFRQyxHQUFSO01BQ0lGLEtBQUssUUFBUUMsS0FBS2QsR0FBR2dCLFFBQWhCLEtBQTZCLFVBQWxDLElBQWdELENBQUNmLFVBQVNjLE1BQU1ELEdBQUd0SSxJQUFILENBQVF3SCxFQUFSLENBQWYsQ0FBckQsRUFBa0YsT0FBT2UsR0FBUDtNQUM5RSxRQUFRRCxLQUFLZCxHQUFHaUIsT0FBaEIsS0FBNEIsVUFBNUIsSUFBMEMsQ0FBQ2hCLFVBQVNjLE1BQU1ELEdBQUd0SSxJQUFILENBQVF3SCxFQUFSLENBQWYsQ0FBL0MsRUFBNEUsT0FBT2UsR0FBUDtNQUN4RSxDQUFDRixDQUFELElBQU0sUUFBUUMsS0FBS2QsR0FBR2dCLFFBQWhCLEtBQTZCLFVBQW5DLElBQWlELENBQUNmLFVBQVNjLE1BQU1ELEdBQUd0SSxJQUFILENBQVF3SCxFQUFSLENBQWYsQ0FBdEQsRUFBbUYsT0FBT2UsR0FBUDtRQUM3RWIsVUFBVSx5Q0FBVixDQUFOO0NBTkY7O0FDREEsSUFBSWdCLEtBQUtiLE9BQU9DLGNBQWhCOztBQUVBLFFBQVlGLGVBQTRCQyxPQUFPQyxjQUFuQyxHQUFvRCxTQUFTQSxjQUFULENBQXdCYSxDQUF4QixFQUEyQkMsQ0FBM0IsRUFBOEJDLFVBQTlCLEVBQTBDO1lBQy9GRixDQUFUO01BQ0lHLGFBQVlGLENBQVosRUFBZSxJQUFmLENBQUo7WUFDU0MsVUFBVDtNQUNJRSxhQUFKLEVBQW9CLElBQUk7V0FDZkwsR0FBR0MsQ0FBSCxFQUFNQyxDQUFOLEVBQVNDLFVBQVQsQ0FBUDtHQURrQixDQUVsQixPQUFPbEIsQ0FBUCxFQUFVO01BQ1IsU0FBU2tCLFVBQVQsSUFBdUIsU0FBU0EsVUFBcEMsRUFBZ0QsTUFBTW5CLFVBQVUsMEJBQVYsQ0FBTjtNQUM1QyxXQUFXbUIsVUFBZixFQUEyQkYsRUFBRUMsQ0FBRixJQUFPQyxXQUFXakcsS0FBbEI7U0FDcEIrRixDQUFQO0NBVEY7Ozs7OztBQ0xBLG9CQUFpQixzQkFBQSxDQUFVSyxNQUFWLEVBQWtCcEcsS0FBbEIsRUFBeUI7U0FDakM7Z0JBQ08sRUFBRW9HLFNBQVMsQ0FBWCxDQURQO2tCQUVTLEVBQUVBLFNBQVMsQ0FBWCxDQUZUO2NBR0ssRUFBRUEsU0FBUyxDQUFYLENBSEw7V0FJRXBHO0dBSlQ7Q0FERjs7QUNFQSxZQUFpQmdGLGVBQTRCLFVBQVVxQixNQUFWLEVBQWtCQyxHQUFsQixFQUF1QnRHLEtBQXZCLEVBQThCO1NBQ2xFOEYsVUFBR1MsQ0FBSCxDQUFLRixNQUFMLEVBQWFDLEdBQWIsRUFBa0JFLGNBQVcsQ0FBWCxFQUFjeEcsS0FBZCxDQUFsQixDQUFQO0NBRGUsR0FFYixVQUFVcUcsTUFBVixFQUFrQkMsR0FBbEIsRUFBdUJ0RyxLQUF2QixFQUE4QjtTQUN6QnNHLEdBQVAsSUFBY3RHLEtBQWQ7U0FDT3FHLE1BQVA7Q0FKRjs7QUNGQSxJQUFJSSxpQkFBaUIsR0FBR0EsY0FBeEI7QUFDQSxXQUFpQixhQUFBLENBQVU3QixFQUFWLEVBQWMwQixHQUFkLEVBQW1CO1NBQzNCRyxlQUFlckosSUFBZixDQUFvQndILEVBQXBCLEVBQXdCMEIsR0FBeEIsQ0FBUDtDQURGOztBQ0RBLElBQUlJLEtBQUssQ0FBVDtBQUNBLElBQUlDLEtBQUtqRixLQUFLa0YsTUFBTCxFQUFUO0FBQ0EsV0FBaUIsYUFBQSxDQUFVTixHQUFWLEVBQWU7U0FDdkIsVUFBVU8sTUFBVixDQUFpQlAsUUFBUXZFLFNBQVIsR0FBb0IsRUFBcEIsR0FBeUJ1RSxHQUExQyxFQUErQyxJQUEvQyxFQUFxRCxDQUFDLEVBQUVJLEVBQUYsR0FBT0MsRUFBUixFQUFZZixRQUFaLENBQXFCLEVBQXJCLENBQXJELENBQVA7Q0FERjs7O01DQ0lrQixNQUFNOUIsS0FBa0IsS0FBbEIsQ0FBVjtNQUNJK0IsWUFBWSxVQUFoQjtNQUNJQyxZQUFZekMsU0FBU3dDLFNBQVQsQ0FBaEI7TUFDSUUsTUFBTSxDQUFDLEtBQUtELFNBQU4sRUFBaUJFLEtBQWpCLENBQXVCSCxTQUF2QixDQUFWOztRQUVtQkksYUFBbkIsR0FBbUMsVUFBVXZDLEVBQVYsRUFBYztXQUN4Q29DLFVBQVU1SixJQUFWLENBQWV3SCxFQUFmLENBQVA7R0FERjs7R0FJQ1gsY0FBQSxHQUFpQixVQUFVOEIsQ0FBVixFQUFhTyxHQUFiLEVBQWtCWCxHQUFsQixFQUF1QnlCLElBQXZCLEVBQTZCO1FBQ3pDQyxhQUFhLE9BQU8xQixHQUFQLElBQWMsVUFBL0I7UUFDSTBCLFVBQUosRUFBZ0JDLEtBQUkzQixHQUFKLEVBQVMsTUFBVCxLQUFvQjRCLE1BQUs1QixHQUFMLEVBQVUsTUFBVixFQUFrQlcsR0FBbEIsQ0FBcEI7UUFDWlAsRUFBRU8sR0FBRixNQUFXWCxHQUFmLEVBQW9CO1FBQ2hCMEIsVUFBSixFQUFnQkMsS0FBSTNCLEdBQUosRUFBU21CLEdBQVQsS0FBaUJTLE1BQUs1QixHQUFMLEVBQVVtQixHQUFWLEVBQWVmLEVBQUVPLEdBQUYsSUFBUyxLQUFLUCxFQUFFTyxHQUFGLENBQWQsR0FBdUJXLElBQUlPLElBQUosQ0FBU0MsT0FBT25CLEdBQVAsQ0FBVCxDQUF0QyxDQUFqQjtRQUNaUCxNQUFNMUIsT0FBVixFQUFrQjtRQUNkaUMsR0FBRixJQUFTWCxHQUFUO0tBREYsTUFFTyxJQUFJLENBQUN5QixJQUFMLEVBQVc7YUFDVHJCLEVBQUVPLEdBQUYsQ0FBUDtZQUNLUCxDQUFMLEVBQVFPLEdBQVIsRUFBYVgsR0FBYjtLQUZLLE1BR0EsSUFBSUksRUFBRU8sR0FBRixDQUFKLEVBQVk7UUFDZkEsR0FBRixJQUFTWCxHQUFUO0tBREssTUFFQTtZQUNBSSxDQUFMLEVBQVFPLEdBQVIsRUFBYVgsR0FBYjs7O0dBYkosRUFnQkdwQixTQUFTM0gsU0FoQlosRUFnQnVCbUssU0FoQnZCLEVBZ0JrQyxTQUFTbkIsUUFBVCxHQUFvQjtXQUM3QyxPQUFPLElBQVAsSUFBZSxVQUFmLElBQTZCLEtBQUtrQixHQUFMLENBQTdCLElBQTBDRSxVQUFVNUosSUFBVixDQUFlLElBQWYsQ0FBakQ7R0FqQkY7OztBQ1pBLGlCQUFpQixtQkFBQSxDQUFVd0gsRUFBVixFQUFjO01BQ3pCLE9BQU9BLEVBQVAsSUFBYSxVQUFqQixFQUE2QixNQUFNRSxVQUFVRixLQUFLLHFCQUFmLENBQU47U0FDdEJBLEVBQVA7Q0FGRjs7QUNBQTs7QUFFQSxXQUFpQixhQUFBLENBQVVjLEVBQVYsRUFBY2dDLElBQWQsRUFBb0J4TCxNQUFwQixFQUE0QjthQUNqQ3dKLEVBQVY7TUFDSWdDLFNBQVMzRixTQUFiLEVBQXdCLE9BQU8yRCxFQUFQO1VBQ2hCeEosTUFBUjtTQUNPLENBQUw7YUFBZSxVQUFVa0osQ0FBVixFQUFhO2VBQ25CTSxHQUFHdEksSUFBSCxDQUFRc0ssSUFBUixFQUFjdEMsQ0FBZCxDQUFQO09BRE07U0FHSCxDQUFMO2FBQWUsVUFBVUEsQ0FBVixFQUFhdUMsQ0FBYixFQUFnQjtlQUN0QmpDLEdBQUd0SSxJQUFILENBQVFzSyxJQUFSLEVBQWN0QyxDQUFkLEVBQWlCdUMsQ0FBakIsQ0FBUDtPQURNO1NBR0gsQ0FBTDthQUFlLFVBQVV2QyxDQUFWLEVBQWF1QyxDQUFiLEVBQWdCQyxDQUFoQixFQUFtQjtlQUN6QmxDLEdBQUd0SSxJQUFILENBQVFzSyxJQUFSLEVBQWN0QyxDQUFkLEVBQWlCdUMsQ0FBakIsRUFBb0JDLENBQXBCLENBQVA7T0FETTs7U0FJSCx5QkFBeUI7V0FDdkJsQyxHQUFHN0osS0FBSCxDQUFTNkwsSUFBVCxFQUFlNUwsU0FBZixDQUFQO0dBREY7Q0FkRjs7QUNHQSxJQUFJK0wsWUFBWSxXQUFoQjs7QUFFQSxJQUFJQyxVQUFVLFNBQVZBLE9BQVUsQ0FBVS9LLElBQVYsRUFBZ0JnTCxJQUFoQixFQUFzQkMsTUFBdEIsRUFBOEI7TUFDdENDLFlBQVlsTCxPQUFPK0ssUUFBUUksQ0FBL0I7TUFDSUMsWUFBWXBMLE9BQU8rSyxRQUFRTSxDQUEvQjtNQUNJQyxZQUFZdEwsT0FBTytLLFFBQVFyQyxDQUEvQjtNQUNJNkMsV0FBV3ZMLE9BQU8rSyxRQUFROUIsQ0FBOUI7TUFDSXVDLFVBQVV4TCxPQUFPK0ssUUFBUVUsQ0FBN0I7TUFDSW5LLFNBQVM4SixZQUFZOUQsT0FBWixHQUFxQmdFLFlBQVloRSxRQUFPMEQsSUFBUCxNQUFpQjFELFFBQU8wRCxJQUFQLElBQWUsRUFBaEMsQ0FBWixHQUFrRCxDQUFDMUQsUUFBTzBELElBQVAsS0FBZ0IsRUFBakIsRUFBcUJGLFNBQXJCLENBQXBGO01BQ0kzRCxVQUFVaUUsWUFBWTFELEtBQVosR0FBbUJBLE1BQUtzRCxJQUFMLE1BQWV0RCxNQUFLc0QsSUFBTCxJQUFhLEVBQTVCLENBQWpDO01BQ0lVLFdBQVd2RSxRQUFRMkQsU0FBUixNQUF1QjNELFFBQVEyRCxTQUFSLElBQXFCLEVBQTVDLENBQWY7TUFDSXZCLEdBQUosRUFBU29DLEdBQVQsRUFBY0MsR0FBZCxFQUFtQkMsR0FBbkI7TUFDSVQsU0FBSixFQUFlSCxTQUFTRCxJQUFUO09BQ1Z6QixHQUFMLElBQVkwQixNQUFaLEVBQW9COztVQUVaLENBQUNDLFNBQUQsSUFBYzVKLE1BQWQsSUFBd0JBLE9BQU9pSSxHQUFQLE1BQWdCdkUsU0FBOUM7O1VBRU0sQ0FBQzJHLE1BQU1ySyxNQUFOLEdBQWUySixNQUFoQixFQUF3QjFCLEdBQXhCLENBQU47O1VBRU1pQyxXQUFXRyxHQUFYLEdBQWlCRyxLQUFJRixHQUFKLEVBQVN0RSxPQUFULENBQWpCLEdBQW9DaUUsWUFBWSxPQUFPSyxHQUFQLElBQWMsVUFBMUIsR0FBdUNFLEtBQUl0RSxTQUFTbkgsSUFBYixFQUFtQnVMLEdBQW5CLENBQXZDLEdBQWlFQSxHQUEzRzs7UUFFSXRLLE1BQUosRUFBWXlLLFVBQVN6SyxNQUFULEVBQWlCaUksR0FBakIsRUFBc0JxQyxHQUF0QixFQUEyQjVMLE9BQU8rSyxRQUFRaUIsQ0FBMUM7O1FBRVI3RSxRQUFRb0MsR0FBUixLQUFnQnFDLEdBQXBCLEVBQXlCcEIsTUFBS3JELE9BQUwsRUFBY29DLEdBQWQsRUFBbUJzQyxHQUFuQjtRQUNyQk4sWUFBWUcsU0FBU25DLEdBQVQsS0FBaUJxQyxHQUFqQyxFQUFzQ0YsU0FBU25DLEdBQVQsSUFBZ0JxQyxHQUFoQjs7Q0F0QjFDO0FBeUJBdEUsUUFBT0ksSUFBUCxHQUFjQSxLQUFkOztBQUVBcUQsUUFBUUksQ0FBUixHQUFZLENBQVo7QUFDQUosUUFBUU0sQ0FBUixHQUFZLENBQVo7QUFDQU4sUUFBUXJDLENBQVIsR0FBWSxDQUFaO0FBQ0FxQyxRQUFROUIsQ0FBUixHQUFZLENBQVo7QUFDQThCLFFBQVFVLENBQVIsR0FBWSxFQUFaO0FBQ0FWLFFBQVFrQixDQUFSLEdBQVksRUFBWjtBQUNBbEIsUUFBUWlCLENBQVIsR0FBWSxFQUFaO0FBQ0FqQixRQUFRbUIsQ0FBUixHQUFZLEdBQVo7QUFDQSxjQUFpQm5CLE9BQWpCOztBQzFDQSxVQUFZLEdBQUdvQixvQkFBZjs7Ozs7O0FDQUEsSUFBSXRELFdBQVcsR0FBR0EsUUFBbEI7O0FBRUEsV0FBaUIsYUFBQSxDQUFVaEIsRUFBVixFQUFjO1NBQ3RCZ0IsU0FBU3hJLElBQVQsQ0FBY3dILEVBQWQsRUFBa0J1RSxLQUFsQixDQUF3QixDQUF4QixFQUEyQixDQUFDLENBQTVCLENBQVA7Q0FERjs7QUNGQTs7O0FBR0EsZUFBaUJsRSxPQUFPLEdBQVAsRUFBWWlFLG9CQUFaLENBQWlDLENBQWpDLElBQXNDakUsTUFBdEMsR0FBK0MsVUFBVUwsRUFBVixFQUFjO1NBQ3JFd0UsS0FBSXhFLEVBQUosS0FBVyxRQUFYLEdBQXNCQSxHQUFHc0MsS0FBSCxDQUFTLEVBQVQsQ0FBdEIsR0FBcUNqQyxPQUFPTCxFQUFQLENBQTVDO0NBREY7O0FDSEE7QUFDQSxlQUFpQixpQkFBQSxDQUFVQSxFQUFWLEVBQWM7TUFDekJBLE1BQU03QyxTQUFWLEVBQXFCLE1BQU0rQyxVQUFVLDJCQUEyQkYsRUFBckMsQ0FBTjtTQUNkQSxFQUFQO0NBRkY7O0FDREE7OztBQUdBLGlCQUFpQixtQkFBQSxDQUFVQSxFQUFWLEVBQWM7U0FDdEJ5RSxTQUFRQyxTQUFRMUUsRUFBUixDQUFSLENBQVA7Q0FERjs7QUNHQSxJQUFJMkUsT0FBT3RFLE9BQU91RSx3QkFBbEI7O0FBRUEsVUFBWXhFLGVBQTRCdUUsSUFBNUIsR0FBbUMsU0FBU0Msd0JBQVQsQ0FBa0N6RCxDQUFsQyxFQUFxQ0MsQ0FBckMsRUFBd0M7TUFDakZ5RCxXQUFVMUQsQ0FBVixDQUFKO01BQ0lHLGFBQVlGLENBQVosRUFBZSxJQUFmLENBQUo7TUFDSUcsYUFBSixFQUFvQixJQUFJO1dBQ2ZvRCxLQUFLeEQsQ0FBTCxFQUFRQyxDQUFSLENBQVA7R0FEa0IsQ0FFbEIsT0FBT2pCLENBQVAsRUFBVTtNQUNSdUMsS0FBSXZCLENBQUosRUFBT0MsQ0FBUCxDQUFKLEVBQWUsT0FBT1EsY0FBVyxDQUFDa0QsV0FBSW5ELENBQUosQ0FBTW5KLElBQU4sQ0FBVzJJLENBQVgsRUFBY0MsQ0FBZCxDQUFaLEVBQThCRCxFQUFFQyxDQUFGLENBQTlCLENBQVA7Q0FOakI7Ozs7OztBQ1JBOzs7QUFJQSxJQUFJMkQsUUFBUSxTQUFSQSxLQUFRLENBQVU1RCxDQUFWLEVBQWE2RCxLQUFiLEVBQW9CO1lBQ3JCN0QsQ0FBVDtNQUNJLENBQUNsQixVQUFTK0UsS0FBVCxDQUFELElBQW9CQSxVQUFVLElBQWxDLEVBQXdDLE1BQU05RSxVQUFVOEUsUUFBUSwyQkFBbEIsQ0FBTjtDQUYxQztBQUlBLGdCQUFpQjtPQUNWM0UsT0FBTzRFLGNBQVAsS0FBMEIsZUFBZSxFQUFmO1lBQ25COUwsSUFBVixFQUFnQitMLEtBQWhCLEVBQXVCQyxHQUF2QixFQUE0QjtRQUN0QjtZQUNJL0UsS0FBa0JULFNBQVNuSCxJQUEzQixFQUFpQ21JLFlBQTBCZ0IsQ0FBMUIsQ0FBNEJ0QixPQUFPckksU0FBbkMsRUFBOEMsV0FBOUMsRUFBMkRtTixHQUE1RixFQUFpRyxDQUFqRyxDQUFOO1VBQ0loTSxJQUFKLEVBQVUsRUFBVjtjQUNRLEVBQUVBLGdCQUFnQmlNLEtBQWxCLENBQVI7S0FIRixDQUlFLE9BQU9qRixDQUFQLEVBQVU7Y0FBVSxJQUFSOztXQUNQLFNBQVM4RSxjQUFULENBQXdCOUQsQ0FBeEIsRUFBMkI2RCxLQUEzQixFQUFrQztZQUNqQzdELENBQU4sRUFBUzZELEtBQVQ7VUFDSUUsS0FBSixFQUFXL0QsRUFBRWtFLFNBQUYsR0FBY0wsS0FBZCxDQUFYLEtBQ0tHLElBQUloRSxDQUFKLEVBQU82RCxLQUFQO2FBQ0U3RCxDQUFQO0tBSkY7R0FORixDQVlFLEVBWkYsRUFZTSxLQVpOLENBRDZCLEdBYWRoRSxTQWJaLENBRFU7U0FlUjRIO0NBZlQ7O0FDUkE7O0FBRUE3QixRQUFRQSxRQUFRckMsQ0FBaEIsRUFBbUIsUUFBbkIsRUFBNkIsRUFBRW9FLGdCQUFnQjdFLFVBQXdCK0UsR0FBMUMsRUFBN0I7O0FDREEscUJBQWlCeEUsTUFBK0JOLE1BQS9CLENBQXNDNEUsY0FBdkQ7O0FDREEsZUFBaUIsS0FBakI7OztNQ0VJSyxTQUFTLG9CQUFiO01BQ0lDLFFBQVE5RixRQUFPNkYsTUFBUCxNQUFtQjdGLFFBQU82RixNQUFQLElBQWlCLEVBQXBDLENBQVo7O0dBRUNqRyxjQUFBLEdBQWlCLFVBQVVxQyxHQUFWLEVBQWV0RyxLQUFmLEVBQXNCO1dBQy9CbUssTUFBTTdELEdBQU4sTUFBZTZELE1BQU03RCxHQUFOLElBQWF0RyxVQUFVK0IsU0FBVixHQUFzQi9CLEtBQXRCLEdBQThCLEVBQTFELENBQVA7R0FERixFQUVHLFVBRkgsRUFFZSxFQUZmLEVBRW1Cb0ssSUFGbkIsQ0FFd0I7YUFDYjNGLE1BQUtDLE9BRFE7VUFFaEJNLFdBQXdCLE1BQXhCLEdBQWlDLFFBRmpCO2VBR1g7R0FMYjs7OztNQ0xJbUYsUUFBUW5GLFFBQXFCLEtBQXJCLENBQVo7O01BRUlxRixVQUFTOUUsUUFBcUI4RSxNQUFsQztNQUNJQyxhQUFhLE9BQU9ELE9BQVAsSUFBaUIsVUFBbEM7O01BRUlFLFdBQVd0RyxjQUFBLEdBQWlCLFVBQVU4RCxJQUFWLEVBQWdCO1dBQ3ZDb0MsTUFBTXBDLElBQU4sTUFBZ0JvQyxNQUFNcEMsSUFBTixJQUNyQnVDLGNBQWNELFFBQU90QyxJQUFQLENBQWQsSUFBOEIsQ0FBQ3VDLGFBQWFELE9BQWIsR0FBc0JHLElBQXZCLEVBQTRCLFlBQVl6QyxJQUF4QyxDQUR6QixDQUFQO0dBREY7O1dBS1NvQyxLQUFULEdBQWlCQSxLQUFqQjs7O0FDVkE7O0FBRUEsSUFBSU0sTUFBTXpGLEtBQWtCLGFBQWxCLENBQVY7O0FBRUEsSUFBSTBGLE1BQU10QixLQUFJLFlBQVk7U0FBU3ROLFNBQVA7Q0FBZCxFQUFKLEtBQTRDLFdBQXREOzs7QUFHQSxJQUFJNk8sU0FBUyxTQUFUQSxNQUFTLENBQVUvRixFQUFWLEVBQWMwQixHQUFkLEVBQW1CO01BQzFCO1dBQ0sxQixHQUFHMEIsR0FBSCxDQUFQO0dBREYsQ0FFRSxPQUFPdkIsQ0FBUCxFQUFVO0NBSGQ7O0FBTUEsZUFBaUIsaUJBQUEsQ0FBVUgsRUFBVixFQUFjO01BQ3pCbUIsQ0FBSixFQUFPNkUsQ0FBUCxFQUFVcEMsQ0FBVjtTQUNPNUQsT0FBTzdDLFNBQVAsR0FBbUIsV0FBbkIsR0FBaUM2QyxPQUFPLElBQVAsR0FBYzs7SUFFbEQsUUFBUWdHLElBQUlELE9BQU81RSxJQUFJZCxPQUFPTCxFQUFQLENBQVgsRUFBdUI2RixHQUF2QixDQUFaLEtBQTRDLFFBQTVDLEdBQXVERzs7SUFFdkRGLE1BQU10QixLQUFJckQsQ0FBSjs7SUFFTixDQUFDeUMsSUFBSVksS0FBSXJELENBQUosQ0FBTCxLQUFnQixRQUFoQixJQUE0QixPQUFPQSxFQUFFOEUsTUFBVCxJQUFtQixVQUEvQyxHQUE0RCxXQUE1RCxHQUEwRXJDLENBTjlFO0NBRkY7Ozs7QUNWQSxJQUFJekssT0FBTyxFQUFYO0FBQ0FBLEtBQUtpSCxLQUFrQixhQUFsQixDQUFMLElBQXlDLEdBQXpDO0FBQ0EsSUFBSWpILE9BQU8sRUFBUCxJQUFhLFlBQWpCLEVBQStCO1lBQ05rSCxPQUFPckksU0FBOUIsRUFBeUMsVUFBekMsRUFBcUQsU0FBU2dKLFFBQVQsR0FBb0I7V0FDaEUsYUFBYWtGLFNBQVEsSUFBUixDQUFiLEdBQTZCLEdBQXBDO0dBREYsRUFFRyxJQUZIOzs7QUNORjtBQUNBLElBQUlDLE9BQU9ySixLQUFLcUosSUFBaEI7QUFDQSxJQUFJQyxRQUFRdEosS0FBS3NKLEtBQWpCO0FBQ0EsaUJBQWlCLG1CQUFBLENBQVVwRyxFQUFWLEVBQWM7U0FDdEJxRyxNQUFNckcsS0FBSyxDQUFDQSxFQUFaLElBQWtCLENBQWxCLEdBQXNCLENBQUNBLEtBQUssQ0FBTCxHQUFTb0csS0FBVCxHQUFpQkQsSUFBbEIsRUFBd0JuRyxFQUF4QixDQUE3QjtDQURGOztBQ0RBOztBQUVBLGdCQUFpQixrQkFBQSxDQUFVbUMsU0FBVixFQUFxQjtTQUM3QixVQUFVVyxJQUFWLEVBQWdCd0QsR0FBaEIsRUFBcUI7UUFDdEJDLElBQUkxRCxPQUFPNkIsU0FBUTVCLElBQVIsQ0FBUCxDQUFSO1FBQ0kxTCxJQUFJb1AsV0FBVUYsR0FBVixDQUFSO1FBQ0lqUCxJQUFJa1AsRUFBRWpQLE1BQVY7UUFDSWtKLENBQUosRUFBT3VDLENBQVA7UUFDSTNMLElBQUksQ0FBSixJQUFTQSxLQUFLQyxDQUFsQixFQUFxQixPQUFPOEssWUFBWSxFQUFaLEdBQWlCaEYsU0FBeEI7UUFDakJvSixFQUFFRSxVQUFGLENBQWFyUCxDQUFiLENBQUo7V0FDT29KLElBQUksTUFBSixJQUFjQSxJQUFJLE1BQWxCLElBQTRCcEosSUFBSSxDQUFKLEtBQVVDLENBQXRDLElBQTJDLENBQUMwTCxJQUFJd0QsRUFBRUUsVUFBRixDQUFhclAsSUFBSSxDQUFqQixDQUFMLElBQTRCLE1BQXZFLElBQWlGMkwsSUFBSSxNQUFyRixHQUNIWixZQUFZb0UsRUFBRUcsTUFBRixDQUFTdFAsQ0FBVCxDQUFaLEdBQTBCb0osQ0FEdkIsR0FFSDJCLFlBQVlvRSxFQUFFaEMsS0FBRixDQUFRbk4sQ0FBUixFQUFXQSxJQUFJLENBQWYsQ0FBWixHQUFnQyxDQUFDb0osSUFBSSxNQUFKLElBQWMsRUFBZixLQUFzQnVDLElBQUksTUFBMUIsSUFBb0MsT0FGeEU7R0FQRjtDQURGOztBQ0pBLGlCQUFpQixFQUFqQjs7QUNBQTs7QUFFQSxJQUFJNEQsTUFBTTdKLEtBQUs2SixHQUFmO0FBQ0EsZ0JBQWlCLGtCQUFBLENBQVUzRyxFQUFWLEVBQWM7U0FDdEJBLEtBQUssQ0FBTCxHQUFTMkcsSUFBSUgsV0FBVXhHLEVBQVYsQ0FBSixFQUFtQixnQkFBbkIsQ0FBVCxHQUFnRCxDQUF2RCxDQUQ2QjtDQUEvQjs7QUNGQSxJQUFJNEcsTUFBTTlKLEtBQUs4SixHQUFmO0FBQ0EsSUFBSUQsUUFBTTdKLEtBQUs2SixHQUFmO0FBQ0EsdUJBQWlCLHlCQUFBLENBQVVFLEtBQVYsRUFBaUJ2UCxNQUFqQixFQUF5QjtVQUNoQ2tQLFdBQVVLLEtBQVYsQ0FBUjtTQUNPQSxRQUFRLENBQVIsR0FBWUQsSUFBSUMsUUFBUXZQLE1BQVosRUFBb0IsQ0FBcEIsQ0FBWixHQUFxQ3FQLE1BQUlFLEtBQUosRUFBV3ZQLE1BQVgsQ0FBNUM7Q0FGRjs7QUNIQTs7OztBQUtBLHFCQUFpQix1QkFBQSxDQUFVd1AsV0FBVixFQUF1QjtTQUMvQixVQUFVQyxLQUFWLEVBQWlCQyxFQUFqQixFQUFxQkMsU0FBckIsRUFBZ0M7UUFDakM5RixJQUFJMEQsV0FBVWtDLEtBQVYsQ0FBUjtRQUNJelAsU0FBUzRQLFVBQVMvRixFQUFFN0osTUFBWCxDQUFiO1FBQ0l1UCxRQUFRTSxpQkFBZ0JGLFNBQWhCLEVBQTJCM1AsTUFBM0IsQ0FBWjtRQUNJOEQsS0FBSjs7O1FBR0kwTCxlQUFlRSxNQUFNQSxFQUF6QixFQUE2QixPQUFPMVAsU0FBU3VQLEtBQWhCLEVBQXVCO2NBQzFDMUYsRUFBRTBGLE9BQUYsQ0FBUjs7VUFFSXpMLFNBQVNBLEtBQWIsRUFBb0IsT0FBTyxJQUFQOztLQUh0QixNQUtPLE9BQU05RCxTQUFTdVAsS0FBZixFQUFzQkEsT0FBdEI7VUFBbUNDLGVBQWVELFNBQVMxRixDQUE1QixFQUErQjtZQUMvREEsRUFBRTBGLEtBQUYsTUFBYUcsRUFBakIsRUFBcUIsT0FBT0YsZUFBZUQsS0FBZixJQUF3QixDQUEvQjs7S0FDckIsT0FBTyxDQUFDQyxXQUFELElBQWdCLENBQUMsQ0FBeEI7R0FkSjtDQURGOztBQ0xBLElBQUlNLFNBQVNoSCxRQUFxQixNQUFyQixDQUFiOztBQUVBLGlCQUFpQixtQkFBQSxDQUFVc0IsR0FBVixFQUFlO1NBQ3ZCMEYsT0FBTzFGLEdBQVAsTUFBZ0IwRixPQUFPMUYsR0FBUCxJQUFja0UsS0FBSWxFLEdBQUosQ0FBOUIsQ0FBUDtDQURGOztBQ0FBLElBQUkyRixlQUFlakgsZUFBNkIsS0FBN0IsQ0FBbkI7QUFDQSxJQUFJa0gsYUFBVzNHLFdBQXlCLFVBQXpCLENBQWY7O0FBRUEsMEJBQWlCLDRCQUFBLENBQVVjLE1BQVYsRUFBa0I4RixLQUFsQixFQUF5QjtNQUNwQ3BHLElBQUkwRCxXQUFVcEQsTUFBVixDQUFSO01BQ0lySyxJQUFJLENBQVI7TUFDSW9RLFNBQVMsRUFBYjtNQUNJOUYsR0FBSjtPQUNLQSxHQUFMLElBQVlQLENBQVo7UUFBbUJPLE9BQU80RixVQUFYLEVBQXFCNUUsS0FBSXZCLENBQUosRUFBT08sR0FBUCxLQUFlOEYsT0FBT2hDLElBQVAsQ0FBWTlELEdBQVosQ0FBZjtHQUxJO1NBT2pDNkYsTUFBTWpRLE1BQU4sR0FBZUYsQ0FBdEI7UUFBNkJzTCxLQUFJdkIsQ0FBSixFQUFPTyxNQUFNNkYsTUFBTW5RLEdBQU4sQ0FBYixDQUFKLEVBQThCO09BQ3BEaVEsYUFBYUcsTUFBYixFQUFxQjlGLEdBQXJCLENBQUQsSUFBOEI4RixPQUFPaEMsSUFBUCxDQUFZOUQsR0FBWixDQUE5Qjs7R0FFRixPQUFPOEYsTUFBUDtDQVZGOztBQ0xBO0FBQ0EsbUJBQ0UsK0ZBRGUsQ0FFZmxGLEtBRmUsQ0FFVCxHQUZTLENBQWpCOztBQ0RBOzs7QUFJQSxrQkFBaUJqQyxPQUFPb0gsSUFBUCxJQUFlLFNBQVNBLElBQVQsQ0FBY3RHLENBQWQsRUFBaUI7U0FDeEN1RyxvQkFBTXZHLENBQU4sRUFBU3dHLFlBQVQsQ0FBUDtDQURGOztBQ0FBLGlCQUFpQnZILGVBQTRCQyxPQUFPdUgsZ0JBQW5DLEdBQXNELFNBQVNBLGdCQUFULENBQTBCekcsQ0FBMUIsRUFBNkIwRyxVQUE3QixFQUF5QztZQUNyRzFHLENBQVQ7TUFDSXNHLE9BQU9LLFlBQVFELFVBQVIsQ0FBWDtNQUNJdlEsU0FBU21RLEtBQUtuUSxNQUFsQjtNQUNJRixJQUFJLENBQVI7TUFDSWdLLENBQUo7U0FDTzlKLFNBQVNGLENBQWhCO2NBQXNCdUssQ0FBSCxDQUFLUixDQUFMLEVBQVFDLElBQUlxRyxLQUFLclEsR0FBTCxDQUFaLEVBQXVCeVEsV0FBV3pHLENBQVgsQ0FBdkI7R0FDbkIsT0FBT0QsQ0FBUDtDQVBGOztBQ0pBLElBQUloSCxhQUFXaUcsUUFBcUJqRyxRQUFwQztBQUNBLFlBQWlCQSxjQUFZQSxXQUFTdUUsZUFBdEM7O0FDREE7OztBQUlBLElBQUk0SSxXQUFXbEgsV0FBeUIsVUFBekIsQ0FBZjtBQUNBLElBQUkySCxRQUFRLFNBQVJBLEtBQVEsR0FBWSxhQUF4QjtBQUNBLElBQUk5RSxjQUFZLFdBQWhCOzs7QUFHQSxJQUFJK0UsY0FBYSxzQkFBWTs7TUFFdkJDLFNBQVN0SCxXQUF5QixRQUF6QixDQUFiO01BQ0l2SixJQUFJdVEsYUFBWXJRLE1BQXBCO01BQ0k0USxLQUFLLEdBQVQ7TUFDSUMsS0FBSyxHQUFUO01BQ0lDLGNBQUo7U0FDT3RKLEtBQVAsQ0FBYXVKLE9BQWIsR0FBdUIsTUFBdkI7UUFDbUJDLFdBQW5CLENBQStCTCxNQUEvQjtTQUNPTSxHQUFQLEdBQWEsYUFBYixDQVQyQjs7O21CQVlWTixPQUFPTyxhQUFQLENBQXFCck8sUUFBdEM7aUJBQ2VzTyxJQUFmO2lCQUNlQyxLQUFmLENBQXFCUixLQUFLLFFBQUwsR0FBZ0JDLEVBQWhCLEdBQXFCLG1CQUFyQixHQUEyQ0QsRUFBM0MsR0FBZ0QsU0FBaEQsR0FBNERDLEVBQWpGO2lCQUNlUSxLQUFmO2dCQUNhUCxlQUFlOUUsQ0FBNUI7U0FDT2xNLEdBQVA7V0FBbUI0USxZQUFXL0UsV0FBWCxFQUFzQjBFLGFBQVl2USxDQUFaLENBQXRCLENBQVA7R0FDWixPQUFPNFEsYUFBUDtDQWxCRjs7QUFxQkEsb0JBQWlCM0gsT0FBT3VJLE1BQVAsSUFBaUIsU0FBU0EsTUFBVCxDQUFnQnpILENBQWhCLEVBQW1CMEcsVUFBbkIsRUFBK0I7TUFDM0RMLE1BQUo7TUFDSXJHLE1BQU0sSUFBVixFQUFnQjtVQUNSOEIsV0FBTixJQUFtQjRGLFVBQVMxSCxDQUFULENBQW5CO2FBQ1MsSUFBSTRHLEtBQUosRUFBVDtVQUNNOUUsV0FBTixJQUFtQixJQUFuQjs7V0FFT3FFLFFBQVAsSUFBbUJuRyxDQUFuQjtHQUxGLE1BTU9xRyxTQUFTUSxhQUFUO1NBQ0FILGVBQWUxSyxTQUFmLEdBQTJCcUssTUFBM0IsR0FBb0NzQixXQUFJdEIsTUFBSixFQUFZSyxVQUFaLENBQTNDO0NBVEY7O0FDOUJBLElBQUlrQixNQUFNM0ksVUFBd0J1QixDQUFsQzs7QUFFQSxJQUFJa0UsUUFBTWxGLEtBQWtCLGFBQWxCLENBQVY7O0FBRUEsc0JBQWlCLHdCQUFBLENBQVVYLEVBQVYsRUFBY2dKLEdBQWQsRUFBbUJDLElBQW5CLEVBQXlCO01BQ3BDakosTUFBTSxDQUFDMEMsS0FBSTFDLEtBQUtpSixPQUFPakosRUFBUCxHQUFZQSxHQUFHaEksU0FBeEIsRUFBbUM2TixLQUFuQyxDQUFYLEVBQW9Ea0QsSUFBSS9JLEVBQUosRUFBUTZGLEtBQVIsRUFBYSxFQUFFcUQsY0FBYyxJQUFoQixFQUFzQjlOLE9BQU80TixHQUE3QixFQUFiO0NBRHREOztBQ0FBLElBQUlHLG9CQUFvQixFQUF4Qjs7O0FBR0EvSSxNQUFtQitJLGlCQUFuQixFQUFzQ3hJLEtBQWtCLFVBQWxCLENBQXRDLEVBQXFFLFlBQVk7U0FBUyxJQUFQO0NBQW5GOztBQUVBLGtCQUFpQixvQkFBQSxDQUFVeUksV0FBVixFQUF1QkMsSUFBdkIsRUFBNkJDLElBQTdCLEVBQW1DO2NBQ3RDdFIsU0FBWixHQUF3QjRRLGNBQU9PLGlCQUFQLEVBQTBCLEVBQUVHLE1BQU1DLGNBQVcsQ0FBWCxFQUFjRCxJQUFkLENBQVIsRUFBMUIsQ0FBeEI7a0JBQ2VGLFdBQWYsRUFBNEJDLE9BQU8sV0FBbkM7Q0FGRjs7QUNUQTs7QUFFQSxnQkFBaUIsa0JBQUEsQ0FBVXJKLEVBQVYsRUFBYztTQUN0QkssT0FBT3FFLFNBQVExRSxFQUFSLENBQVAsQ0FBUDtDQURGOztBQ0ZBOzs7QUFHQSxJQUFJc0gsYUFBV2xILFdBQXlCLFVBQXpCLENBQWY7QUFDQSxJQUFJb0osY0FBY25KLE9BQU9ySSxTQUF6Qjs7QUFFQSxpQkFBaUJxSSxPQUFPb0osY0FBUCxJQUF5QixVQUFVdEksQ0FBVixFQUFhO01BQ2pEdUksVUFBU3ZJLENBQVQsQ0FBSjtNQUNJdUIsS0FBSXZCLENBQUosRUFBT21HLFVBQVAsQ0FBSixFQUFzQixPQUFPbkcsRUFBRW1HLFVBQUYsQ0FBUDtNQUNsQixPQUFPbkcsRUFBRXdJLFdBQVQsSUFBd0IsVUFBeEIsSUFBc0N4SSxhQUFhQSxFQUFFd0ksV0FBekQsRUFBc0U7V0FDN0R4SSxFQUFFd0ksV0FBRixDQUFjM1IsU0FBckI7R0FDQSxPQUFPbUosYUFBYWQsTUFBYixHQUFzQm1KLFdBQXRCLEdBQW9DLElBQTNDO0NBTEo7O0FDR0EsSUFBSUksV0FBV3hKLEtBQWtCLFVBQWxCLENBQWY7QUFDQSxJQUFJeUosUUFBUSxFQUFFLEdBQUdwQyxJQUFILElBQVcsVUFBVSxHQUFHQSxJQUFILEVBQXZCLENBQVo7QUFDQSxJQUFJcUMsY0FBYyxZQUFsQjtBQUNBLElBQUlDLE9BQU8sTUFBWDtBQUNBLElBQUlDLFNBQVMsUUFBYjs7QUFFQSxJQUFJQyxhQUFhLFNBQWJBLFVBQWEsR0FBWTtTQUFTLElBQVA7Q0FBL0I7O0FBRUEsa0JBQWlCLG9CQUFBLENBQVVDLElBQVYsRUFBZ0JiLElBQWhCLEVBQXNCRCxXQUF0QixFQUFtQ0UsSUFBbkMsRUFBeUNhLE9BQXpDLEVBQWtEQyxNQUFsRCxFQUEwREMsTUFBMUQsRUFBa0U7Y0FDckVqQixXQUFaLEVBQXlCQyxJQUF6QixFQUErQkMsSUFBL0I7TUFDSWdCLFlBQVksU0FBWkEsU0FBWSxDQUFVQyxJQUFWLEVBQWdCO1FBQzFCLENBQUNWLEtBQUQsSUFBVVUsUUFBUXZGLEtBQXRCLEVBQTZCLE9BQU9BLE1BQU11RixJQUFOLENBQVA7WUFDckJBLElBQVI7V0FDT1IsSUFBTDtlQUFrQixTQUFTdEMsSUFBVCxHQUFnQjtpQkFBUyxJQUFJMkIsV0FBSixDQUFnQixJQUFoQixFQUFzQm1CLElBQXRCLENBQVA7U0FBekI7V0FDTlAsTUFBTDtlQUFvQixTQUFTUSxNQUFULEdBQWtCO2lCQUFTLElBQUlwQixXQUFKLENBQWdCLElBQWhCLEVBQXNCbUIsSUFBdEIsQ0FBUDtTQUEzQjtLQUNiLE9BQU8sU0FBU0UsT0FBVCxHQUFtQjthQUFTLElBQUlyQixXQUFKLENBQWdCLElBQWhCLEVBQXNCbUIsSUFBdEIsQ0FBUDtLQUE1QjtHQUxKO01BT0kxRSxNQUFNd0QsT0FBTyxXQUFqQjtNQUNJcUIsYUFBYVAsV0FBV0gsTUFBNUI7TUFDSVcsYUFBYSxLQUFqQjtNQUNJM0YsUUFBUWtGLEtBQUtsUyxTQUFqQjtNQUNJNFMsVUFBVTVGLE1BQU00RSxRQUFOLEtBQW1CNUUsTUFBTThFLFdBQU4sQ0FBbkIsSUFBeUNLLFdBQVduRixNQUFNbUYsT0FBTixDQUFsRTtNQUNJVSxXQUFXRCxXQUFXTixVQUFVSCxPQUFWLENBQTFCO01BQ0lXLFdBQVdYLFVBQVUsQ0FBQ08sVUFBRCxHQUFjRyxRQUFkLEdBQXlCUCxVQUFVLFNBQVYsQ0FBbkMsR0FBMERuTixTQUF6RTtNQUNJNE4sYUFBYTFCLFFBQVEsT0FBUixHQUFrQnJFLE1BQU15RixPQUFOLElBQWlCRyxPQUFuQyxHQUE2Q0EsT0FBOUQ7TUFDSXpULE9BQUosRUFBYXVLLEdBQWIsRUFBa0J5SCxpQkFBbEI7O01BRUk0QixVQUFKLEVBQWdCO3dCQUNNdEIsV0FBZXNCLFdBQVd2UyxJQUFYLENBQWdCLElBQUkwUixJQUFKLEVBQWhCLENBQWYsQ0FBcEI7UUFDSWYsc0JBQXNCOUksT0FBT3JJLFNBQTdCLElBQTBDbVIsa0JBQWtCRyxJQUFoRSxFQUFzRTs7c0JBRXJESCxpQkFBZixFQUFrQ3RELEdBQWxDLEVBQXVDLElBQXZDOztVQUVJLENBQUNtRixRQUFELElBQVksT0FBTzdCLGtCQUFrQlMsUUFBbEIsQ0FBUCxJQUFzQyxVQUF0RCxFQUFrRWpILE1BQUt3RyxpQkFBTCxFQUF3QlMsUUFBeEIsRUFBa0NLLFVBQWxDOzs7O01BSWxFUyxjQUFjRSxPQUFkLElBQXlCQSxRQUFRekgsSUFBUixLQUFpQjZHLE1BQTlDLEVBQXNEO2lCQUN2QyxJQUFiO2VBQ1csU0FBU1EsTUFBVCxHQUFrQjthQUFTSSxRQUFRcFMsSUFBUixDQUFhLElBQWIsQ0FBUDtLQUEvQjs7O01BR0UsQ0FBQyxDQUFDd1MsUUFBRCxJQUFZWCxNQUFiLE1BQXlCUixTQUFTYyxVQUFULElBQXVCLENBQUMzRixNQUFNNEUsUUFBTixDQUFqRCxDQUFKLEVBQXVFO1VBQ2hFNUUsS0FBTCxFQUFZNEUsUUFBWixFQUFzQmlCLFFBQXRCOzs7YUFHUXhCLElBQVYsSUFBa0J3QixRQUFsQjthQUNVaEYsR0FBVixJQUFpQm9FLFVBQWpCO01BQ0lFLE9BQUosRUFBYTtjQUNEO2NBQ0FPLGFBQWFHLFFBQWIsR0FBd0JQLFVBQVVOLE1BQVYsQ0FEeEI7WUFFRkksU0FBU1MsUUFBVCxHQUFvQlAsVUFBVVAsSUFBVixDQUZsQjtlQUdDZTtLQUhYO1FBS0lULE1BQUosRUFBWSxLQUFLM0ksR0FBTCxJQUFZdkssT0FBWixFQUFxQjtVQUMzQixFQUFFdUssT0FBT3NELEtBQVQsQ0FBSixFQUFxQmQsVUFBU2MsS0FBVCxFQUFnQnRELEdBQWhCLEVBQXFCdkssUUFBUXVLLEdBQVIsQ0FBckI7S0FEdkIsTUFFT3dCLFFBQVFBLFFBQVE5QixDQUFSLEdBQVk4QixRQUFRSSxDQUFSLElBQWF1RyxTQUFTYyxVQUF0QixDQUFwQixFQUF1RHRCLElBQXZELEVBQTZEbFMsT0FBN0Q7O1NBRUZBLE9BQVA7Q0FsREY7O0FDaEJBLElBQUk4VCxNQUFNN0ssVUFBd0IsSUFBeEIsQ0FBVjs7O0FBR0FPLFlBQTBCa0MsTUFBMUIsRUFBa0MsUUFBbEMsRUFBNEMsVUFBVXFJLFFBQVYsRUFBb0I7T0FDekRDLEVBQUwsR0FBVXRJLE9BQU9xSSxRQUFQLENBQVYsQ0FEOEQ7T0FFekRFLEVBQUwsR0FBVSxDQUFWLENBRjhEOztDQUFoRSxFQUlHLFlBQVk7TUFDVGpLLElBQUksS0FBS2dLLEVBQWI7TUFDSXRFLFFBQVEsS0FBS3VFLEVBQWpCO01BQ0lDLEtBQUo7TUFDSXhFLFNBQVMxRixFQUFFN0osTUFBZixFQUF1QixPQUFPLEVBQUU4RCxPQUFPK0IsU0FBVCxFQUFvQm1PLE1BQU0sSUFBMUIsRUFBUDtVQUNmTCxJQUFJOUosQ0FBSixFQUFPMEYsS0FBUCxDQUFSO09BQ0t1RSxFQUFMLElBQVdDLE1BQU0vVCxNQUFqQjtTQUNPLEVBQUU4RCxPQUFPaVEsS0FBVCxFQUFnQkMsTUFBTSxLQUF0QixFQUFQO0NBWEY7O0FDSkE7QUFDQSxJQUFJQyxjQUFjbkwsS0FBa0IsYUFBbEIsQ0FBbEI7QUFDQSxJQUFJb0wsYUFBYXBHLE1BQU1wTixTQUF2QjtBQUNBLElBQUl3VCxXQUFXRCxXQUFYLEtBQTJCcE8sU0FBL0IsRUFBMEN3RCxNQUFtQjZLLFVBQW5CLEVBQStCRCxXQUEvQixFQUE0QyxFQUE1QztBQUMxQyx3QkFBaUIsMEJBQUEsQ0FBVTdKLEdBQVYsRUFBZTthQUNuQjZKLFdBQVgsRUFBd0I3SixHQUF4QixJQUErQixJQUEvQjtDQURGOztBQ0pBLGdCQUFpQixrQkFBQSxDQUFVNEosSUFBVixFQUFnQmxRLEtBQWhCLEVBQXVCO1NBQy9CLEVBQUVBLE9BQU9BLEtBQVQsRUFBZ0JrUSxNQUFNLENBQUMsQ0FBQ0EsSUFBeEIsRUFBUDtDQURGOzs7Ozs7QUNVQSx5QkFBaUJsTCxZQUEwQmdGLEtBQTFCLEVBQWlDLE9BQWpDLEVBQTBDLFVBQVU4RixRQUFWLEVBQW9CWCxJQUFwQixFQUEwQjtPQUM5RVksRUFBTCxHQUFVdEcsV0FBVXFHLFFBQVYsQ0FBVixDQURtRjtPQUU5RUUsRUFBTCxHQUFVLENBQVYsQ0FGbUY7T0FHOUVLLEVBQUwsR0FBVWxCLElBQVYsQ0FIbUY7O0NBQXBFLEVBS2QsWUFBWTtNQUNUcEosSUFBSSxLQUFLZ0ssRUFBYjtNQUNJWixPQUFPLEtBQUtrQixFQUFoQjtNQUNJNUUsUUFBUSxLQUFLdUUsRUFBTCxFQUFaO01BQ0ksQ0FBQ2pLLENBQUQsSUFBTTBGLFNBQVMxRixFQUFFN0osTUFBckIsRUFBNkI7U0FDdEI2VCxFQUFMLEdBQVVoTyxTQUFWO1dBQ091TyxVQUFLLENBQUwsQ0FBUDs7TUFFRW5CLFFBQVEsTUFBWixFQUFvQixPQUFPbUIsVUFBSyxDQUFMLEVBQVE3RSxLQUFSLENBQVA7TUFDaEIwRCxRQUFRLFFBQVosRUFBc0IsT0FBT21CLFVBQUssQ0FBTCxFQUFRdkssRUFBRTBGLEtBQUYsQ0FBUixDQUFQO1NBQ2Y2RSxVQUFLLENBQUwsRUFBUSxDQUFDN0UsS0FBRCxFQUFRMUYsRUFBRTBGLEtBQUYsQ0FBUixDQUFSLENBQVA7Q0FmZSxFQWdCZCxRQWhCYyxDQUFqQjs7O0FBbUJBOEUsV0FBVUMsU0FBVixHQUFzQkQsV0FBVXZHLEtBQWhDOztBQUVBeUcsa0JBQWlCLE1BQWpCO0FBQ0FBLGtCQUFpQixRQUFqQjtBQUNBQSxrQkFBaUIsU0FBakI7O0FDMUJBLElBQUlqQyxhQUFXa0MsS0FBSSxVQUFKLENBQWY7QUFDQSxJQUFJQyxnQkFBZ0JELEtBQUksYUFBSixDQUFwQjtBQUNBLElBQUlFLGNBQWNMLFdBQVV2RyxLQUE1Qjs7QUFFQSxJQUFJNkcsZUFBZTtlQUNKLElBREk7dUJBRUksS0FGSjtnQkFHSCxLQUhHO2tCQUlELEtBSkM7ZUFLSixLQUxJO2lCQU1GLEtBTkU7Z0JBT0gsSUFQRzt3QkFRSyxLQVJMO1lBU1AsS0FUTztxQkFVRSxLQVZGO2tCQVdELEtBWEM7bUJBWUEsS0FaQTtxQkFhRSxLQWJGO2FBY04sSUFkTTtpQkFlRixLQWZFO2dCQWdCSCxLQWhCRztZQWlCUCxJQWpCTztvQkFrQkMsS0FsQkQ7VUFtQlQsS0FuQlM7ZUFvQkosS0FwQkk7aUJBcUJGLEtBckJFO2lCQXNCRixLQXRCRTtrQkF1QkQsS0F2QkM7Z0JBd0JILEtBeEJHO2lCQXlCRixLQXpCRTtvQkEwQkMsS0ExQkQ7b0JBMkJDLEtBM0JEO2tCQTRCRCxJQTVCQztvQkE2QkMsS0E3QkQ7aUJBOEJGLEtBOUJFO2FBK0JOO0NBL0JiOztBQWtDQSxLQUFLLElBQUlDLGNBQWNwRSxZQUFRbUUsWUFBUixDQUFsQixFQUF5QzdVLElBQUksQ0FBbEQsRUFBcURBLElBQUk4VSxZQUFZNVUsTUFBckUsRUFBNkVGLEdBQTdFLEVBQWtGO01BQzVFaVMsT0FBTzZDLFlBQVk5VSxDQUFaLENBQVg7TUFDSStVLFdBQVdGLGFBQWE1QyxJQUFiLENBQWY7TUFDSStDLGFBQWEzTSxRQUFPNEosSUFBUCxDQUFqQjtNQUNJckUsUUFBUW9ILGNBQWNBLFdBQVdwVSxTQUFyQztNQUNJMEosR0FBSjtNQUNJc0QsS0FBSixFQUFXO1FBQ0wsQ0FBQ0EsTUFBTTRFLFVBQU4sQ0FBTCxFQUFzQmpILE1BQUtxQyxLQUFMLEVBQVk0RSxVQUFaLEVBQXNCb0MsV0FBdEI7UUFDbEIsQ0FBQ2hILE1BQU0rRyxhQUFOLENBQUwsRUFBMkJwSixNQUFLcUMsS0FBTCxFQUFZK0csYUFBWixFQUEyQjFDLElBQTNCO2VBQ2pCQSxJQUFWLElBQWtCMkMsV0FBbEI7UUFDSUcsUUFBSixFQUFjLEtBQUt6SyxHQUFMLElBQVkySyxrQkFBWjtVQUE0QixDQUFDckgsTUFBTXRELEdBQU4sQ0FBTCxFQUFpQndDLFVBQVNjLEtBQVQsRUFBZ0J0RCxHQUFoQixFQUFxQjJLLG1CQUFXM0ssR0FBWCxDQUFyQixFQUFzQyxJQUF0Qzs7Ozs7QUN0RDNELG1CQUFpQixxQkFBQSxDQUFVakksTUFBVixFQUFrQjhPLEdBQWxCLEVBQXVCL0YsSUFBdkIsRUFBNkI7T0FDdkMsSUFBSWQsR0FBVCxJQUFnQjZHLEdBQWhCO2NBQThCOU8sTUFBVCxFQUFpQmlJLEdBQWpCLEVBQXNCNkcsSUFBSTdHLEdBQUosQ0FBdEIsRUFBZ0NjLElBQWhDO0dBQ3JCLE9BQU8vSSxNQUFQO0NBRkY7O0FDREEsa0JBQWlCLG9CQUFBLENBQVV1RyxFQUFWLEVBQWNvSixXQUFkLEVBQTJCakcsSUFBM0IsRUFBaUNtSixjQUFqQyxFQUFpRDtNQUM1RCxFQUFFdE0sY0FBY29KLFdBQWhCLEtBQWlDa0QsbUJBQW1CblAsU0FBbkIsSUFBZ0NtUCxrQkFBa0J0TSxFQUF2RixFQUE0RjtVQUNwRkUsVUFBVWlELE9BQU8seUJBQWpCLENBQU47R0FDQSxPQUFPbkQsRUFBUDtDQUhKOztBQ0FBOztBQUVBLGdCQUFpQixrQkFBQSxDQUFVdU0sUUFBVixFQUFvQnpMLEVBQXBCLEVBQXdCMUYsS0FBeEIsRUFBK0JxUCxPQUEvQixFQUF3QztNQUNuRDtXQUNLQSxVQUFVM0osR0FBRytILFVBQVN6TixLQUFULEVBQWdCLENBQWhCLENBQUgsRUFBdUJBLE1BQU0sQ0FBTixDQUF2QixDQUFWLEdBQTZDMEYsR0FBRzFGLEtBQUgsQ0FBcEQ7O0dBREYsQ0FHRSxPQUFPK0UsQ0FBUCxFQUFVO1FBQ05xTSxNQUFNRCxTQUFTLFFBQVQsQ0FBVjtRQUNJQyxRQUFRclAsU0FBWixFQUF1QjBMLFVBQVMyRCxJQUFJaFUsSUFBSixDQUFTK1QsUUFBVCxDQUFUO1VBQ2pCcE0sQ0FBTjs7Q0FQSjs7QUNGQTs7QUFFQSxJQUFJeUosYUFBV3hKLEtBQWtCLFVBQWxCLENBQWY7QUFDQSxJQUFJb0wsZUFBYXBHLE1BQU1wTixTQUF2Qjs7QUFFQSxtQkFBaUIscUJBQUEsQ0FBVWdJLEVBQVYsRUFBYztTQUN0QkEsT0FBTzdDLFNBQVAsS0FBcUJ3TyxXQUFVdkcsS0FBVixLQUFvQnBGLEVBQXBCLElBQTBCd0wsYUFBVzVCLFVBQVgsTUFBeUI1SixFQUF4RSxDQUFQO0NBREY7O0FDSkEsSUFBSTRKLGFBQVd4SixLQUFrQixVQUFsQixDQUFmOztBQUVBLDZCQUFpQk8sTUFBbUI4TCxpQkFBbkIsR0FBdUMsVUFBVXpNLEVBQVYsRUFBYztNQUNoRUEsTUFBTTdDLFNBQVYsRUFBcUIsT0FBTzZDLEdBQUc0SixVQUFILEtBQ3ZCNUosR0FBRyxZQUFILENBRHVCLElBRXZCMkwsV0FBVXpGLFNBQVFsRyxFQUFSLENBQVYsQ0FGZ0I7Q0FEdkI7OztNQ0dJME0sUUFBUSxFQUFaO01BQ0lDLFNBQVMsRUFBYjtNQUNJck4sVUFBVUQsY0FBQSxHQUFpQixVQUFVdU4sUUFBVixFQUFvQm5DLE9BQXBCLEVBQTZCM0osRUFBN0IsRUFBaUNnQyxJQUFqQyxFQUF1QzhHLFFBQXZDLEVBQWlEO1FBQzFFaUQsU0FBU2pELFdBQVcsWUFBWTthQUFTZ0QsUUFBUDtLQUF6QixHQUE4Q0UsdUJBQVVGLFFBQVYsQ0FBM0Q7UUFDSWpMLElBQUlzQyxLQUFJbkQsRUFBSixFQUFRZ0MsSUFBUixFQUFjMkgsVUFBVSxDQUFWLEdBQWMsQ0FBNUIsQ0FBUjtRQUNJNUQsUUFBUSxDQUFaO1FBQ0l2UCxNQUFKLEVBQVlvVSxJQUFaLEVBQWtCYSxRQUFsQixFQUE0Qi9FLE1BQTVCO1FBQ0ksT0FBT3FGLE1BQVAsSUFBaUIsVUFBckIsRUFBaUMsTUFBTTNNLFVBQVUwTSxXQUFXLG1CQUFyQixDQUFOOztRQUU3QkcsYUFBWUYsTUFBWixDQUFKLEVBQXlCLEtBQUt2VixTQUFTNFAsVUFBUzBGLFNBQVN0VixNQUFsQixDQUFkLEVBQXlDQSxTQUFTdVAsS0FBbEQsRUFBeURBLE9BQXpELEVBQWtFO2VBQ2hGNEQsVUFBVTlJLEVBQUVrSCxVQUFTNkMsT0FBT2tCLFNBQVMvRixLQUFULENBQWhCLEVBQWlDLENBQWpDLENBQUYsRUFBdUM2RSxLQUFLLENBQUwsQ0FBdkMsQ0FBVixHQUE0RC9KLEVBQUVpTCxTQUFTL0YsS0FBVCxDQUFGLENBQXJFO1VBQ0lXLFdBQVdrRixLQUFYLElBQW9CbEYsV0FBV21GLE1BQW5DLEVBQTJDLE9BQU9uRixNQUFQO0tBRjdDLE1BR08sS0FBSytFLFdBQVdNLE9BQU9yVSxJQUFQLENBQVlvVSxRQUFaLENBQWhCLEVBQXVDLENBQUMsQ0FBQ2xCLE9BQU9hLFNBQVNqRCxJQUFULEVBQVIsRUFBeUJnQyxJQUFqRSxHQUF3RTtlQUNwRTlTLFVBQUsrVCxRQUFMLEVBQWU1SyxDQUFmLEVBQWtCK0osS0FBS3RRLEtBQXZCLEVBQThCcVAsT0FBOUIsQ0FBVDtVQUNJakQsV0FBV2tGLEtBQVgsSUFBb0JsRixXQUFXbUYsTUFBbkMsRUFBMkMsT0FBT25GLE1BQVA7O0dBWi9DO1VBZVFrRixLQUFSLEdBQWdCQSxLQUFoQjtVQUNRQyxNQUFSLEdBQWlCQSxNQUFqQjs7O0FDcEJBLElBQUlLLFVBQVU1TSxLQUFrQixTQUFsQixDQUFkOztBQUVBLGtCQUFpQixvQkFBQSxDQUFVNk0sR0FBVixFQUFlO01BQzFCQyxJQUFJek4sUUFBT3dOLEdBQVAsQ0FBUjtNQUNJRSxnQkFBZUQsQ0FBZixJQUFvQixDQUFDQSxFQUFFRixPQUFGLENBQXpCLEVBQXFDOUwsVUFBR1MsQ0FBSCxDQUFLdUwsQ0FBTCxFQUFRRixPQUFSLEVBQWlCO2tCQUN0QyxJQURzQztTQUUvQyxlQUFZO2FBQVMsSUFBUDs7R0FGZ0I7Q0FGdkM7OztNQ05JSSxPQUFPaE4sS0FBa0IsTUFBbEIsQ0FBWDs7TUFHSWlOLFVBQVUxTSxVQUF3QmdCLENBQXRDO01BQ0lHLEtBQUssQ0FBVDtNQUNJd0wsZUFBZWpOLE9BQU9pTixZQUFQLElBQXVCLFlBQVk7V0FDN0MsSUFBUDtHQURGO01BR0lDLFNBQVMsQ0FBQzNNLE9BQW9CLFlBQVk7V0FDckMwTSxhQUFhak4sT0FBT21OLGlCQUFQLENBQXlCLEVBQXpCLENBQWIsQ0FBUDtHQURZLENBQWQ7TUFHSUMsVUFBVSxTQUFWQSxPQUFVLENBQVV6TixFQUFWLEVBQWM7WUFDbEJBLEVBQVIsRUFBWW9OLElBQVosRUFBa0IsRUFBRWhTLE9BQU87V0FDdEIsTUFBTSxFQUFFMEcsRUFEYztXQUV0QixFQUZzQjtPQUFULEVBQWxCO0dBREY7TUFNSTRMLFVBQVUsU0FBVkEsT0FBVSxDQUFVMU4sRUFBVixFQUFjNEksTUFBZCxFQUFzQjs7UUFFOUIsQ0FBQzNJLFVBQVNELEVBQVQsQ0FBTCxFQUFtQixPQUFPLFFBQU9BLEVBQVAseUNBQU9BLEVBQVAsTUFBYSxRQUFiLEdBQXdCQSxFQUF4QixHQUE2QixDQUFDLE9BQU9BLEVBQVAsSUFBYSxRQUFiLEdBQXdCLEdBQXhCLEdBQThCLEdBQS9CLElBQXNDQSxFQUExRTtRQUNmLENBQUMwQyxLQUFJMUMsRUFBSixFQUFRb04sSUFBUixDQUFMLEVBQW9COztVQUVkLENBQUNFLGFBQWF0TixFQUFiLENBQUwsRUFBdUIsT0FBTyxHQUFQOztVQUVuQixDQUFDNEksTUFBTCxFQUFhLE9BQU8sR0FBUDs7Y0FFTDVJLEVBQVI7O0tBRUEsT0FBT0EsR0FBR29OLElBQUgsRUFBU2hXLENBQWhCO0dBWEo7TUFhSXVXLFVBQVUsU0FBVkEsT0FBVSxDQUFVM04sRUFBVixFQUFjNEksTUFBZCxFQUFzQjtRQUM5QixDQUFDbEcsS0FBSTFDLEVBQUosRUFBUW9OLElBQVIsQ0FBTCxFQUFvQjs7VUFFZCxDQUFDRSxhQUFhdE4sRUFBYixDQUFMLEVBQXVCLE9BQU8sSUFBUDs7VUFFbkIsQ0FBQzRJLE1BQUwsRUFBYSxPQUFPLEtBQVA7O2NBRUw1SSxFQUFSOztLQUVBLE9BQU9BLEdBQUdvTixJQUFILEVBQVNRLENBQWhCO0dBVEo7O01BWUlDLFdBQVcsU0FBWEEsUUFBVyxDQUFVN04sRUFBVixFQUFjO1FBQ3ZCdU4sVUFBVU8sS0FBS0MsSUFBZixJQUF1QlQsYUFBYXROLEVBQWIsQ0FBdkIsSUFBMkMsQ0FBQzBDLEtBQUkxQyxFQUFKLEVBQVFvTixJQUFSLENBQWhELEVBQStESyxRQUFRek4sRUFBUjtXQUN4REEsRUFBUDtHQUZGO01BSUk4TixPQUFPek8sY0FBQSxHQUFpQjtTQUNyQitOLElBRHFCO1VBRXBCLEtBRm9CO2FBR2pCTSxPQUhpQjthQUlqQkMsT0FKaUI7Y0FLaEJFO0dBTFo7Ozs7Ozs7OztBQzdDQSwwQkFBaUIsNEJBQUEsQ0FBVTdOLEVBQVYsRUFBY2dPLElBQWQsRUFBb0I7TUFDL0IsQ0FBQy9OLFVBQVNELEVBQVQsQ0FBRCxJQUFpQkEsR0FBR21MLEVBQUgsS0FBVTZDLElBQS9CLEVBQXFDLE1BQU05TixVQUFVLDRCQUE0QjhOLElBQTVCLEdBQW1DLFlBQTdDLENBQU47U0FDOUJoTyxFQUFQO0NBRkY7O0FDQUEsSUFBSWtCLE9BQUtkLFVBQXdCdUIsQ0FBakM7O0FBVUEsSUFBSStMLFVBQVUvTSxNQUFtQitNLE9BQWpDOztBQUVBLElBQUlPLE9BQU9kLGVBQWMsSUFBZCxHQUFxQixNQUFoQzs7QUFFQSxJQUFJZSxXQUFXLFNBQVhBLFFBQVcsQ0FBVXBMLElBQVYsRUFBZ0JwQixHQUFoQixFQUFxQjs7TUFFOUJtRixRQUFRNkcsUUFBUWhNLEdBQVIsQ0FBWjtNQUNJeU0sS0FBSjtNQUNJdEgsVUFBVSxHQUFkLEVBQW1CLE9BQU8vRCxLQUFLc0ksRUFBTCxDQUFRdkUsS0FBUixDQUFQOztPQUVkc0gsUUFBUXJMLEtBQUtzTCxFQUFsQixFQUFzQkQsS0FBdEIsRUFBNkJBLFFBQVFBLE1BQU1FLENBQTNDLEVBQThDO1FBQ3hDRixNQUFNRyxDQUFOLElBQVc1TSxHQUFmLEVBQW9CLE9BQU95TSxLQUFQOztDQVB4Qjs7QUFXQSx3QkFBaUI7a0JBQ0Msd0JBQVVJLE9BQVYsRUFBbUJsRixJQUFuQixFQUF5Qm1GLE1BQXpCLEVBQWlDQyxLQUFqQyxFQUF3QztRQUNsRHZCLElBQUlxQixRQUFRLFVBQVV6TCxJQUFWLEVBQWdCOEosUUFBaEIsRUFBMEI7a0JBQzdCOUosSUFBWCxFQUFpQm9LLENBQWpCLEVBQW9CN0QsSUFBcEIsRUFBMEIsSUFBMUI7V0FDSzhCLEVBQUwsR0FBVTlCLElBQVYsQ0FGd0M7V0FHbkMrQixFQUFMLEdBQVV4QyxjQUFPLElBQVAsQ0FBVixDQUh3QztXQUluQ3dGLEVBQUwsR0FBVWpSLFNBQVYsQ0FKd0M7V0FLbkN1UixFQUFMLEdBQVV2UixTQUFWLENBTHdDO1dBTW5DOFEsSUFBTCxJQUFhLENBQWIsQ0FOd0M7VUFPcENyQixZQUFZelAsU0FBaEIsRUFBMkJ3UixPQUFNL0IsUUFBTixFQUFnQjRCLE1BQWhCLEVBQXdCMUwsS0FBSzJMLEtBQUwsQ0FBeEIsRUFBcUMzTCxJQUFyQztLQVByQixDQUFSO2lCQVNZb0ssRUFBRWxWLFNBQWQsRUFBeUI7OzthQUdoQixTQUFTNFcsS0FBVCxHQUFpQjthQUNqQixJQUFJOUwsT0FBTytMLG9CQUFTLElBQVQsRUFBZXhGLElBQWYsQ0FBWCxFQUFpQ3lGLE9BQU9oTSxLQUFLc0ksRUFBN0MsRUFBaUQrQyxRQUFRckwsS0FBS3NMLEVBQW5FLEVBQXVFRCxLQUF2RSxFQUE4RUEsUUFBUUEsTUFBTUUsQ0FBNUYsRUFBK0Y7Z0JBQ3ZGVSxDQUFOLEdBQVUsSUFBVjtjQUNJWixNQUFNYSxDQUFWLEVBQWFiLE1BQU1hLENBQU4sR0FBVWIsTUFBTWEsQ0FBTixDQUFRWCxDQUFSLEdBQVlsUixTQUF0QjtpQkFDTjJSLEtBQUtYLE1BQU0vVyxDQUFYLENBQVA7O2FBRUdnWCxFQUFMLEdBQVV0TCxLQUFLNEwsRUFBTCxHQUFVdlIsU0FBcEI7YUFDSzhRLElBQUwsSUFBYSxDQUFiO09BVnFCOzs7Z0JBY2IsaUJBQVV2TSxHQUFWLEVBQWU7WUFDbkJvQixPQUFPK0wsb0JBQVMsSUFBVCxFQUFleEYsSUFBZixDQUFYO1lBQ0k4RSxRQUFRRCxTQUFTcEwsSUFBVCxFQUFlcEIsR0FBZixDQUFaO1lBQ0l5TSxLQUFKLEVBQVc7Y0FDTDdFLE9BQU82RSxNQUFNRSxDQUFqQjtjQUNJWSxPQUFPZCxNQUFNYSxDQUFqQjtpQkFDT2xNLEtBQUtzSSxFQUFMLENBQVErQyxNQUFNL1csQ0FBZCxDQUFQO2dCQUNNMlgsQ0FBTixHQUFVLElBQVY7Y0FDSUUsSUFBSixFQUFVQSxLQUFLWixDQUFMLEdBQVMvRSxJQUFUO2NBQ05BLElBQUosRUFBVUEsS0FBSzBGLENBQUwsR0FBU0MsSUFBVDtjQUNObk0sS0FBS3NMLEVBQUwsSUFBV0QsS0FBZixFQUFzQnJMLEtBQUtzTCxFQUFMLEdBQVU5RSxJQUFWO2NBQ2xCeEcsS0FBSzRMLEVBQUwsSUFBV1AsS0FBZixFQUFzQnJMLEtBQUs0TCxFQUFMLEdBQVVPLElBQVY7ZUFDakJoQixJQUFMO1NBQ0EsT0FBTyxDQUFDLENBQUNFLEtBQVQ7T0EzQm1COzs7ZUErQmQsU0FBU2UsT0FBVCxDQUFpQkMsVUFBakIsMkJBQXNEOzRCQUNwRCxJQUFULEVBQWU5RixJQUFmO1lBQ0kxSCxJQUFJc0MsS0FBSWtMLFVBQUosRUFBZ0JqWSxVQUFVSSxNQUFWLEdBQW1CLENBQW5CLEdBQXVCSixVQUFVLENBQVYsQ0FBdkIsR0FBc0NpRyxTQUF0RCxFQUFpRSxDQUFqRSxDQUFSO1lBQ0lnUixLQUFKO2VBQ09BLFFBQVFBLFFBQVFBLE1BQU1FLENBQWQsR0FBa0IsS0FBS0QsRUFBdEMsRUFBMEM7WUFDdENELE1BQU1pQixDQUFSLEVBQVdqQixNQUFNRyxDQUFqQixFQUFvQixJQUFwQjs7aUJBRU9ILFNBQVNBLE1BQU1ZLENBQXRCO29CQUFpQ1osTUFBTWEsQ0FBZDs7O09BdENOOzs7V0EyQ2xCLFNBQVN0TSxHQUFULENBQWFoQixHQUFiLEVBQWtCO2VBQ2QsQ0FBQyxDQUFDd00sU0FBU1csb0JBQVMsSUFBVCxFQUFleEYsSUFBZixDQUFULEVBQStCM0gsR0FBL0IsQ0FBVDs7S0E1Q0o7UUErQ0l5TCxZQUFKLEVBQWlCak0sS0FBR2dNLEVBQUVsVixTQUFMLEVBQWdCLE1BQWhCLEVBQXdCO1dBQ2xDLGVBQVk7ZUFDUjZXLG9CQUFTLElBQVQsRUFBZXhGLElBQWYsRUFBcUI0RSxJQUFyQixDQUFQOztLQUZhO1dBS1ZmLENBQVA7R0EvRGE7T0FpRVYsYUFBVXBLLElBQVYsRUFBZ0JwQixHQUFoQixFQUFxQnRHLEtBQXJCLEVBQTRCO1FBQzNCK1MsUUFBUUQsU0FBU3BMLElBQVQsRUFBZXBCLEdBQWYsQ0FBWjtRQUNJdU4sSUFBSixFQUFVcEksS0FBVjs7UUFFSXNILEtBQUosRUFBVztZQUNIaUIsQ0FBTixHQUFVaFUsS0FBVjs7S0FERixNQUdPO1dBQ0FzVCxFQUFMLEdBQVVQLFFBQVE7V0FDYnRILFFBQVE2RyxRQUFRaE0sR0FBUixFQUFhLElBQWIsQ0FESztXQUViQSxHQUZhO1dBR2J0RyxLQUhhO1dBSWI2VCxPQUFPbk0sS0FBSzRMLEVBSkM7V0FLYnZSLFNBTGE7V0FNYixLQU5hO09BQWxCO1VBUUksQ0FBQzJGLEtBQUtzTCxFQUFWLEVBQWN0TCxLQUFLc0wsRUFBTCxHQUFVRCxLQUFWO1VBQ1ZjLElBQUosRUFBVUEsS0FBS1osQ0FBTCxHQUFTRixLQUFUO1dBQ0xGLElBQUw7O1VBRUlwSCxVQUFVLEdBQWQsRUFBbUIvRCxLQUFLc0ksRUFBTCxDQUFRdkUsS0FBUixJQUFpQnNILEtBQWpCO0tBQ25CLE9BQU9yTCxJQUFQO0dBdEZXO1lBd0ZMb0wsUUF4Rks7YUF5RkosbUJBQVVoQixDQUFWLEVBQWE3RCxJQUFiLEVBQW1CbUYsTUFBbkIsRUFBMkI7OztnQkFHeEJ0QixDQUFaLEVBQWU3RCxJQUFmLEVBQXFCLFVBQVU2QixRQUFWLEVBQW9CWCxJQUFwQixFQUEwQjtXQUN4Q1ksRUFBTCxHQUFVMEQsb0JBQVMzRCxRQUFULEVBQW1CN0IsSUFBbkIsQ0FBVixDQUQ2QztXQUV4Q29DLEVBQUwsR0FBVWxCLElBQVYsQ0FGNkM7V0FHeENtRSxFQUFMLEdBQVV2UixTQUFWLENBSDZDO0tBQS9DLEVBSUcsWUFBWTtVQUNUMkYsT0FBTyxJQUFYO1VBQ0l5SCxPQUFPekgsS0FBSzJJLEVBQWhCO1VBQ0kwQyxRQUFRckwsS0FBSzRMLEVBQWpCOzthQUVPUCxTQUFTQSxNQUFNWSxDQUF0QjtnQkFBaUNaLE1BQU1hLENBQWQ7T0FMWjtVQU9ULENBQUNsTSxLQUFLcUksRUFBTixJQUFZLEVBQUVySSxLQUFLNEwsRUFBTCxHQUFVUCxRQUFRQSxRQUFRQSxNQUFNRSxDQUFkLEdBQWtCdkwsS0FBS3FJLEVBQUwsQ0FBUWlELEVBQTlDLENBQWhCLEVBQW1FOzthQUU1RGpELEVBQUwsR0FBVWhPLFNBQVY7ZUFDT3VPLFVBQUssQ0FBTCxDQUFQOzs7VUFHRW5CLFFBQVEsTUFBWixFQUFvQixPQUFPbUIsVUFBSyxDQUFMLEVBQVF5QyxNQUFNRyxDQUFkLENBQVA7VUFDaEIvRCxRQUFRLFFBQVosRUFBc0IsT0FBT21CLFVBQUssQ0FBTCxFQUFReUMsTUFBTWlCLENBQWQsQ0FBUDthQUNmMUQsVUFBSyxDQUFMLEVBQVEsQ0FBQ3lDLE1BQU1HLENBQVAsRUFBVUgsTUFBTWlCLENBQWhCLENBQVIsQ0FBUDtLQW5CRixFQW9CR1osU0FBUyxTQUFULEdBQXFCLFFBcEJ4QixFQW9Ca0MsQ0FBQ0EsTUFwQm5DLEVBb0IyQyxJQXBCM0M7OztnQkF1QlduRixJQUFYOztDQW5ISjs7QUMxQkEsSUFBSU8sYUFBV3hKLEtBQWtCLFVBQWxCLENBQWY7QUFDQSxJQUFJaVAsZUFBZSxLQUFuQjs7QUFFQSxJQUFJO01BQ0VDLFFBQVEsQ0FBQyxDQUFELEVBQUkxRixVQUFKLEdBQVo7UUFDTSxRQUFOLElBQWtCLFlBQVk7bUJBQWlCLElBQWY7R0FBaEM7OztDQUZGLENBS0UsT0FBT3pKLENBQVAsRUFBVTs7QUFFWixrQkFBaUIsb0JBQUEsQ0FBVTNCLElBQVYsRUFBZ0IrUSxXQUFoQixFQUE2QjtNQUN4QyxDQUFDQSxXQUFELElBQWdCLENBQUNGLFlBQXJCLEVBQW1DLE9BQU8sS0FBUDtNQUMvQjdNLE9BQU8sS0FBWDtNQUNJO1FBQ0VnTixNQUFNLENBQUMsQ0FBRCxDQUFWO1FBQ0lDLE9BQU9ELElBQUk1RixVQUFKLEdBQVg7U0FDS04sSUFBTCxHQUFZLFlBQVk7YUFBUyxFQUFFZ0MsTUFBTTlJLE9BQU8sSUFBZixFQUFQO0tBQTFCO1FBQ0lvSCxVQUFKLElBQWdCLFlBQVk7YUFBUzZGLElBQVA7S0FBOUI7U0FDS0QsR0FBTDtHQUxGLENBTUUsT0FBT3JQLENBQVAsRUFBVTtTQUNMcUMsSUFBUDtDQVZGOztBQ1RBLElBQUl5QyxtQkFBaUI3RSxVQUF3QitFLEdBQTdDO0FBQ0EseUJBQWlCLDJCQUFBLENBQVVyQyxJQUFWLEVBQWdCckosTUFBaEIsRUFBd0J5VCxDQUF4QixFQUEyQjtNQUN0Q3JNLElBQUlwSCxPQUFPa1EsV0FBZjtNQUNJdkksQ0FBSjtNQUNJUCxNQUFNcU0sQ0FBTixJQUFXLE9BQU9yTSxDQUFQLElBQVksVUFBdkIsSUFBcUMsQ0FBQ08sSUFBSVAsRUFBRTdJLFNBQVAsTUFBc0JrVixFQUFFbFYsU0FBN0QsSUFBMEVpSSxVQUFTbUIsQ0FBVCxDQUExRSxJQUF5RjZELGdCQUE3RixFQUE2RztxQkFDNUZuQyxJQUFmLEVBQXFCMUIsQ0FBckI7R0FDQSxPQUFPMEIsSUFBUDtDQUxKOztBQ1lBLGtCQUFpQixvQkFBQSxDQUFVdUcsSUFBVixFQUFnQmtGLE9BQWhCLEVBQXlCcFgsT0FBekIsRUFBa0N1WSxNQUFsQyxFQUEwQ2xCLE1BQTFDLEVBQWtEbUIsT0FBbEQsRUFBMkQ7TUFDdEV6RixPQUFPekssUUFBTzRKLElBQVAsQ0FBWDtNQUNJNkQsSUFBSWhELElBQVI7TUFDSXVFLFFBQVFELFNBQVMsS0FBVCxHQUFpQixLQUE3QjtNQUNJeEosUUFBUWtJLEtBQUtBLEVBQUVsVixTQUFuQjtNQUNJbUosSUFBSSxFQUFSO01BQ0l5TyxZQUFZLFNBQVpBLFNBQVksQ0FBVTNDLEdBQVYsRUFBZTtRQUN6Qm5NLEtBQUtrRSxNQUFNaUksR0FBTixDQUFUO2NBQ1NqSSxLQUFULEVBQWdCaUksR0FBaEIsRUFDRUEsT0FBTyxRQUFQLEdBQWtCLFVBQVV6TSxDQUFWLEVBQWE7YUFDdEJtUCxXQUFXLENBQUMxUCxVQUFTTyxDQUFULENBQVosR0FBMEIsS0FBMUIsR0FBa0NNLEdBQUd0SSxJQUFILENBQVEsSUFBUixFQUFjZ0ksTUFBTSxDQUFOLEdBQVUsQ0FBVixHQUFjQSxDQUE1QixDQUF6QztLQURGLEdBRUl5TSxPQUFPLEtBQVAsR0FBZSxTQUFTdkssR0FBVCxDQUFhbEMsQ0FBYixFQUFnQjthQUMxQm1QLFdBQVcsQ0FBQzFQLFVBQVNPLENBQVQsQ0FBWixHQUEwQixLQUExQixHQUFrQ00sR0FBR3RJLElBQUgsQ0FBUSxJQUFSLEVBQWNnSSxNQUFNLENBQU4sR0FBVSxDQUFWLEdBQWNBLENBQTVCLENBQXpDO0tBREUsR0FFQXlNLE9BQU8sS0FBUCxHQUFlLFNBQVMxTSxHQUFULENBQWFDLENBQWIsRUFBZ0I7YUFDMUJtUCxXQUFXLENBQUMxUCxVQUFTTyxDQUFULENBQVosR0FBMEJyRCxTQUExQixHQUFzQzJELEdBQUd0SSxJQUFILENBQVEsSUFBUixFQUFjZ0ksTUFBTSxDQUFOLEdBQVUsQ0FBVixHQUFjQSxDQUE1QixDQUE3QztLQURFLEdBRUF5TSxPQUFPLEtBQVAsR0FBZSxTQUFTNEMsR0FBVCxDQUFhclAsQ0FBYixFQUFnQjtTQUFLaEksSUFBSCxDQUFRLElBQVIsRUFBY2dJLE1BQU0sQ0FBTixHQUFVLENBQVYsR0FBY0EsQ0FBNUIsRUFBZ0MsT0FBTyxJQUFQO0tBQWpFLEdBQ0EsU0FBUzJFLEdBQVQsQ0FBYTNFLENBQWIsRUFBZ0J1QyxDQUFoQixFQUFtQjtTQUFLdkssSUFBSCxDQUFRLElBQVIsRUFBY2dJLE1BQU0sQ0FBTixHQUFVLENBQVYsR0FBY0EsQ0FBNUIsRUFBK0J1QyxDQUEvQixFQUFtQyxPQUFPLElBQVA7S0FSOUQ7R0FGRjtNQWFJLE9BQU9tSyxDQUFQLElBQVksVUFBWixJQUEwQixFQUFFeUMsV0FBVzNLLE1BQU1rSyxPQUFOLElBQWlCLENBQUNZLE9BQU0sWUFBWTtRQUN6RTVDLENBQUosR0FBUXpDLE9BQVIsR0FBa0JuQixJQUFsQjtHQUQyRCxDQUEvQixDQUE5QixFQUVLOztRQUVDb0csT0FBT0ssY0FBUCxDQUFzQnhCLE9BQXRCLEVBQStCbEYsSUFBL0IsRUFBcUNtRixNQUFyQyxFQUE2Q0MsS0FBN0MsQ0FBSjtpQkFDWXZCLEVBQUVsVixTQUFkLEVBQXlCYixPQUF6QjtVQUNLNFcsSUFBTCxHQUFZLElBQVo7R0FORixNQU9PO1FBQ0RpQyxXQUFXLElBQUk5QyxDQUFKLEVBQWY7O1FBRUkrQyxpQkFBaUJELFNBQVN2QixLQUFULEVBQWdCa0IsVUFBVSxFQUFWLEdBQWUsQ0FBQyxDQUFoQyxFQUFtQyxDQUFuQyxLQUF5Q0ssUUFBOUQ7O1FBRUlFLHVCQUF1QkosT0FBTSxZQUFZO2VBQVdwTixHQUFULENBQWEsQ0FBYjtLQUFwQixDQUEzQjs7UUFFSXlOLG1CQUFtQkMsWUFBWSxVQUFVWCxJQUFWLEVBQWdCO1VBQU12QyxDQUFKLENBQU11QyxJQUFOO0tBQTlCLENBQXZCLENBUEs7O1FBU0RZLGFBQWEsQ0FBQ1YsT0FBRCxJQUFZRyxPQUFNLFlBQVk7O1VBRXpDUSxZQUFZLElBQUlwRCxDQUFKLEVBQWhCO1VBQ0lyRyxRQUFRLENBQVo7YUFDT0EsT0FBUDtrQkFBMEI0SCxLQUFWLEVBQWlCNUgsS0FBakIsRUFBd0JBLEtBQXhCO09BQ2hCLE9BQU8sQ0FBQ3lKLFVBQVU1TixHQUFWLENBQWMsQ0FBQyxDQUFmLENBQVI7S0FMMkIsQ0FBN0I7UUFPSSxDQUFDeU4sZ0JBQUwsRUFBdUI7VUFDakI1QixRQUFRLFVBQVU5VSxNQUFWLEVBQWtCbVQsUUFBbEIsRUFBNEI7b0JBQzNCblQsTUFBWCxFQUFtQnlULENBQW5CLEVBQXNCN0QsSUFBdEI7WUFDSXZHLE9BQU95TixtQkFBa0IsSUFBSXJHLElBQUosRUFBbEIsRUFBOEJ6USxNQUE5QixFQUFzQ3lULENBQXRDLENBQVg7WUFDSU4sWUFBWXpQLFNBQWhCLEVBQTJCd1IsT0FBTS9CLFFBQU4sRUFBZ0I0QixNQUFoQixFQUF3QjFMLEtBQUsyTCxLQUFMLENBQXhCLEVBQXFDM0wsSUFBckM7ZUFDcEJBLElBQVA7T0FKRSxDQUFKO1FBTUU5SyxTQUFGLEdBQWNnTixLQUFkO1lBQ00yRSxXQUFOLEdBQW9CdUQsQ0FBcEI7O1FBRUVnRCx3QkFBd0JHLFVBQTVCLEVBQXdDO2dCQUM1QixRQUFWO2dCQUNVLEtBQVY7Z0JBQ1VULFVBQVUsS0FBVixDQUFWOztRQUVFUyxjQUFjSixjQUFsQixFQUFrQ0wsVUFBVW5CLEtBQVY7O1FBRTlCa0IsV0FBVzNLLE1BQU00SixLQUFyQixFQUE0QixPQUFPNUosTUFBTTRKLEtBQWI7OztrQkFHZjFCLENBQWYsRUFBa0I3RCxJQUFsQjs7SUFFRUEsSUFBRixJQUFVNkQsQ0FBVjtVQUNRaEssUUFBUU0sQ0FBUixHQUFZTixRQUFRa0IsQ0FBcEIsR0FBd0JsQixRQUFRSSxDQUFSLElBQWE0SixLQUFLaEQsSUFBbEIsQ0FBaEMsRUFBeUQvSSxDQUF6RDs7TUFFSSxDQUFDd08sT0FBTCxFQUFjRCxPQUFPYyxTQUFQLENBQWlCdEQsQ0FBakIsRUFBb0I3RCxJQUFwQixFQUEwQm1GLE1BQTFCOztTQUVQdEIsQ0FBUDtDQXJFRjs7QUNYQSxJQUFJdUQsTUFBTSxLQUFWOzs7QUFHQSxjQUFpQnJRLFlBQXlCcVEsR0FBekIsRUFBOEIsVUFBVWxRLEdBQVYsRUFBZTtTQUNyRCxTQUFTbVEsR0FBVCxHQUFlO1dBQVNuUSxJQUFJLElBQUosRUFBVXJKLFVBQVVJLE1BQVYsR0FBbUIsQ0FBbkIsR0FBdUJKLFVBQVUsQ0FBVixDQUF2QixHQUFzQ2lHLFNBQWhELENBQVA7R0FBeEI7Q0FEZSxFQUVkOztPQUVJLFNBQVMwUyxHQUFULENBQWF6VSxLQUFiLEVBQW9CO1dBQ2hCdVYsa0JBQU81SCxHQUFQLENBQVc4RixvQkFBUyxJQUFULEVBQWU0QixHQUFmLENBQVgsRUFBZ0NyVixRQUFRQSxVQUFVLENBQVYsR0FBYyxDQUFkLEdBQWtCQSxLQUExRCxFQUFpRUEsS0FBakUsQ0FBUDs7Q0FMYSxFQU9kdVYsaUJBUGMsQ0FBakI7O0FDSkEseUJBQWlCLDJCQUFBLENBQVVsQixJQUFWLEVBQWdCN0YsUUFBaEIsRUFBMEI7TUFDckNwQyxTQUFTLEVBQWI7U0FDTWlJLElBQU4sRUFBWSxLQUFaLEVBQW1CakksT0FBT2hDLElBQTFCLEVBQWdDZ0MsTUFBaEMsRUFBd0NvQyxRQUF4QztTQUNPcEMsTUFBUDtDQUhGOztBQ0ZBOzs7QUFHQSx3QkFBaUIsMEJBQUEsQ0FBVTZCLElBQVYsRUFBZ0I7U0FDeEIsU0FBU3VILE1BQVQsR0FBa0I7UUFDbkIxSyxTQUFRLElBQVIsS0FBaUJtRCxJQUFyQixFQUEyQixNQUFNbkosVUFBVW1KLE9BQU8sdUJBQWpCLENBQU47V0FDcEJ3SCxtQkFBSyxJQUFMLENBQVA7R0FGRjtDQURGOztBQ0hBOzs7QUFHQTNOLFFBQVFBLFFBQVE5QixDQUFSLEdBQVk4QixRQUFRbUIsQ0FBNUIsRUFBK0IsS0FBL0IsRUFBc0MsRUFBRXVNLFFBQVF4USxrQkFBaUMsS0FBakMsQ0FBVixFQUF0Qzs7Ozs7QUNDQSx1QkFBaUIseUJBQUEsQ0FBVTBRLFVBQVYsRUFBc0I7VUFDN0I1TixRQUFRckMsQ0FBaEIsRUFBbUJpUSxVQUFuQixFQUErQixFQUFFQyxJQUFJLFNBQVNBLEVBQVQsR0FBYztVQUM3Q3paLFNBQVNKLFVBQVVJLE1BQXZCO1VBQ0kwWixJQUFJLElBQUk1TCxLQUFKLENBQVU5TixNQUFWLENBQVI7YUFDT0EsUUFBUDtVQUFtQkEsTUFBRixJQUFZSixVQUFVSSxNQUFWLENBQVo7T0FDakIsT0FBTyxJQUFJLElBQUosQ0FBUzBaLENBQVQsQ0FBUDtLQUo2QixFQUEvQjtDQURGOztBQ0pBO0FBQ0E1USxpQkFBZ0MsS0FBaEM7Ozs7O0FDTUEseUJBQWlCLDJCQUFBLENBQVUwUSxVQUFWLEVBQXNCO1VBQzdCNU4sUUFBUXJDLENBQWhCLEVBQW1CaVEsVUFBbkIsRUFBK0IsRUFBRUQsTUFBTSxTQUFTQSxJQUFULENBQWN6TixNQUFkLHlCQUE2QztVQUM5RTZOLFFBQVEvWixVQUFVLENBQVYsQ0FBWjtVQUNJZ2EsT0FBSixFQUFhRixDQUFiLEVBQWdCM0MsQ0FBaEIsRUFBbUI4QyxFQUFuQjtpQkFDVSxJQUFWO2dCQUNVRixVQUFVOVQsU0FBcEI7VUFDSStULE9BQUosRUFBYUUsV0FBVUgsS0FBVjtVQUNUN04sVUFBVWpHLFNBQWQsRUFBeUIsT0FBTyxJQUFJLElBQUosRUFBUDtVQUNyQixFQUFKO1VBQ0krVCxPQUFKLEVBQWE7WUFDUCxDQUFKO2FBQ0tqTixLQUFJZ04sS0FBSixFQUFXL1osVUFBVSxDQUFWLENBQVgsRUFBeUIsQ0FBekIsQ0FBTDtlQUNNa00sTUFBTixFQUFjLEtBQWQsRUFBcUIsVUFBVWlPLFFBQVYsRUFBb0I7WUFDckM3TCxJQUFGLENBQU8yTCxHQUFHRSxRQUFILEVBQWFoRCxHQUFiLENBQVA7U0FERjtPQUhGLE1BTU87ZUFDQ2pMLE1BQU4sRUFBYyxLQUFkLEVBQXFCNE4sRUFBRXhMLElBQXZCLEVBQTZCd0wsQ0FBN0I7O2FBRUssSUFBSSxJQUFKLENBQVNBLENBQVQsQ0FBUDtLQWpCNkIsRUFBL0I7Q0FERjs7QUNQQTtBQUNBNVEsbUJBQWtDLEtBQWxDOztBQ01BLFlBQWlCa1IsTUFBNEJaLEdBQTdDOztBQ0pBLElBQUlhLE1BQU0sS0FBVjs7O0FBR0EsY0FBaUJuUixZQUF5Qm1SLEdBQXpCLEVBQThCLFVBQVVoUixHQUFWLEVBQWU7U0FDckQsU0FBU2lSLEdBQVQsR0FBZTtXQUFTalIsSUFBSSxJQUFKLEVBQVVySixVQUFVSSxNQUFWLEdBQW1CLENBQW5CLEdBQXVCSixVQUFVLENBQVYsQ0FBdkIsR0FBc0NpRyxTQUFoRCxDQUFQO0dBQXhCO0NBRGUsRUFFZDs7T0FFSSxTQUFTb0QsR0FBVCxDQUFhbUIsR0FBYixFQUFrQjtRQUNqQnlNLFFBQVF3QyxrQkFBT3pDLFFBQVAsQ0FBZ0JXLG9CQUFTLElBQVQsRUFBZTBDLEdBQWYsQ0FBaEIsRUFBcUM3UCxHQUFyQyxDQUFaO1dBQ095TSxTQUFTQSxNQUFNaUIsQ0FBdEI7R0FKRDs7T0FPSSxTQUFTakssR0FBVCxDQUFhekQsR0FBYixFQUFrQnRHLEtBQWxCLEVBQXlCO1dBQ3JCdVYsa0JBQU81SCxHQUFQLENBQVc4RixvQkFBUyxJQUFULEVBQWUwQyxHQUFmLENBQVgsRUFBZ0M3UCxRQUFRLENBQVIsR0FBWSxDQUFaLEdBQWdCQSxHQUFoRCxFQUFxRHRHLEtBQXJELENBQVA7O0NBVmEsRUFZZHVWLGlCQVpjLEVBWU4sSUFaTSxDQUFqQjs7QUNOQTs7O0FBR0F6TixRQUFRQSxRQUFROUIsQ0FBUixHQUFZOEIsUUFBUW1CLENBQTVCLEVBQStCLEtBQS9CLEVBQXNDLEVBQUV1TSxRQUFReFEsa0JBQWlDLEtBQWpDLENBQVYsRUFBdEM7O0FDSEE7QUFDQUEsaUJBQWdDLEtBQWhDOztBQ0RBO0FBQ0FBLG1CQUFrQyxLQUFsQzs7QUNNQSxVQUFpQmtSLE1BQTRCRSxHQUE3Qzs7QUNQQTs7QUFFQSxlQUFpQnBNLE1BQU1xTSxPQUFOLElBQWlCLFNBQVNBLE9BQVQsQ0FBaUJDLEdBQWpCLEVBQXNCO1NBQy9DbE4sS0FBSWtOLEdBQUosS0FBWSxPQUFuQjtDQURGOztBQ0FBLElBQUkxRSxZQUFVNU0sS0FBa0IsU0FBbEIsQ0FBZDs7QUFFQSwrQkFBaUIsaUNBQUEsQ0FBVXVSLFFBQVYsRUFBb0I7TUFDL0J6RSxDQUFKO01BQ0l1RSxTQUFRRSxRQUFSLENBQUosRUFBdUI7UUFDakJBLFNBQVNoSSxXQUFiOztRQUVJLE9BQU91RCxDQUFQLElBQVksVUFBWixLQUEyQkEsTUFBTTlILEtBQU4sSUFBZXFNLFNBQVF2RSxFQUFFbFYsU0FBVixDQUExQyxDQUFKLEVBQXFFa1YsSUFBSS9QLFNBQUo7UUFDakU4QyxVQUFTaU4sQ0FBVCxDQUFKLEVBQWlCO1VBQ1hBLEVBQUVGLFNBQUYsQ0FBSjtVQUNJRSxNQUFNLElBQVYsRUFBZ0JBLElBQUkvUCxTQUFKOztHQUVsQixPQUFPK1AsTUFBTS9QLFNBQU4sR0FBa0JpSSxLQUFsQixHQUEwQjhILENBQWpDO0NBVko7O0FDSkE7OztBQUdBLDBCQUFpQiw0QkFBQSxDQUFVeUUsUUFBVixFQUFvQnJhLE1BQXBCLEVBQTRCO1NBQ3BDLEtBQUtzYSx5QkFBbUJELFFBQW5CLENBQUwsRUFBbUNyYSxNQUFuQyxDQUFQO0NBREY7O0FDSEE7Ozs7Ozs7OztBQVlBLG9CQUFpQixzQkFBQSxDQUFVMFcsSUFBVixFQUFnQjZELE9BQWhCLEVBQXlCO01BQ3BDckQsU0FBU1IsUUFBUSxDQUFyQjtNQUNJOEQsWUFBWTlELFFBQVEsQ0FBeEI7TUFDSStELFVBQVUvRCxRQUFRLENBQXRCO01BQ0lnRSxXQUFXaEUsUUFBUSxDQUF2QjtNQUNJaUUsZ0JBQWdCakUsUUFBUSxDQUE1QjtNQUNJa0UsV0FBV2xFLFFBQVEsQ0FBUixJQUFhaUUsYUFBNUI7TUFDSXJKLFNBQVNpSixXQUFXTSxtQkFBeEI7U0FDTyxVQUFVcEwsS0FBVixFQUFpQm9JLFVBQWpCLEVBQTZCck0sSUFBN0IsRUFBbUM7UUFDcEMzQixJQUFJdUksVUFBUzNDLEtBQVQsQ0FBUjtRQUNJckgsT0FBTytFLFNBQVF0RCxDQUFSLENBQVg7UUFDSVEsSUFBSXNDLEtBQUlrTCxVQUFKLEVBQWdCck0sSUFBaEIsRUFBc0IsQ0FBdEIsQ0FBUjtRQUNJeEwsU0FBUzRQLFVBQVN4SCxLQUFLcEksTUFBZCxDQUFiO1FBQ0l1UCxRQUFRLENBQVo7UUFDSVcsU0FBU2dILFNBQVM1RixPQUFPN0IsS0FBUCxFQUFjelAsTUFBZCxDQUFULEdBQWlDd2EsWUFBWWxKLE9BQU83QixLQUFQLEVBQWMsQ0FBZCxDQUFaLEdBQStCNUosU0FBN0U7UUFDSTRELEdBQUosRUFBU3FSLEdBQVQ7V0FDTTlhLFNBQVN1UCxLQUFmLEVBQXNCQSxPQUF0QjtVQUFtQ3FMLFlBQVlyTCxTQUFTbkgsSUFBekIsRUFBK0I7Y0FDdERBLEtBQUttSCxLQUFMLENBQU47Y0FDTWxGLEVBQUVaLEdBQUYsRUFBTzhGLEtBQVAsRUFBYzFGLENBQWQsQ0FBTjtZQUNJNk0sSUFBSixFQUFVO2NBQ0pRLE1BQUosRUFBWWhILE9BQU9YLEtBQVAsSUFBZ0J1TCxHQUFoQixDQUFaO2VBQ0ssSUFBSUEsR0FBSixFQUFTLFFBQVFwRSxJQUFSO21CQUNQLENBQUw7dUJBQWUsSUFBUCxDQURJO21CQUVQLENBQUw7dUJBQWVqTixHQUFQLENBRkk7bUJBR1AsQ0FBTDt1QkFBZThGLEtBQVAsQ0FISTttQkFJUCxDQUFMO3VCQUFlckIsSUFBUCxDQUFZekUsR0FBWixFQUpJO2FBQVQsTUFLRSxJQUFJaVIsUUFBSixFQUFjLE9BQU8sS0FBUCxDQVBiOzs7S0FVWixPQUFPQyxnQkFBZ0IsQ0FBQyxDQUFqQixHQUFxQkYsV0FBV0MsUUFBWCxHQUFzQkEsUUFBdEIsR0FBaUN4SyxNQUE3RDtHQXJCRjtDQVJGOztBQ1pBLFVBQVluSCxPQUFPZ1MscUJBQW5COzs7Ozs7Ozs7QUNPQSxJQUFJQyxVQUFValMsT0FBT2tTLE1BQXJCOzs7QUFHQSxvQkFBaUIsQ0FBQ0QsT0FBRCxJQUFZbFMsT0FBb0IsWUFBWTtNQUN2RDRRLElBQUksRUFBUjtNQUNJcE4sSUFBSSxFQUFSOztNQUVJL0MsSUFBSTRFLFFBQVI7TUFDSStNLElBQUksc0JBQVI7SUFDRTNSLENBQUYsSUFBTyxDQUFQO0lBQ0V5QixLQUFGLENBQVEsRUFBUixFQUFZNE0sT0FBWixDQUFvQixVQUFVWixDQUFWLEVBQWE7TUFBSUEsQ0FBRixJQUFPQSxDQUFQO0dBQW5DO1NBQ09nRSxRQUFRLEVBQVIsRUFBWXRCLENBQVosRUFBZW5RLENBQWYsS0FBcUIsQ0FBckIsSUFBMEJSLE9BQU9vSCxJQUFQLENBQVk2SyxRQUFRLEVBQVIsRUFBWTFPLENBQVosQ0FBWixFQUE0QmhCLElBQTVCLENBQWlDLEVBQWpDLEtBQXdDNFAsQ0FBekU7Q0FSMkIsQ0FBWixHQVNaLFNBQVNELE1BQVQsQ0FBZ0I5WSxNQUFoQixFQUF3QjJKLE1BQXhCLEVBQWdDOztNQUMvQjRDLElBQUkwRCxVQUFTalEsTUFBVCxDQUFSO01BQ0lnWixPQUFPdmIsVUFBVUksTUFBckI7TUFDSXVQLFFBQVEsQ0FBWjtNQUNJNkwsYUFBYUMsWUFBS2hSLENBQXRCO01BQ0lpUixTQUFTOU4sV0FBSW5ELENBQWpCO1NBQ084USxPQUFPNUwsS0FBZCxFQUFxQjtRQUNmaEcsSUFBSTRELFNBQVF2TixVQUFVMlAsT0FBVixDQUFSLENBQVI7UUFDSVksT0FBT2lMLGFBQWE1SyxZQUFRakgsQ0FBUixFQUFXb0IsTUFBWCxDQUFrQnlRLFdBQVc3UixDQUFYLENBQWxCLENBQWIsR0FBZ0RpSCxZQUFRakgsQ0FBUixDQUEzRDtRQUNJdkosU0FBU21RLEtBQUtuUSxNQUFsQjtRQUNJdWIsSUFBSSxDQUFSO1FBQ0luUixHQUFKO1dBQ09wSyxTQUFTdWIsQ0FBaEI7VUFBdUJELE9BQU9wYSxJQUFQLENBQVlxSSxDQUFaLEVBQWVhLE1BQU0rRixLQUFLb0wsR0FBTCxDQUFyQixDQUFKLEVBQXFDN00sRUFBRXRFLEdBQUYsSUFBU2IsRUFBRWEsR0FBRixDQUFUOztHQUN4RCxPQUFPc0UsQ0FBUDtDQXRCYSxHQXVCYnNNLE9BdkJKOztBQ1JBLElBQUkzRSxVQUFVdk4sTUFBbUJ1TixPQUFqQzs7QUFRQSxJQUFJbUYsWUFBWUMsY0FBa0IsQ0FBbEIsQ0FBaEI7QUFDQSxJQUFJQyxpQkFBaUJELGNBQWtCLENBQWxCLENBQXJCO0FBQ0EsSUFBSWpSLE9BQUssQ0FBVDs7O0FBR0EsSUFBSW1SLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQVVuUSxJQUFWLEVBQWdCO1NBQ2pDQSxLQUFLNEwsRUFBTCxLQUFZNUwsS0FBSzRMLEVBQUwsR0FBVSxJQUFJd0UsbUJBQUosRUFBdEIsQ0FBUDtDQURGO0FBR0EsSUFBSUEsc0JBQXNCLFNBQXRCQSxtQkFBc0IsR0FBWTtPQUMvQjFTLENBQUwsR0FBUyxFQUFUO0NBREY7QUFHQSxJQUFJMlMscUJBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBVTVOLEtBQVYsRUFBaUI3RCxHQUFqQixFQUFzQjtTQUN0Q29SLFVBQVV2TixNQUFNL0UsQ0FBaEIsRUFBbUIsVUFBVVIsRUFBVixFQUFjO1dBQy9CQSxHQUFHLENBQUgsTUFBVTBCLEdBQWpCO0dBREssQ0FBUDtDQURGO0FBS0F3UixvQkFBb0JsYixTQUFwQixHQUFnQztPQUN6QixhQUFVMEosR0FBVixFQUFlO1FBQ2R5TSxRQUFRZ0YsbUJBQW1CLElBQW5CLEVBQXlCelIsR0FBekIsQ0FBWjtRQUNJeU0sS0FBSixFQUFXLE9BQU9BLE1BQU0sQ0FBTixDQUFQO0dBSGlCO09BS3pCLGFBQVV6TSxHQUFWLEVBQWU7V0FDWCxDQUFDLENBQUN5UixtQkFBbUIsSUFBbkIsRUFBeUJ6UixHQUF6QixDQUFUO0dBTjRCO09BUXpCLGFBQVVBLEdBQVYsRUFBZXRHLEtBQWYsRUFBc0I7UUFDckIrUyxRQUFRZ0YsbUJBQW1CLElBQW5CLEVBQXlCelIsR0FBekIsQ0FBWjtRQUNJeU0sS0FBSixFQUFXQSxNQUFNLENBQU4sSUFBVy9TLEtBQVgsQ0FBWCxLQUNLLEtBQUtvRixDQUFMLENBQU9nRixJQUFQLENBQVksQ0FBQzlELEdBQUQsRUFBTXRHLEtBQU4sQ0FBWjtHQVh1QjtZQWFwQixpQkFBVXNHLEdBQVYsRUFBZTtRQUNuQm1GLFFBQVFtTSxlQUFlLEtBQUt4UyxDQUFwQixFQUF1QixVQUFVUixFQUFWLEVBQWM7YUFDeENBLEdBQUcsQ0FBSCxNQUFVMEIsR0FBakI7S0FEVSxDQUFaO1FBR0ksQ0FBQ21GLEtBQUwsRUFBWSxLQUFLckcsQ0FBTCxDQUFPNFMsTUFBUCxDQUFjdk0sS0FBZCxFQUFxQixDQUFyQjtXQUNMLENBQUMsQ0FBQyxDQUFDQSxLQUFWOztDQWxCSjs7QUFzQkEsc0JBQWlCO2tCQUNDLHdCQUFVMEgsT0FBVixFQUFtQmxGLElBQW5CLEVBQXlCbUYsTUFBekIsRUFBaUNDLEtBQWpDLEVBQXdDO1FBQ2xEdkIsSUFBSXFCLFFBQVEsVUFBVXpMLElBQVYsRUFBZ0I4SixRQUFoQixFQUEwQjtrQkFDN0I5SixJQUFYLEVBQWlCb0ssQ0FBakIsRUFBb0I3RCxJQUFwQixFQUEwQixJQUExQjtXQUNLOEIsRUFBTCxHQUFVOUIsSUFBVixDQUZ3QztXQUduQytCLEVBQUwsR0FBVXRKLE1BQVYsQ0FId0M7V0FJbkM0TSxFQUFMLEdBQVV2UixTQUFWLENBSndDO1VBS3BDeVAsWUFBWXpQLFNBQWhCLEVBQTJCd1IsT0FBTS9CLFFBQU4sRUFBZ0I0QixNQUFoQixFQUF3QjFMLEtBQUsyTCxLQUFMLENBQXhCLEVBQXFDM0wsSUFBckM7S0FMckIsQ0FBUjtpQkFPWW9LLEVBQUVsVixTQUFkLEVBQXlCOzs7Z0JBR2IsaUJBQVUwSixHQUFWLEVBQWU7WUFDbkIsQ0FBQ3pCLFVBQVN5QixHQUFULENBQUwsRUFBb0IsT0FBTyxLQUFQO1lBQ2hCb04sT0FBT25CLFFBQVFqTSxHQUFSLENBQVg7WUFDSW9OLFNBQVMsSUFBYixFQUFtQixPQUFPbUUsb0JBQW9CcEUsb0JBQVMsSUFBVCxFQUFleEYsSUFBZixDQUFwQixFQUEwQyxRQUExQyxFQUFvRDNILEdBQXBELENBQVA7ZUFDWm9OLFFBQVF1RSxLQUFLdkUsSUFBTCxFQUFXLEtBQUsxRCxFQUFoQixDQUFSLElBQStCLE9BQU8wRCxLQUFLLEtBQUsxRCxFQUFWLENBQTdDO09BUHFCOzs7V0FXbEIsU0FBUzFJLEdBQVQsQ0FBYWhCLEdBQWIsRUFBa0I7WUFDakIsQ0FBQ3pCLFVBQVN5QixHQUFULENBQUwsRUFBb0IsT0FBTyxLQUFQO1lBQ2hCb04sT0FBT25CLFFBQVFqTSxHQUFSLENBQVg7WUFDSW9OLFNBQVMsSUFBYixFQUFtQixPQUFPbUUsb0JBQW9CcEUsb0JBQVMsSUFBVCxFQUFleEYsSUFBZixDQUFwQixFQUEwQzNHLEdBQTFDLENBQThDaEIsR0FBOUMsQ0FBUDtlQUNab04sUUFBUXVFLEtBQUt2RSxJQUFMLEVBQVcsS0FBSzFELEVBQWhCLENBQWY7O0tBZko7V0FrQk84QixDQUFQO0dBM0JhO09BNkJWLGFBQVVwSyxJQUFWLEVBQWdCcEIsR0FBaEIsRUFBcUJ0RyxLQUFyQixFQUE0QjtRQUMzQjBULE9BQU9uQixRQUFROUUsVUFBU25ILEdBQVQsQ0FBUixFQUF1QixJQUF2QixDQUFYO1FBQ0lvTixTQUFTLElBQWIsRUFBbUJtRSxvQkFBb0JuUSxJQUFwQixFQUEwQnFDLEdBQTFCLENBQThCekQsR0FBOUIsRUFBbUN0RyxLQUFuQyxFQUFuQixLQUNLMFQsS0FBS2hNLEtBQUtzSSxFQUFWLElBQWdCaFEsS0FBaEI7V0FDRTBILElBQVA7R0FqQ2E7V0FtQ05tUTtDQW5DWDs7O01DL0NJSyxPQUFPbFQsY0FBNEIsQ0FBNUIsQ0FBWDs7TUFRSW1ULFdBQVcsU0FBZjtNQUNJNUYsVUFBVUcsTUFBS0gsT0FBbkI7TUFDSUwsZUFBZWpOLE9BQU9pTixZQUExQjtNQUNJMkYsc0JBQXNCTyxnQkFBS0MsT0FBL0I7TUFDSUMsTUFBTSxFQUFWO01BQ0lDLFdBQUo7O01BRUlwRixVQUFVLFNBQVZBLE9BQVUsQ0FBVWhPLEdBQVYsRUFBZTtXQUNwQixTQUFTcVQsT0FBVCxHQUFtQjthQUNqQnJULElBQUksSUFBSixFQUFVckosVUFBVUksTUFBVixHQUFtQixDQUFuQixHQUF1QkosVUFBVSxDQUFWLENBQXZCLEdBQXNDaUcsU0FBaEQsQ0FBUDtLQURGO0dBREY7O01BTUloRyxVQUFVOztTQUVQLFNBQVNvSixHQUFULENBQWFtQixHQUFiLEVBQWtCO1VBQ2pCekIsVUFBU3lCLEdBQVQsQ0FBSixFQUFtQjtZQUNib04sT0FBT25CLFFBQVFqTSxHQUFSLENBQVg7WUFDSW9OLFNBQVMsSUFBYixFQUFtQixPQUFPbUUsb0JBQW9CcEUsb0JBQVMsSUFBVCxFQUFlMEUsUUFBZixDQUFwQixFQUE4Q2hULEdBQTlDLENBQWtEbUIsR0FBbEQsQ0FBUDtlQUNab04sT0FBT0EsS0FBSyxLQUFLMUQsRUFBVixDQUFQLEdBQXVCak8sU0FBOUI7O0tBTlE7O1NBVVAsU0FBU2dJLEdBQVQsQ0FBYXpELEdBQWIsRUFBa0J0RyxLQUFsQixFQUF5QjthQUNyQm9ZLGdCQUFLekssR0FBTCxDQUFTOEYsb0JBQVMsSUFBVCxFQUFlMEUsUUFBZixDQUFULEVBQW1DN1IsR0FBbkMsRUFBd0N0RyxLQUF4QyxDQUFQOztHQVhKOzs7TUFnQkl5WSxXQUFXeFUsY0FBQSxHQUFpQnNCLFlBQXlCNFMsUUFBekIsRUFBbUNoRixPQUFuQyxFQUE0Q3BYLE9BQTVDLEVBQXFEcWMsZUFBckQsRUFBMkQsSUFBM0QsRUFBaUUsSUFBakUsQ0FBaEM7OztNQUdJMUQsT0FBTSxZQUFZO1dBQVMsSUFBSStELFFBQUosR0FBZTFPLEdBQWYsQ0FBbUIsQ0FBQzlFLE9BQU95VCxNQUFQLElBQWlCelQsTUFBbEIsRUFBMEJxVCxHQUExQixDQUFuQixFQUFtRCxDQUFuRCxFQUFzRG5ULEdBQXRELENBQTBEbVQsR0FBMUQsS0FBa0UsQ0FBekU7R0FBcEIsQ0FBSixFQUF3RztrQkFDeEZGLGdCQUFLekQsY0FBTCxDQUFvQnhCLE9BQXBCLEVBQTZCZ0YsUUFBN0IsQ0FBZDtrQkFDT0ksWUFBWTNiLFNBQW5CLEVBQThCYixPQUE5QjtVQUNLNFcsSUFBTCxHQUFZLElBQVo7U0FDSyxDQUFDLFFBQUQsRUFBVyxLQUFYLEVBQWtCLEtBQWxCLEVBQXlCLEtBQXpCLENBQUwsRUFBc0MsVUFBVXJNLEdBQVYsRUFBZTtVQUMvQ3NELFFBQVE2TyxTQUFTN2IsU0FBckI7VUFDSWpCLFNBQVNpTyxNQUFNdEQsR0FBTixDQUFiO2dCQUNTc0QsS0FBVCxFQUFnQnRELEdBQWhCLEVBQXFCLFVBQVVsQixDQUFWLEVBQWF1QyxDQUFiLEVBQWdCOztZQUUvQjlDLFVBQVNPLENBQVQsS0FBZSxDQUFDOE0sYUFBYTlNLENBQWIsQ0FBcEIsRUFBcUM7Y0FDL0IsQ0FBQyxLQUFLNE4sRUFBVixFQUFjLEtBQUtBLEVBQUwsR0FBVSxJQUFJdUYsV0FBSixFQUFWO2NBQ1ZuTSxTQUFTLEtBQUs0RyxFQUFMLENBQVExTSxHQUFSLEVBQWFsQixDQUFiLEVBQWdCdUMsQ0FBaEIsQ0FBYjtpQkFDT3JCLE9BQU8sS0FBUCxHQUFlLElBQWYsR0FBc0I4RixNQUE3Qjs7U0FFQSxPQUFPelEsT0FBT3lCLElBQVAsQ0FBWSxJQUFaLEVBQWtCZ0ksQ0FBbEIsRUFBcUJ1QyxDQUFyQixDQUFQO09BUEo7S0FIRjs7OztBQzdDRjtBQUNBM0MsaUJBQWdDLFNBQWhDOztBQ0RBO0FBQ0FBLG1CQUFrQyxTQUFsQzs7QUNJQSxjQUFpQjJULE1BQTRCSCxPQUE3Qzs7QUNEQSxzQkFBaUIsd0JBQUEsQ0FBVW5TLE1BQVYsRUFBa0JvRixLQUFsQixFQUF5QnpMLEtBQXpCLEVBQWdDO01BQzNDeUwsU0FBU3BGLE1BQWIsRUFBcUJ1UyxVQUFnQnJTLENBQWhCLENBQWtCRixNQUFsQixFQUEwQm9GLEtBQTFCLEVBQWlDakYsY0FBVyxDQUFYLEVBQWN4RyxLQUFkLENBQWpDLEVBQXJCLEtBQ0txRyxPQUFPb0YsS0FBUCxJQUFnQnpMLEtBQWhCO0NBRlA7O0FDTUE4SCxRQUFRQSxRQUFRckMsQ0FBUixHQUFZcUMsUUFBUUksQ0FBUixHQUFZLENBQUNsRCxZQUEwQixVQUFVcVAsSUFBVixFQUFnQjs7Q0FBMUMsQ0FBakMsRUFBbUcsT0FBbkcsRUFBNEc7O1FBRXBHLFNBQVNvQixJQUFULENBQWNvRCxTQUFkLGlEQUF3RTtRQUN4RTlTLElBQUl1SSxVQUFTdUssU0FBVCxDQUFSO1FBQ0kvRyxJQUFJLE9BQU8sSUFBUCxJQUFlLFVBQWYsR0FBNEIsSUFBNUIsR0FBbUM5SCxLQUEzQztRQUNJcU4sT0FBT3ZiLFVBQVVJLE1BQXJCO1FBQ0k0YyxRQUFRekIsT0FBTyxDQUFQLEdBQVd2YixVQUFVLENBQVYsQ0FBWCxHQUEwQmlHLFNBQXRDO1FBQ0krVCxVQUFVZ0QsVUFBVS9XLFNBQXhCO1FBQ0kwSixRQUFRLENBQVo7UUFDSWdHLFNBQVNDLHVCQUFVM0wsQ0FBVixDQUFiO1FBQ0k3SixNQUFKLEVBQVlrUSxNQUFaLEVBQW9Ca0UsSUFBcEIsRUFBMEJhLFFBQTFCO1FBQ0kyRSxPQUFKLEVBQWFnRCxRQUFRalEsS0FBSWlRLEtBQUosRUFBV3pCLE9BQU8sQ0FBUCxHQUFXdmIsVUFBVSxDQUFWLENBQVgsR0FBMEJpRyxTQUFyQyxFQUFnRCxDQUFoRCxDQUFSOztRQUVUMFAsVUFBVTFQLFNBQVYsSUFBdUIsRUFBRStQLEtBQUs5SCxLQUFMLElBQWMySCxhQUFZRixNQUFaLENBQWhCLENBQTNCLEVBQWlFO1dBQzFETixXQUFXTSxPQUFPclUsSUFBUCxDQUFZMkksQ0FBWixDQUFYLEVBQTJCcUcsU0FBUyxJQUFJMEYsQ0FBSixFQUF6QyxFQUFrRCxDQUFDLENBQUN4QixPQUFPYSxTQUFTakQsSUFBVCxFQUFSLEVBQXlCZ0MsSUFBNUUsRUFBa0Z6RSxPQUFsRixFQUEyRjt3QkFDMUVXLE1BQWYsRUFBdUJYLEtBQXZCLEVBQThCcUssVUFBVTFZLFVBQUsrVCxRQUFMLEVBQWUySCxLQUFmLEVBQXNCLENBQUN4SSxLQUFLdFEsS0FBTixFQUFheUwsS0FBYixDQUF0QixFQUEyQyxJQUEzQyxDQUFWLEdBQTZENkUsS0FBS3RRLEtBQWhHOztLQUZKLE1BSU87ZUFDSThMLFVBQVMvRixFQUFFN0osTUFBWCxDQUFUO1dBQ0trUSxTQUFTLElBQUkwRixDQUFKLENBQU01VixNQUFOLENBQWQsRUFBNkJBLFNBQVN1UCxLQUF0QyxFQUE2Q0EsT0FBN0MsRUFBc0Q7d0JBQ3JDVyxNQUFmLEVBQXVCWCxLQUF2QixFQUE4QnFLLFVBQVVnRCxNQUFNL1MsRUFBRTBGLEtBQUYsQ0FBTixFQUFnQkEsS0FBaEIsQ0FBVixHQUFtQzFGLEVBQUUwRixLQUFGLENBQWpFOzs7V0FHR3ZQLE1BQVAsR0FBZ0J1UCxLQUFoQjtXQUNPVyxNQUFQOztDQXhCSjs7QUNSQSxhQUFpQjVHLE1BQStCd0UsS0FBL0IsQ0FBcUN5TCxJQUF0RDs7QUNGQSxJQUFNc0Qsa0JBQWtCLElBQUl6RCxHQUFKLENBQVEsQ0FDOUIsZ0JBRDhCLEVBRTlCLGVBRjhCLEVBRzlCLFdBSDhCLEVBSTlCLGVBSjhCLEVBSzlCLGVBTDhCLEVBTTlCLGtCQU44QixFQU85QixnQkFQOEIsRUFROUIsZUFSOEIsQ0FBUixDQUF4Qjs7Ozs7O0FBZUEsQUFBTyxTQUFTMEQsd0JBQVQsQ0FBa0NDLFNBQWxDLEVBQTZDO01BQzVDQyxXQUFXSCxnQkFBZ0J6UixHQUFoQixDQUFvQjJSLFNBQXBCLENBQWpCO01BQ01FLFlBQVksbUNBQW1DcGIsSUFBbkMsQ0FBd0NrYixTQUF4QyxDQUFsQjtTQUNPLENBQUNDLFFBQUQsSUFBYUMsU0FBcEI7Ozs7Ozs7O0FBUUYsQUFBTyxTQUFTQyxXQUFULENBQXFCQyxJQUFyQixFQUEyQjs7TUFFMUJDLGNBQWNELEtBQUtELFdBQXpCO01BQ0lFLGdCQUFnQnZYLFNBQXBCLEVBQStCO1dBQ3RCdVgsV0FBUDs7OztNQUlFQyxVQUFVRixJQUFkO1NBQ09FLFdBQVcsRUFBRUEsUUFBUUMscUJBQVIsSUFBaUNELG1CQUFtQkUsUUFBdEQsQ0FBbEIsRUFBbUY7Y0FDdkVGLFFBQVF6WSxVQUFSLEtBQXVCeEIsT0FBT29hLFVBQVAsSUFBcUJILG1CQUFtQkcsVUFBeEMsR0FBcURILFFBQVFJLElBQTdELEdBQW9FNVgsU0FBM0YsQ0FBVjs7U0FFSyxDQUFDLEVBQUV3WCxZQUFZQSxRQUFRQyxxQkFBUixJQUFpQ0QsbUJBQW1CRSxRQUFoRSxDQUFGLENBQVI7Ozs7Ozs7O0FBUUYsU0FBU0csNEJBQVQsQ0FBc0NDLElBQXRDLEVBQTRDQyxLQUE1QyxFQUFtRDtNQUM3Q1QsT0FBT1MsS0FBWDtTQUNPVCxRQUFRQSxTQUFTUSxJQUFqQixJQUF5QixDQUFDUixLQUFLVSxXQUF0QyxFQUFtRDtXQUMxQ1YsS0FBS3ZZLFVBQVo7O1NBRU0sQ0FBQ3VZLElBQUQsSUFBU0EsU0FBU1EsSUFBbkIsR0FBMkIsSUFBM0IsR0FBa0NSLEtBQUtVLFdBQTlDOzs7Ozs7OztBQVFGLFNBQVNDLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCQyxLQUF4QixFQUErQjtTQUN0QkEsTUFBTUcsVUFBTixHQUFtQkgsTUFBTUcsVUFBekIsR0FBc0NMLDZCQUE2QkMsSUFBN0IsRUFBbUNDLEtBQW5DLENBQTdDOzs7Ozs7OztBQVFGLEFBQU8sU0FBU0ksMEJBQVQsQ0FBb0NMLElBQXBDLEVBQTBDN2MsUUFBMUMsRUFBZ0Y7TUFBNUJtZCxjQUE0Qix1RUFBWCxJQUFJN0UsR0FBSixFQUFXOztNQUNqRitELE9BQU9RLElBQVg7U0FDT1IsSUFBUCxFQUFhO1FBQ1BBLEtBQUt6WSxRQUFMLEtBQWtCekQsS0FBS2lkLFlBQTNCLEVBQXlDO1VBQ2pDQyxpQ0FBa0NoQixJQUF4Qzs7ZUFFU2dCLE9BQVQ7O1VBRU1wQixZQUFZb0IsUUFBUXBCLFNBQTFCO1VBQ0lBLGNBQWMsTUFBZCxJQUF3Qm9CLFFBQVFDLFlBQVIsQ0FBcUIsS0FBckIsTUFBZ0MsUUFBNUQsRUFBc0U7OztZQUc5REMsaUNBQW1DRixRQUFRRyxNQUFqRDtZQUNJRCxzQkFBc0JwZCxJQUF0QixJQUE4QixDQUFDZ2QsZUFBZTdTLEdBQWYsQ0FBbUJpVCxVQUFuQixDQUFuQyxFQUFtRTs7eUJBRWxEOUYsR0FBZixDQUFtQjhGLFVBQW5COztlQUVLLElBQUlFLFFBQVFGLFdBQVdOLFVBQTVCLEVBQXdDUSxLQUF4QyxFQUErQ0EsUUFBUUEsTUFBTVYsV0FBN0QsRUFBMEU7dUNBQzdDVSxLQUEzQixFQUFrQ3pkLFFBQWxDLEVBQTRDbWQsY0FBNUM7Ozs7Ozs7ZUFPR1AsNkJBQTZCQyxJQUE3QixFQUFtQ1EsT0FBbkMsQ0FBUDs7T0FoQkYsTUFrQk8sSUFBSXBCLGNBQWMsVUFBbEIsRUFBOEI7Ozs7O2VBSzVCVyw2QkFBNkJDLElBQTdCLEVBQW1DUSxPQUFuQyxDQUFQOzs7OztVQUtJSyxhQUFhTCxRQUFRTSxlQUEzQjtVQUNJRCxVQUFKLEVBQWdCO2FBQ1QsSUFBSUQsU0FBUUMsV0FBV1QsVUFBNUIsRUFBd0NRLE1BQXhDLEVBQStDQSxTQUFRQSxPQUFNVixXQUE3RCxFQUEwRTtxQ0FDN0NVLE1BQTNCLEVBQWtDemQsUUFBbEMsRUFBNENtZCxjQUE1Qzs7Ozs7V0FLQ0gsU0FBU0gsSUFBVCxFQUFlUixJQUFmLENBQVA7Ozs7Ozs7Ozs7Ozs7QUFhSixBQUFPLFNBQVN1QixvQkFBVCxDQUE4QkMsV0FBOUIsRUFBMkM5UyxJQUEzQyxFQUFpRC9ILEtBQWpELEVBQXdEO2NBQ2pEK0gsSUFBWixJQUFvQi9ILEtBQXBCOzs7QUMvSEY7OztBQUdBLElBQU04YSxxQkFBcUI7VUFDakIsQ0FEaUI7VUFFakI7Q0FGVjs7SUNBcUJDO29DQUNMOzs7O1NBRVBDLHNCQUFMLEdBQThCLElBQUk1RSxHQUFKLEVBQTlCOzs7U0FHSzZFLHdCQUFMLEdBQWdDLElBQUk3RSxHQUFKLEVBQWhDOzs7U0FHSzhFLFFBQUwsR0FBZ0IsRUFBaEI7OztTQUdLQyxXQUFMLEdBQW1CLEtBQW5COzs7Ozs7Ozs7OztrQ0FPWWxDLFdBQVdtQyxZQUFZO1dBQzlCSixzQkFBTCxDQUE0QmpSLEdBQTVCLENBQWdDa1AsU0FBaEMsRUFBMkNtQyxVQUEzQztXQUNLSCx3QkFBTCxDQUE4QmxSLEdBQTlCLENBQWtDcVIsV0FBVzdNLFdBQTdDLEVBQTBENk0sVUFBMUQ7Ozs7Ozs7Ozs7MENBT29CbkMsV0FBVzthQUN4QixLQUFLK0Isc0JBQUwsQ0FBNEI3VixHQUE1QixDQUFnQzhULFNBQWhDLENBQVA7Ozs7Ozs7Ozs7NENBT3NCMUssYUFBYTthQUM1QixLQUFLME0sd0JBQUwsQ0FBOEI5VixHQUE5QixDQUFrQ29KLFdBQWxDLENBQVA7Ozs7Ozs7Ozs2QkFNTzhNLFVBQVU7V0FDWkYsV0FBTCxHQUFtQixJQUFuQjtXQUNLRCxRQUFMLENBQWM5USxJQUFkLENBQW1CaVIsUUFBbkI7Ozs7Ozs7Ozs4QkFNUWhDLE1BQU07OztVQUNWLENBQUMsS0FBSzhCLFdBQVYsRUFBdUI7O2dDQUV2QixDQUFxQzlCLElBQXJDLEVBQTJDO2VBQVcsTUFBS2lDLEtBQUwsQ0FBV2pCLE9BQVgsQ0FBWDtPQUEzQzs7Ozs7Ozs7OzBCQU1JaEIsTUFBTTtVQUNOLENBQUMsS0FBSzhCLFdBQVYsRUFBdUI7O1VBRW5COUIsS0FBS2tDLFlBQVQsRUFBdUI7V0FDbEJBLFlBQUwsR0FBb0IsSUFBcEI7O1dBRUssSUFBSXZmLElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLa2YsUUFBTCxDQUFjaGYsTUFBbEMsRUFBMENGLEdBQTFDLEVBQStDO2FBQ3hDa2YsUUFBTCxDQUFjbGYsQ0FBZCxFQUFpQnFkLElBQWpCOzs7Ozs7Ozs7O2dDQU9RUSxNQUFNO1VBQ1YyQixXQUFXLEVBQWpCOztnQ0FFQSxDQUFxQzNCLElBQXJDLEVBQTJDO2VBQVcyQixTQUFTcFIsSUFBVCxDQUFjaVEsT0FBZCxDQUFYO09BQTNDOztXQUVLLElBQUlyZSxJQUFJLENBQWIsRUFBZ0JBLElBQUl3ZixTQUFTdGYsTUFBN0IsRUFBcUNGLEdBQXJDLEVBQTBDO1lBQ2xDcWUsVUFBVW1CLFNBQVN4ZixDQUFULENBQWhCO1lBQ0lxZSxRQUFRb0IsVUFBUixLQUF1QkMsbUJBQVFDLE1BQW5DLEVBQTJDO2NBQ3JDQyxXQUFBLENBQXNCdkIsT0FBdEIsQ0FBSixFQUFvQztpQkFDN0J3QixpQkFBTCxDQUF1QnhCLE9BQXZCOztTQUZKLE1BSU87ZUFDQXlCLGNBQUwsQ0FBb0J6QixPQUFwQjs7Ozs7Ozs7Ozs7bUNBUVNSLE1BQU07VUFDYjJCLFdBQVcsRUFBakI7O2dDQUVBLENBQXFDM0IsSUFBckMsRUFBMkM7ZUFBVzJCLFNBQVNwUixJQUFULENBQWNpUSxPQUFkLENBQVg7T0FBM0M7O1dBRUssSUFBSXJlLElBQUksQ0FBYixFQUFnQkEsSUFBSXdmLFNBQVN0ZixNQUE3QixFQUFxQ0YsR0FBckMsRUFBMEM7WUFDbENxZSxVQUFVbUIsU0FBU3hmLENBQVQsQ0FBaEI7WUFDSXFlLFFBQVFvQixVQUFSLEtBQXVCQyxtQkFBUUMsTUFBbkMsRUFBMkM7ZUFDcENJLG9CQUFMLENBQTBCMUIsT0FBMUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dDQW9FY1IsTUFBa0M7OztVQUE1Qk0sY0FBNEIsdUVBQVgsSUFBSTdFLEdBQUosRUFBVzs7VUFDOUNrRyxXQUFXLEVBQWpCOztVQUVNUSxpQkFBaUIsU0FBakJBLGNBQWlCLFVBQVc7WUFDNUIzQixRQUFRcEIsU0FBUixLQUFzQixNQUF0QixJQUFnQ29CLFFBQVFDLFlBQVIsQ0FBcUIsS0FBckIsTUFBZ0MsUUFBcEUsRUFBOEU7OztjQUd0RUMsaUNBQW1DRixRQUFRRyxNQUFqRDs7Y0FFSUQsc0JBQXNCcGQsSUFBdEIsSUFBOEJvZCxXQUFXMEIsVUFBWCxLQUEwQixVQUE1RCxFQUF3RTt1QkFDM0R6QyxxQkFBWCxHQUFtQyxJQUFuQzs7O3VCQUdXMEMsZ0JBQVgsR0FBOEIsSUFBOUI7V0FKRixNQUtPOzs7b0JBR0c5ZixnQkFBUixDQUF5QixNQUF6QixFQUFpQyxZQUFNO2tCQUMvQm1lLGlDQUFtQ0YsUUFBUUcsTUFBakQ7O2tCQUVJRCxXQUFXNEIsd0JBQWYsRUFBeUM7eUJBQzlCQSx3QkFBWCxHQUFzQyxJQUF0Qzs7eUJBRVczQyxxQkFBWCxHQUFtQyxJQUFuQzs7O3lCQUdXMEMsZ0JBQVgsR0FBOEIsSUFBOUI7Ozs7Ozs7NkJBUWVFLE1BQWYsQ0FBc0I3QixVQUF0Qjs7cUJBRUs4QixtQkFBTCxDQUF5QjlCLFVBQXpCLEVBQXFDSixjQUFyQzthQW5CRjs7U0FiSixNQW1DTzttQkFDSS9QLElBQVQsQ0FBY2lRLE9BQWQ7O09BckNKOzs7O2dDQTJDQSxDQUFxQ1IsSUFBckMsRUFBMkNtQyxjQUEzQyxFQUEyRDdCLGNBQTNEOztVQUVJLEtBQUtnQixXQUFULEVBQXNCO2FBQ2YsSUFBSW5mLElBQUksQ0FBYixFQUFnQkEsSUFBSXdmLFNBQVN0ZixNQUE3QixFQUFxQ0YsR0FBckMsRUFBMEM7ZUFDbkNzZixLQUFMLENBQVdFLFNBQVN4ZixDQUFULENBQVg7Ozs7V0FJQyxJQUFJQSxLQUFJLENBQWIsRUFBZ0JBLEtBQUl3ZixTQUFTdGYsTUFBN0IsRUFBcUNGLElBQXJDLEVBQTBDO2FBQ25DOGYsY0FBTCxDQUFvQk4sU0FBU3hmLEVBQVQsQ0FBcEI7Ozs7Ozs7Ozs7bUNBT1dxZSxTQUFTO1VBQ2hCaUMsZUFBZWpDLFFBQVFvQixVQUE3QjtVQUNJYSxpQkFBaUJ2YSxTQUFyQixFQUFnQzs7VUFFMUJxWixhQUFhLEtBQUttQixxQkFBTCxDQUEyQmxDLFFBQVFwQixTQUFuQyxDQUFuQjtVQUNJLENBQUNtQyxVQUFMLEVBQWlCOztpQkFFTm9CLGlCQUFYLENBQTZCcFMsSUFBN0IsQ0FBa0NpUSxPQUFsQzs7VUFFTTlMLGNBQWM2TSxXQUFXN00sV0FBL0I7VUFDSTtZQUNFO2NBQ0VuQyxTQUFTLElBQUttQyxXQUFMLEVBQWI7Y0FDSW5DLFdBQVdpTyxPQUFmLEVBQXdCO2tCQUNoQixJQUFJb0MsS0FBSixDQUFVLDRFQUFWLENBQU47O1NBSEosU0FLVTtxQkFDR0QsaUJBQVgsQ0FBNkJFLEdBQTdCOztPQVBKLENBU0UsT0FBTzNYLENBQVAsRUFBVTtnQkFDRjBXLFVBQVIsR0FBcUJDLG1CQUFRaUIsTUFBN0I7Y0FDTTVYLENBQU47OztjQUdNMFcsVUFBUixHQUFxQkMsbUJBQVFDLE1BQTdCO2NBQ1FpQixlQUFSLEdBQTBCeEIsVUFBMUI7O1VBRUlBLFdBQVd5Qix3QkFBZixFQUF5QztZQUNqQ0MscUJBQXFCMUIsV0FBVzBCLGtCQUF0QzthQUNLLElBQUk5Z0IsSUFBSSxDQUFiLEVBQWdCQSxJQUFJOGdCLG1CQUFtQjVnQixNQUF2QyxFQUErQ0YsR0FBL0MsRUFBb0Q7Y0FDNUMrTCxPQUFPK1UsbUJBQW1COWdCLENBQW5CLENBQWI7Y0FDTWdFLFFBQVFxYSxRQUFRQyxZQUFSLENBQXFCdlMsSUFBckIsQ0FBZDtjQUNJL0gsVUFBVSxJQUFkLEVBQW9CO2lCQUNiNmMsd0JBQUwsQ0FBOEJ4QyxPQUE5QixFQUF1Q3RTLElBQXZDLEVBQTZDLElBQTdDLEVBQW1EL0gsS0FBbkQsRUFBMEQsSUFBMUQ7Ozs7O1VBS0Y0YixXQUFBLENBQXNCdkIsT0FBdEIsQ0FBSixFQUFvQzthQUM3QndCLGlCQUFMLENBQXVCeEIsT0FBdkI7Ozs7Ozs7Ozs7c0NBT2NBLFNBQVM7VUFDbkJlLGFBQWFmLFFBQVF1QyxlQUEzQjtVQUNJeEIsV0FBV1MsaUJBQWYsRUFBa0M7bUJBQ3JCQSxpQkFBWCxDQUE2QnplLElBQTdCLENBQWtDaWQsT0FBbEM7OztjQUdNMEMsOEJBQVIsR0FBeUMsSUFBekM7Ozs7Ozs7Ozt5Q0FNbUIxQyxTQUFTO1VBQ3hCLENBQUNBLFFBQVEwQyw4QkFBYixFQUE2QzthQUN0Q2xCLGlCQUFMLENBQXVCeEIsT0FBdkI7OztVQUdJZSxhQUFhZixRQUFRdUMsZUFBM0I7VUFDSXhCLFdBQVdXLG9CQUFmLEVBQXFDO21CQUN4QkEsb0JBQVgsQ0FBZ0MzZSxJQUFoQyxDQUFxQ2lkLE9BQXJDOzs7Y0FHTTBDLDhCQUFSLEdBQXlDaGIsU0FBekM7Ozs7Ozs7Ozs7Ozs7NkNBVXVCc1ksU0FBU3RTLE1BQU1pVixVQUFVQyxVQUFVQyxXQUFXO1VBQy9EOUIsYUFBYWYsUUFBUXVDLGVBQTNCO1VBRUV4QixXQUFXeUIsd0JBQVgsSUFDQXpCLFdBQVcwQixrQkFBWCxDQUE4QmpmLE9BQTlCLENBQXNDa0ssSUFBdEMsSUFBOEMsQ0FBQyxDQUZqRCxFQUdFO21CQUNXOFUsd0JBQVgsQ0FBb0N6ZixJQUFwQyxDQUF5Q2lkLE9BQXpDLEVBQWtEdFMsSUFBbEQsRUFBd0RpVixRQUF4RCxFQUFrRUMsUUFBbEUsRUFBNEVDLFNBQTVFOzs7Ozs7O0lDN1RlQzt3Q0FDUEMsU0FBWixFQUF1QkMsR0FBdkIsRUFBNEI7Ozs7OztTQUlyQkMsVUFBTCxHQUFrQkYsU0FBbEI7Ozs7O1NBS0tHLFNBQUwsR0FBaUJGLEdBQWpCOzs7OztTQUtLRyxTQUFMLEdBQWlCemIsU0FBakI7Ozs7U0FLS3ViLFVBQUwsQ0FBZ0JqQixtQkFBaEIsQ0FBb0MsS0FBS2tCLFNBQXpDOztRQUVJLEtBQUtBLFNBQUwsQ0FBZXRCLFVBQWYsS0FBOEIsU0FBbEMsRUFBNkM7V0FDdEN1QixTQUFMLEdBQWlCLElBQUlDLGdCQUFKLENBQXFCLEtBQUtDLGdCQUFMLENBQXNCaGlCLElBQXRCLENBQTJCLElBQTNCLENBQXJCLENBQWpCOzs7Ozs7V0FNSzhoQixTQUFMLENBQWVHLE9BQWYsQ0FBdUIsS0FBS0osU0FBNUIsRUFBdUM7bUJBQzFCLElBRDBCO2lCQUU1QjtPQUZYOzs7Ozs7aUNBT1M7VUFDUCxLQUFLQyxTQUFULEVBQW9CO2FBQ2JBLFNBQUwsQ0FBZUksVUFBZjs7Ozs7Ozs7OztxQ0FPYUMsV0FBVzs7OztVQUlwQjVCLGFBQWEsS0FBS3NCLFNBQUwsQ0FBZXRCLFVBQWxDO1VBQ0lBLGVBQWUsYUFBZixJQUFnQ0EsZUFBZSxVQUFuRCxFQUErRDthQUN4RDJCLFVBQUw7OztXQUdHLElBQUk1aEIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJNmhCLFVBQVUzaEIsTUFBOUIsRUFBc0NGLEdBQXRDLEVBQTJDO1lBQ25DOGhCLGFBQWFELFVBQVU3aEIsQ0FBVixFQUFhOGhCLFVBQWhDO2FBQ0ssSUFBSXJHLElBQUksQ0FBYixFQUFnQkEsSUFBSXFHLFdBQVc1aEIsTUFBL0IsRUFBdUN1YixHQUF2QyxFQUE0QztjQUNwQzRCLE9BQU95RSxXQUFXckcsQ0FBWCxDQUFiO2VBQ0s2RixVQUFMLENBQWdCakIsbUJBQWhCLENBQW9DaEQsSUFBcEM7Ozs7Ozs7O0FDNURSOzs7SUFHcUIwRTtzQkFDTDs7Ozs7Ozs7O1NBS1BDLE1BQUwsR0FBY2pjLFNBQWQ7Ozs7OztTQU1La2MsUUFBTCxHQUFnQmxjLFNBQWhCOzs7Ozs7U0FNS21jLFFBQUwsR0FBZ0IsSUFBSUMsT0FBSixDQUFZLG1CQUFXO1lBQ2hDRixRQUFMLEdBQWdCRyxPQUFoQjs7VUFFSSxNQUFLSixNQUFULEVBQWlCO2dCQUNQLE1BQUtBLE1BQWI7O0tBSlksQ0FBaEI7Ozs7Ozs7Ozs7NEJBWU1oZSxPQUFPO1VBQ1QsS0FBS2dlLE1BQVQsRUFBaUI7Y0FDVCxJQUFJdkIsS0FBSixDQUFVLG1CQUFWLENBQU47OztXQUdHdUIsTUFBTCxHQUFjaGUsS0FBZDs7VUFFSSxLQUFLaWUsUUFBVCxFQUFtQjthQUNaQSxRQUFMLENBQWNqZSxLQUFkOzs7Ozs7Ozs7O2dDQU9RO2FBQ0gsS0FBS2tlLFFBQVo7Ozs7OztBQzVDSjs7OztJQUdxQkc7Ozs7O2lDQUtQakIsU0FBWixFQUF1Qjs7Ozs7OztTQUtoQmtCLDJCQUFMLEdBQW1DLEtBQW5DOzs7Ozs7U0FNS2hCLFVBQUwsR0FBa0JGLFNBQWxCOzs7Ozs7U0FNS21CLG9CQUFMLEdBQTRCLElBQUluSSxHQUFKLEVBQTVCOzs7Ozs7O1NBT0tvSSxjQUFMLEdBQXNCO2FBQU05WSxJQUFOO0tBQXRCOzs7Ozs7U0FNSytZLGFBQUwsR0FBcUIsS0FBckI7Ozs7OztTQU1LQyxvQkFBTCxHQUE0QixFQUE1Qjs7Ozs7O1NBTUtDLDZCQUFMLEdBQXFDLElBQUl4Qiw0QkFBSixDQUFpQ0MsU0FBakMsRUFBNENyZSxRQUE1QyxDQUFyQzs7Ozs7Ozs7Ozs7MkJBT0trYSxXQUFXMUssYUFBYTs7O1VBQ3pCLEVBQUVBLHVCQUF1QmhLLFFBQXpCLENBQUosRUFBd0M7Y0FDaEMsSUFBSU8sU0FBSixDQUFjLGdEQUFkLENBQU47OztVQUdFLENBQUM4Vyx3QkFBQSxDQUFtQzNDLFNBQW5DLENBQUwsRUFBb0Q7Y0FDNUMsSUFBSTJGLFdBQUoseUJBQXFDM0YsU0FBckMsc0JBQU47OztVQUdFLEtBQUtxRSxVQUFMLENBQWdCZixxQkFBaEIsQ0FBc0N0RCxTQUF0QyxDQUFKLEVBQXNEO2NBQzlDLElBQUl3RCxLQUFKLG1DQUF5Q3hELFNBQXpDLGtDQUFOOzs7VUFHRSxLQUFLcUYsMkJBQVQsRUFBc0M7Y0FDOUIsSUFBSTdCLEtBQUosQ0FBVSw0Q0FBVixDQUFOOztXQUVHNkIsMkJBQUwsR0FBbUMsSUFBbkM7O1VBRUl6QywwQkFBSjtVQUNJRSw2QkFBSjtVQUNJOEMsd0JBQUo7VUFDSWhDLGlDQUFKO1VBQ0lDLDJCQUFKO1VBQ0k7WUFPT2dDLFdBUFAsR0FPRixTQUFTQSxXQUFULENBQXFCL1csSUFBckIsRUFBMkI7Y0FDbkJnWCxnQkFBZ0JuaUIsVUFBVW1MLElBQVYsQ0FBdEI7Y0FDSWdYLGtCQUFrQmhkLFNBQWxCLElBQStCLEVBQUVnZCx5QkFBeUJ4YSxRQUEzQixDQUFuQyxFQUF5RTtrQkFDakUsSUFBSWtZLEtBQUosWUFBa0IxVSxJQUFsQixxQ0FBTjs7aUJBRUtnWCxhQUFQO1NBWkE7OztZQUVJbmlCLFlBQVkyUixZQUFZM1IsU0FBOUI7WUFDSSxFQUFFQSxxQkFBcUJxSSxNQUF2QixDQUFKLEVBQW9DO2dCQUM1QixJQUFJSCxTQUFKLENBQWMsK0RBQWQsQ0FBTjs7OzRCQVdrQmdhLFlBQVksbUJBQVosQ0FBcEI7K0JBQ3VCQSxZQUFZLHNCQUFaLENBQXZCOzBCQUNrQkEsWUFBWSxpQkFBWixDQUFsQjttQ0FDMkJBLFlBQVksMEJBQVosQ0FBM0I7NkJBQ3FCdlEsWUFBWSxvQkFBWixLQUFxQyxFQUExRDtPQW5CRixDQW9CRSxPQUFPeEosQ0FBUCxFQUFVOztPQXBCWixTQXNCVTthQUNIdVosMkJBQUwsR0FBbUMsS0FBbkM7OztVQUdJbEQsYUFBYTs0QkFBQTtnQ0FBQTs0Q0FBQTtrREFBQTt3Q0FBQTswREFBQTs4Q0FBQTsyQkFRRTtPQVJyQjs7V0FXS2tDLFVBQUwsQ0FBZ0IwQixhQUFoQixDQUE4Qi9GLFNBQTlCLEVBQXlDbUMsVUFBekM7O1dBRUtzRCxvQkFBTCxDQUEwQnRVLElBQTFCLENBQStCNk8sU0FBL0I7Ozs7VUFJSSxDQUFDLEtBQUt3RixhQUFWLEVBQXlCO2FBQ2xCQSxhQUFMLEdBQXFCLElBQXJCO2FBQ0tELGNBQUwsQ0FBb0I7aUJBQU0sTUFBS1MsTUFBTCxFQUFOO1NBQXBCOzs7Ozs2QkFJSzs7OztVQUlILEtBQUtSLGFBQUwsS0FBdUIsS0FBM0IsRUFBa0M7O1dBRTdCQSxhQUFMLEdBQXFCLEtBQXJCO1dBQ0tuQixVQUFMLENBQWdCakIsbUJBQWhCLENBQW9DdGQsUUFBcEM7O2FBRU8sS0FBSzJmLG9CQUFMLENBQTBCeGlCLE1BQTFCLEdBQW1DLENBQTFDLEVBQTZDO1lBQ3JDK2MsWUFBWSxLQUFLeUYsb0JBQUwsQ0FBMEJRLEtBQTFCLEVBQWxCO1lBQ01DLFdBQVcsS0FBS1osb0JBQUwsQ0FBMEJwWixHQUExQixDQUE4QjhULFNBQTlCLENBQWpCO1lBQ0lrRyxRQUFKLEVBQWM7bUJBQ0hmLE9BQVQsQ0FBaUJyYyxTQUFqQjs7Ozs7Ozs7Ozs7OzJCQVNGa1gsV0FBVztVQUNQbUMsYUFBYSxLQUFLa0MsVUFBTCxDQUFnQmYscUJBQWhCLENBQXNDdEQsU0FBdEMsQ0FBbkI7VUFDSW1DLFVBQUosRUFBZ0I7ZUFDUEEsV0FBVzdNLFdBQWxCOzs7YUFHS3hNLFNBQVA7Ozs7Ozs7Ozs7Z0NBT1VrWCxXQUFXO1VBQ2pCLENBQUMyQyx3QkFBQSxDQUFtQzNDLFNBQW5DLENBQUwsRUFBb0Q7ZUFDM0NrRixRQUFRaUIsTUFBUixDQUFlLElBQUlSLFdBQUosUUFBb0IzRixTQUFwQiw0Q0FBZixDQUFQOzs7VUFHSW9HLFFBQVEsS0FBS2Qsb0JBQUwsQ0FBMEJwWixHQUExQixDQUE4QjhULFNBQTlCLENBQWQ7VUFDSW9HLEtBQUosRUFBVztlQUNGQSxNQUFNQyxTQUFOLEVBQVA7OztVQUdJSCxXQUFXLElBQUlwQixRQUFKLEVBQWpCO1dBQ0tRLG9CQUFMLENBQTBCeFUsR0FBMUIsQ0FBOEJrUCxTQUE5QixFQUF5Q2tHLFFBQXpDOztVQUVNL0QsYUFBYSxLQUFLa0MsVUFBTCxDQUFnQmYscUJBQWhCLENBQXNDdEQsU0FBdEMsQ0FBbkI7Ozs7VUFJSW1DLGNBQWMsS0FBS3NELG9CQUFMLENBQTBCN2dCLE9BQTFCLENBQWtDb2IsU0FBbEMsTUFBaUQsQ0FBQyxDQUFwRSxFQUF1RTtpQkFDNURtRixPQUFULENBQWlCcmMsU0FBakI7OzthQUdLb2QsU0FBU0csU0FBVCxFQUFQOzs7OzhDQUd3QkMsT0FBTztXQUMxQlosNkJBQUwsQ0FBbUNmLFVBQW5DO1VBQ000QixRQUFRLEtBQUtoQixjQUFuQjtXQUNLQSxjQUFMLEdBQXNCO2VBQVNlLE1BQU07aUJBQU1DLE1BQU1DLEtBQU4sQ0FBTjtTQUFOLENBQVQ7T0FBdEI7Ozs7OztBQUlKLEFBQ0FuZ0IsT0FBTyx1QkFBUCxJQUFrQytlLHFCQUFsQztBQUNBQSxzQkFBc0J6aEIsU0FBdEIsQ0FBZ0MsUUFBaEMsSUFBNEN5aEIsc0JBQXNCemhCLFNBQXRCLENBQWdDa0gsTUFBNUU7QUFDQXVhLHNCQUFzQnpoQixTQUF0QixDQUFnQyxLQUFoQyxJQUF5Q3loQixzQkFBc0J6aEIsU0FBdEIsQ0FBZ0N1SSxHQUF6RTtBQUNBa1osc0JBQXNCemhCLFNBQXRCLENBQWdDLGFBQWhDLElBQWlEeWhCLHNCQUFzQnpoQixTQUF0QixDQUFnQzhpQixXQUFqRjtBQUNBckIsc0JBQXNCemhCLFNBQXRCLENBQWdDLDJCQUFoQyxJQUErRHloQixzQkFBc0J6aEIsU0FBdEIsQ0FBZ0MraUIseUJBQS9GOztBQzdNQSxhQUFlOzBCQUNXcmdCLE9BQU9tYSxRQUFQLENBQWdCN2MsU0FBaEIsQ0FBMEIwSSxhQURyQzs0QkFFYWhHLE9BQU9tYSxRQUFQLENBQWdCN2MsU0FBaEIsQ0FBMEJnakIsZUFGdkM7dUJBR1F0Z0IsT0FBT21hLFFBQVAsQ0FBZ0I3YyxTQUFoQixDQUEwQjJkLFVBSGxDO29CQUlLamIsT0FBT21hLFFBQVAsQ0FBZ0I3YyxTQUFoQixDQUEwQixTQUExQixDQUpMO21CQUtJMEMsT0FBT21hLFFBQVAsQ0FBZ0I3YyxTQUFoQixDQUEwQixRQUExQixDQUxKO2tCQU1HMEMsT0FBT25DLElBQVAsQ0FBWVAsU0FBWixDQUFzQmlqQixTQU56QjtvQkFPS3ZnQixPQUFPbkMsSUFBUCxDQUFZUCxTQUFaLENBQXNCc1EsV0FQM0I7cUJBUU01TixPQUFPbkMsSUFBUCxDQUFZUCxTQUFaLENBQXNCa2pCLFlBUjVCO29CQVNLeGdCLE9BQU9uQyxJQUFQLENBQVlQLFNBQVosQ0FBc0JtakIsV0FUM0I7cUJBVU16Z0IsT0FBT25DLElBQVAsQ0FBWVAsU0FBWixDQUFzQm9qQixZQVY1QjtvQkFXSy9hLE9BQU91RSx3QkFBUCxDQUFnQ2xLLE9BQU9uQyxJQUFQLENBQVlQLFNBQTVDLEVBQXVELGFBQXZELENBWEw7d0JBWVMwQyxPQUFPMmdCLE9BQVAsQ0FBZXJqQixTQUFmLENBQXlCLGNBQXpCLENBWlQ7cUJBYU1xSSxPQUFPdUUsd0JBQVAsQ0FBZ0NsSyxPQUFPMmdCLE9BQVAsQ0FBZXJqQixTQUEvQyxFQUEwRCxXQUExRCxDQWJOO3dCQWNTMEMsT0FBTzJnQixPQUFQLENBQWVyakIsU0FBZixDQUF5QjBkLFlBZGxDO3dCQWVTaGIsT0FBTzJnQixPQUFQLENBQWVyakIsU0FBZixDQUF5QnNqQixZQWZsQzsyQkFnQlk1Z0IsT0FBTzJnQixPQUFQLENBQWVyakIsU0FBZixDQUF5QnVqQixlQWhCckM7MEJBaUJXN2dCLE9BQU8yZ0IsT0FBUCxDQUFlcmpCLFNBQWYsQ0FBeUJ3akIsY0FqQnBDOzBCQWtCVzlnQixPQUFPMmdCLE9BQVAsQ0FBZXJqQixTQUFmLENBQXlCeWpCLGNBbEJwQzs2QkFtQmMvZ0IsT0FBTzJnQixPQUFQLENBQWVyakIsU0FBZixDQUF5QjBqQixpQkFuQnZDO2lDQW9Ca0JoaEIsT0FBTzJnQixPQUFQLENBQWVyakIsU0FBZixDQUF5Qix1QkFBekIsQ0FwQmxCO21CQXFCSTBDLE9BQU8yZ0IsT0FBUCxDQUFlcmpCLFNBQWYsQ0FBeUIsU0FBekIsQ0FyQko7a0JBc0JHMEMsT0FBTzJnQixPQUFQLENBQWVyakIsU0FBZixDQUF5QixRQUF6QixDQXRCSDtrQkF1QkcwQyxPQUFPMmdCLE9BQVAsQ0FBZXJqQixTQUFmLENBQXlCLFFBQXpCLENBdkJIO2lCQXdCRTBDLE9BQU8yZ0IsT0FBUCxDQUFlcmpCLFNBQWYsQ0FBeUIsT0FBekIsQ0F4QkY7dUJBeUJRMEMsT0FBTzJnQixPQUFQLENBQWVyakIsU0FBZixDQUF5QixhQUF6QixDQXpCUjtrQkEwQkcwQyxPQUFPMmdCLE9BQVAsQ0FBZXJqQixTQUFmLENBQXlCLFFBQXpCLENBMUJIO2VBMkJBMEMsT0FBT2loQixXQTNCUDt5QkE0QlV0YixPQUFPdUUsd0JBQVAsQ0FBZ0NsSyxPQUFPaWhCLFdBQVAsQ0FBbUIzakIsU0FBbkQsRUFBOEQsV0FBOUQsQ0E1QlY7cUNBNkJzQjBDLE9BQU9paEIsV0FBUCxDQUFtQjNqQixTQUFuQixDQUE2Qix1QkFBN0I7Q0E3QnJDOztBQ0FBOzs7Ozs7O0lBT000akI7Ozs7QUFFTixpQ0FBZSxJQUFJQSx3QkFBSixFQUFmOztBQ0pBOzs7QUFHQSx1QkFBZSxVQUFTcEQsU0FBVCxFQUFvQjtTQUMxQixhQUFQLElBQXlCLFlBQVc7Ozs7YUFJekJtRCxXQUFULEdBQXVCOzs7OztVQUtmaFMsY0FBYyxLQUFLQSxXQUF6Qjs7VUFFTTZNLGFBQWFnQyxVQUFVcUQsdUJBQVYsQ0FBa0NsUyxXQUFsQyxDQUFuQjtVQUNJLENBQUM2TSxVQUFMLEVBQWlCO2NBQ1QsSUFBSXFCLEtBQUosQ0FBVSxnRkFBVixDQUFOOzs7VUFHSUQsb0JBQW9CcEIsV0FBV29CLGlCQUFyQzs7VUFFSUEsa0JBQWtCdGdCLE1BQWxCLEtBQTZCLENBQWpDLEVBQW9DO1lBQzVCbWUsV0FBVXFHLE9BQU9DLHNCQUFQLENBQThCdmpCLElBQTlCLENBQW1DMkIsUUFBbkMsRUFBNkNxYyxXQUFXbkMsU0FBeEQsQ0FBaEI7ZUFDT3BQLGNBQVAsQ0FBc0J3USxRQUF0QixFQUErQjlMLFlBQVkzUixTQUEzQztpQkFDUTZlLFVBQVIsR0FBcUJDLG1CQUFRQyxNQUE3QjtpQkFDUWlCLGVBQVIsR0FBMEJ4QixVQUExQjtrQkFDVUUsS0FBVixDQUFnQmpCLFFBQWhCO2VBQ09BLFFBQVA7OztVQUdJdUcsWUFBWXBFLGtCQUFrQnRnQixNQUFsQixHQUEyQixDQUE3QztVQUNNbWUsVUFBVW1DLGtCQUFrQm9FLFNBQWxCLENBQWhCO1VBQ0l2RyxZQUFZbUcsMEJBQWhCLEVBQTBDO2NBQ2xDLElBQUkvRCxLQUFKLENBQVUsMEdBQVYsQ0FBTjs7d0JBRWdCbUUsU0FBbEIsSUFBK0JKLDBCQUEvQjs7YUFFTzNXLGNBQVAsQ0FBc0J3USxPQUF0QixFQUErQjlMLFlBQVkzUixTQUEzQztnQkFDVTBlLEtBQVYsNkJBQTZDakIsT0FBN0M7O2FBRU9BLE9BQVA7OztnQkFHVXpkLFNBQVosR0FBd0I4akIsT0FBT0gsV0FBUCxDQUFtQjNqQixTQUEzQzs7V0FFTzJqQixXQUFQO0dBMUNzQixFQUF4Qjs7O0FDRUY7Ozs7O0FBS0Esc0JBQWUsVUFBU25ELFNBQVQsRUFBb0J2QyxXQUFwQixFQUFpQ2dHLE9BQWpDLEVBQTBDOzs7O2NBSTNDLFNBQVosSUFBeUIsWUFBbUI7c0NBQVBDLEtBQU87V0FBQTs7OztRQUVwQ0MsOENBQWdERCxNQUFNRSxNQUFOLENBQWEsZ0JBQVE7O2FBRWxFM0gsZ0JBQWdCbGMsSUFBaEIsSUFBd0J5ZSxXQUFBLENBQXNCdkMsSUFBdEIsQ0FBL0I7S0FGb0QsQ0FBdEQ7O1lBS1E0SCxPQUFSLENBQWdCcGxCLEtBQWhCLENBQXNCLElBQXRCLEVBQTRCaWxCLEtBQTVCOztTQUVLLElBQUk5a0IsSUFBSSxDQUFiLEVBQWdCQSxJQUFJK2tCLGdCQUFnQjdrQixNQUFwQyxFQUE0Q0YsR0FBNUMsRUFBaUQ7Z0JBQ3JDa2xCLGNBQVYsQ0FBeUJILGdCQUFnQi9rQixDQUFoQixDQUF6Qjs7O1FBR0U0ZixXQUFBLENBQXNCLElBQXRCLENBQUosRUFBaUM7V0FDMUIsSUFBSTVmLEtBQUksQ0FBYixFQUFnQkEsS0FBSThrQixNQUFNNWtCLE1BQTFCLEVBQWtDRixJQUFsQyxFQUF1QztZQUMvQnFkLE9BQU95SCxNQUFNOWtCLEVBQU4sQ0FBYjtZQUNJcWQsZ0JBQWdCNEcsT0FBcEIsRUFBNkI7b0JBQ2pCa0IsV0FBVixDQUFzQjlILElBQXRCOzs7O0dBakJSOzs7OztjQTBCWSxRQUFaLElBQXdCLFlBQW1CO3VDQUFQeUgsS0FBTztXQUFBOzs7O1FBRW5DQyw4Q0FBZ0RELE1BQU1FLE1BQU4sQ0FBYSxnQkFBUTs7YUFFbEUzSCxnQkFBZ0JsYyxJQUFoQixJQUF3QnllLFdBQUEsQ0FBc0J2QyxJQUF0QixDQUEvQjtLQUZvRCxDQUF0RDs7WUFLUStILE1BQVIsQ0FBZXZsQixLQUFmLENBQXFCLElBQXJCLEVBQTJCaWxCLEtBQTNCOztTQUVLLElBQUk5a0IsSUFBSSxDQUFiLEVBQWdCQSxJQUFJK2tCLGdCQUFnQjdrQixNQUFwQyxFQUE0Q0YsR0FBNUMsRUFBaUQ7Z0JBQ3JDa2xCLGNBQVYsQ0FBeUJILGdCQUFnQi9rQixDQUFoQixDQUF6Qjs7O1FBR0U0ZixXQUFBLENBQXNCLElBQXRCLENBQUosRUFBaUM7V0FDMUIsSUFBSTVmLE1BQUksQ0FBYixFQUFnQkEsTUFBSThrQixNQUFNNWtCLE1BQTFCLEVBQWtDRixLQUFsQyxFQUF1QztZQUMvQnFkLE9BQU95SCxNQUFNOWtCLEdBQU4sQ0FBYjtZQUNJcWQsZ0JBQWdCNEcsT0FBcEIsRUFBNkI7b0JBQ2pCa0IsV0FBVixDQUFzQjlILElBQXRCOzs7O0dBakJSOzs7QUN4Q0Y7OztBQUdBLG9CQUFlLFVBQVMrRCxTQUFULEVBQW9CO3NCQUNqQyxDQUErQjNELFNBQVM3YyxTQUF4QyxFQUFtRCxlQUFuRDs7Ozs7O1lBTVdxYyxTQUFULEVBQW9COztRQUVkLEtBQUtpRCxnQkFBVCxFQUEyQjtVQUNuQmQsYUFBYWdDLFVBQVViLHFCQUFWLENBQWdDdEQsU0FBaEMsQ0FBbkI7VUFDSW1DLFVBQUosRUFBZ0I7ZUFDUCxJQUFLQSxXQUFXN00sV0FBaEIsRUFBUDs7OztRQUlFbkM7V0FDSXVVLHNCQUFQLENBQThCdmpCLElBQTlCLENBQW1DLElBQW5DLEVBQXlDNmIsU0FBekMsQ0FESDtjQUVVcUMsS0FBVixDQUFnQmxQLE1BQWhCO1dBQ09BLE1BQVA7R0FsQko7O3NCQXFCQSxDQUErQnFOLFNBQVM3YyxTQUF4QyxFQUFtRCxZQUFuRDs7Ozs7OztZQU9XeWMsSUFBVCxFQUFlZ0ksSUFBZixFQUFxQjtRQUNiQyxRQUFRWixPQUFPYSxtQkFBUCxDQUEyQm5rQixJQUEzQixDQUFnQyxJQUFoQyxFQUFzQ2ljLElBQXRDLEVBQTRDZ0ksSUFBNUMsQ0FBZDs7UUFFSSxDQUFDLEtBQUtuRixnQkFBVixFQUE0QjtnQkFDaEJzRixTQUFWLENBQW9CRixLQUFwQjtLQURGLE1BRU87Z0JBQ0tqRixtQkFBVixDQUE4QmlGLEtBQTlCOztXQUVLQSxLQUFQO0dBZko7O01Ba0JNRyxVQUFVLDhCQUFoQjs7c0JBRUEsQ0FBK0JoSSxTQUFTN2MsU0FBeEMsRUFBbUQsaUJBQW5EOzs7Ozs7O1lBT1dzZ0IsU0FBVCxFQUFvQmpFLFNBQXBCLEVBQStCOztRQUV6QixLQUFLaUQsZ0JBQUwsS0FBMEJnQixjQUFjLElBQWQsSUFBc0JBLGNBQWN1RSxPQUE5RCxDQUFKLEVBQTRFO1VBQ3BFckcsYUFBYWdDLFVBQVViLHFCQUFWLENBQWdDdEQsU0FBaEMsQ0FBbkI7VUFDSW1DLFVBQUosRUFBZ0I7ZUFDUCxJQUFLQSxXQUFXN00sV0FBaEIsRUFBUDs7OztRQUlFbkM7V0FDSXNWLHdCQUFQLENBQWdDdGtCLElBQWhDLENBQXFDLElBQXJDLEVBQTJDOGYsU0FBM0MsRUFBc0RqRSxTQUF0RCxDQURIO2NBRVVxQyxLQUFWLENBQWdCbFAsTUFBaEI7V0FDT0EsTUFBUDtHQW5CSjs7a0JBc0JnQmdSLFNBQWhCLEVBQTJCM0QsU0FBUzdjLFNBQXBDLEVBQStDO2FBQ3BDOGpCLE9BQU9pQixnQkFENkI7WUFFckNqQixPQUFPa0I7R0FGakI7OztBQ3JFRjs7O0FBR0EsZ0JBQWUsVUFBU3hFLFNBQVQsRUFBb0I7Ozs7c0JBSWpDLENBQStCamdCLEtBQUtQLFNBQXBDLEVBQStDLGNBQS9DOzs7Ozs7O1lBT1d5YyxJQUFULEVBQWV3SSxPQUFmLEVBQXdCO1FBQ2xCeEksZ0JBQWdCeUksZ0JBQXBCLEVBQXNDO1VBQzlCQyxnQkFBZ0IvWCxNQUFNcE4sU0FBTixDQUFnQnVNLEtBQWhCLENBQXNCdE4sS0FBdEIsQ0FBNEJ3ZCxLQUFLMkksVUFBakMsQ0FBdEI7VUFDTUMsZ0JBQWV2QixPQUFPd0IsaUJBQVAsQ0FBeUI5a0IsSUFBekIsQ0FBOEIsSUFBOUIsRUFBb0NpYyxJQUFwQyxFQUEwQ3dJLE9BQTFDLENBQXJCOzs7OztVQUtJakcsV0FBQSxDQUFzQixJQUF0QixDQUFKLEVBQWlDO2FBQzFCLElBQUk1ZixJQUFJLENBQWIsRUFBZ0JBLElBQUkrbEIsY0FBYzdsQixNQUFsQyxFQUEwQ0YsR0FBMUMsRUFBK0M7b0JBQ25DbWxCLFdBQVYsQ0FBc0JZLGNBQWMvbEIsQ0FBZCxDQUF0Qjs7OzthQUlHaW1CLGFBQVA7OztRQUdJRSxtQkFBbUJ2RyxXQUFBLENBQXNCdkMsSUFBdEIsQ0FBekI7UUFDTTRJLGVBQWV2QixPQUFPd0IsaUJBQVAsQ0FBeUI5a0IsSUFBekIsQ0FBOEIsSUFBOUIsRUFBb0NpYyxJQUFwQyxFQUEwQ3dJLE9BQTFDLENBQXJCOztRQUVJTSxnQkFBSixFQUFzQjtnQkFDVmpCLGNBQVYsQ0FBeUI3SCxJQUF6Qjs7O1FBR0V1QyxXQUFBLENBQXNCLElBQXRCLENBQUosRUFBaUM7Z0JBQ3JCdUYsV0FBVixDQUFzQjlILElBQXRCOzs7V0FHSzRJLFlBQVA7R0FuQ0o7O3NCQXNDQSxDQUErQjlrQixLQUFLUCxTQUFwQyxFQUErQyxhQUEvQzs7Ozs7O1lBTVd5YyxJQUFULEVBQWU7UUFDVEEsZ0JBQWdCeUksZ0JBQXBCLEVBQXNDO1VBQzlCQyxnQkFBZ0IvWCxNQUFNcE4sU0FBTixDQUFnQnVNLEtBQWhCLENBQXNCdE4sS0FBdEIsQ0FBNEJ3ZCxLQUFLMkksVUFBakMsQ0FBdEI7VUFDTUMsaUJBQWV2QixPQUFPMEIsZ0JBQVAsQ0FBd0JobEIsSUFBeEIsQ0FBNkIsSUFBN0IsRUFBbUNpYyxJQUFuQyxDQUFyQjs7Ozs7VUFLSXVDLFdBQUEsQ0FBc0IsSUFBdEIsQ0FBSixFQUFpQzthQUMxQixJQUFJNWYsSUFBSSxDQUFiLEVBQWdCQSxJQUFJK2xCLGNBQWM3bEIsTUFBbEMsRUFBMENGLEdBQTFDLEVBQStDO29CQUNuQ21sQixXQUFWLENBQXNCWSxjQUFjL2xCLENBQWQsQ0FBdEI7Ozs7YUFJR2ltQixjQUFQOzs7UUFHSUUsbUJBQW1CdkcsV0FBQSxDQUFzQnZDLElBQXRCLENBQXpCO1FBQ000SSxlQUFldkIsT0FBTzBCLGdCQUFQLENBQXdCaGxCLElBQXhCLENBQTZCLElBQTdCLEVBQW1DaWMsSUFBbkMsQ0FBckI7O1FBRUk4SSxnQkFBSixFQUFzQjtnQkFDVmpCLGNBQVYsQ0FBeUI3SCxJQUF6Qjs7O1FBR0V1QyxXQUFBLENBQXNCLElBQXRCLENBQUosRUFBaUM7Z0JBQ3JCdUYsV0FBVixDQUFzQjlILElBQXRCOzs7V0FHSzRJLFlBQVA7R0FsQ0o7O3NCQXFDQSxDQUErQjlrQixLQUFLUCxTQUFwQyxFQUErQyxXQUEvQzs7Ozs7O1lBTVd5a0IsSUFBVCxFQUFlO1FBQ1BDLFFBQVFaLE9BQU8yQixjQUFQLENBQXNCamxCLElBQXRCLENBQTJCLElBQTNCLEVBQWlDaWtCLElBQWpDLENBQWQ7OztRQUdJLENBQUMsS0FBS2lCLGFBQUwsQ0FBbUJwRyxnQkFBeEIsRUFBMEM7Z0JBQzlCc0YsU0FBVixDQUFvQkYsS0FBcEI7S0FERixNQUVPO2dCQUNLakYsbUJBQVYsQ0FBOEJpRixLQUE5Qjs7V0FFS0EsS0FBUDtHQWZKOztzQkFrQkEsQ0FBK0Jua0IsS0FBS1AsU0FBcEMsRUFBK0MsYUFBL0M7Ozs7OztZQU1XeWMsSUFBVCxFQUFlO1FBQ1A4SSxtQkFBbUJ2RyxXQUFBLENBQXNCdkMsSUFBdEIsQ0FBekI7UUFDTTRJLGVBQWV2QixPQUFPNkIsZ0JBQVAsQ0FBd0JubEIsSUFBeEIsQ0FBNkIsSUFBN0IsRUFBbUNpYyxJQUFuQyxDQUFyQjs7UUFFSThJLGdCQUFKLEVBQXNCO2dCQUNWakIsY0FBVixDQUF5QjdILElBQXpCOzs7V0FHSzRJLFlBQVA7R0FkSjs7c0JBaUJBLENBQStCOWtCLEtBQUtQLFNBQXBDLEVBQStDLGNBQS9DOzs7Ozs7O1lBT1c0bEIsWUFBVCxFQUF1QkMsWUFBdkIsRUFBcUM7UUFDL0JELHdCQUF3QlYsZ0JBQTVCLEVBQThDO1VBQ3RDQyxnQkFBZ0IvWCxNQUFNcE4sU0FBTixDQUFnQnVNLEtBQWhCLENBQXNCdE4sS0FBdEIsQ0FBNEIybUIsYUFBYVIsVUFBekMsQ0FBdEI7VUFDTUMsaUJBQWV2QixPQUFPZ0MsaUJBQVAsQ0FBeUJ0bEIsSUFBekIsQ0FBOEIsSUFBOUIsRUFBb0NvbEIsWUFBcEMsRUFBa0RDLFlBQWxELENBQXJCOzs7OztVQUtJN0csV0FBQSxDQUFzQixJQUF0QixDQUFKLEVBQWlDO2tCQUNyQnNGLGNBQVYsQ0FBeUJ1QixZQUF6QjthQUNLLElBQUl6bUIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJK2xCLGNBQWM3bEIsTUFBbEMsRUFBMENGLEdBQTFDLEVBQStDO29CQUNuQ21sQixXQUFWLENBQXNCWSxjQUFjL2xCLENBQWQsQ0FBdEI7Ozs7YUFJR2ltQixjQUFQOzs7UUFHSVUsMkJBQTJCL0csV0FBQSxDQUFzQjRHLFlBQXRCLENBQWpDO1FBQ01QLGVBQWV2QixPQUFPZ0MsaUJBQVAsQ0FBeUJ0bEIsSUFBekIsQ0FBOEIsSUFBOUIsRUFBb0NvbEIsWUFBcEMsRUFBa0RDLFlBQWxELENBQXJCO1FBQ01HLGtCQUFrQmhILFdBQUEsQ0FBc0IsSUFBdEIsQ0FBeEI7O1FBRUlnSCxlQUFKLEVBQXFCO2dCQUNUMUIsY0FBVixDQUF5QnVCLFlBQXpCOzs7UUFHRUUsd0JBQUosRUFBOEI7Z0JBQ2xCekIsY0FBVixDQUF5QnNCLFlBQXpCOzs7UUFHRUksZUFBSixFQUFxQjtnQkFDVHpCLFdBQVYsQ0FBc0JxQixZQUF0Qjs7O1dBR0tQLFlBQVA7R0F6Q0o7O1dBNkNTWSxpQkFBVCxDQUEyQmhJLFdBQTNCLEVBQXdDaUksY0FBeEMsRUFBd0Q7V0FDL0M1ZCxjQUFQLENBQXNCMlYsV0FBdEIsRUFBbUMsYUFBbkMsRUFBa0Q7a0JBQ3BDaUksZUFBZUMsVUFEcUI7b0JBRWxDLElBRmtDO1dBRzNDRCxlQUFlM2QsR0FINEI7OEJBSXZCLGFBQVM2ZCxhQUFULEVBQXdCOztZQUUzQyxLQUFLcGlCLFFBQUwsS0FBa0J6RCxLQUFLMEQsU0FBM0IsRUFBc0M7eUJBQ3JCa0osR0FBZixDQUFtQjNNLElBQW5CLENBQXdCLElBQXhCLEVBQThCNGxCLGFBQTlCOzs7O1lBSUVDLGVBQWVsaEIsU0FBbkI7OztZQUdJLEtBQUtrWSxVQUFULEVBQXFCOzs7Y0FHYitILGFBQWEsS0FBS0EsVUFBeEI7Y0FDTWtCLG1CQUFtQmxCLFdBQVc5bEIsTUFBcEM7Y0FDSWduQixtQkFBbUIsQ0FBbkIsSUFBd0J0SCxXQUFBLENBQXNCLElBQXRCLENBQTVCLEVBQXlEOzsyQkFFeEMsSUFBSTVSLEtBQUosQ0FBVWtaLGdCQUFWLENBQWY7aUJBQ0ssSUFBSWxuQixJQUFJLENBQWIsRUFBZ0JBLElBQUlrbkIsZ0JBQXBCLEVBQXNDbG5CLEdBQXRDLEVBQTJDOzJCQUM1QkEsQ0FBYixJQUFrQmdtQixXQUFXaG1CLENBQVgsQ0FBbEI7Ozs7O3VCQUtTK04sR0FBZixDQUFtQjNNLElBQW5CLENBQXdCLElBQXhCLEVBQThCNGxCLGFBQTlCOztZQUVJQyxZQUFKLEVBQWtCO2VBQ1gsSUFBSWpuQixLQUFJLENBQWIsRUFBZ0JBLEtBQUlpbkIsYUFBYS9tQixNQUFqQyxFQUF5Q0YsSUFBekMsRUFBOEM7c0JBQ2xDa2xCLGNBQVYsQ0FBeUIrQixhQUFham5CLEVBQWIsQ0FBekI7Ozs7S0FoQ1I7OztNQXVDRTBrQixPQUFPeUMsZ0JBQVAsSUFBMkJ6QyxPQUFPeUMsZ0JBQVAsQ0FBd0JoZSxHQUF2RCxFQUE0RDtzQkFDeENoSSxLQUFLUCxTQUF2QixFQUFrQzhqQixPQUFPeUMsZ0JBQXpDO0dBREYsTUFFTztjQUNLQyxRQUFWLENBQW1CLFVBQVMvSSxPQUFULEVBQWtCO3dCQUNqQkEsT0FBbEIsRUFBMkI7b0JBQ2IsSUFEYTtzQkFFWCxJQUZXOzs7Z0NBS0EsZUFBVzs7Y0FFNUJnSixRQUFRLEVBQWQ7O2VBRUssSUFBSXJuQixJQUFJLENBQWIsRUFBZ0JBLElBQUksS0FBS2dtQixVQUFMLENBQWdCOWxCLE1BQXBDLEVBQTRDRixHQUE1QyxFQUFpRDtrQkFDekNvTyxJQUFOLENBQVcsS0FBSzRYLFVBQUwsQ0FBZ0JobUIsQ0FBaEIsRUFBbUJzbkIsV0FBOUI7OztpQkFHS0QsTUFBTTdiLElBQU4sQ0FBVyxFQUFYLENBQVA7U0FidUI7Z0NBZUEsYUFBU3diLGFBQVQsRUFBd0I7aUJBQ3hDLEtBQUsvSSxVQUFaLEVBQXdCO21CQUNmc0ksZ0JBQVAsQ0FBd0JubEIsSUFBeEIsQ0FBNkIsSUFBN0IsRUFBbUMsS0FBSzZjLFVBQXhDOztpQkFFS21JLGdCQUFQLENBQXdCaGxCLElBQXhCLENBQTZCLElBQTdCLEVBQW1DMkIsU0FBU3drQixjQUFULENBQXdCUCxhQUF4QixDQUFuQzs7T0FuQko7S0FERjs7OztBQ3BNSjs7Ozs7QUFLQSxxQkFBZSxVQUFTNUYsU0FBVCxFQUFvQnZDLFdBQXBCLEVBQWlDZ0csT0FBakMsRUFBMEM7Ozs7Y0FJM0MsUUFBWixJQUF3QixZQUFtQjtzQ0FBUEMsS0FBTztXQUFBOzs7O1FBRW5DQyw4Q0FBZ0RELE1BQU1FLE1BQU4sQ0FBYSxnQkFBUTs7YUFFbEUzSCxnQkFBZ0JsYyxJQUFoQixJQUF3QnllLFdBQUEsQ0FBc0J2QyxJQUF0QixDQUEvQjtLQUZvRCxDQUF0RDs7WUFLUW1LLE1BQVIsQ0FBZTNuQixLQUFmLENBQXFCLElBQXJCLEVBQTJCaWxCLEtBQTNCOztTQUVLLElBQUk5a0IsSUFBSSxDQUFiLEVBQWdCQSxJQUFJK2tCLGdCQUFnQjdrQixNQUFwQyxFQUE0Q0YsR0FBNUMsRUFBaUQ7Z0JBQ3JDa2xCLGNBQVYsQ0FBeUJILGdCQUFnQi9rQixDQUFoQixDQUF6Qjs7O1FBR0U0ZixXQUFBLENBQXNCLElBQXRCLENBQUosRUFBaUM7V0FDMUIsSUFBSTVmLEtBQUksQ0FBYixFQUFnQkEsS0FBSThrQixNQUFNNWtCLE1BQTFCLEVBQWtDRixJQUFsQyxFQUF1QztZQUMvQnFkLE9BQU95SCxNQUFNOWtCLEVBQU4sQ0FBYjtZQUNJcWQsZ0JBQWdCNEcsT0FBcEIsRUFBNkI7b0JBQ2pCa0IsV0FBVixDQUFzQjlILElBQXRCOzs7O0dBakJSOzs7OztjQTBCWSxPQUFaLElBQXVCLFlBQW1CO3VDQUFQeUgsS0FBTztXQUFBOzs7O1FBRWxDQyw4Q0FBZ0RELE1BQU1FLE1BQU4sQ0FBYSxnQkFBUTs7YUFFbEUzSCxnQkFBZ0JsYyxJQUFoQixJQUF3QnllLFdBQUEsQ0FBc0J2QyxJQUF0QixDQUEvQjtLQUZvRCxDQUF0RDs7WUFLUW9LLEtBQVIsQ0FBYzVuQixLQUFkLENBQW9CLElBQXBCLEVBQTBCaWxCLEtBQTFCOztTQUVLLElBQUk5a0IsSUFBSSxDQUFiLEVBQWdCQSxJQUFJK2tCLGdCQUFnQjdrQixNQUFwQyxFQUE0Q0YsR0FBNUMsRUFBaUQ7Z0JBQ3JDa2xCLGNBQVYsQ0FBeUJILGdCQUFnQi9rQixDQUFoQixDQUF6Qjs7O1FBR0U0ZixXQUFBLENBQXNCLElBQXRCLENBQUosRUFBaUM7V0FDMUIsSUFBSTVmLE1BQUksQ0FBYixFQUFnQkEsTUFBSThrQixNQUFNNWtCLE1BQTFCLEVBQWtDRixLQUFsQyxFQUF1QztZQUMvQnFkLE9BQU95SCxNQUFNOWtCLEdBQU4sQ0FBYjtZQUNJcWQsZ0JBQWdCNEcsT0FBcEIsRUFBNkI7b0JBQ2pCa0IsV0FBVixDQUFzQjlILElBQXRCOzs7O0dBakJSOzs7OztjQTBCWSxhQUFaLElBQTZCLFlBQW1CO3VDQUFQeUgsS0FBTztXQUFBOzs7O1FBRXhDQyw4Q0FBZ0RELE1BQU1FLE1BQU4sQ0FBYSxnQkFBUTs7YUFFbEUzSCxnQkFBZ0JsYyxJQUFoQixJQUF3QnllLFdBQUEsQ0FBc0J2QyxJQUF0QixDQUEvQjtLQUZvRCxDQUF0RDs7UUFLTXFLLGVBQWU5SCxXQUFBLENBQXNCLElBQXRCLENBQXJCOztZQUVRK0gsV0FBUixDQUFvQjluQixLQUFwQixDQUEwQixJQUExQixFQUFnQ2lsQixLQUFoQzs7U0FFSyxJQUFJOWtCLElBQUksQ0FBYixFQUFnQkEsSUFBSStrQixnQkFBZ0I3a0IsTUFBcEMsRUFBNENGLEdBQTVDLEVBQWlEO2dCQUNyQ2tsQixjQUFWLENBQXlCSCxnQkFBZ0Iva0IsQ0FBaEIsQ0FBekI7OztRQUdFMG5CLFlBQUosRUFBa0I7Z0JBQ054QyxjQUFWLENBQXlCLElBQXpCO1dBQ0ssSUFBSWxsQixNQUFJLENBQWIsRUFBZ0JBLE1BQUk4a0IsTUFBTTVrQixNQUExQixFQUFrQ0YsS0FBbEMsRUFBdUM7WUFDL0JxZCxPQUFPeUgsTUFBTTlrQixHQUFOLENBQWI7WUFDSXFkLGdCQUFnQjRHLE9BQXBCLEVBQTZCO29CQUNqQmtCLFdBQVYsQ0FBc0I5SCxJQUF0Qjs7OztHQXBCUjs7Y0EwQlksUUFBWixJQUF3QixZQUFXO1FBQzNCcUssZUFBZTlILFdBQUEsQ0FBc0IsSUFBdEIsQ0FBckI7O1lBRVFnSSxNQUFSLENBQWV4bUIsSUFBZixDQUFvQixJQUFwQjs7UUFFSXNtQixZQUFKLEVBQWtCO2dCQUNOeEMsY0FBVixDQUF5QixJQUF6Qjs7R0FOSjs7O0FDNUZGOzs7QUFHQSxtQkFBZSxVQUFTOUQsU0FBVCxFQUFvQjtNQUM3QnNELE9BQU9tRCxvQkFBWCxFQUFpQzt3QkFDL0IsQ0FBK0I1RCxRQUFRcmpCLFNBQXZDLEVBQWtELGNBQWxEOzs7Ozs7Y0FNV2tuQixJQUFULEVBQWU7VUFDUHBKLGFBQWFnRyxPQUFPbUQsb0JBQVAsQ0FBNEJ6bUIsSUFBNUIsQ0FBaUMsSUFBakMsRUFBdUMwbUIsSUFBdkMsQ0FBbkI7V0FDS25KLGVBQUwsR0FBdUJELFVBQXZCO2FBQ09BLFVBQVA7S0FUSjtHQURGLE1BWU87WUFDR3FKLElBQVIsQ0FBYSwwREFBYjs7O1dBSU9DLGVBQVQsQ0FBeUJuSixXQUF6QixFQUFzQ2lJLGNBQXRDLEVBQXNEO1dBQzdDNWQsY0FBUCxDQUFzQjJWLFdBQXRCLEVBQW1DLFdBQW5DLEVBQWdEO2tCQUNsQ2lJLGVBQWVDLFVBRG1CO29CQUVoQyxJQUZnQztXQUd6Q0QsZUFBZTNkLEdBSDBCO2lDQUlsQixhQUFTOGUsVUFBVCxFQUFxQjs7O1lBQ3pDN0ssaUJBQWN3QyxXQUFBLENBQXNCLElBQXRCLENBQXBCOzs7Ozs7OztZQVFJc0ksa0JBQWtCbmlCLFNBQXRCO1lBQ0lxWCxjQUFKLEVBQWlCOzRCQUNHLEVBQWxCO29DQUNBLENBQXFDLElBQXJDLEVBQTJDLG1CQUFXO2dCQUNoRGlCLFlBQVksS0FBaEIsRUFBc0I7OEJBQ0pqUSxJQUFoQixDQUFxQmlRLE9BQXJCOztXQUZKOzs7dUJBT2F0USxHQUFmLENBQW1CM00sSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEI2bUIsVUFBOUI7O1lBRUlDLGVBQUosRUFBcUI7ZUFDZCxJQUFJbG9CLElBQUksQ0FBYixFQUFnQkEsSUFBSWtvQixnQkFBZ0Job0IsTUFBcEMsRUFBNENGLEdBQTVDLEVBQWlEO2dCQUN6Q3FlLFVBQVU2SixnQkFBZ0Jsb0IsQ0FBaEIsQ0FBaEI7Z0JBQ0lxZSxRQUFRb0IsVUFBUixLQUF1QkMsbUJBQVFDLE1BQW5DLEVBQTJDO3dCQUMvQkksb0JBQVYsQ0FBK0IxQixPQUEvQjs7Ozs7OztZQU9GLENBQUMsS0FBS2lJLGFBQUwsQ0FBbUJwRyxnQkFBeEIsRUFBMEM7b0JBQzlCc0YsU0FBVixDQUFvQixJQUFwQjtTQURGLE1BRU87b0JBQ0tuRixtQkFBVixDQUE4QixJQUE5Qjs7ZUFFSzRILFVBQVA7O0tBekNKOzs7TUE4Q0V2RCxPQUFPeUQsaUJBQVAsSUFBNEJ6RCxPQUFPeUQsaUJBQVAsQ0FBeUJoZixHQUF6RCxFQUE4RDtvQkFDNUM4YSxRQUFRcmpCLFNBQXhCLEVBQW1DOGpCLE9BQU95RCxpQkFBMUM7R0FERixNQUVPLElBQUl6RCxPQUFPMEQscUJBQVAsSUFBZ0MxRCxPQUFPMEQscUJBQVAsQ0FBNkJqZixHQUFqRSxFQUFzRTtvQkFDM0RvYixZQUFZM2pCLFNBQTVCLEVBQXVDOGpCLE9BQU8wRCxxQkFBOUM7R0FESyxNQUVBOzs7UUFHQ0MsU0FBUzNELE9BQU9DLHNCQUFQLENBQThCdmpCLElBQTlCLENBQW1DMkIsUUFBbkMsRUFBNkMsS0FBN0MsQ0FBZjs7Y0FFVXFrQixRQUFWLENBQW1CLFVBQVMvSSxPQUFULEVBQWtCO3NCQUNuQkEsT0FBaEIsRUFBeUI7b0JBQ1gsSUFEVztzQkFFVCxJQUZTOzs7O21DQU1LLGVBQVc7aUJBQzlCcUcsT0FBTzJCLGNBQVAsQ0FBc0JqbEIsSUFBdEIsQ0FBMkIsSUFBM0IsRUFBaUMsSUFBakMsRUFBdUNrbkIsU0FBOUM7U0FQcUI7Ozs7bUNBWUssYUFBU3RCLGFBQVQsRUFBd0I7Ozs7O2NBSzVDM2YsVUFBVSxLQUFLNFYsU0FBTCxLQUFtQixVQUFuQixzQ0FBc0UsSUFBdEMsQ0FBNkM1VixPQUE3RSxHQUF1RixJQUF2RztpQkFDT2loQixTQUFQLEdBQW1CdEIsYUFBbkI7O2lCQUVPM2YsUUFBUTJlLFVBQVIsQ0FBbUI5bEIsTUFBbkIsR0FBNEIsQ0FBbkMsRUFBc0M7bUJBQzdCcW1CLGdCQUFQLENBQXdCbmxCLElBQXhCLENBQTZCaUcsT0FBN0IsRUFBc0NBLFFBQVEyZSxVQUFSLENBQW1CLENBQW5CLENBQXRDOztpQkFFS3FDLE9BQU9yQyxVQUFQLENBQWtCOWxCLE1BQWxCLEdBQTJCLENBQWxDLEVBQXFDO21CQUM1QmttQixnQkFBUCxDQUF3QmhsQixJQUF4QixDQUE2QmlHLE9BQTdCLEVBQXNDZ2hCLE9BQU9yQyxVQUFQLENBQWtCLENBQWxCLENBQXRDOzs7T0F4Qk47S0FERjs7O3NCQWlDRixDQUErQi9CLFFBQVFyakIsU0FBdkMsRUFBa0QsY0FBbEQ7Ozs7OztZQU1XbUwsSUFBVCxFQUFla1YsUUFBZixFQUF5Qjs7UUFFbkIsS0FBS3hCLFVBQUwsS0FBb0JDLG1CQUFRQyxNQUFoQyxFQUF3QzthQUMvQitFLE9BQU82RCxvQkFBUCxDQUE0Qm5uQixJQUE1QixDQUFpQyxJQUFqQyxFQUF1QzJLLElBQXZDLEVBQTZDa1YsUUFBN0MsQ0FBUDs7O1FBR0lELFdBQVcwRCxPQUFPOEQsb0JBQVAsQ0FBNEJwbkIsSUFBNUIsQ0FBaUMsSUFBakMsRUFBdUMySyxJQUF2QyxDQUFqQjtXQUNPd2Msb0JBQVAsQ0FBNEJubkIsSUFBNUIsQ0FBaUMsSUFBakMsRUFBdUMySyxJQUF2QyxFQUE2Q2tWLFFBQTdDO2VBQ1d5RCxPQUFPOEQsb0JBQVAsQ0FBNEJwbkIsSUFBNUIsQ0FBaUMsSUFBakMsRUFBdUMySyxJQUF2QyxDQUFYO2NBQ1U4VSx3QkFBVixDQUFtQyxJQUFuQyxFQUF5QzlVLElBQXpDLEVBQStDaVYsUUFBL0MsRUFBeURDLFFBQXpELEVBQW1FLElBQW5FO0dBZko7O3NCQWtCQSxDQUErQmdELFFBQVFyakIsU0FBdkMsRUFBa0QsZ0JBQWxEOzs7Ozs7O1lBT1dzZ0IsU0FBVCxFQUFvQm5WLElBQXBCLEVBQTBCa1YsUUFBMUIsRUFBb0M7O1FBRTlCLEtBQUt4QixVQUFMLEtBQW9CQyxtQkFBUUMsTUFBaEMsRUFBd0M7YUFDL0IrRSxPQUFPK0Qsc0JBQVAsQ0FBOEJybkIsSUFBOUIsQ0FBbUMsSUFBbkMsRUFBeUM4ZixTQUF6QyxFQUFvRG5WLElBQXBELEVBQTBEa1YsUUFBMUQsQ0FBUDs7O1FBR0lELFdBQVcwRCxPQUFPZ0Usc0JBQVAsQ0FBOEJ0bkIsSUFBOUIsQ0FBbUMsSUFBbkMsRUFBeUM4ZixTQUF6QyxFQUFvRG5WLElBQXBELENBQWpCO1dBQ08wYyxzQkFBUCxDQUE4QnJuQixJQUE5QixDQUFtQyxJQUFuQyxFQUF5QzhmLFNBQXpDLEVBQW9EblYsSUFBcEQsRUFBMERrVixRQUExRDtlQUNXeUQsT0FBT2dFLHNCQUFQLENBQThCdG5CLElBQTlCLENBQW1DLElBQW5DLEVBQXlDOGYsU0FBekMsRUFBb0RuVixJQUFwRCxDQUFYO2NBQ1U4VSx3QkFBVixDQUFtQyxJQUFuQyxFQUF5QzlVLElBQXpDLEVBQStDaVYsUUFBL0MsRUFBeURDLFFBQXpELEVBQW1FQyxTQUFuRTtHQWhCSjs7c0JBbUJBLENBQStCK0MsUUFBUXJqQixTQUF2QyxFQUFrRCxpQkFBbEQ7Ozs7O1lBS1dtTCxJQUFULEVBQWU7O1FBRVQsS0FBSzBULFVBQUwsS0FBb0JDLG1CQUFRQyxNQUFoQyxFQUF3QzthQUMvQitFLE9BQU9pRSx1QkFBUCxDQUErQnZuQixJQUEvQixDQUFvQyxJQUFwQyxFQUEwQzJLLElBQTFDLENBQVA7OztRQUdJaVYsV0FBVzBELE9BQU84RCxvQkFBUCxDQUE0QnBuQixJQUE1QixDQUFpQyxJQUFqQyxFQUF1QzJLLElBQXZDLENBQWpCO1dBQ080Yyx1QkFBUCxDQUErQnZuQixJQUEvQixDQUFvQyxJQUFwQyxFQUEwQzJLLElBQTFDO1FBQ0lpVixhQUFhLElBQWpCLEVBQXVCO2dCQUNYSCx3QkFBVixDQUFtQyxJQUFuQyxFQUF5QzlVLElBQXpDLEVBQStDaVYsUUFBL0MsRUFBeUQsSUFBekQsRUFBK0QsSUFBL0Q7O0dBZE47O3NCQWtCQSxDQUErQmlELFFBQVFyakIsU0FBdkMsRUFBa0QsbUJBQWxEOzs7Ozs7WUFNV3NnQixTQUFULEVBQW9CblYsSUFBcEIsRUFBMEI7O1FBRXBCLEtBQUswVCxVQUFMLEtBQW9CQyxtQkFBUUMsTUFBaEMsRUFBd0M7YUFDL0IrRSxPQUFPa0UseUJBQVAsQ0FBaUN4bkIsSUFBakMsQ0FBc0MsSUFBdEMsRUFBNEM4ZixTQUE1QyxFQUF1RG5WLElBQXZELENBQVA7OztRQUdJaVYsV0FBVzBELE9BQU9nRSxzQkFBUCxDQUE4QnRuQixJQUE5QixDQUFtQyxJQUFuQyxFQUF5QzhmLFNBQXpDLEVBQW9EblYsSUFBcEQsQ0FBakI7V0FDTzZjLHlCQUFQLENBQWlDeG5CLElBQWpDLENBQXNDLElBQXRDLEVBQTRDOGYsU0FBNUMsRUFBdURuVixJQUF2RDs7OztRQUlNa1YsV0FBV3lELE9BQU9nRSxzQkFBUCxDQUE4QnRuQixJQUE5QixDQUFtQyxJQUFuQyxFQUF5QzhmLFNBQXpDLEVBQW9EblYsSUFBcEQsQ0FBakI7UUFDSWlWLGFBQWFDLFFBQWpCLEVBQTJCO2dCQUNmSix3QkFBVixDQUFtQyxJQUFuQyxFQUF5QzlVLElBQXpDLEVBQStDaVYsUUFBL0MsRUFBeURDLFFBQXpELEVBQW1FQyxTQUFuRTs7R0FuQk47O1dBd0JTMkgsMkJBQVQsQ0FBcUNoSyxXQUFyQyxFQUFrRGlLLFVBQWxELEVBQThEO3dCQUM1RCxDQUErQmpLLFdBQS9CLEVBQTRDLHVCQUE1Qzs7Ozs7OztjQU9Xa0ssS0FBVCxFQUFnQjFLLE9BQWhCLEVBQXlCO1VBQ2pCcUosZUFBZTlILFdBQUEsQ0FBc0J2QixPQUF0QixDQUFyQjtVQUNNMks7aUJBQ1E1bkIsSUFBWCxDQUFnQixJQUFoQixFQUFzQjJuQixLQUF0QixFQUE2QjFLLE9BQTdCLENBREg7O1VBR0lxSixZQUFKLEVBQWtCO2tCQUNOeEMsY0FBVixDQUF5QjdHLE9BQXpCOzs7VUFHRXVCLFdBQUEsQ0FBc0JvSixlQUF0QixDQUFKLEVBQTRDO2tCQUNoQzdELFdBQVYsQ0FBc0I5RyxPQUF0Qjs7YUFFSzJLLGVBQVA7S0FuQko7OztNQXVCRXRFLE9BQU91RSxpQ0FBWCxFQUE4QztnQ0FDaEIxRSxZQUFZM2pCLFNBQXhDLEVBQW1EOGpCLE9BQU91RSxpQ0FBMUQ7R0FERixNQUVPLElBQUl2RSxPQUFPd0UsNkJBQVgsRUFBMEM7Z0NBQ25CakYsUUFBUXJqQixTQUFwQyxFQUErQzhqQixPQUFPd0UsNkJBQXREO0dBREssTUFFQTtZQUNHbkIsSUFBUixDQUFhLG1FQUFiOzs7a0JBSWMzRyxTQUFoQixFQUEyQjZDLFFBQVFyakIsU0FBbkMsRUFBOEM7YUFDbkM4akIsT0FBT3lFLGVBRDRCO1lBRXBDekUsT0FBTzBFO0dBRmpCOztpQkFLZWhJLFNBQWYsRUFBMEI2QyxRQUFRcmpCLFNBQWxDLEVBQTZDO1lBQ25DOGpCLE9BQU8yRSxjQUQ0QjtXQUVwQzNFLE9BQU80RSxhQUY2QjtpQkFHOUI1RSxPQUFPNkUsbUJBSHVCO1lBSW5DN0UsT0FBTzhFO0dBSmpCOzs7QUMzT0Y7Ozs7Ozs7Ozs7QUFVQSxBQVFBLElBQU1DLHNCQUFzQm5tQixPQUFPLGdCQUFQLENBQTVCOztBQUVBLElBQUksQ0FBQ21tQixtQkFBRCxJQUNDQSxvQkFBb0IsZUFBcEIsQ0FERCxJQUVFLE9BQU9BLG9CQUFvQixRQUFwQixDQUFQLElBQXdDLFVBRjFDLElBR0UsT0FBT0Esb0JBQW9CLEtBQXBCLENBQVAsSUFBcUMsVUFIM0MsRUFHd0Q7O01BRWhEckksWUFBWSxJQUFJckMsc0JBQUosRUFBbEI7O21CQUVpQnFDLFNBQWpCO2dCQUNjQSxTQUFkO1lBQ1VBLFNBQVY7ZUFDYUEsU0FBYjs7O1dBR1NsQixnQkFBVCxHQUE0QixJQUE1Qjs7O01BR00vWCxpQkFBaUIsSUFBSWthLHFCQUFKLENBQTBCakIsU0FBMUIsQ0FBdkI7O1NBRU9sWSxjQUFQLENBQXNCNUYsTUFBdEIsRUFBOEIsZ0JBQTlCLEVBQWdEO2tCQUNoQyxJQURnQztnQkFFbEMsSUFGa0M7V0FHdkM2RTtHQUhUOzs7QUN0Q0Y7Ozs7Ozs7Ozs7O0FBV0EsQ0FBQyxVQUFTRSxNQUFULEVBQWlCO01BQ1pBLE9BQU9xaEIsa0JBQVgsRUFBK0I7OztNQUczQkMscUJBQXFCLElBQUluTixPQUFKLEVBQXpCO01BQ0lvTixZQUFKO01BQ0ksZUFBZTduQixJQUFmLENBQW9CSixVQUFVQyxTQUE5QixDQUFKLEVBQThDO21CQUM3QmlvQixVQUFmO0dBREYsTUFFTyxJQUFJdm1CLE9BQU9zbUIsWUFBWCxFQUF5QjttQkFDZnRtQixPQUFPc21CLFlBQXRCO0dBREssTUFFQTtRQUNERSxvQkFBb0IsRUFBeEI7UUFDSUMsV0FBV3RlLE9BQU8vRixLQUFLa0YsTUFBTCxFQUFQLENBQWY7V0FDT3hLLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFVBQVMySSxDQUFULEVBQVk7VUFDekNBLEVBQUUyTyxJQUFGLEtBQVdxUyxRQUFmLEVBQXlCO1lBQ25CQyxRQUFRRixpQkFBWjs0QkFDb0IsRUFBcEI7Y0FDTWhTLE9BQU4sQ0FBYyxVQUFTbVMsSUFBVCxFQUFlOztTQUE3Qjs7S0FKSjttQkFTZSxzQkFBU0EsSUFBVCxFQUFlO3dCQUNWN2IsSUFBbEIsQ0FBdUI2YixJQUF2QjthQUNPQyxXQUFQLENBQW1CSCxRQUFuQixFQUE2QixHQUE3QjtLQUZGOztNQUtFSSxjQUFjLEtBQWxCO01BQ0lDLHFCQUFxQixFQUF6QjtXQUNTQyxnQkFBVCxDQUEwQkMsUUFBMUIsRUFBb0M7dUJBQ2ZsYyxJQUFuQixDQUF3QmtjLFFBQXhCO1FBQ0ksQ0FBQ0gsV0FBTCxFQUFrQjtvQkFDRixJQUFkO21CQUNhSSxpQkFBYjs7O1dBR0tDLFlBQVQsQ0FBc0JuTixJQUF0QixFQUE0QjtXQUNuQi9aLE9BQU9tbkIsaUJBQVAsSUFBNEJubkIsT0FBT21uQixpQkFBUCxDQUF5QkQsWUFBekIsQ0FBc0NuTixJQUF0QyxDQUE1QixJQUEyRUEsSUFBbEY7O1dBRU9rTixpQkFBVCxHQUE2QjtrQkFDYixLQUFkO1FBQ0lHLFlBQVlOLGtCQUFoQjt5QkFDcUIsRUFBckI7Y0FDVU8sSUFBVixDQUFlLFVBQVNDLEVBQVQsRUFBYUMsRUFBYixFQUFpQjthQUN2QkQsR0FBR0UsSUFBSCxHQUFVRCxHQUFHQyxJQUFwQjtLQURGO1FBR0lDLGNBQWMsS0FBbEI7Y0FDVWpULE9BQVYsQ0FBa0IsVUFBU3dTLFFBQVQsRUFBbUI7VUFDL0JOLFFBQVFNLFNBQVNVLFdBQVQsRUFBWjtrQ0FDNEJWLFFBQTVCO1VBQ0lOLE1BQU05cEIsTUFBVixFQUFrQjtpQkFDUCtxQixTQUFULENBQW1CakIsS0FBbkIsRUFBMEJNLFFBQTFCO3NCQUNjLElBQWQ7O0tBTEo7UUFRSVMsV0FBSixFQUFpQlI7O1dBRVZXLDJCQUFULENBQXFDWixRQUFyQyxFQUErQzthQUNwQ2EsTUFBVCxDQUFnQnJULE9BQWhCLENBQXdCLFVBQVN1RixJQUFULEVBQWU7VUFDakMrTixnQkFBZ0J6QixtQkFBbUJ4Z0IsR0FBbkIsQ0FBdUJrVSxJQUF2QixDQUFwQjtVQUNJLENBQUMrTixhQUFMLEVBQW9CO29CQUNOdFQsT0FBZCxDQUFzQixVQUFTdVQsWUFBVCxFQUF1QjtZQUN2Q0EsYUFBYWYsUUFBYixLQUEwQkEsUUFBOUIsRUFBd0NlLGFBQWFDLHdCQUFiO09BRDFDO0tBSEY7O1dBUU9DLHVDQUFULENBQWlEbHBCLE1BQWpELEVBQXlEckIsUUFBekQsRUFBbUU7U0FDNUQsSUFBSXFjLE9BQU9oYixNQUFoQixFQUF3QmdiLElBQXhCLEVBQThCQSxPQUFPQSxLQUFLdlksVUFBMUMsRUFBc0Q7VUFDaERzbUIsZ0JBQWdCekIsbUJBQW1CeGdCLEdBQW5CLENBQXVCa1UsSUFBdkIsQ0FBcEI7VUFDSStOLGFBQUosRUFBbUI7YUFDWixJQUFJM1AsSUFBSSxDQUFiLEVBQWdCQSxJQUFJMlAsY0FBY2xyQixNQUFsQyxFQUEwQ3ViLEdBQTFDLEVBQStDO2NBQ3pDNFAsZUFBZUQsY0FBYzNQLENBQWQsQ0FBbkI7Y0FDSTNjLFVBQVV1c0IsYUFBYXZzQixPQUEzQjtjQUNJdWUsU0FBU2hiLE1BQVQsSUFBbUIsQ0FBQ3ZELFFBQVEwc0IsT0FBaEMsRUFBeUM7Y0FDckNDLFNBQVN6cUIsU0FBU2xDLE9BQVQsQ0FBYjtjQUNJMnNCLE1BQUosRUFBWUosYUFBYUssT0FBYixDQUFxQkQsTUFBckI7Ozs7O01BS2hCRSxhQUFhLENBQWpCO1dBQ1NqQyxrQkFBVCxDQUE0QjFvQixRQUE1QixFQUFzQztTQUMvQmlxQixTQUFMLEdBQWlCanFCLFFBQWpCO1NBQ0ttcUIsTUFBTCxHQUFjLEVBQWQ7U0FDS1MsUUFBTCxHQUFnQixFQUFoQjtTQUNLZCxJQUFMLEdBQVksRUFBRWEsVUFBZDs7cUJBRWlCL3FCLFNBQW5CLEdBQStCO2FBQ3BCLGlCQUFTeUIsTUFBVCxFQUFpQnZELE9BQWpCLEVBQTBCO2VBQ3hCMHJCLGFBQWFub0IsTUFBYixDQUFUO1VBQ0ksQ0FBQ3ZELFFBQVErc0IsU0FBVCxJQUFzQixDQUFDL3NCLFFBQVFndEIsVUFBL0IsSUFBNkMsQ0FBQ2h0QixRQUFRaXRCLGFBQXRELElBQXVFanRCLFFBQVFrdEIsaUJBQVIsSUFBNkIsQ0FBQ2x0QixRQUFRZ3RCLFVBQTdHLElBQTJIaHRCLFFBQVFtdEIsZUFBUixJQUEyQm50QixRQUFRbXRCLGVBQVIsQ0FBd0IvckIsTUFBbkQsSUFBNkQsQ0FBQ3BCLFFBQVFndEIsVUFBak0sSUFBK01odEIsUUFBUW90QixxQkFBUixJQUFpQyxDQUFDcHRCLFFBQVFpdEIsYUFBN1AsRUFBNFE7Y0FDcFEsSUFBSW5KLFdBQUosRUFBTjs7VUFFRXdJLGdCQUFnQnpCLG1CQUFtQnhnQixHQUFuQixDQUF1QjlHLE1BQXZCLENBQXBCO1VBQ0ksQ0FBQytvQixhQUFMLEVBQW9CekIsbUJBQW1CNWIsR0FBbkIsQ0FBdUIxTCxNQUF2QixFQUErQitvQixnQkFBZ0IsRUFBL0M7VUFDaEJDLFlBQUo7V0FDSyxJQUFJcnJCLElBQUksQ0FBYixFQUFnQkEsSUFBSW9yQixjQUFjbHJCLE1BQWxDLEVBQTBDRixHQUExQyxFQUErQztZQUN6Q29yQixjQUFjcHJCLENBQWQsRUFBaUJzcUIsUUFBakIsS0FBOEIsSUFBbEMsRUFBd0M7eUJBQ3ZCYyxjQUFjcHJCLENBQWQsQ0FBZjt1QkFDYW1zQixlQUFiO3VCQUNhcnRCLE9BQWIsR0FBdUJBLE9BQXZCOzs7O1VBSUEsQ0FBQ3VzQixZQUFMLEVBQW1CO3VCQUNGLElBQUllLFlBQUosQ0FBaUIsSUFBakIsRUFBdUIvcEIsTUFBdkIsRUFBK0J2RCxPQUEvQixDQUFmO3NCQUNjc1AsSUFBZCxDQUFtQmlkLFlBQW5CO2FBQ0tGLE1BQUwsQ0FBWS9jLElBQVosQ0FBaUIvTCxNQUFqQjs7bUJBRVdncUIsWUFBYjtLQXRCMkI7Z0JBd0JqQixzQkFBVztXQUNoQmxCLE1BQUwsQ0FBWXJULE9BQVosQ0FBb0IsVUFBU3VGLElBQVQsRUFBZTtZQUM3QitOLGdCQUFnQnpCLG1CQUFtQnhnQixHQUFuQixDQUF1QmtVLElBQXZCLENBQXBCO2FBQ0ssSUFBSXJkLElBQUksQ0FBYixFQUFnQkEsSUFBSW9yQixjQUFjbHJCLE1BQWxDLEVBQTBDRixHQUExQyxFQUErQztjQUN6Q3FyQixlQUFlRCxjQUFjcHJCLENBQWQsQ0FBbkI7Y0FDSXFyQixhQUFhZixRQUFiLEtBQTBCLElBQTlCLEVBQW9DO3lCQUNyQjZCLGVBQWI7MEJBQ2NuUSxNQUFkLENBQXFCaGMsQ0FBckIsRUFBd0IsQ0FBeEI7Ozs7T0FOTixFQVVHLElBVkg7V0FXSzRyQixRQUFMLEdBQWdCLEVBQWhCO0tBcEMyQjtpQkFzQ2hCLHVCQUFXO1VBQ2xCVSxnQkFBZ0IsS0FBS1YsUUFBekI7V0FDS0EsUUFBTCxHQUFnQixFQUFoQjthQUNPVSxhQUFQOztHQXpDSjtXQTRDU0MsY0FBVCxDQUF3QnhyQixJQUF4QixFQUE4QnNCLE1BQTlCLEVBQXNDO1NBQy9CdEIsSUFBTCxHQUFZQSxJQUFaO1NBQ0tzQixNQUFMLEdBQWNBLE1BQWQ7U0FDS3lmLFVBQUwsR0FBa0IsRUFBbEI7U0FDS21GLFlBQUwsR0FBb0IsRUFBcEI7U0FDS3VGLGVBQUwsR0FBdUIsSUFBdkI7U0FDS3pPLFdBQUwsR0FBbUIsSUFBbkI7U0FDSzBPLGFBQUwsR0FBcUIsSUFBckI7U0FDS0Msa0JBQUwsR0FBMEIsSUFBMUI7U0FDSzFMLFFBQUwsR0FBZ0IsSUFBaEI7O1dBRU8yTCxrQkFBVCxDQUE0QnBTLFFBQTVCLEVBQXNDO1FBQ2hDa1IsU0FBUyxJQUFJYyxjQUFKLENBQW1CaFMsU0FBU3haLElBQTVCLEVBQWtDd1osU0FBU2xZLE1BQTNDLENBQWI7V0FDT3lmLFVBQVAsR0FBb0J2SCxTQUFTdUgsVUFBVCxDQUFvQjNVLEtBQXBCLEVBQXBCO1dBQ084WixZQUFQLEdBQXNCMU0sU0FBUzBNLFlBQVQsQ0FBc0I5WixLQUF0QixFQUF0QjtXQUNPcWYsZUFBUCxHQUF5QmpTLFNBQVNpUyxlQUFsQztXQUNPek8sV0FBUCxHQUFxQnhELFNBQVN3RCxXQUE5QjtXQUNPME8sYUFBUCxHQUF1QmxTLFNBQVNrUyxhQUFoQztXQUNPQyxrQkFBUCxHQUE0Qm5TLFNBQVNtUyxrQkFBckM7V0FDTzFMLFFBQVAsR0FBa0J6RyxTQUFTeUcsUUFBM0I7V0FDT3lLLE1BQVA7O01BRUVtQixhQUFKLEVBQW1CQyxrQkFBbkI7V0FDU0MsU0FBVCxDQUFtQi9yQixJQUFuQixFQUF5QnNCLE1BQXpCLEVBQWlDO1dBQ3hCdXFCLGdCQUFnQixJQUFJTCxjQUFKLENBQW1CeHJCLElBQW5CLEVBQXlCc0IsTUFBekIsQ0FBdkI7O1dBRU8wcUIscUJBQVQsQ0FBK0IvTCxRQUEvQixFQUF5QztRQUNuQzZMLGtCQUFKLEVBQXdCLE9BQU9BLGtCQUFQO3lCQUNIRixtQkFBbUJDLGFBQW5CLENBQXJCO3VCQUNtQjVMLFFBQW5CLEdBQThCQSxRQUE5QjtXQUNPNkwsa0JBQVA7O1dBRU9HLFlBQVQsR0FBd0I7b0JBQ05ILHFCQUFxQjltQixTQUFyQzs7V0FFT2tuQiwrQkFBVCxDQUF5Q3hCLE1BQXpDLEVBQWlEO1dBQ3hDQSxXQUFXb0Isa0JBQVgsSUFBaUNwQixXQUFXbUIsYUFBbkQ7O1dBRU9NLFlBQVQsQ0FBc0JDLFVBQXRCLEVBQWtDQyxTQUFsQyxFQUE2QztRQUN2Q0QsZUFBZUMsU0FBbkIsRUFBOEIsT0FBT0QsVUFBUDtRQUMxQk4sc0JBQXNCSSxnQ0FBZ0NFLFVBQWhDLENBQTFCLEVBQXVFLE9BQU9OLGtCQUFQO1dBQ2hFLElBQVA7O1dBRU9ULFlBQVQsQ0FBc0I5QixRQUF0QixFQUFnQ2pvQixNQUFoQyxFQUF3Q3ZELE9BQXhDLEVBQWlEO1NBQzFDd3JCLFFBQUwsR0FBZ0JBLFFBQWhCO1NBQ0tqb0IsTUFBTCxHQUFjQSxNQUFkO1NBQ0t2RCxPQUFMLEdBQWVBLE9BQWY7U0FDS3V1QixzQkFBTCxHQUE4QixFQUE5Qjs7ZUFFV3pzQixTQUFiLEdBQXlCO2FBQ2QsaUJBQVM2cUIsTUFBVCxFQUFpQjtVQUNwQjZCLFVBQVUsS0FBS2hELFFBQUwsQ0FBY3NCLFFBQTVCO1VBQ0kxckIsU0FBU290QixRQUFRcHRCLE1BQXJCO1VBQ0lvdEIsUUFBUXB0QixNQUFSLEdBQWlCLENBQXJCLEVBQXdCO1lBQ2xCaXRCLGFBQWFHLFFBQVFwdEIsU0FBUyxDQUFqQixDQUFqQjtZQUNJcXRCLHNCQUFzQkwsYUFBYUMsVUFBYixFQUF5QjFCLE1BQXpCLENBQTFCO1lBQ0k4QixtQkFBSixFQUF5QjtrQkFDZnJ0QixTQUFTLENBQWpCLElBQXNCcXRCLG1CQUF0Qjs7O09BSkosTUFPTzt5QkFDWSxLQUFLakQsUUFBdEI7O2NBRU1wcUIsTUFBUixJQUFrQnVyQixNQUFsQjtLQWRxQjtrQkFnQlQsd0JBQVc7V0FDbEIrQixhQUFMLENBQW1CLEtBQUtuckIsTUFBeEI7S0FqQnFCO21CQW1CUix1QkFBU2diLElBQVQsRUFBZTtVQUN4QnZlLFVBQVUsS0FBS0EsT0FBbkI7VUFDSUEsUUFBUWd0QixVQUFaLEVBQXdCek8sS0FBS2pkLGdCQUFMLENBQXNCLGlCQUF0QixFQUF5QyxJQUF6QyxFQUErQyxJQUEvQztVQUNwQnRCLFFBQVFpdEIsYUFBWixFQUEyQjFPLEtBQUtqZCxnQkFBTCxDQUFzQiwwQkFBdEIsRUFBa0QsSUFBbEQsRUFBd0QsSUFBeEQ7VUFDdkJ0QixRQUFRK3NCLFNBQVosRUFBdUJ4TyxLQUFLamQsZ0JBQUwsQ0FBc0IsaUJBQXRCLEVBQXlDLElBQXpDLEVBQStDLElBQS9DO1VBQ25CdEIsUUFBUStzQixTQUFSLElBQXFCL3NCLFFBQVEwc0IsT0FBakMsRUFBMENuTyxLQUFLamQsZ0JBQUwsQ0FBc0IsZ0JBQXRCLEVBQXdDLElBQXhDLEVBQThDLElBQTlDO0tBeEJyQjtxQkEwQk4sMkJBQVc7V0FDckJxdEIsZ0JBQUwsQ0FBc0IsS0FBS3ByQixNQUEzQjtLQTNCcUI7c0JBNkJMLDBCQUFTZ2IsSUFBVCxFQUFlO1VBQzNCdmUsVUFBVSxLQUFLQSxPQUFuQjtVQUNJQSxRQUFRZ3RCLFVBQVosRUFBd0J6TyxLQUFLdmMsbUJBQUwsQ0FBeUIsaUJBQXpCLEVBQTRDLElBQTVDLEVBQWtELElBQWxEO1VBQ3BCaEMsUUFBUWl0QixhQUFaLEVBQTJCMU8sS0FBS3ZjLG1CQUFMLENBQXlCLDBCQUF6QixFQUFxRCxJQUFyRCxFQUEyRCxJQUEzRDtVQUN2QmhDLFFBQVErc0IsU0FBWixFQUF1QnhPLEtBQUt2YyxtQkFBTCxDQUF5QixpQkFBekIsRUFBNEMsSUFBNUMsRUFBa0QsSUFBbEQ7VUFDbkJoQyxRQUFRK3NCLFNBQVIsSUFBcUIvc0IsUUFBUTBzQixPQUFqQyxFQUEwQ25PLEtBQUt2YyxtQkFBTCxDQUF5QixnQkFBekIsRUFBMkMsSUFBM0MsRUFBaUQsSUFBakQ7S0FsQ3JCOzBCQW9DRCw4QkFBU3VjLElBQVQsRUFBZTtVQUMvQkEsU0FBUyxLQUFLaGIsTUFBbEIsRUFBMEI7V0FDckJtckIsYUFBTCxDQUFtQm5RLElBQW5CO1dBQ0tnUSxzQkFBTCxDQUE0QmpmLElBQTVCLENBQWlDaVAsSUFBakM7VUFDSStOLGdCQUFnQnpCLG1CQUFtQnhnQixHQUFuQixDQUF1QmtVLElBQXZCLENBQXBCO1VBQ0ksQ0FBQytOLGFBQUwsRUFBb0J6QixtQkFBbUI1YixHQUFuQixDQUF1QnNQLElBQXZCLEVBQTZCK04sZ0JBQWdCLEVBQTdDO29CQUNOaGQsSUFBZCxDQUFtQixJQUFuQjtLQTFDcUI7OEJBNENHLG9DQUFXO1VBQy9CaWYseUJBQXlCLEtBQUtBLHNCQUFsQztXQUNLQSxzQkFBTCxHQUE4QixFQUE5Qjs2QkFDdUJ2VixPQUF2QixDQUErQixVQUFTdUYsSUFBVCxFQUFlO2FBQ3ZDb1EsZ0JBQUwsQ0FBc0JwUSxJQUF0QjtZQUNJK04sZ0JBQWdCekIsbUJBQW1CeGdCLEdBQW5CLENBQXVCa1UsSUFBdkIsQ0FBcEI7YUFDSyxJQUFJcmQsSUFBSSxDQUFiLEVBQWdCQSxJQUFJb3JCLGNBQWNsckIsTUFBbEMsRUFBMENGLEdBQTFDLEVBQStDO2NBQ3pDb3JCLGNBQWNwckIsQ0FBZCxNQUFxQixJQUF6QixFQUErQjswQkFDZmdjLE1BQWQsQ0FBcUJoYyxDQUFyQixFQUF3QixDQUF4Qjs7OztPQUxOLEVBU0csSUFUSDtLQS9DcUI7aUJBMERWLHFCQUFTK0ksQ0FBVCxFQUFZO1FBQ3JCbEksd0JBQUY7Y0FDUWtJLEVBQUVoSSxJQUFWO2FBQ00saUJBQUw7Y0FDS2dMLE9BQU9oRCxFQUFFMmtCLFFBQWI7Y0FDSXhNLFlBQVluWSxFQUFFNGtCLFdBQUYsQ0FBY0MsWUFBOUI7Y0FDSXZyQixTQUFTMEcsRUFBRTFHLE1BQWY7Y0FDSW9wQixTQUFTLElBQUlxQixTQUFKLENBQWMsWUFBZCxFQUE0QnpxQixNQUE1QixDQUFiO2lCQUNPb3FCLGFBQVAsR0FBdUIxZ0IsSUFBdkI7aUJBQ08yZ0Isa0JBQVAsR0FBNEJ4TCxTQUE1QjtjQUNJRixXQUFXalksRUFBRThrQixVQUFGLEtBQWlCQyxjQUFjQyxRQUEvQixHQUEwQyxJQUExQyxHQUFpRGhsQixFQUFFaWxCLFNBQWxFO2tEQUN3QzNyQixNQUF4QyxFQUFnRCxVQUFTdkQsT0FBVCxFQUFrQjtnQkFDNUQsQ0FBQ0EsUUFBUWd0QixVQUFiLEVBQXlCO2dCQUNyQmh0QixRQUFRbXRCLGVBQVIsSUFBMkJudEIsUUFBUW10QixlQUFSLENBQXdCL3JCLE1BQW5ELElBQTZEcEIsUUFBUW10QixlQUFSLENBQXdCcHFCLE9BQXhCLENBQWdDa0ssSUFBaEMsTUFBMEMsQ0FBQyxDQUF4RyxJQUE2R2pOLFFBQVFtdEIsZUFBUixDQUF3QnBxQixPQUF4QixDQUFnQ3FmLFNBQWhDLE1BQStDLENBQUMsQ0FBakssRUFBb0s7OztnQkFHaEtwaUIsUUFBUWt0QixpQkFBWixFQUErQixPQUFPZSxzQkFBc0IvTCxRQUF0QixDQUFQO21CQUN4QnlLLE1BQVA7V0FORjs7O2FBVUksMEJBQUw7Y0FDS3BwQixTQUFTMEcsRUFBRTFHLE1BQWY7Y0FDSW9wQixTQUFTcUIsVUFBVSxlQUFWLEVBQTJCenFCLE1BQTNCLENBQWI7Y0FDSTJlLFdBQVdqWSxFQUFFaWxCLFNBQWpCO2tEQUN3QzNyQixNQUF4QyxFQUFnRCxVQUFTdkQsT0FBVCxFQUFrQjtnQkFDNUQsQ0FBQ0EsUUFBUWl0QixhQUFiLEVBQTRCO2dCQUN4Qmp0QixRQUFRb3RCLHFCQUFaLEVBQW1DLE9BQU9hLHNCQUFzQi9MLFFBQXRCLENBQVA7bUJBQzVCeUssTUFBUDtXQUhGOzs7YUFPSSxnQkFBTDtlQUNNd0Msb0JBQUwsQ0FBMEJsbEIsRUFBRTFHLE1BQTVCOzthQUVJLGlCQUFMO2NBQ0s2ckIsY0FBY25sQixFQUFFMUcsTUFBcEI7Y0FDSXlmLFVBQUosRUFBZ0JtRixZQUFoQjtjQUNJbGUsRUFBRWhJLElBQUYsS0FBVyxpQkFBZixFQUFrQzt5QkFDbkIsQ0FBRW10QixXQUFGLENBQWI7MkJBQ2UsRUFBZjtXQUZGLE1BR087eUJBQ1EsRUFBYjsyQkFDZSxDQUFFQSxXQUFGLENBQWY7O2NBRUUxQixrQkFBa0IwQixZQUFZMUIsZUFBbEM7Y0FDSXpPLGNBQWNtUSxZQUFZblEsV0FBOUI7Y0FDSTBOLFNBQVNxQixVQUFVLFdBQVYsRUFBdUIvakIsRUFBRTFHLE1BQUYsQ0FBU3lDLFVBQWhDLENBQWI7aUJBQ09nZCxVQUFQLEdBQW9CQSxVQUFwQjtpQkFDT21GLFlBQVAsR0FBc0JBLFlBQXRCO2lCQUNPdUYsZUFBUCxHQUF5QkEsZUFBekI7aUJBQ096TyxXQUFQLEdBQXFCQSxXQUFyQjtrREFDd0NoVixFQUFFNGtCLFdBQTFDLEVBQXVELFVBQVM3dUIsT0FBVCxFQUFrQjtnQkFDbkUsQ0FBQ0EsUUFBUStzQixTQUFiLEVBQXdCO21CQUNqQkosTUFBUDtXQUZGOzs7O0dBOUdOO1NBc0hPL0Isa0JBQVAsR0FBNEJBLGtCQUE1QjtNQUNJLENBQUNyaEIsT0FBT29aLGdCQUFaLEVBQThCO1dBQ3JCQSxnQkFBUCxHQUEwQmlJLGtCQUExQjt1QkFDbUJ5RSxhQUFuQixHQUFtQyxJQUFuQzs7Q0E3U0osRUErU0c3bEIsSUEvU0g7O0FDWEE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJDLFdBQVVELE1BQVYsRUFBa0J0QyxTQUFsQixFQUE2QjtRQUd0QnNDLE9BQU91aEIsWUFBWCxFQUF5Qjs7OztRQUlyQndFLGFBQWEsQ0FBakIsQ0FQMEI7UUFRdEJDLGdCQUFnQixFQUFwQjtRQUNJQyx3QkFBd0IsS0FBNUI7UUFDSWpOLE1BQU1oWixPQUFPdEYsUUFBakI7UUFDSTZtQixZQUFKOzthQUVTMkUsNEJBQVQsQ0FBc0NDLElBQXRDLEVBQTRDO3NCQUMxQkosVUFBZCxJQUE0QkssaUJBQWlCNXVCLEtBQWpCLENBQXVCa0csU0FBdkIsRUFBa0N5b0IsSUFBbEMsQ0FBNUI7ZUFDT0osWUFBUDs7Ozs7YUFLS0ssZ0JBQVQsQ0FBMEJDLE9BQTFCLEVBQW1DO1lBQzNCRixPQUFPLEdBQUdyaEIsS0FBSCxDQUFTL0wsSUFBVCxDQUFjdEIsU0FBZCxFQUF5QixDQUF6QixDQUFYO2VBQ08sWUFBVztnQkFDVixPQUFPNHVCLE9BQVAsS0FBbUIsVUFBdkIsRUFBbUM7d0JBQ3ZCN3VCLEtBQVIsQ0FBY2tHLFNBQWQsRUFBeUJ5b0IsSUFBekI7YUFESixNQUVPO29CQUNFam1CLFFBQUosQ0FBYSxLQUFLbW1CLE9BQWxCLENBQUQ7O1NBSlI7OzthQVNLQyxZQUFULENBQXNCQyxNQUF0QixFQUE4Qjs7O1lBR3RCTixxQkFBSixFQUEyQjs7O3VCQUdaRyxpQkFBaUJFLFlBQWpCLEVBQStCQyxNQUEvQixDQUFYLEVBQW1ELENBQW5EO1NBSEosTUFJTztnQkFDQ0MsT0FBT1IsY0FBY08sTUFBZCxDQUFYO2dCQUNJQyxJQUFKLEVBQVU7d0NBQ2tCLElBQXhCO29CQUNJOztpQkFBSixTQUVVO21DQUNTRCxNQUFmOzRDQUN3QixLQUF4Qjs7Ozs7O2FBTVBFLGNBQVQsQ0FBd0JGLE1BQXhCLEVBQWdDO2VBQ3JCUCxjQUFjTyxNQUFkLENBQVA7OzthQUdLRyw2QkFBVCxHQUF5Qzt1QkFDdEIsd0JBQVc7Z0JBQ2xCSCxTQUFTTCw2QkFBNkJ6dUIsU0FBN0IsQ0FBYjtvQkFDUWt2QixRQUFSLENBQWlCUCxpQkFBaUJFLFlBQWpCLEVBQStCQyxNQUEvQixDQUFqQjttQkFDT0EsTUFBUDtTQUhKOzs7YUFPS0ssaUJBQVQsR0FBNkI7OztZQUdyQjVtQixPQUFPNmhCLFdBQVAsSUFBc0IsQ0FBQzdoQixPQUFPNm1CLGFBQWxDLEVBQWlEO2dCQUN6Q0MsNEJBQTRCLElBQWhDO2dCQUNJQyxlQUFlL21CLE9BQU9nbkIsU0FBMUI7bUJBQ09BLFNBQVAsR0FBbUIsWUFBVzs0Q0FDRSxLQUE1QjthQURKO21CQUdPbkYsV0FBUCxDQUFtQixFQUFuQixFQUF1QixHQUF2QjttQkFDT21GLFNBQVAsR0FBbUJELFlBQW5CO21CQUNPRCx5QkFBUDs7OzthQUlDRyxnQ0FBVCxHQUE0Qzs7Ozs7WUFLcENDLGdCQUFnQixrQkFBa0I3cEIsS0FBS2tGLE1BQUwsRUFBbEIsR0FBa0MsR0FBdEQ7WUFDSTRrQixrQkFBa0IsU0FBbEJBLGVBQWtCLENBQVNqdUIsS0FBVCxFQUFnQjtnQkFDOUJBLE1BQU15SyxNQUFOLEtBQWlCM0QsTUFBakIsSUFDQSxPQUFPOUcsTUFBTW1XLElBQWIsS0FBc0IsUUFEdEIsSUFFQW5XLE1BQU1tVyxJQUFOLENBQVc3VixPQUFYLENBQW1CMHRCLGFBQW5CLE1BQXNDLENBRjFDLEVBRTZDOzZCQUM1QixDQUFDaHVCLE1BQU1tVyxJQUFOLENBQVd2SyxLQUFYLENBQWlCb2lCLGNBQWNydkIsTUFBL0IsQ0FBZDs7U0FKUjs7WUFRSW1JLE9BQU9qSSxnQkFBWCxFQUE2QjttQkFDbEJBLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1Db3ZCLGVBQW5DLEVBQW9ELEtBQXBEO1NBREosTUFFTzttQkFDSUMsV0FBUCxDQUFtQixXQUFuQixFQUFnQ0QsZUFBaEM7Ozt1QkFHVyx3QkFBVztnQkFDbEJaLFNBQVNMLDZCQUE2Qnp1QixTQUE3QixDQUFiO21CQUNPb3FCLFdBQVAsQ0FBbUJxRixnQkFBZ0JYLE1BQW5DLEVBQTJDLEdBQTNDO21CQUNPQSxNQUFQO1NBSEo7OzthQU9LYyxtQ0FBVCxHQUErQztZQUN2Q0MsVUFBVSxJQUFJQyxjQUFKLEVBQWQ7Z0JBQ1FDLEtBQVIsQ0FBY1IsU0FBZCxHQUEwQixVQUFTOXRCLEtBQVQsRUFBZ0I7Z0JBQ2xDcXRCLFNBQVNydEIsTUFBTW1XLElBQW5CO3lCQUNha1gsTUFBYjtTQUZKOzt1QkFLZSx3QkFBVztnQkFDbEJBLFNBQVNMLDZCQUE2Qnp1QixTQUE3QixDQUFiO29CQUNRZ3dCLEtBQVIsQ0FBYzVGLFdBQWQsQ0FBMEIwRSxNQUExQjttQkFDT0EsTUFBUDtTQUhKOzs7YUFPS21CLHFDQUFULEdBQWlEO1lBQ3pDQyxPQUFPM08sSUFBSS9aLGVBQWY7dUJBQ2Usd0JBQVc7Z0JBQ2xCc25CLFNBQVNMLDZCQUE2Qnp1QixTQUE3QixDQUFiOzs7Z0JBR0ltd0IsU0FBUzVPLElBQUkvWCxhQUFKLENBQWtCLFFBQWxCLENBQWI7bUJBQ080bUIsa0JBQVAsR0FBNEIsWUFBWTs2QkFDdkJ0QixNQUFiO3VCQUNPc0Isa0JBQVAsR0FBNEIsSUFBNUI7cUJBQ0tuTSxXQUFMLENBQWlCa00sTUFBakI7eUJBQ1MsSUFBVDthQUpKO2lCQU1LL2UsV0FBTCxDQUFpQitlLE1BQWpCO21CQUNPckIsTUFBUDtTQVpKOzs7YUFnQkt1QiwrQkFBVCxHQUEyQzt1QkFDeEIsd0JBQVc7Z0JBQ2xCdkIsU0FBU0wsNkJBQTZCenVCLFNBQTdCLENBQWI7dUJBQ1cydUIsaUJBQWlCRSxZQUFqQixFQUErQkMsTUFBL0IsQ0FBWCxFQUFtRCxDQUFuRDttQkFDT0EsTUFBUDtTQUhKOzs7O1FBUUF3QixXQUFXbm5CLE9BQU9vSixjQUFQLElBQXlCcEosT0FBT29KLGNBQVAsQ0FBc0JoSyxNQUF0QixDQUF4QztlQUNXK25CLFlBQVlBLFNBQVN2RyxVQUFyQixHQUFrQ3VHLFFBQWxDLEdBQTZDL25CLE1BQXhEOzs7UUFHSSxHQUFHdUIsUUFBSCxDQUFZeEksSUFBWixDQUFpQmlILE9BQU9nb0IsT0FBeEIsTUFBcUMsa0JBQXpDLEVBQTZEOzs7S0FBN0QsTUFJTyxJQUFJcEIsbUJBQUosRUFBeUI7OztLQUF6QixNQUlBLElBQUk1bUIsT0FBT3VuQixjQUFYLEVBQTJCOzs7S0FBM0IsTUFJQSxJQUFJdk8sT0FBTyx3QkFBd0JBLElBQUkvWCxhQUFKLENBQWtCLFFBQWxCLENBQW5DLEVBQWdFOzs7S0FBaEUsTUFJQTs7Ozs7YUFLRXNnQixZQUFULEdBQXdCQSxZQUF4QjthQUNTa0YsY0FBVCxHQUEwQkEsY0FBMUI7Q0E3S0gsRUE4S0N4bUIsSUE5S0QsQ0FBRDs7QUN2QkE7Ozs7OztBQU1BLEFBRUE7QUFDQSxBQU1BO0FBQ0EsQUFFQTtBQUNBLEFBRUE7O0FDckJBLENBQUMsWUFBVztNQUNOZ29CLG1CQUFtQixxRkFBdkI7O01BRUlDLFdBQVc7MkJBQ1UsaUNBQVc7VUFDNUJDLGtCQUFrQnp0QixTQUFTbUQsYUFBVCxDQUF1QixxQkFBdkIsQ0FBdEI7O1VBRUksQ0FBQ3NxQixlQUFMLEVBQXNCOzBCQUNGenRCLFNBQVN1RyxhQUFULENBQXVCLE1BQXZCLENBQWxCO3dCQUNnQnlDLElBQWhCLEdBQXVCLFVBQXZCO2lCQUNTMGtCLElBQVQsQ0FBY3ZmLFdBQWQsQ0FBMEJzZixlQUExQjs7O2FBR0tBLGVBQVA7S0FWVzs7V0FhTixpQkFBVztVQUNaQSxrQkFBa0JELFNBQVNHLHFCQUFULEVBQXRCOztVQUVJLENBQUNGLGVBQUwsRUFBc0I7Ozs7VUFJbEIsQ0FBQ0EsZ0JBQWdCRyxZQUFoQixDQUE2QixTQUE3QixDQUFMLEVBQThDO3dCQUM1QnpNLFlBQWhCLENBQTZCLFNBQTdCLEVBQXdDb00sZ0JBQXhDOzs7R0FyQk47O1NBMEJPQyxRQUFQLEdBQWtCQSxRQUFsQjtDQTdCRjs7QUNNZSxTQUFTSyxLQUFULENBQWVDLE1BQWYsRUFBb0I7TUFDN0J2dEIsT0FBT3d0QixVQUFYLEVBQXVCO1dBQ2pCQyxLQUFKLENBQVVoSixJQUFWLENBQWUsb0NBQWY7O1NBRUsrSSxVQUFQLEdBQW9CLElBQXBCOzs7U0FHTzF3QixnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxZQUFNO1dBQ2hDNHdCLFNBQUosR0FBZ0JweUIsWUFBVWlKLE1BQVYsQ0FBaUI5RSxTQUFTa3VCLElBQTFCLENBQWhCOztRQUVNQyxxQkFBcUIsa0JBQWtCbnVCLFNBQVNrdUIsSUFBVCxDQUFjdnBCLEtBQTNEOztXQUVJeXBCLFFBQUosQ0FBYUMsb0JBQWIsQ0FBa0MsWUFBTTtVQUNsQ1AsT0FBSU0sUUFBSixDQUFhRSxTQUFiLEVBQUosRUFBOEI7OztlQUd4QkwsU0FBSixDQUFjbHFCLE9BQWQ7T0FIRixNQUlPLElBQUkrcEIsT0FBSU0sUUFBSixDQUFhRyxLQUFiLEVBQUosRUFBMEI7WUFDM0JKLHVCQUF1QkwsT0FBSU0sUUFBSixDQUFhSSxXQUFiLE1BQThCVixPQUFJTSxRQUFKLENBQWFLLFdBQWIsRUFBckQsQ0FBSixFQUFzRjs7aUJBRWhGUixTQUFKLENBQWNscUIsT0FBZDtTQUZGLE1BR087Ozs7S0FUWDtHQUxGLEVBbUJHLEtBbkJIOztTQXFCSTJxQixLQUFKLENBQVUsWUFBVztXQUNmQyw2QkFBSjtXQUNJQywrQkFBSixHQUFzQ2QsT0FBSWUsU0FBSixDQUFjQyxhQUFkLENBQTRCQyxhQUE1QixDQUEwQ3h1QixPQUFPUCxRQUFQLENBQWdCa3VCLElBQTFELEVBQWdFLFlBQU07VUFDdEdob0IsT0FBT3dCLGNBQVAsQ0FBc0JySixJQUF0QixDQUEyQk8sU0FBM0IsRUFBc0MsS0FBdEMsQ0FBSixFQUFrRDtrQkFDdENvd0IsR0FBVixDQUFjQyxPQUFkO09BREYsTUFFTztnQkFDR2pLLElBQVIsQ0FBYSxxR0FBYjs7S0FKa0MsQ0FBdEM7YUFPU2tKLElBQVQsQ0FBY2dCLGdCQUFkLEdBQWlDLElBQUlwQixPQUFJcUIsZUFBUixDQUF3Qm52QixTQUFTa3VCLElBQWpDLEVBQXVDLEVBQUVrQixTQUFTLElBQVgsRUFBdkMsQ0FBakM7OztRQUdJLENBQUN0QixPQUFJTSxRQUFKLENBQWFpQixTQUFiLEVBQUwsRUFBK0I7ZUFDcEJuQixJQUFULENBQWM3d0IsZ0JBQWQsQ0FBK0IsU0FBL0IsRUFBMEMsVUFBU21CLEtBQVQsRUFBZ0I7WUFDcERBLE1BQU04d0IsT0FBTixLQUFrQixFQUF0QixFQUEwQjtpQkFDcEJDLHlCQUFKOztPQUZKOzs7O1dBUUVDLHlCQUFKO0dBckJGOzs7V0F5QlMzQixLQUFUOzs7QUN4REZBLE1BQU1DLEdBQU47Ozs7In0=
