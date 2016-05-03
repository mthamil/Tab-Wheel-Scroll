"use strict";

import * as tabUtils from "sdk/tabs/utils";

function getTabContainer(window) {
    const tabMail = window.document.getElementById("tabmail");
    if (tabMail) {
        return tabMail.tabContainer;
    } else {
        return tabUtils.getTabContainer(window);
    }
}

export { getTabContainer };