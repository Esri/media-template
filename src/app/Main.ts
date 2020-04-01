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

import Graphic from "esri/Graphic";
import Handles from "esri/core/Handles";
import Expand from "esri/widgets/Expand";
import Collection from "esri/core/Collection";

import esri = __esri;
import { whenFalseOnce } from "esri/core/watchUtils";
import { eachAlways } from "esri/core/promiseUtils";


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
  view: esri.MapView | esri.SceneView;

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

    const { config, results } = base;
    const { find, marker } = config;
    const { webMapItems } = results;

    const validWebMapItems = webMapItems.map(response => response.value);

    // Do we have a web map or web scene?
    const firstItem = validWebMapItems[0];

    if (!firstItem) {
      this._displayError(i18n.mapError);
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

    const appProxies = portalItem?.applicationProxies || null;

    const viewContainerNode = document.getElementById("viewContainer");
    // Get url properties like center, extent, zoom
    const defaultViewProperties = getConfigViewProperties(config);
    const components = this.base.config.mapZoom ? ["attribution", "zoom"] : ["attribution"];

    validWebMapItems.forEach(item => {
      const viewNode = document.createElement("div");
      viewContainerNode.appendChild(viewNode);
      const viewProperties = {
        container: viewNode,
        ui: { components },
        ...defaultViewProperties
      };
      createMapFromItem({ item, appProxies }).then(map =>
        createView({
          ...viewProperties,
          map
        })
          .then(view => {
            view.when(() => {
              findQuery(find, view).then(() => goToMarker(marker, view));
              if (this?.base?.config?.popupDockPosition !== "auto") {
                view.popup.dockEnabled = true;
                view.popup.set("dockOptions", {
                  breakpoint: false,
                  buttonEnabled: false,
                  position: this.base.config.popupDockPosition
                })
              }
              if (this?.base?.config?.popupDisplayAttachmentType === "preview") {
                // Display attachments in list vs preview mode.
                view.map.layers.forEach((popupLayer) => {
                  if (popupLayer.hasOwnProperty("popupTemplate")) {
                    const layer = popupLayer as esri.FeatureLayer;
                    const template = layer.popupTemplate;
                    if (Array.isArray(template.content)) {
                      template.content.forEach((content: any) => {
                        if (content.type === "attachments") {
                          content.displayType = "preview";
                        }
                      });
                    }
                  }
                });
              }
              if (!this?.base?.config?.rotation && view.type === "2d") {
                this.view = view as esri.MapView;
                this.view.constraints.rotationEnabled = false;
              }
              const { mapZoom, mapZoomPosition, viewMinScale, viewMaxScale } = this.base.config;
              if (mapZoom && mapZoomPosition !== "top-left"
              ) {
                view.ui.move("zoom", mapZoomPosition);
              }
              if (view.type === "2d") {
                view = view as esri.MapView;
                if (viewMinScale) {
                  view.constraints.minScale = viewMinScale;
                }
                if (viewMaxScale) {
                  view.constraints.maxScale = viewMaxScale;
                }
              }
              const { highlightColor, highlightFillOpacity, highlightHaloOpacity } = this.base.config;
              if (highlightColor) {
                view.highlightOptions.color = highlightColor as any;
              }
              if (highlightFillOpacity) {
                view.highlightOptions.fillOpacity = highlightFillOpacity;
              }
              if (highlightHaloOpacity) {
                view.highlightOptions.haloOpacity = highlightHaloOpacity;
              }
              // Disable map scroll and add overlay explaining how to do it depending on touch device or not
              const { disableScroll } = this.base.config;
              if (disableScroll) {
                const handles = new Handles();
                // disable mouse wheel and single-touch map nav
                view.navigation.mouseWheelZoomEnabled = false;
                view.navigation.browserTouchPanEnabled = false;
                const pointers = new Map();
                handles.add(view.on("pointer-down", (e) => {
                  const { pointerId, pointerType, x, y } = e;
                  if (pointerType !== "touch") { return; }
                  pointers.set(pointerId, { x, y });
                }), "pointer");
                handles.add(view.on(["pointer-up", "pointer-leave"], (e) => {
                  const { pointerId, pointerType } = e;
                  if (pointerType !== "touch") { return; }
                  pointers.delete(pointerId);
                }), "pointer");
                handles.add(view.on("pointer-move", (e) => {
                  const { pointerId, pointerType, x, y } = e;
                  if (pointerType !== "touch") { return; }
                  if (pointers.size !== 1) { return; }
                  const distance = Math.sqrt(
                    Math.pow(x - pointers.get(pointerId).x, 2) +
                    Math.pow(y - pointers.get(pointerId).y, 2)
                  );
                  if (distance < 20) { return; }
                  this._showScrollMessage(i18n.scroll.touchInstructions);
                  handles.remove("pointer")
                }), "pointer");

                handles.add(view.on(["mouse-wheel"], (e) => {
                  if (e.type === "mouse-wheel") {
                    view.focus();
                    this._showScrollMessage(i18n.scroll.instructions);
                    handles.remove("mouse");
                  }
                }), "mouse");
              }
              this.defineUrlParams(view);
              this._addSplash(view, this.base.config);
              this.addDetails(item, view);
              this.applySharedTheme();
              this.addWidgets(view);
            });

          })

      );
    });
    document.body.classList.remove(CSS.loading);
  }
  _showScrollMessage(message) {
    const scrollMessage = document.getElementById(
      "scrollMessage"
    ) as HTMLDivElement;


    scrollMessage.innerHTML = message;
    const scroller = document.getElementById("scroller");
    if (!scroller.classList.contains("is-active")) {
      scroller.classList.add("is-active");
      setTimeout(() => {
        // after small delay remove the message
        scroller.classList.remove("is-active");
      }, 2000);
    }
  }
  async _addSplash(view, config) {
    if (config.splash) {
      const Splash = await import("./Components/Splash");
      if (!Splash) { return; }
      const splash = new Splash.default({
        config,
        container: document.createElement("div")
      });

      document.body.appendChild(splash.container as HTMLElement);
      view.ui.add(splash.createToolbarButton(), "top-right");
      splash.showSplash();
    }
  }
  applySharedTheme() {
    // For now just to the text panel
    if (this?.base?.portal?.portalProperties?.sharedTheme) {
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

  addDetails(item, view) {
    const { details, detailsTitle, detailsContent, detailsIndex, detailsPosition, detailsTextColor, detailsBackgroundColor } = this.base.config;
    if (details) {
      const title = detailsTitle || item.title;

      let panelText = detailsContent;
      if (!panelText) {
        panelText = item.snippet || item.description || "";
      }
      const panel = document.createElement("banner");
      panel.innerHTML = `
       <div 
         class="panel panel-no-border esri-widget--panel" 
         style=background-color:${detailsBackgroundColor}
         color:${detailsTextColor}>
         <h3 class=trailer-half>${title}</h3>
         <p>${panelText}</p>
         </div>`;

      const expand = new Expand({
        content: panel,
        expandIconClass: "esri-icon-description",
        view,
        mode: "floating",
        group: detailsPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
        expandTooltip: i18n.widgets.details.label
      });
      let isSmall = view.widthBreakpoint === "xsmall" || view.widthBreakpoint === "small" || view.widthBreakpoint === "medium";

      const panelComponent: esri.UIAddComponent = {
        component: isSmall ? expand : panel,
        position: detailsPosition,
        index: detailsIndex === "first" ? 0 : 20
      };

      view.ui.add(panelComponent);

      // if the view is small, xsmall or medium put panel in info button
      view.watch("widthBreakpoint", breakpoint => {
        let isSmall = false;
        if (breakpoint === "xsmall" || breakpoint === "small" || breakpoint === "medium") {
          isSmall = true;
        }
        view.ui.remove(panelComponent.component)

        panelComponent.component = isSmall ? new Expand({
          content: panel,
          expandIconClass: "esri-icon-description",
          view,
          mode: "floating",
          group: detailsPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
          expandTooltip: i18n.widgets.details.label
        }) : panel;
        view.ui.add(panelComponent);
      });
    }
  }
  public async defineUrlParams(view) {
    if (this.base.config.customUrlLayer.id && this.base.config.customUrlLayer.fields.length > 0 && this.base.config.customUrlParam) {

      const modules = await eachAlways([import("esri/widgets/Search"), import("esri/core/urlUtils")]);
      const [Search, urlUtils] = modules.map((module) => module.value);
      if (!Search && urlUtils) { return; }
      const searchResults = urlUtils.urlToObject(document.location.href);
      let searchTerm = null;

      if (searchResults && searchResults.query) {
        if (this.base.config.customUrlParam in searchResults.query) {
          searchTerm = searchResults.query[this.base.config.customUrlParam]
        }
      }

      const featureLayer = view.map.findLayerById(this.base.config.customUrlLayer.id);
      if (featureLayer && searchTerm) {
        const fields = this.base.config.customUrlLayer?.fields[0]?.fields;

        const search = new Search.default({
          view,
          resultGraphicEnabled: false,
          searchAllEnabled: false,
          includeDefaultSources: false,
          suggestionsEnabled: false,
          searchTerm,
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
    }
  }
  public async addWidgets(view) {
    const { legend, insetMap, inset } = this.base.config;
    this.addLayerList(view);
    if (legend) await this.addLegend(view);
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
    if (insetMap || inset) this.createOverviewMap(view);
    this.addTime(view);
    this.addSwipe(view);

  }
  _createSwipeLayers(swipeLayers, view): esri.Collection<esri.Layer> {
    const swipeResults = new Collection();
    if (swipeLayers) {
      JSON.parse(swipeLayers).forEach((id) => {
        let l;
        if (id.id.indexOf(".") !== -1) {
          const layerValues = id.id.split(".");
          const layerId = layerValues[0];
          const subLayerId = layerValues[1];
          const mainLayer = view.map.findLayerById(layerId);

          mainLayer.sublayers.forEach(sub => {
            if (sub.id === parseInt(subLayerId)) {
              l = sub.layer;
            }
          });
        } else {
          // Find the map layer 
          l = view.map.findLayerById(id.id);
        }
        if (l) {
          swipeResults.add(l);
        }
      });
    }
    return swipeResults;
  }
  async _getBasemap(id: string) {

    const Basemap = await import("esri/Basemap");
    if (!Basemap) { return; }

    let basemap = Basemap.default.fromId(id);
    if (!basemap) {
      basemap = await new Basemap.default({
        portalItem: {
          id
        }
      }).loadAll();
    }
    return basemap;
  }
  createGraphic(insetView: esri.MapView, view, style) {
    insetView.graphics.removeAll();
    let graphic = null;
    if (view && view.extent) {
      if (style === "marker") {
        graphic = new Graphic({
          geometry: view.extent,
          symbol: {
            type: "picture-marker",
            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAB5CAYAAAAd+o5JAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADKGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwMTQgNzkuMTU2Nzk3LCAyMDE0LzA4LzIwLTA5OjUzOjAyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NTk3M0JBQjZDNDkxMUU0QTM3RThDNzNCRDk3QTcyQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NTk3M0JBQzZDNDkxMUU0QTM3RThDNzNCRDk3QTcyQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU1MjgwM0FDNkM0OTExRTRBMzdFOEM3M0JEOTdBNzJBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU1OTczQkFBNkM0OTExRTRBMzdFOEM3M0JEOTdBNzJBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+lMh/mgAABuxJREFUeF7tne2N2zoURFPCKyElpIQtISWkhJSQDlJCSsjv/ZUStoSUEGAb2Iii1s+yjz4o3RnJDAc4CDBAbGlkUuQlpf3w9vbWqBw0G3WBZqMu0GzUBZqNukCzURdoNuoCzUZdoNmoCzQbdYFmoy7QbNQFmg6ken596vja8aPjV8fbAi8dPzu+dTwNnyIT5aEETQfhen793JEu6p8OupClpIv+peO/4RvCRHkoQdNBiJ5fP3ak1hd1YadIP56Pw7fuFuWhBE0Hu5Ra1/Pr9+ECOAm52JSHEjQdbFa+16pb7hKp99jcjVMeStB0UKzcNa8ZRLn43fFpOLoiUR5K0HRQpDyoOrr1TvF1OMrVojyUoOlgtfIIl8I9Ez+Go10lykMJmg5WKQ90KNQzko511X2a8lCCpoNFHTN63svP4ehnRXkoQdPBrB6ji55iseumPJSg6WBSuSRJ4T0S34azQVEeStB0gMrTpLOOokuZrIFTHkrQdIA61zx4L+nHigMxykMJmg7ulCtZFNYjg/dnykMJmg5GyrXoWrrpW+66bcpDCZoORsq1YAqoBn4NZ3kR5aEETQcX1d2K3xm1ZspDCZoOLvK04vQjet/5cU2qUqWFBvo/kYyKJJSHEjQdXKQNOV3E5e08eeqmLqFe1qEpDyVoOuiVV5cokL2kPVvle7W0y5mXAgnloQRNB700rWf1QsGkNNO5l+HTMQ8laDroFT/gKlrym5Wmft532ZSHEjQddCf86SaAvdxNVXYrfiXsS/pYykMJmg76E+YgtpB6hLDdlCPl+zt95xb6nobyUIKmg+6EI1vJ7KrPLqUBHH/nFvrehvJQgqaD/oQ5iFJSKw7fAD9SZGvuRHkoQdNBd8JRwcUNtqYUOdruRHkoQdMBBrCNfjAjVewg8YnyUIKmAzj5rZQXPbaIv3sL7SIX41Lc7aVd5GJcihsotou8Ae3I+l1xCyn/1EUO6/6Gy6AVf3c5nSgPJWg66E44qvsrfhapWOmHxN9dyp/0cZSHEjQddCcctVlg1VMLuxRXnfvnKl6Ra8mauvW74u7HffmV8lCCpoPuhNPeLgpiC7qqV+xCSj9+oDyUoOmgV953RWFsIX4AFrvJsL8fJ1EeStB00Cu2laQuNXY6FTc4TFx6G8pDCZoOesV22Yk0LYu50Omi8Hds5fPwyZiHEjQdXBQfZrrQm97l0Sv/8CJvI4nfw6f3ojyUoOngorg56DXpPlq+kSCP+BVbhEfHQnkoQdPBSHHVr1vSBUvz8ekpVt6Gm8YGqmNIjG4hlIcSNB2MFDsAmyK17jSQSqRbRPpX0WpvuZveUR5K0HRwJ0/gR3DXi1AeStB0cCdPa3aDRRrKQwmaDlD1tWYcC1AeStB0gKqrNU+WWikPJWg6mFRslekoZrcJUx5K0HQwKc282c3sHJ3yUIKmg1nFV5ycpHHFbGmV8lCCpoNZ5QJF1OqPm8V94JSHEjQdLCpXqijEM7PqyUrKQwmaDhaVFwoebUq1amGE8lCCpoNV0r1uQsH34agXRXkoQdPBaj3GlGp2ynQrykMJmg5W6zEGYUUP3VEeStB0UKRzD8KKX2NBeShB00GxzjsIK96FQnkoQdNBsc5ZCVs92LoW5aEETQebdK5K2GJla0qUhxI0HWxSnjufZRB22X1ZKspDCZoONuscLz/f9c4wykMJmg52SbvpbonUk+x69oryUIKmg12Kf5tfCbvfGUZ5KEHTwW7FvxJxDaNN8ltFeShB08FuHTMIC3mojvJQgqaDEHn3hIU97E55KEHTQZh8CxhhD7pTHkrQdBAmTyVs92DrWpSHEjQdhCr+ychrNle2pkR5KEHTQai0y5Hh7+6kPJSg6SBcmuXIXZWtKVEeStB0EK48pYpejpS8CI7yUIKmA4lip1Sy94NRHkrQdCBTXGsOmzLdivJQgqYDmWKmVLr3gnWiPJSg6UCqfQWS3atMS6I8lKDpQKp9rTm08EGiPJSg6UCuba05teLQwgeJ8lCCpgO5trVmeStOojyUoOnAovLWLG/FSZSHEjQdWFT2LJV0RH0tykMJmg5sWj9vlo6or0V5KEHTgU3rqmC2VpxEeShB04FVyytUnj9WMojyUIKmA6vmV6gkK01zojyUoOnAqrzeTBc4of9bjzeiPJSg6cAufo7q8icDnKI8lKDpwC6eTm16KnGvKA8laDo4RPfTKdu06VqUhxI0HRyi8VMXL4NrF+WhBE0Hh2j8DJX+z/9NiPJQgqaDw/R/l31IV51EeShB08Fhyl22fW58LcpDCZoODlPusg/rqpMoDyVoNuoCzUZdoNmoCzQbdYFmoy7QbNQFmo26QLNRF2g26gLNRl2g2agLNBs18fbhLwdyU/7jRWqcAAAAAElFTkSuQmCC",
            width: 24,
            height: 24
          } as any
        });
      } else {
        graphic = new Graphic({
          geometry: view.extent,
          symbol: {
            type: "simple-fill",
            color: [160, 160, 160, 0.2],
            outline: {
              color: [100, 100, 100, 0]
            }
          } as any
        });
      }
      const goToParams: any = {
        target: style === "marker" ? graphic.geometry : graphic.geometry.extent.center
      };
      if (this.base.config.insetScale) {
        goToParams.scale = this.base.config.insetScale;
      } else {
        goToParams.zoom = view.zoom > 4 ? view.zoom - 4 : 0;
      }
      insetView.graphics.add(graphic);
      insetView.goTo(goToParams);
    }

  }
  protected async addFullscreen(view) {
    // Add fullscreen widget 
    const { fullscreen, fullscreenPosition } = this.base.config;
    if (fullscreen) {
      const Fullscreen = await import("esri/widgets/Fullscreen");
      if (!Fullscreen) { return; }
      view.ui.add(new Fullscreen.default({ view }), fullscreenPosition);
    }
  }
  protected async addHome(view) {
    // Add home button to view 
    const { home, homePosition } = this.base.config;
    if (home) {
      const Home = await import("esri/widgets/Home");
      if (!Home) { return; }
      view.ui.add(new Home.default({
        view
      }), homePosition);
    }
  }
  protected async createOverviewMap(view) {
    const modules = await eachAlways([import("esri/Map"), import("esri/views/MapView")]);
    const [Map, MapView] = modules.map((module) => module.value);
    const { insetBasemap, insetPosition, insetLocationStyle, insetStyle } = this.base.config;
    const basemap = insetBasemap ? await this._getBasemap(insetBasemap) : view.map.basemap;
    const map = new Map.default({
      basemap
    });
    // add a basemap and draw extent rectangle based on map
    // then setup listener to change extent when map view is modified
    const container = document.createElement("div");
    container.className = "inset-map";
    container.setAttribute("aria-label", i18n.widgets.overviewDetails);

    const insetView = new MapView.default({
      map,
      ui: {
        components: []
      },
      container
    });

    view.ui.add(insetView.container, insetPosition);
    await insetView.when();


    // Show one location or extent depending on config settings
    view.watch("extent", () => {
      this.createGraphic(insetView, view, insetLocationStyle);
    });
    this.createGraphic(insetView, view, insetLocationStyle);

    insetView.container.classList.add(insetStyle);

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
  _displayError(err) {
    document.body.classList.remove("configurable-application--loading");
    document.body.classList.add("app-error");
    document.getElementById("viewContainer").innerHTML = err;
  }
  protected async addSwipe(view) {
    const { swipe } = this.base.config;
    if (swipe && view.type === "2d") {

      const Swipe = await import('esri/widgets/Swipe');
      const { mode, position, leadingLayers, trailingLayers, swipeAlwaysEnabled, swipeButtonPosition } = this.base.config;
      await whenFalseOnce(view, "updating");
      await view.map.loadAll();
      let leading = this._createSwipeLayers(leadingLayers, view);
      let trailing = this._createSwipeLayers(trailingLayers, view);
      if (leading.length === 0 && trailing.length === 0) {
        // just use the first layer in the op layers as the trailing layer
        if (view.map.layers.length > 0) {
          trailing.add(view.map.layers.items[0]);
        }
      }
      if (leading || trailing) {
        const swipe = new Swipe.default({
          direction: mode,
          position,
          leadingLayers: leading,
          trailingLayers: trailing
        });
        view.ui.add(swipe);
        // show swipe when app opens 
        if (swipeAlwaysEnabled) {
          swipe.view = view;
        } else {
          const swipeButton = document.createElement("button");
          swipeButton.classList.add("esri-widget");
          swipeButton.classList.add("esri-widget--button");
          swipeButton.classList.add("esri-interactive");

          swipeButton.classList.add(mode === "vertical" ? "esri-icon-handle-horizontal" : "esri-icon-handle-vertical");
          swipeButton.title = swipe.label;
          view.ui.add(swipeButton, swipeButtonPosition);
          let toggle = true;
          swipeButton.addEventListener("click", () => {
            swipe.view = swipe.view ? null : view;
            toggle = !toggle;
          });
        }
      }
    }
  }
  protected async addHover(view) {
    const { hoverPopup, hoverPopupType, hoverPopupPosition } = this.base.config;
    if (hoverPopup) {
      const Feature = await import("esri/widgets/Feature");
      if (!Feature) { return; }

      const feature = new Feature.default({
        map: view.map,
        defaultPopupTemplateEnabled: false,
        spatialReference: view.spatialReference
      });
      let lastHitTest;
      let highlight;
      let overPopup = false;
      if (hoverPopupType === "floating") {
        const domNode = view.popup.domNode;
        domNode.addEventListener("mouseenter", () => { overPopup = true; });
        domNode.addEventListener("mouseleave", () => { overPopup = false; });
      }

      view.on("pointer-move", (evt) => {
        clearTimeout(lastHitTest);
        // add a tiny delay before performing hit test
        lastHitTest = setTimeout(() => {
          view.hitTest(evt).then(hitTestResults => {
            // Get (feature) layers with popup enabled
            const results = hitTestResults.results.filter((result) => {
              const template = result.graphic.getEffectivePopupTemplate();
              return result?.graphic?.layer?.popupEnabled && template;
            });
            let result = null;
            results.some(r => {
              if (r?.graphic?.layer?.type === "feature" || r?.graphic?.layer?.type === "map-notes") {
                result = r;
                return true;
              }
            });

            if (result) result.graphic.layer.outFields = ["*"];
            highlight && highlight.remove();


            if (result) {
              view.whenLayerView(result.graphic.layer as esri.FeatureLayer).then((featureLayerView: esri.FeatureLayerView) => {
                if (hoverPopupType === "floating") {
                  view.popup.open({
                    location: evt.mapPoint,
                    features: [result.graphic],
                    updateLocationEnabled: false
                  });
                } else { // fixed
                  view.popup = null;
                  feature.graphic = result.graphic;
                  highlight = featureLayerView && featureLayerView.highlight(result.graphic);
                  view.ui.add(feature, hoverPopupPosition);
                }
              });
            } else {
              // Are we hovered over the  popup? If so don't close
              if (!overPopup) {
                if (hoverPopupType === "floating") {
                  view.popup.close();
                } else {
                  feature.graphic = null;
                  view.ui.remove(feature);
                }
              }
            }
          });
        }, 85);
      });
    }
  }
  protected async addTime(view) {
    const { widgets } = view.map;
    const { time } = this.base.config;
    if (time) {
      if (widgets?.timeSlider) {
        const moment = await import("moment/moment");
        const modules = await eachAlways([import("esri/widgets/TimeSlider"), import("esri/TimeExtent")]);
        const [TimeSlider, TimeExtent] = modules.map((module) => module.value);
        let { fullTimeExtent } = widgets.timeSlider;
        const { stopInterval, stopDelay, numThumbs, numStops } = widgets.timeSlider;
        const { timeLoop, timeVisible, timePosition, timeExpandAtStart, timeEffect, liveData, durationTime, durationPeriod } = this.base.config;
        let { includedEffect, excludedEffect } = this.base.config;
        // Overwrite time extent if specified 
        if (liveData) {
          if (durationTime <= 0) {
            console.log(`Invalid duration specified ${durationTime}`)
          } else {
            // set startTime to the current date/time 
            fullTimeExtent = new TimeExtent.default({
              start: new Date(),
              end: moment.default().add(durationTime, durationPeriod).toDate()
            });
            this.base.config.timeMode = "cumulative-from-start";
          }
        }
        view.timeExtent = fullTimeExtent;

        // Also add time filter options to show data differently
        // Define stops depending on values set in web map
        let stops = null;
        if (numStops) {
          stops = {
            count: numStops
          } as esri.StopsByCount;
        } else if (stopInterval) {
          stops = {
            interval: {
              unit: stopInterval.unit,
              value: stopInterval.value
            }
          } as esri.StopsByInterval
        }

        let mode = this.base.config.timeMode;
        if (numThumbs < 2) {
          mode = "cumulative-from-start";
        }
        if (excludedEffect) {
          switch (excludedEffect) {
            case "gray":
              excludedEffect = "grayscale(100%) opacity(30%)";
              break;
            case "sepia":
              excludedEffect = "sepia(90%)";
              break;
            case "opacity":
              excludedEffect = "opacity(80%)";
              break;
            case "null":
              excludedEffect = null;
              break;
          }
        }
        if (includedEffect) {
          switch (includedEffect) {
            case "saturate":
              includedEffect = "saturate(1500%)";
              break;
            case "contrast":
              includedEffect = "contrast(1.75)";
              break;
            case "brightness":
              includedEffect = "brightness(1.75)";
              break;
            case "null":
              includedEffect = null;
          }
        }

        const timeSlider = new TimeSlider.default({
          view: timeEffect && (includedEffect || excludedEffect) ? null : view,
          fullTimeExtent,
          mode,
          timeVisible,
          playRate: stopDelay ? stopDelay : 1000,
          loop: timeLoop,
          stops,
          container: document.createElement("div")
        } as esri.TimeSliderProperties);

        // If a filter and effects are specified apply them 
        // to the layers 

        if (timeEffect && (includedEffect || excludedEffect)) {
          let layerViews = [];
          view.map.layers.forEach(async layer => {
            if (layer.timeInfo) {
              const timeLayer = await view.whenLayerView(layer);
              timeLayer.effect = {
                filter: {
                  timeExtent: timeSlider.timeExtent,
                  geometry: view.extent
                },
                includedEffect,
                excludedEffect
              };
              layerViews.push(timeLayer);
            }
          });
          timeSlider.watch("timeExtent", (value) => {
            // set time extent to time aware layer views 
            layerViews && layerViews.forEach((lv) => {
              lv.effect = {
                filter: {
                  timeExtent: timeSlider.timeExtent,
                  geometry: view.extent
                },
                includedEffect,
                excludedEffect
              };
            })
          });
        }

        const expand = new Expand({
          view,
          mode: "floating",
          expandTooltip: timeSlider.label,
          group: timePosition.indexOf("bottom") !== -1 ? "bottom" : "top",
          content: timeSlider,
          expanded: timeExpandAtStart
        });

        view.ui.add(expand, timePosition);

        // modify slider styles 
        const { hideSliderBar } = this.base.config;
        const container = expand.container as HTMLElement;
        if (hideSliderBar) {
          container.classList.add("no-slider");
        }
      }
    }
  }
  protected async addLocate(view) {
    const { locate, locatePosition } = this.base.config;
    if (locate) {
      const Locate = await import("esri/widgets/Locate");
      if (!Locate) { return; }
      const locateWidget = new Locate.default({
        view
      });
      view.ui.add(locateWidget, locatePosition);
    }
  }
  protected async addBookmarks(view) {
    const { bookmarks, bookmarksPosition } = this.base.config;
    if (bookmarks) {
      let map;
      if (view.type === "2d") {
        map = view.map as esri.WebMap;
      } else {
        map = view.map as esri.WebScene;
      }
      const hasBookmarks = view.type === "3d" ? map?.presentation?.slides?.length : map?.bookmarks?.length;

      if (hasBookmarks) {
        const modules = await eachAlways([import("esri/widgets/Bookmarks"), import("./Components/Slides")]);
        const [Bookmarks, Slides] = modules.map((module) => module.value);
        if (!Bookmarks && !Slides) { return; }

        const bookmarkExpand = new Expand({
          view,
          content: view.type === "3d" ? new Slides({ view }) : new Bookmarks.default({ view }),
          group: bookmarksPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
          mode: view.widthBreakpoint !== "xsmall" ? "floating" : "drawer",
          expandTooltip: i18n.widgets.bookmark.label
        });
        view.ui.add(bookmarkExpand, bookmarksPosition);

      }
    }
  }
  protected async addPrint(view) {
    const { printPosition, print } = this.base.config;
    if (print) {
      const Print = await import("esri/widgets/Print");
      if (!Print) { return; }
      const printWidget = new Print.default({
        view,
        printServiceUrl: this.base.portal.helperServices.printTask.url
      });
      const printExpand = new Expand({
        view,
        group: printPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
        mode: "floating",
        expandTooltip: printWidget.label,
        content: printWidget
      });

      view.ui.add(printExpand, printPosition);
    }
  }
  protected async addBasemap(view) {
    const { basemapToggle, basemapTogglePosition } = this.base.config;
    if (basemapToggle) {
      const BasemapToggle = await import("esri/widgets/BasemapToggle");
      if (!BasemapToggle) { return; }
      const { basemapToggleAltBasemap } = this.base.config;
      let nextBasemap = await this._getBasemap(basemapToggleAltBasemap);
      view.ui.add(new BasemapToggle.default({
        view,
        nextBasemap
      }), basemapTogglePosition);
    }
  }
  protected async addShare(view) {

    const { share, shareIncludeEmbed, shareIncludeCopy, shareIncludeServices, sharePosition } = this.base.config;
    if (share) {
      const modules = await eachAlways([import("./Components/Share/Share"), import("./Components/Share/Share/ShareFeatures")]);
      const [Share, ShareFeatures] = modules.map((module) => module.value);

      if (!Share || !ShareFeatures) { return; }
      // add share css
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.setAttribute("href", "./app/Components/Share/css/Share.css");
      document.getElementsByTagName("head")[0].appendChild(link);

      const shareWidget = new Share.default({
        view,
        container: document.createElement('div'),
        shareFeatures: new ShareFeatures.default({
          embedMap: shareIncludeEmbed,
          shareServices: shareIncludeServices,
          copyToClipboard: shareIncludeCopy
        })
      });
      view.ui.add(shareWidget, sharePosition);
    }
  }
  protected async addLayerList(view) {
    // Add layer list widget 
    const { layerList, layerListAddLegend, layerListOpenAtStart, layerListPosition, layerListShowLegendOnLoad } = this.base.config;
    if (layerList) {
      const LayerList = await import("esri/widgets/LayerList");
      if (!LayerList) { return; }

      const layerList = new LayerList.default({
        view,
        container: document.createElement("div")
      });
      if (layerListAddLegend) {
        layerList.listItemCreatedFunction = (evt) => {
          const item = evt.item;
          item.panel = {
            content: "legend",
            open: layerListShowLegendOnLoad
          }
        };
      }

      const layerExpand = new Expand({
        group: layerListPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
        view,
        mode: "floating",
        content: layerList,
        expandTooltip: layerList.label
      });

      view.ui.add(layerExpand, layerListPosition);
      if (layerListOpenAtStart) {
        layerExpand.expand();
      }
    }
  }
  protected async addLegend(view) {
    const { legend, legendStyle, legendPosition, legendOpenAtStart } = this.base.config;
    const Legend = await import("esri/widgets/Legend");
    if (!Legend) { return; }
    const legendWidget = new Legend.default({
      view,
      style: legendStyle === "default" || legendStyle === "classic" ? "classic" : "card",
      container: document.createElement("div")
    });

    const legendExpand = new Expand({
      group: legendPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
      view,
      content: legendWidget,
      mode: "floating",
      expandTooltip: legend.label
    });
    view.ui.add(legendExpand, legendPosition);
    if (legendOpenAtStart) legendExpand.expand();
    return;
  }
  protected async addSearch(view) {
    const { search, searchConfig, searchPosition, searchOpenAtStart } = this.base.config;
    if (search) {
      const modules = await eachAlways([import("esri/widgets/Search"), import("esri/layers/FeatureLayer")]);
      const [Search, FeatureLayer] = modules.map((module) => module.value);
      if (!Search && !FeatureLayer) { return; }

      const searchProperties: any = {
        view,
        container: document.createElement("div")
      };
      // Get any configured search settings
      if (searchConfig) {
        if (searchConfig.sources) {
          const sources = searchConfig.sources;
          searchProperties.sources = sources.filter((source) => {
            if (source.flayerId && source.url) {
              const layer = view.map.findLayerById(source.flayerId);
              source.layer = layer ? layer : new FeatureLayer(source.url);
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
        if (searchProperties?.sources?.length > 0) {
          searchProperties.includeDefaultSources = false;
        }
        const { enableSearchingAll, activeSourceIndex } = searchConfig;
        searchProperties.searchAllEnabled = (enableSearchingAll) ? true : false;
        if (activeSourceIndex && searchProperties.sources && searchProperties.sources.length >= activeSourceIndex) {
          searchProperties.activeSourceIndex = activeSourceIndex;
        }
      }
      const search = new Search.default(searchProperties);

      const searchExpand = new Expand({
        group: searchPosition.indexOf("bottom") !== -1 ? "bottom" : "top",
        view,
        content: search,
        mode: "floating",
        expandTooltip: search.label
      });

      view.ui.add(searchExpand, searchPosition);
      if (searchOpenAtStart) {
        searchExpand.expand();
      }
    }
  }
}

export = MapExample;
