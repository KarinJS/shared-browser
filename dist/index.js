import { n as __export, r as __toESM, t as __commonJS } from "./chunk-DUEDWNxO.js";
import assert from "node:assert";
import { spawn, spawnSync } from "node:child_process";
import fs, { createReadStream, createWriteStream, existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, readdir, unlink } from "node:fs/promises";
import os from "node:os";
import * as path$1 from "node:path";
import path from "node:path";
import ProgressBarClass from "progress";
import * as http from "node:http";
import * as https from "node:https";
import { URL as URL$1, urlToHttpOptions } from "node:url";
import { ProxyAgent } from "proxy-agent";
import debug, { default as debug$1 } from "debug";
import { Stream } from "node:stream";

//#region src/puppeteer-vendor/browser-data/types.ts
/**
* @license
* Copyright 2023 Google Inc.
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Supported browsers.
*
* @public
*/
let Browser = /* @__PURE__ */ function(Browser$1) {
	Browser$1["CHROME"] = "chrome";
	Browser$1["CHROMEHEADLESSSHELL"] = "chrome-headless-shell";
	Browser$1["CHROMIUM"] = "chromium";
	Browser$1["FIREFOX"] = "firefox";
	Browser$1["CHROMEDRIVER"] = "chromedriver";
	return Browser$1;
}({});
/**
* Platform names used to identify a OS platform x architecture combination in the way
* that is relevant for the browser download.
*
* @public
*/
let BrowserPlatform = /* @__PURE__ */ function(BrowserPlatform$1) {
	BrowserPlatform$1["LINUX"] = "linux";
	BrowserPlatform$1["LINUX_ARM"] = "linux_arm";
	BrowserPlatform$1["MAC"] = "mac";
	BrowserPlatform$1["MAC_ARM"] = "mac_arm";
	BrowserPlatform$1["WIN32"] = "win32";
	BrowserPlatform$1["WIN64"] = "win64";
	return BrowserPlatform$1;
}({});
/**
* Enum describing a release channel for a browser.
*
* You can use this in combination with {@link resolveBuildId} to resolve
* a build ID based on a release channel.
*
* @public
*/
let BrowserTag = /* @__PURE__ */ function(BrowserTag$1) {
	BrowserTag$1["CANARY"] = "canary";
	BrowserTag$1["NIGHTLY"] = "nightly";
	BrowserTag$1["BETA"] = "beta";
	BrowserTag$1["DEV"] = "dev";
	BrowserTag$1["DEVEDITION"] = "devedition";
	BrowserTag$1["STABLE"] = "stable";
	BrowserTag$1["ESR"] = "esr";
	BrowserTag$1["LATEST"] = "latest";
	return BrowserTag$1;
}({});
/**
* @public
*/
let ChromeReleaseChannel = /* @__PURE__ */ function(ChromeReleaseChannel$1) {
	ChromeReleaseChannel$1["STABLE"] = "stable";
	ChromeReleaseChannel$1["DEV"] = "dev";
	ChromeReleaseChannel$1["CANARY"] = "canary";
	ChromeReleaseChannel$1["BETA"] = "beta";
	return ChromeReleaseChannel$1;
}({});

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/constants.js
var require_constants = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/constants.js": ((exports, module) => {
	const SEMVER_SPEC_VERSION = "2.0.0";
	const MAX_LENGTH$2 = 256;
	const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER || 9007199254740991;
	const MAX_SAFE_COMPONENT_LENGTH$1 = 16;
	const MAX_SAFE_BUILD_LENGTH$1 = MAX_LENGTH$2 - 6;
	const RELEASE_TYPES = [
		"major",
		"premajor",
		"minor",
		"preminor",
		"patch",
		"prepatch",
		"prerelease"
	];
	module.exports = {
		MAX_LENGTH: MAX_LENGTH$2,
		MAX_SAFE_COMPONENT_LENGTH: MAX_SAFE_COMPONENT_LENGTH$1,
		MAX_SAFE_BUILD_LENGTH: MAX_SAFE_BUILD_LENGTH$1,
		MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
		RELEASE_TYPES,
		SEMVER_SPEC_VERSION,
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/debug.js
var require_debug = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/debug.js": ((exports, module) => {
	const debug$6 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {};
	module.exports = debug$6;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/re.js
var require_re = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/re.js": ((exports, module) => {
	const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH: MAX_LENGTH$1 } = require_constants();
	const debug$5 = require_debug();
	exports = module.exports = {};
	const re$4 = exports.re = [];
	const safeRe = exports.safeRe = [];
	const src = exports.src = [];
	const safeSrc = exports.safeSrc = [];
	const t$4 = exports.t = {};
	let R = 0;
	const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
	const safeRegexReplacements = [
		["\\s", 1],
		["\\d", MAX_LENGTH$1],
		[LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
	];
	const makeSafeRegex = (value) => {
		for (const [token, max] of safeRegexReplacements) value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
		return value;
	};
	const createToken = (name, value, isGlobal) => {
		const safe = makeSafeRegex(value);
		const index = R++;
		debug$5(name, index, value);
		t$4[name] = index;
		src[index] = value;
		safeSrc[index] = safe;
		re$4[index] = new RegExp(value, isGlobal ? "g" : void 0);
		safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
	};
	createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
	createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
	createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
	createToken("MAINVERSION", `(${src[t$4.NUMERICIDENTIFIER]})\\.(${src[t$4.NUMERICIDENTIFIER]})\\.(${src[t$4.NUMERICIDENTIFIER]})`);
	createToken("MAINVERSIONLOOSE", `(${src[t$4.NUMERICIDENTIFIERLOOSE]})\\.(${src[t$4.NUMERICIDENTIFIERLOOSE]})\\.(${src[t$4.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASEIDENTIFIER", `(?:${src[t$4.NONNUMERICIDENTIFIER]}|${src[t$4.NUMERICIDENTIFIER]})`);
	createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t$4.NONNUMERICIDENTIFIER]}|${src[t$4.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASE", `(?:-(${src[t$4.PRERELEASEIDENTIFIER]}(?:\\.${src[t$4.PRERELEASEIDENTIFIER]})*))`);
	createToken("PRERELEASELOOSE", `(?:-?(${src[t$4.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t$4.PRERELEASEIDENTIFIERLOOSE]})*))`);
	createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
	createToken("BUILD", `(?:\\+(${src[t$4.BUILDIDENTIFIER]}(?:\\.${src[t$4.BUILDIDENTIFIER]})*))`);
	createToken("FULLPLAIN", `v?${src[t$4.MAINVERSION]}${src[t$4.PRERELEASE]}?${src[t$4.BUILD]}?`);
	createToken("FULL", `^${src[t$4.FULLPLAIN]}$`);
	createToken("LOOSEPLAIN", `[v=\\s]*${src[t$4.MAINVERSIONLOOSE]}${src[t$4.PRERELEASELOOSE]}?${src[t$4.BUILD]}?`);
	createToken("LOOSE", `^${src[t$4.LOOSEPLAIN]}$`);
	createToken("GTLT", "((?:<|>)?=?)");
	createToken("XRANGEIDENTIFIERLOOSE", `${src[t$4.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
	createToken("XRANGEIDENTIFIER", `${src[t$4.NUMERICIDENTIFIER]}|x|X|\\*`);
	createToken("XRANGEPLAIN", `[v=\\s]*(${src[t$4.XRANGEIDENTIFIER]})(?:\\.(${src[t$4.XRANGEIDENTIFIER]})(?:\\.(${src[t$4.XRANGEIDENTIFIER]})(?:${src[t$4.PRERELEASE]})?${src[t$4.BUILD]}?)?)?`);
	createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t$4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t$4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t$4.XRANGEIDENTIFIERLOOSE]})(?:${src[t$4.PRERELEASELOOSE]})?${src[t$4.BUILD]}?)?)?`);
	createToken("XRANGE", `^${src[t$4.GTLT]}\\s*${src[t$4.XRANGEPLAIN]}$`);
	createToken("XRANGELOOSE", `^${src[t$4.GTLT]}\\s*${src[t$4.XRANGEPLAINLOOSE]}$`);
	createToken("COERCEPLAIN", `(^|[^\\d])(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
	createToken("COERCE", `${src[t$4.COERCEPLAIN]}(?:$|[^\\d])`);
	createToken("COERCEFULL", src[t$4.COERCEPLAIN] + `(?:${src[t$4.PRERELEASE]})?(?:${src[t$4.BUILD]})?(?:$|[^\\d])`);
	createToken("COERCERTL", src[t$4.COERCE], true);
	createToken("COERCERTLFULL", src[t$4.COERCEFULL], true);
	createToken("LONETILDE", "(?:~>?)");
	createToken("TILDETRIM", `(\\s*)${src[t$4.LONETILDE]}\\s+`, true);
	exports.tildeTrimReplace = "$1~";
	createToken("TILDE", `^${src[t$4.LONETILDE]}${src[t$4.XRANGEPLAIN]}$`);
	createToken("TILDELOOSE", `^${src[t$4.LONETILDE]}${src[t$4.XRANGEPLAINLOOSE]}$`);
	createToken("LONECARET", "(?:\\^)");
	createToken("CARETTRIM", `(\\s*)${src[t$4.LONECARET]}\\s+`, true);
	exports.caretTrimReplace = "$1^";
	createToken("CARET", `^${src[t$4.LONECARET]}${src[t$4.XRANGEPLAIN]}$`);
	createToken("CARETLOOSE", `^${src[t$4.LONECARET]}${src[t$4.XRANGEPLAINLOOSE]}$`);
	createToken("COMPARATORLOOSE", `^${src[t$4.GTLT]}\\s*(${src[t$4.LOOSEPLAIN]})$|^$`);
	createToken("COMPARATOR", `^${src[t$4.GTLT]}\\s*(${src[t$4.FULLPLAIN]})$|^$`);
	createToken("COMPARATORTRIM", `(\\s*)${src[t$4.GTLT]}\\s*(${src[t$4.LOOSEPLAIN]}|${src[t$4.XRANGEPLAIN]})`, true);
	exports.comparatorTrimReplace = "$1$2$3";
	createToken("HYPHENRANGE", `^\\s*(${src[t$4.XRANGEPLAIN]})\\s+-\\s+(${src[t$4.XRANGEPLAIN]})\\s*$`);
	createToken("HYPHENRANGELOOSE", `^\\s*(${src[t$4.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t$4.XRANGEPLAINLOOSE]})\\s*$`);
	createToken("STAR", "(<|>)?=?\\s*\\*");
	createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
	createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/parse-options.js
var require_parse_options = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/parse-options.js": ((exports, module) => {
	const looseOption = Object.freeze({ loose: true });
	const emptyOpts = Object.freeze({});
	const parseOptions$3 = (options) => {
		if (!options) return emptyOpts;
		if (typeof options !== "object") return looseOption;
		return options;
	};
	module.exports = parseOptions$3;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/identifiers.js
var require_identifiers = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/identifiers.js": ((exports, module) => {
	const numeric = /^[0-9]+$/;
	const compareIdentifiers$1 = (a, b) => {
		if (typeof a === "number" && typeof b === "number") return a === b ? 0 : a < b ? -1 : 1;
		const anum = numeric.test(a);
		const bnum = numeric.test(b);
		if (anum && bnum) {
			a = +a;
			b = +b;
		}
		return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
	};
	const rcompareIdentifiers = (a, b) => compareIdentifiers$1(b, a);
	module.exports = {
		compareIdentifiers: compareIdentifiers$1,
		rcompareIdentifiers
	};
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/classes/semver.js
var require_semver$1 = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/classes/semver.js": ((exports, module) => {
	const debug$4 = require_debug();
	const { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
	const { safeRe: re$3, t: t$3 } = require_re();
	const parseOptions$2 = require_parse_options();
	const { compareIdentifiers } = require_identifiers();
	var SemVer$15 = class SemVer$15 {
		constructor(version, options) {
			options = parseOptions$2(options);
			if (version instanceof SemVer$15) if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) return version;
			else version = version.version;
			else if (typeof version !== "string") throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
			if (version.length > MAX_LENGTH) throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
			debug$4("SemVer", version, options);
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			const m = version.trim().match(options.loose ? re$3[t$3.LOOSE] : re$3[t$3.FULL]);
			if (!m) throw new TypeError(`Invalid Version: ${version}`);
			this.raw = version;
			this.major = +m[1];
			this.minor = +m[2];
			this.patch = +m[3];
			if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
			if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
			if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
			if (!m[4]) this.prerelease = [];
			else this.prerelease = m[4].split(".").map((id) => {
				if (/^[0-9]+$/.test(id)) {
					const num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
				}
				return id;
			});
			this.build = m[5] ? m[5].split(".") : [];
			this.format();
		}
		format() {
			this.version = `${this.major}.${this.minor}.${this.patch}`;
			if (this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
			return this.version;
		}
		toString() {
			return this.version;
		}
		compare(other) {
			debug$4("SemVer.compare", this.version, this.options, other);
			if (!(other instanceof SemVer$15)) {
				if (typeof other === "string" && other === this.version) return 0;
				other = new SemVer$15(other, this.options);
			}
			if (other.version === this.version) return 0;
			return this.compareMain(other) || this.comparePre(other);
		}
		compareMain(other) {
			if (!(other instanceof SemVer$15)) other = new SemVer$15(other, this.options);
			if (this.major < other.major) return -1;
			if (this.major > other.major) return 1;
			if (this.minor < other.minor) return -1;
			if (this.minor > other.minor) return 1;
			if (this.patch < other.patch) return -1;
			if (this.patch > other.patch) return 1;
			return 0;
		}
		comparePre(other) {
			if (!(other instanceof SemVer$15)) other = new SemVer$15(other, this.options);
			if (this.prerelease.length && !other.prerelease.length) return -1;
			else if (!this.prerelease.length && other.prerelease.length) return 1;
			else if (!this.prerelease.length && !other.prerelease.length) return 0;
			let i = 0;
			do {
				const a = this.prerelease[i];
				const b = other.prerelease[i];
				debug$4("prerelease compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		compareBuild(other) {
			if (!(other instanceof SemVer$15)) other = new SemVer$15(other, this.options);
			let i = 0;
			do {
				const a = this.build[i];
				const b = other.build[i];
				debug$4("build compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		inc(release, identifier, identifierBase) {
			if (release.startsWith("pre")) {
				if (!identifier && identifierBase === false) throw new Error("invalid increment argument: identifier is empty");
				if (identifier) {
					const match = `-${identifier}`.match(this.options.loose ? re$3[t$3.PRERELEASELOOSE] : re$3[t$3.PRERELEASE]);
					if (!match || match[1] !== identifier) throw new Error(`invalid identifier: ${identifier}`);
				}
			}
			switch (release) {
				case "premajor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor = 0;
					this.major++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "preminor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "prepatch":
					this.prerelease.length = 0;
					this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "prerelease":
					if (this.prerelease.length === 0) this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "release":
					if (this.prerelease.length === 0) throw new Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
					this.minor = 0;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "minor":
					if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "patch":
					if (this.prerelease.length === 0) this.patch++;
					this.prerelease = [];
					break;
				case "pre": {
					const base = Number(identifierBase) ? 1 : 0;
					if (this.prerelease.length === 0) this.prerelease = [base];
					else {
						let i = this.prerelease.length;
						while (--i >= 0) if (typeof this.prerelease[i] === "number") {
							this.prerelease[i]++;
							i = -2;
						}
						if (i === -1) {
							if (identifier === this.prerelease.join(".") && identifierBase === false) throw new Error("invalid increment argument: identifier already exists");
							this.prerelease.push(base);
						}
					}
					if (identifier) {
						let prerelease$2 = [identifier, base];
						if (identifierBase === false) prerelease$2 = [identifier];
						if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
							if (isNaN(this.prerelease[1])) this.prerelease = prerelease$2;
						} else this.prerelease = prerelease$2;
					}
					break;
				}
				default: throw new Error(`invalid increment argument: ${release}`);
			}
			this.raw = this.format();
			if (this.build.length) this.raw += `+${this.build.join(".")}`;
			return this;
		}
	};
	module.exports = SemVer$15;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/parse.js
var require_parse = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/parse.js": ((exports, module) => {
	const SemVer$14 = require_semver$1();
	const parse$6 = (version, options, throwErrors = false) => {
		if (version instanceof SemVer$14) return version;
		try {
			return new SemVer$14(version, options);
		} catch (er) {
			if (!throwErrors) return null;
			throw er;
		}
	};
	module.exports = parse$6;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/valid.js
var require_valid$1 = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/valid.js": ((exports, module) => {
	const parse$5 = require_parse();
	const valid$1 = (version, options) => {
		const v = parse$5(version, options);
		return v ? v.version : null;
	};
	module.exports = valid$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/clean.js
var require_clean = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/clean.js": ((exports, module) => {
	const parse$4 = require_parse();
	const clean$1 = (version, options) => {
		const s = parse$4(version.trim().replace(/^[=v]+/, ""), options);
		return s ? s.version : null;
	};
	module.exports = clean$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/inc.js
var require_inc = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/inc.js": ((exports, module) => {
	const SemVer$13 = require_semver$1();
	const inc$1 = (version, release, options, identifier, identifierBase) => {
		if (typeof options === "string") {
			identifierBase = identifier;
			identifier = options;
			options = void 0;
		}
		try {
			return new SemVer$13(version instanceof SemVer$13 ? version.version : version, options).inc(release, identifier, identifierBase).version;
		} catch (er) {
			return null;
		}
	};
	module.exports = inc$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/diff.js
var require_diff = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/diff.js": ((exports, module) => {
	const parse$3 = require_parse();
	const diff$1 = (version1, version2) => {
		const v1 = parse$3(version1, null, true);
		const v2 = parse$3(version2, null, true);
		const comparison = v1.compare(v2);
		if (comparison === 0) return null;
		const v1Higher = comparison > 0;
		const highVersion = v1Higher ? v1 : v2;
		const lowVersion = v1Higher ? v2 : v1;
		const highHasPre = !!highVersion.prerelease.length;
		if (!!lowVersion.prerelease.length && !highHasPre) {
			if (!lowVersion.patch && !lowVersion.minor) return "major";
			if (lowVersion.compareMain(highVersion) === 0) {
				if (lowVersion.minor && !lowVersion.patch) return "minor";
				return "patch";
			}
		}
		const prefix = highHasPre ? "pre" : "";
		if (v1.major !== v2.major) return prefix + "major";
		if (v1.minor !== v2.minor) return prefix + "minor";
		if (v1.patch !== v2.patch) return prefix + "patch";
		return "prerelease";
	};
	module.exports = diff$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/major.js
var require_major = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/major.js": ((exports, module) => {
	const SemVer$12 = require_semver$1();
	const major$1 = (a, loose) => new SemVer$12(a, loose).major;
	module.exports = major$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/minor.js
var require_minor = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/minor.js": ((exports, module) => {
	const SemVer$11 = require_semver$1();
	const minor$1 = (a, loose) => new SemVer$11(a, loose).minor;
	module.exports = minor$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/patch.js
var require_patch = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/patch.js": ((exports, module) => {
	const SemVer$10 = require_semver$1();
	const patch$1 = (a, loose) => new SemVer$10(a, loose).patch;
	module.exports = patch$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/prerelease.js
var require_prerelease = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/prerelease.js": ((exports, module) => {
	const parse$2 = require_parse();
	const prerelease$1 = (version, options) => {
		const parsed = parse$2(version, options);
		return parsed && parsed.prerelease.length ? parsed.prerelease : null;
	};
	module.exports = prerelease$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/compare.js
var require_compare = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/compare.js": ((exports, module) => {
	const SemVer$9 = require_semver$1();
	const compare$11 = (a, b, loose) => new SemVer$9(a, loose).compare(new SemVer$9(b, loose));
	module.exports = compare$11;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/rcompare.js
var require_rcompare = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/rcompare.js": ((exports, module) => {
	const compare$10 = require_compare();
	const rcompare$1 = (a, b, loose) => compare$10(b, a, loose);
	module.exports = rcompare$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/compare-loose.js
var require_compare_loose = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/compare-loose.js": ((exports, module) => {
	const compare$9 = require_compare();
	const compareLoose$1 = (a, b) => compare$9(a, b, true);
	module.exports = compareLoose$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/compare-build.js
var require_compare_build = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/compare-build.js": ((exports, module) => {
	const SemVer$8 = require_semver$1();
	const compareBuild$3 = (a, b, loose) => {
		const versionA = new SemVer$8(a, loose);
		const versionB = new SemVer$8(b, loose);
		return versionA.compare(versionB) || versionA.compareBuild(versionB);
	};
	module.exports = compareBuild$3;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/sort.js
var require_sort = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/sort.js": ((exports, module) => {
	const compareBuild$2 = require_compare_build();
	const sort$1 = (list, loose) => list.sort((a, b) => compareBuild$2(a, b, loose));
	module.exports = sort$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/rsort.js
var require_rsort = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/rsort.js": ((exports, module) => {
	const compareBuild$1 = require_compare_build();
	const rsort$1 = (list, loose) => list.sort((a, b) => compareBuild$1(b, a, loose));
	module.exports = rsort$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/gt.js
var require_gt = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/gt.js": ((exports, module) => {
	const compare$8 = require_compare();
	const gt$4 = (a, b, loose) => compare$8(a, b, loose) > 0;
	module.exports = gt$4;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/lt.js
var require_lt = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/lt.js": ((exports, module) => {
	const compare$7 = require_compare();
	const lt$3 = (a, b, loose) => compare$7(a, b, loose) < 0;
	module.exports = lt$3;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/eq.js
var require_eq = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/eq.js": ((exports, module) => {
	const compare$6 = require_compare();
	const eq$2 = (a, b, loose) => compare$6(a, b, loose) === 0;
	module.exports = eq$2;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/neq.js
var require_neq = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/neq.js": ((exports, module) => {
	const compare$5 = require_compare();
	const neq$2 = (a, b, loose) => compare$5(a, b, loose) !== 0;
	module.exports = neq$2;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/gte.js
var require_gte = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/gte.js": ((exports, module) => {
	const compare$4 = require_compare();
	const gte$3 = (a, b, loose) => compare$4(a, b, loose) >= 0;
	module.exports = gte$3;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/lte.js
var require_lte = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/lte.js": ((exports, module) => {
	const compare$3 = require_compare();
	const lte$3 = (a, b, loose) => compare$3(a, b, loose) <= 0;
	module.exports = lte$3;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/cmp.js
var require_cmp = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/cmp.js": ((exports, module) => {
	const eq$1 = require_eq();
	const neq$1 = require_neq();
	const gt$3 = require_gt();
	const gte$2 = require_gte();
	const lt$2 = require_lt();
	const lte$2 = require_lte();
	const cmp$2 = (a, op, b, loose) => {
		switch (op) {
			case "===":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a === b;
			case "!==":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a !== b;
			case "":
			case "=":
			case "==": return eq$1(a, b, loose);
			case "!=": return neq$1(a, b, loose);
			case ">": return gt$3(a, b, loose);
			case ">=": return gte$2(a, b, loose);
			case "<": return lt$2(a, b, loose);
			case "<=": return lte$2(a, b, loose);
			default: throw new TypeError(`Invalid operator: ${op}`);
		}
	};
	module.exports = cmp$2;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/coerce.js
var require_coerce = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/coerce.js": ((exports, module) => {
	const SemVer$7 = require_semver$1();
	const parse$1 = require_parse();
	const { safeRe: re$2, t: t$2 } = require_re();
	const coerce$1 = (version, options) => {
		if (version instanceof SemVer$7) return version;
		if (typeof version === "number") version = String(version);
		if (typeof version !== "string") return null;
		options = options || {};
		let match = null;
		if (!options.rtl) match = version.match(options.includePrerelease ? re$2[t$2.COERCEFULL] : re$2[t$2.COERCE]);
		else {
			const coerceRtlRegex = options.includePrerelease ? re$2[t$2.COERCERTLFULL] : re$2[t$2.COERCERTL];
			let next;
			while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
				if (!match || next.index + next[0].length !== match.index + match[0].length) match = next;
				coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
			}
			coerceRtlRegex.lastIndex = -1;
		}
		if (match === null) return null;
		const major$2 = match[2];
		return parse$1(`${major$2}.${match[3] || "0"}.${match[4] || "0"}${options.includePrerelease && match[5] ? `-${match[5]}` : ""}${options.includePrerelease && match[6] ? `+${match[6]}` : ""}`, options);
	};
	module.exports = coerce$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/lrucache.js
var require_lrucache = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/internal/lrucache.js": ((exports, module) => {
	var LRUCache = class {
		constructor() {
			this.max = 1e3;
			this.map = /* @__PURE__ */ new Map();
		}
		get(key) {
			const value = this.map.get(key);
			if (value === void 0) return;
			else {
				this.map.delete(key);
				this.map.set(key, value);
				return value;
			}
		}
		delete(key) {
			return this.map.delete(key);
		}
		set(key, value) {
			if (!this.delete(key) && value !== void 0) {
				if (this.map.size >= this.max) {
					const firstKey = this.map.keys().next().value;
					this.delete(firstKey);
				}
				this.map.set(key, value);
			}
			return this;
		}
	};
	module.exports = LRUCache;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/classes/range.js
var require_range = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/classes/range.js": ((exports, module) => {
	const SPACE_CHARACTERS = /\s+/g;
	var Range$11 = class Range$11 {
		constructor(range, options) {
			options = parseOptions$1(options);
			if (range instanceof Range$11) if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
			else return new Range$11(range.raw, options);
			if (range instanceof Comparator$4) {
				this.raw = range.value;
				this.set = [[range]];
				this.formatted = void 0;
				return this;
			}
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
			this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
			if (!this.set.length) throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				const first = this.set[0];
				this.set = this.set.filter((c) => !isNullSet(c[0]));
				if (this.set.length === 0) this.set = [first];
				else if (this.set.length > 1) {
					for (const c of this.set) if (c.length === 1 && isAny(c[0])) {
						this.set = [c];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let i = 0; i < this.set.length; i++) {
					if (i > 0) this.formatted += "||";
					const comps = this.set[i];
					for (let k = 0; k < comps.length; k++) {
						if (k > 0) this.formatted += " ";
						this.formatted += comps[k].toString().trim();
					}
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(range) {
			const memoKey = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + range;
			const cached = cache.get(memoKey);
			if (cached) return cached;
			const loose = this.options.loose;
			const hr = loose ? re$1[t$1.HYPHENRANGELOOSE] : re$1[t$1.HYPHENRANGE];
			range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
			debug$3("hyphen replace", range);
			range = range.replace(re$1[t$1.COMPARATORTRIM], comparatorTrimReplace);
			debug$3("comparator trim", range);
			range = range.replace(re$1[t$1.TILDETRIM], tildeTrimReplace);
			debug$3("tilde trim", range);
			range = range.replace(re$1[t$1.CARETTRIM], caretTrimReplace);
			debug$3("caret trim", range);
			let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
			if (loose) rangeList = rangeList.filter((comp) => {
				debug$3("loose invalid filter", comp, this.options);
				return !!comp.match(re$1[t$1.COMPARATORLOOSE]);
			});
			debug$3("range list", rangeList);
			const rangeMap = /* @__PURE__ */ new Map();
			const comparators = rangeList.map((comp) => new Comparator$4(comp, this.options));
			for (const comp of comparators) {
				if (isNullSet(comp)) return [comp];
				rangeMap.set(comp.value, comp);
			}
			if (rangeMap.size > 1 && rangeMap.has("")) rangeMap.delete("");
			const result = [...rangeMap.values()];
			cache.set(memoKey, result);
			return result;
		}
		intersects(range, options) {
			if (!(range instanceof Range$11)) throw new TypeError("a Range is required");
			return this.set.some((thisComparators) => {
				return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
					return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
						return rangeComparators.every((rangeComparator) => {
							return thisComparator.intersects(rangeComparator, options);
						});
					});
				});
			});
		}
		test(version) {
			if (!version) return false;
			if (typeof version === "string") try {
				version = new SemVer$6(version, this.options);
			} catch (er) {
				return false;
			}
			for (let i = 0; i < this.set.length; i++) if (testSet(this.set[i], version, this.options)) return true;
			return false;
		}
	};
	module.exports = Range$11;
	const cache = new (require_lrucache())();
	const parseOptions$1 = require_parse_options();
	const Comparator$4 = require_comparator();
	const debug$3 = require_debug();
	const SemVer$6 = require_semver$1();
	const { safeRe: re$1, t: t$1, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
	const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
	const isNullSet = (c) => c.value === "<0.0.0-0";
	const isAny = (c) => c.value === "";
	const isSatisfiable = (comparators, options) => {
		let result = true;
		const remainingComparators = comparators.slice();
		let testComparator = remainingComparators.pop();
		while (result && remainingComparators.length) {
			result = remainingComparators.every((otherComparator) => {
				return testComparator.intersects(otherComparator, options);
			});
			testComparator = remainingComparators.pop();
		}
		return result;
	};
	const parseComparator = (comp, options) => {
		comp = comp.replace(re$1[t$1.BUILD], "");
		debug$3("comp", comp, options);
		comp = replaceCarets(comp, options);
		debug$3("caret", comp);
		comp = replaceTildes(comp, options);
		debug$3("tildes", comp);
		comp = replaceXRanges(comp, options);
		debug$3("xrange", comp);
		comp = replaceStars(comp, options);
		debug$3("stars", comp);
		return comp;
	};
	const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
	const replaceTildes = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
	};
	const replaceTilde = (comp, options) => {
		const r = options.loose ? re$1[t$1.TILDELOOSE] : re$1[t$1.TILDE];
		return comp.replace(r, (_, M, m, p, pr) => {
			debug$3("tilde", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
			else if (isX(p)) ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
			else if (pr) {
				debug$3("replaceTilde pr", pr);
				ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
			} else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
			debug$3("tilde return", ret);
			return ret;
		});
	};
	const replaceCarets = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
	};
	const replaceCaret = (comp, options) => {
		debug$3("caret", comp, options);
		const r = options.loose ? re$1[t$1.CARETLOOSE] : re$1[t$1.CARET];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug$3("caret", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) if (M === "0") ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
			else if (pr) {
				debug$3("replaceCaret pr", pr);
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
			} else {
				debug$3("no pr");
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
			}
			debug$3("caret return", ret);
			return ret;
		});
	};
	const replaceXRanges = (comp, options) => {
		debug$3("replaceXRanges", comp, options);
		return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
	};
	const replaceXRange = (comp, options) => {
		comp = comp.trim();
		const r = options.loose ? re$1[t$1.XRANGELOOSE] : re$1[t$1.XRANGE];
		return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
			debug$3("xRange", comp, ret, gtlt, M, m, p, pr);
			const xM = isX(M);
			const xm = xM || isX(m);
			const xp = xm || isX(p);
			const anyX = xp;
			if (gtlt === "=" && anyX) gtlt = "";
			pr = options.includePrerelease ? "-0" : "";
			if (xM) if (gtlt === ">" || gtlt === "<") ret = "<0.0.0-0";
			else ret = "*";
			else if (gtlt && anyX) {
				if (xm) m = 0;
				p = 0;
				if (gtlt === ">") {
					gtlt = ">=";
					if (xm) {
						M = +M + 1;
						m = 0;
						p = 0;
					} else {
						m = +m + 1;
						p = 0;
					}
				} else if (gtlt === "<=") {
					gtlt = "<";
					if (xm) M = +M + 1;
					else m = +m + 1;
				}
				if (gtlt === "<") pr = "-0";
				ret = `${gtlt + M}.${m}.${p}${pr}`;
			} else if (xm) ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
			else if (xp) ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
			debug$3("xRange return", ret);
			return ret;
		});
	};
	const replaceStars = (comp, options) => {
		debug$3("replaceStars", comp, options);
		return comp.trim().replace(re$1[t$1.STAR], "");
	};
	const replaceGTE0 = (comp, options) => {
		debug$3("replaceGTE0", comp, options);
		return comp.trim().replace(re$1[options.includePrerelease ? t$1.GTE0PRE : t$1.GTE0], "");
	};
	const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
		if (isX(fM)) from = "";
		else if (isX(fm)) from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
		else if (isX(fp)) from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
		else if (fpr) from = `>=${from}`;
		else from = `>=${from}${incPr ? "-0" : ""}`;
		if (isX(tM)) to = "";
		else if (isX(tm)) to = `<${+tM + 1}.0.0-0`;
		else if (isX(tp)) to = `<${tM}.${+tm + 1}.0-0`;
		else if (tpr) to = `<=${tM}.${tm}.${tp}-${tpr}`;
		else if (incPr) to = `<${tM}.${tm}.${+tp + 1}-0`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	};
	const testSet = (set, version, options) => {
		for (let i = 0; i < set.length; i++) if (!set[i].test(version)) return false;
		if (version.prerelease.length && !options.includePrerelease) {
			for (let i = 0; i < set.length; i++) {
				debug$3(set[i].semver);
				if (set[i].semver === Comparator$4.ANY) continue;
				if (set[i].semver.prerelease.length > 0) {
					const allowed = set[i].semver;
					if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
				}
			}
			return false;
		}
		return true;
	};
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/classes/comparator.js
var require_comparator = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/classes/comparator.js": ((exports, module) => {
	const ANY$2 = Symbol("SemVer ANY");
	var Comparator$3 = class Comparator$3 {
		static get ANY() {
			return ANY$2;
		}
		constructor(comp, options) {
			options = parseOptions(options);
			if (comp instanceof Comparator$3) if (comp.loose === !!options.loose) return comp;
			else comp = comp.value;
			comp = comp.trim().split(/\s+/).join(" ");
			debug$2("comparator", comp, options);
			this.options = options;
			this.loose = !!options.loose;
			this.parse(comp);
			if (this.semver === ANY$2) this.value = "";
			else this.value = this.operator + this.semver.version;
			debug$2("comp", this);
		}
		parse(comp) {
			const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
			const m = comp.match(r);
			if (!m) throw new TypeError(`Invalid comparator: ${comp}`);
			this.operator = m[1] !== void 0 ? m[1] : "";
			if (this.operator === "=") this.operator = "";
			if (!m[2]) this.semver = ANY$2;
			else this.semver = new SemVer$5(m[2], this.options.loose);
		}
		toString() {
			return this.value;
		}
		test(version) {
			debug$2("Comparator.test", version, this.options.loose);
			if (this.semver === ANY$2 || version === ANY$2) return true;
			if (typeof version === "string") try {
				version = new SemVer$5(version, this.options);
			} catch (er) {
				return false;
			}
			return cmp$1(version, this.operator, this.semver, this.options);
		}
		intersects(comp, options) {
			if (!(comp instanceof Comparator$3)) throw new TypeError("a Comparator is required");
			if (this.operator === "") {
				if (this.value === "") return true;
				return new Range$10(comp.value, options).test(this.value);
			} else if (comp.operator === "") {
				if (comp.value === "") return true;
				return new Range$10(this.value, options).test(comp.semver);
			}
			options = parseOptions(options);
			if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) return false;
			if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) return false;
			if (this.operator.startsWith(">") && comp.operator.startsWith(">")) return true;
			if (this.operator.startsWith("<") && comp.operator.startsWith("<")) return true;
			if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) return true;
			if (cmp$1(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) return true;
			if (cmp$1(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) return true;
			return false;
		}
	};
	module.exports = Comparator$3;
	const parseOptions = require_parse_options();
	const { safeRe: re, t } = require_re();
	const cmp$1 = require_cmp();
	const debug$2 = require_debug();
	const SemVer$5 = require_semver$1();
	const Range$10 = require_range();
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/satisfies.js
var require_satisfies = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/functions/satisfies.js": ((exports, module) => {
	const Range$9 = require_range();
	const satisfies$4 = (version, range, options) => {
		try {
			range = new Range$9(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	};
	module.exports = satisfies$4;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/to-comparators.js": ((exports, module) => {
	const Range$8 = require_range();
	const toComparators$1 = (range, options) => new Range$8(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
	module.exports = toComparators$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/max-satisfying.js": ((exports, module) => {
	const SemVer$4 = require_semver$1();
	const Range$7 = require_range();
	const maxSatisfying$1 = (versions, range, options) => {
		let max = null;
		let maxSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range$7(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!max || maxSV.compare(v) === -1) {
					max = v;
					maxSV = new SemVer$4(max, options);
				}
			}
		});
		return max;
	};
	module.exports = maxSatisfying$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/min-satisfying.js": ((exports, module) => {
	const SemVer$3 = require_semver$1();
	const Range$6 = require_range();
	const minSatisfying$1 = (versions, range, options) => {
		let min = null;
		let minSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range$6(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!min || minSV.compare(v) === 1) {
					min = v;
					minSV = new SemVer$3(min, options);
				}
			}
		});
		return min;
	};
	module.exports = minSatisfying$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/min-version.js
