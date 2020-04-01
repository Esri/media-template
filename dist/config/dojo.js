(function () {
  var _a = window.location,
    pathname = _a.pathname,
    search = _a.search;
  var packagePath = pathname.substring(0, pathname.lastIndexOf("/"));
  var localeUrlParamRegex = /locale=([\w-]+)/;
  var dojoLocale = search.match(localeUrlParamRegex) ?
    RegExp.$1 :
    undefined;
  var config = {
    async: true,
    locale: dojoLocale,
    has: {
      // "esri-native-promise": 1
    },
    packages: [{
        name: "Application",
        location: packagePath + "/app",
        main: "Main"
      },
      {
        name: "Custom",
        location: packagePath + "/app"
      },
      {
        name: "ApplicationBase",
        location: packagePath + "/app/application-base-js",
        main: "ApplicationBase"
      },
      {
        name: "config",
        location: packagePath + "/config"
      }, {
        name: "moment",
        location: packagePath + "/app/moment"
      }
    ]
  };
  window["dojoConfig"] = config;
})();
//# sourceMappingURL=dojo.js.map
