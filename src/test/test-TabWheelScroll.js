"use strict";

import { run }                       from "sdk/test";
import { browserWindows as windows } from "sdk/windows";
import * as tabUtils                 from "sdk/tabs/utils";
import { viewFor }                   from "sdk/view/core";
import { TabWheelScroll }            from "../lib/TabWheelScroll";

function addOneTimeListener(target, name, handler, useCapture) {
    const wrappingHandler = event => {
        handler(event);
        target.removeEventListener(name, wrappingHandler, useCapture);
    };
    target.addEventListener(name, wrappingHandler, useCapture);
}

exports["test new TabWheelScroll"] = assert => {
    // Arrange.
    const window = windows[0]
    
    // Act.
    const underTest = new TabWheelScroll(window);
    
    // Assert.
    assert.pass("Construction succeeded.");
};

exports["test TabWheelScroll wheel scrolls up"] = (assert, done) => {
    // Arrange.
    const window = windows[0]
    const windowView = viewFor(window);
    const underTest = new TabWheelScroll(window);
    
    const newTab = tabUtils.openTab(windowView, "about:blank", {
            inBackground: true
        });
    const tabContainer = tabUtils.getTabContainer(windowView);
    tabContainer.selectedIndex = 0;
    
    addOneTimeListener(tabContainer, "wheel", event => {
        // Assert.
        assert.equal(tabContainer.selectedIndex, 1, "Correct tab was not selected.");
        
        tabUtils.closeTab(newTab);
        done();
    }, true);
    
    // Act.
    tabContainer.dispatchEvent(new windowView.WheelEvent("wheel", { deltaY: -3 }));
};

run(exports);
