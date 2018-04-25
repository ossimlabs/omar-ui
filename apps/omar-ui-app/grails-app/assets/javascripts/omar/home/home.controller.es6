(function() {
  "use strict";
  angular
    .module("omarApp")
    .controller("HomeController", [
      "$log",
      "stateService",
      "$window",
      "toastr",
      HomeController
    ]);

  function HomeController($log, stateService, $window, toastr) {
    // #################################################################################
    // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
    // provides access to various client params in application.yml
    // #################################################################################
    //$log.log('AppO2.APP_CONFIG in HomeController: ', AppO2.APP_CONFIG);

    // set header title
    stateService.navStateUpdate({
      titleLeft: "<h3>Welcome!</h3>",
      userGuideUrl: " "
    });

    /* jshint validthis: true */
    var vm = this;

    vm.title = "Image Discovery and Analysis";
    vm.motd = AppO2.APP_CONFIG.params.misc.motd.message;
    vm.showMotd = AppO2.APP_CONFIG.params.misc.motd.enabled;

    vm.baseUrl = AppO2.APP_CONFIG.serverURL;

    vm.apiAppEnabled = AppO2.APP_CONFIG.params.apiApp.enabled;
    if (vm.apiAppEnabled) {
      vm.apiAppLink = AppO2.APP_CONFIG.params.apiApp.baseUrl;
    }

    vm.kmlAppEnabled = AppO2.APP_CONFIG.params.kmlApp.enabled;
    if (vm.kmlAppEnabled) {
      var kmlBaseUrl = stateService.omarSitesState.url.base;
      var kmlContextPath = stateService.omarSitesState.url.kmlContextPath;
      vm.kmlAppLink =
        kmlBaseUrl + kmlContextPath + "/superOverlay/getLastImagesKml";
    }

    let geoscriptBaseUrl = stateService.omarSitesState.url.base;
    let geoscriptContextPath =
      stateService.omarSitesState.url.geoscriptContextPath;

    vm.geoRssCcAppLink =
      geoscriptBaseUrl + geoscriptContextPath + "/georss?cc=";

    vm.geoRssBeNumbAppLink =
      geoscriptBaseUrl + geoscriptContextPath + "/georss?be=";

    vm.geoRssType = "countryCode"; // initial geoRSS type
    vm.geoRssPlaceHolder = "code"; // initial geoRSS input placeholder
    vm.geoRssInput = ""; // initial geoRss input value

    vm.handleGeoRssPlaceholderChange = () => {
      if (vm.geoRssType === "countryCode") {
        vm.geoRssPlaceHolder = "code";
      } else if (vm.geoRssType === "beNumber") {
        vm.geoRssPlaceHolder = "number";
      }
    };

    vm.handleSelectedGeoRssType = () => {
      if (vm.geoRssType === "countryCode") {
        // If the geoRssInput is being passed we will get the associated CC value and
        // create the feed
        if (vm.geoRssInput !== "") {
          // We need to get the country code from the input
          $window.open(
            vm.geoRssCcAppLink + vm.geoRssInput.trim().toUpperCase(),
            "_blank"
          );
        } else {
          // If the user tries to create the rss without supplying a CC
          // code we will show a warning
          toastr.warning(
            "Please enter a Country Code to create the GeoRSS feed",
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
      } else if (vm.geoRssType === "beNumber") {
        // If the geoRssInput is being passed we will get the associated BE value and
        // create the feed
        if (vm.geoRssInput !== "") {
          // We need to get the BE number from the input
          $window.open(
            vm.geoRssBeNumbAppLink + vm.geoRssInput.trim(),
            "_blank"
          );
        } else {
          // If the user tries to create the rss without supplying a BE
          // number we will show a warning
          toastr.warning(
            "Please enter a BE Number to create the GeoRSS feed",
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
      }
    };

    vm.tlvAppEnabled = AppO2.APP_CONFIG.params.tlvApp.enabled;
    if (vm.tlvAppEnabled) {
      var tlvBaseUrl = stateService.omarSitesState.url.base;
      var tlvContextPath = stateService.omarSitesState.url.tlvContextPath;
      vm.tlvAppLink = tlvBaseUrl + tlvContextPath;
    }

    var twofishProxy = AppO2.APP_CONFIG.params.twofishes.proxy;

    vm.go = function(url) {
      console.log(url);

      $window.open(url);
    };
  }
})();
