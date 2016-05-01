"use strict";

const windowUtils       = require('sdk/window/utils');
const sysEvents         = require("sdk/system/events");
const { emit, on, off } = require("sdk/event/core");
const system            = require("sdk/system");
const { viewFor }       = require('sdk/view/core');
const { modelFor }      = require("sdk/model/core");

const mailWindows = {
    [Symbol.iterator]: function() { return { next: function() { return { done: true }; } } },
    on: (type, handler) => {}
};

//if (["SeaMonkey", "Thunderbird"].includes(system.name)) {
    const windowType = "mail:3pane";
    function isMailWindow(window) {
        return window.document.documentElement.getAttribute("windowtype") === windowType;
    }
    
    class MailWindow {
        constructor(chrome) {
            this._chrome = chrome; 
        }  
    }

    const windows = [];
    mailWindows[Symbol.iterator] = () => windows[Symbol.iterator]();
    
    for (let existing of windowUtils.windows(windowType)) {
        windows.push(new MailWindow(existing));
    }
    
    // sysEvents.on("xul-window-registered", e => {
    //     const xulWindow = e.subject.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
    //                                .getInterface(Components.interfaces.nsIDOMWindow);
    //     if (isMailWindow(xulWindow)) {
    //         windows.push(new MailWindow(xulWindow));
    //     }
    // });
    
    // sysEvents.on("dom-window-destroyed", e => {
    //     const xulWindow = e.subject;
    //     const index = windows.findIndex(w => w._chrome === xulWindow);
    //     if (index > -1) {
    //         windows.splice(index, 1);
    //     }
    // });
    
    viewFor.define(MailWindow, window => window._chrome);
    
    modelFor.when(isMailWindow, view => {
        for (let model of windows) {
            if (viewFor(model) === view) {
                return model;
            }
        }
        return null;
    });
//}

exports.mailWindows = mailWindows;