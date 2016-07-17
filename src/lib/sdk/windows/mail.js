"use strict";

import * as windowUtils   from "addon-sdk/lib/sdk/window/utils";
import { emit }           from "addon-sdk/lib/sdk/event/core";
import { EventTarget }    from "addon-sdk/lib/sdk/event/target";
import * as system        from "addon-sdk/lib/sdk/system";
import { viewFor }        from "addon-sdk/lib/sdk/view/core";
import { modelFor }       from "addon-sdk/lib/sdk/model/core";
import { ns }             from "addon-sdk/lib/sdk/core/namespace";
import { WindowObserver } from "./observer"
import { Extendable }     from "../core/heritage"

const mailNS = ns();

class MailWindow {
    constructor(chrome) {
        mailNS(this).chrome = chrome; 
    }  
}

class MailWindows extends Extendable(EventTarget) {

    constructor() {
        super();
        
        this.windowType = "mail:3pane";
        this.windows = [];
        
        if (["SeaMonkey", "Thunderbird"].indexOf(system.name) > -1) {

            for (const existing of windowUtils.windows(this.windowType)) {
                this.windows.push(new MailWindow(existing));
            }
        
            this.windowObserver = new WindowObserver(
                window => {
                    if (this.isMailWindow(window)) {
                        const model = new MailWindow(window);
                        this.windows.push(model);
                        emit(this, "open", model);
                    }
                }, window => {
                    if (this.isMailWindow(window)) {
                        const index = this.windows.findIndex(w => mailNS(w).chrome === window);
                        if (index > -1) {
                            const model = this.windows[index];
                            this.windows.splice(index, 1);
                            emit(this, "close", model);
                        }
                    }
                }
            );
            
            viewFor.define(MailWindow, window => mailNS(window).chrome);
    
            modelFor.when(this.isMailWindow, view => {
                const index = this.windows.findIndex(model => viewFor(model) === view);
                return index > -1 ? this.windows[index] : null;
            });
        }
    }
    
    [Symbol.iterator]() {
        return this.windows[Symbol.iterator]();
    }
    
    isMailWindow(window) {
        return window.document.documentElement.getAttribute("windowtype") === this.windowType;
    }
}

export const mailWindows = new MailWindows();