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

import ApplicationBase = require("ApplicationBase/ApplicationBase");

import i18n = require("dojo/i18n!./nls/resources");

const CSS = {
  loading: "configurable-application--loading"
};

import {
  createMapFromItem,
  createView,
  getConfigViewProperties,
  getItemTitle,
  findQuery,
  goToMarker
}
  from "ApplicationBase/support/itemUtils";

import {
  setPageLocale,
  setPageDirection,
  setPageTitle
} from "ApplicationBase/support/domHelper";

import {
  ApplicationConfig,
  ApplicationBaseSettings
} from "ApplicationBase/interfaces";

import Graphic = require("esri/Graphic");
import FeatureLayer = require("esri/layers/FeatureLayer");
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import Collection = require("esri/core/Collection");
import MapView = require("esri/views/MapView");

import Expand = require("esri/widgets/Expand");

import watchUtils = require("esri/core/watchUtils");
import requireUtils = require("esri/core/requireUtils");


declare var window: any;
class MapExample {
  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  ApplicationBase
  //----------------------------------
  base: ApplicationBase = null;
  view: MapView;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  public init(base: ApplicationBase): void {
    if (!base) {
      console.error("ApplicationBase is not defined");
      return;
    }
    setPageLocale(base.locale);
    setPageDirection(base.direction);

    this.base = base;

    const { config, results, settings } = base;
    const { find, marker } = config;
    const { webMapItems } = results;

    const validWebMapItems = webMapItems.map(response => {
      return response.value;
    });

    const firstItem = validWebMapItems[0];

    if (!firstItem) {
      console.error("Could not load an item to display");
      return;
    }

    config.title = !this.base.config.detailsTitle ? getItemTitle(firstItem) : this.base.config.detailsTitle;
    setPageTitle(config.title);

    if (this.base.config.customstyle) {
      const style = document.createElement("style");
      style.appendChild(document.createTextNode(this.base.config.customstyle));
      document.head.appendChild(style);
    }
    const portalItem: any = this.base.results.applicationItem.value;
    // setup splash modal
    if (this.base.config.splash) {
      window.calcite.modal();

      document.getElementById(
        "splash-button"
      ).innerHTML = this.base.config.splashButtonText;
      document.getElementById(
        "splash-title"
      ).innerHTML = this.base.config.splashTitle;
      document.getElementById(
        "splash-content"
      ).innerHTML = this.base.config.splashContent;
      window.calcite.bus.emit("modal:open", { id: "splash-modal" });
      window.calcite.bus.emit("modal:bind");
    }
    const appProxies =
      portalItem && portalItem.applicationProxies ? portalItem.applicationProxies : null;

    const viewContainerNode = document.getElementById("viewContainer");
    // Get url properties like center, extent, zoom
    const defaultViewProperties = getConfigViewProperties(config);

    validWebMapItems.forEach(item => {
      const viewNode = document.createElement("div");
      viewContainerNode.appendChild(viewNode);

      const viewProperties = {
        container: viewNode,
        ...defaultViewProperties
      };

      const { basemapUrl, basemapReferenceUrl } = config;
      createMapFromItem({ item, appProxies }).then(map =>
        createView({
          ...viewProperties,
          map
        })
          .then(view => {
            this.view = view as MapView;

            if (
              this.base.config.mapZoom &&
              this.base.config.mapZoomPosition !== "top-left"
            ) {
              this.view.ui.move("zoom", this.base.config.mapZoomPosition);
            } else if (!this.base.config.mapZoom) {
              this.view.ui.remove("zoom");
            }

            if (this.base.config.viewMinScale) {
              this.view.constraints.minScale = this.base.config.viewMinScale;
            }

            if (this.base.config.viewMaxScale) {
              this.view.constraints.maxScale = this.base.config.viewMaxScale;
            }
            if (this.base.config.highlightColor) {
              this.view.highlightOptions.color = this.base.config
                .highlightColor as any;
            }
            if (this.base.config.highlightFillOpacity) {
              this.view.highlightOptions.fillOpacity = this.base.config.highlightFillOpacity;
            }
            if (this.base.config.highlightHaloOpacity) {
              this.view.highlightOptions.haloOpacity = this.base.config.highlightHaloOpacity;
            }
            // Disable map scroll and add overlay explaining how to do it depending on touch device or not
            if (this.base.config.disableScroll) {
              const scrollMessage = document.getElementById(
                "scrollMessage"
              ) as HTMLDivElement;
              scrollMessage.innerHTML = i18n.scroll.instructions;

              const eventType =
                "ontouchstart" in document.documentElement
                  ? "drag"
                  : "mouse-wheel";
              this.view.on(eventType, e => {
                this.handleScroll(e);
              });
            }

            this.addDetails(item);
            this.applySharedTheme();
            this.addWidgets();
          })
          .then(() =>
            findQuery(find, this.view).then(() => goToMarker(marker, this.view))
          )
      );
    });
    document.body.classList.remove(CSS.loading);
  }

