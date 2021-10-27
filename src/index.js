import FingerprintJS from "@fingerprintjs/fingerprintjs";
import isbot from "isbot";
import { v4 as uuidv4 } from "uuid";
import Bowser from "bowser";
import * as cookie from "js-cookie";

const BACKEND_URL = "";

function makeHit(fpResult) {
	const _browser = Bowser.parse(window.navigator.userAgent);
	var visitorId = fpResult.visitorId;
	var ocmId = getCookie();
	var googleID = window.gaGlobal?.vid || "";
	var searchParams = location.search;
	var userAgent = window.navigator.userAgent;
	var browser = `${_browser.browser.name}/${_browser.browser.version}` || "";
	var platform = _browser.platform.type || "";
	var os = `${_browser.os.name || ""}/${_browser.os.versionName || ""}/${
		_browser.os.version || ""
	} `;
	var url = `${location.protocol}//${location.hostname + location.pathname}`;
	var language = window.navigator.language;
	var referrer = document.referrer;
	var host = getHost(location.hostname);
	var viewportSize = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`;
	var windowSize = `${window.outerWidth}x${window.outerHeight}`;

	const hit = {
		fpID: visitorId,
		googleID: googleID,
		oid: ocmId,
		os: os,
		browser: browser,
		userAgent: userAgent,
		platform: platform,
		url: url,
		language: language,
		hostname: host,
		searchParams: searchParams,
		referrer: referrer,
		viewportSize: viewportSize,
		windowSize: windowSize,
	};
	window._reaperHit = { fpid: visitorId, gid: googleID, oid: ocmId };

	return hit;
}

function send(hit) {
	if (!isbot(hit.userAgent)) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", BACKEND_URL);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(hit);
	}
}

function getCookie() {
	var _cookie = cookie.get("oid");
	const uuid = uuidv4();
	if (_cookie) {
		return _cookie;
	} else {
		cookie.set("oid", uuid);
	}
	return cookie.get("oid");
}
function getHost(hostname) {
	var host = hostname.split(".");
	host.shift();
	host = host.join(".");
	return host;
}

(function main() {
	FingerprintJS.load()
		.then((fp) => fp.get())
		.then((fpResult) => makeHit(fpResult))
		.then((hit) => send(hit));
})();
