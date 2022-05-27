"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var puppeteer = require("puppeteer");
// import puppeteer from "puppeteer";
require("dotenv/config");
var URL = "https://web.cse.unsw.edu.au/~apps/hopper/";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var envVariables, details, _i, envVariables_1, x_1, input, tags, x, browser, page, data, tagsSelected, _a, data_1, x_2, text, temp, button;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    envVariables = [
                        "courseCode",
                        "zID",
                        "zPass",
                        "interval",
                        "section",
                        "otherInfo",
                        "tags",
                        "leaveOpen",
                    ];
                    details = {};
                    for (_i = 0, envVariables_1 = envVariables; _i < envVariables_1.length; _i++) {
                        x_1 = envVariables_1[_i];
                        input = process.env[x_1];
                        if (!input)
                            return [2 /*return*/];
                        details[x_1] = input;
                    }
                    tags = {};
                    x = details["tags"]
                        .toLowerCase()
                        .split(", ")
                        .map(function (tag) { return (tags[tag] = tag); });
                    return [4 /*yield*/, puppeteer.launch({ headless: true })];
                case 1:
                    browser = _b.sent();
                    return [4 /*yield*/, browser.pages()];
                case 2:
                    page = (_b.sent())[0];
                    return [4 /*yield*/, page.goto(URL)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, findSession(page, details["courseCode"].toLowerCase(), Number(details["interval"]))];
                case 4:
                    _b.sent();
                    // Submit Login Details
                    return [4 /*yield*/, page.type("input[id=inputzID]", details["zID"])];
                case 5:
                    // Submit Login Details
                    _b.sent();
                    return [4 /*yield*/, page.type("input[id=inputPass]", details["zPass"])];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, page.click("button[id=submit_button]")];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, page.waitForNetworkIdle()];
                case 8:
                    _b.sent();
                    if (!(page.url() === URL)) return [3 /*break*/, 10];
                    console.log("The login credentials are incorrect.");
                    return [4 /*yield*/, browser.close()];
                case 9:
                    _b.sent();
                    return [2 /*return*/];
                case 10:
                    console.log("Successfully logged in!");
                    // Enter session details
                    return [4 /*yield*/, page.type("input[placeholder='What specifically are you working on?']", details["section"])];
                case 11:
                    // Enter session details
                    _b.sent();
                    return [4 /*yield*/, page.type("textarea[id=desc_desc]", details["otherInfo"])];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, page.$$("input[class=form-check-input][type=checkbox]")];
                case 13:
                    data = _b.sent();
                    tagsSelected = false;
                    _a = 0, data_1 = data;
                    _b.label = 14;
                case 14:
                    if (!(_a < data_1.length)) return [3 /*break*/, 17];
                    x_2 = data_1[_a];
                    return [4 /*yield*/, page.evaluate(function (el) { return el.value; }, x_2)];
                case 15:
                    text = _b.sent();
                    if (text.toLowerCase() in tags) {
                        x_2.evaluate(function (y) { return y.click(); });
                        tagsSelected = true;
                    }
                    _b.label = 16;
                case 16:
                    _a++;
                    return [3 /*break*/, 14];
                case 17:
                    if (!(tagsSelected === false)) return [3 /*break*/, 19];
                    temp = data[0];
                    return [4 /*yield*/, temp.evaluate(function (x) { return x.click(); })];
                case 18:
                    _b.sent();
                    _b.label = 19;
                case 19: return [4 /*yield*/, page.$("button[type=submit]")];
                case 20:
                    button = _b.sent();
                    if (!button)
                        return [2 /*return*/];
                    return [4 /*yield*/, button.evaluate(function (x) { return x.click(); })];
                case 21:
                    _b.sent();
                    console.log("Help Session has been booked!");
                    return [4 /*yield*/, browser.close()];
                case 22:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
function findSession(page, courseCode, interval) {
    return __awaiter(this, void 0, void 0, function () {
        var count, sessionFound, sessions, _i, sessions_1, session, text, words, i, word;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    count = 0;
                    sessionFound = false;
                    _a.label = 1;
                case 1:
                    if (!(sessionFound == false)) return [3 /*break*/, 13];
                    return [4 /*yield*/, page.$$("div.list-group-item")];
                case 2:
                    sessions = _a.sent();
                    _i = 0, sessions_1 = sessions;
                    _a.label = 3;
                case 3:
                    if (!(_i < sessions_1.length)) return [3 /*break*/, 9];
                    session = sessions_1[_i];
                    return [4 /*yield*/, session.evaluate(function (el) { return el.textContent; })];
                case 4:
                    text = _a.sent();
                    words = text.trim().split(" ");
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < words.length && sessionFound == false)) return [3 /*break*/, 8];
                    word = words[i];
                    if (!(word.toLowerCase() === courseCode)) return [3 /*break*/, 7];
                    sessionFound = true;
                    return [4 /*yield*/, session.click()];
                case 6:
                    _a.sent();
                    return [2 /*return*/, session];
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8:
                    _i++;
                    return [3 /*break*/, 3];
                case 9:
                    if (!(interval != 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, interval * 1000); })];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    count++;
                    process.stdout.write("\tRetrying: " + count + "\r");
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 13: return [2 /*return*/];
            }
        });
    });
}