var require_min_version = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/min-version.js": ((exports, module) => {
	const SemVer$2 = require_semver$1();
	const Range$5 = require_range();
	const gt$2 = require_gt();
	const minVersion$1 = (range, loose) => {
		range = new Range$5(range, loose);
		let minver = new SemVer$2("0.0.0");
		if (range.test(minver)) return minver;
		minver = new SemVer$2("0.0.0-0");
		if (range.test(minver)) return minver;
		minver = null;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let setMin = null;
			comparators.forEach((comparator) => {
				const compver = new SemVer$2(comparator.semver.version);
				switch (comparator.operator) {
					case ">":
						if (compver.prerelease.length === 0) compver.patch++;
						else compver.prerelease.push(0);
						compver.raw = compver.format();
					case "":
					case ">=":
						if (!setMin || gt$2(compver, setMin)) setMin = compver;
						break;
					case "<":
					case "<=": break;
					default: throw new Error(`Unexpected operation: ${comparator.operator}`);
				}
			});
			if (setMin && (!minver || gt$2(minver, setMin))) minver = setMin;
		}
		if (minver && range.test(minver)) return minver;
		return null;
	};
	module.exports = minVersion$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/valid.js
var require_valid = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/valid.js": ((exports, module) => {
	const Range$4 = require_range();
	const validRange$1 = (range, options) => {
		try {
			return new Range$4(range, options).range || "*";
		} catch (er) {
			return null;
		}
	};
	module.exports = validRange$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/outside.js
