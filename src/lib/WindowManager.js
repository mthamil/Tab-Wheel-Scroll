"use strict";

import { allWindows as windows } from "./sdk/windows";

class WindowManager {

	constructor(setup, teardown) {
		this.setup = setup;
		this.teardown = teardown;
		this.trackedWindows = new Map();
		
		// Set up all already open browser windows.
		for (let window of windows) {
			this.initialize(window);
		}
		
		// Listen for window events.
		windows.on("open", window => this.initialize(window));
		windows.on("close", window => {
			if (this.trackedWindows.has(window)) {
				const tracked = this.trackedWindows.get(window);
				this.teardown(tracked);
				this.trackedWindows.delete(window);
			}
		});
	}
	
	initialize(window) {
		const tracked = this.setup(window);
		this.trackedWindows.set(window, tracked);
	}
	
	dispose() {
		for (let tracked of this.trackedWindows.values()) {
			this.teardown(tracked);
		}
		this.trackedWindows.clear();
	}
}

export { WindowManager };