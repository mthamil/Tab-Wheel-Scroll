"use strict";

const tabUtils = require("sdk/tabs/utils");
const { viewFor } = require("sdk/view/core");
const preferences  = require('sdk/simple-prefs').prefs;

class TabWheelScroll {
	
	constructor(window) {
		this.window = window;
		const tabContainer = tabUtils.getTabContainer(viewFor(window));
		
		this.wheelHandler = (event) => this.handleScroll(event, window);
		tabContainer.addEventListener("wheel", this.wheelHandler, false);
	}
	
	handleScroll(event, window) {
		let downScrollsLeft = preferences["downScrollsLeft"];
		let scrollWrap = preferences["scrollWrap"];
		const tabContainer = tabUtils.getTabContainer(viewFor(window));

		if (event.deltaY < 0) {
			// event.deltaY is negative, the wheel has scrolled UP.

			if (downScrollsLeft) {
				tabContainer.advanceSelectedTab(1, scrollWrap);   // Go to next/right tab.
			}
			else {
				tabContainer.advanceSelectedTab(-1, scrollWrap);  // Go to previous/left tab.
			}
		}
		else {
			// event.deltaY is positive, the wheel has scrolled DOWN.

			if (downScrollsLeft) {
				tabContainer.advanceSelectedTab(-1, scrollWrap);  // Go to previous/left tab.
			}
			else {
				tabContainer.advanceSelectedTab(1, scrollWrap);   // Go to next/right tab.
			}
		}

		event.stopPropagation();
		event.preventDefault();
	}
	
	dispose() {
		const tabContainer = tabUtils.getTabContainer(viewFor(this.window));
		tabContainer.removeEventListener("wheel", this.wheelHandler, false);
	}
}

exports.TabWheelScroll = TabWheelScroll;