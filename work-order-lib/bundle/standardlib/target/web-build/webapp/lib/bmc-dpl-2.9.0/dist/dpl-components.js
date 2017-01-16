var dplActionBlade = angular.module('dplActionBlade', ['ngAnimate', 'ui.bootstrap', 'template/action-blade.html']);

angular.module('template/action-blade.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/action-blade.html',
        "<div class='modal-header'>" +
        "	<h3>{{data.header}}</h3>" +
        "</div>" +
        "<div class='modal-body'>" +
        "{{data.body}}" +
        "</div>"
    );
}]);
 angular.module('dpl-busy-loader', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/busy-loader.html',
        "<div class='d-busy__wrapper'>" +
        "    <div class='d-busy__cover'>" +
        "       <div class='d-preloader d-icon-left-circle_25_o'></div>" +
        "        <p class='d-busy__text'>{{$message}}</p>" +
        "    </div>" +
        "</div>");
}]);
 //This components is deprecated now. Use dropdown-ui instead
var dpl_components = angular.module('dpl_components', []);
(function () {
    angular.module('dpl_components')
        .directive('dDropdown', ['$compile', function ($compile) {
            return {
                restrict: 'C',
                scope: {
                    model: "="
                },
                controller : [
                    '$scope', '$element', '$attrs',
                    function($scope, $element, $attrs){
                        this.getScopeValue = function (key) {
                            return $scope[key];
                        };
                        var getElementValue = function (el) {
                            if (el.data("value") !== undefined) {
                                return el.data("value");
                            } else {
                                return el.attr("value");
                            }
                        };
                        this.updateModel = function () {
                            if ($attrs.mode == "selectable" || $attrs.mode == "unselectable") {
                                $scope.model = getElementValue($element.find(".d-dropdown__menu .is-checked"));
                                $scope.$apply();
                            } else if ($attrs.mode == "multiselectable") {
                                var arr = [];
                                $element.find(".d-dropdown__menu .is-checked").each(function() {
                                    arr.push(getElementValue($(this)));
                                });
                                $scope.model = arr;
                                $scope.$apply();
                            }
                        };
                        this.updateOptions = function ($item) {
                            if ($scope.model !== undefined) {
                                if ($scope.model.constructor == Array) {
                                    if ($attrs.mode == "multiselectable") {
                                        if ($scope.model.indexOf(getElementValue($item)) != -1) {
                                            $item.addClass("is-checked");
                                        } else {
                                            $item.removeClass("is-checked");
                                        }
                                    }
                                } else  {
                                    if ($attrs.mode == "selectable" || $attrs.mode == "unselectable") {
                                        if (getElementValue($item) == $scope.model) {
                                            $item.addClass("is-checked");
                                        } else {
                                            $item.removeClass("is-checked");
                                        }
                                    }
                                }
                            }
                        };
                        this.updateTriggerValue = function () {

                            var dropdownTriggerValue = "";
                            var $dropdownTrigger = $element.find(".d-dropdown__trigger");

                            $element.find(".d-dropdown__menu-options-item-option.is-checked").each(function () {
                                var val = $(this).data("value");
                                var title = $(this).html();
                                dropdownTriggerValue +='<span data-value="'+val+'">' + title + '</span>';
                            });
                            if (dropdownTriggerValue == "") {
                                dropdownTriggerValue = $dropdownTrigger.data("placeholder");
                            }
                            $dropdownTrigger.html(dropdownTriggerValue);
                        };
                        this.checkInit = function () {
                            return $attrs.model !== undefined;
                        };
                        this.checkShowValue = function () {
                            return $element.find(".d-dropdown__trigger").data("showValue") !== undefined;
                        }
                    }],
                link:

                    function (scope, element, attrs, ctrl) {
                        if (ctrl.checkInit()) {
                            if (ctrl.checkShowValue()) {
                                scope.$watch(function () {return ctrl.getScopeValue("model");}, function () {
                                    setTimeout(function () {
                                        //console.log("update trigger value");
                                        ctrl.updateTriggerValue();
                                    }, 0);
                                }, true);
                            }
                        }
                    }
            };
        }])
        .directive('dDropdownMenuOptionsItemOption', ['$compile', function ($compile) {
            return {
                restrict: 'C',
                scope: {},
                require: "^dDropdown",
                link:
                    function (scope, element, attrs, ctrl) {
                        if (ctrl.checkInit()) {
                            element.on("click", function() {
                                //console.log("click");
                                setTimeout(function() {
                                    ctrl.updateModel();
                                }, 0);
                            });
                            scope.$watch(function(){return ctrl.getScopeValue("model");}, function () {
                                //console.log("options update");
                                ctrl.updateOptions(element);
                            }, true);
                        }
                    }
            }
        }])
        .directive('dDropdownMenuActionsActionSelectAll', ['$compile', function ($compile) { // "select all" filter
            return {
                restrict: 'C',
                scope: {},
                require: "^dDropdown",
                link:
                    function (scope, element, attrs, ctrl) {
                        if (ctrl.checkInit()) {
                            element.on("click", function() {
                                setTimeout(function() {
                                    ctrl.updateModel();
                                }, 0);
                            });
                            scope.$watch(function(){return ctrl.getScopeValue("model");}, function () {
                                //console.log("options update");
                                ctrl.updateOptions(element);
                            }, true);
                        }
                    }
            };
        }])
        .directive('dDropdownMenuActionsActionSelectNone', ['$compile', function ($compile) { // "select none" filter
            return {
                restrict: 'C',
                scope: {},
                require: "^dDropdown",
                link:
                    function (scope, element, attrs, ctrl) {
                        if (ctrl.checkInit()) {
                            element.on("click", function() {
                                setTimeout(function() {
                                    ctrl.updateModel();
                                }, 0);
                            });
                            scope.$watch(function(){return ctrl.getScopeValue("model");}, function () {
                                //console.log("options update");
                                ctrl.updateOptions(element);
                            }, true);
                        }
                    }
            };
        }]);
}()); (function ($) {
    $.fn.dDropdown = function (options) {
        var getElementAttributeValue = function (element) {
            return element.data("value") || element.attr("value");
        };
        var settings = $.extend({
            dropdownSelector : ".d-js-dropdown",
            dropdownTriggerSelector : ".d-dropdown__trigger",
            dropdownOptionSelector : ".d-dropdown__menu-options-item-option",
            selectable : "selectable",
            unselectable : "unselectable",
            multiselectable : "multiselectable"
        }, options);
        // bind click on label to trigger dropdown's trigger
        $(document).on('click', ".d-dropdown__label", function (e){
            var $this = $(this);
            $this.parents(settings.dropdownSelector).find(settings.dropdownTriggerSelector).trigger("click");
        });
        // bind click on dropdown trigger
        $(document).on('click', settings.dropdownTriggerSelector, function (e){
            e.stopPropagation();
            var $this = $(this); // dropdown trigger
            if (!$this.attr("disabled")) { // check dropdown trigger not disabled
                if (!$this.hasClass("is-checked")) { // check dropdown trigger is not open
                    $(settings.dropdownSelector).removeClass("is-open");
                    $(settings.dropdownTriggerSelector).removeClass("is-checked");
                    $this.parents(settings.dropdownSelector).addClass("is-open");
                    $this.addClass("is-checked");
                } else {
                    $this.parents(settings.dropdownSelector).removeClass("is-open");
                    $this.removeClass("is-checked");
                }
                $this.parents(settings.dropdownSelector).find(".d-textfield__input").focus();
            }
        });
        // bind click on document to close dropdown on click outside of dropdown
        $(document).on('click', function (e){
            $(settings.dropdownSelector).removeClass("is-open");
            $(settings.dropdownTriggerSelector).removeClass("is-checked");
        });
        $(document).on('click', '.d-js-dropdown', function (e){
            e.stopPropagation();
        });
        // bind click on escape button to close dropdown
        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape
                $(settings.dropdownSelector).removeClass("is-open");
                $(settings.dropdownTriggerSelector).removeClass("is-checked");
            }
        });

        var updateTriggerValue = function ($dropdown) {
            var dropdownTriggerValue = "";
            var $dropdownTrigger = $dropdown.find(settings.dropdownTriggerSelector);
            if ($dropdownTrigger.data("showValue") !== undefined) {
                $dropdown.find(settings.dropdownOptionSelector + ".is-checked").each(function () {
                    var val = $(this).data("value");
                    var title = $(this).text();
                    dropdownTriggerValue +='<span data-value="'+val+'">' + title + '</span>';
                });
                if (dropdownTriggerValue == "") {
                    dropdownTriggerValue = $dropdownTrigger.data("placeholder");
                } else {

                }
                $dropdownTrigger.html(dropdownTriggerValue);
            }

        };
        var unSelectItems = function ($dropdown) {
            $dropdown.find(settings.dropdownOptionSelector).removeClass("is-checked");
        };
        var selectItems = function ($dropdown) {
            $dropdown.find(settings.dropdownOptionSelector).addClass("is-checked");
        };
        var selectItem = function ($item) {
            $item.addClass("is-checked");
        };
        var unSelectItem = function ($item) {
            $item.removeClass("is-checked");
        };


        $(document).on('click', '.d-dropdown__menu-options-item-option', function (e) {
            var $this = $(this);
            var $dropdown = $this.parents(settings.dropdownSelector);
            var isSelectable = $dropdown.data("mode") == settings.selectable;
            var isUnSelectable = $dropdown.data("mode") == settings.unselectable;
            var isMultiSelectable = $dropdown.data("mode") == settings.multiselectable;
            var isDisabled = $this.attr("disabled") !== undefined;
            var isSelected = $this.hasClass("is-checked");
            if (!isDisabled) {
                if (isSelectable) {
                    if (!isSelected) {
                        unSelectItems($dropdown);
                        selectItem($this);
                    }
                    $this.parents(".d-js-dropdown").removeClass("is-open");
                    $this.parents(".d-js-dropdown").find(".d-dropdown__trigger").removeClass("is-checked");
                } else if (isUnSelectable) {
                    if (!isSelected) {
                        unSelectItems($dropdown);
                        selectItem($this);
                    } else {
                        unSelectItem($this);
                    }
                    $this.parents(".d-js-dropdown").removeClass("is-open");
                    $this.parents(".d-js-dropdown").find(".d-dropdown__trigger").removeClass("is-checked");
                } else if (isMultiSelectable) {
                    if (!isSelected) {
                        selectItem($this);
                    } else {
                        unSelectItem($this);
                    }
                } else {
                    $this.parents(".d-js-dropdown").removeClass("is-open");
                    $this.parents(".d-js-dropdown").find(".d-dropdown__trigger").removeClass("is-checked");
                }
            }
            updateTriggerValue($dropdown);
        });
        $(document).on('click', '.d-dropdown__menu-actions-action_select-all', function (e) {
            var $this = $(this);
            var $dropdown = $this.parents(settings.dropdownSelector);
            var isMultiSelectable = $dropdown.data("mode") == settings.multiselectable;
            if (isMultiSelectable) {
                selectItems($dropdown);
                updateTriggerValue($dropdown);
            }  else {
                console.log("error log: all dropdown options can't be selected");
            }
        });
        $(document).on('click', '.d-dropdown__menu-actions-action_select-none', function (e) {
            var $this = $(this);
            var $dropdown = $this.parents(settings.dropdownSelector);
            var isUnSelectable = $dropdown.data("mode") == settings.unselectable;
            var isMultiSelectable = $dropdown.data("mode") == settings.multiselectable;
            if (isUnSelectable || isMultiSelectable) {
                unSelectItems($dropdown);
                updateTriggerValue($dropdown);
            } else {
                console.log("error log: dropdown options can't be unselected");
            }
        });
    };

    $(".d-js-dropdown").dDropdown();
}(jQuery)); var dplModal = angular.module('dplModal', ['ngAnimate', 'ui.bootstrap', 'template/modal.html']);


