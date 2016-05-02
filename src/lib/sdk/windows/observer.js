"use strict";

import { Cc, Ci }  from "chrome";
import * as unload from "sdk/system/unload";

class WindowObserver {
    constructor(onOpen, onClose) {
        this.onOpen = onOpen;
        this.onClose = onClose;
        
        this.windowWatcher = Cc['@mozilla.org/embedcomp/window-watcher;1'].
                                getService(Ci.nsIWindowWatcher);
        this.windowWatcher.registerNotification(this);
        
        unload.ensure(this);
    }
    
    observe(subject, topic) {
        if (topic === "domwindowopened") {
            const handler = e => {
                this.onOpen(subject);
                subject.removeEventListener("load", handler, false);
            };
            subject.addEventListener("load", handler, false);
        } else if (topic === "domwindowclosed") {
            this.onClose(subject);
        }
    }
    
    unload(reason) {
        if (["uninstall", "disable", "shutdown", "upgrade", "downgrade"].includes(reason)) {
            this.windowWatcher.unregisterNotification(this);
        }
    }
}
    
export { WindowObserver };