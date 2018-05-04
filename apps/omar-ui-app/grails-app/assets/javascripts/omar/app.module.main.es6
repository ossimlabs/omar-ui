(function() {
  "use strict";

  angular
    .module("omarApp", [
      "ui.router",
      "ui.bootstrap",
      "angularSpinner",
      "toastr",
      "mgcrea.ngStrap",
      "angular-clipboard",
      "ui.select",
      "ngSanitize"
    ])
    .config([
      "$stateProvider",
      "$urlRouterProvider",
      "$uibTooltipProvider",
      "$logProvider",

      function(
        $stateProvider,
        $urlRouterProvider,
        $uibTooltipProvider,
        $logProvider
      ) {
        $logProvider.debugEnabled(AppO2.APP_CONFIG.params.misc.javascriptDebug);

        $uibTooltipProvider.options({
          popupDelay: 700
        });

        $urlRouterProvider.otherwise("/home");

        $stateProvider

          .state("home", {
            url: "/home",
            templateUrl:
              AppO2.APP_CONFIG.serverURL + "/views/home/home.partial.html"
          })
          .state("map", {
            url: "/map",
            templateUrl:
              AppO2.APP_CONFIG.serverURL + "/views/map/map.partial.html"
          })
          .state("mapOrtho", {
            url: "/mapOrtho?layers",
            templateUrl:
              AppO2.APP_CONFIG.serverURL +
              "/views/mapOrtho/map.ortho.partial.html"
          })
          .state("mapImage", {
            url:
              "/mapImage?filename=&entry_id=&width=&height&bands=&numOfBands=&imageId=&brightness=&contrast=&histOp=&histCenterTile=&numResLevels=&resamplerFilter=&sharpenMode=&imageRenderType=&imageSpaceRequestUrl=&uiRequestUrl=&mensaRequestUrl=&wfsRequestUrl=&wmsRequestUrl=&showModalSplash=",
            templateUrl:
              AppO2.APP_CONFIG.serverURL +
              "/views/mapImage/map.image.partial.html"
          })
          .state("wfs", {
            url: "/wfs",
            templateUrl:
              AppO2.APP_CONFIG.serverURL + "/views/wfs/wfs.partial.html"
          });
      }
    ])
    .filter("fileNameTrim", function() {
      return function(name) {
        if (name !== undefined) {
          var filename = name.replace(/^.*[\\\/]/, "");
          return filename;
        }
      };
    });
})();
