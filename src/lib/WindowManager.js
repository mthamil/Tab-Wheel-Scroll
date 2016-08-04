import { allWindows as windows } from "./sdk/windows";

class WindowManager {

	constructor(setup, teardown) {
		this.setup = setup;
		this.teardown = teardown;
		this.trackedWindows = new Map();
		
		// Set up all already open browser windows.
		for (const window of windows) {
			this.attach(window);
		}
		
		// Listen for window events.
		windows.on("open", window => this.attach(window));
		windows.on("close", window => this.detach(window));
	}
	
	attach(window) {
		const tracked = this.setup(window);
		this.trackedWindows.set(window, tracked);
	}
	
	detach(window) {
		if (this.trackedWindows.has(window)) {
			const tracked = this.trackedWindows.get(window);
			this.teardown(tracked);
			this.trackedWindows.delete(window);
		}
	}
	
	dispose() {
		for (const tracked of this.trackedWindows.values()) {
			this.teardown(tracked);
		}
		this.trackedWindows.clear();
	}
}

export { WindowManager };