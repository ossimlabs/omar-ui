(function() {
  "use strict";
  angular
    .module("omarApp")
    .controller("WFSOutputDlController", [
      "stateService",
      "downloadService",
      "wfsService",
      "$http",
      "mapService",
      "$scope",
      "toastr",
      "$window",
      "$log",
      WFSOutputDlController
    ]);

  function WFSOutputDlController(
    stateService,
    downloadService,
    wfsService,
    $http,
    mapService,
    $scope,
    toastr,
    $window,
    $log
  ) {
    var vm = this;

    var tlvBaseUrl, tlvContextPath, tlvRequestUrl;
    vm.tlvRequestUrl = "";

    var isaBaseUrl, isaContextPath, isaRequestUrl;
    vm.isaRequestUrl = "";

    var geoscriptBaseUrl, geoscriptContextPath, geoscriptRequestUrl;
    vm.geoscriptRequestUrl;

    function setWFSOutputDlControllerUrlProps() {
      tlvBaseUrl = stateService.omarSitesState.url.base;
      tlvContextPath = stateService.omarSitesState.url.tlvContextPath;
      tlvRequestUrl = tlvBaseUrl + tlvContextPath;
      vm.tlvRequestUrl = tlvRequestUrl;

      isaBaseUrl = stateService.omarSitesState.url.base;
      isaContextPath = stateService.omarSitesState.url.isaContextPath;
      isaRequestUrl = isaBaseUrl + isaContextPath;
      vm.isaRequestUrl = isaRequestUrl;

      geoscriptBaseUrl = stateService.omarSitesState.url.base;
      geoscriptContextPath =
        stateService.omarSitesState.url.geoscriptContextPath;
      geoscriptRequestUrl = geoscriptBaseUrl + geoscriptContextPath;
    }

    $scope.$on("omarSitesState.updated", function(event, params) {
      setWFSOutputDlControllerUrlProps();
    });

    vm.attrFilter = "";

    vm.getDownloadURL = function(outputFormat) {
      vm.url = wfsService.getExport(outputFormat);
      $window.open(vm.url.toString(), "_blank");
    };

    $scope.$on("attrObj.updated", function(event, response) {
      vm.attrFilter = response;
    });

    // Shows/Hides the ISA button based on parameters passed down from application.yml
    vm.isaAppEnabled = AppO2.APP_CONFIG.params.isaApp.enabled;

    vm.goToISA = function() {
      var filter = wfsService.spatialObj.filter;
      if (filter == "") {
        toastr.error("A spatial filter needs to be enabled.");
      } else {
        var pointLatLon;
        mapService.mapPointLatLon();
        if (mapService.pointLatLon) {
          pointLatLon = mapService.pointLatLon;
        } else {
          var center = mapService.getCenter();
          pointLatLon = center
            .slice()
            .reverse()
            .join(",");
        }

        var bbox = mapService.calculateExtent().join(",");
        if (vm.attrFilter) {
          filter += " AND " + vm.attrFilter;
        }
        var isaURL =
          isaRequestUrl +
          "/?bbox=" +
          bbox +
          "&filter=" +
          encodeURIComponent(filter) +
          "&location=" +
          pointLatLon +
          "&maxResults=100";
        $window.open(isaURL, "_blank");
      }
    };

    vm.goToTLV = function() {
      var filter = wfsService.spatialObj.filter;
      if (filter == "") {
        toastr.error("A spatial filter needs to be enabled.");
      } else {
        var pointLatLon;
        mapService.mapPointLatLon();
        if (mapService.pointLatLon) {
          pointLatLon = mapService.pointLatLon;
        } else {
          var center = mapService.getCenter();
          pointLatLon = center
            .slice()
            .reverse()
            .join(",");
        }

        var bbox = mapService.calculateExtent().join(",");
        if (vm.attrFilter) {
          filter += " AND " + vm.attrFilter;
        }

        var tlvURL =
          tlvRequestUrl +
          "/?bbox=" +
          bbox +
          "&filter=" +
          encodeURIComponent(filter) +
          "&location=" +
          pointLatLon +
          "&maxResults=100";
        $window.open(tlvURL, "_blank");
      }
    };

    vm.getGeoRss = () => {
      vm.geoRssAppLink = geoscriptRequestUrl + "/georss?filter=";
      let wfsFilter = "";

      // Checking here for the spatial filter.
      if (
        wfsService.spatialObj.filter ||
        wfsService.spatialObj.filter.length >= 1
      ) {
        wfsFilter = wfsService.spatialObj.filter;
      }

      // Checking here for the attributes filter.
      if (wfsService.attrObj.filter || wfsService.attrObj.filter.length >= 1) {
        // Check to see if we already have a spatial filter in the
        // wfsFilter.  If so we will combine them as a filter.
        if (wfsFilter !== "") {
          wfsFilter += " AND " + wfsService.attrObj.filter;
          return $window.open(
            vm.geoRssAppLink + encodeURIComponent(wfsFilter),
            "_blank"
          );
        }

        // We don't have a spatial filter so we will just make the filter with
        // the attrObj filter.
        wfsFilter = wfsService.attrObj.filter;
        return $window.open(
          vm.geoRssAppLink + encodeURIComponent(wfsFilter),
          "_blank"
        );
      }
      // There isn't a spatial OR a attribute filter.  We will just create an empty filter.
      return $window.open(
        vm.geoRssAppLink + encodeURIComponent(wfsFilter),
        "_blank"
      );
    };
  }
})();
