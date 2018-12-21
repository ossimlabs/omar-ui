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

    const mapInfoMessageParams = AppO2.APP_CONFIG.params.misc.mapInfoMessage;

    // Set defaults if not passed in from configuration
    const {
      header = " - O2 -",
      message = "<p>Welcome to the Map Search</p>",
      timeOut = 20000,
      extendedTimeOut = 15000,
      progressBar = true,
      enabled = false
    } = mapInfoMessageParams;

    // Check to see if we need to display the mapInfoMessage
    if (enabled) {
      toastr.info(`${message}`, `${header}`, {
        closeButton: true,
        timeOut: timeOut,
        extendedTimeOut: extendedTimeOut,
        progressBar: progressBar,
        allowHtml: true,
        tapToDismiss: false
      });
    }

    vm.legendTitle = "Legend";
    vm.legendUrl = "";

    mapService.mapInit();

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
