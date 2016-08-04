import * as events from "addon-sdk/lib/sdk/system/events";
import * as unload from "addon-sdk/lib/sdk/system/unload";

class WindowObserver {
    constructor(onOpen, onClose) {
        this.onOpen = onOpen;
        this.onClose = onClose;
        
        const unloadHandler = e =>  {
            this.onClose(e.currentTarget);
            e.currentTarget.removeEventListener("unload", unloadHandler, false);
        };
        
        const loadHandler = e => {
            this.onOpen(e.currentTarget);
            e.currentTarget.addEventListener("unload", unloadHandler, false);
            e.currentTarget.removeEventListener("load", loadHandler, false);
        };
        
        this.windowHandler = e => {
            e.subject.addEventListener("load", loadHandler, false);
        };
        
        events.on("toplevel-window-ready", this.windowHandler);
        
        unload.ensure(this);
    }
    
    unload(reason) {
        if (["uninstall", "disable", "shutdown", "upgrade", "downgrade"].indexOf(reason) > -1) {
            events.off("toplevel-window-ready", this.windowHandler);
        }
    }
}
    
export { WindowObserver };