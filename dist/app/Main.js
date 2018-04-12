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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
define(["require", "exports", "dojo/i18n!./nls/resources", "ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper", "esri/Graphic", "esri/views/MapView", "esri/widgets/Expand", "esri/core/requireUtils"], function (require, exports, i18n, itemUtils_1, domHelper_1, Graphic, MapView, Expand, requireUtils) {
    "use strict";
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
            if (!base) {
                console.error("ApplicationBase is not defined");
                return;
            }
            domHelper_1.setPageLocale(base.locale);
            domHelper_1.setPageDirection(base.direction);
            this.base = base;
            var config = base.config, results = base.results, settings = base.settings;
            var find = config.find, marker = config.marker;
            var webMapItems = results.webMapItems;
            var validWebMapItems = webMapItems.map(function (response) {
                return response.value;
            });
            var firstItem = validWebMapItems[0];
            if (!firstItem) {
                console.error("Could not load an item to display");
                return;
            }
            config.title = !this.base.config.title ? itemUtils_1.getItemTitle(firstItem) : "";
            domHelper_1.setPageTitle(this.base.config.title);
            if (this.base.config.customstyle) {
                var style = document.createElement("style");
                style.appendChild(document.createTextNode(this.base.config.customstyle));
                document.head.appendChild(style);
            }
            var portalItem = this.base.results.applicationItem.value;
            // setup splash modal
            if (this.base.config.splash) {
                window.calcite.modal();
                document.getElementById("splash-button").innerHTML = this.base.config.splashButtonText;
                document.getElementById("splash-title").innerHTML = this.base.config.splashTitle;
                document.getElementById("splash-content").innerHTML = this.base.config.splashContent;
                window.calcite.bus.emit("modal:open", "splash-modal");
                window.calcite.bus.emit("modal:bind");
            }
            var appProxies = portalItem && portalItem.appProxies ? portalItem.appProxies : null;
            var viewContainerNode = document.getElementById("viewContainer");
            // Get url properties like center, extent, zoom
            var defaultViewProperties = itemUtils_1.getConfigViewProperties(config);
            validWebMapItems.forEach(function (item) {
                var viewNode = document.createElement("div");
                viewContainerNode.appendChild(viewNode);
                var viewProperties = __assign({ container: viewNode }, defaultViewProperties);
                var basemapUrl = config.basemapUrl, basemapReferenceUrl = config.basemapReferenceUrl;
                itemUtils_1.createMapFromItem({ item: item, appProxies: appProxies }).then(function (map) {
                    return itemUtils_1.createView(__assign({}, viewProperties, { map: map }))
                        .then(function (view) {
                        _this.view = view;
                        if (_this.base.config.mapZoom &&
                            _this.base.config.mapZoomPosition !== "top-left") {
                            _this.view.ui.move("zoom", _this.base.config.mapZoomPosition);
                        }
                        else if (!_this.base.config.mapZoom) {
                            _this.view.ui.remove("zoom");
                        }
                        if (_this.base.config.viewMinScale) {
                            _this.view.constraints.minScale = _this.base.config.viewMinScale;
                        }
                        if (_this.base.config.viewMaxScale) {
                            _this.view.constraints.maxScale = _this.base.config.viewMaxScale;
                        }
                        if (_this.base.config.highlightColor) {
                            _this.view.highlightOptions.color = _this.base.config
                                .highlightColor;
                        }
                        if (_this.base.config.highlightFillOpacity) {
                            _this.view.highlightOptions.fillOpacity = _this.base.config.highlightFillOpacity;
                        }
                        if (_this.base.config.highlightHaloOpacity) {
                            _this.view.highlightOptions.haloOpacity = _this.base.config.highlightHaloOpacity;
                        }
                        // Disable map scroll and add overlay explaining how to do it depending on touch device or not
                        if (_this.base.config.disableScroll) {
                            var scrollMessage = document.getElementById("scrollMessage");
                            scrollMessage.innerHTML = i18n.scroll.instructions;
                            var eventType = "ontouchstart" in document.documentElement
                                ? "drag"
                                : "mouse-wheel";
                            _this.view.on(eventType, function (e) {
                                _this.handleScroll(e);
                            });
                        }
                        _this.addDetails(item);
                        _this.applySharedTheme();
                        _this.addWidgets();
                    })
                        .then(function () {
                        return itemUtils_1.findQuery(find, _this.view).then(function () { return itemUtils_1.goToMarker(marker, _this.view); });
                    });
                });
            });
            document.body.classList.remove(CSS.loading);
        };
        MapExample.prototype.applySharedTheme = function () {
            // For now just to the text panel
            if (this.base.portal &&
                this.base.portal.portalProperties &&
                this.base.portal.portalProperties.sharedTheme) {
                var styles = [];
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
        MapExample.prototype.handleScroll = function (evt) {
            evt.stopPropagation();
            // focus the view so its ready for +/-
            this.view.focus();
            var scroller = document.getElementById("scroller");
            if (!scroller.classList.contains("is-active")) {
                scroller.classList.add("is-active");
                setTimeout(function () {
                    // after small delay remove the message
                    scroller.classList.remove("is-active");
                }, 2000);
            }
        };
        MapExample.prototype.addDetails = function (item) {
            //TODO add shared theming colors
            var _this = this;
            if (this.base.config.details) {
                var title = this.base.config.detailsTitle || item.title;
                var panelText = this.base.config.detailsContent;
                if (!panelText) {
                    panelText = item.snippet || item.description || "";
                }
                var panel_1 = document.createElement("div");
                panel_1.style.backgroundColor = this.base.config.detailsBackgroundColor;
                panel_1.style.color = this.base.config.detailsTextColor;
                panel_1.classList.add("panel");
                panel_1.innerHTML = "<h4 class='trailer-half'>" + title + "</h4><p>" + panelText + "</p>";
                var expand_1 = new Expand({
                    content: "<h4 class='trailer-half'>" + title + "</h4><p>" + panelText + "</p>",
                    expandIconClass: "esri-icon-description",
                    view: this.view,
                    expandTooltip: "Info" // TODO I18n
                });
                var index = this.base.config.detailsIndex === "first" ? 0 : 4;
                var isSmall_1 = this.view.widthBreakpoint === "xsmall";
                var panelComponent_1 = {
                    component: isSmall_1 ? expand_1 : panel_1,
                    position: this.base.config.detailsPosition,
                    index: this.base.config.detailsIndex === "first" ? 0 : 20
                };
                this.view.ui.add(panelComponent_1);
                // if the view is small put panel in info button
                this.view.watch("widthBreakpoint", function (breakpoint) {
                    isSmall_1 = breakpoint === "xsmall";
                    _this.view.ui.remove(isSmall_1 ? panel_1 : expand_1);
                    panelComponent_1.component = isSmall_1 ? expand_1 : panel_1;
                    _this.view.ui.add(panelComponent_1);
                });
            }
        };
        MapExample.prototype.addWidgets = function () {
            return __awaiter(this, void 0, void 0, function () {
                var webmap, bookmarks, bookmarksRequire, Bookmarks, head, link, bookmarkWidget, bookmarkExpand, fullScreenRequire, Fullscreen, full, homeRequire, Home, home, legendRequire, Legend, legend, legendExpand, searchRequire, Search, search, searchExpand, basemapRequire, BasemapToggle, basemapToggle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.base.config.bookmarks) return [3 /*break*/, 2];
                            webmap = this.view.map;
                            bookmarks = webmap.bookmarks;
                            if (!(bookmarks && bookmarks.length && bookmarks.length > 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, requireUtils.when(require, [
                                    "Custom/Bookmarks"
                                ])];
                        case 1:
                            bookmarksRequire = _a.sent();
                            Bookmarks = bookmarksRequire[0];
                            head = document.getElementsByTagName('head')[0];
                            link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.type = 'text/css';
                            link.href = 'styles/Bookmarks.min.css';
                            head.appendChild(link);
                            bookmarkWidget = new Bookmarks({
                                view: this.view
                            });
                            bookmarkExpand = new Expand({
                                view: this.view,
                                content: bookmarkWidget,
                                expandTooltip: "Bookmarks" // todo I18n
                            });
                            this.view.ui.add(bookmarkExpand, this.base.config.bookmarksPosition);
                            _a.label = 2;
                        case 2:
                            if (this.base.config.inset) {
                                this.createOverviewMap();
                            }
                            if (!this.base.config.fullscreen) return [3 /*break*/, 4];
                            return [4 /*yield*/, requireUtils.when(require, [
                                    "esri/widgets/Fullscreen"
                                ])];
                        case 3:
                            fullScreenRequire = _a.sent();
                            Fullscreen = fullScreenRequire[0];
                            full = new Fullscreen({
                                view: this.view
                            });
                            this.view.ui.add(full, this.base.config.fullscreenPosition);
                            _a.label = 4;
                        case 4:
                            if (!this.base.config.home) return [3 /*break*/, 6];
                            return [4 /*yield*/, requireUtils.when(require, [
                                    "esri/widgets/Home"
                                ])];
                        case 5:
                            homeRequire = _a.sent();
                            Home = homeRequire[0];
                            home = new Home({
                                view: this.view
                            });
                            this.view.ui.add(home, this.base.config.homePosition);
                            _a.label = 6;
                        case 6:
                            if (!this.base.config.legend) return [3 /*break*/, 8];
                            return [4 /*yield*/, requireUtils.when(require, [
                                    "esri/widgets/Legend"
                                ])];
                        case 7:
                            legendRequire = _a.sent();
                            Legend = legendRequire[0];
                            legend = new Legend({
                                view: this.view,
                                container: document.createElement("div")
                            });
                            legendExpand = new Expand({
                                expandIconClass: "esri-icon-layer-list",
                                view: this.view,
                                content: legend.container,
                                expandTooltip: "Legend" // TODO i18n
                            });
                            this.view.ui.add(legendExpand, this.base.config.legendPosition);
                            if (this.base.config.legendOpenAtStart) {
                                legendExpand.expand();
                            }
                            _a.label = 8;
                        case 8:
                            if (!this.base.config.search) return [3 /*break*/, 10];
                            return [4 /*yield*/, requireUtils.when(require, [
                                    "esri/widgets/Search"
                                ])];
                        case 9:
                            searchRequire = _a.sent();
                            Search = searchRequire[0];
                            search = new Search({
                                view: this.view,
                                container: document.createElement("div")
                            });
                            searchExpand = new Expand({
                                expandIconClass: "esri-icon-search",
                                view: this.view,
                                content: search.container,
                                expandTooltip: "Search" // TODO i18n
                            });
                            this.view.ui.add(searchExpand, this.base.config.searchPosition);
                            if (this.base.config.searchOpenAtStart) {
                                searchExpand.expand();
                            }
                            _a.label = 10;
                        case 10:
                            if (!this.base.config.basemapToggle) return [3 /*break*/, 12];
                            return [4 /*yield*/, requireUtils.when(require, [
                                    "esri/widgets/BasemapToggle"
                                ])];
                        case 11:
                            basemapRequire = _a.sent();
                            BasemapToggle = basemapRequire[0];
                            basemapToggle = new BasemapToggle({
                                view: this.view,
                                nextBasemap: this.base.config.basemapToggleAltBasemap
                            });
                            this.view.ui.add(basemapToggle, this.base.config.basemapTogglePosition);
                            _a.label = 12;
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype.createGraphic = function (insetView) {
            insetView.graphics.removeAll();
            if (this.view && this.view.extent) {
                var graphic = new Graphic({
                    geometry: this.view.extent,
                    symbol: {
                        type: "simple-fill",
                        color: [160, 160, 160, 0.2],
                        outline: {
                            color: [100, 100, 100, 0]
                        }
                    }
                });
                var goToParams = {
                    target: graphic.geometry.extent.center
                };
                if (this.base.config.insetScale) {
                    goToParams.scale = this.base.config.insetScale;
                }
                else {
                    insetView.graphics.add(graphic);
                    goToParams.zoom = this.view.zoom > 4 ? this.view.zoom - 4 : 0;
                }
                insetView.goTo(goToParams);
            }
        };
        MapExample.prototype.createOverviewMap = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var mapRequire, Map, map, insetDiv, insetView;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, requireUtils.when(require, ["esri/Map"])];
                        case 1:
                            mapRequire = _a.sent();
                            Map = mapRequire[0];
                            map = new Map({
                                basemap: this.base.config.insetBasemap || this.view.map.basemap
                            });
                            insetDiv = document.createElement("div");
                            insetDiv.classList.add("inset-map");
                            insetView = new MapView({
                                map: map,
                                ui: {
                                    components: []
                                },
                                container: insetDiv
                            });
                            this.view.ui.add(insetDiv, this.base.config.insetPosition);
                            return [4 /*yield*/, insetView.when()];
                        case 2:
                            _a.sent();
                            this.view.watch("extent", function () {
                                _this.createGraphic(insetView);
                            });
                            this.createGraphic(insetView);
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
        return MapExample;
    }());
    return MapExample;
});
