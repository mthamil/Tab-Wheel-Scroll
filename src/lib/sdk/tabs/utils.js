"use strict";

const tabUtils = require("sdk/tabs/utils");

function getTabContainer(window) {
    let container = tabUtils.getTabContainer(window);
    if (!container && window.GetTabMail) {
        container = window.GetTabMail().tabContainer;
    }
    return container;
}

exports.getTabContainer = getTabContainer;