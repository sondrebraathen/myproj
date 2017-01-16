(function () {
    'use strict';
    angular.module('com.example.work-central-app').run(function (rxApplicationConfigurator, BX) {
        rxApplicationConfigurator.runApplicationConfig({
            bundleId: BX.bundleId
        });
    });
})();

