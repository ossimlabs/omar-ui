(function() {
  "use strict";
  angular
    .module("omarApp")
    .controller("SplashController", ['$uibModal', '$log', 'stateService', '$stateParams', '$timeout', SplashController]);

  function SplashController($uibModal, $log, stateService, $stateParams, $timeout) {
    // #################################################################################
    // AppO2.APP_CONFIG is passed down from the .gsp, and is a global variable.  It
    // provides access to various client params in application.yml
    // #################################################################################
    //console.log('AppO2.APP_CONFIG in SplashController: ', AppO2.APP_CONFIG);

    /* jshint validthis: true */
    var vm = this;

    var splashModalObj = {
      header: AppO2.APP_CONFIG.params.misc.splashModal.header,
      message: AppO2.APP_CONFIG.params.misc.splashModal.message
    }

    vm.open = function (splashModalObj) {

      var modalInstance = $uibModal.open({
        animation: true,
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

    function SplashModalController($uibModalInstance, splashModalObj) {

      var vm = this;

      vm.splashModalHeader = splashModalObj.header;
      vm.splashModalMessage = splashModalObj.message;

      vm.ok = function() {
        $uibModalInstance.close();
      }

    }

    // Using Angular's $timeout directive here to allow the $stateParams service to load the
    // associated object via a very slight pause.  Otherwise, the $stateParams object will
    // be undefined
    $timeout(function() {

      // The $stateParams.showModalSplash is a string, therefore if it is undefined we will
      // set it to a string value of 'true'.  We use it in the if check below to see if we
      // need to show the modal.
      //
      // The modal only needs to be displayed the initial time the user attempts to access
      // the O2 application.  Most of the time this will be through the Home, or Search pages.
      // However, if a user shares the imageSpace page we need to show the modal to the shared
      // user, because it will be the first time they enter the application
      var showModalSplashStateParam = $stateParams.showModalSplash || 'true';

      if(AppO2.APP_CONFIG.params.misc.splashModal.enabled && showModalSplashStateParam === 'true'){

        // Displays the splash modal
        vm.open(splashModalObj);

      }

    });

  }

})();
