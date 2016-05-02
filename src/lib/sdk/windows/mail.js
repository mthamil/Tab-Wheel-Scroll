"use strict";

const windowUtils        = require('sdk/window/utils');
const { emit }           = require("sdk/event/core");
const { EventTarget }    = require("sdk/event/target");
const system             = require("sdk/system");
const { viewFor }        = require('sdk/view/core');
const { modelFor }       = require("sdk/model/core");
const { WindowObserver } = require("./observer");

class MailWindow {
    constructor(chrome) {
        this._chrome = chrome; 
    }  
}

class MailWindows extends EventTarget {
    
    constructor() {
        super();
        this.windowType = "mail:3pane";
        this.windows = [];
        
        // These are defined as properties instead of class methods due to apparent inheritance quirks.
        this[Symbol.iterator] = () => this.windows[Symbol.iterator]();
        this.isMailWindow = window => window.document.documentElement.getAttribute("windowtype") === this.windowType;
        
        if (["SeaMonkey", "Thunderbird"].includes(system.name)) {
            for (let existing of windowUtils.windows(this.windowType)) {
                this.windows.push(new MailWindow(existing));
            }
        
            this.windowObserver = new WindowObserver(
                window => {
                    if (this.isMailWindow(window)) {
                        this.windows.push(new MailWindow(window));
                        emit(this, "open", window);
                    }
                }, window => {
                    if (this.isMailWindow(window)) {
                        const index = this.windows.findIndex(w => w._chrome === window);
                        if (index > -1) {
                            this.windows.splice(index, 1);
                            emit(this, "close", window);
                        }
                    }
                }
            );
            
            viewFor.define(MailWindow, window => window._chrome);
    
            modelFor.when(this.isMailWindow, view => {
                const index = this.windows.findIndex(model => viewFor(model) === view);
                return index > -1 ? this.windows[index] : null;
            });
        }
    }
    
}

exports.mailWindows = new MailWindows();