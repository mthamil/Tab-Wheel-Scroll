"use strict";

import * as tabUtils from "./sdk/tabs/utils";
import { viewFor }   from "sdk/view/core";
import { prefs } 	 from "sdk/simple-prefs";

class TabWheelScroll {
	
	constructor(window) {
		this.window = window;
		const tabContainer = tabUtils.getTabContainer(viewFor(window));
		
		this.wheelHandler = event => TabWheelScroll.handleScroll(event, window);
		tabContainer.addEventListener("wheel", this.wheelHandler, true);
	}
	
	static handleScroll(event, window) {
		const downScrollsLeft = prefs["downScrollsLeft"];
		const scrollWrap = prefs["scrollWrap"];
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
		tabContainer.removeEventListener("wheel", this.wheelHandler, true);
	}
}

export { TabWheelScroll };