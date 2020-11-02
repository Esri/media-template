var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/core/Accessor", "esri/core/Handles", "esri/core/promiseUtils", "esri/core/watchUtils", "esri/core/Collection", "./SlideItem"], function (require, exports, __extends, __decorate, decorators_1, Accessor, HandleRegistry, promiseUtils, watchUtils, Collection, SlideItem) {
    "use strict";
    var SlideItemCollection = Collection.ofType(SlideItem);
    var SlidesViewModel = /** @class */ (function (_super) {
        __extends(SlidesViewModel, _super);
        function SlidesViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            //--------------------------------------------------------------------------
            //
            //  Variables
            //
            //--------------------------------------------------------------------------
            _this._handles = new HandleRegistry();
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  bookmarkItems
            //----------------------------------
            _this.bookmarkItems = new SlideItemCollection;
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            return _this;
        }
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        SlidesViewModel.prototype.initialize = function () {
            var _this = this;
            this._handles.add(watchUtils.init(this, "view", function (view) { return _this._viewUpdated(view); }));
        };
        SlidesViewModel.prototype.destroy = function () {
            this._handles.destroy();
            this._handles = null;
            this.view = null;
            this.bookmarkItems.removeAll();
        };
        Object.defineProperty(SlidesViewModel.prototype, "state", {
            //----------------------------------
            //  state
            //----------------------------------
            get: function () {
                var view = this.get("view");
                var ready = this.get("view.ready");
                return ready ? "ready" :
                    view ? "loading" : "disabled";
            },
            enumerable: false,
            configurable: true
        });
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        SlidesViewModel.prototype.goTo = function (bookmarkItem) {
            return __awaiter(this, void 0, void 0, function () {
                var view, slide, applied, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            view = this.view;
                            if (!bookmarkItem) {
                                return [2 /*return*/, promiseUtils.reject(new Error("BookmarkItem is required"))];
                            }
                            if (!view) {
                                return [2 /*return*/, promiseUtils.reject(new Error("View is required"))];
                            }
                            bookmarkItem.active = true;
                            slide = bookmarkItem.slide;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, slide.applyTo(view)];
                        case 2:
                            applied = _a.sent();
                            bookmarkItem.active = false;
                            return [2 /*return*/];
                        case 3:
                            error_1 = _a.sent();
                            bookmarkItem.active = false;
                            return [2 /*return*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        SlidesViewModel.prototype._viewUpdated = function (view) {
            var _this = this;
            var _handles = this._handles;
            var mapHandleKey = "map";
            _handles.remove(mapHandleKey);
            if (!view) {
                return;
            }
            view.when(function () {
                _handles.add(watchUtils.init(view, "map", function (map) { return _this._mapUpdated(map); }), mapHandleKey);
            });
        };
        SlidesViewModel.prototype._mapUpdated = function (map) {
            if (!map) {
                return;
            }
            var bookmarkItems = this.bookmarkItems;
            bookmarkItems.removeAll();
            var slides = map.presentation.slides;
            slides.forEach(function (slide) {
                bookmarkItems.add(new SlideItem({
                    slide: slide,
                    name: slide.title.text
                }));
            });
        };
        __decorate([
            decorators_1.property({
                type: SlideItemCollection
            })
        ], SlidesViewModel.prototype, "bookmarkItems", void 0);
        __decorate([
            decorators_1.property({
                dependsOn: ["view.ready"],
                readOnly: true
            })
        ], SlidesViewModel.prototype, "state", null);
        __decorate([
            decorators_1.property()
        ], SlidesViewModel.prototype, "view", void 0);
        SlidesViewModel = __decorate([
            decorators_1.subclass("app.SlidesViewModel")
        ], SlidesViewModel);
        return SlidesViewModel;
    }(decorators_1.declared(Accessor)));
    return SlidesViewModel;
});
//# sourceMappingURL=SlideViewModel.js.map