angular.module('template/modal.html', []).run(['$templateCache', function ($templateCache) {
    'use strict';

    //TODO: add differernts d-modal__header

    $templateCache.put('template/modal.html',
        "<div class='d-modal' ng-click='close($event)' modal-render='{{$isRendered}}' tabindex='-1' role='dialog' ng-class=\"{'d-modal_in': animate}\" modal-animation-class='d-modal_fade' modal-in-class='d-modal_in' ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\">" +
        "<div class='d-modal__dialog'>" +
        "<div class='d-modal__header'></div>" +
        "<div class='d-modal__content'></div>" +
        "<div class='d-modal__footer'> " +
        "</div>" +
        "</div>" +
        "</div>");
}]); ;(function () {
    angular.module("dRippleEffect", [])
        .directive("dRipple", function () {
            "use strict";
            return {
                restrict: "A",
                replace: true,
                controller: ['$scope', function ($scope) {
                    function isWindow(obj) {
                        return obj !== null && obj === obj.window;
                    }

                    function getWindow(elem) {
                        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
                    }

                    function offset(elem) {
                        var docElem, win,
                            box = {
                                top: 0,
                                left: 0
                            },
                            doc = elem && elem.ownerDocument;

                        docElem = doc.documentElement;

                        if (typeof elem.getBoundingClientRect !== typeof undefined) {
                            box = elem.getBoundingClientRect();
                        }
                        win = getWindow(doc);
                        return {
                            top: box.top + win.pageYOffset - docElem.clientTop,
                            left: box.left + win.pageXOffset - docElem.clientLeft
                        };
                    }

                    function convertStyle(obj) {
                        var style = '';
                        for (var a in obj) {
                            if (obj.hasOwnProperty(a)) {
                                style += (a + ':' + obj[a] + ';');
                            }
                        }
                        return style;
                    }

                    var Effect = {
                        duration: 900,
                        show: function (e, element) {
                            if (e.button === 2) {
                                return false;
                            }
                            var el = element || this,
                                ripple = document.createElement('div');
                            ripple.className = 'd-ripple__effect';
                            el.appendChild(ripple);

                            // Get click coordinate and element width
                            var pos = offset(el),
                                relativeY = (e.pageY - pos.top),
                                relativeX = (e.pageX - pos.left),
                                scale = 'scale(' + ((el.clientWidth / 100) * 10) + ')';

                            // Support for touch devices
                            if ('touches' in e) {
                                relativeY = (e.touches[0].pageY - pos.top);
                                relativeX = (e.touches[0].pageX - pos.left);
                            }

                            // Attach data to element
                            ripple.setAttribute('data-hold', Date.now());
                            ripple.setAttribute('data-scale', scale);
                            ripple.setAttribute('data-x', relativeX);
                            ripple.setAttribute('data-y', relativeY);

                            // Set ripple position
                            var rippleStyle = {
                                top: relativeY + 'px',
                                left: relativeX + 'px'
                            };

                            ripple.className = ripple.className + ' ripple-notransition';
                            ripple.setAttribute('style', convertStyle(rippleStyle));
                            ripple.className = ripple.className.replace('ripple-notransition', '');

                            // Scale the ripple
                            rippleStyle['-webkit-transform'] = scale;
                            rippleStyle['-moz-transform'] = scale;
                            rippleStyle['-ms-transform'] = scale;
                            rippleStyle['-o-transform'] = scale;
                            rippleStyle.transform = scale;
                            rippleStyle.opacity = '1';

                            rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
                            rippleStyle['-moz-transition-duration'] = Effect.duration + 'ms';
                            rippleStyle['-o-transition-duration'] = Effect.duration + 'ms';
                            rippleStyle['transition-duration'] = Effect.duration + 'ms';

                            rippleStyle['-webkit-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
                            rippleStyle['-moz-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
                            rippleStyle['-o-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
                            rippleStyle['transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
                            ripple.setAttribute('style', convertStyle(rippleStyle));
                        },

                        hide: function (e) {
                            TouchHandler.touchup(e);
                            var el = this,
                                width = el.clientWidth * 1.4,
                                ripple = null,
                                ripples = el.getElementsByClassName('d-ripple__effect');

                            if (ripples.length > 0) {
                                ripple = ripples[ripples.length - 1];
                            } else {
                                return false;
                            }

                            var relativeX = ripple.getAttribute('data-x'),
                                relativeY = ripple.getAttribute('data-y'),
                                scale = ripple.getAttribute('data-scale'),
                                diff = Date.now() - Number(ripple.getAttribute('data-hold')),
                                delay = 350 - diff;

                            if (delay < 0) {
                                delay = 0;
                            }

                            setTimeout(function () {
                                var style = {
                                    top: relativeY + 'px',
                                    left: relativeX + 'px',
                                    opacity: '0',

                                    '-webkit-transition-duration': Effect.duration + 'ms',
                                    '-moz-transition-duration': Effect.duration + 'ms',
                                    '-o-transition-duration': Effect.duration + 'ms',
                                    'transition-duration': Effect.duration + 'ms',
                                    '-webkit-transform': scale,
                                    '-moz-transform': scale,
                                    '-ms-transform': scale,
                                    '-o-transform': scale,
                                    transform: scale
                                };

                                ripple.setAttribute('style', convertStyle(style));
                                setTimeout(function () {
                                    try {
                                        el.removeChild(ripple);
                                    } catch (e) {
                                        return false;
                                    }
                                }, Effect.duration);
                            }, delay);
                        }
                    };
                    /**
                     * Disable mousedown event for 500ms during and after touch
                     */
                    var TouchHandler = {
                        touches: 0,
                        allowEvent: function (e) {
                            var allow = true;

                            if (e.type === 'touchstart') {
                                TouchHandler.touches += 1; //push
                            } else if (e.type === 'touchend' || e.type === 'touchcancel') {
                                setTimeout(function () {
                                    if (TouchHandler.touches > 0) {
                                        TouchHandler.touches -= 1; //pop after 500ms
                                    }
                                }, 500);
                            } else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
                                allow = false;
                            }

                            return allow;
                        },
                        touchup: function (e) {
                            TouchHandler.allowEvent(e);
                        }
                    };


                    /**
                     * Delegated click handler for .d-ripple element.
                     * returns null when .d-ripple element not in "click tree"
                     */
                    function getRippleEffectElement(e) {
                        if (TouchHandler.allowEvent(e) === false) {
                            return null;
                        }
                        var element = null,
                            target = e.target || e.srcElement;

                        if (target.parentElement == undefined) {
                            return null;
                        }

                        while (target.parentElement !== null) {
                            if (!(target instanceof SVGElement) && target.hasAttribute('d-ripple')) {
                                element = target;
                                break;
                            }
                            target = target.parentElement;
                        }
                        return element;
                    }

                    /**
                     * Bubble the click and show effect if .d-ripple elem was found
                     */
                    $scope.showEffect = function showEffect(e) {
                        var element = getRippleEffectElement(e);
                        if (element !== null) {
                            Effect.show(e, element);
                            if ('ontouchstart' in window) {
                                element.addEventListener('touchend', Effect.hide, false);
                                element.addEventListener('touchcancel', Effect.hide, false);
                            }

                            element.addEventListener('mouseup', Effect.hide, false);
                            element.addEventListener('mouseleave', Effect.hide, false);
                        }
                    }
                }],
                link: function ($scope, element) {
                    if ('ontouchstart' in window) {
                        element.on("touchstart", $scope.showEffect);
                    }
                    element.on("mousedown", $scope.showEffect);

                    $scope.$on("$destroy", function() {
                        if ('ontouchstart' in window) {
                            element.off("touchstart", $scope.showEffect);
                        }
                        element.off("mousedown", $scope.showEffect);
                    });
                }
            };
        })

}()); /*
 jQuery UI Slider plugin wrapper
*/
var dplRangeSlider = angular.module('dplRangeSlider', ['ui.slider']);
 'use strict';

var dplSplitter = angular.module('dplSplitter', ['ui.layout']);

/**
 * UI.Layout - http://angular-ui.github.io/ui-layout/
 */
angular.module('ui.layout', [])
  .controller('uiLayoutCtrl', ['$scope', '$attrs', '$element', '$timeout', '$window', 'LayoutContainer', function uiLayoutCtrl($scope, $attrs, $element, $timeout, $window, LayoutContainer) {
    var ctrl = this;
    var opts = angular.extend({}, $scope.$eval($attrs.uiLayout), $scope.$eval($attrs.options));
    var numOfSplitbars = 0;
    //var cache = {};
    var animationFrameRequested;
    var lastPos;

    // regex to verify size is properly set to pixels or percent
    var sizePattern = /\d+\s*(px|%)\s*$/i;

    ctrl.containers = [];
    ctrl.movingSplitbar = null;
    ctrl.bounds = $element[0].getBoundingClientRect();
    ctrl.isUsingColumnFlow = opts.flow === 'column';
    ctrl.sizeProperties = !ctrl.isUsingColumnFlow ?
    { sizeProperty: 'height', offsetSize: 'offsetHeight', offsetPos: 'top', flowProperty: 'top', oppositeFlowProperty: 'bottom', mouseProperty: 'clientY', flowPropertyPosition: 'y' } :
    { sizeProperty: 'width', offsetSize: 'offsetWidth', offsetPos: 'left', flowProperty: 'left', oppositeFlowProperty: 'right', mouseProperty: 'clientX', flowPropertyPosition: 'x' };

    $element
      // Force the layout to fill the parent space
      // fix no height layout...
      .addClass('stretch')
      // set the layout css class
      .addClass('ui-layout-' + (opts.flow || 'row'));

    if (opts.disableToggle) {
      $element.addClass('no-toggle');
    }
    if (opts.disableMobileToggle) {
      $element.addClass('no-mobile-toggle');
    }

    // Initial global size definition
    opts.sizes = opts.sizes || [];
    opts.maxSizes = opts.maxSizes || [];
    opts.minSizes = opts.minSizes || [];
    opts.dividerSize = opts.dividerSize || 10; //default divider size set to 10
    opts.collapsed = opts.collapsed || [];
    ctrl.opts = opts;

    $scope.updateDisplay = function() {
      ctrl.updateDisplay();
    };

    var debounceEvent;
    function draw() {
      var position = ctrl.sizeProperties.flowProperty;
      var dividerSize = parseInt(opts.dividerSize);
      var elementSize = $element[0][ctrl.sizeProperties.offsetSize];

      if(ctrl.movingSplitbar !== null) {
        var splitbarIndex = ctrl.containers.indexOf(ctrl.movingSplitbar);
        var nextSplitbarIndex = (splitbarIndex + 2) < ctrl.containers.length ? splitbarIndex + 2 : null;

        if(splitbarIndex > -1) {
          var processedContainers = ctrl.processSplitbar(ctrl.containers[splitbarIndex]);
          var beforeContainer = processedContainers.beforeContainer;
          var afterContainer = processedContainers.afterContainer;

          if(!beforeContainer.collapsed && !afterContainer.collapsed) {
            // calculate container positons
            var difference = ctrl.movingSplitbar[position] - lastPos;
            var newPosition = ctrl.movingSplitbar[position] - difference;

            // Keep the bar in the window (no left/top 100%)
            newPosition = Math.min(elementSize-dividerSize, newPosition);

            // Keep the bar from going past the previous element min/max values
            if(angular.isNumber(beforeContainer.beforeMinValue) && newPosition < beforeContainer.beforeMinValue) newPosition = beforeContainer.beforeMinValue;
            if(angular.isNumber(beforeContainer.beforeMaxValue) && newPosition > beforeContainer.beforeMaxValue) newPosition = beforeContainer.beforeMaxValue;

            // Keep the bar from going past the next element min/max values
            if(afterContainer !== null &&
               angular.isNumber(afterContainer.afterMinValue) &&
               newPosition > (afterContainer.afterMinValue - dividerSize))
                newPosition = afterContainer.afterMinValue - dividerSize;
            if(afterContainer !== null && angular.isNumber(afterContainer.afterMaxValue) && newPosition < afterContainer.afterMaxValue) newPosition = afterContainer.afterMaxValue;

            // resize the before container
            beforeContainer.size = newPosition - beforeContainer[position];

            // update after container position
            var oldAfterContainerPosition = afterContainer[position];
            afterContainer[position] = newPosition + dividerSize;

            //update after container size if the position has changed
            if(afterContainer[position] != oldAfterContainerPosition)
              afterContainer.size = (nextSplitbarIndex !== null) ? (oldAfterContainerPosition + afterContainer.size) - (newPosition + dividerSize) : elementSize - (newPosition + dividerSize);

            // move the splitbar
            ctrl.movingSplitbar[position] = newPosition;

            // broadcast an event that resize happened (debounced to 50ms)
            if(debounceEvent) $timeout.cancel(debounceEvent);
            debounceEvent = $timeout(function() {
                $scope.$broadcast('ui.layout.resize', beforeContainer, afterContainer);
                debounceEvent = null;
            }, 50);
          }
        }
      }

      //Enable a new animation frame
      animationFrameRequested = null;
    }

    function offset(element) {
      var rawDomNode = element[0];
      var body = document.documentElement || document.body;
      var scrollX = window.pageXOffset || body.scrollLeft;
      var scrollY = window.pageYOffset || body.scrollTop;
      var clientRect = rawDomNode.getBoundingClientRect();
      var x = clientRect.left + scrollX;
      var y = clientRect.top + scrollY;
      return { left: x, top: y };
    }

    /**
     * Returns the current value for an option
     * @param  option   The option to get the value for
     * @return The value of the option. Returns null if there was no option set.
     */
    function optionValue(option) {
      if(typeof option == 'number' || typeof option == 'string' && option.match(sizePattern)) {
        return option;
      } else {
        return null;
      }
    }

    //================================================================================
    // Public Controller Functions
    //================================================================================
    ctrl.mouseUpHandler = function(event) {
      if(ctrl.movingSplitbar !== null) {
        ctrl.movingSplitbar = null;
      }
      return event;
    };

    ctrl.mouseMoveHandler = function(mouseEvent) {
      var mousePos = mouseEvent[ctrl.sizeProperties.mouseProperty] ||
        (mouseEvent.originalEvent && mouseEvent.originalEvent[ctrl.sizeProperties.mouseProperty]) ||
        // jQuery does touches weird, see #82
        ($window.jQuery ?
          (mouseEvent.originalEvent ? mouseEvent.originalEvent.targetTouches[0][ctrl.sizeProperties.mouseProperty] : 0) :
          (mouseEvent.targetTouches ? mouseEvent.targetTouches[0][ctrl.sizeProperties.mouseProperty] : 0));

      lastPos = mousePos - offset($element)[ctrl.sizeProperties.offsetPos];

      //Cancel previous rAF call
      if(animationFrameRequested) {
        window.cancelAnimationFrame(animationFrameRequested);
      }

      //TODO: cache layout values

      //Animate the page outside the event
      animationFrameRequested = window.requestAnimationFrame(draw);
    };

    /**
     * Returns the min and max values of the ctrl.containers on each side of the container submitted
     * @param container
     * @returns {*}
     */
    ctrl.processSplitbar = function(container) {
      var index = ctrl.containers.indexOf(container);

      var setValues = function(container) {
        var start = container[ctrl.sizeProperties.flowProperty];
        var end = container[ctrl.sizeProperties.flowProperty] + container.size;

        container.beforeMinValue = angular.isNumber(container.minSize) ? start + container.minSize : start;
        container.beforeMaxValue = angular.isNumber(container.maxSize) ? start + container.maxSize : null;

        container.afterMinValue = angular.isNumber(container.minSize) ? end - container.minSize : end;
        container.afterMaxValue = angular.isNumber(container.maxSize) ? end - container.maxSize : null;
      };

      //verify the container was found in the list
      if(index > -1) {
        var beforeContainer = (index > 0) ? ctrl.containers[index-1] : null;
        var afterContainer = ((index+1) <= ctrl.containers.length) ? ctrl.containers[index+1] : null;

        if(beforeContainer !== null) setValues(beforeContainer);
        if(afterContainer !== null) setValues(afterContainer);

        return {
          beforeContainer: beforeContainer,
          afterContainer: afterContainer
        };
      }

      return null;
    };

    /**
     * Checks if a string has a percent symbol in it.
     * @param num
     * @returns {boolean}
     */
    ctrl.isPercent = function(num) {
      return (num && angular.isString(num) && num.indexOf('%') > -1) ? true : false;
    };

    /**
     * Converts a number to pixels from percent.
     * @param size
     * @param parentSize
     * @returns {number}
     */
    ctrl.convertToPixels = function(size, parentSize) {
      return Math.floor(parentSize * (parseInt(size) / 100));
    };

    /**
     * Sets the default size for each container.
     */
    ctrl.updateDisplay = function() {
      var c, i;
      var dividerSize = parseInt(opts.dividerSize);
      var elementSize = $element[0].getBoundingClientRect()[ctrl.sizeProperties.sizeProperty];
      var availableSize = elementSize - (dividerSize * numOfSplitbars);
      var originalSize = availableSize;
      var usedSpace = 0;
      var numOfAutoContainers = 0;

      if(ctrl.containers.length > 0 && $element.children().length > 0) {

        // calculate sizing for ctrl.containers
        for(i=0; i < ctrl.containers.length; i++) {
          if(!LayoutContainer.isSplitbar(ctrl.containers[i])) {

            var child = ctrl.containers[i].element;
            opts.maxSizes[i] = child.attr('max-size') || child.attr('data-max-size') || opts.maxSizes[i] || null;
            opts.minSizes[i] = child.attr('min-size') || child.attr('data-min-size') || opts.minSizes[i] || null;
            opts.sizes[i] = child.attr('size') || child.attr('data-size') || opts.sizes[i] || 'auto';
            //opts.collapsed[i] = child.attr('collapsed') || opts.collapsed[i] || false;


            opts.sizes[i] = optionValue(opts.sizes[i]) || 'auto';
            opts.minSizes[i] = optionValue(opts.minSizes[i]);
            opts.maxSizes[i] = optionValue(opts.maxSizes[i]);

            if(opts.sizes[i] != 'auto') {
              if(ctrl.isPercent(opts.sizes[i])) {
                opts.sizes[i] = ctrl.convertToPixels(opts.sizes[i], originalSize);
              } else {
                opts.sizes[i] = parseInt(opts.sizes[i]);
              }
            }

            if(opts.minSizes[i] != null) {
              if(ctrl.isPercent(opts.minSizes[i])) {
                opts.minSizes[i] = ctrl.convertToPixels(opts.minSizes[i], originalSize);
              } else {
                opts.minSizes[i] = parseInt(opts.minSizes[i]);
              }

              // don't allow the container size to initialize smaller than the minSize
              if(opts.sizes[i] < opts.minSizes[i]) opts.sizes[i] = opts.minSizes[i];
            }

            if(opts.maxSizes[i] != null) {
              if(ctrl.isPercent(opts.maxSizes[i])) {
                opts.maxSizes[i] = ctrl.convertToPixels(opts.maxSizes[i], originalSize);
              } else {
                opts.maxSizes[i] = parseInt(opts.maxSizes[i]);
              }

              // don't allow the container size to intialize larger than the maxSize
              if(opts.sizes[i] > opts.maxSizes[i]) opts.sizes[i] = opts.maxSizes[i];
            }

            if(opts.sizes[i] === 'auto') {
              numOfAutoContainers++;
            } else {
              availableSize -= opts.sizes[i];
            }
          }
        }

        // set the sizing for the ctrl.containers
        var autoSize = Math.floor(availableSize / numOfAutoContainers);
        for(i=0; i < ctrl.containers.length; i++) {
          c = ctrl.containers[i];
          c[ctrl.sizeProperties.flowProperty] = usedSpace;
          c.maxSize = opts.maxSizes[i];
          c.minSize = opts.minSizes[i];

          c.collapsed = c.collapsed || opts.collapsed[i];

          //TODO: adjust size if autosize is greater than the maxSize

          if(!LayoutContainer.isSplitbar(c)) {
            var newSize = (opts.sizes[i] === 'auto') ? autoSize : opts.sizes[i];

            c.size = (newSize !== null) ? newSize : autoSize;
          } else {
            c.size = dividerSize;
          }

          usedSpace += c.size;
        }
      }
    };

    /**
     * Adds a container to the list of layout ctrl.containers.
     * @param container The container to add
     */
    ctrl.addContainer = function(container) {
      var index = ctrl.indexOfElement(container.element);
      if(!angular.isDefined(index) || index < 0 || ctrl.containers.length < index) {
        console.error("Invalid index to add container; i=" + index + ", len=", ctrl.containers.length);
        return;
      }

      if(LayoutContainer.isSplitbar(container)) {
        numOfSplitbars++;
      }

      ctrl.containers.splice(index, 0, container);

      ctrl.updateDisplay();
    };

    /**
     * Remove a container from the list of layout ctrl.containers.
     * @param  container
     */
    ctrl.removeContainer = function(container) {
      var index = ctrl.containers.indexOf(container);
      if(index >= 0) {
        if(!LayoutContainer.isSplitbar(container)) {
          if(ctrl.containers.length > 2) {
            // Assume there's a sidebar between each container
            // We need to remove this container and the sidebar next to it
            if(index == ctrl.containers.length - 1) {
              // We're removing the last element, the side bar is on the left
              ctrl.containers[index-1].element.remove();
            } else {
              // The side bar is on the right
              ctrl.containers[index+1].element.remove();
            }
          }
        } else {
          // fix for potentially collapsed containers
          ctrl.containers[index - 1].collapsed = false;
          numOfSplitbars--;
        }

        // Need to re-check the index, as a side bar may have been removed
        var newIndex = ctrl.containers.indexOf(container);
        if(newIndex >= 0) {
          ctrl.containers.splice(newIndex, 1);
        }
        ctrl.updateDisplay();
      } else {
        console.error("removeContainer for container that did not exist!");
      }
    };

    /**
     * Returns an array of layout ctrl.containers.
     * @returns {Array}
     */
    ctrl.getContainers = function() {
      return ctrl.containers;
    };

    /**
     * Toggles the container before the provided splitbar
     * @param splitbar
     * @returns {boolean|*|Array}
     */
    ctrl.toggleBefore = function(splitbar) {
      var index = ctrl.containers.indexOf(splitbar) - 1;

      var c = ctrl.containers[index];
      c.collapsed = !ctrl.containers[index].collapsed;

      var nextSplitbar = ctrl.containers[index+1];
      var nextContainer = ctrl.containers[index+2];

      $scope.$apply(function() {
        if(c.collapsed) {
          c.actualSize = c.size;
          c.size = 0;

          if(nextSplitbar) nextSplitbar[ctrl.sizeProperties.flowProperty] -= c.actualSize;
          if(nextContainer) {
            nextContainer[ctrl.sizeProperties.flowProperty] -= c.actualSize;
            nextContainer.size += c.actualSize;
          }

        } else {
          c.size = c.actualSize;

          if(nextSplitbar) nextSplitbar[ctrl.sizeProperties.flowProperty] += c.actualSize;
          if(nextContainer) {
            nextContainer[ctrl.sizeProperties.flowProperty] += c.actualSize;
            nextContainer.size -= c.actualSize;
          }
        }
      });
      $scope.$broadcast('ui.layout.toggle', c);

      return c.collapsed;
    };

    /**
     * Toggles the container after the provided splitbar
     * @param splitbar
     * @returns {boolean|*|Array}
     */
    ctrl.toggleAfter = function(splitbar) {
      var index = ctrl.containers.indexOf(splitbar) + 1;
      var c = ctrl.containers[index];
      var prevSplitbar = ctrl.containers[index-1];
      var prevContainer = ctrl.containers[index-2];
      var isLastContainer = index === (ctrl.containers.length - 1);
      var endDiff;

      ctrl.bounds = $element[0].getBoundingClientRect();

      c.collapsed = !ctrl.containers[index].collapsed;

      $scope.$apply(function() {
        if(c.collapsed) {
          c.actualSize = c.size;
          c.size = 0;

          // adds additional space so the splitbar moves to the very end of the container
          // to offset the lost space when converting from percents to pixels
          endDiff = (isLastContainer) ? ctrl.bounds[ctrl.sizeProperties.sizeProperty] - c[ctrl.sizeProperties.flowProperty] - c.actualSize : 0;

          if(prevSplitbar) prevSplitbar[ctrl.sizeProperties.flowProperty] += (c.actualSize + endDiff);
          if(prevContainer) prevContainer.size += (c.actualSize + endDiff);

        } else {
          c.size = c.actualSize;

          // adds additional space so the splitbar moves back to the proper position
          // to offset the additional space added when collapsing
          endDiff = (isLastContainer) ? ctrl.bounds[ctrl.sizeProperties.sizeProperty] - c[ctrl.sizeProperties.flowProperty] - c.actualSize : 0;

          if(prevSplitbar) prevSplitbar[ctrl.sizeProperties.flowProperty] -= (c.actualSize + endDiff);
          if(prevContainer) prevContainer.size -= (c.actualSize + endDiff);
        }
      });
      $scope.$broadcast('ui.layout.toggle', c);

      return c.collapsed;
    };

    /**
     * Returns the container object of the splitbar that is before the one passed in.
     * @param currentSplitbar
     */
    ctrl.getPreviousSplitbarContainer = function(currentSplitbar) {
      if(LayoutContainer.isSplitbar(currentSplitbar)) {
        var currentSplitbarIndex = ctrl.containers.indexOf(currentSplitbar);
        var previousSplitbarIndex = currentSplitbarIndex - 2;
        if(previousSplitbarIndex >= 0) {
          return ctrl.containers[previousSplitbarIndex];
        }
        return null;
      }
      return null;
    };

    /**
     * Returns the container object of the splitbar that is after the one passed in.
     * @param currentSplitbar
     */
    ctrl.getNextSplitbarContainer = function(currentSplitbar) {
      if(LayoutContainer.isSplitbar(currentSplitbar)) {
        var currentSplitbarIndex = ctrl.containers.indexOf(currentSplitbar);
        var nextSplitbarIndex = currentSplitbarIndex + 2;
        if(currentSplitbarIndex > 0 && nextSplitbarIndex < ctrl.containers.length) {
          return ctrl.containers[nextSplitbarIndex];
        }
        return null;
      }
      return null;
    };

    /**
     * Checks whether the container before this one is a split bar
     * @param  {container}  container The container to check
     * @return {Boolean}    true if the element before is a splitbar, false otherwise
     */
    ctrl.hasSplitbarBefore = function(container) {
      var index = ctrl.containers.indexOf(container);
      if(1 <= index) {
        return LayoutContainer.isSplitbar(ctrl.containers[index-1]);
      }

      return false;
    };

    /**
     * Checks whether the container after this one is a split bar
     * @param  {container}  container The container to check
     * @return {Boolean}    true if the element after is a splitbar, false otherwise
     */
    ctrl.hasSplitbarAfter = function(container) {
      var index = ctrl.containers.indexOf(container);
      if(index < ctrl.containers.length - 1) {
        return LayoutContainer.isSplitbar(ctrl.containers[index+1]);
      }

      return false;
    };

    /**
     * Checks whether the passed in element is a ui-layout type element.
     * @param  {element}  element The element to check
     * @return {Boolean}          true if the element is a layout element, false otherwise.
     */
    ctrl.isLayoutElement = function(element) {
      return element.hasAttribute('ui-layout-container') || element.hasAttribute('ui-splitbar') || element.nodeName === 'UI-LAYOUT-CONTAINER';
    };

    /**
     * Retrieve the index of an element within it's parents context.
     * @param  {element} element The element to get the index of
     * @return {int}             The index of the element within it's parent
     */
    ctrl.indexOfElement = function(element) {
      var parent = element.parent();
      var children = parent.children();
      var containerIndex = 0;
      for(var i = 0; i < children.length; i++) {
        var child = children[i];
        if(ctrl.isLayoutElement(child)) {
          if(element[0] == children[i]) {
            return containerIndex;
          }
          containerIndex++;
        }
      }
      return -1;
    };

    return ctrl;
  }])

  .directive('uiLayout', ['$window', function($window) {
    return {
      restrict: 'AE',
      controller: 'uiLayoutCtrl',
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function () {
          return element[0][ctrl.sizeProperties.offsetSize];
        }, function() {
          ctrl.updateDisplay();
        });

        function onResize() {
          scope.$evalAsync(function() {
            ctrl.updateDisplay();
          });
        }

        angular.element($window).bind('resize', onResize);

        scope.$on('$destroy', function() {
          angular.element($window).unbind('resize', onResize);
        });
      }
    };
  }])

  .directive('uiSplitbar', ['LayoutContainer', function(LayoutContainer) {
    // Get all the page.
    var htmlElement = angular.element(document.body.parentElement);

    return {
      restrict: 'EAC',
      require: '^uiLayout',
      scope: {},

      link: function(scope, element, attrs, ctrl) {
        if(!element.hasClass('stretch')) element.addClass('stretch');
        if(!element.hasClass('ui-splitbar')) element.addClass('ui-splitbar');

        scope.splitbar = LayoutContainer.Splitbar();
        scope.splitbar.element = element;

        //icon <a> elements
        var prevButton = angular.element(element.children()[0]);
        var afterButton = angular.element(element.children()[2]);

	    var splitterMark = angular.element(element.children()[1]);
        //icon <span> elements
        var prevIcon = angular.element(prevButton.children()[0]);
        var afterIcon = angular.element(afterButton.children()[0]);

        //icon classes

	    var iconLeft = 'ui-splitbar-icon-left';
		var iconRight = 'ui-splitbar-icon-right';
		var iconUp = 'ui-splitbar-icon-up';
        var iconDown = 'ui-splitbar-icon-down';

        var prevIconClass = ctrl.isUsingColumnFlow ? iconLeft : iconUp;
        var afterIconClass = ctrl.isUsingColumnFlow ? iconRight : iconDown;

        prevIcon.addClass(prevIconClass);
        afterIcon.addClass(afterIconClass);

        prevButton.on('click', function() {
          var prevSplitbarBeforeButton, prevSplitbarAfterButton;
          var result = ctrl.toggleBefore(scope.splitbar);
          var previousSplitbar = ctrl.getPreviousSplitbarContainer(scope.splitbar);

          if(previousSplitbar !== null) {
            prevSplitbarBeforeButton = angular.element(previousSplitbar.element.children()[0]);
            prevSplitbarAfterButton = angular.element(previousSplitbar.element.children()[2]);
          }

          if(ctrl.isUsingColumnFlow) {
            if(result) {
              afterButton.css('display', 'none');
              prevIcon.removeClass(iconLeft);
              prevIcon.addClass(iconRight);
				//splitterMark.css('display', 'none');

              // hide previous splitbar buttons
              if(previousSplitbar !== null) {
                prevSplitbarBeforeButton.css('display', 'none');
                prevSplitbarAfterButton.css('display', 'none');
				  //splitterMark.css('display', 'none');
              }
            } else {
              afterButton.css('display', 'inline');
              prevIcon.removeClass(iconRight);
              prevIcon.addClass(iconLeft);
				//splitterMark.css('display', 'inline');

              // show previous splitbar icons
              if(previousSplitbar !== null) {
                prevSplitbarBeforeButton.css('display', 'inline');
                prevSplitbarAfterButton.css('display', 'inline');
				  //splitterMark.css('display', 'inline');
              }
            }
          } else {
            if(result) {
              afterButton.css('display', 'none');
              prevIcon.removeClass(iconUp);
              prevIcon.addClass(iconDown);
				//splitterMark.css('display', 'none');

              // hide previous splitbar buttons
              if(previousSplitbar !== null) {
                prevSplitbarBeforeButton.css('display', 'none');
                prevSplitbarAfterButton.css('display', 'none');
				  //splitterMark.css('display', 'none');
              }
            } else {
              afterButton.css('display', 'inline');
              prevIcon.removeClass(iconDown);
              prevIcon.addClass(iconUp);
				//splitterMark.css('display', 'inline');

              // show previous splitbar icons
              if(previousSplitbar !== null) {
                prevSplitbarBeforeButton.css('display', 'inline');
                prevSplitbarAfterButton.css('display', 'inline');
				  //splitterMark.css('display', 'inline');
              }
            }
          }
        });

        afterButton.on('click', function() {
          var nextSplitbarBeforeButton, nextSplitbarAfterButton;
          var result = ctrl.toggleAfter(scope.splitbar);
          var nextSplitbar = ctrl.getNextSplitbarContainer(scope.splitbar);

          if(nextSplitbar !== null) {
            nextSplitbarBeforeButton = angular.element(nextSplitbar.element.children()[0]);
            nextSplitbarAfterButton = angular.element(nextSplitbar.element.children()[1]);
          }

          if(ctrl.isUsingColumnFlow) {
            if(result) {
              prevButton.css('display', 'none');
              afterIcon.removeClass(iconRight);
              afterIcon.addClass(iconLeft);

              // hide next splitbar buttons
              if(nextSplitbar !== null) {
                nextSplitbarBeforeButton.css('display', 'none');
                nextSplitbarAfterButton.css('display', 'none');
              }
            } else {
              prevButton.css('display', 'inline');
              afterIcon.removeClass(iconLeft);
              afterIcon.addClass(iconRight);

              // show next splitbar buttons
              if(nextSplitbar !== null) {
                nextSplitbarBeforeButton.css('display', 'inline');
                nextSplitbarAfterButton.css('display', 'inline');
              }
            }
          } else {
            if(result) {
              prevButton.css('display', 'none');
              afterIcon.removeClass(iconDown);
              afterIcon.addClass(iconUp);

              // hide next splitbar buttons
              if(nextSplitbar !== null) {
                nextSplitbarBeforeButton.css('display', 'none');
                nextSplitbarAfterButton.css('display', 'none');
              }
            } else {
              prevButton.css('display', 'inline');
              afterIcon.removeClass(iconUp);
              afterIcon.addClass(iconDown);

              // show next splitbar buttons
              if(nextSplitbar !== null) {
                nextSplitbarBeforeButton.css('display', 'inline');
                nextSplitbarAfterButton.css('display', 'inline');
              }
            }
          }
        });

        element.on('mousedown touchstart', function(e) {
          ctrl.movingSplitbar = scope.splitbar;
          ctrl.processSplitbar(scope.splitbar);

          e.preventDefault();
          e.stopPropagation();

          htmlElement.on('mousemove touchmove', function(event) {
            scope.$apply(angular.bind(ctrl, ctrl.mouseMoveHandler, event));
          });
          return false;
        });

        htmlElement.on('mouseup touchend', function(event) {
          scope.$apply(angular.bind(ctrl, ctrl.mouseUpHandler, event));
          htmlElement.off('mousemove touchmove');
        });

        scope.$watch('splitbar.size', function(newValue) {
          element.css(ctrl.sizeProperties.sizeProperty, newValue + 'px');
        });

        scope.$watch('splitbar.' + ctrl.sizeProperties.flowProperty, function(newValue) {
          element.css(ctrl.sizeProperties.flowProperty, newValue + 'px');
        });

        scope.$on('$destroy', function() {
          htmlElement.off('mouseup touchend mousemove touchmove');
        });

        //Add splitbar to layout container list
        ctrl.addContainer(scope.splitbar);

        element.on('$destroy', function() {
          ctrl.removeContainer(scope.splitbar);
          scope.$evalAsync();
        });
      }
    };

  }])

  .directive('uiLayoutContainer', ['LayoutContainer', '$compile', function(LayoutContainer, $compile) {
    return {
      restrict: 'AE',
      require: '^uiLayout',
      scope: {},

      compile: function() {
        return {
          pre: function(scope, element, attrs, ctrl) {
            scope.container = LayoutContainer.Container();
            scope.container.element = element;

            ctrl.addContainer(scope.container);

            element.on('$destroy', function() {
              ctrl.removeContainer(scope.container);
              scope.$evalAsync();
            });
          },
          post: function(scope, element, attrs, ctrl) {
            if(!element.hasClass('stretch')) element.addClass('stretch');
            if(!element.hasClass('ui-layout-container')) element.addClass('ui-layout-container');

            scope.$watch('container.size', function(newValue) {
              element.css(ctrl.sizeProperties.sizeProperty, newValue + 'px');
            });

            scope.$watch('container.' + ctrl.sizeProperties.flowProperty, function(newValue) {
              element.css(ctrl.sizeProperties.flowProperty, newValue + 'px');
            });

            //TODO: add ability to disable auto-adding a splitbar after the container
            var parent = element.parent();
            var children = parent.children();
            var index = ctrl.indexOfElement(element);
            var splitbar = angular.element('<div ui-splitbar><a><span class="ui-splitbar-icon"></span></a><span class="splitter-mark"></span><a><span class="ui-splitbar-icon"></span></a></div>');
            if(0 < index && !ctrl.hasSplitbarBefore(scope.container)) {
              angular.element(children[index-1]).after(splitbar);
              $compile(splitbar)(scope);
            } else if(index < children.length - 1) {
              element.after(splitbar);
              $compile(splitbar)(scope);
            }
          }
        };
      }
    };
  }])

  .factory('LayoutContainer', function() {
    // Base container that can be locked and resized
    function BaseContainer() {
      this.size = 0;
      this.maxSize = null;
      this.minSize = 0;
      this.resizable = true;
      this.locked = false;
      this.element = null;
      this.collapsed = false;
    }

    // Splitbar container
    function SplitbarContainer() {
      this.size = 10;
      this.left = 0;
      this.top = 0;
      this.element = null;
    }

    return {
      Container: function(initialSize) {
        return new BaseContainer(initialSize);
      },
      Splitbar: function() {
        return new SplitbarContainer();
      },
      isSplitbar: function(container) {
        return container instanceof SplitbarContainer;
      }
    };
  })
; ;(function() {
    "use strict";

    angular.module("template/tabs/tab.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/tabs/tab.html",
            "<div class=\"d-tabs__tab \" ng-class=\"{'is-checked': active}\"  ng-click=\"select($event)\" uib-tab-heading-transclude>{{heading}}</a>\n");
    }]);

    angular.module("template/tabs/tabset.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("uib/template/tabs/tabset.html",
            "<div>" +
            "   <div class=\"d-tabs__tab-bar\" ng-transclude></div>\n " +
            "   <div class=\"d-tabs__panel\">\n " +
            "       <div  class=\"d-tabs__item\"\n " +
            "               ng-repeat=\"tab in tabset.tabs\"\n " +
            "               ng-class=\"{'is-checked': tabset.active === tab.index}\"\n " +
            "               uib-tab-content-transclude=\"tab\">\n " +
            "       </div>" +
            "   </div>" +
            "</div>" +
            "");
    }]);
}()); 
/* HTML templates */
var dplTagsInput = angular.module('dplTagsInput', ['ngTagsInput']);


