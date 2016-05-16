"use strict";

import { run }                       from "sdk/test";
import { browserWindows as windows } from "sdk/windows";
import { WindowManager }             from "../lib/WindowManager";

exports["test new WindowManager"] = assert => {  
    // Act.
    const underTest = new WindowManager(
        window => { window },
        tracked => {});
    
    // Assert.
    assert.equal(underTest.trackedWindows.size, 1, "Existing window should have been initialized.");
    assert.ok(underTest.trackedWindows.has(windows[0]), "Existing window should be tracked.");
};

exports["test dispose WindowManager"] = assert => {  
    // Arrange.
    const underTest = new WindowManager(
        window => { window },
        tracked => {});
        
    // Act.
    underTest.dispose();
    
    // Assert.
    assert.equal(underTest.trackedWindows.size, 0, "No windows should be tracked.");
};

exports["test WindowManager with new window opened"] = (assert, done) => {
    // Arrange.
    const underTest = new WindowManager(
        window => { window },
        tracked => {});
    
    windows.on("open", window => {
        // Assert.
        assert.equal(underTest.trackedWindows.size, 2, "Both windows should be tracked.");
        assert.ok(underTest.trackedWindows.has(windows[0]), "Existing window should be tracked.");
        assert.ok(underTest.trackedWindows.has(windows[1]), "New window should be tracked.");
        
        window.close();
        done();
    });
    
    // Act.
    windows.open({ url: "about:blank" });
};

exports["test WindowManager with new window closed"] = (assert, done) => {
    // Arrange.
    const originalWindow = windows[0];
    let newWindow = null;
    
    const underTest = new WindowManager(
        window => { window },
        tracked => {});
       
    windows.on("close", window => {
        if (window !== newWindow) { return; }
        
        // Assert.
        assert.equal(underTest.trackedWindows.size, 1, "New window should no longer be tracked.");
        assert.ok(underTest.trackedWindows.has(windows[0]), "Existing window should still be tracked.");
        
        done();
    });

    newWindow = windows.open({ 
        url: "about:blank",
        onOpen: window => {
            // Act.
            window.close();
        }
     });
};

run(exports);