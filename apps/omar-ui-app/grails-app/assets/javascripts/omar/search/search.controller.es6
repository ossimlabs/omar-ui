(function() {
  //'use strict';
  angular
    .module("omarApp")
    .controller("SearchController", [
      "coordinateConversionService",
      "$scope",
      "$state",
      "wfsService",
      "$http",
      "$stateParams",
      "stateService",
      "$timeout",
      "toastr",
      SearchController
    ]);

  function SearchController(
    coordinateConversionService,
    $scope,
    $state,
    wfsService,
    $http,
    $stateParams,
    stateService,
    $timeout,
    toastr
  ) {
    // #################################################################################
    // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
    // provides access to various client params in application.yml
    // #################################################################################

    // set header title
    stateService.navStateUpdate({
      titleLeft: "<h3>Map</h3>",
      userGuideUrl: "omar-ui/docs/user-guide/omar-ui/#search"
    });

    var vm = this;
    vm.urlParams = $stateParams;

    var searchInput = $("#searchInput");
    searchInput.autocomplete({
      dataType: "json",
      minChars: 3,
      onSelect: function(suggestion) {
        vm.executeSearch();
      },
      serviceUrl:
        AppO2.APP_CONFIG.serverURL +
        AppO2.APP_CONFIG.params.twofishes.proxy +
        "/?responseIncludes=WKT_GEOMETRY_SIMPLIFIED" +
        "&autocomplete=true&maxInterpretations=10&autocompleteBias=BALANCED",
      transformResult: function(response) {
        return formatTwoFishesResponse(response);
      },
      type: "GET"
    });
    searchInput.autocomplete("enable");

    searchInput.keypress(function(event) {
      if (event.keyCode == 13) {
        // pressing Return or Enter
        vm.executeSearch();
      }
    });
    if ( vm.urlParams.mapSearch ) {
        vm.searchInput = vm.urlParams.mapSearch;
        // $timeout needed: http://stackoverflow.com/a/18996042
        $timeout(function() {
            vm.executeSearch();
        });
    }

    function formatTwoFishesResponse(response) {
      return {
        suggestions: $.map(response.interpretations, function(dataItem) {
          return {
            bounds: dataItem.feature.geometry.bounds,
            data: dataItem.feature.displayName,
            lat: dataItem.feature.geometry.center.lat,
            lng: dataItem.feature.geometry.center.lng,
            value: dataItem.feature.displayName,
            wkt: dataItem.feature.geometry.wktGeometrySimplified
          };
        })
      };
    }

    vm.executeSearch = function() {
      var input = searchInput.val().trim();

      wfsService.search(input).then(function(response) {
        if (response && response.length > 0) {
          searchByImageId({ imageId: input, images: response });
        } else {
          coordinateConversionService.convert(input);
        }
      });
    };

    vm.resetSearchInput = function() {
      vm.searchInput = "";
    };

    $scope.$on("coordService: updated", function(event, response) {
      if (response) {
        if (response.bounds) {
          stateService.updateMapState({
            bounds: response.bounds,
            lat: response.coordinate[1],
            lng: response.coordinate[0]
          });
        } else {
          stateService.updateMapState({
            lat: response.coordinate[1],
            lng: response.coordinate[0]
          });
        }
      } else {
        toastr.error("Sorry, we couldn't find anything for that location.");
      }
    });

    $scope.$on("coordService: be_search_error", function(event, message) {
      toastr.error(message, "Error");
    });
    $scope.$on("coordService: twofishes_error", function(event, message) {
      toastr.error(message, "Error");
    });

    function searchByImageId(imageObject) {
      var geometries = [];
      $.each(imageObject.images, function(index, feature) {
        var geometry = new ol.geom.MultiPolygon(feature.geometry.coordinates);
        geometries.push(geometry);
      });
      var geometryCollection = new ol.geom.GeometryCollection(geometries);
      var bounds = geometryCollection.getExtent();
      var center = ol.extent.getCenter(bounds);
      var mapParams = {
        bounds: bounds,
        lat: center[1],
        lng: center[0]
      };
      stateService.updateMapState(mapParams);

      var filter = "title LIKE '%" + imageObject.imageId.toUpperCase() + "%'";
      wfsService.updateAttrFilter(filter);
    }
  }
})();
