'use strict';

/* Begin Bootstrap Methods */
function startup(data, reason) {
    ['resource://gre/modules/Services.jsm',
     'chrome://tabscroll-modules/content/TabWheelScroll.jsm',
     'chrome://tabscroll-modules/content/WindowTracker.jsm',
     'chrome://tabscroll-modules/content/DefaultPrefsLoader.jsm'].forEach(function(path) {
        Components.utils.import(path);
     });

    setDefaultPrefs(data);
    
    WindowTracker.config.init = function(window) {
        var tabWheelScroll = new TabWheelScroll();
		tabWheelScroll.attach(window);
        return tabWheelScroll;
    };
    
    WindowTracker.config.disposal = function(tabWheelScroll) {
        tabWheelScroll.dispose();
    };
    
	// Configure all already open browser windows.
	WindowTracker.forEachOpenWindow(function(domWindow) {
		WindowTracker.setUp(domWindow);
	});

	// Wait for any new browser windows to open
	Services.wm.addListener(WindowTracker);
}

function shutdown(data, reason) {
	// When the application is shutting down we normally don't have to clean
	// up any UI changes made.
	if (reason == APP_SHUTDOWN) {
		return;
	}

	// Clean up all open browser windows.
	WindowTracker.forEachOpenWindow(function(domWindow) {
		WindowTracker.tearDown(domWindow);
	});

	// Stop listening for any new browser windows to open.
	Services.wm.removeListener(WindowTracker);
	Components.utils.unload('chrome://tabscroll-modules/content/TabWheelScroll.jsm');
    Components.utils.unload('chrome://tabscroll-modules/content/WindowTracker.jsm');
    Components.utils.unload('chrome://tabscroll-modules/content/DefaultPrefsLoader.jsm');
	Services.obs.notifyObservers(null, 'chrome-flush-caches', null);
}

function install(data, reason) { }

function uninstall(data, reason) { }
/* End Bootstrap Methods */