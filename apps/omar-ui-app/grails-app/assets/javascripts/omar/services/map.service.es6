(function() {
  "use strict";
  angular
    .module("omarApp")
    .service("mapService", [
      "stateService",
      "wfsService",
      "$timeout",
      "$log",
      mapService
    ]);
  function mapService(stateService, wfsService, $timeout, $log) {
    // #################################################################################
    // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
    // provides access to various client params in application.yml
    // #################################################################################
    $log.debug("AppO2.APP_CONFIG in mapService: ", AppO2.APP_CONFIG);

    var zoomToLevel = 16;
    var map,
      mapView,
      footPrints,
      autoMosaic,
      searchLayerVector, // Used for visualizing the search items map markers polygon boundaries
      filterLayerVector, // Used for visualizing the filter markers and polygon AOI's
      geomField,
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
    var markerUrl =
      baseServerUrl + "/" + AppO2.APP_CONFIG.params.misc.icons.greenMarker;

    // Sets the intial url values for the footprints (geoscript) service
    var footprintsBaseUrl = stateService.omarSitesState.url.base;
    var footprintsContextPath =
      stateService.omarSitesState.url.geoscriptContextPath;
    var footprintsRequestUrl =
      footprintsBaseUrl + footprintsContextPath + "/footprints/getFootprints";

    // Sets the initial url values for the thumbnails (oms) service
    var thumbnailsBaseUrl = stateService.omarSitesState.url.base;
    var thumbnailsContextPath = stateService.omarSitesState.url.omsContextPath;
    var thumbnailsRequestUrl =
      thumbnailsBaseUrl + thumbnailsContextPath + "/imageSpace/getThumbnail";

    var wmsBaseUrl = stateService.omarSitesState.url.base;
    var wmsContextPath = stateService.omarSitesState.url.wmsContextPath;
    var wmsRequestUrl = wmsBaseUrl + wmsContextPath + "/wms";
    var autoMosaicRequestUrl = wmsBaseUrl + wmsContextPath + "/mosaic";

    /**
     * Description: Called from the mapController so that the $on. event that subscribes to the $broadcast
     * can update the Geoscript and Thumbnails url and context path(s).
     */
    this.setMapServiceUrlProps = function() {
      footprintsBaseUrl = stateService.omarSitesState.url.base;
      footprintsContextPath =
        stateService.omarSitesState.url.geoscriptContextPath;
      footprintsRequestUrl =
        footprintsBaseUrl + footprintsContextPath + "/footprints/getFootprints";

      thumbnailsBaseUrl = stateService.omarSitesState.url.base;
      thumbnailsContextPath = stateService.omarSitesState.url.omsContextPath;
      thumbnailsRequestUrl =
        thumbnailsBaseUrl + thumbnailsContextPath + "/imageSpace/getThumbnail";

      wmsBaseUrl = stateService.omarSitesState.url.base;
      wmsContextPath = stateService.omarSitesState.url.wmsContextPath;
      wmsRequestUrl = wmsBaseUrl + wmsContextPath + "/wms";
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

    /**
     * Elements that make up the popup.
     */
    var container = document.getElementById("popup");
    var content = document.getElementById("popup-content");
    var closer = document.getElementById("popup-closer");

    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new ol.Overlay(
      /** @type {olx.OverlayOptions} */ ({
        element: container
      })
    );

    this.mapInit = function() {
      mapView = new ol.View({
        center: [0, 0],
        extent: [-180, -90, 180, 90],
        projection: "EPSG:4326",
        zoom: 3,
        minZoom: 2,
        maxZoom: 20
      });

      if (AppO2.APP_CONFIG.params.footprints.params != undefined) {
        if (AppO2.APP_CONFIG.params.footprints.params.version != undefined) {
          version = AppO2.APP_CONFIG.params.footprints.params.version;
        }
        if (AppO2.APP_CONFIG.params.footprints.params.layers != undefined) {
          layers = AppO2.APP_CONFIG.params.footprints.params.layers;
        }
        if (AppO2.APP_CONFIG.params.footprints.params.styles != undefined) {
          styles = AppO2.APP_CONFIG.params.footprints.params.styles;
        }
        if (AppO2.APP_CONFIG.params.footprints.params.format != undefined) {
          format = AppO2.APP_CONFIG.params.footprints.params.format;
        }
        if (AppO2.APP_CONFIG.params.footprints.params.name != undefined) {
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
          wrapX: false,
        }),
        name: "Auto",
        visible: false
      });

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
        $.each( layerObj.params, function( key, value ) {
          // identify heat map layer
          if ( key.toLowerCase().search( /date/ ) > -1 && value.search( /\d/ ) > -1 ) {
            var time = value.split( " " )[ 0 ];
            var interval = value.split( " " )[ 1 ];
            value = moment().subtract( time, interval ).format( "YYYY-MM-DDTHH:mm:ss.SSS" );
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

      geomField = "ground_geom";

      // needed to avoid two WFS requests from happening when the page loads
      map.once("moveend", function() {
        map.on("moveend", filterByViewPort);
      });

      dragBox = new ol.interaction.DragBox({
        condition: ol.events.condition.altKeyOnly
      });

      dragBox.on("boxend", function() {
        clearLayerSource(filterLayerVector);

        var dragBoxExtent = dragBox.getGeometry().getExtent();

        mapObj.cql =
          "INTERSECTS(" +
          geomField +
          "," +
          convertToWktPolygon(dragBoxExtent) +
          ")";

        // Update the image cards in the list via spatial click coordinates
        wfsService.updateSpatialFilter(mapObj.cql);

        // Grabs the current value of the attrObj.filter so that the click
        // will also update if there are any temporal, keyword, or range filters
        wfsService.updateAttrFilter(wfsService.attrObj.filter);

        var searchPolygon = new ol.Feature({
          geometry: new ol.geom.Polygon.fromExtent(dragBoxExtent)
        });

        searchPolygon.setStyle(filterStyle);
        filterLayerVector.getSource().addFeatures([searchPolygon]);
      });
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
      let mosaicCql =
        "INTERSECTS(" +
        geomField +
        "," +
        convertToWktPolygon(getMapBbox()) +
        ")";

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

    this.addSelectedImageAsLayer = id => {
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

    this.removeSelectedImageLayer = id => {
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
        map.getView().fit(polygon.getExtent(), map.getSize());
      });
    };

    this.zoomToSelectedImages = ids => {
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

    this.clearSelectedMosaicImages = () => {
      clearSelectedMosaicImages();
    };

    this.clearSelectedImages = this.zoomMap = function(params) {
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

    this.updateFootPrintLayer = function(filter) {
      updateFootPrints(filter);
    };

    function updateFootprintsUrl() {
      footPrints.getSource().setUrl(footprintsRequestUrl);
    }

    this.updateFootprintsUrl = function() {
      updateFootprintsUrl();
    };

    /**
     * We need this to set the intial spatial filter for
     * the WFS spatialObj's filter property.
     */
    this.setIntialMapSpatialFilter = function() {
      mapObj.cql =
        "INTERSECTS(" +
        geomField +
        "," +
        convertToWktPolygon(getMapBbox()) +
        ")";
      wfsService.spatialObj.filter = mapObj.cql;
    };

    /**
     * This is used to select images by creating a polygon based on the
     * current map extent and sending it to the wfs service to update the
     * card list
     */
    function filterByViewPort() {
      clearLayerSource(filterLayerVector);

      mapObj.cql =
        "INTERSECTS(" +
        geomField +
        "," +
        convertToWktPolygon(getMapBbox()) +
        ")";

      // Update the image cards in the list via spatial bounds
      wfsService.updateSpatialFilter(mapObj.cql);
    }

    this.viewPortFilter = function(status) {
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
    function filterByPoint(event) {
      clearLayerSource(filterLayerVector);

      var coordinate = event.coordinate;

      var clickCoordinates = coordinate[0] + " " + coordinate[1];

      pointLatLon = coordinate[1] + "," + coordinate[0];

      mapObj.cql =
        "INTERSECTS(" + geomField + ",POINT(" + clickCoordinates + "))";

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
        map.on("singleclick", filterByPoint);
      } else {
        // https://groups.google.com/d/msg/ol3-dev/Z4JoCBs-iEY/HSpihl8bcVIJ
        map.un("singleclick", filterByPoint);
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

    this.mapShowImageFootprint = function(imageObj) {
      clearLayerSource(searchLayerVector);

      var footprintFeature = new ol.Feature({
        geometry: new ol.geom.MultiPolygon(imageObj.geometry.coordinates)
      });

      var color = setFootprintColors(imageObj.properties.file_type);

      footprintStyle.getFill().setColor(color);
      footprintStyle.getStroke().setColor(color);

      footprintFeature.setStyle(footprintStyle);

      searchLayerVector.getSource().addFeature(footprintFeature);

      var featureExtent = footprintFeature.getGeometry().getExtent();

      var featureExtentCenter = new ol.extent.getCenter(featureExtent);

      var missionID = "Unknown";
      var sensorID = "Unknown";
      var acquisition_date = "Unknown";

      if (imageObj.properties.mission_id != undefined) {
        missionID = imageObj.properties.mission_id;
      }
      if (imageObj.properties.sensor_id != undefined) {
        sensorID = imageObj.properties.sensor_id;
      }
      if (imageObj.properties.acquisition_date != undefined) {
        acquisition_date = moment(imageObj.properties.acquisition_date).format(
          "MM/DD/YYYY HH:mm:ss"
        );
      }

      content.innerHTML =
        '<div class="media">' +
        '<div class="media-left">' +
        '<img class="media-object" ' +
        'src="' +
        thumbnailsRequestUrl +
        "?id=" +
        imageObj.properties.id +
        "&filename=" +
        imageObj.properties.filename +
        "&entry=" +
        imageObj.properties.entry_id +
        "&size=50" +
        '&format=jpeg">' +
        "</div>" +
        '<div class="media-body">' +
        '<small><span class="text-primary">Mission:&nbsp; </span><span class="text-success">' +
        missionID +
        "</span></small><br>" +
        '<small><span class="text-primary">Sensor:&nbsp; </span><span class="text-success">' +
        sensorID +
        "</span></small><br>" +
        '<small><span class="text-primary">Acquisition:&nbsp; </span><span class="text-success">' +
        acquisition_date +
        "</span></small>" +
        "</div>" +
        "</div>";

      overlay.setPosition(featureExtentCenter);
    };

    this.mapRemoveImageFootprint = function() {
      clearLayerSource(searchLayerVector);
      overlay.setPosition(undefined);
    };

    this.getCenter = function() {
      return map.getView().getCenter();
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

      var wkt =
        "POLYGON((" +
        minX +
        " " +
        minY +
        ", " +
        minX +
        " " +
        maxY +
        ", " +
        maxX +
        " " +
        maxY +
        ", " +
        maxX +
        " " +
        minY +
        ", " +
        minX +
        " " +
        minY +
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
          case 1:
            html = point.getLatDegCard() + ", " + point.getLonDegCard();
            break;
          // dms w/o cardinal direction
          case 2:
            html = point.getLatDeg() + ", " + point.getLonDeg();
            break;
          // mgrs
          case 3:
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

    mousePositionControl.coordFormat = 0;
    $("#mouseCoords").click(function() {
      mousePositionControl.coordFormat =
        mousePositionControl.coordFormat >= 3
          ? 0
          : mousePositionControl.coordFormat + 1;
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