  applySharedTheme() {
    // For now just to the text panel
    if (
      this.base.portal &&
      this.base.portal.portalProperties &&
      this.base.portal.portalProperties.sharedTheme
    ) {
      const styles = [];
      const theme = this.base.portal.portalProperties.sharedTheme;
      if (theme.body) {
        if (theme.body.background) {
          this.base.config.detailsBackgroundColor = theme.body.background;
        }
        if (theme.body.text) {
          this.base.config.detailsTextColor = theme.body.text;
        }
      }
    }
  }

  handleScroll(evt) {
    evt.stopPropagation();
    // focus the view so its ready for +/-
    this.view.focus();
    const scroller = document.getElementById("scroller");
    if (!scroller.classList.contains("is-active")) {
      scroller.classList.add("is-active");
      setTimeout(() => {
        // after small delay remove the message
        scroller.classList.remove("is-active");
      }, 2000);
    }
  }
  addDetails(item) {
    if (this.base.config.details) {
      const title = this.base.config.detailsTitle || item.title;

      let panelText = this.base.config.detailsContent;
      if (!panelText) {
        panelText = item.snippet || item.description || "";
      }
      const panel = document.createElement("div");

      panel.style.backgroundColor = this.base.config.detailsBackgroundColor;
      panel.style.color = this.base.config.detailsTextColor;
      panel.classList.add("panel");
      panel.innerHTML = `<h4 class='trailer-half'>${title}</h4><p>${panelText}</p>`;

      const expand = new Expand({
        content: `<div class="panel" style='min-width:200px;background-color:${this.base.config.detailsBackgroundColor};color:${this.base.config.detailsTextColor}'><h4 class='trailer-half'>${title}</h4><p>${panelText}</p></div>`,
        expandIconClass: "esri-icon-description",
        view: this.view,
        group: this.base.config.detailsPosition,
        expandTooltip: i18n.widgets.details.label
      });
      const index = this.base.config.detailsIndex === "first" ? 0 : 4;
      let isSmall = this.view.widthBreakpoint === "xsmall" || this.view.widthBreakpoint === "small" || this.view.widthBreakpoint === "medium";

      const panelComponent: __esri.UIAddComponent = {
        component: isSmall ? expand : panel,
        position: this.base.config.detailsPosition,
        index: this.base.config.detailsIndex === "first" ? 0 : 20
      };

      this.view.ui.add(panelComponent);

      // if the view is small, xsmall or medium put panel in info button
      this.view.watch("widthBreakpoint", breakpoint => {
        let isSmall = false;
        if (breakpoint === "xsmall" || breakpoint === "small" || breakpoint === "medium") {
          isSmall = true;
        }
        this.view.ui.remove(isSmall ? panel : expand);
        panelComponent.component = isSmall ? expand : panel;
        this.view.ui.add(panelComponent);
      });
    }
  }

