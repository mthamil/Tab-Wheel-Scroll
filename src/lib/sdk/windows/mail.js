"use strict";

import * as windowUtils   from "sdk/window/utils";
import { emit }           from "sdk/event/core";
import { EventTarget }    from "sdk/event/target";
import * as system        from "sdk/system";
import { viewFor }        from "sdk/view/core";
import { modelFor }       from "sdk/model/core";
import { ns }             from "sdk/core/namespace";
import { WindowObserver } from "./observer"

const mailNS = ns();

class MailWindow {
    constructor(chrome) {
        mailNS(this).chrome = chrome; 
    }  
}

class MailWindows extends EventTarget {
    
    constructor() {
        super();
        this.windowType = "mail:3pane";
        this.windows = [];
        
        // These are defined as properties instead of class methods due to apparent inheritance quirks.
        this[Symbol.iterator] = () => this.windows[Symbol.iterator]();

        if (["SeaMonkey", "Thunderbird"].indexOf(system.name) > -1) {
            this.isMailWindow = window => window.document.documentElement.getAttribute("windowtype") === this.windowType;
            
            for (let existing of windowUtils.windows(this.windowType)) {
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
    
}

export let mailWindows = new MailWindows();