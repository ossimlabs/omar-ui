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
