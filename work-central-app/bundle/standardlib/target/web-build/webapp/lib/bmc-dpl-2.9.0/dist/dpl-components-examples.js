/*global dplActionBlade */

dplActionBlade.controller('dplControllerActionBlade', [
    '$scope',
    '$uibModal',

    function ($scope, $uibModal) {
        "use strict";

        $scope.showActionBlade = function (directionClass) {
            $uibModal.open({
                templateUrl: 'template/action-blade.html',
                windowClass: 'd-action-blade ' + directionClass,
                controller: 'modalInstanceCtrl',
                animation: true
            });
        };
    }
]);

dplActionBlade.controller('modalInstanceCtrl', ['$scope', function ($scope) {
        "use strict";

        $scope.data = {
            "header": "This is sample header",
            "body": "This is sample body"
        };
    }]
); /*globals dplBusy */
var dplBusyDemo = angular.module('dplBusyDemo', ['ngAnimate', 'cgBusy', 'dpl-busy-loader']);
dplBusyDemo.controller('demoControllerBusyPreloader', [
    '$scope',
    '$http',

    function ($scope, $http) {
        'use strict';
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.templateUrl = 'template/busy-loader.html';
        $scope.backdrop = true;
        $scope.promise = null;

        $scope.demo = function () {
            $scope.promise = $http.get("http://httpbin.org/delay/3");//for test promise
        };
    }]);


 var dplMenu = angular.module("dplMenu", ['ngAnimate', 'ui.bootstrap']);
dplMenu.controller("dplMenuCtrl", ["$scope", "$http", function ($scope, $http) {
    'use strict';
    $scope.isCollapsed = true;
    $scope.isOpen = true;
    $scope.menuList = [
        {
            name: "My Server Settings",
            name_class: "d-menu__link",
            name_list_class: "d-menu__list",
            icon_class: "d-icon-left-angle_right",
            name_item: [
                {
                    item: "Configure Properties of my Server",
                    item_active: "is-active"
                }
            ]
        },
        {
            name: "My Server Settings",
            name_class: "d-menu__link",
            icon_class: "d-icon-left-angle_right",
            name_list_class: "d-menu__list d-menu__list_sub collapse",
            name_item: [
                {
                    item: "Configure Properties of my Server",
                    item_icon: "d-icon-left-angle_right",
                    item_list_class: "d-menu__list collapse",
                    sub_menu: [
                        { item: "Configure Global Application " }
                    ]
                },
                { item: "Configure Application Rules" },
                { item: "Configure Global Application Settings" },
                { item: "Define Impact Values" },
                { item: "Define Urgency Values" },
                { item: "Define Prioritization" },
                { item: "Define Priority Weighting" },
                { item: "Define Priority Weighting" },
                { item: "Maintain Scripts" },
                { item: "Maintain Templates" }
            ]
        },
        {
            name: "Configure Change Settings",
            name_class: "d-menu__link",
            icon_class: "d-icon-left-angle_right",
            name_list_class: "d-menu__list collapse",
            name_item: [
                { item: "Configure Properties of my Server" },
                { item: "Configure Application Rules" },
                { item: "Configure Global Application Settings" }
            ]
        },
        {
            name: "Configure Problem Settings",
            name_class: "d-menu__link",
            icon_class: "d-icon-left-angle_right",
            name_list_class: "d-menu__list collapse",
            name_item: [
                { item: "Configure Properties of my Server" },
                { item: "Configure Application Rules" }
            ]
        }
    ]
}]);
 var dplDatepickerDemo = angular.module('dplDatepickerDemo', ['dplDatepicker', 'ngAnimate'])

    .controller('DatepickerDemoCtrl', [
        '$scope',

        function ($scope) {


            //Inline datepicker

            // Set current date
            $scope.today = function () {
                $scope.datepicker1 = new Date();
            };
            $scope.today();


            // Clear  date
            $scope.clear = function () {
                $scope.datepicker1 = null;
            };


            // Multidate datepicker

            $scope.multidate = [new Date().setHours(0, 0, 0, 0)];
            $scope.datepicker2 = null;


            // Datepicker with input

            $scope.datepicker3 = new Date();

            $scope.status = {
                opened: false
            };

            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };


            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];


            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };

            $scope.toggleMin();
            $scope.maxDate = new Date(2020, 5, 22);

            $scope.open = function ($event) {
                $scope.status.opened = true;
            };


            $scope.setDate = function (year, month, day) {
                $scope.dt = new Date(year, month, day);
            };

        }]); var dplDatetimepickerDemo = angular.module('dplDatetimepickerDemo', ['dplDatepicker', 'dplTimepicker', 'dplDatetimepicker', 'ngAnimate']);

