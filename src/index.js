import { WindowManager }  from "./lib/WindowManager";
import { TabWheelScroll } from "./lib/TabWheelScroll";

let windowManager = null;

export function main() {
	windowManager = new WindowManager(
		(window) => new TabWheelScroll(window),
		(tabWheelScroll) => tabWheelScroll.dispose());
}

export function onUnload() {
	windowManager.dispose();
}