var require_outside = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/outside.js": ((exports, module) => {
	const SemVer$1 = require_semver$1();
	const Comparator$2 = require_comparator();
	const { ANY: ANY$1 } = Comparator$2;
	const Range$3 = require_range();
	const satisfies$3 = require_satisfies();
	const gt$1 = require_gt();
	const lt$1 = require_lt();
	const lte$1 = require_lte();
	const gte$1 = require_gte();
	const outside$3 = (version, range, hilo, options) => {
		version = new SemVer$1(version, options);
		range = new Range$3(range, options);
		let gtfn, ltefn, ltfn, comp, ecomp;
		switch (hilo) {
			case ">":
				gtfn = gt$1;
				ltefn = lte$1;
				ltfn = lt$1;
				comp = ">";
				ecomp = ">=";
				break;
			case "<":
				gtfn = lt$1;
				ltefn = gte$1;
				ltfn = gt$1;
				comp = "<";
				ecomp = "<=";
				break;
			default: throw new TypeError("Must provide a hilo val of \"<\" or \">\"");
		}
		if (satisfies$3(version, range, options)) return false;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let high = null;
			let low = null;
			comparators.forEach((comparator) => {
				if (comparator.semver === ANY$1) comparator = new Comparator$2(">=0.0.0");
				high = high || comparator;
				low = low || comparator;
				if (gtfn(comparator.semver, high.semver, options)) high = comparator;
				else if (ltfn(comparator.semver, low.semver, options)) low = comparator;
			});
			if (high.operator === comp || high.operator === ecomp) return false;
			if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) return false;
			else if (low.operator === ecomp && ltfn(version, low.semver)) return false;
		}
		return true;
	};
	module.exports = outside$3;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/gtr.js