dplTagsInput.run(["$templateCache", function($templateCache) {
    $templateCache.put('ngTagsInput/tags-input.html',
        "<div class=\"host d-tags-host\" tabindex=\"-1\" ng-click=\"eventHandlers.host.click()\" ti-transclude-append><div class=\"tags d-input-tags\" ng-class=\"{focused: hasFocus}\"><ul class=\"tag-list\"><li class=\"tag-item d-tag\" ng-repeat=\"tag in tagList.items track by track(tag)\" ng-class=\"{ selected: tag == tagList.selected }\" ng-click=\"eventHandlers.tag.click(tag)\"><ti-tag-item data=\"::tag\"></ti-tag-item></li></ul><input class=\"input\" autocomplete=\"off\" ng-model=\"newTag.text\" ng-model-options=\"{getterSetter: true}\" ng-keydown=\"eventHandlers.input.keydown($event)\" ng-focus=\"eventHandlers.input.focus($event)\" ng-blur=\"eventHandlers.input.blur($event)\" ng-paste=\"eventHandlers.input.paste($event)\" ng-trim=\"false\" ng-class=\"{'invalid-tag': newTag.invalid}\" ng-disabled=\"disabled\" ti-bind-attrs=\"{type: options.type, placeholder: options.placeholder, tabindex: options.tabindex, spellcheck: options.spellcheck}\" ti-autosize></div></div>"
    );

    $templateCache.put('ngTagsInput/tag-item.html',
        "<span ng-bind=\"$getDisplayText()\"></span> <a ng-click=\"$removeTag()\" data-role=\"remove\"></a>"
    );

    $templateCache.put('ngTagsInput/auto-complete.html',
        "<div class=\"autocomplete d-tags-autocomplete\" ng-if=\"suggestionList.visible\"><ul class=\"suggestion-list d-tags-suggestion-list\"><li class=\"suggestion-item d-tags-suggestion-item\" ng-repeat=\"item in suggestionList.items track by track(item)\" ng-class=\"{selected: item == suggestionList.selected}\" ng-click=\"addSuggestionByIndex($index)\" ng-mouseenter=\"suggestionList.select($index)\"><ti-autocomplete-match data=\"::item\"></ti-autocomplete-match></li></ul></div>"
    );

    $templateCache.put('ngTagsInput/auto-complete-match.html',
        "<span ng-bind-html=\"$highlight($getDisplayText())\"></span>"
    );
}]);
 //TODO: check mouse wheel
