(function() {
  "use strict";
  angular
    .module("omarApp")
    .controller("ListController", [
      "stateService",
      "wfsService",
      "shareService",
      "downloadService",
      "jpipService",
      "omarMlService",
      "$stateParams",
      "toastr",
      "$uibModal",
      "mapService",
      "avroMetadataService",
      "$scope",
      "$http",
      "$window",
      "$log",
      ListController
    ]);

  function ListController(
    stateService,
    wfsService,
    shareService,
    downloadService,
    jpipService,
    omarMlService,
    $stateParams,
    toastr,
    $uibModal,
    mapService,
    avroMetadataService,
    $scope,
    $http,
    $window,
    $log
  ) {
    // #################################################################################
    // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
    // provides access to various client params in application.yml
    // #################################################################################
    //console.log('AppO2.APP_CONFIG in ListController: ', AppO2.APP_CONFIG);

    /* jshint validthis: true */
    var vm = this;

    vm.userPreferences = AppO2.APP_CONFIG.userPreferences.o2SearchPreference;
    var thumbnailsBaseUrl, thumbnailsContextPath, thumbnailsRequestUrl;
    var wfsBaseUrl, wfsContextPath, wfsRequestUrl;
    var wmsBaseUrl, wmsContextPath, wmsRequestUrl;
    var tlvBaseUrl, tlvContextPath, tlvRequestUrl;
    vm.tlvRequestUrl = "";
    var kmlBaseUrl, kmlContextPath, kmlRequestUrl;
    vm.kmlRequestUrl = "";
    var imageSpaceBaseUrl, imageSpaceContextPath, imageSpaceRequestUrl;
    vm.imageSpaceRequestUrl = "";
    var uiBaseUrl, uiContextPath, uiRequestUrl;
    vm.uiRequestUrl = "";
    var mensaBaseUrl, mensaContextPath, mensaRequestUrl;
    vm.mensaRequestUrl = "";
    var omarMlBaseUrl, omarMlContextPath, omarMlRequestUrl;
    vm.omarMlRequestUrl = "";

    function setlistControllerUrlProps() {
      thumbnailsBaseUrl = stateService.omarSitesState.url.base;
      thumbnailsContextPath = stateService.omarSitesState.url.omsContextPath;
      thumbnailsRequestUrl =
        thumbnailsBaseUrl + thumbnailsContextPath + "/imageSpace/getThumbnail";

      uiBaseUrl = stateService.omarSitesState.url.base;
      uiContextPath = stateService.omarSitesState.url.uiContextPath;
      uiRequestUrl = uiBaseUrl + uiContextPath;

      wfsBaseUrl = stateService.omarSitesState.url.base;
      wfsContextPath = stateService.omarSitesState.url.wfsContextPath;
      wfsRequestUrl = wfsBaseUrl + wfsContextPath + "/wfs";
      vm.wfsRequestUrl = wfsRequestUrl;

      wmsBaseUrl = stateService.omarSitesState.url.base;
      wmsContextPath = stateService.omarSitesState.url.wmsContextPath;
      wmsRequestUrl = wmsBaseUrl + wmsContextPath;
      vm.wmsRequestUrl = wmsRequestUrl;

      tlvBaseUrl = stateService.omarSitesState.url.base;
      tlvContextPath = stateService.omarSitesState.url.tlvContextPath;
      tlvRequestUrl = tlvBaseUrl + tlvContextPath;
      vm.tlvRequestUrl = tlvRequestUrl;

      kmlBaseUrl = stateService.omarSitesState.url.base;
      kmlContextPath = stateService.omarSitesState.url.kmlContextPath;
      kmlRequestUrl = kmlBaseUrl + kmlContextPath + "/superOverlay/createKml/";
      vm.kmlRequestUrl = kmlRequestUrl;

      imageSpaceBaseUrl = stateService.omarSitesState.url.base;
      imageSpaceContextPath = stateService.omarSitesState.url.omsContextPath;
      imageSpaceRequestUrl = imageSpaceBaseUrl + imageSpaceContextPath;
      vm.imageSpaceRequestUrl = imageSpaceRequestUrl;

      uiBaseUrl = stateService.omarSitesState.url.base;
      uiContextPath = stateService.omarSitesState.url.uiContextPath;
      uiRequestUrl = uiBaseUrl + uiContextPath;
      vm.uiRequestUrl = uiRequestUrl;

      mensaBaseUrl = stateService.omarSitesState.url.base;
      mensaContextPath = stateService.omarSitesState.url.mensaContextPath;
      mensaRequestUrl = mensaBaseUrl + mensaContextPath;
      vm.mensaRequestUrl = mensaRequestUrl;

      omarMlBaseUrl = stateService.omarSitesState.url.base;
      omarMlContextPath = stateService.omarSitesState.url.omarMlContextPath;
      omarMlRequestUrl = omarMlBaseUrl + omarMlContextPath;
      vm.omarMlRequestUrl = omarMlRequestUrl;
    }

    vm.getSecurityClassificationClass = function(string) {
      return string ? string.toLowerCase().replace(/\s/g, "-") : "";
    };

    vm.selectedOmar = AppO2.APP_CONFIG.params.sites.o2;

    // The list of urls we want to iterate over
    vm.sites = [];
    $.each( AppO2.APP_CONFIG.params.sites, function( key, site ) {
        vm.sites.push( site );
    } );
    vm.selectedUrl = AppO2.APP_CONFIG.params.sites.o2.info.description;

    // Only show the O2 sites select (dropdown) if there is more than
    // one site in the list
    vm.showSitesSelect = false;
    if (vm.sites.length > 1) {
      vm.showSitesSelect = true;
    }

    /**
     * Description: Updates the omar (o2) sites object from the select/dropdown
     */
    vm.changeOmarSiteUrl = function() {
      stateService.updateSitesAppState({
        infoName: vm.selectedOmar.info.name,
        infoDescription: vm.selectedOmar.info.description,
        urlBase: vm.selectedOmar.url.base,
        urlUiContextPath: vm.selectedOmar.url.uiContextPath,
        urlWfsContextPath: vm.selectedOmar.url.wfsContextPath,
        urlWmsContextPath: vm.selectedOmar.url.wmsContextPath,
        urlOmsContextPath: vm.selectedOmar.url.omsContextPath,
        urlGeoscriptContextPath: vm.selectedOmar.url.geoscriptContextPath,
        urlAvroMetadataContextPath: vm.selectedOmar.url.avroMetadataContextPath,
        urlMensaContextPath: vm.selectedOmar.url.mensaContextPath,
        urlStagerContextPath: vm.selectedOmar.url.stagerContextPath,
        urlDownloadContextPath: vm.selectedOmar.url.downloadContextPath,
        urlKmlContextPath: vm.selectedOmar.url.kmlContextPath,
        urlJpipContextPath: vm.selectedOmar.url.jpipContextPath,
        urlWmtsContextPath: vm.selectedOmar.url.wmtsContextPath,
        urlTlvContextPath: vm.selectedOmar.url.tlvContextPath,
        urlOmarMlContextPath: vm.selectedOmar.url.omarMlContextPath
      });
      // Clears/resets the selected images, because they will not exist on the
      // federated site
      vm.clearSelectedImages();
    };

    /**
     * Sets the initial state for the sites that are loaded into the UI
     */
    stateService.updateSitesAppState({});

    $scope.$on("omarSitesState.updated", function(event, params) {
      setlistControllerUrlProps();
      wfsService.setWfsUrlProps();
      downloadService.setDownloadServiceUrlProps();
      wfsService.executeWfsQuery();
      mapService.updateFootprintsUrl();
      avroMetadataService.setAvroMetadataUrlProps();
      jpipService.setJpipUrlProps();
      omarMlService.setOmarMlUrlProps();

      $scope.$apply(function() {
        thumbnailsBaseUrl = stateService.omarSitesState.url.base;
        thumbnailsContextPath = stateService.omarSitesState.url.omsContextPath;
        thumbnailsRequestUrl =
          thumbnailsBaseUrl +
          thumbnailsContextPath +
          "/imageSpace/getThumbnail";

        // Resets the thumbnails URL for the view
        vm.thumbPath = thumbnailsRequestUrl;
      });
    });

    vm.thumbPath = thumbnailsRequestUrl;
    vm.thumbFilename = "&filename="; // Parameter provided by image.properties.filename
    vm.thumbId = "&id="; // Parameter provided by image.properties.id
    vm.thumbEntry = "&entry="; // Parameter provided by image.properties.entry_id
    vm.thumbSize = "114";
    vm.thumbFormat = "png";
    vm.thumbTransparent = "true";
    vm.padThumbnail = "false";

    vm.getImageSpaceUrl = function(image) {
      var defaults = imageSpaceDefaults;
      var properties = image.properties;
      var params = {
        bands: defaults.bands,
        brightness: defaults.brightness,
        contrast: defaults.contrast,
        entry_id: properties.entry_id,
        filename: properties.filename,
        height: properties.height,
        histOp: defaults.histOp,
        histCenterTile: defaults.histCenterTile,
        imageId: properties.id,
        imageSpaceRequestUrl: imageSpaceRequestUrl,
        mensaRequestUrl: mensaRequestUrl,
        numOfBands: properties.number_of_bands,
        numResLevels: properties.number_of_res_levels,
        resamplerFilter: defaults.resamplerFilter,
        sharpenMode: defaults.sharpenMode,
        showModalSplash: true,
        uiRequestUrl: uiRequestUrl,
        wfsRequestUrl: wfsRequestUrl,
        width: properties.width
      };

      return AppO2.APP_CONFIG.serverURL + "/omar/#/mapImage?" + $.param(params);
    };

    // Shows/Hides the KML SuperOverlay button based on parameters passed down
    // from application.yml
    vm.kmlSuperOverlayAppEnabled = AppO2.APP_CONFIG.params.kmlApp.enabled;
    if (vm.kmlSuperOverlayAppEnabled) {
      vm.kmlSuperOverlayLink = AppO2.APP_CONFIG.params.kmlApp.baseUrl;
    }

    // Shows/Hides the jpip stream button based on parameters passed down
    // from application.yml
    vm.jpipAppEnabled = AppO2.APP_CONFIG.params.jpipApp.enabled;
    if (vm.jpipAppEnabled) {
      vm.jpipLink = AppO2.APP_CONFIG.params.jpipApp.baseUrl;
    }

    vm.o2baseUrl = AppO2.APP_CONFIG.serverURL + "/omar";
    //vm.o2baseUrl = uiRequestUrl + '/omar';

    var imageSpaceDefaults = {
      bands: "default",
      brightness: 0,
      contrast: 1,
      histOp: "auto-minmax",
      histCenterTile: "false",
      resamplerFilter: "bilinear",
      sharpenMode: "none",
      imageRenderType: "tile"
    };

    //used in _map.partial.html.gsp
    vm.imageSpaceDefaults = imageSpaceDefaults;

    vm.displayFootprint = function(obj) {
      //mapService.mapShowImageFootprint(obj);
      mapService.displayFootprint(obj);
    };

    vm.removeFootprint = function() {
      mapService.mapRemoveImageFootprint();
    };

    // Used to hold the currently selected image cards.
    vm.selectedCards = [];

    // Holds the visibility of the selected cards button.
    // It will only be visible if at least one card is
    // selected.
    vm.showSelectedButton = false;

    vm.exportSelectedButtonText = "Export All";

    // This method add or removes selected items from the
    // selectedCards array.
    vm.addRemoveCards = imageId => {
      // Used to find the imageId in the vm.selectedCards
      // array
      // -------------------------------------------------
      // Note: omar/core/array.prototype.js is used as a
      // a polyfill for the .find array method below. It
      // is needed for IE. Boo...
      // -------------------------------------------------
      if (vm.selectedCards.find(num => imageId === num)) {
        // If the item is in the vm.selectedCards array we
        // need to remove it because it is already selected.
        // Now lets unselect (toggle) it.
        let i = vm.selectedCards.indexOf(imageId);
        if (i != -1) {
          vm.selectedCards.splice(i, 1);
        }
        // We also need to remove the image from the map
        mapService.removeSelectedImageLayer(imageId, vm.selectedCards);
      } else {
        // Restrict the number of selected cards to 10
        if (vm.selectedCards.length >= 10) {
          toastr.warning(
            "Maximum number of images have been selected. Please" +
              " review your selections and choose a maximum of 10",
            "Warning:",
            {
              positionClass: "toast-bottom-left",
              closeButton: true,
              timeOut: 10000,
              extendedTimeOut: 5000,
              target: "body"
            }
          );
          return;
        }

        // The imageId is not in the vm.selectedCards array so we
        // need to add it
        vm.selectedCards.push(imageId);

        // The image id is used to add the selected image to the custom
        // mosaic layer in the 'Mosaics' group
        mapService.addSelectedImageAsLayer(imageId);
      }

      // We need to enable the selected menu options if we have one
      // or more image cards selected
      if (vm.selectedCards.length >= 1) {
        vm.exportSelectedButtonText =
          "Selected (" + vm.selectedCards.length + ")";
        vm.showSelectedButton = true;
      } else {
        vm.showSelectedButton = false;
        vm.exportSelectedButtonText = "Export All";
      }
    };

    /**
     * Purpose: Allows the ability to zoom to the selected image. It
     * is wired up to the button on the image card
     * @param id
     */
    vm.zoomToSelectedImage = id => {
      $("a:contains('Map')").trigger("click");
      mapService.zoomToSelectedImages(id);
    };

    // Remove selected items, and reset the DOM
    vm.clearSelectedImages = () => {
      vm.selectedCards = [];
      vm.showSelectedButton = false;
      vm.exportSelectedButtonText = "Export All";
    };

    // Removes the selected images from the mosaic layer.  It is wired up
    // to the Clear Selected item in the 'Selected' dropdown menu
    vm.clearSelectedMosaicImages = () => {
      mapService.clearSelectedMosaicImages();
    };

    /**
     * Purpose: Used for styling on the card checkbox icon.  It
     * looks in the selectedCards array and adds the appropriate
     * icon if it is contained in the array
     * @param imageId
     */
    vm.checkSelectItem = imageId => {
      return $.inArray(imageId, vm.selectedCards) > -1;
    };

    /**
     * Purpose: Uses the downloadService to download up to 10 images
     */
    vm.downloadSelectedImages = () => {
      if (vm.selectedCards.length >= 1 && vm.selectedCards.length <= 10) {
        downloadService.downloadFiles(vm.selectedCards);
        toastr.success(
          "Download started. Please do not close this browser" +
            " until the download is complete.",
          "Success:",
          {
            positionClass: "toast-bottom-left",
            closeButton: true,
            timeOut: 10000,
            extendedTimeOut: 5000,
            target: "body"
          }
        );
      } else if (vm.selectedCards.length > 10) {
        toastr.warning("Please select 10 images or less", "Error:", {
          positionClass: "toast-bottom-left",
          closeButton: true,
          timeOut: 10000,
          extendedTimeOut: 5000,
          target: "body"
        });
        return;
      }
      return;

      //TODO: Add functionality to download all when none are selected
    };

    vm.viewSelectedImagesApp = app => {
      let params = { maxResults: 100 };

      if (vm.selectedCards.length) {
        params.filter = "in(" + vm.selectedCards + ")";
      } else {
        let filters = [];
        if (wfsService.spatialObj.filter != "") {
          filters.push(wfsService.spatialObj.filter);
        }
        if (wfsService.attrObj.filter != "") {
          filters.push(wfsService.attrObj.filter);
        }

        if (filters.length) {
          params.filter = filters.join(" AND ");
        } else {
          params.filter = "index_id IS NOT NULL";
        }
      }

      $window.open(tlvRequestUrl + "?" + $.param(params), "_blank");
    };

    /**
     * Purpose: Takes an output format parameter such as GML, CSV, and passes
     * it to the wfsService to return the results in the desired format
     * @param outputFormat
     */
    vm.exportSelectedImages = outputFormat => {
      $log.debug(`outputFormat: ${outputFormat}`);
      $log.debug(`vm.selectedCards: ${vm.selectedCards}`);

      if (vm.selectedCards.length >= 1) {
        let imageListFilter = "in(" + vm.selectedCards + ")";
        vm.url = wfsService.getExport(outputFormat, imageListFilter);

        $log.debug(`vm.url: ${vm.url}`);
        window.open(vm.url.toString(), "_blank");
      } else {
        vm.getDownloadURL(outputFormat);
      }
    };

    vm.getJpipStream = function($event, file, entry, projCode, index, type) {
      vm.showProcessInfo[index] = true;
      vm.processType = `Creating JPIP     `;

      $log.debug("list.getJpipStream entered...");
      $log.debug("file: " + file);
      $log.debug("entry: " + entry);

      // Get the jpip stream. 3rd arg is projCode.  chip=image space.
      jpipService.getJpipStream($event, file, entry, projCode);

      $scope.$on("jpip: updated", function(event) {
        // Update the DOM (card list)
        $scope.$apply(function() {
          vm.showProcessInfo[index] = false;
        });
      });

      $log.debug("list.getJpipStream exited...");
    };

    vm.currentSortText = "Acquired (New)";
    vm.currentStartIndex = 1;
    vm.pageLimit = 10

    // takes curPage param, which is bound pagination ng-model (1, 2, 3, 4, etc)
    // create the pagination range (pageLimit is typically 10)
    vm.videoPageChange = function(curPage) {
      $scope.curVidStartInd = curPage * vm.pageLimit - vm.pageLimit
    }

    $scope.$watch('curVidStartInd', function() {
      // Kills function on page load.  Watchers fire on init
      if ($scope.videoData.length === 0){
        return
      }
      // Slice up videoData into chunks of 10 for pagination
      $scope.slicedVideoData = $scope.videoData.features.slice($scope.curVidStartInd, $scope.curVidStartInd + vm.pageLimit)
      $("#video-list").animate(
          {
            scrollTop: 0
          },
          "fast"
      );

    });

    vm.pagingChanged = function() {
      wfsService.updateAttrFilterPaginate(
        (vm.currentStartIndex - 1) * wfsService.attrObj.pageLimit
      );
    };

    vm.sortWfs = function(field, type, text) {
      // Sets the text of the current sort method on the sort navbar
      vm.currentSortText = text + "<span class = 'glyphicon glyphicon-arrow-" + ( type == "+D" ? "down" : "up" ) + "'></span>";

      //wfsService.updateAttrFilter(undefined, field, type);
      wfsService.updateAttrFilter(wfsService.attrObj.filter, field, type);
    };
    var sortPreference = vm.userPreferences.resultsSort;
    if (sortPreference) {
      var sortFields = sortPreference.split(",");
      vm.sortWfs(sortFields[0], sortFields[1], sortFields[2]);
    }

    vm.shareModal = function(imageLink) {
      shareService.imageLinkModal(imageLink);
    };

    vm.copyWmsCaps = function(imageId) {
      let imageListFilter = "in(" + imageId + ")";
      let url = wfsService.getExport("WMS130", imageListFilter);
      shareService.imageLinkModal(url, "Copy WMS Capabilities");
    };

    vm.archiveDownload = function(imageId) {
      downloadService.downloadFiles(imageId);
    };

    // We need an $on event here to listen for changes to the
    // wfs.spatial and wfs.attr filters
    $scope.$on("spatialObj.updated", function(event, filter) {
      wfsService.executeWfsQuery();
    });

    $scope.$on("attrObj.updated", function(event, filter) {
      wfsService.executeWfsQuery();
    });

    // need some way of preventing a second hits URL call when pagination changes
    $scope.$on("pagination.updated", function(event, filter) {
      wfsService.executeWfsQuery(false);
    });

    $scope.$on("wfs: updated", function(event, data) {
      // Update the DOM (card list) with the data
      $scope.$apply(function() {
        vm.wfsData = data;
        $("#list").animate(
          {
            scrollTop: 0
          },
          "fast"
        );
        vm.refreshSpin = false;
      });

      vm.listResize = function() {
        var listHeight =
          window.innerHeight -
          $("#list").offset().top -
          $("#pagination").height();
        $("#list").height(listHeight);
      };
      $(window).resize(function() {
        vm.listResize();
      });
      vm.listResize();
    });

    $scope.$on("wfs features: updated", function(event, features) {
      // Update the total feature count
      $scope.$apply(function() {
        vm.wfsFeatures = features;
        if (features != undefined) {
          vm.wfsFeaturesTotalPaginationCount = Math.min(
            1000,
            vm.wfsFeatures
          );
        }

        // add a comma in-between every set of three numbers
        vm.totalWfsFeatures = features
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      });
    });

    vm.openTab = tab => {
      console.log('list.openTab')
      setTimeout(function() {
        $(`[data-target="#${tab}"]`).tab("show");
      }, 250);
    };

    $scope.viewImageMetadata = function(image) {
      vm.showImageModal(
        image,
        vm.imageSpaceDefaults,
        vm.imageSpaceRequestUrl,
        vm.uiRequestUrl,
        vm.mensaRequestUrl,
        vm.wfsRequestUrl,
        vm.tlvRequestUrl,
        vm.kmlRequestUrl
      );
    };

    vm.showImageModal = function(
      imageObj,
      imageSpaceDefaults,
      imageSpaceRequestUrl,
      uiRequestUrl,
      mensaRequestUrl,
      wfsRequestUrl,
      tlvRequestUrl,
      kmlRequestUrl
    ) {
      var modalInstance = $uibModal.open({
        size: "lg",
        templateUrl:
          AppO2.APP_CONFIG.serverURL +
          "/views/list/list.image-card.partial.html",
        controller: [
          "shareService",
          "downloadService",
          "$uibModalInstance",
          "wfsService",
          "avroMetadataService",
          "omarMlService",
          "$scope",
          "imageObj",
          "imageSpaceDefaults",
          "imageSpaceRequestUrl",
          "uiRequestUrl",
          "mensaRequestUrl",
          "wmsRequestUrl",
          "wfsRequestUrl",
          "tlvRequestUrl",
          "kmlRequestUrl",
          "omarMlRequestUrl",
          ImageModalController
        ],
        controllerAs: "vm",
        resolve: {
          imageObj: function() {
            return imageObj;
          },
          imageSpaceDefaults: function() {
            return imageSpaceDefaults;
          },
          imageSpaceRequestUrl: function() {
            return imageSpaceRequestUrl;
          },
          uiRequestUrl: function() {
            return uiRequestUrl;
          },
          mensaRequestUrl: function() {
            return mensaRequestUrl;
          },
          wmsRequestUrl: function() {
            return wmsRequestUrl;
          },
          wfsRequestUrl: function() {
            return wfsRequestUrl;
          },
          tlvRequestUrl: function() {
            return tlvRequestUrl;
          },
          kmlRequestUrl: function() {
            return kmlRequestUrl;
          },
          omarMlRequestUrl: function() {
            return omarMlRequestUrl;
          }
        }
      });
    };

    $scope.viewOrtho = function( image ) {
        vm.viewOrtho(image);
    };

    vm.viewOrtho = function(image) {
      var feature = new ol.format.GeoJSON().readFeature(image);
      var filter = "in(" + feature.getProperties().id + ")";
      var tlvUrl = tlvRequestUrl + "?filter=" + filter;

      window.open(tlvUrl, "_blank");
    };

    $scope.$on("download", function(event, image) {
      vm.archiveDownload(image.properties.id);
    });

    $scope.$on("downloadKml", function(event, image) {
      window.open(vm.kmlRequestUrl + image.properties.id);
    });

    $scope.$on("shareLink", function(event, image) {
      vm.shareModal(vm.getImageSpaceUrl(image));
    });

    $scope.$on("copyWms", function(event, image) {
      vm.copyWmsCaps(image.properties.id);
    });

    $scope.$on("runDetections", function(event, image) {
      vm.submitMLJob(image.properties.id);
    });

    var tlvBaseUrl, tlvContextPath;
    vm.tlvRequestUrl = "";

    var geoscriptBaseUrl, geoscriptContextPath, geoscriptRequestUrl;

    function setWFSOutputDlControllerUrlProps() {
      tlvBaseUrl = stateService.omarSitesState.url.base;
      tlvContextPath = stateService.omarSitesState.url.tlvContextPath;
      tlvRequestUrl = tlvBaseUrl + tlvContextPath;
      vm.tlvRequestUrl = tlvRequestUrl;

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

      // TODO: Figure out if selections are possible
    };
  }

  // Handles the selected image modal obj
  function ImageModalController(
    shareService,
    downloadService,
    $uibModalInstance,
    wfsService,
    avroMetadataService,
    omarMlService,
    $scope,
    imageObj,
    imageSpaceDefaults,
    imageSpaceRequestUrl,
    uiRequestUrl,
    mensaRequestUrl,
    wmsRequestUrl,
    wfsRequestUrl,
    tlvRequestUrl,
    kmlRequestUrl,
    omarMlRequestUrl
  ) {
    var vm = this;

    vm.imageSpaceRequestUrl = imageSpaceRequestUrl;
    vm.uiRequestUrl = uiRequestUrl;
    vm.mensaRequestUrl = mensaRequestUrl;
    vm.wmsRequestUrl = wmsRequestUrl;
    vm.wfsRequestUrl = wfsRequestUrl;

    vm.beData = [];

    vm.selectedImage = imageObj;
    //used in the modal _list.image-card.partial.html.gsp
    vm.imageSpaceDefaults = imageSpaceDefaults;

    //AppO2.APP_PATH is passed down from the .gsp
    vm.o2baseUrlModal = AppO2.APP_CONFIG.serverURL + "/omar";

    vm.placemarkConfig = AppO2.APP_CONFIG.params.misc.placemarks;
    vm.beLookupEnabled = vm.placemarkConfig ? true : false;

    vm.kmlSuperOverlayAppEnabled = AppO2.APP_CONFIG.params.kmlApp.enabled;
    if (vm.kmlSuperOverlayAppEnabled) {
      vm.kmlRequestUrl = kmlRequestUrl;
    }

    var imageSpaceObj = {};

    if (imageObj) {
      imageSpaceObj = {
        filename: imageObj.properties.filename,
        entry: imageObj.properties.entry_id,
        imgWidth: imageObj.properties.width,
        imgHeight: imageObj.properties.height,
        numOfBands: imageObj.properties.number_of_bands,
        id: imageObj.properties.id
      };
    }

    vm.imageMapHelpPopover = {
      zoomHotkey: "SHIFT",
      rotateHotkey: "SHIFT + ALT",
      templateUrl: "imageMapHelpTemplate.html",
      title: "Help"
    };

    vm.getImageSpaceUrl = function(image) {
      var defaults = imageSpaceDefaults;
      var properties = image.properties;
      var params = {
        bands: defaults.bands,
        brightness: defaults.brightness,
        contrast: defaults.contrast,
        entry_id: properties.entry_id,
        filename: properties.filename,
        height: properties.height,
        histOp: defaults.histOp,
        histCenterTile: defaults.histCenterTile,
        imageId: properties.id,
        imageSpaceRequestUrl: imageSpaceRequestUrl,
        mensaRequestUrl: mensaRequestUrl,
        numOfBands: properties.number_of_bands,
        numResLevels: properties.number_of_res_levels,
        resamplerFilter: defaults.resamplerFilter,
        sharpenMode: defaults.sharpenMode,
        showModalSplash: false,
        uiRequestUrl: uiRequestUrl,
        wfsRequestUrl: wfsRequestUrl,
        width: properties.width,
        wmsRequestUrl: wmsRequestUrl
      };

      return AppO2.APP_CONFIG.serverURL + "/omar/#/mapImage?" + $.param(params);
    };

    // Used to show/hide the 'Image not found message'
    vm.showAvroMetadata = true;

    // Executes a query to the omar-avro-metadata service to pull
    // in the associated Avro metadata information
    vm.loadAvroMetadata = function loadAvroMetadata() {
      // Checks to see if there is a valid imageId to pass in
      // otherwise we need to use the image's filename
      if (
        imageObj.properties.title === undefined ||
        imageObj.properties.title === ""
      ) {
        // If there isn't a filename we just return and show the image can not be
        // found message
        if (
          imageObj.properties.filename === undefined ||
          imageObj.properties.filename === ""
        ) {
          // Shows the 'Could not find Avro metadata for the selected image.' message
          vm.showAvroMetadata = false;
          return;
        }

        var fileFullPath = imageObj.properties.filename;
        // Split at the dot so that we can start getting to only the filename
        var fileFullPathSplit = fileFullPath.split(".")[0];
        // Remove the slashes, and the filepath
        var fileName = fileFullPathSplit.replace(/^.*[\\\/]/, "");

        avroMetadataService.getAvroMetadata(fileName);
      } else {
        avroMetadataService.getAvroMetadata(imageObj.properties.title);
      }
    };

    // Updates the data in the Metadata modal after a
    // a user clicks on the Avro tab
    $scope.$on("avroMetadata: updated", function(event, data) {
      // If there isn't any data show the 'not found message'
      if (!data) {
        vm.showAvroMetadata = false;
      } else {
        // Bind the image metadata to the UI
        $scope.$apply(function() {
          vm.avroMetadata = data;

          let out = Object.keys(data).map(item => [item, data[item]]);

          // Takes an array, and breaks it into parts based on the chunkSize
          // that is passed in
          let createGroupedArray = function(arr, chunkSize) {
            let groups = [],
              i;
            for (i = 0; i < arr.length; i += chunkSize) {
              groups.push(arr.slice(i, i + chunkSize));
            }
            return groups;
          };

          // Takes the Avro metadata and splits it into 3 arrays
          let groupedArr = createGroupedArray(out, Object.keys(out).length / 3);

          // Binds the 3 arrays to the associated view models in the UI
          vm.column1 = groupedArr[0];
          vm.column2 = groupedArr[1];
          vm.column3 = groupedArr[2];
        });
      }
    });

    vm.loadBeData = function loadBeData(geom) {
      vm.beData = wfsService.beSearch(
        new ol.geom.MultiPolygon(imageObj.geometry.coordinates)
      );
    };

    vm.calcRes = function calcRes() {
      var bbox = new ol.geom.MultiPolygon(
        vm.selectedImage.geometry.coordinates
      ).getExtent();
      var res = (bbox[2] - bbox[0]) / vm.selectedImage.properties.width;

      return res;
    };

    vm.cancel = function() {
      $uibModalInstance.close("paramObj");
    };

    vm.dismiss = function() {
      $uibModalInstance.dismiss("cancel");
    };

    vm.shareModal = function(imageLink) {
      shareService.imageLinkModal(imageLink);
    };

    vm.archiveDownload = function(imageId, imageFilename) {
      // Remove the file extension and replace with zip.
      var path = imageFilename.split('/');
      var zipFileName = "omar-images-" + path[path.length-1].split('.')[0] + ".zip";
      downloadService.downloadFiles(imageId, zipFileName);
    };

    vm.copyWmsCaps = function(imageId) {
      let imageListFilter = "in(" + imageId + ")";
      let url = wfsService.getExport("WMS130", imageListFilter);
      shareService.imageLinkModal(url, "Copy WMS Capabilities");
    };

    vm.submitMlJob = function(imageId) {
      omarMlService.submitMlJobModal(imageId, imageObj.properties.filename);
    };

    vm.bBoxCheck = true;

    vm.shareWmsGetMap = imageId => {
      let bBox;
      let url = `${wmsRequestUrl}/wms/getMap?service=WMS&version=1.1.1&request=GetMap&layers=omar:raster_entry.${imageId}&srs=epsg:3857&width=256&height=256&transparent=true&format=image/png&bbox=`;

      if (vm.bBoxCheck) {
        wfsService.getImagesExtent(imageId).then(function(response) {
          const polygonExtent = new ol.geom.Polygon([
            response.geometry.coordinates[0][0]
          ]).getExtent();

          bBox = ol.proj.transformExtent(
            polygonExtent,
            "EPSG:4326",
            "EPSG:3857"
          );

          url += bBox;

          shareService.imageLinkModal(url, "Copy WMS GetMap");
        });
      } else {
        // This "{bbox}" string is used in the NOME/rMaps UI as a Custom Overlay
        url += "{bbox}";

        shareService.imageLinkModal(url, "Copy WMS GetMap");
      }
    };

    $scope.$on("placemarks: updated", function(event, data) {
      // Update the DOM (card list)
      $scope.$apply(function() {
        vm.beData = data;
      });
    });
  }
})();
