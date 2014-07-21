'use strict';

var EXPORTED_SYMBOLS = ['WindowTracker'];
Components.utils.import('resource://gre/modules/Services.jsm');

function isBrowserWindow(window) {
    return window.document.documentElement.getAttribute('windowtype') == 'navigator:browser';
}

/*
 * Manages configuration and cleanup of browser windows.
 */
var WindowTracker = {
	perWindowTracker: new Map(),
    
    config: {
        init: null,
        disposal: null,
    },

	setUp: function(window) {
		Services.console.logStringMessage(window.document.title + ': setup');
        var tracked = WindowTracker.config.init(window);
        WindowTracker.perWindowTracker.set(window, tracked);
	},

	tearDown: function(window) {
		Services.console.logStringMessage(window.document.title + ': teardown');
		if (WindowTracker.perWindowTracker.has(window)) {
            var tracked = WindowTracker.perWindowTracker.get(window);   
            WindowTracker.config.disposal(tracked);
			WindowTracker.perWindowTracker.delete(window);
		}
	},

	/* nsIWindowMediatorListener handlers */
	onOpenWindow: function(xulWindow) {
        var domWindow = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                                 .getInterface(Components.interfaces.nsIDOMWindow);

        // Wait for it to finish loading.
        domWindow.addEventListener('load', function load(event) {
            domWindow.removeEventListener('load', load, false);

            // If this is a browser window then setup its UI.
            if (isBrowserWindow(domWindow)) {
                WindowTracker.setUp(domWindow);
            }
        }, false);
	},

	onCloseWindow: function(xulWindow) {
		var domWindow = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
								 .getInterface(Components.interfaces.nsIDOMWindow);
								 
        // If this is a browser window then clean up its UI.
        if (isBrowserWindow(domWindow)) {
            WindowTracker.tearDown(domWindow);
        }
	},

	onWindowTitleChange: function(xulWindow, newTitle) { }
};