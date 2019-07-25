"use strict";
angular
    .module("omarApp")
    .controller("ReachbackController", [
        "stateService",
        "$scope",
        "$stateParams",
        "toastr",

        function (
            stateService,
            $scope,
            $stateParams,
            toastr
        ) {

            /* jshint validthis: true */
            let vm = this;
            vm.userPreferences = AppO2.APP_CONFIG.userPreferences.o2SearchPreference;
            vm.urlParams = $stateParams;

            // Reachback will be hidden if value is false in application.yml
            vm.reachbackEnabled = AppO2.APP_CONFIG.params.reachbackEnabled;

            // Reachback URL for retrieving json data from reachback
            let reachbackUrl = AppO2.APP_CONFIG.params.reachbackUrl;

            let mapVisibility = vm.urlParams.mapVisibility == "true" || vm.userPreferences.mapVisibility;
            if (!mapVisibility && !vm.urlParams.mapSearch) {
                setTimeout(function () {
                    $("a:contains('Filters')").trigger("click");
                }, 10);
            }

            let sensorIDTemp = false;
            let sensorSame = false;

            vm.switchCheckDown = function() {
                sensorIDTemp = vm.sensorIdCheck;
                setTimeout(function() {
                    sensorSame = sensorIDTemp === vm.sensorIdCheck;
                    sensorIDTemp = vm.sensorIdCheck; }, 10);
            }

            vm.doUpdateOnNoChange = function() {
                if (sensorSame && vm.sensorId != '')
                    vm.updateFilterString();
                else
                    vm.sensorIdCheck = sensorIDTemp;
            }

            vm.setDataListValue = function(idCheck, input, datalist) {
                let inputElement = $('#' + input);
                let value = document.getElementById(input).value;
                let list = document.getElementById(datalist).options;
                $.each(list, function(index, option) {
                    if (value === option.value) {
                        vm[idCheck] = true;
                        inputElement.blur();
                        return;
                    }
                })
            }

            // Hide the reachback panel initially
            $('.JSONPanel').hide();

            // Initialise the cards panel to be selected
            $( '#button0' ).removeClass();
            $( '#button0' ).addClass("reachbackTabButtonClicked");

            let filterString = "";
            let filterArray = [];

            vm.initDataTypes = function () {
                let types = [
                    { key: "imagery", urlParam: "imagery" },
                ];
                $.each(types, function (index, value) {
                    vm[value.key + "Check"] = vm.userPreferences[value.key + "Enabled"];
                    let urlParam = vm.urlParams[value.urlParam];
                    if (urlParam) {
                        vm[value.key + "Check"] = urlParam == "true";
                    }
                });
            }

            vm.initKeywords = function (reset) {
                let arrays = [
                    { key: "sensorId", urlParam: "sensors" },
                ];
                $.each(arrays, function (index, keyword) {
                    vm[keyword.key + "Check"] = vm.userPreferences[keyword.key + "Enabled"];
                    let value = vm.userPreferences[keyword.key];
                    if (vm.urlParams[keyword.urlParam]) {
                        vm[keyword.key + "Check"] = true;
                        value = decodeURIComponent(vm.urlParams[keyword.urlParam]);
                    }
                    if (reset) {
                        vm[keyword.key + "Check"] = false;
                        value = null;
                    }
                    vm[keyword.key] = value ? value : '';
                });
            };

            vm.initRanges = function (reset) {
                let ranges = [
                    { key: "predNiirs", max: 9, min: 0, urlParam: "niirs" },
                ];
                $.each(ranges, function (index, range) {
                    vm[range.key + "Check"] =
                        vm.userPreferences[range.urlParam + "Enabled"];
                    vm[range.key + "Min"] = vm.userPreferences[range.urlParam + "Min"];
                    vm[range.key + "Max"] = vm.userPreferences[range.urlParam + "Max"];
                    if (vm.urlParams[range.urlParam]) {
                        vm[range.key + "Check"] = true;
                        let values = vm.urlParams[range.urlParam].split(":");
                        vm[range.key + "Min"] = values[0];
                        vm[range.key + "Max"] = values[1];
                    }
                    if (reset) {
                        vm[range.key + "Check"] = false;
                        vm[range.key + "Min"] = range.min;
                        vm[range.key + "Max"] = range.max;
                    }
                });
                vm.predMaxFeatures = 0;
                vm.predMaxCheck = false;
            };

            vm.initTemporal = reset => {
                vm.currentDateType = vm.dateTypes.find(function (element) {
                    return element.value == vm.userPreferences.dateType;
                });
                if (vm.urlParams.dateType) {
                    vm.currentDateType = vm.dateTypes.find(function (element) {
                        return element.value == vm.urlParams.dateType;
                    });
                }
                if (reset) {
                    vm.currentDateType = vm.dateTypes[0];
                }

                vm.currentTemporalDuration = vm.temporalDurations.find(function (element) {
                    return element.value == vm.userPreferences.duration;
                });
                if (vm.urlParams.duration) {
                    vm.currentTemporalDuration = vm.temporalDurations.find(function (
                        element
                    ) {
                        return element.value == vm.urlParams.duration;
                    });
                }
                if (reset) {
                    vm.currentTemporalDuration = vm.temporalDurations[0];
                }

                vm.customDateRangeVisible = false;

                vm.setInitialCustomStartDate();
                vm.setInitialCustomEndDate();
            };

            vm.dateTypes = [
                { label: "Acquisition Date", value: "acquisition_date" },
            ];

            // Strings of dates for constructing the duration, available for user selection
            let dateToday = moment().format("YYYY-MM-DD") + 'T00:00:00';
            let dateTodayEnd = moment().format("YYYY-MM-DD") + 'T23:59:00';
            let dateYesterday = moment().subtract(1, "days").format("YYYY-MM-DD")+ 'T00:00:00';
            let dateYesterdayEnd = moment().subtract(1, "days").format("YYYY-MM-DD") + 'T23:59:00';
            let dateLast3Days = moment().subtract(2, "days").format("YYYY-MM-DD") + 'T00:00:00';
            let dateLast7Days = moment().subtract(7, "days").format("YYYY-MM-DD") + 'T00:00:00';
            let dateThisMonth = moment().subtract(1, "months").format("YYYY-MM-DD") + 'T00:00:00';
            let dateLast3Months = moment().subtract(3, "months").format("YYYY-MM-DD") + 'T00:00:00';
            let dateLast6Months = moment().subtract(6, "months").format("YYYY-MM-DD") + 'T00:00:00';

            // The durations available to be selected by the user
            vm.temporalDurations = [
                { label: "None", value: "none", fromDate: "", toDate: "" },
                { label: "Today", value: "lastDay", fromDate: dateToday, toDate: dateTodayEnd },
                { label: "Yesterday", value: "yesterday", fromDate: dateYesterday, toDate: dateYesterdayEnd },
                { label: "Last 3 Days", value: "last3Days", fromDate: dateLast3Days, toDate: dateTodayEnd },
                { label: "Last Week", value: "last7Days", fromDate: dateLast7Days, toDate: dateTodayEnd },
                { label: "Last Month", value: "lastMonth", fromDate: dateThisMonth, toDate: dateTodayEnd },
                { label: "Last 3 Months", value: "last3Months", fromDate: dateLast3Months, toDate: dateTodayEnd },
                { label: "Last 6 Months", value: "last6Months", fromDate: dateLast6Months, toDate: dateTodayEnd },
                { label: "Custom Date Range", value: "customDateRange", fromDate: "", toDate: "" }
            ];

            vm.customDateRangeVisible = false;

            vm.showCustomDateRange = function () {
                vm.customDateRangeVisible = true;
            };

            vm.setInitialCustomStartDate = function () {
                if (
                    vm.userPreferences.customStartDateTime &&
                    vm.userPreferences.duration == "customDateRange"
                ) {
                    vm.startDate = moment(vm.userPreferences.customStartDateTime).format(
                        "YYYY-MM-DD"
                    );
                } else {
                    vm.startDate = moment()
                        .startOf("day")
                        .format("YYYY-MM-DD");
                }
                if (vm.urlParams.startDate) {
                    vm.currentTemporalDuration = vm.temporalDurations.find(function (
                        element
                    ) {
                        return element.value == "customDateRange";
                    });
                    vm.startDate = moment(vm.urlParams.startDate).format("YYYY-MM-DD");
                }
            };

            vm.openStartDatePopup = function () {
                vm.startDatePopupOpen = true;
            };

            vm.setInitialCustomEndDate = function () {
                if (
                    vm.userPreferences.customEndDateTime &&
                    vm.userPreferences.duration == "customDateRange"
                ) {
                    vm.endDate = moment(vm.userPreferences.customEndDateTime).format(
                        "YYYY-MM-DD"
                    );
                } else {
                    vm.endDate = moment()
                        .endOf("day")
                        .format("YYYY-MM-DD");
                }
                if (vm.urlParams.endDate) {
                    vm.currentTemporalDuration = vm.temporalDurations.find(function (
                        element
                    ) {
                        return element.value == "customDateRange";
                    });
                    vm.endDate = moment(vm.urlParams.endDate).format("YYYY-MM-DD");
                }
            };
            vm.openEndDatePopup = function () {
                vm.endDatePopupOpen = true;
            };

            vm.getCustomStartDate = function () {
                return moment(vm.startDate).format("YYYY_MM_DD") + 'T' +  moment(vm.startDate).format("HH:mm:ss");
            };

            vm.getCustomEndDate = function () {
                return moment(vm.endDate).format("YYYY_MM_DD") + 'T' + moment(vm.endDate).format("HH:mm:ss");
            };

            vm.updateFilterString = function () {
                filterArray = [];
                let temporalParam = vm.currentTemporalDuration;

                // Feed the switch statement from the value of the currently selected date range
                switch (temporalParam.value) {
                    case "none":
                        vm.customDateRangeVisible = false;
                        break;
                    case "customDateRange":
                        vm.maxEndDate = new Date();
                        vm.customDateRangeVisible = true;
                        filterArray.push('startDate=' + vm.getCustomStartDate() + '&endDate=' + vm.getCustomEndDate());
                        break;
                    default:
                        vm.customDateRangeVisible = false;
                        filterArray.push('startDate=' + temporalParam.fromDate + '&endDate=' + temporalParam.toDate);
                        break;
                }

                function pushKeywordToArray(dbName, formField) {
                    let clause = "";
                    if ( dbName === "sensors" ) {
                        let clauses = [];
                        $.each(formField, function (index, value) {
                            clauses.push(dbName + "=" + value.trim());
                        });
                        clause = clauses.join(" OR ");
                    } else {
                        clause = [dbName + "=", formField.trim()].join("");
                    }

                    filterArray.push(clause);
                }

                // Keywords
                if (vm.sensorIdCheck && vm.sensorId.length != 0) {
                    pushKeywordToArray("sensors", vm.sensorId.split(','));
                } else if (vm.sensorId.length === 0) {
                    vm.sensorIdCheck = false;
                }

                function pushRangeToArray(dbName, formFieldValue) {
                    let val = parseFloat(formFieldValue);

                    /**
                     * Check to see if the user has exceeded the min or max ranges of the
                     * current range filter
                     */
                    let toastErrorOptions = {
                        positionClass: "toast-bottom-left",
                        closeButton: true,
                        timeOut: 5000,
                        extendedTimeOut: 5000,
                        target: "body"
                    };
                    if (isNaN(val)) {
                        toastr.error(`Please check the allowable ranges, and enter a valid value for the ${dbName.toUpperCase()} range filter.`, 'Error', toastErrorOptions);
                        return;
                    } else {
                        filterArray.push(dbName + "=" + val);
                    }
                }

                // Ranges
                if (vm.predMaxCheck && vm.predMaxFeatures > 0)
                    pushRangeToArray("maxFeatures", vm.predMaxFeatures);

                if (vm.predNiirsCheck)
                    pushRangeToArray("niirs", vm.predNiirsMin);

                filterString = filterArray.join("&");

                // Commented this out until we figure out if we can add cards lists for reachback
                // wfsService.updateAttrFilter(filterString);

                vm.getReachbackJSON(filterString);
            };

            vm.predMaxFeatures = 0;
            vm.predMaxCheck = false;

            $scope.itemsPerPage = 10;
            $scope.currentPageNumber = 1;
            let startPageIndex = ($scope.currentPageNumber - 1) * $scope.itemsPerPage;
            let endPageIndex = (startPageIndex + $scope.itemsPerPage - 1);

            // Takes in a string filter as a parameter and makes an ajax jquery call
            // to GET from omar-reachback. Upon success, call vm.populateReachbackTextArea
            // to append/replace the current text area child with the json data
            vm.getReachbackJSON = function(filter) {
                let reachbackSearchUrl = reachbackUrl + filter;
                $.ajax({
                    url: reachbackSearchUrl,
                    dataType: 'json',
                    success: function (json) {
                        $scope.reachbackResponse = json;
                        vm.sortByFilter();
                        $scope.$apply();
                    }
                });
            }

            vm.setPage = function() {
                startPageIndex = ($scope.currentPageNumber - 1) * $scope.itemsPerPage;
                endPageIndex = (startPageIndex + $scope.itemsPerPage - 1);
                $scope.currentPage = $scope.sortedCopy.slice(startPageIndex, endPageIndex + 1);
            }

            $scope.sortFilter = "";

            vm.sortByFilter = function() {
                $scope.sortedCopy = Object.assign([], $scope.reachbackResponse);
                if ($scope.sortFilter === "") {
                    vm.setPage();
                    return;
                }
                $scope.sortedCopy.sort(function(a, b) {
                    if (a[$scope.sortFilter] === null)
                        return  1;
                    else if (b[$scope.sortFilter] === null)
                        return -1;
                    let x = a[$scope.sortFilter].toLowerCase();
                    let y = b[$scope.sortFilter].toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                });
                vm.setPage();
            }

            vm.initKeywords();
            vm.initRanges();
            vm.initTemporal();

            vm.setInitialCustomStartDate();
            vm.setInitialCustomEndDate();

            vm.initDataTypes();

            vm.updateFilterString();

            vm.clearFilters = () => {
                vm.initKeywords(true);
                vm.initRanges(true);
                vm.initTemporal(true);

                vm.setInitialCustomStartDate();
                vm.setInitialCustomEndDate();

                vm.updateFilterString();
            };

            vm.closeFilterDropdown = function (e) {
                let elem = "." + e;
                $(elem).dropdown("toggle");
            };
        }
    ]);
