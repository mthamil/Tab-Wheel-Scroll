/*
 * Wrapper for tab containers.
 */
function TabWheelScroll_TabContainer(tabContainer)
{
    this.tabContainer = tabContainer;

    this.advanceSelectedTab = function(direction, wrap)
    {
        this.tabContainer.advanceSelectedTab(direction, wrap);
    };

    this.addScrollListener = function(listener)
    {
        this.tabContainer.addEventListener("DOMMouseScroll", listener, true);
    };
};

var TabWheelScroll = 
{
    prefService: null,
    prefs: null,
    prefsPrefix: "extensions.tabscroll.",
    
    downScrollsLeft: true,   // move left on scroll down
    scrollWrap: true,        // scrolling past the ends of the tab bar wraps around to other end
        
    startup: function()
    {
        this.prefService = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService);
            
        // Register to receive notifications of preference changes.
        this.prefs = this.prefService.getBranch(this.prefsPrefix);
        this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
        this.prefs.addObserver("", this, false);
        
        // Read preferences.
        this.downScrollsLeft = this.prefs.getBoolPref("downScrollsLeft");
        this.scrollWrap = this.prefs.getBoolPref("scrollWrap");
        
        var tabContainer = this.getTabContainer();
        
        // Tab bar scrolling core code.
        tabContainer.addScrollListener(function(event)
        {
            var downScrollsLeft = TabWheelScroll.downScrollsLeft;
            var scrollWrap = TabWheelScroll.scrollWrap;        
                
            if (event.detail < 0)
            {
                // event.detail is negative, the wheel has scrolled UP.
            
                if (downScrollsLeft)
                {
                    // The next sibling check is to fix a bug where if the current tab is the last tab and a new tab
                    // is opened to the right in the background, the "last-tab" attribute is not updated properly.
                    tabContainer.advanceSelectedTab(1, TabWheelScroll.scrollWrap);   // Go to next/right tab.
                }
                else
                {
                    tabContainer.advanceSelectedTab(-1, TabWheelScroll.scrollWrap);  // Go to previous/left tab.
                }
            }
            else
            {
                // event.detail is positive, the wheel has scrolled DOWN.
            
                if (downScrollsLeft)
                {
                    tabContainer.advanceSelectedTab(-1, TabWheelScroll.scrollWrap);  // Go to previous/left tab.
                }
                else
                {
                    // The next sibling check is to fix a bug where if the current tab is the last tab and a new tab
                    // is opened to the right in the background, the "last-tab" attribute is not updated properly.
                    tabContainer.advanceSelectedTab(1, TabWheelScroll.scrollWrap);   // Go to next/right tab.
                }
            }
            
            event.stopPropagation();
            
        });
    },
    
    /*
     * Finds the appropriate tab container to use.
     */
    getTabContainer: function()
    {
        var tabContainer = this.getBrowserTabContainer();

        if (tabContainer == null)
            tabContainer = this.getMailTabContainer();
        
        if (tabContainer != null)
            return new TabWheelScroll_TabContainer(tabContainer);
    },
    
    getBrowserTabContainer : function()
    {           
        var tabBrowser = window.document.getElementById("content");
        if (tabBrowser == null)
            return null;

        return tabBrowser.tabContainer;
    },
    
    getMailTabContainer: function()
    {
        var tabMail = window.document.getElementById("tabmail");
        if (tabMail == null)
            return null;
            
        return tabMail.tabContainer;
    },
    
    /*
     * Handles window unload events.
     */
    shutdown: function()
    {
        this.prefs.removeObserver("", this);
    },
    
    
    /*
     * Handles preference updates.
     */
    observe: function(subject, topic, data)
    {
        // Ignore events that don't deal with preference changes.
        if (topic != "nsPref:changed")
            return;
 
        switch(data)
        {
            case "downScrollsLeft":
                this.downScrollsLeft = this.prefs.getBoolPref("downScrollsLeft");
                break;
                
            case "scrollWrap":
                this.scrollWrap = this.prefs.getBoolPref("scrollWrap");
                break;
        }
    }
};

window.addEventListener("load", function(e) { TabWheelScroll.startup(); }, false);
window.addEventListener("unload", function(e) { TabWheelScroll.shutdown(); }, false);
