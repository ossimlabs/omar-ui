(function() {
  "use strict";
  angular
    .module("omarApp")
    .controller("MapImageController", [
      "wfsService",
      "coordinateConversionService",
      "downloadService",
      "imageSpaceService",
      "$location",
      "$scope",
      "shareService",
      "$state",
      "$stateParams",
      "toastr",
      "$uibModal",
      MapImageController
    ]);

  function MapImageController(
    wfsService,
    coordinateConversionService,
    downloadService,
    imageSpaceService,
    $location,
    $scope,
    shareService,
    $state,
    $stateParams,
    toastr,
    $uibModal
  ) {
    var vm = this;

    var imageSpaceObj = {};

    // Used by band selection
    var bands,
      numberOfBands,
      bandNum,
      redSelect,
      greenSelect,
      blueSelect,
      brightness,
      brightnesSlider,
      contrast,
      gamma,
      gammaSlider,
      contrastSlider,
      DRA_Slider,
      sharpenSlider;

    vm.baseServerUrl = AppO2.APP_CONFIG.serverURL;

    $scope.$on( 'magic search function', function() {
        vm.geoJump();
    } );

    vm.geoJump = function() {
      var location = $( '#magicSearchInput' ).val().trim();
      var coords = coordinateConversionService.convert(location);
    };

    $scope.$on("coordService: updated", function(event, response) {
      if (response) {
        var extent = imageSpaceService.getFootprintGeometry().getExtent();
        if (ol.extent.containsCoordinate(extent, response.coordinate)) {
          var points = [
            {
              lat: response.coordinate[1],
              lon: response.coordinate[0]
            }
          ];
          var pixels = imageSpaceService
            .groundToImage(points)
            .then(function(response) {
              if (response) {
                var pixel = [response.x, imageSpaceObj.imgHeight - response.y];
                imageSpaceService.setCenter(pixel);
                imageSpaceService.zoomToFullRes();
              } else {
                toastr.error(
                  "Sorry, we couldn't translate that coordinate into pixels."
                );
              }
            });
        } else {
          toastr.error("That point lies outside the image bounds.");
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

    vm.shareModal = function() {
      var imageLink = imageSpaceService.getImageLink();
      shareService.imageLinkModal(imageLink);
    };

    vm.archiveDownload = function(imageId) {
      downloadService.downloadFiles(imageId);
    };

    loadMapImage();
    bandSelection();

    let DRA_min_delta = 5;
    let set_ratio = .5;

    vm.imageId = $stateParams.imageId;

    // Start - Band Selections Section

    function bandSelection() {
      imageSpaceService.getImageBands();

      $scope.bandValues = [];
      $scope.bandTypeValues = [
        {
          key: 0,
          value: "Default"
        },
        {
          key: 1,
          value: "Gray"
        }
      ];

      bands = imageSpaceService.bands.split(",");
      numberOfBands = imageSpaceService.numOfBands;

      for (bandNum = 0; bandNum < numberOfBands; bandNum++) {
        $scope.bandValues.push({
          key: bandNum + 1,
          value: bandNum + 1
        });
      }

      $scope.enableBandType = true;

      if (numberOfBands <= 2) {
        $scope.grayValue = $scope.bandValues[0].value;
        $scope.grayImageItem = $scope.bandValues[0];

        if (numberOfBands == 2) {
          $scope.enableBandType = true;
        } else {
          $scope.enableBandType = false;
        }
      } else {
        $scope.bandTypeValues.push({ key: 2, value: "Color" });
        $("#rgb-image-space-bands").show();
        $("#gray-image-space-bands").hide();
        $scope.grayImageItem = $scope.bandValues[0];
        $scope.redImageItem = $scope.bandValues[0];
        $scope.greenImageItem = $scope.bandValues[1];
        $scope.blueImageItem = $scope.bandValues[2];
        $scope.rgbValues = {
          red: $scope.bandValues[0].key,
          green: $scope.bandValues[1].key,
          blue: $scope.bandValues[2].key
        };
      }

      if (bands.length == 1) {
        $scope.bandTypeItem = $scope.bandTypeValues[1];
        $scope.grayImageItem = {
          key: bands[0],
          value: bands[0]
        };
        $("#rgb-image-space-bands").hide();
        $("#gray-image-space-bands").show();
      } else {
        $scope.bandTypeItem = $scope.bandTypeValues[2];
        $scope.redImageItem = {
          key: bands[0],
          value: bands[0]
        };
        $scope.greenImageItem = {
          key: bands[1],
          value: bands[1]
        };
        $scope.blueImageItem = {
          key: bands[2],
          value: bands[2]
        };
        $("#rgb-image-space-bands").show();
        $("#gray-image-space-bands").hide();
      }

      if (bands[0] == "default") {
        $("#rgb-image-space-bands").hide();
        $("#gray-image-space-bands").hide();

        $scope.grayImageItem = {
          key: 1,
          value: 1
        };
        $scope.redImageItem = {
          key: 1,
          value: 1
        };
        $scope.greenImageItem = {
          key: 2,
          value: 2
        };
        $scope.blueImageItem = {
          key: 3,
          value: 3
        };

        $scope.bandTypeItem = $scope.bandTypeValues[0];
      }
    }

    $scope.onBandSelect = function(selectedValue, selectedBand) {
      switch (selectedBand.toUpperCase()) {
        case "RED":
          $scope.rgbValues.red = selectedValue;
          bands =
            $scope.rgbValues.red +
            "," +
            $scope.rgbValues.green +
            "," +
            $scope.rgbValues.blue;
          break;
        case "GREEN":
          $scope.rgbValues.green = selectedValue;
          bands =
            $scope.rgbValues.red +
            "," +
            $scope.rgbValues.green +
            "," +
            $scope.rgbValues.blue;
          break;
        case "BLUE":
          $scope.rgbValues.blue = selectedValue;
          bands =
            $scope.rgbValues.red +
            "," +
            $scope.rgbValues.green +
            "," +
            $scope.rgbValues.blue;
          break;
        case "GRAY":
          $scope.grayValue = selectedValue;
          bands = $scope.grayValue;
          break;
      }
      imageSpaceService.setBands(bands);
    };

    $scope.showBands = function(bandType) {
      switch (bandType.toUpperCase()) {
        case "COLOR":
          bands =
            $scope.rgbValues.red +
            "," +
            $scope.rgbValues.green +
            "," +
            $scope.rgbValues.blue;
          imageSpaceService.setBands(bands);
          $("#rgb-image-space-bands").show();
          $("#gray-image-space-bands").hide();
          break;
        case "GRAY":
          if ($scope.grayValue) {
            bands = $scope.grayValue;
          } else {
            bands = 1;
          }
          imageSpaceService.setBands(bands);
          $("#gray-image-space-bands").show();
          $("#rgb-image-space-bands").hide();
          break;
        case "DEFAULT":
          imageSpaceService.setBands("default");
          $("#rgb-image-space-bands").hide();
          $("#gray-image-space-bands").hide();
          break;
      }
    };

    //END - Band Selection Section

    function getSliderVal(slider_val, normal_val, min, max, precision) {
      if (slider_val < 0) {
        return (normal_val - Math.abs(slider_val) * Math.abs((normal_val - min)/100)).toFixed(precision);
      } else {
        return (normal_val + Math.abs(slider_val) * Math.abs((normal_val - max)/100)).toFixed(precision);
      }
    }

    // Start - Brightness/Contrast Section

    // Instantiate a slider
    brightnesSlider = $("#imgBrightnessSlider").slider({
      value: 0,
      min: -100,
      max: 100,
      precision: 2,
      step: 1,
      tooltip: "hide"
    });

    contrastSlider = $("#imgContrastSlider").slider({
      value: 0,
      min: -100,
      max: 100,
      precision: 2,
      step: 1,
      tooltip: "hide"
    });

    gammaSlider = $("#imgGammaSlider").slider({
      value: 0,
      min: -100,
      max: 100,
      precision: 2,
      step: 1,
      tooltip: "hide"
    });

    sharpenSlider = $("#imgSharpnessSlider").slider({
      value: 0,
      min: 0,
      max: 100,
      precision: 2,
      step: 1,
      tooltip: "hide"
    });

    $("#imgBrightnessVal").text(0);

    brightnesSlider.on("slide", function(slideEvt) {
      $("#imgBrightnessVal").text(slideEvt.value);
    });

    brightnesSlider.on("slideStop", function(slideEvt) {
      imageSpaceService.setBrightness(getSliderVal(slideEvt.value, parseFloat(brightness), -1, 1, 2));
      $("#imgBrightnessVal").text(slideEvt.value);
    });

    $("#imgContrastVal").text(0);

    contrastSlider.on("slide", function(slideEvt) {
      $("#imgContrastVal").text(slideEvt.value);
    });

    contrastSlider.on("slideStop", function(slideEvt) {
      imageSpaceService.setContrast(getSliderVal(slideEvt.value, parseFloat(contrast), 0, 4, 2));
      $("#imgContrastVal").text(slideEvt.value);
    });

    $("#imgGammaVal").text(0);

    gammaSlider.on("slide", function(slideEvt) {
      $("#imgGammaVal").text(slideEvt.value);
    });

    gammaSlider.on("slideStop", function(slideEvt) {
      imageSpaceService.setGamma(getSliderVal(-slideEvt.value, 1, 0, 4, 2));
      $("#imgGammaVal").text(slideEvt.value);
    });

    $("#imgSharpnessVal").text(0);

    sharpenSlider.on("slide", function(slideEvt) {
      $("#imgSharpnessVal").text(slideEvt.value);
    });

    sharpenSlider.on("slideStop", function(slideEvt) {
      imageSpaceService.setSharpenPercent(getSliderVal(slideEvt.value, 0, 0, 1, 2));
      $("#imgSharpnessVal").text(slideEvt.value);
    });

    $("#imgDRA-Val").text('0 : 100');

    imageSpaceService.setSharpenPercent(0);

    /**
     * DRA slider things
     */

    let DRA_Midpoint_slider = $('#DRA_Midpoint');
    DRA_Midpoint_slider.slider({
      max: 100,
      min: 0,
      tooltip: 'hide',
      value: 50
    });

    DRA_Midpoint_slider.on( 'slideStop', function( event ) {
      imageSpaceService.setHistCenterClip( set_ratio.toFixed(2) );
      imageSpaceService.setDynamicRange('linear');
    });

    let dynamicRangeSlider = $( '#dynamicRangeSliderInput' );
    dynamicRangeSlider.slider({
      range: true,
      max: 100,
      min: 0,
      tooltip: 'hide',
      value: [ 0,100 ]
    });

    DRA_Midpoint_slider.on( 'change', function( event ) {
      let midpoint = DRA_Midpoint_slider.slider("getValue");
      let min = dynamicRangeSlider.slider("getValue")[0];
      let max = dynamicRangeSlider.slider("getValue")[1];

      // Prevent max slider from passing midpoint
      if (max - midpoint < DRA_min_delta) {
        DRA_Midpoint_slider.slider("setValue", max - DRA_min_delta);
      }

      // Prevent min slider from passing midpoint
      if (midpoint - min < DRA_min_delta) {
        DRA_Midpoint_slider.slider("setValue", min + DRA_min_delta);
      }

      midpoint = DRA_Midpoint_slider.slider("getValue");

      set_ratio = getRatio(midpoint, min, max);
    });

    function getRatio(mid, min, max) {
      return (mid - min) / (max - min);
    }

    let valid_min;
    let valid_max;
    let valid_delta = 50;

    dynamicRangeSlider.on( 'change', function( event ) {
      let midpoint = DRA_Midpoint_slider.slider("getValue");
      let min = dynamicRangeSlider.slider("getValue")[0];
      let max = dynamicRangeSlider.slider("getValue")[1];
      let test_delta = (max - min) * set_ratio;
      // Prevent max slider from passing midpoint
      if ((max - midpoint < DRA_min_delta || midpoint - min < DRA_min_delta) && test_delta <= valid_delta) {
        dynamicRangeSlider.slider("setValue", [valid_min, valid_max]);
      } else {
        valid_min = min;
        valid_max = max;
        valid_delta = (max - min) * set_ratio;
      }

      event.value.newValue[0] = valid_min;
      event.value.newValue[1] = valid_max;

      min = dynamicRangeSlider.slider("getValue")[0];
      max = dynamicRangeSlider.slider("getValue")[1];

      let delta = (max - min) * set_ratio;

      DRA_Midpoint_slider.slider("setValue", min + delta);

      $("#imgDRA-Val").text(event.value.newValue[0] + " : " + event.value.newValue[1]);
    });

    dynamicRangeSlider.on("slide", function(slideEvt) {
      $("#imgDRA-Val").text(slideEvt.value[0] + " : " + slideEvt.value[1]);
    });

    dynamicRangeSlider.on("slideStop", function(slideEvt) {
      imageSpaceService.setDynaminRangeValues((slideEvt.value[0]/100 + "," + slideEvt.value[1]/100).toString());
      $("#imgDRA-Val").text(slideEvt.value[0] + " : " + slideEvt.value[1]);
      imageSpaceService.setDynamicRange('linear');
    });

    /**
     * End of DRA slider things
     */

    vm.resetMainSliders = function() {
      $("#imgBrightnessVal").text(0);
      brightnesSlider.slider("setValue", 0);
      imageSpaceService.setBrightness(imageSpaceObj.brightness);

      $("#imgContrastVal").text(0);
      contrastSlider.slider("setValue", 0);
      imageSpaceService.setContrast(imageSpaceObj.contrast);

      $("#imgGammaVal").text(0);
      gammaSlider.slider("setValue", 0);
      imageSpaceService.setGamma(1);

      $("#imgSharpnessVal").text(0);
      sharpenSlider.slider("setValue", 0);
      imageSpaceService.setSharpenPercent(0);
    }

    vm.resetDynamicSliders = function() {
      $("#imgDRA-Val").text('0 : 100');
      dynamicRangeSlider.slider("setValue", [0, 100]);
      imageSpaceService.setDynaminRangeValues('0,1');
      set_ratio = .5;
      DRA_Midpoint_slider.slider("setValue", 50);
      imageSpaceService.setHistCenterClip( .5 );
    }

    //END - Brightness/Contrast Section

    // START - Render Image Type Section

    vm.imageRenderType = {};
    vm.imageRenderTypes = [
      {
        name: "Tile",
        value: "tile"
      },
      {
        name: "Single Image",
        value: "single"
      }
    ];

    if ($stateParams.imageRenderType === "single") {
      vm.imageRenderType = vm.imageRenderTypes[1];
    } else {
      vm.imageRenderType = vm.imageRenderTypes[0];
    }

    vm.onImageRenderTypeSelect = function(type) {
      imageSpaceService.setImageRenderType(type);
    };

    // END - Render Image Type Section

    // START - Dynamic Range Section

    $scope.draType = {};
    $scope.draTypes = [
      {
        name: "None",
        value: "none"
      },
      {
        name: "Auto Min Max",
        value: "auto-minmax"
      },
      {
        name: "Auto Percentile",
        value: "auto-percentile"
      },
      {
        name: "1 STD",
        value: "std-stretch-1"
      },
      {
        name: "2 STD",
        value: "std-stretch-2"
      },
      {
        name: "3 STD",
        value: "std-stretch-3"
      },
      {
        name: "Linear",
        value: "linear"
      }
    ];

    $scope.draType = $scope.draTypes[1];

    angular.forEach($scope.draTypes, function(value, key) {
      if (value.value == imageSpaceObj.histOp) {
        $scope.draType = {
          name: value.name,
          value: value.value
        };
      }
    });

    $scope.onDraSelect = function(value) {
      imageSpaceService.setDynamicRange(value);
    };

    $scope.draRegionType = {};
    $scope.draRegionTypes = [
      {
        name: "Viewport",
        value: "true"
      },
      {
        name: "Global",
        value: "false"
      }
    ];

    $scope.draRegionType = $scope.draRegionTypes[1];

    angular.forEach($scope.draRegionTypes, function(value, key) {
      if (value.value === imageSpaceObj.histCenterTile) {
        $scope.draRegionType = {
          name: value.name,
          value: value.value
        };
      }
    });

    $scope.onDraRegionSelect = function(value) {
      imageSpaceService.setDynamicRangeRegion(value);
    };

    $scope.resamplerFilterType = {};
    $scope.resamplerFilterTypes = [
      {
        name: "Bessel",
        value: "bessel"
      },
      {
        name: "Bilinear",
        value: "bilinear"
      },
      {
        name: "Blackman",
        value: "blackman"
      },
      {
        name: "B-Spline",
        value: "bspline"
      },
      {
        name: "Catrom",
        value: "catrom"
      },
      {
        name: "Cubic",
        value: "cubic"
      },
      {
        name: "Gaussian",
        value: "gaussian"
      },
      {
        name: "Hamming",
        value: "hamming"
      },
      {
        name: "Hermite",
        value: "hermite"
      },
      {
        name: "Lanczos",
        value: "lanczos"
      },
      {
        name: "Magic",
        value: "magic"
      },
      {
        name: "Mitchell",
        value: "mitchell"
      },
      {
        name: "Nearest",
        value: "nearest"
      },
      {
        name: "Quadratic",
        value: "quadratic"
      },
      {
        name: "Sinc",
        value: "sinc"
      }
    ];

    $scope.resamplerFilterType = $scope.resamplerFilterTypes[1];

    angular.forEach($scope.resamplerFilterTypes, function(value, key) {
      if (value.value == imageSpaceObj.resamplerFilter) {
        $scope.resamplerFilterType = {
          name: value.name,
          value: value.value
        };
      }
    });

    $scope.onResamplerFilterSelect = function(value) {
      imageSpaceService.setResamplerFilter(value);
    };


    function loadMapImage() {
      brightness = parseFloat($stateParams.brightness);
      contrast = parseFloat($stateParams.contrast);

      imageSpaceObj = {
        bands: $stateParams.bands,
        brightness: brightness,
        contrast: contrast,
        gamma: gamma,
        entry: $stateParams.entry_id,
        filename: $stateParams.filename,
        imageId: $stateParams.imageId,
        imgWidth: $stateParams.width,
        imgHeight: $stateParams.height,
        histCenterTile: $stateParams.histCenterTile,
        histOp: $stateParams.histOp,
        imageRenderType: $stateParams.imageRenderType,
        numOfBands: $stateParams.numOfBands,
        numResLevels: $stateParams.numResLevels,
        resamplerFilter: $stateParams.resamplerFilter,
        sharpen_percent: $stateParams.sharpen_percent,
        url: $stateParams.url,
        wfsRequestUrl: $stateParams.wfsRequestUrl,
        wmsRequestUrl: $stateParams.wmsRequestUrl
      };

      /**
       * Pass the imageSpaceObj constructed from the URL
       * ($stateParams) into the imageSpaceService and load
       * the map with the values.
       */
      imageSpaceService.initImageSpaceMap(imageSpaceObj);
    }

    // Begin - Measurment Section

    $scope.itemMeasureTypeArray = [
      {
        id: 1,
        name: "meters",
        value: "m"
      },
      {
        id: 2,
        name: "kilometers",
        value: "km"
      },
      {
        id: 3,
        name: "feet",
        value: "ft"
      },
      {
        id: 4,
        name: "miles",
        value: "mi"
      },
      {
        id: 5,
        name: "yards",
        value: "yd"
      },
      {
        id: 6,
        name: "nautical miles",
        value: "nmi"
      }
    ];

    $scope.selectedMeasureType = {
      value: $scope.itemMeasureTypeArray[0]
    };

    vm.measureMessage = "Choose a measure type from the toolbar";
    vm.measureType = "None";
    function setMeasureUiComponents() {
      vm.showMeasureInfo = false;
      vm.measureType = "None";
      vm.measureMessage = "Choose a measure type from the toolbar";
      vm.displayArea = false;
      vm.displayAzimuth = false;
      vm.geodDist = "";
      vm.recDist = "";
      vm.azimuth = "";
      vm.area = "";
    }

    function changeMeasureOutputSystem(data, type) {
      function linearCalc(val, multiplier) {
        return (val * multiplier).toFixed(4);
      }

      function areaCalc(val, multiplier) {
        if (!data.area) {
          return;
        } else {
          return (val * multiplier).toFixed(4);
        }
      }

      if (data) {
        switch (type) {
          case "m":
            vm.geodDist = linearCalc(data.gdist, 1) + " " + type;
            vm.recDist = linearCalc(data.distance, 1) + " " + type;
            vm.area = areaCalc(data.area, 1) + " m^2";
            break;
          case "km":
            vm.geodDist = linearCalc(data.gdist, 0.001) + " " + type;
            vm.recDist = linearCalc(data.distance, 0.001) + " " + type;
            vm.area = areaCalc(data.area, 0.000001) + " km^2";
            break;
          case "ft":
            vm.geodDist = linearCalc(data.gdist, 3.280839895) + " " + type;
            vm.recDist = linearCalc(data.distance, 3.280839895) + " " + type;
            vm.area = areaCalc(data.area, 10.763910416623611025) + " ft^2";
            break;
          case "mi":
            vm.geodDist = linearCalc(data.gdist, 0.00062137119224) + " " + type;
            vm.recDist =
              linearCalc(data.distance, 0.00062137119224) + " " + type;
            vm.area = areaCalc(data.area, 0.00000038610215854575) + " mi^2";
            break;
          case "yd":
            vm.geodDist = linearCalc(data.gdist, 1.0936132983) + " " + type;
            vm.recDist = linearCalc(data.distance, 1.0936132983) + " " + type;
            vm.area = areaCalc(data.area, 1.19598861218942) + " yd^2";
            break;
          case "nmi":
            vm.geodDist = linearCalc(data.gdist, 0.000539957) + " " + type;
            vm.recDist = linearCalc(data.distance, 0.000539957) + " " + type;
            vm.area = areaCalc(data.area, 0.000000291553) + " nmi^2";
            break;
        }

        // Azimuth calcuation on LineString
        if (data.azimuth) {
          vm.displayAzimuth = true;
          vm.azimuth = data.azimuth.toFixed(3) + " deg";
        } else if (!data.azimuth) {
          vm.displayAzimuth = false;
          vm.azimuth = "0";
        }

        // Area calculation on Polygons
        if (data.area) {
          vm.displayArea = true;
          //vm.area = Math.round(data.area*1000)/1000 + ' m';;
        } else if (!data.area) {
          vm.displayArea = false;
          vm.area = "0";
        }
      } else {
        vm.geodDist = "";
        vm.recDist = "";
        vm.area = "";
      }
    }

    vm.measure = function(show, type) {
      vm.pqeClear();

      imageSpaceService.pqeClear();
      vm.pqeShowInfo = false;

      switch (type) {
        case "LineString":
          vm.measureType = "Path";
          vm.measureShow = true;
          imageSpaceService.measureActivate(type);
          vm.measureLine = true;
          vm.measurePolygon = false;
          break;
        case "Polygon":
          vm.measureType = "Area";
          vm.measureShow = true;
          imageSpaceService.measureActivate(type);
          vm.measureLine = false;
          vm.measurePolygon = true;
          break;
      }

      vm.showMeasureInfo = true;
      vm.measureMessage = "Click in the map to begin the measurement";
    };

    vm.setMeasureUnits = function(measureType) {
      // Only calculate the measurement if we have a valid measure object
      if (angular.equals(measureDataObj, {})) {
        return;
      } else {
        changeMeasureOutputSystem(measureDataObj, measureType);
      }
    };

    vm.measureClear = function() {
      vm.measureShow = true;
      imageSpaceService.measureClear();

      // Reset the UI to original state
      setMeasureUiComponents();
    };

    var measureDataObj = {};

    $scope.$on("measure: updated", function(event, data) {
      measureDataObj = data;
      changeMeasureOutputSystem(
        measureDataObj,
        $scope.selectedMeasureType.value.value
      );
    });

    // End - Measurement Section

    // Begin Position Quality Evaluator Section

    $scope.pqeProbabilityArray = [
      {
        id: 1,
        name: "0.9P",
        value: "0.9"
      },
      {
        id: 2,
        name: "0.95P",
        value: "0.95"
      },
      {
        id: 3,
        name: "0.5P",
        value: "0.5"
      }
    ];

    $scope.selectedProbabilityType = {
      value: $scope.pqeProbabilityArray[0]
    };

    vm.pqeMessage =
      "Click in the map to add a point. The position and the error of the information associated with it will be displayed.";
    vm.showPqePosOutput = false;
    vm.showPqeOutput = false;
    vm.showPqeWarning = false;

    vm.pqe = function(probability) {
      vm.measureClear();

      vm.pqeShowInfo = true;

      imageSpaceService.pqeActivate();
    };

    vm.setPqeProbability = function(value) {
      imageSpaceService.setPqeProbability(value);
    };

    vm.pqeClear = function() {
      vm.pqeShowInfo = false;

      vm.showPqeOutput = false;

      vm.pqeMessage =
        "Click in the map to add a point. The position and the error of the information associated with it will be displayed.";
      vm.ce = "";
      vm.le = "";
      vm.sma = "";
      vm.smi = "";
      vm.az = "";
      vm.projType = "";
      vm.surfaceName = "";
      vm.lvl = "";

      vm.showPqeWarning = false;

      vm.showPqePosOutput = false;

      vm.lat = "";
      vm.lon = "";
      vm.hgt = "";
      vm.hgtMsl = "";
      vm.imageX = "";
      vm.imageY = "";

      imageSpaceService.pqeClear();
    };

    var pqeObj = {};
    $scope.$on("pqe: updated", function(event, data) {
      pqeObj = data[0];

      if (pqeObj.pqe.pqeValid) {
        vm.showPqeOutput = true;

        vm.pqeMessage =
          "The information below illustrates the position of the clicked point in the map.  The cyan point and ellipsis around it display the probabilty of error for the point calculation.";
        vm.ce = pqeObj.pqe.CE.toFixed(4);
        vm.le = pqeObj.pqe.LE.toFixed(4) + " m";
        vm.sma = pqeObj.pqe.SMA.toFixed(4);
        vm.smi = pqeObj.pqe.SMI.toFixed(4) + " m";
        vm.az = pqeObj.pqe.AZ.toFixed(4) + " deg";
        vm.projType = pqeObj.pqe.projType;
        vm.surfaceName = pqeObj.pqe.surfaceName;
        vm.lvl = pqeObj.pqe.probabilityLevel.toFixed(1) + "P";
      } else {
        vm.showPqeWarning = true;
        vm.pqeMessage = "";
      }

      vm.showPqePosOutput = true;

      vm.lat = pqeObj.lat.toFixed(7);
      vm.lon = pqeObj.lon.toFixed(7);
      vm.hgt = pqeObj.hgt.toFixed(4);
      vm.hgtMsl = pqeObj.hgtMsl.toFixed(4) + " m";
      vm.imageX = pqeObj.x.toFixed(4);
      vm.imageY = pqeObj.y.toFixed(4);
    });

    // End Position Quality Evaluator Section

    vm.screenshot = function() {
      imageSpaceService.screenshot();
    };
    vm.viewMetadata = function(image) {
      var url =
        $stateParams.wfsRequestUrl +
        "?filter=in(" +
        image.imageId +
        ")&" +
        "request=GetFeature&" +
        "service=WFS&" +
        "typeName=omar:raster_entry&" +
        "version=1.1.0" +
        "&outputFormat=JSON";
      window.open(url);
    };
    vm.zoomToFullExtent = function() {
      imageSpaceService.zoomToFullExtent();
    };
    vm.zoomToFullRes = function() {
      imageSpaceService.zoomToFullRes();
    };
  }
})();