var require_gtr = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/gtr.js": ((exports, module) => {
	const outside$2 = require_outside();
	const gtr$1 = (version, range, options) => outside$2(version, range, ">", options);
	module.exports = gtr$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/ltr.js
var require_ltr = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/ltr.js": ((exports, module) => {
	const outside$1 = require_outside();
	const ltr$1 = (version, range, options) => outside$1(version, range, "<", options);
	module.exports = ltr$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/intersects.js
var require_intersects = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/intersects.js": ((exports, module) => {
	const Range$2 = require_range();
	const intersects$1 = (r1, r2, options) => {
		r1 = new Range$2(r1, options);
		r2 = new Range$2(r2, options);
		return r1.intersects(r2, options);
	};
	module.exports = intersects$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/simplify.js
var require_simplify = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/simplify.js": ((exports, module) => {
	const satisfies$2 = require_satisfies();
	const compare$2 = require_compare();
	module.exports = (versions, range, options) => {
		const set = [];
		let first = null;
		let prev = null;
		const v = versions.sort((a, b) => compare$2(a, b, options));
		for (const version of v) if (satisfies$2(version, range, options)) {
			prev = version;
			if (!first) first = version;
		} else {
			if (prev) set.push([first, prev]);
			prev = null;
			first = null;
		}
		if (first) set.push([first, null]);
		const ranges = [];
		for (const [min, max] of set) if (min === max) ranges.push(min);
		else if (!max && min === v[0]) ranges.push("*");
		else if (!max) ranges.push(`>=${min}`);
		else if (min === v[0]) ranges.push(`<=${max}`);
		else ranges.push(`${min} - ${max}`);
		const simplified = ranges.join(" || ");
		const original = typeof range.raw === "string" ? range.raw : String(range);
		return simplified.length < original.length ? simplified : range;
	};
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/subset.js
var require_subset = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/ranges/subset.js": ((exports, module) => {
	const Range$1 = require_range();
	const Comparator$1 = require_comparator();
	const { ANY } = Comparator$1;
	const satisfies$1 = require_satisfies();
	const compare$1 = require_compare();
	const subset$1 = (sub, dom, options = {}) => {
		if (sub === dom) return true;
		sub = new Range$1(sub, options);
		dom = new Range$1(dom, options);
		let sawNonNull = false;
		OUTER: for (const simpleSub of sub.set) {
			for (const simpleDom of dom.set) {
				const isSub = simpleSubset(simpleSub, simpleDom, options);
				sawNonNull = sawNonNull || isSub !== null;
				if (isSub) continue OUTER;
			}
			if (sawNonNull) return false;
		}
		return true;
	};
	const minimumVersionWithPreRelease = [new Comparator$1(">=0.0.0-0")];
	const minimumVersion = [new Comparator$1(">=0.0.0")];
	const simpleSubset = (sub, dom, options) => {
		if (sub === dom) return true;
		if (sub.length === 1 && sub[0].semver === ANY) if (dom.length === 1 && dom[0].semver === ANY) return true;
		else if (options.includePrerelease) sub = minimumVersionWithPreRelease;
		else sub = minimumVersion;
		if (dom.length === 1 && dom[0].semver === ANY) if (options.includePrerelease) return true;
		else dom = minimumVersion;
		const eqSet = /* @__PURE__ */ new Set();
		let gt$5, lt$4;
		for (const c of sub) if (c.operator === ">" || c.operator === ">=") gt$5 = higherGT(gt$5, c, options);
		else if (c.operator === "<" || c.operator === "<=") lt$4 = lowerLT(lt$4, c, options);
		else eqSet.add(c.semver);
		if (eqSet.size > 1) return null;
		let gtltComp;
		if (gt$5 && lt$4) {
			gtltComp = compare$1(gt$5.semver, lt$4.semver, options);
			if (gtltComp > 0) return null;
			else if (gtltComp === 0 && (gt$5.operator !== ">=" || lt$4.operator !== "<=")) return null;
		}
		for (const eq$3 of eqSet) {
			if (gt$5 && !satisfies$1(eq$3, String(gt$5), options)) return null;
			if (lt$4 && !satisfies$1(eq$3, String(lt$4), options)) return null;
			for (const c of dom) if (!satisfies$1(eq$3, String(c), options)) return false;
			return true;
		}
		let higher, lower;
		let hasDomLT, hasDomGT;
		let needDomLTPre = lt$4 && !options.includePrerelease && lt$4.semver.prerelease.length ? lt$4.semver : false;
		let needDomGTPre = gt$5 && !options.includePrerelease && gt$5.semver.prerelease.length ? gt$5.semver : false;
		if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt$4.operator === "<" && needDomLTPre.prerelease[0] === 0) needDomLTPre = false;
		for (const c of dom) {
			hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
			hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
			if (gt$5) {
				if (needDomGTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) needDomGTPre = false;
				}
				if (c.operator === ">" || c.operator === ">=") {
					higher = higherGT(gt$5, c, options);
					if (higher === c && higher !== gt$5) return false;
				} else if (gt$5.operator === ">=" && !satisfies$1(gt$5.semver, String(c), options)) return false;
			}
			if (lt$4) {
				if (needDomLTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) needDomLTPre = false;
				}
				if (c.operator === "<" || c.operator === "<=") {
					lower = lowerLT(lt$4, c, options);
					if (lower === c && lower !== lt$4) return false;
				} else if (lt$4.operator === "<=" && !satisfies$1(lt$4.semver, String(c), options)) return false;
			}
			if (!c.operator && (lt$4 || gt$5) && gtltComp !== 0) return false;
		}
		if (gt$5 && hasDomLT && !lt$4 && gtltComp !== 0) return false;
		if (lt$4 && hasDomGT && !gt$5 && gtltComp !== 0) return false;
		if (needDomGTPre || needDomLTPre) return false;
		return true;
	};
	const higherGT = (a, b, options) => {
		if (!a) return b;
		const comp = compare$1(a.semver, b.semver, options);
		return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
	};
	const lowerLT = (a, b, options) => {
		if (!a) return b;
		const comp = compare$1(a.semver, b.semver, options);
		return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
	};
	module.exports = subset$1;
}) });

//#endregion
//#region node_modules/.pnpm/semver@7.7.3/node_modules/semver/index.js
var require_semver = /* @__PURE__ */ __commonJS({ "node_modules/.pnpm/semver@7.7.3/node_modules/semver/index.js": ((exports, module) => {
	const internalRe = require_re();
	const constants = require_constants();
	const SemVer = require_semver$1();
	const identifiers = require_identifiers();
	const parse = require_parse();
	const valid = require_valid$1();
	const clean = require_clean();
	const inc = require_inc();
	const diff = require_diff();
	const major = require_major();
	const minor = require_minor();
	const patch = require_patch();
	const prerelease = require_prerelease();
	const compare = require_compare();
	const rcompare = require_rcompare();
	const compareLoose = require_compare_loose();
	const compareBuild = require_compare_build();
	const sort = require_sort();
	const rsort = require_rsort();
	const gt = require_gt();
	const lt = require_lt();
	const eq = require_eq();
	const neq = require_neq();
	const gte = require_gte();
	const lte = require_lte();
	const cmp = require_cmp();
	const coerce = require_coerce();
	const Comparator = require_comparator();
	const Range = require_range();
	const satisfies = require_satisfies();
	const toComparators = require_to_comparators();
	const maxSatisfying = require_max_satisfying();
	const minSatisfying = require_min_satisfying();
	const minVersion = require_min_version();
	const validRange = require_valid();
	const outside = require_outside();
	const gtr = require_gtr();
	const ltr = require_ltr();
	const intersects = require_intersects();
	const simplifyRange = require_simplify();
	const subset = require_subset();
	module.exports = {
		parse,
		valid,
		clean,
		inc,
		diff,
		major,
		minor,
		patch,
		prerelease,
		compare,
		rcompare,
		compareLoose,
		compareBuild,
		sort,
		rsort,
		gt,
		lt,
		eq,
		neq,
		gte,
		lte,
		cmp,
		coerce,
		Comparator,
		Range,
		satisfies,
		toComparators,
		maxSatisfying,
		minSatisfying,
		minVersion,
		validRange,
		outside,
		gtr,
		ltr,
		intersects,
		simplifyRange,
		subset,
		SemVer,
		re: internalRe.re,
		src: internalRe.src,
		tokens: internalRe.t,
		SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
		RELEASE_TYPES: constants.RELEASE_TYPES,
		compareIdentifiers: identifiers.compareIdentifiers,
		rcompareIdentifiers: identifiers.rcompareIdentifiers
	};
}) });

