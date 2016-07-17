"use strict";

import { run }            from "addon-sdk/lib/sdk/test";
import { browserWindows } from "addon-sdk/lib/sdk/windows";
import { WindowObserver } from "../lib/sdk/windows/observer";

export function test_load_event(assert, done) {
    
    // Arrange.
    let wasLoaded = false;
    const underTest = new WindowObserver(
        w => wasLoaded = true,
        w => {}
    );
    
    // Act.
    const window = browserWindows.open({ 
        url: "about:blank",
        onOpen: w => w.close()
    });
     
     browserWindows.on("close", w => {
        if (w !== window) { return; }
         
        // Assert.
        assert.ok(wasLoaded, "Window was not loaded.");
        
        done();
     });
}

export function test_unload_event(assert, done) {
    
    // Arrange.
    let wasUnloaded = false;
    const underTest = new WindowObserver(
        w => {},
        w => { 
            wasUnloaded = true; 
            
            // Assert.
            assert.ok(wasUnloaded, "Window was not unloaded.");
            done(); 
        }
    );
    
    // Act.
    const window = browserWindows.open({ 
        url: "about:blank",
        onOpen: w => w.close()
    });
}

run(exports);