//TODO: add inline layout, readonly
//TODO: add hex format

var dplCounter = angular.module('dplCounter', ['template/counter.html'])
    .constant('dplCounterConfig', {
        inputLength: 3,
        inlineLayout: false,
        readonlyInput: false,
        templateUrl: 'template/counter.html'
    })
    .controller('dplCounterController', [
        '$scope', '$element', '$attrs', '$parse', 'dplCounterConfig',
        function($scope, $element, $attrs, $parse, dplCounterConfig) {

        var ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl

        $scope.inputLength = angular.isDefined($attrs.inputLength) ? $scope.$parent.$eval($attrs.inputLength) : dplCounterConfig.inputLength;
        $scope.label = angular.isDefined($attrs.label) ? $attrs.label : undefined;
        $scope.labelHidden = angular.isDefined($attrs.labelHidden);
        $scope.minValue = angular.isDefined($attrs.min) ? parseInt($attrs.min, 10) : undefined;
        $scope.maxValue = angular.isDefined($attrs.max) ? parseInt($attrs.max, 10) : undefined;
        $scope.step = angular.isDefined($attrs.step) ? parseInt($attrs.step, 10) : 1;
        $scope.required = angular.isDefined($attrs.required);

        $scope.tabindex = angular.isDefined($attrs.tabindex) ? $attrs.tabindex : 0;
        $element.removeAttr('tabindex');

        function updateValue() {
            ngModelCtrl.$setViewValue($scope.counterValue);
        }

        this.init = function (_ngModel, input) {
            var counterInput = input.eq(0);

            ngModelCtrl = _ngModel;

            ngModelCtrl.$formatters.unshift(function(modelValue) {
                $scope.counterValue = modelValue || 0;

                return modelValue ? modelValue : null;
            });

            counterInput.bind('keyup', function (e) {
                $scope.counterValue = parseInt(this.value, 10);
                updateValue();
            });
        };

        $scope.incrementCounter = function () {
            if ($scope.maxValue) {
                if ($scope.counterValue + $scope.step <= $scope.maxValue) {
                    $scope.counterValue += $scope.step;
                    updateValue();
                }
            } else {
                $scope.counterValue += $scope.step;
                updateValue();
            }
        };

        $scope.decrementCounter = function () {
            if ($scope.minValue) {
                if ($scope.counterValue - $scope.step >= $scope.minValue) {
                    $scope.counterValue -= $scope.step;
                    updateValue();
                }
            } else {
                $scope.counterValue -= $scope.step;
                updateValue();
            }
        };

    }])
    .directive('dplCounter', ['dplCounterConfig', function(dplCounterConfig) {
        return {
            restrict: 'A',
            require: ['dplCounter', '?^ngModel'],
            controller: 'dplCounterController',
            controllerAs: 'counter',
            replace: true,
            scope: {},

            templateUrl: function(element, attrs) {
                return attrs.templateUrl || dplCounterConfig.templateUrl;
            },

            link: function(scope, element, attrs, ctrls) {

                var counterCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                if (ngModelCtrl) {
                    counterCtrl.init(ngModelCtrl, element.find('input'));
                }
            }
        };
    }]);