//#endregion
//#region src/puppeteer-vendor/httpUtil.ts
var import_semver = /* @__PURE__ */ __toESM(require_semver(), 1);
function headHttpRequest(url) {
	return new Promise((resolve) => {
		httpRequest(url, "HEAD", (response) => {
			response.resume();
			resolve(response.statusCode === 200);
		}, false).on("error", () => {
			resolve(false);
		});
	});
}
function httpRequest(url, method, response, keepAlive = true) {
	const options = {
		protocol: url.protocol,
		hostname: url.hostname,
		port: url.port,
		path: url.pathname + url.search,
		method,
		headers: keepAlive ? { Connection: "keep-alive" } : void 0,
		auth: urlToHttpOptions(url).auth,
		agent: new ProxyAgent()
	};
	const requestCallback = (res) => {
		if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
			httpRequest(new URL$1(res.headers.location), method, response);
			res.resume();
		} else response(res);
	};
	const request = options.protocol === "https:" ? https.request(options, requestCallback) : http.request(options, requestCallback);
	request.end();
	return request;
}
/**
* @internal
*/
function downloadFile(url, destinationPath, progressCallback) {
	return new Promise((resolve, reject) => {
		let downloadedBytes = 0;
		let totalBytes = 0;
		function onData(chunk) {
			downloadedBytes += chunk.length;
			progressCallback(downloadedBytes, totalBytes);
		}
		httpRequest(url, "GET", (response) => {
			if (response.statusCode !== 200) {
				const error = /* @__PURE__ */ new Error(`Download failed: server returned code ${response.statusCode}. URL: ${url}`);
				response.resume();
				reject(error);
				return;
			}
			const file = createWriteStream(destinationPath);
			file.on("close", () => {
				return resolve();
			});
			file.on("error", (error) => {
				return reject(error);
			});
			response.pipe(file);
			totalBytes = parseInt(response.headers["content-length"], 10);
			if (progressCallback) response.on("data", onData);
		}).on("error", (error) => {
			return reject(error);
		});
	});
}
async function getJSON(url) {
	const text = await getText(url);
	try {
		return JSON.parse(text);
	} catch {
		throw new Error("Could not parse JSON from " + url.toString());
	}
}
function getText(url) {
	return new Promise((resolve, reject) => {
		httpRequest(url, "GET", (response) => {
			let data = "";
			if (response.statusCode && response.statusCode >= 400) return reject(/* @__PURE__ */ new Error(`Got status code ${response.statusCode}`));
			response.on("data", (chunk) => {
				data += chunk;
			});
			response.on("end", () => {
				try {
					return resolve(String(data));
				} catch {
					return reject(/* @__PURE__ */ new Error("Chrome version not found"));
				}
			});
		}, false).on("error", (err) => {
			reject(err);
		});
	});
}

//#endregion
//#region src/puppeteer-vendor/browser-data/chrome.ts
function folder$3(platform) {
	switch (platform) {
		case BrowserPlatform.LINUX_ARM:
		case BrowserPlatform.LINUX: return "linux64";
		case BrowserPlatform.MAC_ARM: return "mac-arm64";
		case BrowserPlatform.MAC: return "mac-x64";
		case BrowserPlatform.WIN32: return "win32";
		case BrowserPlatform.WIN64: return "win64";
	}
}
function resolveDownloadUrl$4(platform, buildId, baseUrl = "https://storage.googleapis.com/chrome-for-testing-public") {
	return `${baseUrl}/${resolveDownloadPath$4(platform, buildId).join("/")}`;
}
function resolveDownloadPath$4(platform, buildId) {
	return [
		buildId,
		folder$3(platform),
		`chrome-${folder$3(platform)}.zip`
	];
}
function relativeExecutablePath$4(platform, _buildId) {
	switch (platform) {
		case BrowserPlatform.MAC:
		case BrowserPlatform.MAC_ARM: return path.join("chrome-" + folder$3(platform), "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing");
		case BrowserPlatform.LINUX_ARM:
		case BrowserPlatform.LINUX: return path.join("chrome-linux64", "chrome");
		case BrowserPlatform.WIN32:
		case BrowserPlatform.WIN64: return path.join("chrome-" + folder$3(platform), "chrome.exe");
	}
}
let baseVersionUrl$1 = "https://googlechromelabs.github.io/chrome-for-testing";
async function getLastKnownGoodReleaseForChannel(channel) {
	const data = await getJSON(new URL(`${baseVersionUrl$1}/last-known-good-versions.json`));
	for (const channel$1 of Object.keys(data.channels)) {
		data.channels[channel$1.toLowerCase()] = data.channels[channel$1];
		delete data.channels[channel$1];
	}
	return data.channels[channel];
}
async function getLastKnownGoodReleaseForMilestone(milestone) {
	return (await getJSON(new URL(`${baseVersionUrl$1}/latest-versions-per-milestone.json`))).milestones[milestone];
}
async function getLastKnownGoodReleaseForBuild(buildPrefix) {
	return (await getJSON(new URL(`${baseVersionUrl$1}/latest-patch-versions-per-build.json`))).builds[buildPrefix];
}
async function resolveBuildId$3(channel) {
	if (Object.values(ChromeReleaseChannel).includes(channel)) return (await getLastKnownGoodReleaseForChannel(channel)).version;
	if (channel.match(/^\d+$/)) return (await getLastKnownGoodReleaseForMilestone(channel))?.version;
	if (channel.match(/^\d+\.\d+\.\d+$/)) return (await getLastKnownGoodReleaseForBuild(channel))?.version;
}
function compareVersions$2(a, b) {
	if (!import_semver.default.valid(a)) throw new Error(`Version ${a} is not a valid semver version`);
	if (!import_semver.default.valid(b)) throw new Error(`Version ${b} is not a valid semver version`);
	if (import_semver.default.gt(a, b)) return 1;
	else if (import_semver.default.lt(a, b)) return -1;
	else return 0;
}

//#endregion
//#region src/puppeteer-vendor/browser-data/chrome-headless-shell.ts
function folder$2(platform) {
	switch (platform) {
		case BrowserPlatform.LINUX_ARM:
		case BrowserPlatform.LINUX: return "linux64";
		case BrowserPlatform.MAC_ARM: return "mac-arm64";
		case BrowserPlatform.MAC: return "mac-x64";
		case BrowserPlatform.WIN32: return "win32";
		case BrowserPlatform.WIN64: return "win64";
	}
}
function resolveDownloadUrl$3(platform, buildId, baseUrl = "https://storage.googleapis.com/chrome-for-testing-public") {
	return `${baseUrl}/${resolveDownloadPath$3(platform, buildId).join("/")}`;
}
function resolveDownloadPath$3(platform, buildId) {
	return [
		buildId,
		folder$2(platform),
		`chrome-headless-shell-${folder$2(platform)}.zip`
	];
}
function relativeExecutablePath$3(platform, _buildId) {
	switch (platform) {
		case BrowserPlatform.MAC:
		case BrowserPlatform.MAC_ARM: return path.join("chrome-headless-shell-" + folder$2(platform), "chrome-headless-shell");
		case BrowserPlatform.LINUX_ARM:
		case BrowserPlatform.LINUX: return path.join("chrome-headless-shell-linux64", "chrome-headless-shell");
		case BrowserPlatform.WIN32:
		case BrowserPlatform.WIN64: return path.join("chrome-headless-shell-" + folder$2(platform), "chrome-headless-shell.exe");
	}
}

//#endregion
//#region src/puppeteer-vendor/browser-data/chromedriver.ts
function folder$1(platform) {
	switch (platform) {
		case BrowserPlatform.LINUX_ARM:
		case BrowserPlatform.LINUX: return "linux64";
		case BrowserPlatform.MAC_ARM: return "mac-arm64";
		case BrowserPlatform.MAC: return "mac-x64";
		case BrowserPlatform.WIN32: return "win32";
		case BrowserPlatform.WIN64: return "win64";
	}
}
function resolveDownloadUrl$2(platform, buildId, baseUrl = "https://storage.googleapis.com/chrome-for-testing-public") {
	return `${baseUrl}/${resolveDownloadPath$2(platform, buildId).join("/")}`;
}
function resolveDownloadPath$2(platform, buildId) {
	return [
		buildId,
		folder$1(platform),
		`chromedriver-${folder$1(platform)}.zip`
	];
}
function relativeExecutablePath$2(platform, _buildId) {
	switch (platform) {
		case BrowserPlatform.MAC:
		case BrowserPlatform.MAC_ARM: return path.join("chromedriver-" + folder$1(platform), "chromedriver");
		case BrowserPlatform.LINUX_ARM:
		case BrowserPlatform.LINUX: return path.join("chromedriver-linux64", "chromedriver");
		case BrowserPlatform.WIN32:
		case BrowserPlatform.WIN64: return path.join("chromedriver-" + folder$1(platform), "chromedriver.exe");
	}
}

//#endregion
//#region src/puppeteer-vendor/browser-data/chromium.ts
function archive$1(platform, buildId) {
	switch (platform) {
		case BrowserPlatform.LINUX_ARM:
		case BrowserPlatform.LINUX: return "chrome-linux";
		case BrowserPlatform.MAC_ARM:
		case BrowserPlatform.MAC: return "chrome-mac";
		case BrowserPlatform.WIN32:
		case BrowserPlatform.WIN64: return parseInt(buildId, 10) > 591479 ? "chrome-win" : "chrome-win32";
	}
}
function folder(platform) {
	switch (platform) {
		case BrowserPlatform.LINUX_ARM:
		case BrowserPlatform.LINUX: return "Linux_x64";
		case BrowserPlatform.MAC_ARM: return "Mac_Arm";
		case BrowserPlatform.MAC: return "Mac";
		case BrowserPlatform.WIN32: return "Win";
		case BrowserPlatform.WIN64: return "Win_x64";
	}
}
function resolveDownloadUrl$1(platform, buildId, baseUrl = "https://storage.googleapis.com/chromium-browser-snapshots") {
	return `${baseUrl}/${resolveDownloadPath$1(platform, buildId).join("/")}`;
}
function resolveDownloadPath$1(platform, buildId) {
	return [
		folder(platform),
		buildId,
		`${archive$1(platform, buildId)}.zip`
	];
}
function relativeExecutablePath$1(platform, _buildId) {
	switch (platform) {
		case BrowserPlatform.MAC:
		case BrowserPlatform.MAC_ARM: return path.join("chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium");
		case BrowserPlatform.LINUX_ARM:
		case BrowserPlatform.LINUX: return path.join("chrome-linux", "chrome");
		case BrowserPlatform.WIN32:
		case BrowserPlatform.WIN64: return path.join("chrome-win", "chrome.exe");
	}
}
async function resolveBuildId$2(platform) {
	return await getText(new URL(`https://storage.googleapis.com/chromium-browser-snapshots/${folder(platform)}/LAST_CHANGE`));
}
function compareVersions$1(a, b) {
	return Number(a) - Number(b);
}

