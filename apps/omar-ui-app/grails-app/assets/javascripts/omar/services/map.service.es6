( function() {
    "use strict";
    angular
    .module( "omarApp" )
    .service( "mapService", [
        "stateService",
        "$stateParams",
        "wfsService",
        "$timeout",
        "$log",
        "$rootScope",
        mapService
    ]);
    function mapService( stateService, $stateParams, wfsService, $timeout, $log, $rootScope ) {
    // #################################################################################
    // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
    // provides access to various client params in application.yml
    // #################################################################################

        var userPreferences = AppO2.APP_CONFIG.userPreferences;
        var urlParams = $stateParams;
        var vm = this;

        var map,
        mapView,
        footPrints,
        autoMosaic,
        searchLayerVector, // Used for visualizing the search items map markers polygon boundaries
        filterLayerVector, // Used for visualizing the filter markers and polygon AOI's
        wktFormat,
        searchFeatureWkt,
        iconStyle,
        wktStyle,
        filterStyle,
        footprintStyle,
        dragBox,
        pointLatLon,
        overlayGroup,
        mosaicGroup;

        var version = "1.1.1";
        var layers = "omar:raster_entry";
        var styles = "byFileType";
        var format = "image/gif";
        var name = "Image Footprints";
        var mapObj = {};

        var baseServerUrl = AppO2.APP_CONFIG.serverURL;
        var markerUrl = baseServerUrl + "/" + AppO2.APP_CONFIG.params.misc.icons.greenMarker;

        // Sets the intial url values for the footprints (geoscript) service
        var footprintsBaseUrl = stateService.omarSitesState.url.base;
        var footprintsContextPath = stateService.omarSitesState.url.geoscriptContextPath;
        var footprintsRequestUrl = footprintsBaseUrl + footprintsContextPath + "/footprints/getFootprints";

        // Sets the initial url values for the thumbnails (oms) service
        var thumbnailsBaseUrl = stateService.omarSitesState.url.base;
        var thumbnailsContextPath = stateService.omarSitesState.url.omsContextPath;
        var thumbnailUrl = thumbnailsBaseUrl + thumbnailsContextPath + "/imageSpace/getThumbnail";

        var wmsBaseUrl = stateService.omarSitesState.url.base;
        var wmsContextPath = stateService.omarSitesState.url.wmsContextPath;
        var wmsRequestUrl = wmsBaseUrl + wmsContextPath + "/wms";
        var autoMosaicRequestUrl = wmsBaseUrl + wmsContextPath + "/mosaic";

        /**
        * Description: Called from the mapController so that the $on. event that subscribes to the $broadcast
        * can update the Geoscript and Thumbnails url and context path(s).
        */
        vm.setMapServiceUrlProps = function() {
            footprintsBaseUrl = stateService.omarSitesState.url.base;
            footprintsContextPath = stateService.omarSitesState.url.geoscriptContextPath;
            footprintsRequestUrl = footprintsBaseUrl + footprintsContextPath + "/footprints/getFootprints";

            thumbnailsBaseUrl = stateService.omarSitesState.url.base;
            thumbnailsContextPath = stateService.omarSitesState.url.omsContextPath;
            thumbnailUrl = thumbnailsBaseUrl + thumbnailsContextPath + "/imageSpace/getThumbnail";

            wmsBaseUrl = stateService.omarSitesState.url.base;
            wmsContextPath = stateService.omarSitesState.url.wmsContextPath;
            wmsRequestUrl = wmsBaseUrl + wmsContextPath + "/wms";
            autoMosaicRequestUrl = wmsBaseUrl + wmsContextPath + "/mosaic";

            clearSelectedMosaicImages();
        };

        iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 46],
                anchorXUnits: "fraction",
                anchorYUnits: "pixels",
                src: markerUrl
            })
        });

        wktStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255, 100, 50, 0.2)"
            }),
            stroke: new ol.style.Stroke({
                width: 1.5,
                color: "rgba(255, 100, 50, 0.6)"
            })
        });

        filterStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255, 100, 50, 0.2)"
            }),
            stroke: new ol.style.Stroke({
                width: 5.0,
                color: "rgba(255, 100, 50, 0.6)"
            })
        });

        footprintStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255, 100, 50, 0.6)"
            }),
            stroke: new ol.style.Stroke({
                width: 5.5
            })
        });

        searchLayerVector = new ol.layer.Vector({
            source: new ol.source.Vector({ wrapX: false })
        });

        filterLayerVector = new ol.layer.Vector({
            source: new ol.source.Vector({ wrapX: false })
        });
        vm.getFilterVectorGeometry = function() {
            return filterLayerVector.getSource().getFeatures()[ 0 ].getGeometry();
        }

        /**
        * Elements that make up the popup.
        */
        var container = document.getElementById("popup");
        var content = document.getElementById("popup-content");

        /**
        * Create an overlay to anchor the popup to the map.
        */
        var overlay = new ol.Overlay({
            element: container
        });

        vm.mapInit = function() {
            var mapCenterX = userPreferences.o2SearchPreference.mapCenterX;
            if ( urlParams.mapCenterX ) {
                mapCenterX = parseFloat( urlParams.mapCenterX );
            }
            var mapCenterY = userPreferences.o2SearchPreference.mapCenterY;
            if ( urlParams.mapCenterY ) {
                mapCenterY = parseFloat( urlParams.mapCenterY );
            }
            var rotation = userPreferences.o2SearchPreference.mapRotation;
            if ( urlParams.mapRotation ) {
                rotation = parseFloat( urlParams.mapRotation ) * Math.PI / 180;
            }
            var zoom = userPreferences.o2SearchPreference.mapZoom;
            if ( urlParams.mapZoom ) {
                zoom = parseInt( urlParams.mapZoom );
            }

            mapView = new ol.View({
                center: [ mapCenterX, mapCenterY ],
                extent: [-180, -90, 180, 90],
                maxZoom: 20,
                minZoom: 2,
                projection: "EPSG:4326",
                rotation: rotation,
                zoom: zoom
            });

            if ( AppO2.APP_CONFIG.params.footprints.params != undefined ) {
                if ( AppO2.APP_CONFIG.params.footprints.params.version != undefined ) {
                    version = AppO2.APP_CONFIG.params.footprints.params.version;
                }
                if ( AppO2.APP_CONFIG.params.footprints.params.layers != undefined ) {
                    layers = AppO2.APP_CONFIG.params.footprints.params.layers;
                }
                if ( AppO2.APP_CONFIG.params.footprints.params.styles != undefined ) {
                    styles = AppO2.APP_CONFIG.params.footprints.params.styles;
                }
                if ( AppO2.APP_CONFIG.params.footprints.params.format != undefined ) {
                    format = AppO2.APP_CONFIG.params.footprints.params.format;
                }
                if ( AppO2.APP_CONFIG.params.footprints.params.name != undefined ) {
                    name = AppO2.APP_CONFIG.params.footprints.params.name;
                }
            }

            footPrints = new ol.layer.Tile({
                title: name,
                source: new ol.source.TileWMS({
                    url: footprintsRequestUrl,
                    params: {
                        FILTER: "",
                        VERSION: version,
                        LAYERS: layers,
                        STYLES: styles,
                        FORMAT: format
                    },
                    wrapX: false
                }),
                name: "Image Footprints"
            });

            var footprintsSource = footPrints.getSource();

            /* Adding Auto Mosaic */
            autoMosaic = new ol.layer.Tile({
                title: "Auto",
                source: new ol.source.TileWMS({
                    url: autoMosaicRequestUrl,
                    params: {
                        FILTER: "",
                        VERSION: version,
                        LAYERS: layers,
                        STYLES: styles,
                        FORMAT: format
                    },
                    wrapX: false
                }),
                name: "Auto",
                visible: false
            });

            var autoMosaicSource = autoMosaic.getSource();

            /**
            * Renders a progress icon.
            * @param {Element} el The target element.
            * @constructor
            */
            function Progress(el) {
                this.el = el;
                this.loading = 0;
                this.loaded = 0;
            }

            /**
            * Increment the count of loading tiles.
            */
            Progress.prototype.addLoading = function() {
                if (this.loading === 0) {
                    this.show();
                }
                ++this.loading;
                this.update();
            };

      /**
       * Increment the count of loaded tiles.
       */
      Progress.prototype.addLoaded = function() {
        var this_ = this;
        setTimeout(function() {
          ++this_.loaded;
          this_.update();
        }, 100);
      };

      /**
       * Update the progress icon.
       */
      Progress.prototype.update = function() {
        if (this.loading === this.loaded) {
          this.loading = 0;
          this.loaded = 0;
          var this_ = this;
          setTimeout(function() {
            this_.hide();
          }, 500);
        }
      };

      /**
       * Show the progress icon.
       */
      Progress.prototype.show = function() {
        this.el.style.visibility = "visible";
      };

      /**
       * Hide the progress icon.
       */
      Progress.prototype.hide = function() {
        if (this.loading === this.loaded) {
          this.el.style.visibility = "hidden";
        }
      };

      var progress = new Progress(document.getElementById("progress"));

      footprintsSource.on("tileloadstart", function() {
        progress.addLoading();
      });

      footprintsSource.on("tileloadend", function() {
        progress.addLoaded();
      });

      footprintsSource.on("tileloaderror", function() {
        progress.addLoaded();
      });

      autoMosaicSource.on("tileloadstart", function() {
        progress.addLoading();
      });

      autoMosaicSource.on("tileloadend", function() {
        progress.addLoaded();
      });

      autoMosaicSource.on("tileloaderror", function() {
        progress.addLoaded();
      });

      var baseMapGroup = new ol.layer.Group({
        title: "Base maps",
        layers: []
      });

      mosaicGroup = new ol.layer.Group({
        title: "Mosaics",
        layers: []
      });

      mosaicGroup.getLayers().push(autoMosaic);

      // Takes a map layer obj, and adds
      // the layer to the map layers array.
      function addBaseMapLayers(layerObj) {
        var baseMapLayer;

        switch (layerObj.layerType.toLowerCase()) {
          case "imagewms":
            baseMapLayer = new ol.layer.Image({
              title: layerObj.title,
              type: "base",
              visible: layerObj.options.visible,
              source: new ol.source.ImageWMS({
                url: layerObj.url,
                params: {
                  VERSION: "1.1.1",
                  LAYERS: layerObj.params.layers,
                  FORMAT: layerObj.params.format
                },
                wrapX: false
              }),
              name: layerObj.title
            });
            break;
          case "tilewms":
            baseMapLayer = new ol.layer.Tile({
              title: layerObj.title,
              type: "base",
              visible: layerObj.options.visible,
              source: new ol.source.TileWMS({
                url: layerObj.url,
                params: {
                  VERSION: "1.1.1",
                  LAYERS: layerObj.params.layers,
                  FORMAT: layerObj.params.format
                },
                wrapX: false
              }),
              name: layerObj.title
            });
            break;
          case "xyz":
            baseMapLayer = new ol.layer.Tile({
              title: layerObj.title,
              type: "base",
              visible: layerObj.options.visible,
              source: new ol.source.XYZ({
                url: layerObj.url,
                wrapX: false
              }),
              name: layerObj.title
            });
            break;
        }

        if (baseMapLayer != null) {
          // Add layer(s) to the layerSwitcher control
          baseMapGroup.getLayers().push(baseMapLayer);
        }
      }

      overlayGroup = new ol.layer.Group({
        title: "Overlays",
        layers: []
      });

      // Takes a layer obj, and adds
      // the layer to the overlay layers array.
      function addOverlayLayers(layerObj) {
        var params = {};
        $.each(layerObj.params, function(key, value) {
          // identify heat map layer
          if (
            key.toLowerCase().search(/date/) > -1 &&
            value.search(/\d/) > -1
          ) {
            var time = value.split(" ")[0];
            var interval = value.split(" ")[1];
            value = moment()
              .subtract(time, interval)
              .format("YYYY-MM-DDTHH:mm:ss.SSS");
          }
          params[key] = value;
        });

        var overlayMapLayer;
        if (layerObj.layerType.toLowerCase() == "imagewms") {
          overlayMapLayer = new ol.layer.Image({
            title: layerObj.title,
            visible: layerObj.options.visible,
            source: new ol.source.ImageWMS({
              url: layerObj.url,
              params: params
            })
          });
        } else {
          overlayMapLayer = new ol.layer.Tile({
            title: layerObj.title,
            visible: layerObj.options.visible,
            source: new ol.source.TileWMS({
              url: layerObj.url,
              params: params
            })
          });
        }

        overlayGroup.getLayers().push(overlayMapLayer);
      }

      if (AppO2.APP_CONFIG.openlayers.baseMaps != null) {
        // Map over each map item in the baseMaps array
        AppO2.APP_CONFIG.openlayers.baseMaps.map(addBaseMapLayers);
      }
      if (AppO2.APP_CONFIG.openlayers.overlayLayers != null) {
        // Map over each layer item in the overlayLayers array
        AppO2.APP_CONFIG.openlayers.overlayLayers.map(addOverlayLayers);
      }
      overlayGroup.getLayers().push(footPrints);

      map = new ol.Map({
        layers: [baseMapGroup, mosaicGroup, overlayGroup],
        controls: ol.control
          .defaults({ attribution: false })
          .extend([
            new ol.control.ScaleLine(),
            mousePositionControl,
            new LegendControl()
          ]),
        logo: false,
        overlays: [overlay],
        target: "map",
        view: mapView
      });

        var featureSelectLayer = new ol.layer.Vector({
            source: new ol.source.Vector({ wrapX: false })
        });
        map.addLayer( featureSelectLayer );
        map.on( "click", function( event ) {
            overlay.setPosition( event.coordinate );
            wfsService.executeWfsPointQuery( event.coordinate );
        });
        $rootScope.$on( "wfs point: updated", function( event, data, coordinate ) {
            if ( data.length > 0 ) {
                var geoJsonReader = new ol.format.GeoJSON();
                var features= [];
                $.each( data, function( index, feature ) {
                    var feature = geoJsonReader.readFeature( feature );
                    features.push( feature );
                });
                var vectorSource = new ol.source.Vector({
                    features: features
                });

                var closestFeature = vectorSource.getClosestFeatureToCoordinate( coordinate );
                vm.mapShowImageFootprint( closestFeature );
            }
            else {
                vm.mapRemoveImageFootprint();
            }
        });

      setupContextDialog();

      function setupContextDialog() {
        map.getViewport().addEventListener("contextmenu", function(event) {
          event.preventDefault();
          var pixel = [event.layerX, event.layerY];
          var coord = map.getCoordinateFromPixel(pixel);
          if (coord) {
            var point = new GeoPoint(coord[0], coord[1]);
            var ddPoint =
              point.getLatDec().toFixed(6) +
              ", " +
              point.getLonDec().toFixed(6);
            var dmsPoint = point.getLatDegCard() + " " + point.getLonDegCard();
            var mgrsPoint = mgrs.forward(coord, 5);
            $("#contextMenuDialog .modal-body").html(
              ddPoint + " // " + dmsPoint + " // " + mgrsPoint
            );
            $("#contextMenuDialog").modal("show");
          }
        });
      }

      var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: "Layers" // Optional label for button
      });
      map.addControl(layerSwitcher);

      map.addLayer(searchLayerVector);
      map.addLayer(filterLayerVector);

      dragBox = new ol.interaction.DragBox({
        condition: ol.events.condition.altKeyOnly
      });

        dragBox.on( "boxend", function() {
            var dragBoxGeometry = dragBox.getGeometry();
            vm.dragBoxEnd( dragBoxGeometry );
        });

        var spatial = urlParams.spatial || userPreferences.o2SearchPreference.spatial;
        if ( spatial.toLowerCase() == "mapview" ) {
            vm.viewPortFilter( true );
        }
    };

    vm.dragBoxEnd = function( geometry ) {
        clearLayerSource( filterLayerVector );

        var extent = geometry.getExtent();

        mapObj.cql = "INTERSECTS(ground_geom," + convertToWktPolygon( extent ) + ")";

        // Update the image cards in the list via spatial click coordinates
        wfsService.updateSpatialFilter(mapObj.cql);

        // Grabs the current value of the attrObj.filter so that the click
        // will also update if there are any temporal, keyword, or range filters
        wfsService.updateAttrFilter(wfsService.attrObj.filter);

        var searchPolygon = new ol.Feature({
          geometry: new ol.geom.Polygon.fromExtent( extent )
        });

        searchPolygon.setStyle( filterStyle );
        filterLayerVector.getSource().addFeatures( [ searchPolygon ] );
    };

    let selectedImagesArray = [];
    let imageLayer;
    let initialParams = {
      SERVICE: "WMS",
      VERSION: "1.1.1",
      LAYERS: "omar:raster_entry",
      FORMAT: "image/png",
      FILTER: "",
      STYLES: JSON.stringify({
        bands: "default",
        histCenterTile: false,
        histOp: "auto-minmax",
        resamplerFilter: "bilinear",
        nullPixelFlip: false
      })
    };

    let updatedParams, selectedImages, mosaicCql;

    /**
     * Purpose: Takes an image id, and adds it to an Openlayers
     * TileWMS source.  The Tile layer is used to hold the
     * selected images as a mosaic from the WMS service.
     *
     * The layer participates in the mosaicGroup layer
     * @param id
     */
    const addSelectedImageAsLayer = id => {
      let mosaicCql = "INTERSECTS(ground_geom," + convertToWktPolygon( getMapBbox() ) + ")";

      // Check to see if imageLayer exists as an OL layer yet
      if (imageLayer === undefined) {
        imageLayer = new ol.layer.Tile({
          title: "Custom",
          source: new ol.source.TileWMS({
            url: wmsRequestUrl,
            params: initialParams,
            wrapX: false
          }),
          name: "Custom"
        });
        //map.addLayer(imageLayer);
        mosaicGroup.getLayers().push(imageLayer);
      }
      // We need to check to make sure that the associated id
      // isn't already in the array.  If it is we do not want to
      // add it again
      if (selectedImagesArray.find(num => id === num)) {
        return;
      } else {
        selectedImagesArray.push(id);

        getSelectedImages(id);

        updatedParams = imageLayer.getSource().getParams();
        updatedParams.FILTER = `${mosaicCql}`;
        updatedParams.LAYERS = selectedImages;
        imageLayer.getSource().updateParams(updatedParams);
      }
    };

    vm.addSelectedImageAsLayer = id => {
      addSelectedImageAsLayer(id);
    };

    /**
     * Purpose: Takes an image id, and removes it from the selectedImagesArray.
     * It updates the Openlayers imageLayer, and updates its parameters so that
     * the image no longer appears in the mosaic.
     * @param id
     */
    const removeSelectedImageLayer = id => {
      selectedImagesArray.find(num => {
        if (num === id) {
          let i = selectedImagesArray.indexOf(id);
          if (i != -1) {
            selectedImagesArray.splice(i, 1);
          }
        }
      });

      getSelectedImages(id);

      updatedParams.LAYERS = selectedImages;
      imageLayer.getSource().updateParams(updatedParams);

      // If we have removed all items from the Mosaic layer collection we need to
      // remove it from the Group layer
      if (selectedImagesArray.length < 1) {
        mosaicGroup.getLayers().forEach(function(layer) {
          if (
            layer.get("name") != undefined &&
            layer.get("name") === "Custom"
          ) {
            mosaicGroup.getLayers().pop(layer);

            if (imageLayer !== undefined) {
              // Sets the URL to the currently federated O2
              updatedParams.FILTER = "";
              updatedParams.LAYERS = "";
              imageLayer.getSource().updateParams(updatedParams);
              imageLayer = undefined;
            }
          }
        });
      }
    };

    vm.removeSelectedImageLayer = id => {
      removeSelectedImageLayer(id);
    };

    /**
     * Purpose: Takes an image db id, and builds up an array that can
     * be used to pass an array of image id's with the omar:raster_entry table
     * into the LAYERS param on the WMS
     *
     * @param id
     */
    const getSelectedImages = id => {
      return (selectedImages = selectedImagesArray
        .map(id => {
          return "omar:raster_entry." + id;
        })
        .reverse()
        .toString());
    };

    /**
     * Purpose: Uses the WFS service to obtain the extent for a given image.
     * It then uses the returned extent to zoom the map there
     * @param id
     */
    const zoomToSelectedImages = ids => {
      wfsService.getImagesExtent(ids).then(function(response) {
        const imageArray = response.geometry.coordinates[0][0];

        let polygon = new ol.geom.Polygon([imageArray]);

        // Moves the map to the extent of the search item
        var options = {
          duration: 1000,
          size: map.getSize()
        };
        map.getView().fit(polygon.getExtent(), options);
      });
    };

    $rootScope.$on( "zoomExtent", function( event, image ) { console.dir("cheese");
        zoomToSelectedImages( image.properties.id )
    });
    vm.zoomToSelectedImages = ids => {
      zoomToSelectedImages(ids);
    };

    /**
     * Purpose: Clears all of the selected images in the mosaic array.
     * It does this by updating the filter parameters for the imageLayer
     * to an empty string. It also removes the 'Custom' layer from the
     * mosaicGroup layer
     */
    const clearSelectedMosaicImages = () => {
      selectedImagesArray = [];
      mosaicGroup.getLayers().forEach(function(layer) {
        if (layer.get("name") != undefined && layer.get("name") === "Custom") {
          mosaicGroup.getLayers().pop(layer);
        }
      });

      if (imageLayer !== undefined) {
        // Sets the URL to the currently federated O2
        updatedParams.FILTER = "";
        imageLayer.getSource().updateParams(updatedParams);
        imageLayer = undefined;
      }
    };

    vm.clearSelectedMosaicImages = () => {
      clearSelectedMosaicImages();
    };

    vm.clearSelectedImages = vm.zoomMap = function(params) {
      if (params.feature.wkt !== undefined) {
        zoomToExt(params);
      } else {
        zoomTo(params, true);
      }
    };

    function updateFootPrints(filter) {
      var params = footPrints.getSource().getParams();
      params.FILTER = filter;
      footPrints.getSource().updateParams(params);
      footPrints
        .getSource()
        .setTileLoadFunction(footPrints.getSource().getTileLoadFunction());
    }

    vm.updateFootPrintLayer = function(filter) {
      updateFootPrints(filter);
    };

    function updateFootprintsUrl() {
      footPrints.getSource().setUrl(footprintsRequestUrl);
    }

    vm.updateFootprintsUrl = function() {
      updateFootprintsUrl();
    };

    function updateAutoMosaic(filter) {
      var params = autoMosaic.getSource().getParams();
      autoMosaic.FILTER = filter;
      autoMosaic.getSource().updateParams(params);
      autoMosaic
        .getSource()
        .setTileLoadFunction(autoMosaic.getSource().getTileLoadFunction());
    }

    vm.updateAutoMosaicLayer = function(filter) {
      updateAutoMosaic(filter);
    };

    function updateAutoMosaicRequestUrl() {
      autoMosaic.getSource().setUrl(autoMosaicRequestUrl);
    }

    vm.autoMosaicRequestUrl = function() {
      updateAutoMosaicRequestUrl();
    };

    /**
     * This is used to select images by creating a polygon based on the
     * current map extent and sending it to the wfs service to update the
     * card list
     */
    function filterByViewPort() {
      clearLayerSource(filterLayerVector);

      mapObj.cql = "INTERSECTS(ground_geom," + convertToWktPolygon( getMapBbox() ) + ")";

      // Update the image cards in the list via spatial bounds
      wfsService.updateSpatialFilter(mapObj.cql);
    }

    vm.viewPortFilter = function(status) {
      if (status) {
        map.on("moveend", filterByViewPort);
        filterByViewPort();
      } else {
        // https://groups.google.com/d/msg/ol3-dev/Z4JoCBs-iEY/HSpihl8bcVIJ
        map.un("moveend", filterByViewPort);
        clearLayerSource(filterLayerVector);

        wfsService.updateSpatialFilter("");
      }
    };

    /**
     * This is used to select images by getting the point the user clicked in
     * the map and sending the XY (point) to the wfs service to update the card
     * list
     */
    this.filterByPoint = function( event ) {
      clearLayerSource(filterLayerVector);

      var coordinate = event.coordinate;

      var clickCoordinates = coordinate[0] + " " + coordinate[1];

      pointLatLon = coordinate[1] + "," + coordinate[0];

      mapObj.cql = "INTERSECTS(ground_geom,POINT(" + clickCoordinates + "))";

      // Update the image cards in the list via spatial click coordinates
      wfsService.updateSpatialFilter(mapObj.cql);

      /**
       * Grabs the current value of the attrObj.filter so that the click
       * will also update if there are any temporal, keyword, or range filters
       */
      wfsService.updateAttrFilter(wfsService.attrObj.filter);

      addMarker(coordinate[1], coordinate[0], filterLayerVector);
    }

    this.mapPointLatLon = function() {
      this.pointLatLon = pointLatLon;
    };

    this.pointFilter = function(status) {
      if (status) {
        map.on("singleclick", this.filterByPoint);
      } else {
        // https://groups.google.com/d/msg/ol3-dev/Z4JoCBs-iEY/HSpihl8bcVIJ
        map.un("singleclick", this.filterByPoint);
        clearLayerSource(searchLayerVector);
        wfsService.updateAttrFilter(wfsService.attrObj.filter);
      }
    };

    this.polygonFilter = function(status) {
      if (status) {
        map.addInteraction(dragBox);
      } else {
        // Remove interaction
        map.removeInteraction(dragBox);
        clearLayerSource(filterLayerVector);
      }
    };

    this.mapShowImageFootprint = function( imageObj ) {
        clearLayerSource( searchLayerVector );

        if ( imageObj.getProperties ) {
            imageObj = JSON.parse( new ol.format.GeoJSON().writeFeature( imageObj ) );
        }

        var coordinates = imageObj.geometry.coordinates;
        var properties = imageObj.properties;
        if ( properties.acquisition_date ) {
            var date = properties.acquisition_date;
            properties.acquisition_date = moment( date ).format( "MM/DD/YYYY HH:mm:ss" );
        }

        var footprintFeature = new ol.Feature({
            geometry: new ol.geom.MultiPolygon( coordinates )
        });

        var color = setFootprintColors( properties.file_type );
        footprintStyle.getFill().setColor( color );
        footprintStyle.getStroke().setColor( color );
        footprintFeature.setStyle( footprintStyle );

        searchLayerVector.getSource().addFeature( footprintFeature );

        var mediaDiv = document.createElement( "div" );
        $( mediaDiv ).addClass( "media" );

        var leftDiv = document.createElement( "div" );
        $( leftDiv ).addClass( "media-left" );
        var image = document.createElement( "img" );
        var thumbnailParams = {
            entry: properties.entry_id,
            filename: properties.filename,
            format: "jpeg",
            id: properties.id,
            size: 114
        };
        $( image ).attr( "src", thumbnailUrl + '?' + $.param( thumbnailParams ) );
        $( leftDiv ).append( image );
        $( mediaDiv ).append( leftDiv );

        var bodyDiv = document.createElement( "div" );
        $( bodyDiv ).addClass( "media-body" );
        $.each([
            { key: "title", label: "Image ID:&nbsp;" },
            { key: "acquisition_date", label: "Acq. Date:&nbsp;" },
            { key: "niirs", label: "NIIRS:&nbsp;" },
            { key: "sensor_id", label: "Sensor:&nbsp;" }
        ], function( index, value ) {
            var small = document.createElement( "small" );

            var span = document.createElement( "span" );
            $( span ).html( value.label );
            $( small ).append( span );

            var span = document.createElement( "span" );
            $( span ).addClass( properties[ value.key ] ? "text-success" : "text-info" );
            $( span ).html( properties[ value.key ] || "Unkown" );
            $( small ).append( span );

            $( bodyDiv ).append( small );
            $( bodyDiv ).append( "<br>" );
        });

        $( mediaDiv ).append( bodyDiv );
        $( content ).html( mediaDiv );
        $( content ).append( "<br>" );

        $.each([
            { broadcast: "zoomExtent", icon: "fa fa-arrows", preference: "zoomToImageExtentButton" },
            { broadcast: "viewImageMetadata", icon: "fa fa-table", preference: "viewMetadataButton" },
            { broadcast: "viewOrtho", icon: "fa fa-history", preference: "viewOrthoImageButton" },
            { broadcast: "downloadKml", icon: "fa fa-map", preference: "downloadKmlButton" },
            { broadcast: "shareLink", icon: "fa fa-share-alt", preference: "shareLinkButton" },
            { broadcast: "download", icon: "fa fa-download", preference: "downloadImageButton" },
            { broadcast: "jpipImage", icon: "fa fa-file-image-o", preference: "jpipImageButton" },
            { broadcast: "jpipOrtho", icon: "fa fa-image", preference: "jpipOrthoButton" },
            { broadcast: "copyWms", icon: "fa fa-clipboard", preference: "copyWmsButton" }
        ], function( index, value ) {
            if ( userPreferences.o2SearchPreference[ value.preference ] ) {
                var button = document.createElement( "button" );
                $( button ).addClass( "btn btn-default btn-sm" );
                $( button ).click( function() {
                    $rootScope.$broadcast( value.broadcast, imageObj );
                });
                $( button ).html( "<span class = '" + value.icon + " text-default'></span>" );
                $( content ).append( button );
            }
        });

        var extent = footprintFeature.getGeometry().getExtent();
        var position = overlay.getPosition();
        if ( !position || !ol.extent.containsCoordinate( extent, position ) ) {
            var center = new ol.extent.getCenter( extent );
            overlay.setPosition( center );
        }
        $( container ).css( "background-color", $( "body" ).css( "background-color" ) );
        $( container ).css( "display", "block" );
    };

    this.mapRemoveImageFootprint = function() {
      clearLayerSource(searchLayerVector);
      overlay.setPosition(undefined);
      container.style.display = "none";
    };

    this.getCenter = function() {
      return map.getView().getCenter();
    };

    this.getMap = function() {
        return map;
    };

    this.getRotation = function() {
      return map.getView().getRotation();
    };

    this.getZoom = function() {
      return map.getView().getZoom();
    };

    this.calculateExtent = function() {
      return map.getView().calculateExtent(map.getSize());
    };

    function getMapBbox() {
      return map.getView().calculateExtent(map.getSize());
    }

    function convertToWktPolygon(extent) {
      //var extent = getMapBbox();

      var minX = extent[0];
      var minY = extent[1];
      var maxX = extent[2];
      var maxY = extent[3];

      var wkt = "POLYGON((" +
        minX + " " + minY + ", " +
        minX + " " + maxY + ", " +
        maxX + " " + maxY + ", " +
        maxX + " " + minY + ", " +
        minX + " " + minY +
        "))";

      return wkt;
    }

    function zoomTo(params, feature) {
      if (!feature) {
        map
          .getView()
          .setCenter([
            parseFloat(params.center.lng),
            parseFloat(params.center.lat)
          ]);
        map.getView().setZoom(stateService.mapState.zoom);
      } else {
        map.getView().setZoom(12);
        map
          .getView()
          .setCenter([
            parseFloat(params.feature.lng),
            parseFloat(params.feature.lat)
          ]);

        addMarker(
          parseFloat(params.feature.lat),
          parseFloat(params.feature.lng),
          searchLayerVector
        );
      }

      resetFeatureMapStateObj();
    }

    function resetFeatureMapStateObj() {
      stateService.resetFeatureMapState();
    }

    function zoomToExt(inputExtent) {
      clearLayerSource(searchLayerVector);

      var neFeature = new ol.Feature({
        geometry: new ol.geom.Point([
          inputExtent.feature.bounds.ne.lng,
          inputExtent.feature.bounds.ne.lat
        ])
      });

      var swFeature = new ol.Feature({
        geometry: new ol.geom.Point([
          inputExtent.feature.bounds.sw.lng,
          inputExtent.feature.bounds.sw.lat
        ])
      });

      searchLayerVector.getSource().addFeatures([neFeature, swFeature]);

      var searchItemExtent = searchLayerVector.getSource().getExtent();

      // Moves the map to the extent of the search item
      map.getView().fit(searchItemExtent, map.getSize());

      // Clean up the searchLayer extent for the next query
      searchLayerVector.getSource().clear();

      // Add the WKT to the map to illustrate the boundary of the search item
      if (inputExtent.feature.wkt !== undefined) {
        wktFormat = new ol.format.WKT();
        // WKT string is in 4326 so we need to reproject it for the current map
        searchFeatureWkt = wktFormat.readFeature(inputExtent.feature.wkt, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:4326"
        });

        searchFeatureWkt.setStyle(wktStyle);
        searchLayerVector.getSource().addFeatures([searchFeatureWkt]);
      }

      resetFeatureMapStateObj();
    }

    // function zoomAnimate() {
    //   var start = +new Date();

    //   var pan = ol.animation.pan({
    //     duration: 750,
    //     source: map.getView().getCenter(),
    //     start: start
    //   });

    //   var zoom = ol.animation.zoom({
    //     duration: 1000,
    //     resolution: map.getView().getResolution()
    //   });

    //   map.beforeRender(zoom, pan);
    // }

    function clearLayerSource(layer) {
      if (layer.getSource().getFeatures().length >= 1) {
        layer.getSource().clear();
      }
    }

    function addMarker(lat, lon, layer) {
      clearLayerSource(layer);

      var centerFeature = new ol.Feature({
        geometry: new ol.geom.Point([parseFloat(lon), parseFloat(lat)])
      });

      centerFeature.setStyle(iconStyle);
      layer.getSource().addFeatures([centerFeature]);
    }

    function setFootprintColors(imageType) {
      var color = "rgba(255, 255, 50, 0.6)";

      switch (imageType) {
        default:
          color = "rgba(255, 255, 255, 0.6)"; // white
      }

      return color;
    }

    var mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: function(coord) {
        var html = "";
        var point = new GeoPoint(coord[0], coord[1]);
        switch (mousePositionControl.coordFormat) {
          // dd
          case 0:
            html = coord[1].toFixed(6) + ", " + coord[0].toFixed(6);
            break;
          // dms w/cardinal direction
          //case 1:
            //html = point.getLatDegCard() + ", " + point.getLonDegCard();
            //break;
          // dms w/o cardinal direction
          case 1:
            html = point.getLatDeg() + ", " + point.getLonDeg();
            break;
          // mgrs
          case 2:
            html = mgrs.forward(coord, 5);
            break;
        }
        document.getElementById("mouseCoords").innerHTML = html;
      },
      projection: "EPSG:4326",

      /**
       * comment the following two lines to have the mouse position
       * be placed within the map.
       */
      className: "custom-mouse-position",
      //target: document.getElementById('mouse-position'),
      undefinedHTML: "&nbsp;"
    });

    switch ( userPreferences.coordinateFormat ) {
        case "dd": mousePositionControl.coordFormat = 0; break;
        case "dms": mousePositionControl.coordFormat = 1; break;
        case "mgrs": mousePositionControl.coordFormat = 2; break;
    }
    $( "#mouseCoords" ).click( function() {
        var currentCount = mousePositionControl.coordFormat;
        mousePositionControl.coordFormat = currentCount >= 3 ? 0 : currentCount + 1;
    });

    /**
     * Purpose: Creates a Legend Control using Openlayers
     * inheritance properties
     *
     * */
    let LegendControl = function() {
      let legendButton = document.createElement("button");
      legendButton.innerHTML = "Legend";

      let legendContainer = document.getElementById("legend");
      legendContainer.style.cursor = "pointer";

      // Used to show/hide the Legend
      let handleGetLegend = () => {
        switch (legendContainer.style.display) {
          case "":
            legendContainer.style.display = "block";
            break;
          case "block":
            legendContainer.style.display = "none";
            break;
          case "none":
            legendContainer.style.display = "block";
            break;
          default:
            legendContainer.style.display = "none";
        }
      };

      legendButton.addEventListener("click", handleGetLegend, false);

      let legendContainerElement = document.createElement("div");
      legendContainerElement.className =
        "legend-control ol-unselectable ol-control";

      legendContainerElement.appendChild(legendButton);

      ol.control.Control.call(this, {
        element: legendContainerElement
      });
    };
    ol.inherits(LegendControl, ol.control.Control);
  }
})();
