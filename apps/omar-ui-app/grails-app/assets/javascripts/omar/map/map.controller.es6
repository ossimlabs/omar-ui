(function() {
  "use strict";
  angular
    .module("omarApp")
    .controller("MapController", [
      "mapService",
      "$stateParams",
      "$scope",
      "toastr",
      "$timeout",
      "stateService",
      "$log",
      MapController
    ]);

  function MapController(
    mapService,
    $stateParams,
    $scope,
    toastr,
    $timeout,
    stateService,
    $log
  ) {
    /* jshint validthis: true */
    var vm = this;

    vm.suppressInfoMessage = function() {
      console.log("Suppressing Yo!");
    };

    console.log("AppO2.APP_CONFIG", AppO2.APP_CONFIG);

    // We need to check to see if we need to display the mapInfoMessage
    if (AppO2.APP_CONFIG.params.misc.mapInfoMessage.enabled) {
      toastr.info(
        `<p>${AppO2.APP_CONFIG.params.misc.mapInfoMessage.message}</p>`,
        `${AppO2.APP_CONFIG.params.misc.mapInfoMessage.header}`,
        {
          positionClass: "toast-bottom-right",
          closeButton: true,
          timeOut: AppO2.APP_CONFIG.params.misc.mapInfoMessage.timeOut,
          extendedTimeOut:
            AppO2.APP_CONFIG.params.misc.mapInfoMessage.extendedTimeOut,
          progressBar: AppO2.APP_CONFIG.params.misc.mapInfoMessage.progressBar,
          allowHtml: true,
          tapToDismiss: false
        }
      );
    }

    vm.legendTitle = "Legend";
    vm.legendUrl = "";

    mapService.mapInit();
    mapService.setIntialMapSpatialFilter();

    $scope.$on("attrObj.updated", function(event, filter) {
      mapService.updateFootPrintLayer(filter);
    });

    $scope.$on("mapState.updated", function(event, params) {
      mapService.zoomMap(params);
    });

    $scope.$on("omarSitesState.updated", function(event, params) {
      mapService.setMapServiceUrlProps();
      mapService.autoMosaicRequestUrl();

      // Changes the Legend URL after federating
      vm.legendUrl = `${stateService.omarSitesState.url.base}${
        stateService.omarSitesState.url.wmsContextPath
      }/wms/getLegendGraphic?style=${
        AppO2.APP_CONFIG.params.footprints.params.styles
      }`;
      $log.debug(`vm.legendUrl: ${vm.legendUrl}`);
    });
  }
})();
