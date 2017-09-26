(function(){
  'use strict';
  angular
    .module('omarApp')
    .controller('NavController', ['$log', 'stateService', '$scope', NavController]);

  function NavController($log, stateService, $scope) {

    // #################################################################################
    // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
    // provides access to various client params in application.yml
    // #################################################################################
    $log.debug('AppO2.APP_CONFIG in NavController: ', AppO2.APP_CONFIG);

      var vm = this;
      /* jshint validthis: true */

    $scope.$on('navState.updated', function(event, params) {

      vm.titleLeft = params.titleLeft;

      if ( params.userGuideUrl && vm.userGuideEnabled ) {
        var base = AppO2.APP_CONFIG.params.userGuide.baseUrl;
        vm.userGuideLink = base + params.userGuideUrl;
      }

    });

    vm.userShow = true;
    vm.userName = AppO2.APP_CONFIG.userInfo.name;
    $log.debug(`vm.userName = ${vm.userName}`);

    // Show/Hide the Metrics dropdown menu
    vm.metricsShow = AppO2.APP_CONFIG.params.misc.metrics.enabled;

    // Show/hide the User section of the Metrics dropdown menu
    vm.metricsUserShow = AppO2.APP_CONFIG.params.misc.metrics.user.enabled;

    // Metrics dropdown menu User settings
    vm.metricsEurekaUrl = AppO2.APP_CONFIG.params.misc.metrics.user.eureka.baseUrl;
    vm.metricsEurekaEnabled = AppO2.APP_CONFIG.params.misc.metrics.user.eureka.enabled;

    // Show/hide the Admin section of the Metrics dropdown menu
    // TODO: Show/Hide with Spring Security instead of through application.yaml
    vm.metricsAdminShow = AppO2.APP_CONFIG.params.misc.metrics.admin.enabled;

    // Metrics dropdown menu Admin settings
    vm.metricsHystrixTurbineUrl = AppO2.APP_CONFIG.params.misc.metrics.admin.hystrixTurbine.baseUrl;
    vm.metricsHystrixTurbineEnabled = AppO2.APP_CONFIG.params.misc.metrics.admin.hystrixTurbine.enabled;

    vm.metricsSleuthZipkinUrl = AppO2.APP_CONFIG.params.misc.metrics.admin.sleuthZipkin.baseUrl;
    vm.metricsSleuthZipkinEnabled = AppO2.APP_CONFIG.params.misc.metrics.admin.sleuthZipkin.enabled;

    vm.metricsKibanaUrl = AppO2.APP_CONFIG.params.misc.metrics.admin.kibana.baseUrl;
    vm.metricsKibanaEnabled = AppO2.APP_CONFIG.params.misc.metrics.admin.kibana.enabled;

    // Show/hide the About dropdown menu
    vm.aboutShow = AppO2.APP_CONFIG.params.misc.about.enabled;

    // About dropdown menu settings
    vm.aboutMessage = AppO2.APP_CONFIG.params.misc.about.message;
    vm.aboutReleaseName = AppO2.APP_CONFIG.params.misc.about.releaseName;
    vm.aboutReleaseNumber = AppO2.APP_CONFIG.params.misc.about.releaseNumber;
    vm.aboutUiBuildVersion = AppO2.APP_CONFIG.params.misc.about.uiBuildVersion;

    vm.apiAppEnabled = AppO2.APP_CONFIG.params.apiApp.enabled;
    if (vm.apiAppEnabled) {
      vm.apiAppLink = AppO2.APP_CONFIG.params.apiApp.baseUrl;
    }

    vm.piwikAppEnabled = AppO2.APP_CONFIG.params.piwikApp.enabled;
    if (vm.piwikAppEnabled) {
      vm.piwikAppLink = AppO2.APP_CONFIG.params.piwikApp.baseUrl;
    }

    vm.kmlAppEnabled = AppO2.APP_CONFIG.params.kmlApp.enabled;
    if (vm.kmlAppEnabled) {
      vm.kmlAppLink = AppO2.APP_CONFIG.params.kmlApp.baseUrl + "/superOverlay/getLastImagesKml";
    }

    vm.tlvAppEnabled = AppO2.APP_CONFIG.params.tlvApp.enabled;
    if (vm.tlvAppEnabled) {
        var tlvBaseUrl =stateService.omarSitesState.url.base;
        var tlvContextPath = stateService.omarSitesState.url.tlvContextPath;
        vm.tlvAppLink = tlvBaseUrl + tlvContextPath;
    }

    vm.userGuideEnabled = AppO2.APP_CONFIG.params.userGuide.enabled;
    if (vm.userGuideEnabled) {
      vm.userGuideLink = AppO2.APP_CONFIG.params.userGuide.baseUrl;
    }
  }
})();
