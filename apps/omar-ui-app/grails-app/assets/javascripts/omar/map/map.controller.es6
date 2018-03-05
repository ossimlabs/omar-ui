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
    });
  }
})();