angular.module('dplDatetimepickerDemo').controller('DateptimeickerDemoCtrl', ['$scope',
    function ($scope) {

        $scope.foo = new Date();
        $scope.boo = new Date();

    }
]); dplModal.controller('demoControllerModal', [
    '$scope',
    '$uibModal',
    '$log',

    function ($scope, $uibModal, $log) {

        $scope.items = ['item1', 'item2', 'item3'];

        $scope.animationsEnabled = true;

        $scope.open = function (size) {

            var modalInstance = $uibModal.open({
                windowTemplateUrl: 'template/modal.html',
                animation: $scope.animationsEnabled,
                templateUrl: 'template/modal.html',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);

angular.module('template/modal.html', []).run(['$templateCache', function ($templateCache) {
    'use strict';

    $templateCache.put('template/modal.html',
        "<div class='d-modal' ng-click=\"close($event)\" modal-render=\"{{$isRendered}}\" tabindex=\"-1\" role=\"dialog\" ng-class=\"{'d-modal_in': animate}\" uib-modal-animation-class=\"d-modal_fade\" modal-in-class=\"d-modal_in\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\"><div class='d-modal__dialog'>" +
        "<div class='d-modal__header'>" +
        "<h5 class='d-modal__title'>Disconnectiong Records</h5>" +
        "</div>" +
        "<div class='d-modal__content'> " +
        "<p class='d-modal__content-item'>Save changes?</p>" +
        "<p class='d-modal__content-item'>This lifecircle has a field connected to the " +
        "<a>Incident Record</a>. Are you sure you want to disconnect this record? </p>" +
        "<div class='d-checkbox d-checkbox_default'> " +
        " <label class='d-checkbox__label'> " +
        "<input class='d-checkbox__input' type='checkbox'/>" +
        "<span class='d-checkbox__item'>Don’t show this tips again</span> " +
        "</label> " +
        "</div>" +
        "</div>" +
        "<div class='d-modal__footer'> " +
        "<button class='d-button d-button_primary d-button_small' ng-click=\"save()\">Save</button> " +
        "<button class='d-button d-button_secondary d-button_small' ng-click=\"close($event)\">Cancel</button> " +
        "</div>" +
        "</div>" +
        "</div>");
}]); /*global dplRangeSlider */
/*
 // To set an option for all sliders
 app.factory('uiSliderConfig', function ($log) {
 return {
 start: function (event, ui) { $log.info('Event: Slider start - set with uiSliderConfig', event); },
 stop: function (event, ui) { $log.info('Event: Slider stop - set with uiSliderCOnfig', event); },
 };
 });
 */

dplRangeSlider.controller('sliderDemoCtrl', [
    '$scope',
    '$log',
    function ($scope, $log) {

        // Slider options with event handlers
        $scope.slider = {
            'options': {
                start: function (event, ui) {
                    $log.info('Event: Slider start - set with slider options', event);
                },
                stop: function (event, ui) {
                    $log.info('Event: Slider stop - set with slider options', event);
                }
            }
        };

        $scope.demoVals = {
            sliderExample2: 14,
            sliderExample7: [10, 33],
            sliderExample1: 50
        };

        $scope.disabledSlider = {
            options: {
                disabled: true,
                orientation: 'horizontal',
                min: 0,
                max: 255,
                range: 'min'
            }
        };
    }]); dplTagsInput.controller('demoControllerTags', [
    '$scope',

    function ($scope) {
        $scope.tags = [
            {text: 'Tag1'},
            {text: 'Tag2'},
            {text: 'Tag3'}
        ];

        $scope.loadTags = function () {
            return [
                {'text': 'Tag1'},
                {'text': 'Tag2'},
                {'text': 'Tag3'},
                {'text': 'Tag4'},
                {'text': 'Tag5'},
                {'text': 'Tag6'},
                {'text': 'Tag7'},
                {'text': 'Tag8'},
                {'text': 'Tag9'},
                {'text': 'Tag it'}
            ];
        };
    }]); /*global dplCounterDemo */
angular.module('dplCounterDemo', ['dplCounter'])

    .controller('demoControllerCounter', [
    '$scope',

    function ($scope) {
        'use strict';

        $scope.foo = 3;
        $scope.bar = 999;

        $scope.foobar = 0;

    }]); /*global dplTimepicker */

dplTimepicker.controller('demoControllerTimepicker', [
    '$scope',

    function ($scope) {
        'use strict';

        $scope.mytime = new Date();

        $scope.hstep = 1;
        $scope.mstep = 5;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function () {
            $scope.ismeridian = !$scope.ismeridian;
        };

        $scope.update = function () {
            var d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            $scope.mytime = d;
        };

        $scope.clear = function () {
            $scope.mytime = null;
        };
    }]); angular
    .module('dplColorPicker', ['color.picker', 'ngAnimate', 'ui.bootstrap'])
    .controller('demoControllerColorPicker', [
        '$scope',
        '$log',
        'uibDropdownConfig',
        function ($scope, $log, uibDropdownConfig) {

            uibDropdownConfig.openClass = "is-open";

            $scope.colors = {
                hex: "hex",
                rgba: "rgba"
            };

            $scope.colorpickerDropdown = $scope.colors.hex;

            $scope.setHex = function () {
                $scope.colorpickerDropdown = $scope.colors.hex;
            };

            $scope.setRgba = function () {
                $scope.colorpickerDropdown = $scope.colors.rgba;
            };

            $scope.status = {
                is_open: false
            };

            $scope.toggled = function (open) {
                $log.log('Dropdown is now: ', open);
            };

            $scope.toggleDropdown = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.is_open = !$scope.status.is_open;
            };

            $scope.onColorChange = function ($event, color) {
                $log.log($event, color);
            };
        }]);
 (function () {
    "use strict";

    angular
        .module("dplAccordion")
        .controller("dplAccordionCtrl", dplAccordionCtrl);
    
    function dplAccordionCtrl() {
        var vm = this;

        vm.oneAtATime = true;

        vm.groups = [
            {
                title: "Dpl Accordion Tab 1",
                content: "Dynamic Tab Content 1",
                status: true
            },
            {
                title: "Dpl Accordion Tab 2",
                content: "Dynamic Tab Content 2",
                status: false
            },
            {
                title: "Dpl Accordion Tab 3",
                content: "Dynamic Tab Content 3",
                status: false
            },
            {
                title: "Dpl Accordion Tab 4",
                content: "Dynamic Tab Content 4",
                status: false
            }
        ];

        vm.groupsInner = [
            {
                title: "Dpl Accordion Inner Tab 1",
                content: "Dynamic Tab Content 1",
                status: true
            },
            {
                title: "Dpl Accordion Inner Tab 2",
                content: "Dynamic Inner Tab Content 2",
                status: false
            },
            {
                title: "Dpl Accordion Inner Tab 3",
                content: "Dynamic Inner Tab Content 3",
                status: false
            },
            {
                title: "Dpl Accordion Inner Tab 4",
                content: "Dynamic Inner Tab Content 4",
                status: false
            }
        ];
    }
})();

 ;(function () {
    "use strict";
    var dplButtonGroupUiDemo = angular.module('dplButtonGroupUiDemo', ['dplButtonGroupUi']);

    angular.module('dplButtonGroupUiDemo')
        .controller('dplButtonGroupCtrlDemo', ['$scope', 'uibButtonConfig', function($scope, buttonConfig) {
            buttonConfig.activeClass = "is-checked";

            $scope.singleModel = true;

            $scope.unselectable = "middle";

            $scope.uncheckable = 'left';
            
            $scope.checkModel = {
                left: false,
                middle: true,
                right: false
            };
            
            $scope.checkResults = [];

            $scope.$watchCollection('checkModel', function () {
                $scope.checkResults = [];
                angular.forEach($scope.checkModel, function (value, key) {
                    if (value) {
                        $scope.checkResults.push(key);
                    }
                });
            });
        }]);
})(); ;(function () {
    "use strict";

    angular
        .module("dplDropdownUi")
        .controller('dplDropdownCtrl', ['uibDropdownConfig', function (uibDropdownConfig) {
            var vm = this;

            uibDropdownConfig.openClass = "is-open";

            vm.status = {
                isopen: false,
                isopen2: false
            };

            vm.items = [
                'Print',
                'Export as PDF',
                'Assign to...'
            ];

            vm.action = "Action";
            vm.button = "d-button d-button_small d-icon-right-angle_down";
        }]);
}()); ;(function () {
    "use strict";

    angular.module("dplTabs", [
            "ui.bootstrap",
            "dRippleEffect",
            "template/tabs/tabset.html",
            "template/tabs/tab.html"
        ])
        .controller("demoTabs", demoTabsCtrl);


    function demoTabsCtrl() {
        var vm = this;

        vm.tabs = [
            {
                title: "Dynamic Title 1",
                content: "Dynamic content 1"
            },
            {
                title: "Dynamic Title 2",
                content: "Dynamic content 2"
            }
        ];

        vm.tabsList = [
            {
                heading: "DPL Title 1",
                item: "Lorem ipsum dolor sit amet, consectetur adipisicing elit." +
                " Dignissimos ducimus, exercitationem illum laboriosam laborum obcaecati saepe ullam veniam? " +
                "Animi assumenda culpa doloribus laboriosam odit quia! Cupiditate doloribus ea earum velit?"
            },
            {
                heading: "DPL Title 2",
                item: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. " +
                "Dignissimos ducimus, exercitationem illum laboriosam laborum obcaecati saepe ullam veniam? " +
                "Animi assumenda culpa doloribus laboriosam odit quia! Cupiditate doloribus ea earum velit? " +
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos ducimus, exercitationem illum " +
                "laboriosam laborum obcaecati saepe ullam veniam? Animi assumenda culpa doloribus laboriosam odit quia! " +
                "Cupiditate doloribus ea earum velit?"
            },
            {
                heading: "DPL Title 3",
                item: "Dpl Content 3"
            },
            {
                heading: "DPL Title 4",
                item: "Dpl Content 4"
            }
            
        ];
    }


}());

 angular.module('dplMultiselect', ['am.multiselect'])

    .controller('appCtrl', ['$scope', function ($scope) {
        $scope.checkbox = true;
        $scope.search = true;
        
        $scope.toggleCheckbox = function() {
            $scope.checkbox = !$scope.checkbox;
        };
        
        $scope.toggleSearch = function() {
            $scope.search = ! $scope.search;
        };

        $scope.cars = [
            {name: 'Audi'},
            {name: 'BMW'},
            {name: 'Honda'},
            {name: "Mazda"},
            {name: "Acura"},
            {name: "Subaru"}
        ];
        $scope.fruits = [
            {id: 1, name: 'Apple'},
            {id: 2, name: 'Orange'},
            {id: 3, name: 'Banana'}
        ];

        $scope.selectedCar = '';
        $scope.selectedFruit = '';
        
    }]);

