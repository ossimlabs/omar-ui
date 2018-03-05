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
    // toastr.info("Click on the thumbnail or ID text in the image card to view the image and it's" +
    //   " metadata", 'Heads Up:', {
    //   positionClass: 'toast-bottom-left',
    //   closeButton: true,
    //   timeOut: 10000,
    //   extendedTimeOut: 5000,
    //   target: 'body'
    // });

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