//#endregion
//#region src/puppeteer-vendor/browser-data/firefox.ts
function getFormat(buildId) {
	return Number(buildId.split(".").shift()) >= 135 ? "xz" : "bz2";
}
function archiveNightly(platform, buildId) {
	switch (platform) {
		case BrowserPlatform.LINUX: return `firefox-${buildId}.en-US.linux-x86_64.tar.${getFormat(buildId)}`;
		case BrowserPlatform.LINUX_ARM: return `firefox-${buildId}.en-US.linux-aarch64.tar.${getFormat(buildId)}`;
		case BrowserPlatform.MAC_ARM:
		case BrowserPlatform.MAC: return `firefox-${buildId}.en-US.mac.dmg`;
		case BrowserPlatform.WIN32:
		case BrowserPlatform.WIN64: return `firefox-${buildId}.en-US.${platform}.zip`;
	}
}
function archive(platform, buildId) {
	switch (platform) {
		case BrowserPlatform.LINUX_ARM:
		case BrowserPlatform.LINUX: return `firefox-${buildId}.tar.${getFormat(buildId)}`;
		case BrowserPlatform.MAC_ARM:
		case BrowserPlatform.MAC: return `Firefox ${buildId}.dmg`;
		case BrowserPlatform.WIN32:
		case BrowserPlatform.WIN64: return `Firefox Setup ${buildId}.exe`;
	}
}
function platformName(platform) {
	switch (platform) {
		case BrowserPlatform.LINUX: return `linux-x86_64`;
		case BrowserPlatform.LINUX_ARM: return `linux-aarch64`;
		case BrowserPlatform.MAC_ARM:
		case BrowserPlatform.MAC: return `mac`;
		case BrowserPlatform.WIN32:
		case BrowserPlatform.WIN64: return platform;
	}
}
function parseBuildId(buildId) {
	for (const value of Object.values(FirefoxChannel)) if (buildId.startsWith(value + "_")) {
		buildId = buildId.substring(value.length + 1);
		return [value, buildId];
	}
	return [FirefoxChannel.NIGHTLY, buildId];
}
function resolveDownloadUrl(platform, buildId, baseUrl) {
	const [channel] = parseBuildId(buildId);
	switch (channel) {
		case FirefoxChannel.NIGHTLY:
			baseUrl ??= "https://archive.mozilla.org/pub/firefox/nightly/latest-mozilla-central";
			break;
		case FirefoxChannel.DEVEDITION:
			baseUrl ??= "https://archive.mozilla.org/pub/devedition/releases";
			break;
		case FirefoxChannel.BETA:
		case FirefoxChannel.STABLE:
		case FirefoxChannel.ESR:
			baseUrl ??= "https://archive.mozilla.org/pub/firefox/releases";
			break;
	}
	return `${baseUrl}/${resolveDownloadPath(platform, buildId).join("/")}`;
}
function resolveDownloadPath(platform, buildId) {
	const [channel, resolvedBuildId] = parseBuildId(buildId);
	switch (channel) {
		case FirefoxChannel.NIGHTLY: return [archiveNightly(platform, resolvedBuildId)];
		case FirefoxChannel.DEVEDITION:
		case FirefoxChannel.BETA:
		case FirefoxChannel.STABLE:
		case FirefoxChannel.ESR: return [
			resolvedBuildId,
			platformName(platform),
			"en-US",
			archive(platform, resolvedBuildId)
		];
	}
}
function relativeExecutablePath(platform, buildId) {
	const [channel] = parseBuildId(buildId);
	switch (channel) {
		case FirefoxChannel.NIGHTLY: switch (platform) {
			case BrowserPlatform.MAC_ARM:
			case BrowserPlatform.MAC: return path.join("Firefox Nightly.app", "Contents", "MacOS", "firefox");
			case BrowserPlatform.LINUX_ARM:
			case BrowserPlatform.LINUX: return path.join("firefox", "firefox");
			case BrowserPlatform.WIN32:
			case BrowserPlatform.WIN64: return path.join("firefox", "firefox.exe");
		}
		case FirefoxChannel.BETA:
		case FirefoxChannel.DEVEDITION:
		case FirefoxChannel.ESR:
		case FirefoxChannel.STABLE: switch (platform) {
			case BrowserPlatform.MAC_ARM:
			case BrowserPlatform.MAC: return path.join("Firefox.app", "Contents", "MacOS", "firefox");
			case BrowserPlatform.LINUX_ARM:
			case BrowserPlatform.LINUX: return path.join("firefox", "firefox");
			case BrowserPlatform.WIN32:
			case BrowserPlatform.WIN64: return path.join("core", "firefox.exe");
		}
	}
}
let FirefoxChannel = /* @__PURE__ */ function(FirefoxChannel$1) {
	FirefoxChannel$1["STABLE"] = "stable";
	FirefoxChannel$1["ESR"] = "esr";
	FirefoxChannel$1["DEVEDITION"] = "devedition";
	FirefoxChannel$1["BETA"] = "beta";
	FirefoxChannel$1["NIGHTLY"] = "nightly";
	return FirefoxChannel$1;
}({});
let baseVersionUrl = "https://product-details.mozilla.org/1.0";
async function resolveBuildId$1(channel = FirefoxChannel.NIGHTLY) {
	const channelToVersionKey = {
		[FirefoxChannel.ESR]: "FIREFOX_ESR",
		[FirefoxChannel.STABLE]: "LATEST_FIREFOX_VERSION",
		[FirefoxChannel.DEVEDITION]: "FIREFOX_DEVEDITION",
		[FirefoxChannel.BETA]: "FIREFOX_DEVEDITION",
		[FirefoxChannel.NIGHTLY]: "FIREFOX_NIGHTLY"
	};
	const version = (await getJSON(new URL(`${baseVersionUrl}/firefox_versions.json`)))[channelToVersionKey[channel]];
	if (!version) throw new Error(`Channel ${channel} is not found.`);
	return channel + "_" + version;
}
function compareVersions(a, b) {
	return parseInt(a.replace(".", ""), 16) - parseInt(b.replace(".", ""), 16);
}

//#endregion
//#region src/puppeteer-vendor/browser-data/browser-data.ts
const downloadUrls = {
	[Browser.CHROMEDRIVER]: resolveDownloadUrl$2,
	[Browser.CHROMEHEADLESSSHELL]: resolveDownloadUrl$3,
	[Browser.CHROME]: resolveDownloadUrl$4,
	[Browser.CHROMIUM]: resolveDownloadUrl$1,
	[Browser.FIREFOX]: resolveDownloadUrl
};
const downloadPaths = {
	[Browser.CHROMEDRIVER]: resolveDownloadPath$2,
	[Browser.CHROMEHEADLESSSHELL]: resolveDownloadPath$3,
	[Browser.CHROME]: resolveDownloadPath$4,
	[Browser.CHROMIUM]: resolveDownloadPath$1,
	[Browser.FIREFOX]: resolveDownloadPath
};
const executablePathByBrowser = {
	[Browser.CHROMEDRIVER]: relativeExecutablePath$2,
	[Browser.CHROMEHEADLESSSHELL]: relativeExecutablePath$3,
	[Browser.CHROME]: relativeExecutablePath$4,
	[Browser.CHROMIUM]: relativeExecutablePath$1,
	[Browser.FIREFOX]: relativeExecutablePath
};
const versionComparators = {
	[Browser.CHROMEDRIVER]: compareVersions$2,
	[Browser.CHROMEHEADLESSSHELL]: compareVersions$2,
	[Browser.CHROME]: compareVersions$2,
	[Browser.CHROMIUM]: compareVersions$1,
	[Browser.FIREFOX]: compareVersions
};
/**
* @internal
*/
async function resolveBuildIdForBrowserTag(browser, platform, tag) {
	switch (browser) {
		case Browser.FIREFOX: switch (tag) {
			case BrowserTag.LATEST: return await resolveBuildId$1(FirefoxChannel.NIGHTLY);
			case BrowserTag.BETA: return await resolveBuildId$1(FirefoxChannel.BETA);
			case BrowserTag.NIGHTLY: return await resolveBuildId$1(FirefoxChannel.NIGHTLY);
			case BrowserTag.DEVEDITION: return await resolveBuildId$1(FirefoxChannel.DEVEDITION);
			case BrowserTag.STABLE: return await resolveBuildId$1(FirefoxChannel.STABLE);
			case BrowserTag.ESR: return await resolveBuildId$1(FirefoxChannel.ESR);
			case BrowserTag.CANARY:
			case BrowserTag.DEV: throw new Error(`${tag.toUpperCase()} is not available for Firefox`);
		}
		case Browser.CHROME: switch (tag) {
			case BrowserTag.LATEST: return await resolveBuildId$3(ChromeReleaseChannel.CANARY);
			case BrowserTag.BETA: return await resolveBuildId$3(ChromeReleaseChannel.BETA);
			case BrowserTag.CANARY: return await resolveBuildId$3(ChromeReleaseChannel.CANARY);
			case BrowserTag.DEV: return await resolveBuildId$3(ChromeReleaseChannel.DEV);
			case BrowserTag.STABLE: return await resolveBuildId$3(ChromeReleaseChannel.STABLE);
			case BrowserTag.NIGHTLY:
			case BrowserTag.DEVEDITION:
			case BrowserTag.ESR: throw new Error(`${tag.toUpperCase()} is not available for Chrome`);
		}
		case Browser.CHROMEDRIVER: switch (tag) {
			case BrowserTag.LATEST:
			case BrowserTag.CANARY: return await resolveBuildId$3(ChromeReleaseChannel.CANARY);
			case BrowserTag.BETA: return await resolveBuildId$3(ChromeReleaseChannel.BETA);
			case BrowserTag.DEV: return await resolveBuildId$3(ChromeReleaseChannel.DEV);
			case BrowserTag.STABLE: return await resolveBuildId$3(ChromeReleaseChannel.STABLE);
			case BrowserTag.NIGHTLY:
			case BrowserTag.DEVEDITION:
			case BrowserTag.ESR: throw new Error(`${tag.toUpperCase()} is not available for ChromeDriver`);
		}
		case Browser.CHROMEHEADLESSSHELL: switch (tag) {
			case BrowserTag.LATEST:
			case BrowserTag.CANARY: return await resolveBuildId$3(ChromeReleaseChannel.CANARY);
			case BrowserTag.BETA: return await resolveBuildId$3(ChromeReleaseChannel.BETA);
			case BrowserTag.DEV: return await resolveBuildId$3(ChromeReleaseChannel.DEV);
			case BrowserTag.STABLE: return await resolveBuildId$3(ChromeReleaseChannel.STABLE);
			case BrowserTag.NIGHTLY:
			case BrowserTag.DEVEDITION:
			case BrowserTag.ESR: throw new Error(`${tag} is not available for chrome-headless-shell`);
		}
		case Browser.CHROMIUM: switch (tag) {
			case BrowserTag.LATEST: return await resolveBuildId$2(platform);
			case BrowserTag.NIGHTLY:
			case BrowserTag.CANARY:
			case BrowserTag.DEV:
			case BrowserTag.DEVEDITION:
			case BrowserTag.BETA:
			case BrowserTag.STABLE:
			case BrowserTag.ESR: throw new Error(`${tag} is not supported for Chromium. Use 'latest' instead.`);
		}
	}
}
/**
* @public
*/
async function resolveBuildId(browser, platform, tag) {
	const browserTag = tag;
	if (Object.values(BrowserTag).includes(browserTag)) return await resolveBuildIdForBrowserTag(browser, platform, browserTag);
	switch (browser) {
		case Browser.FIREFOX: return tag;
		case Browser.CHROME:
			const chromeResult = await resolveBuildId$3(tag);
			if (chromeResult) return chromeResult;
			return tag;
		case Browser.CHROMEDRIVER:
			const chromeDriverResult = await resolveBuildId$3(tag);
			if (chromeDriverResult) return chromeDriverResult;
			return tag;
		case Browser.CHROMEHEADLESSSHELL:
			const chromeHeadlessShellResult = await resolveBuildId$3(tag);
			if (chromeHeadlessShellResult) return chromeHeadlessShellResult;
			return tag;
		case Browser.CHROMIUM: return tag;
	}
}
/**
* Returns a version comparator for the given browser that can be used to sort
* browser versions.
*
* @public
*/
function getVersionComparator(browser) {
	return versionComparators[browser];
}

//#endregion
//#region src/puppeteer-vendor/detectPlatform.ts
/**
* @public
*/
function detectBrowserPlatform() {
	const platform = os.platform();
	const arch = os.arch();
	switch (platform) {
		case "darwin": return arch === "arm64" ? BrowserPlatform.MAC_ARM : BrowserPlatform.MAC;
		case "linux": return arch === "arm64" ? BrowserPlatform.LINUX_ARM : BrowserPlatform.LINUX;
		case "win32": return arch === "x64" || arch === "arm64" && isWindows11(os.release()) ? BrowserPlatform.WIN64 : BrowserPlatform.WIN32;
		default: return;
	}
}
/**
* Windows 11 is identified by the version 10.0.22000 or greater
* @internal
*/
function isWindows11(version) {
	const parts = version.split(".");
	if (parts.length > 2) {
		const major$2 = parseInt(parts[0], 10);
		const minor$2 = parseInt(parts[1], 10);
		const patch$2 = parseInt(parts[2], 10);
		return major$2 > 10 || major$2 === 10 && minor$2 > 0 || major$2 === 10 && minor$2 === 0 && patch$2 >= 22e3;
	}
	return false;
}

