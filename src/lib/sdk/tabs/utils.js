"use strict";

import * as tabUtils from "sdk/tabs/utils";

function getTabContainer(window) {
    let container = tabUtils.getTabContainer(window);
    if (!container && window.GetTabMail) {
        container = window.GetTabMail().tabContainer;
    }
    return container;
}

export { getTabContainer };