angular.module('template/counter.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/counter.html',
        "<label class='d-counter d-counter__label ' ng-class='{\"d-counter_required\" : required}'> " +
        "  <span class='d-counter__label_name' ng-class='{\"sr-only\": labelHidden}'>{{label || 'Counter value:'}}</span>" +
        "    <span class='d-counter__unit'>" +
        "    <input class='d-counter__input' type='number' ng-model='counterValue' placeholder='' maxlength='{{inputLength}}' tabindex='{{tabindex}}' " +
        "     step='{{step}}'  min='{{minValue}}' max='{{maxValue}}'/>" +
        "    <span class='d-counter__increase d-icon-angle_up' ng-click='incrementCounter()'></span>" +
        "    <span class='d-counter__decrease d-icon-angle_down' ng-click='decrementCounter()'></span>" +
        "  </span>" +
        "</label>"
    );
}]); var dplTimepicker = angular.module('dplTimepicker', ['ui.bootstrap', 'template/timepicker.html']);

dplTimepicker.config(['$provide', function ($provide) {
    'use strict';

    $provide.decorator('uibTimepickerDirective', ['$delegate', function ($delegate) {
        $delegate[0].templateUrl = 'template/timepicker.html';

        var directive = $delegate[0];

        angular.extend(directive.scope, {
            label: '@',
            error: '@'
        });

        return $delegate;
    }]);
}]);

angular.module('template/timepicker.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/timepicker.html',
        "<div>" +
        "  <label class='d-timepicker__label'>" +
        "      <span class='d-timepicker__label_name' ng-if='label !== undefined'>{{label || 'Pick time:'}}</span>" +
        "      <span class='d-timepicker__unit d-timepicker__unit_hours' ng-class='{hasError: invalidHours}'>" +
        "        <span class='sr-only'>Hours:</span>" +
        "        <input class='d-timepicker__input' type='text' ng-model='hours' ng-change='updateHours()' ng-disabled='noIncrementHours()' placeholder='' maxlength='2' tabindex='{{::tabindex}}' ng-readonly='::readonlyInput' ng-blur='blur()'/>" +
        "        <span class='d-timepicker__increase d-icon-angle_up' ng-click='incrementHours()' ng-class='{\"is-disabled\": noIncrementHours()}' ng-disabled='noIncrementHours()'></span>" +
        "        <span class='d-timepicker__decrease d-icon-angle_down' ng-click='decrementHours()' ng-class='{\"is-disabled\": noDecrementHours()}' ng-disabled='noDecrementHours()'></span>" +
        "        </span>" +
        "    </label>" +
        "    <div class='d-timepicker__unit' ng-class='{hasError: invalidMinutes}'>" +
        "      <label>" +
        "        <span class='sr-only'>Minutes:</span>" +
        "        <input class='d-timepicker__input' type='text' ng-model='minutes' ng-disabled='noIncrementMinutes()' ng-change='updateMinutes()' placeholder='' ng-readonly='::readonlyInput' maxlength='2' tabindex='{{::tabindex}}' ng-blur='blur()'/>" +
        "      </label>" +
        "      <span class='d-timepicker__increase d-icon-angle_up' ng-click='incrementMinutes()' ng-class='{\"is-disabled\": noIncrementMinutes()}' ng-disabled='noIncrementMinutes()'></span>" +
        "      <span class='d-timepicker__decrease d-icon-angle_down' ng-click='decrementMinutes()' ng-class='{\"is-disabled\": noDecrementMinutes()}' ng-disabled='noDecrementMinutes()'></span>" +
        "    </div>" +
        "    <div class='d-timepicker__unit d-timepicker__meridian' ng-show='showMeridian' ng-click='toggleMeridian()'>" +
        "      <label>" +
        "        <span class='sr-only'>AM\\PM (Meridian):</span>" +
        "        <input class='d-timepicker__input' type='text' readonly maxlength='2' value='{{meridian}}' ng-class='{\"is-disabled\": noToggleMeridian()}' tabindex='{{::tabindex}}' ng-disabled='noToggleMeridian()'/>" +
        "      </label>" +
        "      <span class='d-timepicker__increase d-icon-angle_up' ng-class='{\"is-disabled\": noToggleMeridian()}'></span>" +
        "      <span class='d-timepicker__decrease d-icon-angle_down' ng-class='{\"is-disabled\": noToggleMeridian()}'></span>" +
        "    </div>" +
        "    <p class='d-error'>{{error || 'Time is not valid'}}</p>" +
        "</div>"
    );
}]); var dplDatepicker = angular.module('dplDatepicker', [
        'ui.bootstrap',
        'gm.datepickerMultiSelect',
        'd-datepicker-templates'
    ])

    .constant('uibDatepickerConfig', {
        datepickerMode: 'day',
        formatDay: 'd',
        formatMonth: 'MMM',
        formatYear: 'yyyy',
        formatDayHeader: 'EE',
        formatDayTitle: 'MMM yyyy',
        formatMonthTitle: 'yyyy',
        maxDate: null,
        maxMode: 'year',
        minDate: null,
        minMode: 'day',
        ngModelOptions: {},
        shortcutPropagation: false,
        startingDay: 1,
        showWeeks: false,
        yearColumns: 5,
        yearRows: 4

    })
        
    /**
     * Standard Angular dateFilter doesn't support two letters Day-`-Week names
     * it supports only:
     * 'EEEE': Day in Week,(Sunday-Saturday)
     * 'EEE': Day in Week, (Sun-Sat)
     *
     * we need to extend it to allow the next:
     * 'EE': Day in Week, (Su-Sa)
     *
     *
     */
    .config(['$provide', '$injector', function ($provide, $injector) {
        $provide.decorator('dateFilter', ['$delegate', function ($delegate) {
            var srcFilter = $delegate;

            return function () {

                var g,
                    twoLettersDay = (arguments[1] === "EE");

                arguments[1] = (twoLettersDay) ? "EEE" : arguments[1];
                g = srcFilter.apply(this, arguments);

                // TODO: double check with timezones
                return (twoLettersDay) ? g.slice(0, 2) : g;
            };

        }]);
    }]);
angular.module("d-datepicker-templates", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("uib/template/datepicker/datepicker.html",
        "<div ng-switch=\"datepickerMode\" role=\"application\" ng-keydown=\"keydown($event)\">\n" +
        "  <uib-daypicker ng-switch-when=\"day\" tabindex=\"0\"></uib-daypicker>\n" +
        "  <uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\"></uib-monthpicker>\n" +
        "  <uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\"></uib-yearpicker>\n" +
        "</div>");

    $templateCache.put("uib/template/datepicker/day.html",
        "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\" class=\"d-datepicker-table\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-prev\" ng-click=\"move(-1)\" tabindex=\"-1\"></button></th>\n" +
        "      <th colspan=\"{{::5 + showWeeks}}\">" +
        "          <button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"d-datepicker__shown-date\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\">" +
        "           {{title}}" +
        "           </button>" +
        "       </th>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-next\" ng-click=\"move(1)\" tabindex=\"-1\"></button></th>\n" +
        "    </tr>\n" +
        "    <tr>\n" +
        "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
        "      <th ng-repeat=\"label in ::labels track by $index\" class=\"d-datepicker-weeks\"><span aria-label=\"{{::label.full}}\">{{::label.abbr}}</span></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr ng-repeat=\"row in rows track by $index\">\n" +
        "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
        "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" style=\"min-width:100%;\" ng-show=\"!dt.secondary\" class=\"d-datepicker__day\" ng-class=\"{'d-datepicker__selected' : dt.selected, 'd-datepicker__current': dt.current, 'd-datepicker__active': isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\">" +
        "           <span ng-class=\"::{'text-muted': dt.secondary, 'd-datepicker__muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span>" +
        "       </button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");

    $templateCache.put("uib/template/datepicker/month.html",
        "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\" class=\"d-datepicker-table\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-prev\" ng-click=\"move(-1)\" tabindex=\"-1\"></button></th>\n" +
        "      <th><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"d-datepicker__shown-date\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\">" +
        "            <strong>{{title}}</strong>" +
        "          </button></th>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-next\" ng-click=\"move(1)\" tabindex=\"-1\"></button></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr ng-repeat=\"row in rows track by $index\">\n" +
        "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" style=\"min-width:100%;\" class=\"d-datepicker__month\" ng-class=\"{'d-datepicker__selected': dt.selected, 'd-datepicker__current': dt.current, 'd-datepicker__active': isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\">" +
        "           <span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span>" +
        "       </button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");

    $templateCache.put("uib/template/datepicker/year.html",
        "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\" class=\"d-datepicker-table\">\n" +
        "  <thead>\n" +
        "    <tr>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-prev\" ng-click=\"move(-1)\" tabindex=\"-1\"></button></th>\n" +
        "      <th colspan=\"3\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"d-datepicker__shown-date\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
        "      <th><button type=\"button\" class=\"d-datepicker-next\" ng-click=\"move(1)\" tabindex=\"-1\"></button></th>\n" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>\n" +
        "    <tr ng-repeat=\"row in rows track by $index\">\n" +
        "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
        "        <button type=\"button\" style=\"min-width:100%;\" class=\"d-datepicker__year\" ng-class=\"{'d-datepicker__selected': dt.selected, 'd-datepicker__current': dt.current, 'd-datepicker__active': isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\">" +
        "           <span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span>" +
        "       </button>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "");

    $templateCache.put("uib/template/datepickerPopup/popup.html",
        "  <div>" +
        "  <ul class=\"d-datepicker uib-datepicker-popup d-datepicker-popup uib-position-measure\" ng-if=\"isOpen\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
        "	<li ng-transclude></li>\n" +
        "    <li ng-if=\"showButtonBar\" class=\"uib-button-bar\">\n" +
        "		<span class=\"btn-group pull-left\">\n" +
        "          <button type=\"button\" class=\"btn btn-sm btn-info uib-datepicker-current\" ng-click=\"select('today', $event)\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
        "          <button type=\"button\" class=\"btn btn-sm btn-danger uib-clear\" ng-click=\"select(null, $event)\">{{ getText('clear') }}</button>\n" +
        "		</span>\n" +
        "		<button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"close()\">{{ getText('close') }}</button>\n" +
        "	</li>\n" +
        "</ul>\n" +
        "</div>" +

        "");
}]); // TODO: • add error checking