//#endregion
//#region src/puppeteer-vendor/Cache.ts
const debugCache = debug("puppeteer:browsers:cache");
/**
* @public
*/
var InstalledBrowser = class {
	browser;
	buildId;
	platform;
	executablePath;
	#cache;
	/**
	* @internal
	*/
	constructor(cache$1, browser, buildId, platform) {
		this.#cache = cache$1;
		this.browser = browser;
		this.buildId = buildId;
		this.platform = platform;
		this.executablePath = cache$1.computeExecutablePath({
			browser,
			buildId,
			platform
		});
	}
	/**
	* Path to the root of the installation folder. Use
	* {@link computeExecutablePath} to get the path to the executable binary.
	*/
	get path() {
		return this.#cache.installationDir(this.browser, this.platform, this.buildId);
	}
	readMetadata() {
		return this.#cache.readMetadata(this.browser);
	}
	writeMetadata(metadata) {
		this.#cache.writeMetadata(this.browser, metadata);
	}
};
/**
* The cache used by Puppeteer relies on the following structure:
*
* - rootDir
*   -- <browser1> | browserRoot(browser1)
*   ---- <platform>-<buildId> | installationDir()
*   ------ the browser-platform-buildId
*   ------ specific structure.
*   -- <browser2> | browserRoot(browser2)
*   ---- <platform>-<buildId> | installationDir()
*   ------ the browser-platform-buildId
*   ------ specific structure.
*   @internal
*/
var Cache = class {
	#rootDir;
	constructor(rootDir) {
		this.#rootDir = rootDir;
	}
	/**
	* @internal
	*/
	get rootDir() {
		return this.#rootDir;
	}
	browserRoot(browser) {
		return path.join(this.#rootDir, browser);
	}
	metadataFile(browser) {
		return path.join(this.browserRoot(browser), ".metadata");
	}
	readMetadata(browser) {
		const metatadaPath = this.metadataFile(browser);
		if (!fs.existsSync(metatadaPath)) return { aliases: {} };
		const data = JSON.parse(fs.readFileSync(metatadaPath, "utf8"));
		if (typeof data !== "object") throw new Error(".metadata is not an object");
		return data;
	}
	writeMetadata(browser, metadata) {
		const metatadaPath = this.metadataFile(browser);
		fs.mkdirSync(path.dirname(metatadaPath), { recursive: true });
		fs.writeFileSync(metatadaPath, JSON.stringify(metadata, null, 2));
	}
	resolveAlias(browser, alias) {
		const metadata = this.readMetadata(browser);
		if (alias === "latest") return Object.values(metadata.aliases || {}).sort(getVersionComparator(browser)).at(-1);
		return metadata.aliases[alias];
	}
	installationDir(browser, platform, buildId) {
		return path.join(this.browserRoot(browser), `${platform}-${buildId}`);
	}
	clear() {
		fs.rmSync(this.#rootDir, {
			force: true,
			recursive: true,
			maxRetries: 10,
			retryDelay: 500
		});
	}
	uninstall(browser, platform, buildId) {
		const metadata = this.readMetadata(browser);
		for (const alias of Object.keys(metadata.aliases)) if (metadata.aliases[alias] === buildId) delete metadata.aliases[alias];
		fs.rmSync(this.installationDir(browser, platform, buildId), {
			force: true,
			recursive: true,
			maxRetries: 10,
			retryDelay: 500
		});
	}
	getInstalledBrowsers() {
		if (!fs.existsSync(this.#rootDir)) return [];
		return fs.readdirSync(this.#rootDir).filter((t$5) => {
			return Object.values(Browser).includes(t$5);
		}).flatMap((browser) => {
			return fs.readdirSync(this.browserRoot(browser)).map((file) => {
				const result = parseFolderPath(path.join(this.browserRoot(browser), file));
				if (!result) return null;
				return new InstalledBrowser(this, browser, result.buildId, result.platform);
			}).filter((item) => {
				return item !== null;
			});
		});
	}
	computeExecutablePath(options) {
		options.platform ??= detectBrowserPlatform();
		if (!options.platform) throw new Error(`Cannot download a binary for the provided platform: ${os.platform()} (${os.arch()})`);
		try {
			options.buildId = this.resolveAlias(options.browser, options.buildId) ?? options.buildId;
		} catch {
			debugCache("could not read .metadata file for the browser");
		}
		const installationDir = this.installationDir(options.browser, options.platform, options.buildId);
		return path.join(installationDir, executablePathByBrowser[options.browser](options.platform, options.buildId));
	}
};
function parseFolderPath(folderPath) {
	const splits = path.basename(folderPath).split("-");
	if (splits.length !== 2) return;
	const [platform, buildId] = splits;
	if (!buildId || !platform) return;
	return {
		platform,
		buildId
	};
}

//#endregion
//#region src/puppeteer-vendor/fileUtil.ts
const debugFileUtil = debug("puppeteer:browsers:fileUtil");
/**
* @internal
*/
async function unpackArchive(archivePath, folderPath) {
	if (!path$1.isAbsolute(folderPath)) folderPath = path$1.resolve(process.cwd(), folderPath);
	if (archivePath.endsWith(".zip")) await (await import("extract-zip")).default(archivePath, { dir: folderPath });
	else if (archivePath.endsWith(".tar.bz2")) await extractTar(archivePath, folderPath, "bzip2");
	else if (archivePath.endsWith(".dmg")) {
		await mkdir(folderPath);
		await installDMG(archivePath, folderPath);
	} else if (archivePath.endsWith(".exe")) {
		const result = spawnSync(archivePath, [`/ExtractDir=${folderPath}`], { env: { __compat_layer: "RunAsInvoker" } });
		if (result.status !== 0) throw new Error(`Failed to extract ${archivePath} to ${folderPath}: ${result.output}`);
	} else if (archivePath.endsWith(".tar.xz")) await extractTar(archivePath, folderPath, "xz");
	else throw new Error(`Unsupported archive format: ${archivePath}`);
}
function createTransformStream(child) {
	const stream = new Stream.Transform({
		transform(chunk, encoding, callback) {
			if (!child.stdin.write(chunk, encoding)) child.stdin.once("drain", callback);
			else callback();
		},
		flush(callback) {
			if (child.stdout.destroyed) callback();
			else {
				child.stdin.end();
				child.stdout.on("close", callback);
			}
		}
	});
	child.stdin.on("error", (e) => {
		if ("code" in e && e.code === "EPIPE") stream.emit("end");
		else stream.destroy(e);
	});
	child.stdout.on("data", (data) => {
		return stream.push(data);
	}).on("error", (e) => {
		return stream.destroy(e);
	});
	child.once("close", () => {
		return stream.end();
	});
	return stream;
}
/**
* @internal
*/
const internalConstantsForTesting = {
	xz: "xz",
	bzip2: "bzip2"
};
/**
* @internal
*/
async function extractTar(tarPath, folderPath, decompressUtilityName) {
	const tarFs = await import("tar-fs");
	return await new Promise((fulfill, reject) => {
		function handleError(utilityName) {
			return (error) => {
				if ("code" in error && error.code === "ENOENT") error = new Error(`\`${utilityName}\` utility is required to unpack this archive`, { cause: error });
				reject(error);
			};
		}
		const unpack = spawn(internalConstantsForTesting[decompressUtilityName], ["-d"], { stdio: [
			"pipe",
			"pipe",
			"inherit"
		] }).once("error", handleError(decompressUtilityName)).once("exit", (code) => {
			debugFileUtil(`${decompressUtilityName} exited, code=${code}`);
		});
		const tar = tarFs.extract(folderPath);
		tar.once("error", handleError("tar"));
		tar.once("finish", fulfill);
		createReadStream(tarPath).pipe(createTransformStream(unpack)).pipe(tar);
	});
}
/**
* @internal
*/
async function installDMG(dmgPath, folderPath) {
	const { stdout } = spawnSync(`hdiutil`, [
		"attach",
		"-nobrowse",
		"-noautoopen",
		dmgPath
	]);
	const volumes = stdout.toString("utf8").match(/\/Volumes\/(.*)/m);
	if (!volumes) throw new Error(`Could not find volume path in ${stdout}`);
	const mountPath = volumes[0];
	try {
		const appName = (await readdir(mountPath)).find((item) => {
			return typeof item === "string" && item.endsWith(".app");
		});
		if (!appName) throw new Error(`Cannot find app in ${mountPath}`);
		spawnSync("cp", [
			"-R",
			path$1.join(mountPath, appName),
			folderPath
		]);
	} finally {
		spawnSync("hdiutil", [
			"detach",
			mountPath,
			"-quiet"
		]);
	}
}

//#endregion
//#region src/puppeteer-vendor/install.ts
const debugInstall = debug$1("puppeteer:browsers:install");
const times = /* @__PURE__ */ new Map();
function debugTime(label) {
	times.set(label, process.hrtime());
}
function debugTimeEnd(label) {
	const end = process.hrtime();
	const start = times.get(label);
	if (!start) return;
	debugInstall(`Duration for ${label}: ${end[0] * 1e3 + end[1] / 1e6 - (start[0] * 1e3 + start[1] / 1e6)}ms`);
}
async function install(options) {
	options.platform ??= detectBrowserPlatform();
	options.unpack ??= true;
	if (!options.platform) throw new Error(`Cannot download a binary for the provided platform: ${os.platform()} (${os.arch()})`);
	const url = getDownloadUrl(options.browser, options.platform, options.buildId, options.baseUrl);
	try {
		return await installUrl(url, options);
	} catch (err) {
		if (options.baseUrl && !options.forceFallbackForTesting) throw err;
		debugInstall(`Error downloading from ${url}.`);
		switch (options.browser) {
			case Browser.CHROME:
			case Browser.CHROMEDRIVER:
			case Browser.CHROMEHEADLESSSHELL: {
				debugInstall(`Trying to find download URL via https://googlechromelabs.github.io/chrome-for-testing.`);
				const version = await getJSON(new URL(`https://googlechromelabs.github.io/chrome-for-testing/${options.buildId}.json`));
				let platform = "";
				switch (options.platform) {
					case BrowserPlatform.LINUX:
						platform = "linux64";
						break;
					case BrowserPlatform.MAC_ARM:
						platform = "mac-arm64";
						break;
					case BrowserPlatform.MAC:
						platform = "mac-x64";
						break;
					case BrowserPlatform.WIN32:
						platform = "win32";
						break;
					case BrowserPlatform.WIN64:
						platform = "win64";
						break;
				}
				const backupUrl = version.downloads[options.browser]?.find((link) => {
					return link["platform"] === platform;
				})?.url;
				if (backupUrl) {
					if (backupUrl === url.toString()) throw err;
					debugInstall(`Falling back to downloading from ${backupUrl}.`);
					return await installUrl(new URL(backupUrl), options);
				}
				throw err;
			}
			default: throw err;
		}
	}
}
async function installDeps(installedBrowser) {
	if (process.platform !== "linux" || installedBrowser.platform !== BrowserPlatform.LINUX) return;
	const depsPath = path.join(path.dirname(installedBrowser.executablePath), "deb.deps");
	if (!existsSync(depsPath)) {
		debugInstall(`deb.deps file was not found at ${depsPath}`);
		return;
	}
	const data = readFileSync(depsPath, "utf-8").split("\n").join(",");
	if (process.getuid?.() !== 0) throw new Error("Installing system dependencies requires root privileges");
	let result = spawnSync("apt-get", ["-v"]);
	if (result.status !== 0) throw new Error("Failed to install system dependencies: apt-get does not seem to be available");
	debugInstall(`Trying to install dependencies: ${data}`);
	result = spawnSync("apt-get", [
		"satisfy",
		"-y",
		data,
		"--no-install-recommends"
	]);
	if (result.status !== 0) throw new Error(`Failed to install system dependencies: status=${result.status},error=${result.error},stdout=${result.stdout.toString("utf8")},stderr=${result.stderr.toString("utf8")}`);
	debugInstall(`Installed system dependencies ${data}`);
}
async function installUrl(url, options) {
	options.platform ??= detectBrowserPlatform();
	if (!options.platform) throw new Error(`Cannot download a binary for the provided platform: ${os.platform()} (${os.arch()})`);
	let downloadProgressCallback = options.downloadProgressCallback;
	if (downloadProgressCallback === "default") downloadProgressCallback = await makeProgressCallback(options.browser, options.buildIdAlias ?? options.buildId);
	const fileName = decodeURIComponent(url.toString()).split("/").pop();
	assert(fileName, `A malformed download URL was found: ${url}.`);
	const cache$1 = new Cache(options.cacheDir);
	const browserRoot = cache$1.browserRoot(options.browser);
	const archivePath = path.join(browserRoot, `${options.buildId}-${fileName}`);
	if (!existsSync(browserRoot)) await mkdir(browserRoot, { recursive: true });
	if (!options.unpack) {
		if (existsSync(archivePath)) return archivePath;
		debugInstall(`Downloading binary from ${url}`);
		debugTime("download");
		await downloadFile(url, archivePath, downloadProgressCallback);
		debugTimeEnd("download");
		return archivePath;
	}
	const outputPath = cache$1.installationDir(options.browser, options.platform, options.buildId);
	try {
		if (existsSync(outputPath)) {
			const installedBrowser$1 = new InstalledBrowser(cache$1, options.browser, options.buildId, options.platform);
			if (!existsSync(installedBrowser$1.executablePath)) throw new Error(`The browser folder (${outputPath}) exists but the executable (${installedBrowser$1.executablePath}) is missing`);
			await runSetup(installedBrowser$1);
			if (options.installDeps) await installDeps(installedBrowser$1);
			return installedBrowser$1;
		}
		debugInstall(`Downloading binary from ${url}`);
		try {
			debugTime("download");
			await downloadFile(url, archivePath, downloadProgressCallback);
		} finally {
			debugTimeEnd("download");
		}
		debugInstall(`Installing ${archivePath} to ${outputPath}`);
		try {
			debugTime("extract");
			await unpackArchive(archivePath, outputPath);
		} finally {
			debugTimeEnd("extract");
		}
		const installedBrowser = new InstalledBrowser(cache$1, options.browser, options.buildId, options.platform);
		if (options.buildIdAlias) {
			const metadata = installedBrowser.readMetadata();
			metadata.aliases[options.buildIdAlias] = options.buildId;
			installedBrowser.writeMetadata(metadata);
		}
		await runSetup(installedBrowser);
		if (options.installDeps) await installDeps(installedBrowser);
		return installedBrowser;
	} finally {
		if (existsSync(archivePath)) await unlink(archivePath);
	}
}
async function runSetup(installedBrowser) {
	if ((installedBrowser.platform === BrowserPlatform.WIN32 || installedBrowser.platform === BrowserPlatform.WIN64) && installedBrowser.browser === Browser.CHROME && installedBrowser.platform === detectBrowserPlatform()) try {
		debugTime("permissions");
		const browserDir = path.dirname(installedBrowser.executablePath);
		if (!existsSync(path.join(browserDir, "setup.exe"))) return;
		spawnSync(path.join(browserDir, "setup.exe"), [`--configure-browser-in-directory=` + browserDir], { shell: true });
	} finally {
		debugTimeEnd("permissions");
	}
}
/**
* @public
*/
async function canDownload(options) {
	options.platform ??= detectBrowserPlatform();
	if (!options.platform) throw new Error(`Cannot download a binary for the provided platform: ${os.platform()} (${os.arch()})`);
	return await headHttpRequest(getDownloadUrl(options.browser, options.platform, options.buildId, options.baseUrl));
}
/**
* Retrieves a URL for downloading the binary archive of a given browser.
*
* The archive is bound to the specific platform and build ID specified.
*
* @public
*/
function getDownloadUrl(browser, platform, buildId, baseUrl) {
	return new URL(downloadUrls[browser](platform, buildId, baseUrl));
}
/**
* @public
*/
function makeProgressCallback(browser, buildId) {
	let progressBar;
	let lastDownloadedBytes = 0;
	return (downloadedBytes, totalBytes) => {
		if (!progressBar) progressBar = new ProgressBarClass(`Downloading ${browser} ${buildId} - ${toMegabytes(totalBytes)} [:bar] :percent :etas `, {
			complete: "=",
			incomplete: " ",
			width: 20,
			total: totalBytes
		});
		const delta = downloadedBytes - lastDownloadedBytes;
		lastDownloadedBytes = downloadedBytes;
		progressBar.tick(delta);
	};
}
function toMegabytes(bytes) {
	const mb = bytes / 1e3 / 1e3;
	return `${Math.round(mb * 10) / 10} MB`;
}

//#endregion
//#region src/puppeteer.ts
var puppeteer_exports = /* @__PURE__ */ __export({
	downloadBrowser: () => downloadBrowser$1,
	findBrowser: () => findBrowser$1,
	getDownloadPath: () => getDownloadPath$1
});
const debugPuppeteer = debug("shared-browser:puppeteer");
/**
* 将内部浏览器类型转换为 Puppeteer 浏览器类型
* Convert internal browser type to Puppeteer browser type
*/
function toPuppeteerBrowser(browser) {
	switch (browser) {
		case "chrome": return Browser.CHROME;
		case "chrome-headless-shell": return Browser.CHROMEHEADLESSSHELL;
		case "chromium": return Browser.CHROMIUM;
		case "firefox": return Browser.FIREFOX;
		default: return Browser.CHROME;
	}
}
/**
* 将内部平台类型转换为 Puppeteer 平台类型
* Convert internal platform type to Puppeteer platform type
*/
function toPuppeteerPlatform(platform) {
	if (!platform) return void 0;
	return platform;
}
/**
* 获取默认缓存目录
* Get default cache directory
*/
function getDefaultCacheDir$1() {
	return path.join(os.homedir(), ".cache", "shared-browser", "puppeteer");
}
/**
* 查找已安装的浏览器
* Find installed browser
*/
async function findBrowser$1(options = {}) {
	const browser = options.browser || "chrome";
	const cacheDir = options.cacheDir || getDefaultCacheDir$1();
	const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();
	if (!platform) {
		debugPuppeteer("Could not detect platform");
		return null;
	}
	const puppeteerBrowser = toPuppeteerBrowser(browser);
	const cache$1 = new Cache(cacheDir);
	try {
		const found = cache$1.getInstalledBrowsers().find((b) => b.browser === puppeteerBrowser && b.platform === platform);
		if (!found) {
			debugPuppeteer("Browser not found:", browser);
			return null;
		}
		debugPuppeteer("Found browser:", found);
		return {
			browser,
			executablePath: found.executablePath,
			buildId: found.buildId,
			platform,
			path: found.path
		};
	} catch (error) {
		debugPuppeteer("Error finding browser:", error);
		return null;
	}
}
/**
* 获取浏览器下载路径
* Get browser download path
*/
function getDownloadPath$1(options) {
	const browser = options.browser || "chrome";
	const cacheDir = options.cacheDir || getDefaultCacheDir$1();
	const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();
	if (!platform) throw new Error("Could not detect platform");
	const puppeteerBrowser = toPuppeteerBrowser(browser);
	const cache$1 = new Cache(cacheDir);
	if (options.buildId) return cache$1.installationDir(puppeteerBrowser, platform, options.buildId);
	return cache$1.rootDir;
}
/**
* 下载浏览器
* Download browser
*/
async function downloadBrowser$1(options) {
	const browser = options.browser;
	const cacheDir = options.cacheDir || getDefaultCacheDir$1();
	const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();
	if (!platform) throw new Error("Could not detect platform");
	const puppeteerBrowser = toPuppeteerBrowser(browser);
	const cache$1 = new Cache(cacheDir);
	let buildId = options.buildId;
	if (!buildId) {
		debugPuppeteer("Resolving build ID for latest version");
		buildId = await resolveBuildId(puppeteerBrowser, platform, "latest");
	}
	debugPuppeteer("Downloading browser:", {
		browser,
		buildId,
		platform
	});
	if (!await canDownload({
		browser: puppeteerBrowser,
		buildId,
		platform,
		cacheDir
	})) throw new Error(`Cannot download ${browser} ${buildId} for ${platform}`);
	const installedBrowser = await install({
		browser: puppeteerBrowser,
		buildId,
		platform,
		cacheDir,
		downloadProgressCallback: options.progressCallback ? (downloadedBytes, totalBytes) => {
			options.progressCallback(downloadedBytes, totalBytes);
		} : void 0
	});
	debugPuppeteer("Browser downloaded successfully:", installedBrowser);
	return {
		browser,
		executablePath: cache$1.computeExecutablePath({
			browser: puppeteerBrowser,
			buildId,
			platform
		}),
		buildId,
		platform,
		path: installedBrowser.path
	};
}

//#endregion
//#region src/playwright.ts
var playwright_exports = /* @__PURE__ */ __export({
	downloadBrowser: () => downloadBrowser,
	findBrowser: () => findBrowser,
	getDownloadPath: () => getDownloadPath
});
const debugPlaywright = debug("shared-browser:playwright");
let browsersConfig = null;
/**
* 加载浏览器配置
* Load browser configuration
*/
async function loadBrowsersConfig() {
	if (browsersConfig) return browsersConfig;
	try {
		const content = await readFile(path.join(path.dirname(new URL(import.meta.url).pathname), "playwright-vendor", "browsers.json"), "utf-8");
		browsersConfig = JSON.parse(content);
		return browsersConfig;
	} catch (error) {
		debugPlaywright("Error loading browsers config:", error);
		return { browsers: [
			{
				name: "chromium",
				revision: "1097",
				installByDefault: true
			},
			{
				name: "firefox",
				revision: "1442",
				installByDefault: true
			},
			{
				name: "webkit",
				revision: "2068",
				installByDefault: true
			}
		] };
	}
}
/**
* 检测当前平台
* Detect current platform
*/
function detectPlatform() {
	const platform = os.platform();
	const arch = os.arch();
	if (platform === "darwin") return arch === "arm64" ? "mac_arm" : "mac";
	else if (platform === "linux") return "linux";
	else if (platform === "win32") return "win64";
	return "linux";
}
/**
* 获取默认缓存目录
* Get default cache directory
*/
function getDefaultCacheDir() {
	if (process.platform === "win32") return path.join(process.env.LOCALAPPDATA || os.homedir(), "ms-playwright");
	return path.join(os.homedir(), ".cache", "ms-playwright");
}
/**
* 将内部浏览器类型转换为 Playwright 浏览器名称
* Convert internal browser type to Playwright browser name
*/
function toPlaywrightBrowserName(browser) {
	switch (browser) {
		case "chrome":
		case "chromium": return "chromium";
		case "firefox": return "firefox";
		case "webkit": return "webkit";
		default: return "chromium";
	}
}
/**
* 查找已安装的浏览器
* Find installed browser
*/
async function findBrowser(options = {}) {
	const browser = options.browser || "chromium";
	const cacheDir = options.cacheDir || getDefaultCacheDir();
	const platform = options.platform || detectPlatform();
	const browserName = toPlaywrightBrowserName(browser);
	try {
		const browserDir = path.join(cacheDir, browserName);
		if (!fs.existsSync(browserDir)) {
			debugPlaywright("Browser directory does not exist:", browserDir);
			return null;
		}
		const dirs = fs.readdirSync(browserDir);
		for (const dir of dirs) {
			const fullPath = path.join(browserDir, dir);
			if (!fs.statSync(fullPath).isDirectory()) continue;
			let executablePath;
			if (platform === "win64" || platform === "win32") {
				const exeName = browserName === "firefox" ? "firefox.exe" : "chrome.exe";
				executablePath = path.join(fullPath, exeName);
			} else if (platform.startsWith("mac")) if (browserName === "chromium") executablePath = path.join(fullPath, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium");
			else if (browserName === "firefox") executablePath = path.join(fullPath, "firefox", "Nightly.app", "Contents", "MacOS", "firefox");
			else executablePath = path.join(fullPath, "pw_run.sh");
			else executablePath = path.join(fullPath, browserName);
			if (fs.existsSync(executablePath)) return {
				browser: [
					"chromium",
					"firefox",
					"webkit",
					"chrome",
					"chrome-headless-shell"
				].includes(browserName) ? browserName : "chromium",
				executablePath,
				buildId: dir,
				platform,
				path: fullPath
			};
		}
		return null;
	} catch (error) {
		debugPlaywright("Error finding browser:", error);
		return null;
	}
}
/**
* 获取浏览器下载路径
* Get browser download path
*/
function getDownloadPath(options) {
	const browser = options.browser || "chromium";
	const cacheDir = options.cacheDir || getDefaultCacheDir();
	const browserName = toPlaywrightBrowserName(browser);
	if (options.buildId) return path.join(cacheDir, browserName, options.buildId);
	return path.join(cacheDir, browserName);
}
/**
* 下载浏览器
* Download browser
* 
* 注意：Playwright 的下载逻辑非常复杂，涉及多个内部模块。
* 建议使用 playwright CLI 或直接安装 playwright 包来下载浏览器。
* 
* Note: Playwright's download logic is very complex and involves multiple internal modules.
* It's recommended to use the playwright CLI or install the playwright package directly to download browsers.
*/
async function downloadBrowser(options) {
	const browser = options.browser;
	const cacheDir = options.cacheDir || getDefaultCacheDir();
	const platform = options.platform || detectPlatform();
	const browserName = toPlaywrightBrowserName(browser);
	debugPlaywright("Downloading browser:", {
		browser: browserName,
		cacheDir,
		platform
	});
	if (!(await loadBrowsersConfig()).browsers.find((b) => b.name === browserName)) throw new Error(`Unknown browser: ${browserName}`);
	throw new Error(`Browser download for Playwright requires the full playwright package or CLI. Please use: npx playwright install ${browserName}\nOr install the @playwright/test package.`);
}

//#endregion
//#region src/index.ts
/**
* 默认导出，提供 Puppeteer 和 Playwright 的浏览器管理功能
* Default export providing browser management for both Puppeteer and Playwright
*/
var src_default = {
	puppeteer: puppeteer_exports,
	playwright: playwright_exports
};

//#endregion
export { src_default as default, playwright_exports as playwright, puppeteer_exports as puppeteer };
//# sourceMappingURL=index.js.map