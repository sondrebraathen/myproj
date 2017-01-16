(function () {
    'use strict';

    angular.module('com.example.work-central-app', [
        'ngSanitize',
        'ui.router',
		'com.bmc.arsys.rx.standardlib.application',
        'com.bmc.arsys.rx.standardlib.error-handling',
        'com.bmc.arsys.rx.standardlib.login',
        'com.bmc.arsys.rx.standardlib.view.runtime',
        'com.bmc.arsys.rx.standardlib.search',
        'com.bmc.arsys.rx.standardlib.administration-settings',
        // all modules that provide non-abstract navigation routes
        'com.example.work-central-app.home',
        'com.example.work-central-app-ext'
    ]);
})();
