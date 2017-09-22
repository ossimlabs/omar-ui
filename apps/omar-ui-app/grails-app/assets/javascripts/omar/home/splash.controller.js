(function() {
  "use strict";
  angular
    .module("omarApp")
    .controller("SplashController", ['$uibModal', '$log', 'stateService', SplashController]);

  function SplashController($uibModal, $log, stateService) {
    // #################################################################################
    // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
    // provides access to various client params in application.yml
    // #################################################################################
    //console.log('AppO2.APP_CONFIG in SplashController: ', AppO2.APP_CONFIG);

    /* jshint validthis: true */
    var vm = this;

    vm.animationsEnabled = true;

    var splashModalObj = {
      header: AppO2.APP_CONFIG.params.misc.splashModal.header,
      message: AppO2.APP_CONFIG.params.misc.splashModal.message
    }

    vm.open = function (splashModalObj) {

      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        backdrop: 'static',
        windowClass: 'center-modal',
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'splashModalContent.html',
        controller: ['$uibModalInstance', 'splashModalObj', SplashModalController],
        controllerAs: 'vm',
        resolve: {
          splashModalObj: function() {
            return splashModalObj;
          }
        }
      });

    }
    if(AppO2.APP_CONFIG.params.misc.splashModal.enabled){
      vm.open(splashModalObj);
    }

    function SplashModalController($uibModalInstance, splashModalObj){

      var vm = this;

      vm.splashModalHeader = splashModalObj.header;
      vm.splashModalMessage = splashModalObj.message;

      vm.ok = function() {
        $uibModalInstance.close();
      }

    }

  }

})();
