/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
import { declared, property, subclass } from "esri/core/accessorSupport/decorators";

import Accessor = require("esri/core/Accessor");
import HandleRegistry = require("esri/core/Handles");
import promiseUtils = require("esri/core/promiseUtils");
import watchUtils = require("esri/core/watchUtils");


import Collection = require("esri/core/Collection");
import SlideItem = require("./SlideItem");

import SceneView = require("esri/views/SceneView");


const SlideItemCollection = Collection.ofType<SlideItem>(SlideItem);

type State = "ready" | "loading" | "disabled";

@subclass("app.SlidesViewModel")
class SlidesViewModel extends declared(Accessor) {

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------
  initialize() {
    this._handles.add(
      watchUtils.init(this, "view", view => this._viewUpdated(view))
    );
  }

  destroy() {
    this._handles.destroy();
    this._handles = null;
    this.view = null;
    this.bookmarkItems.removeAll();
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------
  private _handles: HandleRegistry = new HandleRegistry();

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------
  //----------------------------------
  //  bookmarkItems
  //----------------------------------
  @property({
    type: SlideItemCollection
  })
  bookmarkItems: Collection<SlideItem> = new SlideItemCollection;

  //----------------------------------
  //  state
  //----------------------------------
  @property({
    dependsOn: ["view.ready"],
    readOnly: true
  })
  get state(): State {
    const view = this.get("view");
    const ready = this.get("view.ready");
    return ready ? "ready" :
      view ? "loading" : "disabled";
  }

  //----------------------------------
  //  view
  //----------------------------------
  @property()
  view: SceneView = null;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------
  async goTo(bookmarkItem: SlideItem) {
    const { view } = this;

    if (!bookmarkItem) {
      return promiseUtils.reject(new Error("BookmarkItem is required"));
    }

    if (!view) {
      return promiseUtils.reject(new Error("View is required"));
    }

    bookmarkItem.active = true;

    const slide = bookmarkItem.slide;
    try {
      const applied = await slide.applyTo(view);

      bookmarkItem.active = false;

      return;

    } catch (error) {
      bookmarkItem.active = false;
      return;
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------
  private _viewUpdated(view: SceneView): void {
    const { _handles } = this;
    const mapHandleKey = "map";

    _handles.remove(mapHandleKey);

    if (!view) {
      return;
    }

    view.when(() => {
      _handles.add(
        watchUtils.init(view, "map", map => this._mapUpdated(<__esri.WebScene>map))
        , mapHandleKey);
    });
  }

  private _mapUpdated(map: __esri.WebScene): void {
    if (!map) {
      return;
    }
    const { bookmarkItems } = this;
    bookmarkItems.removeAll();
    const slides = map.presentation.slides;
    slides.forEach((slide) => {
      bookmarkItems.add(new SlideItem({
        slide,
        name: slide.title.text
      }))
    });
  }

}

export = SlidesViewModel;
