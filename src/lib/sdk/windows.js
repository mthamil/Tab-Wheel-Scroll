"use strict";

import { browserWindows as bWindows} from "sdk/windows";
import { mailWindows as mWindows }   from "./windows/mail";

class ComposingIterator {
    constructor(...iterators) {
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

    [Symbol.iterator]() {
        return new ComposingIterator(bWindows[Symbol.iterator](), mWindows[Symbol.iterator]());
    }
    
    on(type, handler) {
        bWindows.on(type, handler);
        mWindows.on(type, handler);
    }
    
    off(type, handler) {
        bWindows.off(type, handler);
        mWindows.off(type, handler);
    }
}

export let allWindows = new WindowsAdapter();