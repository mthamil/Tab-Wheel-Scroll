'use strict';

/* Begin Bootstrap Methods */
function startup(data, reason) {
	Components.utils.import('resource://gre/modules/Services.jsm');
	//Components.utils.import('chrome://tabscroll-modules/content/tabscroll.jsm');

	// Configure all already open browser windows.
	forEachOpenWindow(function(domWindow) {
		WindowConfigurator.setUp(domWindow);
	});

	// // Wait for any new browser windows to open
	Services.wm.addListener(WindowConfigurator);
}

function shutdown(data, reason) {
	// When the application is shutting down we normally don't have to clean
	// up any UI changes made.
	if (reason == APP_SHUTDOWN) {
		return;
	}

	// Clean up all open browser windows.
	forEachOpenWindow(function(domWindow) {
		WindowConfigurator.tearDown(domWindow);
	});

	// // Stop listening for any new browser windows to open.
	Services.wm.removeListener(WindowConfigurator);
	
	//Components.utils.unload('chrome://tabscroll-modules/content/tabscroll.jsm');
	Services.obs.notifyObservers(null, 'chrome-flush-caches', null);
}

function install(data, reason) { }

function uninstall(data, reason) { }
/* End Bootstrap Methods */


function forEachOpenWindow(action) {
	var windows = Services.wm.getEnumerator('navigator:browser');
	while (windows.hasMoreElements()) {
		action(windows.getNext().QueryInterface(Components.interfaces.nsIDOMWindow));
	}
}

/*
 * Manages configuration and cleanup of browser windows.
 */
var WindowConfigurator = {
	perWindowTracker: {},

	setUp: function(window) {
		window.alert('setup');
		//var tabWheelScroll = new TabWheelScroll();
		//tabWheelScroll.attach(window);
		//WindowConfigurator.perWindowTracker[window] = tabWheelScroll;
	},

	tearDown: function(window) {
		window.alert('teardown');
		//var tabWheelScroll = WindowConfigurator.perWindowTracker[window];
		//if (tabWheelScroll) {
		//	tabWheelScroll.dispose();
		//	delete WindowConfigurator.perWindowTracker[window];
		//}
	},

	/* nsIWindowMediatorListener handlers */
	onOpenWindow: function(xulWindow) {
        var domWindow = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                                 .getInterface(Components.interfaces.nsIDOMWindow);

        console.log(domWindow.document.readyState);
        domWindow.alert(domWindow.document.readyState);

        // Wait for it to finish loading.
        domWindow.addEventListener('load', function load(event) {
            domWindow.removeEventListener('load', load, false);

            // If this is a browser window then setup its UI.
            if (domWindow.document.documentElement.getAttribute('windowtype') == 'navigator:browser') {
                WindowConfigurator.setUp(domWindow);
            }
        }, false);
	},

	onCloseWindow: function(xulWindow) {
		var domWindow = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
								 .getInterface(Components.interfaces.nsIDOMWindow);
								 
        // If this is a browser window then clean up its UI.
        if (domWindow.document.documentElement.getAttribute('windowtype') == 'navigator:browser') {
            WindowConfigurator.tearDown(domWindow);
        }
	},

	onWindowTitleChange: function(xulWindow, newTitle) { }
};