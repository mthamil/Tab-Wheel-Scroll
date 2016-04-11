"use strict";

const windows = require("sdk/windows").browserWindows;
const tabUtils = require("sdk/tabs/utils");
const { viewFor } = require("sdk/view/core");
const { TabWheelScroll } = require("../lib/TabWheelScroll");

function addOneTimeListener(target, name, handler, useCapture) {
    const wrappingHandler = (event) => {
        handler(event);
        target.removeEventListener(name, wrappingHandler, useCapture);
    };
    target.addEventListener(name, wrappingHandler, useCapture);
}

exports["test new TabWheelScroll"] = function(assert) {
    // Arrange.
    const window = windows[0]
    
    // Act.
    let underTest = new TabWheelScroll(window);
    
    // Assert.
    assert.pass("Construction succeeded.");
};

exports["test TabWheelScroll wheel event"] = function(assert, done) {
    // Arrange.
    const window = windows[0]
    const windowView = viewFor(window);
    let underTest = new TabWheelScroll(window);
    
    const newTab = tabUtils.openTab(windowView, "about:blank", {
            inBackground: true
        });
    const tabContainer = tabUtils.getTabContainer(windowView);
    tabContainer.selectedIndex = 0;
    
    addOneTimeListener(tabContainer, "wheel", (event) => {
        // Assert.
        assert.equal(tabContainer.selectedIndex, 1, "Correct tab was not selected.");
        
        tabUtils.closeTab(newTab);
        done();
    }, true);
    
    // Act.
    tabContainer.dispatchEvent(new windowView.WheelEvent("wheel", { deltaY: -3 }));
};

require("sdk/test").run(exports);
