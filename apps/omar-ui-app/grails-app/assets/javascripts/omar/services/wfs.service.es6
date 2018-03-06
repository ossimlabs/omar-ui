(function() {
  "use strict";
  angular
    .module("omarApp")
    .service("wfsService", [
      "stateService",
      "$rootScope",
      "$http",
      "$timeout",
      "$log",
      wfsService
    ]);

  function wfsService(stateService, $rootScope, $http, $timeout, $log) {
    // #################################################################################
    // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
    // provides access to various client params in application.yml
    // #################################################################################
    //console.log('AppO2.APP_CONFIG in wfsService: ', AppO2.APP_CONFIG);

    var wfsBaseUrl, wfsContextPath, wfsRequestUrl;

    /**
     * Description: Called from the listController so that the $on. event that subscribes to the $broadcast
     * can update the WFS url and context path.
     */
    this.setWfsUrlProps = function() {
      wfsBaseUrl = stateService.omarSitesState.url.base;
      wfsContextPath = stateService.omarSitesState.url.wfsContextPath;
      wfsRequestUrl = wfsBaseUrl + wfsContextPath + "/wfs?";
    };
    this.setWfsUrlProps();

    var wfsRequest = {
      typeName: "omar:raster_entry",
      namespace: "http://omar.ossim.org",
      version: "1.1.0",
      outputFormat: "JSON",
      cql: "",
      sortField: "acquisition_date",
      sortType: "+D",
      startIndex: "0",
      maxFeatures: "1000"
    };

    // When this changes it needs to be passed to the executeWfsQuery method
    this.spatialObj = {
      filter: "" // Needs to initially be set as the mapview port
    };

    // When this changes it needs to be passed to the executeWfsQuery method
    this.attrObj = {
      filter: "",
      sortField: "acquisition_date",
      sortType: "+D",
      startIndex: 0,
      pageLimit: 10
    };

    if (AppO2.APP_CONFIG.params.misc.pageLimit != undefined) {
      this.attrObj.pageLimit = AppO2.APP_CONFIG.params.misc.pageLimit;
    }

    this.updateSpatialFilter = function(filter) {
      this.spatialObj.filter = filter;
      $rootScope.$broadcast("spatialObj.updated", filter);
    };

    this.updateAttrFilter = function(filter, sortField, sortType) {
      this.attrObj.filter = filter;

      if (sortField !== undefined) {
        this.attrObj.sortField = sortField;
      }

      if (sortType !== undefined) {
        this.attrObj.sortType = sortType;
      }

      $rootScope.$broadcast("attrObj.updated", filter);
    };

    this.updateAttrFilterPaginate = function(startIndex) {
      var boolUpdate = false;
      if (startIndex !== undefined) {
        if (this.attrObj.startIndex != startIndex) {
          boolUpdate = true;
          this.attrObj.startIndex = startIndex;
        }
      }
      if (boolUpdate) {
        $rootScope.$broadcast("attrObj.updated", this.attrObj.filter);
      }
    };

    this.executeWfsQuery = function() {
      if (this.attrObj.filter === "") {
        // Only send the spatialObj to filter the results
        wfsRequest.cql = this.spatialObj.filter;
      } else if (this.spatialObj.filter === "") {
        // Only send the attrObj to filter the results
        wfsRequest.cql = this.attrObj.filter;
      } else {
        // Filter the results using the spatialObj and the attrObj
        wfsRequest.cql = this.spatialObj.filter + " AND " + this.attrObj.filter;
      }

      wfsRequest.sortField = this.attrObj.sortField;
      wfsRequest.sortType = this.attrObj.sortType;
      wfsRequest.startIndex = this.attrObj.startIndex;
      wfsRequest.pageLimit = this.attrObj.pageLimit;

      var wfsUrl =
        wfsRequestUrl +
        "service=WFS" +
        "&version=" +
        wfsRequest.version +
        "&request=GetFeature" +
        "&typeName=" +
        wfsRequest.typeName +
        "&filter=" +
        encodeURIComponent(wfsRequest.cql) +
        "&outputFormat=" +
        wfsRequest.outputFormat +
        "&sortBy=" +
        wfsRequest.sortField +
        wfsRequest.sortType +
        "&startIndex=" +
        wfsRequest.startIndex +
        "&maxFeatures=" +
        wfsRequest.pageLimit;

      $http({ method: "GET", url: wfsUrl }).then(function(response) {
        var data;
        data = response.data.features;

        // $timeout needed: http://stackoverflow.com/a/18996042
        $timeout(function() {
          $rootScope.$broadcast("wfs: updated", data);

          const imageIdArray = data.map(image => image.properties.id);

          stateService.mapState.featureIds = imageIdArray;
          //console.log('featureIds: ', stateService.mapState.featureIds);
        });
      });

      var wfsFeaturesUrl =
        wfsRequestUrl +
        "service=WFS" +
        "&version=" +
        wfsRequest.version +
        "&request=GetFeature" +
        "&typeName=" +
        wfsRequest.typeName +
        "&filter=" +
        encodeURIComponent(wfsRequest.cql) +
        "&outputFormat=" +
        wfsRequest.outputFormat +
        "&sortBy=" +
        wfsRequest.sortField +
        wfsRequest.sortType +
        "&startIndex=" +
        wfsRequest.startIndex +
        "&resultType=hits";

      $http({ method: "GET", url: wfsFeaturesUrl }).then(function(response) {
        var features;
        features = response.data.totalFeatures;

        // $timeout needed: http://stackoverflow.com/a/18996042
        $timeout(function() {
          $rootScope.$broadcast("wfs features: updated", features);
        });
      });
    };

    this.getImageProperties = function(wfsUrl, filename) {
      // We only want to grab the hostname from the wfsUrl,
      // so that we can put it in the header on the imagespace
      // page.  We are using the following GIST to do this.
      // GIST: https://gist.github.com/jlong/2428561
      var parser = document.createElement("a");
      parser.href = wfsUrl;

      return $http({
        method: "GET",
        url:
          wfsUrl +
          "?filter=" +
          encodeURIComponent("filename LIKE '" + filename + "'") +
          "&outputFormat=JSON" +
          "&request=GetFeature" +
          "&service=WFS" +
          "&typeName=omar:raster_entry" +
          "&version=1.1.0"
      }).then(function(response) {
        var imageData = response.data.features[0];

        function getFileName(file) {
          if (file !== undefined) {
            var filename = file.replace(/^.*[\\\/]/, "");
            return filename;
          }
        }

        var imageIdText =
          imageData.properties.title ||
          getFileName(imageData.properties.filename);
        var acquisitionDateText = imageData.properties.acquisition_date || "";

        if (acquisitionDateText != "") {
          acquisitionDateText =
            moment.utc(acquisitionDateText).format("MM-DD-YYYY HH:mm:ss") +
            " z";
        } else {
          acquisitionDateText = "Unknown";
        }

        // TODO: We need to modify the way this information is bound to the DOM.  It should
        //       be using an Angular model.
        stateService.navStateUpdate({
          titleLeft:
            '<p><span class="text-info">Server: </span>' +
            parser.hostname +
            " </p> " +
            '<p><span class="text-info">Image ID: </span>' +
            imageIdText +
            " </p> " +
            '<p><span class="text-info">Acquisition Date: </span>' +
            acquisitionDateText +
            " </p> ",
          userGuideUrl: "omar-ui/docs/user-guide/omar-ui/#image-space"
        });

        return imageData;
      });
    };
    /**
     * Purpose: Uses the WFS service to returns  list of images in various formats
     *  such as GML, JSON, KML, etc
     *
     * @param outputFormat
     * @param imageListFilter
     */
    this.getExport = (outputFormat, imageListFilter) => {
      $log.debug(
        `getExportImages outputFormat: ${outputFormat}, filter: ${imageListFilter}`
      );

      let wfsFilter;
      // We need to use this as the ONLY filter if an imageListFilter is passed in.
      // The attr and spatial filters have already been accounted for.
      if (imageListFilter) {
        wfsFilter = imageListFilter;
        $log.debug(wfsFilter);
      } else {
        // If we don't have an imageListFilter passed in we need to use the
        // attr and spatial filters.  Checking here for the spatial filter.
        if (this.spatialObj.filter || this.spatialObj.filter.length >= 1) {
          wfsFilter = this.spatialObj.filter;
          $log.debug(wfsFilter);
        }
        // If we don't have an imageListFilter passed in we need to use the
        // attr and spatial filters.  Checking here for the attributes filter.
        // If there isn't an attr or spatial filter set it to an empty string.
        if (this.attrObj.filter || this.attrObj.filter.length >= 1) {
          wfsFilter += " AND " + this.attrObj.filter;
          $log.debug(wfsFilter);
        } else {
          wfsFilter = "";
        }
      }

      $log.debug(`wfsFilter: ${wfsFilter}`);

      let version = "1.1.0";
      let typeName = "omar:raster_entry";
      let wfsUrl =
        wfsRequestUrl +
        "service=WFS" +
        "&version=" +
        version +
        "&request=GetFeature" +
        "&typeName=" +
        typeName +
        "&filter=" +
        encodeURIComponent(wfsFilter) +
        "&outputFormat=" +
        outputFormat +
        "&sortBy=" +
        this.attrObj.sortField +
        this.attrObj.sortType +
        "&startIndex=" +
        this.attrObj.startIndex;

      return wfsUrl;
    };

    this.search = function(filter) {
      var wfsUrl =
        wfsRequestUrl +
        "filter=" +
        encodeURIComponent("title LIKE '%" + filter.toUpperCase() + "%'") +
        "&maxFeatures=" +
        wfsRequest.maxFeatures +
        "&outputFormat=" +
        wfsRequest.outputFormat +
        "&request=GetFeature" +
        "&service=WFS" +
        "&typeName=" +
        wfsRequest.typeName +
        "&version=" +
        wfsRequest.version;

      return $http({ method: "GET", url: wfsUrl }).then(function(response) {
        var features = response.data.features;
        return features;
      });
    };

    this.beSearch = function(geom) {
      var beObj = [];
      var placemarkConfig = AppO2.APP_CONFIG.params.misc.placemarks;

      var beLookupEnabled = placemarkConfig ? true : false;
      var typeName = beLookupEnabled ? placemarkConfig.tableName : null;
      var sortBy = beLookupEnabled ? placemarkConfig.columnName : null;
      var geomName = beLookupEnabled ? placemarkConfig.geomName : null;
      var maxFeatures = beLookupEnabled ? placemarkConfig.maxResults : null;

      var bbox = geom.getExtent().join(",");
      var cql = "bbox(" + geomName + ", " + bbox + ")";

      /**
       * Description: This sets the context path for the beSearchUrl
       * (WFS call).  It tries to pull the path from the APP_CONFIG, but if
       * it is undefined it provides a default
       * @type {string}
       */
      var beSearchUrlContext =
        AppO2.APP_CONFIG.params.sites[0].url.wfsContextPath || "/omar-wfs";

      /**
       * Description: We can use the first item in the sites array here,
       * because this is the main O2 site.  We assume that there is at least
       * one item in the array, because if not, then the entire application
       * will error out.
       * This also assumes that the O2 admin has set the application param
       * beLookupEnabled: true, and that there are valid BE configuration
       * params being passed in.  We can then use the main O2 site
       * information for all federated O2 BE searches.
       *
       * @type {string}
       */
      var beSearchUrl =
        AppO2.APP_CONFIG.params.sites[0].url.base +
        beSearchUrlContext +
        "/wfs?";

      var url =
        beSearchUrl +
        "service=WFS" +
        "&version=1.1.0" +
        "&request=GetFeature" +
        "&typeName=" +
        typeName +
        "&filter=" +
        cql +
        "&outputFormat=JSON" +
        "&sortBy=" +
        sortBy +
        "+A" +
        "&startIndex=0" +
        "&maxFeatures=" +
        maxFeatures;

      $http({ method: "GET", url: url }).then(function(response) {
        var data;
        data = response.data.features;

        // $timeout needed: http://stackoverflow.com/a/18996042
        $timeout(function() {
          $rootScope.$broadcast("placemarks: updated", data);
          beObj = data;
        });
      });
    };
  }
})();
