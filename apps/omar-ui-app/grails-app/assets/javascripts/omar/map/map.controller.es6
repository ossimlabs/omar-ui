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
      MapController
    ]);

  function MapController(
    mapService,
    $stateParams,
    $scope,
    toastr,
    $timeout,
    stateService
  ) {
    /* jshint validthis: true */
    var vm = this;

    vm.legendTitle = "Legend"; // TODO: Set this as a parameter from the app.yml
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

      // Need to change the Legend URL after we have federated
      vm.legendUrl = `${stateService.omarSitesState.url.base}${
        stateService.omarSitesState.url.wmsContextPath
      }/wms/getLegendGraphic`;
      console.log(vm.legendUrl);
    });
  }
})();
