"use strict";

const self = require("sdk/self");
const { WindowManager } = require("./lib/WindowManager");
const { TabWheelScroll } = require("./lib/TabWheelScroll");

let windowManager = null;

exports.main = function() {
	windowManager = new WindowManager(
		(window) => new TabWheelScroll(window),
		(tabWheelScroll) => tabWheelScroll.dispose());
};

exports.onUnload = function() {
	windowManager.dispose();
}