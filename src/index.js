import * as prefService   from "addon-sdk/lib/sdk/preferences/service";
import { prefs }          from "addon-sdk/lib/sdk/simple-prefs";
import { WindowManager }  from "./lib/WindowManager";
import { TabWheelScroll } from "./lib/TabWheelScroll";

let windowManager = null;

function migrate(preference) {
    if (prefService.has(`extensions.extensions.tabscroll.${preference}`)) {
        prefs[preference] = prefService.get(`extensions.extensions.tabscroll.${preference}`);
    }
}

export function main(options) {
    if (options.loadReason === "upgrade") {
        [ "downScrollsLeft", "scrollWrap" ].forEach(p => migrate(p));
    }

    windowManager = new WindowManager(
        (window) => new TabWheelScroll(window),
        (tabWheelScroll) => tabWheelScroll.dispose());
}

export function onUnload() {
    windowManager.dispose();
}