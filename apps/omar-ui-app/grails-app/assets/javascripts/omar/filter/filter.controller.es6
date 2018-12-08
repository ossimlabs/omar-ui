(function() {
  "use strict";
  angular
    .module("omarApp")
    .controller("FilterController", [
      "stateService",
      "$http",
      "$scope",
      "wfsService",
      "mapService",
      "$stateParams",
      "$window",
      "toastr",
      "$log",
      FilterController
    ]);

  function FilterController(
    stateService,
    $http,
    $scope,
    wfsService,
    mapService,
    $stateParams,
    $window,
    toastr,
    $log
  ) {
    /* jshint validthis: true */
    var vm = this;
    vm.userPreferences = AppO2.APP_CONFIG.userPreferences.o2SearchPreference;
    vm.urlParams = $stateParams;

    vm.getCountryListing = function() {
        var baseUrl = stateService.omarSitesState.url.base;
        var contextPath = stateService.omarSitesState.url.wfsContextPath;
        var url = baseUrl + contextPath + "/wfs//getFeature";
        var params = {
            outputFormat: "JSON",
            resultType: "results",
            request: "GetFeature",
            service: "WFS",
            typeName: "omar:country_code",
            version: "1.1.0"
        };

        $http({
          method: "GET",
          url: url + "?" + $.param( params )
        }).then(function( response ) {
            var values = response.data.features.map( function( feature ) {
                return feature.properties;
            });
          $scope[ "countryListing" ] = values;
        });
    }


    vm.showCurrentFilter = true;
    vm.listRefreshButtonVisible =
      AppO2.APP_CONFIG.params.misc.listRefreshButtonVisible;
    vm.refreshSpin = false;
    vm.refreshList = function() {
      wfsService.executeWfsQuery();
      vm.refreshSpin = true;
    };

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
    });

    $scope.$on("wfs features: updated", function(event, features) {
      // Update the total feature count
      $scope.$apply(function() {
        vm.wfsFeatures = features;
        if (features != undefined) {
          vm.wfsFeaturesTotalPaginationCount = Math.min(
            vm.totalPaginationCount,
            vm.wfsFeatures
          );
        }
        $window.document.activeElement.blur();
        // add a comma in-between every set of three numbers
        vm.totalWfsFeatures = features
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      });
    });

    var stagerBaseUrl, stagerContextPath, stagerRequestUrl;

    // Initial state of the filter indicators
    function setInitialfilterIndicators() {
      vm.filterKeywordIndicator = false;
      vm.filterRangeIndicator = false;
      vm.filterSpatialIndicator = true;
      vm.filterTemporalIndicator = false;
    }
    setInitialfilterIndicators();

    function setfilterControllerUrlProps() {
      stagerBaseUrl = stateService.omarSitesState.url.base;
      stagerContextPath = stateService.omarSitesState.url.stagerContextPath;
      stagerRequestUrl =
        stagerBaseUrl +
        stagerContextPath +
        "/dataManager/getDistinctValues?property=";
    }

    $scope.$on("omarSitesState.updated", function(event, params) {
      setfilterControllerUrlProps();
    });

    var filterString = "";
    var filterArray = [];

    vm.currentAttrFilterArray = [];
    vm.currentSpatialFilter = "";

    vm.initSpatial = function() {
      vm.viewPortSpatial = true;
      vm.pointSpatial = false;
      vm.polygonSpatial = false;
    };

    $scope["missionIdTypes"] = [];
    $scope["sensorIdTypes"] = [];
    vm.getDistinctValues = function(property) {
      if (
        !$scope[property + "Types"] ||
        $scope[property + "Types"].length == 0
      ) {
        var url = stagerRequestUrl + property;
        $http({
          method: "GET",
          url: url
        }).then(function(response) {
          $scope[property + "Types"] = response.data;
        });
      }
    };

    function checkNoSpatialFilter() {
      // If we don't have any of the filters selected we will provide
      // a list of all the images.
      if (!vm.viewPortSpatial && !vm.pointSpatial && !vm.polygonSpatial) {
        mapService.viewPortFilter(false);
        setSpatialIndicator(false, "None");
      }
    }

    this.byViewPort = function(status) {
      // Turn on viewport
      mapService.viewPortFilter(status);

      // Turn off point
      vm.pointSpatial = false;
      mapService.pointFilter(vm.pointSpatial);

      // Turn off polygon
      vm.polygonSpatial = false;
      mapService.polygonFilter(vm.polygonSpatial);

      setSpatialIndicator(true, "View Port");
      checkNoSpatialFilter();
    };

    // Inital spatial filter is the View Port
    setSpatialIndicator(true, "View Port");

    this.byPointer = function(status) {
      // Turn on point
      mapService.pointFilter(status);

      // Turn off viewport
      vm.viewPortSpatial = false;
      mapService.viewPortFilter(vm.viewPortSpatial);

      // Turn off polygon
      vm.polygonSpatial = false;
      mapService.polygonFilter(vm.polygonSpatial);

      setSpatialIndicator(true, "Point");
      checkNoSpatialFilter();
    };

    this.byPolygon = function(status) {
      // Turn on polygons
      mapService.polygonFilter(status);

      // Turn off viewport
      vm.viewPortSpatial = false;
      mapService.viewPortFilter(vm.viewPortSpatial);

      // Turn off point
      vm.pointSpatial = false;
      mapService.pointFilter(vm.pointSpatial);

      setSpatialIndicator(true, "Polygon");
      checkNoSpatialFilter();
    };

    vm.initKeywords = function( reset ) {
        vm.countryCodeCheck = vm.userPreferences.countryCodeEnabled;
        var countryCode = vm.userPreferences.countryCode;
        if ( vm.urlParams.countryCode ) {
            vm.countryCodeCheck = true;
            countryCode = vm.urlParams.countryCode;
        }
        if ( reset ) {
            vm.countryCodeCheck = false;
            countryCode = null;
        }
        if ( countryCode ) {
            countryCode = countryCode.split( "," );
            countryCode.forEach( function( cc, index ) {
                countryCode[ index ] = { iso_a2: cc };
            });
        }
        vm.countryCode = countryCode || [];

        var arrays = [
            { key: "missionId", urlParam: "mission" },
            { key: "sensorId", urlParam: "sensor" }
        ];
        $.each( arrays, function( index, keyword ) {
            vm[ keyword.key + "Check" ] = vm.userPreferences[ keyword.key + "Enabled" ];
            var value = vm.userPreferences[ keyword.key ];
            if ( vm.urlParams[ keyword.urlParam ] ) {
                vm[ keyword.key + "Check" ] = true;
                value = vm.urlParams[ keyword.urlParam ];
            }
            if ( reset ) {
                vm[ keyword.key + "Check" ] = false;
                value = null;
            }
            vm[ keyword.key ] = value ? value.split( "," ) : [];
        });

        var strings = [
            { key: "beNumber", urlParam: "be" },
            { key: "filename", urlParam: "filename" },
            { key: "imageId", urlParam: "imageId" },
            { key: "targetId", urlParam: "target" },
            { key: "wacNumber", urlParam: "wac" }
        ];
        $.each( strings, function( index, keyword ) {
            vm[ keyword.key + "Check" ] = vm.userPreferences[ keyword.urlParam + "Enabled" ];
            vm[ keyword.key ] = vm.userPreferences[ keyword.urlParam ];
            if ( vm.urlParams[ keyword.urlParam ] ) {
                vm[ keyword.key + "Check" ] = true;
                vm[ keyword.key ] = vm.urlParams[ keyword.urlParam ];
            }
            if ( reset ) {
                vm[ keyword.key + "Check" ] = false;
                vm[ keyword.key ] = "";
            }
        });
    };

    vm.initRanges = function( reset ) {
        var ranges = [
            { key: "azimuth", max: 360, min: 0, urlParam: "azimuth" },
            { key: "grazeElev", max: 90, min: 0, urlParam: "elevation" },
            { key: "predNiirs", max: 9, min: 0, urlParam: "niirs" },
            { key: "sunAzimuth", max: 360, min: 0, urlParam: "sunAzimuth" },
            { key: "sunElevation", max: 90, min: -90, urlParam: "sunElevation" }
        ];
        $.each( ranges, function( index, range ) {
            vm[ range.key + "Check" ] = vm.userPreferences[ range.urlParam + "Enabled" ];
            vm[ range.key + "Min" ] = vm.userPreferences[ range.urlParam + "Min" ];
            vm[ range.key + "Max" ] = vm.userPreferences[ range.urlParam + "Max" ];
            if ( vm.urlParams[ range.urlParam ] ) {
                vm[ range.key + "Check" ] = true;
                var values = vm.urlParams[ range.urlParam ].split( ":" ); console.dir(values);
                vm[ range.key + "Min" ] = values[ 0 ];
                vm[ range.key + "Max" ] = values[ 1 ];
            }
            if ( reset ) {
                vm[ range.key + "Check" ] = false;
                vm[ range.key + "Min" ] = range.emin;
                vm[ range.key + "Max" ] = range.max;
            }
        });

        vm.cloudCoverCheck = vm.userPreferences.cloudCoverEnabled;
        vm.cloudCover = vm.userPreferences.cloudCoverMax;
        if ( vm.urlParams.cloudCover ) {
            vm.cloudCoverCheck = true;
            vm.cloudCover = vm.urlParams.cloudCover;
        }
        if ( reset ) {
            vm.cloudCoverCheck = false;
            vm.cloudCover = 100;
        }
        vm.cloudCoverCheckNull = false;
    };

    vm.initTemporal = reset => {
        var dateType = vm.dateTypes.find( function( element ) {
            return element.value == vm.userPreferences.dateType;
        });
        vm.currentDateType = dateType;
        if ( vm.urlParams.dateType ) {
            vm.currentDateType = vm.urlParams.dateType;
        }
        if ( reset ) {
            vm.currentDateType = vm.dateTypes[ 0 ];
        }

        var duration = vm.temporalDurations.find( function( element ) {
            return element.value == vm.userPreferences.duration;
        });
        vm.currentTemporalDuration = duration;
        if ( vm.urlParams.duration ) {
            vm.currentTemporalDuration = vm.urlParams.duration;
        }
        if ( reset ) {
            vm.currentTemporalDuration = vm.temporalDurations[ 0 ];
        }

        vm.customDateRangeVisible = false;

        vm.setInitialCustomStartDate();
        vm.setInitialCustomEndDate();
    };

    vm.dateTypes = [
        { label: "Acquisition Date", value: "acquisition_date" },
        { label: "Ingest Date", value: "ingest_date" }
    ];

    vm.temporalDurations = [
        { label: "None", value: "none" },
        { label: "Today", value: "lastDay" },
        { label: "Yesterday", value: "yesterday" },
        { label: "Last 3 Days", value: "last3Days" },
        { label: "Last Week", value: "last7Days" },
        { label: "Last Month", value: "lastMonth" },
        { label: "Last 3 Months", value: "last3Months" },
        { label: "Last 6 Months", value: "last6Months" },
        { label: "Custom Date Range", value: "customDateRange" }
    ];

    vm.customDateRangeVisible = false;

    vm.showCustomDateRange = function() {
      vm.customDateRangeVisible = true;
    };

    vm.setInitialCustomStartDate = function() {
        if ( vm.userPreferences.customStartDateTime && vm.userPreferences.duration == "customDateRange" ) {
            vm.startDate = moment( vm.userPreferences.customStartDateTime );
        }
        else {
            vm.startDate = moment().startOf("day");
        }
        if ( vm.urlParams.startDate ) {
            vm.currentTemporalDuration = vm.temporalDurations.find( function( element ) {
                return element.value == "customDateRange";
            });
            vm.startDate = moment( vm.urlParams.startDate );
        }
    };

    vm.setInitialCustomEndDate = function() {
        if ( vm.userPreferences.customEndDateTime && vm.userPreferences.duration == "customDateRange" ) {
            vm.endDate = moment( vm.userPreferences.customEndDateTime );
        }
        else {
            vm.endDate = moment().endOf("day");
        }
        if ( vm.urlParams.endDate ) {
            vm.currentTemporalDuration = vm.temporalDurations.find( function( element ) {
                return element.value == "customDateRange";
            });
            vm.endDate = moment( vm.urlParams.endDate );
        }
    };

    vm.getCustomStartDate = function() {
      return moment(vm.startDate).format("MM-DD-YYYY HH:mm:ss+0000");
    };

    vm.getCustomEndDate = function() {
      return moment(vm.endDate).format("MM-DD-YYYY HH:mm:ss+0000");
    };

    function setKeywordIndicator() {
      setTimeout(function() {
        $scope.$apply(function() {
          vm.filterKeywordIndicator = true;
        });
      }, 250);
    }

    function setRangesIndicator(show) {
      setTimeout(function() {
        $scope.$apply(function() {
          vm.filterRangeIndicator = show;
        });
      }, 250);
    }

    function setSpatialIndicator(show, type) {
      setTimeout(function() {
        $scope.$apply(function() {
          vm.filterSpatialIndicator = show;
          vm.currentSpatialFilter = `Spatial: ${type}`;
        });
      }, 250);
    }

    function setTemporalIndicator(show) {
      setTimeout(function() {
        $scope.$apply(function() {
          vm.filterTemporalIndicator = show;
        });
      }, 250);
    }

    vm.updateFilterString = function() {
      filterArray = [];
      vm.currentAttrFilterArray = [];

      var dateToday = moment().format("MM-DD-YYYY 00:00+0000");
      var dateTodayEnd = moment().format("MM-DD-YYYY 23:59+0000");
      var dateYesterday = moment()
        .subtract(1, "days")
        .format("MM-DD-YYYY 00:00+0000");
      var dateYesterdayEnd = moment()
        .subtract(1, "days")
        .format("MM-DD-YYYY 23:59+0000");
      var dateLast3Days = moment()
        .subtract(2, "days")
        .format("MM-DD-YYYY 00:00+0000");
      var dateLast7Days = moment()
        .subtract(7, "days")
        .format("MM-DD-YYYY 00:00+0000");
      var dateThisMonth = moment()
        .subtract(1, "months")
        .format("MM-DD-YYYY 00:00+0000");
      var dateLast3Months = moment()
        .subtract(3, "months")
        .format("MM-DD-YYYY 00:00+0000");
      var dateLast6Months = moment()
        .subtract(6, "months")
        .format("MM-DD-YYYY 00:00+0000");

      var dbName = vm.currentDateType.value; //"acquisition_date";
      var temporalParam = vm.currentTemporalDuration.value;

      let dateField =
        dbName === "ingest_date" ? "Ingest Date" : "Acquisition Date";

      // Feed the switch statement from the value of the currently selected date range
      switch (temporalParam) {
        case "none":
          setTemporalIndicator(false);
          vm.customDateRangeVisible = false;
          break;
        case "lastDay":
          setTemporalIndicator(true);
          vm.currentAttrFilterArray.push(`${dateField}: Today`);
          vm.customDateRangeVisible = false;
          filterArray.push(
            [
              dbName,
              ">='",
              dateToday,
              "'AND",
              dbName,
              "<='",
              dateTodayEnd,
              "'"
            ].join(" ")
          );
          break;
        case "yesterday":
          setTemporalIndicator(true);
          vm.currentAttrFilterArray.push(`${dateField}: Yesterday`);
          vm.customDateRangeVisible = false;
          filterArray.push(
            [
              dbName,
              ">='",
              dateYesterday,
              "'AND",
              dbName,
              "<='",
              dateYesterdayEnd,
              "'"
            ].join(" ")
          );
          break;
        case "last3Days":
          setTemporalIndicator(true);
          vm.customDateRangeVisible = false;
          vm.currentAttrFilterArray.push(`${dateField}: Last 3 Days`);
          filterArray.push(
            [
              dbName,
              ">='",
              dateLast3Days,
              "'AND",
              dbName,
              "<='",
              dateTodayEnd,
              "'"
            ].join(" ")
          );
          break;
        case "last7Days":
          setTemporalIndicator(true);
          vm.currentAttrFilterArray.push(`${dateField}: Last 7 Days`);
          vm.customDateRangeVisible = false;
          filterArray.push(
            [
              dbName,
              ">='",
              dateLast7Days,
              "'AND",
              dbName,
              "<='",
              dateTodayEnd,
              "'"
            ].join(" ")
          );
          break;
        case "lastMonth":
          setTemporalIndicator(true);
          vm.currentAttrFilterArray.push(`${dateField}: Last Month`);
          vm.customDateRangeVisible = false;
          filterArray.push(
            [
              dbName,
              ">='",
              dateThisMonth,
              "'AND",
              dbName,
              "<='",
              dateTodayEnd,
              "'"
            ].join(" ")
          );
          break;
        case "last3Months":
          setTemporalIndicator(true);
          vm.currentAttrFilterArray.push(`${dateField}: Last 3 Months`);
          vm.customDateRangeVisible = false;
          filterArray.push(
            [
              dbName,
              ">='",
              dateLast3Months,
              "'AND",
              dbName,
              "<='",
              dateTodayEnd,
              "'"
            ].join(" ")
          );
          break;
        case "last6Months":
          setTemporalIndicator(true);
          vm.currentAttrFilterArray.push(`${dateField}: Last Six Months`);
          vm.customDateRangeVisible = false;
          filterArray.push(
            [
              dbName,
              ">='",
              dateLast6Months,
              "'AND",
              dbName,
              "<='",
              dateTodayEnd,
              "'"
            ].join(" ")
          );
          break;
        case "customDateRange":
          setTemporalIndicator(true);
          vm.maxEndDate = new Date();
          vm.currentAttrFilterArray.push(
            `${dateField}: ` +
              vm.getCustomStartDate() +
              " to " +
              vm.getCustomEndDate()
          );
          vm.customDateRangeVisible = true;
          filterArray.push(
            [
              dbName,
              ">='",
              vm.getCustomStartDate(),
              "'AND",
              dbName,
              "<='",
              vm.getCustomEndDate(),
              "'"
            ].join(" ")
          );
          break;
        default:
          vm.customDateRangeVisible = false;
          break;
      }

      function pushKeywordToArray(dbName, formField) {
        $log.debug(`formField value: ${formField}`);
        var clause = "";
        if (dbName === "country_code" || dbName === "mission_id" || dbName === "sensor_id") {
          var clauses = [];
          $.each(formField, function(index, value) {
            clauses.push(dbName + " LIKE '%" + value.trim() + "%'");
          });
          clause = "(" + clauses.join(" OR ") + ")";
        } else {
          clause = [dbName + " LIKE '%", formField.trim(), "%'"].join("");
        }

        var placemarksConfig = AppO2.APP_CONFIG.params.misc.placemarks;

        if (dbName === "be_number" && placemarksConfig) {
          var subClause = clause.replace(
            "be_number",
            placemarksConfig.columnName
          );

          subClause = subClause.split("'").join("''");

          clause =
            "(" +
            clause +
            " or intersects(ground_geom, collectGeometries(queryCollection('" +
            placemarksConfig.tableName +
            "', '" +
            placemarksConfig.geomName +
            "', '" +
            subClause +
            "'))))";
        }

        filterArray.push(clause);
      }

      // Keywords
      if (vm.beNumberCheck && vm.beNumber != "") {
        vm.currentAttrFilterArray.push(`BE: ${vm.beNumber}`);
        pushKeywordToArray("be_number", vm.beNumber);
        setKeywordIndicator();
      } else if (!vm.beNumberCheck) {
        vm.filterKeywordIndicator = false;
      }

      if (vm.countryCodeCheck && vm.countryCode.length != 0) {
        vm.currentAttrFilterArray.push(`Country Code: ${vm.countryCode.map( function( country ) { return country.iso_a2 } ).join( "," )}`);
        pushKeywordToArray("country_code", vm.countryCode.map( function( country ) { return country.iso_a2 } ));
        setKeywordIndicator();
      } else if (!vm.countryCodeCheck) {
        vm.filterKeywordIndicator = false;
      } else if (vm.countryCode.length === 0) {
        vm.countryCodeCheck = false;
      }

      if (vm.filenameCheck && vm.filename != "") {
        vm.currentAttrFilterArray.push(`File: ${vm.filename}`);
        pushKeywordToArray("filename", vm.filename);
        setKeywordIndicator();
      } else if (!vm.filenameCheck) {
        vm.filterKeywordIndicator = false;
      }

      if (vm.imageIdCheck && vm.imageId != "") {
        vm.currentAttrFilterArray.push(`Image: ${vm.imageId}`);
        pushKeywordToArray("title", vm.imageId.toUpperCase());
        setKeywordIndicator();
      } else if (!vm.imageIdCheck) {
        vm.filterKeywordIndicator = false;
      }

      if (vm.missionIdCheck && vm.missionId.length != 0) {
        vm.currentAttrFilterArray.push(`Mission: ${vm.missionId}`);
        pushKeywordToArray("mission_id", vm.missionId);
        setKeywordIndicator();
      } else if (!vm.missionIdCheck) {
        vm.filterKeywordIndicator = false;
      } else if (vm.missionId.length === 0) {
        vm.missionIdCheck = false;
      }

      if (vm.sensorIdCheck && vm.sensorId.length != 0) {
        vm.currentAttrFilterArray.push(`Sensor: ${vm.sensorId}`);
        pushKeywordToArray("sensor_id", vm.sensorId);
        setKeywordIndicator();
      } else if (!vm.sensorIdCheck) {
        vm.filterKeywordIndicator = false;
      } else if (vm.sensorId.length === 0) {
        vm.sensorIdCheck = false;
      }

      if (vm.targetIdCheck && vm.targetId != "") {
        vm.currentAttrFilterArray.push(`Target: ${vm.targetId}`);
        pushKeywordToArray("target_id", vm.targetId);
        setKeywordIndicator();
      } else if (!vm.targetIdCheck) {
        vm.filterKeywordIndicator = false;
      }

      if (vm.wacNumberCheck && vm.wacNumber != "") {
        vm.currentAttrFilterArray.push(`WAC: ${vm.wacNumber}`);
        pushKeywordToArray("wac_code", vm.wacNumber);
        setKeywordIndicator();
      } else if (!vm.wacNumberCheck) {
        vm.filterKeywordIndicator = false;
      }

      function pushRangeToArray(dbName, formFieldMin, formFieldMax, showNull) {
        $log.debug(`showNull: ${showNull}`);
        let min, max, clause;

        min = parseFloat(formFieldMin);
        max = parseFloat(formFieldMax);

        /**
         * Check to see if the user has exceeded the min or max ranges of the
         * current range filter
         */
        if (isNaN(min)) {
          toastr.error(
            `Please check the allowable ranges, and enter a valid minimum value for the ${dbName.toUpperCase()} range filter.`,
            "Error",
            {
              positionClass: "toast-bottom-left",
              closeButton: true,
              timeOut: 5000,
              extendedTimeOut: 5000,
              target: "body"
            }
          );
          return;
        } else if (isNaN(max)) {
          toastr.error(
            `Please check the allowable ranges, and enter a valid maximum value for the ${dbName.toUpperCase()} range filter.`,
            "Error",
            {
              positionClass: "toast-bottom-left",
              closeButton: true,
              timeOut: 5000,
              extendedTimeOut: 5000,
              target: "body"
            }
          );
        } else if (min > max) {
          toastr.error(
            `Please make sure the minimum is less than the maximum for the ${dbName.toUpperCase()} range filter.`,
            "Error",
            {
              positionClass: "toast-bottom-left",
              closeButton: true,
              timeOut: 5000,
              extendedTimeOut: 5000,
              target: "body"
            }
          );
        } else if (showNull === true) {
          clause = `(( ${dbName} >= ${min} AND ${dbName} <= ${max} ) OR ${dbName} IS NULL)`;
          filterArray.push(clause);
        } else {
          $log.debug(
            "showNull, is not present, filtering without looking for NULL"
          );
          filterArray.push(
            [dbName, ">=", min, "AND", dbName, "<=", max].join(" ")
          );
        }
      }

      // Ranges
      if (vm.predNiirsCheck) {
        //validateRange(vm.predNiirsMin, vm.predNiirsMax);
        if (vm.predNiirsCheckNull) {
          vm.currentAttrFilterArray.push(
            `NIIRS between ${vm.predNiirsMin} and ${
              vm.predNiirsMax
            } (Show unknown values)`
          );
          pushRangeToArray("niirs", vm.predNiirsMin, vm.predNiirsMax, true);
        } else {
          vm.currentAttrFilterArray.push(
            `NIIRS between ${vm.predNiirsMin} and ${vm.predNiirsMax}`
          );
          pushRangeToArray("niirs", vm.predNiirsMin, vm.predNiirsMax);
        }
        setRangesIndicator(true);
      } else if (!vm.predNiirsCheck) {
        setRangesIndicator(false);
      }

      if (vm.azimuthCheck) {
        if (vm.azimuthCheckNull) {
          vm.currentAttrFilterArray.push(
            `Azimuth Angle between ${vm.azimuthMin} and ${
              vm.azimuthMax
            } (Show unknown values)`
          );
          pushRangeToArray("azimuth_angle", vm.azimuthMin, vm.azimuthMax, true);
        } else {
          vm.currentAttrFilterArray.push(
            `Azimuth Angle between ${vm.azimuthMin} and ${vm.azimuthMax}`
          );
          pushRangeToArray("azimuth_angle", vm.azimuthMin, vm.azimuthMax);
        }
        //setRangesIndicator(true);
      } else if (!vm.azimuthCheck) {
        //setRangesIndicator(false);
      }

      if (vm.grazeElevCheck) {
        if (vm.grazeElevCheckNull) {
          vm.currentAttrFilterArray.push(
            `Grazing Angle between ${vm.grazeElevMin} and ${
              vm.grazeElevMax
            } (Show unknown values)`
          );
          pushRangeToArray(
            "grazing_angle",
            vm.grazeElevMin,
            vm.grazeElevMax,
            true
          );
        } else {
          vm.currentAttrFilterArray.push(
            `Grazing Angle between ${vm.grazeElevMin} and ${vm.grazeElevMax}`
          );
          pushRangeToArray("grazing_angle", vm.grazeElevMin, vm.grazeElevMax);
        }
        //setRangesIndicator(true);
      } else if (!vm.grazeElevCheck) {
        //setRangesIndicator(false);
      }

      if (vm.sunAzimuthCheck) {
        if (vm.sunAzimuthCheckNull) {
          vm.currentAttrFilterArray.push(
            `Sun Azimuth between ${vm.sunAzimuthMin} and ${
              vm.sunAzimuthMax
            } (Show unknown values)`
          );
          pushRangeToArray(
            "sun_azimuth",
            vm.sunAzimuthMin,
            vm.sunAzimuthMax,
            true
          );
        } else {
          vm.currentAttrFilterArray.push(
            `Sun Azimuth between ${vm.sunAzimuthMin} and ${vm.sunAzimuthMax}`
          );
          pushRangeToArray("sun_azimuth", vm.sunAzimuthMin, vm.sunAzimuthMax);
        }
        //setRangesIndicator(true);
      } else if (!vm.sunAzimuthCheck) {
        //setRangesIndicator(false);
      }

      if (vm.sunElevationCheck) {
        if (vm.sunElevationCheckNull) {
          vm.currentAttrFilterArray.push(
            `Sun Elevation between ${vm.sunElevationMin} and ${
              vm.sunElevationMax
            } (Show unknown values)`
          );
          pushRangeToArray(
            "sun_elevation",
            vm.sunElevationMin,
            vm.sunElevationMax,
            true
          );
        } else {
          vm.currentAttrFilterArray.push(
            `Sun Elevation between ${vm.sunElevationMin} and ${
              vm.sunElevationMax
            }`
          );
          pushRangeToArray(
            "sun_elevation",
            vm.sunElevationMin,
            vm.sunElevationMax
          );
        }
        setRangesIndicator(true);
      } else if (!vm.sunElevationCheck) {
        vm.filterRangeIndicator = false;
      }

      if (vm.cloudCoverCheck) {
        if (isNaN(vm.cloudCover)) {
          toastr.error(
            "Please enter a valid number for the range filter.",
            "Error",
            {
              closeButton: true
            }
          );
        }
        if (vm.cloudCoverCheckNull) {
          vm.currentAttrFilterArray.push(
            `Cloud cover less than or equal to ${
              vm.cloudCover
            }% (Show unknown values)`
          );
          filterArray.push(
            "(cloud_cover <= " + vm.cloudCover + " OR cloud_cover IS NULL)"
          );
        } else {
          vm.currentAttrFilterArray.push(
            `Cloud cover less than or equal to ${vm.cloudCover}%`
          );
          filterArray.push("(cloud_cover <= " + vm.cloudCover + ")");
        }
        //setRangesIndicator(true);
      } else if (!vm.cloudCoverCheck) {
        //setRangesIndicator(false);
      }

      filterString = filterArray.join(" AND ");
      //vm.filterString = filterString;

      $log.debug(`filterString: `, filterString);
      wfsService.updateAttrFilter(filterString);
    };

    vm.initSpatial();
    vm.initKeywords();
    vm.initRanges();
    vm.initTemporal();

    vm.setInitialCustomStartDate();
    vm.setInitialCustomEndDate();

    vm.updateFilterString();

    let clearAllSpatialFilter = () => {
      vm.viewPortSpatial = false;
      vm.pointSpatial = false;
      vm.polygonSpatial = false;
      mapService.viewPortFilter(false);
      setSpatialIndicator(false, "None");
    };

    vm.clearFilters = () => {
      clearAllSpatialFilter();
      vm.initKeywords( true );
      vm.initRanges( true );
      vm.initTemporal( true );

      // Reset the temporal filters and it's menu
      //vm.currentTemporalDuration = vm.temporalDurations[0];
      //vm.customDateRangeVisible = false;
      //setTemporalIndicator(false);

      vm.setInitialCustomStartDate();
      vm.setInitialCustomEndDate();

      vm.currentAttrFilterArray = [];

      vm.updateFilterString();
    };

    vm.closeFilterDropdown = function(e) {
      var elem = "." + e;

      $(elem).dropdown("toggle");
    };
  }
})();
