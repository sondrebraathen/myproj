(function () {
    'use strict';
    angular.module('com.example.work-central-app').config(function (rxApplicationConfiguratorProvider) {
        rxApplicationConfiguratorProvider.configure({
            runtimeViewStateName: 'bx.view',
            searchResultsStateName: 'bx.search',
            administrationSettingsState: 'bx.administration-settings',
            translateLoaderParts: ['com.example.work-central-app']
        });
    });
})();