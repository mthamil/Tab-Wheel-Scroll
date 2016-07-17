"use strict";

import { run }                       from "addon-sdk/lib/sdk/test";
import { browserWindows as windows } from "addon-sdk/lib/sdk/windows";
import * as tabUtils                 from "addon-sdk/lib/sdk/tabs/utils";
import { viewFor }                   from "addon-sdk/lib/sdk/view/core";
import { TabWheelScroll }            from "../lib/TabWheelScroll";

function addOneTimeListener(target, name, handler, useCapture) {
    const wrappingHandler = event => {
        handler(event);
        target.removeEventListener(name, wrappingHandler, useCapture);
    };
    target.addEventListener(name, wrappingHandler, useCapture);
}

export function test_new_TabWheelScroll(assert) {
    // Arrange.
    const window = windows[0]
    
    // Act.
    const underTest = new TabWheelScroll(window);
    
    // Assert.
    assert.pass("Construction succeeded.");
}

export function test_TabWheelScroll_wheel_scrolls_up(assert, done) {
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
}

run(exports);
