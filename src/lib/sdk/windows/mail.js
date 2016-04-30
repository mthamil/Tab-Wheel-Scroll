"use strict";

const windowUtils = require('sdk/window/utils');
const events = require("sdk/system/events");
const { viewFor } = require('sdk/view/core');

const mailWindows = {
    [Symbol.iterator]: function() { return { next: function() { return { done: true }; } } },
    on: (type, handler) => {}
};

//const system = require("sdk/system");

// if (["SeaMonkey", "Thunderbird"].includes(system.name)) {

//     const windows = [];
    
//     for (const existing of windowUtils.windows("mail:3pane")) {
//         windows.push(new MailWindow(existing));
//     }
    
//     events.on("xul-window-registered", e => {
//         const xulWindow = e.subject.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
//                                    .getInterface(Components.interfaces.nsIDOMWindow);
        
//         windows.push(new MailWindow(xulWindow));
//     });
    
//     events.on("dom-window-destroyed", e => {
//         const xulWindow = e.subject;
//         const index = windows.indexOf(xulWindow);
//         if (index > -1) {
//             windows.splice(index, 1);
//         }
//     });
    
//     mailWindows[Symbol.iterator] = function* () {
//         for (const window of windows) {
//             yield window;
//         }
//     };
    
//     class MailWindow {
//         constructor(xulWindow) {
//             this.xulWindow = xulWindow; 
//         }  
//     }
    
//     viewFor.implement(MailWindow, window => window.xulWindow);
// }

exports.mailWindows = mailWindows;