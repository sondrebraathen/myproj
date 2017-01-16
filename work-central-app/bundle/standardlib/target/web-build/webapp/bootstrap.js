// Used to make ckeditor know where statics
var CKEDITOR_BASEPATH = '/standardlib/lib/ckeditor-4.5.9/';
// Used to load localization resource for dependency bundles  
var allBundleList = [];

function rxLoadResources(files) {
    files.forEach(function (file) {
        var ext = file.match(/\.[^\.]+$/)[0],
            line = '';

        switch (ext) {
            case '.js':
                line = '<script src="' + file + '"></script>';
                break;
            case '.css':
                line = '<link rel="stylesheet" href="' + file + '">';
                break;
        }

        document.write(line);
    });
}

rxLoadResources.deferredWrite = function () {
    document.write((rxLoadResources.lines || []).join(''));
};

function rxInitLocalizations(data) {
    var ANGULAR_I18N = '/standardlib/lib/angular-1.4.7/i18n/angular-locale_';

    window.rxLocalization = data;
    window.rxLocalization.locale = Object.keys(window.rxLocalization)[0];

    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", ANGULAR_I18N + window.rxLocalization.locale + ".js");
    document.getElementsByTagName("head")[0].appendChild(script);
}

function rxLoadBundles(config) {
    var bundleList = [],
        depsSequence = rxLoadBundles.getBundleLoadSequence(config);

    window.rxBundleDependencies = depsSequence;

    rxLoadResources(Array.prototype.concat.apply([],
        depsSequence.map(function (dep) {
            allBundleList.push(dep.id);

            var isApplicationExtensionBundle = dep.isApplication && !dep.isMainApplicationBundle;

            // Load files with the -ext suffix for application extension bundles
            var bundleFile = dep.id + (isApplicationExtensionBundle ? '-ext' : '');

            var bundleFiles = [];

            if (dep.containsJavaScript) {
                if (!isApplicationExtensionBundle) {
                    bundleFiles.push('/' + dep.id + '/resources/css/' + bundleFile + '-deps.min.css');
                    bundleFiles.push('/' + dep.id + '/scripts/' + bundleFile + '-deps.min.js');
                }

                bundleFiles.push('/' + dep.id + '/resources/css/' + bundleFile + '.css');
                bundleFiles.push('/' + dep.id + '/scripts/' + bundleFile + '.js');
                bundleList.push(bundleFile);
            }

            return bundleFiles;
        })
    ));

    rxLoadResources([
        '/standardlib/resources/css/theme/login-theme.css',
        '/standardlib/resources/css/theme/theme.css'
    ]);

    document.addEventListener('DOMContentLoaded', function () {
        bundleList.splice(bundleList.indexOf('standardlib'), 1);

        var bundleListClone = bundleList.slice(0);

        try {
            angular.bootstrap(document, bundleListClone);
        } catch (e) {
            console.warn('Application bootstrap failed, checking bundles for errors...');

            bundleList = bundleList.filter(function (bundleId) {
                try {
                    var dummyElement = document.createElement('div'),
                        injector = angular.bootstrap(dummyElement, [bundleId]);

                    injector.invoke(function ($rootScope) {
                        $rootScope.$destroy();
                    });

                    return true;
                } catch (error) {
                    console.warn('Bundle ' + bundleId + ' cannot be initialized.');
                    console.error(error);

                    return false;
                }
            });

            angular.bootstrap(document, bundleList);
        }
    });
}

rxLoadBundles.getBundleLoadSequence = function (bundleDescriptor) {
    var bundlesToLoad = [].concat(bundleDescriptor.dependentBundles || [], bundleDescriptor.otherBundles || []);

    bundleDescriptor.isMainApplicationBundle = true;
    // Add root bundle, should be loaded last
    bundlesToLoad.push(bundleDescriptor);

    return bundlesToLoad;
};

var isBrowserSupported = true;
var isCompatibilityMode = false;

if (navigator.appName === 'Microsoft Internet Explorer') {
    var userAgent = navigator.userAgent;
    var trident = userAgent.indexOf('Trident/');
    var msie = userAgent.indexOf('MSIE ');

    if (trident != -1) {
        var tridentVersion = parseInt(userAgent.substring(trident + 8, userAgent.indexOf(';', trident)), 10);
        if (tridentVersion < 7) {
            isBrowserSupported = false;
        }
    }

    if (msie != -1) {
        var msieVersion = parseInt(userAgent.substring(msie + 5, userAgent.indexOf(';', msie)), 10);
        if (msieVersion < 9) {
            isCompatibilityMode = true;
        }
    }
}

if (!isBrowserSupported) {
    alert('The version of Microsoft Internet Explorer you are using is not supported');
} else if (isBrowserSupported && isCompatibilityMode) {
    alert('It looks like you have enabled Internet Explorer Compatibility View. Please disable Compatibility View before continuing');
} else {
    (function () {
        var bundleId = document.documentElement.getAttribute('rx-app');

        if (typeof window.__karma__ === 'undefined') {
            document.write('<script src="/api/rx/application/bundle/bundledescriptor/', bundleId, '/jsonp"></script>',
                '<script src="/api/rx/application/logincontent/login.json', '/jsonp"></script>');
        }

        document.write([
            '<link ng-if="rxFavicon" rel="shortcut icon" ng-href="{{rxFavicon}}">',
            // Load jsonp with bundle config
            // Write all deferred files
            '<script>rxLoadResources.deferredWrite();</script>'
        ].join(''));
    })();
}