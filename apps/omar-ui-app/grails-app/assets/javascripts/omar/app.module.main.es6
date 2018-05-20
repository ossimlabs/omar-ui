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
        // This checks to make sure that the backspace/delete key does not
        // allow the browser to go back a page (default browser behavior).  This
        // behaviour has ill advised consequences when a user is NOT in an INPUT form
        if (typeof window.event != "undefined")
          document.onkeydown = function() {
            if (event.srcElement.tagName.toUpperCase() != "INPUT")
              return event.keyCode != 8;
          };
        else
          document.onkeypress = function(e) {
            if (e.target.nodeName.toUpperCase() != "INPUT")
              return e.keyCode != 8;
          };

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
    })
    .directive("ngEnter", function() {
      return function(scope, elem, attrs) {
        elem.bind("keydown keypress", function(event) {
          // 13 represents enter button
          if (event.which === 13) {
            scope.$apply(function() {
              scope.$eval(attrs.ngEnter);
            });

            event.preventDefault();
          }
        });
      };
    })
    .directive("focusInput", function($timeout) {
      return {
        link: function(scope, element, attrs) {
          element.bind("click", function() {
            $timeout(function() {
              element.focus();
            }, 750);
          });
        }
      };
    });
})();
