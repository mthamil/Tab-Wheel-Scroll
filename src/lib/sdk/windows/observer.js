"use strict";

const { Cc, Ci } = require('chrome');
const unload     = require("sdk/system/unload");

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
            let handler = null;
            handler = e => {
                this.onOpen(subject);
                subject.removeEventListener(handler);
            };
            subject.addEventListener("load", handler);
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
    
exports.WindowObserver = WindowObserver;