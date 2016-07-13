"use strict";

import { browserWindows } from "sdk/windows";
import { mailWindows }   from "./windows/mail";

class ComposingIterator {
    constructor(iterators) {
        this.iterators = iterators;
        this.index = 0;
    }
    
    next() {
        const current = this.iterators[this.index].next();
        if (current.done && this.index < this.iterators.length - 1) {
            this.index = this.index + 1;
            return this.next();
        } else {
            return current;
        }
    }
}

class WindowsAdapter {

    constructor(...windows) {
        this.windows = windows;
    }

    [Symbol.iterator]() {
        return new ComposingIterator(this.windows.map(w => w[Symbol.iterator]()));
    }
    
    on(type, handler) {
        this.windows.forEach(w => w.on(type, handler));
    }
    
    off(type, handler) {
        this.windows.forEach(w => w.off(type, handler));
    }
}

export const allWindows = new WindowsAdapter(browserWindows, mailWindows);