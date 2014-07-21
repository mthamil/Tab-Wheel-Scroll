'use strict';

var EXPORTED_SYMBOLS = ['TabWheelScroll'];
Components.utils.import('resource://gre/modules/Services.jsm');

/*
 * Wrapper for tab containers.
 */
var TabScrollContainer = function(tabContainer) {
    var self = this;
    self.tabContainer = tabContainer;
    self.scrollListener = null;

    self.advanceSelectedTab = function(direction, wrap) {
        self.tabContainer.advanceSelectedTab(direction, wrap);
    };

    self.addScrollListener = function(listener) {
        self.scrollListener = listener;
        self.tabContainer.addEventListener('DOMMouseScroll', self.scrollListener, true);
    };

    self.removeScrollListener = function() {
        self.tabContainer.removeEventListener('DOMMouseScroll', self.scrollListener, true);
    };

    return self;
};

var TabWheelScroll = function() {
    var self = this;
    self.downScrollsLeft = true;   // move left on scroll down
    self.scrollWrap = true;        // scrolling past the ends of the tab bar wraps around to other end

    self.tabContainer = null;

    // Register to receive notifications of preference changes.
    self.prefs = Services.prefs.getBranch('extensions.tabscroll.');
    self.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    self.prefs.addObserver("", self, false);

    // Read initial preference values.
    self.downScrollsLeft = self.prefs.getBoolPref('downScrollsLeft');
    self.scrollWrap = self.prefs.getBoolPref('scrollWrap');

    self.attach = function(domWindow) {
        self.tabContainer = self.getTabContainer(domWindow);

        // Tab bar scrolling core code.
        self.tabContainer.addScrollListener(function(event) {
            var downScrollsLeft = self.downScrollsLeft;
            var scrollWrap = self.scrollWrap;        

            if (event.detail < 0) {
                // event.detail is negative, the wheel has scrolled UP.

                if (downScrollsLeft) {
                    // The next sibling check is to fix a bug where if the current tab is the last tab and a new tab
                    // is opened to the right in the background, the "last-tab" attribute is not updated properly.
                    self.tabContainer.advanceSelectedTab(1, scrollWrap);   // Go to next/right tab.
                }
                else {
                    self.tabContainer.advanceSelectedTab(-1, scrollWrap);  // Go to previous/left tab.
                }
            }
            else {
                // event.detail is positive, the wheel has scrolled DOWN.

                if (downScrollsLeft) {
                    self.tabContainer.advanceSelectedTab(-1, scrollWrap);  // Go to previous/left tab.
                }
                else {
                    // The next sibling check is to fix a bug where if the current tab is the last tab and a new tab
                    // is opened to the right in the background, the "last-tab" attribute is not updated properly.
                    self.tabContainer.advanceSelectedTab(1, scrollWrap);   // Go to next/right tab.
                }
            }

            event.stopPropagation();
        });
    };

    /*
     * Finds the appropriate tab container to use.
     */
    self.getTabContainer = function(domWindow) {
        var container = self.getBrowserTabContainer(domWindow);

        if (container == null) {
            container = self.getMailTabContainer(domWindow);
        }

        if (container != null) {
            return new TabScrollContainer(container);
        }
    };

    self.getBrowserTabContainer = function(domWindow) {           
        var tabBrowser = domWindow.document.getElementById('content');
        if (tabBrowser == null) {
            return null;
        }
        return tabBrowser.tabContainer;
    };

    self.getMailTabContainer = function(domWindow) {
        var tabMail = domWindow.document.getElementById('tabmail');
        if (tabMail == null) {
            return null;
        }
        return tabMail.tabContainer;
    };

    /*
     * Handles cleanup.
     */
    self.dispose = function() {
        self.tabContainer.removeScrollListener();
        self.prefs.removeObserver("", self);
    };

    /*
     * Handles preference updates.
     */
    self.observe = function(subject, topic, data) {
        // Ignore events that don't deal with preference changes.
        if (topic != 'nsPref:changed') {
            return;
        }

        switch(data) {
            case 'downScrollsLeft':
                self.downScrollsLeft = self.prefs.getBoolPref('downScrollsLeft');
                break;

            case 'scrollWrap':
                self.scrollWrap = self.prefs.getBoolPref('scrollWrap');
                break;
        }
    };

    return self;
};