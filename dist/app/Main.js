/*
  Copyright 2017 Esri

  Licensed under the Apache License, Version 2.0 (the "License");

  you may not use this file except in compliance with the License.

  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software

  distributed under the License is distributed on an "AS IS" BASIS,

  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

  See the License for the specific language governing permissions and

  limitations under the License.​
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "dojo/i18n!./nls/resources", "ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper", "esri/Graphic", "esri/core/Handles", "esri/widgets/Expand", "esri/core/Collection", "esri/core/watchUtils", "esri/core/promiseUtils"], function (require, exports, i18n, itemUtils_1, domHelper_1, Graphic_1, Handles_1, Expand_1, Collection_1, watchUtils_1, promiseUtils_1) {
    "use strict";
    Graphic_1 = __importDefault(Graphic_1);
    Handles_1 = __importDefault(Handles_1);
    Expand_1 = __importDefault(Expand_1);
    Collection_1 = __importDefault(Collection_1);
    var CSS = {
        loading: "configurable-application--loading"
    };
    var MapExample = /** @class */ (function () {
        function MapExample() {
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  ApplicationBase
            //----------------------------------
            this.base = null;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        MapExample.prototype.init = function (base) {
            var _this = this;
            var _a;
            if (!base) {
                console.error("ApplicationBase is not defined");
                return;
            }
            domHelper_1.setPageLocale(base.locale);
            domHelper_1.setPageDirection(base.direction);
            this.base = base;
            var config = base.config, results = base.results;
            var find = config.find, marker = config.marker;
            var webMapItems = results.webMapItems;
            var validWebMapItems = webMapItems.map(function (response) { return response.value; });
            // Do we have a web map or web scene?
            var firstItem = validWebMapItems[0];
            if (!firstItem) {
                this._displayError(i18n.mapError);
                return;
            }
            config.title = !this.base.config.detailsTitle ? itemUtils_1.getItemTitle(firstItem) : this.base.config.detailsTitle;
            domHelper_1.setPageTitle(config.title);
            if (this.base.config.customstyle) {
                var style = document.createElement("style");
                style.appendChild(document.createTextNode(this.base.config.customstyle));
                document.head.appendChild(style);
            }
            var portalItem = this.base.results.applicationItem.value;
            var appProxies = ((_a = portalItem) === null || _a === void 0 ? void 0 : _a.applicationProxies) || null;
            var viewContainerNode = document.getElementById("viewContainer");
            // Get url properties like center, extent, zoom
            var defaultViewProperties = itemUtils_1.getConfigViewProperties(config);
            var components = this.base.config.mapZoom ? ["attribution", "zoom"] : ["attribution"];
            validWebMapItems.forEach(function (item) {
                var viewNode = document.createElement("div");
                viewContainerNode.appendChild(viewNode);
                var viewProperties = __assign({ container: viewNode, ui: { components: components } }, defaultViewProperties);
                itemUtils_1.createMapFromItem({ item: item, appProxies: appProxies }).then(function (map) {
                    return itemUtils_1.createView(__assign(__assign({}, viewProperties), { map: map }))
                        .then(function (view) {
                        view.when(function () {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                            itemUtils_1.findQuery(find, view).then(function () { return itemUtils_1.goToMarker(marker, view); });
                            if (((_c = (_b = (_a = _this) === null || _a === void 0 ? void 0 : _a.base) === null || _b === void 0 ? void 0 : _b.config) === null || _c === void 0 ? void 0 : _c.popupDockPosition) !== "auto") {
                                view.popup.dockEnabled = true;
                                view.popup.set("dockOptions", {
                                    breakpoint: false,
                                    buttonEnabled: false,
                                    position: _this.base.config.popupDockPosition
                                });
                            }
                            if (((_f = (_e = (_d = _this) === null || _d === void 0 ? void 0 : _d.base) === null || _e === void 0 ? void 0 : _e.config) === null || _f === void 0 ? void 0 : _f.popupDisplayAttachmentType) === "preview") {
                                // Display attachments in list vs preview mode.
                                view.map.layers.forEach(function (popupLayer) {
                                    if (popupLayer.hasOwnProperty("popupTemplate")) {
                                        var layer = popupLayer;
                                        var template = layer.popupTemplate;
                                        if (Array.isArray(template.content)) {
                                            template.content.forEach(function (content) {
                                                if (content.type === "attachments") {
                                                    content.displayType = "preview";
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            if (!((_j = (_h = (_g = _this) === null || _g === void 0 ? void 0 : _g.base) === null || _h === void 0 ? void 0 : _h.config) === null || _j === void 0 ? void 0 : _j.rotation) && view.type === "2d") {
                                _this.view = view;
                                _this.view.constraints.rotationEnabled = false;
                            }
                            var _k = _this.base.config, mapZoom = _k.mapZoom, mapZoomPosition = _k.mapZoomPosition, viewMinScale = _k.viewMinScale, viewMaxScale = _k.viewMaxScale;
                            if (mapZoom && mapZoomPosition !== "top-left") {
                                view.ui.move("zoom", mapZoomPosition);
                            }
                            if (view.type === "2d") {
                                view = view;
                                if (viewMinScale) {
                                    view.constraints.minScale = viewMinScale;
                                }
                                if (viewMaxScale) {
                                    view.constraints.maxScale = viewMaxScale;
                                }
                            }
                            var _l = _this.base.config, highlightColor = _l.highlightColor, highlightFillOpacity = _l.highlightFillOpacity, highlightHaloOpacity = _l.highlightHaloOpacity;
                            if (highlightColor) {
                                view.highlightOptions.color = highlightColor;
                            }
                            if (highlightFillOpacity) {
                                view.highlightOptions.fillOpacity = highlightFillOpacity;
                            }
                            if (highlightHaloOpacity) {
                                view.highlightOptions.haloOpacity = highlightHaloOpacity;
                            }
                            // Disable map scroll and add overlay explaining how to do it depending on touch device or not
                            var disableScroll = _this.base.config.disableScroll;
                            if (disableScroll) {
                                var handles_1 = new Handles_1.default();
                                // disable mouse wheel and single-touch map nav
                                view.navigation.mouseWheelZoomEnabled = false;
                                view.navigation.browserTouchPanEnabled = false;
                                var pointers_1 = new Map();
                                handles_1.add(view.on("pointer-down", function (e) {
                                    var pointerId = e.pointerId, pointerType = e.pointerType, x = e.x, y = e.y;
                                    if (pointerType !== "touch") {
                                        return;
                                    }
                                    pointers_1.set(pointerId, { x: x, y: y });
                                }), "pointer");
                                handles_1.add(view.on(["pointer-up", "pointer-leave"], function (e) {
                                    var pointerId = e.pointerId, pointerType = e.pointerType;
                                    if (pointerType !== "touch") {
                                        return;
                                    }
                                    pointers_1.delete(pointerId);
                                }), "pointer");
                                handles_1.add(view.on("pointer-move", function (e) {
                                    var pointerId = e.pointerId, pointerType = e.pointerType, x = e.x, y = e.y;
                                    if (pointerType !== "touch") {
                                        return;
                                    }
                                    if (pointers_1.size !== 1) {
                                        return;
                                    }
                                    var distance = Math.sqrt(Math.pow(x - pointers_1.get(pointerId).x, 2) +
                                        Math.pow(y - pointers_1.get(pointerId).y, 2));
                                    if (distance < 20) {
                                        return;
                                    }
                                    _this._showScrollMessage(i18n.scroll.touchInstructions);
                                    handles_1.remove("pointer");
                                }), "pointer");
                                handles_1.add(view.on(["mouse-wheel"], function (e) {
                                    if (e.type === "mouse-wheel") {
                                        view.focus();
                                        _this._showScrollMessage(i18n.scroll.instructions);
                                        handles_1.remove("mouse");
                                    }
                                }), "mouse");
                            }
                            _this.defineUrlParams(view);
                            _this._addSplash(view, _this.base.config);
                            _this.addDetails(item, view);
                            _this.applySharedTheme();
                            _this.addWidgets(view);
                        });
                    });
                });
            });
            document.body.classList.remove(CSS.loading);
        };
        MapExample.prototype._showScrollMessage = function (message) {
            var scrollMessage = document.getElementById("scrollMessage");
            scrollMessage.innerHTML = message;
            var scroller = document.getElementById("scroller");
            if (!scroller.classList.contains("is-active")) {
                scroller.classList.add("is-active");
                setTimeout(function () {
                    // after small delay remove the message
                    scroller.classList.remove("is-active");
                }, 2000);
            }
        };
        MapExample.prototype._addSplash = function (view, config) {
            return __awaiter(this, void 0, void 0, function () {
                var Splash, splash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!config.splash) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve_1, reject_1) { require(["./Components/Splash"], resolve_1, reject_1); }).then(__importStar)];
                        case 1:
                            Splash = _a.sent();
                            if (!Splash) {
                                return [2 /*return*/];
                            }
                            splash = new Splash.default({
                                config: config,
                                container: document.createElement("div")
                            });
                            document.body.appendChild(splash.container);
                            view.ui.add(splash.createToolbarButton(), "top-right");
                            splash.showSplash();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.applySharedTheme = function () {
            var _a, _b, _c, _d;
            // For now just to the text panel
            if ((_d = (_c = (_b = (_a = this) === null || _a === void 0 ? void 0 : _a.base) === null || _b === void 0 ? void 0 : _b.portal) === null || _c === void 0 ? void 0 : _c.portalProperties) === null || _d === void 0 ? void 0 : _d.sharedTheme) {
                var theme = this.base.portal.portalProperties.sharedTheme;
                if (theme.body) {
                    if (theme.body.background) {
                        this.base.config.detailsBackgroundColor = theme.body.background;
                    }
                    if (theme.body.text) {
                        this.base.config.detailsTextColor = theme.body.text;
                    }
                }
            }
        };
        MapExample.prototype.addDetails = function (item, view) {
            var _a = this.base.config, details = _a.details, detailsTitle = _a.detailsTitle, detailsContent = _a.detailsContent, detailsIndex = _a.detailsIndex, detailsPosition = _a.detailsPosition, detailsTextColor = _a.detailsTextColor, detailsBackgroundColor = _a.detailsBackgroundColor;
            if (details) {
                var title = detailsTitle || item.title;
                var panelText = detailsContent;
                if (!panelText) {
                    panelText = item.snippet || item.description || "";
                }
                var panel_1 = document.createElement("banner");
                panel_1.innerHTML = "\n       <div \n         class=\"panel panel-no-border esri-widget--panel\" \n         style=background-color:" + detailsBackgroundColor + "\n         color:" + detailsTextColor + ">\n         <h3 class=trailer-half>" + title + "</h3>\n         <p>" + panelText + "</p>\n         </div>";
                var expand = new Expand_1.default({
                    content: panel_1,
                    expandIconClass: "esri-icon-description",
                    view: view,
                    mode: "floating",
                    group: detailsPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
                    expandTooltip: i18n.widgets.details.label
                });
                var isSmall = view.widthBreakpoint === "xsmall" || view.widthBreakpoint === "small" || view.widthBreakpoint === "medium";
                var panelComponent_1 = {
                    component: isSmall ? expand : panel_1,
                    position: detailsPosition,
                    index: detailsIndex === "first" ? 0 : 20
                };
                view.ui.add(panelComponent_1);
                // if the view is small, xsmall or medium put panel in info button
                view.watch("widthBreakpoint", function (breakpoint) {
                    var isSmall = false;
                    if (breakpoint === "xsmall" || breakpoint === "small" || breakpoint === "medium") {
                        isSmall = true;
                    }
                    view.ui.remove(panelComponent_1.component);
                    panelComponent_1.component = isSmall ? new Expand_1.default({
                        content: panel_1,
                        expandIconClass: "esri-icon-description",
                        view: view,
                        mode: "floating",
                        group: detailsPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
                        expandTooltip: i18n.widgets.details.label
                    }) : panel_1;
                    view.ui.add(panelComponent_1);
                });
            }
        };
        MapExample.prototype.defineUrlParams = function (view) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var modules, _c, Search, urlUtils, searchResults, searchTerm, featureLayer, fields, search;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!(this.base.config.customUrlLayer.id && this.base.config.customUrlLayer.fields.length > 0 && this.base.config.customUrlParam)) return [3 /*break*/, 2];
                            return [4 /*yield*/, promiseUtils_1.eachAlways([new Promise(function (resolve_2, reject_2) { require(["esri/widgets/Search"], resolve_2, reject_2); }).then(__importStar), new Promise(function (resolve_3, reject_3) { require(["esri/core/urlUtils"], resolve_3, reject_3); }).then(__importStar)])];
                        case 1:
                            modules = _d.sent();
                            _c = modules.map(function (module) { return module.value; }), Search = _c[0], urlUtils = _c[1];
                            if (!Search && urlUtils) {
                                return [2 /*return*/];
                            }
                            searchResults = urlUtils.urlToObject(document.location.href);
                            searchTerm = null;
                            if (searchResults && searchResults.query) {
                                if (this.base.config.customUrlParam in searchResults.query) {
                                    searchTerm = searchResults.query[this.base.config.customUrlParam];
                                }
                            }
                            featureLayer = view.map.findLayerById(this.base.config.customUrlLayer.id);
                            if (featureLayer && searchTerm) {
                                fields = (_b = (_a = this.base.config.customUrlLayer) === null || _a === void 0 ? void 0 : _a.fields[0]) === null || _b === void 0 ? void 0 : _b.fields;
                                search = new Search.default({
                                    view: view,
                                    resultGraphicEnabled: false,
                                    searchAllEnabled: false,
                                    includeDefaultSources: false,
                                    suggestionsEnabled: false,
                                    searchTerm: searchTerm,
                                    sources: [{
                                            layer: featureLayer,
                                            searchFields: fields,
                                            outFields: fields,
                                            exactMatch: true,
                                            name: "UrlParamSearch"
                                        }]
                                });
                                search.search();
                            }
                            _d.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addWidgets = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, legend, insetMap, inset;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.base.config, legend = _a.legend, insetMap = _a.insetMap, inset = _a.inset;
                            this.addLayerList(view);
                            if (!legend) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.addLegend(view)];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2:
                            this.addHover(view);
                            this.addLocate(view);
                            this.addBookmarks(view);
                            this.addPrint(view);
                            this.addShare(view);
                            this.addSearch(view);
                            this.addBasemap(view);
                            this.addHome(view);
                            this.addFullscreen(view);
                            // Add overview map 
                            if (insetMap || inset)
                                this.createOverviewMap(view);
                            this.addTime(view);
                            this.addSwipe(view);
                            return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype._createSwipeLayers = function (swipeLayers, view) {
            var swipeResults = new Collection_1.default();
            if (swipeLayers) {
                JSON.parse(swipeLayers).forEach(function (id) {
                    var l;
                    if (id.id.indexOf(".") !== -1) {
                        var layerValues = id.id.split(".");
                        var layerId = layerValues[0];
                        var subLayerId_1 = layerValues[1];
                        var mainLayer = view.map.findLayerById(layerId);
                        mainLayer.sublayers.forEach(function (sub) {
                            if (sub.id === parseInt(subLayerId_1)) {
                                l = sub.layer;
                            }
                        });
                    }
                    else {
                        // Find the map layer 
                        l = view.map.findLayerById(id.id);
                    }
                    if (l) {
                        swipeResults.add(l);
                    }
                });
            }
            return swipeResults;
        };
        MapExample.prototype._getBasemap = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var Basemap, basemap;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve_4, reject_4) { require(["esri/Basemap"], resolve_4, reject_4); }).then(__importStar)];
                        case 1:
                            Basemap = _a.sent();
                            if (!Basemap) {
                                return [2 /*return*/];
                            }
                            basemap = Basemap.default.fromId(id);
                            if (!!basemap) return [3 /*break*/, 3];
                            return [4 /*yield*/, new Basemap.default({
                                    portalItem: {
                                        id: id
                                    }
                                }).loadAll()];
                        case 2:
                            basemap = _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, basemap];
                    }
                });
            });
        };
        MapExample.prototype.createGraphic = function (insetView, view, style) {
            insetView.graphics.removeAll();
            var graphic = null;
            if (view && view.extent) {
                if (style === "marker") {
                    graphic = new Graphic_1.default({
                        geometry: view.extent,
                        symbol: {
                            type: "picture-marker",
                            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAB5CAYAAAAd+o5JAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADKGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwMTQgNzkuMTU2Nzk3LCAyMDE0LzA4LzIwLTA5OjUzOjAyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NTk3M0JBQjZDNDkxMUU0QTM3RThDNzNCRDk3QTcyQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NTk3M0JBQzZDNDkxMUU0QTM3RThDNzNCRDk3QTcyQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU1MjgwM0FDNkM0OTExRTRBMzdFOEM3M0JEOTdBNzJBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU1OTczQkFBNkM0OTExRTRBMzdFOEM3M0JEOTdBNzJBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+lMh/mgAABuxJREFUeF7tne2N2zoURFPCKyElpIQtISWkhJSQDlJCSsjv/ZUStoSUEGAb2Iii1s+yjz4o3RnJDAc4CDBAbGlkUuQlpf3w9vbWqBw0G3WBZqMu0GzUBZqNukCzURdoNuoCzUZdoNmoCzQbdYFmoy7QbNQFmg6ken596vja8aPjV8fbAi8dPzu+dTwNnyIT5aEETQfhen793JEu6p8OupClpIv+peO/4RvCRHkoQdNBiJ5fP3ak1hd1YadIP56Pw7fuFuWhBE0Hu5Ra1/Pr9+ECOAm52JSHEjQdbFa+16pb7hKp99jcjVMeStB0UKzcNa8ZRLn43fFpOLoiUR5K0HRQpDyoOrr1TvF1OMrVojyUoOlgtfIIl8I9Ez+Go10lykMJmg5WKQ90KNQzko511X2a8lCCpoNFHTN63svP4ehnRXkoQdPBrB6ji55iseumPJSg6WBSuSRJ4T0S34azQVEeStB0gMrTpLOOokuZrIFTHkrQdIA61zx4L+nHigMxykMJmg7ulCtZFNYjg/dnykMJmg5GyrXoWrrpW+66bcpDCZoORsq1YAqoBn4NZ3kR5aEETQcX1d2K3xm1ZspDCZoOLvK04vQjet/5cU2qUqWFBvo/kYyKJJSHEjQdXKQNOV3E5e08eeqmLqFe1qEpDyVoOuiVV5cokL2kPVvle7W0y5mXAgnloQRNB700rWf1QsGkNNO5l+HTMQ8laDroFT/gKlrym5Wmft532ZSHEjQddCf86SaAvdxNVXYrfiXsS/pYykMJmg76E+YgtpB6hLDdlCPl+zt95xb6nobyUIKmg+6EI1vJ7KrPLqUBHH/nFvrehvJQgqaD/oQ5iFJSKw7fAD9SZGvuRHkoQdNBd8JRwcUNtqYUOdruRHkoQdMBBrCNfjAjVewg8YnyUIKmAzj5rZQXPbaIv3sL7SIX41Lc7aVd5GJcihsotou8Ae3I+l1xCyn/1EUO6/6Gy6AVf3c5nSgPJWg66E44qvsrfhapWOmHxN9dyp/0cZSHEjQddCcctVlg1VMLuxRXnfvnKl6Ra8mauvW74u7HffmV8lCCpoPuhNPeLgpiC7qqV+xCSj9+oDyUoOmgV953RWFsIX4AFrvJsL8fJ1EeStB00Cu2laQuNXY6FTc4TFx6G8pDCZoOesV22Yk0LYu50Omi8Hds5fPwyZiHEjQdXBQfZrrQm97l0Sv/8CJvI4nfw6f3ojyUoOngorg56DXpPlq+kSCP+BVbhEfHQnkoQdPBSHHVr1vSBUvz8ekpVt6Gm8YGqmNIjG4hlIcSNB2MFDsAmyK17jSQSqRbRPpX0WpvuZveUR5K0HRwJ0/gR3DXi1AeStB0cCdPa3aDRRrKQwmaDlD1tWYcC1AeStB0gKqrNU+WWikPJWg6mFRslekoZrcJUx5K0HQwKc282c3sHJ3yUIKmg1nFV5ycpHHFbGmV8lCCpoNZ5QJF1OqPm8V94JSHEjQdLCpXqijEM7PqyUrKQwmaDhaVFwoebUq1amGE8lCCpoNV0r1uQsH34agXRXkoQdPBaj3GlGp2ynQrykMJmg5W6zEGYUUP3VEeStB0UKRzD8KKX2NBeShB00GxzjsIK96FQnkoQdNBsc5ZCVs92LoW5aEETQebdK5K2GJla0qUhxI0HWxSnjufZRB22X1ZKspDCZoONuscLz/f9c4wykMJmg52SbvpbonUk+x69oryUIKmg12Kf5tfCbvfGUZ5KEHTwW7FvxJxDaNN8ltFeShB08FuHTMIC3mojvJQgqaDEHn3hIU97E55KEHTQZh8CxhhD7pTHkrQdBAmTyVs92DrWpSHEjQdhCr+ychrNle2pkR5KEHTQai0y5Hh7+6kPJSg6SBcmuXIXZWtKVEeStB0EK48pYpejpS8CI7yUIKmA4lip1Sy94NRHkrQdCBTXGsOmzLdivJQgqYDmWKmVLr3gnWiPJSg6UCqfQWS3atMS6I8lKDpQKp9rTm08EGiPJSg6UCuba05teLQwgeJ8lCCpgO5trVmeStOojyUoOnAovLWLG/FSZSHEjQdWFT2LJV0RH0tykMJmg5sWj9vlo6or0V5KEHTgU3rqmC2VpxEeShB04FVyytUnj9WMojyUIKmA6vmV6gkK01zojyUoOnAqrzeTBc4of9bjzeiPJSg6cAufo7q8icDnKI8lKDpwC6eTm16KnGvKA8laDo4RPfTKdu06VqUhxI0HRyi8VMXL4NrF+WhBE0Hh2j8DJX+z/9NiPJQgqaDw/R/l31IV51EeShB08Fhyl22fW58LcpDCZoODlPusg/rqpMoDyVoNuoCzUZdoNmoCzQbdYFmoy7QbNQFmo26QLNRF2g26gLNRl2g2agLNBs18fbhLwdyU/7jRWqcAAAAAElFTkSuQmCC",
                            width: 24,
                            height: 24
                        }
                    });
                }
                else {
                    graphic = new Graphic_1.default({
                        geometry: view.extent,
                        symbol: {
                            type: "simple-fill",
                            color: [160, 160, 160, 0.2],
                            outline: {
                                color: [100, 100, 100, 0]
                            }
                        }
                    });
                }
                var goToParams = {
                    target: style === "marker" ? graphic.geometry : graphic.geometry.extent.center
                };
                if (this.base.config.insetScale) {
                    goToParams.scale = this.base.config.insetScale;
                }
                else {
                    goToParams.zoom = view.zoom > 4 ? view.zoom - 4 : 0;
                }
                insetView.graphics.add(graphic);
                insetView.goTo(goToParams);
            }
        };
        MapExample.prototype.addFullscreen = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, fullscreen, fullscreenPosition, Fullscreen;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.base.config, fullscreen = _a.fullscreen, fullscreenPosition = _a.fullscreenPosition;
                            if (!fullscreen) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve_5, reject_5) { require(["esri/widgets/Fullscreen"], resolve_5, reject_5); }).then(__importStar)];
                        case 1:
                            Fullscreen = _b.sent();
                            if (!Fullscreen) {
                                return [2 /*return*/];
                            }
                            view.ui.add(new Fullscreen.default({ view: view }), fullscreenPosition);
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addHome = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, home, homePosition, Home;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.base.config, home = _a.home, homePosition = _a.homePosition;
                            if (!home) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve_6, reject_6) { require(["esri/widgets/Home"], resolve_6, reject_6); }).then(__importStar)];
                        case 1:
                            Home = _b.sent();
                            if (!Home) {
                                return [2 /*return*/];
                            }
                            view.ui.add(new Home.default({
                                view: view
                            }), homePosition);
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.createOverviewMap = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var modules, _a, Map, MapView, _b, insetBasemap, insetPosition, insetLocationStyle, insetStyle, basemap, _c, map, container, insetView;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, promiseUtils_1.eachAlways([new Promise(function (resolve_7, reject_7) { require(["esri/Map"], resolve_7, reject_7); }).then(__importStar), new Promise(function (resolve_8, reject_8) { require(["esri/views/MapView"], resolve_8, reject_8); }).then(__importStar)])];
                        case 1:
                            modules = _d.sent();
                            _a = modules.map(function (module) { return module.value; }), Map = _a[0], MapView = _a[1];
                            _b = this.base.config, insetBasemap = _b.insetBasemap, insetPosition = _b.insetPosition, insetLocationStyle = _b.insetLocationStyle, insetStyle = _b.insetStyle;
                            if (!insetBasemap) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._getBasemap(insetBasemap)];
                        case 2:
                            _c = _d.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _c = view.map.basemap;
                            _d.label = 4;
                        case 4:
                            basemap = _c;
                            map = new Map.default({
                                basemap: basemap
                            });
                            container = document.createElement("div");
                            container.className = "inset-map";
                            container.setAttribute("aria-label", i18n.widgets.overviewDetails);
                            insetView = new MapView.default({
                                map: map,
                                ui: {
                                    components: []
                                },
                                container: container
                            });
                            view.ui.add(insetView.container, insetPosition);
                            return [4 /*yield*/, insetView.when()];
                        case 5:
                            _d.sent();
                            // Show one location or extent depending on config settings
                            view.watch("extent", function () {
                                _this.createGraphic(insetView, view, insetLocationStyle);
                            });
                            this.createGraphic(insetView, view, insetLocationStyle);
                            insetView.container.classList.add(insetStyle);
                            // prevent panning
                            insetView.on("drag", function (evt) {
                                evt.stopPropagation();
                            });
                            insetView.on("mouse-wheel", function (evt) {
                                evt.stopPropagation();
                            });
                            insetView.on("double-click", function (evt) {
                                evt.stopPropagation();
                            });
                            insetView.on("key-down", function (evt) {
                                var keyPressed = evt.key;
                                if (keyPressed.slice(0, 5) === "Arrow") {
                                    evt.stopPropagation();
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype._displayError = function (err) {
            document.body.classList.remove("configurable-application--loading");
            document.body.classList.add("app-error");
            document.getElementById("viewContainer").innerHTML = err;
        };
        MapExample.prototype.addSwipe = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var swipe, Swipe, _a, mode, position, leadingLayers, trailingLayers, swipeAlwaysEnabled, swipeButtonPosition, leading, trailing, swipe_1, swipeButton, toggle_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            swipe = this.base.config.swipe;
                            if (!(swipe && view.type === "2d")) return [3 /*break*/, 4];
                            return [4 /*yield*/, new Promise(function (resolve_9, reject_9) { require(['esri/widgets/Swipe'], resolve_9, reject_9); }).then(__importStar)];
                        case 1:
                            Swipe = _b.sent();
                            _a = this.base.config, mode = _a.mode, position = _a.position, leadingLayers = _a.leadingLayers, trailingLayers = _a.trailingLayers, swipeAlwaysEnabled = _a.swipeAlwaysEnabled, swipeButtonPosition = _a.swipeButtonPosition;
                            return [4 /*yield*/, watchUtils_1.whenFalseOnce(view, "updating")];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, view.map.loadAll()];
                        case 3:
                            _b.sent();
                            leading = this._createSwipeLayers(leadingLayers, view);
                            trailing = this._createSwipeLayers(trailingLayers, view);
                            if (leading.length === 0 && trailing.length === 0) {
                                // just use the first layer in the op layers as the trailing layer
                                if (view.map.layers.length > 0) {
                                    trailing.add(view.map.layers.items[0]);
                                }
                            }
                            if (leading || trailing) {
                                swipe_1 = new Swipe.default({
                                    direction: mode,
                                    position: position,
                                    leadingLayers: leading,
                                    trailingLayers: trailing
                                });
                                view.ui.add(swipe_1);
                                // show swipe when app opens 
                                if (swipeAlwaysEnabled) {
                                    swipe_1.view = view;
                                }
                                else {
                                    swipeButton = document.createElement("button");
                                    swipeButton.classList.add("esri-widget");
                                    swipeButton.classList.add("esri-widget--button");
                                    swipeButton.classList.add("esri-interactive");
                                    swipeButton.classList.add(mode === "vertical" ? "esri-icon-handle-horizontal" : "esri-icon-handle-vertical");
                                    swipeButton.title = swipe_1.label;
                                    view.ui.add(swipeButton, swipeButtonPosition);
                                    toggle_1 = true;
                                    swipeButton.addEventListener("click", function () {
                                        swipe_1.view = swipe_1.view ? null : view;
                                        toggle_1 = !toggle_1;
                                    });
                                }
                            }
                            _b.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addHover = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, hoverPopup, hoverPopupType, hoverPopupPosition, Feature, feature_1, lastHitTest_1, highlight_1, overPopup_1, domNode;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.base.config, hoverPopup = _a.hoverPopup, hoverPopupType = _a.hoverPopupType, hoverPopupPosition = _a.hoverPopupPosition;
                            if (!hoverPopup) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve_10, reject_10) { require(["esri/widgets/Feature"], resolve_10, reject_10); }).then(__importStar)];
                        case 1:
                            Feature = _b.sent();
                            if (!Feature) {
                                return [2 /*return*/];
                            }
                            feature_1 = new Feature.default({
                                map: view.map,
                                defaultPopupTemplateEnabled: false,
                                spatialReference: view.spatialReference
                            });
                            overPopup_1 = false;
                            if (hoverPopupType === "floating") {
                                domNode = view.popup.domNode;
                                domNode.addEventListener("mouseenter", function () { overPopup_1 = true; });
                                domNode.addEventListener("mouseleave", function () { overPopup_1 = false; });
                            }
                            view.on("pointer-move", function (evt) {
                                clearTimeout(lastHitTest_1);
                                // add a tiny delay before performing hit test
                                lastHitTest_1 = setTimeout(function () {
                                    view.hitTest(evt).then(function (hitTestResults) {
                                        // Get (feature) layers with popup enabled
                                        var results = hitTestResults.results.filter(function (result) {
                                            var _a, _b, _c;
                                            var template = result.graphic.getEffectivePopupTemplate();
                                            return ((_c = (_b = (_a = result) === null || _a === void 0 ? void 0 : _a.graphic) === null || _b === void 0 ? void 0 : _b.layer) === null || _c === void 0 ? void 0 : _c.popupEnabled) && template;
                                        });
                                        var result = null;
                                        results.some(function (r) {
                                            var _a, _b, _c, _d, _e, _f;
                                            if (((_c = (_b = (_a = r) === null || _a === void 0 ? void 0 : _a.graphic) === null || _b === void 0 ? void 0 : _b.layer) === null || _c === void 0 ? void 0 : _c.type) === "feature" || ((_f = (_e = (_d = r) === null || _d === void 0 ? void 0 : _d.graphic) === null || _e === void 0 ? void 0 : _e.layer) === null || _f === void 0 ? void 0 : _f.type) === "map-notes") {
                                                result = r;
                                                return true;
                                            }
                                        });
                                        if (result)
                                            result.graphic.layer.outFields = ["*"];
                                        highlight_1 && highlight_1.remove();
                                        if (result) {
                                            view.whenLayerView(result.graphic.layer).then(function (featureLayerView) {
                                                if (hoverPopupType === "floating") {
                                                    view.popup.open({
                                                        location: evt.mapPoint,
                                                        features: [result.graphic],
                                                        updateLocationEnabled: false
                                                    });
                                                }
                                                else { // fixed
                                                    view.popup = null;
                                                    feature_1.graphic = result.graphic;
                                                    highlight_1 = featureLayerView && featureLayerView.highlight(result.graphic);
                                                    view.ui.add(feature_1, hoverPopupPosition);
                                                }
                                            });
                                        }
                                        else {
                                            // Are we hovered over the  popup? If so don't close
                                            if (!overPopup_1) {
                                                if (hoverPopupType === "floating") {
                                                    view.popup.close();
                                                }
                                                else {
                                                    feature_1.graphic = null;
                                                    view.ui.remove(feature_1);
                                                }
                                            }
                                        }
                                    });
                                }, 85);
                            });
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addTime = function (view) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var widgets, time, moment, modules, _b, TimeSlider, TimeExtent, fullTimeExtent, _c, stopInterval, stopDelay, numThumbs, numStops, _d, timeLoop, timeVisible, timePosition, timeExpandAtStart, timeEffect, liveData, durationTime, durationPeriod, _e, includedEffect_1, excludedEffect_1, stops, mode, timeSlider_1, layerViews_1, expand, hideSliderBar, container;
                var _this = this;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            widgets = view.map.widgets;
                            time = this.base.config.time;
                            if (!time) return [3 /*break*/, 3];
                            if (!((_a = widgets) === null || _a === void 0 ? void 0 : _a.timeSlider)) return [3 /*break*/, 3];
                            return [4 /*yield*/, new Promise(function (resolve_11, reject_11) { require(["moment/moment"], resolve_11, reject_11); }).then(__importStar)];
                        case 1:
                            moment = _f.sent();
                            return [4 /*yield*/, promiseUtils_1.eachAlways([new Promise(function (resolve_12, reject_12) { require(["esri/widgets/TimeSlider"], resolve_12, reject_12); }).then(__importStar), new Promise(function (resolve_13, reject_13) { require(["esri/TimeExtent"], resolve_13, reject_13); }).then(__importStar)])];
                        case 2:
                            modules = _f.sent();
                            _b = modules.map(function (module) { return module.value; }), TimeSlider = _b[0], TimeExtent = _b[1];
                            fullTimeExtent = widgets.timeSlider.fullTimeExtent;
                            _c = widgets.timeSlider, stopInterval = _c.stopInterval, stopDelay = _c.stopDelay, numThumbs = _c.numThumbs, numStops = _c.numStops;
                            _d = this.base.config, timeLoop = _d.timeLoop, timeVisible = _d.timeVisible, timePosition = _d.timePosition, timeExpandAtStart = _d.timeExpandAtStart, timeEffect = _d.timeEffect, liveData = _d.liveData, durationTime = _d.durationTime, durationPeriod = _d.durationPeriod;
                            _e = this.base.config, includedEffect_1 = _e.includedEffect, excludedEffect_1 = _e.excludedEffect;
                            // Overwrite time extent if specified 
                            if (liveData) {
                                if (durationTime <= 0) {
                                    console.log("Invalid duration specified " + durationTime);
                                }
                                else {
                                    // set startTime to the current date/time 
                                    fullTimeExtent = new TimeExtent.default({
                                        start: new Date(),
                                        end: moment.default().add(durationTime, durationPeriod).toDate()
                                    });
                                    this.base.config.timeMode = "cumulative-from-start";
                                }
                            }
                            view.timeExtent = fullTimeExtent;
                            stops = null;
                            if (numStops) {
                                stops = {
                                    count: numStops
                                };
                            }
                            else if (stopInterval) {
                                stops = {
                                    interval: {
                                        unit: stopInterval.unit,
                                        value: stopInterval.value
                                    }
                                };
                            }
                            mode = this.base.config.timeMode;
                            if (numThumbs < 2) {
                                mode = "cumulative-from-start";
                            }
                            if (excludedEffect_1) {
                                switch (excludedEffect_1) {
                                    case "gray":
                                        excludedEffect_1 = "grayscale(100%) opacity(30%)";
                                        break;
                                    case "sepia":
                                        excludedEffect_1 = "sepia(90%)";
                                        break;
                                    case "opacity":
                                        excludedEffect_1 = "opacity(80%)";
                                        break;
                                    case "null":
                                        excludedEffect_1 = null;
                                        break;
                                }
                            }
                            if (includedEffect_1) {
                                switch (includedEffect_1) {
                                    case "saturate":
                                        includedEffect_1 = "saturate(1500%)";
                                        break;
                                    case "contrast":
                                        includedEffect_1 = "contrast(1.75)";
                                        break;
                                    case "brightness":
                                        includedEffect_1 = "brightness(1.75)";
                                        break;
                                    case "null":
                                        includedEffect_1 = null;
                                }
                            }
                            timeSlider_1 = new TimeSlider.default({
                                view: timeEffect && (includedEffect_1 || excludedEffect_1) ? null : view,
                                fullTimeExtent: fullTimeExtent,
                                mode: mode,
                                timeVisible: timeVisible,
                                playRate: stopDelay ? stopDelay : 1000,
                                loop: timeLoop,
                                stops: stops,
                                container: document.createElement("div")
                            });
                            // If a filter and effects are specified apply them 
                            // to the layers 
                            if (timeEffect && (includedEffect_1 || excludedEffect_1)) {
                                layerViews_1 = [];
                                view.map.layers.forEach(function (layer) { return __awaiter(_this, void 0, void 0, function () {
                                    var timeLayer;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!layer.timeInfo) return [3 /*break*/, 2];
                                                return [4 /*yield*/, view.whenLayerView(layer)];
                                            case 1:
                                                timeLayer = _a.sent();
                                                timeLayer.effect = {
                                                    filter: {
                                                        timeExtent: timeSlider_1.timeExtent,
                                                        geometry: view.extent
                                                    },
                                                    includedEffect: includedEffect_1,
                                                    excludedEffect: excludedEffect_1
                                                };
                                                layerViews_1.push(timeLayer);
                                                _a.label = 2;
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                timeSlider_1.watch("timeExtent", function (value) {
                                    // set time extent to time aware layer views 
                                    layerViews_1 && layerViews_1.forEach(function (lv) {
                                        lv.effect = {
                                            filter: {
                                                timeExtent: timeSlider_1.timeExtent,
                                                geometry: view.extent
                                            },
                                            includedEffect: includedEffect_1,
                                            excludedEffect: excludedEffect_1
                                        };
                                    });
                                });
                            }
                            expand = new Expand_1.default({
                                view: view,
                                mode: "floating",
                                expandTooltip: timeSlider_1.label,
                                group: timePosition.indexOf("bottom") !== -1 ? "bottom" : "top",
                                content: timeSlider_1,
                                expanded: timeExpandAtStart
                            });
                            view.ui.add(expand, timePosition);
                            hideSliderBar = this.base.config.hideSliderBar;
                            container = expand.container;
                            if (hideSliderBar) {
                                container.classList.add("no-slider");
                            }
                            _f.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addLocate = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, locate, locatePosition, Locate, locateWidget;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.base.config, locate = _a.locate, locatePosition = _a.locatePosition;
                            if (!locate) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve_14, reject_14) { require(["esri/widgets/Locate"], resolve_14, reject_14); }).then(__importStar)];
                        case 1:
                            Locate = _b.sent();
                            if (!Locate) {
                                return [2 /*return*/];
                            }
                            locateWidget = new Locate.default({
                                view: view
                            });
                            view.ui.add(locateWidget, locatePosition);
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addBookmarks = function (view) {
            var _a, _b, _c, _d, _e;
            return __awaiter(this, void 0, void 0, function () {
                var _f, bookmarks, bookmarksPosition, map, hasBookmarks, modules, _g, Bookmarks, Slides, bookmarkExpand;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _f = this.base.config, bookmarks = _f.bookmarks, bookmarksPosition = _f.bookmarksPosition;
                            if (!bookmarks) return [3 /*break*/, 2];
                            map = void 0;
                            if (view.type === "2d") {
                                map = view.map;
                            }
                            else {
                                map = view.map;
                            }
                            hasBookmarks = view.type === "3d" ? (_c = (_b = (_a = map) === null || _a === void 0 ? void 0 : _a.presentation) === null || _b === void 0 ? void 0 : _b.slides) === null || _c === void 0 ? void 0 : _c.length : (_e = (_d = map) === null || _d === void 0 ? void 0 : _d.bookmarks) === null || _e === void 0 ? void 0 : _e.length;
                            if (!hasBookmarks) return [3 /*break*/, 2];
                            return [4 /*yield*/, promiseUtils_1.eachAlways([new Promise(function (resolve_15, reject_15) { require(["esri/widgets/Bookmarks"], resolve_15, reject_15); }).then(__importStar), new Promise(function (resolve_16, reject_16) { require(["./Components/Slides"], resolve_16, reject_16); }).then(__importStar)])];
                        case 1:
                            modules = _h.sent();
                            _g = modules.map(function (module) { return module.value; }), Bookmarks = _g[0], Slides = _g[1];
                            if (!Bookmarks && !Slides) {
                                return [2 /*return*/];
                            }
                            bookmarkExpand = new Expand_1.default({
                                view: view,
                                content: view.type === "3d" ? new Slides({ view: view }) : new Bookmarks.default({ view: view }),
                                group: bookmarksPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
                                mode: view.widthBreakpoint !== "xsmall" ? "floating" : "drawer",
                                expandTooltip: i18n.widgets.bookmark.label
                            });
                            view.ui.add(bookmarkExpand, bookmarksPosition);
                            _h.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addPrint = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, printPosition, print, Print, printWidget, printExpand;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.base.config, printPosition = _a.printPosition, print = _a.print;
                            if (!print) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve_17, reject_17) { require(["esri/widgets/Print"], resolve_17, reject_17); }).then(__importStar)];
                        case 1:
                            Print = _b.sent();
                            if (!Print) {
                                return [2 /*return*/];
                            }
                            printWidget = new Print.default({
                                view: view,
                                printServiceUrl: this.base.portal.helperServices.printTask.url
                            });
                            printExpand = new Expand_1.default({
                                view: view,
                                group: printPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
                                mode: "floating",
                                expandTooltip: printWidget.label,
                                content: printWidget
                            });
                            view.ui.add(printExpand, printPosition);
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addBasemap = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, basemapToggle, basemapTogglePosition, BasemapToggle, basemapToggleAltBasemap, nextBasemap;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.base.config, basemapToggle = _a.basemapToggle, basemapTogglePosition = _a.basemapTogglePosition;
                            if (!basemapToggle) return [3 /*break*/, 3];
                            return [4 /*yield*/, new Promise(function (resolve_18, reject_18) { require(["esri/widgets/BasemapToggle"], resolve_18, reject_18); }).then(__importStar)];
                        case 1:
                            BasemapToggle = _b.sent();
                            if (!BasemapToggle) {
                                return [2 /*return*/];
                            }
                            basemapToggleAltBasemap = this.base.config.basemapToggleAltBasemap;
                            return [4 /*yield*/, this._getBasemap(basemapToggleAltBasemap)];
                        case 2:
                            nextBasemap = _b.sent();
                            view.ui.add(new BasemapToggle.default({
                                view: view,
                                nextBasemap: nextBasemap
                            }), basemapTogglePosition);
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addShare = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, share, shareIncludeEmbed, shareIncludeCopy, shareIncludeServices, sharePosition, modules, _b, Share, ShareFeatures, link, shareWidget;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this.base.config, share = _a.share, shareIncludeEmbed = _a.shareIncludeEmbed, shareIncludeCopy = _a.shareIncludeCopy, shareIncludeServices = _a.shareIncludeServices, sharePosition = _a.sharePosition;
                            if (!share) return [3 /*break*/, 2];
                            return [4 /*yield*/, promiseUtils_1.eachAlways([new Promise(function (resolve_19, reject_19) { require(["./Components/Share/Share"], resolve_19, reject_19); }).then(__importStar), new Promise(function (resolve_20, reject_20) { require(["./Components/Share/Share/ShareFeatures"], resolve_20, reject_20); }).then(__importStar)])];
                        case 1:
                            modules = _c.sent();
                            _b = modules.map(function (module) { return module.value; }), Share = _b[0], ShareFeatures = _b[1];
                            if (!Share || !ShareFeatures) {
                                return [2 /*return*/];
                            }
                            link = document.createElement("link");
                            link.setAttribute("rel", "stylesheet");
                            link.setAttribute("type", "text/css");
                            link.setAttribute("href", "./app/Components/Share/css/Share.css");
                            document.getElementsByTagName("head")[0].appendChild(link);
                            shareWidget = new Share.default({
                                view: view,
                                container: document.createElement('div'),
                                shareFeatures: new ShareFeatures.default({
                                    embedMap: shareIncludeEmbed,
                                    shareServices: shareIncludeServices,
                                    copyToClipboard: shareIncludeCopy
                                })
                            });
                            view.ui.add(shareWidget, sharePosition);
                            _c.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addLayerList = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, layerList, layerListAddLegend, layerListOpenAtStart, layerListPosition, layerListShowLegendOnLoad, LayerList, layerList_1, layerExpand;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.base.config, layerList = _a.layerList, layerListAddLegend = _a.layerListAddLegend, layerListOpenAtStart = _a.layerListOpenAtStart, layerListPosition = _a.layerListPosition, layerListShowLegendOnLoad = _a.layerListShowLegendOnLoad;
                            if (!layerList) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve_21, reject_21) { require(["esri/widgets/LayerList"], resolve_21, reject_21); }).then(__importStar)];
                        case 1:
                            LayerList = _b.sent();
                            if (!LayerList) {
                                return [2 /*return*/];
                            }
                            layerList_1 = new LayerList.default({
                                view: view,
                                container: document.createElement("div")
                            });
                            if (layerListAddLegend) {
                                layerList_1.listItemCreatedFunction = function (evt) {
                                    var item = evt.item;
                                    item.panel = {
                                        content: "legend",
                                        open: layerListShowLegendOnLoad
                                    };
                                };
                            }
                            layerExpand = new Expand_1.default({
                                group: layerListPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
                                view: view,
                                mode: "floating",
                                content: layerList_1,
                                expandTooltip: layerList_1.label
                            });
                            view.ui.add(layerExpand, layerListPosition);
                            if (layerListOpenAtStart) {
                                layerExpand.expand();
                            }
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addLegend = function (view) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, legend, legendStyle, legendPosition, legendOpenAtStart, Legend, legendWidget, legendExpand;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.base.config, legend = _a.legend, legendStyle = _a.legendStyle, legendPosition = _a.legendPosition, legendOpenAtStart = _a.legendOpenAtStart;
                            return [4 /*yield*/, new Promise(function (resolve_22, reject_22) { require(["esri/widgets/Legend"], resolve_22, reject_22); }).then(__importStar)];
                        case 1:
                            Legend = _b.sent();
                            if (!Legend) {
                                return [2 /*return*/];
                            }
                            legendWidget = new Legend.default({
                                view: view,
                                style: legendStyle === "default" || legendStyle === "classic" ? "classic" : "card",
                                container: document.createElement("div")
                            });
                            legendExpand = new Expand_1.default({
                                group: legendPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
                                view: view,
                                content: legendWidget,
                                mode: "floating",
                                expandTooltip: legend.label
                            });
                            view.ui.add(legendExpand, legendPosition);
                            if (legendOpenAtStart)
                                legendExpand.expand();
                            return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.addSearch = function (view) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var _c, search, searchConfig, searchPosition, searchOpenAtStart, modules, _d, Search, FeatureLayer_1, searchProperties, sources, enableSearchingAll, activeSourceIndex, search_1, searchExpand;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _c = this.base.config, search = _c.search, searchConfig = _c.searchConfig, searchPosition = _c.searchPosition, searchOpenAtStart = _c.searchOpenAtStart;
                            if (!search) return [3 /*break*/, 2];
                            return [4 /*yield*/, promiseUtils_1.eachAlways([new Promise(function (resolve_23, reject_23) { require(["esri/widgets/Search"], resolve_23, reject_23); }).then(__importStar), new Promise(function (resolve_24, reject_24) { require(["esri/layers/FeatureLayer"], resolve_24, reject_24); }).then(__importStar)])];
                        case 1:
                            modules = _e.sent();
                            _d = modules.map(function (module) { return module.value; }), Search = _d[0], FeatureLayer_1 = _d[1];
                            if (!Search && !FeatureLayer_1) {
                                return [2 /*return*/];
                            }
                            searchProperties = {
                                view: view,
                                container: document.createElement("div")
                            };
                            // Get any configured search settings
                            if (searchConfig) {
                                if (searchConfig.sources) {
                                    sources = searchConfig.sources;
                                    searchProperties.sources = sources.filter(function (source) {
                                        if (source.flayerId && source.url) {
                                            var layer = view.map.findLayerById(source.flayerId);
                                            source.layer = layer ? layer : new FeatureLayer_1(source.url);
                                        }
                                        if (source.hasOwnProperty("enableSuggestions")) {
                                            source.suggestionsEnabled = source.enableSuggestions;
                                        }
                                        if (source.hasOwnProperty("searchWithinMap")) {
                                            source.withinViewEnabled = source.searchWithinMap;
                                        }
                                        return source;
                                    });
                                }
                                if (((_b = (_a = searchProperties) === null || _a === void 0 ? void 0 : _a.sources) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                                    searchProperties.includeDefaultSources = false;
                                }
                                enableSearchingAll = searchConfig.enableSearchingAll, activeSourceIndex = searchConfig.activeSourceIndex;
                                searchProperties.searchAllEnabled = (enableSearchingAll) ? true : false;
                                if (activeSourceIndex && searchProperties.sources && searchProperties.sources.length >= activeSourceIndex) {
                                    searchProperties.activeSourceIndex = activeSourceIndex;
                                }
                            }
                            search_1 = new Search.default(searchProperties);
                            searchExpand = new Expand_1.default({
                                group: searchPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
                                view: view,
                                content: search_1,
                                mode: "floating",
                                expandTooltip: search_1.label
                            });
                            view.ui.add(searchExpand, searchPosition);
                            if (searchOpenAtStart) {
                                searchExpand.expand();
                            }
                            _e.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        return MapExample;
    }());
    return MapExample;
});
//# sourceMappingURL=Main.js.map