var dplDatetimepicker = angular.module('dplDatetimepicker', ['dplDatepicker', 'dplTimepicker'])
    .controller('dplDatetimepickerController', [
        '$scope', '$element', '$attrs', '$document',
        function ($scope, $element, $attrs, $document) {

            var ngModelCtrl = {$setViewValue: angular.noop}; // nullModelCtrl

            $scope.focused = false;

            $scope.ismeridian = angular.isDefined($attrs.showMeridian) ? ($attrs.showMeridian.toLowerCase() === "true") : true;
            $scope.hstep = angular.isDefined($attrs.hstep) ? parseInt($attrs.hstep, 10) : 1;
            $scope.mstep = angular.isDefined($attrs.mstep) ? parseInt($attrs.mstep, 10) : 5;

            $scope.label = angular.isDefined($attrs.label) ? $attrs.label : undefined;
            $scope.labelHidden = angular.isDefined($attrs.labelHidden);
            $scope.required = angular.isDefined($attrs.required);

            $scope.tabindex = angular.isDefined($attrs.tabindex) ? $attrs.tabindex : 0;
            $element.removeAttr('tabindex');

            function updateValue() {
                ngModelCtrl.$setViewValue($scope.datetime);
            }

            this.init = function (_ngModel) {

                ngModelCtrl = _ngModel;

                ngModelCtrl.$formatters.unshift(function (modelValue) {

                    $scope.datetime = modelValue || new Date();
                    $scope.initValue = modelValue || new Date();

                    return modelValue || null;
                });
            };

            /**
             * destroys click and ESC event listeners
             */
            function destroyListeners() {
                document.body.removeEventListener('click', $scope.clickHandler, true);
                $document.off('keydown keypress', $scope.escapeKeyHandler);
            }

            /**
             * closes picker and destroys listeners
             */
            function closePicker() {

                $scope.focused = false;
                $scope.datetime = $scope.initValue;
                $scope.$apply();

                updateValue();
                destroyListeners();
            }

            /**
             * adds event listeners to handle clicks outside and ESC button,
             * closure is used to pass $element inside clickHandler (jqLite#on does not support eventData parameters as jQuery does.)
             * @param $element - dtpicker element
             * @param $scope - $scope of dtpicker
             */
            function initEventListeners($element, $scope) {

                $scope.clickHandler = function (e) {
                    if (!$element[0].contains(e.target)) {
                        closePicker();
                    }
                };

                $scope.escapeKeyHandler = function (e) {
                    if (e.which === 27) {
                        closePicker();
                    }
                };

                // need to catch click event before AngularJS change DOM tree
                document.body.addEventListener('click', $scope.clickHandler, true);
                $document.on('keydown keypress', $scope.escapeKeyHandler);
            }

            /**
             * sets current date
             */
            $scope.today = function () {
                $scope.datetime = new Date();
            };

            /**
             * is being called by Accept button, accepts new value
             */
            $scope.accept = function () {
                $scope.focused = false;
                $scope.initValue = $scope.datetime;
                updateValue();
                destroyListeners();
            };

            /**
             * opens picker, makes sure adding eventlisteners just once
             */
            $scope.openPicker = function () {

                if (!$scope.focused) {
                    $scope.focused = true;
                    initEventListeners($element, $scope);
                }
            };

            /**
             * clears event listeners on destroy
             */
            $scope.$on('$destroy', function () {
                destroyListeners();
            });
        }])
    .directive('dDatetimepicker', [function () {
        return {
            restrict: 'A',
            require: ['dDatetimepicker', '?^ngModel'],
            controller: 'dplDatetimepickerController',
            controllerAs: 'dtpicker',
            replace: true,
            scope: {},
            templateUrl: 'time-date.html',

            link: function (scope, element, attrs, ctrls) {

                var counterCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                if (ngModelCtrl) {
                    counterCtrl.init(ngModelCtrl);
                }
            }
        };
    }
    ])

    .directive('formatValidate', ['$filter', 'dateFilter', function ($filter, dateFilter) {
        "use strict";
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                //
                scope.filter = $filter;
                ctrl.$validators.dateFormat = function (modelValue, viewValue) {
                    var customDate,
                        isValid = false;

                    if (!ctrl.$isEmpty(modelValue)) {

                        customDate = new Date(modelValue);
                        isValid = !isNaN(customDate);

                    } else {
                        isValid = true;
                        // consider empty models to be valid
                    }
                    // TODO: add error checking
                    return isValid;
                };

                ctrl.$parsers.push(function (data) {

                    // convert data from view format to model format
                    return data; //converted
                });

                ctrl.$formatters.push(function (data, c, d) {
                    var format = this ? 'dd MMM yyyy hh:mm a': 'dd MMM yyyy HH:mm';

                    // convert data from model format to view format
                    return dateFilter(data, format ); //converted
                }.bind(scope.ismeridian));
            }
        };

    }]).run(["$templateCache", function ($templateCache) {
        "use strict";
        $templateCache.put("time-date.html",
            "<div class=\"d-datetimepicker\" ng-class=\"{'is-open':focused}\">" +
            "    <label class=\"d-textfield__label d-icon-right-calendar\">" +
            "          <span class=\"d-textfield__item\" ng-class='{\"sr-only\": labelHidden, \"d-datetimepicker_required\": required}'>{{label || 'Pick time:'}}</span>" +
            "         <input type=\"text\" class=\"d-textfield__input\" ng-focus=\"openPicker()\" ng-model=\"datetime\" placeholder=\"dd MM yyyy HH:mm a\" tabindex=\"{{tabindex}}\" format-validate>" +
            "    </label>" +
            "<div class=\"d-datetimepicker__wrapper\" ng-show=\"focused\">" +
            "<uib-datepicker " +

            "ng-model=\"datetime\" " +
            "class=\"d-datepicker d-datetimepicker__date\"> " +

            "</uib-datepicker>" +

            "<uib-timepicker " +
            "ng-model=\"datetime\" " +
            "class=\"d-timepicker d-datetimepicker__time\" " +

            "show-meridian=\"ismeridian\" " +
            "ng-change=\"changed()\" " +
            "minute-step=\"mstep\" " +
            "hour-step=\"hstep\" " +
            "error=\"Time is not valid\" " +
            "> " +

            "</uib-timepicker> " +

            "<div class=\"d-datetimepicker__actions\">" +
            "    <button ng-click=\"today()\" class=\"d-button d-button_action d-button_small d-datetimepicker__today\" type=\"text\">Today</button>" +
            "    <button ng-click=\"accept()\" class=\"d-button d-button_primary d-button_service d-button_small \" type=\"text\">Accept</button>" +
            "</div>" +
            "</div>" +
            "</div>"
        );

    }]); /* commonjs package manager support (eg. componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'color.picker';
}

(function () {
    'use strict';

    angular.module('color.picker', []);
})();


(function () {
    'use strict';

    var colorPicker = function ($document) {
        return {
            restrict: 'E',
            require: ['^ngModel'],
            scope: {
                ngModel: '=',
                colorPickerAlpha: '=',
                colorPickerCase: '=',
                colorPickerFormat: '=',
                colorPickerPos: '=',
                colorPickerSwatch: '=',
                colorPickerSwatchOnly: '=',
                colorPickerSwatchPos: '=',
                colorPickerSwatchBootstrap: '=',
                colorPickerOnChange: '&'
            },
            templateUrl: 'template/color-picker-template.html',
            link: function ($scope, element, attrs, control) {
                $scope.onChangeValue = null;

                $scope.init = function () {
                    // if no color provided
                    if ($scope.ngModel === undefined) {
                        $scope.hue = 0;
                        $scope.saturation = 0;
                        $scope.lightness = 100;
                    } else {
                        var color = tinycolor($scope.ngModel);

                        if (color.isValid()) {
                            var hsl = color.toHsv();
                            $scope.hue = hsl.h;
                            $scope.saturation = hsl.s * 100;
                            $scope.lightness = hsl.v * 100;
                            $scope.opacity = hsl.a * 100;
                        }
                    }

                    // set default config settings
                    $scope.initConfig();

                    // setup mouse events
                    $document.on('mousedown', $scope.onMouseDown);
                    $document.on('mouseup', $scope.onMouseUp);
                    $document.on('mousemove', $scope.onMouseMove);

                    $scope.find('.d-colorpicker__grid').on('click', $scope.onColorClick);
                    $scope.find('.d-colorpicker__hue').on('click', $scope.onHueClick);
                    $scope.find('.d-colorpicker__opacity').on('click', $scope.onOpacityClick);
                };

                $scope.onMouseDown = function (event) {
                    // an element in this picker
                    if ($scope.find(event.target).length > 0) {
                        // mouse event on color grid
                        if (event.target.classList.contains('d-colorpicker__grid-inner') || event.target.classList.contains('d-colorpicker__picker') || event.target.parentNode.classList.contains('d-colorpicker__picker')) {
                            $scope.colorDown(event);
                            $scope.$apply();
                            // mouse event on hue slider
                        } else if (event.target.classList.contains('d-colorpicker__hue') || event.target.parentNode.classList.contains('d-colorpicker__hue')) {
                            $scope.hueDown(event);
                            $scope.$apply();
                            // mouse event on opacity slider
                        } else if (event.target.classList.contains('d-colorpicker__opacity') || event.target.parentNode.classList.contains('d-colorpicker__opacity')) {
                            $scope.opacityDown(event);
                            $scope.$apply();
                        }
                    }
                };

                $scope.onMouseUp = function (event) {
                    // no current mouse events and not an element in the picker
                    if (!$scope.colorMouse && !$scope.hueMouse && !$scope.opacityMouse && $scope.find(event.target).length === 0) {
                        $scope.log('Color Picker: Document Click Event');
                        $scope.hide();
                        // mouse event on color grid
                    } else if ($scope.colorMouse) {
                        $scope.colorUp(event);
                        $scope.$apply();
                        $scope.onChange(event);
                        // mouse event on hue slider
                    } else if ($scope.hueMouse) {
                        $scope.hueUp(event);
                        $scope.$apply();
                        $scope.onChange(event);
                        // mouse event on opacity slider
                    } else if ($scope.opacityMouse) {
                        $scope.opacityUp(event);
                        $scope.$apply();
                        $scope.onChange(event);
                    }
                };

                $scope.onMouseMove = function (event) {
                    // mouse event on color grid
                    if ($scope.colorMouse) {
                        $scope.colorChange(event);
                        $scope.$apply();
                        // mouse event on hue slider
                    } else if ($scope.hueMouse) {
                        $scope.hueChange(event);
                        $scope.$apply();
                        // mouse event on opacity slider
                    } else if ($scope.opacityMouse) {
                        $scope.opacityChange(event);
                        $scope.$apply();
                    }
                };

                $scope.onColorClick = function (event) {
                    $scope.colorChange(event);
                    $scope.$apply();
                    $scope.onChange(event);
                };

                $scope.onHueClick = function (event) {
                    $scope.hueChange(event);
                    $scope.$apply();
                    $scope.onChange(event);
                };

                $scope.onOpacityClick = function (event) {
                    $scope.opacityChange(event);
                    $scope.$apply();
                    $scope.onChange(event);
                };

                $scope.onChange = function (event) {
                    if ($scope.ngModel !== $scope.onChangeValue) {
                        $scope.onChangeValue = $scope.ngModel;
                        $scope.colorPickerOnChange({ $event: event, color: $scope.ngModel });
                    }
                };


                $scope.initConfig = function () {
                    $scope.config = {};
                    $scope.config.alpha = $scope.colorPickerAlpha === undefined ? true : $scope.colorPickerAlpha;
                    $scope.config.case = $scope.colorPickerCase === undefined ? 'upper' : $scope.colorPickerCase;
                    $scope.config.format = $scope.colorPickerFormat === undefined ? 'hsl' : $scope.colorPickerFormat;
                    $scope.config.pos = $scope.colorPickerPos === undefined ? 'bottom left' : $scope.colorPickerPos;
                    $scope.config.swatch = $scope.colorPickerSwatch === undefined ? true : $scope.colorPickerSwatch;
                    $scope.config.swatchOnly = $scope.colorPickerSwatchOnly === undefined ? false : $scope.colorPickerSwatchOnly;
                    $scope.config.swatchPos = $scope.colorPickerSwatchPos === undefined ? 'left' : $scope.colorPickerSwatchPos;
                    $scope.config.swatchBootstrap = $scope.colorPickerSwatchBootstrap === undefined ? true : $scope.colorPickerSwatchBootstrap;
                    $scope.log('Color Picker: Config', $scope.config);
                };

                $scope.focus = function () {
                    $scope.log('Color Picker: Focus Event');
                    $scope.find('.d-colorpicker__input')[0].focus();
                };

                $scope.show = function () {
                    $scope.log('Color Picker: Show Event');
                    $scope.visible = true;
                    $scope.hueMouse = false;
                    $scope.opacityMouse = false;
                    $scope.colorMouse = false;

                    // force the grid selection circle to redraw and fix its position
                    $scope.saturationUpdate();
                    $scope.lightnessUpdate();
                };

                $scope.hide = function () {
                    if ($scope.visible || element[0].querySelector('.d-colorpicker__panel').offsetParent !== null) {
                        $scope.log('Color Picker: Hide Event');
                        $scope.visible = false;
                        $scope.$apply();
                    }
                };

                $scope.update = function () {
                    if ($scope.hue !== undefined && $scope.saturation !== undefined && $scope.lightness !== undefined) {
                        var color = tinycolor({ h: $scope.hue, s: $scope.saturation / 100, v: $scope.lightness / 100 }),
                            colorString;

                        if ($scope.config.alpha) {
                            color.setAlpha($scope.opacity / 100);
                        }

                        $scope.log('Color Picker: COLOR CHANGED TO ', color, $scope.hue, $scope.saturation, $scope.lightness, $scope.opacity);

                        $scope.swatchColor = color.toHslString();

                        switch ($scope.config.format) {
                            case 'rgba':
                                colorString = color.toRgbString();
                                break;

                            case 'hex':
                                colorString = color.toHexString();
                                if ($scope.config.case === 'lower') {
                                    colorString = colorString.toLowerCase();
                                } else {
                                    colorString = colorString.toUpperCase();
                                }
                                break;

                            case 'hex8':
                                colorString = color.toHex8String();
                                if ($scope.config.case === 'lower') {
                                    colorString = colorString.toLowerCase();
                                } else {
                                    colorString = colorString.toUpperCase();
                                }
                                break;

                            case 'hsv':
                                colorString = color.toHsvString();
                                break;

                            default:
                                colorString = color.toHslString();
                                break;
                        }

                        $scope.ngModel = colorString;
                    }
                };

                $scope.$watch('ngModel', function (newValue, oldValue) {
                    if (newValue !== undefined && newValue !== null && newValue !== oldValue && newValue.length > 4) {
                        $scope.log('Color Picker: MODEL - CHANGED', newValue);
                        var color = tinycolor(newValue);

                        if (color.isValid()) {
                            var hsl = color.toHsv();

                            $scope.hue = hsl.h;
                            $scope.saturation = hsl.s * 100;
                            $scope.lightness = hsl.v * 100;
                            if ($scope.config.alpha) {
                                $scope.opacity = hsl.a * 100;
                            }

                            $scope.isValid = true;
                        } else {
                            $scope.isValid = false;
                        }

                        control[0].$setValidity(attrs.name, $scope.isValid);

                        if (oldValue !== undefined && typeof control[0].$setDirty === 'function') {
                            control[0].$setDirty();
                        }
                    } else {
                        $scope.swatchColor = '';
                    }
                });

                $scope.$watch('colorPickerFormat', function (newValue, oldValue) {
                    if (newValue !== undefined && newValue !== oldValue) {
                        if (newValue === 'hex') {
                            $scope.colorPickerAlpha = false;
                        }
                        if (newValue === 'rgba') {
                            $scope.colorPickerAlpha = true;
                        }
                        $scope.initConfig();
                        $scope.update();
                    }
                });

                $scope.$watchGroup(
                    ['colorPickerAlpha', 'colorPickerCase'],
                    function (newValue, oldValue) {
                        if (newValue !== undefined) {
                            $scope.initConfig();
                            $scope.update();
                        }
                    }
                );

                $scope.$watchGroup(
                    ['colorPickerSwatchPos', 'colorPickerSwatchBootstrap', 'colorPickerSwatchOnly', 'colorPickerSwatch', 'colorPickerPos'],
                    function (newValue, oldValue) {
                        if (newValue !== undefined) {
                            $scope.initConfig();
                        }
                    }
                );

                //---------------------------
                // Update Positions And Colors On Elements
                //---------------------------
                $scope.$watch('swatchColor', function (newValue) {
                    var el = angular.element(element[0].querySelector('.d-colorpicker__swatch'));
                    el.css({
                        'background-color': newValue
                    });
                });

                $scope.$watch('huePos', function (newValue) {
                    var el = angular.element(element[0].querySelector('.d-colorpicker__hue .d-colorpicker__slider'));
                    el.css({
                        'top': newValue + '%'
                    });
                });

                $scope.$watch('opacityPos', function (newValue) {
                    var el = angular.element(element[0].querySelector('.d-colorpicker__opacity .d-colorpicker__slider'));
                    el.css({
                        'top': newValue + '%'
                    });
                });

                $scope.$watch('lightnessPos', function (newValue) {
                    var el = angular.element(element[0].querySelector('.d-colorpicker__grid .d-colorpicker__picker'));
                    el.css({
                        'top': newValue + '%'
                    });
                });

                $scope.$watch('saturationPos', function (newValue) {
                    var el = angular.element(element[0].querySelector('.d-colorpicker__grid .d-colorpicker__picker'));
                    el.css({
                        'left': newValue + '%'
                    });
                });

                $scope.$watch('grid', function (newValue) {
                    var el = angular.element(element[0].querySelector('.d-colorpicker__grid'));
                    el.css({
                        'background-color': newValue
                    });
                });

                //---------------------------
                // HUE
                //---------------------------
                $scope.hueDown = function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    $scope.log('Color Picker: HUE - MOUSE DOWN');
                    $scope.hueMouse = true;
                };

                $scope.hueUp = function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    $scope.log('Color Picker: HUE - MOUSE UP');
                    $scope.hueMouse = false;
                };

                $scope.hueChange = function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    $scope.log('Color Picker: HUE - MOUSE CHANGE');
                    var el = $scope.find('.d-colorpicker__hue');
                    $scope.hue = (1 - ((event.pageY - $scope.offset(el).top) / el.prop('offsetHeight'))) * 360;

                    if ($scope.hue > 360) {
                        $scope.hue = 360;
                    } else if ($scope.hue < 0) {
                        $scope.hue = 0;
                    }
                };

                $scope.hueUpdate = function () {
                    if ($scope.hue !== undefined) {
                        $scope.log('Color Picker: HUE - CHANGED');
                        $scope.huePos = (1 - ($scope.hue / 360)) * 100;
                        $scope.grid = tinycolor({h: $scope.hue, s: 100, v: 1}).toHslString();

                        if ($scope.huePos < 0) {
                            $scope.huePos = 0;
                        } else if ($scope.huePos > 100) {
                            $scope.huePos = 100;
                        }

                        $scope.update();
                    }
                };

                $scope.$watch('hue', function (newValue, oldValue) {
                    $scope.hueUpdate();
                });

                //---------------------------
                // OPACITY
                //---------------------------
                $scope.opacityDown = function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    $scope.log('Color Picker: OPACITY - MOUSE DOWN');
                    $scope.opacityMouse = true;
                };

                $scope.opacityUp = function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    $scope.log('Color Picker: OPACITY - MOUSE UP');
                    $scope.opacityMouse = false;
                };

                $scope.opacityChange = function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    $scope.log('Color Picker: OPACITY - MOUSE CHANGE');
                    var el = $scope.find('.d-colorpicker__opacity');
                    $scope.opacity = (1 - ((event.pageY - $scope.offset(el).top) / el.prop('offsetHeight'))) * 100;

                    if ($scope.opacity > 100) {
                        $scope.opacity = 100;
                    } else if ($scope.opacity < 0) {
                        $scope.opacity = 0;
                    }
                };

                $scope.opacityUpdate = function () {
                    if ($scope.opacity !== undefined) {
                        $scope.log('Color Picker: OPACITY - CHANGED');
                        $scope.opacityPos = (1 - ($scope.opacity / 100)) * 100;

                        if ($scope.opacityPos < 0) {
                            $scope.opacityPos = 0;
                        } else if ($scope.opacityPos > 100) {
                            $scope.opacityPos = 100;
                        }

                        $scope.update();
                    }
                };

                $scope.$watch('opacity', function (newValue, oldValue) {
                    $scope.opacityUpdate();
                });

                //---------------------------
                // COLOR
                //---------------------------
                $scope.colorDown = function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    $scope.log('Color Picker: COLOR - MOUSE DOWN');
                    $scope.colorMouse = true;
                };

                $scope.colorUp = function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    $scope.log('Color Picker: COLOR - MOUSE UP');
                    $scope.colorMouse = false;
                };

                $scope.colorChange = function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    $scope.log('Color Picker: COLOR - MOUSE CHANGE');
                    var el = $scope.find('.d-colorpicker__grid-inner');
                    var offset = $scope.offset(el);

                    $scope.saturation = ((event.pageX - offset.left) / el.prop('offsetWidth')) * 100;
                    $scope.lightness = (1 - ((event.pageY - offset.top) / el.prop('offsetHeight'))) * 100;

                    if ($scope.saturation > 100) {
                        $scope.saturation = 100;
                    } else if ($scope.saturation < 0) {
                        $scope.saturation = 0;
                    }

                    if ($scope.lightness > 100) {
                        $scope.lightness = 100;
                    } else if ($scope.lightness < 0) {
                        $scope.lightness = 0;
                    }
                };

                $scope.saturationUpdate = function (oldValue) {
                    if ($scope.saturation !== undefined && $scope.saturation !== oldValue) {
                        $scope.log('Color Picker: SATURATION - CHANGED');
                        $scope.saturationPos = ($scope.saturation / 100) * 100;

                        if ($scope.saturationPos < 0) {
                            $scope.saturationPos = 0;
                        } else if ($scope.saturationPos > 100) {
                            $scope.saturationPos = 100;
                        }

                        $scope.update();
                    }
                };

                $scope.$watch('saturation', function (newValue, oldValue) {
                    $scope.saturationUpdate(oldValue);
                });

                $scope.lightnessUpdate = function (oldValue) {
                    if ($scope.lightness !== undefined && $scope.lightness !== oldValue) {
                        $scope.log('Color Picker: LIGHTNESS - CHANGED');
                        $scope.lightnessPos = (1 - ($scope.lightness / 100)) * 100;

                        if ($scope.lightnessPos < 0) {
                            $scope.lightnessPos = 0;
                        } else if ($scope.lightnessPos > 100) {
                            $scope.lightnessPos = 100;
                        }

                        $scope.update();
                    }
                };

                $scope.$watch('lightness', function (newValue, oldValue) {
                    $scope.lightnessUpdate(oldValue);
                });


                //---------------------------
                // HELPER FUNCTIONS
                //---------------------------
                $scope.log = function () {
                    // console.log.apply(console, arguments);
                };

                // taken and modified from jQuery's find
                $scope.find = function (selector) {
                    var context = $scope.wrapper ? $scope.wrapper[0] : element[0],
                        results = [],
                        nodeType;


                    // Same basic safeguard as Sizzle
                    if (!selector) {
                        return results;
                    }

                    if (typeof selector === 'string') {
                        // Early return if context is not an element or document
                        if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
                            return [];
                        }

                        results = context.querySelectorAll(selector);

                    } else {
                        if (context.contains(selector)) {
                            results.push(selector);
                        }
                    }

                    return angular.element(results);
                };

                // taken and modified from jQuery's offset
                $scope.offset = function (el) {
                    var docElem, win, rect, doc, elem = el[0];

                    if (!elem) {
                        return;
                    }

                    // Support: IE<=11+
                    // Running getBoundingClientRect on a
                    // disconnected node in IE throws an error
                    if (!elem.getClientRects().length) {
                        return { top: 0, left: 0 };
                    }

                    rect = elem.getBoundingClientRect();

                    // Make sure element is not hidden (display: none)
                    if (rect.width || rect.height) {
                        doc = elem.ownerDocument;
                        win = doc !== null && doc === doc.window ? doc : doc.nodeType === 9 && doc.defaultView;
                        docElem = doc.documentElement;

                        // hack for small chrome screens not position the clicks properly when the page is scrolled
                        if (window.chrome && screen.width <= 768) {
                            return {
                                top: rect.top - docElem.clientTop,
                                left: rect.left - docElem.clientLeft
                            };
                        }

                        return {
                            top: rect.top + win.pageYOffset - docElem.clientTop,
                            left: rect.left + win.pageXOffset - docElem.clientLeft
                        };
                    }


                    return rect;
                };


                $scope.init();

                $scope.$on('$destroy', function () {
                    $document.off('mousedown', $scope.onMouseDown);
                    $document.off('mouseup', $scope.onMouseUp);
                    $document.off('mousemove', $scope.onMouseMove);
                });
            }
        };
    };

    colorPicker.$inject = ["$document"];

    angular.module("color.picker").directive("colorPicker", colorPicker);
})();


angular.module("color.picker").run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/color-picker-template.html",
        "<div class=\"d-colorpicker__wrapper\">" +
        "   <div class=\"d-textfield d-textfield_label_hidden d-colorpicker__field\">" +
        "       <label class=\"d-textfield__label d-icon-right-colorpicker\">" +
        "           <span class=\"d-textfield__item\"> Color picker </span>" +
        "           <input class=\"d-textfield__input d-colorpicker__input\" type=\"text\" ng-model=\"ngModel\" ng-change=\"onChange($event)\" size=\"3\" ng-focus=\"show()\">" +
        "           <span class=\"d-colorpicker__swatch\"></span>" +
        "       </label>" +
        "   </div>" +
        "   <div class=\"d-colorpicker__panel\" ng-show=\"visible\">" +
        "       <div class=\"d-colorpicker__grid d-colorpicker__sprite\">" +
        "           <div class=\"d-colorpicker__grid-inner\"></div>" +
        "           <div class=\"d-colorpicker__picker\">" +
        "               <div class=\"d-colorpicker__picker-check\"></div>" +
        "          </div>" +
        "       </div>" +
        "       <div class=\"d-colorpicker__hue d-colorpicker__sprite\">" +
        "           <div class=\"d-colorpicker__slider\"></div>" +
        "       </div>" +
        "       <div class=\"d-colorpicker__opacity d-colorpicker__sprite\" ng-show=\"config.alpha\">" +
        "           <div class=\"d-colorpicker__slider\"></div>" +
        "       </div>" +
        "   </div>" +
        "</div>"
    );
}]);
 ;(function () {
    "use strict";
    
    angular.module("dplAccordion", ["ui.bootstrap", "ngAnimate", "template/accordion.html"]);

    angular.module('template/accordion.html', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/accordion.html',
            '<li class="d-accordion__item" ng-class="{\'is-checked\': isOpen}">' +
            '   <div tabindex="0" ng-click="toggleOpen()" uib-accordion-transclude="heading" class="d-accordion__title d-icon-right-angle_down">' +
            '       {{heading}}' +
            '   </div>' +
            '   <div class="d-accordion__content" uib-collapse="!isOpen" ng-transclude></div>' +
            '</li>');
    }]);

})();


 ;(function () {
    "use strict";
    angular.module("dplButtonGroupUi", ["ui.bootstrap", "ngAnimate"]);
}()); ;(function () {
    "use strict";
    angular.module("dplDropdownUi", ["ui.bootstrap", "ngAnimate"]);
})();
 // Source: https://github.com/amitava82/angular-multiselect

angular.module('am.multiselect', ['template/multiselect.html'])

    // from bootstrap-ui typeahead parser
    .factory('optionParser', ['$parse', function ($parse) {
        // 00000111000000000000022200000000000000003333333333333330000000000044000
        var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
        return {
            parse: function (input) {
                var match = input.match(TYPEAHEAD_REGEXP);
                if (!match) {
                    throw new Error(
                        'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
                        ' but got "' + input + '".');
                }
                return {
                    itemName: match[3],
                    source: $parse(match[4]),
                    viewMapper: $parse(match[2] || match[1]),
                    modelMapper: $parse(match[1])
                };
            }
        };
    }])

    .directive('amMultiselect', ['$parse', '$document', '$compile', '$interpolate', '$filter', 'optionParser',

        function ($parse, $document, $compile, $interpolate, $filter, optionParser) {
            return {
                restrict: 'E',
                require: 'ngModel',
                link: function (originalScope, element, attrs, modelCtrl) {
                    // Redefine isEmpty - this allows this to work on at least Angular 1.2.x
                    var isEmpty = modelCtrl.$isEmpty;
                    modelCtrl.$isEmpty = function (value) {
                        return isEmpty(value) || (angular.isArray(value) && value.length == 0);
                    };

                    var exp = attrs.options,
                        parsedResult = optionParser.parse(exp),
                        isMultiple = attrs.multiple ? true : false,
                        required = false,
                        scope = originalScope.$new(),
                        changeHandler = attrs.change || angular.noop;

                    scope.items = [];
                    scope.header = 'Select';
                    scope.multiple = isMultiple;
                    scope.disabled = false;
                    scope.onBlur = attrs.ngBlur || angular.noop;

                    originalScope.$on('$destroy', function () {
                        scope.$destroy();
                    });

                    var popUpEl = angular.element('<am-multiselect-popup' +
                        (attrs.templateUrl ? (' template-url="' + attrs.templateUrl + '"') : '' ) +
                        '></am-multiselect-popup>');

                    // required validator
                    if (attrs.required || attrs.ngRequired) {
                        required = true;
                    }
                    attrs.$observe('required', function (newVal) {
                        required = newVal;
                    });

                    // watch disabled state
                    scope.$watch(function () {
                        return $parse(attrs.disabled)(originalScope);
                    }, function (newVal) {
                        scope.disabled = newVal;
                    });

                    // watch single/multiple state for dynamically change single to multiple
                    scope.$watch(function () {
                        return $parse(attrs.multiple)(originalScope);
                    }, function (newVal) {
                        isMultiple = newVal || false;
                    });

                    // watch option changes for options that are populated dynamically
                    scope.$watch(function () {
                        return parsedResult.source(originalScope);
                    }, function (newVal) {
                        if (angular.isDefined(newVal))
                            parseModel();
                    }, true);

                    // watch model change
                    scope.$watch(function () {
                        return modelCtrl.$modelValue;
                    }, function (newVal, oldVal) {
                        // when directive initialize, newVal usually undefined. Also, if model value already set in the controller
                        // for preselected list then we need to mark checked in our scope item. But we don't want to do this every time
                        // model changes. We need to do this only if it is done outside directive scope, from controller, for example.
                        if (angular.isDefined(newVal)) {
                            markChecked(newVal);
                            scope.$eval(changeHandler);
                        }
                        getHeaderText();
                        modelCtrl.$setValidity('required', scope.valid());
                    }, true);

                    function parseModel() {
                        scope.items.length = 0;
                        var model = parsedResult.source(originalScope);
                        if (!angular.isDefined(model)) return;
                        for (var i = 0; i < model.length; i++) {
                            var local = {};
                            local[parsedResult.itemName] = model[i];
                            scope.items.push({
                                label: parsedResult.viewMapper(local),
                                model: parsedResult.modelMapper(local),
                                checked: false
                            });
                        }
                    }

                    parseModel();

                    element.append($compile(popUpEl)(scope));


                    function getHeaderText() {
                        if (is_empty(modelCtrl.$modelValue))
                            return scope.header = (attrs.msHeader !== undefined ? attrs.msHeader : 'Select');

                        if (isMultiple) {
                            if (attrs.msSelected) {
                                scope.header = $interpolate(attrs.msSelected)(scope);
                            } else {
                                if (modelCtrl.$modelValue.length == 1) {
                                    for (var i = 0; i < scope.items.length; i++) {
                                        if (scope.items[i].model === modelCtrl.$modelValue[0]) {
                                            scope.header = scope.items[i].label;
                                        }
                                    }
                                } else {
                                    scope.header = modelCtrl.$modelValue.length + ' ' + 'selected';
                                }
                            }
                        } else {
                            if (angular.isString(modelCtrl.$modelValue)) {
                                scope.header = modelCtrl.$modelValue;
                            } else {
                                var local = {};
                                local[parsedResult.itemName] = modelCtrl.$modelValue;
                                scope.header = parsedResult.viewMapper(local) || scope.items[modelCtrl.$modelValue].label;
                            }
                        }
                    }

                    function is_empty(obj) {
                        if (angular.isNumber(obj)) return false;
                        if (obj && obj.length && obj.length > 0) return false;
                        for (var prop in obj) if (obj[prop]) return false;
                        return true;
                    }

                    scope.valid = function validModel() {
                        if (!required) return true;
                        var value = modelCtrl.$modelValue;
                        return (angular.isArray(value) && value.length > 0) || (!angular.isArray(value) && value != null);
                    };

                    function selectSingle(item) {
                        if (item.checked) {
                            scope.uncheckAll();
                        } else {
                            scope.uncheckAll();
                            item.checked = !item.checked;
                        }
                        setModelValue(false);
                    }

                    function selectMultiple(item) {
                        item.checked = !item.checked;
                        setModelValue(true);
                    }

                    function setModelValue(isMultiple) {
                        var value = null;

                        if (isMultiple) {
                            value = [];
                            angular.forEach(scope.items, function (item) {
                                if (item.checked) value.push(item.model);
                            })
                        } else {
                            angular.forEach(scope.items, function (item) {
                                if (item.checked) {
                                    value = item.model;
                                    return false;
                                }
                            })
                        }
                        modelCtrl.$setViewValue(value);
                    }

                    function markChecked(newVal) {
                        if (!angular.isArray(newVal)) {
                            angular.forEach(scope.items, function (item) {
                                if (angular.equals(item.model, newVal)) {
                                    scope.uncheckAll();
                                    item.checked = true;
                                    setModelValue(false);
                                    return false;
                                }
                            });
                        } else {
                            angular.forEach(scope.items, function (item) {
                                item.checked = false;
                                angular.forEach(newVal, function (i) {
                                    if (angular.equals(item.model, i)) {
                                        item.checked = true;
                                    }
                                });
                            });
                        }
                    }

                    scope.checkAll = function () {
                        if (!isMultiple) return;
                        var items = (scope.searchText && scope.searchText.label.length > 0) ? $filter('filter')(scope.items, scope.searchText) : scope.items;
                        angular.forEach(items, function (item) {
                            item.checked = true;
                        });
                        setModelValue(true);
                    };

                    scope.uncheckAll = function () {
                        var items = (scope.searchText && scope.searchText.label.length > 0) ? $filter('filter')(scope.items, scope.searchText) : scope.items;
                        angular.forEach(items, function (item) {
                            item.checked = false;
                        });
                        setModelValue(true);
                    };

                    scope.select = function (item) {
                        if (isMultiple === false) {
                            selectSingle(item);
                            scope.toggleSelect();
                        } else {
                            selectMultiple(item);
                        }
                    }
                }
            };
        }])

    .directive('amMultiselectPopup', ['$document', '$filter', function ($document, $filter) {
        return {
            restrict: 'E',
            scope: false,
            replace: true,
            templateUrl: function (element, attr) {
                return attr.templateUrl || 'template/multiselect.html';
            },
            link: function (scope, element, attrs) {

                scope.selectedIndex = null;
                scope.isVisible = false;
                scope.filteredItems = null;

                scope.toggleSelect = function () {
                    if (element.hasClass('is-open')) {
                        element.removeClass('is-open');
                        $document.unbind('click', clickHandler);
                        scope.$parent.$eval(scope.onBlur);
                    } else {
                        element.addClass('is-open');
                        $document.bind('click', clickHandler);
                        scope.focus();
                    }
                };

                function clickHandler(event) {
                    if (elementMatchesAnyInArray(event.target, element.find(event.target.tagName))) {
                        scope.$parent.$eval(scope.onBlur);
                    } else {
                        element.removeClass('is-open');
                        $document.unbind('click', clickHandler);
                        scope.$apply();
                    }
                }

                scope.focus = function focus() {
                    var searchBox = element.find('input')[0];
                    if (searchBox) {
                        searchBox.focus();
                    }
                };

                scope.keydown = function (event) {
                    var list = $filter('filter')(scope.items, scope.searchText);
                    var keyCode = (event.keyCode || event.which);

                    if (keyCode === 13) { // On enter
                        if (list[scope.selectedIndex]) {
                            scope.select(list[scope.selectedIndex]); // (un)select item
                        }
                    } else if (keyCode === 38) { // On arrow up
                        scope.selectedIndex = scope.selectedIndex === null ? list.length - 1 : scope.selectedIndex - 1;
                    } else if (keyCode === 40) { // On arrow down
                        scope.selectedIndex = scope.selectedIndex === null ? 0 : scope.selectedIndex + 1;
                    } else { // On any other key
                        scope.selectedIndex = null;
                    }

                    if (scope.selectedIndex < 0) { // Select last in list
                        scope.selectedIndex = list.length - 1;
                    } else if (scope.selectedIndex > list.length - 1) { // Set selection to first item in list
                        scope.selectedIndex = 0;
                    }
                };

                var elementMatchesAnyInArray = function (element, elementArray) {
                    for (var i = 0; i < elementArray.length; i++)
                        if (element == elementArray[i])
                            return true;
                    return false;
                }
            }
        }
    }]);



;(function() {
    "use strict";

    angular.module('template/multiselect.html', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/multiselect.html',
            "<div class=\"d-dropdown d-dropdown_select\">" +
            "   <button type=\"button\" class=\"d-dropdown_select-action d-icon-right-angle_down \" ng-click=\"toggleSelect()\">{{header}}</button>" +
            "   <ul class=\"d-dropdown__list\">" +
            "       <li class=\"d-dropdown__item d-dropdown__item_types\" ng-if=\"search\">Search</li>" +
            "       <li class=\"d-dropdown__item\" ng-show=\"search\">" +
            "           <div class=\"d-textfield d-textfield_label_hidden\">\n" +
            "               <label class=\"d-textfield__label d-icon-left-search\">\n" +
            "                   <span class=\"d-textfield__item sr-only\">Default</span>\n" +
            "                   <input class=\"d-textfield__input\" ng-model=\"searchText.label\" type=\"search\" ng-keydown=\"keydown($event)\" autofocus=\"autofocus\" placeholder=\"Search activity\">\n" +
            "               </label>" +
            "           </div>" +
            "       </li>" +
            "       <li class=\"d-dropdown__item d-dropdown__item_types\" ng-if=\"search\">Show activity Types</li>" +
            "       <li class=\"d-dropdown__item\" ng-show=\"multiple\" role=\"presentation\" ng-if=\"search\">" +
            "           <button class=\"d-button d-button_action d-button_small\" ng-click=\"checkAll()\">Check all</button>" +
            "           <button class=\"d-button d-button_action d-button_small\" ng-click=\"uncheckAll()\">Select none</button>" +
            "       </li>" +
            "       <li class=\"d-dropdown__item\" ng-repeat=\"item in items | filter:searchText\">" +
            "           <a href tabindex='0' class=\"d-dropdown__link\" ng-class=\"{'is-checked': item.checked }\" ng-click=\"select(item); focus()\">"+
            "               <span class=\"d-checkbox d-checkbox_default\" ng-if=\"checkbox\">\n" +
            "                   <label class=\"d-checkbox__label\">\n" +
            "                       <input class=\"d-checkbox__input\" type=\"checkbox\" ng-checked=\"item.checked\" tabindex='1'>\n" +
            "                       <span class=\"d-checkbox__item\">{{item.label}}</span>\n" +
            "                   </label>" +
            "               </span>" +
            "               <span ng-if=\"!checkbox\">{{item.label}}</span>" +
            "           </a>" +
            "       </li>" +
            "   </ul>" +
            "</div>");
    }]);

}());
