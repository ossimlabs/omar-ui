(function() {
  "use strict";
  angular
    .module("omarApp")
    .service("imageSpaceService", [
      "$rootScope",
      "$http",
      "stateService",
      "wfsService",
      "$timeout",
      "$q",
      "$stateParams",
      "$log",
      imageSpaceService
    ]);

  function imageSpaceService(
    $rootScope,
    $http,
    stateService,
    wfsService,
    $timeout,
    $q,
    $stateParams,
    $log
  ) {
    var map,
      filename,
      entry,
      format,
      histCenterTile,
      histOp,
      imageGeometry,
      imageProperties,
      imgWidth,
      imgHeight,
      tileX,
      tileY,
      tileZ,
      imgCenter,
      proj,
      resamplerFilter,
      sharpenMode,
      sourceImage,
      sourceTile,
      upAngle,
      northAngle,
      bands,
      numOfBands,
      brightness,
      numResLevels,
      contrast,
      imageRenderType,
      urlString,
      imgID,
      transparent,
      imageData,
      wfsRequestUrl;

    var imageSpaceBaseUrl, imageSpaceContextPath, imageSpaceRequestUrl;

    var uiBaseUrl, uiContextPath, uiRequestUrl;

    var mensaBaseUrl, mensaContextPath, mensaRequestUrl;

    var wmsBaseUrl, wmsContextPath, wmsRequestUrl;

    // Updates all of the url endpoints via the stateService omarSitesState object
    this.setImageServiceUrlProps = function() {
      imageSpaceBaseUrl = stateService.omarSitesState.url.base;
      imageSpaceContextPath = stateService.omarSitesState.url.omsContextPath;
      imageSpaceRequestUrl = $stateParams.imageSpaceRequestUrl + "/imageSpace";

      uiBaseUrl = stateService.omarSitesState.url.base;
      uiContextPath = stateService.omarSitesState.url.uiContextPath;
      uiRequestUrl = $stateParams.uiRequestUrl;

      mensaBaseUrl = stateService.omarSitesState.url.base;
      mensaContextPath = stateService.omarSitesState.url.mensaContextPath;
      mensaRequestUrl = $stateParams.mensaRequestUrl + "/mensa";

      wmsContextPath = stateService.omarSitesState.url.wmsContextPath;
      wmsRequestUrl = $stateParams.wmsRequestUrl;
    };
    this.setImageServiceUrlProps();

    // Measurement variables.
    var measureSource = new ol.source.Vector();

    var vector = new ol.layer.Vector({
      source: measureSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({ color: "rgba(255, 255, 255, 0.3)" }),
        stroke: new ol.style.Stroke({ color: "cyan", width: 3 }),
        image: new ol.style.Circle({
          radius: 3,
          fill: new ol.style.Fill({ color: "cyan" })
        })
      })
    });

    var type, sketch, draw, helpTooltipElement, helpTooltip;

    var continuePolygonMsg = "Click to continue drawing the polygon";
    var continueLineMsg = "Click to continue drawing the line";
    // End Measurement variables.

    var RotateNorthControl = function(opt_options) {
      var options = opt_options || {};
      var span = document.createElement("span");
      span.className = "ol-compass";
      span.textContent = "\u21E7";

      var button = document.createElement("button");
      button.appendChild(span);
      button.title = "North is Up";

      var this_ = this;

      var handleRotateNorth = function(e) {
        this_
          .getMap()
          .getView()
          .setRotation(northAngle);
      };

      button.addEventListener("click", handleRotateNorth, false);
      button.addEventListener("touchstart", handleRotateNorth, false);

      var element = document.createElement("div");

      element.className = "rotate-north ol-unselectable ol-control";
      element.appendChild(button);

      ol.control.Control.call(this, {
        element: element,
        target: options.target
      });
    };

    ol.inherits(RotateNorthControl, ol.control.Control);

    function rotateNorthArrow(radians) {
      var transform = "rotate(" + radians + "rad)";
      var arrow = $(".ol-compass");
      arrow.css("msTransform", transform);
      arrow.css("transform", transform);
      arrow.css("webkitTransform", transform);
    }

    var RotateUpControl = function(opt_options) {
      var options = opt_options || {};
      var button = document.createElement("button");

      button.innerHTML = "U";
      button.title = "Up is Up";

      var this_ = this;

      var handleRotateUp = function(e) {
        this_
          .getMap()
          .getView()
          .setRotation(upAngle);
      };

      button.addEventListener("click", handleRotateUp, false);
      button.addEventListener("touchstart", handleRotateUp, false);

      var element = document.createElement("div");

      element.className = "rotate-up ol-unselectable ol-control";
      element.appendChild(button);

      ol.control.Control.call(this, {
        element: element,
        target: options.target
      });
    };
    ol.inherits(RotateUpControl, ol.control.Control);

    this.initImageSpaceMap = function(params) {
      bands = params.bands || "default";
      brightness = params.brightness || 0;
      contrast = params.contrast || 1;
      entry = params.entry;
      filename = params.filename;
      histOp = params.histOp || "auto-minmax";
      histCenterTile = params.histCenterTile || "false";
      imgID = params.imageId;
      imageRenderType = params.imageRenderType || "tile";
      imgHeight = parseInt(params.imgHeight);
      imgWidth = parseInt(params.imgWidth);
      numOfBands = params.numOfBands;
      numResLevels = parseInt(params.numResLevels) || 1;
      resamplerFilter = params.resamplerFilter || "bilinear";
      sharpenMode = params.sharpenMode || "none";
      transparent = params.transparent || "true";
      wfsRequestUrl = params.wfsRequestUrl;

      /**
       * These are the initial style paramaters for our image
       * and tile layers.
       */
      this.stylesParams = {
        bands: bands,
        brightness: brightness,
        contrast: contrast,
        histCenterTile: histCenterTile,
        histOp: histOp,
        nullPixelFlip: false,
        resamplerFilter: resamplerFilter,
        sharpenMode: sharpenMode
      };

      // Sets header title and grabs the image's metadata.
      wfsService
        .getImageProperties(wfsRequestUrl, filename)
        .then(function(response) {
          imageData = response;
          imageGeometry = imageData.geometry;
          imageProperties = imageData.properties;
        });

      /**
       * Make AJAX call here to getAngles with filename & entry as args
       * to get the upAngle and northAngle values.
       */
      $http({
        method: "GET",
        url: imageSpaceRequestUrl + "/getAngles",
        params: {
          filename: filename,
          entry: entry
        }
      }).then(
        function successCallback(response) {
          upAngle = response.data.upAngle;
          northAngle = response.data.northAngle;

          /**
           * It is likely that the "sensor up" and "north up" are not the same
           * default the view to be "up is up".
           */
          map.getView().setRotation(upAngle);
        },
        function errorCallback(response) {
          console.error(response);
        }
      );

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

      // Increment the count of loading tiles.
      Progress.prototype.addLoading = function() {
        if (this.loading === 0) {
          this.show();
        }
        ++this.loading;
        this.update();
      };

      // Increment the count of loaded tiles.
      Progress.prototype.addLoaded = function() {
        var this_ = this;
        setTimeout(function() {
          ++this_.loaded;
          this_.update();
        }, 100);
      };

      // Update the progress icon.
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

      let layerLoadStart, layerLoadEnd;
      // Show the progress icon.
      Progress.prototype.show = function() {
        this.el.style.visibility = "visible";
        layerLoadStart = performance.now();
      };

      // Hide the progress icon.
      Progress.prototype.hide = function() {
        if (this.loading === this.loaded) {
          this.el.style.visibility = "hidden";
          layerLoadEnd = performance.now();
          $log.debug(
            "Currently rendered layer took " +
              (layerLoadEnd - layerLoadStart) +
              " milliseconds to load."
          );
        }
      };

      var progress = new Progress(document.getElementById("progress"));

      var interactions = ol.interaction.defaults({ altShiftDragRotate: true });
      var findResolution = function(pixelWidth) {
        var size = Math.max(imgWidth, imgHeight);
        var level = 0;
        while (size > pixelWidth) {
          level += 1;
          size = size >> 1;
        }
        return Math.pow(2, level);
      };

      var imgExtent = [0, 0, imgWidth, imgHeight];

      /**
       * Purpose: This function is used to massage the Y value of the
       * image so that it will display properly in image space.  It is used
       * by the source objects of our tile wms and image wms layers.
       * @param image
       * @param src
       */
      var fixY = function(image, src) {
        var regexBbox = /BBOX\=([^&^#]*)/;
        var url = decodeURIComponent(src);
        var bbox = url
          .match(regexBbox)[1]
          .split(",")
          .map(Number);
        var height = bbox[3] - bbox[1];
        var requestCenter = (bbox[3] + bbox[1]) / 2;
        var newCenter = imgHeight - requestCenter;
        var minY = newCenter - height / 2;
        var maxY = minY + height;
        var bboxOut = bbox[0] + "," + minY + "," + bbox[2] + "," + maxY;
        var newUri = src.replace(
          regexBbox,
          "BBOX=" + encodeURIComponent(bboxOut)
        );
        image.getImage().src = newUri;
      };

      // Used in the 'Single Image' layer.
      sourceImage = new ol.source.ImageWMS({
        params: {
          LAYERS: "omar:raster_entry." + imgID,
          STYLES: '{"bands":"default","resamplerFilter":"bilinear"}'
        },
        url: wmsRequestUrl + "/wms",
        crossOrigin: "Anonymous",
        imageLoadFunction: fixY
      });

      // Used in the 'Tiled' layer.
      sourceTile = new ol.source.TileWMS({
        params: {
          LAYERS: "omar:raster_entry." + imgID,
          STYLES: '{"bands":"default","resamplerFilter":"bilinear"}'
        },
        url: wmsRequestUrl + "/wms",
        crossOrigin: "Anonymous",
        tileLoadFunction: fixY
      });

      sourceImage.on("imageloadstart", function() {
        progress.addLoading();
      });

      sourceImage.on("imageloadend", function() {
        progress.addLoaded();
      });

      sourceImage.on("imageloaderror", function() {
        progress.addLoaded();
      });

      sourceTile.on("tileloadstart", function() {
        progress.addLoading();
      });

      sourceTile.on("tileloadend", function() {
        progress.addLoaded();
      });

      sourceTile.on("tileloaderror", function() {
        progress.addLoaded();
      });

      const imageLayer = new ol.layer.Image({
        extent: imgExtent,
        source: sourceImage
      });

      const tileLayer = new ol.layer.Tile({
        extent: imgExtent,
        source: sourceTile
      });

      const layers = [imageLayer, tileLayer, vector];

      // Create an invalid EPSG code for pixel base extents in our imagespace map.
      let projection = new ol.proj.Projection({
        code: "EPSG:99999",
        units: "m",
        extent: imgExtent
      });

      // Create full screen control.
      var span = document.createElement("span");
      span.className = "glyphicon glyphicon-fullscreen";
      var fullScreenControl = new ol.control.FullScreen({ label: span });

      const map = new ol.Map({
        controls: ol.control
          .defaults({ attribution: false })
          .extend([
            new RotateNorthControl(),
            new RotateUpControl(),
            fullScreenControl
          ]),
        interactions: interactions,
        layers: layers,
        target: "imageMap",
        view: new ol.View({
          center: [imgWidth / 2, imgHeight / 2],
          projection: projection,
          extent: imgExtent,
          minResolution: Math.pow(2, -6),
          maxResolution: Math.pow(numResLevels - 1, 2)
        })
      });

      this.setImageRenderType = type => {
        if (type === "tile") {
          imageRenderType = type;
          imageLayer.setVisible(false);
          tileLayer.setVisible(true);
          map.render();
        } else if (type === "single") {
          imageRenderType = type;
          tileLayer.setVisible(false);
          imageLayer.setVisible(true);
          map.render();
        }
      };

      /**
       * This sets the image render type (tile or single) based on the
       * params object. The params object is derived from the query string
       * parameters. This way when users share the link they can pass whether
       * they want the map to come up in tile or single image mode.
       */
      this.setImageRenderType(imageRenderType);

      this.getImageBands = function() {
        var bandVal = bands.split(",");

        if (bandVal.length > 0) {
          if (bandVal[0] != "default") {
            if (numOfBands <= 1) {
              bands = bandVal[0];
            } else {
              if (numOfBands == 2) {
                bands = "1,2";
              } else {
                bands = bandVal[0];
              }
              for (var bandNum = 1; bandNum < numOfBands; bandNum++) {
                if (bandVal[bandNum]) {
                  bands = bands + "," + bandVal[bandNum];
                }
              }
            }
          } else {
            bands = "default";
          }
        }
        this.bands = bands;
        this.numOfBands = numOfBands;
      };

      this.setBands = function(bandsVal) {
        bands = bandsVal;
        this.stylesParams.bands = bandsVal;
        this.updateStyles();
      };

      // End Band Selection Section

      this.getImageLink = function() {
        return (
          AppO2.APP_CONFIG.serverURL +
          "/omar/#/mapImage?" +
          "bands=" +
          bands +
          "&" +
          "brightness=" +
          brightness +
          "&" +
          "contrast=" +
          contrast +
          "&" +
          "entry_id=" +
          entry +
          "&" +
          "filename=" +
          encodeURIComponent(filename) +
          "&" +
          "height=" +
          imgHeight +
          "&" +
          "histCenterTile=" +
          histCenterTile +
          "&" +
          "histOp=" +
          histOp +
          "&" +
          "imageId=" +
          imgID +
          "&" +
          "numOfBands=" +
          numOfBands +
          "&" +
          "numResLevels=" +
          numResLevels +
          "&" +
          "resamplerFilter=" +
          resamplerFilter +
          "&" +
          "sharpenMode=" +
          sharpenMode +
          "&" +
          "transparent=" +
          transparent +
          "&" +
          "width=" +
          imgWidth +
          "&" +
          "imageRenderType=" +
          imageRenderType +
          "&" +
          "imageSpaceRequestUrl=" +
          encodeURIComponent($stateParams.imageSpaceRequestUrl) +
          "&" +
          "uiRequestUrl=" +
          encodeURIComponent(uiRequestUrl) +
          "&" +
          "mensaRequestUrl=" +
          encodeURIComponent(mensaRequestUrl) +
          "&" +
          "wmsRequestUrl=" +
          encodeURIComponent(wmsRequestUrl) +
          "&" +
          "wfsRequestUrl=" +
          encodeURIComponent(wfsRequestUrl) +
          "&" +
          "showModalSplash=true"
        );
      };

      this.setDynamicRange = function(value) {
        histOp = value;
        this.stylesParams.histOp = value;
        this.updateStyles();
      };

      this.setDynamicRangeRegion = function(value) {
        histCenterTile = value;
        this.stylesParams.histCenterTile = value;
        this.updateStyles();
      };

      this.setResamplerFilter = function(value) {
        resamplerFilter = value;
        this.stylesParams.resamplerFilter = value;
        this.updateStyles();
      };

      this.setSharpenMode = function(value) {
        sharpenMode = value;
        this.stylesParams.sharpenMode = value;
        this.updateStyles();
      };

      this.setBrightness = function(brightnessVal) {
        brightness = brightnessVal;
        this.stylesParams.brightness = brightnessVal;
        this.updateStyles();
      };

      this.setContrast = function(contrastVal) {
        contrast = contrastVal;
        this.stylesParams.contrast = contrastVal;
        this.updateStyles();
      };

      this.resetBrightnessContrast = function() {
        brightness = $stateParams.brightness ? $stateParams.brightness : 0.0;
        contrast = $stateParams.contrast ? $stateParams.contrast : 1.0;
      };

      // Hide the default north arrow.
      $(".ol-rotate").removeClass("ol-rotate");

      // Rotate the custom north arrow according to the view.
      map.getView().on("change:rotation", function(e) {
        var rotation = e.target.get(e.key) - northAngle;
        rotateNorthArrow(rotation);
      });

      // Begin Measure stuff.
      var pointerMoveHandler = function(evt) {
        if (evt.dragging) {
          return;
        }
        var helpMsg =
          '<div class="text-center">Single-click to start measuring. </br>  Double-click to end.</div>';

        if (sketch) {
          var geom = sketch.getGeometry();

          if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg;
          } else if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg;
          }
        }

        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        helpTooltipElement.classList.remove("hidden");
      };

      function addMeasureInteraction(measureType) {
        var type = measureType;

        draw = new ol.interaction.Draw({
          source: measureSource,
          type: type,
          style: new ol.style.Style({
            fill: new ol.style.Fill({ color: "rgba(255, 255, 255, 0.2)" }),
            stroke: new ol.style.Stroke({
              color: "rgba(0,255,255, 1.0)",
              lineDash: [10, 10],
              width: 3
            }),
            image: new ol.style.Circle({
              radius: 5,
              stroke: new ol.style.Stroke({ color: "rgba(0, 0, 0, 0.7)" }),
              fill: new ol.style.Fill({ color: "rgba(255, 255, 255, 0.2)" })
            })
          })
        });

        createHelpTooltip();

        var listener;
        draw.on(
          "drawstart",
          function(evt) {
            // Clear any measurements that may be there.
            $timeout(function() {
              $rootScope.$broadcast("measure: updated", null);
            });

            measureSource.clear();

            sketch = evt.feature;

            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on("change", function(evt) {
              var geom = evt.target;

              var output;
              if (geom instanceof ol.geom.Polygon) {
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
              } else if (geom instanceof ol.geom.LineString) {
                tooltipCoord = geom.getLastCoordinate();
              }
            });
          },
          this
        );

        draw.on(
          "drawend",
          function() {
            var sketchGeom = sketch.getGeometry();

            var sketchArray = [];

            var pointArray;
            if (sketchGeom instanceof ol.geom.LineString) {
              pointArray = sketch.getGeometry().getCoordinates();
            } else {
              pointArray = sketch.getGeometry().getCoordinates()[0];
            }

            /**
             * We need to map over the items in the sketchArray, and
             * multiply every other item (the y value on the OL3 grid) by -1
             * before we pass this to the mensa service.  Mensa expects the
             * XY to start in the upper-left.  OL3 starts in the lower-left.
             */
            pointArray.forEach(function(el) {
              sketchArray.push(el[0]);
              sketchArray.push(el[1] * -1);
            });

            var sketchString = sketchArray
              .join(" ")
              .match(/[+-]?\d+(\.\d+)?\s+[+-]?\d+(\.\d+)?/g)
              .join(", ");

            /**
             * Logic for type of geometry on sketch to set the type
             * of string we need to send to the mensa service.
             */
            if (sketchGeom instanceof ol.geom.LineString) {
              var wktArray = "LINESTRING(" + sketchString + ")";
            } else {
              var wktArray = "POLYGON((" + sketchString + "))";
            }

            var measureOutput;

            $http({
              method: "POST",
              url: encodeURI(mensaRequestUrl + "/imageDistance?"),
              data: {
                filename: filename,
                entryId: entry,
                pointList: wktArray
              }
            }).then(
              function(response) {
                var data;
                data = response.data.data;

                // $timeout needed: http://stackoverflow.com/a/18996042
                $timeout(function() {
                  $rootScope.$broadcast("measure: updated", data);
                });

                ol.Observable.unByKey(listener);
              },
              function errorCallback(response) {
                console.error("Error: ", response);
              }
            );

            sketch = null;
          },
          this
        );

        // Creates a new help tooltip.
        function createHelpTooltip() {
          if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
          }
          helpTooltipElement = document.createElement("div");
          helpTooltipElement.className = ".tooltip-measure hidden";
          helpTooltip = new ol.Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: "center-left"
          });
          map.addOverlay(helpTooltip);
        }
      }

      this.measureActivate = function(measureType) {
        map.getViewport().addEventListener("mouseout", function() {
          helpTooltipElement.classList.add("hidden");
        });

        // Remove the draw interaction if it is present (resets it).
        map.removeInteraction(draw);

        // Set the desired measurement type (Polygon or LineString).
        addMeasureInteraction(measureType);

        // Add the draw interaction for aour measurement.
        map.addInteraction(draw);

        map.on("pointermove", pointerMoveHandler);
      };

      this.measureClear = function() {
        // Removes previous measure item from the vector layer.
        measureSource.clear();

        map.removeInteraction(draw);
        map.un("pointermove", pointerMoveHandler);
      };
      // End Measure stuff.

      // Begin Screenshot stuff.
      this.screenshot = function() {
        map.once("postcompose", function(event) {
          var canvas = event.context.canvas;
          canvas.toBlob(function(blob) {
            var filename = "O2_Screenshot.png";
            var link = document.createElement("a");
            if (link.download !== undefined) {
              // Feature detection.
              $(link).attr("href", window.URL.createObjectURL(blob));
              $(link).attr("download", filename);
              $("body").append(link);
              link.click();
            } else {
              alert("This browser doesn't support client-side downloading, :(");
            }
            link.remove();
          });
        });
        map.renderSync();
      };
      // End Screenshot stuff.

      // Begin Position Quality Evaluator stuff.

      var drawPqePoint;
      drawPqePoint = new ol.interaction.Draw({
        source: measureSource,
        type: "Point"
      });

      // Default
      var probability = "0.9";
      this.setPqeProbability = function(value) {
        probability = value;
      };

      function addPqeInteraction() {
        if (drawPqePoint != undefined) {
          map.addInteraction(drawPqePoint);
        }

        drawPqePoint.on("drawend", function(evt) {
          measureSource.clear();

          var pqePoint = evt.feature;

          var pqeArray = pqePoint.getGeometry().getCoordinates();

          /**
           * We need to map over the items in the pqeArray, and multiply
           * the second item (the y value on the OL3 grid) by -1
           * before we pass this to the mensa service.  Mensa expects the
           * XY to start in the upper-left.  OL3 starts in the lower-left.
           */
          var pqeModArray = pqeArray.map(function(el, index) {
            return index % 2 ? el * -1 : el;
          });

          var pqeString = pqeModArray
            .join(" ")
            .match(/[+-]?\d+(\.\d+)?\s+[+-]?\d+(\.\d+)?/g)
            .join(", ");

          var pqeMpArray = "MULTIPOINT(" + pqeString + ")";

          var mensaPqeUrl = mensaRequestUrl + "/imagePointsToGround?";

          $http({
            method: "POST",
            url: encodeURI(mensaPqeUrl),
            data: {
              filename: filename,
              entryId: entry,
              pointList: pqeMpArray,
              pqeIncludePositionError: true,
              pqeProbabilityLevel: probability,
              pqeEllipsePointType: "array",
              pqeEllipseAngularIncrement: "10"
            }
          }).then(
            function(response) {
              var data;
              data = response.data.data;

              var centerPoint = [];
              centerPoint.push(data[0].x);
              centerPoint.push(-data[0].y);

              var pqeErrorArray = data[0].pqe.ellPts;

              var pqeModErrorArray = [];

              pqeErrorArray.forEach(function(el) {
                pqeModErrorArray.push(el.x);
                pqeModErrorArray.push(-el.y);
              });

              var pqeErrorString = pqeModErrorArray
                .join(" ")
                .match(/[+-]?\d+(\.\d+)?\s+[+-]?\d+(\.\d+)?/g)
                .join(", ");

              var formatModError = new ol.format.WKT();

              var pqeErrorModWkt = "POLYGON((" + pqeErrorString + "))";
              var pqeErrorModFeature = formatModError.readFeature(
                pqeErrorModWkt
              );
              measureSource.addFeature(pqeErrorModFeature);

              // $timeout needed: http://stackoverflow.com/a/18996042
              $timeout(function() {
                $rootScope.$broadcast("pqe: updated", data);
              });
            },
            function errorCallback(response) {
              console.error("Error: ", response);
            }
          );
        });
      }

      this.pqeActivate = function(probabilty) {
        addPqeInteraction(probabilty);
      };

      this.pqeClear = function() {
        measureSource.clear();
        map.removeInteraction(drawPqePoint);
      };

      this.groundToImage = function(points) {
        var deferred = $q.defer();

        $http({
          data: {
            entryId: entry,
            filename: filename,
            pointList: points
          },
          method: "POST",
          url: encodeURI(mensaRequestUrl + "/groundToImagePoints")
        }).then(function(response) {
          var pixels = response.data.data;

          if (pixels.length > 0) {
            deferred.resolve(pixels[0]);
          } else {
            deferred.resolve(false);
          }
        });

        return deferred.promise;
      };

      /**
       * Purpose: Used to set the style object of the layers
       * sources in the map
       */
      this.updateStyles = () => {
        let stylesObj = {
          STYLES: JSON.stringify(this.stylesParams)
        };

        $log.debug("Updating layers styles with: ", stylesObj);
        sourceImage.updateParams(stylesObj);
        sourceTile.updateParams(stylesObj);
      };

      // We need to set the default styles on init of the map
      this.updateStyles();

      this.setCenter = function(point) {
        map.getView().setCenter(point);
      };

      this.zoomToFullExtent = () => {
        var mapSize = map.getSize();
        map
          .getView()
          .setResolution(
            findResolution(Math.max(Math.min(mapSize[0], mapSize[1]), 128))
          );
      };

      // We will set the initial extent to full.
      this.zoomToFullExtent();

      this.zoomToFullRes = () => {
        map
          .getView()
          .setResolution(findResolution(Math.max(imgWidth, imgHeight)));
      };

      this.getFootprintGeometry = function() {
        return new ol.geom.MultiPolygon(imageGeometry.coordinates);
      };
    }; // End initImageSpaceMap.
  }
})();