  public async addWidgets() {
    if (this.base.config.bookmarks) {

      const webmap = this.view.map as __esri.WebMap;
      const bookmarks = webmap.bookmarks;
      if (bookmarks && bookmarks.length && bookmarks.length > 0) {
        const bookmarksRequire = await requireUtils.when(require, [
          "esri/widgets/Bookmarks"
        ]);
        const Bookmarks = bookmarksRequire[0];

        const bookmarkWidget = new Bookmarks({
          view: this.view,
          bookmarks: bookmarks
        });
        const bookmarkExpand = new Expand({
          view: this.view,
          content: bookmarkWidget,
          group: this.base.config.bookmarksPosition//,
          // expandTooltip: Bookmarks//i18n.widgets.bookmark.label
        });

        this.view.ui.add(bookmarkExpand, this.base.config.bookmarksPosition);
      }
    }

    if (this.base.config.inset) {
      this.createOverviewMap();
    }
    if (this.base.config.fullscreen) {
      const fullScreenRequire = await requireUtils.when(require, [
        "esri/widgets/Fullscreen"
      ]);
      const Fullscreen = fullScreenRequire[0];
      const full = new Fullscreen({
        view: this.view
      });
      this.view.ui.add(full, this.base.config.fullscreenPosition);
    }
    if (this.base.config.home) {
      const homeRequire = await requireUtils.when(require, [
        "esri/widgets/Home"
      ]);
      const Home = homeRequire[0];
      const home = new Home({
        view: this.view
      });
      this.view.ui.add(home, this.base.config.homePosition);
    }
    if (this.base.config.legend) {
      const legendRequire = await requireUtils.when(require, [
        "esri/widgets/Legend"
      ]);
      const Legend = legendRequire[0];

      const legend = new Legend({
        view: this.view,
        style: this.base.config.legendStyle === "default" || this.base.config.legendStyle === "classic" ? "classic" : "card",
        container: document.createElement("div")
      });

      const legendExpand = new Expand({
        expandIconClass: "esri-icon-layer-list",
        group: this.base.config.legendPosition,
        view: this.view,
        content: legend.container,
        expandTooltip: legend.label
      });

      this.view.ui.add(legendExpand, this.base.config.legendPosition);
      if (this.base.config.legendOpenAtStart) {
        legendExpand.expand();
      }
    }
    if (this.base.config.search) {
      const searchRequire = await requireUtils.when(require, [
        "esri/widgets/Search"
      ]);
      const Search = searchRequire[0];

      const search = new Search({
        view: this.view,
        container: document.createElement("div")
      });
      const searchExpand = new Expand({
        expandIconClass: "esri-icon-search",
        group: this.base.config.searchPosition,
        view: this.view,
        content: search.container,
        expandTooltip: search.label
      });

      this.view.ui.add(searchExpand, this.base.config.searchPosition);
      if (this.base.config.searchOpenAtStart) {
        searchExpand.expand();
      }
    }
    if (this.base.config.basemapToggle) {
      const basemapRequire = await requireUtils.when(require, [
        "esri/widgets/BasemapToggle"
      ]);
      const BasemapToggle = basemapRequire[0];

      const basemapToggle = new BasemapToggle({
        view: this.view,
        nextBasemap: this.base.config.basemapToggleAltBasemap
      });

      this.view.ui.add(basemapToggle, this.base.config.basemapTogglePosition);
    }
  }
  createGraphic(insetView: MapView) {
    insetView.graphics.removeAll();
    if (this.view && this.view.extent) {
      const graphic = new Graphic({
        geometry: this.view.extent,
        symbol: {
          type: "simple-fill",
          color: [160, 160, 160, 0.2],
          outline: {
            color: [100, 100, 100, 0]
          }
        }
      });

      const goToParams: any = {
        target: graphic.geometry.extent.center
      };
      if (this.base.config.insetScale) {
        goToParams.scale = this.base.config.insetScale;
      } else {
        insetView.graphics.add(graphic);
        goToParams.zoom = this.view.zoom > 4 ? this.view.zoom - 4 : 0;
      }
      insetView.goTo(goToParams);
    }

  }
  public async createOverviewMap() {
    const mapRequire = await requireUtils.when(require, ["esri/Map"]);
    const Map = mapRequire[0];

    const map = new Map({
      basemap: this.base.config.insetBasemap || this.view.map.basemap
    });
    // add a basemap and draw extent rectangle based on map
    // then setup listener to change extent when map view is modified
    const insetDiv = document.createElement("div");

    insetDiv.classList.add("inset-map");

    const insetView = new MapView({
      map,
      ui: {
        components: []
      },
      container: insetDiv
    });
    this.view.ui.add(insetDiv, this.base.config.insetPosition);
    await insetView.when();

    this.view.watch("extent", () => {
      this.createGraphic(insetView);
    });
    this.createGraphic(insetView);
    // prevent panning
    insetView.on("drag", evt => {
      evt.stopPropagation();
    });
    insetView.on("mouse-wheel", evt => {
      evt.stopPropagation();
    });
    insetView.on("double-click", evt => {
      evt.stopPropagation();
    });

    insetView.on("key-down", evt => {
      const keyPressed = evt.key;
      if (keyPressed.slice(0, 5) === "Arrow") {
        evt.stopPropagation();
      }
    });

  }
}

export = MapExample;
